#!/usr/bin/env node
'use strict';
/**
 * App Spec Map 동기화 — 각 프로젝트의 spec-map JS(원본)를 읽어 NAS API(api.papi.kr)에 스냅샷으로 올린다.
 *
 *   node tools/spec-map-sync/sync.js <slug…>        지정 프로젝트 업로드
 *   node tools/spec-map-sync/sync.js --all          이 PC에 있는 프로젝트 전부
 *   node tools/spec-map-sync/sync.js --list         등록 프로젝트와 이 PC의 경로·존재 여부
 *   … --dry-run                                     읽기·검증·수치만 출력(업로드 안 함)
 *   node tools/spec-map-sync/sync.js --update-viewer   InSearch v2 뷰어를 spec-map/ 로 복사 (+ ERD 셸 → erd.html·erd-viewer.js)
 *
 * PC별 설정: 사용자 폴더의 .spec-map-sync.env (레포 밖)
 *   SPECMAP_API=https://api.papi.kr/spec-map/v1
 *   SPECMAP_PC=pc-a
 *   SPECMAP_UPLOAD_KEY=…                 (NAS hash-password.js --upload-key 로 발급)
 *   SPECMAP_DIR_<SLUG>=<경로>             (선택 — 기본 D:/Projects/<name>/docs/app-spec-map-data, slug의 - 는 _)
 *   SPECMAP_PROJECTS_ROOT=<경로>          (선택 — 기본 D:/Projects)
 *
 * 원본 JS 파일은 읽기만 한다. 의존성 없음(Node 18+ 내장 모듈).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const DATA_FILES = ['spec-map-data.js', 'spec-map-inbox.js', 'spec-map-changelog.js'];
const GLOBALS = ['PROJECT', 'SPEC_DOC_URL', 'PLAT_LEGEND', 'FEAT_LEGEND', 'MENUS', 'GROUPS', 'INBOX', 'CHANGELOG'];

class SyncError extends Error {}

function readEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function loadSettings(env) {
  const file = path.join(os.homedir(), '.spec-map-sync.env');
  return { file, ...readEnvFile(file), ...(env || {}) };
}

function projectDir(project, settings) {
  const key = 'SPECMAP_DIR_' + project.slug.toUpperCase().replace(/-/g, '_');
  if (settings[key]) return settings[key];
  const root = settings.SPECMAP_PROJECTS_ROOT || 'D:/Projects';
  return path.join(root, project.name, 'docs', 'app-spec-map-data');
}

// 뷰어와 같은 방식으로 실행: 같은 전역 컨텍스트에서 파일을 차례로 실행하면 최상위 const가 공유된다.
function loadGlobals(dir) {
  const main = path.join(dir, DATA_FILES[0]);
  if (!fs.existsSync(main)) throw new SyncError(`${DATA_FILES[0]} 없음: ${dir}`);
  const sandbox = { console: { log() {}, warn() {}, error() {} } };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  for (const f of DATA_FILES) {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) continue;
    try {
      vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p, timeout: 5000 });
    } catch (err) {
      throw new SyncError(`${f} 실행 오류: ${err.message}`);
    }
  }
  const pick = GLOBALS.map((g) => `${g}: typeof ${g} === 'undefined' ? undefined : ${g}`).join(', ');
  const found = vm.runInContext(`({ ${pick}, __v1: typeof SECTIONS !== 'undefined' })`, ctx);
  return found;
}

function findFunction(value, where) {
  if (typeof value === 'function') return where;
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const hit = findFunction(v, Array.isArray(value) ? `${where}[${k}]` : `${where}.${k}`);
      if (hit) return hit;
    }
  }
  return null;
}

function buildPayload(globals) {
  if (!Array.isArray(globals.MENUS)) {
    throw new SyncError(globals.__v1
      ? 'v1 형식(SECTIONS)입니다 — 웹 뷰어는 v2(MENUS) 전용. 이 PC에서 v2로 전환한 뒤 다시 실행하세요'
      : 'MENUS가 없습니다 — v2 형식 spec-map-data.js가 아닙니다');
  }
  if (!globals.PROJECT || typeof globals.PROJECT !== 'object') throw new SyncError('PROJECT가 없습니다');
  const payload = {};
  for (const g of GLOBALS) if (globals[g] !== undefined) payload[g] = globals[g];
  const fn = findFunction(payload, 'payload');
  if (fn) throw new SyncError(`함수 값은 올릴 수 없습니다(JSON 불가): ${fn} — 문자열로 바꾸거나 웹에서 쓰지 않는 항목이면 제거`);
  // vm 컨텍스트의 객체를 일반 JSON으로 정규화
  return JSON.parse(JSON.stringify(payload));
}

function countPayload(p) {
  let screens = 0, features = 0, issues = 0;
  const screen = (s) => {
    screens++;
    features += (s.features || []).length;
    issues += (s.issues || []).length;
    (s.children || []).forEach(screen);
  };
  (p.MENUS || []).forEach((m) => (m.screens || []).forEach(screen));
  (p.GROUPS || []).forEach((g) => { features += (g.features || []).length; issues += (g.issues || []).length; });
  return { menus: (p.MENUS || []).length, screens, groups: (p.GROUPS || []).length, features, issues,
    inbox: (p.INBOX || []).length, changelog: (p.CHANGELOG || []).length };
}

function hashPayload(p) {
  return crypto.createHash('sha256').update(JSON.stringify(p)).digest('hex');
}

async function upload(settings, project, payload) {
  if (!settings.SPECMAP_API || !settings.SPECMAP_UPLOAD_KEY) {
    throw new SyncError(`업로드 설정 없음 — ${settings.file} 에 SPECMAP_API, SPECMAP_UPLOAD_KEY 필요`);
  }
  const url = `${settings.SPECMAP_API.replace(/\/+$/, '')}/projects/${project.slug}`;
  let res;
  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.SPECMAP_UPLOAD_KEY}` },
      body: JSON.stringify({ name: project.name, payload }),
    });
  } catch (err) {
    throw new SyncError(`API 연결 실패: ${err.cause && err.cause.code || err.message}`);
  }
  let body = {};
  try { body = await res.json(); } catch { /* 본문 없음 */ }
  if (!res.ok) {
    const hint = { 401: '업로드 키가 틀렸거나 NAS에 등록되지 않음', 413: '데이터가 너무 큼', 429: '실패가 많아 잠시 차단됨 — 15분 후 재시도' }[res.status] || '';
    throw new SyncError(`API ${res.status} ${body.error || ''} ${body.message || ''} ${hint}`.trim());
  }
  return body;
}

