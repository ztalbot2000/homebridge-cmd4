'use strict';

const assert = require( "chai" ).assert;

const cmd4Config = require( "../Extras/config.json" );


describe( "Testing our config.json )", ( ) =>
{
   it( "cmdConfig should be a JSON object", ( ) =>
   {
      assert.isObject( cmd4Config, "cmd4Config is not an object" );
   });

})
//var API = require( "../node_modules/homebridge/lib/api" ).API;
//var _api = new API( ); // object we feed to Plugins
var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI( ); // object we feed to Plugins



// This would be the plugin un-initialized
var pluginModule = require( "../index" );

describe( "Initializing our plugin module", ( ) =>
{});

var cmd4 = pluginModule.default( _api );

let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;


describe( "Testing our config.json )", ( ) =>
{
   const accessories = cmd4Config.platforms[0].accessories;
   for ( let index=0; index < accessories.length; index ++ )
   {
      testAccessoryConfig(   accessories[index]   );
   }
});

describe( "Testing CMD4_DEVICE_TYPE_ENUM devices all defined", ( ) =>
{
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
   //for ( let index=0; index < 2; index ++ )
   {
      let deviceToFind = CMD4_DEVICE_TYPE_ENUM.properties[ index ].deviceName;

      // Skip those we do not care about
      if ( deviceToFind == "AccessoryInformation"         ||
           deviceToFind == "BridgeConfiguration"          ||
           deviceToFind == "BridgingState"                ||
           deviceToFind == "CameraControl"                ||
           deviceToFind == "CameraRTPStreamManagement"    ||
           deviceToFind == "Pairing"                      ||
           deviceToFind == "ProtocolInformation"          ||
           deviceToFind == "TunneledBTLEAccessoryService" )
         continue;

      let deviceFound = "";

      it( "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].deviceName ( " + deviceToFind + " ) should be defined in config.json", ( ) =>
      {
         const accessories = cmd4Config.platforms[0].accessories;
         for ( let dindex=0; dindex < accessories.length; dindex ++ )
         {
             // console.log( "checking " + accessories[dindex].type + " for " + deviceToFind );
             if ( accessories[dindex].type == deviceToFind )
             {
                deviceFound = deviceToFind;
                dindex = 10000;
             }
         }

         assert.equal( deviceFound, deviceToFind, "Device:" + deviceToFind + " not listed in config.json" );
      });
   }
});

describe( "Testing CMD4_DEVICE_TYPE_ENUM devices all defined", ( ) =>
{
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
   //for ( let index=0; index < 2; index ++ )
   {
      let deviceToFind = CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;

      // Skip those we do not care about
      if ( deviceToFind == "AccessoryInformation"         ||
           deviceToFind == "BridgeConfiguration"          ||
           deviceToFind == "BridgingState"                ||
           deviceToFind == "CameraControl"                ||
           deviceToFind == "CameraRTPStreamManagement"    ||
           deviceToFind == "Pairing"                      ||
           deviceToFind == "ProtocolInformation"          ||
           deviceToFind == "TunneledBTLEAccessoryService" )
         continue;

      let deviceFound = "";

      it( "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].deviceName ( " + deviceToFind + " ) should be defined in config.json", ( ) =>
      {
         const accessories = cmd4Config.platforms[0].accessories;
         for ( let dindex=0; dindex < accessories.length; dindex ++ )
         {
             // console.log( "checking " + accessories[dindex].type + " for " + deviceToFind );
             if ( accessories[dindex].type == deviceToFind )
             {
                deviceFound = deviceToFind;
                dindex = 10000;
             }
         }

         assert.equal( deviceFound, deviceToFind, "Device:" + deviceToFind + " not listed in config.json" );
      });
   }
});

function testAccessoryConfig ( accessoryConfig )
{
   describe( "Testing Device Name:" + accessoryConfig.displayName, ( ) =>
   {
      for ( let key in accessoryConfig )
      {
         let value = accessoryConfig[key];

         let ucKey = ucFirst( key );

         switch ( ucKey )
         {
            case "Type":
               testType ( value );

               break;
            case "DisplayName":
               testName( value );

               break;
            case "UUID":
               testName( value );

               break;
            case "Name":
               testName( value );

               break;
            case "Model":
               testName( value );

               break;
            case "Manufacturer":
               testName( value );

               break;
            case "SerialNumber":
               testName( value );

               break;
            case "OutputConstants":
               break;
            case "Timeout":
               testTimeout( value );

               break;
            case "Polling":
               testPollingConfig( value );

               break;
            case "Interval":
              testInterval( value );

              break;
           case "StateChangeResponseTime":
              testStateChangeResponseTime( value );

              break;
           case "State_cmd_prefix":
              testStateCmd( value );

              break;
           case "State_cmd":
              testStateCmd( value );

              break;
           case "State_cmd_suffix":
              break;
           case "Fakegato":
              testFakegatoConfig( value );

              break;
           case "Requires":
               break;
           case "Constants":
              processConstantsConfig( value );

              break;
           case "Variables":
              processVariablesConfig( value );
              break;
           case "LinkedTypes":

              processLinkedTypesConfig ( value );

              break;
           case "Url":
              break;
           default:
           {
              testCharacteristic( ucKey, value );
           }
        }
      }

      // Test that we define displayName
      it( "Testing for a displayName", ( ) =>
      {
         assert.isNotNull( accessoryConfig.displayName , "displayName cannot be undefined" );
      });

   });
}

