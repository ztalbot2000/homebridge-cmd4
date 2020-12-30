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

// Fakegato Constants
exports.FAKEGATO_TYPE_ENERGY     = "energy";
exports.FAKEGATO_TYPE_ROOM       = "room";
exports.FAKEGATO_TYPE_WEATHER    = "weather";
exports.FAKEGATO_TYPE_DOOR       = "door";
exports.FAKEGATO_TYPE_MOTION     = "motion";
exports.FAKEGATO_TYPE_THERMO     = "thermo";
exports.FAKEGATO_TYPE_AQUA       = "aqua";
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

exports.FS                       = "fs";
exports.GOOGLE_DRIVE             = "googleDrive";


// Config Constnts
exports.TYPE                     = "Type";
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
exports.OUTPUTCONSTANTS          = "OutputConstants";
exports.TIMEOUT                  = "Timeout";
exports.POLLING                  = "Polling";
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
