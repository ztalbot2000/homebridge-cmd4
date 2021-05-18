'use strict';

// How To use:
//
// 1. In package.json change scipt "test", adding:
//       node_modules/.bin/mocha --require ./test/async-dump.js
// 2. In the failing test add at the top:
//       after(function () {
//          global.asyncDump();
//       });
// 3. Run the test
//       npm run test test/failingTest
//
//
// Taken from: https://gist.github.com/boneskull/7fe75b63d613fa940db7ec990a5f5843

const { createHook } = require( 'async_hooks' );
const { stackTraceFilter } = require( 'mocha/lib/utils' );
const allResources = new Map();

// this will pull Mocha internals out of the stacks
const filterStack = stackTraceFilter();

const hook = createHook({
   init(asyncId, type, triggerAsyncId)
   {
      allResources.set(asyncId, { type, triggerAsyncId, stack: ( new Error( ) ).stack });
   },
   destroy( asyncId ) {
      allResources.delete( asyncId );
   }
}).enable( );

global.asyncDump = module.exports = ( ) => {
   hook.disable( );
   console.error(`
STUFF STILL IN THE EVENT LOOP:`)
   allResources.forEach(value => {
      console.error( `Type: ${value.type}` );
      console.error( filterStack(value.stack ) );
      console.error( '\n' );
   });
};
