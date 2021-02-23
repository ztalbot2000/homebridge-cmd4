"use strict";


// ***************** TEST LOADING **********************


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins
var pluginModule = require( "../index" );


describe('Testing load of index.js', ( ) =>
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

describe('Testing homebridge API', ( ) =>
{
   it('API should not be null', ( ) =>
   {
      assert.isNotNull(_api, '_api is null' );
   });
});

describe('Testing homebridge Categories', ( ) =>
{
   it('Categories should not be null', ( ) =>
   {
      assert.isNotNull(_api.hap.Categories, 'Categories is null' );
   });
});

// ***************** TEST Plugin Initialized Variables ***************


describe('Testing index.js plugin initialized variables.', ( ) =>
{
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
   it('Plugin CMD4_DEVICE_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM, "CMD4_DEVICE_TYPE_ENUM is not an object" );
   });
   it('Plugin CMD4_ACC_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

   it('Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined', ( ) =>
   {
      assert.isNumber(CMD4_ACC_TYPE_ENUM.EOL, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

});

