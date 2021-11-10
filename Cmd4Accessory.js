'use strict';

const moment = require( "moment" );

// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

let Logger = require( "./utils/Logger" );
const { getAccessoryName, getAccessoryDisplayName
      } = require( "./utils/getAccessoryNameFunctions" );
let getAccessoryUUID = require( "./utils/getAccessoryUUID" );
const { addQueue, parseAddQueueTypes, queueExists } = require( "./Cmd4PriorityPollingQueue" );

// Hierarchy variables
let HV = require( "./utils/HV" );

let createAccessorysInformationService = require( "./utils/createAccessorysInformationService" );

let lcFirst = require( "./utils/lcFirst" );
let trueTypeOf = require( "./utils/trueTypeOf" );

// The sObject.defineProperty is to resolve a lint issue.
// See utils/indexOfEnumLintTest.js for further information.
let indexOfEnum = require( "./utils/indexOfEnum" );
Object.defineProperty( exports, "indexOfEnum", { enumerable: true, get: function ( ){ return indexOfEnum.indexOfEnum; } });

// For changing validValue Constants to Values and back again
var { transposeConstantToValidValue,
    } = require( "./utils/transposeCMD4Props" );

let isJSON = require( "./utils/isJSON" );
let isCmd4Directive = require( "./utils/isCmd4Directive" );
let isAccDirective = require( "./utils/isAccDirective" );
let isDevDirective = require( "./utils/isDevDirective" );

// Pretty Colors
var chalk = require( "chalk" );

// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;

const Cmd4Storage = require( "./utils/Cmd4Storage" );

let FakeGatoHistoryService = null;

// Only one TV is allowed per bridge. Circumvented by
// publishing the TV externally.
let numberOfTVsPerBridge = 0;

// Array Remove
function removeFromArray( arr, val )
{
   for (let i = arr.length - 1; i >= 0; i--)
   {
      if (arr[i] === val)
      {
        // console.log("Removing %s", val );
        arr.splice(i, 1);
      }
   }
   return arr;
}

// Accessory definitions - THE GOOD STUFF STARTs HERE
//
//    An Homebridge accessory by default is passed the following params
//
// @params:
//   log        -  Logging functionality.
//   config     -  The JSON description of the accessory.
//   api        -  Homebridge API.
//
// @Optional params
//   parentInfo -  Optionally passed from a parent as if this is a linked accessory,
//                 or from a CMD4 Platform.
//
//
class Cmd4Accessory
{
   constructor( log, config, api, STORED_DATA_ARRAY, parentInfo )
   {

      // Non Platform accessories get called with homebridges Logger
      // replace with ours
      if ( typeof log.setOutputEnabled === "function" )
      {
         this.log = log;

         // Carry the debug flag from the platform
         settings.cmd4Dbg = log.debugEnabled;
      }
      else
      {
         this.log = new Logger( );

         if ( config[ constants.DEBUG ]  == true ||
              config[ "Debug" ]  == true ||
              process.env.DEBUG == settings.PLATFORM_NAME )
         {
            settings.cmd4Dbg = true;
         }

      }
      this.log.setDebugEnabled( settings.cmd4Dbg );

      this.config = config;
      this.api = api;
      // keep a copy because traversing it for format checking can be slow.
      this.Characteristic = api.hap.Characteristic;
      this.parentInfo = parentInfo;

      // Use parent values ( if any ) or these defaults.
      // LEVEL is a number, possibly 0 which must be handled more precisely.
      this.CMD4 = ( parentInfo && parentInfo.CMD4 ) ? parentInfo.CMD4 : constants.STANDALONE;
      this.LEVEL = ( parentInfo && parentInfo.LEVEL !== undefined ) ? parentInfo.LEVEL + 1 : 0;
      this.createdCmd4Accessories = ( parentInfo && parentInfo.createdCmd4Accessories ) ? parentInfo.createdCmd4Accessories : [ ];


      let typeMsg =  [ "", "Linked ", "Added " ][ this.LEVEL ] || "";

      if ( settings.cmd4Dbg ) log.debug( chalk.blue ( `Creating ${ typeMsg }${ this.CMD4 } Accessory type for : ${ config.displayName } LEVEL: ${ this.LEVEL }` ) );

      this.services = [ ];
      this.linkedAccessories = [ ];
      this.listOfVariables = { };
      this.listOfConstants = { };

      // Used to determine missing related characteristics and
      // to determine if the related characteristic is also polled.
      this.listOfPollingCharacteristics = { };

      // An extra flag
      this.ServiceCreated = false;

      // DisplayName and/or Name must be defined.
      // No need to update config anymore as it is no longer cached, only the Characteristic values are.
      this.name = getAccessoryName( this.config );
      this.displayName = getAccessoryDisplayName( this.config );


      // Everything that needs to talk to the device now goes through the queue
      this.queue = null;


      // Use the Hierarhy variables from the parent, if not create it.
      this.hV = new HV( );
      if ( parentInfo && parentInfo.hV )
      {
         this.hV.update( parentInfo.hV );
      }

      // In case it is not passed in.
      if ( STORED_DATA_ARRAY == undefined || STORED_DATA_ARRAY == null )
         this.STORED_DATA_ARRAY = [ ];
      else
         this.STORED_DATA_ARRAY = STORED_DATA_ARRAY;

      let parseConfigShouldUseCharacteristicValues = true;
      if ( ! Array.isArray( this.STORED_DATA_ARRAY ) )
      {
         this.log.warn( "STORED_DATA_ARRAY passed in is not an array and should be reported." );
         this.STORED_DATA_ARRAY = [ ];
      }

      // generate a unique id for the accessory this should be generated from
      // something globally unique, but constant, for example, the device serial
      // number or MAC address.
      let uuid = getAccessoryUUID( config, this.api.hap.uuid );

      // Handle case change
      let existingDataU = this.STORED_DATA_ARRAY.find( data => data[ "UUID" ] === uuid );
      if ( existingDataU )
      {
            //Z this.log.info( chalk.blue ( `THIS MSG TO BE REMOVED. RENAMING UUID for: ${ config.displayName } LEVEL: ${ this.LEVEL }` ) );
            existingDataU[ "uuid" ] = existingDataU[ "UUID" ];
            delete existingDataU[ "UUID" ];
      }

      // NOTE: We saved the data via lower case uuid.
      let existingData = this.STORED_DATA_ARRAY.find( data => data[ constants.UUID ] === uuid );

      if ( existingData )
      {
         //Z this.log.info( chalk.blue ( `THIS MSG TO BE REMOVED. Found existing data for: ${ this.displayName }` ) );
         if ( settings.cmd4Dbg ) this.log.debug(`Cmd4Accessory: found existingData for ${ this.displayName }` );
         if ( existingData.storedValuesPerCharacteristic )
         {
            //Z this.log.info( chalk.blue ( `THIS MSG TO BE REMOVED. Found old storedValuesPerCharacteristic for: ${ this.displayName }` ) );
            if ( settings.cmd4Dbg ) this.log.debug( `Upgrading to cmd4Storage` );
            this.cmd4Storage = new Cmd4Storage( this.log, existingData.storedValuesPerCharacteristic );
            this.STORED_DATA_ARRAY.push( { [ constants.UUID ]: uuid,
                                           [ constants.CMD4_STORAGE_lv ]: this.cmd4Storage
                                         }
                                        );
            //this.STORED_DATA_ARRAY.remove( existingData );
            removeFromArray( this.STORED_DATA_ARRAY, existingData );
         } else if ( existingData.cmd4Storage )
         {
            //Z this.log.info( chalk.blue ( `THIS MSG TO BE REMOVED. Using existing cmd4Storage for: ${ this.displayName }` ) );
            if ( settings.cmd4Dbg ) this.log.debug( `Using existing cmd4Storage` );
            this.cmd4Storage = new Cmd4Storage( this.log, existingData.cmd4Storage );
            this.STORED_DATA_ARRAY.push( { [ constants.UUID ]: uuid,
                                           [ constants.CMD4_STORAGE_lv ]: this.cmd4Storage
                                         }
                                        );
            //this.STORED_DATA_ARRAY.remove( existingData );
            removeFromArray( this.STORED_DATA_ARRAY, existingData );
         } else {
            //Z log.info( chalk.blue ( `THIS MSG TO BE REMOVED. Unexpected empty cmd4Storage for: ${ this.displayName }` ) );
            this.log.warn( `Unexpected empty cmd4Storage` );
            this.cmd4Storage = new Cmd4Storage( this.log );
            this.STORED_DATA_ARRAY.push( { [ constants.UUID ]: uuid,
                                           [ constants.CMD4_STORAGE_lv ]: this.cmd4Storage
                                         }
                                        );
            //this.STORED_DATA_ARRAY.remove( existingData );
            removeFromArray( this.STORED_DATA_ARRAY, existingData );
         }

         // Do not read stored values from config.json
         parseConfigShouldUseCharacteristicValues = false;
      } else
      {
         //Z log.info( chalk.blue ( `THIS MSG TO BE REMOVED. Creating new cmd4Storage for: ${ this.displayName }` ) );
         if ( settings.cmd4Dbg ) this.log.debug(`Cmd4Accessory: creating new cmd4Storage for ${ this.displayName }` );
         // Instead of local variables for every characteristic, create an array to
         // hold values for  all characteristics based on the size of all possible
         // characteristics.  Placing them in .config will make them be cached over
         // restarts.
         this.cmd4Storage = new Cmd4Storage( this.log );

         this.STORED_DATA_ARRAY.push( { [ constants.UUID ]: uuid,
                                        [ constants.CMD4_STORAGE_lv ]: this.cmd4Storage
                                      }
                                    );
      }

      // Direct if polling should be set or false.
      // You cannot copy polling from the parent because you would be copying the array
      // of polled characteristics that the child does not have, or turning on polling
      // for linked accessories too.
      //this.polling = false;


      // Init the Global Fakegato service once !
      if ( FakeGatoHistoryService == null )
         FakeGatoHistoryService = require( "fakegato-history" )( api );

      // Get the supplied values from the accessory config.
      this.parseConfig( this.config, parseConfigShouldUseCharacteristicValues  );

      // Update the accessories namespace for stored variables
      // like timeout, stateChangeResponseTime ... As it may require
      // changes from parseConfig.
      this.hV.update( this );

      // Add any required characteristics of a device that are missing from
      // a users config.json file.
      this.addRequiredCharacteristicStoredValues( );

      // The accessory cannot have the same UUID as any other
      checkAccessoryForDuplicateUUID( this, this.uuid );

      // The default response time is in seconds
      if ( ! this.stateChangeResponseTime )
         this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ].devicesStateChangeDefaultTime;

