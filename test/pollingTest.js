#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;




var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


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
   afterEach(function( )
   {
      if (this.currentTest.state == 'failed')
      {
         if ( settings.arrayOfPollingCharacteristics.length > 0 )
         {
            let accessory = settings.arrayOfPollingCharacteristics[0].accessory;
            console.log(`Cancelling timers for FAILED TEST OF ${ accessory.displayName }`);
            Object.keys(accessory.listOfRunningPolls).forEach( (key) =>
            {
               let timer = accessory.listOfRunningPolls[ key ];
               clearTimeout( timer );
            });

            // Put back the array of Polling Characteristics
            settings.arrayOfPollingCharacteristics = [ ];
         }
      }
   });
   let cmd4Accessory;

   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory has default polling messages", function( )
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };



      const log = new Logger( );
      log.setBufferEnabled( );
      log.setDebugEnabled( );
      log.setOutputEnabled( false );
      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );
      let expectedOutput1 = "[90mPolling config is old style. Nothing to check for unset polling characteristics\u001b";
      let expectedOutput2 = "[90mSetting up which characteristics will be polled for My_Switch\u001b";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, expectedOutput2 , `expected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

   });


   it('cmd4Accessory determineCharacteristicsToPollForAccessory works.', ( done ) =>
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      const log = new Logger( );
      log.setBufferEnabled( );

      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on", "timeout":3000, "interval": 1 } ];

      log.setDebugEnabled( );
      log.setOutputEnabled( false );
      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      let expectedOutput1 = "[90mSetting up accessory: My_Switch for polling of: On timeout: 3000 interval: 1000\u001b";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      // Put back the array of Polling Characteristics
      settings.arrayOfPollingCharacteristics = [ ];

      done( );
   });

   it('cmd4Accessory characteristic polling interval/timeout changes recognized.', ( done ) =>
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      const log = new Logger( );
      log.setBufferEnabled( );

      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on", "timeout":1234, "interval": 99 } ];

      log.setDebugEnabled( );
      log.setOutputEnabled( false );
      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      let expectedOutput1 = "[90mSetting up accessory: My_Switch for polling of: On timeout: 1234 interval: 99000\u001b";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      // Put back the array of Polling Characteristics
      settings.arrayOfPollingCharacteristics = [ ];

      done( );
   });

   it('cmd4Accessory characteristic polling recognizes default accessory interval/timeout.', ( done ) =>
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         Timeout:      5500,
         Interval:     44,
         On:           0,
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      const log = new Logger( );
      log.setBufferEnabled( );

      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on" } ];

      log.setDebugEnabled( );
      log.setOutputEnabled( false );
      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      let expectedOutput1 = "[90mSetting up accessory: My_Switch for polling of: On timeout: 5500 interval: 44000\u001b";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      // Put back the array of Polling Characteristics
      settings.arrayOfPollingCharacteristics = [ ];

      done( );
   });

   it('cmd4Accessory characteristic polling recognizes parent interval/timeout.', ( done ) =>
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1, "timeout": 77000, "interval": 22000 };
      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      const log = new Logger( );
      log.setBufferEnabled( );

      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on" } ];

      log.setDebugEnabled( );
      log.setOutputEnabled( false );
      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      let expectedOutput1 = "[90mSetting up accessory: My_Switch for polling of: On timeout: 77000 interval: 22000\u001b";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      // Put back the array of Polling Characteristics
      settings.arrayOfPollingCharacteristics = [ ];

      done( );
   });

   it('cmd4Accessory characteristic polling short timeout generates warning.', ( done ) =>
   {
      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         polling: [ { "characteristic": "on", "timeout":2, "interval": 99 } ],
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );

      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      let expectedOutput1 = "[90mSetting up accessory: My_Switch for polling of: On timeout: 2 interval: 99000\u001b";
      let expectedErrOuput1 = "[33mTimeout for: My_Switch is in milliseconds. A value of: 2 seems pretty low.\u001b[39m";

      assert.include( log.logBuf, expectedOutput1 , `expected stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOuput1 , `expected stderr: ${ log.errBuf }` );

      // Put back the array of Polling Characteristics
      settings.arrayOfPollingCharacteristics = [ ];

      done( );
   });

   it('Cmd4Platform starts polling of 1 characteristic.', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "My_Switch",
               DisplayName:  "My_Switch",
               StatusMsg:    true,
               Type:         "Switch",
               Cmd4_Mode:    "Polled",
               On:           0,
               polling:      [ { "characteristic": "on", "interval": 310 } ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 1, `Incorrect number of polling characteristics` );

      cmd4Platform.startPolling( );
      // Staggered Polling takes 3 seconds to start
      setTimeout( () =>
      {
         let expectedOutput1 = "[90mKicking off polling for: My_Switch On interval:310000, staggered:3000\u001b";
         let expectedOutput2 = "Started staggered kick off of 1 polled characteristics";

         assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );

         let accessory = settings.arrayOfPollingCharacteristics[0].accessory;
         Object.keys(accessory.listOfRunningPolls).forEach( (key) =>
         {
            let timer = accessory.listOfRunningPolls[ key ];
            clearTimeout( timer );
         });

         // Put back the array of Polling Characteristics
         settings.arrayOfPollingCharacteristics = [ ];

         done( );
      }, 5000);
   }).timeout(6000);
});
