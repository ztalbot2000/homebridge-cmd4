'use strict';
const exec = require("child_process").exec;
const moment = require('moment');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;
const versionCheck = require('github-version-checker');
const FgMagenta = "\x1b[35m"
const FgBlack = "\x1b[30m"


const versionCheckOptions = {
  repo: 'homebridge-cmd4', 
  owner: 'ztalbot2000', 
  currentVersion: require('./package.json').version,
  fetchTags: true 
};

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
      
var CMD4_DEVICE_TYPE_ENUM =
{
   AccessoryInformation:                0,
   AirPurifier:                         1,
   AirQualitySensor:                    2,
   BatteryService:                      3,
   BridgeConfiguration:                 4,
   BridgingState:                       5,
   CameraControl:                       6,
   CameraRTPStreamManagement:           7,
   CarbonDioxideSensor:                 8,
   CarbonMonoxideSensor:                9,
   ContactSensor:                      10,
   Door:                               11,
   DoorBell:                           12,
   Fan:                                13,
   Fanv1:                              14,
   Fanv2:                              15,
   Faucet:                             16,
   FilterMaintenance:                  17,
   GarageDoorOpener:                   18,
   HeaterCooler:                       19,
   HumidifierDehumidifier:             20,
   HumiditySensor:                     21,
   InputSource:                        22,
   IrrigationSystem:                   23,
   LeakSensor:                         24,
   LightSensor:                        25,
   Lightbulb:                          26,
   LockManagement:                     27,
   LockMechanism:                      28,
   Microphone:                         29,
   MotionSensor:                       30,
   OccupancySensor:                    31,
   Outlet:                             32,
   Pairing:                            33,
   ProtocolInformation:                34,
   Relay:                              35,
   SecuritySystem:                     36,
   ServiceLabel:                       37,
   Slat:                               38,
   SmokeSensor:                        39,
   Speaker:                            40,
   StatefulProgrammableSwitch:         41,
   StatelessProgrammableSwitch:        42,
   Switch:                             43,
   Television:                         44,
   TelevisionSpeaker:                  45,
   TemperatureSensor:                  46,
   Thermostat:                         47,
   TimeInformation:                    48,
   TunneledBTLEAccessoryService:       49,
   Valve:                              50,
   Window:                             51,
   WindowCovering:                     52,
   EOL:                                53,

   properties:{}
};


var FakeGatoHistoryService;
var Accessory;
var Service; 
var Characteristic ;
var UUIDGen;
var foundAccessories = [];

var CMD4_ACC_TYPE_ENUM =
{
   AccessoryFlags:                        0,
   Active:                                1,
   ActiveIdentifier:                      2,
   AccessoryIdentifier:                   3,
   AdministratorOnlyAccess:               4,
   AirParticulateDensity:                 5,
   AirParticulateSize:                    6,
   AirQuality:                            7,
   AudioFeedback:                         8,
   BatteryLevel:                          9,
   Brightness:                            10,
   CarbonDioxideDetected:                 11,
   CarbonDioxideLevel:                    12,
   CarbonDioxidePeakLevel:                13,
   CarbonMonoxideDetected:                14,
   CarbonMonoxideLevel:                   15,
   CarbonMonoxidePeakLevel:               16,
   Category:                              17,
   ChargingState:                         18,
   ClosedCaptions:                        19,
   ColorTemperature:                      20,
   ConfiguredName:                        21,
   ConfigureBridgedAccessoryStatus:       22,
   ConfigureBridgedAccessory:             23,
   ContactSensorState:                    24,
   CoolingThresholdTemperature:           25,
   CurrentAirPurifierState:               26,
   CurrentAmbientLightLevel:              27,
   CurrentDoorState:                      28,
   CurrentFanState:                       29,
   CurrentHeaterCoolerState:              30,
   CurrentHeatingCoolingState:            31,
   CurrentHorizontalTiltAngle:            32,
   CurrentHumidifierDehumidifierState:    33,
   CurrentMediaState:                     34,
   CurrentPosition:                       35,
   CurrentRelativeHumidity:               36,
   CurrentSlatState:                      37,
   CurrentTemperature:                    38,
   CurrentTiltAngle:                      39,
   CurrentTime:                           40,
   CurrentVerticalTiltAngle:              41,
   CurrentVisibilityState:                42,
   DayoftheWeek:                          43,
   DigitalZoom:                           44,
   DiscoverBridgedAccessories:            45,
   DiscoveredBridgedAccessories:          46,
   DisplayOrder:                          47,
   FilterChangeIndication:                48,
   FilterLifeLevel:                       49,
   FirmwareRevision:                      50,
   HardwareRevision:                      51,
   HeatingThresholdTemperature:           52,
   HoldPosition:                          53,
   Hue:                                   54,
   Identify:                              55,
   Identifier:                            56,
   ImageMirroring:                        57,
   ImageRotation:                         58,
   InputDeviceType:                       59,
   InputSourceType:                       60,
   InUse:                                 61,
   IsConfigured:                          62,
   LeakDetected:                          63,
   LinkQuality:                           64,
   LockControlPoint:                      65,
   LockCurrentState:                      66,
   LockLastKnownAction:                   67,
   LockManagementAutoSecurityTimeout:     68,
   LockPhysicalControls:                  69,
   LockTargetState:                       70,
   Logs:                                  71,
   Manufacturer:                          72,
   Model:                                 73,
   MotionDetected:                        74,
   Mute:                                  75,
   Name:                                  76,
   NightVision:                           77,
   NitrogenDioxideDensity:                78,
   ObstructionDetected:                   79,
   OccupancyDetected:                     80,
   On:                                    81,
   OpticalZoom:                           82,
   OutletInUse:                           83,
   OzoneDensity:                          84,
   PairSetup:                             85,
   PairVerify:                            86,
   PairingFeatures:                       87,
   PairingPairings:                       88,
   PictureMode:                           89,
   PM10Density:                           90,
   PM2_5Density:                          91,
   PositionState:                         92,
   PowerModeSelection:                    93,
   ProgramMode:                           94,
   ProgrammableSwitchEvent:               95,
   ProgrammableSwitchOutputState:         96,
   Reachable:                             97,
   RelativeHumidityDehumidifierThreshold: 98,
   RelativeHumidityHumidifierThreshold:   99,
   RelayEnabled:                          100,
   RelayState:                            101,
   RelayControlPoint:                     102,
   RemainingDuration:                     103,
   RemoteKey:                             104,
   ResetFilterIndication:                 105,
   RotationDirection:                     106,
   RotationSpeed:                         107,
   Saturation:                            108,
   SecuritySystemAlarmType:               109,
   SecuritySystemCurrentState:            110,
   SecuritySystemTargetState:             111,
   SelectedRTPStreamConfiguration:        112,
   SerialNumber:                          113,
   ServiceLabelIndex:                     114,
   ServiceLabelNamespace:                 115,
   SetDuration:                           116,
   SetupEndpoints:                        117,
   SlatType:                              118,
   SleepDiscoveryMode:                    119,
   SmokeDetected:                         120,
   StatusActive:                          121,
   StatusFault:                           122,
   StatusJammed:                          123,
   StatusLowBattery:                      124,
   StatusTampered:                        125,
   StreamingStatus:                       126,
   SulphurDioxideDensity:                 127,
   SupportedAudioStreamConfiguration:     128,
   SupportedRTPConfiguration:             129,
   SupportedVideoStreamConfiguration:     130,
   SwingMode:                             131,
   TargetAirPurifierState:                132,
   TargetAirQuality:                      133,
   TargetDoorState:                       134,
   TargetFanState:                        135,
   TargetHeaterCoolerState:               136,
   TargetHeatingCoolingState:             137,
   TargetHorizontalTiltAngle:             138,
   TargetHumidifierDehumidifierState:     139,
   TargetMediaState:                      140,
   TargetPosition:                        141,
   TargetRelativeHumidity:                142,
   TargetSlatState:                       143,
   TargetTemperature:                     144,
   TargetTiltAngle:                       145,
   TargetVerticalTiltAngle:               146,
   TargetVisibilityState:                 147,
   TemperatureDisplayUnits:               148,
   TimeUpdate:                            149,
   TunneledAccessoryAdvertising:          150,
   TunneledAccessoryConnected:            151,
   TunneledAccessoryStateNumber:          152,
   TunnelConnectionTimeout:               153,
   ValveType:                             154,
   Version:                               155,
   VOCDensity:                            156,
   Volume:                                157,
   VolumeControlType:                     158,
   VolumeSelector:                        159,
   WaterLevel:                            160,
   EOL:                                   161,
   properties: {}
};


