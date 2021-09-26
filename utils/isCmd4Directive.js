'use strict';

const constants = require( "../cmd4Constants" );
const lcFirst = require( "./lcFirst" );


// Description:
//    Determine if parameter is a Cmd4 directive based on it being
//    in the cmd4Constants.
//
// @param m - directive to check.
// @returns: boolean

function isCmd4Directive( directive, allowUpper = false )
{
   if ( ! directive )
   {
      console.warn( "No parameter passed to isCmd4Directive" );
      return null;
   }

   if ( Object.values( constants ).indexOf( directive ) >= 0 )
   {
      //console.log("isCmd4Directive directive: %s returning: %s", directive, directive );
      return { key:      directive,
               wasLower: true };
   }

   if ( directive == "UUID" )
      return { key:      "uuid",
               wasLower:  false };

   // Note: There are othes like WiFi ... but nobody uses them thankfully !
   if ( allowUpper == true )
   {

      let lcDirective = lcFirst( directive );
      if ( Object.values( constants ).indexOf( lcDirective ) >= 0 )
      {
         //console.log("isCmd4Directive directive: %s returning: %s", directive, lcDirective );
         return { key:      lcDirective,
                  wasLower: false };
      }
   }

   //console.log("isCmd4Directive directive: %s returning null", directive );

   return null;
}


module.exports = isCmd4Directive;
