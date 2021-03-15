# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
<base _target="_self">
## Homebridge UI User. Do not click on any inline links. Homebridge UI does not supprt them. Bug#1098

## ChangeLog
* <a href="#Whats-new-in-3-3-1">**Whats new in 3.3.1**</a>
* <a href="#Whats-new-in-3-3-0">**Whats new in 3.3.0**</a>
* <a href="#Whats-new-in-3-2-5-beta6">**Whats new in 3.2.5-beta6**</a>
* <a href="#Whats-new-in-3-2-5-beta5">**Whats new in 3.2.5-beta5**</a>
* <a href="#Whats-new-in-3-2-5-beta3">**Whats new in 3.2.5-beta3**</a>
* <a href="#Whats-new-in-3-2-5-beta2">**Whats new in 3.2.5-beta2**</a>
* <a href="#Whats-new-in-3-2-5-beta1">**Whats new in 3.2.5-beta1**</a>
* <a href="#Whats-new-in-3-2-3">**Whats new in 3.2.3**</a>
* <a href="#Whats-new-in-3-2-2">**Whats new in 3.2.2**</a>
* <a href="#Whats-new-in-3-2-1">**Whats new in 3.2.1**</a>
* <a href="#Whats-new-in-3-2-0">**Whats new in 3.2.0**</a>
* <a href="#Whats-new-in-3-1-3">**Whats new in 3.1.3**</a>
* <a href="#Whats-new-in-3-1-2">**Whats new in 3.1.2**</a>
* <a href="#Whats-new-in-3-1-1">**Whats new in 3.1.1**</a>
* <a href="#Whats-new-in-3-1-0">**Whats new in 3.1.0**</a>
* <a href="#Whats-new-in-3-0-15">**Whats new in 3.0.15**</a>
* <a href="#Whats-new-in-3-0-14">**Whats new in 3.0.14**</a>
* <a href="#Whats-new-in-3-0-12">**Whats new in 3.0.12**</a>
* <a href="#Whats-new-in-3-0-11">**Whats new in 3.0.11**</a>
* <a href="#Whats-new-in-3-0-9">**Whats new in 3.0.9**</a>
* <a href="#Whats-new-in-3-0-8">**Whats new in 3.0.8**</a>
* <a href="#Whats-new-in-3-0-7">**Whats new in 3.0.7**</a>
* <a href="#Whats-new-in-3-0-5">**Whats new in 3.0.5**</a>
* <a href="#Whats-new-in-3-0-4">**Whats new in 3.0.4**</a>
* <a href="#Whats-new-in-3-0-0">**Whats new in 3.0.0**</a>
* <a href="#Whats-new-in-2-4-2">**Whats new in 2.4.2**</a>
* <a href="#Whats-new-in-2-4-1">**Whats new in 2.4.1**</a>
* <a href="#Whats-new-in-2-4-0">**Whats new in 2.4.0**</a>
* <a href="#Whats-new-in-2-3-2">**Whats new in 2.3.2**</a>
* <a href="#Whats-new-in-2-3-1">**Whats new in 2.3.1**</a>
* <a href="#Whats-new-in-2-3-0">**Whats new in 2.3.0**</a>
* <a href="#Whats-new-in-2-2-5">**Whats new in 2.2.5**</a>
* <a href="#Whats-new-in-2-2-2">**Whats new in 2.2.2**</a>
* <a href="#Whats-new-in-2-2-1">**Whats new in 2.2.1**</a>
* <a href="#Whats-new-in-2-2">**Whats new in 2.2**</a>
* <a href="#Whats-new-in-2-1">**Whats new in 2.1**</a>
* <a href="#Whats-new-in-2-0">**Whats new in 2.0**</a>

<a name="Whats-new-in-3-3-1">## Whats new in 3.3.1</a>
#### 3.3.1 (2021-03-15)

##### Bug Fixes

