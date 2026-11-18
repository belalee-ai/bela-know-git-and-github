# Bela OS 项目维护指南

本文件是 Codex、Claude Code、Antigravity 及其他开发工具共用的维护入口。先读 README.md 确认所在分支，再读 docs/brief.md 核对本轮要交付的互动。

## 写给谁

李贝拉Bela 用这张桌面给第一次接触 Git 的观众上直播课。每节都要能从中间加入。用论文版本、存档和投稿讲清楚概念，英文术语首次出现时给出中文意思。Git 需要主动提交才能留下存档，GitHub 上的演示操作只改变本页状态。

## 修改入口

- 首页、窗口切换和全局快捷键由 index.html、css/ 和 js/app.js 负责。每节的互动单独注册到 window.BelaLessons。
- js/programs.js 保存节目标题、入场提示和投票题。js/notes.js 保存开场、讲述要点与过渡语，第二块屏幕打开 notes.html。
- data/ 保存真实案例、术语和统计快照。改变数字先查 docs/sources.md 的原始来源，并更新采样日期。演示文案与作者真实经历分开标记。
- assets/ 只提交网页确实引用且已获公开授权的素材。assets/ref/ 只供本地对照。
- main 存放共享输入与检查工具。此次 GPT 实现在 build/gpt 对应的独立工作区；其他实现应使用自己的分支，避免覆盖对方。

## 修改与验收

1. 先运行 git status，保留已有改动。用 HTML、CSS 和原生 JavaScript，脚本通过相对路径加载。运行网页只需浏览器。
2. 在 1920×1080 画布中，给右下 400×300 留出摄像头位置。压缩后仍应读得清，正文按至少 28px 设计。输入框内保留正常的编辑键。
3. 在有网页实现的分支运行 `node scripts/check-offline.mjs`、`node scripts/shoot.mjs`。打开生成的截图检查文字、弹层和摄像头空位，再双击 index.html 走一遍改论文、存档和恢复。
4. 一个能独立讲清的成果作一次提交。类型用 feat、fix、docs、test 或 refactor，冒号后用中文描述观众或维护者能做什么，例如 `feat: 让观众点开论文存档看修改记录`。公开操作按当次授权进行。

CLAUDE.md 引用本文件。修改共用规则时只更新这里。
