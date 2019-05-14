'use strict';

const fs = require('fs');

const assert = require('chai').assert;

const cmd4Config = require('../Extras/config.json');


describe('Testing our config.json)', () =>
{  
   it('cmdConfig should be a JSON object', function (done)
   {  
      assert.isObject(cmd4Config, "cmd4Config is not an object");
      done();
   });
   
})
var API = require('/usr/local/lib/node_modules/homebridge/lib/api').API;
var _api = new API(); // object we feed to Plugins

// This would be the uninitialized value
var pluginModule = require('../index');

console.log("Initializing our plugin module");
var cmd4 = pluginModule.default(_api);

describe('Testing our config.json)', () =>
{
   const accessories = cmd4Config.platforms[0].accessories;
   for (let index=0; index < accessories.length; index ++)
   {
      describe('Testing name:' + accessories[index].name, () =>
      {
         for (let key in accessories[index])
         {
            switch (key)
            {
               case 'name':
               {
                  // Check the device name
                  let name = accessories[index].name;
                  it('Device name:' + name + ' should be valid',
                      function (done)
                  {
                     assert.isString(name, 'Invalid name:' + name);
                     done();
                  });
                  break;
               }
               case 'type':
               {
                  // Check the device type
                  let deviceType = accessories[index].type;
     
                  let ucKeyIndex = cmd4.CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum(i => i.deviceName === deviceType);
                  it('Device Type:' + deviceType + ' should be valid',
                      function (done)
                  {
                     assert.isAbove(ucKeyIndex, 0, 'Invalid device type:' + deviceType);
                     done();
                  });
                  break;
               }
               case "Timeout":
               {
                  // Check the timeout value
                  let timeout = accessories[index].timeout;
                  it('Device timeout:' + timeout + ' should be a valid number',
                      function (done)
                  {
                     assert.isNumber(timeout, 'Invalid timeout:' + timeout);
                     done();
                  });
                  break;
               }
               case "model":
               {
                  // Check the model value
                  let model = accessories[index].model;
                  it('Device model:' + model + ' should be valid',
                      function (done)
                  {
                     assert.isString(model, 'Invalid model:' + model);
                     done();
                  });
                  break;
               }
               case "polling":
               {
                  // Check the timeout value
                  let polling = accessories[index].polling;
                  console.log("type of polling is '%s'", typeof polling);
     
                  switch (typeof polling )
                  {
                     case 'object':
                     {
                        it('Device polling:' + polling + ' should be an array',
                        function (done)
                        {
                           assert.isArray(polling, 'Invalid polling:' + polling);
                           done();
                        });
                        for (let cindex=0; cindex < polling.length; cindex ++)
                        {
                           describe('Testing polling object:', () =>
                           {
                              for (let pollingKey in polling[cindex])
                              {
   
                                 switch (pollingKey)
                                 {
                                    case 'timeout':
                                    {
                                       let timeout = polling[cindex].timeout; 
                                       it('Device timeout:' + timeout + ' should be a valid number',
                                           function (done)
                                       {
                                          assert.isNumber(timeout, 'Invalid timeout:' + timeout);
                                          done();
                                       });
                                       break;
                                    }
                                    case 'interval':
                                    {
                                        // Check the Interval value
                                       let interval = polling[cindex].interval; 
                                       it('Device interval:' + interval + ' should be valid',
                                          function (done)
                                       {
                                          assert.isNumber(interval, 'Invalid interval:' + interval);
                                          done();
                                       });
                                       break;
                                    }
                                    default:
                                    {
                                       var characteristic = ucFirst(pollingKey);
                           
                                       let characteristicIndex = cmd4.CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === characteristic);
                                       it('Characteristic ' + characteristic + ' should be valid',
                                       function (done)
                                       {
                                          assert.isAbove(characteristicIndex, 0, 'Invalid characteristic:' + characteristic);
                                          done();
                                       });
                                    }
                                 }
                              }
                           });
                        }
                        break;
                     }
                     case 'boolean':
                     {
                        it('Device polling:' + polling + ' should be a boolean',
                        function (done)
                        {
                           assert.isBoolean(polling, 'Invalid polling:' + polling);
                           done();
                        });
                        break;
                     }
                     case 'number':
                     case 'function':
                     case 'undefined':
                     default:
                     {
                        it('Device polling:' + polling + ' should be an array or string',
                        function (done)
                        {
                           assert.typeOf(typeof polling, 'number', 'Invalid characteristic polling type:' + polling);
                           done();
                        });
                     }
                  }
                 
                  break;
               }
               case "interval":
               {
                  // Check the Interval value
                 let interval = accessories[index].interval;
                 it('Device interval:' + interval + ' should be valid',
                 function (done)
                 {
                    assert.isNumber(interval, 'Invalid interval:' + interval);
                    done();
                 });
                 break;
              }
              case "stateChangeResponseTime":
              {
                 // Check the stateChangeResponseTime value
                 let stateChangeResponseTime = accessories[index].stateChangeResponseTime;
                 it('Device stateChangeResponseTime:' + stateChangeResponseTime + ' should be valid',
                 function (done)
                 {
                    assert.isNumber(stateChangeResponseTime, 'Invalid stateChangeResponseTime:' + stateChangeResponseTime);
                    done();
                 });
                 break;
              }
              case "state_cmd":
              {
                 // Check the state_cmd value
                 let state_cmd = accessories[index].state_cmd;
                 it('Device state_cmd:' + state_cmd + ' should be valid',
                 function (done)
                 {
                    assert.isString(state_cmd, 'Invalid state_cmd:' + state_cmd);
                    done();
                 });
                 break;
              }
              case 'fakegato':
              {
                 let fakegato = accessories[index].fakegato;
   
                 switch ( typeof fakegato )
                 {
                    case 'object':
                    {
                       // FakeGato Object - OK
                       for (let fakegatoKey in fakegato )
                       {
                          let ucFakegatoKey = ucFirst(fakegatoKey);
   
                          switch (ucFakegatoKey)
                          {
                             case 'Eve':
                             case 'Folder':
                             case 'KeyPath':
                             case 'Storage':
                             case 'StoragePath':
                             case 'Polling':
                             {
                                console.log("Found ucKey '%s'", ucFakegatoKey);
                                break;
                             }
                             default:
                             {
                                console.log("Found default ucKey '%s'", ucFakegatoKey);
                             }
                          }
                       }
                       break;
                    }
                    case 'string':
                    case 'array':
                    case 'number':
                    case 'function':
                    case 'boolean':
                    case 'undefined':
                    default:
                    {
                       it('fakegato:' + typeof fakegato + ' should be an object',
                       function (done)
                       {
                          assert.typeOf(typeof fakegato, 'number', 'Invalid fakegato type:' + typeof fakegato);
                          done();
                       });
                    }
                 }
                 break;
              }
              default:
              {
                 var characteristic = ucFirst(key);
     
                 let characteristicIndex = cmd4.CMD4_ACC_TYPE_ENUM.properties.indexOfEnum(i => i.name === characteristic);
                 it('Characteristic ' + characteristic + ' should be valid',
                 function (done)
                 {
                    assert.isAbove(characteristicIndex, 0, 'Invalid characteristic:' + characteristic);
                    done();
                 });
              }
           }
        }
    });
  }
});

