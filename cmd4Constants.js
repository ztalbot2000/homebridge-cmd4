"use strict";

// Naming convention
// DEFAULT_    => Default values
// _l          =>  Lower Case
// _lv         =>  Lower Case Variable of same name

// Triggers which Array CMD4Accessory will be placed
// Either cmd4Accessories or cmd4StandaloneAccessories
exports.STANDALONE               = "Standalone";
exports.PLATFORM                 = "Platform";
exports.COLLECTION               = "Collection";

// Default intervals
exports.SLOW_STATE_CHANGE_RESPONSE_TIME      = 10000;  // 10 seconds
exports.MEDIUM_STATE_CHANGE_RESPONSE_TIME    = 3000;   // 3 seconds
exports.DEFAULT_STATE_CHANGE_RESPONSE_TIME   = 3000;   // 3 seconds
exports.FAST_STATE_CHANGE_RESPONSE_TIME      = 1000;   // 1 second

exports.DEFAULT_TIMEOUT          = 60000; // 1 minute
exports.DEFAULT_INTERVAL         = 60000; // 1 minute

// Not a Bool, otherwise conditional check fails
exports.DEFAULT_STATUSMSG        = "TRUE";

exports.DEFAULT_QUEUEMSG         = false;
exports.DEFAULT_QUEUE_TYPE       = "WoRm";

// How many polls before output of queue status information
exports.DEFAULT_QUEUE_STAT_MSG_INTERVAL = 1000;


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
exports.QUEUEMSG                 = "QueueMsg";
exports.QUEUETYPE                = "QueueType";
exports.QUEUETYPE_SEQUENTIAL     = "Sequential";
exports.QUEUETYPE_WORM           = "WoRm";

//exports.STATUSMSG_l              = "statusMsg";

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
exports.DEFAULT_QUEUE_NAME       = "No_Queue";
exports.QUEUE_STAT_MSG_INTERVAL  = "QueueStatMsgInterval";
exports.POLLING                  = "Polling";
exports.CMD4_MODE_ALWAYS         = "Always";
exports.CMD4_MODE_CACHED         = "Cached";  // CACHED becomes DEMO
exports.CMD4_MODE_DEMO           = "Demo";
exports.CMD4_MODE_POLLED         = "Polled";
exports.CMD4_MODE_FULLYPOLLED    = "FullyPolled";
exports.FETCH                    = "Fetch";
exports.CMD4_MODE                = "Cmd4_Mode";
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
exports.FORMAT                  = "Format";
exports.UNITS                   = "Units";
exports.PROPS                   = "Props";
exports.PERMS                   = "Perms";
exports.VALIDVALUES             = "ValidValues";
exports.ACCESS                  = "Access";


// Internal list variables
exports.ACCESSORY_lv                   = "accessory";
exports.CHARACTERISTIC_STRING_lv       = "characteristicString";
exports.CALLBACK_lv                    = "callback";
exports.ACC_TYPE_ENUM_INDEX_lv         = "accTypeEnumIndex";
exports.INTERVAL_lv                    = "interval";
exports.IS_SET_lv                      = "isSet";
exports.IS_POLLED_lv                   = "isPolled";
exports.QUEUE_lv                       = "queue";
exports.QUEUE_NAME_lv                  = "queueName";
exports.RC_lv                          = "rc";
exports.STATE_CHANGE_RESPONSE_TIME_lv  = "stateChangeResponseTime";
exports.TIMEOUT_lv                     = "timeout";
exports.VALUE_lv                       = "value";

exports.ERROR_TIMER_EXPIRED           = -151;
exports.ERROR_CMD_FAILED_REPLY        = -152;
exports.ERROR_NULL_REPLY              = -153;
exports.ERROR_NULL_STRING_REPLY       = -154;
exports.ERROR_EMPTY_STRING_REPLY      = -155;
exports.ERROR_2ND_NULL_STRING_REPLY   = -156;
exports.ERROR_NON_CONVERTABLE_REPLY   = -157;

// internal strings
exports.storedValuesPerCharacteristic = "storedValuesPerCharacteristic";

