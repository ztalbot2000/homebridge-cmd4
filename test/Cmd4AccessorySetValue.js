"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI( ); // object we feed to Plugins


var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function ( ) { return logger_1.LogLevel; } });
const log = logger_1.Logger.internal;



// Init the library for all to use
let Characteristic = _api.hap.Characteristic;
let Service = _api.hap.Service;
let Categories = _api.hap.Categories;
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, Service, Characteristic, Categories );


let getSetValueScript="./test/echoScripts/testGetSetValues.js";

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

describe( "Testing Cmd4Accessory", function( )
{
   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory", function( done )
   {
      // A config file to play with.
      // Setting fetch to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          fetch:                    "Cached",
          displayName:              "My_Television",
          category:                 "TELEVISION",
          publishExternally:        true,
          active:                   "ACTIVE",
          activeIdentifier:          1234,
          mute:                     true,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );
      hook.stop( );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( "Test Cmd4Accessory.setValue", function( done )
   {
      // A config file to play with.
      // Setting fetch to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          displayName:              "My_Television",
          fetch:                    "Polled",
          category:                 "TELEVISION",
          publishExternally:        true,
          active:                   "ACTIVE",
          activeIdentifier:          1234,
          mute:                     true,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };

      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );
      hook.stop( );

      assert.isFunction( cmd4Accessory.setValue, "Cmd4Accessory.setValue is not a function" );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   /*
   it( "Test Cmd4Accessory.setValue", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );
      hook.stop( );

      var clock = sinon.useFakeTimers( );
      var callback = sinon.fake( );

      cmd4Accessory.setValue( CMD4_ACC_TYPE_ENUM.Active, callback );

      clock.tick(99);

      assert(callback.notCalled, " setValue callback should only be updated once. Expected: 1 to equal: " + callback.callCount);

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });
   */

   it( "setValue 1 should send 1 to script for ClosedCaption non constant request", function ( done )
   {
      // A config file to play with.
      // Setting fetch to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          fetch:                    "Polled",
          displayName:              "My_Television",
          category:                 "TELEVISION",
          publishExternally:        true,
          active:                   "ACTIVE",
          activeIdentifier:          1234,
          mute:                     true,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = TVConfig.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn1`;
      TVConfig.state_cmd_suffix = fn;
      TVConfig.state_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );
         let expectedResult =`${value}`;
         let expectedOutput = "\u001b[39m\u001b[34mSetting My_Television ClosedCaptions\u001b[39m 1";

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( hook.capturedLog( ), expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `setValue 1, aka ENABLED should send "ENABLED" to script for constant request`, function ( done )
   {
      // A config file to play with.
      // Setting fetch to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          fetch:                    "Polled",
          outputConstants:          true,
          displayName:              "My_Television",
          category:                 "TELEVISION",
          publishExternally:        false,
          active:                   "ACTIVE",
          activeIdentifier:          1234,
          mute:                     true,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = TVConfig.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn2`;
      TVConfig.state_cmd_suffix = fn;

      TVConfig.state_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );

         let expectedResult = "ENABLED";
         let expectedOutput = "\u001b[39m\u001b[34mSetting My_Television ClosedCaptions\u001b[39m 1";
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( hook.capturedLog( ), expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "setValue true should send 0 to script for Mute request", function ( done )
   {
      // A config file to play with.
      // Setting fetch to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          fetch:                    "Polled",
          displayName:              "My_Television",
          active:                   true,
          category:                 "TELEVISION",
          publishExternally:        true,
          activeIdentifier:          1234,
          mute:                     1,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };

      let acc = CMD4_ACC_TYPE_ENUM.Mute;
      let DEVICE = TVConfig.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn3`;
      TVConfig.state_cmd_suffix = fn;

      TVConfig.state_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );

      let value = true;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );

         let expectedResult = 1;
         let expectedOutput = "\u001b[39m\u001b[34mSetting My_Television Mute\u001b[39m true";
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( hook.capturedLog( ), expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });
   it( `setValue of cached characteristic, should set "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         "type":                     "Thermostat",
         "name":                     "Thermostat",
         "fetch":                    "Cached",
         "displayName":              "Thermostat",
         "temperatureDisplayUnits":  "CELSIUS",
         "active":                   "Inactive",
         "currentTemperature":        20.0,
         "targetTemperature":         20.0,
         "currentHeatingCoolingState":  0,
         "targetHeatingCoolingState":  0,
         "stateChangeResponseTime":   3
      };

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      //let DEVICE = ThermostatConfig.displayName;
      //let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, STORED_DATA_ARRAY, null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         hook.stop( );

         let expectedResult = value;
         let expectedOutput = "\u001b[39m\u001b[34mSetting (Cached) Thermostat TargetTemperature\u001b[39m 12.3"
         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( hook.capturedLog( ), expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, expectedResult, " setValue relatedCurrentAccTypeEnumIndex expected: " + expectedResult + " to be stored.  found: " + result );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });
});
