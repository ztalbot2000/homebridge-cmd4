# Homebridges-cmd4 - Advanced Trouble Shooting.

## Table of Contents
* [**About Advanced Trouble Shooting**](#about-advanced-trouble-shooting)
* [**The #1 Thing to Remember**](#the-1-thing-to-remember)
* [**The Parameters sent by Cmd4**](#the-parameters-sent-by-cmd4)
* [**Troubleshooting your own scripts**](#troubleshooting-your-own-scripts)
* [**Debug mode is your best friend**](#debug-mode-is-your-best-friend)
* [**Debugging Fakegato history**](#debugging-fakegato-history)
* [**Missing icons**](#missing-icons)
* [**Child process error message**](#child-process-error-message)
* [**License**](#license)

## About Advanced Trouble Shooting
&nbsp;&nbsp;&nbsp; Unlike Basic Trouble Shooting, this guide is more for those who are having problems with their own scripts and what problems can arise when integrating them with Cmd4.

## The #1 Thing to Remember
&nbsp;&nbsp;&nbsp; Cmd4 runs your script in the background *WITHOUT ANY ENVIRONMENT* defined. Any variables, alias, special paths are not seen by your script so even if you run the script from the command line and it works, it may not from within Cmd4. Create a bash session without any environment set up like Cmd4 does with the command:<BR>

```bash
   *SHELL*> env -i bash --noprofile --norc
```
<BR>
&nbsp;&nbsp;&nbsp; From within this environment test your script like:<BR>

```bash
   *SHELL*> node .homebridge/YourScriptHere.js Get My_Fan On
```

### The Parameters Sent by Cmd4
&nbsp;&nbsp;&nbsp; The second most important thing to remember is what Cmd4 sends for Get/Set requests. Your script must meet these requirements. These are defined as:<BR>

```
   Get < Accessory Name > < Characteristic >
   Set < Accessory Name > < Characteristic > < Value >
```

## Troubleshooting your own scripts

### Execute your script from the command line interface for *Get*
&nbsp;&nbsp;&nbsp; Remembering that Cmd4 executes your script in a No environment setting. First execute your scripts from the CLI.<BR>

```bash
*SHELL*> env -i bash --noprofile --norc
*SHELL*> <your script path> Get < Accessory Name > < Characteristic >
```
<BR>
The script must output a one word answer or multiple quoted words.<BR>
Note: Your script must also exit with a 0 return code.
<BR>
### Execute your script from the command line interface for *Set*
&nbsp;&nbsp;&nbsp;Your script must respond to the Set command.<BR>

```bash
   *SHELL*> env -i bash --noprofile --norc
   *SHELL*> <your script path> Set < Accessory Name > < Characteristic > < value >
```
<BR>
Note: Your script must also exit with a 0 return code.

### Debug mode is your best friend
&nbsp;&nbsp;&nbsp; As with Basic Troubleshooting, if your script passes at the CLI, run homebridge in debug mode:<BR>

```bash
   *Shell>* DEBUG=* homebridge -D
```

## Debugging Fakegato history
See [fakegato-history](https://github.com/simont77/fakegato-history)

&nbsp;&nbsp;&nbsp; if you have added fakegato history, but no history is showing, there are things you can check.

### Step 1.  Check that the characteristic is polled.
&nbsp;&nbsp;&nbsp; Only polled characteristics are recorded. For history to be collected you will have to enable polling and interval for the accessory, and according to the fakegato-history documents it should be less than 10 minutes (600 seconds). The new polling config section allows for each characteristic to be polled at their individual times. Check your config.json for this setup. An example of polling is:
```json
"polling": [{"currentHeatingCoolingState": 0,
             "interval": 540,  "timeout": 4000},
            {"currentTemperature": 50.0,
             "interval": 60,   "timeout": 4000}
           ],
```

### Step 2.  Check the fakegato logs.
&nbsp;&nbsp;&nbsp; The storagePath stores the history records. If there are no logs, run Cmd4 in Debug mode to see if the records are being created.

### Step 3.  Check your fakegato configuration.
&nbsp;&nbsp;&nbsp; In the following configuration, the value polled for the characteristic "currentTemperature" will be used for the designation "currentTemp".  Similarly the value polled for the characteristic "targetTemperature" will be used for the designation "setTemp". This follows the fakegato-history spec and this model is used for the other fakegato-history records.

```json
"fakegato":{"eve":"thermo",
            "currentTemp": "currentTemperature",
            "setTemp": "targetTemperature",
            "valvePosition": "0",
            "storage": "fs",
            "storagePath": ".homebridge/FakegatoStorage",
            "folder": "folderName",
            "keyPath": "/place/to/store/my/keys/"
           }
```

Note: The value "0" should be used for any characteristics value which is not possible to retrieve.

## Missing icons
&nbsp;&nbsp;&nbsp;IOS 14 added a new category characteristic to give a hint to any GUI of which icon to use. The big impact was found in missing icons for Televisions. For Televisions you must add:<BR>

```json
"category": "TELEVISION"
```
This category only takes effect for Platform Accessories.


## Child process error message
&nbsp;&nbsp;&nbsp; If you happen to see this error message:<BR>
```
  Error: Command failed: /homebridge/Server.sh Get 'Server' 'On'

    at ChildProcess.exithandler (child_process.js:297:12)
    at ChildProcess.emit (events.js:193:13)
    at maybeClose (internal/child_process.js:1001:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:266:5)
  killed: true
  code: null
  signal: SIGTERM,
  cmd: "/homebridge/Server.sh Get Server On"

  ```

The command may not exist, but also the timeout value in your config.json for that accessory may be too low.


## License
See [LICENSE](https://github.com/ztalbot2000/homebridge-cmd4/blob/master/LICENSE)



<!---
Link References (Not Local)
-->

[homebridge]:https://github.com/nfarina/homebridge
[ztalbot2000]:https://github.com/ztalbot2000
