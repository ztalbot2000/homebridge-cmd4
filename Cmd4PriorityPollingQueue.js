'use strict';


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;


// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

let isRelatedTargetCharacteristicInSameDevice = require( "./utils/isRelatedTargetCharacteristicInSameDevice" );


class Cmd4PriorityPollingQueue
{
   constructor( log, queueName )
   {
      this.log = log;
      this.queueName = queueName;
      this.queueStarted = false;
      this.highPriorityQueue = [ ];
      this.lowPriorityQueue = [ ];
      this.transactionInProgress = false;
      this.lowPriorityTimer = null;
      this.interval = constants.DEFAULT_INTERVAL;
   }
   addQueueEntry( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
   {
      if ( isSet || ! isSet && !isPolled )
      {
         // A mixture of gets and sets, all from IOS though
         this.highPriorityQueue.push( { "isSet": isSet, "isPolled": isPolled, "accessory": accessory, "accTypeEnumIndex": accTypeEnumIndex, "interval": interval, "timeout": timeout, "callback": callback, "value": value } );
         if ( this.queueStarted == true )
         {
            // We cant have a low priority timer going off starting the queue
            // even though it woukd do high priority first.
            if ( this.lowPriorityTimer != null )
            {
               // stopLowPriorityTimer
               clearTimeout( this.lowPriorityTimer );
               this.lowPriorityTimer = null;
            }

            this.processQueue( );
         }
      } else
      {
         // These are all gets from polling
         this.lowPriorityQueue.push( { "isSet": isSet, "isPolled": isPolled, "accessory": accessory, "accTypeEnumIndex": accTypeEnumIndex, "interval": interval, "timeout": timeout, "callback": callback, "value": value } );
      }

   }

   processAllFromHighPriorityQueue( )
   {
      let entry = this.highPriorityQueue.shift( );
      //console.log("******high priority processing %s", entry.accTypeEnumIndex );
      if ( entry.isSet )
      {
         this.log.debug( `Proccessing high priority queue "Set" entry: ${ entry.accTypeEnumIndex }` );
         let self = this;
         entry.accessory.setValue( entry.accTypeEnumIndex, entry.value, function ( error )
         {

            let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ entry.accTypeEnumIndex ].relatedCurrentAccTypeEnumIndex;
           if ( relatedCurrentAccTypeEnumIndex != null &&
                 settings.arrayOfPollingCharacteristics.filter( entry => entry.accessory.UUID == self.UUID &&
                                                                         entry.accTypeEnumIndex == relatedCurrentAccTypeEnumIndex
                                                              ).length > 0  &&
                 isRelatedTargetCharacteristicInSameDevice(
                     self.typeIndex,
                     entry.accTypeEnumIndex,
                     CMD4_DEVICE_TYPE_ENUM,
                     CMD4_ACC_TYPE_ENUM
                 ) == relatedCurrentAccTypeEnumIndex
            )
            {
               let pollingID = Date.now( );
               let relatedCharacteristic = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].characteristic;
               entry.accessory.getValue( relatedCharacteristic, function ( error, properValue, returnedPollingID )
               {
                  // This function should only be called once, noted by the pollingID.
                  if ( pollingID != returnedPollingID )
                  {
                     entry.accessory.log.info("More entries for pollingID for related get");

                     return;
                  }

                  pollingID = -1;

                  entry.callback( error );

                  setTimeout( ( ) => { self.processQueue( ); }, 0);

               }, pollingID );
            } else {

               entry.callback( error );

               setTimeout( ( ) => { self.processQueue( ); }, 0);
           }
         }, true );
      } else
      {
         this.log.debug( `Proccessing high priority queue "Get" entry: ${ entry.accTypeEnumIndex }` );
         let pollingID = Date.now( );
         let self = this;
         entry.accessory.getValue( entry.accTypeEnumIndex, function ( error, properValue, returnedPollingID  )
         {
            // This function should only be called once, noted by the pollingID.
            if ( pollingID != returnedPollingID )
            {
               entry.accessory.log.info(`More entries for pollingID of get error:${error} val:${properValue} returnedPollingID:${returnedPollingID}`);

               return;
            }

            pollingID = -1;

            entry.callback( error, properValue );

            setTimeout( ( ) => { self.processQueue( ); }, 0);

         }, pollingID );
      }
   }

   processEntryFromLowPriorityQueue( )
   {
      let entry = this.lowPriorityQueue.shift( );
      this.log.debug( `Proccessing low priority queue entry: ${ entry.accTypeEnumIndex }` );

      let pollingID = Date.now( );
      entry.accessory.getValue( entry.accTypeEnumIndex, function ( error, properValue, returnedPollingID )
      {
         // This function should only be called once, noted by the pollingID.
         if ( pollingID != returnedPollingID )
         {
            entry.accessory.log.info(`(L)More entries for pollingID of get error:${error} val:${properValue} returnedPollingID:${returnedPollingID}`);

            return;
         }

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

      }, pollingID );

      this.lowPriorityQueue.push( entry );
   }
   processQueue( )
   {
      // While not necessarily needed, this helps
      // with unit testing with processEntryFromLowPriorityQueue and
      // processAllFromHighPriorityQueue where because of this check
      // they would not run forever.
      if ( this.queueStarted == true )
      {
         if ( this.highPriorityQueue.length > 0 )
         {
            setTimeout( ( ) => { this.processAllFromHighPriorityQueue( ); }, 0 );

         } else
         {
            if ( this.lowPriorityQueue.length > 0 )
            {
               let entry = this.lowPriorityQueue[ 0 ];
               this.processEntryFromLowPriorityQueue( );
               this.lowPriorityTimer = setTimeout( ( ) =>
               {
                  this.processQueue( );
               }, entry.interval );
            }
         }
      }
   }

   startQueue( )
   {
      this.queueStarted = true;

      setTimeout( ( ) => { this.processQueue( ); }, 0 );
   }
}
exports.Cmd4PriorityPollingQueue = Cmd4PriorityPollingQueue;
