'use strict';

const SLOW_STATE_CHANGE_RESPONSE_TIME   = 10000;  // 10 seconds
const MEDIUM_STATE_CHANGE_RESPONSE_TIME = 3000;   // 3 seconds
const FAST_STATE_CHANGE_RESPONSE_TIME   = 1000;   // 1 second


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

// Export both the init function and the uninitialized data for unit testing
module.exports =
{
   init: function (CMD4_ACC_TYPE_ENUM, Service, Characteristic)
   {
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

      return CMD4_DEVICE_TYPE_ENUM;
   }, CMD4_DEVICE_TYPE_ENUM
}
