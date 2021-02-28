"use strict";


// ***************** TEST LOADING **********************


var _api = new HomebridgeAPI(); // object we feed to Plugins
var pluginModule = require( "../index" );


describe(`Testing load of index.js`, ( ) =>
{
   it( `index.js loaded should not be null`, ( ) =>
   {
      assert.isNotNull(pluginModule, `loading resulted in null` );
   });

   var t = typeof pluginModule.default;
   it( `index.js default initializer should be found`, ( ) =>
   {
      assert.equal(t, `function` );
   });
});

describe( `Testing homebridge API`, ( ) =>
{
   it( `API should not be null`, ( ) =>
   {
      assert.isNotNull(_api, `_api is null` );
   });
});

describe( `Testing homebridge setup`, ( ) =>
{
   it( `HAP Categories should not be null`, ( ) =>
   {
      assert.isNotNull(_api.hap.Categories, `Categories is null` );
   });

   it( `HAP Characteristic should be a function`, ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, "Characteristic is not an function" );
   });
   it( `HAP Accessory should be a function`, ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, `Accessory is not an function` );
   });
   it( `HAP Service should be a function`, ( ) =>
   {
      assert.isFunction(_api.hap.Service, `_api.hap.Service is not an function` );
   });
});


// ***************** TEST Plugin Un Initialized Variables ***************

describe( `Testing index.js plugin unInitialized variables.`, ( ) =>
{
   it( `Plugin CMD4_DEVICE_TYPE_ENUM should be a object`, ( ) =>
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM, `CMD4_DEVICE_TYPE_ENUM is not an object` );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM should be a object`, ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined`, ( ) =>
   {
      assert.equal(CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, `CMD4_DEVICE_TYPE_ENUM.EOL is incorrect` );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined`, ( ) =>
   {
      assert.equal(CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, "CMD4_ACC_TYPE_ENUM.EOL is incorrect" );
   });
});

// ***************** TEST Plugin Initialized Variables ***************

describe( `Testing index.js plugin Initialized variables.`, ( ) =>
{
   it( `Initialized Plugin CMD4_DEVICE_TYPE_ENUM.EOL should be correct`, ( ) =>
   {
      let rc = pluginModule.default(_api );

      assert.equal(rc.CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, "returned CMD4_DEVICE_TYPE_ENUM.EOL is incorrect" );
   });
   it( `Initialized Plugin returned CMD4_ACC_TYPE_ENUM.EOL should be correct`, ( ) =>
   {
      let rc = pluginModule.default(_api );

      assert.equal(rc.CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, `returned CMD4_ACC_TYPE_ENUM.EOL is incorrect` );
   });

   it( `Initialized Plugin returned CMD4_DEVICE_TYPE_ENUM.properties length should be correct`, ( ) =>
   {
      let rc = pluginModule.default(_api );
      let properties = rc.CMD4_DEVICE_TYPE_ENUM.properties;

      assert.equal(Object.keys(properties).length, DEVICE_EOL, 'returned CMD4_DEVICE_TYPE_ENUM.properties length is incorrect' );
   });
   it( `Initialized Plugin returned CMD4_ACC_TYPE_ENUM.properties length should be correct`, ( ) =>
   {
      let rc = pluginModule.default(_api );
      let properties = rc.CMD4_ACC_TYPE_ENUM.properties;

      assert.equal(Object.keys(properties).length, ACC_EOL, 'returned CMD4_ACC_TYPE_ENUM.properties length is incorrect' );
   });
});
