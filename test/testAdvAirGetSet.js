#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4PriorityPollingQueue = require( "../Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;


// Duplicated from Cmd4PriorityPollingQueue.js
//let HIGH_PRIORITY_SET = 0;
let HIGH_PRIORITY_GET = 1;
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



describe('AdvAir test of Cmd4PriorityPollingQueue polling', ( ) =>
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

   it( `AdvAir - Test "Get" Cmd From High Priority Queue`, ( done  ) =>
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
            state_cmd:                 "node ./test/AdvAir.sh"
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

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: cmd4SwitchAccessory.hV.timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Get" entry: ${ CMD4_ACC_TYPE_ENUM.On } isUpdate: false length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( ${ CMD4_ACC_TYPE_ENUM.On } )-"On" function for: MySwitch cmd: node ./test/AdvAir.sh Get "MySwitch" 'On' timeout: 60000` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: MySwitch returned: 1` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

   it( `AdvAir - Test "Get" Cmd Quotes From High Priority Queue`, ( done  ) =>
   {
      let platformConfig =
      {
         queueTypes:                   [ { queue: "A", queueType: "WoRm" } ],
         accessories: [
         {
            name:                      "Mia'sSwitch",
            displayName:               "Mia'sSwitch",
            statusMsg:                 true,
            type:                      "Switch",
            on:                        0,
            active:                    0,
            queue:                     "A",
            polling:                   [ { characteristic: "on" },
                                         { characteristic: "active" } ],
            state_cmd:                 "node ./test/AdvAir.sh"
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

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: false, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: cmd4SwitchAccessory.hV.timeout, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: null, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Get" entry: ${ CMD4_ACC_TYPE_ENUM.On } isUpdate: false length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: accTypeEnumIndex:( ${ CMD4_ACC_TYPE_ENUM.On } )-"On" function for: Mia'sSwitch cmd: node ./test/AdvAir.sh Get "Mia'sSwitch" 'On' timeout: 60000` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: On function for: Mia'sSwitch returned: 1` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

   it( `AdvAir - Test "Set" Cmd From High Priority Queue`, ( done  ) =>
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
            state_cmd:                 "node ./test/AdvAir.sh"
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

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: constants.DEFAULT_TIMEOUT, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: true, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Set" entry: ${ CMD4_ACC_TYPE_ENUM.On } length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90msetValue: accTypeEnumIndex:( ${ CMD4_ACC_TYPE_ENUM.On } )-"On" function for: MySwitch 1  cmd: node ./test/AdvAir.sh Set "MySwitch" 'On' '1'` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

   it( `AdvAir - Test "Set" Cmd Quotes From High Priority Queue`, ( done  ) =>
   {
      let platformConfig =
      {
         queueTypes:                   [ { queue: "A", queueType: "WoRm" } ],
         accessories: [
         {
            name:                      "Mia'sSwitch",
            displayName:               "Mia'sSwitch",
            statusMsg:                 true,
            type:                      "Switch",
            on:                        0,
            active:                    0,
            queue:                     "A",
            polling:                   [ { characteristic: "on" },
                                         { characteristic: "active" } ],
            state_cmd:                 "node ./test/AdvAir.sh"
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

      cmd4PriorityPollingQueue.highPriorityQueue.push( { [ constants.IS_SET_lv ]: true, [ constants.QUEUE_GET_IS_UPDATE_lv ]: false, [ constants.ACCESSORY_lv ]: cmd4SwitchAccessory, [ constants.ACC_TYPE_ENUM_INDEX_lv ]: CMD4_ACC_TYPE_ENUM.On, [ constants.CHARACTERISTIC_STRING_lv ]: "On", [ constants.TIMEOUT_lv ]: constants.DEFAULT_TIMEOUT, [ constants.STATE_CHANGE_RESPONSE_TIME_lv ]: null, [ constants.VALUE_lv ]: true, [ constants.CALLBACK_lv ]: dummyCallback } );

      cmd4PriorityPollingQueue.processQueueFunc( HIGH_PRIORITY_GET, cmd4PriorityPollingQueue );

      // Wait for the Queue to be processed
      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[90mProcessing high priority queue "Set" entry: ${ CMD4_ACC_TYPE_ENUM.On } length: 0` , `expected stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90msetValue: accTypeEnumIndex:( ${ CMD4_ACC_TYPE_ENUM.On } )-"On" function for: Mia'sSwitch 1  cmd: node ./test/AdvAir.sh Set "Mia'sSwitch" 'On' '1'` , `expected stdout: ${ log.logBuf }` );

         done( );

      }, 1000 );
   });

});
