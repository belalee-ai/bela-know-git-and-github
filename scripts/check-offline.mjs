// Run from the implementation worktree. Node.js built-ins only.
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';

const project = await realpath(process.cwd());
const visited = new Set();
const failures = new Set();
const relative = file => path.relative(project, file) || '.';
const inside = file => file === project || (!path.relative(project, file).startsWith('..' + path.sep) && path.relative(project, file) !== '..' && !path.isAbsolute(path.relative(project, file)));

async function inspectReference(reference, from, base) {
  const value = reference.trim();
  if (!value || value.startsWith('#') || value.startsWith('data:')) return;
  if (/^(?:[a-z][a-z\d+.-]*:|[\\/])/i.test(value)) {
    failures.add(`${relative(from)} 引用了非项目资源 ${value}`);
    return;
  }
  if (value.includes('${')) return; // Dynamic image choices are exercised by shoot.mjs.
  let pathname;
  try { pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]); }
  catch { failures.add(`${relative(from)} 无效路径 ${value}`); return; }
  if (!pathname) return;
  const candidate = path.resolve(base, pathname);
  if (!inside(candidate)) { failures.add(`${relative(from)} 越过项目目录 ${value}`); return; }
  let destination;
  try {
    destination = await realpath(candidate);
    if (!(await stat(destination)).isFile()) throw new Error('not a file');
  } catch {
    failures.add(`${relative(from)} 缺少文件 ${value}`); return;
  }
  if (!inside(destination)) { failures.add(`${relative(from)} 指向项目外的文件 ${value}`); return; }
  await inspect(destination);
}

async function inspect(file) {
  if (visited.has(file)) return;
  visited.add(file);
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.js', '.css'].includes(ext)) return;
  const source = await readFile(file, 'utf8');
  const refs = new Set();
  if (ext !== '.css') {
    for (const match of source.matchAll(/(?<![\w:-])(?:src|href|poster|action)\s*=\s*(["'])([^"']*)\1/gi)) refs.add(match[2]);
    for (const match of source.matchAll(/(?<![\w:-])srcset\s*=\s*(["'])([^"']*)\1/gi)) {
      for (const part of match[2].split(',')) refs.add(part.trim().split(/\s+/)[0]);
    }
  }
  if (ext === '.html' || ext === '.css') {
    for (const match of source.matchAll(/url\(\s*(["']?)([^"')]+?)\1\s*\)|@import\s+(["'])([^"']+)\3/gi)) refs.add(match[2] ?? match[4]);
  }
  if (ext === '.js' || ext === '.html') {
    for (const match of source.matchAll(/\b(?:fetch\s*\(|new\s+(?:XMLHttpRequest|WebSocket|EventSource)\s*\(|navigator\.sendBeacon\s*\()/g)) {
      failures.add(`${relative(file)} 使用了联网接口 ${match[0]}`);
    }
  }
  const base = ext === '.js' ? project : path.dirname(file);
  for (const ref of refs) await inspectReference(ref, file, base);
}

for (const name of ['index.html', 'notes.html']) await inspectReference(name, project, project);
for (const failure of failures) console.error('FAIL', failure);
console.log(`${visited.size} 个本地文件，${failures.size} FAIL`);
if (failures.size) process.exitCode = 1;
