"use strict";

var fs = require("fs");

const constants = require( "../cmd4Constants" );


describe( "Testing cmd4Constants", function( )
{
   it( "All cmd4Constants should be declared the same.", function ( done )
   {
       assert.equal( constants.STANDALONE, "Standalone", `Incorrect global value` );
       assert.equal( constants.PLATFORM, "Platform", `Incorrect global value` );


       assert.equal( constants.DEFAULT_TIMEOUT, 60000, `Incorrect global value` );
       assert.equal( constants.DEFAULT_INTERVAL, 60000, `Incorrect global value` );

       assert.equal( constants.DEFAULT_STATUSMSG, "TRUE", `Incorrect global value` );

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
       assert.equal( constants.POLLING, "Polling", `Incorrect global value` );
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

       assert.equal( constants.CMD4_STORAGE_lv, "cmd4Storage", `Incorrect global value` );

       done( );
   });

});

describe( "Testing cmd4Constants - unused", function( )
{
   it( "All cmd4Constants should be used somewhere", function ( done )
   {
      var cmd4Files = [ "./Cmd4Platform.js",
                        "./Cmd4Accessory.js",
                        "./Cmd4PriorityPollingQueue.js",
                        "./utils/HV.js",
                        "./index.js",
                        "./lib/CMD4_DEVICE_TYPE_ENUM.js",
                        "./tools/Cmd4AccDocGenerator"];
      // This is the count of the found constants in result
      let foundCount=0;
      let len = Object.keys( constants ).length;

      Object.keys( constants ).forEach( ( key ) =>
      {
         // This one is not found yet
         let found = false;

         // This is the constant defind in cmd4Constants
         let c = key;

         // The regex to find the constant in the source files
         // A great regex site:
         // https://regex101.com/r/bE3c0x/5
         const regex = new RegExp( `.*constants.${ c}.*$` ); // 115

         //console.log("Looking for constants.%s ( %s of %s )", c, index, len );

         // The constant must be in one of the Cmd4 source files
         for ( let fileIndex = 0;
                   (fileIndex < cmd4Files.length );
                   fileIndex++ )
         {
            let cmd4File = cmd4Files[ fileIndex ];

            // Read in all the code from the source file
            let code =  fs.readFileSync( cmd4File, "utf8" );

            // If I could grep the source file I would, so
            // check the regex against each line
            var codeLines = code.split( '\n' );
            let lineCount = 0;
            for ( let lineIndex = 0;
                      lineIndex < codeLines.length;
                      lineIndex++, lineCount++ )
            {
               let line = codeLines[ lineIndex ];

               // Check the regex
               let t = regex.test( line );
               if ( t == true )
               {
                  found = true;
                  foundCount++;
                  break;
               }
            }
            if (found == true )
               break;
         }
         if (found == false )
         {
            console.log( "Not Found constants.%s", c );
            assert.isTrue( found, `Not found constants.${ c } in source files` );
         }
      });

      console.log( "Total found was %s of %s ", foundCount, len );
      assert.equal( foundCount, len, `Totals do not match` );

      done( );
   }).timeout(20000);
});

describe( "Testing source constants  -  are defined", function( )
{
   it( "All Source constants should be defined", function ( done )
   {
      var cmd4Files = [ "./Cmd4Platform.js",
                        "./Cmd4Accessory.js",
                        "./Cmd4PriorityPollingQueue.js",
                        "./utils/HV.js",
                        "./tools/Cmd4AccDocGenerator",
                        "./lib/CMD4_DEVICE_TYPE_ENUM.js",
                        "./tools/Cmd4AccDocGenerator"];

      let totalSourceConstants = 0;
      let foundCount = 0;

      // The constant must be in one of the Cmd4 source files
      for ( let fileIndex = 0;
         (fileIndex < cmd4Files.length );
         fileIndex++ )
      {
         let cmd4File = cmd4Files[ fileIndex ];

         let sourceData = fs.readFileSync( cmd4File, "utf8" );

         var sourceConstantsMatches = sourceData.toString().match(/constants.(\w).*\n/g);
         assert.isNotNull( sourceConstantsMatches, `Fike ${ cmd4File } has no constants and should be removed from this testcase` );

         // This is the array of defined constants
         var sourceMappedConstantsArray = sourceConstantsMatches.map( ( s ) =>
         {
            let returningArray = [ ];
            let occurranceCountArray = s.match( /constants./g );

            for ( let i = 0; i < occurranceCountArray.length; i++ )
            {
               s = s.slice( s.indexOf( "constants." ) + 10 );

               const reg = new RegExp(`[\\s|,|:|;|}]` );
               let sourceConstantLen = s.search( reg );
               let sourceConstant = s.substr(0,  sourceConstantLen );

               if ( returningArray.length == 0 )
               {
                  //console.log("pushing -->%s<--", sourceConstant );
                  returningArray.push( sourceConstant );
               } else if ( returningArray.find( ( entry ) => entry == sourceConstant ) == -1 )
               {
                  //console.log("pushing another  -->%s<--", sourceConstant );
                  returningArray.push( sourceConstant );
               } else
               {
                  // Duplicate
               }

               // Proceed to the next constant within the same line
               if ( i + 1 < occurranceCountArray.length )
               {
                  s = s.slice( sourceConstant.length )
               }
            }

            // return [ "NAME", "NAME2" ... ]
            return returningArray;
         });

         // Inside the mapping we created an array of constants because
         // there could be multiple constants per line. Therefore we need
         // to unwind the array of arrays.
         let sourceConstantsArray = [ ];
         sourceMappedConstantsArray.forEach( ( item ) =>
         {
            item.forEach( ( sourceConstant ) =>
            {
               sourceConstantsArray.push( sourceConstant );
            });
         });

         totalSourceConstants += sourceConstantsArray.length;

         // Over every source constant, find if defined in cmd4Constants
         for ( let sIndex = 0;
                   sIndex < sourceConstantsArray.length;
                   sIndex++)
         {
             let sourceConstant = sourceConstantsArray[ sIndex ];

             //if ( cmd4ConstantsArray.indexOf( sourceConstant ) == -1 )
             if ( constants[ sourceConstant ] == undefined )
             {
                console.log( "Not Found from: %s -->%s<--", cmd4File, sourceConstant );
                assert( "Not Found from: %s -->%s<--", cmd4File, sourceConstant );
             } else {
                //console.log( "FOUND -->%s<--", sourceConstant );
                foundCount ++
             }
         }
      }
      console.log( "Total found was %s of %s", foundCount, totalSourceConstants );
      assert.equal( foundCount, totalSourceConstants, `Totals do not match` );

      done( );
   }).timeout(20000);
});
