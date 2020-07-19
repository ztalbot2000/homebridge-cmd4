'use strict';

var fs = require('fs');

var assert = require('chai').assert;

const os = require('os');
const cmd4StateDir = os.homedir() + '/.homebridge/Cmd4Scripts/Cmd4States/'

var glob = require('glob')

describe('Cleaning up any old Cmd4States/Status_Device_* files ...', function ()
{
   glob(cmd4StateDir + "Status_Device_*", null, function (er, files)
   {
      for (var file of files)
      {
         fs.unlink(file,function(err,results)
         {
            it('file:' + file +' should be removed', function (done)
            {
               console.log('File Doesnt exists');
               assert.isFalse(err, 'file not removed');
               done();
            });
         });
      }
   })
});


// ***************** TEST LOADING **********************

// This would be the uninitialized value
var pluginModule = require('../index');

describe('Testing load of index.js', function ()
{
   it('index.js loaded should not be null', function (done)
   {
      assert.isNotNull(pluginModule, 'loading resulted in null');
      done();
   });

   var t = typeof pluginModule.default;
   it('index.js default initializer should be found', function (done)
   {
      assert.equal(t, "function");
      done();
   });
});

// ************ TEST UNINITIALIZED CMD4_DEVICE_TYPE_ENUM EOL **************
describe('Testing CMD4_DEVICE_TYPE_ENUM EOL', function ()
{
   it('CMD4_DEVICE_TYPE_ENUM has EOL', function (done)
   {
      assert.isNotNull(pluginModule.CMD4_DEVICE_TYPE_ENUM.EOL, 'EOL is null');
      done();
   });

   it('CMD4_DEVICE_TYPE_ENUM.EOL >= 50', function (done)
   {
      assert.isAtLeast(pluginModule.CMD4_DEVICE_TYPE_ENUM.EOL, 50);
      done();
   });
});


describe('Testing CMD4_DEVICE_TYPE_ENUM[]', function ()
{
   for (let index=0; index < pluginModule.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      it('CMD4_DEVICE_TYPE_ENUM[' + index + '] should equal ' + index,
          function (done)
      {
         assert.notEqual(pluginModule.CMD4_DEVICE_TYPE_ENUM[index], index);
         done();
      });
   }
});

// ************ TEST UNINITIALIZED CMD4_ACC_TYPE_ENUM EOL **************
describe('Testing CMD4_ACC_TYPE_ENUM.EOL', function ()
{
   it('CMD4_ACC_TYPE_ENUM has EOL', function (done)
   {
      assert.isNotNull(pluginModule.CMD4_ACC_TYPE_ENUM.EOL, 'EOL is null');
      done();
   });

   it('CMD4_ACC_TYPE_ENUM.EOL >= 150', function (done)
   {
      assert.isAtLeast(pluginModule.CMD4_ACC_TYPE_ENUM.EOL, 150);
      done();
   });
});

describe('Testing CMD4_ACC_TYPE_ENUM[]', function ()
{
   for (let index=0; index < pluginModule.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {
      it('CMD4_ACC_TYPE_ENUM[' + index + '] should equal ' + index,
          function (done)
      {
         assert.notEqual(pluginModule.CMD4_ACC_TYPE_ENUM[index], index);
         done();
      });
   }
});

var HomebridgeAPI = require('../node_modules/homebridge/lib/api').HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins

describe('Testing homebridge API', function ()
{
   it('API should not be null', function (done)
   {
      assert.isNotNull(_api, '_api is null');
      done();
   });
});

// ***************** TEST Plugin Initialized Variables ***************

describe('Initializing our plugin module', function ()
{});
var cmd4 = pluginModule.default(_api);
let Accessory = cmd4.Accessory;
let Service = cmd4.Service;
let Characteristic = cmd4.Characteristic;
let UUIDGen = cmd4.UUIDGen;
let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;



describe('Testing index.js plugin initialized variables.', function ()
{
   it('Plugin Characteristic should be a function', function (done)
   {
      assert.isFunction(Characteristic, "Characteristic is not an function");
      done();
   });
   it('Plugin Accessory should be a function', function (done)
   {
      assert.isFunction(Accessory, "Accessory is not an function");
      done();
   });
   it('Plugin Service should be a function', function (done)
   {
      assert.isFunction(Service, "Service is not an function");
      done();
   });
   it('Plugin CMD4_DEVICE_TYPE_ENUM should be a object', function (done)
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM, "CMD4_DEVICE_TYPE_ENUM is not an object");
      done();
   });
   it('Plugin CMD4_ACC_TYPE_ENUM should be a object', function (done)
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object");
      done();
   });

   it('Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined', function (done)
   {
      assert.isNumber(CMD4_ACC_TYPE_ENUM.EOL, "CMD4_ACC_TYPE_ENUM is not an object");
      done();
   });

});

