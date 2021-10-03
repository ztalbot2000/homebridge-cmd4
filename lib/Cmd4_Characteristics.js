// These are cloned from hap-nodejs
// dist/lib/Characteristic.d.ts
// The homebridge-utils-ui does not get a
// copy of the Characteristic Formats, so they
// are cloned here

//                   *** IMPORTANT ***
// I have not decided to use this. This is a partial alternative to including
// hapNodeJs, but it is incomplete as there would be so much more needed
// to be cloned

var Units =
{
   CELSIUS:                  0,
   PERCENTAGE:               1,
   ARC_DEGREE:               2,
   LUX:                      3,
   SECONDS:                  4,
};
(function (Units) {
   // Celsius is the only temperature unit in the HomeKit Accessory Protocol.
   // Unit conversion is always done on the client side e.g. on the iPhone
   // in the Home App depending on the configured unit on the device itself.
   Units["CELSIUS"]    = "celsius";
   Units["PERCENTAGE"] = "percentage";
   Units["ARC_DEGREE"] = "arcdegrees";
   Units["LUX"]        = "lux";
   Units["SECONDS"]    = "seconds";
})(Units = exports.Units || (exports.Units = {}));


var Perms =
{
   READ:                      0,
   WRITE:                     1,
   PAIRED_READ:               2,
   PAIRED_WRITE:              3,
   NOTIFY:                    4,
   EVENTS:                    5,
   ADDITIONAL_AUTHORIZATION:  6,
   TIMED_WRITE:               7,
   HIDDEN:                    8,
   WRITE_RESPONSE:            9,
};
(function (Perms) {
    // @deprecated replaced by {@link PAIRED_READ}. Kept for backwards compatibility.
    Perms[ "READ"                     ] = "pr";
    // @deprecated replaced by {@link PAIRED_WRITE}. Kept for backwards compatibility.
    Perms[ "WRITE"                    ] = "pw";
    Perms[ "PAIRED_READ"              ] = "pr";
    Perms[ "PAIRED_WRITE"             ] = "pw";
    Perms[ "NOTIFY"                   ] = "ev";
    Perms[ "EVENTS"                   ] = "ev";
    Perms[ "ADDITIONAL_AUTHORIZATION" ] = "aa";
    Perms[ "TIMED_WRITE"              ] = "tw";
    Perms[ "HIDDEN"                   ] = "hd";
    Perms[ "WRITE_RESPONSE"           ] = "wr";
})(Perms = exports.Perms || (exports.Perms = {}));

var Formats =
{
    BOOL:                      0,
    INT:                       1,
    FLOAT:                     2,
    STRING:                    3,
    UINT8:                     4,
    UINT16:                    5,
    UINT32:                    6,
    UINT64:                    7,
    DATA:                      8,
    TLV8:                      9,
    ARRAY:                     10,
    DICTIONARY:                11,
};

(function (Formats) {
   Formats[ "BOOL"       ] = "bool";
   // Signed 32-bit integer
   Formats[ "INT"        ] = "int";
   // Signed 64-bit floating point
   Formats[ "FLOAT"      ] = "float";
   // String encoded in utf8
   Formats[ "STRING"     ] = "string";
   // Unsigned 8-bit integer.
   Formats[ "UINT8"      ] = "uint8";
   // Unsigned 16-bit integer.
   Formats[ "UINT16"     ] = "uint16";
   // Unsigned 32-bit integer.
   Formats[ "UINT32"     ] = "uint32";
   // Unsigned 64-bit integer.
   Formats[ "UINT64"     ] = "uint64";
   // Data is base64 encoded string.
   Formats[ "DATA"       ] = "data";
   // Base64 encoded tlv8 string.
   Formats[ "TLV8"       ] = "tlv8";
   // @deprecated Not contained in the HAP spec
   Formats[ "ARRAY"      ] = "array";
   // @deprecated Not contained in the HAP spec
   Formats[ "DICTIONARY" ] = "dict";
})(Formats = exports.Formats || (exports.Formats = {}));

var Categories =
{
   OTHER:               0,
   BRIDGE:              1,
   FAN:                 2,
   GARAGE_DOOR_OPENER:  3,
   LIGHTBULB:           4,
   DOOR_LOCK:           5,
   OUTLET:              6,
   SWITCH:              7,
   THERMOSTAT:          8,
   SENSOR:              9,
   ALARM_SYSTEM:        10,
   SECURITY_SYSTEM:     11,
   DOOR:                12,
   WINDOW:              13,
   WINDOW_COVERING:     14,
   PROGRAMMABLE_SWITCH: 15,
   RANGE_EXTENDER:      16,
   CAMERA:              17,
   IP_CAMERA:           18,
   VIDEO_DOORBELL:      19,
   AIR_PURIFIER:        20,
   AIR_HEATER:          21,
   AIR_CONDITIONER:     22,
   AIR_HUMIDIFIER:      23,
   AIR_DEHUMIDIFIER:    24,
   APPLE_TV:            25,
   HOMEPOD:             26,
   SPEAKER:             27,
   AIRPORT:             28,
   SPRINKLER:           29,
   FAUCET:              30,
   SHOWER_HEAD:         31,
   TELEVISION:          32,
   TARGET_CONTROLLER:   33,
   ROUTER:              34,
   AUDIO_RECEIVER:      35,
   TV_SET_TOP_BOX:      36,
   TV_STREAMING_STICK:  37,
};

