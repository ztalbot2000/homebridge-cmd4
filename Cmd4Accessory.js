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
let trueTypeOf = require( "./utils/trueTypeOf" );

// For changing validValue Constants to Values and back again
var { transposeConstantToValidValue,
      transposeValueToValidConstant
    } = require( "./utils/transposeCMD4Props" );

// Correct type of given values to match characteristics format.
let characteristicValueToItsProperType =
   require( "./utils/characteristicValueToItsProperType" );

let isJSON = require( "./utils/isJSON" );

// Pretty Colors
var chalk = require( "chalk" );

// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;

// Constants
const constants = require( "./cmd4Constants" );

let FakeGatoHistoryService = null;

// Only one TV is allowed per bridge. Circumvented by
// publishing the TV externally.
let numberOfTVsPerBridge = 0;


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

      // Use parent values ( if any ) or these defaults.
      // LEVEL is a number, possibly 0 which must be handled more precisely.
      this.CMD4 = ( parentInfo && parentInfo.CMD4 ) ? parentInfo.CMD4 : constants.STANDALONE;
      this.LEVEL = ( parentInfo && parentInfo.LEVEL !== undefined ) ? parentInfo.LEVEL + 1 : 0;
      this.COLLECTION = ( parentInfo && parentInfo.COLLECTION ) ? parentInfo.COLLECTION : [ ];

      // this.log( `CMD4=${ this.CMD4 } LEVEL=${ this.LEVEL }` );

      let typeMsg =  [ "", "Linked ", "Added " ][ this.LEVEL ] || "";

      log( chalk.red ( `Creating ${ typeMsg }${ this.CMD4 } Accessory type for : ${ config.displayName }` ) );

      this.services = [ ];
      this.linkedAccessories = [ ];
      this.listOfVariables = { };
      this.listOfConstants = { };

      // Instead of polling per accessory, allow the config file to be polled per characteristic.
      this.listOfPollingCharacteristics = { };
      this.listOfRunningPolls = { };

      // DisplayName and/or Name must be defined.
      // Update config, just in case it is not set there.
      this.name = this.config.name = this.config.name || getAccessoryName( this.config );
      this.displayName = this.config.displayName = this.config.displayName || getAccessoryDisplayName( this.config );


      // Bring the parent config variables forward.
      // If they do not exist, they would still be undefined.
      this.stateChangeResponseTime = ( parentInfo && parentInfo.stateChangeResponseTime ) ? parentInfo.stateChangeResponseTime : constants.DEFAULT_INTERVAL;
      this.interval = ( parentInfo && parentInfo.interval ) ? parentInfo.interval : constants.DEFAULT_INTERVAL;
      this.timeout = ( parentInfo && parentInfo.timeout ) ? parentInfo.timeout : constants.DEFAULT_TIMEOUT;

      // undefined is acceptable.
      this.state_cmd = parentInfo && parentInfo.state_cmd;
      this.state_cmd_prefix = parentInfo && parentInfo.state_cmd_prefix;
      this.state_cmd_suffix = parentInfo && parentInfo.state_cmd_suffix;

      // TLV8 causes a lot of issues if defined and trying to parse.
      // Omit them by default.
      this.allowTLV8 = ( parentInfo && parentInfo.allowTLV8 ) ? parentInfo.TLV8 : false;

      // Instead of local variables for every characteristic, create an array to
      // hold values for  all characteristics based on the size of all possible
      // characteristics.  Placing them in .config will make them be cached over
      // restarts.
      this.config.storedValuesPerCharacteristic = config.storedValuesPerCharacteristic ||
             new Array( CMD4_ACC_TYPE_ENUM.EOL ).fill( null );

      // If polling is defined it is set to true/false, otherwise false.
      this.polling = this.config.polling === true;

      // The default fetch is immediate.
      this.fetch = this.config.fetch || 0;

      // Init the Global Fakegato service once !
      if ( FakeGatoHistoryService == null )
         FakeGatoHistoryService = require( "fakegato-history" )( api );

      // Fakegato-history definitions from parent, if any.
      this.storage = parentInfo && parentInfo.storage;
      this.storagePath = parentInfo && parentInfo.storagePath;
      this.folder = parentInfo && parentInfo.folder;
      this.keyPath = parentInfo && parentInfo.keyPath;

      // If outputConstants is defined it is set to true/false, otherwise true.
      this.outputConstants = ( parentInfo && parentInfo.outputConstants ) ? parentInfo.outputConstants : true;

      // Get the supplied values from the accessory config.
      this.parseConfig( this.config );

      // Add any required characteristics of a device that are missing from
      // a users config.json file.
      this.addRequiredCharacteristicStoredValues( );

      // The accessory cannot have the same uuid as any other
      checkAccessoryForDuplicateUUID( this );

      // The default response time is in seconds
      if ( ! this.stateChangeResponseTime )
         this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[ this.typeIndex ].devicesStateChangeDefaultTime;

      // Check the polling config for characteristics that may be set there
      // and not in the config.json.
      this.checkPollingConfigForUnsetCharacteristics( this.polling );

      // Convert the accessoriesConfig ( if any ) to an array of Cmd4Accessory
      if ( this.accessoriesConfig && this.CMD4 == constants.PLATFORM && this.LEVEL == 0 )
      {
         log( `Creating accessories for: ${ this.displayName }` );
         // Let me explain. Level 0 are standalone or platform.  Level 1 is linked. Added accessories
         // are on the same level as linked, but they are not linkedTypes, just added to the platform.
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
         log( `Creating linked accessories for: ${ this.displayName }` );
         this.linkedAccessories = this.accessoryTypeConfigToCmd4Accessories( this.linkedAccessoriesConfig, this );
      }

      // Determine which characteristics, if any, will be polled. This
      // information is also used to define which service.getValue is
      // used, either immediate, cached or polled.
      this.determineCharacteristicsToPollOfAccessoryAndItsChildren( this );

      // Create all the services for the accessory, including fakegato and polling
      // Only true Standalone accessories can have their services created and
      // polling started. Otherwise the platform will have to do this.
      if ( this.CMD4 == constants.STANDALONE  && this.LEVEL == 0 )
      {
         log.debug( `Creating Standalone service for: ${ this.displayName }` );
         this.createServicesForStandaloneAccessoryAndItsChildren( this )

         log.debug( `Creating polling for Standalone accessory: ${ this.displayName }` );
         //this.setupPollingOfAccessoryAndItsChildren( this );
         this.startPollingForAccessoryAndItsChildren( this );
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
         this.log.error ( chalk.red( "Error" ) + ": setStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.displayName );
         this.log.error ( `Check your config.json file for this error` );
         process.exit( 1 );
      }
      this.config.storedValuesPerCharacteristic[ accTypeEnumIndex ] = value;
   }

   getStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log( `CMD4 Warning: getStoredValue - Characteristic: ${ accTypeEnumIndex} for: ${ this.displayName }` );
         this.log( `Check your config.json file for this error` );
         process.exit( 1 );
      }
      return this.config.storedValuesPerCharacteristic[ accTypeEnumIndex ];
   }

   testStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
         return undefined;

      return this.config.storedValuesPerCharacteristic[ accTypeEnumIndex ];
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
         if ( format == this.api.hap.Characteristic.Formats.TLV8 && this.allowTLV8 == false )
         {
            if ( this.getStoredValueForIndex( accTypeEnumIndex ) != null )
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
      if ( trueTypeOf( pollingConfig ) != Array )
         return;

      this.log.debug( `Checking for polling of unset characteristics.` );

      pollingConfig.forEach( ( jsonPollingConfig ) =>
      {
         for ( let key in jsonPollingConfig )
         {
            let ucKey = ucFirst( key );
            let value = jsonPollingConfig[ key ];

            switch ( ucKey )
            {
               case constants.TIMEOUT:
               {
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  this.timeout = parseInt( value, 10 );
                  if ( this.timeout < 500 )
                  {
                     this.log.warn( `Timeout for: ${ this.config.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low.` );
                  }
                  break;
               }
               case constants.INTERVAL:
                  {
                  // Intervals are in seconds
                  this.interval = parseInt( value, 10 ) * 1000;
                  break;
               }
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
                        this.log.warn( `This will be an error in the future.` );
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
      accessory.log( chalk.blue( `createServicesForStandaloneAccessoryAndItsChildren` ) );
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
            //    const hdmi1InputService = this.tvAccessory.addService( this.Service.InputSource, `hdmi1', 'HDMI 1' );
            accessory.log.debug( `Standalone Step 4. linkedAccessory( ${ accessory.displayName } ).service = new Service( ${ linkedAccessory.displayName }, ${ linkedAccessory.name } )` );
            linkedAccessory.service = new properties.service( linkedAccessory.displayName, linkedAccessory.name )
            accessory.services.push( linkedAccessory.service );

            // Hmmm Double Check this !!
            // Create Information Service
            //linkedAccessory.log.debug( "Creating information service for linkedAccessory:%s", linkedAccessory.displayName );
            //createAccessorysInformationService( linkedAccessory );

            accessory.log.debug( `Standalone Step 5. ${ accessory.displayName }.service.addLinkedService( ${ linkedAccessory.displayName }` );
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

      // accessory.log( chalk.red("ZZZZ %s.services.length %s", accessory.displayName, accessory.services.length ) );

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
   //    ( 1 ) In the special TARGET set characteristics, getValue
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
      exec( cmd, { timeout: self.timeout }, function ( error, stdout, stderr )
      {
         if ( error ) {
            self.log( chalk.red( `setGeneric ${ characteristicString } function failed for ${ self.displayName } Error: ${ error.message }` ) );
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
                  self.stateChangeResponseTime = constants.FAST_STATE_CHANGE_RESPONSE_TIME;

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
   // GetCachedValue:
   //   This methos will return the cached value of a
   //   characteristic of a accessory.
   //
   // ***********************************************
   getCachedValue( accTypeEnumIndex, callback )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      let result = self.getStoredValueForIndex( accTypeEnumIndex );
      if ( result == null || result == undefined )
      {
         self.log.debug( `getCachedValue ${ characteristicString } for: ${ self.displayName } has no cahed value` );
         callback( null, null );
      }

      self.log.debug( `getCachedValue ${ characteristicString } for: ${ self.displayName } returned (CACHED) value: ${ result }` );

      // Store history using fakegato if set up
      self.updateAccessoryAttribute( accTypeEnumIndex, result );

      callback( null, result );
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

      self.log.debug( `getvalue accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } cmd: ${ cmd }` );

      // Execute command to Get a characteristics value for an accessory
      exec( cmd, { timeout:self.timeout }, function ( error, stdout, stderr )
      {
         if ( error )
         {
            self.log( `getGeneric ${ characteristicString } function for: ${ self.displayName } cmd: ${ cmd } failed.` );
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
            let words = stdout.match(/\\?.|^$/g).reduce( ( p, c ) =>
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
                        }, { a: [''] } ).a

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
               if ( words.length >= 2 )
               {
                  self.log.warn( `Warning, Retrieving ${ characteristicString }, expected only one word value for: ${ self.displayName } of: ${ stdout }` );
               }

               self.log.debug( `getValue ${ characteristicString } function for: ${ self.displayName } returned: ${ words[ 0 ] }` );


               // Even if outputConsts is not set, just in case, transpose it anyway.
               words[ 0 ] = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, words[ 0 ] )

               // Return the appropriate type, by seeing what it is defined as in Homebridge,
               words[ 0 ] = characteristicValueToItsProperType( self.log, CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format, self.displayName, self.api.hap.Characteristic, CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, words[ 0 ], self.allowTLV8 );

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
            this.log.error( chalk.red( "Error" ) + ": props for key: '%s' not in definition of %s", key, type );
            process.exit( -1 );
         }

         if ( typeof characteristicProps[ key ] !=  typeof definitions[ key ] )
         {
            this.log.error( chalk.red( "Error" ) + ": props for key: %s type %s not equal to definition of %s", key, typeof definitions[ key], typeof characteristicProps[ key] );
            process.exit( -1 );
         }
      }

      return rc;
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
       let len = this.config.storedValuesPerCharacteristic.length;

       // Check every possible characteristic
       for ( let accTypeEnumIndex = 0; accTypeEnumIndex < len; accTypeEnumIndex++ )
       {

          // If there is a stored value for this characteristic ( defined by the config file )
          // Then we need to add the characteristic too
          if ( accessory.config.storedValuesPerCharacteristic[ accTypeEnumIndex ] != undefined )
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
                if ( perms.indexOf( this.api.hap.Characteristic.Perms.WRITE ) != -1 )
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
                if ( perms.indexOf( this.api.hap.Characteristic.Perms.READ ) != -1 )
                {

                  // fetch
                  // Set how getValue works, either immediately, cached or polled.
                  // 0 -> Immediately -   Fetch immediately everything
                  // 1 -> cached      -   Fetch omly whats cached
                  // 2 -> Polled      -   Fetch cached, except for characteristics
                  //                      which are polled are fetched immediately
                  if ( accessory.fetch == 1 ||
                       accessory.fetch == 2 && ! accessory.listOfPollingCharacteristics[ accTypeEnumIndex ] )
                  {
                     this.log.debug( chalk.yellow( `Adding getCachedValue for ${ accessory.displayName } characteristic: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } ` ) );
                     //Get cachedValue
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic )
                            .on( "get", accessory.getCachedValue.bind( accessory, accTypeEnumIndex ) );
                  } else
                  {
                     this.log.debug( chalk.yellow( `Adding getValue for ${ accessory.displayName } characteristic: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }` ) );
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic )
                            .on( "get", accessory.getValue.bind( accessory, accTypeEnumIndex ) );
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
            case constants.FAKEGATO_TYPE_ENERGY:
            {
               firstParm   = this.fakegatoConfig[ constants.POWER_l ] || "0";
               ucFirstParm = ucFirst( firstParm )                     || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging ${ constants.POWER_l }: ${ firstParmValue }` );
               // Eve Energy ( Outlet service )
               this.loggingService.addEntry(
                  { [ constants.TIME_l ]  :  moment( ).unix( ),
                    [ constants.POWER_l ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_ROOM:
            {
               firstParm       = this.fakegatoConfig[ constants.TEMP_l ]     || "0";
               secondParm      = this.fakegatoConfig[ constants.HUMIDITY_l ] || "0";
               thirdParm       = this.fakegatoConfig[ constants.PPM_l ]      || "0";
               ucFirstParm     = ucFirst( firstParm )  || "0";
               ucSecondParm    = ucFirst( secondParm ) || "0";
               ucThirdParm     = ucFirst( thirdParm )  || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );


               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );


               this.log.debug( `Logging ${ constants.TEMP_l }:${ firstParmValue } ${constants.HUMIDITY_l }:${ secondParmValue } ${ constants.PPM_l }:${ thirdParmValue }` );
               // Eve Room ( TempSensor, HumiditySensor and AirQuality Services )
               this.loggingService.addEntry(
                  { [ constants.TIME_l ]     : moment( ).unix( ),
                    [ constants.TEMP_l ]     : firstParmValue,
                    [ constants.HUMidity_l ] : secondParmValue,
                    [ constants.PPM_l ]      : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_WEATHER:
            {
               firstParm       = this.fakegatoConfig[ constants.TEMP_l ]     || "0";
               secondParm      = this.fakegatoConfig[ constants.PRESSURE_l ] || "0";
               thirdParm       = this.fakegatoConfig[ constants.HUMIDITY_l ] || "0";
               ucFirstParm     = ucFirst( firstParm )  || "0";
               ucSecondParm    = ucFirst( secondParm ) || "0";
               ucThirdParm     = ucFirst( thirdParm )  || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );

               this.log.debug( `Logging ${ constants.TEMP_l }: ${ firstParmValue } ${ constants.PRESSURE_l}: ${ secondParmValue} ${ constants.HUMIDITY_l }: ${ thirdParmValue }` );

               // Eve Weather ( TempSensor Service )
               this.loggingService.addEntry(
                  { [ constants.TIME_l]     : moment( ).unix( ),
                    [ constants.TEMP_l]     : firstParmValue,
                    [ constants.PRESSURE_l] : secondParmValue,
                    [ constants.HUMIDITY_l] : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_DOOR:
            {
               firstParm   = this.fakegatoConfig[ constants.STATUS_l ] || "0";
               ucFirstParm = ucFirst( firstParm )                      || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging ${ constants.STATUS_l } status: ${ firstParmValue }` );

               this.loggingService.addEntry(
                  { [ constants.TIME_l ]   : moment( ).unix( ),
                    [ constants.STATUS_l ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_MOTION:
            {
               firstParm   = this.fakegatoConfig[ constants.STATUS_l ] || "0";
               ucFirstParm = ucFirst( firstParm )                      || "0";
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                      firstParmValue : this.getStoredValueForIndex( firstParmIndex );

               this.log.debug( `Logging ${ constants.STATUS_l }: ${ firstParmValue }` );

               this.loggingService.addEntry(
                  { [ constants.TIME_l ]   : moment( ).unix( ),
                    [ constants.STATUS_l ] : firstParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_THERMO:
            {
               firstParm       = this.fakegatoConfig[ constants.CURRENTTEMP_l ]   || "0";
               secondParm      = this.fakegatoConfig[ constants.SETTEMP_l ]       || "0";
               thirdParm       = this.fakegatoConfig[ constants.VALVEPOSITION_l ] || "0";
               ucFirstParm     = ucFirst( firstParm )  || "0";
               ucSecondParm    = ucFirst( secondParm ) || "0";
               ucThirdParm     = ucFirst( thirdParm )  || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucThirdParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );
               thirdParmValue = ( this.testStoredValueForIndex( thirdParmIndex ) == undefined ) ?
                  thirdParmValue : this.getStoredValueForIndex( thirdParmIndex );

               this.log.debug( `Logging ${ constants.CURRENTTEMP_l }: ${ firstParmValue } ${ constants.SETTEMP_l }:${ secondParmValue } ${constants.VALVEPOSITION_l }:${ thirdParmValue } `);

               // Eve Thermo ( Thermostat service )
               this.loggingService.addEntry(
                  { [ constants.TIME_l]          : moment( ).unix( ),
                    [ constants.CURRENTTEMP_l]   : firstParmValue,
                    [ constants.SETTEMP_l]       : secondParmValue,
                    [ constants.VALVEPOSITION_l] : thirdParmValue
                  });
               break;
            }
            case constants.FAKEGATO_TYPE_AQUA:
            {
               firstParm       = this.fakegatoConfig[ constants.STATUS_l ]      || "0";
               secondParm      = this.fakegatoConfig[ constants.WATERAMOUNT_l ] || "0";
               ucFirstParm     = ucFirst( firstParm )  || "0";
               ucSecondParm    = ucFirst( secondParm ) || "0";

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucFirstParm );
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucSecondParm );

               firstParmValue = ( this.testStoredValueForIndex( firstParmIndex ) == undefined ) ?
                  firstParmValue : this.getStoredValueForIndex( firstParmIndex );
               secondParmValue = ( this.testStoredValueForIndex( secondParmIndex ) == undefined ) ?
                  secondParmValue : this.getStoredValueForIndex( secondParmIndex );

               this.log.debug( `Logging ${ constants.STATUS_l }: ${ firstParmValue } ${ constants.WATERAMOUNT_l }: ${ secondParmValue }` );

               // Eve Aqua ( Valve service set to Irrigation Type )
               this.LoggingService.addEntry(
                  { [ constants.TIME_l ]        : moment( ).unix( ),
                    [ constants.STATUS_l ]      : firstParmValue,
                    [ constants.WATERAMOUNT_l ] : secondParmValue
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
          let ucKey = ucFirst ( key );
          let value = fakegatoConfig[ key ];
          switch ( ucKey )
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
                       this.log( `Invalid fakegato eve type: ${ value }` );
                       this.log( "It must be one of ( %s, %s, %s, %s, %s, %s, %s )",
                          constants.FAKEGATO_TYPE_ENERGY,
                          constants.FAKEGATO_TYPE_ROOM,
                          constants.FAKEGATO_TYPE_WEATHER,
                          constants.FAKEGATO_TYPE_DOOR,
                          constants.FAKEGATO_TYPE_MOTION,
                          constants.FAKEGATO_TYPE_THERMO,
                          constants.FAKEGATO_TYPE_AQUA );
                        this.log( `Check the Cmd4 README and ` );
                        this.log( `https://github.com/simont77/fakegato-history` );
                        process.exit( 1 );
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
                 let ucValue = ucFirst( value );
                 let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucValue );

                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if ( this.testStoredValueForIndex( accTypeEnumIndex ) == undefined && ucValue != "0" )
                    this.log.warn( `Not a valid characteristic: ${ value } for fakegato to log of: ${ key }` );
                 break;
              }
              default:
                 this.log( `Invalid fakegato key: ${ key } in json.config for: ${ this.displayName }` );
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
               { [ constants.STORAGE_l] : constants.FS,
                 [ constants.PATH_l ]   : this.storagePath
               }
            );
            this.services.push( this.loggingService );

         } else if ( this.storage == constants.GOOGLEDRIVE )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { [ constants.STORAGE_l] : constants.GOOGLEDRIVE,
                 [ constants.FOLDER_l]  : this.folder,
                 [ constants.KEYPATH_l] : this.keyPath }
            );
            this.services.push( this.loggingService );
         } else
         {
            this.log.warn( chalk.yellow( "WARNING" ) + `: Cmd4 Unknown accessory config.storage:{ this.storage } Expected:${ constants.FS } or ${ constants.GOOGLEDRIVE } for: ${ this.displayName }` );
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
         this.log.error( chalk.red( `No state_cmd for: ${ this.displayName }` ) );
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
      value = characteristicValueToItsProperType( this.log, CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format, this.displayName, this.api.hap.Characteristic, CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, value, this.allowTLV8 );

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
            case constants.TYPE:
               this.type = value;

               break;
            case constants.DISPLAYNAME:
               // DisplayName is not a characteristic but used as a parm when
               // creating the Service.  This has already been parsed, but
               // here so that parseConfig passes.
               this.displayName = value;

               break;
            case constants.UUID:
               // For those who define there own UUID
               this.UUID = value;

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
               {
                  this.log.error( `Category specified: ${ value } is not a valid homebridge category.` );
                  process.exit( 666 );
               }

               break;
            case constants.PUBLISHEXTERNALLY:
               // The user can make the accessory be published externally.
               this.publishExternally = value;

               break;
            case constants.PROPS:
               // Allow characteristic property changes.
               this.props = value;

               break;
            case constants.NAME:
               // This has already been parsed, but
               // here so that parseConfig passes and because
               // name is also a characteristic.
               this.name = value;

               // Name is also a characteristic, which must be added.
               this.parseKeyForCharacteristics( key, value );

               break;
            case constants.MODEL:
               this.model = value;

               break;
            case constants.MANUFACTURER:
               this.manufacturer = value;

               break;
            case constants.SERIALNUMBER:
               this.serialNumber = value;

               break;
            case constants.FIRMWAREREVISION:
               this.firmwareRevision = value;

               break;
            case constants.OUTPUTCONSTANTS:
               // Define if we should ouput constant strings
               // instead of values
               if ( config.outputConstants === true )

                  this.outputConstants = value;
                else
                  this.outputConstants = false;

               break;
            case constants.TIMEOUT:
               // Timers are in milliseconds. A low value can result in failure to get/set values
               this.timeout = parseInt( value, 10 );
               if ( this.timeout < 500 )
               {
                  this.log.warn( `Timeout for: ${ config.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low` );
               }

               break;
            case constants.POLLING:
               // Do not parse it yet as characteristics must be set first.
               this.polling = value;
               break;
            case constants.FETCH:
               // Do not parse it yet as characteristics must be set first.
               this.fetch = value;
               switch( value )
               {
                  case 0:
                  case constants.FETCH_ALWAYS:

                     this.fetch = 0;
                     this.log.info( `Get values set to fetch: ${ constants.FETCH_ALWAYS }` );

                     break;
                  case 1:
                  case constants.FETCH_CACHED:
                     this.fetch = 1;
                     this.log.info( `Get values set to fetch only: ${ constants.FETCH_CACHED }` );
                     break;
                  case 2:
                  case constants.FETCH_POLLED:
                     // Set them all to cached, polling will set the characteristic to immediate
                     this.fetch = 2;
                     this.log.info( `Get values set to fetch only when: ${ constants.FETCH_POLLED }` );
                     break;
                  default:
                     this.log.error( chalk.red( `Invalid value: ${ value } for ${ constants.FETCH }` ) );
                     this.log.error( `Must be: [ 0 | ${ constants.FETCH_ALWAYS }, 1 | ${ constants.FETCH_CACHED }, 2 | ${ constants.FETCH_POLLED }` );
                     process.exit( 312 ) ;
               }
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
               this.log.debug(  `parseConfig. Found linked Accessories` );
               this.linkedAccessoriesConfig = value;

               break;
            case constants.ACCESSORIES:
               this.log.debug( `parseConfig. Found Accessories` );
               this.accessoriesConfig = value;

               break;
            case constants.URL:
               this.processURL( value );

               break;
            case constants.ALLOWTLV8:
               this.allowTLV8 = true;
               break;
            case "StoredValuesPerCharacteristic":
               // Keep previous characteristic status.
               // Hmm, what happens when we increase the size ....
               this.config.storedValuesPerCharacteristic = value;
               break;
            default:
            {
               this.parseKeyForCharacteristics( key, value );
            }

         }
      }

      this.ucType = ucFirst( this.type );
      this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === this.ucType );
      if ( this.typeIndex < 0 )
      {
          this.log.error( chalk.red( `Error` ) + `: Unknown device type: ${ this.type } for: ${ this.displayName }` );
         process.exit( 1 );
      }

      // UUID must be defined or created.
      this.UUID = this.UUID || getAccessoryUUID( config, this.api.hap.uuid );

      // Solve some issues people have encounterred who
      // have had problems with shell completion which is
      // only available from shell expansion.

      if ( ! this.validateStateCmd( this.state_cmd ) )
      {
         this.log.error( chalk.red( `Error` ) + `: state_cmd: "${ this.state_cmd }" is invalid for: ${ this.displayName }` );
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
          if ( this.CMD4 == constants.PLATFORM &&  ( ! this.publishExternally || ! this.category ) ||
               this.CMD4 == constants.STANDALONE )
          {
               this.log.warn( 'Televisions should be Platform Accessories with "publishExternally": true, "category": "TELEVISION' );
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
            this.log.debug( `No polling configured.` );
            return;
         case Boolean:
            this.log.debug( `Polling config is old style. Nothing to check for unset polling characteristics` );
            return;
         case String:
            this.log.error( `Unknown type for Polling ${ pollingType }` );
            process.exit( 444 );
            return;
         case Array:
            break;
         case Object:
            this.log.warn( `Polling config for ${ this.displayName } should be an array.` );
            this.log.warn( `Converting to array, but this may be an error in the future.` );
            // Convert the object to an Array and try again.
            this.polling = [ this.polling ];
            return;
         default:
            this.log( `Do not know how to handle polling type of: ${ pollingType }` );
            return;
      }
   }

   determineCharacteristicsToPollOfAccessoryAndItsChildren( accessory )
   {
      // accessory.log.debug( "CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
      // The linked accessory children are at different levels of recursion, so only
      // allow what is posssible.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) linked accessory: ${ linkedAccessory.displayName }` );
            linkedAccessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( linkedAccessory );
         });
      }

      // The Television Speaker Platform Example
      if ( accessory.accessories && accessory.CMD4 == constants.PLATFORM && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) added accessory: ${ addedAccessory.displayName }` );
            addedAccessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( addedAccessory );
         });
      }

      // Polling can only be done if requested
      if ( ! accessory.polling || ! accessory.state_cmd )
         return;

      accessory.log.debug( `Setting up polling for: ${ accessory.displayName } and any of the children.` );

      switch ( typeof accessory.polling )
      {
         case "object":
         {
            accessory.log.debug( `Characteristic polling for: ${ accessory.displayName }` );

            for ( let jsonIndex = 0; jsonIndex < accessory.polling.length; jsonIndex ++ )
            {
               // Characteristic polling is a json type
               let jsonPollingConfig = accessory.polling[ jsonIndex ];

               // The default timeout is 1 minute. Timeouts are in milliseconds
               let timeout = constants.DEFAULT_TIMEOUT;

               // The defaault interval is 1 minute. Intervals are in seconds
               let interval = constants.DEFAULT_INTERVAL;


               let accTypeEnumIndex = -1;
               let warningDisplayed = false;

               // All this code disappears in the next major release.
               for ( let key in jsonPollingConfig )
               {
                  let ucKey = ucFirst( key );
                  let value = jsonPollingConfig[ key ];

                  switch ( ucKey )
                  {
                     case constants.TIMEOUT:
                        // Timers are in milliseconds. A low value can result in failure to get/set values
                        timeout = parseInt( value, 10 );
                        if ( timeout < 500 )
                           accessory.log.warn( `Timeout for: ${ accessory.displayName } is in milliseconds. A value of: ${ timeout } seems pretty low.` );

                        break;
                     case constants.INTERVAL:
                        // Intervals are in seconds
                        interval = parseInt( value, 10 ) * 1000;
                        break;
                     case constants.CHARACTERISTIC:
                     {
                        let ucValue = ucFirst( value );
                        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucValue );
                        if ( accTypeEnumIndex < 0 )
                        {
                           accessory.log( `CMD4 WARNING: No such polling characteristic: ${ key } for: ${ accessory.displayName }` );
                           continue;
                        }
                        break;
                     }
                     default:
                     {
                        // The key must be a characteristic property
                        // but first check if one has already been defined as we can only handle one at a time.
                        if ( accTypeEnumIndex != -1 )
                        {
                           accessory.log.error( chalk.red( `Error` ) + `: For charateristic polling, you can only define one characteristic per array item.\nCannot add "${ ucKey }" as "${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }" is already defined for: ${ accessory.displayName }` );
                           process.exit( -1 );
                        }
                        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );
                        if ( accTypeEnumIndex < 0 )
                        {
                           accessory.log.warn( `CMD4 WARNING: No such polling characteristic: ${ key } for: ${ accessory.displayName }` );
                           continue;
                        }
                        if ( warningDisplayed == false )
                        {
                           accessory.log.warn( `Characteristic polling has changed from: <characteristic>:<default value>` )
                           accessory.log.warn( `to: "Characteristic": <characteristic>` );
                           accessory.log.warn( `Please update your config.json for ${ accessory.displayName } accordingly to` );
                           accessory.log.warn( `remove this message; As in the future, this warning will be an error.` );
                           accessory.log.warn( `Sorry for the inconvenience.` );
                           warningDisplayed = true;
                        }
                     }
                  }

               }

               accessory.log.debug( `Setting up accessory: ${ accessory.displayName } for polling of: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } timeout: ${ timeout } interval: ${ interval }` );

               this.listOfPollingCharacteristics[ accTypeEnumIndex ] = {"timeout": timeout, "interval": interval};

            }
            break;
         }
         case "string":
         case "boolean":
         {
            // Change polling per accessory to characteristic polling of state traits
            // Here we use the defaultPollingCharacteristics to set what characteristics
            // will be polled if accessory polling was defined in the config.json file.

            accessory.log.debug( `State polling for: ${ accessory.displayName }` );


            // Make sure the defined characteristics will be polled
            let pollingCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ].defaultPollingCharacteristics;

            // There could be none.
            for ( let index = 0; index < pollingCharacteristicsArray.length; index++ )
            {
                let accTypeEnumIndex = pollingCharacteristicsArray[ index ];

                this.listOfPollingCharacteristics[ accTypeEnumIndex ] = {"timeout": accessory.timeout, "interval": accessory.interval};
            }

            break;
         }
         default:
         {
            accessory.log.error( chalk.red( `Error` ) + `: Something wrong with value of polling: ${ accessory.polling }\n       Check your config.json for errors.` );
            process.exit( 1 );
         }
      }
   }

   startPollingForAccessoryAndItsChildren( accessory )
   {
      let that = accessory;

      accessory.log.debug( `Starting polling for: ${ accessory.displayName }.` );

      for( let accTypeEnumIndex in accessory.listOfPollingCharacteristics )
      {
         let timeout = accessory.listOfPollingCharacteristics[ accTypeEnumIndex ].timeout;
         let interval = accessory.listOfPollingCharacteristics[ accTypeEnumIndex ].interval;
         that.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
                     setTimeout( that.characteristicPolling.bind(
                     that, accessory, accTypeEnumIndex, timeout, interval ), interval );
      }

      // accessory.log.debug( "CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
      // The linked accessory children are at different levels of recursion, so only
      // allow what is posssible.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) linked accessory: ${ linkedAccessory.displayName }` );
            linkedAccessory.startPollingForAccessoryAndItsChildren( linkedAccessory );
         });
      }

      // The Television Speaker Platform Example
      if ( accessory.accessories && accessory.CMD4 == constants.PLATFORM && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            accessory.log.debug( `Setting up polling ( ${ accessory.displayName } ) added accessory: ${ addedAccessory.displayName }` );
            addedAccessory.startPollingForAccessoryAndItsChildren( addedAccessory );
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
      if ( this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] == undefined )
         clearTimeout( this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] );

      // i.e. Characteristic.On
      // i.e.  Characteristic.RotationDirection
      // For fetch since polling, always use getValue
      self.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic
      ).getValue( );


       this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
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
         let jsonPollingConfig = self.polling[ jsonIndex ];

         // The default timeout is 1 minute. Timeouts are in milliseconds
         let timeout = constants.DEFAULT_TIMEOUT;

         // The defaault interval is 1 minute. Intervals are in seconds
         let interval = constants.DEFAULT_INTERVAL;

         let accTypeEnumIndex = -1;

         for ( let key in jsonPollingConfig )
         {
            let ucKey = ucFirst( key );
            let value = jsonPollingConfig[ key ];

            switch ( ucKey )
            {
               case constants.TIMEOUT:
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  timeout = parseInt( value, 10 );
                  if ( timeout < 500 )
                     accessory.log.warn( `Timeout for: ${ this.config.displayName } is in milliseconds. A value of: ${ timeout } seems pretty low.` );

                  break;
               case constants.INTERVAL:
                  // Intervals are in seconds
                  interval = parseInt( value, 10 ) * 1000;
                  break;
               default:
                  // The key must be a characteristic property
                  // but first check if one has already been defined as we can only handle one at a time.
                  if ( accTypeEnumIndex != -1 )
                  {
                     accessory.log.error( chalk.red( `Error` ) + `: For charateristic polling, you can only define one characteristic per array item.\nCannot add "${ ucKey }" as "${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }" is already defined for: ${ self.displayName }` );
                     process.exit( -1 );
                  }
                  accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );
                  if ( accTypeEnumIndex < 0 )
                  {
                     accessory.log( `CMD4 WARNING: No such polling characteristic: ${ key } for: ${ self.displayName }` );
                     continue;
                  }
             }
         }

         accessory.log.debug( `Setting up accessory: ${ self.displayName } for polling of: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } timeout: ${ timeout } interval: ${ interval }` );

         this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
            setTimeout( this.characteristicPolling.bind( this, accessory, accTypeEnumIndex, timeout, interval ), interval );
      }
   }


}

function createAccessorysInformationService( accessory )
{
   // Create accessory's Information Service
   accessory.informationService = new accessory.api.hap.Service.AccessoryInformation( );

   if ( accessory.model )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.Model, accessory.model );

   if ( accessory.manufacturer )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.Manufacturer, accessory.manufacturer );

   if ( accessory.serialNumber )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.SerialNumber, accessory.serialNumber );

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
            accessory.log.error( chalk.red( `Error` ) + `: Cannot add a bridged Accessory with the same UUID as another bridged Accessory: ${ getAccessoryName( existingAccessory ) }` );

            if ( accessory.name == existingAccessory.name )
               accessory.log.error( chalk.red( `Duplicate accessory names can cause this issue.` ) );

            accessory.log.error( chalk.red( `It is wiser to define the second accessory in a different bridge.` ) );

            process.exit( 1 );
         }
      }
   }

   accessory.log.debug( `No Duplicate UUID's for this Accessory - ` + chalk.green( `OK` ) + `. Using: ${ accessory.UUID }` );
}

exports.Cmd4Accessory = Cmd4Accessory;
