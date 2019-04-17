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

const CMD4_ACC_TYPE_AccessoryInformation         = 'AccessoryInformation',
      CMD4_ACC_TYPE_AirPurifier                  = 'AirPurifier',
      CMD4_ACC_TYPE_AirQualitySensor             = 'AirQualitySensor',
      CMD4_ACC_TYPE_BatteryService               = 'BatteryService',
      CMD4_ACC_TYPE_BridgeConfiguration          = 'BridgeConfiguration',
      CMD4_ACC_TYPE_BridgingState                = 'BridgingState',
      CMD4_ACC_TYPE_CameraControl                = 'CameraControl',
      CMD4_ACC_TYPE_CameraRTPStreamManagement    = 'CameraRTPStreamManagement',
      CMD4_ACC_TYPE_CarbonDioxideSensor          = 'CarbonDioxideSensor',
      CMD4_ACC_TYPE_CarbonMonoxideSensor         = 'CarbonMonoxideSensor',
      CMD4_ACC_TYPE_ContactSensor                = 'ContactSensor',
      CMD4_ACC_TYPE_Door                         = 'Door',
      CMD4_ACC_TYPE_DoorBell                     = 'DoorBell',
      CMD4_ACC_TYPE_Fan                          = 'Fan',
      CMD4_ACC_TYPE_Fanv1                        = 'Fanv1',
      CMD4_ACC_TYPE_Fanv2                        = 'Fanv2',
      CMD4_ACC_TYPE_FilterMaintenance            = 'FilterMaintenance',
      CMD4_ACC_TYPE_Faucet                       = 'Faucet',
      CMD4_ACC_TYPE_GarageDoorOpener             = 'GarageDoorOpener',
      CMD4_ACC_TYPE_HeaterCooler                 = 'HeaterCooler',
      CMD4_ACC_TYPE_HumidifierDehumidifier       = 'HumidifierDehumidifier',
      CMD4_ACC_TYPE_HumiditySensor               = 'HumiditySensor',
      CMD4_ACC_TYPE_InputSource                  = 'InputSource',
      CMD4_ACC_TYPE_IrrigationSystem             = 'IrrigationSystem',
      CMD4_ACC_TYPE_LeakSensor                   = 'LeakSensor',
      CMD4_ACC_TYPE_LightSensor                  = 'LightSensor',
      CMD4_ACC_TYPE_Lightbulb                    = 'Lightbulb',
      CMD4_ACC_TYPE_LockManagement               = 'LockManagement',
      CMD4_ACC_TYPE_LockMechanism                = 'LockMechanism',
      CMD4_ACC_TYPE_Microphone                   = 'Microphone',
      CMD4_ACC_TYPE_MotionSensor                 = 'MotionSensor',
      CMD4_ACC_TYPE_OccupancySensor              = 'OccupancySensor',
      CMD4_ACC_TYPE_Outlet                       = 'Outlet',
      CMD4_ACC_TYPE_Pairing                      = 'Pairing',
      CMD4_ACC_TYPE_ProtocolInformation          = 'ProtocolInformation',
      CMD4_ACC_TYPE_Relay                        = 'Relay',
      CMD4_ACC_TYPE_SecuritySystem               = 'SecuritySystem',
      CMD4_ACC_TYPE_ServiceLabel                 = 'ServiceLabel',
      CMD4_ACC_TYPE_Slat                         = 'Slat',
      CMD4_ACC_TYPE_SmokeSensor                  = 'SmokeSensor',
      CMD4_ACC_TYPE_Speaker                      = 'Speaker',
      CMD4_ACC_TYPE_StatefulProgrammableSwitch   = 'StatefulProgrammableSwitch',
      CMD4_ACC_TYPE_StatelessProgrammableSwitch  = 'StatelessProgrammableSwitch',
      CMD4_ACC_TYPE_Switch                       = 'Switch',
      CMD4_ACC_TYPE_Television                   = 'Television',
      CMD4_ACC_TYPE_TelevisionSpeaker            = 'TelevisionSpeaker',
      CMD4_ACC_TYPE_TemperatureSensor            = 'TemperatureSensor',
      CMD4_ACC_TYPE_Thermostat                   = 'Thermostat',
      CMD4_ACC_TYPE_TimeInformation              = 'TimeInformation',
      CMD4_ACC_TYPE_TunneledBTLEAccessoryService = 'TunneledBTLEAccessoryService',
      CMD4_ACC_TYPE_Valve                        = 'Valve',
      CMD4_ACC_TYPE_Window                       = 'Window',
      CMD4_ACC_TYPE_WindowCovering               = 'WindowCovering';


const
   CMD4_AccessoryFlags =                       "AccessoryFlags",
   CMD4_Active =                               "Active",
   CMD4_ActiveIdentifier =                     "ActiveIdentifier",
   CMD4_AccessoryIdentifier =                  "AccessoryIdentifier",
   CMD4_AdministratorOnlyAccess =              "AdministratorOnlyAccess",
   CMD4_AirParticulateDensity =                "AirParticulateDensity",
   CMD4_AirParticulateSize =                   "AirParticulateSize",
   CMD4_AirQuality =                           "AirQuality",
   CMD4_AudioFeedback =                        "AudioFeedback",
   CMD4_BatteryLevel =                         "BatteryLevel",            // 10
   CMD4_Brightness =                           "Brightness",
   CMD4_CarbonDioxideDetected =                "CarbonDioxideDetected",
   CMD4_CarbonDioxideLevel =                   "CarbonDioxideLevel",
   CMD4_CarbonDioxidePeakLevel =               "CarbonDioxidePeakLevel",
   CMD4_CarbonMonoxideDetected =               "CarbonMonoxideDetected",
   CMD4_CarbonMonoxideLevel =                  "CarbonMonoxideLevel",
   CMD4_CarbonMonoxidePeakLevel =              "CarbonMonoxidePeakLevel",
   CMD4_Category =                             "Category",
   CMD4_ChargingState =                        "ChargingState",
   CMD4_ClosedCaptions =                       "ClosedCaptions",         // 20
   CMD4_ColorTemperature =                     "ColorTemperature",
   CMD4_ConfiguredName =                       "ConfiguredName",
   CMD4_ConfigureBridgedAccessoryStatus =      "ConfigureBridgedAccessoryStatus",
   CMD4_ConfigureBridgedAccessory =            "ConfigureBridgedAccessory",
   CMD4_ContactSensorState =                   "ContactSensorState",
   CMD4_CoolingThresholdTemperature =          "CoolingThresholdTemperature",
   CMD4_CurrentAirPurifierState =              "CurrentAirPurifierState",
   CMD4_CurrentAmbientLightLevel =             "CurrentAmbientLightLevel",
   CMD4_CurrentDoorState =                     "CurrentDoorState",
   CMD4_CurrentFanState =                      "CurrentFanState",                 // 30
   CMD4_CurrentHeaterCoolerState =             "CurrentHeaterCoolerState",
   CMD4_CurrentHeatingCoolingState =           "CurrentHeatingCoolingState",
   CMD4_CurrentHorizontalTiltAngle =           "CurrentHorizontalTiltAngle",
   CMD4_CurrentHumidifierDehumidifierState =   "CurrentHumidifierDehumidifierState",
   CMD4_CurrentMediaState =                    "CurrentMediaState",
   CMD4_CurrentPosition =                      "CurrentPosition",
   CMD4_CurrentRelativeHumidity =              "CurrentRelativeHumidity",
   CMD4_CurrentSlatState =                     "CurrentSlatState",
   CMD4_CurrentTemperature =                   "CurrentTemperature",
   CMD4_CurrentTiltAngle =                     "CurrentTiltAngle",                // 40
   CMD4_CurrentTime =                          "CurrentTime",
   CMD4_CurrentVerticalTiltAngle =             "CurrentVerticalTiltAngle",
   CMD4_CurrentVisibilityState =               "CurrentVisibilityState",
   CMD4_DayoftheWeek =                         "DayoftheWeek",
   CMD4_DigitalZoom =                          "DigitalZoom",
   CMD4_DiscoverBridgedAccessories =           "DiscoverBridgedAccessories",
   CMD4_DiscoveredBridgedAccessories =         "DiscoveredBridgedAccessories",
   CMD4_DisplayOrder =                         "DisplayOrder",
   CMD4_FilterChangeIndication =               "FilterChangeIndication",
   CMD4_FilterLifeLevel =                      "FilterLifeLevel",                 // 50
   CMD4_FirmwareRevision =                     "FirmwareRevision",
   CMD4_HardwareRevision =                     "HardwareRevision",
   CMD4_HeatingThresholdTemperature =          "HeatingThresholdTemperature",
   CMD4_HoldPosition =                         "HoldPosition",
   CMD4_Hue =                                  "Hue",
   CMD4_Identify =                             "Identify",
   CMD4_ImageMirroring =                       "ImageMirroring",
   CMD4_ImageRotation =                        "ImageRotation",
   CMD4_InputDeviceType =                      "InputDeviceType",
   CMD4_InputSourceType =                      "InputSourceType",               // 60
   CMD4_InUse =                                "InUse",
   CMD4_IsConfigured =                         "IsConfigured",
   CMD4_LeakDetected =                         "LeakDetected",
   CMD4_LinkQuality =                          "LinkQuality",
   CMD4_LockControlPoint =                     "LockControlPoint",
   CMD4_LockCurrentState =                     "LockCurrentState",
   CMD4_LockLastKnownAction =                  "LockLastKnownAction",
   CMD4_LockManagementAutoSecurityTimeout =    "LockManagementAutoSecurityTimeout",
   CMD4_LockPhysicalControls =                 "LockPhysicalControls",
   CMD4_LockTargetState =                      "LockTargetState",                // 70
   CMD4_Logs =                                 "Logs",
   CMD4_Manufacturer =                         "Manufacturer",
   CMD4_Model =                                "Model",
   CMD4_MotionDetected =                       "MotionDetected",
   CMD4_Mute =                                 "Mute",
   CMD4_Name =                                 "Name",
   CMD4_NightVision =                          "NightVision",
   CMD4_NitrogenDioxideDensity =               "NitrogenDioxideDensity",
   CMD4_ObstructionDetected =                  "ObstructionDetected",
   CMD4_OccupancyDetected =                    "OccupancyDetected",               // 80
   CMD4_On =                                   "On",
   CMD4_OpticalZoom =                          "OpticalZoom",
   CMD4_OutletInUse =                          "OutletInUse",
   CMD4_OzoneDensity =                         "OzoneDensity",
   CMD4_PairSetup =                            "PairSetup",
   CMD4_PairVerify =                           "PairVerify",
   CMD4_PairingFeatures =                      "PairingFeatures",
   CMD4_PairingPairings =                      "PairingPairings",
   CMD4_PictureMode =                          "PictureMode",
   CMD4_PM10Density =                          "PM10Density",                     // 90
   CMD4_PM2_5Density =                         "PM2_5Density",
   CMD4_PositionState =                        "PositionState",
   CMD4_PowerModeSelection =                   "PowerModeSelection",
   CMD4_ProgramMode =                          "ProgramMode",
   CMD4_ProgrammableSwitchEvent =              "ProgrammableSwitchEvent",
   CMD4_ProgrammableSwitchOutputState =        "ProgrammableSwitchOutputState",
   CMD4_Reachable =                            "Reachable",
   CMD4_RelativeHumidityDehumidifierThreshold ="RelativeHumidityDehumidifierThreshold",
   CMD4_RelativeHumidityHumidifierThreshold =  "RelativeHumidityHumidifierThreshold",
   CMD4_RelayEnabled =                         "RelayEnabled",                      // 100
   CMD4_RelayState =                           "RelayState",
   CMD4_RelayControlPoint =                    "RelayControlPoint",
   CMD4_RemainingDuration =                    "RemainingDuration",
   CMD4_RemoteKey =                            "RemoteKey",
   CMD4_ResetFilterIndication =                "ResetFilterIndication",
   CMD4_RotationDirection =                    "RotationDirection",
   CMD4_RotationSpeed =                        "RotationSpeed",
   CMD4_Saturation =                           "Saturation",
   CMD4_SecuritySystemAlarmType =              "SecuritySystemAlarmType",
   CMD4_SecuritySystemCurrentState =           "SecuritySystemCurrentState",         // 110
   CMD4_SecuritySystemTargetState =            "SecuritySystemTargetState",
   CMD4_SelectedRTPStreamConfiguration =       "SelectedRTPStreamConfiguration",
   CMD4_SerialNumber =                         "SerialNumber",
   CMD4_ServiceLabelIndex =                    "ServiceLabelIndex",
   CMD4_ServiceLabelNamespace =                "ServiceLabelNamespace",
   CMD4_SetDuration =                          "SetDuration",
   CMD4_SetupEndpoints =                       "SetupEndpoints",
   CMD4_SlatType =                             "SlatType",
   CMD4_SleepDiscoveryMode =                   "SleepDiscoveryMode",
   CMD4_SmokeDetected =                        "SmokeDetected",                      // 120
   CMD4_StatusActive =                         "StatusActive",
   CMD4_StatusFault =                          "StatusFault",
   CMD4_StatusJammed =                         "StatusJammed",
   CMD4_StatusLowBattery =                     "StatusLowBattery",
   CMD4_StatusTampered =                       "StatusTampered",
   CMD4_StreamingStatus =                      "StreamingStatus",
   CMD4_SulphurDioxideDensity =                "SulphurDioxideDensity",
   CMD4_SupportedAudioStreamConfiguration =    "SupportedAudioStreamConfiguration",
   CMD4_SupportedRTPConfiguration =            "SupportedRTPConfiguration",
   CMD4_SupportedVideoStreamConfiguration =    "SupportedVideoStreamConfiguration",     // 130
   CMD4_SwingMode =                            "SwingMode",
   CMD4_TargetAirPurifierState =               "TargetAirPurifierState",
   CMD4_TargetAirQuality =                     "TargetAirQuality",
   CMD4_TargetDoorState =                      "TargetDoorState",
   CMD4_TargetFanState =                       "TargetFanState",
   CMD4_TargetHeaterCoolerState =              "TargetHeaterCoolerState",
   CMD4_TargetHeatingCoolingState =            "TargetHeatingCoolingState",
   CMD4_TargetHorizontalTiltAngle =            "TargetHorizontalTiltAngle",
   CMD4_TargetHumidifierDehumidifierState =    "TargetHumidifierDehumidifierState",
   CMD4_TargetMediaState =                     "TargetMediaState",                      // 140
   CMD4_TargetPosition =                       "TargetPosition",
   CMD4_TargetRelativeHumidity =               "TargetRelativeHumidity",
   CMD4_TargetSlatState =                      "TargetSlatState",
   CMD4_TargetTemperature =                    "TargetTemperature",
   CMD4_TargetTiltAngle =                      "TargetTiltAngle",
   CMD4_TargetVerticalTiltAngle =              "TargetVerticalTiltAngle",
   CMD4_TargetVisibilityState =                "TargetVisibilityState",
   CMD4_TemperatureDisplayUnits =              "TemperatureDisplayUnits",
   CMD4_TimeUpdate =                           "TimeUpdate",
   CMD4_TunneledAccessoryAdvertising =         "TunneledAccessoryAdvertising",             // 160
   CMD4_TunneledAccessoryConnected =           "TunneledAccessoryConnected",
   CMD4_TunneledAccessoryStateNumber =         "TunneledAccessoryStateNumber",
   CMD4_TunnelConnectionTimeout =              "TunnelConnectionTimeout",
   CMD4_ValveType =                            "ValveType",
   CMD4_Version =                              "Version",
   CMD4_VOCDensity =                           "VOCDensity",
   CMD4_Volume =                               "Volume",
   CMD4_VolumeControlType =                    "VolumeControlType",
   CMD4_VolumeSelector =                       "VolumeSelector",
   CMD4_WaterLevel =                           "WaterLevel";                              // 169

