'use strict';

const assert = require( "chai" ).assert;

var getAccessoryName = require( "../utils/getAccessoryName.js" );

describe( "Testing getAccessoryName.js", ( ) =>
{
   it( "getAccessoryName.js should be a function", ( ) =>
   {

      assert.isFunction( getAccessoryName, "getAccessoryName is not a function" );
   });

   it( "getAccessoryName should choose displayName first ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryName should choose name second ", ( ) =>
   {
      let config = { name: "Kodi",
                     configuredName: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})
