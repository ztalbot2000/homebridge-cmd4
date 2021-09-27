#!/bin/sh

#
# In this example we see a Raspberry Pi with a gpio pin that triggers
# a lock mechanism. The lock is momentary. You should configure the GPIO by executing:
#
# echo 24 > /sys/class/gpio/export
# echo "out" > /sys/class/gpio/gpio24/direction
#
# The corresponding config.json is
#
# {
#    "type": "LockMechanism",
#    "displayName": "Front Door",
#    "lockCurrentState": "SECURED",
#    "lockTargetState": "SECURED",
#    "name": "Front Door",
#    "manufacturer": "XYZ",
#    "model": "XYZ",
#    "serialNumber": "GPIO 24",
#    "polling": [
#        {
#            "characteristic": "lockCurrentState",
#            "interval": 5,
#            "timeout": 4900
#        },
#        {
#            "characteristic": "lockTargetState",
#            "interval": 5,
#            "timeout": 4900
#        }
#    ],
#    "stateChangeResponseTime": 0.2,
#    "state_cmd": "sh /homebridge/DoorLock.sh"
# }

#!/bin/sh

STATE_FILE="/dev/shm/DoorLock.state"

if [ ! -f "$STATE_FILE" ]; then
        echo 1 > $STATE_FILE
fi

STATE=$(cat $STATE_FILE)

if [ "$1" = "Get" ]; then
        case $3 in
                "LockCurrentState")
                        echo $STATE
                ;;
                "LockTargetState")
                        echo $STATE
                        echo 1 > $STATE_FILE
                ;;
        esac
        echo 0 > /sys/class/gpio/gpio24/value
        exit 0
fi

if [ "$1" = "Set" ]; then
        case $3 in
                "LockTargetState")
                if [ "$4" = "UNSECURED" ]; then
                        echo 0 > $STATE_FILE
                        echo 1 > /sys/class/gpio/gpio24/value
                        sleep 0.1
                fi
                ;;
        esac
        echo 0 > /sys/class/gpio/gpio24/value
        exit 0
fi

exit 66
