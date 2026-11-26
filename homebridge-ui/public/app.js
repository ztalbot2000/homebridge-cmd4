/* global homebridge, cmd4AccessoryTypes */
(async () => {
  const app = document.getElementById('app');
  const error = document.getElementById('error');
  if (typeof homebridge.userCurrentLightingMode === 'function') {
    homebridge.userCurrentLightingMode().then(mode => {
      document.getElementById('cmd4-settings').dataset.bsTheme = mode;
    }).catch(() => {});
  }
  const blocks = await homebridge.getPluginConfig();
  let block = blocks.find(item => item.platform === 'Cmd4');
  if (!block) {
    block = { platform: 'Cmd4', name: 'Cmd4', accessories: [] };
    blocks.push(block);
  }
  if (!Array.isArray(block.accessories)) block.accessories = [];
  let updates = Promise.resolve();
  function update() {
    updates = updates.then(() => homebridge.updatePluginConfig(blocks)).catch(err => {
      error.textContent = `Could not update settings: ${err.message || err}`;
      error.classList.remove('d-none');
    });
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function field(parent, object, key, title, options = {}) {
    const group = element('div', options.fullWidth ? 'mb-3 cmd4-command' : 'mb-3');
    const label = element('label', 'form-label d-block', title);
    const input = element('input', 'form-control');
    if (options.width) label.style.maxWidth = options.width;
    input.type = options.number ? 'number' : 'text';
    if (options.number) { input.min = '0'; input.step = 'any'; }
    input.value = object[key] == null ? '' : object[key];
    input.placeholder = options.placeholder || '';
    label.appendChild(input);
    group.appendChild(label);
    if (options.help) group.appendChild(element('div', 'form-text', options.help));
    input.addEventListener('change', () => {
      if (input.value === '') delete object[key];
      else object[key] = options.number ? Number(input.value) : input.value;
      update();
    });
    parent.appendChild(group);
  }
  function render() {
    app.replaceChildren();
    field(app, block, 'name', 'Platform name', { placeholder: 'Cmd4', width: '24rem' });
    const list = element('div');
    block.accessories.forEach((accessory, index) => {
      const card = element('section', 'card mb-3');
      const body = element('div', 'card-body');
      body.appendChild(element('h5', 'card-title', accessory.displayName || `Accessory ${index + 1}`));
      const fields = element('div', 'cmd4-accessory-fields');
      const typeGroup = element('div', 'mb-3');
      const typeLabel = element('label', 'form-label d-block', 'Accessory type');
      const typeSelect = element('select', 'form-select');
      const placeholder = element('option', '', 'Choose an accessory type');
      placeholder.value = '';
      placeholder.disabled = true;
      typeSelect.appendChild(placeholder);
      for (const type of cmd4AccessoryTypes) {
        const option = element('option', '', type);
        option.value = type;
        typeSelect.appendChild(option);
      }
      if (accessory.type && !cmd4AccessoryTypes.includes(accessory.type)) {
        const existing = element('option', '', `${accessory.type} (existing value)`);
        existing.value = accessory.type;
        typeSelect.appendChild(existing);
      }
      typeSelect.value = accessory.type || '';
      typeSelect.addEventListener('change', () => {
        accessory.type = typeSelect.value;
        update();
      });
      typeLabel.appendChild(typeSelect);
      typeGroup.appendChild(typeLabel);
      fields.appendChild(typeGroup);
      field(fields, accessory, 'displayName', 'Display name', { placeholder: 'ThinkLight' });
      field(fields, accessory, 'state_cmd', 'State command', { placeholder: '/path/to/cmd4.sh', fullWidth: true, help: 'Command used to get and set the accessory state.' });
      field(fields, accessory, 'timeout', 'Command timeout (milliseconds)', { number: true });
      field(fields, accessory, 'stateChangeResponseTime', 'State change response time (seconds)', { number: true });
      const group = element('div', 'mb-3');
      const label = element('label', 'form-label d-block', 'Polling');
      const select = element('select', 'form-select');
      const modes = [['unset', 'Use default / demo mode'], ['true', 'Enabled'], ['false', 'Disabled']];
      if (Array.isArray(accessory.polling) || (accessory.polling != null && typeof accessory.polling !== 'boolean')) modes.push(['advanced', 'Existing advanced polling (preserved)']);
      modes.forEach(([value, title]) => { const option = element('option', '', title); option.value = value; select.appendChild(option); });
      select.value = accessory.polling === true ? 'true' : accessory.polling === false ? 'false' : accessory.polling == null ? 'unset' : 'advanced';
      select.addEventListener('change', () => {
        if (select.value === 'unset') delete accessory.polling;
        else if (select.value !== 'advanced') accessory.polling = select.value === 'true';
        update();
      });
      label.appendChild(select); group.appendChild(label);
      group.appendChild(element('div', 'form-text', 'Per-characteristic polling can be edited in the JSON configuration.'));
      fields.appendChild(group);
      body.appendChild(fields);
      const remove = element('button', 'btn btn-outline-danger', 'Remove accessory');
      remove.type = 'button';
      remove.addEventListener('click', () => { block.accessories.splice(index, 1); update(); render(); });
      body.appendChild(remove); card.appendChild(body); list.appendChild(card);
    });
    app.appendChild(list);
    const add = element('button', 'btn btn-primary', 'Add accessory');
    add.type = 'button';
    add.addEventListener('click', () => { block.accessories.push({}); update(); render(); });
    app.appendChild(add);
  }
  render();
})().catch(err => {
  const error = document.getElementById('error');
  error.textContent = `Could not load settings: ${err.message || err}`;
  error.classList.remove('d-none');
});
