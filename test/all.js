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
         fs.unlink(file,function(err,results){
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

var API = require('../node_modules/homebridge/lib/api').API;
var _api = new API(); // object we feed to Plugins

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
//console.log("Initializing our plugin module");
var cmd4 = pluginModule.default(_api);

describe('Testing index.js plugin initialized variables.', function ()
{
   it('Plugin Characteristic should be a function', function (done)
   {
      assert.isFunction(cmd4.Characteristic, "Characteristic is not an function");
      done();
   });
   it('Plugin Accessory should be a function', function (done)
   {
      assert.isFunction(cmd4.Accessory, "Accessory is not an function");
      done();
   });
   it('Plugin Service should be a function', function (done)
   {
      assert.isFunction(cmd4.Service, "Service is not an function");
      done();
   });
   it('Plugin CMD4_DEVICE_TYPE_ENUM should be a object', function (done)
   {
      assert.isObject(cmd4.CMD4_DEVICE_TYPE_ENUM, "CMD4_DEVICE_TYPE_ENUM is not an object");
      done();
   });
   it('Plugin CMD4_ACC_TYPE_ENUM should be a object', function (done)
   {
      assert.isObject(cmd4.CMD4_ACC_TYPE_ENUM, "CMD4_ACC_TYPE_ENUM is not an object");
      done();
   });

   it('Plugin CMD4_ACC_TYPE_ENUM.EOL should be defined', function (done)
   {
      assert.isNumber(cmd4.CMD4_ACC_TYPE_ENUM.EOL, "CMD4_ACC_TYPE_ENUM is not an object");
      done();
   });

});

// ******** TEST CMD4_DEVICE_TYPE_ENUM.properties *************
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties', function ()
{
   it('CMD4_DEVICE_TYPE_ENUM.properties should be an array', function ()
   {
      assert.isObject(cmd4.CMD4_DEVICE_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object");
   });

   for (let index=0; index < cmd4.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {  
      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '] should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index], 'properties[' +  index + '] is null');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].deviceName should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName, 'deviceName is null');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].service should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].service, 'service is null');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].devicesStateChangeDefaultTime should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].devicesStateChangeDefaultTime, 'devicesStateChangeDefaultTime is null');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics should be an array ',
          function ()
      {
          assert.isArray(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics, 'requiredCharacteristics is not an array');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultValues should be an array ',
          function ()
      {      
          assert.isArray(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].defaultValues, 'defaultValues is not an array');
      });

      it('length of CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultValues should equal CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics  ',
          function ()
      {      
          assert(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].defaultValues.length ==  cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics.length, 'Length is not the same');
      });

      it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics should be an array ',
          function ()
      {
          assert.isArray(cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].defaultPollingCharacteristics, 'defaultPollingCharacteristics is not an array');
      });
   }
});

// *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics *******
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].requiredCharacteristics', function ()
{
   for (let index=0; index < cmd4.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      let length = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics.length; 
      for (let rindex=0; rindex < length; rindex ++)
      {

         let characteristic = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[rindex];

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + '] should be a number of  ',
             function ()
         {
             assert.isNumber(characteristic, 'characteristic must be a number matching CMD4_DEVICE_TYPE_ENUM');
         });

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + '] < 0',
             function ()
         {
             assert.isAbove(characteristic, 0, 'characteristic is below zero');
         });

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].requiredCharacteristics[' + rindex + '] > ' + rindex,
             function ()
         {
             assert.isBelow(characteristic, cmd4.CMD4_ACC_TYPE_ENUM.EOL, 'characteristic not in range');
         });
      }
   }
});

