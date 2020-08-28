'use strict';

const assert = require( "chai" ).assert;

var CMD4_ACC_TYPE_ENUM = {
   AccessoryFlags:                        0,
   properties: {}
};
CMD4_ACC_TYPE_ENUM.properties =
      {
         0:   { type: "AccessoryFlags",
                // characteristic: Characteristic.AccessoryFlags,
                // props: {format: Characteristic.Formats.UINT32,
                //         perms: [Characteristic.Perms.READ,
                //                 Characteristic.Perms.NOTIFY
                //                ]
                //        },
               validValues:
                  {"OPEN":    0,
                   "CLOSED":  1,
                   "OPENING": 2,
                   "CLOSING": 3,
                   "STOPPED": 4
                  }
              }
      };

var extractKeyValue = require( "../utils/extractKeyValue.js" );

describe( "Testing extractKeyValue", ( ) =>
{
   it( "extractKeyValue should be a function", ( ) =>
   {
      assert.isFunction( extractKeyValue, "extractKeyValue is not a function" );
   });

   it( "test 1 extractKeyValue should return correct key", ( ) =>
   {
      let expectedKey = "CLOSING";
      let value = 3;
      let result = extractKeyValue( CMD4_ACC_TYPE_ENUM.properties[0].validValues, value );
      assert.equal( result, expectedKey, "Test 1 extractKeyValue( " + value + " ) returned:" + result  + " expected:" +  expectedKey );
   });

   it( "test 2 extractKeyValue should return undefined for no value", ( ) =>
   {
      let expectedKey = undefined;
      let value = undefined;
      let result = extractKeyValue( CMD4_ACC_TYPE_ENUM.properties["0"].validValues, value );
      assert.equal( result, expectedKey, "Test 1 extractKeyValue( " + value + " ) returned:" + result  + " expected:" +  expectedKey );
   });
});
