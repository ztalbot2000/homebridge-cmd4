'use strict';

var _api = new HomebridgeAPI(); // object we feed to Plugins
var Service = _api.hap.Service;
var Characteristic = _api.hap.Characteristic;


describe( `Testing require of CMD4_ACC_TYPE_ENUM.js`, ( ) =>
{
   it( `CMD4_ACC_TYPE_ENUM should be defined ( required correctly )`, ( ) =>
   {
      assert.isNotNull( CMD4_ACC_TYPE_ENUM, `CMD4_ACC_TYPE_ENUM is null` );
   });

   // ************ TEST UNINITIALIZED CMD4_ACC_TYPE_ENUM EOL **************
   describe( `Testing CMD4_ACC_TYPE_ENUM.EOL`, ( ) =>
   {
      it( `CMD4_ACC_TYPE_ENUM has EOL`, ( ) =>
      {
         assert.isNotNull( CMD4_ACC_TYPE_ENUM.EOL, `EOL is null` );
      });

      it( `CMD4_ACC_TYPE_ENUM.EOL =  ${ ACC_EOL }`, ( ) =>
      {
         assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, `CMD4_ACC_TYPE_ENUM.EOL FOUND: ${ CMD4_ACC_TYPE_ENUM.EOL }` );
      });

      it( `CMD4_ACC_TYPE_ENUM[ 0-${ CMD4_ACC_TYPE_ENUM.EOL } ] should equal value at index`, ( ) =>
      {
         for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_ACC_TYPE_ENUM[index], index );
         }
      });
   });
})

