/*global $, homebridge, globalsSchema, accessorySchema*/




const GLOBAL =
{
   pluginConfig: false,
   accessoryForm: false,
   accessory: false,
   accessoryName: false,
   globalsForm: false,
   newGlobalQueueBeingAdded: false,
   constants: null
};


async function createAccessorySchema( accessory )
{
   // Defaults
   accessorySchema.schema['$defs'].polling.maxItems = 1;
   accessorySchema.schema['$defs'].queueTypes.maxItems = 1;

   if ( accessory == null )
   {
      homebridge.request( "/consoleLog",  `In CreateAccessorySchema *NEW*` );
   }
   else
   {
      homebridge.request( "/consoleLog",  `In CreateAccessorySchema accessory.name: ${ accessory.name }` );

      if ( accessory.queueTypes != undefined )
      {
          console.log("accessory.queueTypes.length=%s",accessory.queueTypes.length );
          accessorySchema.schema['$defs'].queueTypes.maxItems = accessory.queueTypes.length + 1;
      }

      if ( accessory.polling )
         accessorySchema.schema['$defs'].polling.maxItems = accessory.polling.length + 1;

      // Just in case the name is changed, know which one is being worked on.
      GLOBAL.accessoryName = accessory.name;

   }

   //let settings = await homebridge.request( "/cmd4StaticVariable", "settings" );

   // Need to set globalSchema.queueTypes and polling
   // maxItems based on number of existing items + 1.
   // so only 1 entry is added at a time
   // Note: We do this in the definitions, because in the Layout section
   //       you would have to figure out what entry has the queueTypes
   //console.log("accessorySchema definitions.queueTypes=%s",accessorySchema.schema['$defs'].queueTypes );



   /*
   GLOBAL.accessoryForm = homebridge.createForm( accessorySchema,
   {
      "debug": accessory.debug: accessory.debug ? "",
      "statusMsg": accessory.statusMsg: accessory.debug ? "",
      "allowTLV8": accessory.allowTLV8: accessory.debug ? "",
      "outputConstants": accessory.outputConstants: accessory.debug ? "",
      "timeout": accessory.timeout: accessory.debug ? "",
      "stateChangeResponseTime": accessory.stateChangeResponseTime: accessory.debug ? "",
      "interval": accessory.interval: accessory.debug ? "",
      "state_cmd_prefix": accessory.state_cmd_prefix: accessory.debug ? "",
      "state_cmd": accessory.state_cmd: accessory.debug ? "",
      "state_cmd_suffix": accessory.state_cmd_suffix,
      "storage": accessory.storage: accessory.debug ? "",
      "storagePath": accessory.storagePath,
      "folder": accessory.folder: accessory.debug ? "",
      "keyPath": accessory.keyPath: accessory.debug ? "",
      "definitions": accessory.definitions: accessory.definitions ? "",
      "queueTypes": accessory.queueTypes: accessory.queueTypes ? "",
      "name": accessory.name: accessory.name ? "",
      "polling": accessory.polling: accessory.polling ? ""
      // need to update forms characteristics
   }, "Update", "Cancel" ); // UPDATE CANCEL (Auto Capitalized)
   */

   // Create the accessory Form using the data from the passed in accesory
   GLOBAL.accessoryForm = homebridge.createForm( accessorySchema, accessory,
   "Update", "Cancel" ); // UPDATE CANCEL (Auto Capitalized)


   GLOBAL.accessoryForm.onChange( async config =>
   {
      homebridge.request( "/consoleLog",  `In customSchema.onChange config: ${ config }` );

      GLOBAL.pluginConfig[0].accessories = GLOBAL.pluginConfig[0].accessories.map( accessory =>
      {
         if ( accessory.name === config.name )
         {
            accessory = config;
         }
         return accessory;
      } );

      try
      {

         await homebridge.updatePluginConfig( GLOBAL.pluginConfig );

      }
      catch( err )
      {

         homebridge.toast.error( err.message, 'updateError' );

      }

   } );

   return;

}


