'use strict';

let { indexOfEnum } = require( "../utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

let isAccDirective = require( "../utils/isAccDirective" );


var _api = new HomebridgeAPI(); // object we feed to Plugins

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic, _api.hap.Formats, _api.hap.Units, _api.hap.Perms );


// ******** TEST isAccDirectivw .*************

describe( `Test isAccDirective import`, ( ) =>
{
   it( `isAccDirectivw should be a function `, ( ) =>
   {
      assert.isFunction( isAccDirective, `isAccDirective is not a function. Found: ${ typeof isAccDirective }` );
   });
});

describe( `Test isAccDirective`, ( ) =>
{
   it( `isAccDirective should identify a type `, ( ) =>
   {
      let type = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );
      let rc = isAccDirective( type );
      assert.isString( rc.type, `Unexpected result for isAccDirective` );
      assert.equal( rc.type, type, `Expected result to be "on"` );
      assert.equal( rc.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `UnExpected result` );
   });
   it( `isAccDirective should NOT identify an uppercase type `, ( ) =>
   {
      let ucType = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );
      let rc =  isAccDirective( ucType );
      assert.isNull( rc.accTypeEnumIndex, `Expected result to be null` );
   });
   it( `isAccDirective should NOT identify an unknown type `, ( ) =>
   {
      let type = "Blast";
      let rc =  isAccDirective( type );
      assert.isNull( rc.accTypeEnumIndex, `Expected result to be null` );
   });
   it( `isAccDirective should identify an uppercase type if upperCase is checked`, ( ) =>
   {
      let type = CMD4_ACC_TYPE_ENUM.accEnumIndexToLC( CMD4_ACC_TYPE_ENUM.On );
      let ucType = CMD4_ACC_TYPE_ENUM.accEnumIndexToUC( CMD4_ACC_TYPE_ENUM.On );

      let rc = isAccDirective( ucType, true );
      assert.isString( rc.type, `Unexpected result for isAccDirective` );
      assert.equal( rc.type, type, `Expected result to be "on"` );
      assert.equal( rc.accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.On, `UnExpected result` );
   });
});
