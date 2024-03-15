'use strict';

let { indexOfEnum } = require( "../utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

let isDevDirective = require( "../utils/isDevDirective" );
let lcFirst = require( "../utils/lcFirst" );


var _api = new HomebridgeAPI(); // object we feed to Plugins

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );



// ******** TEST isDevDirectivw .*************

describe( `Test isDevDirective import`, ( ) =>
{
   it( `isDevDirectivw should be a function `, ( ) =>
   {
      assert.isFunction( isDevDirective, `isDevDirective is not a function. Found: ${ typeof isDevDirective }` );
   });
});

describe( `Test isDevDirective`, ( ) =>
{
   it( `isDevDirective should identify a device `, ( ) =>
   {
      let deviceName = CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( CMD4_DEVICE_TYPE_ENUM.Switch );
      let rc = isDevDirective( deviceName );
      assert.isString( rc.deviceName, `Unexpected result for isDevDirective` );
      assert.equal( rc.deviceName, deviceName, `Expected result to be "on"` );
      assert.equal( rc.devEnumIndex, CMD4_DEVICE_TYPE_ENUM.Switch, `UnExpected result` );
   });
   it( `isDevDirective should NOT identify an lowercase deviceName `, ( ) =>
   {
      let deviceName = CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( CMD4_DEVICE_TYPE_ENUM.Switch );
      let lcDeviceName = lcFirst( deviceName );
      let rc =  isDevDirective( lcDeviceName );
      assert.isNull( rc.devEnumIndex, `Expected result to be null` );
   });
   it( `isDevDirective should NOT identify an unknown deviceName `, ( ) =>
   {
      let deviceName = "Blast";
      let rc =  isDevDirective( deviceName );
      assert.isNull( rc.devEnumIndex, `Expected result to be null` );
   });
   it( `isDevDirective should identify an lower case deviceName if lowerCase is checked`, ( ) =>
   {
      let deviceName = CMD4_DEVICE_TYPE_ENUM.devEnumIndexToC( CMD4_DEVICE_TYPE_ENUM.Switch );
      let lcDeviceName = lcFirst( deviceName );
      let rc =  isDevDirective( lcDeviceName, true );

      assert.isString( rc.deviceName, `Unexpected result for isDevDirective` );
      assert.equal( rc.deviceName, deviceName, `Expected result to be "on"` );
      assert.equal( rc.devEnumIndex, CMD4_DEVICE_TYPE_ENUM.Switch, `UnExpected result` );
   });
});
