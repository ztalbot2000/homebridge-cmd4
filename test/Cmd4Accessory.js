"use strict";


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI.HomebridgeAPI; // object we feed to Plugins


// Init the library for all to use
CMD4_ACC_TYPE_ENUM.init( _api.hap );
CMD4_DEVICE_TYPE_ENUM.init( _api.hap, _api.hap.Service );


var Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4Storage = require( "../utils/Cmd4Storage" );

// Unfortunately this test never exits, because polling will start.
// Warn the user of such
// Note: Not true anymore as polling moved to Platform.
//function abort()
//{
//   console.log("Test of Cmd4Accessory requires CTRL-c as polling was backgrounded");
//   setTimeout( abort, 1800 );
//}
//setTimeout( ( ) => { abort(); }, 1800 );

// The State_cmd is called from $HOME
const home = require( "os" ).homedir();
// THIS IS WHAT SCREWS UP THE THE UNIT TEST CASES IN Cmd4AccessoryGetValues! !!!
//process.chdir( home );
//


// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{

   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, `Characteristic is not an function` );
   });

   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, `Accessory is not an function` );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Service, `_api.hap.Service is not an function` );
   });

   it( `CMD4_ACC_TYPE_ENUM.EOL = ${ ACC_EOL }`, ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });

   it( `CMD4_DEVICE_TYPE_ENUM.EOL = ${ DEVICE_EOL }`, ( ) =>
   {
      expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
   });
})

// ******** TEST Cmd4Accessory *************
describe('A simple Cmd4Accessory Test', ( ) =>
{
   it( `Test can create an instance of Cmd4Accessory`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, `Expected accessory to be instance of Cmd4Accessory.` );

   });
});

describe('A simple Cmd4Accessory Test Debbuging enabled', ( ) =>
{
   it( `Test can create an instance of Cmd4Accessory with Debug Enabled`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, `Expected accessory to be instance of Cmd4Accessory.` );


   });
});


describe('Test Cmd4Accessory variables ', ( ) =>
{
   it( `Test typeIndex of a Switch set correctly`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, `Expected accessory to be instance of Cmd4Accessory.` );

      assert.equal( accessory.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, "Expected typeIndex: %s Found: %s" , CMD4_DEVICE_TYPE_ENUM.Switch, accessory.typeIndex );
      assert.equal( accessory.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, `Unexpected matching typeIndex` );
   });

   it( `Test typeIndex of all possible devices`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };


      let parentInfo = undefined;
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         // Cannot create an accessory information of an accessory information
         if ( index == CMD4_DEVICE_TYPE_ENUM.AccessoryInformation )
         {
            continue;
         }

         config.name = "My_" + CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( index );
         config.type = CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( index );

         let log = new Logger( );
         log.setOutputEnabled( false );
         log.setBufferEnabled( true );
         log.setDebugEnabled( false );

         let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

         assert.instanceOf( accessory , Cmd4Accessory, `Expected accessory to be instance of Cmd4Accessory using index ${ index}` );

         assert.equal( accessory.typeIndex , index, `Unexpected typeIndex: at ${ index }` );

      }
   });
});

