'use strict';

// This is not a utility. This is a testcase, but not a Unit test either.
// Lint had picked up an error that indexOfEnum was set, but not used; though
// the function worked perfectly as proven by unit testing.
// What I had found is that without the Object.defineProperty within the
// requiring code, like this one, lint would fail.
//
// This test is placed here, just to remember that reason.


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI( ); // object we feed to Plugins



var { indexOfEnum } = require( "../utils/indexOfEnum" );

Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

let ACC_DATA = require('../lib/CMD4_ACC_TYPE_ENUM');
let DEVICE_DATA = require('../lib/CMD4_DEVICE_TYPE_ENUM');

let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


let i=0;
let j = 63;
let type;
let ucKeyIndex;

type = CMD4_DEVICE_TYPE_ENUM.properties[ j ]. deviceName;
console.log("checking type:" + type );


ucKeyIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === type);
if ( ucKeyIndex < 0 )
{
   console.log("FAIL: Invalid device type:%s", type );
} else {
   console.log("PASS (:%s) %s = %s", type, i, ucKeyIndex );
}

type="blah";
console.log("checking type:" + type );


ucKeyIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === type);
if ( ucKeyIndex < 0 )
{
   console.log("PASS: Invalid device type:%s", type );
} else {
   console.log("FAIL: (%s) %s = %s", type, i, ucKeyIndex );
}
