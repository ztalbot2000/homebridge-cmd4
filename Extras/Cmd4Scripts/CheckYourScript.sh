#!/bin/bash --noprofile --norc

# Fun colour & cursor stuff
TCR=$(tput cr)
TCLR=$(tput clear)
TBLD=$(tput bold)
TNRM=$(tput sgr0)
TBLK=$(tput setaf 0)
TRED=$(tput setaf 1)
TGRN=$(tput setaf 2)
TYEL=$(tput setaf 3)
TBLU=$(tput setaf 4)
TMAG=$(tput setaf 5)
TCYN=$(tput setaf 6)
TWHT=$(tput setaf 7)

# OS type for flavours of different commands (like date on OSX)
case $(uname | tr '[:upper:]' '[:lower:]') in
  solaris*)
     date_cmd="date -u +%s.%N"
  ;;
  darwin*)
     # OSX does not have msec
     date_cmd="date -u +%s"
  ;; 
  linux*)
     date_cmd="date -u +%s.%N"
  ;;
  bsd*)
     date_cmd="date -u +%s.%N"
  ;;
  msys*)
     date_cmd="date -u +%s.%N"
  ;;
  *)
     echo "unknown: OSTYPE:$OSTYPE"
     exit -1
  ;;
esac

printf "${TCLR}"

if [ "${1}" = '-h' ]; then
   printf "${TBLU}Usage:${TNRM}"
   printf "${TNRM}  SHELL> cd \n"
   printf "${TNRM}  SHELL> bash --noprofile --norc \n"
   printf "\n"
   printf "${TBLU}Syntax:${TNRM}\n"
   printf "  ${TBLU}${0}${TNRM} 'full state command'\n"
   printf "${TBLU}i.e.${TNRM}\n"
   printf "  '.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bin/MyExec' 'Get' 'MyDevice' 'On'\n"
   printf "     or\n"
   printf "  '.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bash bin/YourScript.sh' 'Get' 'MyDevice' 'On'\n"
   printf "     or\n"
   printf "  '.homebridge/Cmd4Scripts/CheckYourScript.sh' 'bin/YourScript.sh 'Get 'MyDevice' 'On'\n"
   printf "\n"
   printf "Note: Add the '' around the command to prevent globbing, which is not done by homebridge-cmd4\n"
   exit 0
fi

# Processes are run from your home directory, so go there first.
cd "${HOME}"
printf "${TBLU}Changing to:${TNRM}'${HOME}' ${TBLU}where processes are run from${TNRM}\n"

# $HOME is expanded by the shell and not scripts, so do not rely on it.
unset HOME

printf "${TBLU}Enviroment in shell is limited to these variables:${TNRM}\n"
env

printf "\n"

printf "${TBLU}Command will be run from the directory: ${TNRM}${PWD}\n"

output=""
rc=0

if [ "$2" = 'Set' ] || [ "$3" = 'Set' ]; then
   printf "${TBLU}(Set) Cmd4 would execute:${TNRM} $* "
   printf "\n"

   start_time="$( $date_cmd )"
   output=$("$@")
   rc="$?"
   end_time="$( $date_cmd )"

   # The elapsed time (in microseconds)
   # We add 1 second as OSX does not have msec dates.
   # One second will make no difference, but might help a newbie.
   elapsed=( $(/usr/bin/bc <<<"($end_time-$start_time) * 1000 + 1000") ) 

   printf "\n"
   if [ $rc = 0 ]; then
      printf "${TGRN}Command passed with returned code:${TNRM}'${rc}'\n"
      if [ "${output}" != "" ]; then
         printf "Output: '${output}' would be ignored\n"
      fi
      printf "$TBLU}The timeout value should be at least :${TNRM} ${elapsed} (microseconds)\n"
      printf "$TBLU}Multiply by 5 for safety.${TNRM}\n"
   else
      printf "${TRED}Command given did not exit with a ${TNRM}0${TRED} return code and would fail in homebridge-cmd4 rc=${TNRM}'${rc}'\n"
      printf "Understand that the error given is a result of running your command in a basic shell environment.  Head the errors given\n"
   fi
else
   printf "${TBLU}(Get) Cmd4 would execute:${TNRM} $*"
   printf "\n"

   start_time="$( $date_cmd )"
   output=$("$@")
   rc="$?"
   end_time="$( $date_cmd )"

   # The elapsed time (in microseconds)
   # We add 1 second as OSX does not have msec dates.
   elapsed=( $(/usr/bin/bc <<<"($end_time-$start_time) * 1000 + 1000") ) 

   printf "\n"
   wordCount=0
   if [ $rc = 0 ]; then
      printf "${TGRN}Command passed with returned code:${TNRM}'${rc}'\n"
      printf "${TBLU}Output: of command was:${TNRM}'${output}'\n"
      wordCount=$(IFS=' '; set -f; set -- "${output}"; echo $#)
      if [ "${wordCount}" != '1' ]; then
         printf "${TYEL}Word count of output should only be 1, not ${TNRM}'${wordCount}'\n"
      fi
      printf "$TBLU}The timeout value should be at least :${TNRM} ${elapsed} (microseconds)\n"
      printf "$TBLU}Multiply by 5 for safety.${TNRM}\n"
   else
      printf "${TRED}Command given did not exit with a ${TNRM}0${TRED} return code and would fail in homebridge-cmd4 rc=${TNRM}'${rc}'\n"
      printf "Understand that the error given is a result of running your command in a basic shell environment.  Head the errors given\n"
   fi
fi


exit ${rc}
