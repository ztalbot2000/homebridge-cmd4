'use strict';


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;


// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );


// Pretty Colors
var chalk = require( "chalk" );

let trueTypeOf = require( "./utils/trueTypeOf" );


let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
let LOW_PRIORITY_GET = 2;


class Cmd4PriorityPollingQueue
{
   constructor( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE )
   {
      this.log = log;
      this.queueName = queueName;
      this.queueType = queueType;
      this.queueStarted = false;
      this.highPriorityQueue = [ ];
      this.lowPriorityQueue = [ ];
      this.lowPriorityQueueIndex = 0 ;
      this.lowPriorityQueueMaxLength = 0 ;
      this.inProgressGets = 0;
      this.inProgressSets = 0;
      this.intervalPollingTimer = null;
      this.safeToDoPollingFlag = false;
      this.currentIntervalBeingUsed = 0;
      this.queueMsg = constants.DEFAULT_QUEUEMSG;
      this.queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL;


      // Relieve possible congestion by low priority queue consuming
      // all the time that actually interacting with the real accessory
      // is slow
      this.lowPriorityQueueCounter = 0;
      this.lowPriorityQueueAverageTime = 0;
      this.lowPriorityQueueAccumulatedTime = 0;
      this.originalInterval = 0;
      this.optimalInterval = 0;
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
      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: callback } );

      self.queue.processQueue( HIGH_PRIORITY_GET, self.queue );
   }

   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = accessory.queue;

      // These are all gets from polling
      queue.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

      queue.lowPriorityQueueMaxLength = queue.lowPriorityQueue.length ;
      if ( queue.currentIntervalBeingUsed == 0 )
      {
         queue.queueMsg = accessory.queueMsg;

         if ( queue.queueMsg == true )
            this.log.info( `Interval being used for queue: "${ queue.queueName }" is from  ${ accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } ${ constants.INTERVAL_lv }: ${ interval }` );
         queue.currentIntervalBeingUsed = interval;
         queue.optimalInterval = interval;
         queue.originalInterval = interval;
         queue.queueStatMsgInterval = accessory.queueStatMsgInterval;
      }
   }

   processHighPrioritySetQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

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
            let stateChangeResponseTime = entry.stateChangeResponseTime;
            if ( stateChangeResponseTime < queue.currentIntervalBeingUsed * .5 )
               stateChangeResponseTime = queue.currentIntervalBeingUsed * .5;

            entry.accessory.getValue( relatedCurrentAccTypeEnumIndex, relatedCurrentCharacteristicString, entry.timeout, function ( error, properValue) {
           {
              if ( error == 0 )
              {
                 entry.accessory.log.debug( chalk.blue( `characteristicPolling Updating ${ entry.accessory.displayName } ${ relatedCurrentCharacteristicString }` ) + ` ${ properValue }` );

                 entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].characteristic ).updateValue( properValue );
              }

           }});
         }

         entry.callback( 0 );
         queue.inProgressSets --;
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_SET, queue ); }, 0);

      }, true );
   }

   processHighPriorityGetQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

      if ( queue.inProgressSets > 0 ||
           queue.inProgressGets > 0 && queue.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${queue.inProgressSets } inProgressGets: ${ queue.inProgressGets }` );
         return;
      }

      this.log.debug( `Proccessing high priority queue "Get" entry: ${ entry.accTypeEnumIndex }` );

      queue.inProgressGets ++;
      let pollingID = Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID  )
      {
         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info(`More entries for pollingID of get error:${error} value:${properValue} returnedPollingID:${returnedPollingID}`);

            return;
         }

         pollingID = -1;

         entry.callback( error, properValue );

         queue.inProgressGets --;
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_GET, entry.accessory.queue ); }, 0);

      }, pollingID );
   }

   processEntryFromLowPriorityQueue( entry )
   {
      // Similiar to self = this, but more obvious and exact
      let queue = entry.accessory.queue;

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
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID )
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

         // Make it only 50% full, but not less than the original interval
         let optimal = 1.5 * queue.lowPriorityQueueAverageTime;
         if ( optimal > queue.originalInterval )
            queue.optimalInterval = optimal;


         pollingID = -1;

         switch( error )
         {
            case 0:
            {
               entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );
               break;
            }
            case constants.ERROR_TIMER_EXPIRED:
            // When the MyAir is busy, the result is empty strings or
            // null and while they are not passed to homebridge, polling
            // must slow.
            // break omitted
            case constants.ERROR_NULL_REPLY:
            case constants.ERROR_NULL_STRING_REPLY:
            case constants.ERROR_EMPTY_STRING_REPLY:
            case constants.ERROR_2ND_NULL_STRING_REPLY:
            case constants.exports.ERROR_NO_DATA_REPLY:
            {
                break;
            }
            // These are not really errors caused by polling
            // break omitted
            case constants.ERROR_CMD_FAILED_REPLY:
            case constants.ERROR_NON_CONVERTABLE_REPLY:
            {
               break;
            }
            default:
               entry.accessory.log.info( `Poll failed: ${ error  } for queue: ${ this.queueName }` );
          }

         // For the next one
         queue.inProgressGets --;

         // This will restart the polling timer if not anything else
         setTimeout( ( ) => { queue.processQueue( HIGH_PRIORITY_GET, queue ); }, 0);
      }, pollingID );
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
         // Hmm restart queue Timer ?
         queue.enablePolling( queue );
         return;
      }
      // This is self evident, until their are other types of Prioritys
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           queue.lowPriorityQueue.length > 0 &&
           queue.queueStarted == true )
      {
         let nextEntry = queue.lowPriorityQueue[ queue.lowPriorityQueueIndex ];
         // We had to be called by Polling because it is the only one
         // who sets the last transaction type to LOW_PRIORITY
         // It also turns off the safeToDoPollingFlag
         if ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ||
              queue.queueType == constants.QUEUETYPE_WORM )
         {
            queue.processEntryFromLowPriorityQueue( queue.lowPriorityQueue[ queue.lowPriorityQueueIndex ] );
            queue.lowPriorityQueueIndex ++;
            if ( queue.lowPriorityQueueIndex >= queue.lowPriorityQueueMaxLength )
               queue.lowPriorityQueueIndex = 0;

            // A 10% variance is okay
            if ( queue.currentIntervalBeingUsed > ( queue.optimalInterval * 1.1 ) )
            {
               if ( queue.queueMsg == true )
                    this.log.info( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is too reasonable. Using computed interval of ` + queue.optimalInterval.toFixed( 2 ) );

               queue.currentIntervalBeingUsed =  queue.optimalInterval;

               if ( queue.queueMsg == true )
                  queue.printQueueStats( queue );

               if ( queue.currentIntervalBeingUsed < ( queue.optimalInterval * .9 ) )
               {
                  if ( queue.queueMsg == true )
                     this.log.warn( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is unreasonable. Using computed interval of ` + queue.optimalInterval.toFixed( 2 ) );

                  queue.currentIntervalBeingUsed =  queue.optimalInterval;

                  if ( queue.queueMsg == true )
                     queue.printQueueStats( queue );

                  if ( queue.queueMsg == true &&
                       queue.lowPriorityQueueCounter % queue.queueStatMsgInterval == 0 )
                     queue.printQueueStats( queue );

                  queue.enablePolling( queue );
               }
            }
         }
      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          { // Noop

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          { // Noop, Nothing to do

             // Cant hurt to bump it
             queue.enablePolling( queue );

          } else {
             this.log.debug(`Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

             // Cant hurt to bump it
             queue.enablePolling( queue );
          }
      }
   }

   enablePolling( queue, firstTime = false )
   {
      this.log.debug( `1 enablePolling first time ${ firstTime } queue.safeToDoPollingNow: ${ queue.safeToDoPollingNow( queue ) }, queue.safeToDoPollingNow: ${ queue.safeToDoPollingFlag }` );
      // If the flag is not already set
      if ( queue.safeToDoPollingNow( queue ) == false )
      {
         // And this is called from the Platform the first time
         this.log.debug( `2 enablePolling first time ${ firstTime }` );
         if ( firstTime )
         {
            this.log.debug( `Starting polling interval timer for the first time` );
            queue.intervalPollingTimer = setInterval( ( ) =>
            {
               this.log.debug( "Polling interval Timer Firing safeToDoPollingFlag: %s", queue.safeToDoPollingFlag );
               if ( queue.safeToDoPollingNow( queue ) == true )
               {
                  queue.safeToDoPollingFlag = false;
                  queue.processQueue( LOW_PRIORITY_GET, queue );
                  queue.safeToDoPollingFlag = true;
               }

            }, queue.currentIntervalBeingUsed );
            // its safe to do Low Priority polling now, So when the interval
            // timer goes off, it can happen.
            queue.safeToDoPollingFlag = true;
         }
         this.log.debug( `Polling Timer created: ${ queue.intervalPollingTimer } firstTime: ${ firstTime }` );
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
             this.log.debug( `inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length } intervalPollingTimer:${ queue.intervalPollingTimer } safeToDoPollingFlag: ${ queue.safeToDoPollingFlag } interval: ${ queue.currentIntervalBeingUsed }` );

            if ( queue.queueStarted == true &&
                 queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
            {
            this.log.debug( "Sanity Timer checking Polling Timer %s: Bool %s interval:%s", queue.intervalPollingTimer, queue.safeToDoPollingFlag, queue.currentIntervalBeingUsed );
                  if ( queue.intervalPollingTimer == null )
                  {
                     this.log.error( `Polling  timer is null ???? ` );
                     process.exit(333);
                  }
               if ( queue.safeToDoPollingNow( queue ) == false )
               {

                  this.log.debug( "Sanity Timer Fixing Polling Timer: intervalPollingTimer: %s safeToDoPollingFlag: %s", queue.intervalPollingTimer, queue.safeToDoPollingFlag );
                  queue.enablePolling( queue );
               }
            }

         }, 120000  );

      }
   }
   safeToDoPollingNow( queue )
   {
      return queue.safeToDoPollingFlag;
   }
   printQueueStats( queue )
   {
      let line = `QUEUE "${ this.queueName }" stats`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length) }` );
      this.log.info( `iterations: ${ queue.lowPriorityQueueCounter }` );
      line = `optimalInterval: ` + parseFloat( queue.optimalInterval.toFixed( 2 ) );
      if ( queue.optimalInterval == queue.originalInterval )
         line = `${ line } ( Original )`;
      this.log.info( line );

      this.log.info( `lowPriorityQueueAverageTime: ` + parseFloat( queue.lowPriorityQueueAverageTime.toFixed( 2 ) ) );
      this.log.info( `lowPriorityQueueAccumulatedTime: ` + parseFloat( queue.lowPriorityQueueAccumulatedTime.toFixed( 2 ) ) );
      line = `currentIntervalBeingUsed: ` + parseFloat( queue.currentIntervalBeingUsed.toFixed( 2 ) );
      if ( queue.currentIntervalBeingUsed == queue.originalInterval )
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

var addQueue = function( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE )
{
   let queue = queueExists( queueName );
   if ( queue != undefined )
      return queue;

   log.info( `Creating new Priority Polled Queue "${ queueName }" with QueueType of: "${ queueType }"` );
   queue = new Cmd4PriorityPollingQueue( log, queueName, queueType );
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
      if ( trueTypeOf( entry.queue ) != String )
      {
         log.error( chalk.red( `Error: "${ constants.QUEUE }  not provided at index ${ entryIndex }` ) );
         process.exit( 448 ) ;
      }
      if ( entry.queueType == constants.QUEUETYPE_WORM ||
           entry.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         if ( settings.listOfCreatedPriorityQueues[ entry.queue ] )
         {
            log.error( `QueueName: ${ entry.queue } was added twice` );
            process.exit( 447 ) ;
         } else
         {
            log.debug( "calling addQueue: %s type: %s", entry.queue, entry.queueType );
            addQueue( log, entry.queue, entry.queueType );
         }

      } else {
         log.error( chalk.red( `Error: QueueType: ${ entry.queueType } is not valid at index: ${ entryIndex }. Expected: ${ constants.QUEUETYPE_WORM } or ${ constants.QUEUETYPE_SEQUENTIAL }` ) );
         process.exit( 448 ) ;
      }
   });
}


module.exports = { addQueue,
                   parseAddQueueTypes,
                   queueExists,
                   Cmd4PriorityPollingQueue
                 }
//exports.Cmd4PriorityPollingQueue = Cmd4PriorityPollingQueue;
