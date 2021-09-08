/*global $, window, location, homebridge, schema*/



const GLOBAL =
{
   pluginConfig: false,
   customSchema: false,
   accessorySchema: false,
   currentContent: false,
   previousContent: [],
};

function toggleContent( )
{

   $('#header').hide( );
   $('#main').show( );

   return;

}

function transPage( cur, next, removed, showSchema )
{

   if ( showSchema )
   {

      cur.hide( );
      next.show( );

      //GLOBAL.previousContent.push($('#isConfigured'));
      GLOBAL.previousContent.push( cur );
      GLOBAL.currentContent = next;

      return;

   }
   else
   {

      toggleContent( );

   }

   if ( cur )
   {

      cur.fadeOut( 500, ( ) =>
      {

         next.fadeIn( 500 );

         if ( !removed )
            GLOBAL.previousContent.push( cur );

         GLOBAL.currentContent = next;

      });

   }
   else
   {

      next.fadeIn( 500 );

      if ( !removed )
         GLOBAL.previousContent.push( next );

      GLOBAL.currentContent = next;

   }

   if ( GLOBAL.customSchema )
      GLOBAL.customSchema.end( );

   homebridge.hideSchemaForm( );

   return;

}

function goBack( index )
{

   if ( GLOBAL.previousContent.length && GLOBAL.currentContent )
   {

      index = index === undefined
         ? GLOBAL.previousContent.length - 1
         : index;

      transPage( GLOBAL.currentContent, GLOBAL.previousContent[ index ], true );
      //GLOBAL.currentContent = GLOBAL.previousContent[index];
      GLOBAL.previousContent.splice( index, 1 );

      if ( GLOBAL.customSchema )
         GLOBAL.customSchema.end( );

   }

   return;

}

async function createCustomSchema( accessory )
{
   console.log("In CreateCustomSchema for:%s %s", accessory.name, accessory.displayName);
   console.log("In CreateCustomSchema accessory:%s", accessory );
   let settings = await homebridge.request("/cmd4StaticVariable", "settings");

   GLOBAL.accessorySchema =
   {
      name: accessory.name,
      accessoryCharacteristics: accessory.characteristics,
      polling: accessory.polling,
      origin: location.origin
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
   });

   GLOBAL.customSchema.onChange( async config =>
   {
      console.log("In customSchema.onChange config:%s %s", config);
      let settings = await homebridge.request("/cmd4StaticVariable", "settings");

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
      });

      try
      {

         await homebridge.updatePluginConfig( GLOBAL.pluginConfig );

      }
      catch( err )
      {

         homebridge.toast.error( err.message, 'Error' );

      }

   });

   return;

}

function resetUI( )
{
   console.log("In resetUI");

   resetForm( );
   resetSchema( );

   return;

}

function resetForm( )
{
   console.log("In resetForm");

   $('#accessoryName').val('');
   $('#accessoryCharacteristics').val('');
   $('#accessoryPolling').val('');
   $('#authCode').val('');
   $('#authToken').val('');
   $('#authRefreshToken').val('');
   $('#authTokenType').val('');
   $('#authExpiresIn').val('');
   $('#authExpiresAt').val('');

   $('#codeInput').hide();
   $('#tokenInput').hide();

   GLOBAL.accessorySchema = false;

   return;

}

function resetSchema( )
{
   console.log("In resetSchema");

   if ( GLOBAL.customSchema )
   {
      GLOBAL.customSchema.end( );
      GLOBAL.customSchema = false;
   }

   return;

}

function addAccessoryToList( accessory )
{
   console.log("In addAccessoryToList accessory.displayName:%s", accessory.displayName);

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $('#accessorySelect').append( '<option value="' + name + '">'+ name + '</option>' );

   return;

}

function removeAccessoryFromList( accessory )
{
   console.log("In removeAccessoryToList accessory.displayName:%s", accessory.displayName);

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect option[value=\'' + name + '\']').remove( );

   return;

}