describe( `Testing INITIALIZED CMD4_ACC_TYPE_ENUM`, ( ) =>
{
   describe(`Testing Initialized CMD4_ACC_TYPE_ENUM.properties[]`, ( ) =>
   {
      it('CMD4_ACC_TYPE_ENUM.properties should be an object', ( ) =>
      {
         assert.isObject(CMD4_ACC_TYPE_ENUM.properties, `CMD4_DEVICE_TYPE_ENUM.properties is not an object` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.properties[]`, ( ) =>
      {
         for (let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            let result = CMD4_ACC_TYPE_ENUM.properties[ index ];

            // Make sure our properties are defined
            assert.isNotNull( result, `CMD4_ACC_TYPE_ENUM.properties[${ index }] is null. result: ${ result }` );
         }
      });
   });


   // TJOS STIFF ADDED

   // ** TEST ACC_TYPE_ENUM.properties[].props  **
   describe('Testing CMD4_ACC_TYPE_ENUM.properties[].props', ( ) =>
   {
      for ( let accTypeEnumIndex=0; accTypeEnumIndex < CMD4_ACC_TYPE_ENUM.EOL; accTypeEnumIndex++ )
      {
          if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.Name )
             continue;

          // Do not understand why Charateristic.PairingPairings is
          // undefined, but is okay in Cmd4
          // Problem occured with hap-nodejs 0.9.2, but not 0.8.5 &&
          //                      homebridge 1.3.1, but not 1.1.7
          if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.PairingPairings )
             continue;

          // Do not understand why Charateristic.TransmitPowerMaximum is
          // undefined, but is okay in Cmd4
          // Problem occured with hap-nodejs 0.9.2, but not 0.8.5 &&
          //                      homebridge 1.3.1, but not 1.1.7
          if ( accTypeEnumIndex == CMD4_ACC_TYPE_ENUM.TransmitPowerMaximum )
             continue;

          it( `CMD4_ACC_TYPE_ENUM.properties[ ${ accTypeEnumIndex } ].type should be a string`, ( ) =>
          {
             assert.isString( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type, ` type is not a string at index ${ accTypeEnumIndex }` );
          });

          let characteristic = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].characteristic;
          // *** TEST CMD4_ACC_TYPE_ENUM.properties[].characteristic *******
          // Make sure our characteristic is defined
          assert.isNotNull( characteristic, `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].characteristic is null` );

          assert.isFunction( characteristic, `characteristic is not a function at accTypeEnumIndex: ${ accTypeEnumIndex } result: ${ characteristic }` );

          it(`Testing CMD4_ACC_TYPE_ENUM.properties[].UUID is same as in hap string `, ( ) =>
          {

             // Make sure that the UUID we defined is valid.
             assert.equal(  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].UUID,
                            characteristic.UUID,
                           ` Our UUID is not the same at index: ${ accTypeEnumIndex }` );
          });

          it(`Testing CMD4_ACC_TYPE_ENUM.properties[].description is a string `, ( ) =>
          {

             assert.isString(  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].description,
                           ` description is not a string at index: ${ accTypeEnumIndex }` );
          });

          it(`Testing CMD4_ACC_TYPE_ENUM.properties[].description String length > 10 `, ( ) =>
          {

             assert.isAtLeast(  CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].description.length, 10,
                           ` description is is very short at index: ${ accTypeEnumIndex }` );
          });

          // Get the properties for this characteristic type
          let accProperties = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex];
          // Characteristics dont seem to get removed and homebridge put a limit
          // of 100 Characteristics per service, so just create a new service
          // per characteristic.  This is unit testing anyway, so not an issue.
          let serviceName = `Service${ accTypeEnumIndex }`;
          let service = new _api.hap.Service(serviceName, _api.hap.uuid.generate(serviceName ), serviceName );

          it('Creating service to test Characteristic', ( ) =>
          {
             assert.isNotNull(service, `Service is null at accTypeEnumIndex: ${ accTypeEnumIndex }` );
          });

          describe(`Testing CMD4_ACC_TYPE_ENUM.properties[ ${ accTypeEnumIndex } ]: ${ accProperties.type }`, ( ) =>
          {
             var characteristicString = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].type;

             // Check relatedCurrentAccTypeEnumIndex property
             it( `CMD4_ACC_TYPE_ENUM.properties[ ${ accTypeEnumIndex } ].relatedCurrentAccTypeEnumIndex`, ( ) =>
             {
                assert.isDefined( CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].relatedCurrentAccTypeEnumIndex, 'relatedCurrentAccTypeEnumIndex is not defined' );

                let relatedCurrentAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].relatedCurrentAccTypeEnumIndex;

                if ( relatedCurrentAccTypeEnumIndex != null )
                {
                   assert.isNumber( relatedCurrentAccTypeEnumIndex, `${ characteristicString } relatedCurrentAccTypeEnumIndex is not a number: ${ typeof relatedCurrentAccTypeEnumIndex }` );
                   assert.isAbove( relatedCurrentAccTypeEnumIndex, 0, `${ characteristicString } relatedCurrentAccTypeEnumIndex < 0: ${ relatedCurrentAccTypeEnumIndex }` );
                   assert.isBelow( relatedCurrentAccTypeEnumIndex, ACC_EOL, `${ characteristicString } relatedCurrentAccTypeEnumIndex is < ACC_EOL: ${ relatedCurrentAccTypeEnumIndex }` );

                   // Make sure they point to each other.
                   assert.equal( accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.properties[relatedCurrentAccTypeEnumIndex].relatedTargetAccTypeEnumIndex, `${ characteristicString } relatedCurrentAccTypeEnumIndex (${ relatedCurrentAccTypeEnumIndex }) not matching releatedTargetAccTypeEnumIndex` );
                }
             });

             // Check relatedTargetAccTypeEnumIndex property
             it( `CMD4_ACC_TYPE_ENUM.properties[ ${ accTypeEnumIndex } ].relatedTargetAccTypeEnumIndex`, ( ) =>
             {
                assert.isDefined( CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].relatedTargetAccTypeEnumIndex, 'relatedTargetAccTypeEnumIndex is not defined' );

                let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].relatedTargetAccTypeEnumIndex;

                if ( relatedTargetAccTypeEnumIndex != null )
                {
                   assert.isNumber( relatedTargetAccTypeEnumIndex, `${ characteristicString } relatedTargetAccTypeEnumIndex is not a number: ${ typeof relatedTargetAccTypeEnumIndex }` );
                   assert.isAbove( relatedTargetAccTypeEnumIndex, 0, `${ characteristicString } relatedTargetAccTypeEnumIndex < 0: ${ relatedTargetAccTypeEnumIndex }` );
                   assert.isBelow( relatedTargetAccTypeEnumIndex, ACC_EOL, `${ characteristicString } relatedTargetAccTypeEnumIndex is < ACC_EOL: ${ relatedTargetAccTypeEnumIndex }` );

                   // Make sure they point to each other.
                   assert.equal( accTypeEnumIndex, CMD4_ACC_TYPE_ENUM.properties[relatedTargetAccTypeEnumIndex].relatedCurrentAccTypeEnumIndex, `${ characteristicString } relatedTargetAccTypeEnumIndex (${ relatedTargetAccTypeEnumIndex }) not matching relatedCurrentAccTypeEnumIndex` );
                }
             });

             // We need to add the characteristic to the service so we can get its Hap properties
             service.addCharacteristic( characteristic );

             let hapProps = service.getCharacteristic(characteristic ).props;
             service.removeCharacteristic( characteristic );

             it( `HAP props for HomeBridge Characteristic: ${ accProperties.type }`, ( ) =>
             {
                assert.isNotNull( hapProps, `perms for Characteristic type: ${ accProperties.type } is null` );
             });

             let hapFormat = hapProps.format;

             // Test both Formats
             it(`CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.format should be the same`, ( ) =>
             {
                assert.equal( hapFormat, accProperties.props.format, `format:${ accProperties.props.format } not equal to expected ${ hapFormat }` );
             });

             // Test cFormat
             it(`CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.cFormat should not be null`, ( ) =>
             {
                assert.isNumber( accProperties.props.allowedWordCount, `allowedWordCount is not a Number at accTypeEnumIndex:${ accTypeEnumIndex }` );

                switch( hapFormat )
                {
                   case Characteristic.Formats.STRING:
                   case Characteristic.Formats.TLV8:
                   case Characteristic.Formats.DATA:
                      assert.equal( 0, accProperties.props.allowedWordCount, `allowedWordCount not 0 at accTypeEnumIndex: ${ accTypeEnumIndex }` );

                      break;
                   case Characteristic.Formats.INT:
                   case Characteristic.Formats.UINT8:
                   case Characteristic.Formats.UINT16:
                   case Characteristic.Formats.UINT32:
                   case Characteristic.Formats.BOOL:
                   case Characteristic.Formats.FLOAT:
                      assert.equal( 1, accProperties.props.allowedWordCount, `allowedWordCount not 1 at accTypeEnumIndex: ${ accTypeEnumIndex }` );
                      break;
                   default:
                      assert( `allowedWordCount unknown at accTypeEnumIndex: ${ accTypeEnumIndex }` );
                }

             });


             // Test units
             let hapUnits = hapProps.units;

             it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.units should be the same`, ( ) =>
             {
                assert.equal(hapUnits, accProperties.props.units, `units: ${ accProperties.props.units } not equal to expected: ${ hapUnits }` );
             });

             // test minValue
             let hapMinValue = hapProps.minValue;

             it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.minValue should be the same`, ( ) =>
             {
                 assert.equal( hapMinValue, accProperties.props.minValue, `minValue: ${ accProperties.props.minValue } not equal to expected: ${ hapMinValue }` );
             });

             // test maxValue
             let hapMaxValue = hapProps.maxValue;

             // They are missing AUTO
             if ( accTypeEnumIndex != CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState )
             {

                it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.maxValue should be the same`, ( ) =>
                {
                   assert.equal( hapMaxValue, accProperties.props.maxValue, `maxValue: ${ accProperties.props.maxValue } not equal to expected: ${ hapMaxValue }` );
                });
             } else {
                //console.log(`Homebridge is wrong, skipping` );
             }

             // test minStep
             let hapMinStep = hapProps.minStep;

             it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.minStep should be the same`, ( ) =>
             {
                assert.equal( hapMinStep, accProperties.props.minStep, `minStep: ${ accProperties.props.minStep } not equal to expected: ${ hapMinStep }` );
             });

             // Test if correct perms ( both ways )
             it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].props.perms are the same`, ( ) =>
             {
                let hapPerms = hapProps.perms;
                accProperties.props.perms.forEach( perm => assert.include( hapPerms, perm, ` ${ characteristicString } ( ${ accTypeEnumIndex } ) missing perm: ${ perm } in Hap Perm` ) );
                hapPerms.forEach( perm => assert.include( accProperties.props.perms, perm, ` ${ characteristicString } ( ${ accTypeEnumIndex } ) missing perm: ${ perm } in accProperties.props.perms` ) );
             });

             // Our validValues should not be null
             it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].validValues should not be null`, ( ) =>
             {
                assert.isNotNull(accProperties.validValues, 'validValues is Null' );
             });

             // test all validValues
             let hapValidValues = hapProps.validValues;

             if ( ! hapValidValues )
             {
                // We defined what valid values are for BOOL
                // so TRUE/FALSE can be a constant.
                if (hapFormat != _api.hap.Characteristic.Formats.BOOL )
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
                      it( `Our CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].validValues.length should be 0`, ( ) =>
                      {
                         assert.equal(Object.keys(accProperties.validValues ).length, 0, `validValuesh for: ${ accTypeEnumIndex } is not empty` );
                      });
                   } else {
                      // console.log(`Homebridge is wrong, skipping` );
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
                   it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].perms.length should be the same`, ( ) =>
                   {
                      assert.equal( hapValidValues.length, Object.keys(accProperties.validValues ).length, `validValues.length(${ Object.keys(accProperties.validValues ).length }) for: ${ accTypeEnumIndex } is not: ${ hapValidValues.length }` );
                   });

                   // test all validValues against hapValidValues
                   for ( let valuesIndex = 0; valuesIndex < hapValidValues.length; valuesIndex++ )
                   {
                       let hapValue = hapValidValues[valuesIndex];

                       it( `CMD4_ACC_TYPE_ENUM.properties[${ accTypeEnumIndex }].validValues[${ valuesIndex }] should be the same`, ( ) =>
                       {
                             let cmd4Key = Object.keys(accProperties.validValues )[valuesIndex];
                             let cmd4Value = accProperties.validValues[cmd4Key];
                             assert.equal( hapValue, cmd4Value, `validValues[${ valuesIndex }]: ${ cmd4Value } not equal to expected: ${ hapValue }` );
                       });
                   }
                } else {
                   // console.log(`Homebridge is wrong, skipping` );
                }
             }
             service.removeCharacteristic(characteristic );

          });
       }
   });
});

