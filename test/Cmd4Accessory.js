"use strict";


// Need homebridge logging for Cmd4Accessory
var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
const log = logger_1.Logger.internal;

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins

// The Library files that know all.
var ACC_DATA = require( "../lib/CMD4_ACC_TYPE_ENUM" );
var DEVICE_DATA = require( "../lib/CMD4_DEVICE_TYPE_ENUM" );

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

var Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
log.info ("hello" );

// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{
   // it('log should be a function', ( ) =>
   // {
   //    assert.isFunction( log, "log is not an function" );
   // });

   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, "Characteristic is not an function" );
   });

   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, "Accessory is not an function" );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Service, "_api.hap.Service is not an function" );
   });

   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

// ******** TEST Cmd4Accessory *************
describe('A simple Cmd4Accessory Test', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test can create an instance of Cmd4Accessory", ( ) =>
   {
      let parentInfo = undefined;

      let accessory = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );
   });
});

describe('A simple Cmd4Accessory Test Debbuging enabled', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test can create an instance of Cmd4Accessory with Debug Enabled", ( ) =>
   {
      let parentInfo = undefined;
      logger_1.setDebugEnabled( );

      let accessory = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

      logger_1.setDebugEnabled( false );
   });
});


describe('Test Cmd4Accessory variables ', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test typeIndex of a Switch set correctly ", ( ) =>
   {
      let parentInfo = undefined;

      let accessory = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

      assert.equal( accessory.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, "Expected typeIndex: %s Found: %s" , CMD4_DEVICE_TYPE_ENUM.Switch, accessory.typeIndex );
   });

   let parentInfo = undefined;
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      // Cannot create an accessory information of an accessory information
      if ( index == CMD4_DEVICE_TYPE_ENUM.AccessoryInformation )
      {
         continue;
      }

      it( "Test typeIndex of all possible devices ", ( ) =>
      {
         config.name = "MY_" + CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;
         config.type = CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;

         log.info("Testing %s name: %s", index, config.name);
         let accessory = new Cmd4Accessory( log, config, _api, parentInfo );

         assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

         assert.equal( accessory.typeIndex , index, "Expected typeIndex: %s for: %s. Found: %s" , index, config.type, accessory.typeIndex );
      });
   }
});

describe('Cmd4Accessory Test get/test/set storedValues', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Check that Array storedValuesPer characteristic is created", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );

      assert.isArray( accessory.config.storedValuesPerCharacteristic, Cmd4Accessory, "Expected accessory.config.storedValuesPerCharacteristic to be an Array. Found %s" , typeof accessory.config.storedValuesPerCharacteristic );
   });

   it( "Check that storedValuesPer Array size is:  " + ACC_EOL, ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );

      assert.equal( accessory.config.storedValuesPerCharacteristic.length, ACC_EOL, "Expected accessory.config.storedValuesPerCharacteristic to size: %s. Found %s" , ACC_EOL, accessory.config.storedValuesPerCharacteristic.length );
   });
   it( "Check that storedValuesPerCharacteristic is set correctly for a switch", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );
      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = config.storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }
   });
   it( "Check that setStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );
      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = config.storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }
   });

   it( "Check getStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );
      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = config.storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.config.storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }
      let result = accessory.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( result, config.On, "Expected getStoredValueForIndex to return: %s. Found %s" , config.On, result );
   });
   it( "Check testStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );
      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = accessory.testStoredValueForIndex( index );
         if ( index == accIndex )
            assert.equal( value, config.On, "Expected accessory.testStoredValueForIndex[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );
      }
   });
   it( "Check testStoredValueForIndex limits returns undefined", ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );
      let index = -1;

      let value = accessory.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );

      index = ACC_EOL + 1;
      value = accessory.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );
   });
});
describe('Cmd4Accessory Test determineCharacteristicsToPollOfAccessoryAndItsChildren', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false,
                state_cmd:   "node .homebridge/Cmd4Scripts/State.js",
                interval: 10,                // seconds
                StateChangeResponseTime: 1,  // seconds
                timeout: 6000,               // msec
                polling: true
              };
   it( "Check that Device polling just returns", function( done )
   {
      let accessory = new Cmd4Accessory( log, config, _api );

      //assert.isArray( accessory.config.storedValuesPerCharacteristic, Cmd4Accessory, "Expected accessory.config.storedValuesPerCharacteristic to be an Array. Found %s" , typeof accessory.config.storedValuesPerCharacteristic );
      done( );
   });

   /*
   it( "Check that storedValuesPer Array size is:  " + ACC_EOL, ( ) =>
   {
      let accessory = new Cmd4Accessory( log, config, _api );

      assert.equal( accessory.config.storedValuesPerCharacteristic.length, ACC_EOL, "Expected accessory.config.storedValuesPerCharacteristic to size: %s. Found %s" , ACC_EOL, accessory.config.storedValuesPerCharacteristic.length );
   });
   */
});

