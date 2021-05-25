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


function dummyCallback( )
{
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



describe('Testing Cmd4PriorityPollingQueue polling', ( ) =>
{
   before( ( ) =>
   {
      sinon.stub( process, `exit` );
   });
   after( ( ) =>
   {
      process.exit.restore( );
   });
   beforeEach( function( )
   {
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });

   afterEach( function( )
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
         Object.keys( settings.listOfCreatedPriorityQueues).forEach( ( queueName ) =>
         {
            let queue = settings.listOfCreatedPriorityQueues[ queueName ];
            let variablePollingTimer = queue.variablePollingTimer;
            if ( variablePollingTimer != null )
            {
               variablePollingTimer.stop( );
               console.log("Cancelling variablePollingTimer");
            }
            clearTimeout( queue.sanityTimer );
         });
      }
      // Put back the array of Polling Characteristics
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });

   it( "Test if Cmd4PriorityPollingQueue exists", function ( )
   {
      expect( Cmd4PriorityPollingQueue ).not.to.be.a( "null", "Cmd4PriorityPollingQueue was null" );
   });

   it( "Test creation of Default Cmd4PriorityPollingQueue", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let queueName = "Queue A";

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4PriorityPollingQueue unexpected stderr received: ${ log.errBuf }` );
      assert.equal( cmd4PriorityPollingQueue.queueName, queueName, ` Cmd4PriorityPollingQueue.queueName is incorrect` );

      assert.isFalse( cmd4PriorityPollingQueue.queueStarted, ` Cmd4PriorityPollingQueue should not be started` );
      assert.equal( cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL, constants.DEFAULT_SQUASH_TIMER_INTERVAL, ` incorrect squash timer interval` );
      assert.equal( cmd4PriorityPollingQueue.queueType, constants.DEFAULT_QUEUE_TYPE, ` incorrect default queue type` );
      assert.isFalse( cmd4PriorityPollingQueue.burstMode, `Queue should *NOT* be in burst mode` );
      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, constants.DEFAULT_QUEUE_INTERVAL, ` incorrect default queue interval` );
      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, constants.DEFAULT_BURST_GROUP_SIZE, ` incorrect default burstGroupSize` );
      assert.equal( cmd4PriorityPollingQueue.burstInterval, constants.DEFAULT_BURST_INTERVAL, ` incorrect default burstInterval` );
      assert.equal( cmd4PriorityPollingQueue.queueMsg, constants.DEFAULT_QUEUEMSG, ` incorrect default queueMsg` );
      assert.equal( cmd4PriorityPollingQueue.queueStatMsgInterval, constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL, ` incorrect default queueStatMsgInterval` );

   });

   it( "Test existiance of prioritySetValue", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );

      let queueName = "Queue A";

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
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

   });

   it( "Test existiance of priorityGetValue", function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:         "My_Switch",
            DisplayName:  "My_Switch",
            StatusMsg:    true,
            Type:         "Switch",
            QueueTypes: [{ Queue: "A", QueueType: "WoRm" }],
            Queue:        "A",
            Cmd4_Mode:    "Polled",
            On:           0,
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );



      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry, `.addLowPriorityGetPolledQueueEntry is not a function` );

      assert.isFunction( cmd4PriorityPollingQueue.priorityGetValue, `.priorityGetValue is not a function` );

   });

   it( "Test addLowPriorityGetPolledQueueEntry goes to low priority queue", function( )
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
            QueueTypes: [{ Queue: "A", QueueType: "WoRm" }],
            Queue:        "A",
            On:           0,
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry, `.addLowPriorityGetPolledQueueEntry is not a function` );

      //                                    ( accessory, accTypeEnumIndex, characteristicstring, interval, timeout )
      cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );


      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 1, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 0, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `On was not stored as a get` );


   });

   it( "Test queue interval is taken from queueInterval", function( done  )
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
            Active:       0,
            QueueTypes: [{ queue: "A", queueInterval: 4 }],
            Polling: [{ Characteristic: "On", Queue: "A", Interval: 4 },
                      { Characteristic: "Active", Queue: "A", Interval: 3 }
                     ],
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( Object.keys(settings.listOfCreatedPriorityQueues).length, 1, `Incorrect number of polling queues created` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.equal( queue.lowPriorityQueue.length, 2, `Incorrect number of low level polling characteristics` );

      assert.equal( queue.variablePollingTimer.iv, 4000, `Incorrect starting interval of queue.` );
      done();

   });
   it( "Test processEntryFromLowPriorityQueue", function( done  )
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
            Active:       0,
            Polling: [{ Characteristic: "On", Queue: "A" },
                      { Characteristic: "Active", Queue: "A" }
                     ],
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( Object.keys(settings.listOfCreatedPriorityQueues).length, 1, `Incorrect number of polling queues created` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.equal( queue.lowPriorityQueue.length, 2, `Incorrect number of low level polling characteristics` );


      let cmd4SwitchAccessory = cmd4Platform.createdCmd4Accessories[0];

      let cmd4PriorityPollingQueue = cmd4SwitchAccessory.queue;
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "Cmd4PriorityPollingQueue is not an instance of Cmd4Accessory" );

      cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );
      cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 4, `Polled Get added to low prority queue` );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.processEntryFromLowPriorityQueue( cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ] );

      setTimeout( () =>
      {
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'.\u001b[39m` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: My_Switch returned: 0` , `expected stdout: ${ log.logBuf }` );
         // Low priority queues are continious, make sure it is still the same
         assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 4, `After poll, low priority queue length should atill be the same size` );

         let entry0 = cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ];
         let entry1 = cmd4PriorityPollingQueue.lowPriorityQueue[ 1 ];

         assert.equal( entry1.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.Active, `After poll, The low priority queue should still be the same` );
         assert.equal( entry0.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `After poll, The low priority queue should still be the same` );

         assert.equal( cmd4PriorityPollingQueue.lowPriorityQueueIndex, 0, `After poll the current index should be 1` );

         done( );

      }, 1000);

   });

   // Fails because queue.priorityGetValue is to be called by the accessory
   it.skip( "Test processEntryFromHighPriorityQueue", function( done  )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

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
            Active:       0,
            Polling: [{ Characteristic: "On", Queue: "A" },
                      { Characteristic: "Active", Queue: "A" }],
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 2, `Incorrect number of polling characteristics` );

      let cmd4SwitchAccessory = cmd4Platform.createdCmd4Accessories[0];
      console.log("cmd4Platform:%s", cmd4Platform );
      console.log("cmd4SwitchAccessory:%s", cmd4SwitchAccessory );

      let cmd4PriorityPollingQueue = cmd4SwitchAccessory.queue;

      //cmd4PriorityPollingQueue.priorityGetValue(  CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_TIMEOUT, function( error, value )
      //{
      //});
      //cmd4PriorityPollingQueue.priorityGetValue(  CMD4_ACC_TYPE_ENUM.Active, constants.DEFAULT_TIMEOUT,  function( error, value )
      //{
      //});

      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `IOS Get added to high prority queue` );

      log.reset( );
      log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.queueStarted = true;
      cmd4PriorityPollingQueue.processHighPriorityGetQueue( cmd4PriorityPollingQueue.highPriorityQueue[ 0 ] );

      setTimeout( () =>
      {
         // Output for first high priority characteristic
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'\u001b[39m` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: My_Switch returned: 0` , `expected stdout: ${ log.logBuf }` );
         // Output for second high priority characteristic
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 3 )-"Active" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'Active'\u001b[39m` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: My_Switch returned: 0` , `expected stdout: ${ log.logBuf }` );
         // High priority queues have their entries removed as they are completed.
         assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 0, `After poll, high priority queue length should 1` );


      }, 3000);


      done( );

   });


   it('Cmd4Platform created pollingQueue.', ( done ) =>
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
               Polling:      [ { Characteristic: "On", Interval: 310, Queue: "A" },
                               { Characteristic: "Brightness", Queue: "A" }
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
               Polling: [{ Characteristic: "On", Queue: "A" },
                         { Characteristic: "Active", Queue: "A" }
                        ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 2, `Incorrect number of created accessories` );

      assert.equal( Object.keys(settings.listOfCreatedPriorityQueues).length, 1, `Incorrect number of polling queues created` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.equal( queue.lowPriorityQueue.length, 4, `Incorrect number of low level polling characteristics` );

      let accessory1 = cmd4Platform.createdCmd4Accessories[0];
      let accessory2 = cmd4Platform.createdCmd4Accessories[1];

      expect( accessory1 ).to.be.a.instanceOf( Cmd4Accessory, "accessory1 is not an instance of Cmd4Accessory" );
      expect( accessory2 ).to.be.a.instanceOf( Cmd4Accessory, "accessory2 is not an instance of Cmd4Accessory" );

      assert.equal( Object.keys( accessory1.listOfPollingCharacteristics).length, 2, `Incorrect number of polling characteristics for accessory1` );
      assert.equal( Object.keys( accessory2.listOfPollingCharacteristics).length, 2, `Incorrect number of polling characteristics for accessory2` );

      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A"` , `expected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Adding prioritySetValue for My_Switch characteristic: On` , `expected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Adding priorityGetValue for My_Switch characteristic: On` , `expected stdout: ${ log.logBuf }` );

      //let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      //expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      done( );
   });

   it('PollingQueue getValue.', ( done ) =>
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
               Polling:      [ { Characteristic: "On", Interval: 310, Queue: "A" },
                               { Characteristic: "Brightness", Queue: "A" }
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
               Polling: [{ Characteristic: "On", Queue: "A" },
                         { Characteristic: "Active", Queue: "A" }
                        ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 4, `Incorrect number of low priority polled characteristics` );


      //let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4SwitchAccessory = cmd4Platform.createdCmd4Accessories[1];


      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      // Add  IOS Get to start with. This will trigger queue as we had stopped it from starting
      cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_TIMEOUT, dummyCallback );
      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 5, `Set not added to high prority queue` );

      done();
   }).timeout(10000);
});

