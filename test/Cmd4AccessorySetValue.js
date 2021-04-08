"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
let constants = require( "../cmd4Constants" );



var _api = new HomebridgeAPI( ); // object we feed to Plugins


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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], null );

      assert.isFunction( cmd4Accessory.setValue, "Cmd4Accessory.setValue is not a function" );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult =`${value}`;
         let expectedOutput = `Setting My_Television ClosedCaptions\u001b[39m 1`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );


         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult = "ENABLED";
         let expectedOutput = `Setting My_Television ClosedCaptions\u001b[39m ENABLED`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ log.logBuf}` );
         assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      new Cmd4Accessory( log, TVConfig, _api, [ ], null );

      let expectedPublishedOutput = `Televisions should be Platform Accessories with "publishExternally": true,`;

      assert.include( log.errBuf, expectedPublishedOutput, `Cmd4Accessory output expected: ${ expectedPublishedOutput } received: ${ log.logBuf }` );
      assert.equal( 0, log.logLineCount, ` Cmd4Accessory logged lines than one: ${ log.logBuf }` );
      assert.equal( 1, log.errLineCount, ` Cmd4Accessory logged Error lines more than one: ${ log.errBuf }` );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      // Required to resolve publishExternally Television
      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );

      let value = true;

      cmd4Accessory.setValue( acc, value,  function( )
      {
         let expectedResult = 1;
         let expectedOutput = `Setting My_Television Mute\u001b[39m 1`;

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, expectedOutput, ` setValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         assert.equal( sentResult, expectedResult, " setValue expected: " + expectedResult + " received: " + sentResult );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         let expectedResult = value;
         let expectedOutput = `Setting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`;
         let alsoExpectedOutput = `Also Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`;

         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.include( log.logBuf, alsoExpectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.equal( 2, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, expectedResult, " setValue relatedCurrentAccTypeEnumIndex expected: " + expectedResult + " to be stored.  found: " + result );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         let alsoExpectedOutput = `Also Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`;
         let expectedOutput = `Setting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`;
         let expectedResult = value;

         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.include( log.logBuf, alsoExpectedOutput, ` setCachedValue output ALSO expected: ${ alsoExpectedOutput } received: ${ log.logBuf }` );
         assert.equal( 2, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, expectedResult, " setValue relatedCurrentAccTypeEnumIndex expected: " + expectedResult + " to be stored.  found: " + result );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let expectedErrOutput1 = `m**** Adding required characteristic TargetTemperature for Thermostat`;
      let expectedErrOutput2 = `Not defining a required characteristic can be problematic`;

      assert.equal( log.logBuf, "", ` setCachedValue output expected nothing to stdout` );
      assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput1, ` setCachedValue output expected: ${ expectedErrOutput1 } received: ${ log.errBuf }` );
      assert.include( log.errBuf, expectedErrOutput2, ` setCachedValue output expected: ${ expectedErrOutput2 } received: ${ log.errBuf }` );
      assert.equal( 2, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

      let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[ cmd4Accessory.typeIndex ].requiredCharacteristics.find( key => key.type ===  acc ).defaultValue;

      let result = cmd4Accessory.getStoredValueForIndex( acc );
      assert.equal(result, defaultValue, ` setValue ${ acc } expected: ${ defaultValue } to be stored.  found: ${ result }` );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let expectedErrOutput = `**** Adding required characteristic TargetHeatingCoolingState for Thermostat`;
      let expectedErrOutput2= `Not defining a required characteristic can be problematic`;

      assert.equal( log.logBuf, "", ` setCachedValue logged some output. received: ${ log.logBuf }` );
      assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, expectedErrOutput, ` setCachedValue output expected: ${ expectedErrOutput } received: ${ log.errBuf }` );
      assert.include( log.errBuf, expectedErrOutput2, ` setCachedValue output expected: ${ expectedErrOutput } received: ${ log.errBuf }` );
      assert.equal( 2, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

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

      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );
      let cmd4Accessory = new Cmd4Accessory( log, TempSensorConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.setCachedValue( acc, value,  function( )
      {
         let expectedResult = value;
         let expectedOutput = `Setting (Cached) TemperatureSensor CurrentTemperature\u001b[39m 12.3`;

         let result = cmd4Accessory.getStoredValueForIndex( acc );


         assert.include( log.logBuf, expectedOutput, ` setCachedValue output expected: ${ expectedOutput } received: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue logged an error: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

         assert.equal(result, expectedResult, " setValue expected: " + expectedResult + " to be stored.  found: " + result );

         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedTargetAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedTargetAccTypeEnumIndex );
         assert.isNull(result, ` getValue TargetAccTypeEnumIndex expected null to be stored.  found: ${ result }` );

         done( );
      });
   });
});
