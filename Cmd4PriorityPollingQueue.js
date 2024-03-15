'use strict';

// 3rd Party includes
const exec = require( "child_process" ).exec;


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;


// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

// Pretty Colors
var chalk = require( "chalk" );

let trueTypeOf = require( "./utils/trueTypeOf" );
let lcFirst = require( "./utils/lcFirst" );

// For changing validValue Constants to Values and back again
var { transposeConstantToValidValue,
      transposeValueToValidConstant,
      transposeBoolToValue
    } = require( "./utils/transposeCMD4Props" );


let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
let LOW_PRIORITY_GET = 2;

class Cmd4PriorityPollingQueue
{
   constructor( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, queueRetryCount = constants.DEFAULT_WORM_QUEUE_RETRY_COUNT )
   {
      this.log = log;

      // This works better for Unit testing
      settings.cmd4Dbg = log.debugEnabled;

      this.queueName = queueName;
      this.queueType = queueType;
      this.queueRetryCount = queueRetryCount;
      this.queueStarted = false;
      this.highPriorityQueue = [ ];
      this.lowPriorityQueue = [ ];
      this.lowPriorityQueueIndex = 0 ;
      this.inProgressGets = 0;
      this.inProgressSets = 0;

      this.listOfRunningPolls = {};

      // This is not a sanity timer.
      // This controls when it is safe to do a "Get" of the Aircon
      // after a failed condition. It does happen to fix the queue
      // when something is wrong, but this is not the purpose of
      // this timer.
      this.pauseTimer = null;
      this.lastGoodTransactionTime =  Date.now( );
      this.errorCountSinceLastGoodTransaction = 0;

      // - Not a const so it can be manipulated during unit testing
      this.pauseTimerTimeout = constants.DEFAULT_QUEUE_PAUSE_TIMEOUT;

      // The WoRm queue needs error messages to be silenced as
      // they are inevitable, but are handled through retries
      // By default non WoRm queues are allowed to echo errors

      if ( this.queueRetryCount == 0 || settings.debug )
         this.echoE = true;
      else
         this.echoE = true;

      this.changeQueueType( this, queueType );
   }

   echoRetryErrors( currentRetryCount )
   {
      // If debug then the default is true
      if ( settings.cmd4Debug )
         return true;

      // Since this is the last retry, echo the error
      if ( currentRetryCount == this.queueRetryCount )
         return true;

      return false;
   }

   // This function is called by homebridge to *PUT AN ENTRY INTO THE HIGHEST PRIORITY SET QUEUE*.
   // We immediately return success if the device is accessible. Either way the Set is attempted
   // above everything else except other SetValue requests.
   prioritySetValue( accTypeEnumIndex, characteristicString, timeout, stateChangeResponseTime,  value, homebridgeCallback )
   {
      // this is Accessory
      //
      //if ( settings.cmd4Dbg ) this.log.debug(`prioritySetValue, asked to set: ${ characteristicString } to ${ value }`);

      // Save the value to cache. The set will come later
      // this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, value );

      if ( this.errorValue != 0 )
      {
         if ( settings.cmd4Dbg ) this.log.debug(`prioritySetValue for ${ this.displayName }, homebridgeCallback returning error ${ this.errorValue } ${ this.errorString }`);
         homebridgeCallback( this.errorValue );
      } else
      {
         if ( settings.cmd4Dbg ) this.log.debug(`prioritySetValue for ${ this.displayName }, homebridgeCallback returning default success 0`);
         homebridgeCallback( 0 );
      }

      let newEntry = { [ constants.IS_SET_lv ]: true, [ constants.ACCESSORY_lv ]: this, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.CALLBACK_lv ]: homebridgeCallback, [ constants.VALUE_lv ]: value };

