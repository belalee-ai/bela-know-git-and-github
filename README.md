# Bela OS · 文科生也能懂的 Git & GitHub

李贝拉Bela 的离线直播桌面。用一篇改到 v7 的毕业论文，讲清 Git 怎样记住版本，以及 GitHub 怎样让别人一起改。

## 找到直播网页

[打开网页实现分支 build/gpt](https://github.com/belalee-ai/bela-know-git-and-github/tree/build/gpt)。下载该分支的 ZIP 并解压，或在克隆后切换到 `build/gpt`，双击其中的 `index.html`。第二块屏幕打开 `notes.html` 看主讲提词卡。网页和素材都在本地，直播时可以断网。

默认分支 `main` 是两种实现共用的起点，保存维护指南、数据与验收工具。GitHub 的提交记录用中文分阶段描述这张桌面是怎样做出来的。

## 操作

| 操作 | 快捷键 |
| --- | --- |
| 打开六节节目 / 回到桌面 | 1–6 / 0 或 Esc |
| 上一步 / 下一步 | ← / → |
| 放大 30 秒回顾 / 打开术语翻译机 | L / T |
| 本节弹幕小测 / 主讲提词卡 | Q / N |

## 交接

开发工具从 [AGENTS.md](AGENTS.md) 开始，Claude Code 也可从 [CLAUDE.md](CLAUDE.md) 进入。六节内容与直播验收要求见 [网页任务书](docs/brief.md)，真实数据可在[来源与复核方法](docs/sources.md)中核对。在实现分支运行以下检查，截图输出到本机的 `shots/`。

```sh
node scripts/check-offline.mjs
node scripts/shoot.mjs
```

检查工具使用 Node.js 22 或以上版本及本机 Chrome / Chromium。通过 `CHROME_PATH` 可以指定浏览器可执行文件。观众打开网页只需要浏览器。