describe( `Testing CMD4_ACC_TYPE_ENUM.indexOfEnum`, ( ) =>
{
   it('CMD4_ACC_TYPE_ENUM.indexOfEnum should be a function', ( ) =>
   {
      assert.isFunction(CMD4_ACC_TYPE_ENUM.indexOfEnum, `CMD4_DEVICE_TYPE_ENUM.indexOfEnum is not a function` );
   });

   it(`Testing CMD4_ACC_TYPE_ENUM.indexOfEnum( "On" )`, ( ) =>
   {
      let result = CMD4_ACC_TYPE_ENUM.indexOfEnum( "On" );

      assert.equal( result, CMD4_ACC_TYPE_ENUM.On,`Index is incorrect for "On"` );
   });

   it(`Testing CMD4_ACC_TYPE_ENUM.indexOfEnum( "on" )`, ( ) =>
   {
      let result = CMD4_ACC_TYPE_ENUM.indexOfEnum( "on" );

      assert.equal( result, CMD4_ACC_TYPE_ENUM.On,`Index is incorrect for "on"` );
   });

});



describe( `Testing CMD4_ACC_TYPE_ENUM stringConversionFunction`, ( ) =>
{
   describe( `Testing CMD4_ACC_TYPE_ENUM.properties[].stringConversionFunction`, ( ) =>
   {
      it( 'CMD4_ACC_TYPE_ENUM[ 0 - ${ ACC_EOL } ].stringConversionFunction should be a function', ( ) =>
      {
         for ( let index = 0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            assert.isFunction( CMD4_ACC_TYPE_ENUM.properties[ index ].stringConversionFunction, `Missing conversion function at index: ${ index }` );
         }
      });
   });

   it(`stringConversionFunction of AirParticulateSize of UINT8 Number should be Number.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateSize;
      let value = 60;
      let expectedResult = 60;


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of AirParticulateSize of UINT8 String should be Number.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.AirParticulateSize;
      let value = "60";
      let expectedResult = 60;


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of TargetTemperature of Float should be Float.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = 60.2;
      let expectedResult = 60.2;


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of TargetTemperature of Float String should be Float.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = "60.2";
      let expectedResult = 60.2;


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of TargetTemperature of Float "0.0" should be 0.0`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = "0.0";
      let expectedResult = 0.0;
      let expectedResultType = "number";  // There is no float type


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );

      let resultType = typeof result;

      assert.equal( resultType, expectedResultType, `stringConversionFunction of valid data with full properties returned incorrect result. Expected: ${ expectedResultType } received: ${ result }` );
   });

   it(`stringConversionFunction of TargetTemperature of Float "0" should be float`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.TargetTemperature;
      let value = "0";
      let expectedResult = 0;
      let expectedResultType = "number";  // There is no float type


      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );

      let resultType = typeof result;

      assert.equal( resultType, expectedResultType, `stringConversionFunction of valid data with full properties returned incorrect result. Expected: ${ expectedResultType } received: ${ result }` );
   });


   it(`stringConversionFunction of Name of string1 should be String.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Name;
      let value = "Device";
      let expectedResult = "Device";

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Name of number should be String.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Name;
      let value = 123;
      let expectedResult = "123";

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of FAlse should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "FAlse";
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of "FAlse" should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "FAlse";
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of "True" should be true.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "true";
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of false should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = false;
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of true should be true.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = true;
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of 0 should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = 0;
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of 1 should be true (On).`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = 1;
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of BOOL of 0 should be false (Off) .`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
      let value = 0;
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of BOOL of 1 should be True (On).`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
      let value = 1;
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of 1 should be true .`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = 1;
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });

   it(`stringConversionFunction of Mute of "1" should be True (On).`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "1";
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of 0 should be false (off).`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = 0;
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of "0" should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "0";
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of true should be true.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = true;
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of false should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = false;
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of "false" should be false.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "false";
      let expectedResult = false;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
   it(`stringConversionFunction of Mute of "true" should be true.`, ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Mute;
      let value = "true";
      let expectedResult = true;

      let result = CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].stringConversionFunction( value  );

      assert.equal( result, expectedResult, `stringConversionFunction of valid data with full properties returned incorrect result: ${ result }` );
   });
});


