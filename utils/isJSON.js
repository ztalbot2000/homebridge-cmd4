'use strict';

// Description:
//    Determine if parameter is a true JSON object, not an array, but {}
//
// @param m - JSON Object to check.
// @returns: boolean

function isJSON( m )
{
   if ( ! m )
   {
      console.warn( "No parameter passed to isJSON" );
      return false;
   }

   if ( ! m.constructor )
   {
      //console.warn( "No constructor to isJSON for parameter: %s", m );
      return false;
   }

   if ( m.constructor === Array )
   {
      //console.warn( "It is an array" );
      return false;
   }

   if ( typeof m == "object" )
   {
      try{ m = JSON.stringify( m ); }
      catch( err ) { return false; } }

   if ( typeof m == "string")
   {
      try{ m = JSON.parse( m ); }
      catch ( err ) { return false; } }

   if ( typeof m != "object") { return false; }

   return true;
}


module.exports = isJSON;
