'use strict';

// ***************** TEST LOADING **********************

// This would be the plugin un-initialized
var pluginModule = require( "../index" ) ;

var { transposeConstantToValidValue,
      transposeValueToValidConstant,
      extractKeyValue } = require( "../utils/transposeCMD4Props" );


// ***************** TEST Plugin Initialized Variables ***************

describe( "Initializing our plugin module", ( ) => {});

var HomebridgeAPI = require( "../node_modules/homebridge/lib/api" ).HomebridgeAPI;
var _api = new HomebridgeAPI( ); // object we feed to Plugins

var cmd4 = pluginModule.default( _api );
let CMD4_ACC_TYPE_ENUM = cmd4.CMD4_ACC_TYPE_ENUM;
let CMD4_DEVICE_TYPE_ENUM = cmd4.CMD4_DEVICE_TYPE_ENUM;

// ************ QUICK TEST PLUGIN WAS Loaded Successfully **************
describe( "Testing load of index.js", ( ) =>
{
   it( "Testing require of index.js", ( ) =>
   {
      expect( pluginModule ).not.to.be.a( "null", "loaded plugin was null" );
   });

   it( "index.js default initializer should be found", ( ) =>
   {
      expect( pluginModule.default ).to.be.a( "function", "plugin has no default init function t: " + typeof pluginModule.default);
   });
});

// ******** QUICK TEST CMD4_ACC_TYPE_ENUM *************
describe( "Quick Test load of CMD4_ACC_TYPE_ENUM", ( ) =>
{
   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });
});

// ******** QUICK TEST CMD4_DEVICE_TYPE_ENUM *************
describe( "Quick Test load of CMD4_DEVICE_TYPE_ENUM", ( ) =>
{
   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

// ******** TEST extractKeyValue.*************
describe( "Testing extractKeyValue", ( ) =>
{
   it( "extractKeyValue should be a function", ( ) =>
   {
      expect( extractKeyValue).to.be.a( "function", "extractKeyValue is not a function. found: " + typeof extractKeyValue );
   });

   it( "extractKeyValue should return correct key", ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
      let expectedKey = "CLOSING";
      let value = 3;
      let result = extractKeyValue( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues, value );
      expect( result ).to.equal( expectedKey, "Test 1 extractKeyValue( " + value + " ) returned:" + result  + " expected:" +  expectedKey );
   });

   it( "extractKeyValue should return undefined for no value", ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
      let expectedKey = undefined;
      let value = undefined;
      let result = extractKeyValue( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues, value );
      expect( result ).to.equal( expectedKey, "Test 2 extractKeyValue( " + value + " ) returned:" + result  + " expected:" +  expectedKey );
   });

   it( "extractKeyValue For last index should reterun last key", ( ) =>
   {
      let accTypeEnumIndex = CMD4_ACC_TYPE_ENUM.CurrentDoorState;
      let keys = Object.keys( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues );
      let keyCount = keys.length;
      let expectedKey =  keys[keyCount -1 ];
      let value = keyCount -1;;
      let result = extractKeyValue( CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].validValues, value );
      expect( result ).to.equal( expectedKey, "Test 3 extractKeyValue( " + value + " ) returned:" + result  + " expected:" +  expectedKey );
   });

});



