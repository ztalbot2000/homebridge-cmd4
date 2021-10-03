'use strict';

let ucFirst = require( "../utils/ucFirst" );


let CMD4_DEVICE_TYPE_ENUM = require( "../lib/CMD4_DEVICE_TYPE_ENUM" );


// Description:
//    Determine if type is a Cmd4 device based CMD4_DEVICE_TYPE_ENUM.deviceName
//
// @param deviceName - The device name to check. i.e. "Switch"
// @param allowUpper - if upper case allowed to be checked.
// @returns: { deviceName: The CORRECT device name
//             devEnumIndex: The index of the characteristic
//           } or null


function isDevDirective( deviceName, allowUpper = false )
{
   // We return similiar to isAccDirective
   // We must return a null devTypeIndex, which should be checked instead
   // of just rc, like isAccDirective
   let defaultRc = { "deviceName": deviceName,
                     "devEnumIndex": null
                   };

   if ( ! deviceName )
   {
      console.warn( "No parameter passed to isDevDirective" );
      return defaultRc;
   }

   let devEnumIndex;

   // We want lower case to be correct
   devEnumIndex = CMD4_DEVICE_TYPE_ENUM.indexOfEnum( deviceName );
   if ( devEnumIndex >= 0 )
      return { "deviceName": deviceName,
               "devEnumIndex": devEnumIndex };

   // Note: There are othes like WiFi ... but nobody uses them thankfully !
   if ( allowUpper == true )
   {
      let ucDeviceName = ucFirst( deviceName );
      devEnumIndex = CMD4_DEVICE_TYPE_ENUM.indexOfEnum( ucDeviceName );

      // We return the correct upper case
      if ( devEnumIndex >= 0 )
         return { "deviceName": CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( devEnumIndex ),
                  "devEnumIndex": devEnumIndex };
   }

   return defaultRc;
}


module.exports = isDevDirective;
