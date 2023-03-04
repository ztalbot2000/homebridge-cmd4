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
   FAKEGATO_TYPE_ENERGY:      "energy",
   FAKEGATO_TYPE_ROOM:        "room",
   FAKEGATO_TYPE_WEATHER:     "weather",
   FAKEGATO_TYPE_DOOR:        "door",
   FAKEGATO_TYPE_MOTION:      "motion",
   FAKEGATO_TYPE_THERMO:      "thermo",
   FAKEGATO_TYPE_AQUA:        "aqua",
   EVE:                       "eve",
   STORAGE:                   "storage",
   STORAGEPATH:               "storagePath",
   FOLDER:                    "folder",
   KEYPATH:                   "keyPath",
   STATUS:                    "status",
   TEMP:                      "temp",
   SETTEMP:                   "setTemp",
   HUMIDITY:                  "humidity",
   PPM:                       "ppm",
   POWER:                     "power",
   PRESSURE:                  "pressure",
   CURRENTTEMP:               "currentTemp",
   VALVEPOSITION:             "valvePosition",
   WATERAMOUNT:               "waterAmount",
   TIME:                      "time",
   PATH:                      "path",

   FS:                        "fs",
   GOOGLE_DRIVE:              "googleDrive",

   // Config Constants
   DEBUG:                     "debug",
   OUTPUTCONSTANTS:           "outputConstants",
   STATUSMSG:                 "statusMsg",
   QUEUETYPE:                 "queueType",
   QUEUETYPES:                "queueTypes",

   // Queue Types
   QUEUETYPE_SEQUENTIAL:      "Sequential",
   QUEUETYPE_WORM:            "WoRm",
   QUEUETYPE_WORM2:           "WoRm2",
   // Used internally to mean only polled entries go straight through the queue
   QUEUETYPE_STANDARD:        "StandarD",
   // Used internally to mean entries go straight through the queue
   QUEUETYPE_PASSTHRU:        "None",
   DEFAULT_STANDARD_QUEUE_RETRY_COUNT: 0,
   DEFAULT_WORM_QUEUE_RETRY_COUNT: 0,
   QUEUE_RETRIES:             "retries",



   // Platform/Accessory Config Constants
   TYPE:                      "type",
   SUBTYPE:                   "subType",
   DISPLAYNAME:               "displayName",
   UUID:                      "uuid",
   ACCESSORY:                 "accessory",
   CATEGORY:                  "category",
   PUBLISHEXTERNALLY:         "publishExternally",
   CHARACTERISTIC:            "characteristic",
   TIMEOUT:                   "timeout",
   QUEUE:                     "queue",
   POLLING:                   "polling",
   INTERVAL:                  "interval",
   STATECHANGERESPONSETIME:   "stateChangeResponseTime",
   STATE_CMD_PREFIX:          "state_cmd_prefix",
   STATE_CMD_SUFFIX:          "state_cmd_suffix",
   STATE_CMD:                 "state_cmd",
   FAKEGATO:                  "fakegato",
   REQUIRES:                  "requires",
   CONSTANTS:                 "constants",
   VARIABLES:                 "variables",
   LINKEDTYPES:               "linkedTypes",
   ACCESSORIES:               "accessories",
   URL:                       "url",
   ALLOWTLV8:                 "allowTLV8",

   DEFINITIONS:              "definitions",
   PROPS:                    "props",

   // While also characteristics, they are also used by
   // the infomation service
   MANUFACTURER:             "manufacturer",
   SERIALNUMBER:             "serialNumber",
   MODEL:                    "model",

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

   ERROR_STRING_MIN:               -151,
   ERROR_TIMER_EXPIRED:            -151,
   // ERROR_CMD_FAILED_REPLY:         -152,
   ERROR_NULL_REPLY:               -153,
   ERROR_NULL_STRING_REPLY:        -154,
   ERROR_EMPTY_STRING_REPLY:       -155,
   ERROR_2ND_NULL_STRING_REPLY:    -156,
   ERROR_NON_CONVERTABLE_REPLY:    -157,
   ERROR_NO_DATA_REPLY:            -158,
   ERROR_STRING_MAX:               -158,
   ERROR_STRINGS:
   [ // cmd4Constants.ERROR_TIMER_EXPIRED -151
     "Timer expired contacting accessory",
     // cmd4Constants.ERROR_CMD_FAILED_REPLY -152
     "Command failed",
     // cmd4Constants.ERROR_NULL_REPLY -153
     "Reply is NULL",
     // cmd4Constants.ERROR_NULL_STRING_REPLY -154
     "Reply is NULL string",
     // cmd4Constants.ERROR_EMPTY_STRING_REPLY -155
     "Reply is an empty string",
     // cmd4Constants.ERROR_2ND_NULL_STRING_REPLY -156
     "Reply is still NULL",
     // cmd4Constants.ERROR_NON_CONVERTABLE_REPLY -157
     "Cannot convert characteristic string",
     // cmd4Constants.ERROR_NO_DATA_REPLY -158
     "No data returned from accessory"
   ],

   // Convert our known Error Codes to strings
   errorString: function( index )
   {
      let offset = - index + cmd4Constants.ERROR_STRING_MIN ;
      let max = cmd4Constants.ERROR_STRING_MIN - cmd4Constants.ERROR_STRING_MAX;

      //console.log(" index is " + index );
      //console.log(" offset is " + offset );
      //console.log(" max is " + max );
      // i.e 0-7
      if ( index == 0 )
         return "Device returned SUCCESS; " + index;

      //if ( offset < 0  || offset > max )
      if ( index > cmd4Constants.ERROR_STRING_MIN )
         return "Device returned its own error; " + index;
      if ( index < cmd4Constants.ERROR_STRING_MAX )
         return "Device returned its own error; " + index;

      // Should not happen because of the above checks
      if ( offset < 0 )
         return "Invalid Error min index: " + index;

      // Should not happen because of the above checks
      if ( offset > max )
         return "Invalid Error max index: " + index;

      return cmd4Constants.ERROR_STRINGS[ offset ];
   },



   // Static Messages
   DBUSY:                          "Perhaps your device is busy?"
   //DUNAVAILABLE:                   "Your device is unavailable"
};
module.exports = cmd4Constants;
