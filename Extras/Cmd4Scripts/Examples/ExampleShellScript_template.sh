#!/bin/bash

#  ExampleScript_template.sh
#
# Description:
#   This script is a goood starting place for you to create Cmd4 Scripts
#   of your own
#
# Parameters are:
#    Get < any accessory name > < characteristic>
#    Set < any accessory name > < characteristic> < value >
#
# Note 1: These paramaters match the those of the Cmd4 plugin.
#         A full lost of supported devices and characteristics can be
#         found at:
#         https://ztalbot2000.github.io/homebridge-cmd4
#
# How it works:
#
#    The Cmd4 plugin will call this script to retrieve those states
#    you have defined as not Cached to Get/Set your devices characteristic
#    states.
#
#    For example:
#       bash ExampleScript_template.sh Set My_Door TargetDoorState 0
#     or
#       bash ExampleScript.sh Get My_Door CurrentDoorState
#

set -e

# Exit immediately for unbound variables.
set -u


length=$#
device=""
io=""
characteristic=""
option=""

if [ $length -le 1 ]; then
   printf "Usage: $0 Get < AccessoryName > < characteristic >\n"
   printf "Usage: $0 Set < AccessoryName > < characteristic > < Value >\n"
   exit -1
fi

# printf "args =$#\n"   # debug
# printf "arg1 =$1\n"   # debug

if [ $length -ge 1 ]; then
    io=$1
    # printf "io=$io\n"   # debug
fi
if [ $length -ge 2 ]; then
    device=$2
    # printf "device = ${device}\n"   # debug
fi
if [ $length -ge 3 ]; then
    characteristic=$3
    # printf "Characteristic = ${characteristic}\n"   # debug
fi
if [ $length -ge 4 ]; then
    option=$4
    # printf "option = ${option}\n"   # debug
fi

if [ "${io}" == "Get" ]; then
   case $characteristic in
      'CurrentDoorState')

         printf "0\n"          # Door is open

         # See https://ztalbot2000.github.io/homebridge-cmd4
         # For the possible values and characteristics
         # available per device. It will show somethink like:
         # Valid Values:
         # 0 - "Open. The door is fully open."
         # 1 - "Closed. The door is fully closed."
         # 2 - "Opening. The door is actively opening."
         # 3 - "Closing. The door is actively closing."
         # 4 - "Stopped. The door is not moving, and it is not fully
         #      open nor fully closed."
         # 5-255 - "Reserved"
         exit 0
         ;;
      'TargetDoorState')
         printf "0\n"
         exit 0
         ;;
      'ObstructionDetected')
         printf "0\n"
         exit 0
         ;;
      'LockCurrentState')
         printf "0\n"
         exit 0
         ;;
      *)
         printf "UnHandled Get ${device}  Characteristic ${characteristic}\n"
         exit -1
         ;;
    esac
fi
if [ "${io}" == 'Set' ]; then
   case $characteristic in
      'CurrentDoorState')
         # Current Door State is not settable. The
         # call would be to TargetDoorState. This is here
         # for debugging only.

         exit 0
         ;;
      'TargetDoorState')
         # Do something of your own here.
         exit 0
         ;;
      'ObstructionDetected')
         # Obstruction Detected is not settable. It
         # call is a read-only characteristic. This is here
         # for debugging only.
         exit 0
         ;;
      'LockCurrentState')
         # Lock Current State is not settable. It
         # call is a read-only characteristic. This is here
         # for debugging only.
         exit 0
         ;;
      *)
         printf "UnHandled Set GarageDoorOpenner Characteristic ${characteristic}"
         exit -1
         ;;
    esac
fi
printf "Unknown io command ${io}\n"
exit -1


