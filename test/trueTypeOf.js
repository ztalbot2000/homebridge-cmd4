'use strict';

var trueTypeOf = require( "../utils/trueTypeOf.js" );

describe( "Testing trueTypeOf", ( ) =>
{
   it( "trueTypeOf should be a function", ( ) =>
   {
      assert.isFunction( trueTypeOf, "trueTypeOf is not a function" );
   });

   it( "trueTypeOf should correctly identify a String object", ( ) =>
   {
      let data = "Cmd4";
      let expectedResult = String;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a Boolean false object", ( ) =>
   {
      let data = false;
      let expectedResult = Boolean;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a Boolean true object", ( ) =>
   {
      let data = true;
      let expectedResult = Boolean;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a Number object", ( ) =>
   {
      let data = 42;
      let expectedResult = Number;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a Array object", ( ) =>
   {
      let data = [ 1, 2, 3 ];
      let expectedResult = Array;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify an empty object ", ( ) =>
   {
      let data = undefined
      let expectedResult = undefined;
      let result = trueTypeOf( );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a undefined object ", ( ) =>
   {
      let data = undefined
      let expectedResult = undefined;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "trueTypeOf should correctly identify a null object", ( ) =>
   {
      let data = null;
      let expectedResult = null;
      let result = trueTypeOf( data );
      assert.equal( result, expectedResult, "trueTypeOf( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });
})

