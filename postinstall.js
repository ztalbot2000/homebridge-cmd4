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
      console.log( chalk.yellow( `HomeBridge-Cmd4 5.0.0+ Important Notice:\n` ) );
      console.log( `Cmd4 has been optimized for simplification and best practices. Its configuration has changed to what is recommended by Homebridge. See https://git.io/JtMGR.\n` );
      console.log( `Gone are the are the very confusing Cmd4_Mode and RestartRecovery. The only changes you will see are the warnings that these options are no longer required.` );
      console.log( chalk.red( `* ` ) + `RestartRecovery is now automatic; which not enabling could cause your device to turn on/off over a restart.` );
      console.log( chalk.red( `* ` ) + `Cmd4_Mode is as per https://git.io/JtMGR where the callback is immediate to homebridge with the data from your device to follow.` );
      console.log( chalk.red( `* ` ) + `Demo mode is still available by not defining any polling.\n` );

      console.log( chalk.underline( `Cmd4 New Users` ) );
      console.log( chalk.green( `* ` ) + `You will need to follow the README to continue the configuration of HomeBridge-CMD4.\n` );

      console.log(`\n   As always, if you like this plugin, don't forget to star it on GitHub.\n`);
      console.log(`\n   Enjoy`);
      console.log(`      John Talbot\n`);
})( );