describe('Cmd4Accessory Test get/test/set storedValues', ( ) =>
{
   it( `Check that STORED_DATA_ARRAY is created`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.isArray( accessory.STORED_DATA_ARRAY, `Expected accessory.STORED_DATA_ARRAY to be an Array. Found ${ typeof accessory.STORED_DATA_ARRAY }` );

   });

   it( `Check that Array STORED_DATA_ARRAY.cmd4Storage is created`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, `Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found ${ typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage }` );

   });

   it( `Check that cmd4Storage Array size is: ${ ACC_EOL }`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.equal( Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length, ACC_EOL, `Expected cmd4Storage to be of size: ${ ACC_EOL }` );

   });

   it( "Check that getStoredValueForCharacteristic UC is set correctly for a Switch", ( ) =>
   {
      let config =
      {
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let characteristicString;
      let cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ] );

      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++)
      {
         characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( index );

         let value = cmd4Accessory.cmd4Storage.getStoredValueForCharacteristic( characteristicString );
         if ( index == CMD4_ACC_TYPE_ENUM.On )
         {
            assert.isFalse( value, `Expected accessory.getStoredValueForCharacteristic( ${ characteristicString } ) to be False using index ${ index}` );
         }
         else
         {
            assert.isNull( value, `Expected accessory.getStoredValueForCharacteristic( ${ characteristicString } ) to be null using index ${ index}` );
         }
      }

   });

   it( "Check that getStoredValueForCharacteristic LC is set correctly for a Switch", ( ) =>
   {
      let config =
      {
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let characteristicString;
      let cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ] );

      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++)
      {
         characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( index );

         let value = cmd4Accessory.cmd4Storage.getStoredValueForCharacteristic( characteristicString );
         if ( index == CMD4_ACC_TYPE_ENUM.On )
         {
            assert.isFalse( value, `Expected accessory.getStoredValueForCharacteristic( ${ characteristicString } ) to be False using index ${ index}` );
         }
         else
         {
            assert.isNull( value, `Expected accessory.getStoredValueForCharacteristic( ${ characteristicString } ) to be null using index ${ index}` );
         }
      }

   });

   it( "Check that getStoredValueForIndex is set correctly for a Switch", ( ) =>
   {
      let config =
      {
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ] );

      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++)
      {
         let value = cmd4Accessory.cmd4Storage.getStoredValueForIndex( index );
         if ( index == CMD4_ACC_TYPE_ENUM.On )
         {
            assert.isFalse( value, `Expected accessory.getStoredValueForIndex( ${ index } ) to be False using index ${ index}` );
         }
         else
         {
            assert.isNull( value, `Expected accessory.getStoredValueForIndex( ${ index } ) to be null using index ${ index}` );
         }
      }

   });


   it( `Check setStoredValueForIndex throws error with accTypeEnumIndex < 0`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      expect ( ( ) => accessory.cmd4Storage.setStoredValueForIndex( -1, 0 ) ).to.throw(/setStoredValue - Characteristic index: -1 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( `Check setStoredValueForIndex throws error with accTypeEnumIndex >= EOL`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      expect ( ( ) => accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.EOL, 0 ) ).to.throw(/setStoredValue - Characteristic index: 223 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( `Check getStoredValue works correctly for a Switch`, ( ) =>
   {
      let config =
      {
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );


      let newValue = true;
      let value;
      let characteristicString;

      accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, newValue );

      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++)
      {
         characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( index );
         value = STORED_DATA_ARRAY[0].cmd4Storage.DATA[ index ];
         if ( index == CMD4_ACC_TYPE_ENUM.On )
            assert.isTrue( value, `Expected accessory.STORED_DATA_ARRAY( ${ index } ) to be False using index ${ index}` );
         else
            assert.isNull( value, `Expected accessory.STORED_DATA_ARRAY( ${ index } ) to be null using index ${ index}` );
      }
      let result = accessory.cmd4Storage.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( result, newValue, `Unexpected getStoredValueForIndex( ${ CMD4_ACC_TYPE_ENUM.On }` );

      characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );
      result = accessory.cmd4Storage.getStoredValueForCharacteristic( characteristicString);
      assert.equal( result, newValue, `Unexpected getStoredValueForCharacteristic( ${ characteristicString }` );


   });

   it( `Check getStoredValueForIndex throws error with accTypeEnumIndex < 0`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      expect ( ( ) => accessory.cmd4Storage.getStoredValueForIndex( -1 ) ).to.throw(/getStoredValue - Characteristic index: -1 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( `Check getStoredValueForIndex throws error with accTypeEnumIndex >= EOL`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      expect ( ( ) => accessory.cmd4Storage.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.EOL ) ).to.throw(/getStoredValue - Characteristic index: 223 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( `Check testStoredValue works correctly for a Switch`, ( ) =>
   {
      let config =
      {
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );
      log.setBufferEnabled( );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      let characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );

      config.On = true;
      let newValue = true;
      accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, newValue );

      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++)
      {
         characteristicString = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( index );
         let value = accessory.cmd4Storage.testStoredValueForIndex( index );

         let cvalue = accessory.cmd4Storage.testStoredValueForCharacteristic( characteristicString );
         if ( index == CMD4_ACC_TYPE_ENUM.On )
         {
            assert.equal( value, newValue, `Unexpected return value for accessory.testStoredValueForIndex( ${ index } ) using index ${ index}` );
            assert.equal( cvalue, newValue, `Unexpected return value for accessory.testStoredValueForCharacteristic( ${ characteristicString } ) using index ${ index}` );
         }
         else
         {
            assert.isNull( value, `Expected return value for accessory.testStoredValueForIndex( ${ index } ) to be null using index ${ index}` );
            assert.isNull( cvalue, `Expected return value for accessory.testStoredValueForCharacteristic( ${ characteristicString } ) to be null using index ${ index}` );
         }
      }

   });

   it( `Check testStoredValue limits returns undefined`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let value, index;
      let accessory = new Cmd4Accessory( log, config, _api, [ ] );


      // Test below zero
      index = -1;
      value = accessory.cmd4Storage.testStoredValueForIndex( index );
      assert.isUndefined( value, `Expected accessory.testStoredValueForIndex( ${ index } ) to return undefind` );

      // Test not given
      value = accessory.cmd4Storage.testStoredValueForCharacteristic( );
      assert.isUndefined( value, `Expected accessory.testStoredValueForCharacteristic() to return undefined` );


      // Test above EOL
      index = ACC_EOL + 1;
      value = accessory.cmd4Storage.testStoredValueForIndex( index );
      assert.isUndefined( value, `Expected accessory.testStoredValueForIndex( ${ index } ) to return undefined` );

      // Test not given
      value = accessory.cmd4Storage.testStoredValueForCharacteristic( "Does not exist" );
      assert.isUndefined( value, `Expected accessory.testStoredValueForCharacteristic() to return undefined` );



   });

   it( `Check that Array STORED_DATA_ARRAY.cmd4Storage is created`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, `Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found ${ typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage }` );

   });

});

