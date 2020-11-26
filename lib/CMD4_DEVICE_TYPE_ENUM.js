'use strict';

const SLOW_STATE_CHANGE_RESPONSE_TIME   = 10000;  // 10 seconds
const MEDIUM_STATE_CHANGE_RESPONSE_TIME = 3000;   // 3 seconds
const FAST_STATE_CHANGE_RESPONSE_TIME   = 1000;   // 1 second


var CMD4_DEVICE_TYPE_ENUM =
{
   AccessControl:                        0,
   AccessoryRuntimeInformation:          1,
   AccessoryInformation:                2,
   AirPurifier:                         3,
   AirQualitySensor:                    4,
   BatteryService:                      5,
   BridgeConfiguration:                 6,
   BridgingState:                       7,
   CamaeraEventRecordingManagement:     8,
   CameraControl:                       9,
   CameraRTPStreamManagement:           10,
   CameraOperatingMode:                 11,
   CarbonDioxideSensor:                 12,
   CarbonMonoxideSensor:                13,
   ContactSensor:                       14,
   Diagnostics:                         15,
   Door:                                16,
   DoorBell:                            17,
   Fan:                                 18,
   Fanv1:                               19,
   Fanv2:                               20,
   Faucet:                              21,
   FilterMaintenance:                   22,
   GarageDoorOpener:                    23,
   HeaterCooler:                        24,
   HumidifierDehumidifier:              25,
   HumiditySensor:                      26,
   InputSource:                         27,
   IrrigationSystem:                    28,
   LeakSensor:                          29,
   LightSensor:                         30,
   Lightbulb:                           31,
   LockManagement:                      32,
   LockMechanism:                       33,
   Microphone:                          34,
   MotionSensor:                        35,
   OccupancySensor:                     36,
   Outlet:                              37,
   Pairing:                             38,
   PowerManagement:                     39,
   ProtocolInformation:                 40,
   Relay:                               41,
   SecuritySystem:                      42,
   ServiceLabel:                        43,
   Siri:                                44,
   Slat:                                45,
   SmartSpeaker:                        46,
   SmokeSensor:                         47,
   Speaker:                             48,
   StatefulProgrammableSwitch:          49,
   StatelessProgrammableSwitch:         50,
   Switch:                              51,
   TargetControl:                       52,
   TargetControlManagement:             53,
   Television:                          54,
   TelevisionSpeaker:                   55,
   TemperatureSensor:                   56,
   Thermostat:                          57,
   TimeInformation:                     58,
   TransferTransportManagement:         59,
   TunneledBTLEAccessoryService:        60,
   Valve:                               61,
   WiFiRouter:                          62,
   WiFiSatellite:                       63,
   Window:                              64,
   WindowCovering:                      65,
   EOL:                                 66,

   properties:{}
};

