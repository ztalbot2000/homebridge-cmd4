'use strict';
const exec = require("child_process").exec;
const moment = require('moment');

const FAKEGATO_TYPE_ENERGY  = 'energy',
      FAKEGATO_TYPE_ROOM    = 'room',
      FAKEGATO_TYPE_WEATHER = 'weather', 
      FAKEGATO_TYPE_DOOR    = 'door',
      FAKEGATO_TYPE_MOTION  = 'motion',
      FAKEGATO_TYPE_THERMO  = 'thermo',
      FAKEGATO_TYPE_AQUA    = 'aqua';   

var Accessory, Service, Characteristic, UUIDGen, FakeGatoHistoryService;

module.exports = function (homebridge) {
   // Accessory must be created from PlatformAccessory Constructor
   Accessory = homebridge.platformAccessory;

   Service = homebridge.hap.Service;
   Characteristic = homebridge.hap.Characteristic;
   
   UUIDGen = homebridge.hap.uuid;

   // If you see these lines in other plugins with true, at the end,
   // you would provide a configurationRequestHandler to add/Remove
   // individual accessories. I believe this is old school as HomeKit
   // does not let you do this anymore.  
   homebridge.registerAccessory('homebridge-cmd4', 'Cmd4', Cmd4Accessory);
   homebridge.registerPlatform('homebridge-cmd4', 'Cmd4', Cmd4Platform);

   FakeGatoHistoryService = require('fakegato-history')(homebridge);

};

// Platform definitions
function Cmd4Platform(log, config, api) {
   this.log = log;
   this.config = config || {'platform': 'cmd4'};

   this.reachable = true;
   this.foundAccessories = [];
   this.ListOfPollingAccessories = {};
   
   
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
         this.log("WARNING: Cmd4: Unknown platform.config.storage '%s'. Expected 'fs' or 'googleDrive' ", config.storage);
      }
   } 
   
   // Define platform config storagePath for fakegato-history
   if ( config.storagePath != undefined )
   {
      this.storagePath = config.storagePath;
   }
   
   // Define platform config folder for fakegato-history 
   if ( config.folder != undefined )
   {
      this.folder = config.folder;
   }
   
   // Define platform config keyPath for fakegato-history
   if ( config.keyPath != undefined )
   {
      this.keyPath = config.keyPath;
   }
}

Cmd4Platform.prototype =
{
   accessories: function(callback) 
   {
      var that = this;


      this.log("Cmd4:Fetching config.json devices.");
      for( var i=0; i<this.config.accessories.length; i++ )
      {

         // This will create an accessory based on the Cmd4Accessory
         // definition bellow. This is not obvious for a newbie.
         var accessory = new Cmd4Accessory( that.log, that.config, this.config.accessories[i] );
         this.log("Cmd4:Found " + accessory.name);

         this.foundAccessories.push( accessory );

         if (accessory.polling && accessory.state_cmd)
         {
            this.statePolling(accessory);
         }
      }
      callback(this.foundAccessories);
   }
}

Cmd4Platform.prototype.statePolling = function (accessory) 
{
   var thisSwitch = accessory.config;
   var self = accessory;

   // Clear polling
   clearTimeout(this.ListOfPollingAccessories[accessory.name]);

   switch(accessory.config.type)
   {
      case  "Fan":
      case  "Fanv1":
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case "GarageDoorOpener":
      {
         self.service.getCharacteristic
         (
            Characteristic.CurrentDoorState
         ).getValue();
      
         break;
      }
      case  "Lightbulb":
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case "LockManagement":
      {
          self.service.getCharacteristic
          (
             Characteristic.LockCurrentState
          ).getValue();

          break;
      }
      case "LockMechanism":
      {
          self.service.getCharacteristic
          (
             Characteristic.LockCurrentState
          ).getValue();

          break;
      }
      case  "Outlet":
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      } 
      case  "Switch":
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case "Thermostat":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentTemperature
          ).getValue();

          break;
      }
      case  "AirQualitySensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.AirQuality
          ).getValue();

          break;
      }
      case  "SecuritySystem":
      {   
          self.service.getCharacteristic
          (
             Characteristic.SecuritySystemCurrentState
          ).getValue();

          break;
      }
      case  "CarbonMonoxideDetector":
      {
          self.service.getCharacteristic
          (
             Characteristic.CarbonMonoxideDetected
          ).getValue();

          break;
      }
      case  "ContactSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.ContactSensorState
          ).getValue();

          break;
      }
      case  "Door":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentDoorState
          ).getValue();

          break;
      }
      case  "HumiditySensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentRelativeHumidity
          ).getValue();

          break;
      }
      case  "LeakSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.LeakDetected
          ).getValue();

          break;
      }
      case  "LightSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentAmbientLightLevel
          ).getValue();

          break;
      }
      case  "MotionSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.MotionDetected
          ).getValue();

          break;
      }
      case  "OccupancySensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.OccupancyDetected
          ).getValue();

          break;
      }
      case  "SmokeSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.SmokeDetected
          ).getValue();

          break;
      }
      case  "StatelessProgrammableSwitch":
      {
          self.service.getCharacteristic
          (
             Characteristic.ProgrammableSwitchEvent
          ).getValue();

          break;
      }
      case  "TemperatureSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentTemperature
          ).getValue();

          break;
      }
      case  "Window":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentPosition
          ).getValue();

          break;
      }
      case  "WindowCovering":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentPosition
          ).getValue();

          break;
      }
      case  "BatteryService":
      {
          self.service.getCharacteristic
          (
             Characteristic.StatusLowBattery
          ).getValue();

          break;
      }
      case  "CarbonDioxideSensor":
      {
          self.service.getCharacteristic
          (
             Characteristic.CarbonDioxideDetected
          ).getValue();

          break;
      }
      case  "RTPCameraStreamManagement":
      {
          self.service.getCharacteristic
          (
             Characteristic.StatusActive
          ).getValue();

          break;
      }
      case  "Microphone":
      {
          self.service.getCharacteristic
          (
             Characteristic.Mute
          ).getValue();

          break;
      }
      case  "Speaker":
      {
          self.service.getCharacteristic
          (
             Characteristic.Mute
          ).getValue();

          break;
      }
      case  "Doorbell":
      {
          self.service.getCharacteristic
          (
             Characteristic.ProgrammableSwitchEvent
          ).getValue();

          break;
      }
      case  "Fanv2":
      {
          self.service.getCharacteristic
          (
             Characteristic.Active
          ).getValue();

          break;
      }
      case  "Slat":
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentSlatState
          ).getValue();

          break;
      }
      case  "FilterMaintenance":
      {
          self.service.getCharacteristic
          (
             Characteristic.FilterChangeIndication
          ).getValue();

          break;
      }
      case  "AirPurifier":
      {
          self.service.getCharacteristic
          (
             Characteristic.Active
          ).getValue();

          break;
      }
      case  "ServiceLabel":
      {
          self.service.getCharacteristic
          (
             Characteristic.ServiceLabelNamespace
          ).getValue();

          break;
      }
      default:
   }

   this.ListOfPollingAccessories[accessory.name] = setTimeout(this.statePolling.bind(this, accessory), thisSwitch.interval * 1000);
}



