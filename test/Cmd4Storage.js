"use strict";


let Cmd4Storage = require( "../utils/Cmd4Storage" );

var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );


describe(`Basic Cmd4Storage Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage`, ( done ) =>
   {
      const cmd4Storage = new Cmd4Storage( );

      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      assert.isFunction( cmd4Storage.getStoredValueForIndex, ".getStoredValueForIndex is not a function" );
      assert.isFunction( cmd4Storage.getStoredValueForCharacteristic, ".getStoredValueForCharacteristic is not a function" );
      assert.isFunction( cmd4Storage.setStoredValueForIndex, ".setStoredValueForIndex is not a function" );
      assert.isFunction( cmd4Storage.setStoredValueForCharacteristic, ".setStoredValueForCharacteristic is not a function" );
      assert.isFunction( cmd4Storage.testStoredValueForIndex, ".testStoredValueForIndex is not a function" );
      assert.isFunction( cmd4Storage.testStoredValueForCharacteristic, ".testStoredValueForCharacteristic is not a function" );

      assert.isFunction( cmd4Storage.loadLatestData, ".loadLatestData is not a function" );

      done( );

   });

   it( `Cmd4Storage can init itself properly`, ( done ) =>
   {
      let cmd4Storage = new Cmd4Storage( );

      for ( let i = 0; i < CMD4_ACC_TYPE_ENUM.EOL; i++ )
      {
        let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ i ].type;

        assert.equal( cmd4Storage.DATA[ `${ characteristicString}` ], null, `cmd4Storage[ ${characteristicString} ] is not null` );
      }

      done( );
   });

   it( `Cmd4Storage can set data properly`, ( done ) =>
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;

      let cmd4Storage = new Cmd4Storage( );

      cmd4Storage.setStoredValueForCharacteristic( characteristicString, 1 );
      assert.equal( cmd4Storage.DATA[ `${ characteristicString}` ], 1, `cmd4Storage[ ${characteristicString} ] is not 1` );

      done( );
   });

   it( `Cmd4Storage can get data properly`, ( done ) =>
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;

      let cmd4Storage = new Cmd4Storage( );

      cmd4Storage.setStoredValueForCharacteristic( characteristicString, 1 );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );

      done( );
   });

   it( `Cmd4Storage can test data properly`, ( done ) =>
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;

      let cmd4Storage = new Cmd4Storage( );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, undefined, `cmd4Storage[ ${characteristicString} ] did not return undefined` );

      done( );
   });
});
describe(`Init with Class data Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage with Class data`, ( done ) =>
   {
      // The Test data
      let testData = new Cmd4Storage( );
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;
      testData.setStoredValueForCharacteristic( characteristicString, 1 );


      let cmd4Storage = new Cmd4Storage( testData );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });

   it( `Test creation of Cmd4Storage with invalid Class data throws error`, ( done ) =>
   {
      // The Test data
      let testData = new Cmd4Storage( );
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;
      testData.setStoredValueForCharacteristic( characteristicString, 1 );

      expect ( ( ) => new Cmd4Storage( 155 ) ).to.throw(/Do not know how to handle Cmd4_Storage parm: 155/);

      done( );
   });

   it( `Test creation of Cmd4Storage with invalid Class Version throws error`, ( done ) =>
   {
      // The Test data
      let testData = new Cmd4Storage( );
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;
      testData.setStoredValueForCharacteristic( characteristicString, 1 );
      testData.CLASS_VERSION = 0;


      expect ( ( ) => new Cmd4Storage( testData ) ).to.throw(/Do not know how to handle Cmd4_Storage Class version: 0/);

      done( );
   });

});

describe(`Init with Old data Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage with old data below ListPairing`, ( done ) =>
   {
      // The Test data
      let storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL -1 ).fill( null );
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.Active ] = 1;


      let cmd4Storage = new Cmd4Storage( storedValuesPerCharacteristic );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ].type;
      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });

   it( `Test creation of Cmd4Storage with old data above ListPairing`, ( done ) =>
   {
      // The Test data
      let storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL -1 ).fill( null );
      // The old data would be the new minus one.
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.LockControlPoint -1 ] = 1;
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus -1 ] = 1;


      let cmd4Storage = new Cmd4Storage( storedValuesPerCharacteristic );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      // Check the next characteristic past ListPairing
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.LockControlPoint ].type;
      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus ].type;
      value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });
});




