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

if (package.version.includes('1.2.3') ||
    package.version.includes('1.2.4'))
{
  console.log("\n%sHomeBridge-Cmd4%s", KUND, KEND);
  console.log("%sWARNING%s: The included State.js file has been changed to fix an issue with ERR_INVALID_CALLBACK.", KYEL, KEND);
  console.log("If you have not alterred State.js, or this is your first install of homebridge-cmd4; please copy it to:");
  console.log("%s  $HOME/.homebridge/Cmd4Scripts/%s", KGRN, KEND);
  console.log("or take the appropriate actions.");
  console.log("\nThanks");
  console.log("   John Talbot");
  console.log("\nP.S. If you really enjoy homebridge-cmd4, please star it on GitHub\n");
}
