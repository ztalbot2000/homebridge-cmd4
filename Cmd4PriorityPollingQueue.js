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


let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
let LOW_PRIORITY_GET = 2;

let cmd4Dbg = settings.cmd4Dbg;

class Cmd4PriorityPollingQueue
{
   constructor( log, queueName, queueType = constants.DEFAULT_QUEUE_TYPE, queueMsg = constants.DEFAULT_QUEUEMSG, queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL )
   {
      this.log = log;

      // This works better for Unit testing
      cmd4Dbg = log.debugEnabled;

      this.queueName = queueName;
      this.queueType = queueType;
      this.queueMsg = queueMsg;
      this.queueStatMsgInterval = queueStatMsgInterval;
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

      // - Not a const so it can be manipulated during unit testing
      this.pauseTimerTimeout = constants.DEFAULT_QUEUE_PAUSE_TIMEOUT;

   }

   prioritySetValue( accTypeEnumIndex, characteristicString, timeout, stateChangeResponseTime,  value, callback )
   {
      let self = this;

      let newEntry = { [ constants.IS_SET_lv ]: true, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.CALLBACK_lv ]: callback, [ constants.VALUE_lv ]: value };

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

      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: callback } );

      self.queue.processQueue( HIGH_PRIORITY_GET, self.queue );
   }

   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // These are all gets from polling
      accessory.queue.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

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
         if ( cmd4Dbg ) this.log.debug( chalk.red( `QUEUE ERROR: High priority "Set" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }`));
         return;
      }

      if ( cmd4Dbg ) this.log.debug( `Processing high priority queue "Set" entry: ${ entry.accTypeEnumIndex } length: ${ entry.accessory.queue.highPriorityQueue.length }` );

      entry.accessory.queue.inProgressSets ++;
      entry.accessory.setValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, entry.stateChangeResponseTime, entry.value, function ( error )
      {
         let relatedCurrentAccTypeEnumIndex = entry.accessory.getDevicesRelatedCurrentAccTypeEnumIndex( entry.accTypeEnumIndex );

         if ( error == 0 &&
              relatedCurrentAccTypeEnumIndex != null )
         {
            let relatedCurrentCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;

            // A set with no error means the queue is sane to do reading
            entry.accessory.queue.lastGoodTransactionTime = Date.now( );

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
         if ( cmd4Dbg ) this.log.debug( `High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }` );
         return;
      }

      if ( cmd4Dbg ) this.log.debug( `Processing high priority queue "Get" entry: ${ entry.accTypeEnumIndex } isUpdate: ${ entry.queueGetIsUpdate } length: ${ entry.accessory.queue.highPriorityQueue.length }` );

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

             // A good anything, updates the lastGoodTransactionTime
            entry.accessory.queue.lastGoodTransactionTime = Date.now( );

         } else
         {
            // A response is expected for "Get" without update.
            if ( entry.queueGetIsUpdate == false )
               entry.callback( error );

            entry.accessory.log.error( returnedErrMsg );

            entry.accessory.queue.pauseQueue( entry.accessory.queue );
         }

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
         if ( cmd4Dbg ) this.log.debug( `Low priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString }` );
         return;
      }

      if ( cmd4Dbg ) this.log.debug( `Processing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let pollingID =  Date.now( );
      entry.accessory.queue.inProgressGets ++;

      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID, returnedErrMsg )
      {

         // For the next one
         entry.accessory.queue.inProgressGets --;

         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
            entry.accessory.log.info( `More entries for pollingID of get error:${ error } val:${ properValue } returnedPollingID:${ returnedPollingID }` );

         pollingID = -1;

         // Nothing special was done for casing on errors, so omit it.
         if ( error == 0 )
         {
            entry.accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].characteristic ).updateValue( properValue );

             // A good anything, updates the lastGoodTransactionTime
            entry.accessory.queue.lastGoodTransactionTime = Date.now( );

         } else {
            entry.accessory.log.error( returnedErrMsg );
            entry.accessory.queue.pauseQueue( entry.accessory.queue );
         }

         // Now that this one has been processed, schedule it again.
         if ( cmd4Dbg ) entry.accessory.log.debug( `rescheduling entry` );

         entry.accessory.queue.scheduleLowPriorityEntry( entry )

      }, pollingID );
   }

   // The queue is self maintaining, except for lowPriorityEntries
   // which if passed in, must be rescheduled as they go by their own
   // intervals and thus must handle the return code.
   processQueue( lastTransactionType, queue, lowPriorityEntry = null )
   {
      // Set, No matter what, only one allowed
      if ( queue.inProgressSets > 0 )
      {
         // wait until transaction is done and calls this function
         return false;
      }

      // It is not a good time to do a "Get", so skip it
      if ( queue.lastGoodTransactionTime == 0 )
         return false;

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
               return false;

            queue.processHighPrioritySetQueue( queue.highPriorityQueue.shift( ) );

            return false;

         } // HIGH PRIORITY GET SEQUENTIAL && WORM
         else if ( nextEntry.isSet == false &&
                   ( ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ) ||
                     queue.queueType == constants.QUEUETYPE_WORM
                   )
                 )
         {

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

            return false;

         }
         // if ( cmd4Dbg ) this.log.debug( `RETURNING lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

         // wait until transaction is done and calls this function
         return false;

      } else  if ( lastTransactionType == HIGH_PRIORITY_SET ||
                   lastTransactionType == HIGH_PRIORITY_GET )
      {
         return false;
      }
      // This is self evident, until their are other types of Prioritys
      if ( lastTransactionType == LOW_PRIORITY_GET &&
           lowPriorityEntry != null &&
           queue.queueStarted == true )
      {
         // We had to be called by Polling because it is the only one
         // who sets the last transaction type to LOW_PRIORITY
         if ( queue.queueType == constants.QUEUETYPE_SEQUENTIAL && queue.inProgressGets == 0 ||
              queue.queueType == constants.QUEUETYPE_WORM ||
              queue.queueType == constants.QUEUETYPE_FREE_RUNNING )
         {
            queue.processEntryFromLowPriorityQueue( lowPriorityEntry );

            // We are processing the low priority queue entry.
            return true;
         }
         return false;
      } else {
          if ( lastTransactionType == LOW_PRIORITY_GET &&
               queue.queueStarted == false )
          {
             return false;

          } if ( queue.inProgressGets == 0 &&
                 queue.inProgressSets == 0 )
          {
             return false;

          } else {
             if ( cmd4Dbg ) this.log.debug( `Unhandled lastTransactionType: ${ lastTransactionType } inProgressSets: ${  queue.inProgressSets } inProgressGets: ${  queue.inProgressGets } queueStarted: ${ queue.queueStarted } lowQueueLen: ${ queue.lowPriorityQueue.length } hiQueueLen: ${ queue.highPriorityQueue.length }` );

          }
      }
   }

   scheduleLowPriorityEntry( entry )
   {
      let self = entry.accessory;
      let queue = entry.accessory.queue;

      if ( cmd4Dbg ) self.log.debug( `Scheduling Poll of index: ${ entry.accTypeEnumIndex } characteristic: ${ entry.characteristicString } for: ${ self.displayName } timeout: ${ entry.timeout } interval: ${ entry.interval }` );

      // Clear polling
      if ( queue.listOfRunningPolls &&
           queue.listOfRunningPolls[ self.displayName + entry.accTypeEnumIndex ] == undefined )
              clearTimeout( queue.listOfRunningPolls[ self.displayName + entry.accTypeEnumIndex ] );

      queue.listOfRunningPolls[ self.displayName + entry.accTypeEnumIndex ] = setTimeout( ( ) =>
      {
         // If the queue was busy/not available, schedule the entry at a later time
         if ( queue.processQueue( LOW_PRIORITY_GET, queue, entry ) == false )
         {
            if ( cmd4Dbg ) self.log.debug( `processsQueue returned false` );

            queue.scheduleLowPriorityEntry( entry );
         }

      }, entry.interval);
   }


   enablePollingFirstTime( queue )
   {
      let delay = 0;
      let staggeredDelays = [ 3000, 6000, 9000, 12000 ];
      let staggeredDelaysLength = staggeredDelays.length;
      let staggeredDelayIndex = 0;
      let lastAccessoryUUID = ""

      if ( cmd4Dbg ) this.log.debug( `enablePolling for the first time` );

      queue.lowPriorityQueue.forEach( ( entry, entryIndex ) =>
      {
         setTimeout( ( ) =>
         {
            if ( entryIndex == 0 )
               entry.accessory.log.info( `Started staggered kick off of ${ queue.lowPriorityQueue.length } polled characteristics` );

            if ( cmd4Dbg ) entry.accessory.log.debug( `Kicking off polling for: ${ entry.accessory.displayName } ${ entry.characteristicString } interval:${ entry.interval }, staggered:${ staggeredDelays[ staggeredDelayIndex ] }` );

            queue.scheduleLowPriorityEntry( entry );

            if ( entryIndex == queue.lowPriorityQueue.length -1 )
               entry.accessory.log.info( `All characteristics are now being polled` );

         }, delay );

         if ( staggeredDelayIndex++ >= staggeredDelaysLength )
            staggeredDelayIndex = 0;

         if ( lastAccessoryUUID != entry.accessory.UUID )
            staggeredDelayIndex = 0;

         lastAccessoryUUID = entry.accessory.UUID;

         delay += staggeredDelays[ staggeredDelayIndex ];

      });
   }

   pauseQueue( queue )
   {
      queue.lastGoodTransactionTime = 0;

      if ( queue.pauseTimer == null )
      {
         queue.pauseTimer = setTimeout( ( ) =>
         {
             // So we do not trip over this again immediately
             queue.lastGoodTransactionTime = Date.now( );
             queue.pauseTimer = null;

             queue.processQueue( HIGH_PRIORITY_GET, queue );

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

   startQueue( queue )
   {
      queue.lowPriorityQueueIndex = 0 ;

      queue.enablePollingFirstTime( queue );
      queue.queueStarted = true;
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

   if ( queueType != constants.QUEUETYPE_FREE_RUNNING )
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

               // No Longer applicable

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
      if ( cmd4Dbg ) log.debug( `calling addQueue: ${ queueName } type: ${ queueType } queueMsg: ${ queueMsg } queueStatMsgInterval: ${ queueStatMsgInterval }` );
      addQueue( log, queueName, queueType, queueMsg, queueStatMsgInterval );
   } );
}


module.exports = { addQueue,
                   parseAddQueueTypes,
                   queueExists,
                   Cmd4PriorityPollingQueue
                 }
