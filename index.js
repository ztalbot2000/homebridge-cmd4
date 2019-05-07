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
// Here we make sure that required characteristics are set.
Cmd4Platform.prototype.setupStatePollingPerAccessory = function (accessory)
{
   let self = accessory;

   let accTypeEnumIndex = -1;

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

   switch( this.typeIndex )
   {
      case CMD4_DEVICE_TYPE_ENUM.AccessoryInformation:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Identify ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Identify, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Manufacturer ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Manufacturer, "Cmd4");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Model ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Model, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "My_AccessoryInformation");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SerialNumber ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SerialNumber, "ABC001");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FirmwareRevision))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FirmwareRevision, "100.1.1");

         this.service = new Service.AccessoryInformation(this.name, this.name);            
         break;
      case CMD4_DEVICE_TYPE_ENUM.AirPurifier:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetAirPurifierState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetAirPurifierState, 0);
            
         // The default respnse time is in seconds
         if ( ! this.stateChangeResponseTime )
            this.stateChangeResponseTime = SLOW_STATE_CHANGE_RESPONSE_TIME;        

         this.service = new Service.AirPurifier(this.name, this.name);  
         break;
      case CMD4_DEVICE_TYPE_ENUM.AirQualitySensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AirQuality ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AirQuality, 1);
            
         // The default respnse time is in seconds
         if ( ! this.stateChangeResponseTime )
            this.stateChangeResponseTime = FAST_STATE_CHANGE_RESPONSE_TIME;
     
         this.service = new Service.AirQualitySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.BatteryService:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.BatteryLevel ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.BatteryLevel, 50);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ChargingState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ChargingState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusLowBattery ))
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
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected ))
             this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected, 0); 

         this.service = new Service.CarbonDioxideSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.CarbonMonoxideSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected, 0);
     
         this.service = new Service.CarbonMonoxideSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.ContactSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ContactSensorState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ContactSensorState, 0);

         this.service = new Service.ContactSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Door:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.Door(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.DoorBell:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent))
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
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Fan(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Fanv2:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);

         this.service = new Service.Fanv2(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Faucet:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 1);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusFault ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.StatusFault, 0);

         this.service = new Service.Faucet(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.FilterMaintenance:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FilterChangeIndication ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.FilterChangeIndication, 0);

         this.service = new Service.FilterMaintenance(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.GarageDoorOpener:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentDoorState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentDoorState, 0); 

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetDoorState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetDoorState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ObstructionDetected ))
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
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity, 1);
     
         this.service = new Service.HumiditySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.InputSource:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName, "My_InputSource");
    
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InputSourceType ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InputSourceType, 1);
    
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.IsConfigured ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.IsConfigured, 1);
    
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentVisibilityState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentVisibilityState, 2);
  
         this.service = new Service.InputSource(this.name, this.name);
         break;
       case CMD4_DEVICE_TYPE_ENUM.IrrigationSystem:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 1);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgramMode ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgramMode, 1);
  
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InUse ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.InUse, 1);
  
         this.service = new Service.IrrigationSystem(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LeakSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LeakDetected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LeakDetected, 0);

         this.service = new Service.LeakSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LightSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel, 0);
     
         this.service = new Service.LightSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Lightbulb:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Lightbulb(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LockManagement:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockControlPoint ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockControlPoint, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Logs ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Logs, "OptionalLogs");
     
         this.service = new Service.LockManagement(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.LockMechanism:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockCurrentState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockCurrentState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockTargetState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.LockTargetState, 0);

         this.service = new Service.LockMechanism(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Microphone:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute,0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume, 0);

         this.service = new Service.Microphone(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.MotionSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.MotionDetected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.MotionDetected, 0);

         this.service = new Service.MotionSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.OccupancySensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OccupancyDetected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OccupancyDetected, 0);

         this.service = new Service.OccupancySensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Outlet:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.OutletInUse ))
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
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayEnabled ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayEnabled, 1);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayControlPoint ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.RelayControlPoint, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "My_Relay");

         this.service = new Service.Relay(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.SecuritySystem:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState, 3);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState ))
             this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState, 3);
  
         this.service = new Service.SecuritySystem(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.ServiceLabel:
         this.service = new Service.ServiceLabel(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Slat:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentSlatState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentSlatState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SlatType ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SlatType, 0);

         this.service = new Service.Slat(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.SmokeSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SmokeDetected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SmokeDetected, 0);

         this.service = new Service.SmokeSensor(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Speaker:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute,0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Volume, 0);

         this.service = new Service.Speaker(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.StatefulProgrammableSwitch:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, 0);

         this.service = new Service.StatefulProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.StatelessProgrammableSwitch:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent, 0);

         this.service = new Service.StatelessProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Switch:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On, 0);

         this.service = new Service.Switch(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Television:  
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Active, 0);
    
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ActiveIdentifier ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ActiveIdentifier, "1234");
   
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ConfiguredName,'tv');
   
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode, "0");
    
         this.service = new Service.Television(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TelevisionSpeaker:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Mute, 0);

         this.service = new Service.TelevisionSpeaker(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TemperatureSensor:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature, 50.0);

         this.service = new Service.TemperatureSensor(this.name, this.name); 
         break;
      case CMD4_DEVICE_TYPE_ENUM.Thermostat:
         this.log("Setting up Thermostat default characteristics");
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTemperature, 50.0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetTemperature ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetTemperature, 50.0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits, 0);

         this.service = new Service.Thermostat(this.name, this.name); 
         break;
      case CMD4_DEVICE_TYPE_ENUM.TimeInformation:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTime ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentTime, "11:15");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.DayoftheWeek ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.DayoftheWeek, 1);  // Monday

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TimeUpdate ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TimeUpdate, 0);   // false

         this.service = new Service.TimeInformation(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.TunneledBTLEAccessoryService:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.Name, "TLB");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AccessoryIdentifier ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.AccessoryIdentifier, "TLB");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber, "0");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected, "1");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising, "1");

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout ))
          this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout, "6000");

         this.service = new Service.TunneledBTLEAccessoryService(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Valve:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ValveType ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.ValveType, 0);

         this.service = new Service.Valve(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.Window:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.Window(this.name, this.name);
         break;
      case CMD4_DEVICE_TYPE_ENUM.WindowCovering:
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.CurrentPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.TargetPosition, 0);

         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState ))
            this.setStoredValueForIndex(CMD4_ACC_TYPE_ENUM.PositionState, 0);

         this.service = new Service.WindowCovering(this.name, this.name);
         break;
      default:
      {
         // The default is a lightBulb service
         this.log ("CMD4: Unknown type: %s for %s. Defaulting it to a Switch. Did you possibly spell it incorrectly?", this.type, this.name);
  
         // Required
         if ( ! this.getStoredValueForIndex(CMD4_ACC_TYPE_ENUM.On ))
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

        for (let accTypeEnumIndex = 0;
               accTypeEnumIndex < this.storedValuesPerCharacteristic.length; 
               accTypeEnumIndex++ )
        {
            if ( this.storedValuesPerCharacteristic[accTypeEnumIndex] )
            {
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
      if (accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.properties.length )
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
 
function ucFirst(string)
{
   if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
   else {
      console.log("Asked to upper  case first character of NULL String");
      return "undefined";
   }
}

function isNumeric(num){
   num = "" + num; //coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}