function resetUI( )
{
   homebridge.request( "/consoleLog",  `In resetUI` );

   resetForm( );
   resetSchema( );

   return;

}

function resetForm( )
{
   homebridge.request( "/consoleLog",  `In resetForm` );

   $( '#accessoryName' ).val( '' );
   $( '#accessoryCharacteristics' ).val( '' );
   $( '#accessoryPolling' ).val( '' );

   GLOBAL.accessoryForm = false;
   GLOBAL.globalsForm = false;

   return;

}

function resetSchema( )
{
   homebridge.request( "/consoleLog",  `In resetSchema` );

   if ( GLOBAL.customSchema )
   {
      GLOBAL.customSchema.end( );
      GLOBAL.customSchema = false;
   }

   return;

}

function addAccessoryToList( accessory )
{
   homebridge.request( "/consoleLog",  `In addAccessoryToList accessory.displayName: ${ accessory.displayName }` );

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect' ).append( '<option value="' + name + '">'+ name + '</option>' );

   return;

}

function removeAccessoryFromList( accessory )
{
   homebridge.request( "/consoleLog",  `In removeAccessoryToList accessory.displayName: ${ accessory.displayName }` );

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect option[value=\'' + name + '\']' ).remove( );

   return;

}

async function addNewDeviceToConfig( accessory )
{
   homebridge.request( "/consoleLog",  `In addNewDeviceToConfig for: ${ accessory.name } ${ accessory.displayName }` );

   let found = false;

   try
   {
      const config =
      {
         name: accessory.name,
         accessoryCharacteristics: accessory.characteristics,
         polling: accessory.polling
      };

      for( const acc in GLOBAL.pluginConfig[0].accessories )
      {
         if ( GLOBAL.pluginConfig[ 0 ].accessories[ acc ].name === accessory.name )
         {
            found = true;
            GLOBAL.pluginConfig[ 0 ].accessories[ acc ].token =
            {
               access_token: accessory.token.access_token
            };
            homebridge.toast.success( accessory.name + ' refreshed!', 'Success' );
         }
      }

      if ( !found )
      {

         GLOBAL.pluginConfig[0].accessories.push( config );
         addAccessoryToList( config );

         homebridge.toast.success( config.name + ' added to config!', 'Success' );

      }

      // Update the plugin config (Does not save )
      await homebridge.updatePluginConfig( GLOBAL.pluginConfig );
      // Saves the plugin config to disk
      await homebridge.savePluginConfig( );

   }
   catch( err )
   {

      homebridge.toast.error( err.message, 'addnewDevError' );

   }

   return;

}

