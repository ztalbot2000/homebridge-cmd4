'use strict';

var _api = new HomebridgeAPI(); // object we feed to Plugins

let { indexOfEnum } = require( "../utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });


describe( "Testing require of CMD4_CHAR_TYPE_ENUMS.js", ( ) =>
{
   it( "CMD4_CHAR_TYPE_ENUMS should be defined ( required correctly )", ( ) =>
   {
      assert.isNotNull( CMD4_CHAR_TYPE_ENUMS, "CMD4_CHAR_TYPE_ENUMS is null" );
   });

   // ************ TEST UNINITIALIZED CMD4_FORMAT_TYPE_ENUM EOL **************
   describe( "Testing CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL = " + FORMAT_EOL, ( ) =>
      {
         assert.equal( CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL, FORMAT_EOL, "CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL FOUND: " + CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM[ 0-" + CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM[index], index );
         }
      });

   });

   // ************ TEST UNINITIALIZED CMD4_UNITS_TYPE_ENUM EOL **************
   describe( "Testing CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL = " + UNITS_EOL, ( ) =>
      {
         assert.equal( CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL, UNITS_EOL, "CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL FOUND: " + CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM[ 0-" + CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM[index], index );
         }
      });

   });


   // ************ TEST UNINITIALIZED CMD4_PERMS_TYPE_ENUM EOL **************
   describe( "Testing CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL = " + PERMS_EOL, ( ) =>
      {
         assert.equal( CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL, PERMS_EOL, "CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL FOUND: " + CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL );
      });

      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM[ 0-" + CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM[index], index );
         }
      });

   });
})





describe( "Testing INITIALIZED CMD4_CHAR_TYPE_ENUMS", ( ) =>
{
   // Init the library for all to use
   let CMD4_CHAR_TYPE_ENUMS = CHAR_DATA.init( _api.hap.Characteristic );


   describe("Testing Initialized CMD4_CHAR_TYPE_ENUMS.", ( ) =>
   {
      // Test a format type
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.float should equal expected value", ( ) =>
      {
         let formatIndex = CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.properties.indexOfEnum( i => i.type === "float" );
         assert.equal( formatIndex, 2, `CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM "float" not equal to expected index`);
      });

      // Test a units type
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.lux should equal expected value", ( ) =>
      {
         let unitsIndex = CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.properties.indexOfEnum( i => i.type === "lux" );
         assert.equal( unitsIndex, 3, `CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM "lux" not equal to expected index`);
      });

      // Test a perms type
      it( "CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.ev should equal expected value", ( ) =>
      {
         let permsIndex = CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.properties.indexOfEnum( i => i.type === "ev" );
         assert.equal( permsIndex, 4, `CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM "ev" not equal to expected index`);
      });
   });
});
