'use strict';


let getAccessoryUUID = require( "../utils/getAccessoryUUID" );

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI(); // object we feed to Plugins


// This works, but logger below is better.
// updateCmd4CacheDesignations uses  Homebridges logger
// var originalLogger = console.log;
// console.log.debug = function( )
// {
//    originalLogger.apply( this, arguments );
// }
// let log = console;


// Need homebridge logging for Cmd4Accessory
var logger_1 = require("../node_modules/homebridge/lib/logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
const log = logger_1.Logger.internal;



var updateCmd4CacheDesignations = require( "../utils/updateCmd4CacheDesignations" );

let NEW = "NEW";
let OLD = "OLD";
let UNCHANGED = "UNCHANGED";


describe( "Testing updateCmd4CacheDesignations", ( ) =>
{
   it( "updateCmd4CacheDesignations should be a function", ( ) =>
   {
      assert.isFunction( updateCmd4CacheDesignations, "updateCmd4CacheDesignations is not a function" );
   });

   it( "updateCmd4CacheDesignations should correctly mod a basic Cmd4Config", ( ) =>
   {
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED
      };

      let newConfig = {
         "name": "John",
         "state_cmd": NEW
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );
      assert.equal( existingConfig.name, "John", "updateCmd4CacheDesignations name was changed returned: " + existingConfig.name );

      assert.equal( existingConfig.state_cmd, NEW, "updateCmd4CacheDesignations name was changed returned: " + existingConfig.state_cmd );
   });
   it( "updateCmd4CacheDesignations should correctly mod a linkedTypes Cmd4Config", ( ) =>
   {
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED,
         "linkedAccessoriesConfig": [
                                      { "name": "TV2L",
                                        "state_cmd": OLD,
                                        "state_cmd_prefix": OLD
                                      },
                                      { "name": "Switch2L",
                                        "On": true
                                      }
                                    ]
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": NEW,
         "state_cmd_prefix": NEW,
         "linkedTypes": [
                          { "name": "TV2L",
                            "state_cmd": OLD,
                            "state_cmd_suffix": NEW
                          },
                          { "name": "Switch2L",
                            "On": true,
                            "polling": NEW
                          }
                        ],
         "accessories": [
                          { "name": "TV2A",
                            "state_cmd_prefix": NEW
                          },
                          { "name": "Switch2A",
                            "On": true,
                            "polling": NEW
                          }
                        ]
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );
      assert.equal( existingConfig.name, "John", "updateCmd4CacheDesignations name was changed returned: " + existingConfig.name );

      assert.equal( existingConfig.state_cmd_prefix, NEW, "updateCmd4CacheDesignations state_cmd_prefix was changed returned: " + existingConfig.state_cmd_prefix );
      assert.equal( existingConfig.linkedAccessoriesConfig[0].state_cmd, OLD, "updateCmd4CacheDesignations linkedAccessoriesConfig[0].state_cmd was changed returned: " + existingConfig.linkedAccessoriesConfig[0].state_cmd );
      assert.equal( existingConfig.linkedAccessoriesConfig[0].state_cmd_prefix, undefined, "updateCmd4CacheDesignations linkedAccessoriesConfig[0].state_cmd_prefix was changed returned: " + existingConfig.linkedAccessoriesConfig[0].state_cmd_prefix );
      assert.equal( existingConfig.linkedAccessoriesConfig[1].polling, NEW, "updateCmd4CacheDesignations linkedAccessoriesConfig[1].polling was changed returned: " + existingConfig.linkedAccessoriesConfig[1].polling );
   });

   it( "updateCmd4CacheDesignations should correctly mod an empty Added Cmd4Config", ( ) =>
   {
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED,
         "linkedAccessoriesConfig": [
                                      { "name": "TV3L",
                                        "state_cmd": OLD,
                                        "state_cmd_prefix": OLD
                                      },
                                      { "name": "Switch3L",
                                        "On": true
                                      }
                                    ]
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": NEW,
         "state_cmd_prefix": NEW,
         "linkedTypes": [
                          { "name": "TV3L",
                            "state_cmd": OLD,
                            "state_cmd_suffix": NEW
                          },
                          { "name": "Switch3L",
                            "On": true,
                            "polling": NEW
                          }
                        ],
         "accessories": [
                          { "name": "TV3A",
                            "state_cmd_prefix": NEW
                          },
                          { "name": "Switch3A",
                            "On": true,
                            "polling": NEW
                          }
                        ]
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );

      assert.equal( existingConfig.accessoriesConfig.length, 2, "updateCmd4CacheDesignations accessoriesConfig.length should now be 2. returned: " + existingConfig.accessoriesConfig.length );
      assert.equal( existingConfig.accessoriesConfig[0].state_cmd_prefix, NEW, "updateCmd4CacheDesignations accessoriesConfig[0].state_cmd should be NEW. returned: " + existingConfig.accessoriesConfig[0].state_cmd_prefix );
      assert.equal( existingConfig.accessoriesConfig[1].polling, NEW, "updateCmd4CacheDesignations accessoriesConfig[1].polling was changed returned: " + existingConfig.accessoriesConfig[1].polling );
   });

   it( "updateCmd4CacheDesignations should correctly mod a added accessories Cmd4Config", ( ) =>
   {
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED,
         "linkedAccessoriesConfig": [
                                      { "name": "TV4L",
                                        "state_cmd": OLD,
                                        "state_cmd_prefix": OLD
                                      },
                                      { "name": "Switch4L",
                                        "On": true
                                      }
                                    ],
         "accessoriesConfig": [
                                { "name": "TV4A",
                                  "state_cmd": OLD,
                                  "state_cmd_prefix": OLD
                                },
                                { "name": "Switch4A",
                                  "On": true
                                }
                              ]
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": NEW,
         "state_cmd_prefix": NEW,
         "linkedTypes": [
                          { "name": "TV4L",
                            "state_cmd": OLD,
                            "state_cmd_suffix": NEW
                          },
                          { "name": "Switch4L",
                            "On": true,
                            "polling": NEW
                          }
                        ],
         "accessories": [
                          { "name": "TV4A",
                            "state_cmd": OLD,
                            "state_cmd_suffix": NEW
                          },
                          { "name": "Switch4A",
                            "On": true,
                            "polling": NEW
                          }
                        ]
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );
      assert.equal( existingConfig.name, "John", "updateCmd4CacheDesignations name was changed returned: " + existingConfig.name );

      assert.equal( existingConfig.state_cmd_prefix, NEW, "updateCmd4CacheDesignations state_cmd_prefix was changed returned: " + existingConfig.state_cmd_prefix );
      assert.equal( existingConfig.accessoriesConfig[0].state_cmd, OLD, "updateCmd4CacheDesignations accessoriesConfig[0].state_cmd was changed returned: " + existingConfig.accessoriesConfig[0].state_cmd );
      assert.equal( existingConfig.accessoriesConfig[0].state_cmd_prefix, undefined, "updateCmd4CacheDesignations accessoriesConfig[0].state_cmd_prefix was changed returned: " + existingConfig.accessoriesConfig[0].state_cmd_prefix );

      assert.equal( existingConfig.accessoriesConfig[1].polling, NEW, "updateCmd4CacheDesignations accessoriesConfig[1].polling was changed returned: " + existingConfig.accessoriesConfig[1].polling );

   });

   it( "updateCmd4CacheDesignations should handle added linked accessories", ( ) =>
   {
      // console.log("***IN TEST 5 ***");
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED,
         "linkedAccessoriesConfig": [
                                      { "name": "TV5L",
                                        "On": true
                                      },
                                      { "name": "Fan5L",
                                        "On": true
                                      },
                                      { "name": "Hub5L",
                                        "On": true
                                      }
                                    ],
         "accessoriesConfig": [
                                { "name": "TV5A",
                                  "On": true
                                },
                                { "name": "Switch5A",
                                  "On": true
                                },
                                { "name": "Hub5A",
                                  "On": true
                                }
                              ]
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": NEW,
         "state_cmd_prefix": NEW,
         "linkedTypes": [
                          { "name": "TV5L",
                            "On": true
                          },
                          { "name": "Switch5L",
                            "On": true
                          },
                          { "name": "Fan5L",
                            "On": true
                          },
                          { "name": "Hub5L",
                            "On": true
                          }
                        ],
         "accessories": [
                          { "name": "TV5A",
                            "On": true
                          },
                          { "name": "Fan5A",
                            "On": true
                          },
                          { "name": "Switch5A",
                            "On": true
                          },
                          { "name": "Hub5A",
                            "On": true
                          }
                        ]
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );
      assert.equal( existingConfig.name, "John", "updateCmd4CacheDesignations name was changed returned: " + existingConfig.name );

      assert.equal( existingConfig.accessoriesConfig.length, newConfig.accessories.length, "updateCmd4CacheDesignations accessoriesConfig.length " + existingConfig.accessoriesConfig.length + " was not the same as newConfig.length:" + newConfig.accessories.length );

      assert.equal( existingConfig.linkedAccessoriesConfig.length, newConfig.linkedTypes.length, "updateCmd4CacheDesignations linkedAccessoriesConfig.length " + existingConfig.accessoriesConfig.length + " was not the same as newConfig.length:" + newConfig.linkedTypes.length );

      // for ( let i = 0; i< existingConfig.linkedAccessoriesConfig.length; i++ )
      //    console.log(" existingConfig.linkedAccessoriesConfig[" + i + "] = %s", existingConfig.linkedAccessoriesConfig[ i ] );
      // for ( let i = 0; i< existingConfig.accessoriesConfig.length; i++ )
      //    console.log(" existingConfig.accessoriesConfig[" + i + "] = %s", existingConfig.accessoriesConfig[ i ] );

   });

   it( "updateCmd4CacheDesignations should handle deleted  linked accessories ", ( ) =>
   {
      // console.log("***IN TEST 6 ***");
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "On": UNCHANGED,
         "linkedAccessoriesConfig": [
                                      { "name": "TV6L",
                                        "On": true
                                      },
                                      { "name": "Fan6L",
                                        "On": true
                                      },
                                      { "name": "Switch6L",
                                        "On": true
                                      },
                                      { "name": "Hub6L",
                                        "On": true
                                      }
                                    ],
         "accessoriesConfig": [
                                { "name": "TV6A",
                                  "On": true
                                },
                                { "name": "Switch6A",
                                  "On": true
                                },
                                { "name": "Fan6A",
                                  "On": true
                                },
                                { "name": "Hub6A",
                                  "On": true
                                }
                              ]
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": NEW,
         "state_cmd_prefix": NEW,
         "linkedTypes": [
                          { "name": "Fan6L",
                            "On": true
                          },
                          { "name": "Switch6L",
                            "On": true
                          },
                          { "name": "Hub6L",
                            "On": true
                          }
                        ],
         "accessories": [
                          { "name": "TV6A",
                            "On": true
                          },
                          { "name": "Fan6A",
                            "On": true
                          },
                          { "name": "Hub6A",
                            "On": true
                          }
                        ]
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );
      //for ( let i = 0; i< existingConfig.linkedAccessoriesConfig.length; i++ )
      //   console.log(" existingConfig.linkedAccessoriesConfig[" + i + "] = %s", existingConfig.linkedAccessoriesConfig[ i ] );
      //for ( let i = 0; i< existingConfig.accessoriesConfig.length; i++ )
      //   console.log(" existingConfig.accessoriesConfig[" + i + "] = %s", existingConfig.accessoriesConfig[ i ] );
      assert.equal( existingConfig.accessoriesConfig.length, newConfig.accessories.length, "updateCmd4CacheDesignations accessoriesConfig.length " + existingConfig.accessoriesConfig.length + " was not the same as newConfig.length:" + newConfig.accessories.length );

      assert.equal( existingConfig.linkedAccessoriesConfig.length, newConfig.linkedTypes.length, "updateCmd4CacheDesignations linkedAccessoriesConfig.length " + existingConfig.accessoriesConfig.length + " was not the same as newConfig.length:" + newConfig.linkedTypes.length );


   });

   it( "updateCmd4CacheDesignations should delete CMD4 designation fetched ", ( ) =>
   {
      // console.log("***IN TEST 7 ***");
      // The names must be the same for UUID to work
      let existingConfig = {
         "name": "John",
         "state_cmd": OLD,
         "fetch": "Always"
      };

      // This would have already been placed in the accessory
      // I wish I had named linkedAccessoriesConfig and linkedTypes the same !!!
      addUUIDs( existingConfig );

      let newConfig = {
         "name": "John",
         "state_cmd": OLD
      };

      updateCmd4CacheDesignations( _api, log, existingConfig, newConfig );

      for ( let key in existingConfig )
      {
         switch ( key )   // name state_cmd or fetch
         {
            case ("fetch"):
            {
               switch ( existingConfig.fetch )
               {
                  case "Always":
                  case "Polled":
                  case "Cached":
                     console.log("e.set has NOT been deleted");
                     assert.fail( "existingAccessory.config fetch was not deleted: " + existingConfig );
                     break;
                  default:
                     console.log("e.set has been deleted");
                     assert( true == true, "existingAccessory.config fetch was properly deleted " );
               }
            }
         }
      }
   });
})

