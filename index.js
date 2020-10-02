'use strict';
const exec = require("child_process").exec;
const moment = require('moment');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;

let getAccessoryName = require('./utils/getAccessoryName');



let isNumeric = require('./utils/isNumeric');
let ucFirst = require('./utils/ucFirst');
let indexOfEnum = require('./utils/indexOfEnum');

// * For chaning validValue Constants to Values and back again
var { transposeConstantToValidValue,
      transposeValueToValidConstant } = require( "./utils/transposeCMD4Props" );

let isJSON = require('./utils/isJSON');

const FgMagenta = "\x1b[35m"
const FgBlack = "\x1b[30m"


const SLOW_STATE_CHANGE_RESPONSE_TIME   = 10000;  // 10 seconds
const MEDIUM_STATE_CHANGE_RESPONSE_TIME = 3000;   // 3 seconds
const FAST_STATE_CHANGE_RESPONSE_TIME   = 1000;   // 1 second

const DEFAULT_TIMEOUT = 60000; /// 1 minute

const DEFAULT_INTERVAL = 60000; /// 1 minute

const FAKEGATO_TYPE_ENERGY  = 'energy',
      FAKEGATO_TYPE_ROOM    = 'room',
      FAKEGATO_TYPE_WEATHER = 'weather',
      FAKEGATO_TYPE_DOOR    = 'door',
      FAKEGATO_TYPE_MOTION  = 'motion',
      FAKEGATO_TYPE_THERMO  = 'thermo',
      FAKEGATO_TYPE_AQUA    = 'aqua';



var FakeGatoHistoryService;
var Accessory;
var Service;
var Characteristic;
var UUIDGen;

var ACC_DATA = require('./lib/CMD4_ACC_TYPE_ENUM');
// This would be the uninitialized value (No Characteristics )
var CMD4_ACC_TYPE_ENUM = ACC_DATA.CMD4_ACC_TYPE_ENUM;

var DEVICE_DATA = require('./lib/CMD4_DEVICE_TYPE_ENUM');
// This would be the uninitialized value (No Characteristics )
var CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.CMD4_DEVICE_TYPE_ENUM;

var foundAccessories = [];
//console.log("CMD4_ACC_TYPE_ENUM");
//console.log(CMD4_ACC_TYPE_ENUM);
//console.log(CMD4_DEVICE_TYPE_ENUM);


module.exports =
{
  default: function (homebridge)
  {

     // Accessory must be created from PlatformAccessory Constructor
     Accessory = homebridge.platformAccessory;

     Service = homebridge.hap.Service;
     Characteristic = homebridge.hap.Characteristic;

     UUIDGen = homebridge.hap.uuid;

     CMD4_ACC_TYPE_ENUM = ACC_DATA.init(Characteristic);

     CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init(CMD4_ACC_TYPE_ENUM, Service, Characteristic);

     foundAccessories = [];


     // If you see these lines in other plugins with true, at the end,
     // you would provide a configurationRequestHandler to add/Remove
     // individual accessories. I believe this is old school as HomeKit
     // does not let you do this anymore.
     homebridge.registerAccessory('homebridge-cmd4', 'Cmd4', Cmd4Accessory);
     homebridge.registerPlatform('homebridge-cmd4', 'Cmd4', Cmd4Platform);

     FakeGatoHistoryService = require('fakegato-history')(homebridge);

     // This is not required by homebridge and does not affect it.  I use it for
     // unit testing.
     return {CMD4_ACC_TYPE_ENUM,
             CMD4_DEVICE_TYPE_ENUM,
             Accessory,
             Service,
             Characteristic,
             UUIDGen,
             foundAccessories};
     },
     // These would be the uninitialized values, used for unit testing
     CMD4_ACC_TYPE_ENUM: CMD4_ACC_TYPE_ENUM,        // properties would be {} empty.
     CMD4_DEVICE_TYPE_ENUM: CMD4_DEVICE_TYPE_ENUM,  // properties would be {} empty.
     Accessory: Accessory,                          // Would be undefined
     Service: Service,                              // Would be undefined
     Characteristic: Characteristic,                // Would be undefined
     UUIDGen: UUIDGen,                              // Would be undefined
     FoundAccessories:foundAccessories              // Would be {}  empty
}


// Platform definitions
function Cmd4Platform(log, config, api)
{
   this.log = log;
   this.config = config || {'platform': 'cmd4'};

   setTimeout(checkForUpdates, 1800);

   this.reachable = true;

   // Instead of polling per accessory, allow the config file to be polled per characteristic.
   this.listOfPollingCharacteristics = {};


   //this.storage     = undefined;               // Default - disabled
   //this.storagePath = undefined;               // Default path for storage of 'fs'

   //this.folder.     = undefined;               // Default for storage of 'GoogleDrive'
   //this.keypath     = undefined;               // Default for storage of 'GoogleDrive'

   // Define platform config for fakegato-history
   if ( config.storage != undefined )
   {
      if ( config.storage == "fs" )
      {
         this.storage = config.storage;
      } else if ( config.storage == "googleDrive" )
      {
         this.storage = config.storage;
      } else {
         this.log("WARNING: Cmd4: Unknown platform.config.storage:%s. Expected 'fs' or 'googleDrive' ", config.storage);
      }
   }

   // Define platform config storagePath for fakegato-history
   this.storagePath = config.storagePath;

   // Define platform config folder for fakegato-history
   this.folder = config.folder;

   // Define platform config keyPath for fakegato-history
   this.keyPath = config.keyPath;

   // If outputConstants is defined it is set to true/false, otherwise false.
   this.outputConstants = config.outputConstants === true;

}

Cmd4Platform.prototype =
{
   accessories: function(callback)
   {
      let that = this;

      this.log("Fetching config.json devices.");
      for( let i=0; i<this.config.accessories.length; i++ )
      {
         // Since we do not know the accwssories name yet
         this.log(FgMagenta + "Processing accessory: " + FgBlack + getAccessoryName(this.config.accessories[i]) );

         // This will create an accessory based on the Cmd4Accessory
         // definition bellow. This is not obvious for a newbie.
         let accessory = new Cmd4Accessory( that.log, that.config, this.config.accessories[i], null );
         foundAccessories.push( accessory );
      }
      for( let i=0; i < foundAccessories.length; i++ )
      {
         let accessory = foundAccessories[i];

         if ( accessory.polling && accessory.state_cmd)
         {
            switch (typeof accessory.polling)
            {
               case 'object':
                  this.log.debug("Characteristic polling for:%s", accessory.displayName);
                  this.setupCharacteristicPolling(accessory);
                  break;
               case 'string':
               case 'boolean':
                  this.log.debug("State polling for:%s", accessory.displayName);
                  this.setupStatePollingPerAccessory(accessory);
                  break;
               default:
                  this.log("CMD4 Error: Something wrong with value of polling:%s", accessory.polling);
                  this.log("            Check your config.json for errors.");
                  process.exit(1);
             }
          }
      }
      callback(foundAccessories);
   }
}

