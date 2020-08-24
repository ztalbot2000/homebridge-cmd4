#!/bin/bash

#
# This Cmd4 example demonstrates a script that can be used for a wakeonlan
# scenario. It is a port of the cmdSwitch2 example and is more for a Windows
# PC.
#
# Your Cmd4 .homebridge/.config.json file would have a state_cmd like:
# state_cmd: ".homebridge/Cmd4Scripts/Examples/wakeonlan.sh"
# state_cmd_suffix: "192.168.2.66 dc:a6:32:40:de:7c"
#
#
# Testing from the shell prompt:
#    ./wakeonlan.sh Get HTPC On 192.168.2.66 dc:a6:32:40:de:7c
#    or
#    ./wakeonlan.sh Set HTPC On 1 192.168.2.66 dc:a6:32:40:de:7c
#    or
#    ./wakeonlan.sh Set HTPC On 0 192.168.2.66 dc:a6:32:40:de:7c

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the first parameter to this script was "Get" for getting an accessory's
# specific attribute.
if [ "$1" = "Get" ]; then

   # Cmd4 will pass the IP in the config.json defined by state_cmd_suffix as the fourth
   # parameter to a Get command.
   ip="${4}"

   # Cmd4 will pass the MAC Address in the config.json defined by state_cmd_suffix as the fifth
   # parameter to a Get command.
   macAddress="${5}"

   # Normally we would exit immediately if a command fails with a non-zero status.
   # In this case ping can fail and we would rely on the failing exit status to
   # tell Cmd4 that the accessory is not on the network. That would be the prefered
   # thing to do. However for this example we are going to output '0' (false) so
   # that you can see the '0' on the console telling us that the accessory is not
   # on the network.
   set +e

   # On OSX the string is returned differently than on linux.
   ping -c 2 -W 1 "${ip}" | sed -E 's/2 packets received/2 received/g' | grep -i '2 received' >> /dev/null
   rc=$?

   # Exit immediately if a command exits with a non-zero status
   set -e

   # Check if we got the message '2 packets recieved' meaning the accessory is
   # on the network by seeing if the return code of the above command passed or
   # failed.
   if [ "$rc" = "0" ]; then
      # The message was recieved so the target is up, sending a '1' (true), like
      # a binary number is, back to Cmd4.
      echo "1"

      # Exit this script positivitely.
      exit 0
   else
      # The message was not recieved so the target must be down, sending a '0' (false), like
      # a binary number is, back to Cmd4.
      echo "0"

      # Exit this script positivitely, even though ping failed.
      exit 0
   fi
fi

# Check if the first parameter to this script was "Set" for setting an accessory's
# specific attribute.
if [ "$1" = "Set" ]; then

   # $2 would be the name of the accessory.
   # $3 would be the accessory's charactersistic 'On'.
   # $4 would be '1' for 'On' and '0' for 'Off', like a binary number is.
   # $4 would be 'true' for 'On' and 'false' for 'Off' with
   # outputConstants=true in your .homebridge/.config.json file.

   # Cmd4 will pass the IP in the config.json defined by state_cmd_suffix as the fifth
   # parameter to a Set command.
   ip="${5}"

   # Cmd4 will pass the MAC Address in the config.json defined by state_cmd_suffix as the sixth
   # parameter to a Set command.
   macAddress="${6}"

   # Handle the Set 'On' attribute of the accessory
   if [ "$3" = "On" ]; then

      # If the accessory is to be set on
      if [ "$4" = "1" ]; then
         # Execute the on command
         wakeonlan -i ${ip} ${macAddress} >> /dev/null 2>&1

         # keep the result of the on/off command
         rc=$?
      else
         # Execute the off command
         # The password is harad coded here. We use the default
         # Raspberry Pi password asli an example. How you handle
         # this unencrypted password is up to you. Note that
         # this command only works to a Windows box, but is the
         # exmple given in cmdSwitch2.
         # net rpc shutdown -I "${ip}" -U user%password,
         net rpc shutdown -I "${ip}" -U pi%raspberry >> /dev/null 2>&1

         # keep the result of the on/off command
         rc=$?
      fi

      # Check if the on/off command had a positive return status.
      if [ "$rc" = "0" ]; then

         # The on/off command was successful, so exit successfully.
         exit 0

      else
         # The on/off comand had a failure result. Exit with that result.

         # Exit this script positivitely, even though ping failed.
         exit $rc
      fi
   fi
fi

# The proper arguments to this script were not passed to it so end with a failure exit status.
exit 66
