'use strict';


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;


// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

// Pretty Colors
var chalk = require( "chalk" );

let trueTypeOf = require( "./utils/trueTypeOf" );
let ucFirst = require( "./utils/ucFirst" );
let VariableTimer = require( "./utils/VariableTimer" );


let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
let LOW_PRIORITY_GET = 2;


class Cmd4PriorityPollingQueue
{
   constructor( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, queueInterval = constants.DEFAULT_QUEUE_INTERVAL, queueMsg = constants.DEFAULT_QUEUEMSG, queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL )
   {
      this.log = log;
      this.queueName = queueName;
      this.queueType = queueType;
      this.queueMsg = queueMsg;
      this.queueStatMsgInterval = queueStatMsgInterval;
      this.queueStarted = false;
      this.highPriorityQueue = [ ];
      this.lowPriorityQueue = [ ];
      this.lowPriorityQueueIndex = 0 ;
      this.lowPriorityQueueMaxLength = 0 ;
      this.inProgressGets = 0;
      this.inProgressSets = 0;
      this.variablePollingTimer = new VariableTimer( );
      this.safeToDoPollingFlag = false;

      this.variablePollingTimer.iv = queueInterval;


      // Relieve possible congestion by low priority queue consuming
      // all the time that actually interacting with the real accessory
      // is slow
      this.lowPriorityQueueCounter = 0;
      this.lowPriorityQueueAverageTime = 0;
      this.lowPriorityQueueAccumulatedTime = 0;
      this.originalInterval = queueInterval;
      this.optimalInterval = queueInterval;

      // This is not a sanity timer.
      // This controls when it is safe to do a "Get" of the Aircon
      // after a failed condition. It does happen to fix the queue
      // when something is wrong, but this is not the purpose of
      // this timer.
      this.recoveryTimer = null;
      this.lastGoodReadTime =  Date.now( );

      // - Not a const so it can be manipulated during unit testing
      this.recoveryTimerInterval = constants.DEFAULT_RECOVERY_TIMER_INTERVAL;


      this.squashErrMsg = "";
      this.squashErrCounter = 0;
      this.squashStartTime = 0;
   }

   prioritySetValue( accTypeEnumIndex, characteristicString, timeout, stateChangeResponseTime,  value, callback )
   {
      let self = this;

      // Call the callback immediately as we will call updateValue
      callback( );

      let newEntry = { [ constants.IS_SET_lv ]: true, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.VALUE_lv ]: value };

      // Determine wherebto put theventry in the queue
      if ( self.queue.highPriorityQueue.length == 0 )
      {
         // No entries, then it goes on top
         self.queue.highPriorityQueue.push( newEntry );

      } else {

         // Make sure that this is the latest "Set" of this entry
         let index = self.queue.highPriorityQueue.findIndex( ( entry ) => entry.accessory.UUID == self.UUID && entry.isSet == true && entry.accTypeEnumIndex == accTypeEnumIndex );

         if ( index == -1 )
         {
            // It doesn't exist in the queue, It needs to be placed after any "Sets".
            // First Determine the first "Get"
            let getIndex = self.queue.highPriorityQueue.findIndex( ( entry ) => entry.isSet == false );

            if ( getIndex == -1 )
            {
               // No "Get" entrys, it goes at the end after everything.
               self.queue.highPriorityQueue.push( newEntry );

            } else
            {
               // Insert before the first "Get" entry
               self.queue.highPriorityQueue.splice( getIndex, 0, newEntry );
            }
         } else
         {
            self.queue.highPriorityQueue[ index ] = newEntry;
         }
      }