async function removeDeviceFromConfig( )
{

   let foundIndex;
   let pluginConfigBkp = GLOBAL.pluginConfig;
   let selectedAccessory = $( '#accessorySelect option:selected' ).text( );

   GLOBAL.pluginConfig[0].accessories.forEach( ( accessory, index ) =>
   {
      if ( accessory.name === selectedAccessory )
      {
         foundIndex = index;
      }
   } );

   if ( foundIndex !== undefined )
   {

      try
      {

         GLOBAL.pluginConfig[0].accessories.splice( foundIndex, 1 );

         // Update the plugin config (Does not save )
         await homebridge.updatePluginConfig( GLOBAL.pluginConfig );
         // Saves the plugin config to disk
         await homebridge.savePluginConfig( );

         removeAccessoryFromList( selectedAccessory );

         homebridge.toast.success( selectedAccessory + ' removed from config!', 'Success' );

      }
      catch( err )
      {

         GLOBAL.pluginConfig = pluginConfigBkp;

         throw err;

      }
   }
   else
   {
      throw new Error( 'No accessory found in config to remove!' );
   }

   return;

}
async function startButtonPressed( )
{
   // This is alreays done by the main async function below
   // let pluginConfig = await homebridge.getPluginConfig( );
   // GLOBAL.pluginConfig = pluginConfig;

   homebridge.request( "/consoleLog", `Have pluginConfig start sending start GLOBAL.pluginConfig: ${ GLOBAL.pluginConfig }`);

   // Pass the GLOBAL.pluginConfig to the server
   homebridge.request( "/startButtonPressed", GLOBAL.pluginConfig );
}
async function backButtonPressed( )
{
   if ( GLOBAL.accessoryForm )
   {
      GLOBAL.accessoryForm.end( );
      GLOBAL.accessoryForm = false;

      homebridge.hideSchemaForm();
   }
   if ( GLOBAL.globalsForm )
   {
      GLOBAL.globalsForm.end( );
      GLOBAL.globalsForm = false;

      homebridge.hideSchemaForm();
   }

   homebridge.request( "/consoleLog", `main.js async function back sending back`);
   homebridge.request( "/backButtonPressed" );
}
async function showConfigureGlobalsPageButtonPressed( )
{
   let maxItems = 1;

   homebridge.request( "/consoleLog", `main.js async function globals sending globals` );
   homebridge.request( "/showConfigureGlobalsPageButtonPressed" );

   // Need to set globalSchema.queueTypes and polling
   // maxItems based on number of existing items + 1.
   // so only 1 entry is added at a time
   // Note: We do this in the definitions, because in the Layout section
   //       you would have to figure out what entry has the queueTypes
   console.log("GLOBAL.pluginConfig[0]=%s",GLOBAL.pluginConfig[0] );
   console.log("GLOBAL.pluginConfig[0].queueTypes=%s",GLOBAL.pluginConfig[0].queueTypes );
   console.log("globalsSchema.schema['$defs'].queueTypes.maxItems=%s",globalsSchema.schema['$defs'].queueTypes.maxItems );

   // Set the Globals form queueTypes length to defined number + 1
   maxItems = 1;
   if ( GLOBAL.pluginConfig[0].queueTypes )
       maxItems = GLOBAL.pluginConfig[0].queueTypes.length + 1
   globalsSchema.schema['$defs'].queueTypes.maxItems = maxItems;

   // Set the Globals form constants length to defined number + 1
   maxItems = 1;
   if ( GLOBAL.pluginConfig[0].constants )
       maxItems = GLOBAL.pluginConfig[0].constants.length + 1
   globalsSchema.schema['$defs'].constants.maxItems = maxItems;

   // Missing ?
   //globalsSchema['$defs'].polling.maxItems =
   //   GLOBAL.pluginConfig[0]['$defs'].polling.maxItems + 1;

   // js/globalsSchema.js is included by index.html
   GLOBAL.globalsForm = homebridge.createForm( globalsSchema,
   {
      "debug": GLOBAL.pluginConfig[0].debug,
      "constants": GLOBAL.pluginConfig[0].constants,
      "statusMsg": GLOBAL.pluginConfig[0].statusMsg,
      "allowTLV8": GLOBAL.pluginConfig[0].allowTLV8,
      "outputConstants": GLOBAL.pluginConfig[0].outputConstants,
      "timeout": GLOBAL.pluginConfig[0].timeout,
      "stateChangeResponseTime": GLOBAL.pluginConfig[0].stateChangeResponseTime,
      "interval": GLOBAL.pluginConfig[0].interval,
      "state_cmd_prefix": GLOBAL.pluginConfig[0].state_cmd_prefix,
      "state_cmd": GLOBAL.pluginConfig[0].state_cmd,
      "state_cmd_suffix": GLOBAL.pluginConfig[0].state_cmd_suffix,
      "storage": GLOBAL.pluginConfig[0].storage,
      "storagePath": GLOBAL.pluginConfig[0].storagePath,
      "folder": GLOBAL.pluginConfig[0].folder,
      "keyPath": GLOBAL.pluginConfig[0].keyPath,
      "definitions": GLOBAL.pluginConfig[0].definitions,
      "queueTypes": GLOBAL.pluginConfig[0].queueTypes
   }, "Update", "Cancel" ); // UPDATE CANCEL (Auto Capitalized)

   GLOBAL.globalsForm.onChange(async change =>
   {
      // Check for form changes
      Object.keys( change ).forEach( ( key ) =>
      {
         // If the key was removed. Delete it as Cmd4 handles it as a default.
         if ( change[ key ] == undefined || change[ key ] == "" )
         {
            homebridge.request( "/consoleLog", `Deleting pluginConfig[ ${ key }] with ${ change[ key ] }` );
            delete GLOBAL.pluginConfig[0][ key ];
         } else
         {
            homebridge.request( "/consoleLog", `Updating pluginConfig[ ${ key }] with ${ change[ key ] }` );
            GLOBAL.pluginConfig[0][key] = change[ key ];
         }
      });

      try {
         homebridge.request( "/consoleLog",  `await homebridge.updatePlugin` );
         // Update the plugin config (Does not save )
         await homebridge.updatePluginConfig(GLOBAL.pluginConfig);
       } catch(err) {
         homebridge.toast.error(err.message, 'updatePluginError');
       }
   });
   console.log( `GLOBAL.globalsForm:` );
      Object.keys(GLOBAL.globalsForm).forEach( key =>
      {
         console.log(`GLOBAL.globalsForm[${key}]=${ GLOBAL.globalsForm[ key ] }`);
      });
   console.log( `GLOBAL.globalsForm.parent:` );
      Object.keys(GLOBAL.globalsForm.parent).forEach( key =>
      {
         console.log(`GLOBAL.globalsForm.parent[${key}]=${ GLOBAL.globalsForm[ key ] }`);
      });
   // $watchCollection is not a function
   //GLOBAL.globalsForm.$watchCollection('queueTypes', function( x )
   // watchCollection is not a function
   //GLOBAL.globalsForm.watchCollection('queueTypes', function( x )
   //GLOBAL.globalsForm.watchCollection('queueTypes', function( x )
   //{
   //      homebridge.request( "/consoleLog",  `watchCollection x:${x}` );
   //});

   // watch for submit button click events
   GLOBAL.globalsForm.onSubmit( (form) => {
      homebridge.request( "/consoleLog",  `submit button pressed for form: ${ form }` );
      // Saves the plugin config to disk
      homebridge.savePluginConfig();
     homebridge.toast.success( ' Globals Updated!', 'Success' );
    });

}
/* not used yet
async function cancelButtonPressed( )
{

    homebridge.request( "/consoleLog",  `cancel button pressed` );
    // stop listening to change events and hide the form
    GLOBAL.globalsForm.end();
    GLOBAL.globalsForm = false;

   homebridge.hideSchemaForm();

}
*/
async function showQueueGlobalsPageButtonPressed( )
{
   homebridge.request( "/consoleLog", `main.js async function globals sending globals` );
   // unused
   homebridge.request( "/showQueueGlobalsPage" );
}
async function updateQueueGlobalsPageButtonPressed( )
{
   // Unused as form does this
   homebridge.request( "/consoleLog", `main.js updateQueueGlobalsPageButtonPressed ` );
   /*
   let Cmd4Globals =
   {
      debug: GLOBAL.constants.DEFAULT_DEBUG,
      constants: undefined,
      outputConstants: false,
      allowTLV8: GLOBAL.constants.DEFAULT_ALLOW_TLV8,
      statusMsg: GLOBAL.constants.DEFAULT_STATUS_MSG,
      state_cmd_prefix: undefined,
      state_cmd: undefined,
      state_cmd_suffix: undefined,
      timeout: undefined,
      stateChangeResponseTime: undefined,
      queueTypes: undefined
   };

   homebridge.request( "/consoleLog", `main.js async function globals updating globals` );
   // Grab all the globals queue page information
   Cmd4Globals.debug = ( $('#globalDebug').val() === "on") ? true : false;
   Cmd4Globals.constants = ( $('#globalConstants').val() === "" ) ? undefined : $('#globalConstants').val();

   homebridge.request( "/consoleLog", `globalDebug=${ Cmd4Globals.debug }` );
   Cmd4Globals.outputConstants = ( $('#globalOutputConstants').val() === "on") ? true : false;
   homebridge.request( "/consoleLog", `globalOutputConstants=${ Cmd4Globals.outputConstants }` );
   Cmd4Globals.allowTLV8 = ( $('#globalAllowTLV8').val() === "on") ? true : false;
   Cmd4Globals.statusMsg = ( $('#globalStatusMsg').val() === "on") ? true : false;
   Cmd4Globals.timeout = ( $('#globalTimeout').val() === "" ) ? undefined : $('#globalTimeout').val();
   Cmd4Globals.state_cmd_prefix = ( $('#globalState_cmd_prefix').val() === "" ) ? undefined : $('#globalState_cmd_prefix').val();
   Cmd4Globals.state_cmd = ( $('#globalState_cmd').val() === "" ) ? undefined : $('#globalState_cmd').val();
   Cmd4Globals.state_cmd_suffix = ( $('#globalState_cmd_suffix').val() === "" ) ? undefined : $('#globalState_cmd_suffix').val();

   // send information to server
   homebridge.request( "/updateCmd4Globals", Cmd4Globals );
   */
}
async function configureNewQueuePageButtonPressed()
{
   homebridge.request( "/consoleLog", `main.js async function configureNewQueuePageButtonPressed` );
   if ( GLOBAL.newGlobalQueueBeingAdded == true )
   {
      homebridge.toast.error('A new queue has already been started.', 'Error');
      return;
   }
   GLOBAL.newGlobalQueueBeingAdded = true;
   addGlobalQueueEntryItem( "", GLOBAL.constants.DEFAULT_QUEUE_TYPE );

   // You need to rebind the newly created button
   $(document.body).on('click','.deleteGlobalQueueButton', deleteGlobalQueueButtonPressed);
}