Cmd4Platform.prototype.characteristicPolling = function (accessory, accTypeEnumIndex, timeout, interval)
{
   let self = accessory;

   self.log.debug("Doing Poll of index:%s characteristic:%s for:%s timeout=%s interval=%s", accTypeEnumIndex,
          CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type, self.displayName, timeout, interval);

   // Make sure that the characteristic exists
   if ( accTypeEnumIndex < 0 )
   {
      self.log("CMD4 WARNING: No such polling accTypeEnumIndex '%d' for:%s",
         accTypeEnumIndex, self.displayName);
      return;
   }

   // Clear polling
   if (this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] == undefined)
      clearTimeout(this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ]);

   // i.e. Characteristic.On
   // i.e.  Characteristic.RotationDirection
   self.service.getCharacteristic(
      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic
   ).getValue();


    this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] =
       setTimeout(this.characteristicPolling.bind(
          this, accessory, accTypeEnumIndex, timeout, interval), interval);

 }

 Cmd4Platform.prototype.setupCharacteristicPolling = function (accessory)
{
   let self = accessory;

   self.log.debug("Setting up:%s polling characteristics of accessory:%s",
      self.polling.length, self.displayName);

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
         let ucKey = ucFirst(key);
         let value = jsonPollingConfig[key];

         switch (ucKey)
         {
            case "Timeout":
               // Timers are in milliseconds. A low value can result in failure to get/set values
               timeout = parseInt(value, 10);
               if ( timeout < 500 )
               {
                   this.log.warn("Timeout for:%s is in milliseconds. A value of '%d' seems pretty low.",
                          this.config.displayName, timeout);
               }
               break;
            case "Interval":
               // Intervals are in seconds
               interval = parseInt(value, 10) * 1000;
               break;
            default:
               // The key must be a characteristic property
               // but first check if one has already been defined as we can only handle one at a time.
               if ( ucKeyIndex != -1 )
               {
                  this.log.error("For charateristic polling, you can only define one characteristic per array item.  Error: Cannot add '%s' as '%s' is already defined for %s.", ucKey, CMD4_ACC_TYPE_ENUM.properties[ucKeyIndex].type, self.displayName);
                  process.exit(-1);
               }
               ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucKey);
               if ( ucKeyIndex < 0 )
               {
                  self.log("CMD4 WARNING: No such polling characteristic:%s for:%s",
                       key, self.displayName);
                   continue;
               }
          }
      }

      self.log.debug("Setting up accessory:%s for polling of:%s timeout:%s interval:%s", self.displayName, CMD4_ACC_TYPE_ENUM.properties[ucKeyIndex].type, timeout, interval);

      this.listOfPollingCharacteristics[ accessory.displayName + ucKeyIndex ] =
         setTimeout(this.characteristicPolling.bind(this, accessory, ucKeyIndex, timeout, interval), interval);

   }
}

// Change polling per accessory to characteristic polling of state traits
// Here we use the defaultPollingCharacteristics to set what characteristics
// will be polled if accessory polling was defined in the config.json file.
Cmd4Platform.prototype.setupStatePollingPerAccessory = function (accessory)
{
   // Make sure the defined characteristics will be polled
   let pollingCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[accessory.typeIndex].defaultPollingCharacteristics;

   for (let index = 0; index < pollingCharacteristicsArray.length; index++)
   {
      let accTypeEnumIndex = pollingCharacteristicsArray[index];
      this.listOfPollingCharacteristics[ accessory.displayName + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
               this, accessory, accTypeEnumIndex, accessory.timeout, accessory.interval), accessory.interval);
   }
}

