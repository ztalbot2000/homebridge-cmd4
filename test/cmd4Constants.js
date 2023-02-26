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

       assert.equal( constants.FAKEGATO_TYPE_ENERGY, "energy", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_ROOM, "room", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_WEATHER, "weather", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_DOOR, "door", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_MOTION, "motion", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_THERMO, "thermo", `Incorrect global value` );
       assert.equal( constants.FAKEGATO_TYPE_AQUA, "aqua", `Incorrect global value` );
       assert.equal( constants.EVE, "eve", `Incorrect global value` );
       assert.equal( constants.STORAGE, "storage", `Incorrect global value` );
       assert.equal( constants.STORAGEPATH, "storagePath", `Incorrect global value` );
       assert.equal( constants.FOLDER, "folder", `Incorrect global value` );
       assert.equal( constants.KEYPATH, "keyPath", `Incorrect global value` );
       assert.equal( constants.STATUS, "status", `Incorrect global value` );
       assert.equal( constants.TEMP, "temp", `Incorrect global value` );
       assert.equal( constants.SETTEMP, "setTemp", `Incorrect global value` );
       assert.equal( constants.HUMIDITY, "humidity", `Incorrect global value` );
       assert.equal( constants.PPM, "ppm", `Incorrect global value` );
       assert.equal( constants.POWER, "power", `Incorrect global value` );
       assert.equal( constants.PRESSURE, "pressure", `Incorrect global value` );
       assert.equal( constants.CURRENTTEMP, "currentTemp", `Incorrect global value` );
       assert.equal( constants.VALVEPOSITION, "valvePosition", `Incorrect global value` );
       assert.equal( constants.WATERAMOUNT, "waterAmount", `Incorrect global value` );
       assert.equal( constants.TIME, "time", `Incorrect global value` );
       assert.equal( constants.PATH, "path", `Incorrect global value` );

       assert.equal( constants.FS, "fs", `Incorrect global value` );
       assert.equal( constants.GOOGLE_DRIVE, "googleDrive", `Incorrect global value` );

       assert.equal( constants.OUTPUTCONSTANTS, "outputConstants", `Incorrect global value` );
       assert.equal( constants.STATUSMSG, "statusMsg", `Incorrect global value` );

       assert.equal( constants.TYPE, "type", `Incorrect global value` );
       assert.equal( constants.SUBTYPE, "subType", `Incorrect global value` );
       assert.equal( constants.DISPLAYNAME, "displayName", `Incorrect global value` );
       assert.equal( constants.UUID, "uuid", `Incorrect global value` );
       assert.equal( constants.ACCESSORY, "accessory", `Incorrect global value` );
       assert.equal( constants.CATEGORY, "category", `Incorrect global value` );
       assert.equal( constants.PUBLISHEXTERNALLY, "publishExternally", `Incorrect global value` );
       assert.equal( constants.PROPS, "props", `Incorrect global value` );
       assert.equal( constants.CHARACTERISTIC, "characteristic", `Incorrect global value` );
       assert.equal( constants.TIMEOUT, "timeout", `Incorrect global value` );
       assert.equal( constants.QUEUE, "queue", `Incorrect global value` );
       assert.equal( constants.POLLING, "polling", `Incorrect global value` );
       assert.equal( constants.INTERVAL, "interval", `Incorrect global value` );
       assert.equal( constants.STATECHANGERESPONSETIME, "stateChangeResponseTime", `Incorrect global value` );
       assert.equal( constants.STATE_CMD_PREFIX, "state_cmd_prefix", `Incorrect global value` );
       assert.equal( constants.STATE_CMD_SUFFIX, "state_cmd_suffix", `Incorrect global value` );
       assert.equal( constants.STATE_CMD, "state_cmd", `Incorrect global value` );
       assert.equal( constants.FAKEGATO, "fakegato", `Incorrect global value` );
       assert.equal( constants.REQUIRES, "requires", `Incorrect global value` );
       assert.equal( constants.CONSTANTS, "constants", `Incorrect global value` );
       assert.equal( constants.VARIABLES, "variables", `Incorrect global value` );
       assert.equal( constants.LINKEDTYPES, "linkedTypes", `Incorrect global value` );
       assert.equal( constants.ACCESSORIES, "accessories", `Incorrect global value` );
       assert.equal( constants.URL, "url", `Incorrect global value` );
       assert.equal( constants.ALLOWTLV8, "allowTLV8", `Incorrect global value` );

       assert.equal( constants.CMD4_STORAGE_lv, "cmd4Storage", `Incorrect global value` );

       done( );
   });

});
describe( "Testing cmd4Constants ErrorStrings", function( )
{
   it( "Test typeof Error.", function ( done )
   {
      let e = new Error("Some Error String");
      //let t = typeof e;
      console.log("typeof e is -->%s<--", typeof e );
      //console.log("typeof Error is -->%s<--", t );
      if ( e instanceof Error )
         console.log("instanceof Error is Error" );
      else
         console.log("instanceof Error is not Error" );

      if ( e instanceof Object )
         console.log("instanceof Error is Object" );
      else
         console.log("instanceof Error is not Object" );

      if ( e instanceof Number )
         console.log("instanceof Error is Number" );
      else
         console.log("instanceof Error is not Number" );

      if ( e instanceof String )
         console.log("instanceof Error is String" );
      else
         console.log("instanceof Error is not String" );

      assert.instanceOf( e , Error, "Expected e to be instance of Error. Found %s" , e );

      done();

   });

   it( "All cmd4Constants error Strings should be declared correctly.", function ( done )
   {
      let len = Object.keys( constants.ERROR_STRINGS ).length;

      assert.equal( constants.ERROR_STRING_MIN - constants.ERROR_STRING_MAX + 1, len, `Totals do not match` );

      assert.equal( constants.ERROR_STRINGS[ constants.ERROR_STRING_MIN - constants.ERROR_TIMER_EXPIRED ],
                    "Timer expired contacting accessory",
                    "ERROR_TIMER_EXPIRED not defined correctly");
      assert.equal( constants.ERROR_STRINGS[ constants.ERROR_STRING_MIN - constants.ERROR_NULL_REPLY ],
                    "Reply is NULL",
                    "ERROR_NULL_REPPLY not defined correctly");
      done();

   });

   it( "cmd4Constants.errorString should be a function", ( ) =>
   {
      assert.isFunction( constants.errorString, "errorString is not a function" );
   });

   it( "cmd4Constants errorString function works correctly.", function ( done )
   {
      assert.equal( constants.errorString( constants.ERROR_TIMER_EXPIRED ),
                    "Timer expired contacting accessory",
                    "ERROR_TIMER_EXPIRED not defined correctly" );
      assert.equal( constants.errorString( constants.ERROR_NO_DATA_REPLY ),
                    "No data returned from accessory",
                    ".ERROR_NO_DATA_REPLY not defined correctly" );

      done();

   });

   it( "cmd4Constants errorString limits.", function ( done )
   {
      assert.equal( constants.errorString( constants.ERROR_STRING_MIN +1  ),
                    "Invalid Error min index: " + ( constants.ERROR_STRING_MIN +1 ),
                    ".errorString MIN limit error" );
      assert.equal( constants.errorString( constants.ERROR_STRING_MAX -1  ),
                    "Invalid Error max index: " + ( constants.ERROR_STRING_MAX -1 ),
                    ".errorString MAX limit error" );

      done();

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
                        "./tools/Cmd4AccDocGenerator",
                        "./test/cmd4Constants.js",
                       ];
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
      assert.equal( foundCount, len , `Totals do not match` );

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
                        "./tools/Cmd4AccDocGenerator"
                      ];

      let totalSourceConstants = 0;
      let foundCount = 0;

      // The constant must be in one of the Cmd4 source files
      for ( let fileIndex = 0;
         (fileIndex < cmd4Files.length );
         fileIndex++ )
      {
         let cmd4File = cmd4Files[ fileIndex ];

         let sourceData = fs.readFileSync( cmd4File, "utf8" );

         // Matches source files with stuff like:
         // constants.STANDALONE
         var sourceConstantsMatches = sourceData.toString().match(/constants.(\w).*\n/g);
         assert.isNotNull( sourceConstantsMatches, `Fike ${ cmd4File } has no constants and should be removed from this testcase` );

         // This is the array of defined constants
         var sourceMappedConstantsArray = sourceConstantsMatches.map( ( s ) =>
         {
            let returningArray = [ ];
            let occurranceCountArray = s.match( /constants\./g );

            if ( occurranceCountArray != null )
            {
               for ( let i = 0; i < occurranceCountArray.length; i++ )
               { // '{' - Used to cancel RegExp in vim
                  s = s.slice( s.indexOf( "constants." ) + 10 );

                  const reg = new RegExp(`[\\s|,|:|;|}]|\\)|\\(` );
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
                     // console.log("Duplicate  X->%s<-X", sourceConstant );
                     // Duplicate
                  }

                  // Proceed to the next constant within the same line
                  if ( i + 1 < occurranceCountArray.length )
                  {
                     s = s.slice( sourceConstant.length )
                  }
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
               // console.log("Unwinding -->%s<--", sourceConstant );
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

             //if ( constants.indexOf( sourceConstant ) == -1 )
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
      // If you are off by 1 or 2, check that the code does not
      // have something like constants.QUEUETYPE_WORM2)
      // Where the bracket follow the constant without a space
      assert.equal( foundCount, totalSourceConstants, `Totals do not match` );

      done( );
   }).timeout(20000);
});
