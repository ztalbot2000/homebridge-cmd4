'use strict';

function stringToBool( str )
{
   str += '';
   str = str.toUpperCase( );
   if ( str == "0" || str == "FALSE" ) return false;
   if ( str == "1" || str == "TRUE" ) return true;

   return undefined;
}
function stringToFloat( str )
{
   if ( !isNaN( str ) )
   {
      let rc = parseFloat( str );
      if ( ! isNaN( rc ) )
         return rc;
   }
   return undefined;
}
function stringToInt( str )
{
   str += '';

   // Convert it to a Number, no matter what
   let result = Number( str );

   if ( typeof result == "number" )
      return result;

   return undefined;
}
function stringToString( str )
{
   if ( typeof str == "string" )
      return str;
   // more or less to pass previous testcases
   if ( typeof str == "number" )
      return str += '';

   return undefined;
}
function stringPassThru( str )
{
   return str;
}
function stringToTLV8( str )
{
   return undefined;
}


var CMD4_ACC_TYPE_ENUM =
{
   AccessControlLevel:                      0,
   AccessoryFlags:                          1,
   AccessoryIdentifier:                     2,
   Active:                                  3,
   ActiveIdentifier:                        4,
   ActivityInterval:                        5,
   AdministratorOnlyAccess:                 6,
   AirParticulateDensity:                   7,
   AirParticulateSize:                      8,
   AirQuality:                              9,
   AppMatchingIdentifier:                   10,
   AudioFeedback:                           11,
   BatteryLevel:                            12,
   Brightness:                              13,
   ButtonEvent:                             14,
   CCAEnergyDetectThreshold:                15,
   CCASignalDetectThreshold:                16,
   CameraOperatingModeIndicator:            17,
   CarbonDioxideDetected:                   18,
   CarbonDioxideLevel:                      19,
   CarbonDioxidePeakLevel:                  20,
   CarbonMonoxideDetected:                  21,
   CarbonMonoxideLevel:                     22,
   CarbonMonoxidePeakLevel:                 23,
   Category:                                24,
   CharacteristicValueTransitionControl:    25,
   ChargingState:                           26,
   ClosedCaptions:                          27,
   ColorTemperature:                        28,
   ConfigureBridgedAccessory:               29,
   ConfigureBridgedAccessoryStatus:         30,
   ConfiguredName:                          31,
   ContactSensorState:                      32,
   CoolingThresholdTemperature:             33,
   CurrentAirPurifierState:                 34,
   CurrentAmbientLightLevel:                35,
   CurrentDoorState:                        36,
   CurrentFanState:                         37,
   CurrentHeaterCoolerState:                38,
   CurrentHeatingCoolingState:              39,
   CurrentHorizontalTiltAngle:              40,
   CurrentHumidifierDehumidifierState:      41,
   CurrentMediaState:                       42,
   CurrentPosition:                         43,
   CurrentRelativeHumidity:                 44,
   CurrentSlatState:                        45,
   CurrentTemperature:                      46,
   CurrentTiltAngle:                        47,
   CurrentTime:                             48,
   CurrentTransport:                        49,
   CurrentVerticalTiltAngle:                50,
   CurrentVisibilityState:                  51,
   DataStreamHAPTransport:                  52,
   DataStreamHAPTransportInterrupt:         53,
   DayoftheWeek:                            54,
   DiagonalFieldOfView:                     55,
   DigitalZoom:                             56,
   DiscoverBridgedAccessories:              57,
   DiscoveredBridgedAccessories:            58,
   DisplayOrder:                            59,
   EventRetransmissionMaximum:              60,
   EventSnapshotsActive:                    61,
   EventTransmissionCounters:               62,
   FilterChangeIndication:                  63,
   FilterLifeLevel:                         64,
   FirmwareRevision:                        65,
   HardwareRevision:                        66,
   HeartBeat:                               67,
   HeatingThresholdTemperature:             68,
   HoldPosition:                            69,
   HomeKitCameraActive:                     70,
   Hue:                                     71,
   Identifier:                              72,
   Identify:                                73,
   ImageMirroring:                          74,
   ImageRotation:                           75,
   InUse:                                   76,
   InputDeviceType:                         77,
   InputSourceType:                         78,
   IsConfigured:                            79,
   LeakDetected:                            80,
   LinkQuality:                             81,
   LockControlPoint:                        82,
   LockCurrentState:                        83,
   LockLastKnownAction:                     84,
   LockManagementAutoSecurityTimeout:       85,
   LockPhysicalControls:                    86,
   LockTargetState:                         87,
   Logs:                                    88,
   MACRetransmissionMaximum:                89,
   MACTransmissionCounters:                 90,
   ManagedNetworkEnable:                    91,
   ManuallyDisabled:                        92,
   Manufacturer:                            93,
   Model:                                   94,
   MotionDetected:                          95,
   Mute:                                    96,
   Name:                                    97,
   NetworkAccessViolationControl:           98,
   NetworkClientProfileControl:             99,
   NetworkClientStatusControl:              100,
   NightVision:                             101,
   NitrogenDioxideDensity:                  102,
   ObstructionDetected:                     103,
   OccupancyDetected:                       104,
   On:                                      105,
   OperatingStateResponse:                  106,
   OpticalZoom:                             107,
   OutletInUse:                             108,
   OzoneDensity:                            109,
   PM10Density:                             110,
   PM2_5Density:                            111,
   PairSetup:                               112,
   PairVerify:                              113,
   PairingFeatures:                         114,
   PairingPairings:                         115,
   PasswordSetting:                         116,
   PeriodicSnapshotsActive:                 117,
   PictureMode:                             118,
   Ping:                                    119,
   PositionState:                           120,
   PowerModeSelection:                      121,
   ProductData:                             122,
   ProgramMode:                             123,
   ProgrammableSwitchEvent:                 124,
   ProgrammableSwitchOutputState:           125,
   Reachable:                               126,
   ReceivedSignalStrengthIndication:        127,
   ReceiverSensitivity:                     128,
   RecordingAudioActive:                    129,
   RelativeHumidityDehumidifierThreshold:   130,
   RelativeHumidityHumidifierThreshold:     131,
   RelayControlPoint:                       132,
   RelayEnabled:                            133,
   RelayState:                              134,
   RemainingDuration:                       135,
   RemoteKey:                               136,
   ResetFilterIndication:                   137,
   RotationDirection:                       138,
   RotationSpeed:                           139,
   RouterStatus:                            140,
   Saturation:                              141,
   SecuritySystemAlarmType:                 142,
   SecuritySystemCurrentState:              143,
   SecuritySystemTargetState:               144,
   SelectedAudioStreamConfiguration:        145,
   SelectedCameraRecordingConfiguration:    146,
   SelectedRTPStreamConfiguration:          147,
   SerialNumber:                            148,
   ServiceLabelIndex:                       149,
   ServiceLabelNamespace:                   150,
   SetDuration:                             151,
   SetupDataStreamTransport:                152,
   SetupEndpoints:                          153,
   SetupTransferTransport:                  154,
   SignalToNoiseRatio:                      155,
   SiriInputType:                           156,
   SlatType:                                157,
   SleepDiscoveryMode:                      158,
   SleepInterval:                           159,
   SmokeDetected:                           160,
   SoftwareRevision:                        161,
   StatusActive:                            162,
   StatusFault:                             163,
   StatusJammed:                            164,
   StatusLowBattery:                        165,
   StatusTampered:                          166,
   StreamingStatus:                         167,
   SulphurDioxideDensity:                   168,
   SupportedAudioRecordingConfiguration:    169,
   SupportedAudioStreamConfiguration:       170,
   SupportedCameraRecordingConfiguration:   171,
   SupportedCharacteristicValueTransitionConfiguration:    172,
   SupportedDataStreamTransportConfiguration:   173,
   SupportedDiagnosticsSnapshot:            174,
   SupportedRTPConfiguration:               175,
   SupportedRouterConfiguration:            176,
   SupportedTransferTransportConfiguration: 177,
   SupportedVideoRecordingConfiguration:    178,
   SupportedVideoStreamConfiguration:       179,
   SwingMode:                               180,
   TargetAirPurifierState:                  181,
   TargetAirQuality:                        182,
   TargetControlList:                       183,
   TargetControlSupportedConfiguration:     184,
   TargetDoorState:                         185,
   TargetFanState:                          186,
   TargetHeaterCoolerState:                 187,
   TargetHeatingCoolingState:               188,
   TargetHorizontalTiltAngle:               189,
   TargetHumidifierDehumidifierState:       190,
   TargetMediaState:                        191,
   TargetPosition:                          192,
   TargetRelativeHumidity:                  193,
   TargetSlatState:                         194,
   TargetTemperature:                       195,
   TargetTiltAngle:                         196,
   TargetVerticalTiltAngle:                 197,
   TargetVisibilityState:                   198,
   TemperatureDisplayUnits:                 199,
   ThirdPartyCameraActive:                  200,
   TimeUpdate:                              201,
   TransmitPower:                           202,
   TransmitPowerMaximum:                    203,
   TunnelConnectionTimeout:                 204,
   TunneledAccessoryAdvertising:            205,
   TunneledAccessoryConnected:              206,
   TunneledAccessoryStateNumber:            207,
   VOCDensity:                              208,
   ValveType:                               209,
   Version:                                 210,
   VideoAnalysisActive:                     211,
   Volume:                                  212,
   VolumeControlType:                       213,
   VolumeSelector:                          214,
   WANConfigurationList:                    215,
   WANStatusList:                           216,
   WakeConfiguration:                       217,
   WaterLevel:                              218,
   WiFiCapabilities:                        219,
   WiFiConfigurationControl:                220,
   WiFiSatelliteStatus:                     221,
   EOL:                                     222,

   properties: {}
};

