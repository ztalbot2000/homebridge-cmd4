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
   constructor( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, burstGroupSize = constants.DEFAULT_BURSTGROUP_SIZE, burstInterval = constants.DEFAULT_BURST_INTERVAL )
   {
      this.log = log;
      this.queueName = queueName;
      this.queueType = queueType;
      this.burstGroupSize = burstGroupSize;
      this.queueStarted = false;
      this.highPriorityQueue = [ ];
      this.lowPriorityQueue = [ ];
      this.lowPriorityQueueIndex = 0 ;
      this.lowPriorityQueueMaxLength = 0 ;
      this.inProgressGets = 0;
      this.inProgressSets = 0;
      this.variablePollingTimer = new VariableTimer( );
      this.safeToDoPollingFlag = false;
      this.queueMsg = constants.DEFAULT_QUEUEMSG;
      this.queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL;

      this.burstMode = true;
      if ( this.burstGroupSize == constants.DEFAULT_BURST_GROUP_SIZE )
        this.burstMode = false;
      else
         this.variablePollingTimer.iv = burstInterval;

      // Relieve possible congestion by low priority queue consuming
      // all the time that actually interacting with the real accessory
      // is slow
      this.lowPriorityQueueCounter = 0;
      this.lowPriorityQueueAverageTime = 0;
      this.lowPriorityQueueAccumulatedTime = 0;
      this.originalInterval = burstInterval;   // Defaults to 0
      this.optimalInterval = burstInterval;    // Defaults to 0

      // A primitive sanity timer
      this.sanityTimer = null;
      this.sanityTimerFlag = Date.now( );
      // Not a const so it can be manipulated during unit testing
      this.SANITY_TIMER_INTERVAL = 120000; // 2 minutes


      // Even with proper Queuing, 100% of interactions cannot be successful
      // when the device0 can be controlled independantly. So try to squash
      // repetitive failire messages.
      this.squashList = { };
      // Define it here so in Unit testing we can lower it.
      this.SQUASH_TIMER_INTERVAL = constants.DEFAULT_SQUASH_TIMER_INTERVAL; // 2 minutes
   }

   prioritySetValue( accTypeEnumIndex, characteristicString, timeout, stateChangeResponseTime,  value, callback )
   {
      let self = this;
      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.VALUE_lv ]: value } );

      // Call the callback immediately as we will call updateValue
      callback( null );

      self.queue.processQueue( HIGH_PRIORITY_SET, self.queue );
   }

   priorityGetValue( accTypeEnumIndex, characteristicString, timeout, callback )
   {
      let self = this;
      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: callback } );

      self.queue.processQueue( HIGH_PRIORITY_GET, self.queue );
   }

   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = accessory.queue;

      // These are all gets from polling
      queue.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

      queue.lowPriorityQueueMaxLength = queue.lowPriorityQueue.length ;

      // If not in burstMode then the very first characteristic being
      // polled has the interval of which polling will be done
      if ( queue.variablePollingTimer.iv == 0 && queue.burstMode == false )
      {
         queue.queueMsg = accessory.queueMsg;

         if ( queue.queueMsg == true )
            this.log.info( `Interval being used for queue: "${ queue.queueName }" is from  ${ accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } ${ constants.INTERVAL_lv }: ${ interval }` );

         queue.variablePollingTimer.iv = interval;

         queue.optimalInterval = interval;
         queue.originalInterval = interval;

         queue.queueStatMsgInterval = accessory.queueStatMsgInterval;
      }
   }

   processHighPrioritySetQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

      // Clear the sanity timer flag
      queue.sanityTimerFlag = Date.now( );

      if ( queue.inProgressSets > 0 || queue.inProgressGets > 0 )
      {
         this.log.debug( `High priority "Set" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ queue.inProgressSets } inProgressGets: ${ queue.inProgressGets }` );
         return;
      }

      this.log.debug( `Proccessing high priority queue "Set" entry: ${ entry.accTypeEnumIndex }` );
      queue.inProgressSets ++;
      entry.accessory.setValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, entry.stateChangeResponseTime, entry.value, function ( error )
      {
         let relatedCurrentAccTypeEnumIndex = entry.accessory.getDevicesRelatedCurrentAccTypeEnumIndex( entry.accTypeEnumIndex );

         if ( error == 0 &&
              relatedCurrentAccTypeEnumIndex != null )
         {
            let relatedCurrentCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;

            setTimeout( ( ) =>
            {
               // Change the entry to a get and set queueGetIsUpdate to true
               entry.isSet = false;
               entry.accTypeEnumIndex = relatedCurrentAccTypeEnumIndex;
               entry.characteristicString = relatedCurrentCharacteristicString;
               entry.queueGetIsUpdate = true;
               entry.accessory.queue.highPriorityQueue.unshift( entry );

               setTimeout( ( ) => { entry.accessory.queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0);

               return;

            }, entry.stateChangeResponseTime );

         }

         // Do not call the callback as it was done when the "Set" entry was 
         // created.

         queue.inProgressSets --;
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_SET, queue ); }, 0);

      }, true );
   }

   processHighPriorityGetQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

      // Clear the sanity timer flag
      queue.sanityTimerFlag = Date.now( );

      if ( queue.inProgressSets > 0 ||
           queue.inProgressGets > 0 && queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${queue.inProgressSets } inProgressGets: ${ queue.inProgressGets }` );
         return;
      }

      this.log.debug( `Proccessing high priority queue "Get" entry: ${ entry.accTypeEnumIndex }` );

      queue.inProgressGets ++;
      let pollingID = Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID, returnedErrMsg  )
      {
         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info(`More entries for pollingID of get error: ${ error } value: ${ properValue } returnedPollingID: ${ returnedPollingID }`);

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
            //entry.accessory.log.info( `Poll failed: ${ error } for queue: ${ queue.queueName } value: ${ properValue }` );
            entry.accessory.log.error( returnedErrMsg );
            //queue.squashError( queue, error, returnedErrMsg )

            // A response is expected for "Get" without update.
            if ( entry.queueGetIsUpdate == false )
               entry.callback( error );
         }


         queue.inProgressGets --;
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0);

      }, pollingID );
   }

   processEntryFromLowPriorityQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

      // Clear the sanity timer flag
      queue.sanityTimerFlag = Date.now( );

      if ( queue.inProgressSets > 0 ||
           queue.inProgressGets > 0 && queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `Low priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString }` );
         return;
      }

      this.log.debug( `Proccessing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let pollingID = Date.now( );
      queue.inProgressGets ++;
      queue.lowPriorityQueueCounter ++;
      let lowPriorityQueueStartTime = Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID, returnedErrMsg )
      {
         let lowPriorityQueueEndTime = Date.now( );

         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info(`(L)More entries for pollingID of get error:${error} val:${properValue} returnedPollingID:${returnedPollingID}`);

            return;
         }
         queue.lowPriorityQueueAccumulatedTime += lowPriorityQueueEndTime - lowPriorityQueueStartTime;
         queue.lowPriorityQueueAverageTime = queue.lowPriorityQueueAccumulatedTime / queue.lowPriorityQueueCounter;

         // This only applies to non burst mode
         if ( queue.burstMode == false )
         {
            // Make it 7x, but not less than the original interval
            // We need to accomodate the fact that the unit could
            // be interacted with manually.
            let optimal = 7 * queue.lowPriorityQueueAverageTime;
            if ( optimal > queue.originalInterval )
            {
               queue.optimalInterval = optimal;

               // Change the Polling timer interval to the optimal value
               queue.variablePollingTimer.set_interval( optimal );
            }
         }


         pollingID = -1;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );
         } else {

            queue.squashError( queue, error, returnedErrMsg )

         }

         // For the next one
         queue.inProgressGets --;

         // This will restart the polling timer if not anything else
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_GET, queue ); }, 0);
      }, pollingID );
   }

   squashError( queue, error, errMsg )
   {
      switch ( error )
      {
         // When the MyAir is busy, the result is empty strings or
         // null and while they are not passed to homebridge, polling
         // must slow.
         // break omitted
         case constants.ERROR_NULL_REPLY:
         case constants.ERROR_NULL_STRING_REPLY:
         case constants.ERROR_2ND_NULL_STRING_REPLY:
         case constants.ERROR_EMPTY_STRING_REPLY:
         case constants.ERROR_NO_DATA_REPLY:
         {
            // Say the error the first time.
            queue.log.error( errMsg );
            /* tmp
            if ( queue.squashList[ error ] == undefined )
            {
               // Say the error the first time.
               queue.log.error( errMsg );

               // The first one is emitted, so does not count
               let errList = { errCount: 0 , errTimer: null, errMsg: errMsg };
               queue.squashList[ error ] = errList;

               // Start the timer
               errList.errTimer = setTimeout( ( ) =>
               {
                  // Say the message again with the number of times
                  let entry = queue.squashList[ error ];

                  if ( entry.errCount > 0 )
                     queue.log.error( `This message has been omitted ${ entry.errCount } times => ${ entry.errMsg }` );

                  // Kill the squashList, for the next possible time
                  queue.squashList[ error ] = undefined;

               },  queue.SQUASH_TIMER_INTERVAL );


            } else {
               // increment the error counter
               queue.squashList[ error ].errCount += 1;
            }
            */
            break;
         }
         // These are not really errors caused by polling
         // break omitted
         case constants.ERROR_TIMER_EXPIRED:
         case constants.ERROR_NON_CONVERTABLE_REPLY:
         case constants.ERROR_CMD_FAILED_REPLY:
             // These would have been displayed in getValue
            break;
         case 0:
            // This is not an error.  it should not even be here
         // break omitted
         default:
         {
            //tmp queue.log.error( `Unhandled error: ${ error } errMsg: ${ errMsg }`  );
         }
      }
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
            // The check for Set already running is above
 
            // We cant have a low priority timer going off starting the queue during a set
            // even though it would do high priority first.
            queue.disablePolling( queue );

            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );

            return;

         } // HIGH PRIORITY GET SEQUENTIAL && WORM
         else if ( nextEntry.isSet == false &&
                   ( ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ) ||
                     queue.queueType == constants.QUEUETYPE_WORM
                   )
                 )
         {
            queue.processHighPriorityGetQueue( queue.highPriorityQueue.shift( ) );

            return;

         }
         // this.log.debug(`RETURNING lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

         // wait until transaction is done and calls this function
         return;

      } else  if ( lastTransactionType == HIGH_PRIORITY_SET ||
                   lastTransactionType == HIGH_PRIORITY_GET )
      {
         queue.enablePolling( queue, false );
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
            // Do Low Priority Queue all in bursts
            if ( queue.burstMode == true )
            {
               let burstSize = Math.ceil( queue.lowPriorityQueueMaxLength / queue.burstGroupSize );
               for ( let burstIndex = 0;
                     ( queue.lowPriorityQueueIndex < queue.lowPriorityQueueMaxLength &&
                     burstIndex < burstSize );
                     burstIndex++, queue.lowPriorityQueueIndex++ )
               {
                   queue.processEntryFromLowPriorityQueue( queue.lowPriorityQueue[ queue.lowPriorityQueueIndex ] );
               }
            } else {

               let nextEntry = queue.lowPriorityQueue[ queue.lowPriorityQueueIndex ];

               queue.processEntryFromLowPriorityQueue( nextEntry );

               queue.lowPriorityQueueIndex ++;

               // This only applies to non burst mode
               if ( queue.burstMode == false )
               {
                  // A 10% variance is okay
                  if ( queue.variablePollingTimer.iv > ( queue.optimalInterval * 1.1 ) )
                  {
                     if ( queue.queueMsg == true )
                        this.log.info( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is too reasonable. Using computed interval of ` + queue.optimalInterval.toFixed( 2 ) );

                     // Change the Polling timer interval to the optimal value
                     queue.variablePollintTimer.set_interval( queue.optimalInterval );

                     if ( queue.queueMsg == true )
                        queue.printQueueStats( queue );

                     if ( queue.variablePollingTimer.iv < ( queue.optimalInterval * .9 ) )
                     {
                        if ( queue.queueMsg == true )
                           this.log.warn( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is unreasonable. Using computed interval of ` + queue.optimalInterval.toFixed( 2 ) );

                        // Change the Polling timer interval to the optimal value
                        queue.variablePollingTimer.set_interval( queue.optimalInterval );

                     }

                     if ( queue.queueMsg == true &&
                          queue.lowPriorityQueueCounter % queue.queueStatMsgInterval == 0 )
                     {
                        queue.printQueueStats( queue );
                     }

                     queue.enablePolling( queue, false );
                  }
               }
            }
            // The index restarts from zero, if reached the end
            if ( queue.lowPriorityQueueIndex >= queue.lowPriorityQueueMaxLength )
               queue.lowPriorityQueueIndex = 0;
         }

      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          { // Noop

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          { // Noop, Nothing to do

             // Cant hurt to bump it
             queue.enablePolling( queue, false );

          } else {
             this.log.debug(`Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

             // Cant hurt to bump it
             queue.enablePolling( queue, false );
          }
      }
   }

   enablePolling( queue, firstTime = false )
   {
      this.log.debug( `enablePolling first time ${ firstTime } queue.safeToDoPollingNow: ${ queue.safeToDoPollingNow( queue ) }, queue.safeToDoPollingFlag: ${ queue.safeToDoPollingFlag }` );
      // If the flag is not already set
      if ( queue.safeToDoPollingNow( queue ) == false )
      {
         // And this is called from the Platform the first time
         this.log.debug( `enablePolling first time ${ firstTime }` );
         if ( firstTime )
         {
            this.log.debug( `Starting polling interval timer for the first time with interval: ${ queue.variablePollingTimer.iv }` );

            // The interval would have already been set by the first added get
            // or by the burstInterval
            queue.variablePollingTimer.start( ( ) =>
            {
               this.log.debug( "Polling interval Timer Firing safeToDoPollingFlag: %s", queue.safeToDoPollingFlag );
               if ( queue.safeToDoPollingNow( queue ) == true )
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
         this.log.debug( `Polling Timer created: ${ queue.variablePollingTimer } firstTime: ${ firstTime }` );
      }
   }
   disablePolling( queue )
   {
      queue.safeToDoPollingFlag = false;
   }
   startSanityTimer( queue )
   {
      if ( queue.sanityTimer == null )
      {
         queue.sanityTimer = setInterval( ( ) =>
         {
             this.log.debug( `inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length } safeToDoPollingFlag: ${ queue.safeToDoPollingFlag } interval: ${ queue.variablePollingTimer.iv } variablePollingTimer:${ queue.variablePollingTimer } ` );

            if ( queue.queueStarted == true )
            {
               // This actually is triggered upon the second interval
               if ( Date.now( ) > queue.sanityTimerFlag + this.SANITY_TIMER_INTERVAL )
               {
                  this.log.debug( `Sanity Timer Fixing Polling !!!  safeToDoPollingFlag: ${ queue.safeToDoPollingFlag } inProgressSets: ${ queue.inProgressSets } inProgressGets: ${ queue.inProgressGets } queue.variablePollingTimer.iv: ${ queue.variablePollingTimer.iv } variablePollingTimer: ${ queue.variablePollingTimer } ` );
                  if ( queue.variablePollingTimer == null )
                  {
                     // If it is not running, we got bigger problems
                     this.log.error( `Polling timer is null ???? ` );
                     process.exit(333);
                  }

                  if ( queue.safeToDoPollingNow( queue ) == false )
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
                  queue.sanityTimerFlag = Date.now( );

                  // Do not call startQueue as it starts this sanity timer
                  // instead, do what it did.
                  queue.lowPriorityQueueIndex = 0 ;

                  queue.queueStarted = true;

               } else
               {
                  // Set the sanity timer flag for next time;
                  queue.sanityTimerStaticFlag = queue.sanityTimerFlag;
               }
            }

         }, this.SANITY_TIMER_INTERVAL );

      }
   }
   safeToDoPollingNow( queue )
   {
      return queue.safeToDoPollingFlag;
   }
   printQueueStats( queue )
   {
      let line = `QUEUE "${ queue.queueName }" stats`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length) }` );
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
      this.log.info( `${ "=".repeat( line.length) }` );
      queue.lowPriorityQueue.forEach( ( entry, entryIndex ) =>
      {
         this.log.info( `${ entryIndex } ${ entry.accessory.displayName } characteristic:  ${ entry.characteristicString } accTypeEnumIndex: ${ entry.accTypeEnumIndex } interval: ${ entry.interval } timeout: ${ entry.timeout }` );
      });
   }

   startQueue( queue )
   {
      queue.lowPriorityQueueIndex = 0 ;

      queue.enablePolling( queue, true );
      queue.queueStarted = true;
      queue.startSanityTimer( queue );

   }
}

