// Post install notes


// Fun colour stuff
KNRM="\x1B[0m";
KRED="\x1B[31m";
KGRN="\x1B[32m";
KYEL="\x1B[33m";
KBLU="\x1B[34m";
KMAG="\x1B[35m";
KCYN="\x1B[36m";
KWHT="\x1B[37m";
KUND="\033[4m";
KEND="\033[0m";

const package = require('./package.json')

if (package.version.includes('2.4.0') ||
    package.version.includes('2.4.0'))
{
   console.log("\n%sHomeBridge-Cmd4 Version 2.3.0 Notes:%s\n", KUND, KEND);
   console.log("%s * %s For new users, you will need to follow the README to continue the configuration of HomeBridge-CMD4.\n", KGRN, KEND);
   console.log("%s * %s For creating your own scripts, Please look at some of the examples in the 'Examples' sub-directory of this installed plugin or the extensively commented State.js script.\n", KGRN, KEND);
   console.log("%s * %s If you are updating to this newer version of CMD4, The change logs are now all included in a separate ChangeLog file found with this plugin or on GitHub.\n", KGRN, KEND);
   console.log("\n\n   As always, if you like this plugin, don't forget to star it on GitHub.\n");
   console.log("\n   Enjoy");
   console.log("      John Talbot\n\n");
}
