'use strict';

// Cmd4 includes seperated out for Unit testing
const { getAccessoryName,
        getAccessoryDisplayName } = require( "./utils/getAccessoryNameFunctions" );
let getAccessoryUUID = require( "./utils/getAccessoryUUID" );
let ucFirst = require( "./utils/ucFirst" );

let createAccessorysInformationService = require( "./utils/createAccessorysInformationService" );

// Pretty Colors
var chalk = require( "chalk" );

// These would already be initialized by index.js
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;

// The Cmd4 Classes
const Cmd4Accessory = require( "./Cmd4Accessory" ).Cmd4Accessory;

// Settings and constants
const settings = require( "./cmd4Settings" );
const constants = require( "./cmd4Constants" );

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

      // Defaults before parse
      this.restartRecover = true;
      this.statusMsg = constants.DEFAULT_STATUSMSG;

      this.parseConfigForCmd4Directives( this.config );



      // didFinishLaunching is only called after the
      // registerPlatform completes.
      api.on( "didFinishLaunching", ( ) =>
      {
         this.log.info( chalk.blue( "Cmd4Platform didFinishLaunching" ) );

         if ( this.restartRecover == false && this.toBeRestoredPlatforms.length > 0  )
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

         // I made the stupid mistake of not having all characteristics in the config.json
         // file not upper case to match that in State.js. So instead of having everyone
         // fix their scripts, fix it here.
         let ucKey = ucFirst( key );

         switch ( ucKey )
         {
            case constants.TIMEOUT:
               // Timers are in milliseconds. A low value can result in failure to get/set values
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
            case constants.FETCH:
               switch( value )
               {
                  case constants.FETCH_ALWAYS:
                  case constants.FETCH_CACHED:
                  case constants.FETCH_POLLED:

                     this.fetch = value;

                     break;
                  default:
                     this.log.error( chalk.red( `Invalid value: ${ value } for ${ constants.FETCH }` ) );
                     this.log.error( `Must be: [ ${ constants.FETCH_ALWAYS } | ${ constants.FETCH_CACHED } | ${ constants.FETCH_POLLED }` );
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
            default:
         }
      }
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
         let uuid = getAccessoryUUID( device, this.api.hap.uuid );

         // See if an accessory with the same uuid has already been registered and
         // restored from the cached devices we stored in the `configureAccessory`
         // method above
         const existingAccessory = this.toBeRestoredPlatforms.find(accessory => accessory.UUID === uuid);

         if (existingAccessory)
         {
            let duplicatePlatformAccessory = this.createdCmd4Platforms.find(accessory => accessory.UUID === existingAccessory.UUID);
            if ( duplicatePlatformAccessory )
            {
               this.log( chalk.red( `Error duplicate platform accessory: ${ duplicatePlatformAccessory.name } uuid:${ duplicatePlatformAccessory.UUID }` ) );
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
               this.log.debug(`Cmd4Platform: Creating STORED_DATA_ARRAY with existing storedValuesPerCharacteristic uuid:${ existingAccessory.uuid }` );
               STORED_DATA_ARRAY = [ {[constants.UUID]: existingAccessory.uuid,
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
               log.debug( `Step 1. platformAccessory = new platformAccessory( ${ displayName }, ${ uuid } )` );
               platform = new this.api.platformAccessory( displayName, uuid );

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

               log.debug( `Step 1. platformAccessory = new platformAccessory( ${ displayName }, ${ uuid }, ${ category } )` );

               platform = new this.api.platformAccessory( displayName, uuid, category );
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

         // Let the polling begin
         this.log.info( chalk.green( `Polling for ${ accessory.name } started` ));
         accessory.startPollingForAccessoryAndItsChildren( accessory );
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
}

exports.Cmd4Platform = Cmd4Platform;
