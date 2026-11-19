(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const stage = $('#stage');
  const programs = window.BelaPrograms;
  const lessons = window.BelaLessons;
  const overlay = $('#overlay');
  const stages = [
    { scene: 'docs', text: '本场主题：零基础学 Git & GitHub' },
    { scene: 'save', text: 'AI 改崩了？Git 让你 1 秒退回旧版' },
    { scene: 'back', text: '不会命令行也能用：桌面版 + AI 提示词' },
    { scene: 'push', text: 'Git 在电脑留档 · GitHub 是免费作品集' },
    { scene: 'join', text: '听完直接上手，自己管好 AI 作品！' },
  ];
  const key = 'bela.live.section.v1';
  let current = 0;
  let step = 0;
  let tool = '';
  let previousFocus = null;
  let loopFrame = 0;
  let paused = false;
  let lastFrame = Date.now();
  let notesWindow = null;
  const sections = ['header', '#home', '#lesson', '#recap', '#utilities'];
  const tabs = 'button:not([disabled]), input, a[href], textarea, [tabindex="0"]';
  const pad = (value) => String(value).padStart(2, '0');
  const fmtSec = (sec) => pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);
  const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let timerRunning = true;
  let totalElapsed = 0;
  let lastTick = Date.now();
  const sectionElapsed = [0, 0, 0, 0, 0, 0];

  function resize() {
    stage.style.setProperty('--zoom', Math.min(innerWidth / 1920, innerHeight / 1080));
  }
  function updateClock() {
    const now = Date.now();
    if (timerRunning && now - lastTick >= 1000) {
      const delta = Math.max(1, Math.round((now - lastTick) / 1000));
      lastTick = now;
      totalElapsed += delta;
      if (current >= 1 && current <= programs.length) {
        sectionElapsed[current - 1] += delta;
      }
    } else if (!timerRunning) {
      lastTick = now;
    }
    const totalTarget = programs.reduce((acc, p) => acc + (p.minutes || 15), 0);
    const clockEl = $('#clock');
    if (clockEl) clockEl.textContent = fmtSec(totalElapsed) + ' / ' + pad(totalTarget) + ':00';
    const secLabel = $('#timer-sec-label');
    const secVal = $('#timer-sec-val');
    const secPill = $('#timer-sec-pill');
    if (secLabel && secVal && secPill) {
      if (!current) {
        secLabel.textContent = '单节建议';
        secVal.textContent = '15:00';
        secPill.classList.remove('is-warn', 'is-over');
      } else {
        const targetMin = programs[current - 1].minutes || 15;
        const targetSec = targetMin * 60;
        const used = sectionElapsed[current - 1];
        secLabel.textContent = '本节已讲';
        secVal.textContent = fmtSec(used) + ' / ' + pad(targetMin) + ':00';
        secPill.classList.toggle('is-warn', used >= targetSec * 0.8 && used < targetSec);
        secPill.classList.toggle('is-over', used >= targetSec);
      }
    }
    const toggleBtn = $('#timer-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = timerRunning ? '⏸' : '▶';
      toggleBtn.setAttribute('aria-label', timerRunning ? '暂停计时' : '继续计时');
      toggleBtn.title = timerRunning ? '暂停计时' : '继续计时';
    }
  }
  function lastSection() {
    try {
      return Number(localStorage.getItem(key)) || 0;
    } catch {
      return 0;
    }
  }
  function select(id) {
    if (!Number.isInteger(id) || id < 0 || id > programs.length) id = 0;
    if (tool) dismiss(false);
    const oldSection = current;
    current = id;
    stage.classList.toggle('broadcast', id !== 0);
    step = 0;
    try {
      localStorage.setItem(key, String(id));
    } catch {
      /* File storage may be disabled by the browser. */
    }
    $('#home').hidden = id !== 0;
    $('#lesson').hidden = id === 0;
    $('#air-title').textContent = id
      ? '正在讲 第 ' + id + ' 节 · ' + programs[id - 1].short
      : '课程首页';
    renderRoadmap();
    if (!id) {
      if (oldSection)
        $('.program-launch[data-program="' + oldSection + '"]').focus({ preventScroll: true });
      return;
    }
    $('#lesson-file').textContent = '0' + id;
    $('#lesson').dataset.theme = String(id);
    updateClock();
    renderStep(0);
    $('#close-lesson').focus({ preventScroll: true });
  }
  function renderRoadmap() {
    const el = $('#live-roadmap');
    if (!el) return;
    el.innerHTML = programs
      .map((p, idx) => {
        const num = idx + 1;
        const isCurrent = current === num;
        const isDone = current > num;
        const cls = isCurrent ? ' is-current' : isDone ? ' is-done' : '';
        return (
          '<button type="button" class="rm-item' +
          cls +
          '" data-rm="' +
          num +
          '"><span class="rm-num">' +
          (isDone ? '✓' : '0' + num) +
          '</span><span class="rm-time">' +
          (p.time || '') +
          '</span><span class="rm-name">' +
          p.short +
          '</span>' +
          (isCurrent ? '<span class="rm-tag">正在讲</span>' : '') +
          '</button>'
        );
      })
      .join('');
    el.querySelectorAll('[data-rm]').forEach((btn) =>
      btn.addEventListener('click', () => select(Number(btn.dataset.rm))),
    );
  }
  function renderStep(target) {
    if (!current) return;
    const lesson = lessons[current];
    const program = programs[current - 1];
    step = Math.max(0, Math.min(target, lesson.steps.length - 1));
    const body = $('#lesson-body');
    body.replaceChildren();
    lesson.render(body, step);
    $('#lesson').classList.toggle('first-step', step === 0);
    $('#lesson-title').textContent = step === 0 ? program.title : lesson.steps[step];
    const eyebrowText = $('#lesson-eyebrow-text');
    if (eyebrowText) {
      eyebrowText.textContent =
        'CH ' + pad(current) + ' · ' + program.short + ' · 预计 ' + (program.minutes || 15) + ' 分钟';
    }
    const intro = $('#lesson-intro');
    if (intro) intro.textContent = program.focus || program.intro;
    $('#previous').textContent = '← 上一步';
    $('#previous').title = '上一步（←）';
    $('#previous').setAttribute('aria-label', '上一步');
    $('#step-pos').textContent = pad(step + 1) + ' / ' + pad(lesson.steps.length);
    $('#step-name').textContent = lesson.steps[step];
    $('#previous').disabled = step === 0;
    const last = step === lesson.steps.length - 1;
    $('#next').textContent = last ? '⌂ 回节目单' : '下一步 →';
    $('#next').setAttribute('aria-label', last ? '回节目单' : '下一步');
    $('#next').title = last ? '回节目单（→）' : '下一步（→）';
    if (!mediaQuery.matches)
      body.animate(
        [
          { opacity: 0.68, transform: 'translateY(5px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 180 },
      );
  }
  window.BelaGoStep = renderStep;
  function advance() {
    if (!current) return;
    if (step === lessons[current].steps.length - 1) select(0);
    else renderStep(step + 1);
  }
  function makeLoop() {
    const frame = stages[loopFrame];
    const papers =
      '<i class="sheet a">v1.docx</i><i class="sheet b">v4.docx</i><i class="sheet c">v7.docx</i>';
    const nodes = '<span class="version-line"><b>V1</b><b>V2</b><b>V3</b></span>';
    const cloud = '<span class="tiny-cloud">GitHub</span>';
    const art = {
      docs: '<span class="laptop">AI 大白话</span><i class="push-arrow">·</i><span class="tiny-cloud">Git &amp; GitHub</span>',
      save: nodes + '<i class="rewind-chip">↶ 1秒退回</i>',
      back: '<span class="change-slip">💬 发给 AI 一句话</span><i class="push-arrow">⇢</i><span class="accept-change">✓ 自动搞定</span>',
      push: '<span class="laptop">本机 Git</span><i class="push-arrow">⇢</i>' + cloud,
      join: '<span class="accept-change">会存档</span><span class="accept-change">会回退</span><span class="accept-change">会上 GitHub</span>',
    }[frame.scene];
    const view =
      '<div class="loop-visual scene-' +
      frame.scene +
      '" aria-hidden="true"><div class="loop-artboard">' +
      art +
      '</div></div><div class="loop-caption">' +
      frame.text +
      '</div>';
    const bars = stages.map((_, i) => '<i class="' + (i <= loopFrame ? 'mark' : '') + '"></i>').join('');
    [$('#mini-frame'), $('#large-frame')].filter(Boolean).forEach((node) => (node.innerHTML = view));
    [$('#mini-bars'), $('#large-bars')].filter(Boolean).forEach((node) => (node.innerHTML = bars));
    [$('#loop-pause'), $('#large-pause')].filter(Boolean).forEach((node) => {
      node.textContent = paused ? '▶' : 'Ⅱ';
      node.setAttribute('aria-label', paused ? '继续循环' : '暂停循环');
      node.title = paused ? '继续循环' : '暂停循环';
    });
  }
  function cycle(direction = 1) {
    loopFrame = (loopFrame + stages.length + direction) % stages.length;
    lastFrame = Date.now();
    makeLoop();
  }
  function togglePlayback() {
    paused = !paused;
    lastFrame = Date.now();
    makeLoop();
  }
  function drawWords(query) {
    const find = query.trim().toLowerCase();
    const found = window.DATA.glossary.filter((entry) =>
      [entry.term, entry.meaning, ...entry.aliases].some((word) => word.toLowerCase().includes(find)),
    );
    const list = $('#words');
    list.replaceChildren();
    let page = 0;
    function showPage() {
      list.replaceChildren();
      const visible = found.slice(page * 2, page * 2 + 2);
      for (const item of visible) {
        const card = document.createElement('article');
        card.className = 'word';
        const head = document.createElement('div');
        head.className = 'word-head';
        const title = document.createElement('h3');
        title.textContent = item.term;
        head.append(title);
        if (item.tag) {
          const tag = document.createElement('span');
          tag.className = 'word-tag';
          tag.textContent = item.tag;
          head.append(tag);
        }
        const meaning = document.createElement('p');
        meaning.textContent = item.meaning;
        card.append(head, meaning);
        if (item.tip) {
          const tip = document.createElement('p');
          tip.className = 'word-tip';
          tip.textContent = '💡 ' + item.tip;
          card.append(tip);
        }
        list.append(card);
      }
      if (!found.length) {
        const p = document.createElement('p');
        p.className = 'empty-word';
        p.textContent = '没有找到这个词。试试「存档」「分支」或「二创」。';
        list.append(p);
      }
      $('#word-prev').disabled = page === 0;
      $('#word-next').disabled = (page + 1) * 2 >= found.length;
      $('#word-count').textContent = found.length ? page + 1 + ' / ' + Math.ceil(found.length / 2) : '0';
    }
    $('#word-prev').onclick = () => {
      if (page > 0) {
        page--;
        showPage();
      }
    };
    $('#word-next').onclick = () => {
      if ((page + 1) * 2 < found.length) {
        page++;
        showPage();
      }
    };
    showPage();
    list.scrollTop = 0;
  }
  function showAnswer(i) {
    const quiz = programs[(current || 1) - 1].quiz;
    document.querySelectorAll('.quiz-option').forEach((el, j) => el.classList.toggle('chosen', i === j));
    const feedback = $('#quiz-feedback');
    feedback.innerHTML =
      '<b>' +
      (i === quiz.answer ? '答对了！' : '来看解析：正确选项是 ' + (quiz.answer + 1) + '。') +
      '</b> ';
    feedback.append(quiz.why);
  }
  function notes() {
    if (tool) dismiss(false);
    notesWindow = window.open('notes.html#' + (current || 1), 'belaSpeakerNotes');
    if (notesWindow) notesWindow.focus();
  }
  function openTool(name) {
    if (name === 'notes') {
      notes();
      return;
    }
    if (name === tool) {
      dismiss();
      return;
    }
    if (!tool) previousFocus = document.activeElement;
    tool = name;
    overlay.classList.toggle('takeover', name === 'loop');
    sections.forEach((s) => ($(s).inert = true));
    overlay.hidden = false;
    const panel = $('#modal-body');
    if (name === 'glossary') {
      panel.innerHTML =
        '<h2 id="modal-title">术语翻译机</h2><label class="searchbox"><input type="search" autocomplete="off" id="gloss-search" placeholder="输入英文或大白话，比如 commit、存档、分支、二创" aria-label="搜索英文或中文术语"></label><div id="words" class="word-list"></div><nav class="word-pager" aria-label="翻看词卡"><button id="word-prev">← 上一组</button><span id="word-count"></span><button id="word-next">下一组 →</button></nav>';
      const search = $('#gloss-search');
      search.addEventListener('input', () => drawWords(search.value));
      drawWords('');
      search.focus();
    } else if (name === 'summary') {
      let mode = 'current';
      function drawSummary() {
        const idx = (current || 1) - 1;
        const p = programs[idx];
        const t = p.takeaway || { mantra: p.intro, points: [] };
        const body =
          mode === 'current'
            ? '<h2 id="modal-title">第 ' +
              (idx + 1) +
              ' 节高光总结 · ' +
              p.short +
              '</h2><div class="sum-mantra">✨ ' +
              t.mantra +
              '</div><ol class="sum-points">' +
              t.points.map((pt, i) => '<li><b>0' + (i + 1) + '</b><span>' + pt + '</span></li>').join('') +
              '</ol>'
            : '<h2 id="modal-title">全场 6 节口诀一图带走</h2><div class="sum-all-grid">' +
              programs
                .map(
                  (item, i) =>
                    '<article class="sum-all-card"><strong>0' +
                    (i + 1) +
                    ' · ' +
                    item.short +
                    '</strong><p>' +
                    (item.takeaway?.mantra || item.intro) +
                    '</p></article>',
                )
                .join('') +
              '</div>';
        panel.innerHTML =
          '<div class="sum-tabs"><div class="sum-switch"><button type="button" data-smode="current" aria-pressed="' +
          (mode === 'current') +
          '">本节带走卡</button><button type="button" data-smode="all" aria-pressed="' +
          (mode === 'all') +
          '">全场 6 节总复习</button></div><span class="sum-badge">📸 欢迎截图保存</span></div>' +
          body;
        panel.querySelectorAll('[data-smode]').forEach((b) =>
          b.addEventListener('click', () => {
            mode = b.dataset.smode;
            drawSummary();
          }),
        );
      }
      drawSummary();
      $('#modal-close').focus();
    } else if (name === 'quiz') {
      const quiz = programs[(current || 1) - 1].quiz;
      panel.innerHTML =
        '<div class="tool-label">LIVE Q &amp; A</div><h2 id="modal-title">弹幕小测 · ' +
        programs[(current || 1) - 1].short +
        '</h2><p class="quiz-question">' +
        quiz.question +
        '</p><div class="quiz-options">' +
        quiz.choices
          .map(
            (c, i) =>
              '<button class="quiz-option" data-answer="' +
              i +
              '"><strong>扣 ' +
              (i + 1) +
              '</strong>' +
              c +
              '</button>',
          )
          .join('') +
        '</div><p id="quiz-feedback" class="quiz-feedback" aria-live="polite">请在弹幕扣 1 或 2，主播点击按钮揭晓答案。</p>';
      panel
        .querySelectorAll('[data-answer]')
        .forEach((btn) => btn.addEventListener('click', () => showAnswer(Number(btn.dataset.answer))));
      $('#modal-close').focus();
    } else {
      loopFrame = 0;
      lastFrame = Date.now();
      paused = false;
      panel.innerHTML =
        '<div class="large-loop"><h2 id="modal-title">刚进来？30 秒看懂</h2><div id="large-frame" class="loop-frame"></div><div class="playback"><button id="large-pause"></button><div id="large-bars" class="play-bars"></div><span class="runtime">00:30</span></div><button class="tool-button" id="loop-next">下一幕 →</button></div>';
      $('#large-pause').addEventListener('click', togglePlayback);
      $('#loop-next').addEventListener('click', () => cycle());
      makeLoop();
      $('#modal-close').focus();
    }
  }
  function dismiss(restore = true) {
    tool = '';
    overlay.hidden = true;
    $('#modal-body').replaceChildren();
    sections.forEach((s) => ($(s).inert = false));
    if (restore && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  }
  function handleKey(event) {
    if (event.isComposing || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey)
      return;
    const k = event.key.toLowerCase();
    if (tool && k === 'tab') {
      const controls = [...$('#modal').querySelectorAll(tabs)];
      if (event.shiftKey && document.activeElement === controls[0]) {
        event.preventDefault();
        controls.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
        event.preventDefault();
        controls[0].focus();
      }
      return;
    }
    if (k === 'escape') {
      event.preventDefault();
      if (tool) dismiss();
      else select(0);
      return;
    }
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.repeat) return;
    if (tool) {
      if (tool === 'quiz' && (k === '1' || k === '2')) showAnswer(Number(k) - 1);
      else if (tool === 'loop' && (k === 'arrowright' || k === 'arrowleft'))
        cycle(k === 'arrowright' ? 1 : -1);
      else if (k === '0') select(0);
      else if (
        (tool === 'quiz' && k === 'q') ||
        (tool === 'loop' && k === 'l') ||
        (tool === 'glossary' && k === 't') ||
        (tool === 'summary' && k === 's')
      )
        dismiss();
      else return;
    } else if (/^[0-6]$/.test(k)) select(Number(k));
    else if (k === 'arrowright' && current) advance();
    else if (k === 'arrowleft' && current) renderStep(step - 1);
    else if ({ t: 1, q: 1, l: 1, n: 1, s: 1 }[k])
      openTool({ t: 'glossary', q: 'quiz', l: 'loop', n: 'notes', s: 'summary' }[k]);
    else return;
    event.preventDefault();
  }
  window.BelaExplain = function openExplain(spec) {
    if (!spec) return;
    if (!tool) previousFocus = document.activeElement;
    tool = 'explain';
    overlay.classList.remove('takeover');
    sections.forEach((s) => ($(s).inert = true));
    overlay.hidden = false;
    const panel = $('#modal-body');
    const esc = (v) =>
      String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    panel.innerHTML =
      (spec.tag ? '<div class="tool-label">' + esc(spec.tag) + '</div>' : '') +
      '<h2 id="modal-title">' +
      esc(spec.title) +
      '</h2>' +
      (spec.summary ? '<p class="explain-summary">' + esc(spec.summary) + '</p>' : '') +
      (spec.detail ? '<div class="explain-body">' + spec.detail + '</div>' : '') +
      (spec.aiTip
        ? '<div class="explain-ai"><b>🗣️ 在 AI 工具里怎么用：</b><span>' + esc(spec.aiTip) + '</span></div>'
        : '');
    $('#modal-close').focus();
  };
  const programIcons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="4" width="7" height="6" rx="1.5"/><rect x="3" y="14" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M10 7h4M10 17h4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-4 5.5-9.5 5.5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H7a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18.2 8.5 4 4 0 0 1 17.5 19Z"/><path d="M12 11v6m-2.5-3.5L12 11l2.5 2.5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="18.5" cy="17.5" r="2.5"/></svg>',
  ];
  $('#programs').innerHTML = programs
    .map(
      (p, i) =>
        '<button class="program-launch" data-program="' +
        (i + 1) +
        '" title="按 ' +
        (i + 1) +
        ' 打开：' +
        p.short +
        '"><div class="prog-top"><span class="prog-svg" aria-hidden="true">' +
        programIcons[i] +
        '</span><kbd>' +
        (i + 1) +
        '</kbd></div><span class="prog-name">' +
        p.short +
        '</span><span class="prog-sub">' +
        (p.desktopLabel || '') +
        '</span></button>',
    )
    .join('');
  document
    .querySelectorAll('[data-program]')
    .forEach((btn) => btn.addEventListener('click', () => select(Number(btn.dataset.program))));
  document
    .querySelectorAll('[data-tool]')
    .forEach((btn) => btn.addEventListener('click', () => openTool(btn.dataset.tool)));
  $('#brand').addEventListener('click', () => select(0));
  $('#close-lesson').addEventListener('click', () => select(0));
  $('#modal-close').addEventListener('click', () => dismiss());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss();
  });
  $('#next').addEventListener('click', advance);
  $('#previous').addEventListener('click', () => renderStep(step - 1));
  $('#loop-expand').addEventListener('click', () => openTool('loop'));
  $('#loop-pause').addEventListener('click', togglePlayback);
  const timerToggle = $('#timer-toggle');
  if (timerToggle) {
    timerToggle.addEventListener('click', () => {
      timerRunning = !timerRunning;
      lastTick = Date.now();
      updateClock();
    });
  }
  const timerReset = $('#timer-reset');
  if (timerReset) {
    timerReset.addEventListener('click', () => {
      if (current >= 1 && current <= programs.length) {
        sectionElapsed[current - 1] = 0;
      } else {
        totalElapsed = 0;
        for (let i = 0; i < sectionElapsed.length; i++) sectionElapsed[i] = 0;
      }
      lastTick = Date.now();
      updateClock();
    });
  }
  window.addEventListener('keydown', handleKey);
  window.addEventListener('resize', resize);
  resize();
  updateClock();
  makeLoop();
  select(lastSection());
  setInterval(() => {
    updateClock();
    if (!paused && Date.now() - lastFrame >= 6000) cycle();
  }, 250);
})();
