'use strict';

const SLOW_STATE_CHANGE_RESPONSE_TIME   = 10000;  // 10 seconds
const MEDIUM_STATE_CHANGE_RESPONSE_TIME = 3000;   // 3 seconds
const FAST_STATE_CHANGE_RESPONSE_TIME   = 1000;   // 1 second


var CMD4_DEVICE_TYPE_ENUM =
{
   AccessControl:                       0,
   AccessoryRuntimeInformation:         1,
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
               UUID: "000000DA-0000-1000-8000-0026BB765291",
               service: Service.AccessControl,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.AccessControlLevel,
                     defaultValue:   0         // min 0, max 2
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.PasswordSetting
                  ],
               defaultPollingCharacteristics:
                  []
             },
         1:  { deviceName:'AccessoryRuntimeInformation',
               UUID: "00000239-0000-1000-8000-0026BB765291",
               service: Service.AccessoryRuntimeInformation,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Ping,
                     defaultValue:   0         // Type is DATA, therefore Who Knows
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
               UUID: "0000003E-0000-1000-8000-0026BB765291",
               service: Service.AccessoryInformation,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Identify,
                     defaultValue:   1 },                         // Format: Bool
                    {type:           CMD4_ACC_TYPE_ENUM.Manufacturer,
                     defaultValue:   'Cmd4' },                       // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.Model,
                     defaultValue:   'Model' },                      // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.Name,
                     defaultValue:   'My_AccessoryInformation' },
                    {type:           CMD4_ACC_TYPE_ENUM.SerialNumber,
                     defaultValue:   'ABC001' },                     // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.FirmwareRevision,
                     defaultValue:   '100.1.1' }                     // Format: String
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
               UUID: "000000BB-0000-1000-8000-0026BB765291",
               service: Service.AirPurifier,
               defaultCategory: Categories.AIR_PURIFIER,
               publishExternally: false,
               devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState,
                     defaultValue:   Characteristic.CurrentAirPurifierState.PURIFYING_AIR },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetAirPurifierState,
                     defaultValue:   Characteristic.TargetAirPurifierState.AUTO }
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
               UUID: "0000008D-0000-1000-8000-0026BB765291",
               service: Service.AirQualitySensor,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.AirQuality,
                     defaultValue:   Characteristic.AirQuality.GOOD }
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
               UUID: "00000096-0000-1000-8000-0026BB765291",
               service: Service.BatteryService,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.BatteryLevel,
                     defaultValue:   50 },                           // Range 0-100
                    {type:           CMD4_ACC_TYPE_ENUM.ChargingState,
                     defaultValue:   Characteristic.ChargingState.NOT_CHARGING },
                    {type:           CMD4_ACC_TYPE_ENUM.StatusLowBattery,
                     defaultValue:   Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.StatusLowBattery
                  ]
             },
         6:  { deviceName:'BridgeConfiguration',
               UUID: "000000A1-0000-1000-8000-0026BB765291",
               service: Service.BridgeConfiguration,
               defaultCategory: Categories.BRIDGE,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ConfigureBridgedAccessoryStatus,
                     defaultValue:   0 }                             // Format: TLV8
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
               UUID: "00000062-0000-1000-8000-0026BB765291",
               service: Service.BridgingState,
               defaultCategory: Categories.BRIDGE,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Reachable,
                     defaultValue:   1 },                         // Format: Bool
                    {type:           CMD4_ACC_TYPE_ENUM.LinkQuality,
                     defaultValue:   1 },                            // Format: Uint8
                                                                     // Range: 1-4, Step: 1
                    {type:           CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                     defaultValue:   "id999" },                      // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.Category,
                     defaultValue:   16 }                            // Format: Uint16
                                                                     // Range: 1-16, Step 1
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Reachable
                  ]
             },
         8:  { deviceName:'CameraEventRecordingManagement',
               UUID: "00000204-0000-1000-8000-0026BB765291",
               service: Service.CameraEventRecordingManagement,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedCameraRecordingConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedVideoRecordingConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedAudioRecordingConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SelectedCameraRecordingConfiguration,
                     defaultValue:   0                               // Format: TLV8
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
               UUID: "00000111-0000-1000-8000-0026BB765291",
               service: Service.CameraControl,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   1 }                          // Format: Bool
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
               UUID: "00000110-0000-1000-8000-0026BB765291",
               service: Service.CameraRTPStreamManagement,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SupportedVideoStreamConfiguration,
                     defaultValue:   0 },                            // Format: TLV8
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedAudioStreamConfiguration,
                     defaultValue:   0 },                            // Format: TLV8
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedRTPConfiguration,
                     defaultValue:   0 },                            // Format: TLV8
                    {type:           CMD4_ACC_TYPE_ENUM.SelectedRTPStreamConfiguration,
                     defaultValue:   0 },                            // Format: TLV8
                    {type:           CMD4_ACC_TYPE_ENUM.StreamingStatus,
                     defaultValue:   0 },                            // Format: TLV8
                    {type:           CMD4_ACC_TYPE_ENUM.SetupEndpoints,
                     defaultValue:   0 }                             // Format: TLV8
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [
                  ]
             },
         11: { deviceName:'CameraOperatingMode',
               UUID: "0000021A-0000-1000-8000-0026BB765291",
               service: Service.CameraOperatingMode,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.EventSnapshotsActive,
                     defaultValue:   Characteristic.EventSnapshotsActive.DISABLE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.HomeKitCameraActive,
                     defaultValue:   Characteristic.HomeKitCameraActive.OFF
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
               UUID: "00000097-0000-1000-8000-0026BB765291",
               service: Service.CarbonDioxideSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CarbonDioxideDetected,
                     defaultValue:   Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL
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
               UUID: "0000007F-0000-1000-8000-0026BB765291",
               service: Service.CarbonMonoxideSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CarbonMonoxideDetected,
                     defaultValue:   Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL }
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
               UUID: "00000080-0000-1000-8000-0026BB765291",
               service: Service.ContactSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ContactSensorState,
                     defaultValue:   Characteristic.ContactSensorState.CONTACT_NOT_DETECTED }
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
         15: { deviceName:'Diagnostics',
               UUID: "00000237-0000-1000-8000-0026BB765291",
               service: Service.Diagnostics,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SupportedDiagnosticsSnapshot,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         16: { deviceName:'Door',
               UUID: "00000081-0000-1000-8000-0026BB765291",
               service: Service.Door,
               defaultCategory: Categories.DOOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentPosition,
                     defaultValue:   0                               // Range 0 - 100
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.PositionState,
                     defaultValue:   Characteristic.PositionState.STOPPED
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetPosition,
                     defaultValue:   0                               // Range 0 - 100
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
               UUID: "00000121-0000-1000-8000-0026BB765291",
               service: Service.Doorbell,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                     defaultValue:   Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS }
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
               UUID: "00000040-0000-1000-8000-0026BB765291",
               service: Service.Fan,
               defaultCategory: Categories.FAN,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   0                           // Format: Bool
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
               UUID: "00000040-0000-1000-8000-0026BB765291",
               service: Service.Fan,
               defaultCategory: Categories.FAN,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   0                           // Format: Bool
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
               UUID: "000000B7-0000-1000-8000-0026BB765291",
               service: Service.Fanv2,
               defaultCategory: Categories.FAN,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE }
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
               UUID: "000000D7-0000-1000-8000-0026BB765291",
               service: Service.Faucet,
               defaultCategory: Categories.FAUCET,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
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
               UUID: "000000BA-0000-1000-8000-0026BB765291",
               service: Service.FilterMaintenance,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.FilterChangeIndication,
                     defaultValue:   Characteristic.FilterChangeIndication.FILTER_OK
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
               UUID: "00000041-0000-1000-8000-0026BB765291",
               service: Service.GarageDoorOpener,
               defaultCategory: Categories.GARAGE_DOOR_OPENER,
               publishExternally: false,
               devicesStateChangeDefaultTime:SLOW_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                     defaultValue:   Characteristic.CurrentDoorState.OPEN },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetDoorState,
                     defaultValue:   Characteristic.TargetDoorState.OPEN },
                    {type:           CMD4_ACC_TYPE_ENUM.ObstructionDetected,
                     defaultValue:   1 }                          // Format: Bool
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
               UUID: "000000BC-0000-1000-8000-0026BB765291",
               service: Service.HeaterCooler,
               defaultCategory: Categories.AIR_HEATER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                     defaultValue:   Characteristic.CurrentHeaterCoolerState.INACTIVE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                     defaultValue:   Characteristic.TargetHeaterCoolerState.HEAT
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                     defaultValue:   50.0                            // Range:  0 - 100, Step: 0.1
                    }                                                // Format: float
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
               UUID: "000000BD-0000-1000-8000-0026BB765291",
               service: Service.HumidifierDehumidifier,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                     defaultValue:   60                              // Range:  0 - 100, Step: 1
                    },                                               // Format: float
                                                                     // Units:  CELCIUS
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                     defaultValue:   Characteristic.CurrentHumidifierDehumidifierState.IDLE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                     defaultValue:   Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
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
               UUID: "00000082-0000-1000-8000-0026BB765291",
               service: Service.HumiditySensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                     defaultValue:   60                              // Range:  0 - 100, Step: 1
                    }                                                // Format: float
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
               UUID: "000000D9-0000-1000-8000-0026BB765291",
               service: Service.InputSource,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ConfiguredName,
                     defaultValue:   "My_InputSource"                // Format: String
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.InputSourceType,
                     defaultValue:   Characteristic.InputSourceType.HOME_SCREEN
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.IsConfigured,
                     defaultValue:   Characteristic.IsConfigured.CONFIGURED
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentVisibilityState,
                     defaultValue:   Characteristic.CurrentVisibilityState.SHOWN
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
               UUID: "000000CF-0000-1000-8000-0026BB765291",
               service: Service.IrrigationSystem,
               defaultCategory: Categories.SPRINKLER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE },
                    {type:           CMD4_ACC_TYPE_ENUM.ProgramMode,
                      defaultValue:  Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED },
                    {type:           CMD4_ACC_TYPE_ENUM.InUse,
                     defaultValue:   Characteristic.InUse.IN_USE },
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
               UUID: "00000083-0000-1000-8000-0026BB765291",
               service: Service.LeakSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.LeakDetected,
                     defaultValue:   Characteristic.LeakDetected.LEAK_NOT_DETECTED
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
               UUID: "00000084-0000-1000-8000-0026BB765291",
               service: Service.LightSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentAmbientLightLevel,
                     defaultValue:   1                               // Range:  0.0001 - 100000
                    }                                                // Format: float
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
               UUID: "00000043-0000-1000-8000-0026BB765291",
               service: Service.Lightbulb,
               defaultCategory: Categories.LIGHTBULB,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   0 }                         // Format: float
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
               UUID: "00000044-0000-1000-8000-0026BB765291",
               service: Service.LockManagement,
               defaultCategory: Categories.ALARM_SYSTEM,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.LockControlPoint,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.Version,
                     defaultValue:   '0.0.0'                         // Format: String
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
               UUID: "00000045-0000-1000-8000-0026BB765291",
               service: Service.LockMechanism,
               defaultCategory: Categories.DOOR_LOCK,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.LockCurrentState,
                     defaultValue:   Characteristic.LockCurrentState.UNSECURED },
                    {type:           CMD4_ACC_TYPE_ENUM.LockTargetState,
                     defaultValue:   Characteristic.LockTargetState.UNSECURED },
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.LockCurrentState
                  ]
             },
         34: { deviceName:'Microphone',
               UUID: "00000112-0000-1000-8000-0026BB765291",
               service: Service.Microphone,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Mute,
                     defaultValue:   0                           // Format: Bool,
                    }                                                // 0 - Mute is off
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
               UUID: "00000085-0000-1000-8000-0026BB765291",
               service: Service.MotionSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.MotionDetected,
                     defaultValue:   1                            // Format: Bool
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
               UUID: "00000086-0000-1000-8000-0026BB765291",
               service: Service.OccupancySensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.OccupancyDetected,
                     defaultValue:   Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED
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
               UUID: "00000047-0000-1000-8000-0026BB765291",
               service: Service.Outlet,
               defaultCategory: Categories.OUTLET,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   0                           // Format: Bool
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.OutletInUse,
                     defaultValue:   0                           // Format: Bool
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
               UUID: "00000055-0000-1000-8000-0026BB765291",
               service: Service.Pairing,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.PairingFeatures,
                     defaultValue:   1                               // Format: Uint8. Values ???
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.PairVerify,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.PairingFeatures,
                     defaultValue:   0                               // Format: Uint8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.PairingPairings,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.PairingFeatures
                  ]
             },
         39: { deviceName:'PowerManagement',
               UUID: "00000221-0000-1000-8000-0026BB765291",
               service: Service.PowerManagement,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.WakeConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         40: { deviceName:'ProtocolInformation',
               UUID: "000000A2-0000-1000-8000-0026BB765291",
               service: Service.ProtocolInformation,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Version,
                     defaultValue:   '1.2.3'                         // Format: String
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Version
                  ]
             },
         41: { deviceName:'Relay',
               UUID: "0000005A-0000-1000-8000-0026BB765291",
               service: Service.Relay,
               defaultCategory: Categories.SWITCH,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.RelayEnabled,
                     defaultValue:   1                            // Format: Bool
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.RelayState,
                     defaultValue:   1                               // Format: uint8, Values ???
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.RelayControlPoint,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.RelayEnabled,
                    CMD4_ACC_TYPE_ENUM.RelayState,
                  ]
             },
         42: { deviceName:'SecuritySystem',
               UUID: "0000007E-0000-1000-8000-0026BB765291",
               service: Service.SecuritySystem,
               defaultCategory: Categories.SECURITY_SYSTEM,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                     defaultValue:   Characteristic.SecuritySystemCurrentState.DISARMED
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState,
                     defaultValue:   Characteristic.SecuritySystemTargetState.DISARM
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
               UUID: "000000CC-0000-1000-8000-0026BB765291",
               service: Service.ServiceLabel,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ServiceLabelNamespace,
                     defaultValue:   Characteristic.ServiceLabelNamespace.DOTS
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
               UUID: "00000133-0000-1000-8000-0026BB765291",
               service: Service.Siri,
               defaultCategory: Categories.HOMEPOD,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SiriInputType,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         45: { deviceName:'Slat',
               UUID: "000000B9-0000-1000-8000-0026BB765291",
               service: Service.Slat,
               defaultCategory: Categories.WINDOW_COVERING,
               publishExternally: false,
               devicesStateChangeDefaultTimeb:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SlatType,
                     defaultValue:   Characteristic.SlatType.HORIZONTAL },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentSlatState,
                     defaultValue:   Characteristic.CurrentSlatState.FIXED }
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
               UUID: "00000228-0000-1000-8000-0026BB765291",
               service: Service.SmartSpeaker,
               defaultCategory: Categories.HOMEPOD,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                     defaultValue:   Characteristic.CurrentMediaState.STOP
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetMediaState,
                     defaultValue:   Characteristic.CurrentMediaState.STOP
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
               UUID: "00000087-0000-1000-8000-0026BB765291",
               service: Service.SmokeSensor,
               defaultCategory: Categories.SENSOR,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SmokeDetected,
                     defaultValue:   Characteristic.SmokeDetected.SMOKE_NOT_DETECTED
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
               UUID: "00000113-0000-1000-8000-0026BB765291",
               service: Service.Speaker,
               defaultCategory: Categories.SPEAKER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Mute,
                     defaultValue:   0                            // Format: Bool, 0 - Mute is off, 1 - Mute is on
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
               UUID: "00000088-0000-1000-8000-0026BB765291",
               service: Service.StatefulProgrammableSwitch,
               defaultCategory: Categories.SWITCH,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                     defaultValue:   Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.ProgrammableSwitchOutputState,
                     defaultValue:   0                               // Range: 0 - 1. Step: 1
                    }                                                // Format: Uint8
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent
                  ]
             },
         50: { deviceName:'StatelessProgrammableSwitch',
               UUID: "00000089-0000-1000-8000-0026BB765291",
               service: Service.StatelessProgrammableSwitch,
               defaultCategory: Categories.SWITCH,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ProgrammableSwitchEvent,
                     defaultValue:   Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS
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
               UUID: "00000049-0000-1000-8000-0026BB765291",
               service: Service.Switch,
               defaultCategory: Categories.SWITCH,
               publishExternally: false,
               devicesStateChangeDefaultTime:FAST_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.On,
                     defaultValue:   0                           // Format: Bool
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
               UUID: "00000125-0000-1000-8000-0026BB765291",
               service: Service.TargetControl,
               defaultCategory: Categories.TARGET_CONTROLLER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ActiveIdentifier,
                     defaultValue:   7                               // Format: UINT32
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.ButtonEvent,
                     defaultValue:   0      // TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  []
             },
         53: { deviceName:'TargetControlManagement',
               UUID: "00000122-0000-1000-8000-0026BB765291",
               service: Service.TargetControlManagement,
               defaultCategory: Categories.TARGET_CONTROLLER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.TargetControlSupportedConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetControlList,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         54: { deviceName:'Television',
               UUID: "000000D8-0000-1000-8000-0026BB765291",
               service: Service.Television,
               defaultCategory: Categories.TELEVISION,
               publishExternally: true,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.ActiveIdentifier,
                     defaultValue:   123
                    },                                               // Format: Uint32
                    {type:           CMD4_ACC_TYPE_ENUM.ConfiguredName,
                     defaultValue:   'My_Tv',
                    },                                               // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.RemoteKey,
                     defaultValue:   Characteristic.RemoteKey.SELECT
                    },                                               // Format: uint8
                    {type:           CMD4_ACC_TYPE_ENUM.SleepDiscoveryMode,
                     defaultValue:   Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
                    }
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Brightness,
                    CMD4_ACC_TYPE_ENUM.ClosedCaptions,
                    CMD4_ACC_TYPE_ENUM.DisplayOrder,
                    CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                    CMD4_ACC_TYPE_ENUM.TargetMediaState,
                    CMD4_ACC_TYPE_ENUM.PictureMode,
                    CMD4_ACC_TYPE_ENUM.PowerModeSelection
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Active
                  ]
             },
         55: { deviceName:'TelevisionSpeaker',
               UUID: "00000113-0000-1000-8000-0026BB765291",
               service: Service.TelevisionSpeaker,
               defaultCategory: Categories.AUDIO_RECEIVER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Mute,
                     defaultValue:   0 }                         // Format: Bool
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
               UUID: "0000008A-0000-1000-8000-0026BB765291",
               service: Service.TemperatureSensor,
               defaultCategory: Categories.SWITCH,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                     defaultValue:   50.0 }                          // Range:  0 - 100, Step: 0.1
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
               UUID: "0000004A-0000-1000-8000-0026BB765291",
               service: Service.Thermostat,
               defaultCategory: Categories.THERMOSTAT,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState,
                     defaultValue:   Characteristic.CurrentHeatingCoolingState.OFF, },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState,
                     defaultValue:   Characteristic.TargetHeatingCoolingState.OFF },
                    {type:           CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                     defaultValue:   50.0 },                         // Range:  0 - 100, Step: 0.1
                                                                     // Format: float
                                                                     // Units:  CELCIUS
                    {type:           CMD4_ACC_TYPE_ENUM.TargetTemperature,
                     defaultValue:   50.0 },                         // Range:  0 - 100, Step: 0.1
                                                                     // Format: float
                                                                     // Units:  CELCIUS
                    {type:           CMD4_ACC_TYPE_ENUM.TemperatureDisplayUnits,
                     defaultValue:   Characteristic.TemperatureDisplayUnits.CELSIUS }
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
               UUID: "00000099-0000-1000-8000-0026BB765291",
               service: Service.TimeInformation,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentTime,
                     defaultValue:   '11:15' },                      // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.DayoftheWeek,
                     defaultValue:   1 },                            // Range:  1 - 7
                    {type:           CMD4_ACC_TYPE_ENUM.TimeUpdate,
                     defaultValue:   0 }                         // Format: Bool
                  ],
               optionalCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.Name
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.CurrentTime
                  ]
             },
         59: { deviceName:'TransferTransportManagement',
               UUID: "00000203-0000-1000-8000-0026BB765291",
               service: Service.TransferTransportManagement,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.SupportedTransferTransportConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SetupTransferTransport,
                     defaultValue:   0                               // Format: TLV8
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         60: { deviceName:'TunneledBTLEAccessoryService',
               UUID: "00000056-0000-1000-8000-0026BB765291",
               service: Service.TunneledBTLEAccessoryService,
               defaultCategory: Categories.OTHER,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Name,
                     defaultValue:  'My_TunnelB' },                  // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.AccessoryIdentifier,
                     defaultValue:  'TLB' },                         // Format: String
                    {type:           CMD4_ACC_TYPE_ENUM.TunneledAccessoryStateNumber,
                     defaultValue:   0.0 },                          // Format: float
                    {type:           CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected,
                     defaultValue:   0 },                        // Format: Bool
                    {type:           CMD4_ACC_TYPE_ENUM.TunneledAccessoryAdvertising,
                     defaultValue:   0 },                        // Format: Bool
                    {type:           CMD4_ACC_TYPE_ENUM.TunnelConnectionTimeout,
                     defaultValue:   5000 }                          // Format: Uint32
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  [ CMD4_ACC_TYPE_ENUM.TunneledAccessoryConnected
                  ]
             },
         61: { deviceName:'Valve',
               UUID: "000000D0-0000-1000-8000-0026BB765291",
               service: Service.Valve,
               defaultCategory: Categories.FAUCET,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.Active,
                     defaultValue:   Characteristic.Active.ACTIVE },
                    {type:           CMD4_ACC_TYPE_ENUM.InUse,
                     defaultValue:   Characteristic.InUse.IN_USE },
                    {type:           CMD4_ACC_TYPE_ENUM.ValveType,
                     defaultValue:   Characteristic.ValveType.GENERIC_VALVE }
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
               UUID: "0000020A-0000-1000-8000-0026BB765291",
               service: Service.WiFiRouter,
               defaultCategory: Categories.AIRPORT,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.ConfiguredName,
                     defaultValue:   "My_WiFiRouter"
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.ManagedNetworkEnable,
                     defaultValue:   0                               // DISABLE
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.NetworkAccessViolationControl,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.NetworkClientProfileControl,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.NetworkClientStatusControl,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.RouterStatus,
                     defaultValue:   0                               // READY
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.SupportedRouterConfiguration,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.WANConfigurationList,
                     defaultValue:   0                               // Format: TLV8
                    },
                    {type:           CMD4_ACC_TYPE_ENUM.WANStatusList,
                     defaultValue:   0
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         63: { deviceName:'WiFiSatellite',
               UUID: "0000020F-0000-1000-8000-0026BB765291",
               service: Service.WiFiSatellite,
               defaultCategory: Categories.TV_SET_TOP_BOX,
               publishExternally: false,
               deviceStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:            CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus,
                     defaultValue:    2   // NOT_CONNECTED
                    }
                  ],
               optionalCharacteristics:
                  [ // None
                  ],
               defaultPollingCharacteristics:
                  []
             },
         64: { deviceName:'Window',
               UUID: "0000008B-0000-1000-8000-0026BB765291",
               service: Service.Window,
               defaultCategory: Categories.WINDOW,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentPosition,
                     defaultValue:   0 },                            // Range: 0 - 100, Step: 1
                    {type:           CMD4_ACC_TYPE_ENUM.PositionState,
                     defaultValue:  Characteristic.PositionState.STOPPED },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetPosition,
                     defaultValue:   0 }                             // Range: 0 - 100, Step: 1
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
               UUID: "0000008C-0000-1000-8000-0026BB765291",
               service: Service.WindowCovering,
               defaultCategory: Categories.WINDOW_COVERING,
               publishExternally: false,
               devicesStateChangeDefaultTime:MEDIUM_STATE_CHANGE_RESPONSE_TIME,
               requiredCharacteristics:
                  [ {type:           CMD4_ACC_TYPE_ENUM.CurrentPosition,
                     defaultValue:   0 },                            // Range: 0 - 100, Step: 1
                    {type:           CMD4_ACC_TYPE_ENUM.PositionState,
                      defaultValue:  Characteristic.PositionState.STOPPED },
                    {type:           CMD4_ACC_TYPE_ENUM.TargetPosition,
                     defaultValue:   0 }                             // Range: 0 - 100, Step: 1
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
