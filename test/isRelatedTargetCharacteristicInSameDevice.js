"use strict";

describe( "Initializing our CMD4 Libraries ", ( ) => {});

var _api = new HomebridgeAPI( ); // object we feed to Plugins

 // Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

let isRelatedTargetCharacteristicInSameDevice = require("../utils/isRelatedTargetCharacteristicInSameDevice");


// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
   {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
   });
});

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});



describe('Testing isRelatedTargetCharacteristicInSameDevice', ( ) =>
{
   it('configHasCharacteristicProps should be a function', ( ) =>
   {
      assert.isFunction(isRelatedTargetCharacteristicInSameDevice, "isRelatedTargetCharacteristicInSameDevice is not a function" );
   });

   it('isRelatedTargetCharacteristicInSameDevice return null With Device with No optional or required characteristics', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.Active;
      let deviceTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.AirPurifier;

      let result = isRelatedTargetCharacteristicInSameDevice( deviceTypeEnumIndex, accTypeEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM  );

      assert.isNull(result, `Device with no optional or required characteristics should return null` );
   });

   it('isRelatedTargetCharacteristicInSameDevice return With Device with required characteristics', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentHeatingCoolingState;
      let deviceTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.Thermostat;

      let result = isRelatedTargetCharacteristicInSameDevice( deviceTypeEnumIndex, accTypeEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM  );

      assert.equal( result, CMD4_ACC_TYPE_ENUM.TargetHeatingCoolingState, `Device required characteristics should return  relatedTargetAccTypeEnumIndex` );
   });

   it('isRelatedTargetCharacteristicInSameDevice return With Device with optional characteristics', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentRelativeHumidity;
      let deviceTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.Thermostat;

      let result = isRelatedTargetCharacteristicInSameDevice( deviceTypeEnumIndex, accTypeEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM  );

      assert.equal( result, CMD4_ACC_TYPE_ENUM.TargetRelativeHumidity, `Device optional characteristics should return  relatedTargetAccTypeEnumIndex` );
   });


   it('isRelatedTargetCharacteristicInSameDevice return null of non "Current" characteristic', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.On;
      let deviceTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.Siri;

      let result = isRelatedTargetCharacteristicInSameDevice( deviceTypeEnumIndex, accTypeEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM  );

      assert.isNull(result, `Active characteristic should result in no relatedTargetEnumIndex` );
   });

   it('isRelatedTargetCharacteristicInSameDevice return null of "Current" characteristic but not for sensor', ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentTemperature;
      let deviceTypeEnumIndex = CMD4_DEVICE_TYPE_ENUM.TemperatureSensor;

      let result = isRelatedTargetCharacteristicInSameDevice( deviceTypeEnumIndex, accTypeEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM  );

      assert.isNull(result, `Active characteristic should result in no relatedTargetEnumIndex` );
   });

});

