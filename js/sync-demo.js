// Snapshot references move only when the presenter explicitly commits, pushes or pulls.
(() => {
  'use strict';

  const fields = [
    { key: 'title', label: '标题', original: '书店', revised: '街角' },
    { key: 'byline', label: '署名', original: '小王', revised: '贝拉' }
  ];

  function initialState() {
    const text = Object.fromEntries(fields.map(field => [field.key, field.original]));
    const original = { version: 1, ...text };
    return {
      phase: 'ready',
      work: text,
      staged: new Set(),
      local: original,
      previous: null,
      remote: original,
      friend: original,
      comparing: false
    };
  }

  let state = initialState();
  const dirty = key => state.work[key] !== state.local[key];
  const hasPending = () => fields.some(({ key }) => dirty(key));

  function nextAction() {
    switch (state.phase) {
      case 'ready': return ['edit', '改两处'];
      case 'staging': return ['commit', '提交 commit'];
      case 'saved': return ['push', '推送 push'];
      case 'pushed': return ['pull', '朋友拉取 pull'];
      default: return hasPending() ? ['continue', '再选一处'] : ['reset', '再试一次'];
    }
  }

  function explanation() {
    switch (state.phase) {
      case 'ready': return '朋友已克隆 V1';
      case 'staging': return '勾选即暂存';
      case 'saved': return '新存档还在本机';
      case 'pushed': return '朋友仍是 V' + state.friend.version;
      default: {
        const pending = fields.find(field => dirty(field.key));
        return pending ? pending.label + '留在草稿' : '三份存档相同';
      }
    }
  }

  function valueCell(copyKey, snapshot, field) {
    const {key, label, original} = field;
    const value = snapshot[key];
    const changed = value !== original ? ' is-revised' : '';
    const valueText = '<span data-sync-value="' + key + '">' + value + '</span>';
    if (copyKey === 'work' && state.phase === 'staging' && dirty(key)) {
      return '<label class="sync-value sync-choice' + changed + '">' +
        '<input type="checkbox" data-sync-field="' + key + '" aria-label="暂存' + label + '的改动"' +
        (state.staged.has(key) ? ' checked' : '') + '>' + valueText + '</label>';
    }
    const pending = copyKey === 'work' && dirty(key) ? ' is-pending' : '';
    return '<div class="sync-value' + changed + pending + '" aria-label="' + label + '：' + value + '">' +
      valueText + '</div>';
  }

  function station(copyKey, label, snapshot, current) {
    const version = copyKey === 'work' ? 'DRAFT' : 'V' + snapshot.version;
    return '<div class="sync-station sync-' + copyKey + (current ? ' is-current' : '') +
      '" role="group" aria-label="' + label + '" data-sync-copy="' + copyKey + '">' +
      '<div class="sync-station-head"><strong>' + label + '</strong><code>' + version + '</code></div>' +
      fields.map(field => valueCell(copyKey, snapshot, field)).join('') + '</div>';
  }

  function board() {
    const labels = '<div class="sync-field-labels" aria-hidden="true"><span></span>' +
      fields.map(field => '<b>' + field.label + '</b>').join('') + '</div>';
    return '<div class="sync-board">' + labels +
      station('work', '工作区', state.work, state.phase === 'ready' || state.phase === 'staging') +
      station('local', '本机存档', state.local, state.phase === 'saved') +
      station('remote', 'GitHub', state.remote, state.phase === 'pushed') +
      station('friend', '朋友电脑', state.friend, state.phase === 'received') + '</div>';
  }

  function diff() {
    const before = state.previous;
    const after = state.local;
    return '<div class="sync-diff"><table><caption>上一次提交</caption><thead><tr><th></th><th>V' +
      before.version + '</th><th>V' + after.version + '</th></tr></thead><tbody>' +
      fields.map(({key, label}) => {
        const oldValue = before[key], newValue = after[key];
        const changed = oldValue !== newValue;
        return '<tr><th scope="row">' + label + '</th><td>' +
          (changed ? '<del>' + oldValue + '</del>' : oldValue) + '</td><td>' +
          (changed ? '<ins>' + newValue + '</ins>' : newValue) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function act(action) {
    if (action === 'reset') { state = initialState(); return; }
    if (action === 'compare') {
      if (state.previous) state.comparing = !state.comparing;
      return;
    }
    if (state.comparing || action !== nextAction()[0]) return;
    switch (action) {
      case 'edit':
        for (const field of fields) state.work[field.key] = field.revised;
        state.phase = 'staging';
        break;
      case 'continue':
        state.phase = 'staging';
        break;
      case 'commit': {
        if (!state.staged.size) return;
        const snapshot = { ...state.local, version: state.local.version + 1 };
        for (const key of state.staged) snapshot[key] = state.work[key];
        state.previous = state.local;
        state.local = snapshot;
        state.staged.clear();
        state.phase = 'saved';
        break;
      }
      case 'push':
        state.remote = state.local;
        state.phase = 'pushed';
        break;
      case 'pull':
        state.friend = state.remote;
        state.phase = 'received';
        break;
    }
  }

  function render(root, focusTarget) {
    const [action, label] = nextAction();
    const compare = state.previous && !state.comparing ?
      '<button type="button" class="sync-secondary" data-sync-action="compare">对照 V' +
        state.previous.version + ' / V' + state.local.version + '</button>' : '';
    const replay = action === 'reset' && !state.comparing ? '' :
      '<button type="button" class="sync-replay" data-sync-action="reset" ' +
      'title="从头演示" aria-label="从头演示">↻</button>';
    const primary = state.comparing ? 'compare' : action;
    const disabled = primary === 'commit' && !state.staged.size;
    root.innerHTML = '<section class="sync-demo" aria-label="选择改动、存档并与朋友同步">' +
      '<div class="sync-filebar"><code>探店.md</code><div>' + compare + replay + '</div></div>' +
      (state.comparing ? diff() : board()) +
      '<div class="sync-footer"><strong role="status">' + (state.comparing ? '红删 · 绿增' : explanation()) + '</strong>' +
      '<button type="button" class="sync-primary" data-sync-action="' + primary + '"' +
      (disabled ? ' disabled' : '') + '>' + (state.comparing ? '返回' : label) + '</button></div></section>';

    const section = root.querySelector('.sync-demo');
    section.addEventListener('change', event => {
      const checkbox = event.target.closest('[data-sync-field]');
      if (!checkbox || state.phase !== 'staging') return;
      const key = checkbox.dataset.syncField;
      if (checkbox.checked) state.staged.add(key);
      else state.staged.delete(key);
      section.querySelector('.sync-primary').disabled = !state.staged.size;
    });
    section.addEventListener('click', event => {
      const button = event.target.closest('[data-sync-action]');
      if (!button || button.disabled) return;
      const chosen = button.dataset.syncAction;
      act(chosen);
      let focus = '.sync-primary';
      if (chosen === 'compare' && !state.comparing) focus = '.sync-secondary';
      else if (state.phase === 'staging' && !state.comparing) focus = '[data-sync-field]';
      render(root, focus);
    });
    if (focusTarget) section.querySelector(focusTarget)?.focus({preventScroll: true});
  }

  window.BelaSyncDemo = { render };
})();
