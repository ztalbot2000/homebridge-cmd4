/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "schema" }]*/

const schema =
{
   "schema":
   {
     "debug":
      {
         "title": "Debug",
         "type": "boolean",
         "description": "Enables additional output in the log.",
         "default": false
      },
      "statusMsg":
      {
         "title": "statusMsg",
         "type": "boolean",
         "description": "Enables state change status messages.",
         "required": false,
         "default": true
      },
      "allowTLV8":
      {
         "title": "allowTLV8",
         "type": "boolean",
         "description": "Enables wacky TLV8 characteristics.",
         "required": false,
         "default": false
      },
      "timeout":
      {
         "title": "timeout",
         "description": "The time to for a poll before its not",
         "type": "integer",
         "required": false
      },
      "stateChangeResponseTime":
      {
         "title": "stateChangeResponseTime",
         "description": "The time to wait between states",
         "type": "integer",
         "required": false
      },
      "stateCmdPrefix":
      {
         "title": "stateCmdPrefix",
         "description": "The global prefix to execute for state",
         "type": "string",
         "required": false
      },
      "stateCmd":
      {
         "title": "stateCmd",
         "description": "The global command to execute for state",
         "type": "string",
         "required": false
      },
      "stateCmdSuffix":
      {
         "title": "stateCmd",
         "description": "The global suffix to execute for state",
         "type": "string",
         "required": false
      },
      "queueTypes":
      {
         "title": "queueTypes",
         "type": "array",
         "uniqueItems": true,
         "required": false,
         "items":
         {
            "type": "object",
            "properties":
            {
               "name":
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
      },
      "accessories":
      {
         "type": "object",
         "properties":
         {
            "name":
            {
               "title": "Accessory Name",
               "description": "The name of your accessory in HomeKit",
               "type": "string",
               "required": true
            },
            "polling":
            {
               "title": "Accessory Polling",
               "description": "Polling of a characteristics state",
               "type": "string",
               "placeholder": false,
               "required": false
            },
            "queueTypes":
            {
               "title": "queueTypes",
               "type": "array",
               "uniqueItems": true,
               "required": false,
               "items":
               {
                  "type": "object",
                  "properties":
                  {
                     "name":
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
            },
           "manufacturer":
            {
               "name": "Manufacturer",
               "type": "string",
               "description": "Set the manufacturer name for display in the Home app."
            },
            "model":
            {
               "title": "Model",
               "description": "Accessory model",
               "type": "string",
               "required": false
            },
            "stateChangeResponseTime":
            {
               "title": "stateChangeResponseTime",
               "description": "The time to wait between states",
               "type": "integer",
               "required": false
            }
         }
      }
   },
   "layout": [
      "name",
      "debug",
      "accessories.name",
      "accessories.accessoryCharacteristics",
      "accessories.polling",
      "accessories.electricVehicle",
      "accessories.hybridVehicle",
      "accessories.tankBatteryType",
       {
         "key": "accessories",
         "type": "section",
         "title": "Branding",
         "expandable": true,
         "expanded": false,
         "orderable": false,
         "items": [
            "accessories.manufacturer",
            "accessories.model"
         ]
      },
      {
         "key": "accessories",
         "type": "section",
         "title": "Extras",
         "expandable": true,
         "expanded": false,
         "orderable": false,
         "items": [
            "accessories.maxRange",
            "accessories.polling"
         ]
      },
      {
         "key": "accessories.token",
         "type": "section",
         "title": "Authorization",
         "expandable": true,
         "expanded": false,
         "orderable": false,
         "items": [
            "accessories.token.access_token",
            "accessories.token.refresh_token",
            "accessories.token.token_type",
            "accessories.token.expires_in",
            "accessories.token.expires_at"
         ]
      }
   ]
};
