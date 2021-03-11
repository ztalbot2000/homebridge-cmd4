'use strict';

// Description:
//    Routines to convert Cmd4 values to constants and back.
//
// @param CMD4_ACC_TYPE_ENUM - Just that
// @param accTypeEnumIndex - The Accessory Type Enumerated index.
// @param constantString - The string to change into a HAP value.
// @param constantValue - The value to change into a HAP String.
//
// @returns Value of transposition or nothing.
//

var extractKeyValue = function( obj, value )
{
   for ( let key in obj )
   {
      // In case value given is a string, compare that as well.
      if ( obj[ key ] == value || obj[ key ] + "" == value )
         return key;
   }
   return undefined;
}

// Used to convet ValidValus from a Constant to their corresponding value.
var transposeConstantToValidValue = function ( CMD4_ENUM_properties_obj, accTypeEnumIndex, constantString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length <= 0 )
   {
      // Return the original as it should be used instead of nothing
      // This is not a failure
      return { "value": constantString, "rc": true, "msg": `Non Convertible characteristic ${ constantString } for ${ CMD4_ENUM_properties_obj[ accTypeEnumIndex ].type }` };
   }

   // In case constantString is not a string, ie false
   let lookupString = "" + constantString;
   let ucConstantString = lookupString.toUpperCase();

   if ( Object.prototype.hasOwnProperty.call( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, ucConstantString ) )
   {
      let value = CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues[ ucConstantString ];

      return { "value": value, "rc": true, "msg": "Transpose success" };
   }

   // What if it is already transposed correctly?
   let constant = extractKeyValue( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, constantString );
   if ( constant == undefined || constant == null )
       return { "value": constantString, "rc": false, "msg": `Cannot convert ${ constantString } to a value for ${ CMD4_ENUM_properties_obj[ accTypeEnumIndex ].type }` };
   else
      return { "value": constantString, "rc": true, "msg": "Already transposed" };
}

// Used to convet ValidValues Value to its corresponding Constant.
var transposeValueToValidConstant = function ( CMD4_ENUM_properties_obj, accTypeEnumIndex, valueString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length <= 0)
   {
      // Return the original as it should be used instead of nothing
      // This is not a failure
      return { "value": valueString, "rc": true, "msg": `Non Convertible characteristic ${ valueString } for ${ CMD4_ENUM_properties_obj[ accTypeEnumIndex ].type }` };
   }

   let constant = extractKeyValue( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, valueString );

   if ( constant == undefined || constant == null )
   {
      // What if it is already transposed correctly?
      let value = CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues[ valueString ];
      if ( value == undefined || value == null )
         return { "value": valueString, "rc": false, "msg": `Cannot convert ${ valueString } to a constant for ${ CMD4_ENUM_properties_obj[ accTypeEnumIndex ].type }` };
      else
         return { "value": valueString, "rc": true, "msg": "Already transposed" };
   }

   return { "value": constant, "rc": true, "msg": "Transpose success" };
}


module.exports = {
   transposeConstantToValidValue,
   transposeValueToValidConstant,
   extractKeyValue
};
