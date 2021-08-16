#!/bin/bash

#
# This Cmd4 script uses playactor to turn on/off a PS5.
#
# You will need to install playactor and have the command in a global PATH
# or modify this script with its actual PATH.
#
# Your Cmd4 .homebridge/.config.json file would have a state_cmd like:
# state_cmd: ".homebridge/Cmd4Scripts/Examples/PS5.sh"
#
# Testing from the shell prompt:
#    ./PS5.sh Get PS5 On
#    or
#    ./PS5.sh Set PS5 On 1
#    or
#    ./PS5.sh Set PS5 On 0


set -e

# Exit immediately for unbound variables.
set -u

# Passed in Args
length=$#
device=""
io=""
characteristic=""


if [ $length -le 2 ]; then
   echo "Usage: $0 Get < AccessoryName > < characteristic >"
   echo "Usage: $0 Set < AccessoryName > < characteristic > < Value >"
   exit 199
fi


if [ $length -ge 1 ]; then
    io=$1
fi
if [ $length -ge 2 ]; then
    device=$2
fi
if [ $length -ge 3 ]; then
    characteristic=$3
fi


# For "Get" Directives
if [ "$io" = "Get" ]; then
   case "$characteristic" in

      On )

         # Normally we would exit immediately if a command fails with a non-zero status.
         # In this case playactor can fail and we would rely on the failing exit status to
         # tell Cmd4 that the accessory is not on the network. That would be the prefered
         # thing to do. However for this example we are going to output '0' (false) so
         # that you can see the '0' on the console telling us that the accessory is not
         # on the network.
         set +e

         # Check if we got the message '200 OK' meaning the accessory is
         # on the network by seeing if the return code of the above command passed or
         # failed.
         playactor check | grep -i '200 Ok'>> /dev/null 2>&1
         rc=$?
         set -e

         if [ "$rc" = "0" ]; then
            # The message was recieved so the target is up, sending a '1' (true), like
            # a binary number is, back to Cmd4.
            stdbuf -o0 -e0 echo 1
            exit 0
         else
            # The message was not recieved so the target must be down, sending a '0' (false), like
            # a binary number is, back to Cmd4.
            stdbuf -o0 -e0 echo 0
            exit 0
         fi
         ;;
      *)
         echo "Unhandled Get characteristic $characteristic" >&2
         exit 109
         ;;
   esac
fi

# For "Set" Directives
if [ "$io" = "Set" ]; then
   value="1"
   if [ $length -ge 4 ]; then
      value=$4
   else
      echo "No value specified for set" >&2
      exit 199
   fi

   case "$characteristic" in
      On )
         # Normally we would exit immediately if a command fails with a non-zero status.
         # In this case playactor can fail and we would rely on the failing exit status to
         # tell Cmd4 that the accessory is not on the network. That would be the prefered
         # thing to do. However for this example we are going to output '0' (false) so
         # that you can see the '0' on the console telling us that the accessory is not
         # on the network.
         set +e

         if [ "$value" = "1" ]; then

             # Execute the on command
            sudo playactor wake

            exit 0
         else
             # Execute the off command
            sudo playactor standby

            exit 0
         fi
         ;;
      *)
         echo "Unhandled Set characteristic $characteristic" >&2
         exit 109
         ;;
   esac
fi


echo "Unhandled $io $device $characteristic" >&2

exit 150
