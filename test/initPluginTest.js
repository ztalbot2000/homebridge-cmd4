"use strict";


var expect = require( "chai" ).expect;
var assert = require( "chai" ).assert;


// ***************** TEST LOADING **********************


var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins
var pluginModule = require( "../index" );
var cmd4 = pluginModule.default(_api);
var Accessory = cmd4.Accessory;
var Characteristic = cmd4.Characteristic;
var Service = cmd4.Service;
var UUIDGen = cmd4.UUIDGen;
var CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
var CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;

function getKeyByValue(object, value ) {
  return Object.keys(object ).find(key => object[key] === value );
}

// While the above method is better, It doesn't check that
// the key values are sequential.
// You cannot break out of forEach ....
function getIndexOfValue(obj, value )
{
   let count = 0;
   let found = -1;
   Object.keys( obj ).forEach( function( key )
   {
      // console.log( "Checking: " + key + " count: " + count + " obj[key]:" + obj[key] + " for:" + value + " t1:" + typeof obj[key] + " t2:" + typeof value );
      if ( obj[key] == value && value == count ) { found = value };
      count+=1;
   });
   return found;
}
describe('Testing load of index.js', ( ) =>
{
   it('index.js loaded should not be null', ( ) =>
   {
      assert.isNotNull(pluginModule, 'loading resulted in null' );
   });

   var t = typeof pluginModule.default;
   it('index.js default initializer should be found', ( ) =>
   {
      assert.equal(t, "function" );
   });
});

describe('Testing homebridge API', ( ) =>
{
   it('API should not be null', ( ) =>
   {
      assert.isNotNull(_api, '_api is null' );
   });
});

// ***************** TEST Plugin Initialized Variables ***************


describe('Testing index.js plugin initialized variables.', ( ) =>
{
   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(Characteristic, "Characteristic is not an function" );
   });
   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(Accessory, "Accessory is not an function" );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(Service, "Service is not an function" );
   });
   it('Plugin CMD4_DEVICE_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM, "CMD4_DEVICE_TYPE_ENUM is not an object" );
   });
   it('Plugin CMD4_ACC_TYPE_ENUM should be a object', ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

   it('Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined', ( ) =>
   {
      assert.isNumber(CMD4_ACC_TYPE_ENUM.EOL, "CMD4_ACC_TYPE_ENUM is not an object" );
   });

});

// ******** TEST CMD4_DEVICE_TYPE_ENUM.properties *************
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties', ( ) =>
{
   it('CMD4_DEVICE_TYPE_ENUM.properties should be an array', ( ) =>
   {
      assert.isObject(CMD4_DEVICE_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object" );
   });

   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
   {
      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '] should not be null ', ( ) =>
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index], 'properties[' +  index + '] is null' );
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].deviceName should not be null ', ( ) =>
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName, 'deviceName is null at index:' + index );
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].service should not be null ', ( ) =>
      {
          assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].service, 'service is null at index:' + index );
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].devicesStateChangeDefaultTime should not be null ', ( ) =>
      {
         assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].devicesStateChangeDefaultTime, 'devicesStateChangeDefaultTime is null at index:' + index );
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics should be an array ', ( ) =>
      {
          assert.isArray(CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics, 'requiredCharacteristics is not an array at index:' + index );
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics should be an array ', ( ) =>
      {
          assert.isArray(CMD4_DEVICE_TYPE_ENUM.properties[index].defaultPollingCharacteristics, 'defaultPollingCharacteristics is not an array at index:' + index );
      });
   }
});

// *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics *******
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics', ( ) =>
{
   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '] ', ( ) =>
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++ )
         {
            describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + ']', ( ) =>
            {

               let accTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[rindex].type;

               let defaultValue = CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[rindex].defaultValue;

               testCharacteristicIndex(accTypeEnumIndex );

               it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + '].defaultValue must not be null', ( ) =>
               {
                  assert.isNotNull(defaultValue, 'defaultValue is null at index:' + index );
               });
            });
         }
      });
   }
});
// *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].optonalCharacteristics *******
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].optionalCharacteristics', ( ) =>
{
   for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].optionalCharacteristics ', ( ) =>
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[index].optionalCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++ )
         {

            let accTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[index].optionalCharacteristics[rindex];

            testCharacteristicIndex(accTypeEnumIndex );
         }
      });
   }
});


