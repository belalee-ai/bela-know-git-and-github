// 这些是备课时固定的快照。来源、采集口径和复核办法见 docs/sources.md。
window.DATA = window.DATA || {};
window.DATA.facts = {
  snapshotDate: "2026-11-18",
  gitTimeline: [
    { date: "2002", label: "内核团队用上 BitKeeper", detail: "许多人一起改 Linux 内核，用同一个工具交换修改。" },
    { date: "2005", label: "免费授权收回", detail: "原来的工具用不下去了，团队需要自己的版本管理工具。" },
    { date: "2005-04-03", label: "Linus 开始写 Git", detail: "他想让散落在不同电脑上的修改，也能快速汇到一起。" },
    { date: "2005-04-07", label: "Git 有了自己的第一份存档", detail: "这条记录的编号以 e83c516 开头，今天还能翻出来。" },
    { date: "2005-04-16", label: "Linux 内核有了 Git 起点", detail: "今天的内核仓库从这一版开始保存历史，编号以 1da177e 开头。" }
  ],
  projects: {
    openclaw: {
      name: "OpenClaw", label: "一个周末项目", stars: 394742, forks: 82923, contributors: 3808, commits: 130026,
      date: "2026-11-18", created: "2025-11-24", creator: "Peter Steinberger",
      detail: "Peter 做的个人 AI 助手开放了源代码，后来许多人一起改进它。",
      names: ["Clawdbot", "Moltbot", "OpenClaw"]
    },
    linux: {
      name: "Linux", label: "内核的源代码", stars: 256170, date: "2026-11-18",
      detail: "打开内核仓库，能看到一代代开发者怎样修改同一份作品。"
    },
    deepseekV3: {
      name: "DeepSeek-V3", label: "模型也有项目说明书", stars: 104865, date: "2026-11-18",
      detail: "仓库里公开了模型介绍、推理代码和使用方法。"
    },
    deepseekR1: {
      name: "DeepSeek-R1", label: "读懂模型的使用说明", stars: 92045, date: "2026-11-18",
      detail: "研究团队把模型说明、评测结果和使用入口整理在同一个仓库。"
    },
    icu996: {
      name: "996.ICU", label: "大家一起写一份资料", stars: 277238, date: "2026-11-18",
      detail: "参与者用仓库整理工作时间相关的资料，还把介绍翻译成多种语言。"
    }
  },
  github: { year: 2025, developers: 180000000, repositories: 630000000, acquisitionYear: 2018, acquisitionUSD: 7500000000 }
};
