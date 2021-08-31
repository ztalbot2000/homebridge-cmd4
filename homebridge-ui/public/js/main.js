/*global $, window, location, homebridge, schema*/

const GLOBAL =
{
   pluginConfig: false,
   customSchema: false,
   accessoryOptions: false,
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

   GLOBAL.accessoryOptions =
   {
      name: accessory.name,
      clientID: accessory.clientID,
      clientSecret: accessory.clientSecret,
      vin: accessory.vin,
      origin: location.origin
   };

   GLOBAL.customSchema = homebridge.createForm( schema,
   {
      name: GLOBAL.pluginConfig[0].name,
         debug: GLOBAL.pluginConfig[0].debug,
         accessories: accessory
   });

   GLOBAL.customSchema.onChange( async config =>
   {

      GLOBAL.pluginConfig[0].name = config.name;
         GLOBAL.pluginConfig[0].debug = config.debug;
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

   resetForm( );
   resetSchema( );

   return;

}

function resetForm( )
{

   $('#accessoryName').val('');
   $('#accessoryClientID').val('');
   $('#accessoryClientSecret').val('');
   $('#accessoryVIN').val('');
   $('#authCode').val('');
   $('#authToken').val('');
   $('#authRefreshToken').val('');
   $('#authTokenType').val('');
   $('#authExpiresIn').val('');
   $('#authExpiresAt').val('');

   $('#codeInput').hide();
   $('#tokenInput').hide();

   GLOBAL.accessoryOptions = false;

   return;

}

function resetSchema( )
{

   if ( GLOBAL.customSchema )
   {
      GLOBAL.customSchema.end( );
      GLOBAL.customSchema = false;
   }

   return;

}

function addAccessoryToList( accessory )
{

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $('#accessorySelect').append( '<option value="' + name + '">'+ name + '</option>' );

   return;

}

function removeAccessoryFromList( accessory )
{

   let name = typeof accessory === 'string' ? accessory : accessory.name;
   $( '#accessorySelect option[value=\'' + name + '\']').remove( );

   return;

}

async function addNewDeviceToConfig( accessory )
{

   let found = false;

   try
   {
      const config =
      {
         name: accessory.name,
         clientID: accessory.clientID,
         clientSecret: accessory.clientSecret,
         vin: accessory.vin,
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

         if (!GLOBAL.pluginConfig.length)
      {

         GLOBAL.pluginConfig = [
         {
            platform: 'MercedesPlatform',
               name: 'MercedesPlatform',
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

$('#addCar, #start').on('click', () =>
{

   resetUI();

      let activeContent = $('#notConfigured').css('display') !== 'none' ? $('#notConfigured') : $('#isConfigured');

      transPage(activeContent, $('#configureAccessory'));

});

$('#auth').on('click', () =>
{

   try
   {

      GLOBAL.accessoryOptions =
      {
         name: $('#accessoryName').val(),
            clientID: $('#accessoryClientID').val(),
            clientSecret: $('#accessoryClientSecret').val(),
            vin: $('#accessoryVIN').val(),
            origin: location.origin
      };

      let accessoryConfig = GLOBAL.pluginConfig[0].accessories.find(accessory => accessory && accessory.name === GLOBAL.accessoryOptions.name);

         if (accessoryConfig)
      {
         return homebridge.toast.error('There is already a accessory configured with the same name!', 'Error');
      }
      else if (!GLOBAL.accessoryOptions.name)
      {
         return homebridge.toast.error('There is no name configured for this accessory!', 'Error');
      }
      else if (!GLOBAL.accessoryOptions.clientID)
      {
         return homebridge.toast.error('There is no client ID configured for this accessory!', 'Error');
      }
      else if (!GLOBAL.accessoryOptions.clientSecret)
      {
         return homebridge.toast.error('There is no client secret configured for this accessory!', 'Error');
      }
      else if (!GLOBAL.accessoryOptions.vin)
      {
         return homebridge.toast.error('There is no VIN configured for this accessory!', 'Error');
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

         GLOBAL.accessoryOptions.authorizationUri = await homebridge.request('/authCode', GLOBAL.accessoryOptions);

         const win = window.open(GLOBAL.accessoryOptions.authorizationUri, 'windowname1', 'width=800, height=600');

         const pollTimer = window.setInterval(function()
      {
         if (win.document.URL.includes('?code='))
         {
            window.clearInterval(pollTimer);
               GLOBAL.accessoryOptions.autherization_code = win.document.URL.split('?code=')[1];
               $('#authCode').val(GLOBAL.accessoryOptions.autherization_code);
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

         GLOBAL.accessoryOptions.token = await homebridge.request('/authToken', GLOBAL.accessoryOptions);

         $('#authToken').val(GLOBAL.accessoryOptions.token.access_token);
         $('#authRefreshToken').val(GLOBAL.accessoryOptions.token.refresh_token);
         $('#authTokenType').val(GLOBAL.accessoryOptions.token.token_type);
         $('#authExpiresIn').val(GLOBAL.accessoryOptions.token.expires_in);
         $('#authExpiresAt').val(GLOBAL.accessoryOptions.token.expires_at);

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

      await addNewDeviceToConfig(GLOBAL.accessoryOptions);

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

   if (GLOBAL.customSchema && GLOBAL.accessoryOptions)
   {

      resetSchema();

         let accessory = GLOBAL.pluginConfig[0].accessories.find(accessory => accessory.name === GLOBAL.accessoryOptions.name);

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
