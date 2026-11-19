// Exercise the broadcast desktop through file:// without installing a test runner.
import assert from 'node:assert/strict';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { launchChrome } from './chrome.mjs';

const root = process.cwd();
for (const name of ['index.html', 'notes.html']) await access(path.join(root, name));
// The keyboard contract is shared across builds. This named implementation also has
// mouse-driven scenarios; a redesign can update its selectors in exercise().
const detailed = !process.argv.includes('--tour') && existsSync(path.join(root, 'js/lessons-workshop.js'));
const shots = path.join(root, 'shots', ...(detailed ? [] : ['tour']));
const problems = new Set();
const requests = new Map();
let shotCount = 0;
const chrome = await launchChrome(({method, params, sessionId}) => {
  if (method === 'Network.requestWillBeSent') {
    const url = params.request.url;
    requests.set(`${sessionId}:${params.requestId}`, url);
    if (/^(?:https?|wss?):/i.test(url)) problems.add('联网请求 ' + url);
    if (url.startsWith('file:') && !url.startsWith(pathToFileURL(root + path.sep).href)) problems.add('越过项目目录 ' + url);
  }
  if (method === 'Network.loadingFailed' && !params.canceled) {
    problems.add(`${params.errorText} ${requests.get(`${sessionId}:${params.requestId}`) || ''}`);
  }
  if (method === 'Runtime.exceptionThrown') {
    const error = params.exceptionDetails;
    problems.add(error.exception?.description || error.text);
  }
  if (method === 'Runtime.consoleAPICalled' && params.type === 'error')
    problems.add(params.args.map(value => value.value ?? value.description).join(' '));
  if (method === 'Log.entryAdded' && params.entry.level === 'error') problems.add(params.entry.text);
});

async function configure(targetId) {
  const {sessionId} = await chrome.send('Target.attachToTarget', {targetId, flatten: true});
  const call = (method, params) => chrome.send(method, params, sessionId);
  for (const method of ['Runtime.enable', 'Log.enable', 'Network.enable', 'Page.enable']) await call(method);
  await call('Emulation.setDeviceMetricsOverride', {width:1920, height:1080, deviceScaleFactor:1, mobile:false});
  await call('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion', value:'reduce'}]});
  await call('Network.emulateNetworkConditions', {offline:true, latency:0, downloadThroughput:0, uploadThroughput:0});
  await call('Network.setBlockedURLs', {urls:['http://*','https://*','ws://*','wss://*']});
  async function evaluate(expression) {
    let reply;
    try { reply = await call('Runtime.evaluate', {expression, awaitPromise:true, returnByValue:true}); }
    catch (error) { throw new Error(`${error.message} · ${expression.slice(0, 110)}`, {cause:error}); }
    if (reply.exceptionDetails) throw new Error(reply.exceptionDetails.exception?.description || reply.exceptionDetails.text);
    return reply.result.value;
  }
  return {call, evaluate};
}

async function until(check, message) {
  const deadline = Date.now() + 5000;
  do {
    const value = await check();
    if (value) return value;
    await delay(35);
  } while (Date.now() < deadline);
  throw new Error(message);
}

const selectorExpression = selector => `document.querySelector(${JSON.stringify(selector)})`;
const visible = (page, selector) => page.evaluate(`Boolean(${selectorExpression(selector)}?.getClientRects().length)`);
const bodyText = (page, selector) => page.evaluate(`${selectorExpression(selector)}?.innerText`);
async function key(page, name) {
  const codes = {Escape:27, ArrowRight:39, ArrowLeft:37};
  const keyCode = codes[name] ?? name.toUpperCase().charCodeAt(0);
  const code = name.length > 1 ? name : (/\d/.test(name) ? 'Digit' + name : 'Key' + name.toUpperCase());
  for (const type of ['rawKeyDown','keyUp'])
    await page.call('Input.dispatchKeyEvent', {type, key:name, code, windowsVirtualKeyCode:keyCode, nativeVirtualKeyCode:keyCode});
}
async function click(page, selector) {
  const point = await page.evaluate(`(() => {
    const element = ${selectorExpression(selector)};
    if (!element || element.disabled || !element.getClientRects().length) return null;
    element.scrollIntoView({block:'nearest',inline:'nearest'});
    const box = element.getBoundingClientRect();
    return {x:box.left+box.width/2,y:box.top+box.height/2};
  })()`);
  assert.ok(point, '缺少可点击控件 ' + selector);
  await page.call('Input.dispatchMouseEvent', {type:'mousePressed', ...point, button:'left',clickCount:1});
  await page.call('Input.dispatchMouseEvent', {type:'mouseReleased', ...point, button:'left',clickCount:1});
}