async function deleteGlobalQueueButtonPressed( event )
{
   homebridge.request( "/consoleLog", `Click deleteGlobalQueueButtonPressed event: ${ event }` );
   homebridge.request( "/consoleLog", `Value is ${ $(this).val() }` );
}
function addGlobalQueueEntryItem( queueName, selectedQueueType )
{
   // Unused as form does this
   homebridge.request( "/consoleLog", `main.js updateGlobalQueueEntryItem ${ queueName } ${ selectedQueueType }  ` );
   /*
   homebridge.request( "/consoleLog", `Adding queue: ${ queueName }` );
   let unSelectedQueueType = GLOBAL.constants.QUEUETYPE_SEQUENTIAL;
   if ( selectedQueueType == GLOBAL.constants.QUEUETYPE_SEQUENTIAL )
       unSelectedQueueType = GLOBAL.constants.QUEUETYPE_WORM;
   $( '#globalQueuesForm' ).append(
      '<div class="row no-gutters">' +
         '<div class="col">' +
            '<div class="card card-body">' +
               '<button type="submit" class="btn btn-primary p-0 mt-0 mb-0 deleteGlobalQueueButton" value="' + queueName +'">' +
                  '<i class="fa fa-trash" aria-hidden="true"></i>' +
               '</button>' +
            '</div>' +
         '</div>' +
         '<div class="col">' +
            '<div class="card card-body">' +
               '<input type="text" style="text-align:center" class="input-group p-0 pt-0 pb-0 border-0" placeHolder="' + queueName + '" id="queueName' + 1 + '">' +
            '</div>' +
         '</div>' +
         '<div class="col">' +
            '<div class="card card-body">' +
               '<select class="input-group p-0 pt-0 pb-0 border-0" name="queueType" id="queueType' + 1 +'">' +
                  '<option value="' + selectedQueueType + '" selected >' + selectedQueueType + '</option>' +
                  '<option value="' + unSelectedQueueType + '">' + unSelectedQueueType + '</option>' +
               '</select>' +
            '</div>' +
         '</div>' +
      '</div>'
   );
   */
}

