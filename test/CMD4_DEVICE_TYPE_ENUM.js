'use strict';

const assert = require( "chai" ).assert;

var DEVICE_DATA = require( "../lib/CMD4_DEVICE_TYPE_ENUM.js" );
var CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.CMD4_DEVICE_TYPE_ENUM;
var EOL = 50;

describe( "Testing require of CMD4_DEVICE_TYPE_ENUM.js", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM should be defined ( required correctly)", ( ) =>
   {
      assert.isNotNull( DEVICE_DATA, "CMD4_DEVICE_TYPE_ENUM is null" );
   });

   it( "DEVICE_DATA.init should be a function", ( ) =>
   {
      assert.isFunction( DEVICE_DATA.init, ".init is not a function" );
   });

   // ************ TEST UNINITIALIZED CMD4_DEVICE_TYPE_ENUM EOL **************
   describe( "Testing CMD4_DEVICE_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_DEVICE_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_DEVICE_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_DEVICE_TYPE_ENUM.EOL >= " + EOL, ( ) =>
      {
         assert.isAtLeast( CMD4_DEVICE_TYPE_ENUM.EOL, EOL, "CMD4_DEVICE_TYPE_ENUM.EOL FOUND: " + CMD4_DEVICE_TYPE_ENUM.EOL );
      });

      it( "CMD4_DEVICE_TYPE_ENUM[ 0-" + CMD4_DEVICE_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_DEVICE_TYPE_ENUM[index], index );
         }
      });
   });
})