async function addNewDeviceToConfig( accessory )
{
   console.log("In addNewDeviceToConfig for:%s %s", accessory.name, accessory.displayName);

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

   GLOBAL.pluginConfig[0].accessories.forEach((accessory, index) =>
   {
      if (accessory.name === selectedAccessory)
      {
         foundIndex = index;
      }
   });

   if (foundIndex !== undefined)
   {

      try
      {

         GLOBAL.pluginConfig[0].accessories.splice(foundIndex, 1);

         await homebridge.updatePluginConfig(GLOBAL.pluginConfig);
         await homebridge.savePluginConfig();

         removeAccessoryFromList(selectedAccessory);

         homebridge.toast.success(selectedAccessory + ' removed from config!', 'Success');

      }
      catch(err)
      {

         GLOBAL.pluginConfig = pluginConfigBkp;

         throw err;

      }

   }
   else
   {

      throw new Error('No accessory found in config to remove!');

   }

   return;

}

(async () =>
{

   try
   {

      GLOBAL.pluginConfig = await homebridge.getPluginConfig();
      GLOBAL.pluginConfig.forEach( ( elem, index ) =>
      {
         console.log("GLOBAL.pluginConfig[ %s ] returned by homebridge: %s", index, elem );
      });

      if (!GLOBAL.pluginConfig.length)
      {
         let settings = await homebridge.request('/cmd4StaticVariable', "settings");

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

         transPage(false, $('#notConfigured'));

      }
      else
      {

         if (!GLOBAL.pluginConfig[0].accessories || (GLOBAL.pluginConfig[0].accessories && !GLOBAL.pluginConfig[0].accessories.length))
         {
            GLOBAL.pluginConfig[0].accessories = [];
            return transPage(false, $('#notConfigured'));
         }

         GLOBAL.pluginConfig[0].accessories.forEach(accessory =>
         {
            $('#accessorySelect').append('<option value="' + accessory.name + '">'+ accessory.name + '</option>');
         });

         transPage(false, $('#isConfigured'));

      }

   }
   catch(err)
   {

      homebridge.toast.error(err.message, 'Error');

   }

})();

//jquery listener

$('.back').on('click', () =>
{
   goBack();
});

async function populateSelect( )
{
   let select = document.getElementById("accessoryType");

   console.log("In Cmd4.js select" );
   let CMD4_DEVICE_TYPE_ENUM = await homebridge.request("/cmd4StaticVariable", "CMD4_DEVICE_TYPE_ENUM");
   Object.keys( CMD4_DEVICE_TYPE_ENUM.properties).forEach(key => {
      let defaultSelection = false;
      if ( key == CMD4_DEVICE_TYPE_ENUM.Switch )
      {
         console.log(" Setting default selection to true at: %s", key );
         defaultSelection = true;
      }
      select.appendChild(new Option( CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, CMD4_DEVICE_TYPE_ENUM.properties[key].deviceName, defaultSelection, defaultSelection));
   });
}

$('#addAccessory, #start').on('click', () =>
{

   resetUI();

   populateSelect();


   let activeContent = $('#notConfigured').css('display') !== 'none' ? $('#notConfigured') : $('#isConfigured');

   transPage(activeContent, $('#configureAccessory'));

});

$('#globals, #start').on('click', () =>
{

   resetUI();

   let activeContent = $('#notConfigured').css('display') !== 'none' ? $('#notConfigured') : $('#isConfigured');

   transPage(activeContent, $('#configureGlobals'));

});

