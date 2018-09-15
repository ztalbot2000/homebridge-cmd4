# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types!




**Cmd4** is a plugin for [Homebridge] that lets you see what Homebridge and Homekit are all about, without actually owning a single accessory!  For the more advanced user, Cmd4 brings CLI support for all accessories.



Table of Contents
-----------------


* [**About the Cmd4 Plugin**](#about-the-cmd4-plugin)
* [**How the Cmd4 Plugin Works**](#how-the-cmd4-plugin-works)
* [**Features**](#features)
* [**Screenshots**](#screenshots)
* [**Installation**](#installation)
* [**Migrating from Homebridge-cmdswitch2**](#migration)
* [**Developer**](#developer)
* [**Todo**](#todo)
* [**Contributing**](#contributing)
* [**Inspiration and special thanks**](#inspiration-and-special-thanks)
* [**License**](#license)
* [**FAQ / Troubleshooting**](#faq--troubleshooting)
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

   Cmd4 supports, Lights, Garage Door Openners, Lights, Outlets, Switches, Lock Maintenance Systems, Lock Management Systems, Humidity Sensors, Doors, Light Sensors, Temperature Sensors, Contact Sensors, Motion Sensors, Thermostats, Security Systems, Battery Services, Filter Maintenance Systems, Air Purifiers ... everything but Camera Streaming since it is not pliable to a command line Interface.

   Cmd4 also supports polling, though care was taken to make sure accessories get updated after an adjustable response time so that accessories like a garage door is updated in HomeKit after it was closed or openned.

Cmd4 can be configured to respond to actual devices directly or by modofying the script file it calls.



Installation
------------


### Step 1 `Homebridge`

  Install homebridge using `npm install -g homebridge`.


### Step 2 `Cmd4 Plugin`

  Install this plugin using `npm install -g homebridge-cmd4`.


### Step 3 `Install State.js`

  mkdir .homebridge/Cmd4Scripts<BR>
  cp State.js .homebridge/Cmd4Scripts/State.js<BR>
  chmod 700 .homebridge/Cmd4Scripts/State.js<BR>
  <BR>
  There is a copy of State.js in the Extras folder that comes with the homebridge-cmd4 plugin.


### Step 4 `Install/Update your config.json file.`

  Use the provided config.json file or add it to your own.<BR>
  <BR>
  There is a fully populated copy of both config.min.json and config.json in the Extras folder that comes with the homebridge-cmd4 plugin. You can use it, or copy from it as it is a lot of typing.


### Step 5 `Install/Restart homebridge`

  Start/Restart Homebridge as you normally would.
 
### Step 6 `Try Homekit`

  If you are not already familiar with Homekit, you may wish to look at the documentation for Homebridge and how to configure it with Homekit. The gist of it is that you entet the manual code defined in the config.json file. I chose 5555555 for simplicity.

<br>

### That's it! Enjoy all your new Virtual Accessories!. ✅

<br>

## Usage

If you installed and setup things correctly you should now see icons in the Homekit app for you to play with.

Migrating from Homebridge-cmdswitch2
------------------------------------
  Homebridge-cmdswitch2 is great if you just want to turn something On or Off; Hence the switch reference in its name. In fact, there is no need to migrate if that is all you want to do. As a plugin, Homebridge-cmd4 easily coexists with Homebridge-cmdswitch2 or any other homebridge plugin. However, if you want to do something more finite, like adjusting the brightness or getting the value of a DAC, then Homebridge-Cmd4 is for you.
   If you do wish to move anyway to Cmd4 or wish to see another example of interfacing to a real device, here is a very simple example without any parameter checking on how it would be done for a switch.

### Step 1 `config.json`

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

   Homebridge-cmd4 only uses one command string, that being:

   ...
   "state_cmd": "< path to some executable or script >"
   ...

   In this example, we will use:
   "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"

   Our config.json file for homebridge now looks like:

```
   ...
   {
      "platform": "Cmd4",
      "name": "Cmd4",
      "accessories":
      [
         {
             "type": "Switch",
             "name": "PS4",
             "on": false,
             "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"
             "polling": true,
             "interval": 5,
             "timeout": 2000,
          }
      ]
   }
   ...

```

   Edit a new file called $HOME/.homebridge/Cmd4Scripts/PS4.sh

### Step 3 `Contents of PS4.sh`

The PS4.sh must accept and respond to homebridge-cmd4 as defined by the HAP spec for a switch, this being just the ON characteristic.
The corresponding script would then contain the following:

```
#!/bin/bash

if [ "$1" = "Get" ]; then
   # $2 would be the name 'PS4'
   # $3 would be the charactersistic 'On'
   ps4-waker search | grep -i '200 Ok'
   rc=$?
   if [ "$rc" = "0" ]; then
      echo "$rc"
      exit 0
   else
      echo "1"
      exit 0
   fi
fi

if [ "$1" = "Set" ]; then
   # $2 would be the name 'PS4'
   # $3 would be the the charactersistic 'On'
   # $4 would be '0' for 'On' and '1' for 'Off'

   if [ "$4" = "0" ]; then
      ps4-waker
      exit $?
   fi
   if [ "$4" = "1" ]; then
      ps4-waker standby
      exit $?
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

The response of the script is two-fold.  The first being the returned value as defined by the HAP spec.  The second is the exit status of the script.
In this case the output is the echo of "0" for On and "1" for Off.
The second is the exit status of the script, which happens to be almost the same.

### Step 4 `Testing PS4.sh`

   You can also test how homebridge-cmd4 will respond by running your scripts from the command line.  If you see the expected output, then things should behave as well from within homebridge.

   In this example for setting the device On:
   cd $HOME
   bash .homebridge/Cmd4Scripts/PS4.sh Set PS4 On 0
   
   Setting the device off
   bash .homebridge/Cmd4Scripts/PS4.sh Set PS4 On 1

   Getting the device Status
   bash .homebridge/Cmd4Scripts/PS4.sh Get PS4 On
      will output "0" and have an exit status of 0 if the device is On
      will output "1" and have an exit status of 0 if the device is Off
    
   For On, the commands seem quite redundant, but On is a characteristic. Consider the following for a light where the characteristic is Brightness
      node ./homebridge/Cmd4Scripts/State.js Set My_Dimmable_Light Brightness 40
   This makes more sense.

Developer
---------
1. The provided jsmin differs from others in that the resulting file format is
   still readable. Only C and C++ comments are removed. The includ config.json is created via: <BR>
   &nbsp;&nbsp;&nbsp; jsmin < config.min.json > config.json
   
2. The parameters to the script pointed to by the 'state_cmd' in your
   config.json file (Default being the provided State.js file) are:<BR>
   &nbsp;&nbsp;&nbsp;Get < Accessory Name > < Characteristic > <BR>
   &nbsp;&nbsp;&nbsp;Set < Accessory Name > < Characteristic > < Value > <BR>
       
3. Polling is supported, but even without polling, care was taken so that
   even after closing a garage door for instance, Homekit gets updated that
   the door was closed.
   
4. Using the provided jsmin tool to strip out the comments, your ready to go
   and try Fans, Switches, Garage Doors, Locks, Sensors ....Todo<a name="todo"></a>
   
----


* [ ] Referred devices, i.e. a smoke detectors battery is not yet linked.
* [X] Support multi word device names.



FAQ / Troubleshooting
---------------------

1) Homebridge is expected to run from a users home directory. where it can find the .homebridge directory and indirectly the homebridge/Cmd4Scripts.State.js command file.

2) The State.js command file must be executable. it can be tested via:<BR>
&nbsp;&nbsp;&nbsp; cd $HOME <BR>
&nbsp;&nbsp;&nbsp; node .homebridge/Cmd4Scripts/State.js Get My_Fan On <BR>
&nbsp;&nbsp;&nbsp; this should output: 0<BR>
 
3) Have a look at the State.js file, all the settable characteristics are very well documented there.<BR>
<BR>
4) You can also run: DEBUG=* homebridge -I<BR>

5) Try executing the State.js script
<BR>
 &nbsp;&nbsp;&nbsp;cd $HOME
 &nbsp;&nbsp;&nbsp;node .homebridge/Cmd4Scripts/State.js Get My_Fan On
 <BR>
 This should output '0' or '1'





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


License
-------

See [LICENSE](LICENSE)



<!---
Link References
-->



[about-the-cmd4-plugin]:https://github.com/ztalbot2000/homebridge-cmd4#about-the-cmd4-plugin
[how-the-cmd4-plugin-works]:https://github.com/ztalbot2000/homebridge-cmd4#how-the-cmd4-plugin-works
[features]:https://github.com/ztalbot2000/homebridge-cmd4#features
[screenshots]:https://github.com/ztalbot2000/homebridge-cmd4#screenshots
[installation]:https://github.com/ztalbot2000/homebridge-cmd4#installation
[migration]:https://github.com/ztalbot2000/homebridge-cmd4#migration
[developer]:https://github.com/ztalbot2000/homebridge-cmd4#developer
[todo]:https://github.com/ztalbot2000/homebridge-cmd4#todo
[contributing]:https://github.com/ztalbot2000/homebridge-cmd4#contributing
[inspiration-and-special-thanks]:https://github.com/ztalbot2000/homebridge-cmd4#inspiration-and-special-thanks
[license]:https://github.com/ztalbot2000/homebridge-cmd4#license
[faq--troubleshootingting]:https://github.com/ztalbot2000/homebridge-cmd4#faq--troubleshooting
[rationale]:https://github.com/ztalbot2000/homebridge-cmd4#rationale
[inspiration]:https://github.com/ztalbot2000/homebridge-cmd4#inspiration

[homekit_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png
[eve_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png