describe('Cmd4Accessory Test parseConfig', ( ) =>
{
   it( "Check that invalid category throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         category:                        "Bad"
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Category specified: "Bad" is not a valid homebridge category for: "Test Switch"./);
   });

   it( `Check that queue is already defined before use throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         queue:                            "A"
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/"QueueType" must be defined first for queue "A" in: "Test Switch"/);
   });

   it( `Check that type is defined for an accessory throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Unknown device type: "undefined" given in: "Test Switch"./);
   });

   it( `Check that unknown type is defined for an accessory throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Sink",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Unknown device type: "Sink" given in: "Test Switch"./);
   });

   it( `Check that lower case type gives a warning and continues`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      log.setDebugEnabled( false );

      new Cmd4Accessory( log, config, _api, [ ] );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode for Test Switch`, `Incorrect stdout: ${ log.logBuf }` );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for Test Switch", `Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mThe config.json Cmd4 device type: switch is lowerCase.  It should be: Switch. In the near future this will be an error for homebridge-UI integration`, ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

      assert.equal( 1, log.logLineCount, ` To many logged lines: ${ log.logBuf }` );
      assert.equal( 1, log.errLineCount, ` To many logged lines: ${ log.errBuf }` );
   });

   it( `Check that upper case Cmd4 directive gives a warning and continues`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         DisplayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( cmd4Accessory , Cmd4Accessory, `Expected cmd4Accessory to be instance of Cmd4Accessory.` );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode for Test Switch`, `Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mThe config.json Cmd4 Directive: DisplayName is Capitalized.  It should be: displayName. In the near future this will be an error for homebridge-ui integration`, ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

      assert.equal( 1, log.logLineCount, ` To many logged lines: ${ log.logBuf }` );
      assert.equal( 1, log.errLineCount, ` To many logged lines: ${ log.errBuf }` );
   });

   it( `Check that upper case Cmd4 Characteristic gives a warning and continues`, ( ) =>
   {
      let config =
      {
         Name:                            "Test Switch",
         displayName:                     "Test Switch",
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( cmd4Accessory , Cmd4Accessory, `Expected cmd4Accessory to be instance of Cmd4Accessory.` );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode for Test Switch`, `Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mThe config.json characteristic key: Name is Capitalized.  It should be: name. In the near future this will be an error for homebridge-ui integration`, ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

      assert.equal( 1, log.logLineCount, ` To many logged lines: ${ log.logBuf }` );
      assert.equal( 1, log.errLineCount, ` To many logged lines: ${ log.errBuf }` );
   });

   it( `Check that empty state_cmd for an accessory throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                          true,
         state_cmd:                       false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/No state_cmd for: "Test Switch"./);
   });

   it( `Check that invalid characteristic for an accessory throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         Xon:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/OOPS: "Xon" not found for parsing characteristics in: "Test Switch"./);
   });

   it( `Check that upper case characteristic for an accessory generates a warning`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",  // Should be  lower case name
         type:                            "Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      log.setDebugEnabled( false );


      new Cmd4Accessory( log, config, _api, [ ] );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for Test Switch", `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

      assert.equal( 1, log.logLineCount, ` To many logged lines: ${ log.logBuf }` );
      assert.equal( 0, log.errLineCount, ` To many logged lines: ${ log.errBuf }` );
   });

   it( `Check that invalid polling type (string throws an error`, ( ) =>
   {
      let config =
      {
         name:                   "Test Switch",
         type:                   "Switch",
         on:                     false,
         polling:                "yes",
         state_cmd:              `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Unknown type for Polling "yes" given in: "Test Switch"./);
   });

   it( `Check that invalid polling characteristic for an accessory throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ characteristic: "XOn"}],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/No such polling characteristic: "XOn" for: "Test Switch"./);
   });

   it( `Check that polling characteristic is also defined throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ characteristic: "active"}],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Polling for: "active" requested, but characteristic is not in your config.json file for: "Test Switch"./);
   });

   it( `Check that polling characteristic is invalid throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ "XOn": 15 }],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/OOPS: "XOn" not found while parsing for characteristic polling of "Test Switch". There something wrong with your config.json file?/);

   });

   it( `Check that no polling characteristic defined throws an error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ interval: 15 }],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/No characteristic found while parsing for characteristic polling of: "Test Switch". There something wrong with your config.json file?/);
   });

   it( `Check that Constant definitions work`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let parentInfo={ "CMD4": constants.PLATFORM,
                       "LEVEL": -1,
                       "globalConstants": [
                          { "key": "${psk}", "value": "123456" },
                          { "key": "${ipaddress}", "value": "12Aa34bbcc" },
                          { "key": "${port}", "value": "8091" }
                       ]
                     };

      new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( `Check that Constant key starts with \${ works or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants: [
            { key: "{psk}", value: "123456" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Constant definition for: "{psk}" must start with "\${" for clarity./);

   });

   it( `Check that Constant key ends with } works or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants: [
            { key: "${psk", value: "123456" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Constant definition for: "\${psk" must end with "}" for clarity./);

   });

   it( `Check that Constant is an array/list or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants:
            { key: "${psk}", value: 1 },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Constants must be an array of { "key": "\${SomeKey}", "value": "some replacement string" }/ );

   });

   it( `Check that variable definitions work`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables: [
            { key: "${psk}", value: "123456" },
            { key: "${ipaddress}", value: "12Aa34bbcc" },
            { key: "${port}", value: "8091" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      new Cmd4Accessory( log, config, _api, [ ] );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( `Check that variable key starts with \${ works or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables: [
            { key: "{psk}", value: "123456" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Variable definition for: "{psk}" must start with "\${" for clarity./);

   });

   it( `Check that variable key ends with } works or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables: [
            { key: "${psk", value: "123456" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Variable definition for: "\${psk" must end with "}" for clarity./);

   });

   it( `Check that Variables is an array/list or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables:                     "${psk}:1",
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/Variables must be an array of { "key": "\${SomeKey}", "value": "some replacement string" }/);

   });

   it( `Check that url definitions work`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         url:                         "http:blah",
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      new Cmd4Accessory( log, config, _api, [ ] );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( `Check that url is a string or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         url:                             15,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/url must be a string: "15"./);

   });

   it( `Check that requires definitions work`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         requires: [
            { "require": "${fs}" },
            { "require": "http" }
         ],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let parentInfo={ "CMD4": constants.PLATFORM,
                       "LEVEL": -1,
                       "globalConstants": [
                          { "key": "${fs}", "value": "fs" }
                       ]
                     };

      new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( `Check that requires is an array or throws error`, ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         requires:                             15,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      expect ( ( ) => new Cmd4Accessory( log, config, _api, [ ] ) ).to.throw(/requires must be an array of { "require": "some requires string" }/ );

   });

});
describe('Cmd4Accessory Test determineCharacteristicsToPollOfAccessoryAndItsChildren', ( ) =>
{
   afterEach( function( )
   {
      settings.listOfCreatedPriorityQueues = { };
   });
   afterEach( function( )
   {
      // Clear any timers created for any polling queue
      Object.keys(settings.listOfCreatedPriorityQueues).forEach( (queueName) =>
      {
         let queue = settings.listOfCreatedPriorityQueues[ queueName ];
         Object.keys(queue.listOfRunningPolls).forEach( (key) =>
         {
            let timer = queue.listOfRunningPolls[ key ];
            clearTimeout( timer );
         });

         clearTimeout( queue.pauseTimer );
      });

      // Put back the polling queues
      settings.listOfCreatedPriorityQueues = { };
   });

   it( `Check that cmd4Storage gets created`, ( done ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
         interval:                      10,                // seconds
         stateChangeResponseTime:       1,                 // seconds
         timeout:                       6000,              // msec
         polling:                       true
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, `Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found ${ typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage }` );

      done( );
   });

   it( `Check that storedValuesPer Array size is: ${ ACC_EOL }`, ( ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
         interval:                      10,                // seconds
         stateChangeResponseTime:       1,                 // seconds
         timeout:                       6000,              // msec
         polling:                       true
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.equal( Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length, ACC_EOL, `Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be size: ${ ACC_EOL }` );

   });

   it('Polling complains related polling characteristic is missing', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            name:                      "My_Door",
            displayName:               "My_Door",
            statusMsg:                 true,
            type:                      "Door",
            currentPosition:            0,
            targetPosition:             0,
            positionState:              0,
            polling:                   [ { "characteristic": "currentPosition" },
                                         { "characteristic": "positionState" } ],
            state_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, `cmd4Platform is not an instance of Cmd4Platform` );

      this.config = platformConfig.accessories;
      cmd4Platform.discoverDevices( );

      assert.include( log.errBuf, `[33mWarning, With polling for "currentPosition" requested, you also must do polling of "targetPosition" or things will not function properly` , `expected stderr: ${ log.errBuf }` );

      done( );
   });

   it( `Test Polling generates log.if related characteristic not polled also`, function( )
   {
      let thermostatConfig =
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         currentHeatingCoolingState:    0,
         targetHeatingCoolingState:     0,
         polling:                      [{characteristic: "currentTemperature", interval: 60, timeout:2000}],
         state_cmd:                    "./test/echoScripts/echo_quoted0"
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );


      let parentInfo = { };
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unexpected stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "currentTemperature" requested, you also must do polling of "targetTemperature" or things will not function properly`, ` Cmd4Accessory Incorrect stderr: ${ log.errBuf }` );

   });

   it( `Test Polling generates log for linked accessory if related characteristic not polled also`, ( ) =>
   {
      let thermostatConfig =
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         linkedTypes:
         {
            type:                      "Thermostat",
            name:                      "Linked_Thermostat",
            displayName:               "Linked_Thermostat",
            temperatureDisplayUnits:   "CELSIUS",
            active:                    "Inactive",
            currentTemperature:         20.0,
            targetTemperature:          20.0,
            currentHeatingCoolingState: 0,
            targetHeatingCoolingState:  0,
            polling:                   [{characteristic: "currentTemperature", interval: 60, timeout:2000}],
            state_cmd:                   "./test/echoScripts/echo_quoted0"
         },
         CurrentHeatingCoolingState:   0,
         TargetHeatingCoolingState:    0,
         polling:                     [{characteristic: "currentTemperature",
                                        interval: 60,
                                        timeout:  2000},
                                       {characteristic: "targetTemperature",
                                         interval: 60,
                                         timeout:  2000}],
         State_cmd:                     "./test/echoScripts/echo_quoted0"
      };
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.include( log.logBuf, `Creating linked accessories for: Thermostat`, ` Cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "currentTemperature" requested, you also must do polling of "targetTemperature" or things will not function properly`, ` Cmd4Accessory Incorrect stderr:: ${ log.errBuf }` );

   });

   it( `Test Polling generates log for Added accessory if related characteristic not polled also`, ( ) =>
   {
      let platformConfig=
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         currentHeatingCoolingState:    0,
         targetHeatingCoolingState:     0,
         polling:                      [{ characteristic:   "currentTemperature" },
                                        { characteristic:   "targetTemperature" } ],
         state_cmd:                      "./test/echoScripts/echo_quoted0",
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "currentDoorState" },
                                      // { characteristic: "targetDoorState" },
                                         { characteristic: "obstructionDetected" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning, With polling for "currentDoorState" requested, you also must do polling of "targetDoorState" or things will not function properly`, ` Cmd4Accessory Incorrect stderr:: ${ log.errBuf }` );

   });


   it( `Test Polling generates log for Standalone accessory if related characteristic not polled also`, ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "CurrentDoorState" },
                                      // { characteristic: "TargetDoorState" },
                                         { characteristic: "ObstructionDetected" }
                     ],
            state_cmd:                   "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }],
         platforms: [
         {
            platform:                  "Cmd4",
            outputConstants:            false,
            restartRecover:            true,
            accessories: [
            {
               type:                        "Thermostat",
               name:                        "Thermostat",
               displayName:                 "Thermostat",
               temperatureDisplayUnits:     "CELSIUS",
               active:                      "Inactive",
               currentTemperature:           20.0,
               targetTemperature:            20.0,
               currentHeatingCoolingState:   0,
               targetHeatingCoolingState:    0,
               polling:                      [{ characteristic: "currentTemperature" },
                                              { characteristic: "targetTemperature" }],
               state_cmd:                    "./test/echoScripts/echo_quoted0"
           }]
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "currentDoorState" requested, you also must do polling of "targetDoorState" or things will not function properly`, ` Cmd4Accessory Incorrect stderr: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is generated for related characteristics `, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                 true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "currentDoorState" },
                                         { characteristic: "targetDoorState" },
                                         { characteristic: "obstructionDetected" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for StandaloneDoorOpener characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: CurrentDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: ObstructionDetected`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is *NOT* generated for related characteristic TemperatureSensors`, ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "TemperatureSensor",
            displayName:               "TemperatureSensor",
            name:                      "TemperatureSensor",
            currentTemperature:        "22.2",
            polling:                   [ { characteristic: "currentTemperature" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for TemperatureSensor characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for TemperatureSensor characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });


   it( `Test that adding "queued" Target message is generated for related characteristics`, ( ) =>
   {
      let platformConfig =
      {
         queueTypes:                  [{ queue: "A", queueType: "WoRm" }],
         accessories: [
         {
            type:                        "Thermostat",
            name:                        "Thermostat",
            displayName:                 "Thermostat",
            temperatureDisplayUnits:     "CELSIUS",
            currentTemperature:           20.0,
            targetTemperature:            20.0,
            currentHeatingCoolingState:   0,
            targetHeatingCoolingState:    0,
            queue:                       "A",
            polling:                     [{ characteristic: "currentTemperature" },
                                          { characteristic: "targetTemperature" },
                                          { characteristic: "currentHeatingCoolingState" },
                                          { characteristic: "targetHeatingCoolingState" } ],
            state_cmd:                   "./test/echoScripts/echo_quoted0"
        }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );



      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for Thermostat characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });
});


describe('Test Cmd4Accessory change characteristic Props', ( ) =>
{
   it('Test successful change Props definition ', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            type:                            "TemperatureSensor",
            displayName:                     "My_TemperatureSensor",
            name:                            "My_TemperatureSensor",
            currentTemperature:               25,
            statusFault:                     "NO_FAULT",
            props: { CurrentTemperature: { maxValue: 100,
                                           minValue: -100,
                                           minStep: 0.1
                                         }
                   },
            polling:                         [ { characteristic: "currentTemperature" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      assert.instanceOf( cmd4Accessory , Cmd4Accessory, `Expected cmd4Accessory to be instance of Cmd4Accessory.` );

      assert.include( log.logBuf, `[90mOverriding characteristic CurrentTemperature props for: My_TemperatureSensor`, `Incorrect stdout: ${ log.logBuf }` );

      done( );
   });

});
