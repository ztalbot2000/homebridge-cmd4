# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
### 3.3.0 (2021-03-13)

##### New Features

*  Now that polling uses updateValue, polling can be independent of fetch ([b3ca7f0](https://github.com/ztalbot2000/homebridge-cmd4/commit/b48d88b66ef1a715d347c6a712aee0a927f48741))
*  Polling now calls updateValue ([9c75b069](https://github.com/ztalbot2000/homebridge-cmd4/commit/9c75b0692ea687559a112269bdfa09fef5568e2e))
*  Double check for polling or services not being created twice ([2d856289](https://github.com/ztalbot2000/homebridge-cmd4/commit/2d85628996fc3702b5b309754a6bde25dc95f605))
*  Change to RUNNING_CHANGELOG for Homebeidge-UI bug that cannot follow inline URLs ([13e57946](https://github.com/ztalbot2000/homebridge-cmd4/commit/13e57946c187424f8bef4deb8b28860ba3276330))
* Stagger Polling Starts ([1e144e9c](https://github.com/ztalbot2000/homebridge-cmd4/commit/1e144e9c027f3b0dc353b0bd1c2edd2819712654))

##### Bug Fixes

*  properly handle removed platform accessories from cache ([2ce2e9a3](https://github.com/ztalbot2000/homebridge-cmd4/commit/2ce2e9a31030e1f931bc28ae2c55eca59d0c8899))
*  Globally allow statusMsg option to be set ([cc173514](https://github.com/ztalbot2000/homebridge-cmd4/commit/cc17351407005926a9c3b218f889727b1fb852ef))
*  transposing constants to strings and add subType to clarify accessory services ([99d69cec](https://github.com/ztalbot2000/homebridge-cmd4/commit/99d69cec5eb1902f0429a6a84276571fbe6e298a))
*  use cross spawn instead of exec ([ab51b8dd](https://github.com/ztalbot2000/homebridge-cmd4/commit/ab51b8dd9b9a543d222d22f54348b06ff901d011))


##### Tests

*  Test all constants, just in case accidentally changed ([b3ca7f07](https://github.com/ztalbot2000/homebridge-cmd4/commit/b3ca7f07a20d25750e10dee5e0b533dd6f7393fb))


