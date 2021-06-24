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

// Taken from https://stackoverflow.com/questions/11731072/dividing-an-array-by-filter-function
//function partition(array, predicate)
//{
//   return array.reduce( ( acc, item ) => ( acc[+!predicate( item )].push( item ), acc ), [ [], [] ] );
//}

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



describe('Testing Cmd4Platform Cmd4Mode gets passed to accessories', ( ) =>
{
   before( ( ) =>
   {
      sinon.stub( process, `exit` );
   });
   after( ( ) =>
   {
      process.exit.restore( );
   });

   beforeEach(function( )
   {
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });
   afterEach(function( )
   {
      if (this.currentTest.state == 'failed')
      {
         if ( settings.arrayOfAllStaggeredPollingCharacteristics.length > 0 )
         {
            let accessory = settings.arrayOfAllStaggeredPollingCharacteristics[0].accessory;
            console.log(`Cancelling timers for FAILED TEST OF ${ accessory.displayName }`);
            Object.keys(accessory.listOfRunningPolls).forEach( (key) =>
            {
               let timer = accessory.listOfRunningPolls[ key ];
               clearTimeout( timer );
            });
         }
      }

   });

   it( "Test if Cmd4Platform exists", function ( )
   {
      expect( Cmd4Platform ).not.to.be.a( "null", "Cmd4Platform was null" );
   });

   it( "Test creation of Cmd4Platform", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "My_Light",
               DisplayName:  "My_Light",
               StatusMsg:    true,
               Type:         "Lightbulb",
               Cmd4_Mode:    "Polled",
               On:           0,
               Brightness:   100,
               polling:      [ { "characteristic": "on", "interval": 310, "queue": "A" },
                               { "characteristic": "brightness", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               Name:         "My_Switch",
               DisplayName:  "My_Switch",
               StatusMsg:    true,
               Type:         "Switch",
               Cmd4_Mode:    "Polled",
               On:           0,
               Active:       0,
               polling: [{ "characteristic": "On", "queue": "A" },
                         { "characteristic": "Active", "queue": "A" }
                        ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );

      done( );
   });

   it('Test if Cmd4Platform creates a platform accessory', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               Cmd4_Mode:    "Polled",
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let expectedOutput1 = `Adding new platformAccessory: My_Door`;
      let expectedOutput2 = `35mConfiguring platformAccessory: \u001b[39mMy_Door`;

      assert.include( log.logBuf, expectedOutput1, ` Cmd4Platform missing message of new platform accessory being created` );
      assert.include( log.logBuf, expectedOutput2, ` Cmd4Platform missing message of Configuring platform accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      assert.equal( cmd4Accessory.CMD4, constants.PLATFORM, ` Created accessory was not a PLATFORM accessory` );

      done( );
   });

   it('Test if Cmd4Mode gets passed down to the accessory', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.cmd4Mode, constants.CMD4_MODE_POLLED, ` Created accessory has incorrect CMD4_MODE` );

      done( );
   });

   it('Test if QueueMsg, QueueStatMsgInterval gets passed down to the accessory', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         QueueMsg:      true,
         QueueStatMsgInterval:  1200,
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.queueMsg, true, ` Created accessory has incorrect QueueMsg` );
      assert.equal( cmd4Accessory.queueStatMsgInterval, 1200, ` Created accessory has incorrect QueueStatMsgInterval` );

      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( queue.queueMsg, true, ` Created queue has incorrect QueueMsg` );
      assert.equal( queue.queueStatMsgInterval, 1200, ` Created queue has incorrect QueueStatMsgInterval` );

      done( );
   });

   it('Test if OutputConstants, QueueMsg, QueueStatMsgInterval are used from the accessory', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         OutputConstants:    true,
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               QueueMsg:      true,
               QueueStatMsgInterval:  1400,
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      assert.equal( cmd4Platform.outputConstants, true, ` Created Platform has incorrect OutputConstants` );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.queueMsg, true, ` Created accessory has incorrect QueueMsg` );
      assert.equal( cmd4Accessory.queueStatMsgInterval, 1400, ` Created accessory has incorrect QueueStatMsgInterval` );
      assert.equal( cmd4Accessory.outputConstants, true, ` Created Accessory has incorrect OutputConstants` );

      done( );
   });

   it('Test if interval, timeout, outputConstants, stateChangeResponseTime are used from the platform', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         timeout:    12345,
         interval:    12,
         stateChangeResponseTime:    18,
         outputConstants:    true,
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               QueueMsg:      true,
               QueueStatMsgInterval:  1400,
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( Object.keys( cmd4Accessory.listOfPollingCharacteristics ).length, 3, `Incorret number of polling characteristics` );

      assert.equal( cmd4Accessory.timeout, 12345, `Timeout was not passed down to accessory` );
      assert.equal( cmd4Accessory.interval, 12000, `Interval was not passed down to accessory` );
      assert.equal( cmd4Accessory.stateChangeResponseTime, 18000, `stateChangeResponseTime was not passed down to accessory` );
      assert.equal( cmd4Accessory.outputConstants, true, `outputConstants was not passed down to accessory` );

      Object.keys( cmd4Accessory.listOfPollingCharacteristics ).forEach( ( key ) =>
      {
         let entry = cmd4Accessory.listOfPollingCharacteristics[ key ];
         assert.equal( entry.timeout, 12345, `Timeout was not passed down to polling entry` );
         assert.equal( entry.interval, 12000, `Interval was not passed down to polling entry` );
         assert.equal( entry.stateChangeResponseTime, 18000, `stateChangeResponseTime was not passed down to polling entry` );
      });

      done( );
   });

   it('Test outputConstants, stateChangeResponseTime are used from the accessory definition', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         timeout:    12345,
         interval:    12,
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               OutputConstants: true,
               QueueMsg:      true,
               QueueStatMsgInterval:  1400,
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      assert.equal( cmd4Platform.outputConstants, false, ` Created Platform has incorrect OutputConstants` );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( Object.keys( cmd4Accessory.listOfPollingCharacteristics ).length, 3, `Incorret number of polling characteristics` );

      assert.equal( cmd4Accessory.timeout, 12345, `Timeout was not passed down to accessory` );
      assert.equal( cmd4Accessory.interval, 12000, `Interval was not passed down to accessory` );
      assert.equal( cmd4Accessory.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );
      assert.equal( cmd4Accessory.outputConstants, true, ` Created Accessory has incorrect OutputConstants` );

      Object.keys( cmd4Accessory.listOfPollingCharacteristics ).forEach( ( key ) =>
      {
         let entry = cmd4Accessory.listOfPollingCharacteristics[ key ];
         assert.equal( entry.timeout, 12345, `Timeout was not passed down to polling entry` );
         assert.equal( entry.interval, 12000, `Interval was not passed down to polling entry` );
         assert.equal( entry.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );
      });

      done( );
   });

   it('Test stateChangeResponseTime default is used for PriorityQueuedPolling', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         timeout:    12345,
         interval:    12,
         accessories: [
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               QueueMsg:      true,
               QueueStatMsgInterval:  1400,
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( Object.keys( cmd4Accessory.listOfPollingCharacteristics ).length, 3, `Incorret number of polling characteristics` );

      assert.equal( cmd4Accessory.timeout, 12345, `Timeout was not passed down to accessory` );
      assert.equal( cmd4Accessory.interval, 12000, `Interval was not passed down to accessory` );
      assert.equal( cmd4Accessory.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );

      Object.keys( cmd4Accessory.listOfPollingCharacteristics ).forEach( ( key ) =>
      {
         let entry = cmd4Accessory.listOfPollingCharacteristics[ key ];
         assert.equal( entry.timeout, 12345, `Timeout was not passed down to polling entry` );
         assert.equal( entry.interval, 12000, `Interval was not passed down to polling entry` );
         assert.equal( entry.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );
      });

      done( );
   });

   it('Test Cmd4Platform divies queues from staggered polling', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         timeout:    12345,
         interval:    12,
         accessories: [
            {
               Name:         "My_Switch",
               DisplayName:  "My_Switch",
               Type:         "Switch",
               On:            0,
               polling:      [ { "characteristic": "On" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               Name:         "My_Door",
               DisplayName:  "My_Door",
               StatusMsg:    true,
               Type:         "Door",
               QueueMsg:      true,
               QueueStatMsgInterval:  1400,
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition", "queue": "A" },
                               { "characteristic": "TargetPosition", "queue": "A" },
                               { "characteristic": "PositionState", "queue": "A" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }


      let cmd4Platform = new Cmd4Platform( null, platformConfig, _api );
      let log = cmd4Platform.log;
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 2, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory1 = cmd4Platform.createdCmd4Accessories[0];
      let cmd4Accessory2 = cmd4Platform.createdCmd4Accessories[1];

      assert.equal( Object.keys( cmd4Accessory1.listOfPollingCharacteristics ).length, 1, `Incorret number of polling characteristics for accessory 1` );
      assert.equal( Object.keys( cmd4Accessory2.listOfPollingCharacteristics ).length, 3, `Incorret number of polling characteristics for accessory 2` );

      assert.equal( settings.arrayOfAllStaggeredPollingCharacteristics.length, 1, `Incorret number of staggered characteristics` );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      // Low priority queues are continious, make sure it is put back
      assert.equal( queue.lowPriorityQueue.length, 3, `low priority queue should init to size 3` );

      done( );
   });
});
