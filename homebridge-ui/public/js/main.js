/*global $, Option, homebridge, globalsSchema, schema*/




const GLOBAL =
{
   pluginConfig: false,
   customSchema: false,
   globalsForm: false,
   accessoryOptions: false,
   newGlobalQueueBeingAdded: false,
   constants: null
};


async function createCustomSchema( accessory )
{
   homebridge.request( "/consoleLog",  `In CreateCustomSchema for: ${ accessory.name } ${ accessory.displayName }` );
   homebridge.request( "/consoleLog",  `In CreateCustomSchema accessory: ${ accessory }` );
   //let settings = await homebridge.request( "/cmd4StaticVariable", "settings" );

   GLOBAL.accessorySchema =
   {
      name: accessory.name,
      displayName: accessory.displayName,
      accessoryCharacteristics: accessory.characteristics,
      polling: accessory.polling,
      timeout: accessory.timeout,
      queue: accessory.queue,
      stateChangeResponseTime: accessory.stateChangeResponseTime,
      stateCmdPrefix: accessory.stateCmdPrefix,
      stateCmd: accessory.stateCmd,
      stateCmdSuffix: accessory.stateCmdSuffix
   };

   GLOBAL.customSchema = homebridge.createForm( schema,
   {
      name: GLOBAL.pluginConfig[0].name,
      debug: GLOBAL.pluginConfig[0].debug,
      outputConstants: GLOBAL.pluginConfig[0].outputConstants,
      statusMsg: GLOBAL.pluginConfig[0].statusMsg,
      timeout: GLOBAL.pluginConfig[0].timeout,
      stateChangeResponseTime: GLOBAL.pluginConfig[0].stateChangeResponseTime,
      accessories: []
   } );

   GLOBAL.customSchema.onChange( async config =>
   {
      homebridge.request( "/consoleLog",  `In customSchema.onChange config: ${ config }` );
      //let settings = await homebridge.request( "/cmd4StaticVariable", "settings" );

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
   $( '#authCode' ).val( '' );
   $( '#authToken' ).val( '' );
   $( '#authRefreshToken' ).val( '' );
   $( '#authTokenType' ).val( '' );
   $( '#authExpiresIn' ).val( '' );
   $( '#authExpiresAt' ).val( '' );

   $( '#codeInput' ).hide( );
   $( '#tokenInput' ).hide( );

   GLOBAL.accessorySchema = false;
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
   homebridge.request( "/consoleLog", `main.js async function back sending back`);
   homebridge.request( "/backButtonPressed" );
}
async function showConfigureGlobalsPageButtonPressed( )
{
   homebridge.request( "/consoleLog", `main.js async function globals sending globals` );
   homebridge.request( "/showConfigureGlobalsPage" );

   GLOBAL.globalsForm = homebridge.createForm( globalsSchema,
   {
      "debug": GLOBAL.pluginConfig[0].debug,
      "statusMsg": GLOBAL.pluginConfig[0].statusMsg,
      "allowTLV8": GLOBAL.pluginConfig[0].allowTLV8,
      "outputConstants": GLOBAL.pluginConfig[0].outputConstants,
      "timeout": GLOBAL.pluginConfig[0].timeout,
      "stateChangeResponseTime": GLOBAL.pluginConfig[0].stateChangeResponseTime,
      "interval": GLOBAL.pluginConfig[0].interval,
      "stateCmdPrefix": GLOBAL.pluginConfig[0].stateCmdPrefix,
      "stateCmd": GLOBAL.pluginConfig[0].stateCmd,
      "stateCmdSuffix": GLOBAL.pluginConfig[0].stateCmdSuffix,
      "storage": GLOBAL.pluginConfig[0].storage,
      "storagePath": GLOBAL.pluginConfig[0].storagePath,
      "folder": GLOBAL.pluginConfig[0].folder,
      "keyPath": GLOBAL.pluginConfig[0].keyPath,
      "definitions": GLOBAL.pluginConfig[0].definitions,
      "queueTypes": GLOBAL.pluginConfig[0].queueTypes
   }, "MySubmitButton", "MyCancelButton" );

   GLOBAL.globalsForm.onChange(async change => {
      homebridge.request( "/consoleLog", `main.js showConfigureGlobalsPage onChange` );
      GLOBAL.pluginConfig[0].debug = ( change.debug ) ? change.debug : undefined;
      GLOBAL.pluginConfig[0].statusMsg = change.statusMsg ? change.statusMsg : undefined;
      GLOBAL.pluginConfig[0].allowTLV8 = change.allowTLV8 ? change.allowTLV8 : undefined;
      GLOBAL.pluginConfig[0].outputConstants = change.outputConstants ? change.outputConstants : undefined;
      GLOBAL.pluginConfig[0].timeout = change.timeout ? change.timeout : undefined;
      GLOBAL.pluginConfig[0].stateCmdResponseTime = change.stateCmdResponseTime ? change.stateCmdResponseTime : undefined;
      GLOBAL.pluginConfig[0].interval = change.interval ? change.interval : undefined;
      GLOBAL.pluginConfig[0].stateCmdPrefix = change.stateCmdPrefix ? change.stateCmdPrefix : undefined;
      GLOBAL.pluginConfig[0].stateCmd= change.stateCmd ? change.stateCmd : undefined;
      GLOBAL.pluginConfig[0].stateCmdSuffix = change.stateCmdSuffix ? change.stateCmdSuffix : undefined;
      GLOBAL.pluginConfig[0].storage = change.storage ? change.storage : undefined;
      GLOBAL.pluginConfig[0].storagePath = change.storagePath ? change.storagePath : undefined;
      GLOBAL.pluginConfig[0].folder = change.folder ? change.folder : undefined;
      GLOBAL.pluginConfig[0].keyPath = change.keyPath ? change.keyPath : undefined;
      GLOBAL.pluginConfig[0].definitions = change.definitions ? change.definitions : undefined;
      GLOBAL.pluginConfig[0].queueTypes = change.queueTypes ? change.queueTypes : undefined;
   });

   // watch for submit button click events
   GLOBAL.globalsForm.onSubmit( (form) => {
      homebridge.request( "/consoleLog",  `submit button pressed for form: ${ form }` );
    });

   try {
      homebridge.request( "/consoleLog",  `await homebridge.updatePlugin` );
      await homebridge.updatePluginConfig(GLOBAL.pluginConfig);
    } catch(err) {
      homebridge.toast.error(err.message, 'Error');
    }
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
      stateCmdPrefix: undefined,
      stateCmd: undefined,
      stateCmdSuffix: undefined,
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
   Cmd4Globals.stateCmdPrefix = ( $('#globalStateCmdPrefix').val() === "" ) ? undefined : $('#globalStateCmdPrefix').val();
   Cmd4Globals.stateCmd = ( $('#globalStateCmd').val() === "" ) ? undefined : $('#globalStateCmd').val();
   Cmd4Globals.stateCmdSuffix = ( $('#globalStateCmdSuffix').val() === "" ) ? undefined : $('#globalStateCmdSuffix').val();

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
   let select = document.getElementById( "accessoryType" );

   homebridge.request( "/consoleLog",  `In Cmd4.js select` );
   let CMD4_DEVICE_TYPE_ENUM = await homebridge.request( "/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM" );
   Object.keys( CMD4_DEVICE_TYPE_ENUM.properties ).forEach( key => {
      let defaultSelection = false;
      if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
      {
         homebridge.request( "/consoleLog",  `Setting default selection to true at: ${ key }` );
         defaultSelection = true;
      }
      select.appendChild( new Option( CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, defaultSelection, defaultSelection ) );
   } );
}

$( '#addAccessory, #Xstart' ).on( 'click', ( ) =>
{

   resetUI( );

   populateSelect( );


   //let activeContent = $( '#notConfigured' ).css( 'display' ) !== 'none' ? $( '#notConfigured' ) : $( '#isConfigured' );

} );

// This is called when an existing Accessory is to be edited
$( '#editAccessory' ).on( 'click', ( ) =>
{

   resetUI( );

   let selectedAccessory = $( '#accessorySelect option:selected' ).text( );
   let accessory = GLOBAL.pluginConfig[0].accessories.find( accessory => accessory.name === selectedAccessory );

   if ( !accessory )
      return homebridge.toast.error( 'Can not find the accessory!', 'Error' );

   homebridge.request( "/consoleLog", `EDIT ACCESSORY INCOMPLETE` );
   createCustomSchema( accessory );


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