// Export both the init function and the uninitialized data for unit testing
module.exports =
{
   init: function ( CMD4_ACC_TYPE_ENUM, Service, Characteristic, Categories )
   {
      // Fill in the properties of each device (Must be done at runtime)
      CMD4_DEVICE_TYPE_ENUM.properties =
      {
         0:  { deviceName:'AccessControl',
               service: Service.AccessControl,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.AccessControlLevel,
                     "defaultValue": 0         // min 0, max 2
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.PasswordSetting
                  ],
               defaultPollingCharacteristics:
                  []
             },
         1:  { deviceName:'AccessoryRuntimeInformation',
               service: Service.AccessoryRuntimeInformation,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Ping,
                     "defaultValue": 0         // Type is DATA, therefore Who Knows
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ActivityInterval,
                    CMD4_ACC_TYPE_ENUM.HeartBeat,
                    CMD4_ACC_TYPE_ENUM.SleepInterval
                  ],
               defaultPollingCharacteristics:
                  []
             },
         2:  { deviceName:'AccessoryInformation',
               service: Service.AccessoryInformation,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Identify,
                     "defaultValue":true },                         // Format: Bool
                    {'type':         CMD4_ACC_TYPE_ENUM.Manufacturer,
                     "defaultValue":'Cmd4' },                       // Format: string
                    {'type':         CMD4_ACC_TYPE_ENUM.Model,
                     "defaultValue":'Model' },                      // Format: string
                    {'type':         CMD4_ACC_TYPE_ENUM.Name,
                     "defaultValue":'My_AccessoryInformation' },
                    {'type':         CMD4_ACC_TYPE_ENUM.SerialNumber,
                     "defaultValue":'ABC001' },                     // Format: string
                    {'type':         CMD4_ACC_TYPE_ENUM.FirmwareRevision,
                     "defaultValue":'100.1.1' }                     // Format: string
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.HardwareRevision,
                    CMD4_ACC_TYPE_ENUM.AccessoryFlags
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Identify
                  ]
             },
         3:  { deviceName:'AirPurifier',
               service: Service.AirPurifier,
               defaultCategory: Categories.AIR_PURIFIER,
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
         4:  { deviceName:'AirQualitySensor',
               service: Service.AirQualitySensor,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.AirQuality,
                     "defaultValue": Characteristic.AirQuality.GOOD }
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
         5:  { deviceName:'BatteryService',
               service: Service.BatteryService,
               defaultCategory: Categories.OTHER,
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
         6:  { deviceName:'BridgeConfiguration',
               service: Service.BridgeConfiguration,
               defaultCategory: Categories.BRIDGE,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus,
                     "defaultValue": 0 }                              // Format: TLV8
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
         7:  { deviceName:'BridgingState',
               service: Service.BridgingState,
               defaultCategory: Categories.BRIDGE,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Reachable,
                     "defaultValue": true },                         // Format: Bool
                    {'type':         CMD4_ACC_TYPE_ENUM.LinkQuality,
                     "defaultValue": 1 },                            // Format: Uint8
                                                                     // Range: 1-4, Step: 1
                    {'type':         CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                     "defaultValue": "id999" },                      // Format: String
                    {'type':         CMD4_ACC_TYPE_ENUM.Category,
                     "defaultValue": 16 }                            // Format: Uint16
                                                                     // Range: 1-16, Step 1
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Reachable
                  ]
             },
         8:  { deviceName:'CamaeraEventRecordingManagement',
               service: Service.CamaeraEventRecordingManagement,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                     "defaultValue":Characteristic.Active.ACTIVE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedCameraRecordingConfiguration,
                     "defaultValue": 0                                // Format: TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedVideoRecordingConfiguration,
                     "defaultValue": 0                                // Format: TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedAudioRecordingConfiguration,
                     "defaultValue": 0                                // Format: TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SelectedCameraRecordingConfiguration,
                     "defaultValue": 0                                // Format: TLV8
                    },
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.RecordingAudioActive
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Active
                  ]
             },
         9:  { deviceName:'CameraControl',
               service: Service.CameraControl,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                     "defaultValue": true }                           // Format: Bool
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
         10: { deviceName:'CameraRTPStreamManagement',
               service: Service.CameraRTPStreamManagement,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration,
                     "defaultValue": 0 },                             // Format TLV8
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration,
                     "defaultValue": 0 },                             // Format TLV8
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration,
                     "defaultValue": 0 },                             // Format TLV8
                    {'type':         CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration,
                     "defaultValue": 0 },                             // Format TLV8
                    {'type':         CMD4_ACC_TYPE_ENUM.StreamingStatus,
                     "defaultValue": 0 },                             // Format TLV8
                    {'type':         CMD4_ACC_TYPE_ENUM.SetupEndpoints,
                     "defaultValue": 0 }                              // Format TLV8
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [
                  ]
             },
         11: { deviceName:'CameraOperatingMode',
               service: Service.CameraOperatingMode,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.EventSnapshotsActive,
                     "defaultValue": Characteristic.EventSnapshotsActive.DISABLE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.HomeKitCameraActive,
                     "defaultValue": Characteristic.HomeKitCameraActive.OFF
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ManuallyDisabled,
                    CMD4_ACC_TYPE_ENUM.NightVision,
                    CMD4_ACC_TYPE_ENUM.ThirdPartyCameraActive,
                    CMD4_ACC_TYPE_ENUM.CameraOperatingModeIndicator,
                    CMD4_ACC_TYPE_ENUM.PeriodicSnapshotsActive
                  ],
               defaultPollingCharacteristics:
                  []
             },
         12: { deviceName:'CarbonDioxideSensor',
               service: Service.CarbonDioxideSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected,
                     "defaultValue": Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL
                    }
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
         13: { deviceName:'CarbonMonoxideSensor',
               service: Service.CarbonMonoxideSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected,
                     "defaultValue": Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL }
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
         14: { deviceName:'ContactSensor',
               service: Service.ContactSensor,
               defaultCategory: Categories.SENSOR,
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
         15: { deviceName:'Diagnostic',
               service: Service.Diagnostic,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SupportedDiagnosticsSnapshot,
                     "defaultValue": 0   // tlv8
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         16: { deviceName:'Door',
               service: Service.Door,
               defaultCategory: Categories.DOOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentPosition,
                     "defaultValue": 0                                // Range 0 - 100
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.PositionState,
                     "defaultValue": Characteristic.PositionState.STOPPED
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.TargetPosition,
                     "defaultValue": 0                                // Range 0 - 100
                    }
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
         17: { deviceName:'DoorBell',
               service: Service.Doorbell,
               defaultCategory: Categories.OTHER,
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
         18: { deviceName:'Fan',
               service: Service.Fan,
               defaultCategory: Categories.FAN,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                     "defaultValue": false                            // Format: Bool
                    }
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
         19: { deviceName:'Fanv1',
               service: Service.Fan,
               defaultCategory: Categories.FAN,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                     "defaultValue": false                            // Format: Bool
                    }
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
         20: { deviceName:'Fanv2',
               service: Service.Fanv2,
               defaultCategory: Categories.FAN,
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
         21: { deviceName:'Faucet',
               service: Service.Faucet,
               defaultCategory: Categories.FAUCET,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                     "defaultValue": Characteristic.Active.ACTIVE
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name,
                    CMD4_ACC_TYPE_ENUM.StatusFault
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Active
                  ]
             },
         22: { deviceName:'FilterMaintenance',
               service: Service.FilterMaintenance,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.FilterChangeIndication,
                     "defaultValue": Characteristic.FilterChangeIndication.FILTER_OK
                    }
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
         23: { deviceName:'GarageDoorOpener',
               service: Service.GarageDoorOpener,
               defaultCategory: Categories.GARAGE_DOOR_OPENER,
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
         24: { deviceName:'HeaterCooler',
               service: Service.HeaterCooler,
               defaultCategory: Categories.AIR_HEATER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Active,
                     "defaultValue": Characteristic.Active.ACTIVE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                     "defaultValue": Characteristic.CurrentHeaterCoolerState.INACTIV
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                     "defaultValue": Characteristic.TargetHeaterCoolerState.HEAT
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                     "defaultValue": 50.0                             // Range:  0 - 100, Step: 0.1
                    }                                                 // Format: float
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
         25: { deviceName:'HumidifierDehumidifier',
               service: Service.HumidifierDehumidifier,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                     "defaultValue": 60                               // Range:  0 - 100, Step: 1
                    },                                                // Format: float
                                                                      // Units:  CELCIUS
                    {'type':         CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                     "defaultValue": Characteristic.CurrentHumidifierDehumidifierState.IDLE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                     "defaultValue": Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.Active,
                     "defaultValue": Characteristic.Active.ACTIVE
                    }
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
         26: { deviceName:'HumiditySensor',
               service: Service.HumiditySensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                     "defaultValue": 60                               // Range:  0 - 100, Step: 1
                    }                                                 // Format: float
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
         27: { deviceName:'InputSource',
               service: Service.InputSource,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ConfiguredName,
                     "defaultValue": "My_InputSource"                 // Format: String
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.InputSourceType,
                     "defaultValue": Characteristic.InputSourceType.HOME_SCREEN
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.IsConfigured,
                     "defaultValue": Characteristic.IsConfigured.CONFIGURED
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.CurrentVisibilityState,
                     "defaultValue": Characteristic.CurrentVisibilityState.SHOWN
                    }
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
         28: { deviceName:'IrrigationSystem',
               service: Service.IrrigationSystem,
               defaultCategory: Categories.SPRINKLER,
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
         29: { deviceName:'LeakSensor',
               service: Service.LeakSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.LeakDetected,
                     "defaultValue": Characteristic.LeakDetected.LEAK_NOT_DETECTED
                    }
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
         30: { deviceName:'LightSensor',
               service: Service.LightSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel,
                     "defaultValue": 1                                // Range:  0.0001 - 100000
                    }                                                 // Format: float
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
         31: { deviceName:'Lightbulb',
               service: Service.Lightbulb,
               defaultCategory: Categories.LIGHTBULB,
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
         32: { deviceName:'LockManagement',
               service: Service.LockManagement,
               defaultCategory: Categories.ALARM_SYSTEM,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.LockControlPoint,
                     "defaultValue": 0                                // Format TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.Version,
                     "defaultValue": '0.0.0'                          // Format: String
                    }
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
         33: { deviceName:'LockMechanism',
               service: Service.LockMechanism,
               defaultCategory: Categories.DOOR_LOCK,
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
         34: { deviceName:'Microphone',
               service: Service.Microphone,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Mute,
                     "defaultValue": false                            // Format: Bool,
                    }                                                 // 0 - Mute is off
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
         35: { deviceName:'MotionSensor',
               service: Service.MotionSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.MotionDetected,
                     "defaultValue": true                             // Format: Bool
                    }
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
         36: { deviceName:'OccupancySensor',
               service: Service.OccupancySensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.OccupancyDetected,
                     "defaultValue": Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED
                    }
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
         37: { deviceName:'Outlet',
               service: Service.Outlet,
               defaultCategory: Categories.OUTLET,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                     "defaultValue": false                             // Format: Bool
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.OutletInUse,
                     "defaultValue": false                            // Format: Bool
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.On
                  ]
             },
         38: { deviceName:'Pairing',
               service: Service.Pairing,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.PairingFeatures,
                     "defaultValue": 1                                // Format: Uint8. Values ???
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.PairVerify,
                     "defaultValue": 0                                // Format: TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.PairingFeatures,
                     "defaultValue": 0                                // Format: Uint8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.PairingPairings,
                     "defaultValue": 0                                // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [     // none
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.PairingFeatures
                  ]
             },
         39: { deviceName:'PowerManagement',
               service: Service.PowerManagement,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.WakeConfiguration,
                     "defaultValue": 0                                // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         40: { deviceName:'ProtocolInformation',
               service: Service.ProtocolInformation,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Version,
                     "defaultValue": '1.2.3'                          // Format string
                    }
                  ],
               optionalCharacteristics:
                  [ // none
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Version
                  ]
             },
         41: { deviceName:'Relay',
               service: Service.Relay,
               defaultCategory: Categories.SWITCH,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.RelayEnabled,
                     "defaultValue": true                             // Format: Bool
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.RelayState,
                     "defaultValue": 1                                // Format uint8, Values ???
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.RelayControlPoint,
                     "defaultValue": 0                                // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // none
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.RelayEnabled,
                    CMD4_ACC_TYPE_ENUM.RelayState,
                  ]
             },
         42: { deviceName:'SecuritySystem',
               service: Service.SecuritySystem,
               defaultCategory: Categories.SECURITY_SYSTEM,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                     "defaultValue": Characteristic.SecuritySystemCurrentState.DISARMED
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState,
                     "defaultValue": Characteristic.SecuritySystemTargetState.DISARM
                    }
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
         43: { deviceName:'ServiceLabel',
               service: Service.ServiceLabel,
               defaultCategory: Categories.OTHER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace,
                     "defaultValue": Characteristic.ServiceLabelNamespace.DOTS
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace
                  ]
             },
         44: { deviceName:'Siri',
               service: Service.Siri,
               defaultCategory: Categories.HOMEPOD,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SiriInputType,
                     "defaultValue": 0   // tlv8
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         45: { deviceName:'Slat',
               service: Service.Slat,
               defaultCategory: Categories.WINDOW_COVERING,
               devicesStateChangeDefaultTimeb:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
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
         46: { deviceName:'SmartSpeaker',
               service: Service.SmartSpeaker,
               defaultCategory: Categories.HOMEPOD,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                     "defaultValue": Characteristic.CurrentMediaState.STOP
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.TargetMediaState,
                     "defaultValue": Characteristic.CurrentMediaState.STOP
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name,
                    CMD4_ACC_TYPE_ENUM.ConfiguredName,
                    CMD4_ACC_TYPE_ENUM.Volume,
                    CMD4_ACC_TYPE_ENUM.Mute
                  ],
               defaultPollingCharacteristics:
                  []
             },
         47: { deviceName:'SmokeSensor',
               service: Service.SmokeSensor,
               defaultCategory: Categories.SENSOR,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SmokeDetected,
                     "defaultValue": Characteristic.SmokeDetected.SMOKE_NOT_DETECTED
                    }
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
         48: { deviceName:'Speaker',
               service: Service.Speaker,
               defaultCategory: Categories.SPEAKER,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.Mute,
                     "defaultValue": true                             // Format: Bool, 0 - Mute is off, 1 - Mute is on
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Volume,
                    CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Mute
                  ]
             },
         49: { deviceName:'StatefulProgrammableSwitch',
               service: Service.StatefulProgrammableSwitch,
               defaultCategory: Categories.SWITCH,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                     "defaultValue": Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState,
                     "defaultValue": 0                                // Range: 0 - 1. Step: 1
                    }                                                 // Format: Uint8
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
                  ]
             },
         50: { deviceName:'StatelessProgrammableSwitch',
               service: Service.StatelessProgrammableSwitch,
               defaultCategory: Categories.SWITCH,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                     "defaultValue": Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name,
                    CMD4_ACC_TYPE_ENUM.ServiceLabelIndex
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
                  ]
             },
         51: { deviceName:'Switch',
               service: Service.Switch,
               defaultCategory: Categories.SWITCH,
               devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.On,
                     "defaultValue": false                            // Format: Bool
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.On
                  ]
             },
         52: { deviceName:'TargetControl',
               service: Service.TargetControl,
               defaultCategory: Categories.TARGET_CONTROLLER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ActiveIdentifier,
                     "defaultValue": 7                               // Format: UINT32
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.Active,
                     "defaultValue": Characteristic.Active.ACTIVE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.ButtonEvent,
                     "defaultValue": 0      // TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  []
             },
         53: { deviceName:'TargetControlManagement',
               service: Service.TargetControlManagement,
               defaultCategory: Categories.TARGET_CONTROLLER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.TargetControlSupportedConfiguration,
                     "defaultValue": 0   // tlv8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.TargetControlList,
                     "defaultValue": 0   // tlv8
                    }
                  ],
               optionalCharacteristics:
                  [], // None
               defaultPollingCharacteristics:
                  []
             },
         54: { deviceName:'Television',
               service: Service.Television,
               defaultCategory: Categories.TELEVISION,
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
         55: { deviceName:'TelevisionSpeaker',
               service: Service.TelevisionSpeaker,
               defaultCategory: Categories.AUDIO_RECEIVER,
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
         56: { deviceName:'TemperatureSensor',
               service: Service.TemperatureSensor,
               defaultCategory: Categories.SWITCH,
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
         57: { deviceName:'Thermostat',
               service: Service.Thermostat,
               defaultCategory: Categories.THERMOSTAT,
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
         58: { deviceName:'TimeInformation',
               service: Service.TimeInformation,
               defaultCategory: Categories.OTHER,
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
         59: { deviceName:'TransferTransportManagement',
               service: Service.TransferTransportManagement,
               defaultCategory: Categories.OTHER,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.SupportedTransferTransportConfiguration,
                     "defaultValue": 0   // tlv8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SetupTransferTransport,
                     "defaultValue": 0   // tlv8
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         60: { deviceName:'TunneledBTLEAccessoryService',
               service: Service.TunneledBTLEAccessoryService,
               defaultCategory: Categories.OTHER,
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
         61: { deviceName:'Valve',
               service: Service.Valve,
               defaultCategory: Categories.FAUCET,
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
         62: { deviceName:'WiFiRouter',
               service: Service.WiFiRouter,
               defaultCategory: Categories.AIRPORT,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':         CMD4_ACC_TYPE_ENUM.ConfiguredName,
                     "defaultValue": "My_WiFiRouter"
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.ManagedNetworkEnable,
                     "defaultValue": 0  // DISABLE
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.NetworkAccessViolationControl,
                     "defaultValue": 0  // TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.NetworkClientProfileControl,
                     "defaultValue": 0  // TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.NetworkClientStatusControl,
                     "defaultValue": 0  // TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.RouterStatus,
                     "defaultValue": 0   // READY
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.SupportedRouterConfiguration,
                     "defaultValue": 0  // TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.WANConfigurationList,
                     "defaultValue": 0  // TLV8
                    },
                    {'type':         CMD4_ACC_TYPE_ENUM.WANStatusList,
                     "defaultValue": 0
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         63: { deviceName:'WiFiSatellite',
               service: Service.WiFiSatellite,
               defaultCategory: Categories.TV_SET_TOP_BOX,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {'type':          CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus,
                     "defaultSValue": 2   // NOT_CONNECTED
                    }
                  ],
               optionalCharacteristics:
                  [],
               defaultPollingCharacteristics:
                  []
             },
         64: { deviceName:'Window',
               service: Service.Window,
               defaultCategory: Categories.WINDOW,
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
         65: { deviceName:'WindowCovering',
               service: Service.WindowCovering,
               defaultCategory: Categories.WINDOW_COVERING,
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
