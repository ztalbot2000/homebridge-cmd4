"use strict";

// ***************** TEST LOADING **********************


const constants = require( "../cmd4Constants" );


describe( "Testing cmd4Constants", function( )
{
   it( "All cmd4Constants should be declared the same.", function ( done )
   {
       assert.equal( constants.STANDALONE, "Standalone", `Incorrect global value` );
       assert.equal( constants.PLATFORM, "Platform", `Incorrect global value` );

       assert.equal( constants.SLOW_STATE_CHANGE_RESPONSE_TIME, 10000, `Incorrect global value` );
       assert.equal( constants.MEDIUM_STATE_CHANGE_RESPONSE_TIME, 3000, `Incorrect global value` );
       assert.equal( constants.FAST_STATE_CHANGE_RESPONSE_TIME, 1000, `Incorrect global value` );

       assert.equal( constants.DEFAULT_TIMEOUT, 60000, `Incorrect global value` );
       assert.equal( constants.DEFAULT_INTERVAL, 60000, `Incorrect global value` );

       assert.equal( constants.DEFAULT_STATUSMSG, "TRUE", `Incorrect global value` );
       assert.equal( constants.DEFAULT_QUEUE_STAT_MSG_INTERVAL, 1000, `Incorrect global value` );

       assert.equal( constants.FAKEGATO_TYPE_ENERGY_l, "energy", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_ROOM_l, "room", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_WEATHER_l, "weather", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_DOOR_l, "door", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_MOTION_l, "motion", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_THERMO_l, "thermo", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_AQUA_l, "aqua", `Incorrect global value` );
       assert.equal( constants.EVE, "Eve", `Incorrect global value` );
       assert.equal( constants.STORAGE, "Storage", `Incorrect global value` );
       assert.equal( constants.STORAGEPATH, "StoragePath", `Incorrect global value` );
       assert.equal( constants.FOLDER, "Folder", `Incorrect global value` );
       assert.equal( constants.KEYPATH, "KeyPath", `Incorrect global value` );
       assert.equal( constants.STATUS, "Status", `Incorrect global value` );
       assert.equal( constants.STATUS_l, "status", `Incorrect global value` );
       assert.equal( constants.TEMP, "Temp", `Incorrect global value` );
       assert.equal( constants.TEMP_l, "temp", `Incorrect global value` );
       assert.equal( constants.SETTEMP, "SetTemp", `Incorrect global value` );
       assert.equal( constants.SETTEMP_l, "setTemp", `Incorrect global value` );
       assert.equal( constants.HUMIDITY, "Humidity", `Incorrect global value` );
       assert.equal( constants.HUMIDITY_l, "humidity", `Incorrect global value` );
       assert.equal( constants.PPM, "Ppm", `Incorrect global value` );
       assert.equal( constants.PPM_l, "ppm", `Incorrect global value` );
       assert.equal( constants.POWER, "Power", `Incorrect global value` );
       assert.equal( constants.POWER_l, "power", `Incorrect global value` );
       assert.equal( constants.PRESSURE, "Pressure", `Incorrect global value` );
       assert.equal( constants.PRESSURE_l, "pressure", `Incorrect global value` );
       assert.equal( constants.CURRENTTEMP, "CurrentTemp", `Incorrect global value` );
       assert.equal( constants.CURRENTTEMP_l, "currentTemp", `Incorrect global value` );
       assert.equal( constants.VALVEPOSITION, "ValvePosition", `Incorrect global value` );
       assert.equal( constants.VALVEPOSITION_l, "valvePosition", `Incorrect global value` );
       assert.equal( constants.WATERAMOUNT_l, "waterAmount", `Incorrect global value` );
       assert.equal( constants.TIME_l, "time", `Incorrect global value` );
       assert.equal( constants.PATH_l, "path", `Incorrect global value` );
       assert.equal( constants.KEYPATH_l, "keyPath", `Incorrect global value` );

       assert.equal( constants.FS_l, "fs", `Incorrect global value` );
       assert.equal( constants.GOOGLE_DRIVE_l, "googleDrive", `Incorrect global value` );

       assert.equal( constants.OUTPUTCONSTANTS, "OutputConstants", `Incorrect global value` );
       assert.equal( constants.RESTART_RECOVER, "RestartRecover", `Incorrect global value` );
       assert.equal( constants.STATUSMSG, "StatusMsg", `Incorrect global value` );

       assert.equal( constants.TYPE, "Type", `Incorrect global value` );
       assert.equal( constants.SUBTYPE, "SubType", `Incorrect global value` );
       assert.equal( constants.DISPLAYNAME, "DisplayName", `Incorrect global value` );
       assert.equal( constants.UUID, "UUID", `Incorrect global value` );
       assert.equal( constants.ACCESSORY, "Accessory", `Incorrect global value` );
       assert.equal( constants.CATEGORY, "Category", `Incorrect global value` );
       assert.equal( constants.PUBLISHEXTERNALLY, "PublishExternally", `Incorrect global value` );
       assert.equal( constants.PROPS, "Props", `Incorrect global value` );
       assert.equal( constants.NAME, "Name", `Incorrect global value` );
       assert.equal( constants.MODEL, "Model", `Incorrect global value` );
       assert.equal( constants.MANUFACTURER, "Manufacturer", `Incorrect global value` );
       assert.equal( constants.SERIALNUMBER, "SerialNumber", `Incorrect global value` );
       assert.equal( constants.FIRMWAREREVISION, "FirmwareRevision", `Incorrect global value` );
       assert.equal( constants.CHARACTERISTIC, "Characteristic", `Incorrect global value` );
       assert.equal( constants.TIMEOUT, "Timeout", `Incorrect global value` );
       assert.equal( constants.QUEUE, "Queue", `Incorrect global value` );
       assert.equal( constants.DEFAULT_QUEUE_NAME, "No_Queue", `Incorrect global value` );
       assert.equal( constants.QUEUE_STAT_MSG_INTERVAL, "QueueStatMsgInterval", `Incorrect global value` );
       assert.equal( constants.POLLING, "Polling", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE_ALWAYS, "Always", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE_CACHED, "Cached", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE_POLLED, "Polled", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE_FULLYPOLLED, "FullyPolled", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE_DEMO, "Demo", `Incorrect global value` );
       assert.equal( constants.CMD4_MODE, "Cmd4_Mode", `Incorrect global value` );
       assert.equal( constants.FETCH, "Fetch", `Incorrect global value` );
       assert.equal( constants.INTERVAL, "Interval", `Incorrect global value` );
       assert.equal( constants.STATECHANGERESPONSETIME, "StateChangeResponseTime", `Incorrect global value` );
       assert.equal( constants.STATE_CMD_PREFIX, "State_cmd_prefix", `Incorrect global value` );
       assert.equal( constants.STATE_CMD_SUFFIX, "State_cmd_suffix", `Incorrect global value` );
       assert.equal( constants.STATE_CMD, "State_cmd", `Incorrect global value` );
       assert.equal( constants.FAKEGATO, "Fakegato", `Incorrect global value` );
       assert.equal( constants.REQUIRES, "Requires", `Incorrect global value` );
       assert.equal( constants.CONSTANTS, "Constants", `Incorrect global value` );
       assert.equal( constants.VARIABLES, "Variables", `Incorrect global value` );
       assert.equal( constants.LINKEDTYPES, "LinkedTypes", `Incorrect global value` );
       assert.equal( constants.ACCESSORIES, "Accessories", `Incorrect global value` );
       assert.equal( constants.URL, "Url", `Incorrect global value` );
       assert.equal( constants.ALLOWTLV8, "AllowTLV8", `Incorrect global value` );

       assert.equal( constants.storedValuesPerCharacteristic, "storedValuesPerCharacteristic", `Incorrect global value` );

       done( );
   });

});
var fs = require("fs");
describe( "Testing cmd4Constants - unused", function( )
{
   it( "All cmd4Constants should be used somewhere", function ( done )
   {
      var cmd4Files = [ "./Cmd4Platform.js",
                        "./Cmd4Accessory.js",
                        "./Cmd4PriorityPollingQueue.js",
                        "./index.js",
                        "./tools/Cmd4AccDocGenerator"];

      let data = fs.readFileSync( "./cmd4Constants.js", "utf8" );

      var exportMatches = data.toString().match(/exports.(\w).*\n/g);
      var result = exportMatches.map( ( s ) =>
      {
          s = s.slice(8);
          return s.substr(0, s.indexOf(' ') );
      });

      let foundCount=0;
      for ( let cIndex = 0;
                cIndex < result.length;
                cIndex++)
      {
         let found = false;
         let c = result[ cIndex ];
         const regex = new RegExp(`\\bconstants.${ c }[\\s|,|:|\\.]` ); // 115
         //console.log("Looking for constant: %s ( %s of %s )", c, cIndex, result.length );

         for ( let fileIndex = 0;
                   (fileIndex < cmd4Files.length );
                   fileIndex++ )
         {
             let cmd4File = cmd4Files[ fileIndex ];

             let code =  fs.readFileSync( cmd4File, "utf8" );

             var codeLines = code.split( '\n' );
             let lineCount = 0;
             for ( let lineIndex = 0;
                       lineIndex < codeLines.length;
                       lineIndex++, lineCount++ )
             {
                let line = codeLines[ lineIndex ];
                //let t = line.includes( s );   // 50
                let t = regex.test(line);
                if ( t == true )
                {
                   //console.log("Match found of %s on line: %s of file: %s", c, lineCount, cmd4File );
                   found = true;
                   foundCount++;
                   break;
                }
             }
             if (found == true )
                break;
          }
          if (found == false )
             console.log( "Not Found %s ", c );
      }
      console.log( "Total found was %s of %s ", foundCount, result.length );
      done( );
   }).timeout(20000);
});
