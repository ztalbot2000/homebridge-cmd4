'use strict';

let CMD4_ACC_TYPE_ENUM = require( "../lib/CMD4_ACC_TYPE_ENUM" );


// Description:
//    Determine if parameter is a Cmd4 accessory characteristic
//
// @param type - The characteristic type to check. i.e. "On"
// @param allowUpper - if upper case allowed to be checked.
// @returns: { type: The CORRECT characteristic type
//             accTypeEnumIndex: The index of the characteristic
//           } or null
//

function isAccDirective( type, allowUpper = false )
{
   // For backward compatability of testStoredValueForIndex of FakeGato
   // we must return a null accTypeIndex, which should be checked instead
   // of just rc.
   let defaultRc = { "type": type,
                     "accTypeEnumIndex": null
                   };

   if ( ! type )
   {
      console.warn( "No parameter passed to isCmd4Directive" );
      return defaultRc;
   }

   let accTypeEnumIndex;

   // We want lower case to be correct
   accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.sche === type )
   if ( accTypeEnumIndex >= 0 )
      return { "type": type,
               "accTypeEnumIndex": accTypeEnumIndex };

   // Note: There are othes like WiFi ... but nobody uses them thankfully !
   if ( allowUpper == true )
   {
       accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === type );

      // We return the correct lower case
      if ( accTypeEnumIndex >= 0 )
         return { "type": CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].sche,
                  "accTypeEnumIndex": accTypeEnumIndex };
   }

   return defaultRc;
}


module.exports = isAccDirective;
