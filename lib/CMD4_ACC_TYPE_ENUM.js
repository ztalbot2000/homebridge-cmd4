'use strict';

// The sObject.defineProperty is to resolve a lint issue.
// See utils/indexOfEnumLintTest.js for further information.
let indexOfEnum = require( "../utils/indexOfEnum" );
Object.defineProperty( exports, "indexOfEnum", { enumerable: true, get: function ( ){ return indexOfEnum.indexOfEnum; } });

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
   return str;
}

class CustomCharacteristic
{
   constructor( api, type, UUID, props )
   {
      this.characteristic = { };
      this.api = api;

      var _a;
      this.characteristic[ type ] = (_a = class extends this.api.hap.Characteristic
      {
         constructor() {
            super(type, UUID, props);
            this.value = this.getDefaultValue();
         }
      },
      _a.UUID = UUID,
      _a);
   }
}

// NOTE - DO NOT CHANGE TO LOWER CASE
//      - This would mean ALL testcases would have to be changed as well.
//:76,375s/^   \([A-Z]\)/   \l\1/
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
   ListPairings:                            82,
   LockControlPoint:                        83,
   LockCurrentState:                        84,
   LockLastKnownAction:                     85,
   LockManagementAutoSecurityTimeout:       86,
   LockPhysicalControls:                    87,
   LockTargetState:                         88,
   Logs:                                    89,
   MACRetransmissionMaximum:                90,
   MACTransmissionCounters:                 91,
   ManagedNetworkEnable:                    92,
   ManuallyDisabled:                        93,
   Manufacturer:                            94,
   Model:                                   95,
   MotionDetected:                          96,
   Mute:                                    97,
   Name:                                    98,
   NetworkAccessViolationControl:           99,
   NetworkClientProfileControl:             100,
   NetworkClientStatusControl:              101,
   NightVision:                             102,
   NitrogenDioxideDensity:                  103,
   ObstructionDetected:                     104,
   OccupancyDetected:                       105,
   On:                                      106,
   OperatingStateResponse:                  107,
   OpticalZoom:                             108,
   OutletInUse:                             109,
   OzoneDensity:                            110,
   PM10Density:                             111,
   PM2_5Density:                            112,
   PairSetup:                               113,
   PairVerify:                              114,
   PairingFeatures:                         115,
   PairingPairings:                         116,
   PasswordSetting:                         117,
   PeriodicSnapshotsActive:                 118,
   PictureMode:                             119,
   Ping:                                    120,
   PositionState:                           121,
   PowerModeSelection:                      122,
   ProductData:                             123,
   ProgramMode:                             124,
   ProgrammableSwitchEvent:                 125,
   ProgrammableSwitchOutputState:           126,
   Reachable:                               127,
   ReceivedSignalStrengthIndication:        128,
   ReceiverSensitivity:                     129,
   RecordingAudioActive:                    130,
   RelativeHumidityDehumidifierThreshold:   131,
   RelativeHumidityHumidifierThreshold:     132,
   RelayControlPoint:                       133,
   RelayEnabled:                            134,
   RelayState:                              135,
   RemainingDuration:                       136,
   RemoteKey:                               137,
   ResetFilterIndication:                   138,
   RotationDirection:                       139,
   RotationSpeed:                           140,
   RouterStatus:                            141,
   Saturation:                              142,
   SecuritySystemAlarmType:                 143,
   SecuritySystemCurrentState:              144,
   SecuritySystemTargetState:               145,
   SelectedAudioStreamConfiguration:        146,
   SelectedCameraRecordingConfiguration:    147,
   SelectedRTPStreamConfiguration:          148,
   SerialNumber:                            149,
   ServiceLabelIndex:                       150,
   ServiceLabelNamespace:                   151,
   SetDuration:                             152,
   SetupDataStreamTransport:                153,
   SetupEndpoints:                          154,
   SetupTransferTransport:                  155,
   SignalToNoiseRatio:                      156,
   SiriInputType:                           157,
   SlatType:                                158,
   SleepDiscoveryMode:                      159,
   SleepInterval:                           160,
   SmokeDetected:                           161,
   SoftwareRevision:                        162,
   StatusActive:                            163,
   StatusFault:                             164,
   StatusJammed:                            165,
   StatusLowBattery:                        166,
   StatusTampered:                          167,
   StreamingStatus:                         168,
   SulphurDioxideDensity:                   169,
   SupportedAudioRecordingConfiguration:    170,
   SupportedAudioStreamConfiguration:       171,
   SupportedCameraRecordingConfiguration:   172,
   SupportedCharacteristicValueTransitionConfiguration:    173,
   SupportedDataStreamTransportConfiguration:   174,
   SupportedDiagnosticsSnapshot:            175,
   SupportedRTPConfiguration:               176,
   SupportedRouterConfiguration:            177,
   SupportedTransferTransportConfiguration: 178,
   SupportedVideoRecordingConfiguration:    179,
   SupportedVideoStreamConfiguration:       180,
   SwingMode:                               181,
   TargetAirPurifierState:                  182,
   TargetAirQuality:                        183,
   TargetControlList:                       184,
   TargetControlSupportedConfiguration:     185,
   TargetDoorState:                         186,
   TargetFanState:                          187,
   TargetHeaterCoolerState:                 188,
   TargetHeatingCoolingState:               189,
   TargetHorizontalTiltAngle:               190,
   TargetHumidifierDehumidifierState:       191,
   TargetMediaState:                        192,
   TargetPosition:                          193,
   TargetRelativeHumidity:                  194,
   TargetSlatState:                         195,
   TargetTemperature:                       196,
   TargetTiltAngle:                         197,
   TargetVerticalTiltAngle:                 198,
   TargetVisibilityState:                   199,
   TemperatureDisplayUnits:                 200,
   ThirdPartyCameraActive:                  201,
   TimeUpdate:                              202,
   TransmitPower:                           203,
   MaximumTransmitPower:                    204,
   TunnelConnectionTimeout:                 205,
   TunneledAccessoryAdvertising:            206,
   TunneledAccessoryConnected:              207,
   TunneledAccessoryStateNumber:            208,
   VOCDensity:                              209,
   ValveType:                               210,
   Version:                                 211,
   VideoAnalysisActive:                     212,
   Volume:                                  213,
   VolumeControlType:                       214,
   VolumeSelector:                          215,
   WANConfigurationList:                    216,
   WANStatusList:                           217,
   WakeConfiguration:                       218,
   WaterLevel:                              219,
   WiFiCapabilities:                        220,
   WiFiConfigurationControl:                221,
   WiFiSatelliteStatus:                     222,

   AssetUpdateReadiness:                    223,
   SupportedAssetTypes:                     224,
   ConfigurationState:                      225,
   NFCAccessControlPoint:                   226,
   NFCAccessSupportedConfiguration:         227,
   SiriEndpointSessionStatus:               228,
   ThreadControlPoint:                      229,
   ThreadNodeCapabilities:                  230,
   ThreadStatus:                            231,
   ThreadOpenThreadVersion:                 232,

   // Added Mar 2024
   AccessCodeControlPoint:                  233,
   AccessCodeSupportedConfiguration:        234,
   AirPlayEnable:                           235,
   CharacteristicValueActiveTransitionCount: 236,
   CryptoHash:                              237,
   FirmwareUpdateReadiness:                 238,
   FirmwareUpdateStatus:                    239,
   HardwareFinish:                          240,
   MetricsBufferFullState:                  241,
   MultifunctionButton:                     242,
   SelectedDiagnosticsModes:                243,
   SelectedSleepConfiguration:              244,
   SiriEnable:                              245,
   SiriEngineVersion:                       246,
   SiriLightOnUse:                          247,
   SiriListening:                           248,
   SiriTouchToUse:                          249,
   StagedFirmwareVersion:                   250,
   SupportedMetrics:                        251,
   SupportedFirmwareUpdateConfiguration:    252,
   TapType:                                 253,
   Token:                                   254,

   EOL:                                     255,

   properties: { },

   accEnumIndexToUC: function( index )
   {
      return CMD4_ACC_TYPE_ENUM.properties[ index ].type;
   },
   accEnumIndexToLC: function( index )
   {
      return CMD4_ACC_TYPE_ENUM.properties[ index ].sche;
   },
   indexOfEnum: function( characteristicString )
   {
      let accTypeEnumIndex = -1;
      accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === characteristicString );
      if ( accTypeEnumIndex >= 0 )
         return accTypeEnumIndex;

      return CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.sche === characteristicString );
   },

   add: function( api, type, description, props, validValues )
   {
      let UUID = api.hap.uuid.generate( type );
      let characteristic = new CustomCharacteristic( api, type, UUID, props );

      let hapFormats = api.hap.Formats;

      let stringConversionFunction;
      switch ( props.format )
      {
         case hapFormats.BOOL:
            stringConversionFunction = function ( str ){ return stringToBool( str ); };
            props.allowedWordCount = 1;
            break;
         case hapFormats.INT:
         case hapFormats.UINT8:
         case hapFormats.UINT16:
         case hapFormats.UINT32:
         case hapFormats.UINT64:
            stringConversionFunction = function ( str ){ return stringToInt( str ); };
            props.allowedWordCount = 1;
            break;
         case hapFormats.FLOAT:
            stringConversionFunction = function ( str ){ return stringToFloat( str ); };
            props.allowedWordCount = 1;
            break;
         case hapFormats.STRING:
            stringConversionFunction = function ( str ){ return stringToString( str ); };
            props.allowedWordCount = 0;
            break;
         case hapFormats.DATA:
            stringConversionFunction = function ( str ){ return stringPassThru( str ); };
            props.allowedWordCount = 0;
            break;
         case hapFormats.TLV8:
            stringConversionFunction = function ( str ){ return stringToTLV8( str ); };
            props.allowedWordCount = 0;
            break;
         case hapFormats.DICT:
            stringConversionFunction = function ( str ){ return stringPassThru( str ); };
            props.allowedWordCount = 0;
            break;
      }

      CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.EOL ] =
         { "type": type,
           "characteristic": characteristic.characteristic[ type ],
           "UUID": UUID,
           "description": description,
           "relatedCurrentAccTypeEnumIndex": null,
           "relatedTargetAccTypeEnumIndex": null,
           "stringConversionFunction": stringConversionFunction,
           "props": props,
           "validValues": validValues
         };
      CMD4_ACC_TYPE_ENUM[ type ] = CMD4_ACC_TYPE_ENUM.EOL;

      CMD4_ACC_TYPE_ENUM.EOL ++;

      // The returned characteristic is not good for anything but unit testing.
      // The one used for services is the above: characteristic.characteristic[ type ]
      return characteristic;
   },
};

