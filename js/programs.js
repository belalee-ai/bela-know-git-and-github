window.BelaPrograms = [
  {
    short: '论文时光机',
    title: '论文的最终版，到底是哪一版？',
    intro: 'Git 给论文留个存档。',
    icon: 'disk',
    quiz: {
      question: '电脑没联网，还能给论文存一版吗？',
      choices: ['能，在本机存档', '要先登录 GitHub'],
      answer: 0,
      why: 'Git 把版本记在这台电脑上。连上网以后，还可以把它们传到 GitHub。',
    },
  },
  {
    short: '平行宇宙',
    title: '同一篇论文，试两种写法',
    intro: '分支像另一份草稿。',
    icon: 'butterfly',
    quiz: {
      question: '两个人改了同一句，合并时谁来定稿？',
      choices: ['总是选最后改的', '由人来选保留什么'],
      answer: 1,
      why: '遇到冲突，Git 会指出分歧。写作者可以选其中一句，也可以重新写。',
    },
  },
  {
    short: '逛逛 GitHub',
    title: '去 GitHub 逛一个作品',
    intro: 'Git 留版本，GitHub 一起改。',
    icon: 'phone',
    quiz: {
      question: '只提交了标题。推送后朋友拉取，会收到哪处修改？',
      choices: ['只有新标题', '新标题和新署名'],
      answer: 0,
      why: '朋友收到已提交的标题。新署名还留在你的工作区。',
    },
  },
  {
    short: '开源名人堂',
    title: '一个人的作品，大家怎么一起改？',
    intro: '作品开源，大家可以一起改。',
    icon: 'star',
    quiz: {
      question: '给一个项目点了星标，代表什么？',
      choices: ['我参与写了代码', '我想收藏或支持它'],
      answer: 1,
      why: '星标和贡献者是两种统计。收藏、提出想法和提交修改是不同的参与方式。',
    },
  },
  {
    short: 'AI 后悔药',
    title: 'AI 把网页改坏了，怎么办？',
    intro: '先存档，改坏能回去。',
    icon: 'headphones',
    quiz: {
      question: '请 AI 再加一个动画前，先做哪件事？',
      choices: ['把能用的版本存下来', '等全改完再说'],
      answer: 0,
      why: '先确认当前页面能用，再留一个清楚的存档。出了问题，能找到出发的地方。',
    },
  },
  {
    short: '我的 28 次存档',
    title: '一个文科生的 28 次存档',
    intro: '翻开我的网站存档。',
    icon: 'disc',
    quiz: {
      question: '哪句存档留言，明天的你更容易看懂？',
      choices: ['又改了一下', '把首页按钮从粉色换成绿色'],
      answer: 1,
      why: '留言写清这次做成了什么，回看时更容易找到想要的版本。',
    },
  },
];
