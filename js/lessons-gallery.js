(() => {
  'use strict';

  const lessons = (window.BelaLessons ||= {});
  const data = () => window.DATA || {};
  const go = (step) => window.BelaGoStep(step);
  const format = (number) => (Number.isFinite(number) ? number.toLocaleString('en-US') : '—');
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
    );

  function mount(root, html) {
    root.innerHTML = `<div class="gal">${html}</div>`;
    root.querySelectorAll('[data-gal-step]').forEach((button) => {
      button.addEventListener('click', () => go(Number(button.dataset.galStep)));
    });
  }

  /* =========================================================================
   * 第 5 节：不会命令行怎么上手（零代码 + AI 提示词 + 大白话忽略名单 + 私密/公开 + 总结卡）
   * ========================================================================= */
  const ignoreItems = [
    {
      tab: '🔑 密码与 API 额度',
      file: '.env',
      badge: '🚫 绝不上传 · 防盗刷',
      safe: false,
      title: '你的私密密码和 AI 额度（就像银行卡密码）',
      desc: '用 AI 做项目时，API 密钥通常存在 .env 里。千万别传上公开的 GitHub——否则几秒钟就会被别人扫走盗刷扣费！写进 .gitignore 黑名单就能安全留在你电脑里。',
    },
    {
      tab: '📦 几万个临时零件',
      file: 'node_modules/',
      badge: '🚫 不用上传 · 太占空间',
      safe: false,
      title: '电脑自动下载的庞大零件包（没必要备份）',
      desc: '就像搬家不用把快递纸箱也打包带走——这些自动生成的临时文件夹动辄几万个文件，别人拿到项目重新生成就行，放进黑名单能避免仓库被撑爆。',
    },
    {
      tab: '📄 你的作品本身',
      file: 'index.html · README.md',
      badge: '✅ 放心上传 · 核心作品',
      safe: true,
      title: '你真正做出来的网页、小工具与说明书',
      desc: '除了上面两类要拉黑的，剩下的就是你自己的核心作品文件，正常提交存档并上传到 GitHub 就行！',
    },
  ];
  let ignoreIndex = 0;
  let showInstallPrompt = false;
  let showIgnorePrompt = false;
  let showPushPrompt = false;

  let pathAStep = 0;
  let pathAVisibility = 'Private（私有 · 适合自己平时练习）';
  let pathBStep = 0;

  const syncDiagram = (mode) => `
    <div class="gal-sync-diagram">
      <div class="gal-sync-node is-local"><b>💻 本地项目文件夹</b><span>Local (.git)</span></div>
      <div class="gal-sync-arrow">${mode === 'pull' ? '⇠ git pull 拉取更新' : mode === 'clone' ? '⇠ git clone 克隆下载' : 'git push 推送上传 ⇢'}</div>
      <div class="gal-sync-node is-cloud"><b>☁️ GitHub 云端仓库</b><span>Remote (origin)</span></div>
    </div>`;

  lessons[5] = {
    steps: [
      '不会命令行也能用：AI Agent + GitHub 网页端起步',
      '上传前必知：千万别把密码传上 GitHub（.gitignore）',
      '联动方式一：本地推上 GitHub（Private vs Public）',
      '联动方式二：从 GitHub 克隆到本地同步',
      '📸 模块 5 总结：不会命令行怎么上手',
    ],
    render(root, step) {
      if (step === 0) {
        mount(
          root,
          `<div class="gal-setup">
          <div class="gal-desktop-flow">
            <svg viewBox="0 0 1240 160" role="img" aria-label="AI Agent 配合 GitHub 网页端零命令行三步流程图">
              <rect x="8" y="8" width="1224" height="144" rx="24" fill="#eef6ff"/>
              <text x="34" y="42" font-size="18" font-weight="700" fill="#164687">💬 Q&amp;A：不会用命令行还能用 GitHub 吗？完全可以！用 AI Agent 管本地 + GitHub 网页端最直观：</text>
              <rect x="34" y="60" width="356" height="72" rx="16" fill="#ffffff"/>
              <text x="54" y="90" font-size="18" font-weight="700" fill="#164687">① 在 GitHub 网页端建仓</text>
              <text x="54" y="114" font-size="14.5" fill="#4f6787">点右上角 + New repository，一眼看清</text>
              <path d="M400 96 H434" stroke="#1c56a3" stroke-width="3.5"/><polygon points="438,96 426,89 426,103" fill="#1c56a3"/>
              <rect x="446" y="60" width="364" height="72" rx="16" fill="#ffffff"/>
              <text x="466" y="90" font-size="18" font-weight="700" fill="#a31d56">② 发 1 句话给 AI Agent 干活</text>
              <text x="466" y="114" font-size="14.5" fill="#6b4857">不敲黑框命令，让 AI 帮你装 Git、存版本和回退</text>
              <path d="M820 96 H854" stroke="#186b43" stroke-width="3.5"/><polygon points="858,96 846,89 846,103" fill="#186b43"/>
              <rect x="866" y="60" width="340" height="72" rx="16" fill="#186b43"/>
              <text x="888" y="90" font-size="18" font-weight="700" fill="#ffffff">③ 回到 GitHub 网页端验收</text>
              <text x="888" y="114" font-size="14.5" fill="#d2f0e0">刷一下网页看记录、展示作品集 ✓</text>
            </svg>
          </div>
          <div class="gal-setup-grid">
            <article class="gal-setup-card">
              <span class="gal-pill">01 · 让 AI 帮你装 Git</span>
              <h3>不用自己研究安装</h3>
              <p>打开你的 AI Agent 工具，直接发一句话让 AI 帮你装好 Git 并配好名字和邮箱就行。</p>
              <button type="button" class="gal-prompt-toggle" data-toggle-prompt="install">${showInstallPrompt ? '收起提示词 ▴' : '💬 点我看发给 AI 的提示词 ▾'}</button>
              ${showInstallPrompt ? '<div class="gal-prompt-box">「帮我检查电脑有没有装 Git，没装的话请一步步帮我装好，并帮我配好用户名和邮箱。」</div>' : ''}
            </article>
            <article class="gal-setup-card is-hero">
              <span class="gal-pill is-berry">02 · 零代码首选 ★</span>
              <h3>直接用 GitHub 网页端 + AI Agent</h3>
              <p>不用专门折腾功能很空的桌面端！日常存档和推送发一句话让 AI Agent 帮你做，建仓库、看历史和改隐私直接在 GitHub 网页端最直观。</p>
            </article>
            <article class="gal-setup-card">
              <span class="gal-pill">03 · 注册云端主页</span>
              <h3>免费注册 GitHub 网页账号</h3>
              <p>打开 github.com 用常用邮箱免费注册，用来在云端备份你的 AI 小项目，或者打造你的个人求职作品集。</p>
            </article>
          </div>
        </div>`,
        );
        root.querySelector('[data-toggle-prompt="install"]')?.addEventListener('click', () => {
          showInstallPrompt = !showInstallPrompt;
          lessons[5].render(root, 0);
        });
        return;
      }

      if (step === 1) {
        const item = ignoreItems[ignoreIndex];
        const tabs = ignoreItems
          .map(
            (it, i) =>
              `<button type="button" class="gal-ignore-tab${i === ignoreIndex ? ' is-current' : ''}" data-ign="${i}" aria-pressed="${i === ignoreIndex}"><strong>${escape(it.tab)}</strong><span>${it.badge}</span></button>`,
          )
          .join('');
        mount(
          root,
          `<div class="gal-ignore-split">
          <div class="gal-gate-svg">
            <svg viewBox="0 0 560 320" role="img" aria-label="上传前拉黑私密文件示意图">
              <rect x="8" y="8" width="544" height="304" rx="24" fill="#ffffff"/>
              <text x="30" y="42" font-size="19" font-weight="700" fill="#251e23">就像发朋友圈前「遮掉银行卡密码」</text>
              <text x="30" y="68" font-size="14.5" fill="#70626a">.gitignore = 上传 GitHub 前的「不许上传黑名单」</text>

              <rect x="30" y="92" width="150" height="196" rx="18" fill="#f9e1d7"/>
              <text x="105" y="132" text-anchor="middle" font-size="17" font-weight="700" fill="#8f4f0a">💻 你电脑里的文件</text>
              <text x="105" y="166" text-anchor="middle" font-size="14.5" fill="#5e4324">📄 网页与说明书</text>
              <text x="105" y="202" text-anchor="middle" font-size="14.5" font-weight="700" fill="#b01e54">🔑 API 密码 (.env)</text>
              <text x="105" y="234" text-anchor="middle" font-size="14" font-weight="700" fill="#b01e54">📦 临时零件包</text>

              <rect x="218" y="92" width="126" height="196" rx="18" fill="#fde2ee"/>
              <text x="281" y="130" text-anchor="middle" font-size="17" font-weight="700" fill="#a31d56">黑名单</text>
              <text x="281" y="154" text-anchor="middle" font-size="13.5" fill="#6b384e">(.gitignore)</text>
              <rect x="234" y="176" width="94" height="88" rx="12" fill="#ffffff"/>
              <text x="281" y="204" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b01e54">🚫 自动拦下</text>
              <text x="281" y="228" text-anchor="middle" font-size="13" fill="#544650">密码不上传</text>
              <text x="281" y="248" text-anchor="middle" font-size="13" fill="#544650">垃圾不上传</text>

              <path d="M184 156 H212" stroke="#186b43" stroke-width="3.5"/>
              <path d="M350 156 H376" stroke="#186b43" stroke-width="3.5"/><polygon points="380,156 368,149 368,163" fill="#186b43"/>

              <rect x="384" y="92" width="146" height="196" rx="18" fill="#ede6dc"/>
              <text x="457" y="132" text-anchor="middle" font-size="17" font-weight="700" fill="#145a38">☁️ 传上 GitHub</text>
              <text x="457" y="168" text-anchor="middle" font-size="14.5" font-weight="700" fill="#145a38">✅ 只传作品本身</text>
              <text x="457" y="202" text-anchor="middle" font-size="14" fill="#2b5e44">网页源码</text>
              <text x="457" y="226" text-anchor="middle" font-size="14" fill="#2b5e44">README 说明书</text>
              <text x="457" y="260" text-anchor="middle" font-size="13.5" font-weight="700" fill="#145a38">安全零泄露 ✓</text>
            </svg>
          </div>
          <div class="gal-ignore-right">
            <div class="gal-ignore-tabs" aria-label="点选查看哪些文件不能传">${tabs}</div>
            <div class="gal-ignore-card ${item.safe ? 'is-safe' : 'is-warn'}">
              <div class="gal-ignore-head">
                <code>${escape(item.file)}</code>
                <b>${item.badge}</b>
              </div>
              <h3>${escape(item.title)}</h3>
              <p>${escape(item.desc)}</p>
              <div class="gal-prompt-area">
                <button type="button" class="gal-prompt-toggle" data-toggle-prompt="ignore">${showIgnorePrompt ? '收起 AI 提示词 ▴' : '💬 不用自己写！点我看发给 AI 的 1 句话 ▾'}</button>
                ${showIgnorePrompt ? '<div class="gal-prompt-box">「帮我在这个项目里配好 .gitignore，把存 API 密钥的 .env 和临时依赖文件夹都排除掉，千万别传上 GitHub。」</div>' : ''}
              </div>
            </div>
          </div>
        </div>`,
        );
        root.querySelector('[data-toggle-prompt="ignore"]')?.addEventListener('click', () => {
          showIgnorePrompt = !showIgnorePrompt;
          lessons[5].render(root, 1);
        });
        root.querySelectorAll('[data-ign]').forEach((btn) =>
          btn.addEventListener('click', () => {
            ignoreIndex = Number(btn.dataset.ign);
            lessons[5].render(root, 1);
            root.querySelector('[data-ign][aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      if (step === 2) {
        const stepsA = [
          {
            kicker: 'Step 1 / 3 · 本地初始化',
            title: '先把本地文件夹变成 Git 仓库',
            desc: '在 GitHub Desktop 桌面版或编辑器里打开你的项目文件夹，点击 Initialize Repository 并提交第一版存档。',
            btn: '完成本地初始化，去建云端仓库 →',
          },
          {
            kicker: 'Step 2 / 3 · Q&A：Public 跟 Private 怎么选？',
            title: '自己练习选 Private，做作品集展示选 Public',
            desc: '如果是自己练习直接选 Private（私密）就可以；如果之后想把项目做成作品集，Public 会更方便别人查看（后续随时可互转）：',
            extra: `<div class="gal-vis-row">
              <button type="button" class="gal-flip" data-vis="Private（私有 · 适合自己平时练习）" aria-pressed="${pathAVisibility.startsWith('Private')}">🔒 Private 私有（自己练习）</button>
              <button type="button" class="gal-flip" data-vis="Public（公开 · 适合做求职作品集展示）" aria-pressed="${pathAVisibility.startsWith('Public')}">🌐 Public 公开（作品集展示）</button>
            </div>`,
            btn: '选好权限，一键推送上云端 →',
          },
          {
            kicker: 'Step 3 / 3 · git push 完成！',
            title: '第一份作品已推上 GitHub 仓库',
            desc: `已成功推送到云端！当前权限：${pathAVisibility}（后续在 Settings 里随时可以改成公开或私密）。`,
            extra: '<div class="gal-field"><span>✓</span> belalee / my-first-ai-app · 已同步到云端</div>',
            btn: '再走一遍推送流程 ↺',
          },
        ];
        const cur = stepsA[pathAStep];
        mount(
          root,
          `<div class="gal-guide">
          <nav class="gal-guide-nav" aria-label="本地推上 GitHub 三步">
            ${['1. 本地初始化', '2. 选 Private / Public', '3. 推送上线'].map(
              (n, i) =>
                `<button type="button" class="gal-guide-tab${i === pathAStep ? ' is-current' : ''}" data-pa="${i}" aria-pressed="${i === pathAStep}">${n}</button>`,
            ).join('')}
          </nav>
          <section class="gal-guide-screen">
            <div class="gal- guide-body gal-guide-body">
              <div>
                <span class="gal-kicker">${cur.kicker}</span>
                <h3>${cur.title}</h3>
                <p>${cur.desc}</p>
                ${cur.extra || ''}
                <div class="gal-card-buttons">
                  <button type="button" class="gal-action" data-pa-next>${cur.btn}</button>
                  <button type="button" class="gal-prompt-toggle" data-toggle-prompt="push">${showPushPrompt ? '收起提示词 ▴' : '💬 让 AI 帮我推上去 ▾'}</button>
                </div>
                ${showPushPrompt ? '<div class="gal-prompt-box">「帮我把这个文件夹初始化成 Git 仓库，关联到我的 GitHub 仓库地址，并把第一版代码 push 上传。」</div>' : ''}
              </div>
              ${syncDiagram('push')}
            </div>
          </section>
        </div>`,
        );
        root.querySelectorAll('[data-pa]').forEach((btn) =>
          btn.addEventListener('click', () => {
            pathAStep = Number(btn.dataset.pa);
            lessons[5].render(root, 2);
          }),
        );
        root.querySelectorAll('[data-vis]').forEach((btn) =>
          btn.addEventListener('click', () => {
            pathAVisibility = btn.dataset.vis;
            lessons[5].render(root, 2);
          }),
        );
        root.querySelector('[data-pa-next]')?.addEventListener('click', () => {
          pathAStep = (pathAStep + 1) % 3;
          lessons[5].render(root, 2);
        });
        root.querySelector('[data-toggle-prompt="push"]')?.addEventListener('click', () => {
          showPushPrompt = !showPushPrompt;
          lessons[5].render(root, 2);
        });
        return;
      }

      if (step === 3) {
        const stepsB = [
          {
            kicker: 'Step 1 / 3 · Clone 下载',
            mode: 'clone',
            title: '在 GitHub 建好仓，直接克隆到电脑',
            desc: '在 GitHub 点绿色「<> Code」按钮（或点 Open with GitHub Desktop），整座仓库连同历史版本就搬到你电脑上了。',
            field: '📋 https://github.com/belalee-ai/my-first-ai-app.git',
            btn: '模拟克隆到电脑 →',
          },
          {
            kicker: 'Step 2 / 3 · Pull 拉回更新',
            mode: 'pull',
            title: '云端有新改动？开工前先拉取（Pull）',
            desc: '如果云端有新改动，桌面版顶部会出现「Pull origin」提示。点一下就能把最新修改同步回你电脑。',
            field: '↓ 1 · 云端 origin/main 有 1 次新提交',
            btn: '点击拉回最新改动 →',
          },
          {
            kicker: 'Step 3 / 3 · Push 推回云端',
            mode: 'push',
            title: '本地改好存了档，一键推送同步！',
            desc: '你在电脑上完成了新一次 Commit，点一下 Push origin，本地和 GitHub 云端就完全对齐了！',
            field: '✓ 已同步：本地 main 与云端 origin/main 处于同一版本',
            btn: '再练一次双向同步 ↺',
          },
        ];
        const curB = stepsB[pathBStep];
        mount(
          root,
          `<div class="gal-guide">
          <nav class="gal-guide-nav" aria-label="从 GitHub 克隆并同步三步">
            ${['1. Clone 克隆到电脑', '2. Pull 拉取更新', '3. Push 推回云端'].map(
              (n, i) =>
                `<button type="button" class="gal-guide-tab${i === pathBStep ? ' is-current' : ''}" data-pb="${i}" aria-pressed="${i === pathBStep}">${n}</button>`,
            ).join('')}
          </nav>
          <section class="gal-guide-screen">
            <div class="gal-guide-body">
              <div>
                <span class="gal-kicker">${curB.kicker}</span>
                <h3>${curB.title}</h3>
                <p>${curB.desc}</p>
                <div class="gal-field">${curB.field}</div>
                <button type="button" class="gal-action" data-pb-next>${curB.btn}</button>
              </div>
              ${syncDiagram(curB.mode)}
            </div>
          </section>
        </div>`,
        );
        root.querySelectorAll('[data-pb]').forEach((btn) =>
          btn.addEventListener('click', () => {
            pathBStep = Number(btn.dataset.pb);
            lessons[5].render(root, 3);
          }),
        );
        root.querySelector('[data-pb-next]')?.addEventListener('click', () => {
          pathBStep = (pathBStep + 1) % 3;
          lessons[5].render(root, 3);
        });
        return;
      }

      mount(
        root,
        `<div class="gal-mod-summary">
        <div class="gal-sum-top">
          <div class="gal-sum-bar">
            <span class="gal-sum-pill">📸 模块 05 总结 · 不会命令行怎么上手</span>
            <strong>不会命令用桌面版，先建直觉不焦虑；自己练习选 Private，作品集展示选 Public。</strong>
          </div>
          <svg viewBox="0 0 1160 116" role="img" aria-label="零命令行建仓上传三步流程图">
            <rect x="10" y="12" width="356" height="92" rx="20" fill="#ddeaf6"/>
            <text x="32" y="46" font-size="18" font-weight="700" fill="#164687">① GitHub Desktop 零代码起步</text>
            <text x="32" y="76" font-size="16" fill="#325585">点可视化按钮完成：建仓库 → 提交版本 → 回退</text>
            <path d="M374 58 H414" stroke="#c83271" stroke-width="3.5"/><polygon points="418,58 406,51 406,65" fill="#c83271"/>
            <rect x="426" y="12" width="356" height="92" rx="20" fill="#f8d8e6"/>
            <text x="448" y="46" font-size="18" font-weight="700" fill="#a81d58">② .gitignore 安检门拦住密钥</text>
            <text x="448" y="76" font-size="16" fill="#5e3447">.env（API 密钥）与 node_modules 留在本地不上传</text>
            <path d="M790 58 H830" stroke="#186b43" stroke-width="3.5"/><polygon points="834,58 822,51 822,65" fill="#186b43"/>
            <rect x="842" y="12" width="308" height="92" rx="20" fill="#ede6dc"/>
            <text x="864" y="46" font-size="18" font-weight="700" fill="#145a38">③ Private 练习 ⇄ Public 展示</text>
            <text x="864" y="76" font-size="16" fill="#2b5e44">平时练习选私密，做求职作品集转公开（随时可改）</text>
          </svg>
        </div>
        <div class="gal-sum-cards">
          <article class="is-rose"><b>01 · 不会命令行能用吗？</b><p>完全可以！初学先用 GitHub Desktop 桌面版建立仓库、提交与回退的理解，不用一上来就学命令。</p></article>
          <article class="is-butter"><b>02 · Private 和 Public 怎么选？</b><p>自己平时练习直接选 Private；之后想做成作品集方便别人或面试官查看，再选 Public。</p></article>
          <article class="is-sage"><b>03 · 上传前必看一眼 .gitignore</b><p>让 AI 帮你配好 .gitignore，把存 API Key 的 .env 拦在本地，保护账号额度安全。</p></article>
        </div>
      </div>`,
      );
    },
  };

  /* =========================================================================
   * 第 6 节：作品集表达与终极总结
   * ========================================================================= */
  const hotspots = [
    {
      key: 'intro',
      badge: '🚫 破除误区 5 · GitHub 不只是存代码的地方',
      title: 'README、版本记录与 Issue 都是「项目表达」',
      copy: '不要把 GitHub 只当成存代码的地方！如果你想把 GitHub 上的项目作为个人求职的作品集，面试官会重点考察你的 README 说明书、清晰的提交记录（Commits）以及 Issue 思考过程。',
    },
    {
      key: 'star',
      badge: 'Star · 点赞加收藏',
      title: '像给小红书笔记点「赞 + 收藏」',
      copy: '看到好用的开源 AI 工具就点颗星，既代表项目热度，也会收进你的星标夹方便随时找回。',
    },
    {
      key: 'fork',
      badge: 'Fork · 复刻二创',
      title: '像「拍同款」一样复制到自己名下',
      copy: '把别人的开源仓库完整复制一份到自己账号下，随便你怎么改，绝对不会影响原作者的仓库。',
    },
    {
      key: 'issue',
      badge: '★ 作品集加分项 · Issues 讨论与规划',
      title: '展示你的问题拆解与产品思考',
      copy: 'Issue 不仅能向开源作者提问题，你在自己项目里记录的待办规划与 Bug 复盘，也是面试官看重的项目表达！',
    },
    {
      key: 'pr',
      badge: 'Pull request (PR)',
      title: '给开源项目「递交修改申请」',
      copy: '你在分支上改好了内容，发起 PR 请原作者审核合并——哪怕帮开源项目修一个错别字，也能成为全球开源贡献者！',
    },
    {
      key: 'readme',
      badge: '★ 求职作品集门面 · README.md 说明书',
      title: '面试官打开你仓库第一眼看的地方',
      copy: '写清楚「这个项目解决什么痛点、怎么体验、放上效果截图」。写好 README，不懂代码的人也能看懂你的作品价值！',
    },
    {
      key: 'commits',
      badge: '★ 工程思维证明 · Commits 版本记录',
      title: '证明你是「一步步迭代」做出来的',
      copy: '一条条写清楚备注的 Commit 历史，直接向面试官证明你具备清晰的 Vibe Coding 工程思维，而不是随便复制粘贴。',
    },
    {
      key: 'releases',
      badge: 'Releases · 成品下载区',
      title: '普通用户直接下载安装包的地方',
      copy: '逛开源软件时不用看满屏代码，直接点右侧 Releases 就能下载打包好的 Mac `.dmg` 或 Windows `.exe` 安装包！',
    },
  ];
  let activeHotspot = 0;
  let activeCase = 'openclaw';

  const myths = [
    [
      '误区 1：等项目全做完，最后再去用 GitHub',
      '越早开始越好！等项目已经乱了再去整理版本，难度会高很多。',
    ],
    [
      '误区 2：AI 一改完代码，看都不看直接提交',
      '要先进行相关测试，确认没问题之后，再把新版本提交上去。',
    ],
    [
      '误区 3：提交信息为了偷懒随便写「111」「改了一下」',
      '会导致目标非常不清晰，回头根本不知道每个版本具体做了什么修改。',
    ],
    [
      '误区 4：什么大的改动都在主分支（main）上做',
      '主分支适合放相对稳定的版本；要做大改动，建议新开一条分支去实验。',
    ],
    [
      '误区 5：把 GitHub 当成只是储存代码的地方',
      'README、版本记录与 Issue 都是项目表达的一部分，求职作品集面试官会着重考察。',
    ],
    [
      '误区 6：觉得自己不会代码，就等于不需要学',
      '恰恰相反！越是借助 AI 做项目的同学，越要学工程思维，用 GitHub 管理 AI 带来的混乱和不确定性。',
    ],
  ];

  const faqs = [
    [
      '问题 1 · Git 和 GitHub 是一回事吗？',
      '不是完全一回事！Git 更像装在电脑里的版本控制工具；GitHub 是一个基于 Git 的代码托管平台。',
    ],
    [
      '问题 2 · 我不会用命令行，还能用 GitHub 吗？',
      '完全可以！初学阶段完全可以先从 GitHub 桌面版（GitHub Desktop）开始，先建立仓库→提交→回退的理解，不一定要一上来就学代码。',
    ],
    [
      '问题 3 · 我只是做 AI 小工具，也需要 GitHub 吗？',
      '非常建议一开始就养成习惯！做小工具更容易在需求改变时把版本改乱，GitHub 能很好解决这个问题，而且完全免费。',
    ],
    [
      '问题 4 · Public 跟 Private 怎么选？什么时候开分支？',
      '自己练习直接选 Private；想做成作品集方便别人查看就选 Public（后续随时可互转）。遇到大改动时就新开分支实验！',
    ],
  ];
  let mythTab = 'myths';

  const chapterTitles = ['① 建站', '② 一夜 11 次', '③ 写文章配图', '④ 换色与拆工具'];
  const chapterLinkTag = {
    1: '🔗 对应模块 5：从第 1 天建仓提交 Initial commit',
    2: '🔗 对应模块 2 & 5：AI 小步测试提交 + .gitignore 清理',
    3: '🔗 对应模块 3：每次提交都写清具体改了什么',
    4: '🔗 对应模块 2 & 4：有历史版本兜底，才敢大胆改版换色',
  };
  const chapterChoice = {};

  function renderCommits(root, chapter) {
    const all = data().commits || [];
    const rows = all.filter((row) => Number(row.chapter) === chapter);
    const selected = rows.find((row) => row.hash === chapterChoice[chapter]) || rows[0];
    if (!selected) {
      mount(root, '<p>这一章的存档尚未载入。</p>');
      return;
    }
    const tabs = chapterTitles
      .map(
        (name, i) =>
          `<button class="gal-chapter ${chapter === i + 1 ? 'is-current' : ''}" type="button" data-gal-step="${i + 3}" aria-pressed="${chapter === i + 1}">${name}</button>`,
      )
      .join('');
    const added = Number(selected.added) || 0;
    const deleted = Number(selected.deleted) || 0;
    const sum = added + deleted;
    const share = sum ? (added / sum) * 100 : 0;
    const list = rows
      .map(
        (row) => `
      <button type="button" class="gal-commit ${row === selected ? 'is-current' : ''}" aria-pressed="${row === selected}" data-commit="${escape(row.hash)}">
        <i></i>
        <div class="gal-commit-text">
          <strong>${escape(row.summary)}</strong>
          <span><code>#${escape(row.hash)}</code> · ${escape(row.date.slice(5).replace('-', '/'))} ${escape(row.time)}</span>
        </div>
      </button>`,
      )
      .join('');

    mount(
      root,
      `<div class="gal-archive">
      <div class="gal-archive-top">
        <nav class="gal-chapters" aria-label="选择章节">${tabs}</nav>
        <span class="gal-link-tag">${chapterLinkTag[chapter]}</span>
      </div>
      <div class="gal-archive-grid">
        <section class="gal-history" aria-label="提交记录列表">
          <div class="gal-history-title"><span>belalee-website 真实提交记录</span><b>${rows.length} 条</b></div>
          <div class="gal-history-list">${list}</div>
        </section>
        <article class="gal-log">
          <div class="gal-log-meta"><span>个人网站迭代账本</span><code>#${escape(selected.hash)} · ${escape(selected.date)} ${escape(selected.time)}</code></div>
          <div class="gal-log-face">
            <h3>${escape(selected.summary)}</h3>
            <p class="gal-log-note"><b>💡 贝拉复盘：</b>${escape(selected.note)}</p>
            <p class="gal-log-subject"><span>提交备注：</span><code>${escape(selected.subject)}</code></p>
          </div>
          <div class="gal-log-diff">
            <div class="gal-diff-labels"><span aria-label="增加 ${added} 行">新增 <b>+${format(added)}</b> 行</span><span aria-label="删去 ${deleted} 行">删去 <b>−${format(deleted)}</b> 行</span></div>
            <div class="gal-diff-track" aria-hidden="true" style="--gal-share:${share}%" data-empty="${!sum}"></div>
          </div>
        </article>
      </div>
    </div>`,
    );

    const listEl = root.querySelector('.gal-history-list');
    const active = listEl.querySelector('.is-current');
    if (active)
      listEl.scrollTop = Math.max(
        0,
        active.offsetTop - listEl.clientHeight / 2 + active.offsetHeight / 2,
      );
    listEl.querySelectorAll('[data-commit]').forEach((button) =>
      button.addEventListener('click', () => {
        const scroll = listEl.scrollTop;
        chapterChoice[chapter] = button.dataset.commit;
        renderCommits(root, chapter);
        root.querySelector('.gal-history-list').scrollTop = scroll;
        root.querySelector('.gal-commit.is-current')?.focus({ preventScroll: true });
      }),
    );
  }

  lessons[6] = {
    steps: [
      'GitHub 仓库拆解 + 误区 5：它不只是存代码的地方',
      '开源协作 4 步流程图 & 热门开源项目数据图',
      '新手 6 大常见误区 × 4 个高频提问 Q&A 总表',
      '贝拉个人网站 28 次真实存档 · 建站',
      '贝拉个人网站 28 次真实存档 · 一夜 11 次',
      '贝拉个人网站 28 次真实存档 · 写文章配图',
      '贝拉个人网站 28 次真实存档 · 换色与拆工具',
      '🏆 全课程终极总结：Vibe Coding 工程思维与行动清单',
    ],
    render(root, step) {
      if (step === 0) {
        const selected = hotspots[activeHotspot];
        const hot = (idx, label) =>
          `<button class="gal-hot${idx === activeHotspot ? ' is-current' : ''}" type="button" aria-pressed="${idx === activeHotspot}" data-hot="${idx}">${label}</button>`;
        mount(
          root,
          `<div class="gal-repo-layout">
          <section aria-label="本地模拟仓库" class="gal-repo">
            <div class="gal-repo-top"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="#24292F" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg><strong>GitHub 仓库结构图</strong><span>点任意按钮看求职作品集看点</span></div>
            <div class="gal-repo-name"><span>belalee-ai /</span><strong>bela-know-git-and-github</strong></div>
            <div class="gal-repo-tools">${hot(1, '☆ Star 收藏')}${hot(2, '⑂ Fork 复刻')}${hot(7, '🏷 Releases 下载')}</div>
            <div class="gal-repo-tabs"><span class="gal-code-tab">Code 代码</span>${hot(3, '★ Issues 讨论与思考')}${hot(4, 'Pull requests 投稿')}</div>
            <div class="gal-file-box">
              <div class="gal-file-head"><span>⑂ main 主分支</span>${hot(6, '★ Commits 版本记录')}</div>
              <div class="gal-file-row"><span class="gal-doc-glyph" aria-hidden="true"></span>${hot(5, '★ README.md 项目门面说明书')}<span class="gal-file-date">面试官必看</span></div>
            </div>
          </section>
          <aside class="gal-flash" aria-live="polite">
            <div class="gal-flash-contents">
              <span class="gal-pill is-berry">${selected.badge}</span>
              <h3>${selected.title}</h3>
              <p>${selected.copy}</p>
            </div>
          </aside>
        </div>`,
        );
        root.querySelectorAll('[data-hot]').forEach((btn) =>
          btn.addEventListener('click', () => {
            activeHotspot = Number(btn.dataset.hot);
            lessons[6].render(root, 0);
            root.querySelector('[data-hot][aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      if (step === 1) {
        const facts = data().facts;
        const projects = facts?.projects || {};
        const cases = [
          {
            key: 'openclaw',
            label: 'OpenClaw · 39.4万星',
            p: projects.openclaw,
            ticks: 22,
            starText: '394,742 ★',
            subText: '3,808 位贡献者 · 130,026 次提交',
          },
          {
            key: 'icu996',
            label: '996.ICU · 27.7万星',
            p: projects.icu996,
            ticks: 16,
            starText: '277,238 ★',
            subText: '非代码文档仓库 · 全球多语种协作',
          },
          {
            key: 'deepseekV3',
            label: 'DeepSeek-V3 · 10.4万星',
            p: projects.deepseekV3,
            ticks: 9,
            starText: '104,865 ★',
            subText: '开源大模型 · 联动 R1 (92,045 ★)',
          },
        ];
        const cur = cases.find((c) => c.key === activeCase) || cases[0];
        const chartRows = cases
          .map((c, idx) => {
            const y = 34 + idx * 54;
            const isSel = c.key === cur.key;
            const color = isSel ? '#081F5C' : '#7096D1';
            let rects = '';
            for (let t = 0; t < 22; t++) {
              const x = 185 + t * 14.5;
              rects += `<rect x="${x}" y="${y - 14}" width="11" height="22" rx="3.5" fill="${t < c.ticks ? color : '#E3EAF4'}" />`;
            }
            return `
            <line x1="10" y1="${y + 18}" x2="625" y2="${y + 18}" stroke="#DEDDD6" stroke-width="0.8" />
            <text x="12" y="${y - 1}" font-size="15" font-weight="${isSel ? '800' : '650'}" fill="#081F5C">${c.p?.name || c.key}</text>
            <text x="12" y="${y + 14}" font-size="11.5" fill="#5b6b8c">${c.subText}</text>
            ${rects}
            <text x="618" y="${y + 4}" text-anchor="end" font-size="17" font-weight="800" fill="${color}">${c.starText}</text>
          `;
          })
          .join('');

        mount(
          root,
          `<div class="gal-collab">
          <div class="gal-collab-steps">
            <div class="is-sky"><b>① Fork 复刻</b><span>复制到自己账号下</span></div>
            <i>→</i>
            <div class="is-butter"><b>② Branch 开分支改</b><span>在分支修改并 Commit</span></div>
            <i>→</i>
            <div class="is-rose"><b>③ 发起 PR</b><span>递交合并申请给原作者</span></div>
            <i>→</i>
            <div class="is-sage"><b>④ Merge 合并</b><span>审核通过合入主线 ✓</span></div>
          </div>
          <div class="gal-case-split">
            <div class="gal-case-left">
              <div class="gal-case-tabs" aria-label="选择开源案例">${cases
                .map(
                  (c) =>
                    `<button type="button" class="gal-case-tab${c.key === activeCase ? ' is-current' : ''}" data-case="${c.key}" aria-pressed="${c.key === activeCase}">${c.label}</button>`,
                )
                .join('')}</div>
              <div class="gal-case-copy">
                <h3>${escape(cur.p?.name)} · ${escape(cur.p?.label || '')}</h3>
                <p>${escape(cur.p?.detail || '')}</p>
              </div>
            </div>
            <div class="gal-lf-box">
              <div class="gal-lf-title">现象级开源项目星标对比：不用写大程序，文档与 AI 工具都能全球共创</div>
              <div class="gal-lf-sub">深蓝高亮 = 当前查看案例 · 刻度 = Star 星标量级（PORCELAIN 蓝阶）</div>
              <svg viewBox="0 0 635 170" role="img" aria-label="开源项目星标对比刻度条形图">${chartRows}</svg>
              <div class="gal-lf-src">F5 TICK ROWS · LUPI BASICS · SOURCE: GITHUB SNAPSHOT ${escape(facts?.snapshotDate || '2026-03-31')}</div>
            </div>
          </div>
        </div>`,
        );
        root.querySelectorAll('[data-case]').forEach((btn) =>
          btn.addEventListener('click', () => {
            activeCase = btn.dataset.case;
            lessons[6].render(root, 1);
            root.querySelector('[data-case][aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      if (step === 2) {
        const isFaq = mythTab === 'faqs';
        const body = isFaq
          ? `<div class="gal-faq-grid">${faqs
              .map(
                ([q, a], i) => `
              <article class="gal-faq-card tone-${i + 1}">
                <strong>${escape(q)}</strong>
                <p>${escape(a)}</p>
              </article>`,
              )
              .join('')}</div>`
          : `<div class="gal-myth-grid">${myths
              .map(
                ([bad, good]) => `
              <article class="gal-myth-card">
                <div class="gal-myth-bad"><span>✕ 误区</span><b>${escape(bad)}</b></div>
                <div class="gal-myth-good"><span>✓ 正解</span><p>${escape(good)}</p></div>
              </article>`,
              )
              .join('')}</div>`;
        mount(
          root,
          `<div class="gal-myths">
          <div class="gal-myth-bar">
            <div class="gal-seg">
              <button type="button" data-mtab="myths" aria-pressed="${!isFaq}">🚫 新手 6 大常见误区汇总</button>
              <button type="button" data-mtab="faqs" aria-pressed="${isFaq}">💬 第一次接触最常问的 4 个问题</button>
            </div>
            <span class="gal-link-tag">📸 可直接截图保存避坑</span>
          </div>
          ${body}
        </div>`,
        );
        root.querySelectorAll('[data-mtab]').forEach((btn) =>
          btn.addEventListener('click', () => {
            mythTab = btn.dataset.mtab;
            lessons[6].render(root, 2);
          }),
        );
        return;
      }

      if (step >= 3 && step <= 6) {
        renderCommits(root, step - 2);
        return;
      }

      mount(
        root,
        `<div class="gal-action-guide">
        <div class="gal-finale-diagram">
          <div class="gal-finale-head">
            <span class="gal-sum-pill">🏆 全课程终极总结 · 破除误区 6（不会代码 ≠ 不需要学）</span>
            <strong>文科生学 GitHub，本质上不是为了成为程序员，而是为了让 Vibe Coding 写出来的项目变得：</strong>
          </div>
          <svg viewBox="0 0 1180 112" role="img" aria-label="Vibe Coding 工程思维四大价值流程图">
            <rect x="8" y="10" width="272" height="92" rx="20" fill="#f9e1d7"/>
            <text x="28" y="46" font-size="21" font-weight="750" fill="#8f4f0a">🎛️ 更加可控</text>
            <text x="28" y="76" font-size="15.5" fill="#5e4324">第1天就建仓，告别7个最终版混乱</text>
            <path d="M286 56 H304" stroke="#9e8c96" stroke-width="3"/>
            <rect x="310" y="10" width="272" height="92" rx="20" fill="#f8d8e6"/>
            <text x="330" y="46" font-size="21" font-weight="750" fill="#a81d58">⏪ 更加可回退</text>
            <text x="330" y="76" font-size="15.5" fill="#5e3447">AI改完先测试再交，崩了一秒退回</text>
            <path d="M588 56 H606" stroke="#9e8c96" stroke-width="3"/>
            <rect x="612" y="10" width="272" height="92" rx="20" fill="#ede6dc"/>
            <text x="632" y="46" font-size="21" font-weight="750" fill="#145a38">🌿 更加可迭代</text>
            <text x="632" y="76" font-size="15.5" fill="#2b5e44">主分支放稳定版，大改新开分支试</text>
            <path d="M890 56 H908" stroke="#9e8c96" stroke-width="3"/>
            <rect x="914" y="10" width="258" height="92" rx="20" fill="#ddeaf6"/>
            <text x="934" y="46" font-size="21" font-weight="750" fill="#164687">🌟 更加可展示</text>
            <text x="934" y="76" font-size="15.5" fill="#325585">README+版本记录=求职作品集</text>
          </svg>
        </div>
        <div class="gal-tier-grid">
          <article class="gal-tier is-now">
            <span class="gal-tier-badge">🟢 今天就能直接开干（够用 80%）</span>
            <h3>先用桌面版养成这 4 个习惯</h3>
            <ul>
              <li>新建 AI 项目第 1 天就开 Git，练习选 <b>Private</b></li>
              <li>AI 改完<b>先测试确认没问题</b>，再写清备注 <b>Commit</b></li>
              <li>要让 AI 大改结构前，先<b>新开一条分支（Branch）</b></li>
              <li>配好 <b>.gitignore</b> 拦住密钥，做好后转 <b>Public</b> 当作品集</li>
            </ul>
          </article>
          <article class="gal-tier is-later">
            <span class="gal-tier-badge">🟡 用到再查 · 干中进阶</span>
            <h3>混个眼熟即可</h3>
            <ul>
              <li>多人改同一行触发冲突（<code>Conflict</code>）</li>
              <li>已推上网的错误用 <code>Revert</code> 反向抵消</li>
              <li>给喜欢的开源项目 <code>Fork → PR</code></li>
            </ul>
          </article>
          <article class="gal-tier is-skip">
            <span class="gal-tier-badge">⚪ 现在完全不用焦虑</span>
            <h3>大胆先跳过</h3>
            <ul>
              <li>死记硬背满屏终端命令行</li>
              <li><code>rebase</code> 变基、<code>cherry-pick</code> 等复杂指令</li>
              <li>后续我还会继续带大家实战工程思维与好玩开源项目！</li>
            </ul>
          </article>
        </div>
      </div>`,
      );
    },
  };
})();