module.exports =
{ 
  default: function (homebridge)
  {
   
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

   
   // Fill in the properties of all possible characteristics
   CMD4_ACC_TYPE_ENUM.properties =
   {
      0:   { name: "AccessoryFlags", 
             characteristic: Characteristic.AccessoryFlags,
             values: {} 
           },
      1:   { name: "Active",
             characteristic:Characteristic.Active,
             values: {"INACTIVE": Characteristic.Active.INACTIVE,
                      "ACTIVE": Characteristic.Active.ACTIVE
                     } 
           },
      2:   { name: "ActiveIdentifier",
             characteristic: Characteristic.ActiveIdentifier,
             values: {} 
           },
      3:   { name: "AccessoryIdentifier",
             characteristic: Characteristic.AccessoryIdentifier,
             values: {} 
           },
      4:   { name: "AdministratorOnlyAccess",
             characteristic: Characteristic.AdministratorOnlyAccess,
             values: {"FALSE": false,
                      "TRUE":   true
                     } 
           },
      5:   { name: "AirParticulateDensity",
             characteristic: Characteristic.AirParticulateDensity,
             values: {} 
           },
      6:   { name: "AirParticulateSize",
             characteristic: Characteristic.AirParticulateSize,
             values: {"_2_5_M": Characteristic.AirParticulateSize._2_5_M,
                      "_10_M":  Characteristic.AirParticulateSize._10_M
                     } 
           },
      7:   { name: "AirQuality",
             characteristic: Characteristic.AirQuality,
             values: {"UNKNOWN":   Characteristic.AirQuality.UNKNOWN,
                      "EXCELLENT": Characteristic.AirQuality.EXCELLENT,
                      "GOOD":      Characteristic.AirQuality.GOOD,
                      "FAIR":      Characteristic.AirQuality.FAIR,
                      "INFERIOR":  Characteristic.AirQuality.INFERIOR,
                      "POOR":      Characteristic.AirQuality.POOR
                     } 
           },
      8:   { name: "AudioFeedback",
             characteristic: Characteristic.AudioFeedback,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      9:   { name: "BatteryLevel",
             characteristic: Characteristic.BatteryLevel,
             values: {} 
           },
      10:  { name: "Brightness",
             characteristic: Characteristic.Brightness,
             values: {} 
           },
      11:  { name: "CarbonDioxideDetected",
             characteristic: Characteristic.CarbonDioxideDetected,
             values: {"CO2_LEVELS_NORMAL":
                      Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL,
                      "CO2_LEVELS_ABNORMAL":
                      Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
                     } 
           },
      12:  { name: "CarbonDioxideLevel",
             characteristic: Characteristic.CarbonDioxideLevel,
             values: {} 
           },
      13:  { name: "CarbonDioxidePeakLevel",
             characteristic: Characteristic.CarbonDioxidePeakLevel,
             values: {} 
           },
      14:  { name: "CarbonMonoxideDetected",
             characteristic: Characteristic.CarbonMonoxideDetected,
             values: {"CO_LEVELS_NORMAL":
                      Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL,
                      "CO_LEVELS_ABNORMAL":
                      Characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL
                     } 
           },
      15:  { name: "CarbonMonoxideLevel",
             characteristic: Characteristic.CarbonMonoxideLevel,
             values: {} 
           },
      16:  { name: "CarbonMonoxidePeakLevel",
             characteristic: Characteristic.CarbonMonoxidePeakLevel,
             values: {} 
           },
      17:  { name: "Category",
             characteristic: Characteristic.Category,
             values: {} 
           },
      18:  { name: "ChargingState",
             characteristic: Characteristic.ChargingState,
             values: {"NOT_CHARGING": 
                      Characteristic.ChargingState.NOT_CHARGING,
                      "CHARGING": 
                      Characteristic.ChargingState.CHARGING,
                      "NOT_CHARGEABLE":
                      Characteristic.ChargingState.NOT_CHARGEABLE
                     } 
           },
      19:  { name: "ClosedCaptions",
             characteristic: Characteristic.ClosedCaptions,
             values: {"DISABLED": Characteristic.ClosedCaptions.DISABLED,
                      "ENABLED":  Characteristic.ClosedCaptions.ENABLED
                     } 
           },
      20:  { name: "ColorTemperature",
             characteristic: Characteristic.ColorTemperature,
             values: {} 
           },
      21:  { name: "ConfiguredName",
             characteristic: Characteristic.ConfiguredName,
             values: {} 
           },
      22:  { name: "ConfigureBridgedAccessoryStatus",
             characteristic: Characteristic.ConfigureBridgedAccessoryStatus,
             values: {} 
           },
      23:  { name: "ConfigureBridgedAccessory",
             characteristic: Characteristic.ConfigureBridgedAccessory,
             values: {} 
           },
      24:  { name: "ContactSensorState",
             characteristic: Characteristic.ContactSensorState,
             values: {"CONTACT_DETECTED":
                      Characteristic.ContactSensorState.CONTACT_DETECTED,
                      "CONTACT_NOT_DETECTED":
                      Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                     } 
           },
      25:  { name: "CoolingThresholdTemperature",
             characteristic: Characteristic.CoolingThresholdTemperature ,
             values: {} 
           },
      26:  { name: "CurrentAirPurifierState",
             characteristic: Characteristic.CurrentAirPurifierState,
             values: 
                {"INACTIVE": 
                     Characteristic.CurrentAirPurifierState.INACTIVE,
                 "IDLE":     
                     Characteristic.CurrentAirPurifierState.IDLE,
                 "PURIFYING_AIR":
                     Characteristic.CurrentAirPurifierState.PURIFYING_AIR
                } 
           },
      27:  { name: "CurrentAmbientLightLevel",
             characteristic: Characteristic.CurrentAmbientLightLevel,
             values: {} 
           },
      28:  { name: "CurrentDoorState",
             characteristic: Characteristic.CurrentDoorState ,
             values: {"OPEN":    Characteristic.CurrentDoorState.OPEN,
                      "CLOSED":  Characteristic.CurrentDoorState.CLOSED,
                      "OPENING": Characteristic.CurrentDoorState.OPENING,
                      "CLOSING": Characteristic.CurrentDoorState.CLOSING,
                      "STOPPED": Characteristic.CurrentDoorState.STOPPED
                     } 
           },
      29:  { name: "CurrentFanState",
             characteristic: Characteristic.CurrentFanState ,
             values: {"INACTIVE":    Characteristic.CurrentFanState.INACTIVE,
                      "IDLE":        Characteristic.CurrentFanState.IDLE,
                      "BLOWING_AIR": Characteristic.CurrentFanState.BLOWING_AIR
                     } 
           },
      30:  { name: "CurrentHeaterCoolerState",
             characteristic: Characteristic.CurrentHeaterCoolerState ,
             values: 
                {"INACTIVE": Characteristic.CurrentHeaterCoolerState.INACTIVE,
                 "IDLE":     Characteristic.CurrentHeaterCoolerState.IDLE,
                 "HEATING":  Characteristic.CurrentHeaterCoolerState.HEATING,
                 "COOLING":  Characteristic.CurrentHeaterCoolerState.COOLING
                } 
           },
      31:  { name: "CurrentHeatingCoolingState",
             characteristic: Characteristic.CurrentHeatingCoolingState,
             values: 
                {"OFF":  Characteristic.CurrentHeatingCoolingState.OFF,
                 "HEAT": Characteristic.CurrentHeatingCoolingState.HEAT,
                 "COOL": Characteristic.CurrentHeatingCoolingState.COOL
                } 
           },
      32:  { name: "CurrentHorizontalTiltAngle",
             characteristic: Characteristic.CurrentHorizontalTiltAngle ,
             values: {} 
           },
      33:  { name: "CurrentHumidifierDehumidifierState",
             characteristic: Characteristic.CurrentHumidifierDehumidifierState,
             values: 
             {"INACTIVE":
                 Characteristic.CurrentHumidifierDehumidifierState.INACTIVE,
              "IDLE":
                 Characteristic.CurrentHumidifierDehumidifierState.IDLE,                
              "HUMIDIFYING":
                 Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
              "DEHUMIDIFYING":
                 Characteristic.CurrentHumidifierDehumidifierState.DEHUMIDIFYING
             } 
           },
      34:  { name: "CurrentMediaState",
             characteristic: Characteristic.CurrentMediaState,
             values: {} 
           },
      35:  { name: "CurrentPosition",
             characteristic: Characteristic.CurrentPosition,
             values: {} 
           },
      36:  { name: "CurrentRelativeHumidity",
             characteristic: Characteristic.CurrentRelativeHumidity,
             values: {} 
           },
      37:  { name: "CurrentSlatState",
             characteristic: Characteristic.CurrentSlatState,
             values: {"FIXED":    Characteristic.CurrentSlatState.FIXED,
                      "JAMMED":   Characteristic.CurrentSlatState.JAMMED,
                      "SWINGING": Characteristic.CurrentSlatState.SWINGING
                     } 
           },
      38:  { name: "CurrentTemperature",
             characteristic: Characteristic.CurrentTemperature,
             values: {} 
           },
      39:  { name: "CurrentTiltAngle",
             characteristic: Characteristic.CurrentTiltAngle,
             values: {} 
           },
      40:  { name: "CurrentTime",
             characteristic: Characteristic.CurrentTime,
             values: {} 
           },
      41:  { name: "CurrentVerticalTiltAngle",
             characteristic: Characteristic.CurrentVerticalTiltAngle,
             values: {} 
           },
      42:  { name: "CurrentVisibilityState",   
             characteristic: Characteristic.CurrentVisibilityState,
             values: {"SHOWN": Characteristic.CurrentVisibilityState.SHOWN,
                      "HIDDEN": Characteristic.CurrentVisibilityState.HIDDEN
                     } 
           },
      43:  { name: "DayoftheWeek",
             characteristic: Characteristic.DayoftheWeek,
             values: {} 
           },
      44:  { name: "DigitalZoom",
             characteristic: Characteristic.DigitalZoom,
             values: {} 
           },
      45:  { name: "DiscoverBridgedAccessories",
             characteristic: Characteristic.DiscoverBridgedAccessories,
             values: {"START_DISCOVERY": Characteristic.DiscoverBridgedAccessories.START_DISCOVERY,
                      "STOP_DISCOVERY":  Characteristic.DiscoverBridgedAccessories.STOP_DISCOVERY 
                     } 
           },
      46:  { name: "DiscoveredBridgedAccessories",
             characteristic: Characteristic.DiscoveredBridgedAccessories,
             values: {} 
           },
      47:  { name: "DisplayOrder",
             characteristic: Characteristic.DisplayOrder,
             values: {} 
           },
      48:  { name: "FilterChangeIndication",
             characteristic: Characteristic.FilterChangeIndication,
             values:
                {"FILTER_OK": 
                   Characteristic.FilterChangeIndication.FILTER_OK,
                 "CHANGE_FILTER":
                   Characteristic.FilterChangeIndication.CHANGE_FILTER
                } 
           },
      49:  { name: "FilterLifeLevel",
             characteristic: Characteristic.FilterLifeLevel ,
             values: {} 
           },
      50:  { name: "FirmwareRevision",
             characteristic: Characteristic.FirmwareRevision ,
             values: {} 
           },
      51:  { name: "HardwareRevision",
             characteristic: Characteristic.HardwareRevision,
             values: {} 
           },
      52:  { name: "HeatingThresholdTemperature",
             characteristic: Characteristic.HeatingThresholdTemperature,
             values: {} 
           },
      53:  { name: "HoldPosition",
             characteristic: Characteristic.HoldPosition ,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      54:  { name: "Hue",
             characteristic: Characteristic.Hue,
             values: {} 
           },
      55:  { name: "Identify",
             characteristic: Characteristic.Identify,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      56:  { name: "Identifier",
             characteristic: Characteristic.Identifier,
             values: {} 
           },
      57:  { name: "ImageMirroring",
             characteristic: Characteristic.ImageMirroring,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      58:  { name: "ImageRotation",
             characteristic: Characteristic.ImageRotation,
             values: {} 
           },
      59:  { name: "InputDeviceType",
             characteristic: Characteristic.InputDeviceType,
             values: 
                {"OTHER": 
                    Characteristic.InputDeviceType.OTHER,
                 "TV": 
                    Characteristic.InputDeviceType.TV,
                 "RECORDING": 
                    Characteristic.InputDeviceType.RECORDING,
                 "TUNER": 
                    Characteristic.InputDeviceType.TUNER,
                 "PLAYBACK":
                    Characteristic.InputDeviceType.PLAYBACK,
                 "AUDIO_SYSTEM":
                    Characteristic.InputDeviceType.AUDIO_SYSTEM
                 } 
           },
      60:  { name: "InputSourceType",
             characteristic: Characteristic.InputSourceType,
             values: {"OTHER": 
                        Characteristic.InputSourceType.OTHER,
                      "HOME_SCREEN": 
                        Characteristic.InputSourceType.HOME_SCREEN,
                      "TUNER": 
                        Characteristic.InputSourceType.TUNER,
                      "HDMI": 
                        Characteristic.InputSourceType.HDMI,
                      "COMPOSITE_VIDEO":
                        Characteristic.InputSourceType.COMPOSITE_VIDEO,
                      "S_VIDEO": 
                        Characteristic.InputSourceType.S_VIDEO,
                      "COMPONENT_VIDEO":
                        Characteristic.InputSourceType.COMPONENT_VIDEO,
                      "DVI": 
                        Characteristic.InputSourceType.DVI,
                      "AIRPLAY":
                        Characteristic.InputSourceType.AIRPLAY,
                      "USB": 
                        Characteristic.InputSourceType.USB,
                      "APPLICATION": 
                        Characteristic.InputSourceType.APPLICATION
                     } 
           },
      61:  { name: "InUse",
             characteristic: Characteristic.InUse,
             values: {"NOT_IN_USE": Characteristic.InUse.NOT_IN_USE,
                      "IN_USE":     Characteristic.InUse.IN_USE
                     } 
           },
      62:  { name: "IsConfigured",
             characteristic: Characteristic.IsConfigured,
             values: 
                {"NOT_CONFIGURED": Characteristic.IsConfigured.NOT_CONFIGURED,
                 "CONFIGURED":     Characteristic.IsConfigured.CONFIGURED
                 } 
           },
      63:  { name: "LeakDetected",
             characteristic: Characteristic.LeakDetected,
             values: 
                {"LEAK_NOT_DETECTED":
                    Characteristic.LeakDetected.LEAK_NOT_DETECTED,
                 "LEAK_DETECTED":
                    Characteristic.LeakDetected.LEAK_DETECTED
                } 
           },
      64:  { name: "LinkQuality",
             characteristic: Characteristic.LinkQuality,
             values: {} 
           },
      65:  { name: "LockControlPoint",
             characteristic: Characteristic.LockControlPoint,
             values: {} 
           },
      66:  { name: "LockCurrentState",
             characteristic: Characteristic.LockCurrentState,
             values: {"UNSECURED": Characteristic.LockCurrentState.UNSECURED,
                      "SECURED":   Characteristic.LockCurrentState.SECURED,
                      "JAMMED":    Characteristic.LockCurrentState.JAMMED,
                      "UNKNOWN":   Characteristic.LockCurrentState.UNKNOWN
                     } 
           },
      67:  { name: "LockLastKnownAction",
             characteristic: Characteristic.LockLastKnownAction,
             values:
             {"SECURED_PHYSICALLY_INTERIOR":
                 Characteristic.LockLastKnownAction.SECURED_PHYSICALLY_INTERIOR,
              "UNSECURED_PHYSICALLY_INTERIOR":
                 Characteristic.LockLastKnownAction.UNSECURED_PHYSICALLY_INTERIOR,
              "SECURED_PHYSICALLY_EXTERIOR":
                 Characteristic.LockLastKnownAction.SECURED_PHYSICALLY_EXTERIOR,
              "UNSECURED_PHYSICALLY_EXTERIOR":
                 Characteristic.LockLastKnownAction.UNSECURED_PHYSICALLY_EXTERIOR,
              "SECURED_BY_KEYPAD":
                 Characteristic.LockLastKnownAction.SECURED_BY_KEYPAD,
              "UNSECURED_BY_KEYPAD":
                 Characteristic.LockLastKnownAction.UNSECURED_BY_KEYPAD,
              "SECURED_REMOTELY":
                 Characteristic.LockLastKnownAction.SECURED_REMOTELY,
              "UNSECURED_REMOTELY":
                 Characteristic.LockLastKnownAction.UNSECURED_REMOTELY,
              "SECURED_BY_AUTO_SECURE_TIMEOUT":
                 Characteristic.LockLastKnownAction.SECURED_BY_AUTO_SECURE_TIMEOUT
             } 
           },
      68:  { name: "LockManagementAutoSecurityTimeout",
             characteristic: Characteristic.LockManagementAutoSecurityTimeout,
             values: {} 
           },
      69:  { name: "LockPhysicalControls",
             characteristic: Characteristic.LockPhysicalControls,
             values: 
                {"CONTROL_LOCK_DISABLED":
                    Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED,
                 "CONTROL_LOCK_ENABLED":
                    Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED
                 } 
           },
      70:  { name: "LockTargetState",
             characteristic: Characteristic.LockTargetState,
             values: {"UNSECURED": Characteristic.LockTargetState.UNSECURED,
                      "SECURED": Characteristic.LockTargetState.SECURED
                     } 
           },
      71:  { name: "Logs",
             characteristic: Characteristic.Logs,
             values: {} 
           },
      72:  { name: "Manufacturer",
             characteristic: Characteristic.Manufacturer,
             values: {} 
           },
      73:  { name: "Model",
             characteristic: Characteristic.Model,
             values: {} 
           },
      74:  { name: "MotionDetected",
             characteristic: Characteristic.MotionDetected,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      75:  { name: "Mute",
             characteristic: Characteristic.Mute,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      76:  { name: "Name",
             characteristic: Characteristic.Name,
             values: {} 
           },
      77:  { name: "NightVision",
             characteristic: Characteristic.NightVision ,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      78:  { name: "NitrogenDioxideDensity",
             characteristic: Characteristic.NitrogenDioxideDensity ,
             values: {} 
           },
      79:  { name: "ObstructionDetected",
             characteristic: Characteristic.ObstructionDetected,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      80:  { name: "OccupancyDetected",
             characteristic: Characteristic.OccupancyDetected,
             values: 
                {"OCCUPANCY_NOT_DETECTED":
                    Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
                 "OCCUPANCY_DETECTED":
                     Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
                } 
           },
      81:  { name: "On",
             characteristic: Characteristic.On,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      82:  { name: "OpticalZoom",
             characteristic: Characteristic.OpticalZoom,
             values: {} 
           },
      83:  { name: "OutletInUse",
             characteristic: Characteristic.OutletInUse,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      84:  { name: "OzoneDensity",
             characteristic: Characteristic.OzoneDensity,
             values: {} 
           },
      85:  { name: "PairSetup",
             characteristic: Characteristic.PairSetup,
             values: {} 
           },
      86:  { name: "PairVerify",
             characteristic: Characteristic.PairVerify,
             values: {} 
           },
      87:  { name: "PairingFeatures",
             characteristic: Characteristic.PairingFeatures,
             values: {} 
           },
      88:  { name: "PairingPairings",
             characteristic: Characteristic.PairingPairings,
             values: {} 
           },
      89:  { name: "PictureMode",
             characteristic: Characteristic.PictureMode,
             values: 
                {"OTHER":           Characteristic.PictureMode.OTHER,
                 "STANDARD":        Characteristic.PictureMode.STANDARD,
                 "CALIBRATED":      Characteristic.PictureMode.CALIBRATED,
                 "CALIBRATED_DARK": Characteristic.PictureMode.CALIBRATED_DARK,
                 "VIVID":           Characteristic.PictureMode.VIVID,
                 "GAME":            Characteristic.PictureMode.GAME,
                 "COMPUTER":        Characteristic.PictureMode.COMPUTER,
                 "CUSTOM":          Characteristic.PictureMode.CUSTOM
                } 
           },
      90:  { name: "PM10Density",
             characteristic: Characteristic.PM10Density,
             values: {} 
           },
      91:  { name: "PM2_5Density",
             characteristic: Characteristic.PM2_5Density,
             values: {} 
           },
      92:  { name: "PositionState",
             characteristic: Characteristic.PositionState,
             values: {"DECREASING": Characteristic.PositionState.DECREASING,
                      "INCREASING": Characteristic.PositionState.INCREASING,
                      "STOPPED":    Characteristic.PositionState.STOPPED
                     } 
           },
      93:  { name: "PowerModeSelection",
             characteristic: Characteristic.PowerModeSelection ,
             values: {"SHOW": Characteristic.PowerModeSelection.SHOW,
                      "HIDE": Characteristic.PowerModeSelection.HIDE
                     } 
           },
      94:  { name: "ProgramMode",
             characteristic: Characteristic.ProgramMode,
             values:
                {"NO_PROGRAM_SCHEDULED":
                   Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED,
                 "PROGRAM_SCHEDULED":
                    Characteristic.ProgramMode.PROGRAM_SCHEDULED,
                 "PROGRAM_SCHEDULED_MANUAL_MODE_":
                     Characteristic.ProgramMode.PROGRAM_SCHEDULED_MANUAL_MODE_
                } 
           },
      95:  { name: "ProgrammableSwitchEvent",
             characteristic: Characteristic.ProgrammableSwitchEvent,
             values: {"SINGLE_PRESS": Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
                      "DOUBLE_PRESS": Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS,
                      "LONG_PRESS":   Characteristic.ProgrammableSwitchEvent.LONG_PRESS
                     } 
           },
      96:  { name: "ProgrammableSwitchOutputState",
             characteristic: Characteristic.ProgrammableSwitchOutputState,
             values: {} 
           },
           
           
      97:  { name: "Reachable",
             characteristic: Characteristic.Reachable,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
                  },
      98:  { name: "RelativeHumidityDehumidifierThreshold",
             characteristic: Characteristic.RelativeHumidityDehumidifierThreshold,
             values: {} 
           },
      99:  { name: "RelativeHumidityHumidifierThreshold",
             characteristic: Characteristic.RelativeHumidityHumidifierThreshold,
             values: {} 
           },
      100: { name: "RelayEnabled",
             characteristic: Characteristic.RelayEnabled,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      101: { name: "RelayState",
             characteristic: Characteristic.RelayState,
             values: {} 
           },
      102: { name: "RelayControlPoint",
             characteristic: Characteristic.RelayControlPoint,
             values: {} 
           },
      103: { name: "RemainingDuration",
             characteristic: Characteristic.RemainingDuration,
             values: {} 
           },
      104: { name: "RemoteKey",
             characteristic: Characteristic.RemoteKey,
             values: 
                {"REWIND":         Characteristic.RemoteKey.REWIND,
                 "FAST_FORWARD":   Characteristic.RemoteKey.FAST_FORWARD,
                 "NEXT_TRACK":     Characteristic.RemoteKey.NEXT_TRACK,
                 "PREVIOUS_TRACK": Characteristic.RemoteKey.PREVIOUS_TRACK,
                 "ARROW_UP":       Characteristic.RemoteKey.ARROW_UP,
                 "ARROW_DOWN":     Characteristic.RemoteKey.ARROW_DOWN,
                 "ARROW_LEFT":     Characteristic.RemoteKey.ARROW_LEFT,
                 "ARROW_RIGHT":    Characteristic.RemoteKey.ARROW_RIGHT,
                 "SELECT":         Characteristic.RemoteKey.SELECT,
                 "BACK":           Characteristic.RemoteKey.BACK,
                 "EXIT":           Characteristic.RemoteKey.EXIT,
                 "PLAY_PAUSE":     Characteristic.RemoteKey.PLAY_PAUSE,
                 "INFORMATION":    Characteristic.RemoteKey.INFORMATION
                } 
           },
      105: { name: "ResetFilterIndication",
             characteristic: Characteristic.ResetFilterIndication,
             values: {} 
           },
      106: { name: "RotationDirection",
             characteristic: Characteristic.RotationDirection,
             values: 
                {"CLOCKWISE": 
                   Characteristic.RotationDirection.CLOCKWISE,
                 "COUNTER_CLOCKWISE":
                   Characteristic.RotationDirection.COUNTER_CLOCKWISE
                } 
           },
      107: { name: "RotationSpeed",
             characteristic: Characteristic.RotationSpeed,
             values: {} 
           },
      108: { name: "Saturation",
             characteristic: Characteristic.Saturation,
             values: {} 
           },
      109: { name: "SecuritySystemAlarmType",
             characteristic: Characteristic.SecuritySystemAlarmType,
             values: {} 
           },
      110: { name: "SecuritySystemCurrentState",
             characteristic: Characteristic.SecuritySystemCurrentState,
             values:
                {"STAY_ARM": 
                   Characteristic.SecuritySystemCurrentState.STAY_ARM,
                 "AWAY_ARM": 
                    Characteristic.SecuritySystemCurrentState.AWAY_ARM,
                 "NIGHT_ARM":
                    Characteristic.SecuritySystemCurrentState.NIGHT_ARM,
                 "DISARMED": 
                    Characteristic.SecuritySystemCurrentState.DISARMED,
                 "ALARM_TRIGGERED":
                    Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED
                } 
           },
      111: { name: "SecuritySystemTargetState",
             characteristic: Characteristic.SecuritySystemTargetState,
             values: 
                {"STAY_ARM": 
                    Characteristic.SecuritySystemTargetState.STAY_ARM,
                 "AWAY_ARM": 
                    Characteristic.SecuritySystemTargetState.AWAY_ARM,
                 "NIGHT_ARM":
                    Characteristic.SecuritySystemTargetState.NIGHT_ARM,
                 "DISARM": 
                    Characteristic.SecuritySystemTargetState.DISARM
                } 
           },
      112: { name: "SelectedRTPStreamConfiguration",
             characteristic: Characteristic.SelectedRTPStreamConfiguration ,
             values: {} 
           },
      113: { name: "SerialNumber",
             characteristic: Characteristic.SerialNumber,
             values: {} 
           },
      114: { name: "ServiceLabelIndex",
             characteristic: Characteristic.ServiceLabelIndex,
             values: {} 
           },
      115: { name: "ServiceLabelNamespace",
             characteristic: Characteristic.ServiceLabelNamespace,
             values: 
                {"DOTS": 
                   Characteristic.ServiceLabelNamespace.DOTS,
                 "ARABIC_NUMERALS":
                   Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
                } 
           },
      116: { name: "SetDuration",
             characteristic: Characteristic.SetDuration,
             values: {} 
           },
      117: { name: "SetupEndpoints",
             characteristic: Characteristic.SetupEndpoints,
             values: {} 
           },
      118: { name: "SlatType",
             characteristic: Characteristic.SlatType,
             values: {"HORIZONTAL": Characteristic.SlatType.HORIZONTAL,
                      "VERTICAL":   Characteristic.SlatType.VERTICAL
                     } 
           },
      119: { name: "SleepDiscoveryMode",
             characteristic: Characteristic.SleepDiscoveryMode,
             values: {"NOT_DISCOVERABLE":    Characteristic.SleepDiscoveryMode.NOT_DISCOVERABLE ,
                      "ALWAYS_DISCOVERABLE": Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
                     } 
           },
      120: { name: "SmokeDetected",
             characteristic: Characteristic.SmokeDetected,
             values: {"SMOKE_NOT_DETECTED": Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
                      "SMOKE_DETECTED":     Characteristic.SmokeDetected.SMOKE_DETECTED
                     } 
           },
      121: { name: "StatusActive",
             characteristic: Characteristic.StatusActive,
             values: 
                {"FALSE": false,
                  "TRUE":  true
                } 
           },
      122: { name: "StatusFault",
             characteristic: Characteristic.StatusFault,
             values: {"NO_FAULT":      Characteristic.StatusFault.NO_FAULT,
                      "GENERAL_FAULT": Characteristic.StatusFault.GENERAL_FAULT
                     } 
           },
      123: { name: "StatusJammed",
             characteristic: Characteristic.StatusJammed,
             values: {"NOT_JAMMED": Characteristic.StatusJammed.NOT_JAMMED,
                      "JAMMED":     Characteristic.StatusJammed.JAMMED
                     } 
           },
      124: { name: "StatusLowBattery",
             characteristic: Characteristic.StatusLowBattery,
             values: 
                {"BATTERY_LEVEL_NORMAL":
                   Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
                 "BATTERY_LEVEL_LOW":
                   Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
                } 
           },
      125: { name: "StatusTampered",
             characteristic: Characteristic.StatusTampered,
             values: 
                {"NOT_TAMPERED": Characteristic.StatusTampered.NOT_TAMPERED,
                 "TAMPERED":     Characteristic.StatusTampered.TAMPERED
                } 
           },
      126: { name: "StreamingStatus",
             characteristic: Characteristic.StreamingStatus,
             values: {} 
           },
      127: { name: "SulphurDioxideDensity",
             characteristic: Characteristic.SulphurDioxideDensity,
             values: {} 
           },
      128: { name: "SupportedAudioStreamConfiguration",
             characteristic: Characteristic.SupportedAudioStreamConfiguration,
             values: {} 
           },
      129: { name: "SupportedRTPConfiguration",
             characteristic: Characteristic.SupportedRTPConfiguration,
             values: {} 
           },
      130: { name: "SupportedVideoStreamConfiguration",
             characteristic: Characteristic.SupportedVideoStreamConfiguration,
             values: {} 
           },
      131: { name: "SwingMode",
             characteristic: Characteristic.SwingMode,
             values: {"SWING_DISABLED": Characteristic.SwingMode.SWING_DISABLED,
                      "SWING_ENABLED": Characteristic.SwingMode.SWING_ENABLED
                     } 
           },
      132: { name: "TargetAirPurifierState",
             characteristic: Characteristic.TargetAirPurifierState ,
             values: {"MANUAL": Characteristic.TargetAirPurifierState.MANUAL,
                      "AUTO":   Characteristic.TargetAirPurifierState.AUTO
                     } 
           },
      133: { name: "TargetAirQuality",
             characteristic: Characteristic.TargetAirQuality,
             values: {"EXCELLENT": Characteristic.TargetAirQuality.EXCELLENT,
                      "GOOD":      Characteristic.TargetAirQuality.GOOD,
                      "FAIR":      Characteristic.TargetAirQuality.FAIR
                     } 
           },
      134: { name: "TargetDoorState",
             characteristic: Characteristic.TargetDoorState,
             values: {"OPEN":   Characteristic.TargetDoorState.OPEN,
                      "CLOSED": Characteristic.TargetDoorState.CLOSED
                     } 
           },
      135: { name: "TargetFanState",
             characteristic: Characteristic.TargetFanState,
             values: {"MANUAL": Characteristic.TargetFanState.MANUAL,
                      "AUTO": Characteristic.TargetFanState.AUTO
                     } 
           },
      136: { name: "TargetHeaterCoolerState",
             characteristic: Characteristic.TargetHeaterCoolerState,
             values: {"AUTO": Characteristic.TargetHeaterCoolerState.AUTO,
                      "HEAT": Characteristic.TargetHeaterCoolerState.HEAT,
                      "COOL": Characteristic.TargetHeaterCoolerState.COOL
                     } 
           },
      137: { name: "TargetHeatingCoolingState",
             characteristic: Characteristic.TargetHeatingCoolingState,
             values: {"OFF": Characteristic.TargetHeatingCoolingState.OFF,
                      "HEAT": Characteristic.TargetHeatingCoolingState.HEAT,
                      "COOL": Characteristic.TargetHeatingCoolingState.COOL,
                      "AUTO": Characteristic.TargetHeatingCoolingState.AUTO
                     } 
           },
      138: { name: "TargetHorizontalTiltAngle",
             characteristic: Characteristic.TargetHorizontalTiltAngle,
             values: {} 
           },
      139: { name: "TargetHumidifierDehumidifierState",
             characteristic: Characteristic.TargetHumidifierDehumidifierState,
             values: 
               {"HUMIDIFIER_OR_DEHUMIDIFIER":
                  Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER,               
                "HUMIDIFIER": 
                  Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER,
                "DEHUMIDIFIER":
                  Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER
               } 
           },
      140: { name: "TargetMediaState",
             characteristic: Characteristic.TargetMediaState,
             values: {"PLAY": Characteristic.TargetMediaState.PLAY,
                      "PAUSE": Characteristic.TargetMediaState.PAUSE,
                      "STOP": Characteristic.TargetMediaState.STOP
                     } 
           },
      141: { name: "TargetPosition",
             characteristic: Characteristic.TargetPosition,
             values: {} 
           },
      142: { name: "TargetRelativeHumidity",
             characteristic: Characteristic.TargetRelativeHumidity,
             values: {} 
           },
      143: { name: "TargetSlatState",
             characteristic: Characteristic.TargetSlatState,
             values: {"MANUAL": Characteristic.TargetSlatState.MANUAL,
                      "AUTO": Characteristic.TargetSlatState.AUTO
                     } 
           },
      144: { name: "TargetTemperature",
             characteristic: Characteristic.TargetTemperature,
             values: {} 
           },
      145: { name: "TargetTiltAngle",
             characteristic: Characteristic.TargetTiltAngle,
             values: {} 
           },
      146: { name: "TargetVerticalTiltAngle",
             characteristic: Characteristic.TargetVerticalTiltAngle ,
             values: {} 
           },
      147: { name: "TargetVisibilityState",
             characteristic: Characteristic.TargetVisibilityState,
             values: {"SHOWN": Characteristic.TargetVisibilityState.SHOWN,
                      "HIDDEN": Characteristic.TargetVisibilityState.HIDDEN
                     } 
           },
      148: { name: "TemperatureDisplayUnits",
             characteristic: Characteristic.TemperatureDisplayUnits,
             values: 
                {"CELSIUS":    Characteristic.TemperatureDisplayUnits.CELSIUS,
                 "FAHRENHEIT": Characteristic.TemperatureDisplayUnits.FAHRENHEIT
                 } 
           },
      149: { name: "TimeUpdate",
             characteristic: Characteristic.TimeUpdate,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      150: { name: "TunneledAccessoryAdvertising",
             characteristic: Characteristic.TunneledAccessoryAdvertising,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      151: { name: "TunneledAccessoryConnected",
             characteristic: Characteristic.TunneledAccessoryConnected,
             values: {"FALSE": false,
                      "TRUE":  true
                     } 
           },
      152: { name: "TunneledAccessoryStateNumber",
             characteristic: Characteristic.TunneledAccessoryStateNumber,
             values: {} 
           },
      153: { name: "TunnelConnectionTimeout",
             characteristic: Characteristic.TunnelConnectionTimeout,
             values: {} 
           },
      154: { name: "ValveType",
             characteristic: Characteristic.ValveType ,
             values: {"GENERIC_VALVE": Characteristic.ValveType.GENERIC_VALVE,
                      "IRRIGATION":    Characteristic.ValveType.IRRIGATION,
                      "SHOWER_HEAD":   Characteristic.ValveType.SHOWER_HEAD,
                      "WATER_FAUCET":  Characteristic.ValveType.WATER_FAUCET
                     } 
           },
      155: { name: "Version",
             characteristic: Characteristic.Version,
             values: {} 
           },
      156: { name: "VOCDensity",
             characteristic: Characteristic.VOCDensity,
             values: {} 
           },
      157: { name: "Volume",
             characteristic: Characteristic.Volume,
             values: {} 
           },
      158: { name: "VolumeControlType",
             characteristic: Characteristic.VolumeControlType,
             values: 
                {"NONE": 
                    Characteristic.VolumeControlType.NONE,
                 "RELATIVE": 
                    Characteristic.VolumeControlType.RELATIVE,
                 "RELATIVE_WITH_CURRENT":
                    Characteristic.VolumeControlType.RELATIVE_WITH_CURRENT,
                 "ABSOLUTE":
                    Characteristic.VolumeControlType.ABSOLUTE
                 } 
           },
      159: { name: "VolumeSelector",
              characteristic: Characteristic.VolumeSelector,
             values: {"INCREMENT": Characteristic.VolumeSelector.INCREMENT,
                      "DECREMENT": Characteristic.VolumeSelector.DECREMENT
                     } 
           },
      160: { name: "WaterLevel",
             characteristic: Characteristic.WaterLevel,
             values: {} 
           }
   };
   
   // Fill in the properties of each device (Must be done at runtime)
   CMD4_DEVICE_TYPE_ENUM.properties =
   {
       0: { deviceName:'AccessoryInformation',        
            service: Service.AccessoryInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Identify,
                 CMD4_ACC_TYPE_ENUM.Manufacturer,
                 CMD4_ACC_TYPE_ENUM.Model,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.SerialNumber,
                 CMD4_ACC_TYPE_ENUM.FirmwareRevision
                ],
            defaultValues:
               [ true,                       // Format: Bool
                 'Cmd4',                     // Format: string
                 'Model',                    // Format: string
                 'My_AccessoryInformation',  // Format: string
                 'ABC001',                   // Format: string
                 '100.1.1'                   // Format: string
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Identify
               ]
          },
       1: { deviceName:'AirPurifier',                 
            service: Service.AirPurifier,
            devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState,
                 CMD4_ACC_TYPE_ENUM.TargetAirPurifierState],
            defaultValues:
               [ Characteristic.Active.ACTIVE,
                 Characteristic.CurrentAirPurifierState.PURIFYING_AIR,
                 Characteristic.TargetAirPurifierState.AUTO
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
       2: { deviceName:'AirQualitySensor',            
            service: Service.AirQualitySensor,
            devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,    // Added anyway
                 CMD4_ACC_TYPE_ENUM.AirQuality],
            defaultValues:
               [ true,                               // Format: Bool
                 Characteristic.AirQuality.GOOD
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.AirQuality
               ]
          },
       3: { deviceName:'BatteryService',              
            service: Service.BatteryService,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.BatteryLevel,
                 CMD4_ACC_TYPE_ENUM.ChargingState,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery],
            defaultValues:
               [ 50,  // Range 0-100
                 Characteristic.ChargingState.NOT_CHARGING,
                 Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusLowBattery
               ]
          },
       4: { deviceName:'BridgeConfiguration',                       
            service: Service.BridgeConfiguration,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus],
            defaultValues:
               [ 0   // Format: TLV8
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus
               ]
          },
       5: { deviceName:'BridgingState',              
            service: Service.BridgingState,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Reachable],
            defaultValues:
               [ true   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Reachable
               ]
          },
       6: { deviceName:'CameraControl',                             
            service: Service.CameraControl,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [CMD4_ACC_TYPE_ENUM.On],
            defaultValues:
               [ true   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
       7: { deviceName:'CameraRTPStreamManagement',   
            service: Service.CameraRTPStreamManagement,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration,
                 CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration,
                 CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration,
                 CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration,
                 CMD4_ACC_TYPE_ENUM.StreamingStatus,
                 CMD4_ACC_TYPE_ENUM.SetupEndpoints,
                 CMD4_ACC_TYPE_ENUM.StatusActive],  // Added as all are TLV8
            defaultValues:
               [ 0,     // Format TLV8
                 0,     // Format TLV8
                 0,     // Format TLV8
                 0,     // Format TLV8
                 0,     // Format TLV8
                 0,     // Format TLV8
                 false  // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive
               ]
          },
       8: { deviceName:'CarbonDioxideSensor',         
            service: Service.CarbonDioxideSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,   // Added anyway
                 CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected
               ]
          },
       9: { deviceName:'CarbonMonoxideSensor',        
            service: Service.CarbonMonoxideSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,    // Added anyway
                 CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected
               ]
          },
      10: { deviceName:'ContactSensor',               
            service: Service.ContactSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,     // Added anyway
                 CMD4_ACC_TYPE_ENUM.ContactSensorState],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.ContactSensorState
               ]
          },
      11: { deviceName:'Door',                        
            service: Service.Door,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition,
                 CMD4_ACC_TYPE_ENUM.PositionState,
                 CMD4_ACC_TYPE_ENUM.TargetPosition],
            defaultValues:
               [ 0,                                    // Range 0 - 100
                 Characteristic.PositionState.STOPPED,
                 0                                     // Range 0 - 100
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          },
      12: { deviceName:'DoorBell',                    
            service: Service.Doorbell,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent],
            defaultValues:
               [ Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      13: { deviceName:'Fan',                         
            service: Service.Fan,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On],
            defaultValues:
               [ false   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      14: { deviceName:'Fanv1',                       
            service: Service.Fan,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On],
            defaultValues:
               [ false   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]},
      15: { deviceName:'Fanv2',                       
            service: Service.Fanv2,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active],
            defaultValues:
               [ Characteristic.Active.ACTIVE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      16: { deviceName:'Faucet',                      
            service: Service.Faucet,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active],
            defaultValues:
               [ Characteristic.Active.ACTIVE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      17: { deviceName:'FilterMaintenance',           
            service: Service.FilterMaintenance,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.FilterChangeIndication],
            defaultValues:
               [ Characteristic.FilterChangeIndication.FILTER_OK
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.FilterChangeIndication
               ]
          },  
      18: { deviceName:'GarageDoorOpener',            
            service: Service.GarageDoorOpener,
            devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                 CMD4_ACC_TYPE_ENUM.TargetDoorState,
                 CMD4_ACC_TYPE_ENUM.ObstructionDetected],
            defaultValues:
               [ Characteristic.CurrentDoorState.OPEN,
                 Characteristic.TargetDoorState.OPEN,
                 true                                   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentDoorState
               ]
          },
      19: { deviceName:'HeaterCooler',                
            service: Service.HeaterCooler,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                 CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                 CMD4_ACC_TYPE_ENUM.CurrentTemperature],
            defaultValues:
               [ Characteristic.Active.ACTIVE, 
                 Characteristic.CurrentHeaterCoolerState.INACTIVE,
                 Characteristic.TargetHeaterCoolerState.HEAT,
                 50.0 // format float, Range 0 - 100, step 0.1 (Celcius)
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      20: { deviceName:'HumidifierDehumidifier',      
            service: Service.HumidifierDehumidifier,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                 CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                 CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                 CMD4_ACC_TYPE_ENUM.Active],
            defaultValues:
               [ 60.2,   // format float, Range 0 - 100, step 1
                 Characteristic.CurrentHumidifierDehumidifierState.IDLE,
                 Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER,
                 Characteristic.Active.ACTIVE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      21: { deviceName:'HumiditySensor',              
            service: Service.HumiditySensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,   // Added anyway
                 CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity],
            defaultValues:
               [ false,   // Format: Bool
                 60.2     // Format: float, Range 1-100
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity
               ]
          },
      22: { deviceName:'InputSource',                 
            service: Service.InputSource,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
              [ CMD4_ACC_TYPE_ENUM.ConfiguredName,
                CMD4_ACC_TYPE_ENUM.InputSourceType,
                CMD4_ACC_TYPE_ENUM.IsConfigured,
                CMD4_ACC_TYPE_ENUM.CurrentVisibilityState],
            defaultValues:
               [ "My_TV", // Format String
                 Characteristic.InputSourceType.HOME_SCREEN,
                 Characteristic.IsConfigured.CONFIGURED,
                 Characteristic.CurrentVisibilityState.SHOWN
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentVisibilityState
               ]
          },
      23: { deviceName:'IrrigationSystem',            
            service: Service.IrrigationSystem,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.ProgramMode,
                 CMD4_ACC_TYPE_ENUM.InUse],
            defaultValues:
               [ Characteristic.Active.ACTIVE, 
                 Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED,
                 Characteristic.InUse.IN_USE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      24: { deviceName:'LeakSensor',                  
            service: Service.LeakSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,  // Added Anyway
                 CMD4_ACC_TYPE_ENUM.LeakDetected],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.LeakDetected.LEAK_NOT_DETECTED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.LeakDetected
               ]
          },
      25: { deviceName:'LightSensor',                 
            service: Service.LightSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,  // Added anyway
                 CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel],
            defaultValues:
               [ false,   // Format: Bool
                 1        // float, Range 0.0001 - 100000 (lux)
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel
               ]
          },
      26: { deviceName:'Lightbulb',                   
            service: Service.Lightbulb,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On],
            defaultValues:
               [ false,   // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      27: { deviceName:'LockManagement',              
            service: Service.LockManagement,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentDoorState,  // Added
                 CMD4_ACC_TYPE_ENUM.LockControlPoint,
                 CMD4_ACC_TYPE_ENUM.Version],
            defaultValues:
               [ Characteristic.CurrentDoorState.OPEN,
                 0,       // format: TLV8
                 '0'      // Format: string  
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentDoorState
               ]
          },
      28: { deviceName:'LockMechanism',               
            service: Service.LockMechanism,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockCurrentState,
                 CMD4_ACC_TYPE_ENUM.LockTargetState],
            defaultValues:
               [ Characteristic.LockCurrentState.UNSECURED,
                 Characteristic.LockTargetState.UNSECURED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockCurrentState
               ]
          },
      29: { deviceName:'Microphone',                  
            service: Service.Microphone,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute],
            defaultValues:
               [ false,   // Format: Bool,  0 - Mute is off, 1 - Mute is on
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute
               ]
          },
      30: { deviceName:'MotionSensor',                
            service: Service.MotionSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,   // Added anyway
                 CMD4_ACC_TYPE_ENUM.MotionDetected],
            defaultValues:
               [ false,   // Format: Bool
                 false    // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.MotionDetected
               ]
          },
      31: { deviceName:'OccupancySensor',             
            service: Service.OccupancySensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,  // Added anyway
                 CMD4_ACC_TYPE_ENUM.OccupancyDetected],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.OccupancyDetected
               ]
          },
      32: { deviceName:'Outlet',                      
            service: Service.Outlet,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On,
                 CMD4_ACC_TYPE_ENUM.OutletInUse],
            defaultValues:
               [ false,   // Format: Bool
                 false    // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      33: { deviceName:'Pairing',                     
            service: Service.Pairing,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.PairingFeatures],   // only not TLV8
            defaultValues:
               [ 1   // Format uint8. Values ???
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.PairingFeatures
               ]
          },
      34: { deviceName:'ProtocolInformation',         
            service: Service.ProtocolInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Version],
            defaultValues:
               [ '1.2.3'   // Format string
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Version
               ]
          },
      35: { deviceName:'Relay',                       
            service: Service.Relay,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.RelayEnabled,
                 CMD4_ACC_TYPE_ENUM.RelayState
                 
                 // This is a required Characteristic, 
                 // but made optional, otherwise you cannot connect
                 // to Homebridge with HomeKit or Eve. they return
                 // cannot connect to accessory. 
                 // CMD4_ACC_TYPE_ENUM.RelayControlPoint
               ],
            defaultValues:
               [ true,   // Format: Bool
                 1       // Format uint8, Values ???
                 //0     // Format: TLV8
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.RelayEnabled,
                 CMD4_ACC_TYPE_ENUM.RelayState,
               ]
          },
      36: { deviceName:'SecuritySystem',              
            service: Service.SecuritySystem,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                 CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState],
            defaultValues:
               [ Characteristic.SecuritySystemCurrentState.DISARMED,
                 Characteristic.SecuritySystemTargetState.DISARM
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState
               ]},
      37: { deviceName:'ServiceLabel',                
            service: Service.ServiceLabel,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace],
            defaultValues:
               [ Characteristic.ServiceLabelNamespace.DOTS
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace
               ]
          },
      38: { deviceName:'Slat',                        
            service: Service.Slat,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SlatType,
                 CMD4_ACC_TYPE_ENUM.CurrentSlatState],
            defaultValues:
               [ Characteristic.SlatType.HORIZONTAL,
                 Characteristic.CurrentSlatState.FIXED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentSlatState
               ]
          },
      39: { deviceName:'SmokeSensor',                 
            service: Service.SmokeSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,   // Added anyway
                 CMD4_ACC_TYPE_ENUM.SmokeDetected],
            defaultValues:
               [ false,   // Format: Bool
                 Characteristic.SmokeDetected.SMOKE_NOT_DETECTED
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.SmokeDetected
               ]
          },
      40: { deviceName:'Speaker',                     
            service: Service.Speaker,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute],
            defaultValues:
               [ false    // Format: Bool, 0 - Mute is off, 1 - Mute is on
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute
               ]
          },
      41: { deviceName:'StatefulProgrammableSwitch',  
            service: Service.StatefulProgrammableSwitch,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                 CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState],
            defaultValues:
               [ Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
                 0    // Min 0, Max 1
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      42: { deviceName:'StatelessProgrammableSwitch', 
            service: Service.StatelessProgrammableSwitch,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent],
            defaultValues:
               [ Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      43: { deviceName:'Switch',                      
            service: Service.Switch,
            devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On],
            defaultValues:
               [ false    // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      44: { deviceName:'Television',                  
            service: Service.Television,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.ActiveIdentifier,
                 CMD4_ACC_TYPE_ENUM.ConfiguredName,
                 CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode],
            defaultValues:
               [ Characteristic.Active.ACTIVE,
                 123,       // Format uint32
                 'My_Tv',   // Format string
                 Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      45: { deviceName:'TelevisionSpeaker',           
            service: Service.TelevisionSpeaker,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.Volume,
                 CMD4_ACC_TYPE_ENUM.VolumeControlType,
                 CMD4_ACC_TYPE_ENUM.VolumeSelector,
                 CMD4_ACC_TYPE_ENUM.Name],
            defaultValues:
               [ Characteristic.Active.ACTIVE,
                 0,           // Min 0, Max 100, step 1
                 Characteristic.VolumeControlType.NONE,
                 Characteristic.VolumeSelector.DECREMENT,  
                 'My_Speaker' // Format string
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      46: { deviceName:'TemperatureSensor',           
            service: Service.TemperatureSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,   // Added anyway
                 CMD4_ACC_TYPE_ENUM.CurrentTemperature],
            defaultValues:
               [ false,   // Format: Bool
                 50.0     // format float, 0 - 100, by 0.1
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.CurrentTemperature
               ]
          },
      47: { deviceName:'Thermostat',                  
            service: Service.Thermostat,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState,
                 CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState,
                 CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                 CMD4_ACC_TYPE_ENUM.TargetTemperature,
                 CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits],
            defaultValues:
               [ Characteristic.CurrentHeatingCoolingState.OFF,
                 Characteristic.TargetHeatingCoolingState.OFF,
                 50.0, // format float, Range 0 - 100, step 0.1 (Celcius
                 50.0, // format float, Range 0 - 100, step 0.1 (Celcius
                 Characteristic.TemperatureDisplayUnits.CELSIUS
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTemperature
               ]
           },
       48: { deviceName:'TimeInformation',             
            service: Service.TimeInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTime,
                 CMD4_ACC_TYPE_ENUM.DayoftheWeek,
                 CMD4_ACC_TYPE_ENUM.TimeUpdate],
            defaultValues:
               [ '11:15',   // Format string
                 1,         // Range 1 - 7
                 false      // Format: Bool
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTime
               ]
          },
      49: { deviceName:'TunneledBTLEAccessoryService', 
            service: Service.TunneledBTLEAccessoryService,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                 CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber,
                 CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected,
                 CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising,
                 CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout],
            defaultValues:
               [ 'My_TunnelB',  // Format string
                 'TLB',         // Format string
                 0.0,           // Format float
                 false,         // Format: Bool
                 false,         // Format: Bool
                 5000           // Format uint32
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected
               ]
          },
      50: { deviceName:'Valve',                       
            service: Service.Valve,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.InUse,
                 CMD4_ACC_TYPE_ENUM.ValveType],
            defaultValues:
               [ Characteristic.Active.ACTIVE,
                 Characteristic.InUse.IN_USE,
                 Characteristic.ValveType.GENERIC_VALVE
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      51: { deviceName:'Window',                      
            service: Service.Window,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition,
                 CMD4_ACC_TYPE_ENUM.PositionState,
                 CMD4_ACC_TYPE_ENUM.TargetPosition],
            defaultValues:
               [ 0,   // Range 0 - 100
                 Characteristic.PositionState.STOPPED,
                 0,   // Range 0 - 100
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          },
      52: { deviceName:'WindowCovering',              
            service: Service.WindowCovering,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition,
                 CMD4_ACC_TYPE_ENUM.PositionState,
                 CMD4_ACC_TYPE_ENUM.TargetPosition],
            defaultValues:
               [ 0,   // Range 0 - 100
                 Characteristic.PositionState.STOPPED,
                 0,   // Range 0 - 100
                ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          }
   };
   
   // This is not required by homebridge and does not affect it.  I use it for
   // unit testing.
   return {CMD4_ACC_TYPE_ENUM,
           CMD4_DEVICE_TYPE_ENUM,
           Accessory,
           Service,
           Characteristic,
           UUIDGen};
   },
   CMD4_ACC_TYPE_ENUM: CMD4_ACC_TYPE_ENUM,
   CMD4_DEVICE_TYPE_ENUM: CMD4_DEVICE_TYPE_ENUM,
   Accessory: Accessory,
   Service: Service,
   Characteristic: Characteristic,
   UUIDGen: UUIDGen
}


