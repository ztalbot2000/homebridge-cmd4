'use strict';

var getAccessoryName = function ( config )
{
   if (config.displayName)
      return config.displayName;

   if (config.name)
      return config.name;

   console.log("You must either, 'displayName' and or 'name' per accessory.");
   process.exit(-1);

}

module.exports = getAccessoryName;