async function frame(page, name, checkCamera = true) {
  await page.evaluate('document.fonts.ready');
  await until(()=>page.evaluate("[...document.images].every(img=>!img.getClientRects().length || img.complete)"), name + ' 有图片未完成加载');
  const broken = await page.evaluate(`[...document.images].filter(image=>image.complete&&!image.naturalWidth).map(image=>image.src)`);
  const failedFonts = await page.evaluate("[...document.fonts].filter(font=>font.status==='error').map(font=>font.family)");
  assert.deepEqual([...broken,...failedFonts], [], name + ' 出现损坏素材');
  if (checkCamera) {
    const overlaps = await page.evaluate(`[...document.querySelectorAll('button,input,textarea,[role=button]')].filter(el => {
      if (!el.checkVisibility() || el.closest('[inert]')) return false;
      const r = el.getBoundingClientRect();
      if (!(r.width && r.height && r.right>1520 && r.bottom>780 && r.left<1920 && r.top<1080)) return false;
      const x = (Math.max(1520,r.left) + Math.min(1920,r.right))/2;
      const y = (Math.max(780,r.top) + Math.min(1080,r.bottom))/2;
      return el.contains(document.elementFromPoint(x, y));
    }).map(el=>el.innerText||el.getAttribute('aria-label')||el.id)`);
    assert.deepEqual(overlaps, [], name + ' 有控件进入摄像头位置');
  }
  const {data} = await page.call('Page.captureScreenshot', {format:'png',fromSurface:true});
  await writeFile(path.join(shots, name + '.png'), Buffer.from(data,'base64'));
  shotCount++;
}

// Inspect the manuscript shown in each location, not just its version badge.
async function exerciseSync(page) {
  const action = name => `[data-sync-action="${name}"]`;
  const field = name => `[data-sync-field="${name}"]`;
  const original = {title: '书店', byline: '小王'};
  const edited = {title: '街角', byline: '贝拉'};
  async function expectCopies(work, local, remote, friend, reason) {
    const actual = await page.evaluate(`Object.fromEntries(
      [...document.querySelectorAll('[data-sync-copy]')].map(card => [
        card.dataset.syncCopy,
        Object.fromEntries([...card.querySelectorAll('[data-sync-value]')]
          .map(value => [value.dataset.syncValue, value.innerText.trim()]))
      ])
    )`);
    assert.deepEqual(actual, {work, local, remote, friend}, reason);
  }
  async function transfer(previous, next, capture = false) {
    await click(page, action('commit'));
    await expectCopies(edited, next, previous, previous, '提交只能更新本机存档');
    if (capture) {
      await frame(page, '03-sync-commit');
      await click(page, action('compare'));
      assert.equal(await bodyText(page, '.sync-diff del'), previous.title);
      assert.equal(await bodyText(page, '.sync-diff ins'), next.title);
      const unchanged = await page.evaluate("[...document.querySelectorAll('.sync-diff tbody tr:last-child td')].map(cell => cell.innerText)");
      assert.deepEqual(unchanged, [previous.byline, previous.byline], '未暂存的署名不应出现在本次差异里');
      await click(page, action('compare'));
    }
    await click(page, action('push'));
    await expectCopies(edited, next, next, previous, '推送只能传送已提交内容，朋友还需拉取');
    await click(page, action('pull'));
    await expectCopies(edited, next, next, next, '拉取后朋友应只收到已选的修改');
    if (capture) await frame(page, '03-sync-pull');
  }
  for (const selection of [['title'], ['byline'], ['title', 'byline']]) {
    await expectCopies(original, original, original, original, '重演时应从同一版开始');
    await click(page, action('edit'));
    await expectCopies(edited, original, original, original, '动笔后只改变工作区');
    const commitDisabled = () => page.evaluate(`${selectorExpression(action('commit'))}.disabled`);
    assert.ok(await commitDisabled(), '没有暂存改动时不能提交');
    await click(page, field('title'));
    assert.equal(await commitDisabled(), false, '暂存后可以提交');
    await click(page, field('title'));
    assert.ok(await commitDisabled(), '撤回全部选择后不能提交');

    const next = {...original};
    for (const name of selection) {
      await click(page, field(name));
      next[name] = edited[name];
    }
    await expectCopies(edited, original, original, original, '勾选不应提前生成存档');
    const firstRound = selection.length === 1 && selection[0] === 'title';
    await transfer(original, next, firstRound);
    if (firstRound) {
      await click(page, action('continue'));
      await click(page, field('byline'));
      await transfer(next, edited);
    }
    await click(page, action('reset'));
  }
  await expectCopies(original, original, original, original, '重置应清空上一轮的同步状态');
}