      self.queue.processQueue( HIGH_PRIORITY_SET, self.queue );
   }

   priorityGetValue( accTypeEnumIndex, characteristicString, timeout, callback )
   {
      let self = this;

      // It is not a good time to do a "Get", so Squash it
      if ( self.queue.lastGoodReadTime == 0 )
      {
         self.queue.squashErrCounter++;

         self.log.debug( `Debug Warning: ${ self.displayName }, Returning cached value for ${ characteristicString }` );
         callback( null, self.getStoredValueForIndex( accTypeEnumIndex ) );

         return;
      }

      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: callback } );

      self.queue.processQueue( HIGH_PRIORITY_GET, self.queue );
   }

   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // These are all gets from polling
      accessory.queue.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

      accessory.queue.lowPriorityQueueMaxLength = accessory.queue.lowPriorityQueue.length ;

   }

   processHighPrioritySetQueue( entry )
   {
      // This is just a double check and processQueue should not 
      // ever let this happen
      if ( entry.accessory.queue.inProgressSets > 0 ||
           entry.accessory.queue.inProgressGets > 0 )
      {
         // If the queue mistakenly calls this, then it would also have
         // removed the entry from the queue
         this.log.debug( chalk.red( `QUEUE ERROR: High priority "Set" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }`));
         return;
      }

      this.log.debug( `Processing high priority queue "Set" entry: ${ entry.accTypeEnumIndex } length: ${ entry.accessory.queue.highPriorityQueue.length }` );

      entry.accessory.queue.inProgressSets ++;
      entry.accessory.setValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, entry.stateChangeResponseTime, entry.value, function ( error )
      {
         let relatedCurrentAccTypeEnumIndex = entry.accessory.getDevicesRelatedCurrentAccTypeEnumIndex( entry.accTypeEnumIndex );

         if ( error == 0 &&
              relatedCurrentAccTypeEnumIndex != null )
         {
            let relatedCurrentCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;

            // A set with no error means the queue is sane to do reading
            entry.accessory.queue.lastGoodReadTime =  Date.now( );

            setTimeout( ( ) =>
            {
               // Change the entry to a get and set queueGetIsUpdate to true
               // Use unshift to make it next in line
               entry.isSet = false;
               entry.accTypeEnumIndex = relatedCurrentAccTypeEnumIndex;
               entry.characteristicString = relatedCurrentCharacteristicString;
               entry.queueGetIsUpdate = true;
               entry.accessory.queue.highPriorityQueue.unshift( entry );

               // The "Set" is now complete after its stateChangeResponseTime.
               entry.accessory.queue.inProgressSets --;

               if ( entry.accessory.queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
                  setTimeout( ( ) => { entry.accessory.queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0 );

               return;

            }, entry.stateChangeResponseTime );

         }

         // Note 1.
         // Do not call the callback as it was done when the "Set" entry was 
         // created.

         // Note 2.
         // We cannot release the queue for further processing as the 
         // statechangeResponseTime has not completed. This must be
         // done first or any next "Get" or "Set" would interfere
         // with the device



      }, true );
   }

   processHighPriorityGetQueue( entry )
   {
      // This is just a double check and processQueue should not
      // ever let this happen
      if ( entry.accessory.queue.inProgressSets > 0 ||
           entry.accessory.queue.inProgressGets > 0 &&
           entry.accessory.queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }` );
         return;
      }

      this.log.debug( `Processing high priority queue "Get" entry: ${ entry.accTypeEnumIndex } isUpdate: ${ entry.queueGetIsUpdate } length: ${ entry.accessory.queue.highPriorityQueue.length }` );

      entry.accessory.queue.inProgressGets ++;
      let pollingID =  Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID, returnedErrMsg  )
      {
         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info( `More entries for pollingID of get error: ${ error } value: ${ properValue } returnedPollingID: ${ returnedPollingID }` );

            return;
         }

         pollingID = -1;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            if ( entry.queueGetIsUpdate == false )
               entry.callback( error, properValue );
            else
               entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );

         } else
         {
            // Do not output the returnedErrMsg, it will be done in squashError.

            // A response is expected for "Get" without update.
            if ( entry.queueGetIsUpdate == false )
               entry.callback( error );
         }

         // could also be unsquashing
         entry.accessory.queue.squashError( entry.accessory.queue, error, returnedErrMsg )

         entry.accessory.queue.inProgressGets --;
         setTimeout( ( ) => { entry.accessory.queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0 );

      }, pollingID );
   }

   processEntryFromLowPriorityQueue( entry )
   {
      // This is just a double check and processQueue should not
      // ever let this happen
      if ( entry.accessory.queue.inProgressSets > 0 ||
           entry.accessory.queue.inProgressGets > 0 &&
           entry.accessory.queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `Low priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString }` );
         return;
      }

      this.log.debug( `Processing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let pollingID =  Date.now( );
      entry.accessory.queue.inProgressGets ++;
      entry.accessory.queue.lowPriorityQueueCounter ++;
      let lowPriorityQueueStartTime =  Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID, returnedErrMsg )
      {
         let lowPriorityQueueEndTime =  Date.now( );

         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info( `More entries for pollingID of get error:${ error } val:${ properValue } returnedPollingID:${ returnedPollingID }` );

            return;
         }
         entry.accessory.queue.lowPriorityQueueAccumulatedTime += lowPriorityQueueEndTime - lowPriorityQueueStartTime;
         entry.accessory.queue.lowPriorityQueueAverageTime = entry.accessory.queue.lowPriorityQueueAccumulatedTime / entry.accessory.queue.lowPriorityQueueCounter;

         // Make it 7x, but not less than the original interval
         // We need to accomodate the fact that the unit could
         // be interacted with manually.
         let optimal = 7 * entry.accessory.queue.lowPriorityQueueAverageTime;
         if ( optimal > entry.accessory.queue.originalInterval )
         {
            entry.accessory.queue.optimalInterval = optimal;

            // Change the Polling timer interval to the optimal value
            entry.accessory.queue.variablePollingTimer.set_interval( optimal );
         }


         pollingID = -1;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );

         }

         // could also be unsquashing
         entry.accessory.queue.squashError( entry.accessory.queue, error, returnedErrMsg )

         // For the next one
         entry.accessory.queue.inProgressGets --;

         // This will restart the polling timer if not anything else
         setTimeout( ( ) => { entry.accessory.queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0 );
      }, pollingID );
   }

   squashError( queue, error, errMsg )
   {
      switch ( error )
      {
         // These are not really errors caused by polling
         // break omitted
         case constants.ERROR_TIMER_EXPIRED:
         case constants.ERROR_NON_CONVERTABLE_REPLY:
         case constants.ERROR_CMD_FAILED_REPLY:
             // These error messages would have been displayed in getValue
            break;
         case 0:
            // A good anything, updates the lastGoodReadTime
            queue.lastGoodReadTime = Date.now( );

            // No error, then squashing is over
            if ( queue.squashErrCounter > 0 )
            {
               let seconds = Math.round( ( Date.now( ) - queue.squashStartTime ) / 1000 );
               queue.log.error( `This message has been omitted ${ queue.squashErrCounter } times in ${ seconds } seconds => ${ queue.squashErrMsg }` );
               queue.squashErrCounter = 0;
            }

            break;
         // When the MyAir is busy, the result is empty strings or
         // null and while they are not passed to homebridge, polling
         // must slow.
         case constants.ERROR_NULL_REPLY:
         case constants.ERROR_NULL_STRING_REPLY:
         case constants.ERROR_2ND_NULL_STRING_REPLY:
         case constants.ERROR_EMPTY_STRING_REPLY:
         case constants.ERROR_NO_DATA_REPLY:
         // Other errors like jq, rc=1 should be treated as being squashed.
         // break omitted
         default:
         {
            if ( queue.lastGoodReadTime == 0 )
            {
               // increment the error counter
               queue.squashErrCounter++;
            } else
            {
               queue.squashStartTime =  Date.now( );

               // Say the error the first time.
               queue.log.error( `${ errMsg } rc: ${ error }` );

               queue.squashErrCounter = 0;
               queue.squashErrMsg = errMsg;

               // These types of error messages start quashing
               queue.lastGoodReadTime = 0;
            }


            break;
         }
      }
   }

   measureQueuePerformance( queue )
   {
      // A 10% variance is okay
      if ( queue.variablePollingTimer.iv > ( queue.optimalInterval * 1.1 ) )
      {
         if ( queue.queueMsg == true )
            this.log.info( `queue.optimalInterval: ${ queue.optimalInterval.toFixed( 2 ) } queue.queueInterval: ${ queue.variablePollingTimer.iv } is too reasonable. Using computed optimal interval` );

         // Change the Polling timer interval to the optimal value
         queue.variablePollintTimer.set_interval( queue.optimalInterval );

         if ( queue.queueMsg == true )
            queue.printQueueStats( queue );

         if ( queue.variablePollingTimer.iv < ( queue.optimalInterval * .9 ) )
         {
            if ( queue.queueMsg == true )
               this.log.info( `queue.optimalInterval: ${ queue.optimalInterval.toFixed( 2 ) } queue.queueInterval: ${ queue.variablePollingTimer.iv } is unreasonable. Using computed optimal interval` );

            // Change the Polling timer interval to the optimal value
            queue.variablePollingTimer.set_interval( queue.optimalInterval );

         }

         if ( queue.queueMsg == true &&
              queue.lowPriorityQueueCounter % queue.queueStatMsgInterval == 0 )
         {
            queue.printQueueStats( queue );
         }
      }
   }

   squashOrProcessNextLowPriorityEntry( queue )
   {
      let nextEntry = queue.lowPriorityQueue[ queue.lowPriorityQueueIndex ];

      // It is not a good time to do a "Get", so Squash it
      if ( queue.lastGoodReadTime == 0 )
      {
         queue.squashErrCounter++;


         queue.log.debug( `Debug Warning: squashing ${ nextEntry.accessory.displayName } ${ nextEntry.characteristicString }` );
      } else
      {
         queue.processEntryFromLowPriorityQueue( nextEntry );
      }

      queue.lowPriorityQueueIndex ++;

      // The index restarts from zero, if reached the end
      if ( queue.lowPriorityQueueIndex >= queue.lowPriorityQueueMaxLength )
         queue.lowPriorityQueueIndex = 0;

   }

   processQueue( lastTransactionType, queue )
   {
      // Set, No matter what, only one allowed
      if ( queue.inProgressSets > 0 )
      {
         // This is not true, It could be another Set has been issued
         //if ( lastTransactionType == HIGH_PRIORITY_SET )
         //   this.log.error( `Queue stuck, inProgressSets ${ this.inProgressSets }` );

         // wait until transaction is done and calls this function
         return;
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
               return;

            // The check for Set already running is above

            // We cant have a low priority timer going off starting the
            // queue during a set even though it would do high priority first.
            queue.safeToDoPollingFlag = false;

            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );

            return;

         } // HIGH PRIORITY GET SEQUENTIAL && WORM
         else if ( nextEntry.isSet == false &&
                   ( ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ) ||
                     queue.queueType == constants.QUEUETYPE_WORM
                   )
                 )
         {
            // It is not a good time to do a "Get", so Squash it
            if ( queue.lastGoodReadTime == 0 )
            {
               // Squash all the "Gets" based on the Queue Type
               let max = 1;
               if ( queue.queueType == constants.QUEUETYPE_WORM )
                  max = queue.highPriorityQueue.length;

               while( queue.highPriorityQueue.length > 0 &&
                      nextEntry.isSet == false &&
                      max >= 1 )
               {

                  queue.squashErrCounter++;

                  let cachedValue = nextEntry.accessory.getStoredValue( nextEntry.accTypeEnumIndex );

                  queue.log.debug( `Debug Warning: squashing ${ nextEntry.accessory.displayName } ${ nextEntry.characteristicString } Returning cached value ${ cachedValue }` );

                  // Send the cached value
                  nextEntry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].characteristic ).updateValue( cachedValue );

                  // Remove the nextEntry from the queue.
                  queue.highPriorityQueue.shift( );

                  nextEntry = queue.highPriorityQueue[ 0 ];

                  max--;

               }

               return;
            }

            // Process all the "Gets" based on the Queue Type
            let max = 1;
            if ( queue.queueType == constants.QUEUETYPE_WORM )
               max = queue.highPriorityQueue.length;

            while( queue.highPriorityQueue.length > 0 &&
                   nextEntry.isSet == false &&
                   max >= 1 )
            {
               queue.processHighPriorityGetQueue( queue.highPriorityQueue.shift( ) );
               nextEntry = queue.highPriorityQueue[ 0 ];
               max--;
            }

            return;

         }
         // this.log.debug( `RETURNING lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

         // wait until transaction is done and calls this function
         return;

      } else  if ( lastTransactionType == HIGH_PRIORITY_SET ||
                   lastTransactionType == HIGH_PRIORITY_GET )
      {
         return;
      }
      // This is self evident, until their are other types of Prioritys
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           queue.lowPriorityQueue.length > 0 &&
           queue.queueStarted == true )
      {
         // We had to be called by Polling because it is the only one
         // who sets the last transaction type to LOW_PRIORITY
         // It also turns off the safeToDoPollingFlag
         if ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ||
              queue.queueType == constants.QUEUETYPE_WORM )
         {
            queue.squashOrProcessNextLowPriorityEntry( queue, 0 )

            queue.measureQueuePerformance( queue );
         }
      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          { // Noop

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          {
             // Noop, Nothing to do

          } else {
             this.log.debug( `Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

          }
      }
   }

   enablePollingFirstTime( queue )
   {
      this.log.debug( `enablePolling for the first time, queue.safeToDoPollingFlag: ${ queue.safeToDoPollingFlag }` );
      if ( queue.safeToDoPollingFlag == false )
      {
         this.log.debug( `Starting polling interval timer for the first time with interval: ${ queue.variablePollingTimer.iv }` );

         // The interval would have already been set by the queueInterval
         queue.variablePollingTimer.start( ( ) =>
         {
            this.log.debug( "Polling interval Timer Firing safeToDoPollingFlag: %s", queue.safeToDoPollingFlag );
            if ( queue.safeToDoPollingFlag == true )
            {
               queue.safeToDoPollingFlag = false;
               queue.processQueue( LOW_PRIORITY_GET, queue );
               queue.safeToDoPollingFlag = true;
            }
         } );
         // its safe to do Low Priority polling now, So when the interval
         // timer goes off, it can happen.
         queue.safeToDoPollingFlag = true;
      }
   }
   startRecoveryTimer( queue )
   {
      if ( queue.recoveryTimer == null )
      {
         queue.recoveryTimer = setInterval( ( ) =>
         {
             this.log.debug( `inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length } safeToDoPollingFlag: ${ queue.safeToDoPollingFlag } interval: ${ queue.variablePollingTimer.iv } variablePollingTimer:${ queue.variablePollingTimer } lastGoodReadTime: ${ queue.lastGoodReadTime } recoveryTimerInterval: ${ queue.recoveryTimerInterval }` );

            // The queue must be started before any recovery can take place
            if ( queue.queueStarted == true )
            {
               // This actually is triggered upon the second interval
               if (  Date.now( ) > queue.lastGoodReadTime + queue.recoveryTimerInterval )
               {
                  this.log.debug( `Recovery Timer Fixing Polling !!!  safeToDoPollingFlag: ${ queue.safeToDoPollingFlag } inProgressSets: ${ queue.inProgressSets } inProgressGets: ${ queue.inProgressGets } queue.variablePollingTimer.iv: ${ queue.variablePollingTimer.iv } variablePollingTimer: ${ queue.variablePollingTimer } ` );
                  if ( queue.variablePollingTimer == null )
                  {
                     // If it is not running, we got bigger problems
                     this.log.error( `Polling timer is null ???? ` );
                     process.exit( 333 );
                  }

                  if ( queue.safeToDoPollingFlag == false )
                  {
                     // Must set it behind its back to avoid
                     // the now invalid checks
                     queue.safeToDoPollingFlag = true;
                  }

                  if ( queue.inProgressGets != 0 )
                     queue.inProgressGets = 0;

                  if ( queue.inProgressSets != 0 )
                     queue.inProgressSets = 0;

                  // So we do not trip over this again immediately
                  queue.lastGoodReadTime = Date.now( );

                  // Do not call startQueue as it starts this sanity timer
                  // instead, do what it did.
                  queue.lowPriorityQueueIndex = 0 ;

                  // Purge the high priority queue or it would grow uncontrollably
                  queue.highPriorityQueue.forEach( ( entry, entryIndex ) =>
                  {
                     queue.log.debug( `Purging ( ${ entryIndex } ): ${ entry.accessory.displayName } ${ entry.characteristicString } isSet: ${ entry.isSet ? "true" : "false" }` );
                  });
                  queue.highPriorityQueue = [ ];

                  queue.queueStarted = true;

                  // Display the squashed messages, if any
                  queue.squashError( queue, 0, "" );
               }
            }

         }, queue.recoveryTimerInterval );

      }
   }
   printQueueStats( queue )
   {
      let line = `QUEUE "${ queue.queueName }" stats`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length ) }` );
      this.log.info( `iterations: ${ queue.lowPriorityQueueCounter }` );
      line = `optimalInterval: ` + parseFloat( queue.optimalInterval.toFixed( 2 ) );
      if ( queue.optimalInterval == queue.originalInterval )
         line = `${ line } ( Original )`;
      this.log.info( line );

      this.log.info( `lowPriorityQueueAverageTime: ` + parseFloat( queue.lowPriorityQueueAverageTime.toFixed( 2 ) ) );
      this.log.info( `lowPriorityQueueAccumulatedTime: ` + parseFloat( queue.lowPriorityQueueAccumulatedTime.toFixed( 2 ) ) );
      line = `queue.variablePollingTimer.iv: ` + parseFloat( queue.variablePollingTimer.iv.toFixed( 2 ) );
      if ( queue.variablePollingTimer.iv == queue.originalInterval )
         line = `${ line } ( Original )`;
      this.log.info( line );
      this.log.info( `originalInterval: ${ queue.originalInterval }` );
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

   startQueue( queue )
   {
      queue.lowPriorityQueueIndex = 0 ;

      queue.enablePollingFirstTime( queue );
      queue.queueStarted = true;
      queue.startRecoveryTimer( queue );

   }
}

