#!node


let constants = require( "../cmd4Constants" );
// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;


var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


// A config file to play with.
let config =
{
   Name:                     "My_Switch",
   DisplayName:              "My_Switch",
   StatusMsg:                true,
   Type:                     "Switch",
   Cmd4_Mode:                "Polled",
   On:                       0,
   State_cmd:                "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
}
let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };






// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
   {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
   });
});

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



describe('Testing Cmd4Accessory polling', ( ) =>
{
   let cmd4Accessory;

   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory", function( )
   {
      const log = new Logger( );
      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );
   });


   it('cmd4Accessory determineCharacteristicsToPollForAccessory works.', ( done ) =>
   {
      cmd4Accessory[ "polling" ] = [ { "characteristic": "on", "timeout":3000, "interval": 1 } ];

      const log = new Logger( );
      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );
      assert.equal( log.logBuf, "" , `Unexpected stdout: ${ log.logBuf }` );

      done( );
   });
});

