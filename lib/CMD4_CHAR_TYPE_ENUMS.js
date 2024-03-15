'use strict';

var CMD4_CHAR_TYPE_ENUMS =
{
   CMD4_FORMAT_TYPE_ENUM:
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
      DICTIONARY:                10,
      EOL:                       11,
      properties: { }
   },

   CMD4_UNITS_TYPE_ENUM:
   {
      CELSIUS:                   0,
      PERCENTAGE:                1,
      ARC_DEGREE:                2,
      LUX:                       3,
      SECONDS:                   4,
      EOL:                       5,

      properties: { }
   },

   CMD4_PERMS_TYPE_ENUM:
   {
      READ:                      0,
      WRITE:                     1,
      PAIRED_READ:               2,
      PAIRED_WRITE:              3,
      NOTIFY:                    4,
      ADDITIONAL_AUTHORIZATION:  5,
      TIMED_WRITE:               6,
      HIDDEN:                    7,
      WRITE_RESPONSE:            8,
      EOL:                       9,
      properties: { }
   }
}

// Export both the init function and the uninitialized data for unit testing
module.exports =
{
   init: function ( Characteristic )
   {

      // Fill in the properties of all possible characteristics
      // props was added because calling getCharacteridtic().props.perms adds
      // the characteristic in by default. This costs some lines, but is advantageous.
      CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.properties =
      {
         0: { type: Characteristic.Formats.BOOL          // "bool"
            },
         1: { type: Characteristic.Formats.INT           // "int"
            },
         2: { type: Characteristic.Formats.FLOAT         // "float"
            },
         3: { type: Characteristic.Formats.STRING        // "string"
            },
         4: { type: Characteristic.Formats.UINT8         // "uint8"
            },
         5: { type: Characteristic.Formats.UINT16        // "uint16"
            },
         6: { type: Characteristic.Formats.UINT32        // "uint32"
            },
         7: { type: Characteristic.Formats.UINT64        // "uint64"
            },
         8: { type: Characteristic.Formats.DATA          // "data"
            },
         9: { type: Characteristic.Formats.TLV8          // "tlv8"
            },
        10: { type: Characteristic.Formats.ARRAY         // "array"
            },
        11: { type: Characteristic.Formats.DICTIONARY    // "dict"
            }
      };

      CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.properties =
      {
         0: { type: Characteristic.Units.CELSIUS         // "celsius"
            },
         1: { type: Characteristic.Units.PERCENTAGE      // "percentage"
            },
         2: { type: Characteristic.Units.ARC_DEGREE      // "arcdegrees"
            },
         3: { type: Characteristic.Units.LUX             // "lux"
               },
         4: { type: Characteristic.Units.SECONDS         // "seconds"
            }
      };

      CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.properties =
      {
         0: { type: Characteristic.Perms.READ            // "pr"
            },
         1: { type: Characteristic.Perms.WRITE           // "pw"
            },
         2: { type: Characteristic.Perms.PAIRED_READ     // "pr"
            },
         3: { type: Characteristic.Perms.PAIRED_WRITE    // "pw"
            },
         4: { type: Characteristic.Perms.NOTIFY          // "ev"
            },
         5: { type: Characteristic.Perms.EVENTS          // "ev"
            },
         6: { type: Characteristic.Perms.ADDITIONAL_AUTHORIZATION         // "aa"
            },
         7: { type: Characteristic.Perms.TIMED_WRITE     // "tw"
            },
         8: { type: Characteristic.Perms.HIDDEN          // "hd"
            },
         9: { type: Characteristic.Perms.WRITE_RESPONSE  // "wr"
            }
      };

      return CMD4_CHAR_TYPE_ENUMS;

   }, CMD4_CHAR_TYPE_ENUMS
}

