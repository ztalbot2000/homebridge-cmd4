'use strict';

/**
 * @param Object
 *    Check for a true JSON object, not an array, but {}
 * @returns boolean
 */
function isJSON(m)
{

   if ( ! m )
   {
      console.warn( "No parameter passed to isJSON" );
      return false;
   }

   if ( ! m.constructor )
   {
      //console.warn( "No constructor to isJSON for parameter:" + m );
      return false;
   }

   if (m.constructor === Array)
   {
      //console.warn("It is an array");
      return false;
   }

   if (typeof m == 'object')
   {
      try{ m = JSON.stringify(m); }
      catch(err) { return false; } }

   if (typeof m == 'string')
   {
      try{ m = JSON.parse(m); }
      catch (err) { return false; } }

   if (typeof m != 'object') { return false; }
   return true;

}


module.exports = isJSON;