      // Determine where to put the entry in the queue
      if ( this.queue.highPriorityQueue.length == 0 )
      {
         // No entries, then it goes on top
         this.queue.highPriorityQueue.push( newEntry );

      } else {

         // Make sure that this is the latest "Set" of this entry
         let index = this.queue.highPriorityQueue.findIndex( ( entry ) => entry.accessory.uuid == this.uuid && entry.isSet == true && entry.accTypeEnumIndex == accTypeEnumIndex );

         if ( index == -1 )
         {
            // It doesn't exist in the queue, It needs to be placed after any "Sets".
            // First Determine the first "Get"
            let getIndex = this.queue.highPriorityQueue.findIndex( ( entry ) => entry.isSet == false );

            if ( getIndex == -1 )
            {
               // No "Get" entrys, it goes at the end after everything.
               this.queue.highPriorityQueue.push( newEntry );

            } else
            {
               // Insert before the first "Get" entry
               this.queue.highPriorityQueue.splice( getIndex, 0, newEntry );
            }
         } else
         {
            this.queue.highPriorityQueue[ index ] = newEntry;
         }
      }
      this.queue.processQueueFunc( HIGH_PRIORITY_SET, this.queue );
   }

   // This function is called by homebridge to *PUT AN ENTRY INTO THE HIGHEST PRIORITY GET QUEUE*.
   // We immediately return with success and the last known value if the device is accessible, otherwise
   // the last failure error code.
   // The Get is attempted no matter the devices availability. This is done after every Set
   // request and at the bottom of the hightPrioritySetValue queue, but above any polling.
   priorityGetValue( accTypeEnumIndex, characteristicString, timeout, homebridgeCallback )
   {
      // this is Accessory

      // if ( settings.cmd4Dbg ) this.log.debug(`priorityGetValue for ${ this.displayName }, asked to Get: ${ characteristicString }`);

      if ( this.errorValue != 0 )
      {
         // if ( settings.cmd4Dbg ) this.log.debug(`priorityGetValue for ${ this.displayName }, homebridgeCallback returning error ${ this.errorValue } ${ this.errorString}`);
         homebridgeCallback( this.errorValue );
      } else
      {
         // return the cached value
         let storedValue = this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex );

         // if ( settings.cmd4Dbg ) this.log.debug(`priorityGetValue for ${ this.displayName }, homebridgeCallback returning storedValue: ${ storedValue }`);
         homebridgeCallback( 0, storedValue );
      }

      if ( this.queue.queueType != constants.QUEUETYPE_WORM2 )
      {
         // When the value is returned, it will update homebridge
         this.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: true, [ constants.ACCESSORY_lv ]: this, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: homebridgeCallback } );

         this.queue.processQueueFunc( HIGH_PRIORITY_GET, this.queue );
      }
   }

   // This function is called by polling to *PUT AN ENTRY INTO THE LOW PRIORITY POLLING QUEUE*.
   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // These are all gets from polling
      accessory.queue.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

   }

   processHighPrioritySetQueue( entry )
   {
      if ( settings.cmd4Dbg ) this.log.debug( `Processing high priority queue "Set" entry: ${ entry.accTypeEnumIndex } length: ${ this.highPriorityQueue.length }` );

      this.inProgressSets ++;
      this.qSetValue( entry.accessory, entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, entry.value, function ( error )
      {

         let queue = entry.accessory.queue;

         // Save the error code - Pass or fail
         entry.accessory.errorValue = error;

         if ( error == 0 )
         {
            // Now that the set was successful, store the value
            entry.accessory.cmd4Storage.setStoredValueForIndex( entry.accTypeEnumIndex, entry.value );

            // Since the "Set" passed, do the stateChangeResponseTime
            setTimeout( ( ) =>
            {
            // A set with no error means the queue is sane to do reading
            queue.lastGoodTransactionTime = Date.now( );
            queue.errorCountSinceLastGoodTransaction = 0;

            // After the stateChangeResponseTime, do the related characteristic ( if any )
            let relatedCurrentAccTypeEnumIndex = entry.accessory.getDevicesRelatedCurrentAccTypeEnumIndex( entry.accTypeEnumIndex );

               if ( relatedCurrentAccTypeEnumIndex != null )
            {
            let relatedCurrentCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;
            // Change the entry to a get and set queueGetIsUpdate to true
            // Use unshift to make it next in line
            entry.isSet = false;
            entry.accTypeEnumIndex = relatedCurrentAccTypeEnumIndex;
            entry.characteristicString = relatedCurrentCharacteristicString;
            entry.queueGetIsUpdate = true;
            queue.highPriorityQueue.unshift( entry );
               }

               // The "Set" is now complete after its stateChangeResponseTime.
               queue.inProgressSets --;

               setTimeout( ( ) => { queue.processQueueFunc( HIGH_PRIORITY_GET, queue ); }, 0 );

            return;

            }, entry.stateChangeResponseTime );

         } else  // setValue failed
         {
            // The "Set" is complete, even if it failed.
            queue.inProgressSets --;

            let currentRetryCount = queue.errorCountSinceLastGoodTransaction;

            if ( currentRetryCount >= queue.queueRetryCount )
            {
               if ( queue.echoRetryErrors( currentRetryCount ) )
               {
                  // Counting starts from zero, i.e queueRetries = 0, so add 1
                  queue.log.warn( `*${ currentRetryCount + 1 }* error(s) were encountered for "${ entry.accessory.displayName }" getValue. Last error found Getting: "${ entry.characteristicString}". Perhaps you should run in debug mode to find out what the problem might be.` );
               }

               // Convert the errorValue into an errorString
               entry.accessory.errorString = new Error( constants.errorString( error ) );

               // This does not work - Nothing happens to HomeKit !
               // queue.log.warn( `START processHighPrioritySetQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue} errorString: ${ entry.accessory.errorString }`);
               // entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( entry.accessory.errorString );
               // queue.log.warn( `END processHighPrioritySetQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue} errorString: ${ entry.accessory.errorString }`);


            } else
            {
               // Increment the errorCount/currentRetryCount
               queue.errorCountSinceLastGoodTransaction++;

               // Set failed. We need to keep trying
               queue.highPriorityQueue.push( entry );

            }

            entry.accessory.queue.pauseQueue( entry.accessory.queue );
         }

         // Note 1.
         // Do not call the callback as it was done when the "Set" entry was
         // created.

         // Note 2.
         // We cannot release the queue for further processing as the
         // statechangeResponseTime has not completed. This must be
         // done first or any next "Get" or "Set" would interfere
         // with the device

      });
   }

   processHighPriorityGetQueue( entry )
   {
      if ( settings.cmd4Dbg ) this.log.debug( `Processing high priority queue "Get" entry: ${ entry.accTypeEnumIndex } isUpdate: ${ entry.queueGetIsUpdate } length: ${ this.highPriorityQueue.length }` );

      this.inProgressGets ++;

      this.qGetValue( entry.accessory, entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue )
      {
         let queue = entry.accessory.queue;

         // Save the error code - Pass or fail
         entry.accessory.errorValue = error;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            // Save the new returned value
            entry.accessory.cmd4Storage.setStoredValueForIndex( entry.accTypeEnumIndex, properValue );

            // hmmm if ( entry.queueGetIsUpdate == true )
               entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );

             // A good anything, updates the lastGoodTransactionTime
            queue.lastGoodTransactionTime = Date.now( );
            queue.errorCountSinceLastGoodTransaction = 0;

         } else  // highPriority getValue failed
         {

            let currentRetryCount = queue.errorCountSinceLastGoodTransaction;

            if ( currentRetryCount >= queue.queueRetryCount )
            {
               if ( queue.echoRetryErrors( currentRetryCount ) )
                  queue.log.warn( `*${ currentRetryCount + 1}* error(s) were encountered for "${ entry.accessory.displayName }" getValue. Last error found Getting: "${ entry.characteristicString}". Perhaps you should run in debug mode to find out what the problem might be.` );

               // Convert the errorValue into an errorString
               entry.accessory.errorString = new Error( constants.errorString( error ) );

               // This does not work - Nothing happens to HomeKit !
               // queue.log.warn( `START processHighPriorityGetQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue} errorString: ${ entry.accessory.errorString }`);
               // entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( entry.accessory.errorString );
               // queue.log.warn( `END processHighPriorityGetQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue} errorString: ${ entry.accessory.errorString }`);

            } else
            {
               // Increment the errorCount/currentRetryCount
               queue.errorCountSinceLastGoodTransaction++;

               // High Priority Get failed. We keep retrying until the mod of
               // queueRetryCount reaches zero, which is WoRm only as it has more than 1
               // default retry count.
               queue.highPriorityQueue.push( entry );
            }

            entry.accessory.queue.pauseQueue( entry.accessory.queue );
         }

         queue.inProgressGets --;
         setTimeout( ( ) => { queue.processQueueFunc( HIGH_PRIORITY_GET, queue ); }, 0 );

      });
   }

   // This is called from polling
   processEntryFromLowPriorityQueue( entry )
   {
      if ( settings.cmd4Dbg ) this.log.debug( `Processing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let queue = entry.accessory.queue;

      queue.inProgressGets ++;

      // isLowPriority is set to true,
      queue.qGetValue( entry.accessory, entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue )
      {
         // For the next one
         queue.inProgressGets --;

         // Save the error code - Pass or fail
         entry.accessory.errorValue = error;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            // Save the new value
            entry.accessory.cmd4Storage.setStoredValueForIndex( entry.accTypeEnumIndex, properValue );

            if ( settings.cmd4Dbg ) entry.accessory.log.debug( `processEntryFromLowPriorityQueue calling updateValue properValue: ${ properValue }`);

            // Update the new value in homebridge
            entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );

             // A good anything, updates the lastGoodTransactionTime
            queue.lastGoodTransactionTime = Date.now( );
            queue.errorCountSinceLastGoodTransaction = 0;

         } else { // LowPriority getValue failed
            queue.errorCountSinceLastGoodTransaction++;

            // Convert the errorValue into an errorString
            entry.accessory.errorString = new Error( constants.errorString( error ));

            // This does not work - Nothing happens to HomeKit !
            // Call updateValue with new Error so device will become unavailable
            // queue.log.warn( `START processEntryFromLowPriorityQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue } errorString: ${ entry.accessory.errorString }`);
            // entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( entry.accessory.errorString );
            // queue.log.warn( `END processEntryFromLowPriorityQueue calling updateCharacteristic errorValue: ${ entry.accessory.errorValue } errorString: ${ entry.accessory.errorString }`);

            queue.pauseQueue( entry.accessory.queue );
         }

         // Now that this one has been processed, schedule it again for next time
         queue.scheduleLowPriorityEntry( entry )

      });
   }

   // ***********************************************
   //
   // qGetValue: Method to call an external script
   //            that returns an accessories status
   //            for a given characteristic.
   //
   //   The script will be passed:
   //      Get <Device Name> <accTypeEnumIndex>
   //
   //      Where:
   //         - Device name is the name in your
   //           config.json file.
   //         - accTypeEnumIndex represents
   //           the characteristic to get as in index into
   //           the CMD4_ACC_TYPE_ENUM.
   //
   // ***********************************************
   qGetValue( accessory, accTypeEnumIndex, characteristicString, timeout, callback )
   {
      let self = accessory;
      let queue = accessory.queue;

      let cmd = self.state_cmd_prefix + self.state_cmd + " Get '" + self.displayName + "' '" + characteristicString + "'" + self.state_cmd_suffix;

      // My AdvAir friends want to allow single quotes in accessory names, which
      // may have consequences with globbing for others.
      if ( self.state_cmd.match( /AdvAir.sh/ ) )
      {
          cmd = self.state_cmd_prefix + self.state_cmd + ' Get "' + self.displayName + '" ' + "'" + characteristicString + "'" + self.state_cmd_suffix;
      }

      if ( settings.cmd4Dbg ) self.log.debug( `getValue: accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } cmd: ${ cmd } timeout: ${ timeout }` );

      let reply = "NxN";

      // Execute command to Get a characteristics value for an accessory
      // exec( cmd, { timeout: timeout }, function ( error, stdout, stderr )
      //let child = spawn( cmd, { shell:true } );
      let child = exec( cmd, { timeout: timeout }, function ( error, stdout, stderr )
      {
         if ( stderr )
            if ( queue.echoE ) self.log.error( `getValue: ${ characteristicString } function for ${ self.displayName } streamed to stderr: ${ stderr }` );

         // Handle errors when process closes
         if ( error )
            if ( queue.echoE ) self.log.error( chalk.red( `getValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  Generated Error: ${ error }` ) );

         reply = stdout;

      }).on('close', ( code ) =>
      {
         // Was the return code successful ?
         if ( code != 0 )
         {
            // Commands that time out have "null" return codes. So get the real one.
            if ( child.killed == true )
            {
               if ( queue.echoE  ) self.log.error( chalk.red( `getValue ${ characteristicString } function timed out ${ timeout }ms for ${ self.displayName } cmd: ${ cmd } Failed` ) );
               callback( constants.ERROR_TIMER_EXPIRED );

               return;
            }
            if ( queue.echoE  ) self.log.error( chalk.red( `getValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed. Error: ${ code }. ${ constants.DBUSY }` ) );

            callback( code );

            return;
         }

         if ( reply == "NxN" )
         {
            if ( queue.echoE  ) self.log.error( `getValue: nothing returned from stdout for ${ characteristicString } ${ self.displayName }. ${ constants.DBUSY }` );

            callback( constants.ERROR_NO_DATA_REPLY );

            return;
         }

         if ( reply == null )
         {
            if ( queue.echoE  ) self.log.error( `getValue: null returned from stdout for ${ characteristicString } ${ self.displayName }. ${ constants.DBUSY }` );

            // We can call our callback though ;-)
            callback( constants.ERROR_NULL_REPLY );

            return;
         }

         // Coerce to string for manipulation
         reply += '';

         // Remove trailing newline or carriage return, then
         // Remove leading and trailing spaces, carriage returns ...
         let trimmedReply = reply.replace(/\n|\r$/,"").trim( );

         // Theoretically not needed as this is caught below, but I wanted
         // to catch this before much string manipulation was done.
         if ( trimmedReply.toUpperCase( ) == "NULL" )
         {
            if ( queue.echoE  ) self.log.error( `getValue: "${ trimmedReply }" returned from stdout for ${ characteristicString } ${ self.displayName }. ${ constants.DBUSY }` );
            callback( constants.ERROR_NULL_STRING_REPLY );

            return;
         }

         // Handle beginning and ending matched single or double quotes. Previous version too heavy duty.
         // - Remove matched double quotes at begining and end, then
         // - Remove matched single quotes at beginning and end, then
         // - remove leading and trailing spaces.
         let unQuotedReply = trimmedReply.replace(/^"(.+)"$/,"$1").replace(/^'(.+)'$/,"$1").trim( );

         if ( unQuotedReply == "" )
         {
            if ( queue.echoE  ) self.log.error( `getValue: ${ characteristicString } function for: ${ self.displayName } returned an empty string "${ trimmedReply }". ${ constants.DBUSY }` );

            callback( constants.ERROR_EMPTY_STRING_REPLY );

            return;
         }

         // The above "null" checked could possibly have quotes around it.
         // Now that the quotes are removed, I must check again.  The
         // things I must do for bad data ....
         if ( unQuotedReply.toUpperCase( ) == "NULL" )
         {
            if ( queue.echoE  ) self.log.error( `getValue: ${ characteristicString } function for ${ self.displayName } returned the string "${ trimmedReply }". ${ constants.DBUSY }` );

            callback( constants.ERROR_2ND_NULL_STRING_REPLY );

            return;
         }

         let words = unQuotedReply.split( " " ).length;
         if ( words > 1 && CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.allowedWordCount == 1 )
         {
            self.log.warn( `getValue: Warning, Retrieving ${ characteristicString }, expected only one word value for: ${ self.displayName } of: ${ trimmedReply }` );
         }

         if ( settings.cmd4Dbg ) self.log.debug( `getValue: ${ characteristicString } function for: ${ self.displayName } returned: ${ unQuotedReply }` );


         var transposed = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, unQuotedReply )
         if ( settings.cmd4Dbg && transposed != unQuotedReply ) self.log.debug( `getValue: ${ characteristicString } for: ${ self.displayName } transposed: ${ transposed }` );


         // Return the appropriate type, by seeing what it is
         // defined as in Homebridge,
         let properValue = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( transposed );
         if ( properValue == undefined )
         {
            self.log.warn( `${ self.displayName } ` + chalk.red( `Cannot convert value: ${ unQuotedReply } to ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format } for ${ characteristicString }` ) );

            callback( constants.ERROR_NON_CONVERTABLE_REPLY );

            return;
         }

         if ( settings.cmd4Dbg && properValue != transposed ) self.log.debug( `getValue: ${ characteristicString } for: ${ self.displayName } properValue: ${ properValue }` );

         // Success !!!!
         callback( 0, properValue );

         // Store history using fakegato if set up
         self.updateAccessoryAttribute( accTypeEnumIndex, properValue );

      });
   }

   // ***********************************************
   //
   // qSetValue: Method to call an external script
   //            that sets an accessories status
   //            for a given characteristic.
   //
   //
   //   The script will be passed:
   //      Set < Device Name > < accTypeEnumIndex > < Value >
   //
   //
   //      Where:
   //         - Device name is the name in your
   //           config.json file.
   //         - accTypeEnumIndex represents
   //           the characteristic to get as in index into
   //           the CMD4_ACC_TYPE_ENUM.
   //         - Characteristic is the accTypeEnumIndex
   //           in HAP form.
   //         - Value is new characteristic value.
   //
   //  Notes:
   //    ( 1 ) In the special TARGET set characteristics, getValue
   //        is called to update HomeKit.
   //          Example: Set My_Door < TargetDoorState > 1
   //            calls: Get My_Door < CurrentDoorState >
   //
   //       - Where he value in <> is an one of CMD4_ACC_TYPE_ENUM
   // ***********************************************
   qSetValue( accessory, accTypeEnumIndex, characteristicString, timeout, value, queueCallback )
   {
      let self = accessory;
      let queue = accessory.queue;

      if ( self.hV.outputConstants == true )
      {
         value = transposeValueToValidConstant( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value );

      } else
      {
         value = transposeBoolToValue( value );
      }

      let cmd = accessory.state_cmd_prefix + accessory.state_cmd + " Set '" + accessory.displayName + "' '" + characteristicString + "' '" + value + "'" + accessory.state_cmd_suffix;

      // My AdvAir friends want to allow single quotes in accessory names, which
      // may have consequences with globbing for others.
      if ( accessory.state_cmd.match( /AdvAir.sh/ ) )
      {
          cmd = accessory.state_cmd_prefix + accessory.state_cmd + ' Set "' + accessory.displayName + '" ' + "'" + characteristicString + "' '" + value + "'" + accessory.state_cmd_suffix;
      }

      if ( accessory.hV.statusMsg == "TRUE" )
         self.log.info( chalk.blue( `Setting ${ self.displayName } ${ characteristicString }` ) + ` ${ value }` );

      if ( settings.cmd4Dbg ) self.log.debug( `setValue: accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } ${ value }  cmd: ${ cmd } timeout: ${ timeout }` );

      // Execute command to Set a characteristic value for an accessory
      let child = exec( cmd, { timeout: timeout }, function ( error, stdout, stderr )
      {
         if ( stderr )
            if ( queue.echoE ) self.log.error( `setValue: ${ characteristicString } function for ${ self.displayName } streamed to stderr: ${ stderr }` );

         if ( error )
            if ( queue.echoE  ) self.log.error( chalk.red( `setValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  Error: ${ error.message }` ) );

      }).on( "close", ( code ) =>
      {
         if ( code != 0 )
         {
            if ( child.killed == true )
            {
               if ( queue.echoE  ) self.log.error( chalk.red( `setValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  Error: ${ code } ${ constants.DBUSY }` ) );

               queueCallback( constants.ERROR_TIMER_EXPIRED );

               return;
            }

            queueCallback( code );

            return;
         }

         queueCallback( code );

      });
   }

   // The queue is self maintaining, except for lowPriorityEntries
   // which if passed in, must be rescheduled as they go by their own
   // intervals and thus must handle the return code.
   processWormQueue( lastTransactionType, queue, lowPriorityEntry = null )
   {
      // "WoRm", No matter what, only one "Set" allowed
      if ( queue.inProgressSets > 0 )
      {
         // if ( settings.cmd4Dbg ) queue.log.debug(`processWormQueue queue.inProgressSets > 0 : ${queue.inProgressSets}`);
 
         // We are *NOT* processing the low prioirity queue entry
         return false;
      }

      // It is not a good time to do a anything, so skip it
      if ( queue.lastGoodTransactionTime == 0 )
      {
         // if ( settings.cmd4Dbg ) queue.log.debug(`processWormQueue queue.lastGoodTransactionTime == 0`);

         // We are *NOT* processing the low prioirity queue entry
         return false;
      }

      if ( queue.highPriorityQueue.length > 0 )
      {
         let nextEntry = queue.highPriorityQueue[ 0 ];

         if ( nextEntry.isSet == true )
         {
            // If already in progress, when they finish they will restart the queue
            // Otherwise continuing will purge the next item from the queue as it
            // cannot be run with an entry already in progress.
            if ( nextEntry.accessory.queue.inProgressSets > 0 ||
                 nextEntry.accessory.queue.inProgressGets > 0 )
            {
               // Return as queue is busy.
               // Return false as we are *NOT* processing the low prioirity queue entry
               // if ( settings.cmd4Dbg ) queue.log.debug(`processWormQueue queue.inProgressSets> 0 ${ nextEntry.accessory.queue.inProgressSets } ${ nextEntry.accessory.queue.inProgressGets }`);

               return false;
            }

            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );

            // Return false as we are *NOT* processing the low prioirity queue entry
            return false;
         }

         // This must be a "Get". Process them all.
         let max = queue.highPriorityQueue.length;

         while( queue.highPriorityQueue.length > 0 &&
                nextEntry.isSet == false &&
                max >= 1 )
         {
            queue.processHighPriorityGetQueue( queue.highPriorityQueue.shift( ) );
            nextEntry = queue.highPriorityQueue[ 0 ];
            max--;
         }

         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;

      } else  if ( lastTransactionType == HIGH_PRIORITY_SET ||
                   lastTransactionType == HIGH_PRIORITY_GET )
      {
         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;
      }
      // This is self evident, until their are other types of Prioritys
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           lowPriorityEntry != null &&
           queue.queueStarted == true )
      {
         queue.processEntryFromLowPriorityQueue( lowPriorityEntry );

         // We are processing the low priority queue entry.
         return true;

      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          {
             // Return false as we are *NOT* processing the low prioirity queue entry
             return false;

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          {
             // Return false as we are *NOT* processing the low prioirity queue entry
             return false;

          } else {
             if ( settings.cmd4Dbg ) this.log.debug( `Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

          }
      }
   }

   // The queue is self maintaining, except for lowPriorityEntries
   // which if passed in, must be rescheduled as they go by their own
   // intervals and thus must handle the return code.
   processSequentialQueue( lastTransactionType, queue, lowPriorityEntry = null )
   {
      // Sequential, No matter what, only one transaction allowed
      if ( queue.inProgressSets > 0 ||
           queue.inProgressGets > 0 )
         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;

      // It is not a good time to do a anything, so skip it
      if ( queue.lastGoodTransactionTime == 0 )
         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;

      if ( queue.highPriorityQueue.length > 0 )
      {
         let nextEntry = queue.highPriorityQueue[ 0 ];

         if ( nextEntry.isSet == true )
         {
            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );

            // Return false as we are *NOT* processing the low prioirity queue entry
            return false;

         }

         // Has to be a High Priority "Get" entry. Process just this one.
         queue.processHighPriorityGetQueue( queue.highPriorityQueue.shift( ) );

         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;

      } else  if ( lastTransactionType == HIGH_PRIORITY_SET ||
                   lastTransactionType == HIGH_PRIORITY_GET )
      {
         // Return false as we are *NOT* processing the low prioirity queue entry
         return false;
      }
      // This is self evident, until their are other types of Prioritys
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           lowPriorityEntry != null &&
           queue.queueStarted == true )
      {
         queue.processEntryFromLowPriorityQueue( lowPriorityEntry );

         // We are processing the low priority queue entry.
         return true;

      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          {
             // Return false as we are *NOT* processing the low prioirity queue entry
             return false;

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          {
             // Return false as we are *NOT* processing the low prioirity queue entry
             return false;

          } else {
             if ( settings.cmd4Dbg ) this.log.debug( `Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

          }
      }
   }

   // The standard queue is just free running, except if the queue has not
   // been started yet.
   processPassThruQueue( lastTransactionType, queue, lowPriorityEntry = null )
   {
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           lowPriorityEntry != null &&
           queue.queueStarted == true )
      {
         queue.processEntryFromLowPriorityQueue( lowPriorityEntry );
      }

      if ( queue.highPriorityQueue.length > 0 )
      {
         let nextEntry = queue.highPriorityQueue[ 0 ];

         if ( nextEntry.isSet == true )
         {

            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );
         }
         else
         {
            queue.processHighPriorityGetQueue( queue.highPriorityQueue.shift( ) );
         }
      }
   }

   scheduleLowPriorityEntry( entry )
   {
      let accessory = entry.accessory;
      let queue = entry.accessory.queue;

      if ( settings.cmd4Dbg ) accessory.log.debug( `Scheduling Poll of index: ${ entry.accTypeEnumIndex } characteristic: ${ entry.characteristicString } for: ${ accessory.displayName } timeout: ${ entry.timeout } interval: ${ entry.interval }` );

      // Clear polling
      if ( queue.listOfRunningPolls &&
           queue.listOfRunningPolls[ accessory.displayName + entry.accTypeEnumIndex ] == undefined )
              clearTimeout( queue.listOfRunningPolls[ accessory.displayName + entry.accTypeEnumIndex ] );

      queue.listOfRunningPolls[ accessory.displayName + entry.accTypeEnumIndex ] = setTimeout( ( ) =>
      {
         // If the queue was busy/not available, schedule the entry at a later time
         if ( queue.processQueueFunc( LOW_PRIORITY_GET, queue, entry ) == false )
         {
            if ( settings.cmd4Dbg ) accessory.log.debug( `processsQueue returned false` );

            queue.scheduleLowPriorityEntry( entry );
         }

      }, entry.interval);
   }


   pauseQueue( queue )
   {
      if ( queue.queueType == constants.QUEUETYPE_STANDARD )
         return;

      queue.lastGoodTransactionTime = 0;

      if ( queue.pauseTimer == null )
      {
         queue.pauseTimer = setTimeout( ( ) =>
         {
             // So we do not trip over this again immediately
             queue.lastGoodTransactionTime = Date.now( );
             queue.pauseTimer = null;

             queue.processQueueFunc( HIGH_PRIORITY_GET, queue );

          }, queue.pauseTimerTimeout );
      }
   }

   printQueueStats( queue )
   {
      let line = `QUEUE "${ queue.queueName }" stats`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length ) }` );
      this.log.info( "No longer applicable" );
   }
   dumpQueue( queue )
   {
      let line = `Low Priority Queue "${ queue.queueName }"`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length ) }` );
      queue.lowPriorityQueue.forEach( ( entry, entryIndex ) =>
      {
         this.log.info( `${ entryIndex } ${ entry.accessory.displayName } characteristic:  ${ entry.characteristicString } accTypeEnumIndex: ${ entry.accTypeEnumIndex } interval: ${ entry.interval } timeout: ${ entry.timeout }` );
      } );
   }

   startQueue( queue, allDoneCallback )
   {
      queue.lowPriorityQueueIndex = 0 ;

      let delay = 0;
      let staggeredDelays = [ 3000, 6000, 9000, 12000 ];
      let staggeredDelaysLength = staggeredDelays.length;
      let staggeredDelayIndex = 0;
      let lastAccessoryUUID = ""
      let allDoneCount = 0;

      if ( settings.cmd4Dbg ) this.log.debug( `enablePolling for the first time` );

      // If there is nothing in the lowPriorityQueue, we are dome.
      // Demo mode or Unit testing.
      if ( queue.lowPriorityQueue.length == 0 )
      {

         allDoneCallback( allDoneCount );
         setTimeout( ( ) => { queue.processQueueFunc( HIGH_PRIORITY_GET, queue ); }, 0 );

      } else
      {
         queue.lowPriorityQueue.forEach( ( entry, entryIndex ) =>
         {
            allDoneCount ++;
            setTimeout( ( ) =>
            {
               if ( entryIndex == 0 && settings.cmd4Dbg )
               {
                  if ( queue.queueType == constants.QUEUETYPE_WORM ||
                       queue.queueType == constants.QUEUETYPE_WORM2
                     )
                  {
                     entry.accessory.log.debug( `Started staggered kick off of ${ queue.lowPriorityQueue.length } polled characteristics for queue: "${ entry.accessory.queue.queueName }"` );
                  } else
                  {
                     entry.accessory.log.debug( `Started staggered kick off of ${ queue.lowPriorityQueue.length } polled characteristics for "${ entry.accessory.displayName }"` );
                  }
               }

               if ( settings.cmd4Dbg ) entry.accessory.log.debug( `Kicking off polling for: ${ entry.accessory.displayName } ${ entry.characteristicString } interval:${ entry.interval }, staggered:${ staggeredDelays[ staggeredDelayIndex ] }` );

               queue.scheduleLowPriorityEntry( entry );

               if ( entryIndex == queue.lowPriorityQueue.length -1 )
               {
                  if ( settings.cmd4Dbg )
                  {
                     if ( queue.queueType == constants.QUEUETYPE_WORM ||
                          queue.queueType == constants.QUEUETYPE_WORM2
                        )
                     {
                        entry.accessory.log.debug( `All characteristics are now being polled for queue: "${ queue.queueName }"` );
                     }
                     else
                     {
                        entry.accessory.log.debug( `All characteristics are now being polled for "${ entry.accessory.displayName }"` );
                     }
                  }
                  allDoneCallback( allDoneCount );
               }

            }, delay );

            if ( staggeredDelayIndex++ >= staggeredDelaysLength )
               staggeredDelayIndex = 0;

            if ( lastAccessoryUUID != entry.accessory.uuid )
               staggeredDelayIndex = 0;

            lastAccessoryUUID = entry.accessory.uuid;

            delay += staggeredDelays[ staggeredDelayIndex ];

         });
      }

      queue.queueStarted = true;
   }

   changeQueueType( queue, queueType )
   {
      if ( queue.queueStarted )
         throw new Error( `Cannot change queueType when queue is running` );

      // The WoRm queue needs error messages to be silenced as
      // they are inevitable, but are handled through retries
      // By default non WoRm queus are allowed to echo errors
      this.echoE = true;

      // Default
      this.processQueueFunc = this.processWormQueue;
      switch ( queueType )
      {
         case constants.QUEUETYPE_SEQUENTIAL:
            this.processQueueFunc = this.processSequentialQueue;
            break;
         case constants.QUEUETYPE_WORM:
         case constants.QUEUETYPE_WORM2:
            this.processQueueFunc = this.processWormQueue;
            // When not in debug mode, do not echo errors for the WoRm queue
            // as errors are handled through retries.
            if ( ! settings.cmd4Dbg )
               this.echoE = false;
            break;
         case constants.QUEUETYPE_STANDARD:
            // only polled entries go straight through the queue
            this.processQueueFunc = this.processPassThruQueue;
            break;
         case constants.QUEUETYPE_PASSTHRU:
            // entries go straight through the queue
            this.processQueueFunc = this.processPassThruQueue;
            break;
         default:
            this.log.error( `Error: Invalid queue type: ${ queueType }` );
      }
   }

   isCharacteristicPolled( accTypeEnumIndex, queue, accessory )
   {
       if ( queue.lowPriorityQueue.filter(
               entry => entry.accessory.uuid == accessory.uuid &&
               entry.accTypeEnumIndex == accTypeEnumIndex
            ).length == 0 )
       {
          return false;
       }

       return true;
   }
}

var queueExists = function( queueName )
{
   return settings.listOfCreatedPriorityQueues[ queueName ];
}

var addQueue = function( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, queueRetryCount = constants.DEFAULT_WORM_QUEUE_RETRY_COUNT )
{
   let queue = queueExists( queueName );
   if ( queue != undefined )
      return queue;

   log.debug( `Creating new Priority Polled Queue "${ queueName }" with QueueType of: "${ queueType }" retryCount: ${queueRetryCount}` );

   queue = new Cmd4PriorityPollingQueue( log, queueName, queueType, queueRetryCount );
   settings.listOfCreatedPriorityQueues[ queueName ] = queue;

   return queue;

}



var parseAddQueueTypes = function ( log, entrys )
{
   if ( trueTypeOf( entrys ) != Array )
      throw new Error( `${ constants.QUEUETYPES } is not an Array of { "Queue Name": "QueueType" }. found: ${ entrys }` );

   entrys.forEach( ( entry, entryIndex ) =>
   {
      let queueName = null;
      let queueType = constants.DEFAULT_QUEUE_TYPE;
      let queueRetryCount = constants.DEFAULT_WORM_QUEUE_RETRY_COUNT;

      for ( let key in entry )
      {
         let lcKey = lcFirst( key );

         // warn now
         if ( key.charAt( 0 ) === key.charAt( 0 ).toUpperCase( ) )
         {
            log.warn( `The config.json queueTypes key: ${ key } is Capitalized.  All keys in the near future will ALWAYS start with a lower case character for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
         }

         let value = entry[ key ];

         switch( lcKey )
         {
            case constants.QUEUE:
               if ( settings.listOfCreatedPriorityQueues[ entry.queue ] )
                  throw new Error( `QueueName: ${ entry.queue } was added twice` );

               queueName = value;

               break;
            case constants.QUEUETYPE:
               // Set the default Queue Retry Count based on QueueType
               switch ( value )
               {
                  case constants.QUEUETYPE_WORM:
                     queueRetryCount = constants.DEFAULT_WORM_QUEUE_RETRY_COUNT;
                     queueType = value;
                     break;
                  case constants.QUEUETYPE_WORM2:
                     queueRetryCount = constants.DEFAULT_WORM_QUEUE_RETRY_COUNT;
                     queueType = value;
                     break;
                  case constants.QUEUETYPE_SEQUENTIAL:
                     queueRetryCount = constants.DEFAULT_STANDARD_QUEUE_RETRY_COUNT;
                     queueType = value;
                     break;
                  case constants.QUEUETYPE_STANDARD:
                     queueRetryCount = constants.DEFAULT_STANDARD_QUEUE_RETRY_COUNT;
                     queueType = value;
                     break;
                  default:
                     throw new Error( `QueueType: ${ entry.queueType } is not valid at index: ${ entryIndex }. Expected: ${ constants.QUEUETYPE_WORM }, ${ constants.QUEUETYPE_WORM2 } or ${ constants.QUEUETYPE_SEQUENTIAL }` );
               }

               break;
            case constants.QUEUE_RETRIES:
               queueRetryCount = value;
               break;
            default:
               throw new Error( `Unknown Queue option"${ key }  not provided at index ${ entryIndex }` );
         }
      }

      // At least a Queue name must be defined, the rest are defaulted
      if ( queueName == null )
         throw new Error( `"${ constants.QUEUE }"  not provided at index ${ entryIndex }` );

      if ( settings.cmd4Dbg ) log.debug( `calling addQueue: ${ queueName } type: ${ queueType } retryCount: ${ queueRetryCount }` );

      addQueue( log, queueName, queueType, queueRetryCount );
   } );
}


module.exports = { addQueue,
                   parseAddQueueTypes,
                   queueExists,
                   Cmd4PriorityPollingQueue
                 }
