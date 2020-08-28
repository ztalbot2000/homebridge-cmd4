'use strict';


var extractKeyValue = function ( obj, value )
{
   return Object.keys( obj )[ Object.values( obj ).indexOf( value ) ];
}

// Used to convet ValidValus from a Constant to their corresponding value.
var transposeConstantToValidValue = function ( CMD4_ENUM_properties_obj, accTypeEnumIndex, constantString )
{
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0 )
   {
      //console.log.debug( "No constants to transpose for:%s", constantString );
      return;
   }

   if ( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues.hasOwnProperty( constantString ) )
   {
      let value = CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues[ constantString ];

      // When we translate constants to Characteristic.<type>.values and value is a true/false
      // result, than parsing words[ 0 ].lowercase fails.
      // - I fixed that instead ...
      //value = String( value );

      // console.log.debug( "Found value:%s for:%s", value, constantString );

      return value;
   }
   //console.log.debug( "No value found for constant:%s", constantString );
   return constantString;
}

// Used to convet ValidValues Value to its corresponding Constant.
var transposeValueToValidConstant = function (  CMD4_ENUM_properties_obj, accTypeEnumIndex, valueString )
{
   //console.log( "check index:%s", accTypeEnumIndex );
   if ( Object.keys( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues ).length < 0)
   {
      //console.log( "No constants to transpose for:%s", valueString );
      return;
   }

   let constant = extractKeyValue( CMD4_ENUM_properties_obj[ accTypeEnumIndex ].validValues, valueString );

   if ( constant == undefined )
   {
      //console.log.debug( "No constant found for value:%s", valueString );
      return valueString;
   }
   return constant;
}


module.exports = {
   transposeConstantToValidValue,
   transposeValueToValidConstant,
   extractKeyValue
};
