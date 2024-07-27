"use strict";


let Cmd4Storage = require( "../utils/Cmd4Storage" );

var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );


describe(`Basic Cmd4Storage Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      const cmd4Storage = new Cmd4Storage( log );

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
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      assert.equal( cmd4Storage.DATA.length, CMD4_ACC_TYPE_ENUM.EOL, `cmd4Storage is not the correct size` );

      for ( let i = 0; i < CMD4_ACC_TYPE_ENUM.EOL; i++ )
      {
        assert.equal( cmd4Storage.DATA[ i ], null, `cmd4Storage[ ${ i } ] is not null` );
      }

      done( );
   });

   it( `Cmd4Storage can set data properly using an index`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );

      done( );
   });

   it( `Cmd4Storage can set data properly using a UC characteristic`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForCharacteristic( characteristicString, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );

      done( );
   });

   it( `Cmd4Storage can set data properly using a LC characteristic`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForCharacteristic( characteristicString, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );

      done( );
   });

   it( `Cmd4Storage can get data properly using an index`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );


      let value = cmd4Storage.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( value, 1, `cmd4Storage.getStoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On } ) did not return 1` );

      done( );
   });

   it( `Cmd4Storage can get data properly using a LC characteristic`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );


      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage.getStoredValueForCharacteristic( ${ characteristicString } ) did not return 1` );

      done( );
   });

   it( `Cmd4Storage can get data properly using a UC characteristic`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );
      assert.equal( cmd4Storage.DATA[ CMD4_ACC_TYPE_ENUM.On ], 1, `cmd4Storage.DATA[ ${ CMD4_ACC_TYPE_ENUM.On } ] is not 1` );


      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage.getStoredValueForCharacteristic( ${ characteristicString } ) did not return 1` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an index value to be null`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      //let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ].type;

      let cmd4Storage = new Cmd4Storage( log );

      let value = cmd4Storage.testStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( value, undefined, `cmd4Storage.testSoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On } ) did not return undefined` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an index value to be set`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );

      let value = cmd4Storage.testStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( value, 1, `cmd4Storage.testSoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On } ) did not return 1` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an UC characteristic value to be null`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );

      let value = cmd4Storage.testStoredValueForCharacteristic( characteristicString );
      assert.equal( value, undefined, `cmd4Storage.testSoredValueForIndex( ${ characteristicString } ) did not return undefined` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an LC characteristic value to be null`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );

      let value = cmd4Storage.testStoredValueForCharacteristic( characteristicString );
      assert.equal( value, undefined, `cmd4Storage.testSoredValueForIndex( ${ characteristicString } ) did not return undefined` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an UC characteristic value to be set`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );
      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );

      let value = cmd4Storage.testStoredValueForCharacteristic( characteristicString );

      assert.equal( value, 1, `cmd4Storage.testSoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On } ) did not return 1` );

      done( );
   });

   it( `Cmd4Storage can test data properly for an LC characteristic value to be set`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );
      cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, 1 );

      let value = cmd4Storage.testStoredValueForCharacteristic( characteristicString );

      assert.equal( value, 1, `cmd4Storage.testSoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On } ) did not return 1` );

      done( );
   });



   it( `Cmd4Storage can set/get data`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );

      let cmd4Storage = new Cmd4Storage( log );

      cmd4Storage.setStoredValueForCharacteristic( characteristicString, 50 );
      let rc = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( rc, 50, `cmd4Storage did not set/get data correctly` );

      done( );
   });
});
describe(`Init with Class data Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage with Class data`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      // The Test data
      let testData = new Cmd4Storage( log );
      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );
      testData.setStoredValueForCharacteristic( characteristicString, 1 );


      let cmd4Storage = new Cmd4Storage( log, testData );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });

   it( `Test creation of Cmd4Storage with invalid Class data throws error`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      // The Test data
      let testData = new Cmd4Storage( log );
      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );
      testData.setStoredValueForCharacteristic( characteristicString, 1 );

      expect ( ( ) => new Cmd4Storage( log, 155 ) ).to.throw(/Do not know how to handle typeof: number Cmd4_Storage parm: 155/);

      done( );
   });

   it( `Test creation of Cmd4Storage with invalid Class Version throws error`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      // The Test data
      let testData = new Cmd4Storage( log );
      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );
      testData.setStoredValueForCharacteristic( characteristicString, 1 );
      testData.CLASS_VERSION = 0;


      expect ( ( ) => new Cmd4Storage( log, testData ) ).to.throw(/Do not know how to handle Cmd4_Storage Class version: 0/);

      done( );
   });

});

describe(`Init with Old data Tests`, ( ) =>
{
   it( `Test creation of Cmd4Storage with old data below ListPairing`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      // The Test data
      let storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL -1 ).fill( null );
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.Active ] = 1;


      let cmd4Storage = new Cmd4Storage( log, storedValuesPerCharacteristic );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.Active );
      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });

   it( `Test creation of Cmd4Storage with old data above ListPairing`, ( done ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      // The Test data
      let storedValuesPerCharacteristic = new Array( CMD4_ACC_TYPE_ENUM.EOL -1 ).fill( null );
      // The old data would be the new minus one.
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.LockControlPoint -1 ] = 1;
      storedValuesPerCharacteristic[ CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus -1 ] = 1;


      let cmd4Storage = new Cmd4Storage( log, storedValuesPerCharacteristic );
      assert.instanceOf( cmd4Storage , Cmd4Storage, "Expected cmd4Storage to be instance of Cmd4Storage. Found %s" , cmd4Storage );

      // Check the next characteristic past ListPairing
      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.LockControlPoint );
      let value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.WiFiSatelliteStatus );
      value = cmd4Storage.getStoredValueForCharacteristic( characteristicString );
      assert.equal( value, 1, `cmd4Storage[ ${characteristicString} ] did not return 1` );
      done( );
   });
});




