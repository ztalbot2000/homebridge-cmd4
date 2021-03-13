'use strict';

// 3rd Party includes
const exec = require( "child_process" ).exec;
//const spawn = require( "child_process" ).spawn;
const spawn = require( "cross-spawn" );
const moment = require( "moment" );
const fs = require( "fs" );
const commandExistsSync = require( "command-exists" ).sync;

// Cmd4 includes seperated out for Unit testing
const { getAccessoryName, getAccessoryDisplayName
      } = require( "./utils/getAccessoryNameFunctions" );
let getAccessoryUUID = require( "./utils/getAccessoryUUID" );

let createAccessorysInformationService = require( "./utils/createAccessorysInformationService" );
let isRelatedTargetCharacteristicInSameDevice = require( "./utils/isRelatedTargetCharacteristicInSameDevice" );

let ucFirst = require( "./utils/ucFirst" );
let lcFirst = require( "./utils/lcFirst" );
let trueTypeOf = require( "./utils/trueTypeOf" );

// The sObject.defineProperty is to resolve a lint issue.
// See utils/indexOfEnumLintTest.js for further information.
let indexOfEnum = require( "./utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

// For changing validValue Constants to Values and back again
var { transposeConstantToValidValue,
      transposeValueToValidConstant
    } = require( "./utils/transposeCMD4Props" );

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
   constructor( log, config, api, STORED_DATA_ARRAY, parentInfo )
   {
      this.log = log;
      this.config = config;
      this.api = api;
      // keep a copy because traversing it for format checking can be slow.
      this.Characteristic=api.hap.Characteristic;
      this.parentInfo = parentInfo;

      // Use parent values ( if any ) or these defaults.
      // LEVEL is a number, possibly 0 which must be handled more precisely.
      this.CMD4 = ( parentInfo && parentInfo.CMD4 ) ? parentInfo.CMD4 : constants.STANDALONE;
      this.LEVEL = ( parentInfo && parentInfo.LEVEL !== undefined ) ? parentInfo.LEVEL + 1 : 0;
      this.createdCmd4Accessories = ( parentInfo && parentInfo.createdCmd4Accessories ) ? parentInfo.createdCmd4Accessories : [ ];

      // this.log.debug( `CMD4=${ this.CMD4 } LEVEL=${ this.LEVEL }` );

      let typeMsg =  [ "", "Linked ", "Added " ][ this.LEVEL ] || "";

      log.debug( chalk.blue ( `Creating ${ typeMsg }${ this.CMD4 } Accessory type for : ${ config.displayName }` ) );

      this.services = [ ];
      this.linkedAccessories = [ ];
      this.listOfVariables = { };
      this.listOfConstants = { };

      // Instead of polling per accessory, allow the config file to be polled per characteristic.
      this.listOfPollingCharacteristics = { };
      this.listOfRunningPolls = { };
      this.pollingStarted = false;
      this.ServiceCreated = false;

      // DisplayName and/or Name must be defined.
      // No need to update config anymore as it is no longer cached, only the Characteristic values are.
      this.name = getAccessoryName( this.config );
      this.displayName = getAccessoryDisplayName( this.config );


      // Bring the parent config variables forward.
      // If they do not exist, they would still be undefined.
      this.stateChangeResponseTime = ( parentInfo && parentInfo.stateChangeResponseTime ) ? parentInfo.stateChangeResponseTime : constants.DEFAULT_INTERVAL;
      this.interval = ( parentInfo && parentInfo.interval ) ? parentInfo.interval : constants.DEFAULT_INTERVAL;
      this.timeout = ( parentInfo && parentInfo.timeout ) ? parentInfo.timeout : constants.DEFAULT_TIMEOUT;
      this.statusMsg = ( parentInfo && parentInfo.statusMsg ) ? parentInfo.statusMsg : constants.DEFAULT_STATUSMSG;

      // undefined is acceptable.  It can be overwritten by parseConfig
      this.state_cmd = parentInfo && parentInfo.state_cmd;
      this.state_cmd_prefix = parentInfo && parentInfo.state_cmd_prefix;
      this.state_cmd_suffix = parentInfo && parentInfo.state_cmd_suffix;

      // Define fetch up front.  It can be overwritten by parseConfig.
      this.fetch = ( parentInfo && parentInfo.fetch ) ? parentInfo.fetch : constants.FETCH_ALWAYS;

      // TLV8 causes a lot of issues if defined and trying to parse.
      // Omit them by default.
      this.allowTLV8 = ( parentInfo && parentInfo.allowTLV8 ) ? parentInfo.TLV8 : false;

      // In case it is not passed in.
      if ( STORED_DATA_ARRAY == undefined || STORED_DATA_ARRAY == null )
         this.STORED_DATA_ARRAY = [ ];
      else
         this.STORED_DATA_ARRAY = STORED_DATA_ARRAY;

      let parseConfigShouldUseCharacteristicValues = true;
      if ( ! Array.isArray( this.STORED_DATA_ARRAY ) )
      {
         this.log.warn("STORED_DATA_ARRAY passed in is not an array and should be reported.");
         this.STORED_DATA_ARRAY = [ ];
      }

      // generate a unique id for the accessory this should be generated from
      // something globally unique, but constant, for example, the device serial
      // number or MAC address.
      let uuid = getAccessoryUUID( config, this.api.hap.uuid );

      let existingData = this.STORED_DATA_ARRAY.find( data => data[constants.UUID] === uuid );
      if ( existingData )
      {
         this.log.debug(`Cmd4Accessory: found existingData for ${ this.displayName }` );
         this.storedValuesPerCharacteristic = existingData.storedValuesPerCharacteristic;

         // Do not read stored values from config.json
         parseConfigShouldUseCharacteristicValues = false;
      } else
      {
         this.log.debug(`Cmd4Accessory: creating new storedValuesPerCharacteristic for ${ this.displayName }` );
         // Instead of local variables for every characteristic, create an array to
         // hold values for  all characteristics based on the size of all possible
         // characteristics.  Placing them in .config will make them be cached over
         // restarts.
         this.storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL ).fill( null );

         this.STORED_DATA_ARRAY.push( { [constants.UUID]: uuid,
                                        [constants.storedValuesPerCharacteristic]: this.storedValuesPerCharacteristic
                                      }
                                    );
      }

      // Direct if polling should be set or false.
      // You cannot copy polling from the parent because you would be copying the array
      // of polled characteristics that the child does not have, or turning on polling
      // for linked accessories too.
      this.polling = false;


      // Init the Global Fakegato service once !
      if ( FakeGatoHistoryService == null )
         FakeGatoHistoryService = require( "fakegato-history" )( api );

      // Fakegato-history definitions from parent, if any.
      this.storage = parentInfo && parentInfo.storage;
      this.storagePath = parentInfo && parentInfo.storagePath;
      this.folder = parentInfo && parentInfo.folder;
      this.keyPath = parentInfo && parentInfo.keyPath;

      // Direct if constants should be sent or their value.
      if ( parentInfo && parentInfo.outputConstants == true )
         this.outputConstants = true;
      else
         this.outputConstants = false;

      // Get the supplied values from the accessory config.
      this.parseConfig( this.config, parseConfigShouldUseCharacteristicValues  );

      // Add any required characteristics of a device that are missing from
      // a users config.json file.
      this.addRequiredCharacteristicStoredValues( );

      // The accessory cannot have the same uuid as any other
      checkAccessoryForDuplicateUUID( this, this.UUID );

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

      // Determine which characteristics, if any, will be polled. This
      // information is also used to define which service.getValue is
      // used, either immediate, cached or polled.
      this.determineCharacteristicsToPollOfAccessoryAndItsChildren( this );

      // Create all the services for the accessory, including fakegato and polling
      // Only true Standalone accessories can have their services created and
      // polling started. Otherwise the platform will have to do this.
      if ( this.CMD4 == constants.STANDALONE && this.LEVEL == 0 )
      {
         log.debug( `Creating Standalone service for: ${ this.displayName }` );
         this.createServicesForStandaloneAccessoryAndItsChildren( this )

         log.debug( `Creating polling for Standalone accessory: ${ this.displayName }` );
         this.startPollingForAccessoryAndItsChildren( this );
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
      //   this.log.debug( Fg.Red + "ZZZZ Returning:%s number of services for:%s" + Fg.Rm, this.services.length, this.displayName );
      //} else {
      //   this.log.debug( Fg.Red + "ZZZZ Returning this.services:%s for:%s" + Fg.Rm, this.services, this.displayName );
      //}
      return this.services;
   }

   setStoredValueForIndex( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log.error ( chalk.red( `Error` ) + `: setStoredValue - Characteristic: ${ accTypeEnumIndex } for: ${ this.displayName } not known` );
         this.log.error ( `Check your config.json file for this error` );
         process.exit( 200 );
      }

      this.storedValuesPerCharacteristic[ accTypeEnumIndex ] = value;
   }

   getStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log.error( `CMD4 Warning: getStoredValue - Characteristic: ${ accTypeEnumIndex} for: ${ this.displayName }` );
         this.log.error( `Check your config.json file for this error` );
         process.exit( 205 );
      }
      return this.storedValuesPerCharacteristic[ accTypeEnumIndex ];
   }

   // Unlike get/set, testStoredValueForIndex does not call process.exit,
   // but undefined for an illegal range, in the case that rogue runtime data
   // dies not take down CMD4.
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

      this.log.debug( `Checking ${ this.displayName } for polling of unset characteristics.` );

      pollingConfig.forEach( ( jsonPollingConfig ) =>
      {
         let value;
         let valueToStore = null;
         let accTypeEnumIndex = -1;
         let key;

         for ( key in jsonPollingConfig )
         {
            let ucKey = ucFirst( key );
            value = jsonPollingConfig[ key ];

            switch ( ucKey )
            {
               case constants.TIMEOUT:
               {
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  this.timeout = parseInt( value, 10 );
                  if ( this.timeout < 500 )
                  {
                     this.log.warn( `Timeout for: ${ this.displayName } is in milliseconds. A value of "${ this.timeout }" seems pretty low.` );
                  }
                  break;
               }
               case constants.INTERVAL:
               {
                  // Intervals are in seconds
                  this.interval = parseInt( value, 10 ) * 1000;
                  break;
               }
               case constants.CHARACTERISTIC:
               {
                  //2 checkPollingOfUnsetCharacteristics
                  valueToStore = null;
                  let ucValue = ucFirst( value );
                  accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucValue );
                  if ( accTypeEnumIndex < 0 )
                  {
                     this.log.error( chalk.red( `No such polling characteristic: ${ value } for: ${ this.displayName }` ) );
                     process.exit( 210 );
                  }
                  // We can do this as this is a new way to do things.
                  let storedValue = this.getStoredValueForIndex( accTypeEnumIndex );
                  if ( storedValue == undefined )
                  {
                     this.log.error( `Polling for: "${ value }" requested, but characteristic` +
                                     `is not in your config.json file for: ${ this.displayName }` );
                     process.exit( 211 );
                  }
                  // This makes thinks nice down below.
                  valueToStore = storedValue;
                  break;
               }
               default:
               {
                  accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );

                  if ( accTypeEnumIndex < 0  )
                  {
                    this.log.error( `OOPS: "${ key }" not found while parsing for characteristic polling. There something wrong with your config.json file?` );
                    process.exit( 212 );
                  }
                  valueToStore = value;
               }
            }
         }
         if ( accTypeEnumIndex == -1 )
         {
            this.log.error( `No characteristic found while parsing for characteristic polling. There something wrong with your config.json file?` );
            process.exit( 213 );
         }
         if ( this.getStoredValueForIndex( accTypeEnumIndex ) == undefined )
         {
            this.log.warn( `Polling for: "${ key }" requested, but characteristic` );
            this.log.warn( `is not in your config.json file for: ${ this.displayName }` );
            this.log.warn( `This will be an error in the future.` );
         }

         this.setStoredValueForIndex( accTypeEnumIndex, valueToStore );
      });
   }

   createServicesForStandaloneAccessoryAndItsChildren( accessory )
   {
      accessory.log.debug( chalk.blue( `createServicesFor${ this.CMD4 }AccessoryAndItsChildren` ) );
      if ( accessory.ServiceCreated == true )
      {
         accessory.log.debug( chalk.red( `SERVICES ALREADY CREATED FOR ${ this.displayName } ${ this.CMD4 } ${ this.LEVEL }` ) );
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
            accessory.log.debug( `Standalone Step 4. linkedAccessory( ${ accessory.displayName } ).service = new Service( ${ linkedAccessory.name }, ${ linkedAccessory.subType } )` );
            linkedAccessory.service = new properties.service( linkedAccessory.name, linkedAccessory.subType )
            accessory.services.push( linkedAccessory.service );

            // Hmmm Double Check this !!
            // Create Information Service
            //linkedAccessory.log.debug( "Creating information service for linkedAccessory:%s", linkedAccessory.displayName );
            //createAccessorysInformationService( linkedAccessory );

            accessory.log.debug( `Standalone Step 5. ${ accessory.displayName }.service.addLinkedService( ${ linkedAccessory.displayName }.service` );
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
   setCachedValue( accTypeEnumIndex, value, callback )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      if ( self.statusMsg == "TRUE" )
         self.log.info( chalk.blue( `Setting (Cached) ${ self.displayName } ${ characteristicString }` ) + ` ${ value }` );
      else
         self.log.debug( `setCachedvalue accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } value: ${ value }` );


      // Save the cached value.
      // Fakegato does not need to be updated as that is done on a "Get".
      self.setStoredValueForIndex( accTypeEnumIndex, value );

      let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].relatedCurrentAccTypeEnumIndex;

      // We are currently tring to set a cached characteristics 
      // like "Target*".
      // There is no way for its relatedCurrentAccTypeEnumIndex characteristic like "Current*"
      // to be set if cached or Polled (with the exception below).

      if ( relatedCurrentAccTypeEnumIndex != null )
      {
         // We are in a "Set" but this applies to the "Get" for why we would need to
         // set the relatedCurrentAccTypeEnumIndex Characteristic as well.

         // "Get" can't be in cached if fetch:Always
         // "Get" must be cached if fetch:Cached
         //
         // For fetch:Polled
         // "Get Current" updates value when polled by calling getValue
         // "Get Current" ( From HomeKit) calls getCachedValue.
         // So we do not want to update the "Current*" value if it is being
         // polled to get the real value.
         if ( self.fetch == constants.FETCH_CACHED ||
               ( self.fetch == constants.FETCH_POLLED &&
                 self.listOfPollingCharacteristics[ relatedCurrentAccTypeEnumIndex ] &&
                 isRelatedTargetCharacteristicInSameDevice(
                     self.typeIndex,
                     accTypeEnumIndex,
                     CMD4_DEVICE_TYPE_ENUM,
                     CMD4_ACC_TYPE_ENUM
                 ) != accTypeEnumIndex )
            )
         {
            let relatedCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].type;
            self.log.info( chalk.blue( `Also Setting (Cached) ${ self.displayName } ${ relatedCharacteristicString }` ) + ` ${ value }` );
            self.setStoredValueForIndex( relatedCurrentAccTypeEnumIndex, value );
         }
      }

      callback( null );
   }


   // ***********************************************
   //
   // setValue: Method to call an external script
   //           that sets an accessories status
   //           for a given characteristic.
   //
   //
   //   The script will be passed:
   //      Set < Device Name > < accTypeEnumIndex > < Value >
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
   //          Example: Set My_Door < TargetDoorState > 1
   //            calls: Get My_Door < CurrentDoorState >
   //
   //       - Where he value in <> is an one of CMD4_ACC_TYPE_ENUM
   // ***********************************************
   setValue( accTypeEnumIndex, value, callback )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      var transposed = { "value": value, "rc": true, "msg": "" };
      if ( self.outputConstants == true )
      {
         transposed = transposeValueToValidConstant( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value );

      } else {

         transposed = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value );
      }
      if ( transposed.rc == false )
         self.log.warn( `${ self.displayName }: ${ transposed.msg }`);

      let valueToSend = transposed.value;

      let cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + valueToSend  + "'" + self.state_cmd_suffix;

      if ( self.statusMsg == "TRUE" )
         self.log.info( chalk.blue( `Setting ${ self.displayName } ${ characteristicString }` ) + ` ${ valueToSend }` );

      self.log.debug( `setvalue accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } cmd: ${ cmd }` );


      // Execute command to Set a characteristic value for an accessory
      exec( cmd, { timeout: self.timeout }, function ( error, stdout, stderr )
      {
         if ( stderr )
            self.log.error( `setValue: ${ characteristicString } function for ${ self.displayName } streamed to stderr: ${ stderr }.` );

         if ( error )
         {
            self.log.error( chalk.red( `setValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  Error: ${ error.message }` ) );
            callback( error );

            return;
         }

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].relatedCurrentAccTypeEnumIndex;
         if ( relatedCurrentAccTypeEnumIndex != null &&
                 self.listOfPollingCharacteristics[ relatedCurrentAccTypeEnumIndex ] &&
                 isRelatedTargetCharacteristicInSameDevice(
                     self.typeIndex,
                     accTypeEnumIndex,
                     CMD4_DEVICE_TYPE_ENUM,
                     CMD4_ACC_TYPE_ENUM
                 ) == relatedCurrentAccTypeEnumIndex )
         {
            let relatedCharacteristic = CMD4_ACC_TYPE_ENUM.properties[ relatedCurrentAccTypeEnumIndex ].characteristic;
            setTimeout( ( ) => {
               self.service.getCharacteristic( relatedCharacteristic ).getValue( );
            }, self.stateChangeResponseTime );

         }

         // The "Set" of the characteristic value was successful.
         // In the case where the "Get" is a long time off, then the
         // internal state value is incorrect.  Does it matter since
         // the "Get" that would occur SHOULD be to the device and
         // not for the cached value?
         // I say SHOULD as the "Set" was to the device then so
         // should the next "Get" be as well.
         // The better thing to do is just set the internal state so that
         // trying to determine the above is not a possability.
         // That being said, the possability cannot happen when fetch is
         // "Cached" or "Always", so do not change their behaviour.
         if ( self.fetch == constants.FETCH_POLLED )
            self.setStoredValueForIndex( accTypeEnumIndex, value );

         callback( 0 );

      });
   }

   // ***********************************************
   //
   // GetCachedValue:
   //   This methos will return an accessories cached
   //   characteristic value.
   //
   // ***********************************************
   getCachedValue( accTypeEnumIndex, callback )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      let storedValue = self.getStoredValueForIndex( accTypeEnumIndex );
      if ( storedValue == null || storedValue == undefined )
      {
         self.log.warn( `getCachedValue ${ characteristicString } for: ${ self.displayName } has no cached value` );

         callback( 10, null );
      }

      self.log.debug( `getCachedValue ${ characteristicString } for: ${ self.displayName } returned (CACHED) value: ${ storedValue }` );

      // Just in case the cached value needs to be converted from
      // a Constant to its valid value.
      // I can't see this happening, but who knows between upgrades
      // or restarts.
      var transposed = { "value": storedValue, "rc": true, "msg": "" };
      transposed = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, storedValue );
      if ( transposed.rc == false )
         self.log.warn( `${ self.displayName }: ${ transposed.msg }`);

      let transposedValue = transposed.value;

      // Return the appropriate type, by seeing what it is defined as
      // in Homebridge,
      //let result = self.characteristicValueToItsProperType( self, accTypeEnumIndex, transposedValue );
      let properValue = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( transposedValue  );
      if ( properValue == undefined )
      {
         // If the value is not convertable, just return it.
         self.log.warn( `${ self.displayName} ` + chalk.red( `Cannot convert value: ${ transposedValue } to ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].properties.format } for ${ characteristicString }`  ) );

         callback( 20, null );

         return;
      }

      callback( 0, properValue );

      // Store history using fakegato if set up
      self.updateAccessoryAttribute( accTypeEnumIndex, properValue );
   }

   // ***********************************************
   //
   // GetValue: Method to call an external script
   //           that returns an accessories status
   //           for a given characteristic.
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
   getValue( accTypeEnumIndex, callback  )
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      let cmd = this.state_cmd_prefix + this.state_cmd + " Get '" + this.displayName + "' '" + characteristicString  + "'" + this.state_cmd_suffix;

      self.log.debug( `getValue: accTypeEnumIndex:( ${ accTypeEnumIndex } )-"${ characteristicString }" function for: ${ self.displayName } cmd: ${ cmd }` );

      // Execute command to Get a characteristics value for an accessory
      // exec( cmd, { timeout:self.timeout }, function ( error, stdout, stderr )
      let child = spawn( cmd, { shell:true });

      const timer = setTimeout(() =>
      {
         child.kill( 'SIGINT' );
         self.log.error( chalk.red( `getValue ${ characteristicString } function timed out ${ self.timeout }ms for ${ self.displayName } cmd: ${ cmd } Failed.` ) );

         // Do not call the callback or too many will be called.
         // Prefer homebridge complain about slow response.

      }, self.timeout );

      child.stderr.on('data', ( data ) =>
      {
         self.log.error( `getValue: ${ characteristicString } function for ${ self.displayName } streamed to stderr: ${ data }.` );
      });

      child.on('close', ( code ) =>
      {
         if ( code != 0 )
         {
            self.log.error( chalk.red( `getValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  Error: ${ code }` ) );
         }

         clearTimeout( timer );
      });

      child.on('error', ( error ) =>
      {
            self.log.error( chalk.red( `getValue ${ characteristicString } function failed for ${ self.displayName } cmd: ${ cmd } Failed.  generated Error: ${ error }` ) );
      });

      child.stdout.on('data', ( reply ) =>
      {
         if ( reply == null )
         {
            self.log.error( `getValue: null returned from stdout for ${ characteristicString } ${ self.displayName }` );
            callback( 15, null );
            return;
         }

         // Coerce to string for manipulation
         reply += '';

         // Remove trailing newline or carriage return, then
         // Remove leading and trailing spaces, carriage returns ...
         let trimmedReply = reply.replace(/\n|\r$/,"").trim( );

         // Theoretically not needed as this is caught below, but I wanted
         // to catch this before much string manipulation was done.
         if ( trimmedReply.toUpperCase( ) == "NULL" )
         {
            self.log.error( `getValue: "${ trimmedReply }" returned from stdout for ${ characteristicString } ${ self.displayName }` );
            callback( 30, null );
            return;
         }

         // Handle beginning and ending matched single or double quotes. Previous version too heavy duty.
         // - Remove matched double quotes at begining and end, then
         // - Remove matched single quotes at beginning and end, then
         // - remove leading and trailing spaces.
         let unQuotedReply = trimmedReply.replace(/^"(.+)"$/,"$1").replace(/^'(.+)'$/,"$1").trim( );

         if ( unQuotedReply == "" )
         {
            self.log.error( `getValue: ${ characteristicString } function for: ${ self.displayName } returned an empty string "${ trimmedReply }"` );

            callback( 45, null );

            return;
         }

         // The above "null" checked could possibly have quotes around it.
         // Now that the quotes are removed, I must check again.  The
         // things I must do for bad data ....
         if ( unQuotedReply.toUpperCase() == "NULL" )
         {
            self.log.error( `getValue: ${ characteristicString } function for ${ self.displayName } returned the string "${ trimmedReply }"` );

            callback( 60, null );

            return;
         }

         let words = unQuotedReply.split(" ").length;
         let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
         // Temp variable is faster than traversing large object
         let hapFormats = self.Characteristic.Formats;
         if ( words > 1 &&
               ( format == hapFormats.INT    ||
                 format == hapFormats.UINT8  ||
                 format == hapFormats.UINT16 ||
                 format == hapFormats.UINT32 ||
                 format == hapFormats.BOOL   ||
                 format == hapFormats.FLOAT
               )
            )
         {
            self.log.warn( `getValue: Warning, Retrieving ${ characteristicString }, expected only one word value for: ${ self.displayName } of: ${ trimmedReply }` );
         }

         self.log.debug( `getValue: ${ characteristicString } function for: ${ self.displayName } returned: ${ unQuotedReply }` );


         // Even if outputConsts is not set, just in case, transpose
         // it anyway.
         var transposed = { "value": unQuotedReply, "rc": true, "msg": "" };
         transposed = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, unQuotedReply )
         if ( transposed.rc == false )
            self.log.warn( `${ self.displayName }: ${ transposed.msg }`);

         unQuotedReply = transposed.value;

         // Return the appropriate type, by seeing what it is
         // defined as in Homebridge,
         //unQuotedReply = self.characteristicValueToItsProperType( self, accTypeEnumIndex, unQuotedReply );
         let properValue = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( unQuotedReply );
         if ( properValue == undefined )
         {
            callback( 75, null );

            // If the value is not convertable, just return it.
            self.log.warn( `${ self.displayName} ` + chalk.red( `Cannot convert value: ${ unQuotedReply } to ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].properties.format } for ${ characteristicString }`  ) );

            return;
         }


         callback( 0, properValue );

         // Store history using fakegato if set up
         self.updateAccessoryAttribute( accTypeEnumIndex, properValue );

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
            this.log.error( chalk.red( `Error` ) + `: props for key: ${ key } not in definition of: ${ type }` );
            process.exit( 220 );
         }

         if ( typeof characteristicProps[ key ] !=  typeof definitions[ key ] )
         {
            this.log.error( chalk.red( `Error` ) + `: props for key: ${ key } type: ${ typeof definitions[ key] }  not equal to definition of: ${ typeof characteristicProps[ key] }` );
            process.exit( 221 );
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
       let len = this.storedValuesPerCharacteristic.length;

       // Check every possible characteristic
       for ( let accTypeEnumIndex = 0; accTypeEnumIndex < len; accTypeEnumIndex++ )
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
                  if ( accessory.fetch == constants.FETCH_CACHED ||
                       accessory.fetch == constants.FETCH_POLLED && ! accessory.listOfPollingCharacteristics[ accTypeEnumIndex ] )
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
                   // Similiarly to getCached, setCached is the same.
                   if ( accessory.fetch == constants.FETCH_CACHED ||
                       accessory.fetch == constants.FETCH_POLLED && ! accessory.listOfPollingCharacteristics[ accTypeEnumIndex ] )
                   {
                      // setCachedValue has parameters:
                      // accTypeEnumIndex, value, callback
                      // The first bound value though is "this"
                      let boundSetCachedValue = accessory.setCachedValue.bind( this, accTypeEnumIndex );
                      accessory.service.getCharacteristic(
                         CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ]
                         .characteristic ).on( "set", ( value, callback ) => {
                             boundSetCachedValue( value, callback );

                      });

                   } else {
                      // setValue has parameters:
                      // accTypeEnumIndex, value, callback
                      // The first bound value though is "this"
                      let boundSetValue = accessory.setValue.bind( this, accTypeEnumIndex );
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

      this.setStoredValueForIndex( accTypeEnumIndex, value );

      if ( this.loggingService )
      {
         let firstParm, secondParm, thirdParm;
         let ucFirstParm, ucSecondParm, ucThirdParm;
         let firstParmValue, secondParmValue, thirdParmValue = 0;
         let firstParmIndex, secondParmIndex, thirdParmIndex;

         switch ( this.eve )
         {
            case constants.FAKEGATO_TYPE_ENERGY_l:
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
            case constants.FAKEGATO_TYPE_ROOM_l:
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
            case constants.FAKEGATO_TYPE_WEATHER_l:
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
            case constants.FAKEGATO_TYPE_DOOR_l:
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
            case constants.FAKEGATO_TYPE_MOTION_l:
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
            case constants.FAKEGATO_TYPE_THERMO_l:
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
            case constants.FAKEGATO_TYPE_AQUA_l:
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
                    case constants.FAKEGATO_TYPE_ENERGY_l:
                    case constants.FAKEGATO_TYPE_ROOM_l:
                    case constants.FAKEGATO_TYPE_WEATHER_l:
                    case constants.FAKEGATO_TYPE_DOOR_l:
                    case constants.FAKEGATO_TYPE_MOTION_l:
                    case constants.FAKEGATO_TYPE_THERMO_l:
                    case constants.FAKEGATO_TYPE_AQUA_l:
                       break;
                    default:
                       this.log.error( `Invalid fakegato eve type: ${ value }` );
                       this.log.error( "It must be one of ( %s, %s, %s, %s, %s, %s, %s )",
                          constants.FAKEGATO_TYPE_ENERGY_l,
                          constants.FAKEGATO_TYPE_ROOM_l,
                          constants.FAKEGATO_TYPE_WEATHER_l,
                          constants.FAKEGATO_TYPE_DOOR_l,
                          constants.FAKEGATO_TYPE_MOTION_l,
                          constants.FAKEGATO_TYPE_THERMO_l,
                          constants.FAKEGATO_TYPE_AQUA_l );
                        this.log.error( `Check the Cmd4 README at ` );
                        this.log.error( `https://github.com/simont77/fakegato-history` );
                        process.exit( 225 );
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
                if ( ucValue != "0" )
                {
                   if ( accTypeEnumIndex <0 )
                   {
                      this.log.error( chalk.red( `Error` ) + `Invalid characteristic: ${ value } for` +
                                      ` fakegato to log of: ${ key }` );
                      process.exit( 216 );
                   }

                   // Make this an error, so I do not get any more tickets.
                   if ( this.listOfPollingCharacteristics[ accTypeEnumIndex ] == undefined )
                   {
                       this.log.error( chalk.red( 'Error' ) + `: Characteristic: ${ value } for fakegato` +
                                       ` to log of: ${ key } is not being polled.\n` );
                       this.log.error( `History can not be updated continiously.` );
                       process.exit( 217 );
                   }
                }
                break;
             }
             default:
                this.log.error( `Invalid fakegato key: ${ key } in json.config for: ${ this.displayName }` );
                process.exit( 218 );
          }
      }

      // Optional
      if ( this.storage != undefined )
      {
         if ( this.storage == constants.FS_l )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { [ constants.STORAGE_l] : constants.FS_l,
                 [ constants.PATH_l ]   : this.storagePath
               }
            );
            this.services.push( this.loggingService );

         } else if ( this.storage == constants.GOOGLEDRIVE_l )
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { [ constants.STORAGE_l] : constants.GOOGLEDRIVE_l,
                 [ constants.FOLDER_l]  : this.folder,
                 [ constants.KEYPATH_l] : this.keyPath }
            );
            this.services.push( this.loggingService );
         } else
         {
            this.log.warn( chalk.yellow( "WARNING" ) + `: Cmd4 Unknown accessory config.storage:{ this.storage } Expected:${ constants.FS_l } or ${ constants.GOOGLEDRIVE_l } for: ${ this.displayName }` );
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
         process.exit( 230 );
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

   parseKeyForCharacteristics( key, value, parseConfigShouldUseCharacteristicValues )
   {
      // fix the their scripts, fix it here.
      let ucKey = ucFirst( key );

      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );

      if ( accTypeEnumIndex < 0 )
      {
         this.log.error( `OOPS: "${ key }" not found for parsing key for Characteristics. There something wrong with your config.json file?` );
         process.exit( 235 );
      }

      // Do not update the stored values as it is being restored from cache
      if ( parseConfigShouldUseCharacteristicValues == false )
         return;

      if ( Object.keys( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues ).length > 0 )
      {
         // Even if outputConsts is not set, just in case, transpose it anyway.
         var transposed = { "value": value, "rc": true, "msg": "" };
         transposed = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value ) ;

         if ( transposed.rc == false )
            this.log.warn( `${ this.displayName }: ${ transposed.msg }`);

         value = transposed.value;
      }

      // Return the appropriate type, by seeing what it is defined as in Homebridge,
      //value = this.characteristicValueToItsProperType( this, accTypeEnumIndex, value );
      let properValue = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value );
      if ( properValue == undefined )
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
         // If the value is not convertable, just return it.
         this.log.warn( `parseKeyForCharacterisitcs: ${ this.displayName} ` + chalk.red( `Cannot convert value: ${ value } to ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format } for ${ characteristicString }`  ) );

         return;
      }


      this.setStoredValueForIndex( accTypeEnumIndex, properValue );
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
               process.exit( 240 );
            }

            this.log.debug( `Requiring ${ required }` );

            require( required );
         }
         return;
      }
      this.log.error( `Requires must be an array of/or list of key/value pairs: ${ requires }` );
      process.exit( 241 );
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
               process.exit( 245 );
            }

            if ( ! keyToAdd.endsWith( "}" ) )
            {
               this.log.error( `Constant definition for: ${ keyToAdd } must end with "}" for clarity.` );
               process.exit( 246 );
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
     process.exit( 247 );
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
               process.exit( 250 );
            }

            if ( ! keyToAdd.endsWith( "}" ) )
            {
               this.log.error( `Variable definition for: ${ keyToAdd } must end with "}" for clarity.` );
               process.exit( 251 );
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
      process.exit( 252 );
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
      {
         this.log.error( `url must be a string: ${ url }` );
         process.exit( 255 );
      }

      if ( this.url !== undefined )
      {
         this.log.error( `url is already defined as: ${ this.url } for: ${ url }` );
         process.exit( 256 );
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

   parseConfig( config, parseConfigShouldUseCharacteristicValues  )
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
                  process.exit( 260 );
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
               this.parseKeyForCharacteristics( key, value, parseConfigShouldUseCharacteristicValues );

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
               if ( value === true )
                  this.outputConstants = value;
                else
                  this.outputConstants = false;

               break;
            case constants.STATUSMSG:
               // During state change, display a message or not
               if ( value === true )
                  this.statusMsg = "TRUE";
                else
                  this.statusMsg = "FALSE";

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
               switch( value )
               {
                  case constants.FETCH_ALWAYS:
                  case constants.FETCH_CACHED:
                  case constants.FETCH_POLLED:

                     this.fetch = value;
                     this.log.debug( `Get values set to fetch: ${ value }` );

                     break;
                  default:
                     this.log.error( chalk.red( `Invalid value: ${ value } for ${ constants.FETCH }` ) );
                     this.log.error( `Must be: [ ${ constants.FETCH_ALWAYS } | ${ constants.FETCH_CACHED } | ${ constants.FETCH_POLLED }` );
                     process.exit( 261 ) ;
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
               this.allowTLV8 = value;
               break;
            case constants.StoredValuesPerCharacteristic:
               // handled elsewhere
               break;
            default:
            {
               this.parseKeyForCharacteristics( key, value, parseConfigShouldUseCharacteristicValues );
            }
         }
      }

      if ( trueTypeOf( this.type ) != String )
      {
          this.log.error( chalk.red( `Error` ) + `: No device type given for: ${ this.displayName }` );
         process.exit( 262 );
      }

      this.ucType = ucFirst( this.type );
      this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === this.ucType );
      if ( this.typeIndex < 0 )
      {
          this.log.error( chalk.red( `Error` ) + `: Unknown device type: ${ this.type } for: ${ this.displayName }` );
         process.exit( 263 );
      }

      // Create a subType to delimit services with multiple accessories of
      // the same type and possibly the same accessory.name.
      this.subType = this.subType || this.displayName;

      // UUID must be defined or created.
      this.UUID = this.UUID || getAccessoryUUID( config, this.api.hap.uuid );

      // Solve some issues people have encounterred who
      // have had problems with shell completion which is
      // only available from shell expansion.

      // State_cmd is only required when polling is enabled.
      if ( this.polling && ! this.validateStateCmd( this.state_cmd ) )
      {
         this.log.error( chalk.red( `Error` ) + `: state_cmd: "${ this.state_cmd }" is invalid for: ${ this.displayName }` );
         process.exit( 264 );
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

      // Check that fetch can be done in current environment..
      if ( this.fetch != constants.FETCH_CACHED && ! this.validateStateCmd( this.state_cmd ) )
      {
         this.log.error(chalk.red(`Fetch is: ${ this.fetch } but there is no valid state_cmd to use.` ) );
         process.exit( 265 );
      }

      if ( this.typeIndex == CMD4_DEVICE_TYPE_ENUM.Television )
      {
          if ( this.CMD4 == constants.PLATFORM &&  ( ! this.publishExternally || ! this.category ) ||
               this.CMD4 == constants.STANDALONE )
          {
               this.log.warn( 'Televisions should be Platform Accessories with "publishExternally": true, "category": "TELEVISION"' );
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
            process.exit( 266 );
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
            this.log.error( `Do not know how to handle polling type of: ${ pollingType }` );
            process.exit( 267 );
            return;
      }

      // We need to check for removed characteristics in the config
      let len = this.storedValuesPerCharacteristic.length;
      for ( let accTypeEnumIndex = 0; accTypeEnumIndex < len; accTypeEnumIndex ++ )
      {
         // There was a previously stored characteristic, if it was not initialized
         if ( this.storedValuesPerCharacteristic[ accTypeEnumIndex] != null )
         {
            // concert the accTypeEnumIndex to its characteristic string
            let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
            let ucCharacteristicString = ucFirst( characteristicString );
            let lcCharacteristicString = lcFirst( characteristicString );
            if ( config[ characteristicString ] != undefined ||
                 config[ lcCharacteristicString  ] != undefined ||
                 config[ ucCharacteristicString  ] != undefined )
            {
               continue;
            } else {
                this.log.warn(`Removing previously configured characteristic: ${ characteristicString }`);
                this.storedValuesPerCharacteristic[ accTypeEnumIndex ] = null;
            }
         }
      }
   }

   determineCharacteristicsToPollOfAccessoryAndItsChildren( accessory )
   {
      let log = accessory.log;

      // log.debug( "CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
      // The linked accessory children are at different levels of recursion, so only
      // allow what is posssible.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            if ( linkedAccessory.polling != false )
            {
               log.debug( `Setting up polling ( ${ accessory.displayName } ) linked accessory: ${ linkedAccessory.displayName }` );
               linkedAccessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( linkedAccessory );
            }
         });
      }

      // The Television Speaker Platform Example
      if ( accessory.accessories && accessory.CMD4 == constants.PLATFORM && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            if ( addedAccessory.polling != false )
            {
               log.debug( `Setting up polling ( ${ accessory.displayName } ) added accessory: ${ addedAccessory.displayName }` );
               addedAccessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( addedAccessory );
            }
         });
      }

      // Polling cannot be done if there is no state_cmd
      if ( ! accessory.state_cmd )
         return;

      // Now that polling calls updateValue and is not dependant on getValue, which was possibly cached,
      // Any accessories characteristic can be polled, regardless of fetch.

      log.debug( `Setting up polling for: ${ accessory.displayName } and any of the children.` );

      let warningDisplayed = false;
      switch ( typeof accessory.polling )
      {
         case "object":
         {
            log.debug( `Characteristic polling for: ${ accessory.displayName }` );

            for ( let jsonIndex = 0; jsonIndex < accessory.polling.length; jsonIndex ++ )
            {
               // Characteristic polling is a json type
               let jsonPollingConfig = accessory.polling[ jsonIndex ];

               // The default timeout is 1 minute. Timeouts are in milliseconds
               let timeout = constants.DEFAULT_TIMEOUT;

               // The defaault interval is 1 minute. Intervals are in seconds
               let interval = constants.DEFAULT_INTERVAL;

               let value;
               let accTypeEnumIndex = -1;

               // All this code disappears in the next major release.
               for ( let key in jsonPollingConfig )
               {
                  let ucKey = ucFirst( key );
                  value = jsonPollingConfig[ key ];

                  switch ( ucKey )
                  {
                     case constants.TIMEOUT:
                        // Timers are in milliseconds. A low value can result in failure to get/set values
                        timeout = parseInt( value, 10 );
                        if ( timeout < 500 )
                           log.warn( `Timeout for: ${ accessory.displayName } is in milliseconds. A value of: ${ timeout } seems pretty low.` );

                        break;
                     case constants.INTERVAL:
                        // Intervals are in seconds
                        interval = parseInt( value, 10 ) * 1000;
                        break;
                     case constants.CHARACTERISTIC:
                     {
                        //1 DetermineCharacteristicsToPollAndItsChildren
                        let ucValue = ucFirst( value );
                        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucValue );
                        if ( accTypeEnumIndex < 0 )
                        {
                           log.error( chalk.red( `No such polling characteristic: ${ value } for: ${ accessory.displayName }` ) );
                           process.exit( 261 );
                        }
                        // We can do this as this is a new way to do things.
                        if ( this.getStoredValueForIndex( accTypeEnumIndex ) == undefined )
                        {
                           this.log.error( `Polling for: "${ value }" requested, but characteristic` +
                                           ` is not in your config.json file for: ${ this.displayName }` );
                           process.exit( 262 );
                        }
                        break;
                     }
                     default:
                     {
                        // The key must be a characteristic property
                        // but first check if one has already been defined as we can only handle one at a time.
                        if ( accTypeEnumIndex != -1 )
                        {
                           log.error( chalk.red( `Error` ) + `: For charateristic polling, you can only define one characteristic per array item.\nCannot add "${ ucKey }" as "${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type }" is already defined for: ${ accessory.displayName }` );
                           process.exit( 263 );
                        }
                        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === ucKey );
                        if ( accTypeEnumIndex < 0 )
                        {
                           log.error( chalk.red( `Error` ) + ` No such polling characteristic: ${ key } for: ${ accessory.displayName }` );
                           process.exit( 264 );
                        }
                        if ( warningDisplayed == false )
                        {
                           log.warn( `Characteristic polling has changed` )
                           log.warn( `from: <characteristic>:<default value>` )
                           log.warn( `to: "Characteristic": <characteristic>` );
                           log.warn( `Please update your config.json for ${ accessory.displayName } accordingly to` );
                           log.warn( `remove this message; As in the future, this warning will be an error.` );
                           log.warn( `Sorry for the inconvenience.` );
                           warningDisplayed = true;
                        }
                     }
                  }
               }

               log.debug( `Setting up accessory: ${ accessory.displayName } for polling of: ${ CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type } timeout: ${ timeout } interval: ${ interval }` );

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

            if ( accessory.polling == true )
            {
               log.debug( `State polling for: ${ accessory.displayName }` );


               // Make sure the defined characteristics will be polled
               let pollingCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[ accessory.typeIndex ].defaultPollingCharacteristics;

               // There could be none.
               for ( let index = 0; index < pollingCharacteristicsArray.length; index++ )
               {
                   let accTypeEnumIndex = pollingCharacteristicsArray[ index ];

                   this.listOfPollingCharacteristics[ accTypeEnumIndex ] = {"timeout": accessory.timeout, "interval": accessory.interval};
               }
            }

            break;
         }
         default:
         {
            log.error( chalk.red( `Error` ) + `: Something wrong with value of polling: ${ accessory.polling }\n       Check your config.json for errors.` );
            process.exit( 262 );
         }
      }

      // Over what has asked to be polled
      for( let accTypeEnumIndex in this.listOfPollingCharacteristics )
      {
         // Look to see if currently polled characteristics are like "Current*" and have
         // a related characteristic like "Target*"
         // Note: By default it will be put their automatically as this message says
         //     **** Adding required characteristic TargetTemperature for Thermostat
         //          Not defining a required characteristic can be problematic
         //     Except for Optional "Current*" "Target*" characteristics which
         //     isRelatedTargetCharacteristicInSameDevice does resolve.
         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].relatedTargetAccTypeEnumIndex;

         if ( relatedTargetAccTypeEnumIndex != null &&
              isRelatedTargetCharacteristicInSameDevice(
                  this.typeIndex,
                  accTypeEnumIndex,
                  CMD4_DEVICE_TYPE_ENUM,
                  CMD4_ACC_TYPE_ENUM
              ) == relatedTargetAccTypeEnumIndex )
         {
            // Check that the characteristic like "Target*" is also requested to be polled
            if ( ! this.listOfPollingCharacteristics[ relatedTargetAccTypeEnumIndex ] )
            {
               let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
               let relatedCharacteristicString = CMD4_ACC_TYPE_ENUM.properties[ relatedTargetAccTypeEnumIndex ].type;
               this.log.warn( `Warning, With fetch set to "${ this.fetch }" and polling for "${ characteristicString }" requested, you also must do polling of "${ relatedCharacteristicString }" or things will not function properly` );
            }
         }
      }
   }

   startPollingForAccessoryAndItsChildren( accessory )
   {
      // Create all the services for the accessory, including fakegato and polling
      // Only true Standalone accessories can have their services created and
      // polling started. Otherwise the platform will have to do this.
      if ( accessory.pollingStarted == true )
      {
         accessory.log.debug( chalk.red( `POLLING ALREADY RUNNING FOR ${ this.displayName } ${ this.CMD4 } ${ this.LEVEL }` ) );
         return;
      } else {
         accessory.pollingStarted = true;
      }

      let startDelay = 3500;
      let staggeredDelays = [ 0 ];
      // If Everything is being fetched "Always", stagger each poll
      if ( accessory.fetch == constants.FETCH_ALWAYS )
      {
         startDelay = 5000;
         staggeredDelays = [ 0, 672, 1332, 1879 ];
      }

      let staggeredDelayIndex = 0;

      // Delay the initial poll because a large anount of accessories, hammer the system.
      setTimeout( ( ) =>
      {
         let that = accessory;


         for( let accTypeEnumIndex in accessory.listOfPollingCharacteristics )
         {
            if ( staggeredDelayIndex++ > staggeredDelays.length )
               staggeredDelayIndex = 0;

            setTimeout( ( ) =>
            {
               let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
               accessory.log.debug( `Starting polling for: ${ accessory.displayName } ${ characteristicString }` );

               let timeout = accessory.listOfPollingCharacteristics[ accTypeEnumIndex ].timeout;
               let interval = accessory.listOfPollingCharacteristics[ accTypeEnumIndex ].interval;
               that.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
                           setTimeout( that.characteristicPolling.bind(
                           that, accessory, accTypeEnumIndex, timeout, interval ), interval );

            }, staggeredDelays[ staggeredDelayIndex ] );
         }

         // accessory.log.debug( "CMD4=%s LEVEL=%s for %s", accessory.CMD4, accessory.LEVEL, accessory.displayName );
         // The linked accessory children are at different levels of recursion, so only
         // allow what is posssible.
         if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
         {
            accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
            {
               linkedAccessory.startPollingForAccessoryAndItsChildren( linkedAccessory );
            });
         }

         // The Television Speaker Platform Example
         if ( accessory.accessories && accessory.CMD4 == constants.PLATFORM && accessory.LEVEL == 0 )
         {
            accessory.accessories.forEach( ( addedAccessory ) =>
            {
               addedAccessory.startPollingForAccessoryAndItsChildren( addedAccessory );
            });
         }
     }, startDelay );
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
         self.log.error( chalk.red( `Error` ) + `: No Such polling accTypeEnumIndex: ${ accTypeEnumIndex } for: ${ self.displayName }` );
         process.exit( 263 );
         return;
      }

      // Clear polling
      if ( this.listOfRunningPolls &&
           this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] == undefined )
              clearTimeout( this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] );

      // i.e. Characteristic.On
      //      Characteristic.RotationDirection

      accessory.getValue( accTypeEnumIndex, function ( error, properValue) {
      {
         if ( error == 0 )
         {
            let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

            accessory.log.debug( chalk.blue( `characteristicPolling Updating ${ accessory.displayName } ${ characteristicString }` ) + ` ${ properValue }` );

            accessory.service.getCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic ).updateValue( properValue );
         }

      }});



      // Add the check of this.listOfRunningPolls so that in Unit Testing, we can delete polling 
      // if we want to.
      if ( this.listOfRunningPolls )
         this.listOfRunningPolls[ accessory.displayName + accTypeEnumIndex ] =
            setTimeout( this.characteristicPolling.bind(
               this, accessory, accTypeEnumIndex, timeout, interval ), interval );
   }
}

