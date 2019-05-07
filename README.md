# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!




**Cmd4** is a plugin for [Homebridge] that lets you see what Homebridge and Homekit are all about, without actually owning a single accessory!  For the more advanced user, Cmd4 brings CLI support for all accessories.



Table of Contents
-----------------


* [**About the Cmd4 Plugin**](#about-the-cmd4-plugin)
* [**How the Cmd4 Plugin Works**](#how-the-cmd4-plugin-works)
* [**Features**](#features)
* [**Whats new in 2.1**](#whats-new-in-2-1)
* [**Whats new in 2.0**](#whats-new-in-2-0)
* [**Screenshots**](#screenshots)
* [**Installation**](#installation)
* [**Migrating from Homebridge-cmdswitch2**](#migrating-from-homebridge-cmdswitch2)
* [**Adding in fakegato history**](#adding-in-fakegato-history)
* [**Developer**](#developer)
* [**Todo**](#todo)
* [**Contributing**](#contributing)
* [**Inspiration and special thanks**](#inspiration-and-special-thanks)
* [**License**](#license)
* [**FAQ-Troubleshooting**](#faq-troubleshooting)
* [**Raspbian-Stretch**](#raspbian-stretch)
* [**Rationale**](#rationale)


<BR>


About the Cmd4 Plugin
---------------------
   This plugin allows you see what Homebridge is all about, without having any home control accessories.  If you can run Homebridge and then install this plugin, all the possible accessories are now available to you within HomeKit or Eve. (Except Camera Streaming).

   Similiar to other command plugins, you can use Cmd4 to execute command line interface (CLI) scripts, but with CMD4 the devices don't just appear in HomeKit as a Switch or a Light, but now they can appear as a Garage Door openner, Air Purifier ... and you can cntrol all of their characteristics too.



How the Cmd4 Plugin Works
-------------------------
   Cmd4 comes with a fully populated and documented config.json file that points to a fully populated and configured State.js file that you put in a Cmd4Scripts subdirectory of your .homebridge directory.
   The Cmd4 Plugin reads and understands the config.json file containing every possible HomeKit type. When you point HomeKit to Homebridge, all the devices become populated, and between the homebridge-cmd4 plugin and the State.js command file, HomeKit acts and behaves if you actually have the Accessory you don't actually have.



Features
--------

   Cmd4 supports, Lights, Garage Door Openners, Lights, Outlets, Switches, Lock Maintenance Systems, Lock Management Systems, Humidity Sensors, Doors, Light Sensors, Temperature Sensors, Contact Sensors, Motion Sensors, Thermostats, Security Systems, Battery Services, Filter Maintenance Systems, Air Purifiers, Television, Television Speaker, Input Sources, Irrigation Systems,  ... everything but Camera Streaming since it is not pliable to a command line Interface.

   Cmd4 also supports polling, though care was taken to make sure accessories get updated after an adjustable response time so that accessories like a garage door is updated in HomeKit after it was closed or openned.

Cmd4 can be configured to respond to actual devices directly or by modofying the script file it calls.

Look closely at State.js and config.min.json as in them they have most of all the characteristics defined.

Whats new in 2.1
-----------------
This minor release fixes duplicate service calls for initializing an AccessoryInformation device, Television & TelevisionSpeaker. <BR>
Mostly importantly it wipes out 5600 duplicate lines of code when setting up the characteristic getter & setter methods to a common bound function. <BR>

Whats new in 2.0
-----------------
This release hanges the philosophy of homebridge-Cmd4 from Accessories that have known characteristics as per the HAP Spec to assigning any characteristic to any Accessory.<BR>
There are 160 possible characteristics, 60 more than the previous version.  Also TV, TV Speaker, Input Source, Irrigation, Faucets and many other accessories are now available.

Installation
------------


### Step 1 `Install Homebridge`

   SHELL> sudo npm install -g --unsafe-perm homebridge


### Step 2 `Install Cmd4 Plugin`

  SHELL> sudo npm install -g --unsafe-perm homebridge-cmd4


### Step 3 `Install State.js`

  SHELL> mkdir $HOME/.homebridge<BR>
  SHELL> mkdir $HOME/.homebridge/Cmd4Scripts<BR>
  SHELL> cp /usr/lib/node_modules/homebridge-cmd4/Extras/Cmd4Scripts/State.js $HOME/.homebridge/Cmd4Scripts/<BR>
  SHELL> chmod 700 .homebridge/Cmd4Scripts/State.js<BR>


### Step 4 `Install/Update your config.json file.`

  Use the provided config.json file or add it to your own.<BR>
  <BR>
  There is a fully populated copy of both config.min.json and config.json in the Extras folder that comes with the homebridge-cmd4 plugin. You can use it, or copy from it as it is a lot of typing. <BR>
  SHELL> cp /usr/lib/node_modules/homebridge-cmd4/Extras/config.json $HOME/.homebridge/<BR>


### Step 5 `Install/Restart homebridge`

  Start/Restart Homebridge as you normally would.<BR>
  SHELL> homebrige<BR>
 
### Step 6 `Try Homekit`

  If you are not already familiar with Homekit, you may wish to look at the documentation for Homebridge and how to configure it with Homekit. The gist of it is that you entet the manual code defined in the config.json file. I chose 5555555 for simplicity.

<BR>

### That's it! Enjoy all your new Virtual Accessories!. ✅


Migrating from Homebridge-cmdswitch2
------------------------------------
  Homebridge-cmdswitch2 is great if you just want to turn something On or Off; Hence the switch reference in its name. In fact, there is no need to migrate if that is all you want to do. As a plugin, Homebridge-cmd4 easily coexists with Homebridge-cmdswitch2 or any other homebridge plugin. However, if you want to do something more finite, like adjusting the brightness or getting the value of a DAC, then Homebridge-Cmd4 is for you.
   If you do wish to move anyway to Cmd4 or wish to see another example of interfacing to a real device, here is a very simple example without any parameter checking on how it would be done for a switch.

### Step 1 `homebridge-cmdswitch2 config.json`

   Homebridge-cmdswitch2 defines their *REQUIRED* fields in their config.json as:


```
   ...
   "platforms": [{
   "platform": "cmdSwitch2",
   "name": "CMD Switch",
   "switches": [{
       "name" : "HTPC",
       "on_cmd": "wakeonlan XX:XX:XX:XX:XX:XX",
       "off_cmd": "net rpc shutdown -I XXX.XXX.XXX.XXX -U user%password",
       "state_cmd": "ping -c 2 -W 1 XXX.XXX.XXX.XXX | grep -i '2 received'"
   }, {
       "name" : "Playstation 4",
       "on_cmd": "ps4-waker",
       "off_cmd": "ps4-waker standby",
       "state_cmd": "ps4-waker search | grep -i '200 Ok'",
       "polling": true,
       "interval": 5,
       "timeout": 2000,
      }]
   }]
   ...

```

### Step 2 `homebridge-cmd4 config.json`

   Homebridge-cmd4 only uses one command string as there are many 
   options beyond on/off. This command string is:

   ...
   "state_cmd": "< path to some executable or script >"
   ...

   In this example, we will use:
   "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"

   Note: for the device name, DO NOT USE SPACES as this
         will cause problems parsing the command line.

   The config.json file for homebridge-cmd4 now looks like:

```
   ...
   {
      "platform": "Cmd4",
      "name": "Cmd4",
      "accessories":
      [
         {
             "type": "Switch",
             "name": "PS_4",
             "on": false,
             "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"
             "polling": true,     <OR>
             "polling": [{"on": false, "interval": 5, "timeout":2000}
                        ],
             "interval": 5,
             "timeout": 2000,
          }
      ]
   }
   ...

```

### Step 3 `Contents of PS4.sh`

Edit a new file called $HOME/.homebridge/Cmd4Scripts/PS4.sh

The PS4.sh must accept and respond to homebridge-cmd4 as defined by the HAP spec for a switch, this being just the ON characteristic.
The corresponding script would then contain the following::
 (It is also included in the Extras/Cmd4Scripts directory of your installation)

```
#!/bin/bash

# Notes
# 1) This script is called as defined by the config.json file as:
#    "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"
#    $1 = 'Get'
#    $2 = <Device name>    DO NOT USE SPACES IN DEVICE NAME. It causes problems parsing the command line.
#    $3 = <Characteristic>
#    $4 = <Device option>
#
# 2) For a set of On, the command issued would be:
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS_4 On false
#       or
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS_4 On true
#
# 3) For a Get of On, the command issued would be:
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Get PS_4 On 
#  
#    Homebridge-cmd4 will interpret the result of false to be 1
#    and true to be 0 so either 0/1  or true/false can be returned.


# echo "\$1='$1' \$2='$2' \$3='$3' \$4='$4'"

# This is only here for the first run.
if [ ! -f "/tmp/fileVariableHolder" ]; then
   echo "0" > "/tmp/fileVariableHolder"
fi

if [ "$1" = "Get" ]; then
   # This line is commented out and would be
   # interchangeable with ps4-waker. It is here
   # as an example
   # ps4-waker search | grep -i '200 Ok'
   cat /tmp/fileVariableHolder
   rc=$?
   if [ "$rc" = "0" ]; then
      exit 0
   else
      echo "failed"
      exit -1
   fi
fi

if [ "$1" = "Set" ]; then
   if [ "$3" = "On" ]; then
      if [ "$4" = "true" ]; then
         # This line is commented out and would be
         # interchangeable with ps4-waker. It is here
         # as an example
         # ps4-waker
         echo $4 > /tmp/fileVariableHolder
         exit $?
      else
         # This line is commented out and would be
         # interchangeable with ps4-waker. It is here
         # as an example
         # ps4-waker standby
         echo $4 > /tmp/fileVariableHolder
         exit $?
      fi
   fi
fi


exit -1
```


### Understanding Step 3 `Contents of PS4.sh`

   The script, defined by the state_cmd in the config.json file, receives options that you must parse. Most are based on the HAP spec and are outlined in the State.js file.
The options are:
$1 - Either 'Get'  or 'Set'
$2 - The name of the device as defined in your config.json file.  Note: DO NOT USE SPACES IN THE NAME.  Scripting is much more difficult.
$3 - The HAP specification characteristic parameter. In this case 'On'
$4 - In the case of 'Set' the value to be set.

   ***Important***
   Homebridge-cmd4 just outputs the value to be set.  For whatever reason the lower layers of homebridge set on/off to be "true" and "false" instead of 0 & 1, which is incorrect, but changing it would break others scripts.  Homebridge-cmd4 has always recognized either 0/1 or true/false when receiving the devices value.
When in doubt, check the parameters yourself.
   Thanks Florian for pointing out the original documented bash script was incorrect



The response of the script is two-fold.  The first being the returned value as defined by the HAP spec.  The second is the exit status of the script.
In this case the output is the echo of "0" for On and "1" for Off.
The second is the exit status of the script, which happens to be almost the same.

### Step 4 `Testing PS4.sh`

   You can also test how homebridge-cmd4 will respond by running your scripts from the command line.  If you see the expected output, then things should behave as well from within homebridge.

   In this example for setting the device On:<BR>
   SHELL> bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS4 On true<BR>
   <BR>
   Setting the device off<BR>
   SHELL> bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS4 On false<BR>
   <BR>
   Getting the device Status<BR>
   SHELL> bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Get PS4 On <BR>
      will output "0" and have an exit status of 0 if the device is On <BR>
      will output "1" and have an exit status of 0 if the device is Off <BR>
    
   For On, the commands seem quite redundant, but On is a characteristic. Consider the following for a light where the characteristic is Brightness <BR>
      SHELL> node $HOME/./homebridge/Cmd4Scripts/State.js Set My_Dimmable_Light Brightness 40 <BR>
   This makes more sense. <BR>

Adding in fakegato-history
--------------------------
See [fakegato-history](https://github.com/simont77/fakegato-history)<BR>
<BR>
Not all accessories are supported by Eve or fakegato-history. As more and more are, they can easily be added to Homebridge-Cmd4 if they are not already by following these step.<BR>

### Step 1
Add to the accessory config portion the following lines:<BR>
```
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

### Step 2
If you notice, the parameters follow the fakegato-history spec.<BR>
The only difference is that the characteristics value will be substituted for the fakegato keys. In this example "currentTemperature" will be substituted with 50.0 if that is what was returned to Cmd4. <BR>
The value "0" should be used for any characteristics value which is not possible to retrieve.
<BR>
### Step 3
For history to be collected you will have to enable polling and interval for the accesory, and according to the fakegato-hitory documents it should be less than 10 minutes (600 seconds). The new polling config section allows for each characteristic to be polled at their individual times.<BR>
```
"polling": [{"currentHeatingCoolingState": 0,
             "interval": 540,  "timeout": 2000},
            {"currentTemperature": 50.0,
             "interval": 60,   "timeout": 2000}
           ],
```

Developer
---------
### Step 1  The provided jsmin differs from others in that the resulting file format is
   still readable. Only C and C++ comments are removed. The included config.json is created via: <BR>
   &nbsp;&nbsp;&nbsp; SHELL> jsmin < config.min.json > config.json
   
### Step 2  The parameters to the script pointed to by the 'state_cmd' in your
   config.json file (Default being the provided State.js file) are:<BR>
   &nbsp;&nbsp;&nbsp;Get < Accessory Name > < Characteristic > <BR>
   &nbsp;&nbsp;&nbsp;Set < Accessory Name > < Characteristic > < Value > <BR>
       
### Step 3  Polling is supported, but even without polling, care was taken so that
   even after closing a garage door for instance, Homekit gets updated that
   the door was closed.
   
### Step 4  Using the provided jsmin tool to strip out the comments, your ready to go
   and try Fans, Switches, Garage Doors, Locks, Sensors ....Todo<a name="todo"></a>
   
----


* [ ] Referred devices, i.e. a smoke detectors battery is not yet linked.
* [ ] Support for custom characteristics for an accessory.
* [X] Support multi word device names.



FAQ-Troubleshooting
-------------------

### Step 1  Homebridge is expected to run from a users home directory. where it can find the .homebridge directory and indirectly the homebridge/Cmd4Scripts.State.js command file.

### Step 2  The State.js command file must be executable. it can be tested via:<BR>
&nbsp;&nbsp;&nbsp; SHELL> cd $HOME <BR>
&nbsp;&nbsp;&nbsp; SHELL> node .homebridge/Cmd4Scripts/State.js Get My_Fan On <BR>
&nbsp;&nbsp;&nbsp; this should output: 0 or 'true'<BR>
 
### Step 3 Have a look at the State.js file, all the settable characteristics are very well documented there.<BR>
<BR>
### Step 4 You can also run:<BR>
    SHELL> DEBUG=* homebridge -D $HOME/ <BR>

### Step 5  Try executing the State.js script
<BR>
 &nbsp;&nbsp;&nbsp;SHELL> cd $HOME
 &nbsp;&nbsp;&nbsp;SHELL> node .homebridge/Cmd4Scripts/State.js Get My_Fan On
 <BR>
 This should output '0' or '1' or 'true' or 'false'
 <BR>
 &nbsp;&nbsp;&nbsp;SHELL> node .homebridge/Cmd4Scripts/State.js Set My_Fan On false
 <BR>
 &nbsp;&nbsp;&nbsp;SHELL> node .homebridge/Cmd4Scripts/State.js Set My_Fan On true


Raspbian-Stretch
----------------
Please consult the Raspbian documentation first. Here are my notes though:<BR>

Raspbian Stretch (2018-11-13-raspbian-stretch-full.img)
has old version (v8.11.1) and no npm by default

### Step 1  Update system packages
SHELL> sudo apt-get update

### Step 2  Update installed  packages
SHELL> sudo apt-get dist-upgrade

apt-get node.js npm would install npm version 1.4.21 and result in the error:
Os.tmpDir() is depricated.

### Step 3  Add the two following lines to the top of the source list, commentiing out the others and save the file
SHELL> sudo vim /etc/apt/sources.list

deb https://deb.nodesource.com/node_9.x stretch main
deb-src https://deb.nodesource.com/node_9.x stretch main

### Step 4  Update sources or you wil not be able to download npm
SHELL> sudo apt-get update

### Step 5  Check what will be installed. (It ahould return >=8.11.1
SHELL> apt-cache policy nodejs

### Step 6  Remove old packages
SHELL> sudo apt-get remove nodejs npm

### Step 7  Install nodejs (v9 installs npm too)
SHELL> sudo apt-get install nodejs

### Step 8  Check versions of node and npm
SHELL> node -v   (Should return >=v9.11.2
SHELL> npm -v    (Should return >=5.6.0

### Step 9  Install homebridge
SHELL> sudo npm install -g --unsafe-perm homebridge
SHELL> sudo npm install -g --unsafe-perm homebridge-cmd4



## Screenshots


<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png">
</h3>

<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png">
</h3>

Contributing
------------

Best ways to contribute
* Star it on GitHub - if you use it and like it please at least star it :)
* [Promote](#promotion)
* Open [issues/tickets](https://github.com/ztalbot2000/homebridge-cmd4/issues)
* Submit fixes and/or improvements with [Pull Requests](#source-code)

### Promotion

Like the project? Please support to ensure continued development going forward:
* Star this repo on [GitHub][homebridge-cmd4-repo]
* Follow the repo on [GitHub][homebridge-cmd4-repo]
* Follow me
  * [GitHub](https://github.com/ztalbot2000)

### Source code

Contributions and Pull Requests are welcome.



Rationale
---------

After playing with homebridge-cmd and then homebridge-cmdswitch2, I really wanted to control as much as I could.  I did not have all the devices, but I did have a light and a Sony Android TV.  I wanted to control these and see what else I could do. 
If you were wondering what happenned to version 3, well I learned a lot, hence the working cmd4.



Inspiration and special thanks
------------------------------
Based on the best of:<br>
* [homebridge-cmd]https://github.com/senyoltw/homebridge-cmd.git<BR>
* [homebridge-cmdswitch2]https://github.com/luisiam/homebridge-cmdswitch2.git<BR>
* [homebridge-real-fake-garage-doors]https://github.com/plasticrake/homebridge-real-fake-garage-doors.git<BR>
* [homebridge-homeseer]https://github.com/jrhubott/homebridge-homeseer.git<BR>
<BR>
* Thanks to TimofeyK for all his help with fakegato and for suggesting it.<BR>


License
-------

See [LICENSE](LICENSE)



<!---
Link References
-->



[about-the-cmd4-plugin]:https://github.com/ztalbot2000/homebridge-cmd4#about-the-cmd4-plugin
[how-the-cmd4-plugin-works]:https://github.com/ztalbot2000/homebridge-cmd4#how-the-cmd4-plugin-works
[features]:https://github.com/ztalbot2000/homebridge-cmd4#features
[whats new in 2.1]:https://github.com/ztalbot2000/homebridge-cmd4#whats-new-in-2-1
[whats new in 2.0]:https://github.com/ztalbot2000/homebridge-cmd4#whats-new-in-2-0
[screenshots]:https://github.com/ztalbot2000/homebridge-cmd4#screenshots
[installation]:https://github.com/ztalbot2000/homebridge-cmd4#installation
[migrating-from-homebridge-cmdswitch2]:https://github.com/ztalbot2000/homebridge-cmd4#migrating-from-homebridge-cmdswitch2
[adding in fakegato-history]:https://github.com/ztalbot2000/homebridge-cmd4#adding-in-fakegato-history
[developer]:https://github.com/ztalbot2000/homebridge-cmd4#developer
[todo]:https://github.com/ztalbot2000/homebridge-cmd4#todo
[contributing]:https://github.com/ztalbot2000/homebridge-cmd4#contributing
[inspiration-and-special-thanks]:https://github.com/ztalbot2000/homebridge-cmd4#inspiration-and-special-thanks
[license]:https://github.com/ztalbot2000/homebridge-cmd4#license
[faq-troubleshooting]:https://github.com/ztalbot2000/homebridge-cmd4#faq-troubleshooting
[raspbian-stretch]:https://github.com/ztalbot2000/homebridge-cmd4#raspbian-stretch
[rationale]:https://github.com/ztalbot2000/homebridge-cmd4#rationale
[inspiration]:https://github.com/ztalbot2000/homebridge-cmd4#inspiration

[homekit_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png
[eve_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png



