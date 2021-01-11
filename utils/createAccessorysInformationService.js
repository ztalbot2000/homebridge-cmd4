'use strict';

module.exports = function createAccessorysInformationService( accessory )
{
   // Standalone accessories do not have platforms
   if ( accessory.platform )
   {
      // Platform accessories may already have information sercices if
      // they are restored from cache by Homebridge.
      let informationService = accessory.platform.getService( accessory.api.hap.Service.AccessoryInformation )
      if ( informationService )
      {
         accessory.log.debug( `Using Existing ( cached ) accessory information service for: ${ accessory.displayName }` );
         accessory.informationService = informationService;
      }
   }

   if ( ! accessory.informationService )
   {
      accessory.log.debug( `Creating new accessory information service for: ${ accessory.displayName }` );

      // Create accessory's Information Service
      accessory.informationService = new accessory.api.hap.Service.AccessoryInformation( );
   }


   // Add/update the Model characteristic, if it is defined.
   if ( accessory.model )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.Model, accessory.model );

   // Add/update the Manufacturer characteristic, if it is defined.
   if ( accessory.manufacturer )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.Manufacturer, accessory.manufacturer );

   // Add/update the serialNumber characteristic, if it is defined.
   if ( accessory.serialNumber )
      accessory.informationService
         .setCharacteristic( accessory.api.hap.Characteristic.SerialNumber, accessory.serialNumber );

   if ( accessory.services )
      accessory.services.push( accessory.informationService );
}