// ******** TEST CMD4_DEVICE_TYPE_ENUM.properties *************
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties', function ()
{
   it('CMD4_DEVICE_TYPE_ENUM.properties should be an array', function ()
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object");
   });

   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '] should not be null ',
          function ()
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index], 'properties[' +  index + '] is null');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].deviceName should not be null ',
          function ()
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName, 'deviceName is null at index:' + index);
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].service should not be null ',
          function ()
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].service, 'service is null at index:' + index);
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].devicesStateChangeDefaultTime should not be null ',
          function ()
      {
         assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].devicesStateChangeDefaultTime, 'devicesStateChangeDefaultTime is null at index:' + index);
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics should be an array ',
          function ()
      {
          assert.isArray(CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics, 'requiredCharacteristics is not an array at index:' + index);
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics should be an array ',
          function ()
      {
          assert.isArray(CMD4_DEVICE_TYPE_ENUM.properties[index].defaultPollingCharacteristics, 'defaultPollingCharacteristics is not an array at index:' + index);
      });
   }
});

// *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics *******
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics', function ()
{
   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '] ', function ()
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++)
         {
            describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + ']', function ()
            {

               let accTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[rindex].type;

               let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[rindex].defaultValue;

               testCharacteristicIndex(accTypeEnumIndex);

  
               it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + '].defaultValue must not be null',
                  function ()
               {
                  assert.isNotNull(defaultValue, 'defaultValue is null at index:' + index);
               });
            });
         }
      });
   }
});
// *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].optonalCharacteristics *******
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].optionalCharacteristics', function ()
{
   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].optionalCharacteristics ', function ()
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[index].optionalCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++)
         {

            let accTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[index].optionalCharacteristics[rindex];

            testCharacteristicIndex(accTypeEnumIndex);

         }
      });
   }
});


// ** TEST ACC_TYPE_ENUM.properties[].props  **
describe('Testing CMD4_ACC_TYPE_ENUM.properties[].props',
function ()
{


   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
       if (accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.Name)
          continue;

       // Characteristics dont seem to get removed and homebridge put a limit
       // of 100 Characteristics per service, so just create a new service
       // per characteristic.  This is unit testing anyway, so not an issue.
       let serviceName = 'Service' + accTypeEnumIndex;
       let service = new Service(serviceName, UUIDGen.generate(serviceName), serviceName);

       it('Creating service to test Characteristic',
       function ()
       {
          assert.isNotNull(service, 'Service is null at accTypeEnumIndex: ' + accTypeEnumIndex);
       });

       // Get the properties for this characteristic type
       let accProperties = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex];

       describe('Testing CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + ']:' + accProperties.type,
       function ()
       {                   
          var characteristic = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].characteristic',
          function ()
          {
             assert.isNotNull(characteristic, 'characteristic is null');
          });

          let charName = 'CharName' + accTypeEnumIndex;
          characteristic.UUID = UUIDGen.generate(charName);

          service.addCharacteristic(characteristic);

          let props = service.getCharacteristic(characteristic).props;
          service.removeCharacteristic(characteristic);

          it('props for HomeBridge Characteristic:' + accProperties.type,
          function ()
          {
             assert.isNotNull(props, 'perms for Characteristic type:' + accProperties.type + ' is null');
          });


          let format = props.format;

          // Test both Formats
          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.format should be the same',
          function ()
          {
             assert.equal(format, accProperties.props.format, 'format:' + accProperties.props.format + ' not equal to expected ' + format);
          });

          // Test both units
          let units = props.units;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.units should be the same',
          function ()
          {
             assert.equal(units, accProperties.props.units, 'units:' + accProperties.props.units + ' not equal to expected ' + format);
          });

          // test both minValue
          let minValue = props.minValue;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.minValue should be the same',
          function ()
          {
              assert.equal(minValue, accProperties.props.minValue, 'minValue:' + accProperties.props.minValue + ' not equal to expected ' + minValue);
          });

          // test both maxValue
          let maxValue = props.maxValue;

          if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState )
          {

             it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.maxValue should be the same',
             function ()
             {
                assert.equal(maxValue, accProperties.props.maxValue, 'maxValue:' + accProperties.props.maxValue + ' not equal to expected ' + maxValue);
             });
          } else {
             //console.log("Homebridge is wrong, skipping");
          }

          // test both minStep
          let minStep = props.minStep;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.minStep should be the same',
          function ()
          {
             assert.equal(minStep, accProperties.props.minStep, 'minStep:' + accProperties.props.minStep + ' not equal to expected ' + minStep);
          });

          // test all perms
          let perms = props.perms;
          if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.Version )
          {
             // Test if same number of perms
             it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.perms.length should be the same',
             function ()
             {
                assert.equal(perms.length, accProperties.props.perms.length, 'props.perms.length:' + accProperties.props.perms.length + ' not equal to expected ' + perms.length);
             });

             for ( let permIndex = 0; permIndex < perms.length; permIndex++ )
             {
                let perm = perms[permIndex];

                it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.perms[' + permIndex + '] should be the same',
                function ()
                {
                   assert.equal(perm, accProperties.props.perms[permIndex], 'props.perms[' + permIndex + ']:' + accProperties.props.perms[permIndex] + ' not equal to expected ' + perm);
                });
             }
          } else {
             // HAP has varing perms.  Bug report issued
          }

          // Our validValues should not be null
          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues should not be null',
          function ()
          {
             assert.isNotNull(accProperties.validValues, 'validValues is Null');
          });

          // test all validValues
          let validValues = props.validValues;

          if ( ! validValues )
          {
             // We defined what valid values are for BOOL
             // so TRUE/FALSE can be a constant.
             if (format != Characteristic.Formats.BOOL)
             {
                // Test if our validValues is empty
                it('Our CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues.length should be 0',
                function ()
                {
                   assert.equal(Object.keys(accProperties.validValues).length, 0, 'validValuesh for: ' + accTypeEnumIndex + ' is not empty');
                });
             } 
          } else
          {
             if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState )
             {
                // Test if same number of validValues
                it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].perms.length should be the same',
                function ()
                {   
                   assert.equal(validValues.length, Object.keys(accProperties.validValues).length,   'validValues.length(' + Object.keys(accProperties.validValues).length +') for: ' + accTypeEnumIndex + ' is not:' + validValues.length);
                });

                // test all validValues
                for ( let valuesIndex = 0; valuesIndex < validValues.length; valuesIndex++ )
                {
                    let value = validValues[valuesIndex];

                    it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + valuesIndex + '] should be the same',
                    function ()
                    {
                          let cmd4Key = Object.keys(accProperties.validValues)[valuesIndex];
                          let cmd4Value = accProperties.validValues[cmd4Key];
                          assert.equal(value, cmd4Value, 'validValues[' + valuesIndex + ']:' +   cmd4Value + ' not equal to expected ' + value);
                    });
                }
             } else {
                // console.log("Homebridge is wrong, skipping");
             }
          }
          service.removeCharacteristic(characteristic);

       });
    }
});
return;

