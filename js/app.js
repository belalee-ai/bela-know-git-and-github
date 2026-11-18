(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const stage = $("#stage");
  const programs = window.BelaPrograms;
  const lessons = window.BelaLessons;
  const overlay = $("#overlay");
  const stages = [
    { scene:"docs", text:"论文到底哪份是最终版？" },
    { scene:"save", text:"用 Git 存档，记住每一版。" },
    { scene:"back", text:"改坏了？翻回上一次存档。" },
    { scene:"push", text:"把存档传上 GitHub。" },
    { scene:"join", text:"别人提修改，你决定合不合。" }
  ];
  const key = "bela.live.section.v1";
  let current = 0;
  let step = 0;
  let tool = "";
  let previousFocus = null;
  let loopFrame = 0;
  let paused = false;
  let lastFrame = Date.now();
  let notesWindow = null;
  const sections = ["header","#home","#lesson","#recap","#utilities"];
  const tabs = 'button:not([disabled]), input, a[href], textarea, [tabindex="0"]';
  const pad = (value) => String(value).padStart(2, "0");
  const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");

  function resize() {
    stage.style.setProperty("--zoom", Math.min(innerWidth / 1920, innerHeight / 1080));
  }
  function updateClock() {
    const now = new Date();
    $("#clock").textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
  }
  function lastSection() {
    try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; }
  }
  function select(id) {
    if (!Number.isInteger(id) || id < 0 || id > programs.length) id = 0;
    if (tool) dismiss(false);
    const oldSection = current;
    current = id;
    step = 0;
    try { localStorage.setItem(key, String(id)); } catch { /* File storage may be disabled by the browser. */ }
    $("#home").hidden = id !== 0;
    $("#lesson").hidden = id === 0;
    $("#air-title").textContent = id ? "正在讲 第 " + id + " 节 · " + programs[id-1].short : "直播桌面";
    if (!id) {
      if (oldSection) $('.program-launch[data-program="' + oldSection + '"]').focus({preventScroll:true});
      return;
    }
    const program = programs[id-1];
    $("#lesson-file").textContent = "节目 " + pad(id) + "  /  " + program.short;
    $("#lesson-title").textContent = program.title;
    $("#lesson-intro").textContent = program.intro;
    renderStep(0);
    $("#close-lesson").focus({preventScroll:true});
  }
  function renderStep(target) {
    if (!current) return;
    const lesson = lessons[current];
    step = Math.max(0, Math.min(target, lesson.steps.length - 1));
    const body = $("#lesson-body");
    body.replaceChildren();
    lesson.render(body, step);
    $("#step-pos").textContent = pad(step + 1) + " / " + pad(lesson.steps.length);
    $("#step-name").textContent = lesson.steps[step];
    $("#previous").disabled = step === 0;
    $("#next").textContent = step === lesson.steps.length - 1 ? "回节目单 ↗" : "下一步 →";
    if (!mediaQuery.matches) body.animate([{opacity:.68,transform:"translateY(5px)"},{opacity:1,transform:"translateY(0)"}],{duration:180});
  }
  window.BelaGoStep = renderStep;
  function advance() {
    if (!current) return;
    if (step === lessons[current].steps.length - 1) select(0);
    else renderStep(step+1);
  }
  function makeLoop() {
    const frame = stages[loopFrame];
    const papers = '<i class="sheet a">v1.docx</i><i class="sheet b">v4.docx</i><i class="sheet c">v7.docx</i>';
    const nodes = '<span class="version-line"><b>V1</b><b>V2</b><b>V3</b></span>';
    const cloud = '<span class="tiny-cloud">GitHub</span>';
    const art = {
      docs: papers,
      save: nodes + '<i class="save-chip">＋ 存档</i>',
      back: nodes + '<i class="rewind-chip">↶ 回到 V2</i>',
      push: '<span class="laptop">本机</span><i class="push-arrow">⇢</i>' + cloud,
      join: '<span class="change-slip">改一句</span><i class="push-arrow">⇢</i><span class="accept-change">✓ 合并</span>'
    }[frame.scene];
    const view = '<div class="loop-visual scene-' + frame.scene + '" aria-hidden="true"><div class="loop-artboard">'+art+'</div></div><div class="loop-caption">'+frame.text+'</div>';
    const bars = stages.map((_,i)=>'<i class="'+(i<=loopFrame?"mark":"")+'"></i>').join("");
    [$("#mini-frame"),$("#large-frame")].filter(Boolean).forEach(node=>node.innerHTML=view);
    [$("#mini-bars"),$("#large-bars")].filter(Boolean).forEach(node=>node.innerHTML=bars);
    [$("#loop-pause"),$("#large-pause")].filter(Boolean).forEach(node=>{
      node.textContent=paused?"▶":"Ⅱ";
      node.setAttribute("aria-label",paused?"继续循环":"暂停循环");
      node.title=paused?"继续循环":"暂停循环";
    });
  }
  function cycle(direction=1) {
    loopFrame = (loopFrame + stages.length + direction) % stages.length;
    lastFrame = Date.now();
    makeLoop();
  }
  function togglePlayback() {
    paused = !paused;
    lastFrame = Date.now();
    makeLoop();
  }
  function drawWords(query) {
    const find = query.trim().toLowerCase();
    const found = window.DATA.glossary.filter(entry =>
      [entry.term,entry.meaning,...entry.aliases].some(word => word.toLowerCase().includes(find)));
    const list = $("#words");
    list.replaceChildren();
    let page = 0;
    function showPage() {
      list.replaceChildren();
      const visible = found.slice(page * 2, page * 2 + 2);
      for (const item of visible) {
        const card = document.createElement("article");
        card.className = "word";
        const title = document.createElement("h3");
        title.textContent = item.term;
        const meaning = document.createElement("p");
        meaning.textContent = item.meaning;
        card.append(title,meaning);
        list.append(card);
      }
      if (!found.length) {
        const p = document.createElement("p");
        p.className="empty-word";
        p.textContent="没有找到这个词。试试「存档」或「分支」。";
        list.append(p);
      }
      $("#word-prev").disabled = page === 0;
      $("#word-next").disabled = (page + 1) * 2 >= found.length;
      $("#word-count").textContent = found.length ? (page + 1) + " / " + Math.ceil(found.length/2) : "0";
    }
    $("#word-prev").onclick = () => { if (page > 0) { page--; showPage(); } };
    $("#word-next").onclick = () => { if ((page + 1) * 2 < found.length) { page++; showPage(); } };
    showPage();
    list.scrollTop=0;
  }
  function showAnswer(i) {
    const quiz = programs[(current || 1)-1].quiz;
    document.querySelectorAll(".quiz-option").forEach((el,j)=>el.classList.toggle("chosen",i===j));
    const feedback = $("#quiz-feedback");
    feedback.innerHTML = "<b>" + (i===quiz.answer?"答对了。":"一起看看。正确选项是 "+(quiz.answer+1)+"。") + "</b> ";
    feedback.append(quiz.why);
  }
  function notes() {
    if (tool) dismiss(false);
    notesWindow = window.open("notes.html#"+(current||1),"belaSpeakerNotes");
    if (notesWindow) notesWindow.focus();
  }
  function openTool(name) {
    if (name === "notes") { notes(); return; }
    if (name === tool) { dismiss(); return; }
    if (!tool) previousFocus = document.activeElement;
    tool = name;
    overlay.classList.toggle("takeover", name === "loop");
    sections.forEach(s=>$(s).inert=true);
    overlay.hidden=false;
    const panel = $("#modal-body");
    if (name==="glossary") {
      panel.innerHTML='<h2 id="modal-title">术语翻译机</h2><label class="searchbox"><input type="search" autocomplete="off" id="gloss-search" placeholder="输入英文或中文，比如 commit、存档" aria-label="搜索英文或中文术语"></label><div id="words" class="word-list"></div><nav class="word-pager" aria-label="翻看词卡"><button id="word-prev">← 上一组</button><span id="word-count"></span><button id="word-next">下一组 →</button></nav>';
      const search=$("#gloss-search");
      search.addEventListener("input",()=>drawWords(search.value));
      drawWords(""); search.focus();
    } else if (name==="quiz") {
      const quiz=programs[(current||1)-1].quiz;
      panel.innerHTML='<div class="tool-label">LIVE Q &amp; A</div><h2 id="modal-title">弹幕小测 · '+programs[(current||1)-1].short+'</h2><p class="quiz-question">'+quiz.question+'</p><div class="quiz-options">'+quiz.choices.map((c,i)=>'<button class="quiz-option" data-answer="'+i+'"><strong>扣 '+(i+1)+'</strong>'+c+'</button>').join("")+'</div><p id="quiz-feedback" class="quiz-feedback" aria-live="polite">请在弹幕扣 1 或 2，主播点选揭晓。</p>';
      panel.querySelectorAll("[data-answer]").forEach(btn=>btn.addEventListener("click",()=>showAnswer(Number(btn.dataset.answer))));
      $("#modal-close").focus();
    } else {
      loopFrame=0;lastFrame=Date.now();paused=false;
      panel.innerHTML='<div class="large-loop"><h2 id="modal-title">刚进来？30 秒看懂</h2><div id="large-frame" class="loop-frame"></div><div class="playback"><button id="large-pause"></button><div id="large-bars" class="play-bars"></div><span class="runtime">00:30</span></div><button class="tool-button" id="loop-next">下一幕 →</button></div>';
      $("#large-pause").addEventListener("click",togglePlayback);
      $("#loop-next").addEventListener("click",()=>cycle());
      makeLoop(); $("#modal-close").focus();
    }
  }
  function dismiss(restore=true) {
    tool=""; overlay.hidden=true; $("#modal-body").replaceChildren();
    sections.forEach(s=>$(s).inert=false);
    if (restore && previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    previousFocus=null;
  }
  function handleKey(event) {
    if (event.isComposing || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const k=event.key.toLowerCase();
    if (tool && k==="tab") {
      const controls=[...$("#modal").querySelectorAll(tabs)];
      if (event.shiftKey && document.activeElement===controls[0]) {event.preventDefault();controls.at(-1).focus();}
      else if (!event.shiftKey && document.activeElement===controls.at(-1)) {event.preventDefault();controls[0].focus();}
      return;
    }
    if (k==="escape") {event.preventDefault(); if(tool) dismiss(); else select(0); return;}
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.repeat) return;
    if (tool) {
      if (tool==="quiz" && (k==="1"||k==="2")) showAnswer(Number(k)-1);
      else if (tool==="loop" && (k==="arrowright"||k==="arrowleft")) cycle(k==="arrowright"?1:-1);
      else if (k==="0") select(0);
      else if ((tool==="quiz"&&k==="q")||(tool==="loop"&&k==="l")||(tool==="glossary"&&k==="t")) dismiss();
      else return;
    } else if (/^[0-6]$/.test(k)) select(Number(k));
    else if (k==="arrowright" && current) advance();
    else if (k==="arrowleft" && current) renderStep(step-1);
    else if ({t:1,q:1,l:1,n:1}[k]) openTool({t:"glossary",q:"quiz",l:"loop",n:"notes"}[k]);
    else return;
    event.preventDefault();
  }
  $("#programs").innerHTML=programs.map((p,i)=>'<button class="program-launch" data-program="'+(i+1)+'"><img src="assets/y2k/'+p.icon+'.png" alt=""><span class="prog-name">'+p.short+'</span><kbd>'+(i+1)+'</kbd></button>').join("");
  document.querySelectorAll("[data-program]").forEach(btn=>btn.addEventListener("click",()=>select(Number(btn.dataset.program))));
  document.querySelectorAll("[data-tool]").forEach(btn=>btn.addEventListener("click",()=>openTool(btn.dataset.tool)));
  $("#brand").addEventListener("click",()=>select(0));
  $("#close-lesson").addEventListener("click",()=>select(0));
  $("#modal-close").addEventListener("click",()=>dismiss());
  overlay.addEventListener("click",e=>{if(e.target===overlay)dismiss();});
  $("#next").addEventListener("click",advance);
  $("#previous").addEventListener("click",()=>renderStep(step-1));
  $("#loop-expand").addEventListener("click",()=>openTool("loop"));
  $("#loop-pause").addEventListener("click",togglePlayback);
  window.addEventListener("keydown",handleKey);
  window.addEventListener("resize",resize);
  resize(); updateClock(); makeLoop(); select(lastSection());
  setInterval(()=>{updateClock();if(!paused && Date.now()-lastFrame>=6000)cycle();},250);
})();
