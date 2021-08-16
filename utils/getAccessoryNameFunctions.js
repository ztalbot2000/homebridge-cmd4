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

   throw new Error( "You must have a 'Name' per accessory." );
}

var getAccessoryDisplayName = function ( config )
{
   if ( config.displayName ) return config.displayName;
   if ( config.DisplayName ) return config.DisplayName;

   if ( config.name ) return config.name;
   if ( config.Name ) return config.Name;

   throw new Error( "You must either, 'displayName' and or 'name' per accessory." );
}

module.exports = { getAccessoryName,
                   getAccessoryDisplayName
                 };
