"use strict";

// ***************** TEST LOADING **********************


var pluginModule = require( "../index" );
var CMD4_ACC_TYPE_ENUM = pluginModule.CMD4_ACC_TYPE_ENUM;
var CMD4_DEVICE_TYPE_ENUM = pluginModule.CMD4_DEVICE_TYPE_ENUM;

function getKeyByValue( object, value) {
  return Object.keys( object ).find( key => object[key] === value );
}

// While the above method is better, It doesn't check that
// the key values are sequential.
// You cannot break out of forEach ....
function getIndexOfValue( obj, value )
{
   let count = 0;
   let found = -1;
   Object.keys( obj ).forEach( function( key )
   {
      // console.log( "Checking: " + key + " count: " + count + " obj[key]: " + obj[key] + " for: " + value + " t1: " + typeof obj[key] + " t2: " + typeof value );
      if ( obj[key] == value && value == count ) { found = value };
      count+=1;
   });
   return found;
}

// ************ TEST PLUGIN WAS Loaded Successfully **************
describe( "Testing load of index.js", ( ) =>
{
   it( "Testing require of index.js", ( ) =>
   {
      expect( pluginModule ).not.to.be.a( "null", "loaded plugin was null" );
   });

   it( "index.js default initializer should be found", ( ) =>
   {
      expect( pluginModule.default ).to.be.a( "function", "plugin has no default init function t: " + typeof pluginModule.default);
   });
});

// ************ TEST UNINITIALIZED PLUGIN **************
describe( "Testing uninitialized plugin", ( ) =>
{
   // DEVICE_TYPE Testing
   it( "CMD4_DEVICE_TYPE_ENUM is defined", ( ) =>
   {
      expect( CMD4_DEVICE_TYPE_ENUM ).not.to.be.a( "null", "CMD4_DEVICE_TYPE_ENUM is null" );
   });
   it( "CMD4_DEVICE_TYPE_ENUM has EOL", ( ) =>
   {
      expect( CMD4_DEVICE_TYPE_ENUM.EOL ).not.to.be.a( "null", "CMD4_DEVICE_TYPE_ENUM.EOL is null" );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL = " + DEVICE_EOL, ( ) =>
   {
      expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL, "CMD4_DEVICE_TYPE_ENUM.EOL. Expected: " + DEVICE_EOL + " found: " + CMD4_DEVICE_TYPE_ENUM.EOL );
   });

   it( "CMD4_DEVICE_TYPE_ENUM[ 0-" +  CMD4_DEVICE_TYPE_ENUM.EOL + " ] to have a valid value", ( ) =>
   {
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let keyIndex = getIndexOfValue( CMD4_DEVICE_TYPE_ENUM, index );
         expect( keyIndex ).to.equal( index, "Expected value at index: " + index + " to be: " + index + " found: " + keyIndex );
      }
   });

   // ACC_TYPE Testing
   it( "CMD4_ACC_TYPE_ENUM is defined", ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM ).not.to.be.a( "null", "CMD4_ACC_TYPE_ENUM is null" );
   });
   it( "CMD4_ACC_TYPE_ENUM has EOL", ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM.EOL ).not.to.be.a( "null", "CMD4_ACC_TYPE_ENUM.EOL is null" );
   });
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL, "CMD4_ACC_TYPE_ENUM.EOL. Expected: " + ACC_EOL + " found: " + CMD4_ACC_TYPE_ENUM.EOL );
   });

   it( "CMD4_ACC_TYPE_ENUM[ 0-" + CMD4_ACC_TYPE_ENUM.EOL + " ] to have a valid value", ( ) =>
   {
      for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
      {
         let keyIndex = getIndexOfValue( CMD4_ACC_TYPE_ENUM, index );
         expect( keyIndex ).to.equal( index, "Expected ACC ENUM at index: " + index + " to be: " + index + " found: " + keyIndex );
      }
   });
});
