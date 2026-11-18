// 供本地页面直接读取；aliases 也参与搜索。
window.DATA = window.DATA || {};
window.DATA.glossary = [
  { term: "Git", meaning: "电脑里的版本管理工具。你决定什么时候存一份，也能翻看之前改过什么。", aliases: ["版本管理", "时光机", "本地"] },
  { term: "GitHub", meaning: "放 Git 仓库的网站。你能把作品传上去，也能邀请别人一起改。", aliases: ["云端", "协作", "代码托管"] },
  { term: "Repository", meaning: "仓库，像一个带履历的项目文件夹，装着作品和它的存档。", aliases: ["repo", "仓库", "项目"] },
  { term: "Commit", meaning: "给选好的改动存一份档，再写一句说明，往后能找到这一版。", aliases: ["提交", "存档", "快照"] },
  { term: "Branch", meaning: "分支。从当前版本另开一条路线试改，原来的路线可以继续走。", aliases: ["分支", "平行宇宙", "副本"] },
  { term: "Merge", meaning: "合并，把另一条分支的改动接到当前分支上。", aliases: ["合并", "汇合"] },
  { term: "Conflict", meaning: "合并时两边的改法撞车了。比如同一句标题各改了一遍，要人来定稿。", aliases: ["冲突", "合并冲突"] },
  { term: "Push", meaning: "推送，把本地已经存好的提交传去远端仓库。", aliases: ["推送", "上传"] },
  { term: "Pull", meaning: "拉取，把远端分支的新提交拿回来，整合进当前分支。", aliases: ["拉取", "同步"] },
  { term: "Clone", meaning: "克隆，把一个仓库和它的版本记录复制到自己电脑。", aliases: ["克隆", "下载"] },
  { term: "Fork", meaning: "在自己的 GitHub 账号下复制一份仓库，再试着自己改。", aliases: ["复刻", "二创", "复制"] },
  { term: "Star", meaning: "给仓库点一颗星，表示喜欢，也方便以后从星标列表里找回。", aliases: ["收藏", "星标", "点赞"] },
  { term: "Issue", meaning: "为项目开一条讨论，记录一个问题、建议或待办。", aliases: ["议题", "提问", "报错", "讨论"] },
  { term: "Pull request", meaning: "合并请求。把一份改动递给对方，大家能讨论，再决定是否合进去。", aliases: ["PR", "合并请求", "投稿"] },
  { term: "README", meaning: "仓库的说明书，通常在首页就能看到：这是什么，要怎么用。", aliases: ["说明书", "说明", "介绍"] },
  { term: "Open source", meaning: "开源。作者用许可证说明，大家可以在什么条件下使用、修改和分享源码。", aliases: ["开源", "许可证", "license"] },
  { term: "Version control", meaning: "版本控制，把每次决定保留的改动记下来，能比较、追溯和恢复。", aliases: ["版本控制", "版本管理", "历史"] },
  { term: "Diff", meaning: "对照两个版本，看哪些行加进来，哪些行删掉了。", aliases: ["差异", "对比", "改动"] },
  { term: "main", meaning: "很多仓库把主要分支叫 main，大家通常把确认好的改动合回这里。", aliases: ["主分支", "主线"] },
  { term: "GitHub Pages", meaning: "GitHub 提供的静态网站托管服务，能把仓库里的网页发布成网站。", aliases: ["网站", "静态网页", "发布"] }
];
