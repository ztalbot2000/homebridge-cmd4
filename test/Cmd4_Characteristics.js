'use strict';


var _api = new HomebridgeAPI.HomebridgeAPI; // object we feed to Plugins

CMD4_ACC_TYPE_ENUM.init( _api.hap );

const hapNodeJs = _api.hap;
//let clonedCharacteristic = hapNodeJs.Characteristic;

let Cmd4_Characteristics = require( "../lib/Cmd4_Characteristics" ).clonedCharacteristic;

describe( `Testing require of Cmd4_Characteristics.js`, ( ) =>
{
   it( `Cmd4_Characteristics should be defined ( required correctly )`, ( ) =>
   {
      assert.isNotNull( Cmd4_Characteristics, `Cmd4_Characteristics is null` );
   });

})

describe( `Testing Cmd4_Characteristics`, ( ) =>
{
   describe(`Testing CMD4_ACC_TYPE_ENUM.Units`, ( ) =>
   {
      it('Cmd4_Characteristics.Units should be an object', ( ) =>
      {
         assert.isObject( Cmd4_Characteristics.Units, `Cmd4_Characteristics.Units is not an object` );
         assert.equal( Object.keys( Cmd4_Characteristics.Units ).length , Object.keys( hapNodeJs.Units ).length, `Length of Units do not match` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Units values`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Units.CELCIUS, hapNodeJs.Units.CELCIUS, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Units.PERCENTAGE, hapNodeJs.Units.PERCENTAGE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Units.ARC_DEGREE, hapNodeJs.Units.ARC_DEGREE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Units.LUX, hapNodeJs.Units.LUX, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Units.SECONDS, hapNodeJs.Units.SECONDS, `Incorrect value` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Units strings`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Units[ "CELCIUS" ], hapNodeJs.Units[ "CELCIUS" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Units[ "PERCENTAGE" ], hapNodeJs.Units[ "PERCENTAGE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Units[ "ARC_DEGREE" ], hapNodeJs.Units[ "ARC_DEGREE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Units[ "LUX" ], hapNodeJs.Units[ "LUX" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Units[ "SECONDS" ], hapNodeJs.Units[ "SECONDS" ], `Incorrect string` );
      });
   });


   describe('Testing Cmd4_Characteristics.Perms', ( ) =>
   {
      it('Cmd4_Characteristics.Perms should be an object', ( ) =>
      {
         assert.isObject( Cmd4_Characteristics.Perms, `Cmd4_Characteristics.Perms is not an object` );
         assert.equal( Object.keys( Cmd4_Characteristics.Perms ).length , Object.keys( hapNodeJs.Perms ).length, `Length of Units do not match` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Perms values`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Perms.READ, hapNodeJs.Perms.READ, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.WRITE, hapNodeJs.Perms.WRITE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.PAIRED_READ, hapNodeJs.Perms.PAIRED_READ, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.PAIRED_WRITE, hapNodeJs.Perms.PAIRED_WRITE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.NOTIFY, hapNodeJs.Perms.NOTIFY, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.EVENT, hapNodeJs.Perms.EVENT, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.ADDITIONAL_AUTHORIZATION, hapNodeJs.Perms.ADDITIONAL_AUTHORIZATION, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.TIMED_WRITE, hapNodeJs.Perms.TIMED_WRITE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.HIDDEN, hapNodeJs.Perms.HIDDEN, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Perms.WRITE_RESPONSE, hapNodeJs.Perms.WRITE_RESPONSE, `Incorrect value` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Perms strings`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Perms[ "READ" ],  hapNodeJs.Perms[ "READ" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "WRITE" ],  hapNodeJs.Perms[ "WRITE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "PAIRED_READ" ],  hapNodeJs.Perms[ "PAIRED_READ" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "PAIRED_WRITE" ],  hapNodeJs.Perms[ "PAIRED_WRITE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "NOTIFY" ],  hapNodeJs.Perms[ "NOTIFY" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "EVENTS" ],  hapNodeJs.Perms[ "EVENTS" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "ADDITIONAL_AUTHORIZATION" ],  hapNodeJs.Perms[ "ADDITIONAL_AUTHORIZATION" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "TIMED_WRITE" ],  hapNodeJs.Perms[ "TIMED_WRITE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "HIDDEN" ],  hapNodeJs.Perms[ "HIDDEN" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Perms[ "WRITE_RESPONSE" ],  hapNodeJs.Perms[ "WRITE_RESPONSE" ], `Incorrect string` );
      });
   });

   describe( `Testing Cmd4_Characteristics.Formats`, ( ) =>
   {
      it('Cmd4_Characteristics.Formats should be an object', ( ) =>
      {
         assert.isObject( Cmd4_Characteristics.Formats, `Cmd4_Characteristics.Formats is not an object` );
         assert.equal( Object.keys( Cmd4_Characteristics.Formats ).length , Object.keys( hapNodeJs.Formats ).length, `Length of Units do not match` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Formats values`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Formats.BOOL, hapNodeJs.Formats.BOOL, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.INT, hapNodeJs.Formats.INT, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.FLOAT, hapNodeJs.Formats.FLOAT, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.STRING, hapNodeJs.Formats.STRING, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.UINT8, hapNodeJs.Formats.UINT8, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.UINT16, hapNodeJs.Formats.UINT16, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.UINT32, hapNodeJs.Formats.UINT32, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.UINT64, hapNodeJs.Formats.UINT64, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.DATA, hapNodeJs.Formats.DATA, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.TLV8, hapNodeJs.Formats.TLV8, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.ARRAY, hapNodeJs.Formats.ARRAY, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Formats.DICTIONARY, hapNodeJs.Formats.DICTIONARY, `Incorrect value` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Formats strings`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Formats[ "BOOL" ],  hapNodeJs.Formats[ "BOOL" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "INT" ],  hapNodeJs.Formats[ "INT" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "FLOAT" ],  hapNodeJs.Formats[ "FLOAT" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "STRING" ],  hapNodeJs.Formats[ "STRING" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "UINT8" ],  hapNodeJs.Formats[ "UINT8" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "UINT16" ],  hapNodeJs.Formats[ "UINT16" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "UINT32" ],  hapNodeJs.Formats[ "UINT32" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "UINT64" ],  hapNodeJs.Formats[ "UINT64" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "DATA" ],  hapNodeJs.Formats[ "DATA" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "TLV8" ],  hapNodeJs.Formats[ "TLV8" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "ARRAY" ],  hapNodeJs.Formats[ "ARRAY" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Formats[ "DICTIONARY" ],  hapNodeJs.Formats[ "DICTIONARY" ], `Incorrect string` );
      });
   });

   describe( `Testing Cmd4_Characteristics Categories`, ( ) =>
   {
      it('Cmd4_Characteristics.Categories should be an object', ( ) =>
      {
         assert.isObject( Cmd4_Characteristics.Categories, `Cmd4_Characteristics.Categories is not an object` );
         assert.equal( Object.keys( Cmd4_Characteristics.Categories ).length , Object.keys( hapNodeJs.Categories ).length, `Length of Units do not match` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Categories values`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Categories.OTHER, hapNodeJs.Categories.OTHER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.BRIDGE, hapNodeJs.Categories.BRIDGE, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.FAN, hapNodeJs.Categories.FAN, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.GARAGE_DOOR_OPENER, hapNodeJs.Categories.GARAGE_DOOR_OPENER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.LIGHTBULB, hapNodeJs.Categories.LIGHTBULB, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.DOOR_LOCK, hapNodeJs.Categories.DOOR_LOCK, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.OUTLET, hapNodeJs.Categories.OUTLET, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SWITCH, hapNodeJs.Categories.SWITCH, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.THERMOSTAT, hapNodeJs.Categories.THERMOSTAT, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SENSOR, hapNodeJs.Categories.SENSOR, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.ALARM_SYSTEM, hapNodeJs.Categories.ALARM_SYSTEM, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SECURITY_SYSTEM, hapNodeJs.Categories.SECURITY_SYSTEM, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.DOOR, hapNodeJs.Categories.DOOR, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.WINDOW, hapNodeJs.Categories.WINDOW, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.WINDOW_COVERING, hapNodeJs.Categories.WINDOW_COVERING, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.PROGRAMMABLE_SWITCH, hapNodeJs.Categories.PROGRAMMABLE_SWITCH, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.RANGE_EXTENDER, hapNodeJs.Categories.RANGE_EXTENDER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.CAMERA, hapNodeJs.Categories.CAMERA, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.IP_CAMERA, hapNodeJs.Categories.IP_CAMERA, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.VIDEO_DOORBELL, hapNodeJs.Categories.VIDEO_DOORBELL, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIR_PURIFIER, hapNodeJs.Categories.AIR_PURIFIER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIR_HEATER, hapNodeJs.Categories.AIR_HEATER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIR_CONDITIONER, hapNodeJs.Categories.AIR_CONDITIONER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIR_HUMIDIFIER, hapNodeJs.Categories.AIR_HUMIDIFIER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIR_DEHUMIDIFIER, hapNodeJs.Categories.AIR_DEHUMIDIFIER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.APPLE_TV, hapNodeJs.Categories.APPLE_TV, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.HOMEPOD, hapNodeJs.Categories.HOMEPOD, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SPEAKER, hapNodeJs.Categories.SPEAKER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AIRPORT, hapNodeJs.Categories.AIRPORT, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SPRINKLER, hapNodeJs.Categories.SPRINKLER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.FAUCET, hapNodeJs.Categories.FAUCET, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.SHOWER_HEAD, hapNodeJs.Categories.SHOWER_HEAD, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.TELEVISION, hapNodeJs.Categories.TELEVISION, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.TARGET_CONTROLLER, hapNodeJs.Categories.TARGET_CONTROLLER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.ROUTER, hapNodeJs.Categories.ROUTER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.AUDIO_RECEIVER, hapNodeJs.Categories.AUDIO_RECEIVER, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.TV_SET_TOP_BOX, hapNodeJs.Categories.TV_SET_TOP_BOX, `Incorrect value` );
         assert.equal( Cmd4_Characteristics.Categories.TV_STREAMING_STICK, hapNodeJs.Categories.TV_STREAMING_STICK, `Incorrect value` );
      });

      it(`Testing CMD4_ACC_TYPE_ENUM.Categories strings`, ( ) =>
      {
         assert.equal( Cmd4_Characteristics.Categories[ "BOOL" ],  hapNodeJs.Units[ "BOOL" ], `Incorrect string` );

         assert.equal( Cmd4_Characteristics.Categories[ "OTHER" ], hapNodeJs.Categories[ "OTHER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "BRIDGE" ], hapNodeJs.Categories[ "BRIDGE" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "FAN" ], hapNodeJs.Categories[ "FAN" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "GARAGE_DOOR_OPENER" ], hapNodeJs.Categories[ "GARAGE_DOOR_OPENER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "LIGHTBULB" ], hapNodeJs.Categories[ "LIGHTBULB" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "DOOR_LOCK" ], hapNodeJs.Categories[ "DOOR_LOCK" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "OUTLET" ], hapNodeJs.Categories[ "OUTLET" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SWITCH" ], hapNodeJs.Categories[ "SWITCH" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "THERMOSTAT" ], hapNodeJs.Categories[ "THERMOSTAT" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SENSOR" ], hapNodeJs.Categories[ "SENSOR" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "ALARM_SYSTEM" ], hapNodeJs.Categories[ "ALARM_SYSTEM" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SECURITY_SYSTEM" ], hapNodeJs.Categories[ "SECURITY_SYSTEM" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "DOOR" ], hapNodeJs.Categories[ "DOOR" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "WINDOW" ], hapNodeJs.Categories[ "WINDOW" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "WINDOW_COVERING" ], hapNodeJs.Categories[ "WINDOW_COVERING" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "PROGRAMMABLE_SWITCH" ], hapNodeJs.Categories[ "PROGRAMMABLE_SWITCH" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "RANGE_EXTENDER" ], hapNodeJs.Categories[ "RANGE_EXTENDER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "CAMERA" ], hapNodeJs.Categories[ "CAMERA" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "IP_CAMERA" ], hapNodeJs.Categories[ "IP_CAMERA" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "VIDEO_DOORBELL" ], hapNodeJs.Categories[ "VIDEO_DOORBELL" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIR_PURIFIER" ], hapNodeJs.Categories[ "AIR_PURIFIER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIR_HEATER" ], hapNodeJs.Categories[ "AIR_HEATER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIR_CONDITIONER" ], hapNodeJs.Categories[ "AIR_CONDITIONER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIR_HUMIDIFIER" ], hapNodeJs.Categories[ "AIR_HUMIDIFIER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIR_DEHUMIDIFIER" ], hapNodeJs.Categories[ "AIR_DEHUMIDIFIER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "APPLE_TV" ], hapNodeJs.Categories[ "APPLE_TV" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "HOMEPOD" ], hapNodeJs.Categories[ "HOMEPOD" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SPEAKER" ], hapNodeJs.Categories[ "SPEAKER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AIRPORT" ], hapNodeJs.Categories[ "AIRPORT" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SPRINKLER" ], hapNodeJs.Categories[ "SPRINKLER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "FAUCET" ], hapNodeJs.Categories[ "FAUCET" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "SHOWER_HEAD" ], hapNodeJs.Categories[ "SHOWER_HEAD" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "TELEVISION" ], hapNodeJs.Categories[ "TELEVISION" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "TARGET_CONTROLLER" ], hapNodeJs.Categories[ "TARGET_CONTROLLER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "ROUTER" ], hapNodeJs.Categories[ "ROUTER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "AUDIO_RECEIVER" ], hapNodeJs.Categories[ "AUDIO_RECEIVER" ], `Incorrect string` );
         assert.equal( Cmd4_Characteristics.Categories[ "TV_SET_TOP_BOX" ], hapNodeJs.Categories[ "TV_SET_TOP_BOX" ], `Incorrect strinstring` );
         assert.equal( Cmd4_Characteristics.Categories[ "TV_STREAMING_STICK" ], hapNodeJs.Categories[ "TV_STREAMING_STICK" ], `Incorrect string` );

      });
   });
});

describe("Testing Cmd4_Characteristics traits", ( ) =>
{
   // Test a format type
   it( "Cmd4_Characteristics.Formats.float should equal expected value", ( ) =>
   {
      assert.equal( Cmd4_Characteristics.Formats["FLOAT"], "float", `Cmd4_Characteristics.Formats "FLOAT" not equal to expected`);
   });

   // Test a units type
   it( "Cmd4_Characteristics.Units.lux should equal expected value", ( ) =>
   {
      assert.equal( Cmd4_Characteristics.Units["LUX"], "lux", `Cmd4_Characteristics.Units "LUX" not equal to expected`);
   });

   // Test a perms type
   it( "Cmd4_Characteristics.Perms.ev should equal expected value", ( ) =>
   {
      assert.equal( Cmd4_Characteristics.Perms["EVENTS"], "ev", `Cmd4_Characteristics.Perms "EVENT" not equal to expected`);
   });
});


