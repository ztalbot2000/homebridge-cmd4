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
   init: function ( hapFormats, hapUnits, hapPerms )
   {

      // Fill in the properties of all possible characteristics
      // props was added because calling getCharacteridtic().props.perms adds
      // the characteristic in by default. This costs some lines, but is advantageous.
      CMD4_CHAR_TYPE_ENUMS.CMD4_FORMAT_TYPE_ENUM.properties =
      {
         0: { type: hapFormats.BOOL          // "bool"
            },
         1: { type: hapFormats.INT           // "int"
            },
         2: { type: hapFormats.FLOAT         // "float"
            },
         3: { type: hapFormats.STRING        // "string"
            },
         4: { type: hapFormats.UINT8         // "uint8"
            },
         5: { type: hapFormats.UINT16        // "uint16"
            },
         6: { type: hapFormats.UINT32        // "uint32"
            },
         7: { type: hapFormats.UINT64        // "uint64"
            },
         8: { type: hapFormats.DATA          // "data"
            },
         9: { type: hapFormats.TLV8          // "tlv8"
            },
        10: { type: hapFormats.ARRAY         // "array"
            },
        11: { type: hapFormats.DICTIONARY    // "dict"
            }
      };

      CMD4_CHAR_TYPE_ENUMS.CMD4_UNITS_TYPE_ENUM.properties =
      {
         0: { type: hapUnits.CELSIUS         // "celsius"
            },
         1: { type: hapUnits.PERCENTAGE      // "percentage"
            },
         2: { type: hapUnits.ARC_DEGREE      // "arcdegrees"
            },
         3: { type: hapUnits.LUX             // "lux"
               },
         4: { type: hapUnits.SECONDS         // "seconds"
            }
      };

      CMD4_CHAR_TYPE_ENUMS.CMD4_PERMS_TYPE_ENUM.properties =
      {
         0: { type: hapPerms.READ            // "pr"
            },
         1: { type: hapPerms.WRITE           // "pw"
            },
         2: { type: hapPerms.PAIRED_READ     // "pr"
            },
         3: { type: hapPerms.PAIRED_WRITE    // "pw"
            },
         4: { type: hapPerms.NOTIFY          // "ev"
            },
         5: { type: hapPerms.EVENTS          // "ev"
            },
         6: { type: hapPerms.ADDITIONAL_AUTHORIZATION         // "aa"
            },
         7: { type: hapPerms.TIMED_WRITE     // "tw"
            },
         8: { type: hapPerms.HIDDEN          // "hd"
            },
         9: { type: hapPerms.WRITE_RESPONSE  // "wr"
            }
      };

      return CMD4_CHAR_TYPE_ENUMS;

   }, CMD4_CHAR_TYPE_ENUMS
}

