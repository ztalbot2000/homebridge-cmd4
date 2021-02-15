"use strict";

// ***************** TEST LOADING **********************


let { indexOfEnum,  Cmd4Accessory } = require( "../Cmd4Accessory" );


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins


// Need homebridge logging for Cmd4Accessory
var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });



// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


// A config file to play with.
let TVConfig =
{
    name:                     "My_Television",
    type:                     "Television",
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
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );
   });

   it( "Test Cmd4Accessory.getValue", function( )
   {
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      TVConfig.state_cmd = "./echoScripts/echo_ACTIVE";
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      assert.isFunction( cmd4Accessory.getValue, "Cmd4Accessory.getValue is not a function" );
   });

   it( "Test Cmd4Accessory.getValue", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      var clock = sinon.useFakeTimers();
      var callback = sinon.fake();

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, callback );

      clock.tick(99);

      assert(callback.notCalled, " getValue callback should only be updated once. Expected: 1 to equal: " + callback.callCount);

      done();
   });

   it( "getValue Active should inject 1 to Hombridge for ACTIVE response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );


      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 1;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Active should inject 0 to Hombridge for INACTIVE response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_INACTIVE";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );


      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 0;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Active should inject 0 to Hombridge for 0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_0";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 0;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Active should inject 1 to Hombridge for 1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_1";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 1;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Active should inject 0 to Hombridge for quoted0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quoted0";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 0;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Active should inject 1 to Hombridge for quoted1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quoted1";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         let expectedResult = 1;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject false to Hombridge for false response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_false";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = false;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject true to Hombridge for true response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_true";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = true;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject false to Hombridge for 0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_0";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = false;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject true to Hombridge for 1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_1";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = true;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject false to Hombridge for quotedFalse response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedFALSE";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = false;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue Mute should inject true to Hombridge for quotedTrue response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedTRUE";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         let expectedResult = true;

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue ClosedCaptions should inject 0 to Hombridge for DISABLED response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_DISABLED";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.ClosedCaptions, function( rc, result )
      {
         let expectedResult = 0;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });

   it( "getValue ClosedCaptions should inject 1 to Hombridge for Enabled response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ENABLED";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.ClosedCaptions, function( rc, result )
      {
         let expectedResult = 1;
         //console.log( "rc=%s result=%s", rc, result);

         assert.equal(result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         done();
      });
   });
   it( "getValue of empty response should fail correctly", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_nothing";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {

         assert.notEqual(rc, 0, " getValue expected: not zero received: " + rc );

         done();
      });
   });
   it( "getValue of null response should fail correctly", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_null";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {

         assert.notEqual(rc, 0, " getValue expected: not zero received: " + rc );

         done();
      });
   });
   it( "getValue of rc=1 response should fail correctly", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_true_withRcOf1";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {

         assert.notEqual(rc, 0, " getValue expected: not zero received: " + rc );

         done();
      });
   });
   it( "getValue of quoted Null should fail correctly", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedNULL";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {

         assert.notEqual(rc, 0, " getValue expected: not zero received: " + rc );

         done();
      });
   });
   it( "getValue of quoted Nothing should fail correctly", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedNothing";
      // logger_1.setDebugEnabled();
      const log = logger_1.Logger.internal;
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, null );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {

         assert.notEqual(rc, 0, " getValue expected: not zero received: " + rc );

         done();
      });
   });
});
