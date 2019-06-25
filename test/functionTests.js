'use strict';

var assert = require('chai').assert;

// ***************** TEST LOADING **********************

// This would be the uninitialized value
var pluginModule = require('../index');

describe('Testing load of index.js', function ()
{
   it('index.js loaded should not be null', function ()
   {
      assert.isNotNull(pluginModule, 'loading resulted in null');
   });

   var t = typeof pluginModule.default;
   it('index.js default initializer should be found', function ()
   {
      assert.equal(t, "function");
   });
});

// ***************** TEST Plugin Initialized Variables ***************

describe('Initializing our plugin module', function ()
{});

var API = require('../node_modules/homebridge/lib/api').API;
var _api = new API(); // object we feed to Plugins

//console.log("Initializing our plugin module");
var cmd4 = pluginModule.default(_api);

// ******** TEST CMD4_ACC_TYPE_ENUM.properties *************
describe('Testing transposeValueToConstantForCharacteristic', function ()
{
   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {  
      if (Array.isArray(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values))
      {
         let numberOfValues =
            cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values.length;
         for (let vindex=0; vindex < numberOfValues; vindex ++)
         {
            testTransposeValueTo(index,
               cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values[vindex], true);
         }
      } else {
   
         testTransposeValueTo(index,
               cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values, true);
      }
   }

   // Test a failing one
   testTransposeValueTo(0, {"one": '1', "two": '2'}, false );
});
describe('Testing transposeConstantToValueForCharacteristic', function ()
{
   for (let index=0; index < cmd4.CMD4_ACC_TYPE_ENUM.EOL; index ++)
   {
      if (Array.isArray(cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values))
      {
         let numberOfValues =
            cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values.length;
         for (let vindex=0; vindex < numberOfValues; vindex ++)
         {
            testTransposeConstantTo(index,
               cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values[vindex], true);
         }
      } else {

         testTransposeConstantTo(index,
               cmd4.CMD4_ACC_TYPE_ENUM.properties[index].values, true);
      }
   }

   // Test a failing one
   testTransposeConstantTo(0, {"one": '1', "two": '2'}, false );

});




function testTransposeConstantTo(accTypeEnumIndex, obj, shouldPass )
{
   let numberOfKeyValuePairs = Object.keys(obj);

   if (numberOfKeyValuePairs < 0)
   {
      // Nothing to do
      return;
   }

   for (let key in obj)
   { 
      let valueThatShouldBeReturned = obj[key];

      let value = transposeConstantToValueForCharacteristic( accTypeEnumIndex, key);

      it('transposeConstantToValueForCharacteristic should return expected value', function ()
      {
         if (shouldPass)
            assert.equal(valueThatShouldBeReturned, value, "transposeConstantTo from " + key + " returned " + value + " instead of " + valueThatShouldBeReturned + " for " + cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name);
         else
            assert.notEqual(valueThatShouldBeReturned, value, "transposeConstantTo from " + key + " returned " + value + " instead of " + valueThatShouldBeReturned + " for " + cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name);
      });
       
   }
};
function testTransposeValueTo(accTypeEnumIndex, obj, shouldPass )
{
   let numberOfKeyValuePairs = Object.keys(obj);

   if (numberOfKeyValuePairs < 0)
   {
      // Nothing to do
      return;
   }

   for (let key in obj)
   { 
      let constantToBeChecked = obj[key];

      let constant = transposeValueToConstantForCharacteristic( accTypeEnumIndex, constantToBeChecked);

      it('transposeValueToConstantForCharacteristic should return expected constant', function ()
      {
         if (shouldPass)
            assert.equal(key, constant, "transposeValueTo from " + constantToBeChecked + " returned " + constant + " instead of " + key + " for " + cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name);
         else
            assert.notEqual(key, constant, "transposeValueTo from " + constantToBeChecked + " returned " + constant + " instead of " + key + " for " + cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].name);
      });
          
   }
}

// Copied functions to test below here
function transposeConstantToValueForCharacteristic( accTypeEnumIndex, constantString )
{
   if (cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values.length < 0)
   {
      //console.log("No constants to transpose for '%s'", constantString);
      return;
   }
      
   if ( cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values.hasOwnProperty( constantString ) )
   {         
      let value = cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values[constantString];
      //console.log("Found value '%s' for '%s'", value, constantString);
      return value;
   }
   //console.log("No value found for constant '%s'", constantString);
   return constantString;
}

function transposeValueToConstantForCharacteristic( accTypeEnumIndex, valueString)
{
   //console.log("check index '%s'", accTypeEnumIndex);
   if (cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values.length < 0)
   {
      //console.log("No constants to transpose for '%s'", valueString);
      return;
   }

   let constant = extractKeyValue(cmd4.CMD4_ACC_TYPE_ENUM.properties[accTypeEnumIndex].values, valueString);
   
   if (constant == undefined)
   {
      //console.log("No constant found for value '%s'", valueString);
      return valueString;
   }
   return constant;
}

function extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}