describe('Testing CMD4_DEVICE_TYPE_ENUM devices all defined', function ()
{
   for (let index=0; index < cmd4.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   //for (let index=0; index < 2; index ++)
   {
      let deviceToFind = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;

      // Skip those we do not care about
      if (deviceToFind == 'AccessoryInformation'         ||
          deviceToFind == 'BridgeConfiguration'          ||
          deviceToFind == 'BridgingState'                ||
          deviceToFind == 'CameraControl'                ||
          deviceToFind == 'CameraRTPStreamManagement'    ||
          deviceToFind == 'Pairing'                      ||
          deviceToFind == 'ProtocolInformation'          ||
          deviceToFind == 'TunneledBTLEAccessoryService')
         continue;

      let deviceFound = '';
      
      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].deviceName (' + deviceToFind + ') should be defined in config.json',
      function (done)
      {
         const accessories = cmd4Config.platforms[0].accessories;
         for (let dindex=0; dindex < accessories.length; dindex ++)
         {
             // console.log("checking " + accessories[dindex].type + " for " + deviceToFind);
             if (accessories[dindex].type == deviceToFind)
             {
                deviceFound = deviceToFind;
                dindex = 10000;
            // } else {
                // console.log("not Found " + accessories[dindex].type);
             }
         }

         assert.equal(deviceFound, deviceToFind, 'Device:' + deviceToFind + ' not listed in config.json');
         done();
      });
   }
});

describe('Testing CMD4_DEVICE_TYPE_ENUM devices all defined', function ()
{
   for (let index=0; index < cmd4.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   //for (let index=0; index < 2; index ++)
   {
      let deviceToFind = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;

      // Skip those we do not care about
      if (deviceToFind == 'AccessoryInformation'         ||
          deviceToFind == 'BridgeConfiguration'          ||
          deviceToFind == 'BridgingState'                ||
          deviceToFind == 'CameraControl'                ||
          deviceToFind == 'CameraRTPStreamManagement'    ||
          deviceToFind == 'Pairing'                      ||
          deviceToFind == 'ProtocolInformation'          ||
          deviceToFind == 'TunneledBTLEAccessoryService')
         continue;

      let deviceFound = '';
      
      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].deviceName (' + deviceToFind + ') should be defined in config.json',
      function (done)
      {
         const accessories = cmd4Config.platforms[0].accessories;
         for (let dindex=0; dindex < accessories.length; dindex ++)
         {
             // console.log("checking " + accessories[dindex].type + " for " + deviceToFind);
             if (accessories[dindex].type == deviceToFind)
             {
                deviceFound = deviceToFind;
                dindex = 10000;
            // } else {
                // console.log("not Found " + accessories[dindex].type);
             }
         }

         assert.equal(deviceFound, deviceToFind, 'Device:' + deviceToFind + ' not listed in config.json');
         done();
      });
   }
});

function ucFirst( string )
{
   if ( string )
      return string.charAt(0).toUpperCase() + string.slice( 1 );
   else {
      console.log( "Asked to upper  case first character of NULL String" );
      return "undefined";
   }
}

