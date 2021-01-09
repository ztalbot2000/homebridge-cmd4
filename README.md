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
* [**Installation Details**](#installation-details)
* [**Basic Troubleshooting**](#basic-troubleshooting)
   * [***Cannot add a Service with the same UUID***](#error-cannot-add-a-service-with-the-same-uuid)
   * [***Error: Command failed***](#error-command-failed)
   * [***Debug Steps***](#debug-steps)
* [**Advanced Troubleshooting For Developers**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/AdvancedTroubleShooting.md)
* [**Developers Guide**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/DevelopersGuide.md)
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

&nbsp;&nbsp;&nbsp; Cmd4 also supports three types of polling, modified by the "fetch" directive.
<UL>
<li> { "fetch": "Always" } - As before, Always fetch characteristic value. ( Default )
<li> { "fetch": "Cached" } - Never fetch characteristic value. Use cached value. The cached value would have to be updated through polling.
<li> { "fetch": "Polled" } - Polled characteristics act like before, "Always". Non polled characteristic values are fetched from cache.
</UL>

&nbsp;&nbsp;&nbsp; Cmd4 supports Fakegato History and retaining previous state over restarts.

&nbsp;&nbsp;&nbsp; Cmd4 can be configured to respond to actual devices directly or by modifying the script file it calls.

&nbsp;&nbsp;&nbsp; Cmd4 Version 2.0 supported linked Accessories and the latest 3.0 Version supports both Platform plugin and Accessory plugin configurations as documented on [developers.homebridge.io](developers.homebridge.io).


<BR><BR>
## Screenshots
<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png">
</h3>

<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png">
</h3>

<BR><BR>
## Installation Details
### Step 1.  Install Homebridge
See [homebridge](homebridge) for complete details.<BR>


### Step 2.  Install Cmd4 Plugin
&nbsp;&nbsp;&nbsp; *SHELL*> sudo npm install -g --unsafe-perm homebridge-cmd4


### Step 3.  Install State.js

```bash
   *SHELL*> mkdir $HOME/.homebridge
   *SHELL*> mkdir $HOME/.homebridge/Cmd4Scripts
   *SHELL*> cp /usr/lib/node_modules/homebridge-cmd4/Extras/Cmd4Scripts/State.js $HOME/.homebridge/Cmd4Scripts/
   *SHELL*> cp /usr/lib/node_modules/homebridge-cmd4/Extras/Cmd4Scripts/CheckYourScript.sh $HOME/.homebridge/Cmd4Scripts/
   *SHELL*> chmod 700 .homebridge/Cmd4Scripts/State.js
```
<BR>

### Step 4.  Install/Update your config.json file
&nbsp;&nbsp;&nbsp; Use the provided config.json file or add it to your own.

```bash
   *SHELL*> cp /usr/lib/node_modules/homebridge-cmd4/Extras/config.json $HOME/.homebridge/
```


### Step 5. Restart homebridge
See [homebridge](homebridge) for complete details.<BR>


### Step 6.  Try Homekit
&nbsp;&nbsp;&nbsp; If you are not already familiar with Homekit, you may wish to look at the documentation for Homebridge and how to configure it with Homekit. The gist of it is that you enter the manual code defined in the config.json file. I chose 5555555 for simplicity.

### That's it! Enjoy all your new Virtual Accessories!. ✅

<BR><BR>
## Basic Troubleshooting
### Error: Cannot add a Service with the same UUID
&nbsp;&nbsp;&nbsp; All devices of the same type must have a unique UUID. However this error can occur over restarts when Cmd4 tries to use previous stored configurations that are Cmd4 tries to use.  The "restartRecover" directive is new since Cmd4 version 3.



### Error: Command failed
&nbsp;&nbsp;&nbsp; This error is indicative to many situations. The most common is that the command took to long to run.

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

Check that the command exists, but also that the timeout value in your config.json for that accessory is not too low.

## Debug Steps
### Step 1.  Change to your $HOME directory
&nbsp;&nbsp;&nbsp; Homebridge is expected to run from a user's home directory where it can find the .homebridge/config.json file and the Cmd4Scripts.State.js command file.

```bash
   *SHELL*> cd $HOME
```

### Step 2.  Test the State.js command file

```bash
   *SHELL*> node .homebridge/Cmd4Scripts/State.js Get My_Fan On
```
&nbsp;&nbsp;&nbsp; This should output: 0 or 'true'

### Step 3.  Run homebridge in debug mode

```bash
   *SHELL*> DEBUG=* homebridge -D
```

### Step 4.  Try executing the State.js script for a "Get" command.

```bash
   *SHELL*> node .homebridge/Cmd4Scripts/State.js Get My_Fan On
```
&nbsp;&nbsp;&nbsp;&nbsp; This should output '0' or '1' or 'true' or 'false'

### Step 5.  Try executing the State.js script for a "Set" command.

```bash
   *SHELL*> node .homebridge/Cmd4Scripts/State.js Set My_Fan On false
   *SHELL*> node .homebridge/Cmd4Scripts/State.js Set My_Fan On true
```
&nbsp;&nbsp;&nbsp;&nbsp; This should store the fans status.

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
* [ ] Become Homebridge Certified. ( The schema file would be very difficult )

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


<BR><BR>
## Inspiration and special thanks
Based on the best of:
* [homebridge-cmd]https://github.com/senyoltw/homebridge-cmd.git
* [homebridge-cmdswitch2]https://github.com/luisiam/homebridge-cmdswitch2.git
* [homebridge-real-fake-garage-doors]https://github.com/plasticrake/homebridge-real-fake-garage-doors.git
* [homebridge-homeseer]https://github.com/jrhubott/homebridge-homeseer.git
* Thanks to TimofeyK for all his help with fakegato and for suggesting it.
* Thanks especially to those who continue to work on Homebridge and those who make it better.

<BR><BR>
## License
See [LICENSE](LICENSE)



<!---
Link References (Not Local)
-->

[homebridge]:https://github.com/nfarina/homebridge
[developers.homebridge.io]:https://developers.homebridge.io/#/
[homekit_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png
[eve_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png
[ztalbot2000]:https://github.com/ztalbot2000
