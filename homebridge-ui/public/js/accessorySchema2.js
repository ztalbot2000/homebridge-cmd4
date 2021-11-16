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
            "type": "boolean",
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
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Measured Air Particulate Size"
         },
         "airQuality":
         {
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
            "title": "appMatchingIdentifier",
            "type": "string",
            "description": "The Devices App Matching Identifier"
         },
         "audioFeedback":
         {
            "title": "audioFeedback",
            "type": "boolean",
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
            "type": "boolean",
            "description": "The State of the Camera's Operating Mode Indicator"
         },
         "carbonDioxideDetected":
         {
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
            "title": "closedCaptions",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "title": "coolingThresholdTemperature",
            "type": "number",
            "minimum": 10,
            "maximum": 35,
            "description": "The Current Cooling Threshold Temperature"
         },
         "currentAirPurifierState":
         {
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
            "title": "currentFanState",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Fans Current Operating State"
         },
         "currentHeaterCoolerState":
         {
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
            "title": "currentHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Current Horizontal Tilt Angle"
         },
         "currentHumidifierDehumidifierState":
         {
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
            "type": "boolean",
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
            "title": "eventTransmissionCounters",
            "type": "integer",
            "description": "The Event Transmission Counters"
         },
         "filterChangeIndication":
         {
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
            "type": "boolean",
            "description": "If Position Should Be Held"
         },
         "homeKitCameraActive":
         {
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
            "type": "boolean",
            "description": "The Devices Identify Status",
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            }
         },
         "imageMirroring":
         {
            "title": "imageMirroring",
            "type": "boolean",
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
            "title": "inputDeviceType",
            "type": "integer",
            "minimum": 0,
            "maximum": 6,
            "description": "The Input Devices Type"
         },
         "inputSourceType":
         {
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
            "title": "lockLastKnownAction",
            "type": "integer",
            "minimum": 0,
            "maximum": 10,
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
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "Is the Lock Physically Enabled/Disabled"
         },
         "lockTargetState":
         {
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
            "title": "manuallyDisabled",
            "type": "boolean",
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
            "type": "boolean",
            "description": "Is Motion Being Detected",
            "condition":
            {
               "functionBody": "return ['MotionSensor'].includes(model.type);"
            }
         },
         "mute":
         {
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
            "type": "boolean",
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
            "type": "boolean",
            "description": "Is Obstruction Currently Detected",
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            }
         },
         "occupancyDetected":
         {
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
            "type": "boolean",
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
            "type": "integer",
            "description": "Is the Periodic Snapshot Enabled/Disabled"
         },
         "pictureMode":
         {
            "title": "pictureMode",
            "type": "integer",
            "minimum": 0,
            "maximum": 13,
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
            "title": "powerModeSelection",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "type": "boolean",
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
            "type": "integer",
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
            "type": "boolean",
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
            "title": "resetFilterIndication",
            "type": "integer",
            "minimum": 1,
            "maximum": 1,
            "description": "If Reset Filter Indication "
         },
         "rotationDirection":
         {
            "title": "rotationDirection",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "title": "sleepInterval",
            "type": "integer",
            "minimum": 0,
            "description": "The Devices Sleep Interval"
         },
         "smokeDetected":
         {
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
            "title": "softwareRevision",
            "type": "string",
            "description": "The Devices Software Revision String"
         },
         "statusActive":
         {
            "title": "statusActive",
            "type": "boolean",
            "description": "If the Device is Active or Not"
         },
         "statusFault":
         {
            "title": "statusFault",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device has a Status Fault"
         },
         "statusJammed":
         {
            "title": "statusJammed",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "If the Device is in Jammed Status"
         },
         "statusLowBattery":
         {
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
            "title": "statusTampered",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The DevicesnCurrent Swing Mode"
         },
         "targetAirPurifierState":
         {
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
            "title": "targetAirQuality",
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
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
            "title": "targetFanState",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Fans Requested State"
         },
         "targetHeaterCoolerState":
         {
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
            "title": "targetHorizontalTiltAngle",
            "type": "integer",
            "minimum": -90,
            "maximum": 90,
            "description": "The Requested Horizontal Tilt Angle"
         },
         "targetHumidifierDehumidifierState":
         {
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
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
            "description": "The Devices Requested Visibility State"
         },
         "temperatureDisplayUnits":
         {
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
            "title": "thirdPartyCameraActive",
            "type": "integer",
            "description": "The ON/OFF Auxiliary Camera State"
         },
         "timeUpdate":
         {
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
            "type": "boolean",
            "description": "If the Device is Currently Tunneled Advertising",
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            }
         },
         "tunneledAccessoryConnected":
         {
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
            "type": "integer",
            "minimum": 0,
            "maximum": 3,
            "description": "The Devices Volume Control Type"
         },
         "volumeSelector":
         {
            "title": "volumeSelector",
            "type": "integer",
            "minimum": 0,
            "maximum": 1,
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
            "type": "integer",
            "minimum": 0,
            "maximum": 2,
            "description": "The Devices WiFi Satellite Status",
            "condition":
            {
               "functionBody": "return ['WiFiSatellite'].includes(model.type);"
            }
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
         "polling":
         {
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
         },
         "AccessControl" :{
            "condition":
            {
               "functionBody": "return ['AccessControl'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/AccessControl"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "accessControlLevel": { "$ref": "#/$defs/accessControlLevel"},
               "passwordSetting": { "$ref": "#/$defs/passwordSetting"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "AccessoryRuntimeInformation" :{
            "condition":
            {
               "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/AccessoryRuntimeInformation"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "ping": { "$ref": "#/$defs/ping"},
               "activityInterval": { "$ref": "#/$defs/activityInterval"},
               "heartBeat": { "$ref": "#/$defs/heartBeat"},
               "sleepInterval": { "$ref": "#/$defs/sleepInterval"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "AccessoryInformation" :{
            "condition":
            {
               "functionBody": "return ['AccessoryInformation'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/AccessoryInformation"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "identify": { "$ref": "#/$defs/identify"},
               "manufacturer": { "$ref": "#/$defs/manufacturer"},
               "model": { "$ref": "#/$defs/model"},
               "serialNumber": { "$ref": "#/$defs/serialNumber"},
               "firmwareRevision": { "$ref": "#/$defs/firmwareRevision"},
               "hardwareRevision": { "$ref": "#/$defs/hardwareRevision"},
               "accessoryFlags": { "$ref": "#/$defs/accessoryFlags"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "AirPurifier" :{
            "condition":
            {
               "functionBody": "return ['AirPurifier'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/AirPurifier"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "currentAirPurifierState": { "$ref": "#/$defs/currentAirPurifierState"},
               "targetAirPurifierState": { "$ref": "#/$defs/targetAirPurifierState"},
               "lockPhysicalControls": { "$ref": "#/$defs/lockPhysicalControls"},
               "swingMode": { "$ref": "#/$defs/swingMode"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "AirQualitySensor" :{
            "condition":
            {
               "functionBody": "return ['AirQualitySensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/AirQualitySensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "airQuality": { "$ref": "#/$defs/airQuality"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "ozoneDensity": { "$ref": "#/$defs/ozoneDensity"},
               "nitrogenDioxideDensity": { "$ref": "#/$defs/nitrogenDioxideDensity"},
               "sulphurDioxideDensity": { "$ref": "#/$defs/sulphurDioxideDensity"},
               "pm2_5Density": { "$ref": "#/$defs/pm2_5Density"},
               "pm10Density": { "$ref": "#/$defs/pm10Density"},
               "vocDensity": { "$ref": "#/$defs/vocDensity"},
               "carbonMonoxideLevel": { "$ref": "#/$defs/carbonMonoxideLevel"},
               "carbonDioxideLevel": { "$ref": "#/$defs/carbonDioxideLevel"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "BatteryService" :{
            "condition":
            {
               "functionBody": "return ['BatteryService'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/BatteryService"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "batteryLevel": { "$ref": "#/$defs/batteryLevel"},
               "chargingState": { "$ref": "#/$defs/chargingState"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "BridgeConfiguration" :{
            "condition":
            {
               "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/BridgeConfiguration"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "configureBridgedAccessoryStatus": { "$ref": "#/$defs/configureBridgedAccessoryStatus"},
               "discoverBridgedAccessories": { "$ref": "#/$defs/discoverBridgedAccessories"},
               "discoveredBridgedAccessories": { "$ref": "#/$defs/discoveredBridgedAccessories"},
               "configureBridgedAccessory": { "$ref": "#/$defs/configureBridgedAccessory"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "BridgingState" :{
            "condition":
            {
               "functionBody": "return ['BridgingState'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/BridgingState"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "reachable": { "$ref": "#/$defs/reachable"},
               "linkQuality": { "$ref": "#/$defs/linkQuality"},
               "accessoryIdentifier": { "$ref": "#/$defs/accessoryIdentifier"},
               "category": { "$ref": "#/$defs/category"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CameraEventRecordingManagement" :{
            "condition":
            {
               "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CameraEventRecordingManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "supportedCameraRecordingConfiguration": { "$ref": "#/$defs/supportedCameraRecordingConfiguration"},
               "supportedVideoRecordingConfiguration": { "$ref": "#/$defs/supportedVideoRecordingConfiguration"},
               "supportedAudioRecordingConfiguration": { "$ref": "#/$defs/supportedAudioRecordingConfiguration"},
               "selectedCameraRecordingConfiguration": { "$ref": "#/$defs/selectedCameraRecordingConfiguration"},
               "recordingAudioActive": { "$ref": "#/$defs/recordingAudioActive"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CameraControl" :{
            "condition":
            {
               "functionBody": "return ['CameraControl'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CameraControl"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "currentHorizontalTiltAngle": { "$ref": "#/$defs/currentHorizontalTiltAngle"},
               "currentVerticalTiltAngle": { "$ref": "#/$defs/currentVerticalTiltAngle"},
               "targetHorizontalTiltAngle": { "$ref": "#/$defs/targetHorizontalTiltAngle"},
               "targetVerticalTiltAngle": { "$ref": "#/$defs/targetVerticalTiltAngle"},
               "nightVision": { "$ref": "#/$defs/nightVision"},
               "opticalZoom": { "$ref": "#/$defs/opticalZoom"},
               "digitalZoom": { "$ref": "#/$defs/digitalZoom"},
               "imageRotation": { "$ref": "#/$defs/imageRotation"},
               "imageMirroring": { "$ref": "#/$defs/imageMirroring"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CameraRTPStreamManagement" :{
            "condition":
            {
               "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CameraRTPStreamManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "supportedVideoStreamConfiguration": { "$ref": "#/$defs/supportedVideoStreamConfiguration"},
               "supportedAudioStreamConfiguration": { "$ref": "#/$defs/supportedAudioStreamConfiguration"},
               "supportedRTPConfiguration": { "$ref": "#/$defs/supportedRTPConfiguration"},
               "selectedRTPStreamConfiguration": { "$ref": "#/$defs/selectedRTPStreamConfiguration"},
               "streamingStatus": { "$ref": "#/$defs/streamingStatus"},
               "setupEndpoints": { "$ref": "#/$defs/setupEndpoints"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CameraOperatingMode" :{
            "condition":
            {
               "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CameraOperatingMode"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "eventSnapshotsActive": { "$ref": "#/$defs/eventSnapshotsActive"},
               "homeKitCameraActive": { "$ref": "#/$defs/homeKitCameraActive"},
               "manuallyDisabled": { "$ref": "#/$defs/manuallyDisabled"},
               "nightVision": { "$ref": "#/$defs/nightVision"},
               "thirdPartyCameraActive": { "$ref": "#/$defs/thirdPartyCameraActive"},
               "cameraOperatingModeIndicator": { "$ref": "#/$defs/cameraOperatingModeIndicator"},
               "periodicSnapshotsActive": { "$ref": "#/$defs/periodicSnapshotsActive"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CarbonDioxideSensor" :{
            "condition":
            {
               "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CarbonDioxideSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "carbonDioxideDetected": { "$ref": "#/$defs/carbonDioxideDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "carbonDioxideLevel": { "$ref": "#/$defs/carbonDioxideLevel"},
               "carbonDioxidePeakLevel": { "$ref": "#/$defs/carbonDioxidePeakLevel"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "CarbonMonoxideSensor" :{
            "condition":
            {
               "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/CarbonMonoxideSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "carbonMonoxideDetected": { "$ref": "#/$defs/carbonMonoxideDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "carbonMonoxideLevel": { "$ref": "#/$defs/carbonMonoxideLevel"},
               "carbonMonoxidePeakLevel": { "$ref": "#/$defs/carbonMonoxidePeakLevel"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "ContactSensor" :{
            "condition":
            {
               "functionBody": "return ['ContactSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/ContactSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "contactSensorState": { "$ref": "#/$defs/contactSensorState"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Diagnostics" :{
            "condition":
            {
               "functionBody": "return ['Diagnostics'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Diagnostics"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "supportedDiagnosticsSnapshot": { "$ref": "#/$defs/supportedDiagnosticsSnapshot"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Door" :{
            "condition":
            {
               "functionBody": "return ['Door'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Door"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentPosition": { "$ref": "#/$defs/currentPosition"},
               "positionState": { "$ref": "#/$defs/positionState"},
               "targetPosition": { "$ref": "#/$defs/targetPosition"},
               "holdPosition": { "$ref": "#/$defs/holdPosition"},
               "obstructionDetected": { "$ref": "#/$defs/obstructionDetected"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "DoorBell" :{
            "condition":
            {
               "functionBody": "return ['DoorBell'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/DoorBell"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "programmableSwitchEvent": { "$ref": "#/$defs/programmableSwitchEvent"},
               "brightness": { "$ref": "#/$defs/brightness"},
               "volume": { "$ref": "#/$defs/volume"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Fan" :{
            "condition":
            {
               "functionBody": "return ['Fan'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Fan"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "rotationDirection": { "$ref": "#/$defs/rotationDirection"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Fanv1" :{
            "condition":
            {
               "functionBody": "return ['Fanv1'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Fanv1"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "rotationDirection": { "$ref": "#/$defs/rotationDirection"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Fanv2" :{
            "condition":
            {
               "functionBody": "return ['Fanv2'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Fanv2"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "currentFanState": { "$ref": "#/$defs/currentFanState"},
               "targetFanState": { "$ref": "#/$defs/targetFanState"},
               "lockPhysicalControls": { "$ref": "#/$defs/lockPhysicalControls"},
               "rotationDirection": { "$ref": "#/$defs/rotationDirection"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "swingMode": { "$ref": "#/$defs/swingMode"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Faucet" :{
            "condition":
            {
               "functionBody": "return ['Faucet'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Faucet"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "FilterMaintenance" :{
            "condition":
            {
               "functionBody": "return ['FilterMaintenance'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/FilterMaintenance"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "filterChangeIndication": { "$ref": "#/$defs/filterChangeIndication"},
               "filterLifeLevel": { "$ref": "#/$defs/filterLifeLevel"},
               "resetFilterIndication": { "$ref": "#/$defs/resetFilterIndication"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "GarageDoorOpener" :{
            "condition":
            {
               "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/GarageDoorOpener"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentDoorState": { "$ref": "#/$defs/currentDoorState"},
               "targetDoorState": { "$ref": "#/$defs/targetDoorState"},
               "obstructionDetected": { "$ref": "#/$defs/obstructionDetected"},
               "lockCurrentState": { "$ref": "#/$defs/lockCurrentState"},
               "lockTargetState": { "$ref": "#/$defs/lockTargetState"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "HeaterCooler" :{
            "condition":
            {
               "functionBody": "return ['HeaterCooler'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/HeaterCooler"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "currentHeaterCoolerState": { "$ref": "#/$defs/currentHeaterCoolerState"},
               "targetHeaterCoolerState": { "$ref": "#/$defs/targetHeaterCoolerState"},
               "currentTemperature": { "$ref": "#/$defs/currentTemperature"},
               "lockPhysicalControls": { "$ref": "#/$defs/lockPhysicalControls"},
               "swingMode": { "$ref": "#/$defs/swingMode"},
               "coolingThresholdTemperature": { "$ref": "#/$defs/coolingThresholdTemperature"},
               "heatingThresholdTemperature": { "$ref": "#/$defs/heatingThresholdTemperature"},
               "temperatureDisplayUnits": { "$ref": "#/$defs/temperatureDisplayUnits"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "HumidifierDehumidifier" :{
            "condition":
            {
               "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/HumidifierDehumidifier"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentRelativeHumidity": { "$ref": "#/$defs/currentRelativeHumidity"},
               "currentHumidifierDehumidifierState": { "$ref": "#/$defs/currentHumidifierDehumidifierState"},
               "targetHumidifierDehumidifierState": { "$ref": "#/$defs/targetHumidifierDehumidifierState"},
               "active": { "$ref": "#/$defs/active"},
               "lockPhysicalControls": { "$ref": "#/$defs/lockPhysicalControls"},
               "swingMode": { "$ref": "#/$defs/swingMode"},
               "waterLevel": { "$ref": "#/$defs/waterLevel"},
               "relativeHumidityDehumidifierThreshold": { "$ref": "#/$defs/relativeHumidityDehumidifierThreshold"},
               "relativeHumidityHumidifierThreshold": { "$ref": "#/$defs/relativeHumidityHumidifierThreshold"},
               "rotationSpeed": { "$ref": "#/$defs/rotationSpeed"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "HumiditySensor" :{
            "condition":
            {
               "functionBody": "return ['HumiditySensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/HumiditySensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentRelativeHumidity": { "$ref": "#/$defs/currentRelativeHumidity"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "InputSource" :{
            "condition":
            {
               "functionBody": "return ['InputSource'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/InputSource"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "configuredName": { "$ref": "#/$defs/configuredName"},
               "inputSourceType": { "$ref": "#/$defs/inputSourceType"},
               "isConfigured": { "$ref": "#/$defs/isConfigured"},
               "currentVisibilityState": { "$ref": "#/$defs/currentVisibilityState"},
               "identifier": { "$ref": "#/$defs/identifier"},
               "inputDeviceType": { "$ref": "#/$defs/inputDeviceType"},
               "targetVisibilityState": { "$ref": "#/$defs/targetVisibilityState"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "IrrigationSystem" :{
            "condition":
            {
               "functionBody": "return ['IrrigationSystem'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/IrrigationSystem"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "programMode": { "$ref": "#/$defs/programMode"},
               "inUse": { "$ref": "#/$defs/inUse"},
               "remainingDuration": { "$ref": "#/$defs/remainingDuration"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "LeakSensor" :{
            "condition":
            {
               "functionBody": "return ['LeakSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/LeakSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "leakDetected": { "$ref": "#/$defs/leakDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "LightSensor" :{
            "condition":
            {
               "functionBody": "return ['LightSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/LightSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentAmbientLightLevel": { "$ref": "#/$defs/currentAmbientLightLevel"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Lightbulb" :{
            "condition":
            {
               "functionBody": "return ['Lightbulb'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Lightbulb"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "brightness": { "$ref": "#/$defs/brightness"},
               "hue": { "$ref": "#/$defs/hue"},
               "saturation": { "$ref": "#/$defs/saturation"},
               "colorTemperature": { "$ref": "#/$defs/colorTemperature"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "LockManagement" :{
            "condition":
            {
               "functionBody": "return ['LockManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/LockManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "lockControlPoint": { "$ref": "#/$defs/lockControlPoint"},
               "version": { "$ref": "#/$defs/version"},
               "logs": { "$ref": "#/$defs/logs"},
               "audioFeedback": { "$ref": "#/$defs/audioFeedback"},
               "lockManagementAutoSecurityTimeout": { "$ref": "#/$defs/lockManagementAutoSecurityTimeout"},
               "administratorOnlyAccess": { "$ref": "#/$defs/administratorOnlyAccess"},
               "lockLastKnownAction": { "$ref": "#/$defs/lockLastKnownAction"},
               "currentDoorState": { "$ref": "#/$defs/currentDoorState"},
               "motionDetected": { "$ref": "#/$defs/motionDetected"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "LockMechanism" :{
            "condition":
            {
               "functionBody": "return ['LockMechanism'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/LockMechanism"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "lockCurrentState": { "$ref": "#/$defs/lockCurrentState"},
               "lockTargetState": { "$ref": "#/$defs/lockTargetState"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Microphone" :{
            "condition":
            {
               "functionBody": "return ['Microphone'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Microphone"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "mute": { "$ref": "#/$defs/mute"},
               "volume": { "$ref": "#/$defs/volume"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "MotionSensor" :{
            "condition":
            {
               "functionBody": "return ['MotionSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/MotionSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "motionDetected": { "$ref": "#/$defs/motionDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "OccupancySensor" :{
            "condition":
            {
               "functionBody": "return ['OccupancySensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/OccupancySensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "occupancyDetected": { "$ref": "#/$defs/occupancyDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Outlet" :{
            "condition":
            {
               "functionBody": "return ['Outlet'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Outlet"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "outletInUse": { "$ref": "#/$defs/outletInUse"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Pairing" :{
            "condition":
            {
               "functionBody": "return ['Pairing'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Pairing"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "listPairings": { "$ref": "#/$defs/listPairings"},
               "pairSetup": { "$ref": "#/$defs/pairSetup"},
               "pairVerify": { "$ref": "#/$defs/pairVerify"},
               "pairingFeatures": { "$ref": "#/$defs/pairingFeatures"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "PowerManagement" :{
            "condition":
            {
               "functionBody": "return ['PowerManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/PowerManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "wakeConfiguration": { "$ref": "#/$defs/wakeConfiguration"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "ProtocolInformation" :{
            "condition":
            {
               "functionBody": "return ['ProtocolInformation'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/ProtocolInformation"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "version": { "$ref": "#/$defs/version"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Relay" :{
            "condition":
            {
               "functionBody": "return ['Relay'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Relay"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "relayEnabled": { "$ref": "#/$defs/relayEnabled"},
               "relayState": { "$ref": "#/$defs/relayState"},
               "relayControlPoint": { "$ref": "#/$defs/relayControlPoint"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "SecuritySystem" :{
            "condition":
            {
               "functionBody": "return ['SecuritySystem'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/SecuritySystem"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "securitySystemCurrentState": { "$ref": "#/$defs/securitySystemCurrentState"},
               "securitySystemTargetState": { "$ref": "#/$defs/securitySystemTargetState"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "securitySystemAlarmType": { "$ref": "#/$defs/securitySystemAlarmType"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "ServiceLabel" :{
            "condition":
            {
               "functionBody": "return ['ServiceLabel'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/ServiceLabel"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "serviceLabelNamespace": { "$ref": "#/$defs/serviceLabelNamespace"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Siri" :{
            "condition":
            {
               "functionBody": "return ['Siri'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Siri"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "siriInputType": { "$ref": "#/$defs/siriInputType"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Slat" :{
            "condition":
            {
               "functionBody": "return ['Slat'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Slat"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "slatType": { "$ref": "#/$defs/slatType"},
               "currentSlatState": { "$ref": "#/$defs/currentSlatState"},
               "currentTiltAngle": { "$ref": "#/$defs/currentTiltAngle"},
               "targetTiltAngle": { "$ref": "#/$defs/targetTiltAngle"},
               "swingMode": { "$ref": "#/$defs/swingMode"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "SmartSpeaker" :{
            "condition":
            {
               "functionBody": "return ['SmartSpeaker'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/SmartSpeaker"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentMediaState": { "$ref": "#/$defs/currentMediaState"},
               "targetMediaState": { "$ref": "#/$defs/targetMediaState"},
               "configuredName": { "$ref": "#/$defs/configuredName"},
               "volume": { "$ref": "#/$defs/volume"},
               "mute": { "$ref": "#/$defs/mute"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "SmokeSensor" :{
            "condition":
            {
               "functionBody": "return ['SmokeSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/SmokeSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "smokeDetected": { "$ref": "#/$defs/smokeDetected"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Speaker" :{
            "condition":
            {
               "functionBody": "return ['Speaker'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Speaker"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "mute": { "$ref": "#/$defs/mute"},
               "volume": { "$ref": "#/$defs/volume"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "StatefulProgrammableSwitch" :{
            "condition":
            {
               "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/StatefulProgrammableSwitch"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "programmableSwitchEvent": { "$ref": "#/$defs/programmableSwitchEvent"},
               "programmableSwitchOutputState": { "$ref": "#/$defs/programmableSwitchOutputState"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "StatelessProgrammableSwitch" :{
            "condition":
            {
               "functionBody": "return ['StatelessProgrammableSwitch'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/StatelessProgrammableSwitch"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "programmableSwitchEvent": { "$ref": "#/$defs/programmableSwitchEvent"},
               "serviceLabelIndex": { "$ref": "#/$defs/serviceLabelIndex"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Switch" :{
            "condition":
            {
               "functionBody": "return ['Switch'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Switch"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "on": { "$ref": "#/$defs/on"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TargetControl" :{
            "condition":
            {
               "functionBody": "return ['TargetControl'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TargetControl"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "activeIdentifier": { "$ref": "#/$defs/activeIdentifier"},
               "active": { "$ref": "#/$defs/active"},
               "buttonEvent": { "$ref": "#/$defs/buttonEvent"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TargetControlManagement" :{
            "condition":
            {
               "functionBody": "return ['TargetControlManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TargetControlManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "targetControlSupportedConfiguration": { "$ref": "#/$defs/targetControlSupportedConfiguration"},
               "targetControlList": { "$ref": "#/$defs/targetControlList"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Television" :{
            "condition":
            {
               "functionBody": "return ['Television'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Television"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "activeIdentifier": { "$ref": "#/$defs/activeIdentifier"},
               "configuredName": { "$ref": "#/$defs/configuredName"},
               "remoteKey": { "$ref": "#/$defs/remoteKey"},
               "sleepDiscoveryMode": { "$ref": "#/$defs/sleepDiscoveryMode"},
               "brightness": { "$ref": "#/$defs/brightness"},
               "closedCaptions": { "$ref": "#/$defs/closedCaptions"},
               "displayOrder": { "$ref": "#/$defs/displayOrder"},
               "currentMediaState": { "$ref": "#/$defs/currentMediaState"},
               "targetMediaState": { "$ref": "#/$defs/targetMediaState"},
               "pictureMode": { "$ref": "#/$defs/pictureMode"},
               "powerModeSelection": { "$ref": "#/$defs/powerModeSelection"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TelevisionSpeaker" :{
            "condition":
            {
               "functionBody": "return ['TelevisionSpeaker'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TelevisionSpeaker"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "mute": { "$ref": "#/$defs/mute"},
               "active": { "$ref": "#/$defs/active"},
               "volume": { "$ref": "#/$defs/volume"},
               "volumeControlType": { "$ref": "#/$defs/volumeControlType"},
               "volumeSelector": { "$ref": "#/$defs/volumeSelector"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TemperatureSensor" :{
            "condition":
            {
               "functionBody": "return ['TemperatureSensor'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TemperatureSensor"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentTemperature": { "$ref": "#/$defs/currentTemperature"},
               "statusActive": { "$ref": "#/$defs/statusActive"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "statusLowBattery": { "$ref": "#/$defs/statusLowBattery"},
               "statusTampered": { "$ref": "#/$defs/statusTampered"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Thermostat" :{
            "condition":
            {
               "functionBody": "return ['Thermostat'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Thermostat"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentHeatingCoolingState": { "$ref": "#/$defs/currentHeatingCoolingState"},
               "targetHeatingCoolingState": { "$ref": "#/$defs/targetHeatingCoolingState"},
               "currentTemperature": { "$ref": "#/$defs/currentTemperature"},
               "targetTemperature": { "$ref": "#/$defs/targetTemperature"},
               "temperatureDisplayUnits": { "$ref": "#/$defs/temperatureDisplayUnits"},
               "currentRelativeHumidity": { "$ref": "#/$defs/currentRelativeHumidity"},
               "targetRelativeHumidity": { "$ref": "#/$defs/targetRelativeHumidity"},
               "coolingThresholdTemperature": { "$ref": "#/$defs/coolingThresholdTemperature"},
               "heatingThresholdTemperature": { "$ref": "#/$defs/heatingThresholdTemperature"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TimeInformation" :{
            "condition":
            {
               "functionBody": "return ['TimeInformation'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TimeInformation"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentTime": { "$ref": "#/$defs/currentTime"},
               "dayoftheWeek": { "$ref": "#/$defs/dayoftheWeek"},
               "timeUpdate": { "$ref": "#/$defs/timeUpdate"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TransferTransportManagement" :{
            "condition":
            {
               "functionBody": "return ['TransferTransportManagement'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TransferTransportManagement"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "supportedTransferTransportConfiguration": { "$ref": "#/$defs/supportedTransferTransportConfiguration"},
               "setupTransferTransport": { "$ref": "#/$defs/setupTransferTransport"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "TunneledBTLEAccessoryService" :{
            "condition":
            {
               "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/TunneledBTLEAccessoryService"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "accessoryIdentifier": { "$ref": "#/$defs/accessoryIdentifier"},
               "tunneledAccessoryStateNumber": { "$ref": "#/$defs/tunneledAccessoryStateNumber"},
               "tunneledAccessoryConnected": { "$ref": "#/$defs/tunneledAccessoryConnected"},
               "tunneledAccessoryAdvertising": { "$ref": "#/$defs/tunneledAccessoryAdvertising"},
               "tunnelConnectionTimeout": { "$ref": "#/$defs/tunnelConnectionTimeout"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Valve" :{
            "condition":
            {
               "functionBody": "return ['Valve'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Valve"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "active": { "$ref": "#/$defs/active"},
               "inUse": { "$ref": "#/$defs/inUse"},
               "valveType": { "$ref": "#/$defs/valveType"},
               "setDuration": { "$ref": "#/$defs/setDuration"},
               "remainingDuration": { "$ref": "#/$defs/remainingDuration"},
               "isConfigured": { "$ref": "#/$defs/isConfigured"},
               "serviceLabelIndex": { "$ref": "#/$defs/serviceLabelIndex"},
               "statusFault": { "$ref": "#/$defs/statusFault"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "WiFiRouter" :{
            "condition":
            {
               "functionBody": "return ['WiFiRouter'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/WiFiRouter"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "configuredName": { "$ref": "#/$defs/configuredName"},
               "managedNetworkEnable": { "$ref": "#/$defs/managedNetworkEnable"},
               "networkAccessViolationControl": { "$ref": "#/$defs/networkAccessViolationControl"},
               "networkClientProfileControl": { "$ref": "#/$defs/networkClientProfileControl"},
               "networkClientStatusControl": { "$ref": "#/$defs/networkClientStatusControl"},
               "routerStatus": { "$ref": "#/$defs/routerStatus"},
               "supportedRouterConfiguration": { "$ref": "#/$defs/supportedRouterConfiguration"},
               "wanConfigurationList": { "$ref": "#/$defs/wanConfigurationList"},
               "wanStatusList": { "$ref": "#/$defs/wanStatusList"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "WiFiSatellite" :{
            "condition":
            {
               "functionBody": "return ['WiFiSatellite'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/WiFiSatellite"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "wifiSatelliteStatus": { "$ref": "#/$defs/wifiSatelliteStatus"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "Window" :{
            "condition":
            {
               "functionBody": "return ['Window'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/Window"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentPosition": { "$ref": "#/$defs/currentPosition"},
               "positionState": { "$ref": "#/$defs/positionState"},
               "targetPosition": { "$ref": "#/$defs/targetPosition"},
               "holdPosition": { "$ref": "#/$defs/holdPosition"},
               "obstructionDetected": { "$ref": "#/$defs/obstructionDetected"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         },
         "WindowCovering" :{
            "condition":
            {
               "functionBody": "return ['WindowCovering'].includes(model.type);"
            },
            "items": {
               "type": { "$ref": "#/defs/WindowCovering"},
               "name": { "$ref": "#/$defs/name"},
               "displayName": { "$ref": "#/$defs/displayName"},
               "subType": { "$ref": "#/$defs/subType"},
               "debug": { "$ref": "#/$defs/debug"},
               "publishExternally": { "$ref": "#/$defs/publishExternally"},
               "allowTLV8": { "$ref": "#/$defs/allowTLV8"},
               "outputConstants": { "$ref": "#/$defs/outputConstants"},
               "statusMsg": { "$ref": "#/$defs/statusMsg"},
               "interval": { "$ref": "#/$defs/interval"},
               "timeout": { "$ref": "#/$defs/timeout"},
               "stateChangeResponseTime": { "$ref": "#/$defs/stateChangeResponseTime"},
               "queue": { "$ref": "#/$defs/queue"},
               "currentPosition": { "$ref": "#/$defs/currentPosition"},
               "positionState": { "$ref": "#/$defs/positionState"},
               "targetPosition": { "$ref": "#/$defs/targetPosition"},
               "holdPosition": { "$ref": "#/$defs/holdPosition"},
               "targetHorizontalTiltAngle": { "$ref": "#/$defs/targetHorizontalTiltAngle"},
               "targetVerticalTiltAngle": { "$ref": "#/$defs/targetVerticalTiltAngle"},
               "currentHorizontalTiltAngle": { "$ref": "#/$defs/currentHorizontalTiltAngle"},
               "currentVerticalTiltAngle": { "$ref": "#/$defs/currentVerticalTiltAngle"},
               "obstructionDetected": { "$ref": "#/$defs/obstructionDetected"},
               "polling": { "$ref": "#/$defs/polling"},
               "state_cmd_prefix": { "$ref": "#/$defs/state_cmd_prefix"},
               "state_cmd": { "$ref": "#/$defs/state_cmd"},
               "state_cmd_suffix": { "$ref": "#/$defs/state_cmd_suffix"},
               "fakegato": { "$ref": "#/$defs/fakegato"}}
         }
      },
      "properties":
      {
         "AccessControl": { "$ref": "#/$defs/AccessControl"},
         "AccessoryRuntimeInformation": { "$ref": "#/$defs/AccessoryRuntimeInformation"},
         "AccessoryInformation": { "$ref": "#/$defs/AccessoryInformation"},
         "AirPurifier": { "$ref": "#/$defs/AirPurifier"},
         "AirQualitySensor": { "$ref": "#/$defs/AirQualitySensor"},
         "BatteryService": { "$ref": "#/$defs/BatteryService"},
         "BridgeConfiguration": { "$ref": "#/$defs/BridgeConfiguration"},
         "BridgingState": { "$ref": "#/$defs/BridgingState"},
         "CameraEventRecordingManagement": { "$ref": "#/$defs/CameraEventRecordingManagement"},
         "CameraControl": { "$ref": "#/$defs/CameraControl"},
         "CameraRTPStreamManagement": { "$ref": "#/$defs/CameraRTPStreamManagement"},
         "CameraOperatingMode": { "$ref": "#/$defs/CameraOperatingMode"},
         "CarbonDioxideSensor": { "$ref": "#/$defs/CarbonDioxideSensor"},
         "CarbonMonoxideSensor": { "$ref": "#/$defs/CarbonMonoxideSensor"},
         "ContactSensor": { "$ref": "#/$defs/ContactSensor"},
         "Diagnostics": { "$ref": "#/$defs/Diagnostics"},
         "Door": { "$ref": "#/$defs/Door"},
         "DoorBell": { "$ref": "#/$defs/DoorBell"},
         "Fan": { "$ref": "#/$defs/Fan"},
         "Fanv1": { "$ref": "#/$defs/Fanv1"},
         "Fanv2": { "$ref": "#/$defs/Fanv2"},
         "Faucet": { "$ref": "#/$defs/Faucet"},
         "FilterMaintenance": { "$ref": "#/$defs/FilterMaintenance"},
         "GarageDoorOpener": { "$ref": "#/$defs/GarageDoorOpener"},
         "HeaterCooler": { "$ref": "#/$defs/HeaterCooler"},
         "HumidifierDehumidifier": { "$ref": "#/$defs/HumidifierDehumidifier"},
         "HumiditySensor": { "$ref": "#/$defs/HumiditySensor"},
         "InputSource": { "$ref": "#/$defs/InputSource"},
         "IrrigationSystem": { "$ref": "#/$defs/IrrigationSystem"},
         "LeakSensor": { "$ref": "#/$defs/LeakSensor"},
         "LightSensor": { "$ref": "#/$defs/LightSensor"},
         "Lightbulb": { "$ref": "#/$defs/Lightbulb"},
         "LockManagement": { "$ref": "#/$defs/LockManagement"},
         "LockMechanism": { "$ref": "#/$defs/LockMechanism"},
         "Microphone": { "$ref": "#/$defs/Microphone"},
         "MotionSensor": { "$ref": "#/$defs/MotionSensor"},
         "OccupancySensor": { "$ref": "#/$defs/OccupancySensor"},
         "Outlet": { "$ref": "#/$defs/Outlet"},
         "Pairing": { "$ref": "#/$defs/Pairing"},
         "PowerManagement": { "$ref": "#/$defs/PowerManagement"},
         "ProtocolInformation": { "$ref": "#/$defs/ProtocolInformation"},
         "Relay": { "$ref": "#/$defs/Relay"},
         "SecuritySystem": { "$ref": "#/$defs/SecuritySystem"},
         "ServiceLabel": { "$ref": "#/$defs/ServiceLabel"},
         "Siri": { "$ref": "#/$defs/Siri"},
         "Slat": { "$ref": "#/$defs/Slat"},
         "SmartSpeaker": { "$ref": "#/$defs/SmartSpeaker"},
         "SmokeSensor": { "$ref": "#/$defs/SmokeSensor"},
         "Speaker": { "$ref": "#/$defs/Speaker"},
         "StatefulProgrammableSwitch": { "$ref": "#/$defs/StatefulProgrammableSwitch"},
         "StatelessProgrammableSwitch": { "$ref": "#/$defs/StatelessProgrammableSwitch"},
         "Switch": { "$ref": "#/$defs/Switch"},
         "TargetControl": { "$ref": "#/$defs/TargetControl"},
         "TargetControlManagement": { "$ref": "#/$defs/TargetControlManagement"},
         "Television": { "$ref": "#/$defs/Television"},
         "TelevisionSpeaker": { "$ref": "#/$defs/TelevisionSpeaker"},
         "TemperatureSensor": { "$ref": "#/$defs/TemperatureSensor"},
         "Thermostat": { "$ref": "#/$defs/Thermostat"},
         "TimeInformation": { "$ref": "#/$defs/TimeInformation"},
         "TransferTransportManagement": { "$ref": "#/$defs/TransferTransportManagement"},
         "TunneledBTLEAccessoryService": { "$ref": "#/$defs/TunneledBTLEAccessoryService"},
         "Valve": { "$ref": "#/$defs/Valve"},
         "WiFiRouter": { "$ref": "#/$defs/WiFiRouter"},
         "WiFiSatellite": { "$ref": "#/$defs/WiFiSatellite"},
         "Window": { "$ref": "#/$defs/Window"},
         "WindowCovering": { "$ref": "#/$defs/WindowCovering"}
      }
   },
   "layout":
   [
      {
         "key": "AccessControl",
         "title": "AccessControl Options",
         "condition":
         {
            "functionBody": "return ['AccessControl'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "AccessoryRuntimeInformation",
         "title": "AccessoryRuntimeInformation Options",
         "condition":
         {
            "functionBody": "return ['AccessoryRuntimeInformation'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "AccessoryInformation",
         "title": "AccessoryInformation Options",
         "condition":
         {
            "functionBody": "return ['AccessoryInformation'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "AirPurifier",
         "title": "AirPurifier Options",
         "condition":
         {
            "functionBody": "return ['AirPurifier'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "AirQualitySensor",
         "title": "AirQualitySensor Options",
         "condition":
         {
            "functionBody": "return ['AirQualitySensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "BatteryService",
         "title": "BatteryService Options",
         "condition":
         {
            "functionBody": "return ['BatteryService'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "BridgeConfiguration",
         "title": "BridgeConfiguration Options",
         "condition":
         {
            "functionBody": "return ['BridgeConfiguration'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "BridgingState",
         "title": "BridgingState Options",
         "condition":
         {
            "functionBody": "return ['BridgingState'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CameraEventRecordingManagement",
         "title": "CameraEventRecordingManagement Options",
         "condition":
         {
            "functionBody": "return ['CameraEventRecordingManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CameraControl",
         "title": "CameraControl Options",
         "condition":
         {
            "functionBody": "return ['CameraControl'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CameraRTPStreamManagement",
         "title": "CameraRTPStreamManagement Options",
         "condition":
         {
            "functionBody": "return ['CameraRTPStreamManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CameraOperatingMode",
         "title": "CameraOperatingMode Options",
         "condition":
         {
            "functionBody": "return ['CameraOperatingMode'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CarbonDioxideSensor",
         "title": "CarbonDioxideSensor Options",
         "condition":
         {
            "functionBody": "return ['CarbonDioxideSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "CarbonMonoxideSensor",
         "title": "CarbonMonoxideSensor Options",
         "condition":
         {
            "functionBody": "return ['CarbonMonoxideSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "ContactSensor",
         "title": "ContactSensor Options",
         "condition":
         {
            "functionBody": "return ['ContactSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Diagnostics",
         "title": "Diagnostics Options",
         "condition":
         {
            "functionBody": "return ['Diagnostics'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Door",
         "title": "Door Options",
         "condition":
         {
            "functionBody": "return ['Door'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "DoorBell",
         "title": "DoorBell Options",
         "condition":
         {
            "functionBody": "return ['DoorBell'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Fan",
         "title": "Fan Options",
         "condition":
         {
            "functionBody": "return ['Fan'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Fanv1",
         "title": "Fanv1 Options",
         "condition":
         {
            "functionBody": "return ['Fanv1'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Fanv2",
         "title": "Fanv2 Options",
         "condition":
         {
            "functionBody": "return ['Fanv2'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Faucet",
         "title": "Faucet Options",
         "condition":
         {
            "functionBody": "return ['Faucet'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "FilterMaintenance",
         "title": "FilterMaintenance Options",
         "condition":
         {
            "functionBody": "return ['FilterMaintenance'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "GarageDoorOpener",
         "title": "GarageDoorOpener Options",
         "condition":
         {
            "functionBody": "return ['GarageDoorOpener'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "HeaterCooler",
         "title": "HeaterCooler Options",
         "condition":
         {
            "functionBody": "return ['HeaterCooler'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "HumidifierDehumidifier",
         "title": "HumidifierDehumidifier Options",
         "condition":
         {
            "functionBody": "return ['HumidifierDehumidifier'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "HumiditySensor",
         "title": "HumiditySensor Options",
         "condition":
         {
            "functionBody": "return ['HumiditySensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "InputSource",
         "title": "InputSource Options",
         "condition":
         {
            "functionBody": "return ['InputSource'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "IrrigationSystem",
         "title": "IrrigationSystem Options",
         "condition":
         {
            "functionBody": "return ['IrrigationSystem'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "LeakSensor",
         "title": "LeakSensor Options",
         "condition":
         {
            "functionBody": "return ['LeakSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "LightSensor",
         "title": "LightSensor Options",
         "condition":
         {
            "functionBody": "return ['LightSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Lightbulb",
         "title": "Lightbulb Options",
         "condition":
         {
            "functionBody": "return ['Lightbulb'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "LockManagement",
         "title": "LockManagement Options",
         "condition":
         {
            "functionBody": "return ['LockManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "LockMechanism",
         "title": "LockMechanism Options",
         "condition":
         {
            "functionBody": "return ['LockMechanism'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Microphone",
         "title": "Microphone Options",
         "condition":
         {
            "functionBody": "return ['Microphone'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "MotionSensor",
         "title": "MotionSensor Options",
         "condition":
         {
            "functionBody": "return ['MotionSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "OccupancySensor",
         "title": "OccupancySensor Options",
         "condition":
         {
            "functionBody": "return ['OccupancySensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Outlet",
         "title": "Outlet Options",
         "condition":
         {
            "functionBody": "return ['Outlet'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Pairing",
         "title": "Pairing Options",
         "condition":
         {
            "functionBody": "return ['Pairing'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "PowerManagement",
         "title": "PowerManagement Options",
         "condition":
         {
            "functionBody": "return ['PowerManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "ProtocolInformation",
         "title": "ProtocolInformation Options",
         "condition":
         {
            "functionBody": "return ['ProtocolInformation'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Relay",
         "title": "Relay Options",
         "condition":
         {
            "functionBody": "return ['Relay'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "SecuritySystem",
         "title": "SecuritySystem Options",
         "condition":
         {
            "functionBody": "return ['SecuritySystem'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "ServiceLabel",
         "title": "ServiceLabel Options",
         "condition":
         {
            "functionBody": "return ['ServiceLabel'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Siri",
         "title": "Siri Options",
         "condition":
         {
            "functionBody": "return ['Siri'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Slat",
         "title": "Slat Options",
         "condition":
         {
            "functionBody": "return ['Slat'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "SmartSpeaker",
         "title": "SmartSpeaker Options",
         "condition":
         {
            "functionBody": "return ['SmartSpeaker'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "SmokeSensor",
         "title": "SmokeSensor Options",
         "condition":
         {
            "functionBody": "return ['SmokeSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Speaker",
         "title": "Speaker Options",
         "condition":
         {
            "functionBody": "return ['Speaker'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "StatefulProgrammableSwitch",
         "title": "StatefulProgrammableSwitch Options",
         "condition":
         {
            "functionBody": "return ['StatefulProgrammableSwitch'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "StatelessProgrammableSwitch",
         "title": "StatelessProgrammableSwitch Options",
         "condition":
         {
            "functionBody": "return ['StatelessProgrammableSwitch'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Switch",
         "title": "Switch Options",
         "condition":
         {
            "functionBody": "return ['Switch'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TargetControl",
         "title": "TargetControl Options",
         "condition":
         {
            "functionBody": "return ['TargetControl'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TargetControlManagement",
         "title": "TargetControlManagement Options",
         "condition":
         {
            "functionBody": "return ['TargetControlManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Television",
         "title": "Television Options",
         "condition":
         {
            "functionBody": "return ['Television'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TelevisionSpeaker",
         "title": "TelevisionSpeaker Options",
         "condition":
         {
            "functionBody": "return ['TelevisionSpeaker'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TemperatureSensor",
         "title": "TemperatureSensor Options",
         "condition":
         {
            "functionBody": "return ['TemperatureSensor'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Thermostat",
         "title": "Thermostat Options",
         "condition":
         {
            "functionBody": "return ['Thermostat'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TimeInformation",
         "title": "TimeInformation Options",
         "condition":
         {
            "functionBody": "return ['TimeInformation'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TransferTransportManagement",
         "title": "TransferTransportManagement Options",
         "condition":
         {
            "functionBody": "return ['TransferTransportManagement'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "TunneledBTLEAccessoryService",
         "title": "TunneledBTLEAccessoryService Options",
         "condition":
         {
            "functionBody": "return ['TunneledBTLEAccessoryService'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Valve",
         "title": "Valve Options",
         "condition":
         {
            "functionBody": "return ['Valve'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "WiFiRouter",
         "title": "WiFiRouter Options",
         "condition":
         {
            "functionBody": "return ['WiFiRouter'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "WiFiSatellite",
         "title": "WiFiSatellite Options",
         "condition":
         {
            "functionBody": "return ['WiFiSatellite'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "Window",
         "title": "Window Options",
         "condition":
         {
            "functionBody": "return ['Window'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      },
      {
         "key": "WindowCovering",
         "title": "WindowCovering Options",
         "condition":
         {
            "functionBody": "return ['WindowCovering'].includes(model.type);"
         },
         "type": "fieldset",
         "expandable": true,
         "items":
         [
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
               "title": "Polling",
               "type": "fieldset",
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
      }]
}
