'use strict';

// Cmd4 includes seperated out for Unit testing
const { getAccessoryName,
        getAccessoryDisplayName } = require( "./utils/getAccessoryNameFunctions" );
let getAccessoryUUID = require( "./utils/getAccessoryUUID" );
let ucFirst = require( "./utils/ucFirst" );
let isNumeric = require( "./utils/isNumeric" );
let trueTypeOf = require( "./utils/trueTypeOf" );

let createAccessorysInformationService = require( "./utils/createAccessorysInformationService" );

// Pretty Colors
var chalk = require( "chalk" );

// These would already be initialized by index.js
let CMD4_CHAR_TYPE_ENUMS = require( "./lib/CMD4_CHAR_TYPE_ENUMS" ).CMD4_CHAR_TYPE_ENUMS;
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;

let CMD4_FORMAT_TYPE_ENUM = CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM;
let CMD4_UNITS_TYPE_ENUM = CMD4_CHAR_TYPE_ENUMS.CMD4_UNIT_TYPE_ENUM;
let CMD4_PERMS_TYPE_ENUM = CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM;

// The Cmd4 Classes
const Cmd4Accessory = require( "./Cmd4Accessory" ).Cmd4Accessory;
const Cmd4PriorityPollingQueue = require( "./Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;

// Settings, Globals and Constants
let settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );


// Function to return array split by inclusion
// returns [ truesArray, falsesArray ];
// Taken from https://stackoverflow.com/questions/11731072/dividing-an-array-by-filter-function
function partition(array, predicate)
{
   return array.reduce( ( acc, item ) => ( acc[+!predicate( item )].push( item ), acc ), [ [], [] ] );
}

// Platform definition
class Cmd4Platform
{
   constructor( log, config, api )
   {
      log.debug( chalk.blue( `Class Cmd4Platform` ) );

      if ( config === undefined )
         return;

      this.log = log;
      this.config = config;
      this.api = api;
      this.Service = this.api.hap.Service;

      // Pass along the trigger when creating the Cmd4Accessory.
      // Note: The LEVEL starts at -1 as the first one gets incremented to Zero.
      //
      //       LEVEL 0 Accessories are Platform or Standalone Accessories.
      //       LEVEL 1 Accessories are linked accessories.
      //       LEVEL 2 Accessories are added Platform accessories coerced to
      //               level 2 as a distinction. i.e. TelevisionSpeaker.

      this.CMD4 = constants.PLATFORM;
      this.LEVEL = -1;
      this.toBeRestoredPlatforms = [ ];
      this.createdCmd4Accessories = [ ];
      this.createdCmd4Platforms = [ ];

      this.services = [ ];

      // These would be queues of Characteristics to be polled or get/set via IOS.
      settings.listOfCreatedPriorityQueues = { };


      // Defaults before parse
      this.restartRecover = true;
      this.statusMsg = constants.DEFAULT_STATUSMSG;

      // Every X polls, output the queue status information.
      this.queueStatMsgInterval = constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL;
      this.queueMsg = constants.DEFAULT_QUEUEMSG;

      // Track the polling timers only so that unit testing can cancel them.
      this.pollingTimers = [ ];

      this.parseConfigForCmd4Directives( this.config );

      this.processNewCharacteristicDefinitions( );


      // didFinishLaunching is only called after the
      // registerPlatform completes.
      api.on( "didFinishLaunching", ( ) =>
      {
         this.log.info( chalk.blue( "Cmd4Platform didFinishLaunching" ) );

         if ( this.restartRecover == false &&
              this.toBeRestoredPlatforms.length > 0  )
         {
            this.log.info( chalk.yellow( `Removing ` ) + chalk.red( `*ALL* ` ) + chalk.yellow( `cached accessories as: ${ constants.RESTART_RECOVER } is set to false` ) );
            this.api.unregisterPlatformAccessories(  settings.PLUGIN_NAME, settings.PLATFORM_NAME, this.toBeRestoredPlatforms );
            this.toBeRestoredPlatforms = [ ];
         }

         this.discoverDevices( );

         // Any accessory not reachable must have been removed, find them
         this.toBeRestoredPlatforms.forEach( ( accessory ) =>
         {
            if ( ! accessory.reachable )
               this.removeAccessory( accessory );
         });

         // Let the Polling Begin
         this.startPolling();

      });
   }

