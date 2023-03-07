# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
#### 7.0.0 (2023-03-05)

* The reason for the major version numbering update was to for deprecation warnings to throw an error.
  These warnings were there for many major versions and are finally removed.

  "queueInterval"         - Never put into production and will now throw an error.
  "queueMsg"              - Never put into production and will now throw an error.
  "queueStatMsgInterval"  - Never put into production and will now throw an error.
  "cmd4_Mode"             - Obsolete for many versions and will now throw an error.
  "storage"               - Obsolete outside of fakegato definition.
  "storagePath"           - Obsolete outside of fakegato definition.
  "folder"                - Obsolete outside of fakegato definition.
  "keyPath"               - Obsolete outside of fakegato definition.
  "queueTypes"            - Obsolete inside accessory definition.


##### New Features

*  add retries. Also formatting issues ([b8ddf9ce](https://github.com/ztalbot2000/homebridge-cmd4/commit/b8ddf9ceda8ace3a6e820bfad0c4a03c656cf419))

##### Documentation Changes

Beta2
*  Update documentation for v7.0.0 ([12b6482a](https://github.com/ztalbot2000/homebridge-cmd4/commit/12b6482ac8e6d431e011f6f92c2d6f03a2ebe2ed))

##### Bug Fixes

Beta2
*  remove unwanted debug message and test so that it cannot reoccur ([97b6b318](https://github.com/ztalbot2000/homebridge-cmd4/commit/97b6b31861ab34d04b798ec409b1f2e8c56244c2))
*  Homebridge does not like underscores of accessory names. Remove from default config.json ([15f2170b](https://github.com/ztalbot2000/homebridge-cmd4/commit/15f2170be492b6dfb56e4eed5d76da0cd4d74419))

Beta1
*  retry logging starts from zero, but for user count starts from 1 ([38cdf417](https://github.com/ztalbot2000/homebridge-cmd4/commit/38cdf417feebeef2b75dcfec247e6bdfd4739604))
*  By nature retryCount should start from zero ([b8e82ffe](https://github.com/ztalbot2000/homebridge-cmd4/commit/b8e82ffe262c092a301636993544be828a7a34a4))
*  log message in wrong quotes ([6fc555b0](https://github.com/ztalbot2000/homebridge-cmd4/commit/6fc555b0d7bdc20bfc3a38310e3d4f66b968d55d))
*  retries for WoRm should be zero. Can be overriden ([11351633](https://github.com/ztalbot2000/homebridge-cmd4/commit/1135163319c8d16e3886dbf0a0443ba5ed6c4b99))
*  Accessory needs to go unresponsive via updateValue with error object ([cdfee1b2](https://github.com/ztalbot2000/homebridge-cmd4/commit/cdfee1b22ea21dc56edc320768ec6ebea1156cb8))

##### Tests

*  put back skipped tests ([0b0781fa](https://github.com/ztalbot2000/homebridge-cmd4/commit/0b0781faec7f94e43d67068e15e9505cc7c96414))
*  Remove excess debug messages for commit with verify to work ([ea108470](https://github.com/ztalbot2000/homebridge-cmd4/commit/ea108470631f4abe3377f6d582c962dab141be0f))
*  Don't know why HomeKit does not cause Cmd4 to generate a log that it is trying to reconnect after unavailable ([d45d7c09](https://github.com/ztalbot2000/homebridge-cmd4/commit/d45d7c095d0989c05b88c161a418402711e26677))
*  Add unit testing to prove fix of bug[#130](https://github.com/ztalbot2000/homebridge-cmd4/pull/130) ([e9a902fc](https://github.com/ztalbot2000/homebridge-cmd4/commit/e9a902fcb01fb2ee7c7cb9f2b60e036d0fd5c0d6))