var queueExists = function( queueName )
{
   return settings.listOfCreatedPriorityQueues[ queueName ];
}

var addQueue = function( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, burstGroupSize = constants.DEFAULT_BURST_GROUP_SIZE, burstInterval = constants.DEFAULT_BURST_INTERVAL )
{
   let queue = queueExists( queueName );
   if ( queue != undefined )
      return queue;

   log.info( `Creating new Priority Polled Queue "${ queueName }" with QueueType of: "${ queueType }" burstGroupSize: ${ burstGroupSize } burstInterval: ${ burstInterval }` );
   queue = new Cmd4PriorityPollingQueue( log, queueName, queueType, burstGroupSize, burstInterval );
   settings.listOfCreatedPriorityQueues[ queueName ] = queue;

   return queue;

}

var parseAddQueueTypes = function ( log, entrys )
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
      let burstGroupSize = constants.DEFAULT_BURST_GROUP_SIZE;
      let burstInterval = constants.DEFAULT_BURST_INTERVAL;

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
            case constants.BURST_INTERVAL:
               if ( parseInt( value, 10 )  < 5 )
               {
                 log.error( chalk.red( `Error: Burst interval of ( ${ value }s /) to short at index: ${ entryIndex }. Expected: number >= 5s` ) );
                 process.exit( 448 ) ;
               }

               // Intervals are in seconds
               burstInterval = parseInt( value, 10 ) * 1000;

               break;
            case constants.BURST_GROUP_SIZE:
              if ( value <= 0 )
              {
                 log.error( chalk.red( `Error: ${ constants.BURST_GROUP_SIZE }: ${ value } is not valid at index: ${ entryIndex }. Expected: number > 0` ) );
                 process.exit( 448 ) ;
              }
              burstGroupSize = value;

              break
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
      if ( queueType == constants.QUEUETYPE_SEQUENTIAL  &&
           burstGroupSize >= 1 )
      {
         log.error( chalk.red( `Error: Queue Type: "${ constants.QUEUETYPE_SEQUENTIAL  }" and "${ constants.BURST_GROUP_SIZE }" are incompatible at index ${ entryIndex }` ) );
         process.exit( 448 ) ;
      }
      log.debug( `calling addQueue: ${ queueName } type: ${ queueType} burstGroupSize: ${ burstGroupSize } burstInterval: ${ burstInterval }` );
      addQueue( log, queueName, queueType, burstGroupSize, burstInterval );
   });
}


module.exports = { addQueue,
                   parseAddQueueTypes,
                   queueExists,
                   Cmd4PriorityPollingQueue
                 }
