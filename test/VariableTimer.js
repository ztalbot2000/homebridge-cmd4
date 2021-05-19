"use strict";


let VariableTimer = require( "../utils/VariableTimer" );


describe('A Variable Timer Test', ( ) =>
{
   it( "Test creation of variableTimer", ( ) =>
   {
      const timer = new VariableTimer( );

      assert.instanceOf( timer , VariableTimer, "Expected timer to be instance of VariableTimer. Found %s" , timer );
      assert.isFunction( timer.start, ".start is not a function" );
      assert.isFunction( timer.stop, ".stop is not a function" );
      assert.isFunction( timer.set_interval, ".set_interval is not a function" );

   });

   // Only skip this test because it takes 20 seconds
   it.skip( "Test timer can change intervals, stop start ...", ( done ) =>
   {
      const timer = new VariableTimer( );
      var start = new Date();
      var total = 0;

      timer.start( ( ) =>
      {
         var end = new Date();
         var seconds = ( end - start) / 1000
         total += Math.trunc( seconds );
         start = end;
         console.log(`done ${ seconds } ${ total }`);
      }, 1000);
      assert.equal( timer.iv, 1000, "iv is set incorrectly" );
      setTimeout(() =>
      {
         console.log("changing timer to 2 seconds.");
         timer.set_interval( 2000 );
         assert.equal( timer.iv, 2000, "iv is reset incorrectly" );
         assert.equal( total, 4, "total is incorrect" );
         setTimeout(() =>
         {
            assert.equal( total, 12, "total is incorrect" );
            timer.stop();
            done();
         }, 10000);
      }, 5000);

   }).timeout(20000);

   it( "Test timer can change intervals, only by .5s increments", ( done ) =>
   {
      const timer = new VariableTimer( );
      var start = new Date();
      var total = 0;

      timer.start( ( ) =>
      {
         var end = new Date();
         var seconds = ( end - start) / 1000
         total += Math.trunc( seconds );
         start = end;
         console.log(`done ${ seconds } ${ total }`);
      }, 1000);
      assert.equal( timer.iv, 1000, "iv is set incorrectly" );
      timer.set_interval( 2000 );
      assert.equal( timer.iv, 2000, "iv reset to 2000 incorrectly" );
      timer.set_interval( 2100 );
      assert.equal( timer.iv, 2000, "iv reset incorrectly to 2100" );
      timer.set_interval( 2500 );
      assert.equal( timer.iv, 2500, "iv reset incorrectly to 2500" );
      timer.set_interval( 2999 );
      assert.equal( timer.iv, 2500, "iv reset incorrectly to 2999" );
      timer.set_interval( 3000 );
      assert.equal( timer.iv, 3000, "iv reset incorrectly to 3000" );
      timer.set_interval( 2500 );
      assert.equal( timer.iv, 2500, "iv reset incorrectly down to 2500" );
      timer.stop();
      done( );

   }).timeout(20000);
});

