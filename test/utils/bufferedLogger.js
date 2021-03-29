"use strict";
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
//
// Log levels to indicate importance of the logged message.
// Every level corresponds to a certain color.
//
// - INFO: no color
// - WARN: yellow
// - ERROR: red
// - DEBUG: gray
//
// Messages with DEBUG level are only displayed if explicitly enabled.
//
var LogLevel;
(function (LogLevel)
{
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["DEBUG"] = "debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//
// Logger class
//
class Logger
{
   constructor( )
   {
      this.logLineCount=0;
      this.logBuf = "";
      this.errLineCount=0;
      this.errBuf = "";
      this.outputEnabled = true;
   }
   //
   // Turns on debug level logging. Off by default.
   //
   // @param enabled {boolean}
   //
   setDebugEnabled( enabled = true )
   {
      this.debugEnabled = enabled;
   }
   setOutputEnabled( enabled = true )
   {
      this.outputEnabled = enabled;
   }
   //
   // Turns on inclusion of timestamps in log messages. On by default.
   //
   // @param enabled {boolean}
   //
   setTimestampEnabled( enabled = true )
   {
      this.timestampEnabled = enabled;
   }
   //
   // Forces color in logging output, even if it seems like color is unsupported.
   //
   forceColor()
   {
      chalk_1.default.level = 1; // `1` - Basic 16 colors support.
   }
   info(message, ...parameters)
   {
      this.log("info" /* INFO */, message, ...parameters);
   }
   warn(message, ...parameters)
   {
      this.log("warn" /* WARN */, message, ...parameters);
   }
   error(message, ...parameters)
   {
      this.log("error" /* ERROR */, message, ...parameters);
   }
   debug(message, ...parameters)
   {
      this.log("debug" /* DEBUG */, message, ...parameters);
   }
   log(level, message, ...parameters)
   {
      if (level === "debug" /* DEBUG */ && !this.debugEnabled)
      {
         return;
      }
      message = util_1.default.format(message, ...parameters);
      switch (level)
      {
         case "warn":
             message = chalk_1.default.yellow(message);
             break;
         case "error":
             message = chalk_1.default.red(message);
             break;
         case "debug":
             message = chalk_1.default.gray(message);
             break;
      }
      if ( this.prefix )
      {
         message = getLogPrefix(this.prefix) + " " + message;
      }
      if (this.timestampEnabled)
      {
         const date = new Date();
         message = chalk_1.default.white(`[${date.toLocaleString()}] `) + message;
      }
      switch (level)
      {
         // Homebridge puts warninggs to errorbuf, so do the same.
         case "error":
         case "warn":
           this.errLineCount++;
           this.errBuf += message;
           this.errBuf += "\n";
           if ( this.outputEnabled == true )
              console.log( message );
           break;
         case "debug":
         case "info":
         default:
           this.logLineCount++;
           this.logBuf += message;
           this.logBuf += "\n";
           if ( this.outputEnabled == true )
              console.log( message );
      }

   }
   setDebugEnabled( enabled = true)
   {
      this.debugEnabled = enabled;
   }
   capturedLog( )
   {
      return this.logBuf;
   }
   capturedErr( )
   {
      return this.errBuf;
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
