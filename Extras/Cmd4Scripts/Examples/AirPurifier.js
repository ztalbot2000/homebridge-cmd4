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
         case "Active":   // 3
         {
            writeData( device, characteristic, option );

            // Off
            if ( option == 0 )
            {
               // InActive - 0
               writeData( device, "CurrentAirPurifierState", 0 );
               // Auto Mode - 1
               writeData( device, "TargetAirPurifierState", 1 );
            } else // On
            {
               // Purifying Air - 2
               writeData( device, "CurrentAirPurifierState", 2 );
               // Auto Mode - 1
               writeData( device, "TargetAirPurifierState", 1 );
            }

            break;
         }
         case "CurrentAirPurifierState":   // 34
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "LockPhysicalControls":   // 86
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
         case "RotationSpeed":   // 139
         {
            writeData( device, characteristic, option );

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


