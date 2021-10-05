'use strict';

let { indexOfEnum } = require( "../utils/indexOfEnum" );
Object.defineProperty(exports, "indexOfEnum", { enumerable: true, get: function () { return indexOfEnum.indexOfEnum; } });

// ***************** TEST Plugin Initialized Variables ***************

describe( "Initializing our plugin module", ( ) => {});

var _api = new HomebridgeAPI.HomebridgeAPI; // object we feed to Plugins

// Init the library for all to use
CMD4_DEVICE_TYPE_ENUM.init( _api.hap.Service );


// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
   {
      expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
   });
});
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
      expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});

// ******** TEST indexOfEnum .*************

describe( "Test indexOfEnum import", ( ) =>
{
   it( "indexOfEnum should be a function ", ( ) =>
   {
      assert.isFunction( indexOfEnum, "index of enum is not a function. Found: %s", typeof indexOfEnum );
   });
});

describe( "Test indexOfEnum", ( ) =>
{
   it( "indexOfEnum should be identify a deviceName ", ( ) =>
   {
      let j = CMD4_DEVICE_TYPE_ENUM.WiFiSatellite;
      let name = CMD4_DEVICE_TYPE_ENUM.properties[ j ].deviceName;
      let ucKeyIndex = CMD4_DEVICE_TYPE_ENUM.properties.indexOfEnum( i => i.deviceName === name );
      assert.equal( j, ucKeyIndex, "index of enum should identify the device %s(%s). Found: %s", name, j, ucKeyIndex );
   });

   it( "indexOfEnum should identify a Characteristic Name ", ( ) =>
   {
      let j = CMD4_ACC_TYPE_ENUM.BatteryLevel;
      let type = CMD4_ACC_TYPE_ENUM.properties[ j ].type;
      let ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === type);
      assert.equal( j, ucKeyIndex, "index of enum should identify the characteristic " + type + "(" + j + "). Found: " + ucKeyIndex );
   });
   it( "indexOfEnum should identify a Characteristic Name ", ( ) =>
   {
      let j = CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity;
      //let j = CMD4_ACC_TYPE_ENUM.CurrentHumidifierDehumidifierState;
      //let j = CMD4_ACC_TYPE_ENUM.blast;
      console.log("j=" + j);
      let type = CMD4_ACC_TYPE_ENUM.properties[ j ].type;
      let ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === type);
      assert.equal( j, ucKeyIndex, "index of enum should identify the characteristic " + type + "(" + j + "). Found: " + ucKeyIndex );
   });
   describe( "Test each characteristic type", ( ) =>
   {
      for ( let index = 0; index < ACC_EOL; index++ )
      {
         it( "indexOfEnum should be identify a Characteristic Type ", ( ) =>
         {
             let type = CMD4_ACC_TYPE_ENUM.properties[ index ].type;
             let ucKeyIndex = CMD4_ACC_TYPE_ENUM.properties.indexOfEnum( i => i.type === type);
             assert.equal( index, ucKeyIndex, "index of enum should identify the characteristic " + type + "(" + index + "). Found: " + ucKeyIndex );
         });
      }
   });
});
