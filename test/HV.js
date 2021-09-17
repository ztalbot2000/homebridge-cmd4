"use strict";


let HV = require( "../utils/HV" );
let constants = require( "../cmd4Constants" );


describe(`A Hierarchy Variable Test`, ( ) =>
{
   it( `Test creation of HV`, ( ) =>
   {
      const hv = new HV( );

      assert.instanceOf( hv , HV, "Expected hv to be instance of HV. Found %s" , hv );
      assert.isFunction( hv.update, ".update is not a function" );

      assert.equal( hv.allowTLV8, constants.DEFAULT_ALLOW_TLV8, `default not created` );
      assert.equal( hv.debug, constants.DEFAULT_DEBUG, `default not created` );
      assert.equal( hv.outputConstants, constants.DEFAULT_OUTPUTCONSTANTS, `default not created` );
      assert.equal( hv.interval, constants.DEFAULT_INTERVAL, `default not created` );
      assert.equal( hv.stateChangeResponseTime, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, `default not created` );
      assert.equal( hv.statusMsg, constants.DEFAULT_STATUSMSG, `default not created` );
      assert.equal( hv.timeout, constants.DEFAULT_TIMEOUT, `default not created` );


   });

   it( `HV can update variables`, ( done ) =>
   {
      let data =
      {
         allowTLV8: false,
         debug: true,
         outputConstants: true,
         interval: 100,
         stateChangeResponseTime: 122,
         statusMsg: false,
         timeout: 141
      };
      let hv = new HV( );

      // Simple check previously tested
      assert.equal( hv.allowTLV8, constants.DEFAULT_ALLOW_TLV8, `default not created` );

      hv.update( data );

      assert.equal( hv.allowTLV8, data.allowTLV8, `hv not updated` );
      assert.equal( hv.debug, data.debug, `hv not updated` );
      assert.equal( hv.outputConstants, data.outputConstants, `hv not updated` );
      assert.equal( hv.interval, data.interval, `hv not updated` );
      assert.equal( hv.stateChangeResponseTime, data.stateChangeResponseTime, `hv not updated` );
      assert.equal( hv.statusMsg, data.statusMsg, `hv not updated` );
      assert.equal( hv.timeout, data.timeout, `hv not updated` );

      done( );
   });

   it( `Test HV can update updated variables`, ( done ) =>
   {
      let data =
      {
         allowTLV8: false,
         debug: true,
         outputConstants: true,
         interval: 100,
         stateChangeResponseTime: 122,
         statusMsg: false,
         timeout: 141
      };
      let hv = new HV( );

      hv.update( data );

      let data2 =
      {
         allowTLV8: true,
         debug: false,
         outputConstants: false,
         interval: 300,
         // stateChangeResponseTime: 122,
         statusMsg: true,
         timeout: 333
      };

      hv.update( data2 );

      assert.equal( hv.allowTLV8, data2.allowTLV8, `hv not updated` );
      assert.equal( hv.debug, data2.debug, `hv not updated` );
      assert.equal( hv.outputConstants, data2.outputConstants, `hv not updated` );
      assert.equal( hv.interval, data2.interval, `hv not updated` );
      assert.equal( hv.stateChangeResponseTime, data.stateChangeResponseTime, `hv not updated` );
      assert.equal( hv.statusMsg, data2.statusMsg, `hv not updated` );
      assert.equal( hv.timeout, data2.timeout, `hv not updated` );

      done( );
   });

   it( `Test HV copy does not change original`, ( done ) =>
   {
      const hv = new HV( );

      let rHV = Object.assign( {}, hv );
      assert.equal( hv.timeout, constants.DEFAULT_TIMEOUT, `hv not initialized` );

      rHV.timeout = 1500;

      assert.equal( rHV.timeout, 1500, `rhv not changed` );
      assert.equal( hv.timeout, constants.DEFAULT_TIMEOUT, `hv was changed` );

      done( );
   });

   it( `Test HV copy does not change original`, ( done ) =>
   {
      const hv = new HV( );

      let rHV = Object.assign( {}, hv );
      rHV.update = hv.update;

      assert.equal( hv.timeout, constants.DEFAULT_TIMEOUT, `hv not initialized` );

      let data =
      {
         allowTLV8: true,
         debug: false,
         outputConstants: false,
         interval: 300,
         // stateChangeResponseTime: 122,
         statusMsg: true,
         timeout: 333
      };

      rHV.update( data );

      // Check changed
      assert.equal( rHV.allowTLV8, data.allowTLV8, `rHV not updated` );
      assert.equal( rHV.debug, data.debug, `rHV not updated` );
      assert.equal( rHV.outputConstants, data.outputConstants, `rHV not updated` );
      assert.equal( rHV.interval, data.interval, `rHV not updated` );
      assert.equal( rHV.stateChangeResponseTime, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, `default not created` );
      assert.equal( rHV.statusMsg, data.statusMsg, `rHV not updated` );
      assert.equal( rHV.timeout, data.timeout, `rHV not updated` );

      // Check original
      assert.equal( hv.allowTLV8, constants.DEFAULT_ALLOW_TLV8, `default was changed` );
      assert.equal( hv.debug, constants.DEFAULT_DEBUG, `default was changed` );
      assert.equal( hv.outputConstants, constants.DEFAULT_OUTPUTCONSTANTS, `default was changed` );
      assert.equal( hv.interval, constants.DEFAULT_INTERVAL, `default was changed` );
      assert.equal( hv.stateChangeResponseTime, constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME, `default was changed` );
      assert.equal( hv.statusMsg, constants.DEFAULT_STATUSMSG, `default was changed` );
      assert.equal( hv.timeout, constants.DEFAULT_TIMEOUT, `default was changed` );


      done( );

   });
});

