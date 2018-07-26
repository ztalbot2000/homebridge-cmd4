//  State.js 
//
// Description:
//   This script *CAN* be called by the HomeBridge plugin Cmd4 as defined in your config.json
//   file.  The purpose is to fake the existance of an accessory or to be modified by you
//   such that acessories can Get/Set characteristics as defined in the HomeKit Accessory
//   Specifications. 
//   
// Plugin Installation: 
//   - npm install [-g] Cmd4
//   - cp State.js  $HOME/.homebridge
//   - chmod u+x $HOME/.homebridge/Cmd4Scripts/State.js
//
// Parameters are:
//    Get <accessory name> <characteristic>
//    Set <accessory name> <characteristic> <value>
//
// Note 1: These paramaters match the those of the Cmd4 plugin.
// Note 2: All characteristics of the HomeKit Accessory Protocol (HAP)
//         specifications are supported, except for camera streaming;
//         Though I have found some like LockManagement are not within IOS.
//         Side Note: The Eve app is nicer, try it.
// Note 3: The Hap spec is quoted throughout, but this is not the spec so
//         this is not gauranteed to be correct.
//
//
// How it works:
//    A characteristic value is stored in the $HOME/.homebridge/Cmd4Scripts/Cmd4States in 
//    the file named "Status + <Accessory Name> _ <Characteristic>" and is returned or
//    written to based on the <Get|Set> option.
//
//    For example:   node State.js Set My_Door MotionDetected 0
//       will create the file .homebridge/Cmd4Scripts/Cmd4States/My_Door_MotionDetected
//       with the contents of "0"
//       Note: See how this is run from $HOME (Important!)
//
// Environmental Variables Used:
//    $HOME - to create path to .homebridge
//
//
// Interesting fact.  If you use characteristics as is, and define all possible accessories in your config.json
//                    file, they will all appear fully functional within HomeKit. In this way you
//                    can play with HomeKit and not have any physical devices at all.  Cool Eh!
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
var device = "";
var io = "";
var characteristic = "";
var option = "";

if (length == 2) process.exit(0);