// STARTUP CODE
( async ( ) =>
{

   try
   {
      // PAGE SWITCH EVENT
      homebridge.addEventListener('my-pageEvent', (event) =>
      {
         homebridge.request( "/consoleLog", `In Main.js server.js told me from: ${event.data.from }  to: ${ event.data.to }` );

          $( event.data.from ).hide( );
          $( event.data.to ).show( );
      });

      GLOBAL.constants = await homebridge.request( "/cmd4StaticVariable", "cmd4Constants" );

      // UPDATE accessoryTypeSelect
      /* There is no one for addAccessory any more. Its done by the schema
      let select = document.getElementById( "accessoryTypeSelect" );
      homebridge.request( "/consoleLog", `main.js select= ${ select }` );

      homebridge.request( "/consoleLog",  `In Cmd4.js select` );
      let CMD4_DEVICE_TYPE_ENUM = await homebridge.request( "/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM" );
      Object.keys( CMD4_DEVICE_TYPE_ENUM.properties ).forEach( key => {
         let defaultSelection = false;
         if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
         {
            homebridge.request( "/consoleLog",  `Setting default selection to true at: ${ key }` );
            defaultSelection = true;
         }
         homebridge.request( "/consoleLog",  `In main.js select appending ${ CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName }` );
         select.appendChild( new Option( CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, defaultSelection, defaultSelection ) );
      } );
      */


      GLOBAL.pluginConfig = await homebridge.getPluginConfig( );
      //GLOBAL.pluginConfig.forEach( ( elem, index ) =>
      //{
         //homebridge.request( "/consoleLog",  `GLOBAL.pluginConfig[ ${ index } ] returned by homebridge: ${ elem }` );
      //} );

      if ( !GLOBAL.pluginConfig.length )
      {
         let settings = await homebridge.request( '/cmd4StaticVariable', "settings" );

         GLOBAL.pluginConfig = [
         {
            platform: settings.PLATFORM_NAME,
            name: settings.PLATFORM_NAME,
            debug: false,
            outputConstants: settings.DEFAULT_OUTPUTCONSTANTS,
            statusMsg: settings.DEFAULT_STATUSMSG,
            timeout: settings.DEFAULT_TIMEOUT,
            stateChangeResponseTime: settings.DEFAULT_STATE_CHANGE_RESPONSE_TIME,
            accessories: []
         }];

      }
      else
      {

         if ( !GLOBAL.pluginConfig[0].accessories || ( GLOBAL.pluginConfig[0].accessories && !GLOBAL.pluginConfig[0].accessories.length ) )
         {
            GLOBAL.pluginConfig[0].accessories = [];
            // return transPage( false, $( '#notConfigured' ) );
         }

         GLOBAL.pluginConfig[0].accessories.forEach( accessory =>
         {
            homebridge.request( "/consoleLog",  `In main.js forEach accessory.name: ${ accessory.name }` );
            $( '#accessorySelect' ).append( '<option value="' + accessory.name + '">'+ accessory.name + '</option>' );
         } );
         homebridge.request( "/consoleLog", `GLOBAL.pluginConfig[0]=${ GLOBAL.pluginConfig[0] }` );
         homebridge.request( "/consoleLog", `GLOBAL.pluginConfig[0].queueTypes=${ GLOBAL.pluginConfig[0].queueTypes }` );

         if ( GLOBAL.pluginConfig[0].queueTypes )
         {
            $( "#globalQueueMessage" ).hide( );
            $( "#globalQueueContainer" ).show( );
            //document.getElementById("globalQueueMessage").style.visibility = "hidden";

            GLOBAL.pluginConfig[0].queueTypes.forEach( entry =>
            {
               homebridge.request( "/consoleLog",  `In main.js forEach entry.queue ${ entry.queue }` );
               addGlobalQueueEntryItem( entry.queue, entry.queueType );
            });
         } else {
            $( "#globalQueueMessage" ).show( );
            $( "#globalQueueContainer" ).hide( );
         }
      }
   }
   catch( err )
   {
      homebridge.toast.error( err.message, 'init Error' );
   }

} )( );

