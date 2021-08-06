"use strict";

// Naming convention
// DEFAULT_    => Default values
// _l          =>  Lower Case
// _lv         =>  Lower Case Variable of same name

// Triggers which Array CMD4Accessory will be placed
// Either cmd4Accessories or cmd4StandaloneAccessories
exports.STANDALONE               = "Standalone";
exports.PLATFORM                 = "Platform";

// Default intervals
exports.SLOW_STATE_CHANGE_RESPONSE_TIME      = 10000;  // 10 seconds
exports.MEDIUM_STATE_CHANGE_RESPONSE_TIME    = 3000;   // 3 seconds
exports.DEFAULT_STATE_CHANGE_RESPONSE_TIME   = 3000;   // 3 seconds
exports.FAST_STATE_CHANGE_RESPONSE_TIME      = 1000;   // 1 second

exports.DEFAULT_TIMEOUT          = 60000; // 1 minute
exports.DEFAULT_INTERVAL         = 60000; // 1 minute

// Not a Bool, otherwise conditional check fails
exports.DEFAULT_STATUSMSG        = "TRUE";

exports.DEFAULT_OUTPUTCONSTANTS  = false;
exports.DEFAULT_QUEUE_TYPE       = "WoRm";
exports.DEFAULT_QUEUE_PAUSE_TIMEOUT = 10000; // 10 seconds


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
exports.STORAGE_l                = "storage";
exports.STORAGEPATH              = "StoragePath";
exports.FOLDER                   = "Folder";
exports.FOLDER_l                 = "folder";
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

exports.FS_l                     = "fs";
exports.GOOGLE_DRIVE_l           = "googleDrive";

// Config Constnts
exports.DEBUG                    = "Debug";
exports.DEBUG_l                  = "debug";
exports.OUTPUTCONSTANTS          = "OutputConstants";
exports.STATUSMSG                = "StatusMsg";
exports.QUEUETYPE                = "QueueType";
exports.QUEUETYPES               = "QueueTypes";

// Queue Types
exports.QUEUETYPE_SEQUENTIAL     = "Sequential";
exports.QUEUETYPE_WORM           = "WoRm";
// Used internally to mean only polled entries go straight through the queue
exports.QUEUETYPE_STANDARD       = "StandarD";
// Used internally to mean entries go straight through the queue
exports.QUEUETYPE_PASSTHRU       = "None";


// Platform Config Constnts
exports.TYPE                     = "Type";
exports.SUBTYPE                  = "SubType";
exports.DISPLAYNAME              = "DisplayName";
exports.UUID                     = "UUID";
exports.ACCESSORY                = "Accessory";
exports.CATEGORY                 = "Category";
exports.PUBLISHEXTERNALLY        = "PublishExternally";
exports.NAME                     = "Name";
exports.MODEL                    = "Model";
exports.MANUFACTURER             = "Manufacturer";
exports.SERIALNUMBER             = "SerialNumber";
exports.FIRMWAREREVISION         = "FirmwareRevision";
exports.CHARACTERISTIC           = "Characteristic";
exports.TIMEOUT                  = "Timeout";
exports.QUEUE                    = "Queue";
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

exports.DEFINITIONS             = "Definitions";
exports.PROPS                   = "Props";


// Internal list variables
exports.ACCESSORY_lv                   = "accessory";
exports.CHARACTERISTIC_STRING_lv       = "characteristicString";
exports.CALLBACK_lv                    = "callback";
exports.ACC_TYPE_ENUM_INDEX_lv         = "accTypeEnumIndex";
exports.INTERVAL_lv                    = "interval";
exports.IS_SET_lv                      = "isSet";
exports.QUEUE_NAME_lv                  = "queueName";
exports.QUEUE_GET_IS_UPDATE_lv         = "queueGetIsUpdate";
exports.RC_lv                          = "rc";
exports.STATE_CHANGE_RESPONSE_TIME_lv  = "stateChangeResponseTime";
exports.TIMEOUT_lv                     = "timeout";
exports.VALUE_lv                       = "value";
exports.STORED_VALUES_PER_CHARACTERISTIC_lv = "storedValuesPerCharacteristic";

exports.ERROR_TIMER_EXPIRED           = -151;
//Exports.ERROR_CMD_FAILED_REPLY        = -152;
exports.ERROR_NULL_REPLY              = -153;
exports.ERROR_NULL_STRING_REPLY       = -154;
exports.ERROR_EMPTY_STRING_REPLY      = -155;
exports.ERROR_2ND_NULL_STRING_REPLY   = -156;
exports.ERROR_NON_CONVERTABLE_REPLY   = -157;
exports.ERROR_NO_DATA_REPLY           = -158;



// Static Messages
exports.DBUSY                         = "Perhaps your device is busy?";
