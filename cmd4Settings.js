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
//exports.arrayOfAllStaggeredPollingCharacteristics = [ ];
exports.listOfCreatedPriorityQueues = { };


// By using our own Logger, we don't trigger others
exports.cmd4Dbg = false;


// These will be initialized in index.js ( If required )
exports.clonedCharacteristic = require( "./lib/Cmd4_Characteristics" );
exports.CMD4_ACC_TYPE_ENUM = require( "./lib/CMD4_ACC_TYPE_ENUM" );
exports.CMD4_DEVICE_TYPE_ENUM = require( "./lib/CMD4_DEVICE_TYPE_ENUM" );