function testConstantKey( key )
{
   it( "Constant key:" + key + " must start with '${'", ( ) =>
   {
      assert.isTrue( key!=null && key.startsWith( '${' ), "Constant:'" + key + "' does not start with '${'" );
   });
   it( "Constant key:" + key + " should end with '}'", ( ) =>
   {
      assert.isTrue( key!=null && key.endsWith( "}" ), "Constant:'" + key + "' does not end with '}'" );
   });
}

function processConstantsConfig( config )
{
   if ( Array.isArray( config ) )
   {
      for ( let i = 0; i < config.length; i++ )
      {
         processConstantsConfig( config[ i ] );
      }
      return;
   }
   if ( isJSON( config ) )
   {
      describe( "test JSON Config", ( ) =>
      {});

      // I assume only 1, but you know about assuming ...
      for ( let key in config )
      {
         let keyToAdd = key ;
         let valueToAdd = config[ key ] ;

         testConstantKey( key );

         // remove any leading and trailing single quotes
         // so that using it for replacement will be easier.
         //valueToAdd.replace( /^'/, "" )
         //valueToAdd.replace( /'$/, "" )

      }
      return;
   }
   it( "Constant Config must be valid", ( ) =>
   {
      assert.isTrue( isJSON( config ), "Constants:'" + config + "'  must be an array of/or list of key/value pairs" );
   });
}
function testVariableKey( key )
{
   it( "Variable key:" + key + " must start with '${'", ( ) =>
   {
      assert.isTrue( key!=null && key.startsWith( '${' ), "Variable:'" + key + "' does not start with '${'" );
   });
   it( 'Variable key:' + key + ' should end with \'}\'', ( ) =>
   {
      assert.isTrue( key!=null && key.endsWith( '}' ), "Variable '" + key + "' does not end with '}'" );
   });
}
function processVariablesConfig( config )
{
   if ( Array.isArray( config ))
   {
      for ( let i = 0; i < config.length; i++ ) {
         processVariables( config[ i ] );
      }
      return;
   }
   if ( isJSON ( config ) )
   {
      // I assume only 1, but you know about assuming ...
      for ( let key in config )
      {
         let keyToAdd = key ;
         let valueToAdd = config[ key ] ;

         testVariableKey( key );

         // remove any leading and trailing single quotes
         // so that using it for replacement will be easier.
         valueToAdd.replace( /^'/, "" )
         valueToAdd.replace( /'$/, "" )

         // Need to test is constants exist for valueToAdd

         return;
      }
   }
   it( "Variable Config must be valid", ( ) =>
   {
      assert.isTrue( isJSON( config ), "Variable:'" + config + "'  must be an array of/or list of key/value pairs" );
   });
}
function processLinkedTypesConfig( config )
{
   if ( Array.isArray ( config ) )
   {
      for ( let i = 0; i < config.length; i++ )
      {
         processLinkedTypesConfig( config[ i ] );
      }
      return;
   }
   if ( isJSON ( config ) )
   {
      describe( "Processing Linked accessory:"+ config.displayName, ( ) =>
      {});

      testAccessoryConfig( config );
      return;
   }

   it( "Variable Config must be valid", ( ) =>
   {
      assert.isTrue( isJSON( config ), "LinkedTypes:'" + config + "'  must be an array of/or list of key/value pairs" );
   });
}
function testType( type )
{
   let ucKeyIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === type);
   it( "Device Type:" + type + " should be valid", ( ) =>
   {
      assert.isAbove( ucKeyIndex, 0, "Invalid device type:" + type );
   });
}
function testName( name )
{
   it( "Device name:" + name + " should be valid", ( ) =>
   {
      assert.isString( name, "Invalid name:" + name );
   });
}
function testModel ( model )
{
   it( "Device model:" + model + " should be valid", ( ) =>
   {
      assert.isString( model, "Invalid model:" + model );
   });
}
function testStateChangeResponseTime ( stateChangeResponseTime )
{
   it( "Device stateChangeResponseTime:" + stateChangeResponseTime + " should be valid", ( ) =>
   {
      assert.isNumber( stateChangeResponseTime, "Invalid stateChangeResponseTime:" + stateChangeResponseTime );
   });
}
function testInterval( interval )
{
   it( "Device interval:" + interval + " should be valid", ( ) =>
   {
      assert.isNumber( interval, "Invalid interval:" + interval );
   });
}
function testTimeout( timeout )
{
   it( "Device timeout:" + timeout + " should be a valid number", ( ) =>
   {
      assert.isNumber( timeout, "Invalid timeout:" + timeout );
   });
}
function testStateCmd ( state_cmd )
{
   it( "Device state_cmd:" + state_cmd + " should be valid", ( ) =>
   {
      assert.isString( state_cmd, "Invalid state_cmd:" + state_cmd );
   });
}
function testCharacteristic ( characteristic, value )
{
   describe( "Testing characteristic:" + characteristic, ( ) =>
   {
      let characteristicIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === characteristic );

      it( "Characteristic " + characteristic + " should be valid", ( ) =>
      {
         assert.isAbove( characteristicIndex, 0, "Invalid characteristic:" + characteristic );
      });

      // Check if properties is not null
      it( "Characteristic " + characteristic + " properties should be valid", ( ) =>
      {
         assert.isNotNull( CMD4_ACC_TYPE_ENUM.properties, "properties is null:" + characteristic );
      });

      // Check if properties[charisticIndex] is not null
      it( "Characteristic " + characteristic + " properties[" + characteristicIndex + "] should be valid", ( ) =>
      {
         assert.isNotNull( CMD4_ACC_TYPE_ENUM.properties[characteristicIndex], "properties is null:" + characteristic );
      });

      // Check if the characteristic has constant values to test
      if ( Object.keys( CMD4_ACC_TYPE_ENUM.properties[characteristicIndex].validValues).length > 0 )
      {
         it( "Value: '" + value + "' should be valid characteristic value", ( ) =>
         {
            assert.property( CMD4_ACC_TYPE_ENUM.properties[characteristicIndex].validValues, value, "Could not find '" + value + "' for characteristic: " + characteristic );
         });
      }
   });
}
function testPollingConfig( pollingConfig )
{
   switch ( typeof pollingConfig )
   {
      case "object":
      {
         it( "Device polling:" + pollingConfig + " should be an array", ( ) =>
         {
            assert.isArray( pollingConfig, "Invalid polling:" + pollingConfig );
         });
         for ( let cindex=0; cindex < pollingConfig.length; cindex ++)
         {
            describe( "Testing polling object:", ( ) =>
            {
               for ( let pollingKey in pollingConfig[cindex] )
               {

                  let ucPollingKey = ucFirst( pollingKey );

                  switch ( ucPollingKey)
                  {
                     case "Timeout":
                     {
                        testTimeout ( pollingConfig[cindex].timeout );
                        break;
                     }
                     case "Interval":

                        testInterval( pollingConfig[cindex].interval );

                        break;
                     default:
                     {
                        let value = pollingConfig[cindex][pollingKey];
                        describe( "Testing polling characteristic:" + pollingKey, ( ) =>
                        {
                           testCharacteristic ( ucPollingKey, value );
                        });
                     }
                  }
               }
            });
         }
         break;
      }
      case "boolean":
      {
         it( "Device polling:" + pollingConfig + " should be a boolean", ( ) =>
         {
            assert.isBoolean( pollingConfig, "Invalid polling:" + pollingConfig );
         });
         break;
      }
      default:
      {
         it( "Device polling:" + pollingConfig + " should be an array or string", ( ) =>
         {
            assert.typeOf( typeof pollingConfig, "number", "Invalid characteristic polling type:" + pollingConfig );
         });
      }
   }
}
function testFakegatoConfig( fakegatoConfig )
{
   switch ( typeof fakegatoConfig )
   {
      case "object":
      {
         // FakeGato Object - OK
         for ( let fakegatoKey in fakegatoConfig )
         {
            let ucFakegatoKey = ucFirst( fakegatoKey );

            switch ( ucFakegatoKey )
            {
               case "Eve":
               case "Folder":
               case "KeyPath":
               case "Storage":
               case "StoragePath":
               case "Polling":
               {
                  // console.log( "Found ucKey '%s'", ucFakegatoKey );
                  break;
               }
               default:
               {
                  //console.log( "Found default ucKey '%s'", ucFakegatoKey );
               }
            }
         }
         break;
      }
      default:
      {
         it( "fakegato:" + typeof fakegato + " should be an object", ( ) =>
         {
            assert.typeOf( typeof fakegatoConfig, "number", "Invalid fakegato type:" + typeof fakegatoConfig );
         });
      }
   }
}
/**
 * @param string
 * @returns string with first character in upper case.
 */
function ucFirst( string )
{
   switch( typeof string )
   {
      case undefined:

         console.log( "Asked to upper case first character of NULL String" );
         return "undefined";

      case "boolean":
      case "number":
         return string;
      case "string":
         return string.charAt( 0).toUpperCase( ) + string.slice( 1 );
      default:
         console.log( "Asked to upper case first character of non String( %s):%s", typeof string, string );
         return string;
   }
}
/**
 * @param Object
 * @returns boolean
 */
function isJSON ( m )
{
   if ( m.constructor === Array ) {
      //console.log( "It is an array" );
      return false;
   }

   if ( typeof m == "object" ) {
      try{ m = JSON.stringify( m ); }
      catch( err ) { return false; } }

   if ( typeof m == "string" ) {
      try{ m = JSON.parse( m ); }
      catch ( err ) { return false; } }

   if ( typeof m != "object" ) { return false; }
   return true;

}
