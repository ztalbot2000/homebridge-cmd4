"use strict";


// Need homebridge logging for Cmd4Accessory
var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
const log = logger_1.Logger.internal;

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins

// The Library files that know all.
var ACC_DATA = require( "../lib/CMD4_ACC_TYPE_ENUM" );
var DEVICE_DATA = require( "../lib/CMD4_DEVICE_TYPE_ENUM" );

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

var Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
log.info ("hello" );

// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{
   // it('log should be a function', ( ) =>
   // {
   //    assert.isFunction( log, "log is not an function" );
   // });

   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, "Characteristic is not an function" );
   });

   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, "Accessory is not an function" );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Service, "_api.hap.Service is not an function" );
   });

   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

// ******** TEST Cmd4Accessory *************
describe('A simple Cmd4Accessory Test', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test can create an instance of Cmd4Accessory", ( ) =>
   {
      let parentInfo = undefined;

      let result = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( result , Cmd4Accessory, "Expected result to be instance of Cmd4Accessory. Found %s" , result );
   });
});

describe('A simple Cmd4Accessory Test Debbuging enabled', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test can create an instance of Cmd4Accessory with Debug Enabled", ( ) =>
   {
      let parentInfo = undefined;
      logger_1.setDebugEnabled( );

      let result = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( result , Cmd4Accessory, "Expected result to be instance of Cmd4Accessory. Found %s" , result );

      logger_1.setDebugEnabled( false );
   });
});


describe('Test Cmd4Accessory variables ', ( ) =>
{
   let config={ name: "Test Switch",
                type: "Switch",
                on:   false
              };
   it( "Test typeIndex of a Switch set correctly ", ( ) =>
   {
      let parentInfo = undefined;

      let result = new Cmd4Accessory( log, config, _api, parentInfo );

      assert.instanceOf( result , Cmd4Accessory, "Expected result to be instance of Cmd4Accessory. Found %s" , result );

      assert.equal( result.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, "Expected typeIndex: %s Found: %s" , CMD4_DEVICE_TYPE_ENUM.Switch, result.typeIndex );
   });

   let parentInfo = undefined;
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      // Cannot create an accessory information of an accessory information
      if ( index == CMD4_DEVICE_TYPE_ENUM.AccessoryInformation )
      {
         continue;
      }

      it( "Test typeIndex of all possible devices ", ( ) =>
      {
         config.name = "MY_" + CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;
         config.type = CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;

         log.info("Testing %s name: %s", index, config.name);
         let result = new Cmd4Accessory( log, config, _api, parentInfo );

         assert.instanceOf( result , Cmd4Accessory, "Expected result to be instance of Cmd4Accessory. Found %s" , result );

         assert.equal( result.typeIndex , index, "Expected typeIndex: %s for: %s. Found: %s" , index, config.type, result.typeIndex );
      });
   }
});

