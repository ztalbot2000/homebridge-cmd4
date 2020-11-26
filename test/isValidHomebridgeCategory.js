"use strict";


let isValidHomebridgeCategory = require( "../utils/isValidHomebridgeCategory" );
var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins
var categories = _api.hap.Categories;

describe('Quick Testing of HomebridgeAPI', ( ) =>
{
   it('API should not be null', ( ) =>
   {
      assert.isNotNull(_api, '_api is null' );
   });
   it('Categories should not be null', ( ) =>
   {
      assert.isNotNull(categories, 'categories is null' );
   });
});

// ***************** TEST Plugin Initialized Variables ***************


describe('Testing isValidHomebridgeCategory.js', ( ) =>
{
   it('isValidHomebridgeCategory should be a function', ( ) =>
   {
      assert.isFunction(isValidHomebridgeCategory, "isValidHomebridgeCategory is not an function" );
   });

   it('isValidHomebridgeCategory("TELEVISION" should return true', ( ) =>
   {
      let result = isValidHomebridgeCategory(categories, "TELEVISION");
      assert.isTrue(result, "Error: isValidHomebridgeCategory returned:", result );
   });

   it('isValidHomebridgeCategory("blah" should return false', ( ) =>
   {
      let result = isValidHomebridgeCategory(categories, "blah");
      assert.isFalse(result, "Error: isValidHomebridgeCategory returned:", result );
   });

});

