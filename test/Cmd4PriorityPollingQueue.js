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

   afterEach( function( )
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

   });

   it( "Test add set entry goes to high priority queue", function( )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( );

      let queueName = "Queue A";
      let value = 33;

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
      cmd4PriorityPollingQueue.addQueueEntry( true, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, value );

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

   it( "Test add IOS Get entry goes to high priority queue", function( )
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
      cmd4PriorityPollingQueue.addQueueEntry( false, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, 1 );

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

      assert.isFunction( cmd4PriorityPollingQueue.addQueueEntry, `.addQueueEntry is not a function` );

      //                                    ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      cmd4PriorityPollingQueue.addQueueEntry( false, true, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, null );


      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 1, `Polled Get added to low prority queue` );
      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 0, `Polled Get added to high prority queue` );

      let entry = cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ];

      assert.equal( entry.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `On was not stored as a get` );

      assert.equal( entry.callback, dummyCallback, `callback was not stored as a get` );

   });

   it( "Test processEntryFromLowPriorityQueue", function( done  )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let queueName = "Queue A";

      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         Active:       0,
         polling: [{ "characteristic": "On" },
                   { "characteristic": "Active" }],
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ }; // Standalone so services will be created

      let cmd4Accessory = new Cmd4Accessory( this.log, config, _api, [ ], parentInfo );


      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );

      //                                    ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      cmd4PriorityPollingQueue.addQueueEntry( false, true, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, null );
      cmd4PriorityPollingQueue.addQueueEntry( false, true, cmd4Accessory, CMD4_ACC_TYPE_ENUM.Active, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, null );

      assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `Polled Get added to low prority queue` );

      this.log.reset( );
      this.log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.processEntryFromLowPriorityQueue( );

      setTimeout( () =>
      {
         let expectedOutput1 = `[90mgetValue: accTypeEnumIndex:( 105 )-"On" function for: My_Switch cmd: node ./Extras/Cmd4Scripts/Examples/AnyDevice Get 'My_Switch' 'On'\u001b[39m`;
         let expectedOutput2 = `[90mgetValue: On function for: My_Switch returned: 0`;

         assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
         assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
         // Low priority queues are continious, make sure it is put back
         assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 2, `After poll, low priority queue length should atill be the same size` );

         let entry0 = cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ];
         let entry1 = cmd4PriorityPollingQueue.lowPriorityQueue[ 1 ];

         assert.equal( entry0.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.Active, `After poll, The low priority queue should be the next characteristic to poll` );
         assert.equal( entry1.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `After poll, The low priority queue should put back the polled characteristic at the bottom of the  queue` );

         done( );

      }, 1000);

   });

   it( "Test processEntryFromHighPriorityQueue", function( done  )
   {
      this.log = new Logger( );
      this.log.setBufferEnabled( );
      this.log.setOutputEnabled( false );
      this.log.setDebugEnabled( false );

      let queueName = "Queue A";

      let config =
      {
         Name:         "My_Switch",
         DisplayName:  "My_Switch",
         StatusMsg:    true,
         Type:         "Switch",
         Cmd4_Mode:    "Polled",
         On:           0,
         Active:       0,
         polling: [{ "characteristic": "On" },
                   { "characteristic": "Active" }],
         State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
      }
      let parentInfo={ }; // Standalone so services will be created

      let cmd4Accessory = new Cmd4Accessory( this.log, config, _api, [ ], parentInfo );


      let cmd4PriorityPollingQueue = new Cmd4PriorityPollingQueue( this.log, queueName );

      //                                    ( isSet, isPolled, accessory, accTypeEnumIndex, interval, timeout, callback, value )
      cmd4PriorityPollingQueue.addQueueEntry( false, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.On, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, null );
      cmd4PriorityPollingQueue.addQueueEntry( false, false, cmd4Accessory, CMD4_ACC_TYPE_ENUM.Active, constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, dummyCallback, null );

      assert.equal( cmd4PriorityPollingQueue.highPriorityQueue.length, 2, `IOS Get added to high prority queue` );

      this.log.reset( );
      this.log.setDebugEnabled( true );

      cmd4PriorityPollingQueue.queueStarted = true;
      cmd4PriorityPollingQueue.processAllFromHighPriorityQueue( );

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


   it('Cmd4Platform creates pollingQueue.', ( done ) =>
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
      this.log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( this.log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( settings.arrayOfPollingCharacteristics.length, 4, `Incorrect number of polling characteristics` );

      cmd4Platform.startPolling( 5000, 5000 );

      cmd4Platform.pollingTimers.forEach( ( timer ) =>
      {
         clearTimeout( timer );
      });

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 1, `Incorrect number of polling queues` );

      let expectedOutput1 = `[90mCreating new Priority Polled Queue "A"\u001b[39m`;
      let expectedOutput2 = `Adding prioritySetValue for My_Switch characteristic: On`;
      let expectedOutput3 = `Adding priorityGetValue for My_Switch characteristic: On`;

      assert.include( this.log.logBuf, expectedOutput1 , `expected stdout: ${ this.log.logBuf }` );
      assert.include( this.log.logBuf, expectedOutput2 , `expected stdout: ${ this.log.logBuf }` );
      assert.include( this.log.logBuf, expectedOutput3 , `expected stdout: ${ this.log.logBuf }` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      done( );
   });

   it('Polling Queue wont be created if a polled queue name is missing', ( done ) =>
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

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

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
});
