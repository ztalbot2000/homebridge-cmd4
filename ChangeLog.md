# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!

<BR><BR>
## ChangeLog
* [**Whats new in 3.0.0**](#whats-new-in-300)
* [**Whats new in 2.4.2**](#whats-new-in-242)
* [**Whats new in 2.4.1**](#whats-new-in-241)
* [**Whats new in 2.4.0**](#whats-new-in-240)
* [**Whats new in 2.3.2**](#whats-new-in-232)
* [**Whats new in 2.3.1**](#whats-new-in-231)
* [**Whats new in 2.3.0**](#whats-new-in-23)
* [**Whats new in 2.2.5**](#whats-new-in-225)
* [**Whats new in 2.2.2**](#whats-new-in-222)
* [**Whats new in 2.2.1**](#whats-new-in-221)
* [**Whats new in 2.2**](#whats-new-in-22)
* [**Whats new in 2.1**](#whats-new-in-21)
* [**Whats new in 2.0**](#whats-new-in-20)

<BR><BR>
## Whats new in 3.0.0
&nbsp;&nbsp;&nbsp; Big Changes to support IOS 14 are here.
&nbsp;&nbsp;&nbsp; - Proper definitions of Platform versus Standalone Accessories.
&nbsp;&nbsp;&nbsp; - Ability to publish External Platforms for multiple TV's required in IOS 14.
&nbsp;&nbsp;&nbsp; - Added 50+ new characteristics.
&nbsp;&nbsp;&nbsp; - Added parsing of returned "quoted strings" for things like device names.
&nbsp;&nbsp;&nbsp; - Added "Category" for hints to HomeKit of which icon to use for Platform Accessories.
&nbsp;&nbsp;&nbsp; - Added the ability to define multiple Cmd4 Platforms.
&nbsp;&nbsp;&nbsp; - Retrieved characteristic values are now converted to those defined by homebridge, instead of guessed by their possible types.
&nbsp;&nbsp;&nbsp; - Moved some functions to utilities for easier unit testing.
&nbsp;&nbsp;&nbsp; - Splitting documentation into two different areas, Quick install and Development to be less intimidating.
<BR><BR>
## Whats new in 2.4.2
&nbsp;&nbsp;&nbsp; Bug fix for negative temperature values
&nbsp;&nbsp;&nbsp; Add in ability to change properties like minValue. Effect is none as not used, except for further testing.<BR>

<BR><BR>
## Whats new in 2.4.1
&nbsp;&nbsp;&nbsp; Add check for duplicate UUID's that may be created and homebridge now complains about.<BR>
&nbsp;&nbsp;&nbsp; Fix issue were configuredName was not provided in users config.json. <BR>
&nbsp;&nbsp;&nbsp; Add an example of a DoorLock.sh with on a PI and using a GPIO to control it.<BR>
&nbsp;&nbsp;&nbsp; Add a tool to me debug users config.json files.<BR>

<BR><BR>
## Whats new in 2.4.0
&nbsp;&nbsp;&nbsp; While a bump to the minor release, the changes are development only and also for any spelling errors.<BR>
&nbsp;&nbsp;&nbsp; The plugin was split into its respective program/lib/utility/ChangeLog modules. <BR>
&nbsp;&nbsp;&nbsp; Splitting the plugin allowed for better Unit testing.<BR>
&nbsp;&nbsp;&nbsp; What is new are some examples of scripts for ping and wake on lan and can be found in the Extras/CMD4Scripts/Examples sub-directory.<BR>

<BR><BR>
## Whats new in 2.3.2
&nbsp;&nbsp;&nbsp; Minor changes for spelling and package updates. Nothing to see here. These are not the changes you are looking for.<BR>

<BR><BR>
## Whats new in 2.3.1
&nbsp;&nbsp;&nbsp; Updates for Homebridge 1.0.4.<BR>
&nbsp;&nbsp;&nbsp; Added 'AUTO' as current heating state matching Apples Development documentation.<BR>
&nbsp;&nbsp;&nbsp; Increased default timeout to 8 seconds as HomeBridge 1.04 seems slower.<BR>
&nbsp;&nbsp;&nbsp; Pull in README update noted by Daniel.<BR>

<BR><BR>
## Whats new in 2.3.0
&nbsp;&nbsp;&nbsp; Added state_cmd_prefix and state_cmd_suffix to possible state_cmd options.  This does what they intend to where:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_prefix</B></I> - adds a string before the state_cmd. i.e. state_cmd_prefix=sudo would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js 'My_Fan' '1'<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_suffix</B></I> - adds a string after the state_cmd. i.e. state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node .homebridge/Cmd4Scripts/State.js Set 'My_Fan' '1' 00:16:AA:BB:1F:2D<BR>
&nbsp;&nbsp;&nbsp; Combining the two i.e. state_cmd_prefix=sudo state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Get command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js Get 'My_Fan' 00:16:AA:BB:1F:2D<BR>

<BR><BR>
## Whats new in 2.2.5
&nbsp;&nbsp;&nbsp; There is a bug in github-version-checker.  I can't get around it so change to a direct comparison of what is in npm.

<BR><BR>
## Whats new in 2.2.2
&nbsp;&nbsp;&nbsp; This minor version adds an error message when accidentally defining multiple characteristics for characteristic polling.

<BR><BR>
## Whats new in 2.2.1
&nbsp;&nbsp;&nbsp; This minor version differentiates the optional characteristic 'Name' from displayName.
    displayName is used when creating the service.  It is essentially the same thing, but this follows the spec exactly.  You do not need to change your config.json file if you do not want too.<BR>
&nbsp;&nbsp;&nbsp; Internally all properties of all characteristics are defined.<BR>
&nbsp;&nbsp;&nbsp; Homebridge does not allow you to getCharacteristic information easily.  This allows Cmd4 to stop you from using characteristics with a format of TLV8 that causes HomeBridge to fail to start.  This is why the new option:'allowTLV8' was created and set to false by default. Again just ignore it.<BR>
&nbsp;&nbsp;&nbsp; With all the properties defined, Test cases increases to 7644.

<BR><BR>
## Whats new in 2.2
&nbsp;&nbsp;&nbsp; This version adds in linked accessories. HDMI Input sources for a TV are now shown in HomeKit as an example.<BR>
&nbsp;&nbsp;&nbsp; This release also defines constants for all the characteristics that has them.  Look at the config.min.json file for descriptions of the constants per characteristic.<BR>
&nbsp;&nbsp;&nbsp; The number of test cases increases because of constants to 4500.  That equates to almost 61\% more coverage, and less possible errors.<BR>
&nbsp;&nbsp;&nbsp; Finally this release adds in version checking so you are always up to date with the latest version of Homebridge-Cmd4.<BR>

<BR><BR>
## Whats new in 2.1
&nbsp;&nbsp;&nbsp; This minor release fixes duplicate service calls for initializing an AccessoryInformation device, Television & TelevisionSpeaker.

Mostly importantly it wipes out 5600 duplicate lines of code to one bound function.

<BR><BR>
## Whats new in 2.0
&nbsp;&nbsp;&nbsp; This release changes the philosophy of homebridge-Cmd4 from Accessories that have known characteristics as per the HAP Spec to assigning any characteristic to any Accessory.

There are 160 possible characteristics, 60 more than the previous version.  Also TV, TV Speaker, Input Source, Irrigation, Faucets and many other accessories are now available.

