"use strict";

// Naming convention
// DEFAULT_    => Default values
// _l          =>  Lower Case
// _lv         =>  Lower Case Variable of same name

// Triggers which Array CMD4Accessory will be placed
// Either cmd4Accessories or cmd4StandaloneAccessories
//


var cmd4Constants = {
   STANDALONE:                "Standalone",
   PLATFORM:                  "Platform",

   // Default intervals
   // 10 seconds
   SLOW_STATE_CHANGE_RESPONSE_TIME:       10000,
   // 3 seconds
   MEDIUM_STATE_CHANGE_RESPONSE_TIME:     3000,
   // 3 seconds
   DEFAULT_STATE_CHANGE_RESPONSE_TIME:    3000,
   // 1 second
   FAST_STATE_CHANGE_RESPONSE_TIME:       1000,

   // 1 minute
   DEFAULT_INTERVAL:          60000,
   // 1 minute
   DEFAULT_TIMEOUT:           60000,

   // Not a Bool, otherwise conditional check fails
   DEFAULT_STATUSMSG:         "TRUE",

   DEFAULT_QUEUE_TYPE:        "WoRm",
   // 10 seconds
   DEFAULT_QUEUE_PAUSE_TIMEOUT:  10000,

   // No debug
   DEFAULT_DEBUG:             false,
   // No funny TLV8 characteristics
   DEFAULT_ALLOW_TLV8:        false,
   DEFAULT_OUTPUTCONSTANTS:   false,

   // Fakegato Constants
   FAKEGATO_TYPE_ENERGY_l:    "energy",
   FAKEGATO_TYPE_ROOM_l:      "room",
   FAKEGATO_TYPE_WEATHER_l:   "weather",
   FAKEGATO_TYPE_DOOR_l:      "door",
   FAKEGATO_TYPE_MOTION_l:    "motion",
   FAKEGATO_TYPE_THERMO_l:    "thermo",
   FAKEGATO_TYPE_AQUA_l:      "aqua",
   EVE:                       "Eve",
   STORAGE:                   "Storage",
   STORAGE_l:                 "storage",
   STORAGEPATH:               "StoragePath",
   FOLDER:                    "Folder",
   FOLDER_l:                  "folder",
   KEYPATH:                   "KeyPath",
   STATUS:                    "Status",
   STATUS_l:                  "status",
   TEMP:                      "Temp",
   TEMP_l:                    "temp",
   SETTEMP:                   "SetTemp",
   SETTEMP_l:                 "setTemp",
   HUMIDITY:                  "Humidity",
   HUMIDITY_l:                "humidity",
   PPM:                       "Ppm",
   PPM_l:                     "ppm",
   POWER:                     "Power",
   POWER_l:                   "power",
   PRESSURE:                  "Pressure",
   PRESSURE_l:                "pressure",
   CURRENTTEMP:               "CurrentTemp",
   CURRENTTEMP_l:             "currentTemp",
   VALVEPOSITION:             "ValvePosition",
   VALVEPOSITION_l:           "valvePosition",
   WATERAMOUNT_l:             "waterAmount",
   TIME_l:                    "time",
   PATH_l:                    "path",
   KEYPATH_l:                 "keyPath",

   FS_l:                      "fs",
   GOOGLE_DRIVE_l:            "googleDrive",

   // Config Constnts
   DEBUG:                     "Debug",
   DEBUG_l:                   "debug",
   OUTPUTCONSTANTS:           "OutputConstants",
   STATUSMSG:                 "StatusMsg",
   QUEUETYPE:                 "QueueType",
   QUEUETYPES:                "QueueTypes",

   // Queue Types
   QUEUETYPE_SEQUENTIAL:      "Sequential",
   QUEUETYPE_WORM:            "WoRm",
   // Used internally to mean only polled entries go straight through the queue
   QUEUETYPE_STANDARD:        "StandarD",
   // Used internally to mean entries go straight through the queue
   QUEUETYPE_PASSTHRU:        "None",


   // Platform Config Constnts
   TYPE:                      "Type",
   SUBTYPE:                   "SubType",
   DISPLAYNAME:               "DisplayName",
   UUID:                      "UUID",
   ACCESSORY:                 "Accessory",
   CATEGORY:                  "Category",
   PUBLISHEXTERNALLY:         "PublishExternally",
   NAME:                      "Name",
   MODEL:                     "Model",
   MANUFACTURER:              "Manufacturer",
   SERIALNUMBER:              "SerialNumber",
   FIRMWAREREVISION:          "FirmwareRevision",
   CHARACTERISTIC:            "Characteristic",
   TIMEOUT:                   "Timeout",
   QUEUE:                     "Queue",
   POLLING:                   "Polling",
   INTERVAL:                  "Interval",
   STATECHANGERESPONSETIME:   "StateChangeResponseTime",
   STATE_CMD_PREFIX:          "State_cmd_prefix",
   STATE_CMD_SUFFIX:          "State_cmd_suffix",
   STATE_CMD:                 "State_cmd",
   FAKEGATO:                  "Fakegato",
   REQUIRES:                  "Requires",
   CONSTANTS:                 "Constants",
   VARIABLES:                 "Variables",
   LINKEDTYPES:               "LinkedTypes",
   ACCESSORIES:               "Accessories",
   URL:                       "Url",
   ALLOWTLV8:                 "AllowTLV8",

   DEFINITIONS:              "Definitions",
   PROPS:                    "Props",


   // Internal list variables
   ACCESSORY_lv:                    "accessory",
   CHARACTERISTIC_STRING_lv:        "characteristicString",
   CALLBACK_lv:                     "callback",
   ACC_TYPE_ENUM_INDEX_lv:          "accTypeEnumIndex",
   INTERVAL_lv:                     "interval",
   IS_SET_lv:                       "isSet",
   QUEUE_NAME_lv:                   "queueName",
   QUEUE_GET_IS_UPDATE_lv:          "queueGetIsUpdate",
   STATE_CHANGE_RESPONSE_TIME_lv:   "stateChangeResponseTime",
   TIMEOUT_lv:                      "timeout",
   VALUE_lv:                        "value",
   CMD4_STORAGE_lv:                 "cmd4Storage",

   ERROR_TIMER_EXPIRED:            -151,
   //Exports.ERROR_CMD_FAILED_REPLY:         -152,
   ERROR_NULL_REPLY:               -153,
   ERROR_NULL_STRING_REPLY:        -154,
   ERROR_EMPTY_STRING_REPLY:       -155,
   ERROR_2ND_NULL_STRING_REPLY:    -156,
   ERROR_NON_CONVERTABLE_REPLY:    -157,
   ERROR_NO_DATA_REPLY:            -158,



   // Static Messages
   DBUSY:                          "Perhaps your device is busy?"
};
module.exports = cmd4Constants;
