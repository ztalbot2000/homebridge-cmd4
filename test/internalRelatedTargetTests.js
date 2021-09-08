"use strict";

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );

var Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;

describe( "Initializing our CMD4 Libraries ", ( ) => {});

var _api = new HomebridgeAPI( ); // object we feed to Plugins

// Init the library for all to use
CMD4_DEVICE_TYPE_ENUM.init( _api.hap.Service );


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



describe('Testing isRelatedTargetCharacteristicInSameDevice', ( ) =>
{
   afterEach( function( )
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
   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for TemperatureSensor with no REQUIRED *Target* Characteristic', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            StatusMsg:                  true,
            Type:                      "TemperatureSensor",
            DisplayName:               "TemperatureSensor",
            Name:                      "TemperatureSensor",
            CurrentTemperature:        "22.2",
            Polling:                   [ { characteristic: "CurrentTemperature" }],
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "Q:TemperatureSensor"`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for TemperatureSensor characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // Not Target setValue
      assert.notInclude( log.logBuf,  `[33mAdding prioritySetValue for TemperatureSensor characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      // Not Target polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: TargetTemperature timeout: 60000 interval: 60000`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      // No errors
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );


   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for CameraControl with no OPTIONAL *Target* Characteristic', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            StatusMsg:                 true,
            Type:                      "CameraControl",
            DisplayName:               "CameraControl",
            Name:                      "CameraControl",
            On:                        "1",
            CurrentHorizontalTiltAngle: 12,
            Polling:                   [ { characteristic: "CurrentHorizontalTiltAngle" } ],
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for CameraControl characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for CameraControl characteristic: CurrentHorizontalTiltAngle`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: CurrentHorizontalTiltAngle timeout: 60000 interval: 60000`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for CameraControl characteristic: TargetHorizontalTiltAngle`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      // Not polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: TargetHorizontalTiltAngle timeout: 60000 interval: 60000`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // No errors
      assert.equal( log.errBuf, "", ` cmd4Accessory Unexpected stderr: ${ log.errBuf }` );


   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for TemperatureSensor with no REQUIRED *Target* Characteristic With QUEUE', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            StatusMsg:                  true,
            Type:                      "TemperatureSensor",
            DisplayName:               "TemperatureSensor",
            Name:                      "TemperatureSensor",
            QueueTypes:                [{ queue: "A", queueType: "WoRm" }],
            Queue:                     "A",
            CurrentTemperature:        "22.2",
            Polling:                   [ { characteristic: "CurrentTemperature" } ],
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf,  `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for TemperatureSensor characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for TemperatureSensor characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      // Not polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: TargetTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      // No errors
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

      done( );
   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for CameraControl with no OPTIONAL *Target* Characteristic with QUEUE', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            StatusMsg:                  true,
            Type:                      "CameraControl",
            DisplayName:               "CameraControl",
            Name:                      "CameraControl",
            On:                        "1",
            QueueTypes:                [{ queue: "A", queueType: "WoRm" }],
            Queue:                     "A",
            CurrentHorizontalTiltAngle: 12,
            Polling:                   [ { characteristic: "CurrentHorizontalTiltAngle" } ],
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: CameraControl`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for CameraControl characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for CameraControl characteristic: CurrentHorizontalTiltAngle`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: CurrentHorizontalTiltAngle timeout: 60000 interval: 60000 queueName: "A"`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf,  `[33mAdding prioritySetValue for CameraControl characteristic: TargetHorizontalTiltAngle`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      // No errors
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );


   });

   it('Polling complains related polling characteristic is missing', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Name:                      "Door",
            DisplayName:               "Door",
            StatusMsg:                 true,
            Type:                      "Door",
            CurrentPosition:            0,
            TargetPosition:             0,
            PositionState:              0,
            polling:                   [ { "characteristic": "CurrentPosition" },
                                       // { "characteristic": "TargetPosition" },
                                         { "characteristic": "PositionState" } ],
            State_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( true );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Door`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: Door`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Door`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for Door characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Door characteristic: CurrentPosition`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentPosition" requested, you also must do polling of "TargetPosition" or things will not function properl` , `Incorrect stderr: ${ log.errBuf }` );
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for Door characteristic: TargetPosition`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      done( );
   });
});
