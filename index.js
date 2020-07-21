'use strict';
const exec = require("child_process").exec;
const moment = require('moment');
const fs = require('fs');
const commandExistsSync = require('command-exists').sync;
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
   
   foundAccessories = [];


   // If you see these lines in other plugins with true, at the end,
   // you would provide a configurationRequestHandler to add/Remove
   // individual accessories. I believe this is old school as HomeKit
   // does not let you do this anymore.
   homebridge.registerAccessory('homebridge-cmd4', 'Cmd4', Cmd4Accessory);
   homebridge.registerPlatform('homebridge-cmd4', 'Cmd4', Cmd4Platform);

   FakeGatoHistoryService = require('fakegato-history')(homebridge);

 
   // Fill in the properties of all possible characteristics
   // props was added because calling getCharacteridtic().props.perms adds
   // the characteristic in by default. This costs some lines, but is advantageous.
   CMD4_ACC_TYPE_ENUM.properties =
   {
      0:   { type: "AccessoryFlags",
             characteristic: Characteristic.AccessoryFlags,
             props: {format: Characteristic.Formats.UINT32,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      1:   { type: "Active",
             characteristic:Characteristic.Active,
             props:
                {format: Characteristic.Formats.UINT8,
                 maxValue: 1,
                 minValue: 0,
                 perms: [Characteristic.Perms.READ,
                         Characteristic.Perms.WRITE,
                         Characteristic.Perms.NOTIFY
                        ]
                },
             validValues:   // Checked 04/24/2020
                {"INACTIVE": Characteristic.Active.INACTIVE,
                 "ACTIVE":   Characteristic.Active.ACTIVE
                }
           },
      2:   { type: "ActiveIdentifier",   // HomeKitTypes-Television.js
             characteristic: Characteristic.ActiveIdentifier,
             props: {format: Characteristic.Formats.UINT32,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      3:   { type: "AccessoryIdentifier",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.AccessoryIdentifier,
             props: {format: Characteristic.Formats.STRING,
                perms: [Characteristic.Perms.READ
                       ]
                    },
             validValues: {}
           },
      4:   { type: "AdministratorOnlyAccess",
             characteristic: Characteristic.AdministratorOnlyAccess,
             props: {format: Characteristic.Formats.BOOL,
                      perms: [Characteristic.Perms.READ,
                              Characteristic.Perms.WRITE,
                              Characteristic.Perms.NOTIFY
                             ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":   true
                }
           },
      5:   { type: "AirParticulateDensity",
             characteristic: Characteristic.AirParticulateDensity,
             props: {format: Characteristic.Formats.FLOAT,
                   maxValue: 1000,
                   minValue: 0,
                    minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      6:   { type: "AirParticulateSize",
             characteristic: Characteristic.AirParticulateSize,
             props: {format: Characteristic.Formats.UINT8,
                   maxValue: 1,
                   minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"_2_5_M": Characteristic.AirParticulateSize._2_5_M,
                 "_10_M":  Characteristic.AirParticulateSize._10_M
                }
           },
      7:   { type: "AirQuality",
             characteristic: Characteristic.AirQuality,
             props: {format: Characteristic.Formats.UINT8,
                   maxValue: 5,
                   minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"UNKNOWN":   Characteristic.AirQuality.UNKNOWN,
                 "EXCELLENT": Characteristic.AirQuality.EXCELLENT,
                           "GOOD":      Characteristic.AirQuality.GOOD,
                           "FAIR":      Characteristic.AirQuality.FAIR,
                           "INFERIOR":  Characteristic.AirQuality.INFERIOR,
                           "POOR":      Characteristic.AirQuality.POOR
                }
           },
      8:   { type: "AudioFeedback",
             characteristic: Characteristic.AudioFeedback,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      9:   { type: "BatteryLevel",
             characteristic: Characteristic.BatteryLevel,
             props: {format: Characteristic.Formats.UINT8,
                       unit: Characteristic.Units.PERCENTAGE,
                   maxValue: 100,
                   minValue: 0,
                    minStep: 1,
                      perms: [Characteristic.Perms.READ,
                              Characteristic.Perms.NOTIFY
                             ]
                    },
             validValues: {}
           },
      10:  { type: "Brightness",
             characteristic: Characteristic.Brightness,
             props: {format: Characteristic.Formats.INT,
                       unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                      minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      11:  { type: "CarbonDioxideDetected",
             characteristic: Characteristic.CarbonDioxideDetected,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CO2_LEVELS_NORMAL":
                  Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL,
                 "CO2_LEVELS_ABNORMAL":
                  Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
                }
           },
      12:  { type: "CarbonDioxideLevel",
             characteristic: Characteristic.CarbonDioxideLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100000,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      13:  { type: "CarbonDioxidePeakLevel",
             characteristic: Characteristic.CarbonDioxidePeakLevel,
             props: {format: Characteristic.Formats.FLOAT,
                   maxValue: 100000,
                   minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      14:  { type: "CarbonMonoxideDetected",
             characteristic: Characteristic.CarbonMonoxideDetected,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CO_LEVELS_NORMAL":
                  Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL,
                 "CO_LEVELS_ABNORMAL":
                  Characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL
                }
           },
      15:  { type: "CarbonMonoxideLevel",
             characteristic: Characteristic.CarbonMonoxideLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      16:  { type: "CarbonMonoxidePeakLevel",
             characteristic: Characteristic.CarbonMonoxidePeakLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      17:  { type: "Category",    // HomeKitTypes-Bridge.js
             characteristic: Characteristic.Category,
             props: {format: Characteristic.Formats.UINT16,
                     maxValue: 16,
                     minValue: 1,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      18:  { type: "ChargingState",
             characteristic: Characteristic.ChargingState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
         validValues:   // Checked 04/24/2020. Note: HomeKit Spec has inProgress, Not CHARGING
                {"NOT_CHARGING": Characteristic.ChargingState.NOT_CHARGING,
                 "CHARGING": Characteristic.ChargingState.CHARGING,
                 "NOT_CHARGEABLE":Characteristic.ChargingState.NOT_CHARGEABLE
                }
           },
      19:  { type: "ClosedCaptions",    // HomeKitTypes-Television.js
             characteristic: Characteristic.ClosedCaptions,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"DISABLED": Characteristic.ClosedCaptions.DISABLED,
                 "ENABLED":  Characteristic.ClosedCaptions.ENABLED
                }
           },
      20:  { type: "ColorTemperature",
             characteristic: Characteristic.ColorTemperature,
             props: {format: Characteristic.Formats.UINT32,
                     maxValue: 500,
                     minValue: 140,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      21:  { type: "ConfiguredName",    // HomeKitTypes-Television.js
             characteristic: Characteristic.ConfiguredName,
             props: {format: Characteristic.Formats.STRING,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      22:  { type: "ConfigureBridgedAccessoryStatus",    // HomeKitTypes-Bridge.js
             characteristic: Characteristic.ConfigureBridgedAccessoryStatus,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      23:  { type: "ConfigureBridgedAccessory",    // HomeKitTypes-Bridge.js
             characteristic: Characteristic.ConfigureBridgedAccessory,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      24:  { type: "ContactSensorState",
             characteristic: Characteristic.ContactSensorState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CONTACT_DETECTED": Characteristic.ContactSensorState.CONTACT_DETECTED,
                 "CONTACT_NOT_DETECTED": Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                }
           },
      25:  { type: "CoolingThresholdTemperature",
             characteristic: Characteristic.CoolingThresholdTemperature,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.CELSIUS,
                     maxValue: 35,
                     minValue: 10,
                     minStep: 0.1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      26:  { type: "CurrentAirPurifierState",
             characteristic: Characteristic.CurrentAirPurifierState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"INACTIVE": Characteristic.CurrentAirPurifierState.INACTIVE,
                 "IDLE": Characteristic.CurrentAirPurifierState.IDLE,
                 "PURIFYING_AIR":Characteristic.CurrentAirPurifierState.PURIFYING_AIR
                }
           },
      27:  { type: "CurrentAmbientLightLevel",
             characteristic: Characteristic.CurrentAmbientLightLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.LUX,
                     maxValue: 100000,
                     minValue: 0.0001,
                     perms: [Characteristic.Perms.READ, 
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      28:  { type: "CurrentDoorState",
             characteristic: Characteristic.CurrentDoorState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 4,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OPEN":    Characteristic.CurrentDoorState.OPEN,
                 "CLOSED":  Characteristic.CurrentDoorState.CLOSED,
                 "OPENING": Characteristic.CurrentDoorState.OPENING,
                 "CLOSING": Characteristic.CurrentDoorState.CLOSING,
                 "STOPPED": Characteristic.CurrentDoorState.STOPPED
                }
           },
      29:  { type: "CurrentFanState",
             characteristic: Characteristic.CurrentFanState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"INACTIVE":    Characteristic.CurrentFanState.INACTIVE,
                 "IDLE":        Characteristic.CurrentFanState.IDLE,
                 "BLOWING_AIR": Characteristic.CurrentFanState.BLOWING_AIR
                }
           },
      30:  { type: "CurrentHeaterCoolerState",
             characteristic: Characteristic.CurrentHeaterCoolerState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"INACTIVE": Characteristic.CurrentHeaterCoolerState.INACTIVE,
                 "IDLE":     Characteristic.CurrentHeaterCoolerState.IDLE,
                 "HEATING":  Characteristic.CurrentHeaterCoolerState.HEATING,
                 "COOLING":  Characteristic.CurrentHeaterCoolerState.COOLING
                }
           },
      31:  { type: "CurrentHeatingCoolingState",
             characteristic: Characteristic.CurrentHeatingCoolingState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"OFF":  Characteristic.CurrentHeatingCoolingState.OFF,
                 "HEAT": Characteristic.CurrentHeatingCoolingState.HEAT,
                 "COOL": Characteristic.CurrentHeatingCoolingState.COOL,
                 "AUTO": Characteristic.CurrentHeatingCoolingState.AUTO
                }
           },
      32:  { type: "CurrentHorizontalTiltAngle",
             characteristic: Characteristic.CurrentHorizontalTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 90,
                     minValue: -90,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      33:  { type: "CurrentHumidifierDehumidifierState",
             characteristic: Characteristic.CurrentHumidifierDehumidifierState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"INACTIVE":      Characteristic.CurrentHumidifierDehumidifierState.INACTIVE,
                 "IDLE":          Characteristic.CurrentHumidifierDehumidifierState.IDLE,              
                 "HUMIDIFYING":   Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
                 "DEHUMIDIFYING": Characteristic.CurrentHumidifierDehumidifierState.DEHUMIDIFYING
             }
           },
      34:  { type: "CurrentMediaState",   // HomKitTypes-Television.js
             characteristic: Characteristic.CurrentMediaState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 5,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             // HomeKit forgets to define these
             validValues: {"PLAY":        Characteristic.CurrentMediaState.PLAY,
                           "PAUSE":       Characteristic.CurrentMediaState.PAUSE,
                           "STOP":        Characteristic.CurrentMediaState.STOP,
                           "UNKNOWN3":    3,
                           "LOADING":     Characteristic.CurrentMediaState.LOADING,
                           "INTERRUPTED": Characteristic.CurrentMediaState.INTERRUPTED}
           },
      35:  { type: "CurrentPosition",
             characteristic: Characteristic.CurrentPosition,
             props: {format: Characteristic.Formats.UINT8,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      36:  { type: "CurrentRelativeHumidity",
             characteristic: Characteristic.CurrentRelativeHumidity,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      37:  { type: "CurrentSlatState",
             characteristic: Characteristic.CurrentSlatState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020  Note HomeKit Spec has "Stationary" not "Jammed"
                {"FIXED":    Characteristic.CurrentSlatState.FIXED,
                 "JAMMED":   Characteristic.CurrentSlatState.JAMMED,
                 "SWINGING": Characteristic.CurrentSlatState.SWINGING
                }
           },
      38:  { type: "CurrentTemperature",
             characteristic: Characteristic.CurrentTemperature,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.CELSIUS,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 0.1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      39:  { type: "CurrentTiltAngle",
             characteristic: Characteristic.CurrentTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 90,
                     minValue: -90,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      40:  { type: "CurrentTime",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.CurrentTime,
             props: {format: Characteristic.Formats.STRING,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      41:  { type: "CurrentVerticalTiltAngle",
             characteristic: Characteristic.CurrentVerticalTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 90,
                     minValue: -90,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      42:  { type: "CurrentVisibilityState",    // HomeKitTypes-Television.js
             characteristic: Characteristic.CurrentVisibilityState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                         },
             validValues:
                {"SHOWN":    Characteristic.CurrentVisibilityState.SHOWN,
                 "HIDDEN":   Characteristic.CurrentVisibilityState.HIDDEN,
                 "UNKNOWN2": 2,   // HomeBridge defines 4 valid values
                 "UNKNOWN3": 3
                }
           },
      43:  { type: "DayoftheWeek",    // HomeKitTypes-Bridge.js
             characteristic: Characteristic.DayoftheWeek,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 7,
                     minValue: 1,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      44:  { type: "DigitalZoom",
             characteristic: Characteristic.DigitalZoom,
             props: {format: Characteristic.Formats.FLOAT,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      45:  { type: "DiscoverBridgedAccessories",   // HomKitTypes-Bridge.js
             characteristic: Characteristic.DiscoverBridgedAccessories,
             props: {format: Characteristic.Formats.UINT8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:{}
           },
      46:  { type: "DiscoveredBridgedAccessories",   // HomKitTypes-Bridge.js
             characteristic: Characteristic.DiscoveredBridgedAccessories,
             props: {format: Characteristic.Formats.UINT16,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      47:  { type: "DisplayOrder",   // HomKitTypes-Television.js
             characteristic: Characteristic.DisplayOrder,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      48:  { type: "FilterChangeIndication",
             characteristic: Characteristic.FilterChangeIndication,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020.  HomeKit Spec has these as "notNeeded" and "needed"
                {"FILTER_OK": Characteristic.FilterChangeIndication.FILTER_OK,
                 "CHANGE_FILTER":Characteristic.FilterChangeIndication.CHANGE_FILTER
                }
           },
      49:  { type: "FilterLifeLevel",
             characteristic: Characteristic.FilterLifeLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      50:  { type: "FirmwareRevision",
             characteristic: Characteristic.FirmwareRevision,
             props: {format: Characteristic.Formats.STRING,
                perms: [Characteristic.Perms.READ
                       ]
                    },
             validValues: {}
           },
      51:  { type: "HardwareRevision",
             characteristic: Characteristic.HardwareRevision,
             props: {format: Characteristic.Formats.STRING,
                perms: [Characteristic.Perms.READ
                       ]
                    },
             validValues: {}
           },
      52:  { type: "HeatingThresholdTemperature",
             characteristic: Characteristic.HeatingThresholdTemperature,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.CELSIUS,
                     maxValue: 25,
                     minValue: 0,
                     minStep: 0.1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      53:  { type: "HoldPosition",
             characteristic: Characteristic.HoldPosition,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      54:  { type: "Hue",
             characteristic: Characteristic.Hue,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 360,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      55:  { type: "Identify",
             characteristic: Characteristic.Identify,
             props: {format: Characteristic.Formats.BOOL,
                perms: [Characteristic.Perms.WRITE
                       ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      56:  { type: "Identifier",   // HomeKitTypes-Television.js
             characteristic: Characteristic.Identifier,
             props: {format: Characteristic.Formats.UINT32,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      57:  { type: "ImageMirroring",
             characteristic: Characteristic.ImageMirroring,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      58:  { type: "ImageRotation",
             characteristic: Characteristic.ImageRotation,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 270,
                     minValue: 0,
                     minStep: 90,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      59:  { type: "InputDeviceType",   // HomeKitTypes-Television.js
             characteristic: Characteristic.InputDeviceType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 6,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OTHER":       Characteristic.InputDeviceType.OTHER,
                 "TV":          Characteristic.InputDeviceType.TV,
                 "RECORDING":   Characteristic.InputDeviceType.RECORDING,
                 "TUNER":       Characteristic.InputDeviceType.TUNER,
                 "PLAYBACK":    Characteristic.InputDeviceType.PLAYBACK,
                 "AUDIO_SYSTEM":Characteristic.InputDeviceType.AUDIO_SYSTEM,
                 "UNKNOWN_6":   Characteristic.InputDeviceType.UNKNOWN_6
                }
           },
      60:  { type: "InputSourceType",   // HomeKitTypes-Television.js
             characteristic: Characteristic.InputSourceType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 10,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OTHER":           Characteristic.InputSourceType.OTHER,
                 "HOME_SCREEN":     Characteristic.InputSourceType.HOME_SCREEN,
                 "TUNER":           Characteristic.InputSourceType.TUNER,
                 "HDMI":            Characteristic.InputSourceType.HDMI,
                 "COMPOSITE_VIDEO": Characteristic.InputSourceType.COMPOSITE_VIDEO,
                 "S_VIDEO":         Characteristic.InputSourceType.S_VIDEO,
                 "COMPONENT_VIDEO": Characteristic.InputSourceType.COMPONENT_VIDEO,
                 "DVI":             Characteristic.InputSourceType.DVI,
                 "AIRPLAY":         Characteristic.InputSourceType.AIRPLAY,
                 "USB":             Characteristic.InputSourceType.USB,
                 "APPLICATION":     Characteristic.InputSourceType.APPLICATION
                }
           },
      61:  { type: "InUse",
             characteristic: Characteristic.InUse,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NOT_IN_USE": Characteristic.InUse.NOT_IN_USE,
                 "IN_USE":     Characteristic.InUse.IN_USE
                }
           },
      62:  { type: "IsConfigured",
             characteristic: Characteristic.IsConfigured,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,                             
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"NOT_CONFIGURED": Characteristic.IsConfigured.NOT_CONFIGURED,
                 "CONFIGURED":     Characteristic.IsConfigured.CONFIGURED
                 }
           },
      63:  { type: "LeakDetected",
             characteristic: Characteristic.LeakDetected,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"LEAK_NOT_DETECTED": Characteristic.LeakDetected.LEAK_NOT_DETECTED,
                 "LEAK_DETECTED":     Characteristic.LeakDetected.LEAK_DETECTED
                }
           },
      64:  { type: "LinkQuality",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.LinkQuality,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 4,
                     minValue: 1,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      65:  { type: "LockControlPoint",
             characteristic: Characteristic.LockControlPoint,
             props: {format: Characteristic.Formats.TLV8,
                perms: [Characteristic.Perms.WRITE
                       ]
                    },
             validValues: {}
           },
      66:  { type: "LockCurrentState",
             characteristic: Characteristic.LockCurrentState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"UNSECURED": Characteristic.LockCurrentState.UNSECURED,
                 "SECURED":   Characteristic.LockCurrentState.SECURED,
                 "JAMMED":    Characteristic.LockCurrentState.JAMMED,
                 "UNKNOWN":   Characteristic.LockCurrentState.UNKNOWN
                }
           },
      67:  { type: "LockLastKnownAction",
             characteristic: Characteristic.LockLastKnownAction,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 8,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
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
      68:  { type: "LockManagementAutoSecurityTimeout",
             props: {format: Characteristic.Formats.UINT32,
                     unit: Characteristic.Units.SECONDS,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             characteristic: Characteristic.LockManagementAutoSecurityTimeout,
             validValues: {}
           },
      69:  { type: "LockPhysicalControls",
             characteristic: Characteristic.LockPhysicalControls,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CONTROL_LOCK_DISABLED": Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED,
                 "CONTROL_LOCK_ENABLED":  Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED
                }
           },
      70:  { type: "LockTargetState",
             characteristic: Characteristic.LockTargetState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"UNSECURED": Characteristic.LockTargetState.UNSECURED,
                 "SECURED":   Characteristic.LockTargetState.SECURED
                }
           },
      71:  { type: "Logs",
             characteristic: Characteristic.Logs,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      72:  { type: "Manufacturer",
             characteristic: Characteristic.Manufacturer,
             props: {format: Characteristic.Formats.STRING,
                perms: [Characteristic.Perms.READ
                       ]
                    },
             validValues: {}
           },
      73:  { type: "Model",
             characteristic: Characteristic.Model,
             props: {format: Characteristic.Formats.STRING,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      74:  { type: "MotionDetected",
             characteristic: Characteristic.MotionDetected,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      75:  { type: "Mute",
             characteristic: Characteristic.Mute,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      76:  { type: "Name",
             characteristic: Characteristic.Name,
             props: {format: Characteristic.Formats.STRING,
                perms: [Characteristic.Perms.READ
                       ]
                    },
             validValues: {}
           },
      77:  { type: "NightVision",
             characteristic: Characteristic.NightVision,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY,
                             Characteristic.Perms.TIMED_WRITE
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      78:  { type: "NitrogenDioxideDensity",
             characteristic: Characteristic.NitrogenDioxideDensity,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 1000,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      79:  { type: "ObstructionDetected",
             characteristic: Characteristic.ObstructionDetected,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      80:  { type: "OccupancyDetected",
             characteristic: Characteristic.OccupancyDetected,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OCCUPANCY_NOT_DETECTED":
                    Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
                 "OCCUPANCY_DETECTED":
                     Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
                }
           },
      81:  { type: "On",
             characteristic: Characteristic.On,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      82:  { type: "OpticalZoom",
             characteristic: Characteristic.OpticalZoom,
             props: {format: Characteristic.Formats.FLOAT,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      83:  { type: "OutletInUse",
             characteristic: Characteristic.OutletInUse,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      84:  { type: "OzoneDensity",
             characteristic: Characteristic.OzoneDensity,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 1000,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      85:  { type: "PairSetup",
             characteristic: Characteristic.PairSetup,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      86:  { type: "PairVerify",
             characteristic: Characteristic.PairVerify,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      87:  { type: "PairingFeatures",
             characteristic: Characteristic.PairingFeatures,
             props: {format: Characteristic.Formats.UINT8,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      88:  { type: "PairingPairings",
             characteristic: Characteristic.PairingPairings,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      89:  { type: "PictureMode",   // HomeKitTypes-Television.js
             characteristic: Characteristic.PictureMode,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 13,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OTHER":           Characteristic.PictureMode.OTHER,
                 "STANDARD":        Characteristic.PictureMode.STANDARD,
                 "CALIBRATED":      Characteristic.PictureMode.CALIBRATED,
                 "CALIBRATED_DARK": Characteristic.PictureMode.CALIBRATED_DARK,
                 "VIVID":           Characteristic.PictureMode.VIVID,
                 "GAME":            Characteristic.PictureMode.GAME,
                 "COMPUTER":        Characteristic.PictureMode.COMPUTER,
                 "CUSTOM":          Characteristic.PictureMode.CUSTOM,
                 "UNKNOWN8":        8,
                 "UNKNOWN9":        9,
                 "UNKNOWN10":       10,
                 "UNKNOWN11":       11,
                 "UNKNOWN12":       12,
                 "UNKNOWN13":       13
                }
           },
      90:  { type: "PM10Density",
             characteristic: Characteristic.PM10Density,
             props: {format: Characteristic.Formats.FLOAT,
             maxValue: 1000,
             minValue: 0,
             minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      91:  { type: "PM2_5Density",
             characteristic: Characteristic.PM2_5Density,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 1000,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      92:  { type: "PositionState",
             characteristic: Characteristic.PositionState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"DECREASING": Characteristic.PositionState.DECREASING,
                 "INCREASING": Characteristic.PositionState.INCREASING,
                 "STOPPED":    Characteristic.PositionState.STOPPED
                }
           },
      93:  { type: "PowerModeSelection",  // HomeKitTypes-Television.js
             characteristic: Characteristic.PowerModeSelection,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues:
                {"SHOW": Characteristic.PowerModeSelection.SHOW,
                 "HIDE": Characteristic.PowerModeSelection.HIDE
                }
           },
      94:  { type: "ProgramMode",
             characteristic: Characteristic.ProgramMode,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NO_PROGRAM_SCHEDULED":
                   Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED,
                 "PROGRAM_SCHEDULED":
                    Characteristic.ProgramMode.PROGRAM_SCHEDULED,
                 "PROGRAM_SCHEDULED_MANUAL_MODE_":
                     Characteristic.ProgramMode.PROGRAM_SCHEDULED_MANUAL_MODE_
                }
           },
      95:  { type: "ProgrammableSwitchEvent",
             characteristic: Characteristic.ProgrammableSwitchEvent,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"SINGLE_PRESS": Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
                      "DOUBLE_PRESS": Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS,
                      "LONG_PRESS":   Characteristic.ProgrammableSwitchEvent.LONG_PRESS
                     }
           },
      96:  { type: "ProgrammableSwitchOutputState",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.ProgrammableSwitchOutputState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },                  
      97:  { type: "Reachable",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.Reachable,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      98:  { type: "RelativeHumidityDehumidifierThreshold",
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             characteristic: Characteristic.RelativeHumidityDehumidifierThreshold,
             validValues: {}
           },
      99:  { type: "RelativeHumidityHumidifierThreshold",
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             characteristic: Characteristic.RelativeHumidityHumidifierThreshold,
             validValues: {}
           },
      100: { type: "RelayEnabled",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.RelayEnabled,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      101: { type: "RelayState",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.RelayState,
             props: {format: Characteristic.Formats.UINT8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      102: { type: "RelayControlPoint",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.RelayControlPoint,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      103: { type: "RemainingDuration",
             characteristic: Characteristic.RemainingDuration,
             props: {format: Characteristic.Formats.UINT32,
                     maxValue: 3600,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      104: { type: "RemoteKey",   // HomeKitTypes-Television.js
             characteristic: Characteristic.RemoteKey,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 16,
                     minValue: 0,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues:
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
                 "UNKNOWN12":      12,  // HomeBridge does not have these defined for values
                 "UNKNOWN13":      13,  // HomeBridge does not have these defined for values
                 "UNKNOWN14":      14,  // HomeBridge does not have these defined for values
                 "INFORMATION":    Characteristic.RemoteKey.INFORMATION,
                 "UNKNOWN16":      16   // HomeBridge does not have these defined for values
                }
           },
      105: { type: "ResetFilterIndication",
             characteristic: Characteristic.ResetFilterIndication,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 1,
                     minStep: 1,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      106: { type: "RotationDirection",
             characteristic: Characteristic.RotationDirection,
             props: {format: Characteristic.Formats.INT,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CLOCKWISE":
                   Characteristic.RotationDirection.CLOCKWISE,
                 "COUNTER_CLOCKWISE":
                   Characteristic.RotationDirection.COUNTER_CLOCKWISE
                }
           },
      107: { type: "RotationSpeed",
             characteristic: Characteristic.RotationSpeed,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      108: { type: "Saturation",
             characteristic: Characteristic.Saturation,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      109: { type: "SecuritySystemAlarmType",
             characteristic: Characteristic.SecuritySystemAlarmType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      110: { type: "SecuritySystemCurrentState",
             characteristic: Characteristic.SecuritySystemCurrentState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 4,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
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
      111: { type: "SecuritySystemTargetState",
             characteristic: Characteristic.SecuritySystemTargetState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
             {"STAY_ARM":  Characteristic.SecuritySystemTargetState.STAY_ARM,
              "AWAY_ARM":  Characteristic.SecuritySystemTargetState.AWAY_ARM,
              "NIGHT_ARM": Characteristic.SecuritySystemTargetState.NIGHT_ARM,
              "DISARM":    Characteristic.SecuritySystemTargetState.DISARM
             }
           },
      112: { type: "SelectedRTPStreamConfiguration",
             characteristic: Characteristic.SelectedRTPStreamConfiguration,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      113: { type: "SerialNumber",
             characteristic: Characteristic.SerialNumber,
             props: {format: Characteristic.Formats.STRING,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      114: { type: "ServiceLabelIndex",
             characteristic: Characteristic.ServiceLabelIndex,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 255,
                     minValue: 1,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      115: { type: "ServiceLabelNamespace",
             characteristic: Characteristic.ServiceLabelNamespace,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues:
                {"DOTS":            Characteristic.ServiceLabelNamespace.DOTS,
                 "ARABIC_NUMERALS": Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
                }
           },
      116: { type: "SetDuration",
             characteristic: Characteristic.SetDuration,
             props: {format: Characteristic.Formats.UINT32,
                     maxValue: 3600,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      117: { type: "SetupEndpoints",
             characteristic: Characteristic.SetupEndpoints,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE
                            ]
                    },
             validValues: {}
           },
      118: { type: "SlatType",
             characteristic: Characteristic.SlatType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues:
                {"HORIZONTAL": Characteristic.SlatType.HORIZONTAL,
                 "VERTICAL":   Characteristic.SlatType.VERTICAL
                }
           },
      119: { type: "SleepDiscoveryMode",   // HomeKitTypes-Television.js
             characteristic: Characteristic.SleepDiscoveryMode,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NOT_DISCOVERABLE":    Characteristic.SleepDiscoveryMode.NOT_DISCOVERABLE ,
                 "ALWAYS_DISCOVERABLE": Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
                }
           },
      120: { type: "SmokeDetected",
             characteristic: Characteristic.SmokeDetected,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                             ]
                    },
             validValues:
                {"SMOKE_NOT_DETECTED": Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
                 "SMOKE_DETECTED":     Characteristic.SmokeDetected.SMOKE_DETECTED
                }
           },
      121: { type: "StatusActive",
             characteristic: Characteristic.StatusActive,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                  "TRUE":  true
                }
           },
      122: { type: "StatusFault",
             characteristic: Characteristic.StatusFault,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NO_FAULT":      Characteristic.StatusFault.NO_FAULT,
                  "GENERAL_FAULT": Characteristic.StatusFault.GENERAL_FAULT
                }
           },
      123: { type: "StatusJammed",
             characteristic: Characteristic.StatusJammed,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NOT_JAMMED": Characteristic.StatusJammed.NOT_JAMMED,
                 "JAMMED":     Characteristic.StatusJammed.JAMMED
                }
           },
      124: { type: "StatusLowBattery",
             characteristic: Characteristic.StatusLowBattery,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"BATTERY_LEVEL_NORMAL":
                   Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
                 "BATTERY_LEVEL_LOW":
                   Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
                }
           },
      125: { type: "StatusTampered",
             characteristic: Characteristic.StatusTampered,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"NOT_TAMPERED": Characteristic.StatusTampered.NOT_TAMPERED,
                 "TAMPERED":     Characteristic.StatusTampered.TAMPERED
                }
           },
      126: { type: "StreamingStatus",
             characteristic: Characteristic.StreamingStatus,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      127: { type: "SulphurDioxideDensity",
             characteristic: Characteristic.SulphurDioxideDensity,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 1000,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      128: { type: "SupportedAudioStreamConfiguration",
             characteristic: Characteristic.SupportedAudioStreamConfiguration,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      129: { type: "SupportedRTPConfiguration",
             characteristic: Characteristic.SupportedRTPConfiguration,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      130: { type: "SupportedVideoStreamConfiguration",
             characteristic: Characteristic.SupportedVideoStreamConfiguration,
             props: {format: Characteristic.Formats.TLV8,
                     perms: [Characteristic.Perms.READ
                            ]
                    },
             validValues: {}
           },
      131: { type: "SwingMode",
             characteristic: Characteristic.SwingMode,
           
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
            validValues:
               {"SWING_DISABLED": Characteristic.SwingMode.SWING_DISABLED,
                "SWING_ENABLED": Characteristic.SwingMode.SWING_ENABLED
               }
           },
      132: { type: "TargetAirPurifierState",
             characteristic: Characteristic.TargetAirPurifierState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:   // Checked 04/24/2020
                {"MANUAL": Characteristic.TargetAirPurifierState.MANUAL,
                 "AUTO":   Characteristic.TargetAirPurifierState.AUTO
                }
           },
      133: { type: "TargetAirQuality",
             characteristic: Characteristic.TargetAirQuality,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"EXCELLENT": Characteristic.TargetAirQuality.EXCELLENT,
                 "GOOD":      Characteristic.TargetAirQuality.GOOD,
                 "FAIR":      Characteristic.TargetAirQuality.FAIR
                }
           },
      134: { type: "TargetDoorState",
             characteristic: Characteristic.TargetDoorState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OPEN":   Characteristic.TargetDoorState.OPEN,
                 "CLOSED": Characteristic.TargetDoorState.CLOSED
                }
           },
      135: { type: "TargetFanState",
             characteristic: Characteristic.TargetFanState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"MANUAL": Characteristic.TargetFanState.MANUAL,
                 "AUTO": Characteristic.TargetFanState.AUTO
                }
           },
      136: { type: "TargetHeaterCoolerState",
             characteristic: Characteristic.TargetHeaterCoolerState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"AUTO": Characteristic.TargetHeaterCoolerState.AUTO,
                 "HEAT": Characteristic.TargetHeaterCoolerState.HEAT,
                 "COOL": Characteristic.TargetHeaterCoolerState.COOL
                }
           },
      137: { type: "TargetHeatingCoolingState",
             characteristic: Characteristic.TargetHeatingCoolingState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"OFF": Characteristic.TargetHeatingCoolingState.OFF,
                 "HEAT": Characteristic.TargetHeatingCoolingState.HEAT,
                 "COOL": Characteristic.TargetHeatingCoolingState.COOL,
                 "AUTO": Characteristic.TargetHeatingCoolingState.AUTO
                }
           },
      138: { type: "TargetHorizontalTiltAngle",
             characteristic: Characteristic.TargetHorizontalTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 90,
                     minValue: -90,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      139: { type: "TargetHumidifierDehumidifierState",
             characteristic: Characteristic.TargetHumidifierDehumidifierState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
               {"HUMIDIFIER_OR_DEHUMIDIFIER":
                  Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER_OR_DEHUMIDIFIER,             
                "HUMIDIFIER":
                  Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER,
                "DEHUMIDIFIER":
                  Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER
               }
           },
      140: { type: "TargetMediaState",   // HomeKitTypes-Television.js
             characteristic: Characteristic.TargetMediaState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 2,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"PLAY": Characteristic.TargetMediaState.PLAY,
                 "PAUSE": Characteristic.TargetMediaState.PAUSE,
                 "STOP": Characteristic.TargetMediaState.STOP,
                 "UNKNOWN3": 3   // HomeBridge has an extra
                }
           },
      141: { type: "TargetPosition",
             characteristic: Characteristic.TargetPosition,
             props: {format: Characteristic.Formats.UINT8,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      142: { type: "TargetRelativeHumidity",
             characteristic: Characteristic.TargetRelativeHumidity,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      143: { type: "TargetSlatState",
             characteristic: Characteristic.TargetSlatState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"MANUAL": Characteristic.TargetSlatState.MANUAL,
                 "AUTO":   Characteristic.TargetSlatState.AUTO
                }
           },
      144: { type: "TargetTemperature",
             characteristic: Characteristic.TargetTemperature,
             props: {format: Characteristic.Formats.FLOAT,
                     unit: Characteristic.Units.CELSIUS,
                     maxValue: 38,
                     minValue: 10,
                     minStep: 0.1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      145: { type: "TargetTiltAngle",
             characteristic: Characteristic.TargetTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit:   Characteristic.Units.ARC_DEGREE,
                     maxValue:  90,
                     minValue: -90,
                     minStep:   1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      146: { type: "TargetVerticalTiltAngle",
             characteristic: Characteristic.TargetVerticalTiltAngle,
             props: {format: Characteristic.Formats.INT,
                     unit: Characteristic.Units.ARC_DEGREE,
                     maxValue: 90,
                     minValue: -90,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      147: { type: "TargetVisibilityState",   // HomeKittypes-Television.js
             characteristic: Characteristic.TargetVisibilityState,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"SHOWN": Characteristic.TargetVisibilityState.SHOWN,
                 "HIDDEN": Characteristic.TargetVisibilityState.HIDDEN
                }
           },
      148: { type: "TemperatureDisplayUnits",
             characteristic: Characteristic.TemperatureDisplayUnits,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"CELSIUS":    Characteristic.TemperatureDisplayUnits.CELSIUS,
                 "FAHRENHEIT": Characteristic.TemperatureDisplayUnits.FAHRENHEIT
                 }
           },
      149: { type: "TimeUpdate",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.TimeUpdate,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      150: { type: "TunneledAccessoryAdvertising",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.TunneledAccessoryAdvertising,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.WRITE,   // Reversed in HomeBridge
                             Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      151: { type: "TunneledAccessoryConnected",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.TunneledAccessoryConnected,
             props: {format: Characteristic.Formats.BOOL,
                     perms: [Characteristic.Perms.WRITE,   // Reversed in HomeBridge
                             Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"FALSE": false,
                 "TRUE":  true
                }
           },
      152: { type: "TunneledAccessoryStateNumber",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.TunneledAccessoryStateNumber,
             props: {format: Characteristic.Formats.FLOAT,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      153: { type: "TunnelConnectionTimeout",   // HomeKitTypes-Bridge.js
             characteristic: Characteristic.TunnelConnectionTimeout,
             props: {format: Characteristic.Formats.UINT32,
                     perms: [Characteristic.Perms.WRITE,    // Reversed in HomeBridge
                             Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      154: { type: "ValveType",
             characteristic: Characteristic.ValveType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
                {"GENERIC_VALVE": Characteristic.ValveType.GENERIC_VALVE,
                 "IRRIGATION":    Characteristic.ValveType.IRRIGATION,
                 "SHOWER_HEAD":   Characteristic.ValveType.SHOWER_HEAD,
                 "WATER_FAUCET":  Characteristic.ValveType.WATER_FAUCET
                }
           },
      155: { type: "Version",
             characteristic: Characteristic.Version,
             props: {format: Characteristic.Formats.STRING,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      156: { type: "VOCDensity",
             characteristic: Characteristic.VOCDensity,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 1000,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      157: { type: "Volume",
             characteristic: Characteristic.Volume,
             props: {format: Characteristic.Formats.UINT8,
                     unit: Characteristic.Units.PERCENTAGE,
                     maxValue: 100,
                     minValue: 0,
                     minStep: 1,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.WRITE,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           },
      158: { type: "VolumeControlType",   // HomeKitTypes-Television.js
             characteristic: Characteristic.VolumeControlType,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 3,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues:
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
      159: { type: "VolumeSelector",   // HomeKitTypes-Television.js
             characteristic: Characteristic.VolumeSelector,
             props: {format: Characteristic.Formats.UINT8,
                     maxValue: 1,
                     minValue: 0,
                     perms: [Characteristic.Perms.WRITE
                            ]
                    },
             validValues:
                {"INCREMENT": Characteristic.VolumeSelector.INCREMENT,
                 "DECREMENT": Characteristic.VolumeSelector.DECREMENT
                }
           },
      160: { type: "WaterLevel",
             characteristic: Characteristic.WaterLevel,
             props: {format: Characteristic.Formats.FLOAT,
                     maxValue: 100,
                     minValue: 0,
                     perms: [Characteristic.Perms.READ,
                             Characteristic.Perms.NOTIFY
                            ]
                    },
             validValues: {}
           }
   };
 
   // Fill in the properties of each device (Must be done at runtime)
   CMD4_DEVICE_TYPE_ENUM.properties =
   {
      0:  { deviceName:'AccessoryInformation',      
            service: Service.AccessoryInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Identify,
                  "defaultValue": true },                         // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.Manufacturer,
                  "defaultValue": 'Cmd4' },                       // Format: string
                 {'type':         CMD4_ACC_TYPE_ENUM.Model,
                  "defaultValue": 'Model' },                      // Format: string
                 {'type':         CMD4_ACC_TYPE_ENUM.Name,
                  "defaultValue": 'My_AccessoryInformation' },
                 {'type':         CMD4_ACC_TYPE_ENUM.SerialNumber,
                  "defaultValue": 'ABC001' },                     // Format: string
                 {'type':         CMD4_ACC_TYPE_ENUM.FirmwareRevision,
                  "defaultValue": '100.1.1' }                     // Format: string
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.HardwareRevision,
                 CMD4_ACC_TYPE_ENUM.AccessoryFlags
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Identify
               ]
          },
      1:  { deviceName:'AirPurifier',               
            service: Service.AirPurifier,
            devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue": Characteristic.Active.ACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState,
                  "defaultValue": Characteristic.CurrentAirPurifierState.PURIFYING_AIR },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetAirPurifierState,
                  "defaultValue": Characteristic.TargetAirPurifierState.AUTO }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockPhysicalControls,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.SwingMode,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      2:  { deviceName:'AirQualitySensor',          
            service: Service.AirQualitySensor,
            devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.AirQuality,
                  "defaultValue":Characteristic.AirQuality.GOOD }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.OzoneDensity,
                 CMD4_ACC_TYPE_ENUM.NitrogenDioxideDensity,
                 CMD4_ACC_TYPE_ENUM.SulphurDioxideDensity,
                 CMD4_ACC_TYPE_ENUM.PM2_5Density,
                 CMD4_ACC_TYPE_ENUM.PM10Density,
                 CMD4_ACC_TYPE_ENUM.VOCDensity,
                 CMD4_ACC_TYPE_ENUM.CarbonMonoxideLevel,
                 CMD4_ACC_TYPE_ENUM.CarbonDioxideLevel
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.AirQuality
               ]
          },
      3:  { deviceName:'BatteryService',            
            service: Service.BatteryService,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.BatteryLevel,
                  "defaultValue":50 },                            // Range 0-100
                 {'type':         CMD4_ACC_TYPE_ENUM.ChargingState,
                  "defaultValue":Characteristic.ChargingState.NOT_CHARGING },
                 {'type':         CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                  "defaultValue":Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusLowBattery
               ]
          },
      4:  { deviceName:'BridgeConfiguration',                     
            service: Service.BridgeConfiguration,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus,
                  "defaultValue":0 }                              // Format: TLV8
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus,
                 CMD4_ACC_TYPE_ENUM.DiscoverBridgedAccessories,
                 CMD4_ACC_TYPE_ENUM.DiscoveredBridgedAccessories,
                 CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessory
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus
               ]
          },
      5:  { deviceName:'BridgingState',            
            service: Service.BridgingState,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Reachable,
                  "defaultValue":true },                          // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.LinkQuality,
                  "defaultValue":1 },                             // Format: Uint8
                                                                  // Range: 1-4, Step: 1
                 {'type':         CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                  "defaultValue":"id999" },                       // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.Category,
                  "defaultValue":16 }                             // Format: Uint16
                                                                  // Range: 1-16, Step 1
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Reachable
               ]
          },
      6:  { deviceName:'CameraControl',                           
            service: Service.CameraControl,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":true }                           // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.NightVision,
                 CMD4_ACC_TYPE_ENUM.OpticalZoom,
                 CMD4_ACC_TYPE_ENUM.DigitalZoom,
                 CMD4_ACC_TYPE_ENUM.ImageRotation,
                 CMD4_ACC_TYPE_ENUM.ImageMirroring,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      7:  { deviceName:'CameraRTPStreamManagement', 
            service: Service.CameraRTPStreamManagement,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.StreamingStatus,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.SetupEndpoints,
                  "defaultValue":0 }                              // Format TLV8
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [
               ]
          },
      8:  { deviceName:'CarbonDioxideSensor',       
            service: Service.CarbonDioxideSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected,
                  "defaultValue":Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.CarbonDioxideLevel,
                 CMD4_ACC_TYPE_ENUM.CarbonDioxidePeakLevel,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected
               ]
          },
      9:  { deviceName:'CarbonMonoxideSensor',      
            service: Service.CarbonMonoxideSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected,
                  "defaultValue":Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.CarbonMonoxideLevel,
                 CMD4_ACC_TYPE_ENUM.CarbonMonoxidePeakLevel,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected
               ]
          },
      10: { deviceName:'ContactSensor',             
            service: Service.ContactSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ContactSensorState,
                  "defaultValue":Characteristic.ContactSensorState.CONTACT_NOT_DETECTED }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ContactSensorState
               ]
          },
      11: { deviceName:'Door',                      
            service: Service.Door,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentPosition,
                  "defaultValue":0 },                             // Range 0 - 100
                 {'type':         CMD4_ACC_TYPE_ENUM.PositionState,
                   "defaultValue":Characteristic.PositionState.STOPPED },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetPosition,
                  "defaultValue":0 }                              // Range 0 - 100
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.HoldPosition,
                 CMD4_ACC_TYPE_ENUM.ObstructionDetected,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          },
      12: { deviceName:'DoorBell',                  
            service: Service.Doorbell,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                  "defaultValue":Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Brightness,
                 CMD4_ACC_TYPE_ENUM.Volume,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      13: { deviceName:'Fan',                       
            service: Service.Fan,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.RotationDirection,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      14: { deviceName:'Fanv1',                     
            service: Service.Fan,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.RotationDirection,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      15: { deviceName:'Fanv2',                     
            service: Service.Fanv2,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentFanState,
                 CMD4_ACC_TYPE_ENUM.TargetFanState,
                 CMD4_ACC_TYPE_ENUM.LockPhysicalControls,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.RotationDirection,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed,
                 CMD4_ACC_TYPE_ENUM.SwingMode
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      16: { deviceName:'Faucet',                    
            service: Service.Faucet,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.StatusFault
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      17: { deviceName:'FilterMaintenance',         
            service: Service.FilterMaintenance,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.FilterChangeIndication,
                  "defaultValue":Characteristic.FilterChangeIndication.FILTER_OK }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.FilterLifeLevel,
                 CMD4_ACC_TYPE_ENUM.ResetFilterIndication,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.FilterChangeIndication
               ]
          },
      18: { deviceName:'GarageDoorOpener',          
            service: Service.GarageDoorOpener,
            devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                  "defaultValue":Characteristic.CurrentDoorState.OPEN },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetDoorState,
                  "defaultValue":Characteristic.TargetDoorState.OPEN },
                 {'type':         CMD4_ACC_TYPE_ENUM.ObstructionDetected,
                  "defaultValue":true }                           // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockCurrentState,
                 CMD4_ACC_TYPE_ENUM.LockTargetState,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentDoorState
               ]
          },
      19: { deviceName:'HeaterCooler',              
            service: Service.HeaterCooler,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                  "defaultValue":Characteristic.CurrentHeaterCoolerState.INACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                  "defaultValue":Characteristic.TargetHeaterCoolerState.HEAT },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                  "defaultValue":50.0 }                           // Range:  0 - 100, Step: 0.1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
               ],            
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockPhysicalControls,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.SwingMode,
                 CMD4_ACC_TYPE_ENUM.CoolingThresholdTemperature,
                 CMD4_ACC_TYPE_ENUM.HeatingThresholdTemperature,
                 CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      20: { deviceName:'HumidifierDehumidifier',    
            service: Service.HumidifierDehumidifier,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                  "defaultValue":60 },                            // Range:  0 - 100, Step: 1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                  "defaultValue":Characteristic.CurrentHumidifierDehumidifierState.IDLE },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                  "defaultValue":Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER },
                 {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockPhysicalControls,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.SwingMode,
                 CMD4_ACC_TYPE_ENUM.WaterLevel,
                 CMD4_ACC_TYPE_ENUM.RelativeHumidityDehumidifierThreshold,
                 CMD4_ACC_TYPE_ENUM.RelativeHumidityHumidifierThreshold,
                 CMD4_ACC_TYPE_ENUM.RotationSpeed
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      21: { deviceName:'HumiditySensor',            
            service: Service.HumiditySensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                  "defaultValue":60 }                             // Range:  0 - 100, Step: 1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity
               ]
          },
      22: { deviceName:'InputSource',               
            service: Service.InputSource,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ConfiguredName,
                  "defaultValue":"My_InputSource" },              // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.InputSourceType,
                  "defaultValue":Characteristic.InputSourceType.HOME_SCREEN },
                 {'type':         CMD4_ACC_TYPE_ENUM.IsConfigured,
                  "defaultValue":Characteristic.IsConfigured.CONFIGURED },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentVisibilityState,
                  "defaultValue":Characteristic.CurrentVisibilityState.SHOWN }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Identifier,
                 CMD4_ACC_TYPE_ENUM.InputDeviceType,
                 CMD4_ACC_TYPE_ENUM.TargetVisibilityState,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentVisibilityState
               ]
          },
      23: { deviceName:'IrrigationSystem',          
            service: Service.IrrigationSystem,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.ProgramMode,
                   "defaultValue":Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED },
                 {'type':         CMD4_ACC_TYPE_ENUM.InUse,
                  "defaultValue":Characteristic.InUse.IN_USE },
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.RemainingDuration,
                 CMD4_ACC_TYPE_ENUM.StatusFault
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      24: { deviceName:'LeakSensor',                
            service: Service.LeakSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.LeakDetected,
                  "defaultValue":Characteristic.LeakDetected.LEAK_NOT_DETECTED }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LeakDetected
               ]
          },
      25: { deviceName:'LightSensor',               
            service: Service.LightSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel,
                  "defaultValue":1 }                              // Range:  0.0001 - 100000
                                                                  // Format: float
                                                                  // Units:  lux
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel
               ]
          },
      26: { deviceName:'Lightbulb',                 
            service: Service.Lightbulb,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":false }                          // Format: float
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Brightness,
                 CMD4_ACC_TYPE_ENUM.Hue,
                 CMD4_ACC_TYPE_ENUM.Saturation,
                 CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.ColorTemperature
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      27: { deviceName:'LockManagement',            
            service: Service.LockManagement,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.LockControlPoint,
                  "defaultValue":0 },                             // Format TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.Version,
                  "defaultValue":'0.0.0' }                        // Format: String
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Logs,
                 CMD4_ACC_TYPE_ENUM.AudioFeedback,
                 CMD4_ACC_TYPE_ENUM.LockManagementAutoSecurityTimeout,
                 CMD4_ACC_TYPE_ENUM.AdministratorOnlyAccess,
                 CMD4_ACC_TYPE_ENUM.LockLastKnownAction,
                 CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                 CMD4_ACC_TYPE_ENUM.MotionDetected,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [
               ]
          },
      28: { deviceName:'LockMechanism',             
            service: Service.LockMechanism,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.LockCurrentState,
                  "defaultValue":Characteristic.LockCurrentState.UNSECURED },
                 {'type':         CMD4_ACC_TYPE_ENUM.LockTargetState,
                  "defaultValue":Characteristic.LockTargetState.UNSECURED },
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.LockCurrentState
               ]
          },
      29: { deviceName:'Microphone',                
            service: Service.Microphone,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Mute,
                  "defaultValue":false },                         // Format: Bool,
                                                                  // 0 - Mute is off
                                                                  // 1 - Mute is on
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Volume,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute
               ]
          },
      30: { deviceName:'MotionSensor',              
            service: Service.MotionSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.MotionDetected,
                  "defaultValue":true }                           // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.MotionDetected
               ]
          },
      31: { deviceName:'OccupancySensor',           
            service: Service.OccupancySensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.OccupancyDetected,
                  "defaultValue":Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.OccupancyDetected
               ]
          },
      32: { deviceName:'Outlet',                    
            service: Service.Outlet,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":false },                         // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.OutletInUse,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      33: { deviceName:'Pairing',                   
            service: Service.Pairing,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.PairingFeatures,
                  "defaultValue":1 },                             // Format: Uint8. Values ???
                 {'type':         CMD4_ACC_TYPE_ENUM.PairVerify,
                  "defaultValue":0 },                             // Format: TLV8
                 {'type':         CMD4_ACC_TYPE_ENUM.PairingFeatures,
                   "defaultValue":0 },                            // Format: Uint8
                 {'type':         CMD4_ACC_TYPE_ENUM.PairingPairings,
                  "defaultValue":0 }                              // Format: TLV8
               ],
            optionalCharacteristics:
               [     // none
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.PairingFeatures
               ]
          },
      34: { deviceName:'ProtocolInformation',       
            service: Service.ProtocolInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Version,
                  "defaultValue":'1.2.3' }                        // Format string
               ],
            optionalCharacteristics:
               [ // none
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Version
               ]
          },
      35: { deviceName:'Relay',                     
            service: Service.Relay,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.RelayEnabled,
                  "defaultValue":true },                                // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.RelayState,
                  "defaultValue":1    },                                // Format uint8, Values ???
                 {'type':         CMD4_ACC_TYPE_ENUM.RelayControlPoint,  // Format: TLV8   
                  "defaultValue": 0.  }    
               ],
            optionalCharacteristics:
               [ // none
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
               [ {'type':         CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                  "defaultValue":Characteristic.SecuritySystemCurrentState.DISARMED },
                 {'type':         CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState,
                   "defaultValue":Characteristic.SecuritySystemTargetState.DISARM }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.SecuritySystemAlarmType,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState
               ]},
      37: { deviceName:'ServiceLabel',              
            service: Service.ServiceLabel,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace,
                  "defaultValue":Characteristic.ServiceLabelNamespace.DOTS }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace
               ]
          },
      38: { deviceName:'Slat',                      
            service: Service.Slat,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.SlatType,
                  "defaultValue":Characteristic.SlatType.HORIZONTAL },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentSlatState,
                  "defaultValue":Characteristic.CurrentSlatState.FIXED }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.CurrentTiltAngle,
                 CMD4_ACC_TYPE_ENUM.TargetTiltAngle,
                 CMD4_ACC_TYPE_ENUM.SwingMode
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentSlatState
               ]
          },
      39: { deviceName:'SmokeSensor',               
            service: Service.SmokeSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.SmokeDetected,
                  "defaultValue":Characteristic.SmokeDetected.SMOKE_NOT_DETECTED }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SmokeDetected
               ]
          },
      40: { deviceName:'Speaker',                   
            service: Service.Speaker,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Mute,
                  "defaultValue":true }   // Format: Bool, 0 - Mute is off, 1 - Mute is on
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Volume,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute
               ]
          },
      41: { deviceName:'StatefulProgrammableSwitch',
            service: Service.StatefulProgrammableSwitch,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                  "defaultValue":Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS },
                 {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState,
                   "defaultValue":0 }                             // Range: 0 - 1. Step: 1
                                                                  // Format: Uint8
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      42: { deviceName:'StatelessProgrammableSwitch',
            service: Service.StatelessProgrammableSwitch,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                  "defaultValue":Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name,
                 CMD4_ACC_TYPE_ENUM.ServiceLabelIndex
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
               ]
          },
      43: { deviceName:'Switch',                    
            service: Service.Switch,
            devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.On
               ]
          },
      44: { deviceName:'Television',                
            service: Service.Television,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.ActiveIdentifier,
                  "defaultValue":123 },                           // Format: Uint32
                 {'type':         CMD4_ACC_TYPE_ENUM.ConfiguredName,
                  "defaultValue":'My_Tv', },                      // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode,
                  "defaultValue":Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Brightness,
                 CMD4_ACC_TYPE_ENUM.ClosedCaptions,
                 CMD4_ACC_TYPE_ENUM.DisplayOrder,
                 CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                 CMD4_ACC_TYPE_ENUM.TargetMediaState,
                 CMD4_ACC_TYPE_ENUM.PictureMode,
                 CMD4_ACC_TYPE_ENUM.PowerModeSelection,
                 CMD4_ACC_TYPE_ENUM.RemoteKey
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      45: { deviceName:'TelevisionSpeaker',         
            service: Service.TelevisionSpeaker,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Mute,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active,
                 CMD4_ACC_TYPE_ENUM.Volume,
                 CMD4_ACC_TYPE_ENUM.VolumeControlType,
                 CMD4_ACC_TYPE_ENUM.VolumeSelector,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Mute
               ]
          },
      46: { deviceName:'TemperatureSensor',         
            service: Service.TemperatureSensor,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                  "defaultValue":50.0 }                           // Range:  0 - 100, Step: 0.1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.StatusActive,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                 CMD4_ACC_TYPE_ENUM.StatusTampered,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTemperature
               ]
          },
      47: { deviceName:'Thermostat',                
            service: Service.Thermostat,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState,
                  "defaultValue":Characteristic.CurrentHeatingCoolingState.OFF, },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState,
                  "defaultValue":Characteristic.TargetHeatingCoolingState.OFF },
                 {'type':         CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                  "defaultValue":50.0 },                          // Range:  0 - 100, Step: 0.1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetTemperature,
                  "defaultValue":50.0 },                          // Range:  0 - 100, Step: 0.1
                                                                  // Format: float
                                                                  // Units:  CELCIUS
                 {'type':         CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits,
                  "defaultValue":Characteristic.TemperatureDisplayUnits.CELSIUS }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                 CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity,
                 CMD4_ACC_TYPE_ENUM.CoolingThresholdTemperature,
                 CMD4_ACC_TYPE_ENUM.HeatingThresholdTemperature,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTemperature
               ]
          },
      48: { deviceName:'TimeInformation',           
            service: Service.TimeInformation,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentTime,
                  "defaultValue":'11:15' },                       // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.DayoftheWeek,
                  "defaultValue":1 },                             // Range:  1 - 7
                 {'type':         CMD4_ACC_TYPE_ENUM.TimeUpdate,
                  "defaultValue":false }                          // Format: Bool
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentTime
               ]
          },
      49: { deviceName:'TunneledBTLEAccessoryService',
            service: Service.TunneledBTLEAccessoryService,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Name,
                  "defaultValue":'My_TunnelB' },                  // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                  "defaultValue":'TLB' },                         // Format: String
                 {'type':         CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber,
                  "defaultValue":0.0 },                           // Format: float
                 {'type':         CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected,
                  "defaultValue":false },                         // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising,
                  "defaultValue":false },                         // Format: Bool
                 {'type':         CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout,
                  "defaultValue":5000 }                           // Format: Uint32
               ],
            optionalCharacteristics:
               [ // none
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected
               ]
          },
      50: { deviceName:'Valve',                     
            service: Service.Valve,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                  "defaultValue":Characteristic.Active.ACTIVE },
                 {'type':         CMD4_ACC_TYPE_ENUM.InUse,
                  "defaultValue":Characteristic.InUse.IN_USE },
                 {'type':         CMD4_ACC_TYPE_ENUM.ValveType,
                  "defaultValue":Characteristic.ValveType.GENERIC_VALVE }
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.SetDuration,
                 CMD4_ACC_TYPE_ENUM.RemainingDuration,
                 CMD4_ACC_TYPE_ENUM.IsConfigured,
                 CMD4_ACC_TYPE_ENUM.ServiceLabelIndex,
                 CMD4_ACC_TYPE_ENUM.StatusFault,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.Active
               ]
          },
      51: { deviceName:'Window',                    
            service: Service.Window,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentPosition,
                  "defaultValue":0 },                             // Range: 0 - 100, Step: 1
                 {'type':         CMD4_ACC_TYPE_ENUM.PositionState,
                  "defaultValue":Characteristic.PositionState.STOPPED },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetPosition,
                  "defaultValue":0 }                              // Range: 0 - 100, Step: 1
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.HoldPosition,
                 CMD4_ACC_TYPE_ENUM.ObstructionDetected,
                 CMD4_ACC_TYPE_ENUM.Name
               ],
            defaultPollingCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.CurrentPosition
               ]
          },
      52: { deviceName:'WindowCovering',            
            service: Service.WindowCovering,
            devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
            requiredCharacteristics:
               [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentPosition,
                  "defaultValue":0 },                             // Range: 0 - 100, Step: 1
                 {'type':         CMD4_ACC_TYPE_ENUM.PositionState,
                   "defaultValue":Characteristic.PositionState.STOPPED },
                 {'type':         CMD4_ACC_TYPE_ENUM.TargetPosition,
                  "defaultValue":0 }                              // Range: 0 - 100, Step: 1
               ],
            optionalCharacteristics:
               [ CMD4_ACC_TYPE_ENUM.HoldPosition,
                 CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle,
                 CMD4_ACC_TYPE_ENUM.ObstructionDetected,
                 CMD4_ACC_TYPE_ENUM.Name
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
           UUIDGen,
           foundAccessories};
   },
   CMD4_ACC_TYPE_ENUM: CMD4_ACC_TYPE_ENUM,
   CMD4_DEVICE_TYPE_ENUM: CMD4_DEVICE_TYPE_ENUM,
   Accessory: Accessory,
   Service: Service,
   Characteristic: Characteristic,
   UUIDGen: UUIDGen,
   FoundAccessories:foundAccessories
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
          this.log.debug("*****Adding default value %s for %s", defaultValue, ) 
           
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
         let constant = self.transposeValueToConstantForCharacteristic(accTypeEnumIndex, value);
          cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + constant  + "'" + self.state_cmd_suffix;
      } else {
         cmd = self.state_cmd_prefix + self.state_cmd + " Set '" + self.displayName + "' '" + characteristicString  + "' '" + value  + "'" + self.state_cmd_suffix;
      }
      self.log.debug("setValue %s function for:%s cmd:%s", characteristicString, self.displayName, cmd);

    
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
   processLinkedTypesConfig: function( config, parentConfig )
   {
      if ( Array.isArray ( config ) )
      {
         for (let i = 0; i < config.length; i++)
            this.processLinkedTypesConfig(config[i], parentConfig );
          
         return;
      }
      if ( isJSON ( config ) )
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
   // Used during getValue and parsing config.json
   transposeConstantToValueForCharacteristic( accTypeEnumIndex, constantString )
   {
      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues).length < 0)
      {
         //this.log.debug("No constants to transpose for:%s", constantString);
         return;
      }
    
      if (CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues.hasOwnProperty(constantString) )
      {       
         let value = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues[constantString];
       
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
      if (Object.keys(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues).length < 0)
      {
         //this.log("No constants to transpose for:%s", valueString);
         return;
      }
 
      let constant = extractKeyValue(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues, valueString);
 
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

function getAccessoryName( config )
{ 
   if (config.displayName)
      return config.displayName;
             
   if (config.name)
      return config.name;
    
   console.log("You must either, 'displayName' and or 'name' per accessory.");
   process.exit(-1);
     
}

function extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.validValues(obj).indexOf(value)];
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

