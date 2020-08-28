'use strict';

const assert = require( "chai" ).assert;



var isJSON = require( "../utils/isJSON.js" );

describe( "Testing isJSON", ( ) =>
{
   it( "isJSON should be a function", ( ) =>
   {
      assert.isFunction( isJSON, "isJSON is not a function" );
   });

   it( "isJSON should correctly identify a JSON object", ( ) =>
   {
      let data = { "name": "John"};
      let expectedResult = true;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for a string", ( ) =>
   {
      let data = "abcdef";
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for a number", ( ) =>
   {
      let data = 12345;
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for a float", ( ) =>
   {
      let data = 3.1415;
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for a boolean", ( ) =>
   {
      let data = false;
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for an array", ( ) =>
   {
      let data = [1,2,3,4];
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isJSON should return false for a undefined", ( ) =>
   {
      let data = undefined;
      let expectedResult = false;
      let result = isJSON( data );
      assert.equal( result, expectedResult, "isJSON( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });
})

