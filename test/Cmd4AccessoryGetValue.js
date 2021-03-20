"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins


const log = logger_1.Logger.internal;
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function ( ) { return logger_1.LogLevel; } });


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


// A config file to play with.
let TVConfig =
{
    name:                     "My_Television",
    type:                     "Television",
    fetch:                    "Cached",
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
let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


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
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );
      hook.stop( );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      // Clear the hook buffer for next time.
      hook.reset( );
   });

   it( "Test Cmd4Accessory.getValue", function( )
   {
      TVConfig.state_cmd = "./echoScripts/echo_ACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );
      hook.stop( );

      assert.isFunction( cmd4Accessory.getValue, "Cmd4Accessory.getValue is not a function" );

      // Clear the hook buffer for next time.
      hook.reset( );
   });

   it( "getValue Active should inject 1 to Hombridge for ACTIVE response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 1;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Active should inject 0 to Hombridge for INACTIVE response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_INACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 0;

         assert.equal( result, expectedResult, " getValue expected" + expectedResult + " received: " + result );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Active should inject 0 to Hombridge for 0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_0";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 0;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Active should inject 1 to Hombridge for 1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_1";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 1;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Active should inject 0 to Hombridge for quoted0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quoted0";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 0;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Active should inject 1 to Hombridge for quoted1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quoted1";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 1;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject false to Hombridge for false response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_false";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = false;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject true to Hombridge for true response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_true";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = true;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject false to Hombridge for 0 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_0";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = false;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject true to Hombridge for 1 response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_1";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = true;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject false to Hombridge for quotedFalse response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedFALSE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = false;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue Mute should inject true to Hombridge for quotedTrue response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_quotedTRUE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         hook.stop( );

         let expectedResult = true;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue ClosedCaptions should inject 0 to Hombridge for DISABLED response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_DISABLED";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.ClosedCaptions, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 0;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue ClosedCaptions should inject 1 to Hombridge for Enabled response", function ( done )
   {
      TVConfig.state_cmd = "./test/echoScripts/echo_ENABLED";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.ClosedCaptions, function( rc, result )
      {
         hook.stop( );

         let expectedResult = 1;

         assert.equal( result, expectedResult, ` getValue expected ${ expectedResult } received: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( "getValue of empty response should fail correctly", function ( done )
   {

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_nothing";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.notEqual( rc, 0, ` getValue expected: not zero received: ${ rc }` );
         assert.equal( result, null, ` getValue result expected: null received: ${ result }` );
      });

      // We have to wait for the failing getValue to timeout to capture the log messages;
      setTimeout(() =>
      {
         hook.stop( );

         let errMsg= hook.capturedErr( );
         let logMsg= hook.capturedLog( );

         let expectedOutput = `getValue: Mute function for: My_Television returned an empty string ""`;

         assert.include( errMsg, expectedOutput, ` getValue stdErr output expected: ${ expectedOutput } received: ${ errMsg }` );
         assert.equal( logMsg, "", ` getValue output expected: "" received: ${ errMsg }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );

      }, 1000 );

   }).timeout( 2000 );

   it( "getValue of null response should fail correctly", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_null";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.notEqual( rc, 0, ` getValue expected: not zero received: ${ rc }` );
         assert.equal( result, null, ` getValue result expected: null received: ${ result }` );
      });

      // We have to wait for the failing getValue to timeout to capture the log messages;
      setTimeout(() =>
      {
         hook.stop( );

         let errMsg = hook.capturedErr( );
         let expectedOutput = `getValue: "null" returned from stdout for Mute My_Television`;


         assert.include( errMsg, expectedOutput, ` getValue output expected: ${ expectedOutput } received: ${ errMsg }` );


         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of echo true rc=1 response pass with error message", function ( done )
   {
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_true_withRcOf1";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue expected: zero received: ${ rc }` );
         assert.equal( result, true, ` getValue result expected: true received: ${ result }` );
      });

      // We have to wait for the failing getValue to timeout to capture the log messages;
      setTimeout(() =>
      {
         hook.stop( );

         let errMsg = hook.capturedErr( );
         let logMsg = hook.capturedLog( );

         let expectedOutput = `31mgetValue Mute function failed for My_Television cmd: ./test/echoScripts/echo_true_withRcOf1 Get 'My_Television' 'Mute' Failed.  Error: 1`;

         assert.include( errMsg, expectedOutput, ` getValue stdErr output expected: ${ expectedOutput } received: ${ errMsg }` );
         assert.equal( logMsg, "", ` getValue output expected: "" received: ${ errMsg }` );

         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of quoted Null should fail correctly", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_quotedNULL";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue expected: zero received: ${ rc }` );

         assert.equal( result, null, ` getValue result expected: null received: ${ result }` );

      });

      // We have to wait for the failing getValue to timeout to capture the log messages;
      setTimeout(() =>
      {
         hook.stop( );

         let errMsg = hook.capturedErr( );
         let expectedOutput = `getValue: Mute function for My_Television returned the string ""NULL""`;


         assert.include( errMsg, expectedOutput, ` getValue output expected: ${ expectedOutput } received: ${ errMsg }` );

         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of quoted Nothing should fail correctly", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_quotedNothing";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.notEqual( rc, 0, ` getValue expected: not zero received: ${ rc }` );
         assert.equal( result, null, ` getValue result expected: null received: ${ result }` );
      });

      setTimeout(() =>
      {
         hook.stop( );

         let errMsg = hook.capturedErr( );
         let expectedOutput = `getValue: Mute function for: My_Television returned an empty string "" ""`;


         assert.include( errMsg, expectedOutput, ` getValue output expected: ${ expectedOutput } received: ${ errMsg }` );
         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of Nothing to stdout and something to stderr should show error message", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/echo_errorToStderr";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.equal( result, 0, ` getValue result expected: 0 received: ${ result }` );
      });

      setTimeout(() =>
      {
         hook.stop( );
         let logMsg = hook.capturedLog( );
         let errMsg = hook.capturedErr( );

         let expectedOutput = "This message goes to stderr";
         assert.include( errMsg, expectedOutput, ` getValue stdErr output expected: ${ expectedOutput } received: ${ errMsg }` );
         assert.equal( logMsg, "", ` getValue output expected: "" received: ${ errMsg }` );


         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of Nothing to stdout and rc=0 should show error message", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/justExitWithRCof0";
      cmd4Accessory.timeout = 500;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.equal( result, 0, ` getValue result expected: 0 received: ${ result }` );
         assert.equal( rc, 0, ` getValue rc expected: 0 received: ${ rc }` );
      });

      setTimeout(() =>
      {
         hook.stop( );
         let logMsg = hook.capturedLog( );
         let errMsg = hook.capturedErr( );

         assert.equal( logMsg, "", ` getValue output something to stdout: ${ logMsg }` );
         assert.equal( errMsg, "", ` getValue output nothing to stderr: ${ errMsg }` );


         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 1000 );
   }).timeout( 2000 );

   it( "getValue of Nothing to stdout and rc=1 should show error message", function ( done )
   {
      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/justExitWithRCof1";
      cmd4Accessory.timeout = 400;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, function( rc, result )
      {
         assert.equal( result, 0, ` getValue result expected: 0 received: ${ result }` );
      });

      setTimeout(() =>
      {
         hook.stop( );
         let logMsg = hook.capturedLog( );
         let errMsg = hook.capturedErr( );
         let expectedErrOutput = `31mgetValue Mute function failed for My_Television cmd: ./test/echoScripts/justExitWithRCof1 Get 'My_Television' 'Mute' Failed.`;

         assert.equal( logMsg, "", ` getValue output something to stdout: ${ logMsg }` );
         assert.include( errMsg, expectedErrOutput, ` getValue output expected: ${ expectedErrOutput } received: ${ errMsg }` );


         // Clear the hook buffer for next time.
         hook.reset( );
         done( );

      }, 800 );
   }).timeout( 2000 );
});
