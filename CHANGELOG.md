# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
## 4.2.0 (2021-07-24)

##### New Features

*  For Queue (AirCon) ignore low priority polling failure messages ([f431e410](https://github.com/ztalbot2000/homebridge-cmd4/commit/f431e410acefc2025473475c7c986ec27994b4f8))

*  Regular polling uses low priority queue, removing duplicate code ([70e53e73](https://github.com/ztalbot2000/homebridge-cmd4/commit/70e53e73fba0a4f5191e850324361b6462c5e33b))

##### Bug Fixes

*  For performance Cmd4 was to call the callback to IOS before the Queue ([7d957daf](https://github.com/ztalbot2000/homebridge-cmd4/commit/7d957daf1f4afb9d1fbdb2ad2c81a04f2978f859))

* cross-spawn while maybe faster, fails killing timed out processes ([f12ad71](https://github.com/ztalbot2000/homebridge-cmd4/commit/f12ad7125711952d634b4226c23597d652a97d95))

* Differentiate messages for Queued polling ([fdf6e18](https://github.com/ztalbot2000/homebridge-cmd4/commit/fdf6e186852ad74ed8bb32717de721601000a482))

* Update unit tests for recent changes ([8940795](https://github.com/ztalbot2000/homebridge-cmd4/commit/894079596bace540d174927fd1e593d47f455f99))

* Performance improvement, dont transpose values from homebridge ([c735ef2](https://github.com/ztalbot2000/homebridge-cmd4/commit/c735ef27303aa642ecfe8585d219045e2b53782e))

##### Testing

* Common unit testing messages ([b214fa8](https://github.com/ztalbot2000/homebridge-cmd4/commit/b214fa8cf6bee71bd854dc1f24f901b1dab8e466))
