"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


// A config file to play with.
let thermostatConfig =
{
   Type:                        "Thermostat",
   Name:                        "Thermostat",
   Cmd4_Mode:                   "Always",
   DisplayName:                 "Thermostat",
   TemperatureDisplayUnits:     "CELSIUS",
   Active:                      "Inactive",
   CurrentTemperature:           20.0,
   TargetTemperature:            20.0,
   CurrentHeatingCoolingState:   0,
   TargetHeatingCoolingState:    0,
   State_cmd: "./test/echoScripts/echo_quoted0"
};

// Testing Cmd4Mode from init would require a Cmd4Platform that emits
// didFinishLoading which interrupts other tests, So just test at the
// Accessory level which really is 99% of it anyway.
let parentInfo={ };


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
      log.setBufferEnabled( );
      let cmd4Accessory = new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` cmd4Accessory output expected: "" received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );
   });

   it( "Test Cmd4Accessory.addAllServiceCharacteristicsForAccessory", function( )
   {
      const log = new Logger( );
      log.setBufferEnabled( );
      let cmd4Accessory = new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` cmd4Accessory output expected: "" received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

      assert.isFunction( cmd4Accessory.addAllServiceCharacteristicsForAccessory, "Cmd4Accessory.addAllServiceCharacteristicsForAccessory is not a function" );

   });

   it( "Test Cmd4Accessory.Cmd4ModePolled should not generate a log", function( )
   {
      thermostatConfig.Cmd4_Mode = constants.CMD4_MODE_POLLED;
      thermostatConfig.Polling = [{"characteristic": "currentTemperature", "interval": 60, "timeout":2000}];

      const log = new Logger( );
      log.setBufferEnabled( );
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` cmd4Accessory output expected: "" received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );


   });
});