// ** TEST ACC_TYPE_ENUM.properties[].props  **
describe('Testing CMD4_ACC_TYPE_ENUM.properties[].props', ( ) =>
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
       if (accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.Name )
          continue;

       // Characteristics dont seem to get removed and homebridge put a limit
       // of 100 Characteristics per service, so just create a new service
       // per characteristic.  This is unit testing anyway, so not an issue.
       let serviceName = 'Service' + accTypeEnumIndex;
       let service = new Service(serviceName, UUIDGen.generate(serviceName ), serviceName );

       it('Creating service to test Characteristic', ( ) =>
       {
          assert.isNotNull(service, 'Service is null at accTypeEnumIndex: ' + accTypeEnumIndex );
       });

       // Get the properties for this characteristic type
       let accProperties = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex];

       describe('Testing CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + ']:' + accProperties.type, ( ) =>
       {
          var characteristic = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].characteristic', ( ) =>
          {
             assert.isNotNull(characteristic, 'characteristic is null' );
          });

          let charName = 'CharName' + accTypeEnumIndex;
          characteristic.UUID = UUIDGen.generate(charName );

          service.addCharacteristic(characteristic );

          let props = service.getCharacteristic(characteristic ).props;
          service.removeCharacteristic(characteristic );

          it('props for HomeBridge Characteristic:' + accProperties.type,
          ( ) =>
          {
             assert.isNotNull(props, 'perms for Characteristic type:' + accProperties.type + ' is null' );
          });


          let format = props.format;

          // Test both Formats
          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.format should be the same', ( ) =>
          {
             assert.equal(format, accProperties.props.format, 'format:' + accProperties.props.format + ' not equal to expected ' + format );
          });

          // Test both units
          let units = props.units;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.units should be the same', ( ) =>
          {
             assert.equal(units, accProperties.props.units, 'units:' + accProperties.props.units + ' not equal to expected ' + format );
          });

          // test both minValue
          let minValue = props.minValue;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.minValue should be the same', ( ) =>
          {
              assert.equal(minValue, accProperties.props.minValue, 'minValue:' + accProperties.props.minValue + ' not equal to expected ' + minValue );
          });

          // test both maxValue
          let maxValue = props.maxValue;

          if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState )
          {

             it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.maxValue should be the same', ( ) =>
             {
                assert.equal(maxValue, accProperties.props.maxValue, 'maxValue:' + accProperties.props.maxValue + ' not equal to expected ' + maxValue );
             });
          } else {
             //console.log("Homebridge is wrong, skipping" );
          }

          // test both minStep
          let minStep = props.minStep;

          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.minStep should be the same', ( ) =>
          {
             assert.equal(minStep, accProperties.props.minStep, 'minStep:' + accProperties.props.minStep + ' not equal to expected ' + minStep );
          });

          // test all perms
          let perms = props.perms;
          if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.Version )
          {
             // Test if same number of perms
             it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.perms.length should be the same', ( ) =>
             {
                assert.equal(perms.length, accProperties.props.perms.length, 'props.perms.length:' + accProperties.props.perms.length + ' not equal to expected ' + perms.length );
             });

             for ( let permIndex = 0; permIndex < perms.length; permIndex++ )
             {
                let perm = perms[permIndex];

                it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].props.perms[' + permIndex + '] should be the same', ( ) =>
                {
                   assert.equal(perm, accProperties.props.perms[permIndex], 'props.perms[' + permIndex + ']:' + accProperties.props.perms[permIndex] + ' not equal to expected ' + perm );
                });
             }
          } else {
             // HAP has varing perms.  Bug report issued
          }

          // Our validValues should not be null
          it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues should not be null', ( ) =>
          {
             assert.isNotNull(accProperties.validValues, 'validValues is Null' );
          });

          // test all validValues
          let validValues = props.validValues;

          if ( ! validValues )
          {
             // We defined what valid values are for BOOL
             // so TRUE/FALSE can be a constant.
             if (format != Characteristic.Formats.BOOL )
             {
                // Hap has values defined, but not in valid values. We added them in ours
                if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CameraOperatingModeIndicator &&
                     accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.ThirdPartyCameraActive &&
                     accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.RecordingAudioActive &&
                     accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.PeriodicSnapshotsActive &&
                     accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.HomeKitCameraActive &&
                     accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.EventSnapshotsActive )
                {
                   // Test if our validValues is empty
                   it('Our CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues.length should be 0', ( ) =>
                   {
                      assert.equal(Object.keys(accProperties.validValues ).length, 0, 'validValuesh for: ' + accTypeEnumIndex + ' is not empty' );
                   });
                } else {
                   // console.log("Homebridge is wrong, skipping" );
                }
             }
          } else
          {
             // For InputDeviceType, we define the UNKNOWN_6 they do not. its okay
             // For ManagedNetworkEnable, we define the UNKNOWN they do not. its okay
             if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState &&
                  accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.InputDeviceType &&
                  accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.ManagedNetworkEnable )
             {
                // Test if same number of validValues
                it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].perms.length should be the same', ( ) =>
                {
                   assert.equal(validValues.length, Object.keys(accProperties.validValues ).length,   'validValues.length(' + Object.keys(accProperties.validValues ).length +' ) for: ' + accTypeEnumIndex + ' is not:' + validValues.length );
                });

                // test all validValues
                for ( let valuesIndex = 0; valuesIndex < validValues.length; valuesIndex++ )
                {
                    let value = validValues[valuesIndex];

                    it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + valuesIndex + '] should be the same', ( ) =>
                    {
                          let cmd4Key = Object.keys(accProperties.validValues )[valuesIndex];
                          let cmd4Value = accProperties.validValues[cmd4Key];
                          assert.equal(value, cmd4Value, 'validValues[' + valuesIndex + ']:' +   cmd4Value + ' not equal to expected ' + value );
                    });
                }
             } else {
                // console.log("Homebridge is wrong, skipping" );
             }
          }
          service.removeCharacteristic(characteristic );

       });
    }
});


