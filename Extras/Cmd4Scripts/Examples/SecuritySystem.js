#!/usr/bin/env node
//  SecuritySystem.js
//
// Description:
//   This script *CAN* be called by the HomeBridge plugin Cmd4 as defined in your config.json
//   file.  The purpose is to fake the existance of an Security System as best it can.
//
// Note: Security Systems are tricky to fake since the securitySysytemCurrentState
//       Does not align with the SecuritySystemTargetState. The only way to trigger
//       the alarm would be:
//    node ./SecuritySystem.js Set My_System SecuritySystemCurrentState 4
//
//   Likewise to disarm
//    node ./SecuritySystem.js Set My_System SecuritySystemCurrentState 3
//
// Note 1: The Hap spec is quoted throughout, but this is not the spec so
//         this is not gauranteed to be correct.
//
// How it works:
//    A characteristic value is stored in the $HOME/.homebridge/Cmd4Scripts/Cmd4States in
//    the file named "Status + <Accessory Name> _ <Characteristic>" and is returned or
//    written to based on the <Get|Set> option.
//
//    For example:   node SecuritySystem.js Set My_System SecuritySystemCurrentState 0
//       will create the file:
//          .homebridge/Cmd4Scripts/Cmd4States/Status_My_System_SecuritySystemCurrentState
//       with the contents of "0"
//
// Environmental Variables Used:
//    $HOME - to create path to .homebridge
//
// The following is an example config.json entry for this script.
/*
{
   "platform": "Cmd4",
   "name": "Cmd4",
   "debug": false,
   "statusMsg": true,
   "accessories": [
   {
      "type": "SecuritySystem",
      "displayName": "My_SecuritySystem",
      "securitySystemCurrentState": "AWAY_ARM",
      "securitySystemTargetState": "AWAY_ARM",
      "interval": 30,
      "timeout": 4900,
      "polling": [
          { "characteristic": "securitySystemCurrentState" },
          { "characteristic": "securitySystemTargetState" }
      ],
      "stateChangeResponseTime": 1,
      "state_cmd": "node ./homebridge/Cmd4Scripts/SecuritySystem.js"
   }
}
*/

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
         case "Name":   // 97  Optional Characteristic
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
         case "SecuritySystemCurrentState":   // 143
         {
            c = readData( device, characteristic );

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

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

            if ( c == "" ) process.stdout.write( "1" ); else process.stdout.write( `"${ c }"` );

            // UUID: 00000067-0000-1000-8000-0026BB765291
            // Type: public.hap.characteristic.security-system-state.target
            // Permissions: Paired Read, Paired Write, Notify

            // Format: uint8

            // Minimum Value: 0
            // Maximum Value: 3
            // Step Value: 1

            // Valid Values:
            // 0 - "STAY_ARM"  - The home is occupied and the residents
            //      are active. e.g. morning or evenings
            // 1 - "AWAY_ARM"  - The home is unoccupied
            // 2 - "NIGHT_ARM" - The home is occupied and the residents are sleeping
            //
            // 3 - 255 - Reserved

            break;
         }
         case "SecuritySystemAlarmType":   // 142  Optional Characteristic
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

         case "StatusFault":   // 163  Optional Characteristic
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
         case "StatusTampered":   // 166  Optional Characteristic
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
         case "Name":   // 97  Optional Characteristic
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
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
         case "StatusFault":   // 163  Optional Characteristic
         {
            writeData( device, characteristic, option );

            // Not settable in Hap Spec, here for debugging.
            break;
         }
         case "StatusTampered":   // 166  Optional Characteristic
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


