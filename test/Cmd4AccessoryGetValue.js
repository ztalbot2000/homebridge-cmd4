"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins



// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );



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
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Demo",
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

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

   });

   it( "Test Cmd4Accessory.queue.priorityGetValue", function( )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./echoScripts/echo_ACTIVE"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

   });

   it( "getValue Active should inject 1 to Hombridge for ACTIVE response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( true );
      log.setDebugEnabled( true );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd: "./test/echoScripts/echo_ACTIVE"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1000 );
   });

   it.skip( "getValue Active should inject 0 to Hombridge for INACTIVE response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_INACTIVE"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 0, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Active should inject 0 to Hombridge for 0 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_0"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 0, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Active should inject 1 to Hombridge for 1 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_1"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 1, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Active should inject 0 to Hombridge for quoted0 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quoted0"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 0, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Active should inject 1 to Hombridge for quoted1 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quoted1"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 1, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject false to Hombridge for false response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_false"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, false, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject true to Hombridge for true response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_true"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, true, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject false to Hombridge for 0 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_0"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, false, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject true to Hombridge for 1 response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_1"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };



      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, true, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject false to Hombridge for quotedFalse response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quotedFALSE"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };



      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, false, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue Mute should inject true to Hombridge for quotedTrue response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quotedTRUE"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, true, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );
         done( );
      });
   });

   it.skip( "getValue ClosedCaptions should inject 0 to Hombridge for DISABLED response", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_DISABLED"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.ClosedCaptions, "ClosedCaptions", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, 0, ` getValue incorrect result: ${ result }` );

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue of empty response should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_nothing",
          timeout:                   500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_EMPTY_STRING_REPLY, ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `getValue: Mute function for: My_Television returned an empty string ""`, ` getValue Incorrect stderr: ${ log.errBuf }` );

         done( );
      });

   });

   it.skip( "getValue of null response should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_null",
          timeout:                  500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_NULL_STRING_REPLY, ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue unexpected stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `getValue: "null" returned from stdout for Mute My_Television`, ` getValue Incorrect stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue of echo true rc=1 response pass with error message", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_true_withRcOf1",
          timeout:                  500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 1, ` getValue expected: 1 received: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue unexpected stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31m\u001b[31mgetValue Mute function failed for My_Television cmd: ./test/echoScripts/echo_true_withRcOf1 Get 'My_Television' 'Mute' Failed. Error: 1`, ` getValue Incorrect stderr: ${ log.errBuf }` );

         done( );
      });

   });

   it.skip( "getValue of quoted Null should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quotedNULL",
          timeout:                  500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_2ND_NULL_STRING_REPLY , ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue unexpected stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `getValue: Mute function for My_Television returned the string ""NULL""`, ` getValue Incorrect stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue of quoted Nothing should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_quotedNothing",
          timeout:                  500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_EMPTY_STRING_REPLY, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, null, ` getValue incorrect result: ${ result }` );

         assert.include( log.errBuf, `getValue: Mute function for: My_Television returned an empty string "" ""`, ` getValue Incorrect stdout: ${ log.errBuf }` );
         done( );
      });
   });

   it.skip( "getValue of Nothing to stdout and something to stderr should show error message", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          state_cmd:                "./test/echoScripts/echo_errorToStderr",
          timeout:                  500
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_EMPTY_STRING_REPLY , ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, "This message goes to stderr", ` getValue Incorrect stderr: ${ log.errBuf }` );

         done( );
      });

   });

   it.skip( "getValue of Nothing to stdout and rc=0 should show error message", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          timeout:                   500,
          state_cmd: "./test/echoScripts/justExitWithRCof0"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_EMPTY_STRING_REPLY , ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue output nothing to stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31mgetValue: Mute function for: My_Television returned an empty string ""`, ` getValue incorrect stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue of Nothing to stdout and rc=1 should show error message", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          timeout:                   500,
          state_cmd: "./test/echoScripts/justExitWithRCof0"
      };

      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_EMPTY_STRING_REPLY , ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;
      });

      cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/justExitWithRCof1";
      cmd4Accessory.timeout = 400;

      cmd4Accessory.getValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", constants.DEFAULT_TIMEOUT, function( rc, result )
      {
         assert.equal( rc, 1 , ` getValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.equal( log.logBuf, "", ` getValue output something to stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `getValue Mute function failed for My_Television cmd: ./test/echoScripts/justExitWithRCof1 Get 'My_Television' 'Mute' Failed.`, ` getValue incorrect stderr: ${ log.errBuf }` );

         done( );
      });
   });

   it.skip( "getValue of timeout response should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( true );
      log.setDebugEnabled( false );

      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Always",
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
          remoteKey:                "SELECT",
          timeout:                   400,
          state_cmd:                "./test/echoScripts/runToTimeoutRcOf0"
      };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], null );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.equal( log.logBuf, "", ` getValue output something to stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31mgetValue Mute function timed out 400ms for My_Television cmd: ./test/echoScripts/runToTimeoutRcOf0 Get 'My_Television' 'Mute' Failed`, ` getValue incorrect stderr: ${ log.errBuf }` );

         done( );
      }, 1500 );

   });
});
