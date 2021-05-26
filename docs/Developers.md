# Homebridges-cmd4 - Cmd4 Developers Guide.
<base _target="_self">


## Table of Contents
* [**About CMD4 Developers Guide**](#about-cmd4-developers-guide)
* [**Where to Begin**](#where-to-begin)
* [**Homebridge API**](#homebridge-api)
* [**Platform Accessories**](#platform-accessories)
* [**Standard Accessories**](#standard-accessories)
* [***New Cmd4 3.0 Directives***](#new-cmd4-30-directives)
* [**Cmd4 Directives**](#cmd4-directives)
* [**Cmd4 Devices and Characteristics**](#cmd4-devices-and-characteristics)
* [**Priority Queued Polling**](#priority-queued-polling)
* [**Migrating from Homebridge-cmdswitch2**](#migrating-from-homebridge-cmdswitch2)
* [**Developer Notes**](#developer-notes)
* [**Adding in Fakegato history**](#adding-in-fakegato-history)
* [**Unit Testing**](#unit-testing)
* [**License**](#license)

## About CMD4 Developers Guide
&nbsp;&nbsp;&nbsp; This document will help you understand what is needed to integrate your own scripts into Cmd4.

## Where to begin
&nbsp;&nbsp;&nbsp; Cmd4 comes with a fully populated and documented [**config.json**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/Extras/config.json) file, this Developers Guide, an [Advanced](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/AdvancedTroubleShooting.md) troubleshoting guide for you the script writer and finally some auto generated device and characteristic description documentation [https://ztalbot2000.github.io/homebridge-cmd4](https://ztalbot2000.github.io/homebridge-cmd4/#).<BR>

&nbsp;&nbsp;&nbsp; Next you should look at scripts that might already exist. Within the Cmd4 directory structure there is a path of "Extras/Cmd4Scripts/ExampleScripts" that may already exist for you as a starting point.<BR>
* [**basic_ping.sh**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/Extras/Cmd4Scripts/Examples/basic_ping.sh)
* [**advanced_ping.sh**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/Extras/Cmd4Scripts/Examples/advanced_ping.sh)
* [**wakeonlan.sh**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/Extras/Cmd4Scripts/Examples/wakeonlan.sh)
* [**cmd4-E-Zone-MyAir**](https://github.com/mitch7391/cmd4-E-Zone-MyAir/blob/master/Temperature%20Sensors/One%20Constant%20Zone/ezone.sh)

## Homebridge API
&nbsp;&nbsp;&nbsp; Cmd4 is not possible without Homebridge. Prior to Cmd4 Version 3, Cmd4 just created Standard Plugin Accessories. With Version 3 of Cmd4, Cmd4 follows the Hombridge API as defined on [Homebridge API](https://developers.homebridge.io/#/) to be followed exactly. Both Platform and Accessory Plugins can be created. In fact the examples can be recreated exactly.<BR>
<BR>Note: The major difference in CMD4 Version 3 is that the default accessory created is a Platform Plugin as compared to an Accessory Plugin. This is beneficial as many more Platform with the same type can be created and they can be published externally as we shall see.


## Platform Accessories
&nbsp;&nbsp;&nbsp; The best way to explain the difference is to understand how the Homebridge API defines a Television as a Platform Accessory. [Homebridge Television](https://developers.homebridge.io/#/service/Television). Cmd4 Version 3 can recreate the exact same configuration as:<as:

```json
{
   "bridge":
   {
      "name": "MAC Test Homebridge",
      "username": "CC:22:3D:E3:CE:30",
      "port": 51826,
      "pin": "555-55-555"
   },
   "platforms" :
   [
      {
         "platform": "Cmd4",
         "outputConstants":                false,
         "restartRecover":                 true,
         "accessories" :
         [
            {
              "type":                      "Television",
              "category":                  "TELEVISION",
              "publishExternally":         true,
              "name":                      "Example TV",
              "active":                    "ACTIVE",
              "activeIdentifier":           1,
              "configuredName":            "Example TV",
              "sleepDiscoveryMode":        "ALWAYS_DISCOVERABLE",
              "accessories":
              [
                 {   "Type":                   "televisionSpeaker",
                     "DisplayName":            "My_TelevisionSpeaker",
                     "Name":                   "My_TelevisionSpeaker",
                     "Active":                 "ENABLED",
                     "VolumeSelector":         10,
                     "VolumeControlType":      "ABSOLUTE",
                     "State_cmd": "node .homebridge/YourScriptHere.js",
                     "Cmd4_Mode":              "Polled",
                     "Polling": [
                        {"Characteristic": "Active",         "interval": 50,  "timeout": 5000},
                        {"Characteristic": "VolumeSelector", "interval": 50,  "timeout": 5000}
                     ]
                  }
              ],
              "LinkedTypes":
              [
                 {"Type":                   "InputSource",
                  "DisplayName":            "HDMI1",
                  "ConfiguredName":         "HDMI 1",
                  "CurrentVisibilityState": "SHOWN",
                  "InputSourceType":        "HDMI",
                  "IsConfigured":           "CONFIGURED",
                  "Identifier":              1,
                  "TargetVisibilityState":    "SHOWN",
                  "Name":                     "HDMI 1"
                 },
                 {"Type":                    "InputSource",
                  "DisplayName":             "HDMI 2",
                   "ConfiguredName":         "HDMI 2",
                   "CurrentVisibilityState": "SHOWN",
                   "InputSourceType":        "HDMI",
                   "IsConfigured":           "CONFIGURED",
                   "Identifier":              2,
                   "TargetVisibilityState":   "SHOWN",
                   "Name":                    "HDMI 2"
                  },
                  {"Type":                    "InputSource",
                   "DisplayName":             "Netflix",
                   "ConfiguredName":          "Netflix",
                   "CurrentVisibilityState":  "SHOWN",
                   "InputSourceType":         "HDMI",
                   "IsConfigured":            "CONFIGURED",
                   "Identifier":               3,
                   "TargetVisibilityState":    "SHOWN",
                   "Name":                     "Netflix"
                  }
               ],
               "DisplayOrder":              0,
               "CurrentMediaState":         "STOP",
               "TargetMediaState":          "STOP",
               "PictureMode":               "STANDARD",
               "RemoteKey":                 "SELECT",
               "Polling": [
                  {"Characteristic": "Active",            "interval": 50,  "timeout": 5000},
                  {"Characteristic": "ActiveIdentifier",  "interval": 50,  "timeout": 5000},
                  {"Characteristic": "CurrentMediaState", "interval": 540, "timeout": 5000}
               ],
               "StateChangeResponseTime":    3,
               "State_cmd": "node .homebridge/YourScriptHere.js"
             }
          ]
       }
   ]
}
```

### New Cmd4 3.0 Directives
&nbsp;&nbsp;&nbsp;There are a few new important Cmd4 designations in Homebridge 3.0.
<UL>
<LI> The first is "category"<BR>

```json
   "Category": "TELEVISION"
```

This is the hint to homekit of which icon to use and for Televisions, a TV icon will not show without it.
<BR><BR>
<LI>The second new designation is "publishExternally"<BR>

```json
   "PublishExternally": true (Default is false)
```
As per the Homebridge API, this allows the Platform Accessory to be published separately from the bridge and is a requirement for multiple TV's.
<BR><BR>
<LI> The third new designation is "restartRecover"<BR>

```json
   "restartRecover": true (Default)
```
Cmd4 allows Homebridge to use saved state information over restarts. This is not completely falable, so you can disable this as well.
</UL>

See the [Cmd4 Developers Guide](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/Developers.md) for further information.

## Standard Accessories
&nbsp;&nbsp;&nbsp;A Standard Accessory does not need a Platform. The Homebridge example given is. [Homebridge Switch](https://developers.homebridge.io/#/api/accessory-plugins). Cmd4 Version 3 can recreate the exact same configuration as:

```json
{
    "bridge": {
        "name": "MAC Test Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "555-55-555"
    },
    "accessories": [
       {
          "accessory":                "Cmd4",
          "Type":                     "Switch",
          "OutputConstants":          false,
          "DisplayName":              "My_Switch",
          "Name":                     "My_Switch",
          "On":                       "FALSE",
          "Manufacturer":             "Custom Manufacturer",
          "Model":                    "Custom Model",
          "StateChangeResponseTime":   3,
          "State_cmd": "node .homebridge/YourScriptHere.js"
       }
    ]
}
```

This configuration defines a Cmd4 Standard Accessory with the designation:

```json
   "accessory": "Cmd4"
```
<BR>
Notice that there is no Platform definition. Otherwise everything is the same. You can even add linked accessories as before.<BR>


## Cmd4 Directives

&nbsp;&nbsp;&nbsp; Homebridge-Cmd4 has many directives, the most important being the "state_cmd". The provided config.min.json file shows many of the directives in action. A complete list of all Cmd4 directives can be found in the auto generated Cmd4 documentation found at :[https://ztalbot2000.github.io/homebridge-cmd4](https://ztalbot2000.github.io/homebridge-cmd4).

## Cmd4 Devices and Characteristics

&nbsp;&nbsp;&nbsp; Homebridge-Cmd4 supports 62 Devices and over 200 Characteristics which are described in the previously mentioned config.min.json file and on the  auto generated github pages at: [https://ztalbot2000.github.io/homebridge-cmd4](https://ztalbot2000.github.io/homebridge-cmd4).

## Priority Queued Polling

&nbsp;&nbsp;&nbsp; Typically polling is pretty much a free for all.  While Cmd4 tries to eleviate this with staggered polling, Cmd4 supports two kinds of Priority Queued Polling; that being "Sequential" and "WoRm" ( Write Once Read Many).  If configured correctly, only one Set characteristic value can be sent or either one or multiple Gets from a device at a time. The priority given to requests from IOS first and background polling second.<BR>
<BR>
  Priority Queued Polling is only available for Cmd4_Mode(s) of "Polled" or "FullyPolled" by the shear nature of the feature. To configure Priority Queued Polling every characteristic to the device must be configured with characteristic polling and in the same queue. as an Example of the default WoRm is:

```
"Interval": 5,
"Polling": [ { "Characteristic": "CurrentTemperature", "queue": "A" },
             { "Characteristic": "TargetTemperature", "Queue": "A" }
           ]
```
  The interval of the queue would be the first Interval defined of where the queue is first seen, as in the example above.<BR>
  A simpler solution would be topre define the queues and the queue characteristics ahead of time and then just specify which accessory is going to use Priority Queue Polling. Example 2:

```
"QueueTypes: [ { "Queue": "A" : "QueueType": "WoRm", "QueueInterval": 10 }
             ],
"Queue": "A",
"Polling": [ { "Characteristic": "CurrentTemperature" },
             { "Characteristic": "TargetTemperature" }
           ]
```
Example 3:

```
"platforms":
 [ { "platform": "Cmd4",
     "QueueTypes: [ { "Queue": "A" : "QueueType": "WoRm", "QueueInterval": 22 }
                    { "Queue": "B" : "QueueType": "Sequentail", "QueueInterval": 30 }
                    { "Queue": "C" } // Defaults to "WoRm", "QueueInterval": 25
                  ],

     "accessories": [
     {
        "Name": "My_Thermostat",
        "Type": "Thermostatwitch",
        "Queue": "A",
        "Polling": [ { "Characteristic": "CurrentTemperature" },
                     { "Characteristic": "TargetTemperature" },
                     { "Characteristic": "CurrentHeatingCoolingState" }
                   ],
        ...
     },
     {
        "Name": "My_Switch",
        "Type": "Switch",
        "Queue": "B",
        "Polling": [ { "Characteristic": "On" } ],
        ...
     },
     {
        "Name": "My_Door",
        "Type": "Door",
        "Queue": "C",
        "Polling": true,
        ...
     },
     {
        "Name": "Switch2",
        "Type": "Switch",
        "Polling": [ { "Characteristic": "On", "Queue": "D" } ],   // Defaults to "WoRm"
        ...
     }

```
   Note 1. The interval is dynamically changed and will never drop below the defined interval. The rule is simple, the interval is calculated by seven times the actual time of the request +/- 10%.<BR>
<BR>
Priority Queued Polling statistics can be viewed with the following Cmd4 Platform directives.<BR>

```
   "QueueMsg": true,
   "QueueStatMsgInterval": 1000,

    or

   "QueueTypes: [ { "Queue": "A" : "QueueType": "WoRm", "QueueInterval": 10, "QueueMsg": true, "QueueStatMsgInterval": 1000 }
                ],
```
  The "QueueStatMsgInterval" is the counted number of background polls modded by this interval.<BR>
<BR>

## Priority Queue Burst Polling
&nbsp;&nbsp;&nbsp; The whole purpose of Priority Queued Polling is to provide as many options possible where you can successfully talk to your device. WoRm and Sequential are the previous examples.  For WorM there is a further option in that all Polls ( which are all reads, of course ) can be scheduled at once. This option is called Burst Polling. Both the number of characteristics that are sent between each burst and the burst interval can be defined.
```

     "QueueTypes: [ { "Queue": "A" : "QueueType": "WoRm", "BurstGroupSize": 1, "BurstInterval": 15000 }]
```
The number of Burst Groups is calculated as the number of polled characteristics in the queue, divided by the BurstGroupSize.  A burstGroupSize of 1, means that they will all be sent at the same interval defined by the burstInterval, which defaults to 5 seconds.

## Priority Queue Polling Across Multiple accessories ( Same Device )
&nbsp;&nbsp;&nbsp; In the case of a device like the My Air Smart Thermostat which has multiple accessories of Switches, Sensors and a Thermostat; Cmd4 Priority Queued Polling is essential. This device is actually why this feature was created. There was previously no possible configuration of Cmd4 staggered polling that would not result in the device locking up as it was hammered with requests at the same time. An example of configuring Cmd4 for this device is:
```
    "platforms": [
        {
            "platform": "Cmd4",
            "outputConstants": false,
            "restartRecover": true,
            "Cmd4_Mode": "FullyPolled",
            "timeout": 4000,
            "stateChangeResponseTime": 3,
            "QueueTypes:[ { "Queue": "A", "QueueType": "WoRm", "QueueInterval":20 } ],
            "accessories": [
                {
                    "type": "TemperatureSensor",
                    "subType": "tempSensor1",
                    "displayName": "LRoom",
                    "name": "LRoom",
                    "currentTemperature": 25,
                    "statusFault": "NO_FAULT",
                    "Manufacturer": "Advantage Air Australia",
                    "Model": "e-zone",
                    "SerialNumber": "Fujitsu e-zone2",
                    "polling": [
                        { "characteristic": "currentTemperature", "queue": "A"  }
                    ],
                    "Props": {
                        "CurrentTemperature": {
                            "maxValue": 100,
                            "minValue": -100,
                            "minStep": 0.1
                        }
                    },
                    "state_cmd": "bash /home/pi/zones.sh",
                    "state_cmd_suffix": "z01"
                },
                {
                    "type": "Switch",
                    "displayName": "TSwitch",
                    "name": "TSwitch",
                    "on": "FALSE",
                    "Manufacturer": "Advantage Air Australia",
                    "Model": "e-zone",
                    "SerialNumber": "Fujitsu e-zone2",
                    "polling": [
                        { "characteristic": "On", "queue": "A" }
                    ],
                    "state_cmd": "bash /home/pi/zones.sh",
                    "state_cmd_suffix": "z05"
                },
                {
                    "type": "Fan",
                    "on": "FALSE",
                    "displayName": "Fan",
                    "name": "Fan",
                    "Manufacturer": "Advantage Air Australia",
                    "Model": "e-zone",
                    "SerialNumber": "Fujitsu e-zone2",
                    "polling": [
                        { "characteristic": "On", "queue": "A" }
                    ],
                    "stateChangeResponseTime": 1,
                    "state_cmd": "bash /home/pi/ezone.sh"
                },
                {
                    "type": "Thermostat",
                    "displayName": "Aircon",
                    "name": "Aircon",
                    "currentHeatingCoolingState": "OFF",
                    "targetHeatingCoolingState": "OFF",
                    "currentTemperature": 25,
                    "targetTemperature": 25,
                    "temperatureDisplayUnits": "CELSIUS",
                    "Manufacturer": "Advantage Air Australia",
                    "Model": "e-zone",
                    "SerialNumber": "Fujitsu e-zone2",
                    "queue": "A",  // All characteristics would go to queue "A"
                    "polling": [
                        { "characteristic": "currentHeatingCoolingState" },
                        { "characteristic": "targetHeatingCoolingState" },
                        { "characteristic": "currentTemperature" },
                        { "characteristic": "targetTemperature" }
                    ],
                    "state_cmd": "bash /home/pi/ezone.sh"
                }
            ]
        }
    ]
}
```


## Developer Notes
### Step 1.  The provided jsmin differs from others
&nbsp;&nbsp;&nbsp; The resulting file is still readable. Only C and C++ comments are removed. The included config.json is created via:

```bash
   *SHELL*> gcc jsmin.c -o jsmin
   *SHELL*> jsmin < config.min.json > config.json
```

### Step 2.  The parameters to the state_cmd
&nbsp;&nbsp;&nbsp; These are defined as:<BR>

```
   Get < Accessory Name > < Characteristic >
   Set < Accessory Name > < Characteristic > < Value >
```

### Step 3.  Polling is supported
&nbsp;&nbsp;&nbsp; Even if you do not use polling, care was taken that all Set Target states are immediately followed by a Get of the Current state. This is so that after closing a garage door for instance, Homekit gets updated that the door was closed.

### Step 4.  Sending constants to your script.
&nbsp;&nbsp;&nbsp; By placing in your config.json file the tag "outputConstants": true, instead of values, your script will receive constants instead of values (Where Applicable). Homebridge-Cmd4 will except constants or values as input.  See the config.min.json file for the defined constants.

***Important***
&nbsp;&nbsp;&nbsp; Homebridge-cmd4 just outputs the value to be set.  For whatever reason the lower layers of homebridge set on/off to be "true" and "false" instead of 0 & 1, which is incorrect, but changing it would break others scripts.
&nbsp;&nbsp;&nbsp;  Homebridge-cmd4 has always recognized either 0/1 or true/false when receiving the devices value.
When in doubt, check the parameters yourself.
Thanks Florian for pointing out the original documented bash script was incorrect

&nbsp;&nbsp;&nbsp; Your now ready to go and try Fans, Switches, Garage Doors, Locks, Sensors ... ✅

<DIV id="fakegatotag"></DIV>

## Adding in Fakegato history
See [fakegato-history](https://github.com/simont77/fakegato-history)

&nbsp;&nbsp;&nbsp; Not all accessories are supported by Eve or fakegato-history. As more and more are, they can easily be added to Homebridge-Cmd4 if they are not already by following these step.

### Step 1.  Add fakegato config information
&nbsp;&nbsp;&nbsp; Edit your homebridge/config.json file and add to the accessory config portion the following lines:

```json
"fakegato":{"eve":"thermo",
            "currentTemp": "currentTemperature",
            "setTemp": "targetTemperature",
            "valvePosition": "0",
            "storage": "fs",
            "storagePath": ".homebridge/FakegatoStorage",
            "folder": "folderName",
            "keyPath": "/place/to/store/my/keys/"
           }
```

### Step 2.  Fakegato parameters
&nbsp;&nbsp;&nbsp; If you notice, the parameters follow the fakegato-history spec.

The only difference is that the characteristics value will be substituted for the fakegato keys. In this example "currentTemperature" will be substituted with 50.0 if that is what was returned to Cmd4.

The value "0" should be used for any characteristics value which is not possible to retrieve.

### Step 3.  History requires polling
&nbsp;&nbsp;&nbsp; For history to be collected you will have to enable polling and interval for the accessory, and according to the fakegato-history documents it should be less than 10 minutes (600 seconds). The new polling config section allows for each characteristic to be polled at their individual times.

```json
"polling": [{"Characteristic": "CurrentHeatingCoolingState",
             "interval": 540,  "timeout": 4000},
            {"Characteristic": "CurrentTemperature",
             "interval": 60,   "timeout": 4000}
           ],
```

## Unit Testing
&nbsp;&nbsp;&nbsp; Unit testing is done using the Mocha framework for Javascript and was introduced in homebridge-cmd4 version 2.1.2. There are 2796 test cases and they all run successfully.  They test the homebridge-Cmd4 module to make sure that all characteristics, services and names are correct. The provided config.json is also tested for proper definitions of all the homebridge-cmd4 config parameters.

&nbsp;&nbsp;&nbsp; Unit testing is only possible in a development environment and can be achieved in the following manner.

### Step 1.  Install homebridge-cmd4 in a local environment
&nbsp;&nbsp;&nbsp; This is done separate from the global environment and does not impact the global environment.

```bash
   *SHELL*> npm install homebridge-cmd4
```

### Step 2.  Change to the homebridge-cmd4 directory

```bash
   *SHELL*> cd homebridge-cmd4
```

### Step 3.  Install homebridge-cmd4 development dependencies

```bash
   *SHELL*> npm install --save-dev
```

### Step 4.  Run the provided test cases

```bash
   *SHELL*> npm test
```

Note: There is one bug where the testcases do not run correctly every second attempt.  It has something to do with synchronous tests for Get/Set.  Please ignore it at this time.  Just run it again.

## License
See [LICENSE](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/LICENSE)



<!---
Link References (Not Local)
-->

[homebridge]:https://github.com/nfarina/homebridge
[homebridge_api]:https://developers.homebridge.io/#/
[ztalbot2000]:https://github.com/ztalbot2000
