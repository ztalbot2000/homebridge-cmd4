"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
let constants = require( "../cmd4Constants" );



var _api = new HomebridgeAPI( ); // object we feed to Plugins


Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function ( ) { return logger_1.LogLevel; } });
const log = logger_1.Logger.internal;



// Init the library for all to use
let Characteristic = _api.hap.Characteristic;
let Service = _api.hap.Service;
let Categories = _api.hap.Categories;
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, Service, Characteristic, Categories );


let getSetValueScript = "./test/echoScripts/testGetSetValues.js";

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

describe( "Testing Cmd4Accessory", function( )
{
   it( "Test if Cmd4Accessory exists", function ( )
   {
      expect( Cmd4Accessory ).not.to.be.a( "null", "Cmd4Accessory was null" );
   });

   it( "Test init Cmd4Accessory", function( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Demo or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          Cmd4_Mode:                "Demo",
          DisplayName:              "My_Television",
          Category:                 "TELEVISION",
          PublishExternally:        true,
          Active:                   "ACTIVE",
          ActiveIdentifier:          1234,
          Mute:                     true,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );
      hook.stop( );

      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "Cmd4Accessory is not an instance of Cmd4Accessory" );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( "Test Cmd4Accessory.setValue", function( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Demo or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          DisplayName:              "My_Television",
          Cmd4_Mode:                "Polled",
          Category:                 "TELEVISION",
          PublishExternally:         true,
          Active:                   "ACTIVE",
          ActiveIdentifier:          1234,
          Mute:                     true,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };

      TVConfig.state_cmd = "./test/echoScripts/echo_ACTIVE";
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );
      hook.stop( );

      assert.isFunction( cmd4Accessory.setValue, "Cmd4Accessory.setValue is not a function" );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( "setValue 1 should send 1 to script for ClosedCaption non constant request", function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          Cmd4_Mode:                "Polled",
          DisplayName:              "My_Television",
          Category:                 "TELEVISION",
          PublishExternally:        true,
          Active:                   "ACTIVE",
          ActiveIdentifier:          1234,
          Mute:                     true,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = TVConfig.DisplayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn1`;
      TVConfig.State_cmd_suffix = fn;
      TVConfig.State_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let expectedResult =`${value}`;
         let expectedOutput = `\u001b[39m\u001b[34mSetting My_Television ClosedCaptions\u001b[39m 1`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( hook.capturedLog( ), expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );
         assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setCachedValue unexpected error output received: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setCachedValue logged lines than one: ${ capturedErr }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `setValue 1, aka ENABLED should send "ENABLED" to script for constant request`, function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          Cmd4_Mode:                "Polled",
          OutputConstants:          true,
          DisplayName:              "My_Television",
          Category:                 "TELEVISION",
          PublishExternally:        true,
          Active:                   "ACTIVE",
          ActiveIdentifier:          1234,
          Mute:                     true,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = TVConfig.DisplayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn2`;
      TVConfig.State_cmd_suffix = fn;

      TVConfig.State_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let expectedResult = "ENABLED";
         let expectedOutput = `\u001b[39m\u001b[34mSetting My_Television ClosedCaptions\u001b[39m ENABLED`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( hook.capturedLog( ), expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );
         assert.equal( 1, logLines, ` setValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setValue unexpected error output received: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setValue logged Error lines more than one: ${ capturedErr }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `Cmd4Accessory should generate warning for publishExternally`, function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          Cmd4_Mode:                "Polled",
          OutputConstants:          true,
          DisplayName:              "My_Television",
          Category:                 "TELEVISION",
          PublishExternally:        true,
          Active:                   "ACTIVE",
          ActiveIdentifier:          1234,
          Mute:                     true,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let fn = `/tmp/fn2`;
      TVConfig.State_cmd_suffix = fn;

      TVConfig.State_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, null );

      hook.stop( );
      let capturedLog = hook.capturedLog( );
      let capturedErr = hook.capturedErr( );
      let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
      let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

      let expectedPublishedOutput = `\u001b[39m\u001b[33mTelevisions should be Platform Accessories with "publishExternally": true,`;

      assert.include( capturedErr, expectedPublishedOutput, ` Cmd4Accessory output expected: ${ expectedPublishedOutput } received: ${ hook.capturedLog() }` );
      assert.equal( 1, logLines, ` Cmd4Accessory logged lines than one: ${ capturedLog }` );
      assert.equal( 1, errLines, ` Cmd4Accessory logged Error lines more than one: ${ capturedErr }` );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( "setValue true should send 0 to script for Mute request", function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let TVConfig =
      {
          Name:                     "My_Television",
          Type:                     "Television",
          Cmd4_Mode:                "Demo",
          DisplayName:              "My_Television",
          Active:                   true,
          Category:                 "TELEVISION",
          PublishExternally:        true,
          ActiveIdentifier:          1234,
          Mute:                     1,
          ConfiguredName:           "My_Television",
          SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          Brightness:                8,
          ClosedCaptions:           "DISABLED",
          CurrentMediaState:        "STOP",
          TargetMediaState:         "STOP",
          PictureMode:              "STANDARD",
          RemoteKey:                "SELECT"
      };

      let acc = CMD4_ACC_TYPE_ENUM.Mute;
      let DEVICE = TVConfig.DisplayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;
      let fn = `/tmp/fn3`;
      TVConfig.State_cmd_suffix = fn;

      TVConfig.State_cmd = `node ${ process.cwd( ) }/${ getSetValueScript }`;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, STORED_DATA_ARRAY, parentInfo );

      let value = true;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let expectedResult = 1;
         let expectedOutput = `\u001b[39m\u001b[34mSetting My_Television Mute\u001b[39m 1`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( capturedLog, expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );
         assert.equal( 1, logLines, ` setValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setValue unexpected error output received: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setValue logged Error lines more than one: ${ capturedErr }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `setValue of cached "Target*" characteristic, should set "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         Type:                       "Thermostat",
         Name:                       "Thermostat",
         Cmd4_Mode:                  "Demo",
         DisplayName:                "Thermostat",
         TemperatureDisplayUnits:    "CELSIUS",
         Active:                     "INACTIVE",
         CurrentTemperature:          20.0,
         TargetTemperature:           20.0,
         CurrentHeatingCoolingState:  0,
         TargetHeatingCoolingState:   0,
         StateChangeResponseTime:     3
      };

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );

      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, STORED_DATA_ARRAY, null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let expectedResult = value;
         let expectedOutput = `\u001b[39m\u001b[34mSetting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`;

         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( capturedLog, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ hook.capturedLog() }` );
         assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setCachedValue unexpected error output received: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setCachedValue err lines than one: ${ capturedErr }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, expectedResult, " setValue relatedCurrentAccTypeEnumIndex expected: " + expectedResult + " to be stored.  found: " + result );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `setValue of cached "Target*" characteristic, should set ALSO "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         type:                       "Thermostat",
         Name:                       "Thermostat",
         Cmd4_Mode:                  "Demo",
         DisplayName:                "Thermostat",
         TemperatureDisplayUnits:    "CELSIUS",
         Active:                     "INACTIVE",
         CurrentTemperature:          20.0,
         TargetTemperature:           20.0,
         CurrentHeatingCoolingState:  0,
         TargetHeatingCoolingState:   0,
         StateChangeResponseTime:     3
      };

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, STORED_DATA_ARRAY, null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let alsoExpectedOutput = `\u001b[39m\u001b[34mAlso Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`;
         let expectedOutput = `\u001b[39m\u001b[34mSetting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`;
         let expectedResult = value;

         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( capturedLog, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ capturedLog }` );
         assert.include( capturedLog, alsoExpectedOutput, ` setCachedValue output ALSO expected: ${ alsoExpectedOutput } received: ${ capturedLog }` );
         assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setCachedValue unexpected error output received: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setCachedValue err lines than one: ${ capturedErr }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, expectedResult, " setValue relatedCurrentAccTypeEnumIndex expected: " + expectedResult + " to be stored.  found: " + result );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });

   it( `Missing required characteristic should generate a warning and add the characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         Type:                        "Thermostat",
         Name:                        "Thermostat",
         Cmd4_Mode:                   "Demo",
         DisplayName:                 "Thermostat",
         TemperatureDisplayUnits:     "CELSIUS",
         Active:                      "INACTIVE",
         CurrentTemperature:           20.0,
         CurrentHeatingCoolingState:   0,
         TargetHeatingCoolingState:    0,
         StateChangeResponseTime:      3
      };

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, STORED_DATA_ARRAY, null );

      hook.stop( );
      let capturedLog = hook.capturedLog( );
      let capturedErr = hook.capturedErr( );
      let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
      let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

      let expectedOutput = "";
      let expectedErrOutput1 = `m**** Adding required characteristic TargetTemperature for Thermostat`;
      let expectedErrOutput2 = `Not defining a required characteristic can be problematic`;

      assert.include( capturedLog, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ capturedLog }` );
      assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
      assert.include( capturedErr, expectedErrOutput1, ` setCachedValue output expected: ${ expectedErrOutput1 } received: ${ capturedErr }` );
      assert.include( capturedErr, expectedErrOutput2, ` setCachedValue output expected: ${ expectedErrOutput2 } received: ${ capturedErr }` );
      assert.equal( 1, errLines, ` setCachedValue logged lines than one: ${ capturedErr }` );

      let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[ cmd4Accessory.typeIndex ].requiredCharacteristics.find( key => key.type ===  acc ).defaultValue;

      let result = cmd4Accessory.getStoredValueForIndex( acc );
      assert.equal(result, defaultValue, ` setValue ${ acc } expected: ${ defaultValue } to be stored.  found: ${ result }` );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });

   it( `Missing Optional characteristic should generate a warning and add the characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         Type:                         "Thermostat",
         Name:                         "Thermostat",
         Cmd4_Mode:                    "Demo",
         DisplayName:                  "Thermostat",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "INACTIVE",
         CurrentTemperature:            20.0,
         TargetTemperature:             20.0,
         CurrentHeatingCoolingState:    0,
         // targetHeatingCoolingState:  0,
         StateChangeResponseTime:       3
      };

      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      new Cmd4Accessory( log, ThermostatConfig, _api, STORED_DATA_ARRAY, null );

      hook.stop( );
      let capturedLog = hook.capturedLog( );
      let capturedErr = hook.capturedErr( );
      let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
      let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

      let expectedErrOutput = `3m**** Adding required characteristic TargetHeatingCoolingState for Thermostat`;

      assert.equal( capturedLog, "", ` setCachedValue logged some output. received: ${ hook.capturedLog() }` );
      assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
      assert.include( capturedErr, expectedErrOutput, ` setCachedValue output expected: ${ expectedErrOutput } received: ${ capturedErr }` );
      assert.equal( 1, errLines, ` setCachedValue logged lines than one: ${ capturedErr }` );

      // Clear the hook buffer for next time.
      hook.reset( );

      done( );
   });


   it( `setValue of cached characteristic , should not set Current*" characteristic on TemperatureSensor`, function ( done )
   {
      // A config file to play with.
      let TempSensorConfig =
      {
         Type:                     "TemperatureSensor",
         Name:                     "TemperatureSensor",
         Cmd4_Mode:                "Demo",
         DisplayName:              "TemperatureSensor",
         TemperatureDisplayUnits:  "CELSIUS",
         Active:                   "INACTIVE",
         CurrentTemperature:        20.0
      };

      let acc = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
      let STORED_DATA_ARRAY = [ ];

      hook.start( );
      let cmd4Accessory = new Cmd4Accessory( log, TempSensorConfig, _api, STORED_DATA_ARRAY, null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         hook.stop( );
         let capturedLog = hook.capturedLog( );
         let capturedErr = hook.capturedErr( );
         let logLines = (capturedLog.split(/\r\n|\r|\n/)).length;
         let errLines = (capturedErr.split(/\r\n|\r|\n/)).length;

         let expectedResult = value;
         let expectedOutput = `\u001b[39m\u001b[34mSetting (Cached) TemperatureSensor CurrentTemperature\u001b[39m 12.3`;

         let result = cmd4Accessory.getStoredValueForIndex( acc );


         assert.include( capturedLog, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ capturedLog }` );
         assert.equal( 1, logLines, ` setCachedValue logged lines than one: ${ capturedLog }` );
         assert.equal( "", capturedErr, ` setCachedValue logged an error: ${ capturedErr }` );
         assert.equal( 1, errLines, ` setCachedValue logged lines than one: ${ capturedErr }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedTargetAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedTargetAccTypeEnumIndex );
         assert.isNull(result, ` getValue TargetAccTypeEnumIndex expected null to be stored.  found: ${ result }` );

         // Clear the hook buffer for next time.
         hook.reset( );

         done( );
      });
   });
});
