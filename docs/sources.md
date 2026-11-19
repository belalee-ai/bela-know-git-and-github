# 直播数据来源

数据随页面一起保存，直播时可离线读取。更新数字时请同时改掉对应日期；同一张卡的数字尽量同日采集。

## 个人网站的 28 次存档

选取公开项目 belalee-website 的第一条提交到 `941ca8e72cf41d1bbc87457f2ad214587e326cea`，按提交顺序呈现。日期使用原提交的作者时间（UTC+08:00）。编号和增删行数来自 Git；二进制文件无法按行统计，不计入行数。首次提交新增 22,973 行，包含项目中的文本配置和其他文件。[固定版本的提交历史](https://github.com/belalee-ai/belalee-website/commits/941ca8e72cf41d1bbc87457f2ad214587e326cea)

`data/commits.js` 的 `summary` 是简明转述，`note` 是根据这次改动写给观众的简短观察或提问。`subject` 保存标题，迁出工具的那条仅节选到项目动作，省略目录信息。四章按时间分组，其中第二章恰好是 4 月 10 日 23:40 至次日 00:38 的 11 条。4 月 15 日的工具箱更新在第三章开头承接到文章制作，避免把它算进那一夜。

在该网站仓库运行以下命令即可复核记录和行数。

```sh
git log --reverse --format='%h %aI %s' --shortstat 941ca8e
git rev-list --count 941ca8e
```

## 名人堂快照

2026-11-18 取自 GitHub REST API。星数是用户点亮的星标数，不能换算成使用人数。每项数据随页面冻结。

| 项目 | 星标 | 原始记录 |
| --- | ---: | --- |
| OpenClaw | 394,742 | [GitHub 仓库数据](https://api.github.com/repos/openclaw/openclaw) |
| Linux | 256,170 | [GitHub 仓库数据](https://api.github.com/repos/torvalds/linux) |
| DeepSeek-V3 | 104,865 | [GitHub 仓库数据](https://api.github.com/repos/deepseek-ai/DeepSeek-V3) |
| DeepSeek-R1 | 92,045 | [GitHub 仓库数据](https://api.github.com/repos/deepseek-ai/DeepSeek-R1) |
| 996.ICU | 277,238 | [GitHub 仓库数据](https://api.github.com/repos/996icu/996.ICU) |

OpenClaw 同次快照有 82,923 个 fork。贡献者约 3,808 位，按包含匿名作者的贡献者列表计数，未经自然人去重。默认分支有 130,026 次提交。两个列表以每页 1 条请求，从响应头 `Link` 的最后一页页码取数。[贡献者接口](https://api.github.com/repos/openclaw/openclaw/contributors?per_page=1&anon=1) · [默认分支提交接口](https://api.github.com/repos/openclaw/openclaw/commits?per_page=1)

仓库创建于 2025 年 11 月 24 日。作者 Peter Steinberger 回顾，起初只是个人周末项目。早期名称依次为 Clawdbot、Moltbot、OpenClaw。[作者介绍](https://openclaw.ai/blog/introducing-openclaw) · [项目历史](https://docs.openclaw.ai/start/lore)

## Git 的来历与 GitHub 的规模

- 2002 年，Linux 内核项目采用 BitKeeper。2005 年，免费授权收回，Linus 和其他开发者开始制作自己的工具。[Git 官方历史](https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git.html)
- 2005 年 4 月 3 日，Linus 开始写 Git。4 月 7 日，Git 记录下第一条提交。[Linux 基金会回顾](https://www.linuxfoundation.org/blog/blog/the-greatness-of-git) · [Git 项目的首次提交](https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290)
- 现有 Linux 内核主线仓库从 4 月 16 日的 Linux-2.6.12-rc2 开始。这个日期直接对应可打开的记录，早于第一条 Git 记录的内核开发历史另有归档。[内核主线首次提交](https://github.com/torvalds/linux/commit/1da177e4c3f41524e886b7f1b8a0c1fc7321cac2)
- 2025 年 Octoverse 报告列出超过 1.8 亿开发者、共 6.3 亿个仓库。收购金额是微软 2018 年公布的 75 亿美元。[GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) · [微软收购公告](https://news.microsoft.com/source/2018/06/04/microsoft-to-acquire-github-for-7-5-billion/)
- Linus Torvalds 肖像（`assets/portraits/linus.jpg`）取自 Wikimedia Commons `LinuxCon_Europe_Linus_Torvalds_03_(cropped).jpg`（CC BY-SA 3.0 公开授权）。

## 术语与类比

术语翻译机将 Git 和 GitHub 文档里的操作转成大白话。「存档」指一次 commit，「投稿」指发起 pull request。「论文」「游戏存档」和「点赞收藏」是帮助解释的类比。[GitHub 关于 Git 的说明](https://docs.github.com/en/get-started/using-git/about-git) · [GitHub 官方术语表](https://docs.github.com/en/get-started/learning-about-github/github-glossary)

第 3 节用一篇稿的两处修改演示分块暂存。提交记录暂存内容，推送把提交送到远端，朋友拉取后在自己的分支上看到新版本。演示从双方已有同一版本、朋友没有额外改动的状态开始。提词卡还给出了 VS Code 里暂存所选行的做法。[Git 官方书：选择本次提交的改动](https://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging) · [Git 官方书：使用远程仓库](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) · [VS Code 官方图解](https://code.visualstudio.com/docs/sourcecontrol/staging-commits#_stage-specific-lines-or-code-blocks)

第 6 节把仓库可见性与写入权限分别讲解。网页上传时由操作者明确选择文件；本地的 `.gitignore` 匹配尚未跟踪的文件。[GitHub 仓库说明](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) · [Git 忽略规则](https://git-scm.com/docs/gitignore)
