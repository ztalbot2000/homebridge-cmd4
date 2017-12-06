# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types!


[![GitHub version][img-version-badge]][badge-version]
[![CodeClimate][img-code-climate-badge]][code-climate]
[![Issue Count][img-code-climate-issues-badge]][code-climate-issues]
[![Code of Conduct][img-coc-badge]][coc]
[![PRs Welcome][img-prs-badge]][prs]

**Cmd4** is a plugin for [Homebridge] that lets you see what Homebridge and Homekit are all about, without actually owning a single accessory!  For the more advanced user, Cmd4 brings CLI support for all accessories.



Table of Contents
-----------------


* [**About the Cmd4 Plugin**](#about)
* [**How the Cmd4 Plugin Works**](#how)
* [**Features**](#features)
* [**Screenshots**](#screenshots)
* [**Installation**](#Installation)
* [**Developer**](#developer)
* [**Todo**](#todo)
* [**Contributing**](#contributing)
* [**Inspiration and special thanks**](#thanks)
* [**Todo**](#todo)
* [**License**](#license)
* [**FAQ / Troubleshooting**](#faq)
* [**Rationale**](#rationale)
* [**Inspiration**](#inspiration)

<BR />

[**About**]<a name="about"></a>
About the Cmd4 Plugin
---------------------
This plugin allows you see what Homebridge is all about, without having any home control accessories.  If you can run Homebridge and then install this plugin, all the possible accessories are now available to you within HomeKit or Eve. (Except Camera Streaming).

Similiar to other command plugins, you can use Cmd4 to execute command line interface (CLI) scripts, but with CMD4 the devices don't just appear in HomeKit as a Switch or a Light, but now they can appear as a Garage Door openner, Air Purifier ... and you can cntrol all of their characteristics too.


[**How the Plugin Works**]<a name="how"></a>
How the Plugin Works
--------------------
Cmd4 comes with a fully populated and documented config.json file that points to a fully populated and configured State.js file that you put in a Cmd4Scripts subdirectory of your .homebridge directory.
The Cmd4 Plugin reads and understands the config.json file containing every possible HomeKit type. When you point HomeKit to Homebridge, all the devices become populated, and between the homebridge-cmd4 plugin and the State.js command file, HomeKit acts and behaves if you actually have the Accessory you don't actually have.


[**Features**]<a name="features"></a>
Features
--------

Cmd4 supports, Lights, Garage Door Openners, Lights, Outlets, Switches, Lock Maintenance Systems, Lock Management Systems, Humidity Sensors, Doors, Light Sensors, Temperature Sensors, Contact Sensors, Motion Sensors, Thermostats, Security Systems, Battery Services, Filter Maintenance Systems, Air Purifiers ... everything but Camera Streaming since it is not pliable to a command line Interface.

Cmd4 also supports polling, though care was taken to make sure accessories get updated after an adjustable response time so that accessories like a garage door is updated in HomeKit after it was closed or openned.

Cmd4 can be configured to respond to actual devices directly or by modofying the script file it calls.



[**Installation**]<a name="installation"></a>
Installation
------------


<a name="install-step1"></a>
### Step 1 `Homebridge`

 Install homebridge using `npm install -g homebridge`.

<a name="install-step2"></a>
### Step 2 `CMD4 Plugin`

 Install this plugin using `npm install -g homebridge-cmd4`.

<a name="install-step3"></a>
### Step 3 `Install State.js`

 mkdir .homebridge/Cmd4Scripts<BR>
 cp State.js .homebridge/Cmd4Scripts/State.js<BR>
 chmod 700 .homebridge/Cmd4Scripts/State.js

<a name="install-step4"></a>
### Step 4 `Install/Update config.json`

 Use the provided config.json file or add it to your own.

<a name="install-step5"></a>
### Step 5 `Install/Restart homebridge`

 Start/Restart Homebridge as you normally would.

<br />

### That's it! You're done. ✅

<br />

## Usage

If you installed and setup things correctly you should now see icons in the Homekit app for you to play with.




<a name="developer"></a>
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


[**Todo**]<a name="todo"></a>
* [ ] Referred devices, i.e. a smoke detectors battery is not yet linked.


[**FAQ**]<a name="faq"></a>
FAQ / Troubleshooting
---------------------

1) Homebridge is expected to run from a users home directory. where it can find the .homebridge directory and indirectly the homebridge/Cmd4Scripts.State.js command file.

2) The State.js command file must be executable. it can be tested via:<BR>
&nbsp;&nbsp;&nbsp; cd $HOME <BR>
&nbsp;&nbsp;&nbsp; node .homebridge/Cmd4Scripts/State.js Get My_Fan On <BR>
&nbsp;&nbsp;&nbsp; this should output: 0



## Screenshots

See [Screenshots]
<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/screenshots/Homekit.png" alt="Homekit" />
</h3>

<h3 align="center">
  <img src="https://github.com/ztalbot2000/homebridge-cmd4/screenshots/Eve.png" alt="Eve Screenshot" />
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



[**Rationale**]<a name="rationale"></a>
Rationale
---------

After playing with homebridge-cmd and then homebridge-cmdswitch2, I really wanted to control as much as I could.  I did not have all the devices, but I did have a light and a Sony Android TV.  I wanted to control these and see what else I could do. 
If you were wondering what happenned to version 3, well I learned a lot, hence the working cmd4.


[**Rationale**]<a name="rationale"></a>

[**Thanks**]<a name="thanks"></a>
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

