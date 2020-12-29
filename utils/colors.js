'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Pretty Colors
define("Rm",  "\x1b[m");
define("Und", "\x1b[4m");
define("Blk", "\x1b[30m");
define("Red", "\x1b[31m");
define("Grn", "\x1b[32m");
define("Ylw", "\x1b[33m");
define("Blu", "\x1b[34m");
define("Mag", "\x1b[35m");
define("Cyn", "\x1b[36m");
define("Wht", "\x1b[37m");

// Note: Import as such
// var Fg = require("./colors");
//
// Use as such:
//    whatever.log( "This is( " + Fg.Red + "red" + Fg.Rm + ") " + Fg.Blu + "This line is %s" + Fg.Rm, "blue" );
//
// Proper syntax is that Fg.xx is a preprocessor append using '+' as compared to string variables added
// to the string with %s.


