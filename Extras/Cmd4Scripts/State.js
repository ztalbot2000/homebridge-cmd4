#!/usr/local/bin/node
//  State.js
//
// Description:
//   This script *CAN* be called by the HomeBridge plugin Cmd4 as defined in your config.json
//   file.  The purpose is to fake the existance of an accessory or to be modified by you
//   such that acessories can Get/Set characteristics as defined in the HomeKit Accessory
//   Specifications.
//
// Plugin Installation:
//   - npm install [-g] Cmd4
//   - mkdir $HOME/.homebridge/Cmd4Scripts
//   - cp State.js  $HOME/.homebridge/Cmd4Scripts/State.js
//   - chmod u+x $HOME/.homebridge/Cmd4Scripts/State.js
//
// Parameters are:
//    Get <accessory name> <characteristic>
//    Set <accessory name> <characteristic> <value>
//
// Note 1: These paramaters match the those of the Cmd4 plugin.
// Note 2: All characteristics of the HomeKit Accessory Protocol (HAP)
//         specifications are supported, except for camera streaming;
//         Though I have found some like LockManagement are not within IOS.
//         Side Note: The Eve app is nicer, try it.
// Note 3: The Hap spec is quoted throughout, but this is not the spec so
//         this is not gauranteed to be correct.
// Note 4: In this latest version, State.js does not care which characteristic
//         belongs with a specific accessssory for the purpose of creating
//         custom accessories.  IOS would not like this, but if you use
//         the provided config.json file that defines the corrrect characteristics,
//         this will not matter.
//
// How it works:
//    A characteristic value is stored in the $HOME/.homebridge/Cmd4Scripts/Cmd4States in
//    the file named "Status + <Accessory Name> _ <Characteristic>" and is returned or
//    written to based on the <Get|Set> option.
//
//    For example:   node State.js Set My_Door MotionDetected 0
//       will create the file .homebridge/Cmd4Scripts/Cmd4States/My_Door_MotionDetected
//       with the contents of "0"
//       Note: See how this is run from $HOME (Important!)
//
// Environmental Variables Used:
//    $HOME - to create path to .homebridge
//
//
// Interesting fact.  If you use characteristics as is, and define all possible accessories in your config.json
//                    file, they will all appear fully functional within HomeKit. In this way you
//                    can play with HomeKit and not have any physical devices at all.  Cool Eh!
//
// *IMPORTANT* - I cannot audit commented constants.  The lib/CMD4_DEVICE_ENUM.js is what is used
//               for constant translations.

'use strict';

// FileSystem requirements.
var fs = require('fs');
var path = require('path');
var os = require('os');

// The files created within Cmd4StatesPath contain just a value of the accessories last state,
// so they are very small in size.
var Cmd4StatesPath =  path.join(os.homedir(), ".homebridge/Cmd4Scripts/Cmd4States");

var length = process.argv.length;
var device = "";
var io = "";
var characteristic = "";
var option = "";

if ( length == 2 ) process.exit( 0 );

if ( length <= 2 ) {
    process.stdout.write( `Usage: ${ process.argv[ 0 ] } <Get> <AccessoryName> <Characteristic>` );
    process.stdout.write( `       ${ process.argv[ 0 ] } <Set> <AccessoryName> <Characteristic> <Value>` );
    process.exit(-1);
}

if ( length >= 2 ) io = process.argv[ 2 ];
if ( length >= 3 ) device = process.argv[ 3 ];
if ( length >= 4 ) characteristic  = process.argv[ 4 ];
if ( length >= 5 ) option  = process.argv[ 5 ];

// Placing the states in a subdirectory makes things look cleaner.
// Some platforms require an exception handler
const mkdirSync = function( dirPath )
{
    try {
        fs.mkdirSync( dirPath )
    } catch ( err ) {
        if ( err.code !== 'EEXIST' )
        {
            process.stdout.write( `mkdir failed: ${ dirPath }`);
            throw err;
        } else {
            // directory already exists - OK
        }
    }
}

mkdirSync( Cmd4StatesPath );


// Such a simple way to store state information that is small and fast!
// Put exception handling here too. Just in case!
function writeData( a, b,c )
{
   var fn = Cmd4StatesPath + "/Status_" + a  + "_" + b;

   try {
       fs.writeFileSync( fn,c );
   } catch (err) {
       if ( err.code !== 'EEXIST' )
       {
          process.stdout.write( `write data failed: ${ fn }  data: ${ c }` );
          throw err;
       } else {
          // file already exists - OK
       }
   }
}

// Read the state information.  If there is none, just return what
// was expected.
// Put exception handling here too. Just in case!
function readData( a, b )
{
   var fn = Cmd4StatesPath + "/Status_" + a  + "_" + b;
   c = "";

   try {
      c = String( fs.readFileSync( fn, 'utf8' ) );
   } catch (err) {
      if ( err.code === 'ENOENT' ) {
         // This is OK. just return what was expected.
         return c;
      } else
      {
         if ( err.code !== 'EEXIST' )
         {
            process.stdout.write( `read data failed: ${ fn }` );
            throw err;
         } else {
            // file already exists - OK
         }
      }
   }

   return c;
}

var c = "";