// Platform definitions
function Cmd4Platform(log, config, api) {
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
         // This will create an accessory based on the Cmd4Accessory
         // definition bellow. This is not obvious for a newbie.
         this.log(FgMagenta + "Processing accessory: " + FgBlack + this.config.accessories[i].name );
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
                  this.log.debug("Characteristic polling for:%s", accessory.name);
                  this.setupCharacteristicPolling(accessory);
                  break;
               case 'string':
               case 'boolean':
                  this.log.debug("State polling for:%s", accessory.name);
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
          CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name, self.name, timeout, interval);

   // Make sure that the characteristic exists
   if ( accTypeEnumIndex < 0 )
   {
      self.log("CMD4 WARNING: No such polling accTypeEnumIndex '%d' for:%s",
         accTypeEnumIndex, self.name);
      return;
   }

   // Clear polling
   if (this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] == undefined)
      clearTimeout(this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ]);

   // i.e. Characteristic.On
   // i.e.  Characteristic.RotationDirection
   self.service.getCharacteristic(
      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic
   ).getValue();
 
  
    this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
       setTimeout(this.characteristicPolling.bind(
          this, accessory, accTypeEnumIndex, timeout, interval), interval);
   
 }

 Cmd4Platform.prototype.setupCharacteristicPolling = function (accessory)
{
   let self = accessory;

   self.log.debug("Setting up:%s polling characteristics of accessory:%s",
      self.polling.length, self.name);

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
                          this.config.name, timeout);
               }
               break;
            case "Interval":
               // Intervals are in seconds
               interval = parseInt(value, 10) * 1000;
               break;
            default:
               ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
               if ( ucKeyIndex < 0 )
               {
                  self.log("CMD4 WARNING: No such polling characteristic:%s for:%s",
                       key, self.name);
                   continue;
               }
          }
      }

      self.log.debug("Setting up accessory:%s for polling of:%s timeout:%s interval:%s", self.name, CMD4_ACC_TYPE_ENUM.properties[ucKeyIndex].name, timeout, interval);

      this.listOfPollingCharacteristics[ accessory.name + ucKeyIndex ] =
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
      this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
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
      this.log.debug("Creating array to hold child Accessories for %s", accessoryConfig.name);
      this.childFoundAccessories = [];
      this.log.debug("Creating array to hold services for %s", accessoryConfig.name);
      this.services = [];
      this.parent = this;
   }
      
   this.listOfVariables = {};
   this.listOfConstants = {};
   
   // Bring the platform config variables forward the accessory first
   // If they do not exist, they would still be undefined.
   this.stateChangeResponseTime = parentConfig.stateChangeResponseTime;   
   this.interval = parentConfig.interval;   
   this.timeout = parentConfig.timeout;
   this.state_cmd = parentConfig.state_cmd;

   // Instead of local variables for every characteristic, create an array to
   // hold values for  all characteristics based on the size of all possible characteristics.
   this.storedValuesPerCharacteristic = new Array(CMD4_ACC_TYPE_ENUM.EOL).fill(null);
    
    
   // If polling is defined it is set to true/false, otherwise false.
   this.polling = this.config.polling === true;

   // We need to do this before parseConfig as it is re-interant
   this.type = this.config.type;
   this.name = this.config.name;
   this.ucType = ucFirst(this.config.type);
   this.deviceName = this.config.name
   this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum(i => i.deviceName === this.ucType);
   if (this.typeIndex < 0)
   {
      this.log ("CMD4 Error: Unknown device type:%s for %s", this.type, this.name);
      process.exit(1);
   }

   // Make sure the default characteristics will be included
   // This also defines what service will be created.
   let properties = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex]; 

   // We need to set up the service for linked services (If any)
   this.service = new properties.service(this.name, this.name);
   
   // Linked services (Ones with parents, do not have information services)
   // If a parent is defined, then I must be a linked accessory and linked
   // accessories no not have information services.
   // Also let the parent add this accessories service to their list.
   if (! parent)
   {
      this.log.debug("Creating information and service for this parent");
      // The information service
      // For multiple accessories of the same type, it is important that the accessory
      // has a unique serial number, so append the config.name.
      this.informationService = new Service.AccessoryInformation();
      
      this.services.push(this.informationService);
      this.services.push(this.service);
   }

   this.parseConfig ( this.config );
   
   // parseConfig may/mayNotHave set Manufacturer, Model & SerialNumber
   if (this.informationService)
   {
      if ( ! this.manufacturer )
         this.informationService
            .setCharacteristic(Characteristic.Manufacturer, "Cmd4");
            
      if ( ! this.model )
         this.informationService
            .setCharacteristic(Characteristic.Model, "Cmd4Model");
         
      if ( ! this.serialNumber )
         this.informationService
            .setCharacteristic(Characteristic.SerialNumber,  "Cmd4 " + this.config.type)
   }
   
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

   // The linked service needs to know about this one.
   let numberOfRequiredCharacteristics = properties.requiredCharacteristics.length;
   
   for (let index = 0; index < numberOfRequiredCharacteristics; index ++)
   {
      this.log.debug("Checking index:%d for:", index, this.name);
      let value = properties.defaultValues[index];
      let req = properties.requiredCharacteristics[index];
      
      if ( this.getStoredValueForIndex( req ) == undefined )
      {
         this.log.warn("Adding default characteristic %s for %s", CMD4_ACC_TYPE_ENUM.properties[req].name, this.name);
         this.log.warn("Not defining a default characteristic can be problematic");
         this.setStoredValueForIndex(req, value);
      }
   }

   // The default respnse time is in seconds
   if ( ! this.stateChangeResponseTime )
      this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex].devicesStateChangeDefaultTime;
         

   this.checkPollingConfigForUnsetCharacteristics(this.polling);

   // For every service, we allow all possible characteristics
   // based on the config.json file and not just those characterisitics
   // an accessory actually has.
   this.setupAllServices(this.service);
   
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
      //   console.log("Returning:%s number of services for:%s", this.services.length, this.name);
      //} else {
      //   console.log("Returning this.services:%s fo:%s", this.services, this.name);
      //}
      return this.services;
   },

   setStoredValueForIndex:function (accTypeEnumIndex, value)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log ("CMD4 Warning: setStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      this.storedValuesPerCharacteristic[accTypeEnumIndex] = value;
   },

   getStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL)
      {
         this.log ("CMD4 Warning: getStoredValue - Characteristic:%s for:%s not known", accTypeEnumIndex, this.name);
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
                        this.config.name, this.timeout);
                  }
                  break;
               case "Interval":
                  // Intervals are in seconds
                  this.interval = parseInt(value, 10) * 1000;
                  break;
               default:
               {
                  let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
                  
                  if (accTypeEnumIndex < 0 )
                  {
                    this.log("OOPS::%s not found. There something wrong with your config.json file?", key);
                    process.exit(1);
                  } else {
                     if ( this.getStoredValueForIndex(accTypeEnumIndex) == undefined )
                     {
                        this.log.warn("Polling for:%s requested, but characteristic ", key);
                        this.log.warn("is not in your config.json file for:%s", this.name);
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
      
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name;
      let characteristic = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic;      

      let cmd;
      
      
      if (self.outputConstants == true)
      {
         let constant = self.transposeValueToConstantForCharacteristic(accTypeEnumIndex, value);
          cmd = self.state_cmd + " Set '" + self.name + "' '" + characteristicString  + "' '" + constant  + "'";
      } else {
         cmd = self.state_cmd + " Set '" + self.name + "' '" + characteristicString  + "' '" + value  + "'";
      }
      self.log.debug("setValue %s function for:%s cmd:%s", characteristicString, self.name, cmd);

      
      // Execute command to Set a characteristic value for an accessory
      exec(cmd, {timeout: self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("setGeneric %s function failed for %s Error:%s", characteristicString, self.name, error.message);
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
                          self.name, self.config.type);
               } else if (self.service.getCharacteristic(characteristic) == undefined)
               {
                  // I have seen this once where Homebridge dies, possibly after
                  // trying to delete the bridge.
                  self.log.warn("Service is null for name:%s type:%s.",
                          self.name, self.config.type);
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

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name;

      let cmd = this.state_cmd + " Get '" + this.name + "' '" + characteristicString  + "'";


      self.log.debug("getValue accTypeEnumIndex:(%s)-'%s' function for:%s cmd:%s", accTypeEnumIndex, characteristicString, self.name, cmd);

      // Execute command to Get a characteristics value for an accessory
      let child = exec(cmd, {timeout:self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("getGeneric %s function for:%s cmd:%s failed.", characteristicString, self.name, cmd);
            self.log(error);
            self.log(stdout);
            self.log(stderr);
            callback( error, 0 );
         } else {
            let words = stdout.match(/\S+/gi);

            // I'd rather trap here
            if (words == undefined)
            {
               self.log("Nothing retured from stdout for %s %s", characteristicString, self.name);
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
                  self.log.warn("Warning, Retrieving %s, expected only one word value for:%s, using first of:%s", characteristicString,self.name, stdout);
               }
         
               self.log.debug("getValue %s function for:%s returned:%s", characteristicString, self.name, words[0]);
               
               
               // Even if outputConsts is not set, just in case, transpose it anyway.
               words[0] = self.transposeConstantToValueForCharacteristic(accTypeEnumIndex, words[0])        
         

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
    // setupAllServices: Method to set up all services
    //           for those characteristics in the
    //           config.json file.
    //
    //
    // Note: Tis code wipes out 5K of duplicate code.
    //       by using a bound function.  It appears
    //       to work on my iMac. 
    //
    // ***********************************************
    setupAllServices: function (service)
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
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name,
                  this.getStoredValueForIndex(accTypeEnumIndex),
                  this.name); 
      
             // Get the permissions of characteristic (Read/Write ...)
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
                   this.log.debug("Adding optional characteristic:%s for:%s", CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name, this.name);
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
         this.log ("Internal error.: updateAccessoryAttribute - accTypeEnumIndex:%s for:%s not known", accTypeEnumIndex, this.name);
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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);

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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucThirdParm);
               

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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucThirdParm);

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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);

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
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);

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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucSecondParm);
               thirdParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucThirdParm);
               

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
               
               firstParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucFirstParm);
               secondParmIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucSecondParm);
               
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
                 let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucValue);
                 
                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if (this.testStoredValueForIndex(accTypeEnumIndex) < 0 && ucValue != '0')
                    this.log.warn("Not a valid characteristic:%s for fakegato to log of:%s", value, key);
                 break;
              }
              default:
                 this.log("Invalid fakegato key:%s in json.config for:%s", key, this.name);
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
            this.log("WARNING: Cmd4 Unknown accessory config.storage:%s Expected:fs or googlrDrive for:%s", this.storage, this.name);
         }
      }

      if (this.loggingService)
      {
         if (this.polling == undefined ||
             this.polling == false)
         {
            this.log.warn("config.storage:%s for:%s set but polling is not enabled.",
              this.storage, this.name);
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
               this.log.warn("The file %s does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkFile);                   
            }                         
         }
         // Purposely fall through to check the command as well 
         case 1:
         {
            let checkCmd = cmdArray[0]; 
                              
            // if the lone command is a path to a command
            // Then check if it exists, oTherwise check if it is
            // in Their path.
            if ( checkCmd.charAt( 0 ) == '/' )
            {
               try {
                  fs.accessSync(checkCmd, fs.F_OK);
                  // File exists - OK
               } catch (e) {                           
                  this.log.warn("The command %s does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkCmd); 
               }                     
            } else
            {
               if ( ! commandExistsSync( checkCmd ) )
                  this.log.warn("The command %s does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell.", checkCmd);
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

      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
      
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
         
      //this.log.debug("**** Size is %s for %s", Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values).length, accTypeEnumIndex);
         
      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values).length > 0)
      {
                  
         // Even if outputConsts is not set, just in case, transpose it anyway.
         let newValue = this.transposeConstantToValueForCharacteristic(accTypeEnumIndex, value) ;

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
      if ( isJSON ( variable ) )
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
   processLinkedTypesConfig: function( config, parentConfig)
   {
      if ( Array.isArray ( config ) )
      {
         for (let i = 0; i < config.length; i++)
            this.processLinkedTypesConfig(config[i], parentConfig);
            
         return;
      } 
      if ( isJSON ( config ) )
      {
         this.log("Processing Linked accessory %s of %s", config.name, this.name);
        
         let accessory = new Cmd4Accessory( this.log, parentConfig, config, this );
         // This.parent is probable me, but what happens to linked-linked accessories ???
         this.parent.childFoundAccessories.push( accessory ); 
         
         
         this.log.debug("Pushing service for accessory:%s to:%s", accessory.name, this.name);
         this.parent.services.push(accessory.service);
         

         this.log.debug("Adding Linked service of %s to %s", accessory.name, this.name);
         this.parent.service.addLinkedService(accessory.service);
         
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
   // Used during getValue and parsing config.json
   transposeConstantToValueForCharacteristic( accTypeEnumIndex, constantString )
   {  
      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values).length < 0)
      {  
         //this.log.debug("No constants to transpose for:%s", constantString);
         return;
      }  
      
      if (CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values.hasOwnProperty(constantString) )
      {         
         let value = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values[constantString];
         
         // When we translate constants to Characteristic.<type>.values and value is a true/false
         // result, than parsing words[0].lowercase fails.
         // - I fixed that instead ...
         //value = String(value);
         
         this.log.debug("Found value:%s for:%s", value, constantString);
         
            
         return value;
      }
      //this.log.debug("No value found for constant:%s", constantString);
      return constantString;
   },
   // Used during setValue
   transposeValueToConstantForCharacteristic( accTypeEnumIndex, valueString )
   {  
      //this.log("check index:%s", accTypeEnumIndex);
      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values).length < 0)
      {  
         //this.log("No constants to transpose for:%s", valueString);
         return;
      }
   
      let constant = extractKeyValue(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values, valueString);
   
      if (constant == undefined)
      {
         //this.log.debug("No constant found for value:%s", valueString);
         return valueString;
      }
      return constant;
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
                  this.log ("CMD4 Error: Unknown device type:%s for %s", this.type, this.name);
                  process.exit(1);
               }
               break;
            case 'Name':
               this.name = value;
               this.UUID = UUIDGen.generate(this.name);
               this.displayName = this.name;  //fakegato-history uses displayName
               
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
                     config.name, this.timeout);
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
            default:
            {
               this.parseKeyForCharacteristics( key, value );
            }

         }
      }
   }
}

