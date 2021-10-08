let uiMock = require( "@homebridge/plugin-ui-utils/dist/ui.mock" );
let MockHomebridgePluginUi = uiMock.MockHomebridgePluginUi;
//console.log(" included: %s", MockHomebridgePluginUi );

describe('TestCustomUi', () =>
{
   let homebridge = [];

   beforeEach(() => {
      homebridge = new MockHomebridgePluginUi();
      window.homebridge = homebridge;
   });

   it('should return the plugin config and schema when called', async () => {
      // mock the config
      homebridge.mockPluginConfig = [
      {
        platform: 'homebridge-cmd4'
      }];

      // mock the schema
      homebridge.mockPluginSchema = {
         pluginAlias: 'homebridge-cmd4',
         pluginType: 'platform'
      };
      let p = await window.homebridge.getPluginConfig();
      let s = await window.homebridge.getPluginConfigSchema();

      assert.equal(p.length, 1, `Schema length is incoorrect`);
      assert.isDefined(s.pluginAlias, `Schema Alias is not defined`);
   });
});