// ** TEST CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristic  **
describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].defaultPollingCharacteristics', function ()
{
   for (let index=0; index < cmd4.CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      let length = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].defaultPollingCharacteristics.length;
      for (let rindex=0; rindex < length; rindex ++)
      {

         let characteristic = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].defaultPollingCharacteristics[rindex];

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics[' + rindex + '] should be a number of  ',
             function ()
         {
             assert.isNumber(characteristic, 'characteristic must be a number matching CMD4_DEVICE_TYPE_ENUM');
         });

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics[' + rindex + '] < 0',
             function ()
         {
             assert.isAbove(characteristic, 0, 'characteristic is below zero');
         });

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics[' + rindex + '] > ' + cmd4.CMD4_ACC_TYPE_ENUM.EOL,
             function ()
         {
             assert.isBelow(characteristic, cmd4.CMD4_ACC_TYPE_ENUM.EOL, 'characteristic not in range');
         });

         // Check that polled characteristic is in required characteristics
         let foundInRequiredCharacteristics = false;
         let dLength = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics.length;
         for (let dindex=0; dindex < dLength; dindex ++)
         {
             let rCharacteristic = cmd4.CMD4_DEVICE_TYPE_ENUM.properties[index].requiredCharacteristics[dindex];
             if (characteristic == rCharacteristic)
             {
                foundInRequiredCharacteristics = true;
                break;
             }
         }
         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultPollingCharacteristics[' + rindex + '] is in requiredCharacteristics',
             function ()
         {      
             assert.isTrue(foundInRequiredCharacteristics, 'Polling characteristic is not in required Characteristics');   
         });
      }
   }
});

// ******** TEST CMD4_ACC_TYPE_ENUM.properties *************
describe('Testing CMD4_ACC_TYPE_ENUM.properties', function ()
{
   it('CMD4_ACC_TYPE_ENUM.properties should be an array', function ()
   {
      assert.isObject(cmd4.CMD4_ACC_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object");
   });

   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {  
      it('CMD4_ACC_TYPE_ENUM.properties[' + index + '] should not be null ',
          function ()
      {      
             assert.isNotNull(cmd4.CMD4_ACC_TYPE_ENUM.properties[index], 'properties is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + index + '].name should not be null ',
          function ()
      {      
             assert.isNotNull(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].name, 'name is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + index + '].characteristic should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].characteristic, 'characteristic is null');
      });

      it('CMD4_ACC_TYPE_ENUM.properties[' + index + '].values should not be null ',
          function ()
      {      
          assert.isNotNull(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values, 'values is null');
      });

      let numberOfValues = Object.keys(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values).length;
      if (numberOfValues > 0)
      {
         for (let key in cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values)
         {
            it('CMD4_ACC_TYPE_ENUM.properties[' + index + '].values[' + key +'] should be a string ',
            function ()
            {
              assert.isString(key, "Key:'" + key + "' is not a string");
            });
            it('CMD4_ACC_TYPE_ENUM.properties[' + index + '].values[' + key + '] should be a string ',
            function ()
            {
               let value = cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values[key];
               assert.isNotNull(value, "Value:'" + value + "' is null");
            });
         }
      }
   }
});

// ***************** TEST State.js **********************
const child_process = require('child_process');


