'use strict';

// Description:
//    Routines of which given an Accessory Config. Extract the Accessory Name based on
//    either it's displayName or name key values.
//
// @param config - The Accessories json config.
//
// @returns name as a string or dies as all accessories must have a name
//

var getAccessoryName = function ( config )
{
   if ( config.name ) return config.name;
   if ( config.Name ) return config.Name;
   if ( config.displayName ) return config.displayName;
   if ( config.DisplayName ) return config.DisplayName;

   console.log( "You must have a 'Name' per accessory." );
   process.exit( 333 );
}

var getAccessoryDisplayName = function ( config )
{
   if ( config.displayName ) return config.displayName;
   if ( config.DisplayName ) return config.DisplayName;

   if ( config.name ) return config.name;
   if ( config.Name ) return config.Name;

   console.log( "You must either, 'displayName' and or 'name' per accessory." );
   process.exit( 222 );
}

module.exports = { getAccessoryName,
                   getAccessoryDisplayName
                 };
