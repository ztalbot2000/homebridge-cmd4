"use strict";


// ***************** TEST LOADING **********************

let HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
let _api = new HomebridgeAPI(); // object we feed to Plugins
let Characteristic = _api.hap.Characteristic; // object we feed to Plugins
let pluginModule = require( "../index" );
let cmd4 = pluginModule.default(_api);
let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;

let characteristicValueToItsProperType = require("../utils/characteristicValueToItsProperType");

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

// *** TEST characteristicValueToItsProperType *******
describe('Quick Testing index.js plugin initialized variables.', ( ) =>
{
    it('Plugin CMD4_ACC_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

});

describe('Testing characteristicValueToItsProperType definition.', ( ) =>
{
   it('characteristicValueToItsProperType should be a function', ( ) =>
   {
      assert.isFunction(characteristicValueToItsProperType, "characteristicValueToItsProperType is not a function" );
   });
});

describe('Test characteristicValueToItsProperType.', ( ) =>
{
   it('characteristicValueToItsProperType of AirParticulateSize of UINT8 Number should be Number .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateSize;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 60;
      let expectedResult = 60;


      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of AirParticulateSize of UINT8 String should be Number .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateSize;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "60";
      let expectedResult = 60;


      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of TargetTemperature of Float should be Float .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 60.2;
      let expectedResult = 60.2;


      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of TargetTemperature of Float String should be Float .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "60.2";
      let expectedResult = 60.2;


      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Name of string1 should be String .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Name;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "Device";
      let expectedResult = "Device";

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Name of number should be String .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Name;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 123;
      let expectedResult = "123";

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of FAlse should be false .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "FAlse";
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of "FAlse" should be false .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "FAlse";
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of "True" should be true .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = "FAlse";
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of false should be false .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = false;
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of true should be true .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = true;
      let expectedResult = true;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of 0 should be true .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 0;
      let expectedResult = true;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of Mute of 1 should be false .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 1;
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of BOOL of 0 should be true .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 0;
      let expectedResult = true;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });

   it('characteristicValueToItsProperType of BOOL of 1 should be false .', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
      let displayName = "testDevice";
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type;
      let format = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].props.format;
      let value = 1;
      let expectedResult = false;

      let result = characteristicValueToItsProperType( console, format, displayName, Characteristic, characteristicString, value  );

      assert.equal( result, expectedResult, "configHasCharacteristicProps of valid data with full properties returned incorrect result: " + result );
   });
});

