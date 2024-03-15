#!/usr/bin/env node
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

            // To avoid hard coding values, characteristic definitions can be found in:
            // Cmd4 Github pages -> http://ztalbot2000.github.io/homebridge-cmd4
            // Homebridge developer documentation -> https://developers.homebridge.io/#/

            break;
         }
         case "AccessoryFlags":   // 1
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AccessoryIdentifier":   // 2
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "TLB" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Active":   // 3
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ActiveIdentifier":   // 4
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ActivityInterval":   // 5
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AdministratorOnlyAccess":   // 6
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AirParticulateDensity":   // 7
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "30" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AirParticulateSize":   // 8
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AirQuality":   // 9
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AppMatchingIdentifier":   // 10
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AudioFeedback":   // 11
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "BatteryLevel":   // 12
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Brightness":   // 13
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ButtonEvent":   // 14
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CCAEnergyDetectThreshold":   // 15
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CCASignalDetectThreshold":   // 16
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CameraOperatingModeIndicator":   // 17
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonDioxideDetected":   // 18
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonDioxideLevel":   // 19
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonDioxidePeakLevel":   // 20
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonMonoxideDetected":   // 21
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonMonoxideLevel":   // 22
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CarbonMonoxidePeakLevel":   // 23
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Category":   // 24
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CharacteristicValueTransitionControl":   // 25
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ChargingState":   // 26
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ClosedCaptions":   // 27
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ColorTemperature":   // 28
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ConfigureBridgedAccessory":   // 29
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ConfigureBridgedAccessoryStatus":   // 30
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ConfiguredName":   // 31
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( `"${ device }"` ); else process.stdout.write(`"${ c }"` );

            break;
         }
         case "ContactSensorState":   // 32
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CoolingThresholdTemperature":   // 33
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "32.4" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentAirPurifierState":   // 34
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentAmbientLightLevel":   // 35
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentDoorState":   // 36
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentFanState":   // 37
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentHeaterCoolerState":   // 38
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            process.exit(0);

            break;
         }
         case "CurrentHeatingCoolingState":   // 39
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            process.exit(0);

            break;
         }
         case "CurrentHorizontalTiltAngle":   // 40
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentHumidifierDehumidifierState":   // 41
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentMediaState":   // 42
         {
            c = readData( device, characteristic );

            //validValues:
            //  "PLAY"
            //  "PAUSE"
            //  "STOP"
            //  "LOADING"
            //  "INTERRUPTED"

            if ( c == "" ) process.stdout.write( "STOP" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentPosition":   // 43
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentRelativeHumidity":   // 44
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "60.2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentSlatState":   // 45
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentTemperature":   // 46
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "22.2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentTiltAngle":   // 47
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentTime":   // 48
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "11.5" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentTransport":   // 49
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentVerticalTiltAngle": // 50
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CurrentVisibilityState":   // 51
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DataStreamHAPTransport":   // 52
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DataStreamHAPTransportInterrupt":   // 53
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DayoftheWeek":   // 54
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DiagonalFieldOfView":   // 55
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DigitalZoom":   // 56
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DiscoverBridgedAccessories":   // 57
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DiscoveredBridgedAccessories":   // 58
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "DisplayOrder":   // 59
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "EventRetransmissionMaximum":   // 60
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "EventSnapshotsActive":   // 61
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "EventTransmissionCounters":   // 62
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "FilterChangeIndication":   // 63
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "FilterLifeLevel":   // 64
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "FirmwareRevision":   // 65
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100.1.1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HardwareRevision":   // 66
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100.1.1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HeartBeat":   // 67
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "64" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HeatingThresholdTemperature":   // 68
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "25.2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HoldPosition": // 69
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HomeKitCameraActive": // 70
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Hue":   // 71
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

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

            break;
         }
         case "Identify":   // 73
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ImageMirroring":   // 74
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ImageRotation":   // 75
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "InUse":   // 76
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "InputDeviceType":   // 77
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "InputSourceType":   // 78
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "IsConfigured":   // 79
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LeakDetected":   // 80
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LinkQuality":   // 81
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ListPairings":   // 82
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockControlPoint":   // 83
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockCurrentState":   // 84
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockLastKnownAction":   // 85
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockManagementAutoSecurityTimeout":   // 86
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "26" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockPhysicalControls":   // 87
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "LockTargetState":   // 88
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Logs":   // 89
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MACRetransmissionMaximum":   // 90
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MACTransmissionCounters":   // 91
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ManagedNetworkEnable":   // 92
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ManuallyDisabled":   // 93
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Manufacturer":   // 94
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "Homebridge" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Model": // 95
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MotionDetected":   // 96
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Mute":   // 97
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Name":   // 98
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( `"${ device }"` ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NetworkAccessViolationControl":   // 99
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NetworkClientProfileControl":   // 100
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NetworkClientStatusControl":   // 101
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NightVision":   // 102
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NitrogenDioxideDensity":   // 103
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ObstructionDetected":   // 104
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "OccupancyDetected":   // 105
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "On":   // 106
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "OperatingStateResponse":   // 107
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "OpticalZoom":   // 108
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "OutletInUse":   // 109
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "OzoneDensity":   // 110
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PM10Density":   // 111
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PM2_5Density":   // 112
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PairSetup":   // 113
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PairVerify":   // 114
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PairingFeatures":   // 115
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PairingPairings":   // 116
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PasswordSetting":   // 117
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PeriodicSnapshotsActive":   // 118
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PictureMode":   // 119
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Ping":   // 120
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PositionState":   // 121
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "PowerModeSelection":   // 122
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ProductData":   // 123
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ProgramMode":   // 124
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ProgrammableSwitchEvent":   // 125
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ProgrammableSwitchOutputState":   // 126
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Reachable":   // 127
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ReceivedSignalStrengthIndication":   // 128
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ReceiverSensitivity":   // 129
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RecordingAudioActive":   // 130
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RelativeHumidityDehumidifierThreshold":   // 131
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RelativeHumidityHumidifierThreshold":   // 132
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RelayControlPoint":   // 133
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RelayEnabled":   // 134
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RelayState":   // 135
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RemainingDuration":   // 136
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RemoteKey":   // 137
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ResetFilterIndication":   // 138
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RotationDirection":   // 139
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RotationSpeed":   // 140
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "RouterStatus":   // 141
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Saturation":   // 142
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SecuritySystemAlarmType":   // 143
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SecuritySystemCurrentState":   // 144
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "3" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SecuritySystemTargetState":   // 145
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SelectedAudioStreamConfiguration":   // 146
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SelectedCameraRecordingConfiguration":   // 147
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SelectedRTPStreamConfiguration":   // 148
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SerialNumber":   // 149
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "ABC001" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ServiceLabelIndex":   // 150
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ServiceLabelNamespace":   // 151
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SetDuration":   // 152
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SetupDataStreamTransport":   // 153
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SetupEndpoints":   // 154
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SetupTransferTransport":   // 155
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SignalToNoiseRatio":   // 156
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriInputType":   // 157
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SlatType":   // 158
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SleepDiscoveryMode":   // 159
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SleepInterval":   // 160
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SmokeDetected":   // 161
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SoftwareRevision":   // 162
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StatusActive":   // 163
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StatusFault":   // 164
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StatusJammed":   // 165
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StatusLowBattery": // 166
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StatusTampered":   // 167
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StreamingStatus":   // 168
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SulphurDioxideDensity":   // 169
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedAudioRecordingConfiguration":   // 170
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedAudioStreamConfiguration":   // 171
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedCameraRecordingConfiguration":   // 172
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedDataStreamTransportConfiguration":   // 173
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedCharacteristicValueTransitionConfiguration":   // 174
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedDiagnosticsSnapshot":   // 175
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedRTPConfiguration":   // 176
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedRouterConfiguration":   // 177
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedTransferTransportConfiguration":   // 178
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedVideoRecordingConfiguration":   // 179
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedVideoStreamConfiguration":   // 180
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SwingMode":   // 181
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "100" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetAirPurifierState":   // 182
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetAirQuality":   // 183
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetControlList":   // 184
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetControlSupportedConfiguration":   // 185
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetDoorState":   // 186
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetFanState":   // 187
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetHeaterCoolerState":   // 188
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetHeatingCoolingState":   // 189
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetHorizontalTiltAngle":   // 190
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetHumidifierDehumidifierState":   // 191
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetMediaState":   // 192
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetPosition":   // 193
         {

            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetRelativeHumidity":   // 194
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetSlatState":   // 195
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetTemperature":   // 196
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "22.2" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetTiltAngle":   // 197
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetVerticalTiltAngle":   // 198
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TargetVisibilityState":   // 199
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TemperatureDisplayUnits":   // 200
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ThirdPartyCameraActive":   // 201
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TimeUpdate":   // 202
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TransmitPower":   // 203
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MaximumTransmitPower":   // 204
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TunnelConnectionTimeout":   // 205
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "5000" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TunneledAccessoryAdvertising":   // 206
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TunneledAccessoryConnected":   // 207
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TunneledAccessoryStateNumber":   // 208
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "VOCDensity":   // 209
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50.0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ValveType":   // 210
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Version":   // 211
         {
            c = readData( device, characteristic );

            if ( c == "LockVersion" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "VideoAnalysisActive":   // 212
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Volume":   // 213
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "VolumeControlType":   // 214
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "VolumeSelector":   // 215
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WANConfigurationList":   // 216
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WANStatusList":   // 217
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WakeConfiguration":   // 218
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WaterLevel":  // 219
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WiFiCapabilities":   // 220
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "50" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WiFiConfigurationControl":   // 221
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "WiFiSatelliteStatus":  // 222
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AssetUpdateReadiness":  // 223
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedAssetTypes":  // 224
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ConfigurationState":  // 225
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NFCAccessControlPoint":  // 226
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NFCAccessSupportedConfiguration":  // 227
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriEndpointSessionStatus":  // 228
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ThreadControlPoint":  // 229
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ThreadNodeCapabilities":  // 230
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "ThreadStatus":  // 231
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            // To avoid hard coding values, characteristic definitions can be found in:
            // Cmd4 Github pages -> http://ztalbot2000.github.io/homebridge-cmd4
            // Homebridge developer documentation -> https://developers.homebridge.io/#/

            break;
         }
         case "ThreadOpenThreadVersion":  // 232
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         // New Mar 2024
         case "AccessCodeControlPoint":  // 233
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AccessCodeSupportedConfiguration":  // 234
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "AirPlayEnable":  // 235
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CharacteristicValueActiveTransitionCount":  // 236
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "CryptoHash":  // 237
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "FirmwareUpdateReadiness":  // 238
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "FirmwareUpdateStatus":  // 239
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "HardwareFinish":  // 240
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MetricsBufferFullState":  // 241
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "MultifunctionButton":  // 242
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "NetworkAccessViolationControl":  // 243
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SelectedDiagnosticsModes":  // 244
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SelectedSleepConfiguration":  // 245
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriEnable":  // 246
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriEngineVersion":  // 247
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriLightOnUse":  // 248
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriListening":  // 249
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SiriTouchToUse":  // 250
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "StagedFirmwareVersion":  // 251
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedMetrics":  // 252
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "SupportedFirmwareUpdateConfiguration":  // 253
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "TapType":  // 254
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

            break;
         }
         case "Token":  // 255
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "0" ); else process.stdout.write( `"${ c }"` );

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
         case "ListPairings":   // 82
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockControlPoint":   // 83
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockCurrentState":   // 84
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockLastKnownAction":   // 85
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockManagementAutoSecurityTimeout":   // 86
         {
            writeData( device, characteristic, option );

            break;
         }
         case "LockPhysicalControls":   // 87
         {
            writeData( device, characteristic, option );

            break;
         }
         case "LockTargetState":   // 88
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "LockCurrentState", option);

            break;
         }
         case "Logs":   // 89
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MACRetransmissionMaximum":   // 90
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MACTransmissionCounters":   // 91
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ManagedNetworkEnable":   // 92
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ManuallyDisabled":   // 93
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Manufacturer":   // 94
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Model":   // 95
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MotionDetected":   // 96
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Mute":   // 97
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Name":   // 98
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "NetworkAccessViolationControl":   // 99
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NetworkClientProfileControl":   // 100
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NetworkClientStatusControl":   // 101
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NightVision":   // 102
         {
            writeData( device, characteristic, option );

            break;
         }
         case "NitrogenDioxideDensity":   // 103
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ObstructionDetected":   // 104
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OccupancyDetected":   // 105
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "On":  // 106
         {
            writeData( device, characteristic, option );

            break;
         }
         case "OperatingStateResponse":  // 107
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OpticalZoom":   // 108
         {
            writeData( device, characteristic, option );

            break;
         }
         case "OutletInUse":   // 109
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "OzoneDensity":   // 110
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PM10Density":   // 111
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PM2_5Density":   // 112
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PairSetup":   // 113
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PairVerify":   // 114
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PairingFeatures":   // 115
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PairingPairings":   // 116
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PasswordSetting":   // 117
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PeriodicSnapshotsActive":   // 118
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PictureMode":   // 119
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Ping":   // 120
         {
            writeData( device, characteristic, option );

            break;
         }
         case "PositionState":   // 121
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "PowerModeSelection":   // 122
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ProductData":   // 123
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ProgramMode":   // 124
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ProgrammableSwitchEvent":   // 125
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ProgrammableSwitchOutputState":   // 126
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Reachable":   // 127
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ReceivedSignalStrengthIndication":   // 128
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ReceiverSensitivity":   // 129
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RecordingAudioActive":   // 130
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelativeHumidityDehumidifierThreshold":   // 131
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelativeHumidityHumidifierThreshold":   // 132
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelayControlPoint":   // 133
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RelayEnabled":   // 134
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RelayState":   // 135
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RemainingDuration":   // 136
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "RemoteKey":   // 137
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ResetFilterIndication":   // 138
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RotationDirection":   // 139
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RotationSpeed":   // 140
         {
            writeData( device, characteristic, option );

            break;
         }
         case "RouterStatus":   // 141
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Saturation":   // 142
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SecuritySystemAlarmType":   // 143
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SecuritySystemCurrentState":   // 144
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SecuritySystemTargetState":   // 145
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"SecuritySystemCurrentState", option);

            break;
         }
         case "SelectedAudioStreamConfiguration":   // 146
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SelectedCameraRecordingConfiguration":   // 147
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SelectedRTPStreamConfiguration":   // 148
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SerialNumber":   // 149
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ServiceLabelIndex":   // 150
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ServiceLabelNamespace":   // 151
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SetDuration":   // 152
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupDataStreamTransport":   // 153
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupEndpoints":   // 154
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SetupTransferTransport":   // 155
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SignalToNoiseRatio":   // 156
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SiriInputType":   // 157
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SlatType":   // 158
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SleepDiscoveryMode":   // 159
         {
            writeData( device, characteristic, option );

            break;
         }
         case "SleepInterval":   // 160
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SmokeDetected":   // 161
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SoftwareRevision":   // 162
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusActive":   // 163
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusFault":   // 164
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusJammed":   // 165
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusLowBattery":   // 166
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusTampered":   // 167
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StreamingStatus":   // 168
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SulphurDioxideDensity":   // 169
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedAudioRecordingConfiguration":   // 170
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedAudioStreamConfiguration":   // 171
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedCameraRecordingConfiguration":   // 172
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedDataStreamTransportConfiguration":   // 173
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedCharacteristicValueTransitionConfiguration":   // 174
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedDiagnosticsSnapshot":   // 175
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedRTPConfiguration":   // 176
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedRouterConfiguration":   // 177
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedTransferTransportConfiguration":   // 178
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedVideoRecordingConfiguration":   // 179
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SupportedVideoStreamConfiguration":   // 180
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "SwingMode":   // 181
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TargetAirPurifierState":   // 182
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentAirPurifierState", option);

            break;
         }
         case "TargetAirQuality":   // 183
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "AirQuality", option);

            break;
         }
         case "TargetControlList":   // 184
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TargetControlSupportedConfiguration":   // 185
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TargetDoorState":   // 186
         {
            writeData( device, characteristic, option );

            // Set to Done
            writeData(device, "CurrentDoorState", option);

            break;
         }
         case "TargetFanState":   // 187
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentFanState", option);

            break;
         }
         case "TargetHeaterCoolerState":   // 188
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentHeaterCoolerState", option);

            break;
         }
         case "TargetHeatingCoolingState":   // 189
         {
            writeData( device, characteristic, option );

            // Fake it Done
            writeData(device, "CurrentHeatingCoolingState", option);

            break;
         }
         case "TargetHorizontalTiltAngle":   // 190
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentHorizontalTiltAngle", option);

            break;
         }
         case "TargetHumidifierDehumidifierState":   // 191
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentHumidifierDehumidifierState", option);

            break;
         }
         case "TargetMediaState":   // 192
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentMediaState", option);

            break;
         }
         case "TargetPosition":   // 193
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentPosition", option);

            break;
         }
         case "TargetRelativeHumidity":   // 194
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "CurrentRelativeHumidity", option);

            break;
         }
         case "TargetSlatState":   // 195
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device, "CurrentSlatState", option);

            break;
         }
         case "TargetTemperature":   // 196
         {
            writeData( device, characteristic, option );

            // Fake it
            writeData(device, "CurrentTemperature", option);

            break;
         }
         case "TargetTiltAngle":   // 197
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentTiltAngle", option);

            break;
         }
         case "TargetVerticalTiltAngle":   // 198
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentVerticalTiltAngle", option);

            break;
         }
         case "TargetVisibilityState":   // 199
         {
            writeData( device, characteristic, option );

            // Set to done
            writeData(device,"CurrentVisibilityState", option);

            break;
         }
         case "TemperatureDisplayUnits":   // 200
         {
            writeData( device, characteristic, option );

            break;
         }
         case "ThirdPartyCameraActive":   // 201
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TimeUpdate":   // 202
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TransmitPower":   // 203
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "MaximumTransmitPower":   // 204
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TunnelConnectionTimeout":   // 205
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TunneledAccessoryAdvertising":   // 206
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "TunneledAccessoryConnected":   // 207
         {
            writeData( device, characteristic, option );

            break;
         }
         case "TunneledAccessoryStateNumber":   // 208
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VOCDensity":   // 209
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "ValveType":   // 210
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "Version":   // 211
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VideoAnalysisActive":   // 212
         {
            writeData( device, characteristic, option );

            break;
         }
         case "Volume":   // 213
         {
            writeData( device, characteristic, option );

            break;
         }
         case "VolumeControlType":   // 214
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "VolumeSelector":   // 215
         {
            writeData( device, characteristic, option );

            break;
         }
         case "WANConfigurationList":   // 216
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WANStatusList":   // 217
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WakeConfiguration":   // 218
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WaterLevel":   // 219
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiCapabilities":   // 220
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiConfigurationControl":   // 221
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "WiFiSatelliteStatus":   // 222
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }

         case "AssetUpdateReadiness":  // 223
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SupportedAssetTypes":  // 224
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "ConfigurationState":  // 225
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "NFCAccessControlPoint":  // 226
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "NFCAccessSupportedConfiguration":  // 227
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriEndpointSessionStatus":  // 228
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "ThreadControlPoint":  // 229
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "ThreadNodeCapabilities":  // 230
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "ThreadStatus":  // 231
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "ThreadOpenThreadVersion":  // 232
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         // New Mar 2024
         case "AccessCodeControlPoint":  // 233
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "AccessCodeSupportedConfiguration":  // 234
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "AirPlayEnable":  // 235
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "CharacteristicValueActiveTransitionCount":  // 236
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "CryptoHash":  // 237
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "FirmwareUpdateReadiness":  // 238
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "FirmwareUpdateStatus":  // 239
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "HardwareFinish":  // 240
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "MetricsBufferFullState":  // 241
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "MultifunctionButton":  // 242
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "NetworkAccessViolationControl":  // 243
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SelectedDiagnosticsModes":  // 244
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SelectedSleepConfiguration":  // 245
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriEnable":  // 246
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriEngineVersion":  // 247
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriLightOnUse":  // 248
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriListening":  // 249
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SiriTouchToUse":  // 250
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "StagedFirmwareVersion":  // 251
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SupportedMetrics":  // 252
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "SupportedFirmwareUpdateConfiguration":  // 253
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "TapType":  // 254
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

            break;
         }
         case "Token":  // 255
         {
            c = readData( device, characteristic );

            writeData( device, characteristic, option );

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