async function exercise(page) {
  const open = async n => {
    await key(page, String(n));
    await until(() => visible(page,'#lesson:not([hidden]) #lesson-body > *'), `第 ${n} 节未打开`);
  };
  const advance = async count => { for (let i=0; i<count; i++) await key(page,'ArrowRight'); };
  const checkText = async (selector, text) => assert.ok((await bodyText(page,selector))?.includes(text), '缺少界面反馈 ' + text);
  const start = await bodyText(page,'#home');
  assert.ok(start?.includes('GitHub'), '桌面缺少 GitHub 主题');
  assert.equal(await page.evaluate("document.querySelectorAll('#programs [data-program]').length"), 6, '桌面节目数量');
  await frame(page,'00-desktop');
  await click(page,'#programs [data-program="1"]');
  await frame(page,'01-thesis');
  await advance(2);
  await click(page,'[data-ws-action="example"]');
  await click(page,'[data-ws-action="save"]');
  assert.equal(await page.evaluate("document.querySelectorAll('.ws-timeline button').length"),2);
  await click(page,'.ws-timeline button:first-child');
  assert.ok(await visible(page,'.ws-diff ins') && await visible(page,'.ws-diff del'), '存档回看缺少改动高亮');
  await frame(page,'01-thesis-rewind');

  await open(2); await frame(page,'02-branches');
  for (let i=0;i<6;i++) await click(page,'#lesson-body [data-ws-action="next"]');
  await frame(page,'02-conflict-vote');
  await click(page,'#lesson-body [data-ws-action="both"]');
  await checkText('#lesson-body','已合并到主线');

  await open(3); await frame(page,'03-repository');
  await click(page,'#lesson-body [data-gal-step="1"]');
  await exerciseSync(page);
  await key(page,'ArrowLeft');
  for (let s=2;s<=7;s++) {
    await click(page,`#lesson-body [data-gal-step="${s}"]`);
    assert.ok(await visible(page,'.gal-hot[aria-pressed="true"]'), '仓库热点未选中');
  }
  await frame(page,'03-repository-hotspot');

  await open(4); await frame(page,'04-git-history');
  const timelineLength = await page.evaluate('window.DATA.facts.gitTimeline.length');
  await advance(timelineLength);
  await checkText('#lesson-body','OpenClaw'); await frame(page,'04-openclaw');
  await advance(3); await checkText('#lesson-body','Octoverse'); await frame(page,'04-github');

  await open(5); await frame(page,'05-ai');
  await advance(2); await checkText('#lesson-body','布局出错'); await frame(page,'05-ai-broken');
  await click(page,'#lesson-body [data-ws-action="next"]'); await checkText('#lesson-body','已恢复存档');
  await frame(page,'05-ai-restored');

  await open(6); await frame(page,'06-commits');
  const records = new Set();
  for(let chapter=0;chapter<4;chapter++) {
    await click(page,`#lesson-body [data-gal-step="${chapter}"]`);
    const hashes = await page.evaluate("[...document.querySelectorAll('[data-commit]')].map(el=>el.dataset.commit)");
    for (const hash of hashes) {
      records.add(hash);
      await click(page,`#lesson-body [data-commit="${hash}"]`);
      await checkText('.gal-log',hash);
    }
  }
  assert.equal(records.size,28,'四章展示的不同提交数');
  await advance(1);
  for (const step of [5,6]) await click(page,`.gal-guide-body [data-gal-step="${step}"]`);
  await click(page,'[data-upload]'); await click(page,'[data-upload]');
  await checkText('#lesson-body','第一份作品已存档'); await frame(page,'06-first-upload');
  const topic = await bodyText(page,'#air-title');
  await page.call('Page.reload', {ignoreCache:true});
  await until(async () => (await bodyText(page,'#air-title')) === topic && await visible(page,'#lesson:not([hidden])'), '刷新后没有恢复第六节');

  for (const [shortcut,name] of [['l','loop'],['t','glossary'],['q','quiz']]) {
    await key(page,shortcut);
    await until(()=>visible(page,'#overlay:not([hidden])'),'浮窗没有打开 ' + shortcut);
    if (shortcut === 't') {
      await click(page,'#gloss-search');
      await page.call('Input.insertText',{text:'fork'});
      await checkText('#overlay','Fork');
    }
    if (shortcut === 'l') {
      const captions = new Set();
      for (let i = 0; i < 5; i++) {
        captions.add(await bodyText(page, '#large-frame'));
        await click(page, '#loop-next');
      }
      assert.equal(captions.size, 5, '回顾轮播应有五个不同画面');
      await click(page, '#large-pause');
      assert.equal(await page.evaluate("document.querySelector('#large-pause').getAttribute('aria-label')"), '继续循环');
    }
    if (shortcut === 'q') {
      await key(page, '1'); await checkText('#quiz-feedback', '。');
      await key(page, '2'); assert.ok(await visible(page,'.quiz-option.chosen'), '没有显示投票选择');
    }
    await frame(page,'07-' + name);
    await click(page,'#modal-close');
    await until(async()=>!(await visible(page,'#overlay')), '浮窗没有关闭');
  }
  await key(page,'n');
  const notesId = await until(async()=> {
    const {targetInfos} = await chrome.send('Target.getTargets');
    return targetInfos.find(info=>info.type==='page' && info.url.split(/[?#]/)[0] === pathToFileURL(path.join(root,'notes.html')).href)?.targetId;
  },'N 未打开独立提词页');
  const notes = await configure(notesId);
  await notes.call('Page.reload',{ignoreCache:true});
  await until(async()=> (await bodyText(notes,'body'))?.includes('提词'),'离线提词卡没有显示');
  await frame(notes,'08-notes',false);
  await key(page,'0');
  await until(()=>visible(page,'#home:not([hidden])'),'无法回到桌面');
}

// Designers can compare independent implementations without matching DOM IDs or class names.
async function tour(page) {
  const signature = () => page.evaluate("document.body.innerText.replace(/\\b\\d{1,2}:\\d{2}(:\\d{2})?\\b/g,'').trim()");
  const headings = () => page.evaluate("[...document.querySelectorAll('h1,h2')].filter(el=>el.getClientRects().length).map(el=>el.innerText).join(' / ')");
  await frame(page,'00-desktop');
  const glossaryTerm = 'fork';
  for (let lesson = 1; lesson <= 6; lesson++) {
    await key(page, '0');
    const desktop = await signature();
    const homeHeadings = await headings();
    await key(page, String(lesson));
    await until(async()=> (await signature()) !== desktop, '无法从桌面打开第 ' + lesson + ' 节');
    const seen = new Set();
    for (let step = 0; step < 25; step++) {
      const state = await signature();
      if (state === desktop || seen.has(state) || (step > 0 && homeHeadings && await headings() === homeHeadings)) break;
      seen.add(state);
      await frame(page, `lesson-${lesson}-${String(step + 1).padStart(2, '0')}`);
      await key(page,'ArrowRight');
    }
    assert.ok(seen.size >= 2, '第 ' + lesson + ' 节按右键没有揭示下一步');
    assert.ok(seen.size < 25, '第 ' + lesson + ' 节步数超过验收上限');
  }
  await key(page, '6');
  for (const [shortcut,name] of [['l','loop'],['t','glossary'],['q','quiz']]) {
    const before = await signature();
    await key(page, shortcut);
    await until(async()=> (await signature()) !== before, '无法打开 ' + name);
    if (shortcut === 't') {
      const search = await page.evaluate(`(() => {
        const field = [...document.querySelectorAll('input')].find(el=>el.checkVisibility());
        if (!field) return false;
        field.focus(); return true;
      })()`);
      assert.ok(search,'术语筛选框未出现');
      await page.call('Input.insertText',{text:glossaryTerm});
      assert.ok((await signature()).toLowerCase().includes(glossaryTerm),'没有找到术语 Fork');
    }
    await frame(page,'tool-' + name);
    await key(page,'Escape');
  }
  const notesKey = pathToFileURL(path.join(root,'notes.html')).href;
  const {targetId} = await chrome.send('Target.createTarget',{url:'about:blank'});
  const notes = await configure(targetId);
  await notes.call('Page.navigate',{url:notesKey});
  await until(async()=>(await bodyText(notes,'body'))?.includes('提词'), '提词页没有显示');
  await frame(notes,'notes',false);
}

try {
  await mkdir(shots,{recursive:true});
  const {targetId} = await chrome.send('Target.createTarget',{url:'about:blank'});
  const page = await configure(targetId);
  await page.call('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  if (detailed) {
    await until(()=>visible(page,'#programs [data-program="1"]'),'桌面没有载入六节节目');
    await exercise(page);
  } else {
    await until(async()=>(await bodyText(page,'body'))?.includes('GitHub'), '直播桌面没有显示');
    await tour(page);
  }
  assert.deepEqual([...problems], [], '浏览器离线检查');
  const checks = detailed ? '六节交互、刷新与提词卡' : '六节逐步截图、快捷工具与提词页';
  console.log(`已验证${checks}，${shotCount} 张截图在 ${path.relative(root,shots)}/。0 浏览器错误，0 外部请求。`);
} catch (error) {
  for (const problem of problems) console.error('浏览器异常', problem);
  throw error;
} finally {
  await chrome.close();
}