*  Not handling too much data well ([b4fd8a19](https://github.com/ztalbot2000/homebridge-cmd4/commit/b4fd8a1935817c011b34469fd4505c1cd3294c97))


<a name="Whats-new-in-3-3-0">## Whats new in 3.3.0</a>
### 3.3.0 (2021-03-13)

##### Chores

*  packaging for 3.2.5-beta6 ([5ef6d0e8](https://github.com/ztalbot2000/homebridge-cmd4/commit/5ef6d0e8e4d29679e1550b69489aefbdb318d163))
*  Missing file ([b95bb22e](https://github.com/ztalbot2000/homebridge-cmd4/commit/b95bb22e46121e36a4dc9dd741ad9a43e24491b9))

##### New Features

*  Now that polling uses updateValue, polling can be independent of fetch ([b3ca7f0](https://github.com/ztalbot2000/homebridge-cmd4/commit/b48d88b66ef1a715d347c6a712aee0a927f48741))
*  Change to RUNNING_CHANGLOG for Homebeidge-UI bug that cannot follow inline URLs ([13e57946](https://github.com/ztalbot2000/homebridge-cmd4/commit/13e57946c187424f8bef4deb8b28860ba3276330))

##### Bug Fixes

*  properly handle removed platform accessories from cache ([2ce2e9a3](https://github.com/ztalbot2000/homebridge-cmd4/commit/2ce2e9a31030e1f931bc28ae2c55eca59d0c8899))
*  Globally allow statusMsg option to be set ([cc173514](https://github.com/ztalbot2000/homebridge-cmd4/commit/cc17351407005926a9c3b218f889727b1fb852ef))

##### Tests

*  Test all constants, just in case accidentally changed ([b3ca7f07](https://github.com/ztalbot2000/homebridge-cmd4/commit/b3ca7f07a20d25750e10dee5e0b533dd6f7393fb))


<a name="Whats-new-in-3-2-5-beta6">## Whats new in 3.2.5-beta6</a>
#### 3.2.5-beta6 (2021-03-12)

##### Chores

*  Missing file ([b95bb22e](https://github.com/ztalbot2000/homebridge-cmd4/commit/b95bb22e46121e36a4dc9dd741ad9a43e24491b9))

##### New Features

*  Change to RUNNING_CHANGLOG for Homebeidge-UI bug that cannot follow inline URLs ([13e57946](https://github.com/ztalbot2000/homebridge-cmd4/commit/13e57946c187424f8bef4deb8b28860ba3276330))

##### Bug Fixes

*  properly handle removed platform accessories from cache ([2ce2e9a3](https://github.com/ztalbot2000/homebridge-cmd4/commit/2ce2e9a31030e1f931bc28ae2c55eca59d0c8899))
*  Globally allow statusMsg option to be set ([cc173514](https://github.com/ztalbot2000/homebridge-cmd4/commit/cc17351407005926a9c3b218f889727b1fb852ef))


<a name="Whats-new-in-3-2-5-beta5">## Whats new in 3.2.5-beta5</a>
#### 3.2.5-beta5 (2021-03-11)

##### New Features

*  Polling now calls updateValue ([9c75b069](https://github.com/ztalbot2000/homebridge-cmd4/commit/9c75b0692ea687559a112269bdfa09fef5568e2e))
*  Double check for polling or services not being created twice ([2d856289](https://github.com/ztalbot2000/homebridge-cmd4/commit/2d85628996fc3702b5b309754a6bde25dc95f605))

##### Bug Fixes

*  lower Temperature in config.json to match homebridges expected values without prop changes ([78cf3ea7](https://github.com/ztalbot2000/homebridge-cmd4/commit/78cf3ea7f4cae2438023888bf1084d8f649e7a20))
*  transposing constants to strings and add subType to clarify accessory services ([99d69cec](https://github.com/ztalbot2000/homebridge-cmd4/commit/99d69cec5eb1902f0429a6a84276571fbe6e298a))

##### Other Changes

* Always ([1e144e9c](https://github.com/ztalbot2000/homebridge-cmd4/commit/1e144e9c027f3b0dc353b0bd1c2edd2819712654))


<a name="Whats-new-in-3-2-5-beta3">## Whats new in 3.2.5-beta3</a>
#### 3.2.5-beta3 (2021-03-07)

##### Chores

*  packaging of 3.2.5-beta3 ([0686607b](https://github.com/ztalbot2000/homebridge-cmd4/commit/0686607b3fff0028054021bcf16c2917b242ae3e))

##### Other Changes

* Stagger Polling Starts ([1e144e9c](https://github.com/ztalbot2000/homebridge-cmd4/commit/1e144e9c027f3b0dc353b0bd1c2edd2819712654))


<a name="Whats-new-in-3-2-6">## Whats new in 3.2.5-beta2</a>
#### 3.2.5-beta2 (2021-03-05)

##### Bug Fixes

*  use cross spawn instead of exec ([ab51b8dd](https://github.com/ztalbot2000/homebridge-cmd4/commit/ab51b8dd9b9a543d222d22f54348b06ff901d011))


<a name="Whats-new-in-3-2-5-beta1">## Whats new in 3.2.5-beta1</a>
#### 3.2.5-beta1 (2021-03-03)

##### Chores

*  packaging for v3.2.3 ([504d2e23](https://github.com/ztalbot2000/homebridge-cmd4/commit/504d2e23cd1adfb6713dcdc74cb675a896b93cc9))

##### Documentation Changes

*  Homebridge-UI-X intercept message ([06858799](https://github.com/ztalbot2000/homebridge-cmd4/commit/06858799144b8066762925ba101f16824ce48749))

##### Bug Fixes

*  improve performance of getValue by pre-dfining conversion func based on char being fetched ([51509d6d](https://github.com/ztalbot2000/homebridge-cmd4/commit/51509d6d464d5c8a38c444dbf70acdb5526cafa2))
*  resolve warnings for strings that could validly have multiple words ([c6642b6c](https://github.com/ztalbot2000/homebridge-cmd4/commit/c6642b6c519e81d5a3bbadcf503f3c4d1eb33569))
*  [#97](https://github.com/ztalbot2000/homebridge-cmd4/pull/97) Handle both cases for input in config.json. Default should have been UC ([d105cdfe](https://github.com/ztalbot2000/homebridge-cmd4/commit/d105cdfe5848e533f1a0b8a56075e028161baf76))
*  For [#96](https://github.com/ztalbot2000/homebridge-cmd4/pull/96) Warning message is for related device characteristics only ([f2c28f1a](https://github.com/ztalbot2000/homebridge-cmd4/commit/f2c28f1a46fad0baf073b47f1ccf4612a85c4eb2))

##### Code Style Changes

*  remove dead code ([a3d42a8d](https://github.com/ztalbot2000/homebridge-cmd4/commit/a3d42a8dfcac5263388106d6caf312df22980bb5))
*  It seems passing structure is expensive ([0b7b4253](https://github.com/ztalbot2000/homebridge-cmd4/commit/0b7b425398bd0e081e2c5faadaefc7d686587da0))

##### Tests

*  Add full initPlugin test, cannot run with others so commented out ([a6de84ac](https://github.com/ztalbot2000/homebridge-cmd4/commit/a6de84ac6f0bd9c13ccbb9b796e1d4c1a1fc3745))
*   fix unit test that was incomplete ([8c0e2dd0](https://github.com/ztalbot2000/homebridge-cmd4/commit/8c0e2dd0e5f78ab06c5726b89f326c777022d728))


<a name="Whats-new-in-3-2-3">## Whats new in 3.2.3</a>
#### 3.2.3 (2021-03-01)

##### Documentation Changes

*  Homebridge-UI-X intercept message ([06858799](https://github.com/ztalbot2000/homebridge-cmd4/commit/06858799144b8066762925ba101f16824ce48749))

##### Bug Fixes

*  resolve warnings for strings that could validly have multiple words ([c6642b6c](https://github.com/ztalbot2000/homebridge-cmd4/commit/c6642b6c519e81d5a3bbadcf503f3c4d1eb33569))
*  [#97](https://github.com/ztalbot2000/homebridge-cmd4/pull/97) Handle both cases for input in config.json. Default should have been UC ([d105cdfe](https://github.com/ztalbot2000/homebridge-cmd4/commit/d105cdfe5848e533f1a0b8a56075e028161baf76))
*  For [#96](https://github.com/ztalbot2000/homebridge-cmd4/pull/96) Warning message is for related device characteristics only ([f2c28f1a](https://github.com/ztalbot2000/homebridge-cmd4/commit/f2c28f1a46fad0baf073b47f1ccf4612a85c4eb2))

##### Tests

*  Add full initPlugin test, cannot run with others so commented out ([a6de84ac](https://github.com/ztalbot2000/homebridge-cmd4/commit/a6de84ac6f0bd9c13ccbb9b796e1d4c1a1fc3745))
*   fix unit test that was incomplete ([8c0e2dd0](https://github.com/ztalbot2000/homebridge-cmd4/commit/8c0e2dd0e5f78ab06c5726b89f326c777022d728))


<a name="Whats-new-in-3-2-2">## Whats new in 3.2.2</a>
#### 3.2.2 (2021-02-26)

##### Bug Fixes

*  For [#95](https://github.com/ztalbot2000/homebridge-cmd4/pull/95) correct link to pull requests ([6547ff8b](https://github.com/ztalbot2000/homebridge-cmd4/commit/6547ff8be33cb40041d03bd40f523bdc69f7d549))
*  [#94](https://github.com/ztalbot2000/homebridge-cmd4/pull/94) Changes affect unit testing and Auto generated docs ([876f9889](https://github.com/ztalbot2000/homebridge-cmd4/commit/876f9889c7c46575d0d207a384469389aacc6cbe))


<a name="Whats-new-in-3-2-1">## Whats new in 3.2.1</a>
#### 3.2.1 (2021-02-24)

##### Bug Fixes

*  resolve setting Target characteristics that do not set thier Current characteristic counterpart ([278ffcc7](https://github.com/ztalbot2000/homebridge-cmd4/commit/278ffcc7f34fbd7b648971044a05dbad01189b36))
*  [#90](https://github.com/ztalbot2000/homebridge-cmd4/pull/90) For Config-UI-X not displaying markdown properly. change to HTML anchors with base URL ([0b8cfef0](https://github.com/ztalbot2000/homebridge-cmd4/commit/0b8cfef05f0d2be0b2baaaad1aa106043dd6d0f3))

##### Code Style Changes

*  lint auto doc generator ([bd259c6f](https://github.com/ztalbot2000/homebridge-cmd4/commit/bd259c6f36231860b2ecebe52f780aeaed9d9cd0))

##### Tests

*  add markdown checker ([0dd19ca7](https://github.com/ztalbot2000/homebridge-cmd4/commit/0dd19ca7f5588390ec5a904a75199b4817f1353e))


<a name="Whats-new-in-3-2-0">## Whats new in 3.2.0</a>
### 3.2.0 (2021-02-23)

##### Bug Fixes

*  cached data over restarts ([020797fe](https://github.com/ztalbot2000/homebridge-cmd4/commit/020797fe70cd82afaca5a0c5d713cdab1ca5b32a))


<a name="Whats-new-in-3-1-3">## Whats new in 3.1.3</a>
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


<a name="Whats-new-in-3-1-2">## Whats new in 3.1.2</a>
#### 3.1.2 (2021-02-15)

##### Bug Fixes

*  A bit better answer to [#89](https://github.com/ztalbot2000/homebridge-cmd4/pull/89), with testcases to prove it ([569018b5](https://github.com/ztalbot2000/homebridge-cmd4/commit/569018b5a0f6bfc76b045d70acead590fa267de2))


<a name="Whats-new-in-3-1-1">## Whats new in 3.1.1</a>
#### 3.1.1 (2021-02-15)

##### Bug Fixes

*  For [#89](https://github.com/ztalbot2000/homebridge-cmd4/pull/89).  No returned getValue results in "Cannot read property reduce of null" ([3d080d3d](https://github.com/ztalbot2000/homebridge-cmd4/commit/3d080d3dc85754ff9eac030507b5322f5faad5e9))


<a name="Whats-new-in-3-1-0">## Whats new in 3.1.0</a>
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


<a name="Whats-new-in-3-0-15">## Whats new in 3.0.15</a>
* Cached characteristics were never stored when not updated by other than polling.

<a name="Whats-new-in-3-0-14">## Whats new in 3.0.14</a>
* Remove unwanted log.
* Code cleanup of setValue. Stuff no longer relavent.

<a name="Whats-new-in-3-0-12">## Whats new in 3.0.12</a>
* Absolutely no changes. Advertise deprecation notice of State.js and
  new Cmd4 GitHub Pages at: https://ztalbot2000.github.io/homebridge-cmd4

<a name="Whats-new-in-3-0-11">## Whats new in 3.0.11</a>
* Fix for output constants occuring if not default not set.

<a name="Whats-new-in-3-0-9">## Whats new in 3.0.9</a>
* Fix removal of fetch, causing caching of the designation to result
  in "Invalid value: undefined for Fetch"

<a name="Whats-new-in-3-0-8">## Whats new in 3.0.8</a>
* Fix outputConstants not outputting anything if no translation
* Fix debug message causing trap during outputConstants
* Beginning of auto generated documentation in GitHub. Please
  Do not criticize yet. Work in progress.

<a name="Whats-new-in-3-0-7">## Whats new in 3.0.7</a>
* Fix Switch on/off being off/on

<a name="Whats-new-in-3-0-6">## Whats new in 3.0.6</a>
* No changes, just packaging issue.

<a name="Whats-new-in-3-0-5">## Whats new in 3.0.5</a>
* Fix of issue #78.  Most constants were not documented correctly and 3.0 no longer uppercased them for you. Put back this capability and fix the documentation.
* Fix Bug: ReferenceError: Cannot access 'result' before initialization when Fetch is set to Cached and some other details.

<a name="Whats-new-in-3-0-4">## Whats new in 3.0.4</a>
* BugFix of issue #76 for those who did not specify any polling type at all and "fetch": "Always" ( The default ) caused any characteristic state to be retrieved at all.
* Minor improvement to the version checker that stopped post install notes from being displayed.
* Allow Cmd4 cached directive changes, like "polling" to be overwritten over restarts.


<a name="Whats-new-in-3-0-0">## Whats new in 3.0.0</a>
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

<a name="Whats-new-in-2-4-2">## Whats new in 2.4.2</a>
* Bug fix for negative temperature values
* Add in ability to change properties like minValue. Effect is none as not used, except for further testing.<BR>

<a name="Whats-new-in-2-4-1">## Whats new in 2.4.1</a>
* Add check for duplicate UUID's that may be created and homebridge now complains about.
* Fix issue were configuredName was not provided in users config.json.
* Add an example of a DoorLock.sh with on a PI and using a GPIO to control it.
* Add a tool to me debug users config.json files.

<a name="Whats-new-in-2-4-0">## Whats new in 2.4.0</a>
* While a bump to the minor release, the changes are development only and also for any spelling errors.
* The plugin was split into its respective program/lib/utility/ChangeLog modules.
* Splitting the plugin allowed for better Unit testing.
* What is new are some examples of scripts for ping and wake on lan and can be found in the Extras/CMD4Scripts/Examples sub-directory.

<a name="Whats-new-in-2-3-2">## Whats new in 2.3.2</a>
* Minor changes for spelling and package updates. Nothing to see here. These are not the changes you are looking for.<BR>

<a name="Whats-new-in-2-3-1">## Whats new in 2.3.1</a>
* Minor changes for spelling and package updates. Nothing to see here. These are not the changes you are looking for.<BR>
* Updates for Homebridge 1.0.4.
* Added 'AUTO' as current heating state matching Apples Development documentation.
* Increased default timeout to 8 seconds as HomeBridge 1.04 seems slower.<BR>
* Pull in README update noted by Daniel.

<a name="Whats-new-in-2-3-0">## Whats new in 2.3.0</a>
* Added state_cmd_prefix and state_cmd_suffix to possible state_cmd options.  This does what they intend to where:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_prefix</B></I> - adds a string before the state_cmd. i.e. state_cmd_prefix=sudo would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js 'My_Fan' '1'<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<I><B>state_cmd_suffix</B></I> - adds a string after the state_cmd. i.e. state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Set command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node .homebridge/Cmd4Scripts/State.js Set 'My_Fan' '1' 00:16:AA:BB:1F:2D<BR>
&nbsp;&nbsp;&nbsp; Combining the two i.e. state_cmd_prefix=sudo state_cmd_suffix="00:16:AA:BB:1F:2D" would create the Get command to be:<BR>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sudo node .homebridge/Cmd4Scripts/State.js Get 'My_Fan' 00:16:AA:BB:1F:2D<BR>

<a name="Whats-new-in-2-2-5">## Whats new in 2.2.5</a>
* There is a bug in github-version-checker.  I can't get around it so change to a direct comparison of what is in npm.

<a name="Whats-new-in-2-2-2">## Whats new in 2.2.2</a>
* This minor version adds an error message when accidentally defining multiple characteristics for characteristic polling.

<a name="Whats-new-in-2-2-1">## Whats new in 2.2.1</a>
* This minor version differentiates the optional characteristic 'Name' from displayName.
    displayName is used when creating the service.  It is essentially the same thing, but this follows the spec exactly.  You do not need to change your config.json file if you do not want too.
* Internally all properties of all characteristics are defined.
* Homebridge does not allow you to getCharacteristic information easily.  This allows Cmd4 to stop you from using characteristics with a format of TLV8 that causes HomeBridge to fail to start.  This is why the new option:'allowTLV8' was created and set to false by default. Again just ignore it.
* With all the properties defined, Test cases increases to 7644.

<a name="Whats-new-in-2-2">## Whats new in 2.2</a>
* This version adds in linked accessories. HDMI Input sources for a TV are now shown in HomeKit as an example.
* This release also defines constants for all the characteristics that has them.  Look at the config.min.json file for descriptions of the constants per characteristic.
* The number of test cases increases because of constants to 4500.  That equates to almost 61\% more coverage, and less possible errors.
* Finally this release adds in version checking so you are always up to date with the latest version of Homebridge-Cmd4.

<a name="Whats-new-in-2-1">## Whats new in 2.1</a>
* This minor release fixes duplicate service calls for initializing an AccessoryInformation device, Television & TelevisionSpeaker.

Mostly importantly it wipes out 5600 duplicate lines of code to one bound function.

<a name="Whats-new-in-2-0">## Whats new in 2.0</a>
* 2This release changes the philosophy of homebridge-Cmd4 from Accessories that have known characteristics as per the HAP Spec to assigning any characteristic to any Accessory.

There are 160 possible characteristics, 60 more than the previous version.  Also TV, TV Speaker, Input Source, Irrigation, Faucets and many other accessories are now available.
