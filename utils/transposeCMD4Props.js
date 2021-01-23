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
var transposeConstantToValidValue = function ( log, CMD4_ENUM_properties_obj, accTypeEnumIndex, constantString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0 )
   {
      //log.debug( "transposeConstantToValidValue: No constants to transpose for:%s", constantString );
      // Return the original as it should be used instead of nothing
      return constantString;
   }

   // In case constantString is not a string, ie false
   let lookupString = "" + constantString;
   let ucConstantString = lookupString.toUpperCase();

   if ( Object.prototype.hasOwnProperty.call( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, ucConstantString ) )
   {
      let value = CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues[ ucConstantString ];

      //log.debug( "transposeConstantToValidValue: Found value:%s for:%s", value, constantString );

      return value;
   }
   //log.debug( "transposeConstantToValidValue: No value found for constant:%s", constantString );
   return constantString;
}

// Used to convet ValidValues Value to its corresponding Constant.
var transposeValueToValidConstant = function ( log, CMD4_ENUM_properties_obj, accTypeEnumIndex, valueString )
{
   //log.debug( "transposeValueToValidConstant: check index:%s", accTypeEnumIndex );
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0)
   {
      //log.debug( "transposeValueToValidConstant: No constants to transpose for:%s", valueString );
      // Return the original as it should be used instead of nothing
      return valueString;
   }

   let constant = extractKeyValue( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, valueString );

   if ( constant == undefined )
   {
      //log.debug( "transposeValueToValidConstant: No constant found for value:%s", valueString );
      return valueString;
   }
   return constant;
}


module.exports = {
   transposeConstantToValidValue,
   transposeValueToValidConstant,
   extractKeyValue
};
