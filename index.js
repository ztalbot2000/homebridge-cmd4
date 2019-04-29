'use strict';
const exec = require("child_process").exec;
const moment = require('moment');


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

var  CMD4_DEVICE_TYPE_ENUM =
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

   properties:{}
};


// Object.freeze(CMD4_DEVICE_TYPE_enum);


var FakeGatoHistoryService;
var Accessory, Service, Characteristic, UUIDGen;

var  CMD4_ACC_TYPE_ENUM =
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
   properties: {}
};


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

   // Fill in the properties of each device
   CMD4_DEVICE_TYPE_ENUM.properties =
   {
       0: { deviceName:'AccessoryInformation',        characteristic: Characteristic.AccessoryInformation},
       1: { deviceName:'AirPurifier',                 characteristic: Characteristic.AirPurifier},
       2: { deviceName:'AirQualitySensor',            characteristic: Characteristic.AirQualitySensor},
       3: { deviceName:'BatteryService',              characteristic: Characteristic.BatteryService},
       4: { deviceName:'BridgeConfiguration',         characteristic: Characteristic.BridgeConfiguration},
       5: { deviceName:'BridgingState',               characteristic: Characteristic.BridgingState},
       6: { deviceName:'CameraControl',               characteristic: Characteristic.CameraControl},
       7: { deviceName:'CameraRTPStreamManagement',   characteristic: Characteristic.CameraRTPStreamManagement},
       8: { deviceName:'CarbonDioxideSensor',         characteristic: Characteristic.CarbonDioxideSensor},
       9: { deviceName:'CarbonMonoxideSensor',        characteristic: Characteristic.CarbonMonoxideSensor},
      10: { deviceName:'ContactSensor',               characteristic: Characteristic.ContactSensor},
      11: { deviceName:'Door',                        characteristic: Characteristic.Door},
      12: { deviceName:'DoorBell',                    characteristic: Characteristic.Doorbell},
      13: { deviceName:'Fan',                         characteristic: Characteristic.Fan},
      14: { deviceName:'Fanv1',                       characteristic: Characteristic.Fanv1},
      15: { deviceName:'Fanv2',                       characteristic: Characteristic.Fanv2},
      16: { deviceName:'Faucet',                      characteristic: Characteristic.Faucet},
      17: { deviceName:'FilterMaintenance',           characteristic: Characteristic.FilterMaintenance},     
      18: { deviceName:'GarageDoorOpener',            characteristic: Characteristic.GarageDoorOpener},
      19: { deviceName:'HeaterCooler',                characteristic: Characteristic.HeaterCooler},
      20: { deviceName:'HumidifierDehumidifier',      characteristic: Characteristic.HumidifierDehumidifier},
      21: { deviceName:'HumiditySensor',              characteristic: Characteristic.HumiditySensor},
      22: { deviceName:'InputSource',                 characteristic: Characteristic.OuputSource},
      23: { deviceName:'IrrigationSystem',            characteristic: Characteristic.IrrigationSystem},
      24: { deviceName:'LeakSensor',                  characteristic: Characteristic.LeakSensor},
      25: { deviceName:'LightSensor',                 characteristic: Characteristic.LightSensor},
      26: { deviceName:'Lightbulb',                   characteristic: Characteristic.Lightbulb},
      27: { deviceName:'LockManagement',              characteristic: Characteristic.LockManagement},
      28: { deviceName:'LockMechanism',               characteristic: Characteristic.LockMechanism},
      29: { deviceName:'Microphone',                  characteristic: Characteristic.Microphone},
      30: { deviceName:'MotionSensor',                characteristic: Characteristic.MotionSensor},
      31: { deviceName:'OccupancySensor',             characteristic: Characteristic.OccupancySensor},
      32: { deviceName:'Outlet',                      characteristic: Characteristic.Outlet},
      33: { deviceName:'Pairing',                     characteristic: Characteristic.Pairing},
      34: { deviceName:'ProtocolInformation',         characteristic: Characteristic.ProtocolInformation},
      35: { deviceName:'Relay',                       characteristic: Characteristic.Relay},
      36: { deviceName:'SecuritySystem',              characteristic: Characteristic.SecuritySystem},
      37: { deviceName:'ServiceLabel',                characteristic: Characteristic.ServiceLabel},
      38: { deviceName:'Slat',                        characteristic: Characteristic.Slat},
      39: { deviceName:'SmokeSensor',                 characteristic: Characteristic.SmokeSensor},
      40: { deviceName:'Speaker',                     characteristic: Characteristic.Speaker},
      41: { deviceName:'StatefulProgrammableSwitch',  characteristic: Characteristic.StatefulProgrammableSwitch},
      42: { deviceName:'StatelessProgrammableSwitch', characteristic: Characteristic.StatelessProgrammableSwitch},
      43: { deviceName:'Switch',                      characteristic: Characteristic.Switch},
      44: { deviceName:'Television',                  characteristic: Characteristic.Television},
      45: { deviceName:'TelevisionSpeaker',           characteristic: Characteristic.TelevisionSpeaker},
      46: { deviceName:'TemperatureSensor',           characteristic: Characteristic.TemperatureSensor},
      47: { deviceName:'Thermostat',                  characteristic: Characteristic.Thermostat},
      48: { deviceName:'TimeInformation',             characteristic: Characteristic.TimeInformation},
      49: { deviceName:'TunneledBTLEAccessoryService', characteristic: Characteristic.TunneledBTLEAccessoryService},
      50: { deviceName:'Valve',                       characteristic: Characteristic.Valve},
      51: { deviceName:'Window',                      characteristic: Characteristic.Window},
      52: { deviceName:'WindowCovering',              characteristic: Characteristic.WindowCovering},
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
      20:  { name: "ColorTemperature", characteristic: Characteristic.ColorTemperature },
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
      54:  { name: "Hue", characteristic: Characteristic.Hue },
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
      80:  { name: "On", characteristic: Characteristic.On },
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
      107: { name: "Saturation", characteristic: Characteristic.Saturation },
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

// Object.freeze(CMD4_DEVICE_TYPE_enum);



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
      var that = this;


      this.log("Fetching config.json devices.");
      for( var i=0; i<this.config.accessories.length; i++ )
      {
         // This will create an accessory based on the Cmd4Accessory
         // definition bellow. This is not obvious for a newbie.
         this.log("Processing accessory " + this.config.accessories[i].name);
         var accessory = new Cmd4Accessory( that.log, that.config, this.config.accessories[i] );

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
   var self = accessory;


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
   var self = accessory;

   self.log.debug("Setting up '%s' polling characteristics of accessory '%s'",
      self.polling.length, self.name);

   for ( var jsonIndex = 0;
             jsonIndex < self.polling.length;
             jsonIndex ++ )
   {
      // *NEW* Characteristic polling is a json var
      var jsonPollingConfig = self.polling[jsonIndex];

      // The default timeout is 1 minute. Timeouts are in milliseconds
      var timeout = DEFAULT_TIMEOUT;

      // The defaault interval is 1 minute. Intervals are in seconds
      var interval = DEFAULT_INTERVAL;

      var ucKeyIndex = -1;

      for ( var key in jsonPollingConfig )
      {
         var ucKey = ucFirst(key);
         var value = jsonPollingConfig[key];
   
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
// Here we make sure that required characteristics are set.
Cmd4Platform.prototype.setupStatePollingPerAccessory = function (accessory)
{
   var self = accessory;

   var accTypeEnumIndex = -1;

   switch(accessory.typeIndex)
   {
      case CMD4_DEVICE_TYPE_ENUM.AccessoryInformation:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Identify;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.AirPurifier:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.AirQualitySensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex, self.timeout, self.interval), self.interval);
         }
     
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirQuality;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.BatteryService:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusLowBattery;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.BridgeConfiguration:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus;
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.BridgingState:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Reachable;
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.CameraControl:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.CameraRTPStreamManagement:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.CarbonDioxideSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.CarbonMonoxideSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);                  
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.ContactSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ContactSensorState;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Door:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
     
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.DoorBell:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Fan:
      case CMD4_DEVICE_TYPE_ENUM.Fanv1:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Fanv2:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
         }

          break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Faucet:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.FilterMaintenance:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.FilterChangeIndication;

         break;
      }      
      case CMD4_DEVICE_TYPE_ENUM.GarageDoorOpener:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.HeaterCooler:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.HumidifierDehumidifier:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.HumiditySensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
  
             this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.InputSource:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentVisibilityState;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.IrrigationSystem:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.LeakSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
  
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LeakDetected;
     
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.LightSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
               this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel;
               
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Lightbulb:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.LockManagement:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockCurrentState;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.LockMechanism:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockCurrentState;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Microphone:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.MotionSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.MotionDetected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.OccupancySensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.OccupancyDetected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Outlet:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Pairing:
      {
         // The only thing that is not TLV8
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PairingFeatures;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.ProtocolInformation:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Version;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Relay:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayEnabled) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelayEnabled;

            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelayState;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.SecuritySystem:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState;
    
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.ServiceLabel:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace;
     
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Slat:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentSlatState;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.SmokeSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SmokeDetected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Speaker:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.StatefulProgrammableSwitch:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.StatelessProgrammableSwitch:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Switch:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Television:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.TelevisionSpeaker:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.TemperatureSensor:
      {
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusActive) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTemperature;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Thermostat:
      {    
         // Poll for currentRelativeHumidity if defined
         if ( accessory.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity) != undefined )
         {
            accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity;
     
            this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, accTypeEnumIndex,
                  self.timeout, self.interval), self.interval);
         }
  
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
  
         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.TimeInformation:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTime;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.TunneledBTLEAccessoryService:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Valve:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ValveType;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.Window:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentPosition;

         break;
      }
      case CMD4_DEVICE_TYPE_ENUM.WindowCovering:
      {
         accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentPosition;
  
         break;
      }
      default:
         this.log("Internal error: unknown device index '%s'", accessory.typeIndex);
   }

   if ( accTypeEnumIndex < 0 )
      return;

   this.listOfPollingCharacteristics[ accessory.name + accTypeEnumIndex ] =
      setTimeout(this.characteristicPolling.bind(
         this, accessory, accTypeEnumIndex,
         self.timeout, self.interval), self.interval);
}

