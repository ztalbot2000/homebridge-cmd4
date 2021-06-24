"use strict";


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );

var Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;

describe( "Initializing our CMD4 Libraries ", ( ) => {});

var _api = new HomebridgeAPI( ); // object we feed to Plugins

 // Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
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



describe('Testing isRelatedTargetCharacteristicInSameDevice', ( ) =>
{

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for TemperatureSensor with no REQUIRED *Target* Characteristic', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "TemperatureSensor",
            DisplayName: "TemperatureSensor",
            Name: "TemperatureSensor",
            CurrentTemperature: "22.2",
            Polling: [ { characteristic: "CurrentTemperature" }
                    ],
            State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "No_Queue"`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for TemperatureSensor characteristic: CurrentTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // Not Target setValue
      assert.notInclude( log.logBuf,  `[33mAdding setValue for TemperatureSensor characteristic: TargetTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      // Not Target polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: TargetTemperature timeout: 60000 interval: 60000`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      // No errors
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );


   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for CameraControl with no OPTIONAL *Target* Characteristic', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "CameraControl",
            DisplayName: "CameraControl",
            Name: "CameraControl",
            On: "1",
            CurrentHorizontalTiltAngle: 12,
            Polling: [ { characteristic: "CurrentHorizontalTiltAngle" }
                     ],
            State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for CameraControl characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for CameraControl characteristic: CurrentHorizontalTiltAngle`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: CurrentHorizontalTiltAngle timeout: 60000 interval: 60000`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf, `[33mAdding setValue for CameraControl characteristic: TargetHorizontalTiltAngle`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      // Not polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: TargetHorizontalTiltAngle timeout: 60000 interval: 60000`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // No errors
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );


   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for TemperatureSensor with no REQUIRED *Target* Characteristic With QUEUE', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "TemperatureSensor",
            DisplayName: "TemperatureSensor",
            Name: "TemperatureSensor",
            QueueTypes: [{ queue: "A", queueType: "WoRm" }],
            Queue: "A",
            CurrentTemperature: "22.2",
            Polling: [ { characteristic: "CurrentTemperature" }
                    ],
            State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf,  `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for TemperatureSensor characteristic: CurrentTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: CurrentTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for TemperatureSensor characteristic: TargetTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      // Not polling
      assert.notInclude( log.logBuf, `[90mSetting up accessory: TemperatureSensor for polling of: TargetTemperature timeout: 60000 interval: 60000 queueName: "A"`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      // No errors
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );

   });

   it('isRelatedTargetCharacteristicInSameDevice returns correctly for CameraControl with no OPTIONAL *Target* Characteristic with QUEUE', ( ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "CameraControl",
            DisplayName: "CameraControl",
            Name: "CameraControl",
            On: "1",
            QueueTypes: [{ queue: "A", queueType: "WoRm" }],
            Queue: "A",
            CurrentHorizontalTiltAngle: 12,
            Polling: [ { characteristic: "CurrentHorizontalTiltAngle" }
                     ],
            State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: CameraControl`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for CameraControl characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for CameraControl characteristic: CurrentHorizontalTiltAngle`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mSetting up accessory: CameraControl for polling of: CurrentHorizontalTiltAngle timeout: 60000 interval: 60000 queueName: "A"`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // Not setValue
      assert.notInclude( log.logBuf,  `[33mAdding prioritySetValue for CameraControl characteristic: TargetHorizontalTiltAngle`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      // No errors
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );


   });

   it('Polling complains related polling characteristic is missing', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:         "Door",
               DisplayName:  "Door",
               StatusMsg:    true,
               Type:         "Door",
               Cmd4_Mode:    "Polled",
               CurrentPosition:          0,
               TargetPosition:           0,
               PositionState:            0,
               polling:      [ { "characteristic": "CurrentPosition" },
                            // { "characteristic": "TargetPosition" },
                               { "characteristic": "PositionState" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Door`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: Door`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Door`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for Door characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for Door characteristic: CurrentPosition`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      let expectedErrOutput1 = `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentPosition" requested, you also must do polling of "TargetPosition" or things will not function properl`;

      assert.include( log.errBuf, `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentPosition" requested, you also must do polling of "TargetPosition" or things will not function properl` , `expected stderr: ${ log.errBuf }` );
      assert.notInclude( log.logBuf, `[33mAdding setValue for Door characteristic: TargetPosition`, ` cmd4Accessory output Unexpected. received: ${ log.logBuf }` );

      done( );
   });
});

