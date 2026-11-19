// 供本地页面直接读取；aliases 也参与搜索。
window.DATA = window.DATA || {};
window.DATA.glossary = [
  { term: "Git", tag: "基础概念", meaning: "装在电脑里的版本管理系统。不用复制 7 个「最终版」，同一个文件每次改好主动存一版，随时对比和回退。", tip: "断网也能在自己电脑本地存档。", aliases: ["版本管理", "档案柜", "本地", "时光机"] },
  { term: "GitHub", tag: "基础概念", meaning: "全球最大的 Git 仓库托管网站（Git + Hub 聚集地），像代码界的小红书。能云端备份作品，也能开源协作。", tip: "Git 管本地版本，GitHub 管云端备份与社交协作。", aliases: ["云端", "协作", "代码托管", "小红书"] },
  { term: "Working Directory", tag: "四大区域", meaning: "工作区。就是你电脑文件夹里肉眼看见、正在直接打字修改的那些文件。", tip: "还没存档前的修改都待在工作区。", aliases: ["工作区", "文件夹", "本地文件"] },
  { term: "Staging Area", tag: "四大区域", meaning: "暂存区（打包待提交区）。把你准备纳入本次存档的改动挑进来，没挑进来的可以先不存。", tip: "对应命令 git add；现代编辑器点提交常自动帮你打包。", aliases: ["暂存区", "打包区", "index", "草稿箱"] },
  { term: "Local Repository", tag: "四大区域", meaning: "本地仓库。藏在项目文件夹里的 .git 隐藏目录，存放你在本机拍下的全部历史版本快照。", tip: "删掉 .git 文件夹，历史版本记录就没了。", aliases: ["本地仓库", ".git", "仓库", "repo"] },
  { term: "Remote Repository", tag: "四大区域", meaning: "远程仓库。存在 GitHub 等云端服务器上的仓库副本，用来异地备份和多人同步。", tip: "习惯上把默认的远程仓库叫做 origin。", aliases: ["远程仓库", "远端仓库", "origin", "云端仓库"] },
  { term: "git init", tag: "核心命令", meaning: "初始化仓库。告诉 Git「这个文件夹从今天起归你管了」，会在里面生成 .git 隐藏目录。", tip: "对 AI 说：「把这个文件夹初始化成 Git 仓库。」", aliases: ["初始化", "init", "建库"] },
  { term: ".gitignore", tag: "安全必配", meaning: "忽略清单文件。写在这里的文件不会被 Git 追踪，也不会误传到网上。", tip: "一定要把存密钥的 .env 和依赖目录 node_modules/ 写进去！", aliases: ["忽略", "gitignore", "密钥", "env"] },
  { term: "git add", tag: "核心命令", meaning: "把工作区里改好的文件放进「暂存区」，就像打包行李准备存档。", tip: "git add . 表示把当前所有改动都装进暂存区。", aliases: ["add", "暂存", "打包"] },
  { term: "Commit", tag: "核心命令", meaning: "提交存档。给暂存区拍一张永久快照存进本地仓库，并附一句说明（commit message）。", tip: "每次 commit 都会生成唯一的编号（Commit ID / 短哈希）。", aliases: ["提交", "存档", "快照", "git commit", "hash", "commit id"] },
  { term: "git push", tag: "核心命令", meaning: "推送上传。把本地仓库里已经 commit 好的新版本，同步上传到 GitHub 远程仓库。", tip: "只有仓库主人或协作者才能直接 push。", aliases: ["推送", "上传", "push"] },
  { term: "git pull", tag: "核心命令", meaning: "拉取同步。把 GitHub 远程仓库上的最新改动下载回来，并合并到你电脑的当前分支。", tip: "每天开工前先 pull 一下，确保自己改的是最新版。", aliases: ["拉取", "同步", "pull", "fetch"] },
  { term: "git clone", tag: "核心命令", meaning: "克隆下载。第一次把网上的整个仓库连同全部历史记录完整复制到自己电脑里。", tip: "点 GitHub 仓库的绿色 Code 按钮就能复制克隆地址。", aliases: ["克隆", "下载", "clone"] },
  { term: "Diff", tag: "核心命令", meaning: "差异对比（git diff）。把两个版本摆在一起，用红色标出删掉的行、绿色标出新增的行。", tip: "对 AI 说：「对比一下这两次提交改了什么。」", aliases: ["差异", "对比", "改动", "git diff"] },
  { term: "Discard / Reset / Revert", tag: "三种后悔药", meaning: "三种退路：Discard 放弃未存档修改；Reset 退回旧存档（限个人本地）；Revert 生成反向提交抵消（多人安全）。", tip: "已经推上网给别人看过的记录，优先用 Revert 而不是 Reset。", aliases: ["后悔药", "回退", "撤销", "restore", "reset", "revert", "discard"] },
  { term: "Branch & main", tag: "分支协作", meaning: "分支与主干。main 是正式稳定的主线，开新分支（如 feature）可以随便试改，绝不弄坏主线。", tip: "对 AI 说：「先从 main 拉一个新分支来试这个改法。」", aliases: ["分支", "主分支", "主线", "branch", "main", "feature", "HEAD"] },
  { term: "Merge & Conflict", tag: "分支协作", meaning: "合并与冲突。把分支改动合回主线叫 Merge；如果两边改了同一行就会触发 Conflict，由人拍板留哪句。", tip: "不用怕冲突，现在可以直接让 AI 展示两边差异帮你合并。", aliases: ["合并", "冲突", "merge", "conflict", "撞车"] },
  { term: "README", tag: "GitHub 界面", meaning: "仓库首页的置顶说明书（README.md）：介绍这个项目做什么、怎么安装和运行。", tip: "逛任何开源项目，第一眼先看 README。", aliases: ["说明书", "说明", "介绍"] },
  { term: "Star", tag: "GitHub 界面", meaning: "星标。像给小红书笔记点「赞 + 收藏」，表达喜欢，也方便以后从星标夹找回。", tip: "星标数代表关注热度，不等于参与写代码的人数。", aliases: ["收藏", "星标", "点赞"] },
  { term: "Issue", tag: "GitHub 界面", meaning: "议题。像作品底下的评论区，分 Open（待解决）和 Closed（已解决），用来报 bug、提问或许愿新功能。", tip: "用开源工具遇到报错，先去 Issues 里搜一搜。", aliases: ["议题", "提问", "报错", "讨论", "评论区"] },
  { term: "Fork", tag: "GitHub 界面", meaning: "复刻。把别人的开源仓库完整复制一份到自己账号名下，随便二创修改，不影响原作者。", tip: "给别人的开源项目做贡献，第一步往往是先 Fork。", aliases: ["复刻", "二创", "复制", "抄作业"] },
  { term: "Pull request (PR)", tag: "GitHub 界面", meaning: "合并请求。把你在分支里改好的版本递给原作者审阅（Code Review），对方点头后就合进主线。", tip: "合并成功后，你的名字会出现在项目的 Contributors 贡献者列表里。", aliases: ["PR", "合并请求", "投稿", "code review"] },
  { term: "Releases", tag: "GitHub 界面", meaning: "发行版。仓库右侧记录的正式版本号（如 v1.0）和更新日志，普通用户可以直接在这里下载成品安装包。", tip: "不想看源码只想下载软件，直接点 Releases。", aliases: ["发行版", "版本发布", "下载软件"] },
  { term: "Rebase / Cherry-pick", tag: "进阶备查", meaning: "进阶操作：Rebase（变基）把分支改动挪到主干最新点让历史变直；Cherry-pick 只挑某一条提交合过来。", tip: "普通人刚上手完全不用背！以后大团队协作遇到再问 AI 即可。", aliases: ["变基", "rebase", "cherry-pick", "拣选", "worktree"] }
];
