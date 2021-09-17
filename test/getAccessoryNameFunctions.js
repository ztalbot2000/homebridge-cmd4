'use strict';

const { getAccessoryName, getAccessoryDisplayName } = require( "../utils/getAccessoryNameFunctions" );

describe( "Testing getAccessoryName LC", ( ) =>
{
   it( "getAccessoryName.js should be a function", ( ) =>
   {

      assert.isFunction( getAccessoryName, "getAccessoryName is not a function" );
   });

   it( "getAccessoryName should choose name first LC ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "blah";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return name over displayName. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryName should choose displayName second LC ", ( ) =>
   {
      let config = { noName: "blah",
                     displayName: "Kodi"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})

describe( "Testing getAccessoryDisplayName LC", ( ) =>
{
   it( "getAccessoryDisplayName.js should be a function LC", ( ) =>
   {

      assert.isFunction( getAccessoryDisplayName, "getAccessoryDisplayName is not a function" );
   });

   it( "getAccessoryDisplayName should choose displayName first LC ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryDisplayName should choose name second LC ", ( ) =>
   {
      let config = { name: "Kodi",
                     configuredName: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})


describe( "Testing getAccessoryName UC", ( ) =>
{
   it( "getAccessoryName should choose name first UC ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "blah";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return name over displayName. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryName should choose displayName second UC ", ( ) =>
   {
      let config = { NoName: "blah",
                     displayName: "Kodi"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryName( config );

      assert.equal( result, expectedResult, "getAccessoryName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})

describe( "Testing getAccessoryDisplayName.js", ( ) =>
{
   it( "getAccessoryDisplayName.js should be a function UC", ( ) =>
   {

      assert.isFunction( getAccessoryDisplayName, "getAccessoryDisplayName is not a function" );
   });

   it( "getAccessoryDisplayName should choose displayName first UC ", ( ) =>
   {
      let config = {displayName: "Kodi",
                    name: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });

   it( "getAccessoryDisplayName should choose name second UC ", ( ) =>
   {
      let config = { name: "Kodi",
                     configuredName: "blah"
      };
      let expectedResult = "Kodi";
      let result = getAccessoryDisplayName( config );

      assert.equal( result, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + result  + " expected: " +  expectedResult );
   });
})

/* Mucking about.  Result, just use getAccessoryName
describe( "Testing logic of config.name", ( ) =>
{
   it.skip( "name should equal whatever config.[Nn]ame is", ( ) =>
   {
      let config = { Name: "Np",
                     ConfiguredName: "Np"
      };

      let configPassedToGetAccessoryNane = { Name: "Kodi",
                     ConfiguredName: "blah"
      };

      // This does not do what I thought
      let name = config.name = config.name = config.Name || getAccessoryName( configPassedToGetAccessoryNane );

      let expectedResult = "Kodi";

      // This fails with:
      // AssertionError: getAccessoryDisplayName should return displayName over name. result: Np expected: Kodi: expected 'Np' to equal 'Kodi'
      // + expected - actual
      // -Np
      // +Kodi
      assert.equal( name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );
      assert.equal( config.name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );
      assert.equal( config.Name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );

   });

   it.skip( "name should equal whatever config.[Nn]ame is", ( ) =>
   {
      let config = { Name: "Np",
                     ConfiguredName: "Np"
      };

      let configPassedToGetAccessoryNane = { Name: "Kodi",
                     ConfiguredName: "blah"
      };

      // This does do what is expected, but config.Name never gets set.
      let name = config.name = config.name || getAccessoryName( configPassedToGetAccessoryNane );

      let expectedResult = "Kodi";

      assert.equal( name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );
      assert.equal( config.name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );

      // This fails with:
      // AssertionError: getAccessoryDisplayName should return displayName over name. result: Kodi expected: Kodi: expected 'Np' to equal 'Kodi'
      // + expected - actual
      // -Np
      // +Kodi
      assert.equal( config.Name, expectedResult, "getAccessoryDisplayName should return displayName over name. result: "  + name  + " expected: " +  expectedResult );
   });
})
*/