// ******** TEST transposeValueToValidConstant.*************
describe( "Testing transposeValueToValidConstant", ( ) =>
{
   for ( let index = 0; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
   // for ( let index = CMD4_ACC_TYPE_ENUM.EOL -1 ; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
   {
      if ( Array.isArray( CMD4_ACC_TYPE_ENUM.properties[ index ].validValues ))
      {
         let numberOfValues =
            CMD4_ACC_TYPE_ENUM.properties[ index ].values.length;
         for ( let vindex = 0; vindex < numberOfValues; vindex ++ )
         {
            // testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, index,
            //    CMD4_ACC_TYPE_ENUM.properties[ index ].validValues[ vindex ], true );
            testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, index, vindex, true );
         }
      } else {

         //testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, index,
         //      CMD4_ACC_TYPE_ENUM.properties[ index ].validValues, true );
         testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, index, index, true );
      }
   }

   // Test a failing one
   //testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, 0, {"one": "1", "two": "2"}, false );
   testTransposeValueTo( CMD4_ACC_TYPE_ENUM.properties, 0, 7, false );
});
// ******** TEST transposeConstantToValidVa.*************
describe( "Testing transposeConstantToValidValue", ( ) =>
{
   for ( let index =0 ; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
   // for ( let index = CMD4_ACC_TYPE_ENUM.EOL -1 ; index < CMD4_ACC_TYPE_ENUM.EOL; index ++ )
   {
      if ( Array.isArray( CMD4_ACC_TYPE_ENUM.properties[ index ].validValues ))
      {
         let numberOfValues =
            CMD4_ACC_TYPE_ENUM.properties[ index ].validValues.length;
         for ( let vindex = 0; vindex < numberOfValues; vindex ++ )
         {
            //testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, index,
            //   CMD4_ACC_TYPE_ENUM.properties[ index ].validValues[ vindex ], true );
            testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, index, vindex, true );
         }
      } else {

         //testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, index,
         //      CMD4_ACC_TYPE_ENUM.properties[ index ].validValues, true );
         testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, index, index, true );
      }
   }

   // Test a failing one
   //testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, 0, {"one": "1", "two": "2"}, false );
   testTransposeConstantTo( CMD4_ACC_TYPE_ENUM.properties, 0, 7, false );

});




// ***************** Common way of testing functions above **********************


function testTransposeConstantTo( CMD4_ENUM_properties_obj, accTypeEnumIndex, vindex, shouldPass )
{
   // if ( ! obj )
   if ( ! CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues )
   {
      // Nothing to do
      return;
   }
   //let numberOfKeyValuePairs = Object.keys( obj );
   let numberOfKeyValuePairs = Object.keys( CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues );

   if ( numberOfKeyValuePairs < 0 )
   {
      // Nothing to do
      return;
   }

   //for ( let key in obj )
   for ( let key in CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues )
   {
      let valueThatShouldBeReturned = CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues[ key ];

      let value = transposeConstantToValidValue( CMD4_ENUM_properties_obj, accTypeEnumIndex, key);

      it( "transposeConstantToValidValue for: " + CMD4_ENUM_properties_obj[accTypeEnumIndex].type + " should return expected value: " + value + " for key: " + key, ( ) =>
      {
         if ( shouldPass )
         {
            expect( valueThatShouldBeReturned ).to.equal( value, "transposeConstantTo from " + key + " returned " + value + " instead of " + valueThatShouldBeReturned + " for " + CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type );
         } else
         {
            expect( valueThatShouldBeReturned ).to.not.equal( value, "transposeConstantTo from " + key + " returned " + value + " instead of " + valueThatShouldBeReturned + " for " + CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type );
         }
      });

   }
}

function testTransposeValueTo( CMD4_ENUM_properties_obj, accTypeEnumIndex, vindex, shouldPass )
{
   //let numberOfKeyValuePairs = Object.keys( obj );
   let numberOfKeyValuePairs = Object.keys( CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues );

   if ( numberOfKeyValuePairs < 0 )
   {
      // Nothing to do
      return;
   }

   // for ( let key in obj )
   for ( let key in CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues )
   {
      //let constantToBeChecked = obj[ key ];
      let constantToBeChecked = CMD4_ENUM_properties_obj[accTypeEnumIndex].validValues[ key ];

      let constant = transposeValueToValidConstant( CMD4_ENUM_properties_obj, accTypeEnumIndex, constantToBeChecked );

      //it( "transposeValueToValidConstant should return expected constant", ( ) =>
      it( "transposeValueToValidConstant should return expected constant: " + constantToBeChecked + " for key: " + key, ( ) =>
      {
         if ( shouldPass )
         {
            expect( key ).to.equal( constant, "transposeValueTo from " + constantToBeChecked + " returned " + constant + " instead of " + key + " for " + CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type );
         } else
         {
            expect( key ).to.not.equal( constant, "transposeValueTo from " + constantToBeChecked + " returned " + constant + " instead of " + key + " for " + CMD4_ACC_TYPE_ENUM.properties[ accTypeEnumIndex ].type );
         }
      });
   }
}
