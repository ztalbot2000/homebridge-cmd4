"use strict";

// Triggers which Array CMD4Accessory will be placed
// Either cmd4Accessories or cmd4StandaloneAccessories
exports.STANDALONE               = "Standalone";
exports.PLATFORM                 = "Platform";
exports.COLLECTION               = "Collection";

// Default intervals
exports.SLOW_STATE_CHANGE_RESPONSE_TIME      = 10000;  // 10 seconds
exports.MEDIUM_STATE_CHANGE_RESPONSE_TIME    = 3000;   // 3 seconds
exports.FAST_STATE_CHANGE_RESPONSE_TIME      = 1000;   // 1 second

exports.DEFAULT_TIMEOUT          = 60000; // 1 minute
exports.DEFAULT_INTERVAL         = 60000; // 1 minute

// Not a Bool, otherwise conditional check fails
exports.DEFAULT_STATUSMSG        = "TRUE";

// Fakegato Constants
exports.FAKEGATO_TYPE_ENERGY_l   = "energy";
exports.FAKEGATO_TYPE_ROOM_l     = "room";
exports.FAKEGATO_TYPE_WEATHER_l  = "weather";
exports.FAKEGATO_TYPE_DOOR_l     = "door";
exports.FAKEGATO_TYPE_MOTION_l   = "motion";
exports.FAKEGATO_TYPE_THERMO_l   = "thermo";
exports.FAKEGATO_TYPE_AQUA_l     = "aqua";
exports.EVE                      = "Eve";
exports.STORAGE                  = "Storage";
exports.STORAGEPATH              = "StoragePath";
exports.FOLDER                   = "Folder";
exports.KEYPATH                  = "KeyPath";
exports.STATUS                   = "Status";
exports.STATUS_l                 = "status";
exports.TEMP                     = "Temp";
exports.TEMP_l                   = "temp";
exports.SETTEMP                  = "SetTemp";
exports.SETTEMP_l                = "setTemp";
exports.HUMIDITY                 = "Humidity";
exports.HUMIDITY_l               = "humidity";
exports.PPM                      = "Ppm";
exports.PPM_l                    = "ppm";
exports.POWER                    = "Power";
exports.POWER_l                  = "power";
exports.PRESSURE                 = "Pressure";
exports.PRESSURE_l               = "pressure";
exports.CURRENTTEMP              = "CurrentTemp";
exports.CURRENTTEMP_l            = "currentTemp";
exports.VALVEPOSITION            = "ValvePosition";
exports.VALVEPOSITION_l          = "valvePosition";
exports.WATERAMOUNT_l            = "waterAmount";
exports.TIME_l                   = "time";
exports.PATH_l                   = "path";
exports.KEYPATH_l                = "keyPath";

//exports.FS                       = "Fs";
exports.FS_l                     = "fs";
//exports.GOOGLE_DRIVE             = "GoogleDrive";
exports.GOOGLE_DRIVE_l           = "googleDrive";

// Config Constnts
exports.OUTPUTCONSTANTS          = "OutputConstants";
exports.RESTART_RECOVER          = "RestartRecover";
exports.STATUSMSG                = "StatusMsg";
//exports.STATUSMSG_l              = "statusMsg";

// Platform Config Constnts
exports.TYPE                     = "Type";
exports.SUBTYPE                  = "SubType";
exports.DISPLAYNAME              = "DisplayName";
exports.UUID                     = "UUID";
exports.ACCESSORY                = "Accessory";
exports.CATEGORY                 = "Category";
exports.PUBLISHEXTERNALLY        = "PublishExternally";
exports.PROPS                    = "Props";
exports.NAME                     = "Name";
exports.MODEL                    = "Model";
exports.MANUFACTURER             = "Manufacturer";
exports.SERIALNUMBER             = "SerialNumber";
exports.FIRMWAREREVISION         = "FirmwareRevision";
exports.CHARACTERISTIC           = "Characteristic";
exports.TIMEOUT                  = "Timeout";
exports.POLLING                  = "Polling";
exports.FETCH_ALWAYS             = "Always";
exports.FETCH_CACHED             = "Cached";
exports.FETCH_POLLED             = "Polled";
exports.FETCH                    = "Fetch";
exports.INTERVAL                 = "Interval";
exports.STATECHANGERESPONSETIME  = "StateChangeResponseTime";
exports.STATE_CMD_PREFIX         = "State_cmd_prefix";
exports.STATE_CMD_SUFFIX         = "State_cmd_suffix";
exports.STATE_CMD                = "State_cmd";
exports.FAKEGATO                 = "Fakegato";
exports.REQUIRES                 = "Requires";
exports.CONSTANTS                = "Constants";
exports.VARIABLES                = "Variables";
exports.LINKEDTYPES              = "LinkedTypes";
exports.ACCESSORIES              = "Accessories";
exports.URL                      = "Url";
exports.ALLOWTLV8                = "AllowTLV8";

// internal strings
exports.storedValuesPerCharacteristic = "storedValuesPerCharacteristic";

