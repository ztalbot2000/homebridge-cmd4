"use strict";
var __importDefault = (this && this.__importDefault) || function ( mod ) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const settings = require( "../cmd4Settings" );

const util_1 = __importDefault( require( "util" ) );
const chalk_1 = __importDefault( require( "chalk" ) );
//
// Log levels to indicate importance of the logged message.
// Every level corresponds to a certain color.
//
// - INFO: no color
// - WARN: yellow
// - ERROR: red
// - DEBUG: gray
//

//
// Gets the prefix
// @param prefix
//
function getLogPrefix( prefix )
{
    return chalk_1.default.cyan( `[${prefix}]` );
}

//
// Logger class
//
class Logger
{
   constructor( )
   {
      // Note: log.info goes to logBuf
      this.logLineCount = 0;
      this.logBuf = "";
      // Note: log.warn goes to errBuf
      this.errLineCount = 0;
      this.errBuf = "";

      this.outputEnabled = true;
      this.bufferEnabled = false;
      this.debugEnabled = false;

      // Added as was set outside the class
      this.timestampEnabled = true;
      this.prefix = settings.PLATFORM_NAME;
      this.forceColor( );
   }
   //
   // Turns on debug level logging. Off by default.
   //
   // @param enabled { boolean }
   //
   setDebugEnabled( enabled = true )
   {
      this.debugEnabled = enabled;
      settings.cmd4Dbg = enabled;
   }
   setOutputEnabled( enabled = true )
   {
      this.outputEnabled = enabled;
   }
   //
   // Turns on buffered logging. Off by default.
   //
   // @param enabled { boolean }
   //
   setBufferEnabled( enabled = true )
   {
      this.bufferEnabled = enabled;
   }
   //
   // Turns on inclusion of timestamps in log messages. On by default.
   //
   // @param enabled { boolean }
   //
   setTimestampEnabled( enabled = true )
   {
      this.timestampEnabled = enabled;
   }
   //
   // Forces color in logging output, even if it seems like color is unsupported.
   //
   forceColor( )
   {
      chalk_1.default.level = 1; // `1` - Basic 16 colors support.
   }
   info( message, ...parameters )
   {
      this.log( "info" /* INFO */, message, ...parameters );
   }
   warn( message, ...parameters )
   {
      this.log( "warn" /* WARN */, message, ...parameters );
   }
   error( message, ...parameters )
   {
      this.log( "error" /* ERROR */, message, ...parameters );
   }
   debug( message, ...parameters )
   {
      if ( this.debugEnabled )
         this.log( "debug" /* DEBUG */, message, ...parameters );
   }
   log( level, message, ...parameters )
   {
      if ( level === "debug" /* DEBUG */ && ! this.debugEnabled )
      {
         return;
      }
      message = util_1.default.format( message, ...parameters );
      switch ( level )
      {
         case "warn":
             message = chalk_1.default.yellow( message );
             break;
         case "error":
             message = chalk_1.default.red( message );
             break;
         case "debug":
             message = chalk_1.default.gray( message );
             break;
      }
      if ( this.prefix )
      {
         message = getLogPrefix( this.prefix ) + " " + message;
      }
      if ( this.timestampEnabled )
      {
         const date = new Date();
         message = chalk_1.default.white( `[${date.toLocaleString()}] ` ) + message;
      }
      switch ( level )
      {
         // Homebridge puts warninggs to errorbuf, so do the same.
         case "error":
         case "warn":
           if ( this.bufferEnabled == true )
           {
              this.errLineCount++;
              this.errBuf += message;
              this.errBuf += "\n";
           }
           if ( this.outputEnabled == true )
              console.log( message );
           break;
         case "debug":
         case "info":
         default:
           if ( this.bufferEnabled == true )
           {
              this.logLineCount++;
              this.logBuf += message;
              this.logBuf += "\n";
           }
           if ( this.outputEnabled == true )
              console.log( message );
      }

   }
   reset()
   {
      this.logLineCount = 0;
      this.logBuf = "";
      this.errLineCount = 0;
      this.errBuf = "";
   }
}
module.exports=Logger;
