# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!

## ChangeLog
* [**Whats new in 3.1.3**](#whats-new-in-313)
* [**Whats new in 3.1.2**](#whats-new-in-312)
* [**Whats new in 3.1.1**](#whats-new-in-311)
* [**Whats new in 3.1.0**](#whats-new-in-310)
* [**Whats new in 3.0.15**](#whats-new-in-3015)
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

## Whats new in 3.1.3
#### 3.1.3 (2021-02-17)

##### Chores

*  Path for my m1mini changed ([81d5d7d0](https://github.com/ztalbot2000/homebridge-cmd4/commit/81d5d7d0da1c03eb5da03b3e086f6a4170034dd5))

##### Documentation Changes

*  Correct link for case change ([249c31f1](https://github.com/ztalbot2000/homebridge-cmd4/commit/249c31f188b55755644031c6d61d5aa79e149108))

##### Bug Fixes

*  Setting cached values should set their corresponding cached verify characteristic ([b8b34098](https://github.com/ztalbot2000/homebridge-cmd4/commit/b8b340986029ff11f3523c6b8b29fd1e8859b73c))
*  Any stderr messages should be logged ([b6289133](https://github.com/ztalbot2000/homebridge-cmd4/commit/b6289133d4ceb6fd3f6c1744670df66741cf4ea2))

##### Tests

*  Check cached values should set their corresponding cached verify characteristic ([a9b380a5](https://github.com/ztalbot2000/homebridge-cmd4/commit/a9b380a582819c59df30d7ec0f57c7669c99844a))
*  Check for stderr messages being logged ([442e6beb](https://github.com/ztalbot2000/homebridge-cmd4/commit/442e6beb463f56f11107518a779bf48e83c8bc64))


## Whats new in 3.1.2
#### 3.1.2 (2021-02-15)

##### Bug Fixes

*  A bit better answer to [#89](https://github.com/ztalbot2000/homebridge-cmd4/pull/89), with testcases to prove it ([569018b5](https://github.com/ztalbot2000/homebridge-cmd4/commit/569018b5a0f6bfc76b045d70acead590fa267de2))


## Whats new in 3.1.1
#### 3.1.1 (2021-02-15)

##### Bug Fixes

*  For [#89](https://github.com/ztalbot2000/homebridge-cmd4/pull/89).  No returned getValue results in "Cannot read property reduce of null" ([3d080d3d](https://github.com/ztalbot2000/homebridge-cmd4/commit/3d080d3dc85754ff9eac030507b5322f5faad5e9))


## Whats new in 3.1.0
### 3.1.0 (2021-02-14)

##### Features
* For #88 Log a Status change message and have it be optional statusMsg ([019c6d2](https://github.com/ztalbot2000/homebridge-cmd4/commit/ef9f57fc646eeab5a15e404f445545a2a2528391))

##### Build System / Dependencies

*  Remove images destined for github pages from npm distribution ([7a11296b](https://github.com/ztalbot2000/homebridge-cmd4/commit/7a11296b783e3d51237f9109b62696f684f0d902))
*  Remove images destined for github pages from npm distribution ([7a11296b](https://github.com/ztalbot2000/homebridge-cmd4/commit/7a11296b783e3d51237f9109b62696f684f0d902))
*  Add commit message rules and up version generator ([d6dfcb19](https://github.com/ztalbot2000/homebridge-cmd4/commit/d6dfcb19bd98e782ac103dcecd5b0e0dcce37a07))
*  npm shoud ignore .github templates etc ... ([a457e0bc](https://github.com/ztalbot2000/homebridge-cmd4/commit/a457e0bc92b59e983ba33e8d11fb07207084d480))

##### Chores

*  Already merged. Try to fix Git tree ([33694479](https://github.com/ztalbot2000/homebridge-cmd4/commit/3369447934e2f328f2a69d37cf61ceedc97f6f63))

##### Bug Fixes

*  Store value to cache after successful set to device when fetch="Polled" ([18a4f569](https://github.com/ztalbot2000/homebridge-cmd4/commit/18a4f5691fe67abc3c64d152822134b77b09aaa4))
*  Cached characteristics were never stored if changed by other than polling ([fd3b4cc8](https://github.com/ztalbot2000/homebridge-cmd4/commit/fd3b4cc894598bf424371de03656054d713f3663))

##### Other Changes

* < true/false > ([ef9f57fc](https://github.com/ztalbot2000/homebridge-cmd4/commit/ef9f57fc646eeab5a15e404f445545a2a2528391))
*  Update issue templates ([5eb330ad](https://github.com/ztalbot2000/homebridge-cmd4/commit/5eb330ad18a58f8c5f1a456ed261bb6c963c8217))
*  Update issue templates ([f19bec63](https://github.com/ztalbot2000/homebridge-cmd4/commit/f19bec6322f77026c0da707a5b283fbe956beb6f))
*  Rename Changelog.md to CHANGELOG.md for naming conventions and future use of standard-version ([c9a4b746](https://github.com/ztalbot2000/homebridge-cmd4/commit/c9a4b746aea2c9b003b4219ab4d042cc7b3eadbe))
*  Add in Fetch Diagram ([7bd8b46e](https://github.com/ztalbot2000/homebridge-cmd4/commit/7bd8b46eecb62c232137dfba6c1356d7c619bf01))
*  Fixed broken link to Developers Guide. ([a55e6235](https://github.com/ztalbot2000/homebridge-cmd4/commit/a55e6235c036992c2dd6fb6879f82635fe5a3d03))
*  Fix broken link to LICENSE. ([9b702d0a](https://github.com/ztalbot2000/homebridge-cmd4/commit/9b702d0a704d19c4aae764003e527d47013663df))
*  Fix links to 'raw' text versions of links. ([33e558b4](https://github.com/ztalbot2000/homebridge-cmd4/commit/33e558b41726dc5fb518933dd993387e0fe17e59))
*  Fix broken link to LICENSE. ([82ab2aba](https://github.com/ztalbot2000/homebridge-cmd4/commit/82ab2aba3fb16cc6992fbc2c0fc1a0a0dec3cae6))
*  Fixed broken link to Developers Guide ([f46b2b78](https://github.com/ztalbot2000/homebridge-cmd4/commit/f46b2b7873bbd89c7780c58b2916fc28b41e4873))
*  Create issue templates. ([5059486f](https://github.com/ztalbot2000/homebridge-cmd4/commit/5059486fc65ef39e8aa7aed02c093f6fd95e0537))

##### Tests

*  fix tests that sometimes failed ([cd005d9b](https://github.com/ztalbot2000/homebridge-cmd4/commit/cd005d9b344aee92a03127c19947f4ba47f11eeb))
*  Check if 0, "0" or "0.0" is handled correctly and it is ([019c6d26](https://github.com/ztalbot2000/homebridge-cmd4/commit/019c6d267fbe73a36099806eb79d4902e6698907))
*  Add test for same config as polling ([4eb8c09a](https://github.com/ztalbot2000/homebridge-cmd4/commit/4eb8c09aed103edbf5d05d78269fc0835f198477))


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
While this version appears backward compatible, there is a difference in that the Accessories are created as Platform Accessories as compared to Standard Accessories. The [Homebridge API](https://developers.homebridge.io/#/) documentation details the difference as does the new [Cmd4 Developers Guide](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/docs/Developers.md).
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
