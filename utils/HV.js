'use strict';

const constants = require( "../cmd4Constants" );

// These would already be initialized by index.js
let CMD4_DEVICE_TYPE_ENUM = require( "../lib/CMD4_DEVICE_TYPE_ENUM" );

class HV
{
   constructor ()
   {
      this.allowTLV8 = constants.DEFAULT_ALLOW_TLV8;
      this.debug = constants.DEFAULT_DEBUG;
      this.outputConstants = constants.DEFAULT_OUTPUTCONSTANTS;
      this.interval = constants.DEFAULT_INTERVAL;
      this.stateChangeResponseTime = constants.DEFAULT_STATE_CHANGE_RESPONSE_TIME;
      this.statusMsg = constants.DEFAULT_STATUSMSG;
      this.timeout = constants.DEFAULT_TIMEOUT;

      this.stateChangeResponseTimeHasBeenUpdated = false;
   }

   update( entity )
   {
      // Heirarchy Next the Device Properties
      if ( entity.typeIndex != undefined &&
           this.stateChangeResponseTimeHasBeenUpdated == false )
      {
         this.stateChangeResponseTime = CMD4_DEVICE_TYPE_ENUM.properties[ entity.typeIndex ].devicesStateChangeDefaultTime;
      }

      // FakeGato Hierarchy
      if ( entity.storage != undefined )
         this.storage = entity.storage;
      if ( entity.storagePath != undefined )
         this.storagePath = entity.storagePath;
      if ( entity.folder != undefined )
         this.folder = entity.folder;
      if ( entity.keyPath != undefined )
         this.keyPath = entity.keyPath;

      // Heirarchy
      if ( entity.allowTLV8 != undefined )
         this.allowTLV8 = entity.allowTLV8;


      if ( entity.debug != undefined )
           this.debug = entity.debug;
      if ( entity.definitions != undefined )
           this.definitions = entity.definitions;
      if ( entity.interval != undefined )
           this.interval = entity.interval;
      if ( entity.outputConstants != undefined )
           this.outputConstants = entity.outputConstants;
      if ( entity.queueTypes != undefined )
           this.queueTypes = entity.queueTypes;
      if ( entity.stateCmd != undefined )
           this.stateCmd = entity.stateCmd;
      if ( entity.state_cmd_prefix != undefined )
           this.state_cmd_prefix = entity.state_cmd_prefix;
      if ( entity.stateCmdSuffix != undefined )
           this.state_cmd_suffix = entity.state_cmd_suffix;
      if ( entity.stateChangeResponseTime != undefined )
      {
           this.stateChangeResponseTimeHasBeenUpdated = true;
           this.stateChangeResponseTime = entity.stateChangeResponseTime;
      }
      if ( entity.statusMsg != undefined )
           this.statusMsg = entity.statusMsg;
      if ( entity.timeout != undefined )
           this.timeout = entity.timeout;
   }

}

module.exports = HV;
