#!/usr/local/bin/node
//  AnyDevice.js
//
// Description:
//   This script responds to any characteristic from as the Accessories name
//   is not checked.
//   It is useful for testing someones config.json file.
//
//   Specifications.
//
//
// Parameters are:
//    Get <any accessory name> <characteristic>
//    Set <any accessory name> <characteristic> <value>
//
// Note 1: These paramaters match the those of the Cmd4 plugin.
// Note 2: All characteristics of the HomeKit Accessory Protocol (HAP)
//         specifications are supported, except for camera streaming;
//         Though I have found some like LockManagement are not within IOS.
//         Side Note: The Eve app is nicer, try it.
// Note 3: The Hap spec is quoted throughout, but this is not the spec so
//         this is not gauranteed to be correct.
//
// How it works:
//    A characteristic value is stored in the $HOME/.homebridge/Cmd4Scripts/Cmd4States in
//    the file named "Status + ANY_DEVICE _ <Characteristic>" and is returned or
//    written to based on the <Get|Set> option.
//
//    For example:   node AnyAccessory.js Set My_Door MotionDetected 0
//       will create the file .homebridge/Cmd4Scripts/Cmd4States/ANY_DEVICE_MotionDetected
//       with the contents of "0"
//       Note: See how this is run from $HOME (Important!)
//
// Environmental Variables Used:
//    $HOME - to create path to .homebridge
//
//
//

'use strict';

// FileSystem requirements.
var fs = require('fs');
var path = require('path');
var os = require('os');

// The files created within Cmd4StatesPath contain just a value of the accessories last state,
// so they are very small in size.
var Cmd4StatesPath =  path.join(os.homedir(), ".homebridge/Cmd4Scripts/Cmd4States");

var length = process.argv.length;
var device = "ANY_DEVICE";
var io = "";
var characteristic = "";
var option = "";

if (length == 2) process.exit(0);

if (length <= 2) {
    console.log("Usage: " + process.argv[0] + " <Get> <AccessoryName> <Characteristic>");
    console.log("       " + process.argv[0] + " <Set> <AccessoryName> <Characteristic> <Value>");
    process.exit(-1);
}

if (length >= 2) io = process.argv[2];
if (length >= 3) device = process.argv[3];
if (length >= 4) characteristic  = process.argv[4];
if (length >= 5) option  = process.argv[5];

// Placing the states in a subdirectory makes things look cleaner.
// Some platforms require an exception handler
const mkdirSync = function (dirPath)
{
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST')
        {
            console.log("mkdir failed: " + dirPath);
            throw err;
        } else {
            // directory already exists - OK
        }
    }
}

mkdirSync(Cmd4StatesPath);


// Such a simple way to store state information that is small and fast!
// Put exception handling here too. Just in case!
function writeData(a,b,c)
{
    var fn = Cmd4StatesPath + "/Status_" + a  + "_" + b;

    try {
        fs.writeFileSync(fn,c);
    } catch (err) {
        if (err.code !== 'EEXIST')
        {
            console.log("write data failed: " + fn + " data:" + c);
            throw err;
        } else {
            // file already exists - OK
        }
    }
}

