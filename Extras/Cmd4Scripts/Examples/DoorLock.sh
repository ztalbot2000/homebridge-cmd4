#!/bin/sh

#
# In this example we see a Raspberry Pi with a gpio pin that triggers
# a lock mechanism.  The lock is momentary.  The corresponding config.json is
#
# {
#    "type": "LockMechanism",
#    "displayName": "Haustür",
#    "lockCurrentState": "SECURED",
#    "lockTargetState": "SECURED",
#    "name": "Haustür",
#    "polling": [
#       {
#          "lockTargetState": "UNSECURED",
#          "interval": 1,
#          "timeout": 500
#       }
#    ],
#    "stateChangeResponseTime": 1,
#    "state_cmd": "sh .homebridge/DoorLock.sh"
# }

if [ "$1" = "Get" ]; then
   case $3 in
      "LockCurrentState")
         echo 1
      ;;
      "LockTargetState")
         echo 1
      ;;
   esac
   exit 0
fi

if [ "$1" = "Set" ]; then
   case $3 in
      "LockTargetState")
      if [ "$4" = "0" ]; then
         # Set "LockTarget to 1"
         echo 1 > /sys/class/gpio/gpio24/value
         sleep 0.1
         # Set "LockTarget to 0"
         echo 0 > /sys/class/gpio/gpio24/value
      fi
      ;;
   esac
   exit 0
fi

exit 66
