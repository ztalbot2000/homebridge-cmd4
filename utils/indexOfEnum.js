'use strict';


// Description:
//    Create an Object prototype to for getting an index of an enumerated type.
//

module.exports=Object.defineProperty(Object.prototype, "indexOfEnum", {
   value: function( predicate, fromIndex ) {
      let length = this == null ? 0 : Object.keys( this ).length;
      if ( !length )
         return -1;

      let index = fromIndex == null ? 0 : fromIndex;
      if ( index < 0 )
      {
         index = Math.max( length + index, 0 );
      }

      for ( let i=index; i < length; i++)
      {
         if ( predicate( this[ i ], i, this ) )
         {
            return i;
         }
      }
      return -1;
    }
});
