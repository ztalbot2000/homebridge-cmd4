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
var ACC_DATA = require( "./lib/CMD4_ACC_TYPE_ENUM" );
var DEVICE_DATA = require( "./lib/CMD4_DEVICE_TYPE_ENUM" );

module.exports =
{
   default: function ( api )
   {
      // Init the library for all to use
      let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( api.hap.Characteristic );
      let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, api.hap.Service, api.hap.Characteristic, api.hap.Categories );

      api.registerAccessory( settings.PLATFORM_NAME, Cmd4Accessory );
      api.registerPlatform( settings.PLATFORM_NAME, Cmd4Platform );

      setTimeout( checkForUpdates, 1800 );

      // This is not required by homebridge and does not affect it.  I use it for
      // unit testing.
      return { CMD4_ACC_TYPE_ENUM,
               CMD4_DEVICE_TYPE_ENUM,
               api
             };
   },
   // These would be the uninitialized values,
   // used for unit testing
   ACC_DATA: ACC_DATA,      // properties would be { } empty.
   DEVICE_DATA: DEVICE_DATA // properties would be { } empty.
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
