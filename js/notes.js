// 每节留出两三分钟给新进观众复述、给弹幕作答。所有台词都可以就地改。
(() => {
  'use strict';

  const cards = [
    {
      hook: '先问大家两个瞬间：你存过几个「最终版」论文？或者让 AI 改代码，改着改着好用的上一版找不回来了？扣 1 告诉我你中过哪一条。',
      beats: [
        ['两个崩溃瞬间', '对照左边「毕业论文_最终版_v7」和右边「AI 改崩找不回旧版」，点出今天为什么需要版本管理。'],
        ['Git 是什么', '翻到第 2 步：Git 不是网盘，是装在你电脑里的「版本档案柜」。只留一份文件，每次改好按顺序留档，断网也能用。'],
        ['Linus 10 天传奇', '沿时间线慢慢点：2002 用 BitKeeper → 2005 被收回免费授权卡脖子 → 4/3 Linus 自己动手写 → 4/7 存下第一版 → 4/16 Linux 全面接管。'],
        ['GitHub 登场', '拆开读 Git + Hub：2008 年把 Git 仓库搬上网并加上社区协作，2018 年被微软 75 亿美元收购，如今已有 1.8 亿开发者、6.3 亿仓库。']
      ],
      bridge: '有人问：现在都是 AI 帮我写代码了，我一个文科生为什么还要懂 Git？下一节现场演示 AI 把页面改崩怎么办。'
    },
    {
      hook: '你有没有让 AI 帮你改一个小地方，结果它顺手把原来对的地方也改乱了？今天我们把 AI 当成手快的实习生，给它配上「后悔药」。',
      beats: [
        ['AI 时代必学的 4 个理由', '先过一遍四张卡：快速回退、小步快跑、当看得懂的甲方、现代 AI 工具的地基（装 Claude Code 第一步就是装 Git）。'],
        ['小步快跑演练', '一步步点：先改粉色按钮 → 确认没问题立刻存档 #a1b2c3d → 再加动画改崩了（留 3 秒看歪掉的按钮）→ 一秒退回 #a1b2c3d，粉色还在！'],
        ['三种后悔药怎么选', '依次点开三个标签，重点念「直接对 AI 说」的人话口令：没存档用 Discard；自己本地退回用 Reset；已传上网多人共用一定用 Revert 反向抵消。'],
        ['庄子金句收尾', '读「言者所以在意，得意而忘言」和右侧 3 句保命口头禅，提醒大家截图保存——不用背命令，懂意思就能指挥 AI。']
      ],
      bridge: '知道为什么要存档后，Git 底层到底把我们的文件存在哪？下一节用一张图把「四个区域」和命令周转讲透。'
    },
    {
      hook: '很多同学问我：我明明只看见「电脑里的一个文件夹」和「GitHub 网页上的一个文件」，为什么教程里说有 4 个区域？另外两个藏在哪？到底什么是「仓库」？',
      beats: [
        ['什么是仓库？哪些可见、哪些隐藏？', '指着顶部的透视图讲：普通文件夹只放着最新一版，而「仓库（Repo）」= 明面文件夹 + 肚子里的 .git 隐藏暗格。你肉眼看见的是 01 工作区（电脑文件夹）和 04 远程仓库（GitHub 网页）；而 02 暂存区（挑文件打包的购物车）和 03 本地仓库（锁着 V1/V2/V3 历史版本的本机保险柜）默认隐藏在 .git 里，打开 GitHub 桌面版就能直观看到它们！'],
        ['6 大命令怎么在四区流转', '在流转沙盘上依次点 6 个按钮，让大家看清「出发区 → 到达区」：init 装上隐藏暗格、add 挑进购物车、commit 锁进本机档案柜、push 推上 GitHub 云端、clone/pull 拉回本地。'],
        ['实战演练 & 误区 3', '在 AI 个人主页编辑器里点「让 AI 试改一版」：强调误区 3——提交备注千万别为了偷懒随便写「111」「改了一下」，否则回头目标完全不清晰，不知道每版改了什么！'],
        ['回看红绿 Diff', '点 V1 和 V2 切换，看右侧红色删掉的旧按钮、绿色换上的樱花粉按钮——这就是本地仓库 .git 帮我们记下的精确账本。']
      ],
      bridge: '现在一条线上的存档搞懂了。但如果你的个人网站已经有一版能正常访问了，你想让 AI 试着大改一套新排版、又怕改崩原网站怎么办？这就到了第 4 节：分支。'
    },
    {
      hook: '很多新手踩的第四个大误区，就是不管什么大改动都直接在主分支（main）上硬改——结果 AI 改到一半报错，连原本好好的网站也瘫了！',
      beats: [
        ['误区 4 与分支流程图', '指着左侧双轨流程图：绿色 main 主分支只放相对稳定的版本；只要想做大改动，就拉出一条粉色 feature 实验分支去试，测试通过再 Merge 合回主线！'],
        ['拉分支改个人主页标语', '一步步点演练：从 main 拉出实验分支 → 在实验分支上把首页标语改成《文科生也能亲手做出的 AI 作品集》，上面绿色 main 主分支一字没动！'],
        ['撞车触发合并冲突', '推到冲突页：主线和实验分支改了同一行标语，触发合并冲突（Conflict）。强调：冲突不是报错，只是 Git 停下来请你做选择题拍板。'],
        ['弹幕投票定稿', '请弹幕扣 1 留主线标语、扣 2 留实验分支标语、扣 3 合并成主副标语，点击完成 Merge 合并！']
      ],
      bridge: '概念和原理都通了！接下来很多人最关心的问题来了：我不会用黑框命令行，到底怎么真正动手建仓库、传上 GitHub？'
    },
    {
      hook: '原理听懂了，今晚下播想自己试一下：电脑上要装什么？怎么把自己的项目传到 GitHub？我整理成了最简三件套和两条路径。',
      beats: [
        ['开工准备三件套', '过一遍三张卡：装 Git 引擎 + 装顺手的编辑器/AI 工具（VS Code/Cursor/Codex）+ 注册 GitHub 账号。'],
        ['安全红线 .gitignore', '依次点 .env、node_modules/ 和 index.html。重点提醒：存 API 密钥的 .env 千万不能传上公开仓库！直接让 AI 帮你配好 .gitignore。'],
        ['方式一：本地推上去', '模拟先有本地文件夹：本地 init + commit → GitHub 点 New repository（顺带讲清 Public 公开 vs Private 私有）→ 绑定地址推送上线。'],
        ['方式二：克隆到本地同步', '模拟先在 GitHub 建仓：点绿色 Code 复制地址 clone 到桌面 → 云端有更新 ↓1 先 pull 拉回 → 本地存了新版本 ↑2 再 push 推上去。']
      ],
      bridge: '传上 GitHub 之后，页面上密密麻麻的英文按钮都是干嘛的？最后这一节我们把 GitHub 界面、开源协作和我的 28 次真实记录全部串起来！'
    },
    {
      hook: '前面学的 init、.gitignore、commit、分支和 GitHub 协作，在真实项目里到底长什么样？我们先逛一圈 GitHub 页面，再翻开我自己的 28 次真实存档。',
      beats: [
        ['一页逛懂 GitHub', '点一遍仓库热点：Star 像赞+收藏、Fork 像抄作业二创、Issues 像评论区、PR 像递修改稿、README 是置顶说明书、Releases 下成品软件；顺带提按句号「.」开网页版 VS Code。'],
        ['开源协作 4 步流', '讲清陌生人怎么合写一个项目（Fork → 分支改 → 发 PR → Review & Merge），切换看 OpenClaw（3,808 陌生人共创）、DeepSeek-V3 和 996.ICU。'],
        ['翻开我的 28 次真实存档', '依次切四章：建站 Initial commit → 一夜 11 次小步快跑（重点点开 9be3ae6 的 .gitignore 清理和 4e6da0c 删 458 行）→ 写 DeepSeek 文章补图 → 换柠檬绿主题与拆出小工具。'],
        ['压轴：干中学不焦虑', '翻到最后一屏「普通人懂到哪就能直接开干？」：给观众吃定心丸——掌握绿色卡片的 4 件事（够用 80%），今晚就能独立用 AI 做个人网站和小工具，其余用到再查！']
      ],
      bridge: '现在轮到你了！论文、简历、个人网站还是效率小工具？弹幕告诉我你今晚最想用 AI 做的第一个项目，我们一起把这套流程串一遍。'
    }
  ];

  const opening = '大家好，我是李贝拉Bela，AI 大白话，陪大家从零开始学 AI。今晚 90 分钟，我不让大家死记硬背满屏命令行，而是从大家网上最常问的真实痛点和 6 大误区出发，带你用大白话搞懂 Git 和 GitHub 怎么配合，最后翻开我做个人网站的 28 次真实存档，告诉你普通人懂到哪就能直接开干。';
  const closing = '今晚咱们把 Git 和 GitHub 的底层逻辑全串了一遍，最后记住那句话：不要焦虑学完才动手，先用今晚绿色卡片那 4 个动作干起来，干中学、边做边优化！想看一个文科生继续用 AI 折腾各种真实小工具和网站，记得点个关注。';
  const programs = window.BelaPrograms;
  const menu = document.getElementById('notes-menu');
  const card = document.getElementById('notes-card');
  let current;

  function textElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function block(title, text, className) {
    const section = document.createElement('section');
    section.className = className;
    section.append(textElement('h3', title), textElement('p', text));
    return section;
  }
  function render() {
    const fragment = location.hash.slice(1);
    const index = /^[1-6]$/.test(fragment) ? Number(fragment) - 1 : 0;
    if (current === index) return;
    current = index;
    const program = programs[current];
    const script = cards[current];
    const header = document.createElement('header');
    const startMinute = 3 + current * 14;
    header.append(textElement('span', `第 ${current + 1} 节 / 共 6 节　·　建议第 ${startMinute}–${startMinute + 14} 分钟`, 'notes-meta'), textElement('h2', program.title));
    const beats = document.createElement('ol');
    beats.className = 'notes-beats';
    script.beats.forEach(([label, line]) => {
      const row = document.createElement('li');
      row.append(textElement('strong', label), textElement('p', line));
      beats.append(row);
    });
    const quiz = program.quiz;
    const vote = block('弹幕投票 · 主屏按 Q', quiz.question, 'notes-vote');
    const choices = document.createElement('div');
    choices.className = 'notes-choices';
    quiz.choices.forEach((choice, i) => choices.append(textElement('span', `扣 ${i + 1}　${choice}`)));
    vote.append(choices, textElement('p', `答案 ${quiz.answer + 1}。${quiz.why}`, 'notes-answer'));
    card.replaceChildren(header);
    if (current === 0) card.append(block('全场开播 · 前 3 分钟', opening, 'notes-bridge'));
    const hook = block('本节开场', script.hook, 'notes-hook');
    hook.append(textElement('p', `刚进来的朋友：${program.intro}`, 'notes-recap'));
    card.append(hook, beats, vote, block(current === 5 ? '互动收口' : '接到下一节', script.bridge, 'notes-bridge'));
    if (current === 5) card.append(block('全场收尾 · 最后 3 分钟', closing, 'notes-hook'));
    [...menu.querySelectorAll('a')].forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${program.short} · 直播提词卡`;
    window.scrollTo(0, 0);
  }
  menu.append(textElement('p', '选择节目', 'notes-menu-title'));
  programs.forEach((program, i) => {
    const link = document.createElement('a');
    link.href = `#${i + 1}`;
    link.append(textElement('kbd', i + 1), textElement('span', program.short));
    menu.append(link);
  });
  menu.append(textElement('p', '按 1–6 切换提词卡', 'notes-hint'), block('90 分钟节奏', '开播 3 分钟，每节 14 分钟，最后留 3 分钟收尾。有人中途进来，就在下一次点击前复述顶部「刚进来的朋友」那句话。', 'notes-rundown'));
  window.addEventListener('hashchange', render);
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    if (/^[1-6]$/.test(event.key)) { event.preventDefault(); location.hash = event.key; }
  });
  render();
})();
