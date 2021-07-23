"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
let { Cmd4Platform } = require( "../Cmd4Platform" );
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
      let platformConfig =
      {
         accessories:
         [{
             Name:                     "Television",
             Type:                     "Television",
             Cmd4_Mode:                "Demo",
             DisplayName:              "Television",
             Category:                 "TELEVISION",
             PublishExternally:        true,
             Active:                   "ACTIVE",
             ActiveIdentifier:          1234,
             Mute:                     true,
             ConfiguredName:           "Television",
             SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
             Brightness:                8,
             ClosedCaptions:           "DISABLED",
             CurrentMediaState:        "STOP",
             TargetMediaState:         "STOP",
             PictureMode:              "STANDARD",
             RemoteKey:                "SELECT"
         }]
      };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Television`, ` cmd4Accessory incorrect stdout": ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );

      assert.isFunction( cmd4Accessory.setValue, "Cmd4Accessory.setValue is not a function" );

      done( );
   });

   it( "setValue 1 should send 1 to script for ClosedCaption non constant request", function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let fn = `/tmp/fn1`;
      let platformConfig =
      {
         accessories:
         [{
            Name:                     "Television",
            Type:                     "Television",
            Cmd4_Mode:                "Polled",
            DisplayName:              "Television",
            Category:                 "TELEVISION",
            PublishExternally:        true,
            Active:                   "ACTIVE",
            ActiveIdentifier:          1234,
            Mute:                     true,
            ConfiguredName:           "Television",
            SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
            Brightness:                8,
            ClosedCaptions:           "DISABLED",
            CurrentMediaState:        "STOP",
            TargetMediaState:         "STOP",
            PictureMode:              "STANDARD",
            RemoteKey:                "SELECT",
            State_cmd_suffix:         fn,
            State_cmd:  `node ${ process.cwd( ) }/${ getSetValueScript }`
         }]
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );


      let value = Characteristic.ClosedCaptions.ENABLED;
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = cmd4Accessory.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;


      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );
      cmd4Accessory.setValue( acc, "ClosedCaptions", constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, value,  function( )
      {
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, `Setting Television ClosedCaptions\u001b[39m 1`, ` setValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected stderr: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );


         assert.equal( sentResult, value, " setValue incorrect value" );

         done( );
      });
   });

   it( `setValue 1, aka ENABLED should send "ENABLED" to script for constant request`, function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let fn = `/tmp/fn2`;
      let platformConfig =
      {
         accessories:
         [{
             Name:                     "Television",
             Type:                     "Television",
             Cmd4_Mode:                "Polled",
             OutputConstants:          true,
             DisplayName:              "Television",
             Category:                 "TELEVISION",
             PublishExternally:        true,
             Active:                   "ACTIVE",
             ActiveIdentifier:          1234,
             Mute:                     true,
             ConfiguredName:           "Television",
             SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
             Brightness:                8,
             ClosedCaptions:           "DISABLED",
             CurrentMediaState:        "STOP",
             TargetMediaState:         "STOP",
             PictureMode:              "STANDARD",
             RemoteKey:                "SELECT",
             State_cmd:  `node ${ process.cwd( ) }/${ getSetValueScript }`,
             State_cmd_suffix:          fn
         }]
      };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );


      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.
      let acc = CMD4_ACC_TYPE_ENUM.ClosedCaptions;
      let DEVICE = cmd4Accessory.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;


      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );
      cmd4Accessory.setValue( acc, "ClosedCaptions", constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, value,  function( )
      {

         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, `Setting Television ClosedCaptions\u001b[39m ENABLED`, ` setValue incorrect stdout: ${ log.logBuf}` );
         assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         assert.equal( sentResult, "ENABLED", " setValue incorrect result" );

         done( );
      });
   });

   it( `Cmd4Accessory should generate warning for publishExternally`, function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let fn = `/tmp/fn2`;
      let platformConfig =
      {
         accessories:
         [{
             Name:                     "Television",
             Type:                     "Television",
             Cmd4_Mode:                "Polled",
             OutputConstants:          true,
             DisplayName:              "Television",
             Category:                 "TELEVISION",
             Active:                   "ACTIVE",
             ActiveIdentifier:          1234,
             Mute:                     true,
             ConfiguredName:           "Television",
             SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
             Brightness:                8,
             ClosedCaptions:           "DISABLED",
             CurrentMediaState:        "STOP",
             TargetMediaState:         "STOP",
             PictureMode:              "STANDARD",
             RemoteKey:                "SELECT",
             State_cmd: `node ${ process.cwd( ) }/${ getSetValueScript }`,
             State_cmd_suffix:         fn
         }]
      };

      // Note: We need a characteristic that does not have a verify characteristic
      // because the getSetValueScript can't seem to handle it. At least not yet.


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.log.reset( );
      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );


      assert.include( log.errBuf, `Televisions should be Platform Accessories with "PublishExternally": true`, `Cmd4Accessory incorrect stderr: ${ log.logBuf }` );
      assert.equal( 1, log.errLineCount, ` Cmd4Accessory logged Error lines more than one: ${ log.errBuf }` );

      done( );
   });

   it( "setValue true should send 0 to script for Mute request", function ( done )
   {
      // A config file to play with.
      // Setting Cmd4_Mode to Cached or Polled with no polled characteristics
      // makes polling not run and thus not having outstanding processes.
      let fn = `/tmp/fn3`;
      let platformConfig =
      {
         accessories:
         [{
            Name:                     "Television",
            Type:                     "Television",
            Cmd4_Mode:                "Demo",
            DisplayName:              "Television",
            Active:                   true,
            Category:                 "TELEVISION",
            PublishExternally:        true,
            ActiveIdentifier:          1234,
            Mute:                     1,
            ConfiguredName:           "Television",
            SleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
            Brightness:                8,
            ClosedCaptions:           "DISABLED",
            CurrentMediaState:        "STOP",
            TargetMediaState:         "STOP",
            PictureMode:              "STANDARD",
            RemoteKey:                "SELECT",
            State_cmd_suffix:         fn,
            State_cmd: `node ${ process.cwd( ) }/${ getSetValueScript }`
         }]
      };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Television`, ` cmd4Accessory incorrect stdout: ${ log.logBuf }` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      expect( cmd4Accessory ).to.be.a.instanceOf( Cmd4Accessory, "cmd4Accessory is not an instance of Cmd4Accessory" );


      let acc = CMD4_ACC_TYPE_ENUM.Mute;
      let DEVICE = cmd4Accessory.displayName;
      let CHARACTERISTIC = CMD4_ACC_TYPE_ENUM.properties[ acc ].type;

      let value = true;

      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );
      cmd4Accessory.setValue( acc, "Mute", constants.DEFAULT_TIMEOUT, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, value,  function( )
      {
         let newfn = `${ fn }_${ DEVICE }_${ CHARACTERISTIC }`;
         let INPUTS=require( `${ newfn }` );
         let sentResult = INPUTS.VALUE;

         assert.include( log.logBuf, `Setting Television Mute\u001b[39m 1`, ` setValue incorrect output. received: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.stdout }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         assert.equal( sentResult, 1, " setValue incorrect result" );

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
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.log.reset( );
      cmd4Accessory.setCachedValue( acc, "TargetTemperature", value,  function( )
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, `Setting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `Also Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( 2, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, value, " setValue incorrect storedValue.  found: " + result );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, value, " setValue relatedCurrentAccTypeEnumIndex incorrect stored value " );

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
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.log.reset( );
      cmd4Accessory.setCachedValue( acc, "TargetTemperature", value,  function( )
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, `Setting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `Also Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( 2, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected stderr: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, value, " setValue incorrect stored value" );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, value, " setValue relatedCurrentAccTypeEnum incorrect value" );

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
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      assert.equal( log.logBuf, "", ` setCachedValue output expected nothing to stdout` );
      assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, `m**** Adding required characteristic TargetTemperature for Thermostat`, ` setCachedValue incorrect stdout:${ log.errBuf }` );
      assert.include( log.errBuf, `Not defining a required characteristic can be problematic`, ` setCachedValue incorrect stdout: ${ log.errBuf }` );
      assert.equal( 2, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

      let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[ cmd4Accessory.typeIndex ].requiredCharacteristics.find( key => key.type ===  acc ).defaultValue;

      let result = cmd4Accessory.getStoredValueForIndex( acc );
      assert.equal(result, defaultValue, ` setValue incorrect stored value` );

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
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      assert.equal( log.logBuf, "", ` setCachedValue logged some output. received: ${ log.logBuf }` );
      assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, `**** Adding required characteristic TargetHeatingCoolingState for Thermostat`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );
      assert.include( log.errBuf, `Not defining a required characteristic can be problematic`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );
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
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Accessory = new Cmd4Accessory( log, TempSensorConfig, _api, [ ], null );

      let value = 12.3;

      cmd4Accessory.log.reset( );
      cmd4Accessory.setCachedValue( acc, "CurrentTemperature", value,  function( )
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );


         assert.include( log.logBuf, `Setting (Cached) TemperatureSensor CurrentTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue logged an error: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

         assert.equal(result, value, " setValue incorrect value" );

         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedTargetAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedTargetAccTypeEnumIndex );
         assert.isNull(result, ` getValue TargetAccTypeEnumIndex expected null to be stored.` );

         done( );
      });
   });

   it( "setValue of timeout response should fail correctly", function ( done )
   {
      const log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
          Cmd4_Mode:                "Demo",
          category:                 "TELEVISION",
          publishExternally:        true,
          active:                   "ACTIVE",
          activeIdentifier:          1234,
          mute:                     true,
          configuredName:           "My_Television",
          sleepDiscoveryMode:       "ALWAYS_DISCOVERABLE",
          brightness:                8,
          closedCaptions:           "DISABLED",
          currentMediaState:        "STOP",
          targetMediaState:         "STOP",
          pictureMode:              "STANDARD",
          remoteKey:                "SELECT"
      };

      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };

      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], parentInfo );
      cmd4Accessory.state_cmd = "./test/echoScripts/runToTimeoutRcOf0";
      cmd4Accessory.timeout = 400;

      cmd4Accessory.setValue( CMD4_ACC_TYPE_ENUM.Mute, "Mute", cmd4Accessory.timeout, cmd4Accessory.stateChangeResponseTime, 0, function( rc, result )
      {
         assert.equal( rc, constants.ERROR_TIMER_EXPIRED, ` setValue incorrect rc: ${ rc }` );
         expect( result, ` getValue incorrect result: ${ result }` ).to.not.exist;

         assert.include( log.logBuf, `[34mSetting My_Television Mute\u001b[39m 0`, ` setValue output something to stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31m\u001b[31msetValue Mute function failed for My_Television cmd: ./test/echoScripts/runToTimeoutRcOf0 Set 'My_Television' 'Mute' '0' Failed`, ` setValue incorrect stderr: ${ log.errBuf }` );

         done( );
      });
   });

});