   // Platforms do not use getServices. Good to know.
   //getServices( )
   //{
   //   return this.services;
   //}

   // As Per HomeBridge:
   // This function is invoked when homebridge restores cached accessories
   // from disk at startup.  It should be used to setup event handlers
   // for characteristics and update respective values.
   //
   // We do not handle restoring cached accessories ( Yet? ). Remove them
   // as we regenerate everything.
   configureAccessory( platformAccessory )
   {
      if ( platformAccessory )
      {
         this.log.debug( `Found cached accessory: ${ platformAccessory.displayName }` );
         this.toBeRestoredPlatforms.push( platformAccessory );
      }
   }

   removeAccessory( platformAccessory )
   {
      if ( ! platformAccessory )
         return;

      this.log.info( `Accessory ${ platformAccessory.displayName } will be removed.` );

      this.api.unregisterPlatformAccessories(  settings.PLUGIN_NAME, settings.PLATFORM_NAME, [ platformAccessory ] );

   }

   // Hmmmm does not happen
   //configurationRequestHandler( context, request, callback )
   //{
   //   this.log( chalk.red( `In ConfigRequestHandler context: ${ context }` ) );
   //   switch( context.step )
   //   {
   //      case 5:
   //         this.log( chalk.red( `Asked to remove` ) );
   //         break;
   //   }
   //}

