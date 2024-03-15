'use strict';

const os = require( "os" );
const cmd4StateDir = os.homedir( ) + "/.homebridge/Cmd4Scripts/Cmd4States/"

var glob = require( "glob" );


describe( 'Cleaning up any old Cmd4States/Status_Device_* files ...', ( ) =>
{
   glob( cmd4StateDir + "Status_Device_*", null, function ( er, files )
   {
      for ( var file of files )
      {
         // To use the promise of unlink, it must be in an async function
         // so put it in one.  Why not unLinkSync, because for whatever reason
         // some files were notbremoved synchronously.
         ( async( ) =>
         {
            await fs.unlink( file, function( err, result )
            {
               it('file:' + file +' should be removed', function ( done )
               {
                  if ( err && err.code != 'ENOENT' )
                     assert.isNull( err, 'file not removed err: ' + err + " result: " + result );
                  done( );
               });
            });
         });
      }
   })
});



function removeStateFileThatShouldAlreadyBeRemoved( characteristicString )
{
   let stateFile = cmd4StateDir + "Status_Device_" + characteristicString;
   if (fs.existsSync( stateFile ))
   {
      // console.log(' *** BLAST! The path exists.' + stateFile );
      // To use the promise of unlink, it must be in an async function
      // so put it in one.  Why not unLinkSync, because for whatever reason
      // some files were notbremoved synchronously.
      ( async( ) =>
      {
         fs.unlink( stateFile, function( err, result )
         {
            if ( err && err.code != 'ENOENT' )
               assert.isNull( err, 'file not removed err: ' + err + " result: " + result );
         });
      });
   }
}


// ***************** TEST LOADING **********************

// This would be the plugin un-initialized
var pluginModule = require( "../index" );

describe( "Testing load of index.js", ( ) =>
{
   it( "index.js loaded should not be null", ( ) =>
   {
      assert.isNotNull( pluginModule, "loading resulted in null" );
   });

   var t = typeof pluginModule.default;
   it( "index.js default initializer should be found", ( ) =>
   {
      assert.equal( t, "function");
   });
});

// ************ TEST UNINITIALIZED CMD4_DEVICE_TYPE_ENUM EOL **************
describe( "Quick Testing CMD4_DEVICE_TYPE_ENUM EOL", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM has EOL", ( ) =>
   {
      assert.isNotNull( pluginModule.DEVICE_DATA.CMD4_DEVICE_TYPE_ENUM.EOL, "EOL is null" );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL = " + DEVICE_EOL, ( ) =>
   {
      assert.equal( pluginModule.DEVICE_DATA.CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL );
   });
});

var _api = new HomebridgeAPI( ); // object we feed to Plugins

describe( "Testing homebridge API", ( ) =>
{
   it( "API should not be null", ( ) =>
   {
      assert.isNotNull( _api, "_api is null");
   });
});

describe( "Initializing our plugin module", ( ) =>
{});
var cmd4 = pluginModule.default( _api );




// ***************** TEST State.js **********************
const child_process = require( "child_process" );


// *** TEST Get of Characteristic properties of default written data *******
describe( "Testing State.js Get Characteristics default written data ( " + CMD4_ACC_TYPE_ENUM.EOL + " of them )", ( ) =>
{
   for ( let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
      let characteristicString = cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = "./Extras/Cmd4Scripts/State.js";
      let args2 = " Get Device " + characteristicString + " ";
      let args = ["Get", "Device", characteristicString ];

      it( accTypeEnumIndex + ": " + cmd + args2 + "should return something", ( ) =>
      {

         // Why twice with two awaits, beats me !
         removeStateFileThatShouldAlreadyBeRemoved( characteristicString );

         const ps = child_process.spawnSync( cmd, args );

         var data="not set by me";

         if ( ps.status !== 0 )
         {
             assert.equal( ps.status, 0, "Process error stdout: " + ps.stdout + " stderr: " + ps.stderr + " status: " + ps.status + " signal: " + ps.signal );
         } else {
           data = ps.stdout;
           assert( data != "", "data returned '" + data + "'" );

           assert( data.length != 0, "data returned: " + data.length );
        }
     });
   }
});

// *** TEST Set of Characteristic properties *******

let dummyData = "X0X0Test";
let dummyDataR = "\"" + dummyData + "\"";

describe( `Testing State.js Set Characteristics ( ${ CMD4_ACC_TYPE_ENUM.EOL } of them )`, ( ) =>
{
   for ( let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = "./Extras/Cmd4Scripts/State.js";
      let args2 = " Set Device " + characteristicString + " " + dummyData;
      let args = ["Set", "Device", characteristicString, dummyData];

      const ps = child_process.spawnSync( cmd, args );

      it( accTypeEnumIndex + ": " + cmd + args2 + " should return no data", ( ) =>
      {
         var data="not set by me";

         // console.log( "status is '%s'", ps.status );
         if ( ps.status !== 0 )
         {
            assert.equal( ps.status, 0, "Process error stdout: " + ps.stdout + " stderr: " + ps.stderr + " status: " + ps.status + " signal: " + ps.signal );
         } else {
           data = ps.stdout;
           assert( data == "", "No data should be returned: '" + data + "'" );

        }
     });
   }
});

// *** TEST Get of Characteristic properties after set of dummy data *******

describe( "Begin Testing", ( ) =>
{});


// *** TEST Get of Characteristic properties of written data *******
describe( "Testing State.js Get Characteristics written data ( " + cmd4.CMD4_ACC_TYPE_ENUM.EOL + " of them ). Note: May fail even number of times ????", ( ) =>
{
   for ( let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = "./Extras/Cmd4Scripts/State.js";
      let args2 = " Get Device " + characteristicString + " ";
      let args = ["Get", "Device", characteristicString];

      it( accTypeEnumIndex + ": " + cmd + args2 + "should return: " + dummyDataR , ( ) =>
      {
         const ps = child_process.spawnSync( cmd, args );

         var data="not set by me";

         if ( ps.status !== 0 )
         {
           assert.equal( ps.status, 0, "Process error stdout: " + ps.stdout + " stderr: " + ps.stderr + " status: " + ps.status + " signal: " + ps.signal );
         } else {
           data = ps.stdout;
           // fixme ??? assert( data == dummyData, "data returned: '" + data + "'" );
           //  The carriage return is stripped by getValue
           assert( data == dummyDataR, "data returned:" + data );

           assert( data.length != 0, "data returned: " + data.length );
        }
     });
   }
});
