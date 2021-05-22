'use strict';

/* Orig
var variableTimer = {
    running: false,
    iv: 5000,
    timeout: false,
    cb : function(){},
    start : function(cb,iv){
        var elm = this;
        clearInterval(this.timeout);
        this.running = true;
        if(cb) this.cb = cb;
        if(iv) this.iv = iv;
        this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
    },
    execute : function(e){
        if(!e.running) return false;
        e.cb();
        e.start();
    },
    stop : function(){
        this.running = false;
    },
    set_interval : function(iv){
        clearInterval(this.timeout);
        this.start(false, iv);
    }
};
*/

// Taken from https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running
//
// timer.start(function(){
//     console.debug('go');
// }, 2000);
//
// timer.set_interval(500);
//
// timer.stop();
//

class VariableTimer
{
   constructor ()
   {
      this.running = false;
      this.iv = 0;
      this.timeout = false;
      this.cb = function( ){ };
   }
   start( cb , iv )
   {
      var elm = this;
      clearInterval( this.timeout );
      this.running = true;
      if ( cb ) this.cb = cb;
      if ( iv ) this.iv = iv;
      this.timeout = setTimeout( function( ){ elm.execute( elm ) }, this.iv );
   }

   execute( e )
   {
      if ( ! e.running ) return false;
      e.cb( );
      e.start( );
   }

   stop( )
   {
       this.running = false;
   }

   set_interval( iv )
   {
      // You can't change an interval when timer is not running
      if ( this.running == false )
      {
         this.iv = iv;
         return;
      }

      // Do not change interval if less than .5 seconds difference
      let round = Math.trunc( iv / 500) * 500;
      if (round !=  this.iv )
      {
         clearInterval( this.timeout );
         this.start( false, round );
      }
   }
}

//module.exports.VariableTimer = VariableTimer;
module.exports = VariableTimer;
