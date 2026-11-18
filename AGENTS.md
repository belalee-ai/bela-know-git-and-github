# Bela OS 项目维护指南

本文件是 Codex、Claude Code、Antigravity 及其他开发工具共用的维护入口。先读 README.md 了解运行方式，再读 docs/brief.md 核对本轮要交付的互动。

## 写给谁

李贝拉Bela 用这张桌面给第一次接触 Git 的观众上直播课。每节都要能从中间加入。用论文版本、存档和投稿讲清楚概念，英文术语首次出现时给出中文意思。Git 需要主动提交才能留下存档，GitHub 上的演示操作只改变本页状态。

## 修改入口

- 首页、窗口切换和全局快捷键由 index.html、css/ 和 js/app.js 负责。每节的互动单独注册到 window.BelaLessons。
- js/programs.js 保存节目标题、入场提示和投票题。js/notes.js 保存开场、讲述要点与过渡语，第二块屏幕打开 notes.html。
- data/ 保存真实案例、术语和统计快照。改变数字先查 docs/sources.md 的原始来源，并更新采样日期。演示文案与作者真实经历分开标记。
- assets/ 只提交网页确实引用且已获公开授权的素材。assets/ref/ 只供本地对照。
- 默认分支 `main` 包含完整网页、直播素材、数据和检查工具。下载、演示和后续维护都从这里开始。

## 修改与验收

1. 先运行 git status，保留已有改动。用 HTML、CSS 和原生 JavaScript，脚本通过相对路径加载。运行网页只需浏览器。
2. 在 1920×1080 画布中，给右下 400×300 留出摄像头位置。教学正文至少 28px，观众主屏连同常驻工具最多 80 个可见汉字。输入框内保留正常的编辑键。
3. 在项目根目录运行 `node scripts/check-offline.mjs`、`node scripts/shoot.mjs`。打开生成的截图检查文字、弹层和摄像头空位，再双击 index.html 走一遍改论文、存档和恢复。
4. 一个能独立讲清的成果作一次提交。类型用 feat、fix、docs、test 或 refactor，冒号后用中文描述观众或维护者能做什么，例如 `feat: 让观众点开论文存档看修改记录`。公开操作按当次授权进行。

CLAUDE.md 引用本文件。修改共用规则时只更新这里。
