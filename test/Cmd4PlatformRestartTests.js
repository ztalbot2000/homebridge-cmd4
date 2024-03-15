"use strict";

const settings = require( "../cmd4Settings" );

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};




// For caching/uncaching accessories to disk, like homebridge does.
const node_persist_1 = __importDefault(require("node-persist"));

const path = require( "path" );
const TEST_BASE_DIR = path.join(__dirname, "tmp");

const rmdir = require('rimraf');

function rand(prefix)
{
  return (prefix ? prefix + '-' : '') + (+ new Date()) + '-' + Math.floor(Math.random() * 1000);
}
function randDir ()
{
   //return path.join(TEST_BASE_DIR, '/' + "static" );
   return path.join(TEST_BASE_DIR, '/' + rand());
}

function loadCachedPlatformAccessoriesFromDisk( accessoryStorage, cachedAccessoriesFile = "accessories" )
{
   let cachedAccessories;

   cachedAccessories = accessoryStorage.getItemSync( cachedAccessoriesFile );
   if ( cachedAccessories )
   {
      return cachedAccessories.map(serialized =>
      {
          return platformAccessory_1.PlatformAccessory.deserialize(serialized);
      });

   } else {
      console.log( `Woops, missing ${ cachedAccessoriesFile }` );
   }
}

function restoreCachedPlatformAccessories( cmd4Platform, cachedPlatformAccessories )
{

   if ( cachedPlatformAccessories._associatedPlatform == settings.PLATFORM_NAME )
   {
      //console.log("stuffing:%s", cachedPlatformAccessories );
      cmd4Platform.configureAccessory( cachedPlatformAccessories );
   }
}

function saveCachedPlatformAccessoriesOnDisk( cachedPlatformAccessories, accessoryStorage, cachedAccessoriesFile = "accessories"  )
{

   if ( cachedPlatformAccessories && cachedPlatformAccessories.length > 0 )
   {
      const serializedAccessories = cachedPlatformAccessories.map(Cmd4Accessory => platformAccessory_1.PlatformAccessory.serialize(Cmd4Accessory));
      accessoryStorage.setItemSync( cachedAccessoriesFile, serializedAccessories );

   } else {
      console.log( `Woops, cachedPlatformAccessories ${ cachedPlatformAccessories } is empty/null` );
   }
}




var _api = new HomebridgeAPI(); // object we feed to Plugins


// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;

// A config file to play with.
let TVConfig =
{
   platform:                      "Cmd4",
   outputConstants:               false,
   cmd4_Mode:                     "Demo",
   accessories:
   [
      {   type:                   "Television",
          category:               "TELEVISION",
          publishExternally:      false,
          name:                   "Example TV",
          active:                 "ACTIVE",
          activeIdentifier:        1,
          configuredName:         "Example TV",
          manufacturer:           "Example TV Mfg.",
          model:                  "Example TV Model",
          serialNumber:           "Example TV Sn.",
          sleepDiscoveryMode:     "ALWAYS_DISCOVERABLE",
          accessories:
          [
             {   type:               "TelevisionSpeaker",
                 displayName:        "My TvSpeaker",
                 name:               "My TVSpeaker",
                 active:             "ACTIVE",
                 mute:               "FALSE",
                 volumeSelector:     1,
                 volume:             10,
                 volumeControlType:  "ABSOLUTE"
              }
          ],
          linkedTypes:
          [
             {   type:                   "InputSource",
                 displayName:            "HDMI1",
                 configuredName:         "HDMI 1",
                 currentVisibilityState: "SHOWN",
                 inputSourceType:        "HDMI",
                 isConfigured:           "CONFIGURED",
                 identifier:              1,
                 targetVisibilityState:  "SHOWN",
                 manufacturer:           "HDMI 1 Mfg.",
                 model:                  "HDMI 1 Model",
                 serialNumber:           "HDMI 1 Sn.",
                 name:                   "HDMI 1"
             },
             {   type:                   "InputSource",
                 displayName:             "HDMI 2",
                 configuredName:         "HDMI 2",
                 currentVisibilityState: "SHOWN",
                 inputSourceType:        "HDMI",
                 isConfigured:           "CONFIGURED",
                 identifier:              2,
                 targetVisibilityState:  "SHOWN",
                 manufacturer:           "HDMI 2 Mfg.",
                 model:                  "HDMI 2 Model",
                 serialNumber:           "HDMI 2 Sn.",
                 name:                   "HDMI 2"
             },
             {   type:                   "InputSource",
                 displayName:            "Netflix",
                 configuredName:         "Netflix",
                 currentVisibilityState: "SHOWN",
                 inputSourceType:        "HDMI",
                 isConfigured:           "CONFIGURED",
                 identifier:              3,
                 targetVisibilityState:   "SHOWN",
                 manufacturer:            "Netflix Mfg.",
                 model:                   "Netflix Model",
                 serialNumber:            "Netflix Sn.",
                 name:                    "Netflix"
              }
           ],
           displayOrder:              0,
           currentMediaState:         "STOP",
           targetMediaState:          "STOP",
           pictureMode:               "STANDARD",
           remoteKey:                 "SELECT"
      }
   ]
};


// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});




describe( "Testing Cmd4Platform Setup", function( )
{
   it( "Test if Cmd4Platform exists", function ( )
   {
      expect( Cmd4Platform ).not.to.be.a( "null", "Cmd4Platform was null" );
   });

   it( "Test init Cmd4Platform", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, TVConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );


      //expect( cmd4Platform.createdCmd4Platforms.length ).to.equal( 1, "cmd4Platform.createdCmd4Platforms.length is not 1. Found:" + cmd4Platform.createdCmd4Platforms.length );
   });

   it( "Test node-persist", function( )
   {
      let rc;
      let options = {
         dir: randDir(),
         // logging: true
      };

      //after( function( done )
     // {
     //    rmdir( options.dir, done);
      //});

      const accessoryStorage = node_persist_1.default.create();

      accessoryStorage.initSync( options ); // Setup Accessory Cache Storage

      assert.ok( fs.existsSync( options.dir ) );

      accessoryStorage.setItem( "name", "yourName" );

      rc = accessoryStorage.getItem('name');

      assert.equal(rc, 'yourName', `write/read didn't work`);

      accessoryStorage.clear();

   });

});

describe( "Testing Cmd4Platform", function( )
{
   const accessoryStorage = node_persist_1.default.create();

   let options = {
       dir: randDir(),
       // logging: true
   };

   beforeEach(async function( )
   {
      await accessoryStorage.init( options );
   });

   after( function( done )
   {
      rmdir( options.dir, done );
   });

   it( "Test trigger of Cmd4Platform.didFinishLoading", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let cmd4Platform=new Cmd4Platform( log, TVConfig, _api );
      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      // Instead of emitting didFinishLaunching which would cause other
      // instances to also do the didFinishLaunching and start their polling
      // as well,
      cmd4Platform.discoverDevices( );


      assert.equal(cmd4Platform.createdCmd4Platforms.length, 1, `Incorrect number of Cmd4Accessories created. result: ${ cmd4Platform.createdCmd4Platforms.length }` );

      saveCachedPlatformAccessoriesOnDisk( cmd4Platform.createdCmd4Platforms, accessoryStorage )

      loadCachedPlatformAccessoriesFromDisk( accessoryStorage );
   });

   it( "Test reload of saved Platforms with value change to disk", function( )
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // We need our own instance as emitting "didFinishLaunching" triggers other testcases

      let cmd4Platform = new Cmd4Platform( log, TVConfig, _api );

      // Instead of emitting didFinishLaunching which would cause other
      // instances to also do the didFinishLaunching and start their polling
      // as well,
      cmd4Platform.discoverDevices( );

      assert.equal(cmd4Platform.createdCmd4Platforms.length, 1, `Incorrect number of Cmd4Platforms created. result: ${ cmd4Platform.createdCmd4Platforms.length }` );
      assert.equal(cmd4Platform.createdCmd4Accessories.length, 5, `Incorrect number of Cmd4Accessories created. result: ${ cmd4Platform.createdCmd4Accessories.length }` );
      // This would have been already tested in Cmd4AccessorySetValue.js
      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[4];

      let acc = CMD4_ACC_TYPE_ENUM.ConfiguredName;
      let foundConfiguredName = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
      assert.equal( foundConfiguredName, TVConfig.accessories[0].configuredName, `Incorrect configuredName: ${ foundConfiguredName }` );

      let newValue = "NEW_TV";


      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );
      cmd4Accessory.setCachedValue( acc, "ConfiguredName", newValue, function( rc )
      {
         assert.equal( rc, null, `setCachedValue expected: zero received: ${ rc }` );

         assert.include( log.logBuf, `[34mSetting (Cached) Example TV ConfiguredName\u001b[39m NEW_TV`, `setCachedValue Incorrect stdout: ${ log.logBuf }` );

         let result = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
         assert.equal( result, newValue, " setCachedValue Incorrect result" );

         // Clear the log buffer for next time.
         log.reset();

         saveCachedPlatformAccessoriesOnDisk( cmd4Platform.createdCmd4Platforms, accessoryStorage  )

         // Simulate a restart of homebridge with a new Cmd4Platform instance and the stored date reloaded.
         let cachedPlatformAccessories = loadCachedPlatformAccessoriesFromDisk( accessoryStorage );

         log.debug(" *****  RUNNING NEXT PLATFORM *****  " );
         let cmd4Platform2 = new Cmd4Platform( log, TVConfig, _api );

         cachedPlatformAccessories.forEach( ( entry ) =>
         {
            restoreCachedPlatformAccessories( cmd4Platform2, entry );
         });

         // Instead of emitting didFinishLaunching which would cause other
         // instances to also do the didFinishLaunching and start their polling
         // as well,
         cmd4Platform2.discoverDevices( );

         cmd4Accessory = cmd4Platform2.createdCmd4Accessories[4];
         let newFoundConfiguredName = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
         assert.equal( newFoundConfiguredName, newValue, `Incorrect configuredName: ${  newFoundConfiguredName }` );

      });

      //restoreCachedPlatformAccessories( cmd4Platform, cachedPlatformAccessories );

      //cmd4Platform.configureAccessory( cachedPlatformAccessories );

      //expect( cmd4Platform.createdCmd4Accessories.length ).to.equal( 1, "cmd4Platform.createdCmd4Accessories.length is not 1. Found:" + cmd4Platform.createdCmd4Accessories.length );

   });

   it( "Test reload of saved Platforms with value change to disk", function( )
   {
      let SwitchConfig =
      {
         platform:                     "Cmd4",
         accessories :
         [
            {   type:                   "Switch",
                name:                   "Example Switch",
                configuredName:         "Example Switch",
                on:                     0
            }
         ]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // We need our own instance as emitting "didFinishLaunching" triggers other testcases

      let cmd4Platform = new Cmd4Platform( log, SwitchConfig, _api );

      // Instead of emitting didFinishLaunching which would cause other
      // instances to also do the didFinishLaunching and start their polling
      // as well,
      cmd4Platform.discoverDevices( );

      assert.equal(cmd4Platform.createdCmd4Platforms.length, 1, `Incorrect number of Cmd4Platforms created. result: ${ cmd4Platform.createdCmd4Platforms.length }` );
      assert.equal(cmd4Platform.createdCmd4Accessories.length, 1, `Incorrect number of Cmd4Accessories created. result: ${ cmd4Platform.createdCmd4Accessories.length }` );
      // This would have been already tested in Cmd4AccessorySetValue.js
      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];

      let acc = CMD4_ACC_TYPE_ENUM.ConfiguredName;
      let foundConfiguredName = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
      assert.equal( foundConfiguredName, SwitchConfig.accessories[0].configuredName, `Incorrect configuredName: ${ foundConfiguredName }` );

      let newValue = "NEW_Switch";


      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );
      cmd4Accessory.setCachedValue( acc, "ConfiguredName", newValue, function( rc )
      {
         cmd4Accessory.configuredName=newValue;
         assert.equal( rc, null, `setCachedValue expected: zero received: ${ rc }` );

         assert.include( log.logBuf, `[34mSetting (Cached) Example Switch ConfiguredName\u001b[39m NEW_Switch`, `setCachedValue Incorrect stdout: ${ log.logBuf }` );

         let result = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
         assert.equal( result, newValue, " setCachedValue Incorrect result" );

         // Clear the log buffer for next time.
         log.reset();

         saveCachedPlatformAccessoriesOnDisk( cmd4Platform.createdCmd4Platforms, accessoryStorage  )

         // Simulate a restart of homebridge with a new Cmd4Platform instance and the stored date reloaded.
         let cachedPlatformAccessories = loadCachedPlatformAccessoriesFromDisk( accessoryStorage );

         log.debug(" *****  RUNNING NEXT PLATFORM *****  " );
         let cmd4Platform2 = new Cmd4Platform( log, SwitchConfig, _api );

         cachedPlatformAccessories.forEach( ( entry ) =>
         {
            restoreCachedPlatformAccessories( cmd4Platform2, entry );
         });

         // Instead of emitting didFinishLaunching which would cause other
         // instances to also do the didFinishLaunching and start their polling
         // as well,
         cmd4Platform2.discoverDevices( );

         cmd4Accessory = cmd4Platform2.createdCmd4Accessories[0];
         let newFoundConfiguredName = cmd4Accessory.cmd4Storage.getStoredValueForIndex( acc );
         assert.equal( newFoundConfiguredName, newValue, `Incorrect configuredName: ${  newFoundConfiguredName }` );

      });

      //restoreCachedPlatformAccessories( cmd4Platform, cachedPlatformAccessories );

      //cmd4Platform.configureAccessory( cachedPlatformAccessories );

      //expect( cmd4Platform.createdCmd4Accessories.length ).to.equal( 1, "cmd4Platform.createdCmd4Accessories.length is not 1. Found:" + cmd4Platform.createdCmd4Accessories.length );

   });

   it( "Test fix of bug#130, Linked types not accessable after restart", function( )
   {
      // Note: I tested this by changing Cmd4Platform.js and putting back the old code and it failed. so this test is valid. the code being:
      // ** WRONG **
      // linkedAccessory.service = linkedAccessory.platform.getService( devProperties.service, linkedAccessory.name, linkedAccessory.subType );
      // ** CORRECT **
      // linkedAccessory.service = linkedAccessory.platform.getService( linkedAccessory.name, linkedAccessory.subType );
      let LightConfig =
      {
         platform:  "Cmd4",
         accessories:
         [{
             type:                     "Lightbulb",
             displayName:              "Light1",
             on:                       0,
             stateChangeResponseTime:  1,
             brightness:               100,
             hue:                      200,
             saturation:               100,
             state_cmd:                "node .homebridge/Cmd4Scripts/State.js",
//           polling:                  [ { characteristic: "on" },
//                                       { characteristic: "brightness" }
//                                     ],
             linkedTypes: [{
                type:                  "Lightbulb",
                displayName:           "Light2",
                on:                    0,
                brightness:            0,
                stateChangeResponseTime: 1,
                state_cmd:             "node .homebridge/Cmd4Scripts/State.js",
//              polling:               [ { characteristic: "on" },
//                                       { characteristic: "brightness" }
//                                     ]
              }]

         }]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      // We need our own instance as emitting "didFinishLaunching" triggers other testcases

      let cmd4Platform = new Cmd4Platform( log, LightConfig, _api );

      // Instead of emitting didFinishLaunching which would cause other
      // instances to also do the didFinishLaunching and start their polling
      // as well,
      cmd4Platform.discoverDevices( );

      assert.include( log.logBuf, `Creating linked accessories for: Light1`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Adding getCachedValue for Light2 characteristic: Brightness`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      log.reset( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      saveCachedPlatformAccessoriesOnDisk( cmd4Platform.createdCmd4Platforms, accessoryStorage  )

      // Simulate a restart of homebridge with a new Cmd4Platform instance and the stored date reloaded.
      let cachedPlatformAccessories = loadCachedPlatformAccessoriesFromDisk( accessoryStorage );

      log.debug(" *****  RUNNING NEXT PLATFORM *****  " );
      let cmd4Platform2 = new Cmd4Platform( log, LightConfig, _api );

      cachedPlatformAccessories.forEach( ( entry ) =>
      {
         restoreCachedPlatformAccessories( cmd4Platform2, entry );
      });

      // Instead of emitting didFinishLaunching which would cause other
      // instances to also do the didFinishLaunching and start their polling
      // as well,
      cmd4Platform2.discoverDevices( );

      assert.include( log.logBuf, `Creating linked accessories for: Light1`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `Adding getCachedValue for Light2 characteristic: Brightness`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

   });

   // Next testcase
   // saveCachedPlatformAccessoriesOnDisk( cachedPlatformAccessories, accessoryStorage, cachedAccessoryPath, cachedAccessoriesFile = "cachedAccessories" )

});