switch( io )
{
   case "Get":
   {
      switch( characteristic )
      {
         case "AccessControlLevel":   // 0
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( `1` ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E5-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.accessory-properties
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint16

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1
            // Valid Values
            // 0x0000        "TBD"
            // 0x0001 (bit0) "TBD"
            // 0x0002 - 0xFFFF "Reserved"

            break;
         }
         case "AccessoryFlags":   // 1
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.accessory-properties
            // Permissions: Paired Read, Notify

            // Format: uint32

            // Valid Values
            // 0x0001 (bit0) "Requires additional setup"
            // 0x0002 - 0xFFFF "Reserved"

            break;
         }
         case "AccessoryIdentifier":   // 2
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "TLB" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000057-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.accessoryIdentifier
            // Permissions: Paired Read

            // Format: string

            // Maximum Length: 64

            break;
         }
         case "Active":   // 3
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B0-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.active
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values
            // 0 - "INACTIVE"
            // 1 - "ACTIVE"

            break;
         }
         case "ActiveIdentifier":   // 4
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.activeIdentifier
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint32

            break;
         }
         case "ActivityInterval":   // 5
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000023B
            // Type: public.hap.characteristic.activityInterval
            // Permissions: Paired Read, Notify
            // Found in HomeKit.js  - Checked 11-19-2020

            // Format: uint32

            // Minimum Value: 0
            // Step Value: 1

            break;
         }
         case "AdministratorOnlyAccess":   // 6
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000001-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.administrator-only-access
            // Permissions: Paired Read, Paired Write, Notify

            // Format: bool

            // Values
            // This mode implies that when enabled, the device will only accept
            // administrator access.

            break;
         }
         case "AirParticulateDensity":   // 7
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "30" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000064-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.air-particulate.density
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            // Values
            // This characteristic indicates the current air particulate matter
            // density in micrograms/m3.

            break;
         }
         case "AirParticulateSize":   // 8
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000065-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.air-particulate.size
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values
            // 0     - "2.5 Micrometers"
            // 1     - "10 Micrometers"
            // 2-255 - "Reserved"

            break;
         }
         case "AirQuality":   // 9
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000095-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.air-quality
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 5
            // Step Value: 1

            // Valid Values:
            // 0 - "UNKNOWN"
            // 1 - "EXCELLENT"
            // 2 - "GOOD"
            // 3 - "FAIR"
            // 4 - "INFERIOR"
            // 5 - "POOR"

            break;
         }
         case "AppMatchingIdentifier":   // 10
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A4-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.AppMatchingIdentifier
            // Permissions: Read

            // Format: TLV8

            // Values

            break;
         }
         case "AudioFeedback":   // 11
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000005-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.audio-feedback
            // Permissions: Paired Read, Paired Write, Notify

            // Format: bool

            // Values
            // This characteristic describes whether audio feedback
            // (e.g. a beep, or other external sound mechanism) is enabled.

            break;
         }
         case "BatteryLevel":   // 12
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000068-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.battery-level
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "Brightness":   // 13
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000008-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.brightness
            // Permissions: Paired Read, Paired Write, Notify

            // Format: int

            // Min Value: 0
            // Max Value: 100
            // Unit: Percentage

            break;
         }
         case "ButtonEvent":   // 14
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000123-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.battery-level
            // Permissions: Paired Read

            // Format: TLV8

            break;
         }
         case "CCAEnergyDetectThreshold":   // 15
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000246
            // Type: public.hap.characteristic.CCASignalDetectThreshold
            // Permissions: Paired Read
            // Found in HomeKit.js  - Checked 11-20-2020

            // Format: int

            break;
         }
         case "CCASignalDetectThreshold":   // 16
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000245
            // Type: public.hap.characteristic.CCASignalDetectThreshold
            // Permissions: Paired Read
            // Found in HomeKit.js  - Checked 11-20-2020

            // Format: int

            break;
         }
         case "CameraOperatingModeIndicator":   // 17
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000008-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.brightness
            // Permissions: Read, Write, Notify, Timed Write
            // Found in HomeKit.js  - Checked 11-20-2020

            // Format: UINT8

            // Valid Values:
            // 0 - "DISABLE"
            // 1 - "ENABLE"

            break;
         }
         case "CarbonDioxideDetected":   // 18
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000092-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-dioxide.detected
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "CO2_LEVELS_NORMAL"
            // 1 - "CO2_LEVELS_ABNORMAL"

            break;
         }
         case "CarbonDioxideLevel":   // 19
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000093-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-dioxide.level
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100000

            break;
         }
         case "CarbonDioxidePeakLevel":   // 20
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000094-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-dioxide.peak-level
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100000

            break;
         }
         case "CarbonMonoxideDetected":   // 21
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000069-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-monoxide.detected`
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Min Value: 0
            // Max Value: 1

            // Valid Values:
            // 0 - "CO_LEVELS_NORMAL"
            // 1 - "CO_LEVELS_ABNORMAL"

            break;
         }
         case "CarbonMonoxideLevel":   // 22
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000090-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-monoxide.level
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100

            break;
         }
         case "CarbonMonoxidePeakLevel":   // 23
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000091-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.carbon-monoxide.peak-level
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100

            break;
         }
         case "Category":   // 24
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A3-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.category
            // Permissions: Paired Read, Notify

            // Format: uint16

            // Minimum Value: 1
            // Maximum Value: 16
            // Step Value: 1

            break;
         }
         case "CharacteristicValueTransitionControl":   // 25
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000143
            // Type: public.hap.characteristic.CharacteristicValueTransitionControl
            // Permissions: Paired Read, Paired Write, Notify

            // Format: tlv8

            break;
         }
         case "ChargingState":   // 26
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000008F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.charging-state
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "NOT_CHARGING"
            // 1 - "CHARGING"
            // 2 - "NOT_CHARGEABLE"

            break;
         }
         case "ClosedCaptions":   // 27
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000DD-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.closedCaptions
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "DISABLED"
            // 1 - "ENSABLED"

            break;
         }
         case "ColorTemperature":   // 28
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000CE-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.color-temperature
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint32

            // Minimum Value: 50
            // Maximum Value: 400
            // Step Value: 1

            break;
         }
         case "ConfigureBridgedAccessory":   // 29
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A0-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.configureBridgedAccessory
            // Permissions: Paired Write

            // Format: TLV8

            break;
         }
         case "ConfigureBridgedAccessoryStatus":   // 30
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.configureBridgedAccessoryStatus
            // Permissions: Paired Read, Notify

            // Format: TLV8

            break;
         }
         case "ConfiguredName":   // 31
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( `"${ device }"` ); else process.stdout.write(`"${ c }"` );

            // UUID: 000000E3-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.configuredName
            // Permissions: Paired Write, Paired Read, Notify

            // Format: string

            break;
         }
         case "ContactSensorState":   // 32
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.contact-state
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "CONTACT_DETECTED"
            // 1 - "CONTACT_NOT_DETECTED"

            break;
         }
         case "CoolingThresholdTemperature":   // 33
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "32.4" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000000D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.temperature.cooling-threshold
            // Permissions: Paired Read, Paired Write, Notify

            // Format: float

            // Minimum Value: 10
            // Maximum Value: 35
            // Step Value: 0.1
            // Unit: celcius

            break;
         }
         case "CurrentAirPurifierState":   // 34
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A9-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.air-purifier.state.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "INACTIVE"
            // 1 - "IDLE"
            // 2 - "PURIFYING_AIR"

            break;
         }
         case "CurrentAmbientLightLevel":   // 35
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006B-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.light-level.current
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0.0001
            // Maximum Value: 100000
            // Unit: lux

            break;
         }
         case "CurrentDoorState":   // 36
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000000E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.door-state.current
            // Permissions: Paired Read, Notify

            // Format: uint8
            // Minimum Value: 0
            // Maximum Value: 4
            // Step Value: 1

            // Valid Values:
            // 0 - "OPEN"    -  The door is fully open."
            // 1 - "CLOSED"  -  The door is fully closed."
            // 2 - "OPENING" -  The door is actively opening."
            // 3 - "CLOSING" -  The door is actively closing."
            // 4 - "STOPPED" -  The door is not moving, and it is not fully
            //      open nor fully closed."
            // 5-255 - "Reserved"

            break;
         }
         case "CurrentFanState":   // 37
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AF-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.fan.state.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values
            // 0 - "INACTIVE"
            // 1 - "IDLE"
            // 2 - "BLOWING_AIR"

            break;
         }
         case "CurrentHeaterCoolerState":   // 38
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            process.exit(0);

            // UUID: 000000B1-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.heater-cooler.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3
            // Step Value: 1

            // Valid Values:
            // 0 - "INACTIVE"
            // 1 - "IDLE"
            // 2 - "HEATING"
            // 3 - "COOLING"

            break;
         }
         case "CurrentHeatingCoolingState":   // 39
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            process.exit(0);

            // UUID: 0000000F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.heating-cooling.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "OFF"  - The unit is off
            // 1 - "HEAT" - The Heater is currently on.
            // 2 - "COOL" - Cooler is currently on.

            break;
         }
         case "CurrentHorizontalTiltAngle":   // 40
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.horizontal-tilt.current
            // Permissions: Paired Read, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "CurrentHumidifierDehumidifierState":   // 41
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B3-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.currentHumidifierDehumidifierState
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomekitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3

            // Valid Values
            // 0 - "INACTIVE"
            // 1 - "IDLE"
            // 2 - "HUMIDIFYING"
            // 3 - "DEHUMIDIFYING"

            break;
         }
         case "CurrentMediaState":   // 42
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E0-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.currentMediaState
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 3

            // Valid Values
            // 0 - "PLAY"
            // 1 - "PAUSE"
            // 2 - "STOP"
            // 3 - "UNKNOWN3" - Reserved ????
            // 4 - "LOADING"
            // 3 - "INTERRUPTED'

            break;
         }
         case "CurrentPosition":   // 43
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.position.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "CurrentRelativeHumidity":   // 44
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "60.2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000010-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relative-humidity.current
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "CurrentSlatState":   // 45
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AA-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.slat.state.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "FIXED"
            // 1 - "JAMMED"
            // 2 - "SWINGING"

            break;
         }
         case "CurrentTemperature":   // 46
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "22.2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000011-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.temperature.current
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value 0
            // Maximum Value 100
            // Step Value 0.1
            // Unit celsius

            break;
         }
         case "CurrentTiltAngle":   // 47
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C1-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.tilt.current
            // Permissions: Paired Read, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "CurrentTime":   // 48
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "11.5" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009B-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.currentTime
            // Permissions: Paired Read, Paired Write

            // Format: string

            break;
         }
         case "CurrentTransport":   // 49
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000245
            // Type: public.hap.characteristic.currentTransport
            // Permissions: Read
            // Found in HomeKit.js  - Checked 11-19-2020

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "CurrentVerticalTiltAngle": // 50
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.vertical-tilt.current
            // Permissions: Paired Read, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
            case "CurrentVisibilityState":   // 51
            {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000135-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.currentVisibilityState
            // Permissions: Paired Read, Notify
            // Found in  HomeKitTypes-Television.js

            // Format: uint8

            // Valid Values
            // 0 - "SHOWN"
            // 1 - "HIDDEN"

            break;
         }
         case "DataStreamHAPTransport":   // 52
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000138
            // Type: public.hap.characteristic.dataStreamHAPTransport
            // Permissions: Read, Write, Write Response
            // Found in  HomeKit.js - Checked 11/19/2020

            // Format: TV8

            break;
         }
         case "DataStreamHAPTransportInterrupt":   // 53
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000139
            // Type: public.hap.characteristic.dataStreamHAPTransportInterrupt
            // Permissions: Paired Read, Notify
            // Found in  HomeKit.js - Checked 11/19/2020

            // Format: TV8

            break;
         }
         case "DayoftheWeek":   // 54
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000098-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.zoom-digital
            // Permissions: Paired Write, Paired Read

            // Format: uint8

            // Minimum Value: 1
            // Maximum Value: 7
            // Step Value: 1

            break;
         }
         case "DiagonalFieldOfView":   // 55
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000224-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.diagonalFieldOfView
            // Permissions: Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 360
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "DigitalZoom":   // 56
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.zoom-digital
            // Permissions: Read, Write, Notify

            // Format: float

            // Valid Values
            // The value of this characteristic represents the digital zoom
            // multiplier to be applied on the image sourced by the video
            // RTP service that is sourcing the input image.

            break;
         }
         case "DiscoverBridgedAccessories":   // 57
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.discoverBridgedAccessories
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js

            // Format: uint8

            // Valid Values
            // 0 - START_DISCOVERY
            // 1 - STOP_DISCOVERY

            break;
         }
         case "DiscoveredBridgedAccessories":   // 58
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.discoveredBridgedAccessories
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: uint16

            // Valid Values

            break;
         }
         case "DisplayOrder":   // 59
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.displayOrder
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Television.js (Values ???)

            // Format: TLV8

            // Valid Values

            break;
         }
         case "EventRetransmissionMaximum":   // 60
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000023D
            // Type: public.hap.characteristic.EventRetransmissionMaximum
            // Permissions: Read, Write, Notify
            // Found in HomeKitTypes.js  - Checked 11/19/2020

            // Format: uint8

            // Valid Values

            break;
         }
         case "EventSnapshotsActive":   // 61
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000223-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.eventSnapshotsActive
            // Permissions: Read, Write, Notify
            // Found in HomeKitTypes.js  - Checked 11/19/2020

            // Format: uint8

            // Valid Values
            // 0 - "DISABLE" - Disable Snapshot
            // 1 - "ENABLE"  - Enable Snapshot

            break;
         }
         case "EventTransmissionCounters":   // 62
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000023E
            // Type: public.hap.characteristic.EventTransmissionCounters
            // Permissions: Paired Read
            // Found in HomeKitTypes.js  - Checked 11/19/2020

            // Format: uint32

            // Valid Values

            break;
         }
         case "FilterChangeIndication":   // 63
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AC-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.filter.change-indication
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - " FILTER_OK" - Filter does not need to be changed
            // 1 - "CHANGE_FILTER" - Filter needs to be changed

            break;
         }
         case "FilterLifeLevel":   // 64
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AB-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.filter.life-level
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1

            break;
         }
         case "FirmwareRevision":   // 65
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100.1.1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000052-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.firmware.revision
            // Permissions: Paired Read

            // Format: string

            // Valid Values
            // This characteristic describes a hardware revision string x[.y[.z]]
            // (e.g. "100.1.1") and tracked when the board or components of the same
            // accessory is changed :
            // <x> is the major version number, required.
            // <y> is the minor version number, required if it is non-zero or
            // if <z> is present. <z> is the revision version number, required if non-zero.
            //
            // The hardware revision must follow the below rules:
            // <x> is incremented when there is significant change. e.g.,1.0.0, 2.0.0, 3.0.0, etc.
            // <y> is incremented when minor changes are introduced such as 1.1.0, 2.1.0, 3.1.0 etc.
            // <z> is incremented when bug-fixes are introduced such as 1.0.1, 2.0.1, 3.0.1 etc.
            //
            // Subsequent firmware updates can have a lower <y> version only
            // if <x> is incremented Subsequent firmware updates can have a
            // lower <z> version only if <x> or <y> is incremented

            break;
         }
         case "HardwareRevision":   // 66
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100.1.1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000053-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.hardware.revision
            // Permissions: Paired Read

            // Format: string

            // Valid Values
            // This characteristic describes a hardware revision string x[.y[.z]]
            // (e.g. "100.1.1") and tracked when the board or components of the same
            // accessory is changed :
            // <x> is the major version number, required.
            // <y> is the minor version number, required if it is non-zero or
            // if <z> is present. <z> is the revision version number, required if non-zero.
            //
            // The hardware revision must follow the below rules:
            // <x> is incremented when there is significant change. e.g.,1.0.0, 2.0.0, 3.0.0, etc.
            // <y> is incremented when minor changes are introduced such as 1.1.0, 2.1.0, 3.1.0 etc.
            // <z> is incremented when bug-fixes are introduced such as 1.0.1, 2.0.1, 3.0.1 etc.
            //
            // Subsequent firmware updates can have a lower <y> version only
            // if <x> is incremented Subsequent firmware updates can have a
            // lower <z> version only if <x> or <y> is incremented

            break;
         }
         case "HeartBeat":   // 67
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "64" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000024A
            // Type: public.hap.characteristic.heartBeat
            // Permissions: Notify, Paired Read
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint32

            break;
         }
         case "HeatingThresholdTemperature":   // 68
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "25.2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000012-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.temperature.heating-threshold
            // Permissions: Read, Write, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 25
            // Step Value: 0.1
            // Unit: celcius

            break;
         }
         case "HoldPosition": // 69
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.position.hold
            // Permissions: Paired Write

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "HomeKitCameraActive": // 70
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000006F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.position.hold
            // Permissions: Read, Write, Notify, Timed Write
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8

            // Valid Values:
            // 0 - "OFF" - The Camera is (off)
            // 1 - "ON"  - The Camera is (on)

            break;
         }
         case "Hue":   // 71
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000013-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.hue
            // Permissions: Paired Read, Paired Write, Notify

            // Format: float

            // Min Value: 0
            // Max Value: 360
            // Unit: arcdegrees

            break;
         }
         case "Identifier":   // 77
         {
            c = readData( device, characteristic );

            if ( c == "" ){
               // Each identifier needs a unique number
               // Match this with what is in the config.json
               switch( device )
               {
                  case "HDMI1":
                       process.stdout.write( "0" );
                       break;
                  case "HDMI2":
                       process.stdout.write( "1" );
                       break;
                  case "HDMI3":
                       process.stdout.write( "2" );
                       break;
                  case "HDMI4":
                       process.stdout.write( "3" );
                       break;
                  case "Netflix":
                       process.stdout.write( "4" );
                       break;
                  default:
                       process.stdout.write( "0" );
               }
            } else {
                  process.stdout.write( `"${ c }"` );
            }

            // UUID: 000000E6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.identifier
            // Permissions: Paired Read
            // Found in HomeKitTypes-Television.js

            // Format: uint32

            // Min Value: 0
            // Min Step: 1

            break;
         }
         case "Identify":   // 73
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.identifier
            // Permissions: Paired Write
            // Found in HomeKitTypes.js

            // Format: Bool

            break;
         }
         case "ImageMirroring":   // 74
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.image-mirror
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint32

            // Valid Values
            // 0 - "FALSE" - Image is not mirrored
            // 1 - "TRUE" - Image is mirrored

            // Unit arcdegrees

            break;
         }
         case "ImageRotation":   // 75
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.image-rotation
            // Permissions: Paired Write, Paired Read, Notify

            // Format: float

            // Valid Values
            // 0   - No rotation
            // 90  - Rotated 90 degrees to the right
            // 180 - Rotated 180 degrees to the right (flipped vertically)
            // 270 - Rotated 270 degrees to the right

            break;
         }
         case "InUse":   // 76
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000D2-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.inUse
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "NOT_IN_USE"
            // 1 - "IN_USE"

            break;
         }
         case "InputDeviceType":   // 77
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000DC-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.inputDeviceType
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 6

            // Valid Values
            // 0 - "OTHER"
            // 1 - "TV"
            // 2 - "RECORDING"
            // 3 - "TUNER"
            // 4 - "PLAYBACK"
            // 5 - "AUDIO_SYSTEM"
            // 6 - "UNKNOWN_6" - (Added in IOS 14)

            break;
         }
         case "InputSourceType":   // 78
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000DB-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.inputSourceType
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 10

            // Valid Values
            // 0  - "OTHER"
            // 1  - "HOME_SCREEN"
            // 2  - "TUNER"
            // 3  - "HDMI"
            // 4  - "COMPOSITE_VIDEO"
            // 5  - "S_VIDEO"
            // 6  - "COMPONENT_VIDEO"
            // 7  - "DVI"
            // 8  - "AIRPLAY"
            // 9  - "USB"
            // 10 - "APPLICATION"

            break;
         }
         case "IsConfigured":   // 79
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000D6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.isConfigured
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "NOT_CONFIGURED"
            // 1 - "CONFIGURED"

            break;
         }
         case "LeakDetected":   // 80
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000070-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.leak-detected
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "LEAK_NOT_DETECTED" - Leak is not detected
            // 1 - "LEAK_DETECTED"  - Leak is detected

            break;
         }
         case "LinkQuality":   // 81
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.linkQuality
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: uint8

            // Minimum Value: 1
            // Maximum Value: 4
            // Step Value: 1

            // Valid Values:

            break;
         }
         case "LockControlPoint":   // 82
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000019-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.lock-management.control-point
            // Permissions: Paired Write
            // Format: tlv8

            break;
         }
         case "LockCurrentState":   // 83
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000001D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.lock-mechanism.current-state
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3
            // Step Value: 1

            // Valid Values:
            // 0 - "UNSECURED" - Unsecured
            // 1 - "SECURED"   - Secured
            // 2 - "JAMMED"    - Jammed
            // 3 - "Unknown"   - unknown
            // 4-255 - "Reserved"

            break;
         }
         case "LockLastKnownAction":   // 84
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 8
            // Step Value: 1

            // Valid Values:
            // 0 - "SECURED_PHYSICALLY_INTERIOR" - Secured using physical movement, interior
            // 1 - "UNSECURED_PHYSICALLY_INTERIOR" - Unsecured using physical movement, interior
            // 2 - "UNSECURED_PHYSICALLY_INTERIOR" - Secured using physical movement, exterior
            // 3 - "UNSECURED_PHYSICALLY_EXTERIOR" - Unsecured using physical movement, exterior
            // 4 - "SECURED_BY_KEYPAD" - Secured with keypad
            // 5 - "UNSECURED_BY_KEYPAD" - Unsecured with keypad
            // 6 - "SECURED_REMOTELY" - Secured remotely
            // 7 - "UNSECURED_REMOTELY" - Unsecured remotely
            // 8 - "SECURED_BY_AUTO_SECURE_TIMEOUT" - Secured with Automatic Secure timeout
            // 9-255 - "Reserved"

            break;
         }
         case "LockManagementAutoSecurityTimeout":   // 85
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "26" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000001A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.lock-management.auto-secure-timeout
            // Permissions: Paired Read, Paired Write, Notify
            // Format: uint32
            // Unit: seconds

            break;
         }
         case "LockPhysicalControls":   // 86
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.lock-physical-controls
            // Permissions: Paired Write,Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "CONTROL_LOCK_DISABLED" - Control lock disabled
            // 1 - "CONTROL_LOCK_ENABLED" - Control lock enabled

            break;
         }
         case "LockTargetState":   // 87
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000001E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.lock-mechanism.target-state
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "UNSECURED"
            // 1 - "SECURED"
            // 2-255 - "Reserved"

            break;
         }
         case "Logs":   // 88
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000001F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.logs
            // Permissions: Paired Read, Notify

            // Format: tlv8

            break;
         }
         case "MACRetransmissionMaximum":   // 89
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000247
            // Type: public.hap.characteristic.MACRetransmissionMaximum
            // Permissions: Paired Read
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8

            break;
         }
         case "MACTransmissionCounters":   // 90
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000248
            // Type: public.hap.characteristic.MACTransmissionCounters
            // Permissions: Paired Read
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: DATA

            break;
         }
         case "ManagedNetworkEnable":   // 91
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000020-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.ManagedNetworkEnable
            // Permissions: Read, Write, Notify, Timed Write
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8
            // Valid Values:
            // 0 - "DISABLED"  - Network is Disabled
            // 1 - "ENABLED"   - Network is Enabled
            // 2 - "UNKNOWN"   - Network is unknown

            break;
         }
         case "ManuallyDisabled":   // 92
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000227-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.manuallyDisabled
            // Permissions: Read, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: Bool

            // Valid Values:
            // 0 - "ENABLED"  - Device has been Manually Disabled
            // 1 - "DISABLED" - Device has been Manually Enabled

            break;
         }
         case "Manufacturer":   // 93
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "Homebridge" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000020-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.manufacturer
            // Permissions: Paired Read

            // Format: string

            // Maximum Length: 64

            break;
         }
         case "Model": // 94
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.model
            // Permissions: Paired Read

            // Format: string

            // Maximum Length: 64

            break;
         }
         case "MotionDetected":   // 95
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000022-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.motion-detected
            // Permissions: Paired Read, Notify

            // Format: bool

            break;
         }
         case "Mute":   // 96
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.mute
            // Permissions: Paired Write, Paired Read, Notify

            // Format: bool

            // Valid Values:
            // 0 - "FALSE - Mute is Off / Audio is On
            // 1 - "TRUE" - Mute is On / There is no Audio

            break;
         }
         case "Name":   // 97
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( `"${ device }"` ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000023-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.name
            // Permissions: Paired Read, Notify

            // Format: string

            // Maximum Length: 64

            break;
         }
         case "NetworkAccessViolationControl":   // 98
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000023-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.networkAccessViolationControl
            // Permissions: Read, Write, Notify, Timed Write, Write Response
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "NetworkClientProfileControl":   // 99
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000020C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.NetworkClientProfileControl
            // Permissions: Read, Write, Notify, Timed Write, Write Response
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "NetworkClientStatusControl":   // 100
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000020D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.NetworkClientStatusControl
            // Permissions: Read, Write, Write Response
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "NightVision":   // 101
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011B-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.nightVision
            // Permissions: Paired Write, Paired Read, Notify

            // Format: bool (false) and 1 (true)

            // Valid Values
            // 0 - "FALSE" - Disable night-vision mode
            // 1 - "TRUE"  - Enable night-vision mode

            break;
         }
         case "NitrogenDioxideDensity":   // 102
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C4-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.no2
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            break;
         }
         case "ObstructionDetected":   // 103
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000024-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.obstruction-detected
            // Permissions: Paired Read, Notify

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "OccupancyDetected":   // 104
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000071-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.occupancy-detected
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values
            // 0 - "FALSE" - Occupancy is not detected
            // 1 - "TRUE" - Occupancy is detected

            break;
         }
         case "On":   // 105
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000025-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.on
            // Permissions: Paired Read, Paired Write, Notify

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "OperatingStateResponse":   // 106
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000232
            // Type: public.hap.characteristic.OperatingStateResponse
            // Permissions: Paired Read, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "OpticalZoom":   // 107
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000011C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.opticalZoom
            // Permissions: Paired Write, Paired Read, Notify

            // Format: float

            // Valid Values
            // The value of this characteristic represents the optical zoom
            // setting of the camera service that is sourcing the input image.

            break;
         }
         case "OutletInUse":   // 108
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000026-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.outlet-in-use
            // Permissions: Paired Read, Notify

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "OzoneDensity":   // 109
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C3-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.ozone
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000k

            break;
         }
         case "PM10Density":   // 110
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.pm10
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            break;
         }
         case "PM2_5Density":   // 111
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.pm25
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            break;
         }
         case "PairSetup":   // 112
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000004C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.pairSetup
            // Permissions: Paired Write, Paired Read
            // Found in HomeKitTypes.js (Values ???)

            // Format: TLV8

            break;
         }
         case "PairVerify":   // 113
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000004E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.pairVerify
            // Permissions: Paired Write, Paired Read
            // Found in HomeKitTypes.js (Values ???)

            // Format: TLV8

            break;
         }
         case "PairingFeatures":   // 114
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000004F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.pairingFeatures
            // Permissions: Paired Read,
            // Found in HomeKitTypes.js (Values ???)

            // Format: uint8

            break;
         }
         case "PairingPairings":   // 115
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000050-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.pairingPairings
            // Permissions: Paired Write, Paired Read
            // Found in HomeKitTypes.js (Values ???)

            // Format: TLV8

            break;
         }
         case "PasswordSetting":   // 116
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000DA-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.passwordSetting
            // Permissions: Notify, Paired Read, Paired Write
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "PeriodicSnapshotsActive":   // 117
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000225-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.periodicSnapshotsActive
            // Permissions: Read, Write, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8

            // Valid Values:
            // "DISABLE": 0   -
            // "ENABLE":  1   -

            break;
         }
         case "PictureMode":   // 118
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E2-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.pictureMode
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint16

            // Valid Values
            // 0 - "OTHER"
            // 1 - "STANDARD"
            // 2 - "CALIBRATED"
            // 3 - "CALIBRATED_DARK"
            // 4 - "VIVID"
            // 5 - "GAME"
            // 6 - "COMPUTER"
            // 7 - "CUSTOM"

            break;
         }
         case "Ping":   // 119
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000023C
            // Type: public.hap.characteristic.ping
            // Permissions: Paired Read

            // Format: DATA ????

            break;
         }
         case "PositionState":   // 120
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000072-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.position.state
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "DECREASING" - Going to the minimum value specified in metadata
            // 1 - "INCREASING" - Going to the maximum value specified in metadata
            // 2 - "STOPPED"
            // 3-255 "Reserved"

            break;
         }
         case "PowerModeSelection":   // 121
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000DF-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.powerModeSelection
            // Permissions: Paired Write
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Valid Values
            // 0 - "SHOW"
            // 1 - "HIDE"

            break;
         }
         case "ProductData":   // 122
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000220-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.productData
            // Permissions: Read
            // Found in HomeKitT.js - Checked 11/19/2020

            // Format: DATA ???

            // Valid Values

            break;
         }
         case "ProgramMode":   // 123
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.programMode
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Valid Values
            // 0 - "NO_PROGRAM_SCHEDULED"
            // 1 - "PROGRAM_SCHEDULED"
            // 1 - "PROGRAM_SCHEDULED_MANUAL_MODE"

            break;
         }
         case "ProgrammableSwitchEvent":   // 124
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000073-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.input-event
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2
            // Step Value: 1

            // Valid Values:
            // 0 - "SINGLE_PRESS"
            // 1 - "DOUBLE_PRESS"
            // 2 - "LONG_PRESS"
            // 3-255 - "Reserved"

            break;
         }
         case "ProgrammableSwitchOutputState":   // 125
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000074-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.programmableSwitchOutputState
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:

            break;
         }
         case "Reachable":   // 126
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000063-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.reachable
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: bool

            // Valid Values:

            break;
         }
         case "ReceivedSignalStrengthIndication":   // 127
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000023F
            // Type: public.hap.characteristic.ReceivedSignalStrengthIndication
            // Permissions: Paired Read
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: int

            // Valid Values:

            break;
         }
         case "ReceiverSensitivity":   // 128
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000244
            // Type: public.hap.characteristic.receiverSensitivity
            // Permissions: Paired Read
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: int

            // Valid Values:

            break;
         }
         case "RecordingAudioActive":   // 129
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000226-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.recordingAudioActive
            // Permissions: Read, Write, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8

            // Valid Values:
            // 0 - "DISABLE"
            // 1 - "ENABLE"

            break;
         }
         case "RelativeHumidityDehumidifierThreshold":   // 130
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C9-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relativeHumidityDehumidifierThreshold
            // Permissions: Paired Write, Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Minimum Step: 1

            break;
         }
         case "RelativeHumidityHumidifierThreshold":   // 131
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000CA-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relativeHumidityHumidifierThreshold
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint32

            // Units: Percentage

            // Minimum Value: 0
            // Maximum Value: 100
            // Minimum Step: 1

            break;
         }
         case "RelayControlPoint":   // 132
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000005E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.reachable
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: TLV8

            break;
         }
         case "RelayEnabled":   // 133
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000005B-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relayEnabled
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: bool

            // Valid Values:

            break;
         }
         case "RelayState":   // 134
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000005C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relayState
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Bridge.js (Values ???)

            // Format: uint8

            // Valid Values:

            break;
         }
         case "RemainingDuration":   // 135
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000D4-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.remainingDuration
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 3600
            // Minimum Step: 1

            break;
         }
         case "RemoteKey":   // 136
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E1-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.remoteKey
            // Permissions: Paired Write
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Valid Values
            // 0  - "REWIND"
            // 1  - "FAST_FORWARD"
            // 2  - "NEXT_TRACK"
            // 3  - "PREVIOUS_TRACK"
            // 4  - "ARROW_UP"
            // 5  - "ARROW_DOWN"
            // 6  - "ARROW_LEFT"
            // 7  - "ARROW_RIGHT"
            // 8  - "SELECT"
            // 9  - "BACK"
            // 10 - "EXIT"
            // 11 - "PLAY_PAUSE"
            // 12 - "INFORMATION"

            break;
         }
         case "ResetFilterIndication":   // 137
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AD-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.filter.reset-indication
            // Permissions: Paired Write

            // Format: uint8

            // Minimum Value: 1
            // Maximum Value: 1

            break;
         }
         case "RotationDirection":   // 138
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID:00000028-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.rotation.direction
            // Permissions: Paired Read, Paired Write, Notify
            // Format: int

            // Step Value: 1
            // Valid Values
            // 0 - "CLOCKWISE"
            // 1 - "COUNTER_CLOCKWISE"
            // 2-255 "Reserved"

            break;
         }
         case "RotationSpeed":   // 139
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000029-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.rotation.speed
            // Permissions: Paired Read, Paired Write, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "RouterStatus":   // 140
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000020E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.routerStatus
            // Permissions: Read, Notify
            // Found in HomeKit.js - Checked 11/19/2020

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values:
            // 0 - "READY"
            // 1 - "NOT_READY"

            break;
         }
         case "Saturation":   // 141
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000002F-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.saturation
            // Permissions: Paired Read, Paired Write, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "SecuritySystemAlarmType":   // 142
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000008E-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.security-system.alarm-type
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - When alert cleared
            // 1 - Unknown Cause

            break;
         }
         case "SecuritySystemCurrentState":   // 143
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "3" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000066-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.security-system-state.current
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 4
            // Step Value: 1

            // Valid Values:
            // 0 - "STAY_ARM"  - The home is occupied and the residents are
            //      active. e.g. morning or evenings"
            // 1 - "AWAY_ARM"  -  The home is unoccupied"
            // 2 - "NIGHT ARM" -  The home is occupied and the residents are sleeping"
            // 3 - "DISARMED"
            // 4 - "ALARM_TRIGGERED"
            // 5 - 255 - Reserved

            break;
         }
         case "SecuritySystemTargetState":   // 144
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000067-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.security-system-state.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3
            // Step Value: 1

            // Valid Values:
            // 0 - "StAY_ARM"  - The home is occupied and the residents
            //      are active. e.g. morning or evenings
            // 1 - "AWAY_ARM"  - The home is unoccupied
            // 2 - "NIGHT_ARM" - The home is occupied and the residents are sleeping
            //
            // 3 - 255 - Reserved

            break;
         }
         case "SelectedAudioStreamConfiguration":   // 145
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: SelectedAudioStreamConfiguration
            // Type: public.hap.characteristic.SelectedAudioStreamConfiguration
            // Permissions: Paired Read, Paired Write
            // Found in HomeKitTypes.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "SelectedCameraRecordingConfiguration":   // 146
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000209-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.selectedCameraRecordingConfiguration
            // Permissions: Read, Write
            // Found in HomeKitTypes.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "SelectedRTPStreamConfiguration":   // 147
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000117-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.selected-rtp-stream-configuration
            // Permissions: Paired Write

            // Format: TLV8

            break;
         }
         case "SerialNumber":   // 148
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "ABC001" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000030-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.serial-number
            // Permissions: Paired Read

            // Format: string

            // Max Length: 64

            break;
         }
         case "ServiceLabelIndex":   // 149
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000CB-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.service-label-index
            // Permissions: Paired Read

            // Format: uint8

            // Minimum Value: 1
            // Step Value: 1

            break;
         }
         case "ServiceLabelNamespace":   // 150
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000CD-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.service-label-namespace
            // Permissions: Paired Read

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "DOTS" -  For example, "." ".." "..." "....""
            // 1 - "ARABIC_NUMERALS" . For example, "0,1,2,3"
            // 2-255 - "Reserved"

            break;
         }
         case "SetDuration":   // 151
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000D3-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.setDuration
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 3600
            // Step Value: 1

            break;
         }
         case "SetupDataStreamTransport":   // 152
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: SetupDataStreamTransport
            // Type: public.hap.characteristic.SetupDataStreamTransport
            // Permissions: Paired Read, Paired Write, Write Response
            //  Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            // Valid Values:

            break;
         }
         case "SetupEndpoints":   // 153
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000118-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.setup-endpoints
            // Permissions: Paired Write, Paired Read

            // Format: TLV8

            // Valid Values:
            // See Hap Spec

            break;
         }
         case "SetupTransferTransport":   // 154
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000201-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.setupTransferTransport
            // Permissions: Paired Write, Write Response
            //  Found in HomeKit.js - Checked 11/19/2020

            // Format: TLV8

            // Valid Values:

            break;
         }
         case "SignalToNoiseRatio":   // 155
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: SignalToNoiseRatio
            // Type: public.hap.characteristic.SignalToNoiseRatio
            // Permissions: Paired Read

            // Format: int

            break;
         }
         case "SiriInputType":   // 156
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000068-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.SiriInputType
            // Permissions: Paired Read

            // Format: uint8

            // minValue: 0
            // maxValue: 0

            // Valid Values:
            // 0 - "PUSH_BUTTON_TRIGGERED_APPLE_TV"

            break;
         }
         case "SlatType":   // 157
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C0-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.type.slat
            // Permissions: Paired Read

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "HORIZONTAL"
            // 1 - "VERTICAL"

            break;
         }
         case "SleepDiscoveryMode":   // 158
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E8-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.sleepDiscoveryMode
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "NOT_DISCOVERABLE"
            // 1 - "ALWAYS_DISCOVERABLE"

            break;
         }
         case "SleepInterval":   // 159
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E8-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.sleepInterval
            // Permissions: Paired Read, Notify

            // Format: uint32

            // Minimum Value: 0
            // Min Step: 1

            // Valid Values

            break;
         }
         case "SmokeDetected":   // 160
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000076-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.smoke-detected
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "SMOKE_NOT_DETECTED" - Smoke is not detected
            // 1 - "SMOKE_DETECTED" - Smoke is detected

            break;
         }
         case "SoftwareRevision":   // 161
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: SoftwareRevision
            // Type: public.hap.characteristic.SoftwareRevision
            // Permissions: Read

            // Format: string

            break;
         }
         case "StatusActive":   // 162
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000075-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.status-active
            // Permissions: Paired Read, Notify

            // Format: bool, 0 (false) and 1 (true)

            break;
         }
         case "StatusFault":   // 163
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000077-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.status-fault
            // Permissions: Paired Read, Notify
            // Format: uint8
            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "NO_FAULT"
            // 1 - "GENERAL_FAULT"

            break;
         }
         case "StatusJammed":   // 164
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000078-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.statusJammed
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint8

            // Valid Values
            // 0 - "NOT_JAMMED"
            // 1 - "JAMMED"

            break;
         }
         case "StatusLowBattery": // 165
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000079-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.status-lo-batt
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "BATTERY_LEVEL_NORMAL" - Battery level is normal
            // 1 - "BATTERY_LEVEL_LOW"    - Battery level is low

            break;
         }
         case "StatusTampered":   // 166
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000007A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.status-tampered
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Valid Values:
            // 0 - "NOT_TAMPERED" - Accessory is not tampered"
            // 1 - "TAMPERED"     - Accessory is tampered with

            break;
         }
         case "StreamingStatus":   // 167
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000120-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.streamingStatus
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes.js  (Values ???)

            // Format: TLV8

            // Valid Values
            //

            break;
         }
         case "SulphurDioxideDensity":   // 168
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C5-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.so2
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            break;
         }
         case "SupportedAudioRecordingConfiguration":   // 169
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000207-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.SupportedAudioRecordingConfiguration
            // Permissions: Paired Read, notify
            // Found in HomeKit

            // Format: TLV8

            break;
         }
         case "SupportedAudioStreamConfiguration":   // 170
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000115-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.supportedAudioStreamConfiguration
            // Permissions: Paired Read
            // Found in HomeKit

            // Format: TLV8

            // Valid Values

            break;
         }
         case "SupportedCameraRecordingConfiguration":   // 171
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000205-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.SupportedCameraRecordingConfiguration
            // Permissions: Paired Read, Notify
            // Found in HomeKit

            // Format: TLV8

            // Valid Values

            break;
         }
         case "SupportedDataStreamTransportConfiguration":   // 172
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000130-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.SupportedDataStreamTransportConfiguration
            // Permissions: Paired Read
            // Found in HomeKit

            // Format: TLV8

            // Valid Values

            break;
         }
         case "SupportedCharacteristicValueTransitionConfiguration":   // 173
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000144
            // Type: public.hap.characteristic.SupportedCharacteristicValueTransitionConfiguration
            // Permissions: Paired Read
            // Found in HomeKit

            // Format: TLV8

            // Valid Values

            break;
         }
         case "SupportedDiagnosticsSnapshot":   // 174
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000238
            // Type: public.hap.characteristic.SupportedDiagnosticsSnapshot
            // Permissions: Paired Read
            // Found in HomeKit

            // Format: TLV8

            // Valid Values

            break;
         }
         case "SupportedRTPConfiguration":   // 175
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000116-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.supportedRTPConfiguration
            // Permissions: Paired Read,
            // Found in HomeKitTypes.js

            // Format: TLV8

            break;
         }
         case "SupportedRouterConfiguration":   // 176
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000210-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.supportedRouterConfiguration
            // Permissions: Read,
            // Found in HomeKitTypes.js - Checked 11/19/2020

            // Format: TLV8

            break;
         }
         case "SupportedTransferTransportConfiguration":   // 177
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000202-0000-1000-8000-0026BB765291'
            // Type: public.hap.characteristic.supportedTransferTransportConfiguration
            // Permissions: Paired Read,
            // Found in HomeKitTypes.js

            // Format: TLV8

            break;
         }
         case "SupportedVideoRecordingConfiguration":   // 178
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000206-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.SupportedVideoRecordingConfiguration
            // Permissions: Paired Read, Notify
            // Found in HomeKit

            // Format: TLV8

            break;
         }
         case "SupportedVideoStreamConfiguration":   // 179
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E7-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.supportedVideoStreamConfiguration
            // Permissions: Paired Read
            // Found in HomeKitTypes.js (Values ???)

            // Format: TLV8

            break;
         }
         case "SwingMode":   // 180
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B6-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.swing-mode
            // Permissions: Paired Read, Notify, Paired Write

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "SWING_DISABLED"
            // 1 - "SWING_ENABLED"

            break;
         }
         case "TargetAirPurifierState":   // 181
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000A8-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.air-purifier.state.target
            // Permissions: Paired Write,Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "MANUAL"
            // 1 - "AUTO"

            break;
         }
         case "TargetAirQuality":   // 182
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000AE-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetAirQuality
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 0

            // Valid Values
            // 0 - "EXCELLENT"
            // 1 - "GOOD"
            // 2 - "FAIR"

            break;
         }
         case "TargetControlList":   // 183
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000124-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.TargetControlList
            // Permissions: Read, Write

            // Format: tlv8

            break;
         }
         case "TargetControlSupportedConfiguration":   // 184
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000123-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.TargetControlSupportedConfiguration
            // Permissions: Paired Read

            // Format: tlv8

            break;
         }
         case "TargetDoorState":   // 185
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000032-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.door-state.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "OPEN"
            // 1 - "CLOSED"
            // 2-255 - "Reserved"

            break;
         }
         case "TargetFanState":   // 186
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000BF-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.fan.state.target
            // Permissions: Paired Write,Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "MANUAL"
            // 1 - "AUTO"

            break;
         }
         case "TargetHeaterCoolerState":   // 187
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B2-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetHeaterCoolerState
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2

            // Valid Values
            // 0 - "AUTO"
            // 1 - "HEAT"
            // 2 - "COOL"

            break;
         }
         case "TargetHeatingCoolingState":   // 188
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000033-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.heating-cooling.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3
            // Step Value: 1

            // Valid Values:
            // 0 - "OFF"
            // 1 - "HEAT" -  If the current temperature is below the target
            //               temperature then turn on heating.
            // 2 - "COOL" -  If the current temperature is above the target
            //               temperature then turn on cooling.

            break;
         }
         case "TargetHorizontalTiltAngle":   // 189
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000007B-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.horizontal-tilt.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "TargetHumidifierDehumidifierState":   // 190
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B4-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetHumidifierDehumidifierState
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 2

            // Valid Values
            // 0 - "HUMIDIFIER_OR_DEHUMIDIFIER"
            // 1 - "HUMIDIFIER"
            // 2 - "DEHUMIDIFIER"

            break;
         }
         case "TargetMediaState":   // 191
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000137-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetMediaState
            // Permissions: Paired Read, Paired Write, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 3

            // Valid Values
            // 0 - "PLAY"
            // 1 - "PAUSE"
            // 2 - "STOP"
            // 3 - Reserved ????

            break;
         }
         case "TargetPosition":   // 192
         {

            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID 0000007C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.position.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "TargetRelativeHumidity":   // 193
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000010-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.relative-humidity.current
            // Permissions: Paaired Write, Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "TargetSlatState":   // 194
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000BE-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetSlatState
            // Permissions: Paired Write, Paired Read, Notify
            // Found in HomeKitTypes.js

            // Format: uint32

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "MANUAL"
            // 1 - "AUTO"

            break;
         }
         case "TargetTemperature":   // 195
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "22.2" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000035-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.temperature.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: float

            // Minimum Value 10
            // Maximum Value 38
            // Step Value 0.1
            // Unit celsius

            break;
         }
         case "TargetTiltAngle":   // 196
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C2-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.tilt.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "TargetVerticalTiltAngle":   // 197
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000007D-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.vertical-tilt.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: int

            // Minimum Value: -90
            // Maximum Value: 90
            // Step Value: 1
            // Unit: arcdegrees

            break;
         }
         case "TargetVisibilityState":   // 198
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000134-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.targetVisibilityState
            // Permissions: Paired Read, Paired Write, Notify
            // Found in  HomeKitTypes-Television.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "SHOWN"
            // 1 - "HIDDEN"

            break;
         }
         case "TemperatureDisplayUnits":   // 199
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000036-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.temperature.units
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1
            // Step Value: 1

            // Valid Values:
            // 0 - "CELCIUS"
            // 1 - "FEHRENHEIT"

            break;
         }
         case "ThirdPartyCameraActive":   // 200
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021C-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.thirdPartyCameraActive
            // Permissions: Read, Notify
            // Found in  HomeKit.js - Checked 11/19/2020

            // Format: uint8

            // Valid Values
            // 0 - "OFF"
            // 1 - "ON"

            break;
         }
         case "TimeUpdate":   // 201
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.timeUpdate
            // Permissions: Paired Read, Notify
            // found in HomeKitTypes-Bridge.js (Values ????)

            // Format: Bool

            // Valid Values

            break;
         }
         case "TransmitPower":   // 202
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000242
            // Type: public.hap.characteristic.TransmitPower
            // Permissions: Paired Read

            // Format: INT

            // Valid Values

            break;
         }
         case "TransmitPowerMaximum":   // 203
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000243
            // Type: public.hap.characteristic.TransmitPowerMaximum
            // Permissions: Paired Read

            // Format: INT

            // Valid Values

            break;
         }
         case "TunnelConnectionTimeout":   // 204
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "5000" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000061-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.timeUpdate
            // Permissions: Paired Write, Paired Read, Notify
            // found in HomeKitTypes-Bridge.js (Values ????)

            // Format: uint32

            break;
         }
         case "TunneledAccessoryAdvertising":   // 205
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000009A-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.timeUpdate
            // Permissions: Paired Read, Notify
            // found in HomeKitTypes-Bridge.js (Values ????)

            // Format: Bool

            // Valid Values

            break;
         }
         case "TunneledAccessoryConnected":   // 206
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000059-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.tunneledAccessoryConnected
            // Permissions: Paired Write, Paired Read, Notify
            // found in HomeKitTypes-Bridge.js (Values ????)

            // Format: Bool

            // Valid Values

            break;
         }
         case "TunneledAccessoryStateNumber":   // 207
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000058-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.timeUpdate
            // Permissions: Paired Read, Notify
            // found in HomeKitTypes-Bridge.js (Values ????)

            // Format: float

            // Valid Values

            break;
         }
         case "VOCDensity":   // 208
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000C8-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.density.voc
            // Permissions: Paired Read, Notify

            // Format: float

            // Minimum Value: 0
            // Maximum Value: 1000

            break;
         }
         case "ValveType":   // 209
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000D5-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.valveType
            // Permissions: Paired Read, Notify
            // found in HomeKitTypes.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3

            // Valid Values
            // 0 - "GENERIC_VALVE"
            // 1 - "IRRIGATION"
            // 2 - "SHOWER_HEAD"
            // 3 - "WATER_FAUCET?"

            break;
         }
         case "Version":   // 210
         {
            c = readData( device, characteristic );

            if ( c == "LockVersion" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000037-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.version
            // Permissions: Paired Read

            // Format: string

            // Maximum Length: 64

            break;
         }
         case "VideoAnalysisActive":   // 211
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-00000229
            // Type: public.hap.characteristic.VideoAnalysisActive
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            break;
         }
         case "Volume":   // 212
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000119-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.volume
            // Permissions: Paired Write, Paired Read, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 100
            // Step Value: 1
            // Unit: percentage

            break;
         }
         case "VolumeControlType":   // 213
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000E9-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.volumeControlyype
            // Permissions: Paired Read, Notify
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 1

            // Valid Values
            // 0 - "NONE"
            // 1 - "RELATIVE"
            // 2 - "RELATIVE_WITH_CURRENT"
            // 3 - "ABSOLUTE"

            break;
         }
         case "VolumeSelector":   // 214
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000EA-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.volumeSelector
            // Permissions: Paired Write
            // Found in HomeKitTypes-Television.js

            // Format: uint8

            // Valid Values
            // 0 - "INCREMENT"
            // 1 - "DECREMENT"

            break;
         }
         case "WANConfigurationList":   // 215
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000211-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.WANConfigurationList
            // Permissions: Read, Notify
            // Found in HomeKit.js - Checked 11/23/2020

            // Format: TLV8

            // Valid Values

            break;
         }
         case "WANStatusList":   // 216
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000212-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.WANStatusList
            // Permissions: Read, Notify
            // Found in HomeKit.js - Checked 11/23/2020

            // Format: TLV8

            // Valid Values

            break;
         }
         case "WakeConfiguration":   // 217
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000EA-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.wakeConfiguration
            // Permissions: Paired Write
            // Found in HomeKit.js - Checked 11/23/2020

            // Format: TLV8

            // Valid Values

            break;
         }
         case "WaterLevel":  // 218
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B5-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.waterLevel
            // Permissions: Paired Read

            // Format: float

            // Minimum: 0
            // Maximum: 100

            break;
         }
         case "WiFiCapabilities":   // 219
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000022C
            // Type: public.hap.characteristic.WiFiCapabilities
            // Permissions: Paired Read

            // Format: uint32

            break;
         }
         case "WiFiConfigurationControl":   // 220
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 0000021E-0000-1000-8000-0000022D
            // Type: public.hap.characteristic.WiFiCapabilities
            // Permissions: Paired Read, Paired Write, Notify, Timed Write, Write Response

            // Format: tlv8

            break;
         }
         case "WiFiSatelliteStatus":  // 221
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // UUID: 000000B5-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.WiFiSatelliteStatus
            // Permissions: Paired Read, Notify

            // Format: uint8

            // Minimum: 0
            // Maximum: 2

            // Valid Values
            // 0 - "UNKNOWN"
            // 1 - "CONNECTED"
            // 2 - "NOT_CONNECTED"

            break;
         }
            default:
                process.stderr.write( `Unknown Characteristic for: ${ io } Device: ${ device } Characteristic: ${ characteristic }` );
                process.exit( -1 );
       }

       break;

   } // End of Switch for "Get"
   case "Set":
   {
      switch( characteristic )
      {
         case "AccessControlLevel":   // 0
         {
            writeData( device, characteristic, option );

            break;
         }
         case "AccessoryFlags":   // 1
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "AccessoryIdentifier":   // 2
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Active":   // 3
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ActiveIdentifier":   // 4
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ActivityInterval":   // 5
         {
            writeData( device, characteristic, option );

            break;
         }
         case "AdministratorOnlyAccess":   // 6
         {
            writeData( device, characteristic, option );

            break;
         }
         case "AirParticulateDensity":   // 7
         {
            writeData( device, characteristic, option );

            break;
         }
         case "AirParticulateSize":   // 8
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "AirQuality":   // 9
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "AppMatchingIdentifier":   // 10
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "AudioFeedback":   // 11
         {
            writeData( device, characteristic, option );

            break;
         }
         case "BatteryLevel":   // 12
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Brightness":   // 13
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ButtonEvent":   // 14
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CCAEnergyDetectThreshold":   // 15
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CCASignalDetectThreshold":   // 16
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CameraOperatingModeIndicator":   // 17
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CarbonDioxideDetected":   // 18
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CarbonDioxideLevel":   // 19
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CarbonDioxidePeakLevel":   // 20
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CarbonMonoxideDetected":   // 21
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CarbonMonoxideLevel":   // 22
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CarbonMonoxidePeakLevel":   // 23
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Category":   // 24
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CharacteristicValueTransitionControl":   // 25
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ChargingState":   // 26
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ClosedCaptions":   // 27
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ColorTemperature":   // 28
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ConfigureBridgedAccessory":   // 29
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ConfigureBridgedAccessoryStatus":   // 30
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ConfiguredName":   // 31
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ContactSensorState":   // 32
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CoolingThresholdTemperature":   // 33
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CurrentAirPurifierState":   // 34
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentAmbientLightLevel":   // 35
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentDoorState":   // 36
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentFanState":   //  37
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentHeaterCoolerState":   // 38
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentHeatingCoolingState":   // 39
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentHorizontalTiltAngle":   // 40
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentHumidifierDehumidifierState":   // 41
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CurrentMediaState":   // 42
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CurrentPosition":   // 43
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentRelativeHumidity":   // 44
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentSlatState":   // 45
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentTemperature":   // 46
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentTiltAngle":   // 47
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentTime":   // 48
         {
            writeData( device, characteristic, option );

            break;
         }
         case "CurrentTransport":   // 49
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentVerticalTiltAngle":   // 50
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "CurrentVisibilityState":   // 51
         {
            writeData( device, characteristic, option );

            break;
         }
         case "DataStreamHAPTransport":   // 52
         {
            writeData( device, characteristic, option );

            break;
         }
         case "DataStreamHAPTransportInterrupt":   // 53
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "DayoftheWeek":   // 54
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "DiagonalFieldOfView":   // 55
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "DigitalZoom":   // 56
         {
            writeData( device, characteristic, option );

            break;
         }
         case "DiscoverBridgedAccessories":   // 57
         {
            writeData( device, characteristic, option );

            break;
         }
         case "DiscoveredBridgedAccessories":   // 58
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "DisplayOrder":  // 59
         {
            writeData( device, characteristic, option );

            break;
         }
         case "EventRetransmissionMaximum":  // 60
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "EventSnapshotsActive":  // 61
         {
            writeData( device, characteristic, option );

            break;
         }
         case "EventTransmissionCounters":  // 62
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "FilterChangeIndication":   // 63
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "FilterLifeLevel":   // 64
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "FirmwareRevision":   // 65
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "HardwareRevision":   // 66
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "HeartBeat":   // 67
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "HeatingThresholdTemperature": // 68
         {
            writeData( device, characteristic, option );

            break;
         }
         case "HoldPosition":   // 69
         {
            writeData( device, characteristic, option );

            break;
         }
         case "HomeKitCameraActive":   // 70
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Hue":   // 71
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Identifier":   // 72
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Identify":   // 73
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ImageMirroring":   // 74
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ImageRotation":   // 75
         {
            writeData( device, characteristic, option );

            break;
         }
         case "InUse":   // 76
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "InputDeviceType":   // 77
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "InputSourceType":   // 78
         {
            writeData( device, characteristic, option );

            break;
         }
         case "IsConfigured":   // 79
         {
            writeData( device, characteristic, option );

            break;
         }
         case "LeakDetected":   // 80
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LinkQuality":   // 81
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockControlPoint":   // 82
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockCurrentState":   // 83
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockLastKnownAction":   // 84
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockManagementAutoSecurityTimeout":   // 85
         {
            writeData( device, characteristic, option );

            break;
         }
         case "LockPhysicalControls":   // 86
         {
            writeData( device, characteristic, option );

            break;
         }
         case "LockTargetState":   // 87
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "LockCurrentState", option);

            break;
         }
         case "Logs":   // 88
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MACRetransmissionMaximum":   // 89
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MACTransmissionCounters":   // 90
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ManagedNetworkEnable":   // 91
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ManuallyDisabled":   // 92
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Manufacturer":   // 93
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Model":   // 94
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MotionDetected":   // 95
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Mute":   // 96
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Name":   // 97
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "NetworkAccessViolationControl":   // 98
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NetworkClientProfileControl":   // 99
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NetworkClientStatusControl":   // 100
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NightVision":   // 101
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NitrogenDioxideDensity":   // 102
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ObstructionDetected":   // 103
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OccupancyDetected":   // 104
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "On":  // 105
         {
            writeData( device, characteristic, option );

            break;
         }
         case "OperatingStateResponse":  // 106
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OpticalZoom":   // 107
         {
            writeData( device, characteristic, option );

            break;
         }
         case "OutletInUse":   // 108
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OzoneDensity":   // 109
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PM10Density":   // 110
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PM2_5Density":   // 111
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PairSetup":   // 112
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PairVerify":   // 113
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PairingFeatures":   // 114
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PairingPairings":   // 115
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PasswordSetting":   // 116
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PeriodicSnapshotsActive":   // 118
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PictureMode":   // 118
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Ping":   // 119
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PositionState":   // 120
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PowerModeSelection":   // 121
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ProductData":   // 122
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ProgramMode":   // 123
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ProgrammableSwitchEvent":   // 124
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ProgrammableSwitchOutputState":   // 125
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Reachable":   // 126
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ReceivedSignalStrengthIndication":   // 127
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ReceiverSensitivity":   // 128
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RecordingAudioActive":   // 129
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelativeHumidityDehumidifierThreshold":   // 130
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelativeHumidityHumidifierThreshold":   // 131
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelayControlPoint":   // 132
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RelayEnabled":   // 133
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelayState":   // 134
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RemainingDuration":   // 135
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RemoteKey":   // 136
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ResetFilterIndication":   // 137
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RotationDirection":   // 138
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RotationSpeed":   // 139
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RouterStatus":   // 140
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Saturation":   // 141
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SecuritySystemAlarmType":   // 142
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SecuritySystemCurrentState":   // 143
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SecuritySystemTargetState":   // 144
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"SecuritySystemCurrentState", option);

            break;
         }
         case "SelectedAudioStreamConfiguration":   // 145
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SelectedCameraRecordingConfiguration":   // 146
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SelectedRTPStreamConfiguration":   // 147
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SerialNumber":   // 148
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ServiceLabelIndex":   // 149
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ServiceLabelNamespace":   // 150
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SetDuration":   // 151
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupDataStreamTransport":   // 152
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupEndpoints":   // 153
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupTransferTransport":   // 154
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SignalToNoiseRatio":   // 155
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SiriInputType":   // 156
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SlatType":   // 157
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SleepDiscoveryMode":   // 158
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SleepInterval":   // 159
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SmokeDetected":   // 160
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SoftwareRevision":   // 161
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusActive":   // 162
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusFault":   // 163
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusJammed":   // 164
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusLowBattery":   // 165
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusTampered":   // 166
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StreamingStatus":   // 167
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SulphurDioxideDensity":   // 168
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedAudioRecordingConfiguration":   // 169
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedAudioStreamConfiguration":   // 170
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedCameraRecordingConfiguration":   // 171
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedDataStreamTransportConfiguration":   // 172
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedCharacteristicValueTransitionConfiguration":   // 173
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedDiagnosticsSnapshot":   // 174
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedRTPConfiguration":   // 175
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedRouterConfiguration":   // 176
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedTransferTransportConfiguration":   // 177
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedVideoRecordingConfiguration":   // 178
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedVideoStreamConfiguration":   // 179
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SwingMode":   // 180
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TargetAirPurifierState":   // 181
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentAirPurifierState", option);

            break;
         }
         case "TargetAirQuality":   // 182
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "AirQuality", option);

            break;
         }
         case "TargetControlList":   // 183
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TargetControlSupportedConfiguration":   // 184
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TargetDoorState":   // 185
         {
            writeData( device, characteristic, option );

            // Set to Done
            writeData(device, "CurrentDoorState", option);

            break;
         }
         case "TargetFanState":   // 186
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentFanState", option);

            break;
         }
         case "TargetHeaterCoolerState":   // 187
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentHeaterCoolerState", option);

            break;
         }
         case "TargetHeatingCoolingState":   // 188
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentHeatingCoolingState", option);

            break;
         }
         case "TargetHorizontalTiltAngle":   // 189
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentHorizontalTiltAngle", option);

            break;
         }
         case "TargetHumidifierDehumidifierState":   // 190
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentHumidifierDehumidifierState", option);

            break;
         }
         case "TargetMediaState":   // 191
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentMediaState", option);

            break;
         }
         case "TargetPosition":   // 192
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentPosition", option);

            break;
         }
         case "TargetRelativeHumidity":   // 193
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "CurrentRelativeHumidity", option);

            break;
         }
         case "TargetSlatState":   // 194
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "CurrentSlatState", option);

            break;
         }
         case "TargetTemperature":   // 195
         {
            writeData( device, characteristic, option );

            // Fake it
            writeData(device, "CurrentTemperature", option);

            break;
         }
         case "TargetTiltAngle":   // 196
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentTiltAngle", option);

            break;
         }
         case "TargetVerticalTiltAngle":   // 197
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentVerticalTiltAngle", option);

            break;
         }
         case "TargetVisibilityState":   // 198
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentVisibilityState", option);

            break;
         }
         case "TemperatureDisplayUnits":   // 199
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ThirdPartyCameraActive":   // 200
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TimeUpdate":   // 201
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TransmitPower":   // 202
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TransmitPowerMaximum":   // 203
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TunnelConnectionTimeout":   // 204
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TunneledAccessoryAdvertising":   // 205
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TunneledAccessoryConnected":   // 206
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TunneledAccessoryStateNumber":   // 207
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VOCDensity":   // 208
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ValveType":   // 209
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Version":   // 210
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VideoAnalysisActive":   // 211
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Volume":   // 212
         {
            writeData( device, characteristic, option );

            break;
         }
         case "VolumeControlType":   // 213
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VolumeSelector":   // 214
         {
            writeData( device, characteristic, option );

            break;
         }
         case "WANConfigurationList":   // 215
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WANStatusList":   // 216
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WakeConfiguration":   // 217
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WaterLevel":   // 218
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiCapabilities":   // 219
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiConfigurationControl":   // 220
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiSatelliteStatus":   // 218
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         default:
            process.stderr.write( `Unknown Characteristic for: ${ io } Device:${ device  } Characteristic:${ characteristic }` );
            process.exit( -1 );
      }

      break;
   } // End of Switch Device for "Set"
   default:
      process.stderr.write( `Unknown IO ${ io }` );
      process.exit( -1 );
}

//process.stdout.write( `Say What Device: ${ device } Characteristic: ${ characteristic } Option: ${ option }` );

process.exit( 0 );


