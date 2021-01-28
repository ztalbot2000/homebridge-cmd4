#!/usr/local/bin/node
//  ExampleScript_template.js
//
// Description:
//   This script is a goood starting place for you to create Cmd4 Scripts
//   of your own
//
// Parameters are:
//    Get < any accessory name > < characteristic >
//    Set < any accessory name > < characteristic > < value >
//
// Note 1: These paramaters match the those of the Cmd4 plugin.
//         A full lost of supported devices and characteristics can be
//         found at:
//         https://ztalbot2000.github.io/homebridge-cmd4
//
// How it works:
//    The Cmd4 plugin will call this script to retrieve those states
//    you have defined as not Cached to Get/Set your devices characteristic
//    states.
//
//    For example:
//       node ExampleScript_template.js Set My_Door TargetDoorState 0
//     or
//       node ExampleScript.js Get My_Door CurrentDoorState
//
//

'use strict';

var length = process.argv.length;
var device = "My_Door";
var io = "";
var characteristic = "";
var option = "";

if ( length == 2 ) process.exit( 0 );

if ( length <= 2 ) {
    console.log( "Usage: " + process.argv[0] + " < Get > < AccessoryName > < Characteristic >" );
    console.log( "       " + process.argv[0] + " < Set > < AccessoryName > < Characteristic > < Value >" );
    process.exit( -1 );
}

if ( length >= 2 ) io = process.argv[2];
if ( length >= 3 ) device = process.argv[3];
if ( length >= 4 ) characteristic  = process.argv[4];
if ( length >= 5 ) option  = process.argv[5];

var c = "";

switch( io )
{
    case "Get":
    {
        switch( characteristic )
        {
            case "CurrentDoorState":
            {
               console.log( 0 );

               // See https://ztalbot2000.github.io/homebridge-cmd4
               // For the possible values and characteristics
               // available per device. It will show somethink like:
               // Valid Values:
               // 0 - "Open. The door is fully open."
               // 1 - "Closed. The door is fully closed."
               // 2 - "Opening. The door is actively opening."
               // 3 - "Closing. The door is actively closing."
               // 4 - "Stopped. The door is not moving, and it is not fully
               //      open nor fully closed."
               // 5-255 - "Reserved"

               break;
            }
            case "TargetDoorState":
            {
                console.log( 0 );
                break;
            }
            case "ObstructionDetected":
            {
                console.log ( 0 );
                break;
            }
            case "LockCurrentState":
            {
                console.log ( 0 );
                break;
            }
            default:
                console.error( "Unhandled characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic );
                process.exit( -1 );
        }

        break;

    } // End of Switch for "Get"
    case "Set":
    {
        switch( characteristic )
        {
            case "CurrentDoorState":
            {
               // Current Door State is not settable. The
               // call would be to TargetDoorState. This is here
               // for debugging only.

               break;
            }
            case "TargetDoorState":
            {
                // Do something of your own here.

                break;
            }
            case "ObstructionDetected":
            {
               // Obstruction Detected is not settable. It
               // call is a read-only characteristic. This is here
               // for debugging only.
               break;
            }
            case "LockCurrentState":
            {
                // Lock Current State is not settable. It
                // call is a read-only characteristic. This is here
                // for debugging only.
                break;
            }
            default:
                console.error( "UnHandled Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic );
                process.exit( -1 );
        }

        break;
    } // End of Switch Device for "Set"
    default:
        console.error( "Unknown IO" + io );
        process.exit( -1 );
}

//console.log( "Say What Device:" + device + " Characteristic:" + characteristic + " Option:" + option );

// You must exit with a zero status, confirming the script rannsuccessfully.
process.exit( 0 );


