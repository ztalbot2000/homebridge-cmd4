'use strict';

// Description:
//    Convert the first character of a string to upper case.
//
// @param string - The string to convert.
//
// @returns: The string with the first letter upper cased.
//
//
var ucFirst = function( string )
{
   switch( typeof string )
   {
      case undefined:

         console.log( "Asked to upper case first character of NULL String" );
         return undefined;

      case "boolean":
      case "number":
         return string;
      case "string":
         return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
      default:
         console.log( "Asked to upper case first character of non String(%s):%s", typeof string, string );
         return string;
   }
}

module.exports = ucFirst;