$('#auth').on('click', () =>
{

   try
   {

      GLOBAL.accessorySchema =
      {
         name: $('#accessoryName').val(),
         accessoryCharacteristics: $('#accessoryCharacteristics').val(),
         polling: $('#polling').val(),
         origin: location.origin
      };

      let accessoryConfig = GLOBAL.pluginConfig[0].accessories.find(accessory => accessory && accessory.name === GLOBAL.accessorySchema.name);

      if (accessoryConfig)
      {
         return homebridge.toast.error('There is already a accessory configured with the same name!', 'Error');
      }
      else if (!GLOBAL.accessorySchema.name)
      {
         return homebridge.toast.error('There is no name configured for this accessory!', 'Error');
      }
      else if (!GLOBAL.accessorySchema.accessoryCharacteristics)
      {
         return homebridge.toast.error('There is no client ID configured for this accessory!', 'Error');
      }
      else if (!GLOBAL.accessorySchema.polling)
      {
         return homebridge.toast.error('There is no Polling configured for this accessory!', 'Error');
      }

      transPage($('#configureAccessory'), $('#authentication'));

   }
   catch(err)
   {

      homebridge.toast.error(err.message, 'Error');

   }

});

$('#startAuth').on('click', async () =>
{

   try
   {

      homebridge.showSpinner();

      GLOBAL.accessorySchema.authorizationUri = await homebridge.request('/authCode', GLOBAL.accessorySchema);

      const win = window.open(GLOBAL.accessorySchema.authorizationUri, 'windowname1', 'width=800, height=600');

      const pollTimer = window.setInterval(function()
      {
         if (win.document.URL.includes('?code='))
         {
            window.clearInterval(pollTimer);
            GLOBAL.accessorySchema.autherization_code = win.document.URL.split('?code=')[1];
            $('#authCode').val(GLOBAL.accessorySchema.autherization_code);
            win.close();
            homebridge.hideSpinner();
            $('#codeInput').fadeIn();
         }
      }, 1000);

   }
   catch(err)
   {

      homebridge.hideSpinner();

      homebridge.toast.error(err.message, 'Error');

   }

});

$('#generateToken').on('click', async () =>
{

   try
   {

      homebridge.showSpinner();

      GLOBAL.accessorySchema.token = await homebridge.request('/authToken', GLOBAL.accessorySchema);

      $('#authToken').val(GLOBAL.accessorySchema.token.access_token);
      $('#authRefreshToken').val(GLOBAL.accessorySchema.token.refresh_token);
      $('#authTokenType').val(GLOBAL.accessorySchema.token.token_type);
      $('#authExpiresIn').val(GLOBAL.accessorySchema.token.expires_in);
      $('#authExpiresAt').val(GLOBAL.accessorySchema.token.expires_at);

      homebridge.hideSpinner();

      $('#tokenInput').fadeIn();

   }
   catch(err)
   {

      homebridge.hideSpinner();

      homebridge.toast.error(err.message, 'Error');

   }

});

$('#saveAuth').on('click', async () =>
{

   try
   {

      await addNewDeviceToConfig(GLOBAL.accessorySchema);

      transPage($('#authentication'), $('#isConfigured'));

   }
   catch(err)
   {

      homebridge.toast.error(err.message, 'Error');

   }

});

$('#editAccessory').on('click', () =>
{

   resetUI();

   let selectedAccessory = $( '#accessorySelect option:selected' ).text();
   let accessory = GLOBAL.pluginConfig[0].accessories.find(accessory => accessory.name === selectedAccessory);

   if (!accessory)
      return homebridge.toast.error('Can not find the accessory!', 'Error');

   createCustomSchema(accessory);

   transPage($('#main, #isConfigured'), $('#header'), false, true);

});

$('#refreshAccessory').on('click', async () =>
{

   if (GLOBAL.customSchema && GLOBAL.accessorySchema)
   {

      resetSchema();

      let accessory = GLOBAL.pluginConfig[0].accessories.find(accessory => accessory.name === GLOBAL.accessorySchema.name);

      if (!accessory)
         return homebridge.toast.error('Can not find accessory in config!', 'Error');

      transPage($('#isConfigured'), $('#authentication'));

   }

});

$('#removeAccessory').on('click', async () =>
{

   try
   {

      await removeDeviceFromConfig();

      resetUI();

      transPage(false, GLOBAL.pluginConfig[0].accessories.length ? $('#isConfigured') : $('#notConfigured'));

   }
   catch (err)
   {

      homebridge.toast.error(err.message, 'Error');

   }

});

