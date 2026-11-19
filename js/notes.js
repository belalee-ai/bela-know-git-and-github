// 每节留出两三分钟给新进观众复述、给弹幕作答。所有台词都可以就地改。
(() => {
  'use strict';

  const cards = [
    {
      hook: '你交过的“最终版”后面加过几个字？弹幕打一个你真用过的文件名。假设老师现在要上周三那一版，我们用它试试。',
      beats: [
        ['念文件名', '把“毕业论文、最终版、真的最终版、v7”慢慢念出来。读一个刚收到的文件名，请大家猜哪一份还能放心交。'],
        ['改一句', '翻到论文编辑器，用弹幕给的词改一句话，点「存档」。请大家盯住时间线新长出来的点。'],
        ['回看两版', '再改一句、再存一次。点回旧存档，然后切回最新的，读出红色删掉的字和绿色加上的字。'],
        ['说清何时存', '游戏打到难关前要自己按存档键。Git 也是，你想留下的这一步，要请它记下来。']
      ],
      bridge: '导师喜欢稳妥版，你又想试个更大胆的标题。两条路可以先都留着。'
    },
    {
      hook: '论文已经能交了，我突然想把标题全换掉。你会先交，还是先另存一份偷偷试？',
      beats: [
        ['让两个人对话', '按 →，一句句念小王和贝拉的聊天。念到给草稿起名时停一下，让大家取个大胆版的名字。'],
        ['从主线分出去', '指着分叉点说：“在这一刻，两份稿子一样。”在大胆版存两次，看看主线那条线动了没有。'],
        ['合并遇到选择', '翻到两边都改同一句的地方。读出两种标题，请弹幕选主线、大胆版或两句都要，点票多的那个。'],
        ['让观众复述', '问：“如果两个人改的是不同段落呢？”很多时候 Git 可以自动合起来；同一句怎么写，才要人决定。']
      ],
      bridge: '草稿还在我的电脑上。要请屏幕那头的人一起改，我得先把项目放到一个大家都找得到的地方。'
    },
    {
      hook: '我把标题和署名都改了。现在只想给朋友看新标题，署名再想一晚。你猜，点存档以后朋友就看得见了吗？',
      beats: [
        ['先看三份旧稿', '点「试试只发一处」。朋友第一次拿整份项目叫克隆，这里双方都已有 V1。以后朋友只需要拉取更新。'],
        ['改两处，只选一处', '点改两处，勾标题。可以先勾上署名再取消，让大家看见字还在。提交后，指给大家看只有本机存档变成 V2。有观众问实际怎么选？在 VS Code 的源代码管理打开文件差异，选中标题那一行，右键选「暂存所选范围」。'],
        ['先推，再拉', '点推送，停在朋友还拿着旧稿的画面。请弹幕猜朋友拉取后署名会是什么，再点拉取。对照朋友手里的旧署名和工作区里的新署名。想重演就换选署名。'],
        ['再逛仓库', '按 → 回到仓库热点。Star 是收藏，Fork 是拿一份去改，Issue 是提意见，PR 是把改好的版本交给作者。最后按 Q，让刚进来的朋友判断哪一处被分享。']
      ],
      bridge: '刚才逛的是我的小仓库。换成几千个人一起改，页面上还能看到哪些痕迹？'
    },
    {
      hook: '要是好多人各自在家改同一份作品，最后谁知道哪些修改该放在一起？Linux 的开发者就遇到过这个问题。',
      beats: [
        ['沿时间线走', '慢慢点 Linus 的时间点。停在 Git 保存自己的第一份记录，再前进一步，看看 Linux 内核也从哪里开始留档。'],
        ['猜贡献人数', '先请大家猜一个人做的 AI 助手，公开以后会有多少人参与。翻到 OpenClaw，读采样日期，再揭晓贡献者人数。'],
        ['看懂星标', '快闪 DeepSeek 和 996.ICU。一份放模型和用法，一份整理资料。星标是别人做的标记，写过修改的人才会出现在贡献记录里。'],
        ['看全站规模', '最后停在 GitHub 规模页，先报报告年份，再读人数和仓库数。一位开发者可以有好几个仓库。']
      ],
      bridge: '听到这里也许有人想：我就一个人，还请 AI 写代码，为什么也要留档？我们来试一次改坏的现场。'
    },
    {
      hook: '你请 AI 改过什么，结果它连原来对的地方也改了？弹幕里说一句。我这边先让它改个按钮，咱们一起盯着。',
      beats: [
        ['记住好版本', '在模拟聊天里点改粉色。等预览变粉，指给大家看存档状态。这一次，助手替我们做了提交。'],
        ['故意再试一步', '再请它加动画。先别点恢复，留几秒让大家看出哪儿坏了，然后问想回到最初还是刚才的粉色版。'],
        ['回去再验证', '点「回到上一个存档」。要验证两件事：按钮回来了吗？刚才做对的粉色还在吗？'],
        ['用人话选退路', '三张卡逐个看：还没存就丢掉这次改动，自己独立试验可以回到旧起点，共享历史则用一份反向修改抵消。']
      ],
      bridge: '下次可以直接跟 AI 说：“这一步我看过了，帮我留个存档。”我拿自己的网站记录，让大家看这句话留下了什么。'
    },
    {
      hook: '屏幕上是我自己做的网站。你猜我一晚上存了几次？随便挑一条，我们看看那晚到底改了什么。',
      beats: [
        ['看第一章', '点第一条，再点下一条。看右侧的人话说明和增删行数，一次是搭起网站，一次是调整发布设置。'],
        ['看打磨的那一夜', '切第二章，对照第一条和最后一条的时间。让弹幕点一个中间的编号，现场读那一步具体在修什么。'],
        ['看后来怎么改', '第三章找 DeepSeek 文章，再到第四章看换主题、做小工具、把工具搬出去。删除行数也能讲一段有意义的故事。'],
        ['跟着做三个动作', '进入本地练习，模拟注册、建示例仓库、选择 README.md，再确认存档。请观众在最后一屏把这三个动作复述出来。']
      ],
      bridge: '现在轮到你了。论文、简历、作品集，哪一份你最想留个能翻回去的版本？挑一个发出来，我拿它把整场串一次。'
    }
  ];

  const opening = '大家好，我是李贝拉Bela，文科生。我用 AI 做了个个人网站，后来把整站从粉色换成了柠檬绿。你要看它以前什么样，我还能翻回去。今天拿大家都写过的文档，看看这件事是怎么做到的。';
  const closing = '刚刚你们看到了，我连把页面从粉色换成绿色都留着记录。想看一个文科生怎么跟 AI 商量、哪里改坏了、最后怎么修回来，可以关注我。我会继续拿自己做的东西，点开给大家看。';
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
    hook.append(textElement('p', `刚进来的朋友，${program.intro}`, 'notes-recap'));
    card.append(hook, beats, vote, block(current === 5 ? '请观众选自己的作品' : '接到下一节', script.bridge, 'notes-bridge'));
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
  menu.append(textElement('p', '按 1–6 切换提词卡', 'notes-hint'), block('90 分钟节奏', '开播 3 分钟，每节 14 分钟，最后留 3 分钟收尾。有人中途进来，就在下一次点击前复述开场卡的最后一句。', 'notes-rundown'));
  window.addEventListener('hashchange', render);
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    if (/^[1-6]$/.test(event.key)) { event.preventDefault(); location.hash = event.key; }
  });
  render();
})();
