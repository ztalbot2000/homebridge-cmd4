#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4PriorityPollingQueue = require( "../Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;


// Duplicated from Cmd4PriorityPollingQueue.js
let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
//let LOW_PRIORITY_GET = 2;


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
   // So we can cancel any timers
   let cmd4PriorityPollingQueue;

   before( ( ) =>
   {
      sinon.stub( process, `exit` );

      cleanStatesDir();
   });
   after( ( ) =>
   {
      process.exit.restore( );

      // MaxListenersExceededWarning: Possible EventEmitter memory leak detected
      _api.removeAllListeners();
   });
   beforeEach( function( )
   {
      settings.defaultQueue = null;
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
      });

      // Put back the polling queues
      settings.defaultQueue = null;
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

      cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4PriorityPollingQueue unexpected stderr received: ${ log.errBuf }` );
      assert.equal( cmd4PriorityPollingQueue.queueName, queueName, ` Cmd4PriorityPollingQueue.queueName is incorrect` );

      assert.isFalse( cmd4PriorityPollingQueue.queueStarted, ` Cmd4PriorityPollingQueue should not be started` );
      assert.equal( cmd4PriorityPollingQueue.queueType, constants.DEFAULT_QUEUE_TYPE, ` incorrect default queue type` );
      assert.equal( cmd4PriorityPollingQueue.pauseTimer, null, ` incorrect queue pauseTimer ` );
      assert.equal( cmd4PriorityPollingQueue.pauseTimerTimeout, constants.DEFAULT_QUEUE_PAUSE_TIMEOUT, ` incorrect queue pauseTimer interval` );
      assert.equal( cmd4PriorityPollingQueue.queueMsg, constants.DEFAULT_QUEUEMSG, ` incorrect default queueMsg` );
      assert.equal( cmd4PriorityPollingQueue.queueStatMsgInterval, constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL, ` incorrect default queueStatMsgInterval` );

   });

   it( "Test existance of prioritySetValue", function( )
   {
      let queueName = "Queue A";

      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                 true,
            Type:                      "Switch",
            On:                        0,
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

   });

   it( "Test existance of priorityGetValue", function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            QueueTypes:                [{ Queue: "A", QueueType: "WoRm" }],
            Queue:                     "A",
            On:                         0,
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            QueueTypes:                [{ Queue: "A", QueueType: "WoRm" }],
            Queue:                     "A",
            On:                         0,
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                 true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            QueueTypes:                [{ queue: "A", queueInterval: 4 }],
            Polling:                   [{ Characteristic: "On", Queue: "A", Interval: 4 },
                                        { Characteristic: "Active", Queue: "A", Interval: 3 }],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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

      assert.equal( queue.pauseTimerTimeout, 10*1000, `Incorrect queue pauseTimer.` );
      done();

   });

   it( "Test processEntryFromLowPriorityQueue", function( done  )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            Polling:                   [{ Characteristic: "On", Queue: "A" },
                                        { Characteristic: "Active", Queue: "A" }],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'\u001b[39m` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: My_Switch returned: 1` , `expected stdout: ${ log.logBuf }` );
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

   it('Cmd4Platform created pollingQueue.', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                  true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                       { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         },
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                 true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            Polling:                    [{ Characteristic: "On", Queue: "A" },
                                         { Characteristic: "Active", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

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
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                  true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         },
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            Polling:                   [{ Characteristic: "On", Queue: "A" },
                                        { Characteristic: "Active", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

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

describe('Testing Cmd4PriorityPollingQueue recovery correction', ( ) =>
{
   // So we can cancel any timers
   let cmd4PriorityPollingQueue;

   before( ( ) =>
   {
      sinon.stub( process, `exit` );

      cleanStatesDir();

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
      settings.defaultQueue = null;
      settings.listOfCreatedPriorityQueues = { };

   });

   it( `Test Cmd4PriorityPollingQueue queue can be started`, function( done )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let queueName = "Queue A";

      cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( log, queueName );
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );

      cmd4PriorityPollingQueue.startQueue( cmd4PriorityPollingQueue );


      assert.include( log.logBuf, `[90menablePolling for the first time`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );
      assert.equal( log.errBuf, ``, ` Cmd4PriorityPollingQueue Unexpected stderr received: ${ log.errBuf }` );


      done( );
   });

   it( `Test Cmd4PriorityPollingQueue adds an entry to the highPriorityQueue`, function( done )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                  true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" }
                                       ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[33mAdding prioritySetValue for My_Light characteristic: On`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

      // Set to a large amount so it does not happen
      cmd4PriorityPollingQueue.recoveryTimerInterval = 500000;

      // Fake the queue to be blocked
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 22, dummyCallback );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 1, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 0 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.Brightness, `Incorrect accTypeEnumIndex in entry` );
      assert.equal( entry.isSet, true, `Incorrect isSet in entry` );
      assert.equal( entry.characteristicString, "Brightness", `Incorrect isSet in entry` );
      assert.equal( entry.value, 22, `Incorrect value in entry` );

      done();

   });

   it( `Test Cmd4PriorityPollingQueue adds multiple entries to the highPriorityQueue`, function( done )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                  true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[33mAdding prioritySetValue for My_Light characteristic: On`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

      // Set to a large amount so it does not happen
      cmd4PriorityPollingQueue.recoveryTimerInterval = 500000;

      // Fake the queue to be blocked
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 22, dummyCallback );

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
                            .characteristic ).setValue( 0, dummyCallback );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 1 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `Incorrect accTypeEnumIndex in entry` );
      assert.equal( entry.isSet, true, `Incorrect isSet in entry` );
      assert.equal( entry.characteristicString, "On", `Incorrect isSet in entry` );
      assert.equal( entry.value, 0, `Incorrect value in entry` );

      done();

   });

   it( `Test Cmd4PriorityPollingQueue Adds "Set" after existing "set" in queue`, function( done )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                  true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[33mAdding prioritySetValue for My_Light characteristic: On`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

      // Set to a large amount so it does not happen
      cmd4PriorityPollingQueue.recoveryTimerInterval = 500000;

      // Fake the queue to be blocked
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 22, dummyCallback );

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
                            .characteristic ).setValue( 1, dummyCallback );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 1 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `Incorrect accTypeEnumIndex in entry` );
      assert.equal( entry.isSet, true, `Incorrect isSet in entry` );
      assert.equal( entry.characteristicString, "On", `Incorrect isSet in entry` );
      assert.equal( entry.value, true, `Incorrect value in entry` );

      done();

   });

   it( `Test Cmd4PriorityPollingQueue Adds "Get" after existing "set" in queue`, function( done )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                 true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[33mAdding prioritySetValue for My_Light characteristic: On`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

      // Set to a large amount so it does not happen
      cmd4PriorityPollingQueue.recoveryTimerInterval = 500000;

      // Fake the queue to be blocked
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 22, dummyCallback );

      // Call the getValue bound function, which is priorrityGetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
                            .characteristic ).getValue( dummyCallback );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 1 ];

      // Even though the "Get" was added second, the next "Set" gets put before it
      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `Incorrect accTypeEnumIndex in entry` );
      assert.equal( entry.isSet, false, `Incorrect isSet in entry` );
      assert.equal( entry.characteristicString, "On", `Incorrect isSet in entry` );

      done();

   });

   it( `Test Cmd4PriorityPollingQueue same "Set" replaces old in queue`, function( done )
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Light",
            DisplayName:               "My_Light",
            StatusMsg:                 true,
            Type:                      "Lightbulb",
            On:                         0,
            Brightness:                 100,
            Polling:                   [ { Characteristic: "On", Interval: 310, Queue: "A" },
                                         { Characteristic: "Brightness", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[33mAdding prioritySetValue for My_Light characteristic: On`, `Cmd4PriorityPollingQueue expected stdout received: ${ log.logBuf }` );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );

      assert.isFunction( cmd4PriorityPollingQueue.prioritySetValue, `.prioritySetValue is not a function` );

      // Set to a large amount so it does not happen
      cmd4PriorityPollingQueue.recoveryTimerInterval = 5000000;

      // Fake the queue to be blocked
      cmd4PriorityPollingQueue.inProgressSets = 1;

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 22, dummyCallback );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 1, `Polled Get added to high prority queue` );

      // Call the getValue bound function, which is priorrityGetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
                            .characteristic ).getValue( dummyCallback );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `Polled Get added to high prority queue` );

      // Call the setValue bound function, which is priorritySetValue
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
                            .characteristic ).setValue( 1, dummyCallback );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 3, `Polled Get added to high prority queue` );

      // This setValue should replace the first
      cmd4LightAccessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Brightness ]
                            .characteristic ).setValue( 30, dummyCallback );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 3, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 0 ];

      // Check that the entry was replaced at queue index 0.
      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.Brightness, `Incorrect accTypeEnumIndex in entry` );
      assert.equal( entry.isSet, true, `Incorrect isSet in entry` );
      assert.equal( entry.characteristicString, "Brightness", `Incorrect isSet in entry` );
      assert.equal( entry.value, 30, `Incorrect value in entry` );

      done();

   });

   it( `Test "Get" Entry From High Priority Queue`, ( done  ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            Polling:              [{ Characteristic: "On", Queue: "A" },
                                   { Characteristic: "Active", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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


      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // The queue getValue will just return the cached value
      // and call updateValue later
      var dummyCallback = function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, true, ` getValue incorrect result: ${ result }` );
      };

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: cmd4SwitchAccessory.timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Get" entry: 105 isUpdate: false length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'\u001b[39m` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: My_Switch returned: 1` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

   it( `Test "Set" Entry From High Priority Queue`, ( done  ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            StatusMsg:                  true,
            Type:                      "Switch",
            On:                         0,
            Active:                     0,
            Polling:                   [{ Characteristic: "On", Queue: "A" },
                                        { Characteristic: "Active", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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


      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // The queue setValue will just return successful
      // and do the actual setValue later
      var dummyCallback = function( rc )
      {
         assert.equal( rc, 0, ` setValue incorrect rc: ${ rc }` );
      };

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: cmd4SwitchAccessory.timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: true, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Set" entry: 105 length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90msetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch 1  cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Set 'My_Switch' 'On' '1'` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

   it( `Test "Set" Entry With Related CharacteristicFrom High Priority Queue`, ( done  ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                 true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:             "STOPPED",
            StateChangeResponseTime:    0,
            Polling:                   [{ Characteristic: "CurrentPosition", Queue: "A" },
                                        { Characteristic: "TargetPosition", Queue: "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
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


      let cmd4DoorAccessory = cmd4Platform.createdCmd4Accessories[0];

      let cmd4PriorityPollingQueue = cmd4DoorAccessory.queue;
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "Cmd4PriorityPollingQueue is not an instance of Cmd4Accessory" );


      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let dummyCallbackCount = 0;
      var dummyCallback = function( rc )
      {
         dummyCallbackCount ++;
         assert.equal( dummyCallbackCount, 1, ` callback called too many times` );

         assert.equal( rc, 0, ` setValue incorrect rc: ${ rc }` );

      };

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4DoorAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.TargetPosition, [ constants.CHARACTERISTIC_STRING_lv ]: "TargetPosition", [ constants.TIMEOUT_lv ]: cmd4DoorAccessory.timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: 100, [ constants.CALLBACK_lv ]: dummyCallback } );

      //log.reset( );
      //log.setOutputEnabled( false );
      //log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_SET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Set" entry: 192 length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90msetValue: accTypeEnumIndex:( 192 )-"TargetPosition" function for: My_Door 100  cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Set 'My_Door' 'TargetPosition' '100'`, `expected stdout: ${ log.logBuf }` );

         assert.include( log.logBuf, `[90mProcessing high priority queue "Get" entry: 43 isUpdate: true length: ` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( 43 )-"CurrentPosition" function for: My_Door cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Door' 'CurrentPosition'`, `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: CurrentPosition function for: My_Door returned: 100`, `expected stdout: ${ log.logBuf }` );

         done( );

      }, 3000 );

   }).timeout( 6000 );

});
