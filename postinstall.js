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

if (package.version.includes('3.0.0') ||
    package.version.includes('3.0.0'))
{
   console.log("\n%sHomeBridge-Cmd4 Version 3.0.0 Notes:%s\n", KUND, KEND);
   console.log("%s * %s For new users, you will need to follow the README to continue the configuration of HomeBridge-CMD4.\n", KGRN, KEND);
   console.log("%s * %s With this version, it is *%sVery%s* important that you read the Changelogs.\n", KGRN, KEND, KMAG, KEND);
   console.log("\n\n   As always, if you like this plugin, don't forget to star it on GitHub.\n");
   console.log("\n   Enjoy");
   console.log("      John Talbot\n\n");
}
