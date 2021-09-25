'use strict';

// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "../lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;

class Cmd4Storage
{
   constructor( log, cmd4Storage )
   {
      this.CLASS_VERSION = 1;
      this.DATA = [ ];

      if ( cmd4Storage == undefined )
      {
         log.debug("Init new cmd4Storage" );

         // init new
         this.DATA = new Array( CMD4_ACC_TYPE_ENUM.EOL ).fill( null );

      } else if ( cmd4Storage instanceof Cmd4Storage )
      {
         log.debug("Class is Cmd4Storage version: %s", cmd4Storage.version );
         if ( cmd4Storage.CLASS_VERSION == this.CLASS_VERSION )
         {
            // The same. I can just load its data
            this.loadLatestData( cmd4Storage.DATA );
         } else {
            throw new Error( `Do not know how to handle Cmd4_Storage Class version: ${ cmd4Storage.CLASS_VERSION }` );
         }
      } else if ( Array.isArray( cmd4Storage ) )
      {
         log.debug("Cmd4Storage is Array" );
         // Init original unversioned
         let data = this.upgradeDataArray( 0, cmd4Storage );
         this.loadLatestData( data );

      } else if ( cmd4Storage.constructor === Object )
      {
         log.debug("Cmd4Storage is Object version %s", cmd4Storage.CLASS_VERSION );
         if ( cmd4Storage.CLASS_VERSION == this.CLASS_VERSION )
         {
            // The same. I can just load its data
            this.loadLatestData( cmd4Storage.DATA );
         } else {
            throw new Error( `Do not know how to handle Cmd4_Storage Class version: ${ cmd4Storage.CLASS_VERSION }` );
         }
      } else
      {
         // Woops init new
         log.error( "cmd4Storage is %s", cmd4Storage );
         console.error( "cmd4Storage.constructor.name is %s", cmd4Storage.constructor.name );
         throw new Error( `Do not know how to handle typeof: ${ typeof cmd4Storage } Cmd4_Storage parm: ${ cmd4Storage }` );
      }
   }

   upgradeDataArray( fromVersion, fromData)
   {
      let data = [ ];

      if ( fromVersion != 0 )
         throw new Error( `Do not know how to handle Cmd4_Storage version: ${ fromVersion }` );

      // Version 0 ACC_DATA went from 0-122
      // This version goes from 1-123 and changes to
      // Assoc array so that index changes like this will no longer
      // impact the storage schema as much
      let i=0;
      for ( i=0; i < CMD4_ACC_TYPE_ENUM.ListPairings; i++ )
      {
         data[ i ] = fromData[ i ];
      }
      data[ CMD4_ACC_TYPE_ENUM.ListPairing ] = null;
      for ( i = CMD4_ACC_TYPE_ENUM.ListPairings +1; i < CMD4_ACC_TYPE_ENUM.EOL; i++ )
      {
         data[ i ] = fromData[ i - 1 ];
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


      return this.DATA[ accTypeEnumIndex ];
   }

   getStoredValueForCharacteristic( characteristicString )
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.indexOfEnum( characteristicString );

      return this.getStoredValueForIndex( accTypeEnumIndex );
   }
   setStoredValueForIndex( accTypeEnumIndex, value )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex >= CMD4_ACC_TYPE_ENUM.EOL )
         throw new Error( `setStoredValue - Characteristic index: ${ accTypeEnumIndex } not between 0 and ${ CMD4_ACC_TYPE_ENUM.EOL }\nCheck your config.json file for unknown characteristic.` );

      this.DATA[ accTypeEnumIndex  ] = value;
   }
   setStoredValueForCharacteristic( characteristicString, value )
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.indexOfEnum( characteristicString );

      this.setStoredValueForIndex( accTypeEnumIndex, value );
   }

   // Unlike get/set, testStoredValueForIndex does not call process.exit,
   // but undefined for an illegal range, in the case that rogue runtime data
   // dies not take down CMD4.
   testStoredValueForIndex( accTypeEnumIndex )
   {
      if ( accTypeEnumIndex < 0 || accTypeEnumIndex > CMD4_ACC_TYPE_ENUM.EOL )
         return undefined;

      return this.DATA[ accTypeEnumIndex ];
   }
   testStoredValueForCharacteristic( characteristicString )
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.indexOfEnum( characteristicString );

      return this.testStoredValueForIndex( accTypeEnumIndex );
   }
}

module.exports = Cmd4Storage;
