# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
<base _target="_self">

<BR><BR>
## &nbsp;&nbsp;&nbsp; **Cmd4** is a plugin for [Homebridge] that lets you see what Homebridge and Homekit are all about, without actually owning a single accessory!  For the more advanced user, Cmd4 brings CLI support for all device types (Accessories) and characteristics.

## Homebridge UI User. Do not click on any inline links. Homebridge UI does not supprt them. Bug#1098
<BR><BR>
## Table of Contents
* [**About the Cmd4 Plugin**](#about-the-cmd4-plugin)
* [**How the Cmd4 Plugin Works**](#how-the-cmd4-plugin-works)
* [**Features**](#features)
* [**ChangeLog**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/CHANGELOG.md)
* [**Screenshots**](#screenshots)
* [**Installation Details**](#installation-details)
* [**Basic Troubleshooting**](#basic-troubleshooting)
   * [***Error: Command failed***](#error-command-failed)
   * [***Removing Cached Information***](#removing-cached-information)
   * [***Debug Steps***](#debug-steps)
* [**Advanced Troubleshooting For Developers**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/AdvancedTroubleShooting.md)
* [**Developers Guide**](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/Developers.md)
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
&nbsp;&nbsp;&nbsp; Cmd4 comes with a fully populated and documented config.json file that is set to using just the cached entry's in the config file itself. This makes HomeKit behave as if you actually have all these Accessories!
   If you choose to add in your own scripts, the Cmd4 Github pages at [ http://ztalbot2000.github.io/homebridge-cmd4](https://ztalbot2000.github.io/homebridge-cmd4) have example script templates and further development instructions.

<BR><BR>
## Features
&nbsp;&nbsp;&nbsp; Cmd4 supports, Lights, Garage Door Openers, Outlets, Switches, Lock Maintenance Systems, Lock Management Systems, Humidity Sensors, Doors, Light Sensors, Temperature Sensors, Contact Sensors, Motion Sensors, Thermostats, Security Systems, Battery Services, Filter Maintenance Systems, Air Purifiers, Television, Television Speaker, Input Sources, Irrigation Systems,  ... everything but Camera Streaming since it is not pliable to a command line Interface.

&nbsp;&nbsp;&nbsp; Cmd4 also supports three types of polling, modified by the "fetch" directive.
<UL>
<LI> { "fetch": "Always" } - As before, Always fetch characteristic value. ( Default )
<LI> { "fetch": "Cached" } - Never fetch characteristic value. Use cached value. The cached value would have to be updated through polling.
<LI> { "fetch": "Polled" } - Polled characteristics act like before, "Always". Non polled characteristic values are fetched from cache.
</UL>

&nbsp;&nbsp;&nbsp; Cmd4 supports Fakegato History and retaining previous state over restarts.

&nbsp;&nbsp;&nbsp; Cmd4 can be configured to respond to actual devices directly or by modifying the script file it calls.

&nbsp;&nbsp;&nbsp; Cmd4 Version 2.0 supported linked Accessories and the latest 3.0 Version supports both Platform plugin and Accessory plugin configurations as documented on [developers.homebridge.io](https://developers.homebridge.io).


<BR><BR>
## Screenshots
<H3 ALIGN="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png">
</H3>

<H3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png">
</H3>

<BR><BR>
## Installation Details
### Step 1.  Install Homebridge
See [homebridge](https://github.com/homebridge/homebridge) for complete details.<BR>


### Step 2.  Install Cmd4 Plugin

```bash
   *SHELL*> sudo npm install -g --unsafe-perm homebridge-cmd4
```

<BR>

### Step 3.  Install/Update your config.json file
&nbsp;&nbsp;&nbsp; Use the provided config.json file or add it to your own.

```bash
   *SHELL*> cp /usr/lib/node_modules/homebridge-cmd4/Extras/config.json $HOME/.homebridge/
```


### Step 4. Restart homebridge
See [homebridge](https://github.com/homebridge/homebridge) for complete details.<BR>


### Step 5.  Try Homekit
&nbsp;&nbsp;&nbsp; If you are not already familiar with Homekit, you may wish to look at the documentation for Homebridge and how to configure it with Homekit. The gist of it is that you enter the manual code defined in the config.json file. I chose 5555555 for simplicity.

### That's it! Enjoy all your new Virtual Accessories!. ✅

<BR><BR>
## Basic Troubleshooting

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

### Removing Cached Information
&nbsp;&nbsp;&nbsp; Starting with Cmd4 Version 3 the *restartRecover* option, defaulted to true, will mean that sometimes changing the config.json accessory options will have no affect. There are two ways to resolve this.<BR>
Note: As of version 3.0.4, Cmd4 directives like polling, state_cmd, etc will try to be restored from the config.json. 
<UL>
<LI> Restart with { restartRecover: false } set in your config.json.
<LI> Remove Homebridges cached information.

```bash
   ^Shell*> rm -rf $HOME/.homebridge/accessories $HOME/.homebridge/persist
```
</UL>

### Debug Steps
#### Step 1.  Change to your $HOME directory
&nbsp;&nbsp;&nbsp; Homebridge is expected to run from a user's home directory where it can find the .homebridge/config.json.

```bash
   *SHELL*> cd $HOME
```

#### Step 2.  Run homebridge in debug mode

```bash
   *SHELL*> DEBUG=* homebridge -D
```


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
* Submit fixes and/or improvements with [Pull Requests](https://github.com/ztalbot2000/homebridge-cmd4/pulls)



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
* Thanks to Mitch Williams for his endless encouragement.
* Thanks especially to those who continue to work on Homebridge and those who make it better.
* And most importantly my Wife.

<BR><BR>
## License
See [LICENSE](LICENSE)



<!---
Link References (Not Local)
-->

[homebridge]:https://github.com/homebridge/homebridge
[developers.homebridge.io]:https://developers.homebridge.io/#/
[homekit_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Homekit_screenshot.png
[eve_screenshot]:https://github.com/ztalbot2000/homebridge-cmd4/raw/master/screenshots/Eve_screenshot.png
[ztalbot2000]:https://github.com/ztalbot2000