// Export both the init function and the uninitialized data for unit testing
module.exports =
{
   init: function (Characteristic, hapFormats, hapUnits, hapPerms)
   {

      // Fill in the properties of all possible characteristics
      // props was added because calling getCharacteridtic().props.perms adds
      // the characteristic in by default. This costs some lines, but is advantageous.

      // NOTE - DO NOT CHANGE TYPE TO LOWER CASE.
      //      - HOW Would you handle MACTransmission, UUID, ...
      //        If checking char.At(0).toUpperCase ?
      //        :g/type: "\([A-Z]\)/s//type: "\l\1/g
      //        :g/sche: "\([A-Z]\)/s//sche: "\l\1/g
      //        :g/type: "\([a-z]\)/s//type: "\u\1/g
      CMD4_ACC_TYPE_ENUM.properties =
      {
         0:   { type: "AccessControlLevel",
                sche: "accessControlLevel",
                characteristic: Characteristic.AccessControlLevel,
                deprecated: false,
                UUID: "000000E5-0000-1000-8000-0026BB765291",
                description: "The Devices Access Control Level",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         1:   { type: "AccessoryFlags",
                sche: "accessoryFlags",
                characteristic: Characteristic.AccessoryFlags,
                deprecated: false,
                UUID: "000000A6-0000-1000-8000-0026BB765291",
                description: "The Devices Accessory Flags",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         2:   { type: "AccessoryIdentifier",   // HomeKitTypes-Bridge
                sche: "accessoryIdentifier",   // HomeKitTypes-Bridge
                characteristic: Characteristic.AccessoryIdentifier,
                deprecated: false,
                UUID: "00000057-0000-1000-8000-0026BB765291",
                description: "The Devices Accessory Identifier String",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         3:   { type: "Active",
                sche: "active",
                characteristic:Characteristic.Active,
                deprecated: false,
                UUID: "000000B0-0000-1000-8000-0026BB765291",
                description: "If the Device is ACTIVE/INACTIVE",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.Active,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.Active,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                   },
                validValues:   // Checked 04/24/2020
                   {"INACTIVE": Characteristic.Active.INACTIVE,
                    "ACTIVE":   Characteristic.Active.ACTIVE
                   }
              },
         4:   { type: "ActiveIdentifier",   // HomeKitTypes-Television
                sche: "activeIdentifier",   // HomeKitTypes-Television
                characteristic: Characteristic.ActiveIdentifier,
                deprecated: false,
                UUID: "000000E7-0000-1000-8000-0026BB765291",
                description: "The Devices Active Identifier",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         5:   { type: "ActivityInterval",   // HomeKit - Checke3d 11-19-2020
                sche: "activityInterval",   // HomeKit - Checke3d 11-19-2020
                characteristic: Characteristic.ActivityInterval,
                deprecated: false,
                UUID: "0000023B-0000-1000-8000-0026BB765291",
                description: "The Devices Activity Interval",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         6:   { type: "AdministratorOnlyAccess",
                sche: "administratorOnlyAccess",
                characteristic: Characteristic.AdministratorOnlyAccess,
                deprecated: false,
                UUID: "00000001-0000-1000-8000-0026BB765291",
                description: "If the Device has 2cwAdmin Only Access",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         7:   { type: "AirParticulateDensity",
                sche: "airParticulateDensity",
                characteristic: Characteristic.AirParticulateDensity,
                deprecated: false,
                UUID: "00000064-0000-1000-8000-0026BB765291",
                description: "The Measured Air Particulate Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         8:   { type: "AirParticulateSize",
                sche: "airParticulateSize",
                characteristic: Characteristic.AirParticulateSize,
                deprecated: false,
                UUID: "00000065-0000-1000-8000-0026BB765291",
                description: "The Measured Air Particulate Size",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020
                   {"_2_5_M": Characteristic.AirParticulateSize._2_5_M,
                    "_10_M":  Characteristic.AirParticulateSize._10_M
                   }
              },
         9:   { type: "AirQuality",
                sche: "airQuality",
                characteristic: Characteristic.AirQuality,
                deprecated: false,
                UUID: "00000095-0000-1000-8000-0026BB765291",
                description: "The Current Air Quality",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex:
                   null,
                   // @deprecated Removed and not used anymore as of homebridge v2
                   // CMD4_ACC_TYPE_ENUM.TargetAirQuality,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 5,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "appMatchingIdentifier",
                characteristic: Characteristic.AppMatchingIdentifier,
                deprecated: false,
                UUID: "000000A4-0000-1000-8000-0026BB765291",
                description: "The Devices App Matching Identifier",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                /* eslint no-unused-vars: ["error", {"args": "none"}] */
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues:   // Checked 11/20/2020
                   {}
              },
         11:  { type: "AudioFeedback",
                sche: "audioFeedback",
                characteristic: Characteristic.AudioFeedback,
                deprecated: false,
                UUID: "00000005-0000-1000-8000-0026BB765291",
                description: "If Audio Feedback is Present",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         12:  { type: "BatteryLevel",
                sche: "batteryLevel",
                characteristic: Characteristic.BatteryLevel,
                deprecated: false,
                UUID: "00000068-0000-1000-8000-0026BB765291",
                description: "The Measured Battery Level",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         13:  { type: "Brightness",
                sche: "brightness",
                characteristic: Characteristic.Brightness,
                deprecated: false,
                UUID: "00000008-0000-1000-8000-0026BB765291",
                description: "The Percentage of Existing Brightness",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         14:  { type: "ButtonEvent",
                sche: "buttonEvent",
                characteristic: Characteristic.ButtonEvent,
                deprecated: false,
                UUID: "00000126-0000-1000-8000-0026BB765291",
                description: "The Devices zbutton Event",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         15:  { type: "CCAEnergyDetectThreshold",
                sche: "ccaEnergyDetectThreshold",
                characteristic: Characteristic.CCAEnergyDetectThreshold,
                deprecated: false,
                UUID: "00000246-0000-1000-8000-0026BB765291",
                description: "The Devices CCA Energy Detect Threshold",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         16:  { type: "CCASignalDetectThreshold",
                sche: "ccaSignalDetectThreshold",
                characteristic: Characteristic.CCASignalDetectThreshold,
                deprecated: false,
                UUID: "00000245-0000-1000-8000-0026BB765291",
                description: "The Devices Signal Detect Threshold",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         17:  { type: "CameraOperatingModeIndicator",
                sche: "cameraOperatingModeIndicator",
                characteristic: Characteristic.CameraOperatingModeIndicator,
                deprecated: false,
                UUID: "0000021D-0000-1000-8000-0026BB765291",
                description: "The State of the Camera's Operating Mode Indicator",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE
                               ]
                       },
                validValues:
                       { "DISABLE": 0,
                         "ENABLE":  1
                       }
              },
         18:  { type: "CarbonDioxideDetected",
                sche: "carbonDioxideDetected",
                characteristic: Characteristic.CarbonDioxideDetected,
                deprecated: false,
                UUID: "00000092-0000-1000-8000-0026BB765291",
                description: "If Carbon Dioxide has been Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "carbonDioxideLevel",
                characteristic: Characteristic.CarbonDioxideLevel,
                deprecated: false,
                UUID: "00000093-0000-1000-8000-0026BB765291",
                description: "The Amount of CO2 Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         20:  { type: "CarbonDioxidePeakLevel",
                sche: "carbonDioxidePeakLevel",
                characteristic: Characteristic.CarbonDioxidePeakLevel,
                deprecated: false,
                UUID: "00000094-0000-1000-8000-0026BB765291",
                description: "The Maximum Amount of CO2 Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         21:  { type: "CarbonMonoxideDetected",
                sche: "carbonMonoxideDetected",
                characteristic: Characteristic.CarbonMonoxideDetected,
                deprecated: false,
                UUID: "00000069-0000-1000-8000-0026BB765291",
                description: "Indication of CO Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "carbonMonoxideLevel",
                characteristic: Characteristic.CarbonMonoxideLevel,
                deprecated: false,
                UUID: "00000090-0000-1000-8000-0026BB765291",
                description: "The Amount of CO Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         23:  { type: "CarbonMonoxidePeakLevel",
                sche: "carbonMonoxidePeakLevel",
                characteristic: Characteristic.CarbonMonoxidePeakLevel,
                deprecated: false,
                UUID: "00000091-0000-1000-8000-0026BB765291",
                description: "The Maximum Amount of CO Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         24:  { type: "Category",    // HomeKitTypes-Bridge
                sche: "category",    // HomeKitTypes-Bridge
                characteristic: Characteristic.Category,
                deprecated: true,
                UUID: "000000A3-0000-1000-8000-0026BB765291",
                description: "A Hint to HomeKitf of which Icon to Use",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        maxValue: 16,
                        minValue: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         25:  { type: "CharacteristicValueTransitionControl",    // HomeKit
                sche: "characteristicValueTransitionControl",    // HomeKit
                characteristic: Characteristic.CharacteristicValueTransitionControl,
                deprecated: false,
                UUID: "00000143-0000-1000-8000-0026BB765291",
                description: "The Devices Characteristic Value Transition Control",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         26:  { type: "ChargingState",
                sche: "chargingState",
                characteristic: Characteristic.ChargingState,
                deprecated: false,
                UUID: "0000008F-0000-1000-8000-0026BB765291",
                description: "The Current Charging State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
            validValues:   // Checked 04/24/2020. Note: HomeKit Spec has inProgress, Not CHARGING
                   {"NOT_CHARGING": Characteristic.ChargingState.NOT_CHARGING,
                    "CHARGING": Characteristic.ChargingState.CHARGING,
                    "NOT_CHARGEABLE":Characteristic.ChargingState.NOT_CHARGEABLE
                   }
              },
         27:  { type: "ClosedCaptions",    // HomeKitTypes-Television
                sche: "closedCaptions",    // HomeKitTypes-Television
                characteristic: Characteristic.ClosedCaptions,
                deprecated: false,
                UUID: "000000DD-0000-1000-8000-0026BB765291",
                description: "If Closed Captioning is Enabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"DISABLED": Characteristic.ClosedCaptions.DISABLED,
                    "ENABLED":  Characteristic.ClosedCaptions.ENABLED
                   }
              },
         28:  { type: "ColorTemperature",
                sche: "colorTemperature",
                characteristic: Characteristic.ColorTemperature,
                deprecated: false,
                UUID: "000000CE-0000-1000-8000-0026BB765291",
                description: "The Colors Current Temperature",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        maxValue: 500,
                        minValue: 140,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         29:  { type: "ConfigureBridgedAccessory",    // HomeKitTypes-Bridge
                sche: "configureBridgedAccessory",    // HomeKitTypes-Bridge
                characteristic: Characteristic.ConfigureBridgedAccessory,
                deprecated: true,
                UUID: "000000A0-0000-1000-8000-0026BB765291",
                description: "The Configured Bridge Accessory",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         30:  { type: "ConfigureBridgedAccessoryStatus",    // HomeKitTypes-Bridge
                sche: "configureBridgedAccessoryStatus",    // HomeKitTypes-Bridge
                characteristic: Characteristic.ConfigureBridgedAccessoryStatus,
                deprecated: true,
                UUID: "0000009D-0000-1000-8000-0026BB765291",
                description: "The Configured Bridge Accessory Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         31:  { type: "ConfiguredName",    // HomeKitTypes-Television
                sche: "configuredName",    // HomeKitTypes-Television
                characteristic: Characteristic.ConfiguredName,
                deprecated: false,
                UUID: "000000E3-0000-1000-8000-0026BB765291",
                description: "Name of accessory, as displayed in HomeKit",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         32:  { type: "ContactSensorState",
                sche: "contactSensorState",
                characteristic: Characteristic.ContactSensorState,
                deprecated: false,
                UUID: "0000006A-0000-1000-8000-0026BB765291",
                description: "The Current RState of a Contact Sensor",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"CONTACT_DETECTED": Characteristic.ContactSensorState.CONTACT_DETECTED,
                    "CONTACT_NOT_DETECTED": Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                   }
              },
         33:  { type: "CoolingThresholdTemperature",
                sche: "coolingThresholdTemperature",
                characteristic: Characteristic.CoolingThresholdTemperature,
                deprecated: false,
                UUID: "0000000D-0000-1000-8000-0026BB765291",
                description: "The Current Cooling Threshold Temperature",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.CELSIUS,
                        maxValue: 35,
                        minValue: 10,
                        minStep: 0.1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         34:  { type: "CurrentAirPurifierState",
                sche: "currentAirPurifierState",
                characteristic: Characteristic.CurrentAirPurifierState,
                deprecated: false,
                UUID: "000000A9-0000-1000-8000-0026BB765291",
                description: "The Current Target Air Purification State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetAirPurifierState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020
                   {"INACTIVE": Characteristic.CurrentAirPurifierState.INACTIVE,
                    "IDLE": Characteristic.CurrentAirPurifierState.IDLE,
                    "PURIFYING_AIR":Characteristic.CurrentAirPurifierState.PURIFYING_AIR
                   }
              },
         35:  { type: "CurrentAmbientLightLevel",
                sche: "currentAmbientLightLevel",
                characteristic: Characteristic.CurrentAmbientLightLevel,
                deprecated: false,
                UUID: "0000006B-0000-1000-8000-0026BB765291",
                description: "The Measured Ambient Light Level",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.LUX,
                        maxValue: 100000,
                        minValue: 0.0001,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         36:  { type: "CurrentDoorState",
                sche: "currentDoorState",
                characteristic: Characteristic.CurrentDoorState,
                deprecated: false,
                UUID: "0000000E-0000-1000-8000-0026BB765291",
                description: "The Doors Current Operating State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetDoorState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 4,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "currentFanState",
                characteristic: Characteristic.CurrentFanState,
                deprecated: false,
                UUID: "000000AF-0000-1000-8000-0026BB765291",
                description: "The Fans Current Operating State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetFanState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"INACTIVE":    Characteristic.CurrentFanState.INACTIVE,
                    "IDLE":        Characteristic.CurrentFanState.IDLE,
                    "BLOWING_AIR": Characteristic.CurrentFanState.BLOWING_AIR
                   }
              },
         38:  { type: "CurrentHeaterCoolerState",
                sche: "currentHeaterCoolerState",
                characteristic: Characteristic.CurrentHeaterCoolerState,
                deprecated: false,
                UUID: "000000B1-0000-1000-8000-0026BB765291",
                description: "The Heater/Coolers  Current Operating State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHeaterCoolerState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "currentHeatingCoolingState",
                characteristic: Characteristic.CurrentHeatingCoolingState,
                deprecated: false,
                UUID: "0000000F-0000-1000-8000-0026BB765291",
                description: "The Current Mode of the Heating/Cooling Device",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked May/07/2021
                   {"OFF":  Characteristic.CurrentHeatingCoolingState.OFF,
                    "HEAT": Characteristic.CurrentHeatingCoolingState.HEAT,
                    "COOL": Characteristic.CurrentHeatingCoolingState.COOL,
                      // We fix this in checkCharacteristicNeedsFixing
                    "AUTO": Characteristic.TargetHeatingCoolingState.AUTO
                   }
              },
         40:  { type: "CurrentHorizontalTiltAngle",
                sche: "currentHorizontalTiltAngle",
                characteristic: Characteristic.CurrentHorizontalTiltAngle,
                deprecated: false,
                UUID: "0000006C-0000-1000-8000-0026BB765291",
                description: "The Current Horizontal Tilt Angle",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHorizontalTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         41:  { type: "CurrentHumidifierDehumidifierState",
                sche: "currentHumidifierDehumidifierState",
                characteristic: Characteristic.CurrentHumidifierDehumidifierState,
                deprecated: false,
                UUID: "000000B3-0000-1000-8000-0026BB765291",
                description: "The Humidifier or Dehumidifier Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetHumidifierDehumidifierState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "currentMediaState",   // HomKitTypes-Television
                characteristic: Characteristic.CurrentMediaState,
                deprecated: false,
                UUID: "000000E0-0000-1000-8000-0026BB765291",
                description: "The Medias Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetMediaState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 5,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
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
                sche: "currentPosition",
                characteristic: Characteristic.CurrentPosition,
                deprecated: false,
                UUID: "0000006D-0000-1000-8000-0026BB765291",
                description: "The devices Current Position",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetPosition,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         44:  { type: "CurrentRelativeHumidity",
                sche: "currentRelativeHumidity",
                characteristic: Characteristic.CurrentRelativeHumidity,
                deprecated: false,
                UUID: "00000010-0000-1000-8000-0026BB765291",
                description: "The Measured Current Relative Humidity",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         45:  { type: "CurrentSlatState",
                sche: "currentSlatState",
                characteristic: Characteristic.CurrentSlatState,
                deprecated: false,
                UUID: "000000AA-0000-1000-8000-0026BB765291",
                description: "The Slats Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex:
                   // @deprecated Removed and not used anymore as of homebridge v2
                   null,
                   // CMD4_ACC_TYPE_ENUM.TargetSlatState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020  Note HomeKit Spec has "Stationary" not "Jammed"
                   {"FIXED":    Characteristic.CurrentSlatState.FIXED,
                    "JAMMED":   Characteristic.CurrentSlatState.JAMMED,
                    "SWINGING": Characteristic.CurrentSlatState.SWINGING
                   }
              },
         46:  { type: "CurrentTemperature",
                sche: "currentTemperature",
                characteristic: Characteristic.CurrentTemperature,
                deprecated: false,
                UUID: "00000011-0000-1000-8000-0026BB765291",
                description: "The Current Measured Temperature",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetTemperature,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                // Checked May 19, 2021
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.CELSIUS,
                        maxValue: 100,
                        minValue: -270,
                        minStep: 0.1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         47:  { type: "CurrentTiltAngle",
                sche: "currentTiltAngle",
                characteristic: Characteristic.CurrentTiltAngle,
                deprecated: false,
                UUID: "000000C1-0000-1000-8000-0026BB765291",
                description: "The Current Measured Tilt Angle",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         48:  { type: "CurrentTime",   // HomeKitTypes-Bridge
                sche: "currentTime",   // HomeKitTypes-Bridge
                characteristic: Characteristic.CurrentTime,
                deprecated: true,
                UUID: "0000009B-0000-1000-8000-0026BB765291",
                description: "What Time it is Now",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         49:  { type: "CurrentTransport",   // HomeKit.d.ts
                sche: "currentTransport",   // HomeKit.d.ts
                characteristic: Characteristic.CurrentTransport,
                deprecated: false,
                UUID: "0000022B-0000-1000-8000-0026BB765291",
                description: "The Devices Current Transport",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         50:  { type: "CurrentVerticalTiltAngle",
                sche: "currentVerticalTiltAngle",
                characteristic: Characteristic.CurrentVerticalTiltAngle,
                deprecated: false,
                UUID: "0000006E-0000-1000-8000-0026BB765291",
                description: "TheMeasured Current Vertical Tilt Angle",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetVerticalTiltAngle,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         51:  { type: "CurrentVisibilityState",    // HomeKitTypes-Television
                sche: "currentVisibilityState",    // HomeKitTypes-Television
                characteristic: Characteristic.CurrentVisibilityState,
                deprecated: false,
                UUID: "00000135-0000-1000-8000-0026BB765291",
                description: "Is a Device Currently Being Shown or Hidden",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.TargetVisibilityState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                            },
                validValues:
                   {"SHOWN":    Characteristic.CurrentVisibilityState.SHOWN,
                    "HIDDEN":   Characteristic.CurrentVisibilityState.HIDDEN
                   }
              },
         52:  { type: "DataStreamHAPTransport",   // HomeKit.d.ts
                sche: "dataStreamHAPTransport",   // HomeKit.d.ts
                characteristic: Characteristic.DataStreamHAPTransport,
                deprecated: false,
                UUID: "00000138-0000-1000-8000-0026BB765291",
                description: "The Devices Data Stream Transport",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         53:  { type: "DataStreamHAPTransportInterrupt",   // HomeKit.d.ts
                sche: "dataStreamHAPTransportInterrupt",   // HomeKit.d.ts
                characteristic: Characteristic.DataStreamHAPTransportInterrupt,
                deprecated: false,
                UUID: "00000139-0000-1000-8000-0026BB765291",
                description: "The Devices Data Stream Transport Interrupt",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         54:  { type: "DayoftheWeek",    // HomeKitTypes-Bridge
                sche: "dayoftheWeek",    // HomeKitTypes-Bridge
                characteristic: Characteristic.DayoftheWeek,
                deprecated: true,
                UUID: "00000098-0000-1000-8000-0026BB765291",
                description: "The Current Numerical Day of the Week",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 7,
                        minValue: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         55:  { type: "DiagonalFieldOfView",   // HomeKit.d.ts
                sche: "diagonalFieldOfView",   // HomeKit.d.ts
                characteristic: Characteristic.DiagonalFieldOfView,
                deprecated: false,
                UUID: "00000224-0000-1000-8000-0026BB765291",
                description: "The Measured Diagonal Field of View",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 360,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         56:  { type: "DigitalZoom",
                sche: "digitalZoom",
                characteristic: Characteristic.DigitalZoom,
                deprecated: false,
                UUID: "0000011D-0000-1000-8000-0026BB765291",
                description: "The Measured Digital Zoom",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        minStep: 0.1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         57:  { type: "DiscoverBridgedAccessories",   // HomKitTypes-Bridge
                sche: "discoverBridgedAccessories",   // HomKitTypes-Bridge
                characteristic: Characteristic.DiscoverBridgedAccessories,
                deprecated: true,
                UUID: "0000009E-0000-1000-8000-0026BB765291",
                description: "The Discovered Bridge Accessories",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:{}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         58:  { type: "DiscoveredBridgedAccessories",   // HomKitTypes-Bridge
                sche: "discoveredBridgedAccessories",   // HomKitTypes-Bridge
                characteristic: Characteristic.DiscoveredBridgedAccessories,
                deprecated: true,
                UUID: "0000009F-0000-1000-8000-0026BB765291",
                description: "The Discovered Bridged Accessories",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         59:  { type: "DisplayOrder",   // HomKitTypes-Television
                sche: "displayOrder",   // HomKitTypes-Television
                characteristic: Characteristic.DisplayOrder,
                deprecated: false,
                UUID: "00000136-0000-1000-8000-0026BB765291",
                description: "The Display Order",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         60:  { type: "EventRetransmissionMaximum",   // HomeKit.d.ts
                sche: "eventRetransmissionMaximum",   // HomeKit.d.ts
                characteristic: Characteristic.EventRetransmissionMaximum,
                deprecated: false,
                UUID: "0000023D-0000-1000-8000-0026BB765291",
                description: "The Event Retransmission Maximum Amount",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         61:  { type: "EventSnapshotsActive",   // HomeKit.d.ts
                sche: "eventSnapshotsActive",   // HomeKit.d.ts
                characteristic: Characteristic.EventSnapshotsActive,
                deprecated: false,
                UUID: "00000223-0000-1000-8000-0026BB765291",
                description: "Is the Event Snapshot Enabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"DISABLE":    Characteristic.EventSnapshotsActive.DISABLE,
                    "ENABLE":     Characteristic.EventSnapshotsActive.ENABLE,
                   }
              },
         62:  { type: "EventTransmissionCounters",   // HomeKit.d.ts
                sche: "eventTransmissionCounters",   // HomeKit.d.ts
                characteristic: Characteristic.EventTransmissionCounters,
                deprecated: false,
                UUID: "0000023E-0000-1000-8000-0026BB765291",
                description: "The Event Transmission Counters",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         63:  { type: "FilterChangeIndication",
                sche: "filterChangeIndication",
                characteristic: Characteristic.FilterChangeIndication,
                deprecated: false,
                UUID: "000000AC-0000-1000-8000-0026BB765291",
                description: "An Filters Current Quality",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020.  HomeKit Spec has these as "notNeeded" and "needed"
                   {"FILTER_OK": Characteristic.FilterChangeIndication.FILTER_OK,
                    "CHANGE_FILTER":Characteristic.FilterChangeIndication.CHANGE_FILTER
                   }
              },
         64:  { type: "FilterLifeLevel",
                sche: "filterLifeLevel",
                characteristic: Characteristic.FilterLifeLevel,
                deprecated: false,
                UUID: "000000AB-0000-1000-8000-0026BB765291",
                description: "An Measurement of Filters Current Quality",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         65:  { type: "FirmwareRevision",
                sche: "firmwareRevision",
                characteristic: Characteristic.FirmwareRevision,
                deprecated: false,
                UUID: "00000052-0000-1000-8000-0026BB765291",
                description: "The Firmwares Revision String",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         66:  { type: "HardwareRevision",
                sche: "hardwareRevision",
                characteristic: Characteristic.HardwareRevision,
                deprecated: false,
                UUID: "00000053-0000-1000-8000-0026BB765291",
                description: "The Hardwares Revision String",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         67:  { type: "HeartBeat",
                sche: "heartBeat",
                characteristic: Characteristic.HeartBeat,
                deprecated: false,
                UUID: "0000024A-0000-1000-8000-0026BB765291",
                description: "The Current Heart Rate",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         68:  { type: "HeatingThresholdTemperature",
                sche: "heatingThresholdTemperature",
                characteristic: Characteristic.HeatingThresholdTemperature,
                deprecated: false,
                UUID: "00000012-0000-1000-8000-0026BB765291",
                description: "The Heating Threshold Temperature",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.CELSIUS,
                        maxValue: 25,
                        minValue: 0,
                        minStep: 0.1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         69:  { type: "HoldPosition",
                sche: "holdPosition",
                characteristic: Characteristic.HoldPosition,
                deprecated: false,
                UUID: "0000006F-0000-1000-8000-0026BB765291",
                description: "If Position Should Be Held",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         70:  { type: "HomeKitCameraActive",
                sche: "homeKitCameraActive",
                characteristic: Characteristic.HomeKitCameraActive,
                deprecated: false,
                UUID: "0000021B-0000-1000-8000-0026BB765291",
                description: "Is the HomeKit Camera ON/OFF",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   { "OFF": 0,
                     "ON":  1
                   }
              },
         71:  { type: "Hue",
                sche: "hue",
                characteristic: Characteristic.Hue,
                deprecated: false,
                UUID: "00000013-0000-1000-8000-0026BB765291",
                description: "The Measured Hue",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 360,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         72:  { type: "Identifier",   // HomeKitTypes-Television
                sche: "identifier",   // HomeKitTypes-Television
                characteristic: Characteristic.Identifier,
                deprecated: false,
                UUID: "000000E6-0000-1000-8000-0026BB765291",
                description: "The Devices Identifier",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         73:  { type: "Identify",
                sche: "identify",
                characteristic: Characteristic.Identify,
                deprecated: false,
                UUID: "00000014-0000-1000-8000-0026BB765291",
                description: "The Devices Identify Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         74:  { type: "ImageMirroring",
                sche: "imageMirroring",
                characteristic: Characteristic.ImageMirroring,
                deprecated: false,
                UUID: "0000011F-0000-1000-8000-0026BB765291",
                description: "Is Image Being Mirrored",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         75:  { type: "ImageRotation",
                sche: "imageRotation",
                characteristic: Characteristic.ImageRotation,
                deprecated: false,
                UUID: "0000011E-0000-1000-8000-0026BB765291",
                description: "The Images Degree of Rotation ",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 360,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         76:  { type: "InUse",
                sche: "inUse",
                characteristic: Characteristic.InUse,
                deprecated: false,
                UUID: "000000D2-0000-1000-8000-0026BB765291",
                description: "Is the Device In Use",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_IN_USE": Characteristic.InUse.NOT_IN_USE,
                    "IN_USE":     Characteristic.InUse.IN_USE
                   }
              },
         77:  { type: "InputDeviceType",   // HomeKitTypes-Television
                sche: "inputDeviceType",   // HomeKitTypes-Television
                characteristic: Characteristic.InputDeviceType,
                deprecated: false,
                UUID: "000000DC-0000-1000-8000-0026BB765291",
                description: "The Input Devices Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 6,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "inputSourceType",   // HomeKitTypes-Television
                characteristic: Characteristic.InputSourceType,
                deprecated: false,
                UUID: "000000DB-0000-1000-8000-0026BB765291",
                description: "The Input Devices Source Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 10,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
                sche: "isConfigured",
                characteristic: Characteristic.IsConfigured,
                deprecated: false,
                UUID: "000000D6-0000-1000-8000-0026BB765291",
                description: "Is the device Configured",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020
                   {"NOT_CONFIGURED": Characteristic.IsConfigured.NOT_CONFIGURED,
                    "CONFIGURED":     Characteristic.IsConfigured.CONFIGURED
                    }
              },
         80:  { type: "LeakDetected",
                sche: "leakDetected",
                characteristic: Characteristic.LeakDetected,
                deprecated: false,
                UUID: "00000070-0000-1000-8000-0026BB765291",
                description: "Is There a Leak Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"LEAK_NOT_DETECTED": Characteristic.LeakDetected.LEAK_NOT_DETECTED,
                    "LEAK_DETECTED":     Characteristic.LeakDetected.LEAK_DETECTED
                   }
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         81:  { type: "LinkQuality",   // HomeKitTypes-Bridge
                sche: "linkQuality",   // HomeKitTypes-Bridge
                characteristic: Characteristic.LinkQuality,
                deprecated: true,
                UUID: "0000009C-0000-1000-8000-0026BB765291",
                description: "The Links Quality",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 4,
                        minValue: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         82:  { type: "ListPairings",   // HomeKitTypes-Bridge
                sche: "listPairings",   // HomeKitTypes-Bridge
                characteristic: Characteristic.ListPairings,
                deprecated: false,
                UUID: "00000050-0000-1000-8000-0026BB765291",
                description: "The Links Quality",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         83:  { type: "LockControlPoint",
                sche: "lockControlPoint",
                characteristic: Characteristic.LockControlPoint,
                deprecated: false,
                UUID: "00000019-0000-1000-8000-0026BB765291",
                description: "The Control Point of the Lock",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                   perms: [hapPerms.WRITE
                          ]
                       },
                validValues: {}
              },
         84:  { type: "LockCurrentState",
                sche: "lockCurrentState",
                characteristic: Characteristic.LockCurrentState,
                deprecated: false,
                UUID: "0000001D-0000-1000-8000-0026BB765291",
                description: "The Locks Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.LockTargetState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"UNSECURED": Characteristic.LockCurrentState.UNSECURED,
                    "SECURED":   Characteristic.LockCurrentState.SECURED,
                    "JAMMED":    Characteristic.LockCurrentState.JAMMED,
                    "UNKNOWN":   Characteristic.LockCurrentState.UNKNOWN
                   }
              },
         85:  { type: "LockLastKnownAction",
                sche: "lockLastKnownAction",
                characteristic: Characteristic.LockLastKnownAction,
                deprecated: false,
                UUID: "0000001C-0000-1000-8000-0026BB765291",
                description: "The Locks Last known Action",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 10,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
         86:  { type: "LockManagementAutoSecurityTimeout",
                sche: "lockManagementAutoSecurityTimeout",
                characteristic: Characteristic.LockManagementAutoSecurityTimeout,
                deprecated: false,
                UUID: "0000001A-0000-1000-8000-0026BB765291",
                description: "The Locks Security Timeout Value",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        unit: hapUnits.SECONDS,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         87:  { type: "LockPhysicalControls",
                sche: "lockPhysicalControls",
                characteristic: Characteristic.LockPhysicalControls,
                deprecated: false,
                UUID: "000000A7-0000-1000-8000-0026BB765291",
                description: "Is the Lock Physically Enabled/Disabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"CONTROL_LOCK_DISABLED": Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED,
                    "CONTROL_LOCK_ENABLED":  Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED
                   }
              },
         88:  { type: "LockTargetState",
                sche: "lockTargetState",
                characteristic: Characteristic.LockTargetState,
                deprecated: false,
                UUID: "0000001E-0000-1000-8000-0026BB765291",
                description: "The Locks Requested State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.LockCurrentState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"UNSECURED": Characteristic.LockTargetState.UNSECURED,
                    "SECURED":   Characteristic.LockTargetState.SECURED
                   }
              },
         89:  { type: "Logs",
                sche: "logs",
                characteristic: Characteristic.Logs,
                deprecated: false,
                UUID: "0000001F-0000-1000-8000-0026BB765291",
                description: "The Devices Logs",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         90:  { type: "MACRetransmissionMaximum",  // HomekitTypes.d.ts
                sche: "macRetransmissionMaximum",  // HomekitTypes.d.ts
                characteristic: Characteristic.MACRetransmissionMaximum,
                deprecated: false,
                UUID: "00000247-0000-1000-8000-0026BB765291",
                description: "The Devices MAC Retransmission Maximum Amount",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         91:  { type: "MACTransmissionCounters",  // HomekitTypes.d.ts
                sche: "macTransmissionCounters",  // HomekitTypes.d.ts
                characteristic: Characteristic.MACTransmissionCounters,
                deprecated: false,
                UUID: "00000248-0000-1000-8000-0026BB765291",
                description: "The Devices MAC Transmission Counters",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: hapFormats.DATA,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         92:  { type: "ManagedNetworkEnable",   // HomeKit
                sche: "managedNetworkEnable",   // HomeKit
                characteristic: Characteristic.ManagedNetworkEnable,
                deprecated: false,
                UUID: "00000215-0000-1000-8000-0026BB765291",
                description: "The Networks Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE
                               ]
                       },
                validValues:
                       { "DISABLED": Characteristic.ManagedNetworkEnable.DISABLED,
                         "ENABLED":  Characteristic.ManagedNetworkEnable.ENABLED,
                         "UNKNOWN":  2
                       }
              },
         93:  { type: "ManuallyDisabled",
                sche: "manuallyDisabled",
                characteristic: Characteristic.ManuallyDisabled,
                deprecated: false,
                UUID: "00000227-0000-1000-8000-0026BB765291",
                description: "Is the Device Manually Enabled/Disabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { "ENABLED":  Characteristic.ManuallyDisabled.ENABLED,
                         "DISABLED": Characteristic.ManuallyDisabled.DISABLED
                       }
              },
         94:  { type: "Manufacturer",
                sche: "manufacturer",
                characteristic: Characteristic.Manufacturer,
                deprecated: false,
                UUID: "00000020-0000-1000-8000-0026BB765291",
                description: "The Devices Manufacturer",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         95:  { type: "Model",
                sche: "model",
                characteristic: Characteristic.Model,
                deprecated: false,
                UUID: "00000021-0000-1000-8000-0026BB765291",
                description: "The Devices Model",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         96:  { type: "MotionDetected",
                sche: "motionDetected",
                characteristic: Characteristic.MotionDetected,
                deprecated: false,
                UUID: "00000022-0000-1000-8000-0026BB765291",
                description: "Is Motion Being Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         97:  { type: "Mute",
                sche: "mute",
                characteristic: Characteristic.Mute,
                deprecated: false,
                UUID: "0000011A-0000-1000-8000-0026BB765291",
                description: "Is the Device Currently Muted",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         98:  { type: "Name",
                sche: "name",
                characteristic: Characteristic.Name,
                deprecated: false,
                UUID: "00000023-0000-1000-8000-0026BB765291",
                description: "Name of accessory, as displayed in HomeKit",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         99:  { type: "NetworkAccessViolationControl",  // HomeKitTypes.d.ts
                sche: "networkAccessViolationControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkAccessViolationControl,
                deprecated: false,
                UUID: "0000021F-0000-1000-8000-0026BB765291",
                description: "The Network AccessViolation Control",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE,
                                hapPerms.WRITE_RESPONSE
                          ]
                       },
                validValues: {}
              },
        100:  { type: "NetworkClientProfileControl",  // HomeKitTypes.d.ts
                sche: "networkClientProfileControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkClientProfileControl,
                deprecated: false,
                UUID: "0000020C-0000-1000-8000-0026BB765291",
                description: "The Network Client Profile Control",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         101: { type: "NetworkClientStatusControl",  // HomeKitTypes.d.ts
                sche: "networkClientStatusControl",  // HomeKitTypes.d.ts
                characteristic: Characteristic.NetworkClientStatusControl,
                deprecated: false,
                UUID: "0000020D-0000-1000-8000-0026BB765291",
                description: "The Network Client Status Control",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         102: { type: "NightVision",
                sche: "nightVision",
                characteristic: Characteristic.NightVision,
                deprecated: false,
                UUID: "0000011B-0000-1000-8000-0026BB765291",
                description: "Is Night Vision Available",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         103: { type: "NitrogenDioxideDensity",
                sche: "nitrogenDioxideDensity",
                characteristic: Characteristic.NitrogenDioxideDensity,
                deprecated: false,
                UUID: "000000C4-0000-1000-8000-0026BB765291",
                description: "The Measured NO2 Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         104: { type: "ObstructionDetected",
                sche: "obstructionDetected",
                characteristic: Characteristic.ObstructionDetected,
                deprecated: false,
                UUID: "00000024-0000-1000-8000-0026BB765291",
                description: "Is Obstruction Currently Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         105: { type: "OccupancyDetected",
                sche: "occupancyDetected",
                characteristic: Characteristic.OccupancyDetected,
                deprecated: false,
                UUID: "00000071-0000-1000-8000-0026BB765291",
                description: "Is Occupancy Currently Detected",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"OCCUPANCY_NOT_DETECTED":
                       Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
                    "OCCUPANCY_DETECTED":
                        Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
                   }
              },
         106: { type: "On",
                sche: "on",
                characteristic: Characteristic.On,
                deprecated: false,
                UUID: "00000025-0000-1000-8000-0026BB765291",
                description: "Is the Device On",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         107: { type: "OperatingStateResponse",  // HomeKitTypes.d.ts
                sche: "operatingStateResponse",  // HomeKitTypes.d.ts
                characteristic: Characteristic.OperatingStateResponse,
                deprecated: false,
                UUID: "00000232-0000-1000-8000-0026BB765291",
                description: "The Devices Operating State Response",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                          ]
                       },
                validValues: {}
              },
         108: { type: "OpticalZoom",
                sche: "opticalZoom",
                characteristic: Characteristic.OpticalZoom,
                deprecated: false,
                UUID: "0000011C-0000-1000-8000-0026BB765291",
                description: "The Devices Optical Zoom Factor",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        minStep: .1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         109: { type: "OutletInUse",
                sche: "outletInUse",
                characteristic: Characteristic.OutletInUse,
                deprecated: false,
                UUID: "00000026-0000-1000-8000-0026BB765291",
                description: "Is the Outlet in Use",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         110: { type: "OzoneDensity",
                sche: "ozoneDensity",
                characteristic: Characteristic.OzoneDensity,
                deprecated: false,
                UUID: "000000C3-0000-1000-8000-0026BB765291",
                description: "The Ozones Current Measured Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         111: { type: "PM10Density",
                sche: "pm10Density",
                characteristic: Characteristic.PM10Density,
                deprecated: false,
                UUID: "000000C7-0000-1000-8000-0026BB765291",
                description: "The PM1O Current Measured Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         112: { type: "PM2_5Density",
                sche: "pm2_5Density",
                characteristic: Characteristic.PM2_5Density,
                deprecated: false,
                UUID: "000000C6-0000-1000-8000-0026BB765291",
                description: "The PM2_5 Current Measured Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         113: { type: "PairSetup",
                sche: "pairSetup",
                characteristic: Characteristic.PairSetup,
                deprecated: false,
                UUID: "0000004C-0000-1000-8000-0026BB765291",
                description: "The Devices Pair Setup",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         114: { type: "PairVerify",
                sche: "pairVerify",
                characteristic: Characteristic.PairVerify,
                deprecated: false,
                UUID: "0000004E-0000-1000-8000-0026BB765291",
                description: "The Devices Pair Verify",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         115: { type: "PairingFeatures",
                sche: "pairingFeatures",
                characteristic: Characteristic.PairingFeatures,
                deprecated: false,
                UUID: "0000004F-0000-1000-8000-0026BB765291",
                description: "The Devices Pairing Features",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         116: { type: "PairingPairings",
                sche: "pairingPairings",
                characteristic: Characteristic.PairingPairings,
                deprecated: false,
                UUID: "00000050-0000-1000-8000-0026BB765291",
                description: "The Devices Pairing Pairings",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         117: { type: "PasswordSetting",  // HomeKitTypes.d.ts
                sche: "passwordSetting",  // HomeKitTypes.d.ts
                characteristic: Characteristic.PasswordSetting,
                deprecated: false,
                UUID: "000000E4-0000-1000-8000-0026BB765291",
                description: "The Devices Password Setting",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         118: { type: "PeriodicSnapshotsActive",  // HomeKitTypes.d.ts
                sche: "periodicSnapshotsActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.PeriodicSnapshotsActive,
                deprecated: false,
                UUID: "00000225-0000-1000-8000-0026BB765291",
                description: "Is the Periodic Snapshot Enabled/Disabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"DISABLE": Characteristic.PeriodicSnapshotsActive.DISABLE,          // 0
                    "ENABLE":  Characteristic.PeriodicSnapshotsActive.ENABLE            // 1
                   }
              },
         119: { type: "PictureMode",   // HomeKitTypes-Television
                sche: "pictureMode",   // HomeKitTypes-Television
                characteristic: Characteristic.PictureMode,
                deprecated: false,
                UUID: "000000E2-0000-1000-8000-0026BB765291",
                description: "The Current Picture Mode",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 13,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
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
         120: { type: "Ping",  // HomeKitTypes.d.ts
                sche: "ping",  // HomeKitTypes.d.ts
                characteristic: Characteristic.Ping,
                deprecated: false,
                UUID: "0000023C-0000-1000-8000-0026BB765291",
                description: "The Devices Ping Characteristic",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: hapFormats.DATA,
                        allowedWordCount: 0,
                         perms: [hapPerms.PAIRED_READ
                                ]
                       },
                validValues: {}
              },
         121: { type: "PositionState",
                sche: "positionState",
                characteristic: Characteristic.PositionState,
                deprecated: false,
                UUID: "00000072-0000-1000-8000-0026BB765291",
                description: "The Devices Position State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"DECREASING": Characteristic.PositionState.DECREASING,
                    "INCREASING": Characteristic.PositionState.INCREASING,
                    "STOPPED":    Characteristic.PositionState.STOPPED
                   }
              },
         122: { type: "PowerModeSelection",  // HomeKitTypes-Television
                sche: "powerModeSelection",  // HomeKitTypes-Television
                characteristic: Characteristic.PowerModeSelection,
                deprecated: false,
                UUID: "000000DF-0000-1000-8000-0026BB765291",
                description: "The Devices Power Mode Selection",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues:
                   {"SHOW": Characteristic.PowerModeSelection.SHOW,
                    "HIDE": Characteristic.PowerModeSelection.HIDE
                   }
              },
         123: { type: "ProductData",  // HomeKitTypes.d.ts
                sche: "productData",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ProductData,
                deprecated: false,
                UUID: "00000220-0000-1000-8000-0026BB765291",
                description: "The Devices Product Data",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: hapFormats.DATA,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         124: { type: "ProgramMode",
                sche: "programMode",
                characteristic: Characteristic.ProgramMode,
                deprecated: false,
                UUID: "000000D1-0000-1000-8000-0026BB765291",
                description: "The Devices Program Mode",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NO_PROGRAM_SCHEDULED":
                      Characteristic.ProgramMode.NO_PROGRAM_SCHEDULED,
                    "PROGRAM_SCHEDULED":
                       Characteristic.ProgramMode.PROGRAM_SCHEDULED,
                    "PROGRAM_SCHEDULED_MANUAL_MODE":
                        Characteristic.ProgramMode.PROGRAM_SCHEDULED_MANUAL_MODE_
                   }
              },
         125: { type: "ProgrammableSwitchEvent",
                sche: "programmableSwitchEvent",
                characteristic: Characteristic.ProgrammableSwitchEvent,
                deprecated: false,
                UUID: "00000073-0000-1000-8000-0026BB765291",
                description: "The Devices Current Position State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"SINGLE_PRESS": Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
                    "DOUBLE_PRESS": Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS,
                    "LONG_PRESS":   Characteristic.ProgrammableSwitchEvent.LONG_PRESS
                   }
              },
         126: { type: "ProgrammableSwitchOutputState",   // HomeKitTypes-Bridge
                sche: "programmableSwitchOutputState",   // HomeKitTypes-Bridge
                characteristic: Characteristic.ProgrammableSwitchOutputState,
                deprecated: false,
                UUID: "00000074-0000-1000-8000-0026BB765291",
                description: "The Programmable Switches Output State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         127: { type: "Reachable",   // HomeKitTypes-Bridge
                sche: "reachable",   // HomeKitTypes-Bridge
                characteristic: Characteristic.Reachable,
                deprecated: true,
                UUID: "00000063-0000-1000-8000-0026BB765291",
                description: "If the Device is Reachable",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         128: { type: "ReceivedSignalStrengthIndication",  // HomeKit
                sche: "receivedSignalStrengthIndication",  // HomeKit
                characteristic: Characteristic.ReceivedSignalStrengthIndication,
                deprecated: false,
                UUID: "0000023F-0000-1000-8000-0026BB765291",
                description: "The Received Signal Strength Measurement",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         129: { type: "ReceiverSensitivity",  // HomeKitTypes.d.ts
                sche: "receiverSensitivity",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ReceiverSensitivity,
                deprecated: false,
                UUID: "00000244-0000-1000-8000-0026BB765291",
                description: "The Amount of Receiver Sensitivity",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         130: { type: "RecordingAudioActive",  // HomeKitTypes.d.ts
                sche: "recordingAudioActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.RecordingAudioActive,
                deprecated: false,
                UUID: "00000226-0000-1000-8000-0026BB765291",
                description: "Is Recordding Audio Enabled/DisAbled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE
                               ]
                       },
                validValues:
                   {"DISABLE": Characteristic.RecordingAudioActive.DISABLE,   // CHECK
                    "ENABLE":  Characteristic.RecordingAudioActive.ENABLE
                   }
              },
         131: { type: "RelativeHumidityDehumidifierThreshold",
                sche: "relativeHumidityDehumidifierThreshold",
                characteristic: Characteristic.RelativeHumidityDehumidifierThreshold,
                deprecated: false,
                UUID: "000000C9-0000-1000-8000-0026BB765291",
                description: "The Relative Humidity DeHumidifier Threshold",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         132: { type: "RelativeHumidityHumidifierThreshold",
                sche: "relativeHumidityHumidifierThreshold",
                characteristic: Characteristic.RelativeHumidityHumidifierThreshold,
                deprecated: false,
                UUID: "000000CA-0000-1000-8000-0026BB765291",
                description: "The Relative Humidity Humidifier Threshold",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         133: { type: "RelayControlPoint",   // HomeKitTypes-Bridge
                sche: "relayControlPoint",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayControlPoint,
                deprecated: false,
                UUID: "0000005E-0000-1000-8000-0026BB765291",
                description: "The Relay Control Point",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         134: { type: "RelayEnabled",   // HomeKitTypes-Bridge
                sche: "relayEnabled",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayEnabled,
                deprecated: false,
                UUID: "0000005B-0000-1000-8000-0026BB765291",
                description: "Is the Relay Currently Enabled",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         135: { type: "RelayState",   // HomeKitTypes-Bridge
                sche: "relayState",   // HomeKitTypes-Bridge
                characteristic: Characteristic.RelayState,
                deprecated: false,
                UUID: "0000005C-0000-1000-8000-0026BB765291",
                description: "The Relays Current State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 5,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         136: { type: "RemainingDuration",
                sche: "remainingDuration",
                characteristic: Characteristic.RemainingDuration,
                deprecated: false,
                UUID: "000000D4-0000-1000-8000-0026BB765291",
                description: "The Remaining Duration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        maxValue: 3600,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         137: { type: "RemoteKey",   // HomeKitTypes-Television
                sche: "remoteKey",   // HomeKitTypes-Television
                characteristic: Characteristic.RemoteKey,
                deprecated: false,
                UUID: "000000E1-0000-1000-8000-0026BB765291",
                description: "The Remote Key",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 16,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.WRITE
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
         138: { type: "ResetFilterIndication",
                sche: "resetFilterIndication",
                characteristic: Characteristic.ResetFilterIndication,
                deprecated: false,
                UUID: "000000AD-0000-1000-8000-0026BB765291",
                description: "If Reset Filter Indication ",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 1,
                        minStep:  1,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         139: { type: "RotationDirection",
                sche: "rotationDirection",
                characteristic: Characteristic.RotationDirection,
                deprecated: false,
                UUID: "00000028-0000-1000-8000-0026BB765291",
                description: "The Current Direction of Rotation",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"CLOCKWISE":
                      Characteristic.RotationDirection.CLOCKWISE,
                    "COUNTER_CLOCKWISE":
                      Characteristic.RotationDirection.COUNTER_CLOCKWISE
                   }
              },
         140: { type: "RotationSpeed",
                sche: "rotationSpeed",
                characteristic: Characteristic.RotationSpeed,
                deprecated: false,
                UUID: "00000029-0000-1000-8000-0026BB765291",
                description: "The Current Speed of Rotation",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         141: { type: "RouterStatus",  // HomeKitTypes.d.ts
                sche: "routerStatus",  // HomeKitTypes.d.ts
                characteristic: Characteristic.RouterStatus,
                deprecated: false,
                UUID: "0000020E-0000-1000-8000-0026BB765291",
                description: "The Current Router Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {"READY"     : Characteristic.RouterStatus.READY,     // 0
                              "NOT_READY" : Characteristic.RouterStatus.NOT_READY  // 1
                             }
              },
         142: { type: "Saturation",
                sche: "saturation",
                characteristic: Characteristic.Saturation,
                deprecated: false,
                UUID: "0000002F-0000-1000-8000-0026BB765291",
                description: "The Percentage of Color Saturation",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         143: { type: "SecuritySystemAlarmType",  // Checked 03/17/21
                sche: "securitySystemAlarmType",  // Checked 03/17/21
                characteristic: Characteristic.SecuritySystemAlarmType,
                deprecated: false,
                UUID: "0000008E-0000-1000-8000-0026BB765291",
                description: "The Security System Alarm Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         144: { type: "SecuritySystemCurrentState",
                sche: "securitySystemCurrentState",
                characteristic: Characteristic.SecuritySystemCurrentState,
                deprecated: false,
                UUID: "00000066-0000-1000-8000-0026BB765291",
                description: "The Security Systems Currently Armed State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.SecuritySystemTargetState,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 4,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
         145: { type: "SecuritySystemTargetState",
                sche: "securitySystemTargetState",
                characteristic: Characteristic.SecuritySystemTargetState,
                deprecated: false,
                UUID: "00000067-0000-1000-8000-0026BB765291",
                description: "The Target Armed State of the Security System",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.SecuritySystemCurrentState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                {"STAY_ARM":  Characteristic.SecuritySystemTargetState.STAY_ARM,
                 "AWAY_ARM":  Characteristic.SecuritySystemTargetState.AWAY_ARM,
                 "NIGHT_ARM": Characteristic.SecuritySystemTargetState.NIGHT_ARM,
                 "DISARM":    Characteristic.SecuritySystemTargetState.DISARM
                }
              },
         146: { type: "SelectedAudioStreamConfiguration",  // HomeKit-Remote
                sche: "selectedAudioStreamConfiguration",  // HomeKit-Remote
                characteristic: Characteristic.SelectedAudioStreamConfiguration,
                deprecated: false,
                UUID: "00000128-0000-1000-8000-0026BB765291",
                description: "The Selected Audio Stream Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues: {}
              },
         147: { type: "SelectedCameraRecordingConfiguration",  // HomeKitTypes.d.ts
                sche: "selectedCameraRecordingConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SelectedCameraRecordingConfiguration,
                deprecated: false,
                UUID: "00000209-0000-1000-8000-0026BB765291",
                description: "The Selected Cameras Recording Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         148: { type: "SelectedRTPStreamConfiguration",
                sche: "selectedRTPStreamConfiguration",
                characteristic: Characteristic.SelectedRTPStreamConfiguration,
                deprecated: false,
                UUID: "00000117-0000-1000-8000-0026BB765291",
                description: "The Selected RTP Stream Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         149: { type: "SerialNumber",
                sche: "serialNumber",
                characteristic: Characteristic.SerialNumber,
                deprecated: false,
                UUID: "00000030-0000-1000-8000-0026BB765291",
                description: "The Devices Serial Number",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         150: { type: "ServiceLabelIndex",
                sche: "serviceLabelIndex",
                characteristic: Characteristic.ServiceLabelIndex,
                deprecated: false,
                UUID: "000000CB-0000-1000-8000-0026BB765291",
                description: "The Devices Service Label Index",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 255,
                        minValue: 1,
                        minStep:  1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         151: { type: "ServiceLabelNamespace",
                sche: "serviceLabelNamespace",
                characteristic: Characteristic.ServiceLabelNamespace,
                deprecated: false,
                UUID: "000000CD-0000-1000-8000-0026BB765291",
                description: "The Devices Service Label NameSpace",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues:
                   {"DOTS":            Characteristic.ServiceLabelNamespace.DOTS,
                    "ARABIC_NUMERALS": Characteristic.ServiceLabelNamespace.ARABIC_NUMERALS
                   }
              },
         152: { type: "SetDuration",
                sche: "setDuration",
                characteristic: Characteristic.SetDuration,
                deprecated: false,
                UUID: "000000D3-0000-1000-8000-0026BB765291",
                description: "The Devices Set Duration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        maxValue: 3600,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         153: { type: "SetupDataStreamTransport",  // HomeKit-DataStream
                sche: "setupDataStreamTransport",  // HomeKit-DataStream
                characteristic: Characteristic.SetupDataStreamTransport,
                deprecated: false,
                UUID: "00000131-0000-1000-8000-0026BB765291",
                description: "The Devices Setup Stream Transport Value",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         154: { type: "SetupEndpoints",
                sche: "setupEndpoints",
                characteristic: Characteristic.SetupEndpoints,
                deprecated: false,
                UUID: "00000118-0000-1000-8000-0026BB765291",
                description: "The Devices Setup End Points",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE
                               ]
                       },
                validValues: {}
              },
         155: { type: "SetupTransferTransport",  // HomeKitTypes.d.ts
                sche: "setupTransferTransport",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SetupTransferTransport,
                deprecated: false,
                UUID: "00000201-0000-1000-8000-0026BB765291",
                description: "The Devices Setup Transfer Transport",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         156: { type: "SignalToNoiseRatio",  // HomeKit
                sche: "signalToNoiseRatio",  // HomeKit
                characteristic: Characteristic.SignalToNoiseRatio,
                deprecated: false,
                UUID: "00000241-0000-1000-8000-0026BB765291",
                description: "The Measured Signal to Noise Ratio",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         157: { type: "SiriInputType",  // HomeKit-Remote
                sche: "siriInputType",  // HomeKit-Remote
                characteristic: Characteristic.SiriInputType,
                deprecated: false,
                UUID: "00000132-0000-1000-8000-0026BB765291",
                description: "siri's Input Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 0,
                        minValue: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: { // Check
                      "PUSH_BUTTON_TRIGGERED_APPLE_TV": Characteristic.SiriInputType.PUSH_BUTTON_TRIGGERED_APPLE_TV
                }
              },
         158: { type: "SlatType",
                sche: "slatType",
                characteristic: Characteristic.SlatType,
                deprecated: false,
                UUID: "000000C0-0000-1000-8000-0026BB765291",
                description: "The Slat Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues:
                   {"HORIZONTAL": Characteristic.SlatType.HORIZONTAL,
                    "VERTICAL":   Characteristic.SlatType.VERTICAL
                   }
              },
         159: { type: "SleepDiscoveryMode",   // HomeKitTypes-Television
                sche: "sleepDiscoveryMode",   // HomeKitTypes-Television
                characteristic: Characteristic.SleepDiscoveryMode,
                deprecated: false,
                UUID: "000000E8-0000-1000-8000-0026BB765291",
                description: "The Devices Discoverable Sleep Mode",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_DISCOVERABLE":    Characteristic.SleepDiscoveryMode.NOT_DISCOVERABLE ,
                    "ALWAYS_DISCOVERABLE": Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
                   }
              },
         160: { type: "SleepInterval",  // HomeKitTypes.d.ts
                sche: "sleepInterval",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SleepInterval,
                deprecated: false,
                UUID: "0000023A-0000-1000-8000-0026BB765291",
                description: "The Devices Sleep Interval",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         161: { type: "SmokeDetected",
                sche: "smokeDetected",
                characteristic: Characteristic.SmokeDetected,
                deprecated: false,
                UUID: "00000076-0000-1000-8000-0026BB765291",
                description: "If Smoke is Detected or Not",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"SMOKE_NOT_DETECTED": Characteristic.SmokeDetected.SMOKE_NOT_DETECTED,
                    "SMOKE_DETECTED":     Characteristic.SmokeDetected.SMOKE_DETECTED
                   }
              },
         162: { type: "SoftwareRevision",  // HomeKit-Bridge
                sche: "softwareRevision",  // HomeKit-Bridge
                characteristic: Characteristic.SoftwareRevision,
                deprecated: false,
                UUID: "00000054-0000-1000-8000-0026BB765291",
                description: "The Devices Software Revision String",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         163: { type: "StatusActive",
                sche: "statusActive",
                characteristic: Characteristic.StatusActive,
                deprecated: false,
                UUID: "00000075-0000-1000-8000-0026BB765291",
                description: "If the Device is Active or Not",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                     "TRUE": 1
                   }
              },
         164: { type: "StatusFault",
                sche: "statusFault",
                characteristic: Characteristic.StatusFault,
                deprecated: false,
                UUID: "00000077-0000-1000-8000-0026BB765291",
                description: "If the Device has a Status Fault",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NO_FAULT":      Characteristic.StatusFault.NO_FAULT,
                     "GENERAL_FAULT": Characteristic.StatusFault.GENERAL_FAULT
                   }
              },
         165: { type: "StatusJammed",
                sche: "statusJammed",
                characteristic: Characteristic.StatusJammed,
                deprecated: false,
                UUID: "00000078-0000-1000-8000-0026BB765291",
                description: "If the Device is in Jammed Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_JAMMED": Characteristic.StatusJammed.NOT_JAMMED,
                    "JAMMED":     Characteristic.StatusJammed.JAMMED
                   }
              },
         166: { type: "StatusLowBattery",
                sche: "statusLowBattery",
                characteristic: Characteristic.StatusLowBattery,
                deprecated: false,
                UUID: "00000079-0000-1000-8000-0026BB765291",
                description: "The Status of the Battery Level",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"BATTERY_LEVEL_NORMAL":
                      Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL,
                    "BATTERY_LEVEL_LOW":
                      Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
                   }
              },
         167: { type: "StatusTampered",
                sche: "statusTampered",
                characteristic: Characteristic.StatusTampered,
                deprecated: false,
                UUID: "0000007A-0000-1000-8000-0026BB765291",
                description: "If the Device is Tampered",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"NOT_TAMPERED": Characteristic.StatusTampered.NOT_TAMPERED,
                    "TAMPERED":     Characteristic.StatusTampered.TAMPERED
                   }
              },
         168: { type: "StreamingStatus",
                sche: "streamingStatus",
                characteristic: Characteristic.StreamingStatus,
                deprecated: false,
                UUID: "00000120-0000-1000-8000-0026BB765291",
                description: "The Devices Streaming Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         169: { type: "SulphurDioxideDensity",
                sche: "sulphurDioxideDensity",
                characteristic: Characteristic.SulphurDioxideDensity,
                deprecated: false,
                UUID: "000000C5-0000-1000-8000-0026BB765291",
                description: "The measured Sulphur Dioxide Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         170: { type: "SupportedAudioRecordingConfiguration",
                sche: "supportedAudioRecordingConfiguration",
                characteristic: Characteristic.SupportedAudioRecordingConfiguration,
                deprecated: false,
                UUID: "00000207-0000-1000-8000-0026BB765291",
                description: "The Supported Audio Recording Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         171: { type: "SupportedAudioStreamConfiguration",   // HomeKit
                sche: "supportedAudioStreamConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedAudioStreamConfiguration,
                deprecated: false,
                UUID: "00000115-0000-1000-8000-0026BB765291",
                description: "The Supported Audio Stream Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         172: { type: "SupportedCameraRecordingConfiguration",   // HomeKit
                sche: "supportedCameraRecordingConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedCameraRecordingConfiguration,
                deprecated: false,
                UUID: "00000205-0000-1000-8000-0026BB765291",
                description: "The Supported Audio Recording Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         173: { type: "SupportedDataStreamTransportConfiguration",   // HomeKit-DataStream
                sche: "supportedDataStreamTransportConfiguration",   // HomeKit-DataStream
                characteristic: Characteristic.SupportedDataStreamTransportConfiguration,
                deprecated: false,
                UUID: "00000130-0000-1000-8000-0026BB765291",
                description: "The Supported Data Stream Transport Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         174: { type: "SupportedCharacteristicValueTransitionConfiguration",   // HomeKit
                sche: "supportedCharacteristicValueTransitionConfiguration",   // HomeKit
                characteristic: Characteristic.SupportedCharacteristicValueTransitionConfiguration,
                deprecated: false,
                UUID: "00000144-0000-1000-8000-0026BB765291",
                description: "The Supported Characteristic Value Transition Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         175: { type: "SupportedDiagnosticsSnapshot",  // HomeKitTypes.d.ts
                sche: "supportedDiagnosticsSnapshot",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SupportedDiagnosticsSnapshot,
                deprecated: false,
                UUID: "00000238-0000-1000-8000-0026BB765291",
                description: "The Supported Diagnostic Snapshot",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         176: { type: "SupportedRTPConfiguration",
                sche: "supportedRTPConfiguration",
                characteristic: Characteristic.SupportedRTPConfiguration,
                deprecated: false,
                UUID: "00000116-0000-1000-8000-0026BB765291",
                description: "The Supported RTP Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         177: { type: "SupportedRouterConfiguration",  // HomeKitTypes.d.ts
                sche: "supportedRouterConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.SupportedRouterConfiguration,
                deprecated: false,
                UUID: "00000210-0000-1000-8000-0026BB765291",
                description: "The Supported Router Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         178: { type: "SupportedTransferTransportConfiguration",  // HomeKit
                sche: "supportedTransferTransportConfiguration",  // HomeKit
                characteristic: Characteristic.SupportedTransferTransportConfiguration,
                deprecated: false,
                UUID: "00000202-0000-1000-8000-0026BB765291",
                description: "The Supported Transfer Transport Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         179: { type: "SupportedVideoRecordingConfiguration",
                sche: "supportedVideoRecordingConfiguration",
                characteristic: Characteristic.SupportedVideoRecordingConfiguration,
                deprecated: false,
                UUID: "00000206-0000-1000-8000-0026BB765291",
                description: "The Supported Video Recording Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         180: { type: "SupportedVideoStreamConfiguration",
                sche: "supportedVideoStreamConfiguration",
                characteristic: Characteristic.SupportedVideoStreamConfiguration,
                deprecated: false,
                UUID: "00000114-0000-1000-8000-0026BB765291",
                description: "The Supported Video Stream Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ
                               ]
                       },
                validValues: {}
              },
         181: { type: "SwingMode",
                sche: "swingMode",
                characteristic: Characteristic.SwingMode,
                deprecated: false,
                UUID: "000000B6-0000-1000-8000-0026BB765291",
                description: "The DevicesnCurrent Swing Mode",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },

                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
               validValues:
                  {"SWING_DISABLED": Characteristic.SwingMode.SWING_DISABLED,
                   "SWING_ENABLED": Characteristic.SwingMode.SWING_ENABLED
                  }
              },
         182: { type: "TargetAirPurifierState",
                sche: "targetAirPurifierState",
                characteristic: Characteristic.TargetAirPurifierState,
                deprecated: false,
                UUID: "000000A8-0000-1000-8000-0026BB765291",
                description: "The Requested Target Air Purification State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentAirPurifierState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:   // Checked 04/24/2020
                   {"MANUAL": Characteristic.TargetAirPurifierState.MANUAL,
                    "AUTO":   Characteristic.TargetAirPurifierState.AUTO
                   }
              },
              // @deprecated Removed and not used anymore as of homebridge v2
         183: { type: "TargetAirQuality",
                sche: "targetAirQuality",
                characteristic: Characteristic.TargetAirQuality,
                deprecated: true,
                UUID: "000000AE-0000-1000-8000-0026BB765291",
                description: "The Requested Target Air Quality",
                relatedCurrentAccTypeEnumIndex:
                   // @deprecated Removed and not used anymore as of homebridge v2
                   null,
                   // CMD4_ACC_TYPE_ENUM.AirQuality,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {
                    // @deprecated Removed and not used anymore as of homebridge v2
                    // "EXCELLENT": Characteristic.TargetAirQuality.EXCELLENT,
                    // "GOOD":      Characteristic.TargetAirQuality.GOOD,
                    // "FAIR":      Characteristic.TargetAirQuality.FAIR
                   }
              },
         184: { type: "TargetControlList",   // Homekit-Remote
                sche: "targetControlList",   // Homekit-Remote
                characteristic: Characteristic.TargetControlList,
                deprecated: false,
                UUID: "00000124-0000-1000-8000-0026BB765291",
                description: "The Target Control List",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_WRITE,
                                hapPerms.PAIRED_READ,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         185: { type: "TargetControlSupportedConfiguration",   // Homekit-Remote
                sche: "targetControlSupportedConfiguration",   // Homekit-Remote
                characteristic: Characteristic.TargetControlSupportedConfiguration,
                deprecated: false,
                UUID: "00000123-0000-1000-8000-0026BB765291",
                description: "The Target Supported Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         186: { type: "TargetDoorState",
                sche: "targetDoorState",
                characteristic: Characteristic.TargetDoorState,
                deprecated: false,
                UUID: "00000032-0000-1000-8000-0026BB765291",
                description: "The Doors Requested State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentDoorState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"OPEN":   Characteristic.TargetDoorState.OPEN,
                    "CLOSED": Characteristic.TargetDoorState.CLOSED
                   }
              },
         187: { type: "TargetFanState",
                sche: "targetFanState",
                characteristic: Characteristic.TargetFanState,
                deprecated: false,
                UUID: "000000BF-0000-1000-8000-0026BB765291",
                description: "The Fans Requested State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentFanState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"MANUAL": Characteristic.TargetFanState.MANUAL,
                    "AUTO": Characteristic.TargetFanState.AUTO
                   }
              },
         188: { type: "TargetHeaterCoolerState",
                sche: "targetHeaterCoolerState",
                characteristic: Characteristic.TargetHeaterCoolerState,
                deprecated: false,
                UUID: "000000B2-0000-1000-8000-0026BB765291",
                description: "The Heaters Requested Cooling State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHeaterCoolerState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"AUTO": Characteristic.TargetHeaterCoolerState.AUTO,
                    "HEAT": Characteristic.TargetHeaterCoolerState.HEAT,
                    "COOL": Characteristic.TargetHeaterCoolerState.COOL
                   }
              },
         189: { type: "TargetHeatingCoolingState",
                sche: "targetHeatingCoolingState",
                characteristic: Characteristic.TargetHeatingCoolingState,
                deprecated: false,
                UUID: "00000033-0000-1000-8000-0026BB765291",
                description: "The Heaters Requested Heating State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"OFF": Characteristic.TargetHeatingCoolingState.OFF,
                    "HEAT": Characteristic.TargetHeatingCoolingState.HEAT,
                    "COOL": Characteristic.TargetHeatingCoolingState.COOL,
                    "AUTO": Characteristic.TargetHeatingCoolingState.AUTO
                   }
              },
         190: { type: "TargetHorizontalTiltAngle",
                sche: "targetHorizontalTiltAngle",
                characteristic: Characteristic.TargetHorizontalTiltAngle,
                deprecated: false,
                UUID: "0000007B-0000-1000-8000-0026BB765291",
                description: "The Requested Horizontal Tilt Angle",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHorizontalTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         191: { type: "TargetHumidifierDehumidifierState",
                sche: "targetHumidifierDehumidifierState",
                characteristic: Characteristic.TargetHumidifierDehumidifierState,
                deprecated: false,
                UUID: "000000B4-0000-1000-8000-0026BB765291",
                description: "The Requested Humidifier/DeHumidifier State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
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
         192: { type: "TargetMediaState",   // HomeKitTypes-Television
                sche: "targetMediaState",   // HomeKitTypes-Television
                characteristic: Characteristic.TargetMediaState,
                deprecated: false,
                UUID: "00000137-0000-1000-8000-0026BB765291",
                description: "The Requested Media State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentMediaState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"PLAY": Characteristic.TargetMediaState.PLAY,
                    "PAUSE": Characteristic.TargetMediaState.PAUSE,
                    "STOP": Characteristic.TargetMediaState.STOP
                   }
              },
         193: { type: "TargetPosition",
                sche: "targetPosition",
                characteristic: Characteristic.TargetPosition,
                deprecated: false,
                UUID: "0000007C-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Position",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentPosition,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         194: { type: "TargetRelativeHumidity",
                sche: "targetRelativeHumidity",
                characteristic: Characteristic.TargetRelativeHumidity,
                deprecated: false,
                UUID: "00000034-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Relative Humidity Level",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         195: { type: "TargetSlatState",
                sche: "targetSlatState",
                characteristic: Characteristic.TargetSlatState,
                deprecated: true,
                UUID: "000000BE-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Slat State",
                relatedCurrentAccTypeEnumIndex:
                   // @deprecated Removed and not used anymore as of homebridge v2
                   null,
                   // CMD4_ACC_TYPE_ENUM.CurrentSlatState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {
                    // @deprecated Removed and not used anymore as of homebridge v2
                    // "MANUAL": Characteristic.TargetSlatState.MANUAL,
                    // "AUTO":   Characteristic.TargetSlatState.AUTO
                   }
              },
         196: { type: "TargetTemperature",
                sche: "targetTemperature",
                characteristic: Characteristic.TargetTemperature,
                deprecated: false,
                UUID: "00000035-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Temperature",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentTemperature,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        unit: hapUnits.CELSIUS,
                        maxValue: 38,
                        minValue: 10,
                        minStep: 0.1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         197: { type: "TargetTiltAngle",
                sche: "targetTiltAngle",
                characteristic: Characteristic.TargetTiltAngle,
                deprecated: false,
                UUID: "000000C2-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Tilt Angle",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit:   hapUnits.ARC_DEGREE,
                        maxValue:  90,
                        minValue: -90,
                        minStep:   1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         198: { type: "TargetVerticalTiltAngle",
                sche: "targetVerticalTiltAngle",
                characteristic: Characteristic.TargetVerticalTiltAngle,
                deprecated: false,
                UUID: "0000007D-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Vertical Tilt Angle",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentVerticalTiltAngle,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        unit: hapUnits.ARC_DEGREE,
                        maxValue: 90,
                        minValue: -90,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         199: { type: "TargetVisibilityState",   // HomeKittypes-Television
                sche: "targetVisibilityState",   // HomeKittypes-Television
                characteristic: Characteristic.TargetVisibilityState,
                deprecated: false,
                UUID: "00000134-0000-1000-8000-0026BB765291",
                description: "The Devices Requested Visibility State",
                relatedCurrentAccTypeEnumIndex: CMD4_ACC_TYPE_ENUM.CurrentVisibilityState,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"SHOWN": Characteristic.TargetVisibilityState.SHOWN,
                    "HIDDEN": Characteristic.TargetVisibilityState.HIDDEN
                   }
              },
         200: { type: "TemperatureDisplayUnits",
                sche: "temperatureDisplayUnits",
                characteristic: Characteristic.TemperatureDisplayUnits,
                deprecated: false,
                UUID: "00000036-0000-1000-8000-0026BB765291",
                description: "The Units to Display the Temperature in",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"CELSIUS":    Characteristic.TemperatureDisplayUnits.CELSIUS,
                    "FAHRENHEIT": Characteristic.TemperatureDisplayUnits.FAHRENHEIT
                    }
              },
         201: { type: "ThirdPartyCameraActive",  // HomeKitTypes.d.ts
                sche: "thirdPartyCameraActive",  // HomeKitTypes.d.ts
                characteristic: Characteristic.ThirdPartyCameraActive,
                deprecated: false,
                UUID: "0000021C-0000-1000-8000-0026BB765291",
                description: "The ON/OFF Auxiliary Camera State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   { "OFF" : Characteristic.ThirdPartyCameraActive.OFF,   // 0 
                     "ON"  : Characteristic.ThirdPartyCameraActive.ON     // 1
                   }
              },
         // @deprecated Removed and not used anymore as of homebridge v2
         202: { type: "TimeUpdate",   // HomeKitTypes-Bridge
                sche: "timeUpdate",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TimeUpdate,
                deprecated: true,
                UUID: "0000009A-0000-1000-8000-0026BB765291",
                description: "Ifnthe Time Should be Updated",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         203: { type: "TransmitPower",   // HomeKitTypes
                sche: "transmitPower",   // HomeKitTypes
                characteristic: Characteristic.TransmitPower,
                deprecated: false,
                UUID: "00000242-0000-1000-8000-0026BB765291",
                description: "The Devices Measured Transmit Power",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         204: { type: "MaximumTransmitPower",
                sche: "MaximumTransmitPower",
                characteristic: Characteristic.MaximumTransmitPower,
                deprecated: false,
                UUID: "00000243-0000-1000-8000-0026BB765291",
                description: "The Devices Maximum Transmit Power",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         205: { type: "TunnelConnectionTimeout",   // HomeKitTypes-Bridge
                sche: "tunnelConnectionTimeout",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunnelConnectionTimeout,
                deprecated: false,
                UUID: "00000061-0000-1000-8000-0026BB765291",
                description: "The Timeout Value of the Tunnel Connection",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.WRITE,    // Reversed in HomeBridge
                                hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         206: { type: "TunneledAccessoryAdvertising",   // HomeKitTypes-Bridge
                sche: "tunneledAccessoryAdvertising",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryAdvertising,
                deprecated: false,
                UUID: "00000060-0000-1000-8000-0026BB765291",
                description: "If the Device is Currently Tunneled Advertising",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.WRITE,   // Reversed in HomeBridge
                                hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         207: { type: "TunneledAccessoryConnected",   // HomeKitTypes-Bridge
                sche: "tunneledAccessoryConnected",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryConnected,
                deprecated: false,
                UUID: "00000059-0000-1000-8000-0026BB765291",
                description: "If the Device is Tunneled Connected ",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.WRITE,   // Reversed in HomeBridge
                                hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"FALSE": 0,
                    "TRUE":  1
                   }
              },
         208: { type: "TunneledAccessoryStateNumber",   // HomeKitTypes-Bridge
                sche: "tunneledAccessoryStateNumber",   // HomeKitTypes-Bridge
                characteristic: Characteristic.TunneledAccessoryStateNumber,
                deprecated: false,
                UUID: "00000058-0000-1000-8000-0026BB765291",
                description: "The Tunneled Accessorys State Number",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.INT,
                        allowedWordCount: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         209: { type: "VOCDensity",
                sche: "vocDensity",
                characteristic: Characteristic.VOCDensity,
                deprecated: false,
                UUID: "000000C8-0000-1000-8000-0026BB765291",
                description: "The Devices Measured VOC Density",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 1000,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         210: { type: "ValveType",
                sche: "valveType",
                characteristic: Characteristic.ValveType,
                deprecated: false,
                UUID: "000000D5-0000-1000-8000-0026BB765291",
                description: "The Devices Valve Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {"GENERIC_VALVE": Characteristic.ValveType.GENERIC_VALVE,
                    "IRRIGATION":    Characteristic.ValveType.IRRIGATION,
                    "SHOWER_HEAD":   Characteristic.ValveType.SHOWER_HEAD,
                    "WATER_FAUCET":  Characteristic.ValveType.WATER_FAUCET
                   }
              },
         211: { type: "Version",
                sche: "version",
                characteristic: Characteristic.Version,
                deprecated: false,
                UUID: "00000037-0000-1000-8000-0026BB765291",
                description: "The Devices Version String",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         212: { type: "VideoAnalysisActive",
                sche: "videoAnalysisActive",
                characteristic: Characteristic.VideoAnalysisActive,
                deprecated: false,
                UUID: "00000229-0000-1000-8000-0026BB765291",
                description: "The Devices Video Analysis Active Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                   {}
              },
         213: { type: "Volume",
                sche: "volume",
                characteristic: Characteristic.Volume,
                deprecated: false,
                UUID: "00000119-0000-1000-8000-0026BB765291",
                description: "The Devices Volume as a Percentage",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        unit: hapUnits.PERCENTAGE,
                        maxValue: 100,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.WRITE,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         214: { type: "VolumeControlType",   // HomeKitTypes-Television
                sche: "volumeControlType",   // HomeKitTypes-Television
                characteristic: Characteristic.VolumeControlType,
                deprecated: false,
                UUID: "000000E9-0000-1000-8000-0026BB765291",
                description: "The Devices Volume Control Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 3,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
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
         215: { type: "VolumeSelector",   // HomeKitTypes-Television
                sche: "volumeSelector",   // HomeKitTypes-Television
                characteristic: Characteristic.VolumeSelector,
                deprecated: false,
                UUID: "000000EA-0000-1000-8000-0026BB765291",
                description: "The Devices Volume Selector",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        minStep:  1,
                        perms: [hapPerms.WRITE
                               ]
                       },
                validValues:
                   {"INCREMENT": Characteristic.VolumeSelector.INCREMENT,
                    "DECREMENT": Characteristic.VolumeSelector.DECREMENT
                   }
              },
         216: { type: "WANConfigurationList",  // HomeKitTypes.d.ts
                sche: "wanConfigurationList",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WANConfigurationList,
                deprecated: false,
                UUID: "00000211-0000-1000-8000-0026BB765291",
                description: "The Devices WAN Configuration List",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         217: { type: "WANStatusList",  // HomeKitTypes.d.ts
                sche: "wanStatusList",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WANStatusList,
                deprecated: false,
                UUID: "00000212-0000-1000-8000-0026BB765291",
                description: "The Devices WAN Status List",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         218: { type: "WakeConfiguration",  // HomeKitTypes.d.ts
                sche: "wakeConfiguration",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WakeConfiguration,
                deprecated: false,
                UUID: "00000222-0000-1000-8000-0026BB765291",
                description: "The Devices Wake Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         219: { type: "WaterLevel",
                sche: "waterLevel",
                characteristic: Characteristic.WaterLevel,
                deprecated: false,
                UUID: "000000B5-0000-1000-8000-0026BB765291",
                description: "The Current Water Level Measurement",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToFloat( str ); },
                props: {format: hapFormats.FLOAT,
                        allowedWordCount: 1,
                        maxValue: 100,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues: {}
              },
         220: { type: "WiFiCapabilities",   // HomeKit
                sche: "wifiCapabilities",   // HomeKit
                characteristic: Characteristic.WiFiCapabilities,
                deprecated: false,
                UUID: "0000022C-0000-1000-8000-0026BB765291",
                description: "The Devices WiFi Capabilities",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues: {}
              },
         221: { type: "WiFiConfigurationControl",   // HomeKit
                sche: "wifiConfigurationControl",   // HomeKit
                characteristic: Characteristic.WiFiConfigurationControl,
                deprecated: false,
                UUID: "0000022D-0000-1000-8000-0026BB765291",
                description: "The Devices WiFi Configuration Control",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.NOTIFY,
                                hapPerms.TIMED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues: {}
              },
         222: { type: "WiFiSatelliteStatus",  // HomeKitTypes.d.ts
                sche: "wifiSatelliteStatus",  // HomeKitTypes.d.ts
                characteristic: Characteristic.WiFiSatelliteStatus,
                deprecated: false,
                UUID: "0000021E-0000-1000-8000-0026BB765291",
                description: "The Devices WiFi Satellite Status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 2,
                        minValue: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { "UNKNOWN": Characteristic.WiFiSatelliteStatus.UNKNOWN,               // 0,   - Check
                         "CONNECTED" : Characteristic.WiFiSatelliteStatus.CONNECTED,          // 1,
                         "NOT_CONNECTED": Characteristic.WiFiSatelliteStatus.NOT_CONNECTED    // 2
                       }
              },

         223: { type: "AssetUpdateReadiness",
                sche: "assetUpdateReadiness",
                characteristic: Characteristic.AssetUpdateReadiness,
                deprecated: false,
                UUID: "00000269-0000-1000-8000-0026BB765291",
                description: "The Devices Asset Update Readiness",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { }
              },
         224: { type: "SupportedAssetTypes",
                sche: "supportedAssetTypes", 
                characteristic: Characteristic.SupportedAssetTypes,
                deprecated: false,
                UUID: "00000268-0000-1000-8000-0026BB765291",
                description: "The Devices Supported Asset types",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         225: { type: "ConfigurationState",
                sche: "configurationState",
                characteristic: Characteristic.ConfigurationState,
                deprecated: false,
                UUID: "00000263-0000-1000-8000-0026BB765291",
                description: "The Devices Configuration State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { }
              },
         226: { type: "NFCAccessControlPoint",
                sche: "NFCAccessControlPoint",
                characteristic: Characteristic.NFCAccessControlPoint,
                deprecated: false,
                UUID: "00000264-0000-1000-8000-0026BB765291",
                description: "The NFC Access Point",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues:
                       { }
              },
         227: { type: "NFCAccessSupportedConfiguration",
                sche: "NFCAccessSupportedConfiguration",
                characteristic: Characteristic.NFCAccessSupportedConfiguration,
                deprecated: false,
                UUID: "00000265-0000-1000-8000-0026BB765291",
                description: "The Devices NFC Access Support Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         228: { type: "SiriEndpointSessionStatus",
                sche: "SiriEndpointSessionStatus",
                characteristic: Characteristic.SiriEndpointSessionStatus,
                deprecated: false,
                UUID: "00000254-0000-1000-8000-0026BB765291",
                description: "The Devices Siri endpoint",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { }
              },
         229: { type: "ThreadControlPoint",
                sche: "threadControlPoint",
                characteristic: Characteristic.ThreadControlPoint,
                deprecated: false,
                UUID: "00000704-0000-1000-8000-0026BB765291",
                description: "The Devices thread control point",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         230: { type: "ThreadNodeCapabilities",
                sche: "threadNodeCapabilities",
                characteristic: Characteristic.ThreadNodeCapabilities,
                deprecated: false,
                UUID: "00000702-0000-1000-8000-0026BB765291",
                description: "The Devices thread node capabilities",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        maxValue: 31,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         231: { type: "ThreadStatus",
                sche: "threadStatus",
                characteristic: Characteristic.ThreadStatus,
                deprecated: false,
                UUID: "00000703-0000-1000-8000-0026BB765291",
                description: "The Devices thread status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        maxValue: 6,
                        minValue: 0,
                        minStep: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.NOTIFY
                               ]
                       },
                validValues:
                       { }
              },
         232: { type: "ThreadOpenThreadVersion",
                sche: "threadOpenThreadVersion",
                characteristic: Characteristic.ThreadOpenThreadVersion,
                deprecated: false,
                UUID: "00000706-0000-1000-8000-0026BB765291",
                description: "The Devices thread version",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         // Added Mar 2024
         233: { type: "AccessCodeControlPoint",
                sche: "accessCodeControlPoint",
                characteristic: Characteristic.AccessCodeControlPoint,
                deprecated: false,
                UUID: "00000262-0000-1000-8000-0026BB765291",
                description: "Access Code Control Point",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues:
                       { }
              },
         234: { type: "AccessCodeSupportedConfiguration",
                sche: "accessCodeSupportedConfiguration",
                characteristic: Characteristic.AccessCodeSupportedConfiguration,
                deprecated: false,
                UUID: "00000261-0000-1000-8000-0026BB765291",
                description: "Access Code Supported Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         235: { type: "AirPlayEnable",
                sche: "airPlayEnable",
                characteristic: Characteristic.AirPlayEnable,
                deprecated: false,
                UUID: "0000025B-0000-1000-8000-0026BB765291",
                description: "Airplay Enable",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         236: { type: "CharacteristicValueActiveTransitionCount",
                sche: "characteristicValueActiveTransitionCount",
                characteristic: Characteristic.CharacteristicValueActiveTransitionCount,
                deprecated: false,
                UUID: "0000024B-0000-1000-8000-0026BB765291",
                description: "Characteristic Value Active Transition Count",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         237: { type: "CryptoHash",
                sche: "cryptoHash",
                characteristic: Characteristic.CryptoHash,
                deprecated: false,
                UUID: "00000250-0000-1000-8000-0026BB765291",
                description: "Crypto Hash",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues:
                       { }
              },
         238: { type: "FirmwareUpdateReadiness",
                sche: "firmwareUpdateReadiness",
                characteristic: Characteristic.FirmwareUpdateReadiness,
                deprecated: false,
                UUID: "00000234-0000-1000-8000-0026BB765291",
                description: "Firmware Update Readiness",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         239: { type: "FirmwareUpdateStatus",
                sche: "firmwareUpdateStatus",
                characteristic: Characteristic.FirmwareUpdateStatus,
                deprecated: false,
                UUID: "00000235-0000-1000-8000-0026BB765291",
                description: "The Devices firmware update status",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         240: { type: "HardwareFinish",
                sche: "hardwareFinish",
                characteristic: Characteristic.HardwareFinish,
                deprecated: false,
                UUID: "0000026C-0000-1000-8000-0026BB765291",
                description: "Hardware Finish",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         241: { type: "MetricsBufferFullState",
                sche: "MetricsBufferFullState",
                characteristic: Characteristic.MetricsBufferFullState,
                deprecated: false,
                UUID: "00000272-0000-1000-8000-0026BB765291",
                description: "Metrics Buffer Full State",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToBool( str ); },
                props: {format: hapFormats.BOOL,
                        allowedWordCount: 1,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         242: { type: "MultifunctionButton",
                sche: "multiFunctionButton",
                characteristic: Characteristic.MultifunctionButton,
                deprecated: false,
                UUID: "0000026B-0000-1000-8000-0026BB765291",
                description: "Multifunction Button",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         243: { type: "SelectedDiagnosticsModes",
                sche: "selectedDiagnosticsModes",
                characteristic: Characteristic.SelectedDiagnosticsModes,
                deprecated: false,
                UUID: "0000024D-0000-1000-8000-0026BB765291",
                description: "Selected Diagnostics Modes",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT32,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         244: { type: "SelectedSleepConfiguration",
                sche: "selectedSleepConfiguration",
                characteristic: Characteristic.SelectedSleepConfiguration,
                deprecated: false,
                UUID: "00000252-0000-1000-8000-0026BB765291",
                description: "Selected Sleep Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE,
                                hapPerms.WRITE_RESPONSE
                               ]
                       },
                validValues:
                       { }
              },
         245: { type: "SiriEnable",
                sche: "siriEnable",
                characteristic: Characteristic.SiriEnable,
                deprecated: false,
                UUID: "00000255-0000-1000-8000-0026BB765291",
                description: "Siri Enable",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         246: { type: "SiriEngineVersion",
                sche: "siriEngineVersion",
                characteristic: Characteristic.SiriEngineVersion,
                deprecated: false,
                UUID: "0000025A-0000-1000-8000-0026BB765291",
                description: "Siri's engine version",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         247: { type: "SiriLightOnUse",
                sche: "siriLightOnUse",
                characteristic: Characteristic.SiriLightOnUse,
                deprecated: false,
                UUID: "00000258-0000-1000-8000-0026BB765291",
                description: "Siri Light on Use",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         248: { type: "SiriListening",
                sche: "siriListening",
                characteristic: Characteristic.SiriListening,
                deprecated: false,
                UUID: "00000256-0000-1000-8000-0026BB765291",
                description: "Siri Listening",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         249: { type: "SiriTouchToUse",
                sche: "siriTouchToUse",
                characteristic: Characteristic.SiriTouchToUse,
                deprecated: false,
                UUID: "00000257-0000-1000-8000-0026BB765291",
                description: "Siri Touch to use",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT8,
                        allowedWordCount: 1,
                        maxValue: 1,
                        minValue: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         250: { type: "StagedFirmwareVersion",
                sche: "StagedFirmwareVersion",
                characteristic: Characteristic.StagedFirmwareVersion,
                deprecated: false,
                UUID: "00000249-0000-1000-8000-0026BB765291",
                description: "Staged Firmware Version",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToString( str ); },
                props: {format: hapFormats.STRING,
                        allowedWordCount: 0,
                        perms: [hapPerms.NOTIFY,
                                hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
               },
         251: { type: "SupportedMetrics",
                sche: "supportedMetrics",
                characteristic: Characteristic.SupportedMetrics,
                deprecated: false,
                UUID: "00000271-0000-1000-8000-0026BB765291",
                description: "Supported Metrics",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ,
                                hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
              },
         252: { type: "SupportedFirmwareUpdateConfiguration",
                sche: "supportedFirmwareUpdateConfiguration",
                characteristic: Characteristic.SupportedFirmwareUpdateConfiguration,
                deprecated: false,
                UUID: "00000233-0000-1000-8000-0026BB765291",
                description: "Supported Firmware Update Configuration",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToTLV8( str ); },
                props: {format: hapFormats.TLV8,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         253: { type: "TapType",
                sche: "tapType",
                characteristic: Characteristic.TapType,
                deprecated: false,
                UUID: "0000022F-0000-1000-8000-0026BB765291",
                description: "The devices Tap Type",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringToInt( str ); },
                props: {format: hapFormats.UINT16,
                        allowedWordCount: 1,
                        perms: [hapPerms.PAIRED_READ
                               ]
                       },
                validValues:
                       { }
              },
         254: { type: "Token",
                sche: "token",
                characteristic: Characteristic.Token,
                deprecated: false,
                UUID: "00000231-0000-1000-8000-0026BB765291",
                description: "The devices Token",
                relatedCurrentAccTypeEnumIndex: null,
                relatedTargetAccTypeEnumIndex: null,
                stringConversionFunction: function ( str ){ return stringPassThru( str ); },
                props: {format: hapFormats.DATA,
                        allowedWordCount: 0,
                        perms: [hapPerms.PAIRED_WRITE
                               ]
                       },
                validValues:
                       { }
               }
      };

      return CMD4_ACC_TYPE_ENUM;
   }, CMD4_ACC_TYPE_ENUM
}
