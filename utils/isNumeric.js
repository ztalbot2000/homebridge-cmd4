'use strict';

/**
 * @param variable
 * @returns boolean
 */
var  isNumeric = function( num )
{
   num = "" + num; // coerce num to be a string
   return !isNaN(num) && !isNaN(parseFloat(num));
}

module.exports = isNumeric;
