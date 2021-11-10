/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "accessorySchema" }]*/

const accessorySchema =
{
   "schema":
   {
      "$definitions":
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
         "storage":
         {
            "title": "storage",
            "description": "The FakeGato Storage type for all accessories.",
            "required": false,
            "type": "string",
            "oneOf":
            [
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
         "accessControlLevel":
         {
            "$id": "#accessControlLevel",
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
            "$id": "#accessoryFlags",
            "title": "accessoryFlags",
            "type": "integer",
            "description": "The Devices Accessory Flags"
         },
         "accessoryIdentifier":
         {
            "$id": "#accessoryIdentifier",
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
            "$id": "#active",
            "title": "active",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device is ACTIVE/INACTIVE",
            "condition":
            {
               "functionBody": "return ['AirPurifier','CameraEventRecordingManagement','Fanv2','Faucet','HeaterCooler','HumidifierDehumidifier','IrrigationSystem','TargetControl','Television','Valve'].includes(model.type);"
            }
         },
         "activeIdentifier":
         {
            "$id": "#activeIdentifier",
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
            "$id": "#activityInterval",
            "title": "activityInterval",
            "type": "integer",
            "minimum": 0,
            "description": "The Devices Activity Interval"
         },
         "administratorOnlyAccess":
         {
            "$id": "#administratorOnlyAccess",
            "title": "administratorOnlyAccess",
            "type": "boolean",
            "description": "If the Device has 2cwAdmin Only Access"
         },
         "airParticulateDensity":
         {
            "$id": "#airParticulateDensity",
            "title": "airParticulateDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Measured Air Particulate Density"
         },
         "airParticulateSize":
         {
            "$id": "#airParticulateSize",
            "title": "airParticulateSize",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Measured Air Particulate Size"
         },
         "airQuality":
         {
            "$id": "#airQuality",
            "title": "airQuality",
            "type": "integer",
            "minimum": 0,
            "maximum": 5,
            "description": "The Current Air Quality",
            "condition":
            {
               "functionBody": "return ['AirQualitySensor'].includes(model.type);"
            }
         },
         "appMatchingIdentifier":
         {
            "$id": "#appMatchingIdentifier",
            "title": "appMatchingIdentifier",
            "type": "string",
            "description": "The Devices App Matching Identifier"
         },
         "audioFeedback":
         {
            "$id": "#audioFeedback",
            "title": "audioFeedback",
            "type": "boolean",
            "description": "If Audio Feedback is Present"
         },
         "batteryLevel":
         {
            "$id": "#batteryLevel",
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
            "$id": "#brightness",
            "title": "brightness",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Percentage of Existing Brightness"
         },
         "buttonEvent":
         {
            "$id": "#buttonEvent",
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
            "$id": "#ccaEnergyDetectThreshold",
            "title": "ccaEnergyDetectThreshold",
            "type": "integer",
            "description": "The Devices CCA Energy Detect Threshold"
         },
         "ccaSignalDetectThreshold":
         {
            "$id": "#ccaSignalDetectThreshold",
            "title": "ccaSignalDetectThreshold",
            "type": "integer",
            "description": "The Devices Signal Detect Threshold"
         },
         "cameraOperatingModeIndicator":
         {
            "$id": "#cameraOperatingModeIndicator",
            "title": "cameraOperatingModeIndicator",
            "type": "boolean",
            "description": "The State of the Camera's Operating Mode Indicator"
         },
         "carbonDioxideDetected":
         {
            "$id": "#carbonDioxideDetected",
            "title": "carbonDioxideDetected",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If Carbon Dioxide has been Detected",
            "condition":
            {
               "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
            }
         },
         "carbonDioxideLevel":
         {
            "$id": "#carbonDioxideLevel",
            "title": "carbonDioxideLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100000,
            "description": "The Amount of CO2 Detected"
         },
         "carbonDioxidePeakLevel":
         {
            "$id": "#carbonDioxidePeakLevel",
            "title": "carbonDioxidePeakLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100000,
            "description": "The Maximum Amount of CO2 Detected"
         },
         "carbonMonoxideDetected":
         {
            "$id": "#carbonMonoxideDetected",
            "title": "carbonMonoxideDetected",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Indication of CO Detected",
            "condition":
            {
               "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
            }
         },
         "carbonMonoxideLevel":
         {
            "$id": "#carbonMonoxideLevel",
            "title": "carbonMonoxideLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Amount of CO Detected"
         },
         "carbonMonoxidePeakLevel":
         {
            "$id": "#carbonMonoxidePeakLevel",
            "title": "carbonMonoxidePeakLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Maximum Amount of CO Detected"
         },
         "category":
         {
            "$id": "#category",
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
            "$id": "#characteristicValueTransitionControl",
            "title": "characteristicValueTransitionControl",
            "type": "string",
            "description": "The Devices Characteristic Value Transition Control"
         },
         "chargingState":
         {
            "$id": "#chargingState",
            "title": "chargingState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Current Charging State",
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            }
         },
         "closedCaptions":
         {
            "$id": "#closedCaptions",
            "title": "closedCaptions",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If Closed Captioning is Enabled"
         },
         "colorTemperature":
         {
            "$id": "#colorTemperature",
            "title": "colorTemperature",
            "type": "integer",
            "minimum": 140,
            "maximum": 500,
            "description": "The Colors Current Temperature"
         },
         "configureBridgedAccessory":
         {
            "$id": "#configureBridgedAccessory",
            "title": "configureBridgedAccessory",
            "type": "string",
            "description": "The Configured Bridge Accessory"
         },
         "configureBridgedAccessoryStatus":
         {
            "$id": "#configureBridgedAccessoryStatus",
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
            "$id": "#configuredName",
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
            "$id": "#contactSensorState",
            "title": "contactSensorState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Current RState of a Contact Sensor",
            "condition":
            {
               "functionBody": "return ['ContactSensor'].includes(model.type);"
            }
         },
         "coolingThresholdTemperature":
         {
            "$id": "#coolingThresholdTemperature",
            "title": "coolingThresholdTemperature",
            "type": "number",
            "minimum": 10,
            "maximum": 35,
            "description": "The Current Cooling Threshold Temperature"
         },
         "currentAirPurifierState":
         {
            "$id": "#currentAirPurifierState",
            "title": "currentAirPurifierState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Current Target Air Purification State",
            "condition":
            {
               "functionBody": "return ['AirPurifier'].includes(model.type);"
            }
         },
         "currentAmbientLightLevel":
         {
            "$id": "#currentAmbientLightLevel",
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
            "$id": "#currentDoorState",
            "title": "currentDoorState",
            "type": "integer",
            "minimum": 0,
            "maximum": 4,
            "description": "The Doors Current Operating State",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "currentFanState":
         {
            "$id": "#currentFanState",
            "title": "currentFanState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Fans Current Operating State"
         },
         "currentHeaterCoolerState":
         {
            "$id": "#currentHeaterCoolerState",
            "title": "currentHeaterCoolerState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Heater/Coolers  Current Operating State",
            "condition":
            {
               "functionBody": "return ['HeaterCooler'].includes(model.type);"
            }
         },
         "currentHeatingCoolingState":
         {
            "$id": "#currentHeatingCoolingState",
            "title": "currentHeatingCoolingState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Current Mode of the Heating/Cooling Device",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "currentHorizontalTiltAngle":
         {
            "$id": "#currentHorizontalTiltAngle",
            "title": "currentHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Current Horizontal Tilt Angle"
         },
         "currentHumidifierDehumidifierState":
         {
            "$id": "#currentHumidifierDehumidifierState",
            "title": "currentHumidifierDehumidifierState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Humidifier or Dehumidifier Current State",
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
            }
         },
         "currentMediaState":
         {
            "$id": "#currentMediaState",
            "title": "currentMediaState",
            "type": "integer",
            "minimum": 0,
            "maximum": 5,
            "description": "The Medias Current State",
            "condition":
            {
               "functionBody": "return ['SmartSpeaker'].includes(model.type);"
            }
         },
         "currentPosition":
         {
            "$id": "#currentPosition",
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
            "$id": "#currentRelativeHumidity",
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
            "$id": "#currentSlatState",
            "title": "currentSlatState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Slats Current State",
            "condition":
            {
               "functionBody": "return ['Slat'].includes(model.type);"
            }
         },
         "currentTemperature":
         {
            "$id": "#currentTemperature",
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
            "$id": "#currentTiltAngle",
            "title": "currentTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Current Measured Tilt Angle"
         },
         "currentTime":
         {
            "$id": "#currentTime",
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
            "$id": "#currentTransport",
            "title": "currentTransport",
            "type": "boolean",
            "description": "The Devices Current Transport"
         },
         "currentVerticalTiltAngle":
         {
            "$id": "#currentVerticalTiltAngle",
            "title": "currentVerticalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "TheMeasured Current Vertical Tilt Angle"
         },
         "currentVisibilityState":
         {
            "$id": "#currentVisibilityState",
            "title": "currentVisibilityState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is a Device Currently Being Shown or Hidden",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "dataStreamHAPTransport":
         {
            "$id": "#dataStreamHAPTransport",
            "title": "dataStreamHAPTransport",
            "type": "string",
            "description": "The Devices Data Stream Transport"
         },
         "dataStreamHAPTransportInterrupt":
         {
            "$id": "#dataStreamHAPTransportInterrupt",
            "title": "dataStreamHAPTransportInterrupt",
            "type": "string",
            "description": "The Devices Data Stream Transport Interrupt"
         },
         "dayoftheWeek":
         {
            "$id": "#dayoftheWeek",
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
            "$id": "#diagonalFieldOfView",
            "title": "diagonalFieldOfView",
            "type": "number",
            "minimum": 0,
            "maximum": 360,
            "description": "The Measured Diagonal Field of View"
         },
         "digitalZoom":
         {
            "$id": "#digitalZoom",
            "title": "digitalZoom",
            "type": "number",
            "description": "The Measured Digital Zoom"
         },
         "discoverBridgedAccessories":
         {
            "$id": "#discoverBridgedAccessories",
            "title": "discoverBridgedAccessories",
            "type": "integer",
            "description": "The Discovered Bridge Accessories"
         },
         "discoveredBridgedAccessories":
         {
            "$id": "#discoveredBridgedAccessories",
            "title": "discoveredBridgedAccessories",
            "type": "integer",
            "description": "The Discovered Bridged Accessories"
         },
         "displayOrder":
         {
            "$id": "#displayOrder",
            "title": "displayOrder",
            "type": "string",
            "description": "The Display Order"
         },
         "eventRetransmissionMaximum":
         {
            "$id": "#eventRetransmissionMaximum",
            "title": "eventRetransmissionMaximum",
            "type": "integer",
            "description": "The Event Retransmission Maximum Amount"
         },
         "eventSnapshotsActive":
         {
            "$id": "#eventSnapshotsActive",
            "title": "eventSnapshotsActive",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the Event Snapshot Enabled",
            "condition":
            {
               "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
            }
         },
         "eventTransmissionCounters":
         {
            "$id": "#eventTransmissionCounters",
            "title": "eventTransmissionCounters",
            "type": "integer",
            "description": "The Event Transmission Counters"
         },
         "filterChangeIndication":
         {
            "$id": "#filterChangeIndication",
            "title": "filterChangeIndication",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "An Filters Current Quality",
            "condition":
            {
               "functionBody": "return ['FilterMaintenance'].includes(model.type);"
            }
         },
         "filterLifeLevel":
         {
            "$id": "#filterLifeLevel",
            "title": "filterLifeLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "An Measurement of Filters Current Quality"
         },
         "firmwareRevision":
         {
            "$id": "#firmwareRevision",
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
            "$id": "#hardwareRevision",
            "title": "hardwareRevision",
            "type": "string",
            "description": "The Hardwares Revision String"
         },
         "heartBeat":
         {
            "$id": "#heartBeat",
            "title": "heartBeat",
            "type": "integer",
            "description": "The Current Heart Rate"
         },
         "heatingThresholdTemperature":
         {
            "$id": "#heatingThresholdTemperature",
            "title": "heatingThresholdTemperature",
            "type": "number",
            "minimum": 0,
            "maximum": 25,
            "description": "The Heating Threshold Temperature"
         },
         "holdPosition":
         {
            "$id": "#holdPosition",
            "title": "holdPosition",
            "type": "boolean",
            "description": "If Position Should Be Held"
         },
         "homeKitCameraActive":
         {
            "$id": "#homeKitCameraActive",
            "title": "homeKitCameraActive",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the HomeKit Camera ON/OFF",
            "condition":
            {
               "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
            }
         },
         "hue":
         {
            "$id": "#hue",
            "title": "hue",
            "type": "number",
            "minimum": 0,
            "maximum": 360,
            "description": "The Measured Hue"
         },
         "identifier":
         {
            "$id": "#identifier",
            "title": "identifier",
            "type": "integer",
            "description": "The Devices Identifier"
         },
         "identify":
         {
            "$id": "#identify",
            "title": "identify",
            "type": "boolean",
            "description": "The Devices Identify Status",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "imageMirroring":
         {
            "$id": "#imageMirroring",
            "title": "imageMirroring",
            "type": "boolean",
            "description": "Is Image Being Mirrored"
         },
         "imageRotation":
         {
            "$id": "#imageRotation",
            "title": "imageRotation",
            "type": "integer",
            "minimum": 0,
            "maximum": 360,
            "description": "The Images Degree of Rotation "
         },
         "inUse":
         {
            "$id": "#inUse",
            "title": "inUse",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the Device In Use",
            "condition":
            {
               "functionBody": "return ['IrrigationSystem','Valve'].includes(model.type);"
            }
         },
         "inputDeviceType":
         {
            "$id": "#inputDeviceType",
            "title": "inputDeviceType",
            "type": "integer",
            "minimum": 0,
            "maximum": 6,
            "description": "The Input Devices Type"
         },
         "inputSourceType":
         {
            "$id": "#inputSourceType",
            "title": "inputSourceType",
            "type": "integer",
            "minimum": 0,
            "maximum": 10,
            "description": "The Input Devices Source Type",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "isConfigured":
         {
            "$id": "#isConfigured",
            "title": "isConfigured",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the device Configured",
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            }
         },
         "leakDetected":
         {
            "$id": "#leakDetected",
            "title": "leakDetected",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is There a Leak Detected",
            "condition":
            {
               "functionBody": "return ['LeakSensor'].includes(model.type);"
            }
         },
         "linkQuality":
         {
            "$id": "#linkQuality",
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
            "$id": "#listPairings",
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
            "$id": "#lockControlPoint",
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
            "$id": "#lockCurrentState",
            "title": "lockCurrentState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Locks Current State",
            "condition":
            {
               "functionBody": "return ['LockMechanism'].includes(model.type);"
            }
         },
         "lockLastKnownAction":
         {
            "$id": "#lockLastKnownAction",
            "title": "lockLastKnownAction",
            "type": "integer",
            "minimum": 0,
            "maximum": 10,
            "description": "The Locks Last known Action"
         },
         "lockManagementAutoSecurityTimeout":
         {
            "$id": "#lockManagementAutoSecurityTimeout",
            "title": "lockManagementAutoSecurityTimeout",
            "type": "integer",
            "description": "The Locks Security Timeout Value"
         },
         "lockPhysicalControls":
         {
            "$id": "#lockPhysicalControls",
            "title": "lockPhysicalControls",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the Lock Physically Enabled/Disabled"
         },
         "lockTargetState":
         {
            "$id": "#lockTargetState",
            "title": "lockTargetState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Locks Requested State",
            "condition":
            {
               "functionBody": "return ['LockMechanism'].includes(model.type);"
            }
         },
         "logs":
         {
            "$id": "#logs",
            "title": "logs",
            "type": "string",
            "description": "The Devices Logs"
         },
         "macRetransmissionMaximum":
         {
            "$id": "#macRetransmissionMaximum",
            "title": "macRetransmissionMaximum",
            "type": "integer",
            "description": "The Devices MAC Retransmission Maximum Amount"
         },
         "macTransmissionCounters":
         {
            "$id": "#macTransmissionCounters",
            "title": "macTransmissionCounters",
            "type": "string",
            "description": "The Devices MAC Transmission Counters"
         },
         "managedNetworkEnable":
         {
            "$id": "#managedNetworkEnable",
            "title": "managedNetworkEnable",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Networks Current State",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type);"
            }
         },
         "manuallyDisabled":
         {
            "$id": "#manuallyDisabled",
            "title": "manuallyDisabled",
            "type": "boolean",
            "description": "Is the Device Manually Enabled/Disabled"
         },
         "manufacturer":
         {
            "$id": "#manufacturer",
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
            "$id": "#model",
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
            "$id": "#motionDetected",
            "title": "motionDetected",
            "type": "boolean",
            "description": "Is Motion Being Detected",
            "condition":
            {
               "functionBody": "return ['MotionSensor'].includes(model.type);"
            }
         },
         "mute":
         {
            "$id": "#mute",
            "title": "mute",
            "type": "boolean",
            "description": "Is the Device Currently Muted",
            "condition":
            {
               "functionBody": "return ['Microphone','Speaker','TelevisionSpeaker'].includes(model.type);"
            }
         },
         "name":
         {
            "$id": "#name",
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
            "$id": "#networkAccessViolationControl",
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
            "$id": "#networkClientProfileControl",
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
            "$id": "#networkClientStatusControl",
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
            "$id": "#nightVision",
            "title": "nightVision",
            "type": "boolean",
            "description": "Is Night Vision Available"
         },
         "nitrogenDioxideDensity":
         {
            "$id": "#nitrogenDioxideDensity",
            "title": "nitrogenDioxideDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Measured NO2 Density"
         },
         "obstructionDetected":
         {
            "$id": "#obstructionDetected",
            "title": "obstructionDetected",
            "type": "boolean",
            "description": "Is Obstruction Currently Detected",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "occupancyDetected":
         {
            "$id": "#occupancyDetected",
            "title": "occupancyDetected",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is Occupancy Currently Detected",
            "condition":
            {
               "functionBody": "return ['OccupancySensor'].includes(model.type);"
            }
         },
         "on":
         {
            "$id": "#on",
            "title": "on",
            "type": "boolean",
            "description": "Is the Device On",
            "condition":
            {
               "functionBody": "return ['CameraControl','Fan','Fanv1','Lightbulb','Outlet','Switch'].includes(model.type);"
            }
         },
         "operatingStateResponse":
         {
            "$id": "#operatingStateResponse",
            "title": "operatingStateResponse",
            "type": "string",
            "description": "The Devices Operating State Response"
         },
         "opticalZoom":
         {
            "$id": "#opticalZoom",
            "title": "opticalZoom",
            "type": "number",
            "description": "The Devices Optical Zoom Factor"
         },
         "outletInUse":
         {
            "$id": "#outletInUse",
            "title": "outletInUse",
            "type": "boolean",
            "description": "Is the Outlet in Use",
            "condition":
            {
               "functionBody": "return ['Outlet'].includes(model.type);"
            }
         },
         "ozoneDensity":
         {
            "$id": "#ozoneDensity",
            "title": "ozoneDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Ozones Current Measured Density"
         },
         "pm10Density":
         {
            "$id": "#pm10Density",
            "title": "pm10Density",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The PM1O Current Measured Density"
         },
         "pm2_5Density":
         {
            "$id": "#pm2_5Density",
            "title": "pm2_5Density",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The PM2_5 Current Measured Density"
         },
         "pairSetup":
         {
            "$id": "#pairSetup",
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
            "$id": "#pairVerify",
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
            "$id": "#pairingFeatures",
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
            "$id": "#pairingPairings",
            "title": "pairingPairings",
            "type": "string",
            "description": "The Devices Pairing Pairings"
         },
         "passwordSetting":
         {
            "$id": "#passwordSetting",
            "title": "passwordSetting",
            "type": "string",
            "description": "The Devices Password Setting"
         },
         "periodicSnapshotsActive":
         {
            "$id": "#periodicSnapshotsActive",
            "title": "periodicSnapshotsActive",
            "type": "integer",
            "description": "Is the Periodic Snapshot Enabled/Disabled"
         },
         "pictureMode":
         {
            "$id": "#pictureMode",
            "title": "pictureMode",
            "type": "integer",
            "minimum": 0,
            "maximum": 13,
            "description": "The Current Picture Mode"
         },
         "ping":
         {
            "$id": "#ping",
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
            "$id": "#positionState",
            "title": "positionState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices Position State",
            "condition":
            {
               "functionBody": "return ['Door','Window','WindowCovering'].includes(model.type);"
            }
         },
         "powerModeSelection":
         {
            "$id": "#powerModeSelection",
            "title": "powerModeSelection",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Power Mode Selection"
         },
         "productData":
         {
            "$id": "#productData",
            "title": "productData",
            "type": "string",
            "description": "The Devices Product Data"
         },
         "programMode":
         {
            "$id": "#programMode",
            "title": "programMode",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices Program Mode",
            "condition":
            {
               "functionBody": "return ['IrrigationSystem'].includes(model.type);"
            }
         },
         "programmableSwitchEvent":
         {
            "$id": "#programmableSwitchEvent",
            "title": "programmableSwitchEvent",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices Current Position State",
            "condition":
            {
               "functionBody": "return ['DoorBell','StatefulProgrammableSwitch','StatelessProgrammableSwitch'].includes(model.type);"
            }
         },
         "programmableSwitchOutputState":
         {
            "$id": "#programmableSwitchOutputState",
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
            "$id": "#reachable",
            "title": "reachable",
            "type": "boolean",
            "description": "If the Device is Reachable",
            "condition":
            {
               "functionBody": "return ['BridgingState'].includes(model.type);"
            }
         },
         "receivedSignalStrengthIndication":
         {
            "$id": "#receivedSignalStrengthIndication",
            "title": "receivedSignalStrengthIndication",
            "type": "integer",
            "description": "The Received Signal Strength Measurement"
         },
         "receiverSensitivity":
         {
            "$id": "#receiverSensitivity",
            "title": "receiverSensitivity",
            "type": "integer",
            "description": "The Amount of Receiver Sensitivity"
         },
         "recordingAudioActive":
         {
            "$id": "#recordingAudioActive",
            "title": "recordingAudioActive",
            "type": "integer",
            "description": "Is Recordding Audio Enabled/DisAbled"
         },
         "relativeHumidityDehumidifierThreshold":
         {
            "$id": "#relativeHumidityDehumidifierThreshold",
            "title": "relativeHumidityDehumidifierThreshold",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Relative Humidity DeHumidifier Threshold"
         },
         "relativeHumidityHumidifierThreshold":
         {
            "$id": "#relativeHumidityHumidifierThreshold",
            "title": "relativeHumidityHumidifierThreshold",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Relative Humidity Humidifier Threshold"
         },
         "relayControlPoint":
         {
            "$id": "#relayControlPoint",
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
            "$id": "#relayEnabled",
            "title": "relayEnabled",
            "type": "boolean",
            "description": "Is the Relay Currently Enabled",
            "condition":
            {
               "functionBody": "return ['Relay'].includes(model.type);"
            }
         },
         "relayState":
         {
            "$id": "#relayState",
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
            "$id": "#remainingDuration",
            "title": "remainingDuration",
            "type": "integer",
            "minimum": 0,
            "maximum": 3600,
            "description": "The Remaining Duration"
         },
         "remoteKey":
         {
            "$id": "#remoteKey",
            "title": "remoteKey",
            "type": "integer",
            "minimum": 0,
            "maximum": 16,
            "description": "The Remote Key",
            "condition":
            {
               "functionBody": "return ['Television'].includes(model.type);"
            }
         },
         "resetFilterIndication":
         {
            "$id": "#resetFilterIndication",
            "title": "resetFilterIndication",
            "type": "integer",
            "minimum": 1,
            "maximum": 1,
            "description": "If Reset Filter Indication "
         },
         "rotationDirection":
         {
            "$id": "#rotationDirection",
            "title": "rotationDirection",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Current Direction of Rotation"
         },
         "rotationSpeed":
         {
            "$id": "#rotationSpeed",
            "title": "rotationSpeed",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Current Speed of Rotation"
         },
         "routerStatus":
         {
            "$id": "#routerStatus",
            "title": "routerStatus",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Current Router Status",
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type);"
            }
         },
         "saturation":
         {
            "$id": "#saturation",
            "title": "saturation",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Percentage of Color Saturation"
         },
         "securitySystemAlarmType":
         {
            "$id": "#securitySystemAlarmType",
            "title": "securitySystemAlarmType",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Security System Alarm Type"
         },
         "securitySystemCurrentState":
         {
            "$id": "#securitySystemCurrentState",
            "title": "securitySystemCurrentState",
            "type": "integer",
            "minimum": 0,
            "maximum": 4,
            "description": "The Security Systems Currently Armed State",
            "condition":
            {
               "functionBody": "return ['SecuritySystem'].includes(model.type);"
            }
         },
         "securitySystemTargetState":
         {
            "$id": "#securitySystemTargetState",
            "title": "securitySystemTargetState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Target Armed State of the Security System",
            "condition":
            {
               "functionBody": "return ['SecuritySystem'].includes(model.type);"
            }
         },
         "selectedAudioStreamConfiguration":
         {
            "$id": "#selectedAudioStreamConfiguration",
            "title": "selectedAudioStreamConfiguration",
            "type": "string",
            "description": "The Selected Audio Stream Configuration"
         },
         "selectedCameraRecordingConfiguration":
         {
            "$id": "#selectedCameraRecordingConfiguration",
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
            "$id": "#selectedRTPStreamConfiguration",
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
            "$id": "#serialNumber",
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
            "$id": "#serviceLabelIndex",
            "title": "serviceLabelIndex",
            "type": "integer",
            "minimum": 1,
            "maximum": 255,
            "description": "The Devices Service Label Index"
         },
         "serviceLabelNamespace":
         {
            "$id": "#serviceLabelNamespace",
            "title": "serviceLabelNamespace",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Service Label NameSpace",
            "condition":
            {
               "functionBody": "return ['ServiceLabel'].includes(model.type);"
            }
         },
         "setDuration":
         {
            "$id": "#setDuration",
            "title": "setDuration",
            "type": "integer",
            "minimum": 0,
            "maximum": 3600,
            "description": "The Devices Set Duration"
         },
         "setupDataStreamTransport":
         {
            "$id": "#setupDataStreamTransport",
            "title": "setupDataStreamTransport",
            "type": "string",
            "description": "The Devices Setup Stream Transport Value"
         },
         "setupEndpoints":
         {
            "$id": "#setupEndpoints",
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
            "$id": "#setupTransferTransport",
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
            "$id": "#signalToNoiseRatio",
            "title": "signalToNoiseRatio",
            "type": "integer",
            "description": "The Measured Signal to Noise Ratio"
         },
         "siriInputType":
         {
            "$id": "#siriInputType",
            "title": "siriInputType",
            "type": "integer",
            "minimum": 0,
            "maximum": 0,
            "description": "siri's Input Type",
            "condition":
            {
               "functionBody": "return ['Siri'].includes(model.type);"
            }
         },
         "slatType":
         {
            "$id": "#slatType",
            "title": "slatType",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Slat Type",
            "condition":
            {
               "functionBody": "return ['Slat'].includes(model.type);"
            }
         },
         "sleepDiscoveryMode":
         {
            "$id": "#sleepDiscoveryMode",
            "title": "sleepDiscoveryMode",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Discoverable Sleep Mode",
            "condition":
            {
               "functionBody": "return ['Television'].includes(model.type);"
            }
         },
         "sleepInterval":
         {
            "$id": "#sleepInterval",
            "title": "sleepInterval",
            "type": "integer",
            "minimum": 0,
            "description": "The Devices Sleep Interval"
         },
         "smokeDetected":
         {
            "$id": "#smokeDetected",
            "title": "smokeDetected",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If Smoke is Detected or Not",
            "condition":
            {
               "functionBody": "return ['SmokeSensor'].includes(model.type);"
            }
         },
         "softwareRevision":
         {
            "$id": "#softwareRevision",
            "title": "softwareRevision",
            "type": "string",
            "description": "The Devices Software Revision String"
         },
         "statusActive":
         {
            "$id": "#statusActive",
            "title": "statusActive",
            "type": "boolean",
            "description": "If the Device is Active or Not"
         },
         "statusFault":
         {
            "$id": "#statusFault",
            "title": "statusFault",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device has a Status Fault"
         },
         "statusJammed":
         {
            "$id": "#statusJammed",
            "title": "statusJammed",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device is in Jammed Status"
         },
         "statusLowBattery":
         {
            "$id": "#statusLowBattery",
            "title": "statusLowBattery",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Status of the Battery Level",
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            }
         },
         "statusTampered":
         {
            "$id": "#statusTampered",
            "title": "statusTampered",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device is Tampered"
         },
         "streamingStatus":
         {
            "$id": "#streamingStatus",
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
            "$id": "#sulphurDioxideDensity",
            "title": "sulphurDioxideDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The measured Sulphur Dioxide Density"
         },
         "supportedAudioRecordingConfiguration":
         {
            "$id": "#supportedAudioRecordingConfiguration",
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
            "$id": "#supportedAudioStreamConfiguration",
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
            "$id": "#supportedCameraRecordingConfiguration",
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
            "$id": "#supportedDataStreamTransportConfiguration",
            "title": "supportedDataStreamTransportConfiguration",
            "type": "string",
            "description": "The Supported Data Stream Transport Configuration"
         },
         "supportedCharacteristicValueTransitionConfiguration":
         {
            "$id": "#supportedCharacteristicValueTransitionConfiguration",
            "title": "supportedCharacteristicValueTransitionConfiguration",
            "type": "string",
            "description": "The Supported Characteristic Value Transition Configuration"
         },
         "supportedDiagnosticsSnapshot":
         {
            "$id": "#supportedDiagnosticsSnapshot",
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
            "$id": "#supportedRTPConfiguration",
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
            "$id": "#supportedRouterConfiguration",
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
            "$id": "#supportedTransferTransportConfiguration",
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
            "$id": "#supportedVideoRecordingConfiguration",
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
            "$id": "#supportedVideoStreamConfiguration",
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
            "$id": "#swingMode",
            "title": "swingMode",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The DevicesnCurrent Swing Mode"
         },
         "targetAirPurifierState":
         {
            "$id": "#targetAirPurifierState",
            "title": "targetAirPurifierState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Requested Target Air Purification State",
            "condition":
            {
               "functionBody": "return ['AirPurifier'].includes(model.type);"
            }
         },
         "targetAirQuality":
         {
            "$id": "#targetAirQuality",
            "title": "targetAirQuality",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Requested Target Air Quality"
         },
         "targetControlList":
         {
            "$id": "#targetControlList",
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
            "$id": "#targetControlSupportedConfiguration",
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
            "$id": "#targetDoorState",
            "title": "targetDoorState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Doors Requested State",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "targetFanState":
         {
            "$id": "#targetFanState",
            "title": "targetFanState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Fans Requested State"
         },
         "targetHeaterCoolerState":
         {
            "$id": "#targetHeaterCoolerState",
            "title": "targetHeaterCoolerState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Heaters Requested Cooling State",
            "condition":
            {
               "functionBody": "return ['HeaterCooler'].includes(model.type);"
            }
         },
         "targetHeatingCoolingState":
         {
            "$id": "#targetHeatingCoolingState",
            "title": "targetHeatingCoolingState",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Heaters Requested Heating State",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "targetHorizontalTiltAngle":
         {
            "$id": "#targetHorizontalTiltAngle",
            "title": "targetHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Requested Horizontal Tilt Angle"
         },
         "targetHumidifierDehumidifierState":
         {
            "$id": "#targetHumidifierDehumidifierState",
            "title": "targetHumidifierDehumidifierState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Requested Humidifier/DeHumidifier State",
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
            }
         },
         "targetMediaState":
         {
            "$id": "#targetMediaState",
            "title": "targetMediaState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Requested Media State",
            "condition":
            {
               "functionBody": "return ['SmartSpeaker'].includes(model.type);"
            }
         },
         "targetPosition":
         {
            "$id": "#targetPosition",
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
            "$id": "#targetRelativeHumidity",
            "title": "targetRelativeHumidity",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Devices Requested Relative Humidity Level"
         },
         "targetSlatState":
         {
            "$id": "#targetSlatState",
            "title": "targetSlatState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Requested Slat State"
         },
         "targetTemperature":
         {
            "$id": "#targetTemperature",
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
            "$id": "#targetTiltAngle",
            "title": "targetTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Devices Requested Tilt Angle"
         },
         "targetVerticalTiltAngle":
         {
            "$id": "#targetVerticalTiltAngle",
            "title": "targetVerticalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Devices Requested Vertical Tilt Angle"
         },
         "targetVisibilityState":
         {
            "$id": "#targetVisibilityState",
            "title": "targetVisibilityState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Requested Visibility State"
         },
         "temperatureDisplayUnits":
         {
            "$id": "#temperatureDisplayUnits",
            "title": "temperatureDisplayUnits",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Units to Display the Temperature in",
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            }
         },
         "thirdPartyCameraActive":
         {
            "$id": "#thirdPartyCameraActive",
            "title": "thirdPartyCameraActive",
            "type": "integer",
            "description": "The ON/OFF Auxiliary Camera State"
         },
         "timeUpdate":
         {
            "$id": "#timeUpdate",
            "title": "timeUpdate",
            "type": "boolean",
            "description": "Ifnthe Time Should be Updated",
            "condition":
            {
               "functionBody": "return ['TimeInformation'].includes(model.type);"
            }
         },
         "transmitPower":
         {
            "$id": "#transmitPower",
            "title": "transmitPower",
            "type": "integer",
            "description": "The Devices Measured Transmit Power"
         },
         "transmitPowerMaximum":
         {
            "$id": "#transmitPowerMaximum",
            "title": "transmitPowerMaximum",
            "type": "integer",
            "description": "The Devices Maximum Power Output"
         },
         "tunnelConnectionTimeout":
         {
            "$id": "#tunnelConnectionTimeout",
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
            "$id": "#tunneledAccessoryAdvertising",
            "title": "tunneledAccessoryAdvertising",
            "type": "boolean",
            "description": "If the Device is Currently Tunneled Advertising",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryConnected":
         {
            "$id": "#tunneledAccessoryConnected",
            "title": "tunneledAccessoryConnected",
            "type": "boolean",
            "description": "If the Device is Tunneled Connected ",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryStateNumber":
         {
            "$id": "#tunneledAccessoryStateNumber",
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
            "$id": "#vocDensity",
            "title": "vocDensity",
            "type": "number",
            "minimum": 0,
            "maximum": 1000,
            "description": "The Devices Measured VOC Density"
         },
         "valveType":
         {
            "$id": "#valveType",
            "title": "valveType",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Devices Valve Type",
            "condition":
            {
               "functionBody": "return ['Valve'].includes(model.type);"
            }
         },
         "version":
         {
            "$id": "#version",
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
            "$id": "#videoAnalysisActive",
            "title": "videoAnalysisActive",
            "type": "integer",
            "description": "The Devices Video Analysis Active Status"
         },
         "volume":
         {
            "$id": "#volume",
            "title": "volume",
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "The Devices Volume as a Percentage"
         },
         "volumeControlType":
         {
            "$id": "#volumeControlType",
            "title": "volumeControlType",
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Devices Volume Control Type"
         },
         "volumeSelector":
         {
            "$id": "#volumeSelector",
            "title": "volumeSelector",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Volume Selector"
         },
         "wanConfigurationList":
         {
            "$id": "#wanConfigurationList",
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
            "$id": "#wanStatusList",
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
            "$id": "#wakeConfiguration",
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
            "$id": "#waterLevel",
            "title": "waterLevel",
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "The Current Water Level Measurement"
         },
         "wifiCapabilities":
         {
            "$id": "#wifiCapabilities",
            "title": "wifiCapabilities",
            "type": "integer",
            "description": "The Devices WiFi Capabilities"
         },
         "wifiConfigurationControl":
         {
            "$id": "#wifiConfigurationControl",
            "title": "wifiConfigurationControl",
            "type": "string",
            "description": "The Devices WiFi Configuration Control"
         },
         "wifiSatelliteStatus":
         {
            "$id": "#wifiSatelliteStatus",
            "title": "wifiSatelliteStatus",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices WiFi Satellite Status",
            "condition":
            {
               "functionBody": "return ['WiFiSatellite'].includes(model.type);"
            }
         },
         "type":
         {
            "$id": "#type",
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
            "$id": "#subType",
            "type": "string",
            "title": "subType",
            "description": "The accessories subType.",
            "placeholder": "A secondary name",
            "required": false
         },
         "displayName":
         {
            "$id": "#displayName",
            "type": "string",
            "title": "displayName",
            "description": "The accessories display name.",
            "placeholder": "My_Device",
            "required": true
         },
         "polling":
         {
            "$id": "#polling",
            "title": "polling",
            "type": "array",
            "required": false,
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
                  },"interval":
                  {
                     "title": "interval",
                     "type": "number",
                     "required": "false"
                  },"stateChaneResponseTime":
                  {
                     "title": "stateChaneResponseTime",
                     "type": "number",
                     "required": "false"
                  },"queue":
                  {
                     "title": "queue",
                     "type": "string",
                     "required": "false"
                  }
               }
            }
         }
      },
      "properties":
      {
         "type": { "$ref": "#/$definitions/type"},
         "debug": { "$ref": "#/$definitions/debug"},
         "allowTLV8": { "$ref": "#/$definitions/allowTLV8"},
         "outputConstants": { "$ref": "#/$definitions/outputConstants"},
         "statusMsg": { "$ref": "#/$definitions/statusMsg"},
         "interval": { "$ref": "#/$definitions/interval"},
         "timeout": { "$ref": "#/$definitions/timeout"},
         "stateChangeResponseTime": { "$ref": "#/$definitions/stateChangeResponseTime"},
         "queueTypes": { "$ref": "#/$definitions/queueTypes"},
         "folder": { "$ref": "#/$definitions/folder"},
         "storage": { "$ref": "#/$definitions/storage"},
         "storagePath": { "$ref": "#/$definitions/storagePath"},
         "keyPath": { "$ref": "#/$definitions/keyPath"},
         "accessControlLevel": { "$ref": "#/$definitions/accessControlLevel"},
         "accessoryFlags": { "$ref": "#/$definitions/accessoryFlags"},
         "accessoryIdentifier": { "$ref": "#/$definitions/accessoryIdentifier"},
         "active": { "$ref": "#/$definitions/active"},
         "activeIdentifier": { "$ref": "#/$definitions/activeIdentifier"},
         "activityInterval": { "$ref": "#/$definitions/activityInterval"},
         "administratorOnlyAccess": { "$ref": "#/$definitions/administratorOnlyAccess"},
         "airParticulateDensity": { "$ref": "#/$definitions/airParticulateDensity"},
         "airParticulateSize": { "$ref": "#/$definitions/airParticulateSize"},
         "airQuality": { "$ref": "#/$definitions/airQuality"},
         "appMatchingIdentifier": { "$ref": "#/$definitions/appMatchingIdentifier"},
         "audioFeedback": { "$ref": "#/$definitions/audioFeedback"},
         "batteryLevel": { "$ref": "#/$definitions/batteryLevel"},
         "brightness": { "$ref": "#/$definitions/brightness"},
         "buttonEvent": { "$ref": "#/$definitions/buttonEvent"},
         "ccaEnergyDetectThreshold": { "$ref": "#/$definitions/ccaEnergyDetectThreshold"},
         "ccaSignalDetectThreshold": { "$ref": "#/$definitions/ccaSignalDetectThreshold"},
         "cameraOperatingModeIndicator": { "$ref": "#/$definitions/cameraOperatingModeIndicator"},
         "carbonDioxideDetected": { "$ref": "#/$definitions/carbonDioxideDetected"},
         "carbonDioxideLevel": { "$ref": "#/$definitions/carbonDioxideLevel"},
         "carbonDioxidePeakLevel": { "$ref": "#/$definitions/carbonDioxidePeakLevel"},
         "carbonMonoxideDetected": { "$ref": "#/$definitions/carbonMonoxideDetected"},
         "carbonMonoxideLevel": { "$ref": "#/$definitions/carbonMonoxideLevel"},
         "carbonMonoxidePeakLevel": { "$ref": "#/$definitions/carbonMonoxidePeakLevel"},
         "category": { "$ref": "#/$definitions/category"},
         "characteristicValueTransitionControl": { "$ref": "#/$definitions/characteristicValueTransitionControl"},
         "chargingState": { "$ref": "#/$definitions/chargingState"},
         "closedCaptions": { "$ref": "#/$definitions/closedCaptions"},
         "colorTemperature": { "$ref": "#/$definitions/colorTemperature"},
         "configureBridgedAccessory": { "$ref": "#/$definitions/configureBridgedAccessory"},
         "configureBridgedAccessoryStatus": { "$ref": "#/$definitions/configureBridgedAccessoryStatus"},
         "configuredName": { "$ref": "#/$definitions/configuredName"},
         "contactSensorState": { "$ref": "#/$definitions/contactSensorState"},
         "coolingThresholdTemperature": { "$ref": "#/$definitions/coolingThresholdTemperature"},
         "currentAirPurifierState": { "$ref": "#/$definitions/currentAirPurifierState"},
         "currentAmbientLightLevel": { "$ref": "#/$definitions/currentAmbientLightLevel"},
         "currentDoorState": { "$ref": "#/$definitions/currentDoorState"},
         "currentFanState": { "$ref": "#/$definitions/currentFanState"},
         "currentHeaterCoolerState": { "$ref": "#/$definitions/currentHeaterCoolerState"},
         "currentHeatingCoolingState": { "$ref": "#/$definitions/currentHeatingCoolingState"},
         "currentHorizontalTiltAngle": { "$ref": "#/$definitions/currentHorizontalTiltAngle"},
         "currentHumidifierDehumidifierState": { "$ref": "#/$definitions/currentHumidifierDehumidifierState"},
         "currentMediaState": { "$ref": "#/$definitions/currentMediaState"},
         "currentPosition": { "$ref": "#/$definitions/currentPosition"},
         "currentRelativeHumidity": { "$ref": "#/$definitions/currentRelativeHumidity"},
         "currentSlatState": { "$ref": "#/$definitions/currentSlatState"},
         "currentTemperature": { "$ref": "#/$definitions/currentTemperature"},
         "currentTiltAngle": { "$ref": "#/$definitions/currentTiltAngle"},
         "currentTime": { "$ref": "#/$definitions/currentTime"},
         "currentTransport": { "$ref": "#/$definitions/currentTransport"},
         "currentVerticalTiltAngle": { "$ref": "#/$definitions/currentVerticalTiltAngle"},
         "currentVisibilityState": { "$ref": "#/$definitions/currentVisibilityState"},
         "dataStreamHAPTransport": { "$ref": "#/$definitions/dataStreamHAPTransport"},
         "dataStreamHAPTransportInterrupt": { "$ref": "#/$definitions/dataStreamHAPTransportInterrupt"},
         "dayoftheWeek": { "$ref": "#/$definitions/dayoftheWeek"},
         "diagonalFieldOfView": { "$ref": "#/$definitions/diagonalFieldOfView"},
         "digitalZoom": { "$ref": "#/$definitions/digitalZoom"},
         "discoverBridgedAccessories": { "$ref": "#/$definitions/discoverBridgedAccessories"},
         "discoveredBridgedAccessories": { "$ref": "#/$definitions/discoveredBridgedAccessories"},
         "displayOrder": { "$ref": "#/$definitions/displayOrder"},
         "eventRetransmissionMaximum": { "$ref": "#/$definitions/eventRetransmissionMaximum"},
         "eventSnapshotsActive": { "$ref": "#/$definitions/eventSnapshotsActive"},
         "eventTransmissionCounters": { "$ref": "#/$definitions/eventTransmissionCounters"},
         "filterChangeIndication": { "$ref": "#/$definitions/filterChangeIndication"},
         "filterLifeLevel": { "$ref": "#/$definitions/filterLifeLevel"},
         "firmwareRevision": { "$ref": "#/$definitions/firmwareRevision"},
         "hardwareRevision": { "$ref": "#/$definitions/hardwareRevision"},
         "heartBeat": { "$ref": "#/$definitions/heartBeat"},
         "heatingThresholdTemperature": { "$ref": "#/$definitions/heatingThresholdTemperature"},
         "holdPosition": { "$ref": "#/$definitions/holdPosition"},
         "homeKitCameraActive": { "$ref": "#/$definitions/homeKitCameraActive"},
         "hue": { "$ref": "#/$definitions/hue"},
         "identifier": { "$ref": "#/$definitions/identifier"},
         "identify": { "$ref": "#/$definitions/identify"},
         "imageMirroring": { "$ref": "#/$definitions/imageMirroring"},
         "imageRotation": { "$ref": "#/$definitions/imageRotation"},
         "inUse": { "$ref": "#/$definitions/inUse"},
         "inputDeviceType": { "$ref": "#/$definitions/inputDeviceType"},
         "inputSourceType": { "$ref": "#/$definitions/inputSourceType"},
         "isConfigured": { "$ref": "#/$definitions/isConfigured"},
         "leakDetected": { "$ref": "#/$definitions/leakDetected"},
         "linkQuality": { "$ref": "#/$definitions/linkQuality"},
         "listPairings": { "$ref": "#/$definitions/listPairings"},
         "lockControlPoint": { "$ref": "#/$definitions/lockControlPoint"},
         "lockCurrentState": { "$ref": "#/$definitions/lockCurrentState"},
         "lockLastKnownAction": { "$ref": "#/$definitions/lockLastKnownAction"},
         "lockManagementAutoSecurityTimeout": { "$ref": "#/$definitions/lockManagementAutoSecurityTimeout"},
         "lockPhysicalControls": { "$ref": "#/$definitions/lockPhysicalControls"},
         "lockTargetState": { "$ref": "#/$definitions/lockTargetState"},
         "logs": { "$ref": "#/$definitions/logs"},
         "macRetransmissionMaximum": { "$ref": "#/$definitions/macRetransmissionMaximum"},
         "macTransmissionCounters": { "$ref": "#/$definitions/macTransmissionCounters"},
         "managedNetworkEnable": { "$ref": "#/$definitions/managedNetworkEnable"},
         "manuallyDisabled": { "$ref": "#/$definitions/manuallyDisabled"},
         "manufacturer": { "$ref": "#/$definitions/manufacturer"},
         "model": { "$ref": "#/$definitions/model"},
         "motionDetected": { "$ref": "#/$definitions/motionDetected"},
         "mute": { "$ref": "#/$definitions/mute"},
         "name": { "$ref": "#/$definitions/name"},
         "networkAccessViolationControl": { "$ref": "#/$definitions/networkAccessViolationControl"},
         "networkClientProfileControl": { "$ref": "#/$definitions/networkClientProfileControl"},
         "networkClientStatusControl": { "$ref": "#/$definitions/networkClientStatusControl"},
         "nightVision": { "$ref": "#/$definitions/nightVision"},
         "nitrogenDioxideDensity": { "$ref": "#/$definitions/nitrogenDioxideDensity"},
         "obstructionDetected": { "$ref": "#/$definitions/obstructionDetected"},
         "occupancyDetected": { "$ref": "#/$definitions/occupancyDetected"},
         "on": { "$ref": "#/$definitions/on"},
         "operatingStateResponse": { "$ref": "#/$definitions/operatingStateResponse"},
         "opticalZoom": { "$ref": "#/$definitions/opticalZoom"},
         "outletInUse": { "$ref": "#/$definitions/outletInUse"},
         "ozoneDensity": { "$ref": "#/$definitions/ozoneDensity"},
         "pm10Density": { "$ref": "#/$definitions/pm10Density"},
         "pm2_5Density": { "$ref": "#/$definitions/pm2_5Density"},
         "pairSetup": { "$ref": "#/$definitions/pairSetup"},
         "pairVerify": { "$ref": "#/$definitions/pairVerify"},
         "pairingFeatures": { "$ref": "#/$definitions/pairingFeatures"},
         "pairingPairings": { "$ref": "#/$definitions/pairingPairings"},
         "passwordSetting": { "$ref": "#/$definitions/passwordSetting"},
         "periodicSnapshotsActive": { "$ref": "#/$definitions/periodicSnapshotsActive"},
         "pictureMode": { "$ref": "#/$definitions/pictureMode"},
         "ping": { "$ref": "#/$definitions/ping"},
         "positionState": { "$ref": "#/$definitions/positionState"},
         "powerModeSelection": { "$ref": "#/$definitions/powerModeSelection"},
         "productData": { "$ref": "#/$definitions/productData"},
         "programMode": { "$ref": "#/$definitions/programMode"},
         "programmableSwitchEvent": { "$ref": "#/$definitions/programmableSwitchEvent"},
         "programmableSwitchOutputState": { "$ref": "#/$definitions/programmableSwitchOutputState"},
         "reachable": { "$ref": "#/$definitions/reachable"},
         "receivedSignalStrengthIndication": { "$ref": "#/$definitions/receivedSignalStrengthIndication"},
         "receiverSensitivity": { "$ref": "#/$definitions/receiverSensitivity"},
         "recordingAudioActive": { "$ref": "#/$definitions/recordingAudioActive"},
         "relativeHumidityDehumidifierThreshold": { "$ref": "#/$definitions/relativeHumidityDehumidifierThreshold"},
         "relativeHumidityHumidifierThreshold": { "$ref": "#/$definitions/relativeHumidityHumidifierThreshold"},
         "relayControlPoint": { "$ref": "#/$definitions/relayControlPoint"},
         "relayEnabled": { "$ref": "#/$definitions/relayEnabled"},
         "relayState": { "$ref": "#/$definitions/relayState"},
         "remainingDuration": { "$ref": "#/$definitions/remainingDuration"},
         "remoteKey": { "$ref": "#/$definitions/remoteKey"},
         "resetFilterIndication": { "$ref": "#/$definitions/resetFilterIndication"},
         "rotationDirection": { "$ref": "#/$definitions/rotationDirection"},
         "rotationSpeed": { "$ref": "#/$definitions/rotationSpeed"},
         "routerStatus": { "$ref": "#/$definitions/routerStatus"},
         "saturation": { "$ref": "#/$definitions/saturation"},
         "securitySystemAlarmType": { "$ref": "#/$definitions/securitySystemAlarmType"},
         "securitySystemCurrentState": { "$ref": "#/$definitions/securitySystemCurrentState"},
         "securitySystemTargetState": { "$ref": "#/$definitions/securitySystemTargetState"},
         "selectedAudioStreamConfiguration": { "$ref": "#/$definitions/selectedAudioStreamConfiguration"},
         "selectedCameraRecordingConfiguration": { "$ref": "#/$definitions/selectedCameraRecordingConfiguration"},
         "selectedRTPStreamConfiguration": { "$ref": "#/$definitions/selectedRTPStreamConfiguration"},
         "serialNumber": { "$ref": "#/$definitions/serialNumber"},
         "serviceLabelIndex": { "$ref": "#/$definitions/serviceLabelIndex"},
         "serviceLabelNamespace": { "$ref": "#/$definitions/serviceLabelNamespace"},
         "setDuration": { "$ref": "#/$definitions/setDuration"},
         "setupDataStreamTransport": { "$ref": "#/$definitions/setupDataStreamTransport"},
         "setupEndpoints": { "$ref": "#/$definitions/setupEndpoints"},
         "setupTransferTransport": { "$ref": "#/$definitions/setupTransferTransport"},
         "signalToNoiseRatio": { "$ref": "#/$definitions/signalToNoiseRatio"},
         "siriInputType": { "$ref": "#/$definitions/siriInputType"},
         "slatType": { "$ref": "#/$definitions/slatType"},
         "sleepDiscoveryMode": { "$ref": "#/$definitions/sleepDiscoveryMode"},
         "sleepInterval": { "$ref": "#/$definitions/sleepInterval"},
         "smokeDetected": { "$ref": "#/$definitions/smokeDetected"},
         "softwareRevision": { "$ref": "#/$definitions/softwareRevision"},
         "statusActive": { "$ref": "#/$definitions/statusActive"},
         "statusFault": { "$ref": "#/$definitions/statusFault"},
         "statusJammed": { "$ref": "#/$definitions/statusJammed"},
         "statusLowBattery": { "$ref": "#/$definitions/statusLowBattery"},
         "statusTampered": { "$ref": "#/$definitions/statusTampered"},
         "streamingStatus": { "$ref": "#/$definitions/streamingStatus"},
         "sulphurDioxideDensity": { "$ref": "#/$definitions/sulphurDioxideDensity"},
         "supportedAudioRecordingConfiguration": { "$ref": "#/$definitions/supportedAudioRecordingConfiguration"},
         "supportedAudioStreamConfiguration": { "$ref": "#/$definitions/supportedAudioStreamConfiguration"},
         "supportedCameraRecordingConfiguration": { "$ref": "#/$definitions/supportedCameraRecordingConfiguration"},
         "supportedDataStreamTransportConfiguration": { "$ref": "#/$definitions/supportedDataStreamTransportConfiguration"},
         "supportedCharacteristicValueTransitionConfiguration": { "$ref": "#/$definitions/supportedCharacteristicValueTransitionConfiguration"},
         "supportedDiagnosticsSnapshot": { "$ref": "#/$definitions/supportedDiagnosticsSnapshot"},
         "supportedRTPConfiguration": { "$ref": "#/$definitions/supportedRTPConfiguration"},
         "supportedRouterConfiguration": { "$ref": "#/$definitions/supportedRouterConfiguration"},
         "supportedTransferTransportConfiguration": { "$ref": "#/$definitions/supportedTransferTransportConfiguration"},
         "supportedVideoRecordingConfiguration": { "$ref": "#/$definitions/supportedVideoRecordingConfiguration"},
         "supportedVideoStreamConfiguration": { "$ref": "#/$definitions/supportedVideoStreamConfiguration"},
         "swingMode": { "$ref": "#/$definitions/swingMode"},
         "targetAirPurifierState": { "$ref": "#/$definitions/targetAirPurifierState"},
         "targetAirQuality": { "$ref": "#/$definitions/targetAirQuality"},
         "targetControlList": { "$ref": "#/$definitions/targetControlList"},
         "targetControlSupportedConfiguration": { "$ref": "#/$definitions/targetControlSupportedConfiguration"},
         "targetDoorState": { "$ref": "#/$definitions/targetDoorState"},
         "targetFanState": { "$ref": "#/$definitions/targetFanState"},
         "targetHeaterCoolerState": { "$ref": "#/$definitions/targetHeaterCoolerState"},
         "targetHeatingCoolingState": { "$ref": "#/$definitions/targetHeatingCoolingState"},
         "targetHorizontalTiltAngle": { "$ref": "#/$definitions/targetHorizontalTiltAngle"},
         "targetHumidifierDehumidifierState": { "$ref": "#/$definitions/targetHumidifierDehumidifierState"},
         "targetMediaState": { "$ref": "#/$definitions/targetMediaState"},
         "targetPosition": { "$ref": "#/$definitions/targetPosition"},
         "targetRelativeHumidity": { "$ref": "#/$definitions/targetRelativeHumidity"},
         "targetSlatState": { "$ref": "#/$definitions/targetSlatState"},
         "targetTemperature": { "$ref": "#/$definitions/targetTemperature"},
         "targetTiltAngle": { "$ref": "#/$definitions/targetTiltAngle"},
         "targetVerticalTiltAngle": { "$ref": "#/$definitions/targetVerticalTiltAngle"},
         "targetVisibilityState": { "$ref": "#/$definitions/targetVisibilityState"},
         "temperatureDisplayUnits": { "$ref": "#/$definitions/temperatureDisplayUnits"},
         "thirdPartyCameraActive": { "$ref": "#/$definitions/thirdPartyCameraActive"},
         "timeUpdate": { "$ref": "#/$definitions/timeUpdate"},
         "transmitPower": { "$ref": "#/$definitions/transmitPower"},
         "transmitPowerMaximum": { "$ref": "#/$definitions/transmitPowerMaximum"},
         "tunnelConnectionTimeout": { "$ref": "#/$definitions/tunnelConnectionTimeout"},
         "tunneledAccessoryAdvertising": { "$ref": "#/$definitions/tunneledAccessoryAdvertising"},
         "tunneledAccessoryConnected": { "$ref": "#/$definitions/tunneledAccessoryConnected"},
         "tunneledAccessoryStateNumber": { "$ref": "#/$definitions/tunneledAccessoryStateNumber"},
         "vocDensity": { "$ref": "#/$definitions/vocDensity"},
         "valveType": { "$ref": "#/$definitions/valveType"},
         "version": { "$ref": "#/$definitions/version"},
         "videoAnalysisActive": { "$ref": "#/$definitions/videoAnalysisActive"},
         "volume": { "$ref": "#/$definitions/volume"},
         "volumeControlType": { "$ref": "#/$definitions/volumeControlType"},
         "volumeSelector": { "$ref": "#/$definitions/volumeSelector"},
         "wanConfigurationList": { "$ref": "#/$definitions/wanConfigurationList"},
         "wanStatusList": { "$ref": "#/$definitions/wanStatusList"},
         "wakeConfiguration": { "$ref": "#/$definitions/wakeConfiguration"},
         "waterLevel": { "$ref": "#/$definitions/waterLevel"},
         "wifiCapabilities": { "$ref": "#/$definitions/wifiCapabilities"},
         "wifiConfigurationControl": { "$ref": "#/$definitions/wifiConfigurationControl"},
         "wifiSatelliteStatus": { "$ref": "#/$definitions/wifiSatelliteStatus"},
         "polling": { "$ref": "#/$definitions/polling"},
         "state_cmd_prefix": { "$ref": "#/$definitions/state_cmd_prefix"},
         "state_cmd": { "$ref": "#/$definitions/state_cmd"},
         "state_cmd_suffix": { "$ref": "#/$definitions/state_cmd_suffix"}
      }
   },
   "layout":
   [
      {
         "key": "type",
         "$ref": "#/$definitions/type"
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
            "statusMsg",
            "allowTLV8",
            "outputConstants",
            "timeout",
            "stateChangeResponseTime",
            "interval"
         ]
      },
      {
         "title": " FakeGato Options",
         "type": "fieldset",
         "expandable": true,
         "items":
         [
            {
               "key": "storage", "flex": "1 1 50px",
               "notitle": false, "placeholder": "fs"
            },
            {
               "key": "storagePath", "flex": "1 1 50px",
               "notitle": false
            },
            {
               "key": "folder", "flex": "1 1 50px",
               "notitle": false
            },
            {
               "key": "keyPath", "flex": "1 1 50px",
               "notitle": false
            }
         ]
      },
      {
         "title": " QueueTypes",
         "type": "fieldset",
         "expandable": true,
         "items": [ {
            "key": "queueTypes",
            "$ref": "#/$definitions/queueTypes",
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
      }
      ,
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessControl Required Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessControl'].includes(model.type);"
         },
         "items":
         [
            "accessControlLevel"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryRuntimeInformation Required Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
         },
         "items":
         [
            "ping"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryInformation Required Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessoryInformation'].includes(model.type);"
         },
         "items":
         [
            "identify","manufacturer","model","name","serialNumber","firmwareRevision"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirPurifier Required Characteristics",
         "condition":
         {
            "functionBody": "return ['AirPurifier'].includes(model.type);"
         },
         "items":
         [
            "active","currentAirPurifierState","targetAirPurifierState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirQualitySensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['AirQualitySensor'].includes(model.type);"
         },
         "items":
         [
            "airQuality"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BatteryService Required Characteristics",
         "condition":
         {
            "functionBody": "return ['BatteryService'].includes(model.type);"
         },
         "items":
         [
            "batteryLevel","chargingState","statusLowBattery"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BridgeConfiguration Required Characteristics",
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
         "title": "BridgingState Required Characteristics",
         "condition":
         {
            "functionBody": "return ['BridgingState'].includes(model.type);"
         },
         "items":
         [
            "reachable","linkQuality","accessoryIdentifier","category"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraEventRecordingManagement Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type);"
         },
         "items":
         [
            "active","supportedCameraRecordingConfiguration","supportedVideoRecordingConfiguration","supportedAudioRecordingConfiguration","selectedCameraRecordingConfiguration"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraControl Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraControl'].includes(model.type);"
         },
         "items":
         [
            "on"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraRTPStreamManagement Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type);"
         },
         "items":
         [
            "supportedVideoStreamConfiguration","supportedAudioStreamConfiguration","supportedRTPConfiguration","selectedRTPStreamConfiguration","streamingStatus","setupEndpoints"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraOperatingMode Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
         },
         "items":
         [
            "eventSnapshotsActive","homeKitCameraActive"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonDioxideSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
         },
         "items":
         [
            "carbonDioxideDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonMonoxideSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
         },
         "items":
         [
            "carbonMonoxideDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ContactSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['ContactSensor'].includes(model.type);"
         },
         "items":
         [
            "contactSensorState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Diagnostics Required Characteristics",
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
         "title": "Door Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Door'].includes(model.type);"
         },
         "items":
         [
            "currentPosition","positionState","targetPosition"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "DoorBell Required Characteristics",
         "condition":
         {
            "functionBody": "return ['DoorBell'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fan Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Fan'].includes(model.type);"
         },
         "items":
         [
            "on"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv1 Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Fanv1'].includes(model.type);"
         },
         "items":
         [
            "on"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv2 Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Fanv2'].includes(model.type);"
         },
         "items":
         [
            "active"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Faucet Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Faucet'].includes(model.type);"
         },
         "items":
         [
            "active"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "FilterMaintenance Required Characteristics",
         "condition":
         {
            "functionBody": "return ['FilterMaintenance'].includes(model.type);"
         },
         "items":
         [
            "filterChangeIndication"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "GarageDoorOpener Required Characteristics",
         "condition":
         {
            "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
         },
         "items":
         [
            "currentDoorState","targetDoorState","obstructionDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HeaterCooler Required Characteristics",
         "condition":
         {
            "functionBody": "return ['HeaterCooler'].includes(model.type);"
         },
         "items":
         [
            "active","currentHeaterCoolerState","targetHeaterCoolerState","currentTemperature"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumidifierDehumidifier Required Characteristics",
         "condition":
         {
            "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
         },
         "items":
         [
            "currentRelativeHumidity","currentHumidifierDehumidifierState","targetHumidifierDehumidifierState","active"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumiditySensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['HumiditySensor'].includes(model.type);"
         },
         "items":
         [
            "currentRelativeHumidity"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "InputSource Required Characteristics",
         "condition":
         {
            "functionBody": "return ['InputSource'].includes(model.type);"
         },
         "items":
         [
            "configuredName","inputSourceType","isConfigured","currentVisibilityState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "IrrigationSystem Required Characteristics",
         "condition":
         {
            "functionBody": "return ['IrrigationSystem'].includes(model.type);"
         },
         "items":
         [
            "active","programMode","inUse"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LeakSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['LeakSensor'].includes(model.type);"
         },
         "items":
         [
            "leakDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LightSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['LightSensor'].includes(model.type);"
         },
         "items":
         [
            "currentAmbientLightLevel"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Lightbulb Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Lightbulb'].includes(model.type);"
         },
         "items":
         [
            "on"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockManagement Required Characteristics",
         "condition":
         {
            "functionBody": "return ['LockManagement'].includes(model.type);"
         },
         "items":
         [
            "lockControlPoint","version"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockMechanism Required Characteristics",
         "condition":
         {
            "functionBody": "return ['LockMechanism'].includes(model.type);"
         },
         "items":
         [
            "lockCurrentState","lockTargetState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Microphone Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Microphone'].includes(model.type);"
         },
         "items":
         [
            "mute"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "MotionSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['MotionSensor'].includes(model.type);"
         },
         "items":
         [
            "motionDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "OccupancySensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['OccupancySensor'].includes(model.type);"
         },
         "items":
         [
            "occupancyDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Outlet Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Outlet'].includes(model.type);"
         },
         "items":
         [
            "on","outletInUse"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Pairing Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Pairing'].includes(model.type);"
         },
         "items":
         [
            "listPairings","pairSetup","pairVerify","pairingFeatures"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "PowerManagement Required Characteristics",
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
         "title": "ProtocolInformation Required Characteristics",
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
         "title": "Relay Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Relay'].includes(model.type);"
         },
         "items":
         [
            "relayEnabled","relayState","relayControlPoint"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SecuritySystem Required Characteristics",
         "condition":
         {
            "functionBody": "return ['SecuritySystem'].includes(model.type);"
         },
         "items":
         [
            "securitySystemCurrentState","securitySystemTargetState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ServiceLabel Required Characteristics",
         "condition":
         {
            "functionBody": "return ['ServiceLabel'].includes(model.type);"
         },
         "items":
         [
            "serviceLabelNamespace"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Siri Required Characteristics",
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
         "title": "Slat Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Slat'].includes(model.type);"
         },
         "items":
         [
            "slatType","currentSlatState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmartSpeaker Required Characteristics",
         "condition":
         {
            "functionBody": "return ['SmartSpeaker'].includes(model.type);"
         },
         "items":
         [
            "currentMediaState","targetMediaState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmokeSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['SmokeSensor'].includes(model.type);"
         },
         "items":
         [
            "smokeDetected"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Speaker Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Speaker'].includes(model.type);"
         },
         "items":
         [
            "mute"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatefulProgrammableSwitch Required Characteristics",
         "condition":
         {
            "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent","programmableSwitchOutputState"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatelessProgrammableSwitch Required Characteristics",
         "condition":
         {
            "functionBody": "return ['StatelessProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "programmableSwitchEvent"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Switch Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Switch'].includes(model.type);"
         },
         "items":
         [
            "on"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TargetControl Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TargetControl'].includes(model.type);"
         },
         "items":
         [
            "activeIdentifier","active","buttonEvent"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TargetControlManagement Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TargetControlManagement'].includes(model.type);"
         },
         "items":
         [
            "targetControlSupportedConfiguration","targetControlList"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Television Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Television'].includes(model.type);"
         },
         "items":
         [
            "active","activeIdentifier","configuredName","remoteKey","sleepDiscoveryMode"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TelevisionSpeaker Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TelevisionSpeaker'].includes(model.type);"
         },
         "items":
         [
            "mute"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TemperatureSensor Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TemperatureSensor'].includes(model.type);"
         },
         "items":
         [
            "currentTemperature"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Thermostat Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Thermostat'].includes(model.type);"
         },
         "items":
         [
            "currentHeatingCoolingState","targetHeatingCoolingState","currentTemperature","targetTemperature","temperatureDisplayUnits"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TimeInformation Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TimeInformation'].includes(model.type);"
         },
         "items":
         [
            "currentTime","dayoftheWeek","timeUpdate"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TransferTransportManagement Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TransferTransportManagement'].includes(model.type);"
         },
         "items":
         [
            "supportedTransferTransportConfiguration","setupTransferTransport"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TunneledBTLEAccessoryService Required Characteristics",
         "condition":
         {
            "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
         },
         "items":
         [
            "name","accessoryIdentifier","tunneledAccessoryStateNumber","tunneledAccessoryConnected","tunneledAccessoryAdvertising","tunnelConnectionTimeout"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Valve Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Valve'].includes(model.type);"
         },
         "items":
         [
            "active","inUse","valveType"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WiFiRouter Required Characteristics",
         "condition":
         {
            "functionBody": "return ['WiFiRouter'].includes(model.type);"
         },
         "items":
         [
            "configuredName","managedNetworkEnable","networkAccessViolationControl","networkClientProfileControl","networkClientStatusControl","routerStatus","supportedRouterConfiguration","wanConfigurationList","wanStatusList"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WiFiSatellite Required Characteristics",
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
         "title": "Window Required Characteristics",
         "condition":
         {
            "functionBody": "return ['Window'].includes(model.type);"
         },
         "items":
         [
            "currentPosition","positionState","targetPosition"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WindowCovering Required Characteristics",
         "condition":
         {
            "functionBody": "return ['WindowCovering'].includes(model.type);"
         },
         "items":
         [
            "currentPosition","positionState","targetPosition"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessControl Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessControl'].includes(model.type);"
         },
         "items":
         [
            "passwordSetting"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryRuntimeInformation Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
         },
         "items":
         [
            "activityInterval","heartBeat","sleepInterval"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AccessoryInformation Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['AccessoryInformation'].includes(model.type);"
         },
         "items":
         [
            "hardwareRevision","accessoryFlags"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirPurifier Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['AirPurifier'].includes(model.type);"
         },
         "items":
         [
            "lockPhysicalControls","name","swingMode","rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "AirQualitySensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['AirQualitySensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name","ozoneDensity","nitrogenDioxideDensity","sulphurDioxideDensity","pm2_5Density","pm10Density","vocDensity","carbonMonoxideLevel","carbonDioxideLevel"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BatteryService Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['BatteryService'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BridgeConfiguration Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
         },
         "items":
         [
            "configureBridgedAccessoryStatus","discoverBridgedAccessories","discoveredBridgedAccessories","configureBridgedAccessory"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "BridgingState Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['BridgingState'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraEventRecordingManagement Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type);"
         },
         "items":
         [
            "recordingAudioActive"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraControl Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraControl'].includes(model.type);"
         },
         "items":
         [
            "currentHorizontalTiltAngle","currentVerticalTiltAngle","targetHorizontalTiltAngle","targetVerticalTiltAngle","nightVision","opticalZoom","digitalZoom","imageRotation","imageMirroring","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraRTPStreamManagement Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CameraOperatingMode Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
         },
         "items":
         [
            "manuallyDisabled","nightVision","thirdPartyCameraActive","cameraOperatingModeIndicator","periodicSnapshotsActive"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonDioxideSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusLowBattery","statusTampered","carbonDioxideLevel","carbonDioxidePeakLevel","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "CarbonMonoxideSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusLowBattery","statusTampered","carbonMonoxideLevel","carbonMonoxidePeakLevel","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ContactSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['ContactSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Door Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Door'].includes(model.type);"
         },
         "items":
         [
            "holdPosition","obstructionDetected","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "DoorBell Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['DoorBell'].includes(model.type);"
         },
         "items":
         [
            "brightness","volume","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fan Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Fan'].includes(model.type);"
         },
         "items":
         [
            "rotationDirection","rotationSpeed","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv1 Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Fanv1'].includes(model.type);"
         },
         "items":
         [
            "rotationDirection","rotationSpeed","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Fanv2 Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Fanv2'].includes(model.type);"
         },
         "items":
         [
            "currentFanState","targetFanState","lockPhysicalControls","name","rotationDirection","rotationSpeed","swingMode"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Faucet Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Faucet'].includes(model.type);"
         },
         "items":
         [
            "name","statusFault"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "FilterMaintenance Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['FilterMaintenance'].includes(model.type);"
         },
         "items":
         [
            "filterLifeLevel","resetFilterIndication","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "GarageDoorOpener Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
         },
         "items":
         [
            "lockCurrentState","lockTargetState","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HeaterCooler Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['HeaterCooler'].includes(model.type);"
         },
         "items":
         [
            "lockPhysicalControls","name","swingMode","coolingThresholdTemperature","heatingThresholdTemperature","temperatureDisplayUnits","rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumidifierDehumidifier Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
         },
         "items":
         [
            "lockPhysicalControls","name","swingMode","waterLevel","relativeHumidityDehumidifierThreshold","relativeHumidityHumidifierThreshold","rotationSpeed"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "HumiditySensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['HumiditySensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "InputSource Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['InputSource'].includes(model.type);"
         },
         "items":
         [
            "identifier","inputDeviceType","targetVisibilityState","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "IrrigationSystem Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['IrrigationSystem'].includes(model.type);"
         },
         "items":
         [
            "name","remainingDuration","statusFault"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LeakSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['LeakSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LightSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['LightSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Lightbulb Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Lightbulb'].includes(model.type);"
         },
         "items":
         [
            "brightness","hue","saturation","name","colorTemperature"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockManagement Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['LockManagement'].includes(model.type);"
         },
         "items":
         [
            "logs","audioFeedback","lockManagementAutoSecurityTimeout","administratorOnlyAccess","lockLastKnownAction","currentDoorState","motionDetected","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "LockMechanism Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['LockMechanism'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Microphone Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Microphone'].includes(model.type);"
         },
         "items":
         [
            "volume","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "MotionSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['MotionSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "OccupancySensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['OccupancySensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Outlet Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Outlet'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SecuritySystem Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['SecuritySystem'].includes(model.type);"
         },
         "items":
         [
            "statusFault","statusTampered","securitySystemAlarmType","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "ServiceLabel Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['ServiceLabel'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Slat Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Slat'].includes(model.type);"
         },
         "items":
         [
            "name","currentTiltAngle","targetTiltAngle","swingMode"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmartSpeaker Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['SmartSpeaker'].includes(model.type);"
         },
         "items":
         [
            "name","configuredName","volume","mute"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "SmokeSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['SmokeSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusTampered","statusLowBattery","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Speaker Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Speaker'].includes(model.type);"
         },
         "items":
         [
            "volume","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatefulProgrammableSwitch Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "StatelessProgrammableSwitch Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['StatelessProgrammableSwitch'].includes(model.type);"
         },
         "items":
         [
            "name","serviceLabelIndex"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Switch Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Switch'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TargetControl Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['TargetControl'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Television Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Television'].includes(model.type);"
         },
         "items":
         [
            "brightness","closedCaptions","displayOrder","currentMediaState","targetMediaState","pictureMode","powerModeSelection"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TelevisionSpeaker Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['TelevisionSpeaker'].includes(model.type);"
         },
         "items":
         [
            "active","volume","volumeControlType","volumeSelector","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TemperatureSensor Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['TemperatureSensor'].includes(model.type);"
         },
         "items":
         [
            "statusActive","statusFault","statusLowBattery","statusTampered","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Thermostat Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Thermostat'].includes(model.type);"
         },
         "items":
         [
            "currentRelativeHumidity","targetRelativeHumidity","coolingThresholdTemperature","heatingThresholdTemperature","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "TimeInformation Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['TimeInformation'].includes(model.type);"
         },
         "items":
         [
            "name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Valve Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Valve'].includes(model.type);"
         },
         "items":
         [
            "setDuration","remainingDuration","isConfigured","serviceLabelIndex","statusFault","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "Window Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['Window'].includes(model.type);"
         },
         "items":
         [
            "holdPosition","obstructionDetected","name"
         ]
      },
      {
         "type": "fieldset",
         "expandable": true,
         "title": "WindowCovering Optional Characteristics",
         "condition":
         {
            "functionBody": "return ['WindowCovering'].includes(model.type);"
         },
         "items":
         [
            "holdPosition","targetHorizontalTiltAngle","targetVerticalTiltAngle","currentHorizontalTiltAngle","currentVerticalTiltAngle","obstructionDetected","name"
         ]
      },
      {
         "title": " state_cmd Options",
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