// Existing accessories saved by homebridge would have a UUID for every accessory, any of its linkedTypes or added Accessories.
// The UUID is used to discover it exists in an array. For testing the UUID must be added to the Accessory.
function addUUIDs( config )
{
   config.UUID = getAccessoryUUID( config, _api.hap.uuid );

   if ( config.accessories )
   {
      for( let index = 0; index < config.accessories.length; index++ )
      {
         let accessory = config.accessories[ index ] ;
         accessorindex.UUID =  getAccessoryUUID( accessory, _api.hap.uuid );
      }
   };

   if ( config.accessoriesConfig )
   {
      for( let index = 0; index < config.accessoriesConfig.length; index++ )
      {
         let accessory = config.accessoriesConfig[ index ] ;
         accessory.UUID =  getAccessoryUUID( accessory, _api.hap.uuid );
      }
   };

   if ( config.linkedTypes )
   {
      for( let index = 0; index < config.linkedTypes.length; index++ )
      {
         let accessory = config.linkedTypes[ index ] ;
         accessory.UUID =  getAccessoryUUID( accessory, _api.hap.uuid );
      }
   };

   if ( config.linkedAccessoriesConfig )
   {
      for( let index = 0; index < config.linkedAccessoriesConfig.length; index++ )
      {
          let accessory = config.linkedAccessoriesConfig[ index ] ;
         accessory.UUID =  getAccessoryUUID( accessory, _api.hap.uuid );
      }
   };
}
