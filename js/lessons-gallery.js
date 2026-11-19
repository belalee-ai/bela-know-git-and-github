(() => {
  'use strict';

  const lessons = window.BelaLessons ||= {};
  const data = () => window.DATA || {};
  const go = step => window.BelaGoStep(step);
  const format = number => Number.isFinite(number) ? number.toLocaleString('en-US') : '—';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const art = name => `<img class="gal-art" src="assets/y2k/${name}.png" alt="" draggable="false">`;
  const goButton = (step, label, className = 'gal-action') =>
    `<button type="button" class="${className}" data-gal-step="${step}">${label}</button>`;

  function mount(root, html) {
    root.innerHTML = `<div class="gal">${html}</div>`;
    root.querySelectorAll('[data-gal-step]').forEach(button => {
      button.addEventListener('click', () => go(Number(button.dataset.galStep)));
    });
  }

  const hotspots = [
    {term: 'Star', title: '收藏作品', copy: '像收藏笔记，下次再来看。', art: 'star'},
    {term: 'Fork', title: '拿来二创', copy: '复制到自己名下，改出另一版。', art: 'butterfly'},
    {term: 'Issue', title: '评论区', copy: '发现错字？开一条讨论。', art: 'phone'},
    {term: 'Pull request', title: '给作者投稿', copy: '交出改好的版本，请作者合并。', art: 'bow'},
    {term: 'README', title: '先读说明', copy: '像笔记正文，告诉你怎么用。', art: 'disk'},
    {term: 'Commits', title: '编辑记录', copy: '谁改了什么？翻回去看看。', art: 'disc'}
  ];

  lessons[3] = {
    steps: ['Git + Hub', '只发一处改动', ...hotspots.map(item => item.term)],
    render(root, step) {
      if (step === 1) {
        window.BelaSyncDemo.render(root);
        return;
      }
      const selected = hotspots[step - 2];
      const hot = (term, label) => {
        const target = 2 + hotspots.findIndex(item => item.term === term);
        return `<button class="gal-hot${target === step ? ' is-current' : ''}" type="button" aria-pressed="${target === step}" data-gal-step="${target}">${label}</button>`;
      };
      const card = selected ? `<div class="gal-card-art">${art(selected.art)}</div><div class="gal-flash-contents"><span class="gal-kicker">${selected.term}</span><h3>${selected.title}</h3><p>${selected.copy}</p></div>` :
        `<div class="gal-card-art">${art('headphones')}</div><div class="gal-flash-contents"><span class="gal-kicker">Git + Hub</span><h3>存档上网</h3><p>Git 存档，Hub 是聚集地。</p>${goButton(1, '试试只发一处 →')}</div>`;
      mount(root, `<div class="gal-repo-layout">
        <section aria-label="本地模拟仓库" class="gal-repo">
          <div class="gal-repo-top"><b class="gal-code-mark" aria-hidden="true">&lt;/&gt;</b><strong>GitHub</strong><span>模拟</span></div>
          <div class="gal-repo-name"><span>belalee-ai /</span><strong>bela-know-git-and-github</strong></div>
          <div class="gal-repo-tools">${hot('Star', '☆ Star 收藏')}${hot('Fork', '⑂ Fork 复制')}</div>
          <div class="gal-repo-tabs"><span class="gal-code-tab">Code 代码</span>${hot('Issue', 'Issues 提问')}${hot('Pull request', 'Pull requests 投稿')}</div>
          <div class="gal-file-box"><div class="gal-file-head"><span>⑂ main 主线</span>${hot('Commits', '◷ Commits 存档')}</div><div class="gal-file-row"><span class="gal-doc-glyph" aria-hidden="true"></span>${hot('README', 'README.md 说明')}</div></div>
        </section>
        <aside class="gal-flash" aria-live="polite">${card}</aside>
      </div>`);
    }
  };

  function animateFigures(root) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [...root.querySelectorAll('[data-gal-count]')];
    if (!items.length) return;
    const started = performance.now();
    function frame(time) {
      if (!root.contains(items[0])) return;
      const progress = Math.min((time - started) / 650, 1);
      items.forEach(item => { item.textContent = format(Math.round(Number(item.dataset.galCount) * (1 - (1 - progress) ** 3))); });
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const number = value => Number.isFinite(value) ? `<span data-gal-count="${value}">${format(value)}</span>` : '—';
  const dateLabel = date => `<span class="gal-date-label">数据快照 ${escape(date)}</span>`;
  function timelineCard(facts, step) {
    const event = facts.gitTimeline[step];
    const milestones = facts.gitTimeline.map((item, index) => {
      const short = String(item.date).replace(/^2005[-年/.]/, '').replaceAll('-', '/');
      return `<button class="gal-milestone ${index === step ? 'is-current' : ''}" type="button" aria-label="${escape(item.date)} ${escape(item.label)}" aria-pressed="${index === step}" data-gal-step="${index}"><i></i><span>${escape(short)}</span></button>`;
    }).join('');
    return `<div class="gal-timeline-card"><div class="gal-timeline-head"><span>Git 的发起人 · Linus</span><span class="gal-mono">${escape(event.date)}</span></div>
      <div class="gal-event"><div><h3>${escape(event.label)}</h3><p>${escape(event.detail)}</p></div>${art('disk')}</div>
      <nav class="gal-milestones" aria-label="Git 诞生时间线">${milestones}</nav></div>`;
  }

  function projectCard(project, date) {
    return `<div class="gal-project-card"><div class="gal-poster-top"><span>开源作品</span>${dateLabel(project.date || date)}</div>
      <div class="gal-project-grid"><div><h3>${escape(project.name)}</h3>
        <div class="gal-big-number">${number(project.stars)}</div><span>颗星标</span></div>
        <div class="gal-project-about">${art('star')}<p>${escape(project.detail || '')}</p></div></div></div>`;
  }
  function openClawCard(project, date) {
    const extra = [ [project.stars, '颗星标'], [project.commits, '次存档'] ].filter(([value]) => Number.isFinite(value));
    const metric = Number.isFinite(project.contributors) ? project.contributors : project.stars;
    const label = Number.isFinite(project.contributors) ? '位贡献者，一起改同一份作品' : '颗星标，大家在关注同一份作品';
    return `<div class="gal-project-card gal-openclaw"><div class="gal-poster-top"><strong>${escape(project.name)} · 个人 AI 助手</strong>${dateLabel(project.date || date)}</div>
      <div class="gal-openclaw-hero"><div class="gal-big-number">${number(metric)}</div><h3>${label}</h3><p class="gal-name-history">改名经过　${(project.names || []).map(escape).join(' → ')}</p></div>
      ${art('butterfly')}<div class="gal-project-stats">${extra.map(([value, name]) => `<span><b>${format(value)}</b> ${name}</span>`).join('')}</div></div>`;
  }
  function scaleCount(value) {
    return typeof value === 'number' && value >= 100000000 ? `${Number((value / 100000000).toFixed(2))} 亿` : escape(value);
  }
  function githubCard(github) {
    return `<div class="gal-scale"><div class="gal-poster-top"><strong>GitHub</strong><span>Octoverse 年度报告 · ${escape(github.year)}</span></div>
      <div class="gal-scale-grid"><div><span>开发者</span><strong>${scaleCount(github.developers)}<small>+</small></strong></div>
      <div><span>仓库</span><strong>${scaleCount(github.repositories)}</strong></div></div>
      <p>${escape(github.acquisitionYear)} 年，微软以 <b>${scaleCount(github.acquisitionUSD)}美元</b> 收购 GitHub。</p></div>`;
  }
  lessons[4] = {
    get steps() {
      const timeline = data().facts?.gitTimeline || [];
      return [...timeline.map(item => item.label), 'OpenClaw', 'DeepSeek', '996.ICU', 'GitHub 的规模'];
    },
    render(root, step) {
      const facts = data().facts;
      if (!facts) { mount(root, '<p>名人堂数据尚未载入。</p>'); return; }
      const index = step - facts.gitTimeline.length;
      let content;
      if (index < 0) content = timelineCard(facts, step);
      else if (index === 0) content = openClawCard(facts.projects.openclaw, facts.snapshotDate);
      else if (index <= 2) content = projectCard(index === 1 ? facts.projects.deepseekV3 : facts.projects.icu996, facts.snapshotDate);
      else content = githubCard(facts.github);
      mount(root, content);
      animateFigures(root);
    }
  };

  const chapterTitles = ['建站', '一夜 11 次', '写作', '换色'];
  const chapterChoice = {};
  const demoRepo = 'my-first-note';
  const accessOptions = {
    private: {name: '私有', detail: '自己和受邀者能看，有写权限才能改。'},
    public: {name: '公开', detail: '所有人能看，有写权限才能改。'}
  };
  let visibility = 'private';
  let uploadFinished = false;
  let sampleReady = false;

  function story(root, chapter) {
    const all = data().commits || [];
    const rows = all.filter(row => Number(row.chapter) === chapter);
    const selected = rows.find(row => row.hash === chapterChoice[chapter]) || rows[0];
    if (!selected) { mount(root, '<p>这一章的存档尚未载入。</p>'); return; }
    const title = chapterTitles[chapter - 1];
    const tabs = chapterTitles.map((name, i) => `<button class="gal-chapter ${chapter === i + 1 ? 'is-current' : ''}" type="button" data-gal-step="${i}" aria-pressed="${chapter === i + 1}">${name}</button>`).join('');
    const added = Number(selected.added) || 0;
    const deleted = Number(selected.deleted) || 0;
    const sum = added + deleted;
    const share = sum ? added / sum * 100 : 0;
    const list = rows.map(row => `<button type="button" class="gal-commit ${row === selected ? 'is-current' : ''}" aria-pressed="${row === selected}" data-commit="${escape(row.hash)}"><i></i><b>${escape(row.hash)}</b><span>${escape(row.date.slice(5).replace('-', '/'))} ${escape(row.time)}</span></button>`).join('');
    mount(root, `<div class="gal-archive"><nav class="gal-chapters" aria-label="选择章节">${tabs}</nav>
      <div class="gal-archive-grid"><section class="gal-history" aria-label="${title}提交记录"><div class="gal-history-title">存档 <b>${rows.length}</b></div><div class="gal-history-list">${list}</div></section>
      <article class="gal-log"><div class="gal-log-meta"><span>belalee-website</span><code>${escape(selected.hash)}</code></div>
      <div class="gal-log-face"><div class="gal-example-body"><div class="gal-ai-prompt" hidden>
        <span>离线示例</span><p><code>${escape(selected.hash)}</code> 改了什么？</p></div>
        <h3 aria-live="polite">${escape(selected.summary)}</h3></div><div class="gal-card-buttons">
          <button type="button" class="gal-flip" data-gal-note aria-pressed="false">想一想 ↗</button>
          <button type="button" class="gal-flip" data-ask-ai aria-pressed="false" aria-label="用提交编号问 AI">问 AI</button></div></div>
      <div class="gal-log-diff"><div class="gal-diff-labels"><span aria-label="增加 ${added} 行"><b>+${format(added)}</b> 行</span><span aria-label="删去 ${deleted} 行"><b>−${format(deleted)}</b> 行</span></div>
      <div class="gal-diff-track" aria-hidden="true" style="--gal-share:${share}%" data-empty="${!sum}"></div></div>
      </article></div></div>`);
    const flip = root.querySelector('[data-gal-note]');
    const ask = root.querySelector('[data-ask-ai]');
    const prompt = root.querySelector('.gal-ai-prompt');
    function showFace(mode) {
      const isNote = mode === 'note';
      const isExample = mode === 'example';
      root.querySelector('.gal-log-face h3').textContent = isNote ? selected.note : selected.summary;
      prompt.hidden = !isExample;
      root.querySelector('.gal-example-body').toggleAttribute('data-ai-example', isExample);
      flip.hidden = isExample;
      flip.setAttribute('aria-pressed', String(isNote));
      ask.setAttribute('aria-pressed', String(isExample));
      ask.setAttribute('aria-label', isExample ? '收起提问示例' : '用提交编号问 AI');
      flip.textContent = isNote ? '看改动 ↶' : '想一想 ↗';
      ask.textContent = isExample ? '↶' : '问 AI';
    }
    flip.addEventListener('click', () => showFace(flip.getAttribute('aria-pressed') === 'true' ? 'summary' : 'note'));
    ask.addEventListener('click', () => showFace(prompt.hidden ? 'example' : 'summary'));
    const listEl = root.querySelector('.gal-history-list');
    const active = listEl.querySelector('.is-current');
    if (active) listEl.scrollTop = Math.max(0, active.offsetTop - listEl.clientHeight / 2 + active.offsetHeight / 2);
    listEl.querySelectorAll('[data-commit]').forEach(button => button.addEventListener('click', () => {
      const scroll = listEl.scrollTop;
      chapterChoice[chapter] = button.dataset.commit;
      story(root, chapter);
      root.querySelector('.gal-history-list').scrollTop = scroll;
      root.querySelector('.gal-commit.is-current').focus({preventScroll: true});
    }));
  }

  function onboarding(root, step) {
    const titles = ['注册', '建仓', '上传'];
    const current = step - 4;
    const tabs = titles.map((name, index) => `<button class="gal-guide-tab ${current === index ? 'is-current' : ''}" data-gal-step="${index + 4}" aria-pressed="${current === index}" type="button"><b>${index + 1}</b>${name}</button>`).join('');
    const access = accessOptions[visibility];
    let screen;
    if (current === 0) screen = `<span class="gal-kicker">Sign up</span><h3>注册一个账号</h3><p>用示例身份练习。</p>${goButton(5, '模拟注册 →')}`;
    else if (current === 1) screen = `<span class="gal-kicker">New repository</span><h3>${demoRepo}</h3>
      <div class="gal-access" role="group" aria-label="谁能看这个仓库">${Object.entries(accessOptions).map(([id, option]) =>
        `<button type="button" class="gal-flip" data-visibility="${id}" aria-pressed="${id === visibility}">${option.name}</button>`).join('')}</div>
      <p data-access aria-live="polite">${access.detail}</p>${goButton(6, '创建仓库 →')}`;
    else if (uploadFinished) screen = `<span class="gal-kicker">Commit changes</span><h3>第一份作品已存档</h3>
      <div class="gal-field"><span>✓</span><code>${demoRepo} / README.md</code></div>
      <p>${access.detail}</p><button class="gal-action" type="button" data-replay>再练一次 ↺</button>`;
    else screen = `<span class="gal-kicker">Upload files</span><h3>${sampleReady ? '已选 README.md' : '分享哪份文件？'}</h3>
      <p data-upload-hint>私人草稿、密钥留在本机。</p>
      <div data-ignore-help id="gal-ignore-help" hidden><p>本地 Git 忽略匹配的未跟踪文件。</p><p>网页上传仍要自己挑。</p></div>
      <div class="gal-card-buttons"><button class="gal-action" type="button" data-upload>${sampleReady ? '提交存档 ✓' : '选 README.md ＋'}</button>
      <button class="gal-flip" type="button" data-ignore aria-expanded="false" aria-controls="gal-ignore-help">.gitignore ？</button></div>`;
    mount(root, `<div class="gal-guide"><nav aria-label="小白三步上手" class="gal-guide-nav">${tabs}</nav><section class="gal-guide-screen">
      <div class="gal-repo-top"><b class="gal-code-mark" aria-hidden="true">&lt;/&gt;</b>
        <strong>${current === 2 ? demoRepo : 'GitHub'}</strong>
        ${current === 2 ? `<b class="gal-visibility-label" data-repo-visibility="${visibility}">${access.name}</b>` : ''}<span>离线模拟</span></div>
      <div class="gal-guide-body"><div>${screen}</div>${art(current === 0 ? 'heart' : current === 1 ? 'disk' : 'disc')}</div></section></div>`);
    root.querySelectorAll('[data-visibility]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.visibility !== visibility) {
        uploadFinished = false;
        sampleReady = false;
      }
      visibility = button.dataset.visibility;
      root.querySelectorAll('[data-visibility]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelector('[data-access]').textContent = accessOptions[visibility].detail;
    }));
    const ignore = root.querySelector('[data-ignore]');
    ignore?.addEventListener('click', () => {
      const help = root.querySelector('[data-ignore-help]');
      help.hidden = !help.hidden;
      root.querySelector('[data-upload-hint]').hidden = !help.hidden;
      ignore.setAttribute('aria-expanded', String(!help.hidden));
    });
    root.querySelector('[data-upload]')?.addEventListener('click', () => {
      if (sampleReady) uploadFinished = true;
      else sampleReady = true;
      onboarding(root, step);
      root.querySelector('[data-upload], [data-replay]')?.focus({preventScroll: true});
    });
    root.querySelector('[data-replay]')?.addEventListener('click', () => {
      uploadFinished = false;
      sampleReady = false;
      visibility = 'private';
      go(4);
    });
  }
  lessons[6] = {
    steps: [...chapterTitles, '注册账号', '新建仓库', '上传文件'],
    render(root, step) { if (step < 4) story(root, step + 1); else onboarding(root, step); }
  };
})();
