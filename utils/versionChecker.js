'use strict';

// These routines are used to get this packages
// version information.
// It not only uses Promises but creates Promises
// and is documented as such.

const latestVersion = require( "latest-version" );

// Retrieve the package information that contains
// things like the current version.
const myPkg = require( "../package.json" );

// Split the version into its sub components.
function splitVersion( version )
{
   let parts = version.split( "." );
   return { "version": parts[ 0 ], "major": parts[ 1 ], "minor": parts[ 2 ] };
}

// getLatestVersion could just be defined as:
//     function getLatestVersion ( )
// However, defining it this way signifies it
// returns a Promise. In this case the Promise
// given to us by latestVersion.
const getLatestVersion = async ( ) =>
{
   return latestVersion( myPkg.name );
}

function getPackagedVersion( )
{
   return myPkg.version;
}

// Check that there is a possible upgrade out there.
function isVersionNewerThanPackagedVersion( version )
{
   // The default return code.
   let rc = false;

   // Split the version components into their sub components
   let installedVersionInfo = splitVersion( myPkg.version );
   let gitVersionInfo = splitVersion( version );

   // Set the return code appropriately
   if ( Number( gitVersionInfo.version ) > Number( installedVersionInfo.version ) )
      return true;
   if ( Number( gitVersionInfo.version ) < Number( installedVersionInfo.version ) )
      return false;
   if ( Number( gitVersionInfo.major ) > Number( installedVersionInfo.major ) )
      return true;
   if ( Number( gitVersionInfo.major ) < Number( installedVersionInfo.major ) )
      return false;
   if ( Number( gitVersionInfo.minor ) > Number( installedVersionInfo.minor ) )
      return true;

   return rc;
}


// Check that there is a possible upgrade out there.
function isUpgrade( )
{
   // Create a new Promise that will be fufilled when we processed the
   // information provided to us by the Promise of getLatestVersion.
   // You cannot take an asynchronous call and convert it to a synchronous
   // call unless you would create a timer and wait forever? for it
   // to complete, which defeats the purpose of node.js.
   return new Promise( ( resolve ) =>
   {
      // To use the promise of getLatestVersion, it must be in an async function
      // so put it in one.
      ( async( ) =>
      {
         // Wait for the Promise of getLatestVersion to complete
         let lv = await getLatestVersion( );

         resolve( isVersionNewerThanPackagedVersion( lv ) );
      }
      )( );
   });
}

// Export the internal functions we wish to expose.
module.exports = { isUpgrade, getLatestVersion, isVersionNewerThanPackagedVersion, getPackagedVersion };
