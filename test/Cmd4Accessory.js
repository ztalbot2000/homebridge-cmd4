"use strict";


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI(); // object we feed to Plugins

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

var Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;

// Unfortunately this test never exits, because polling will start.
// Warn the user of such
// Note: Not true anymore as polling moved to Platform.
//function abort()
//{
//   console.log("Test of Cmd4Accessory requires CTRL-c as polling was backgrounded");
//   setTimeout( abort, 1800 );
//}
//setTimeout( ( ) => { abort(); }, 1800 );

// The State_cmd is called from $HOME
const home = require( "os" ).homedir();
// THIS IS WHAT SCREWS UP THE THE UNIT TEST CASES IN Cmd4AccessoryGetValues! !!!
//process.chdir( home );
//


// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{
   // it('log should be a function', ( ) =>
   // {
   //    assert.isFunction( log, "log is not an function" );
   // });

   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, "Characteristic is not an function" );
   });

   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, "Accessory is not an function" );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Service, "_api.hap.Service is not an function" );
   });

   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

// ******** TEST Cmd4Accessory *************
describe('A simple Cmd4Accessory Test', ( ) =>
{
   let config={ name:      "Test Switch",
                type:      "Switch",
                Cmd4_Mode:  constants.CMD4_MODE_DEMO,
                on:         false
              };
   it( "Test can create an instance of Cmd4Accessory", ( ) =>
   {
      let parentInfo = undefined;

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

   });
});

describe('A simple Cmd4Accessory Test Debbuging enabled', ( ) =>
{
   let config={ name:      "Test Switch",
                type:      "Switch",
                Cmd4_Mode:  constants.CMD4_MODE_DEMO,
                on:         false
              };
   it( "Test can create an instance of Cmd4Accessory with Debug Enabled", ( ) =>
   {
      let parentInfo = undefined;


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );


   });
});


describe('Test Cmd4Accessory variables ', ( ) =>
{
   let config={ name:      "Test Switch",
                type:      "Switch",
                Cmd4_Mode:  constants.CMD4_MODE_DEMO,
                on:         false
              };
   it( "Test typeIndex of a Switch set correctly ", ( ) =>
   {
      let parentInfo = undefined;

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

      assert.equal( accessory.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, "Expected typeIndex: %s Found: %s" , CMD4_DEVICE_TYPE_ENUM.Switch, accessory.typeIndex );
   });

   let parentInfo = undefined;
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      // Cannot create an accessory information of an accessory information
      if ( index == CMD4_DEVICE_TYPE_ENUM.AccessoryInformation )
      {
         continue;
      }

      it( "Test typeIndex of all possible devices ", ( ) =>
      {

         config.name = "MY_" + CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;
         config.type = CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;


         let log = new Logger( );
         log.setOutputEnabled( false );
         log.setBufferEnabled( );
         let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

         assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );

         assert.equal( accessory.typeIndex , index, "Expected typeIndex: %s for: %s. Found: %s" , index, config.type, accessory.typeIndex );

      });
   }
});

