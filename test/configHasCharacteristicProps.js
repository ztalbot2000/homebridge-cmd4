"use strict";


// ***************** TEST LOADING **********************



let { Cmd4Accessory } = require( "../Cmd4Accessory" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins



// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


let changedMinStep = 1;   // Was .1
let changedMinValue = 16; // Was -27
let changedMaxValue = 32; // Was 100


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


// *** TEST configHasCharacteristicProps *******
describe('Test configHasCharacteristicProps.', ( ) =>
{
   it('configHasCharacteristicProps should be a function', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.isFunction(accessory.configHasCharacteristicProps, "configHasCharacteristicProps is not a function" );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

   });

   it('configHasCharaceristicProps should work with full props.', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = accessory.configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it('configHasCharaceristicProps should work with property in small Caps.', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = accessory.configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data in small Caps returned incorrect result: " + result );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it('configHasCharaceristicProps should work with two properties', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = accessory.configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data in small Caps returned incorrect result: " + result );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it('configHasCharaceristicProps should work with one property.', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { TargetTemperature: { maxValue: +100 } };

      let result = accessory.configHasCharacteristicProps( accTypeEnumIndex );

      assert.isObject(result, "configHasCharacteristicProps of valid data with one propertyreturned incorrect result: " + result );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it('configHasCharaceristicProps should work with two characteristics.', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { CurrentTemperature: { maxValue: +100 },
                          TargetTemperature: { maxValue: +100 },
                        };
      let result = accessory.configHasCharacteristicProps( accTypeEnumIndex );

      assert.isObject(result, "configHasCharacteristicProps of valid data with two characteristicsreturned incorrect result: " + result );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it('configHasCharaceristicProps should fail with a unknown prop', ( ) =>
   {
      let config =
      {
         type:                            "TemperatureSensor",
         displayName:                     "MyTemperatureSensor",
         name:                            "MyTemperatureSensor",
         currentTemperature:               25,
         statusFault:                     "NO_FAULT",
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { TargetTemperature: { maxValue: +100,
                                               minValue: -100,
                                               uhoh: 0.1
                                              }
                        };

      expect ( ( ) => accessory.configHasCharacteristicProps( accTypeEnumIndex  ) ).to.throw(/props for key "uhoh" not in definition of "targetTemperature"/);


      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyTemperatureSensor", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );


      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );

   });

   it('setProps should be called for two defind characteristics', ( ) =>
   {
      let config =
      {
         type:               "Thermostat",
         displayName:        "MyThermostat",
         name:               "MyThermostat",
         currentTemperature: 25,
         targetTemperature:  25,
         statusFault:        "NO_FAULT",
         props:              {  "currentTemperature":
                                {
                                   "maxValue": 32,
                                   "minValue": 16,
                                   "minStep": 1
                                },
                                "targetTemperature":
                                {
                                   "maxValue": 32,
                                   "minValue": 16,
                                   "minStep": 1
                                }
                             }
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.isFunction(accessory.configHasCharacteristicProps, "configHasCharacteristicProps is not a function" );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyThermostat", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, "[90mOverriding characteristic CurrentTemperature props for: MyThermostat", `Unxexpected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, "[90mOverriding characteristic TargetTemperature props for: MyThermostat", `Unxexpected stdout: ${ log.logBuf }` );

   });

   it('setProps should alter characteristics', ( ) =>
   {
      let config =
      {
         type:               "Thermostat",
         displayName:        "MyThermostat",
         name:               "MyThermostat",
         currentTemperature: 25,
         targetTemperature:  25,
         statusFault:        "NO_FAULT",
         props:              {  "currentTemperature":
                                {
                                   "maxValue": 32,
                                   "minValue": 16,
                                   "minStep": 1
                                },
                                "targetTemperature":
                                {
                                   "maxValue": 32,
                                   "minValue": 16,
                                   "minStep": 1
                                }
                             }
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.include( log.logBuf, "[34mCmd4 is running in Demo Mode for MyThermostat", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, "[90mOverriding characteristic CurrentTemperature props for: MyThermostat", `Unxexpected stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, "[90mOverriding characteristic TargetTemperature props for: MyThermostat", `Unxexpected stdout: ${ log.logBuf }` );


      let props = accessory.service.getCharacteristic(
                            CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.CurrentTemperature ].characteristic).props;
      //let util = require('util');
      //console.log(util.inspect(props, {depth: null}));

      // test minValue
      let hapMinValue = props.minValue;  // Was -27 now 16
      let hapMaxValue = props.maxValue;  // Was 100 now 32
      let hapMinStep = props.minStep;    // Was .1 now 1

      assert.equal( hapMinValue, changedMinValue, `minValue: ${ hapMinValue } not equal to expected: ${ changedMinValue }` );
      assert.equal( hapMaxValue, changedMaxValue, `maxValue: ${ hapMaxValue } not equal to expected: ${ changedMaxValue }` );
      assert.equal( hapMinStep, changedMinStep, `minStep: ${ hapMinStep } not equal to expected: ${ changedMinStep }` );

   });
});

