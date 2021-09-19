'use strict';

// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "../lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;

class Cmd4Storage
{
   constructor( storedValuesPerCharacteristic )
   {
      this.CLASS_VERSION = 1;
      this.DATA = { };

      if ( storedValuesPerCharacteristic == undefined )
      {
         // init new
         for ( let i = 0; i < CMD4_ACC_TYPE_ENUM.EOL; i++ )
         {
            let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ i ].type;
            this.DATA[ `${ characteristicString }` ] = null;
      }
      } else if ( storedValuesPerCharacteristic instanceof Cmd4Storage )
      {
         if ( storedValuesPerCharacteristic.CLASS_VERSION == this.CLASS_VERSION )
         {
            // The same. I can just load its data
            this.loadLatestData( storedValuesPerCharacteristic.DATA );
         } else {
            throw new Error( `Do not know how to handle Cmd4_Storage Class version: ${ storedValuesPerCharacteristic.CLASS_VERSION }` );
         }
      } else if ( Array.isArray( storedValuesPerCharacteristic ) )
      {
         // Init original unversioned
         let data = this.upgradeData( 0, storedValuesPerCharacteristic );
         this.loadLatestData( data );
      } else
      {
         // Woops init new
         throw new Error( `Do not know how to handle Cmd4_Storage parm: ${ storedValuesPerCharacteristic }` );
      }
   }

   upgradeData( fromVersion, fromData)
   {
      let data = {};

      if ( fromVersion != 0 )
         throw new Error( `Do not know how to handle Cmd4_Storage version: ${ fromVersion }` );

      // Version 0 ACC_DATA went from 0-122
      // This version goes from 1-123 and changes to
      // Assoc array so that index changes like this will no longer
      // impact the storage schema as much
      let i=0;
      for ( i=0; i < CMD4_ACC_TYPE_ENUM.ListPairings; i++ )
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ i ].type;
         data[ `${ characteristicString }` ] = fromData[ i ];
      }
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.ListPairings ].type;
      data[ `${ characteristicString }` ] = null;
      for ( i = CMD4_ACC_TYPE_ENUM.ListPairings +1; i < CMD4_ACC_TYPE_ENUM.EOL; i++ )
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ i ].type;
         data[ `${ characteristicString }` ] = fromData[ i - 1 ];
      }
      return data;
   }

   loadLatestData( data )
   {
      this.DATA = data;
   }

   getStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex >= CMD4_ACC_TYPE_ENUM.EOL )
         throw new Error( `getStoredValue - Characteristic index: ${ accTypeEnumIndex } not between 0 and ${ CMD4_ACC_TYPE_ENUM.EOL }\nCheck your config.json file for unknown characteristic.` );

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      // Because indexes may change, relative to assoc string keys
      //console.log( "Warning. getStoredValueForIndex is dangerous" );
      return this.getStoredValueForCharacteristic( characteristicString );
   }

   getStoredValueForCharacteristic( characteristicString )
   {
      return this.DATA[ `${ characteristicString }` ];
   }
   setStoredValueForIndex( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex >= CMD4_ACC_TYPE_ENUM.EOL )
         throw new Error( `setStoredValue - Characteristic index: ${ accTypeEnumIndex } not between 0 and ${ CMD4_ACC_TYPE_ENUM.EOL }\nCheck your config.json file for unknown characteristic.` );

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      // Because indexes may change, relative to assoc string keys
      //console.log( "Warning. setStoredValueForIndex is dangerous" );
      this.setStoredValueForCharacteristic( characteristicString, value );
   }
   setStoredValueForCharacteristic( characteristicString, value )
   {
      this.DATA[ `${ characteristicString }` ] = value;

   }

   // Unlike get/set, testStoredValueForIndex does not call process.exit,
   // but undefined for an illegal range, in the case that rogue runtime data
   // dies not take down CMD4.
   testStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
         return undefined;

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;

      // Because indexes may change, relative to assoc string keys
      //console.log( "Warning. testStoredValueForIndex is dangerous" );
      return this.testStoredValueForCharacteristic( characteristicString );
   }
   testStoredValueForCharacteristic( characteristicString )
   {
      return this.DATA[ `${ characteristicString }` ];
   }
}

module.exports = Cmd4Storage;