describe('Testing Cmd4PriorityPollingQueue burst', ( ) =>
{
   before( ( ) =>
   {
      sinon.stub( process, `exit` );
   });
   after( ( ) =>
   {
      process.exit.restore( );
   });
   beforeEach( function( )
   {
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });

   afterEach( function( )
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
         Object.keys( settings.listOfCreatedPriorityQueues).forEach( ( queue ) =>
         {
            let variablePollingTimer = queue.variablePollingTimer;
            if ( variablePollingTimer != null )
            {
               variablePollingTimer.stop( );
               console.log("Cancelling variablePollingTimer");
            }
            clearTimeout( queue.sanityTimer );
         });
      }

      // Put back the array of Polling Characteristics
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };

      // Resolves: node:14247) MaxListenersExceededWarning: Possible
      // EventEmitter memory leak detected. 11 didFinishLaunching listeners
      // added to [HomebridgeAPI]. Use emitter.setMaxListeners() to
      // increase limit
      _api.removeAllListeners("didFinishLaunching");
   });

   it('PollingQueue burstGroupSize can be set.', ( done ) =>
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
               QueueTypes: [{ Queue: "A", QueueType: "WoRm", BurstGroupSize: 5 }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On"  },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, 5, `Incorrect burst group size` );

      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, constants.DEFAULT_BURST_INTERVAL, `Incorrect burst interval` );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "WoRm" QueueInterval: 60000  BurstGroupSize: 5 BurstInterval: 15000 QueueMsg: false QueueStatMsgInterval: 1000`, "Polling Queue with burst created incorrectly" );

      done();
   }).timeout(10000);

   it('PollingQueue burstInterval can be set. Interval Ignored. QueueMsg unset', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "My_Light",
               DisplayName:  "My_Light",
               StatusMsg:    true,
               QueueMsg:     false,
               Type:         "Lightbulb",
               Cmd4_Mode:    "Polled",
               On:           0,
               Brightness:   100,
               QueueTypes: [{ Queue: "A", QueueType: "WoRm", BurstGroupSize: 1, BurstInterval: 5 }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On", Interval: 30 },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, 1, `Incorrect burst group size` );

      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, 5000, `Incorrect variablePollingTimer` );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "WoRm" QueueInterval: 60000  BurstGroupSize: 1 BurstInterval: 5000 QueueMsg: false QueueStatMsgInterval: 1000`, "Polling Queue with burst Interval created incorrectly" );

      assert.isTrue( cmd4PriorityPollingQueue.burstMode, `Queue should be in burst mode` );

      done();
   }).timeout(10000);

   it('PollingQueue interval can be set. burstIInterval Ignored. QueueMsg set', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "My_Light",
               DisplayName:  "My_Light",
               StatusMsg:    true,
               QueueMsg:     true,
               Type:         "Lightbulb",
               Cmd4_Mode:    "Polled",
               On:           0,
               Brightness:   100,
               QueueTypes: [{ Queue: "A", QueueType: "WoRm", QueueInterval: 26, BurstInterval: 5 }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On", Interval: 30 },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.include( log.logBuf, `[90mcalling addQueue: A type: WoRm queueInterval: 26000 burstGroupSize: 0 burstInterval: 5000 queueMsg: true queueStatMsgInterval: 1000`, "Polling Queue with burst Interval created incorrectly" );

      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, constants.DEFAULT_BURST_GROUP_SIZE, `burst group size should not be set` );

      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, 26000, `Incorrect variablePollingTimer` );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "WoRm" QueueInterval: 26000  BurstGroupSize: 0 BurstInterval: 5000 QueueMsg: true QueueStatMsgInterval: 1000`, "Polling Queue with burst Interval created incorrectly" );

      assert.isFalse( cmd4PriorityPollingQueue.burstMode, `Queue should *NOT* be in burst mode` );

      done();
   }).timeout(10000);
});

describe('Testing Cmd4PriorityPollingQueue sanity correction', ( ) =>
{
   before( ( ) =>
   {
      sinon.stub( process, `exit` );
   });
   after( ( ) =>
   {
      process.exit.restore( );
   });
   beforeEach( function( )
   {
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });

   afterEach( function( )
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

         Object.keys( settings.listOfCreatedPriorityQueues).forEach( ( queueName ) =>
         {
            let queue = settings.listOfCreatedPriorityQueues[ queueName ];
            let variablePollingTimer = queue.variablePollingTimer;
            if ( variablePollingTimer != null )
            {
               variablePollingTimer.stop( );
               console.log("Cancelling variablePollingTimer");
            }
            clearTimeout( queue.sanityTimer );
         });
      }

      // Put back the array of Polling Characteristics
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };

      // Resolves: node:14247) MaxListenersExceededWarning: Possible
      // EventEmitter memory leak detected. 11 didFinishLaunching listeners
      // added to [HomebridgeAPI]. Use emitter.setMaxListeners() to
      // increase limit
      _api.removeAllListeners("didFinishLaunching");
   });

   it('Sanity can be fixed from corrupt set.', ( done ) =>
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
               QueueTypes: [{ Queue: "A", QueueType: "Sequential" }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On"  },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      process.on('warning', e => console.warn(e.stack));

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );


      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "Sequential" QueueInterval: 60000  BurstGroupSize: 0 BurstInterval: 15000 QueueMsg: false QueueStatMsgInterval: 1000` );

      // Set polling timer long so it does not happen at all
      cmd4PriorityPollingQueue.variablePollingTimer.iv = 3000;

      // Set sanity timer short so it happens now
      cmd4PriorityPollingQueue.SANITY_TIMER_INTERVAL = 1000;

      log.logBuf = "";
      log.errBuf = "";

      // Start polling
      cmd4PriorityPollingQueue.startQueue( cmd4PriorityPollingQueue );

      assert.include( log.logBuf, `[90menablePolling first time true queue.safeToDoPollingNow: false, queue.safeToDoPollingFlag: false`, `polling not started` );

      assert.include( log.logBuf, `Starting polling interval timer for the first time with interval: ${ cmd4PriorityPollingQueue.variablePollingTimer.iv }`, `Polling interval timer not started` );

      assert.isTrue( cmd4PriorityPollingQueue.safeToDoPollingFlag, `safeToDoPollingFlag not set` );

      // Corrupt thw queue with a hanging set
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Reset the log
      log.logBuf = "";
      log.errBuf = "";

      // capture the sanity timer firing the first time
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `inProgressSets: 1 inProgressGets: 0 queueStarted: true lowQueueLen: 2 hiQueueLen: 0 safeToDoPollingFlag: true interval: ${ cmd4PriorityPollingQueue.variablePollingTimer.iv } variablePollingTimer:`, `Sanity timer did not fire` );

         assert.include( log.logBuf, `[90mSanity Timer Fixing Polling !!!  safeToDoPollingFlag: true inProgressSets: 1 inProgressGets: 0 queue.variablePollingTimer.iv: ${ cmd4PriorityPollingQueue.variablePollingTimer.iv }`, `Sanity timer did not fire` );

         // Wait for next process of queue
         setTimeout( ( ) =>
         {
            assert.include( log.logBuf, `Proccessing low priority queue entry: 105`, `Polling interval timer not started` );

            assert.include( log.logBuf, `getValue: accTypeEnumIndex:( 105 )-"On" function for: My_Light cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Light' 'On'.`, `Polling did not resume` );

            cmd4PriorityPollingQueue.variablePollingTimer.stop( );
            clearTimeout( cmd4PriorityPollingQueue.sanityTimer );

            done();

         }, cmd4PriorityPollingQueue.variablePollingTimer.iv );

      }, cmd4PriorityPollingQueue.SANITY_TIMER_INTERVAL );
   }).timeout(10000);

   it('PollingQueue burst interval can be set.', ( done ) =>
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
               QueueTypes: [{ Queue: "A", QueueType: "WoRm", BurstGroupSize: 1, BurstInterval: 5 }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On"  },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.isTrue( cmd4PriorityPollingQueue.burstMode, `Queue should be in burst mode` );

      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, 1, `Incorrect burst group size` );

      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, 5000, `Incorrect burst interval` );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "WoRm" QueueInterval: 60000  BurstGroupSize: 1 BurstInterval: 5000 QueueMsg: false QueueStatMsgInterval: 1000`, "Polling Queue with burst Interval created incorrectly" );

      done();
   }).timeout(10000);

   it('PollingQueue queueMsg queueStatMsgInterval can be set.', ( done ) =>
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
               QueueTypes: [{ Queue: "A", QueueType: "WoRm", BurstGroupSize: 1, BurstInterval: 5, queueMsg: true, queueStatMsgInterval:1234 }],
               Queue:        "A",
               Polling:      [ { Characteristic: "On"  },
                               { Characteristic: "Brightness"  }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Incorrect number of low priority polled characteristics` );

      assert.isTrue( cmd4PriorityPollingQueue.burstMode, `Queue should be in burst mode` );

      assert.equal( cmd4PriorityPollingQueue.burstGroupSize, 1, `Incorrect burst group size` );

      assert.equal( cmd4PriorityPollingQueue.variablePollingTimer.iv, 5000, `Incorrect burst interval` );

      assert.equal( cmd4PriorityPollingQueue.queueMsg, true, `Incorrect queueMsg` );
      assert.include( log.logBuf, `[90mcalling addQueue: A type: WoRm queueInterval: 60000 burstGroupSize: 1 burstInterval: 5000 queueMsg: true queueStatMsgInterval: 1234`, "Polling Queue with queueStatMsgInterval created incorrectly" );

      assert.include( log.logBuf, `Creating new Priority Polled Queue "A" with QueueType of: "WoRm" QueueInterval: 60000  BurstGroupSize: 1 BurstInterval: 5000 QueueMsg: true QueueStatMsgInterval: 1234`, "Polling Queue with burst Interval created incorrectly" );

      assert.equal( cmd4PriorityPollingQueue.queueStatMsgInterval, 1234, `Incorrect queueStatMsgInterval` );

      done();
   }).timeout(10000);
});