// Accessory definitions - THE GOOD STUFF STARTs HERE
// The parent could be the platform or the parent accessory, either
// way stuff gets passed down.
function Cmd4Accessory(log, parentConfig, accessoryConfig, parent )
{
   this.log = log;
   this.parentConfig = parentConfig;
   this.config = accessoryConfig;

   // If a parent is defined, then use it, otherwise
   // I am the parent.
   if (parent)
   {
      this.parent = parent
   } else
   {
      // I am the parent of all children if there is none.
      // As a parent, create an array for all the services and child accessories.
      this.childFoundAccessories = [];
      this.services = [];
      this.parent = this;

      // Linked services (Ones with parents, do not have information services)
      // If a parent is defined, then I must be a linked accessory and linked
      // accessories no not have information services.
      // Also let the parent add this accessories service to their list.
      this.log.debug("Creating information service for this parent");
      this.informationService = new Service.AccessoryInformation();
   }

   this.listOfVariables = {};
   this.listOfConstants = {};

   // Bring the platform config variables forward the accessory first
   // If they do not exist, they would still be undefined.
   this.stateChangeResponseTime = parentConfig.stateChangeResponseTime;
   this.interval = parentConfig.interval;
   this.timeout = parentConfig.timeout;
   this.state_cmd = parentConfig.state_cmd;
   this.state_cmd_prefix = parentConfig.state_cmd_prefix;
   this.state_cmd_suffix = parentConfig.state_cmd_prefix;

   // TKV8 causes a lot of issues if defined and trying to parse.
   // Omit them by default.
   this.allowTLV8 = false;

   // Instead of local variables for every characteristic, create an array to
   // hold values for  all characteristics based on the size of all possible characteristics.
   this.storedValuesPerCharacteristic = new Array(CMD4_ACC_TYPE_ENUM.EOL).fill(null);


   // If polling is defined it is set to true/false, otherwise false.
   this.polling = this.config.polling === true;


   this.parseConfig ( this.config );

   // Get the properties for this accessories device type
   let properties = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex];

   // Create the service for this accessory
   this.service = new properties.service(this.displayName, this.name);

   // I am the parent so add any linked services, already created
   if (! parent)
   {
      let numberOfLinkedAccessories = this.services.length;

      // i.e. there are child accesswories
      if (numberOfLinkedAccessories > 0 )
      {
         for (let i=0; i < numberOfLinkedAccessories; i++ )
         {

           this.log.debug("Adding Linked service of %s to %s", this.childFoundAccessories[i].displayName, this.displayName);

           // The only services in the list is those of any children.
           this.service.addLinkedService(this.services[i]);
         }
      }

      // Move the information service to the top of the list
      this.services.unshift(this.informationService);

      // Define the manufacturer if none was
      if ( ! this.manufacturer )
         this.informationService
            .setCharacteristic(Characteristic.Manufacturer, "Cmd4");

      // Define the model if none was
      if ( ! this.model )
         this.informationService
            .setCharacteristic(Characteristic.Model, "Cmd4Model");

      // Define the serial number if none was
      // For multiple accessories of the same type, it is important that the accessory
      // has a unique serial number, so append the config.name.
      if ( ! this.serialNumber )
         this.informationService
            .setCharacteristic(Characteristic.SerialNumber,  "Cmd4 " + this.config.type + this.displayName);

      // Move the service to the top of the list, this makes the information service second.
      this.services.unshift(this.service);

   }


   // Check if required characteristics should be added, or TLV8 removed.
   for ( let accTypeEnumIndex = 0 ; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex++ )
   {

      // Get the properties for this accessories device type
      let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex];


      // See if the characteristic index is in the required characteristics of the device
      let requiredIndex = devProperties.requiredCharacteristics.indexOfEnum(i => i.type === accTypeEnumIndex);

      //this.log.debug("*** RequiredIndex = %d for accTypeEnumIndex:%s", requiredIndex, accTypeEnumIndex);

      let format = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].props.format;
      //this.log.debug("format = %s", format);



      // No matter what, remove it
      if (format == Characteristic.Formats.TLV8 && this.allowTLV8 == false )
      {
         if (this.getStoredValueForIndex(accTypeEnumIndex) != null )
         {
            this.setStoredValueForIndex( accTypeEnumIndex, null);

            this.log.warn("****** Removing TLV8 required characteristic :%s", CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type);
         }
         continue;
      }

      // if it is required, add not stored, add it
      if (requiredIndex != -1 && this.getStoredValueForIndex(accTypeEnumIndex) == null)
      {
         this.log.warn("**** Adding required characteristic %s for %s", CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type, this.displayName);
         this.log.warn("Not defining a required characteristic can be problematic");

         // Get the default value to store
         let defaultValue = properties.requiredCharacteristics[requiredIndex].defaultValue;
          this.log.debug("*****Adding default value %s for %s", defaultValue, this.displayName )

         this.setStoredValueForIndex(accTypeEnumIndex, defaultValue);
      }
   }


   // The default respnse time is in seconds
   if ( ! this.stateChangeResponseTime )
      this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex].devicesStateChangeDefaultTime;


   this.checkPollingConfigForUnsetCharacteristics(this.polling);

   // For every service, we allow all possible characteristics
   // based on the config.json file and not just those characterisitics
   // an accessory actually has.
   this.setupAllCharacteristicsForThisServices(this.service);

   // Setup the fakegato service if defined in the config.json file
   this.setupAccessoryFakeGatoService(this.fakegatoConfig);
}

