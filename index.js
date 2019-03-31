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
      
const CMD4_ACC_TYPE_Switch =                      'Switch',
      CMD4_ACC_TYPE_Fan =                         'Fan',
      CMD4_ACC_TYPE_Fanv1 =                       'Fanv1',
      CMD4_ACC_TYPE_Fanv2 =                       'Fanv2',
      CMD4_ACC_TYPE_GarageDoorOpener =            'GarageDoorOpener',
      CMD4_ACC_TYPE_Lightbulb =                   'Lightbulb',
      CMD4_ACC_TYPE_LockManagement =              'LockManagement',
      CMD4_ACC_TYPE_LockMechanism =               'LockMechanism',
      CMD4_ACC_TYPE_Outlet =                      'Outlet',
      CMD4_ACC_TYPE_Thermostat =                  'Thermostat',
      CMD4_ACC_TYPE_AirQualitySensor =            'AirQualitySensor',
      CMD4_ACC_TYPE_SecuritySystem =              'SecuritySystem',
      CMD4_ACC_TYPE_CarbonMonoxideSensor =        'CarbonMonoxideSensor',
      CMD4_ACC_TYPE_ContactSensor =               'ContactSensor',
      CMD4_ACC_TYPE_Door =                        'Door',
      CMD4_ACC_TYPE_HumiditySensor =              'HumiditySensor',
      CMD4_ACC_TYPE_LeakSensor =                  'LeakSensor',
      CMD4_ACC_TYPE_LightSensor =                 'LightSensor',
      CMD4_ACC_TYPE_MotionSensor =                'MotionSensor',
      CMD4_ACC_TYPE_OccupancySensor =             'OccupancySensor',
      CMD4_ACC_TYPE_SmokeSensor =                 'SmokeSensor',
      CMD4_ACC_TYPE_StatelessProgrammableSwitch = 'StatelessProgrammableSwitch',
      CMD4_ACC_TYPE_TemperatureSensor =           'TemperatureSensor',
      CMD4_ACC_TYPE_Window =                      'Window',
      CMD4_ACC_TYPE_WindowCovering =              'WindowCovering',
      CMD4_ACC_TYPE_BatteryService =              'BatteryService',
      CMD4_ACC_TYPE_CarbonDioxideSensor =         'CarbonDioxideSensor',
      CMD4_ACC_TYPE_CameraRTPStreamManagement =   'CameraRTPStreamManagement',
      CMD4_ACC_TYPE_Microphone =                  'Microphone',
      CMD4_ACC_TYPE_Speaker =                     'Speaker',
      CMD4_ACC_TYPE_DoorBell =                    'DoorBell',
      CMD4_ACC_TYPE_Slat =                        'Slat',
      CMD4_ACC_TYPE_FilterMaintenance =           'FilterMaintenance',
      CMD4_ACC_TYPE_AirPurifier =                 'AirPurifier',
      CMD4_ACC_TYPE_ServiceLabel =                'ServiceLabel';

