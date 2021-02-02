# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!

## ChangeLog
* [**Whats new in 3.0.14**](#whats-new-in-3015)
* [**Whats new in 3.0.14**](#whats-new-in-3014)
* [**Whats new in 3.0.12**](#whats-new-in-3012)
* [**Whats new in 3.0.11**](#whats-new-in-3011)
* [**Whats new in 3.0.9**](#whats-new-in-309)
* [**Whats new in 3.0.8**](#whats-new-in-308)
* [**Whats new in 3.0.7**](#whats-new-in-307)
* [**Whats new in 3.0.5**](#whats-new-in-305)
* [**Whats new in 3.0.4**](#whats-new-in-304)
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

## Whats new in 3.0.15
* Cached characteristics were never stored when not updated by other than polling.

## Whats new in 3.0.14
* Remove unwanted log.
* Code cleanup of setValue. Stuff no longer relavent.

## Whats new in 3.0.12
* Absolutely no changes. Advertise deprecation notice of State.js and
  new Cmd4 GitHub Pages at: https://ztalbot2000.github.io/homebridge-cmd4

## Whats new in 3.0.11
* Fix for output constants occuring if not default not set.

## Whats new in 3.0.9
* Fix removal of fetch, causing caching of the designation to result
  in "Invalid value: undefined for Fetch"

## Whats new in 3.0.8
* Fix outputConstants not outputting anything if no translation
* Fix debug message causing trap during outputConstants
* Beginning of auto generated documentation in GitHub. Please
  Do not criticize yet. Work in progress.

## Whats new in 3.0.7
* Fix Switch on/off being off/on

## Whats new in 3.0.6
* No changes, just packaging issue.

## Whats new in 3.0.5
* Fix of issue #78.  Most constants were not documented correctly and 3.0 no longer uppercased them for you. Put back this capability and fix the documentation.
* Fix Bug: ReferenceError: Cannot access 'result' before initialization when Fetch is set to Cached and some other details.

## Whats new in 3.0.4
* BugFix of issue #76 for those who did not specify any polling type at all and "fetch": "Always" ( The default ) caused any characteristic state to be retrieved at all.
* Minor improvement to the version checker that stopped post install notes from being displayed.
* Allow Cmd4 cached directive changes, like "polling" to be overwritten over restarts.


## Whats new in 3.0.0
### Changes to support IOS 14.
* Cmd4 now follows the [Homebridge Plugin Template](https://github.com/homebridge/homebridge-plugin-template). This means that:

   * Accessories[] are now platformAccessories and can be published externally with an optional category. i.e.<BR>
   ```json
     { "category": "TELEVISION" }
   ```
   * This allows multiple TV's to be configured per Bridge as separate platforms.
   * Accessory plugins can also be defined separately.
   * This fixes TV icons not being displayed in the Home App of IOS 14.
* Number of Devices increased from 52 to 64.
* Number of Characteristics increased from 160 to 221.
* Returned "quoted strings" or 'quoted strings' are now acceptable.
* Reduced child processes with new "fetch" option
   * { "fetch": "Always" } - As before ( Default )
   * { "fetch": "Cached" } - Never fetch characteristic value. Use cached value. The cached value would have to be updated through polling.
   * { "fetch": "Polled" } - Polled characteristics act like before, "Always". Non polled characteristic values are fetched from cache.
* Added the ability to remember characteristic values over restarts. This also means that device name changes and the like are possible. Disabled by:<BR>
```json
   "restartRecover": false
```
   In the section of the config.json where "platform": "Cmd4" is defined. Default is true.
* Retrieved characteristic values are now converted to those defined by homebridge, instead of guessed by their possible types.
* Accessory polling definition changes from:<BR>
```
   [{ < characteristic >:< defaultValue >, "interval":< sec >, "timeout": < msec > }]
```
To:<BR>
```
   [ "characteristic": < characteristic >, "interval":< sec >, "timeout": < msec > }]
```
   Note: Old style is still supported with warning.

* Moved some functions to utilities for easier unit testing.
* Splitting documentation into three different areas, README, Advanced Troubleshooting and a Developers guide.
* Changed utility colors.js for package chalk.
* Internally, any string is now a constant, limiting some possible typos.
* Added eslint and resolved all recommended lint errors.

# Important
While this version appears backward compatible, there is a difference in that the Accessories are created as Platform Accessories as compared to Standard Accessories. The [Homebridge API](https://developers.homebridge.io/#/) documentation details the difference as does the new [Cmd4 Developers Guide](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/DevelopersGuide.md).
<BR><BR>
## Whats new in 2.4.2
* Bug fix for negative temperature values
* Add in ability to change properties like minValue. Effect is none as not used, except for further testing.<BR>

## Whats new in 2.4.1
* Add check for duplicate UUID's that may be created and homebridge now complains about.
* Fix issue were configuredName was not provided in users config.json.
* Add an example of a DoorLock.sh with on a PI and using a GPIO to control it.
* Add a tool to me debug users config.json files.

## Whats new in 2.4.0
* While a bump to the minor release, the changes are development only and also for any spelling errors.
* The plugin was split into its respective program/lib/utility/ChangeLog modules.
* Splitting the plugin allowed for better Unit testing.
* What is new are some examples of scripts for ping and wake on lan and can be found in the Extras/CMD4Scripts/Examples sub-directory.

## Whats new in 2.3.2
* Minor changes for spelling and package updates. Nothing to see here. These are not the changes you are looking for.<BR>

## Whats new in 2.3.1
* Updates for Homebridge 1.0.4.
* Added 'AUTO' as current heating state matching Apples Development documentation.
* Increased default timeout to 8 seconds as HomeBridge 1.04 seems slower.<BR>
* Pull in README update noted by Daniel.

## Whats new in 2.3.0
* Added state_cmd_prefix and state_cmd_suffix to possible state_cmd options.  This does what they intend to where:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_prefix</B></I> - adds a string before the state_cmd. i.e. state_cmd_prefix=sudo would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js 'My_Fan' '1'<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_suffix</B></I> - adds a string after the state_cmd. i.e. state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node .homebridge/Cmd4Scripts/State.js Set 'My_Fan' '1' 00:16:AA:BB:1F:2D<BR>
&nbsp;&nbsp;&nbsp; Combining the two i.e. state_cmd_prefix=sudo state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Get command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js Get 'My_Fan' 00:16:AA:BB:1F:2D<BR>

## Whats new in 2.2.5
* There is a bug in github-version-checker.  I can't get around it so change to a direct comparison of what is in npm.

## Whats new in 2.2.2
* This minor version adds an error message when accidentally defining multiple characteristics for characteristic polling.

## Whats new in 2.2.1
* This minor version differentiates the optional characteristic 'Name' from displayName.
    displayName is used when creating the service.  It is essentially the same thing, but this follows the spec exactly.  You do not need to change your config.json file if you do not want too.
* Internally all properties of all characteristics are defined.
* Homebridge does not allow you to getCharacteristic information easily.  This allows Cmd4 to stop you from using characteristics with a format of TLV8 that causes HomeBridge to fail to start.  This is why the new option:'allowTLV8' was created and set to false by default. Again just ignore it.
* With all the properties defined, Test cases increases to 7644.

## Whats new in 2.2
* This version adds in linked accessories. HDMI Input sources for a TV are now shown in HomeKit as an example.
* This release also defines constants for all the characteristics that has them.  Look at the config.min.json file for descriptions of the constants per characteristic.
* The number of test cases increases because of constants to 4500.  That equates to almost 61\% more coverage, and less possible errors.
* Finally this release adds in version checking so you are always up to date with the latest version of Homebridge-Cmd4.

## Whats new in 2.1
* This minor release fixes duplicate service calls for initializing an AccessoryInformation device, Television & TelevisionSpeaker.

Mostly importantly it wipes out 5600 duplicate lines of code to one bound function.

## Whats new in 2.0
* 2This release changes the philosophy of homebridge-Cmd4 from Accessories that have known characteristics as per the HAP Spec to assigning any characteristic to any Accessory.

There are 160 possible characteristics, 60 more than the previous version.  Also TV, TV Speaker, Input Source, Irrigation, Faucets and many other accessories are now available.