//jquery listener

$( '.backButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `main.js click .back` );
   backButtonPressed();
} );

$( '#startButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `Click startButton` );
   startButtonPressed();
});

$( '.showConfigureGlobalsPageButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `Click showConfigureGlobalsPageButton` );
   showConfigureGlobalsPageButtonPressed();
} );

$( '.showQueueGlobalsPageButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `Click showQueueGlobalsPageButton` );
   // unused
   showQueueGlobalsPageButtonPressed();
} );
$( '#updateGlobalsPageButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `Click updateGlobalsPageButton` );
   // unused
   updateQueueGlobalsPageButtonPressed();
} );

$( '.configureNewQueuePageButton' ).on( 'click', ( ) =>
{
   homebridge.request( "/consoleLog", `Click configureNewQueuePageButton` );
   configureNewQueuePageButtonPressed();
} );

$(document.body).on('click','.deleteGlobalQueueButton', deleteGlobalQueueButtonPressed);

/*
async function populateSelect( )
{
   homebridge.request( "/consoleLog",  `In populate select` );

   let select = document.getElementById( "accessoryTypeSelect" );

   let length = $('#accessoryTypeSelect' ).children( 'option' ).length;
      homebridge.request( "/consoleLog", `length number of items=${ length }` );

   // Only add them once
   if (length == 0 )
   {

      // This must be in an async function or you will just get the promise
      let CMD4_DEVICE_TYPE_ENUM = await homebridge.request( "/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM" );

      Object.keys( CMD4_DEVICE_TYPE_ENUM.properties ).forEach( ( key ) => {
         let defaultSelection = false;
         if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
         {
            homebridge.request( "/consoleLog",  `Setting default selection to true at: ${ key }` );
            defaultSelection = true;
         }
         let deviceName = CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName;
         homebridge.request( "/consoleLog", `deviceName = ${ deviceName }` );

         select.appendChild( new Option( deviceName, deviceName, defaultSelection, defaultSelection ) );
      } );
   }
}
*/

