#!node


let constants = require( "../cmd4Constants" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;


var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


// This unit test requires debug enabled to catch the polling messages
logger_1.setDebugEnabled( true );
const log = logger_1.Logger.internal;
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function ( ) { return logger_1.LogLevel; } });

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
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      cmd4Accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY, parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      // Clear the hook buffer for next time.
      hook.reset( );
   });


   it('cmd4Accessory determineCharacteristicsToPoll works.', ( done ) =>
   {
      cmd4Accessory[ "polling" ] = [ { "characteristic": "on", "timeout":3000, "interval": 1 } ],

      hook.start( );
      cmd4Accessory.determineCharacteristicsToPollOfAccessoryAndItsChildren( cmd4Accessory );
      assert.equal( Object.keys( cmd4Accessory.listOfPollingCharacteristics ).length, 1, `Incorrect number of polling characteristics` );
      hook.stop( );

      let logMsg= hook.capturedLog( );
      let errMsg= hook.capturedErr( );
      assert.equal( errMsg, "" , `Unexpected stderr: ${ errMsg }` );
      assert.equal( logMsg, "" , `Unexpected stdout: ${ logMsg }` );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( 'cmd4Accessory startPollingForAccessoryAndItsChildren works.', ( done ) =>
   {
      assert.equal( Object.keys( cmd4Accessory.listOfPollingCharacteristics ).length, 1, `Incorrect number of polling characteristics` );

      hook.start( );

      cmd4Accessory.startPollingForAccessoryAndItsChildren( cmd4Accessory );

      assert.equal( Object.keys(cmd4Accessory.listOfRunningPolls).length, 1, `Incorrect number of polls created` );
      // Do not let the polling timer repeat.
      delete cmd4Accessory.listOfRunningPolls;
setTimeout( ( ) =>
{
      hook.stop( );


      let logMsg= hook.capturedLog( );
      let errMsg= hook.capturedErr( );
      assert.include( logMsg, "mStarting polling for: My_Switch" , `Starting polling not found: ${ logMsg }` );
      assert.equal( errMsg, "" , `Unexpected stderr: ${ errMsg }` );
      assert.include( logMsg, "getValue: On function for: My_Switch returned: 0" , `getvalue: On not found: ${ logMsg }` );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
}, 6000 );
   }).timeout( 20000 );


});

