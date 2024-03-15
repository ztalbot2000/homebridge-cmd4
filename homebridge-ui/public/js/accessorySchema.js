/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "accessorySchema" }]*/

const accessorySchema =
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
         },
         "publishExternally":
         {
            "type": "boolean",
            "title": "publishExternally",
            "description": "Publish accessory externally.",
            "default": false,
            "required": false
         },
         "accessControlLevel":
         {
            "title": "accessControlLevel",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices Access Control Level",
            "condition":
            {
               "functionBody": "return ['AccessControl'].includes(model.type);"
            }
         },
         "accessoryFlags":
         {
            "title": "accessoryFlags",
            "type": "integer",
            "description": "The Devices Accessory Flags"
         },
         "accessoryIdentifier":
         {
            "title": "accessoryIdentifier",
            "type": "string",
            "description": "The Devices Accessory Identifier String",
            "condition":
            {
               "functionBody": "return ['BridgingState','TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "active":
         {
            "title": "active",
            "type": "string",
            "oneOf": [
               { "title": "INACTIVE", "enum": ["INACTIVE"] },
               { "title": "ACTIVE", "enum": ["ACTIVE"] }
            ],
            "description": "If the Device is ACTIVE/INACTIVE",
            "condition":
            {
               "functionBody": "return ['AirPurifier','CameraEventRecordingManagement','Fanv2','Faucet','HeaterCooler','HumidifierDehumidifier','IrrigationSystem','TargetControl','Television','Valve'].includes(model.type);"
            }
         },
         "activeIdentifier":
         {
            "title": "activeIdentifier",
            "type": "integer",
            "description": "The Devices Active Identifier",
            "condition":
            {
               "functionBody": "return ['TargetControl','Television'].includes(model.type);"
            }
         },
         "activityInterval":
         {
            "title": "activityInterval",
            "type": "integer",
            "minimum": 0,
            "description": "The Devices Activity Interval"
         },
         "administratorOnlyAccess":
         {
            "title": "administratorOnlyAccess",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If the Device has 2cwAdmin Only Access"
         },
         "airParticulateDensity":
         {
            "title": "airParticulateDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Measured Air Particulate Density"
         },
         "airParticulateSize":
         {
            "title": "airParticulateSize",
            "type": "string",
            "oneOf": [
               { "title": "_2_5_M", "enum": ["_2_5_M"] },
               { "title": "_10_M", "enum": ["_10_M"] }
            ],
            "description": "The Measured Air Particulate Size"
         },
         "airQuality":
         {
            "title": "airQuality",
            "type": "string",
            "oneOf": [
               { "title": "UNKNOWN", "enum": ["UNKNOWN"] },
               { "title": "EXCELLENT", "enum": ["EXCELLENT"] },
               { "title": "GOOD", "enum": ["GOOD"] },
               { "title": "FAIR", "enum": ["FAIR"] },
               { "title": "INFERIOR", "enum": ["INFERIOR"] },
               { "title": "POOR", "enum": ["POOR"] }
            ],
            "description": "The Current Air Quality",
            "condition":
            {
               "functionBody": "return ['AirQualitySensor'].includes(model.type);"
            }
         },
         "appMatchingIdentifier":
         {
            "title": "appMatchingIdentifier",
            "type": "string",
            "description": "The Devices App Matching Identifier"
         },
         "audioFeedback":
         {
            "title": "audioFeedback",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If Audio Feedback is Present"
         },
         "batteryLevel":
         {
            "title": "batteryLevel",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Measured Battery Level",
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            }
         },
         "brightness":
         {
            "title": "brightness",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Percentage of Existing Brightness"
         },
         "buttonEvent":
         {
            "title": "buttonEvent",
            "type": "string",
            "description": "The Devices zbutton Event",
            "condition":
            {
               "functionBody": "return ['TargetControl'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "ccaEnergyDetectThreshold":
         {
            "title": "ccaEnergyDetectThreshold",
            "type": "integer",
            "description": "The Devices CCA Energy Detect Threshold"
         },
         "ccaSignalDetectThreshold":
         {
            "title": "ccaSignalDetectThreshold",
            "type": "integer",
            "description": "The Devices Signal Detect Threshold"
         },
         "cameraOperatingModeIndicator":
         {
            "title": "cameraOperatingModeIndicator",
            "type": "string",
            "oneOf": [
               { "title": "DISABLE", "enum": ["DISABLE"] },
               { "title": "ENABLE", "enum": ["ENABLE"] }
            ],
            "description": "The State of the Camera's Operating Mode Indicator"
         },
         "carbonDioxideDetected":
         {
            "title": "carbonDioxideDetected",
            "type": "string",
            "oneOf": [
               { "title": "CO2_LEVELS_NORMAL", "enum": ["CO2_LEVELS_NORMAL"] },
               { "title": "CO2_LEVELS_ABNORMAL", "enum": ["CO2_LEVELS_ABNORMAL"] }
            ],
            "description": "If Carbon Dioxide has been Detected",
            "condition":
            {
               "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
            }
         },
         "carbonDioxideLevel":
         {
            "title": "carbonDioxideLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100000,
            "description": "The Amount of CO2 Detected"
         },
         "carbonDioxidePeakLevel":
         {
            "title": "carbonDioxidePeakLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100000,
            "description": "The Maximum Amount of CO2 Detected"
         },
         "carbonMonoxideDetected":
         {
            "title": "carbonMonoxideDetected",
            "type": "string",
            "oneOf": [
               { "title": "CO_LEVELS_NORMAL", "enum": ["CO_LEVELS_NORMAL"] },
               { "title": "CO_LEVELS_ABNORMAL", "enum": ["CO_LEVELS_ABNORMAL"] }
            ],
            "description": "Indication of CO Detected",
            "condition":
            {
               "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
            }
         },
         "carbonMonoxideLevel":
         {
            "title": "carbonMonoxideLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Amount of CO Detected"
         },
         "carbonMonoxidePeakLevel":
         {
            "title": "carbonMonoxidePeakLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Maximum Amount of CO Detected"
         },
         "category":
         {
            "title": "category",
            "type": "integer",
            "minimum": 1,
            "maximum": 16,
            "description": "A Hint to HomeKitf of which Icon to Use",
            "condition":
            {
               "functionBody": "return ['BridgingState'].includes(model.type);"
            }
         },
         "characteristicValueTransitionControl":
         {
            "title": "characteristicValueTransitionControl",
            "type": "string",
            "description": "The Devices Characteristic Value Transition Control"
         },
         "chargingState":
         {
            "title": "chargingState",
            "type": "string",
            "oneOf": [
               { "title": "NOT_CHARGING", "enum": ["NOT_CHARGING"] },
               { "title": "CHARGING", "enum": ["CHARGING"] },
               { "title": "NOT_CHARGEABLE", "enum": ["NOT_CHARGEABLE"] }
            ],
            "description": "The Current Charging State",
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            }
         },
         "closedCaptions":
         {
            "title": "closedCaptions",
            "type": "string",
            "oneOf": [
               { "title": "DISABLED", "enum": ["DISABLED"] },
               { "title": "ENABLED", "enum": ["ENABLED"] }
            ],
            "description": "If Closed Captioning is Enabled"
         },
         "colorTemperature":
         {
            "title": "colorTemperature",
            "type": "integer",
            "minimum": 140,
            "maximum": 500,
            "description": "The Colors Current Temperature"
         },
         "configureBridgedAccessory":
         {
            "title": "configureBridgedAccessory",
            "type": "string",
            "description": "The Configured Bridge Accessory",
            "condition":
            {
               "functionBody": "return ['BridgeConfiguration'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "configureBridgedAccessoryStatus":
         {
            "title": "configureBridgedAccessoryStatus",
            "type": "string",
            "description": "The Configured Bridge Accessory Status",
            "condition":
            {
               "functionBody": "return ['BridgeConfiguration'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "configuredName":
         {
            "title": "configuredName",
            "type": "string",
            "description": "Name of accessory, as displayed in HomeKit",
            "condition":
            {
               "functionBody": "return ['InputSource','Television','WiFiRouter'].includes(model.type);"
            }
         },
         "contactSensorState":
         {
            "title": "contactSensorState",
            "type": "string",
            "oneOf": [
               { "title": "CONTACT_DETECTED", "enum": ["CONTACT_DETECTED"] },
               { "title": "CONTACT_NOT_DETECTED", "enum": ["CONTACT_NOT_DETECTED"] }
            ],
            "description": "The Current RState of a Contact Sensor",
            "condition":
            {
               "functionBody": "return ['ContactSensor'].includes(model.type);"
            }
         },
         "coolingThresholdTemperature":
         {
            "title": "coolingThresholdTemperature",
            "type": "number",
            "minimum": 10,
            "maximum": 35,
            "description": "The Current Cooling Threshold Temperature"
         },
         "currentAirPurifierState":
         {
            "title": "currentAirPurifierState",
            "type": "string",
            "oneOf": [
               { "title": "INACTIVE", "enum": ["INACTIVE"] },
               { "title": "IDLE", "enum": ["IDLE"] },
               { "title": "PURIFYING_AIR", "enum": ["PURIFYING_AIR"] }
            ],
            "description": "The Current Target Air Purification State",
            "condition":
            {
               "functionBody": "return ['AirPurifier'].includes(model.type);"
            }
         },
         "currentAmbientLightLevel":
         {
            "title": "currentAmbientLightLevel",
            "type": "number",
            "minimum": 0.0001,
            "maximum": 100000,
            "description": "The Measured Ambient Light Level",
            "condition":
            {
               "functionBody": "return ['LightSensor'].includes(model.type);"
            }
         },
         "currentDoorState":
         {
            "title": "currentDoorState",
            "type": "string",
            "oneOf": [
               { "title": "OPEN", "enum": ["OPEN"] },
               { "title": "CLOSED", "enum": ["CLOSED"] },
               { "title": "OPENING", "enum": ["OPENING"] },
               { "title": "CLOSING", "enum": ["CLOSING"] },
               { "title": "STOPPED", "enum": ["STOPPED"] }
            ],
            "description": "The Doors Current Operating State",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "currentFanState":
         {
            "title": "currentFanState",
            "type": "string",
            "oneOf": [
               { "title": "INACTIVE", "enum": ["INACTIVE"] },
               { "title": "IDLE", "enum": ["IDLE"] },
               { "title": "BLOWING_AIR", "enum": ["BLOWING_AIR"] }
            ],
            "description": "The Fans Current Operating State"
         },
         "currentHeaterCoolerState":
         {
            "title": "currentHeaterCoolerState",
            "type": "string",
            "oneOf": [
               { "title": "INACTIVE", "enum": ["INACTIVE"] },
               { "title": "IDLE", "enum": ["IDLE"] },
               { "title": "HEATING", "enum": ["HEATING"] },
               { "title": "COOLING", "enum": ["COOLING"] }
            ],
            "description": "The Heater/Coolers  Current Operating State",
            "condition":
            {
               "functionBody": "return ['HeaterCooler'].includes(model.type);"
            }
         },
         "currentHeatingCoolingState":
         {
            "title": "currentHeatingCoolingState",
            "type": "string",
            "oneOf": [
               { "title": "OFF", "enum": ["OFF"] },
               { "title": "HEAT", "enum": ["HEAT"] },
               { "title": "COOL", "enum": ["COOL"] },
               { "title": "AUTO", "enum": ["AUTO"] }
            ],
            "description": "The Current Mode of the Heating/Cooling Device",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "currentHorizontalTiltAngle":
         {
            "title": "currentHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Current Horizontal Tilt Angle"
         },
         "currentHumidifierDehumidifierState":
         {
            "title": "currentHumidifierDehumidifierState",
            "type": "string",
            "oneOf": [
               { "title": "INACTIVE", "enum": ["INACTIVE"] },
               { "title": "IDLE", "enum": ["IDLE"] },
               { "title": "HUMIDIFYING", "enum": ["HUMIDIFYING"] },
               { "title": "DEHUMIDIFYING", "enum": ["DEHUMIDIFYING"] }
            ],
            "description": "The Humidifier or Dehumidifier Current State",
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
            }
         },
         "currentMediaState":
         {
            "title": "currentMediaState",
            "type": "string",
            "oneOf": [
               { "title": "PLAY", "enum": ["PLAY"] },
               { "title": "PAUSE", "enum": ["PAUSE"] },
               { "title": "STOP", "enum": ["STOP"] },
               { "title": "LOADING", "enum": ["LOADING"] },
               { "title": "INTERRUPTED", "enum": ["INTERRUPTED"] }
            ],
            "description": "The Medias Current State",
            "condition":
            {
               "functionBody": "return ['SmartSpeaker'].includes(model.type);"
            }
         },
         "currentPosition":
         {
            "title": "currentPosition",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The devices Current Position",
            "condition":
            {
               "functionBody": "return ['Door','Window','WindowCovering'].includes(model.type);"
            }
         },
         "currentRelativeHumidity":
         {
            "title": "currentRelativeHumidity",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Measured Current Relative Humidity",
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier','HumiditySensor'].includes(model.type);"
            }
         },
         "currentSlatState":
         {
            "title": "currentSlatState",
            "type": "string",
            "oneOf": [
               { "title": "FIXED", "enum": ["FIXED"] },
               { "title": "JAMMED", "enum": ["JAMMED"] },
               { "title": "SWINGING", "enum": ["SWINGING"] }
            ],
            "description": "The Slats Current State",
            "condition":
            {
               "functionBody": "return ['Slat'].includes(model.type);"
            }
         },
         "currentTemperature":
         {
            "title": "currentTemperature",
            "type": "number",
            "minimum": -270,
            "maximum": 100,
            "description": "The Current Measured Temperature",
            "condition":
            {
               "functionBody": "return ['HeaterCooler','TemperatureSensor','Thermostat'].includes(model.type);"
            }
         },
         "currentTiltAngle":
         {
            "title": "currentTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Current Measured Tilt Angle"
         },
         "currentTime":
         {
            "title": "currentTime",
            "type": "string",
            "description": "What Time it is Now",
            "condition":
            {
               "functionBody": "return ['TimeInformation'].includes(model.type);"
            }
         },
         "currentTransport":
         {
            "title": "currentTransport",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "The Devices Current Transport"
         },
         "currentVerticalTiltAngle":
         {
            "title": "currentVerticalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "TheMeasured Current Vertical Tilt Angle"
         },
         "currentVisibilityState":
         {
            "title": "currentVisibilityState",
            "type": "string",
            "oneOf": [
               { "title": "SHOWN", "enum": ["SHOWN"] },
               { "title": "HIDDEN", "enum": ["HIDDEN"] }
            ],
            "description": "Is a Device Currently Being Shown or Hidden",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "dataStreamHAPTransport":
         {
            "title": "dataStreamHAPTransport",
            "type": "string",
            "description": "The Devices Data Stream Transport"
         },
         "dataStreamHAPTransportInterrupt":
         {
            "title": "dataStreamHAPTransportInterrupt",
            "type": "string",
            "description": "The Devices Data Stream Transport Interrupt"
         },
         "dayoftheWeek":
         {
            "title": "dayoftheWeek",
            "type": "integer",
            "minimum": 1,
            "maximum": 7,
            "description": "The Current Numerical Day of the Week",
            "condition":
            {
               "functionBody": "return ['TimeInformation'].includes(model.type);"
            }
         },
         "diagonalFieldOfView":
         {
            "title": "diagonalFieldOfView",
            "type": "number",
            "minimum": 0,
            "maximum": 360,
            "description": "The Measured Diagonal Field of View"
         },
         "digitalZoom":
         {
            "title": "digitalZoom",
            "type": "number",
            "description": "The Measured Digital Zoom"
         },
         "discoverBridgedAccessories":
         {
            "title": "discoverBridgedAccessories",
            "type": "integer",
            "description": "The Discovered Bridge Accessories",
            "condition":
            {
               "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
            }
         },
         "discoveredBridgedAccessories":
         {
            "title": "discoveredBridgedAccessories",
            "type": "integer",
            "description": "The Discovered Bridged Accessories",
            "condition":
            {
               "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
            }
         },
         "displayOrder":
         {
            "title": "displayOrder",
            "type": "string",
            "description": "The Display Order"
         },
         "eventRetransmissionMaximum":
         {
            "title": "eventRetransmissionMaximum",
            "type": "integer",
            "description": "The Event Retransmission Maximum Amount"
         },
         "eventSnapshotsActive":
         {
            "title": "eventSnapshotsActive",
            "type": "string",
            "oneOf": [
               { "title": "DISABLE", "enum": ["DISABLE"] },
               { "title": "ENABLE", "enum": ["ENABLE"] }
            ],
            "description": "Is the Event Snapshot Enabled",
            "condition":
            {
               "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
            }
         },
         "eventTransmissionCounters":
         {
            "title": "eventTransmissionCounters",
            "type": "integer",
            "description": "The Event Transmission Counters"
         },
         "filterChangeIndication":
         {
            "title": "filterChangeIndication",
            "type": "string",
            "oneOf": [
               { "title": "FILTER_OK", "enum": ["FILTER_OK"] },
               { "title": "CHANGE_FILTER", "enum": ["CHANGE_FILTER"] }
            ],
            "description": "An Filters Current Quality",
            "condition":
            {
               "functionBody": "return ['FilterMaintenance'].includes(model.type);"
            }
         },
         "filterLifeLevel":
         {
            "title": "filterLifeLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "An Measurement of Filters Current Quality"
         },
         "firmwareRevision":
         {
            "title": "firmwareRevision",
            "type": "string",
            "description": "The Firmwares Revision String",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "hardwareRevision":
         {
            "title": "hardwareRevision",
            "type": "string",
            "description": "The Hardwares Revision String"
         },
         "heartBeat":
         {
            "title": "heartBeat",
            "type": "integer",
            "description": "The Current Heart Rate"
         },
         "heatingThresholdTemperature":
         {
            "title": "heatingThresholdTemperature",
            "type": "number",
            "minimum": 0,
            "maximum": 25,
            "description": "The Heating Threshold Temperature"
         },
         "holdPosition":
         {
            "title": "holdPosition",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If Position Should Be Held"
         },
         "homeKitCameraActive":
         {
            "title": "homeKitCameraActive",
            "type": "string",
            "oneOf": [
               { "title": "OFF", "enum": ["OFF"] },
               { "title": "ON", "enum": ["ON"] }
            ],
            "description": "Is the HomeKit Camera ON/OFF",
            "condition":
            {
               "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
            }
         },
         "hue":
         {
            "title": "hue",
            "type": "number",
            "minimum": 0,
            "maximum": 360,
            "description": "The Measured Hue"
         },
         "identifier":
         {
            "title": "identifier",
            "type": "integer",
            "description": "The Devices Identifier"
         },
         "identify":
         {
            "title": "identify",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "The Devices Identify Status",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "imageMirroring":
         {
            "title": "imageMirroring",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is Image Being Mirrored"
         },
         "imageRotation":
         {
            "title": "imageRotation",
            "type": "integer",
            "minimum": 0,
            "maximum": 360,
            "description": "The Images Degree of Rotation "
         },
         "inUse":
         {
            "title": "inUse",
            "type": "string",
            "oneOf": [
               { "title": "NOT_IN_USE", "enum": ["NOT_IN_USE"] },
               { "title": "IN_USE", "enum": ["IN_USE"] }
            ],
            "description": "Is the Device In Use",
            "condition":
            {
               "functionBody": "return ['IrrigationSystem','Valve'].includes(model.type);"
            }
         },
         "inputDeviceType":
         {
            "title": "inputDeviceType",
            "type": "string",
            "oneOf": [
               { "title": "OTHER", "enum": ["OTHER"] },
               { "title": "TV", "enum": ["TV"] },
               { "title": "RECORDING", "enum": ["RECORDING"] },
               { "title": "TUNER", "enum": ["TUNER"] },
               { "title": "PLAYBACK", "enum": ["PLAYBACK"] },
               { "title": "AUDIO_SYSTEM", "enum": ["AUDIO_SYSTEM"] },
               { "title": "UNKNOWN_6", "enum": ["UNKNOWN_6"] }
            ],
            "description": "The Input Devices Type"
         },
         "inputSourceType":
         {
            "title": "inputSourceType",
            "type": "string",
            "oneOf": [
               { "title": "OTHER", "enum": ["OTHER"] },
               { "title": "HOME_SCREEN", "enum": ["HOME_SCREEN"] },
               { "title": "TUNER", "enum": ["TUNER"] },
               { "title": "HDMI", "enum": ["HDMI"] },
               { "title": "COMPOSITE_VIDEO", "enum": ["COMPOSITE_VIDEO"] },
               { "title": "S_VIDEO", "enum": ["S_VIDEO"] },
               { "title": "COMPONENT_VIDEO", "enum": ["COMPONENT_VIDEO"] },
               { "title": "DVI", "enum": ["DVI"] },
               { "title": "AIRPLAY", "enum": ["AIRPLAY"] },
               { "title": "USB", "enum": ["USB"] },
               { "title": "APPLICATION", "enum": ["APPLICATION"] }
            ],
            "description": "The Input Devices Source Type",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "isConfigured":
         {
            "title": "isConfigured",
            "type": "string",
            "oneOf": [
               { "title": "NOT_CONFIGURED", "enum": ["NOT_CONFIGURED"] },
               { "title": "CONFIGURED", "enum": ["CONFIGURED"] }
            ],
            "description": "Is the device Configured",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "leakDetected":
         {
            "title": "leakDetected",
            "type": "string",
            "oneOf": [
               { "title": "LEAK_NOT_DETECTED", "enum": ["LEAK_NOT_DETECTED"] },
               { "title": "LEAK_DETECTED", "enum": ["LEAK_DETECTED"] }
            ],
            "description": "Is There a Leak Detected",
            "condition":
            {
               "functionBody": "return ['LeakSensor'].includes(model.type);"
            }
         },
         "linkQuality":
         {
            "title": "linkQuality",
            "type": "integer",
            "minimum": 1,
            "maximum": 4,
            "description": "The Links Quality",
            "condition":
            {
               "functionBody": "return ['BridgingState'].includes(model.type);"
            }
         },
         "listPairings":
         {
            "title": "listPairings",
            "type": "string",
            "description": "The Links Quality",
            "condition":
            {
               "functionBody": "return ['Pairing'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "lockControlPoint":
         {
            "title": "lockControlPoint",
            "type": "string",
            "description": "The Control Point of the Lock",
            "condition":
            {
               "functionBody": "return ['LockManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "lockCurrentState":
         {
            "title": "lockCurrentState",
            "type": "string",
            "oneOf": [
               { "title": "UNSECURED", "enum": ["UNSECURED"] },
               { "title": "SECURED", "enum": ["SECURED"] },
               { "title": "JAMMED", "enum": ["JAMMED"] },
               { "title": "UNKNOWN", "enum": ["UNKNOWN"] }
            ],
            "description": "The Locks Current State",
            "condition":
            {
               "functionBody": "return ['LockMechanism'].includes(model.type);"
            }
         },
         "lockLastKnownAction":
         {
            "title": "lockLastKnownAction",
            "type": "string",
            "oneOf": [
               { "title": "SECURED_PHYSICALLY_INTERIOR", "enum": ["SECURED_PHYSICALLY_INTERIOR"] },
               { "title": "UNSECURED_PHYSICALLY_INTERIOR", "enum": ["UNSECURED_PHYSICALLY_INTERIOR"] },
               { "title": "SECURED_PHYSICALLY_EXTERIOR", "enum": ["SECURED_PHYSICALLY_EXTERIOR"] },
               { "title": "UNSECURED_PHYSICALLY_EXTERIOR", "enum": ["UNSECURED_PHYSICALLY_EXTERIOR"] },
               { "title": "SECURED_BY_KEYPAD", "enum": ["SECURED_BY_KEYPAD"] },
               { "title": "UNSECURED_BY_KEYPAD", "enum": ["UNSECURED_BY_KEYPAD"] },
               { "title": "SECURED_REMOTELY", "enum": ["SECURED_REMOTELY"] },
               { "title": "UNSECURED_REMOTELY", "enum": ["UNSECURED_REMOTELY"] },
               { "title": "SECURED_BY_AUTO_SECURE_TIMEOUT", "enum": ["SECURED_BY_AUTO_SECURE_TIMEOUT"] },
               { "title": "SECURED_PHYSICALLY", "enum": ["SECURED_PHYSICALLY"] },
               { "title": "UNSECURED_PHYSICALLY", "enum": ["UNSECURED_PHYSICALLY"] }
            ],
            "description": "The Locks Last known Action"
         },
         "lockManagementAutoSecurityTimeout":
         {
            "title": "lockManagementAutoSecurityTimeout",
            "type": "integer",
            "description": "The Locks Security Timeout Value"
         },
         "lockPhysicalControls":
         {
            "title": "lockPhysicalControls",
            "type": "string",
            "oneOf": [
               { "title": "CONTROL_LOCK_DISABLED", "enum": ["CONTROL_LOCK_DISABLED"] },
               { "title": "CONTROL_LOCK_ENABLED", "enum": ["CONTROL_LOCK_ENABLED"] }
            ],
            "description": "Is the Lock Physically Enabled/Disabled"
         },
         "lockTargetState":
         {
            "title": "lockTargetState",
            "type": "string",
            "oneOf": [
               { "title": "UNSECURED", "enum": ["UNSECURED"] },
               { "title": "SECURED", "enum": ["SECURED"] }
            ],
            "description": "The Locks Requested State",
            "condition":
            {
               "functionBody": "return ['LockMechanism'].includes(model.type);"
            }
         },
         "logs":
         {
            "title": "logs",
            "type": "string",
            "description": "The Devices Logs"
         },
         "macRetransmissionMaximum":
         {
            "title": "macRetransmissionMaximum",
            "type": "integer",
            "description": "The Devices MAC Retransmission Maximum Amount"
         },
         "macTransmissionCounters":
         {
            "title": "macTransmissionCounters",
            "type": "string",
            "description": "The Devices MAC Transmission Counters"
         },
         "managedNetworkEnable":
         {
            "title": "managedNetworkEnable",
            "type": "string",
            "oneOf": [
               { "title": "DISABLED", "enum": ["DISABLED"] },
               { "title": "ENABLED", "enum": ["ENABLED"] },
               { "title": "UNKNOWN", "enum": ["UNKNOWN"] }
            ],
            "description": "The Networks Current State",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type);"
            }
         },
         "manuallyDisabled":
         {
            "title": "manuallyDisabled",
            "type": "string",
            "oneOf": [
               { "title": "ENABLED", "enum": ["ENABLED"] },
               { "title": "DISABLED", "enum": ["DISABLED"] }
            ],
            "description": "Is the Device Manually Enabled/Disabled"
         },
         "manufacturer":
         {
            "title": "manufacturer",
            "type": "string",
            "description": "The Devices Manufacturer",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "model":
         {
            "title": "model",
            "type": "string",
            "description": "The Devices Model",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "motionDetected":
         {
            "title": "motionDetected",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is Motion Being Detected",
            "condition":
            {
               "functionBody": "return ['MotionSensor'].includes(model.type);"
            }
         },
         "mute":
         {
            "title": "mute",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is the Device Currently Muted",
            "condition":
            {
               "functionBody": "return ['Microphone','Speaker','TelevisionSpeaker'].includes(model.type);"
            }
         },
         "name":
         {
            "title": "name",
            "type": "string",
            "description": "Name of accessory, as displayed in HomeKit",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation','TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "networkAccessViolationControl":
         {
            "title": "networkAccessViolationControl",
            "type": "string",
            "description": "The Network AccessViolation Control",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "networkClientProfileControl":
         {
            "title": "networkClientProfileControl",
            "type": "string",
            "description": "The Network Client Profile Control",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "networkClientStatusControl":
         {
            "title": "networkClientStatusControl",
            "type": "string",
            "description": "The Network Client Status Control",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "nightVision":
         {
            "title": "nightVision",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is Night Vision Available"
         },
         "nitrogenDioxideDensity":
         {
            "title": "nitrogenDioxideDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Measured NO2 Density"
         },
         "obstructionDetected":
         {
            "title": "obstructionDetected",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is Obstruction Currently Detected",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "occupancyDetected":
         {
            "title": "occupancyDetected",
            "type": "string",
            "oneOf": [
               { "title": "OCCUPANCY_NOT_DETECTED", "enum": ["OCCUPANCY_NOT_DETECTED"] },
               { "title": "OCCUPANCY_DETECTED", "enum": ["OCCUPANCY_DETECTED"] }
            ],
            "description": "Is Occupancy Currently Detected",
            "condition":
            {
               "functionBody": "return ['OccupancySensor'].includes(model.type);"
            }
         },
         "on":
         {
            "title": "on",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is the Device On",
            "condition":
            {
               "functionBody": "return ['CameraControl','Fan','Fanv1','Lightbulb','Outlet','Switch'].includes(model.type);"
            }
         },
         "operatingStateResponse":
         {
            "title": "operatingStateResponse",
            "type": "string",
            "description": "The Devices Operating State Response"
         },
         "opticalZoom":
         {
            "title": "opticalZoom",
            "type": "number",
            "description": "The Devices Optical Zoom Factor"
         },
         "outletInUse":
         {
            "title": "outletInUse",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is the Outlet in Use",
            "condition":
            {
               "functionBody": "return ['Outlet'].includes(model.type);"
            }
         },
         "ozoneDensity":
         {
            "title": "ozoneDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Ozones Current Measured Density"
         },
         "pm10Density":
         {
            "title": "pm10Density",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The PM1O Current Measured Density"
         },
         "pm2_5Density":
         {
            "title": "pm2_5Density",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The PM2_5 Current Measured Density"
         },
         "pairSetup":
         {
            "title": "pairSetup",
            "type": "string",
            "description": "The Devices Pair Setup",
            "condition":
            {
               "functionBody": "return ['Pairing'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "pairVerify":
         {
            "title": "pairVerify",
            "type": "string",
            "description": "The Devices Pair Verify",
            "condition":
            {
               "functionBody": "return ['Pairing'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "pairingFeatures":
         {
            "title": "pairingFeatures",
            "type": "integer",
            "description": "The Devices Pairing Features",
            "condition":
            {
               "functionBody": "return ['Pairing'].includes(model.type);"
            }
         },
         "pairingPairings":
         {
            "title": "pairingPairings",
            "type": "string",
            "description": "The Devices Pairing Pairings"
         },
         "passwordSetting":
         {
            "title": "passwordSetting",
            "type": "string",
            "description": "The Devices Password Setting"
         },
         "periodicSnapshotsActive":
         {
            "title": "periodicSnapshotsActive",
            "type": "string",
            "oneOf": [
               { "title": "DISABLE", "enum": ["DISABLE"] },
               { "title": "ENABLE", "enum": ["ENABLE"] }
            ],
            "description": "Is the Periodic Snapshot Enabled/Disabled"
         },
         "pictureMode":
         {
            "title": "pictureMode",
            "type": "string",
            "oneOf": [
               { "title": "OTHER", "enum": ["OTHER"] },
               { "title": "STANDARD", "enum": ["STANDARD"] },
               { "title": "CALIBRATED", "enum": ["CALIBRATED"] },
               { "title": "CALIBRATED_DARK", "enum": ["CALIBRATED_DARK"] },
               { "title": "VIVID", "enum": ["VIVID"] },
               { "title": "GAME", "enum": ["GAME"] },
               { "title": "COMPUTER", "enum": ["COMPUTER"] },
               { "title": "CUSTOM", "enum": ["CUSTOM"] },
               { "title": "UNKNOWN8", "enum": ["UNKNOWN8"] },
               { "title": "UNKNOWN9", "enum": ["UNKNOWN9"] },
               { "title": "UNKNOWN10", "enum": ["UNKNOWN10"] },
               { "title": "UNKNOWN11", "enum": ["UNKNOWN11"] },
               { "title": "UNKNOWN12", "enum": ["UNKNOWN12"] },
               { "title": "UNKNOWN13", "enum": ["UNKNOWN13"] }
            ],
            "description": "The Current Picture Mode"
         },
         "ping":
         {
            "title": "ping",
            "type": "string",
            "description": "The Devices Ping Characteristic",
            "condition":
            {
               "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
            }
         },
         "positionState":
         {
            "title": "positionState",
            "type": "string",
            "oneOf": [
               { "title": "DECREASING", "enum": ["DECREASING"] },
               { "title": "INCREASING", "enum": ["INCREASING"] },
               { "title": "STOPPED", "enum": ["STOPPED"] }
            ],
            "description": "The Devices Position State",
            "condition":
            {
               "functionBody": "return ['Door','Window','WindowCovering'].includes(model.type);"
            }
         },
         "powerModeSelection":
         {
            "title": "powerModeSelection",
            "type": "string",
            "oneOf": [
               { "title": "SHOW", "enum": ["SHOW"] },
               { "title": "HIDE", "enum": ["HIDE"] }
            ],
            "description": "The Devices Power Mode Selection"
         },
         "productData":
         {
            "title": "productData",
            "type": "string",
            "description": "The Devices Product Data"
         },
         "programMode":
         {
            "title": "programMode",
            "type": "string",
            "oneOf": [
               { "title": "NO_PROGRAM_SCHEDULED", "enum": ["NO_PROGRAM_SCHEDULED"] },
               { "title": "PROGRAM_SCHEDULED", "enum": ["PROGRAM_SCHEDULED"] },
               { "title": "PROGRAM_SCHEDULED_MANUAL_MODE_", "enum": ["PROGRAM_SCHEDULED_MANUAL_MODE_"] }
            ],
            "description": "The Devices Program Mode",
            "condition":
            {
               "functionBody": "return ['IrrigationSystem'].includes(model.type);"
            }
         },
         "programmableSwitchEvent":
         {
            "title": "programmableSwitchEvent",
            "type": "string",
            "oneOf": [
               { "title": "SINGLE_PRESS", "enum": ["SINGLE_PRESS"] },
               { "title": "DOUBLE_PRESS", "enum": ["DOUBLE_PRESS"] },
               { "title": "LONG_PRESS", "enum": ["LONG_PRESS"] }
            ],
            "description": "The Devices Current Position State",
            "condition":
            {
               "functionBody": "return ['DoorBell','StatefulProgrammableSwitch','StatelessProgrammableSwitch'].includes(model.type);"
            }
         },
         "programmableSwitchOutputState":
         {
            "title": "programmableSwitchOutputState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Programmable Switches Output State",
            "condition":
            {
               "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
            }
         },
         "reachable":
         {
            "title": "reachable",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If the Device is Reachable",
            "condition":
            {
               "functionBody": "return ['BridgingState'].includes(model.type);"
            }
         },
         "receivedSignalStrengthIndication":
         {
            "title": "receivedSignalStrengthIndication",
            "type": "integer",
            "description": "The Received Signal Strength Measurement"
         },
         "receiverSensitivity":
         {
            "title": "receiverSensitivity",
            "type": "integer",
            "description": "The Amount of Receiver Sensitivity"
         },
         "recordingAudioActive":
         {
            "title": "recordingAudioActive",
            "type": "string",
            "oneOf": [
               { "title": "DISABLE", "enum": ["DISABLE"] },
               { "title": "ENABLE", "enum": ["ENABLE"] }
            ],
            "description": "Is Recordding Audio Enabled/DisAbled"
         },
         "relativeHumidityDehumidifierThreshold":
         {
            "title": "relativeHumidityDehumidifierThreshold",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Relative Humidity DeHumidifier Threshold"
         },
         "relativeHumidityHumidifierThreshold":
         {
            "title": "relativeHumidityHumidifierThreshold",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Relative Humidity Humidifier Threshold"
         },
         "relayControlPoint":
         {
            "title": "relayControlPoint",
            "type": "string",
            "description": "The Relay Control Point",
            "condition":
            {
               "functionBody": "return ['Relay'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "relayEnabled":
         {
            "title": "relayEnabled",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Is the Relay Currently Enabled",
            "condition":
            {
               "functionBody": "return ['Relay'].includes(model.type);"
            }
         },
         "relayState":
         {
            "title": "relayState",
            "type": "integer",
            "minimum": 0,
            "maximum": 5,
            "description": "The Relays Current State",
            "condition":
            {
               "functionBody": "return ['Relay'].includes(model.type);"
            }
         },
         "remainingDuration":
         {
            "title": "remainingDuration",
            "type": "integer",
            "minimum": 0,
            "maximum": 3600,
            "description": "The Remaining Duration"
         },
         "remoteKey":
         {
            "title": "remoteKey",
            "type": "string",
            "oneOf": [
               { "title": "REWIND", "enum": ["REWIND"] },
               { "title": "FAST_FORWARD", "enum": ["FAST_FORWARD"] },
               { "title": "NEXT_TRACK", "enum": ["NEXT_TRACK"] },
               { "title": "PREVIOUS_TRACK", "enum": ["PREVIOUS_TRACK"] },
               { "title": "ARROW_UP", "enum": ["ARROW_UP"] },
               { "title": "ARROW_DOWN", "enum": ["ARROW_DOWN"] },
               { "title": "ARROW_LEFT", "enum": ["ARROW_LEFT"] },
               { "title": "ARROW_RIGHT", "enum": ["ARROW_RIGHT"] },
               { "title": "SELECT", "enum": ["SELECT"] },
               { "title": "BACK", "enum": ["BACK"] },
               { "title": "EXIT", "enum": ["EXIT"] },
               { "title": "PLAY_PAUSE", "enum": ["PLAY_PAUSE"] },
               { "title": "UNKNOWN12", "enum": ["UNKNOWN12"] },
               { "title": "UNKNOWN13", "enum": ["UNKNOWN13"] },
               { "title": "UNKNOWN14", "enum": ["UNKNOWN14"] },
               { "title": "INFORMATION", "enum": ["INFORMATION"] },
               { "title": "UNKNOWN16", "enum": ["UNKNOWN16"] }
            ],
            "description": "The Remote Key",
            "condition":
            {
               "functionBody": "return ['Television'].includes(model.type);"
            }
         },
         "resetFilterIndication":
         {
            "title": "resetFilterIndication",
            "type": "integer",
            "minimum": 1,
            "maximum": 1,
            "description": "If Reset Filter Indication "
         },
         "rotationDirection":
         {
            "title": "rotationDirection",
            "type": "string",
            "oneOf": [
               { "title": "CLOCKWISE", "enum": ["CLOCKWISE"] },
               { "title": "COUNTER_CLOCKWISE", "enum": ["COUNTER_CLOCKWISE"] }
            ],
            "description": "The Current Direction of Rotation"
         },
         "rotationSpeed":
         {
            "title": "rotationSpeed",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Current Speed of Rotation"
         },
         "routerStatus":
         {
            "title": "routerStatus",
            "type": "string",
            "oneOf": [
               { "title": "READY", "enum": ["READY"] },
               { "title": "NOT_READY", "enum": ["NOT_READY"] }
            ],
            "description": "The Current Router Status",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type);"
            }
         },
         "saturation":
         {
            "title": "saturation",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Percentage of Color Saturation"
         },
         "securitySystemAlarmType":
         {
            "title": "securitySystemAlarmType",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Security System Alarm Type"
         },
         "securitySystemCurrentState":
         {
            "title": "securitySystemCurrentState",
            "type": "string",
            "oneOf": [
               { "title": "STAY_ARM", "enum": ["STAY_ARM"] },
               { "title": "AWAY_ARM", "enum": ["AWAY_ARM"] },
               { "title": "NIGHT_ARM", "enum": ["NIGHT_ARM"] },
               { "title": "DISARMED", "enum": ["DISARMED"] },
               { "title": "ALARM_TRIGGERED", "enum": ["ALARM_TRIGGERED"] }
            ],
            "description": "The Security Systems Currently Armed State",
            "condition":
            {
               "functionBody": "return ['SecuritySystem'].includes(model.type);"
            }
         },
         "securitySystemTargetState":
         {
            "title": "securitySystemTargetState",
            "type": "string",
            "oneOf": [
               { "title": "STAY_ARM", "enum": ["STAY_ARM"] },
               { "title": "AWAY_ARM", "enum": ["AWAY_ARM"] },
               { "title": "NIGHT_ARM", "enum": ["NIGHT_ARM"] },
               { "title": "DISARM", "enum": ["DISARM"] }
            ],
            "description": "The Target Armed State of the Security System",
            "condition":
            {
               "functionBody": "return ['SecuritySystem'].includes(model.type);"
            }
         },
         "selectedAudioStreamConfiguration":
         {
            "title": "selectedAudioStreamConfiguration",
            "type": "string",
            "description": "The Selected Audio Stream Configuration"
         },
         "selectedCameraRecordingConfiguration":
         {
            "title": "selectedCameraRecordingConfiguration",
            "type": "string",
            "description": "The Selected Cameras Recording Configuration",
            "condition":
            {
               "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "selectedRTPStreamConfiguration":
         {
            "title": "selectedRTPStreamConfiguration",
            "type": "string",
            "description": "The Selected RTP Stream Configuration",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "serialNumber":
         {
            "title": "serialNumber",
            "type": "string",
            "description": "The Devices Serial Number",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "serviceLabelIndex":
         {
            "title": "serviceLabelIndex",
            "type": "integer",
            "minimum": 1,
            "maximum": 255,
            "description": "The Devices Service Label Index"
         },
         "serviceLabelNamespace":
         {
            "title": "serviceLabelNamespace",
            "type": "string",
            "oneOf": [
               { "title": "DOTS", "enum": ["DOTS"] },
               { "title": "ARABIC_NUMERALS", "enum": ["ARABIC_NUMERALS"] }
            ],
            "description": "The Devices Service Label NameSpace",
            "condition":
            {
               "functionBody": "return ['ServiceLabel'].includes(model.type);"
            }
         },
         "setDuration":
         {
            "title": "setDuration",
            "type": "integer",
            "minimum": 0,
            "maximum": 3600,
            "description": "The Devices Set Duration"
         },
         "setupDataStreamTransport":
         {
            "title": "setupDataStreamTransport",
            "type": "string",
            "description": "The Devices Setup Stream Transport Value"
         },
         "setupEndpoints":
         {
            "title": "setupEndpoints",
            "type": "string",
            "description": "The Devices Setup End Points",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "setupTransferTransport":
         {
            "title": "setupTransferTransport",
            "type": "string",
            "description": "The Devices Setup Transfer Transport",
            "condition":
            {
               "functionBody": "return ['TransferTransportManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "signalToNoiseRatio":
         {
            "title": "signalToNoiseRatio",
            "type": "integer",
            "description": "The Measured Signal to Noise Ratio"
         },
         "siriInputType":
         {
            "title": "siriInputType",
            "type": "string",
            "oneOf": [
               { "title": "PUSH_BUTTON_TRIGGERED_APPLE_TV", "enum": ["PUSH_BUTTON_TRIGGERED_APPLE_TV"] }
            ],
            "description": "siri's Input Type",
            "condition":
            {
               "functionBody": "return ['Siri'].includes(model.type);"
            }
         },
         "slatType":
         {
            "title": "slatType",
            "type": "string",
            "oneOf": [
               { "title": "HORIZONTAL", "enum": ["HORIZONTAL"] },
               { "title": "VERTICAL", "enum": ["VERTICAL"] }
            ],
            "description": "The Slat Type",
            "condition":
            {
               "functionBody": "return ['Slat'].includes(model.type);"
            }
         },
         "sleepDiscoveryMode":
         {
            "title": "sleepDiscoveryMode",
            "type": "string",
            "oneOf": [
               { "title": "NOT_DISCOVERABLE", "enum": ["NOT_DISCOVERABLE"] },
               { "title": "ALWAYS_DISCOVERABLE", "enum": ["ALWAYS_DISCOVERABLE"] }
            ],
            "description": "The Devices Discoverable Sleep Mode",
            "condition":
            {
               "functionBody": "return ['Television'].includes(model.type);"
            }
         },
         "sleepInterval":
         {
            "title": "sleepInterval",
            "type": "integer",
            "minimum": 0,
            "description": "The Devices Sleep Interval"
         },
         "smokeDetected":
         {
            "title": "smokeDetected",
            "type": "string",
            "oneOf": [
               { "title": "SMOKE_NOT_DETECTED", "enum": ["SMOKE_NOT_DETECTED"] },
               { "title": "SMOKE_DETECTED", "enum": ["SMOKE_DETECTED"] }
            ],
            "description": "If Smoke is Detected or Not",
            "condition":
            {
               "functionBody": "return ['SmokeSensor'].includes(model.type);"
            }
         },
         "softwareRevision":
         {
            "title": "softwareRevision",
            "type": "string",
            "description": "The Devices Software Revision String"
         },
         "statusActive":
         {
            "title": "statusActive",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If the Device is Active or Not"
         },
         "statusFault":
         {
            "title": "statusFault",
            "type": "string",
            "oneOf": [
               { "title": "NO_FAULT", "enum": ["NO_FAULT"] },
               { "title": "GENERAL_FAULT", "enum": ["GENERAL_FAULT"] }
            ],
            "description": "If the Device has a Status Fault"
         },
         "statusJammed":
         {
            "title": "statusJammed",
            "type": "string",
            "oneOf": [
               { "title": "NOT_JAMMED", "enum": ["NOT_JAMMED"] },
               { "title": "JAMMED", "enum": ["JAMMED"] }
            ],
            "description": "If the Device is in Jammed Status"
         },
         "statusLowBattery":
         {
            "title": "statusLowBattery",
            "type": "string",
            "oneOf": [
               { "title": "BATTERY_LEVEL_NORMAL", "enum": ["BATTERY_LEVEL_NORMAL"] },
               { "title": "BATTERY_LEVEL_LOW", "enum": ["BATTERY_LEVEL_LOW"] }
            ],
            "description": "The Status of the Battery Level",
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            }
         },
         "statusTampered":
         {
            "title": "statusTampered",
            "type": "string",
            "oneOf": [
               { "title": "NOT_TAMPERED", "enum": ["NOT_TAMPERED"] },
               { "title": "TAMPERED", "enum": ["TAMPERED"] }
            ],
            "description": "If the Device is Tampered"
         },
         "streamingStatus":
         {
            "title": "streamingStatus",
            "type": "string",
            "description": "The Devices Streaming Status",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "sulphurDioxideDensity":
         {
            "title": "sulphurDioxideDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The measured Sulphur Dioxide Density"
         },
         "supportedAudioRecordingConfiguration":
         {
            "title": "supportedAudioRecordingConfiguration",
            "type": "string",
            "description": "The Supported Audio Recording Configuration",
            "condition":
            {
               "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedAudioStreamConfiguration":
         {
            "title": "supportedAudioStreamConfiguration",
            "type": "string",
            "description": "The Supported Audio Stream Configuration",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedCameraRecordingConfiguration":
         {
            "title": "supportedCameraRecordingConfiguration",
            "type": "string",
            "description": "The Supported Audio Recording Configuration",
            "condition":
            {
               "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedDataStreamTransportConfiguration":
         {
            "title": "supportedDataStreamTransportConfiguration",
            "type": "string",
            "description": "The Supported Data Stream Transport Configuration"
         },
         "supportedCharacteristicValueTransitionConfiguration":
         {
            "title": "supportedCharacteristicValueTransitionConfiguration",
            "type": "string",
            "description": "The Supported Characteristic Value Transition Configuration"
         },
         "supportedDiagnosticsSnapshot":
         {
            "title": "supportedDiagnosticsSnapshot",
            "type": "string",
            "description": "The Supported Diagnostic Snapshot",
            "condition":
            {
               "functionBody": "return ['Diagnostics'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedRTPConfiguration":
         {
            "title": "supportedRTPConfiguration",
            "type": "string",
            "description": "The Supported RTP Configuration",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedRouterConfiguration":
         {
            "title": "supportedRouterConfiguration",
            "type": "string",
            "description": "The Supported Router Configuration",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedTransferTransportConfiguration":
         {
            "title": "supportedTransferTransportConfiguration",
            "type": "string",
            "description": "The Supported Transfer Transport Configuration",
            "condition":
            {
               "functionBody": "return ['TransferTransportManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedVideoRecordingConfiguration":
         {
            "title": "supportedVideoRecordingConfiguration",
            "type": "string",
            "description": "The Supported Video Recording Configuration",
            "condition":
            {
               "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "supportedVideoStreamConfiguration":
         {
            "title": "supportedVideoStreamConfiguration",
            "type": "string",
            "description": "The Supported Video Stream Configuration",
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "swingMode":
         {
            "title": "swingMode",
            "type": "string",
            "oneOf": [
               { "title": "SWING_DISABLED", "enum": ["SWING_DISABLED"] },
               { "title": "SWING_ENABLED", "enum": ["SWING_ENABLED"] }
            ],
            "description": "The DevicesnCurrent Swing Mode"
         },
         "targetAirPurifierState":
         {
            "title": "targetAirPurifierState",
            "type": "string",
            "oneOf": [
               { "title": "MANUAL", "enum": ["MANUAL"] },
               { "title": "AUTO", "enum": ["AUTO"] }
            ],
            "description": "The Requested Target Air Purification State",
            "condition":
            {
               "functionBody": "return ['AirPurifier'].includes(model.type);"
            }
         },
         "targetAirQuality":
         {
            "title": "targetAirQuality",
            "type": "string",
            "oneOf": [
               { "title": "EXCELLENT", "enum": ["EXCELLENT"] },
               { "title": "GOOD", "enum": ["GOOD"] },
               { "title": "FAIR", "enum": ["FAIR"] }
            ],
            "description": "The Requested Target Air Quality"
         },
         "targetControlList":
         {
            "title": "targetControlList",
            "type": "string",
            "description": "The Target Control List",
            "condition":
            {
               "functionBody": "return ['TargetControlManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "targetControlSupportedConfiguration":
         {
            "title": "targetControlSupportedConfiguration",
            "type": "string",
            "description": "The Target Supported Configuration",
            "condition":
            {
               "functionBody": "return ['TargetControlManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "targetDoorState":
         {
            "title": "targetDoorState",
            "type": "string",
            "oneOf": [
               { "title": "OPEN", "enum": ["OPEN"] },
               { "title": "CLOSED", "enum": ["CLOSED"] }
            ],
            "description": "The Doors Requested State",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "targetFanState":
         {
            "title": "targetFanState",
            "type": "string",
            "oneOf": [
               { "title": "MANUAL", "enum": ["MANUAL"] },
               { "title": "AUTO", "enum": ["AUTO"] }
            ],
            "description": "The Fans Requested State"
         },
         "targetHeaterCoolerState":
         {
            "title": "targetHeaterCoolerState",
            "type": "string",
            "oneOf": [
               { "title": "AUTO", "enum": ["AUTO"] },
               { "title": "HEAT", "enum": ["HEAT"] },
               { "title": "COOL", "enum": ["COOL"] }
            ],
            "description": "The Heaters Requested Cooling State",
            "condition":
            {
               "functionBody": "return ['HeaterCooler'].includes(model.type);"
            }
         },
         "targetHeatingCoolingState":
         {
            "title": "targetHeatingCoolingState",
            "type": "string",
            "oneOf": [
               { "title": "OFF", "enum": ["OFF"] },
               { "title": "HEAT", "enum": ["HEAT"] },
               { "title": "COOL", "enum": ["COOL"] },
               { "title": "AUTO", "enum": ["AUTO"] }
            ],
            "description": "The Heaters Requested Heating State",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "targetHorizontalTiltAngle":
         {
            "title": "targetHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Requested Horizontal Tilt Angle"
         },
         "targetHumidifierDehumidifierState":
         {
            "title": "targetHumidifierDehumidifierState",
            "type": "string",
            "oneOf": [
               { "title": "HUMIDIFIER_OR_DEHUMIDIFIER", "enum": ["HUMIDIFIER_OR_DEHUMIDIFIER"] },
               { "title": "HUMIDIFIER", "enum": ["HUMIDIFIER"] },
               { "title": "DEHUMIDIFIER", "enum": ["DEHUMIDIFIER"] }
            ],
            "description": "The Requested Humidifier/DeHumidifier State",
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
            }
         },
         "targetMediaState":
         {
            "title": "targetMediaState",
            "type": "string",
            "oneOf": [
               { "title": "PLAY", "enum": ["PLAY"] },
               { "title": "PAUSE", "enum": ["PAUSE"] },
               { "title": "STOP", "enum": ["STOP"] }
            ],
            "description": "The Requested Media State",
            "condition":
            {
               "functionBody": "return ['SmartSpeaker'].includes(model.type);"
            }
         },
         "targetPosition":
         {
            "title": "targetPosition",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Devices Requested Position",
            "condition":
            {
               "functionBody": "return ['Door','Window','WindowCovering'].includes(model.type);"
            }
         },
         "targetRelativeHumidity":
         {
            "title": "targetRelativeHumidity",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Devices Requested Relative Humidity Level"
         },
         "targetSlatState":
         {
            "title": "targetSlatState",
            "type": "string",
            "oneOf": [
               { "title": "MANUAL", "enum": ["MANUAL"] },
               { "title": "AUTO", "enum": ["AUTO"] }
            ],
            "description": "The Devices Requested Slat State"
         },
         "targetTemperature":
         {
            "title": "targetTemperature",
            "type": "number",
            "minimum": 10,
            "maximum": 38,
            "description": "The Devices Requested Temperature",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "targetTiltAngle":
         {
            "title": "targetTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Devices Requested Tilt Angle"
         },
         "targetVerticalTiltAngle":
         {
            "title": "targetVerticalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Devices Requested Vertical Tilt Angle"
         },
         "targetVisibilityState":
         {
            "title": "targetVisibilityState",
            "type": "string",
            "oneOf": [
               { "title": "SHOWN", "enum": ["SHOWN"] },
               { "title": "HIDDEN", "enum": ["HIDDEN"] }
            ],
            "description": "The Devices Requested Visibility State"
         },
         "temperatureDisplayUnits":
         {
            "title": "temperatureDisplayUnits",
            "type": "string",
            "oneOf": [
               { "title": "CELSIUS", "enum": ["CELSIUS"] },
               { "title": "FAHRENHEIT", "enum": ["FAHRENHEIT"] }
            ],
            "description": "The Units to Display the Temperature in",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "thirdPartyCameraActive":
         {
            "title": "thirdPartyCameraActive",
            "type": "string",
            "oneOf": [
               { "title": "OFF", "enum": ["OFF"] },
               { "title": "ON", "enum": ["ON"] }
            ],
            "description": "The ON/OFF Auxiliary Camera State"
         },
         "timeUpdate":
         {
            "title": "timeUpdate",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "Ifnthe Time Should be Updated",
            "condition":
            {
               "functionBody": "return ['TimeInformation'].includes(model.type);"
            }
         },
         "transmitPower":
         {
            "title": "transmitPower",
            "type": "integer",
            "description": "The Devices Measured Transmit Power"
         },
         "transmitPowerMaximum":
         {
            "title": "transmitPowerMaximum",
            "type": "integer",
            "description": "The Devices Maximum Power Output"
         },
         "tunnelConnectionTimeout":
         {
            "title": "tunnelConnectionTimeout",
            "type": "integer",
            "description": "The Timeout Value of the Tunnel Connection",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryAdvertising":
         {
            "title": "tunneledAccessoryAdvertising",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If the Device is Currently Tunneled Advertising",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryConnected":
         {
            "title": "tunneledAccessoryConnected",
            "type": "string",
            "oneOf": [
               { "title": "FALSE", "enum": ["FALSE"] },
               { "title": "TRUE", "enum": ["TRUE"] }
            ],
            "description": "If the Device is Tunneled Connected ",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryStateNumber":
         {
            "title": "tunneledAccessoryStateNumber",
            "type": "integer",
            "description": "The Tunneled Accessorys State Number",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "vocDensity":
         {
            "title": "vocDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Devices Measured VOC Density"
         },
         "valveType":
         {
            "title": "valveType",
            "type": "string",
            "oneOf": [
               { "title": "GENERIC_VALVE", "enum": ["GENERIC_VALVE"] },
               { "title": "IRRIGATION", "enum": ["IRRIGATION"] },
               { "title": "SHOWER_HEAD", "enum": ["SHOWER_HEAD"] },
               { "title": "WATER_FAUCET", "enum": ["WATER_FAUCET"] }
            ],
            "description": "The Devices Valve Type",
            "condition":
            {
               "functionBody": "return ['Valve'].includes(model.type);"
            }
         },
         "version":
         {
            "title": "version",
            "type": "string",
            "description": "The Devices Version String",
            "condition":
            {
               "functionBody": "return ['LockManagement','ProtocolInformation'].includes(model.type);"
            }
         },
         "videoAnalysisActive":
         {
            "title": "videoAnalysisActive",
            "type": "integer",
            "description": "The Devices Video Analysis Active Status"
         },
         "volume":
         {
            "title": "volume",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Devices Volume as a Percentage"
         },
         "volumeControlType":
         {
            "title": "volumeControlType",
            "type": "string",
            "oneOf": [
               { "title": "NONE", "enum": ["NONE"] },
               { "title": "RELATIVE", "enum": ["RELATIVE"] },
               { "title": "RELATIVE_WITH_CURRENT", "enum": ["RELATIVE_WITH_CURRENT"] },
               { "title": "ABSOLUTE", "enum": ["ABSOLUTE"] }
            ],
            "description": "The Devices Volume Control Type"
         },
         "volumeSelector":
         {
            "title": "volumeSelector",
            "type": "string",
            "oneOf": [
               { "title": "INCREMENT", "enum": ["INCREMENT"] },
               { "title": "DECREMENT", "enum": ["DECREMENT"] }
            ],
            "description": "The Devices Volume Selector"
         },
         "wanConfigurationList":
         {
            "title": "wanConfigurationList",
            "type": "string",
            "description": "The Devices WAN Configuration List",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "wanStatusList":
         {
            "title": "wanStatusList",
            "type": "string",
            "description": "The Devices WAN Status List",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "wakeConfiguration":
         {
            "title": "wakeConfiguration",
            "type": "string",
            "description": "The Devices Wake Configuration",
            "condition":
            {
               "functionBody": "return ['PowerManagement'].includes(model.type) && model.allowTLV8 == true;"
            }
         },
         "waterLevel":
         {
            "title": "waterLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Current Water Level Measurement"
         },
         "wifiCapabilities":
         {
            "title": "wifiCapabilities",
            "type": "integer",
            "description": "The Devices WiFi Capabilities"
         },
         "wifiConfigurationControl":
         {
            "title": "wifiConfigurationControl",
            "type": "string",
            "description": "The Devices WiFi Configuration Control"
         },
         "wifiSatelliteStatus":
         {
            "title": "wifiSatelliteStatus",
            "type": "string",
            "oneOf": [
               { "title": "UNKNOWN", "enum": ["UNKNOWN"] },
               { "title": "CONNECTED", "enum": ["CONNECTED"] },
               { "title": "NOT_CONNECTED", "enum": ["NOT_CONNECTED"] }
            ],
            "description": "The Devices WiFi Satellite Status",
            "condition":
            {
               "functionBody": "return ['WiFiSatellite'].includes(model.type);"
            }
         },
         "type":
         {
            "type": "string",
            "title": "type",
            "description": "Select the Accessory Type.",
            "default": "Switch",
            "oneOf":
            [
               { "title": "AccessControl", "enum": ["AccessControl"] },
               { "title": "AccessoryRuntimeInformation", "enum": ["AccessoryRuntimeInformation"] },
               { "title": "AccessoryInformation", "enum": ["AccessoryInformation"] },
               { "title": "AirPurifier", "enum": ["AirPurifier"] },
               { "title": "AirQualitySensor", "enum": ["AirQualitySensor"] },
               { "title": "BatteryService", "enum": ["BatteryService"] },
               { "title": "BridgeConfiguration", "enum": ["BridgeConfiguration"] },
               { "title": "BridgingState", "enum": ["BridgingState"] },
               { "title": "CameraEventRecordingManagement", "enum": ["CameraEventRecordingManagement"] },
               { "title": "CameraControl", "enum": ["CameraControl"] },
               { "title": "CameraRTPStreamManagement", "enum": ["CameraRTPStreamManagement"] },
               { "title": "CameraOperatingMode", "enum": ["CameraOperatingMode"] },
               { "title": "CarbonDioxideSensor", "enum": ["CarbonDioxideSensor"] },
               { "title": "CarbonMonoxideSensor", "enum": ["CarbonMonoxideSensor"] },
               { "title": "ContactSensor", "enum": ["ContactSensor"] },
               { "title": "Diagnostics", "enum": ["Diagnostics"] },
               { "title": "Door", "enum": ["Door"] },
               { "title": "DoorBell", "enum": ["DoorBell"] },
               { "title": "Fan", "enum": ["Fan"] },
               { "title": "Fanv1", "enum": ["Fanv1"] },
               { "title": "Fanv2", "enum": ["Fanv2"] },
               { "title": "Faucet", "enum": ["Faucet"] },
               { "title": "FilterMaintenance", "enum": ["FilterMaintenance"] },
               { "title": "GarageDoorOpener", "enum": ["GarageDoorOpener"] },
               { "title": "HeaterCooler", "enum": ["HeaterCooler"] },
               { "title": "HumidifierDehumidifier", "enum": ["HumidifierDehumidifier"] },
               { "title": "HumiditySensor", "enum": ["HumiditySensor"] },
               { "title": "InputSource", "enum": ["InputSource"] },
               { "title": "IrrigationSystem", "enum": ["IrrigationSystem"] },
               { "title": "LeakSensor", "enum": ["LeakSensor"] },
               { "title": "LightSensor", "enum": ["LightSensor"] },
               { "title": "Lightbulb", "enum": ["Lightbulb"] },
               { "title": "LockManagement", "enum": ["LockManagement"] },
               { "title": "LockMechanism", "enum": ["LockMechanism"] },
               { "title": "Microphone", "enum": ["Microphone"] },
               { "title": "MotionSensor", "enum": ["MotionSensor"] },
               { "title": "OccupancySensor", "enum": ["OccupancySensor"] },
               { "title": "Outlet", "enum": ["Outlet"] },
               { "title": "Pairing", "enum": ["Pairing"] },
               { "title": "PowerManagement", "enum": ["PowerManagement"] },
               { "title": "ProtocolInformation", "enum": ["ProtocolInformation"] },
               { "title": "Relay", "enum": ["Relay"] },
               { "title": "SecuritySystem", "enum": ["SecuritySystem"] },
               { "title": "ServiceLabel", "enum": ["ServiceLabel"] },
               { "title": "Siri", "enum": ["Siri"] },
               { "title": "Slat", "enum": ["Slat"] },
               { "title": "SmartSpeaker", "enum": ["SmartSpeaker"] },
               { "title": "SmokeSensor", "enum": ["SmokeSensor"] },
               { "title": "Speaker", "enum": ["Speaker"] },
               { "title": "StatefulProgrammableSwitch", "enum": ["StatefulProgrammableSwitch"] },
               { "title": "StatelessProgrammableSwitch", "enum": ["StatelessProgrammableSwitch"] },
               { "title": "Switch", "enum": ["Switch"] },
               { "title": "TargetControl", "enum": ["TargetControl"] },
               { "title": "TargetControlManagement", "enum": ["TargetControlManagement"] },
               { "title": "Television", "enum": ["Television"] },
               { "title": "TelevisionSpeaker", "enum": ["TelevisionSpeaker"] },
               { "title": "TemperatureSensor", "enum": ["TemperatureSensor"] },
               { "title": "Thermostat", "enum": ["Thermostat"] },
               { "title": "TimeInformation", "enum": ["TimeInformation"] },
               { "title": "TransferTransportManagement", "enum": ["TransferTransportManagement"] },
               { "title": "TunneledBTLEAccessoryService", "enum": ["TunneledBTLEAccessoryService"] },
               { "title": "Valve", "enum": ["Valve"] },
               { "title": "WiFiRouter", "enum": ["WiFiRouter"] },
               { "title": "WiFiSatellite", "enum": ["WiFiSatellite"] },
               { "title": "Window", "enum": ["Window"] },
               { "title": "WindowCovering", "enum": ["WindowCovering"] }
            ],
            "required": true
         },
         "subType":
         {
            "type": "string",
            "title": "subType",
            "description": "The accessories subType.",
            "placeholder": "A secondary name",
            "required": false
         },
         "displayName":
         {
            "type": "string",
            "title": "displayName",
            "description": "The accessories display name.",
            "placeholder": "My_Device",
            "required": true
         },
         "queue":
         {
            "title": "queue",
            "description": "A queue name",
            "type": "string",
            "required": "false"
         },
         "pollingSwitch":
         {
            "type": "boolean",
            "title": "Polling",
            "description": "Polling is on/off.",
            "default": false,
            "required": false
         },
         "polling":
         {
            "title": "polling",
            "type": "array",
            "required": false,
            "condition":
            {
               "functionBody": "return model.pollingSwitch && model.pollingSwitch == true;"
            },
            "uniqueItems": true,
            "maxItems": 0,
            "items":
            {
               "type": "object",
               "properties":
               {
                  "characteristic":
                  {
                     "title": "characteristic",
                     "type": "string",
                     "required": "true"
                  },
                  "timeout": {"$ref": "#/$defs/timeout"},
                  "interval": { "$ref": "#/$defs/interval"},
                  "stateChangeResponseTime": {"$ref": "#/$defs/stateChangeResponseTime"}
               }
            }
         },
         "fakegato": {
            "title": "fakegato",
            "type": "object",
            "required": "false",
            "properties": {
               "eve": {
                  "type": "string",
                  "title": "eve",
                  "description": "FakeGato Accessory Type.",
                  "default": "room",
                  "oneOf": [
                     { "title": "energy", "enum": ["energy"] },
                     { "title": "room", "enum": ["room"] },
                     { "title": "weather", "enum": ["weather"] },
                     { "title": "door", "enum": ["door"] },
                     { "title": "motion", "enum": ["motion"] },
                     { "title": "thermo", "enum": ["thermo"] },
                     { "title": "aqua", "enum": ["aqua"] }
                  ],
                  "required": true
               },
               "power": {
                  "type": "string",
                  "title": "power",
                  "description": "FakeGato Accessory Type.",
                  "default": "room",
                  "oneOf": [
                     { "title": "status", "enum": ["status"] },
                     { "title": "temp", "enum": ["temp"] },
                     { "title": "setTemp", "enum": ["setTemp"] },
                     { "title": "humidity", "enum": ["humidity"] },
                     { "title": "ppm", "enum": ["ppm"] },
                     { "title": "power", "enum": ["power"] },
                     { "title": "pressure", "enum": ["pressure"] },
                     { "title": "currentTemp", "enum": ["currentTemp"] },
                     { "title": "valvePosition", "enum": ["valvePosition"] }
                  ],
                  "required": true
               },
               "storage":
               {
                  "title": "storage",
                  "description": "The FakeGato Storage type for all accessories.",
                  "required": false,
                  "type": "string",
                  "oneOf":
                  [
                     { "title": "fs", "enum": ["fs"] },
                     { "title": "googleDrive", "enum": [ "googleDrive" ]}
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
               }
            }
         }
      },
      "properties":
      {
         "type": { "$ref": "#/$defs/type"},
         "debug": { "$ref": "#/$defs/debug"},
         "publishExternally": { "$ref": "#/$defs/publishExternally"},
         "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
         "outputConstants": { "$ref": "#/$defs/outputConstants"},
         "statusMsg": { "$ref": "#/$defs/statusMsg"},
         "interval": { "$ref": "#/$defs/interval"},
         "timeout": { "$ref": "#/$defs/timeout"},
         "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
         "accessControlLevel": { "$ref": "#/$defs/accessControlLevel"},
         "accessoryFlags": { "$ref": "#/$defs/accessoryFlags"},
         "accessoryIdentifier": { "$ref": "#/$defs/accessoryIdentifier"},
         "active": { "$ref": "#/$defs/active"},
         "activeIdentifier": { "$ref": "#/$defs/activeIdentifier"},
         "activityInterval": { "$ref": "#/$defs/activityInterval"},
         "administratorOnlyAccess": { "$ref": "#/$defs/administratorOnlyAccess"},
         "airParticulateDensity": { "$ref": "#/$defs/airParticulateDensity"},
         "airParticulateSize": { "$ref": "#/$defs/airParticulateSize"},
         "airQuality": { "$ref": "#/$defs/airQuality"},
         "appMatchingIdentifier": { "$ref": "#/$defs/appMatchingIdentifier"},
         "audioFeedback": { "$ref": "#/$defs/audioFeedback"},
         "batteryLevel": { "$ref": "#/$defs/batteryLevel"},
         "brightness": { "$ref": "#/$defs/brightness"},
         "buttonEvent": { "$ref": "#/$defs/buttonEvent"},
         "ccaEnergyDetectThreshold": { "$ref": "#/$defs/ccaEnergyDetectThreshold"},
         "ccaSignalDetectThreshold": { "$ref": "#/$defs/ccaSignalDetectThreshold"},
         "cameraOperatingModeIndicator": { "$ref": "#/$defs/cameraOperatingModeIndicator"},
         "carbonDioxideDetected": { "$ref": "#/$defs/carbonDioxideDetected"},
         "carbonDioxideLevel": { "$ref": "#/$defs/carbonDioxideLevel"},
         "carbonDioxidePeakLevel": { "$ref": "#/$defs/carbonDioxidePeakLevel"},
         "carbonMonoxideDetected": { "$ref": "#/$defs/carbonMonoxideDetected"},
         "carbonMonoxideLevel": { "$ref": "#/$defs/carbonMonoxideLevel"},
         "carbonMonoxidePeakLevel": { "$ref": "#/$defs/carbonMonoxidePeakLevel"},
         "category": { "$ref": "#/$defs/category"},
         "characteristicValueTransitionControl": { "$ref": "#/$defs/characteristicValueTransitionControl"},
         "chargingState": { "$ref": "#/$defs/chargingState"},
         "closedCaptions": { "$ref": "#/$defs/closedCaptions"},
         "colorTemperature": { "$ref": "#/$defs/colorTemperature"},
         "configureBridgedAccessory": { "$ref": "#/$defs/configureBridgedAccessory"},
         "configureBridgedAccessoryStatus": { "$ref": "#/$defs/configureBridgedAccessoryStatus"},
         "configuredName": { "$ref": "#/$defs/configuredName"},
         "contactSensorState": { "$ref": "#/$defs/contactSensorState"},
         "coolingThresholdTemperature": { "$ref": "#/$defs/coolingThresholdTemperature"},
         "currentAirPurifierState": { "$ref": "#/$defs/currentAirPurifierState"},
         "currentAmbientLightLevel": { "$ref": "#/$defs/currentAmbientLightLevel"},
         "currentDoorState": { "$ref": "#/$defs/currentDoorState"},
         "currentFanState": { "$ref": "#/$defs/currentFanState"},
         "currentHeaterCoolerState": { "$ref": "#/$defs/currentHeaterCoolerState"},
         "currentHeatingCoolingState": { "$ref": "#/$defs/currentHeatingCoolingState"},
         "currentHorizontalTiltAngle": { "$ref": "#/$defs/currentHorizontalTiltAngle"},
         "currentHumidifierDehumidifierState": { "$ref": "#/$defs/currentHumidifierDehumidifierState"},
         "currentMediaState": { "$ref": "#/$defs/currentMediaState"},
         "currentPosition": { "$ref": "#/$defs/currentPosition"},
         "currentRelativeHumidity": { "$ref": "#/$defs/currentRelativeHumidity"},
         "currentSlatState": { "$ref": "#/$defs/currentSlatState"},
         "currentTemperature": { "$ref": "#/$defs/currentTemperature"},
         "currentTiltAngle": { "$ref": "#/$defs/currentTiltAngle"},
         "currentTime": { "$ref": "#/$defs/currentTime"},
         "currentTransport": { "$ref": "#/$defs/currentTransport"},
         "currentVerticalTiltAngle": { "$ref": "#/$defs/currentVerticalTiltAngle"},
         "currentVisibilityState": { "$ref": "#/$defs/currentVisibilityState"},
         "dataStreamHAPTransport": { "$ref": "#/$defs/dataStreamHAPTransport"},
         "dataStreamHAPTransportInterrupt": { "$ref": "#/$defs/dataStreamHAPTransportInterrupt"},
         "dayoftheWeek": { "$ref": "#/$defs/dayoftheWeek"},
         "diagonalFieldOfView": { "$ref": "#/$defs/diagonalFieldOfView"},
         "digitalZoom": { "$ref": "#/$defs/digitalZoom"},
         "discoverBridgedAccessories": { "$ref": "#/$defs/discoverBridgedAccessories"},
         "discoveredBridgedAccessories": { "$ref": "#/$defs/discoveredBridgedAccessories"},
         "displayOrder": { "$ref": "#/$defs/displayOrder"},
         "eventRetransmissionMaximum": { "$ref": "#/$defs/eventRetransmissionMaximum"},
         "eventSnapshotsActive": { "$ref": "#/$defs/eventSnapshotsActive"},
         "eventTransmissionCounters": { "$ref": "#/$defs/eventTransmissionCounters"},
         "filterChangeIndication": { "$ref": "#/$defs/filterChangeIndication"},
         "filterLifeLevel": { "$ref": "#/$defs/filterLifeLevel"},
         "firmwareRevision": { "$ref": "#/$defs/firmwareRevision"},
         "hardwareRevision": { "$ref": "#/$defs/hardwareRevision"},
         "heartBeat": { "$ref": "#/$defs/heartBeat"},
         "heatingThresholdTemperature": { "$ref": "#/$defs/heatingThresholdTemperature"},
         "holdPosition": { "$ref": "#/$defs/holdPosition"},
         "homeKitCameraActive": { "$ref": "#/$defs/homeKitCameraActive"},
         "hue": { "$ref": "#/$defs/hue"},
         "identifier": { "$ref": "#/$defs/identifier"},
         "identify": { "$ref": "#/$defs/identify"},
         "imageMirroring": { "$ref": "#/$defs/imageMirroring"},
         "imageRotation": { "$ref": "#/$defs/imageRotation"},
         "inUse": { "$ref": "#/$defs/inUse"},
         "inputDeviceType": { "$ref": "#/$defs/inputDeviceType"},
         "inputSourceType": { "$ref": "#/$defs/inputSourceType"},
         "isConfigured": { "$ref": "#/$defs/isConfigured"},
         "leakDetected": { "$ref": "#/$defs/leakDetected"},
         "linkQuality": { "$ref": "#/$defs/linkQuality"},
         "listPairings": { "$ref": "#/$defs/listPairings"},
         "lockControlPoint": { "$ref": "#/$defs/lockControlPoint"},
         "lockCurrentState": { "$ref": "#/$defs/lockCurrentState"},
         "lockLastKnownAction": { "$ref": "#/$defs/lockLastKnownAction"},
         "lockManagementAutoSecurityTimeout": { "$ref": "#/$defs/lockManagementAutoSecurityTimeout"},
         "lockPhysicalControls": { "$ref": "#/$defs/lockPhysicalControls"},
         "lockTargetState": { "$ref": "#/$defs/lockTargetState"},
         "logs": { "$ref": "#/$defs/logs"},
         "macRetransmissionMaximum": { "$ref": "#/$defs/macRetransmissionMaximum"},
         "macTransmissionCounters": { "$ref": "#/$defs/macTransmissionCounters"},
         "managedNetworkEnable": { "$ref": "#/$defs/managedNetworkEnable"},
         "manuallyDisabled": { "$ref": "#/$defs/manuallyDisabled"},
         "manufacturer": { "$ref": "#/$defs/manufacturer"},
         "model": { "$ref": "#/$defs/model"},
         "motionDetected": { "$ref": "#/$defs/motionDetected"},
         "mute": { "$ref": "#/$defs/mute"},
         "name": { "$ref": "#/$defs/name"},
         "networkAccessViolationControl": { "$ref": "#/$defs/networkAccessViolationControl"},
         "networkClientProfileControl": { "$ref": "#/$defs/networkClientProfileControl"},
         "networkClientStatusControl": { "$ref": "#/$defs/networkClientStatusControl"},
         "nightVision": { "$ref": "#/$defs/nightVision"},
         "nitrogenDioxideDensity": { "$ref": "#/$defs/nitrogenDioxideDensity"},
         "obstructionDetected": { "$ref": "#/$defs/obstructionDetected"},
         "occupancyDetected": { "$ref": "#/$defs/occupancyDetected"},
         "on": { "$ref": "#/$defs/on"},
         "operatingStateResponse": { "$ref": "#/$defs/operatingStateResponse"},
         "opticalZoom": { "$ref": "#/$defs/opticalZoom"},
         "outletInUse": { "$ref": "#/$defs/outletInUse"},
         "ozoneDensity": { "$ref": "#/$defs/ozoneDensity"},
         "pm10Density": { "$ref": "#/$defs/pm10Density"},
         "pm2_5Density": { "$ref": "#/$defs/pm2_5Density"},
         "pairSetup": { "$ref": "#/$defs/pairSetup"},
         "pairVerify": { "$ref": "#/$defs/pairVerify"},
         "pairingFeatures": { "$ref": "#/$defs/pairingFeatures"},
         "pairingPairings": { "$ref": "#/$defs/pairingPairings"},
         "passwordSetting": { "$ref": "#/$defs/passwordSetting"},
         "periodicSnapshotsActive": { "$ref": "#/$defs/periodicSnapshotsActive"},
         "pictureMode": { "$ref": "#/$defs/pictureMode"},
         "ping": { "$ref": "#/$defs/ping"},
         "positionState": { "$ref": "#/$defs/positionState"},
         "powerModeSelection": { "$ref": "#/$defs/powerModeSelection"},
         "productData": { "$ref": "#/$defs/productData"},
         "programMode": { "$ref": "#/$defs/programMode"},
         "programmableSwitchEvent": { "$ref": "#/$defs/programmableSwitchEvent"},
         "programmableSwitchOutputState": { "$ref": "#/$defs/programmableSwitchOutputState"},
         "reachable": { "$ref": "#/$defs/reachable"},
         "receivedSignalStrengthIndication": { "$ref": "#/$defs/receivedSignalStrengthIndication"},
         "receiverSensitivity": { "$ref": "#/$defs/receiverSensitivity"},
         "recordingAudioActive": { "$ref": "#/$defs/recordingAudioActive"},
         "relativeHumidityDehumidifierThreshold": { "$ref": "#/$defs/relativeHumidityDehumidifierThreshold"},
         "relativeHumidityHumidifierThreshold": { "$ref": "#/$defs/relativeHumidityHumidifierThreshold"},
         "relayControlPoint": { "$ref": "#/$defs/relayControlPoint"},
         "relayEnabled": { "$ref": "#/$defs/relayEnabled"},
         "relayState": { "$ref": "#/$defs/relayState"},
         "remainingDuration": { "$ref": "#/$defs/remainingDuration"},
         "remoteKey": { "$ref": "#/$defs/remoteKey"},
         "resetFilterIndication": { "$ref": "#/$defs/resetFilterIndication"},
         "rotationDirection": { "$ref": "#/$defs/rotationDirection"},
         "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
         "routerStatus": { "$ref": "#/$defs/routerStatus"},
         "saturation": { "$ref": "#/$defs/saturation"},
         "securitySystemAlarmType": { "$ref": "#/$defs/securitySystemAlarmType"},
         "securitySystemCurrentState": { "$ref": "#/$defs/securitySystemCurrentState"},
         "securitySystemTargetState": { "$ref": "#/$defs/securitySystemTargetState"},
         "selectedAudioStreamConfiguration": { "$ref": "#/$defs/selectedAudioStreamConfiguration"},
         "selectedCameraRecordingConfiguration": { "$ref": "#/$defs/selectedCameraRecordingConfiguration"},
         "selectedRTPStreamConfiguration": { "$ref": "#/$defs/selectedRTPStreamConfiguration"},
         "serialNumber": { "$ref": "#/$defs/serialNumber"},
         "serviceLabelIndex": { "$ref": "#/$defs/serviceLabelIndex"},
         "serviceLabelNamespace": { "$ref": "#/$defs/serviceLabelNamespace"},
         "setDuration": { "$ref": "#/$defs/setDuration"},
         "setupDataStreamTransport": { "$ref": "#/$defs/setupDataStreamTransport"},
         "setupEndpoints": { "$ref": "#/$defs/setupEndpoints"},
         "setupTransferTransport": { "$ref": "#/$defs/setupTransferTransport"},
         "signalToNoiseRatio": { "$ref": "#/$defs/signalToNoiseRatio"},
         "siriInputType": { "$ref": "#/$defs/siriInputType"},
         "slatType": { "$ref": "#/$defs/slatType"},
         "sleepDiscoveryMode": { "$ref": "#/$defs/sleepDiscoveryMode"},
         "sleepInterval": { "$ref": "#/$defs/sleepInterval"},
         "smokeDetected": { "$ref": "#/$defs/smokeDetected"},
         "softwareRevision": { "$ref": "#/$defs/softwareRevision"},
         "statusActive": { "$ref": "#/$defs/statusActive"},
         "statusFault": { "$ref": "#/$defs/statusFault"},
         "statusJammed": { "$ref": "#/$defs/statusJammed"},
         "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
         "statusTampered": { "$ref": "#/$defs/statusTampered"},
         "streamingStatus": { "$ref": "#/$defs/streamingStatus"},
         "sulphurDioxideDensity": { "$ref": "#/$defs/sulphurDioxideDensity"},
         "supportedAudioRecordingConfiguration": { "$ref": "#/$defs/supportedAudioRecordingConfiguration"},
         "supportedAudioStreamConfiguration": { "$ref": "#/$defs/supportedAudioStreamConfiguration"},
         "supportedCameraRecordingConfiguration": { "$ref": "#/$defs/supportedCameraRecordingConfiguration"},
         "supportedDataStreamTransportConfiguration": { "$ref": "#/$defs/supportedDataStreamTransportConfiguration"},
         "supportedCharacteristicValueTransitionConfiguration": { "$ref": "#/$defs/supportedCharacteristicValueTransitionConfiguration"},
         "supportedDiagnosticsSnapshot": { "$ref": "#/$defs/supportedDiagnosticsSnapshot"},
         "supportedRTPConfiguration": { "$ref": "#/$defs/supportedRTPConfiguration"},
         "supportedRouterConfiguration": { "$ref": "#/$defs/supportedRouterConfiguration"},
         "supportedTransferTransportConfiguration": { "$ref": "#/$defs/supportedTransferTransportConfiguration"},
         "supportedVideoRecordingConfiguration": { "$ref": "#/$defs/supportedVideoRecordingConfiguration"},
         "supportedVideoStreamConfiguration": { "$ref": "#/$defs/supportedVideoStreamConfiguration"},
         "swingMode": { "$ref": "#/$defs/swingMode"},
         "targetAirPurifierState": { "$ref": "#/$defs/targetAirPurifierState"},
         "targetAirQuality": { "$ref": "#/$defs/targetAirQuality"},
         "targetControlList": { "$ref": "#/$defs/targetControlList"},
         "targetControlSupportedConfiguration": { "$ref": "#/$defs/targetControlSupportedConfiguration"},
         "targetDoorState": { "$ref": "#/$defs/targetDoorState"},
         "targetFanState": { "$ref": "#/$defs/targetFanState"},
         "targetHeaterCoolerState": { "$ref": "#/$defs/targetHeaterCoolerState"},
         "targetHeatingCoolingState": { "$ref": "#/$defs/targetHeatingCoolingState"},
         "targetHorizontalTiltAngle": { "$ref": "#/$defs/targetHorizontalTiltAngle"},
         "targetHumidifierDehumidifierState": { "$ref": "#/$defs/targetHumidifierDehumidifierState"},
         "targetMediaState": { "$ref": "#/$defs/targetMediaState"},
         "targetPosition": { "$ref": "#/$defs/targetPosition"},
         "targetRelativeHumidity": { "$ref": "#/$defs/targetRelativeHumidity"},
         "targetSlatState": { "$ref": "#/$defs/targetSlatState"},
         "targetTemperature": { "$ref": "#/$defs/targetTemperature"},
         "targetTiltAngle": { "$ref": "#/$defs/targetTiltAngle"},
         "targetVerticalTiltAngle": { "$ref": "#/$defs/targetVerticalTiltAngle"},
         "targetVisibilityState": { "$ref": "#/$defs/targetVisibilityState"},
         "temperatureDisplayUnits": { "$ref": "#/$defs/temperatureDisplayUnits"},
         "thirdPartyCameraActive": { "$ref": "#/$defs/thirdPartyCameraActive"},
         "timeUpdate": { "$ref": "#/$defs/timeUpdate"},
         "transmitPower": { "$ref": "#/$defs/transmitPower"},
         "transmitPowerMaximum": { "$ref": "#/$defs/transmitPowerMaximum"},
         "tunnelConnectionTimeout": { "$ref": "#/$defs/tunnelConnectionTimeout"},
         "tunneledAccessoryAdvertising": { "$ref": "#/$defs/tunneledAccessoryAdvertising"},
         "tunneledAccessoryConnected": { "$ref": "#/$defs/tunneledAccessoryConnected"},
         "tunneledAccessoryStateNumber": { "$ref": "#/$defs/tunneledAccessoryStateNumber"},
         "vocDensity": { "$ref": "#/$defs/vocDensity"},
         "valveType": { "$ref": "#/$defs/valveType"},
         "version": { "$ref": "#/$defs/version"},
         "videoAnalysisActive": { "$ref": "#/$defs/videoAnalysisActive"},
         "volume": { "$ref": "#/$defs/volume"},
         "volumeControlType": { "$ref": "#/$defs/volumeControlType"},
         "volumeSelector": { "$ref": "#/$defs/volumeSelector"},
         "wanConfigurationList": { "$ref": "#/$defs/wanConfigurationList"},
         "wanStatusList": { "$ref": "#/$defs/wanStatusList"},
         "wakeConfiguration": { "$ref": "#/$defs/wakeConfiguration"},
         "waterLevel": { "$ref": "#/$defs/waterLevel"},
         "wifiCapabilities": { "$ref": "#/$defs/wifiCapabilities"},
         "wifiConfigurationControl": { "$ref": "#/$defs/wifiConfigurationControl"},
         "wifiSatelliteStatus": { "$ref": "#/$defs/wifiSatelliteStatus"},
         "queue": { "$ref": "#/$defs/queue"},
         "pollingSwitch": { "$ref": "#/$defs/pollingSwitch"},
         "polling": { "$ref": "#/$defs/polling"},
         "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
         "state_cmd": { "$ref": "#/$defs/state_cmd"},
         "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
         "fakegato": { "$ref": "#/$defs/fakegato"}
      }
   },
   "layout":
   [
      {
         "key": "type",
         "$ref": "#/$defs/type"
      },
      {
         "key": "name",
         "condition":
         {
            "functionBody": "return model.type && model.type !== 'null';"
         }
      },
      {
         "title": "Accessory Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            "debug",
            "publishExternally",
            "statusMsg",
            "allowTLV8",
            "outputConstants",
            "timeout",
            "stateChangeResponseTime",
            "interval"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessControl Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['AccessControl'].includes(model.type);"
         },
         "items":
         [
            "accessControlLevel",
            "passwordSetting"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryRuntimeInformation Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
         },
         "items":
         [
            "ping",
            "activityInterval",
            "heartBeat",
            "sleepInterval"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryInformation Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['AccessoryInformation'].includes(model.type);"
         },
         "items":
         [
            "identify",
            "hardwareRevision",
            "accessoryFlags"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirPurifier Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['AirPurifier'].includes(model.type);"
         },
         "items":
         [
            "active",
            "lockPhysicalControls",
            "name",
            "swingMode",
            "rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirQualitySensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['AirQualitySensor'].includes(model.type);"
         },
         "items":
         [
            "airQuality",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name",
            "ozoneDensity",
            "nitrogenDioxideDensity",
            "sulphurDioxideDensity",
            "pm2_5Density",
            "pm10Density",
            "vocDensity",
            "carbonMonoxideLevel",
            "carbonDioxideLevel"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BatteryService Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['BatteryService'].includes(model.type);"
         },
         "items":
         [
            "batteryLevel",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BridgeConfiguration Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
         },
         "items":
         [
            "configureBridgedAccessoryStatus"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BridgingState Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['BridgingState'].includes(model.type);"
         },
         "items":
         [
            "reachable",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraEventRecordingManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type);"
         },
         "items":
         [
            "active",
            "recordingAudioActive"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraControl Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CameraControl'].includes(model.type);"
         },
         "items":
         [
            "on",
            "currentHorizontalTiltAngle",
            "currentVerticalTiltAngle",
            "targetHorizontalTiltAngle",
            "targetVerticalTiltAngle",
            "nightVision",
            "opticalZoom",
            "digitalZoom",
            "imageRotation",
            "imageMirroring",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraRTPStreamManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type);"
         },
         "items":
         [
            "supportedVideoStreamConfiguration",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraOperatingMode Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
         },
         "items":
         [
            "eventSnapshotsActive",
            "manuallyDisabled",
            "nightVision",
            "thirdPartyCameraActive",
            "cameraOperatingModeIndicator",
            "periodicSnapshotsActive"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonDioxideSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
         },
         "items":
         [
            "carbonDioxideDetected",
            "statusActive",
            "statusFault",
            "statusLowBattery",
            "statusTampered",
            "carbonDioxideLevel",
            "carbonDioxidePeakLevel",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonMonoxideSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
         },
         "items":
         [
            "carbonMonoxideDetected",
            "statusActive",
            "statusFault",
            "statusLowBattery",
            "statusTampered",
            "carbonMonoxideLevel",
            "carbonMonoxidePeakLevel",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ContactSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['ContactSensor'].includes(model.type);"
         },
         "items":
         [
            "contactSensorState",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Diagnostics Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Diagnostics'].includes(model.type);"
         },
         "items":
         [
            "supportedDiagnosticsSnapshot"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Door Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Door'].includes(model.type);"
         },
         "items":
         [
            "currentPosition",
            "holdPosition",
            "obstructionDetected",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "DoorBell Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['DoorBell'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent",
            "brightness",
            "volume",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fan Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Fan'].includes(model.type);"
         },
         "items":
         [
            "on",
            "rotationDirection",
            "rotationSpeed",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv1 Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Fanv1'].includes(model.type);"
         },
         "items":
         [
            "on",
            "rotationDirection",
            "rotationSpeed",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv2 Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Fanv2'].includes(model.type);"
         },
         "items":
         [
            "active",
            "currentFanState",
            "targetFanState",
            "lockPhysicalControls",
            "name",
            "rotationDirection",
            "rotationSpeed",
            "swingMode"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Faucet Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Faucet'].includes(model.type);"
         },
         "items":
         [
            "active",
            "name",
            "statusFault"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "FilterMaintenance Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['FilterMaintenance'].includes(model.type);"
         },
         "items":
         [
            "filterChangeIndication",
            "filterLifeLevel",
            "resetFilterIndication",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "GarageDoorOpener Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
         },
         "items":
         [
            "currentDoorState",
            "lockCurrentState",
            "lockTargetState",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HeaterCooler Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['HeaterCooler'].includes(model.type);"
         },
         "items":
         [
            "active",
            "lockPhysicalControls",
            "name",
            "swingMode",
            "coolingThresholdTemperature",
            "heatingThresholdTemperature",
            "temperatureDisplayUnits",
            "rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumidifierDehumidifier Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
         },
         "items":
         [
            "currentRelativeHumidity",
            "lockPhysicalControls",
            "name",
            "swingMode",
            "waterLevel",
            "relativeHumidityDehumidifierThreshold",
            "relativeHumidityHumidifierThreshold",
            "rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumiditySensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['HumiditySensor'].includes(model.type);"
         },
         "items":
         [
            "currentRelativeHumidity",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "InputSource Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['InputSource'].includes(model.type);"
         },
         "items":
         [
            "configuredName",
            "identifier",
            "inputDeviceType",
            "targetVisibilityState",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "IrrigationSystem Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['IrrigationSystem'].includes(model.type);"
         },
         "items":
         [
            "active",
            "name",
            "remainingDuration",
            "statusFault"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LeakSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['LeakSensor'].includes(model.type);"
         },
         "items":
         [
            "leakDetected",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LightSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['LightSensor'].includes(model.type);"
         },
         "items":
         [
            "currentAmbientLightLevel",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Lightbulb Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Lightbulb'].includes(model.type);"
         },
         "items":
         [
            "on",
            "brightness",
            "hue",
            "saturation",
            "name",
            "colorTemperature"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['LockManagement'].includes(model.type);"
         },
         "items":
         [
            "lockControlPoint",
            "logs",
            "audioFeedback",
            "lockManagementAutoSecurityTimeout",
            "administratorOnlyAccess",
            "lockLastKnownAction",
            "currentDoorState",
            "motionDetected",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockMechanism Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['LockMechanism'].includes(model.type);"
         },
         "items":
         [
            "lockCurrentState",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Microphone Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Microphone'].includes(model.type);"
         },
         "items":
         [
            "mute",
            "volume",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "MotionSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['MotionSensor'].includes(model.type);"
         },
         "items":
         [
            "motionDetected",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "OccupancySensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['OccupancySensor'].includes(model.type);"
         },
         "items":
         [
            "occupancyDetected",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Outlet Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Outlet'].includes(model.type);"
         },
         "items":
         [
            "on",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Pairing Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Pairing'].includes(model.type);"
         },
         "items":
         [
            "listPairings"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "PowerManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['PowerManagement'].includes(model.type);"
         },
         "items":
         [
            "wakeConfiguration"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ProtocolInformation Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['ProtocolInformation'].includes(model.type);"
         },
         "items":
         [
            "version"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Relay Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Relay'].includes(model.type);"
         },
         "items":
         [
            "relayEnabled"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SecuritySystem Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['SecuritySystem'].includes(model.type);"
         },
         "items":
         [
            "securitySystemCurrentState",
            "statusFault",
            "statusTampered",
            "securitySystemAlarmType",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ServiceLabel Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['ServiceLabel'].includes(model.type);"
         },
         "items":
         [
            "serviceLabelNamespace",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Siri Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Siri'].includes(model.type);"
         },
         "items":
         [
            "siriInputType"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Slat Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Slat'].includes(model.type);"
         },
         "items":
         [
            "slatType",
            "name",
            "currentTiltAngle",
            "targetTiltAngle",
            "swingMode"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmartSpeaker Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['SmartSpeaker'].includes(model.type);"
         },
         "items":
         [
            "currentMediaState",
            "name",
            "configuredName",
            "volume",
            "mute"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmokeSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['SmokeSensor'].includes(model.type);"
         },
         "items":
         [
            "smokeDetected",
            "statusActive",
            "statusFault",
            "statusTampered",
            "statusLowBattery",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Speaker Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Speaker'].includes(model.type);"
         },
         "items":
         [
            "mute",
            "volume",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatefulProgrammableSwitch Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatelessProgrammableSwitch Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['StatelessProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent",
            "name",
            "serviceLabelIndex"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Switch Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Switch'].includes(model.type);"
         },
         "items":
         [
            "on",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TargetControl Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TargetControl'].includes(model.type);"
         },
         "items":
         [
            "activeIdentifier",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TargetControlManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TargetControlManagement'].includes(model.type);"
         },
         "items":
         [
            "targetControlSupportedConfiguration"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Television Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Television'].includes(model.type);"
         },
         "items":
         [
            "active",
            "brightness",
            "closedCaptions",
            "displayOrder",
            "currentMediaState",
            "targetMediaState",
            "pictureMode",
            "powerModeSelection"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TelevisionSpeaker Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TelevisionSpeaker'].includes(model.type);"
         },
         "items":
         [
            "mute",
            "active",
            "volume",
            "volumeControlType",
            "volumeSelector",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TemperatureSensor Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TemperatureSensor'].includes(model.type);"
         },
         "items":
         [
            "currentTemperature",
            "statusActive",
            "statusFault",
            "statusLowBattery",
            "statusTampered",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Thermostat Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Thermostat'].includes(model.type);"
         },
         "items":
         [
            "currentHeatingCoolingState",
            "currentRelativeHumidity",
            "targetRelativeHumidity",
            "coolingThresholdTemperature",
            "heatingThresholdTemperature",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TimeInformation Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TimeInformation'].includes(model.type);"
         },
         "items":
         [
            "currentTime",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TransferTransportManagement Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TransferTransportManagement'].includes(model.type);"
         },
         "items":
         [
            "supportedTransferTransportConfiguration"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TunneledBTLEAccessoryService Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Valve Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Valve'].includes(model.type);"
         },
         "items":
         [
            "active",
            "setDuration",
            "remainingDuration",
            "isConfigured",
            "serviceLabelIndex",
            "statusFault",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WiFiRouter Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['WiFiRouter'].includes(model.type);"
         },
         "items":
         [
            "configuredName"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WiFiSatellite Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['WiFiSatellite'].includes(model.type);"
         },
         "items":
         [
            "wifiSatelliteStatus"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Window Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['Window'].includes(model.type);"
         },
         "items":
         [
            "currentPosition",
            "holdPosition",
            "obstructionDetected",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WindowCovering Characteristics (Initial Values)",
         "condition":
         {
            "functionBody": "return ['WindowCovering'].includes(model.type);"
         },
         "items":
         [
            "currentPosition",
            "holdPosition",
            "targetHorizontalTiltAngle",
            "targetVerticalTiltAngle",
            "currentHorizontalTiltAngle",
            "currentVerticalTiltAngle",
            "obstructionDetected",
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Polling",
         "items": [
            {
               "title": "Polling",
               "key": "pollingSwitch",
               "$ref": "#/$defs/pollingSwitch"
            }]
      },
      {
         "title": "Custom Polling",
         "type": "fieldset",
         "condition":
         {
            "functionBody": "return model.pollingSwitch && model.pollingSwitch == true;"
         },
         "expandable": true,
         "items": [ {
            "key": "polling",
            "$ref": "#/$defs/polling",
            "type": "array",
            "uniqueItems": true,
            "listItems": "3",
            "items": [ {
               "type": "div",
               "displayFlex": true,
               "flex-direction": "row",
               "items": [
                  {
                     "key": "polling[].characteristic", "flex": "3 3 auto",
                     "notitle": false, "placeholder": "a characteristic"
                  },
                  {
                     "key": "polling[].timeout", "flex": "1 1 auto",
                     "notitle": false, "placeholder": "3000"
                  },
                  {
                     "key": "polling[].interval", "flex": "1 1 auto",
                     "notitle": false, "placeholder": "180"
                  },
                  {
                     "key": "polling[].stateChangeResponseTime", "flex": "2 2 auto",
                     "notitle": false, "placeholder": "5000"
                  }
               ]
            } ]
         } ]
      },
      {
         "title": "state_cmd Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            "state_cmd_prefix",
            "state_cmd",
            "state_cmd_suffix"
         ]
      },
      {
         "title": "FakeGato Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            {
               "key": "fakegato.storage", "flex": "1 1 50px",
               "notitle": false, "placeholder": "fs"
            },
            {
               "key": "fakegato.storagePath", "flex": "1 1 50px",
               "notitle": false
            },
            {
               "key": "fakegato.folder", "flex": "1 1 50px",
               "notitle": false
            },
            {
               "key": "fakegato.keyPath", "flex": "1 1 50px",
               "notitle": false
            }
         ]
      }]
}