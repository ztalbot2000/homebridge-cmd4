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
      case Array:
         return Array;
         break;
      case "boolean":
         return Boolean;
         break;
      case "number":
         return Number;
         break;
     case "string":
         // If the string is actually a number, let the caller
         // deal with it as our intent is just to fix undefined
         // and null issues.
         return String;
         break;
     case "object":
         // null can be an object
         if ( m == null )
            return null;
         if ( Array.isArray( m ) )
            return Array;

         return Object;
         break;
     case "undefined":
         return undefined;
         break;
      default:
         console.log("OOPS");
         process.exit( 666);
   };

   if ( m == undefined )
   {
      return undefine;
   }

   console.log("OOPS Again");
   process.exit( 666);
}

module.exports = trueTypeOf;
