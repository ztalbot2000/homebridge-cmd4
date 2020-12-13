'use strict';

const { getAccessoryName, getAccessoryDisplayName } = require( "../utils/getAccessoryNameFunctions" );

describe( "Testing getAccessoryName.js", ( ) =>
{
   it( "getAccessoryName.js should be a function", ( ) =>
   {

      assert.isFunction( getAccessoryName, "getAccessoryName is not a function" );
   });

   it( "getAccessoryName should choose name first ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "blah";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return name over displayName. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryName should choose displayName second ", ( ) =>
   {
      let config = { noName: "blah",
                     displayName: "Kodi"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})

describe( "Testing getAccessoryDisplayName.js", ( ) =>
{
   it( "getAccessoryDisplayName.js should be a function", ( ) =>
   {

      assert.isFunction( getAccessoryDisplayName, "getAccessoryDisplayName is not a function" );
   });

   it( "getAccessoryDisplayName should choose displayName first ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryDisplayName should choose name second ", ( ) =>
   {
      let config = { name: "Kodi",
                     configuredName: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})
