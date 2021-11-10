# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
### 6.0.2 (2021-11-10)

##### Bug Fix

*  Schema Prep - For Homebridge-ui schema must have defined keys ([3053780b](https://github.com/ztalbot2000/homebridge-cmd4/commit/3053780b40eb3d4505dc407411257109977688a1))

# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
#### 6.0.1 (2021-11-07)

##### Bug Fixes

*  For bug[#116](https://github.com/ztalbot2000/homebridge-cmd4/pull/116) remove stateCmd validation and for AirCon add global const parsing ([e7bc4963](https://github.com/ztalbot2000/homebridge-cmd4/commit/e7bc49630c47d16d296ff9751df7c7666cf2ecd3))


# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
## 6.0.0 (2021-10-01)

##### New Features

- When Cmd4 was first implemented, I tried to be considerate in allowing either lower or upper case key/value pairs. Unfortunately as Homebridge has evolved and to use homebridge-ui you require a config-schema.json which accurately describes the Cmd4 Schema.  This is impossible to achieve when the key/value pairs can be either lower or upper case; Especially when Cmd4 supports so many characteristics and devices.
- To this end; Cmd4 Version 6 will be the version that prepares you for the change by *Warning* you that your config.json needs to be corrected. The duration of this preparatory stage will be pretty generous as I am still working on the config-schema.json integration with Homebridge-ui.  I had to stop when it became evident what changes were required for Homebridge-ui integration.

Here are the rules / changes:
1. No script changes are required. Cmd4 still sends: Get/Set <DeviceName>  <Upper Case Characteristic Type > < value >
2. Constants are still fully capitalized. i.e.  "statusFault": "NO_FAULT"  or  "category": "TELEVISION"
3. As before Device Types start with an upper case.  i.e.  "type": "Television"
4. Cmd4 directives and characteristics start with lower case:  i.e.   "polling": [ { "characteristic": "volume", "interval": 10 }]
5. For advanced devices like the AirCon, Queue types remain the same:
   i.e.   queueTypes: [ { "queueName": "MyQueue", "queueType": "WoRm" }]

Finally
   I tried to make the warnings very explict for what the correction should be and believe me; I am more sorry to have
   to do this than you may think.

   Thank you,
   John Talbot


*  Schema Prep - Found in Beta Check case of type ([9a394de0](https://github.com/ztalbot2000/homebridge-cmd4/commit/9a394de020b2ccf67a9c30194163807ea3a226a9))
*  Schema Prep - More documentation changes ([c6d68f1f](https://github.com/ztalbot2000/homebridge-cmd4/commit/c6d68f1f8a7c24e786a54dbf1660dba98a5d1b6a))
*  Schema Prep - Documentation changes for feat ([5be7393d](https://github.com/ztalbot2000/homebridge-cmd4/commit/5be7393d4b722c602862a382b1bd710556ff196a))
*  Schema Prep. More fakegato testing, Make cmd4Dbg not be file global scope ([50355797](https://github.com/ztalbot2000/homebridge-cmd4/commit/503557973758fd4103ab13f34680a4f08eaed3c2))
*  Schema Prep - for fakegato and others, correct key/value pair the first time it is found ([335ca7e5](https://github.com/ztalbot2000/homebridge-cmd4/commit/335ca7e50958a089c21bfac61ee1982756b7965b))
*  Schema Prep - Make sure fakegato characteristics are correct ([a8274c7a](https://github.com/ztalbot2000/homebridge-cmd4/commit/a8274c7adb9ffdc2c34d048057f8334d6da9ef8a))
*  Schema Prep - Should save by index, like others ([20872e2b](https://github.com/ztalbot2000/homebridge-cmd4/commit/20872e2b0f8a5c52131bb9247ba6e6ae11b20fb4))
*  Schema-Prep This works with all lower case, still sends Get/Set upper case ([d3764584](https://github.com/ztalbot2000/homebridge-cmd4/commit/d3764584f5e0faf369490ad85ed16ba3f19e41c8))
*  Schema Prep - constants are now lower case and the input is lowered instead ([03b232a1](https://github.com/ztalbot2000/homebridge-cmd4/commit/03b232a152a622025ccfe7c6dc32ab3fa59d6df2))
*  New tset tool to check where constant is defined ([4fc3668a](https://github.com/ztalbot2000/homebridge-cmd4/commit/4fc3668ad0e1fe51dde4a32ef83f3c78584f4e91))
*  Schema Prep - Change variables to lower case, still check for Upper case ([2b8f4bf7](https://github.com/ztalbot2000/homebridge-cmd4/commit/2b8f4bf768d1c7aebb3c45f6b019de8201c1656e))
*  Schema prep- Change constants to an object ([f0dd0de9](https://github.com/ztalbot2000/homebridge-cmd4/commit/f0dd0de923c12fe6dd52cf5469ff87b2d762ee37))
*  Continue Schema Prep.  Cmd4Storage is now referenced accordingly ([79d85b01](https://github.com/ztalbot2000/homebridge-cmd4/commit/79d85b01bac8d1d3a79a407bcbec0163f19f4e4d))
*  Schema Prep. FakeGato simplification ([fd26104b](https://github.com/ztalbot2000/homebridge-cmd4/commit/fd26104b0d9c35a53209e91b3efb9ccf820c0333))
*  Prep for Schema. Stored data now version controlled and assoc array class ([59d7a229](https://github.com/ztalbot2000/homebridge-cmd4/commit/59d7a22903fbb95b4e1b55a7fca4629960c89bfe))
*  Prep for schema. Warn keys must be lower case ([fe3c155c](https://github.com/ztalbot2000/homebridge-cmd4/commit/fe3c155c5b00574ca3b03baf6d3a32f942756988))
*  "Prep for Schema. Unclutter namespace" ([12a63fb5](https://github.com/ztalbot2000/homebridge-cmd4/commit/12a63fb5339f346b31702bc2f52aa60f299c0de4))

##### Bug Fixes

*  Unit testing order is relevant. Add --bail for sanityTests ([3d3eb844](https://github.com/ztalbot2000/homebridge-cmd4/commit/3d3eb844499c768efbbfdbda88f2164b276e927e))
*  missed with last update ([2282996c](https://github.com/ztalbot2000/homebridge-cmd4/commit/2282996c5056a1b37edc998766e29c90a74f2cfb))
*  The warning should read Capitalized, not Upper case ([9b7f7957](https://github.com/ztalbot2000/homebridge-cmd4/commit/9b7f7957613c2c36cb61c86d1f66b3bfa34d49fc))
*  Found in demo mode, polling for default characteristics was attempted ([01960b73](https://github.com/ztalbot2000/homebridge-cmd4/commit/01960b73c696d788ea06469c5749da2272662e55))
*  For Demo mode, Target states must be defined so warning is not shown ([a1e00e3f](https://github.com/ztalbot2000/homebridge-cmd4/commit/a1e00e3f84e80300c190b50473ee44026bfe42bc))
*  Testing Prep Schema fix. Added unit test so will not happen again ([85ab69f7](https://github.com/ztalbot2000/homebridge-cmd4/commit/85ab69f7c366d2ab37ffe76c9eda7ba0d480e3d1))