const CMD4_On =                                   'On',
      CMD4_Active =                               'Active',
      CMD4_CurrentFanState =                      'CurrentFanState',
      CMD4_TargetFanState =                       'TargetFanState',                     
      CMD4_RotationDirection =                    'RotationDirection',                    
      CMD4_RotationSpeed =                        'RotationSpeed',
      CMD4_SwingMode =                            'SwingMode',
      CMD4_LockPhysicalControls =                 'LockPhysicalControls',
      CMD4_CurrentDoorState =                     'CurrentDoorState',                     
      CMD4_TargetDoorState =                      'TargetDoorState',
      CMD4_ObstructionDetected =                  'ObstructionDetected',
      CMD4_LockCurrentState =                     'LockCurrentState',
      CMD4_LockTargetState =                      'LockTargetState',
      CMD4_Brightness =                           'Brightness',
      CMD4_Hue =                                  'Hue',
      CMD4_Saturation =                           'Saturation',
      CMD4_ColorTemperature =                     'ColorTemperature',
      CMD4_LockControlPoint =                     'LockControlPoint',
      CMD4_Version =                              'Version',
      CMD4_Logs =                                 'Logs',
      CMD4_AudioFeedback =                        'AudioFeedback',
      CMD4_LockManagementAutoSecurityTimeout =    'LockManagementAutoSecurityTimeout',
      CMD4_AdministorOnlyAccess =                 'AdministorOnlyAccess',
      CMD4_LockLastKnownAction =                  'LockLastKnownAction',
      CMD4_MotionDetected =                       'MotionDetected',
      CMD4_OutletInUse =                          'OutletInUse',
      CMD4_CurrentHeatingCoolingState =           'CurrentHeatingCoolingState',
      CMD4_TargetHeatingCoolingState =            'TargetHeatingCoolingState',
      CMD4_CurrentTemperature =                   'CurrentTemperature',
      CMD4_TargetTemperature =                    'TargetTemperature',
      CMD4_TemperatureDisplayUnits =              'TemperatureDisplayUnits',
      CMD4_CoolingThresholdTemperature =          'CoolingThresholdTemperature',
      CMD4_CurrentRelativeHumidity =              'CurrentRelativeHumidity',           
      CMD4_HeatingThresholdTemperature =          'HeatingThresholdTemperature',
      CMD4_TargetRelativeHumidity =               'TargetRelativeHumidity',
      CMD4_AirQuality =                           'AirQuality',
      CMD4_OzoneDensity =                         'OzoneDensity',
      CMD4_NitrogenDioxideDensity =               'NitrogenDioxideDensity',
      CMD4_SulphurDioxideDensity =                'SulphurDioxideDensity',
      CMD4_PM2_5Density =                         'PM2_5Density',
      CMD4_PM10Density =                          'PM10Density',
      CMD4_VOCDensity =                           'VOCDensity',
      CMD4_StatusActive =                         'StatusActive',
      CMD4_StatusFault =                          'StatusFault',
      CMD4_StatusTampered =                       'StatusTampered',
      CMD4_StatusLowBattery =                     'StatusLowBattery',
      CMD4_SecuritySystemCurrentState =           'SecuritySystemCurrentState',
      CMD4_SecuritySystemTargetState =            'SecuritySystemTargetState',
      CMD4_SecuritySystemAlarmType =              'SecuritySystemAlarmType',
      CMD4_CarbonMonoxideDetected =               'CarbonMonoxideDetected',
      CMD4_CarbonMonoxideLevel =                  'CarbonMonoxideLevel',
      CMD4_CarbonMonoxidePeakLevel =              'CarbonMonoxidePeakLevel',
      CMD4_ContactSensorState =                   'ContactSensorState',
      CMD4_CurrentPosition =                      'CurrentPosition',
      CMD4_TargetPosition =                       'TargetPosition',
      CMD4_PositionState =                        'PositionState',
      CMD4_HoldPosition =                         'HoldPosition',
      CMD4_LeakDetected =                         'LeakDetected',
      CMD4_CurrentAmbientLightLevel =             'CurrentAmbientLightLevel',
      CMD4_OccupancyDetected =                    'OccupancyDetected',
      CMD4_SmokeDetected =                        'SmokeDetected',
      CMD4_ProgrammableSwitchEvent =              'ProgrammableSwitchEvent',
      CMD4_ServiceLabelIndex =                    'ServiceLabelIndex',
      CMD4_ServiceLabelNamespace =                'ServiceLabelNamespace',
      CMD4_CurrentHorizontalTiltAngle =           'CurrentHorizontalTiltAngle',
      CMD4_TargetHorizontalTiltAngle =            'TargetHorizontalTiltAngle',
      CMD4_CurrentVerticalTiltAngle =             'CurrentVerticalTiltAngle',
      CMD4_TargetVerticalTiltAngle =              'TargetVerticalTiltAngle',
      CMD4_BatteryLevel =                         'BatteryLevel',
      CMD4_ChargingState =                        'ChargingState',
      CMD4_CarbonDioxideDetected =                'CarbonDioxideDetected',
      CMD4_CarbonDioxideLevel =                   'CarbonDioxideLevel',
      CMD4_CarbonDioxidePeakLevel =               'CarbonDioxidePeakLevel',
      CMD4_Mute =                                 'Mute',
      CMD4_Volume =                               'Volume',
      CMD4_CurrentSlatType =                      'CurrentSlatType',
      CMD4_SlatType =                             'SlatType',
      CMD4_CurrentTiltAngle =                     'CurrentTiltAngle',
      CMD4_TargetTiltAngle =                      'TargetTiltAngle',
      CMD4_FilterChangeIndication =               'FilterChangeIndication',
      CMD4_FilterLifeLevel =                      'FilterLifeLevel',
      CMD4_ResetFilterIndication =                'ResetFilterIndication',
      CMD4_CurrentAirPurifierState =              'CurrentAirPurifierState',
      CMD4_TargetAirPurifierState =               'TargetAirPurifierState';

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
   
   // This is for feature of CustomConfig, not implemented yet
   var charMapper =
   {     CMD4_On:                                Characteristic.On,
         CMD4_Active:                            Characteristic.Active,
         CMD4_CurrentFanState:                   Characteristic.CurrentFanState,
         CMD4_TargetFanState:                    Characteristic.TargetFanState,                     
         CMD4_RotationDirection:                 Characteristic.RotationDirection,                    
         CMD4_RotationSpeed:                     Characteristic.RotationSpeed,
         CMD4_SwingMode:                         Characteristic.SwingMode,
         CMD4_LockPhysicalControls:              Characteristic.LockPhysicalControls,
         CMD4_CurrentDoorState:                  Characteristic.CurrentDoorState,                     
         CMD4_TargetDoorState:                   Characteristic.TargetDoorState,
         CMD4_ObstructionDetected:               Characteristic.ObstructionDetected,
         CMD4_LockCurrentState:                  Characteristic.LockCurrentState,
         CMD4_LockTargetState:                   Characteristic.LockTargetState,
         CMD4_Brightness:                        Characteristic.Brightness,
         CMD4_Hue:                               Characteristic.Hue,
         CMD4_Saturation:                        Characteristic.Saturation,
         CMD4_ColorTemperature:                  Characteristic.ColorTemperature,
         CMD4_LockControlPoint:                  Characteristic.LockControlPoint,
         CMD4_Version:                           Characteristic.Version,
         CMD4_Logs:                              Characteristic.Logs,
         CMD4_AudioFeedback:                     Characteristic.AudioFeedback,
         CMD4_LockManagementAutoSecurityTimeout: Characteristic.LockManagementAutoSecurityTimeout,
         CMD4_AdministorOnlyAccess:              Characteristic.AdministorOnlyAccess,
         CMD4_LockLastKnownAction:               Characteristic.LockLastKnownAction,
         CMD4_MotionDetected:                    Characteristic.MotionDetected,
         CMD4_OutletInUse:                       Characteristic.OutletInUse,
         CMD4_CurrentHeatingCoolingState:        Characteristic.CurrentHeatingCoolingState,
         CMD4_TargetHeatingCoolingState:         Characteristic.TargetHeatingCoolingState,
         CMD4_CurrentTemperature:                Characteristic.CurrentTemperature,
         CMD4_TargetTemperature:                 Characteristic.TargetTemperature,
         CMD4_TemperatureDisplayUnits:           Characteristic.TemperatureDisplayUnits,
         CMD4_CoolingThresholdTemperature:       Characteristic.CoolingThresholdTemperature,
         CMD4_CurrentRelativeHumidity:           Characteristic.CurrentRelativeHumidity,           
         CMD4_HeatingThresholdTemperature:       Characteristic.HeatingThresholdTemperature,
         CMD4_TargetRelativeHumidity:            Characteristic.TargetRelativeHumidity,
         CMD4_AirQuality:                        Characteristic.AirQuality,
         CMD4_OzoneDensity:                      Characteristic.OzoneDensity,
         CMD4_NitrogenDioxideDensity:            Characteristic.NitrogenDioxideDensity,
         CMD4_SulphurDioxideDensity:             Characteristic.SulphurDioxideDensity,
         CMD4_PM2_5Density:                      Characteristic.PM2_5Density,
         CMD4_PM10Density:                       Characteristic.PM10Density,
         CMD4_VOCDensity:                        Characteristic.VOCDensity,
         CMD4_StatusActive:                      Characteristic.StatusActive,
         CMD4_StatusFault:                       Characteristic.StatusFault,
         CMD4_StatusTampered:                    Characteristic.StatusTampered,
         CMD4_StatusLowBattery:                  Characteristic.StatusLowBattery,
         CMD4_SecuritySystemCurrentState:        Characteristic.SecuritySystemCurrentState,
         CMD4_SecuritySystemTargetState:         Characteristic.SecuritySystemTargetState,
         CMD4_SecuritySystemAlarmType:           Characteristic.SecuritySystemAlarmType,
         CMD4_CarbonMonoxideDetected:            Characteristic.CarbonMonoxideDetected,
         CMD4_CarbonMonoxideLevel:               Characteristic.CarbonMonoxideLevel,
         CMD4_CarbonMonoxidePeakLevel:           Characteristic.CarbonMonoxidePeakLevel,
         CMD4_ContactSensorState:                Characteristic.ContactSensorState,
         CMD4_CurrentPosition:                   Characteristic.CurrentPosition,
         CMD4_TargetPosition:                    Characteristic.TargetPosition,
         CMD4_PositionState:                     Characteristic.PositionState,
         CMD4_HoldPosition:                      Characteristic.HoldPosition,
         CMD4_LeakDetected:                      Characteristic.LeakDetected,
         CMD4_CurrentAmbientLightLevel:          Characteristic.CurrentAmbientLightLevel,
         CMD4_OccupancyDetected:                 Characteristic.OccupancyDetected,
         CMD4_SmokeDetected:                     Characteristic.SmokeDetected,
         CMD4_ProgrammableSwitchEvent:           Characteristic.ProgrammableSwitchEvent,
         CMD4_ServiceLabelIndex:                 Characteristic.ServiceLabelIndex,
         CMD4_ServiceLabelNamespace:             Characteristic.ServiceLabelNamespace,
         CMD4_CurrentHorizontalTiltAngle:        Characteristic.CurrentHorizontalTiltAngle,
         CMD4_TargetHorizontalTiltAngle:         Characteristic.TargetHorizontalTiltAngle,
         CMD4_CurrentVerticalTiltAngle:          Characteristic.CurrentVerticalTiltAngle,
         CMD4_TargetVerticalTiltAngle:           Characteristic.TargetVerticalTiltAngle,
         CMD4_BatteryLevel:                      Characteristic.BatteryLevel,
         CMD4_ChargingState:                     Characteristic.ChargingState,
         CMD4_CarbonDioxideDetected:             Characteristic.CarbonDioxideDetected,
         CMD4_CarbonDioxideLevel:                Characteristic.CarbonDioxideLevel,
         CMD4_CarbonDioxidePeakLevel:            Characteristic.CarbonDioxidePeakLevel,
         CMD4_Mute:                              Characteristic.Mute,
         CMD4_Volume:                            Characteristic.Volume,
         CMD4_CurrentSlatType:                   Characteristic.CurrentSlatType,
         CMD4_SlatType:                          Characteristic.SlatType,
         CMD4_CurrentTiltAngle:                  Characteristic.CurrentTiltAngle,
         CMD4_TargetTiltAngle:                   Characteristic.TargetTiltAngle,
         CMD4_FilterChangeIndication:            Characteristic.FilterChangeIndication,
         CMD4_FilterLifeLevel:                   Characteristic.FilterLifeLevel,
         CMD4_ResetFilterIndication:             Characteristic.ResetFilterIndication,
         CMD4_CurrentAirPurifierState:           Characteristic.CurrentAirPurifierState,
         CMD4_TargetAirPurifierState:            Characteristic.TargetAirPurifierState
   };

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
      case  CMD4_ACC_TYPE_Fan:
      case  CMD4_ACC_TYPE_Fanv1:
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case CMD4_ACC_TYPE_GarageDoorOpener:
      {
         self.service.getCharacteristic
         (
            Characteristic.CurrentDoorState
         ).getValue();
      
         break;
      }
      case  CMD4_ACC_TYPE_Lightbulb:
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case CMD4_ACC_TYPE_LockManagement:
      {
          self.service.getCharacteristic
          (
             Characteristic.LockCurrentState
          ).getValue();

          break;
      }
      case CMD4_ACC_TYPE_LockMechanism:
      {
          self.service.getCharacteristic
          (
             Characteristic.LockCurrentState
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Outlet:
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      } 
      case  CMD4_ACC_TYPE_Switch:
      {
          self.service.getCharacteristic
          (
             Characteristic.On
          ).getValue();

          break;
      }
      case CMD4_ACC_TYPE_Thermostat:
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentTemperature
          ).getValue();
          
          // Poll for currentRelativeHumidity if defined
          if (self.currentRelativeHumidity)
          {
             self.service.getCharacteristic
             (
                Characteristic.CurrentRelativeHumidity
             ).getValue();
          }

          break;
      }
      case  CMD4_ACC_TYPE_AirQualitySensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.AirQuality
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_SecuritySystem:
      {   
          self.service.getCharacteristic
          (
             Characteristic.SecuritySystemCurrentState
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_CarbonMonoxideSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.CarbonMonoxideDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_ContactSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.ContactSensorState
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Door:
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentDoorState
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_HumiditySensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.CurrentRelativeHumidity
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_LeakSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.LeakDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_LightSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.CurrentAmbientLightLevel
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_MotionSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.MotionDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_OccupancySensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.OccupancyDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_SmokeSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.SmokeDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_StatelessProgrammableSwitch:
      {
          self.service.getCharacteristic
          (
             Characteristic.ProgrammableSwitchEvent
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_TemperatureSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.CurrentTemperature
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Window:
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentPosition
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_WindowCovering:
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentPosition
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_BatteryService:
      {
          self.service.getCharacteristic
          (
             Characteristic.StatusLowBattery
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_CarbonDioxideSensor:
      {
          if (self.statusActive != undefined) 
          {
             self.service.getCharacteristic
             (
                Characteristic.StatusActive
             ).getValue();
          }
             
          self.service.getCharacteristic
          (
             Characteristic.CarbonDioxideDetected
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_CameraRTPStreamManagement:
      {
          self.service.getCharacteristic
          (
             Characteristic.StatusActive
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Microphone:
      {
          self.service.getCharacteristic
          (
             Characteristic.Mute
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Speaker:
      {
          self.service.getCharacteristic
          (
             Characteristic.Mute
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Doorbell:
      {
          self.service.getCharacteristic
          (
             Characteristic.ProgrammableSwitchEvent
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Fanv2:
      {
          self.service.getCharacteristic
          (
             Characteristic.Active
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_Slat:
      {
          self.service.getCharacteristic
          (
             Characteristic.CurrentSlatState
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_FilterMaintenance:
      {
          self.service.getCharacteristic
          (
             Characteristic.FilterChangeIndication
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_AirPurifier:
      {
          self.service.getCharacteristic
          (
             Characteristic.Active
          ).getValue();

          break;
      }
      case  CMD4_ACC_TYPE_ServiceLabel:
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

/* Debug for feature of CustomConfig, not implemented yet
function getType( oObj )
{
    if( !!oObj && typeof oObj === "object" )
    {
       // Check if it is an alien object, for example created as {world:'hello'}
       if( typeof oObj.constructor !== "function" )
        { return 'Object'; }

      return oObj.constructor.name; 
    }   

    return false;
 }
*/

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
    // For multiple accessories of the same type, it is important that the accessory
    // has a unique serial number, so append the config.name.
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Cmd4")
      .setCharacteristic(Characteristic.Model, this.model )
      .setCharacteristic(Characteristic.SerialNumber, "Cmd4 " + this.config.type + this.config.name);
   
   this.UUID = UUIDGen.generate(this.name);
   
   /* Debug for feature of CustomConfig, not implemented yet
   if (this.config.customCharacteristics)
   {
      
      this.log("ZZZ Custom characteristics found '%s'", this.config.customCharacteristics);
      var customConfig = this.config.customCharacteristics;
      var len = customConfig.length;
      this.log("ZZZ length is '%s'", len);
      this.log("ZZZ customConfig[0]='%s'", customConfig[0]);
      this.log("ZZZ customConfig[0].testChar5='%s'", customConfig[0].testChar5);
      
      this.log( getType( customConfig ));        // Array
      
      this.log( getType( customConfig[0] ));        // Object
      
      var jsonObj = customConfig[0];
      
      for(var key in jsonObj) 
      {
         var value = jsonObj[key];
         this.log( "key:'%s' value:'%s'", key, value );
      }
 
         
      if (customConfig.testChar1) {
         this.log ("ZZZ testChar1 is defined");
      } else {
         this.log ("ZZZ testChar1 is NOT defined");
      }
   }
   */
   
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
      case CMD4_ACC_TYPE_Fan:
      case CMD4_ACC_TYPE_Fanv1:
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
      case CMD4_ACC_TYPE_GarageDoorOpener:
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
      case CMD4_ACC_TYPE_Lightbulb:
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
      case CMD4_ACC_TYPE_LockManagement:
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

      case CMD4_ACC_TYPE_LockMechanism:
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
      case CMD4_ACC_TYPE_Outlet: 
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
      case CMD4_ACC_TYPE_Switch:
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
      case CMD4_ACC_TYPE_Thermostat:
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
         // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_THERMO);
         break;
      }
      case CMD4_ACC_TYPE_AirQualitySensor:
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
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case CMD4_ACC_TYPE_SecuritySystem:
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
      case CMD4_ACC_TYPE_CarbonMonoxideSensor:
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
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});  
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case CMD4_ACC_TYPE_ContactSensor:
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
      case CMD4_ACC_TYPE_Door:
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
      case CMD4_ACC_TYPE_HumiditySensor:
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
      case CMD4_ACC_TYPE_LeakSensor:
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
      case CMD4_ACC_TYPE_LightSensor:
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
      case CMD4_ACC_TYPE_MotionSensor:
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
      case CMD4_ACC_TYPE_OccupancySensor:
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
      case CMD4_ACC_TYPE_SmokeSensor:
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
      case CMD4_ACC_TYPE_StatelessProgrammableSwitch: 
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
      case CMD4_ACC_TYPE_TemperatureSensor: 
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
      case CMD4_ACC_TYPE_Window:
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
      case CMD4_ACC_TYPE_WindowCovering:
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
      case CMD4_ACC_TYPE_BatteryService:
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
      case CMD4_ACC_TYPE_CarbonDioxideSensor: 
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
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case CMD4_ACC_TYPE_CameraRTPStreamManagement:
      {
         this.service = new Service.CameraRTPStreamManagement(this.name, this.name);
         this.setupCameraRTPStreamManagementService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case CMD4_ACC_TYPE_Microphone:
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
      case CMD4_ACC_TYPE_Speaker:
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
      case CMD4_ACC_TYPE_DoorBell:
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

         // HomeKitTypes.js has this as 'Doorbell' (Small b)
         this.service = new Service.Doorbell(this.name, this.name);
         this.setupDoorbellService(this.service);
         
         // Eve Door (ContactSensor service)
         // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
         this.setupAccessoryFakeGatoService(FAKEGATO_TYPE_DOOR);
         break;
      }
      case CMD4_ACC_TYPE_Fanv2:
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
      case CMD4_ACC_TYPE_Slat:
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
      case CMD4_ACC_TYPE_FilterMaintenance:
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
      case CMD4_ACC_TYPE_AirPurifier:
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
      case CMD4_ACC_TYPE_ServiceLabel:
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
               case CMD4_ACC_TYPE_Fan:
               case CMD4_ACC_TYPE_Fanv1:
               case CMD4_ACC_TYPE_Fanv2:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == CMD4_TargetFanState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentFanState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case CMD4_ACC_TYPE_GarageDoorOpener:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 10;

                  if (characteristicString == CMD4_TargetDoorState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentDoorState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  if (characteristicString == CMD4_LockTargetState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.LockCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  break;
               }
               case CMD4_ACC_TYPE_LockMechanism:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == CMD4_LockTargetState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.LockCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }

                  break;
               }
               case CMD4_ACC_TYPE_Door:
               case CMD4_ACC_TYPE_Window:
               case CMD4_ACC_TYPE_WindowCovering:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == CMD4_TargetPosition )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentPosition).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case CMD4_ACC_TYPE_Thermostat:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 10;

                  if (characteristicString == CMD4_TargetHeatingCoolingState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentHeatingCoolingState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == CMD4_TargetTemperature )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentTemperature).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == CMD4_TargetRelativeHumidity )
                  {
                     setTimeout(() => {
                     responded  = true;
                        self.service.getCharacteristic(Characteristic.CurrentRelativeHumidity).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  break;
               }
               case CMD4_ACC_TYPE_SecuritySystem:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == CMD4_SecuritySystemTargetState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.SecuritySystemCurrentState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);

                  }
                  break;
               }
               case CMD4_ACC_TYPE_FilterMaintenance:
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
               case CMD4_ACC_TYPE_AirPurifier:
               {
                  if (self.config.stateChangeResponseTime === undefined)
                     self.stateChangeResponseTime = 3;

                  if (characteristicString == CMD4_TargetAirPurifierState )
                  {
                     responded  = true;
                     setTimeout(() => {
                        self.service.getCharacteristic(Characteristic.CurrentAirPurifierState).getValue();
                        callback();
                     }, self.stateChangeResponseTime * 1000);
                  }
                  if (characteristicString == CMD4_Active )
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
         this.getValue(CMD4_On, callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_On, Characteristic.On, callback);
      });

      // Optional
      if (this.rotationDirection)
      {
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('get', (callback) => {
            this.getValue(CMD4_RotationDirection, callback);
         });
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_RotationDirection, Characteristic.RotationDirection, callback);
         });
      }

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue(CMD4_RotationSpeed, callback);
         });
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_RotationSpeed, Characteristic.RotationSpeed.On, callback);
         });
      }
   },

   setupGarageDoorOpenerService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentDoorState)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentDoorState, callback);
      });

      service.getCharacteristic(Characteristic.TargetDoorState)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_TargetDoorState, Characteristic.TargetDoorState, callback);
      });

      service.getCharacteristic(Characteristic.ObstructionDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_ObstructionDetected, callback);
      });

      if ( this.lockCurrentState )
      {
         // Optional
         service.getCharacteristic(Characteristic.LockCurrentState)
         .on('get', (callback) => {
            this.getValue(CMD4_LockCurrentState, callback);
         });
         service.getCharacteristic(Characteristic.LockTargetState)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_LockTargetState, Characteristic.LockTargetState, callback);
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
         this.setValue(value,CMD4_On, Characteristic.On, callback);
      });

      // Optional
      if ( this.brightness)
      {
         service.getCharacteristic(Characteristic.Brightness)
         .on('get', (callback) => {
            this.getValue(CMD4_Brightness, callback);
         });
         service.getCharacteristic(Characteristic.Brightness)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Brightness, Characteristic.Brightness, callback);
         });
      }

      // Optional
      if ( this.saturation )
      {
         service.getCharacteristic(Characteristic.Saturation)
         .on('get', (callback) => {
            this.getValue(CMD4_Saturation, callback);
         });
         service.getCharacteristic(Characteristic.Saturation)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Saturation, Characteristic.Saturation, callback);
         });
      }

      // Optional
      if ( this.hue )
      {
         service.getCharacteristic(Characteristic.Hue)
         .on('get', (callback) => {
            this.getValue(CMD4_Hue, callback);
         });
         service.getCharacteristic(Characteristic.Hue)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Hue, Characteristic.Hue, callback);
         });
      }

      // Optional
      if ( this.colorTemperature )
      {
         service.getCharacteristic(Characteristic.ColorTemperature)
         .on('get', (callback) => {
            this.getValue(CMD4_ColorTemperature, callback);
         });
         service.getCharacteristic(Characteristic.ColorTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_ColorTemperature, Characteristic.ColorTemperature, callback);
         });
      }
   },

   setupLockManagementService: function (service)
   {
      service.getCharacteristic(Characteristic.LockControlPoint)
      .on('get', (callback) => {
         this.getValue(CMD4_LockControlPoint, callback);
      });
      service.getCharacteristic(Characteristic.Version)
      .on('get', (callback) => {
         this.getValue(CMD4_Version, callback);
      });

      // Optional
      if ( this.logs )
      {
         service.getCharacteristic(Characteristic.Logs)
         .on('get', (callback) => {
            this.getValue(CMD4_Logs, callback);
         });
      }

      // Optional
      if ( this.audioFeedback )
      {
         service.getCharacteristic(Characteristic.AudioFeedback)
         .on('get', (callback) => {
            this.getValue(CMD4_AudioFeedback, callback);
         });
      }

      // Optional
      if ( this.lockManagementAutoSecurityTimeout )
      {
         service.getCharacteristic(Characteristic.LockManagementAutoSecurityTimeout)
         .on('get', (callback) => {
            this.getValue(CMD4_LockManagementAutoSecurityTimeout, callback);
         });
      }

      // Optional
      if ( this.administratorAccessOnly )
      {
         service.getCharacteristic(Characteristic.AdministratorAccessOnly)
         .on('get', (callback) => {
            this.getValue(CMD4_AdministratorAccessOnly, callback);
         });
      }

      // Optional
      if ( this.currentDoorState )
      {
         service.getCharacteristic(Characteristic.CurrentDoorState)
         .on('get', (callback) => {
            this.getValue(CMD4_CurrentDoorState, callback);
         });
      }

      // Optional
      if ( this.motionDetected )
      {
         service.getCharacteristic(Characteristic.MotionDetected)
         .on('get', (callback) => {
            this.getValue(CMD4_MotionDetected, callback);
         });
      }
   },

   setupLockMechanismService: function (service)
   {
      service.getCharacteristic(Characteristic.LockCurrentState)
      .on('get', (callback) => {
         this.getValue(CMD4_LockCurrentState, callback);
      });

      service.getCharacteristic(Characteristic.LockTargetState)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_LockTargetState, Characteristic.LockTargetState, callback);
      });
      service.getCharacteristic(Characteristic.LockTargetState)
      .on('get', (callback) => {
         this.getValue(CMD4_LockTargetState, callback);
      });
   },

   setupOutletService: function (service)
   {
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue(CMD4_On, callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_On, Characteristic.On, callback);
      });
      service.getCharacteristic(Characteristic.OutletInUse)
      .on('get', (callback) => {
         this.getValue(CMD4_OutletInUse, callback);
      });
      service.getCharacteristic(Characteristic.OutletInUse)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_OutletInUse, Characteristic.OutletInUse, callback);
      });
   },

   setupSwitchService: function (service)
   {
      service.getCharacteristic(Characteristic.On)
      .on('get', (callback) => {
         this.getValue(CMD4_On, callback);
      });
      service.getCharacteristic(Characteristic.On)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_On, Characteristic.On, callback);
      });
   },

   setupThermostatService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentTemperature, callback);
      });

      service.getCharacteristic(Characteristic.TargetTemperature)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetTemperature, callback);
      });

      if ( this.targetTemperature )
      {
         service.getCharacteristic(Characteristic.TargetTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetTemperature, Characteristic.TargetTemperature, callback);
         });
      }

      service.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentHeatingCoolingState, callback);
      });

      service.getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetHeatingCoolingState, callback);
      });

      service.getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_TargetHeatingCoolingState, Characteristic.TargetHeatingCoolingState, callback);
      });

      service.getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .on('get', (callback) => {
         this.getValue(CMD4_TemperatureDisplayUnits, callback);
      });

      // Optional
      if (this.coolingThresholdTemperature)
      {
         service.getCharacteristic(Characteristic.CoolingThresholdTemperature)
         .on('get', (callback) => {
            this.getValue(CMD4_CoolingThresholdTemperature, callback);
         });
         service.getCharacteristic(Characteristic.CoolingThresholdTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_CoolingThresholdTemperature, Characteristic.CoolingThresholdTemperature, callback);
         });
      }

      // Optional
      if (this.currentRelativeHumidity)
      {
         service.getCharacteristic(Characteristic.CurrentRelativeHumidity)
         .on('get', (callback) => {
            this.getValue(CMD4_CurrentRelativeHumidity, callback);
         });
      }

      // Optional
      if (this.heatingThresholdTemperature)
      {
         service.getCharacteristic(Characteristic.HeatingThresholdTemperature)
         .on('get', (callback) => {
            this.getValue(CMD4_HeatingThresholdTemperature, callback);
         });
         service.getCharacteristic(Characteristic.HeatingThresholdTemperature)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_HeatingThresholdTemperature, Characteristic.HeatingThresholdTemperature, callback);
         });
      }

      // Optional
      if (this.targetRelativeHumidity)
      {
         service.getCharacteristic(Characteristic.TargetRelativeHumidity)
         .on('get', (callback) => {
            this.getValue(CMD4_TargetRelativeHumidity, callback);
         });
         service.getCharacteristic(Characteristic.TargetRelativeHumidity)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetRelativeHumidity, Characteristic.TargetRelativeHumidity, callback);
         });
      }
   },

    setupAirQualitySensorService: function (service)
    {
      service.getCharacteristic(Characteristic.AirQuality)
      .on('get', (callback) => {
         this.getValue(CMD4_AirQuality, callback);
      });

      // Optional
      if (this.OzoneDensity)
      {
         service.getCharacteristic(Characteristic.OzoneDensity)
         .on('get', (callback) => {
            this.getValue(CMD4_OzoneDensity, callback);
         });
      }

      // Optional
      if (this.NitrogenDioxideDensity)
      {
         service.getCharacteristic(Characteristic.NitrogenDioxideDensity)
         .on('get', (callback) => {
            this.getValue(CMD4_NitrogenDioxideDensity, callback);
         });
      }

      // Optional
      if (this.sulphurDioxideDensity)
      {
         service.getCharacteristic(Characteristic.SulphurDioxideDensity)
         .on('get', (callback) => {
            this.getValue(CMD4_SulphurDioxideDensity, callback);
         });
      }

      // Optional
      if (this.PM2_5Density)
      {
         service.getCharacteristic(Characteristic.PM2_5Density)
         .on('get', (callback) => {
            this.getValue(CMD4_PM2_5Density, callback);
         });
      }

      // Optional
      if (this.PM10Density)
      {
         service.getCharacteristic(Characteristic.PM10Density)
         .on('get', (callback) => {
            this.getValue(CMD4_PM10Density, callback);
         });
      }

      // Optional
      if (this.VOCDensity)
      {
         service.getCharacteristic(Characteristic.VOCDensity)
         .on('get', (callback) => {
            this.getValue(CMD4_VOCDensity, callback);
         });
      }

      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupSecuritySystemService: function (service)
   {
      service.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('get', (callback) => {
         this.getValue(CMD4_SecuritySystemTargetState, callback);
      });

      service.getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .on('get', (callback) => {
         this.getValue(CMD4_SecuritySystemCurrentState, callback);
      });

      service.getCharacteristic(Characteristic.SecuritySystemTargetState)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_SecuritySystemTargetState, Characteristic.SecuritySystemTargetState, callback);
      });

      if (this.securitySystemAlarmType)
      {
         service.getCharacteristic(Characteristic.SecuritySystemAlarmType)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_SecuritySystemAlarmType, Characteristic.SecuritySystemAlarmType, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }
   },

   setupCarbonMonoxideSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CarbonMonoxideDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_CarbonMonoxideDetected, callback);
      });


      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
          service.getCharacteristic(Characteristic.StatusLowBattery)
          .on('get', (callback) => {
             this.getValue(CMD4_StatusLowBattery, callback);
          });
      }

      // Optional
      if (this.carbonMonoxideLevel)
      {
          service.getCharacteristic(Characteristic.CarbonMonoxideLevel)
          .on('get', (callback) => {
             this.getValue(CMD4_CarbonMonoxideLevel, callback);
          });
      }

      // Optional
      if (this.carbonMonoxidePeakLevel)
      {
          service.getCharacteristic(Characteristic.CarbonMonoxidePeakLevel)
          .on('get', (callback) => {
             this.getValue(CMD4_CarbonMonoxidePeakLevel, callback);
          });
      }
   },

   setupContactSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.ContactSensorState)
      .on('get', (callback) => {
         this.getValue(CMD4_ContactSensorState, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupDoorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('set', (value,callback) => {
         this.setValue(value,"TargetPosition", Characteristic.TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue(CMD4_PositionState, callback);
      });

      // Optional
      if (this.holdPosition)
      {
          service.getCharacteristic(Characteristic.HoldPosition)
          .on('get', (callback) => {
             this.getValue(CMD4_HoldPosition, callback);
          });
          service.getCharacteristic(Characteristic.HoldPosition)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_HoldPosition, Characteristic.HoldPosition, callback);
         });
      }

      // Optional
      if (this.obstructionDetected)
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue(CMD4_ObstructionDetected, callback);
         });
      }
   },

   setupHumiditySensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentRelativeHumidity, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupLeakSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.LeakDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_LeakDetected, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }
   },

   setupLightSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentAmbientLightLevel, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupMotionSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.MotionDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_MotionDetected, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupOccupancySensorService: function (service)
   {
      service.getCharacteristic(Characteristic.OccupancyDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_OccupancyDetected, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }
      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }
   },

   setupSmokeSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.SmokeDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_SmokeDetected, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
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
            this.getValue(CMD4_ServiceLabelIndex, callback);
         });
      }
      // Optional
      if (this.serviceLabelNamespace)
      {
         service.getCharacteristic(Characteristic.ServiceLabelNamespace)
         .on('get', (callback) => {
            this.getValue(CMD4_ServiceLabelNamespace, callback);
         });
      }
   },

   setupTemperatureSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentTemperature, callback);
      });
      service.getCharacteristic(Characteristic.CurrentTemperature).setProps( {minValue: -100} );

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }
  },

   setupWindowService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetPosition, Characteristic.TargetPosition, callback);
      });
      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue(CMD4_PositionState, callback);
      });

      // Optional
      if (this.holdPosition)
      {
         service.getCharacteristic(Characteristic.HoldPosition)
            .on('set', (value,callback) => {
               this.setValue(value,CMD4_HoldPosition, Characteristic.HoldPosition, callback);
         });
         service.getCharacteristic(Characteristic.HoldPosition)
         .on('get', (callback) => {
            this.getValue(CMD4_HoldPosition, callback);
         });
      }

      // Optional
      if ( this.obstructionDetected )
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue(CMD4_ObstructionDetected, callback);
         });
      }
   },

   setupWindowCoveringService: function (service)
   {
      service.getCharacteristic(Characteristic.CurrentPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentPosition, callback);
      });
      service.getCharacteristic(Characteristic.TargetPosition)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetPosition, Characteristic.TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.TargetPosition)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetPosition, callback);
      });

      service.getCharacteristic(Characteristic.PositionState)
      .on('get', (callback) => {
         this.getValue(CMD4_PositionState, callback);
      });

      // Optional
      if (this.currentHorizontalTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentHorizontalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,CMD4_CurrentHorizontalTiltAngle, callback);
         });
      }

      // Optional
      if (this.targetHorizontalTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetHorizontalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,CMD4_TargetHorizontalTiltAngle, Characteristic.TargetHorizontalTiltAngle, callback);
         });
         service.getCharacteristic(Characteristic.TargetHorizontalTiltAngle)
         .on('get', (callback) => {
            this.getValue(CMD4_TargetHorizontalTiltAngle, callback);
         });
      }

      // Optional
      if (this.currentVerticalTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentVerticalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,CMD4_CurrentVerticalTiltAngle, Characteristic.CurrentHorizontalTiltAngle, callback);
         });
      }

      // Optional
      if (this.targetVerticalTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetVerticalTiltAngle)
            .on('set', (value,callback) => {
               this.setValue(value,CMD4_TargetVerticalTiltAngle, Characteristic.TargetVerticalTiltAngle, callback);
         });
         service.getCharacteristic(Characteristic.VerticalTiltAngle)
         .on('get', (callback) => {
            this.getValue(CMD4_TargetVerticalTiltAngle, callback);
         });
      }

      // Optional
      if ( this.obstructionDetected )
      {
         service.getCharacteristic(Characteristic.ObstructionDetected)
         .on('get', (callback) => {
            this.getValue(CMD4_ObstructionDetected, callback);
         });
      }
   },

   setupBatteryService: function (service)
   {
      service.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', (callback) => {
         this.getValue(CMD4_BatteryLevel, callback);
      });

      service.getCharacteristic(Characteristic.ChargingState)
      .on('get', (callback) => {
         this.getValue(CMD4_ChargingState, callback);
      });

      service.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', (callback) => {
         this.getValue(CMD4_StatusLowBattery, callback);
      });
   },

   setupCarbonDioxideSensorService: function (service)
   {
      service.getCharacteristic(Characteristic.CarbonDioxideDetected)
      .on('get', (callback) => {
         this.getValue(CMD4_CarbonDioxideDetected, callback);
      });

      // Optional
      if (this.statusActive)
      {
         service.getCharacteristic(Characteristic.StatusActive)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusActive, callback);
         });
      }

      // Optional
      if (this.statusFault)
      {
         service.getCharacteristic(Characteristic.StatusFault)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusFault, callback);
         });
      }

      // Optional
      if (this.statusTampered)
      {
         service.getCharacteristic(Characteristic.StatusTampered)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusTampered, callback);
         });
      }

      // Optional
      if (this.statusLowBattery)
      {
         service.getCharacteristic(Characteristic.StatusLowBattery)
         .on('get', (callback) => {
            this.getValue(CMD4_StatusLowBattery, callback);
         });
      }

      // Optional
      if (this.carbonDioxideLevel)
      {
         service.getCharacteristic(Characteristic.CarbonDioxideLevel)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_CarbonDioxideLevel, callback);
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
         this.getValue(CMD4_Mute, callback);
      });
      service.getCharacteristic(Characteristic.Mute)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_Mute, Characteristic.Mute, callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue(CMD4_Volume, callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Volume, Characteristic.Volume, callback);
         });
      }
   },

   setupSpeakerService: function (service)
   {
      service.getCharacteristic(Characteristic.Mute)
      .on('get', (callback) => {
         this.getValue(CMD4_Mute, callback);
      });
      service.getCharacteristic(Characteristic.Mute)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_Mute, Characteristic.Mute, callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue(CMD4_Volume, callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Volume, Characteristic.Volume, callback);
         });
      }
   },

   setupDoorbellService: function (service)
   {
      service.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
      .on('get', (callback) => {
         this.getValue(CMD4_ProgrammableSwitchEventMute, callback);
      });

      // Optional
      if (this.volume)
      {
         service.getCharacteristic(Characteristic.Volume)
         .on('get', (callback) => {
            this.getValue(CMD4_Volume, callback);
         });
         service.getCharacteristic(Characteristic.Volume)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_Volume, Characteristic.Volume, callback);
         });
      }

      // Optional
      if (this.brightness)
      {
         service.getCharacteristic(Characteristic.Brightness)
         .on('get', (callback) => {
            this.getValue(CMD4_Brightness, callback);
         });
      }
   },

   setupFanv2Service: function (service)
   {
      service.getCharacteristic(Characteristic.Active)
      .on('get', (callback) => {
         this.getValue(CMD4_Active, callback);
      });
      service.getCharacteristic(Characteristic.Active)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_Active, Characteristic.Active, callback);
      });

      // Optional V2
      if (this.currentFanState)
      {
         service.getCharacteristic(Characteristic.CurrentFanState)
         .on('get', (callback) => {
            this.getValue(CMD4_CurrentFanState, callback);
         });
      }

      // Optional V2
      if (this.targetFanState)
      {
         service.getCharacteristic(Characteristic.TargetFanState)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetFanState, Characteristic.TargetFanState, callback);
         });

         service.getCharacteristic(Characteristic.TargetFanState)
         .on('get', (callback) => {
            this.getValue(CMD4_TargetFanState, callback);
         });
      }

      // Optional
      if (this.rotationDirection)
      {
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('get', (callback) => {
            this.getValue(CMD4_RotationDirection, callback);
         });
         service.getCharacteristic(Characteristic.RotationDirection)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_RotationDirection, Characteristic.RotationDirection, callback);
         });
      }

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_RotationSpeed, Characteristic.RotationSpeed, callback);
         });
          service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue(CMD4_RotationSpeed, callback);
         });
      }

      // Optional V2
      if (this.lockPhysicalControls)
      {
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_LockPhysicalControls, Characteristic.LockPhysicalControls, callback);
         });

         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('get', (callback) => {
            this.getValue(CMD4_LockPhysicalControls, callback);
         });
      }
   },

   setupSlatService: function (service)
   {
      // Missing from Hap ???
      //service.getCharacteristic(Characteristic.CurrentSlatType)
      //.on('get', (callback) => {
      //   this.getValue(CMD4_CurrentSlatType, callback);
      //});

      service.getCharacteristic(Characteristic.SlatType)
      .on('get', (callback) => {
         this.getValue(CMD4_SlatType, callback);
      });

      // Optional
      if (this.swingMode)
      {
         service.getCharacteristic(Characteristic.SwingMode)
         .on('get', (callback) => {
            this.getValue(CMD4_SwingMode, callback);
         });
         service.getCharacteristic(Characteristic.SwingMode)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_SwingMode, Characteristic.SwingMode, callback);
         });
      }

      // Optional
      if (this.currentTiltAngle)
      {
         service.getCharacteristic(Characteristic.CurrentTiltAngle)
         .on('get', (callback) => {
            this.getValue(CMD4_CurrentTiltAngle, callback);
         });
      }

      // Optional
      if (this.targetTiltAngle)
      {
         service.getCharacteristic(Characteristic.TargetTiltAngle)
         .on('get', (callback) => {
            this.getValue(CMD4_TargetTiltAngle, callback);
         });
         service.getCharacteristic(Characteristic.TargetTiltAngle)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_TargetTiltAngle, Characteristic.TargetTiltAngle, callback);
         });
      }
   },

   setupFilterMaintenanceService: function (service)
   {
      service.getCharacteristic(Characteristic.FilterChangeIndication)
      .on('get', (callback) => {
         this.getValue(CMD4_FilterChangeIndication, callback);
      });

      // Optional
      if (this.filterLifeLevel)
      {
         service.getCharacteristic(Characteristic.FilterLifeLevel)
         .on('get', (callback) => {
            this.getValue(CMD4_FilterLifeLevel, callback);
         });
      }

      // Optional
      if (this.resetFilterIndication)
      {
         service.getCharacteristic(Characteristic.ResetFilterIndication)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_ResetFilterIndication, Characteristic.ResetFilterIndication, callback);
         });
      }
   },

   // Note: Cannot get this one to stop spinning. Hmmm...
   setupAirPurifierService: function (service)
   {
      service.getCharacteristic(Characteristic.Active)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_Active, Characteristic.Active, callback);
      });
      service.getCharacteristic(Characteristic.Active)
      .on('get', (callback) => {
         this.getValue(CMD4_Active, callback);
      });

      service.getCharacteristic(Characteristic.TargetAirPurifierState)
      .on('set', (value,callback) => {
         this.setValue(value,CMD4_TargetAirPurifierState, Characteristic.TargetAirPurifierState, callback);
      });
      service.getCharacteristic(Characteristic.TargetAirPurifierState)
      .on('get', (callback) => {
         this.getValue(CMD4_TargetAirPurifierState, callback);
      });

      service.getCharacteristic(Characteristic.CurrentAirPurifierState)
      .on('get', (callback) => {
         this.getValue(CMD4_CurrentAirPurifierState, callback);
      });

      // Optional
      if (this.rotationSpeed)
      {
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('get', (callback) => {
            this.getValue(CMD4_RotationSpeed, callback);
         });
         service.getCharacteristic(Characteristic.RotationSpeed)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_RotationSpeed, Characteristic.RotationSpeed, callback);
         });
      }

      // Optional
      if (this.swingMode)
      {
         service.getCharacteristic(Characteristic.SwingMode)
         .on('get', (callback) => {
            this.getValue(CMD4_SwingMode, callback);
         });
         service.getCharacteristic(Characteristic.SwingMode)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_SwingMode, Characteristic.SwingMode, callback);
         });
      }

      if (this.LockPhysicalControls)
      {
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('get', (callback) => {
            this.getValue(CMD4_LockPhysicalControls, callback);
         });
         service.getCharacteristic(Characteristic.LockPhysicalControls)
         .on('set', (value,callback) => {
            this.setValue(value,CMD4_LockPhysicalControls, Characteristic.LockPhysicalControls, callback);
         });
      }
   },

   setupServiceLabelService: function (service)
   {
      service.getCharacteristic(Characteristic.ServiceLabelNamespace)
      .on('get', (callback) => {
         this.getValue(CMD4_ServiceLabelNamespace, callback);
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
         case  CMD4_ACC_TYPE_Fan:
         case  CMD4_ACC_TYPE_Fanv1:
         {
            switch ( characteristicString )
            {
               case CMD4_On: // (V1only)
               {
                  this.on = value;
                  break;
               }                              
               case CMD4_RotationDirection: // Optional
               {   
                  this.rotationDirection = value;
                  break;
               }
               case CMD4_RotationSpeed: // Optional
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
               
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});         
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case CMD4_ACC_TYPE_GarageDoorOpener:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentDoorState:
               {   
                  this.currentDoorState = value;                 
                  break;
               }
               case CMD4_TargetDoorState:
               {   
                  this.targetDoorState = value;
                  break;
               }
               case CMD4_ObstructionDetected:
               {   
                  this.obstructionDetected = value;
                  break;
               }
               case CMD4_LockCurrentState: // Optional
               {   
                  this.lockCurrentState = value;
                  break;
               }
               case CMD4_LockTargetState: // Optional
               {   
                  this.lockTargetState = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.currentDoorState});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Lightbulb:
         {
            switch ( characteristicString )
            {
               case CMD4_On:
               {   
                  this.on = value;
                  break;
               }
               case CMD4_Brightness: // Optional
               {   
                  this.brightness = value;
                  break;
               }
               case CMD4_Hue: // Optional
               {   
                  this.hue = value;
                  break;
               }
               case CMD4_Saturation: // Optional
               {   
                  this.saturation = value;
                  break;
               }
               case CMD4_ColorTemperature: // Optional
               {   
                  this.colorTemperature = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {               
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case CMD4_ACC_TYPE_LockManagement:
         {
            switch ( characteristicString )
            {
               case CMD4_LockControlPoint:
               {   
                  this.lockControlPoint = value;
                  break;
               }
               case CMD4_Version:
               {   
                  this.version = value;
                  break;
               }
               case CMD4_Logs: // Optional
               {   
                  this.logs = value;
                  break;
               }
               case CMD4_AudioFeedback: // Optional
               {   
                  this.audioFeedback = value;
                  break;
               }
               case CMD4_LockManagementAutoSecurityTimeout: // Optional
               {   
                  this.lockManagementAutoSecurityTimeout = value;
                  break;
               }
               case CMD4_AdministorOnlyAccess: // Optional
               {   
                  this.administorOnlyAccess = value;
                  break;
               }
               case CMD4_LockLastKnownAction: // Optional
               {   
                  this.lockLastKnownAction = value;
                  break;
               }
               case CMD4_CurrentDoorState: // Optional
               {   
                  this.currentDoorState = value;
                  break;
               }
               case CMD4_MotionDetected: // Optional
               {   
                  this.motionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {               
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.lockControlPoint});
            }
            break;
         }
         case CMD4_ACC_TYPE_LockMechanism:
         {
            switch ( characteristicString )
            {
               case CMD4_LockCurrentState:
               {
                  this.lockCurrentState = value;
                  break;
               }
               case CMD4_LockTargetState:
               {
                  this.lockTargetState = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {             
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.lockCurrentState});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Outlet:
         {
            switch ( characteristicString )
            {
               case CMD4_On:
               {
                  this.on = value;
                  break;
               }
               case CMD4_OutletInUse:
               {
                  this.outletInUse = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         } 
         case  CMD4_ACC_TYPE_Switch:
         {
            switch ( characteristicString )
            {
               case CMD4_On:
               {
                  this.on = value;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                    
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.on});
            }
            break;
         }
         case CMD4_ACC_TYPE_Thermostat:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentHeatingCoolingState:
               {   
                  this.currentHeatingCoolingState = value;
                  break;
               }
               case CMD4_TargetHeatingCoolingState:
               {   
                  this.targetHeatingCoolingState = value;
                  break;
               }
               case CMD4_CurrentTemperature:
               {   
                  this.currentTemperature = value;
                  break;
               }
               case CMD4_TargetTemperature:
               {   
                  this.targetTemperature = value;
                  break;
               }
               case CMD4_TemperatureDisplayUnits:
               {   
                  this.temperatureDisplayUnits = value;
                  break;
               }
               case CMD4_CoolingThresholdTemperature: // Optional
               {   
                  this.coolingThresholdTemperature = value;
                  break;
               }
               case CMD4_CurrentRelativeHumidity: // Optional
               {   
                  this.currentRelativeHumidity = value;
                  break;
               }
               case CMD4_HeatingThresholdTemperature: // Optional
               {   
                  this.heatingThresholdTemperature = value;
                  break;
               }
               case CMD4_TargetRelativeHumidity: // Optional
               {   
                  this.targettRelativeHumidity = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
              
            }
            if ( this.loggingService ) 
            {
               // Eve Room (TempSensor, HumiditySensor and AirQuality Services) 
               // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});

               this.loggingService.addEntry({time: moment().unix(), temp:this.currentTemperature, humidity:this.currentRelativeHumidity, ppm:0});
            }
            break;
         }
         case  CMD4_ACC_TYPE_AirQualitySensor:
         {
            switch ( characteristicString )
            {
               case CMD4_AirQuality:
               {   
                  this.airQuality = value;
                  break;
               }
               case CMD4_OzoneDensity: // Optional
               {   
                  this.OzoneDensity = value;
                  break;
               }
               case CMD4_NitrogenDioxideDensity: // Optional
               {   
                  this.nitrogenDioxideDensity = value;
                  break;
               }
               case CMD4_SulphurDioxideDensity: // Optional
               {   
                  this.sulphurDioxideDensity = value;
                  break;
               }
               case CMD4_PM2_5Density: // Optional
               {   
                  this.PM2_5Density = value;
                  break;
               }
               case CMD4_PM10Density: // Optional
               {   
                  this.PM10Density = value;
                  break;
               }
               case CMD4_VOCDensity: // Optional
               {   
                  this.VOCDensity = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {   
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {
// help
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_SecuritySystem:
         {   
            switch ( characteristicString )
            {
               case CMD4_SecuritySystemCurrentState:
               {   
                  this.securitySystemCurrentState = value;
                  break;
               }
               case CMD4_SecuritySystemTargetState:
               {   
                  this.securitySystemTargetState = value;
                  break;
               }
               case CMD4_SecuritySystemAlarmType: // Optional
               {   
                  this.securitySystemAlarmType = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.securitySystemCurrentState});
            }
            break;
         }
         case  CMD4_ACC_TYPE_CarbonMonoxideSensor:
         {
            switch ( characteristicString )
            {
               case CMD4_CarbonMonoxideDetected:
               {   
                  this.carbonMonoxideDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {   
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               case CMD4_CarbonMonoxideLevel: // Optional
               {
                  this.carbonMonoxideLevel = value;
                  break;
               }
               case CMD4_CarbonMonoxidePeakLevel:
               {
                  this.carbonMonoxidePeakLevel = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {  
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_ContactSensor:
         {
            switch ( characteristicString )
            {
               case CMD4_ContactSensorState:
               {
                  this.contactSensorState = value;
                  break;
               }
               case CMD4_StatusActive:
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Door:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentPosition:
               {
                  this.currentPosition = value;
                  break;
               }
               case CMD4_TargetPosition:
               {
                  this.targetPosition = value;
                  break;
               }
               case CMD4_PositionState:
               {
                  this.positionState = value;
                  break;
               }
               case CMD4_HoldPosition: // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case CMD4_ObstructionDetected: // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  CMD4_ACC_TYPE_HumiditySensor:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentRelativeHumidity:
               {
                  this.currentRelativeHumidity = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {
               // Eve Room (TempSensor, HumiditySensor and AirQuality Services) 
               // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
               
               this.loggingService.addEntry({time: moment().unix(), temp:0, humidity:this.currentRelativeHumidity, ppm:0});
            }
            break;
         }
         case  CMD4_ACC_TYPE_LeakSensor:
         {
            switch ( characteristicString )
            {
               case CMD4_LeakDetected:
               {
                  this.leakDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_LightSensor:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentAmbientLightLevel:
               {
                  this.currentAmbientLightLevel = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_MotionSensor:
         {
            switch ( characteristicString )
            {               
               case CMD4_MotionDetected:
               {
                  this.motionDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                      
               // Eve Motion (MotionSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.motionDetected});
            }
            break;
         }
         case  CMD4_ACC_TYPE_OccupancySensor:
         {
            switch ( characteristicString )
            {                              
               case CMD4_OccupancyDetected:
               {
                  this.occupancyDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                 
               // Eve Motion (MotionSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.occupancyDetected});
            }
            break;
         }
         case  CMD4_ACC_TYPE_SmokeSensor:
         {
            switch ( characteristicString )
            {               
               case CMD4_SmokeDetected:
               {
                  this.smokeDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_StatelessProgrammableSwitch:
         {
            switch ( characteristicString )
            {
               case CMD4_ProgrammableSwitchEvent:
               {
                  this.programmableSwitchEvent = value;
                  break;
               }
               case CMD4_ServiceLabelIndex: // Optional
               {
                  this.serviceLabelIndex = value;
                  break;
               }
               case CMD4_ServiceLabelNamespace: // Optional
               {
                  this.serviceLabelNamespace = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            break;
         }
         case  CMD4_ACC_TYPE_TemperatureSensor:
         {
            switch ( characteristicString )
            {                             
               case CMD4_CurrentTemperature:
               {
                  this.currentTemperature = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {
               // Eve Room (TempSensor, HumiditySensor and AirQuality Services) 
               // i.e. loggingService.addEntry({time: moment().unix(), temp:this.temperature, humidity:this.humidity, ppm:this.ppm});
               
               this.loggingService.addEntry({time: moment().unix(), temp:this.currentTemperature, humidity:0, ppm:0});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Window:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentPosition:
               {
                  this.currentPosition = value;
                  break;
               }
               case CMD4_TargetPosition:
               {
                  this.targetPosition = value;
                  break;
               }
               case CMD4_PositionState:
               {
                  this.positionState = value;
                  break;
               }
               case CMD4_HoldPosition: // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case CMD4_ObstructionDetected: // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  CMD4_ACC_TYPE_WindowCovering:
         {
            switch ( characteristicString )
            {
               case CMD4_TargetPosition:
               {
                  this.targetPosition = value;
                  break;
               }
               case CMD4_CurrentPosition:
               {
                  this.currentPosition = value;
                  break;
               }
               case CMD4_PositionState:
               {
                  this.positionState = value;
                  break;
               }
               case CMD4_HoldPosition: // Optional
               {
                  this.holdPosition = value;
                  break;
               }
               case CMD4_CurrentHorizontalTiltAngle: // Optional
               {
                  this.currentHorizontalTiltAngle = value;
                  break;
               }
               case CMD4_TargetHorizontalTiltAngle: // Optional
               {
                  this.targetHorizontalTiltAngle = value;
                  break;
               }
               case CMD4_CurrentVerticalTiltAngle: // Optional
               {
                  this.currentVerticalTiltAngle = value;
                  break;
               }
               case CMD4_TargetVerticalTiltAngle: // Optional
               {
                  this.targetVerticalTiltAngle = value;
                  break;
               }
               case CMD4_ObstructionDetected: // Optional
               {
                  this.obstructionDetected = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.currentPosition});
            }
            break;
         }
         case  CMD4_ACC_TYPE_BatteryService:
         {
            switch ( characteristicString )
            {
               case CMD4_BatteryLevel:
               {
                  this.batteryLevel = value;
                  break;
               }
               case CMD4_ChargingState:
               {
                  this.chargingState = value;
                  break;
               }
               case CMD4_StatusLowBattery:
               {
                  this.statusLowBattery = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Energy (Outlet service)
               // i.e loggingService.addEntry({time: moment().unix(), power: this.power});
               
               this.loggingService.addEntry({time: moment().unix(), power: this.batteryLevel});
            }
            break;
         }
         case  CMD4_ACC_TYPE_CarbonDioxideSensor:
         {
            switch ( characteristicString )
            {                            
               case CMD4_CarbonDioxideDetected:
               {
                  this.carbonDioxideDetected = value;
                  break;
               }
               case CMD4_StatusActive: // Optional
               {
                  this.statusActive = value;
                  break;
               }
               case CMD4_StatusFault: // Optional
               {   
                  this.statusFault = value;
                  break;
               }
               case CMD4_StatusTampered: // Optional
               {   
                  this.statusTampered = value;
                  break;
               }
               case CMD4_StatusLowBattery: // Optional
               {   
                  this.statusLowBattery = value;
                  break;
               }
               case CMD4_CarbonDioxideLevel: // Optional
               {
                  this.carbonDioxideLevel = value;
                  break;
               }
               case CMD4_CarbonDioxidePeakLevel: // Optional
               {
                  this.carbonDioxidePeakLevel = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.statusActive});
            }
            break;
         }
         case  CMD4_ACC_TYPE_CameraRTPStreamManagement:
         {
            break;
         }
         case  CMD4_ACC_TYPE_Microphone:
         {
            switch ( characteristicString)
            {
               case CMD4_Mute:
               {
                  this.mute = value;
                  break;
               }
               case CMD4_Volume:
               {
                  this.volume = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.mute});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Speaker:
         {
            switch ( characteristicString )
            {
               case CMD4_Mute:
               {
                  this.mute = value;
                  break;
               }
               case CMD4_Volume:
               {
                  this.volume = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.mute});
            }
            break;
         }
         case  CMD4_ACC_TYPE_DoorBell:
         {
            switch ( characteristicString )
            {
               case CMD4_ProgrammableSwitchEvent:
               {
                  this.programmableSwitchEvent = value;
                  break;
               }
               case CMD4_Volume: // Optional
               {
                  this.volume = value;
                  break;
               }
               case CMD4_Brightness: // Optional
               {
                  this.brightness = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
                  
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.volume});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Fanv2:
         {
            switch ( characteristicString )
            {
               case CMD4_On: // (V1only)
               {
                  this.on = value;
                  break;
               }
               case CMD4_Active: // (V2)
               {
                  this.active = value;
                  break;
               }
               case CMD4_CurrentFanState: // Optional (V2)
               {   
                  this.currentFanState = value;
                  break;
               }
               case CMD4_TargetFanState: // Optional (V2)
               {   
                  this.targetFanState = value;
                  break;
               }
               case CMD4_RotationDirection: // Optional
               {   
                  this.rotationDirection = value;
                  break;
               }
               case CMD4_RotationSpeed: // Optional
               {  
                  this.rotationSpeed = value;
                  break;
               }
               case CMD4_SwingMode: // Optional (V2)
               {    
                  this.swingMode = value;
                  break;
               }
               case CMD4_LockPhysicalControls: // Optional (V2)
               {
                  this.lockPhysicalControls = value;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.active});
            }
            break;
         }
         case  CMD4_ACC_TYPE_Slat:
         {
            switch ( characteristicString )
            {
               case CMD4_CurrentSlatType:
               {
                  this.currentSlatType = value;
                  break;
               }
               case CMD4_SlatType:
               {
                  this.slatType = value;
                  break;
               }
               case CMD4_SwingMode: // Optional
               {
                  this.swingMode = value;
                  break;
               }
               case CMD4_CurrentTiltAngle: // Optional
               {
                  this.currentTiltAngle = value;
                  break;
               }
               case CMD4_TargetTiltAngle: // Optional
               {
                  this.targetTiltAngle = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.currentSlatState});
            }
            break;
         }
         case  CMD4_ACC_TYPE_FilterMaintenance:
         {
            switch ( characteristicString )
            {
               case CMD4_FilterChangeIndication:
               {
                  this.filterChangeIndication = value;
                  break;
               }
               case CMD4_FilterLifeLevel: // Optional
               {
                  this.filterLifeLevel = value;
                  break;
               }
               case CMD4_ResetFilterIndication: // Optional
               {
                  this.resetFilterIndication = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.filterChangeIndication});
            }
            break;
         }
         case  CMD4_ACC_TYPE_AirPurifier:
         {
            switch ( characteristicString )
            {
               case CMD4_Active:
               {
                  this.active = value;
                  break;
               }
               case CMD4_CurrentAirPurifierState:
               {
                  this.currentAirPurifierState = value;
                  break;
               }
               case CMD4_TargetAirPurifierState:
               {
                  this.targetAirPurifierState = value;
                  break;
               }
               case CMD4_RotationSpeed: // Optional
               {
                  this.rotationSpeed = value;
                  break;
               }
               case CMD4_SwingMode: // Optional
               {
                  this.swingMode = value;
                  break;
               }
               case CMD4_LockPhysicalControls: // Optional
               {
                  this.lockPhysicalControls = value;
                  break;
               }
               default:
                  this.log("Cmd4 Warning: Unknown characteritic '%s' to update for accessory '%s'", characteristicString, this.name);
               
            }
            if ( this.loggingService ) 
            {                       
               // Eve Door (ContactSensor service)
               // i.e loggingService.addEntry({time: moment().unix(), status: this.status});
               
               this.loggingService.addEntry({time: moment().unix(), status: this.active});
            }
            break;
         }
         case  CMD4_ACC_TYPE_ServiceLabel:
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

