
'use strict';

const trueTypeOf = require( "../utils/trueTypeOf" );
const isNumeric = require( "../utils/isNumeric" );
const chalk = require( "chalk" );

// Description:
//    Check if props for accTypeEnumIndex is defined in CMD4_ACC_TYPE_ENUM
//
// @param log - Logging mechanism.
// @param format - CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
// @param displayName - config.displayName
// @param hapFormats - api.hap.Characteristic.Formats
// @param characteristicString - CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
// @param value
// @param allowTLV8 - true/false to omit message.
//
// @returns props or undefined
//
function characteristicValueToItsProperType( log, requiredFormat, displayName, hapFormats, characteristicString, value, allowTLV8 )
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

    switch( requiredFormat ) {
       case hapFormats.FLOAT:
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
          log( `${ displayName} ` + chalk.red( `Cannot convert value: ${ value } to Float for ${ characteristicString }`  ) );

          return value;
       case hapFormats.INT:
       case hapFormats.UINT8:
       case hapFormats.UINT16:
       case hapFormats.UINT32:
       case hapFormats.UINT64:
       {
          // Convert it to a Number, no matter what
          let result = Number( value );

          // If it cannot be converted, well it cant.
          if ( trueTypeOf( result ) != Number )
          {
             log( `${ displayName} ` + chalk.red( `Cannot convert value: ${ value } to INT for ${ characteristicString }` ) );

             return value;
          }
          return result;
       }
       case hapFormats.STRING:
       {
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
          log( `${ displayName} ` + chalk.red ( `Cannot convert value: ${ value } to String for ${ characteristicString }` ) );

          return value;
       }
       case hapFormats.BOOL:
       {

          // If the value is a Number, return the conversion
          if ( type == Number )
          {
             if ( value == 0 ) return false;
             if ( value == 1 ) return true;

             // Handle string numbers being a BOOL
             // Identified correctly or not
             // 0 is off/false
             // 1 is on/true
             if ( value == "0" ) return false;
             if ( value == "1" ) return true;

          } else if ( type == String )
          {
             let ucString = value.toUpperCase();

             if ( ucString == "TRUE" ) return true;
             if ( ucString == "FALSE" ) return false;

             // Handle string numbers being a BOOL
             // Identified correctly or not
             // 0 is off/false
             // 1 is on/true
             if ( value == "0" ) return false;
             if ( value == "1" ) return true;

          } else if ( type == Boolean )
          {
             // If the value is a Boolean, just return it.
             return value;
          }

          // If the value is not convertable, just return it.
          log( `${ displayName} ` + chalk.red( `Cannot convert value: ${ value } to Bool for ${ characteristicString }` ) );

          return value;
       }
       case hapFormats.ARRAY:
       {
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
          log( `${ displayName} ` + chalk.yellow( `Cannot convert value: ${ value } to Array`  ) );

          return value;
       }
       case hapFormats.DATA:
       {
          // DATA types cannot be converted, so if in debug mode, note it.
          if ( log.debug )
             log.debug( `${ displayName} ` + chalk.yellow( `Do not know how to convert value: ${ value } for ${ characteristicString } to DATA` ) );
          return value;
       }
       case hapFormats.TLV8:
       {
          // TLV8 types cannot be converted, so if in debug mode, note it.
          if ( allowTLV8Here && log.debug )
             log.debug( `${ displayName} ` + chalk.yellow( `Do not know how to convert value: ${ value } for ${ characteristicString } to TLV8` ) );
          return value;
       }
       case hapFormats.DICTIONARY:
       {
          // DICTIONARY types cannot be converted, so if in debug mode, note it.
          if ( log.debug )
             log.debug( `${ displayName} ` + chalk.yellow( `Do not know how to convert value: ${ value } for ${ characteristicString } to DICTIONARY` ) );
          return value;
       }
       default:
          log( `${ displayName} ` + chalk.red( `Unknown requiredFormat: ${ requiredFormat } to convert value: ${ value } for ${ characteristicString }` ) );
    }
}


module.exports = characteristicValueToItsProperType
