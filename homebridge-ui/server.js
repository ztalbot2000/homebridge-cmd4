/* jshint node: true,esversion: 9, -W014, -W033 */
/* eslint-disable new-cap */
'use strict'

const { HomebridgePluginUiServer } = require('@homebridge/plugin-ui-utils');
//const { RequestError } = require('@homebridge/plugin-ui-utils');
const fs = require('fs')

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
//const constants = require( "../cmd4Constants" );


// These would already be initialized by index.js
let CMD4_ACC_TYPE_ENUM = require( "../lib/CMD4_ACC_TYPE_ENUM" );
let CMD4_DEVICE_TYPE_ENUM = require( "../lib/CMD4_DEVICE_TYPE_ENUM" );


//orig const { AuthorizationCode } = require('simple-oauth2');

class UiServer extends HomebridgePluginUiServer
{
   constructor ()
   {

      super();
      console.log("settings=%s", settings.PLUGIN_NAME);


      // Allow main.js to access Cmd4 Static variables as html files cannot
      // require Cmd4 javascript files
      this.onRequest('/startButtonPressed', this.startButtonPressed.bind(this));
      this.onRequest('/backButtonPressed', this.backButtonPressed.bind(this));
      this.onRequest('/showConfigureGlobalsPage', this.showConfigureGlobalsPage.bind(this));
      this.onRequest('/showQueueGlobalsPage', this.showQueueGlobalsPage.bind(this));



      this.onRequest('/getCachedAccessories', this.getCachedAccessories.bind(this));

      this.onRequest('/cmd4StaticVariable', this.cmd4StaticVariable.bind(this));
      this.onRequest('/ACC_Info', this.cmd4AccInfo.bind(this));
      this.onRequest('/DEVICE_Info', this.cmd4DeviceInfo.bind(this));

      this.fromPage = "#start";
      this.toPage = null;
      this.pages = [ ];

      this.pluginConfig = null;

      this.cachedAccessories = this.getCachedAccessories;

      this.ready();
   }

   async createSchemaForExistingAccessory( accessory )
   {
      let schema=
      {
          name:
          {
             title: "Name",
             description: "Name of accessory",
             type: "string",
             default: accessory.name,
             required: true
          },
          displayName:
          {
             title: "DisplayNamw",
             description: "Name of accessory",
             type: "string",
             default: accessory.displayNameame,
             required: true
          },
          manufacturer:
          {
             name: "Manufacturer",
             type: "string",
             placeholder: accessory.manufacturer || "",
             description: "Set the manufacturer name for display in the Home app.",
             required: false
          },
          model:
          {
             name: "Model",
             type: "string",
             placeholder: accessory.model || "",
             description: "Set the modal name for display in the Home app.",
             required: false
          },
          serialNumber:
          {
             name: "SerialNumber",
             type: "string",
             placeholder: accessory.serialNumber || "",
             description: "Set the serial number for display in the Home app.",
             required: false
          },
          stateChangeResponseTime:
          {
             name: "StateChangeResponseTime",
             type: "nummber",
             min: 0,
             max: 300,
             placeholder: accessory.stateChangeResponseTime,
             description: "Set the accessory's state chane response time (sec).",
             required: false
          },
          timeout:
          {
             name: "Timeout",
             type: "number",
             min: 0,
             max: 300,
             placeholder: accessory.timeout,
             description: "Set the accessory's timeout (msec).",
             required: true
          }
      };
      if ( typeof accessory.polling == "boolean" )
      {
          schema.polling =
          {
             title: "Polling",
             type: "boolean",
             default: accessory.polling,
             description: "Polling interval in seconds.",
             required: false
          };
      } else {
          schema.polling =
          {
             title: "Polling",
             type: "array",
             items: {
             }
          }
          accessory.polling.forEach( ( entry, index ) =>
          {
             schema.polling.items[ index ] =
             {
                title: "Characteristic",
                type: "string",
                placeholder: entry.characteristic,
                required: true
             },
             {
                title: "Timeout",
                type: "number",
                min: 0,
                max: 300,
                placeholder: entry.timeout,
                description: "Set the accessory's timeout (msec).",
                required: false
             },
             {
                title: "StateChangeResponseTime",
                type: "number",
                min: 0,
                max: 300,
                placeholder: entry.stateChangeResponseTime,
                description: "Set the accessory's state chane response time (sec).",
                required: false
             };
          });
      }
   }

