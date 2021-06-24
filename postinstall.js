// Post install notes


// Fun colour stuff
const chalk = require( "chalk" );

const myPkg = require( "./package.json" );

const { isUpgrade }  = require( "./utils/versionChecker" );

// To use await you must be in an async function, so put it in one.
( async( ) =>
{
      // Wait for the Promise of isUpgrade to complete.
      let lv = await isUpgrade( );

      if ( lv == true )
      {
         console.log( chalk.green( `[UPDATE AVAILABLE] ` ) + `Version ${lv} of ${myPkg.name} is available. Any release notes can be found here: ` + chalk.underline( `${myPkg.changelog}` ) );
      }
      console.log( chalk.yellow( `HomeBridge-Cmd4 4.0.0+ Important Notice:\n` ) );
      console.log( `Cmd4 uses a copy of Homebridges logging system so that turning on debugging does not turn on debugging of other plugins.` );
      console.log( `Debug can be enabled with, "Debug": true in the Cmd4 Platform section or if using config-ui-x, placing "Cmd4" in the DEBUG environmental variable section.\n` );

      console.log( chalk.underline( `Cmd4 New Users\n` ) );
      console.log( chalk.green( `* ` ) + `You will need to follow the README to continue the configuration of HomeBridge-CMD4.\n` );

      console.log(`\n   As always, if you like this plugin, don't forget to star it on GitHub.\n`);
      console.log(`\n   Enjoy`);
      console.log(`      John Talbot\n`);
})( );