// *** TEST Get of Characteristic properties of default written data *******
describe('Testing State.js Get Characteristics default written data (' + cmd4.CMD4_ACC_TYPE_ENUM.EOL + ' of them)', () =>
{
   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {
      let characteristic = cmd4.CMD4_ACC_TYPE_ENUM.properties[index].name;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Get Device ' + characteristic + ' ';
      let args = ['Get', 'Device', characteristic]; 

      it(index + ':' + cmd + args2 + 'should return something', function(done)
      {

         const ps = child_process.spawnSync(cmd, args);

         var data='not set by me';

         if (ps.status !== 0)
         {
             assert.equal(ps.status, 0, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
         } else {
           data = ps.stdout;
           assert(data != '', 'data returned "' + data + '"');

           assert(data.length != 0, 'data returned: ' + data.length);
        }
        done();
     });
   }
});

// *** TEST Set of Characteristic properties *******

let dummyData = 'X0X0Test';

describe('Testing State.js Set Characteristics (' + cmd4.CMD4_ACC_TYPE_ENUM.EOL + ' of them)', () =>
{
   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {
      let characteristic = cmd4.CMD4_ACC_TYPE_ENUM.properties[index].name;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Set Device ' + characteristic + ' ' + dummyData;
      let args = ['Set', 'Device', characteristic, dummyData]; 

      const ps = child_process.spawnSync(cmd, args);

      it(index + ':' + cmd + args2 + ' should return no data', function(done)
      {
         var data='not set by me';

         console.log("status is '%s'", ps.status);
         if (ps.status !== 0)
         {
            assert.equal(ps.status, 0, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
         } else {
           data = ps.stdout;
           assert(data == '', 'No data should be returned:"' + data + '"');

        }
        done();
     });
   }
});

// *** TEST Get of Characteristic properties after set of dummy data *******

//console.log("Begin Testing ...");
describe('Begin Testing', function ()
{});


// *** TEST Get of Characteristic properties of written data *******
describe('Testing State.js Get Characteristics written data (' + cmd4.CMD4_ACC_TYPE_ENUM.EOL + ' of them). Note: May fail even number of times ????', () =>
{
   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {
      let characteristic = cmd4.CMD4_ACC_TYPE_ENUM.properties[index].name;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Get Device ' + characteristic + ' ';
      let args = ['Get', 'Device', characteristic]; 

      it(index + ':' + cmd + args2 + 'should return "' + dummyData + '"', function(done)
      {

         const ps = child_process.spawnSync(cmd, args);

         var data='not set by me';

         if (ps.status !== 0)
         {
           assert.equal(ps.status, 0, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
         } else {
           data = ps.stdout;
           // fixme ??? assert(data == dummyData, 'data returned "' + data + '"');
           //  The carriage return is stripped by getValue
           assert(data == dummyData + "\n", 'data returned "' + data + '"');

           assert(data.length != 0, 'data returned: ' + data.length);
        }
        done();
     });
   }
});

// *** TEST PS4.sh Set *******
// Note: Use PS4Device so as not to confuse with tests above

let ps4DummyData = true;

// Homebridge knows Boolean to be as true, so 'true' is what is sent.
// Cmd4 - interprets true/false as 0/1

describe('Testing PS4.sh Set PS4Device On', () =>
{
   let characteristic = 'On';
   let cmd = './Extras/Cmd4Scripts/PS4.sh'; 
   let args2 = ' Set PS4Device ' + characteristic + ' ' + ps4DummyData;
   let args = ['Set', 'PS4Device', characteristic, ps4DummyData]; 
   // Homebridge knows Boolean to be as true, so 'true' is what is sent.
   // Cmd4 - interprets true/false as 0/1

   const ps = child_process.spawnSync(cmd, args);

   it(cmd + args2 + ' should return no data', function(done)
   {
      var data='not set by me';

      console.log("status is '%s'", ps.status);
      if (ps.status !== 0)
      {
         assert.equal(ps.status, 0, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
      } else {
        data = ps.stdout;
        assert(data == '', 'No data should be returned:"' + data + '"');

      }
     done();
  });
});

// *** TEST PS4.sh Get *******
// Note: Use PS4Device so as not to confuse with tests above

describe('Testing PS4.sh Get PS4Device On', () =>
{
   let characteristic = 'On';
   let cmd = './Extras/Cmd4Scripts/PS4.sh'; 
   let args2 = ' Get PS4Device ' + characteristic + ' ';
   let args = ['Get', 'PS4Device', characteristic]; 

   it(cmd + args2 + 'should return "' + ps4DummyData + '"', function(done)
   {

      const ps = child_process.spawnSync(cmd, args);

      var data='not set by me';

      if (ps.status !== 0)
      {
        assert.equal(ps.status, 0, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
      } else {
        data = ps.stdout;
        // fixme ??? assert(data == dummyData, 'data returned "' + data + '"');
        //  The carriage return is stripped by getValue
        assert(data == ps4DummyData + "\n", 'data returned "' + data + '"');

        assert(data.length != 0, 'data returned: ' + data.length);
     }
     done();
  });
});