const accMapper = [
   CMD4_AccessoryFlags,
   CMD4_Active,
   CMD4_ActiveIdentifier,
   CMD4_AccessoryIdentifier,
   CMD4_AdministratorOnlyAccess,
   CMD4_AirParticulateDensity,
   CMD4_AirParticulateSize,
   CMD4_AirQuality,       
   CMD4_AudioFeedback,   
   CMD4_BatteryLevel,                          // 10 
   CMD4_Brightness,
   CMD4_CarbonDioxideDetected,
   CMD4_CarbonDioxideLevel,
   CMD4_CarbonDioxidePeakLevel,
   CMD4_CarbonMonoxideDetected,
   CMD4_CarbonMonoxideLevel,
   CMD4_CarbonMonoxidePeakLevel,
   CMD4_Category,
   CMD4_ChargingState,
   CMD4_ClosedCaptions,                        // 20
   CMD4_ColorTemperature,
   CMD4_ConfiguredName,
   CMD4_ConfigureBridgedAccessoryStatus,
   CMD4_ConfigureBridgedAccessory,
   CMD4_ContactSensorState,
   CMD4_CoolingThresholdTemperature,
   CMD4_CurrentAirPurifierState,
   CMD4_CurrentAmbientLightLevel,
   CMD4_CurrentDoorState,   
   CMD4_CurrentFanState,                                  // 30
   CMD4_CurrentHeaterCoolerState,
   CMD4_CurrentHeatingCoolingState,
   CMD4_CurrentHorizontalTiltAngle,
   CMD4_CurrentHumidifierDehumidifierState,
   CMD4_CurrentMediaState,
   CMD4_CurrentPosition,      
   CMD4_CurrentRelativeHumidity,
   CMD4_CurrentSlatState,   
   CMD4_CurrentTemperature,
   CMD4_CurrentTiltAngle,                      // 40
   CMD4_CurrentTime,
   CMD4_CurrentVerticalTiltAngle,
   CMD4_CurrentVisibilityState,
   CMD4_DayoftheWeek,
   CMD4_DigitalZoom,
   CMD4_DiscoverBridgedAccessories,
   CMD4_DiscoveredBridgedAccessories,
   CMD4_DisplayOrder,
   CMD4_FilterChangeIndication,
   CMD4_FilterLifeLevel,                   // 50
   CMD4_FirmwareRevision,
   CMD4_HardwareRevision,
   CMD4_HeatingThresholdTemperature,
   CMD4_HoldPosition,         
   CMD4_Hue,
   CMD4_Identify,
   CMD4_ImageMirroring,     
   CMD4_ImageRotation,
   CMD4_InputDeviceType,
   CMD4_InputSourceType,                      // 60
   CMD4_InUse,
   CMD4_IsConfigured,    
   CMD4_LeakDetected,   
   CMD4_LinkQuality,   
   CMD4_LockControlPoint,
   CMD4_LockCurrentState,
   CMD4_LockLastKnownAction,
   CMD4_LockManagementAutoSecurityTimeout,
   CMD4_LockPhysicalControls,
   CMD4_LockTargetState,                    // 70
   CMD4_Logs,               
   CMD4_Manufacturer,      
   CMD4_Model,            
   CMD4_MotionDetected,  
   CMD4_Mute,
   CMD4_Name,
   CMD4_NightVision,   
   CMD4_NitrogenDioxideDensity,
   CMD4_ObstructionDetected,
   CMD4_OccupancyDetected,                    // 80
   CMD4_On,        
   CMD4_OpticalZoom,
   CMD4_OutletInUse,
   CMD4_OzoneDensity,
   CMD4_PairSetup,
   CMD4_PairVerify,
   CMD4_PairingFeatures,
   CMD4_PairingPairings,
   CMD4_PictureMode,
   CMD4_PM10Density,                        // 90
   CMD4_PM2_5Density,
   CMD4_PositionState,
   CMD4_PowerModeSelection,
   CMD4_ProgramMode,
   CMD4_ProgrammableSwitchEvent,
   CMD4_ProgrammableSwitchOutputState,
   CMD4_Reachable,
   CMD4_RelativeHumidityDehumidifierThreshold,
   CMD4_RelativeHumidityHumidifierThreshold,
   CMD4_RelayEnabled,                        // 100
   CMD4_RelayState,
   CMD4_RelayControlPoint,
   CMD4_RemainingDuration,
   CMD4_RemoteKey,
   CMD4_ResetFilterIndication,
   CMD4_RotationDirection, 
   CMD4_RotationSpeed,    
   CMD4_Saturation,      
   CMD4_SecuritySystemAlarmType,
   CMD4_SecuritySystemCurrentState,         // 110
   CMD4_SecuritySystemTargetState,
   CMD4_SelectedRTPStreamConfiguration,
   CMD4_SerialNumber,         
   CMD4_ServiceLabelIndex,
   CMD4_ServiceLabelNamespace,
   CMD4_SetDuration,       
   CMD4_SetupEndpoints,   
   CMD4_SlatType,
   CMD4_SleepDiscoveryMode,
   CMD4_SmokeDetected,                      // 120
   CMD4_StatusActive,  
   CMD4_StatusFault,  
   CMD4_StatusJammed,
   CMD4_StatusLowBattery,
   CMD4_StatusTampered,
   CMD4_StreamingStatus,
   CMD4_SulphurDioxideDensity,
   CMD4_SupportedAudioStreamConfiguration,
   CMD4_SupportedRTPConfiguration,
   CMD4_SupportedVideoStreamConfiguration,     //130
   CMD4_SwingMode,          
   CMD4_TargetAirPurifierState,
   CMD4_TargetAirQuality, 
   CMD4_TargetDoorState,
   CMD4_TargetFanState,
   CMD4_TargetHeaterCoolerState,
   CMD4_TargetHeatingCoolingState,
   CMD4_TargetHorizontalTiltAngle,
   CMD4_TargetHumidifierDehumidifierState,
   CMD4_TargetMediaState,                        //140
   CMD4_TargetPosition,       
   CMD4_TargetRelativeHumidity,
   CMD4_TargetSlatState,    
   CMD4_TargetTemperature,
   CMD4_TargetTiltAngle,
   CMD4_TargetVerticalTiltAngle,
   CMD4_TargetVisibilityState,
   CMD4_TemperatureDisplayUnits,
   CMD4_TimeUpdate,
   CMD4_TunneledAccessoryAdvertising,            //150
   CMD4_TunneledAccessoryConnected,
   CMD4_TunneledAccessoryStateNumber,
   CMD4_TunnelConnectionTimeout,
   CMD4_ValveType,
   CMD4_Version,
   CMD4_VOCDensity,  
   CMD4_Volume,
   CMD4_VolumeControlType,
   CMD4_VolumeSelector,
   CMD4_WaterLevel                             //160
];


