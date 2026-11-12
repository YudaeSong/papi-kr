'use strict';
// 실행: node --test tools/spec-map-sync/test/sync.test.js — 임시 폴더만 사용, 네트워크·실제 프로젝트 미사용
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const s = require('../sync');

function tmpProject(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specmap-sync-'));
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);
  return dir;
}

const V2 = `"use strict";
const PROJECT = { name: "Demo", updated: "2026-11-12 test", overviewCards: [{ title: "a", html: "<p>x</p>" }] };
const SPEC_DOC_URL = "";
const PLAT_LEGEND = "🔶";
const FEAT_LEGEND = "✅ 구현 · 🚧 부분구현";
const MENUS = [{ id: "m1", name: "M", screens: [
  { id: "1.1", name: "S", features: [["F-1","a","","✅","x"]], issues: ["i"], children: [{ id: "1.1.1", name: "C", features: [["F-2","b","","🚧","x"]] }] } ] }];
const GROUPS = [{ id: "g1", name: "G", issues: [], features: [["F-3","c","","✅","x"]] }];`;
const INBOX = 'const INBOX = [ { name: "n", desc: "d", status: "✅ 구현", prio: "상" } ];';
const CHANGELOG = '"use strict";\nconst CHANGELOG = [ { version: "", date: "2026-11-12", type: "기타", desc: "x" } ];';

test('v2 세 파일을 읽어 payload·수치 생성', () => {
  const dir = tmpProject({ 'spec-map-data.js': V2, 'spec-map-inbox.js': INBOX, 'spec-map-changelog.js': CHANGELOG });
  const p = s.buildPayload(s.loadGlobals(dir));
  assert.deepStrictEqual(Object.keys(p).sort(), ['CHANGELOG', 'FEAT_LEGEND', 'GROUPS', 'INBOX', 'MENUS', 'PLAT_LEGEND', 'PROJECT', 'SPEC_DOC_URL']);
  assert.deepStrictEqual(s.countPayload(p), { menus: 1, screens: 2, groups: 1, features: 3, issues: 1, inbox: 1, changelog: 1 });
  assert.match(s.hashPayload(p), /^[0-9a-f]{64}$/);
});

test('INBOX·CHANGELOG 파일이 없어도 동작', () => {
  const dir = tmpProject({ 'spec-map-data.js': V2 });
  const p = s.buildPayload(s.loadGlobals(dir));
  assert.strictEqual(p.INBOX, undefined);
  assert.strictEqual(s.countPayload(p).inbox, 0);
});

test('v1 형식(SECTIONS)은 전환 안내와 함께 거부', () => {
  const dir = tmpProject({ 'spec-map-data.js': 'const PROJECT = {name:"Old"}; const SECTIONS = []; const FEATURES = {};' });
  assert.throws(() => s.buildPayload(s.loadGlobals(dir)), /v1 형식/);
});

test('함수 값이 있으면 위치와 함께 거부', () => {
  const dir = tmpProject({ 'spec-map-data.js': V2.replace('updated: "2026-11-12 test"', 'updated: "x", overviewTop: () => "<b>x</b>"') });
  assert.throws(() => s.buildPayload(s.loadGlobals(dir)), /payload\.PROJECT\.overviewTop/);
});

test('데이터 파일 없음·문법 오류는 SyncError', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'specmap-sync-'));
  assert.throws(() => s.loadGlobals(empty), s.SyncError);
  const broken = tmpProject({ 'spec-map-data.js': 'const MENUS = [' });
  assert.throws(() => s.loadGlobals(broken), /실행 오류/);
});

test('경로: 기본값, 루트 변경, 프로젝트별 덮어쓰기(- → _)', () => {
  const p = { slug: 'thnkn-app', name: 'THNKN-app' };
  assert.strictEqual(s.projectDir(p, {}), path.join('D:/Projects', 'THNKN-app', 'docs', 'app-spec-map-data'));
  assert.strictEqual(s.projectDir(p, { SPECMAP_PROJECTS_ROOT: 'E:/work' }), path.join('E:/work', 'THNKN-app', 'docs', 'app-spec-map-data'));
  assert.strictEqual(s.projectDir(p, { SPECMAP_DIR_THNKN_APP: 'F:/x' }), 'F:/x');
});

test('원본 파일은 읽기만 한다', () => {
  const dir = tmpProject({ 'spec-map-data.js': V2, 'spec-map-inbox.js': INBOX });
  const before = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('|');
  s.buildPayload(s.loadGlobals(dir));
  const after = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('|');
  assert.strictEqual(after, before);
});

test('웹 셸 생성: 원본 style·body 유지, 데이터 script → 잠금+app.js, CSP·noindex', () => {
  const shell = '<html><head><style>body{x:1}</style></head><body>\n<header id="h"></header>\n<script src="a.js"></script><script src="b.js"></script></body></html>';
  const html = s.buildIndexHtml(shell);
  assert.match(html, /<style>body\{x:1\}<\/style>/);
  assert.match(html, /<header id="h"><\/header>/);
  assert.match(html, /id="smLock"/);
  assert.match(html, /<script src="config\.js"><\/script>\s*<script src="app\.js"><\/script>/);
  assert.doesNotMatch(html, /a\.js|b\.js/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /noindex/);
  assert.throws(() => s.buildIndexHtml('<html><body>no style</body></html>'), s.SyncError);
});

test('ERD 셸 → erd.html(잠금·CSP·CDN 제거) + erd-viewer.js(인라인 렌더 그대로)', () => {
  const shell = '<html><head><script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script><style>.e{x:1}</style></head><body>\n' +
    '<div class="titleblock" id="hd"></div><main id="main"></main>\n<!-- 데이터 -->\n<script src="data-model-erd-data.js"></script>\n' +
    '<script>\n"use strict";\n(function render(){ document.getElementById("main").textContent = ERD_SECTIONS.length; })();\n</script>\n</body></html>';
  const { html, js } = s.buildErdFiles(shell);
  assert.match(html, /<style>\.e\{x:1\}<\/style>/);
  assert.match(html, /<main id="main"><\/main>/);
  assert.match(html, /id="smLock"/);
  assert.match(html, /id="smErdBar"/);
  assert.match(html, /<script src="config\.js"><\/script>\s*<script src="erd-app\.js"><\/script>/);
  assert.doesNotMatch(html, /cdn\.jsdelivr|data-model-erd-data\.js|<!-- 데이터 -->/);
  assert.match(html, /script-src 'self';/);
  assert.match(html, /noindex/);
  assert.match(js, /^\/\* 자동 생성/);
  assert.match(js, /"use strict";\n\(function render\(\)\{ document\.getElementById\("main"\)\.textContent = ERD_SECTIONS\.length; \}\)\(\);\n$/);
  assert.throws(() => s.buildErdFiles('<html><body><script>var a;</script></body></html>'), s.SyncError);
});

test('설정 파일 파서: 주석·빈 줄 무시, CRLF 허용', () => {
  const dir = tmpProject({ 'x.env': '# c\r\nSPECMAP_PC=pc-a\r\n\r\nSPECMAP_API = https://a/b \r\n' });
  assert.deepStrictEqual(s.readEnvFile(path.join(dir, 'x.env')), { SPECMAP_PC: 'pc-a', SPECMAP_API: 'https://a/b' });
});
