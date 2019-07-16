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
  console.log("\n%sHomeBridge-Cmd4 Version 1.3.0 Notes:%s", KUND, KEND);
  console.log("   %sWARNING%s: The included config.json file has been changed to fix an issue with spacing in the name 'My v1 Fan' to 'My_v1Fan'.", KYEL, KEND);
  console.log("Spaces in the accessory name alters the number of shell command line arguments and should be used with caution; please copy it to:");
  console.log("%s  $HOME/.homebridge/%s", KGRN, KEND);
  console.log("or take the appropriate actions.");
  console.log("\n");
  console.log("This version adds in functionality of fakegato-history for the Eve app.\n");
  console.log("Fakegato-history is quite new.  Please inform me if there is problems as fakegato-history evolves.\n");
  console.log("\n");
  console.log("\n%sHomeBridge-Cmd4%s Version 1.3.1 Notes:", KUND, KEND);
  console.log("This version makes constants out of various types which fixes a few internal issues.\n");
  console.log("If upgrading from versions less than 1.3.0, See notes above.\n");
  console.log("\n");
  console.log("\nThanks");
  console.log("   John Talbot");
  console.log("\nP.S. If you really enjoy homebridge-cmd4, please star it on GitHub\n");
}

if (package.version.includes('2.0.0') ||
    package.version.includes('2.1.0') ||
    package.version.includes('2.1.2') ||
    package.version.includes('2.1.3'))
{
  console.log("\n%sHomeBridge-Cmd4 Version 2.0 Notes:%s", KUND, KEND);
  console.log("   This version changes the philosophy of homebridge-Cmd4 from Accessories that have known characteristics as per the HAP Spec to assigning any characteristic to any Accessory.\n");
  console.log("By default only the required characteristics are assigned to each accessory, achieving the prevous results.");
  console.log("For the more adventurous though, you may be able to configure accessories with new capabilities !!!");
  console.log("\nThe format of the config.json file is the same, except for the recently added fakegato services. See the README.md file for the new rules. They are more aligned with fakegato.");
  console.log("\nYou will find that version 2.0 is much more configurable than the past with 60 new characteristics , totalling 160 possibilities and the ability to poll for anything at any interval to be much more convenient.");
  console.log("\nFor those with their own scripts, nothing changes as the format sent and received is exactly the same.");
  console.log("\nThis new version also supports, TV, TV Speaker, Input Source, Irrigation, Faucet and many others.  You will need to copy the included config.json file and State.js file to their appropriate locations to see these new devices.");

  console.log("\n\n%sHomeBridge-Cmd4 Version 2.1.0 Notes:%s", KUND, KEND);
  console.log("   This minor version removes 5000 plus lines of code for a more reliable lookup table of characteristics and services. No new functionality was added.");

  console.log("\n\n%sHomeBridge-Cmd4 Version 2.1.2 Notes:%s", KUND, KEND);
  console.log("   This minor version adds in 2796 passing unit tests and completes the lookup table, reducing yet more code and further increasing reliability. See the README for more information on unit testing.  The unit tests caught some difficiencies that require you to copy tHe State.js and config.json files from the distribution to their respective locations, if you use them..\n");
  console.log("   %sWARNING%s: The included config.json and State.js file has been changed to fix issues found through unit testing in this version.", KYEL, KEND);

  console.log("\nVersion 1.3.1 - 5194 lines of code");
  console.log("Version 2.0   - 8576 lines of code");
  console.log("Version 2.1   - 2825 lines of code");
  console.log("Version 2.1.2 - 2635 lines of code");

  console.log("\n\nEnjoy");
  console.log("   John Talbot");
  console.log("\nP.S. If you really enjoy homebridge-cmd4, please star it on GitHub\n");
}

if (package.version.includes('2.2.0'))
{

  console.log("\n%sHomeBridge-Cmd4 Version 2.2.0 Notes:%s", KUND, KEND);
  console.log("   This version adds in linked accessories. HDMI Input sources for a TV are now shown in HomeKit as an example.\n");
  console.log("   This version also allows the config.json file to be populated with constants (Where applicable). See the README.md file for more information.\n");
  console.log("   With constants, the number of testcases has risen to 4150. That equates to almost 61\% more coverage, And less errors.\n");
  console.log("   Finally this release adds in version checking so you are always up to date with the latest version of Homebridge-Cmd4.\n");
  console.log("\n\nEnjoy");
  console.log("   John Talbot");
  console.log("\nP.S. If you really enjoy homebridge-cmd4, please star it on GitHub\n");
}

if (package.version.includes('2.2.1') ||
    package.version.includes('2.2.2'))
{
  console.log("\n%sHomeBridge-Cmd4 Version 2.2.2 Notes:%s", KUND, KEND);
  console.log(" -  This minor version adds an eror message when accidentally defining multiple characteristics for characteristic polling.\n");
  console.log("\n%sHomeBridge-Cmd4 Version 2.2.1 Notes:%s", KUND, KEND);
  console.log(" -  This minor version differentiates the optional characteristic 'Name' from displayName");
  console.log("    displayName is used when creating the service.  It is essentially the same thing, but this follows the spec exactly.  You do not need to change your config.json file if you do not want too.");
  console.log(" -  Internally all properties of all characteristics are defined.");
  console.log("    Homebridge does not allow you to getCharacteristic information easily.  This allows Cmd4 to stop you from using characteristics with a format of TLV8 that causes HomeBridge to fail to start.  This is why the new option:'allowTLV8' was created and set to false by default. Again just ignore it."); 
  console.log(" -  With all the properties defined, Test cases increases to 7644.");
  console.log("\nAs always, check the config.min.json file for descriptive config.json parameters and remember to star HomeBridge-Cmd4 if you enjoy using it.");
  console.log("\n\nEnjoy");
  console.log("   John Talbot");
  
}
