'use strict';


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;


// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

let isRelatedTargetCharacteristicInSameDevice = require( "./utils/isRelatedTargetCharacteristicInSameDevice" );

let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
let LOW_PRIORITY_GET = 1;

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
      this.lowPriorityTimer = null;
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

      self.queue.processQueue( HIGH_PRIORITY_SET );
   }

   priorityGetValue( accTypeEnumIndex, characteristicString, timeout, callback )
   {
      let self = this;
      self.queue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.ACCESSORY_lv ]: self, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: callback } );

      self.queue.processQueue( HIGH_PRIORITY_GET );
   }

   addLowPriorityGetPolledQueueEntry( accessory, accTypeEnumIndex, characteristicString, interval, timeout )
   {
      // These are all gets from polling
      this.lowPriorityQueue.push( { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout } );

      this.lowPriorityQueueMaxLength = this.lowPriorityQueue.length ;
      if ( this.currentIntervalBeingUsed == 0 )
      {
         this.queueMsg = accessory.queueMsg;

         if ( this.queueMsg == true )
            this.log.info( `Interval being used for queue: "${ this.queueName }" is from  ${ accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } ${ constants.INTERVAL_lv }: ${ interval }` );
         this.currentIntervalBeingUsed = interval;
         this.optimalInterval = interval;
         this.originalInterval = interval;
         this.queueStatMsgInterval = accessory.queueStatMsgInterval;
      }
   }

   processHighPrioritySetQueue( entry )
   {
      if ( this.inProgressSets > 0 || this.inProgressGets > 0 )
      {
         this.log.debug( `High priority "Set" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ this.inProgressSets } inProgressGets: ${ this.inProgressGets }` );
         return;
      }

      this.log.debug( `Proccessing high priority queue "Set" entry: ${ entry.accTypeEnumIndex }` );
      let self = this;
      this.inProgressSets ++;
      entry.accessory.setValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, entry.stateChangeResponseTime, entry.value, function ( error )
      {

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].relatedCurrentAccTypeEnumIndex;
         if ( error == 0 &&
              relatedCurrentAccTypeEnumIndex != null &&
              settings.arrayOfPollingCharacteristics.filter(
                 entry => entry.accessory.UUID == self.UUID &&
                 entry.accTypeEnumIndex == relatedCurrentAccTypeEnumIndex
              ).length > 0  &&
              isRelatedTargetCharacteristicInSameDevice(
                  self.typeIndex,
                  entry.accTypeEnumIndex,
                  CMD4_DEVICE_TYPE_ENUM,
                  CMD4_ACC_TYPE_ENUM
              ) == relatedCurrentAccTypeEnumIndex )
         {
            let pollingID = Date.now( );
            let relatedCharacteristic = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].characteristic;
            let stateChangeResponseTime = entry.stateChangeResponseTime;
            if ( stateChangeResponseTime < this.currentIntervalBeingUsed * .5 )
               stateChangeResponseTime = this.currentIntervalBeingUsed * .5;

            setTimeout(() => {
               entry.accessory.getValue( relatedCharacteristic, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID )
               {
                  // This function should only be called once, noted by the pollingID.
                  if ( pollingID != returnedPollingID )
                  {
                     entry.accessory.log.info("More entries for pollingID for related get");

                     return;
                  }

                  pollingID = -1;

                  self.inProgressSets --;
                  setTimeout( ( ) => { self.processQueue( HIGH_PRIORITY_SET ); }, 0);

               }, pollingID );
            }, stateChangeResponseTime );

         } else {

            self.inProgressSets --;
            setTimeout( ( ) => { self.processQueue( HIGH_PRIORITY_SET ); }, 0);
        }
      }, true );
   }

   processHighPriorityGetQueue( entry )
   {
      if ( this.inProgressSets > 0 ||
           this.inProgressGets > 0 && this.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${this.inProgressSets } inProgressGets: ${ this.inProgressGets }` );
         return;
      }

      this.log.debug( `Proccessing high priority queue "Get" entry: ${ entry.accTypeEnumIndex }` );

      this.inProgressGets ++;
      let pollingID = Date.now( );
      let self = this;
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

         self.inProgressGets --;
         setTimeout( ( ) => { self.processQueue( HIGH_PRIORITY_GET ); }, 0);

      }, pollingID );
   }

   processEntryFromLowPriorityQueue( entry )
   {
      if ( this.inProgressSets > 0 ||
           this.inProgressGets > 0 && this.queueType == constants.QUEUETYPE_SEQUENTIAL )
      {
         this.log.debug( `Low priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString }` );
         return;
      }

      this.log.debug( `Proccessing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let pollingID = Date.now( );
      this.inProgressGets ++;
      this.lowPriorityQueueCounter ++;
      let lowPriorityQueueStartTime = Date.now( );
      let self = this;
      entry.accessory.getValue( entry.accTypeEnumIndex, entry.characteristicString, entry.timeout, function ( error, properValue, returnedPollingID )
      {
         let lowPriorityQueueEndTime = Date.now( );

         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info(`(L)More entries for pollingID of get error:${error} val:${properValue} returnedPollingID:${returnedPollingID}`);

            return;
         }
         self.lowPriorityQueueAccumulatedTime += lowPriorityQueueEndTime - lowPriorityQueueStartTime;
         self.lowPriorityQueueAverageTime = self.lowPriorityQueueAccumulatedTime / self.lowPriorityQueueCounter;

         // Make it only 50% full, but not less than the original interval
         let optimal = 1.5 * self.lowPriorityQueueAverageTime;
         if ( optimal > self.originalInterval )
            self.optimalInterval = optimal;


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

         self.inProgressGets --;
      }, pollingID );

      this.lowPriorityQueue.push( entry );
   }

   processQueue( transactionType )
   {
      // Set, No matter what, only one allowed
      if ( this.inProgressSets > 0 )
      {
         // This is not true, It could be another Set has been issued
         //if ( transactionType == HIGH_PRIORITY_SET )
         //   this.log.error( `Queue stuck, inProgressSets ${ this.inProgressSets }` );

         // wait until transaction is done and calls this function
         return;
      }

      if ( this.highPriorityQueue.length > 0 )
      {
         let nextEntry = this.highPriorityQueue[ 0 ];

         if ( nextEntry.isSet == true )
         {
            // The check for Set already running is above
 
            // We cant have a low priority timer going off starting the queue during a set
            // even though it would do high priority first.
            this.stopPollingTimer( );

            this.processHighPrioritySetQueue( this.highPriorityQueue.shift( ) );

         } // HIGH PRIORITY GET SEQUENTIAL && WORM
         else if ( nextEntry.isSet == false &&
                   ( this.queueType == constants.QUEUETYPE_SEQUENTIAL && this.inProgressGets == 0 ||
                     this.queueType == constants.QUEUETYPE_WORM
                   )
                 )
         {
            this.processHighPriorityGetQueue( this.highPriorityQueue.shift( ) );

         } else
         {
            // wait until transaction is done and calls this function
            return;
         }
      } else if ( this.lowPriorityQueue.length > 0 &&
                  transactionType == LOW_PRIORITY_GET &&
                  this.queueStarted == true )
      {
         let nextEntry = this.lowPriorityQueue[ this.lowPriorityQueueIndex ];

         // We had to be called by Polling
         if ( this.queueType == constants.QUEUETYPE_SEQUENYIAL && this.inProgressGets == 0 ||
              this.queueType == constants.QUEUETYPE_WORM )
         {
            // We cant have a low priority timer going off starting the queue
            // even though it would do high priority first.
            this.stopPollingTimer( );

            this.processEntryFromLowPriorityQueue( this.lowPriorityQueue[ this.lowPriorityQueueIndex ] );
            this.lowPriorityQueueIndex ++;
            if ( this.lowPriorityQueueIndex >= this.lowPriorityQueueMaxLength )
               this.lowPriorityQueueIndex = 0;

            // A 10% variance is okay
            if ( this.currentIntervalBeingUsed > ( this.optimalInterval * 1.1 ) )
            {
               if ( this.queueMsg == true )
                    this.log.info( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is too reasonable. Using computed interval of ` + this.optimalInterval.toFixed( 2 ) );

               this.currentIntervalBeingUsed =  this.optimalInterval;

               if ( this.queueMsg == true )
                  this.printQueueStats( );

               if ( this.currentIntervalBeingUsed < ( this.optimalInterval * .9 ) )
               {
                  if ( this.queueMsg == true )
                     this.log.warn( `Interval for ${ nextEntry.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ nextEntry.accTypeEnumIndex ].type } is unreasonable. Using computed interval of ` + this.optimalInterval.toFixed( 2 ) );

                  this.currentIntervalBeingUsed =  this.optimalInterval;

                  if ( this.queueMsg == true )
                     this.printQueueStats( );

                  if ( this.queueMsg == true &&
                       this.lowPriorityQueueCounter % this.queueStatMsgInterval == 0 )
                     this.printQueueStats( );

                  this.startPollingTimer( );
               }
            }
         }
      } else {
          if ( transactionType == LOW_PRIORITY_GET &&
               this.queueStarted == false )
          { // Noop
          } if ( this.inProgressGets == 0 &&
                 this.inProgressGets == 0 )
          { // Noop, Nothing to do
          } else {
             this.log.debug(`Unhandled transactionType: ${ transactionType } inProgressSets: ${  this.inProgressSets } inProgressGets: ${  this.inProgressGets }` );
          }
      }
   }

   startPollingTimer( )
   {
      // If the queue is busy then the pollingTimer is not running
      if ( this.isPollingBeingDone( ) == false )
      {
         this.pollingTimer = setTimeout( ( ) =>
         {
            this.processQueue( LOW_PRIORITY_GET );

         }, this.currentIntervalBeingUsed );
      }
   }
   stopPollingTimer( )
   {
      // If the queue is not busy then the pollingTimer is running
      if ( this.isPollingBeingDone( ) == false )
      {
         clearTimeout( this.pollingTimer );
         this.pollingTimer = null;
      }
   }
   isPollingBeingDone( )
   {
      if ( this.pollingTimer == null )
         return true;

      return false;
   }
   printQueueStats( )
   {
      let line = `QUEUE "${ this.queueName }" stats`;
      this.log.info( line );
      this.log.info( `${ "=".repeat( line.length) }` );
      this.log.info( `iterations: ${ this.lowPriorityQueueCounter }` );
      line = `optimalInterval: ` + parseFloat( this.optimalInterval.toFixed( 2 ) );
      if ( this.optimalInterval == this.originalInterval )
         line = `${ line } ( Original )`;
      this.log.info( line );

      this.log.info( `lowPriorityQueueAverageTime: ` + parseFloat( this.lowPriorityQueueAverageTime.toFixed( 2 ) ) );
      this.log.info( `lowPriorityQueueAccumulatedTime: ` + parseFloat( this.lowPriorityQueueAccumulatedTime.toFixed( 2 ) ) );
      line = `currentIntervalBeingUsed: ` + parseFloat( this.currentIntervalBeingUsed.toFixed( 2 ) );
      if ( this.currentIntervalBeingUsed == this.originalInterval )
         line = `${ line } ( Original )`;
      this.log.info( line );
      this.log.info( `originalInterval: ${ this.originalInterval }` );
   }

   startQueue( )
   {
      this.lowPriorityQueueIndex = 0 ;
      this.queueStarted = true;

      this.startPollingTimer( )

   }
}
exports.Cmd4PriorityPollingQueue = Cmd4PriorityPollingQueue;