      // Check the polling config for characteristics that may be set there
      // and not in the config.json.
      this.checkPollingConfigForUnsetCharacteristics( this.polling );

      // Convert the accessoriesConfig ( if any ) to an array of Cmd4Accessory
      if ( this.accessoriesConfig && this.CMD4 == constants.PLATFORM && this.LEVEL == 0 )
      {
         log.info( `Creating accessories for: ${ this.displayName }` );

         // Let me explain.
         // Level 0 are standalone or platform.
         // Level 1 is linked.
         // Added accessories are on the same level as linked,
         // but they are not linkedTypes, just added to the platform.
         // For Example: TelevisionSpeaker.
         let savedLevel = this.LEVEL;
         this.LEVEL = 1; // will be incremented to 2.
         this.accessories = this.accessoryTypeConfigToCmd4Accessories( this.accessoriesConfig, this );
         this.LEVEL = savedLevel;
      }

      // Convert the linkedTypes ( if any ) to an array of Cmd4Accessory
      // Linked Accessories can be on Standalone or Platform Accessories.
      if ( this.linkedAccessoriesConfig && this.LEVEL == 0 )
      {
         log.info( `Creating linked accessories for: ${ this.displayName }` );
         this.linkedAccessories = this.accessoryTypeConfigToCmd4Accessories( this.linkedAccessoriesConfig, this );
      }

      // This sets up which characteristics, if any, will be polled
      // This can be done for only LEVEL 0 accessories and itself
      if ( this.LEVEL == 0 )
      {
         // if ( settings.cmd4Dbg ) log.debug( "CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
         // The linked accessory children are at different levels of recursion, so only
         // allow what is posssible.
         if ( this.linkedAccessories && this.linkedAccessories.length > 0 )
         {
            if ( settings.cmd4Dbg ) this.log.debug( `Setting up which characteristics will be polled for Linked Accessories of ${ this.displayName }` );

            this.linkedAccessories.forEach( ( linkedAccessory ) =>
            {
               if ( linkedAccessory.polling != false )
               {
                  linkedAccessory.determineCharacteristicsToPollForAccessory( linkedAccessory );
               }
            });
         }

         // The Television Speaker Platform Example
         if ( this.accessories && this.accessories.length > 0 )
         {
            if ( settings.cmd4Dbg ) this.log.debug( `Setting up which characteristics will be polled for Added Accessories of ${ this.displayName }` );
            this.accessories.forEach( ( addedAccessory ) =>
            {
               if ( addedAccessory.polling )
               {
                  addedAccessory.determineCharacteristicsToPollForAccessory( addedAccessory );
               }
            });
         }

         if ( settings.cmd4Dbg ) this.log.debug( `Setting up which characteristics will be polled for ${ this.displayName }` );
         this.determineCharacteristicsToPollForAccessory( this );
      }

