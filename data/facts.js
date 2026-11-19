// 这些是备课时固定的快照。来源、采集口径和复核办法见 docs/sources.md。
window.DATA = window.DATA || {};
window.DATA.facts = {
  snapshotDate: "2026-11-18",
  gitTimeline: [
    { date: "2002", label: "几千人合写 Linux 系统", detail: "全球几千名程序员一起改 Linux 系统代码，当时免费借用商业工具 BitKeeper 来管理版本。" },
    { date: "2005", label: "突然被收回免费授权", detail: "合作出现纠纷，原来的工具一夜之间停止免费授权，几千人的协作项目面临停摆。" },
    { date: "2005-04-03", label: "创始人 Linus 自己动手", detail: "找不到顺手的替代品，Linux 创始人 Linus 决定闭关自己写一个版本工具——取名 Git。" },
    { date: "2005-04-07", label: "仅用 4 天，Git 存下第一版", detail: "只写了 4 天，Git 就能给自己的代码存档了。第一条存档编号 e83c516 今天还能翻出来。" },
    { date: "2005-04-16", label: "管起全世界的代码", detail: "Linux 正式换用 Git 管版本（编号 1da177e）。一个被逼出来的工具，后来成了整个软件和 AI 世界的基石。" }
  ],
  projects: {
    openclaw: {
      name: "OpenClaw", label: "从周末小项目到近 40 万星", stars: 394742, forks: 82923, contributors: 3808, commits: 130026,
      date: "2026-11-18", created: "2025-11-24", creator: "Peter Steinberger",
      detail: "作者 Peter 起初只是周末顺手做个个人 AI 助手，把源码公开到 GitHub 后，全球 3,808 位陌生人接力帮他改出了 13 万次存档。",
      names: ["Clawdbot", "Moltbot", "OpenClaw"]
    },
    linux: {
      name: "Linux", label: "内核的源代码", stars: 256170, date: "2026-11-18",
      detail: "打开内核仓库，能看到一代代开发者怎样修改同一份作品。"
    },
    deepseekV3: {
      name: "DeepSeek-V3", label: "国产开源大模型代表作", stars: 104865, date: "2026-11-18",
      detail: "GitHub 不只放小工具——顶尖 AI 大模型的说明书、推理代码和使用方法也在这里公开，全球超 10 万人点星收藏。"
    },
    deepseekR1: {
      name: "DeepSeek-R1", label: "读懂模型的使用说明", stars: 92045, date: "2026-11-18",
      detail: "研究团队把模型说明、评测结果和使用入口整理在同一个仓库。"
    },
    icu996: {
      name: "996.ICU", label: "几十万人接力写一份文档", stars: 277238, date: "2026-11-18",
      detail: "GitHub 不只能放代码！参与者用这个仓库共同整理工作时间相关的资料，还合力翻译成多国语言——它是全球最大的文档共创平台。"
    }
  },
  github: { year: 2025, developers: 180000000, repositories: 630000000, acquisitionYear: 2018, acquisitionUSD: 7500000000 }
};
