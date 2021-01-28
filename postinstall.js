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
      console.log( chalk.yellow( `HomeBridge-Cmd4 3.0.12+ Important Deprecation Notice:\n` ) );
      console.log( `State.js will soon be deprecated for Cmd4 Github pages at https://ztalbot2000.github.io/homebridge-cmd4 and some new Example script templates. The Cmd4 Github pages will become the portal for all your Cmd4 Information needs.` );
      console.log( `For new users who just want to see all the devices working, this would be accomplished with just the pre-existing config.json with full caching enabled.\n` );

      console.log( chalk.underline( `HomeBridge-Cmd4 3.0.0+ Notes:\n` ) );
      console.log( chalk.green( `* ` ) + `For new users, you will need to follow the README to continue the configuration of HomeBridge-CMD4.\n` );
      console.log( chalk.green( `* ` ) + `If you are upgrading to version 3.0, it is ` + chalk.red( `*Very* ` ) + `important that you read the Changelogs as there are some new options avaliable..\n` );
      console.log(`\n   As always, if you like this plugin, don't forget to star it on GitHub.\n`);
      console.log(`\n   Enjoy`);
      console.log(`      John Talbot\n`);
})( );

