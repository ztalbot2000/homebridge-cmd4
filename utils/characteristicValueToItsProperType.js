
'use strict';

const trueTypeOf = require( "../utils/trueTypeOf" );
const isNumeric = require( "../utils/isNumeric" );
const Fg = require( "../utils/colors" );

// Description:
//    Check if props for accTypeEnumIndex is defined in CMD4_ACC_TYPE_ENUM
//
// @param log - Logging mechanism.
// @param format - CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
// @param displayName - config.displayName
// @param Characteristic - api.hap.Characteristic
// @param characteristicString - CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
// @param value
// @param allowTLV8 - true/false to omit message.
//
// @returns props or undefined
//
function characteristicValueToItsProperType( log, format, displayName, Characteristic, characteristicString, value, allowTLV8 )
{
    // if allowTLV8 is defined, use its value otherwise use false.
    let allowTLV8Here = allowTLV8 === false;

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
          log( `${ displayName} ` + Fg.Red + `Cannot convert value: ${ value } to Float for ${ characteristicString }` + Fg.Rm );

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
             log( `${ displayName} ` + Fg.Red + `Cannot convert value: ${ value } to INT for ${ characteristicString }` + Fg.Rm );

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
          log( `${ displayName} ` + Fg.Red + `Cannot convert value: ${ value } to String for ${ characteristicString }` + Fg.Rm );

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
          log( `${ displayName} ` + Fg.Red + `Cannot convert value: ${ value } to Bool for ${ characteristicString }` + Fg.Rm );

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
          log( `${ displayName} ` + Fg.Yel + `Cannot convert value: ${ value } to Array` + Fg.Rm );

          return value;
          break;
       case Characteristic.Formats.DATA:
          // DATA types cannot be converted, so if in debug mode, note it.
          if ( log.debug )
             log.debug( `${ displayName} ` + Fg.Yel + `Do not know how to convert value: ${ value } for ${ characteristicString } to DATA` + Fg.Rm );
          return value;
          break;
       case Characteristic.Formats.TLV8:
          // TLV8 types cannot be converted, so if in debug mode, note it.
          if ( allowTLV8Here && log.debug )
             log.debug( `${ displayName} ` + Fg.Yel + `Do not know how to convert value: ${ value } for ${ characteristicString } to TLV8` + Fg.Rm );
          return value;
          break;
       case Characteristic.Formats.DICTIONARY:
          // DICTIONARY types cannot be converted, so if in debug mode, note it.
          if ( log.debug )
             log.debug( `${ displayName} ` + Fg.Yel + `Do not know how to convert value: ${ value } for ${ characteristicString } to DICTIONARY` + Fg.Rm );
          return value;
          break;
       default:
          log( `${ displayName} ` + Fg.Red + `Unknown format: ${ format } to convert value: ${ value } for ${ characteristicString }` + Fg.Rm );
    }
}


module.exports = characteristicValueToItsProperType