function Cmd4Accessory(log, platformConfig, accessoryConfig, status ) 
{

    this.config = accessoryConfig;
    this.log = log;

    // Instead of local variables for every characteristic, create an array to
    // hold values for  all characteristics based on the size of all possible characteristics.
    this.storedValuesPerCharacteristic = new Array(CMD4_ACC_TYPE_ENUM.properties.length).fill(null);

    // If polling is defined it is set to true, otherwise false.
    this.polling = this.config.polling === true;

   for (var key in this.config)
   {
      var value = this.config[key];

      // I made the stupid mistake of not havin all characteristics in the config.json
      // file not upper case to match that in State.js. So instead of having everyone
      // fix the their scripts, fix it here.
      var ucKey = ucFirst(key);

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
            // What this plugin is all about
            this.state_cmd = value;
            break;
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
            var accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
            
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
   // This method was taken from real-fake-garage-doors by
   // plasticrake.
   // P.S  - This is probably more documentation of code anywhere
   //        in Homebridge :-)    If you find it useful, send
   //        me a like ;-)

   switch( this.typeIndex )
   {
      case CMD4_DEVICE_TYPE_ENUM.AccessoryInformation:
         this.service = new Service.AccessoryInformation(this.name, this.name);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Identify) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Identify, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Manufacturer) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Manufacturer, "Cmd4");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Model) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Model, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "My_AccessoryInformation");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SerialNumber)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SerialNumber, "ABC001");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FirmwareRevision)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FirmwareRevision, "100.1.1");

         break;
      case CMD4_DEVICE_TYPE_ENUM.AirPurifier:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetAirPurifierState) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetAirPurifierState, 0);
            
         // The default respnse time is in seconds
         if ( ! this.stateChangeResponseTime )
            this.stateChangeResponseTime = SLOW_STATE_CHANGE_RESPONSE_TIME;        

         this.service = new Service.AirPurifier(this.name, this.name);
  
         break;
      case CMD4_DEVICE_TYPE_ENUM.AirQualitySensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AirQuality) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AirQuality, 1);
            
         // The default respnse time is in seconds
         if ( ! this.stateChangeResponseTime )
            this.stateChangeResponseTime = FAST_STATE_CHANGE_RESPONSE_TIME;
     
         this.service = new Service.AirQualitySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.BatteryService:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.BatteryLevel) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.BatteryLevel, 50);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ChargingState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ChargingState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusLowBattery) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusLowBattery, 0);
  
         this.service = new Service.BatteryService(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.BridgeConfiguration:
         this.service = new Service.BridgeConfiguration(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.BridgingState:

         this.service = new Service.BridgeState(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.CameraControl:

         this.service = new Service.CameraControl(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.CameraRTPStreamManagement:
         this.service = new Service.CameraRTPStreamManagement(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.CarbonDioxideSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected)  == undefined )
             this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected, 0); 

         this.service = new Service.CarbonDioxideSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.CarbonMonoxideSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected, 0);
     
         this.service = new Service.CarbonMonoxideSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.ContactSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ContactSensorState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ContactSensorState, 0);

         this.service = new Service.ContactSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Door:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.Door(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.DoorBell:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, 0);

         // HomeKitTypes.js has this as 'Doorbell' (Small b)
         this.service = new Service.Doorbell(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Fan:
      case CMD4_DEVICE_TYPE_ENUM.Fanv1:
         // So why do we do this? In the need for documentation,
         // this is done so that required characteristics
         // are set for the given accessory,

         // Required    
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Fan(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Fanv2:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);

         this.service = new Service.Fanv2(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Faucet:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 1);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusFault)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusFault, 0);

         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "My_Faucet");

         this.service = new Service.Faucet(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.FilterMaintenance:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FilterChangeIndication)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FilterChangeIndication, 0);

         this.service = new Service.FilterMaintenance(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.GarageDoorOpener:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentDoorState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentDoorState, 0);
  

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetDoorState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetDoorState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ObstructionDetected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ObstructionDetected, 0);
            
         // The default respnse time is in seconds
         if ( ! this.stateChangeResponseTime )
         this.stateChangeResponseTime = SLOW_STATE_CHANGE_RESPONSE_TIME; 

         this.service = new Service.GarageDoorOpener(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.HeaterCooler:

         this.service = new Service.HeaterCooler(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.HumidifierDehumidifier:

         this.service = new Service.HumidifierDehumidifier(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.HumiditySensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity, 1);
     
         this.service = new Service.HumiditySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.InputSource:
         this.service = new Service.InputSource(this.name, this.name);
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName, "My_InputSource");
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InputSourceType)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InputSourceType, 1);
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.IsConfigured)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.IsConfigured, 1);
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentVisibilityState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentVisibilityState, 2);
  
         this.service = new Service.InputSource(this.name, this.name);
         break;
       case CMD4_DEVICE_TYPE_ENUM.IrrigationSystem:

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 1);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgramMode)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgramMode, 1);
  
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InUse)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InUse, 1);
  
         this.service = new Service.IrrigationSystem(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LeakSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LeakDetected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LeakDetected, 0);

         this.service = new Service.LeakSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LightSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel, 0);
     
         this.service = new Service.LightSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Lightbulb:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Lightbulb(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LockManagement:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockControlPoint)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockControlPoint, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Logs)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Logs, "OptionalLogs");
     
         this.service = new Service.LockManagement(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LockMechanism:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockCurrentState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockCurrentState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockTargetState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockTargetState, 0);

         this.service = new Service.LockMechanism(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Microphone:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute,0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume, 0);

         this.service = new Service.Microphone(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.MotionSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.MotionDetected) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.MotionDetected, 0);

         this.service = new Service.MotionSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.OccupancySensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OccupancyDetected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OccupancyDetected, 0);

         this.service = new Service.OccupancySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Outlet:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OutletInUse)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OutletInUse, 0);

         this.service = new Service.Outlet(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Pairing:

         this.service = new Service.Pairing(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.ProtocolInformation:

         this.service = new Service.ProtocolInformation(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Relay:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayEnabled)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayEnabled, 1);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayControlPoint)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayControlPoint, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "My_Relay");


         this.service = new Service.Relay(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.SecuritySystem:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState, 3);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState)  == undefined )
             this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState, 3);
  
         this.service = new Service.SecuritySystem(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.ServiceLabel:
         this.service = new Service.ServiceLabel(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Slat:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentSlatState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentSlatState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SlatType)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SlatType, 0);

         this.service = new Service.Slat(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.SmokeSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SmokeDetected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SmokeDetected, 0);

         this.service = new Service.SmokeSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Speaker:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute,0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume, 0);

         this.service = new Service.Speaker(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.StatefulProgrammableSwitch:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, 0);

         this.service = new Service.StatefulProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.StatelessProgrammableSwitch:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, 0);

         this.service = new Service.StatelessProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Switch:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Switch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Television:
         this.service = new Service.Television(this.name, this.name);
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);
    
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ActiveIdentifier)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ActiveIdentifier, "1234");
   
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName,'tv');
   
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode, "0");
    
         this.service = new Service.Television(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TelevisionSpeaker:
         this.service = new Service.TelevisionSpeaker(this.name, this.name);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute, 0);

         this.service = new Service.TelevisionSpeaker(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TemperatureSensor:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature, 50.0);

         this.service = new Service.TemperatureSensor(this.name, this.name); 
         break;
      case CMD4_DEVICE_TYPE_ENUM.Thermostat:
         this.log("Setting up Thermostat default characteristics");
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature, 50.0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetTemperature)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetTemperature, 50.0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits, 0);

         this.service = new Service.Thermostat(this.name, this.name); 
         break;
      case CMD4_DEVICE_TYPE_ENUM.TimeInformation:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTime)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTime, "11:15");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.DayoftheWeek)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.DayoftheWeek, 1);  // Monday

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TimeUpdate)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TimeUpdate, 0);   // false

         this.service = new Service.TimeInformation(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TunneledBTLEAccessoryService:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "TLB");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AccessoryIdentifier)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AccessoryIdentifier, "TLB");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber, "0");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected, "1");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising, "1");

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout, "6000");

         this.service = new Service.TunneledBTLEAccessoryService(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Valve:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ValveType)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ValveType, 0);

         this.service = new Service.Valve(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Window:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.Window(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.WindowCovering:
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState)  == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.WindowCovering(this.name, this.name);
         break;
      default:
      {
         // The default is a lightBulb service
         this.log ("CMD4: Unknown type: %s for %s. Defaulting it to a Switch. Did you possibly spell it incorrectly?", this.type, this.name);
  
         // Required
         if ( this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On) == undefined )
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Switch(this.name, this.name);
  
      }

   }
   
   // The default timeout is 1 minute. Timeouts are in milliseconds
   if (! this.timeout )
      this.timeout = DEFAULT_TIMEOUT;
   
            
   // The defaault interval is 1 minute. Intervals are in seconds
   if ( ! this.interval )
      this.interval = DEFAULT_INTERVAL;

   // The default respnse time is in seconds
   if ( ! this.stateChangeResponseTime )
      this.stateChangeResponseTime = MEDIUM_STATE_CHANGE_RESPONSE_TIME;
         

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
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.properties.length )
      {
         this.log ("CMD4 Warning: setStoredValue - Characteristic '%s' for '%s' not known", accTypeEnumIndex, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      this.storedValuesPerCharacteristic[accTypeEnumIndex] = value;
   },

   getStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.properties.length)
      {
         this.log ("CMD4 Warning: getStoredValue - Characteristic '%s' for '%s' not known", accTypeEnumIndex, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      return this.storedValuesPerCharacteristic[accTypeEnumIndex];
   },
   testStoredValueForIndex:function (accTypeEnumIndex)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.properties.length)
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

      for ( var jsonIndex = 0;
                jsonIndex < pollingConfig.length;
                jsonIndex ++ )
      {
          // *NEW* Characteristic polling is a json var
          var jsonPollingConfig = pollingConfig[jsonIndex];

         for ( var key in jsonPollingConfig )
         {
            var ucKey = ucFirst(key);
            var value = jsonPollingConfig[key];
     
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
                  // findIndexOf
                  var accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucKey);
                  
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
   setValue:function (value, accTypeEnumIndex, characteristic, callback)
   {
      var self = this;

      var characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name;

      var cmd = this.state_cmd + " Set '" + this.name + "' '" + characteristicString  + "' '" + value  + "'";
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
            var responded  = false;

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
      var self = this;

      var characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name;

      var cmd = this.state_cmd + " Get '" + this.name + "' '" + characteristicString  + "'";


      self.log.debug("getValue %s function for: %s cmd: %s", characteristicString, self.name, cmd);

      // Execute command to Get a characteristics value for an accessory
      var child = exec(cmd, {timeout:self.timeout}, function (error, stdout, stderr)
      {
         if (error) {
            self.log("getGeneric %s function for: %s cmd: %s failed.", characteristicString, self.name, cmd);
            self.log(error);
            self.log(stdout);
            self.log(stderr);
            callback( error, 0 );
         } else {
            var words = stdout.match(/\S+/gi);

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
                  // self.log( "getValue Retrieved %s %s for: %s. translated to %f", characteristicString, words[0], self.name, value);
           
                  // Store history using fakegato if set up
                  self.updateAccessoryAttribute(accTypeEnumIndex, value);

                  callback(null,value);
               } else {
                  var lowerCaseWord = words[0].toLowerCase();

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
    // Note: If it were ever possible to bind
    //       the parameters to getValue, this functkion
    //       oould be shrinked to one big for loop.
    //
    //
    // ***********************************************
    setupAllServices: function (service)
    {
        this.log.debug("Setting up services");
 
        var perms = "";
 
        var characteristic = Characteristic.AccessoryFlags;
        var accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AccessoryFlags;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AccessoryFlags, Characteristic.AccessoryFlags, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AccessoryFlags, Characteristic.AccessoryFlags, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Active;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( Characteristic.Active );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Active, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Active, Characteristic.Active, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ActiveIdentifier;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ActiveIdentifier;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ActiveIdentifier, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ActiveIdentifier, Characteristic.ActiveIdentifier, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.AccessoryIdentifier;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AccessoryIdentifier;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AccessoryIdentifier, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AccessoryIdentifier, Characteristic.AccessoryIdentifier, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.AdministratorOnlyAccess;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AdministratorOnlyAccess;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AdministratorOnlyAccess, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AdministratorOnlyAccess, Characteristic.AdministratorOnlyAccess, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirParticulateDensity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateDensity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AirParticulateDensity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AirParticulateDensity, Characteristic.AirParticulateDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirParticulateSize;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateSize;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AirParticulateSize, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AirParticulateSize, Characteristic.AirParticulateSize, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirQuality;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirQuality;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AirQuality, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AirQuality, Characteristic.AirQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AudioFeedback;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AudioFeedback;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.AudioFeedback, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.AudioFeedback, Characteristic.AudioFeedback, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.BatteryLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.BatteryLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.BatteryLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.BatteryLevel, Characteristic.BatteryLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Brightness;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Brightness;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Brightness, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Brightness, Characteristic.Brightness, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxideDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected, Characteristic.CarbonDioxideDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxideLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonDioxideLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonDioxideLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonDioxideLevel, Characteristic.CarbonDioxideLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxidePeakLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonDioxidePeakLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonDioxidePeakLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonDioxidePeakLevel, Characteristic.CarbonDioxidePeakLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxideDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected, Characteristic.CarbonMonoxideDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxideLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonMonoxideLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonMonoxideLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonMonoxideLevel, Characteristic.CarbonMonoxideLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxidePeakLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CarbonMonoxidePeakLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CarbonMonoxidePeakLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CarbonMonoxidePeakLevel, Characteristic.CarbonMonoxidePeakLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Category;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Category;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Category, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Category, Characteristic.Category, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ChargingState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ChargingState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ChargingState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ChargingState, Characteristic.ChargingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ClosedCaptions;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ClosedCaptions, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ClosedCaptions, Characteristic.ClosedCaptions, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ColorTemperature;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ColorTemperature;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ColorTemperature, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ColorTemperature, Characteristic.ColorTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ConfiguredName;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ConfiguredName;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ConfiguredName, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ConfiguredName, Characteristic.ConfiguredName, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.ConfigureBridgedAccessoryStatus;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus, Characteristic.ConfigureBridgedAccessoryStatus, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.ConfigureBridgedAccessory;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessory;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessory, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessory, Characteristic.ConfigureBridgedAccessory, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ContactSensorState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ContactSensorState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ContactSensorState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ContactSensorState, Characteristic.ContactSensorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CoolingThresholdTemperature;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CoolingThresholdTemperature;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CoolingThresholdTemperature, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CoolingThresholdTemperature, Characteristic.CoolingThresholdTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentAirPurifierState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState, Characteristic.CurrentAirPurifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentAmbientLightLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel, Characteristic.CurrentAmbientLightLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentDoorState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentDoorState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentDoorState, Characteristic.CurrentDoorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentFanState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentFanState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentFanState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentFanState, Characteristic.CurrentFanState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHeaterCoolerState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState, Characteristic.CurrentHeaterCoolerState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHeatingCoolingState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState, Characteristic.CurrentHeatingCoolingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHorizontalTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle, Characteristic.CurrentHorizontalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHumidifierDehumidifierState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState, Characteristic.CurrentHumidifierDehumidifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentMediaState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentMediaState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentMediaState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentMediaState, Characteristic.CurrentMediaState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentPosition;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentPosition;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentPosition, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentPosition, Characteristic.CurrentPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentRelativeHumidity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity, Characteristic.CurrentRelativeHumidity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentSlatState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentSlatState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentSlatState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentSlatState, Characteristic.CurrentSlatState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentTemperature;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentTemperature, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentTemperature, Characteristic.CurrentTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentTiltAngle, Characteristic.CurrentTiltAngle, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.CurrentTime;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTime;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentTime, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentTime, Characteristic.CurrentTime, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentVerticalTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle, Characteristic.CurrentVerticalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentVisibilityState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentVisibilityState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.CurrentVisibilityState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.CurrentVisibilityState, Characteristic.CurrentVisibilityState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.DayoftheWeek;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.DayoftheWeek;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.DayoftheWeek, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.DayoftheWeek, Characteristic.DayoftheWeek, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DigitalZoom;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.DigitalZoom;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.DigitalZoom, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.DigitalZoom, Characteristic.DigitalZoom, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.DiscoverBridgedAccessories;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.DiscoverBridgedAccessories;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.DiscoverBridgedAccessories, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.DiscoverBridgedAccessories, Characteristic.DiscoverBridgedAccessories, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DiscoveredBridgedAccessories;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.DiscoveredBridgedAccessories;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.DiscoveredBridgedAccessories, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.DiscoveredBridgedAccessories, Characteristic.DiscoveredBridgedAccessories, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DisplayOrder;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.DisplayOrder;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.DisplayOrder, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.DisplayOrder, Characteristic.DisplayOrder, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FilterChangeIndication;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.FilterChangeIndication;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.FilterChangeIndication, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.FilterChangeIndication, Characteristic.On, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FilterLifeLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.FilterLifeLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.FilterLifeLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.FilterLifeLevel, Characteristic.FilterLifeLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FirmwareRevision;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.FirmwareRevision;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.FirmwareRevision, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.FirmwareRevision, Characteristic.FirmwareRevision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HardwareRevision;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.HardwareRevision;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.HardwareRevision, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.HardwareRevision, Characteristic.HardwareRevision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HeatingThresholdTemperature;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.HeatingThresholdTemperature;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.HeatingThresholdTemperature, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.HeatingThresholdTemperature, Characteristic.HeatingThresholdTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HoldPosition;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.HoldPosition;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.HoldPosition, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.HoldPosition, Characteristic.HoldPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Hue;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Hue;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Hue, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Hue, Characteristic.Hue, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Identify;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Identify;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Identify, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Identify, Characteristic.Identify, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ImageMirroring;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ImageMirroring;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ImageMirroring, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ImageMirroring, Characteristic.ImageMirroring, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ImageRotation;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ImageRotation;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ImageRotation, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ImageRotation, Characteristic.ImageRotation, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InputDeviceType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.InputDeviceType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.InputDeviceType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.InputDeviceType, Characteristic.InputDeviceType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InputSourceType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.InputSourceType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.InputSourceType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.InputSourceType, Characteristic.InputSourceType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InUse;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.InUse;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.InUse, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.InUse, Characteristic.InUse, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.IsConfigured;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.IsConfigured;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.IsConfigured, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.IsConfigured, Characteristic.IsConfigured, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LeakDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LeakDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LeakDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LeakDetected, Characteristic.LeakDetected, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.LinkQuality;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LinkQuality;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LinkQuality, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LinkQuality, Characteristic.LinkQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockControlPoint;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockControlPoint;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LockControlPoint, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockControlPoint, Characteristic.LockControlPoint, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockCurrentState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockCurrentState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LockCurrentState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockCurrentState, Characteristic.LockCurrentState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockLastKnownAction;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockLastKnownAction;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.properties[CMD4_ACC_TYPE_ENUM.LockLastKnownAction].name, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockLastKnownAction, Characteristic.LockLastKnownAction, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockManagementAutoSecurityTimeout;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockManagementAutoSecurityTimeout;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LockManagementAutoSecurityTimeout, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockManagementAutoSecurityTimeout, Characteristic.LockManagementAutoSecurityTimeout, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockPhysicalControls;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockPhysicalControls;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LockPhysicalControls, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockPhysicalControls, Characteristic.LockPhysicalControls, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockTargetState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.LockTargetState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.LockTargetState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.LockTargetState, Characteristic.LockTargetState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Logs;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Logs;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Logs, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Manufacturer, Characteristic.Manufacturer, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Model;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Model;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Model, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.On, Characteristic.Model, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Manufacturer;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Manufacturer;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Manufacturer, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Manufacturer, Characteristic.Manufacturer, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.MotionDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.MotionDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.MotionDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.MotionDetected, Characteristic.MotionDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Mute;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Mute, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Mute, Characteristic.Mute, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Name;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Name;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Name, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Name, Characteristic.Name, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.NightVision;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.NightVision;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.NightVision, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.NightVision, Characteristic.NightVision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.NitrogenDioxideDensity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.NitrogenDioxideDensity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.NitrogenDioxideDensity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.NitrogenDioxideDensity, Characteristic.NitrogenDioxideDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ObstructionDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ObstructionDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ObstructionDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ObstructionDetected, Characteristic.ObstructionDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OccupancyDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.OccupancyDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.OccupancyDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.OccupancyDetected, Characteristic.OccupancyDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.On;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.On, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.On, Characteristic.On, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OpticalZoom;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.OpticalZoom;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.OpticalZoom, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.OpticalZoom, Characteristic.OpticalZoom, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OutletInUse;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.OutletInUse;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.OutletInUse, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.OutletInUse, Characteristic.OutletInUse, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OzoneDensity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.OzoneDensity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.OzoneDensity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.OzoneDensity, Characteristic.OzoneDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairSetup;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PairSetup;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PairSetup, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PairSetup, Characteristic.PairSetup, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairVerify;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PairVerify;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PairVerify, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PairVerify, Characteristic.PairVerify, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairingFeatures;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PairingFeatures;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PairingFeatures, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PairingFeatures, Characteristic.PairingFeatures, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairingPairings;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PairingPairings;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PairingPairings, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PairingPairings, Characteristic.PairingPairings, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PictureMode;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PictureMode;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PictureMode, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PictureMode, Characteristic.PictureMode, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.PM10Density;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PM10Density;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PM10Density, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PM10Density, Characteristic.PM10Density, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PM2_5Density;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PM2_5Density;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PM2_5Density, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PM2_5Density, Characteristic.PM2_5Density, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PositionState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PositionState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PositionState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PositionState, Characteristic.PositionState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PowerModeSelection;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PowerModeSelection;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.PowerModeSelection, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.PowerModeSelection, Characteristic.PowerModeSelection, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgramMode;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgramMode;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ProgramMode, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ProgramMode, Characteristic.ProgramMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgrammableSwitchEvent;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgrammableSwitchOutputState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState, Characteristic.ProgrammableSwitchOutputState, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.Reachable;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Reachable;
        if ( this.getStoredValueForIndex(
              accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Reachable, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Reachable, Characteristic.Reachable, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.RelativeHumidityDehumidifierThreshold;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelativeHumidityDehumidifierThreshold;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RelativeHumidityDehumidifierThreshold, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RelativeHumidityDehumidifierThreshold, Characteristic.RelativeHumidityDehumidifierThreshold, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelativeHumidityHumidifierThreshold;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelativeHumidityHumidifierThreshold;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RelativeHumidityHumidifierThreshold, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RelativeHumidityHumidifierThreshold, Characteristic.RelativeHumidityHumidifierThreshold, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.RelayEnabled;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelayEnabled;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RelayEnabled, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RelayEnabled, Characteristic.RelayEnabled, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelayState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelayState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RelayState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RelayState, Characteristic.RelayState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelayControlPoint;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RelayControlPoint;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RelayControlPoint, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RelayControlPoint, Characteristic.RelayControlPoint, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RemainingDuration;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RemainingDuration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RemainingDuration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RemainingDuration, Characteristic.RemainingDuration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RemoteKey;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RemoteKey;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RemoteKey, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RemoteKey, Characteristic.RemoteKey, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ResetFilterIndication;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ResetFilterIndication;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ResetFilterIndication, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ResetFilterIndication, Characteristic.ResetFilterIndication, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RotationDirection;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RotationDirection;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RotationDirection, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RotationDirection, Characteristic.RotationDirection, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RotationSpeed;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.RotationSpeed;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.RotationSpeed, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.RotationSpeed, Characteristic.RotationSpeed, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Saturation;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Saturation;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Saturation, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Saturation, Characteristic.Saturation, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemAlarmType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SecuritySystemAlarmType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SecuritySystemAlarmType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SecuritySystemAlarmType, Characteristic.SecuritySystemAlarmType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemCurrentState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState, Characteristic.SecuritySystemCurrentState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemTargetState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState, Characteristic.SecuritySystemTargetState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SelectedRTPStreamConfiguration;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration,Characteristic.SelectedRTPStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SerialNumber;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SerialNumber;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SerialNumber, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SerialNumber, Characteristic.SerialNumber, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ServiceLabelIndex;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ServiceLabelIndex;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ServiceLabelIndex, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ServiceLabelIndex, Characteristic.ServiceLabelIndex, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ServiceLabelNamespace;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace, Characteristic.ServiceLabelNamespace, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SetDuration;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SetDuration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SetDuration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SetDuration, Characteristic.SetDuration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SetupEndpoints;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SetupEndpoints;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SetupEndpoints, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SetupEndpoints, Characteristic.SetupEndpoints, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SlatType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SlatType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SlatType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SlatType, Characteristic.SlatType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SleepDiscoveryMode;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode, Characteristic.SleepDiscoveryMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SmokeDetected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SmokeDetected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SmokeDetected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SmokeDetected, Characteristic.SmokeDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusActive;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusActive;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StatusActive, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StatusActive, Characteristic.StatusActive, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusFault;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusFault;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StatusFault, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StatusFault, Characteristic.StatusFault, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusJammed;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusJammed;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StatusJammed, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StatusJammed, Characteristic.StatusJammed, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusLowBattery;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusLowBattery;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StatusLowBattery, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StatusLowBattery, Characteristic.StatusLowBattery, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusTampered;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StatusTampered;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StatusTampered, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StatusTampered, Characteristic.StatusTampered, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StreamingStatus;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.StreamingStatus;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.StreamingStatus, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.StreamingStatus, Characteristic.StreamingStatus, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SulphurDioxideDensity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SulphurDioxideDensity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SulphurDioxideDensity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SulphurDioxideDensity, Characteristic.SulphurDioxideDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedAudioStreamConfiguration;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration, Characteristic.SupportedAudioStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedRTPConfiguration;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration, Characteristic.SupportedRTPConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedVideoStreamConfiguration;  // 130
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration, Characteristic.SupportedVideoStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SwingMode;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.SwingMode;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.SwingMode, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.SwingMode, Characteristic.SwingMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetAirPurifierState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetAirPurifierState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetAirPurifierState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetAirPurifierState, Characteristic.TargetAirPurifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetAirQuality;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetAirQuality;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetAirQuality, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetAirQuality, Characteristic.TargetAirQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetDoorState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetDoorState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetDoorState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetDoorState, Characteristic.TargetDoorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetFanState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetFanState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetFanState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetFanState, Characteristic.TargetFanState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHeaterCoolerState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState, Characteristic.TargetHeaterCoolerState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHeatingCoolingState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState, Characteristic.TargetHeatingCoolingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHorizontalTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle, Characteristic.TargetHorizontalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHumidifierDehumidifierState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState, Characteristic.TargetHumidifierDehumidifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetMediaState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetMediaState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetMediaState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetMediaState, Characteristic.TargetMedia, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetPosition;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetPosition;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetPosition, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetPosition, Characteristic.TargetPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetRelativeHumidity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity, Characteristic.TargetRelativeHumidity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetSlatState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetSlatState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetSlatState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetSlatState, Characteristic.TargetSlatState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetTemperature;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetTemperature, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetTemperature, Characteristic.TargetTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetTiltAngle, Characteristic.TargetTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetVerticalTiltAngle;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle, Characteristic.TargetVerticalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetVisibilityState;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetVisibilityState;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TargetVisibilityState, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TargetVisibilityState, Characteristic.CMD4_TargetVisibilityState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TemperatureDisplayUnits;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits, Characteristic.TemperatureDisplayUnits, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.TimeUpdate;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TimeUpdate;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TimeUpdate, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TimeUpdate, Characteristic.TimeUpdate, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryAdvertising;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising, Characteristic.TunneledAccessoryAdvertising, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryConnected;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected, Characteristic.TunneledAccessoryConnected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryStateNumber;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber, Characteristic.TunneledAccessoryStateNumber, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunnelConnectionTimeout;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout, Characteristic.TunnelConnectionTimeout, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ValveType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.ValveType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.ValveType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.ValveType, Characteristic.ValveType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Version;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Version;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Version, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Version, Characteristic.Version, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.VOCDensity;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.VOCDensity;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.VOCDensity, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.VOCDensity, Characteristic.VOCDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Volume;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Volume;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.Volume, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.Volume, Characteristic.Volume, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.VolumeControlType;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.VolumeControlType;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.VolumeControlType, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.VolumeControlType, Characteristic.VolumeControlType, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.VolumeSelector;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.VolumeSelector;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.VolumeSelector, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.VolumeSelector, Characteristic.VolumeSelector, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.WaterLevel;
        accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.WaterLevel;
        if ( this.getStoredValueForIndex(accTypeEnumIndex) != undefined)
        {
            if ( ! service.testCharacteristic(characteristic))
            {
                service.addCharacteristic( characteristic );
            }
     
            perms = service.getCharacteristic(characteristic).props.perms;
     
            if ( service.getCharacteristic(characteristic).listeners('get').length == 0 )
            {
                // Add Read services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.READ) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('get', (callback) => {
                        this.getValue(CMD4_ACC_TYPE_ENUM.WaterLevel, callback);
                        });
                }
            }
     
            if ( service.getCharacteristic(characteristic).listeners('set').length == 0 )
            {
                // Add Write services for characterisitcs, if possible
                if (perms.indexOf(Characteristic.Perms.WRITE) != -1)
                {
                    service.getCharacteristic(characteristic)
                    .on('set', (value,callback) => {
                        this.setValue(value, CMD4_ACC_TYPE_ENUM.WaterLevel, Characteristic.WaterLevel, callback);
                        });
                }
            }
        }
   },
   updateAccessoryAttribute: function (accTypeEnumIndex, value)
   {
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.properties.length )
      {
         this.log ("Internal error.: updateAccessoryAttribute - accTypeEnumIndex '%s' for '%s' not known", accTypeEnumIndex, this.name);
         return;
      }

      this.setStoredValueForIndex(accTypeEnumIndex, value);

      if ( this.loggingService )
      {
         var firstParm, secondParm, thirdParm;
         var ucFirstParm, ucSecondParm, ucThirdParm;
         var firstParmValue, secondParmValue, thirdParmValue = 0;
         var firstParmIndex, secondParmIndex, thirdParmIndex;
         
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

      for ( var key in fakegatoConfig )
      {
          var ucKey = ucFirst ( key );
          var value = fakegatoConfig[ key ];
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
                 var ucValue = ucFirst(value);
                 var accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === ucValue);
                 
                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if (this.testStoredValueForIndex(accTypeEnumIndex) < 0 && ucValue != '0')
                    this.log.warn("Not a valid characteristic '%s' for fakegato to log of '%s'", value, key);
                 break;
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
      var length = this == null ? 0 : Object.keys(this).length;
      if (!length)
         return -1;
      
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
         index = nativeMax(length + index, 0);
      }

      for (var i=index; i < length; i++)
      {
         if (predicate(this[i], i, this)) {
            return i;
         }
      }
      return -1;
    }
});

// Returns the index of the value if it exists, or undefined if not
Object.defineProperty(Object.prototype, "assocIndexOf", {
   value: function(value) {
      var index = 0;
      for (var key in this)
      {
         if (key == value)
            return index;

         index++;
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

function ucFirst(string)
{
   if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
   else {
      console.log("Asked to upper  case first character of NULL String");
      return "undefined";
   }
}

function lcFirst(string)
{
   if (string)
      return string.charAt(0).toLowerCase() + string.slice(1);
   else {
      console.log("Asked to lower case first character of NULL String");
      return "ucdefined";
   }
}

function isNumeric(num){
   num = "" + num; //coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}
