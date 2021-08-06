"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Platform } = require( "../Cmd4Platform" );
let { Cmd4Accessory } = require( "../Cmd4Accessory" );

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );


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

   beforeEach( function( )
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


   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test that getValue (Cached) occurs in Demo mode", function( done )
   {
      let platformConfig =
      {
         accessories:
         [{
            name:                         "My_Switch",
            type:                         "Switch",
            on:                            false,
           }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[35mConfiguring platformAccessory: \u001b[39mMy_Switch`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for My_Switch characteristic: On`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      //log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // Call the getValue bound function, which is priorityGetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
             .characteristic ).getValue( "On", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mgetCachedValue On for: My_Switch returned (CACHED) value: false`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1000 );


   }).timeout( 2000 );

   it( "Test that Cmd4_Mode Demo generates depricated warning", function( done )
   {
      let switchConfig =
      {
         cmd4_Mode:                    "Demo",
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let switchAccessory = new Cmd4Accessory( log, switchConfig, _api, [ ] );
      expect( switchAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode`, ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning: cmd4_Mode has been deprecated.`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );

      done( );
   });

   it( "Test that Cmd4_Mode Polled with polling generates proper warnings", function( done )
   {
      let platformConfig =
      {
         accessories:
         [{
            cmd4_Mode:                    "Polled",
            name:                         "Test Switch",
            type:                         "Switch",
            on:                            false,
            polling:                       true,
            state_cmd:                    "./test/echoScripts/echo_1"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.errBuf, `[33mWarning: cmd4_Mode has been deprecated.`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );
      assert.include( log.errBuf, `[33mTo remove this message, just remove "Cmd4_Mode" from your config.json`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );

      assert.include( log.errBuf, `[33mCmd4 has been simplified and optimized as per: https://git.io/JtMGR`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 3, ` Cmd4Accessory: incorrect number of lines to stderr: ${ log.errBuf }` );


      done( );

   });

   it( "Test that Cmd4_Mode Demo with polling throws an error", function( done )
   {
      let platformConfig =
      {
         accessories:
         [{
            cmd4_Mode:                    "Demo",
            name:                         "Test Switch",
            type:                         "Switch",
            on:                            false,
            polling:                       true,
            state_cmd:                    "./test/echoScripts/echo_1"
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Demo mode is achieved when there are no polling entries in your config.json/);

      done( );

   });

   it( "Test Cmd4Mode=Demo generates a warning", ( done ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         Cmd4_Mode:                    "Demo"
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode`, ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `Cmd4Accessory: unexpected number of lines to stdout ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning: Cmd4_Mode has been deprecated.`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 1 , `Cmd4Accessory: unexpected number of lines to stderr ${ log.errBuf }` );

      done( );
   });

   it( "Test no Cmd4Mode with proper polling should not generate a log", function( done )
   {
      let thermostatConfig =
      {
         Type:                         "Thermostat",
         Name:                         "Thermostat",
         DisplayName:                  "Thermostat",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "Inactive",
         CurrentTemperature:            20.0,
         TargetTemperature:             20.0,
         CurrentHeatingCoolingState:    0,
         TargetHeatingCoolingState:     0,
         polling:                      [{"characteristic": "currentTemperature",
                                         "interval": 60,
                                         "timeout":2000},
                                        {"characteristic": "targetTemperature",
                                         "interval": 60,
                                         "timeout":2000}],
         State_cmd:                    "./test/echoScripts/echo_quoted0"
      };


      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      new Cmd4Accessory( log, thermostatConfig, _api, [ ], { } );

      assert.equal( log.logBuf, "", ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, ``, ` Cmd4Accessory: unexpected stderr: ${ log.errBuf }` );

      done( );
   });
});
