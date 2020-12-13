"use strict";


// ***************** TEST LOADING **********************


let HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
let _api = new HomebridgeAPI(); // object we feed to Plugins
let pluginModule = require( "../index" );
let cmd4 = pluginModule.default(_api);
let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;

let configHasCharacteristicProps = require("../utils/configHasCharacteristicProps");

describe('Quick Testing load of index.js', ( ) =>
{
   it('index.js loaded should not be null', ( ) =>
   {
      assert.isNotNull(pluginModule, 'loading resulted in null' );
   });

   var t = typeof pluginModule.default;
   it('index.js default initializer should be found', ( ) =>
   {
      assert.equal(t, "function" );
   });
});
// ***************** Quick TEST Plugin Initialized Variables ***************

// *** TEST configHasCharacteristicProps *******
describe('Quick Testing index.js plugin initialized variables.', ( ) =>
{
    it('Plugin CMD4_ACC_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

});

describe('Quick Testing configHasCharacteristicProps definition.', ( ) =>
{
   it('configHasCharacteristicProps should be a function', ( ) =>
   {
      assert.isFunction(configHasCharacteristicProps, "configHasCharacteristicProps is not a function" );
   });
});

describe('Test configHasCharacteristicProps.', ( ) =>
{
   it('configHasCharaceristicProps should work with full props.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with property in small Caps.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { targetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         minStep: 0.1,
                                       }
                   };


      let result = configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(CMD4_ACC_TYPE_ENUM, "configHasCharacteristicProps of valid data in small Caps returned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with one property.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100
                                       }
                   };
      let result = configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(result, "configHasCharacteristicProps of valid data with one propertyreturned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should work with two characteristics.', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { CurrentTemperature: { maxValue: +100
                                        },
                    TargetTemperature: { maxValue: +100
                                       },
                   };
      let result = configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isObject(result, "configHasCharacteristicProps of valid data with two characteristicsreturned incorrect result: " + result );
   });

   it('configHasCharaceristicProps should fail with a bad prop', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let props = { TargetTemperature: { maxValue: +100,
                                         minValue: -100,
                                         uhoh: 0.1,
                                        }
                  };

      let result = configHasCharacteristicProps(accTypeEnumIndex, props, CMD4_ACC_TYPE_ENUM  );

      assert.isUndefined(result, "configHasCharacteristicProps should fail with a bad property, result: " + result );
   });

});

