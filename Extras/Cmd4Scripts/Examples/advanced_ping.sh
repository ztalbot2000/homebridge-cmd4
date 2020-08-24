#!/bin/sh

#
# This Cmd4 example demonstrates a little more advanced way of using ping to test if an
# accessory is on the network by passing in the IP address to be used with the Cmd4 option
# of state_cmd_suffix.
#
# Your Cmd4 .homebridge/.config.json file would have a state_cmd like:
# state_cmd: ".homebridge/Cmd4Scripts/Examples/ping.sh"
# state_cmd_suffix: "192.168.2.1"
#
# Testing from the shell prompt:
#    ./advanced_ping.sh Get My_TV On 192.168.2.1
#    or
#    ./advanced_ping.sh Set My_TV On 1 192.168.2.1

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the first parameter to this script was "Get" for getting an accessory's
# specific attribute.
if [ "$1" = "Get" ]; then

   # Cmd4 will pass the IP in the config.json defined by state_cmd_suffix as the fourth
   # parameter to a Get command.
   ip="${4}"

   # Normally we would exit immediately if a command fails with a non-zero status.
   # In this case ping can fail and we would rely on the failing exit status to
   # tell Cmd4 that the accessory is not on the network. That would be the prefered
   # thing to do. However for this example we are going to output '0' (false) so
   # that you can see the '0' on the console telling us that the accessory is not
   # on the network.
   set +e

   # $2 would be the name of the accessory
   # $3 would be the accessory's charactersistic 'On'
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

   # This ping script does not do anything for set so just exit successfully.
   exit 0
fi

# The proper arguments to this script were not passed to it so end with a failure exit status.
exit 66
