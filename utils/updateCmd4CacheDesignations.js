'use strict';

let getAccessoryUUID = require( "../utils/getAccessoryUUID" );

const { getAccessoryName } = require( "../utils/getAccessoryNameFunctions" );


// Copy the Cmd4 Designations we do not want cached, to
// the cached accessory in homeBridge.
function updateCmd4CacheDesignations( api, log, existingAccessory, accessory, existingAccessorysArray, existingAccessorysArrayIndex )
{
   // log.debug(`Starting updateCmd4CacheDesignations for ${ existingAccessory.name }` );
   // log.debug(`Before set existingAccessory = %s`, existingAccessory);
   // log.debug(`Before set accessory = %s`, accessory);

   // These are the Cmd4 Designations we want to use from the
   // accessories config file
   // The === condition and delete is the case where the newer
   // designation is undefined, poluting the target.
   if ( accessory.polling === undefined )
   {
      existingAccessory.polling = undefined;
      delete( existingAccessory.polling );
   } else
      existingAccessory.polling = accessory.polling;

   if ( accessory.state_cmd === undefined )
   {
      existingAccessory.state_cmd = undefined;
      delete( existingAccessory.state_cmd );
   } else
      existingAccessory.state_cmd = accessory.state_cmd;

   if ( accessory.state_cmd_prefix === undefined )
   {
      existingAccessory.state_cmd_prefix = undefined;
      delete( existingAccessory.state_cmd_prefix );
   } else
      existingAccessory.state_cmd_prefix = accessory.state_cmd_prefix;

   if ( accessory.state_cmd_suffix === undefined )
   {
      existingAccessory.state_cmd_suffix = undefined;
      delete( existingAccessory.state_cmd_suffix );
   } else
      existingAccessory.state_cmd_suffix = accessory.state_cmd_suffix;

   if ( accessory.outputConstants === undefined )
   {
      existingAccessory.outputConstants = undefined;
      delete( existingAccessory.outputConstants );
   } else
      existingAccessory.outputConstants = accessory.outputConstants;

   if ( accessory.stateChangeResponseTime === undefined )
   {
      existingAccessory.stateChangeResponseTime = undefined;
      delete( existingAccessory.stateChangeResponseTime );
   } else
      existingAccessory.stateChangeResponseTime = accessory.stateChangeResponseTime;

   if ( accessory.fakegato === undefined )
   {
      existingAccessory.fakegato = undefined;
      delete( existingAccessory.fakegato );
   } else
      existingAccessory.fakegato = accessory.fakegato;

   if ( accessory.UUID === undefined )
   {
      existingAccessory.UUID = undefined;
      delete( existingAccessory.UUID );
   } else
      existingAccessory.UUID = accessory.UUID;

   if ( accessory.fetch === undefined )
   {
      existingAccessory.fetch = undefined;
      delete( existingAccessory.fetch );
   } else
      existingAccessory.fetch = accessory.fetch;

   if ( accessory.allowTLV8 === undefined )
   {
      existingAccessory.allowTLV8 = undefined;
      delete( existingAccessory.allowTLV8 );
   } else
      existingAccessory.allowTLV8 = accessory.allowTLV8;

   if ( accessory.category === undefined )
   {
      existingAccessory.category = undefined;
      delete( existingAccessory.category );
   } else
      existingAccessory.category = accessory.category;

   // Some sort of type must be defined
   if ( existingAccessory.type != accessory.type )
      existingAccessory.type = accessory.type;

   // log.debug(`after set existingAccessory = %s`, existingAccessory);

   // This routine is kind of recursive, in that it handles
   // the linked types and added accessories; If that is the
   // case, place the modded existing accessory back into its
   // array and return;
   if ( existingAccessorysArray != undefined && existingAccessorysArrayIndex != undefined  )
   {
      // log.debug( "replacing existingAccessorysArray[" + existingAccessorysArrayIndex + "]" );
      existingAccessorysArray[ existingAccessorysArrayIndex ] = existingAccessory;
      return;
   }

   // log.debug( "\n\n*** LinkedTypes ***" );
   // if the new Accessory config has linked tyoes
   if ( Array.isArray( accessory.linkedTypes ) )
   {
      // log.debug( "   new config has linkedTypes" );
      // It is possable that there are now Linked accessories where there
      // was none before. Handle where they do exist.
      if ( existingAccessory.linkedAccessoriesConfig )
      {
         // log.debug( "   existing config has " +  accessory.linkedTypes.length + " linkedAccessoriesConfig entrys" );
         // For each of the configurations of the linked types,
         // we need to find them (if they exist ) and keep their
         // Cmd4 designations as well.
         for ( let index=0; index < accessory.linkedTypes.length; index++ )
         {
            // First get the linked types config and make sure it has a name.
            // existing Accessory has => linkedAccessoriesConfig
            // new Accessory has => linkedTypes
            let linkedAccessorysConfig = accessory.linkedTypes[ index ];
            linkedAccessorysConfig.name = getAccessoryName( linkedAccessorysConfig );
            // log.debug( "   existing config name index: " + index + " is: " + linkedAccessorysConfig.name);

            // Use the UUID to find the accessory in the array of linkedTypes
            // in the same manner we find the existing accessory.
            linkedAccessorysConfig.UUID = linkedAccessorysConfig.UUID || getAccessoryUUID( linkedAccessorysConfig, api.hap.uuid );
            // log.debug( "   UUID searching for is: " + linkedAccessorysConfig.UUID );

            // See if the linked accessory config exists in
            // the existing accessories linked types array.
            // This time get its index into the array, so
            // we can put it back, modded.
            const existingLinkedAccessorysArrayIndex = existingAccessory.linkedAccessoriesConfig.findIndex(accessory => accessory.UUID === linkedAccessorysConfig.UUID );
            // log.debug( "   existingLinkedAccessorysArrayIndex: " + existingLinkedAccessorysArrayIndex );

            // If it does, we will mod it for Cmd4 designations
            if ( existingLinkedAccessorysArrayIndex != -1 )
            {
               let existingLinkedAccessory = existingAccessory.linkedAccessoriesConfig[ existingLinkedAccessorysArrayIndex ];

               // log.debug( "   match index: "+ existingLinkedAccessorysArrayIndex + " name: " + existingLinkedAccessory.name);
               // log.debug( "   existinglinkedAccessory.UUID: " + existingLinkedAccessory.UUID );
               // Call this same mod function, this time passing
               // the array of where it came from and it's index,
               // so that omce modded, it will be replaced in the
               // array at the same index it came from.
               updateCmd4CacheDesignations(
                  api, log,
                  existingLinkedAccessory, linkedAccessorysConfig,
                  existingAccessory.linkedAccessoriesConfig,
                  existingLinkedAccessorysArrayIndex );
            } else {
               // There is a new linked accessory that is not
               // in the existing array of linked accessories.
               // log.debug(`   New linkededAccessory ${ linkedAccessorysConfig.name }\n`);
               existingAccessory.linkedAccessoriesConfig.push( linkedAccessorysConfig ) ;
            }
         }
      } else {
         // It is possable that there are now Linked accessories
         // where there was none before. When there are none,
         // then they are all the new ones.
         existingAccessory.linkedAccessoriesConfig  = accessory.linkedTypes;
      }
   }

   // log.debug( "\n\n*** addedAccessories ***" );
   // if the new Accessory config has added accessories
   if ( Array.isArray( accessory.accessories ) )
   {
      // It is possable that there are now Added accessories where there
      // was none before. Handle where they do exist.
      // log.debug( "   new config has addedAccessories" );
      if ( existingAccessory.accessoriesConfig )
      {
         // For each of the configurations of the added accessories,
         // We need to find them (if they exist ) and keep their
         // Cmd4 designations as well.
         // log.debug( "   existing config has " + accessory.accessories.length + " addedAccessoriesConfig entrys" );
         for ( let index=0; index < accessory.accessories.length; index++ )
         {
            // First get the added accessorys config and make sure
            // it has a name.
            // Existing Accessory has => accessoriesConfig
            // new Accessory has => accessories
            let addedAccessorysConfig = accessory.accessories[ index ];
            addedAccessorysConfig.name = getAccessoryName( addedAccessorysConfig );

            // log.debug( "   added config name index: " + index + " is: " + addedAccessorysConfig.name);
            // log.debug( "   existing config[.accessoriesConfig[0].name : " + existingAccessory.accessoriesConfig[0].name);
            // log.debug( "   existing config[.accessoriesConfig[1].name : " + existingAccessory.accessoriesConfig[1].name);
            // Use the UUID to find the accessory in the array of
            // accessoriesConfig in the same manner we find the
            // existing accessory.
            addedAccessorysConfig.UUID = addedAccessorysConfig.UUID || getAccessoryUUID( addedAccessorysConfig, api.hap.uuid );

            // See if the added accessory config exists in the
            // existing accessories added accessories array.
            // This time get its index into the array, so we
            // can put it back, modded.
            const existingAddedAccessorysArrayIndex = existingAccessory.accessoriesConfig.findIndex(accessory => accessory.UUID === addedAccessorysConfig.UUID );

            // If it does, we will mod it for Cmd4 designations
            if ( existingAddedAccessorysArrayIndex != -1 )
            {
               let existingAddedAccessory = existingAccessory.accessoriesConfig[ existingAddedAccessorysArrayIndex ];
               // log.debug( "   existingAddedAccessory.UUID: " + existingAddedAccessory.UUID);
               // log.debug( "   match index: "+ existingAddedAccessorysArrayIndex + " name: " + existingAddedAccessory.name);

               // Call this same mod function, this time passing
               // the array of where it came from and it's
               // index, so that omce modded, it will be replaced
               // in the array at the same index it came from.
               updateCmd4CacheDesignations(
                  api, log,
                  existingAddedAccessory, addedAccessorysConfig,
                  existingAccessory.accessoriesConfig,
                  existingAddedAccessorysArrayIndex );

            } else {
               // There is a new added accessory that is not
               // in the existing array of added accessories
               // log.debug(`   New addedAccessory ${ addedAccessorysConfig.name }\n`);
               existingAccessory.accessoriesConfig.push( addedAccessorysConfig ) ;
            }
         }
      } else {
         // It is possable that there are now Added accessories
         // where there was none before. When there are none, then
         // they are all the new ones.
         existingAccessory.accessoriesConfig  = accessory.accessories;
      }
   }

   //
   // The existingAccessory has all been updated, accept in the
   // case where the existing linkedTypes or Added Accessories
   // have an entry to be removed.
   //
   // log.debug( "\n\n*** linkedAccessories Deletions ***" );

   // So now go the other way and look for the linkedAccessories
   // that must be removed.
   if ( Array.isArray( existingAccessory.linkedAccessoriesConfig ) )
   {
      // It is possable that there are now no linked accessories where there
      // was some before. Handle where they do exist.
      // log.debug( "   new config has linkedAccessories" );
      if ( Array.isArray( accessory.linkedTypes ) )
      {
         // Iterate over each of the existing configurations of
         // the linked accessories, backwards so it is easy to
         // remove them.
         let index = existingAccessory.linkedAccessoriesConfig.length;
         while ( index-- )
         {
            // First get the linked types config and make sure it has a name.
            // existing Accessory has => linkedAccessoriesConfig
            // new Accessory has => linkedTypes
            let existingLinkedAccessorysConfig = existingAccessory.linkedAccessoriesConfig[ index ];
            existingLinkedAccessorysConfig.name = getAccessoryName( existingLinkedAccessorysConfig );
            // log.debug( "   existing config name index: " + index + " is: " + existingLinkedAccessorysConfig.name);

            // Thankfully, because of the above, the new configuration
            // would have a UUID so we can use the find method as
            // we did before.
            // log.debug( "   UUID searching for is" + existingLinkedAccessorysConfig.UUID );

            // See if the linked accessory config exists in the
            // accessories linked types array.
            const existingLinkedAccessorysArrayIndex = accessory.linkedTypes.findIndex(accessory => accessory.UUID === existingLinkedAccessorysConfig.UUID );
            // log.debug( "   existingLinkedAccessorysArrayIndex: " + existingLinkedAccessorysArrayIndex );

            // If the linkedAccessory does not exist in the new
            // config, then we need to remove it.
            if ( existingLinkedAccessorysArrayIndex == -1 )
            {
               // log.debug( "   Removing existing config name index: " + index + " is: " + existingLinkedAccessorysConfig.name);

               // Remove the linked Accessory as it was not found
               // from the existing linkedAccessoriesConfig array.
               existingAccessory.linkedAccessoriesConfig.splice( index, 1 );
            } else {
               // The existing Linked accessory already exitst in the new config, so nothing
               // needs to be done as it would have been modded up above.
               // log.debug(`   Same linkededAccessory ${ existingLinkedAccessorysConfig.name }\n`);
            }
         }
      } else {
         // There are no linked accessories at all in the new
         // config, they all need to be removed.
         existingAccessory.linkedAccessoriesConfig  = undefined;
      }
   }

   // log.debug( "\n\n*** AddedAccessories Deletions ***" );
   // Look for the Added Accessories that must be removed.
   if ( Array.isArray( existingAccessory.accessoriesConfig ) )
   {
      // It is possable that there are now no added accessories
      // where there was some before. Handle where they do exist.
      // log.debug( "   new config has added Accessories" );
      if ( Array.isArray( accessory.accessories ) )
      {
         // Iterate over each of the existing configurations
         // of the added accessories, backwards so it is easy
         // to remove them.
         let index = existingAccessory.accessoriesConfig.length;
         while ( index-- )
         {
            // First get the existing Added Accessories config
            // and make sure it has a name.
            // Existing Accessory has => accessoriesConfig
            // New Accessory has => accessories
            let existingAccessorysConfig = existingAccessory.accessoriesConfig[ index ];
            existingAccessorysConfig.name = getAccessoryName( existingAccessorysConfig );
            // log.debug( "   existing config name index: " + index + " is: " + existingAccessorysConfig.name);

            // Thankfully, because of the above, the new configuration
            // would have a UUID so we can use find method as we
            // did before.
            // log.debug( "   UUID searching for is" + existingAccessorysConfig.UUID );

            // See if the Added Accessory config exists in the
            // new accessories Config array.
            const existingAccessorysArrayIndex = accessory.accessories.findIndex(accessory => accessory.UUID === existingAccessorysConfig.UUID );
            // log.debug( "   existingAccessorysArrayIndex: " + existingAccessorysArrayIndex );

            // If the addedAccessory does not exist in the new
            // config, then we need to remove it.
            if ( existingAccessorysArrayIndex == -1 )
            {
               // log.debug( "   Removing existing config name index: " + index + " is: " + existingAccessorysConfig.name);
               // Remove the added Accessory as it was not found
               // from the existing accessories array.
               existingAccessory.accessoriesConfig.splice( index, 1 );

            } else {
               // The existing Added accessory already exists in
               // the new config, so nothing needs to be done as
               // it would have been modded up above.
               // log.debug(`   Same addededAccessory ${ existingAccessorysConfig.name }\n`);
            }
         }
      } else {
         // There are no added accessories at all in the new
         // config, they all need to be removed.
         existingAccessory.accessoriesConfig  = undefined;
      }
   }
}

module.exports = updateCmd4CacheDesignations;
