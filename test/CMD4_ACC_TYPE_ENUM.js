'use strict';

var _api = new HomebridgeAPI(); // object we feed to Plugins


describe( "Testing require of CMD4_ACC_TYPE_ENUM.js", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM should be defined ( required correctly )", ( ) =>
   {
      assert.isNotNull( ACC_DATA, "CMD4_ACC_TYPE_ENUM is null" );
   });

   it( "ACC_DATA.init should be a function", ( ) =>
   {
      assert.isFunction( ACC_DATA.init, ".init is not a function" );
   });

   // ************ TEST UNINITIALIZED CMD4_ACC_TYPE_ENUM EOL **************
   describe( "Testing CMD4_ACC_TYPE_ENUM.EOL", ( ) =>
   {
      it( "CMD4_ACC_TYPE_ENUM has EOL", ( ) =>
      {
         assert.isNotNull( CMD4_ACC_TYPE_ENUM.EOL, "EOL is null" );
      });

      it( "CMD4_ACC_TYPE_ENUM.EOL = " + ACC_EOL, ( ) =>
      {
         assert.equal( CMD4_ACC_TYPE_ENUM.EOL, ACC_EOL, "CMD4_ACC_TYPE_ENUM.EOL FOUND: " + CMD4_ACC_TYPE_ENUM.EOL );
      });

      it( "CMD4_ACC_TYPE_ENUM[ 0-" + CMD4_ACC_TYPE_ENUM.EOL + " ] should equal value at index", ( ) =>
      {
         for ( let index=0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
         {
            assert.notEqual( CMD4_ACC_TYPE_ENUM[index], index );
         }
      });
   });
})

describe( "Testing INITIALIZED CMD4_ACC_TYPE_ENUM", ( ) =>
{
   // Init the library for all to use
   let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );


   describe("Testing Initialized CMD4_ACC_TYPE_ENUM.properties[]", ( ) =>
   {
      it('CMD4_ACC_TYPE_ENUM.properties should be an object', ( ) =>
      {
         assert.isObject(CMD4_ACC_TYPE_ENUM.properties, "CMD4_DEVICE_TYPE_ENUM.properties is not an object" );
      });

      it("Testing CMD4_ACC_TYPE_ENUM.properties[]", ( ) =>
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

          // Get the properties for this characteristic type
          let accProperties = CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex];
          // Characteristics dont seem to get removed and homebridge put a limit
          // of 100 Characteristics per service, so just create a new service
          // per characteristic.  This is unit testing anyway, so not an issue.
          let serviceName = 'Service' + accTypeEnumIndex;
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
                //console.log("Homebridge is wrong, skipping" );
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
                      // console.log("Homebridge is wrong, skipping" );
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
                   // console.log("Homebridge is wrong, skipping" );
                }
             }
             service.removeCharacteristic(characteristic );

          });
       }
   });
});

