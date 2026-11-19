(() => {
  'use strict';

  const lessons = (window.BelaLessons ||= {});
  const data = () => window.DATA || {};
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
    );
  const action = (label, command, secondary = false) =>
    `<button type="button" class="ws-button${secondary ? ' ws-secondary' : ''}" data-ws-action="${command}">${label}</button>`;

  function screen(root, className, contents) {
    root.innerHTML = `<div class="ws-screen ${className}">${contents}</div>`;
    return root.firstElementChild;
  }

  function nextOnClick(container, step) {
    container
      .querySelector('[data-ws-action="next"]')
      ?.addEventListener('click', () => window.BelaGoStep(step + 1));
  }

  /* Spacious 2-part Module Summary Card (Flowchart Top + 3 Cards Bottom) */
  function renderSummaryCard(root, spec) {
    const tones = ['is-rose', 'is-butter', 'is-sage'];
    screen(
      root,
      'ws-mod-summary',
      `
      <div class="ws-sum-diagram">
        <div class="ws-sum-bar">
          <span class="ws-sum-pill">📸 ${escape(spec.badge)}</span>
          <strong>${escape(spec.mantra)}</strong>
        </div>
        ${spec.svg}
      </div>
      <div class="ws-sum-grid">
        ${spec.points
          .map(
            (pt, i) => `
          <article class="ws-sum-card ${tones[i % tones.length]}">
            <span class="ws-sum-num">0${i + 1}</span>
            <div>
              <strong>${escape(pt.title)}</strong>
              <p>${escape(pt.body)}</p>
            </div>
          </article>`,
          )
          .join('')}
      </div>`,
    );
  }

  /* =========================================================================
   * 第 1 节：认识 Git 与诞生记
   * ========================================================================= */
  lessons[1] = {
    get steps() {
      const timeline = data().facts?.gitTimeline || [];
      return [
        '大家都在问的 4 个真实痛点提问',
        '没有 Git 时的两个崩溃瞬间',
        '一张流程图分清 Git 与 GitHub',
        ...timeline.map((item) => `Git 诞生记 · ${item.date}`),
        '2008 · GitHub 登场与全球规模',
        '📸 模块 1 总结：认识 Git 与诞生记',
      ];
    },
    render(root, step) {
      const facts = data().facts;
      const timeline = facts?.gitTimeline || [];

      if (step === 0) {
        screen(
          root,
          'ws-qwall',
          `
          <div class="ws-qwall-grid">
            <article class="ws-qcard is-rose">
              <div class="ws-qhead"><span class="ws-qavatar">林</span><b>@文科转AI的小林</b><em>高频提问 #1</em></div>
              <h3>「Git 和 GitHub 是一回事吗？为什么教程里一会儿装 Git、一会儿又去注册 GitHub？」</h3>
              <p>✅ <b>不是一回事！</b>Git 是装在电脑里的版本控制工具；GitHub 是基于 Git 的云端托管网站。</p>
            </article>
            <article class="ws-qcard is-butter">
              <div class="ws-qhead"><span class="ws-qavatar">M</span><b>@做AI小工具的阿May</b><em>高频提问 #2</em></div>
              <h3>「我只是用 AI 做个小工具，也需要上 GitHub 吗？等整个项目做完再传不行吗？」</h3>
              <p>✅ <b>越早用越好！</b>小工具需求边想边变最容易改乱，从第 1 天留档才可控，而且完全免费。</p>
            </article>
            <article class="ws-qcard is-sky">
              <div class="ws-qhead"><span class="ws-qavatar">栗</span><b>@刚上手AI工具的栗子</b><em>高频提问 #3</em></div>
              <h3>「完全不会用黑框命令行，我还能用 GitHub 吗？AI 刚才把页面改崩了怎么退回？」</h3>
              <p>✅ <b>完全可以！</b>直接用中文给 AI Agent 发提示词 + GitHub 网页端配合，不用背命令行。</p>
            </article>
            <article class="ws-qcard is-sage">
              <div class="ws-qhead"><span class="ws-qavatar">K</span><b>@求职作品集的Kiki</b><em>高频提问 #4</em></div>
              <h3>「仓库选 Public 还是 Private？不写代码的话，面试官看我的 GitHub 到底看什么？」</h3>
              <p>✅ <b>练习选 Private，作品集选 Public！</b>面试官重点看 README 说明书、版本记录和思考过程。</p>
            </article>
          </div>`,
        );
        return;
      }

      if (step === 1) {
        screen(
          root,
          'ws-pain-grid',
          `
          <article class="ws-pain-card">
            <span class="ws-badge is-amber">普适痛点 01 · 日常写文档 / 改方案</span>
            <h3>7 个「最终版」，到底交哪份？</h3>
            <div class="ws-mini-files">
              <div><span>📄 项目方案_初稿.docx</span><em>周一</em></div>
              <div><span>📄 项目方案_修改版_v3.docx</span><em>周三</em></div>
              <div class="is-hot"><span>📄 项目方案_<b>真的最终版_v7</b>.docx</span><em>周五崩溃</em></div>
            </div>
            <p class="ws-pain-note">靠手动复制留底，过两天自己都分不清哪版改了什么。</p>
          </article>
          <article class="ws-pain-card is-hero-rose">
            <span class="ws-badge is-berry">普适痛点 02 · 用 AI 做小工具 / 改网页</span>
            <h3>AI 改第 5 版时，把第 3 版改崩了</h3>
            <div class="ws-crash-mock">
              <div class="ws-crash-bar"><i></i><i></i><i></i><span>我的 AI 作品预览</span></div>
              <div class="ws-crash-body">
                <strong>⚠ 刚才还能跑，多提一句全乱了！</strong>
                <span>想退回半小时前好用的版本，却发现没留底……</span>
              </div>
            </div>
            <p class="ws-pain-note is-rose-text">💬 <b>痛点总结：</b>无论是写方案还是用 AI 做项目，没有版本管理就随时可能前功尽弃。</p>
          </article>`,
        );
        return;
      }

      if (step === 2) {
        screen(
          root,
          'ws-compare-visual',
          `
          <div class="ws-arch-flow">
            <svg viewBox="0 0 1240 360" role="img" aria-label="Git本地版本工具与GitHub云端托管平台关系流程图">
              <rect x="12" y="14" width="534" height="332" rx="28" fill="#eef9f3" />
              <g transform="translate(42,36) scale(1.25)">
                <path fill="#F05032" d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.846 1.846 0 0 1-.404-2.01l-2.48-2.48v6.532a1.838 1.838 0 1 1-1.512-.054V8.817a1.838 1.838 0 0 1-.997-2.41L7.63 3.686.454 10.862a1.55 1.55 0 0 0 0 2.189l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.426-10.426a1.55 1.55 0 0 0 0-2.172z"/>
              </g>
              <rect x="84" y="36" width="196" height="30" rx="15" fill="#d2efe0" />
              <text x="182" y="56" text-anchor="middle" font-size="14" font-weight="700" fill="#145a38">Q&amp;A · 它们不是一回事</text>
              <text x="42" y="104" font-size="25" font-weight="700" fill="#145a38">Git = 电脑里的版本控制工具</text>
              <text x="42" y="134" font-size="17" fill="#466957">只留 1 个文件夹，断网也能按顺序拍下每次版本快照</text>
              <rect x="42" y="158" width="474" height="114" rx="22" fill="#ffffff" />
              <line x1="100" y1="206" x2="450" y2="206" stroke="#248f5c" stroke-width="4" />
              <circle cx="110" cy="206" r="18" fill="#d2f0e0" stroke="#1b754a" stroke-width="3" />
              <text x="110" y="212" text-anchor="middle" font-size="15" font-weight="700" fill="#145a38">V1</text>
              <text x="110" y="248" text-anchor="middle" font-size="15" fill="#526b5e">初稿跑通</text>
              <circle cx="275" cy="206" r="18" fill="#d2f0e0" stroke="#1b754a" stroke-width="3" />
              <text x="275" y="212" text-anchor="middle" font-size="15" font-weight="700" fill="#145a38">V2</text>
              <text x="275" y="248" text-anchor="middle" font-size="15" fill="#526b5e">改好配色</text>
              <circle cx="440" cy="206" r="21" fill="#1b754a" />
              <text x="440" y="212" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">V3</text>
              <text x="440" y="248" text-anchor="middle" font-size="15" font-weight="700" fill="#145a38">当前稳定版 ✓</text>
              <text x="42" y="312" font-size="17" font-weight="650" fill="#145a38">⏪ 哪怕下一步 AI 改崩了，也能一秒退回 V1 / V2</text>

              <path d="M558 144 C605 114, 645 114, 692 144" fill="none" stroke="#c83271" stroke-width="4" />
              <polygon points="694,145 681,136 684,151" fill="#c83271" />
              <rect x="572" y="88" width="108" height="32" rx="16" fill="#fde0ec" />
              <text x="626" y="109" text-anchor="middle" font-size="15" font-weight="700" fill="#a81d58">Push 上传</text>

              <path d="M692 220 C645 250, 605 250, 558 220" fill="none" stroke="#2264b8" stroke-width="3.5" stroke-dasharray="6 5" />
              <polygon points="556,219 569,228 566,213" fill="#2264b8" />
              <rect x="572" y="240" width="108" height="32" rx="16" fill="#dceeff" />
              <text x="626" y="261" text-anchor="middle" font-size="15" font-weight="700" fill="#184d94">Pull 同步</text>

              <rect x="704" y="14" width="524" height="332" rx="28" fill="#eef6ff" />
              <g transform="translate(734,36) scale(1.25)">
                <path fill="#24292F" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </g>
              <rect x="776" y="36" width="210" height="30" rx="15" fill="#d6ecff" />
              <text x="881" y="56" text-anchor="middle" font-size="14" font-weight="700" fill="#164687">免费托管 · 作品集与开源</text>
              <text x="734" y="104" font-size="25" font-weight="700" fill="#164687">GitHub = 基于 Git 的云端平台</text>
              <text x="734" y="134" font-size="17" fill="#466285">把本机 Git 仓库传上网，防丢备份、展示作品集、找开源项目</text>
              <rect x="734" y="158" width="224" height="114" rx="20" fill="#ffffff" />
              <text x="756" y="198" font-size="20" font-weight="700" fill="#164687">🔒 Private 私密</text>
              <text x="756" y="232" font-size="16" fill="#5a6e85">自己平时练习，仅自己可见</text>
              <rect x="974" y="158" width="224" height="114" rx="20" fill="#ffffff" />
              <text x="996" y="198" font-size="20" font-weight="700" fill="#a81d58">🌐 Public 公开</text>
              <text x="996" y="232" font-size="16" fill="#5a6e85">求职作品集，面试官随时看</text>
              <text x="734" y="312" font-size="17" font-weight="650" fill="#164687">🌍 还能免费下载全球 1.8 亿开发者的优质开源项目</text>
            </svg>
          </div>`,
        );
        return;
      }

      const tIndex = step - 3;
      if (tIndex >= 0 && tIndex < timeline.length) {
        const event = timeline[tIndex];
        const dots = timeline
          .map((item, idx) => {
            const short = String(item.date)
              .replace(/^2005[-年/.]/, '')
              .replaceAll('-', '/');
            return `<button type="button" class="ws-dot${idx === tIndex ? ' is-current' : ''}" data-tstep="${idx + 3}" aria-pressed="${idx === tIndex}"><i></i><span>${escape(short)}</span></button>`;
          })
          .join('');
        const container = screen(
          root,
          'ws-history-story',
          `
          <div class="ws-story-main is-portrait">
            <figure class="ws-linus-card">
              <img src="assets/portraits/linus.jpg" alt="Linus Torvalds 肖像">
              <figcaption><b>Linus Torvalds</b><span>Linux &amp; Git 创始人</span></figcaption>
            </figure>
            <div class="ws-story-copy">
              <div class="ws-story-meta">
                <span class="ws-mono-pill is-sky">${escape(event.date)} · 起源里程碑 0${tIndex + 1} / 05</span>
              </div>
              <h3>${escape(event.label)}</h3>
              <p>${escape(event.detail)}</p>
            </div>
          </div>
          <nav class="ws-story-rail" aria-label="Git 诞生时间线">${dots}</nav>`,
        );
        container.querySelectorAll('[data-tstep]').forEach((btn) => {
          btn.addEventListener('click', () => window.BelaGoStep(Number(btn.dataset.tstep)));
        });
        return;
      }

      if (step === 3 + timeline.length) {
        const gh = facts?.github || {
          year: 2025,
          developers: 180000000,
          repositories: 630000000,
          acquisitionYear: 2018,
          acquisitionUSD: 7500000000,
        };
        const rows = [
          {
            label: '托管仓库总数',
            val: '6.3 亿+',
            sub: '全球开源项目与个人作品集',
            ticks: 22,
            color: '#081F5C',
          },
          {
            label: '开发者与创作者',
            val: '1.8 亿+',
            sub: '每秒新增 1 位注册创作者',
            ticks: 17,
            color: '#334EAC',
          },
          {
            label: '2025 年新增仓库',
            val: '1.2 亿+',
            sub: 'AI 编程带动建仓潮 (+28% YoY)',
            ticks: 13,
            color: '#5273C7',
          },
          {
            label: '生成式 AI 仓库',
            val: '430 万+',
            sub: '全球最活跃的 AI 开源聚集地',
            ticks: 8,
            color: '#7096D1',
          },
        ];
        const svgRows = rows
          .map((r, idx) => {
            const y = 38 + idx * 56;
            let rects = '';
            for (let t = 0; t < 22; t++) {
              const x = 224 + t * 19;
              const active = t < r.ticks;
              rects += `<rect x="${x}" y="${y - 15}" width="14" height="24" rx="4" fill="${active ? r.color : '#E3EAF4'}" />`;
            }
            return `
            <line x1="12" y1="${y + 20}" x2="788" y2="${y + 20}" stroke="#DEDDD6" stroke-width="0.8" />
            <text x="14" y="${y - 1}" font-size="16" font-weight="700" fill="#081F5C">${r.label}</text>
            <text x="14" y="${y + 15}" font-size="12.5" fill="#5b6b8c">${r.sub}</text>
            ${rects}
            <text x="780" y="${y + 5}" text-anchor="end" font-size="21" font-weight="800" fill="${r.color}">${r.val}</text>
          `;
          })
          .join('');

        screen(
          root,
          'ws-gh-birth-grid',
          `
          <div class="ws-gh-left">
            <span class="ws-badge is-sky">2008 年 4 月 · 旧金山上线</span>
            <h3>Git + Hub = GitHub</h3>
            <p>把原本只有程序员在黑框里用的 Git，变成了带网页界面、每个人都能免费托管项目与展示作品集的云端社区。</p>
            <div class="ws-gh-mini-cards">
              <div class="is-butter"><b>2018 微软收购价</b><strong>75 亿美元</strong><span>个人私有与公开仓库完全免费</span></div>
              <div class="is-sage"><b>文科生能用来干嘛</b><strong>作品集 + 找开源</strong><span>管理自己的 AI 项目，淘全球优质工具</span></div>
            </div>
          </div>
          <div class="ws-lieflat-card">
            <div class="ws-lf-head">
              <h4>AI 浪潮推高创作者建仓：GitHub 仓库突破 6.3 亿，开发者超 1.8 亿</h4>
              <div class="ws-lf-sub">彩色刻度 = 量级强度阶梯（PORCELAIN 青瓷蓝阶） · 2025.10 采样</div>
            </div>
            <svg viewBox="0 0 800 240" class="ws-lf-svg" role="img" aria-label="GitHub Octoverse 2025 规模刻度条形图">
              ${svgRows}
            </svg>
            <div class="ws-lf-src">F5 TICK ROWS · LUPI BASICS · SOURCE: GitHub Octoverse ${escape(gh.year)}</div>
          </div>`,
        );
        return;
      }

      renderSummaryCard(root, {
        badge: '模块 01 总结 · 认识 Git 与诞生记',
        mantra:
          'Git 是本机版本工具，GitHub 是免费云端平台；越用 AI 做小工具，越要从第 1 天留档。',
        svg: `<svg viewBox="0 0 1160 118" role="img" aria-label="模块1核心流程图">
          <rect x="10" y="12" width="334" height="94" rx="20" fill="#fbecc8"/>
          <text x="34" y="48" font-size="19" font-weight="700" fill="#8f4f0a">① 两大普适痛点</text>
          <text x="34" y="78" font-size="16" fill="#5e4324">7 个「最终版」分不清 · AI 改崩找不回旧版</text>
          <path d="M354 60 H402" stroke="#c83271" stroke-width="3.5"/><polygon points="406,60 394,53 394,67" fill="#c83271"/>
          <rect x="416" y="12" width="344" height="94" rx="20" fill="#d2efe0"/>
          <text x="440" y="48" font-size="19" font-weight="700" fill="#145a38">② 本机用 Git（2005 Linus 写出）</text>
          <text x="440" y="78" font-size="16" fill="#2b5e44">1 个文件夹存 V1→V2→V3，断网也能一秒回退</text>
          <path d="M770 60 H818" stroke="#2264b8" stroke-width="3.5"/><polygon points="822,60 810,53 810,67" fill="#2264b8"/>
          <rect x="832" y="12" width="318" height="94" rx="20" fill="#d6ecff"/>
          <text x="856" y="48" font-size="19" font-weight="700" fill="#164687">③ 云端上 GitHub（2008 上线）</text>
          <text x="856" y="78" font-size="16" fill="#325585">免费云端备份 · 求职作品集 · 逛开源宝库</text>
        </svg>`,
        points: [
          {
            title: 'Git 和 GitHub 是一回事吗？',
            body: '不是！Git 是本机版本控制工具；GitHub 是基于 Git 的免费托管与作品集网站。',
          },
          {
            title: '只做 AI 小工具也要用吗？',
            body: '越是小工具需求越容易变，从建文件夹第 1 天留档才能防止代码改乱。',
          },
          {
            title: '起源故事一句话记住',
            body: '2005 年 Linus 花 10 天写出 Git；2008 年 GitHub 让它走向全球 1.8 亿人。',
          },
        ],
      });
    },
  };

  /* =========================================================================
   * 第 2 节：AI 时代为何必学 Git
   * ========================================================================= */
  const aiChat = [
    [
      '贝拉',
      '第一步：帮我把主页的「作品集」按钮换成醒目的玫红色。',
      '小步快跑：每次只让 AI 改一个小地方，改完先测试！',
      '让 AI 执行修改 →',
    ],
    [
      'AI 助手',
      '已经换成玫红按钮啦！你测试确认没问题，顺手存了个档（#a1b2c3d）。',
      '避开误区 2：千万别让 AI 一改完就盲交，先看预览正常再存档！',
      '继续提需求：加个炫酷旋转动效 →',
    ],
    [
      '贝拉',
      '惨了！加完旋转动效，整个网页标题歪了、按钮也飞出去了！',
      'AI 写得快、改崩得也快。幸好上一步测试通过时留了存档！',
      '别慌，一键退回上一个存档 ↶',
    ],
    [
      'AI 助手',
      '已退回 #a1b2c3d！崩掉的动效清除了，好用的玫红按钮完好无损。',
      '因为存过档，一秒回到稳定状态，不用删掉重头再来。',
      '看三种后悔药决策流程图 →',
    ],
  ];

  const remedies = [
    {
      tab: '① 还没提交（Discard）',
      title: 'Discard / Restore · 直接擦掉工作区里未提交的改动',
      scene:
        '适用场景：AI 刚把页面改乱，你打开预览发现不对，还没有点 commit 提交存档——直接把这次改动擦掉即可。',
      prompt: '「刚才改乱了，把工作区里还没提交的改动全部丢掉，恢复到上一次存档的状态。」',
      svg: `<svg viewBox="0 0 360 150"><rect x="8" y="10" width="344" height="130" rx="20" fill="#fff5f8"/><line x1="40" y1="66" x2="175" y2="66" stroke="#248f5c" stroke-width="4"/><line x1="175" y1="66" x2="290" y2="66" stroke="#d86c92" stroke-width="3" stroke-dasharray="6 5"/><circle cx="60" cy="66" r="15" fill="#d2efe0" stroke="#186b43" stroke-width="3"/><text x="60" y="71" text-anchor="middle" font-size="13" font-weight="700" fill="#145a38">V1</text><text x="60" y="106" text-anchor="middle" font-size="13" fill="#544650">初稿</text><circle cx="175" cy="66" r="16" fill="#186b43"/><text x="175" y="71" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">V2</text><text x="175" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="#145a38">当前存档 ✓</text><rect x="255" y="44" width="76" height="44" rx="12" fill="#fde0ea" stroke="#c82863" stroke-width="2"/><text x="293" y="71" text-anchor="middle" font-size="14" font-weight="700" fill="#b01e54">✕ 擦除草稿</text></svg>`,
    },
    {
      tab: '② 本地已交（Reset）',
      title: 'Reset · 把本地分支指针直接退回到旧版本',
      scene:
        '适用场景：已经点过 commit 存了档，但还只保存在你自己电脑里（没 push 到共享仓库），想直接退回前一个好版本。',
      prompt: '「帮我把本地仓库 reset 退回到 #a1b2c3d 粉色按钮那次提交，后面的坏版本不要了。」',
      svg: `<svg viewBox="0 0 360 150"><rect x="8" y="10" width="344" height="130" rx="20" fill="#fdf6e4"/><line x1="40" y1="74" x2="170" y2="74" stroke="#248f5c" stroke-width="4"/><line x1="170" y1="74" x2="295" y2="74" stroke="#b8aeb4" stroke-width="3" stroke-dasharray="5 5"/><circle cx="60" cy="74" r="14" fill="#d2efe0" stroke="#186b43" stroke-width="3"/><text x="60" y="110" text-anchor="middle" font-size="13" fill="#544650">V1</text><circle cx="170" cy="74" r="16" fill="#186b43"/><text x="170" y="79" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">V2</text><text x="170" y="110" text-anchor="middle" font-size="13" font-weight="700" fill="#145a38">↶ 指针退回这</text><circle cx="295" cy="74" r="14" fill="#ece6ea" stroke="#9e9299" stroke-width="2"/><text x="295" y="110" text-anchor="middle" font-size="13" fill="#8a7c84">V3 废弃</text><path d="M288 48 C248 18, 206 18, 176 48" fill="none" stroke="#c85a14" stroke-width="3"/><polygon points="173,52 176,40 185,48" fill="#c85a14"/></svg>`,
    },
    {
      tab: '③ 已传云端（Revert）',
      title: 'Revert · 新增一次「反向提交」安全抵消错误',
      scene:
        '适用场景：错误版本已经 push 传到了 GitHub 仓库。为了不抹除历史记录，新增一个 V4 把 V3 的改动反过来抵消掉。',
      prompt: '「刚才那次提交已经传上 GitHub 了，请帮我用 revert 做一次反向提交抵消它。」',
      svg: `<svg viewBox="0 0 360 150"><rect x="8" y="10" width="344" height="130" rx="20" fill="#eef6ff"/><line x1="36" y1="68" x2="314" y2="68" stroke="#2264b8" stroke-width="4"/><circle cx="50" cy="68" r="13" fill="#d6ecff" stroke="#1c56a3" stroke-width="2.5"/><text x="50" y="104" text-anchor="middle" font-size="13" fill="#465a75">V1</text><circle cx="134" cy="68" r="13" fill="#d6ecff" stroke="#1c56a3" stroke-width="2.5"/><text x="134" y="104" text-anchor="middle" font-size="13" fill="#465a75">V2</text><circle cx="218" cy="68" r="13" fill="#fde0ea" stroke="#c82863" stroke-width="2.5"/><text x="218" y="104" text-anchor="middle" font-size="13" fill="#b01e54">V3 出错</text><circle cx="306" cy="68" r="16" fill="#1c56a3"/><text x="306" y="73" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">+V4</text><text x="306" y="104" text-anchor="middle" font-size="13" font-weight="700" fill="#164687">反向抵消 ✓</text></svg>`,
    },
  ];
  let remedyIndex = 0;

  lessons[2] = {
    steps: [
      'Vibe Coding 黄金工作流与两大误区',
      '1 · 先让 AI 改个按钮',
      '2 · 先测试没问题再提交',
      '3 · 下一步改崩了',
      '4 · 一秒退回好版本',
      '三种后悔药全景决策流程图',
      '📸 模块 2 总结：AI 时代为何必学',
    ],
    render(root, step) {
      if (step === 0) {
        screen(
          root,
          'ws-reasons-split',
          `
          <div class="ws-mis-stack">
            <article class="ws-mis-card">
              <span class="ws-badge is-berry">🚫 新手误区 01 · 别等做完才用</span>
              <h3>不要等项目做完再去用 GitHub</h3>
              <p>等项目已经改乱了再去整理版本，难度会高十倍。<b>越早开始越好，建文件夹第 1 天就开 Git。</b></p>
            </article>
            <article class="ws-mis-card">
              <span class="ws-badge is-amber">🚫 新手误区 02 · 别让 AI 改完盲交</span>
              <h3>不要 AI 一改完就直接提交</h3>
              <p><b>要先进行相关测试，确认没问题之后</b>，我们再把这个新版本提交（Commit）上去。</p>
            </article>
          </div>
          <div class="ws-loop-card">
            <svg viewBox="0 0 580 340" role="img" aria-label="Vibe Coding 先测试再提交正确工作流图">
              <rect x="8" y="8" width="564" height="324" rx="26" fill="#eef9f3"/>
              <text x="34" y="50" font-size="21" font-weight="700" fill="#145a38">✅ Vibe Coding 防崩四步闭环流程图</text>
              <rect x="34" y="76" width="234" height="96" rx="20" fill="#ffffff"/>
              <text x="54" y="114" font-size="19" font-weight="700" fill="#145a38">① 第 1 天开 Git</text>
              <text x="54" y="144" font-size="15.5" fill="#526b5e">建项目文件夹立刻初始化</text>
              <path d="M276 124 H306" stroke="#1b754a" stroke-width="3.5"/><polygon points="310,124 298,117 298,131" fill="#1b754a"/>
              <rect x="314" y="76" width="232" height="96" rx="20" fill="#ffffff"/>
              <text x="334" y="114" font-size="19" font-weight="700" fill="#164687">② AI 改 1 个小需求</text>
              <text x="334" y="144" font-size="15.5" fill="#52657c">小步快跑，不塞十个需求</text>
              <path d="M430 178 V204" stroke="#1b754a" stroke-width="3.5"/><polygon points="430,208 423,196 437,196" fill="#1b754a"/>
              <rect x="314" y="212" width="232" height="96" rx="20" fill="#fbecc8"/>
              <text x="334" y="250" font-size="19" font-weight="700" fill="#8f4f0a">③ 先打开网页测试 ★</text>
              <text x="334" y="280" font-size="15.5" fill="#6b4c28">改崩直接擦掉，不留坏档</text>
              <path d="M306 260 H276" stroke="#1b754a" stroke-width="3.5"/><polygon points="272,260 284,253 284,267" fill="#1b754a"/>
              <rect x="34" y="212" width="234" height="96" rx="20" fill="#1b754a"/>
              <text x="54" y="250" font-size="19" font-weight="700" fill="#ffffff">④ 确认正常 → 提交</text>
              <text x="54" y="280" font-size="15.5" fill="#d2f0e0">锁住好版本，再进下一轮 ✓</text>
            </svg>
          </div>`,
        );
        return;
      }

      if (step >= 1 && step <= 4) {
        const aiStep = step - 1;
        const [speaker, message, hint, label] = aiChat[aiStep];
        const container = screen(
          root,
          'ws-ai',
          `
          <div class="ws-assistant">
            <div class="ws-assistant-label">🤖 Vibe Coding 实战演练 · 0${aiStep + 1} / 04</div>
            <div class="ws-ai-bubble"><b>${speaker}</b><p>${message}</p></div>
            <p class="ws-ai-hint">💡 ${hint}</p>
            ${action(label, 'next')}
          </div>
          <div class="ws-site ${aiStep === 2 ? 'is-broken' : ''}">
            <div class="ws-site-bar"><span class="ws-leds" aria-hidden="true">● ● ●</span><span>我的个人网站预览</span></div>
            <div class="ws-site-body"><img class="ws-site-avatar" src="assets/portraits/bela-cover.jpg" alt=""><strong>李贝拉Bela 的主页</strong><div class="ws-preview-button ${aiStep ? 'is-rose' : ''}">作品集</div></div>
            ${aiStep ? `<div class="ws-site-status">${aiStep === 2 ? '⚠ 布局出错：标题歪斜、按钮飞出' : aiStep === 3 ? '✓ 已恢复存档 #a1b2c3d' : '✓ 测试通过 · 已存档 #a1b2c3d'}</div>` : ''}
          </div>`,
        );
        nextOnClick(container, step);
        return;
      }

      if (step === 5) {
        const currentRemedy = remedies[remedyIndex];
        const container = screen(
          root,
          'ws-remedies',
          `
          <div class="ws-remedy-top">
            <div class="ws-remedy-options" aria-label="选择后悔药场景">${remedies
              .map(
                (r, i) =>
                  `<button type="button" aria-pressed="${i === remedyIndex}" data-remedy="${i}">${r.tab}</button>`,
              )
              .join('')}</div>
          </div>
          <div class="ws-remedy-detail">
            <div class="ws-remedy-svg">${currentRemedy.svg}</div>
            <div class="ws-remedy-copy">
              <h3>${currentRemedy.title}</h3>
              <p>${currentRemedy.scene}</p>
              <div class="ws-say-box"><b>🗣️ 直接对 AI 说：</b><span>${currentRemedy.prompt}</span></div>
            </div>
          </div>`,
        );
        container.querySelectorAll('[data-remedy]').forEach((button) =>
          button.addEventListener('click', () => {
            remedyIndex = Number(button.dataset.remedy);
            lessons[2].render(root, 5);
            root.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      renderSummaryCard(root, {
        badge: '模块 02 总结 · AI 时代为何必学',
        mantra:
          '项目第一天就开 Git，AI 改完先测试；确认没问题再提交，改崩按场景选三种后悔药。',
        svg: `<svg viewBox="0 0 1160 118" role="img" aria-label="三种后悔药决策流程图">
          <rect x="10" y="12" width="356" height="94" rx="20" fill="#fcd9e8"/>
          <text x="32" y="48" font-size="18" font-weight="700" fill="#a81d58">情况 A：改乱了，还没点 Commit？</text>
          <text x="32" y="78" font-size="16" fill="#5e3447">👉 用 Discard 直接擦掉工作区未保存草稿</text>
          <rect x="402" y="12" width="356" height="94" rx="20" fill="#fbecc8"/>
          <text x="424" y="48" font-size="18" font-weight="700" fill="#8f4f0a">情况 B：已 Commit 在本地，没传云端？</text>
          <text x="424" y="78" font-size="16" fill="#5e4324">👉 用 Reset 把本地分支指针退回上一版</text>
          <rect x="794" y="12" width="356" height="94" rx="20" fill="#d6ecff"/>
          <text x="816" y="48" font-size="18" font-weight="700" fill="#164687">情况 C：已经 Push 上传到 GitHub？</text>
          <text x="816" y="78" font-size="16" fill="#325585">👉 用 Revert 新增一次「反向提交」安全抵消</text>
        </svg>`,
        points: [
          {
            title: '避开误区 1：别等做完才用',
            body: '等项目改乱了再整理版本难度高十倍，建文件夹第 1 天就要启动版本记录。',
          },
          {
            title: '避开误区 2：别让 AI 改完盲交',
            body: '每次只提一个小需求，必须先测试确认没问题，再把新版本提交上去。',
          },
          {
            title: '不会背命令就说大白话',
            body: '直接告诉 AI：「这步我测过了帮我 commit 存档」或「改乱了帮我退回上一版」。',
          },
        ],
      });
    },
  };

  /* =========================================================================
   * 第 3 节：四个区域与核心命令（彻底讲透：为什么只看见文件夹和 GitHub，却有 4 个区？哪些可见哪些隐藏？）
   * ========================================================================= */
  const zones = [
    {
      id: 'work',
      num: '01',
      tone: 'is-butter',
      vis: '👁️ 电脑文件夹直接可见',
      name: '工作区',
      en: 'Working Directory',
      short: '你平时双击打开看到的普通文件',
      desc: '【你在哪看见它】就是你电脑桌面上肉眼能看见的那个文件夹。它只展示「当前最新这一刻」的文件；你用 AI 刚改完还没存时，改动就在这里。',
    },
    {
      id: 'stage',
      num: '02',
      tone: 'is-rose',
      vis: '🙈 隐藏在 .git 里（桌面版勾选栏可见）',
      name: '暂存区',
      en: 'Staging Area',
      short: '为什么多这一层？用来挑拣打包的购物车',
      desc: '【为什么要有它】就像网购的「购物车」：比如 AI 改了 5 个文件，你只想先把改好的 2 个存成一版、另外 3 个先不存，就靠暂存区挑出来打包！它藏在隐藏文件夹 .git 里。',
    },
    {
      id: 'local',
      num: '03',
      tone: 'is-sage',
      vis: '🙈 隐藏在 .git 里（桌面版 History 可见）',
      name: '本地仓库',
      en: 'Local Repo (.git)',
      short: '什么是仓库？普通文件夹 + .git 历史账本',
      desc: '【仓库到底是什么】普通文件夹装上 .git 隐藏目录就变成了「仓库」！这里真正锁着你提交过的 V1、V2、V3 全部历史版本，所以哪怕断网也能随时回退。',
    },
    {
      id: 'remote',
      num: '04',
      tone: 'is-sky',
      vis: '👁️ 打开 GitHub 网页直接可见',
      name: '远程仓库',
      en: 'Remote Repo (GitHub)',
      short: '把本机仓库复制到云端备份与展示',
      desc: '【你在哪看见它】打开 github.com 看到的那个网页仓库。当你点 Push，就是把本机 03 号隐藏档案柜里的历史版本同步到云端，防丢又能当作品集。',
    },
  ];
  let activeZone = 0;

  const flowCommands = [
    {
      cmd: 'git init',
      label: '① 开机建柜',
      from: 0,
      to: 2,
      dir: 'right',
      what: '在普通文件夹里创建 .git 本地仓库，相当于给项目装上「版本档案柜」。每个项目开头只做一次。',
      say: '「帮我把这个文件夹初始化成 Git 仓库。」',
    },
    {
      cmd: 'git add',
      label: '② 挑进托盘',
      from: 0,
      to: 1,
      dir: 'right',
      what: '把「工作区」里改好并测试通过的文件放进「暂存区」托盘，准备打包成新版本。',
      say: '（用桌面版或编辑器点提交时，软件会自动帮你勾选文件完成这一步。）',
    },
    {
      cmd: 'git commit',
      label: '③ 正式存档',
      from: 1,
      to: 2,
      dir: 'right',
      what: '把「暂存区」里的文件正式拍成一张永久快照，存进「本地仓库」，写清楚修改备注并生成唯一编号。',
      say: '「这版我测好了，帮我 commit 存档，备注写清楚具体改了什么。」',
    },
    {
      cmd: 'git push',
      label: '④ 推上云端',
      from: 2,
      to: 3,
      dir: 'right',
      what: '把「本地仓库」里已经存好的版本，一键上传同步到「远程仓库（GitHub）」备份或展示。',
      say: '「帮我把本地存好的最新版本 push 推送到 GitHub 上。」',
    },
    {
      cmd: 'clone / pull',
      label: '⑤ 云端拉回',
      from: 3,
      to: 0,
      dir: 'left',
      what: 'clone 是第一次把网上整座仓库下载到电脑；pull 是把云端最新的改动拉回本地工作区。',
      say: '「帮我把这个 GitHub 仓库 clone 下载到本地文件夹。」',
    },
    {
      cmd: 'diff / restore',
      label: '⑥ 对比与抽回',
      from: 2,
      to: 0,
      dir: 'left',
      what: 'diff 用来查看红绿增删对比（到底改了哪几行）；restore 可以把本地仓库里的旧版抽回工作区。',
      say: '「帮我对比一下这版改了哪几行；把文件恢复到上一个版本。」',
    },
  ];
  let activeCmd = 1;

  const siteLimit = 90;
  const originalSite =
    '网页标题：李贝拉Bela 的 AI 主页\n主按钮：灰色普通按钮「查看项目」\n核心模块：只有一段文字简介';
  const sampleEdits = [
    {
      text: '网页标题：李贝拉Bela 的 AI 主页\n主按钮：樱花粉高亮按钮「看我的 AI 作品集」\n核心模块：只有一段文字简介',
      msg: '把主按钮改成樱花粉并更新文案',
    },
    {
      text: '网页标题：李贝拉Bela 的 AI 主页\n主按钮：樱花粉高亮按钮「看我的 AI 作品集」\n核心模块：新增 3 个可在线体验的 AI 小工具卡片',
      msg: '首页新增 3 个 AI 小工具体验卡片',
    },
    {
      text: '网页标题：AI 大白话 · 从零做出你的第一个作品\n主按钮：樱花粉高亮按钮「看我的 AI 作品集」\n核心模块：新增 3 个可在线体验的 AI 小工具卡片',
      msg: '把网页主标题改成 AI 大白话标语',
    },
  ];
  let sampleCursor = 0;

  function shortHash(seed) {
    let h = 2166136261;
    for (const ch of seed) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(7, '0').slice(0, 7);
  }

  const thesis = {
    versions: [{ text: originalSite, msg: 'Initial commit · 搭好个人主页初稿', hash: 'f1b8d34' }],
    draft: originalSite,
    note: '',
    current: 0,
    comparison: null,
  };

  function markLineChanges(oldText, newText, output) {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const max = Math.max(oldLines.length, newLines.length);
    const diffs = [];
    for (let i = 0; i < max; i++) {
      const a = oldLines[i] ?? '';
      const b = newLines[i] ?? '';
      if (a !== b) diffs.push([a, b]);
    }
    if (!diffs.length) {
      output.textContent = '这两个版本内容完全一致。';
      return;
    }
    output.innerHTML = diffs
      .map(
        ([removed, added]) => `
      <div class="ws-diff-pair">
        <div class="ws-diff-row"><b>改前</b><del>${escape(removed || '（空行）')}</del></div>
        <div class="ws-diff-row"><b>改后</b><ins>${escape(added || '（已删去）')}</ins></div>
      </div>`,
      )
      .join('');
  }

  function siteEditor(root) {
    const container = screen(
      root,
      'ws-editor',
      `
      <div class="ws-paper">
        <div class="ws-paper-head">
          <label for="ws-thesis">① 工作区 · 正在用 AI 改个人主页</label>
          <span class="ws-length"></span>
        </div>
        <textarea id="ws-thesis" maxlength="${siteLimit}" rows="3" spellcheck="false" aria-label="编辑个人网站配置，最多九十字"></textarea>
        <div class="ws-note-row">
          <label for="ws-commit-msg">提交备注</label>
          <input id="ws-commit-msg" type="text" maxlength="28" placeholder="避坑误区 3：别写「111」，写清这版具体改了什么" autocomplete="off">
        </div>
        <div class="ws-paper-actions">${action('✨ 让 AI 试改一版并填好备注', 'example', true)}${action('＋ 提交存档 (commit)', 'save')}</div>
      </div>
      <div class="ws-history">
        <div class="ws-history-head"><strong>③ 本地仓库 · 版本记录与红绿对比 (Diff)</strong><span class="ws-ver-count"></span></div>
        <div class="ws-timeline" aria-label="网站版本存档"></div>
        <div class="ws-compare" aria-live="polite"></div>
      </div>`,
    );
    const edit = container.querySelector('textarea');
    const msgInput = container.querySelector('#ws-commit-msg');
    const save = container.querySelector('[data-ws-action="save"]');
    const rail = container.querySelector('.ws-timeline');
    const changes = container.querySelector('.ws-compare');

    function updateButtons() {
      container.querySelector('.ws-length').textContent = `${edit.value.length} / ${siteLimit}`;
      save.disabled = !thesis.draft.trim() || thesis.draft === thesis.versions[thesis.current].text;
    }
    function showHistory() {
      edit.value = thesis.draft;
      msgInput.value = thesis.note;
      container.querySelector('.ws-ver-count').textContent = `共 ${thesis.versions.length} 版`;
      updateButtons();
      rail.replaceChildren(
        ...thesis.versions.map((ver, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.innerHTML = `<b>V${index + 1}</b><code>#${ver.hash}</code>`;
          button.title = `回看 V${index + 1}：${ver.msg}`;
          button.setAttribute('aria-label', button.title);
          button.setAttribute('aria-pressed', String(index === thesis.current));
          button.addEventListener('click', () => {
            const previous = thesis.draft;
            const destination = thesis.versions[index].text;
            if (previous !== destination) thesis.comparison = [previous, destination];
            thesis.current = index;
            thesis.draft = destination;
            thesis.note = '';
            showHistory();
            rail.children[index]?.focus({ preventScroll: true });
          });
          return button;
        }),
      );
      rail.children[thesis.current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      showComparison();
    }
    function showComparison() {
      const currentVer = thesis.versions[thesis.current];
      if (thesis.draft !== currentVer.text) {
        changes.innerHTML =
          '<div class="ws-diff-tip">工作区有新改动！确认备注写清楚后，点 <b>＋ 提交存档 (commit)</b> 存入本地仓库。</div>';
      } else if (thesis.comparison) {
        changes.innerHTML = `<div class="ws-diff-meta">当前查看：<b>V${thesis.current + 1}</b>（<code>#${currentVer.hash}</code> · ${escape(currentVer.msg)}）</div><div class="ws-diff" aria-label="改动对比"></div>`;
        markLineChanges(...thesis.comparison, changes.querySelector('.ws-diff'));
      } else {
        changes.innerHTML = `<div class="ws-diff-meta">当前存档：<b>V${thesis.current + 1}</b>（<code>#${currentVer.hash}</code> · ${escape(currentVer.msg)}）</div><div class="ws-diff-tip">点左下方「✨ 让 AI 试改一版并填好备注」，再点提交存档，看看 Git 的红绿对比。</div>`;
      }
    }
    function updateDraft() {
      thesis.draft = edit.value;
      updateButtons();
      showComparison();
    }
    edit.addEventListener('input', updateDraft);
    msgInput.addEventListener('input', () => {
      thesis.note = msgInput.value;
    });
    container.querySelector('[data-ws-action="example"]').addEventListener('click', () => {
      const sample = sampleEdits[sampleCursor % sampleEdits.length];
      sampleCursor++;
      edit.value = sample.text.slice(0, siteLimit);
      thesis.note = sample.msg;
      msgInput.value = sample.msg;
      updateDraft();
    });
    save.addEventListener('click', () => {
      if (save.disabled) return;
      const prevText = thesis.versions[thesis.current].text;
      const msg = (thesis.note || '').trim() || `第 ${thesis.versions.length + 1} 次网页改动`;
      const hash = shortHash(thesis.draft + thesis.versions.length + msg);
      thesis.comparison = [prevText, thesis.draft];
      thesis.versions.push({ text: thesis.draft, msg, hash });
      thesis.current = thesis.versions.length - 1;
      thesis.note = '';
      showHistory();
    });
    showHistory();
  }

  lessons[3] = {
    steps: [
      '承上启下：刚才「存档」时，旧版本到底藏哪了？',
      '四个区域逐个拆解：哪些看得见？哪些藏在后台？',
      '6 大核心命令怎么在四区流转？',
      '实战演练：给 AI 个人主页存档并看红绿对比',
      '📸 模块 3 总结：四个区域与核心命令',
    ],
    render(root, step) {
      if (step === 0) {
        screen(
          root,
          'ws-zone-bridge',
          `
          <div class="ws-cutaway-svg">
            <svg viewBox="0 0 1240 220" role="img" aria-label="可见与隐藏的四个仓库区域透视图">
              <rect x="8" y="8" width="884" height="204" rx="26" fill="#f7f4f6" stroke="#d8ced4" stroke-width="1.5"/>
              <text x="32" y="42" font-size="18" font-weight="700" fill="#251e23">💻 你电脑里的项目文件夹（什么是仓库 Repo？= 明面文件夹 + 隐藏的 .git 历史暗格）</text>

              <rect x="30" y="60" width="246" height="132" rx="18" fill="#fbecc8"/>
              <rect x="46" y="74" width="142" height="24" rx="12" fill="#ffffff"/>
              <text x="117" y="91" text-anchor="middle" font-size="12.5" font-weight="700" fill="#8f4f0a">👁️ 肉眼直接可见</text>
              <text x="46" y="130" font-size="22" font-weight="750" fill="#251e23">01 工作区</text>
              <text x="46" y="158" font-size="14.5" fill="#5e4324">平时打开看到的当前文件</text>

              <path d="M282 126 H312" stroke="#c83271" stroke-width="3"/><polygon points="316,126 305,120 305,132" fill="#c83271"/>
              <text x="298" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="#a31d56">add</text>

              <rect x="322" y="56" width="548" height="140" rx="20" fill="#ffffff" stroke="#b59ea9" stroke-width="2" stroke-dasharray="7 5"/>
              <text x="344" y="80" font-size="14" font-weight="700" fill="#7a6872">🙈 平时看不见的隐藏文件夹 .git（Git 偷偷把旧版本藏在这里）</text>

              <rect x="342" y="94" width="232" height="86" rx="15" fill="#fcd9e8"/>
              <text x="360" y="126" font-size="20" font-weight="750" fill="#a31d56">02 暂存区 Staging</text>
              <text x="360" y="152" font-size="14" fill="#5e3447">像购物车：挑哪几个文件存一版</text>

              <path d="M582 136 H616" stroke="#186b43" stroke-width="3"/><polygon points="620,136 609,130 609,142" fill="#186b43"/>
              <text x="600" y="124" text-anchor="middle" font-size="13" font-weight="700" fill="#145a38">commit</text>

              <rect x="626" y="94" width="226" height="86" rx="15" fill="#d2efe0"/>
              <text x="644" y="126" font-size="20" font-weight="750" fill="#145a38">03 本地仓库 Local</text>
              <text x="644" y="152" font-size="14" fill="#2b5e44">锁着 V1/V2/V3 全部历史快照</text>

              <path d="M902 126 H950" stroke="#1c56a3" stroke-width="3.5"/><polygon points="954,126 942,119 942,133" fill="#1c56a3"/>
              <text x="926" y="112" text-anchor="middle" font-size="14" font-weight="700" fill="#164687">push</text>

              <rect x="962" y="8" width="270" height="204" rx="26" fill="#d6ecff"/>
              <rect x="984" y="34" width="168" height="26" rx="13" fill="#ffffff"/>
              <text x="1068" y="52" text-anchor="middle" font-size="12.5" font-weight="700" fill="#164687">👁️ 浏览器网页可见</text>
              <text x="984" y="102" font-size="24" font-weight="750" fill="#164687">☁️ 04 远程仓库</text>
              <text x="984" y="132" font-size="15" font-weight="650" fill="#2c4c78">GitHub 云端网页</text>
              <text x="984" y="162" font-size="14.5" fill="#325585">把 03 本地仓库复制到网上</text>
              <text x="984" y="186" font-size="14.5" fill="#325585">异地防丢 + 求职作品集</text>
            </svg>
          </div>
          <div class="ws-bridge-cards">
            <article class="is-butter">
              <span class="ws-badge is-amber">承上启下 · 为什么会有 4 个区？</span>
              <h3>不用背定义！先解开你的 1 个困惑</h3>
              <p>上一节我们靠「存档」一秒救回了网页——但你肉眼明明只看见「电脑文件夹」和「GitHub 网页」2 个地方，另外 2 个区其实藏在电脑里的隐藏暗格 <code>.git</code> 里！</p>
            </article>
            <article class="is-sage">
              <span class="ws-badge">小白看完只需要带走 1 件事</span>
              <h3>以后听懂 AI 问你「要提交还是推送？」</h3>
              <p>知道文件是从 <b>电脑文件夹 → 隐藏存档柜 → GitHub 网页</b> 一步步流过去的，以后 AI Agent 问你「要 commit 还是 push」时，你一眼就知道它停在哪一步！</p>
            </article>
          </div>`,
        );
        return;
      }

      if (step === 1) {
        const current = zones[activeZone];
        const container = screen(
          root,
          'ws-zones',
          `
          <div class="ws-zone-grid">${zones
            .map(
              (z, i) => `
            <button type="button" class="ws-zone-card${i === activeZone ? ' is-current ' + z.tone : ''}" data-zone="${i}" aria-pressed="${i === activeZone}">
              <div class="ws-zone-top">
                <span class="ws-zone-num">${z.num} · ${z.name}</span>
                <em class="ws-zone-arrow">${z.vis}</em>
              </div>
              <span class="ws-zone-short">${z.short}</span>
            </button>`,
            )
            .join('')}</div>
          <div class="ws-zone-detail">
            <div>
              <h3>${current.num} · ${current.name}（${current.en}）— ${current.vis}</h3>
              <p>${current.desc}</p>
            </div>
          </div>`,
        );
        container.querySelectorAll('[data-zone]').forEach((btn) =>
          btn.addEventListener('click', () => {
            activeZone = Number(btn.dataset.zone);
            lessons[3].render(root, 1);
            root.querySelector('[data-zone][aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      if (step === 2) {
        const c = flowCommands[activeCmd];
        const boxes = zones
          .map((z, i) => {
            const role = i === c.from ? 'is-from' : i === c.to ? 'is-to' : '';
            const tag = i === c.from ? '出发区' : i === c.to ? '到达区' : '';
            return `<div class="ws-flow-box ${role}">${tag ? `<em>${tag}</em>` : ''}<b>${z.name}</b><span>${z.en.split(' ')[0]}</span></div>`;
          })
          .join('<i class="ws-flow-arrow" aria-hidden="true">⇄</i>');
        const buttons = flowCommands
          .map(
            (item, i) =>
              `<button type="button" class="ws-cmd-btn${i === activeCmd ? ' is-current' : ''}" data-cmd="${i}" aria-pressed="${i === activeCmd}"><b>${item.cmd}</b><span>${item.label}</span></button>`,
          )
          .join('');
        const container = screen(
          root,
          'ws-flow',
          `
          <div class="ws-flow-stage">${boxes}</div>
          <div class="ws-cmd-bar" aria-label="核心命令流转">${buttons}</div>
          <div class="ws-cmd-explain">
            <div>
              <h3><code>${c.cmd}</code>　${c.label.slice(2)}</h3>
              <p>${c.what}</p>
              <div class="ws-say-inline">🗣️ ${c.say}</div>
            </div>
          </div>`,
        );
        container.querySelectorAll('[data-cmd]').forEach((btn) =>
          btn.addEventListener('click', () => {
            activeCmd = Number(btn.dataset.cmd);
            lessons[3].render(root, 2);
            root.querySelector('[data-cmd][aria-pressed="true"]')?.focus({ preventScroll: true });
          }),
        );
        return;
      }

      if (step === 3) {
        siteEditor(root);
        return;
      }

      renderSummaryCard(root, {
        badge: '模块 03 总结 · 四个区域与核心命令',
        mantra:
          '提交备注别偷懒写「111」，写清这版改了啥；工作区改好进暂存，提交进本地仓库，再推上 GitHub。',
        svg: `<svg viewBox="0 0 1160 118" role="img" aria-label="四区六命令速查流程图">
          <rect x="10" y="14" width="250" height="90" rx="18" fill="#fbecc8"/>
          <text x="30" y="50" font-size="19" font-weight="700" fill="#8f4f0a">01 工作区</text>
          <text x="30" y="78" font-size="15" fill="#5e4324">正在改的本地文件</text>
          <path d="M268 58 H314" stroke="#c83271" stroke-width="3.5"/><polygon points="318,58 306,51 306,65" fill="#c83271"/>
          <text x="292" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#a81d58">add</text>
          <rect x="326" y="14" width="240" height="90" rx="18" fill="#fcd9e8"/>
          <text x="346" y="50" font-size="19" font-weight="700" fill="#a81d58">02 暂存区</text>
          <text x="346" y="78" font-size="15" fill="#5e3447">勾选要打包的文件</text>
          <path d="M574 58 H626" stroke="#186b43" stroke-width="3.5"/><polygon points="630,58 618,51 618,65" fill="#186b43"/>
          <text x="600" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#145a38">commit</text>
          <rect x="638" y="14" width="248" height="90" rx="18" fill="#d2efe0"/>
          <text x="658" y="50" font-size="19" font-weight="700" fill="#145a38">03 本地仓库 (.git)</text>
          <text x="658" y="78" font-size="15" fill="#2b5e44">写清备注永久留档</text>
          <path d="M894 58 H942" stroke="#1c56a3" stroke-width="3.5"/><polygon points="946,58 934,51 934,65" fill="#1c56a3"/>
          <text x="918" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#164687">push</text>
          <rect x="954" y="14" width="196" height="90" rx="18" fill="#d6ecff"/>
          <text x="974" y="50" font-size="19" font-weight="700" fill="#164687">04 远程仓库</text>
          <text x="974" y="78" font-size="15" fill="#325585">GitHub 云端备份</text>
        </svg>`,
        points: [
          {
            title: '四个区域一句话串起来',
            body: '工作区改稿 → 暂存区挑文件装盒 → 本地仓库拍快照存档 → 远程仓库推上云端。',
          },
          {
            title: '避开误区 3：备注别写「改了一下」',
            body: '提交信息写得太随便会导致目标不清晰；写清具体改动（如「把按钮改成樱花粉」）才好找回。',
          },
          {
            title: '编号与红绿 Diff',
            body: '每次 Commit 都有 7 位唯一编号，点开就能看到删了哪行（红）、加了哪行（绿）。',
          },
        ],
      });
    },
  };

  /* =========================================================================
   * 第 4 节：分支开发与合并（用「我的 AI 个人网站改版」代替书店论文！）
   * ========================================================================= */
  const branchSteps = [
    '主分支与实验分支全景流程图（误区 4）',
    '什么时候该新开一条分支？',
    '实验成功再合并，失败直接丢',
    '1 · 从 main 拉出实验分支',
    '2 · 在实验分支大胆改主页标语',
    '3 · 两边改了同一处触发冲突',
    '4 · 弹幕投票拍板合并',
    '📸 模块 4 总结：分支开发与合并',
  ];
  const chat = [
    [
      '🚫 误区 4 · 别在主线硬做大改',
      '不要什么大的改动都在主分支（main）上做！直接在主分支大改，一旦 AI 改到一半报错，连原本已经能正常访问的网站也跟着瘫痪了。',
    ],
    [
      '💬 Q&A · 什么时候开分支？',
      '主分支（main）更适合放相对稳定的版本！只要你想做大改动、换一套新布局、或让 AI 尝试新功能，就新开一条分支（branch）去实验。',
    ],
    [
      '✅ 分支怎么合回主线？',
      '在实验分支上随便改、随便存档，主分支一字不动；等实验测试完全没问题了，再 Merge（合并）回主分支；改废了直接删掉分支也不伤主线！',
    ],
  ];
  const titles = {
    main: 'AI 大白话 · 陪你从零开始学 AI',
    bold: '文科生也能亲手做出的 AI 作品集',
    both: 'AI 大白话：文科生也能亲手做出的 AI 作品集',
  };
  let branchChoice = '';
  let showBranchPrompt = false;

  function overviewBranchFlowSvg() {
    return `<div class="ws-branch-overview-svg">
      <svg viewBox="0 0 680 360" role="img" aria-label="Git主分支与分开的实验分支分叉与合并流程图">
        <rect x="24" y="20" width="250" height="34" rx="17" fill="#d2efe0"/>
        <circle cx="44" cy="37" r="6" fill="#248f5c"/>
        <text x="58" y="43" font-size="15" font-weight="700" fill="#145a38">main 主分支 · 线上稳定版网站</text>

        <path d="M50 140 H640" stroke="#248f5c" stroke-width="5" stroke-linecap="round"/>
        <path d="M210 140 C255 140, 255 240, 300 240 H460 C505 240, 505 140, 550 140" fill="none" stroke="#d93876" stroke-width="4.5" stroke-linecap="round"/>

        <circle cx="90" cy="140" r="14" fill="#d2efe0" stroke="#186b43" stroke-width="3"/>
        <text x="90" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#145a38">V1 首页上线</text>

        <circle cx="210" cy="140" r="14" fill="#d2efe0" stroke="#186b43" stroke-width="3"/>
        <text x="210" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#145a38">V2 稳定版</text>

        <circle cx="550" cy="140" r="17" fill="#186b43"/>
        <path d="M542 140 L548 146 L559 134" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="550" y="104" text-anchor="middle" font-size="14" font-weight="700" fill="#145a38">V3 Merge 合并回主线</text>

        <circle cx="320" cy="240" r="14" fill="#fcd9e8" stroke="#b8205d" stroke-width="3"/>
        <text x="320" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#a81d58">新开分支试改</text>

        <circle cx="440" cy="240" r="14" fill="#fcd9e8" stroke="#b8205d" stroke-width="3"/>
        <text x="440" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#a81d58">测试通过 ✓</text>

        <rect x="24" y="306" width="300" height="34" rx="17" fill="#fcd9e8"/>
        <circle cx="44" cy="323" r="6" fill="#d93876"/>
        <text x="58" y="329" font-size="15" font-weight="700" fill="#a81d58">feature 实验分支 · 让 AI 试改新排版</text>
      </svg>
    </div>`;
  }

  function branchDiagram(step, merged) {
    const node = (x, y, style, label, dy) =>
      `<circle cx="${x}" cy="${y}" r="11" class="ws-node ${style}"/>` +
      (label
        ? `<text x="${x}" y="${y + dy}" text-anchor="middle" class="ws-node-text">${label}</text>`
        : '');
    return `<div class="ws-branch-figure">
      <div class="ws-track-label"><b>🟢 main 主分支</b><span>放相对稳定的版本</span></div>
      <svg viewBox="0 0 440 165" role="img" aria-label="${merged ? '分支已合并回主线' : '从主线分出新分支，各自独立存档'}">
        <path class="ws-path-main" d="M24 42H416"/>
        ${step >= 3 ? '<path class="ws-path-bold" d="M74 42C108 42 108 118 152 118H305"/>' : ''}
        ${merged ? '<path class="ws-path-bold" d="M305 118C354 118 352 42 394 42"/>' : ''}
        ${node(74, 42, '', 'V1 个人主页', -18)}
        ${step >= 5 ? node(262, 42, '', '主线改：AI大白话', -18) : ''}
        ${step >= 4 ? node(172, 118, 'is-bold', '拉出实验分支', 28) : ''}
        ${step >= 5 ? node(295, 118, 'is-bold', '分支改：AI作品集', 28) : ''}
        ${merged ? node(394, 42, '', '合并 ✓', -18) : ''}
      </svg>
      <div class="ws-track-label ws-bold-label"><b>🌸 feature 实验分支</b><span>新开分支大胆试改</span></div>
    </div>`;
  }

  lessons[4] = {
    steps: branchSteps,
    render(root, step) {
      if (step < 3) {
        const [speaker, message] = chat[step];
        const tone = step === 0 ? 'is-rose' : step === 1 ? 'is-butter' : 'is-sage';
        const container = screen(
          root,
          'ws-conversation-flow',
          `
          ${overviewBranchFlowSvg()}
          <div class="ws-conv-single ${tone}">
            <span class="ws-badge">${speaker}</span>
            <h3>${step === 0 ? '不要什么大改动都在主分支上硬做' : step === 1 ? '主分支放稳定版，大改动新开分支实验' : '实验成功 Merge 合回，失败直接丢弃'}</h3>
            <p>${message}</p>
            <div class="ws-conv-dots">
              <i class="${step === 0 ? 'is-on' : ''}"></i>
              <i class="${step === 1 ? 'is-on' : ''}"></i>
              <i class="${step === 2 ? 'is-on' : ''}"></i>
            </div>
            ${
              step === 1 || step === 2
                ? `<div class="ws-prompt-wrap"><button type="button" class="ws-prompt-btn" data-ws-prompt="branch">${showBranchPrompt ? '收起 AI 提示词 ▴' : '💬 点我看让 AI 开分支的提示词 ▾'}</button>${showBranchPrompt ? '<div class="ws-prompt-box">「帮我从 main 主分支新开一条叫 feature-test 的分支，接下来大改都在这条分支上试，确认没问题我再让你合回主线。」</div>' : ''}</div>`
                : ''
            }
            <div class="ws-chat-action">${action(step === 2 ? '亲手演练拉分支与合并 →' : '看下一条原则 →', 'next')}</div>
          </div>`,
        );
        container.querySelector('[data-ws-prompt="branch"]')?.addEventListener('click', () => {
          showBranchPrompt = !showBranchPrompt;
          lessons[4].render(root, step);
        });
        nextOnClick(container, step);
        return;
      }

      if (step === 7) {
        renderSummaryCard(root, {
          badge: '模块 04 总结 · 分支开发与合并',
          mantra:
            '主分支（main）只放相对稳定的版本；要做大改动就新开一条分支（branch）去实验，改好再合并！',
          svg: `<svg viewBox="0 0 1160 118" role="img" aria-label="主分支与实验分支分工流程图">
            <rect x="10" y="12" width="356" height="94" rx="20" fill="#d2efe0"/>
            <text x="32" y="48" font-size="18" font-weight="700" fill="#145a38">① main 主分支（保稳定）</text>
            <text x="32" y="78" font-size="16" fill="#2b5e44">随时可演示、可交付的稳定版本放这里</text>
            <path d="M374 60 H414" stroke="#c83271" stroke-width="3.5"/><polygon points="418,60 406,53 406,67" fill="#c83271"/>
            <rect x="426" y="12" width="356" height="94" rx="20" fill="#fcd9e8"/>
            <text x="448" y="48" font-size="18" font-weight="700" fill="#a81d58">② 新开 branch 实验分支（试大改）</text>
            <text x="448" y="78" font-size="16" fill="#5e3447">大改排版、试新想法，改废直接丢也不伤主线</text>
            <path d="M790 60 H830" stroke="#186b43" stroke-width="3.5"/><polygon points="834,60 822,53 822,67" fill="#186b43"/>
            <rect x="842" y="12" width="308" height="94" rx="20" fill="#d6ecff"/>
            <text x="864" y="48" font-size="18" font-weight="700" fill="#164687">③ Merge 合并 &amp; 冲突拍板</text>
            <text x="864" y="78" font-size="16" fill="#325585">测试通过合回主线；撞车时由人拍板留哪版</text>
          </svg>`,
          points: [
            {
              title: '避开误区 4：别在主分支硬做大改',
              body: '主分支适合放相对稳定的版本；大改动直接往主分支怼，改崩了连保底版都没了。',
            },
            {
              title: 'Q&A：什么时候应该开分支？',
              body: '想让 AI 大改结构、尝试不确定能不能成的新功能、或者多人同时改不同板块时。',
            },
            {
              title: '遇到冲突（Conflict）不用慌',
              body: '冲突不是报错，只是两条分支改了同一行字，Git 停下来请你做选择题拍板。',
            },
          ],
        });
        return;
      }

      const merged = step === 6 && Boolean(branchChoice);
      let prompt;
      if (step === 6 && !merged) {
        prompt = `<div class="ws-vote">
          <strong>合并冲突（Conflict）：两边都改了网站首页标语，留哪句？</strong>
          <p>① main 主线：${titles.main}<br>② feature 分支：${titles.bold}</p>
          <div>${action('① 留主线标语', 'main', true)}${action('② 留分支标语', 'bold', true)}${action('③ 合并成主副标语', 'both')}</div>
        </div>`;
      } else if (merged) {
        prompt = `<div class="ws-vote">
          <strong>已合并到主线（merge 完成） ✓</strong>
          <p>网站最终标语：《${titles[branchChoice]}》</p>
          <div>${action('重新投票', 'again', true)}</div>
        </div>`;
      } else {
        const instructions = {
          3: [
            '1. 从 main 拉出 feature 实验分支',
            '这一刻，实验分支复制了主分支的全部稳定网页代码。接下来我们在实验分支上放手大改！',
            '在实验分支上试改首页标语 →',
          ],
          4: [
            '2. 在实验分支上改好并存档',
            '实验分支大胆换成了「文科生也能亲手做出的 AI 作品集」，上方的绿色主分支 main 一字没动！',
            '假如主线期间也微调了同一行标语？ →',
          ],
          5: [
            '3. 两边改了同一行，合并时撞车了！',
            '主线改成了「AI 大白话 · 陪你从零开始学 AI」，分支改成了「文科生也能亲手做出的 AI 作品集」。Git 请你拍板！',
            '开始合并（merge）投票定稿 →',
          ],
        };
        const [title, desc, label] = instructions[step];
        prompt = `<div class="ws-vote"><strong>${title}</strong><p>${desc}</p>${action(label, 'next')}</div>`;
      }
      const container = screen(root, 'ws-branch', branchDiagram(step, merged) + prompt);
      if (step !== 6) {
        nextOnClick(container, step);
        return;
      }
      container.querySelectorAll('[data-ws-action]').forEach((button) => {
        button.addEventListener('click', () => {
          branchChoice = button.dataset.wsAction === 'again' ? '' : button.dataset.wsAction;
          lessons[4].render(root, 6);
          root.querySelector('[data-ws-action]')?.focus({ preventScroll: true });
        });
      });
    },
  };
})();