(function (Categories) {

    Categories[ Categories[ "OTHER"              ] = 1  ] = "OTHER";
    Categories[ Categories[ "BRIDGE"             ] = 2  ] = "BRIDGE";
    Categories[ Categories[ "FAN"                ] = 3  ] = "FAN";
    Categories[ Categories[ "GARAGE_DOOR_OPENER" ] = 4  ] = "GARAGE_DOOR_OPENER";
    Categories[ Categories[ "LIGHTBULB"          ] = 5  ] = "LIGHTBULB";
    Categories[ Categories[ "DOOR_LOCK"          ] = 6  ] = "DOOR_LOCK";
    Categories[ Categories[ "OUTLET"             ] = 7  ] = "OUTLET";
    Categories[ Categories[ "SWITCH"             ] = 8  ] = "SWITCH";
    Categories[ Categories[ "THERMOSTAT"         ] = 9  ] = "THERMOSTAT";
    Categories[ Categories[ "SENSOR"             ] = 10 ] = "SENSOR";
    Categories[ Categories[ "ALARM_SYSTEM"       ] = 11 ] = "ALARM_SYSTEM";
    Categories[ Categories[ "SECURITY_SYSTEM"    ] = 11 ] = "SECURITY_SYSTEM";
    Categories[ Categories[ "DOOR"               ] = 12 ] = "DOOR";
    Categories[ Categories[ "WINDOW"             ] = 13 ] = "WINDOW";
    Categories[ Categories[ "WINDOW_COVERING"    ] = 14 ] = "WINDOW_COVERING";
    Categories[ Categories[ "PROGRAMMABLE_SWITCH"] = 15 ] = "PROGRAMMABLE_SWITCH";
    Categories[ Categories[ "RANGE_EXTENDER"     ] = 16 ] = "RANGE_EXTENDER";
    Categories[ Categories[ "CAMERA"             ] = 17 ] = "CAMERA";
    Categories[ Categories[ "IP_CAMERA"          ] = 17 ] = "IP_CAMERA";
    Categories[ Categories[ "VIDEO_DOORBELL"     ] = 18 ] = "VIDEO_DOORBELL";
    Categories[ Categories[ "AIR_PURIFIER"       ] = 19 ] = "AIR_PURIFIER";
    Categories[ Categories[ "AIR_HEATER"         ] = 20 ] = "AIR_HEATER";
    Categories[ Categories[ "AIR_CONDITIONER"    ] = 21 ] = "AIR_CONDITIONER";
    Categories[ Categories[ "AIR_HUMIDIFIER"     ] = 22 ] = "AIR_HUMIDIFIER";
    Categories[ Categories[ "AIR_DEHUMIDIFIER"   ] = 23 ] = "AIR_DEHUMIDIFIER";
    Categories[ Categories[ "APPLE_TV"           ] = 24 ] = "APPLE_TV";
    Categories[ Categories[ "HOMEPOD"            ] = 25 ] = "HOMEPOD";
    Categories[ Categories[ "SPEAKER"            ] = 26 ] = "SPEAKER";
    Categories[ Categories[ "AIRPORT"            ] = 27 ] = "AIRPORT";
    Categories[ Categories[ "SPRINKLER"          ] = 28 ] = "SPRINKLER";
    Categories[ Categories[ "FAUCET"             ] = 29 ] = "FAUCET";
    Categories[ Categories[ "SHOWER_HEAD"        ] = 30 ] = "SHOWER_HEAD";
    Categories[ Categories[ "TELEVISION"         ] = 31 ] = "TELEVISION";
    Categories[ Categories[ "TARGET_CONTROLLER"  ] = 32 ] = "TARGET_CONTROLLER";
    Categories[ Categories[ "ROUTER"             ] = 33 ] = "ROUTER";
    Categories[ Categories[ "AUDIO_RECEIVER"     ] = 34 ] = "AUDIO_RECEIVER";
    Categories[ Categories[ "TV_SET_TOP_BOX"     ] = 35 ] = "TV_SET_TOP_BOX";
    Categories[ Categories[ "TV_STREAMING_STICK" ] = 36 ] = "TV_STREAMING_STICK";
})(Categories = exports.Categories || (exports.Categories = {}));

exports.clonedCharacteristic =
{
   Formats: Formats,
   Units: Units,
   Perms: Perms,
   Categories: Categories
};

//module.exports = { clonedCharacteristic, Categories };

