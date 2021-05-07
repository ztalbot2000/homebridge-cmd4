"use strict";
//
// This is the name of the platform that users will use to register
// the plugin in the Homebridge config.json
//
exports.PLATFORM_NAME = "Cmd4";

//
// This *MUST* match the name of your plugin as defined the package.json
//
exports.PLUGIN_NAME = "homebridge-cmd4";

// These must be global so that all characteristics are not
// polled at the same time. Specifically a MyAir that has
// multiple fans, switches and temperature sensors, all in
// the same device of which a linkedAccessory is not an option.
exports.arrayOfAllStaggeredPollingCharacteristics = [ ];
exports.listOfCreatedPriorityQueues = { };
