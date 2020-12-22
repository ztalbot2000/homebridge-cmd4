'use strict';

// 3rd Party includes
const exec = require( "child_process" ).exec;
const moment = require( "moment" );
const fs = require( "fs" );
const commandExistsSync = require( "command-exists" ).sync;

// Cmd4 includes seperated out for Unit testing
const { getAccessoryName, getAccessoryDisplayName
      } = require( "./utils/getAccessoryNameFunctions" );
let getAccessoryUUID = require( "./utils/getAccessoryUUID" );

let ucFirst = require( "./utils/ucFirst" );
let indexOfEnum = require( "./utils/indexOfEnum" );

// For changing validValue Constants to Values and back again
var { transposeConstantToValidValue,
      transposeValueToValidConstant
    } = require( "./utils/transposeCMD4Props" );

// Correct type of given values to match characteristics format.
let characteristicValueToItsProperType =
   require( "./utils/characteristicValueToItsProperType" );

let isJSON = require( "./utils/isJSON" );

// Pretty Colors
var Fg = require("./utils/colors");

// The Library files that know all.
var ACC_DATA = require( "./lib/CMD4_ACC_TYPE_ENUM" );
// This would be the uninitialized value ( No Characteristics )
var CMD4_ACC_TYPE_ENUM = ACC_DATA.CMD4_ACC_TYPE_ENUM;

var DEVICE_DATA = require( "./lib/CMD4_DEVICE_TYPE_ENUM" );
// This would be the uninitialized value ( No Characteristics )
var CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.CMD4_DEVICE_TYPE_ENUM;

// Constants
const PLUGIN_NAME   = "homebridge-cmd4";
const PLATFORM_NAME = "Cmd4";

const SLOW_STATE_CHANGE_RESPONSE_TIME   = 10000;  // 10 seconds
const MEDIUM_STATE_CHANGE_RESPONSE_TIME = 3000;   // 3 seconds
const FAST_STATE_CHANGE_RESPONSE_TIME   = 1000;   // 1 second

const DEFAULT_TIMEOUT  = 60000; // 1 minute
const DEFAULT_INTERVAL = 60000; // 1 minute

const FAKEGATO_TYPE_ENERGY  = "energy",
      FAKEGATO_TYPE_ROOM    = "room",
      FAKEGATO_TYPE_WEATHER = "weather",
      FAKEGATO_TYPE_DOOR    = "door",
      FAKEGATO_TYPE_MOTION  = "motion",
      FAKEGATO_TYPE_THERMO  = "thermo",
      FAKEGATO_TYPE_AQUA    = "aqua";

// Triggers which Array CMD4Accessory will be placed
// Either cmd4Accessories or cmd4StandaloneAccessories
const STANDALONE = "Standalone";
const PLATFORM   = "Platform";
const COLLECTION = "Collection";

var FakeGatoHistoryService;
var API;

// An Array of Homebridge Platforms
let cmd4Platforms  = [ ];

// Only one TV is allowed per bridge. Circumvented by
// publishing the TV externally.
let numberOfTVsPerBridge = 0;

// Did not change to Class because export of class
// does not like following exports needed for unit testing.
module.exports =
{
   default: function ( api )
   {
      API = api;

      CMD4_ACC_TYPE_ENUM = ACC_DATA.init( api.hap.Characteristic );
      CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, api.hap.Service, api.hap.Characteristic, api.hap.Categories );

      api.registerAccessory( PLATFORM_NAME, Cmd4Accessory );
      api.registerPlatform( PLATFORM_NAME, Cmd4Platform );

      FakeGatoHistoryService = require( "fakegato-history" )( api );

      // This is not required by homebridge and does not affect it.  I use it for
      // unit testing.
      return { CMD4_ACC_TYPE_ENUM,
               CMD4_DEVICE_TYPE_ENUM,
               api
             };
   },
   // These would be the uninitialized values,
   // used for unit testing
   CMD4_ACC_TYPE_ENUM: CMD4_ACC_TYPE_ENUM,      // properties would be { } empty.
   CMD4_DEVICE_TYPE_ENUM: CMD4_DEVICE_TYPE_ENUM // properties would be { } empty.
}


// Platform definition
class Cmd4Platform
{
   constructor( log, config, api )
   {
      log.debug( Fg.Blu + "Class Cmd4Platform" );

      if ( config === undefined )
         return;

      this.log = log;
      this.config = config;
      this.api = api;

      // Pass along the trigger when creating the Cmd4Accessory.
      // Note: The LEVEL starts at -1 as the first one gets incremented to Zero.
      //
      //       LEVEL 0 Accessories are Platform or Standalone Accessories.
      //       LEVEL 1 Accessories are linked accessories.
      //       LEVEL 2 Accessories are added Platform accessories coerced to
      //               level 2 as a distinction. i.e. TelevisionSpeaker.

      this.CMD4 = PLATFORM;
      this.LEVEL = -1;
      this.COLLECTION = [ ];

      this.services = [ ];

      setTimeout( checkForUpdates, 1800 );

      this.reachable = true;

      // Define platform config for fakegato-history
      if ( this.config.storage != undefined )
      {
         if ( this.config.storage == "fs" || this.config.storage == "googleDrive" )
            this.storage = this.config.storage;
         else
            this.log.warn( "WARNING" + Fg.Rm + ": Cmd4: Unknown platform.config.storage:%s. Expected 'fs' or 'googleDrive' ", this.config.storage );
      }

      // Define platform config storagePath for fakegato-history
      this.storagePath = this.config.storagePath;

      // Define platform config folder for fakegato-history
      this.folder = this.config.folder;

      // Define platform config keyPath for fakegato-history
      this.keyPath = this.config.keyPath;

      // If outputConstants is defined it is set to true/false, otherwise false.
      this.outputConstants = this.config.outputConstants === true;

      // didFinishLaunching is only called after the registerPlatform completes
      api.on( "didFinishLaunching", ( ) =>
      {
         this.log.debug( "Cmd4Platform didFinishLaunching" );

         this.config.accessories && this.processPlatformAccessoriesConfig( this.config.accessories, api );

      });
   }

   // Platforms do not use getServices. Good to know.
   //getServices( )
   //{
   //   if ( this.services )
   //   {
   //      this.log( Fg.Red + "ZZZZ PLATFORM SERVICES Returning:%s number of services for:%s" + Fg.Rm, this.services.length, this.displayName );
   //   } else {
   //      this.log( Fg.Red + "ZZZZ PLATFORM SERVICES Returning this.services:%s for:%s" + Fg.Rm, this.services, this.displayName );
   //   }
   //   return this.services;
   //}

   // As Per HomeBridge:
   // This function is invoked when homebridge restores cached accessories from disk at startup.
   // It should be used to setup event handlers for characteristics and update respective values.
   //
   // We do not handle restoring cached accessories ( Yet? ). Remove them as we regenerate everything.
   configureAccessory( platformAccessory )
   {
      this.log.debug( `Purging cached accessory: ${ platformAccessory.displayName }` );

      API.unregisterPlatformAccessories(  PLUGIN_NAME, PLATFORM_NAME, [ platformAccessory ] );
   }

