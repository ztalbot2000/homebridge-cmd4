let uiMock = require( "@homebridge/plugin-ui-utils/dist/ui.mock" );
let MockHomebridgePluginUi = uiMock.MockHomebridgePluginUi;
//console.log(" included: %s", MockHomebridgePluginUi );

describe('TestCustomUi', () => {
  //let homebridge: MockHomebridgePluginUi;
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
      }
    ];

    // mock the schema
    homebridge.mockPluginSchema = {
      pluginAlias: 'homebridge-cmd4',
      pluginType: 'platform'
    };

    assert.equal((await window.homebridge.getPluginConfig()).length, 1);
    assert.isDefined((await window.homebridge.getPluginConfigSchema()).pluginAlias);
  });

});
