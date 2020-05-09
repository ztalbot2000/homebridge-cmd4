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

describe('Initializing our plugin module', function ()
{});
var cmd4 = pluginModule.default(_api);

let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;




// ***************** TEST State.js **********************
const child_process = require('child_process');


// *** TEST Get of Characteristic properties of default written data *******
describe('Testing State.js Get Characteristics default written data (' + CMD4_ACC_TYPE_ENUM.EOL + ' of them)', () =>
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
      let characteristicString = cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Get Device ' + characteristicString + ' ';
      let args = ['Get', 'Device', characteristicString]; 

      it(accTypeEnumIndex + ':' + cmd + args2 + 'should return something', function(done)
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

describe('Testing State.js Set Characteristics (' + CMD4_ACC_TYPE_ENUM.EOL + ' of them)', () =>
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Set Device ' + characteristicString + ' ' + dummyData;
      let args = ['Set', 'Device', characteristicString, dummyData]; 

      const ps = child_process.spawnSync(cmd, args);

      it(accTypeEnumIndex + ':' + cmd + args2 + ' should return no data', function(done)
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

describe('Begin Testing', function ()
{});


// *** TEST Get of Characteristic properties of written data *******
describe('Testing State.js Get Characteristics written data (' + cmd4.CMD4_ACC_TYPE_ENUM.EOL + ' of them). Note: May fail even number of times ????', () =>
{
   for (let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex ++)
   {
      let characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;
      let cmd = './Extras/Cmd4Scripts/State.js'; 
      let args2 = ' Get Device ' + characteristicString + ' ';
      let args = ['Get', 'Device', characteristicString]; 

      it(accTypeEnumIndex + ':' + cmd + args2 + 'should return "' + dummyData + '"', function(done)
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

