"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Platform } = require( "../Cmd4Platform" );
let { Cmd4Accessory } = require( "../Cmd4Accessory" );

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );
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

describe( "Testing Demo Mode", function( )
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
            name:                         "MySwitch",
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

      assert.include( log.logBuf, `[35mConfiguring platformAccessory: \u001b[39mMySwitch`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for MySwitch characteristic: On`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

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
         assert.include( log.logBuf, `[90mgetCachedValue On for: MySwitch returned (CACHED) value: false`, ` getValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( log.errBuf, "", ` getValue Unexpected stderr: ${ log.errBuf }` );

         done( );
      }, 1000 );


   }).timeout( 2000 );

});