describe( `Testing CMD4_ACC_TYPE_ENUM Add Characteristic`, ( ) =>
{
   it( `ACC_DATA.add should be a function`, ( ) =>
   {
      assert.isFunction( CMD4_ACC_TYPE_ENUM.add, `.add is not a function` );
   });
   it( `CMD4_ACC_TYPE_ENUM.EOL = ${ ACC_EOL }`, ( ) =>
   {
      assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, `CMD4_ACC_TYPE_ENUM.EOL FOUND: ${ CMD4_ACC_TYPE_ENUM.EOL }` );
   });

   // Changing the number of characteristics screws up other tests.
   it.skip( `CMD4_ACC_TYPE_ENUM.add creates new characteristic, incrementing EOL`, ( ) =>
   {
      let definition = { };
          definition.type = "PointX";
          definition.description = "An X Coordinate";
          definition.props = { };
          definition.props.format = "uint32";
          definition.props.minValue = 0;
          definition.props.minStep = 1;
          definition.props.perms = [ "pr", "pw", "ev" ];
          definition.validValues = { };

      let characteristic = CMD4_ACC_TYPE_ENUM.add( _api, definition.type, definition.description, definition.props, definition.validValues );

      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.PointX;
      assert.equal( accTypeEnumIndex, ACC_EOL, `ACC_TYPE_ENUM_INDEX.PointX not defined` );

      assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL +1, `CMD4_ACC_TYPE_ENUM not incremented` );


      assert.isNotNull( characteristic, `New characteristic was is null ` );

   });

   // Changing the number of characteristics screws up other tests.
   it.skip( `CMD4_ACC_TYPE_ENUM.add creates new characteristic compatible with service`, ( ) =>
   {
      let definition = { };
          definition.type = "PointX";
          definition.description = "An X Coordinate";
          definition.props = { };
          definition.props.format = "uint32";
          definition.props.minValue = 0;
          definition.props.minStep = 1;
          definition.props.perms = [ "pr", "pw", "ev" ];
          definition.validValues = { };

      // Create the new characteristic.
      CMD4_ACC_TYPE_ENUM.add( _api, definition.type, definition.description, definition.props, definition.validValues );

      // Create a service to add the new characteristic.
      let switchService = new Service.Switch();
      assert.instanceOf( switchService , Service, "Expected switchService to be instance of Service. Found %s" , switchService );

      // Add the new characteristic to the test service.
      switchService.addCharacteristic( CMD4_ACC_TYPE_ENUM.properties[CMD4_ACC_TYPE_ENUM.PointX].characteristic );

      // Check to see if the characteristic was accepted by the service
      let result = switchService.testCharacteristic( CMD4_ACC_TYPE_ENUM.properties[ CMD4_ACC_TYPE_ENUM.PointX ].characteristic );

      assert.isTrue( result, `New characteristic not added to service. result: ${ result }` );
   });

});

