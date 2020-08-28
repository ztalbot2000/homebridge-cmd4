'use strict';

/**
 * @param string
 * @returns string with first character in upper case.
 */
var ucFirst = function( string )
{
   switch( typeof string )
   {
      case undefined:

         console.log( "Asked to upper case first character of NULL String" );
         return undefined;

      case 'boolean':
      case 'number':
         return string;
      case 'string':
         return string.charAt(0).toUpperCase() + string.slice( 1 );
      default:
         console.log( "Asked to upper case first character of non String(%s):%s", typeof string, string );
         return string;
   }
}

module.exports = ucFirst;
