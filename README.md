# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!

<BR><BR>
## &nbsp;&nbsp;&nbsp; **Cmd4** is a plugin for [Homebridge] that lets you see what Homebridge and Homekit are all about, without actually owning a single accessory!  For the more advanced user, Cmd4 brings CLI support for all device types (Accessories) and characteristics.

<BR><BR>
## Table of Contents
* [**About the Cmd4 Plugin**](#about-the-cmd4-plugin)
* [**How the Cmd4 Plugin Works**](#how-the-cmd4-plugin-works)
* [**Features**](#features)
* [**ChangeLog**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/ChangeLog.md)
* [**Screenshots**](#screenshots)
* [**Installation**](#installation)
* [**Migrating from Homebridge-cmdswitch2**](#migrating-from-homebridge-cmdswitch2)
* [**Other Example Shell Scripts**](#other-example-shell-scripts)
* [**Troubleshooting**](#troubleshooting)
* [**Developer Notes**](#developer-notes)
* [**Troubleshooting your own scripts**](#troubleshooting-your-own-scripts)
* [**Adding in fakegato history**](#adding-in-fakegato-history)
* [**Raspbian-Stretch**](#raspbian-stretch)
* [**Unit Testing**](#unit-testing)
* [**Rationale**](#rationale)
* [**Todo**](#todo)
* [**Contributing**](#contributing)
* [**Inspiration and special thanks**](#inspiration-and-special-thanks)
* [**License**](#license)

<BR><BR>
## About the Cmd4 Plugin
&nbsp;&nbsp;&nbsp; This plugin allows you to see what Homebridge is all about, without having any home control accessories.  If you can run Homebridge and install this plugin, all the possible accessories are now available to you within HomeKit or Eve. (Except Camera Streaming).

&nbsp;&nbsp;&nbsp; Similar to other command plugins, you can use Cmd4 to execute command line interface (CLI) scripts, but with Cmd4 the devices don't just appear in HomeKit as a Switch or a Light, but now they can appear as a Garage Door opener, Air Purifier ... and you can control all of their characteristics too.

<BR><BR>
## How the Cmd4 Plugin Works
&nbsp;&nbsp;&nbsp; Cmd4 comes with a fully populated and documented config.json file that points to a fully populated and configured State.js file that you put in a Cmd4Scripts subdirectory of your .homebridge directory.
   The Cmd4 Plugin reads and understands the config.json file containing every possible HomeKit type. When you point HomeKit to Homebridge, all the devices become populated, and between the homebridge-cmd4 plugin and the State.js command file, HomeKit acts and behaves if you actually have the Accessory!

<BR><BR>
## Features
&nbsp;&nbsp;&nbsp; Cmd4 supports, Lights, Garage Door Openers, Outlets, Switches, Lock Maintenance Systems, Lock Management Systems, Humidity Sensors, Doors, Light Sensors, Temperature Sensors, Contact Sensors, Motion Sensors, Thermostats, Security Systems, Battery Services, Filter Maintenance Systems, Air Purifiers, Television, Television Speaker, Input Sources, Irrigation Systems,  ... everything but Camera Streaming since it is not pliable to a command line Interface.

&nbsp;&nbsp;&nbsp; Cmd4 also supports polling, though care was taken to make sure accessories get updated after an adjustable response time so that accessories like a garage door is updated in HomeKit after it was closed or opened.

&nbsp;&nbsp;&nbsp; Cmd4 can be configured to respond to actual devices directly or by modifying the script file it calls.

&nbsp;&nbsp;&nbsp; Look closely at State.js and config.min.json as in them they have all the characteristics and any of their constant values defined. 

&nbsp;&nbsp;&nbsp; Cmd4 supports linked accessories.  Multiple Input Sources for a TV is the example given.


<BR><BR>
## Screenshots
<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png">
</h3>

<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png">
</h3>

<BR><BR>
## Installation
### Step 1.  Install Homebridge
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo npm install -g --unsafe-perm homebridge`


### Step 2.  Install Cmd4 Plugin
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo npm install -g --unsafe-perm homebridge-cmd4`


### Step 3.  Install State.js
&nbsp;&nbsp;&nbsp; *SHELL*> `mkdir $HOME/.homebridge`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `mkdir $HOME/.homebridge/Cmd4Scripts`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `cp /usr/lib/node_modules/homebridge-cmd4/Extras/Cmd4Scripts/State.js $HOME/.homebridge/Cmd4Scripts/`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `cp /usr/lib/node_modules/homebridge-cmd4/Extras/Cmd4Scripts/CheckYourScript.sh $HOME/.homebridge/Cmd4Scripts/`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `chmod 700 .homebridge/Cmd4Scripts/State.js`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `chmod 700 .homebridge/Cmd4Scripts/CheckYourScript.sh`<BR>
<BR>
Note: CheckYourScript.sh is for your own script development testing



### Step 4.  Install/Update your config.json file
&nbsp;&nbsp;&nbsp; Use the provided config.json file or add it to your own.

&nbsp;&nbsp;&nbsp; There is a fully populated copy of both the config.min.json and the config.json in the Extras folder that comes with the homebridge-cmd4 plugin. You can use it, or copy from it, as it is a lot of typing.


&nbsp;&nbsp;&nbsp; *SHELL*> `cp /usr/lib/node_modules/homebridge-cmd4/Extras/config.json $HOME/.homebridge/`



### Step 5.  Install/Restart homebridge
&nbsp;&nbsp;&nbsp; Start/Restart Homebridge as you normally would.<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `homebridge`<BR>
 
### Step 6.  Try Homekit
&nbsp;&nbsp;&nbsp; If you are not already familiar with Homekit, you may wish to look at the documentation for Homebridge and how to configure it with Homekit. The gist of it is that you enter the manual code defined in the config.json file. I chose 5555555 for simplicity.

### That's it! Enjoy all your new Virtual Accessories!. ✅

<BR><BR>
## Migrating from Homebridge-cmdswitch2
&nbsp;&nbsp;&nbsp; Homebridge-cmdswitch2 is great if you just want to turn something On or Off; Hence the switch reference in its name. In fact, there is no need to migrate if that is all you want to do.

As a plugin, Homebridge-cmd4 easily coexists with Homebridge-cmdswitch2 or any other homebridge plugin. However, if you want to do something more finite, like adjusting the brightness or getting the value of a DAC, then Homebridge-Cmd4 is for you.

&nbsp;&nbsp;&nbsp; If you do wish to move anyway to Cmd4 or wish to see another example of interfacing to a real device, here is a very simple example without any parameter checking on how it would be done for a switch.

### Step 1.  homebridge-cmdswitch2 config.json
&nbsp;&nbsp;&nbsp; Homebridge-cmdswitch2 defines their *REQUIRED* fields in their config.json as:

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

### Step 2.  homebridge-cmd4 config.json
&nbsp;&nbsp;&nbsp; Homebridge-cmd4 only uses one command string as there are many options beyond on/off. This command string is:
   **`"state_cmd": "< path to some executable or script >"`**

&nbsp;&nbsp;&nbsp; In this example, we will use:
   **`"state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"`**

   Note: for the device name, DO NOT USE SPACES as this
         will cause problems parsing the command line.

&nbsp;&nbsp;&nbsp; The config.json file for homebridge-cmd4 now looks like:

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
             "polling": [{"on": false, "interval": 5, "timeout": 4000}
                        ],
             "interval": 5,
             "timeout": 4000,
          }
      ]
   }
   ...

```

### Step 3.  Contents of PS4.sh
&nbsp;&nbsp;&nbsp; An equivalent script is:
* [**PS4.sh**](https://github.com/ztalbot2000/homebridge-cmd4/raw/master/Extras/Cmd4Scripts/Examples/PS4.sh)

<BR><BR>
## Other Example Shell Scriots
* [**basic_ping.sh**](https://github.com/ztalbot2000/homebridge-cmd4/raw/master/Extras/Cmd4Scripts/Examples/basic_ping.sh)
* [**advanced_ping.sh**](https://github.com/ztalbot2000/homebridge-cmd4/raw/master/Extras/Cmd4Scripts/Examples/advanced_ping.sh)
* [**wakeonlan.sh**](https://github.com/ztalbot2000/homebridge-cmd4/raw/master/Extras/Cmd4Scripts/Examples/wakeonlan.sh)

<BR><BR>
## Troubleshooting
### Step 1.  Change to your $HOME directory
&nbsp;&nbsp;&nbsp; Homebridge is expected to run from a user's home directory where it can find the .homebridge/config.json file and the Cmd4Scripts.State.js command file.
&nbsp;&nbsp;&nbsp; *SHELL*> `cd $HOME`

### Step 2.  Test the State.js command file
&nbsp;&nbsp;&nbsp; *SHELL*> `node .homebridge/Cmd4Scripts/State.js Get My_Fan On`
&nbsp;&nbsp;&nbsp; this should output: 0 or 'true'
 
### Step 3.  Run homebridge in debug mode
&nbsp;&nbsp;&nbsp; *SHELL*> `DEBUG=* homebridge -D $HOME/`

### Step 4.  Try executing the State.js script
&nbsp;&nbsp;&nbsp; *SHELL*> `node .homebridge/Cmd4Scripts/State.js Get My_Fan On`
&nbsp;&nbsp;&nbsp;&nbsp; This should output '0' or '1' or 'true' or 'false'
&nbsp;&nbsp;&nbsp; *SHELL*> `node .homebridge/Cmd4Scripts/State.js Set My_Fan On false`
&nbsp;&nbsp;&nbsp; *SHELL*> `node .homebridge/Cmd4Scripts/State.js Set My_Fan On true`
&nbsp;&nbsp;&nbsp;&nbsp; This should store the fans status.

### Step 5.  If you see the error message:
```
  Error: Command failed: /homebridge/Server.sh Get 'Server' 'On'

    at ChildProcess.exithandler (child_process.js:297:12)
    at ChildProcess.emit (events.js:193:13)
    at maybeClose (internal/child_process.js:1001:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:266:5)
  killed: true
  code: null
  signal: SIGTERM,
  cmd: "/homebridge/Server.sh Get Server On"

```

The command may not exist, but also the timeout value in your config.json for that accessory may be too low.

<BR><BR>
## Developer Notes
### Step 1.  The provided jsmin differs from others
&nbsp;&nbsp;&nbsp; The resulting file is still readable. Only C and C++ comments are removed. The included config.json is created via:<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `gcc jsmin.c -o jsmin`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `jsmin < config.min.json > config.json`
 
### Step 2.  The parameters to the state_cmd
&nbsp;&nbsp;&nbsp;  These are defined as:<BR>
&nbsp;&nbsp;&nbsp; Get < Accessory Name > < Characteristic ><BR>
&nbsp;&nbsp;&nbsp; Set < Accessory Name > < Characteristic > < Value >
 
### Step 3.  Polling is supported
&nbsp;&nbsp;&nbsp; Even if you do not use polling, care was taken that all Set Target states are immediately followed by a Get of the Current state. This is so that after closing a garage door for instance, Homekit gets updated that the door was closed.
 
### Step 4.  Sending constants to your script.
&nbsp;&nbsp;&nbsp; By placing in your config.json file the tag "outputConstants": true, instead of values, your script will receive constants instead of values (Where Applicable). Homebridge-Cmd4 will except constants or values as input.  See the config.min.json file for the defined constants.
 
***Important***
&nbsp;&nbsp;&nbsp; Homebridge-cmd4 just outputs the value to be set.  For whatever reason the lower layers of homebridge set on/off to be "true" and "false" instead of 0 & 1, which is incorrect, but changing it would break others scripts.
&nbsp;&nbsp;&nbsp;  Homebridge-cmd4 has always recognized either 0/1 or true/false when receiving the devices value.
When in doubt, check the parameters yourself.
Thanks Florian for pointing out the original documented bash script was incorrect

&nbsp;&nbsp;&nbsp; Your now ready to go and try Fans, Switches, Garage Doors, Locks, Sensors ....

<BR><BR>
## Troubleshooting your own scripts
&nbsp;&nbsp;&nbsp; It is EXTREMELY important that you understand that scripts run by homebridge-Cmd4 or any background process do not interpret any environment settings you may have in your .profile or .bashrc.  This includes any variables that starts with a $ sign (including $HOME) or the tilda character.  It is wisest to test your scripts from a blank configuration and starting from your home directory.

### Step 1.  Change to your home directory
&nbsp;&nbsp;&nbsp; *SHELL*> `cd`

### Step 2.  Run a basic shell
&nbsp;&nbsp;&nbsp; Scripts run by background processes do not read your profile so you need to omit any special variables.
&nbsp;&nbsp;&nbsp; *SHELL*> `bash --noprofile --norc`

### Step 3.  Try the default State.js script
&nbsp;&nbsp;&nbsp; *SHELL*> `node .homebridge/Cmd4Scripts/State.js Get My_Fan On`

### Step 4.  Try your state command
&nbsp;&nbsp;&nbsp; *SHELL*> `.homebridge/Cmd4Scripts/PS4.sh Get My_Fan On`

### Step 5.  Try the cmd4 CheckYourScript.sh
&nbsp;&nbsp;&nbsp; *SHELL*> `cd`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `bash --noprofile --norc`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `'.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bin/MyExec' 'Get' 'MyDevice' 'On'`<BR>
<BR>
&nbsp;&nbsp;&nbsp; or something else like<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `'.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bash' 'bin/YourScript.sh' 'Get' 'MyDevice' 'On'`<BR>
<BR>
&nbsp;&nbsp;&nbsp; or something else like<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `'.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bin/YourScript.sh' 'Get' 'MyDevice' 'On'`<BR>
<BR>

*Note 1.* The arguments to CheckYourScript.sh are exactly what your state_cmd has define plus the options passed to your script<BR>
*Note 2.* Don't forget to put the '' around the command to prevent globing as written above.<BR>
*Note 3.* If your state_cmd has a '$' in it. the CheckYourScript.sh will fail and so rightly would homebridge-cmd4<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `'.homebridge/Cmd4Scripts/CheckYourScript.sh' '$HOME/bin/YourScript.sh' 'Get' 'MyDevice' 'On'`

<BR><BR>
## Adding in fakegato-history
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
"polling": [{"currentHeatingCoolingState": 0,
             "interval": 540,  "timeout": 4000},
            {"currentTemperature": 50.0,
             "interval": 60,   "timeout": 4000}
           ],
```
<BR><BR>
## Raspbian-Stretch
&nbsp;&nbsp;&nbsp; Please consult the Raspbian documentation first. Here are my notes though:

Raspbian Stretch (2018-11-13-raspbian-stretch-full.img)
has old version (v8.11.1) and no npm by default

### Step 1.  Update system packages
*SHELL*> sudo apt-get update

### Step 2.  Update installed packages
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo apt-get dist-upgrade`

apt-get node.js npm would install npm version 1.4.21 and result in the error:
Os.tmpDir() is deprecated.

### Step 3.  Edit the sources list
&nbsp;&nbsp;&nbsp; Add the two following lines to the top of the source list, commenting out the others and save the file

&nbsp;&nbsp;&nbsp; *SHELL*> `sudo vim /etc/apt/sources.list`

```
deb https://deb.nodesource.com/node_9.x stretch main
deb-src https://deb.nodesource.com/node_9.x stretch main
```

### Step 4.  Update sources or you wil not be able to download npm
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo apt-get update`

### Step 5.  Check what will be installed. (It should return >=8.11.1
&nbsp;&nbsp;&nbsp; *SHELL*> `apt-cache policy nodejs`

### Step 6.  Remove old packages
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo apt-get remove nodejs npm`

### Step 7.  Install nodejs (v9 installs npm too)
&nbsp;&nbsp;&nbsp; *SHELL*>  `sudo apt-get install nodejs`

### Step 8.  Check versions of node and npm
&nbsp;&nbsp;&nbsp; *SHELL*> `node -v`   (Should return >=v9.11.2<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `npm -v`    (Should return >=5.6.0<BR>

### Step 9.  Install homebridge
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo npm install -g --unsafe-perm homebridge`<BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `sudo npm install -g --unsafe-perm homebridge-cmd4`<BR>
<BR><BR>
## Unit Testing
&nbsp;&nbsp;&nbsp; Unit testing is done using the Mocha framework for Javascript and was introduced in homebridge-cmd4 version 2.1.2. There are 2796 test cases and they all run successfully.  They test the homebridge-cmd4 module to make sure that all characteristics, services and names are correct. They also test the provided State.js and PS4.sh for their respective Get/Set characteristics.  The provided config.json is also tested for proper definitions of all the homebridge-cmd4 config parameters.

&nbsp;&nbsp;&nbsp; Unit testing is only possible in a development environment and can be achieved in the following manner.

### Step 1.  Install homebridge-cmd4 in a local environment
&nbsp;&nbsp;&nbsp; This is done separate from the global environment and does not impact the global environment.<BR><BR>
&nbsp;&nbsp;&nbsp; *SHELL*> `npm install homebridge-cmd4`

### Step 2.  Change to the homebridge-cmd4 directory
&nbsp;&nbsp;&nbsp; *SHELL*> `cd homebridge-cmd4`

### Step 3.  Install homebridge-cmd4 development dependencies
&nbsp;&nbsp;&nbsp; *SHELL*> `npm install --save-dev`

### Step 4.  Run the provided test cases
&nbsp;&nbsp;&nbsp; *SHELL*> `npm test`

Note: There is one bug where the testcases do not run correctly every second attempt.  It has something to do with synchronous tests for Get/Set.  Please ignore it at this time.  Just run it again.

<BR><BR>
## Rationale
&nbsp;&nbsp;&nbsp; After playing with homebridge-cmd and then homebridge-cmdswitch2, I really wanted to control as much as I could.  I did not have all the devices, but I did have a light and a Sony Android TV.  I wanted to control these and see what else I could do.<BR>
&nbsp;&nbsp;&nbsp; If you were wondering what happened to version 3, well I learned a lot, hence the working cmd4.

<BR><BR>
## Todo
* [X] Linked characteristics, i.e. a smoke detectors battery is not yet linked.
* [ ] Support for custom characteristics for an accessory. *Not possible as it would not be displayed by any GUI*
* [X] Support multi word device names. (Technically done, but scripting is hard for newbies).
* [ ] Scripting language to avoid creating new Homebridge modules.
* [ ] HTTP commands. *Might be just to many options*

<BR><BR>
## Contributing
&nbsp;&nbsp;&nbsp; Best ways to contribute
* Star it on GitHub - if you use it and like it please at least star it :)
* [Promote](#promotion)
* Open [issues/tickets](https://github.com/ztalbot2000/homebridge-cmd4/issues)
* Submit fixes and/or improvements with [Pull Requests](#source-code)



### Promotion
&nbsp;&nbsp;&nbsp; Like the project? Please support to ensure continued development going forward:
* Star this repo on [GitHub][homebridge-cmd4-repo]
* Follow the repo on [GitHub][homebridge-cmd4-repo]
* Follow me
  * [ztalbot2000](https://github.com/ztalbot2000)

### Source code
&nbsp;&nbsp;&nbsp; Contributions and Pull Requests are welcome.

<BR><BR>
## Inspiration and special thanks
Based on the best of:
* [homebridge-cmd]https://github.com/senyoltw/homebridge-cmd.git
* [homebridge-cmdswitch2]https://github.com/luisiam/homebridge-cmdswitch2.git
* [homebridge-real-fake-garage-doors]https://github.com/plasticrake/homebridge-real-fake-garage-doors.git
* [homebridge-homeseer]https://github.com/jrhubott/homebridge-homeseer.git
* Thanks to TimofeyK for all his help with fakegato and for suggesting it.

<BR><BR>
## License
See [LICENSE](LICENSE)



<!---
Link References (Not Local)
-->

[homebridge]:https://github.com/nfarina/homebridge
[homekit_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png
[eve_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png
[ztalbot2000]:https://github.com/ztalbot2000

