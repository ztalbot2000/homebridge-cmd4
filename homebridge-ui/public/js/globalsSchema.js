/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "globalsSchema" }]*/

const globalsSchema =
{
   "schema":
   {
      "$defs":
      {
         "constants":
         {
            "title": "constants",
            "description": "Constants that can be replaced within state_cmd_suffix",
            "required": false,
            "type": "array",
            "items": {
               "type": "object",
               "properties": {
                  "key": {
                     "type": "string",
                     "title": "key",
                     "description": "The constant to replace. i.e. ${IP}.",
                     "pattern": "^\\${[\\w\\s]+}$",
                     "required": true
                  },
                  "value": {
                     "type": "string",
                     "title": "value",
                     "description": "The replacement string",
                     "required": true
                  }
               }
            }
         },
         "debug":
         {
            "title": "debug",
            "type": "boolean",
            "description": "Enables additional output in the log.",
            "required": false,
            "placeholder": false
         },
         "publishAccessory":
         {
            "title": "publishAccessory",
            "type": "boolean",
            "description": "Publishes accesory (Usually for TV's).",
            "required": false,
            "placeholder": false
         },
         "statusMsg":
         {
            "title": "statusMsg",
            "type": "boolean",
            "description": "Enables additional output in the log.",
            "required": false,
            "placeholder": true
         },
         "allowTLV8":
         {
            "title": "allowTLV8",
            "type": "boolean",
            "description": "Enables wacky TLV8 characteristics.",
            "required": false,
            "placeholder": false
         },
         "outputConstants":
         {
            "title": "outputConstants",
            "type": "boolean",
            "description": "Output constants instead of values.",
            "required": false,
            "placeholder": false
         },
         "timeout":
         {
            "title": "timeout",
            "type": "integer",
            "description": "The global timeout for all polling accessories (sec).",
            "required": false,
            "minimum": 3,
            "placeholder": 3
         },
         "stateChangeResponseTime":
         {
            "title": "stateChangeResponseTime",
            "type": "integer",
            "description": "The time for the accessories to respond (msec).",
            "required": false,
            "placeholder": 60000
         },
         "interval":
         {
            "title": "interval",
            "type": "integer",
            "description": "Polling interval of all accesssories (sec}.",
            "required": false,
            "minimum": 3,
            "placeholder": 60
         },
         "state_cmd_prefix":
         {
            "title": "state_cmd_prefix",
            "type": "string",
            "description": "The global state_cmd prefix for all accessories.",
            "required": false
         },
         "state_cmd":
         {
            "title": "state_cmd",
            "type": "string",
            "description": "The global state_cmd for all accessories.",
            "placeholder": ".homebridge/cmd4Scripts/",
            "required": false
         },
         "state_cmd_suffix":
         {
            "title": "state_cmd_suffix",
            "type": "string",
            "description": "The global state_cmd suffix for all accessories.",
            "required": false
         },
         "definitions":
         {
            "title": "definitions",
            "type": "object",
            "description": "complex data.",
            "required": false
         },
         "queueTypes":
         {
            "title": "queueTypes",
            "type": "array",
            "uniqueItems": true,
            "maxItems": 0,
            "required": false,
            "items":
            {
               "type": "object",
               "properties":
               {
                  "queue":
                  {
                     "type": "string",
                     "required": true
                  },
                  "queueType":
                  {
                     "type": "string",
                     "oneOf":
                     [
                        {"title": "WoRm","enum": ["WoRm"] },
                        { "title": "Sequential", "enum": ["Sequential" ]}
                     ]
                  }
               }
            }
         }
      },
      "properties":
      {
         "debug": { "$ref": "#/$defs/debug"},
         "constants": { "$ref": "#/$defs/constants"},
         "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
         "outputConstants": { "$ref": "#/$defs/outputConstants"},
         "statusMsg": { "$ref": "#/$defs/statusMsg"},
         "interval": { "$ref": "#/$defs/interval"},
         "timeout": { "$ref": "#/$defs/timeout"},
         "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
         "queueTypes": { "$ref": "#/$defs/queueTypes"},
         "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
         "state_cmd": { "$ref": "#/$defs/state_cmd"},
         "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"}
      }
   },
   "layout":
   [
      {
         "title": "Global Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            "debug",
            {
               "title": "Global Constants",
               "type": "fieldset",
               "expandable": true,
               "items": [ {
                  "key": "constants",
                  "type": "array",
                  "uniqueItems": true,
                  "listItems": "3",
                  "items": [ {
                     "type": "div",
                     "displayFlex": true,
                     "flex-direction": "row",
                     "items": [
                        {
                           "key": "constants[].key", "flex": "1 1 100px",
                           "title": "key", "placeholder": "i.e. ${IP}"
                        },
                        {
                           "key": "constants[].value", "flex": "4 4 150px",
                           "title": "value", "placeholder": "i.e. 192.168.x.x"
                        }
                     ]
                  } ]
               } ]
            },
            "statusMsg",
            "allowTLV8",
            "outputConstants",
            "timeout",
            "stateChangeResponseTime",
            "interval"
         ]
      },
      {
         "title": "Global QueueTypes",
         "type": "fieldset",
         "expandable": true,
         "items": [ {
            "key": "queueTypes",
            "$ref": "#/$defs/queueTypes",
            "type": "array",
            "uniqueItems": true,
            "listItems": "3",
            "items": [ {
               "type": "div",
               "displayFlex": true,
               "flex-direction": "row",
               "items": [
                  {
                     "key": "queueTypes[].queue", "flex": "1 1 50px",
                     "notitle": false, "placeholder": "AQueueName"
                  },
                  {
                     "key": "queueTypes[].queueType", "flex": "4 4 200px",
                     "notitle": false, "placeholder": "WoRm"
                  }
               ]
            } ]
         } ]
      },
      {
         "title": "Global state_cmd Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            "state_cmd_prefix",
            "state_cmd",
            "state_cmd_suffix"
         ]
      }]
}
