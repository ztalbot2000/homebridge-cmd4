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
      }
      // Put back the array of Polling Characteristics
      settings.arrayOfAllStaggeredPollingCharacteristics = [ ];
      settings.listOfCreatedPriorityQueues = { };
   });

   it( "Test if Cmd4PriorityPollingQueue exists", function ( )
   {
      expect( Cmd4PriorityPollingQueue ).not.to.be.a( "null", "Cmd4PriorityPollingQueue was null" );
   });

   it( "Test creation of Cmd4PriorityPollingQueue", function( )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let queueName = "Queue A";

      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "cmd4PollingQueues is not an instance of Cmd4PollingQueues" );

      assert.equal( "", this.log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ this.log.logBuf }` );
      assert.equal( "", this.log.errBuf, ` Cmd4PriorityPollingQueue unexpected stderr received: ${ this.log.errBuf }` );
      assert.equal( cmd4PriorityPollingQueue.queueName, queueName, ` Cmd4PriorityPollingQueue.queueName is incorrect` );

      assert.isFalse( cmd4PriorityPollingQueue.queueStarted, ` Cmd4PriorityPollingQueue should not be started` );
      assert.equal( cmd4PriorityPollingQueue.SQUASH_TIMER_INTERVAL, 5 * 60 * 1000, ` incorrect squash timer interval` );

   });

   it.skip( "Test add set entry goes to high priority queue", function( )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let queueName = "Queue A";
      let value = 0;

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

      let cmd4Accessory = new Cmd4Accessory( this.log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );


      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );

      assert.isFunction( cmd4PriorityPollingQueue.addQueueEntry, `.addQueueEntry is not a function` );

      //                                    ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      cmd4PriorityPollingQueue.addQueueEntry( true, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, value );

      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 1, `Set not added to high prority queue` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 0, `Set added to low prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 0 ];

      assert.isTrue( entry.isSet, `Entry was not stored as isSet` );

      assert.isFalse( entry.isPolled, `Entry was not stored as not Polled` );

      assert.equal( entry.value, value, `Wrong value for Set added to queue` );

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `On was not stored as a set` );
      assert.equal( entry.interval, constants.DEFAULT_INTERVAL, `interval was not stored` );
      assert.equal( entry.timeout, constants.DEFAULT_TIMEOUT, `timeout was not stored` );
      assert.equal( entry.stateChangeResponseTime, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, `stateChangeResponseTime was not stored` );

      assert.equal( entry.callback, dummyCallback, `callback was not stored as a set` );
   });

   it.skip( "Test add IOS Get entry goes to high priority queue", function( )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let queueName = "Queue A";

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

      let cmd4Accessory = new Cmd4Accessory( this.log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );


      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );

      assert.isFunction( cmd4PriorityPollingQueue.addQueueEntry, `.addQueueEntry is not a function` );

      //                                    ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      cmd4PriorityPollingQueue.addQueueEntry( false, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, 1 );

      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 1, `IOS Get not added to high prority queue` );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 0, `Get added to low prority queue` );

      let entry = cmd4PriorityPollingQueue.highPriorityQueue[ 0 ];

      assert.isFalse( entry.isSet, `Entry was not stored as a get` );

      assert.isFalse( entry.isPolled, `Entry was not stored as not Polled` );

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `On was not stored as a get` );

      assert.equal( entry.callback, dummyCallback, `callback was not stored as a get` );
   });

   it( "Test add Polled Get entry goes to low priority queue", function( )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let queueName = "Queue A";

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

      let cmd4Accessory = new Cmd4Accessory( this.log, config, _api, [ ], parentInfo );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );


      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );
      cmd4Accessory.queue = cmd4PriorityPollingQueue;
      cmd4Accessory.queueName = queueName;

      assert.isFunction( cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry, `.addLowPriorityGetPolledQueueEntry is not a function` );

      //                                    ( accessory, accTypeEnumIndex, interval, timeout )
      cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );


      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 1, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 0, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `On was not stored as a get` );


   });

   it( "Test processEntryFromLowPriorityQueue", function( done  )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( true );

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
            polling: [{ "characteristic": "On", "queue": "A" },
                      { "characteristic": "Active", "queue": "A" }
                     ],
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

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

      this.log.reset( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.processEntryFromLowPriorityQueue( cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ] );

      setTimeout( () =>
      {
         let expectedOutput1 = `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'.\u001b[39m`;
         let expectedOutput2 = `[90mgetValue: On function for: My_Switch returned: 0`;

         assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
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
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

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
            polling: [{ "characteristic": "On", "queue": "A" },
                      { "characteristic": "Active", "queue": "A" }],
            State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

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

      this.log.reset( );
      this.log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.queueStarted = true;
      cmd4PriorityPollingQueue.processHighPriorityGetQueue( cmd4PriorityPollingQueue.highPriorityQueue[ 0 ] );

      setTimeout( () =>
      {
         let expectedOutput1 = `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'\u001b[39m`;
         let expectedOutput2 = `[90mgetValue: On function for: My_Switch returned: 0`;
         let expectedOutput3 = `[90mgetValue: accTypeEnumIndex:( 3 )-"Active" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'Active'\u001b[39m`;
         let expectedOutput4 = `[90mgetValue: On function for: My_Switch returned: 0`;

         // Output for first high priority characteristic
         assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
         // Output for second high priority characteristic
         assert.include( this.log.logBuf, expectedOutput3 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput4 , `expected stdout: ${ this.log.logBuf }` );
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

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

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

      let expectedOutput1 = `Creating new Priority Polled Queue "A"`;
      let expectedOutput2 = `Adding prioritySetValue for My_Switch characteristic: On`;
      let expectedOutput3 = `Adding priorityGetValue for My_Switch characteristic: On`;

      assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
      assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
      assert.include( this.log.logBuf, expectedOutput3 , `expected stdout: ${ this.log.logBuf }` );

      //let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      //expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      done( );
   });

   it.skip('Polling Queue wont be created if a polled queue name is missing', ( done ) =>
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
                               { "characteristic": "PositionState" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      sinon.assert.calledWith(process.exit, 401 );
      let expectedErrOutput1 = `[31m: For Priority Queue Polling all polled characteristics must be in the same polling queue: "A". Missing PositionState`;

      assert.include( this.log.errBuf, expectedErrOutput1 , `expected stderr: ${ this.log.errBuf }` );

      done( );
   });

   // Fails because queue.priorityGetValue is to be called by the accessory
   it.skip('PollingQueue cannot be interrupted.', ( done ) =>
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

      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 4, `Incorrect number of polling characteristics` );

      //let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4SwitchAccessory = cmd4Platform.createdCmd4Accessories[1];


      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );
      let cmd4PriorityPollingQueue = settings.listOfCreatedPriorityQueues[ "A" ];
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 0, `Set not added to high prority queue` );

      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      // Add  IOS Get to start with. This will trigger queue as we had stopped it from starting
      cmd4PriorityPollingQueue.priorityGetValue( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.Active, constants.DEFAULT_TIMEOUT, dummyCallback );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 1, `Set not added to high prority queue` );

      cmd4PriorityPollingQueue.startQueue( );

      // Add IOS Set in the middle
      let value = 0;
      cmd4PriorityPollingQueue.prioritySetValue( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, value );
      setTimeout( () =>
      {

         let expectedOutput1 = `Creating new Priority Polled Queue "A"`;
         let expectedOutput2 = `Adding priorityGetValue for My_Switch characteristic: On`;
         let expectedOutput3 = `Adding priorityGetValue for My_Switch characteristic: Active`;
         let expectedOutput4 = `Adding prioritySetValue for My_Switch characteristic: On`;
         let expectedOutput5 = `[90mgetValue: On function for: My_Light returned: ${ value }.`;

         assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput3 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput4 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput5 , `expected stdout: ${ this.log.logBuf }` );
         assert.equal( this.log.errBuf, "" , `unexpected stderr: ${ this.log.errBuf }` );

         done( );
      }, 9000);
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
describe('Testing Cmd4PriorityPollingQueue squashError', ( ) =>
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

      let expectedErrOutput1 = `[31mtest message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.equal( log.errLineCount, 1, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

      done( );
   });

   it( "Test Cmd4PriorityPollingQueue.squashError outputs 1 message of the same type in < 5 min ", function( done )
   {
      let errNo = constants.ERROR_NULL_REPLY;
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo, "test message" );
      cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo, "test message" );

      let expectedErrOutput1 = `[31mtest message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
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

      let expectedErrOutput1 = `[31mtest message`;
      let expectedErrOutput2 = `[31mSecond message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
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

      let expectedErrOutput1 = `[31mtest message`;
      let expectedErrOutput2 = `[31mThis message has been omitted 9 times => test message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

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

      let expectedErrOutput1 = `[31mUnhandled error: -355 errMsg: test message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

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

      let expectedErrOutput1 = `[31mtest message`;
      let expectedErrOutput2 = `[31mThis message has been omitted 9 times => test message`;

      assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

         assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

         // Do it again
         log.reset( );
         let expectedErrOutput3 = `[31mtest message2`;

         for ( let i = 0; i < 10; i++ )
            cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message2" );

         assert.equal( "", log.logBuf, ` Cmd4PriorityPollingQueue unexpected stdout received: ${ log.logBuf }` );
         assert.include( log.errBuf, expectedErrOutput3, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

         setTimeout( () =>
         {
            assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

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

      let expectedErrOutput1 = `[31mtest message`;
      let expectedErrOutput2 = `[31mThis message has been omitted 9 times => test message`;

      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      setTimeout( () =>
      {
         assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

         assert.equal( log.errLineCount, 2, ` Cmd4PriorityPollingQueue expected only 1 error line ${ log.errBuf }` );

         // Do it again
         log.reset( );
         let expectedErrOutput3 = `[31mtest message2`;

         for ( let i = 0; i < 10; i++ )
            cmd4PriorityPollingQueue.squashError( cmd4PriorityPollingQueue, errNo1, "test message2" );

         assert.include( log.errBuf, expectedErrOutput3, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );

         setTimeout( () =>
         {
            assert.include( log.errBuf, expectedErrOutput2, ` Cmd4PriorityPollingQueue expected omitted stderr message received: ${ log.errBuf }` );

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

      let expectedErrOutput1 = `[31mtest message`;

      assert.include( log.errBuf, expectedErrOutput1, ` Cmd4PriorityPollingQueue expected stderr received: ${ log.errBuf }` );
      log.reset( );
      setTimeout( () =>
      {
         assert.equal( log.errBuf, "", ` Cmd4PriorityPollingQueue Unexpected stderr: ${ log.errBuf }` );

         done( );

      }, 700);
   }).timeout(2000);
});
