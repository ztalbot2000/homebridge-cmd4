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

   if ( config.name )
      return UUIDGen.generate( config.name );

   if ( config.displayName )
      return UUIDGen.generate( config.displayName );

   console.log( "You must either, 'displayName' and or 'name' per accessory." );
   process.exit( 111 );
}

module.exports = getAccessoryUUID;
