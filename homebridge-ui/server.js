const { HomebridgePluginUiServer }
= require('@homebridge/plugin-ui-utils');
const { RequestError }
= require('@homebridge/plugin-ui-utils');
const { createHash }
= require('crypto');

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
const constants = require( "../cmd4Constants" );


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

      //orig this.onRequest('/authCode', this.authCode.bind(this));
      //orig this.onRequest('/authToken', this.authToken.bind(this));

      //orig this.client = false;

      // Allow main.js to access Cmd4 Static variables as html files cannot
      // require Cmd4 javascript files
      this.onRequest('/cmd4StaticVariable', this.cmd4StaticVariable.bind(this));
      this.onRequest('/ACC_Info', this.cmd4AccInfo.bind(this));
      this.onRequest('/DEVICE_Info', this.cmd4DeviceInfo.bind(this));

      // handle request for the /token route
      this.onRequest('/token', this.generateToken.bind(this));

      this.ready();
   }

   async generateToken(payload)
   {
      console.log('Username:', payload.username);

      // sleep for 1 second, just to demo async works
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try
      {
         // generate a sha256 from the username and use that as a fake token
         const hashedUsername = createHash('sha256').update(payload.username).digest().toString('hex');

         // return data to the ui
         return
         {
            token: hashedUsername
         }
      }
      catch (e)
      {
         throw new RequestError('Failed to Generate Token', { message: e.message }
         );
      }

   }

   /*
     async authCode(config){

       this.client = false;

       const params = {
         client: {
           id: config.accessoryCharacteristics
         },
         auth: {
           tokenHost: 'https://id.mercedes-benz.com',
           tokenPath: '/as/token.oauth2',
           authorizePath: '/as/authorization.oauth2'
         }
       };

       const redirect_uri = config.origin;
       const scopes = 'mb:vehicle:mbdata:vehiclestatus mb:vehicle:mbdata:fuelstatus mb:vehicle:mbdata:evstatus mb:vehicle:mbdata:vehiclelock mb:vehicle:mbdata:payasyoudrive offline_access';

       this.client = new AuthorizationCode(params);

       const authorizationUri = this.client.authorizeURL({
         redirect_uri: redirect_uri,
         scope: scopes
       });

       return authorizationUri;

     }

     async authToken(config){

       const code = config.autherization_code;

       const options = {
         code,
         redirect_uri: config.origin,
         scope: 'mb:vehicle:mbdata:vehiclestatus mb:vehicle:mbdata:fuelstatus mb:vehicle:mbdata:evstatus mb:vehicle:mbdata:vehiclelock mb:vehicle:mbdata:payasyoudrive offline_access'
       };

       try {

         const accessToken = await this.client.getToken(options);

         return accessToken;

       } catch (err) {

         throw new RequestError(err.message);

       }

     }
   */

   // A method for main.js to access Static Cmd4 variables
   async cmd4StaticVariable( variableString )
   {
      console.log("server.js for %s returning: %s", variableString, eval(variableString));
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

}

(() =>
{
   return new UiServer;
})();
