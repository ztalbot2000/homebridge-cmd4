'use strict';

// Description:
//    Determine if a given parameter is numeric.
//
// @param num - The number to determine if it is actually numeric.
// @returns: boolean
//

var isNumeric = function( num )
{
   num = "" + num; // coerce num to be a string
   return !isNaN( num ) && !isNaN( parseFloat( num ) );
}

module.exports = isNumeric;
