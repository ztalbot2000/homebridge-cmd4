
'use strict';

const trueTypeOf = require( "../utils/trueTypeOf" );
const isNumeric = require( "../utils/isNumeric" );

// Description:
//    Check if props for accTypeEnumIndex is defined in CMD4_ACC_TYPE_ENUM
//
// @param props - CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props;
// @param Characteristic - api.hap.Characteristic
// @param value
//
// @returns props or undefined
//
function characteristicValueToItsProperType( props, Characteristic, value )
{
    let format = props.format;

//  Formats["BOOL"] = "bool";
//  Formats["INT"] = "int";
//  Formats["FLOAT"] = "float";
//  Formats["STRING"] = "string";
//  Formats["UINT8"] = "uint8";
//  Formats["UINT16"] = "uint16";
//  Formats["UINT32"] = "uint32";
//  Formats["UINT64"] = "uint64";
//  Formats["DATA"] = "data";
//  Formats["TLV8"] = "tlv8";
//  Formats["ARRAY"] = "array";
//  Formats["DICTIONARY"] = "dict";

    let type = trueTypeOf( value );

    switch( format ) {
       case Characteristic.Formats.FLOAT:
          if ( isNumeric( value ) )
          {
              // Fix support for decimal temperatures
              // parseFloat will change "15" "15.0" to "15"
              // but keeps numbers like "15.5"
              // So whatever is sent from the device
              // is used.
              // HomeKit and HomeBridge seems okay with this.
              // Eve sees the decimal numbers.
              return parseFloat( value, 10 );
          }
          // If the value is not convertable, just return it.
          console.log( `Cannot convert value: ${ value } to Float` );

          return value;
          break;
       case Characteristic.Formats.INT:
       case Characteristic.Formats.UINT8:
       case Characteristic.Formats.UINT16:
       case Characteristic.Formats.UINT32:
       case Characteristic.Formats.UINT64:
          // Convert it to a Number, no matter what
          let result = Number( value );

          // If it cannot be converted, well it cant.
          if ( trueTypeOf( result ) != Number )
          {
             console.log( `Cannot convert value: ${ value } to Number` );

             return value;
          }
          return result;
          break;
       case Characteristic.Formats.STRING:
          if ( type == Number )
          {
             // If the value is a Number, return the conversion
             return "" + value;

          } else if ( type == String )
          {
             // If the value is a String, just return it.
             return value;
          }

          // If the value is not convertable, just return it.
          console.log( `Cannot convert value: ${ value } to String` );

          return value;
          break;
       case Characteristic.Formats.BOOL:

          // If the value is a Number, return the conversion
          if ( type == Number )
          {
             if ( value == 0 ) return true;
             if ( value == 1 ) return false;

          } else if ( type == String )
          {
             let ucString = value.toUpperCase();

             if ( ucString == "TRUE" ) return true;
             if ( ucString == "FALSE" ) return false;

          } else if ( type == Boolean )
          {
             // If the value is a Boolean, just return it.
             return value;
          }

          // If the value is not convertable, just return it.
          console.log( `Cannot convert value: ${ value } to String` );

          return value;
       break;
       case Characteristic.Formats.ARRAY:
          // If the value is a Number, return the conversion
          if ( type == Number ||
               type == String ||
               type == Boolean )
          {
             return [ value ];
          } else if ( type == Array )
          {
             // If the value is a Array, just return it.
             return value;
          }

          // If the value is not convertable, just return it.
          console.log( `Cannot convert value: ${ value } to Array` );

          return value;
          break;
       case Characteristic.Formats.DATA:
       case Characteristic.Formats.TLV8:
       case Characteristic.Formats.DICTIONARY:
          console.log( `Do not know how to convert value: ${ value }` );
          return value;
          break;
    }
}


module.exports = characteristicValueToItsProperType
