'use strict';

const { isUpgrade, getLatestVersion, isVersionNewerThanPackagedVersion, getPackagedVersion } = require( "../utils/versionChecker" );

const isJSON = require( "../utils/isJSON" );
const myPkg = require( "../package.json" );

describe( "Quick Testing Setup", ( ) =>
{
   it( "isJSON should be a function", ( ) =>
   {
      assert.isFunction( isJSON, "isJSON is not a function" );
   });

   it( "myPkg should be a JSON object", ( ) =>
   {
      assert.isTrue( isJSON( myPkg ), "myPkg is not a JSON object" );
   });
});

describe( "Testing versionChecker init", ( ) =>
{
   it( "isUpgrade should be a function", ( ) =>
   {
      assert.isFunction( isUpgrade, "isUpgrade is not a function" );
   });

   it( "getLatestVersion should be a function", ( ) =>
   {
      assert.isFunction( getLatestVersion, "getLatestVersion is not a function" );
   });

   it( "isVersionNewerThanPackagedVersion should be a function", ( ) =>
   {
      assert.isFunction( isVersionNewerThanPackagedVersion, "isVersionNewerThanPackagedVersion is not a function" );
   });

   it( "getPackagedVersion should be a function", ( ) =>
   {
      assert.isFunction( getPackagedVersion, "getPackagedVersion is not a function" );
   });
});


describe( "Testing versionChecker functionality", ( ) =>
{
   it( "getPackagedVersion should return: " + myPkg.version, ( ) =>
   {
      let result = getPackagedVersion( );
      assert.equal( result, myPkg.version, "getPackagedVersion expected: " + myPkg.version  + " found: " +  result );
   });

   it( "getLatestVersion should return: "  + myPkg.version, async ( ) =>
   {
      let result = await getLatestVersion( );
      assert.equal( result, myPkg.version, "getLatestVersion expected: " + myPkg.version  + " found: " +  result );
   }).timeout(5000);

   it( "isVersionNewerThanPackagedVersion should return a true for a high version", ( ) =>
   {
      let result = isVersionNewerThanPackagedVersion( "9.0.0" );
      assert.isTrue( result, "isVersionNewerThanPackagedVersion expected: true: found: " + result );
   });
   it( "isVersionNewerThanPackagedVersion should return a false for a lower version", ( ) =>
   {
      let result = isVersionNewerThanPackagedVersion( "1.0.0" );
      assert.isFalse( result, "isVersionNewerThanPackagedVersion expected: false: found: " + result );
   });

   it( "isVersionNewerThanPackagedVersion should return a false for same version", ( ) =>
   {
      let result = isVersionNewerThanPackagedVersion( myPkg.version );
      assert.isFalse( result, "isVersionNewerThanPackagedVersion expected: false: found: " + result );
   });

   it( "isUpgrade should return: false/true depending on package.version", async ( ) =>
   {
      // See if upgrade is needed
      let result = await isUpgrade( );

      // Get the latest version.  This would have already passed above.
      let lv = await getLatestVersion( );

      // Handle possablility of checking package.json that is not upgraded yet
      // NOTE: It is possible that myPkg.version is higher, which may fail as this is not checked
      if ( myPkg.version == lv )
      {
         assert.isFalse( result, "isUpgrade expected: false  as: myPkg.version=" + myPkg.version +  " latestVersion=: " + lv + " Found: " + result );
      } else {
         assert.isTrue( result, "isUpgrade expected: true  as: myPkg.version=" + myPkg.version +  " latestVersion=: " + lv + " Found: " + result );
      }
   }).timeout(5000);
})

