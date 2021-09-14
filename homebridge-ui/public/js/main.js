/*global $, window, location, homebridge, schema*/



const GLOBAL =
{
   pluginConfig: false,
   customSchema: false,
   accessoryOptions: false,
   newGlobalQueueBeingAdded: false
};


async function createCustomSchema( accessory )
{
   console.log( "In CreateCustomSchema for:%s %s", accessory.name, accessory.displayName );
   console.log( "In CreateCustomSchema accessory:%s", accessory );
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
      accessories: [],
      accessories: accessory
   } );

   GLOBAL.customSchema.onChange( async config =>
   {
      console.log( "In customSchema.onChange config:%s %s", config );
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

// This shows below the edit accessory. Not what I want
async function createCustomSchema( accessory )
{

   GLOBAL.accessoryOptions = {
      name:  accessory.name,
      displayName:  accessory.displayName,
      polling:  accessory.polling,
   };

   GLOBAL.customSchema = homebridge.createForm(schema, {
      name: GLOBAL.pluginConfig[0].name,
      debug: GLOBAL.pluginConfig[0].debug,
      accessories: accessory
   });

   GLOBAL.customSchema.onChange(async config =>
   {

      GLOBAL.pluginConfig[0].name = config.name;
      GLOBAL.pluginConfig[0].debug = config.debug;
      GLOBAL.pluginConfig[0].accessories = GLOBAL.pluginConfig[0].accessories.map(accessory =>
      {
         if ( accessory.displayName === config.accessory.displayName &&
              accessory.name === config.accessory.name )
         {
            accessory = config.accessory;
         }
         return accessory;
      });

      try {

         await homebridge.updatePluginConfig(GLOBAL.pluginConfig);

      } catch(err) {

         homebridge.toast.error(err.message, 'Error');

      }
  });

  return;

}


function resetUI( )
{
   console.log( "In resetUI" );

   resetForm( );
   resetSchema( );

   return;

}

function resetForm( )
{
   console.log( "In resetForm" );

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

   return;

}

function resetSchema( )
{
   console.log( "In resetSchema" );

   if ( GLOBAL.customSchema )
   {
      GLOBAL.customSchema.end( );
      GLOBAL.customSchema = false;
   }

   return;

}

function addAccessoryToList( accessory )
{
   console.log( "In addAccessoryToList accessory.displayName:%s", accessory.displayName );

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect' ).append( '<option value="' + name + '">'+ name + '</option>' );

   return;

}

function removeAccessoryFromList( accessory )
{
   console.log( "In removeAccessoryToList accessory.displayName:%s", accessory.displayName );

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect option[value=\'' + name + '\']' ).remove( );

   return;

}

async function addNewDeviceToConfig( accessory )
{
   console.log( "In addNewDeviceToConfig for:%s %s", accessory.name, accessory.displayName );

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
   let pluginConfig = await homebridge.getPluginConfig( );
   GLOBAL.pluginConfig = pluginConfig;
   console.log("got pluginConfig start sending start");

   homebridge.request( "/startButtonPressed", pluginConfig );
}
async function backButtonPressed( )
{
   console.log("main.js async function back sending back");
   homebridge.request( "/backButtonPressed" );
}
async function showConfigureGlobalsPageButtonPressed( )
{
   console.log("main.js async function globals sending globals");
   homebridge.request( "/showConfigureGlobalsPage" );
}
async function showQueueGlobalsPageButtonPressed( )
{
   console.log("main.js async function globals sending globals");
   // unused
   homebridge.request( "/showQueueGlobalsPage" );
}
async function configureNewQueuePageButtonPressed()
{
   console.log("main.js async function configureNewQueuePageButtonPressed");
   if ( GLOBAL.newGlobalQueueBeingAdded == true )
   {
      homebridge.toast.error('A new queue has already been started.', 'Error');
      return;
   }
   GLOBAL.newGlobalQueueBeingAdded = true;

   console.log("Adding new queue");
               $( '#globalQueuesForm' ).append(
                  '<div class="row no-gutters">' +
                     '<div class="col">' +
                        '<div class="card card-body">' +
                           '<button type="submit" class="btn btn-primary p-0 mt-0 mb-0 deleteQueueButton" value="TEMP_QUEUE_NAME">' +
                              '<i class="fa fa-trash" aria-hidden="true"></i>' +
                           '</button>' +
                        '</div>' +
                     '</div>' +
                     '<div class="col">' +
                        '<div class="card card-body">' +
                           '<input type="text" class="input-group p-0 pt-0 pb-0 border-0" placeHolder="queueName">' +
                        '</div>' +
                     '</div>' +
                     '<div class="col">' +
                        '<div class="card card-body">' +
                           '<input type="text" class="input-group p-0 pt-0 pb-0 border-0" placeHolder="WoRm">' +
                        '</div>' +
                     '</div>' +
                  '</div>'
               );
}
async function deleteQueueButtonPressed( value  )
{
   console.log("main.js async function deleteQueueButtonPressed :%s", value);
}

// STARTUP CODE
( async ( ) =>
{

   try
   {
      // PAGE SWITCH EVENT
      homebridge.addEventListener('my-pageEvent', (event) =>
      {
         console.log("In Main.js server.js told me from:%s to:%s", event.data.from, event.data.to);

          $( event.data.from ).hide( );
          $( event.data.to ).show( );
      });

      // UPDATE accessoryTypeSelect
      let select = document.getElementById( "accessoryTypeSelect" );
      console.log("main.js select=%s", select);

      console.log( "In Cmd4.js select" );
      let CMD4_DEVICE_TYPE_ENUM = await homebridge.request( "/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM" );
      Object.keys( CMD4_DEVICE_TYPE_ENUM.properties ).forEach( key => {
         let defaultSelection = false;
         if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
         {
            console.log( " Setting default selection to true at: %s", key );
            defaultSelection = true;
         }
         //console.log( "In Cmd4.js select appending %s", CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName );
         select.appendChild( new Option( CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, defaultSelection, defaultSelection ) );
      } );


      GLOBAL.pluginConfig = await homebridge.getPluginConfig( );
      //GLOBAL.pluginConfig.forEach( ( elem, index ) =>
      //{
         //console.log( "GLOBAL.pluginConfig[ %s ] returned by homebridge: %s", index, elem );
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
         console.log("GLOBAL.pluginConfig[0]=%s", GLOBAL.pluginConfig[0] );
         console.log("GLOBAL.pluginConfig[0].queueTypes=%s", GLOBAL.pluginConfig[0].queueTypes );

         if ( GLOBAL.pluginConfig[0].queueTypes )
         {
            $( "#globalQueueMessage" ).hide( );
            $( "#globalQueueContainer" ).show( );
            //document.getElementById("globalQueueMessage").style.visibility = "hidden";

            GLOBAL.pluginConfig[0].queueTypes.forEach( entry =>
            {
               console.log("Adding queue: %s", entry.queue );
               $( '#globalQueuesForm' ).append(
                  '<div class="row no-gutters">' +
                     '<div class="col">' +
                        '<div class="card card-body">' +
                           '<button type="submit" class="btn btn-primary p-0 mt-0 mb-0 deleteQueueButton" value="' + entry.queue +'">' +
                              '<i class="fa fa-trash" aria-hidden="true"></i>' +
                           '</button>' +
                        '</div>' +
                     '</div>' +
                     '<div class="col">' +
                        '<div class="card card-body">' + entry.queue + '</div>' +
                     '</div>' +
                     '<div class="col">' +
                        '<div class="card card-body">' + entry.queueType + '</div>' +
                     '</div>' +
                  '</div>'
               );
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
   console.log(" main.js click .back");
   backButtonPressed();
} );

$( '#startButton' ).on( 'click', ( ) =>
{
   console.log("Click startButton");
   startButtonPressed();
});

$( '.showConfigureGlobalsPageButton' ).on( 'click', ( ) =>
{
   console.log("Click showConfigureGlobalsPageButton");
   showConfigureGlobalsPageButtonPressed();
} );

$( '.showQueueGlobalsPageButton' ).on( 'click', ( ) =>
{
   console.log("Click showQueueGlobalsPageButton");
   // unused
   showQueueGlobalsPageButtonPressed();
} );

$( '.configureNewQueuePageButton' ).on( 'click', ( ) =>
{
   console.log("Click configureNewQueuePageButton");
   configureNewQueuePageButtonPressed();
} );

$( '.deleteQueueButton' ).on( 'click', ( value ) =>
{
   console.log("Click deleteQueueButton value:%s", value );
   deleteQueueButtonPressed( value);
} );

async function populateSelect( )
{
   let select = document.getElementById( "accessoryType" );

   console.log( "In Cmd4.js select" );
   let CMD4_DEVICE_TYPE_ENUM = await homebridge.request( "/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM" );
   Object.keys( CMD4_DEVICE_TYPE_ENUM.properties ).forEach( key => {
      let defaultSelection = false;
      if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
      {
         console.log( " Setting default selection to true at: %s", key );
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

$( '#editAccessory' ).on( 'click', ( ) =>
{

   resetUI( );

   let selectedAccessory = $( '#accessorySelect option:selected' ).text( );
   let accessory = GLOBAL.pluginConfig[0].accessories.find( accessory => accessory.name === selectedAccessory );

   if ( !accessory )
      return homebridge.toast.error( 'Can not find the accessory!', 'Error' );

   console.log("EDIT ACCESSORY INCOMPLETE");
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

      resetUI( );

   }
   catch ( err )
   {

      homebridge.toast.error( err.message, 'Error' );

   }

} );