// Accessory definitions
Cmd4Accessory.prototype = {

   identify: function(callback) {
       callback();
   },

   getServices: function ()
   {
      //if (this.services)
      //{
      //   console.log("Returning:%s number of services for:%s", this.services.length, //this.displayName);
      //} else {
      //   console.log("Returning this.services:%s for:%s", this.services, this.displayName);
      //}
      return this.services;
   },

   setStoredValueForIndex:function (accTypeEnumIndex, value)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log ("CMD4 Warning: setStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.displayName);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      this.storedValuesPerCharacteristic[accTypeEnumIndex] = value;
   },

   getStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL)
      {
         this.log ("CMD4 Warning: getStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.displayName);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      return this.storedValuesPerCharacteristic[accTypeEnumIndex];
   },
   testStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL)
         return -1;

      return this.storedValuesPerCharacteristic[accTypeEnumIndex];
   },
   checkPollingConfigForUnsetCharacteristics(pollingConfig)
   {
      this.log.debug("Checking for polling of unset characteristics.");

      if ( pollingConfig == undefined )
      {
         this.log.debug("Polling config is null.  Assumed old style");
         return;
      }

      if ( typeof pollingConfig != 'object' )
      {
         this.log.debug("Polling config is old style. Nothing to check for unset polling characteristics");
         return;
      }

      for ( let jsonIndex = 0;
                jsonIndex < pollingConfig.length;
                jsonIndex ++ )
      {
          // *NEW* Characteristic polling is a json type
          let jsonPollingConfig = pollingConfig[jsonIndex];

         for ( let key in jsonPollingConfig )
         {
            let ucKey = ucFirst(key);
            let value = jsonPollingConfig[key];

            switch (ucKey)
            {
               case "Timeout":
                  // Timers are in milliseconds. A low value can result in failure to get/set values
                  this.timeout = parseInt(value, 10);
                  if (this.timeout < 500)
                  {
                     this.log.warn("Timeout for:%s is in milliseconds. A value of '%d' seems pretty low.",
                        this.config.displayName, this.timeout);
                  }
                  break;
               case "Interval":
                  // Intervals are in seconds
                  this.interval = parseInt(value, 10) * 1000;
                  break;
               default:
               {
                  let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucKey);

                  if (accTypeEnumIndex < 0 )
                  {
                    this.log("OOPS::%s not found. There something wrong with your config.json file?", key);
                    process.exit(1);
                  } else {
                     if ( this.getStoredValueForIndex(accTypeEnumIndex) == undefined )
                     {
                        this.log.warn("Polling for:%s requested, but characteristic ", key);
                        this.log.warn("is not in your config.json file for:%s", this.displayName);
                     }

                     this.setStoredValueForIndex(accTypeEnumIndex, value);
                  }
               }
            }
         }
      }

      this.log.debug("Checking complete.");
   },
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
   //    (1) In the special TARGET set characteristics, getValue
   //        is called to update HomeKit.
   //          Example: Set My_Door <TargetDoorState> 1
   //            calls: Get My_Door <CurrentDoorState>
   //
   //       - Where he value in <> is an one of CMD4_ACC_TYPE_ENUM
   // ***********************************************
   setValue:function (five, context, accTypeEnumIndex, value , callback )
   {
      let self = context;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let characteristic = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic;

      let cmd;


      if (self.outputConstants == true)
      {
         let constant = transposeValueToValidConstant( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value );
         cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + constant  + "'" + self.state_cmd_suffix;
      } else {
         cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + value  + "'" + self.state_cmd_suffix;
      }
      self.log.debug( "setValue %s function for:%s cmd:%s", characteristicString, self.displayName, cmd );


      // Execute command to Set a characteristic value for an accessory
      exec(cmd, {timeout: self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("setGeneric %s function failed for %s Error:%s", characteristicString, self.displayName, error.message);
            self.log(stdout);
            self.log(stderr);
            callback(error);

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
            switch (accTypeEnumIndex)
            {
               case CMD4_ACC_TYPE_ENUM.Active:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.Active).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.LockTargetState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.LockCurrentState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.SecuritySystemCurrentState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetAirPurifierState:
               {
                  if ( self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = MEDIUM_STATE_CHANGE_RESPONSE_TIME;

                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentAirPurifierState).getValue();
                        callback();
                     }, self.stateChangeResponseTime);
                     break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetAirQuality:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.AirQuality).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetDoorState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentDoorState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetFanState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentFanState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentHeaterCoolerState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentHeatingCoolingState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentHorizontalTiltAngle).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetMediaState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentMediaState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetPosition:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentPosition).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentRelativeHumidity).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetSlatState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentSlatState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetTemperature:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentTemperature).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetTiltAngle:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentTiltAngle).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentVerticalTiltAngle).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               case CMD4_ACC_TYPE_ENUM.TargetVisibilityState:
               {
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.CurrentVisibilityState).getValue();
                     callback();
                  }, self.stateChangeResponseTime);
                  break;
               }
               default:
               {
                   // No Special action Required
               }
            }

            if (responded == false)
            {
               // So why do we do this?
               // I have found that IOS HomeKit will have a spinning
               // Indicator that will never stop, unless you do a get
               // before the final callback. This could all be because
               // use exec, compared to other plugins, but this works.
               // More bonus points for documentation!

               // The exceptions are handled above; Respond with the
               // corresponding getValue.
               if (self.config.stateChangeResponseTime === undefined)
                  self.stateChangeResponseTime = FAST_STATE_CHANGE_RESPONSE_TIME;

               if (characteristic == undefined)
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn("Characteristic is null for name:%s type:%s",
                          self.displayName, self.config.type);
               } else if (self.service.getCharacteristic(characteristic) == undefined)
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn("Service is null for name:%s type:%s.",
                          self.displayName, self.config.type);
               }
               // A little bit of a speed boost, depending on the config
               if (self.config.stateChangeResponseTime === undefined)
               {
                  callback();
               } else {
                  setTimeout(() => {
                     callback();
                  }, self.stateChangeResponseTime);
               }
            }
         }
      });
   },

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
   getValue:function (accTypeEnumIndex, callback)
   {
      let self = this;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;

      let cmd = this.state_cmd_prefix + this.state_cmd + " Get '" + this.displayName + "' '" + characteristicString  + "'" + this.state_cmd_suffix;


      self.log.debug("getValue accTypeEnumIndex:(%s)-'%s' function for:%s cmd:%s", accTypeEnumIndex, characteristicString, self.displayName, cmd);

      // Execute command to Get a characteristics value for an accessory
      let child = exec(cmd, {timeout:self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("getGeneric %s function for:%s cmd:%s failed.", characteristicString, self.displayName, cmd);
            self.log(error);
            self.log(stdout);
            self.log(stderr);
            callback( error, 0 );
         } else {
            let words = stdout.match(/\S+/gi);

            // I'd rather trap here
            if (words == undefined)
            {
               self.log("Nothing retured from stdout for %s %s", characteristicString, self.displayName);
               self.log(stderr);
               self.log(error);
               self.log(stdout);
               callback( -1, 0 );
            } else if (words.length <= 0)
            {
               self.log("getValue %s function for:%s returned no value", characteristicString, self.name);

               callback( -1, 0 );
            } else {
               if (words.length >=2)
               {
                  self.log.warn("Warning, Retrieving %s, expected only one word value for:%s, using first of:%s", characteristicString, self.displayName, stdout);
               }

               self.log.debug("getValue %s function for:%s returned:%s", characteristicString, self.displayName, words[0]);


               // Even if outputConsts is not set, just in case, transpose it anyway.
               words[0] = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, words[0] )


               let value = '';

               // Return the appropriate type
               // - IOS HomeKit does require a value over On/Off,
               //   Hence the code below.

               if (isNumeric(words[0]))
               {
                  // Fix support for decimal temperatures
                  // parseFloat will change "15" "15.0" to "15"
                  // but keeps numbers like "15.5"
                  // So whatever is sent from the device
                  // is used.
                  // HomeKit and HomeBridge seems okay with this.
                  // Eve sees the decimal numbers.
                  value =  parseFloat(words[0], 10);

                  // Store history using fakegato if set up
                  self.updateAccessoryAttribute(accTypeEnumIndex, value);

                  callback(null,value);
               } else if ( typeof words[0] == "boolean")
               {
                  // Store history using fakegato if set up
                  self.updateAccessoryAttribute(accTypeEnumIndex, words[0]);

                  callback(null,words[0]);
               } else {
                  let lowerCaseWord = words[0].toLowerCase();

                  // Fix strings of true or on
                  if (lowerCaseWord  == "true" || lowerCaseWord == "on")
                  {
                     value = 1;

                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(accTypeEnumIndex, value);

                     callback(null,value);

                  // Fix strings of false or off
                  } else if (lowerCaseWord == "false" || lowerCaseWord == "off")
                  {
                     value = 0;

                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(accTypeEnumIndex, value);

                     callback(null,value);
                  } else {
                     value = words[0];

                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(accTypeEnumIndex, value);

                     callback(null,value);
                  }
               }
            }
         }
      });
   },

   // ***********************************************
   //
   // setupAccessoryFakeGatoService:
   //.    Method to set up all services for those characteristics in the
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
   setupAllCharacteristicsForThisServices: function (service)
   {
       this.log.debug("Setting up services");

       let perms = '';
       let len = this.storedValuesPerCharacteristic.length;

       // Check every possible characteristic
       for (let accTypeEnumIndex = 0;
            accTypeEnumIndex < len;
            accTypeEnumIndex++ )
       {

          // If there is a stored value for this characteristic (defined by the config file )
          // Then we need to add the characteristic too
          if ( this.storedValuesPerCharacteristic[accTypeEnumIndex] != undefined)
          {
             this.log.debug("Found characteristic:%s value:%s for:%s",
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type,
                  this.getStoredValueForIndex(accTypeEnumIndex),
                  this.displayName);

             // Get the permissions of characteristic (Read/Write ...)
             // Both are 100% the same.
             // perms = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].props.perms
             perms = service.getCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                .characteristic).props.perms;

             // Find out if the characteristic is Optional and needs to be added
             if ( ! service.testCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic))
             {
                // We need to check if the characteristic is write only
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                   // Since the characteristic is writeable, then add it.
                   this.log.debug("Adding optional characteristic:%s for:%s", CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type, this.displayName);
                   service.addCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].
                         characteristic );
                }
             }

             // Read and or write, we need to set the value once.
             // If the characteristic was optional and read only, this will add
             // it with the correct value.  You cannot add and set a read characteristic.
             service.setCharacteristic(
                CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic,
                      this.getStoredValueForIndex(accTypeEnumIndex) );


             // Add getValue funtion to service
             if ( service.getCharacteristic(
                    CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                    .characteristic).listeners('get').length == 0 )
             {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                   service.getCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                      .characteristic)
                         .on('get', this.getValue.bind(this, accTypeEnumIndex));
                }
             }

             // Add setValue function to service
             if ( service.getCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                  .characteristic).listeners('set').length == 0 )
             {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                   // GetService has parameters:
                   // five, context, accTypeEnumIndex, value , callback
                   // Why this works, beats me.
                   // five ends up equal to '2';
                   let boundSetValue = this.setValue.bind(1, 2, this, accTypeEnumIndex);

                   service.getCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                      .characteristic).on('set', (value,callback) => {
                          boundSetValue(value, callback);
                   });
                }
             }
          }
       }
   },
   updateAccessoryAttribute: function (accTypeEnumIndex, value)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log ("Internal error.: updateAccessoryAttribute - accTypeEnumIndex:%s for:%s not known", accTypeEnumIndex, this.displayName);
         return;
      }

      this.setStoredValueForIndex(accTypeEnumIndex, value);

      if ( this.loggingService )
      {
         let firstParm, secondParm, thirdParm;
         let ucFirstParm, ucSecondParm, ucThirdParm;
         let firstParmValue, secondParmValue, thirdParmValue = 0;
         let firstParmIndex, secondParmIndex, thirdParmIndex;

         switch (this.eve)
         {
            case FAKEGATO_TYPE_ENERGY:
            {
               firstParm   = this.fakegatoConfig['power']    || '0';
               ucFirstParm = ucFirst(firstParm)              || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);

               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                      firstParmValue : this.getStoredValueForIndex(firstParmIndex);

               this.log.debug("Logging power:%s", firstParmValue);
               // Eve Energy (Outlet service)
               this.loggingService.addEntry({time: moment().unix(),
                  power: firstParmValue});
               break;
            }
            case FAKEGATO_TYPE_ROOM:
            {
               firstParm       = this.fakegatoConfig['temp']       || '0';
               secondParm      = this.fakegatoConfig['humidity']   || '0';
               thirdParm       = this.fakegatoConfig['ppm']        || '0';
               ucFirstParm     = ucFirst(firstParm)       || '0';
               ucSecondParm    = ucFirst(secondParm)      || '0';
               ucThirdParm     = ucFirst(thirdParm)       || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucThirdParm);


               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                  firstParmValue : this.getStoredValueForIndex(firstParmIndex);
               secondParmValue = (this.testStoredValueForIndex(secondParmIndex) < 0) ?
                  secondParmValue : this.getStoredValueForIndex(secondParmIndex);
               thirdParmValue = (this.testStoredValueForIndex(thirdParmIndex) < 0) ?
                  thirdParmValue : this.getStoredValueForIndex(thirdParmIndex);


               this.log.debug("Logging temp:%s humidity:%s ppm:%s", firstParmValue, secondParmValue, thirdParmValue);
               // Eve Room (TempSensor, HumiditySensor and AirQuality Services)
               this.loggingService.addEntry({time: moment().unix(),
                  temp:firstParmValue,
                  humidity:secondParmValue,
                  ppm:thirdParmValue});
               break;
            }
            case FAKEGATO_TYPE_WEATHER:
            {
               firstParm       = this.fakegatoConfig['temp']       || '0';
               secondParm      = this.fakegatoConfig['pressure']   || '0';
               thirdParm       = this.fakegatoConfig['humidity']   || '0';
               ucFirstParm     = ucFirst(firstParm)       || '0';
               ucSecondParm    = ucFirst(secondParm)      || '0';
               ucThirdParm     = ucFirst(thirdParm)       || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucThirdParm);

               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                  firstParmValue : this.getStoredValueForIndex(firstParmIndex);
               secondParmValue = (this.testStoredValueForIndex(secondParmIndex) < 0) ?
                  secondParmValue : this.getStoredValueForIndex(secondParmIndex);
               thirdParmValue = (this.testStoredValueForIndex(thirdParmIndex) < 0) ?
                  thirdParmValue : this.getStoredValueForIndex(thirdParmIndex);

               this.log.debug("Logging temp:%s pressure:%s humidity:%s", firstParmValue, secondParmValue, thirdParmValue);

               // Eve Weather (TempSensor Service)
               this.loggingService.addEntry({time: moment().unix(),
                  temp:firstParmValue,
                  pressure:secondParmValue,
                  humidity:thirdParmValue});
               break;
            }
            case FAKEGATO_TYPE_DOOR:
            {
               firstParm   = this.fakegatoConfig['status']   || '0';
               ucFirstParm = ucFirst(firstParm)              || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);

               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                      firstParmValue : this.getStoredValueForIndex(firstParmIndex);

               this.log.debug("Logging status:%s", firstParmValue);

               this.loggingService.addEntry({time: moment().unix(),
                  status: firstParmValue});
               break;
            }
            case FAKEGATO_TYPE_MOTION:
            {
               firstParm   = this.fakegatoConfig['status']   || '0';
               ucFirstParm = ucFirst(firstParm)              || '0';
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);

               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                      firstParmValue : this.getStoredValueForIndex(firstParmIndex);

               this.log.debug("Logging status:%s", firstParmValue);

               this.loggingService.addEntry({time: moment().unix(),
                  status: firstParmValue});
               break;
            }
            case FAKEGATO_TYPE_THERMO:
            {
               firstParm       = this.fakegatoConfig['currentTemp']     || '0';
               secondParm      = this.fakegatoConfig['setTemp']         || '0';
               thirdParm       = this.fakegatoConfig['valvePosition']   || '0';
               ucFirstParm     = ucFirst(firstParm)       || '0';
               ucSecondParm    = ucFirst(secondParm)      || '0';
               ucThirdParm     = ucFirst(thirdParm)       || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucThirdParm);


               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                  firstParmValue : this.getStoredValueForIndex(firstParmIndex);
               secondParmValue = (this.testStoredValueForIndex(secondParmIndex) < 0) ?
                  secondParmValue : this.getStoredValueForIndex(secondParmIndex);
               thirdParmValue = (this.testStoredValueForIndex(thirdParmIndex) < 0) ?
                  thirdParmValue : this.getStoredValueForIndex(thirdParmIndex);

               this.log.debug("Logging currentTemp:%s setTemp:%s valvePosition:%s", firstParmValue, secondParmValue, thirdParmValue);

               // Eve Thermo (Thermostat service)
               this.loggingService.addEntry({time: moment().unix(),
                  currentTemp:firstParmValue,
                  setTemp:secondParmValue,
                  valvePosition:thirdParmValue});
               break;
            }
            case FAKEGATO_TYPE_AQUA:
            {
               firstParm       = this.fakegatoConfig['status']        || '0';
               secondParm      = this.fakegatoConfig['waterAmount']   || '0';
               ucFirstParm     = ucFirst(firstParm)       || '0';
               ucSecondParm    = ucFirst(secondParm)      || '0';

               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucSecondParm);

               firstParmValue = (this.testStoredValueForIndex(firstParmIndex) < 0) ?
                  firstParmValue : this.getStoredValueForIndex(firstParmIndex);
               secondParmValue = (this.testStoredValueForIndex(secondParmIndex) < 0) ?
                  secondParmValue : this.getStoredValueForIndex(secondParmIndex);

               this.log.debug("Logging status:%s waterAmount:%s", firstParmValue, secondParmValue);

               // Eve Aqua (Valve service set to Irrigation Type)
               this.LoggingService.addEntry({ time: moment().unix(),
                  status:firstParmValue,
                  waterAmount:secondParmValue});
               break;
            }
         }
      }
   },

   setupAccessoryFakeGatoService: function ( fakegatoConfig )
   {
      if ( fakegatoConfig == undefined )
         return;

      for ( let key in fakegatoConfig )
      {
          let ucKey = ucFirst ( key );
          let value = fakegatoConfig[ key ];
          switch (ucKey)
          {
             case 'Eve':
                this.eve = fakegatoConfig[key];
                switch(value)
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
                       this.log("Invalid fakegato eve type:%s", value);
                       this.log("It must be one of (%s, %s, %s, %s, %s, %s, %s)",
                          FAKEGATO_TYPE_ENERGY,
                          FAKEGATO_TYPE_ROOM,
                          FAKEGATO_TYPE_WEATHER,
                          FAKEGATO_TYPE_DOOR,
                          FAKEGATO_TYPE_MOTION,
                          FAKEGATO_TYPE_THERMO,
                          FAKEGATO_TYPE_AQUA);
                        this.log("Check the Cmd4 README and ");
                        this.log("https://github.com/simont77/fakegato-history");
                        process.exit(1);
                }
                break;
             case 'Storage':
                this.storage = fakegatoConfig[key];
                break;
             case 'StoragePath':
                this.storagePath = fakegatoConfig[key];
                break;
             case 'KeyPath':
                this.keyPath = fakegatoConfig[key];
                break;
             case 'Folder':
                this.Folder = fakegatoConfig[key];
                break;
             case 'Status':
             case 'Temp':
             case 'SetTemp':
             case 'Humidity':
             case 'Ppm':
             case 'Power':
             case 'Pressure':
             case 'CurrentTemp':
             case 'ValvePosition':
             {
                 let ucValue = ucFirst(value);
                 let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucValue);

                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if (this.testStoredValueForIndex(accTypeEnumIndex) < 0 && ucValue != '0')
                    this.log.warn("Not a valid characteristic:%s for fakegato to log of:%s", value, key);
                 break;
              }
              default:
                 this.log("Invalid fakegato key:%s in json.config for:%s", key, this.displayName);
          }
      }

      // Optional
      if ( this.storage != undefined )
      {
         if (this.storage == 'fs')
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { storage: 'fs',
                  path: this.storagePath }
            );
            this.services.push(this.loggingService);

         } else if (this.storage == 'googleDrive')
         {
            this.loggingService = new FakeGatoHistoryService
            (
               this.eve,
               this,
               { storage: 'googleDrive',
                 folder: this.folder,
                 keyPath: this.keyPath }
            );
            this.services.push(this.loggingService);
         } else
         {
            this.log("WARNING: Cmd4 Unknown accessory config.storage:%s Expected:fs or googlrDrive for:%s", this.storage, this.displayName);
         }
      }

      if (this.loggingService)
      {
         if (this.polling == undefined ||
             this.polling == false)
         {
            this.log.warn("config.storage:%s for:%s set but polling is not enabled.",
              this.storage, this.displayName);
            this.log.warn("      History will not be updated continiously.");

         }
      }
   },
   validateStateCmd: function ( state_cmd )
   {
      // Split the state_cmd into words.
      let cmdArray = state_cmd.match(/\S+/gi);

      // Assume no words
      let arrayLength = 0;

      // Get the number of words
      if (cmdArray )
         arrayLength = cmdArray.length;

      // Check that the state_cmd is valid.
      // The first word must be in the persons path
      // The second word, if it exists must be a file
      // and have the correct path.
      switch (arrayLength)
      {
         case 0:
            this.log.error("No state_cmd given");
            return false;
         default:
         {
            let checkFile = cmdArray[arrayLength -1];

            try {
               fs.accessSync(checkFile, fs.F_OK);
               // File exists - OK

            } catch (e) {
               // It isn't accessible
               this.log.warn("The script %s does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkFile);
            }
         }
         // Purposely fall through to check the command as well
         case 1:
         {
            let checkCmd = cmdArray[0];

            // if the lone command is a path to a command
            // Then check if it exists, oTherwise check if it is
            // in Their path.
            if ( checkCmd.charAt( 0 ) == '/' || (
                  checkCmd.length > 1 &&
                  checkCmd.charAt( 0 ) == '.' &&
                  checkCmd.charAt( 1 ) == '/' )
               )
            {
               try {
                  fs.accessSync(checkCmd, fs.F_OK);
                  // File exists - OK
               } catch (e) {
                  this.log.warn("The file %s does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkCmd);
               }
            } else
            {
               if ( ! commandExistsSync( checkCmd ) )
                  this.log.warn("The command %s does not exist or is not in your path, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkCmd);
            }
            break;
         }
      }
      return true;
   },
   parseKeyForCharacteristics: function ( key, value )
   {
      // fix the their scripts, fix it here.
      let ucKey = ucFirst(key);

      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.type === ucKey);

      if (accTypeEnumIndex < 0 )
      {
         this.log("OOPS:%s not found. There something wrong with your config.json file?", key);
         if (ucKey == "AdministorOnlyAccess")
         {
            this.log("administorOnlyAccess was incorrectly named");
            this.log("It is corrected in the new config.json file as administratorOnlyAccess");
            this.log("Please make the approperiate changes or use the new config.json file");
            this.log("provided.");
         }
         if (ucKey == "TargettRelativeHumidity")
         {
            this.log("targettRelativeHumidity was incorrectly named");
            this.log("It is corrected in the new config.json file as targetRelativeHumidity");
            this.log("Please make the approperiate changes or use the new config.json file");
            this.log("provided.");
         }
         if (ucKey == "CurrentSlatType")
         {
            this.log("currentSlatType was incorrectly named");
            this.log("It is corrected in the new config.json file as currentSlatState");
            this.log("Please make the approperiate changes or use the new config.json file");
            this.log("provided.");
         }
         process.exit(1);
      }

      //this.log.debug("**** Size is %s for %s", Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues).length, accTypeEnumIndex);

      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues).length > 0)
      {

         // Even if outputConsts is not set, just in case, transpose it anyway.
         let newValue = transposeConstantToValidValue( CMD4_ACC_TYPE_ENUM.properties, accTypeEnumIndex, value) ;

         if (value != newValue)
         {
            //this.log.debug("**** Translated %s to %s", value, newValue);
            value = newValue;
         }
      }

      this.setStoredValueForIndex(accTypeEnumIndex, value);
   },
   processRequires: function( requires )
   {
      if ( Array.isArray ( requires ) )
      {
         for (let i = 0; i < requires.length; i++)
         {
            this.processRequires(requires[i]);
         }
         return;
      }
      if ( isJSON( requires ) )
      {
          // I assume only 1, but you know about assuming ...
         for (let key in requires)
         {
            let required = requires[ key ] ;

            if ( typeof required != 'string'  )
            {
               this.log.error("Requires definition must be a string", required);
               process.exit(-1);
            }

            this.log.debug("Requiring %s", required);

            require(required);
        }
        return;
     }
     this.log.error("Requires must be an array of/or list of key/value pairs:%s",
               requires);
      process.exit(-1);
   },
   processConstants: function( constant )
   {
      if ( Array.isArray ( constant ) )
      {
         for (let i = 0; i < constant.length; i++)
         {
            this.processConstants(constant[i]);
         }
         return;
      }
      if ( isJSON( constant ) )
      {
         // I assume only 1, but you know about assuming ...
         for (let key in constant)
         {
            let keyToAdd = key ;
            let valueToAdd = constant[ key ] ;
            if ( ! keyToAdd.startsWith( '${' ) )
            {
               this.log.error("Constant definition for:%s must start with '${' for clarity.", keyToAdd);
               process.exit(-1);
            }
            if ( ! keyToAdd.endsWith( '}' ) )
            {
               this.log.error("Constant definition for:%s must end with '}' for clarity.", keyToAdd);
               process.exit(-1);
            }
            // remove any leading and trailing single quotes
            // so that using it for replacement will be easier.
            valueToAdd.replace(/^'/, "")
            valueToAdd.replace(/'$/, "")

            this.listOfConstants[ keyToAdd ] = valueToAdd;
        }
        return;
     }

     this.log.error("Constants must be an array of/or list of key/value pairs:%s",
               constant);
     process.exit(-1);

   },
   processVariables: function( variable )
   {
      if ( Array.isArray ( variable ) )
      {
         for (let i = 0; i < variable.length; i++)
         {
            this.processConstants(variable[i]);
         }
         return;
      }
      if ( isJSON( variable ) )
      {
         // I assume only 1, but you know about assuming ...
         for (let key in variable)
         {
            let keyToAdd = key ;
            let valueToAdd = variable[ key ] ;
            if ( ! keyToAdd.startsWith( '${' ) )
            {
               this.log.error("Variable definition for:%s must start with '${' for clarity.", keyToAdd);
               process.exit(-1);
            }
            if ( ! keyToAdd.endsWith( '}' ) )
            {
               this.log.error("Variable definition for:%s must end with '}' for clarity.", keyToAdd);
               process.exit(-1);
            }
            // remove any leading and trailing single quotes
            // so that using it for replacement will be easier.
            valueToAdd.replace(/^'/, "")
            valueToAdd.replace(/'$/, "")

            // The resultant variable may have constants to be replaced.
            let value = this.replaceConstantsInString(valueToAdd);

            this.listOfVariables[ keyToAdd ] = value;
         }
         return;
      }

      this.log.error("Variables must be an array of/or list of key/value pairs:%s",
               variable);
      process.exit(-1);

   },
   /**
    * @param config       - The accessories config information
    * @param parentConfig - the accessories parent Config
    *                       for state_cmd ..., if not defined.
    */
   processLinkedTypesConfig: function( config, parentConfig )
   {
      if ( Array.isArray ( config ) )
      {
         for (let i = 0; i < config.length; i++)
            this.processLinkedTypesConfig(config[i], parentConfig );

         return;
      }
      if ( isJSON( config ) )
      {
         this.log(FgMagenta + "Processing Linked accessory %s of %s", config.displayName, this.displayName);

         let accessory = new Cmd4Accessory( this.log, parentConfig, config, this );
         // This.parent is probable me, but what happens to linked-linked accessories ???
         this.parent.childFoundAccessories.push( accessory );


         this.log.debug("Pushing service for accessory:%s to:%s", accessory.displayName, this.displayName);
         this.services.push(accessory.service);

         return;
      }

      this.log.error("linkedTypes must be an array of json objects:%s", config);
      process.exit(-1);
   },
   processURL: function( url )
   {
      if ( typeof url != 'string')
      {
         this.log.error("url must be a string:%s", url);
         process.exit(-1);
      }

      if ( this.url !== undefined )
      {
         this.log.error("url is already defined as:%s for %s",
             this.url, url);
         process.exit(-1);
      }
      this.url = this.replaceConstantsInString(url);
   },
   replaceConstantsInString: function( orig )
   {
      let finalAns = orig;

      for (let key in this.listOfConstants)
      {
          let replacementConstant = this.listOfConstants[key];
          finalAns = finalAns.replace(key, replacementConstant);
      }
      return finalAns;
   },
   parseConfig: function( config )
   {
      for (let key in config)
      {
         let value = config[key];

         // I made the stupid mistake of not having all characteristics in the config.json
         // file not upper case to match that in State.js. So instead of having everyone
         // fix their scripts, fix it here.
         let ucKey = ucFirst(key);

         switch (ucKey)
         {
            case 'Type':
               this.type = value;
               this.ucType = ucFirst(value);
               this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum(i => i.deviceName === this.ucType);
               if (this.typeIndex < 0)
               {
                  this.log ("CMD4 Error: Unknown device type:%s for %s", this.type, this.displayName);
                  process.exit(1);
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
            case 'Name':
               this.name = value;

               // Name is also a characteristic, which must be added.
               this.parseKeyForCharacteristics( key, value );

               break;
            case 'Model':
               this.model = value;
               this.log.debug("Setting model to:%s", value);

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic(Characteristic.Model, value );

               break;
            case 'Manufacturer':
               this.manufacturer = value;

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic(Characteristic.Manufacturer, value );

               break;
            case 'SerialNumber':
               this.serialNumber = value;

               if ( this.informationService )
                  this.informationService
                    .setCharacteristic(Characteristic.SerialNumber, value );

               break;
            case 'OutputConstants':
               // Define if we should ouput constant strings
               // instead of values
               if ( config.outputConstants === true )

                  this.outputConstants = value;
                else
                  this.outputConstants = false;

               break;
            case 'Timeout':
               // Timers are in milliseconds. A low value can result in failure to get/set values
               this.timeout = parseInt(value, 10);
               if (this.timeout < 500)
               {
                  this.log.warn("Timeout for:%s is in milliseconds. A value of '%d' seems pretty low.",
                     config.displayName, this.timeout);
               }

               break;
            case 'Polling':
               // Do not parse it yet as characteristics must be set first.
               this.polling = value;
               break;
            case 'Interval':
               // Intervals are in seconds
               this.interval = parseInt(value, 10) * 1000;

               break;
            case 'StateChangeResponseTime':
               // respnse time is in seconds
               this.stateChangeResponseTime = value * 1000;

               break;
            case 'State_cmd_prefix':
               // Not 100% sure why this would be needed, but
               // added anyway since we have a suffix
               this.state_cmd_prefix = value;

               break;
            case 'State_cmd_suffix':
               // This gets added after any Get/Set <value>
               this.state_cmd_suffix = value;

               break;
            case 'State_cmd':
            {
               // Solve some issues people have encounterred who
               // have had problems with shell completion which is
               // only available from shell expansion.

               if (! this.validateStateCmd( value ) )
                  process.exit(-1);

               // What this plugin is all about
               this.state_cmd = value;

               break;
            }
            case 'Storage':
            case 'StoragePath':
            case 'Folder':
            case 'KeyPath':
               this.log("Definitions of fakegato has changed to be more specific per characteristic");
               this.log("and in line with fakegato.")
               this.log("Please see the README.md for further details.");
               this.log("Sorry for the inconvenience");

               break;
            case 'Fakegato':
               // Do not parse it yet as characteristics must be set first.
               this.fakegatoConfig = value;

               break;
            case 'Requires':
               this.processRequires( value );

               break;
            case 'Constants':
               this.processConstants( value );

               break;
            case 'Variables':
               this.processVariables( value );

               break;
            case 'LinkedTypes':


               //this.log.debug("Before processLinked this.services.size=%d", this.services.length);
               this.processLinkedTypesConfig( value, config );
               break;
            case 'Url':
               this.processURL( value );

               break;
            case 'AllowTLV8':
               this.allowTLV8 = true;
               break;
            default:
            {
               this.parseKeyForCharacteristics( key, value );
            }

         }
      }

      // displayName must be defined. it is used as a funtion parameter when
      // creating the service.
      // name must be defined. it is used as a funtion parameter when
      // creating the service. Even if it is not defined as a characteristic, or
      // passed in as a function parameter to create the service. Homebridge
      // uses it within Accessories, so it must be defined.
      if (! this.displayName )
         this.displayName = getAccessoryName( config );

      if ( ! this.UUID )
         if (this.name )
            this.UUID = UUIDGen.generate(this.name);
         else
            this.UUID = UUIDGen.generate(this.displayName);

      // We need to set up the service for linked services (If any)
      // So create the Service nowS
      if (! this.name )
         this.name = this.displayName;

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
   }
}


function checkForUpdates()  {
   const latestVersion = require("latest-version");

   const myPkg = require('./package.json');

   (async() => {
      let lv = await latestVersion(myPkg.name);

      if (lv != myPkg.version)
      {
            console.log(`\x1b[32m[UPDATE AVAILABLE] \x1b[0mVersion ${lv} of ${myPkg.name} is available. Any release notes can be found here: \x1b[4m${myPkg.homepage}\x1b[0m`);
      }
   })();
}