// Compare accessory's UUID with those already created for possible duplicates
function checkAccessoryForDuplicateUUID( accessory, UUID )
{
   // check for UUID+subtype conflict
   accessory.log.debug( `Checking ${ accessory.name } for Duplicate UUID: ${ accessory.UUID }` );

   for ( let existingAccessory in accessory.createdCmd4Accessories )
   {
      if ( UUID == existingAccessory.UUID )
      {
         // This is the same check as what is in 
         // hap-nodejs/dist/lib/Accessory.js
         if ( accessory.service.subtype == existingAccessory.service.subtype )
         {
            accessory.log.error( chalk.red( `Error` ) + `: Cannot add a bridged Accessory with the same UUID as another bridged Accessory: ${ getAccessoryName( existingAccessory ) }` );

            if ( accessory.name == existingAccessory.name )
               accessory.log.error( chalk.red( `Duplicate accessory names can cause this issue.` ) );

            accessory.log.error( chalk.red( `It is wiser to define the second accessory in a different bridge.` ) );

            process.exit( 270 );
         }
      }
      // Check for duplicates in Added accessories.
      if ( accessory.addedAccessories && accessory.LEVEL == 0 )
      {
         accessory.accessories.forEach( ( addedAccessory ) =>
         {
            checkAccessoryForDuplicateUUID( addedAccessory, UUID );
         });
      }

      // Check for duplicates in Linked accessories.
      if ( accessory.linkedAccessories && accessory.LEVEL == 0 )
      {
         accessory.linkedAccessories.forEach( ( linkedAccessory ) =>
         {
            checkAccessoryForDuplicateUUID( linkedAccessory, UUID );
         });
      }
   }

   accessory.log.debug( `No Duplicate UUID's for this Accessory - ` + chalk.green( `OK` ) + `. Using: ${ accessory.UUID }` );
}

exports.Cmd4Accessory = Cmd4Accessory;
