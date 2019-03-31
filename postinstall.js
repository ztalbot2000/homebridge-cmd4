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

if (package.version.includes('1.3.0') ||
    package.version.includes('1.3.1'))
{
  console.log("\n%sHomeBridge-Cmd4%s Version 1.3.0 Notes", KUND, KEND);
  console.log("%sWARNING%s: The included config.json file has been changed to fix an issue with spacing in the name 'My v1 Fan' to 'My_v1Fan'.", KYEL, KEND);
  console.log("Spaces in the accessory name alters the number of shell command line arguments and should be used with caution; please copy it to:");
  console.log("%s  $HOME/.homebridge/%s", KGRN, KEND);
  console.log("or take the appropriate actions.");
  console.log("\n");
  console.log("This version adds in functionality of fakegato-history for the Eve app.\n");
  console.log("Fakegato-history is quite new.  Please inform me if there is problems as fakegato-history evolves.\n");
  console.log("\n");
  console.log("\n%sHomeBridge-Cmd4%s Version 1.3.1 Notes", KUND, KEND);
  console.log("This version makes constants out of various types which fixes a few internal issues.\n");
  console.log("If upgrading from versions less than 1.3.0, See notes above.\n");
  console.log("\n");
  console.log("\nThanks");
  console.log("   John Talbot");
  console.log("\nP.S. If you really enjoy homebridge-cmd4, please star it on GitHub\n");
}
