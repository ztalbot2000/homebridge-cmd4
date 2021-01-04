// Post install notes


// Fun colour stuff
const chalk = require( "chalk" );

const package = require( "./package.json")

if (package.version.includes( "3.0.0" ) ||
    package.version.includes( "3.0.0" ))
{
   console.log( chalk.underline( `HomeBridge-Cmd4 Version 3.0.0 Notes:\n` ) );
   console.log( chalk.green( `* ` ) + `For new users, you will need to follow the README to continue the configuration of HomeBridge-CMD4.\n` );
   console.log( chalk.green( `* ` ) + `With this version, it is ` + chalk.red( `*Very* ` ) + `important that you read the Changelogs as there are some new options avaliable..\n` );
   console.log(`\n   As always, if you like this plugin, don't forget to star it on GitHub.\n`);
   console.log(`\n   Enjoy`);
   console.log(`      John Talbot\n\n`);
}
