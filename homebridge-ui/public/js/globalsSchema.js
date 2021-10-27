/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "globalsSchema" }]*/

const globalsSchema =
{
   "schema":
   {
      "debug":
      {
         "title": "debug",
         "type": "boolean",
         "description": "Enables additional output in the log.",
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
      "stateCmdResponseTime":
      {
         "title": "stateCmdResponseTime",
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
      "stateCmdPrefix":
      {
         "title": "stateCmdPrefix",
         "type": "string",
         "description": "The global stateCmd prefix for all accessories.",
         "required": false
      },
      "stateCmd":
      {
         "title": "stateCmd",
         "type": "string",
         "description": "The global stateCmd for all accessories.",
         "placeholder": ".homebridge/cmd4Scripts/",
         "required": false
      },
      "stateCmdSuffix":
      {
         "title": "stateCmdSuffix",
         "type": "string",
         "description": "The global stateCmd suffix for all accessories.",
         "required": false
      },
      "storage":
      {
         "title": "storage",
         "description": "The FakeGato Storage type for all accessories.",
         "required": false,
         "type": "string",
         "oneOf": [
           {"title": "fs","enum": ["fs"] },
           { "title": "googleDrive", "enum": ["googleDrive" ]}
         ]
      },
      "storagePath":
      {
         "title": "storagePath",
         "type": "string",
         "description": "The global FakeGato storagePath for all accessories.",
         "required": false
      },
      "folder":
      {
         "title": "folder",
         "type": "string",
         "description": "The global FakeGato folder for all accessories.",
         "required": false
      },
      "keyPath":
      {
         "title": "keyPath",
         "type": "string",
         "description": "The FakeGato keyPath for all accessories.",
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
               {  "type": "string",
                  "oneOf": [
                     {"title": "WoRm","enum": ["WoRm"] },
                     { "title": "Sequential", "enum": ["Sequential" ]}
                  ]
               }
            }
         }
      }
   },
   "layout":[
      { "key": "debug" },
      { "key": "statusMsg" },
      { "key": "allowTLV8" },
      { "key": "outputConstants" },
      { "key": "timeout" },
      { "key": "stateCmdResponseTime" },
      { "key": "interval" },
      { "title": "StateCmd Options",
        "type": "fieldset",
        "expandable": true,
        "items": [
           "stateCmdPrefix",
           "stateCmd",
           "stateCmdSuffix"
        ]
      },
      { "title": "FakeGato Options",
        "type": "fieldset",
        "expandable": true,
        "items": [
           {
              "key": "storage", "flex": "1 1 50px",
              "notitle": false, "placeholder": "fs"
           },
           "storagePath",
           "folder",
           "keyPath"
        ]
      },
      { "key": "queueTypes",
        "type": "array",
        "listItems": 1,
        "items": [
        {
           "type": "div",
           "displayFlex": true,
           "flex-direction": "row",
           "items": [
           {
              "key": "queueTypes[].queue", "flex": "1 1 50px",
              "notitle": false, "placeholder": "AQueueName"
           },
           { "key": "queueTypes[].queueType", "flex": "4 4 200px",
             "notitle": false, "placeholder": "WoRm"
           }]
        }]
      }
   ]
}
