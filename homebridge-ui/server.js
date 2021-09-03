const { HomebridgePluginUiServer }
= require('@homebridge/plugin-ui-utils');
const { RequestError }
= require('@homebridge/plugin-ui-utils');
const { createHash }
= require('crypto');

// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
//const constants = require( "../cmd4Constants" );


// These would already be initialized by index.js
//let CMD4_ACC_TYPE_ENUM = require( "../lib/CMD4_ACC_TYPE_ENUM" ).CMD4_ACC_TYPE_ENUM;
//let CMD4_DEVICE_TYPE_ENUM = require( "../lib/CMD4_DEVICE_TYPE_ENUM" ).CMD4_DEVICE_TYPE_ENUM;


//orig const { AuthorizationCode } = require('simple-oauth2');

class UiServer extends HomebridgePluginUiServer
{
   constructor ()
   {

      super();
      //console.log("cons=%s", constants);

      //orig this.onRequest('/authCode', this.authCode.bind(this));
      //orig this.onRequest('/authToken', this.authToken.bind(this));

      //orig this.client = false;

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

}

(() =>
{
   return new UiServer;
})();
