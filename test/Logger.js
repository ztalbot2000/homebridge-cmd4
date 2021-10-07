"use strict";

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
// Let logger control logs for Unit Testing
settings.cmd4Dbg = true;

var _api = new HomebridgeAPI.HomebridgeAPI; // object we feed to Plugins

// Init the library for all to use
CMD4_ACC_TYPE_ENUM.init( _api.hap );
CMD4_DEVICE_TYPE_ENUM.init( _api.hap, _api.hap.Service );


let { Cmd4Accessory } = require( "../Cmd4Accessory" );


// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});


// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});


// ******** TEST logger  *************
describe('A simple logger Test', ( ) =>
{
   it( "Test bufferEnabled is off by default", ( ) =>
   {
      const log = new Logger( );
      log.setOutputEnabled( false );

      let STDOUT_DATA="stdout_data";
      log.info( STDOUT_DATA );

      // Logger adds a \n so use include
      assert.equal( log.logBuf , "", `Expected no logs to stdout` );
      assert.equal( log.logLineCount, 0 , `unexpected number of lines to stdout` );
      assert.equal( log.errBuf , "", `Expected no logs to stderr` );
      assert.equal( log.errLineCount, 0 , `unexpected number of lines to stderr` );

   });

   it( "Test info log to stdout gets captured and mothing else", ( ) =>
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STDOUT_DATA="stdout_data";
      log.info( STDOUT_DATA );

      // Logger adds a \n so use include
      assert.include( log.logBuf , STDOUT_DATA, `Expected logs to stdout for log.info ` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );
      assert.equal( log.errBuf , "", `Expected no logs to stderr` );
      assert.equal( log.errLineCount, 0 , `unexpected number of lines to stderr` );

   });

   it( "Test warn log to stderr gets captured and mothing else", ( ) =>
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STDERR_DATA="stderr_data";
      log.warn( STDERR_DATA );

      assert.equal( log.logBuf , "", `Expected no logs to stout` );
      assert.equal( log.logLineCount, 0 , `unexpected number of lines to stdout` );
      // Logger adds a \n so use include
      assert.include( log.errBuf , STDERR_DATA, `Expected logs to stderr for log.warn ` );
      assert.equal( log.errLineCount, 1 , `unexpected number of lines to stderr` );

   });

   it( "Test log to stderr gets captured and mothing else", ( ) =>
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STDERR_DATA="stderr_data";
      log.error( STDERR_DATA );

      assert.equal( log.logBuf , "", `Expected no logs to stdout` );
      assert.equal( log.logLineCount, 0 , `unexpected number of lines to stdout` );
      // Logger adds a \n so use include
      assert.include( log.errBuf , STDERR_DATA, `Expected logs to stderr` );
      assert.equal( log.errLineCount, 1 , `unexpected number of lines to stderr` );

   });

   it( "Test log to stderr and different to stdout", ( ) =>
   {
      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STDERR_DATA="stderr_data";
      let STDOUT_DATA="stdout_data";
      log.info( STDOUT_DATA );
      log.error( STDERR_DATA );

      // Logger adds a \n so use include
      assert.include( log.logBuf , STDOUT_DATA, `Expected logs to stdout for log.info ` );
      assert.equal( log.logLineCount, 1 , `unexpected number of lines to stdout` );
      // Logger adds a \n so use include
      assert.include( log.errBuf , STDERR_DATA, `Expected logs to stderr` );
      assert.equal( log.errLineCount, 1 , `unexpected number of lines to stderr` );

   });


   it( "Test can create an instance of Cmd4Accessory with new logger", ( ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         polling:                       true,
         state_cmd:                    "./test/echoScripts/echo_1"
      };

      const log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let accessory = new Cmd4Accessory( log, config, _api, [ ] );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory. Found %s" , accessory );
      assert.equal( log.logBuf , "", `unexpected logs to stdout for a simple instance of Cmd4Accessory` );
      assert.equal( log.logLineCount, 0 , `unexpected number of lines to stdout` );
      assert.equal( log.errBuf , "", `Expected no logs to stderr for a simple instance of Cmd4Accessory` );
      assert.equal( log.errLineCount, 0 , `unexpected number of lines to stderr` );

      log.reset();
   });

   it( "Test can create an instance of Cmd4Accessory with a debug log", ( ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         polling:                       true,
         state_cmd:                    "./test/echoScripts/echo_1"
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      new Cmd4Accessory( log, config, _api, [ ] );

      assert.include( log.logBuf, "Creating Standalone Accessory type for ", `Expected debug logs to stdout with setDebugEnabled` );
      //assert.equal( log.logLineCount, 17 , `unexpected number of lines to stdout` );
      assert.equal( log.errBuf, "", `Expected no logs to stderr for a simple instance of Cmd4Accessory` );
      assert.equal( log.errLineCount, 0 , `unexpected number of lines to stderr` );

      log.reset();
   });

   it( "Test logger performance of NOT enabled message", ( ) =>
   {
      const log = new Logger( );
      log.setBufferEnabled( false );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );
      let entry = { characteristicString: "testCharacteristic",
                    accessory:
                    { displayName: "testDevice",
                      queue:
                      { inProgressGets: 0,
                        inProgressSets: 0
                      }
                    }
                  };

      let logStartTime = process.hrtime( );

      log.debug( `OUTPUT FOR MEASUREMENT High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }` );
      let logTotalTime = process.hrtime( logStartTime );

      let debug = false;
      let debugStartTime = process.hrtime( );
      if ( debug ) log.debug( `OUTPUT FOR MEASUREMENT High priority "Get" queue interrupt attempted: ${ entry.accessory.displayName } ${ entry.characteristicString } inProgressSets:${ entry.accessory.queue.inProgressSets } inProgressGets: ${ entry.accessory.queue.inProgressGets }` );
      let debugTotalTime = process.hrtime(  debugStartTime );

      let diff = logTotalTime[1] - debugTotalTime[1];
      console.log( `logTotalTime: ${ logTotalTime[1] } debugTotalTime: ${ debugTotalTime[1] } diff: ${ diff }` );

      assert.isAbove( logTotalTime[1], debugTotalTime[1], `Expected log total time to be greater than debug total time` );

   });
});