var Accessory, Service, Characteristic, UUIDGen, FakeGatoHistoryService;
var charMapper=[];


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
   charMapper =
   [Characteristic.AccessoryFlags,
    Characteristic.Active,
    Characteristic.ActiveIdentifier,
    Characteristic.AccessoryIdentifier,
    Characteristic.AdministratorOnlyAccess,
    Characteristic.AirParticulateDensity,
    Characteristic.AirParticulateSize,
    Characteristic.AirQuality,
    Characteristic.AudioFeedback,
    Characteristic.BatteryLevel,                  // 10
    Characteristic.Brightness,
    Characteristic.CarbonDioxideDetected,
    Characteristic.CarbonDioxideLevel,
    Characteristic.CarbonDioxidePeakLevel,
    Characteristic.CarbonMonoxideDetected,
    Characteristic.CarbonMonoxideLevel,
    Characteristic.CarbonMonoxidePeakLevel,
    Characteristic.Category,
    Characteristic.ChargingState,
    Characteristic.ClosedCaptions,                //20
    Characteristic.ColorTemperature,
    Characteristic.ConfiguredName,         
    Characteristic.ConfigureBridgedAccessoryStatus,
    Characteristic.ConfigureBridgedAccessory,
    Characteristic.ContactSensorState,
    Characteristic.CoolingThresholdTemperature,
    Characteristic.CurrentAirPurifierState,
    Characteristic.CurrentAmbientLightLevel,
    Characteristic.CurrentDoorState,
    Characteristic.CurrentFanState,                  // 30
    Characteristic.CurrentHeaterCoolerState,
    Characteristic.CurrentHeatingCoolingState,
    Characteristic.CurrentHorizontalTiltAngle,
    Characteristic.CurrentHumidifierDehumidifierState,
    Characteristic.CurrentMediaState,
    Characteristic.CurrentPosition,
    Characteristic.CurrentRelativeHumidity,
    Characteristic.CurrentSlatState,
    Characteristic.CurrentTemperature,
    Characteristic.CurrentTiltAngle,                 // 40
    Characteristic.CurrentTime,
    Characteristic.CurrentVerticalTiltAngle,
    Characteristic.CurrentVisibilityState,
    Characteristic.DayoftheWeek,
    Characteristic.DigitalZoom,
    Characteristic.DiscoverBridgedAccessories,
    Characteristic.DiscoveredBridgedAccessories,
    Characteristic.DisplayOrder,
    Characteristic.FilterChangeIndication,
    Characteristic.FilterLifeLevel,                  // 50
    Characteristic.FirmwareRevision,
    Characteristic.HardwareRevision,
    Characteristic.HeatingThresholdTemperature,
    Characteristic.HoldPosition,
    Characteristic.Hue,
    Characteristic.Identify,
    Characteristic.ImageMirroring,
    Characteristic.ImageRotation,
    Characteristic.InputDeviceType,
    Characteristic.InputSourceType,                  // 60
    Characteristic.InUse,
    Characteristic.IsConfigured,
    Characteristic.LeakDetected,
    Characteristic.LinkQuality,
    Characteristic.LockControlPoint,
    Characteristic.LockCurrentState,
    Characteristic.LockLastKnownAction,
    Characteristic.LockManagementAutoSecurityTimeout,
    Characteristic.LockPhysicalControls,
    Characteristic.LockTargetState,                   // 70
    Characteristic.Logs,
    Characteristic.Manufacturer,
    Characteristic.Model,
    Characteristic.MotionDetected,
    Characteristic.Mute,
    Characteristic.Name,
    Characteristic.NightVision,
    Characteristic.NitrogenDioxideDensity,
    Characteristic.ObstructionDetected,
    Characteristic.OccupancyDetected,                  // 80
    Characteristic.On,
    Characteristic.OpticalZoom,
    Characteristic.OutletInUse,
    Characteristic.OzoneDensity,
    Characteristic.PairSetup,
    Characteristic.PairVerify,
    Characteristic.PairingFeatures,
    Characteristic.PairingPairings,
    Characteristic.PictureMode,
    Characteristic.PM10Density,                        // 90
    Characteristic.PM2_5Density,
    Characteristic.PositionState,
    Characteristic.PowerModeSelection,
    Characteristic.ProgramMode,
    Characteristic.ProgrammableSwitchOutputState,
    Characteristic.Reachable,
    Characteristic.ProgrammableSwitchEvent,
    Characteristic.RelativeHumidityDehumidifierThreshold,
    Characteristic.RelativeHumidityHumidifierThreshold,
    Characteristic.RelayEnabled,                       // 100
    Characteristic.RelayState,
    Characteristic.ControlPoint,
    Characteristic.RemainingDuration,
    Characteristic.RemoteKey,
    Characteristic.ResetFilterIndication,
    Characteristic.RotationDirection,
    Characteristic.RotationSpeed,
    Characteristic.Saturation,
    Characteristic.SecuritySystemAlarmType,
    Characteristic.SecuritySystemCurrentState,           // 110
    Characteristic.SecuritySystemTargetState,
    Characteristic.SelectedRTPStreamConfiguration,
    Characteristic.SerialNumber,
    Characteristic.ServiceLabelIndex,
    Characteristic.ServiceLabelNamespace,
    Characteristic.SetDuration,
    Characteristic.SetupEndpoints,
    Characteristic.SlatType,
    Characteristic.SleepDiscoveryMode,
    Characteristic.SmokeDetected,                        // 120
    Characteristic.StatusActive,
    Characteristic.StatusFault,
    Characteristic.StatusJammed,
    Characteristic.StatusLowBattery,
    Characteristic.StatusTampered,
    Characteristic.StreamingStatus,
    Characteristic.SulphurDioxideDensity,
    Characteristic.SupportedAudioStreamConfiguration,
    Characteristic.SupportedRTPConfiguration,
    Characteristic.SupportedVideoStreamConfiguration,    // 130
    Characteristic.SwingMode,
    Characteristic.TargetAirPurifierState,
    Characteristic.TargetAirQuality,
    Characteristic.TargetDoorState,
    Characteristic.TargetFanState,
    Characteristic.TargetHeaterCoolerState,
    Characteristic.TargetHeatingCoolingState,
    Characteristic.TargetHorizontalTiltAngle,
    Characteristic.TargetHumidifierDehumidifierState,
    Characteristic.TargetMediaState,                     // 140
    Characteristic.TargetPosition,
    Characteristic.TargetRelativeHumidity,
    Characteristic.TargetSlatState,
    Characteristic.TargetTemperature,
    Characteristic.TargetTiltAngle,
    Characteristic.TargetVerticalTiltAngle,
    Characteristic.TargetVisibilityState,
    Characteristic.TemperatureDisplayUnits,
    Characteristic.TimeUpdate,
    Characteristic.TunneledAccessoryAdvertising,          // 150
    Characteristic.TunneledAccessoryConnected,
    Characteristic.TunneledAccessoryStateNumber,
    Characteristic.TunnelConnectionTimeout,
    Characteristic.ValveType,
    Characteristic.Version,
    Characteristic.VOCDensity,
    Characteristic.Volume,
    Characteristic.VolumeControlType,
    Characteristic.VolumeSelector,
    Characteristic.WaterLevel                             // 160
   ];



};

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

Cmd4Platform.prototype.characteristicPolling = function (accessory, characteristicStringIndex, timeout, interval)
{
   var self = accessory;


   // The default interval is 1 minute. Timers are in milliseconds
   timeout = parseInt(timeout, 10) || 60000;

   // The default interval is 10 seconds
   interval = parseInt(interval, 10) || 10;


   self.log.debug("Doing Poll of '%s' for '%s' '%s'", characteristicStringIndex,
          accMapper[characteristicStringIndex], self.name);

   // Make sure that the characteristic exists
   if ( characteristicStringIndex < 0 )
   {
      self.log("CMD4 WARNING: No such polling characteristicIndex '%d' for '%s'",
         characteristicStringIndex, self.name);
      return;
   }

   // Clear polling
   if (this.listOfPollingCharacteristics[ accessory.name + characteristicStringIndex ] == undefined)
      clearTimeout(this.listOfPollingCharacteristics[ accessory.name + characteristicStringIndex ]);

   // i.e. Characteristic.On
   // i.e.  Characteristic.RotationDirection
   self.service.getCharacteristic(
      charMapper[ characteristicStringIndex ]     
   ).getValue();
 
  
    this.listOfPollingCharacteristics[ accessory.name + characteristicStringIndex ] =
       setTimeout(this.characteristicPolling.bind(
          this, accessory, characteristicStringIndex, timeout, interval), interval * 1000);
   
 }

 Cmd4Platform.prototype.setupCharacteristicPolling = function (accessory)
{
   var self = accessory;

   // The default interval is 1 minute. Timers are in milliseconds
   self.timeout = parseInt(self.timeout, 10) || 60000;

   // The default interval is 10 seconds
   self.interval = parseInt(self.interval, 10) || 10;

   self.log.debug("Setting up '%s' polling characteristics of accessory '%s'",
      self.polling.length, self.name);

   for ( var jsonIndex = 0;
             jsonIndex < self.polling.length;
             jsonIndex ++ )
   {
      // *NEW* Characteristic polling is a json var
      var jsonPollingConfig = self.polling[jsonIndex];

      // The default interval is 10 seconds
      var interval = 10;

      // The default interval is 1 minute. Timers are in milliseconds
      var timeout = 60000;

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
               if (timeout < 500)
               {
                   this.log.warn("Timeout for '%s' is in milliseconds. A value of '%d' seems pretty low.",
                          this.config.name, timeout);
               }
               break;
            case "Interval":
               // The default interval is 10 seconds
               interval = parseInt(value, 10);
               break;
            default:
               ucKeyIndex = accMapper.indexOf(ucKey);
               if ( ucKeyIndex < 0 )
               {
                  self.log("CMD4 WARNING: No such polling characteristic '%s' for '%'",
                       key, self.name);
                   continue;
               }
          }
      }

      self.log.debug("Setting up '%s' for polling of '%s'",self.name, accMapper[ucKeyIndex]);

      // The default interval is 10 seconds
      interval = parseInt(interval, 10) || 10;

      // The default interval is 1 minute. Timers are in milliseconds
      timeout = parseInt(timeout, 10) || 60000;
        
      this.listOfPollingCharacteristics[ accessory.name + ucKeyIndex ] =
         setTimeout(this.characteristicPolling.bind(this, accessory, ucKeyIndex, timeout, interval), interval * 1000);

   }
}

// Change polling per accessory to characteristic polling of state traits
Cmd4Platform.prototype.setupStatePollingPerAccessory = function (accessory)
{
   var self = accessory;

   // The default interval is 1 minute. Timers are in milliseconds
   self.timeout = parseInt(self.timeout, 10) || 60000;

   // The default interval is 10 seconds
   self.interval = parseInt(self.interval, 10) || 10;

   var charStringIndex = -1;

   switch(accessory.config.type)
   {
      case CMD4_ACC_TYPE_AccessoryInformation:
      {
         charStringIndex = accMapper.indexOf(CMD4_Identify);

         break;
      }
      case CMD4_ACC_TYPE_AirPurifier:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_AirQualitySensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
     
         charStringIndex = accMapper.indexOf(CMD4_AirQuality);

         break;
      }
      case CMD4_ACC_TYPE_BatteryService:
      {
         charStringIndex = accMapper.indexOf(CMD4_StatusLowBattery);

         break;
      }
      case CMD4_ACC_TYPE_BridgeConfiguration:
      {
         charStringIndex = CMD4_ConfigureBridgedAccessoryStatus;
         break;
      }
      case CMD4_ACC_TYPE_BridgingState:
      {
         charStringIndex = CMD4_Reachable;
         break;
      }
      case CMD4_ACC_TYPE_CameraControl:
      {
         charStringIndex = CMD4_On;

         break;
      }
      case CMD4_ACC_TYPE_CameraRTPStreamManagement:
      {
         charStringIndex = accMapper.indexOf(CMD4_StatusActive);

         break;
      }
      case CMD4_ACC_TYPE_CarbonDioxideSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CarbonDioxideDetected);

         break;
      }
      case CMD4_ACC_TYPE_CarbonMonoxideSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);                  
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CarbonMonoxideDetected);

         break;
      }
      case CMD4_ACC_TYPE_ContactSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_ContactSensorState);

         break;
      }
      case CMD4_ACC_TYPE_Door:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentDoorState);
     
         break;
      }
      case CMD4_ACC_TYPE_DoorBell:
      {
         charStringIndex = accMapper.indexOf(CMD4_ProgrammableSwitchEvent);

         break;
      }
      case CMD4_ACC_TYPE_Fan:
      case CMD4_ACC_TYPE_Fanv1:
      {
         charStringIndex = accMapper.indexOf(CMD4_On);

         break;
      }
      case CMD4_ACC_TYPE_Fanv2:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
         }

          break;
      }
      case CMD4_ACC_TYPE_FilterMaintenance:
      {
         charStringIndex = accMapper.indexOf(CMD4_FilterChangeIndication);

         break;
      }
      case CMD4_ACC_TYPE_Faucet:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_GarageDoorOpener:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentDoorState);
  
         break;
      }
      case CMD4_ACC_TYPE_HeaterCooler:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_HumidifierDehumidifier:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_HumiditySensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
  
             this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CurrentRelativeHumidity);

         break;
      }
      case CMD4_ACC_TYPE_InputSource:
      {
         charStringIndex = CMD4_CurrentVisibilityState;

         break;
      }
      case CMD4_ACC_TYPE_IrrigationSystem:
      {
         charStringIndex = CMD4_Active;

         break;
      }
      case CMD4_ACC_TYPE_LeakSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
  
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_LeakDetected);
     
         break;
      }
      case CMD4_ACC_TYPE_LightSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_On);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
               this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CurrentAmbientLightLevel);
               
         break;
      }
      case CMD4_ACC_TYPE_Lightbulb:
      {
         charStringIndex = accMapper.indexOf(CMD4_On);

         break;
      }
      case CMD4_ACC_TYPE_LockManagement:
      {
         charStringIndex = accMapper.indexOf(CMD4_LockCurrentState);

         break;
      }
      case CMD4_ACC_TYPE_LockMechanism:
      {
         charStringIndex = accMapper.indexOf(CMD4_LockCurrentState);
  
         break;
      }
      case CMD4_ACC_TYPE_Microphone:
      {
         charStringIndex = accMapper.indexOf(CMD4_Mute);

         break;
      }
      case CMD4_ACC_TYPE_MotionSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_MotionDetected);

         break;
      }
      case CMD4_ACC_TYPE_OccupancySensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_OccupancyDetected);

         break;
      }
      case CMD4_ACC_TYPE_Outlet:
      {
         charStringIndex = accMapper.indexOf(CMD4_On);

         break;
      }
      case CMD4_ACC_TYPE_Pairing:
      {
         // The only thing that is not TLV8
         charStringIndex = CMD4_PairingFeatures;

         break;
      }
      case CMD4_ACC_TYPE_ProtocolInformation:
      {
         charStringIndex = CMD4_Version;

         break;
      }
      case CMD4_ACC_TYPE_Relay:
      {
         if ( accessory.getStoredValueForKey(CMD4_RelayEnabled) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_RelayEnabled);

            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
         charStringIndex = CMD4_RelayState;

         break;
      }
      case CMD4_ACC_TYPE_SecuritySystem:
      {
         charStringIndex = accMapper.indexOf(CMD4_SecuritySystemCurrentState);
    
         break;
      }
      case CMD4_ACC_TYPE_ServiceLabel:
      {
         charStringIndex = accMapper.indexOf(CMD4_ServiceLabelNamespace);
     
         break;
      }
      case CMD4_ACC_TYPE_Slat:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentSlatState);
  
         break;
      }
      case CMD4_ACC_TYPE_SmokeSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_SmokeDetected);

         break;
      }
      case CMD4_ACC_TYPE_Speaker:
      {
         charStringIndex = accMapper.indexOf(CMD4_Mute);

         break;
      }
      case CMD4_ACC_TYPE_StatefulProgrammableSwitch:
      {
         charStringIndex = accMapper.indexOf(CMD4_ProgrammableSwitchEvent);

         break;
      }
      case CMD4_ACC_TYPE_StatelessProgrammableSwitch:
      {
         charStringIndex = accMapper.indexOf(CMD4_ProgrammableSwitchEvent);
  
         break;
      }
      case CMD4_ACC_TYPE_Switch:
      {
         charStringIndex = accMapper.indexOf(CMD4_On);
  
         break;
      }
      case CMD4_ACC_TYPE_Television:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_TelevisionSpeaker:
      {
         charStringIndex = accMapper.indexOf(CMD4_Active);

         break;
      }
      case CMD4_ACC_TYPE_TemperatureSensor:
      {
         if ( accessory.getStoredValueForKey(CMD4_StatusActive) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_StatusActive);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
               setTimeout(this.characteristicPolling.bind(
                  this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CurrentTemperature);

         break;
      }
      case CMD4_ACC_TYPE_Thermostat:
      {    
         // Poll for currentRelativeHumidity if defined
         if ( accessory.getStoredValueForKey(CMD4_CurrentRelativeHumidity) != undefined )
         {
            charStringIndex = accMapper.indexOf(CMD4_CurrentRelativeHumidity);
     
            this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
            setTimeout(this.characteristicPolling.bind(
               this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);        
         }
  
         charStringIndex = accMapper.indexOf(CMD4_CurrentTemperature);
  
         break;
      }
      case CMD4_ACC_TYPE_TimeInformation:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentTime);

         break;
      }
      case CMD4_ACC_TYPE_TunneledBTLEAccessoryService:
      {
         charStringIndex = accMapper.indexOf(CMD4_TunneledAccessoryConnected);

         break;
      }
      case CMD4_ACC_TYPE_Valve:
      {
         charStringIndex = accMapper.indexOf(CMD4_ValveType);

         break;
      }
      case CMD4_ACC_TYPE_Window:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentPosition);

         break;
      }
      case CMD4_ACC_TYPE_WindowCovering:
      {
         charStringIndex = accMapper.indexOf(CMD4_CurrentPosition);
  
         break;
      }
      default:
   }

   if ( charStringIndex >= 0 )
   {
      this.listOfPollingCharacteristics[ accessory.name + charStringIndex ] =
         setTimeout(this.characteristicPolling.bind(
            this, accessory, charStringIndex, self.timeout, self.interval), self.interval * 1000);
   }

}