describe('Testing Cmd4PriorityPollingQueue squashError', ( ) =>
{
   it( "Test Cmd4PriorityPollingQueue.squashError exists", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );

      let queueName = "Queue A";

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );

      assert.isFunction( cmd4PriorityPollingQueue.squashError, `.squashError is not a function` );

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4PriorityPollingQueue unexpected stderr received: ${ log.errBuf }` );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError exists", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );

      let queueName = "Queue A";

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );
   });

});
// Skipped as squashError temporarily removed
describe.skip('Testing Cmd4PriorityPollingQueue squashError', ( ) =>
{
   let log = new Logger( );
   log.setBufferEnabled( );
   log.setOutputEnabled( false );
   log.setDebugEnabled( );

   let queueName = "Queue A";

   let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );
   afterEach( function( )
   {
      Object.keys( cmd4PriorityPollingQueue.squashList).forEach( ( error ) =>
      {
         let entry = cmd4PriorityPollingQueue.squashList[ error ];
         // console.log( "Cancelling timer" );
         if ( entry != undefined )
            clearTimeout( entry.errTimer );
      });

      cmd4PriorityPollingQueue.squashList = { };
      cmd4PriorityPollingQueue.log.reset( );
      log.setOutputEnabled( false );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError outputs 1 message", function( done )
   {
      let errNo = constants.ERROR_NULL_REPLY;
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo, "test message" );

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 1, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

      done( );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError outputs 1 message of the same type in < 5 min ", function( done )
   {
      let errNo = constants.ERROR_NULL_REPLY;
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo, "test message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo, "test message" );


      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 1, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

      done( );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError outputs 2 message of different types in < 5 min ", function( done )
   {
      let errNo1 = constants.ERROR_NULL_REPLY;
      let errNo2 = constants.ERROR_EMPTY_STRING_REPLY;
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo2, "Second message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo2, "Second message" );


      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.include( log.errBuf, `[31mSecond message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

      let entry = cmd4PriorityPollingQueue.squashList[ errNo1 ];
      assert.equal( entry.errCount, 2, ` Cmd4PriorityPollingQueue expected two counts of error message ${ entry.errCount }` );


      done( );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError outputs timed message ", function( done )
   {
      let errNo1 = constants.ERROR_NULL_REPLY;
      // Set to 3 seconds for quick testing
      cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL = 500;
      for ( let i = 0; i < 10; i++ )
         cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );


      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf,  `[31mThis message has been omitted 9 times => test message`, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

         assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

         done( );
      }, 700);
   }).timeout(1000);

   it( "Test Cmd4PriorityPollingQueue.squashError invalid error ", function( done )
   {
      let errNo1 = -355;
      // Set to 3 seconds for quick testing
      cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL = 500;
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );


      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mUnhandled error: -355 errMsg: test message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

      assert.equal( log.errLineCount, 1, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

      done( );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError restarts timed message ", function( done )
   {
      let errNo1 = constants.ERROR_NULL_REPLY;
      // Set to 3 seconds for quick testing
      cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL = 500;
      for ( let i = 0; i < 10; i++ )
         cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf, `[31mThis message has been omitted 9 times => test message`, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

         assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

         // Do it again
         log.reset( );

         for ( let i = 0; i < 10; i++ )
            cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message2" );

         assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31mtest message2`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

         setTimeout( () =>
         {
            assert.include( log.errBuf, `[31mThis message has been omitted 9 times => test message`, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

            assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

            done( );
         }, 700);

      }, 700);
   }).timeout(2000);

   it( "Test Cmd4PriorityPollingQueue.squashError debug message ", function( done )
   {
      log.setDebugEnabled( true );
      let errNo1 = constants.ERROR_NULL_REPLY;
      // Set to 3 seconds for quick testing
      cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL = 500;
      for ( let i = 0; i < 10; i++ )
         cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );


      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf, `[31mThis message has been omitted 9 times => test message`, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

         assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

         // Do it again
         log.reset( );

         for ( let i = 0; i < 10; i++ )
            cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message2" );

         assert.include( log.errBuf, `[31mtest message2`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

         setTimeout( () =>
         {
            assert.include( log.errBuf, `[31mThis message has been omitted 9 times => test message`, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

            assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

            done( );
         }, 700);

      }, 700);
   }).timeout(2000);

   it( "Test Cmd4PriorityPollingQueue.squashError occurs once in 5 min ", function( done )
   {
      log.setDebugEnabled( true );
      let errNo1 = constants.ERROR_NULL_REPLY;
      // Set to 3 seconds for quick testing
      cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL = 500;
         cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message" );


      assert.include( log.errBuf, `[31mtest message`, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      log.reset( );
      setTimeout( () =>
      {
         assert.equal( log.errBuf, "", ` Cmd4PriorityPollingQueue Unexpected stderr: ${ log.errBuf }` );

         done( );

      }, 700);
   }).timeout(2000);
});
