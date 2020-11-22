'use strict';

const assert = require( "chai" ).assert;

var ACC_DATA = require( "../lib/CMD4_ACC_TYPE_ENUM.js" );
var CMD4_ACC_TYPE_ENUM = ACC_DATA.CMD4_ACC_TYPE_ENUM;

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
