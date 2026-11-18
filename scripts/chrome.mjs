// Minimal DevTools pipe client for an isolated local Chrome profile.
import { spawn } from 'node:child_process';
import { access, mkdtemp, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

async function chromePath() {
  const names = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome', process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe')];
  for (const name of names.filter(Boolean)) {
    try { await access(name, constants.X_OK); return name; } catch { /* Try next installation. */ }
  }
  throw new Error('找不到 Chrome / Chromium，请用 CHROME_PATH 指定可执行文件。');
}

export async function launchChrome(onEvent) {
  const executable = await chromePath();
  const profile = await mkdtemp(path.join(os.tmpdir(), 'bela-offline-chrome-'));
  const child = spawn(executable, ['--headless=new', '--disable-gpu', '--disable-background-networking',
    '--disable-extensions', '--disable-sync', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-pipe', `--user-data-dir=${profile}`, 'about:blank'],
    {stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe']});
  let sequence = 0;
  let incoming = Buffer.alloc(0);
  const pending = new Map();
  function rejectPending(error) {
    for (const request of pending.values()) { clearTimeout(request.timer); request.reject(error); }
    pending.clear();
  }
  const closed = new Promise(resolve => child.once('close', resolve));
  child.on('error', rejectPending);
  child.stdio[3].on('error', rejectPending);
  child.on('close', () => rejectPending(new Error('Chrome 已退出。')));
  child.stdio[4].on('data', chunk => {
    incoming = Buffer.concat([incoming, chunk]);
    let boundary;
    while ((boundary = incoming.indexOf(0)) !== -1) {
      const message = JSON.parse(incoming.subarray(0, boundary).toString());
      incoming = incoming.subarray(boundary + 1);
      const request = pending.get(message.id);
      if (!request) { if (message.method) onEvent(message); continue; }
      clearTimeout(request.timer);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`));
      else request.resolve(message.result);
    }
  });
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Chrome 未响应 ${method}`));
      }, 10000);
      pending.set(id, { method, resolve, reject, timer });
      child.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0');
    });
  }
  async function close() {
    if (child.exitCode === null && child.signalCode === null) {
      const kill = setTimeout(() => child.kill('SIGKILL'), 3000);
      try { await send('Browser.close'); } catch { /* May close before acknowledging. */ }
      await closed;
      clearTimeout(kill);
    }
    await rm(profile, {recursive: true, force: true, maxRetries: 4, retryDelay: 100});
  }
  return {send, close};
}
