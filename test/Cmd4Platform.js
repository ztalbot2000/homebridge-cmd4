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
function partition(array, predicate)
{
   return array.reduce( ( acc, item ) => ( acc[+!predicate( item )].push( item ), acc ), [ [], [] ] );
}

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
         }
      }

      // Put back the array of Polling Characteristics
      settings.listOfCreatedPriorityQueues = { };
      settings.arrayOfPollingCharacteristics = [ ];
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      assert.equal( "", this.log.logBuf, ` Cmd4Platform unexpected stdout received: ${ this.log.logBuf }` );
      assert.equal( "", this.log.errBuf, ` Cmd4Platform unexpected stderr received: ${ this.log.errBuf }` );

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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let expectedOutput1 = `Adding new platformAccessory: My_Door`;
      let expectedOutput2 = `35mConfiguring platformAccessory: \u001b[39mMy_Door`;

      assert.include( this.log.logBuf, expectedOutput1, ` Cmd4Platform missing message of new platform accessory being created` );
      assert.include( this.log.logBuf, expectedOutput2, ` Cmd4Platform missing message of Configuring platform accessory` );

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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.cmd4Mode, constants.CMD4_MODE_POLLED, ` Created accessory has incorrect CMD4_MODE` );

      done( );
   });

   it('Test if QueueMsg & QueueStatMsgInterval gets passed down to the accessory', ( done ) =>
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.queueMsg, true, ` Created accessory has incorrect QueueMsg` );
      assert.equal( cmd4Accessory.queueStatMsgInterval, 1200, ` Created accessory has incorrect QueueStatMsgInterval` );

      done( );
   });

   it('Test if QueueMsg & QueueStatMsgInterval are used from the accessory', ( done ) =>
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.queueMsg, true, ` Created accessory has incorrect QueueMsg` );
      assert.equal( cmd4Accessory.queueStatMsgInterval, 1400, ` Created accessory has incorrect QueueStatMsgInterval` );

      done( );
   });

   it('Test if interval, timeout, stateChangeResponseTime are used from the platform', ( done ) =>
   {
      let platformConfig =
      {
         Cmd4_Mode:    "Polled",
         timeout:    12345,
         interval:    12,
         stateChangeResponseTime:    18,
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( settings.arrayOfPollingCharacteristics.length, 3, `Incorret number of polling characteristics` );

      assert.equal( cmd4Accessory.timeout, 12345, `Timeout was not passed down to accessory` );
      assert.equal( cmd4Accessory.interval, 12000, `Interval was not passed down to accessory` );
      assert.equal( cmd4Accessory.stateChangeResponseTime, 18000, `stateChangeResponseTime was not passed down to accessory` );

      settings.arrayOfPollingCharacteristics.forEach( ( entry ) =>
      {
         assert.equal( entry.timeout, 12345, `Timeout was not passed down to polling entry` );
         assert.equal( entry.interval, 12000, `Interval was not passed down to polling entry` );
         assert.equal( entry.stateChangeResponseTime, 18000, `stateChangeResponseTime was not passed down to polling entry` );
      });

      done( );
   });

   it('Test stateChangeResponseTime are used from the accessory definition', ( done ) =>
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( settings.arrayOfPollingCharacteristics.length, 3, `Incorret number of polling characteristics` );

      assert.equal( cmd4Accessory.timeout, 12345, `Timeout was not passed down to accessory` );
      assert.equal( cmd4Accessory.interval, 12000, `Interval was not passed down to accessory` );
      assert.equal( cmd4Accessory.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );

      settings.arrayOfPollingCharacteristics.forEach( ( entry ) =>
      {
         assert.equal( entry.timeout, 12345, `Timeout was not passed down to polling entry` );
         assert.equal( entry.interval, 12000, `Interval was not passed down to polling entry` );
         assert.equal( entry.stateChangeResponseTime, constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not passed from CMD4_DEVICE_TYPE_ENUM` );
      });

      done( );
   });

   it('Test Cmd4Platform divies queus from staggered polling', ( done ) =>
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 2, ` Cmd4Platform did not create the cmd4Accessory` );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 4, `Incorret number of polling characteristics` );

      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      // Low priority queues are continious, make sure it is put back
      assert.equal( queue.lowPriorityQueue.length, 3, `low priority queue should init to size 3` );

      let one = [];
      let two = [];
      [ one,
        two] = partition(settings.arrayOfPollingCharacteristics, i => i.queueName === constants.DEFAULT_QUEUE_NAME);

      // Check split is correct.
      assert.equal( one.length, 1, `partition of inclusion should be size 1` );
      assert.equal( two.length, 3, `partition of exclusion should be size 3` );


      done( );
   });
});