// Export both the init function and the uninitialized data for unit testing
module.exports =
{
   init: function (Characteristic)
   {

      // Fill in the properties of all possible characteristics
      // props was added because calling getCharacteridtic().props.perms adds
      // the characteristic in by default. This costs some lines, but is advantageous.
      CMD4_ACC_TYPE_ENUM.properties =
      {
         0:   { type: "AccessControlLevel",
                characteristic: Characteristic.AccessControlLevel,
                UUID: "000000E5-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT16,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         1:   { type: "AccessoryFlags",
                characteristic: Characteristic.AccessoryFlags,
                UUID: "000000A6-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         2:   { type: "AccessoryIdentifier",   // HomeKitTypes-Bridge
                characteristic: Characteristic.AccessoryIdentifier,
                UUID: "00000057-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                   perms: [Characteristic.Perms.READ
                          ]
                       },
                validValues: {}
              },
         3:   { type: "Active",
                characteristic:Characteristic.Active,
                UUID: "000000B0-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.Active,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.Active,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         4:   { type: "ActiveIdentifier",   // HomeKitTypes-Television
                characteristic: Characteristic.ActiveIdentifier,
                UUID: "000000E7-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         5:   { type: "ActivityInterval",   // HomeKit - Checke3d 11-19-2020
                characteristic: Characteristic.ActivityInterval,
                UUID: "0000023B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         6:   { type: "AdministratorOnlyAccess",
                characteristic: Characteristic.AdministratorOnlyAccess,
                UUID: "00000001-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.WRITE,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         7:   { type: "AirParticulateDensity",
                characteristic: Characteristic.AirParticulateDensity,
                UUID: "00000064-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                      maxValue: 1000,
                      minValue: 0,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         8:   { type: "AirParticulateSize",
                characteristic: Characteristic.AirParticulateSize,
                UUID: "00000065-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                      maxValue: 1,
                      minValue: 0,
                       minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020
                   {"_2_5_M": Characteristic.AirParticulateSize._2_5_M,
                    "_10_M":  Characteristic.AirParticulateSize._10_M
                   }
              },
         9:   { type: "AirQuality",
                characteristic: Characteristic.AirQuality,
                UUID: "00000095-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetAirQuality,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                      maxValue: 5,
                      minValue: 0,
                       minStep: 1,
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
         10:  { type: "AppMatchingIdentifier",
                characteristic: Characteristic.AppMatchingIdentifier,
                UUID: "000000A4-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                /* eslint no-unused-vars: ["error", {"args": "none"}] */
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues:   // Checked 11/20/2020
                   {}
              },
         11:  { type: "AudioFeedback",
                characteristic: Characteristic.AudioFeedback,
                UUID: "00000005-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         12:  { type: "BatteryLevel",
                characteristic: Characteristic.BatteryLevel,
                UUID: "00000068-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         13:  { type: "Brightness",
                characteristic: Characteristic.Brightness,
                UUID: "00000008-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         14:  { type: "ButtonEvent",
                characteristic: Characteristic.ButtonEvent,
                UUID: "00000126-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         15:  { type: "CCAEnergyDetectThreshold",
                characteristic: Characteristic.CCAEnergyDetectThreshold,
                UUID: "00000246-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         16:  { type: "CCASignalDetectThreshold",
                characteristic: Characteristic.CCASignalDetectThreshold,
                UUID: "00000245-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         17:  { type: "CameraOperatingModeIndicator",
                characteristic: Characteristic.CameraOperatingModeIndicator,
                UUID: "0000021D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE
                               ]
                       },
                validValues:
                       { "DISABLE": 0,
                         "ENABLE":  1
                       }
              },
         18:  { type: "CarbonDioxideDetected",
                characteristic: Characteristic.CarbonDioxideDetected,
                UUID: "00000092-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         19:  { type: "CarbonDioxideLevel",
                characteristic: Characteristic.CarbonDioxideLevel,
                UUID: "00000093-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100000,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         20:  { type: "CarbonDioxidePeakLevel",
                characteristic: Characteristic.CarbonDioxidePeakLevel,
                UUID: "00000094-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100000,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         21:  { type: "CarbonMonoxideDetected",
                characteristic: Characteristic.CarbonMonoxideDetected,
                UUID: "00000069-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         22:  { type: "CarbonMonoxideLevel",
                characteristic: Characteristic.CarbonMonoxideLevel,
                UUID: "00000090-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         23:  { type: "CarbonMonoxidePeakLevel",
                characteristic: Characteristic.CarbonMonoxidePeakLevel,
                UUID: "00000091-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         24:  { type: "Category",    // HomeKitTypes-Bridge
                characteristic: Characteristic.Category,
                UUID: "000000A3-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT16,
                        maxValue: 16,
                        minValue: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         25:  { type: "CharacteristicValueTransitionControl",    // HomeKit
                characteristic: Characteristic.CharacteristicValueTransitionControl,
                UUID: "00000143-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         26:  { type: "ChargingState",
                characteristic: Characteristic.ChargingState,
                UUID: "0000008F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         27:  { type: "ClosedCaptions",    // HomeKitTypes-Television
                characteristic: Characteristic.ClosedCaptions,
                UUID: "000000DD-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         28:  { type: "ColorTemperature",
                characteristic: Characteristic.ColorTemperature,
                UUID: "000000CE-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
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
         29:  { type: "ConfigureBridgedAccessory",    // HomeKitTypes-Bridge
                characteristic: Characteristic.ConfigureBridgedAccessory,
                UUID: "000000A0-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         30:  { type: "ConfigureBridgedAccessoryStatus",    // HomeKitTypes-Bridge
                characteristic: Characteristic.ConfigureBridgedAccessoryStatus,
                UUID: "0000009D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         31:  { type: "ConfiguredName",    // HomeKitTypes-Television
                characteristic: Characteristic.ConfiguredName,
                UUID: "000000E3-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         32:  { type: "ContactSensorState",
                characteristic: Characteristic.ContactSensorState,
                UUID: "0000006A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"CONTACT_DETECTED": Characteristic.ContactSensorState.CONTACT_DETECTED,
                    "CONTACT_NOT_DETECTED": Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                   }
              },
         33:  { type: "CoolingThresholdTemperature",
                characteristic: Characteristic.CoolingThresholdTemperature,
                UUID: "0000000D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         34:  { type: "CurrentAirPurifierState",
                characteristic: Characteristic.CurrentAirPurifierState,
                UUID: "000000A9-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetAirPurifierState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         35:  { type: "CurrentAmbientLightLevel",
                characteristic: Characteristic.CurrentAmbientLightLevel,
                UUID: "0000006B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         36:  { type: "CurrentDoorState",
                characteristic: Characteristic.CurrentDoorState,
                UUID: "0000000E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetDoorState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 4,
                        minValue: 0,
                        minStep: 1,
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
         37:  { type: "CurrentFanState",
                characteristic: Characteristic.CurrentFanState,
                UUID: "000000AF-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetFanState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         38:  { type: "CurrentHeaterCoolerState",
                characteristic: Characteristic.CurrentHeaterCoolerState,
                UUID: "000000B1-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         39:  { type: "CurrentHeatingCoolingState",
                characteristic: Characteristic.CurrentHeatingCoolingState,
                UUID: "0000000F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         40:  { type: "CurrentHorizontalTiltAngle",
                characteristic: Characteristic.CurrentHorizontalTiltAngle,
                UUID: "0000006C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         41:  { type: "CurrentHumidifierDehumidifierState",
                characteristic: Characteristic.CurrentHumidifierDehumidifierState,
                UUID: "000000B3-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         42:  { type: "CurrentMediaState",   // HomKitTypes-Television
                characteristic: Characteristic.CurrentMediaState,
                UUID: "000000E0-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetMediaState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 5,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                // HomeKit forgets to define these
                validValues: {"PLAY":        Characteristic.CurrentMediaState.PLAY,
                              "PAUSE":       Characteristic.CurrentMediaState.PAUSE,
                              "STOP":        Characteristic.CurrentMediaState.STOP,
                              "LOADING":     Characteristic.CurrentMediaState.LOADING,
                              "INTERRUPTED": Characteristic.CurrentMediaState.INTERRUPTED}
              },
         43:  { type: "CurrentPosition",
                characteristic: Characteristic.CurrentPosition,
                UUID: "0000006D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetPosition,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         44:  { type: "CurrentRelativeHumidity",
                characteristic: Characteristic.CurrentRelativeHumidity,
                UUID: "00000010-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         45:  { type: "CurrentSlatState",
                characteristic: Characteristic.CurrentSlatState,
                UUID: "000000AA-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetSlatState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         46:  { type: "CurrentTemperature",
                characteristic: Characteristic.CurrentTemperature,
                UUID: "00000011-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetTemperature,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.CELSIUS,
                        maxValue: 100,
                        minValue: -273.15,
                        minStep: 0.1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         47:  { type: "CurrentTiltAngle",
                characteristic: Characteristic.CurrentTiltAngle,
                UUID: "000000C1-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         48:  { type: "CurrentTime",   // HomeKitTypes-Bridge
                characteristic: Characteristic.CurrentTime,
                UUID: "0000009B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         49:  { type: "CurrentTransport",   // HomeKit.d.ts
                characteristic: Characteristic.CurrentTransport,
                UUID: "0000022B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         50:  { type: "CurrentVerticalTiltAngle",
                characteristic: Characteristic.CurrentVerticalTiltAngle,
                UUID: "0000006E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         51:  { type: "CurrentVisibilityState",    // HomeKitTypes-Television
                characteristic: Characteristic.CurrentVisibilityState,
                UUID: "00000135-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetVisibilityState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                            },
                validValues:
                   {"SHOWN":    Characteristic.CurrentVisibilityState.SHOWN,
                    "HIDDEN":   Characteristic.CurrentVisibilityState.HIDDEN
                   }
              },
         52:  { type: "DataStreamHAPTransport",   // HomeKit.d.ts
                characteristic: Characteristic.DataStreamHAPTransport,
                UUID: "00000138-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         53:  { type: "DataStreamHAPTransportInterrupt",   // HomeKit.d.ts
                characteristic: Characteristic.DataStreamHAPTransportInterrupt,
                UUID: "00000139-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         54:  { type: "DayoftheWeek",    // HomeKitTypes-Bridge
                characteristic: Characteristic.DayoftheWeek,
                UUID: "00000098-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 7,
                        minValue: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         55:  { type: "DiagonalFieldOfView",   // HomeKit.d.ts
                characteristic: Characteristic.DiagonalFieldOfView,
                UUID: "00000224-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.ARC_DEGREE,
                        maxValue: 360,
                        minValue: 0,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         56:  { type: "DigitalZoom",
                characteristic: Characteristic.DigitalZoom,
                UUID: "0000011D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        minStep: 0.1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         57:  { type: "DiscoverBridgedAccessories",   // HomKitTypes-Bridge
                characteristic: Characteristic.DiscoverBridgedAccessories,
                UUID: "0000009E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:{}
              },
         58:  { type: "DiscoveredBridgedAccessories",   // HomKitTypes-Bridge
                characteristic: Characteristic.DiscoveredBridgedAccessories,
                UUID: "0000009F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT16,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         59:  { type: "DisplayOrder",   // HomKitTypes-Television
                characteristic: Characteristic.DisplayOrder,
                UUID: "00000136-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         60:  { type: "EventRetransmissionMaximum",   // HomeKit.d.ts
                characteristic: Characteristic.EventRetransmissionMaximum,
                UUID: "0000023D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         61:  { type: "EventSnapshotsActive",   // HomeKit.d.ts
                characteristic: Characteristic.EventSnapshotsActive,
                UUID: "00000223-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"DISABLE":    Characteristic.EventSnapshotsActive.DISABLE,
                    "ENABLE":     Characteristic.EventSnapshotsActive.ENABLE,
                   }
              },
         62:  { type: "EventTransmissionCounters",   // HomeKit.d.ts
                characteristic: Characteristic.EventTransmissionCounters,
                UUID: "0000023E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         63:  { type: "FilterChangeIndication",
                characteristic: Characteristic.FilterChangeIndication,
                UUID: "000000AC-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020.  HomeKit Spec has these as "notNeeded" and "needed"
                   {"FILTER_OK": Characteristic.FilterChangeIndication.FILTER_OK,
                    "CHANGE_FILTER":Characteristic.FilterChangeIndication.CHANGE_FILTER
                   }
              },
         64:  { type: "FilterLifeLevel",
                characteristic: Characteristic.FilterLifeLevel,
                UUID: "000000AB-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         65:  { type: "FirmwareRevision",
                characteristic: Characteristic.FirmwareRevision,
                UUID: "00000052-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                         perms: [Characteristic.Perms.READ
                                ]
                       },
                validValues: {}
              },
         66:  { type: "HardwareRevision",
                characteristic: Characteristic.HardwareRevision,
                UUID: "00000053-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                   perms: [Characteristic.Perms.READ
                          ]
                       },
                validValues: {}
              },
         67:  { type: "HeartBeat",
                characteristic: Characteristic.HeartBeat,
                UUID: "0000024A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                         perms: [Characteristic.Perms.NOTIFY,
                                 Characteristic.Perms.PAIRED_READ
                          ]
                       },
                validValues: {}
              },
         68:  { type: "HeatingThresholdTemperature",
                characteristic: Characteristic.HeatingThresholdTemperature,
                UUID: "00000012-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         69:  { type: "HoldPosition",
                characteristic: Characteristic.HoldPosition,
                UUID: "0000006F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         70:  { type: "HomeKitCameraActive",
                characteristic: Characteristic.HomeKitCameraActive,
                UUID: "0000021B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   { "OFF": 0,
                     "ON":  1
                   }
              },
         71:  { type: "Hue",
                characteristic: Characteristic.Hue,
                UUID: "00000013-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         72:  { type: "Identifier",   // HomeKitTypes-Television
                characteristic: Characteristic.Identifier,
                UUID: "000000E6-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         73:  { type: "Identify",
                characteristic: Characteristic.Identify,
                UUID: "00000014-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                         perms: [Characteristic.Perms.WRITE
                                ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         74:  { type: "ImageMirroring",
                characteristic: Characteristic.ImageMirroring,
                UUID: "0000011F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         75:  { type: "ImageRotation",
                characteristic: Characteristic.ImageRotation,
                UUID: "0000011E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
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
         76:  { type: "InUse",
                characteristic: Characteristic.InUse,
                UUID: "000000D2-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_IN_USE": Characteristic.InUse.NOT_IN_USE,
                    "IN_USE":     Characteristic.InUse.IN_USE
                   }
              },
         77:  { type: "InputDeviceType",   // HomeKitTypes-Television
                characteristic: Characteristic.InputDeviceType,
                UUID: "000000DC-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 6,
                        minValue: 0,
                        minStep: 1,
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
         78:  { type: "InputSourceType",   // HomeKitTypes-Television
                characteristic: Characteristic.InputSourceType,
                UUID: "000000DB-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 10,
                        minValue: 0,
                        minStep: 1,
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
         79:  { type: "IsConfigured",
                characteristic: Characteristic.IsConfigured,
                UUID: "000000D6-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         80:  { type: "LeakDetected",
                characteristic: Characteristic.LeakDetected,
                UUID: "00000070-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"LEAK_NOT_DETECTED": Characteristic.LeakDetected.LEAK_NOT_DETECTED,
                    "LEAK_DETECTED":     Characteristic.LeakDetected.LEAK_DETECTED
                   }
              },
         81:  { type: "LinkQuality",   // HomeKitTypes-Bridge
                characteristic: Characteristic.LinkQuality,
                UUID: "0000009C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 4,
                        minValue: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         82:  { type: "LockControlPoint",
                characteristic: Characteristic.LockControlPoint,
                UUID: "00000019-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                   perms: [Characteristic.Perms.WRITE
                          ]
                       },
                validValues: {}
              },
         83:  { type: "LockCurrentState",
                characteristic: Characteristic.LockCurrentState,
                UUID: "0000001D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.LockTargetState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         84:  { type: "LockLastKnownAction",
                characteristic: Characteristic.LockLastKnownAction,
                UUID: "0000001C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 10,
                        minValue: 0,
                        minStep: 1,
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
                     Characteristic.LockLastKnownAction.SECURED_BY_AUTO_SECURE_TIMEOUT,
                    "SECURED_PHYSICALLY":
                     Characteristic.LockLastKnownAction.SECURED_PHYSICALLY,
                    "UNSECURED_PHYSICALLY":
                     Characteristic.LockLastKnownAction.UNSECURED_PHYSICALLY
                   }
              },
         85:  { type: "LockManagementAutoSecurityTimeout",
                characteristic: Characteristic.LockManagementAutoSecurityTimeout,
                UUID: "0000001A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        unit: Characteristic.Units.SECONDS,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         86:  { type: "LockPhysicalControls",
                characteristic: Characteristic.LockPhysicalControls,
                UUID: "000000A7-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         87:  { type: "LockTargetState",
                characteristic: Characteristic.LockTargetState,
                UUID: "0000001E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.LockCurrentState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         88:  { type: "Logs",
                characteristic: Characteristic.Logs,
                UUID: "0000001F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         89:  { type: "MACRetransmissionMaximum",  // HomekitTypes.d.ts
                characteristic: Characteristic.MACRetransmissionMaximum,
                UUID: "00000247-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         90:  { type: "MACTransmissionCounters",  // HomekitTypes.d.ts
                characteristic: Characteristic.MACTransmissionCounters,
                UUID: "00000248-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: Characteristic.Formats.DATA,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         91:  { type: "ManagedNetworkEnable",   // HomeKit
                characteristic: Characteristic.ManagedNetworkEnable,
                UUID: "00000215-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE
                               ]
                       },
                validValues:
                       { "DISABLED": Characteristic.ManagedNetworkEnable.DISABLED,
                         "ENABLED":  Characteristic.ManagedNetworkEnable.ENABLED,
                         "UNKNOWN":  2
                       }
              },
         92:  { type: "ManuallyDisabled",
                characteristic: Characteristic.ManuallyDisabled,
                UUID: "00000227-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues:
                       { "ENABLED":  Characteristic.ManuallyDisabled.ENABLED,
                         "DISABLED": Characteristic.ManuallyDisabled.DISABLED
                       }
              },
         93:  { type: "Manufacturer",
                characteristic: Characteristic.Manufacturer,
                UUID: "00000020-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                         perms: [Characteristic.Perms.READ
                                ]
                       },
                validValues: {}
              },
         94:  { type: "Model",
                characteristic: Characteristic.Model,
                UUID: "00000021-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         95:  { type: "MotionDetected",
                characteristic: Characteristic.MotionDetected,
                UUID: "00000022-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         96:  { type: "Mute",
                characteristic: Characteristic.Mute,
                UUID: "0000011A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         97:  { type: "Name",
                characteristic: Characteristic.Name,
                UUID: "00000023-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         98:  { type: "NetworkAccessViolationControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkAccessViolationControl,
                UUID: "0000021F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                          ]
                       },
                validValues: {}
              },
         99:  { type: "NetworkClientProfileControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkClientProfileControl,
                UUID: "0000020C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         100: { type: "NetworkClientStatusControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkClientStatusControl,
                UUID: "0000020D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         101: { type: "NightVision",
                characteristic: Characteristic.NightVision,
                UUID: "0000011B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         102: { type: "NitrogenDioxideDensity",
                characteristic: Characteristic.NitrogenDioxideDensity,
                UUID: "000000C4-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         103: { type: "ObstructionDetected",
                characteristic: Characteristic.ObstructionDetected,
                UUID: "00000024-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         104: { type: "OccupancyDetected",
                characteristic: Characteristic.OccupancyDetected,
                UUID: "00000071-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         105: { type: "On",
                characteristic: Characteristic.On,
                UUID: "00000025-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         106: { type: "OperatingStateResponse",  // HomeKitTypes.d.ts
                characteristic: Characteristic.OperatingStateResponse,
                UUID: "00000232-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.NOTIFY
                          ]
                       },
                validValues: {}
              },
         107: { type: "OpticalZoom",
                characteristic: Characteristic.OpticalZoom,
                UUID: "0000011C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        minStep: .1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         108: { type: "OutletInUse",
                characteristic: Characteristic.OutletInUse,
                UUID: "00000026-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         109: { type: "OzoneDensity",
                characteristic: Characteristic.OzoneDensity,
                UUID: "000000C3-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         110: { type: "PM10Density",
                characteristic: Characteristic.PM10Density,
                UUID: "000000C7-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         111: { type: "PM2_5Density",
                characteristic: Characteristic.PM2_5Density,
                UUID: "000000C6-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         112: { type: "PairSetup",
                characteristic: Characteristic.PairSetup,
                UUID: "0000004C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         113: { type: "PairVerify",
                characteristic: Characteristic.PairVerify,
                UUID: "0000004E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         114: { type: "PairingFeatures",
                characteristic: Characteristic.PairingFeatures,
                UUID: "0000004F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         115: { type: "PairingPairings",
                characteristic: Characteristic.PairingPairings,
                UUID: "00000050-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         116: { type: "PasswordSetting",  // HomeKitTypes.d.ts
                characteristic: Characteristic.PasswordSetting,
                UUID: "000000E4-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         117: { type: "PeriodicSnapshotsActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.PeriodicSnapshotsActive,
                UUID: "00000225-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.WRITE,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues:
                   {"DISABLE": Characteristic.PeriodicSnapshotsActive.DISABLE,          // 0
                    "ENABLE":  Characteristic.PeriodicSnapshotsActive.ENABLE            // 1
                   }
              },
         118: { type: "PictureMode",   // HomeKitTypes-Television
                characteristic: Characteristic.PictureMode,
                UUID: "000000E2-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 13,
                        minValue: 0,
                        minStep: 1,
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
         119: { type: "Ping",  // HomeKitTypes.d.ts
                characteristic: Characteristic.Ping,
                UUID: "0000023C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: Characteristic.Formats.DATA,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         120: { type: "PositionState",
                characteristic: Characteristic.PositionState,
                UUID: "00000072-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         121: { type: "PowerModeSelection",  // HomeKitTypes-Television
                characteristic: Characteristic.PowerModeSelection,
                UUID: "000000DF-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.WRITE
                               ]
                       },
                validValues:
                   {"SHOW": Characteristic.PowerModeSelection.SHOW,
                    "HIDE": Characteristic.PowerModeSelection.HIDE
                   }
              },
         122: { type: "ProductData",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ProductData,
                UUID: "00000220-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: Characteristic.Formats.DATA,
                         perms: [Characteristic.Perms.READ
                                ]
                       },
                validValues: {}
              },
         123: { type: "ProgramMode",
                characteristic: Characteristic.ProgramMode,
                UUID: "000000D1-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         124: { type: "ProgrammableSwitchEvent",
                characteristic: Characteristic.ProgrammableSwitchEvent,
                UUID: "00000073-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         125: { type: "ProgrammableSwitchOutputState",   // HomeKitTypes-Bridge
                characteristic: Characteristic.ProgrammableSwitchOutputState,
                UUID: "00000074-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         126: { type: "Reachable",   // HomeKitTypes-Bridge
                characteristic: Characteristic.Reachable,
                UUID: "00000063-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         127: { type: "ReceivedSignalStrengthIndication",  // HomeKit
                characteristic: Characteristic.ReceivedSignalStrengthIndication,
                UUID: "0000023F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         128: { type: "ReceiverSensitivity",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ReceiverSensitivity,
                UUID: "00000244-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         129: { type: "RecordingAudioActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.RecordingAudioActive,
                UUID: "00000226-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                         perms: [Characteristic.Perms.PAIRED_READ,
                                 Characteristic.Perms.PAIRED_WRITE,
                                 Characteristic.Perms.NOTIFY,
                                 Characteristic.Perms.TIMED_WRITE
                                ]
                       },
                validValues:
                   {"DISABLE": Characteristic.RecordingAudioActive.DISABLE,   // CHECK
                    "ENABLE":  Characteristic.RecordingAudioActive.ENABLE
                   }
              },
         130: { type: "RelativeHumidityDehumidifierThreshold",
                characteristic: Characteristic.RelativeHumidityDehumidifierThreshold,
                UUID: "000000C9-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         131: { type: "RelativeHumidityHumidifierThreshold",
                characteristic: Characteristic.RelativeHumidityHumidifierThreshold,
                UUID: "000000CA-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         132: { type: "RelayControlPoint",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayControlPoint,
                UUID: "0000005E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         133: { type: "RelayEnabled",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayEnabled,
                UUID: "0000005B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         134: { type: "RelayState",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayState,
                UUID: "0000005C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 5,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         135: { type: "RemainingDuration",
                characteristic: Characteristic.RemainingDuration,
                UUID: "000000D4-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        maxValue: 3600,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         136: { type: "RemoteKey",   // HomeKitTypes-Television
                characteristic: Characteristic.RemoteKey,
                UUID: "000000E1-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 16,
                        minValue: 0,
                        minStep: 1,
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
         137: { type: "ResetFilterIndication",
                characteristic: Characteristic.ResetFilterIndication,
                UUID: "000000AD-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 1,
                        minStep:  1,
                        perms: [Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         138: { type: "RotationDirection",
                characteristic: Characteristic.RotationDirection,
                UUID: "00000028-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         139: { type: "RotationSpeed",
                characteristic: Characteristic.RotationSpeed,
                UUID: "00000029-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         140: { type: "RouterStatus",  // HomeKitTypes.d.ts
                characteristic: Characteristic.RouterStatus,
                UUID: "0000020E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {"READY"     : Characteristic.RouterStatus.READY,     // 0
                              "NOT_READY" : Characteristic.RouterStatus.NOT_READY  // 1
                             }
              },
         141: { type: "Saturation",
                characteristic: Characteristic.Saturation,
                UUID: "0000002F-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         142: { type: "SecuritySystemAlarmType",
                characteristic: Characteristic.SecuritySystemAlarmType,
                UUID: "0000008E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         143: { type: "SecuritySystemCurrentState",
                characteristic: Characteristic.SecuritySystemCurrentState,
                UUID: "00000066-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 4,
                        minValue: 0,
                        minStep: 1,
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
         144: { type: "SecuritySystemTargetState",
                characteristic: Characteristic.SecuritySystemTargetState,
                UUID: "00000067-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         145: { type: "SelectedAudioStreamConfiguration",  // HomeKit-Remote
                characteristic: Characteristic.SelectedAudioStreamConfiguration,
                UUID: "00000128-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         146: { type: "SelectedCameraRecordingConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SelectedCameraRecordingConfiguration,
                UUID: "00000209-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         147: { type: "SelectedRTPStreamConfiguration",
                characteristic: Characteristic.SelectedRTPStreamConfiguration,
                UUID: "00000117-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         148: { type: "SerialNumber",
                characteristic: Characteristic.SerialNumber,
                UUID: "00000030-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         149: { type: "ServiceLabelIndex",
                characteristic: Characteristic.ServiceLabelIndex,
                UUID: "000000CB-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 255,
                        minValue: 1,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         150: { type: "ServiceLabelNamespace",
                characteristic: Characteristic.ServiceLabelNamespace,
                UUID: "000000CD-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues:
                   {"DOTS":            Characteristic.ServiceLabelNamespace.DOTS,
                    "ARABIC_NUMERALS": Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
                   }
              },
         151: { type: "SetDuration",
                characteristic: Characteristic.SetDuration,
                UUID: "000000D3-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        maxValue: 3600,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         152: { type: "SetupDataStreamTransport",  // HomeKit-DataStream
                characteristic: Characteristic.SetupDataStreamTransport,
                UUID: "00000131-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.PAIRED_READ,
                                 Characteristic.Perms.PAIRED_WRITE,
                                 Characteristic.Perms.WRITE_RESPONSE
                                ]
                       },
                validValues: {}
              },
         153: { type: "SetupEndpoints",
                characteristic: Characteristic.SetupEndpoints,
                UUID: "00000118-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE
                               ]
                       },
                validValues: {}
              },
         154: { type: "SetupTransferTransport",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SetupTransferTransport,
                UUID: "00000201-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.PAIRED_WRITE,
                                 Characteristic.Perms.WRITE_RESPONSE
                                ]
                       },
                validValues: {}
              },
         155: { type: "SignalToNoiseRatio",  // HomeKit
                characteristic: Characteristic.SignalToNoiseRatio,
                UUID: "00000241-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         156: { type: "SiriInputType",  // HomeKit-Remote
                characteristic: Characteristic.SiriInputType,
                UUID: "00000132-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 0,
                        minValue: 0,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: { // Check
                      "PUSH_BUTTON_TRIGGERED_APPLE_TV": Characteristic.SiriInputType.PUSH_BUTTON_TRIGGERED_APPLE_TV
                }
              },
         157: { type: "SlatType",
                characteristic: Characteristic.SlatType,
                UUID: "000000C0-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues:
                   {"HORIZONTAL": Characteristic.SlatType.HORIZONTAL,
                    "VERTICAL":   Characteristic.SlatType.VERTICAL
                   }
              },
         158: { type: "SleepDiscoveryMode",   // HomeKitTypes-Television
                characteristic: Characteristic.SleepDiscoveryMode,
                UUID: "000000E8-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_DISCOVERABLE":    Characteristic.SleepDiscoveryMode.NOT_DISCOVERABLE ,
                    "ALWAYS_DISCOVERABLE": Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
                   }
              },
         159: { type: "SleepInterval",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SleepInterval,
                UUID: "0000023A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         160: { type: "SmokeDetected",
                characteristic: Characteristic.SmokeDetected,
                UUID: "00000076-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"SMOKE_NOT_DETECTED": Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
                    "SMOKE_DETECTED":     Characteristic.SmokeDetected.SMOKE_DETECTED
                   }
              },
         161: { type: "SoftwareRevision",  // HomeKit-Bridge
                characteristic: Characteristic.SoftwareRevision,
                UUID: "00000054-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         162: { type: "StatusActive",
                characteristic: Characteristic.StatusActive,
                UUID: "00000075-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                     "TRUE": 1
                   }
              },
         163: { type: "StatusFault",
                characteristic: Characteristic.StatusFault,
                UUID: "00000077-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"NO_FAULT":      Characteristic.StatusFault.NO_FAULT,
                     "GENERAL_FAULT": Characteristic.StatusFault.GENERAL_FAULT
                   }
              },
         164: { type: "StatusJammed",
                characteristic: Characteristic.StatusJammed,
                UUID: "00000078-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_JAMMED": Characteristic.StatusJammed.NOT_JAMMED,
                    "JAMMED":     Characteristic.StatusJammed.JAMMED
                   }
              },
         165: { type: "StatusLowBattery",
                characteristic: Characteristic.StatusLowBattery,
                UUID: "00000079-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         166: { type: "StatusTampered",
                characteristic: Characteristic.StatusTampered,
                UUID: "0000007A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_TAMPERED": Characteristic.StatusTampered.NOT_TAMPERED,
                    "TAMPERED":     Characteristic.StatusTampered.TAMPERED
                   }
              },
         167: { type: "StreamingStatus",
                characteristic: Characteristic.StreamingStatus,
                UUID: "00000120-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         168: { type: "SulphurDioxideDensity",
                characteristic: Characteristic.SulphurDioxideDensity,
                UUID: "000000C5-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 1000,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         169: { type: "SupportedAudioRecordingConfiguration",
                characteristic: Characteristic.SupportedAudioRecordingConfiguration,
                UUID: "00000207-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         170: { type: "SupportedAudioStreamConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedAudioStreamConfiguration,
                UUID: "00000115-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         171: { type: "SupportedCameraRecordingConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedCameraRecordingConfiguration,
                UUID: "00000205-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         172: { type: "SupportedDataStreamTransportConfiguration",   // HomeKit-DataStream
                characteristic: Characteristic.SupportedDataStreamTransportConfiguration,
                UUID: "00000130-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         173: { type: "SupportedCharacteristicValueTransitionConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedCharacteristicValueTransitionConfiguration,
                UUID: "00000144-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         174: { type: "SupportedDiagnosticsSnapshot",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SupportedDiagnosticsSnapshot,
                UUID: "00000238-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         175: { type: "SupportedRTPConfiguration",
                characteristic: Characteristic.SupportedRTPConfiguration,
                UUID: "00000116-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         176: { type: "SupportedRouterConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SupportedRouterConfiguration,
                UUID: "00000210-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.READ
                                ]
                       },
                validValues: {}
              },
         177: { type: "SupportedTransferTransportConfiguration",  // HomeKit
                characteristic: Characteristic.SupportedTransferTransportConfiguration,
                UUID: "00000202-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         178: { type: "SupportedVideoRecordingConfiguration",
                characteristic: Characteristic.SupportedVideoRecordingConfiguration,
                UUID: "00000206-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         179: { type: "SupportedVideoStreamConfiguration",
                characteristic: Characteristic.SupportedVideoStreamConfiguration,
                UUID: "00000114-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.READ
                               ]
                       },
                validValues: {}
              },
         180: { type: "SwingMode",
                characteristic: Characteristic.SwingMode,
                UUID: "000000B6-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },

                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         181: { type: "TargetAirPurifierState",
                characteristic: Characteristic.TargetAirPurifierState,
                UUID: "000000A8-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         182: { type: "TargetAirQuality",
                characteristic: Characteristic.TargetAirQuality,
                UUID: "000000AE-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.AirQuality,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         183: { type: "TargetControlList",   // Homekit-Remote
                characteristic: Characteristic.TargetControlList,
                UUID: "00000124-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_WRITE,
                                Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         184: { type: "TargetControlSupportedConfiguration",   // Homekit-Remote
                characteristic: Characteristic.TargetControlSupportedConfiguration,
                UUID: "00000123-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         185: { type: "TargetDoorState",
                characteristic: Characteristic.TargetDoorState,
                UUID: "00000032-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         186: { type: "TargetFanState",
                characteristic: Characteristic.TargetFanState,
                UUID: "000000BF-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentFanState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         187: { type: "TargetHeaterCoolerState",
                characteristic: Characteristic.TargetHeaterCoolerState,
                UUID: "000000B2-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         188: { type: "TargetHeatingCoolingState",
                characteristic: Characteristic.TargetHeatingCoolingState,
                UUID: "00000033-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         189: { type: "TargetHorizontalTiltAngle",
                characteristic: Characteristic.TargetHorizontalTiltAngle,
                UUID: "0000007B-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        unit: Characteristic.Units.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         190: { type: "TargetHumidifierDehumidifierState",
                characteristic: Characteristic.TargetHumidifierDehumidifierState,
                UUID: "000000B4-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
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
         191: { type: "TargetMediaState",   // HomeKitTypes-Television
                characteristic: Characteristic.TargetMediaState,
                UUID: "00000137-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"PLAY": Characteristic.TargetMediaState.PLAY,
                    "PAUSE": Characteristic.TargetMediaState.PAUSE,
                    "STOP": Characteristic.TargetMediaState.STOP
                   }
              },
         192: { type: "TargetPosition",
                characteristic: Characteristic.TargetPosition,
                UUID: "0000007C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentPosition,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         193: { type: "TargetRelativeHumidity",
                characteristic: Characteristic.TargetRelativeHumidity,
                UUID: "00000034-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         194: { type: "TargetSlatState",
                characteristic: Characteristic.TargetSlatState,
                UUID: "000000BE-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentSlatState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         195: { type: "TargetTemperature",
                characteristic: Characteristic.TargetTemperature,
                UUID: "00000035-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
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
         196: { type: "TargetTiltAngle",
                characteristic: Characteristic.TargetTiltAngle,
                UUID: "000000C2-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
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
         197: { type: "TargetVerticalTiltAngle",
                characteristic: Characteristic.TargetVerticalTiltAngle,
                UUID: "0000007D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        unit: Characteristic.Units.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         198: { type: "TargetVisibilityState",   // HomeKittypes-Television
                characteristic: Characteristic.TargetVisibilityState,
                UUID: "00000134-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentVisibilityState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         199: { type: "TemperatureDisplayUnits",
                characteristic: Characteristic.TemperatureDisplayUnits,
                UUID: "00000036-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
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
         200: { type: "ThirdPartyCameraActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ThirdPartyCameraActive,
                UUID: "0000021C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues:
                   { "OFF" : Characteristic.ThirdPartyCameraActive.OFF,   // 0 
                     "ON"  : Characteristic.ThirdPartyCameraActive.ON     // 1
                   }
              },
         201: { type: "TimeUpdate",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TimeUpdate,
                UUID: "0000009A-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         202: { type: "TransmitPower",   // HomeKitTypes
                characteristic: Characteristic.TransmitPower,
                UUID: "00000242-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         203: { type: "TransmitPowerMaximum",   // HomeKitTypes
                characteristic: Characteristic.TransmitPowerMaximum,
                UUID: "0000021E-0000-1000-8000-00000243",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         204: { type: "TunnelConnectionTimeout",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunnelConnectionTimeout,
                UUID: "00000061-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.WRITE,    // Reversed in HomeBridge
                                Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         205: { type: "TunneledAccessoryAdvertising",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryAdvertising,
                UUID: "00000060-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.WRITE,   // Reversed in HomeBridge
                                Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         206: { type: "TunneledAccessoryConnected",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryConnected,
                UUID: "00000059-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: Characteristic.Formats.BOOL,
                        perms: [Characteristic.Perms.WRITE,   // Reversed in HomeBridge
                                Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         207: { type: "TunneledAccessoryStateNumber",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryStateNumber,
                UUID: "00000058-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.INT,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         208: { type: "VOCDensity",
                characteristic: Characteristic.VOCDensity,
                UUID: "000000C8-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 1000,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         209: { type: "ValveType",
                characteristic: Characteristic.ValveType,
                UUID: "000000D5-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
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
         210: { type: "Version",
                characteristic: Characteristic.Version,
                UUID: "00000037-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: Characteristic.Formats.STRING,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         211: { type: "VideoAnalysisActive",
                characteristic: Characteristic.VideoAnalysisActive,
                UUID: "00000229-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues:
                   {}
              },
         212: { type: "Volume",
                characteristic: Characteristic.Volume,
                UUID: "00000119-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        unit: Characteristic.Units.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.WRITE,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         213: { type: "VolumeControlType",   // HomeKitTypes-Television
                characteristic: Characteristic.VolumeControlType,
                UUID: "000000E9-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 3,
                        minValue: 0,
                        minStep:  1,
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
         214: { type: "VolumeSelector",   // HomeKitTypes-Television
                characteristic: Characteristic.VolumeSelector,
                UUID: "000000EA-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [Characteristic.Perms.WRITE
                               ]
                       },
                validValues:
                   {"INCREMENT": Characteristic.VolumeSelector.INCREMENT,
                    "DECREMENT": Characteristic.VolumeSelector.DECREMENT
                   }
              },
         215: { type: "WANConfigurationList",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WANConfigurationList,
                UUID: "00000211-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues: {}
              },
         216: { type: "WANStatusList",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WANStatusList,
                UUID: "00000212-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.READ,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues: {}
              },
         217: { type: "WakeConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WakeConfiguration,
                UUID: "00000222-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                         perms: [Characteristic.Perms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         218: { type: "WaterLevel",
                characteristic: Characteristic.WaterLevel,
                UUID: "000000B5-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: Characteristic.Formats.FLOAT,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [Characteristic.Perms.READ,
                                Characteristic.Perms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         219: { type: "WiFiCapabilities",   // HomeKit
                characteristic: Characteristic.WiFiCapabilities,
                UUID: "0000022C-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT32,
                        perms: [Characteristic.Perms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         220: { type: "WiFiConfigurationControl",   // HomeKit
                characteristic: Characteristic.WiFiConfigurationControl,
                UUID: "0000022D-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: Characteristic.Formats.TLV8,
                        perms: [Characteristic.Perms.PAIRED_READ,
                                Characteristic.Perms.PAIRED_WRITE,
                                Characteristic.Perms.NOTIFY,
                                Characteristic.Perms.TIMED_WRITE,
                                Characteristic.Perms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         221: { type: "WiFiSatelliteStatus",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WiFiSatelliteStatus,
                UUID: "0000021E-0000-1000-8000-0026BB765291",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: Characteristic.Formats.UINT8,
                         maxValue: 2,
                         minValue: 0,
                         perms: [Characteristic.Perms.PAIRED_READ,
                                 Characteristic.Perms.NOTIFY
                                ]
                       },
                validValues:
                       { "UNKNOWN": Characteristic.WiFiSatelliteStatus.UNKNOWN,               // 0,   - Check
                         "CONNECTED" : Characteristic.WiFiSatelliteStatus.CONNECTED,          // 1,
                         "NOT_CONNECTED": Characteristic.WiFiSatelliteStatus.NOT_CONNECTED    // 2
                       }
              }
      };

      return CMD4_ACC_TYPE_ENUM;
   }, CMD4_ACC_TYPE_ENUM
}
