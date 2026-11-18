# Bela OS · 文科生也能懂的 Git & GitHub

李贝拉Bela 的离线直播桌面。用一篇改到 v7 的毕业论文，讲清 Git 怎样记住版本，以及 GitHub 怎样让别人一起改。

## 明天怎么开播

1. 双击本目录里的 [index.html](index.html)，把浏览器全屏，OBS 或直播伴侣采集这个窗口。右下角留给摄像头。
2. 将 [notes.html](notes.html) 放到第二块屏幕。六节各安排 14 分钟，开场和收尾各 3 分钟。数字键在各自窗口里切节。
3. 按 **1** 从论文开始；想先让观众看到 Git 有什么用，可以按 **5**，先演示 AI 改坏网页再恢复。喝水时按 **L** 放大静音回顾。

从 GitHub 获取时，[下载完整直播分支 ZIP](https://github.com/belalee-ai/bela-know-git-and-github/archive/refs/heads/build/gpt.zip)，解压后再打开首页。所有字体、图片和数据都在文件夹里。

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
node scripts/shoot.mjs --tour
```

检查工具使用 Node.js 22 或以上版本及本机 Chrome / Chromium。通过 `CHROME_PATH` 可以指定浏览器可执行文件。观众打开网页只需要浏览器。

节目互动分放在 `js/lessons-workshop.js`（第 1、2、5 节）和 `js/lessons-gallery.js`（第 3、4、6 节）。更换讲词改 `js/notes.js`，更换题目改 `js/programs.js`。两条浏览器检查分别输出关键互动和逐屏截图。交付记录见 [BUILD_NOTES.md](BUILD_NOTES.md)。
