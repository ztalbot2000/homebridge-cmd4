'use strict';

var _api = new HomebridgeAPI(); // object we feed to Plugins


describe( "Testing require of CMD4_DEVICE_TYPE_ENUM.js", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM should be defined ( required correctly)", ( ) =>
   {
      assert.isNotNull( DEVICE_DATA, "CMD4_DEVICE_TYPE_ENUM is null" );
   });

   it( "DEVICE_DATA.init should be a function", ( ) =>
   {
      assert.isFunction( DEVICE_DATA.init, ".init is not a function" );
   });

   // ************ TEST UNINITIALIZED CMD4_DEVICE_TYPE_ENUM EOL **************
   describe( "Testing CMD4_DEVICE_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_DEVICE_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_DEVICE_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_DEVICE_TYPE_ENUM.EOL = " + DEVICE_EOL, ( ) =>
      {
         assert.equal( CMD4_DEVICE_TYPE_ENUM.EOL, DEVICE_EOL, "CMD4_DEVICE_TYPE_ENUM.EOL FOUND: " + CMD4_DEVICE_TYPE_ENUM.EOL );
      });

      it( "CMD4_DEVICE_TYPE_ENUM[ 0-" + CMD4_DEVICE_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_DEVICE_TYPE_ENUM[index], index );
         }
      });
   });
})

// ************ TEST INITIALIZED CMD4_DEVICE_TYPE_ENUM **************
describe( "Testing INITIALIZED CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   // Init the library for all to use
   let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
   let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );


   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].UUID *******
   describe('Testing Initialized CMD4_DEVICE_TYPE_ENUM.properties[].UUID', ( ) =>
   {
      it('Testing CMD4_DEVICE_TYPE_ENUM.properties[].UUID is a string ', ( ) =>
      {
         for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
         {
            let result = CMD4_DEVICE_TYPE_ENUM.properties[ index ].UUID;

            // Make sure that the UUID we defined is valid.
            expect(result).to.be.a( "string", " result is not a string. result:" + result + " at index: " + index );

         }
      });

      it('Testing CMD4_DEVICE_TYPE_ENUM.properties[].UUID is same as in hap string ', ( ) =>
      {
         for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
         {
            let service = CMD4_DEVICE_TYPE_ENUM.properties[ index ].service;
            let hapUUID = service.UUID;
            let result = CMD4_DEVICE_TYPE_ENUM.properties[ index ].UUID;

            // Make sure that the UUID we defined is valid.
            expect(result).to.equal( hapUUID, " Our UUID is not the same at index: " + index + ". result:" + result );
         }
      });
   });

   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].service *******
   describe('Testing Initialized CMD4_DEVICE_TYPE_ENUM.properties[].service', ( ) =>
   {
      for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
      {
         describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].service ', ( ) =>
         {
            // Make sure our service is defined
            let service = CMD4_DEVICE_TYPE_ENUM.properties[ index ].service;
            assert.isNotNull( service, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].service is null:" );
         });
      }
   });

   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].defaultCategory *******
   describe('Testing Initialized CMD4_DEVICE_TYPE_ENUM.properties[].defaultCategory', ( ) =>
   {
      for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
      {
         describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultCategory ', ( ) =>
         {
            // Make sure our defaultCategory is defined
            let defaultCategory = CMD4_DEVICE_TYPE_ENUM.properties[ index ].defaultCategory;
            assert.isNumber(defaultCategory, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].defaultCategory is not a number. category:" + defaultCategory );
            let result = _api.hap.Categories[ defaultCategory ];

            // Make sure that the default category we defined is valid.
            assert.isString(result, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].defaultCategory is not a string. result:" + result );

         });
      }
   });


   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].publishExternally *******
   describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].publishExternally', ( ) =>
   {
      for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
      {
         describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].publishExternally ', ( ) =>
         {

            assert.isBoolean(CMD4_DEVICE_TYPE_ENUM.properties[ index ].publishExternally, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].publishExternally is not a true|false" );

         });
      }
   });

   describe('Testing Initialized CMD4_DEVICE_TYPE_ENUM.properties[].defaultCategory', ( ) =>
   {
      for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
      {
         describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultCategory ', ( ) =>
         {
            // Make sure our defaultCategory is defined
            let defaultCategory = CMD4_DEVICE_TYPE_ENUM.properties[ index ].defaultCategory;
            assert.isNumber(defaultCategory, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].defaultCategory is not a number. category:" + defaultCategory );
            let result = _api.hap.Categories[ defaultCategory ];

            // Make sure that the default category we defined is valid.
            assert.isString(result, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].defaultCategory is not a string. result:" + result );

         });
      }
   });


   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].publishExternally *******
   describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[].publishExternally', ( ) =>
   {
      for (let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++ )
      {
         describe('Testing CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].publishExternally ', ( ) =>
         {

            assert.isBoolean(CMD4_DEVICE_TYPE_ENUM.properties[ index ].publishExternally, "CMD4_DEVICE_TYPE_ENUM.properties[" + index + "].publishExternally is not a true|false" );

         });
      }
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

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].defaultCategory should not be null ', ( ) =>
         {
             assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].defaultCategory, 'defaultCategory is null at index:' + index );
         });

         it('CMD4_DEVICE_TYPE_ENUM.properties[' + index + '].publishExternally should not be null ', ( ) =>
         {
             assert.isNotNull(CMD4_DEVICE_TYPE_ENUM.properties[index].publishExternally, 'publishExternally is null at index:' + index );
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

   // *** TEST CMD4_DEVICE_TYPE_ENUM.properties[].optionalCharacteristics *******
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