describe('Cmd4Accessory Test get/test/set storedValues', ( ) =>
{
   let config={ name:      "Test Switch",
                type:      "Switch",
                Cmd4_Mode:  constants.CMD4_MODE_DEMO,
                on:         false
              };
   it( "Check that STORED_DATA_ARRAY is created", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.isArray( accessory.STORED_DATA_ARRAY, "Expected accessory.STORED_DATA_ARRAY to be an Array. Found %s" , typeof accessory.STORED_DATA_ARRAY );

   });
   it( "Check that Array STORED_DATA_ARRAY.storedValuesPerCharacteristic is created", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.isArray( accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic to be an Array. Found %s" , typeof accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic );

   });

   it( "Check that storedValuesPerCharacteristic Array size is:  " + ACC_EOL, ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic.length, ACC_EOL, "Expected storedValuesPerCharacteristic to size: %s. Found %s" , ACC_EOL, accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic.length );

   });
   it( "Check that storedValuesPerCharacteristic is set correctly for a switch", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }

   });
   it( "Check that setStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }

   });

   it( "Check getStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[ index ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic[%s] is: Null. Found %s" , index, value );
      }
      let result = accessory.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( result, config.On, "Expected getStoredValueForIndex to return: %s. Found %s" , config.On, result );

   });
   it( "Check testStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = accessory.testStoredValueForIndex( index );
         if ( index == accIndex )
            assert.equal( value, config.On, "Expected accessory.testStoredValueForIndex[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );
      }

   });
   it( "Check testStoredValueForIndex limits returns undefined", ( ) =>
   {
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let index = -1;

      let value = accessory.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );

      index = ACC_EOL + 1;
      value = accessory.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );

   });
});
describe('Cmd4Accessory Test determineCharacteristicsToPollOfAccessoryAndItsChildren', ( ) =>
{
   afterEach( function( )
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
      settings.listOfCreatedPriorityQueues = { };
      settings.arrayOfPollingCharacteristics = [ ];
   });

   it( "Check that storedValuesPerCharacteristic gets created", function( done )
   {
      let config={ name: "Test Switch",
                   type: "Switch",
                   on:   false,
                   state_cmd: `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
                   interval: 10,                // seconds
                   StateChangeResponseTime: 1,  // seconds
                   timeout: 6000,               // msec
                   polling: true
                 };
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.isArray( accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic, Cmd4Accessory, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic to be an Array. Found %s" , typeof accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic );

      done( );
   });

   it( "Check that storedValuesPer Array size is:  " + ACC_EOL, ( ) =>
   {
      let config={ name: "Test Switch",
                   type: "Switch",
                   on:   false,
                   state_cmd: `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
                   interval: 10,                // seconds
                   StateChangeResponseTime: 1,  // seconds
                   timeout: 6000,               // msec
                   polling: true
                 };
      let STORED_DATA_ARRAY = [ ];

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic.length, ACC_EOL, "Expected accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic to size: %s. Found %s" , ACC_EOL, accessory.STORED_DATA_ARRAY[0].storedValuesPerCharacteristic.length );

   });

   it('Polling complains related polling characteristic is missing', ( done ) =>
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
               polling:      [ { "characteristic": "CurrentPosition" },
                               { "characteristic": "PositionState" }
                             ],
               State_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
            }
         ]
      }

      assert.equal( settings.arrayOfPollingCharacteristics.length, 0, `Incorrect number of Initial polling characteristics` );

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      this.config = platformConfig.accessories;
      cmd4Platform.discoverDevices( );

      let expectedErrOutput1 = `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentPosition" requested, you also must do polling of "TargetPosition" or things will not function properl`;

      assert.include( log.errBuf, expectedErrOutput1 , `expected stderr: ${ log.errBuf }` );

      done( );
   });

   it( "Test Polling generates log.if related characteristic not polled also", function( )
   {
      let thermostatConfig =
      {
         Type:                        "Thermostat",
         Name:                        "Thermostat",
         Cmd4_Mode:                   "Polled",
         DisplayName:                 "Thermostat",
         TemperatureDisplayUnits:     "CELSIUS",
         Active:                      "Inactive",
         CurrentTemperature:           20.0,
         TargetTemperature:            20.0,
         CurrentHeatingCoolingState:   0,
         TargetHeatingCoolingState:    0,
         Polling: [{"characteristic": "currentTemperature", "interval": 60, "timeout":2000}],
         State_cmd: "./test/echoScripts/echo_quoted0"
      };
      let parentInfo = { };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      let expectedErrOutput1 = `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentTemperature" requested, you also must do polling of "TargetTemperature" or things will not function properly`;

      assert.equal( log.logBuf, "", ` cmd4Accessory output expected: "" received: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

   });

   it( "Test Polling generates log for linked accessory if related characteristic not polled also", function( )
   {
      let thermostatConfig =
      {
         Type:                        "Thermostat",
         Name:                        "Thermostat",
         Cmd4_Mode:                   "Polled",
         DisplayName:                 "Thermostat",
         TemperatureDisplayUnits:     "CELSIUS",
         Active:                      "Inactive",
         CurrentTemperature:           20.0,
         TargetTemperature:            20.0,
         LinkedTypes:
         {
            Type:                        "Thermostat",
            Name:                        "Linked_Thermostat",
            Cmd4_Mode:                   "Polled",
            DisplayName:                 "Linked_Thermostat",
            TemperatureDisplayUnits:     "CELSIUS",
            Active:                      "Inactive",
            CurrentTemperature:           20.0,
            TargetTemperature:            20.0,
            CurrentHeatingCoolingState:   0,
            TargetHeatingCoolingState:    0,
            Polling: [{"characteristic": "currentTemperature", "interval": 60, "timeout":2000}],
            State_cmd: "./test/echoScripts/echo_quoted0"
         },
         CurrentHeatingCoolingState:   0,
         TargetHeatingCoolingState:    0,
         Polling: [{"characteristic": "currentTemperature", "interval": 60, "timeout":2000},
                   {"characteristic": "targetTemperature", "interval": 60, "timeout":2000}],
         State_cmd: "./test/echoScripts/echo_quoted0"
      };
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.include( log.logBuf, `Creating linked accessories for: Thermostat`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentTemperature" requested, you also must do polling of "TargetTemperature" or things will not function properly`, ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

   });

   it( "Test Polling generates log for Added accessory if related characteristic not polled also", function( )
   {
      let platformConfig=
      {
         Type:                        "Thermostat",
         Name:                        "Thermostat",
         Cmd4_Mode:                   "Polled",
         DisplayName:                 "Thermostat",
         TemperatureDisplayUnits:     "CELSIUS",
         Active:                      "Inactive",
         CurrentTemperature:           20.0,
         TargetTemperature:            20.0,
         CurrentHeatingCoolingState:   0,
         TargetHeatingCoolingState:    0,
         Polling: [{ characteristic: "CurrentTemperature" },
                   { characteristic: "TargetTemperature" }
                  ],
         State_cmd: "./test/echoScripts/echo_quoted0",
         accessories: [
         {
            Accessory: "Cmd4",
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "GarageDoorOpener",
            DisplayName: "StandaloneDoorOpener",
            Name: "StandaloneDoorOpener",
            CurrentDoorState: "CLOSED",
            TargetDoorState: "CLOSED",
            ObstructionDetected: "1",
            Polling: [ { characteristic: "CurrentDoorState" },
                    // { characteristic: "TargetDoorState" },
                       { characteristic: "ObstructionDetected" }
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentDoorState" requested, you also must do polling of "TargetDoorState" or things will not function properly`, ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

   });


   it( "Test Polling generates log for Standalone accessory if related characteristic not polled also", function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Accessory: "Cmd4",
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "GarageDoorOpener",
            DisplayName: "StandaloneDoorOpener",
            Name: "StandaloneDoorOpener",
            CurrentDoorState: "CLOSED",
            TargetDoorState: "CLOSED",
            ObstructionDetected: "1",
            Polling: [ { characteristic: "CurrentDoorState" },
                    // { characteristic: "TargetDoorState" },
                       { characteristic: "ObstructionDetected" }
                     ],
            State_cmd: "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }],
         platforms: [
         {
            Platform: "Cmd4",
            OutputConstants: false,
            RestartRecover: true,
            Cmd4_Mode: "Always",
            Accessories: [
            {
               Type:                        "Thermostat",
               Name:                        "Thermostat",
               Cmd4_Mode:                   "Polled",
               DisplayName:                 "Thermostat",
               TemperatureDisplayUnits:     "CELSIUS",
               Active:                      "Inactive",
               CurrentTemperature:           20.0,
               TargetTemperature:            20.0,
               CurrentHeatingCoolingState:   0,
               TargetHeatingCoolingState:    0,
               Polling: [{ characteristic: "CurrentTemperature" },
                         { characteristic: "TargetTemperature" }
                        ],
               State_cmd: "./test/echoScripts/echo_quoted0"
           }]
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With Cmd4_Mode set to "Polled" and polling for "CurrentDoorState" requested, you also must do polling of "TargetDoorState" or things will not function properly`, ` cmd4Accessory stderr output expected: "" received: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is generated for related "Polled"`, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Accessory: "Cmd4",
            Cmd4_Mode: "Polled",
            StatusMsg: true,
            Type: "GarageDoorOpener",
            DisplayName: "StandaloneDoorOpener",
            Name: "StandaloneDoorOpener",
            CurrentDoorState: "CLOSED",
            TargetDoorState: "CLOSED",
            ObstructionDetected: "1",
            Polling: [ { characteristic: "CurrentDoorState" },
                       { characteristic: "TargetDoorState" },
                       { characteristic: "ObstructionDetected" }
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


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for StandaloneDoorOpener characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding setValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for StandaloneDoorOpener characteristic: CurrentDoorState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getValue for StandaloneDoorOpener characteristic: ObstructionDetected`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is *NOT* generated for related "Polled" TemperatureSensors`, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Accessory: "Cmd4",
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
      assert.include( log.logBuf, `[33mAdding getValue for TemperatureSensor characteristic: CurrentTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.notInclude( log.logBuf, `[33mAdding setValue for TemperatureSensor characteristic: TargetTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );

   });


   it( `Test that adding "queued" Target message is generated for related "Polled"`, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            Type:                        "Thermostat",
            Name:                        "Thermostat",
            Cmd4_Mode:                   "Polled",
            DisplayName:                 "Thermostat",
            TemperatureDisplayUnits:     "CELSIUS",
            CurrentTemperature:           20.0,
            TargetTemperature:            20.0,
            CurrentHeatingCoolingState:   0,
            TargetHeatingCoolingState:    0,
            QueueTypes: [{ queue: "A", queueType: "WoRm" }],
            Queue:        "A",
            Polling: [{ characteristic: "CurrentTemperature" },
                      { characteristic: "TargetTemperature" },
                      { characteristic: "CurrentHeatingCoolingState" },
                      { characteristic: "TargetHeatingCoolingState" }
                     ],
            State_cmd: "./test/echoScripts/echo_quoted0"
        }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );



      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Thermostat`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: Thermostat`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Thermostat`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for Thermostat characteristic: Name`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentTemperature`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentHeatingCoolingState`, ` cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Accessory stderr output Unexpected stderr: ${ log.errBuf }` );

   });

});