   // Only parse those CMD4 directives we care about
   parseConfigForCmd4Directives( config )
   {
      for ( let key in config )
      {
         let value = config[ key ];

         // I made the stupid mistake of not having all characteristics in
         // the config.json file not upper case to match that in State.js.
         // So instead of having everyone fix their scripts, fix it here.
         let ucKey = ucFirst( key );

         switch ( ucKey )
         {
            case constants.TIMEOUT:
               // Timers are in milliseconds. A low value can result in
               // failure to get/set values
               this.timeout = parseInt( value, 10 );
               if ( this.timeout < 500 )
                  this.log.warn( `Default Timeout is in milliseconds. A value of "${ this.timeout }" seems pretty low.` );

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
               this.state_cmd_suffix = value;

               break;
            case constants.STATE_CMD:
               // What this plugin is all about
               this.state_cmd = value;

               break;
            case constants.OUTPUTCONSTANTS:
               if ( value === true )
                  this.outputConstants = true;
                else
                  this.outputConstants = false;

               break;
            case constants.RESTART_RECOVER:
               this.restartRecover = value;

               break;
            case constants.STATUSMSG:
              if ( value === false )
                 this.statusMsg = "FALSE";

               break;
            case constants.QUEUE_STAT_MSG_INTERVAL:
               this.queueStatMsgInterval = value;

               break;
            case constants.QUEUEMSG:
               this.queueMsg = value;

               break;
            case constants.FETCH:
               this.log.warn( `Warning: ${ constants.FETCH }:${ value } is changing to ${ constants.CMD4_MODE }:${ value } to reflect its affect on both Set and Get.` );
               this.log.warn( `To remove this message, change to ${ constants.CMD4_MODE }` );

               // break omitted
            case constants.CMD4_MODE:
               switch( value )
               {
                  case constants.CMD4_MODE_CACHED:
                     this.log.warn( `Warning: ${ constants.CMD4_MODE_CACHED } is changing to ${ constants.CMD4_MODE_DEMO } as it should only be used for demonstartion with no state_cmd needed.` );
                     this.log.warn( `To remove this message, change to ${ constants.CMD4_MODE_DEMO }` );
                     // break omitted
                  case constants.CMD4_MODE_DEMO:
                  case constants.CMD4_MODE_ALWAYS:
                  case constants.CMD4_MODE_POLLED:
                  case constants.CMD4_MODE_FULLYPOLLED:

                     this.cmd4Mode = value;

                     break;
                  default:
                     this.log.error( chalk.red( `Invalid value: ${ value } for ${ constants.CMD4_MODE }` ) );
                     this.log.error( `Must be: [ ${ constants.CMD4_MODE_DEMO } | ${ constants.CMD4_MODE_ALWAYS } | ${ constants.CMD4_MODE_POLLED } | ${ constants.MODE_FULLYPOLLED }` );
                     process.exit( 261 ) ;
               }
               break;
            case constants.STORAGE:
               if ( value == constants.FS_l || value == constants.GOOGLEDRIVE_l )
                  this.storage = value;
               else
                  this.log.warn( chalk.yellow( `WARNING` ) + `: Cmd4 Unknown platform.config.storage:{ this.storage } Expected:${ constants.FS_l } or ${ constants.GOOGLEDRIVE_l }` );

               break;
            case constants.STORAGEPATH:
               this.storagePath = value;

               break;
            case constants.FOLDERS:
               this.folders = value;

               break;
            case constants.KEYPATH:
               this.keyPath = value;

               break;
            case constants.DEFINITIONS:
               this.definitions = value;

               break;
            default:
         }
      }
   }
   // The purpose here is not to duplicate what is in homebridge. Just to
   // do a little checking to make sure that what is defined won't cause
   // Cmd4 to balk.  It is okay if homebridge does though ;-)
   processNewCharacteristicDefinitions( )
   {
      if ( this.definitions == undefined )
         return;

      if ( trueTypeOf( this.definitions ) != Array )
      {
         this.log.error( `Error: ${ constants.DEFINITIONS } is not an array` );
         process.exit( 270 );
      }

      this.definitions.forEach( ( definition, definitionIndex ) =>
      {
         this.log.debug( `Processing definition index: ${ definitionIndex }` );

         if ( trueTypeOf( definition.type ) != String )
         {
            this.log.error( `Error: definition.type at index: ${ definitionIndex } is not an String` );
            process.exit( 270 );
         }
         if ( trueTypeOf( definition.description ) != String )
         {
            this.log.error( `Error: definition.description at index: ${ definitionIndex } is not an String` );
            process.exit( 270 );
         }
         if ( trueTypeOf( definition.props ) != Object )
         {
            this.log.error( `Error: definition.props at index: ${ definitionIndex } is not an Oobject` );
            process.exit( 270 );
         }
         if ( trueTypeOf( definition.props.format ) != String )
         {
            this.log.error( `Error: definition.props.format at index: ${ definitionIndex } is not an String` );
            process.exit( 270 );
         }
         // Need to check if format is correct
         let formatIndex = CMD4_FORMAT_TYPE_ENUM.properties.indexOfEnum( i => i.type === definition.props.format );
         if ( formatIndex < 0 )
         {
            this.log.error( `Error: definition.props.format at index: ${ definitionIndex } is not a valid format` );
            process.exit( 270 );
         }

         if ( definition.props.units )
         {
            if ( trueTypeOf( definition.props.units ) != String )
            {
               this.log.error( `Error: definition.props.units at index: ${ definitionIndex } is not an String` );
               process.exit( 270 );
            }
            // Need to check if units is correct
            let unitsIndex = CMD4_UNITS_TYPE_ENUM.properties.indexOfEnum( i => i.type === definition.props.units );
            if ( unitsIndex < 0 )
            {
               this.log.error( `Error: definition.props.format at index: ${ definitionIndex } is not a valid format` );
               process.exit( 270 );
            }
         }

         if ( definition.props.maxValue &&
              isNumeric( definition.props.maxValue ) != true )
         {
            this.log.error( `Error: definition.props.maxValue at index: ${ definitionIndex } is not numeric` );
            process.exit( 270 );
         }
         if ( definition.props.minValue &&
              ! Number.isFinite( definition.props.minValue ) )
         {
            this.log.error( `Error: definition.props.minValue at index: ${ definitionIndex } is not finite` );
            process.exit( 270 );
         }
         if ( definition.props.minStep &&
              isNumeric( definition.props.minStep ) != true )
         {
            this.log.error( `Error: definition.props.minStep at index: ${ definitionIndex } is not numeric` );
            process.exit( 270 );
         }
         if ( trueTypeOf( definition.props.perms ) != Array )
         {
            this.log.error( `Error: definition.props.perms at index: ${ definitionIndex } is not an Array` );
            process.exit( 270 );
         }
         if ( definition.props.perms.length == 0 )
         {
            this.log.error( `Error: definition.props.perms at index: ${ definitionIndex } cannot be an empty Array` );
            process.exit( 270 );
         }
         definition.props.perms.forEach( ( perm ) =>
         {
            let permIndex = CMD4_PERMS_TYPE_ENUM.properties.indexOfEnum( i => i.type === perm );
            if ( permIndex < 0 )
            {
               this.log.error( `Error: definition.props.perms at index: ${ definitionIndex } ${ perm } is not a valid perm` );
               process.exit( 270 );
            }
         });

         if ( definition.validValues &&
              trueTypeOf( definition.validValues ) != Object )
         {
            this.log.error( `Error: definition.validValues at index: ${ definitionIndex } is not an Object` );
            process.exit( 270 );
         } else {
            definition.validValues = { };
         }

         CMD4_ACC_TYPE_ENUM.add( this.api, definition.type, definition.description, definition.props, definition.validValues );

      });
   }