Object.defineProperty(Object.prototype, "indexOfEnum", {
   value: function(predicate, fromIndex) {
      let length = this == null ? 0 : Object.keys(this).length;
      if (!length)
         return -1;
      
      let index = fromIndex == null ? 0 : fromIndex;
      if (index < 0) {
         index = Math.max(length + index, 0);
      }

      for (let i=index; i < length; i++)
      {
         if (predicate(this[i], i, this)) {
            return i;
         }
      }
      return -1;
    }
});

/**
 * @param string
 * @returns string with first character in upper case.
 */
function ucFirst( string )
{
   switch( typeof string )
   {
      case undefined:
   
         console.log( "Asked to upper case first character of NULL String" );
         return "undefined";
   
      case 'boolean':
      case 'number':
         return string;
      case 'string':
         return string.charAt(0).toUpperCase() + string.slice( 1 );
      default:
         console.log( "Asked to upper case first character of non String(%s):%s", typeof string, string );
         return string;
   }
}

/**
 * @param variable
 * @returns boolean
 */
function isNumeric( num ){
   num = "" + num; // coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}
/**
 * @param Object
 * @returns boolean
 */
function isJSON(m) 
{

   if (m.constructor === Array) {
      console.log("It is an array");
      return false;
   }

   if (typeof m == 'object') {
      try{ m = JSON.stringify(m); }
      catch(err) { return false; } }

   if (typeof m == 'string') {
      try{ m = JSON.parse(m); }
      catch (err) { return false; } }

   if (typeof m != 'object') { return false; }
   return true;

}

function extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

const checkForUpdates = () => {
   versionCheck(versionCheckOptions, function (error, update) 
   {
      if (error) {
         console.error(error);
         process.exit(-1);
      }
      
      if (update) 
      { 
         console.log(`\x1b[32m[UPDATE AVAILABLE] \x1b[0mVersion ${update.tag_name} of homebridge-cmd4 is available. Any release notes can be found here: \x1b[4mhttps://github.com/ztalbot2000/homebridge-cmd4/README.md\x1b[0m`);
      }
   });
}
