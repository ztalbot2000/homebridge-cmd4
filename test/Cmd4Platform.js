#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
let constants = require( "../cmd4Constants" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4PriorityPollingQueue = require( "../Cmd4PriorityPollingQueue" ).Cmd4PriorityPollingQueue;



var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
CMD4_DEVICE_TYPE_ENUM.init( _api.hap.Service );

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

describe( "Quick Test of CMD4_CHAR_TYPE_ENUM", ( ) =>
{
   it( "CMD4_CHAR_TYPE_ENUMS should be defined ( required correctly )", ( ) =>
   {
      assert.isNotNull( CMD4_CHAR_TYPE_ENUMS, "CMD4_CHAR_TYPE_ENUMS is null" );
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

   beforeEach( function( )
   {
      settings.listOfCreatedPriorityQueues = { };
   });
   afterEach(function( )
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
               On:           0,
               Active:       0,
               polling: [{ "characteristic": "On", "queue": "A" },
                         { "characteristic": "Active", "queue": "A" }
                        ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

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

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      assert.include( log.logBuf, `Adding new platformAccessory: My_Door`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `35mConfiguring platformAccessory: \u001b[39mMy_Door`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf}` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      assert.equal( cmd4Accessory.CMD4, constants.PLATFORM, ` Created accessory was not a PLATFORM accessory` );

      done( );
   });

   it('Test if OutputConstants are used from the accessory', ( done ) =>
   {
      let platformConfig =
      {
         OutputConstants:               true,
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:           0,
            TargetPosition:            0,
            PositionState:             0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      assert.equal( cmd4Platform.outputConstants, true, ` Created Platform has incorrect OutputConstants` );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      assert.equal( cmd4Accessory.outputConstants, true, ` Created Accessory has incorrect OutputConstants` );

      done( );
   });

   it('Test if interval, timeout, outputConstants, stateChangeResponseTime are used from the platform', ( done ) =>
   {
      let platformConfig =
      {
         timeout:                       12345,
         interval:                      12,
         stateChangeResponseTime:       18,
         outputConstants:               true,
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                    [ { "characteristic": "CurrentPosition", "queue": "A" },
                                          { "characteristic": "TargetPosition", "queue": "A" },
                                          { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                  "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

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
         timeout:                       12345,
         interval:                      12,
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                 true,
            Type:                      "Door",
            OutputConstants:              true,
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

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
         timeout:                       12345,
         interval:                      12,
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

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
         timeout:                      12345,
         interval:                      12,
         accessories: [
         {
            Name:                      "My_Switch",
            DisplayName:               "My_Switch",
            Type:                      "Switch",
            On:                         0,
            polling:                   [ { "characteristic": "On" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         },
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                 true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 2, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory1 = cmd4Platform.createdCmd4Accessories[0];
      let cmd4Accessory2 = cmd4Platform.createdCmd4Accessories[1];

      assert.equal( Object.keys( cmd4Accessory1.listOfPollingCharacteristics ).length, 1, `Incorret number of polling characteristics for accessory 1` );
      assert.equal( Object.keys( cmd4Accessory2.listOfPollingCharacteristics ).length, 3, `Incorret number of polling characteristics for accessory 2` );

      let numberOfQueues = Object.keys( settings.listOfCreatedPriorityQueues ).length;

      assert.equal( numberOfQueues, 2, `Incorrect number of polling queues` );
      let queue = settings.listOfCreatedPriorityQueues[ "A" ];

      expect( queue ).to.be.a.instanceOf( Cmd4PriorityPollingQueue, "queue is not an instance of Cmd4PriorityPollingQueue" );

      // Low priority queues are continious, make sure it is put back
      assert.equal( queue.lowPriorityQueue.length, 3, `low priority queue should init to size 3` );

      done( );
   });

   // Until we remove the successful add, it screw up other tests
   it.skip('Test definition can be created successfully', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                       description: "An X Coordinate",
                       props: { format: "uint32",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      assert.include( log.logBuf, `Processing definition index: 0`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Created definition type: "PointX".`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf }` );

      done( );
   });

   // Until we remove the successful add, it screw up other tests
   it.skip('Test definition with no validValues can be created successfully', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                       description: "An X Coordinate",
                       props: { format: "uint32",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `cmd4Platform did not create an instance of Cmd4Accessory` );

      assert.include( log.logBuf, `Processing definition index: 0`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Created definition type: "PointX".`, ` Cmd4Platform Incorrect stdout: ${ log.logBuf }` );

      done( );
   });

   it('Test definition type must be string or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: true,
                       description: "An X Coordinate",
                       props: { format: "uint32",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.type at index: 0 is not a String./);

      done( );
   });

   it('Test definition description must be string or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                       props: { format: "uint32",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.description at index: 0 is not a String./);

      done( );
   });

   it('Test definition props must be an Object or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                        description: "A point on X axis",
                        props: [],
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.props at index: 0 is not an Object./);

      done( );
   });

   it('Test definition props.format must be string or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                        description: "A point on X axis",
                       props: { format: 0,
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.props.format at index: 0 is not a String./);

      done( );
   });

   it('Test definition props.format must be valid or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                        description: "A point on X axis",
                       props: { format: "ZERO",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                       validValues: { }
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.props.format at index: 0 is not a valid format./);

      done( );
   });

   it('Test definition validValues must be an Object or throws error', ( done ) =>
   {
      let platformConfig =
      {
         definitions: [{ type: "PointX",
                        description: "A point on X axis",
                       props: { format: "uint32",
                                minValue: 0,
                                minStep: 1,
                                perms: [ "pr", "pw", "ev" ]
                              },
                        validValues: 1
                     }],
         accessories: [
         {
            Name:                      "My_Door",
            DisplayName:               "My_Door",
            StatusMsg:                  true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition", "queue": "A" },
                                         { "characteristic": "TargetPosition", "queue": "A" },
                                         { "characteristic": "PositionState", "queue": "A" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      }


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      expect( ( ) => new Cmd4Platform( log, platformConfig, _api )).to.throw(/definition.validValues at index: 0 is not an Object./);

      done( );
   });

});
