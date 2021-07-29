#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4PriorityPollingQueue = require( "../Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;




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
   beforeEach(function( )
   {
      settings.defaultQueue = null;
      settings.listOfCreatedPriorityQueues = { };
   });
   afterEach(function( )
   {
      if (this.currentTest.state == 'failed')
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
         });
      }
      // Put back the polling queues
      settings.defaultQueue = null;
      settings.listOfCreatedPriorityQueues = { };
   });
   let cmd4Accessory;

   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory has default polling messages", function( done )
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                     true,
         Type:                         "Switch",
         On:                            0,
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.include( log.logBuf, "[90mPolling config is Default Polling. Nothing to check for unset polling characteristics\u001b" , `Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, "[90mSetting up which characteristics will be polled for My_Switch\u001b" , `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      done( );
   });


   it('cmd4Accessory determineCharacteristicsToPollForAccessory works for non queued polling characteristics.', ( done ) =>
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                    true,
         Type:                         "Switch",
         On:                           0,
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on", "timeout":3000, "interval": 1 } ];

      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );
      assert.equal( Object.keys(cmd4Accessory.listOfPollingCharacteristics).length, 1, `Incorrect number of listOfPollingCharacteristics` );

      let queue = settings.listOfCreatedPriorityQueues[ "Q:My_Switch" ];
      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "defaultQueue is not an instance of Cmd4PriorityPollingQueue" );
      assert.equal( queue.lowPriorityQueue.length, 1, `Incorrect number of lowPriorityQueue Entries` );


      assert.include( log.logBuf, `[90mSetting up accessory: My_Switch for polling of: On timeout: 3000 interval: 1000 queueName: "Q:My_Switch"\u001b` , `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      done( );
   });

   it('cmd4Accessory characteristic polling interval/timeout changes recognized.', ( done ) =>
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                    true,
         Type:                         "Switch",
         On:                           0,
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on", "timeout":1234, "interval": 99 } ];

      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );


      assert.include( log.logBuf, `[90mSetting up accessory: My_Switch for polling of: On timeout: 1234 interval: 99000 queueName: "Q:My_Switch"\u001b` , `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      done( );
   });

   it('cmd4Accessory characteristic polling recognizes default accessory interval/timeout.', ( done ) =>
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                    true,
         Type:                         "Switch",
         Timeout:                      5500,
         Interval:                     44,
         On:                           0,
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on" } ];

      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );


      assert.include( log.logBuf, `[90mSetting up accessory: My_Switch for polling of: On timeout: 5500 interval: 44000 queueName: "Q:My_Switch"\u001b` , `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      done( );
   });

   it('cmd4Accessory characteristic polling recognizes parent interval/timeout.', ( done ) =>
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                    true,
         Type:                         "Switch",
         On:                           0,
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1, "timeout": 77000, "interval": 22000 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      cmd4Accessory["polling"] = [ { "characteristic": "on" } ];

      cmd4Accessory.determineCharacteristicsToPollForAccessory( cmd4Accessory );


      assert.include( log.logBuf, `[90mSetting up accessory: My_Switch for polling of: On timeout: 77000 interval: 22000 queueName: "Q:My_Switch"\u001b` , `Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "" , `Unexpected stderr: ${ log.errBuf }` );

      done( );
   });

   it('cmd4Accessory characteristic polling short timeout generates warning.', ( done ) =>
   {
      let config =
      {
         Name:                         "My_Switch",
         DisplayName:                  "My_Switch",
         StatusMsg:                    true,
         Type:                         "Switch",
         On:                           0,
         polling:                      [ { "characteristic": "on", "timeout":2, "interval": 99 } ],
         State_cmd:                    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      cmd4Accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.include( log.logBuf, `[90mSetting up accessory: My_Switch for polling of: On timeout: 2 interval: 99000 queueName: "Q:My_Switch"` , `Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mTimeout for: My_Switch is in milliseconds. A value of: 2 seems pretty low.\u001b[39m` , `Incorrect stderr: ${ log.errBuf }` );

      done( );
   });

   it('Cmd4Platform starts polling of 1 characteristic.', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                 true,
            Type:                      "Switch",
            On:                        0,
            polling:                   [ { "characteristic": "on", "interval": 310 } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( Object.keys(settings.listOfCreatedPriorityQueues).length, 1, `Incorrect number of listOfCreatedPriorityPollingQueues` );

      let queue = settings.listOfCreatedPriorityQueues[ "Q:My_Switch" ];
      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "defaultQueue is not an instance of Cmd4PriorityPollingQueue" );
      assert.equal( queue.lowPriorityQueue.length, 1, `Incorrect number of lowPriorityQueue Entries` );


      // For unit testing, start te polling now
      cmd4Platform.startPolling( 0 );

      // Staggered Polling takes 3 seconds to start
      setTimeout( () =>
      {

         assert.include( log.logBuf, `[90mKicking off polling for: My_Switch On interval:310000, staggered:3000\u001b` , `Incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, "Started staggered kick off of 1 polled characteristics" , `Incorrect stdout: ${ log.logBuf }` );


         // Clear any timers created for any polling queue
         Object.keys(settings.listOfCreatedPriorityQueues).forEach( (queueName) =>
         {
            let queue = settings.listOfCreatedPriorityQueues[ queueName ];
            Object.keys(queue.listOfRunningPolls).forEach( (key) =>
            {
               let timer = queue.listOfRunningPolls[ key ];
               clearTimeout( timer );
            });
         });

         done( );

      }, 6000);
   }).timeout(7000);
});
