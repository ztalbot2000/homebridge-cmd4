'use strict';
const exec = require("child_process").exec;
const moment = require('moment');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;


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
   ImageMirroring:                        56,
   ImageRotation:                         57,
   InputDeviceType:                       58,
   InputSourceType:                       59,
   InUse:                                 60,
   IsConfigured:                          61,
   LeakDetected:                          62,
   LinkQuality:                           63,
   LockControlPoint:                      64,
   LockCurrentState:                      65,
   LockLastKnownAction:                   66,
   LockManagementAutoSecurityTimeout:     67,
   LockPhysicalControls:                  68,
   LockTargetState:                       69,
   Logs:                                  70,
   Manufacturer:                          71,
   Model:                                 72,
   MotionDetected:                        73,
   Mute:                                  74,
   Name:                                  75,
   NightVision:                           76,
   NitrogenDioxideDensity:                77,
   ObstructionDetected:                   78,
   OccupancyDetected:                     79,
   On:                                    80,
   OpticalZoom:                           81,
   OutletInUse:                           82,
   OzoneDensity:                          83,
   PairSetup:                             84,
   PairVerify:                            85,
   PairingFeatures:                       86,
   PairingPairings:                       87,
   PictureMode:                           88,
   PM10Density:                           89,
   PM2_5Density:                          90,
   PositionState:                         91,
   PowerModeSelection:                    92,
   ProgramMode:                           93,
   ProgrammableSwitchEvent:               94,
   ProgrammableSwitchOutputState:         95,
   Reachable:                             96,
   RelativeHumidityDehumidifierThreshold: 97,
   RelativeHumidityHumidifierThreshold:   98,
   RelayEnabled:                          99,
   RelayState:                            100,
   RelayControlPoint:                     101,
   RemainingDuration:                     102,
   RemoteKey:                             103,
   ResetFilterIndication:                 104,
   RotationDirection:                     105,
   RotationSpeed:                         106,
   Saturation:                            107,
   SecuritySystemAlarmType:               108,
   SecuritySystemCurrentState:            109,
   SecuritySystemTargetState:             110,
   SelectedRTPStreamConfiguration:        111,
   SerialNumber:                          112,
   ServiceLabelIndex:                     113,
   ServiceLabelNamespace:                 114,
   SetDuration:                           115,
   SetupEndpoints:                        116,
   SlatType:                              117,
   SleepDiscoveryMode:                    118,
   SmokeDetected:                         119,
   StatusActive:                          120,
   StatusFault:                           121,
   StatusJammed:                          122,
   StatusLowBattery:                      123,
   StatusTampered:                        124,
   StreamingStatus:                       125,
   SulphurDioxideDensity:                 126,
   SupportedAudioStreamConfiguration:     127,
   SupportedRTPConfiguration:             128,
   SupportedVideoStreamConfiguration:     129,
   SwingMode:                             130,
   TargetAirPurifierState:                131,
   TargetAirQuality:                      132,
   TargetDoorState:                       133,
   TargetFanState:                        134,
   TargetHeaterCoolerState:               135,
   TargetHeatingCoolingState:             136,
   TargetHorizontalTiltAngle:             137,
   TargetHumidifierDehumidifierState:     138,
   TargetMediaState:                      139,
   TargetPosition:                        140,
   TargetRelativeHumidity:                141,
   TargetSlatState:                       142,
   TargetTemperature:                     143,
   TargetTiltAngle:                       144,
   TargetVerticalTiltAngle:               145,
   TargetVisibilityState:                 146,
   TemperatureDisplayUnits:               147,
   TimeUpdate:                            148,
   TunneledAccessoryAdvertising:          149,
   TunneledAccessoryConnected:            150,
   TunneledAccessoryStateNumber:          151,
   TunnelConnectionTimeout:               152,
   ValveType:                             153,
   Version:                               154,
   VOCDensity:                            155,
   Volume:                                156,
   VolumeControlType:                     157,
   VolumeSelector:                        158,
   WaterLevel:                            159,
   EOL:                                   160,
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
               [ 0,           // Format: Bool
                 'Cmd4',      // Format: string
                 0,           // Format: string
                 'My_AccessoryInformation',  // Format: string
                 'ABC001',    // Format: string
                 '100.1.1'    // Format: string
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
               [ 1,    // Active
                 2,    // Purifying Air
                 1.    // Active
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
               [ 0,   // false
                 1.   // Good
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
                 0,   // Not Charging
                 0.   // Battery Level is normal
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
               [ 0   // format TLV8
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
               [ 0   // format Bool
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
               [ 1   // format Bool
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
               [ 0,   // format TLV8
                 0,   // format TLV8
                 0,   // format TLV8
                 0,   // format TLV8
                 0,   // format TLV8
                 0,   // format TLV8
                 0    // format Bool - false
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
               [ 0,   // format Bool - false
                 0    // 0 - Normal, 1 - Abnormal
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
               [ 0,   // format Bool - false
                 0    // 0 - Normal, 1 - Abnormal
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
               [ 0,   // format Bool - false
                 0    // 0 - Contact Detected, 1 - Contact Not Detected
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
               [ 0,   // Range 0 - 100
                 2,   // 0 - Decreasing, 1 - Increasing, 2 - Stopped
                 0,   // Range 0 - 100
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
               [ 0   // 0 - Single Press, 1 - Double Press, 2 - Long Press 
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
               [ 0    // Format Bool
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
               [ 0    // Format Bool
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
               [ 1   // 0 - Inactive, 1 - Active 
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
               [ 1   // 0 - Inactive, 1 - Active 
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
               [ 0   // 0 - No change needed, 1 - Change needed
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
               [ 0,   // 0 - Open, 1 - Closed, 2 - Openning ...
                 0,   // 0 - Open, 1 - Closed
                 1    // format bool, 0 - false, 1 - true
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
               [ 1,   // 0 - Inactive, 1 - Active 
                 0,   // 0 - Inactive, 1 - Idle, 2 - Heating, 3 - Cooling
                 1,   // 0 - Auto, 1 - Heat, 2 - Cool
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
                 1,      // 0 - Inactive, 1 - Idle, 2 - Humidifying, 3 - Dehumid
                 1,      // 0 Hum or DeHum, 1 - Hum, 2 - DeHum
                 1       // 0 - Inactive, 1 - Active 
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
               [ 0,   // format Bool - false
                 60.2 // format float, Range 1-100
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
                 1,       // HOME_SCREEN
                 1,       // 0 - Not Configured, 1 - Configured
                 0        // 0 - Shown, 1 - Hidden, 2 - Stop, 3 - Rsvd
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
               [ 1,  // 0 - Inactive, 1 - Active 
                 0,  // 0 - None Scheduled, 1 - Scheduled, 2 - Manual Schedule
                 1   // 0 - Not in use, 1 - In Use
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
               [ 0,   // format Bool - false
                 0    // 0 - Leak not detected, 1 - Leak Detected
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
               [ 0,   // format Bool - false
                 1    // float, Range 0.0001 - 100000 (lux)
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
               [ 0   // Format bool, 0 - false, 1 - true
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
               [ 0,   // 0 - Open, 1 - Closed, 2 - Openning ...
                 0,    // format TLV8
                 0     // format string   
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
               [ 0,   // 0 - Unsecured, 1 - Secured, 2 - Jammed ...
                 0    // 0 - Unsecure,  1 - Secure
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
               [ 0   // Format bool, 0 - Mute is off, 1 - Mute is on
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
               [ 0,   // format Bool, 0 - false
                 0    // format Bool, 0 - false
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
               [ 0,   // format Bool, 0 - false
                 0    // format Bool, 0 - false
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
               [ 0,  // format Bool, 0 - false
                 0   // format Bool, 0 - false
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
                 CMD4_ACC_TYPE_ENUM.RelayState,
                 CMD4_ACC_TYPE_ENUM.RelayControlPoint],
            defaultValues:
               [ 1,   // Format bool, 0 - false
                 1,   // Format uint8, Values ???
                 0    // TLV8
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
               [ 3,   // 0 - Stay Arm, 1 - Away, 2 - Night Arm, 3 - Disarm ...
                 0    // 0 - Stay Arm, 1 = Away, 2 - Night
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
               [ 0    // 0 - Dots, 1.- Arabic, 2+ - Rsvd
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
               [ 0,   // 0 - Horizontal, 1 - Vertical
                 0    // 0 - Fixed, 1 - Jammed, 2 - Swinging
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
               [ 0,   // format Bool, 0 - false
                 0    // format Bool, 0 - false
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
               [ 0   // Format bool, 0 - Mute is off, 1 - Mute is on
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
               [ 0,   // 0 - Single Press, 1 - Double Press, 2 - Long Press
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
               [ 0   // 0 - Single Press, 1 - Double Press, 2 - Long Press
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
               [ 0   // Format bool, 0 - false, 1 - true
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
               [ 1,         // 0 - Inactive, 1 - Active 
                 123,       // Format uint32
                 'My_Tv',   // Format string
                 1          // 0 - Not Discoverable, 1 - Discoverable
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
               [ 1,  // 0 - Inactive, 1 - Active 
                 0,  // Min 0, Max 100, step 1
                 0,  // 0 - None, 1 - Relative, 2 - RelativeCurrent 3 - Absolute
                 1,  // 0 - Decrement, 1 - Increment
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
               [ 0,    // format Bool, 0 - false
                 50.0  // format float, 0 - 100, by 0.1
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
               [ 0,    // 0 - Off, 1 - Heat, 2 - Cool
                 0,    // 0 - Off, 1 - Heat, 2 - Cool
                 50.0, // format float, Range 0 - 100, step 0.1 (Celcius
                 50.0, // format float, Range 0 - 100, step 0.1 (Celcius
                 0     // 0 - Celcius, 1 - Fehrenheit
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
                 0          // Format bool
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
               [ 'My_TunnelB', // Format string
                 'TLB',         // Format string
                 0.0,           // Format float
                 0,             // Format bool, 0 - false
                 0,             // Format bool, 0 - false
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
               [ 1,  // 0 - Inactive, 1 - Active 
                 1,  // 0 - Not in use, 1 - In use
                 0   // 0 - Generic, 1 - Irrigation, 2 - Shower, 3 - Faucet
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
                 2,   // 0 - Decreasing, 1 - Increasing, 2 - Stopped
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
                 2,   // 0 - Decreasing, 1 - Increasing, 2 - Stopped
                 0,   // Range 0 - 100
                ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          }
   };

   // Fill in the properties of all possible characteristics
   CMD4_ACC_TYPE_ENUM.properties =
   {
      0:   { name: "AccessoryFlags", characteristic: Characteristic.AccessoryFlags},
      1:   { name: "Active", characteristic: Characteristic.Active },
      2:   { name: "ActiveIdentifier", characteristic: Characteristic.ActiveIdentifier },
      3:   { name: "AccessoryIdentifier", characteristic: Characteristic.AccessoryIdentifier },
      4:   { name: "AdministratorOnlyAccess", characteristic: Characteristic.AdministratorOnlyAccess },
      5:   { name: "AirParticulateDensity", characteristic: Characteristic.AirParticulateDensity },
      6:   { name: "AirParticulateSize", characteristic: Characteristic.AirParticulateSize },
      7:   { name: "AirQuality", characteristic: Characteristic.AirQuality },
      8:   { name: "AudioFeedback", characteristic: Characteristic.AudioFeedback },
      9:   { name: "BatteryLevel", characteristic: Characteristic.BatteryLevel },
      10:  { name: "Brightness", characteristic: Characteristic.Brightness },
      11:  { name: "CarbonDioxideDetected", characteristic: Characteristic.CarbonDioxideDetected },
      12:  { name: "CarbonDioxideLevel", characteristic: Characteristic.CarbonDioxideLevel },
      13:  { name: "CarbonDioxidePeakLevel", characteristic: Characteristic.CarbonDioxidePeakLevel },
      14:  { name: "CarbonMonoxideDetected", characteristic: Characteristic.CarbonMonoxideDetected },
      15:  { name: "CarbonMonoxideLevel", characteristic: Characteristic.CarbonMonoxideLevel },
      16:  { name: "CarbonMonoxidePeakLevel", characteristic: Characteristic.CarbonMonoxidePeakLevel },
      17:  { name: "Category", characteristic: Characteristic.Category },
      18:  { name: "ChargingState", characteristic: Characteristic.ChargingState },
      19:  { name: "ClosedCaptions", characteristic: Characteristic.ClosedCaptions },
      20:  { name: "ColorTemperature", characteristic: Characteristic.ColorTemperature},
      21:  { name: "ConfiguredName", characteristic: Characteristic.ConfiguredName },
      22:  { name: "ConfigureBridgedAccessoryStatus", characteristic: Characteristic.ConfigureBridgedAccessoryStatus },
      23:  { name: "ConfigureBridgedAccessory", characteristic: Characteristic.ConfigureBridgedAccessory },
      24:  { name: "ContactSensorState", characteristic: Characteristic.ContactSensorState },
      25:  { name: "CoolingThresholdTemperature", characteristic: Characteristic.CoolingThresholdTemperature },
      26:  { name: "CurrentAirPurifierState", characteristic: Characteristic.CurrentAirPurifierState },
      27:  { name: "CurrentAmbientLightLevel", characteristic: Characteristic.CurrentAmbientLightLevel },
      28:  { name: "CurrentDoorState", characteristic: Characteristic.CurrentDoorState },
      29:  { name: "CurrentFanState", characteristic: Characteristic.CurrentFanState },
      30:  { name: "CurrentHeaterCoolerState", characteristic: Characteristic.CurrentHeaterCoolerState },
      31:  { name: "CurrentHeatingCoolingState", characteristic: Characteristic.CurrentHeatingCoolingState },
      32:  { name: "CurrentHorizontalTiltAngle", characteristic: Characteristic.CurrentHorizontalTiltAngle },
      33:  { name: "CurrentHumidifierDehumidifierState", characteristic: Characteristic.CurrentHumidifierDehumidifierState },
      34:  { name: "CurrentMediaState", characteristic: Characteristic.CurrentMediaState },
      35:  { name: "CurrentPosition", characteristic: Characteristic.CurrentPosition },
      36:  { name: "CurrentRelativeHumidity", characteristic: Characteristic.CurrentRelativeHumidity },
      37:  { name: "CurrentSlatState", characteristic: Characteristic.CurrentSlatState },
      38:  { name: "CurrentTemperature", characteristic: Characteristic.CurrentTemperature },
      39:  { name: "CurrentTiltAngle", characteristic: Characteristic.CurrentTiltAngle },
      40:  { name: "CurrentTime", characteristic: Characteristic.CurrentTime },
      41:  { name: "CurrentVerticalTiltAngle", characteristic: Characteristic.CurrentVerticalTiltAngle },
      42:  { name: "CurrentVisibilityState", characteristic: Characteristic.CurrentVisibilityState },
      43:  { name: "DayoftheWeek", characteristic: Characteristic.DayoftheWeek },
      44:  { name: "DigitalZoom", characteristic: Characteristic.DigitalZoom },
      45:  { name: "DiscoverBridgedAccessories", characteristic: Characteristic.DiscoverBridgedAccessories },
      46:  { name: "DiscoveredBridgedAccessories", characteristic: Characteristic.DiscoveredBridgedAccessories },
      47:  { name: "DisplayOrder", characteristic: Characteristic.DisplayOrder },
      48:  { name: "FilterChangeIndication", characteristic: Characteristic.FilterChangeIndication },
      49:  { name: "FilterLifeLevel", characteristic: Characteristic.FilterLifeLevel },
      50:  { name: "FirmwareRevision", characteristic: Characteristic.FirmwareRevision },
      51:  { name: "HardwareRevision", characteristic: Characteristic.HardwareRevision },
      52:  { name: "HeatingThresholdTemperature", characteristic: Characteristic.HeatingThresholdTemperature },
      53:  { name: "HoldPosition", characteristic: Characteristic.HoldPosition },
      54:  { name: "Hue", characteristic: Characteristic.Hue},
      55:  { name: "Identify", characteristic: Characteristic.Identify },
      56:  { name: "ImageMirroring", characteristic: Characteristic.ImageMirroring },
      57:  { name: "ImageRotation", characteristic: Characteristic.ImageRotation },
      58:  { name: "InputDeviceType", characteristic: Characteristic.InputDeviceType },
      59:  { name: "InputSourceType", characteristic: Characteristic.InputSourceType },
      60:  { name: "InUse", characteristic: Characteristic.InUse },
      61:  { name: "IsConfigured", characteristic: Characteristic.IsConfigured },
      62:  { name: "LeakDetected", characteristic: Characteristic.LeakDetected },
      63:  { name: "LinkQuality", characteristic: Characteristic.LinkQuality },
      64:  { name: "LockControlPoint", characteristic: Characteristic.LockControlPoint },
      65:  { name: "LockCurrentState", characteristic: Characteristic.LockCurrentState },
      66:  { name: "LockLastKnownAction", characteristic: Characteristic.LockLastKnownAction },
      67:  { name: "LockManagementAutoSecurityTimeout", characteristic: Characteristic.LockManagementAutoSecurityTimeout },
      68:  { name: "LockPhysicalControls", characteristic: Characteristic.LockPhysicalControls },
      69:  { name: "LockTargetState", characteristic: Characteristic.LockTargetState },
      70:  { name: "Logs", characteristic: Characteristic.Logs },
      71:  { name: "Manufacturer", characteristic: Characteristic.Manufacturer },
      72:  { name: "Model", characteristic: Characteristic.Model },
      73:  { name: "MotionDetected", characteristic: Characteristic.MotionDetected },
      74:  { name: "Mute", characteristic: Characteristic.Mute },
      75:  { name: "Name", characteristic: Characteristic.Name },
      76:  { name: "NightVision", characteristic: Characteristic.NightVision },
      77:  { name: "NitrogenDioxideDensity", characteristic: Characteristic.NitrogenDioxideDensity },
      78:  { name: "ObstructionDetected", characteristic: Characteristic.ObstructionDetected },
      79:  { name: "OccupancyDetected", characteristic: Characteristic.OccupancyDetected },
      80:  { name: "On", characteristic: Characteristic.On},
      81:  { name: "OpticalZoom", characteristic: Characteristic.OpticalZoom },
      82:  { name: "OutletInUse", characteristic: Characteristic.OutletInUse },
      83:  { name: "OzoneDensity", characteristic: Characteristic.OzoneDensity },
      84:  { name: "PairSetup", characteristic: Characteristic.PairSetup },
      85:  { name: "PairVerify", characteristic: Characteristic.PairVerify },
      86:  { name: "PairingFeatures", characteristic: Characteristic.PairingFeatures },
      87:  { name: "PairingPairings", characteristic: Characteristic.PairingPairings },
      88:  { name: "PictureMode", characteristic: Characteristic.PictureMode },
      89:  { name: "PM10Density", characteristic: Characteristic.PM10Density },
      90:  { name: "PM2_5Density", characteristic: Characteristic.PM2_5Density },
      91:  { name: "PositionState", characteristic: Characteristic.PositionState },
      92:  { name: "PowerModeSelection", characteristic: Characteristic.PowerModeSelection },
      93:  { name: "ProgramMode", characteristic: Characteristic.ProgramMode },
      94:  { name: "ProgrammableSwitchOutputState", characteristic: Characteristic.ProgrammableSwitchOutputState },
      95:  { name: "Reachable", characteristic: Characteristic.Reachable },
      96:  { name: "ProgrammableSwitchEvent", characteristic: Characteristic.ProgrammableSwitchEvent },
      97:  { name: "RelativeHumidityDehumidifierThreshold", characteristic: Characteristic.RelativeHumidityDehumidifierThreshold },
      98:  { name: "RelativeHumidityHumidifierThreshold", characteristic: Characteristic.RelativeHumidityHumidifierThreshold },
      99:  { name: "RelayEnabled", characteristic: Characteristic.RelayEnabled },
      100: { name: "RelayState", characteristic: Characteristic.RelayState },
      101: { name: "RelayControlPoint", characteristic: Characteristic.RelayControlPoint },
      102: { name: "RemainingDuration", characteristic: Characteristic.RemainingDuration },
      103: { name: "RemoteKey", characteristic: Characteristic.RemoteKey },
      104: { name: "ResetFilterIndication", characteristic: Characteristic.ResetFilterIndication },
      105: { name: "RotationDirection", characteristic: Characteristic.RotationDirection },
      106: { name: "RotationSpeed", characteristic: Characteristic.RotationSpeed },
      107: { name: "Saturation", characteristic: Characteristic.Saturation},
      108: { name: "SecuritySystemAlarmType", characteristic: Characteristic.SecuritySystemAlarmType },
      109: { name: "SecuritySystemCurrentState", characteristic: Characteristic.SecuritySystemCurrentState },
      110: { name: "SecuritySystemTargetState", characteristic: Characteristic.SecuritySystemTargetState },
      111: { name: "SelectedRTPStreamConfiguration", characteristic: Characteristic.SelectedRTPStreamConfiguration },
      112: { name: "SerialNumber", characteristic: Characteristic.SerialNumber },
      113: { name: "ServiceLabelIndex", characteristic: Characteristic.ServiceLabelIndex },
      114: { name: "ServiceLabelNamespace", characteristic: Characteristic.ServiceLabelNamespace },
      115: { name: "SetDuration", characteristic: Characteristic.SetDuration },
      116: { name: "SetupEndpoints", characteristic: Characteristic.SetupEndpoints },
      117: { name: "SlatType", characteristic: Characteristic.SlatType },
      118: { name: "SleepDiscoveryMode", characteristic: Characteristic.SleepDiscoveryMode },
      119: { name: "SmokeDetected", characteristic: Characteristic.SmokeDetected },
      120: { name: "StatusActive", characteristic: Characteristic.StatusActive },
      121: { name: "StatusFault", characteristic: Characteristic.StatusFault },
      122: { name: "StatusJammed", characteristic: Characteristic.StatusJammed },
      123: { name: "StatusLowBattery", characteristic: Characteristic.StatusLowBattery },
      124: { name: "StatusTampered", characteristic: Characteristic.StatusTampered },
      125: { name: "StreamingStatus", characteristic: Characteristic.StreamingStatus },
      126: { name: "SulphurDioxideDensity", characteristic: Characteristic.SulphurDioxideDensity },
      127: { name: "SupportedAudioStreamConfiguration", characteristic: Characteristic.SupportedAudioStreamConfiguration },
      128: { name: "SupportedRTPConfiguration", characteristic: Characteristic.SupportedRTPConfiguration },
      129: { name: "SupportedVideoStreamConfiguration", characteristic: Characteristic.SupportedVideoStreamConfiguration },
      130: { name: "SwingMode", characteristic: Characteristic.SwingMode },
      131: { name: "TargetAirPurifierState", characteristic: Characteristic.TargetAirPurifierState },
      132: { name: "TargetAirQuality", characteristic: Characteristic.TargetAirQuality },
      133: { name: "TargetDoorState", characteristic: Characteristic.TargetDoorState },
      134: { name: "TargetFanState", characteristic: Characteristic.TargetFanState },
      135: { name: "TargetHeaterCoolerState", characteristic: Characteristic.TargetHeaterCoolerState },
      136: { name: "TargetHeatingCoolingState", characteristic: Characteristic.TargetHeatingCoolingState },
      137: { name: "TargetHorizontalTiltAngle", characteristic: Characteristic.TargetHorizontalTiltAngle },
      138: { name: "TargetHumidifierDehumidifierState", characteristic: Characteristic.TargetHumidifierDehumidifierState },
      139: { name: "TargetMediaState", characteristic: Characteristic.TargetMediaState },
      140: { name: "TargetPosition", characteristic: Characteristic.TargetPosition },
      141: { name: "TargetRelativeHumidity", characteristic: Characteristic.TargetRelativeHumidity },
      142: { name: "TargetSlatState", characteristic: Characteristic.TargetSlatState },
      143: { name: "TargetTemperature", characteristic: Characteristic.TargetTemperature },
      144: { name: "TargetTiltAngle", characteristic: Characteristic.TargetTiltAngle },
      145: { name: "TargetVerticalTiltAngle", characteristic: Characteristic.TargetVerticalTiltAngle },
      146: { name: "TargetVisibilityState", characteristic: Characteristic.TargetVisibilityState },
      147: { name: "TemperatureDisplayUnits", characteristic: Characteristic.TemperatureDisplayUnits },
      148: { name: "TimeUpdate", characteristic: Characteristic.TimeUpdate },
      149: { name: "TunneledAccessoryAdvertising", characteristic: Characteristic.TunneledAccessoryAdvertising },
      150: { name: "TunneledAccessoryConnected", characteristic: Characteristic.TunneledAccessoryConnected },
      151: { name: "TunneledAccessoryStateNumber", characteristic: Characteristic.TunneledAccessoryStateNumber },
      152: { name: "TunnelConnectionTimeout", characteristic: Characteristic.TunnelConnectionTimeout },
      153: { name: "ValveType", characteristic: Characteristic.ValveType },
      154: { name: "Version", characteristic: Characteristic.Version },
      155: { name: "VOCDensity", characteristic: Characteristic.VOCDensity },
      156: { name: "Volume", characteristic: Characteristic.Volume },
      157: { name: "VolumeControlType", characteristic: Characteristic.VolumeControlType },
      158: { name: "VolumeSelector", characteristic: Characteristic.VolumeSelector },
      159: { name: "WaterLevel", characteristic: Characteristic.WaterLevel }
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

   this.reachable = true;
   this.foundAccessories = [];

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
      let that = this;


      this.log("Fetching config.json devices.");
      for( let i=0; i<this.config.accessories.length; i++ )
      {
         // This will create an accessory based on the Cmd4Accessory
         // definition bellow. This is not obvious for a newbie.
         this.log("Processing accessory " + this.config.accessories[i].name);
         let accessory = new Cmd4Accessory( that.log, that.config, this.config.accessories[i] );

         this.foundAccessories.push( accessory );
  
         if ( accessory.polling && accessory.state_cmd)
         {  
            switch (getType(accessory.polling))
            {
               case 'Array':
                  this.log.debug("Characteristic polling for '%s'", accessory.name);
                  this.setupCharacteristicPolling(accessory);
                  break;
               case 'String':
                  this.log.debug("State polling for '%s'", accessory.name);
                  this.setupStatePollingPerAccessory(accessory);
                  break;
               default:
                  this.log("CMD4 Error: Something wrong with value of polling '%s'", accessory.polling);
                  this.log("            Check your config.json for errors.");
                  process.exit(1);
             }
          }
      }
      callback(this.foundAccessories);
   }
}

Cmd4Platform.prototype.characteristicPolling = function (accessory, accTypeEnumIndex, timeout, interval)
{
   let self = accessory;


   self.log.debug("Doing Poll of index:%s characteristic:%s for '%s' timeout=%s interval=%s", accTypeEnumIndex,
          CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name, self.name, timeout, interval);

   // Make sure that the characteristic exists
   if ( accTypeEnumIndex < 0 )
   {
      self.log("CMD4 WARNING: No such polling accTypeEnumIndex '%d' for '%s'",
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

   self.log.debug("Setting up '%s' polling characteristics of accessory '%s'",
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
                   this.log.warn("Timeout for '%s' is in milliseconds. A value of '%d' seems pretty low.",
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
                  self.log("CMD4 WARNING: No such polling characteristic '%s' for '%'",
                       key, self.name);
                   continue;
               }
          }
      }

      self.log.debug("Setting up '%s' for polling of '%s' timeout=%s interval=%s", self.name, CMD4_ACC_TYPE_ENUM.properties[ucKeyIndex].name, timeout, interval);

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
   let pollingCharacteristicsArray = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex].defaultPollingCharacteristics;
   
   for (let index = 0; index < pollingCharacteristicsArray.length; index++)
   {
      let accTypeEnumIndex = pollingCharacteristicsArray[index];
      this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
               this, accessory, accTypeEnumIndex, accessory.timeout, accessory.interval), accessory.interval);
   }
}

function Cmd4Accessory(log, platformConfig, accessoryConfig, status ) 
{

   this.config = accessoryConfig;
   this.log = log;

   // Instead of local variables for every characteristic, create an array to
   // hold values for  all characteristics based on the size of all possible characteristics.
   this.storedValuesPerCharacteristic = new Array(CMD4_ACC_TYPE_ENUM.EOL).fill(null);
    
    
   // If polling is defined it is set to true, otherwise false.
   this.polling = this.config.polling === true;

   for (let key in this.config)
   {
      let value = this.config[key];

      // I made the stupid mistake of not havin all characteristics in the config.json
      // file not upper case to match that in State.js. So instead of having everyone
      // fix the their scripts, fix it here.
      let ucKey = ucFirst(key);

      switch (ucKey)
      {
         case 'Type':
            this.type = value;
            this.ucType = ucFirst(value);
            this.typeIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum(i => i.deviceName === this.ucType);
            if (this.typeIndex < 0)
            {
               this.log ("CMD4 Error: Unknown device type '%s' for %s", this.type, this.name);
               process.exit(1);
            }
            break;
         case 'Name':
            this.name = value;
            this.UUID = UUIDGen.generate(this.name);
            this.displayName = this.name;  //fakegato-history uses displayName
            break;
         case 'Model':
            this.model = value;
            this.log.debug("Setting model to '%s'", value);
            break;
         case 'Timeout':
            // Timers are in milliseconds. A low value can result in failure to get/set values
            this.timeout = parseInt(value, 10);
            if (this.timeout < 500)
            {
               this.log.warn("Timeout for '%s' is in milliseconds. A value of '%d' seems pretty low.",
                  this.config.name, this.timeout);
            }
            break;
         case 'Polling':
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
            // What this plugin is all about
            this.state_cmd = value;
            
            // Solve some issues people have encounterred who
            // have had problems with shell completion which is
            // only available from shell expansion.
            
            
            // Split the state_cmd into words.
            let cmdArray = this.state_cmd.match(/\S+/gi);
            
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
                    process.exit(1);
                    break;
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
                    
                    // Purposely fall through to check the command as well  
                }
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
            this.fakegatoConfig = value;
            break;
         default:
         {
            let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
            
            if (accTypeEnumIndex < 0 )
            {
              this.log("OOPS: '%s' not found. There something wrong with your config.json file?", key);
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
            } else {
               this.setStoredValueForIndex(accTypeEnumIndex, value);
            }
         }
      }
   }

   // The information service
   // For multiple accessories of the same type, it is important that the accessory
   // has a unique serial number, so append the config.name.
   this.informationService = new Service.AccessoryInformation();
   this.informationService
       .setCharacteristic(Characteristic.Manufacturer, "Cmd4")
       .setCharacteristic(Characteristic.Model, this.config.model )
       .setCharacteristic(Characteristic.SerialNumber, "Cmd4 " + this.config.type + this.config.name);

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

   // Make sure the default characteristics will be included
   let properties = CMD4_DEVICE_TYPE_ENUM.properties[this.typeIndex];   
   let numberOfRequiredCharacteristics = properties.requiredCharacteristics.length;
   
   for (let index = 0; index < numberOfRequiredCharacteristics; index ++)
   {
      let value = properties.defaultValues[index];
      let req = properties.requiredCharacteristics[index];
      
      if ( ! this.getStoredValueForIndex( req ))
      {
         this.log("Adding default characteristic %s for %s", CMD4_ACC_TYPE_ENUM.properties[req].name, this.name);
         this.setStoredValueForIndex(req, value);
      }
   }
   this.service = new properties.service(this.name, this.name);

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
      // For the accessory, only acknowledge available services
      if (this.loggingService)
      {
         return [this.informationService, this.service, this.loggingService];
      }

      return [this.informationService, this.service];
   },

   setStoredValueForIndex:function (accTypeEnumIndex, value)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
      {
         this.log ("CMD4 Warning: setStoredValue - Characteristic '%s' for '%s' not known", accTypeEnumIndex, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      this.storedValuesPerCharacteristic[accTypeEnumIndex] = value;
   },

   getStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL)
      {
         this.log ("CMD4 Warning: getStoredValue - Characteristic '%s' for '%s' not known", accTypeEnumIndex, this.name);
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

      if ( getType(pollingConfig) != 'Array' )
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
                     this.log.warn("Timeout for '%s' is in milliseconds. A value of '%d' seems pretty low.",
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
                    this.log("OOPS: '%s' not found. There something wrong with your config.json file?", key);
                    process.exit(1);
                  } else {
                     if ( this.getStoredValueForIndex(accTypeEnumIndex) == undefined )
                     {
                        this.log.warn("Polling for '%s' requested, but characteristic ", key);
                        this.log.warn("is not in your config.json file for '%s'", this.name);
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

      let cmd = self.state_cmd + " Set '" + self.name + "' '" + characteristicString  + "' '" + value  + "'";
      self.log.debug("setValue %s function for: %s cmd: %s", characteristicString, self.name, cmd);

      
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
                  self.log.warn("Characteristic is null for name:%s type: %s.",
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


      self.log.debug("getValue accTypeEnumIndex:(%s)-'%s' function for: %s cmd: %s", accTypeEnumIndex, characteristicString, self.name, cmd);

      // Execute command to Get a characteristics value for an accessory
      let child = exec(cmd, {timeout:self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("getGeneric %s function for: %s cmd: %s failed.", characteristicString, self.name, cmd);
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
               self.log("getValue %s function for: %s returned no value", characteristicString, self.name);
               callback( -1, 0 );
            } else {
               if (words.length >=2)
               {
                  self.log.warn("Warning, Retrieving %s, expected only one word value for: %s, using first of: '%s'", characteristicString,self.name, stdout);
               }
         
               self.log.debug("getValue %s function for: %s returned: '%s'", characteristicString, self.name, words[0]);
         

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
                  // self.log( "getValue Retrieved %s %s for: %s. translated to %f", characteristicString, words[0], self.name, value);
           
                  // Store history using fakegato if set up
                  self.updateAccessoryAttribute(accTypeEnumIndex, value);

                  callback(null,value);
               } else {
                  let lowerCaseWord = words[0].toLowerCase();

                  if (lowerCaseWord  == "true" || lowerCaseWord == "on")
                  {
                     // self.log( "getValue Retrieved %s %s for: %s. translated to 1", characteristicString, words[0], self.name);
                     value = 1;
              
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(accTypeEnumIndex, value);
              
                     callback(null,value);
                  } else if (lowerCaseWord == "false" || lowerCaseWord == "off")
                  {
                     // self.log( "getValue Retrieved %s %s for: %s. translated to 0", characteristicString, words[0], self.name);
                     value = 0;
              
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(accTypeEnumIndex, value);
              
                     callback(null,value);
                  } else {
                     // self.log( "getValue Retrieved %s %s for: %s.", characteristicString, words[0], self.name);
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

        for (let accTypeEnumIndex = 0;
               accTypeEnumIndex < len; 
               accTypeEnumIndex++ )
        {
            if ( this.storedValuesPerCharacteristic[accTypeEnumIndex] != undefined)
            {
               this.log.debug("Found characteristic '%s' for '%s'", 
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name, this.name);             
               
               if ( ! service.testCharacteristic(
                    CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic))
               {
                   service.addCharacteristic(
                      CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].
                      characteristic );
               }
                
               perms = service.getCharacteristic(
                  CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex]
                  .characteristic).props.perms;

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
         this.log ("Internal error.: updateAccessoryAttribute - accTypeEnumIndex '%s' for '%s' not known", accTypeEnumIndex, this.name);
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

               this.log.debug("Logging power '%s'", firstParmValue);
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
         

               this.log.debug("Logging temp '%s' humidity '%s' ppm '%s'", firstParmValue, secondParmValue, thirdParmValue);
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
         
               this.log.debug("Logging temp '%s' pressure '%s' humidity '%s'", firstParmValue, secondParmValue, thirdParmValue);

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

               this.log.debug("Logging status '%s'", firstParmValue);
                      
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

               this.log.debug("Logging status '%s'", firstParmValue);
                      
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
         
               this.log.debug("Logging currentTemp '%s' setTemp '%s' valvePosition '%s'", firstParmValue, secondParmValue, thirdParmValue);
               
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
                  
               this.log.debug("Logging status '%s' waterAmount '%s'", firstParmValue, secondParmValue);
               
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
                       this.log("Invalid fakegato eve type '%s'", value);
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
                    this.log.warn("Not a valid characteristic '%s' for fakegato to log of '%s'", value, key);
                 break;
              }
              default:
                 this.log("Invalid fakegato key '%s' in json.config for %s ", key, this.name);
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
            this.log.warn("config.storage='%s' for '%s' set but polling is not enabled.",
              this.storage, this.name);
            this.log.warn("      History will not be updated continiously.");
        
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

// Used to determine if polling is done by characteristic or by accessory
function getType( oObj )
{
    if ( !!oObj && typeof oObj === "object" )
    {
       // Check if it is an alien object, for example created as {world:'hello'}
       if ( typeof oObj.constructor !== "function" )
       {      
          return 'Object';
       }

      return oObj.constructor.name;
    }

    return 'String';
}
 
function ucFirst( string )
{
   if ( string )
      return string.charAt(0).toUpperCase() + string.slice( 1 );
   else {
      console.log( "Asked to upper  case first character of NULL String" );
      return "undefined";
   }
}

function isNumeric( num ){
   num = "" + num; // coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}