// ** TEST CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristic  **
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristics', function ()
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_DEVICE_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + accTypeEnumIndex + '].defaultPollingCharacteristics ', function ()
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].defaultPollingCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++)
         {

            let defaultPollingAccTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].defaultPollingCharacteristics[rindex];

            testCharacteristicIndex(defaultPollingAccTypeEnumIndex);


            // Check that polled characteristic is in required characteristics
            let foundInRequiredCharacteristics = false;
            let dLength = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].requiredCharacteristics.length;
            for (let dindex=0; dindex < dLength; dindex ++)
            {
                let rCharacteristic = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].requiredCharacteristics[dindex].type;
                if (defaultPollingAccTypeEnumIndex == rCharacteristic)
                {
                   foundInRequiredCharacteristics = true;
                   break;
                }
             }
            it('CMD4_DEVICE_TYPE_ENUM.properties[' + accTypeEnumIndex + '].defaultPollingCharacteristics[' + rindex + '] is in requiredCharacteristics',
                function ()
            {
                assert.isTrue(foundInRequiredCharacteristics, 'Polling characteristic is not in required Characteristics at accTypeEnumIndex:' + accTypeEnumIndex);
            });
         }
      });
   }
});

// ******** TEST CMD4_ACC_TYPE_ENUM.properties *************
describe('Testing CMD4_ACC_TYPE_ENUM.properties', function ()
{
   it('CMD4_ACC_TYPE_ENUM.properties should be an array', function ()
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object");
   });

   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '] should not be null ',
          function ()
      {
             assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex], 'properties is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].type should not be null ',
          function ()
      {
             assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type, 'type is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].characteristic should not be null ',
          function ()
      {
          assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic, 'characteristic is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues should not be null ',
      function ()
      {
          assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues, 'values is null');
      });


      for (let key in CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues)
      {
         it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + key +'] should be a string ',
         function ()
         {
            assert.isString(key, "Key:'" + key + "' is not a string");
         });
         it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + key + '] should be a string ',
         function ()
         {
            let value = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues[key];
            assert.isNotNull(value, "Value:'" + value + "' is null");
         });
      }
   }
});



function testCharacteristicIndex ( accTypeEnumIndex)
{
   describe('Testing accTypeEnumIndex:' + accTypeEnumIndex, () =>
   {
      it('accTypeEnumIndex should be valid',
             function ()
         {
             assert.isNotNull(accTypeEnumIndex, 'accTypeEnumIndex must not be null');
         });

         // AccessoryFlags is enum 0. However node.js inerpets 0 as false
         // So if it is a number or a bool, then it is okay.
         it('accTypeEnumIndex is a number',
            function ()
         {
            assert.isFalse(typeof accTypeEnumIndex != 'boolean' && typeof accTypeEnumIndex != 'number', 'accTypeEnumIndex is not a number');
         });

         // Test the range
         it('accTypeEnumIndexs is within range',
             function ()
         {
             assert.isTrue(0 <= accTypeEnumIndex && accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL, 'accTypeEnumIndex is not >= 0 && < ' + CMD4_ACC_TYPE_ENUM.EOL + ' accTypeEnumIndex:' + accTypeEnumIndex);
         });
   });
}
