/*global $, Option, homebridge, globalsSchema, accessorySchema*/




const GLOBAL =
{
   pluginConfig: false,
   accessoryForm: false,
   globalsForm: false,
   newGlobalQueueBeingAdded: false,
   constants: null
};


async function createAccessorySchema( accessory )
{
   homebridge.request( "/consoleLog",  `In CreateCustomSchema for: ${ accessory.name } ${ accessory.displayName }` );
   homebridge.request( "/consoleLog",  `In CreateCustomSchema accessory: ${ accessory }` );
   //let settings = await homebridge.request( "/cmd4StaticVariable", "settings" );

   // Need to set globalSchema.queueTypes and polling
   // maxItems based on number of existing items + 1.
   // so only 1 entry is added at a time
   // Note: We do this in the definitions, because in the Layout section
   //       you would have to figure out what entry has the queueTypes
   //console.log("accessory.queueTypes=%s",accessory.queueTypes );
   console.log("accessorySchema definitions.queueTypes=%s",accessorySchema.schema['$definitions'].queueTypes );
   console.log("accessorySchema definitions.queueTypes.maxItems=%s",accessorySchema.schema['$definitions'].queueTypes );

   let maxItems = 1;
      Object.keys(accessory).forEach( key =>
      {
         console.log(`accessory[${key}]=${ accessory[ key ] }`);
      });
   if ( accessory.queueTypes != undefined )
   {
       console.log("accessory.queueTypes.length=%s",accessory.queueTypes.length );
       maxItems = accessory.queueTypes.length + 1
   }
   accessorySchema.schema['$definitions'].queueTypes.maxItems = maxItems;

   maxItems = 1;
   if ( accessory.polling )
      maxItems = accessory.polling.length + 1;
   accessorySchema.schema['$definitions'].polling.maxItems = maxItems

   GLOBAL.accessoryForm = homebridge.createForm( accessorySchema,
   {
      "debug": GLOBAL.pluginConfig[0].debug,
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
      "queueTypes": GLOBAL.pluginConfig[0].queueTypes,
      "name": GLOBAL.pluginConfig[0].name,
      "polling": GLOBAL.pluginConfig[0].polling
      // need to update forms characteristics


   }, "MySubmitButton", "MyCancelButton" );


   GLOBAL.accessoryForm.onChange( async config =>
   {
      homebridge.request( "/consoleLog",  `In customSchema.onChange config: ${ config }` );

      GLOBAL.pluginConfig[0].name = config.name;
      GLOBAL.pluginConfig[0].debug = config.debug;
      GLOBAL.pluginConfig[0].outputConstants = config.outputConstants;
      GLOBAL.pluginConfig[0].statusMsg = config.statusMsg;
      GLOBAL.pluginConfig[0].timeout = config.timeout;
      GLOBAL.pluginConfig[0].stateChangeResponseTime = config.stateChangeResponseTime;
      GLOBAL.pluginConfig[0].accessories = GLOBAL.pluginConfig[0].accessories.map( accessory =>
      {
         if ( accessory.name === config.accessories.name )
         {
            accessory = config.accessories;
         }
         return accessory;
      } );

      try
      {

         await homebridge.updatePluginConfig( GLOBAL.pluginConfig );

      }
      catch( err )
      {

         homebridge.toast.error( err.message, 'Error' );

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
         polling: accessory.polling,
         electricVehicle: false,
         tankBatteryType: 'HUMIDITY',
         token:
         {
            access_token: accessory.token.access_token,
               refresh_token: accessory.token.refresh_token,
               token_type: accessory.token.token_type,
               expires_in: accessory.token.expires_in,
               expires_at: accessory.token.expires_at
         }
      };

      for( const acc in GLOBAL.pluginConfig[0].accessories )
      {
         if ( GLOBAL.pluginConfig[ 0 ].accessories[ acc ].name === accessory.name )
         {
            found = true;
            GLOBAL.pluginConfig[ 0 ].accessories[ acc ].token =
            {
               access_token: accessory.token.access_token,
               refresh_token: accessory.token.refresh_token,
               token_type: accessory.token.token_type,
               expires_in: accessory.token.expires_in,
               expires_at: accessory.token.expires_at
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

      await homebridge.updatePluginConfig( GLOBAL.pluginConfig );
      await homebridge.savePluginConfig( );

   }
   catch( err )
   {

      homebridge.toast.error( err.message, 'Error' );

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

         await homebridge.updatePluginConfig( GLOBAL.pluginConfig );
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
   homebridge.request( "/consoleLog", `main.js async function globals sending globals` );
   homebridge.request( "/showConfigureGlobalsPageButtonPressed" );

   // Need to set globalSchema.queueTypes and polling
   // maxItems based on number of existing items + 1.
   // so only 1 entry is added at a time
   // Note: We do this in the definitions, because in the Layout section
   //       you would have to figure out what entry has the queueTypes
   console.log("GLOBAL.pluginConfig[0]=%s",GLOBAL.pluginConfig[0] );
   console.log("GLOBAL.pluginConfig[0].queueTypes=%s",GLOBAL.pluginConfig[0].queueTypes );
   console.log("globalsSchema.schema.queueTypes.maxItems=%s",globalsSchema.schema.queueTypes.maxItems );

   let maxItems = 1;
   if ( GLOBAL.pluginConfig[0].queueTypes )
       maxItems = GLOBAL.pluginConfig[0].queueTypes.length + 1

   globalsSchema.schema.queueTypes.maxItems = maxItems;

   // Missing ?
   //globalsSchema['$definitions'].polling.maxItems =
   //   GLOBAL.pluginConfig[0]['$definitions'].polling.maxItems + 1;

   // js/globalsSchema.js is included by index.html
   GLOBAL.globalsForm = homebridge.createForm( globalsSchema,
   {
      "debug": GLOBAL.pluginConfig[0].debug,
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
   }, "MySubmitButton", "MyCancelButton" );

   GLOBAL.globalsForm.onChange(async change => {
      homebridge.request( "/consoleLog", `main.js showConfigureGlobalsPage onChange before change.allowTLV8: ${ change.allowTLV8 }` );
      GLOBAL.pluginConfig[0].debug = ( change.debug ) ? change.debug : undefined;
      GLOBAL.pluginConfig[0].statusMsg = change.statusMsg ? change.statusMsg : undefined;
      GLOBAL.pluginConfig[0].allowTLV8 = change.allowTLV8 ? change.allowTLV8 : undefined;
      homebridge.request( "/consoleLog", `main.js showConfigureGlobalsPage onChange after GLOBAL.allowTLV8: ${ GLOBAL.pluginConfig[0].allowTLV8 }` );
      GLOBAL.pluginConfig[0].outputConstants = change.outputConstants ? change.outputConstants : undefined;
      GLOBAL.pluginConfig[0].timeout = change.timeout ? change.timeout : undefined;
      GLOBAL.pluginConfig[0].stateCmdResponseTime = change.stateCmdResponseTime ? change.stateCmdResponseTime : undefined;
      GLOBAL.pluginConfig[0].interval = change.interval ? change.interval : undefined;
      GLOBAL.pluginConfig[0].state_cmd_prefix = change.state_cmd_prefix ? change.state_cmd_prefix : undefined;
      GLOBAL.pluginConfig[0].state_cmd = change.state_cmd ? change.state_cmd : undefined;
      GLOBAL.pluginConfig[0].state_cmd_suffix = change.state_cmd_suffix ? change.state_cmd_suffix : undefined;
      GLOBAL.pluginConfig[0].storage = change.storage ? change.storage : undefined;
      GLOBAL.pluginConfig[0].storagePath = change.storagePath ? change.storagePath : undefined;
      GLOBAL.pluginConfig[0].folder = change.folder ? change.folder : undefined;
      GLOBAL.pluginConfig[0].keyPath = change.keyPath ? change.keyPath : undefined;
      GLOBAL.pluginConfig[0].definitions = change.definitions ? change.definitions : undefined;
      GLOBAL.pluginConfig[0].queueTypes = change.queueTypes ? change.queueTypes : undefined;

      try {
         homebridge.request( "/consoleLog",  `await homebridge.updatePlugin` );
         await homebridge.updatePluginConfig(GLOBAL.pluginConfig);
       } catch(err) {
         homebridge.toast.error(err.message, 'Error');
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
         console.log(`GLOBAL.globalsForm[${key}]=${ GLOBAL.globalsForm[ key ] }`);
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
   let Cmd4Globals =
   {
      debug: GLOBAL.constants.DEFAULT_DEBUG,
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
         //homebridge.request( "/consoleLog",  `In Cmd4.js select appending ${ CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName }` );
         select.appendChild( new Option( CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, defaultSelection, defaultSelection ) );
      } );


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
      homebridge.toast.error( err.message, 'Error' );
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

$( '#showAddAccessoryPageButton' ).on( 'click', ( ) =>
{
   resetUI( );

   populateSelect( );

   homebridge.request( "/showAddAccessoryPageButtonPressed" );

} );
$( '#addAccessoryPage2Button' ).on( 'click', ( ) =>
{
   let accessory = {
      name: $('#accessoryName').val(),
      type : $('#accessoryTypeSelect').val(),
   };
   resetUI( );

   createAccessorySchema( accessory );

   homebridge.request( "/showAddAccessoryPage2ButtonPressed" );

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

