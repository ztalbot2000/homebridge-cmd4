"use strict";


// ***************** TEST LOADING **********************



let { Cmd4Accessory } = require( "../Cmd4Accessory" );


var _api = new HomebridgeAPI( ); // object we feed to Plugins



// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );




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
   let config =
   {
      type:                            "TemperatureSensor",
      displayName:                     "My_TemperatureSensor",
      name:                            "My_TemperatureSensor",
      currentTemperature:               25,
      statusFault:                     "NO_FAULT",
   };



   let log = new Logger( );
   log.setBufferEnabled( );
   log.setOutputEnabled( false );

   let parentInfo = undefined;
   let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

   it('configHasCharacteristicProps should be a function', ( ) =>
   {
      assert.isFunction(accessory.configHasCharacteristicProps, "configHasCharacteristicProps is not a function" );
   });

   it('configHasCharaceristicProps should work with full props.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = accessory.configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with property in small Caps.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = accessory.configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data in small Caps returned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with one property.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { TargetTemperature: { maxValue: +100 } };

      let result = accessory.configHasCharacteristicProps( accTypeEnumIndex );

      assert.isObject(result, "configHasCharacteristicProps of valid data with one propertyreturned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with two characteristics.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { CurrentTemperature: { maxValue: +100 },
                          TargetTemperature: { maxValue: +100 },
                        };
      let result = accessory.configHasCharacteristicProps( accTypeEnumIndex );

      assert.isObject(result, "configHasCharacteristicProps of valid data with two characteristicsreturned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should fail with a unknown prop', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { TargetTemperature: { maxValue: +100,
                                               minValue: -100,
                                               uhoh: 0.1
                                              }
                        };

      expect ( ( ) => accessory.configHasCharacteristicProps( accTypeEnumIndex  ) ).to.throw(/props for key "uhoh" not in definition of "TargetTemperature"/);


   });

   it('configHasCharaceristicProps should fail with a unknown prop type', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      accessory.props = { TargetTemperature: { maxValue: +100,
                                               minValue: -100,
                                               // Perms should be an object
                                               perms: 0.1
                                              }
                        };

      expect ( ( ) => accessory.configHasCharacteristicProps( accTypeEnumIndex  ) ).to.throw(/props for key "perms" type "number" Not equal to definition of "object"/);


   });
});