if (length <= 2) {
   console.log("Usage: " + __filedevice + " <Get|Set> <AccessoryName> [Value]");
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
    var c = "";
  
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


switch(io)
{
   case "Get":
   {
      switch (device)
      {
         case "My_Fan":
         case "My v1 Fan":
         case "My_v1Fan":
         case "My_v2Fan":   // There is no need to duplicate everything
         {                  // for more accessories of the same type.
            //==============================
            //    FAN (GET)
            //
            // UUID: 000000B7-0000-1000-8000-0026BB765291
            // Type: public.hap.service.fanv2
            //==============================
            switch(characteristic)
            {
               case "On": // (V1only)
               {  
                  var c = readData(device, characteristic);
                  
                  if (c == "") console.log(0); else console.log(c);
                  
                  // UUID: 00000025-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.on
                  // Permissions: Paired Read, Paired Write, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "Active": // (V2)
               {
                  var c = readData(device, characteristic);
    
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
               case "CurrentFanState": // Optional (V2)
               {
                  var c = readData(device, characteristic);
    
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
               case "TargetFanState": // Optional (V2)
               {
                  var c = readData(device, characteristic);
    
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
               case "RotationDirection": // Optional
               {
                  var c = readData(device, characteristic);
    
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
                  var c = readData(device, characteristic);

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
               case "SwingMode": // Optional (V2)
               {
                  var c = readData(device, characteristic);
    
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
              case "LockPhysicalControls": // Optional (V2)
              {
                  var c = readData(device, characteristic);

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
              default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
        }
         case "My_GarageDoorOpener":
         {
            //==============================
            //    GARAGE DOOR OPENER (GET)
            //
            // UUID: 00000041-0000-1000-8000-0026BB765291
            // Type: public.hap.service.garage-door-opener
            //==============================
            switch(characteristic) 
            {
               case "CurrentDoorState":
               {
                  var c = readData(device, characteristic);
   
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
               case "TargetDoorState":
               {
                  var c = readData(device, characteristic);
   
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
               case "ObstructionDetected":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000024-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.obstruction-detected
                  // Permissions: Paired Read, Notify
   
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "LockCurrentState": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "LockTargetState": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Dimmable_Light":
         case "My_OnOff_Light":   // There is no need to duplicate everything
         {                        // for more accessories of the same type.
            //==============================
            //    LIGHTBULB (GET)
            //
            // UUID: 00000043-0000-1000-8000-0026BB765291
            // Type: public.hap.service.lightbulb
            //==============================
            switch(characteristic)
            {
               case "On":
               {  
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

                  // UUID: 00000025-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.on
                  // Permissions: Paired Read, Paired Write, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "Brightness": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "Hue": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "Saturation": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "ColorTemperature": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_LockManagement":
         {
            //==============================
            //    LOCK MANAGEMENT (GET)
            //
            // UUID: 00000044-0000-1000-8000-0026BB765291
            // Type: public.hap.service.lock-management
            //==============================
            switch(characteristic)
            {
               case "LockControlPoint":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000019-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.lock-management.control-point
                  // Permissions: Paired Write
                  // Format: tlv8
   
                  break;
               }
               case "Version":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "LockVersion") console.log(0); else console.log(c);
   
                  // UUID: 00000037-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.version
                  // Permissions: Paired Read
   
                  // Format: string
   
                  // Maximum Length: 64

                  break;
               }
               case "Logs": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log("OptionalLogs"); else console.log(c);
   
                  // UUID: 0000001F-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.logs
                  // Permissions: Paired Read, Notify
   
                  // Format: tlv8
   
                  break;
               }
               case "AudioFeedback": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000005-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.audio-feedback
                  // Permissions: Paired Read, Paired Write, Notify
   
                  // Format: bool
   
                  break;
               }
               case "LockManagementAutoSecurityTimeout": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(26); else console.log(c);
   
                  // UUID: 0000001A-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.lock-management.auto-secure-timeout
                  // Permissions: Paired Read, Paired Write, Notify
                  // Format: uint32
                  // Unit: seconds
   
                  break;
               }
               case "AdministorOnlyAccess": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000001-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.administrator-only-access
                  // Permissions: Paired Read, Paired Write, Notify
   
                  // Format: bool
   
                  break;
               }
               case "LockLastKnownAction": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "CurrentDoorState": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "MotionDetected": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000022-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.motion-detected
                  // Permissions: Paired Read, Notify
   
                  // Format: bool
   
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_LockMechanism":
         {
            //==============================
            //    LOCK Mechanism (GET)
            //
            // UUID: 00000044-0000-1000-8000-0026BB765291
            // Type: public.hap.service.lock-management
            //==============================
            switch(characteristic) 
            {
               case "LockCurrentState":
               {
                  var c = readData(device, characteristic);
   
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
               case "LockTargetState":
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Outlet":
         {
            //==============================
            //      OUTLET (GET)
            //
            // UUID: 00000047-0000-1000-8000-0026BB765291
            // Type: public.hap.service.outlet
            //==============================
            switch(characteristic)
            {
               case "On":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000025-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.on
                  // Permissions: Paired Read, Paired Write, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "OutletInUse":
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

                  // UUID: 00000026-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.outlet-in-use
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
        case "My_Switch":
        {
           //==============================
           //    SWITCH (GET)
           //
           // UUID: 00000049-0000-1000-8000-0026BB765291
           // Type: public.hap.service.switch
           //==============================
           switch(characteristic)
           {
              case "On":
              {
                 var c = readData(device, characteristic);

                 if (c == "") console.log(0); else console.log(c);

                 // UUID: 00000025-0000-1000-8000-0026BB765291
                 // Type: public.hap.characteristic.on
                 // Permissions: Paired Read, Paired Write, Notify
                 // Format: bool, 0 (false) and 1 (true)

                 break;
              }
              default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Thermostat":
         {
            //==============================
            //    THERMOSTAT (GET)
            //
            // UUID: 0000004A-0000-1000-8000-0026BB765291
            // Type: public.hap.service.thermostat
            //==============================
            switch(characteristic) 
            {
               case "CurrentHeatingCoolingState":
               {
                  var c = readData(device, characteristic);
   
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
               case "TargetHeatingCoolingState":
               {
                  var c = readData(device, characteristic);
   
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
               case "CurrentTemperature":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
   
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
               case "TargetTemperature":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
   
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
               case "TemperatureDisplayUnits":
               {
                  var c = readData(device, characteristic);
   
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
               case "CoolingThresholdTemperature": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "CurrentRelativeHumidity": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "HeatingThresholdTemperature": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "TargettRelativeHumidity": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_AirQualitySensor":
         {
            //==============================
            //    AIR QUALITY SENSOR (GET)
            //
            // UUID: 0000008D-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.air-quality
            //==============================
            switch(characteristic) 
            {
               case "AirQuality":
               {
                  var c = readData(device, characteristic);
   
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
               case "OzoneDensity": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);

                  // UUID: 000000C3-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.ozone
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000k

                  break;
               }
               case "NitrogenDioxideDensity": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
   
                  // UUID: 000000C4-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.no2
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000

                  break;
               }
               case "SulphurDioxideDensity": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);

                  // UUID: 000000C5-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.so2
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000
 
                  break;
               }
               case "PM2_5Density": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
                  // UUID: 000000C6-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.pm25
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000
   
                  break;
               }
               case "PM10Density": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);

                  // UUID: 000000C7-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.pm10
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000
   
                  break;
               }
               case "VOCDensity": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
 
                  // UUID: 000000C8-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.density.voc
                  // Permissions: Paired Read, Notify

                  // Format: float

                  // Minimum Value: 0
                  // Maximum Value: 1000

                  break;
               }
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_SecuritySystem":
         {
            //==============================
            //    SECURITY SYSTEM (GET)
            //
            // UUID: 0000007E-0000-1000-8000-0026BB765291
            // Type: public.hap.service.security-system
            //==============================
            switch(characteristic)
            {
               case "SecuritySystemCurrentState":
               {
                  var c = readData(device, characteristic);
   
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
                  var c = readData(device, characteristic);
   
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
               case "SecuritySystemAlarmType": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_CarbonMonoxideSensor":
         {
            //==============================
            //    CARBON MONOXIDE SENSOR (GET)
            //
            // UUID: 0000007F-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.carbon-monoxide
            //==============================
            switch(characteristic) 
            {
               case "CarbonMonoxideDetected":
               {  
                  var c = readData(device, characteristic);
                  
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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "CarbonMonoxideLevel": // Optional
               {
                  var c = readData(device, characteristic);
   
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
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000091-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.carbon-monoxide.peak-level
                  // Permissions: Paired Read, Notify
   
                  // Format: float
   
                  // Minimum Value: 0
                  // Maximum Value: 100

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_ContactSensor":
         {
            //==============================
            //    CONTACT SENSOR (GET)
            //
            // UUID: 00000080-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.contact
            //==============================
            switch(characteristic)
            {
               case "ContactSensorState":
               {
                  var c = readData(device, characteristic);
                  
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
               case "StatusActive":
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault":
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered":
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery":
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Door":
         {
            //==============================
            //    DOOR (GET)
            //
            // UUID: 00000081-0000-1000-8000-0026BB765291
            // Type: public.hap.service.door
            //==============================
            switch(characteristic)
            {
               case "CurrentPosition":
               {
                  var c = readData(device, characteristic);
   
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
               case "TargetPosition":
               {
   
                  var c = readData(device, characteristic);
   
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
               case "PositionState":
               {
                  var c = readData(device, characteristic);
   
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
               case "HoldPosition": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 0000006F-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.position.hold
                  // Permissions: Paired Write
   
                  // Format: bool, 0 (false) and 1 (true)
          
                  break;
               }
               case "ObstructionDetected": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000024-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.obstruction-detected
                  // Permissions: Paired Read, Notify
   
                  // Format: bool, 0 (false) and 1 (true)
   
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_HumiditySensor":
         {
            //==============================
            //    HUMIDITY SENSOR (GET)
            //
            // UUID: 00000082-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.humidity
            //==============================
            switch(characteristic)
            {
               case "CurrentRelativeHumidity":
               {
                  var c = readData(device, characteristic);
                 
                  if (c == "") console.log(1); else console.log(c);

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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         } 

         case "My_LeakSensor":
         {
            //==============================
            //    LEAK SENSOR (GET)
            //
            // UUID: 00000083-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.leak
            //==============================
            switch(characteristic)
            {
               case "LeakDetected":
               {
                  var c = readData(device, characteristic);

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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_LightSensor":
         {
            //==============================
            //    LIGHT SENSOR (GET)
            //
            // UUID: 00000084-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.light
            //==============================
            switch(characteristic)
            {
               case "CurrentAmbientLightLevel":
               {
                  var c = readData(device, characteristic);

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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_MotionSensor":
         {  
            //==============================
            //    MOTION SENSOR (GET)
            //
            // UUID: 00000085-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.motion
            //==============================
            switch(characteristic)
            {  
               case "MotionDetected":
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

                  // UUID: 00000022-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.motion-detected
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)
 
                  break;
               }
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_OccupancySensor":
         {  
            //==============================
            //    OCCUPANCY SENSOR (GET)
            //
            // UUID: 00000086-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.occupancy
            //==============================
            switch(characteristic)
            {  
               case "OccupancyDetected":
               {
                  var c = readData(device, characteristic);

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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(1); else console.log(c);

                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify

                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_SmokeSensor":
         {
            //==============================
            //    SMOKE SENSOR (GET)
            //
            // UUID: 00000086-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.occupancy`
            //==============================
            switch(characteristic)
            {
               case "SmokeDetected":
               {
                  var c = readData(device, characteristic);
   
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
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 0000007A-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-tampered
                  // Permissions: Paired Read, Notify
   
                  // Format uint8
   
                  // Minimum Value: 0
                  // Maximum Value: 1
                  // Step Value: 1
   
                  // Valid Values:
                  // 0 - "Accessory is not tampered"
                  // 1 - "Accessory is tampered with"

                  break;
               }
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_StatelessProgrammableSwitch":
         {  
            //==============================
            //    STATELESS PROGRAMMABLE SWITCH (GET)
            //
            // UUID: 00000089-0000-1000-8000-0026BB765291
            // Type: public.hap.service.stateless-programmable-switch
            //==============================
            switch(characteristic)
            {  
               case "ProgrammableSwitchEvent":
               {
                  var c = readData(device, characteristic);
                  
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
               case "ServiceLabelIndex": // Optional
               {
                  var c = readData(device, characteristic);

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
                  var c = readData(device, characteristic);

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

               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_TemperatureSensor":
         {
            //==============================
            //    TEMPERATURE SENSOR (GET)
            //
            // UUID: 0000008A-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.temperature
            //==============================
            switch(characteristic)
            {
               case "CurrentTemperature":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(50.0); else console.log(c);
   
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
               case "StatusActive": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)
          
                  break;
               }
               case "StatusFault": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
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
                  var c = readData(device, characteristic);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
        }
        case "My_Window":
         {  
            //==============================
            //    WINDOW (GET)
            //
            // UUID: 0000008B-0000-1000-8000-0026BB765291
            // Type: public.hap.service.window
            //==============================
            switch(characteristic)
            {  
               case "CurrentPosition":
               {
                  var c = readData(device, characteristic);
   
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
               case "TargetPosition":
               {
                  var c = readData(device, characteristic);
   
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
               case "PositionState":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(2); else console.log(c);
   
                  process.exit(0);
   
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
               case "HoldPosition": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 0000006F-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.position.hold
                  // Permissions: Paired Write
   
                  // Format: bool, 0 (false) and 1 (true)
          
                  break;
               }
               case "ObstructionDetected": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000024-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.obstruction-detected
                  // Permissions: Paired Read, Notify
   
                  // Format: bool, 0 (false) and 1 (true)
   
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
        case "My_WindowCovering":
         {  
            //==============================
            //    WINDOW COVERING (GET)
            //
            // UUID: 0000008C-0000-1000-8000-0026BB765291
            // Type: public.hap.service.window-covering
            //==============================
            switch(characteristic)
            {  
               case "TargetPosition":
               {
                  var c = readData(device, characteristic);
   
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
               case "CurrentPosition":
               {
                  var c = readData(device, characteristic);
   
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
               case "PositionState":
               {
                  var c = readData(device, characteristic);
   
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
               case "HoldPosition": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 0000006F-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.position.hold
                  // Permissions: Paired Write
   
                  // Format: bool, 0 (false) and 1 (true)
          
                  break;
               }
               case "CurrentHorizontalTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "TargetHorizontalTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "CurrentVerticalTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "TargetVerticalTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "ObstructionDetected": // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  // UUID: 00000024-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.obstruction-detected
                  // Permissions: Paired Read, Notify
   
                  // Format: bool, 0 (false) and 1 (true)
   
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_BatteryService":
         {
            //==============================
            //    BATTERY SERVICE (GET)
            //
            // UUID: 00000096-0000-1000-8000-0026BB765291
            // Type: public.hap.service.battery
            //==============================
            switch(characteristic)
            {
               case "BatteryLevel":
               {
                  var c = readData(device, characteristic);
   
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
               case "ChargingState":
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusLowBattery":
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_CarbonDioxideSensor":
         {
            //==============================
            //    CARBON DIOXIDE SENSOR (GET)
            //
            // UUID: 00000097-0000-1000-8000-0026BB765291
            // Type: public.hap.service.sensor.carbon-dioxide
            //==============================
            switch(characteristic) 
            {
               case "CarbonDioxideDetected":
               {
                  var c = readData(device, characteristic);
  
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
               case "StatusActive":  // Optional
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(1); else console.log(c);
   
                  // UUID: 00000075-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.status-active
                  // Permissions: Paired Read, Notify
                  // Format: bool, 0 (false) and 1 (true)

                  break;
               }
               case "StatusFault":  // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusTampered": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "StatusLowBattery": // Optional
               {
                  var c = readData(device, characteristic);
   
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
               case "CarbonDioxideLevel": // Optional
               {
                  var c = readData(device, characteristic);

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
                  var c = readData(device, characteristic);
                  
                  if (c == "") console.log(0); else console.log(c);

                  // UUID: 00000094-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.carbon-dioxide.peak-level
                  // Permissions: Paired Read, Notify
                  // Format: float
                  // Minimum Value: 0
                  // Maximum Value: 100000

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_CameraRTPStreamManagement":
         {  
            //==============================
            //    CAMERA RTP STREAM
            //    MANAGEMENT (GET)
            //
            // UUID: 00000110-0000-1000-8000-0026BB765291
            // Type: public.hap.service.camera-rtp-stream-management
            //==============================
            console.error("Camera RTP Stream Management cannot be supported fromthe command line.");
            process.exit(-1);
            break;
         }
         case "My_Microphone":
         {  
            //==============================
            //    MICROPHONE (GET)
            //
            // UUID: 00000112-0000-1000-8000-0026BB765291
            // Type: public.hap.service.microphone
            //==============================
            switch(characteristic)
            {  
               case "Mute":
               {
                  var c = readData(device, characteristic);

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
               case "Volume":
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Speaker":
         { 
            //==============================
            //    SPEAKER (GET)
            //
            // UUID: 00000113-0000-1000-8000-0026BB765291
            // Type: public.hap.service.speaker
            //==============================
            switch(characteristic)
            { 
               case "Mute":
               {
                  var c = readData(device, characteristic);
                  
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
               case "Volume":
               {
                  var c = readData(device, characteristic);
                  
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Doorbell":
         { 
            //==============================
            //    DOORBELL (GET)
            //
            // UUID: 00000121-0000-1000-8000-0026BB765291
            // Type: public.hap.service.doorbell
            //==============================
            switch(characteristic)
            { 
               case "ProgrammableSwitchEvent":
               {
                  var c = readData(device, characteristic);
                  
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
               case "Volume": // Optional
               {
                  var c = readData(device, characteristic);

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
               case "Brightness": // Optional
               {
                  var c = readData(device, characteristic);
                  
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Slat":
         { 
            //==============================
            //    SLAT (GET)
            //
            // UUID: 000000B9-0000-1000-8000-0026BB765291
            // Type: public.hap.service.vertical-slat
            //==============================
            switch(characteristic)
            {
               case "CurrentSlatType":
               {
                  var c = readData(device, characteristic);
                  
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
               case "SlatType":
               {
                  var c = readData(device, characteristic);
                  
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
               case "SwingMode": // Optional
               {
                  var c = readData(device, characteristic);
                  
                  if (c == "") console.log(0); else console.log(c);
                  
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
               case "CurrentTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);
                  
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
               case "TargetTiltAngle": // Optional
               {
                  var c = readData(device, characteristic);
                  
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_FilterMaintenance":
         { 
            //==============================
            //    FILTER MAINTENANCE (GET)
            //
            // UUID: 000000BA-0000-1000-8000-0026BB765291
            // Type: public.hap.service.filter-maintenance
            //==============================
            switch(characteristic)
            {
               case "FilterChangeIndication":
               {
                  var c = readData(device, characteristic);
                  
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
                  var c = readData(device, characteristic);
                  
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
               case "ResetFilterIndication": // Optional
               {
                  var c = readData(device, characteristic);
                  
                  if (c == "") console.log(0); else console.log(c);

                  // UUID: 000000AD-0000-1000-8000-0026BB765291
                  // Type: public.hap.characteristic.filter.reset-indication
                  // Permissions: Paired Write

                  // Format: uint8

                  // Minimum Value: 1
                  // Maximum Value: 1
                  
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_AirPurifier":
         {
            //==============================
            //    AIR PURIFIER (GET)
            //
            // UUID: 000000BB-0000-1000-8000-0026BB765291
            // Type: public.hap.service.air-purifier
            //==============================
            switch(characteristic)
            {
               case "Active":
               {
                  var c = readData(device, characteristic);
                  
                  if (c == "") console.log(0); else console.log(c);
                  
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
               case "CurrentAirPurifierState":
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

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
               case "TargetAirPurifierState":
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

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
               case "RotationSpeed": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

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
               case "SwingMode": // Optional
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

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
               case "LockPhysicalControls": // Optional
               {
                  var c = readData(device, characteristic);

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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_ServiceLabel":
         {
            //==============================
            //    SERVICE LABEL (GET)
            //
            // UUID: 000000CC-0000-1000-8000-0026BB765291
            // Type: public.hap.service.service-label
            //==============================
            switch(characteristic)
            {
               case "ServiceLabelNamespace":
               {
                  var c = readData(device, characteristic);
                  
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_TV":
         {
            //==============================
            //      TV (GET)
            //
            // This device is not part of Homekit
            // (Too bad!)
            //
            // It is added so Siri understands
            // my Sony TV.
            //==============================
            switch(characteristic)
            {
               case "On": // All Unknown devices must have this.
               {
                  var c = readData(device, characteristic);

                  if (c == "") console.log(0); else console.log(c);

                  process.exit(0);
                  break;
               }
               case "VolumeUp": // Does not exist in Specifications. Testing
               {
                  var c = readData(device, characteristic);
   
                  if (c == "") console.log(0); else console.log(c);
   
                  process.exit(0);
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         default:
           console.error("Unknown Device for:"  + io  +  ": Device:" + device);
           process.exit(-1);
      } // End of Switch for Device

      break;

   } // End of Switch for "Get"
   case "Set":
   {
      switch(device)
      {
         case "My_Fan":
         case "My v1 Fan":
         case "My_v1Fan":
         case "My_v2Fan":
         {
            //==============================
            //    FAN (SET)
            // All the Hap Specs are in the
            // Get section.
            //==============================
            switch(characteristic)
            {
               case "On":// Not in V2
               { 
                  writeData(device, characteristic, option);

                  break;
               }
               case "Active": // (V2)
               {  
                  writeData(device, characteristic, option);

                  break;
               }
               case "CurrentFanState": //  Optional (V2)
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "TargetFanState": //  Optional (V2)
               {
                  writeData(device, characteristic, option);

                  // Fake it Done
                  writeData(device, "CurrentFanState", option);

                  // Not settable in Hap Spec, here for debugging.
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
               case "SwingMode": // Optional (V2)
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "LockPhysicalControls": // Optional (V2)
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_GarageDoorOpener":
         {
            //==============================
            //    GarageDoorOpener  (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentDoorState":
               {  
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }  
               case "TargetDoorState":
               {
                  writeData(device, characteristic, option);

                  // Set to Done
                  writeData(device, "CurrentDoorState", option);
                 
                  break;
               }
               case "ObstructionDetected":
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
               case "LockTargetState": // Optional
               {  
                  writeData(device, characteristic, option);

                  // Fake it Done
                  writeData(device, "LockCurrentState", option);
                  
                  break;
               }  

               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Dimmable_Light":
         case "My_OnOff_Light":   // There is no need to duplicate everything
         {                        // for more accessories of the sametype.
            //==============================
            //    LIGHTBULB (SET)
            //==============================
            switch(characteristic)
            {
               case "On":
               {  
                  writeData(device, characteristic, option);

                  break;
               }
               case "Brightness": // Optional
               {
               }
                  writeData(device, characteristic, option);

                  break;
               case "Hue": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "Saturation": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "ColorTemperature": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_LockManagement":
         {
            //==============================
            //    LOCK MANAGEMENT (SET)
            //==============================
            switch(characteristic)
            {
               case "LockControlPoint":
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
               case "Logs": // Optional
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
               case "LockManagementAutoSecurityTimeout": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "AdministorOnlyAccess": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "LockLastKnownAction": // Optional
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
               case "MotionDetected":
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
         }
         case "My_LockMechanism":
         {
            //==============================
            //    LockMechanism  (SET)
            //==============================
            switch(characteristic)
            {
               case "LockCurrentState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "LockTargetState":
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"LockCurrentState", option);
                 
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Outlet":
         {
            //==============================
            //    OUTLET (SET)
            //==============================
            switch(characteristic)
            {
               case "On":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "OutletInUse":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Switch":
        {
           //==============================
           //    SWITCH (SET)
           //==============================
           switch(characteristic)
           {
              case "On":
              {
                  writeData(device, characteristic, option);
                 
                  break;
              }
              default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
           }
           break;
        }
         case "My_Thermostat":
         {
            //==============================
            //    THERMOSTAT  (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentHeatingCoolingState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "TargetHeatingCoolingState":
               {
                  writeData(device, characteristic, option);

                  // Fake it Done
                  writeData(device, "CurrentHeatingCoolingState", option);

                  break;
               }
               case "CurrentTemperature":
               {  
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "TargetTemperature":
               {
                  writeData(device, characteristic, option);

                  // Fake it
                  writeData(device, "CurrentTemperature", option);

                  break;
               }
               case "TemperatureDisplayUnits":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "CoolingThresholdTemperature": // Optional
               {
                  writeData(device, characteristic, option);
                 
                  break;
               } 
               case "HeatingThresholdTemperature": // Optional
               {
                  writeData(device, characteristic, option);
                 
                  break;
               } 
               case "CurrentRelativeHumidity": // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "TargetRelativeHumidity": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }

               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_AirQualitySensor":
         {
            //==============================
            //    AIR QUALITY SENSOR (SET)
            //==============================
            switch(characteristic) 
            {
               case "AirQuality":
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
               case "NitrogenDioxideDensity": // Optional
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
               case "PM2_5Density": // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
   
                  break;
               }
               case "PM10Density": // Optional
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_SecuritySystem":
         {
            //==============================
            //    SECURITY SYSTEM (SET)
            //==============================
            switch(characteristic)
            {
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
               case "SecuritySystemAlarmType": // Optional
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
               case "StatusTampered": // Optional
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
         }
         case "My_CarbonMonoxideSensor":
         {
            //==============================
            //    CARBON MONOXIDE SENSOR (SET)
            //==============================
            switch(characteristic) 
            {
               case "CarbonMonoxideDetected":
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_ContactSensor":
         {
            //==============================
            //    CONTACT SENSOR (SET)
            //==============================
            switch(characteristic)
            {
               case "ContactSensorState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusActive":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusFault":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusTampered":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusLowBattery":
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
         }
         case "My_Door":
         {
            //==============================
            //    DOOR  (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentPosition":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "TargetPosition":
               {
                  writeData(device, characteristic, option);
                  // Set to done
                  writeData(device,"CurrentPosition", option);
                 
                  break;
               }
               case "PositionState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  break;
               }
               case "HoldPosition": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "ObstructiinDetected": // Optional
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
         }
         case "My_HumiditySensor":
         {
            //==============================
            //    HUMIDITY SENSOR (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentRelativeHumidity":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusActive":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusFault":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusTampered":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusLowBattery":
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
         } 

         case "My_LeakSensor":
         {
            //==============================
            //    LEAK SENSOR (SET)
            //==============================
            switch(characteristic)
            {
               case "LeakDetected":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusActive":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusFault":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusTampered":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusLowBattery":
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
         }
         case "My_LightSensor":
         {
            //==============================
            //    LIGHT SENSOR (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentAmbientLightLevel":
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_MotionSensor":
         {  
            //==============================
            //    MOTION SENSOR (SET)
            //==============================
            switch(characteristic)
            {  
               case "MotionDetected":
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_OccupancySensor":
         {  
            //==============================
            //    OCCUPANCY SENSOR (SET)
            //==============================
            switch(characteristic)
            {  
               case "OccupancyDetected":
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_SmokeSensor":
         {
            //==============================
            //    SMOKE SENSOR (SET)
            //==============================
            switch(characteristic)
            {
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
               case "StatusTampered": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_StatelessProgrammableSwitch":
         {  
            //==============================
            //    STATELESS PROGRAMMABLE SWITCH (SET)
            //==============================
            switch(characteristic)
            {  
               case "ProgrammableSwitchEvent":
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

               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_TemperatureSensor":
         {
            //==============================
            //    TEMPERATURE SENSOR (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentTemperature":
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
        }
        case "My_Window":
         {  
            //==============================
            //    WINDOW (SET)
            //==============================
            switch(characteristic)
            {  
               case "CurrentPosition":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
          
                  break;
               }
               case "TargetPosition":
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentPosition", option);
   
          
                  break;
               }
               case "PositionState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
          
                  break;
               }
               case "HoldPosition": // Optional
               {
                  writeData(device, characteristic, option);
   
                  break;
               }
               case "ObstructionDetected": // Optional
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
         }
        case "My_WindowCovering":
         {  
            //==============================
            //    WINDOW COVERING (SET)
            //==============================
            switch(characteristic)
            {  
               case "TargetPosition":
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentPosition", option);
          
                  break;
               }
               case "CurrentPosition":
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
               case "HoldPosition": // Optional
               {
                  writeData(device, characteristic, option);
   
                  break;
               }
               case "CurrentHorizontalTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "TargetHorizontalTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentHorizontalTiltAngle", option);

                  break;
               }
               case "CurrentVerticalTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "TargetVerticalTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentVerticalTiltAngle", option);

                  break;
               }
               case "ObstructionDetected": // Optional
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
         }
         case "My_BatteryService":
         {
            //==============================
            //    BATTERY SERVICE (SET)
            //==============================
            switch(characteristic)
            {
               case "BatteryLevel":
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
               case "StatusLowBattery":
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
         }
         case "My_CarbonDioxideSensor":
         {
            //==============================
            //    CARBON DIOXIDE SENSOR (SET)
            //==============================
            switch(characteristic) 
            {
               case "CarbonDioxideDetected":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusActive":  // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "StatusFault":  // Optional
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
               case "StatusLowBattery": // Optional
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
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_CameraRTPStreamManagement":
         {  
            //==============================
            //    CAMERA RTP STREAM
            //    MANAGEMENT (SET)
            //==============================
            console.error("Camera RTP Stream Management cannot be supported fromthe command line.");
            process.exit(-1);
            break;
         }
        case "My_Microphone":
         {  
            //==============================
            //    MICROPHONE (SET)
            //==============================
            switch(characteristic)
            {  
               case "Mute":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "Volume":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Speaker":
         { 
            //==============================
            //    SPEAKER (SET)
            //==============================
            switch(characteristic)
            { 
               case "Mute":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "Volume":
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Doorbell":
         { 
            //==============================
            //    DOORBELL (SET)
            //==============================
            switch(characteristic)
            { 
               case "ProgrammableSwitchEvent":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "Volume": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "Brightness": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_Slat":
         { 
            //==============================
            //    SLAT (SET)
            //==============================
            switch(characteristic)
            {
               case "CurrentSlatType":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "SlatType":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "SwingMode": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "CurrentTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.
                  
                  break;
               }
               case "TargetTiltAngle": // Optional
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentTiltAngle", option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_FilterMaintenance":
         { 
            //==============================
            //    FILTER MAINTENANCE (SET)
            //==============================
            switch(characteristic)
            {
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
               case "ResetFilterIndication": // Optional
               {
                  writeData(device, characteristic, option);
                  
                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_AirPurifier":
         {
            //==============================
            //    AIR PURIFIER (SET)
            //==============================
            switch(characteristic)
            {
               case "Active":
               {
                  writeData(device, characteristic, option);

                  // This is weird, but to get IOS HomeKit to
                  // stop spinning its wheels, you must set this too!
                  writeData(device,"CurrentAirPurifierState", option);
                  break;
               }
               case "CurrentAirPurifierState":
               {
                  writeData(device, characteristic, option);

                  // Not settable in Hap Spec, here for debugging.

                  break;
               }
               case "TargetAirPurifierState":
               {
                  writeData(device, characteristic, option);

                  // Set to done
                  writeData(device,"CurrentAirPurifierState", option);

                  break;
               }
               case "RotationSpeed": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "SwingMode": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               case "LockPhysicalControls": // Optional
               {
                  writeData(device, characteristic, option);

                  break;
               }
               default:
                 console.error("Unknown Characteristic for:"  + io  +  " Device:" + device  +  " Characteristic:" + characteristic);
                 process.exit(-1);
            }
            break;
         }
         case "My_ServiceLabel":
         {
            //==============================
            //    SERVICE LABEL (SET)
            //==============================
            switch(characteristic)
            {
               case "ServiceLabelNamespace":
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
         }
        default:
           console.error("Unknown Device for:"  + io  +  ": Device:" + device);
           process.exit(-1);
        
      } // End of Switch for Device
      break;
   } // End of Switch Device for "Set"
   default:
      console.error("Unknown IO" + io );
      process.exit(-1);
}
   
//console.log("Say What Device:" + device + " Characteristic:" + characteristic + " Option:" + option);
   
process.exit(0);
   