$( '#showAddAccessoryPageButton' ).on( 'click', ( ) =>
{
   resetUI( );

   createAccessorySchema( null );

   // Go to the page
   homebridge.request( "/showAddAccessoryPageButtonPressed" );

} );

// This is called when an existing Accessory is to be edited
$( '#showEditAccessoryPageButton' ).on( 'click', ( ) =>
{

   resetUI( );

   let selectedAccessory = $( '#accessorySelect option:selected' ).text( );
   let accessory = GLOBAL.pluginConfig[0].accessories.find( accessory => accessory.name === selectedAccessory );

   if ( !accessory )
      return homebridge.toast.error( 'Can not find the accessory!', 'Error' );

   homebridge.request( "/consoleLog", `EDIT ACCESSORY INCOMPLETE` );
   GLOBAL.accessory = accessory;
   createAccessorySchema( accessory );

   homebridge.request( "/showEditAccessoryPageButtonPressed" );


} );

$( '#refreshAccessory' ).on( 'click', async ( ) =>
{
   if ( GLOBAL.customSchema && GLOBAL.accessorySchema )
   {
      resetSchema( );

      let accessory = GLOBAL.pluginConfig[0].accessories.find( accessory => accessory.name === GLOBAL.accessorySchema.name );

      if ( !accessory )
         return homebridge.toast.error( 'Can not find accessory in config!', 'Error' );

   }

} );

$( '#removeAccessory' ).on( 'click', async ( ) =>
{

   try
   {

      await removeDeviceFromConfig( );
   // just to resolve lint at this time
   //addNewDeviceToConfig( accessory )
   addNewDeviceToConfig( );

      resetUI( );

   }
   catch ( err )
   {

      homebridge.toast.error( err.message, 'Error' );

   }

} );

