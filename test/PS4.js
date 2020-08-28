'use strict';

var fs = require('fs');

var assert = require('chai').assert;

const os = require('os');
const cmd4StateDir = os.homedir() + '/.homebridge/Cmd4Scripts/Cmd4States/'

var glob = require('glob')

describe('Cleaning up any old Cmd4States/Status_Device_* files ...', ( ) =>
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
               done( );
            });
         });
      }
   })
});


// ***************** TEST LOADING **********************

// This would be the plugin un-initialized
var pluginModule = require('../index');

describe('Testing load of index.js', ( ) =>
{
   it('index.js loaded should not be null', ( ) =>
   {
      assert.isNotNull(pluginModule, 'loading resulted in null');
   });

   var t = typeof pluginModule.default;
   it('index.js default initializer should be found', ( ) =>
   {
      assert.equal(t, "function");
   });
});

// ************ TEST UNINITIALIZED CMD4_DEVICE_TYPE_ENUM EOL **************
describe('Testing CMD4_DEVICE_TYPE_ENUM EOL', ( ) =>
{
   it('CMD4_DEVICE_TYPE_ENUM has EOL', ( ) =>
   {
      assert.isNotNull(pluginModule.CMD4_DEVICE_TYPE_ENUM.EOL, 'EOL is null');
   });

   it('CMD4_DEVICE_TYPE_ENUM.EOL >= 50', ( ) =>
   {
      assert.isAtLeast(pluginModule.CMD4_DEVICE_TYPE_ENUM.EOL, 50);
   });
});





var HomebridgeAPI = require('../node_modules/homebridge/lib/api').HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins

describe('Testing homebridge API', ( ) =>
{
   it('API should not be null', ( ) =>
   {
      assert.isNotNull(_api, '_api is null');
   });
});




// ***************** TEST State.js **********************
const child_process = require('child_process');

// *** TEST PS4.sh Set *******
// Note: Use PS4Device so as not to confuse with any previous tests

let ps4DummyData = true;

// Homebridge knows Boolean to be as true, so 'true' is what is sent.
// Cmd4 - interprets true/false as 0/1

describe('Testing PS4.sh Set PS4Device On. Should fail as no PS4 on Network', () =>
{
   let characteristicString = 'On';
   let cmd = './Extras/Cmd4Scripts/Examples/PS4.sh';
   let args2 = ' Set PS4Device ' + characteristicString + ' ' + ps4DummyData;
   let args = ['Set', 'PS4Device', characteristicString, ps4DummyData];
   // Homebridge knows Boolean to be as true, so 'true' is what is sent.
   // Cmd4 - interprets true/false as 0/1

   const ps = child_process.spawnSync(cmd, args);

   it(cmd + args2 + ' should return no data', ( ) =>
   {
      var data='not set by me';

      console.log("status is '%s'", ps.status);
      if (ps.status !== 2)
      {
         assert.equal(ps.status, 2, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
      } else {
        data = ps.stdout;
        assert(data == '', 'No data should be returned:"' + data + '"');

      }
  });
});

// *** TEST PS4.sh Get *******
// Note: Use PS4Device so as not to confuse with tests above

describe('Testing PS4.sh Get PS4Device On. Should fail as no PS4 on Network', () =>
{
   let characteristicString = 'On';
   let cmd = './Extras/Cmd4Scripts/PS4.sh';
   let args2 = ' Get PS4Device ' + characteristicString + ' ';
   let args = ['Get', 'PS4Device', characteristicString];

   it(cmd + args2 + 'should return "' + "null" + '"', ( ) =>
   {
      const ps = child_process.spawnSync(cmd, args);

      var data='not set by me';

      if (ps.status !== 2)
      {
        assert.isNull(ps.status, 'Process error stdout:' + ps.stdout + ' stderr:' + ps.stderr + ' status:' + ps.status + ' signal:' + ps.signal);
      } else {
        data = ps.stdout;
        // fixme ??? assert(data == dummyData, 'data returned "' + data + '"');
        //  The carriage return is stripped by getValue
        assert(data == ps4DummyData + "\n", 'data returned "' + data + '"');

        assert(data.length != 0, 'data returned: ' + data.length);
     }
  });
});
