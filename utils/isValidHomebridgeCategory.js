'use strict';

// Description:
//    Determine if a given Category, expressed in string form is
// valid as per homebridge.
//
// @param homebridgeCategories - api.hap.Categories
// @param categoryString - The category in string form to check for existance
// @returns: boolean

var isValidHomebridgeCategory = function ( homebridgeCategories, categoryString )
{
   if ( homebridgeCategories[ categoryString ] )
      return true;

   return false;
}

module.exports = isValidHomebridgeCategory;
