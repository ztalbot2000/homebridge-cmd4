'use strict';

var isNumeric = require( "../utils/isNumeric.js" );

describe( "Testing isNumeric", ( ) =>
{
   it( "isNumeric should be a function", ( ) =>
   {
      assert.isFunction( isNumeric, "isNumeric is not a function" );
   });

   it( "isNumeric should correctly identify a string number", ( ) =>
   {
      let data = "12345";
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly identify a string float", ( ) =>
   {
      let data = "3.1415";
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly identify a number", ( ) =>
   {
      let data = 12345;
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly identify a float", ( ) =>
   {
      let data = 3.1415;
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly identify a negative float", ( ) =>
   {
      let data = -3.1415;
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly identify a 0", ( ) =>
   {
      let data = 0;
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( `isNumeric should correctly identify a "0"`, ( ) =>
   {
      let data = "0";
      let expectedResult = true;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });



   it( "isNumeric should correctly fail a character string", ( ) =>
   {
      let data = "One";
      let expectedResult = false;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });

   it( "isNumeric should correctly fail an undefined", ( ) =>
   {
      let data = undefined;
      let expectedResult = false;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });
   it( "isNumeric should correctly fail a null", ( ) =>
   {
      let data = null;
      let expectedResult = false;
      let result = isNumeric( data );
      assert.equal( result, expectedResult, "isNumeric( " + data + " ) returned: " + result  + " expected: " +  expectedResult );
   });
})

