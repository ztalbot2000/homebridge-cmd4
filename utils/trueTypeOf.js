'use strict';

// Description:
//    Determine the true type of an object, because typeOf is screwy
//    for null/undefined.
//
//
// NOTE: "0" or any qoted number is still a string.
//       This function just fixes null/undefined.
//       Use isNumeric if needed.
//
// @param m - type to check
// @returns: Array, Boolean, Number, String, Object, null, undefined

function trueTypeOf( m )
{
   switch( typeof m )
   {
      case "boolean":
         return Boolean;
      case "number":
         return Number;
      case "string":
         // If the string is actually a number, let the caller
         // deal with it as our intent is just to fix undefined
         // and null issues.
         return String;
      case "object":
         // null can be an object
         if ( m == null )
            return null;
         if ( Array.isArray( m ) )
            return Array;

         return Object;
      case "undefined":
         return undefined;
      default:
         throw new Error("OOPS");
   }

}

module.exports = trueTypeOf;
