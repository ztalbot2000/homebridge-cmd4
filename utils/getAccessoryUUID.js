'use strict';

// Description:
//    Get or create a Accessories UUID based on what it is configured as.
//
// @param config - The accessories config information.
// @param UUIDGen - api.hap.uuid
//
// @returns - UUID or exits as all Accessories must have a name or displayName.
//
// Note: This follows the getAccessoryName logic of getting the Accessories name.

var getAccessoryUUID = function ( config, UUIDGen )
{
   if ( config.UUID )
      return config.UUID;
   if ( config.uuid )
      return config.uuid;

   if ( config.name )
      return UUIDGen.generate( config.name );

   if ( config.Name )
      return UUIDGen.generate( config.Name );

   if ( config.displayName )
      return UUIDGen.generate( config.displayName );

   if ( config.DisplayName )
      return UUIDGen.generate( config.DisplayName );

   throw new Error( "You must either, 'displayName' and or 'name' per accessory." );
}

module.exports = getAccessoryUUID;
