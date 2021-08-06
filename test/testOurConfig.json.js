'use strict';

var fs = require('fs'),
Parser = require('jsonparse');


var json = fs.readFileSync("Extras/config.json");



describe( "Testing our config.json", ( ) =>
{
   it( "isJSON should be a function", ( ) =>
   {
      assert.isFunction( Parser, "Parser is not a function" );
   });

   it( "If our config.json is valid", ( ) =>
   {
      JSON.parse(json);
      var p = new Parser();

      p.onError = function (value) {
          assert("Our config.json is invalid value:", value);
      };

      p.write( json );

   });
})
