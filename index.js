"use strict";

//
//                           Homebridge
// Flow                     /          \
//                         /            \
//      api.registerPlatform             api.registerAccessory
//     forEach Accessories{ }        Any { } before/after Accessories{ }
//         Cmd4Platform                      Cmd4Accessory
//         Cmd4Accessory
//
//
//
//
//
//
//
//
//
//

// The Cmd4 Classes
const Cmd4Accessory = require( "./Cmd4Accessory" ).Cmd4Accessory;
const Cmd4Platform = require( "./Cmd4Platform" ).Cmd4Platform;

const settings = require( "./cmd4Settings" );

// Pretty colors
const chalk = require( "chalk" );

// The Library files that know all.
let CMD4_DEVICE_TYPE_ENUM = settings.CMD4_DEVICE_TYPE_ENUM;
let CMD4_ACC_TYPE_ENUM = settings.CMD4_ACC_TYPE_ENUM;
let clonedCharacteristic = settings.clonedCharacteristic;

module.exports =
{
   default: function ( api )
   {
      // Init the libraries for all to use
      CMD4_DEVICE_TYPE_ENUM.init( api.hap.Service );
      console.log( chalk.red( "\n* IGNORE * this message -> " ) + `The plugin "homebridge-cmd4" defines "hap-nodejs" in their 'dependencies' section,' hap-nodejs is needed for homebridge-ui. Homebridge bug #2971.\n`);

      api.registerAccessory( settings.PLATFORM_NAME, Cmd4Accessory );
      api.registerPlatform( settings.PLATFORM_NAME, Cmd4Platform );

      setTimeout( checkForUpdates, 1800 );

      // This is not required by homebridge and does not affect it.  I use it for
      // unit testing.
      return { clonedCharacteristic,
               CMD4_ACC_TYPE_ENUM,
               CMD4_DEVICE_TYPE_ENUM,
               api
             };
   },
   // These would be the uninitialized values,
   // used for unit testing
   clonedCharacteristic:  clonedCharacteristic, // properties would be { } empty.
   CMD4_ACC_TYPE_ENUM:    CMD4_ACC_TYPE_ENUM,   // properties would be { } empty.
   CMD4_DEVICE_TYPE_ENUM: CMD4_DEVICE_TYPE_ENUM // properties would be { } empty.

}

function checkForUpdates( )
{
   // Don't show the updates message in mocha test mode
   if ( process.argv.includes( "test/mocha-setup" ) )
      return;

   const { getLatestVersion, isVersionNewerThanPackagedVersion }  = require( "./utils/versionChecker" );
   const myPkg = require( "./package.json" );

   ( async( ) =>
   {
      let lv = await getLatestVersion( );

      if ( isVersionNewerThanPackagedVersion( lv ) )
      {
         console.log( chalk.green( `[UPDATE AVAILABLE] ` ) + `Version ${lv} of ${myPkg.name} is available. Any release notes can be found here: ` + chalk.underline( `${myPkg.changelog}` ) );
      }
   })( );
}
