(() => {
  'use strict';

  const lessons = window.BelaLessons ||= {};
  const icon = (name, className = '') =>
    `<img class="ws-object ${className}" src="assets/y2k/${name}.png" alt="" draggable="false">`;
  const action = (label, command, secondary = false) =>
    `<button type="button" class="ws-button${secondary ? ' ws-secondary' : ''}" data-ws-action="${command}">${label}</button>`;

  // Each screen owns its listeners, so switching a lesson never steals the desktop's keys.
  function screen(root, className, contents) {
    root.innerHTML = `<div class="ws-screen ${className}">${contents}</div>`;
    return root.firstElementChild;
  }

  function nextOnClick(container, step) {
    container.querySelector('[data-ws-action="next"]')?.addEventListener('click', () => window.BelaGoStep(step + 1));
  }

  const thesisLimit = 20;
  const originalThesis = '街角书店\n先读资料\n再写结论';
  const thesis = {
    versions: [originalThesis],
    draft: originalThesis,
    current: 0,
    comparison: null
  };

  // Keep separate edits independent. Only edited fragments appear in the live comparison.
  function markChanges(oldText, newText, output) {
    const before = [...oldText];
    const after = [...newText];
    const lengths = Array.from({ length: before.length + 1 }, () => new Uint16Array(after.length + 1));
    for (let left = before.length - 1; left >= 0; left--) {
      for (let right = after.length - 1; right >= 0; right--) {
        lengths[left][right] = before[left] === after[right]
          ? 1 + lengths[left + 1][right + 1]
          : Math.max(lengths[left + 1][right], lengths[left][right + 1]);
      }
    }
    const hunks = [];
    let hunk;
    let left = 0;
    let right = 0;
    while (left < before.length || right < after.length) {
      if (left < before.length && right < after.length && before[left] === after[right]) {
        hunk = null;
        left++;
        right++;
        continue;
      }
      if (!hunk) {
        hunk = { removed: [], added: [] };
        hunks.push(hunk);
      }
      if (left < before.length && (right === after.length || lengths[left + 1][right] >= lengths[left][right + 1])) {
        hunk.removed.push(before[left++]);
      } else {
        hunk.added.push(after[right++]);
      }
    }
    // Page long or disjoint changes so every edited character is available at broadcast size.
    const pages = [];
    for (const { removed, added } of hunks) {
      for (let start = 0; start < Math.max(removed.length, added.length); start += 4) {
        pages.push([removed.slice(start, start + 4).join(''), added.slice(start, start + 4).join('')]);
      }
    }
    if (!pages.length) { output.textContent = '这两版相同。'; return; }
    let page = 0;
    output.innerHTML = '<div class="ws-diff-row"><b>改前</b><del></del></div><div class="ws-diff-row"><b>改后</b><ins></ins></div>';
    const oldPart = output.querySelector('del');
    const newPart = output.querySelector('ins');
    let previous, next, counter;
    if (pages.length > 1) {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', '逐段查看改动');
      nav.innerHTML = '<button type="button" aria-label="上一段改动">‹</button><span></span><button type="button" aria-label="下一段改动">›</button>';
      output.append(nav);
      [previous, counter, next] = nav.children;
      previous.onclick = () => { page--; show(); };
      next.onclick = () => { page++; show(); };
    }
    function show() {
      const visibleText = value => value.replaceAll('\n', '↵').replaceAll(' ', '␣').replaceAll('\t', '⇥') || '—';
      oldPart.textContent = visibleText(pages[page][0]);
      newPart.textContent = visibleText(pages[page][1]);
      if (counter) {
        counter.textContent = `${page + 1} / ${pages.length}`;
        previous.disabled = page === 0;
        next.disabled = page === pages.length - 1;
      }
    }
    show();
  }

  function paperEditor(root) {
    const container = screen(root, 'ws-editor', `
      <div class="ws-paper">
        <div class="ws-paper-head"><label for="ws-thesis">论文</label><span class="ws-length"></span></div>
        <textarea id="ws-thesis" maxlength="${thesisLimit}" rows="4" spellcheck="false" aria-label="编辑论文，最多二十字"></textarea>
        <div class="ws-paper-actions">${action('试改', 'example', true)}${action('＋ 存档', 'save')}</div>
      </div>
      <div class="ws-history">
        <div class="ws-history-head"><strong>回看</strong></div>
        <div class="ws-timeline" aria-label="论文存档"></div>
        <div class="ws-compare" aria-live="polite"></div>
      </div>`);
    const edit = container.querySelector('textarea');
    const save = container.querySelector('[data-ws-action="save"]');
    const rail = container.querySelector('.ws-timeline');
    const changes = container.querySelector('.ws-compare');

    function updateButtons() {
      container.querySelector('.ws-length').textContent = `${edit.value.length} / ${thesisLimit}`;
      save.disabled = !thesis.draft.trim() || thesis.draft === thesis.versions[thesis.current];
    }
    function showHistory() {
      edit.value = thesis.draft;
      updateButtons();
      rail.replaceChildren(...thesis.versions.map((_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `V${index + 1}`;
        button.title = `回看第 ${index + 1} 次存档`;
        button.setAttribute('aria-label', button.title);
        button.setAttribute('aria-pressed', String(index === thesis.current));
        button.addEventListener('click', () => {
          const previous = thesis.draft;
          const destination = thesis.versions[index];
          if (previous !== destination) thesis.comparison = [previous, destination];
          thesis.current = index;
          thesis.draft = destination;
          showHistory();
          rail.children[index]?.focus({ preventScroll: true });
        });
        return button;
      }));
      rail.children[thesis.current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      showComparison();
    }
    function showComparison() {
      if (thesis.draft !== thesis.versions[thesis.current]) {
        changes.textContent = '改完点存档。';
      } else if (thesis.comparison) {
        changes.innerHTML = '<div class="ws-diff" aria-label="改动片段"></div>';
        markChanges(...thesis.comparison, changes.firstElementChild);
      } else {
        changes.textContent = '改一句，再存档。';
      }
    }
    function updateDraft() {
      thesis.draft = edit.value;
      updateButtons();
      showComparison();
    }
    edit.addEventListener('input', updateDraft);
    container.querySelector('[data-ws-action="example"]').addEventListener('click', () => {
      const lines = edit.value.split('\n');
      const index = Math.min(1, lines.length - 1);
      lines[index] = lines[index] === '去问店主' ? '走访书店' : '去问店主';
      edit.value = lines.join('\n').slice(0, thesisLimit);
      updateDraft();
    });
    save.addEventListener('click', () => {
      if (save.disabled) return;
      thesis.comparison = [thesis.versions[thesis.current], thesis.draft];
      thesis.versions.push(thesis.draft);
      thesis.current = thesis.versions.length - 1;
      showHistory();
    });
    showHistory();
  }

  lessons[1] = {
    steps: ['七个最终版', '把版本串起来', '动手存档', '记住存档'],
    render(root, step) {
      if (step === 2) return paperEditor(root);
      let contents;
      if (step === 0) {
        contents = `<div class="ws-copy"><h2>哪一份<br>交给导师？</h2>${action('理一理 →', 'next')}</div>
          <div class="ws-file-pile" aria-label="七份毕业论文">
            <div class="ws-pile-tab">7 份</div>
            <div class="ws-file ws-file-back"><i></i>初稿.docx</div>
            <div class="ws-file ws-file-mid"><i></i>终稿.docx</div>
            <div class="ws-file ws-file-front"><i></i><span>毕业论文_最终版_<br><b>真的最终版_v7</b>.docx</span></div>
          </div>`;
      } else if (step === 1) {
        contents = `<div class="ws-copy"><h2>一份论文，<br>一条时间线。</h2>${action('打开论文试一试 →', 'next')}</div>
          <div class="ws-saves-art">${icon('disk')}<div class="ws-preview-rail"><span>初稿</span><span>补采访</span><span>定稿</span></div></div>`;
      } else {
        contents = `<div class="ws-copy"><h2>打 Boss 前，<br>先存个档。</h2><p>改论文前也一样。<br><b>commit</b> 就是记下这一版。</p></div>
          <div class="ws-keepsake">${icon('disk')}<div class="ws-memory-label">进度已保存 ✓</div></div>`;
      }
      nextOnClick(screen(root, 'ws-split ws-thesis-intro', contents), step);
    }
  };

  const branchSteps = ['文件太多', '一份草稿', '给草稿起名', '开一条分支', '第一次存档', '第二次存档', '合并时投票'];
  const chat = [
    ['贝拉', '七份稿，昨天哪份？'],
    ['小王', '每版留个存档。'],
    ['贝拉', '开个草稿，换个标题？']
  ];
  const titles = { main: '街角书店', bold: '谁在深夜读书？', both: '街角书店：谁在深夜读书？' };
  let branchChoice = '';
  function branchDiagram(step, merged) {
    const node = (x, y, style) => `<circle cx="${x}" cy="${y}" r="9" class="ws-node ${style}"/>`;
    return `<div class="ws-branch-figure">
      <div class="ws-track-label"><b>主线</b><span>交稿</span></div>
      <svg viewBox="0 0 400 115" role="img" aria-label="${merged ? '大胆版已经合并回主线' : '从主线分出大胆版，各自存档'}">
        <path class="ws-path-main" d="M17 24H382"/>
        ${step >= 3 ? '<path class="ws-path-bold" d="M62 24C92 24 92 89 135 89H285"/>' : ''}
        ${merged ? '<path class="ws-path-bold" d="M285 89C332 89 327 24 370 24"/>' : ''}
        ${node(62,24,'')}${step >= 5 ? node(252,24,'') : ''}${step >= 4 ? node(160,89,'is-bold') : ''}${step >= 5 ? node(265,89,'is-bold') : ''}${merged ? node(370,24,'') : ''}
      </svg><div class="ws-track-label ws-bold-label"><b>大胆版</b><span>改标题</span></div></div>`;
  }

  lessons[2] = {
    steps: branchSteps,
    render(root, step) {
      if (step < 3) {
        const bubbles = chat.slice(0, step + 1).map(([speaker, message], index) =>
          `<div class="ws-message ${index === 1 ? 'ws-reply' : ''}"><b>${speaker}</b><p>${message}</p></div>`).join('');
        const container = screen(root, 'ws-conversation', `
          <div class="ws-talk-stack">${bubbles}</div>
          <div class="ws-chat-action">${step === 0 ? icon('phone') : ''}${action(step === 2 ? '试开分支 →' : '下一句 →', 'next')}</div>`);
        nextOnClick(container, step);
        return;
      }
      const merged = step === 6 && Boolean(branchChoice);
      let prompt;
      if (step === 6 && !merged) {
        prompt = `<div class="ws-vote"><strong>同一行改了两遍，留哪句？</strong>
          <p>① ${titles.main}<br>② ${titles.bold}</p>
          <div>${action('① 主线', 'main', true)}${action('② 大胆版', 'bold', true)}${action('③ 两句都留', 'both')}</div></div>`;
      } else if (merged) {
        prompt = `<div class="ws-vote"><strong>已合并到主线 ✓</strong><p>${titles[branchChoice]}</p>${action('重新投票', 'again', true)}</div>`;
      } else {
        const instructions = {
          3: ['分支开好了。', '在大胆版存第一次档 →'],
          4: ['大胆版换了标题。', '再存一次档 →'],
          5: ['主线也改了标题。', '试着合并 →']
        };
        const [message, label] = instructions[step];
        prompt = `<div class="ws-vote"><strong>${message}</strong>${action(label, 'next')}</div>`;
      }
      const container = screen(root, 'ws-branch', branchDiagram(step, merged) + prompt);
      if (step !== 6) {
        nextOnClick(container, step);
        return;
      }
      container.querySelectorAll('[data-ws-action]').forEach(button => {
        button.addEventListener('click', () => {
          branchChoice = button.dataset.wsAction === 'again' ? '' : button.dataset.wsAction;
          lessons[2].render(root, 6);
          root.querySelector('[data-ws-action]')?.focus({ preventScroll: true });
        });
      });
    }
  };

  const aiSteps = ['交给 AI', '改好就存档', '页面改坏了', '恢复成功', '三种后悔药', '用人话指挥 AI'];
  const aiChat = [
    ['想换个按钮颜色。', '改成粉色 →'],
    ['我已把粉色版存档。', '再加个动画 →'],
    ['按钮飞出去了！', '回到上一个存档 ↶'],
    ['回来了，还是粉色。', '还有哪些退路？ →']
  ];
  const remedies = [
    ['改错字', '还没存档', '撤销手滑的修改'],
    ['想重来', '只有自己用', '把分支退回旧存档，从那里接着写。'],
    ['已共享', '别人也拿到了', '再存一版抵消改动，大家都留着历史。']
  ];
  let remedyIndex = 0;

  lessons[5] = {
    steps: aiSteps,
    render(root, step) {
      if (step === 4) {
        const [, context, result] = remedies[remedyIndex];
        const container = screen(root, 'ws-remedies', `
          <div class="ws-remedy-options" aria-label="选择场景">${remedies.map(([label], i) =>
            `<button type="button" aria-pressed="${i === remedyIndex}" data-remedy="${i}">${label}</button>`).join('')}</div>
          <div class="ws-remedy-detail">${icon('disk')}<div><h3>${context}</h3><p>${result}</p></div></div>`);
        container.querySelectorAll('[data-remedy]').forEach(button => button.addEventListener('click', () => {
          remedyIndex = Number(button.dataset.remedy);
          lessons[5].render(root, 4);
          root.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
        }));
        return;
      }
      if (step === 5) {
        screen(root, 'ws-quote', `<div><blockquote>言者所以在意，<br>得意而忘言。</blockquote><p>懂得什么时候存档，就能用自己的话指挥 AI。</p></div>${icon('star')}`);
        return;
      }
      const [message, label] = aiChat[step];
      const container = screen(root, 'ws-ai', `<div class="ws-assistant"><div class="ws-assistant-label">AI 模拟助手</div>
        <div class="ws-ai-bubble"><b>${step === 1 ? 'AI' : '贝拉'}</b><p>${message}</p></div>
        ${action(label, 'next')}</div>
        <div class="ws-site ${step === 2 ? 'is-broken' : ''}"><div class="ws-site-bar"><span class="ws-leds" aria-hidden="true">● ● ●</span><span>预览</span></div>
          <div class="ws-site-body">${icon('flower')}<strong>我的主页</strong><div class="ws-preview-button ${step ? 'is-rose' : ''}">作品集</div></div>
          ${step ? `<div class="ws-site-status">${step === 2 ? '⚠ 布局出错' : step === 3 ? '✓ 已恢复存档' : '✓ 已自动存档'}</div>` : ''}
        </div>`);
      nextOnClick(container, step);
    }
  };
})();
