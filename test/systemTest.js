#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4PriorityPollingQueue = require( "../Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;


// Duplicated from Cmd4PriorityPollingQueue.js
let HIGH_PRIORITY_SET = 0;
//let HIGH_PRIORITY_GET = 1;
//let LOW_PRIORITY_GET = 2;


var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );
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


describe('WoRM - Testing Cmd4PriorityPollingQueue recovery correction', ( ) =>
{
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
      settings.listOfCreatedPriorityQueues = { };

      // MaxListenersExceededWarning: Possible EventEmitter memory leak detected
      _api.removeAllListeners();

   });

   it( `Worm Test HighPriority "Set" Entry passes without errors`, ( done ) =>
   {
      let platformConfig =
      {
         queueTypes:                   [ { queue: "A", queueType: "WoRm" } ],
         statusMsg:                    true,
         accessories: [
         {
            name:                      "MySwitch",
            displayName:               "MySwitch",
            statusMsg:                 true,
            type:                      "Switch",
            on:                        0,
            active:                    0,
            queue:                     "A",
            polling:                   [ { characteristic: "on" },
                                         { characteristic: "active" } ],
            state_cmd:                 "./test/echoScripts/justExitWithRCof0"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false ); // Not to be turned on !!


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

      assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );

      log.reset( );
      log.setOutputEnabled( true );
      log.setDebugEnabled( false );

      // The queue setValue will just return successful
      // and do the actual setValue later
      var dummyCallback = function( rc )
      {
         assert.equal( rc, 0, ` setValue incorrect rc: ${ rc }` );
      };

      // Call the setValue bound function, which is prioritySetValue
      //cmd4SwitchAccessory.service.getCharacteristic(
      //                      CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.On ]
      //                      .characteristic ).setValue( true, dummyCallback );


      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: constants.DEFAULT_TIMEOUT, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: 1, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_SET, cmd4PriorityPollingQueue );

      // Only 1 line since statusMsg: true
      assert.equal( 1, log.logLineCount, ` Unexpected number of stdout lines:  ${ log.logBuf }` );
      assert.include( log.logBuf, `[34mSetting MySwitch On\u001b` , `expected stdout: ${ log.logBuf }` );

      assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );
      assert.equal( log.errBuf, "", ` Unexpected stderr:  ${ log.errBuf }` );

      done( );

   });

   it( `Worm Test HighPriority "Get" Entry passes without errors`, ( done  ) =>
   {
      let platformConfig =
      {
         queueTypes:                   [ { queue: "A", queueType: "WoRm" } ],
         accessories: [
         {
            name:                      "MySwitch",
            displayName:               "MySwitch",
            statusMsg:                 true,
            type:                      "Switch",
            on:                        0,
            active:                    0,
            queue:                     "A",
            polling:                   [ { characteristic: "on" },
                                         { characteristic: "active" } ],
            state_cmd:                 "./test/echoScripts/echo_true"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false ); // Not to be turned on !!


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( Object.keys(settings.listOfCreatedPriorityQueues).length, 1, `Incorrect number of polling queues created` );

      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PollingQueue" );
      assert.equal( queue.queueRetryCount, 0, `Incorrect queueRetryCount` );

      assert.equal( queue.lowPriorityQueue.length, 2, `Incorrect number of low level polling characteristics` );
      queue.lowPriorityQueue = [];

      //Make sure no polling happens
      assert.equal( queue.lowPriorityQueue.length, 0, `Incorrect number of low level polling characteristics` );
      Object.keys(queue.listOfRunningPolls).forEach( (key) =>
      {
         let timer = queue.listOfRunningPolls[ key ];
         clearTimeout( timer );
      });

      clearTimeout( queue.pauseTimer );
      queue.pauseTimerTimeout = 0;



      let cmd4SwitchAccessory = cmd4Platform.createdCmd4Accessories[0];

      let cmd4PriorityPollingQueue = cmd4SwitchAccessory.queue;
      expect( cmd4PriorityPollingQueue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "Cmd4PriorityPollingQueue is not an instance of Cmd4Accessory" );

      assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false ); // Not to be turned on !!

      // The queue getValue will just return the cached value
      // and call updateValue later
      var dummyCallback = function( rc, result )
      {
         assert.equal( rc, 0, ` getValue incorrect rc: ${ rc }` );
         assert.equal( result, true, ` getValue incorrect result: ${ result }` );
      };

      var allDoneCallback = function( allDoneCount )
      {
         assert.equal( allDoneCount, 0, ` startQueue incorrect allDoneCount` );
      };

      assert.equal( cmd4PriorityPollingQueue.queueType, constants.DEFAULT_QUEUE_TYPE, ` incorrect default queue type. Should be WoRm` );

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: constants.DEFAULT_TIMEOUT, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: dummyCallback } );

      //cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );
      cmd4PriorityPollingQueue.startQueue( cmd4PriorityPollingQueue, allDoneCallback );

      // Wait for the entry in the Queue to be processed
      setTimeout( ( ) =>
      {

         assert.equal( 0, log.logLineCount, ` Unexpected number of stdout lines:  ${ log.logBuf }` );
         assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );
         assert.equal( log.errBuf, "", ` Unexpected stderr:  ${ log.errBuf }` );



         // A quick way to stop the queue. For whatever reason, if the above fails,
         // the testcase will not do this command and the testcase runs forever
         cmd4SwitchAccessory.queue.inProgressSets = 10;

         done( );

      }, 2500 );

   }).timeout( 3000 );

   it( `Worm Test lowPriority "Get" Entry passes without errors`, ( done  ) =>
   {
      let platformConfig =
      {
         queueTypes:                   [ { queue: "A", queueType: "WoRm" } ],
         accessories: [
         {
            name:                      "MySwitch",
            displayName:               "MySwitch",
            statusMsg:                 true,
            type:                      "Switch",
            on:                        0,
            active:                    0,
            queue:                     "A",
            polling:                   [ { characteristic: "on" },
                                         { characteristic: "active" } ],
            state_cmd:                 "./test/echoScripts/echo_true"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false ); // Not to be turned on !!


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

      //cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.On, "On", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );
      //cmd4PriorityPollingQueue.addLowPriorityGetPolledQueueEntry( cmd4SwitchAccessory, CMD4_ACC_TYPE_ENUM.Active, "Active", constants.DEFAULT_INTERVAL, constants.DEFAULT_TIMEOUT );

      //assert.equal( cmd4PriorityPollingQueue.lowPriorityQueue.length, 4, `Polled Get added to low prority queue` );

      assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false ); // Not to be turned on !!

      // Process 1 entry from the polling queue
      cmd4PriorityPollingQueue.processEntryFromLowPriorityQueue( cmd4PriorityPollingQueue.lowPriorityQueue[ 0 ] );

      setTimeout( () =>
      {
         assert.equal( 0, log.logLineCount, ` Unexpected number of stdout lines:  ${ log.logBuf }` );
         assert.equal( 0, log.errLineCount, ` Unexpected number of stderr lines:  ${ log.errBuf }` );
         assert.equal( log.errBuf, "", ` Unexpected stderr:  ${ log.errBuf }` );

         done( );

      }, 1000);

   }).timeout( 3000 );
});