function Cmd4Accessory(log, platformConfig, accessoryConfig, status ) {

    this.config = accessoryConfig;
    this.log = log;

    // If polling is defined it is set to true, otherwise false.
    this.polling = this.config.polling === true;

    // The default interval is 10 seconds
    this.interval = parseInt(this.interval, 10) || 10;

    // The default interval is 1 minute. Timers are in milliseconds
    this.timeout = parseInt(this.timeout, 10) || 60000;
    this.name = this.config.name;
    this.displayName = this.name;  //fakegato-history uses displayName
    this.model = this.config.model;

    // this.reachable = true; // What is reachable ???
    // Configured accessory is reachable

    // What this plugin is all about
    this.state_cmd = this.config.state_cmd;
  
    if ( this.config.stateChangeResponseTime != undefined)
       this.stateChangeResponseTime = this.config.stateChangeResponseTime ;

    // The information service  
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Cmd4")
      .setCharacteristic(Characteristic.Model, this.model )
      .setCharacteristic(Characteristic.SerialNumber, "Cmd4 " + this.config.type);
   
   this.UUID = UUIDGen.generate(this.name);
      
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
   // This method was taken from real-fake-garage-doors by
   // plasticrake.
   // P.S  - This is probably more documentation of code anywhere
   //        in Homebridge :-)    If you find it useful, send
   //        me a like ;-)

   //this.storage     = undefined;               // Default - disabled
   //this.storagePath = undefined;               // Default path for storage of 'fs'
   
   //this.folder.     = undefined;               // Default for storage of 'GoogleDrive'
   //this.keypath     = undefined;               // Default for storage of 'GoogleDrive'
   
   // Accessory config comes first
   if ( this.config.storage != undefined )
   {
      if ( this.config.storage == "fs" )
         this.storage = this.config.storage;
      else if ( this.config.storage == "googleDrive" )
         this.storage = this.config.storage;
      else
         this.log("WARNING: Cmd4: Unknown accessory.config.storage '%s'. Expected 'fs' or 'googleDrive' for '%s'", 
            this.config.storage, this.name);

   } else if ( platformConfig.storage != undefined )
   {
      this.storage = platformConfig.storage;
   }
   
   // Define the storagePath for fakegato-history
   // - Accessory config takes precedence over Platform config.
   if ( this.config.storagePath != undefined )
      this.storagePath = this.config.storagePath;
   else if (platformConfig.storagePath != undefined )
      this.storagePath = platformConfig.storagePath;
   else
      this.storagePath = "";

   // Define the folder for fakegato-history
   // - Accessory config takes precedence over Platform config.
   if ( this.config.folder != undefined )
      this.folder = this.config.folder;
   else if (platformConfig.folder != undefined )
      this.folder = platformConfig.folder;
   else
      this.folder = "";
      

   // Define the keyPath for fakegato-history
   // - Accessory config takes precedence over Platform config.
   if ( this.config.keyPath != undefined )
      this.keyPath = this.config.keyPath;
   else if (platformConfig.keyPath != undefined )
      this.keyPath = platformConfig.keyPath;
   else
      this.keyPath = "";
      
   

   switch( this.config.type )
   {
      case "Fan":
      case "Fanv1":
      {
         // So why do we do this? In the need for documentation,
         // this is done so that if an App adds an accessory,
         // the local variable is used since their would be none
         // in the config.json file. Bonus points for me!

         // Required
         this.on = 0;
         if (this.config.on)
            this.on = this.config.on;

         // Optional
         if (this.config.rotationDirection)
            this.rotationDirection = this.config.rotationDirection;

         // Optional
         if (this.config.rotationSpeed) 
            this.rotationSpeed = this.config.rotationSpeed;

         this.service = new Service.Fan(this.name, this.name);
         this.setupFanv1Service(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);         
         break;
      }
      case "GarageDoorOpener":
      {
         // Required
         this.currentDoorState = 0;
         if (this.config.currentDoorState)
            this.currentDoorState = this.config.currentDoorState;

         // Required
         this.targetDoorState = 0;
         if (this.config.targetDoorState)
            this.targetDoorState = this.config.targetDoorState;

         // Required
         this.obstructionDetected = 0;
         if (this.config.obstructionDetected)
            this.obstructionDetected = this.config.obstructionDetected;

         // Optional
         if (this.config.lockCurrentState)
            this.lockCurrentState = this.config.lockCurrentState;
         
         // Optional
         if (this.config.lockTargetState)
            this.lockTargetState = this.config.lockTargetState;

         this.service = new Service.GarageDoorOpener(this.name, this.name);
         this.setupGarageDoorOpenerService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Lightbulb":
      {
         // Required
         this.on = 0;
         if (this.config.on)
            this.on = this.config.on;

         // Optional
         if (this.config.brightness)
            this.brightness = this.config.brightness;

         // Optional
         if (this.config.hue)
            this.hue = this.config.hue;

         // Optional
         if (this.config.saturation)
            this.saturation = this.config.saturation;

         // Optional
         if (this.config.colorTemperature)
            this.colorTemperature = this.config.colorTemperature;
    
         this.service = new Service.Lightbulb(this.name, this.name);
         this.setupLightBulbService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "LockManagement":
      {  
         // Required
         this.lockControlPoint = 0;
         if (this.config.lockControlPoint)
            this.lockControlPoint = this.config.lockControlPoint;

         // Required
         this.logs = "OptionalLogs";
         if (this.config.logs)
            this.logs = this.config.logs;

         // Optional
         if (this.config.audioFeedback)
            this.audioFeedback = this.config.audioFeedback;

         // Optional
         if (this.config.lockManagementAutoSecurityTimeout)
            this.lockManagementAutoSecurityTimeout = this.config.lockManagementAutoSecurityTimeout;

         // Optional
         if (this.config.administorOnlyAccess)
            this.administorOnlyAccess = this.config.administorOnlyAccess;

         // Optional
         if (this.config.lockLastKnownAction)
            this.lockLastKnownAction = this.config.lockLastKnownAction;

         // Optional
         if (this.config.currentDoorState)
            this.currentDoorState = this.config.currentDoorState;

         // Optional
         if (this.config.motionDetected)
            this.motionDetected = this.config.motionDetected;

         this.service = new Service.LockManagement(this.name, this.name);
         this.setupLockManagementService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }

      case "LockMechanism":
      {  
         // Required
         this.lockCurrentState = 0;
         if (this.config.lockCurrentState)
            this.lockCurrentState = this.config.lockCurrentState;

         // Required
         this.lockTarget = 0;
         if (this.config.lockTargetState)
            this.lockTargetState = this.config.lockTargetState;

         this.service = new Service.LockMechanism(this.name, this.name);
         this.setupLockMechanismService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Outlet": 
      {
         // Required
         this.on = 0;
         if (this.config.on)
            this.on = this.config.on;

         // Required
         this.outletInUse = 0;
         if (this.config.outletInUse)
            this.outletInUse = this.config.outletInUse;

         this.service = new Service.Outlet(this.name, this.name);
         this.setupOutletService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Switch":
      {
         // Required
         this.on = 0;
         if (this.config.on)
            this.on = this.config.on;

         this.service = new Service.Switch(this.name, this.name);
         this.setupSwitchService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Thermostat":
      {
         // Required
         this.currentHeatingCoolingState = 0;
         if (this.config.currentHeatingCoolingState)
            this.currentHeatingCoolingState = this.config.currentHeatingCoolingState;

         // Required
         this.targetHeatingCoolingState = 0;
         if (this.config.targetHeatingCoolingState)
            this.targetHeatingCoolingState = this.config.targetHeatingCoolingState;

         // Required
         this.currentTemperature = 50.0;
         if (this.config.currentTemperature)
            this.currentTemperature = this.config.currentTemperature;

         // Required 
         this.targetTemperature = 50.0;
         if (this.config.targetTemperature)
            this.targetTemperature = this.config.targetTemperature;

         // Required
         this.temperatureDisplayUnits = 0;
         if (this.config.temperatureDisplayUnits)
            this.temperatureDisplayUnits = this.config.temperatureDisplayUnits;

         // Optional
         if (this.config.coolingThresholdTemperature)
            this.coolingThresholdTemperature = this.config.coolingThresholdTemperature;

         // Optional
         if (this.config.currentRelativeHumidity)
            this.currentRelativeHumidity = this.config.currentRelativeHumidity;

         // Optional
         if (this.config.heatingThresholdTemperature)
            this.heatingThresholdTemperature = this.config.heatingThresholdTemperature;

         // Optional
         if (this.config.targetRelativeHumidity)
            this.targettRelativeHumidity = this.config.targettRelativeHumidity;

         this.service = new Service.Thermostat(this.name, this.name);
         this.setupThermostatService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services)
         // i.e. loggingService.addEntry({time: moment().unix(), currentTemp:this.currentTemp, setTemp:this.setTemp, valvePosition:this.valvePosition});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_THERMO);
         break;
      }
      case "AirQualitySensor":
      {
         // Required
         this.airQuality = 1;
         if (this.config.airQuality)
            this.airQuality = this.config.airQuality;

         // Optional
         if (this.config.OzoneDensity)
            this.OzoneDensity = this.config.OzoneDensity;

         // Optional
         if (this.config.nitrogenDioxideDensity)
            this.nitrogenDioxideDensity = this.config.nitrogenDioxideDensity;

         // Optional
         if (this.config.sulphurDioxideDensity)
            this.sulphurDioxideDensity = this.config.sulphurDioxideDensity;

         // Optional
         if (this.config.PM2_5Density)
            this.PM2_5Density = this.config.PM2_5Density;

         // Optional
         if (this.config.PM10Density)
            this.PM10Density = this.config.PM10Density;

         // Optional
         if (this.config.VOCDensity)
            this.VOCDensity = this.config.VOCDensity;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.AirQualitySensor(this.name, this.name);
         this.setupAirQualitySensorService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services)
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ROOM);
         break;
      }
      case "SecuritySystem":
      {
         // Required
         this.securitySystemCurrentState = 3;
         if (this.config.securitySystemCurrentState)
            this.securitySystemCurrentState = this.config.securitySystemCurrentState;

         // Required
         this.securitySystemTargetState = 3; 
         if (this.config.securitySystemTargetState)
            this.securitySystemTargetState = this.config.securitySystemTargetState;

         // Optional
         if (this.config.securitySystemAlarmType)
            this.securitySystemAlarmType = this.config.securitySystemAlarmType;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         this.service = new Service.SecuritySystem(this.name, this.name);
         this.setupSecuritySystemService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "CarbonMonoxideSensor":
      {
         // Required
         this.carbonMonoxideDetected = 0;
         if (this.config.carbonMonoxideDetected)
            this.carbonMonoxideDetected = this.config.carbonMonoxideDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         // Optional
         if (this.config.carbonMonoxideLevel)
            this.carbonMonoxideLevel = this.config.carbonMonoxideLevel;

         // Optional
         if (this.config.carbonMonoxidePeakLevel)
            this.carbonMonoxidePeakLevel = this.config.carbonMonoxidePeakLevel;

         this.service = new Service.CarbonMonoxideSensor(this.name, this.name);
         this.setupCarbonMonoxideSensorService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services)
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});  
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ROOM);
         break;
      }
      case "ContactSensor":
      {
          // Required
         this.contactSensorState = 0;
         if (this.config.contactSensorState)
            this.contactSensorState = this.config.contactSensorState;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.ContactSensor(this.name, this.name);
         this.setupContactSensorService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Door":
      {
         // Required
         this.currentPosition = 0;
         if (this.config.currentPosition)
            this.currentPosition = this.config.currentPosition;

         // Required
         this.targetPosition = 0;
         if (this.config.targetPosition)
            this.targetPosition = this.config.targetPosition;

         // Required    
         this.positionState = 0;
         if (this.config.positionState)
            this.positionState = this.config.positionState;

         // Optional
         if (this.config.holdPosition)
            this.holdPosition = this.config.holdPosition;

         // Optional
         if (this.config.obstructionDetected)
            this.obstructionDetected = this.config.obstructionDetected;

         this.service = new Service.Door(this.name, this.name);
         this.setupDoorService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "HumiditySensor":
      { 
         // Required
         this.currentRelativeHumidity = 1;
         if (this.config.currentRelativeHumidity)
            this.currentRelativeHumidity = this.config.currentRelativeHumidity;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.HumiditySensor(this.name, this.name);
         this.setupHumiditySensorService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services) 
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ROOM);
         break;
      }
      case "LeakSensor":
      {
         // Required
         this.leakDetected = 0;
         if (this.config.leakDetected)
            this.leakDetected = this.config.leakDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.LeakSensor(this.name, this.name);
         this.setupLeakSensorService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "LightSensor":
      { 
         // Required
         this.currentAmbientLightLevel = 1;
         if (this.config.currentAmbientLightLevel)
            this.currentAmbientLightLevel = this.config.currentAmbientLightLevel;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.LightSensor(this.name, this.name);
         this.setupLightSensorService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "MotionSensor":
      {
         // Required
         this.motionDetected = 0;
         if (this.config.motionDetected)
            this.motionDetected = this.config.motionDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.MotionSensor(this.name, this.name);
         this.setupMotionSensorService(this.service);
         
         // Eve Motion (MotionSensor service) 
         // loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_MOTION);
         break;
      }
      case "OccupancySensor":
      {
         // Required
         this.occupaancyDetected = 0;
         if (this.config.occupaancyDetected)
            this.occupaancyDetected = this.config.occupaancyDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.OccupancySensor(this.name, this.name);
         this.setupOccupancySensorService(this.service);
         
         // Eve Motion (MotionSensor service) 
         // loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_MOTION);
         break;
      }
      case "SmokeSensor":
      {
         // Required
         this.smokeDetected = 0;
         if (this.config.smokeDetected)
            this.smokeDetected = this.config.smokeDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.SmokeSensor(this.name, this.name);
         this.setupSmokeSensorService(this.service);
         
         // Eve Door (ContactSensor service) 
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "StatelessProgrammableSwitch": 
      {
         // Required
         this.ProgrammableSwitchEvent = 0;
         if (this.config.ProgrammableSwitchEvent)
            this.ProgrammableSwitchEvent = this.config.ProgrammableSwitchEvent;

         // Optional
         if (this.config.serviceLabelIndex)
            this.serviceLabelIndex = this.config.serviceLabelIndex;

         // Optional
         if (this.config.serviceLabelNamespace)
            this.serviceLabelNamespace = this.config.serviceLabelNamespace;

         this.service = new Service.StatelessProgrammableSwitch(this.name, this.name);
         this.setupStatelessProgrammableSwitchService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "TemperatureSensor": 
      {
         // Required
         this.currentTemperature = 50.0;
         if (this.config.currentTemperature)
            this.currentTemperature = this.config.currentTemperature;
         
         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.TemperatureSensor(this.name, this.name);
         this.setupTemperatureSensorService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services) 
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ROOM);
         break;
      }
      case "Window":
      {
         // Required
         this.currentPosition = 0;
         if (this.config.currentPosition)
            this.currentPosition = this.config.currentPosition;

         // Required
         this.targetPosition = 0;
         if (this.config.targetPosition)
            this.targetPosition = this.config.targetPosition;

         // Required   
         this.positionState = 0;
         if (this.config.positionState)
            this.positionState = this.config.positionState;

         // Optional
         if (this.config.holdPosition)
            this.holdPosition = this.config.holdPosition;

         // Optional
         if (this.config.obstructionDetected)
            this.obstructionDetected = this.config.obstructionDetected;

         this.service = new Service.Window(this.name, this.name);
         this.setupWindowService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "WindowCovering":
      {
         // Required
         this.currentPosition = 0;
         if (this.config.currentPosition)
            this.currentPosition = this.config.currentPosition;

         // Required
         this.targetPosition = 0;
         if (this.config.targetPosition)
            this.targetPosition = this.config.targetPosition;

         // Required
         this.positionState = 0;
         if (this.config.positionState)
            this.positionState = this.config.positionState;

         // Optional
         if (this.config.holdPosition)
            this.holdPosition = this.config.holdPosition;

         // Optional
         if (this.config.currentHorizontalTiltAngle)
            this.currentHorizontalTiltAngle = this.config.currentHorizontalTiltAngle;

         // Optional
         if (this.config.targetHorizontalTiltAngle)
            this.targetHorizontalTiltAngle = this.config.targetHorizontalTiltAngle;

         // Optional
         if (this.config.currentVerticalTiltAngle)
            this.currentVerticalTiltAngle = this.config.currentVerticalTiltAngle;

         // Optional
         if (this.config.targetVerticalTiltAngle)
            this.targetVerticalTiltAngle = this.config.targetVerticalTiltAngle;

         // Optional
         if (this.config.obstructionDetected)
            this.obstructionDetected = this.config.obstructionDetected;

         this.service = new Service.WindowCovering(this.name, this.name);
         this.setupWindowCoveringService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "BatteryService":
      {
         // Required
         this.batteryLevel = 50;
         if (this.config.batteryLevel)
            this.batteryLevel = this.config.batteryLevel;

         // Required
         this.chargingState = 0;
         if (this.config.chargingState)
            this.chargingState = this.config.chargingState;

         // Required
         this.statusLowBattery = 0;
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         this.service = new Service.BatteryService(this.name, this.name);
         this.setupBatteryService(this.service);
         
         // Eve Energy (Outlet service)
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ENERGY);
         break;
      }
      case "CarbonDioxideSensor": 
      {
         // Required
         this.carbonDioxideDetected = 0;
         if (this.config.carbonDioxideDetected)
            this.carbonDioxideDetected = this.config.carbonDioxideDetected;

         // Optional
         if (this.config.statusActive)
            this.statusActive = this.config.statusActive;

         // Optional
         if (this.config.statusFault)
            this.statusFault = this.config.statusFault;

         // Optional
         if (this.config.statusTampered)
            this.statusTampered = this.config.statusTampered;

         // Optional
         if (this.config.statusLowBattery)
            this.statusLowBattery = this.config.statusLowBattery;

         // Optional
         if (this.config.carbonDioxideLevel)
            this.carbonDioxideLevel = this.config.carbonDioxideLevel;

         // Optional
         if (this.config.carbonDioxidePeakLevel)
            this.carbonDioxidePeakLevel = this.config.carbonDioxidePeakLevel;

         this.service = new Service.CarbonDioxideSensor(this.name, this.name);
         this.setupCarbonDioxideSensorService(this.service);
         
         // Eve Room (TempSensor, HumiditySensor and AirQuality Services)    
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_ROOM);
         break;
      }
      case "CameraRTPStreamManagement":
      {
         this.service = new Service.CameraRTPStreamManagement(this.name, this.name);
         this.setupCameraRTPStreamManagementService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Microphone":
      {
         // Required
         this.mute = 0;
         if (this.config.mute)
            this.mute = this.config.mute;

         // Required
         this.volume = 0;
         if (this.config.volume)
            this.volume = this.config.volume;

         this.service = new Service.Microphone(this.name, this.name);
         this.setupMicrophoneService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Speaker":
      {
         // Required 
         this.mute = 0;
         if (this.config.mute)
            this.mute = this.config.mute;
         
         // Required 
         this.volume = 0;
         if (this.config.volume)
            this.volume = this.config.volume;

         this.service = new Service.Speaker(this.name, this.name);
         this.setupSpeakerService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "DoorBell":
      {
         // Required 
         this.programmableSwitchEvent = 0;
         if (this.config.programmableSwitchEvent)
            this.programmableSwitchEvent = this.config.programmableSwitchEvent;

         // Optional
         if (this.config.volume)
            this.volume = this.config.volume;

         // Optional
         if (this.config.brightness)
            this.brightness = this.config.brightness;

         this.service = new Service.Doorbell(this.name, this.name);
         this.setupDoorbellService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Fanv2":
      {
         // Required
         this.active = 0;
         if (this.config.active)
            this.active = this.config.active;

         // Optional
         if (this.config.currentFanState)
            this.currentFanState = this.config.currentFanState;

         // Optional
         if (this.config.targetFanState)
            this.targetFanState = this.config.targetFanState;

         // Optional
         if (this.config.rotationDirection)
            this.rotationDirection = this.config.rotationDirection;

         // Optional
         if (this.config.rotationSpeed)
            this.rotationSpeed = this.config.rotationSpeed;

         // Optional
         if (this.config.swingMode)
            this.swingMode = this.config.swingMode;

         this.service = new Service.Fanv2(this.name, this.name);
         this.setupFanv2Service(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "Slat":
      {
         // Required
         this.currentSlatType = 0;
         if (this.config.currentSlatType)
            this.currentSlatType = this.config.currentSlatType;

         // Required
         this.slatType = 0;
         if (this.config.slatType)
            this.slatType = this.config.slatType;

         // Optional
         if (this.config.swingMode)
            this.swingMode = this.config.swingMode;

         // Optional
         if (this.config.currentTiltAngle)
            this.currentTiltAngle = this.config.currentTiltAngle;

         // Optional
         if (this.config.targetTiltAngle)
            this.targetTiltAngle = this.config.targetTiltAngle;

         this.service = new Service.Slat(this.name, this.name);
         this.setupSlatService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "FilterMaintenance":
      {
         // Required 
         this.filterChangeIndication = 0;
         if (this.config.filterChangeIndication)
            this.filterChangeIndication = this.config.filterChangeIndication;

         // Optional
         if (this.config.filterLifeLevel)
            this.filterLifeLevel = this.config.filterLifeLevel;

         // Optional
         if (this.config.resetFilterIndication)
            this.resetFilterIndication = this.config.resetFilterIndication;

         this.service = new Service.FilterMaintenance(this.name, this.name);
         this.setupFilterMaintenanceService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      } 
      case "AirPurifier":
      {
         // Required 
         this.active = 0;
         if (this.config.active)
            this.active = this.config.active;

         // Required
         this.currentAirPurifierState = 0;
         if (this.config.currentAirPurifierState)
            this.currentAirPurifierState = this.config.currentAirPurifierState;

          // Required
         this.targetAirPurifierState = 0;
         if (this.config.targetAirPurifierState)
            this.targetAirPurifierState = this.config.targetAirPurifierState;

         // Optional
         if (this.config.rotationSpeed)
            this.rotationSpeed = this.config.rotationSpeed;
         
         // Optional
         if (this.config.swingMode)
            this.swingMode = this.config.swingMode;

         // Optional
         if (this.config.lockPhysicalControl)
            this.lockPhysicalControl = this.config.lockPhysicalControl;

         this.service = new Service.AirPurifier(this.name, this.name);
         this.setupAirPurifierService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case "ServiceLabel":
      {
         this.service = new Service.ServiceLabel(this.name, this.name);
         this.setupServiceLabelService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      default:
      {
         // The default is a lightBulb service
         this.log ("CMD4: Unknown type: %s for %s. Defaulting it to a Switch. Did you possibly spell it incorrectly?", this.type, this.name);

         this.service = new Service.Switch(this.name, this.name);
         this.setupSwitchService(this.service);
      }
   }
}


// Accessory definitions
Cmd4Accessory.prototype = {

    identify: function(callback) {
       callback();
   },

   getServices: function () 
   {   
      // For the accessory, only acknowledge available services
      if (this.loggingService) 
      {
         return [this.informationService, this.service, this.loggingService];
      } 
      
      return [this.informationService, this.service]; 
   },

   // ***********************************************
   //
   // setValue: Method to call an external script
   //           to set a value.
   //
   //   The script will be passed:
   //      Set <Device Name> <Characteristic> <Value>
   //
   //
   //      Where:
   //         - Device name is the name in your
   //           config.json file.
   //         - CharacteristicString represents
   //           the characteristic to get.
   //         - Characteristic is the characteristicString
   //           in HAP form.
   //         - Value is new characteristic value.
   //
   //  Notes:
   //    (1) In the special TARGET set characteristics, getValue
   //        is called to update HomeKit.
   //          Example: Set My_Door TargetDoorState 1
   //            calls: Get My_Door CurrentDoorState
   //
   //    (2) Both characteristicString and characteristic
   //        represent the exact same thing. It is possible
   //        that only one is required as a function argument,
   //        but since characteristic is a complex composition
   //        of types, functions, ... then comparing it may
   //        not be a good thing.
   //
   //
   //
   // ***********************************************
   setValue:function (value, characteristicString, characteristic, callback)
   {
      var self = this;
      var cmd = this.state_cmd + " Set '" + this.name + "' '" + characteristicString  + "' '" + value  + "'";
      self.log.debug("DEBUG: Cmd4 setValue %s function for: %s cmd: %s", characteristicString, self.name, cmd);


      // Execute command to Set a characteristic value for an accessory
      exec(cmd, {timeout: self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("Cmd4 Set %s function failed for %s Error:%s", characteristicString, self.name, error.message);
            self.log(stdout);
            self.log(stderr);
            callback(error);

         } else {

            // Since we are in an exec, make sure we reply
            // with the corresponding getValue.
            var responded  = false;

            // Setting *Target* states require a get afterwards
            switch (self.config.type)
            {
               case "Fan":
               case "Fanv1":
               case "Fanv2":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == "TargetFanState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentFanState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case "GarageDoorOpener":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 10;

                  if (characteristicString == "TargetDoorState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentDoorState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  if (characteristicString == "LockTargetState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.LockCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  break;
               }
               case "LockMechanism":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == "LockTargetState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.LockCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  break;
               }
               case "Door":
               case "Window":
               case "WindowCovering":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == "TargetPosition")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentPosition).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case "Thermostat":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 10;

                  if (characteristicString == "TargetHeatingCoolingState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentHeatingCoolingState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == "TargetTemperature")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentTemperature).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == "TargetRelativeHumidity")
                  {
                     setTimeout(() => {
                     responded  = true;
                        self.service.getCharacteristic(Characteristic.CurrentRelativeHumidity).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case "SecuritySystem":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == "SecuritySystemTargetState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.SecuritySystemCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);

                  }
                  break;
               }
               case "FilterMaintenance":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;
                  
                  responded  = true;
                  setTimeout(() => {
                     self.service.getCharacteristic(Characteristic.FilterChangeIndication).getValue();
                     callback();
                  }, self.stateChangeResponseTime * 1000);

                  break;
               }
               case "AirPurifier":
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == "TargetAirPurifierState")
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentAirPurifierState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == "Active")
                  {
                     responded  = true;
                     setTimeout(() => {
                        // Why this is needed and must be set the same, I do
                        // not know, but without it, IOS Homekit spins its
                        // wheels.
                        // Documenting bugs are good.  Bonus points for me!
                        self.service.getCharacteristic(Characteristic.CurrentAirPurifierState).getValue();

                        // Not seemed to have been needed, but should have been.
                        self.service.getCharacteristic(Characteristic.Active).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
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
                  self.stateChangeResponseTime = 1;

               if (characteristic == undefined)
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log("Cmd4: Warning, characteristic is null for name:%s type: %s.",
                          self.name, self.config.type);
               } else if (self.service.getCharacteristic(characteristic) == undefined)
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log("Cmd4: Warning, service is null for name:%s type:%s.",
                          self.name, self.config.type);
               } 
               // A little bit of a speed boost, depending on the config
               if (self.config.stateChangeResponseTime === undefined)
               {
                  callback();
               } else {
                  setTimeout(() => {
                     callback();
                  }, self.stateChangeResponseTime * 1000);
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
   //      Get <Device Name> <characteristicString>
   //
   //      Where:
   //         - Device name is the name in your
   //           config.json file.
   //         - CharacteristicString represents
   //           the characteristic to get.
   //
   // ***********************************************
   getValue:function (characteristicString, callback)
   {
      var self = this;
      var cmd = this.state_cmd + " Get '" + this.name + "' '" + characteristicString  + "'";


      self.log.debug("DEBUG Cmd4: getValue %s function for: %s cmd: %s", characteristicString, self.name, cmd);

      // Execute command to Get a characteristics value for an accessory
      var child = exec(cmd, {timeout:self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("Cmd4 getGeneric %s function for: %s cmd: %s failed.", characteristicString, self.name, cmd);
            self.log(error);
            self.log(stdout);
            self.log(stderr);
            callback( error, 0 );
         } else {
            var words = stdout.match(/\S+/gi);

            // I'd rather trap here
            if (words == undefined)
            {
               self.log("Cmd4: Error, Nothing retured from stdout for %s %s", characteristicString, self.name);
               self.log(stderr);
               self.log(error);
               callback( -1, 0 );
            } else if (words.length <= 0)
            {
               self.log("Cmd4: Error, getValue %s function for: %s returned no value", characteristicString, self.name);
               callback( -1, 0 );
            } else {
               if (words.length >=2)
               {
                  self.log("Cmd4 - Warning, Retrieving %s, expected only one word value for: %s, using first of: '%s'", characteristicString,self.name, stdout);
               }
                
               self.log.debug("DEBUG Cmd4: getValue %s function for: %s returned: '%s'", characteristicString, self.name, words[0]);
                

               var value;

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
                  // self.log( "Cmd4 - getValue Retrieved %s %s for: %s. translated to %f", characteristicString, words[0], self.name, value);
                  
                  // Store history using fakegato if set up
                  self.updateAccessoryAttribute(characteristicString, value);

                  callback(null,value);
               } else {
                  var lowerCaseWord = words[0].toLowerCase();

                  if (lowerCaseWord  == "true" || lowerCaseWord == "on")
                  {
                     // self.log( "Cmd4 - getValue Retrieved %s %s for: %s. translated to 1", characteristicString, words[0], self.name);
                     value = 1;
                     
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(characteristicString, value);
                     
                     callback(null,value);
                  } else if (lowerCaseWord == "false" || lowerCaseWord == "off")
                  {
                     // self.log( "Cmd4 - getValue Retrieved %s %s for: %s. translated to 0", characteristicString, words[0], self.name);
                     value = 0;
                     
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(characteristicString, value);
                     
                     callback(null,value);
                  } else {
                     // self.log( "Cmd4 - getValue Retrieved %s %s for: %s.", characteristicString, words[0], self.name);
                     value = words[0];
                     
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(characteristicString, value);
                     
                     callback(null,value);
                  }
               }
            }
         }
      });
   },

   // See Cmd4Accessory for why the services are configured this
   // way as compared to other plugins using bind.
   setupFanv1Service: function (service)
   {
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue("On", callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,"On", Characteristic.On, callback);
      });

      // Optional
      if (this.rotationDirection)
      {
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('get', (callback) => {
            this.getValue("RotationDirection", callback);
         });
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('set', (value,callback) => {
            this.setValue(value,"RotationDirection", Characteristic.RotationDirection, callback);
         });
      }

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue("RotationSpeed", callback);
         });
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,"RotationSpeed", Characteristic.RotationSpeed.On, callback);
         });
      }
   },

   setupGarageDoorOpenerService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentDoorState)
      .on('get', (callback) => {
         this.getValue("CurrentDoorState", callback);
      });

      service.getCharacteristic(Characteristic.TargetDoorState)
      .on('set', (value,callback) => {
         this.setValue(value,"TargetDoorState", Characteristic.TargetDoorState, callback);
      });

      service.getCharacteristic(Characteristic.ObstructionDetected)
      .on('get', (callback) => {
         this.getValue("ObstructionDetected", callback);
      });

      if ( this.lockCurrentState )
      {
         // Optional
         service.getCharacteristic(Characteristic.LockCurrentState)
         .on('get', (callback) => {
            this.getValue("LockCurrentState", callback);
         });
         service.getCharacteristic(Characteristic.LockTargetState)
         .on('set', (value,callback) => {
            this.setValue(value,"LockTargetState", Characteristic.LockTargetState, callback);
         });
      }
   },
   
   setupLightBulbService: function (service)
   {  
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue("On", callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,"On", Characteristic.On, callback);
      });

      // Optional
      if ( this.brightness)
      {
         service.getCharacteristic(Characteristic.Brightness)
         .on('get', (callback) => {
            this.getValue("Brightness", callback);
         });
         service.getCharacteristic(Characteristic.Brightness)
         .on('set', (value,callback) => {
            this.setValue(value,"Brightness", Characteristic.Brightness, callback);
         });
      }

      // Optional
      if ( this.saturation )
      {
         service.getCharacteristic(Characteristic.Saturation)
         .on('get', (callback) => {
            this.getValue("Saturation", callback);
         });
         service.getCharacteristic(Characteristic.Saturation)
         .on('set', (value,callback) => {
            this.setValue(value,"Saturation", Characteristic.Saturation, callback);
         });
      }

      // Optional
      if ( this.hue )
      {
         service.getCharacteristic(Characteristic.Hue)
         .on('get', (callback) => {
            this.getValue("Hue", callback);
         });
         service.getCharacteristic(Characteristic.Hue)
         .on('set', (value,callback) => {
            this.setValue(value,"Hue", Characteristic.Hue, callback);
         });
      }

      // Optional
      if ( this.colorTemperature )
      {
         service.getCharacteristic(Characteristic.ColorTemperature)
         .on('get', (callback) => {
            this.getValue("ColorTemperature", callback);
         });
         service.getCharacteristic(Characteristic.ColorTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,"ColorTemperature", Characteristic.ColorTemperature, callback);
         });
      }
   },

   setupLockManagementService: function (service)
   {
      service.getCharacteristic(Characteristic.LockControlPoint)
      .on('get', (callback) => {
         this.getValue("LockControlPoint", callback);
      });
      service.getCharacteristic(Characteristic.Version)
      .on('get', (callback) => {
         this.getValue("Version", callback);
      });

      // Optional
      if ( this.logs )
      {
         service.getCharacteristic(Characteristic.Logs)
         .on('get', (callback) => {
            this.getValue("Logs", callback);
         });
      }

      // Optional
      if ( this.audioFeedback )
      {
         service.getCharacteristic(Characteristic.AudioFeedback)
         .on('get', (callback) => {
            this.getValue("AudioFeedback", callback);
         });
      }

      // Optional
      if ( this.lockManagementAutoSecurityTimeout )
      {
         service.getCharacteristic(Characteristic.LockManagementAutoSecurityTimeout)
         .on('get', (callback) => {
            this.getValue("LockManagementAutoSecurityTimeout", callback);
         });
      }

      // Optional
      if ( this.administratorAccessOnly )
      {
         service.getCharacteristic(Characteristic.AdministratorAccessOnly)
         .on('get', (callback) => {
            this.getValue("AdministratorAccessOnly", callback);
         });
      }

      // Optional
      if ( this.currentDoorState )
      {
         service.getCharacteristic(Characteristic.CurrentDoorState)
         .on('get', (callback) => {
            this.getValue("CurrentDoorState", callback);
         });
      }

      // Optional
      if ( this.motionDetected )
      {
         service.getCharacteristic(Characteristic.MotionDetected)
         .on('get', (callback) => {
            this.getValue("MotionDetected", callback);
         });
      }
   },

   setupLockMechanismService: function (service)
   {
      service.getCharacteristic(Characteristic.LockCurrentState)
      .on('get', (callback) => {
         this.getValue("LockCurrentState", callback);
      });

      service.getCharacteristic(Characteristic.LockTargetState)
      .on('set', (value,callback) => {
         this.setValue(value,"LockTargetState", Characteristic.LockTargetState, callback);
      });
      service.getCharacteristic(Characteristic.LockTargetState)
      .on('get', (callback) => {
         this.getValue("LockTargetState", callback);
      });
   },

   setupOutletService: function (service)
   {
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue("On", callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,"On", Characteristic.On, callback);
      });
      service.getCharacteristic(Characteristic.OutletInUse)
      .on('get', (callback) => {
         this.getValue("OutletInUse", callback);
      });
      service.getCharacteristic(Characteristic.OutletInUse)
      .on('set', (value,callback) => {
         this.setValue(value,"OutletInUse", Characteristic.OutletInUse, callback);
      });
   },

   setupSwitchService: function (service)
   {
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue("On", callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,"On", Characteristic.On, callback);
      });
   },

   setupThermostatService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', (callback) => {
         this.getValue("CurrentTemperature", callback);
      });

      service.getCharacteristic(Characteristic.TargetTemperature)
      .on('get', (callback) => {
         this.getValue("TargetTemperature", callback);
      });

      if ( this.targetTemperature )
      {
         service.getCharacteristic(Characteristic.TargetTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetTemperature", Characteristic.TargetTemperature, callback);
         });
      }

      service.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
      .on('get', (callback) => {
         this.getValue("CurrentHeatingCoolingState", callback);
      });

      service.getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('get', (callback) => {
         this.getValue("TargetHeatingCoolingState", callback);
      });

      service.getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('set', (value,callback) => {
         this.setValue(value,"TargetHeatingCoolingState", Characteristic.TargetHeatingCoolingState, callback);
      });

      service.getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', (callback) => {
         this.getValue("TemperatureDisplayUnits", callback);
      });

      // Optional
      if (this.coolingThresholdTemperature)
      {
         service.getCharacteristic(Characteristic.CoolingThresholdTemperature)
         .on('get', (callback) => {
            this.getValue("CoolingThresholdTemperature", callback);
         });
         service.getCharacteristic(Characteristic.CoolingThresholdTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,"CoolingThresholdTemperature", Characteristic.CoolingThresholdTemperature, callback);
         });
      }

      // Optional
      if (this.currentRelativeHumidity)
      {
         service.getCharacteristic(Characteristic.CurrentRelativeHumidity)
         .on('get', (callback) => {
            this.getValue("CurrentRelativeHumidity", callback);
         });
      }

      // Optional
      if (this.heatingThresholdTemperature)
      {
         service.getCharacteristic(Characteristic.HeatingThresholdTemperature)
         .on('get', (callback) => {
            this.getValue("HeatingThresholdTemperature", callback);
         });
         service.getCharacteristic(Characteristic.HeatingThresholdTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,"HeatingThresholdTemperature", Characteristic.HeatingThresholdTemperature, callback);
         });
      }

      // Optional
      if (this.targetRelativeHumidity)
      {
         service.getCharacteristic(Characteristic.TargetRelativeHumidity)
         .on('get', (callback) => {
            this.getValue("TargetRelativeHumidity", callback);
         });
         service.getCharacteristic(Characteristic.TargetRelativeHumidity)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetRelativeHumidity", Characteristic.TargetRelativeHumidity, callback);
         });
      }
   },

    setupAirQualitySensorService: function (service)
    {
      service.getCharacteristic(Characteristic.AirQuality)
      .on('get', (callback) => {
         this.getValue("AirQuality", callback);
      });

      // Optional
      if (this.OzoneDensity)
      {
         service.getCharacteristic(Characteristic.OzoneDensity)
         .on('get', (callback) => {
            this.getValue("OzoneDensity", callback);
         });
      }

      // Optional
      if (this.NitrogenDioxideDensity)
      {
         service.getCharacteristic(Characteristic.NitrogenDioxideDensity)
         .on('get', (callback) => {
            this.getValue("NitrogenDioxideDensity", callback);
         });
      }

      // Optional
      if (this.sulphurDioxideDensity)
      {
         service.getCharacteristic(Characteristic.SulphurDioxideDensity)
         .on('get', (callback) => {
            this.getValue("SulphurDioxideDensity", callback);
         });
      }

      // Optional
      if (this.PM2_5Density)
      {
         service.getCharacteristic(Characteristic.PM2_5Density)
         .on('get', (callback) => {
            this.getValue("PM2_5Density", callback);
         });
      }

      // Optional
      if (this.PM10Density)
      {
         service.getCharacteristic(Characteristic.PM10Density)
         .on('get', (callback) => {
            this.getValue("PM10Density", callback);
         });
      }

      // Optional
      if (this.VOCDensity)
      {
         service.getCharacteristic(Characteristic.VOCDensity)
         .on('get', (callback) => {
            this.getValue("VOCDensity", callback);
         });
      }

      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupSecuritySystemService: function (service)
   {
      service.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('get', (callback) => {
         this.getValue("SecuritySystemTargetState", callback);
      });

      service.getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .on('get', (callback) => {
         this.getValue("SecuritySystemCurrentState", callback);
      });

      service.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('set', (value,callback) => {
         this.setValue(value,"SecuritySystemTargetState", Characteristic.SecuritySystemTargetState, callback);
      });

      if (this.securitySystemAlarmType)
      {
         service.getCharacteristic(Characteristic.SecuritySystemAlarmType)
         .on('set', (value,callback) => {
            this.setValue(value,"SecuritySystemAlarmType", Characteristic.SecuritySystemAlarmType, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }
   },

   setupCarbonMonoxideSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CarbonMonoxideDetected)
      .on('get', (callback) => {
         this.getValue("CarbonMonoxideDetected", callback);
      });


      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
          service.getCharacteristic(Characteristic.StatusLowBattery)
          .on('get', (callback) => {
             this.getValue("StatusLowBattery", callback);
          });
      }

      // Optional
      if (this.carbonMonoxideLevel)
      {
          service.getCharacteristic(Characteristic.CarbonMonoxideLevel)
          .on('get', (callback) => {
             this.getValue("CarbonMonoxideLevel", callback);
          });
      }

      // Optional
      if (this.carbonMonoxidePeakLevel)
      {
          service.getCharacteristic(Characteristic.CarbonMonoxidePeakLevel)
          .on('get', (callback) => {
             this.getValue("CarbonMonoxidePeakLevel", callback);
          });
      }
   },

   setupContactSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.ContactSensorState)
      .on('get', (callback) => {
         this.getValue("ContactSensorState", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupDoorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue("CurrentPosition", callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('set', (value,callback) => {
         this.setValue(value,"TargetPosition", Characteristic.TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue("TargetPosition", callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue("PositionState", callback);
      });

      // Optional
      if (this.holdPosition)
      {
          service.getCharacteristic(Characteristic.HoldPosition)
          .on('get', (callback) => {
             this.getValue("HoldPosition", callback);
          });
          service.getCharacteristic(Characteristic.HoldPosition)
         .on('set', (value,callback) => {
            this.setValue(value,"HoldPosition", Characteristic.HoldPosition, callback);
         });
      }

      // Optional
      if (this.obstructionDetected)
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue("ObstructionDetected", callback);
         });
      }
   },

   setupHumiditySensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', (callback) => {
         this.getValue("CurrentRelativeHumidity", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupLeakSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.LeakDetected)
      .on('get', (callback) => {
         this.getValue("LeakDetected", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }
   },

   setupLightSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .on('get', (callback) => {
         this.getValue("CurrentAmbientLightLevel", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupMotionSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.MotionDetected)
      .on('get', (callback) => {
         this.getValue("MotionDetected", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupOccupancySensorService: function (service)
   {
      service.getCharacteristic(Characteristic.OccupancyDetected)
      .on('get', (callback) => {
         this.getValue("OccupancyDetected", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }
      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupSmokeSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.SmokeDetected)
      .on('get', (callback) => {
         this.getValue("SmokeDetected", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }
   },

   setupStatelessProgrammableSwitchService: function (service)
   {
      // Optional
      if (this.serviceLabelIndex)
      {
         service.getCharacteristic(Characteristic.ServiceLabelIndex)
         .on('get', (callback) => {
            this.getValue("ServiceLabelIndex", callback);
         });
      }
      // Optional
      if (this.serviceLabelNamespace)
      {
         service.getCharacteristic(Characteristic.ServiceLabelNamespace)
         .on('get', (callback) => {
            this.getValue("ServiceLabelNamespace", callback);
         });
      }
   },

   setupTemperatureSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', (callback) => {
         this.getValue("CurrentTemperature", callback);
      });
      service.getCharacteristic(Characteristic.CurrentTemperature).setProps( {minValue: -100} );

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }
  },

   setupWindowService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue("CurrentPosition", callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetPosition", Characteristic.TargetPosition, callback);
      });
      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue("TargetPosition", callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue("PositionState", callback);
      });

      // Optional
      if (this.holdPosition)
      {
         service.getCharacteristic(Characteristic.HoldPosition)
            .on('set', (value,callback) => {
               this.setValue(value,"HoldPosition", Characteristic.HoldPosition, callback);
         });
         service.getCharacteristic(Characteristic.HoldPosition)
         .on('get', (callback) => {
            this.getValue("HoldPosition", callback);
         });
      }

      // Optional
      if ( this.obstructionDetected )
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue("ObstructionDetected", callback);
         });
      }
   },

   setupWindowCoveringService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue("CurrentPosition", callback);
      });
      service.getCharacteristic(Characteristic.TargetPosition)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetPosition", Characteristic.TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue("TargetPosition", callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue("PositionState", callback);
      });

      // Optional
      if (this.currentHorizontalTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentHorizontalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,"CurrentHorizontalTiltAngle", callback);
         });
      }

      // Optional
      if (this.targetHorizontalTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetHorizontalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,"TargetHorizontalTiltAngle", Characteristic.TargetHorizontalTiltAngle, callback);
         });
         service.getCharacteristic(Characteristic.TargetHorizontalTiltAngle)
         .on('get', (callback) => {
            this.getValue("TargetHorizontalTiltAngle", callback);
         });
      }

      // Optional
      if (this.currentVerticalTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentVerticalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,"CurrentVerticalTiltAngle", Characteristic.CurrentHorizontalTiltAngle, callback);
         });
      }

      // Optional
      if (this.targetVerticalTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetVerticalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,"TargetVerticalTiltAngle", Characteristic.TargetVerticalTiltAngle, callback);
         });
         service.getCharacteristic(Characteristic.VerticalTiltAngle)
         .on('get', (callback) => {
            this.getValue("TargetVerticalTiltAngle", callback);
         });
      }

      // Optional
      if ( this.obstructionDetected )
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue("ObstructionDetected", callback);
         });
      }
   },

   setupBatteryService: function (service)
   {
      service.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', (callback) => {
         this.getValue("BatteryLevel", callback);
      });

      service.getCharacteristic(Characteristic.ChargingState)
      .on('get', (callback) => {
         this.getValue("ChargingState", callback);
      });

      service.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', (callback) => {
         this.getValue("StatusLowBattery", callback);
      });
   },

   setupCarbonDioxideSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CarbonDioxideDetected)
      .on('get', (callback) => {
         this.getValue("CarbonDioxideDetected", callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue("StatusActive", callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue("StatusFault", callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue("StatusTampered", callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue("StatusLowBattery", callback);
         });
      }

      // Optional
      if (this.carbonDioxideLevel)
      {
         service.getCharacteristic(Characteristic.CarbonDioxideLevel)
         .on('set', (value,callback) => {
            this.setValue(value,"CarbonDioxideLevel", callback);
         });
      }
   },

   setupCameraRTPStreamManagementService: function (service)
   {
      
   },

   setupMicrophoneService: function (service)
   {
      service.getCharacteristic(Characteristic.Mute)
      .on('get', (callback) => {
         this.getValue("Mute", callback);
      });
      service.getCharacteristic(Characteristic.Mute)
      .on('set', (value,callback) => {
         this.setValue(value,"Mute", Characteristic.Mute, callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue("Volume", callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,"Volume", Characteristic.Volume, callback);
         });
      }
   },

   setupSpeakerService: function (service)
   {
      service.getCharacteristic(Characteristic.Mute)
      .on('get', (callback) => {
         this.getValue("Mute", callback);
      });
      service.getCharacteristic(Characteristic.Mute)
      .on('set', (value,callback) => {
         this.setValue(value,"Mute", Characteristic.Mute, callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue("Volume", callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,"Volume", Characteristic.Volume, callback);
         });
      }
   },

   setupDoorbellService: function (service)
   {
      service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
      .on('get', (callback) => {
         this.getValue("ProgrammableSwitchEventMute", callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue("Volume", callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,"Volume", Characteristic.Volume, callback);
         });
      }

      // Optional
      if (this.brightness)
      {
         service.getCharacteristic(Characteristic.Brightness)
         .on('get', (callback) => {
            this.getValue("Brightness", callback);
         });
      }
   },

   setupFanv2Service: function (service)
   {
      service.getCharacteristic(Characteristic.Active)
      .on('get', (callback) => {
         this.getValue("Active", callback);
      });
      service.getCharacteristic(Characteristic.Active)
      .on('set', (value,callback) => {
         this.setValue(value,"Active", Characteristic.Active, callback);
      });

      // Optional V2
      if (this.currentFanState)
      {
         service.getCharacteristic(Characteristic.CurrentFanState)
         .on('get', (callback) => {
            this.getValue("CurrentFanState", callback);
         });
      }

      // Optional V2
      if (this.targetFanState)
      {
         service.getCharacteristic(Characteristic.TargetFanState)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetFanState", Characteristic.TargetFanState, callback);
         });

         service.getCharacteristic(Characteristic.TargetFanState)
         .on('get', (callback) => {
            this.getValue("TargetFanState", callback);
         });
      }

      // Optional
      if (this.rotationDirection)
      {
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('get', (callback) => {
            this.getValue("RotationDirection", callback);
         });
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('set', (value,callback) => {
            this.setValue(value,"RotationDirection", Characteristic.RotationDirection, callback);
         });
      }

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,"RotationSpeed", Characteristic.RotationSpeed, callback);
         });
          service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue("RotationSpeed", callback);
         });
      }

      // Optional V2
      if (this.lockPhysicalControls)
      {
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('set', (value,callback) => {
            this.setValue(value,"LockPhysicalControls", Characteristic.LockPhysicalControls, callback);
         });

         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('get', (callback) => {
            this.getValue("LockPhysicalControls", callback);
         });
      }
   },

   setupSlatService: function (service)
   {
      // Missing from Hap ???
      //service.getCharacteristic(Characteristic.CurrentSlatType)
      //.on('get', (callback) => {
      //   this.getValue("CurrentSlatType", callback);
      //});

      service.getCharacteristic(Characteristic.SlatType)
      .on('get', (callback) => {
         this.getValue("SlatType", callback);
      });

      // Optional
      if (this.swingMode)
      {
         service.getCharacteristic(Characteristic.SwingMode)
         .on('get', (callback) => {
            this.getValue("SwingMode", callback);
         });
         service.getCharacteristic(Characteristic.SwingMode)
         .on('set', (value,callback) => {
            this.setValue(value,"SwingMode", Characteristic.SwingMode, callback);
         });
      }

      // Optional
      if (this.currentTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentTiltAngle)
         .on('get', (callback) => {
            this.getValue("CurrentTiltAngle", callback);
         });
      }

      // Optional
      if (this.targetTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetTiltAngle)
         .on('get', (callback) => {
            this.getValue("TargetTiltAngle", callback);
         });
         service.getCharacteristic(Characteristic.TargetTiltAngle)
         .on('set', (value,callback) => {
            this.setValue(value,"TargetTiltAngle", Characteristic.TargetTiltAngle, callback);
         });
      }
   },

   setupFilterMaintenanceService: function (service)
   {
      service.getCharacteristic(Characteristic.FilterChangeIndication)
      .on('get', (callback) => {
         this.getValue("FilterChangeIndication", callback);
      });

      // Optional
      if (this.filterLifeLevel)
      {
         service.getCharacteristic(Characteristic.FilterLifeLevel)
         .on('get', (callback) => {
            this.getValue("FilterLifeLevel", callback);
         });
      }

      // Optional
      if (this.resetFilterIndication)
      {
         service.getCharacteristic(Characteristic.ResetFilterIndication)
         .on('set', (value,callback) => {
            this.setValue(value,"ResetFilterIndication", Characteristic.ResetFilterIndication, callback);
         });
      }
   },

   // Note: Cannot get this one to stop spinning. Hmmm...
   setupAirPurifierService: function (service)
   {
      service.getCharacteristic(Characteristic.Active)
      .on('set', (value,callback) => {
         this.setValue(value,"Active", Characteristic.Active, callback);
      });
      service.getCharacteristic(Characteristic.Active)
      .on('get', (callback) => {
         this.getValue("Active", callback);
      });

      service.getCharacteristic(Characteristic.TargetAirPurifierState)
      .on('set', (value,callback) => {
         this.setValue(value,"TargetAirPurifierState", Characteristic.TargetAirPurifierState, callback);
      });
      service.getCharacteristic(Characteristic.TargetAirPurifierState)
      .on('get', (callback) => {
         this.getValue("TargetAirPurifierState", callback);
      });

      service.getCharacteristic(Characteristic.CurrentAirPurifierState)
      .on('get', (callback) => {
         this.getValue("CurrentAirPurifierState", callback);
      });

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue("RotationSpeed", callback);
         });
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,"RotationSpeed", Characteristic.RotationSpeed, callback);
         });
      }

      // Optional
      if (this.swingMode)
      {
         service.getCharacteristic(Characteristic.SwingMode)
         .on('get', (callback) => {
            this.getValue("SwingMode", callback);
         });
         service.getCharacteristic(Characteristic.SwingMode)
         .on('set', (value,callback) => {
            this.setValue(value,"SwingMode", Characteristic.SwingMode, callback);
         });
      }

      if (this.LockPhysicalControls)
      {
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('get', (callback) => {
            this.getValue("LockPhysicalControls", callback);
         });
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('set', (value,callback) => {
            this.setValue(value,"LockPhysicalControls", Characteristic.LockPhysicalControls, callback);
         });
      }
   },

   setupServiceLabelService: function (service)
   {
      service.getCharacteristic(Characteristic.ServiceLabelNamespace)
      .on('get', (callback) => {
         this.getValue("ServiceLabelNamespace", callback);
      });
   },
   
   setupAccessoryFakeGatoService: function ( eveType )
   {
      // Optional
      if ( this.storage != undefined )
      {      
         if (this.storage == 'fs')
         {
            this.loggingService = new FakeGatoHistoryService
            (
               eveType, 
               this, 
              { storage: 'fs',
                path: this.storagePath }
            );
         
         } else if (this.storage == 'googleDrive')
         {
            this.loggingService = new FakeGatoHistoryService
            (
               eveType, 
               this, 
               { storage: 'googleDrive',
                 folder: this.folder, 
                 keyPath: this.keyPath }
            );
         } else
         {
            this.log("WARNING: Cmd4 Unknown accessory config.storage '%s'. Expected 'fs' or 'googlrDrive for '%s' ", this.storage, this.name);
         }
      }
      
      if (this.loggingService)
      {
         if (this.polling == undefined ||
             this.polling == false)
         {
            this.log("Cmd4: Warning config.storage='%s' for '%s' set but polling is not enabled.",
              this.storage, this.name); 
            this.log("      History will not be updated continiously.");
               
         } else if ( this.interval > 10 * 60)
         {
            this.log("Cmd4: Warning config.interval='%s' seconds for '%s'.",
               this.interval, this.name);
            this.log("      When 'storage' is set this should be < 10 minutes.");
         }
      }
   },

   updateAccessoryAttribute: function (characteristicString, value)
   {     
      switch(this.config.type)
      {
         case  "Fan":
         case  "Fanv1":
         {
            switch ( characteristicString )
            {
               case "On": // (V1only)
               {
                  this.on = value;
                  break;
               }                              
               case "RotationDirection": // Optional
               {   
                  this.rotationDirection = value;
                  break;
               }
               case "RotationSpeed": // Optional
               {   
                  this.rotationSpeed = value;
                  break;
               }  
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);              
            }
            if ( this.loggingService ) 
            {        
               // Note: Instead of moment().unix(), I could have used: Math.floor(new Date()/1000)
               //       but fakegato-history requires moment so lets go with it.
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case "GarageDoorOpener":
         {
            switch ( characteristicString )
            {
               case "CurrentDoorState":
               {   
                  this.currentDoorState = value;                 
                  break;
               }
               case "TargetDoorState":
               {   
                  this.targetDoorState = value;
                  break;
               }
               case "ObstructionDetected":
               {   
                  this.obstructionDetected = value;
                  break;
               }
               case "LockCurrentState": // Optional
               {   
                  this.lockCurrentState = value;
                  break;
               }
               case "LockTargetState": // Optional
               {   
                  this.lockTargetState = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.currentDoorState});
            }
            break;
         }
         case  "Lightbulb":
         {
            switch ( characteristicString )
            {
               case "On":
               {   
                  this.on = value;
                  break;
               }
               case "Brightness": // Optional
               {   
                  this.brightness = value;
                  break;
               }
               case "Hue": // Optional
               {   
                  this.hue = value;
                  break;
               }
               case "Saturation": // Optional
               {   
                  this.saturation = value;
                  break;
               }
               case "ColorTemperature": // Optional
               {   
                  this.colorTemperature = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {               
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case "LockManagement":
         {
            switch ( characteristicString )
            {
               case "LockControlPoint":
               {   
                  this.lockControlPoint = value;
                  break;
               }
               case "Version":
               {   
                  this.version = value;
                  break;
               }
               case "Logs": // Optional
               {   
                  this.logs = value;
                  break;
               }
               case "AudioFeedback": // Optional
               {   
                  this.audioFeedback = value;
                  break;
               }
               case "LockManagementAutoSecurityTimeout": // Optional
               {   
                  this.lockManagementAutoSecurityTimeout = value;
                  break;
               }
               case "AdministorOnlyAccess": // Optional
               {   
                  this.administorOnlyAccess = value;
                  break;
               }
               case "LockLastKnownAction": // Optional
               {   
                  this.lockLastKnownAction = value;
                  break;
               }
               case "CurrentDoorState": // Optional
               {   
                  this.currentDoorState = value;
                  break;
               }
               case "MotionDetected": // Optional
               {   
                  this.motionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {               
               this.loggingService.addEntry({time: moment().unix(), status: this.lockControlPoint});
            }
            break;
         }
         case "LockMechanism":
         {
            switch ( characteristicString )
            {
               case "LockCurrentState":
               {
                  this.lockCurrentState = value;
                  break;
               }
               case "LockTargetState":
               {
                  this.lockTargetState = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {             
               this.loggingService.addEntry({time: moment().unix(), status: this.lockCurrentState});
            }
            break;
         }
         case  "Outlet":
         {
            switch ( characteristicString )
            {
               case "On":
               {
                  this.on = value;
                  break;
               }
               case "OutletInUse":
               {
                  this.outletInUse = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         } 
         case  "Switch":
         {
            switch ( characteristicString )
            {
               case "On":
               {
                  this.on = value;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                    
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case "Thermostat":
         {
            switch ( characteristicString )
            {
               case "CurrentHeatingCoolingState":
               {   
                  this.currentHeatingCoolingState = value;
                  break;
               }
               case "TargetHeatingCoolingState":
               {   
                  this.targetHeatingCoolingState = value;
                  break;
               }
               case "CurrentTemperature":
               {   
                  this.currentTemperature = value;
                  break;
               }
               case "TargetTemperature":
               {   
                  this.targetTemperature = value;
                  break;
               }
               case "TemperatureDisplayUnits":
               {   
                  this.temperatureDisplayUnits = value;
                  break;
               }
               case "CoolingThresholdTemperature": // Optional
               {   
                  this.coolingThresholdTemperature = value;
                  break;
               }
               case "CurrentRelativeHumidity": // Optional
               {   
                  this.currentRelativeHumidity = value;
                  break;
               }
               case "HeatingThresholdTemperature": // Optional
               {   
                  this.heatingThresholdTemperature = value;
                  break;
               }
               case "TargettRelativeHumidity": // Optional
               {   
                  this.targettRelativeHumidity = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
              
            }
            if ( this.loggingService ) 
            {                       
               // Thermostats do not have valve positions in HAP Spec
               this.loggingService.addEntry({time: moment().unix(), currentTemp:this.currentTemperature, setTemp:this.targetTemperature, valvePosition:this.currentHeatingCoolingState});
            }
            break;
         }
         case  "AirQualitySensor":
         {
            switch ( characteristicString )
            {
               case "AirQuality":
               {   
                  this.airQuality = value;
                  break;
               }
               case "OzoneDensity": // Optional
               {   
                  this.OzoneDensity = value;
                  break;
               }
               case "NitrogenDioxideDensity": // Optional
               {   
                  this.nitrogenDioxideDensity = value;
                  break;
               }
               case "SulphurDioxideDensity": // Optional
               {   
                  this.sulphurDioxideDensity = value;
                  break;
               }
               case "PM2_5Density": // Optional
               {   
                  this.PM2_5Density = value;
                  break;
               }
               case "PM10Density": // Optional
               {   
                  this.PM10Density = value;
                  break;
               }
               case "VOCDensity": // Optional
               {   
                  this.VOCDensity = value;
                  break;
               }
               case "StatusActive": // Optional
               {   
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                      
               this.loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
            }
            break;
         }
         case  "SecuritySystem":
         {   
            switch ( characteristicString )
            {
               case "SecuritySystemCurrentState":
               {   
                  this.securitySystemCurrentState = value;
                  break;
               }
               case "SecuritySystemTargetState":
               {   
                  this.securitySystemTargetState = value;
                  break;
               }
               case "SecuritySystemAlarmType": // Optional
               {   
                  this.securitySystemAlarmType = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                
               this.loggingService.addEntry({time: moment().unix(), status: this.securitySystemCurrentState});
            }
            break;
         }
         case  "CarbonMonoxideDetector":
         {
            switch ( characteristicString )
            {
               case "CarbonMonoxideDetected":
               {   
                  this.carbonMonoxideDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {   
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               case "CarbonMonoxideLevel": // Optional
               {
                  this.carbonMonoxideLevel = value;
                  break;
               }
               case "CarbonMonoxidePeakLevel":
               {
                  this.carbonMonoxidePeakLevel = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.carbonMonoxideLevel});
            }
            break;
         }
         case  "ContactSensor":
         {
            switch ( characteristicString )
            {
               case "ContactSensorState":
               {
                  this.contactSensorState = value;
                  break;
               }
               case "StatusActive":
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "Door":
         {
            switch ( characteristicString )
            {
               case "CurrentPosition":
               {
                  this.currentPosition = value;
                  break;
               }
               case "TargetPosition":
               {
                  this.targetPosition = value;
                  break;
               }
               case "PositionState":
               {
                  this.positionState = value;
                  break;
               }
               case "HoldPosition": // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case "ObstructionDetected": // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  "HumiditySensor":
         {
            switch ( characteristicString )
            {
               case "CurrentRelativeHumidity":
               {
                  this.currentRelativeHumidity = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
            }
            break;
         }
         case  "LeakSensor":
         {
            switch ( characteristicString )
            {
               case "LeakDetected":
               {
                  this.leakDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "LightSensor":
         {
            switch ( characteristicString )
            {
               case "CurrentAmbientLightLevel":
               {
                  this.currentAmbientLightLevel = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "MotionSensor":
         {
            switch ( characteristicString )
            {               
               case "MotionDetected":
               {
                  this.motionDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                      
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "OccupancySensor":
         {
            switch ( characteristicString )
            {                              
               case "occupancyDetected":
               {
                  this.occupancyDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                 
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "SmokeSensor":
         {
            switch ( characteristicString )
            {               
               case "SmokeDetected":
               {
                  this.smokeDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  "StatelessProgrammableSwitch":
         {
            switch ( characteristicString )
            {
               case "ProgrammableSwitchEvent":
               {
                  this.programmableSwitchEvent = value;
                  break;
               }
               case "ServiceLabelIndex": // Optional
               {
                  this.serviceLabelIndex = value;
                  break;
               }
               case "ServiceLabelNamespace": // Optional
               {
                  this.serviceLabelNamespace = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            break;
         }
         case  "TemperatureSensor":
         {
            switch ( characteristicString )
            {                             
               case "CurrentTemperature":
               {
                  this.currentTemperature = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "StatusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                      
               this.loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
            }
            break;
         }
         case  "Window":
         {
            switch ( characteristicString )
            {
               case "CurrentPosition":
               {
                  this.currentPosition = value;
                  break;
               }
               case "TargetPosition":
               {
                  this.targetPosition = value;
                  break;
               }
               case "PositionState":
               {
                  this.positionState = value;
                  break;
               }
               case "HoldPosition": // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case "ObstructionDetected": // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  "WindowCovering":
         {
            switch ( characteristicString )
            {
               case "TargetPosition":
               {
                  this.targetPosition = value;
                  break;
               }
               case "CurrentPosition":
               {
                  this.currentPosition = value;
                  break;
               }
               case "PositionState":
               {
                  this.positionState = value;
                  break;
               }
               case "HoldPosition": // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case "CurrentHorizontalTiltAngle": // Optional
               {
                  this.currentHorizontalTiltAngle = value;
                  break;
               }
               case "TargetHorizontalTiltAngle": // Optional
               {
                  this.targetHorizontalTiltAngle = value;
                  break;
               }
               case "CurrentVerticalTiltAngle": // Optional
               {
                  this.currentVerticalTiltAngle = value;
                  break;
               }
               case "TargetVerticalTiltAngle": // Optional
               {
                  this.targetVerticalTiltAngle = value;
                  break;
               }
               case "ObstructionDetected": // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  "BatteryService":
         {
            switch ( characteristicString )
            {
               case "BatteryLevel":
               {
                  this.batteryLevel = value;
                  break;
               }
               case "ChargingState":
               {
                  this.chargingState = value;
                  break;
               }
               case "StatusLowBattery":
               {
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case  "CarbonDioxideSensor":
         {
            switch ( characteristicString )
            {                            
               case "CarbonDioxideDetected":
               {
                  this.carbonDioxideDetected = value;
                  break;
               }
               case "StatusActive": // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case "statusFault": // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case "StatusTampered": // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case "StatusLowBattery": // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               case "CarbonDioxideLevel": // Optional
               {
                  this.carbonDioxideLevel = value;
                  break;
               }
               case "CarbonDioxidePeakLevel": // Optional
               {
                  this.carbonDioxidePeakLevel = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            break;
         }
         case  "RTPCameraStreamManagement":
         {
            break;
         }
         case  "Microphone":
         {
            switch ( characteristicString)
            {
               case "Mute":
               {
                  this.mute = value;
                  break;
               }
               case "Volume":
               {
                  this.volume = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.mute});
            }
            break;
         }
         case  "Speaker":
         {
            switch ( characteristicString )
            {
               case "Mute":
               {
                  this.mute = value;
                  break;
               }
               case "Volume":
               {
                  this.volume = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.mute});
            }
            break;
         }
         case  "Doorbell":
         {
            switch ( characteristicString )
            {
               case "ProgrammableSwitchEvent":
               {
                  this.programmableSwitchEvent = value;
                  break;
               }
               case "Volume": // Optional
               {
                  this.volume = value;
                  break;
               }
               case "Brightness": // Optional
               {
                  this.brightness = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
                  
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.volume});
            }
            break;
         }
         case  "Fanv2":
         {
            switch ( characteristicString )
            {
               case "On": // (V1only)
               {
                  this.on = value;
                  break;
               }
               case "Active": // (V2)
               {
                  this.active = value;
                  break;
               }
               case "CurrentFanState": // Optional (V2)
               {   
                  this.currentFanState = value;
                  break;
               }
               case "TargetFanState": // Optional (V2)
               {   
                  this.targetFanState = value;
                  break;
               }
               case "RotationDirection": // Optional
               {   
                  this.rotationDirection = value;
                  break;
               }
               case "RotationSpeed": // Optional
               {  
                  this.rotationSpeed = value;
                  break;
               }
               case "SwingMode": // Optional (V2)
               {    
                  this.swingMode = value;
                  break;
               }
               case "LockPhysicalControls": // Optional (V2)
               {
                  this.lockPhysicalControls = value;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.active});
            }
            break;
         }
         case  "Slat":
         {
            switch ( characteristicString )
            {
               case "CurrentSlatType":
               {
                  this.currentSlatType = value;
                  break;
               }
               case "SlatType":
               {
                  this.slatType = value;
                  break;
               }
               case "SwingMode": // Optional
               {
                  this.swingMode = value;
                  break;
               }
               case "CurrentTiltAngle": // Optional
               {
                  this.currentTiltAngle = value;
                  break;
               }
               case "TargetTiltAngle": // Optional
               {
                  this.targetTiltAngle = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.currentSlatState});
            }
            break;
         }
         case  "FilterMaintenance":
         {
            switch ( characteristicString )
            {
               case "FilterChangeIndication":
               {
                  this.filterChangeIndication = value;
                  break;
               }
               case "FilterLifeLevel": // Optional
               {
                  this.filterLifeLevel = value;
                  break;
               }
               case "ResetFilterIndication": // Optional
               {
                  this.resetFilterIndication = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.filterChangeIndication});
            }
            break;
         }
         case  "AirPurifier":
         {
            switch ( characteristicString )
            {
               case "Active":
               {
                  this.active = value;
                  break;
               }
               case "CurrentAirPurifierState":
               {
                  this.currentAirPurifierState = value;
                  break;
               }
               case "TargetAirPurifierState":
               {
                  this.targetAirPurifierState = value;
                  break;
               }
               case "RotationSpeed": // Optional
               {
                  this.rotationSpeed = value;
                  break;
               }
               case "SwingMode": // Optional
               {
                  this.swingMode = value;
                  break;
               }
               case "LockPhysicalControls": // Optional
               {
                  this.lockPhysicalControls = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               this.loggingService.addEntry({time: moment().unix(), status: this.active});
            }
            break;
         }
         case  "ServiceLabel":
         {
            //switch ( characteristicString )
            //{
            //   this.value = value;
            //}
            break;
         }
         default:
            this.log("Cmd4 Warning: Unknown accessory:'%s'", this.config.type);
         
      }
   }
}

function isNumeric(num){
   num = "" + num; //coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}

