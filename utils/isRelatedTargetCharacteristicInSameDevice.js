
'use strict';

// Description:
//    Check if the device definition of a "Target*" characteristic is in the
//    same required or optional characteristic of a "Current" characteristic.
//    The TargetCharacteristic must not equal CurrentCharacteristic as well.
//
// @param accDeviceEnumIndex
// @param accCurrentEnumIndex
// @param CMD4_DEVICE_TYPE_ENUM
// @param CMD4_ACC_TYPE_ENUM
//
// @returns the targetCharacteristic or null
//
function isRelatedTargetCharacteristicInSameDevice( accDeviceTypeEnumIndex, accCurrentEnumIndex, CMD4_DEVICE_TYPE_ENUM, CMD4_ACC_TYPE_ENUM )
{
   let relatedTargetAccTypeEnumIndex = CMD4_ACC_TYPE_ENUM.properties[ accCurrentEnumIndex ].relatedTargetAccTypeEnumIndex;

   // They cannot be the same as in the case of "Active"
   if ( relatedTargetAccTypeEnumIndex == accCurrentEnumIndex )
      return null;

   // Get the Device properties
   let devProperties = CMD4_DEVICE_TYPE_ENUM.properties[ accDeviceTypeEnumIndex ];

   // Get the Devices required and optional characteristics
   let requiredCharacteristics = devProperties.requiredCharacteristics;
   let optionalCharacteristics = devProperties.optionalCharacteristics;


   // The Current Characteristic must be in the required object list as is the Target Characteristic
   // Note: By default it will be put their automatically as this message says
   //     **** Adding required characteristic TargetTemperature for Thermostat
   //          Not defining a required characteristic can be problematic
   //     Except for Optional "Current*" "Target*" characteristics which
   //     isRelatedTargetCharacteristicInSameDevice does resolve.
   if ( requiredCharacteristics && requiredCharacteristics.find( entry => entry.type === accCurrentEnumIndex ) &&
        requiredCharacteristics.find( entry => entry.type === relatedTargetAccTypeEnumIndex ) )
      return relatedTargetAccTypeEnumIndex;

   // The Current Characteristic must be in the optional Array list as is the Target Characteristic
   if ( optionalCharacteristics && optionalCharacteristics.includes( accCurrentEnumIndex ) &&
        optionalCharacteristics.includes( relatedTargetAccTypeEnumIndex ) )
      return relatedTargetAccTypeEnumIndex;

   return null;
}


module.exports = isRelatedTargetCharacteristicInSameDevice;