// Read the state information.  If there is none, just return what
// was expected.
// Put exception handling here too. Just in case!
function readData(a,b)
{
    var fn = Cmd4StatesPath + "/Status_" + a  + "_" + b;
    c = "";

    try {
        c = String(fs.readFileSync(fn, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            // This is OK. just return what was expected.
            return c;
        } else
            if (err.code !== 'EEXIST')
            {
                console.log("read data failed: " + fn);
                throw err;
            } else {
                // file already exists - OK
            }
    }

    return c;
}

var c = "";

switch(io)
{
    case "Get":
    {
        switch(characteristic)
        {
            case "AccessoryFlags":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000A6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.accessory-properties
                // Permissions: Paired Read, Notify

                // Format: uint32

                // Valid Values
                // 0x0001 (bit0) "Requires additional setup"
                // 0x0002 - 0xFFFF "Reserved"

                break;
            }
            case "Active":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000B0-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.active
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values
                // 0 - "Inactive"
                // 1 - "Active"

                break;

            }
            case "ActiveIdentifier":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.activeIdentifier
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint32

                break;
            }
            case "AccessoryIdentifier":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("TLB"); else console.log(c);

                // UUID: 00000057-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.accessoryIdentifier
                // Permissions: Paired Read

                // Format: string

                // Maximum Length: 64

                break;
            }

            case "AdministratorOnlyAccess": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000001-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.administrator-only-access
                // Permissions: Paired Read, Paired Write, Notify

                // Format: bool

                // Values
                // This mode implies that when enabled, the device will only accept
                // administrator access.

                break;
            }
            case "AirParticulateDensity":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(30); else console.log(c);

                // UUID: 00000064-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.air-particulate.density
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                // Values
                // This characteristic indicates the current air particulate matter
                // density in micrograms/m3.

                break;
            }
            case "AirParticulateSize":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000065-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.air-particulate.size
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values
                // 0     - "2.5 Micrometers"
                // 1     - "10 Micrometers"
                // 2-255 - "Reserved"

                break;
            }
            case "AirQuality":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000095-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.air-quality
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 5
                // Step Value: 1

                // Valid Values:
                // 0 - "Unknown"
                // 1 - "Excellent"
                // 2 - "Good"
                // 3 - "Fair"
                // 4 - "Inferior"
                // 5 - "Poor"

                break;
            }
            case "AudioFeedback": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000005-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.audio-feedback
                // Permissions: Paired Read, Paired Write, Notify

                // Format: bool

                // Values
                // This characteristic describes whether audio feedback
                // (e.g. a beep, or other external sound mechanism) is enabled.

                break;
            }
            case "BatteryLevel":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50); else console.log(c);

                // UUID: 00000068-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.battery-level
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "Brightness": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(100); else console.log(c);

                // UUID: 00000008-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.brightness
                // Permissions: Paired Read, Paired Write, Notify

                // Format: int

                // Min Value: 0
                // Max Value: 100
                // Unit: Percentage

                break;
            }
            case "CarbonDioxideDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000092-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-dioxide.detected
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Carbon Dioxide levels are normal"
                // 1 - "Carbon Dioxide levels are abnormal"

                break;
            }
            case "CarbonDioxideLevel": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000093-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-dioxide.level
                // Permissions: Paired Read, Notify
                // Format: float
                // Minimum Value: 0
                // Maximum Value: 100000

                break;
            }
            case "CarbonDioxidePeakLevel": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000094-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-dioxide.peak-level
                // Permissions: Paired Read, Notify
                // Format: float
                // Minimum Value: 0
                // Maximum Value: 100000

                break;
            }
            case "CarbonMonoxideDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000069-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-monoxide.detected`
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Min Value: 0
                // Max Value: 1

                // Valid Values:
                // 0 - "Carbon Monoxide levels are normal"
                // 1 - "Carbon Monoxide levels are abnormal"

                break;
            }
            case "CarbonMonoxideLevel": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000090-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-monoxide.level
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100

                break;
            }
            case "CarbonMonoxidePeakLevel":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000091-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.carbon-monoxide.peak-level
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100

                break;
            }
            case "Category":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000A3-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.category
                // Permissions: Paired Read, Notify

                // Format: uint16

                // Minimum Value: 1
                // Maximum Value: 16
                // Step Value: 1

                break;
            }
            case "ChargingState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000008F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.charging-state
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values:
                // 0 - "Not Charging"
                // 1 - "Charging"
                // 2 - "Not Chargeable"

                break;
            }
            case "ClosedCaptions":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000DD-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.closedCaptions
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - "Captions are Off"
                // 1 - "Captions are On"

                break;
            }
            case "ColorTemperature": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50); else console.log(c);

                // UUID: 000000CE-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.color-temperature
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint32

                // Minimum Value: 50
                // Maximum Value: 400
                // Step Value: 1

                break;
            }
            case "ConfiguredName":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("My_Tv"); else console.log(c);

                // UUID: 000000E3-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.configuredName
                // Permissions: Paired Write, Paired Read, Notify

                // Format: string

                break;
            }
            case "ConfigureBridgedAccessoryStatus":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.configureBridgedAccessoryStatus
                // Permissions: Paired Read, Notify

                // Format: TLV8

                break;
            }
            case "ConfigureBridgedAccessory":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000A0-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.configureBridgedAccessory
                // Permissions: Paired Write

                // Format: TLV8

                break;
            }
            case "ContactSensorState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000006A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.contact-state
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Contact is detected"
                // 1 - "Contact is not detected"

                break;
            }
            case "CoolingThresholdTemperature": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(32.4); else console.log(c);

                // UUID: 0000000D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.temperature.cooling-threshold
                // Permissions: Paired Read, Paired Write, Notify

                // Format: float

                // Minimum Value: 10
                // Maximum Value: 35
                // Step Value: 0.1
                // Unit: celcius

                break;
            }
            case "CurrentAirPurifierState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(2); else console.log(c);

                // UUID: 000000A9-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.air-purifier.state.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values:
                // 0 - "Inactive"
                // 1 - "Idle"
                // 2 - "Purifying Air"

                break;
            }
            case "CurrentAmbientLightLevel":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000006B-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.light-level.current
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0.0001
                // Maximum Value: 100000
                // Unit: lux

                break;
            }
            case "CurrentDoorState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000000E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.door-state.current
                // Permissions: Paired Read, Notify

                // Format: uint8
                // Minimum Value: 0
                // Maximum Value: 4
                // Step Value: 1

                // Valid Values:
                // 0 - "Open. The door is fully open."
                // 1 - "Closed. The door is fully closed."
                // 2 - "Opening. The door is actively opening."
                // 3 - "Closing. The door is actively closing."
                // 4 - "Stopped. The door is not moving, and it is not fully
                //      open nor fully closed."
                // 5-255 - "Reserved"

                break;
            }
            case "CurrentFanState": // Optional (V2)
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000AF-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.fan.state.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values
                // 0 - "Inactive"
                // 1 - "Idle"
                // 2 - "Blowing Air"

                break;
            }
            case "CurrentHeaterCoolerState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                process.exit(0);

                // UUID: 000000B1-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.heater-cooler.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 3
                // Step Value: 1

                // Valid Values:
                // 0 - INACTIVE
                // 1 - IDLE
                // 2 - HEATING
                // 3 - COOLING

                break;
            }
            case "CurrentHeatingCoolingState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                process.exit(0);

                // UUID: 0000000F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.heating-cooling.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values:
                // 0 - "Off."
                // 1 - "Heat. The Heater is currently on."
                // 2 - "Cool. Cooler is currently on."

                break;
            }
            case "CurrentHorizontalTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000006C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.horizontal-tilt.current
                // Permissions: Paired Read, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "CurrentHumidifierDehumidifierState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000B3-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.currentHumidifierDehumidifierState
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomekitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 3

                // Valid Values
                // 0 - INACTIVE
                // 1 - IDLE
                // 2 - HUMIDIFYING
                // 3 - DEHUMIDIFYING

                break;
            }
            case "CurrentMediaState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(2); else console.log(c);

                // UUID: 000000E0-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.currentMediaState
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 3

                // Valid Values
                // 0 - PLAY
                // 1 - PAUSE
                // 2 - STOP
                // 3 - Reserved ????

                break;
            }
            case "CurrentPosition":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000006D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.position.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "CurrentRelativeHumidity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(60.2); else console.log(c);

                // UUID: 00000010-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relative-humidity.current
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "CurrentSlatState":
            {
               c = readData(device, characteristic);

               if (c == "") console.log(0); else console.log(c);

               // UUID: 000000AA-0000-1000-8000-0026BB765291
               // Type: public.hap.characteristic.slat.state.current
               // Permissions: Paired Read, Notify

               // Format: uint8

               // Minimum Value: 0
               // Maximum Value: 2
               // Step Value: 1

               // Valid Values:
               // 0 - "Fixed"
               // 1 - "Jammed"
               // 2 - "Swinging"

               break;
            }
            case "CurrentTemperature":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(-20.2); else console.log(c);

                // UUID: 00000011-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.temperature.current
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value 0
                // Maximum Value 100
                // Step Value 0.1
                // Unit celsius

                break;
            }
            case "CurrentTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000C1-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.tilt.current
                // Permissions: Paired Read, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "CurrentTime":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("11:15"); else console.log(c);

                // UUID: 0000009B-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.currentTime
                // Permissions: Paired Read, Paired Write

                // Format: string

                break;
            }
            case "CurrentVerticalTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000006E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.vertical-tilt.current
                // Permissions: Paired Read, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "CurrentVisibilityState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000135-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.currentVisibilityState
                // Permissions: Paired Read, Notify
                // Found in  HomeKitTypes-Television.js

                // Format: uint8

                // Valid Values
                // 0 - SHOWN
                // 1 - HIDDEN

                break;
            }
            case "DayoftheWeek":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000098-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.zoom-digital
                // Permissions: Paired Write, Paired Read

                // Format: uint8

                // Minimum Value: 1
                // Maximum Value: 7
                // Step Value: 1

                break;
            }
            case "DigitalZoom":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000011D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.zoom-digital
                // Permissions: Paired Write, Paired Read, Notify

                // Format: float

                // Valid Values
                // The value of this characteristic represents the digital zoom
                // multiplier to be applied on the image sourced by the video
                // RTP service that is sourcing the input image.

                break;
            }
            case "DiscoverBridgedAccessories":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.discoverBridgedAccessories
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js

                // Format: uint8

                // Valid Values
                // 0 - START_DISCOVERY
                // 1 - STOP_DISCOVERY

                break;
            }
            case "DiscoveredBridgedAccessories":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.discoveredBridgedAccessories
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: uint16

                // Valid Values

                break;
            }
            case "DisplayOrder":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000E7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.displayOrder
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Television.js (Values ???)

                // Format: TLV8

                // Valid Values

                break;
            }
            case "FilterChangeIndication":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000AC-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.filter.change-indication
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Filter does not need to be changed"
                // 1 - "Filter needs to be changed"

                break;
            }
            case "FilterLifeLevel": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50); else console.log(c);

                // UUID: 000000AB-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.filter.life-level
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1

                break;
            }
            case "FirmwareRevision":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("100.1.1"); else console.log(c);

                // UUID: 00000052-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.firmware.revision
                // Permissions: Paired Read

                // Format: string

                // Valid Values
                // This characteristic describes a hardware revision string x[.y[.z]]
                // (e.g. "100.1.1") and tracked when the board or components of the same
                // accessory is changed :
                // <x> is the major version number, required.
                // <y> is the minor version number, required if it is non-zero or
                // if <z> is present. <z> is the revision version number, required if non-zero.
                //
                // The hardware revision must follow the below rules:
                // <x> is incremented when there is significant change. e.g.,1.0.0, 2.0.0, 3.0.0, etc.
                // <y> is incremented when minor changes are introduced such as 1.1.0, 2.1.0, 3.1.0 etc.
                // <z> is incremented when bug-fixes are introduced such as 1.0.1, 2.0.1, 3.0.1 etc.
                //
                // Subsequent firmware updates can have a lower <y> version only
                // if <x> is incremented Subsequent firmware updates can have a
                // lower <z> version only if <x> or <y> is incremented

                break;
            }
            case "HardwareRevision":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("100.1.1"); else console.log(c);

                // UUID: 00000053-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.hardware.revision
                // Permissions: Paired Read

                // Format: string

                // Valid Values
                // This characteristic describes a hardware revision string x[.y[.z]]
                // (e.g. "100.1.1") and tracked when the board or components of the same
                // accessory is changed :
                // <x> is the major version number, required.
                // <y> is the minor version number, required if it is non-zero or
                // if <z> is present. <z> is the revision version number, required if non-zero.
                //
                // The hardware revision must follow the below rules:
                // <x> is incremented when there is significant change. e.g.,1.0.0, 2.0.0, 3.0.0, etc.
                // <y> is incremented when minor changes are introduced such as 1.1.0, 2.1.0, 3.1.0 etc.
                // <z> is incremented when bug-fixes are introduced such as 1.0.1, 2.0.1, 3.0.1 etc.
                //
                // Subsequent firmware updates can have a lower <y> version only
                // if <x> is incremented Subsequent firmware updates can have a
                // lower <z> version only if <x> or <y> is incremented

                break;
            }
            case "HeatingThresholdTemperature": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(25.2); else console.log(c);

                // UUID: 00000012-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.temperature.heating-threshold
                // Permissions: Paired Read, Paired Write, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 25
                // Step Value: 0.1
                // Unit: celcius

                break;
            }
            case "HoldPosition": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000006F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.position.hold
                // Permissions: Paired Write

                // Format: bool, 0 (false) and 1 (true)

                break;
            }
            case "Hue": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50); else console.log(c);

                // UUID: 00000013-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.hue
                // Permissions: Paired Read, Paired Write, Notify

                // Format: int

                // Min Value: 0
                // Max Value: 360
                // Unit: arcdegrees

                break;
            }
            case "Identify":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000E6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.identifier
                // Permissions: Paired Write
                // Found in HomeKitTypes.js

                // Format: Bool

                break;
            }
            case "Identifier":
            {
                c = readData(device, characteristic);

                if (c == ""){
                  // Each identifier needs a unique number
                  // Match this with what is in the config.json
                  switch(device)
                  {
                     case "HDMI1":
                          console.log(0);
                          break;
                     case "HDMI2":
                          console.log(1);
                          break;
                     case "HDMI3":
                          console.log(2);
                          break;
                     case "HDMI4":
                          console.log(3);
                          break;
                     case "Netflix":
                          console.log(4);
                          break;
                     default:
                          console.log(0);
                  }
               } else {
                  console.log(c);
               }

                // UUID: 000000E6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.identifier
                // Permissions: Paired Read
                // Found in HomeKitTypes-Television.js

                // Format: uint32

                // Min Value: 0
                // Min Step: 1

                break;
            }
            case "ImageMirroring":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000011F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.image-mirror
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint32

                // Valid Values
                // 0 "Image is not mirrored"
                // 1 "Image is mirrored"

                // Unit arcdegrees

                break;
            }
            case "ImageRotation":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000011E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.image-rotation
                // Permissions: Paired Write, Paired Read, Notify

                // Format: float

                // Valid Values
                // 0   - "No rotation"
                // 90  - "Rotated 90 degrees to the right"
                // 180 - "Rotated 180 degrees to the right (flipped vertically)"
                // 270 - "Rotated 270 degrees to the right"

                break;
            }
            case "InputDeviceType":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000DC-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.inputDeviceType
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 6

                // Valid Values
                // 0 - OTHER
                // 1 - TV
                // 2 - RECORDING
                // 3 - TUNER
                // 4 - PLAYBACK
                // 5 - AUDIO_SYSTEM
                // 6 - UNKNOWN_6 (Added in IOS 14)

                break;
            }
            case "InputSourceType":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000DB-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.inputSourceType
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 10

                // Valid Values
                // 0  - OTHER
                // 1  - HOME_SCREEN
                // 2  - TUNER
                // 3  - HDMI
                // 4  - COMPOSITE_VIDEO
                // 5  - S_VIDEO
                // 6  - COMPONENT_VIDEO
                // 7  - DVI
                // 8  - AIRPLAY
                // 9  - USB
                // 10 - APPLICATION

                break;
            }
            case "InUse":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000D2-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.inUse
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - NOT_IN_USE
                // 1 - IN_USE

                break;
            }
            case "IsConfigured":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000D6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.isConfigured
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - NOT_CONFIGURED
                // 1 - CONFIGURED

                break;
            }
            case "LeakDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000070-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.leak-detected
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Leak is not detected"
                // 1 - "Leak is detected"

                break;
            }
            case "LinkQuality":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.linkQuality
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: uint8

                // Minimum Value: 1
                // Maximum Value: 4
                // Step Value: 1

                // Valid Values:

                break;
            }
            case "LockControlPoint":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000019-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.lock-management.control-point
                // Permissions: Paired Write
                // Format: tlv8

                break;
            }
            case "LockCurrentState": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000001D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.lock-mechanism.current-state
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 3
                // Step Value: 1

                // Valid Values:
                // 0 - "Unsecured"
                // 1 - "Secured"
                // 2 - "Jammed"
                // 3 - "Unknown"
                // 4-255 - "Reserved"

                break;
            }
            case "LockLastKnownAction": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);


                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 8
                // Step Value: 1

                // Valid Values:
                // 0 - "Secured using physical movement, interior"
                // 1 - "Unsecured using physical movement, interior"
                // 2 - "Secured using physical movement, exterior"
                // 3 - "Unsecured using physical movement, exterior"
                // 4 - "Secured with keypad"
                // 5 - "Unsecured with keypad"
                // 6 - "Secured remotely"
                // 7 - "Unsecured remotely"
                // 8 - "Secured with Automatic Secure timeout"
                // 9-255 - "Reserved"

                break;
            }
            case "LockManagementAutoSecurityTimeout": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(26); else console.log(c);

                // UUID: 0000001A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.lock-management.auto-secure-timeout
                // Permissions: Paired Read, Paired Write, Notify
                // Format: uint32
                // Unit: seconds

                break;
            }
            case "LockPhysicalControls": // Optional (V2)
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000A7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.lock-physical-controls
                // Permissions: Paired Write,Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Control lock disabled"
                // 1 - "Control lock enabled"

                break;
            }
            case "LockTargetState": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000001E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.lock-mechanism.target-state
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Unsecured"
                // 1 - "Secured"
                // 2-255 - "Reserved"

                break;
            }
            case "Logs": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log("OptionalLogs"); else console.log(c);

                // UUID: 0000001F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.logs
                // Permissions: Paired Read, Notify

                // Format: tlv8

                break;
            }
            case "Manufacturer":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("Hombridge"); else console.log(c);

                // UUID: 00000020-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.manufacturer
                // Permissions: Paired Read

                // Format: string

                // Maximum Length: 64

                break;
            }
            case "Model":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.model
                // Permissions: Paired Read

                // Format: string

                // Maximum Length: 64

                break;
            }
            case "MotionDetected": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000022-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.motion-detected
                // Permissions: Paired Read, Notify

                // Format: bool

                break;
            }
            case "Mute":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000011A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.mute
                // Permissions: Paired Write, Paired Read, Notify

                // Format: bool

                // Valid Values:
                // 0 - "Mute is Off / Audio is On"
                // 1 - "Mute is On / There is no Audio"

                break;
            }
            case "Name":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000023-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.name
                // Permissions: Paired Read, Notify

                // Format: string

                // Maximum Length: 64

                break;
            }
            case "NightVision":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000011B-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.nightVision
                // Permissions: Paired Write, Paired Read, Notify

                // Format: bool (false) and 1 (true)

                // Valid Values
                // 0 - "Disable night-vision mode"
                // 1 - "Enable night-vision mode"

                break;
            }
            case "NitrogenDioxideDensity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 000000C4-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.no2
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                break;
            }
            case "ObstructionDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000024-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.obstruction-detected
                // Permissions: Paired Read, Notify

                // Format: bool, 0 (false) and 1 (true)

                break;
            }
            case "OccupancyDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000071-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.occupancy-detected
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values
                // 0 - "Occupancy is not detected"
                // 1 - "Occupancy is detected"

                break;
            }
            case "On": // (V1only)
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000025-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.on
                // Permissions: Paired Read, Paired Write, Notify
                // Format: bool, 0 (false) and 1 (true)

                break;
            }
            case "OpticalZoom":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("1.0"); else console.log(c);

                // UUID: 0000011C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.opticalZoom
                // Permissions: Paired Write, Paired Read, Notify

                // Format: float

                // Valid Values
                // The value of this characteristic represents the optical zoom
                // setting of the camera service that is sourcing the input image.

                break;
            }
            case "OutletInUse":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000026-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.outlet-in-use
                // Permissions: Paired Read, Notify

                // Format: bool, 0 (false) and 1 (true)

                break;
            }
            case "OzoneDensity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 000000C3-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.ozone
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000k

                break;
            }
            case "PairSetup":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000004C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.pairSetup
                // Permissions: Paired Write, Paired Read
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                break;
            }
            case "PairVerify":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000004E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.pairVerify
                // Permissions: Paired Write, Paired Read
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                break;
            }
            case "PairingFeatures":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000004F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.pairingFeatures
                // Permissions: Paired Read,
                // Found in HomeKitTypes.js (Values ???)

                // Format: uint8

                break;
            }
            case "PairingPairings":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000050-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.pairingPairings
                // Permissions: Paired Write, Paired Read
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                break;
            }
            case "PictureMode":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E2-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.pictureMode
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint16

                // Valid Values
                // 0 - OTHER
                // 1 - STANDARD
                // 2 - CALIBRATED
                // 3 - CALIBRATED_DARK
                // 4 - VIVID
                // 5 - GAME
                // 6 - COMPUTER
                // 7 - CUSTOM

                break;
            }
            case "PM10Density": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 000000C7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.pm10
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                break;
            }
            case "PM2_5Density": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);
                // UUID: 000000C6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.pm25
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                break;
            }
            case "PositionState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(2); else console.log(c);

                // UUID: 00000072-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.position.state
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values:
                // - 0 "Going to the minimum value specified in metadata"
                // - 1 "Going to the maximum value specified in metadata"
                // - 2 "Stopped"
                // - 3-255 "Reserved"

                break;
            }
            case "PowerModeSelection":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000DF-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.powerModeSelection
                // Permissions: Paired Write
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Valid Values
                // 0 - SHOW
                // 1 - HIDE

                break;
            }
            case "ProgramMode":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000E7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.programMode
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Valid Values
                // 0 - NO_PROGRAM_SCHEDULED
                // 1 - PROGRAM_SCHEDULED
                // 1 - PROGRAM_SCHEDULED_MANUAL_MODE

                break;
            }
            case "ProgrammableSwitchEvent":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000073-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.input-event
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2
                // Step Value: 1

                // Valid Values:
                // 0 - "Single Press"
                // 1 - "Double Press"
                // 2 - "Long Press"
                // 3-255 - "Reserved"

                break;
            }
           case "ProgrammableSwitchOutputState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000074-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.programmableSwitchOutputState
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:

                break;
            }
            case "Reachable":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000063-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.reachable
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: bool

                // Valid Values:

                break;
            }
            case "RelativeHumidityDehumidifierThreshold":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000C9-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relativeHumidityDehumidifierThreshold
                // Permissions: Paired Write, Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Minimum Step: 1

                break;
            }
            case "RelativeHumidityHumidifierThreshold":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000CA-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relativeHumidityHumidifierThreshold
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint32

                // Units: Percentage

                // Minimum Value: 0
                // Maximum Value: 100
                // Minimum Step: 1

                break;
            }
            case "RelayEnabled":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000005B-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relayEnabled
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: bool

                // Valid Values:

                break;
            }
            case "RelayState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 0000005C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relayState
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: uint8

                // Valid Values:

                break;
            }
            case "RelayControlPoint":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000005E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.reachable
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Bridge.js (Values ???)

                // Format: TLV8

                break;
            }
            case "RemainingDuration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000D4-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.remainingDuration
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 3600
                // Minimum Step: 1

                break;
            }
            case "RemoteKey":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E1-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.remoteKey
                // Permissions: Paired Write
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Valid Values
                // 0  - REWIND = 0;
                // 1  - FAST_FORWARD
                // 2  - NEXT_TRACK
                // 3  - PREVIOUS_TRACK
                // 4  - ARROW_UP
                // 5  - ARROW_DOWN
                // 6  - ARROW_LEFT
                // 7  - ARROW_RIGHT
                // 8  - SELECT
                // 9  - BACK
                // 10 - EXIT
                // 11 - PLAY_PAUSE
                // 12 - INFORMATION

                break;
            }
            case "ResetFilterIndication": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000AD-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.filter.reset-indication
                // Permissions: Paired Write

                // Format: uint8

                // Minimum Value: 1
                // Maximum Value: 1

                break;
            }
            case "RotationDirection": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID:00000028-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.rotation.direction
                // Permissions: Paired Read, Paired Write, Notify
                // Format: int

                // Step Value: 1
                // Valid Values
                // 0 - "Clockwise"
                // 1 - "Counter-clockwise"
                // 2-255 "Reserved"

                break;
            }
            case "RotationSpeed": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(100); else console.log(c);

                // UUID: 00000029-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.rotation.speed
                // Permissions: Paired Read, Paired Write, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "Saturation": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50); else console.log(c);

                // UUID: 0000002F-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.saturation
                // Permissions: Paired Read, Paired Write, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "SecuritySystemAlarmType": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000008E-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.security-system.alarm-type
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "When alert cleared"
                // 1 - "Unknown Cause"

                break;
            }
            case "SecuritySystemCurrentState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(3); else console.log(c);

                // UUID: 00000066-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.security-system-state.current
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 4
                // Step Value: 1

                // Valid Values:
                // 0 - "Stay Arm. The home is occupied and the residents are
                //      active. e.g. morning or evenings"
                // 1 - "Away Arm. The home is unoccupied"
                // 2 - "Night Arm. The home is occupied and the residents are sleeping"
                // 3 - "Disarmed"
                // 4 - "Alarm Triggered"
                // 5 - 255 - "Reserved"

                break;
            }
            case "SecuritySystemTargetState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000067-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.security-system-state.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8


                // Minimum Value: 0
                // Maximum Value: 3
                // Step Value: 1

                // Valid Values:
                // 0 - "Stay Arm. The home is occupied and the residents
                //      are active. e.g. morning or evenings"
                // 1 - "Away Arm. The home is unoccupied"
                // 2 - "Night Arm. The home is occupied and the residents are sleeping"
                //
                // 3 - 255 - "Reserved"

                break;
            }
            case "SelectedRTPStreamConfiguration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000117-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.selected-rtp-stream-configuration
                // Permissions: Paired Write

                // Format: TLV8

                break;
            }
            case "SerialNumber":
            {
                c = readData(device, characteristic);

                if (c == "") console.log("ABC001"); else console.log(c);

                // UUID: 00000030-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.serial-number
                // Permissions: Paired Read

                // Format: string

                // Max Length: 64

                break;
            }
            case "ServiceLabelIndex": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);


                // UUID: 000000CB-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.service-label-index
                // Permissions: Paired Read

                // Format: uint8

                // Minimum Value: 1
                // Step Value: 1

                break;
            }
            case "ServiceLabelNamespace": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);


                // UUID: 000000CD-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.service-label-namespace
                // Permissions: Paired Read

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Dots. For example, "." ".." "..." "....""
                // 1 - "Arabic numerals. For example, "0,1,2,3"
                // 2-255 - "Reserved"

                break;
            }
            case "SetDuration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000D3-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.setDuration
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 3600
                // Step Value: 1

                break;
            }
            case "SetupEndpoints":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000118-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.setup-endpoints
                // Permissions: Paired Write, Paired Read

                // Format: TLV8

                // Valid Values:
                // See Hap Spec

                break;
            }
            case "SlatType":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000C0-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.type.slat
                // Permissions: Paired Read

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Horizontal"
                // 1 - "Vertical"

                break;
            }
            case "SleepDiscoveryMode":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E8-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.sleepDiscoveryMode
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - NOT_DISCOVERABLE
                // 1 - ALWAYS_DISCOVERABLE

                break;
            }
            case "SmokeDetected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000076-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.smoke-detected
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Smoke is not detected"
                // 1 - "Smoke is detected"

                break;
            }
            case "StatusActive": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000075-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.status-active
                // Permissions: Paired Read, Notify

                // Format: bool, 0 (false) and 1 (true)

                break;
            }
            case "StatusFault": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000077-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.status-fault
                // Permissions: Paired Read, Notify
                // Format: uint8
                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "No Fault"
                // 1 - "General Fault"

                break;
            }
            case "StatusJammed": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000078-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.statusJammed
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint8

                // Valid Values
                // 0 - NOT_JAMMED
                // 1 - JAMMED

                break;
            }
            case "StatusLowBattery": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000079-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.status-lo-batt
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Battery level is normal"
                // 1 - "Battery level is low"

                break;
            }
            case "StatusTampered": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000007A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.status-tampered
                // Permissions: Paired Read, Notify

                // Format: uint8

                // Valid Values:
                // 0 - "Accessory is not tampered"
                // 1 - "Accessory is tampered with"

                break;
            }
            case "StreamingStatus":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000120-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.streamingStatus
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes.js  (Values ???)

                // Format: TLV8

                // Valid Values
                //

                break;
            }
            case "SulphurDioxideDensity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 000000C5-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.so2
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                break;
            }
            case "SupportedAudioStreamConfiguration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000115-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.supportedAudioStreamConfiguration
                // Permissions: Paired Read
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                // Valid Values

                break;
            }
            case "SupportedRTPConfiguration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 00000116-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.supportedRTPConfiguration
                // Permissions: Paired Read,
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                break;
            }
            case "SupportedVideoStreamConfiguration":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000E7-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.supportedVideoStreamConfiguration
                // Permissions: Paired Read
                // Found in HomeKitTypes.js (Values ???)

                // Format: TLV8

                break;
            }
            case "SwingMode": // Optional (V2)
            {
                c = readData(device, characteristic);

                if (c == "") console.log(100); else console.log(c);

                // UUID: 000000B6-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.swing-mode
                // Permissions: Paired Read, Notify, Paired Write

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Swing disabled"
                // 1 - "Swing enabled"

                break;
            }
            case "TargetAirPurifierState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000A8-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.air-purifier.state.target
                // Permissions: Paired Write,Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Manual"
                // 1 - "Auto"

                break;
            }
            case "TargetAirQuality":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000AE-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetAirQuality
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 0

                // Valid Values
                // 0 - EXCELLENT
                // 1 - GOOD
                // 2 - FAIR

                break;
            }
            case "TargetDoorState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000032-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.door-state.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Open"
                // 1 - "Closed"
                // 2-255 - "Reserved"

                break;
            }
            case "TargetFanState": // Optional (V2)
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000BF-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.fan.state.target
                // Permissions: Paired Write,Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - "Manual"
                // 1 - "Auto"

                break;
            }
            case "TargetHeaterCoolerState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000B2-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetHeaterCoolerState
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2

                // Valid Values
                // 0 - AUTO
                // 1 - HEAT
                // 2 - COOL

                break;
            }
            case "TargetHeatingCoolingState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000033-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.heating-cooling.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 3
                // Step Value: 1

                // Valid Values:
                // 0 - "Off"
                // 1 - "Heat. If the current temperature is below the target
                //      temperature then turn on heating."
                // 2 - "Cool. If the current temperature is above the target
                //      temperature then turn on cooling."

                break;
            }
            case "TargetHorizontalTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000007B-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.horizontal-tilt.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "TargetHumidifierDehumidifierState": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000B4-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetHumidifierDehumidifierState
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 2

                // Valid Values
                // 0 - HUMIDIFIER_OR_DEHUMIDIFIER
                // 1 - HUMIDIFIER
                // 2 - DEHUMIDIFIER

                break;
            }
            case "TargetMediaState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(2); else console.log(c);

                // UUID: 00000137-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetMediaState
                // Permissions: Paired Read, Paired Write, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 3

                // Valid Values
                // 0 - PLAY
                // 1 - PAUSE
                // 2 - STOP
                // 3 - Reserved ????

                break;
            }
            case "TargetPosition":
            {

                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID 0000007C-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.position.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "TargetRelativeHumidity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 00000010-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.relative-humidity.current
                // Permissions: Paaired Write, Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "TargetSlatState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000BE-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetSlatState
                // Permissions: Paired Write, Paired Read, Notify
                // Found in HomeKitTypes.js

                // Format: uint32

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - MANUAL
                // 1 - AUTO

                break;
            }
            case "TargetTemperature":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(-20.2); else console.log(c);

                // UUID: 00000035-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.temperature.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: float

                // Minimum Value 10
                // Maximum Value 38
                // Step Value 0.1
                // Unit celsius

                break;
            }
            case "TargetTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000C2-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.tilt.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "TargetVerticalTiltAngle": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000007D-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.vertical-tilt.target
                // Permissions: Paired Read, Paired Write, Notify

                // Format: int

                // Minimum Value: -90
                // Maximum Value: 90
                // Step Value: 1
                // Unit: arcdegrees

                break;
            }
            case "TargetVisibilityState":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000134-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.targetVisibilityState
                // Permissions: Paired Read, Paired Write, Notify
                // Found in  HomeKitTypes-Television.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - SHOWN
                // 1 - HIDDEN

                break;
            }
            case "TemperatureDisplayUnits":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000036-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.temperature.units
                // Permissions: Paired Read, Paired Write, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1
                // Step Value: 1

                // Valid Values:
                // 0 - Celcius
                // 1 - Fehrenheit

                break;
            }
            case "TimeUpdate":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.timeUpdate
                // Permissions: Paired Read, Notify
                // found in HomeKitTypes-Bridge.js (Values ????)

                // Format: Bool

                // Valid Values

                break;
            }
            case "TunneledAccessoryAdvertising":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 0000009A-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.timeUpdate
                // Permissions: Paired Read, Notify
                // found in HomeKitTypes-Bridge.js (Values ????)

                // Format: Bool

                // Valid Values

                break;
            }
            case "TunneledAccessoryConnected":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000059-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.tunneledAccessoryConnected
                // Permissions: Paired Write, Paired Read, Notify
                // found in HomeKitTypes-Bridge.js (Values ????)

                // Format: Bool

                // Valid Values

                break;
            }
            case "TunneledAccessoryStateNumber":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0.0); else console.log(c);

                // UUID: 00000058-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.timeUpdate
                // Permissions: Paired Read, Notify
                // found in HomeKitTypes-Bridge.js (Values ????)

                // Format: float

                // Valid Values

                break;
            }
            case "TunnelConnectionTimeout":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(5000); else console.log(c);

                // UUID: 00000061-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.timeUpdate
                // Permissions: Paired Write, Paired Read, Notify
                // found in HomeKitTypes-Bridge.js (Values ????)

                // Format: uint32

                break;
            }
            case "ValveType":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000D5-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.valveType
                // Permissions: Paired Read, Notify
                // found in HomeKitTypes.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 3

                // Valid Values
                // 0 - GENERIC_VALVE
                // 1 - IRRIGATION
                // 2 - SHOWER_HEAD
                // 3 - WATER_FAUCET?


                break;
            }
            case "Version":
            {
                c = readData(device, characteristic);

                if (c == "LockVersion") console.log(0); else console.log(c);

                // UUID: 00000037-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.version
                // Permissions: Paired Read

                // Format: string

                // Maximum Length: 64

                break;
            }
            case "VOCDensity": // Optional
            {
                c = readData(device, characteristic);

                if (c == "") console.log(50.0); else console.log(c);

                // UUID: 000000C8-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.density.voc
                // Permissions: Paired Read, Notify

                // Format: float

                // Minimum Value: 0
                // Maximum Value: 1000

                break;
            }
            case "Volume":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 00000119-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.volume
                // Permissions: Paired Write, Paired Read, Notify

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 100
                // Step Value: 1
                // Unit: percentage

                break;
            }
            case "VolumeControlType":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000E9-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.volumeControlyype
                // Permissions: Paired Read, Notify
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Minimum Value: 0
                // Maximum Value: 1

                // Valid Values
                // 0 - NONE
                // 1 - RELATIVE
                // 2 - RELATIVE_WITH_CURRENT
                // 3 - ABSOLUTE

                break;
            }
            case "VolumeSelector":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(1); else console.log(c);

                // UUID: 000000EA-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.volumeSelector
                // Permissions: Paired Write
                // Found in HomeKitTypes-Television.js

                // Format: uint8

                // Valid Values
                // 0 - INCREMENT
                // 1 - DECREMENT

                break;
            }
            case "WaterLevel":
            {
                c = readData(device, characteristic);

                if (c == "") console.log(0); else console.log(c);

                // UUID: 000000B5-0000-1000-8000-0026BB765291
                // Type: public.hap.characteristic.waterLevel
                // Permissions: Paired Read

                // Format: float

                // Minimum: 0
                // Maximum: 100

                break;
            }
            default:
                console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                process.exit(-1);
        }

        break;

    } // End of Switch for "Get"
    case "Set":
    {
        switch(characteristic)
        {
            case "AccessoryFlags":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Active":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ActiveIdentifier":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "AccessoryIdentifier":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "AdministratorOnlyAccess": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "AirParticulateDensity":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "AirParticulateSize":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "AirQuality":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "AudioFeedback": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "BatteryLevel":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Brightness": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "CarbonDioxideDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CarbonDioxideLevel": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CarbonDioxidePeakLevel": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CarbonMonoxideDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CarbonMonoxideLevel": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CarbonMonoxidePeakLevel":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Category":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ChargingState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ClosedCaptions":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ColorTemperature": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ConfiguredName":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ConfigureBridgedAccessoryStatus":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ConfigureBridgedAccessory":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ContactSensorState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CoolingThresholdTemperature": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "CurrentAirPurifierState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentAmbientLightLevel":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentDoorState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentFanState": //  Optional (V2)
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentHeaterCoolerState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentHeatingCoolingState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentHorizontalTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentHumidifierDehumidifierState":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "CurrentMediaState":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "CurrentPosition":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentRelativeHumidity": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentSlatState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentTemperature":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentTime":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "CurrentVerticalTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "CurrentVisibilityState":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "DayoftheWeek":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "DigitalZoom":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "DiscoverBridgedAccessories":
            {
                writeData(device, characteristic, option);
                break;
            }
            case "DiscoveredBridgedAccessories":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "DisplayOrder":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "FilterChangeIndication":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "FilterLifeLevel": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "FirmwareRevision":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "HardwareRevision":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "HeatingThresholdTemperature": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "HoldPosition": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "Hue": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "Identify":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "Identifier":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ImageMirroring":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ImageRotation":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "InputDeviceType":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "InputSourceType":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "InUse":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "IsConfigured":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "LeakDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "LinkQuality":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "LockControlPoint":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "LockCurrentState": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "LockLastKnownAction": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "LockManagementAutoSecurityTimeout": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "LockPhysicalControls": // Optional (V2)
            {
                writeData(device, characteristic, option);

                break;
            }
            case "LockTargetState": // Optional
            {
                writeData(device, characteristic, option);

                // Fake it Done
                writeData(device, "LockCurrentState", option);

                break;
            }
            case "Logs": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Manufacturer":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Model":
            {
                // Not settable in Hap Spec, here for debugging.
                writeData(device, characteristic, option);

                break;
            }
            case "MotionDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Mute":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "Name":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "NightVision":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "NitrogenDioxideDensity": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ObstructionDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "OccupancyDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "On":// Not in V2
            {
                writeData(device, characteristic, option);

                break;
            }
            case "OpticalZoom":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "OutletInUse":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "OzoneDensity": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "PairSetup":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "PairVerify":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "PairingFeatures":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "PairingPairings":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "PictureMode":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "PM10Density": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "PM2_5Density": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "PositionState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "PowerModeSelection":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ProgramMode":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ProgrammableSwitchEvent":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ProgrammableSwitchOutputState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Reachable":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
               break;
            }
            case "RelativeHumidityDehumidifierThreshold":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "RelativeHumidityHumidifierThreshold":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "RelayEnabled":
            {
               writeData(device, characteristic, option);

               break;
            }
            case "RelayState":
            {
               writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
               break;
            }
            case "RelayControlPoint":
            {
               writeData(device, characteristic, option);

               // Not settable in Hap Spec, here for debugging.
               break;
            }
            case "RemainingDuration":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "RemoteKey":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "ResetFilterIndication": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "RotationDirection": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "RotationSpeed": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "Saturation": // Optional
            {
                writeData(device, characteristic, option);

                break;
            }
            case "SecuritySystemAlarmType": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SecuritySystemCurrentState":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SecuritySystemTargetState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"SecuritySystemCurrentState", option);

                break;
            }
            case "SelectedRTPStreamConfiguration":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "SerialNumber":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ServiceLabelIndex": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "ServiceLabelNamespace": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SetDuration":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "SetupEndpoints":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "SlatType":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SleepDiscoveryMode":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "SmokeDetected":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StatusActive": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StatusFault": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StatusJammed": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StatusLowBattery": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StatusTampered": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "StreamingStatus":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SulphurDioxideDensity": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SupportedAudioStreamConfiguration":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SupportedRTPConfiguration":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SupportedVideoStreamConfiguration":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "SwingMode": // Optional (V2)
            {
                writeData(device, characteristic, option);

                break;
            }
            case "TargetAirPurifierState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentAirPurifierState", option);

                break;
            }
            case "TargetAirQuality":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device, "AirQuality", option);

                break;
            }
            case "TargetDoorState":
            {
                writeData(device, characteristic, option);

                // Set to Done
                writeData(device, "CurrentDoorState", option);

                break;
            }
            case "TargetFanState": //  Optional (V2)
            {
                writeData(device, characteristic, option);

                // Fake it Done
                writeData(device, "CurrentFanState", option);

                break;
            }
            case "TargetHeaterCoolerState":
            {
                writeData(device, characteristic, option);

                // Fake it Done
                writeData(device, "CurrentHeaterCoolerState", option);

                break;
            }
            case "TargetHeatingCoolingState":
            {
                writeData(device, characteristic, option);

                // Fake it Done
                writeData(device, "CurrentHeatingCoolingState", option);

                break;
            }
            case "TargetHorizontalTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentHorizontalTiltAngle", option);

                break;
            }
            case "TargetHumidifierDehumidifierState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentHumidifierDehumidifierState", option);

                break;
            }
            case "TargetMediaState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentMediaState", option);

                break;
            }
            case "TargetPosition":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentPosition", option);

                break;
            }
            case "TargetRelativeHumidity": // Optional
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device, "CurrentRelativeHumidity", option);

                break;
            }
            case "TargetSlatState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device, "CurrentSlatState", option);

                break;
            }
            case "TargetTemperature":
            {
                writeData(device, characteristic, option);

                // Fake it
                writeData(device, "CurrentTemperature", option);

                break;
            }
            case "TargetTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentTiltAngle", option);

                break;
            }
            case "TargetVerticalTiltAngle": // Optional
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentVerticalTiltAngle", option);

                break;
            }
            case "TargetVisibilityState":
            {
                writeData(device, characteristic, option);

                // Set to done
                writeData(device,"CurrentVisibilityState", option);

                break;
            }
            case "TemperatureDisplayUnits":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "TimeUpdate":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "TunneledAccessoryAdvertising":
            {
               writeData(device, characteristic, option);

               // Not settable in Hap Spec, here for debugging.
               break;
            }
            case "TunneledAccessoryConnected":
            {
               writeData(device, characteristic, option);

               break;
            }
            case "TunneledAccessoryStateNumber":
            {
               writeData(device, characteristic, option);

               // Not settable in Hap Spec, here for debugging.
               break;
            }
            case "TunnelConnectionTimeout":
            {
               writeData(device, characteristic, option);

               break;
            }
            case "ValveType":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Version":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "VOCDensity": // Optional
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "Volume":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "VolumeControlType":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            case "VolumeSelector":
            {
                writeData(device, characteristic, option);

                break;
            }
            case "WaterLevel":
            {
                writeData(device, characteristic, option);

                // Not settable in Hap Spec, here for debugging.
                break;
            }
            default:
                console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                process.exit(-1);
        }

        break;
    } // End of Switch Device for "Set"
    default:
        console.error("Unknown IO" + io );
        process.exit(-1);
}

//console.log("Say What Device:" + device + " Characteristic:" + characteristic + " Option:" + option);

process.exit(0);


