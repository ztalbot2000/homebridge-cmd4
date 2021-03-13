'use strict';

const { isUpgrade, getLatestVersion, isVersionNewerThanPackagedVersion, getPackagedVersion } = require( "../utils/versionChecker" );

describe( `Testing versionChecker init`, ( ) =>
{
   it( `isUpgrade should be a function`, ( ) =>
   {
      assert.isFunction( isUpgrade, `isUpgrade is not a function` );
   });

   it( `getLatestVersion should be a function`, ( ) =>
   {
      assert.isFunction( getLatestVersion, `getLatestVersion is not a function` );
   });

   it( `isVersionNewerThanPackagedVersion should be a function`, ( ) =>
   {
      assert.isFunction( isVersionNewerThanPackagedVersion, `isVersionNewerThanPackagedVersion is not a function` );
   });

   it( `getPackagedVersion should be a function`, ( ) =>
   {
      assert.isFunction( getPackagedVersion, `getPackagedVersion is not a function` );
   });
});


describe( `Testing versionChecker functionality`, ( ) =>
{
   it( `getPackagedVersion should return an string`, ( ) =>
   {
      let result = getPackagedVersion( );
      assert.isString( result, `getPackagedVersion failed: ${ typeof result }` );
   });

   it( `getLatestVersion should return an string`, async ( ) =>
   {
      let result = await getLatestVersion( );
      assert.isString( result, `getLatestVersion failed: ${ typeof result }` );
   }).timeout(5000);

   it( `isVersionNewerThanPackagedVersion should return true for a high version`, ( ) =>
   {
      let result = isVersionNewerThanPackagedVersion( "9.0.0" );
      assert.isTrue( result, `isVersionNewerThanPackagedVersion expected: true: found: ${ result }` );
   });
   it( `isVersionNewerThanPackagedVersion should return false for a lower version`, ( ) =>
   {
      let result = isVersionNewerThanPackagedVersion( "1.0.0" );
      assert.isFalse( result, `isVersionNewerThanPackagedVersion expected: false: found: ${ result }` );
   });

   it( `isVersionNewerThanPackagedVersion should return false for same version`, async ( ) =>
   {
      let latest = await getLatestVersion( );
      let result = isVersionNewerThanPackagedVersion( latest );
      assert.isFalse( result, `isVersionNewerThanPackagedVersion expected: false: found: ${ result }` );
   }).timeout(5000);

})

