"use strict";

// ***************** TEST LOADING **********************


let { indexOfEnum,  Cmd4Accessory } = require( "../Cmd4Accessory" );


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins


// Need homebridge logging for Cmd4Accessory
var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
// logger_1.setDebugEnabled();
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

   it( "Test init Cmd4Accessory", function( )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );
   });

   it( "Test Cmd4Accessory.setValue", function( )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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

      TVConfig.state_cmd = "./echoScripts/echo_ACTIVE";
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      assert.isFunction( cmd4Accessory.setValue, "Cmd4Accessory.setValue is not a function" );
   });

   /*
   it( "Test Cmd4Accessory.setValue", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      var clock = sinon.useFakeTimers();
      var callback = sinon.fake();

      cmd4Accessory.setValue( CMD4_ACC_TYPE_ENUM.Active, callback );

      clock.tick(99);

      assert(callback.notCalled, " setValue callback should only be updated once. Expected: 1 to equal: " + callback.callCount);

      done();
   });
   */

   it( "setValue 1 should send 1 to script for ClosedCaption non constant request", function ( done )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult =`${value}`;
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.equal(sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         done();
      });
   });

   it( `setValue 1, aka ENABLED should send "ENABLED" to script for constant request`, function ( done )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult = "ENABLED";
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.equal(sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         done();
      });
   });

   it( "setValue true should send 0 to script for Mute request", function ( done )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      let value = true;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult = 1;
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.equal(sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         done();
      });
   });
});