var queueExists = function( queueName )
{
   return settings.listOfCreatedPriorityQueues[ queueName ];
}

var addQueue = function( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, queueInterval = constants.DEFAULT_QUEUE_INTERVAL, queueMsg = constants.DEFAULT_QUEUEMSG, queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL )
{
   let queue = queueExists( queueName );
   if ( queue != undefined )
      return queue;

   log.info( `Creating new Priority Polled Queue "${ queueName }" with QueueType of: "${ queueType }" QueueInterval: ${ queueInterval } QueueMsg: ${ queueMsg } QueueStatMsgInterval: ${ queueStatMsgInterval }` );
   queue = new Cmd4PriorityPollingQueue( log, queueName, queueType, queueInterval, queueMsg, queueStatMsgInterval );
   settings.listOfCreatedPriorityQueues[ queueName ] = queue;

   return queue;

}

var parseAddQueueTypes = function ( log, entrys, options )
{
   if ( trueTypeOf( entrys ) != Array )
   {
      log.error( chalk.red( `Error: ${ constants.QUEUETYPES } is not an Array of { "Queue Name": "QueueType" }. found: ${ entrys }` ) );
      process.exit( 446 ) ;
   }
   entrys.forEach( ( entry, entryIndex ) =>
   {
      let queueName = constants.DEFAULT_QUEUE_NAME;
      let queueType = constants.DEFAULT_QUEUE_TYPE;
      let queueInterval = constants.DEFAULT_QUEUE_INTERVAL;
      let queueMsg = options.queueMsg;
      let queueStatMsgInterval = options.queueStatMsgInterval;

      for ( let key in entry )
      {
         let value = entry[ key ];
         let ucKey = ucFirst( key );

         switch( ucKey )
         {
            case constants.QUEUE:
               if ( settings.listOfCreatedPriorityQueues[ entry.queue ] )
               {
                  log.error( `QueueName: ${ entry.queue } was added twice` );
                  process.exit( 447 ) ;
               }
               queueName = value;

               break;
            case constants.QUEUETYPE:
               if ( value != constants.QUEUETYPE_WORM &&
                    value != constants.QUEUETYPE_SEQUENTIAL )
               {
                  log.error( chalk.red( `Error: QueueType: ${ entry.queueType } is not valid at index: ${ entryIndex }. Expected: ${ constants.QUEUETYPE_WORM } or ${ constants.QUEUETYPE_SEQUENTIAL }` ) );
                  process.exit( 448 ) ;
               }

               queueType = value;

               break;
            case constants.QUEUE_INTERVAL:
               if ( parseInt( value, 10 )  < 5 )
               {
                 log.error( chalk.red( `Error: Queue interval of ( ${ value }s ) to short at index: ${ entryIndex }. Expected: number >= 5s` ) );
                 process.exit( 448 ) ;
               }

               // Intervals are in seconds
               queueInterval = parseInt( value, 10 ) * 1000;

               break;
            case constants.QUEUEMSG:
              if ( typeof value != "boolean" )
              {
                 log.error( chalk.red( `Error: ${ constants.QUEUEMSG }: ${ value } is invalid at index: ${ entryIndex }. Expected: true/false` ) );
                 process.exit( 448 ) ;
              }
              queueMsg = value;

              break;
            case constants.QUEUE_STAT_MSG_INTERVAL:
              if ( typeof value != "number" && value < 5 )
              {
                 log.error( chalk.red( `Error: ${ constants.QUEUE_STAT_MSG_INTERVAL }: ${ value } is not a valid number index: ${ entryIndex }. Expected: number >= 5` ) );
                 process.exit( 448 );
              }
              queueStatMsgInterval = value;

              break;
            default:
               log.error( chalk.red( `Error: Unknown Queue option"${ key }  not provided at index ${ entryIndex }` ) );
               process.exit( 448 ) ;
         }
      }

      // At least a Queue name must be defined, the rest are defaulted
      if ( queueName == constants.DEFAULT_QUEUE_NAME )
      {
         log.error( chalk.red( `Error: "${ constants.QUEUE }"  not provided at index ${ entryIndex }` ) );
         process.exit( 448 ) ;
      }
      log.debug( `calling addQueue: ${ queueName } type: ${ queueType } queueInterval: ${ queueInterval } queueMsg: ${ queueMsg } queueStatMsgInterval: ${ queueStatMsgInterval }` );
      addQueue( log, queueName, queueType, queueInterval, queueMsg, queueStatMsgInterval );
   } );
}


module.exports = { addQueue,
                   parseAddQueueTypes,
                   queueExists,
                   Cmd4PriorityPollingQueue
                 }
