'use strict';

const constants = require( "../cmd4Constants" );
const lcFirst = require( "./lcFirst" );


// Description:
//    Determine if parameter is a Cmd4 directive based on it being
//    in the cmd4Constants.
//
// @param m - directive to check.
// @returns: boolean

function isCmd4Directive( directive, allowUpperCase = false )
{
   if ( ! directive )
   {
      console.warn( "No parameter passed to isCmd4Directive" );
      return directive;
   }

   if ( Object.values( constants ).indexOf( directive ) >= 0 )
   {
      //console.log("isCmd4Directive directive: %s returning: %s", directive, directive );
      return directive;
   }

   // Any exemptions before allowUpper
   if ( directive == "UUID" )
      return    "uuid";

   if ( allowUpperCase == true )
   {

      let lcDirective = lcFirst( directive );
      if ( Object.values( constants ).indexOf( lcDirective ) >= 0 )
      {
         //console.log("isCmd4Directive directive: %s returning: %s", directive, lcDirective );
         return lcDirective;
      }
   }

   //console.log("isCmd4Directive directive: %s returning null", directive );

   return null;
}


module.exports = isCmd4Directive;
