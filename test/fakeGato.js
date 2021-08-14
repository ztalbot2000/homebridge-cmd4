#!node


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );

let Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;


let Logger = require( "../utils/Logger" );



var _api = new HomebridgeAPI( ); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

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

   });

   it( "Test if Cmd4Platform exists", function ( )
   {
      expect( Cmd4Platform ).not.to.be.a( "null", "Cmd4Platform was null" );
   });

   it( "Test creation of Accessory with FakeGato Thermo", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { characteristic: "on" },
                                               { characteristic: "brightness" }
                                             ],
               State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                         "Thermostat",
               Name:                         "Thermostat",
               DisplayName:                  "Thermostat",
               TemperatureDisplayUnits:      "CELSIUS",
               Active:                       "INACTIVE",
               CurrentTemperature:            20.0,
               TargetTemperature:             20.0,
               CurrentHeatingCoolingState:    0,
               TargetHeatingCoolingState:     0,
               StateChangeResponseTime:       1,
               polling:                       [ { characteristic: "CurrentTemperature" },
                                                { characteristic: "TargetTemperature" }
                                              ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice",
               fakegato: { eve:          "thermo",
                           currentTemp:  "currentTemperature",
                           setTemp:      "targetTemperature",
                           valvePosition: 0,
                           storage:      "fs",
                           storagePath:  ".homebridge/FakegatoStorage",
                           folder:       "folderName",
                           keyPath:      "/place/to/store/my/keys/"
                         }

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

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4ThermostatAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Light is not an instance of Cmd4Accessory" );
      expect( cmd4ThermostatAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Thermostat is not an instance of Cmd4Accessory" );

      done( );
   });

   it( "Test creation of Accessory with FakeGato room", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { characteristic: "on" },
                                               { characteristic: "brightness" }
                                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                         "Thermostat",
               Name:                         "Thermostat",
               DisplayName:                  "Thermostat",
               TemperatureDisplayUnits:      "CELSIUS",
               Active:                       "INACTIVE",
               CurrentTemperature:            20.0,
               TargetTemperature:             20.0,
               CurrentHeatingCoolingState:    0,
               TargetHeatingCoolingState:     0,
               CurrentRelativeHumidity:       44,
               StateChangeResponseTime:       1,
               polling:                       [ { characteristic: "CurrentTemperature" },
                                                { characteristic: "TargetTemperature" },
                                                { characteristic: "CurrentRelativeHumidity" }
                                              ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice",
               fakegato: { eve:          "room",
                           temp:         "CurrentTemperature",
                           humidity:     "CurrentRelativeHumidity",
                           storage:      "fs",
                           storagePath:  ".homebridge/FakegatoStorage"
                         }

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

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4ThermostatAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Light is not an instance of Cmd4Accessory" );
      expect( cmd4ThermostatAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Thermostat is not an instance of Cmd4Accessory" );

      done( );
   });

   it( "Test creation of Accessory with FakeGato door", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { "characteristic": "on" },
                                               { "characteristic": "brightness" }
                                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
                 type:                       "Door",
                 name:                       "My_Door",
                 currentPosition:             0,
                 targetPosition:              0,
                 contactSensorState:         "CONTACT_DETECTED",
                 holdPosition:               "FALSE",
                 obstructionDetected:        "FALSE",
                 statusActive:               0,
                 statusFault:                0,
                 polling:                    [ { characteristic: "statusActive" },
                                               { characteristic: "statusFault" }
                                             ],
                 fakegato: { eve:         "door",
                             status:      "statusActive",
                             storage:     "fs",
                             storagePath: ".homebridge/FakegatoStorage",
                             folder:      "folderName",
                             keyPath:     "/place/to/store/my/keys/"
                           },
                 stateChangeResponseTime:     3,
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

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4DoorAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Light is not an instance of Cmd4Accessory" );
      expect( cmd4DoorAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Door is not an instance of Cmd4Accessory" );

      done( );
   });

   it( "Test creation of Accessory with FakeGato power", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { "characteristic": "on" },
                                               { "characteristic": "brightness" }
                                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                         "Fan",
               name:                         "My_v1Fan",
               rotationDirection:             1,
               rotationSpeed:                 100,
               stateChangeResponseTime:       1,
               polling:                      [ { characteristic: "rotationDirection" },
                                               { characteristic: "rotationSpeed" },
                                               { characteristic: "On" }
                                             ],
               fakegato: { eve:          "energy",
                           // rotationSpeed used as an example.
                           // Not really power characteristic
                           power:        "rotationSpeed",
                           storage:      "fs",
                           storagePath:  ".homebridge/FakegatoStorage",
                           folder:       "folderName",
                           keyPath:      "/place/to/store/my/keys/"
                          },
               state_cmd: "node .homebridge/Cmd4Scripts/State.js"
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

      cmd4Platform.discoverDevices( );

      let cmd4LightAccessory = cmd4Platform.createdCmd4Accessories[0];
      let cmd4FanAccessory = cmd4Platform.createdCmd4Accessories[1];

      expect( cmd4LightAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Light is not an instance of Cmd4Accessory" );
      expect( cmd4FanAccessory ).to.be.a.instanceOf( Cmd4Accessory, "Fan is not an instance of Cmd4Accessory" );

      done( );
   });

   it( "Test incorrect characteristic throws fakegato error ", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { "characteristic": "on" },
                                               { "characteristic": "brightness" }
                                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                         "Fan",
               name:                         "My_v1Fan",
               rotationDirection:             1,
               rotationSpeed:                 100,
               stateChangeResponseTime:       1,
               polling:                      [ { characteristic: "rotationDirection" },
                                               { characteristic: "On" }
                                             ],
               fakegato: { eve:          "energy",
                           // An invalid characteristic.
                           power:        "BadData",
                           storage:      "fs",
                           storagePath:  ".homebridge/FakegatoStorage",
                           folder:       "folderName",
                           keyPath:      "/place/to/store/my/keys/"
                          },
               state_cmd: "node .homebridge/Cmd4Scripts/State.js"
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

   it( "Test not defining polling characteristic throws fakegato error ", function( done )
   {
      let platformConfig =
      {
         accessories: [
            {
               Name:                         "My_Light",
               DisplayName:                  "My_Light",
               StatusMsg:                    true,
               Type:                         "Lightbulb",
               On:                           0,
               Brightness:                   100,
               polling:                      [ { "characteristic": "on" },
                                               { "characteristic": "brightness" }
                                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            },
            {
               type:                         "Fan",
               name:                         "My_v1Fan",
               rotationDirection:             1,
               rotationSpeed:                 100,
               stateChangeResponseTime:       1,
               polling:                      [ { characteristic: "rotationDirection" },
                                               { characteristic: "On" }
                                             ],
               fakegato: { eve:          "energy",
                           // rotationSpeed used as an example.
                           // Not really power characteristic
                           power:        "rotationSpeed",
                           storage:      "fs",
                           storagePath:  ".homebridge/FakegatoStorage",
                           folder:       "folderName",
                           keyPath:      "/place/to/store/my/keys/"
                          },
               state_cmd: "node .homebridge/Cmd4Scripts/State.js"
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

});
