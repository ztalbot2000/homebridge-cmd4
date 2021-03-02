'use strict';

// Description:
//    Routines to convert Cmd4 values to constants and back.
//
// @param CMD4_ENUM_properties_obj - Just that
// @param accTypeEnumIndex - The Accessory Type Enumerated index.
// @param constantString - The string to change into a HAP value.
// @param constantValue - The value to change into a HAP String.
//
// @returns Value of transposition or nothing.
//


var extractKeyValue = function ( obj, value )
{
   return Object.keys( obj )[ Object.values( obj ).indexOf( value ) ];
}

// Used to convet ValidValus from a Constant to their corresponding value.
var transposeConstantToValidValue = function ( CMD4_ENUM_properties_obj, accTypeEnumIndex, constantString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0 )
   {
      // Return the original as it should be used instead of nothing
      return constantString;
   }

   // In case constantString is not a string, ie false
   let lookupString = "" + constantString;
   let ucConstantString = lookupString.toUpperCase();

   if ( Object.prototype.hasOwnProperty.call( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, ucConstantString ) )
   {
      let value = CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues[ ucConstantString ];

      return value;
   }
   return constantString;
}

// Used to convet ValidValues Value to its corresponding Constant.
var transposeValueToValidConstant = function ( CMD4_ENUM_properties_obj, accTypeEnumIndex, valueString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0)
   {
      // Return the original as it should be used instead of nothing
      return valueString;
   }

   let constant = extractKeyValue( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, valueString );

   if ( constant == undefined )
   {
      return valueString;
   }
   return constant;
}


module.exports = {
   transposeConstantToValidValue,
   transposeValueToValidConstant,
   extractKeyValue
};
