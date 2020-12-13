"use strict";

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins
var pluginModule = require( "../index" );

var getAccessoryUUID = require( "../utils/getAccessoryUUID.js" );

describe("Quick Testing load of index.js", ( ) =>
{
   it("API should not be null", ( ) =>
   {
      assert.isNotNull(_api, "_api is null" );
   });

   it("index.js loaded should not be null", ( ) =>
   {
      assert.isNotNull(pluginModule, "loading resulted in null" );
   });

   it("UUIDGen should be found", ( ) =>
   {
      var t = typeof _api.hap.uuid.generate;
      assert.equal(t, "function" );
   });
});

describe( "Testing getAccessoryUUID.js", ( ) =>
{
   it( "getAccessoryUUID.js should be a function", ( ) =>
   {

      assert.isFunction( getAccessoryUUID, "getAccessoryUUID is not a function" );
   });

   it( "getAccessoryUUID should return a string ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let result = getAccessoryUUID( config, _api.hap.uuid);

      assert.isString( result, "getAccessoryUUID should return a string. result:: "  + result );
   });

   it( "getAccessoryUUID should return a string length 36 ", ( ) =>
   {
      let config = { name: "Kodi",
                     configuredUUID: "blah"
      };
      let result = getAccessoryUUID( config, _api.hap.uuid);

      assert.isString( result, "getAccessoryUUID should return a string. result:: "  + result );

      assert.equal( result.length, 36, "getAccessoryUUID return a string length of 36. result:: "  + result.length );
   });
})