      // Create all the services for the accessory, including fakegato and polling
      // Only true Standalone accessories can have their services created and
      // polling started. Otherwise the platform will have to do this.
      if ( this.CMD4 == constants.STANDALONE && this.LEVEL == 0 )
      {
         if ( settings.cmd4Dbg ) log.debug( `Creating Standalone service for: ${ this.displayName }` );
         this.createServicesForStandaloneAccessoryAndItsChildren( this )
      }

   } // Cmd4Accessory ( log, config, api, STORED_DATA_ARRAY, parentInfo )

   identify( callback )
   {
      callback( );
   }

   getServices( )
   {
      //if ( this.services )
      //{
      //   if ( settings.cmd4Dbg ) this.log.debug( Fg.Red + "ZZZZ Returning:%s number of services for:%s" + Fg.Rm, this.services.length, this.displayName );
      //} else {
      //   if ( settings.cmd4Dbg ) this.log.debug( Fg.Red + "ZZZZ Returning this.services:%s for:%s" + Fg.Rm, this.services, this.displayName );
      //}
      return this.services;
   }

   // Any required characteristic of an accessory that is not in the accessories
   // config will be added later by the existance of its stored value, so
   // find the missing characteristics and add their value s here.
   addRequiredCharacteristicStoredValues ( )
   {
      // Get the properties for this accessories device type
      let properties = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ];

      // Check if required characteristics should be added, or TLV8 removed.
      for ( let accTypeEnumIndex = 0 ; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex++ )
      {
         // Get the properties for this accessories device type
         let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ];

         // See if the characteristic index is in the required characteristics of the device
         let requiredIndex = devProperties.requiredCharacteristics.indexOfEnum( i => i.type === accTypeEnumIndex );

         let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;

         // No matter what, remove it
         if ( format == this.api.hap.Characteristic.Formats.TLV8 && this.hV.allowTLV8 == false )
         {
            if ( this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex ) != null )
            {
               this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, null );

               this.log.warn( `****** Removing TLV8 required characteristic: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }` );
            }
            continue;
         }

         // if it is required and not stored, add it
         if ( requiredIndex != -1 && this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex ) == null )
         {
            this.log.warn( `**** Adding required characteristic ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } for ${ this.displayName }` );
            this.log.warn( `Not defining a required characteristic can be problematic` );

            // Get the default value to store
            let defaultValue = properties.requiredCharacteristics[ requiredIndex ].defaultValue;

            // If ConfiguredName was not defined, then use the Accessories Name
            if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.ConfiguredName )
               defaultValue = getAccessoryName( this.config );

            if ( settings.cmd4Dbg ) this.log.debug( `*****Adding default value ${ defaultValue } for: ${ this.displayName }` );

            this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, defaultValue );
         }
      }
   }

   checkPollingConfigForUnsetCharacteristics( pollingConfig )
   {
      if ( trueTypeOf( pollingConfig ) != Array )
         return;

      if ( settings.cmd4Dbg ) this.log.debug( `Checking ${ this.displayName } for polling of unset characteristics.` );

      pollingConfig.forEach( ( jsonPollingConfig ) =>
      {
         let value;
         let valueToStore = null;
         let accTypeEnumIndex = -1;
         let key;

         for ( key in jsonPollingConfig )
         {
            value = jsonPollingConfig[ key ];

            let rcDirective = isCmd4Directive( key );
            if ( rcDirective == null )
            {
               rcDirective = isCmd4Directive( key, true );
               if ( rcDirective != null )
               {
                  // warn now
                  this.log.warn( `The config.json Cmd4 Polling Directive: ${ key } is Capitalized.  It should be: ${ rcDirective.key }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
                  // create the proper lower case value
                  jsonPollingConfig[ rcDirective.key ] = value;
                  // delete the upper case value
                  delete jsonPollingConfig[ key ];

                  //set the key
                  key = rcDirective.key;
               }
            }
            // Not finding the key is not an error as it could be a Characteristic


            switch ( key )
            {
               case constants.TIMEOUT:
               case constants.INTERVAL:
               // break omitted
               case constants.QUEUE:
               {
                  break;
               }
               case constants.QUEUETYPES:
               {
                  // This whole record is not a characteristic polling entry
                  // continue to next ( via return )
                  return;
               }
               case constants.CHARACTERISTIC:
               {
                  //2 checkPollingOfUnsetCharacteristics
                  valueToStore = null;

                  let rcDirective = isAccDirective( value, false );
                  if ( rcDirective.accTypeEnumIndex == null )
                  {
                     rcDirective = isAccDirective( value, true );
                     if ( rcDirective.accTypeEnumIndex == null )
                        throw new Error( `No such polling characteristic: "${ value }" for: "${ this.displayName }".` );

                     this.log.warn( `The config.json Polling characteristic: ${ value } is Capitalized it should be: ${ rcDirective.type }.  In the near future this will be an Error so that Cmd4 can use homebridge-ui.\nTo remove this Warning, Please fix your config.json.` );
                  }
                  accTypeEnumIndex = rcDirective.accTypeEnumIndex;

                  // We can do this as this is a new way to do things.
                  let storedValue = this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex );
                  if ( storedValue == undefined )
                     throw new Error( `Polling for: "${ value }" requested, but characteristic is not in your config.json file for: "${ this.displayName }".` );

                  // This makes thinks nice down below.
                  valueToStore = storedValue;
                  break;
               }
               default:
               {
                  // Is this still useful?
                  accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.indexOfEnum( key );

                  if ( accTypeEnumIndex < 0  )
                     // throw new Error( `OOPS: "${ key }" not found while parsing for characteristic polling. There something wrong with your config.json file?` );
                     throw new Error( `OOPS: "${ key }" not found while parsing for characteristic polling of "${ this.displayName }". There something wrong with your config.json file?` );

                  valueToStore = value;
               }
            }
         }

         if ( accTypeEnumIndex == -1 )
            throw new Error( `No characteristic found while parsing for characteristic polling of: "${ this.displayName }". There something wrong with your config.json file?` );

         if ( this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex ) == undefined )
         {
            this.log.warn( `Polling for: "${ key }" requested, but characteristic` );
            this.log.warn( `is not in your config.json file for: ${ this.displayName }` );
            this.log.warn( `This will be an error in the future.` );
         }

         this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, valueToStore );
      });
   }

   createServicesForStandaloneAccessoryAndItsChildren( accessory )
   {
      if ( settings.cmd4Dbg ) accessory.log.debug( chalk.blue( `createServicesFor${ this.CMD4 }AccessoryAndItsChildren` ) );
      if ( accessory.ServiceCreated == true )
      {
         if ( settings.cmd4Dbg ) accessory.log.debug( chalk.red( `SERVICES ALREADY CREATED FOR ${ this.displayName } ${ this.CMD4 } ${ this.LEVEL }` ) );
         return;
      } else {
         accessory.ServiceCreated = true;
      }



      let properties = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ];

      //
      // Standalone Accessory
      //
      // Create the accessory's service
      accessory.service = new properties.service( accessory.name, accessory.subType )

      if ( settings.cmd4Dbg ) accessory.log.debug( `Creating information service for standalone accessory: ${ accessory.displayName }` );


      // Create the Standalone accessory's information service.
      createAccessorysInformationService( accessory );

      // Create the Standalone accessory's services for all its linked children
      if ( accessory.linkedAccessories )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            let properties = CMD4_DEVICE_TYPE_ENUM.properties[ linkedAccessory.typeIndex ];

            // Standalone Step 4.
            //    const hdmi1InputService = this.tvAccessory.addService( this.Service.InputSource, `hdmi1', 'HDMI 1' );
            if ( settings.cmd4Dbg ) accessory.log.debug( `Standalone Step 4. linkedAccessory( ${ accessory.displayName } ).service = new Service( ${ linkedAccessory.name }, ${ linkedAccessory.subType } )` );
            linkedAccessory.service = new properties.service( linkedAccessory.name, linkedAccessory.subType )
            accessory.services.push( linkedAccessory.service );

            // Hmmm Double Check this !!
            // Create Information Service
            //if ( settings.cmd4Dbg ) linkedAccessory.log.debug( "Creating information service for linkedAccessory:%s", linkedAccessory.displayName );
            //createAccessorysInformationService( linkedAccessory );

            if ( settings.cmd4Dbg ) accessory.log.debug( `Standalone Step 5. ${ accessory.displayName }.service.addLinkedService( ${ linkedAccessory.displayName }.service` );
            // Standalone Step 5.
            //    tvService.addLinkedService( hdmi1InputService ); // link to tv service
            accessory.service.addLinkedService( linkedAccessory.service );

            linkedAccessory.addAllServiceCharacteristicsForAccessory( linkedAccessory );

            // Setup the fakegato service if defined in the config.json file
            linkedAccessory.setupAccessoryFakeGatoService( linkedAccessory.fakegatoConfig );

            // Move the information service to the top of the list
            linkedAccessory.services.unshift( linkedAccessory.informationService );

         });
      }

      accessory.addAllServiceCharacteristicsForAccessory( accessory );

      // Setup the fakegato service if defined in the config.json file
      accessory.setupAccessoryFakeGatoService( accessory.fakegatoConfig );

      accessory.services.push( accessory.service );

      // Move the information service to the top of the list
      accessory.services.unshift( accessory.informationService );

   }

   // ***********************************************
   //
   // setCachedValue:
   //   This methos will update the cached value of a
   //   characteristic of a accessory.
   //
   // ***********************************************
   setCachedValue( accTypeEnumIndex, characteristicString, value, callback )
   {
      let self = this;

      if ( self.hV.statusMsg == "TRUE" )
         self.log.info( chalk.blue( `Setting (Cached) ${ self.displayName } ${ characteristicString }` ) + ` ${ value }` );
      else
         if ( settings.cmd4Dbg ) self.log.debug( `setCachedvalue accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } value: ${ value }` );


      // Save the cached value.
      // Fakegato does not need to be updated as that is done on a "Get".
      self.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, value );

      let relatedCurrentAccTypeEnumIndex = this.getDevicesRelatedCurrentAccTypeEnumIndex( accTypeEnumIndex );

      // We are currently tring to set a cached characteristics 
      // like "Target*".
      // There is no way for its relatedCurrentAccTypeEnumIndex characteristic like "Current*"
      // to be set if cached or Polled (with the exception below).
      if ( relatedCurrentAccTypeEnumIndex != null )
      {
         // We are in a "Set" but this applies to the "Get" for why we would need to
         // set the relatedCurrentAccTypeEnumIndex Characteristic as well.

         if ( self.listOfPollingCharacteristics[ relatedCurrentAccTypeEnumIndex ])
         {
            let relatedCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;
            self.log.info( chalk.blue( `Also Setting (Cached) ${ self.displayName } ${ relatedCharacteristicString }` ) + ` ${ value }` );
            self.cmd4Storage.setStoredValueForIndex( relatedCurrentAccTypeEnumIndex, value );
         }
      }

      callback( null );
   }

   // ***********************************************
   //
   // GetCachedValue:
   //   This methos will return an accessories cached
   //   characteristic value.
   //
   // ***********************************************
   getCachedValue( accTypeEnumIndex, characteristicString, callback )
   {
      let self = this;

      let storedValue = self.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex );
      if ( storedValue == null || storedValue == undefined )
      {
         self.log.warn( `getCachedValue ${ characteristicString } for: ${ self.displayName } has no cached value` );

         callback( 10, null );
      }

      if ( settings.cmd4Dbg ) self.log.debug( `getCachedValue ${ characteristicString } for: ${ self.displayName } returned (CACHED) value: ${ storedValue }` );

      callback( 0, storedValue );

      // Store history using fakegato if set up
      self.updateAccessoryAttribute( accTypeEnumIndex, storedValue );
   }

   // Check props to see if any characteristic properties
   // are to be changed.  For example, currentTemperature
   // minValue to be below zero.
   configHasCharacteristicProps( accTypeEnumIndex )
   {
      if ( this.props == undefined )
         return undefined;

      if ( ! isJSON( this.props ) )
         return undefined;

      let characteristicProps = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props;
      let type = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( accTypeEnumIndex );
      let ucType = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( accTypeEnumIndex );

      let definitions;

      if ( this.props[ type ] )
         definitions = this.props[ type ];

      if ( this.props[ ucType ] )
         definitions = this.props[ ucType ];

      if ( ! definitions )
         return undefined;

      let rc = definitions;
      for ( let key in definitions )
      {
         // warn now
         if ( key.charAt( 0 ) === key.charAt( 0 ).toUpperCase() )
         {
            this.log.warn( `The property definition key: ${ key } is Capitalized.  In the near future all characteristics will start with a lower case character for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
         }
         let lcKey = lcFirst ( key );

         if ( characteristicProps[ lcKey ] == undefined )
            throw new Error( `props for key "${ key }" not in definition of "${ type }"` );


         if ( typeof characteristicProps[ lcKey ] !=  typeof definitions[ lcKey ] )
            throw new Error( `props for key "${ key }" type "${ typeof definitions[ key ] }" Not equal to definition of "${ typeof characteristicProps[ key ] }"` );

      }

      return rc;
   }
   checkCharacteristicNeedsFixing( accessory, accTypeEnumIndex )
   {
      // Hap keeps changing this where Current and Target don't match.
      // We fix this here.
      if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState )
      {
         if ( settings.cmd4Dbg ) this.log.debug( "fixing heatingCoolingState" );
         accessory.service.getCharacteristic(
            CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].
               characteristic ).setProps(
                  {
                    maxValue: 3,
                    validValues: [ 0, 1, 2, 3 ]
                });
      }

      return;
   }

   // ***********************************************
   //
   // addAllServiceCharacteristicsForAccessory:
   //     Method to set up all services for those characteristics in the
   //     config.json file.
   //
   //
   // Explanation:
   // If you are wondering why this is done this way as compared to
   // other plugins that do the switch and a bind in their getServices
   // section; It took a week to figure out why the security
   // system was not getting updated after setting the target state.
   // The get currentState needs to be called after the set targetState,
   // but that was not enough. Something is different with their
   // getServices bind implementation.  While everything works, for
   // some reason the IOS HomeKit app and even the Eve app never gets
   // the result of the get currentState.
   // I could delve further into their implementation, but this works.
   // It was one of many methods I tried after examining and trying
   // many plugins.
   // This method was taken from homebridge-real-fake-garage-doors by
   // plasticrake.
   // P.S  - This is probably more documentation of code anywhere
   //        in Homebridge :-)    If you find it useful, send
   //        me a like ;-)
   //
   //
   // Note: This code wipes out 5K of duplicate code.
   //       by using a bound function.  It appears
   //       to work on my iMac.
   //
   // ***********************************************
   addAllServiceCharacteristicsForAccessory( accessory )
   {
       if ( settings.cmd4Dbg ) accessory.log.debug( `Adding All Service Characteristics for: ${ accessory.displayName }` );

       let perms = "";

       // Check every possible characteristic
       for ( let accTypeEnumIndex = 0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex++ )
       {
          // For "Get" or "Set" commands, we send uppercase
          let uCCharacteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( accTypeEnumIndex );

          // If there is a stored value for this characteristic ( defined by the config file )
          // Then we need to add the characteristic too
          let storedValue = accessory.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex );
          if ( storedValue != undefined )
          {
             if ( settings.cmd4Dbg ) accessory.log.debug( "Found characteristic:%s value:%s for:%s",
                  uCCharacteristicString,
                  storedValue,
                  this.displayName );

             // Find out if the characteristic is not part of the service
             // and needs to be added.
             if ( ! accessory.service.testCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic ) )
             {
                //if ( settings.cmd4Dbg ) accessory.log.debug( "Adding optional characteristic:%s for: %s", CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, this.displayName );
                if ( settings.cmd4Dbg ) accessory.log.debug( "Adding optional characteristic:%s for: %s", uCCharacteristicString, this.displayName );

                accessory.service.addCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic );
             }

             this.checkCharacteristicNeedsFixing( accessory, accTypeEnumIndex );


             let props = accessory.configHasCharacteristicProps( accTypeEnumIndex );
             if ( props )
             {
                //if ( settings.cmd4Dbg ) accessory.log.debug( "Overriding characteristic %s props for: %s ", CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, this.displayName );
                if ( settings.cmd4Dbg ) accessory.log.debug( "Overriding characteristic %s props for: %s ", uCCharacteristicString, this.displayName );
                  accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].
                         characteristic )
                  .setProps(
                  {
                    // minValue: 18,
                    // maxValue: 30,
                    // minStep: 1
                    props
                });
             }

             // Get the permissions of characteristic ( Read/Write ... )
             // Both are 100% the same.
             // perms = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.perms
             perms = accessory.service.getCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                .characteristic ).props.perms;


             // Comment before change
             // "Read and or write, we need to set the value once.
             // If the characteristic was optional and read only, this will add
             //  it with the correct value.  You cannot add and set a read characteristic."
             //

             // What was happening was at startup all writeable characteristics were calling
             // setValue and the MyAir was getting hammered.

             // We need to check if the characteristic is readable but not writeable.
             // Things this will set are like:
             // - Name
             // - CurrentTemperature
             // - CurrentHeatingCoolingState
             // - StatusFault
             if ( perms.indexOf( this.api.hap.Characteristic.Perms.READ ) >= 0 &&
                  perms.indexOf( this.api.hap.Characteristic.Perms.WRITE ) == -1 ||
                  perms.indexOf( this.api.hap.Characteristic.Perms.PAIRED_READ ) >= 0 &&
                  perms.indexOf( this.api.hap.Characteristic.Perms.PAIRED_WRITE ) == -1 )
             {
             accessory.service.setCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic,
                      this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex ) );
             }


             // Add getValue via getCachedValue funtion to service
             if ( accessory.service.getCharacteristic(
                    CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                    .characteristic ).listeners( "get" ).length == 0 )
             {
                // Add Read services for characterisitcs, if possible
                if ( perms.indexOf( this.api.hap.Characteristic.Perms.READ ) != -1 )
                {

                   // getCachedValue or getValue
                   if ( ! accessory.polling ||
                          accessory.listOfPollingCharacteristics[ accTypeEnumIndex ] == undefined
                      )
                   {
                      if ( settings.cmd4Dbg ) this.log.debug( chalk.yellow( `Adding getCachedValue for ${ accessory.displayName } characteristic: ${ uCCharacteristicString } ` ) );
                      //Get cachedValue
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic )
                            .on( "get", accessory.getCachedValue.bind( accessory, accTypeEnumIndex, uCCharacteristicString ) );
                  } else
                  {
                      if ( settings.cmd4Dbg ) this.log.debug( chalk.yellow( `Adding priorityGetValue for ${ accessory.displayName } characteristic: ${ uCCharacteristicString }` ) );

                      let details = accessory.lookupAccessoryHVForPollingCharacteristic( accessory, accTypeEnumIndex );

                      // Set parms are accTypeEnumIndex, value, callback
                      // Get parms are accTypeEnumIndex, callback
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic )
                            .on( "get", accessory.queue.priorityGetValue.bind( accessory, accTypeEnumIndex, uCCharacteristicString, details.timeout ) );
                   }
                }
             }

             // Add setValue function to service
             if ( accessory.service.getCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                  .characteristic ).listeners( "set" ).length == 0 )
             {
                // Add Write services for characterisitcs, if possible
                if ( perms.indexOf( this.api.hap.Characteristic.Perms.WRITE ) != -1 )
                {
                   // setCachedValue or setValue
                   if ( ! accessory.polling ||
                        accessory.listOfPollingCharacteristics[ accTypeEnumIndex ] == undefined)
                   {
                      if ( settings.cmd4Dbg ) this.log.debug( chalk.yellow( `Adding setCachedValue for ${ accessory.displayName } characteristic: ${ uCCharacteristicString } ` ) );
                      // setCachedValue has parameters:
                      // accTypeEnumIndex, value, callback
                      // The first bound value though is "this"
                      let boundSetCachedValue = accessory.setCachedValue.bind( this, accTypeEnumIndex, uCCharacteristicString );
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic ).on( "set", ( value, callback ) => {
                             boundSetCachedValue( value, callback );

                      });

                   } else {
                      if ( settings.cmd4Dbg ) this.log.debug( chalk.yellow( `Adding prioritySetValue for ${ accessory.displayName } characteristic: ${ uCCharacteristicString } ` ) );

                      let details = accessory.lookupAccessoryHVForPollingCharacteristic( accessory, accTypeEnumIndex );

                      // Set parms are accTypeEnumIndex, value, callback
                      // Get parms are accTypeEnumIndex, callback
                      let boundSetValue = accessory.queue.prioritySetValue.bind( this, accTypeEnumIndex, uCCharacteristicString, details.timeout, details.stateChangeResponseTime );
                         accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic ).on( "set", ( value, callback ) => {
                             boundSetValue( value, callback );
                      });
                   }
                }
             }
          }
       }
   }

   updateAccessoryAttribute( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log.error( `Internal error: updateAccessoryAttribute - accTypeEnumIndex: ${ accTypeEnumIndex } for: ${ this.displayName } not found` );
         return;
      }

      this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, value );

      if ( this.loggingService )
      {
         let firstParm, secondParm, thirdParm;
         let firstParmValue, secondParmValue, thirdParmValue = 0;
         let firstParmDirective, secondParmDirective, thirdParmDirective;

         switch ( this.eve )
         {
            case constants.FAKEGATO_TYPE_ENERGY:
            {
               firstParm   = this.fakegatoConfig[ constants.POWER ] || "0";
               firstParmDirective = isAccDirective( firstParm, true );
               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.POWER }: ${ firstParmValue }` );
               // Eve Energy ( Outlet service )
               this.loggingService.addEntry(
                  { [ constants.TIME ]  :  moment( ).unix( ),
                    [ constants.POWER ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_ROOM:
            {
               firstParm       = this.fakegatoConfig[ constants.TEMP ]     || "0";
               firstParmDirective = isAccDirective( firstParm, true );
               secondParm      = this.fakegatoConfig[ constants.HUMIDITY ] || "0";
               secondParmDirective = isAccDirective( secondParm, true );
               thirdParm       = this.fakegatoConfig[ constants.PPM ]      || "0";
               thirdParmDirective = isAccDirective( thirdParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );
               secondParmValue = ( this.cmd4Storage.testStoredValueForIndex( secondParmDirective.accTypeEnumIndex ) == undefined ) ?
                      secondParmValue : this.cmd4Storage.getStoredValueForIndex( secondParmDirective.accTypeEnumIndex );
               thirdParmValue = ( this.cmd4Storage.testStoredValueForIndex( thirdParmDirective.accTypeEnumIndex ) == undefined ) ?
                      thirdParmValue : this.cmd4Storage.getStoredValueForIndex( thirdParmDirective.accTypeEnumIndex );


               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.TEMP }:${ firstParmValue } ${constants.HUMIDITY }:${ secondParmValue } ${ constants.PPM }:${ thirdParmValue }` );
               // Eve Room ( TempSensor, HumiditySensor and AirQuality Services )
               this.loggingService.addEntry(
                  { [ constants.TIME ]     : moment( ).unix( ),
                    [ constants.TEMP ]     : firstParmValue,
                    [ constants.HUMIDITY ] : secondParmValue,
                    [ constants.PPM ]      : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_WEATHER:
            {
               firstParm       = this.fakegatoConfig[ constants.TEMP ]     || "0";
               firstParmDirective = isAccDirective( firstParm, true );
               secondParm      = this.fakegatoConfig[ constants.PRESSURE ] || "0";
               secondParmDirective = isAccDirective( secondParm, true );
               thirdParm       = this.fakegatoConfig[ constants.HUMIDITY ] || "0";
               thirdParmDirective = isAccDirective( thirdParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );
               secondParmValue = ( this.cmd4Storage.testStoredValueForIndex( secondParmDirective.accTypeEnumIndex ) == undefined ) ?
                      secondParmValue : this.cmd4Storage.getStoredValueForIndex( secondParmDirective.accTypeEnumIndex );
               thirdParmValue = ( this.cmd4Storage.testStoredValueForIndex( thirdParmDirective.accTypeEnumIndex ) == undefined ) ?
                      thirdParmValue : this.cmd4Storage.getStoredValueForIndex( thirdParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.TEMP }: ${ firstParmValue } ${ constants.PRESSURE }: ${ secondParmValue } ${ constants.HUMIDITY }: ${ thirdParmValue }` );

               // Eve Weather ( TempSensor Service )
               this.loggingService.addEntry(
                  { [ constants.TIME ]     : moment( ).unix( ),
                    [ constants.TEMP ]     : firstParmValue,
                    [ constants.PRESSURE ] : secondParmValue,
                    [ constants.HUMIDITY ] : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_DOOR:
            {
               firstParm   = this.fakegatoConfig[ constants.STATUS ] || "0";
               firstParmDirective = isAccDirective( firstParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.STATUS } status: ${ firstParmValue }` );

               this.loggingService.addEntry(
                  { [ constants.TIME ]   : moment( ).unix( ),
                    [ constants.STATUS ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_MOTION:
            {
               firstParm   = this.fakegatoConfig[ constants.STATUS ] || "0";
               firstParmDirective = isAccDirective( firstParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.STATUS }: ${ firstParmValue }` );

               this.loggingService.addEntry(
                  { [ constants.TIME ]   : moment( ).unix( ),
                    [ constants.STATUS ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_THERMO:
            {
               firstParm       = this.fakegatoConfig[ constants.CURRENTTEMP ]   || "0";
               firstParmDirective = isAccDirective( firstParm, true );
               secondParm      = this.fakegatoConfig[ constants.SETTEMP ]       || "0";
               secondParmDirective = isAccDirective( secondParm, true );
               thirdParm       = this.fakegatoConfig[ constants.VALVEPOSITION ] || "0";
               thirdParmDirective = isAccDirective( thirdParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );
               secondParmValue = ( this.cmd4Storage.testStoredValueForIndex( secondParmDirective.accTypeEnumIndex ) == undefined ) ?
                      secondParmValue : this.cmd4Storage.getStoredValueForIndex( secondParmDirective.accTypeEnumIndex );
               thirdParmValue = ( this.cmd4Storage.testStoredValueForIndex( thirdParmDirective.accTypeEnumIndex ) == undefined ) ?
                      thirdParmValue : this.cmd4Storage.getStoredValueForIndex( thirdParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.CURRENTTEMP }: ${ firstParmValue } ${ constants.SETTEMP }:${ secondParmValue } ${constants.VALVEPOSITION }:${ thirdParmValue } ` );

               // Eve Thermo ( Thermostat service )
               this.loggingService.addEntry(
                  { [ constants.TIME ]          : moment( ).unix( ),
                    [ constants.CURRENTTEMP ]   : firstParmValue,
                    [ constants.SETTEMP ]       : secondParmValue,
                    [ constants.VALVEPOSITION ] : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_AQUA:
            {
               firstParm       = this.fakegatoConfig[ constants.STATUS ]      || "0";
               firstParmDirective = isAccDirective( firstParm, true );
               secondParm      = this.fakegatoConfig[ constants.WATERAMOUNT ] || "0";
               secondParmDirective = isAccDirective( secondParm, true );

               firstParmValue = ( this.cmd4Storage.testStoredValueForIndex( firstParmDirective.accTypeEnumIndex ) == undefined ) ?
                      firstParmValue : this.cmd4Storage.getStoredValueForIndex( firstParmDirective.accTypeEnumIndex );
               secondParmValue = ( this.cmd4Storage.testStoredValueForIndex( secondParmDirective.accTypeEnumIndex ) == undefined ) ?
                      secondParmValue : this.cmd4Storage.getStoredValueForIndex( secondParmDirective.accTypeEnumIndex );

               if ( settings.cmd4Dbg ) this.log.debug( `Logging ${ constants.STATUS }: ${ firstParmValue } ${ constants.WATERAMOUNT }: ${ secondParmValue }` );

               // Eve Aqua ( Valve service set to Irrigation Type )
               this.LoggingService.addEntry(
                  { [ constants.TIME ]        : moment( ).unix( ),
                    [ constants.STATUS ]      : firstParmValue,
                    [ constants.WATERAMOUNT ] : secondParmValue
                  });
               break;
            }
         }
      }
   }

   setupAccessoryFakeGatoService( fakegatoConfig )
   {
      if ( fakegatoConfig == undefined )
         return;

      for ( let key in fakegatoConfig )
      {
         let value = fakegatoConfig[ key ];

         let rcDirective = isCmd4Directive( key, false );
         if ( rcDirective == null )
         {
            rcDirective = isCmd4Directive( key, true );
            if ( rcDirective != null )
            {
               // warn now
               this.log.warn( `The config.json FakeGato key: ${ key } is Capitalized. It should be: ${ rcDirective.key }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
               // create the proper lower case value
               fakegatoConfig[ rcDirective.key ] = value;
               // delete the upper case value
               fakegatoConfig[ key ].remove();

               //set the key
               key = rcDirective.key;
            }
         }

         switch ( key )
         {
            case constants.EVE:
               this.eve = fakegatoConfig[ key ];
               switch( value )
               {
                   case constants.FAKEGATO_TYPE_ENERGY:
                   case constants.FAKEGATO_TYPE_ROOM:
                   case constants.FAKEGATO_TYPE_WEATHER:
                   case constants.FAKEGATO_TYPE_DOOR:
                   case constants.FAKEGATO_TYPE_MOTION:
                   case constants.FAKEGATO_TYPE_THERMO:
                   case constants.FAKEGATO_TYPE_AQUA:
                      break;
                   default:
                      throw new Error( `Invalid fakegato eve type: "${ value }". It must be one of ( ${ constants.FAKEGATO_TYPE_ENERGY }, ${ constants.FAKEGATO_TYPE_ROOM }, ${ constants.FAKEGATO_TYPE_WEATHER }, ${ constants.FAKEGATO_TYPE_DOOR }, ${ constants.FAKEGATO_TYPE_MOTION }, ${ constants.FAKEGATO_TYPE_THERMO }, ${ constants.FAKEGATO_TYPE_AQUA } ). Check the Cmd4 README at: "https://github.com/simont77/fakegato-history".` );
                }
                break;
            case constants.STORAGE:
                this.storage = fakegatoConfig[ key ];
                break;
            case constants.STORAGEPATH:
                this.storagePath = fakegatoConfig[ key ];
                break;
            case constants.KEYPATH:
                this.keyPath = fakegatoConfig[ key ];
                break;
            case constants.FOLDER:
                this.Folder = fakegatoConfig[ key ];
                break;
            case constants.STATUS:
            case constants.TEMP:
            case constants.SETTEMP:
            case constants.HUMIDITY:
            case constants.PPM:
            case constants.POWER:
            case constants.PRESSURE:
            case constants.CURRENTTEMP:
            case constants.VALVEPOSITION:
            {
               if ( value != "0" )
               {
                  let rcDirective = isAccDirective( value, false );
                  if ( rcDirective.accTypeEnumIndex == null )
                  {
                     rcDirective = isAccDirective( value, true );
                     if ( rcDirective.accTypeEnumIndex == null )
                        throw new Error( `Invalid characteristic "${ value }" for fakegato to log of "${ key }".` );

                    this.log.warn( `The config.json FakeGato characteristic: ${ value } is Capitalized it should be: ${ rcDirective.type }.  In the near future this will be an Error so that Cmd4 can use homebridge-ui.\nTo remove this Warning, Please fix your config.json.` );
                  }

                  // Make sure the characteristic is being polled (Changing) so I do
                  // not get any more tickets.
                  if ( this.queue.isCharacteristicPolled( rcDirective.accTypeEnumIndex, this.queue, this ) == false )
                     throw new Error(`Characteristic: "${ value }" for fakegato to log of "${ key }" is not being polled.\nHistory can not be updated continiously.` );
               }

               break;
            }
            default:
               throw new Error( `Invalid fakegato key: "${ key }" in json.config for: "${ this.displayName }".` );
         }
      }

      // Optional
      if ( this.storage != undefined )
      {
         if ( this.storage == constants.FS )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { [ constants.STORAGE ] : constants.FS,
                 [ constants.PATH ]   : this.storagePath
               }
            );
            this.services.push( this.loggingService );

         } else if ( this.storage == constants.GOOGLE_DRIVE )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { [ constants.STORAGE ] : constants.GOOGLE_DRIVE,
                 [ constants.FOLDER ]  : this.folder,
                 [ constants.KEYPATH ] : this.keyPath }
            );
            this.services.push( this.loggingService );
         } else
         {
            this.log.warn( chalk.yellow( "WARNING" ) + `: Cmd4 Unknown accessory config.storage:{ this.storage } Expected:${ constants.FS } or ${ constants.GOOGLEDRIVE } for: ${ this.displayName }` );
         }
      }

      if ( this.loggingService )
      {
         if ( ! this.polling )
         {
            this.log.warn( `config.storage: ${ this.storage } for: ${ this.displayName } set but polling is not enabled.` );
            this.log.warn( `      History will not be updated continiously.` );
         }
      }
   }

   validateStateCmd( state_cmd )
   {
      if ( typeof state_cmd != "string" )
         throw new Error( `No state_cmd for: "${ this.displayName }".` );

      // This was messy, did not like spaces. let the user be the judge of it.
      return true;
   }

   // We are looking for things like Volume: <value>, Name: <value>, Mute: <value>
   parseKeyForCharacteristics( key, value, parseConfigShouldUseCharacteristicValues )
   {
      // fix the their scripts, fix it here.
      let rcDirective = isAccDirective( key, false );
      if ( rcDirective.accTypeEnumIndex == null )
      {
         rcDirective = isAccDirective( key, true );
         if ( rcDirective.accTypeEnumIndex == null )
            throw new Error( `OOPS: "${ key }" not found for parsing characteristics in: "${ this.displayName }".` );

         this.log.warn( `The config.json characteristic key: ${ key } is Capitalized.  It should be: ${ rcDirective.type }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
      }


      let characteristicString = rcDirective.type;
      let accTypeEnumIndex = rcDirective.accTypeEnumIndex;

      // Do not update the stored values as it is being restored from cache
      if ( parseConfigShouldUseCharacteristicValues == false )
         return;

      if ( Object.keys( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues ).length > 0 )
      {
         // Even if outputConsts is not set, just in case, transpose it anyway.
         value = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value ) ;
      }


      // Return the appropriate type, by seeing what it is defined as in Homebridge,
      let properValue = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value );
      if ( properValue == undefined )
      {
         // If the value is not convertable, just return it.
         this.log.warn( `parseKeyForCharacterisitcs: ${ this.displayName } ` + chalk.red( `Cannot convert value: ${ value } to ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format } for ${ characteristicString }`  ) );

         return;
      }


      //this.log.debug("Setting %s to %s", characteristicString, properValue );
      this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, properValue );
   }

   processRequires( requiresArray )
   {
      if ( ! Array.isArray ( requiresArray ) )
         throw new Error( `requires must be an array of { "require": "some requires string" }` );

      // Iterate over the groups of key/value constants in the array.
      for ( let argIndex = 0; argIndex < requiresArray.length; argIndex++ )
      {
         let argEntry = requiresArray[ argIndex ];

         if ( argEntry.require == undefined )
            throw new Error( `Requires definition at index: "${ argIndex }" has no "require":"SomeRequire"` );

         let required = argEntry.require;

         if ( typeof required != "string" )
            throw new Error( `Requires definition: "${ required }"  must be a string.` );
         required = this.replaceConstantsInString( required );

         if ( settings.cmd4Dbg ) this.log.debug( `Requiring ${ required }` );

         require( required );
      }
   }

   processConstants( constantsArgArray )
   {
      if ( ! Array.isArray ( constantsArgArray ) )
         throw new Error( `Constants must be an array of { "key": "\${SomeKey}", "value": "some replacement string" }` );


      // Iterate over the groups of key/value constants in the array.
      for ( let argIndex = 0; argIndex < constantsArgArray.length; argIndex++ )
      {
         let argEntry = constantsArgArray[ argIndex ];

         if ( argEntry.key == undefined )
            throw new Error( `Constant definition at index: "${ argIndex }" has no "key":"\${SomeKey}"` );

         if ( argEntry.value == undefined )
            throw new Error( `Constant definition at index: "${ argIndex }" has no "value":"Some replacement string` );

         let keyToAdd = argEntry.key;
         let valueToAdd = argEntry.value;
         if ( ! keyToAdd.startsWith( "${" ) )
            throw new Error( `Constant definition for: "${ keyToAdd }" must start with "\${" for clarity.` );

         if ( ! keyToAdd.endsWith( "}" ) )
            throw new Error( `Constant definition for: "${ keyToAdd }" must end with "}" for clarity.` );

         // remove any leading and trailing single quotes
         // so that using it for replacement will be easier.
         valueToAdd.replace(/^'/, "")
         valueToAdd.replace(/'$/, "")

         this.listOfConstants[ keyToAdd ] = valueToAdd;
      }
   }

   processVariables( variablesArgArray )
   {
      if ( ! Array.isArray ( variablesArgArray ) )
         throw new Error( `Variables must be an array of { "key": "\${SomeKey}", "value": "some replacement string" }` );


      // Iterate over the groups of key/value constants in the array.
      for ( let argIndex = 0; argIndex < variablesArgArray.length; argIndex++ )
      {
         let argEntry = variablesArgArray[ argIndex ];

         if ( argEntry.key == undefined )
            throw new Error( `Variable definition at index: "${ argIndex }" has no "key":"\${SomeKey}"` );

         if ( argEntry.value == undefined )
            throw new Error( `Variable definition at index: "${ argIndex }" has no "value":"Some replacement string` );

         let keyToAdd = argEntry.key;
         let valueToAdd = argEntry.value;
         if ( ! keyToAdd.startsWith( "${" ) )
            throw new Error( `Variable definition for: "${ keyToAdd }" must start with "\${" for clarity.` );

         if ( ! keyToAdd.endsWith( "}" ) )
            throw new Error( `Variable definition for: "${ keyToAdd }" must end with "}" for clarity.` );

         // remove any leading and trailing single quotes
         // so that using it for replacement will be easier.
         valueToAdd.replace(/^'/, "")
         valueToAdd.replace(/'$/, "")

         this.listOfVariables[ keyToAdd ] = valueToAdd;
      }
   }

   accessoryTypeConfigToCmd4Accessories( config, parentInfo )
   {
      if ( ! config )
         return undefined;

      let that = this;

      if ( Array.isArray ( config ) )
      {
         let accessories = config.map( ( accessoryConfig ) => { return new Cmd4Accessory( that.log, accessoryConfig, this.api, this.STORED_DATA_ARRAY, this ) } );

         // Put the accessories into their correct collection array.
         parentInfo.createdCmd4Accessories.push( ...accessories );

         return accessories;
      }

      let accessory = new Cmd4Accessory( that.log, config, this.api, this.STORED_DATA_ARRAY, this );

      // Put the accessory into its correct collection array.
      parentInfo.createdCmd4Accessories.push( accessory );

      return [ accessory ];
   }

   processURL( url )
   {
      if ( typeof url != "string" )
         throw new Error( `url must be a string: "${ url }".` );

      this.url = this.replaceConstantsInString( url );
   }

   replaceConstantsInString( orig )
   {
      let finalAns = orig;

      for ( let key in this.listOfConstants )
      {
          let replacementConstant = this.listOfConstants[ key ];
          finalAns = finalAns.replace( key, replacementConstant );
      }
      return finalAns;
   }

   parseConfig( config, parseConfigShouldUseCharacteristicValues  )
   {
      let cmd4Mode = null;
      for ( let key in config )
      {
         let value = config[ key ];

         // warn now - Cmd4 Directives
         let rcDirective = isCmd4Directive( key, false );
         if ( rcDirective == null )
         {
            rcDirective = isCmd4Directive( key, true );
            if ( rcDirective != null )
            {
               this.log.warn( `The config.json Cmd4 Directive: ${ key } is Capitalized.  It should be: ${ rcDirective.key }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
               // create the proper lower case value
               config[ rcDirective.key ] = value;
               // delete the upper case value
               delete config[ key ];

               //set the key
               key = rcDirective.key;
            }
         }
         // Not finding the key is not an error as it could be a Characteristic

         switch ( key )
         {
            case constants.TYPE:
            {
               this.type = value;
               let rcValue = isDevDirective( value, false );
               if ( rcValue.devEnumIndex == null )
               {
                  rcValue = isDevDirective( value, true );
                  if ( rcValue.devEnumIndex == null )
                    throw new Error( `Unknown device type: "${ value }" given in: "${ this.displayName }".` );

                  // warn now
                  this.log.warn( `The config.json Cmd4 device type: ${ value } is lowerCase.  It should be: ${ rcValue.deviceName }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );

                  this.type = rcValue.deviceName;
               }
               this.typeIndex = rcValue.devEnumIndex;

               break;
            }
            case constants.SUBTYPE:
               this.subType = value;

               break;
            case constants.DISPLAYNAME:
               // DisplayName is not a characteristic but used as a parm when
               // creating the Service.  This has already been parsed, but
               // here so that parseConfig passes.
               this.displayName = value;

               break;
            case constants.UUID:
               // For those who define there own UUID
               this.uuid = value;

               break;
           case constants.ACCESSORY:
               // Do nothing as this is a key for homebridge, not us
               break;
           case constants.CATEGORY:
               // For those who define there own Category
               // Uppercase the category to be nice. Why do I know
               // this will come back to bite me.
               this.category = this.api.hap.Categories[ String( value ).toUpperCase( ) ];

               if ( ! this.category )
                  throw new Error( `Category specified: "${ value }" is not a valid homebridge category for: "${ this.displayName }".` );

               break;
            case constants.PUBLISHEXTERNALLY:
               // The user can make the accessory be published externally.
               this.publishExternally = value;

               break;
            case constants.PROPS:
               // Allow characteristic property changes.
               this.props = value;

               break;
            case constants.OUTPUTCONSTANTS:
               // Define if we should ouput constant strings
               this.outputConstants = value;

               break;
            case constants.STATUSMSG:
               // During state change, display a message or not
               if ( value === true )
                  this.statusMsg = "TRUE";
                else
                  this.statusMsg = "FALSE";

               break;
            case "QueueStatMsgInterval":
            case "QueueMsg":

               // Never put into production
               this.log.warn( `Warning: ${ key } has been deprecated. It was never even used.` );
               this.log.warn( `To remove this message, just remove ${ key } from your config.json` );

               break;
            case constants.QUEUETYPES:
               parseAddQueueTypes( this.log, value );

               break;
            case constants.QUEUE:
            {
               let queue = queueExists( value );
               if ( queue == undefined )
                  throw new Error( `"QueueType" must be defined first for queue "${ value }" in: "${ this.displayName }"` );

               this.queue = queue;

               break;
            }
            case constants.TIMEOUT:
               // Timers are in milliseconds. A low value can result in failure to get/set values
               this.timeout = parseInt( value, 10 );
               if ( this.timeout < 500 )
               {
                  this.log.warn( `Timeout for: ${ this.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low` );
               }

               break;
            case constants.POLLING:
               // Do not parse it yet as characteristics must be set first.
               this.polling = value;
               break;
            case "Cmd4_Mode":
            case "cmd4_Mode":
               this.log.warn( `Warning: ${ key } has been deprecated.` );
               cmd4Mode = value;

               break;
            case constants.INTERVAL:
               // Intervals are in seconds
               this.interval = parseInt( value, 10 ) * 1000;

               break;
            case constants.STATECHANGERESPONSETIME:
               // respnse time is in seconds
               this.stateChangeResponseTime = value * 1000;

               break;
            case constants.STATE_CMD_PREFIX:
               // Not 100% sure why this would be needed, but
               // added anyway since we have a suffix
               this.state_cmd_prefix = value;

               break;
            case constants.STATE_CMD_SUFFIX:
               // This gets added after any Get/Set <value>
               // We replace any constants already defined
               this.state_cmd_suffix = value;

               break;
            case constants.STATE_CMD:
               // What this plugin is all about
               this.state_cmd = value;

               break;
            case constants.STORAGE:
               this.storage = value;

               break;
            case constants.STORAGEPATH:
               this.storagePath = value

               break;
            case constants.FOLDER:
               this.folder = value

               break;
            case constants.KEYPATH:
               this.keyPath = value

               break;
            case constants.FAKEGATO:
               // Do not parse it yet as characteristics must be set first.
               this.fakegatoConfig = value;

               break;
            case constants.REQUIRES:
               this.processRequires( value );

               break;
            case constants.CONSTANTS:
               this.processConstants( value );

               break;
            case constants.VARIABLES:
               this.processVariables( value );

               break;
            case constants.LINKEDTYPES:
               if ( settings.cmd4Dbg ) this.log.debug(  `parseConfig. Found linked Accessories` );
               this.linkedAccessoriesConfig = value;

               break;
            case constants.ACCESSORIES:
               if ( settings.cmd4Dbg ) this.log.debug( `parseConfig. Found Accessories` );
               this.accessoriesConfig = value;

               break;
            case constants.URL:
               this.processURL( value );

               break;
            case constants.ALLOWTLV8:
               this.allowTLV8 = value;
               break;
            default:
            {
               this.parseKeyForCharacteristics( key, value, parseConfigShouldUseCharacteristicValues );
            }
         }
      }

      if ( cmd4Mode != null && this.polling )
      {
         if ( cmd4Mode == "Demo" )
            throw new Error("Demo mode is achieved when there are no polling entries in your config.json");

         this.log.warn( `Cmd4 has been simplified and optimized as per: https://git.io/JtMGR.` );
         this.log.warn( `To remove this message, just remove "Cmd4_Mode" from your config.json` );
      }

      // A device type must be specified
      if ( this.typeIndex == undefined || this.typeIndex < 0 )
          throw new Error( `Unknown device type: "${ this.type }" given in: "${ this.displayName }".` );

      // Create a subType to delimit services with multiple accessories of
      // the same type and possibly the same accessory.name.
      this.subType = this.subType || this.displayName;

      // UUID must be defined or created.
      this.uuid = this.uuid || getAccessoryUUID( config, this.api.hap.uuid );

      // Solve some issues people have encounterred who
      // have had problems with shell completion which is
      // only available from shell expansion.

      // State_cmd is only required when polling is enabled.
      if ( this.polling )
      {
         // throws its own exceptio if it fails
         this.validateStateCmd( this.state_cmd );
      } else
      {
         // Added accessories like input have no polled configuristics and therefore don't
         // deserve this message
         if ( this.level != 1)
            this.log.info( chalk.blue( `Cmd4 is running in Demo Mode for ${ this.displayName }` ) );
      }

      // Add the global constants to the listOfConstants
      if ( this.parentInfo && this.parentInfo.globalConstants != null )
         this.processConstants( this.parentInfo.globalConstants );

      // Handle seperation of strings of state_cmd for a prefix
      if ( this.state_cmd_prefix )
         this.state_cmd_prefix = this.state_cmd_prefix + " ";
      else
         this.state_cmd_prefix = "";

      // Handle seperation of strings of state_cmd for a suffix
      if ( this.state_cmd_suffix )
      {
         if ( typeof this.state_cmd_suffix != "string" )
            throw new Error( `state_cmd_suffix must be a string: "${ this.state_cmd_suffix }".` );

         this.state_cmd_suffix = " " + this.replaceConstantsInString( this.state_cmd_suffix );
      } else
      {
         this.state_cmd_suffix = "";
      }

      if ( this.typeIndex == CMD4_DEVICE_TYPE_ENUM.Television )
      {
          if ( this.CMD4 == constants.PLATFORM &&  ( ! this.publishExternally || ! this.category ) ||
               this.CMD4 == constants.STANDALONE )
          {
               this.log.warn( `Televisions should be Platform Accessories with "${ constants.PUBLISHEXTERNALLY }": true, "${ constants.CATEGORY }": "TELEVISION"` );
          }
          if ( this.CMD4 == constants.PLATFORM && ! this.publishExternally && ( numberOfTVsPerBridge += 1 ) > 1 )
          {
             this.log.warn( `Only one unpublished TV is allowed per bridge` );
          }
      }

      // Convert polling to an Array now so that it does not need to be done multiple times later.
      let pollingType = trueTypeOf( this.polling );

      switch( pollingType )
      {
         case null:
         case undefined:
            if ( settings.cmd4Dbg ) this.log.debug( `No polling configured.` );
            return;
         case Boolean:
            if ( settings.cmd4Dbg ) this.log.debug( `Polling config is Default Polling. Nothing to check for unset polling characteristics` );
            return;
         case String:
            throw new Error( `Unknown type for Polling "${ this.polling }" given in: "${ this.displayName }".` );
         case Array:
            break;
         case Object:
            this.log.warn( `Polling config for ${ this.displayName } should be an array.` );
            this.log.warn( `Converting to array, but this may be an error in the future.` );
            // Convert the object to an Array and try again.
            this.polling = [ this.polling ];
            return;
         default:
            throw new Error( `Do not know how to handle polling type of: "${ pollingType }" for: "${ this.displayName }".` );
      }

      // We need to check for removed characteristic Strings in the config
      for ( let accTypeEnumIndex = 0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
      {
         let storedValue = this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex );
         if ( storedValue != null )
         {

            // connect the accTypeEnumIndex to its characteristic string
            let lcCharacteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( accTypeEnumIndex );
            let ucCharacteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( accTypeEnumIndex );
            if ( config[ lcCharacteristicString  ] != undefined ||
                 config[ ucCharacteristicString  ] != undefined )
            {
               continue;
            } else
            {
               // There was a previously stored characteristic, if it was not initialized
               this.log.warn( `Removing previously configured characteristic: ${ lcCharacteristicString }` );
               this.cmd4Storage.setStoredValueForIndex( accTypeEnumIndex, null );
            }
         }
      }
   }

   // HV may change with polling characteristics
   lookupAccessoryHVForPollingCharacteristic( accessory, accTypeEnumIndex )
   {
      // Heirarchy is first the default
      let timeout = accessory.hV.timeout;
      let interval = accessory.hV.interval;
      let stateChangeResponseTime = accessory.hV.stateChangeResponseTime;

      // For testing purposes where there is no queue
      let queueName = null;
      if ( accessory.queue )
          queueName = accessory.queue.queueName;


      let pollingEntry = accessory.listOfPollingCharacteristics[ accTypeEnumIndex ];

      // There should only be one, if any
      if ( pollingEntry != undefined )
      {
         if ( pollingEntry.timeout )
            timeout = pollingEntry.timeout;
         if ( pollingEntry.interval )
            interval = pollingEntry.interval;
         if ( pollingEntry.stateChangeResponseTime )
            stateChangeResponseTime = pollingEntry.stateChangeResponseTime;
         if ( pollingEntry.queueName )
            queueName = pollingEntry.queueName;
      }

      return { [ constants.TIMEOUT_lv ]: timeout, [ constants.INTERVAL_lv ]: interval, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.QUEUE_NAME_lv ]: queueName };

   }

   getDevicesRelatedTargetAccTypeEnumIndex( accCurrentEnumIndex )
   {
      // Get the Devices required characteristics
      let requiredCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ].requiredCharacteristics;

      if ( requiredCharacteristicsArray.length  == 0 )
         return null;

      let found = requiredCharacteristicsArray.find( entry => entry.type == accCurrentEnumIndex );

      if ( found && found.relatedTargetAccTypeEnumArray.length > 0  )
         return found.relatedTargetAccTypeEnumArray[ 0 ];

      return null;

      // For Optional, the *Target* characteristic does not have to be
      // defined with the *Current* characteristic as *Current* is
      // optional, so may be *Target*

   }
   getDevicesRelatedCurrentAccTypeEnumIndex( accTargetEnumIndex )
   {
      // Get the Devices required characteristics
      let requiredCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ].requiredCharacteristics;

      if ( requiredCharacteristicsArray.length  == 0 )
         return null;

      let found = requiredCharacteristicsArray.find( entry => entry.type == accTargetEnumIndex );

      if ( found && found.relatedCurrentAccTypeEnumArray.length > 0 )
         return found.relatedCurrentAccTypeEnumArray[ 0 ];

      return null;
   }

   determineCharacteristicsToPollForAccessory( accessory  )
   {
      // Get the values based on their hierarchy.
      let timeout = accessory.hV.timeout;
      let interval = accessory.hV.interval;
      let stateChangeResponseTime = accessory.hV.stateChangeResponseTime;


      // We need to create the listOfPollingCharacteristics, even in Demo mode because
      // this list is also used to determine if the related characteristic should be set
      // which happens in the Demo mode without polling.
      if ( typeof accessory.polling == "object" )
      {
         if ( settings.cmd4Dbg ) this.log.debug( `Characteristic polling for: ${ accessory.displayName }` );
         accessory.polling.forEach( ( jsonPollingConfig ) =>
         {
            // Characteristic polling is a json type
            // let jsonPollingConfig = accessory.polling[ jsonIndex ];


            let value;
            let accTypeEnumIndex = -1;

            // All this code disappears in the next major release.
            for ( let key in jsonPollingConfig )
            {
               value = jsonPollingConfig[ key ];

               let rcDirective = isCmd4Directive( key );
               if ( rcDirective == null )
               {
                  rcDirective = isCmd4Directive( key, true );
                  if ( rcDirective != null )
                  {
                     this.log.warn( `The config.json Cmd4 Polling Directive: ${ key } is Capitalized.  It should be: ${ rcDirective.key }. In the near future this will be an error for homebridge-ui integration.\nTo remove this Warning, Please fix your config.json.` );
                     // create the proper lower case value
                     jsonPollingConfig[ rcDirective.key ] = value;
                     // delete the upper case value
                     delete jsonPollingConfig[ key ];

                     //set the key
                     key = rcDirective.key;
                  }
               }
               // Not finding the key is not an error as it could be a Characteristic

               switch ( key )
               {
                  case constants.TIMEOUT:
                     // Timers are in milliseconds. A low value can result in failure to get/set values
                     timeout = parseInt( value, 10 );
                     if ( timeout < 500 )
                        this.log.warn( `Timeout for: ${ accessory.displayName } is in milliseconds. A value of: ${ timeout } seems pretty low.` );

                     break;
                  case constants.INTERVAL:
                     // Intervals are in seconds
                     interval = parseInt( value, 10 ) * 1000;
                     break;
                  case constants.STATECHANGERESPONSETIME:
                     // respnse time is in seconds
                     stateChangeResponseTime = value * 1000;

                     break;
                  case constants.QUEUE:
                  {
                     if ( this.queue && this.queue.queueName != value )
                        throw new Error( chalk.red( `Already defined Priority Polling Queue "${ this.queue.queueName }" for ${ this.displayName } cannot be redefined.` ) );

                     this.queue = addQueue( this.log, value, constants.QUEUETYPE_WORM );

                     break;
                  }
                  case constants.CHARACTERISTIC:
                  {
                     rcDirective = isAccDirective( value, false );
                     if ( rcDirective.accTypeEnumIndex == null )
                     {
                        rcDirective = isAccDirective( value, true );
                        if ( rcDirective.accTypeEnumIndex == null )
                           throw new Error( `No such polling characteristic: "${ value }" for: "${ this.displayName }".` );

                        this.log.warn( `1. The config.json Polling characteristic: ${ value } is Capitalized it should be: ${ rcDirective.type }.  In the near future this will be an Error so that Cmd4 can use homebridge-ui.\nTo remove this Warning, Please fix your config.json.` );
                     }
                     accTypeEnumIndex = rcDirective.accTypeEnumIndex;

                     // We can do this as this is a new way to do things.
                     if ( this.cmd4Storage.getStoredValueForIndex( accTypeEnumIndex ) == undefined )
                        throw new Error( `CCC Polling for: "${ value }" requested, but characteristic is not in your config.json file for: "${ this.displayName }".` );

                     break;
                  }
                  case constants.QUEUETYPES:
                  {
                     parseAddQueueTypes( this.log, value );
                     // This whole record is not a characteristic polling entry
                     // continue to next ( via return )
                     return;
                  }
                  default:
                  {
                     // The key must be a characteristic property
                     // but first check if one has already been defined as we can only handle one at a time.
                     if ( accTypeEnumIndex != -1 )
                        throw new Error( `For charateristic polling, you can only define one characteristic per array item.\nCannot add "${ key }" as "${ characteristicString }" is already defined for: ${ accessory.displayName }` );

                     // This checks both upper and lower case
                     accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.indexOfEnum( key );
                     if ( accTypeEnumIndex < 0 )
                        throw new Error( `No such polling characteristic: "${ key }" for: "${ accessory.displayName }".` );

                  }
               }
            }

            // Everything now goes through the queue
            if ( this.queue == null )
            {
               this.queue = addQueue( this.log, "Q:" + this.displayName, constants.QUEUETYPE_STANDARD );
            }
            // This has to be UC as it gets passed to the getValue cmd string
            let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( accTypeEnumIndex );

            if ( settings.cmd4Dbg ) this.log.debug( `Setting up accessory: ${ accessory.displayName } for polling of: ${ characteristicString } timeout: ${ timeout } interval: ${ interval } queueName: "${ this.queue.queueName }"` );

            let record = { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: accTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.QUEUE_NAME_lv ]: this.queue.queueName };

            // Used to determine missing related characteristics and
            // to determine if the related characteristic is enabled.
            this.listOfPollingCharacteristics[ accTypeEnumIndex ] = record;

            this.queue.addLowPriorityGetPolledQueueEntry(
               record.accessory,
               record.accTypeEnumIndex,
               record.characteristicString,
               record.interval,
               record.timeout )


         });
      } else
      {
         // Even though polling might == undefined, we need to create a list of
         // would be polled characteristics for "Demo" mode
         // This list is also used to determine if the related characteristic should be set
         // which happens in the Demo mode without polling.
         if ( this.queue == null )
         {
            this.queue = addQueue( this.log, "Q:" + this.displayName, constants.QUEUETYPE_STANDARD );
         }

         // Make sure the defined characteristics will be polled
         CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ].defaultPollingCharacteristics.forEach( defaultPollingAccTypeEnumIndex =>
         {

            // This has to be UC as it gets passed to the getValue cmd string
            let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( defaultPollingAccTypeEnumIndex );
            let record = { [ constants.ACCESSORY_lv ]: accessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: defaultPollingAccTypeEnumIndex, [ constants.CHARACTERISTIC_STRING_lv ]: characteristicString, [ constants.INTERVAL_lv ]: interval, [ constants.TIMEOUT_lv ]: timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: stateChangeResponseTime, [ constants.QUEUE_NAME_lv ]: this.queue.queueName };

            // Used to determine missing related characteristics and
            // to determine if the related characteristic is also polled.
            this.listOfPollingCharacteristics[ record.accTypeEnumIndex ] = record;

            // Do not create the polling record or it will start polling
            if ( accessory.polling == true )
            {

               if ( settings.cmd4Dbg ) this.log.debug( `Adding ${ record.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ record.accTypeEnumIndex ].type }  record.timeout: ${ record.timeout } record.interval: ${ record.interval }  to Polled Queue ${ record.queueName }` );

               this.queue.addLowPriorityGetPolledQueueEntry(
                     record.accessory,
                     record.accTypeEnumIndex,
                     record.characteristicString,
                     record.interval,
                     record.timeout )
            }
         });
      }

      for( let accTypeEnumIndex in this.listOfPollingCharacteristics )
      {
         // Look to see if currently polled characteristics are like "Current*" and have
         // a related characteristic like "Target*"
         let relatedTargetAccTypeEnumIndex =
            this.getDevicesRelatedTargetAccTypeEnumIndex(
                    accTypeEnumIndex );

         if ( relatedTargetAccTypeEnumIndex != null )
         {
            // Check that the characteristic like "Target*" is also requested to be polled
            // We are in a "Set" but this applies to the "Get" for why we would need to
            // set the relatedCurrentAccTypeEnumIndex Characteristic as well.

            // - isRelated must be checked, because TemperatureSensors do
            //   not have *Target* characteristics.
            if ( this.listOfPollingCharacteristics[ relatedTargetAccTypeEnumIndex ] == undefined
               )
            {

               let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( accTypeEnumIndex );
               let relatedCharacteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( relatedTargetAccTypeEnumIndex );
               this.log.warn( `Warning, With polling for "${ characteristicString }" requested, you also must do polling of "${ relatedCharacteristicString }" or things will not function properly` );
            }
         }
      }
   }

}

// Compare accessory's UUID with those already created for possible duplicates
function checkAccessoryForDuplicateUUID( accessory, uuid )
{
   // check for UUID+subtype conflict
   if ( settings.cmd4Dbg ) accessory.log.debug( `Checking ${ accessory.name } for Duplicate UUID: ${ accessory.uuid }` );

   for ( let existingAccessory in accessory.createdCmd4Accessories )
   {
      if ( uuid == existingAccessory.uuid )
      {
         // This is the same check as what is in 
         // hap-nodejs/dist/lib/Accessory.js
         if ( accessory.service.subtype == existingAccessory.service.subtype )
         {
            accessory.log.error( chalk.red( `Error` ) + `: Cannot add a bridged Accessory with the same UUID as another bridged Accessory: ${ getAccessoryName( existingAccessory ) }` );

            if ( accessory.name == existingAccessory.name )
               accessory.log.error( chalk.red( `Duplicate accessory names can cause this issue.` ) );

            throw new Error( `It is wiser to define the second accessory in a different bridge.` );
         }
      }
      // Check for duplicates in Added accessories.
      if ( accessory.addedAccessories && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            checkAccessoryForDuplicateUUID( addedAccessory, uuid );
         });
      }

      // Check for duplicates in Linked accessories.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            checkAccessoryForDuplicateUUID( linkedAccessory, uuid );
         });
      }
   }

   if ( settings.cmd4Dbg ) accessory.log.debug( `No Duplicate UUID's for this Accessory - ` + chalk.green( `OK` ) + `. Using: ${ accessory.uuid }` );
}

exports.Cmd4Accessory = Cmd4Accessory;
