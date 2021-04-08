"use strict";



// ***************** TEST LOADING **********************


var pluginModule = require( "../index" );


describe(`Testing load of index.js`, ( ) =>
{
   it( `index.js loaded should not be null`, ( ) =>
   {
      assert.isNotNull(pluginModule, `loading resulted in null` );
   });

   var t = typeof pluginModule.default;
   it( `index.js default initializer should be found`, ( ) =>
   {
      assert.equal(t, `function` );
   });
});

describe( `Testing homebridge API`, ( ) =>
{
   it( `API should not be null`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      assert.isNotNull( apiInstance, ` apiInstance is null` );
   });
});

describe( `Testing homebridge setup`, ( ) =>
{
   it( `HAP Categories should not be null`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      assert.isNotNull( apiInstance.hap.Categories, `Categories is null` );
   });

   it( `HAP Characteristic should be a function`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      assert.isFunction( apiInstance.hap.Characteristic, "Characteristic is not an function" );
   });
   it( `HAP Accessory should be a function`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      assert.isFunction( apiInstance.hap.Accessory, `apiInstance.hap.Accessory is not an function` );
   });
   it( `HAP Service should be a function`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      assert.isFunction( apiInstance.hap.Service, ` apiInstance.hap.Service is not an function` );
   });
});


// ***************** TEST Plugin Un Initialized Variables ***************

describe( `Testing index.js plugin unInitialized variables.`, ( ) =>
{
   it( `Plugin CMD4_DEVICE_TYPE_ENUM should be a object`, ( ) =>
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM, `CMD4_DEVICE_TYPE_ENUM is not an object` );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM should be a object`, ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined`, ( ) =>
   {
      assert.equal(CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, `CMD4_DEVICE_TYPE_ENUM.EOL is incorrect` );
   });
   it( `Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined`, ( ) =>
   {
      assert.equal(CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, "CMD4_ACC_TYPE_ENUM.EOL is incorrect" );
   });
});

// ***************** TEST Plugin Initialized Variables ***************

describe( `Testing index.js plugin Initialized variables.`, ( ) =>
{
   it( `Initialized Plugin CMD4_DEVICE_TYPE_ENUM.EOL should be correct`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );

      assert.equal(cmd4.CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, "returned CMD4_DEVICE_TYPE_ENUM.EOL is incorrect" );
   });
   it( `Initialized Plugin returned CMD4_ACC_TYPE_ENUM.EOL should be correct`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );

      assert.equal(cmd4.CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, `returned CMD4_ACC_TYPE_ENUM.EOL is incorrect` );
   });

   it( `Initialized Plugin returned CMD4_DEVICE_TYPE_ENUM.properties length should be correct`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );
      let properties = cmd4.CMD4_DEVICE_TYPE_ENUM.properties;

      assert.equal(Object.keys(properties).length, DEVICE_EOL, 'returned CMD4_DEVICE_TYPE_ENUM.properties length is incorrect' );
   });

   it( `Initialized Plugin returned CMD4_ACC_TYPE_ENUM.properties length should be correct`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );
      let properties = cmd4.CMD4_ACC_TYPE_ENUM.properties;

      assert.equal(Object.keys(properties).length, ACC_EOL, 'returned CMD4_ACC_TYPE_ENUM.properties length is incorrect' );
   });

   it( `Initialized Plugin returned CMD4_ACC_TYPE_ENUM.properties[0-${ ACC_EOL }].Characteristic should be defined`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );
      let properties = cmd4.CMD4_ACC_TYPE_ENUM.properties;

      for ( let accTypeEnumIndex = 0; accTypeEnumIndex < ACC_EOL; accTypeEnumIndex++ )
      {
         assert.isNotNull( properties[ accTypeEnumIndex ].characteristic, `Characteristic at index: ${ accTypeEnumIndex } is null. found ${ properties[ accTypeEnumIndex ].characteristic }` );
      }
   });

   it( `Initialized Plugin returned CMD4_DEVICE_TYPE_ENUM.properties[0-${ DEVICE_EOL }].service should be defined`, ( ) =>
   {
      let apiInstance = new HomebridgeAPI();
      let cmd4 = pluginModule.default( apiInstance );
      let properties = cmd4.CMD4_DEVICE_TYPE_ENUM.properties;

      for ( let deviceTypeEnumIndex = 0; deviceTypeEnumIndex < DEVICE_EOL; deviceTypeEnumIndex++ )
      {
         assert.isNotNull( properties[ deviceTypeEnumIndex ].service, `service at index: ${ deviceTypeEnumIndex } is null.. found ${ properties[ deviceTypeEnumIndex ].service }` );
      }
   });
   /*
   // While this works individualy, it intercepts loading from other unit tests
   it( `Initialized Plugin returned CMD4_DEVICE_TYPE_ENUM.properties[0-${ DEVICE_EOL }].service should be defined`, ( ) =>
   {
      let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;


      const log = new Logger( );
      log.setBufferEnabled( );

      var apiInstance = new HomebridgeAPI(); // object we feed to Plugins

      let cmd4 = pluginModule.default( apiInstance );
      let CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;
      let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
      assert.equal( CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, "returned CMD4_DEVICE_TYPE_ENUM.EOL is incorrect" );
      assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, `returned CMD4_ACC_TYPE_ENUM.EOL is incorrect` );

      let config =
      {
          "platform": "Cmd4",
          "name": "Cmd4",
          "RestartRecover": true,
          "Fetch": "Cached",
          "accessories":
          [
             {
                "Type": "Switch",
                "Name": "PS_4",
                "DisplayName": "PS_4",
                "On": false,
              }
           ]
       }

      let cmd4Platform = new Cmd4Platform( log, config, apiInstance );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );
      assert.equal( log.logBuf, "", ` cmd4Platform unexpected output received: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Platform unexpected error output received: ${ log.errBuf }` );
      log.reset( );


      apiInstance.emit("didFinishLaunching");

      let expectedOutput = `Cmd4Platform didFinishLaunching`;
      assert.include( log.logBuf, expectedOutput, `didFinishLaunching not called result: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` cmd4Platform unexpected error output received: ${ log.errBuf }` );

   });
   */
});