   // These would be platform accessories with/without linked accessories
   discoverDevices( )
   {
      let platform;
      let log=this.log;
      let accessory;

      // loop over the config.json devices and register each one if it has not
      // already been registered.
      this.config.accessories && this.config.accessories.forEach( ( device ) =>
      {
         log.debug( `Fetching config.json Platform accessories.` );
         this.Service=this.api.hap.Service;

         device.name = getAccessoryName( device );
         let displayName = device.displayName = getAccessoryDisplayName( device );

         // generate a unique id for the accessory this should be generated from
         // something globally unique, but constant, for example, the device serial
         // number or MAC address.
         let UUID = getAccessoryUUID( device, this.api.hap.uuid );

         // See if an accessory with the same UUID has already been registered and
         // restored from the cached devices we stored in the `configureAccessory`
         // method above
         const existingAccessory = this.toBeRestoredPlatforms.find(accessory => accessory.UUID === UUID);

         if (existingAccessory)
         {
            let duplicatePlatformAccessory = this.createdCmd4Platforms.find(accessory => accessory.UUID === existingAccessory.UUID);
            if ( duplicatePlatformAccessory )
            {
               this.log( chalk.red( `Error duplicate platform accessory: ${ duplicatePlatformAccessory.name } UUID:${ duplicatePlatformAccessory.UUID }` ) );
               // Next in for.Each object iteration
               return;
            }

            log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

            // if you need to update the accessory.context then you should run
            // `api.updatePlatformAccessories`. eg.:
            //    existingAccessory.context.device = device;
            //    this.api.updatePlatformAccessories([existingAccessory]);
            //existingAccessory.context.device = device;
            //this.api.updatePlatformAccessories([existingAccessory]);

            // create the accessory handler for the restored accessory
            // this is imported from `platformAccessory.ts`
            // new ExamplePlatformAccessory(this, existingAccessory);

            platform = existingAccessory;
            platform.Service = this.Service;

            // This is how we keep the device status information over restart.
            // Within STORED_DATA_ARRAY is a list of UUID identified objects
            // of storedValuesPerCharacteristic. 
            // If the accessory has linked accessories or standalone accessories,
            // there infomation gets put in this as well.  I'm pretty sure
            // that previosly these states were lost.

            // Init the STORED_DATA_ARRAY to empty [].  If there was never any
            // type to use, this is okay to.
            let STORED_DATA_ARRAY = [ ];

            // If the saved context has our STORED_DATA_ARRAY, then use it.
            if ( existingAccessory.context.STORED_DATA_ARRAY )
            {
               this.log.debug(`Cmd4Platform: Using context.STORED_DATA_ARRAY` );
               STORED_DATA_ARRAY = existingAccessory.context.STORED_DATA_ARRAY;
            } else if ( existingAccessory.context.device.storedValuesPerCharacteristic )
            {
               // If we have an old version of the stored status, convert it to our new format.
               this.log.debug(`Cmd4Platform: Creating STORED_DATA_ARRAY with existing storedValuesPerCharacteristic UUID:${ existingAccessory.UUID }` );
               STORED_DATA_ARRAY = [ {[constants.UUID]: existingAccessory.UUID,
                                      [constants.storedValuesPerCharacteristic]: existingAccessory.context.device.storedValuesPerCharacteristic}
                      ];
               // Get rid of old persistance data
               existingAccessory.context.device = undefined;
               delete( existingAccessory.context.device );
            }

            let that = this;
            accessory = new Cmd4Accessory( that.log, device, this.api, STORED_DATA_ARRAY, this );
            accessory.platform = platform;

            // Put the accessory into its correct collection array.
            this.createdCmd4Accessories.push( accessory );

            // Store a copy of the device object in the `accessory.context`
            // the `context` property can be used to store any data about the
            // accessory you may need
            accessory.platform.context.STORED_DATA_ARRAY = accessory.STORED_DATA_ARRAY;


            // Get the properties for this accessories device type
            let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ];

            log.debug( `Step 2. ${ accessory.displayName }.service = platform.getService( Service.${ devProperties.deviceName }, ${ accessory.subType })` );
            accessory.service = platform.getService( devProperties.service, accessory.name, accessory.subType );

            // Determine which characteristics, if any, will be polled. This
            // information is also used to define which service.getValue is
            // used, either immediate, cached or polled.
            // Already done by new Cmd4Acc
            // accessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( accessory );

            // set up all services for those characteristics in the
            // config.json file
            accessory.addAllServiceCharacteristicsForAccessory( accessory );

            // Create all the services for the accessory, including fakegato
            // true = from existing.
            this.createServicesForAccessoriesChildren( accessory, true )


         } else
         {
            //
            // the accessory does not yet exist, so we need to create it
            //
            log.info('Adding new platformAccessory:', displayName);

            // Create the new PlatformAccessory
            if ( device.category == undefined )
            {
               log.debug( `Step 1. platformAccessory = new platformAccessory( ${ displayName }, ${ UUID } )` );
               platform = new this.api.platformAccessory( displayName, UUID );

            } else
            {
               // Uppercase the category to be nice. Why do I know
               // this will come back to bite me.
               let category = this.api.hap.Categories[ String( device.category ).toUpperCase( ) ];

               if ( ! category )
               {
                  log.error( `Category specified: ${ device.category } is not a valid homebridge category.` );
                  process.exit( 666 );
               }

               log.debug( `Step 1. platformAccessory = new platformAccessory( ${ displayName }, ${ UUID }, ${ category } )` );

               platform = new this.api.platformAccessory( displayName, UUID, category );
            }

            platform.Service = this.Service;

            log.info( chalk.magenta( `Configuring platformAccessory: ` ) + `${ device.displayName }` );
            let that = this;
            accessory = new Cmd4Accessory( that.log, device, this.api, [], this );
            accessory.platform = platform

            // Put the accessory into its correct collection array.
            this.createdCmd4Accessories.push( accessory );

            log.debug( `Created platformAccessory: ${ accessory.displayName }` );

            // Store a copy of the device object in the `accessory.context`
            // the `context` property can be used to store any data about the
            // accessory you may need
            accessory.platform.context.STORED_DATA_ARRAY = accessory.STORED_DATA_ARRAY;

            // Get the properties for this accessories device type
            let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ];

            // MOVE OUSTSIDE
            // Platform Step 2. const tvService = this.tvAccessory.addService( this.Service.Television );
            this.log.debug( `Step 2. ${ accessory.displayName }.service = platform.addService( this.Service.${ devProperties.deviceName }, ${ accessory.name }, ${ accessory.subType })` );
            accessory.service = platform.addService( new devProperties.service( accessory.name, accessory.subType )  );

            // Create all the services for the accessory, including fakegato
            // false = not from existing.
            this.createServicesForAccessoriesChildren( accessory, false )

            // Step 6. this.api.publishExternalAccessories( PLUGIN_NAME, [ this.tvAccessory ] );
            if ( accessory.publishExternally )
            {
               log.debug( `Step 6. publishExternalAccessories( ${ settings.PLUGIN_NAME }, [ ${accessory.displayName } ] )` );

               this.api.publishExternalAccessories( settings.PLUGIN_NAME, [ platform ] );

            } else {
               log.debug( `Step 6. registerPlatformAccessories( ${ settings.PLUGIN_NAME }, ${ settings.PLATFORM_NAME }, [ ${  accessory.displayName } ] ) `);

               this.api.registerPlatformAccessories( settings.PLUGIN_NAME, settings.PLATFORM_NAME, [ platform ] );
            }
         }


         // Just a flag to say we have processed this existing platform accessory.
         platform.updateReachability( true );


         // For Unit testing only
         this.createdCmd4Platforms.push( platform );

      });
   }

   createServicesForAccessoriesChildren( cmd4PlatformAccessory, fromExisting )
   {
      // Create the information Service for the platform itself
      // Unlike Standalone Accessories; The Platform information service is created
      // for us and the getService hangs off the platform, not the accessory.
      if ( cmd4PlatformAccessory.model )
      {
         cmd4PlatformAccessory.log.debug( `Adding model( ${ cmd4PlatformAccessory.model } ) to information service of ${ cmd4PlatformAccessory.displayName }` );
         cmd4PlatformAccessory.platform.getService( cmd4PlatformAccessory.platform.Service.AccessoryInformation )
            .setCharacteristic( this.api.hap.Characteristic.Model, cmd4PlatformAccessory.model );
      }

      if ( cmd4PlatformAccessory.manufacturer )
      {
         cmd4PlatformAccessory.log.debug( `Adding manufacturer( ${ cmd4PlatformAccessory.manufacturer } ) to information service of ${ cmd4PlatformAccessory.displayName }` );
         cmd4PlatformAccessory.platform.getService( cmd4PlatformAccessory.platform.Service.AccessoryInformation )
            .setCharacteristic( this.api.hap.Characteristic.Manufacturer, cmd4PlatformAccessory.manufacturer );
      }

      if ( cmd4PlatformAccessory.serialNumber )
      {
         cmd4PlatformAccessory.log.debug( `Adding serial Number( ${ cmd4PlatformAccessory.serialNumber } ) to information service of ${ cmd4PlatformAccessory.displayName }` );
         cmd4PlatformAccessory.platform.getService( cmd4PlatformAccessory.platform.Service.AccessoryInformation )
            .setCharacteristic( this.api.hap.Characteristic.SerialNumber, cmd4PlatformAccessory.serialNumber );
      }

      if ( cmd4PlatformAccessory.firmwareRevision )
      {
         cmd4PlatformAccessory.log.debug( `Adding Firmware Revision( ${ cmd4PlatformAccessory.firmwareRevision } ) to information service of ${ cmd4PlatformAccessory.displayName }` );
         cmd4PlatformAccessory.platform.getService( cmd4PlatformAccessory.platform.Service.AccessoryInformation )
            .setCharacteristic( this.api.hap.Characteristic.FirmwareRevision, cmd4PlatformAccessory.firmwareRevision );
      }

      // Create the service for all the accessories. i.e. Speaker Service
      // Step 3.
      //    const speakerService = this.tvAccessory.addService( this.Service.TelevisionSpeaker );
      cmd4PlatformAccessory.accessories && cmd4PlatformAccessory.accessories.forEach( ( addedAccessory ) =>
      {
         // Set the platform of the added accessories so that the accessories can call methods
         // like this one.
         addedAccessory.platform = cmd4PlatformAccessory.platform;

         // Get the properties for this accessory's device type
         let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ addedAccessory.typeIndex ];

         // Existing Accessories would have existing services
         if ( fromExisting == true )
         {
            this.log.debug( `Platform (AddedAccessory-existing) Step 3, ${ addedAccessory.displayName }.service = accessory.platform.getService( Service.${ devProperties.deviceName }, ${ addedAccessory.name }, ${ addedAccessory.subType }` );
            addedAccessory.service = addedAccessory.platform.getService( devProperties.service, addedAccessory.name, addedAccessory.subType );
         } else
         {

            this.log.debug( `Platform (AddedAccessory-new) Step 3, ${ addedAccessory.displayName }.service = PlatformAccessory: ${ cmd4PlatformAccessory.displayName } addService( Service:${ devProperties.deviceName}, ${ addedAccessory.name }, ${ addedAccessory.subType } )` );

            addedAccessory.service = cmd4PlatformAccessory.platform.addService( new devProperties.service( addedAccessory.name, addedAccessory.subType ) );
         }

         addedAccessory.addAllServiceCharacteristicsForAccessory( addedAccessory );
         // Create Information Service for the addedAccessory
         addedAccessory.log.debug( `Creating information service for AddedAccessory: ${ addedAccessory.displayName }` );
         createAccessorysInformationService( addedAccessory );

          // Setup the fakegato service if defined in the config.json file
         addedAccessory.setupAccessoryFakeGatoService( addedAccessory.fakegatoConfig );
         // Move the information service to the top of the list
         addedAccessory.services.unshift( addedAccessory.informationService );

      });

      // Create the service for all the linked accessories. i.e. HDMI Service
      cmd4PlatformAccessory.linkedAccessories && cmd4PlatformAccessory.linkedAccessories.forEach( ( linkedAccessory ) =>
      {
         // Set the platform of the linked accessories so that the accessories can call methods
         // like this one.
         linkedAccessory.platform = cmd4PlatformAccessory.platform;

         // Get the properties for this linked Accessory device type
         let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ linkedAccessory.typeIndex ];

         // Child accessories can have linked accessories. i.e. HDMI accessory
         // Step 4.
         //    const hdmi1InputService = this.tvAccessory.addService( this.Service.InputSource, `hdmi1', 'HDMI 1' );

         // Existing Accessories would have existing services
         if ( fromExisting == true )
         {
            this.log.debug( `Platform (LinkedAccessory-existing) Step 4. ${ linkedAccessory.displayName }.service = ${ cmd4PlatformAccessory.displayName }.getService:( ${ devProperties.deviceName }.service, ${linkedAccessory.name }, ${linkedAccessory.subType } )` );

            linkedAccessory.service = linkedAccessory.platform.getService( devProperties.service, linkedAccessory.name, linkedAccessory.subType );
         } else
         {
            this.log.debug( `Platform (LinkedAccessory-new) Step 4. ${ linkedAccessory.displayName }.service = ${ cmd4PlatformAccessory.displayName }.addService:( ${ devProperties.deviceName }.service, ${linkedAccessory.name }, ${linkedAccessory.subType } )` );

            linkedAccessory.service = cmd4PlatformAccessory.platform.addService( new devProperties.service( linkedAccessory.name, linkedAccessory.subType ) );
         }

         linkedAccessory.addAllServiceCharacteristicsForAccessory( linkedAccessory );

         if ( fromExisting == false )
         {
            this.log.debug( `Platform Step 5. ${ cmd4PlatformAccessory.displayName }.service.addLinkedService( ${ linkedAccessory.displayName }.service )` );
            cmd4PlatformAccessory.service.addLinkedService( linkedAccessory.service );
         }

         // Create Information Service for the linkedAccessory
         linkedAccessory.log.debug( `Creating information service for Linked Platform Accessory: ${ linkedAccessory.displayName }` );
         createAccessorysInformationService( linkedAccessory );

          // Setup the fakegato service if defined in the config.json file
         linkedAccessory.setupAccessoryFakeGatoService( linkedAccessory.fakegatoConfig );
         // Move the information service to the top of the list
         linkedAccessory.services.unshift( linkedAccessory.informationService );

      });

      // Setup all the characteristics for the platform accessory itself
      cmd4PlatformAccessory.addAllServiceCharacteristicsForAccessory( cmd4PlatformAccessory );

      // Setup the fakegato service for the platform accessory istelf.
      cmd4PlatformAccessory.setupAccessoryFakeGatoService( cmd4PlatformAccessory.fakegatoConfig );
   }

   startStaggeredPolling( staggeredPollingArray )
   {
      let delay = 0;
      let staggeredDelays = [ 3000, 6000, 9000, 12000 ];
      let staggeredDelaysLength = staggeredDelays.length;
      let staggeredDelayIndex = 0;
      let lastAccessoryUUID = ""

      staggeredPollingArray.forEach( ( entry, entryIndex )  =>
      {
         let accessory = entry.accessory;
         let accTypeEnumIndex = entry.accTypeEnumIndex;
         let timeout = entry.timeout;
         let interval = entry.interval;
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;


         setTimeout( ( ) =>
         {
            if ( entryIndex == 0 )
               accessory.log.info( `Started staggered kick off of ${ settings.arrayOfPollingCharacteristics.length } polled characteristics` );

            accessory.log.debug( `Kicking off polling for: ${ accessory.displayName } ${ characteristicString } interval:${ interval }, staggered:${ staggeredDelays[ staggeredDelayIndex ]}` );
            accessory.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
               setTimeout( accessory.characteristicPolling.bind(
                  accessory, accessory, accTypeEnumIndex, timeout, interval ), interval );

            if ( entryIndex == settings.arrayOfPollingCharacteristics.length -1 )
               accessory.log.info( `All characteristics are now being polled` );

         }, delay );


         if ( staggeredDelayIndex++ >= staggeredDelaysLength )
            staggeredDelayIndex = 0;

         if ( lastAccessoryUUID != accessory.UUID )
            staggeredDelayIndex = 0;

         lastAccessoryUUID = accessory.UUID;

         delay += staggeredDelays[ staggeredDelayIndex ];

      });
   }
   // Set parms are accTypeEnumIndex, value, callback
   // Get parms are accTypeEnumIndex, callback
   priorityGetValue( accTypeEnumIndex, callback )
   {
      let self = this;
      let details = self.lookupDetailsForPollingCharacteristic( self, accTypeEnumIndex );
      let specificQueue = settings.listOfCreatedPriorityQueues[ details.queueName ];
      // Add To Top of priority queue
      //                         ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      specificQueue.addQueueEntry( false, false, self, accTypeEnumIndex, details.interval, details.timeout, callback, null );
   }
   prioritySetValue( accTypeEnumIndex, value, callback )
   {
      let self = this;
      let details = self.lookupDetailsForPollingCharacteristic( self, accTypeEnumIndex );
      let specificQueue = settings.listOfCreatedPriorityQueues[ details.queueName ];
      //specificQueue.addQueueEntry( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      specificQueue.addQueueEntry( true, false, self, accTypeEnumIndex, details.interval, details.timeout, callback, value )
      // todo if ( relatedCharacteristic )
      // todo   AddToTopOfQueueBehindSet( get
   }



   // The delay definitions are not meant to be changed, except for unit testing
   // ==========================================================================
   // staggeredStartDelay - These would be for just polling and to be nice to the system.
   // queuedStartDelay - As this is both IOS and polling, there should be no delay.
   startPolling( staggeredStartDelay = 3000, queuedStartDelay = 0 )
   {
      let arrayOfPollingCharacteristics = [ ];
      let queuedArrayOfPollingCharacteristics = [ ];

      // Only Unit testing could possibly have no polls at all.
      if ( settings.arrayOfPollingCharacteristics.length == 0 )
      {
         this.log.debug( ` ! settings.arrayOfPollingCaracteristecs` );
         return;
      }

      // Seperate what was meant to be polled into the old staggered method
      // and the queued method
      [ arrayOfPollingCharacteristics,
        queuedArrayOfPollingCharacteristics] = partition(settings.arrayOfPollingCharacteristics, i => i.queueName === constants.DEFAULT_QUEUE_NAME);

      if ( arrayOfPollingCharacteristics.length > 0 )
      {
         let pollingTimer = setTimeout( ( ) =>
         {
            this.startStaggeredPolling( arrayOfPollingCharacteristics );
         }, staggeredStartDelay );

         this.pollingTimers.push( pollingTimer );
      }

      // Check for any queued characteristics
      if ( queuedArrayOfPollingCharacteristics.length == 0 )
      {
         this.log.debug( `No queued polling characteristics` );
         return;
      }

      // Divide the polled characteristics into their respective queue
      // Coerced to string in case the queue was a number
      queuedArrayOfPollingCharacteristics.forEach( ( elem ) =>
      {
         let queue = settings.listOfCreatedPriorityQueues[ `${ elem.queueName }` ];

         if ( queue === undefined )
         {
            this.log.debug( `Creating new Priority Polled Queue "${ elem.queueName }"` );
            queue = new Cmd4PriorityPollingQueue( this.log, elem.queueName );
            settings.listOfCreatedPriorityQueues[ elem.queueName ] = queue;
         }
         this.log.debug( `Adding ${ elem.accessory.displayName } ${ CMD4_ACC_TYPE_ENUM.properties[ elem.accTypeEnumIndex ].type }  elem.timeout: ${ elem.timeout } elem.interval: ${ elem.interval }  to Polled Queue ${ elem.queueName }` );
         //                 ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
         queue.addQueueEntry( false, true, elem.accessory, elem.accTypeEnumIndex, elem.interval, elem.timeout, null, null )

      });

      // Start polling of each queue of characteristics
      Object.keys( settings.listOfCreatedPriorityQueues ).forEach( ( queueName ) =>
      {
         let queue = settings.listOfCreatedPriorityQueues[ queueName ];
         let queuedPollingTimer = setTimeout( ( ) =>
         {
            this.log.info( ` *** Starting Priority Polling Queue "${ queue.queueName }"` );
            queue.startQueue( );
         }, queuedStartDelay );

         this.pollingTimers.push( queuedPollingTimer );
      });
   }
}

exports.Cmd4Platform = Cmd4Platform;
