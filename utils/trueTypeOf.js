'use strict';

const isNumeric = require( "../utils/isNumeric" );

// Description:
//    Determine the true type of an object, because typeOf is screwy
//    for null/undefined.
//
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
         // A String can still be a number
         if ( isNumeric ( m ) )
            return Number;
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
