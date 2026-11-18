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

// get latest version of our package
function getLatestVersion( )
{
   return (async () => {
     try {
       const { default: latestVersion } = await import('latest-version');
       const result = await latestVersion( myPkg.name );
       //console.log("result is " + result);
       return result;
     } catch (err) {
       console.error('Error getting latest Version :', err);
       return null;
     }
   })();
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


// Export the internal functions we wish to expose.
module.exports = { getLatestVersion, isVersionNewerThanPackagedVersion, getPackagedVersion };