function loadProjects() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));
}

// 웹 셸(index.html) — 원본 app-spec-map.html의 <style>과 body 마크업을 그대로 쓰고, 데이터 <script> 5개를 잠금+app.js로 바꾼다.
function buildIndexHtml(shell) {
  const style = shell.match(/<style>[\s\S]*?<\/style>/);
  const body = shell.match(/<body>([\s\S]*?)<script\s+src=/);
  if (!style || !body) throw new SyncError('원본 app-spec-map.html 구조가 예상과 다릅니다(<style>, <body>…<script src=)');
  return `<!DOCTYPE html>
<!-- 자동 생성: node tools/spec-map-sync/sync.js --update-viewer (원본: InSearch docs/app-spec-map.html). 직접 수정하지 말 것 — 웹 전용 변경은 web.css·app.js -->
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.papi.kr http://localhost:* http://127.0.0.1:*; base-uri 'none'; form-action 'none'">
<title>App Spec Map</title>
${style[0]}
<link rel="stylesheet" href="web.css">
</head>
<body>
<div id="smLock" hidden>
  <form id="smLockForm" autocomplete="off">
    <h1>🗺️ App Spec Map</h1>
    <p>관리자 암호를 입력하세요.</p>
    <input id="smPw" type="password" autocomplete="current-password" aria-label="관리자 암호" required>
    <button id="smBtn" type="submit">열기</button>
    <p id="smLockMsg" role="alert"></p>
  </form>
</div>
${body[1].trim()}

<script src="config.js"></script>
<script src="app.js"></script>
</body>
</html>
`;
}

