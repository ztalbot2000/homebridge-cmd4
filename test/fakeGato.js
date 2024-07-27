#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;


let Logger = require( "../utils/Logger" );



var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

// Taken from https://stackoverflow.com/questions/11731072/dividing-an-array-by-filter-function
//function partition(array, predicate)
//{
//   return array.reduce( ( acc, item ) => ( acc[+!predicate( item )].push( item ), acc ), [ [], [] ] );
//}

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( `Quick Test of CMD4_DEVICE_TYPE_ENUM`, ( ) =>
{
   it( `CMD4_DEVICE_TYPE_ENUM.EOL ${ DEVICE_EOL }`, ( ) =>
   {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
   });
});

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( `Quick Test of CMD4_ACC_TYPE_ENUM`, ( ) =>
{
   it( `CMD4_ACC_TYPE_ENUM.EOL = ${ ACC_EOL }`, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



describe('Testing FakeGato gets created', ( ) =>
{
   before( ( ) =>
   {
   });
   after( ( ) =>
   {
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

      // MaxListenersExceededWarning: Possible EventEmitter memory leak detected
      _api.removeAllListeners();

   });

   it( `Test if Cmd4Platform exists`, function ( )
   {
      expect( Cmd4Platform ).not.to.be.a( "null", `Cmd4Platform was null` );
   });

   it( `Test creation of Accessory with FakeGato Thermo`, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                   "Thermostat",
               name:                   "Thermostat",
               displayName:            "Thermostat",
               temperatureDisplayUnits:"CELSIUS",
               active:                 "INACTIVE",
               currentTemperature:     20.0,
               targetTemperature:      20.0,
               currentHeatingCoolingState: 0,
               targetHeatingCoolingState: 0,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "CurrentTemperature" },
                                         { characteristic: "TargetTemperature" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice",
               fakegato: {
                  eve:                 "thermo",
                  currentTemp:         "CurrentTemperature",
                  setTemp:             "TargetTemperature",
                  valvePosition:       0,
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
              }

            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, `cmd4Platform is not an instance of Cmd4Platform` );

      assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4ThermostatAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Light is not an instance of Cmd4Accessory` );
      expect( cmd4ThermostatAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Thermostat is not an instance of Cmd4Accessory` );

      done( );
   });

   it( `Test creation of Accessory with FakeGato room`, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                   "Thermostat",
               name:                   "Thermostat",
               displayName:            "Thermostat",
               temperatureDisplayUnits: "CELSIUS",
               active:                 "INACTIVE",
               currentTemperature:     20.0,
               targetTemperature:      20.0,
               currentHeatingCoolingState: 0,
               targetHeatingCoolingState: 0,
               currentRelativeHumidity: 44,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "CurrentTemperature" },
                                         { characteristic: "TargetTemperature" },
                                         { characteristic: "CurrentRelativeHumidity" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice",
               fakegato: {
                  eve:                 "room",
                  temp:                "CurrentTemperature",
                  humidity:            "CurrentRelativeHumidity",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage"
               }

            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, `cmd4Platform is not an instance of Cmd4Platform` );

      assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4ThermostatAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Light is not an instance of Cmd4Accessory` );
      expect( cmd4ThermostatAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Thermostat is not an instance of Cmd4Accessory` );

      done( );
   });

   it( `Test creation of Accessory with FakeGato door`, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
                 type:                 "Door",
                 name:                 "MyDoor",
                 currentPosition:      0,
                 targetPosition:       0,
                 contactSensorState:   "CONTACT_DETECTED",
                 holdPosition:         "FALSE",
                 obstructionDetected:  "FALSE",
                 statusActive:         0,
                 statusFault:          0,
                 polling:              [ { characteristic: "StatusActive" },
                                         { characteristic: "StatusFault" }
                                       ],
                 fakegato: {
                    eve:               "door",
                    status:            "StatusActive",
                    storage:           "fs",
                    storagePath:       ".homebridge/FakegatoStorage",
                    folder:            "folderName",
                    keyPath:           "/place/to/store/my/keys/"
                 },
                 stateChangeResponseTime:     3,
                 state_cmd:            "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
              }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, `cmd4Platform is not an instance of Cmd4Platform` );

      assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4DoorAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Light is not an instance of Cmd4Accessory` );
      expect( cmd4DoorAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Door is not an instance of Cmd4Accessory` );

      done( );
   });

   it( `Test creation of Accessory with FakeGato power`, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "RotationDirection" },
                                         { characteristic: "RotationSpeed" },
                                         { characteristic: "On" }
                                       ],
               fakegato: {
                  eve:                 "energy",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "RotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, `cmd4Platform is not an instance of Cmd4Platform` );

      assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.equal( "", log.errBuf, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4FanAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Light is not an instance of Cmd4Accessory` );
      expect( cmd4FanAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Fan is not an instance of Cmd4Accessory` );

      done( );
   });

   it( `Test incorrect characteristic throws fakegato error `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "RotationDirection" },
                                         { characteristic: "On" }
                                       ],
               fakegato: {
                  eve:                 "energy",
                  // An invalid characteristic.
                  power:               "BadData",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Invalid characteristic "BadData" for fakegato to log of "power"./);

      done( );
   });

   it( `Test not defining polling characteristic throws fakegato error `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               name:                   "MyLight",
               displayName:            "MyLight",
               statusMsg:              true,
               type:                   "Lightbulb",
               on:                     0,
               brightness:             100,
               polling:                [ { characteristic: "On" },
                                         { characteristic: "Brightness" }
                                       ],
               state_cmd:              "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "RotationDirection" },
                                         { characteristic: "On" }
                                       ],
               fakegato: {
                  eve:                 "energy",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "rotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Characteristic: "rotationSpeed" for fakegato to log of "power" is not being polled.\nHistory can not be updated continiously./);

      done( );
   });

   it( `Test invalid Eve type throws error `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "RotationDirection" },
                                         { characteristic: "RotationSpeed" },
                                         { characteristic: "On" }
                                       ],
               fakegato: {
                  eve:                 "BadType",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "RotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Invalid fakegato eve type: "BadType". It must be one of \( energy, room, weather, door, motion, thermo, aqua \). Check the Cmd4 README at: "https:\/\/github.com\/simont77\/fakegato-history"/);

      done( );
   });

   it( `Test invalid fakegato key throws error `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "RotationDirection" },
                                         { characteristic: "RotationSpeed" },
                                         { characteristic: "On" }
                                       ],
               fakegato: {
                  eve:                 "energy",
                  badKey:              "badValue",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "RotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Invalid fakegato key: "badKey" in json.config for: "Myv1Fan"./);

      done( );
   });

   it( `Test uppercase FakeGato Key throws an error.  It Always did `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "rotationDirection" },
                                         { characteristic: "rotationSpeed" },
                                         { characteristic: "on" }
                                       ],
               fakegato: {
                  eve:                 "Energy",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "rotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect ( ( ) => cmd4Platform.discoverDevices( ) ).to.throw(/Invalid fakegato eve type: "Energy". It must be one of \( energy, room, weather, door, motion, thermo, aqua \). Check the Cmd4 README at: "https:\/\/github.com\/simont77\/fakegato-history"./);

      assert.equal( 2, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );


      done( );
   });

   it( `Test uppercase FakeGato Characteristic creates a warning `, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               type:                   "Fan",
               name:                   "Myv1Fan",
               rotationDirection:      1,
               rotationSpeed:          100,
               stateChangeResponseTime: 1,
               polling:                [ { characteristic: "rotationDirection" },
                                         { characteristic: "rotationSpeed" },
                                         { characteristic: "on" }
                                       ],
               fakegato: {
                  eve:                 "energy",
                  // rotationSpeed used as an example.
                  // Not really power characteristic
                  power:               "RotationSpeed",
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      let cmd4FanAccessory = cmd4Platform.createdCmd4Accessories[0];

      expect( cmd4FanAccessory ).to.be.a.instanceOf( Cmd4Accessory, `Fan is not an instance of Cmd4Accessory` );


      //assert.equal( "", log.logBuf, ` Cmd4Platform unexpected stdout received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mThe config.json FakeGato characteristic: RotationSpeed is Capitalized it should be: rotationSpeed.  In the near future this will be an Error so that Cmd4 can use homebridge-ui`, ` Cmd4Platform unexpected stderr received: ${ log.errBuf }` );
      assert.equal( 3, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );



      done( );
   });

   it( `Test FakeGato updateAccessoryAttribute creates a log for THERMO`, function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               type:                   "Thermostat",
               name:                   "MyThermostat",
               displayName:            "MyThermostat",
               currentHeatingCoolingState: "OFF",
               targetHeatingCoolingState:  "OFF",
               currentTemperature:     22.2,
               targetTemperature:      22.2,
               temperatureDisplayUnits: "CELSIUS",
               currentRelativeHumidity: 60,
               targetRelativeHumidity: 60,
               coolingThresholdTemperature: 21.4,
               heatingThresholdTemperature: 20.2,
               polling:                [ { characteristic: "currentTemperature" },
                                         { characteristic: "targetTemperature" }
                                       ],
               fakegato: {
                  eve:                 "thermo",
                  currentTemp:         "currentTemperature",
                  setTemp:             "targetTemperature",
                  valvePosition:       0,
                  storage:             "fs",
                  storagePath:         ".homebridge/FakegatoStorage",
                  folder:              "folderName",
                  keyPath:             "/place/to/store/my/keys/"
               },
               state_cmd:              "./test/echoScripts/echo_ACTIVE"
             }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, `Fan is not an instance of Cmd4Accessory` );



      assert.include( log.logBuf, `[39m Adding new platformAccessory: MyThermostat` );
      assert.include( log.logBuf, `35mConfiguring platformAccessory: \u001b[39mMyThermostat` );
      assert.equal( 2, log.logLineCount, ` Unexpected number of stdout lines:  ${ log.logBuf }` );
      //assert.equal( "", log.logBuf, ` Unexpected stdout: ${ log.logBuf }` );
      assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

      log.reset( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      cmd4Accessory.updateAccessoryAttribute( CMD4_ACC_TYPE_ENUM.CurrentTemperature, 18);


      assert.include( log.logBuf, `[39m \u001b[90mLogging currentTemp: 18 setTemp:22.2 valvePosition:0`, `Incorrect stdout: ${ log.logBuf }` );

      done( );
   });
});