// ** TEST CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristic  **
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristics', ( ) =>
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_DEVICE_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
      describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + accTypeEnumIndex + '].defaultPollingCharacteristics ', ( ) =>
      {
         let length = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].defaultPollingCharacteristics.length;
         for (let rindex=0; rindex < length; rindex ++ )
         {

            let defaultPollingAccTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].defaultPollingCharacteristics[rindex];

            testCharacteristicIndex(defaultPollingAccTypeEnumIndex );


            // Check that polled characteristic is in required characteristics
            let foundInRequiredCharacteristics = false;
            let dLength = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].requiredCharacteristics.length;
            for (let dindex=0; dindex < dLength; dindex ++ )
            {
                let rCharacteristic = CMD4_DEVICE_TYPE_ENUM.properties[accTypeEnumIndex].requiredCharacteristics[dindex].type;
                if (defaultPollingAccTypeEnumIndex == rCharacteristic )
                {
                   foundInRequiredCharacteristics = true;
                   break;
                }
             }
            it('CMD4_DEVICE_TYPE_ENUM.properties[' + accTypeEnumIndex + '].defaultPollingCharacteristics[' + rindex + '] is in requiredCharacteristics', ( ) =>
            {
                assert.isTrue(foundInRequiredCharacteristics, 'Polling characteristic is not in required Characteristics at accTypeEnumIndex:' + accTypeEnumIndex );
            });
         }
      });
   }
});

// ******** TEST CMD4_ACC_TYPE_ENUM.properties *************
describe('Testing CMD4_ACC_TYPE_ENUM.properties', ( ) =>
{
   it('CMD4_ACC_TYPE_ENUM.properties should be an array', ( ) =>
   {
      assert.isObject(CMD4_ACC_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object" );
   });

   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++ )
   {
      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '] should not be null ', ( ) =>
      {
             assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex], 'properties is null' );
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].type should not be null ', ( ) =>
      {
             assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type, 'type is null' );
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].characteristic should not be null ', ( ) =>
      {
          assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].characteristic, 'characteristic is null' );
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues should not be null ', ( ) =>
      {
          assert.isNotNull(CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues, 'values is null' );
      });


      for (let key in CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues )
      {
         it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + key +'] should be a string ', ( ) =>
         {
            assert.isString(key, "Key:'" + key + "' is not a string" );
         });
         it('CMD4_ACC_TYPE_ENUM.properties[' + accTypeEnumIndex + '].validValues[' + key + '] should be a string ', ( ) =>
         {
            let value = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].validValues[key];
            assert.isNotNull(value, "Value:'" + value + "' is null" );
         });
      }
   }
});



function testCharacteristicIndex ( accTypeEnumIndex )
{
   describe('Testing accTypeEnumIndex:' + accTypeEnumIndex, () =>
   {
      it('accTypeEnumIndex should be valid', ( ) =>
      {
          assert.isNotNull(accTypeEnumIndex, 'accTypeEnumIndex must not be null' );
      });

      // AccessoryFlags is enum 0. However node.js inerpets 0 as false
      // So if it is a number or a bool, then it is okay.
      it('accTypeEnumIndex is a number', ( ) =>
      {
         assert.isFalse(typeof accTypeEnumIndex != 'boolean' && typeof accTypeEnumIndex != 'number', 'accTypeEnumIndex is not a number' );
      });

      // Test the range
      it('accTypeEnumIndexs is within range', ( ) =>
      {
          assert.isTrue(0 <= accTypeEnumIndex && accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL, 'accTypeEnumIndex is not >= 0 && < ' + CMD4_ACC_TYPE_ENUM.EOL + ' accTypeEnumIndex:' + accTypeEnumIndex );
      });
   });
}
