#!/bin/bash
result=$(node .homebridge/Cmd4Scripts/State.js $* 2>&1)
echo $( date ) >> /tmp/Cmd4.log
echo $* >> /tmp/Cmd4.log
echo $result | tee -a /tmp/Cmd4.log