function Cmd4Accessory(log, platformConfig, accessoryConfig, status ) {

    this.config = accessoryConfig;
    this.log = log;

    // Instead of local variables for every characteristic, create an array to
    // hold values for  all characteristics.
    this.storedValuesPerCharacteristic = new Array(accMapper.length).fill(null);

    // If polling is defined it is set to true, otherwise false.
    this.polling = this.config.polling === true;

    // this.reachable = true; // What is reachable ???
    // Configured accessory is reachable

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
            // The default interval is 10 seconds
            this.interval = parseInt(value, 10);
            break;
         case 'StateChangeResponseTime':
            this.stateChangeResponseTime = value;
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
            if (accMapper.indexOf(ucKey) < 0 )
            {
              this.log("OOPS: '%s' not found. There something wrong with your config.json file?", key);
              if (key == "administorOnlyAccess") {
                 this.log("administorOnlyAccess was incorrectly named");
                 this.log("It is corrected in the new config.json file as administratorOnlyAccess");
                 this.log("Please make the approperiate changes or use the new config.json file");
                 this.log("provided.");
              }
              if (key == "targettRelativeHumidity") {
                 this.log("targettRelativeHumidity was incorrectly named");
                 this.log("It is corrected in the new config.json file as targetRelativeHumidity");
                 this.log("Please make the approperiate changes or use the new config.json file");
                 this.log("provided.");
              }
              if (key == "currentSlatType") {
                 this.log("currentSlatType was incorrectly named");
                 this.log("It is corrected in the new config.json file as currentSlatState");
                 this.log("Please make the approperiate changes or use the new config.json file");
                 this.log("provided.");
              }
              process.exit(1);
            } else {
               this.setStoredValueForKey(ucKey, value);
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

   // The default interval is 10 seconds
   this.interval = parseInt(this.interval, 10) || 10;

   // The default interval is 1 minute. Timers are in milliseconds
   this.timeout = parseInt(this.timeout, 10) || 60000;

   // The default respnse time is 10 seconds.
   this.stateChangeResponseTime = parseInt(this.stateChangeResponseTime, 10) || 10;

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

   switch( this.config.type )
   {
      case CMD4_ACC_TYPE_AccessoryInformation:
         this.service = new Service.AccessoryInformation(this.name, this.name);

         // Required
         if ( this.getStoredValueForKey(CMD4_Identify) == undefined )
            this.setStoredValueForKey(CMD4_Identify, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Manufacturer) == undefined )
            this.setStoredValueForKey(CMD4_Manufacturer, "Cmd4");

         // Required
         if ( this.getStoredValueForKey(CMD4_Model) == undefined )
            this.setStoredValueForKey(CMD4_Model, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Name) == undefined )
            this.setStoredValueForKey(CMD4_Name, "My_AccessoryInformation");

         // Required
         if ( this.getStoredValueForKey(CMD4_SerialNumber) == undefined )
            this.setStoredValueForKey(CMD4_SerialNumber, "ABC001");

         // Required
         if ( this.getStoredValueForKey(CMD4_FirmwareRevision) == undefined )
            this.setStoredValueForKey(CMD4_FirmwareRevision, "100.1.1");

         break;
      case CMD4_ACC_TYPE_AirPurifier:
         // Required
         if ( this.getStoredValueForKey(CMD4_Active) == undefined )
            this.setStoredValueForKey(CMD4_Active, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentAirPurifierState) == undefined )
            this.setStoredValueForKey(CMD4_CurrentAirPurifierState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetAirPurifierState) == undefined )
            this.setStoredValueForKey(CMD4_TargetAirPurifierState, 0);

         this.service = new Service.AirPurifier(this.name, this.name);
  
         break;
      case CMD4_ACC_TYPE_AirQualitySensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_AirQuality) == undefined )
            this.setStoredValueForKey(CMD4_AirQuality, 1);
     
         this.service = new Service.AirQualitySensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_BatteryService:
         // Required
         if ( this.getStoredValueForKey(CMD4_BatteryLevel) == undefined )
            this.setStoredValueForKey(CMD4_BatteryLevel, 50);

         // Required
         if ( this.getStoredValueForKey(CMD4_ChargingState) == undefined )
            this.setStoredValueForKey(CMD4_ChargingState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_StatusLowBattery) == undefined )
            this.setStoredValueForKey(CMD4_StatusLowBattery, 0);
  
         this.service = new Service.BatteryService(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_BridgeConfiguration:

         this.service = new Service.BridgeConfiguration(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_BridgingState:

         this.service = new Service.BridgeState(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_CameraControl:

         this.service = new Service.CameraControl(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_CameraRTPStreamManagement:
         this.service = new Service.CameraRTPStreamManagement(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_CarbonDioxideSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_CarbonDioxideDetected) == undefined )
             this.setStoredValueForKey(CMD4_CarbonDioxideDetected, 0); 

         this.service = new Service.CarbonDioxideSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_CarbonMonoxideSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_CarbonMonoxideDetected) == undefined )
            this.setStoredValueForKey(CMD4_CarbonMonoxideDetected, 0);
     
         this.service = new Service.CarbonMonoxideSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_ContactSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_ContactSensorState) == undefined )
            this.setStoredValueForKey(CMD4_ContactSensorState, 0);

         this.service = new Service.ContactSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Door:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentPosition) == undefined )
            this.setStoredValueForKey(CMD4_CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetPosition) == undefined )
            this.setStoredValueForKey(CMD4_TargetPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_PositionState) == undefined )
            this.setStoredValueForKey(CMD4_PositionState, 0);

         this.service = new Service.Door(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_DoorBell:
         // Required
         if ( this.getStoredValueForKey(CMD4_ProgrammableSwitchEvent) == undefined )
            this.setStoredValueForKey(CMD4_ProgrammableSwitchEvent, 0);

         // HomeKitTypes.js has this as 'Doorbell' (Small b)
         this.service = new Service.Doorbell(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Fan:
      case CMD4_ACC_TYPE_Fanv1:
         // So why do we do this? In the need for documentation,
         // this is done so that required characteristics
         // are set for the given accessory,

         // Required    
         if ( this.getStoredValueForKey(CMD4_On) == undefined )
            this.setStoredValueForKey(CMD4_On, 0);

         this.service = new Service.Fan(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Fanv2:
         // Required
         if ( this.getStoredValueForKey(CMD4_Active) == undefined )
            this.setStoredValueForKey(CMD4_Active, 0);

         this.service = new Service.Fanv2(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_FilterMaintenance:
         // Required
         if ( this.getStoredValueForKey(CMD4_FilterChangeIndication) == undefined )
            this.setStoredValueForKey(CMD4_FilterChangeIndication, 0);

         this.service = new Service.FilterMaintenance(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Faucet:
         // Required
         if ( this.getStoredValueForKey(CMD4_Active) == undefined )
            this.setStoredValueForKey(CMD4_Active, 1);

         // Required
         if ( this.getStoredValueForKey(CMD4_StatusFault) == undefined )
            this.setStoredValueForKey(CMD4_StatusFault, 0);

         if ( this.getStoredValueForKey(CMD4_Name) == undefined )
            this.setStoredValueForKey(CMD4_Name, "My_Faucet");

         this.service = new Service.Faucet(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_GarageDoorOpener:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentDoorState ) == undefined )
            this.setStoredValueForKey(CMD4_CurrentDoorState, 0);
  

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetDoorState) == undefined )
            this.setStoredValueForKey(CMD4_TargetDoorState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_ObstructionDetected) == undefined )
            this.setStoredValueForKey(CMD4_ObstructionDetected, 0);

         this.service = new Service.GarageDoorOpener(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_HeaterCooler:

         this.service = new Service.HeaterCooler(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_HumidifierDehumidifier:

         this.service = new Service.HumidifierDehumidifier(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_HumiditySensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentRelativeHumidity) == undefined )
            this.setStoredValueForKey(CMD4_CurrentRelativeHumidity, 1);
     
         this.service = new Service.HumiditySensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_InputSource:
         this.service = new Service.InputSource(this.name, this.name);
    
         // Required
         if ( this.getStoredValueForKey(CMD4_ConfiguredName) == undefined )
            this.setStoredValueForKey(CMD4_ConfiguredName, "My_InputSource");
    
         // Required
         if ( this.getStoredValueForKey(CMD4_InputSourceType) == undefined )
            this.setStoredValueForKey(CMD4_InputSourceType, 1);
    
         // Required
         if ( this.getStoredValueForKey(CMD4_IsConfigured) == undefined )
            this.setStoredValueForKey(CMD4_IsConfigured, 1);
    
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentVisibilityState) == undefined )
            this.setStoredValueForKey(CMD4_CurrentVisibilityState, 2);
  
         this.service = new Service.InputSource(this.name, this.name);
         break;
       case CMD4_ACC_TYPE_IrrigationSystem:

         // Required
         if ( this.getStoredValueForKey(CMD4_Active) == undefined )
            this.setStoredValueForKey(CMD4_Active, 1);

         // Required
         if ( this.getStoredValueForKey(CMD4_ProgramMode) == undefined )
            this.setStoredValueForKey(CMD4_ProgramMode, 1);
  
         // Required
         if ( this.getStoredValueForKey(CMD4_InUse) == undefined )
            this.setStoredValueForKey(CMD4_InUse, 1);
  
         this.service = new Service.IrrigationSystem(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_LeakSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_LeakDetected) == undefined )
            this.setStoredValueForKey(CMD4_LeakDetected, 0);

         this.service = new Service.LeakSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_LightSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentAmbientLightLevel) == undefined )
            this.setStoredValueForKey(CMD4_CurrentAmbientLightLevel, 0);
     
         this.service = new Service.LightSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Lightbulb:
         // Required
         if ( this.getStoredValueForKey(CMD4_On) == undefined )
            this.setStoredValueForKey(CMD4_On, 0);

         this.service = new Service.Lightbulb(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_LockManagement:
         // Required
         if ( this.getStoredValueForKey(CMD4_LockControlPoint) == undefined )
            this.setStoredValueForKey(CMD4_LockControlPoint, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Logs) == undefined )
            this.setStoredValueForKey(CMD4_Logs, "OptionalLogs");
     
         this.service = new Service.LockManagement(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_LockMechanism:
         // Required
         if ( this.getStoredValueForKey(CMD4_LockCurrentState) == undefined )
            this.setStoredValueForKey(CMD4_LockCurrentState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_LockTargetState) == undefined )
            this.setStoredValueForKey(CMD4_LockTargetState, 0);

         this.service = new Service.LockMechanism(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Microphone:
         // Required
         if ( this.getStoredValueForKey(CMD4_Mute) == undefined )
            this.setStoredValueForKey(CMD4_Mute,0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Volume) == undefined )
            this.setStoredValueForKey(CMD4_Volume, 0);

         this.service = new Service.Microphone(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_MotionSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_MotionDetected) == undefined )
            this.setStoredValueForKey(CMD4_MotionDetected, 0);

         this.service = new Service.MotionSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_OccupancySensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_OccupancyDetected) == undefined )
            this.setStoredValueForKey(CMD4_OccupancyDetected, 0);

         this.service = new Service.OccupancySensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Outlet:
         // Required
         if ( this.getStoredValueForKey(CMD4_On) == undefined )
            this.setStoredValueForKey(CMD4_On, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_OutletInUse) == undefined )
            this.setStoredValueForKey(CMD4_OutletInUse, 0);

         this.service = new Service.Outlet(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Pairing:

         this.service = new Service.Pairing(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_ProtocolInformation:

         this.service = new Service.ProtocolInformation(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Relay:
         // Required
         if ( this.getStoredValueForKey(CMD4_RelayEnabled) == undefined )
            this.setStoredValueForKey(CMD4_RelayEnabled, 1);

         // Required
         if ( this.getStoredValueForKey(CMD4_RelayState) == undefined )
            this.setStoredValueForKey(CMD4_RelayState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_RelayControlPoint) == undefined )
            this.setStoredValueForKey(CMD4_RelayControlPoint, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Name) == undefined )
            this.setStoredValueForKey(CMD4_Name, "My_Relay");


         this.service = new Service.Relay(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_SecuritySystem:
         // Required
         if ( this.getStoredValueForKey(CMD4_SecuritySystemCurrentState) == undefined )
            this.setStoredValueForKey(CMD4_SecuritySystemCurrentState, 3);

         // Required
         if ( this.getStoredValueForKey(CMD4_SecuritySystemTargetState) == undefined )
             this.setStoredValueForKey(CMD4_SecuritySystemTargetState, 3);
  
         this.service = new Service.SecuritySystem(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_ServiceLabel:
         this.service = new Service.ServiceLabel(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Slat:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentSlatState) == undefined )
            this.setStoredValueForKey(CMD4_CurrentSlatState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_SlatType) == undefined )
            this.setStoredValueForKey(CMD4_SlatType, 0);

         this.service = new Service.Slat(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_SmokeSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_SmokeDetected) == undefined )
            this.setStoredValueForKey(CMD4_SmokeDetected, 0);

         this.service = new Service.SmokeSensor(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Speaker:
         // Required
         if ( this.getStoredValueForKey(CMD4_Mute) == undefined )
            this.setStoredValueForKey(CMD4_Mute,0);

         // Required
         if ( this.getStoredValueForKey(CMD4_Volume) == undefined )
            this.setStoredValueForKey(CMD4_Volume, 0);

         this.service = new Service.Speaker(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_StatefulProgrammableSwitch:
         // Required
         if ( this.getStoredValueForKey(CMD4_ProgrammableSwitchEvent) == undefined )
            this.setStoredValueForKey(CMD4_ProgrammableSwitchEvent, 0);

         this.service = new Service.StatefulProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_StatelessProgrammableSwitch:
         // Required
         if ( this.getStoredValueForKey(CMD4_ProgrammableSwitchEvent) == undefined )
            this.setStoredValueForKey(CMD4_ProgrammableSwitchEvent, 0);

         this.service = new Service.StatelessProgrammableSwitch(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Switch:
         // Required
         if ( this.getStoredValueForKey(CMD4_On) == undefined )
            this.setStoredValueForKey(CMD4_On, 0);

         this.service = new Service.Switch(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Television:
         this.service = new Service.Television(this.name, this.name);
    
         // Required
         if ( this.getStoredValueForKey(CMD4_Active) == undefined )
            this.setStoredValueForKey(CMD4_Active, 0);
    
         // Required
         if ( this.getStoredValueForKey(CMD4_ActiveIdentifier) == undefined )
            this.setStoredValueForKey(CMD4_ActiveIdentifier, "1234");
   
         // Required
         if ( this.getStoredValueForKey(CMD4_ConfiguredName) == undefined )
            this.setStoredValueForKey(CMD4_ConfiguredName,'tv');
   
         // Required
         if ( this.getStoredValueForKey(CMD4_SleepDiscoveryMode) == undefined )
            this.setStoredValueForKey(CMD4_SleepDiscoveryMode, "0");
    
         this.service = new Service.Television(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_TelevisionSpeaker:
         this.service = new Service.TelevisionSpeaker(this.name, this.name);

         // Required
         if ( this.getStoredValueForKey(CMD4_Mute) == undefined )
            this.setStoredValueForKey(CMD4_Mute, 0);

         this.service = new Service.TelevisionSpeaker(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_TemperatureSensor:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentTemperature) == undefined )
            this.setStoredValueForKey(CMD4_CurrentTemperature, 50.0);

         this.service = new Service.TemperatureSensor(this.name, this.name); 
         break;
      case CMD4_ACC_TYPE_Thermostat:
         this.log("Setting up Thermostat default characteristics");
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentHeatingCoolingState) == undefined )
            this.setStoredValueForKey(CMD4_CurrentHeatingCoolingState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetHeatingCoolingState) == undefined )
            this.setStoredValueForKey(CMD4_TargetHeatingCoolingState, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentTemperature) == undefined )
            this.setStoredValueForKey(CMD4_CurrentTemperature, 50.0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetTemperature) == undefined )
            this.setStoredValueForKey(CMD4_TargetTemperature, 50.0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TemperatureDisplayUnits) == undefined )
            this.setStoredValueForKey(CMD4_TemperatureDisplayUnits, 0);

         this.service = new Service.Thermostat(this.name, this.name); 
         break;
      case CMD4_ACC_TYPE_TimeInformation:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentTime) == undefined )
            this.setStoredValueForKey(CMD4_CurrentTime, "11:15");

         // Required
         if ( this.getStoredValueForKey(CMD4_DayoftheWeek) == undefined )
            this.setStoredValueForKey(CMD4_DayoftheWeek, 1);  // Monday

         // Required
         if ( this.getStoredValueForKey(CMD4_TimeUpdate) == undefined )
            this.setStoredValueForKey(CMD4_TimeUpdate, 0);   // false

         this.service = new Service.TimeInformation(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_TunneledBTLEAccessoryService:
         // Required
         if ( this.getStoredValueForKey(CMD4_Name) == undefined )
            this.setStoredValueForKey(CMD4_Name, "TLB");

         // Required
         if ( this.getStoredValueForKey(CMD4_AccessoryIdentifier) == undefined )
            this.setStoredValueForKey(CMD4_AccessoryIdentifier, "TLB");

         // Required
         if ( this.getStoredValueForKey(CMD4_TunneledAccessoryStateNumber) == undefined )
            this.setStoredValueForKey(CMD4_TunneledAccessoryStateNumber, "0");

         // Required
         if ( this.getStoredValueForKey(CMD4_TunneledAccessoryConnected) == undefined )
            this.setStoredValueForKey(CMD4_TunneledAccessoryConnected, "1");

         // Required
         if ( this.getStoredValueForKey(CMD4_TunneledAccessoryAdvertising) == undefined )
            this.setStoredValueForKey(CMD4_TunneledAccessoryAdvertising, "1");

         // Required
         if ( this.getStoredValueForKey(CMD4_TunnelConnectionTimeout) == undefined )
            this.setStoredValueForKey(CMD4_TunnelConnectionTimeout, "6000");

         this.service = new Service.TunneledBTLEAccessoryService(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Valve:
         // Required
         if ( this.getStoredValueForKey(CMD4_ValveType) == undefined )
            this.setStoredValueForKey(CMD4_ValveType, 0);

         this.service = new Service.Valve(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_Window:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentPosition) == undefined )
            this.setStoredValueForKey(CMD4_CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetPosition) == undefined )
            this.setStoredValueForKey(CMD4_TargetPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_PositionState) == undefined )
            this.setStoredValueForKey(CMD4_PositionState, 0);

         this.service = new Service.Window(this.name, this.name);
         break;
      case CMD4_ACC_TYPE_WindowCovering:
         // Required
         if ( this.getStoredValueForKey(CMD4_CurrentPosition) == undefined )
            this.setStoredValueForKey(CMD4_CurrentPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_TargetPosition) == undefined )
            this.setStoredValueForKey(CMD4_TargetPosition, 0);

         // Required
         if ( this.getStoredValueForKey(CMD4_PositionState) == undefined )
            this.setStoredValueForKey(CMD4_PositionState, 0);

         this.service = new Service.WindowCovering(this.name, this.name);
         break;
      default:
      {
         // The default is a lightBulb service
         this.log ("CMD4: Unknown type: %s for %s. Defaulting it to a Switch. Did you possibly spell it incorrectly?", this.type, this.name);
  
         // Required
         if ( this.getStoredValueForKey(CMD4_On) == undefined )
            this.setStoredValueForKey(CMD4_On, 0);

         this.service = new Service.Switch(this.name, this.name);
  
      }

   }

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

   setStoredValueForKey:function (key, value)
   {
      var index = accMapper.indexOf(key);

      if (index < 0)
      {
         this.log ("CMD4 Error: setStoredValue - Characteristic '%s' for '%s' not known", key, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      this.storedValuesPerCharacteristic[index] = value;
   },

   getStoredValueForKey:function (key)
   {
      var index = accMapper.indexOf(key);

      if (index < 0)
      {
         this.log ("CMD4 Warning: getStoredValue - Characteristic '%s' for '%s' not known", key, this.name);
         this.log ("Check your json.config file for this error");
         process.exit(1);
      }
      return this.storedValuesPerCharacteristic[index];
   },
   testStoredValueForKey:function (key)
   {
      return accMapper.indexOf(key);
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
                  // The default interval is 10 seconds
                  this.interval = parseInt(value, 10);
                  break;
               default:
                  if (accMapper.indexOf(ucKey) < 0 )
                  {
                    this.log("OOPS: '%s' not found. There something wrong with your config.json file?", key);
                    process.exit(1);
                  } else {
                     if ( this.getStoredValueForKey(ucKey) == undefined )
                     {
                        this.log.warn("Polling for '%s' requested, but characteristic ", key);
                        this.log.warn("is not in your config.json file for '%s'", this.name);
                     }

                     this.setStoredValueForKey(ucKey, value);
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
            self.log("Set %s function failed for %s Error:%s", characteristicString, self.name, error.message);
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
            switch (self.config.type)
            {
               case CMD4_ACC_TYPE_AccessoryInformation:
                  break;
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
                        self.service.getCharacteristic(Characteristic.CurrentAirPurifierState).getValue();

                        // Not seemed to have been needed, but should have been.
                        self.service.getCharacteristic(Characteristic.Active).getValue();
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
                  self.updateAccessoryAttribute(characteristicString, value);

                  callback(null,value);
               } else {
                  var lowerCaseWord = words[0].toLowerCase();

                  if (lowerCaseWord  == "true" || lowerCaseWord == "on")
                  {
                     // self.log( "getValue Retrieved %s %s for: %s. translated to 1", characteristicString, words[0], self.name);
                     value = 1;
              
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(characteristicString, value);
              
                     callback(null,value);
                  } else if (lowerCaseWord == "false" || lowerCaseWord == "off")
                  {
                     // self.log( "getValue Retrieved %s %s for: %s. translated to 0", characteristicString, words[0], self.name);
                     value = 0;
              
                     // Store history using fakegato if set up
                     self.updateAccessoryAttribute(characteristicString, value);
              
                     callback(null,value);
                  } else {
                     // self.log( "getValue Retrieved %s %s for: %s.", characteristicString, words[0], self.name);
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
        var characteristicString = CMD4_AccessoryFlags;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AccessoryFlags, Characteristic.AccessoryFlags, callback);
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
                        this.setValue(value, CMD4_AccessoryFlags, Characteristic.AccessoryFlags, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Active;
        characteristicString = CMD4_Active;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Active, callback);
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
                        this.setValue(value, CMD4_Active, Characteristic.Active, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ActiveIdentifier;
        characteristicString = CMD4_ActiveIdentifier;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ActiveIdentifier, callback);
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
                        this.setValue(value, CMD4_ActiveIdentifier, Characteristic.ActiveIdentifier, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.AccessoryIdentifier;
        characteristicString = CMD4_AccessoryIdentifier;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AccessoryIdentifier, callback);
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
                        this.setValue(value, CMD4_AccessoryIdentifier, Characteristic.AccessoryIdentifier, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.AdministratorOnlyAccess;
        characteristicString = CMD4_AdministratorOnlyAccess;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AdministratorOnlyAccess, callback);
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
                        this.setValue(value, CMD4_AdministratorOnlyAccess, Characteristic.AdministratorOnlyAccess, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirParticulateDensity;
        characteristicString = CMD4_AirParticulateDensity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AirParticulateDensity, callback);
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
                        this.setValue(value, CMD4_AirParticulateDensity, Characteristic.AirParticulateDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirParticulateSize;
        characteristicString = CMD4_AirParticulateSize;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AirParticulateSize, callback);
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
                        this.setValue(value, CMD4_AirParticulateSize, Characteristic.AirParticulateSize, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AirQuality;
        characteristicString = CMD4_AirQuality;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AirQuality, callback);
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
                        this.setValue(value, CMD4_AirQuality, Characteristic.AirQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.AudioFeedback;
        characteristicString = CMD4_AudioFeedback;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_AudioFeedback, callback);
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
                        this.setValue(value, CMD4_AudioFeedback, Characteristic.AudioFeedback, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.BatteryLevel;  // 10
        characteristicString = CMD4_BatteryLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_BatteryLevel, callback);
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
                        this.setValue(value, CMD4_BatteryLevel, Characteristic.BatteryLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Brightness;
        characteristicString = CMD4_Brightness;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Brightness, callback);
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
                        this.setValue(value, CMD4_Brightness, Characteristic.Brightness, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxideDetected;
        characteristicString = CMD4_CarbonDioxideDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonDioxideDetected, callback);
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
                        this.setValue(value, CMD4_CarbonDioxideDetected, Characteristic.CarbonDioxideDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxideLevel;
        characteristicString = CMD4_CarbonDioxideLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonDioxideLevel, callback);
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
                        this.setValue(value, CMD4_CarbonDioxideLevel, Characteristic.CarbonDioxideLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonDioxidePeakLevel;
        characteristicString = CMD4_CarbonDioxidePeakLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonDioxidePeakLevel, callback);
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
                        this.setValue(value, CMD4_CarbonDioxidePeakLevel, Characteristic.CarbonDioxidePeakLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxideDetected;
        characteristicString = CMD4_CarbonMonoxideDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonMonoxideDetected, callback);
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
                        this.setValue(value, CMD4_CarbonMonoxideDetected, Characteristic.CarbonMonoxideDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxideLevel;
        characteristicString = CMD4_CarbonMonoxideLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonMonoxideLevel, callback);
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
                        this.setValue(value, CMD4_CarbonMonoxideLevel, Characteristic.CarbonMonoxideLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CarbonMonoxidePeakLevel;
        characteristicString = CMD4_CarbonMonoxidePeakLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CarbonMonoxidePeakLevel, callback);
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
                        this.setValue(value, CMD4_CarbonMonoxidePeakLevel, Characteristic.CarbonMonoxidePeakLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Category;
        characteristicString = CMD4_Category;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Category, callback);
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
                        this.setValue(value, CMD4_Category, Characteristic.Category, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ChargingState;
        characteristicString = CMD4_ChargingState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ChargingState, callback);
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
                        this.setValue(value, CMD4_ChargingState, Characteristic.ChargingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ClosedCaptions;         // 20
        characteristicString = CMD4_ClosedCaptions;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ClosedCaptions, callback);
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
                        this.setValue(value, CMD4_ClosedCaptions, Characteristic.ClosedCaptions, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ColorTemperature;
        characteristicString = CMD4_ColorTemperature;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ColorTemperature, callback);
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
                        this.setValue(value, CMD4_ColorTemperature, Characteristic.ColorTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ConfiguredName;
        characteristicString = CMD4_ConfiguredName;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ConfiguredName, callback);
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
                        this.setValue(value, CMD4_ConfiguredName, Characteristic.ConfiguredName, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.ConfigureBridgedAccessoryStatus;
        characteristicString = CMD4_ConfigureBridgedAccessoryStatus;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ConfigureBridgedAccessoryStatus, callback);
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
                        this.setValue(value, CMD4_ConfigureBridgedAccessoryStatus, Characteristic.ConfigureBridgedAccessoryStatus, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.ConfigureBridgedAccessory;
        characteristicString = CMD4_ConfigureBridgedAccessory;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ConfigureBridgedAccessory, callback);
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
                        this.setValue(value, CMD4_ConfigureBridgedAccessory, Characteristic.ConfigureBridgedAccessory, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ContactSensorState;
        characteristicString = CMD4_ContactSensorState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ContactSensorState, callback);
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
                        this.setValue(value, CMD4_ContactSensorState, Characteristic.ContactSensorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CoolingThresholdTemperature;
        characteristicString = CMD4_CoolingThresholdTemperature;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CoolingThresholdTemperature, callback);
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
                        this.setValue(value, CMD4_CoolingThresholdTemperature, Characteristic.CoolingThresholdTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentAirPurifierState;
        characteristicString = CMD4_CurrentAirPurifierState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentAirPurifierState, callback);
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
                        this.setValue(value, CMD4_CurrentAirPurifierState, Characteristic.CurrentAirPurifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentAmbientLightLevel;
        characteristicString = CMD4_CurrentAmbientLightLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentAmbientLightLevel, callback);
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
                        this.setValue(value, CMD4_CurrentAmbientLightLevel, Characteristic.CurrentAmbientLightLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentDoorState;
        characteristicString = CMD4_CurrentDoorState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentDoorState, callback);
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
                        this.setValue(value, CMD4_CurrentDoorState, Characteristic.CurrentDoorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentFanState;             // 30
        characteristicString = CMD4_CurrentFanState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentFanState, callback);
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
                        this.setValue(value, CMD4_CurrentFanState, Characteristic.CurrentFanState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHeaterCoolerState;
        characteristicString = CMD4_CurrentHeaterCoolerState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentHeaterCoolerState, callback);
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
                        this.setValue(value, CMD4_CurrentHeaterCoolerState, Characteristic.CurrentHeaterCoolerState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHeatingCoolingState;
        characteristicString = CMD4_CurrentHeatingCoolingState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentHeatingCoolingState, callback);
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
                        this.setValue(value, CMD4_CurrentHeatingCoolingState, Characteristic.CurrentHeatingCoolingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHorizontalTiltAngle;
        characteristicString = CMD4_CurrentHorizontalTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentHorizontalTiltAngle, callback);
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
                        this.setValue(value, CMD4_CurrentHorizontalTiltAngle, Characteristic.CurrentHorizontalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentHumidifierDehumidifierState;
        characteristicString = CMD4_CurrentHumidifierDehumidifierState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentHumidifierDehumidifierState, callback);
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
                        this.setValue(value, CMD4_CurrentHumidifierDehumidifierState, Characteristic.CurrentHumidifierDehumidifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentMediaState;
        characteristicString = CMD4_CurrentMediaState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentMediaState, callback);
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
                        this.setValue(value, CMD4_CurrentMediaState, Characteristic.CurrentMediaState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentPosition;
        characteristicString = CMD4_CurrentPosition;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentPosition, callback);
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
                        this.setValue(value, CMD4_CurrentPosition, Characteristic.CurrentPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentRelativeHumidity;
        characteristicString = CMD4_CurrentRelativeHumidity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentRelativeHumidity, callback);
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
                        this.setValue(value, CMD4_CurrentRelativeHumidity, Characteristic.CurrentRelativeHumidity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentSlatState;
        characteristicString = CMD4_CurrentSlatState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentSlatState, callback);
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
                        this.setValue(value, CMD4_CurrentSlatState, Characteristic.CurrentSlatState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentTemperature;
        characteristicString = CMD4_CurrentTemperature;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentTemperature, callback);
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
                        this.setValue(value, CMD4_CurrentTemperature, Characteristic.CurrentTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentTiltAngle;               // 40
        characteristicString = CMD4_CurrentTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentTiltAngle, callback);
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
                        this.setValue(value, CMD4_CurrentTiltAngle, Characteristic.CurrentTiltAngle, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.CurrentTime;
        characteristicString = CMD4_CurrentTime;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentTime, callback);
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
                        this.setValue(value, CMD4_CurrentTime, Characteristic.CurrentTime, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentVerticalTiltAngle;
        characteristicString = CMD4_CurrentVerticalTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentVerticalTiltAngle, callback);
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
                        this.setValue(value, CMD4_CurrentVerticalTiltAngle, Characteristic.CurrentVerticalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.CurrentVisibilityState;
        characteristicString = CMD4_CurrentVisibilityState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_CurrentVisibilityState, callback);
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
                        this.setValue(value, CMD4_CurrentVisibilityState, Characteristic.CurrentVisibilityState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.DayoftheWeek;
        characteristicString = CMD4_DayoftheWeek;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_DayoftheWeek, callback);
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
                        this.setValue(value, CMD4_DayoftheWeek, Characteristic.DayoftheWeek, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DigitalZoom;
        characteristicString = CMD4_DigitalZoom;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_DigitalZoom, callback);
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
                        this.setValue(value, CMD4_DigitalZoom, Characteristic.DigitalZoom, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.DiscoverBridgedAccessories;
        characteristicString = CMD4_DiscoverBridgedAccessories;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_DiscoverBridgedAccessories, callback);
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
                        this.setValue(value, CMD4_DiscoverBridgedAccessories, Characteristic.DiscoverBridgedAccessories, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DiscoveredBridgedAccessories;
        characteristicString = CMD4_DiscoveredBridgedAccessories;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_DiscoveredBridgedAccessories, callback);
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
                        this.setValue(value, CMD4_DiscoveredBridgedAccessories, Characteristic.DiscoveredBridgedAccessories, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.DisplayOrder;
        characteristicString = CMD4_DisplayOrder;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_DisplayOrder, callback);
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
                        this.setValue(value, CMD4_DisplayOrder, Characteristic.DisplayOrder, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FilterChangeIndication;
        characteristicString = CMD4_FilterChangeIndication;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_FilterChangeIndication, callback);
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
                        this.setValue(value, CMD4_FilterChangeIndication, Characteristic.On, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FilterLifeLevel;        // 50
        characteristicString = CMD4_FilterLifeLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_FilterLifeLevel, callback);
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
                        this.setValue(value, CMD4_FilterLifeLevel, Characteristic.FilterLifeLevel, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.FirmwareRevision;
        characteristicString = CMD4_FirmwareRevision;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_FirmwareRevision, callback);
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
                        this.setValue(value, CMD4_FirmwareRevision, Characteristic.FirmwareRevision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HardwareRevision;
        characteristicString = CMD4_HardwareRevision;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_HardwareRevision, callback);
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
                        this.setValue(value, CMD4_HardwareRevision, Characteristic.HardwareRevision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HeatingThresholdTemperature;
        characteristicString = CMD4_HeatingThresholdTemperature;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_HeatingThresholdTemperature, callback);
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
                        this.setValue(value, CMD4_HeatingThresholdTemperature, Characteristic.HeatingThresholdTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.HoldPosition;
        characteristicString = CMD4_HoldPosition;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_HoldPosition, callback);
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
                        this.setValue(value, CMD4_HoldPosition, Characteristic.HoldPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Hue;
        characteristicString = CMD4_Hue;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Hue, callback);
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
                        this.setValue(value, CMD4_Hue, Characteristic.Hue, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Identify;
        characteristicString = CMD4_Identify;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Identify, callback);
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
                        this.setValue(value, CMD4_Identify, Characteristic.Identify, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ImageMirroring;
        characteristicString = CMD4_ImageMirroring;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ImageMirroring, callback);
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
                        this.setValue(value, CMD4_ImageMirroring, Characteristic.ImageMirroring, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ImageRotation;
        characteristicString = CMD4_ImageRotation;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ImageRotation, callback);
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
                        this.setValue(value, CMD4_ImageRotation, Characteristic.ImageRotation, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InputDeviceType;
        characteristicString = CMD4_InputDeviceType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_InputDeviceType, callback);
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
                        this.setValue(value, CMD4_InputDeviceType, Characteristic.InputDeviceType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InputSourceType;        // 60
        characteristicString = CMD4_InputSourceType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_InputSourceType, callback);
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
                        this.setValue(value, CMD4_InputSourceType, Characteristic.InputSourceType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.InUse;
        characteristicString = CMD4_InUse;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_InUse, callback);
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
                        this.setValue(value, CMD4_InUse, Characteristic.InUse, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.IsConfigured;
        characteristicString = CMD4_IsConfigured;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_IsConfigured, callback);
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
                        this.setValue(value, CMD4_IsConfigured, Characteristic.IsConfigured, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LeakDetected;
        characteristicString = CMD4_LeakDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LeakDetected, callback);
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
                        this.setValue(value, CMD4_LeakDetected, Characteristic.LeakDetected, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.LinkQuality;
        characteristicString = CMD4_LinkQuality;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LinkQuality, callback);
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
                        this.setValue(value, CMD4_LinkQuality, Characteristic.LinkQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockControlPoint;
        characteristicString = CMD4_LockControlPoint;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockControlPoint, callback);
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
                        this.setValue(value, CMD4_LockControlPoint, Characteristic.LockControlPoint, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockCurrentState;
        characteristicString = CMD4_LockCurrentState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockCurrentState, callback);
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
                        this.setValue(value, CMD4_LockCurrentState, Characteristic.LockCurrentState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockLastKnownAction;
        characteristicString = CMD4_LockLastKnownAction;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockLastKnownAction, callback);
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
                        this.setValue(value, CMD4_LockLastKnownAction, Characteristic.LockLastKnownAction, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockManagementAutoSecurityTimeout;
        characteristicString = CMD4_LockManagementAutoSecurityTimeout;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockManagementAutoSecurityTimeout, callback);
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
                        this.setValue(value, CMD4_LockManagementAutoSecurityTimeout, Characteristic.LockManagementAutoSecurityTimeout, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockPhysicalControls;
        characteristicString = CMD4_LockPhysicalControls;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockPhysicalControls, callback);
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
                        this.setValue(value, CMD4_LockPhysicalControls, Characteristic.LockPhysicalControls, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.LockTargetState;     // 70
        characteristicString = CMD4_LockTargetState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_LockTargetState, callback);
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
                        this.setValue(value, CMD4_LockTargetState, Characteristic.LockTargetState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Logs;
        characteristicString = CMD4_Logs;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Logs, callback);
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
                        this.setValue(value, CMD4_Manufacturer, Characteristic.Manufacturer, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Model;
        characteristicString = CMD4_Model;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Model, callback);
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
                        this.setValue(value, CMD4_On, Characteristic.Model, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Manufacturer;
        characteristicString = CMD4_Manufacturer;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Manufacturer, callback);
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
                        this.setValue(value, CMD4_Manufacturer, Characteristic.Manufacturer, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.MotionDetected;
        characteristicString = CMD4_MotionDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_MotionDetected, callback);
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
                        this.setValue(value, CMD4_MotionDetected, Characteristic.MotionDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Mute;
        characteristicString = CMD4_Mute;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Mute, callback);
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
                        this.setValue(value, CMD4_Mute, Characteristic.Mute, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Name;
        characteristicString = CMD4_Name;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Name, callback);
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
                        this.setValue(value, CMD4_Name, Characteristic.Name, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.NightVision;
        characteristicString = CMD4_NightVision;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_NightVision, callback);
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
                        this.setValue(value, CMD4_NightVision, Characteristic.NightVision, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.NitrogenDioxideDensity;
        characteristicString = CMD4_NitrogenDioxideDensity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_NitrogenDioxideDensity, callback);
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
                        this.setValue(value, CMD4_NitrogenDioxideDensity, Characteristic.NitrogenDioxideDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ObstructionDetected;
        characteristicString = CMD4_ObstructionDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ObstructionDetected, callback);
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
                        this.setValue(value, CMD4_ObstructionDetected, Characteristic.ObstructionDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OccupancyDetected;            // 80
        characteristicString = CMD4_OccupancyDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_OccupancyDetected, callback);
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
                        this.setValue(value, CMD4_OccupancyDetected, Characteristic.OccupancyDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.On;
        characteristicString = CMD4_On;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue("On", callback);
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
                        this.setValue(value, CMD4_On, Characteristic.On, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OpticalZoom;
        characteristicString = CMD4_OpticalZoom;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_OpticalZoom, callback);
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
                        this.setValue(value, CMD4_OpticalZoom, Characteristic.OpticalZoom, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OutletInUse;
        characteristicString = CMD4_OutletInUse;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_OutletInUse, callback);
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
                        this.setValue(value, CMD4_OutletInUse, Characteristic.OutletInUse, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.OzoneDensity;
        characteristicString = CMD4_OzoneDensity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_OzoneDensity, callback);
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
                        this.setValue(value, CMD4_OzoneDensity, Characteristic.OzoneDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairSetup;
        characteristicString = CMD4_PairSetup;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PairSetup, callback);
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
                        this.setValue(value, CMD4_PairSetup, Characteristic.PairSetup, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairVerify;
        characteristicString = CMD4_PairVerify;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PairVerify, callback);
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
                        this.setValue(value, CMD4_PairVerify, Characteristic.PairVerify, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairingFeatures;
        characteristicString = CMD4_PairingFeatures;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PairingFeatures, callback);
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
                        this.setValue(value, CMD4_PairingFeatures, Characteristic.PairingFeatures, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PairingPairings;
        characteristicString = CMD4_PairingPairings;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PairingPairings, callback);
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
                        this.setValue(value, CMD4_PairingPairings, Characteristic.PairingPairings, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PictureMode;
        characteristicString = CMD4_PictureMode;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PictureMode, callback);
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
                        this.setValue(value, CMD4_PictureMode, Characteristic.PictureMode, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.PM10Density;      // 90
        characteristicString = CMD4_PM10Density;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PM10Density, callback);
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
                        this.setValue(value, CMD4_PM10Density, Characteristic.PM10Density, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PM2_5Density;
        characteristicString = CMD4_PM2_5Density;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PM2_5Density, callback);
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
                        this.setValue(value, CMD4_PM2_5Density, Characteristic.PM2_5Density, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PositionState;
        characteristicString = CMD4_PositionState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PositionState, callback);
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
                        this.setValue(value, CMD4_PositionState, Characteristic.PositionState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.PowerModeSelection;
        characteristicString = CMD4_PowerModeSelection;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_PowerModeSelection, callback);
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
                        this.setValue(value, CMD4_PowerModeSelection, Characteristic.PowerModeSelection, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgramMode;
        characteristicString = CMD4_ProgramMode;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ProgramMode, callback);
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
                        this.setValue(value, CMD4_ProgramMode, Characteristic.ProgramMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgrammableSwitchEvent;
        characteristicString = CMD4_ProgrammableSwitchEvent;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ProgrammableSwitchEvent, callback);
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
                        this.setValue(value, CMD4_ProgrammableSwitchEvent, Characteristic.ProgrammableSwitchEvent, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ProgrammableSwitchOutputState;
        characteristicString = CMD4_ProgrammableSwitchOutputState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ProgrammableSwitchOutputState, callback);
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
                        this.setValue(value, CMD4_ProgrammableSwitchOutputState, Characteristic.ProgrammableSwitchOutputState, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.Reachable;
        characteristicString = CMD4_Reachable;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Reachable, callback);
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
                        this.setValue(value, CMD4_Reachable, Characteristic.Reachable, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.RelativeHumidityDehumidifierThreshold;
        characteristicString = CMD4_RelativeHumidityDehumidifierThreshold;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RelativeHumidityDehumidifierThreshold, callback);
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
                        this.setValue(value, CMD4_RelativeHumidityDehumidifierThreshold,    Characteristic.RelativeHumidityDehumidifierThreshold, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelativeHumidityHumidifierThreshold;
        characteristicString = CMD4_RelativeHumidityHumidifierThreshold;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RelativeHumidityHumidifierThreshold, callback);
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
                        this.setValue(value, CMD4_RelativeHumidityHumidifierThreshold,    Characteristic.RelativeHumidityHumidifierThreshold, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.RelayEnabled;    // 100
        characteristicString = CMD4_RelayEnabled;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RelayEnabled, callback);
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
                        this.setValue(value, CMD4_RelayEnabled, Characteristic.RelayEnabled, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelayState;
        characteristicString = CMD4_RelayState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RelayState, callback);
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
                        this.setValue(value, CMD4_RelayState, Characteristic.RelayState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RelayControlPoint;
        characteristicString = CMD4_RelayControlPoint;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RelayControlPoint, callback);
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
                        this.setValue(value, CMD4_RelayControlPoint, Characteristic.RelayControlPoint, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RemainingDuration;
        characteristicString = CMD4_RemainingDuration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RemainingDuration, callback);
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
                        this.setValue(value, CMD4_RemainingDuration, Characteristic.RemainingDuration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RemoteKey;
        characteristicString = CMD4_RemoteKey;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RemoteKey, callback);
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
                        this.setValue(value, CMD4_RemoteKey, Characteristic.RemoteKey, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ResetFilterIndication;
        characteristicString = CMD4_ResetFilterIndication;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ResetFilterIndication, callback);
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
                        this.setValue(value, CMD4_ResetFilterIndication, Characteristic.ResetFilterIndication, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RotationDirection;
        characteristicString = CMD4_RotationDirection;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RotationDirection, callback);
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
                        this.setValue(value, CMD4_RotationDirection, Characteristic.RotationDirection, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.RotationSpeed;
        characteristicString = CMD4_RotationSpeed;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_RotationSpeed, callback);
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
                        this.setValue(value, CMD4_RotationSpeed, Characteristic.RotationSpeed, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Saturation;
        characteristicString = CMD4_Saturation;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Saturation, callback);
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
                        this.setValue(value, CMD4_Saturation, Characteristic.Saturation, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemAlarmType;
        characteristicString = CMD4_SecuritySystemAlarmType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SecuritySystemAlarmType, callback);
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
                        this.setValue(value, CMD4_SecuritySystemAlarmType, Characteristic.SecuritySystemAlarmType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemCurrentState;       // 110
        characteristicString = CMD4_SecuritySystemCurrentState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SecuritySystemCurrentState, callback);
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
                        this.setValue(value, CMD4_SecuritySystemCurrentState, Characteristic.SecuritySystemCurrentState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SecuritySystemTargetState;
        characteristicString = CMD4_SecuritySystemTargetState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SecuritySystemTargetState, callback);
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
                        this.setValue(value, CMD4_SecuritySystemTargetState, Characteristic.SecuritySystemTargetState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SelectedRTPStreamConfiguration;
        characteristicString = CMD4_SelectedRTPStreamConfiguration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SelectedRTPStreamConfiguration, callback);
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
                        this.setValue(value, CMD4_SelectedRTPStreamConfiguration,    Characteristic.SelectedRTPStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SerialNumber;
        characteristicString = CMD4_SerialNumber;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SerialNumber, callback);
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
                        this.setValue(value, CMD4_SerialNumber, Characteristic.SerialNumber, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ServiceLabelIndex;
        characteristicString = CMD4_ServiceLabelIndex;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ServiceLabelIndex, callback);
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
                        this.setValue(value, CMD4_ServiceLabelIndex, Characteristic.ServiceLabelIndex, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ServiceLabelNamespace;
        characteristicString = CMD4_ServiceLabelNamespace;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ServiceLabelNamespace, callback);
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
                        this.setValue(value, CMD4_ServiceLabelNamespace, Characteristic.ServiceLabelNamespace, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SetDuration;
        characteristicString = CMD4_SetDuration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SetDuration, callback);
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
                        this.setValue(value, CMD4_SetDuration, Characteristic.SetDuration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SetupEndpoints;
        characteristicString = CMD4_SetupEndpoints;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SetupEndpoints, callback);
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
                        this.setValue(value, CMD4_SetupEndpoints, Characteristic.SetupEndpoints, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SlatType;
        characteristicString = CMD4_SlatType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SlatType, callback);
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
                        this.setValue(value, CMD4_SlatType, Characteristic.SlatType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SleepDiscoveryMode;
        characteristicString = CMD4_SleepDiscoveryMode;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SleepDiscoveryMode, callback);
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
                        this.setValue(value, CMD4_SleepDiscoveryMode, Characteristic.SleepDiscoveryMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SmokeDetected;        // 120
        characteristicString = CMD4_SmokeDetected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SmokeDetected, callback);
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
                        this.setValue(value, CMD4_SmokeDetected, Characteristic.SmokeDetected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusActive;
        characteristicString = CMD4_StatusActive;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StatusActive, callback);
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
                        this.setValue(value, CMD4_StatusActive, Characteristic.StatusActive, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusFault;
        characteristicString = CMD4_StatusFault;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StatusFault, callback);
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
                        this.setValue(value, CMD4_StatusFault, Characteristic.StatusFault, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusJammed;
        characteristicString = CMD4_StatusJammed;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StatusJammed, callback);
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
                        this.setValue(value, CMD4_StatusJammed, Characteristic.StatusJammed, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusLowBattery;
        characteristicString = CMD4_StatusLowBattery;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StatusLowBattery, callback);
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
                        this.setValue(value, CMD4_StatusLowBattery, Characteristic.StatusLowBattery, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StatusTampered;
        characteristicString = CMD4_StatusTampered;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StatusTampered, callback);
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
                        this.setValue(value, CMD4_StatusTampered, Characteristic.StatusTampered, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.StreamingStatus;
        characteristicString = CMD4_StreamingStatus;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_StreamingStatus, callback);
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
                        this.setValue(value, CMD4_StreamingStatus, Characteristic.StreamingStatus, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SulphurDioxideDensity;
        characteristicString = CMD4_SulphurDioxideDensity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SulphurDioxideDensity, callback);
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
                        this.setValue(value, CMD4_SulphurDioxideDensity, Characteristic.SulphurDioxideDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedAudioStreamConfiguration;
        characteristicString = CMD4_SupportedAudioStreamConfiguration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SupportedAudioStreamConfiguration, callback);
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
                        this.setValue(value, CMD4_SupportedAudioStreamConfiguration, Characteristic.SupportedAudioStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedRTPConfiguration;
        characteristicString = CMD4_SupportedRTPConfiguration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SupportedRTPConfiguration, callback);
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
                        this.setValue(value, CMD4_SupportedRTPConfiguration, Characteristic.SupportedRTPConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SupportedVideoStreamConfiguration;  // 130
        characteristicString = CMD4_SupportedVideoStreamConfiguration;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SupportedVideoStreamConfiguration, callback);
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
                        this.setValue(value, CMD4_SupportedVideoStreamConfiguration, Characteristic.SupportedVideoStreamConfiguration, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.SwingMode;
        characteristicString = CMD4_SwingMode;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_SwingMode, callback);
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
                        this.setValue(value, CMD4_SwingMode, Characteristic.SwingMode, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetAirPurifierState;
        characteristicString = CMD4_TargetAirPurifierState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetAirPurifierState, callback);
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
                        this.setValue(value, CMD4_TargetAirPurifierState, Characteristic.TargetAirPurifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetAirQuality;
        characteristicString = CMD4_TargetAirQuality;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetAirQuality, callback);
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
                        this.setValue(value, CMD4_TargetAirQuality, Characteristic.TargetAirQuality, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetDoorState;
        characteristicString = CMD4_TargetDoorState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetDoorState, callback);
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
                        this.setValue(value, CMD4_TargetDoorState, Characteristic.TargetDoorState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetFanState;
        characteristicString = CMD4_TargetFanState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetFanState, callback);
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
                        this.setValue(value, CMD4_TargetFanState, Characteristic.TargetFanState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHeaterCoolerState;
        characteristicString = CMD4_TargetHeaterCoolerState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetHeaterCoolerState, callback);
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
                        this.setValue(value, CMD4_TargetHeaterCoolerState, Characteristic.TargetHeaterCoolerState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHeatingCoolingState;
        characteristicString = CMD4_TargetHeatingCoolingState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetHeatingCoolingState, callback);
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
                        this.setValue(value, CMD4_TargetHeatingCoolingState, Characteristic.TargetHeatingCoolingState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHorizontalTiltAngle;
        characteristicString = CMD4_TargetHorizontalTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue("On", callback);
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
                        this.setValue(value, CMD4_TargetHorizontalTiltAngle, Characteristic.TargetHorizontalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetHumidifierDehumidifierState;
        characteristicString = CMD4_TargetHumidifierDehumidifierState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetHumidifierDehumidifierState, callback);
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
                        this.setValue(value, CMD4_TargetHumidifierDehumidifierState, Characteristic.TargetHumidifierDehumidifierState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetMediaState;     // 140
        characteristicString = CMD4_TargetMediaState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetMediaState, callback);
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
                        this.setValue(value, CMD4_TargetMediaState, Characteristic.CMD4_TargetMedia, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetPosition;
        characteristicString = CMD4_TargetPosition;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetPosition, callback);
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
                        this.setValue(value, CMD4_TargetPosition, Characteristic.TargetPosition, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetRelativeHumidity;
        characteristicString = CMD4_TargetRelativeHumidity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetRelativeHumidity, callback);
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
                        this.setValue(value, CMD4_TargetRelativeHumidity, Characteristic.TargetRelativeHumidity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetSlatState;
        characteristicString = CMD4_TargetSlatState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetSlatState, callback);
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
                        this.setValue(value, CMD4_TargetSlatState, Characteristic.TargetSlatState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetTemperature;
        characteristicString = CMD4_TargetTemperature;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetTemperature, callback);
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
                        this.setValue(value, CMD4_TargetTemperature, Characteristic.TargetTemperature, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetTiltAngle;
        characteristicString = CMD4_TargetTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetTiltAngle, callback);
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
                        this.setValue(value, CMD4_TargetTiltAngle, Characteristic.TargetTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetVerticalTiltAngle;
        characteristicString = CMD4_TargetVerticalTiltAngle;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetVerticalTiltAngle, callback);
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
                        this.setValue(value, CMD4_TargetVerticalTiltAngle, Characteristic.TargetVerticalTiltAngle, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TargetVisibilityState;
        characteristicString = CMD4_TargetVisibilityState;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TargetVisibilityState, callback);
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
                        this.setValue(value, CMD4_TargetVisibilityState, Characteristic.CMD4_TargetVisibilityState, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TemperatureDisplayUnits;
        characteristicString = CMD4_TemperatureDisplayUnits;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TemperatureDisplayUnits, callback);
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
                        this.setValue(value, CMD4_TemperatureDisplayUnits, Characteristic.TemperatureDisplayUnits, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.TimeUpdate;
        characteristicString = CMD4_TimeUpdate;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TimeUpdate, callback);
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
                        this.setValue(value, CMD4_TimeUpdate, Characteristic.TimeUpdate, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryAdvertising;       // 160
        characteristicString = CMD4_TunneledAccessoryAdvertising;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TunneledAccessoryAdvertising, callback);
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
                        this.setValue(value, CMD4_TunneledAccessoryAdvertising, Characteristic.TunneledAccessoryAdvertising, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryConnected;
        characteristicString = CMD4_TunneledAccessoryConnected;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TunneledAccessoryConnected, callback);
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
                        this.setValue(value, CMD4_TunneledAccessoryConnected, Characteristic.TunneledAccessoryConnected, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunneledAccessoryStateNumber;
        characteristicString = CMD4_TunneledAccessoryStateNumber;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TunneledAccessoryStateNumber, callback);
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
                        this.setValue(value, CMD4_TunneledAccessoryStateNumber, Characteristic.TunneledAccessoryStateNumber, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.TunnelConnectionTimeout;
        characteristicString = CMD4_TunnelConnectionTimeout;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_TunnelConnectionTimeout, callback);
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
                        this.setValue(value, CMD4_TunnelConnectionTimeout, Characteristic.TunnelConnectionTimeout, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.ValveType;
        characteristicString = CMD4_ValveType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_ValveType, callback);
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
                        this.setValue(value, CMD4_ValveType, Characteristic.ValveType, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Version;
        characteristicString = CMD4_Version;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Version, callback);
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
                        this.setValue(value, CMD4_Version, Characteristic.Version, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.VOCDensity;
        characteristicString = CMD4_VOCDensity;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_VOCDensity, callback);
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
                        this.setValue(value, CMD4_VOCDensity, Characteristic.VOCDensity, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.Volume;
        characteristicString = CMD4_Volume;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_Volume, callback);
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
                        this.setValue(value, CMD4_Volume, Characteristic.Volume, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.VolumeControlType;
        characteristicString = CMD4_VolumeControlType;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_VolumeControlType, callback);
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
                        this.setValue(value, CMD4_VolumeControlType, Characteristic.CMD4_VolumeControlType, callback);
                        });
                }
            }
        }

        characteristic = Characteristic.VolumeSelector;
        characteristicString = CMD4_VolumeSelector;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_VolumeSelector, callback);
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
                        this.setValue(value, CMD4_VolumeSelector, Characteristic.VolumeSelector, callback);
                        });
                }
            }
        }
 
        characteristic = Characteristic.WaterLevel;   // 170
        characteristicString = CMD4_WaterLevel;
        if ( this.getStoredValueForKey( characteristicString) != undefined)
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
                        this.getValue(CMD4_WaterLevel, callback);
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
                        this.setValue(value, CMD4_WaterLevel, Characteristic.WaterLevel, callback);
                        });
                }
            }
        }
    },
   updateAccessoryAttribute: function (characteristicString, value)
   {
      var index = accMapper.indexOf(characteristicString);

      if (index < 0)
      {
         this.log ("CMD4 Warning: updateAccessoryAttribute - Characteristic '%s' for '%s' not known", characteristicString, this.name);
         return;
      }
      this.setStoredValueForKey(characteristicString, value);

      if ( this.loggingService )
      {
         switch (this.eve)
         {
            case FAKEGATO_TYPE_ENERGY:
               var powerV   = this.fakegatoConfig['power']    || '0';
               var ucPowerV = ucFirst(powerV)                 || '0';

               powerV = (this.testStoredValueForKey(ucPowerV) < 0) ?
                      powerV : this.getStoredValueForKey(ucPowerV);

               this.log.debug("Logging power '%s'", powerV);
               // Eve Energy (Outlet service)
               this.loggingService.addEntry({time: moment().unix(),
                  power: powerV});
               break;
            case FAKEGATO_TYPE_ROOM:
               var tempV       = this.fakegatoConfig['temp']       || '0';
               var humidityV   = this.fakegatoConfig['humidity']   || '0';
               var ppmV        = this.fakegatoConfig['ppm']        || '0';
               var ucTempV     = ucFirst(tempV)       || '0';
               var ucHumidityV = ucFirst(humidityV)   || '0';
               var ucPpmV      = ucFirst(ppmV)        || '0';

               tempV = (this.testStoredValueForKey(ucTempV) < 0) ?
                      tempV : this.getStoredValueForKey(ucTempV);
               humidityV = (this.testStoredValueForKey(ucHumidityV) < 0) ?
                      humidityV : this.getStoredValueForKey(ucHumidityV);
               ppmV = (this.testStoredValueForKey(ucPpmV) < 0) ?
                      ppmV : this.getStoredValueForKey(ucPpmV);

               this.log.debug("Logging temp '%s' humidity '%s' ppm '%s'", tempV, humidityV, ppmV);
               // Eve Room (TempSensor, HumiditySensor and AirQuality Services)
               this.loggingService.addEntry({time: moment().unix(),
                  temp:tempV,
                  humidity:humidityV,
                  ppm:ppmV});
               break;
            case FAKEGATO_TYPE_WEATHER:
               var tempV       = this.fakegatoConfig['temp']       || '0';
               var pressureV   = this.fakegatoConfig['pressure']   || '0';
               var humidityV   = this.fakegatoConfig['humidity']   || '0';
               var ucTempV     = ucFirst(tempV)       || '0';
               var ucPressureV = ucFirst(pressureV)   || '0';
               var ucHumidityV = ucFirst(humidityV)   || '0';

               tempV = (this.testStoredValueForKey(ucTempV) < 0) ?
                      tempV : this.getStoredValueForKey(ucTempV);
               pressureV = (this.testStoredValueForKey(ucPressureV) < 0) ?
                      pressureV : this.getStoredValueForKey(ucPressureV);
               humidityV = (this.testStoredValueForKey(ucHumidityV) < 0) ?
                      humidityV : this.getStoredValueForKey(ucHumidityV);

               this.log.debug("Logging temp '%s' pressure '%s' humidity '%s'", tempV, pressureV, humidityV);
               // Eve Weather (TempSensor Service)
               this.loggingService.addEntry({time: moment().unix(),
                  temp:tempV,
                  pressure:pressureV,
                  humidity:humidityV});
               break;
            case FAKEGATO_TYPE_DOOR:
               var statusV   = this.fakegatoConfig['status']   || '0';
               var ucStatusV = ucFirst(statusV)                || '0';

               statusV = (this.testStoredValueForKey(ucStatusV) < 0) ?
                      statusV : this.getStoredValueForKey(ucStatusV);

               this.log.debug("logging status  %s", statusV);
               // Eve Door (ContactSensor service)
               this.loggingService.addEntry({time: moment().unix(),
                  status: statusV});
               break;
            case FAKEGATO_TYPE_MOTION:
               var statusV   = this.fakegatoConfig['status']   || '0';
               var ucStatusV = ucFirst(statusV)                || '0';

               this.log.debug("logging status  %s", statusV);
               // Eve Motion (MotionSensor service)
               this.loggingService.addEntry({time: moment().unix(),
                  status: statusV});
               break;
            case FAKEGATO_TYPE_THERMO:
               var currentTempV     = this.fakegatoConfig['currentTemp']   || '0';
               var setTempV         = this.fakegatoConfig['setTemp']       || '0';
               var valvePositionV   = this.fakegatoConfig['valvePosition'] || '0';
               var ucCurrentTempV   = ucFirst(currentTempV)   || '0';
               var ucSetTempV       = ucFirst(setTempV)       || '0';
               var ucValvePositionV = ucFirst(valvePositionV) || '0';

               currentTempV = (this.testStoredValueForKey(ucCurrentTempV) < 0) ?
                      currentTempV : this.getStoredValueForKey(ucCurrentTempV);
               setTempV = (this.testStoredValueForKey(ucSetTempV) < 0) ?
                      setTempV : this.getStoredValueForKey(ucSetTempV);
               valvePositionV = (this.testStoredValueForKey(ucValvePositionV) < 0) ?
                      valvePositionV : this.getStoredValueForKey(ucValvePositionV);

               this.log.debug("Logging currentTemp '%s' setTemp '%s' valvePosition '%s'", setTempV, currentTempV, valvePositionV);
               // Eve Thermo (Thermostat service)
               this.loggingService.addEntry({time: moment().unix(),
                  currentTemp:currentTempV,
                  setTemp:setTempV,
                  valvePosition:valvePositionV});
               break;
            case FAKEGATO_TYPE_AQUA:
               var statusV        = this.fakegatoConfig['status']       || '0';
               var waterAmountV   = this.fakegatoConfig['waterAmount']  || '0';
               var ucStatusV      = ucFirst(statusV)                    || '0';
               var ucWaterAmountV = ucFirst(waterAmountV)               || '0';

               statusV = (this.testStoredValueForKey(ucStatusV) < 0) ?
                      statusV : this.getStoredValueForKey(ucStatusV);
               waterAmountV = (this.testStoredValueForKey(ucWaterAmountV) < 0) ?
                      waterAmountV : this.getStoredValueForKey(ucWaterAmountV);

               this.log.debug("Logging status '%s' waterAmount '%s'", statusV, waterAmountV);
               // Eve Aqua (Valve service set to Irrigation Type)
               this.LoggingService.addEntry({ time: moment().unix(),
                  status:statusV,
                  waterAmount:waterAmountV});
               break;
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
                this.storagePAth = fakegatoConfig[key];
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
                 // make sure that the characteristic to log to fakegato is valid
                 // and if it is not 0 for not used.
                 if (this.testStoredValueForKey(ucValue) < 0 && ucValue != '0')
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

