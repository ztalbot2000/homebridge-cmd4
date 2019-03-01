#!/bin/bash

# Notes
# 1) This script is called as defined by the config.json file as:
#    "state_cmd": "bash .homebridge/Cmd4Scripts/PS4.sh"
#    $1 = 'Get'
#    $2 = <Device name>    DO NOT USE SPACES IN DEVICE NAME. IT SCREWS UP COMMAND LINE PARSING
#    $3 = <Characteristic>
#    $4 = <Device option>
#
# 2) For a set of On, the command issued would be:
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS_4 On false
#       or
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Set PS_4 On true
#
# 3) For a Get of On, the command issued would be:
#    bash $HOME/.homebridge/Cmd4Scripts/PS4.sh Get PS_4 On
#  
#    Homebridge-cmd4 will interpret the result of false to be 1
#    and true to be 0



# echo "\$1='$1' \$2='$2' \$3='$3' \$4='$4'"

if [ "$1" = "Get" ]; then
   # This line is commented out and would be
   # interchangeable with ps4-waker. It is here
   # as an example
   # ps4-waker search | grep -i '200 Ok'
   cat /tmp/fileVariableHolder
   rc=$?
   if [ "$rc" = "0" ]; then
      exit 0
   else
      echo "failed"
      exit -1
   fi
fi

if [ "$1" = "Set" ]; then
   if [ "$3" = "On" ]; then
      if [ "$4" = "true" ]; then
         # This line is commented out and would be
         # interchangeable with ps4-waker. It is here
         # as an example
         # ps4-waker
         echo $4 > /tmp/fileVariableHolder
         exit $?
      else
         # This line is commented out and would be
         # interchangeable with ps4-waker. It is here
         # as an example
         # ps4-waker standby
         echo $4 > /tmp/fileVariableHolder
         exit $?
      fi
   fi
fi

exit -1