// 원본 ERD 셸(data-model-erd.html) → 웹 erd.html + erd-viewer.js(인라인 렌더 스크립트 그대로).
// 데이터 파일·CDN mermaid 대신 erd-app.js가 API 응답을 전역에 넣고 vendor/mermaid.min.js → erd-viewer.js 순서로 삽입한다.
function buildErdFiles(shell) {
  const style = shell.match(/<style>[\s\S]*?<\/style>/);
  const body = shell.match(/<body>([\s\S]*?)<!--[^>]*-->\s*<script\s+src=/) || shell.match(/<body>([\s\S]*?)<script\s+src=/);
  const inline = shell.match(/<script>\s*([\s\S]*?)<\/script>\s*<\/body>/);
  if (!style || !body || !inline) throw new SyncError('원본 data-model-erd.html 구조가 예상과 다릅니다(<style>, <body>…<script src=, 끝의 인라인 <script>)');
  if (!/ERD_SECTIONS/.test(inline[1])) throw new SyncError('원본 ERD 렌더 스크립트에 ERD_SECTIONS가 없습니다');
  const html = `<!DOCTYPE html>
<!-- 자동 생성: node tools/spec-map-sync/sync.js --update-viewer (원본: InSearch docs/data-model-erd.html). 직접 수정하지 말 것 — 웹 전용 변경은 erd-app.js·web.css -->
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.papi.kr; base-uri 'none'; form-action 'none'">
<title>ERD — App Spec Map</title>
${style[0]}
<link rel="stylesheet" href="web.css">
</head>
<body class="sm-erd">
<div id="smLock" hidden>
  <form id="smLockForm" autocomplete="off">
    <h1>🗄️ ERD</h1>
    <p>관리자 암호를 입력하세요.</p>
    <input id="smPw" type="password" autocomplete="current-password" aria-label="관리자 암호" required>
    <button id="smBtn" type="submit">열기</button>
    <p id="smLockMsg" role="alert"></p>
  </form>
</div>
<div id="smErdBar" hidden><a id="smBack" href="./">⬅ Spec Map</a><span id="smErdState"></span><button id="smReload" type="button">🔄 다시 조회</button></div>
${body[1].trim()}

<script src="config.js"></script>
<script src="erd-app.js"></script>
</body>
</html>
`;
  const js = `/* 자동 생성: sync.js --update-viewer (원본: InSearch docs/data-model-erd.html 인라인 렌더 스크립트, 수정 없음) */
${inline[1].trim()}
`;
  return { html, js };
}

function updateViewer(settings) {
  const root = settings.SPECMAP_PROJECTS_ROOT || 'D:/Projects';
  const src = settings.SPECMAP_VIEWER_SRC || path.join(root, 'InSearch', 'docs', 'app-spec-map-data', 'spec-map-viewer.js');
  const shellSrc = settings.SPECMAP_SHELL_SRC || path.join(root, 'InSearch', 'docs', 'app-spec-map.html');
  const erdSrc = settings.SPECMAP_ERD_SHELL_SRC || path.join(root, 'InSearch', 'docs', 'data-model-erd.html');
  const webDir = path.join(__dirname, '..', '..', 'spec-map');
  for (const f of [src, shellSrc, erdSrc]) if (!fs.existsSync(f)) throw new SyncError(`원본 없음: ${f}`);
  const text = fs.readFileSync(src, 'utf8');
  if (!/MENUS/.test(text)) throw new SyncError('원본 뷰어가 v2(MENUS)가 아닙니다');
  const html = buildIndexHtml(fs.readFileSync(shellSrc, 'utf8'));
  fs.mkdirSync(webDir, { recursive: true });
  fs.writeFileSync(path.join(webDir, 'spec-map-viewer.js'), text);
  fs.writeFileSync(path.join(webDir, 'index.html'), html);
  const erd = buildErdFiles(fs.readFileSync(erdSrc, 'utf8'));
  fs.writeFileSync(path.join(webDir, 'erd.html'), erd.html);
  fs.writeFileSync(path.join(webDir, 'erd-viewer.js'), erd.js);
  return { src, dst: webDir, bytes: Buffer.byteLength(text) + Buffer.byteLength(html) + Buffer.byteLength(erd.html) + Buffer.byteLength(erd.js) };
}

