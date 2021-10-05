'use strict';

let { indexOfEnum } = require( "../utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

let isCmd4Directive = require( "../utils/isCmd4Directive" );


var _api = new HomebridgeAPI.HomebridgeAPI; // object we feed to Plugins

// Init the library for all to use
CMD4_DEVICE_TYPE_ENUM.init( _api.hap.Service );


// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{
   it( `CMD4_ACC_TYPE_ENUM.EOL = ${ ACC_EOL }`, ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});

// ******** TEST isCmd4Directive .*************

describe( `Test isCmd4Directive import`, ( ) =>
{
   it( `isCmd4Directive should be a function `, ( ) =>
   {
      assert.isFunction( isCmd4Directive, `isCmd4Directive is not a function. Found: ${ typeof isCmd4Directive }` );
   });
});

describe( `Test isCmd4Directive`, ( ) =>
{
   it( `isCmd4Directive should identify a Cmd4 directive`, ( ) =>
   {
      let directive = "polling";
      let rc = isCmd4Directive( directive );
      assert.isString( rc.key, `Unexpected result for isCmd4Directive` );
      assert.equal( rc.key, directive, `Expected result to be "polling"` );
   });
   it( `isCmd4Directive should NOT identify an uppercase type `, ( ) =>
   {
      let directive = "Polling";
      let rc = isCmd4Directive( directive );
      assert.isNull( rc, `Expected result to be null` );
   });
   it( `isCmd4Directive should NOT identify an unknown type `, ( ) =>
   {
      let directive = "Blast";
      let rc = isCmd4Directive( directive );
      assert.isNull( rc, `Expected result to be null` );
   });
   it( `isCmd4Directive should identify an uppercase type if upperCase is checked`, ( ) =>
   {
      let directive = "Polling";
      let rc = isCmd4Directive( directive, true );
      assert.isString( rc.key, `Expected result to be a string` );
      assert.equal( rc.key, "polling", `Expected result to be "polling"` );
   });
});
