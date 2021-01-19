'use strict';

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins


describe( "Testing require of CMD4_ACC_TYPE_ENUM.js", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM should be defined ( required correctly )", ( ) =>
   {
      assert.isNotNull( ACC_DATA, "CMD4_ACC_TYPE_ENUM is null" );
   });

   it( "ACC_DATA.init should be a function", ( ) =>
   {
      assert.isFunction( ACC_DATA.init, ".init is not a function" );
   });

   // ************ TEST UNINITIALIZED CMD4_ACC_TYPE_ENUM EOL **************
   describe( "Testing CMD4_ACC_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_ACC_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_ACC_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_ACC_TYPE_ENUM.EOL = " + ACC_EOL, ( ) =>
      {
         assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, "CMD4_ACC_TYPE_ENUM.EOL FOUND: " + CMD4_ACC_TYPE_ENUM.EOL );
      });

      it( "CMD4_ACC_TYPE_ENUM[ 0-" + CMD4_ACC_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_ACC_TYPE_ENUM[index], index );
         }
      });
   });
})

describe( "Testing INITIALIZED CMD4_ACC_TYPE_ENUM", ( ) =>
{
   // Init the library for all to use
   let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );

   // *** TEST CMD4_ACC_TYPE_ENUM.properties[].service *******
   describe('Testing Initialized CMD4_ACC_TYPE_ENUM.properties[].characteristic', ( ) =>
   {
      it('Testing CMD4_ACC_TYPE_ENUM.properties[].characteristic ', ( ) =>
      {
         for (let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            let result = CMD4_ACC_TYPE_ENUM.properties[ index ].characteristic;
            // Make sure our characteristic is defined
            assert.isNotNull( result, "CMD4_ACC_TYPE_ENUM.properties[" + index + "].characteristic is null. result: %s", result );

            assert.isFunction( result, "characteristic is not a function at index: " + index + " result:" + result );
         }
      });
   });

   // *** TEST CMD4_ACC_TYPE_ENUM.properties[].UUID *******
   describe('Testing Initialized CMD4_ACC_TYPE_ENUM.properties[].UUID', ( ) =>
   {
      it('Testing CMD4_ACC_TYPE_ENUM.properties[].UUID is a string ', ( ) =>
      {
         for (let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            let result = CMD4_ACC_TYPE_ENUM.properties[ index ].UUID;

            // Make sure that the UUID we defined is valid.
            expect(result).to.be.a( "string", " result is not a string. result:" + result + " at index: " + index );

         }
      });

      it('Testing CMD4_ACC_TYPE_ENUM.properties[].UUID is same as in hap string ', ( ) =>
      {
         for (let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            let UUID = CMD4_ACC_TYPE_ENUM.properties[ index ].characteristic.UUID;
            let result = CMD4_ACC_TYPE_ENUM.properties[ index ].UUID;

            // Make sure that the UUID we defined is valid.
            expect(result).to.equal( UUID, " Our UUID is not the same at index: " + index + ". result:" + result );
         }
      });
   });
});


