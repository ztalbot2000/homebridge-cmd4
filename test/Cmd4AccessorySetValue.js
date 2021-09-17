"use strict";

// ***************** TEST LOADING **********************


let { Cmd4Accessory } = require( "../Cmd4Accessory" );
let { Cmd4Platform } = require( "../Cmd4Platform" );



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

      assert.isFunction( cmd4Accessory.queue.prioritySetValue, "Cmd4Accessory.queue.prioritySetValue is not a function" );

      done( );
   });

   it( "setValue 1 should send 1 to script for ClosedCaption non constant request", function ( done )
   {
      // A config file to play with.
      let fn = `/tmp/fn1`;
      let platformConfig =
      {
         accessories:
         [{
            Name:                     "Television",
            Type:                     "Television",
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
            polling: [{ characteristic: "ClosedCaptions" }],
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

      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );


      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `Setting Television ClosedCaptions\u001b[39m 1`, ` setValue incorrect stdout: ${ log.logBuf }` );
//ZZZ    assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected stderr: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

         done( );

      }, 1000 );

   });

   it( `setValue 1, aka ENABLED should send "ENABLED" to script for constant request`, function ( done )
   {
      // A config file to play with.
      let fn = `/tmp/fn2`;
      let platformConfig =
      {
         accessories:
         [{
             Name:                     "Television",
             Type:                     "Television",
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
             polling: [{ characteristic: "ClosedCaptions" }],
             CurrentMediaState:        "STOP",
             TargetMediaState:         "STOP",
             PictureMode:              "STANDARD",
             RemoteKey:                "SELECT",
             State_cmd:                `node ${ process.cwd( ) }/${ getSetValueScript }`,
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

      let value = Characteristic.ClosedCaptions.ENABLED;

      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mSetting Television ClosedCaptions\u001b[39m ENABLED`, `incorrect stdout: ${ log.logBuf }` );
//ZZZ    assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         done( );

      }, 1000 );
   });

   it( `Cmd4Accessory should generate warning for publishExternally`, function ( done )
   {
      // A config file to play with.
      let fn = `/tmp/fn2`;
      let platformConfig =
      {
         accessories:
         [{
             Name:                     "Television",
             Type:                     "Television",
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
      let fn = `/tmp/fn3`;
      let platformConfig =
      {
         accessories:
         [{
            Name:                     "Television",
            Type:                     "Television",
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
            State_cmd:                `node ${ process.cwd( ) }/${ getSetValueScript }`
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
      let value = true;

      cmd4Accessory.log.reset( );
      cmd4Accessory.log.setDebugEnabled( false );
      cmd4Accessory.log.setOutputEnabled( false );

      // Call the setValue bound function, which is prioritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mSetting (Cached) Television Mute\u001b[39m true`, ` setValue incorrect output. received: ${ log.logBuf }` );
         assert.equal( 1, log.logLineCount, ` setValue logged lines than one: ${ log.stdout }` );
         assert.equal( "", log.errBuf, ` setValue unexpected error output received: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue logged Error lines more than one: ${ log.errBuf }` );

         done( );

      }, 1000 );
   });

   it( `setValue of cached "Target*" characteristic, should set "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let platformConfig =
      {
         accessories: [
         {
            Type:                      "Thermostat",
            Name:                      "Thermostat",
            Cmd4_Mode:                 "Demo",
            DisplayName:               "Thermostat",
            TemperatureDisplayUnits:   "CELSIUS",
            Active:                    "INACTIVE",
            CurrentTemperature:         20.0,
            TargetTemperature:          20.0,
            TargetHeatingCoolingState:  0,
            StateChangeResponseTime:    3
         }]
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, `Incorrect number of created accessories` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = 12.3;

      cmd4Accessory.log.reset( );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
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

      }, 2000 );

   }).timeout(3000);

   it( `In Demo mode, setValue of cached "Target*" characteristic, should set ALSO "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         type:                         "Thermostat",
         Name:                         "Thermostat",
         Cmd4_Mode:                    "Demo",
         DisplayName:                  "Thermostat",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "INACTIVE",
         CurrentTemperature:            20.0,
         TargetTemperature:             20.0,
         CurrentHeatingCoolingState:    0,
         TargetHeatingCoolingState:     0,
         StateChangeResponseTime:       3
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode`, ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = 12.3;

      cmd4Accessory.log.reset( );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, `Setting (Cached) Thermostat TargetTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `Also Setting (Cached) Thermostat CurrentTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         //assert.equal( 2, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue unexpected stderr: ${ log.errBuf }` );
         //assert.equal( 0, log.errLineCount, ` setCachedValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, value, " setValue incorrect stored value" );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, value, " setValue relatedCurrentAccTypeEnum incorrect value" );

         done( );

      }, 1000 );

   });

   it( `setValue of cached "Target*" characteristic, should set ALSO "Current*" characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
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
         polling: true,
         state_cmd: "./Extras/Cmd4Scripts/Examples/AnyDevice"
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = 12.3;

      cmd4Accessory.log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );

         assert.include( log.logBuf, `Setting Thermostat TargetTemperature\u001b[39m 12.3`, ` setCachedValue incorrect stdout: ${ log.logBuf }` );
         assert.include( log.logBuf, `[90mgetValue: CurrentTemperature function for: Thermostat returned: 12.3`, ` setValue incorrect stdout: ${ log.logBuf }` );

         assert.equal( "", log.errBuf, ` setValue unexpected stderr: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setValue err lines than one: ${ log.errBuf }` );

         assert.equal(result, value, " setValue incorrect stored value" );

         let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedCurrentAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedCurrentAccTypeEnumIndex );
         assert.equal(result, value, " setValue relatedCurrentAccTypeEnum incorrect value" );

         done( );

      }, 2500 );

   }).timeout( 3000 );

   it( `Missing required characteristic should generate a warning and add the characteristic`, function ( done )
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
         CurrentHeatingCoolingState:    0,
         TargetHeatingCoolingState:     0,
         StateChangeResponseTime:       3
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let cmd4Accessory = new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      let acc = CMD4_ACC_TYPE_ENUM.TargetTemperature;

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode`, ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );
      assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, `m**** Adding required characteristic TargetTemperature for Thermostat`, ` setCachedValue incorrect stdout:${ log.errBuf }` );
      assert.include( log.errBuf, `Not defining a required characteristic can be problematic`, ` setCachedValue incorrect stdout: ${ log.errBuf }` );
      // Hmmmmmm was 2
      assert.equal( 3, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

      let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[ cmd4Accessory.typeIndex ].requiredCharacteristics.find( key => key.type ===  acc ).defaultValue;

      let result = cmd4Accessory.getStoredValueForIndex( acc );
      assert.equal(result, defaultValue, ` setValue incorrect stored value` );

      done( );
   });

   it( `In Demo mode, Missing Optional characteristic should generate a warning and add the characteristic`, function ( done )
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

      assert.include( log.logBuf, `[34mCmd4 is running in Demo Mode`, ` Cmd4Accessory: incorrect stdout: ${ log.logBuf }` );

      assert.equal( 1, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
      assert.include( log.errBuf, `**** Adding required characteristic TargetHeatingCoolingState for Thermostat`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );
      assert.include( log.errBuf, `Not defining a required characteristic can be problematic`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );
      assert.include( log.errBuf, `[33mWarning: Cmd4_Mode has been deprecated.`, ` Cmd4Accessory: incorrect stderr: ${ log.errBuf }` );

      assert.equal( 3, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );
      done( );
   });

   it( `Missing Optional characteristic should generate a warning and add the characteristic`, function ( done )
   {
      // A config file to play with.
      let ThermostatConfig =
      {
         Type:                         "Thermostat",
         Name:                         "Thermostat",
         DisplayName:                  "Thermostat",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "INACTIVE",
         CurrentTemperature:            20.0,
         TargetTemperature:             20.0,
         CurrentHeatingCoolingState:    0,
         // targetHeatingCoolingState:  0,
         StateChangeResponseTime:       3,
         polling:                       true,
         state_cmd:                    "./test/echoScripts/echo_1"
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      new Cmd4Accessory( log, ThermostatConfig, _api, [ ], null );

      assert.equal( log.logBuf, "", ` Cmd4Accessory: unexpected stdout: ${ log.logBuf }` );
      assert.equal( 0, log.logLineCount, ` Cmd4Accessory: incorrect number of lines to stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `**** Adding required characteristic TargetHeatingCoolingState for Thermostat`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );
      assert.include( log.errBuf, `Not defining a required characteristic can be problematic`, ` setCachedValue incorrect stderr: ${ log.errBuf }` );

      assert.equal( 2, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

      done( );
   });


   it( `In Demo mode, setValue of cached characteristic , should not set Current*" characteristic on TemperatureSensor`, function ( done )
   {
      // A config file to play with.
      let TempSensorConfig =
      {
         Type:                         "TemperatureSensor",
         Name:                         "TemperatureSensor",
         Cmd4_Mode:                    "Demo",
         DisplayName:                  "TemperatureSensor",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "INACTIVE",
         CurrentTemperature:            20.0
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Accessory = new Cmd4Accessory( log, TempSensorConfig, _api, [ ], null );

      let acc = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
      let value = 12.3;

      cmd4Accessory.log.reset( );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );


         // You cannot set a read only value for a Sensor
         assert.equal( log.logBuf, ``, ` setCachedValue should not occur, incorrect stdout: ${ log.logBuf }` );
         assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue logged an error: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

         // The value should not be changed and be what is in the config.json
         assert.equal(result, 20.0, " setValue incorrect value" );

         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedTargetAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedTargetAccTypeEnumIndex );
         assert.isNull(result, ` getValue TargetAccTypeEnumIndex expected null to be stored.` );

         done( );
      }, 1000 );
   });

   it( `setValue of cached characteristic , should not set Current*" characteristic on TemperatureSensor`, function ( done )
   {
      // A config file to play with.
      let TempSensorConfig =
      {
         Type:                         "TemperatureSensor",
         Name:                         "TemperatureSensor",
         DisplayName:                  "TemperatureSensor",
         TemperatureDisplayUnits:      "CELSIUS",
         Active:                       "INACTIVE",
         CurrentTemperature:            20.0,
         polling: true,
         state_cmd: "./Extras/Cmd4Scripts/Examples/AnyDevice"
      };

      const log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Accessory = new Cmd4Accessory( log, TempSensorConfig, _api, [ ], null );

      let acc = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
      let value = 12.3;

      cmd4Accessory.log.reset( );

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ acc ]
             .characteristic ).setValue( value, function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         let result = cmd4Accessory.getStoredValueForIndex( acc );


         // You cannot set a read only value for a Sensor
         assert.equal( log.logBuf, ``, ` setCachedValue should not occur, incorrect stdout: ${ log.logBuf }` );
         assert.equal( 0, log.logLineCount, ` setCachedValue logged lines than one: ${ log.logBuf }` );
         assert.equal( "", log.errBuf, ` setCachedValue logged an error: ${ log.errBuf }` );
         assert.equal( 0, log.errLineCount, ` setCachedValue logged lines than one: ${ log.errBuf }` );

         // The value should not be changed and be what is in the config.json
         assert.equal(result, 20.0, " setValue incorrect value" );

         let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ acc ].relatedTargetAccTypeEnumIndex;

         result = cmd4Accessory.getStoredValueForIndex( relatedTargetAccTypeEnumIndex );
         assert.isNull(result, ` getValue TargetAccTypeEnumIndex expected null to be stored.` );

         done( );
      }, 1000 );
   });

   it( "setValue of timeout response should fail correctly", function ( done )
   {
      // A config file to play with.
      let TVConfig =
      {
          name:                     "My_Television",
          type:                     "Television",
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
          remoteKey:                "SELECT",
          timeout:  401,
          polling:                  [{ characteristic: "Mute" }],
          state_cmd: "./test/echoScripts/runToTimeoutRcOf0"
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Accessory = new Cmd4Accessory( log, TVConfig, _api, [ ], null );
      cmd4Accessory.timeout = 400;

      // Call the setValue bound function, which is priorritySetValue
      cmd4Accessory.service.getCharacteristic(
         CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.Mute ]
             .characteristic ).setValue( "Mute", function dummyCallback( ) { } );

      setTimeout( ( ) =>
      {
         assert.include( log.logBuf, `[34mSetting My_Television Mute\u001b[39m 0`, ` setValue output something to stdout: ${ log.logBuf }` );
         assert.include( log.errBuf, `[31m\u001b[31msetValue Mute function failed for My_Television cmd: ./test/echoScripts/runToTimeoutRcOf0 Set 'My_Television' 'Mute' '0' Failed`, ` setValue incorrect stderr: ${ log.errBuf }` );

         done( );
      }, 1000 );
   });

});