     // A native method getCachedAccessories() was introduced in config-ui-x v4.37.0
   // The following is for users who have a lower version of config-ui-x
   async getCachedAccessories( )
   {
      try {
         // Define the plugin and create the array to return
         const plugin = settings.PLUGIN_NAME;
         const devicesToReturn = []

         // The path and file of the cached accessories
         const accFile = this.homebridgeStoragePath + '/accessories/cachedAccessories'

         // Check the file exists
         if (fs.existsSync(accFile)) {
           // Read the cached accessories file
           let cachedAccessories = await fs.promises.readFile(accFile)

           // Parse the JSON
           cachedAccessories = JSON.parse(cachedAccessories)

           // We only want the accessories for this plugin
           cachedAccessories
             .filter(accessory => accessory.plugin === plugin)
             .forEach(accessory => devicesToReturn.push(accessory))
         }

         // Return the array
         return devicesToReturn
       } catch (err) {
         // Just return an empty accessory list in case of any errors
         return []
       }
   }


   // A method for main.js to access Static Cmd4 variables
   async cmd4StaticVariable( variableString )
   {
      //console.log("server.js for %s returning: %s", variableString, eval(variableString));
      console.log("server.js for %s", variableString );
      return eval( variableString );
   }
   async cmd4AccInfo( accTypeEnumIndex )
   {
      return CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ];
   }
   async cmd4DeviceInfo( deviceTypeEnumIndex )
   {
      return CMD4_DEVICE_TYPE_ENUM.properties[ deviceTypeEnumIndex ];
   }

   async startButtonPressed( pluginConfig )
   {
      console.log("Server.js in start() pluginConfig: %s", pluginConfig );
      console.log("Server.js in start() pluginConfig.length: %s", pluginConfig.length );
      this.pluginConfig = pluginConfig;
      this.pluginConfig.forEach( ( entry, index ) =>
      {
          console.log("Server.js pluginConfig[ %s ]: %s", index, entry );
      });

      let fromPage = "#start";
      let toPage = "";
      if ( pluginConfig && pluginConfig.length >= 1 && pluginConfig[0].accessories.length >= 1 )
         toPage = "#selectExistingAccessory";
      else
         toPage = "#newAccessory";

      this.pages.push( fromPage );
      this.pages.push( toPage );
      this.pushEvent('my-pageEvent', { from: fromPage,   // from: is hide
                                       to:   toPage }    // to: is show
                    );

   }
   async backButtonPressed( )
   {
      let fromPage = this.pages.pop();
      let toPage = this.pages[ this.pages.length -1];
      console.log("Server.js in back() toPage: %s fromPage", toPage, fromPage );
      this.pushEvent('my-pageEvent', { from: fromPage,       // from: is hide
                                       to:   toPage }        // to:   is show
                    );
   }
   async showConfigureGlobalsPage( )
   {
      let fromPage = this.pages[ this.pages.length -1];
      let toPage = "#configureGlobals";
      console.log("Server.js in globals() toPage: %s fromPage", toPage, fromPage );

      this.pages.push( toPage );
      this.pushEvent('my-pageEvent', { from: fromPage,       // from: is hide
                                       to:   toPage }        // to:   is show
                    );
   }
   async showQueueGlobalsPage( )
   {
      let fromPage = this.pages[ this.pages.length -1];
      let toPage = "#queueGlobalsPage";
      console.log("Server.js toPage: %s fromPage", toPage, fromPage );

      this.pages.push( toPage );
      this.pushEvent('my-pageEvent', { from: fromPage,       // from: is hide
                                       to:   toPage }        // to:   is show
                    );
   }
}

(() =>
{
   return new UiServer;
})();
