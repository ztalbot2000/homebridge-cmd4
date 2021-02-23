'use strict';

// Description:
//    Convert the first character of a string to lower case.
//
// @param string - The string to convert.
//
// @returns: The string with the first letter lower cased.
//
//
var lcFirst = function( string )
{
   switch( typeof string )
   {
      case undefined:

         console.log( "Asked to lower case first character of NULL String" );
         return undefined;

      case "boolean":
      case "number":
         return string;
      case "string":
         return string.charAt( 0 ).toLowerCase() + string.slice( 1 );
      default:
         console.log( "Asked to lower case first character of non String(%s):%s", typeof string, string );
         return string;
   }
}

module.exports = lcFirst;