async function main(argv) {
  const args = argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const names = args.filter((a) => !a.startsWith('--'));
  const settings = loadSettings();
  const projects = loadProjects();

  if (flags.has('--update-viewer')) {
    const r = updateViewer(settings);
    console.log(`웹 화면 갱신: ${r.src} → ${r.dst} (spec-map-viewer.js, index.html, erd.html, erd-viewer.js — ${r.bytes} B)`);
    return 0;
  }
  if (flags.has('--list')) {
    for (const p of projects) {
      const dir = projectDir(p, settings);
      console.log(`${p.slug.padEnd(12)} ${p.name.padEnd(12)} ${fs.existsSync(path.join(dir, DATA_FILES[0])) ? '있음' : '없음'}  ${dir}`);
    }
    return 0;
  }
  if (!names.length && !flags.has('--all')) {
    console.error('사용법: sync.js <slug…> | --all | --list | --update-viewer  [--dry-run]');
    return 2;
  }

  const dry = flags.has('--dry-run');
  let targets;
  if (flags.has('--all')) {
    targets = projects.filter((p) => fs.existsSync(path.join(projectDir(p, settings), DATA_FILES[0])));
    for (const p of projects) if (!targets.includes(p)) console.log(`- ${p.slug}: 이 PC에 없음 (건너뜀)`);
  } else {
    targets = names.map((n) => {
      const p = projects.find((x) => x.slug === n.toLowerCase() || x.name.toLowerCase() === n.toLowerCase());
      if (!p) throw new SyncError(`projects.json에 없는 프로젝트: ${n}`);
      return p;
    });
  }

  let failed = 0;
  console.log(`PC: ${settings.SPECMAP_PC || '(미설정)'}  API: ${settings.SPECMAP_API || '(미설정)'}${dry ? '  [dry-run]' : ''}`);
  for (const p of targets) {
    const dir = projectDir(p, settings);
    try {
      const payload = buildPayload(loadGlobals(dir));
      const c = countPayload(payload);
      const hash = hashPayload(payload);
      const sizeKb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1);
      const line = `메뉴 ${c.menus} · 화면 ${c.screens} · 분류 ${c.groups} · 기능 ${c.features} · 이슈 ${c.issues} · INBOX ${c.inbox} · CHANGELOG ${c.changelog} · ${sizeKb}KB · ${hash.slice(0, 12)}`;
      if (dry) { console.log(`✓ ${p.slug}: ${line}`); continue; }
      const r = await upload(settings, p, payload);
      if (r.hash && r.hash !== hash) throw new SyncError(`서버 해시 불일치 (local ${hash.slice(0, 12)} / server ${r.hash.slice(0, 12)})`);
      console.log(`✓ ${p.slug}: ${r.saved ? '저장' : '변경 없음'} (by ${r.syncedFrom}) — ${line}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${p.slug}: ${err instanceof SyncError ? err.message : err.stack}`);
    }
  }
  return failed ? 1 : 0;
}

if (require.main === module) {
  main(process.argv).then((code) => process.exit(code), (err) => {
    console.error(err instanceof SyncError ? err.message : err.stack);
    process.exit(1);
  });
}

module.exports = { loadGlobals, buildPayload, countPayload, hashPayload, projectDir, loadSettings, readEnvFile, buildIndexHtml, buildErdFiles, SyncError };
