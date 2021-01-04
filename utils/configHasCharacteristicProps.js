
'use strict';

const isJSON = require( "../utils/isJSON" );
const ucFirst = require( "../utils/ucFirst" );

// Description:
//    Check if props for accTypeEnumIndex is defined in CMD4_ACC_TYPE_ENUM
//
// @param accTypeEnumIndex
// @param props
// @param CMD4_ACC_TYPE_ENUM
//
// @returns props or undefined
//
function configHasCharacteristicProps( accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM )
{
    if ( props == undefined )
       return undefined;

    if ( ! isJSON( props ) )
       return undefined;

    let characteristicProps = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props;
    let type = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
    let ucType = ucFirst( type );

    let definitions;

    if ( props[ type ] )
       definitions = props[ type ];

    if ( props[ ucType ] )
       definitions = props[ ucType ];

    if ( ! definitions )
    {
       //console.log( "No definitions for %s", type );
       return undefined;
    }

    let rc = definitions;
    for ( let key in definitions )
    {
       //console.log( "Checking key: for characteristic: %s", key );
       if ( characteristicProps[ key ] == undefined )
       {
          //console.log( "Error: props for key: %s not in definition of %s", key, type );
          //process.exit( -1 );
          return undefined;

       }
       //console.log("Checking typeof:" + characteristicProps[ key ] );
       if ( typeof characteristicProps[ key ] !=  typeof definitions[ key ] )
       {
          //console.log( "Error: props for key: %s type %s not equal to definition of %s", key, typeof definitions[ key ], typeof characteristicProps[ key ] );
          //process.exit( -1 );
          return undefined;
       }
    }
    return rc;
}


module.exports = configHasCharacteristicProps;
