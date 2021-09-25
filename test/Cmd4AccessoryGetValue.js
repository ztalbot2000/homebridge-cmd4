"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Platform } = require( "../Cmd4Platform" );
let { Cmd4Accessory } = require( "../Cmd4Accessory" );


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
   afterEach( ( ) =>
   {
      // MaxListenersExceededWarning: Possible EventEmitter memory leak detected
      _api.removeAllListeners();
   });

   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory", function( )
   {
      let platformConfig =
      {
         accessories:
         [{
            name:                        "My_Television",
            type:                        "Television",
            cmd4_Mode:                   "Demo",
            category:                    "TELEVISION",
            publishExternally:           true,
            active:                      "ACTIVE",
            activeIdentifier:             1234,
            mute:                        true,
            configuredName:              "My_Television",
            sleepDiscoveryMode:          "ALWAYS_DISCOVERABLE",
            brightness:                   8,
            closedCaptions:              "DISABLED",
            currentMediaState:           "STOP",
            targetMediaState:            "STOP",
            pictureMode:                 "STANDARD",
            remoteKey:                   "SELECT"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

   });

   it( "Test Cmd4Accessory.queue.priorityGetValue", function( )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_ACTIVE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

   });

   it( "getValue active should inject 1 to Hombridge for ACTIVE response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd: "./test/echoScripts/echo_ACTIVE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.equal( log.logBuf, "", ` getValue Unexpected stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 2000 );
   }).timeout( 3000 );

   it( "getValue Active should inject 0 to Hombridge for INACTIVE response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_INACTIVE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: INACTIVE`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active for: My_Television transposed: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` getValue unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1900);
   });

   it( "getValue active should inject 0 to Hombridge for 0 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` getCachedValue unexpected stderr: ${ log.errBuf }` );


         done( );
      }, 1500);
   });

   it( "getValue Active should inject 1 to Hombridge for 1 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_1"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: 1`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Active should inject 0 to Hombridge for quoted0 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_quoted0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Active should inject 1 to Hombridge for quoted1 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_quoted1"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: 1`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject false to Hombridge for false response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            polling:                  true,
            state_cmd:                "./test/echoScripts/echo_INACTIVE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Active ]
             .characteristic ).getValue( "Active", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active function for: My_Television returned: INACTIVE`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Active for: My_Television transposed: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject true to Hombridge for true response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_true"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: true`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute for: My_Television transposed: 1`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject false to Hombridge for 0 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject true to Hombridge for 1 response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_1"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: 1`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject false to Hombridge for quotedFalse response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_quotedFALSE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: False`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute for: My_Television transposed: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue Mute should inject true to Hombridge for quotedTrue response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_quotedTRUE"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute function for: My_Television returned: True`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: Mute for: My_Television transposed: 1`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );
         done( );
      }, 1500);
   });

   it( "getValue ClosedCaptions should inject 0 to Hombridge for DISABLED response", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since ClosedCaptions is optional
            polling:                  [{ characteristic: "closedCaptions" }],
            state_cmd:                "./test/echoScripts/echo_DISABLED"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.ClosedCaptions ]
             .characteristic ).getValue( "ClosedCaptions", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: ClosedCaptions function for: My_Television returned: DISABLED`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: ClosedCaptions for: My_Television transposed: 0`, ` getValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue of empty response should fail correctly", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_nothing",
            timeout:                   500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `getValue: Mute function for: My_Television returned an empty string ""`, ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 1, `getValue: to many lines to stderr ${ log.errBuf }` );

         done( );
      }, 1500);

   });

   it( "getValue of null response should fail correctly", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_null",
            timeout:                  500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `getValue: "null" returned from stdout for Mute My_Television`, ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 1, `getValue: to many lines to stderr ${ log.errBuf }` );


         done( );
      }, 1500);
   });

   it( "getValue of echo true rc=1 response pass with error message", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_true_withRcOf1",
            timeout:                  500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         // The script error
         assert.include( log.errBuf, `[31m\u001b[31mgetValue Mute function failed for My_Television cmd: ./test/echoScripts/echo_true_withRcOf1 Get 'My_Television' 'Mute' Failed. Error: 1`, ` getValue Incorrect stderr: ${ log.errBuf }` );

         // The ( error ) returned from exec
         assert.include( log.errBuf, `[31mgetValue Mute function failed for My_Television cmd: ./test/echoScripts/echo_true_withRcOf1 Get 'My_Television' 'Mute' Failed.  Generated Error: Error: Command failed: ./test/echoScripts/echo_true_withRcOf1 Get 'My_Television' 'Mute'`, ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 2, `getValue: to many lines to stderr ${ log.errBuf }` );

         done( );
      }, 1500);

   });

   it( "getValue of quoted Null should fail correctly", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_quotedNULL",
            timeout:                  500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `getValue: Mute function for My_Television returned the string ""NULL""`, ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 1, `getValue: to many lines to stderr ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue of quoted Nothing should fail correctly", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_quotedNothing",
            timeout:                  500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `getValue: Mute function for: My_Television returned an empty string "" ""`, ` getValue Incorrect stdout: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 1, `getValue: to many lines to stderr ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue of Nothing to stdout and something to stderr should show error message", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/echo_errorToStderr",
            timeout:                  500
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, "[31mgetValue: Mute function for My_Television streamed to stderr: This message goes to stderr", ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.include( log.errBuf, `[31mgetValue: Mute function for: My_Television returned an empty string ""`, ` getValue Incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 2, `getValue: to many lines to stderr ${ log.errBuf }` );


         done( );
      }, 1500);
   });

   it( "getValue of Nothing to stdout and rc=0 should show error message", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            timeout:                   500,
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd: "./test/echoScripts/justExitWithRCof0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `[31mgetValue: Mute function for: My_Television returned an empty string ""`, ` getValue incorrect stderr: ${ log.errBuf }` );
         assert.equal( log.errLineCount, 1, `getValue: to many lines to stderr ${ log.errBuf }` );

         done( );
      }, 1500);
   });

   it( "getValue of Nothing to stdout and rc=1 should show error message", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            timeout:                   500,
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd: "./test/echoScripts/justExitWithRCof0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

         assert.include( log.errBuf, `[31mgetValue: Mute function for: My_Television returned an empty string ""`, ` getValue incorrect stderr: ${ log.errBuf }` );

         cmd4Accessory.state_cmd = "./test/echoScripts/justExitWithRCof1";
         cmd4Accessory.timeout = 400;

         // Call the getValue bound function, which is priorityGetValue
         cmd4Accessory.service.getCharacteristic(
            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
                .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

         setTimeout( ( ) =>
         {

            assert.include( log.errBuf, `getValue Mute function failed for My_Television cmd: ./test/echoScripts/justExitWithRCof1 Get 'My_Television' 'Mute' Failed.`, ` getValue incorrect stderr: ${ log.errBuf }` );

            done( );

         }, 700 );
      }, 1500 );
   }).timeout( 2500 );

   it( "getValue of timeout response should fail correctly", function ( done )
   {
      let platformConfig =
      {
         accessories:
         [{
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
            remoteKey:                "SELECT",
            timeout:                   400,
                                      // Since Mute is optional
            polling:                  [{ characteristic: "mute" }],
            state_cmd:                "./test/echoScripts/runToTimeoutRcOf0"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : My_Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: My_Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.queue.priorityGetValue, "Cmd4Accessory.queue.priorityGetValue is not a function" );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).getValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.errBuf, `[31mgetValue Mute function timed out 400ms for My_Television cmd: ./test/echoScripts/runToTimeoutRcOf0 Get 'My_Television' 'Mute' Failed`, ` getValue incorrect stderr: ${ log.errBuf }` );

         done( );
      }, 1500 );

   });
});