   // These would be platform accessories with/without linked accessories
   processPlatformAccessoriesConfig( platformAccessoriesConfig, api )
   {

      let platform;

      platformAccessoriesConfig && platformAccessoriesConfig.forEach( ( config ) =>
      {
         this.log.debug( `Fetching config.json Platform accessories.` );

         let that = this;
         let accessory = new Cmd4Accessory( that.log, config, this.api, this );

         // Put the accessory into its correct collection array.
         this.COLLECTION.push( accessory );

         this.log.debug( `Created ( Platform ) accessory: ${ accessory.displayName }` );

         this.log( Fg.Mag + "Configuring platformAccessory: " + Fg.Rm + config.displayName );

         // Get the properties for this accessories device type
         let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ];

         let category = devProperties.defaultCategory;

         // Create the platform Accessory.
         // Step 1. this.tvAccessory = new api.platformAccessory( tvName, uuid );
         // Categories are hints to HomeKit on which icon to choose for Published Platform Accessories
         if ( accessory.category == undefined )
         {
            this.log.debug( "Step 1. platformAccessory = new platformAccessory(%s, uuid)",  config.displayName );
            platform = new api.platformAccessory( accessory.displayName, accessory.UUID );

         } else {

            this.log.debug( "Step 1. platformAccessory = new platformAccessory(%s, uuid, %s)",  accessory.displayName, accessory.category  );

            platform = new api.platformAccessory( accessory.displayName, accessory.UUID, accessory.category );
            platform.category = accessory.category;
         }

         cmd4Platforms.push( platform );


         // Platform Step 2. const tvService = this.tvAccessory.addService( this.Service.Television);
         this.log.debug( `Step 2. ${ config.displayName }.service = platform.addService( this.Service.${ devProperties.deviceName }` );
         let service = platform.addService( devProperties.service );

         accessory.platform = platform

         accessory.service = service;


         // Store a copy of the device object in the `accessory.context`
         // the `context` property can be used to store any data about the accessory you may need
         // this.platformAccessory.context.device = device;


         // Create all the services for the accessory, including fakegato and polling
         this.createServicesForPlatformAccessoryAndItsChildren( accessory )


         // Children ???
         accessory.services.push( accessory.service );
         this.log( Fg.Red + "ZZZZ %s.services.length:%s" + Fg.Rm, accessory.displayName, accessory.services.length);

         // Step 6. this.api.publishExternalAccessories( PLUGIN_NAME, [ this.tvAccessory ] );
         if ( accessory.publishExternally )
         {
            this.log.debug( `Step 6. publishExternalAccessories: [ ${ accessory.displayName } ]` );

            api.publishExternalAccessories( PLUGIN_NAME, [ platform ] );

         } else {

            this.log.debug("Step 6. registerPlatformAccessories [ %s, %s, [%s] ]", PLUGIN_NAME, PLATFORM_NAME, accessory.displayName );

            api.registerPlatformAccessories( PLUGIN_NAME, PLATFORM_NAME, [ platform ] );
         }

         accessory.log.debug( `Creating polling for Platform accessory: ${ accessory.displayName }` );
         accessory.setupPollingOfAccessoryAndItsChildren( accessory );
      });
   }

   createServicesForPlatformAccessoryAndItsChildren( cmd4PlatformAccessory )
   {
      //
      // Platform Accessory
      //
      // The cmd4PlatformAccessory has it's service created already

      // Create the service for all the accessories. i.e. Speaker Service
      // Step 3.
      //    const speakerService = this.tvAccessory.addService(this.Service.TelevisionSpeaker);
      cmd4PlatformAccessory.accessories && cmd4PlatformAccessory.accessories.forEach( ( addedAccessory ) =>
      {
         // Get the properties for this accessory's device type
         let properties = CMD4_DEVICE_TYPE_ENUM.properties[ addedAccessory.typeIndex ];

         this.log.debug("Platform Step 3. %s.service = PlatformAccessory:%s.addService( Service:%s);",
                  addedAccessory.displayName, cmd4PlatformAccessory.displayName,
                  properties.deviceName );
         addedAccessory.service = cmd4PlatformAccessory.platform.addService( properties.service );

         addedAccessory.addAllServiceCharacteristicsForAccessory( addedAccessory );

          // Setup the fakegato service if defined in the config.json file
         addedAccessory.setupAccessoryFakeGatoService( addedAccessory.fakegatoConfig );

      });

      // Create the service for all the linked accessories. i.e. HDMI Service
      cmd4PlatformAccessory.linkedAccessories && cmd4PlatformAccessory.linkedAccessories.forEach( ( linkedAccessory ) =>
      {
         // Get the properties for this linked Accessory device type
         let properties = CMD4_DEVICE_TYPE_ENUM.properties[ linkedAccessory.typeIndex ];

         // Child accessories can have linked accessories. i.e. HDMI accessory
         // Step 4.
         //    const hdmi1InputService = this.tvAccessory.addService(this.Service.InputSource, `hdmi1', 'HDMI 1');
         this.log.debug( "Platform Step 4. %s.service = %s.addService:(%s.service, %s, %s);", linkedAccessory.displayName, cmd4PlatformAccessory.displayName, properties.deviceName, linkedAccessory.displayName, linkedAccessory.name );
         linkedAccessory.service = cmd4PlatformAccessory.platform.addService( properties.service, linkedAccessory.displayName, linkedAccessory.name );

         linkedAccessory.addAllServiceCharacteristicsForAccessory( linkedAccessory );

         this.log.debug( "Platform Step 5. %s.service.addLinkedService( %s.service );", cmd4PlatformAccessory.displayName, linkedAccessory.displayName );
         cmd4PlatformAccessory.service.addLinkedService( linkedAccessory.service );

          // Setup the fakegato service if defined in the config.json file
         linkedAccessory.setupAccessoryFakeGatoService( linkedAccessory.fakegatoConfig );

      });

      // Setup all the characteristics for the platform accessory itself
      cmd4PlatformAccessory.addAllServiceCharacteristicsForAccessory( cmd4PlatformAccessory );

      // Setup the fakegato service for the platform accessory istelf.
      cmd4PlatformAccessory.setupAccessoryFakeGatoService( cmd4PlatformAccessory.fakegatoConfig );

   } // createServicesForPlatformAccessoryAndItsChildren( cmd4PlatformAccessory )
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
   constructor( log, config, api, parentInfo )
   {
      this.log = log;
      this.config = config;
      this.api = api;
      this.parentInfo = parentInfo;

      // Use parent values (if any) or these defaults.
      // LEVEL is a number, possibly 0 which must be handled more precisely.
      this.CMD4 = ( parentInfo && parentInfo.CMD4 ) ? parentInfo.CMD4 : STANDALONE;
      this.LEVEL = ( parentInfo && parentInfo.LEVEL !== undefined) ? parentInfo.LEVEL + 1 : 0;
      this.COLLECTION = ( parentInfo && parentInfo.COLLECTION ) ? parentInfo.COLLECTION : [ ];

      // this.log( `CMD4=${ this.CMD4 } LEVEL=${ this.LEVEL }` );

      let typeMsg =  [ "", "Linked ", "Added " ][ this.LEVEL ] || "";

      log( Fg.Blu + `Creating ${ typeMsg }${ this.CMD4 } Accessory type for : ${ config.displayName }` + Fg.Rm );

      this.services = [ ];
      this.linkedAccessories = [ ];
      this.listOfVariables = { };
      this.listOfConstants = { };

      // Instead of polling per accessory, allow the config file to be polled per characteristic.
      this.listOfPollingCharacteristics = { };

      // DisplayName and/or Name must be defined.
      // Update config, just in case it is not set there.
      if ( ! this.displayName )
         this.displayName = this.config.displayName = getAccessoryName( this.config );


      // Bring the parent config variables forward.
      // If they do not exist, they would still be undefined.
      this.stateChangeResponseTime = (parentInfo && parentInfo.stateChangeResponseTime) ? parentInfo.stateChangeResponseTime : DEFAULT_INTERVAL;
      this.interval = (parentInfo && parentInfo.interval) ? parentInfo.interval : DEFAULT_INTERVAL;
      this.timeout = (parentInfo && parentInfo.timeout) ? parentInfo.timeout : DEFAULT_TIMEOUT;

      // undefined is acceptable.
      this.state_cmd = parentInfo && parentInfo.state_cmd;
      this.state_cmd_prefix = parentInfo && parentInfo.state_cmd_prefix;
      this.state_cmd_suffix = parentInfo && parentInfo.state_cmd_suffix;

      // TLV8 causes a lot of issues if defined and trying to parse.
      // Omit them by default.
      this.allowTLV8 = (parentInfo && parentInfo.allowTLV8) ? parentInfo.TLV8 : false;

      // Instead of local variables for every characteristic, create an array to
      // hold values for  all characteristics based on the size of all possible characteristics.
      this.storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL ).fill( null );


      // If polling is defined it is set to true/false, otherwise false.
      this.polling = this.config.polling === true;

      // Fakegato-history definitions from parent, if any.
      this.storage = parentInfo && parentInfo.storage;
      this.storagePath = parentInfo && parentInfo.storagePath;
      this.folder = parentInfo && parentInfo.folder;
      this.keyPath = parentInfo && parentInfo.keyPath;

      // If outputConstants is defined it is set to true/false, otherwise true.
      this.outputConstants = (parentInfo && parentInfo.outputConstants) ? parentInfo.outputConstants : true;

      // Get the supplied values from the accessory config.
      this.parseConfig( this.config );

      // Add any required characteristics that are missing
      this.addRequiredCharacteristicStoredValues( );

      // The accessory cannot have the same uuid as any other
      checkAccessoryForDuplicateUUID( this );

      // The default respnse time is in seconds
      if ( ! this.stateChangeResponseTime )
         this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ].devicesStateChangeDefaultTime;

      // Check the polling config for characteristics that may be set there instead.
      this.checkPollingConfigForUnsetCharacteristics( this.polling );

      // Convert the accessoriesConfig (if any) to an array of Cmd4Accessory
      if ( this.accessoriesConfig && this.CMD4 == PLATFORM && this.LEVEL == 0 )
      {
         log( `Creating accessories for: ${this.displayName }` );
         // Let me explain. Level 0 are standalone or platform.  Level 1 is linked. Added accessories
         // are on the same level as linked, but they are not linkedTypes, just added to the platform.
         // For Example: TelevisionSpeaker.
         let savedLevel = this.LEVEL;
         this.LEVEL = 1; // will be incremented to 2.
         this.accessories = this.accessoryTypeConfigToCmd4Accessories( this.accessoriesConfig, this );
         this.LEVEL = savedLevel;
      }

      // Convert the linkedTypes (if any) to an array of Cmd4Accessory
      // Linked Accessories can be on Standalone or Platform Accessories.
      if ( this.linkedAccessoriesConfig && this.LEVEL == 0 )
      {
         log( `Creating linked accessories for: ${ this.displayName }` );
         this.linkedAccessories = this.accessoryTypeConfigToCmd4Accessories( this.linkedAccessoriesConfig, this );
      }

      // Create all the services for the accessory, including fakegato and polling
      // Only true Standalone accessories can have their services created and
      // polling started. Otherwise the platform will have to do this.
      if ( this.CMD4 == STANDALONE  && this.LEVEL == 0 )
      {
         log.debug( `Creating Standalone service for: ${ this.displayName }` );
         this.createServicesForStandaloneAccessoryAndItsChildren( this )

         log.debug( `Creating polling for Standalone accessory: ${ this.displayName }` );
         this.setupPollingOfAccessoryAndItsChildren( this );
      }

   } // Cmd4Accessory ( log, config, api, parentInfo )

   identify( callback )
   {
       callback( );
   }

   getServices( )
   {
      //if ( this.services )
      //{
      //   this.log( Fg.Red + "ZZZZ Returning:%s number of services for:%s" + Fg.Rm, this.services.length, this.displayName );
      //} else {
      //   this.log( Fg.Red + "ZZZZ Returning this.services:%s for:%s" + Fg.Rm, this.services, this.displayName );
      //}
      return this.services;
   }

   setStoredValueForIndex( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log.error ( Fg.Red + "Error" + Fg.Rm + ": setStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.displayName );
         this.log.error ( `Check your config.json file for this error` );
         process.exit( 1 );
      }
      this.storedValuesPerCharacteristic[ accTypeEnumIndex ] = value;
   }

   getStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log( `CMD4 Warning: getStoredValue - Characteristic: ${ accTypeEnumIndex} for: ${this.displayName }` );
         this.log( `Check your config.json file for this error` );
         process.exit( 1 );
      }
      return this.storedValuesPerCharacteristic[ accTypeEnumIndex ];
   }

   testStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
         return undefined;

      return this.storedValuesPerCharacteristic[ accTypeEnumIndex ];
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
         if ( format == API.hap.Characteristic.Formats.TLV8 && this.allowTLV8 == false )
         {
            if ( this.getStoredValueForIndex( accTypeEnumIndex) != null )
            {
               this.setStoredValueForIndex( accTypeEnumIndex, null );

               this.log.warn( `****** Removing TLV8 required characteristic: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }` );
            }
            continue;
         }

         // if it is required and not stored, add it
         if ( requiredIndex != -1 && this.getStoredValueForIndex( accTypeEnumIndex ) == null )
         {
            this.log.warn( `**** Adding required characteristic ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } for ${ this.displayName }` );
            this.log.warn( `Not defining a required characteristic can be problematic` );

            // Get the default value to store
            let defaultValue = properties.requiredCharacteristics[ requiredIndex ].defaultValue;

            // If ConfiguredName was not defined, then use the Accessories Name
            if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.ConfiguredName )
               defaultValue = getAccessoryName( this.config );

            this.log.debug( `*****Adding default value ${ defaultValue } for: ${ this.displayName }` );

            this.setStoredValueForIndex( accTypeEnumIndex, defaultValue );
         }
      }
   }

   checkPollingConfigForUnsetCharacteristics( pollingConfig )
   {

      if ( typeof pollingConfig != "object" )
      {
         this.log.debug( `Polling config is old style. Nothing to check for unset polling characteristics` );
         return;
      }

      this.log.debug( `Checking for polling of unset characteristics.` );

      pollingConfig.forEach( ( jsonPollingConfig ) =>
      {
         for ( let key in jsonPollingConfig )
         {
            let ucKey = ucFirst( key );
            let value = jsonPollingConfig[ key ];

            switch ( ucKey )
            {
               case "Timeout":
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  this.timeout = parseInt( value, 10 );
                  if ( this.timeout < 500 )
                  {
                     this.log.warn( `Timeout for: ${ this.config.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low.` );
                  }
                  break;
               case "Interval":
                  // Intervals are in seconds
                  this.interval = parseInt( value, 10 ) * 1000;
                  break;
               default:
               {
                  let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );

                  if ( accTypeEnumIndex < 0  )
                  {
                    this.log.error( `OOPS: "${ key }" not found while parsing for characteristic polling. There something wrong with your config.json file?` );
                    process.exit( 1 );
                  } else {
                     if ( this.getStoredValueForIndex( accTypeEnumIndex ) == undefined )
                     {
                        this.log.warn( `Polling for: "${ key }" requested, but characteristic` );
                        this.log.warn( `is not in your config.json file for: ${ this.displayName }` );
                     }

                     this.setStoredValueForIndex( accTypeEnumIndex, value );
                  }
               }
            }
         }
      });
   }

   createServicesForStandaloneAccessoryAndItsChildren( accessory )
   {
      accessory.log( Fg.Red + `createServicesForStandaloneAccessoryAndItsChildren` + Fg.Rm );
      let properties = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ];

      //
      // Standalone Accessory
      //
      // Create the accessory's service
      accessory.service = new properties.service( accessory.displayName, accessory.name )

      accessory.log.debug( `Creating information service for standalone accessory: ${ accessory.displayName }` );


      // Create the Standalone accessory's information service.
      createAccessorysInformationService( accessory );

      // Create the Standalone accessory's services for all its linked children
      if ( accessory.linkedAccessories )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            let properties = CMD4_DEVICE_TYPE_ENUM.properties[ linkedAccessory.typeIndex ];

            // Standalone Step 4.
            //    const hdmi1InputService = this.tvAccessory.addService(this.Service.InputSource, `hdmi1', 'HDMI 1');
            accessory.log.debug( `Standalone Step 4. linkedAccessory(${ accessory.displayName }).service = new Service(${ linkedAccessory.displayName }, ${ linkedAccessory.name })` );
            linkedAccessory.service = new properties.service( linkedAccessory.displayName, linkedAccessory.name )
            accessory.services.push( linkedAccessory.service );

            // Hmmm Double Check this !! 
            // Create Information Service
            //linkedAccessory.log.debug( "Creating information service for linkedAccessory:%s", linkedAccessory.displayName );
            //createAccessorysInformationService( linkedAccessory );

            accessory.log.debug( `Standalone Step 5. ${ accessory.displayName }.service.addLinkedService( ${ linkedAccessory.displayName }` );
            // Standalone Step 5.
            //    tvService.addLinkedService(hdmi1InputService); // link to tv service
            accessory.service.addLinkedService( linkedAccessory.service );

            linkedAccessory.addAllServiceCharacteristicsForAccessory( linkedAccessory );

            // Setup the fakegato service if defined in the config.json file
            linkedAccessory.setupAccessoryFakeGatoService( linkedAccessory.fakegatoConfig );

         });
      }

      accessory.addAllServiceCharacteristicsForAccessory( accessory );

      // Setup the fakegato service if defined in the config.json file
      accessory.setupAccessoryFakeGatoService( accessory.fakegatoConfig );

      accessory.services.push(accessory.service);

      // Move the information service to the top of the list
      accessory.services.unshift( accessory.informationService );

      // accessory.log( Fg.Red + "ZZZZ %s.services.length %s" + Fg.Rm, accessory.displayName, accessory.services.length);

   }


   // ***********************************************
   //
   // setValue: Method to call an external script
   //           to set a value.
   //
   //   The script will be passed:
   //      Set <Device Name> <accTypeEnumIndex> <Value>
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
   //    ( 1) In the special TARGET set characteristics, getValue
   //        is called to update HomeKit.
   //          Example: Set My_Door <TargetDoorState> 1
   //            calls: Get My_Door <CurrentDoorState>
   //
   //       - Where he value in <> is an one of CMD4_ACC_TYPE_ENUM
   // ***********************************************
   setValue( five, context, accTypeEnumIndex, value, callback )
   {
      let self = context;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let characteristic = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic;

      let cmd;


      if ( self.outputConstants == true )
      {
         let constant = transposeValueToValidConstant( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value );
         cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + constant  + "'" + self.state_cmd_suffix;
      } else {
         cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + value  + "'" + self.state_cmd_suffix;
      }
      self.log.debug( `setValue ${ characteristicString } function for: ${ self.displayName } cmd: ${ cmd }` );


      // Execute command to Set a characteristic value for an accessory
      exec( cmd, {timeout: self.timeout}, function ( error, stdout, stderr )
      {
         if ( error ) {
            self.log( Fg.Red + `setGeneric ${ characteristicString } function failed for ${ self.displayName } Error: ${ error.message }` );
            self.log( stdout );
            self.log( stderr );
            callback( error );

         } else {

            // Since we are in an exec, make sure we reply
            // with the corresponding getValue.
            let responded  = false;

            // Setting *Target* states require a get afterwards
            // Why this is needed and must be set the same, I do
            // not know, but without it, IOS Homekit spins its
            // wheels.
            // Documenting bugs are good.  Bonus points for me!
// Double Check this ..
            let verifyCharacteristic = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex].verifyCharacteristic;

            if ( verifyCharacteristic != null )
            {
               responded  = true;
               setTimeout( ( ) => {
                     self.service.getCharacteristic( verifyCharacteristic ).getValue( );
                     callback( );
                  }, self.stateChangeResponseTime );
            }

            if ( responded == false )
            {
               // So why do we do this?
               // I have found that IOS HomeKit will have a spinning
               // Indicator that will never stop, unless you do a get
               // before the final callback. This could all be because
               // use exec, compared to other plugins, but this works.
               // More bonus points for documentation!

               // The exceptions are handled above; Respond with the
               // corresponding getValue.
               if ( self.config.stateChangeResponseTime === undefined )
                  self.stateChangeResponseTime = FAST_STATE_CHANGE_RESPONSE_TIME;

               if ( characteristic == undefined )
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn( `Characteristic is null for name: ${ self.displayName } type: ${ self.config.type }` );

               } else if ( self.service == undefined )
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn( `self.service is null for name: ${ self.displayName } type: ${ self.config.type }` );

               } else if ( self.service.getCharacteristic( characteristic ) == undefined )
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn( `Service is null for name: ${ self.displayName } type: ${ self.config.type }` );
               }

               // A little bit of a speed boost, depending on the config
               if ( self.config.stateChangeResponseTime === undefined )
               {
                  callback( );
               } else {
                  setTimeout( ( ) => {
                     callback( );
                  }, self.stateChangeResponseTime );
               }
            }
         }
      });
   }

   // ***********************************************
   //
   // GetValue: Method to call an external script
   //           that returns a single word that
   //           returns either a string or numerical
   //           value.
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
   getValue( accTypeEnumIndex, callback )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      let cmd = this.state_cmd_prefix + this.state_cmd + " Get '" + this.displayName + "' '" + characteristicString  + "'" + this.state_cmd_suffix;

      self.log.debug( `getvalue accTypeEnumIndex:(${ accTypeEnumIndex })-"${ characteristicString }" function for: ${self.displayName } cmd: ${ cmd }` );

      // Execute command to Get a characteristics value for an accessory
      let child = exec( cmd, {timeout:self.timeout}, function ( error, stdout, stderr )
      {
         if ( error )
         {
            self.log( `getGeneric ${characteristicString } function for: ${ self.displayName } cmd: ${ cmd } failed.` );
            self.log( error );
            self.log( stdout );
            self.log( stderr );
            callback( error, 0 );

         } else
         {
            //let words = stdout.match(/\S+/gi);
            // Handle quotes words. Removes quotes
            // Handles escaped quotes.
            // Taken from: https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
            let words = stdout.match(/\\?.|^$/g).reduce((p, c) =>
                        {
                           if ( c === '"' )
                           {
                               p.quote ^= 1;
                           }else if ( ! p.quote && c === ' ' )
                           {
                               p.a.push( '' );
                           }else
                           {
                               p.a[ p.a.length-1 ] += c.replace( /\\(.)/,"$1" );
                           }
                           return  p;
                        }, {a: ['']}).a

            // I'd rather trap here
            if ( words == undefined )
            {
               self.log( `Nothing retured from stdout for ${ characteristicString } ${ self.displayName }` );
               self.log( stderr );
               self.log( error );
               self.log( stdout );
               callback( -1, 0 );
            } else if ( words.length <= 0 )
            {
               self.log( `getValue ${ characteristicString } function for: ${ self.displayName } returned no value` );

               callback( -1, 0 );

            } else
            {
               if ( words.length >=2 )
               {
                  self.log.warn( `Warning, Retrieving ${ characteristicString }, expected only one word value for: ${ self.displayName } of: ${ stdout }` );
               }

               self.log.debug( `getValue ${ characteristicString } function for: ${ self.displayName } returned: ${ words[0] }` );


               // Even if outputConsts is not set, just in case, transpose it anyway.
               words[ 0 ] = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, words[ 0 ] )

               // Return the appropriate type, by seeing what it is defined as in Homebridge,
               words[ 0 ] = characteristicValueToItsProperType( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props, API.hap.Characteristic, words[ 0 ] );

               // Store history using fakegato if set up
               self.updateAccessoryAttribute( accTypeEnumIndex, words[ 0 ] );

               callback( null, words[ 0 ] );

            }
         }
      });
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
      let type = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let ucType = ucFirst( type );

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
         if ( characteristicProps[ key ] == undefined )
         {
            this.log.error( Fg.Red + "Error" + Fg.Rm + ": props for key: '%s' not in definition of %s", key, type );
            process.exit( -1 );
         }

         if ( typeof characteristicProps[ key ] !=  typeof definitions[ key ] )
         {
            this.log.error( Fg.Red + "Error" + Fg.Rm + ": props for key: %s type %s not equal to definition of %s", key, typeof definitions[ key], typeof characteristicProps[ key] );
            process.exit( -1 );
         }
      }

      return definitions;
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
       accessory.log.debug( `Adding All Service Characteristics for: ${ accessory.displayName }` );

       let perms = "";
       let len = this.storedValuesPerCharacteristic.length;

       // Check every possible characteristic
       for ( let accTypeEnumIndex = 0;
            accTypeEnumIndex < len;
            accTypeEnumIndex++ )
       {

          // If there is a stored value for this characteristic ( defined by the config file )
          // Then we need to add the characteristic too
          if ( accessory.storedValuesPerCharacteristic[ accTypeEnumIndex ] != undefined )
          {
             accessory.log.debug( "Found characteristic:%s value:%s for:%s",
                  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type,
                  this.getStoredValueForIndex( accTypeEnumIndex ),
                  this.displayName );

             // Get the permissions of characteristic ( Read/Write ... )
             // Both are 100% the same.
             // perms = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.perms
             perms = accessory.service.getCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                .characteristic ).props.perms;

             // Find out if the characteristic is Optional and needs to be added
             if ( ! accessory.service.testCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic ) )
             {
                // We need to check if the characteristic is write only
                if ( perms.indexOf( API.hap.Characteristic.Perms.WRITE ) != -1 )
                {
                   // Since the characteristic is writeable, then add it.
                   accessory.log.debug( "Adding optional characteristic:%s for: %s", CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, this.displayName );
                   accessory.service.addCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].
                         characteristic );
                }
             }

             let props = accessory.configHasCharacteristicProps( accTypeEnumIndex );
             if ( props )
             {
                accessory.log.debug( "Overriding characteristic %s props for: %s ", CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, this.displayName );
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

             // Read and or write, we need to set the value once.
             // If the characteristic was optional and read only, this will add
             // it with the correct value.  You cannot add and set a read characteristic.
             accessory.service.setCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic,
                      this.getStoredValueForIndex( accTypeEnumIndex ) );


             // Add getValue funtion to service
             if ( accessory.service.getCharacteristic(
                    CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                    .characteristic ).listeners( "get" ).length == 0 )
             {
                // Add Read services for characterisitcs, if possible
                if ( perms.indexOf( API.hap.Characteristic.Perms.READ ) != -1 )
                {
                   accessory.service.getCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                      .characteristic )
                         .on( "get", accessory.getValue.bind( accessory, accTypeEnumIndex ) );
                }
             }

             // Add setValue function to service
             if ( accessory.service.getCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                  .characteristic ).listeners( "set" ).length == 0 )
             {
                // Add Write services for characterisitcs, if possible
                if ( perms.indexOf( API.hap.Characteristic.Perms.WRITE) != -1 )
                {
                   // GetService has parameters:
                   // five, context, accTypeEnumIndex, value , callback
                   // Why this works, beats me.
                   // five ends up equal to "2";
                   let boundSetValue = accessory.setValue.bind( 1, 2, accessory, accTypeEnumIndex );

                   accessory.service.getCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                      .characteristic ).on( "set", ( value,callback ) => {
                          boundSetValue( value, callback );
                   });
                }
             }
          }
       }
   }

   updateAccessoryAttribute( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log( `Internal error: updateAccessoryAttribute - accTypeEnumIndex: ${ accTypeEnumIndex } for: ${ this.displayName } not found` );
         return;
      }

      this.setStoredValueForIndex( accTypeEnumIndex, value );

      if ( this.loggingService )
      {
         let firstParm, secondParm, thirdParm;
         let ucFirstParm, ucSecondParm, ucThirdParm;
         let firstParmValue, secondParmValue, thirdParmValue = 0;
         let firstParmIndex, secondParmIndex, thirdParmIndex;

         switch ( this.eve )
         {
            case FAKEGATO_TYPE_ENERGY:
            {
               firstParm   = this.fakegatoConfig[ "power" ]    || "0";
               ucFirstParm = ucFirst( firstParm )              || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging power: ${ firstParmValue }` );
               // Eve Energy ( Outlet service )
               this.loggingService.addEntry( {time: moment( ).unix( ),
                  power: firstParmValue} );
               break;
            }
            case FAKEGATO_TYPE_ROOM:
            {
               firstParm       = this.fakegatoConfig[ "temp" ]       || "0";
               secondParm      = this.fakegatoConfig[ "humidity" ]   || "0";
               thirdParm       = this.fakegatoConfig[ "ppm" ]        || "0";
               ucFirstParm     = ucFirst( firstParm )       || "0";
               ucSecondParm    = ucFirst( secondParm )      || "0";
               ucThirdParm     = ucFirst( thirdParm )       || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );


               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );


               this.log.debug( "Logging temp:%s humidity:%s ppm:%s", firstParmValue, secondParmValue, thirdParmValue );
               // Eve Room ( TempSensor, HumiditySensor and AirQuality Services )
               this.loggingService.addEntry( {time: moment( ).unix( ),
                  temp:firstParmValue,
                  humidity:secondParmValue,
                  ppm:thirdParmValue} );
               break;
            }
            case FAKEGATO_TYPE_WEATHER:
            {
               firstParm       = this.fakegatoConfig[ "temp" ]       || "0";
               secondParm      = this.fakegatoConfig[ "pressure" ]   || "0";
               thirdParm       = this.fakegatoConfig[ "humidity" ]   || "0";
               ucFirstParm     = ucFirst( firstParm )       || "0";
               ucSecondParm    = ucFirst( secondParm )      || "0";
               ucThirdParm     = ucFirst( thirdParm )       || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );

               this.log.debug( "Logging temp:%s pressure:%s humidity:%s", firstParmValue, secondParmValue, thirdParmValue );

               // Eve Weather ( TempSensor Service )
               this.loggingService.addEntry( {time: moment( ).unix( ),
                  temp:firstParmValue,
                  pressure:secondParmValue,
                  humidity:thirdParmValue} );
               break;
            }
            case FAKEGATO_TYPE_DOOR:
            {
               firstParm   = this.fakegatoConfig[ "status" ]   || "0";
               ucFirstParm = ucFirst( firstParm )              || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging status: ${ firstParmValue }` );

               this.loggingService.addEntry( {time: moment( ).unix( ),
                  status: firstParmValue} );
               break;
            }
            case FAKEGATO_TYPE_MOTION:
            {
               firstParm   = this.fakegatoConfig[ "status" ]   || "0";
               ucFirstParm = ucFirst( firstParm )              || "0";
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging status:${ firstParmValue }` );

               this.loggingService.addEntry( {time: moment( ).unix( ),
                  status: firstParmValue} );
               break;
            }
            case FAKEGATO_TYPE_THERMO:
            {
               firstParm       = this.fakegatoConfig[ "currentTemp" ]     || "0";
               secondParm      = this.fakegatoConfig[ "setTemp" ]         || "0";
               thirdParm       = this.fakegatoConfig[ "valvePosition" ]   || "0";
               ucFirstParm     = ucFirst( firstParm )       || "0";
               ucSecondParm    = ucFirst( secondParm )      || "0";
               ucThirdParm     = ucFirst( thirdParm )       || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );

               this.log.debug( "Logging currentTemp:%s setTemp:%s valvePosition:%s", firstParmValue, secondParmValue, thirdParmValue );

               // Eve Thermo ( Thermostat service )
               this.loggingService.addEntry( {time: moment( ).unix( ),
                  currentTemp:firstParmValue,
                  setTemp:secondParmValue,
                  valvePosition:thirdParmValue} );
               break;
            }
            case FAKEGATO_TYPE_AQUA:
            {
               firstParm       = this.fakegatoConfig[ "status" ]        || "0";
               secondParm      = this.fakegatoConfig[ "waterAmount" ]   || "0";
               ucFirstParm     = ucFirst( firstParm )       || "0";
               ucSecondParm    = ucFirst( secondParm )      || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );

               this.log.debug( `Logging status: ${ firstParmValue } waterAmount: ${ secondParmValue }` );

               // Eve Aqua ( Valve service set to Irrigation Type )
               this.LoggingService.addEntry( { time: moment( ).unix( ),
                  status:firstParmValue,
                  waterAmount:secondParmValue} );
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
          let ucKey = ucFirst ( key );
          let value = fakegatoConfig[ key ];
          switch ( ucKey)
          {
             case "Eve":
                this.eve = fakegatoConfig[ key ];
                switch( value )
                {
                    case FAKEGATO_TYPE_ENERGY:
                    case FAKEGATO_TYPE_ROOM:
                    case FAKEGATO_TYPE_WEATHER:
                    case FAKEGATO_TYPE_DOOR:
                    case FAKEGATO_TYPE_MOTION:
                    case FAKEGATO_TYPE_THERMO:
                    case FAKEGATO_TYPE_AQUA:
                       break;
                    default:
                       this.log( `Invalid fakegato eve type: ${ value }` );
                       this.log( "It must be one of ( %s, %s, %s, %s, %s, %s, %s )",
                          FAKEGATO_TYPE_ENERGY,
                          FAKEGATO_TYPE_ROOM,
                          FAKEGATO_TYPE_WEATHER,
                          FAKEGATO_TYPE_DOOR,
                          FAKEGATO_TYPE_MOTION,
                          FAKEGATO_TYPE_THERMO,
                          FAKEGATO_TYPE_AQUA );
                        this.log( `Check the Cmd4 README and ` );
                        this.log( `https://github.com/simont77/fakegato-history` );
                        process.exit( 1 );
                }
                break;
             case "Storage":
                this.storage = fakegatoConfig[ key ];
                break;
             case "StoragePath":
                this.storagePath = fakegatoConfig[ key ];
                break;
             case "KeyPath":
                this.keyPath = fakegatoConfig[ key ];
                break;
             case "Folder":
                this.Folder = fakegatoConfig[ key ];
                break;
             case "Status":
             case "Temp":
             case "SetTemp":
             case "Humidity":
             case "Ppm":
             case "Power":
             case "Pressure":
             case "CurrentTemp":
             case "ValvePosition":
             {
                 let ucValue = ucFirst( value );
                 let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucValue );

                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if ( this.testStoredValueForIndex( accTypeEnumIndex) == undefined  && ucValue != "0" )
                    this.log.warn( `Not a valid characteristic: ${value } for fakegato to log of: ${ key }` );
                 break;
              }
              default:
                 this.log( `Invalid fakegato key: ${ key } in json.config for: ${ this.displayName }` );
          }
      }

      // Optional
      if ( this.storage != undefined )
      {
         if ( this.storage == "fs" )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { storage: "fs",
                  path: this.storagePath }
            );
            this.services.push( this.loggingService );

         } else if ( this.storage == "googleDrive" )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { storage: "googleDrive",
                 folder: this.folder,
                 keyPath: this.keyPath }
            );
            this.services.push( this.loggingService );
         } else
         {
            this.log( Fg.Ylw + "WARNING" + Fg.Rm + ": Cmd4 Unknown accessory config.storage:%s Expected:fs or googlrDrive for:%s", this.storage, this.displayName );
         }
      }

      if ( this.loggingService )
      {
         if ( this.polling == undefined ||
             this.polling == false )
         {
            this.log.warn( `config.storage: ${ this.storage } for: ${ this.displayName } set but polling is not enabled.` );
            this.log.warn( `      History will not be updated continiously.` );
         }
      }
   }

   validateStateCmd( state_cmd )
   {
      if ( ! state_cmd )
      {
         this.log.error( Fg.Red + "No state_cmd for: %s", this.displayName );
         process.exit( 666 );
      }

      // Split the state_cmd into words.
      let cmdArray = state_cmd.match(/\S+/gi);

      // Assume no words
      let arrayLength = 0;

      // Get the number of words
      if ( cmdArray )
         arrayLength = cmdArray.length;

      // Check that the state_cmd is valid.
      // The first word must be in the persons path
      // The second word, if it exists must be a file
      // and have the correct path.
      switch ( arrayLength )
      {
         case 0:
            this.log.error( `No state_cmd given` );
            return false;
         default:
         {
            let checkFile = cmdArray[ arrayLength -1 ];

            try {
               fs.accessSync( checkFile, fs.F_OK );
               // File exists - OK

            } catch ( e ) {
               // It isn't accessible
               this.log.warn( `The script ${ checkFile } does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.` );
            }
         }
         // Purposely fall through to check the command as well
         case 1:
         {
            let checkCmd = cmdArray[ 0 ];

            // if the lone command is a path to a command
            // Then check if it exists, oTherwise check if it is
            // in Their path.
            if ( checkCmd.charAt( 0 ) == "/" || (
                  checkCmd.length > 1 &&
                  checkCmd.charAt( 0 ) == "." &&
                  checkCmd.charAt( 1 ) == "/" )
               )
            {
               try {
                  fs.accessSync( checkCmd, fs.F_OK );
                  // File exists - OK
               } catch ( e ) {
                  this.log.warn( `The file ${ checkCmd } does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.` );
               }
            } else
            {
               if ( ! commandExistsSync( checkCmd ) )
                  this.log.warn( `The command ${ checkCmd } does not exist or is not in your path, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.` );
            }
            break;
         }
      }
      return true;
   }

   parseKeyForCharacteristics( key, value )
   {
      // fix the their scripts, fix it here.
      let ucKey = ucFirst( key );

      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );

      if ( accTypeEnumIndex < 0 )
      {
         this.log( `OOPS: "${ key }" not found for parsing key for Characteristics. There something wrong with your config.json file?` );
         process.exit( 1 );
      }

      if ( Object.keys( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues ).length > 0 )
      {
         // Even if outputConsts is not set, just in case, transpose it anyway.
         let newValue = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value ) ;

         if ( value != newValue )
         {
            value = newValue;
         }
      }

      // Return the appropriate type, by seeing what it is defined as in Homebridge,
      value = characteristicValueToItsProperType( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props, API.hap.Characteristic, value );

      this.setStoredValueForIndex( accTypeEnumIndex, value );
   }

   processRequires( requires )
   {
      if ( Array.isArray ( requires ) )
      {
          for ( let required in requires )
             this.processRequires( requires[ required ] );

         return;
      }
      if ( isJSON( requires ) )
      {
          // I assume only 1, but you know about assuming ...
         for ( let key in requires )
         {
            let required = requires[ key ] ;

            if ( typeof required != "string" )
            {
               this.log.error( `Requires definition: ${ required }  must be a string` );
               process.exit( -1 );
            }

            this.log.debug( `Requiring ${ required }` );

            require( required );
         }
         return;
      }
      this.log.error( `Requires must be an array of/or list of key/value pairs: ${ requires }` );
      process.exit( -1 );
   }

   processConstants( constants )
   {
      if ( Array.isArray ( constants ) )
      {
         for ( let constant in constants )
            this.processConstants( constants[ constant ] );
 
         return;
      }
      if ( isJSON( constants ) )
      {
         // I assume only 1, but you know about assuming ...
         for ( let key in constants )
         {
            let keyToAdd = key ;
            let valueToAdd = constants[ key ] ;
            if ( ! keyToAdd.startsWith( "${" ) )
            {
               this.log.error( `Constant definition for: ${ keyToAdd } must start with "\${" for clarity.` );
               process.exit( -1 );
            }
            if ( ! keyToAdd.endsWith( "}" ) )
            {
               this.log.error( `Constant definition for: ${ keyToAdd } must end with "}" for clarity.` );
               process.exit( -1 );
            }
            // remove any leading and trailing single quotes
            // so that using it for replacement will be easier.
            valueToAdd.replace(/^'/, "")
            valueToAdd.replace(/'$/, "")

            this.listOfConstants[ keyToAdd ] = valueToAdd;
        }
        return;
     }

     this.log.error( `Constants must be an array of/or list of key/value pairs: ${ constants }` );
     process.exit( -1 );
   }

   processVariables( variables )
   {
      if ( Array.isArray ( variables ) )
      {
         for ( let variable in variables )
            this.processConstants( variables[ variable ] );

         return;
      }
      if ( isJSON( variables ) )
      {
         // I assume only 1, but you know about assuming ...
         for ( let key in variables )
         {
            let keyToAdd = key ;
            let valueToAdd = variables[ key ] ;
            if ( ! keyToAdd.startsWith( "${" ) )
            {
               this.log.error( `Variable definition for: ${ keyToAdd } must start with "\${" for clarity.` );
               process.exit( -1 );
            }

            if ( ! keyToAdd.endsWith( "}" ) )
            {
               this.log.error( `Variable definition for: ${ keyToAdd } must end with "}" for clarity.` );
               process.exit( -1 );
            }

            // remove any leading and trailing single quotes
            // so that using it for replacement will be easier.
            valueToAdd.replace(/^'/, "")
            valueToAdd.replace(/'$/, "")

            // The resultant variable may have constants to be replaced.
            let value = this.replaceConstantsInString( valueToAdd );

            this.listOfVariables[ keyToAdd ] = value;
         }
         return;
      }

      this.log.error( `Variables must be an array of/or list of key/value pairs: ${ variables }` );
      process.exit( -1 );
   }

   accessoryTypeConfigToCmd4Accessories( config, parentInfo )
   {
      if ( ! config )
         return undefined;

      let that = this;

      if ( Array.isArray ( config ) )
      {
         let accessories = config.map( ( accessoryConfig ) => { return new Cmd4Accessory( that.log, accessoryConfig, this.api, parentInfo ) } );

         // Put the accessories into their correct collection array.
         parentInfo.COLLECTION.push( ...accessories );

         return accessories;
      }

      let accessory = new Cmd4Accessory( that.log, config, this.api, parentInfo );

      // Put the accessory into its correct collection array.
      parentInfo.COLLECTION.push( accessory );

      return [ accessory ];
   }

   processURL( url )
   {
      if ( typeof url != "string" )
      {
         this.log.error( `url must be a string: ${ url }` );
         process.exit( -1 );
      }

      if ( this.url !== undefined )
      {
         this.log.error( `url is already defined as: ${ this.url } for: ${ url }` );
         process.exit( -1 );
      }

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

   parseConfig( config )
   {
      for ( let key in config )
      {
         let value = config[ key ];

         // I made the stupid mistake of not having all characteristics in the config.json
         // file not upper case to match that in State.js. So instead of having everyone
         // fix their scripts, fix it here.
         let ucKey = ucFirst( key );

         switch ( ucKey )
         {
            case "Type":
               this.type = value;
               this.ucType = ucFirst( value );
               this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === this.ucType );
               if ( this.typeIndex < 0 )
               {
                  this.log.error( Fg.Red + "Error" + Fg.Rm + ": Unknown device type:%s for %s", this.type, this.displayName );
                  process.exit( 1 );
               }

               break;
            case "DisplayName":
               // DisplayName is not a characteristic but used as a parm when creating the Service.
               this.displayName = value;

               break;
            case "UUID":
               // For those who define there own UUID
               this.UUID = value;

               break;
           case "Accessory":
               // Do nothing as this is a key for homebridge, not us
               break;
           case "Category":
               // For those who define there own Category
               // Uppercase the category to be nice. Why do I know
               // this will come back to bite me.
               this.category = API.hap.Categories[ String( value ).toUpperCase( ) ];

               if ( ! this.category )
               {
                  this.log.error( `Category specified: ${ value } is not a valid homebridge category.` );
                  process.exit( 666 );
               }

               break;
            case "PublishExternally":
               // The user can make the accessory be published externally.
               this.publishExternally = value;

               break;
            case "Props":
               // Allow characteristic property changes.
               this.props = value;

               break;
            case "Name":
               this.name = value;

               // Name is also a characteristic, which must be added.
               this.parseKeyForCharacteristics( key, value );

               break;
            case "Model":
               this.model = value;
               this.log.debug( `Setting model to: ${ value }` );

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic( API.hap.Characteristic.Model, value );

               break;
            case "Manufacturer":
               this.manufacturer = value;

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic( API.hap.Characteristic.Manufacturer, value );

               break;
            case "SerialNumber":
               this.serialNumber = value;

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic( API.hap.Characteristic.SerialNumber, value );

               break;
            case "OutputConstants":
               // Define if we should ouput constant strings
               // instead of values
               if ( config.outputConstants === true )

                  this.outputConstants = value;
                else
                  this.outputConstants = false;

               break;
            case "Timeout":
               // Timers are in milliseconds. A low value can result in failure to get/set values
               this.timeout = parseInt( value, 10 );
               if ( this.timeout < 500 )
               {
                  this.log.warn( `Timeout for: ${ config.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low` );
               }

               break;
            case "Polling":
               // Do not parse it yet as characteristics must be set first.
               this.polling = value;
               break;
            case "Interval":
               // Intervals are in seconds
               this.interval = parseInt( value, 10 ) * 1000;

               break;
            case "StateChangeResponseTime":
               // respnse time is in seconds
               this.stateChangeResponseTime = value * 1000;

               break;
            case "State_cmd_prefix":
               // Not 100% sure why this would be needed, but
               // added anyway since we have a suffix
               this.state_cmd_prefix = value;

               break;
            case "State_cmd_suffix":
               // This gets added after any Get/Set <value>
               this.state_cmd_suffix = value;

               break;
            case "State_cmd":
               // What this plugin is all about
               this.state_cmd = value;

               break;
            case "Storage":
               this.storage = value;

               break;
            case "StoragePath":
               this.storagePath = value

               break;
            case "Folder":
               this.folder = value

               break;
            case "KeyPath":
               this.keyPath = value

               break;
            case "Fakegato":
               // Do not parse it yet as characteristics must be set first.
               this.fakegatoConfig = value;

               break;
            case "Requires":
               this.processRequires( value );

               break;
            case "Constants":
               this.processConstants( value );

               break;
            case "Variables":
               this.processVariables( value );

               break;
            case "LinkedTypes":
               this.log.debug(  `parseConfig. Found linked Accessories` );
               this.linkedAccessoriesConfig = value;

               break;
            case "Accessories":
               this.log.debug( `parseConfig. Found Accessories` );
               this.accessoriesConfig = value;

               break;
            case "Url":
               this.processURL( value );

               break;
            case "AllowTLV8":
               this.allowTLV8 = true;
               break;
            default:
            {
               this.parseKeyForCharacteristics( key, value );
            }

         }
      }

      // DisplayName and/or Name must be defined.
      // Update config, just in case it is not set there.
      if ( ! this.displayName )
         this.displayName = config.displayName = getAccessoryName( config );

      // Name and/or DisplayName must be defined.
      if ( ! this.name )
         this.name = getAccessoryName( config );

      // UUID must be defined or created.
      this.UUID = getAccessoryUUID( config, API.hap.uuid );

      // Solve some issues people have encounterred who
      // have had problems with shell completion which is
      // only available from shell expansion.

      if ( ! this.validateStateCmd( this.state_cmd ) )
      {
         this.log.error( Fg.Red + "Error" + Fg.Rm + ": state_cmd: '%s'  is invalid for: %s", this.state_cmd, this.displayName );
         process.exit( 666 );
      }

      // Handle seperation of strings of state_cmd for a prefix
      if ( this.state_cmd_prefix )
         this.state_cmd_prefix = this.state_cmd_prefix + " ";
      else
         this.state_cmd_prefix = "";

      // Handle seperation of strings of state_cmd for a suffix
      if ( this.state_cmd_suffix )
         this.state_cmd_suffix = " " + this.state_cmd_suffix;
      else
         this.state_cmd_suffix = "";

      if ( this.typeIndex == CMD4_DEVICE_TYPE_ENUM.Television )
      {
          if ( this.CMD4 == PLATFORM &&  ( ! this.publishExternally || ! this.category ) ||
               this.CMD4 == STANDALONE )
          {
               this.log.warn( 'Televisions should be Platform Accessories with "publishExternally": true, "category": "TELEVISION' );
          }
          if ( this.CMD4 == PLATFORM && ! this.publishExternally && ( numberOfTVsPerBridge += 1 ) > 1 )
          {
             this.log.warn( `Only one unpublished TV is allowed per bridge` );
          }
      }
   }

   setupPollingOfAccessoryAndItsChildren( accessory )
   {
      accessory.log.debug( `Setting up polling for: ${ accessory.displayName } and any of the children.` );
      if ( accessory.polling && accessory.state_cmd )
      {
         switch ( typeof accessory.polling )
         {
            case "object":
               accessory.log.debug( `Characteristic polling for: ${ accessory.displayName }` );
               this.setupCharacteristicPolling( accessory );
               break;
            case "string":
            case "boolean":
               accessory.log.debug( `State polling for: ${ accessory.displayName }` );
               this.setupStatePollingPerAccessory( accessory );
               break;
            default:
               accessory.log.error( Fg.Red + "Error" + Fg.Rm + ": Something wrong with value of polling:%s\n       Check your config.json for errors.", accessory.polling );
               process.exit( 1 );
          }
      }

      // accessory.log.debug("CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
      // The linked accessory children are at different levels of recursion, so only
      // allow what is posssible.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) linked accessory: ${ linkedAccessory.displayName }` );
            linkedAccessory.setupPollingOfAccessoryAndItsChildren( linkedAccessory );
         });
      }

      // The Television Speaker Platform Example
      if ( accessory.accessories && accessory.CMD4 == PLATFORM && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) added accessory: ${ addedAccessory.displayName }` );
            addedAccessory.setupPollingOfAccessoryAndItsChildren( addedAccessory );
         });
      }
   }

   // This is the self-reaccurring routine to poll a characteristic
   characteristicPolling ( accessory, accTypeEnumIndex, timeout, interval )
   {
      let self = accessory;

      self.log.debug( "Doing Poll of index:%s characteristic:%s for:%s timeout=%s interval=%s", accTypeEnumIndex,
             CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex].type, self.displayName, timeout, interval );

      // Make sure that the characteristic exists
      if ( accTypeEnumIndex < 0 )
      {
         self.log.warn( `WARNING: No such polling accTypeEnumIndex: ${ accTypeEnumIndex } for: ${ self.displayName }` );
         return;
      }

      // Clear polling
      if ( this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] == undefined )
         clearTimeout( this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] );

      // i.e. Characteristic.On
      // i.e.  Characteristic.RotationDirection
      self.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic
      ).getValue( );


       this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] =
          setTimeout( this.characteristicPolling.bind(
             this, accessory, accTypeEnumIndex, timeout, interval ), interval );
   }

   setupCharacteristicPolling( accessory )
   {
      let self = accessory;

      self.log.debug( `Setting up: ${ self.polling.length } polling characteristics of accessory: ${ self.displayName }` );

      for ( let jsonIndex = 0;
                jsonIndex < self.polling.length;
                jsonIndex ++ )
      {
         // *NEW* Characteristic polling is a json type
         let jsonPollingConfig = self.polling[jsonIndex];

         // The default timeout is 1 minute. Timeouts are in milliseconds
         let timeout = DEFAULT_TIMEOUT;

         // The defaault interval is 1 minute. Intervals are in seconds
         let interval = DEFAULT_INTERVAL;

         let ucKeyIndex = -1;

         for ( let key in jsonPollingConfig )
         {
            let ucKey = ucFirst( key );
            let value = jsonPollingConfig[ key ];

            switch ( ucKey )
            {
               case "Timeout":
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  timeout = parseInt( value, 10 );
                  if ( timeout < 500 )
                     accessory.log.warn( `Timeout for: ${ this.config.displayName } is in milliseconds. A value of: ${timeout } seems pretty low.` );

                  break;
               case "Interval":
                  // Intervals are in seconds
                  interval = parseInt( value, 10 ) * 1000;
                  break;
               default:
                  // The key must be a characteristic property
                  // but first check if one has already been defined as we can only handle one at a time.
                  if ( ucKeyIndex != -1 )
                  {
                     accessory.log.error( Fg.Red + "Error" + Fg.Rm + ": For charateristic polling, you can only define one characteristic per array item.\nCannot add '%s' as '%s' is already defined for %s.", ucKey, CMD4_ACC_TYPE_ENUM.properties[ ucKeyIndex ].type, self.displayName );
                     process.exit( -1 );
                  }
                  ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );
                  if ( ucKeyIndex < 0 )
                  {
                     accessory.log( `CMD4 WARNING: No such polling characteristic: ${ key } for: ${ self.displayName }` );
                     continue;
                  }
             }
         }

         accessory.log.debug( `Setting up accessory: ${ self.displayName } for polling of: ${ CMD4_ACC_TYPE_ENUM.properties[ ucKeyIndex ].type } timeout: ${ timeout } interval: ${ interval }` );

         this.listOfPollingCharacteristics[ accessory.displayName + ucKeyIndex ] =
            setTimeout( this.characteristicPolling.bind( this, accessory, ucKeyIndex, timeout, interval ), interval );
      }
   }


   // Change polling per accessory to characteristic polling of state traits
   // Here we use the defaultPollingCharacteristics to set what characteristics
   // will be polled if accessory polling was defined in the config.json file.
   setupStatePollingPerAccessory( accessory )
   {
      // Make sure the defined characteristics will be polled
      let pollingCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ].defaultPollingCharacteristics;

      for ( let index = 0; index < pollingCharacteristicsArray.length; index++ )
      {
         let accTypeEnumIndex = pollingCharacteristicsArray[ index ];
         this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] =
                  setTimeout( this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex, accessory.timeout, accessory.interval ), accessory.interval );
      }
   }
}

function createAccessorysInformationService( accessory )
{
   // Create accessory's Information Service
   accessory.informationService = new API.hap.Service.AccessoryInformation( );

   if ( accessory.model )
      accessory.informationService
         .setCharacteristic( API.hap.Characteristic.Model, accessory.model );

   if ( accessory.manufacturer )
      accessory.informationService
         .setCharacteristic( API.hap.Characteristic.Manufacturer, accessory.manufacturer );

   if ( accessory.serialNumber )
      accessory.informationService
         .setCharacteristic( API.hap.Characteristic.SerialNumber, accessory.serialNumber );

   accessory.services.push( accessory.informationService );
}


// Compare accessory's UUID with those already created for possible duplicates
function checkAccessoryForDuplicateUUID( accessory )
{
   // check for UUID+subtype conflict
   accessory.log.debug( `Checking ${ accessory.name } for Duplicate UUID: ${ accessory.UUID }` );

   for ( let existingAccessory in accessory.COLLECTION )
   {
      if ( accessory.UUID == existingAccessory.UUID )
      {
         // This is the same check as what is in 
         // hap-nodejs/dist/lib/Accessory.js
         if ( accessory.service.subtype == existingAccessory.service.subtype )
         {
            accessory.log.error( Fg.Red + "Error" + Fg.Rm + ": Cannot add a bridged Accessory with the same UUID as another bridged Accessory: %s", getAccessoryName( existingAccessory ) );

            if ( accessory.name == existingAccessory.name )
               accessory.log.error( Fg.Red + "Duplicate accessory names can cause this issue." );

            accessory.log.error( Fg.Red + "It is wiser to define the second accessory in a different bridge." );

            process.exit( 1 );
         }
      }
   }

   accessory.log.debug( "No Duplicate UUID's for this Accessory - " + Fg.Grn + "OK" + Fg.Rm + ". Using: " + accessory.UUID );
}

function checkForUpdates( )
{
   const latestVersion = require( "latest-version" );

   const myPkg = require( "./package.json" );

   ( async( ) => {
      let lv = await latestVersion( myPkg.name );

      if ( lv != myPkg.version )
      {
         console.log( `\x1b[32m[UPDATE AVAILABLE] \x1b[0mVersion ${lv} of ${myPkg.name} is available. Any release notes can be found here: \x1b[4m${myPkg.changelog}\x1b[0m`);
      }
   })( );
}

