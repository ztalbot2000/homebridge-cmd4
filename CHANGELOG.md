# Homebridges-cmd4 - CMD4 Plugin for Homebridge - Supports ~All Accessory Types and now all Characteristics too!!
### 5.1.0 (2021-08-16)

##### New Features

As Part of V5 Performance/Optimization release, Cmd4 no longer calls process.exit that could take down the bridge if you had configured Cmd4 incorrectly.  Instead Cmd4 uses "throw" which is more widely acceptable.

*  Change from process.exit to throw new Error ([0a058100](https://github.com/ztalbot2000/homebridge-cmd4/commit/0a058100b1e7db9a6b94517a9d3de43c6568099f))
*  Change from process.exit to throw new Error ([203cc67a](https://github.com/ztalbot2000/homebridge-cmd4/commit/203cc67ad9305348e28aaef910966ac08776ff05))
*  Add PS5.sh as an example script ([9921cd29](https://github.com/ztalbot2000/homebridge-cmd4/commit/9921cd296a040ec2257c867d689e32a2d045cf7b))


#### 5.0.0 (2021-08-07)

*  V5 Optimize features, found some older code still to remove ([c52884b](https://github.com/ztalbot2000/homebridge-cmd4/commit/c52884bee08352723debef95f0c5169ebb8cbabb))

*  v5 Simplify, Restart Recover is now always done ([827e8a1](https://github.com/ztalbot2000/homebridge-cmd4/commit/827e8a10763c3ef062f55cb9be108727b0730cc0))

*  v5.0 Simplify - Only 1 start polling message ([ac84270](https://github.com/ztalbot2000/homebridge-cmd4/commit/ac842705385ad8d9699cdf98fd84c6737a36c888))

*  v5.0 Simplification, Remove unused QUEUEMSG ([f25dac8](https://github.com/ztalbot2000/homebridge-cmd4/commit/f25dac86b42ca603f3c0461455f1b2770b59689d))

*  v5.0 Optimize to best config ([120f2a9](https://github.com/ztalbot2000/homebridge-cmd4/commit/120f2a9c3ec2eafb05c051b29e3efe7b1bfdd1f6))

*  v5.0 Deprecate Cmd4Mode ([58d8323](https://github.com/ztalbot2000/homebridge-cmd4/commit/58d832301fc58a054646ae87ecf178a5d83aab83))

*  v5.0 Optimize ([e41eca2](https://github.com/ztalbot2000/homebridge-cmd4/commit/e41eca2eaaf56a2605f564085f6df11111eecf82))


