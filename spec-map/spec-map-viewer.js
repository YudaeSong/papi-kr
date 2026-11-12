"use strict";
/* App Spec Map 공유 뷰어(v2) — 마스터: D:\Projects\_shared\spec-map\spec-map-viewer.js
   프로젝트별 사본은 sync.bat이 배포한다. 이 사본을 직접 수정하지 말 것(마스터 수정 → sync).
   프로젝트 데이터·설정은 같은 폴더(docs/app-spec-map-data/)의 spec-map-data.js (PROJECT, MENUS, GROUPS …) */

/* ═══════════════ 프로젝트 설정 병합 (spec-map-data.js의 PROJECT + 기본값) ═══════════════ */
const PROJ = Object.assign({
  name: "Project", icon: "🗺️", title: "App Spec Map", updated: "",
  unitLabel: "화면·모듈", platTitle: "플랫폼", platLabels: ["웹", "Android", "iOS"],
  tagline: "", overviewTitle: "", overviewTop: "", overviewCards: [], css: "",
  /* 서비스 버튼 — 기본값: 공통 프로토콜 specmap-run:<프로젝트명>/<run|stop> 으로
     프로젝트 루트의 app_run.bat / app_stop.bat 을 실행 (레지스트리 등록: docs/app-spec-map-data/spec-map-service-protocol.reg).
     service: false 로 버튼 숨김, runProtocol/stopProtocol 로 프로토콜 재정의 가능.
     webUrl 은 프로젝트별 포트가 달라 각 spec-map-data.js 에서 지정. */
  service: true, runProtocol: "", runTitle: "", runToast: "",
  stopProtocol: "", stopTitle: "", stopToast: "",
  webUrl: "", webTitle: "", webPopup: true,
  /* 관리자 웹 바로가기 — 프로젝트에 운영자 전용 페이지(/admin 등)가 있을 때만
     spec-map-data.js의 PROJECT.adminUrl을 지정. 미지정 시 버튼 자체를 숨긴다. */
  adminUrl: "", adminTitle: "",
  /* ☰ "ERD 보기" 링크 — app-spec-map.html 기준 상대 경로. 미지정 시 docs/data-model-erd.html */
  erdUrl: "",
}, typeof PROJECT !== "undefined" ? PROJECT : {});

/* ═══════════════ 렌더링 ═══════════════ */
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fmt = s => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

/* ═══════════════ 상태 표기 통일(2026-09-16) ═══════════════
   화면·모듈(SECTIONS 노드) 단위 상태는 더 이상 관리하지 않는다 — 목록에는 "-"만 표시.
   상태는 기능명세 항목(FEATURES)에서만 관리하며, 원본 카탈로그 이모지(✅·🚧·📝·🔄·⏸️)를
   공통 4구간(완료·개발중·개발전·보류)으로 묶어 아이콘 없이 문자로만 보여준다.
   "🔄 검토중"(결정 대기)은 아직 개발 착수 전이라는 뜻이라 "개발전"에 합산한다. */
const FEAT_STATUS_MAP = { "✅":"done", "🚧":"wip", "📝":"plan", "🔄":"plan", "⏸️":"hold" };
const STATUS_TEXT = { done:"완료", wip:"개발중", plan:"개발전", hold:"보류" };
const STATUS_ORDER = ["plan", "wip", "hold", "done"]; // 현황판 카드 표시 순서
function featBucket(code) { return FEAT_STATUS_MAP[code] || "plan"; }
function featStatusText(code) { return STATUS_TEXT[featBucket(code)]; }
const FEAT_STATUS_LEGEND = "완료 · 개발중 · 개발전 · 보류";

/* ═══════════════ v2 데이터 색인 — 주요 메뉴 → 화면(children 재귀) → 기능 / 기능 분류 → 기능 ═══════════════
   기능 행: [기능ID, 기능명, 설명, 상태, 단계, 라우트?]. 라우트(6번째)는 선택 — 보통 기능은 소속 화면의 라우트를
   그대로 쓰므로 비워 두고, 규모가 커져 그 기능만 별도 라우트로 분리됐을 때만 채운다.
   MENUS가 없으면(v1 데이터) 본문에 「v2 형식으로 변환 필요」 안내만 띄운다 — 이중 지원 코드는 두지 않는다. */
const IS_V2 = typeof MENUS !== "undefined" && Array.isArray(MENUS);
const MENU_LIST = IS_V2 ? MENUS : [];
const GROUP_LIST = IS_V2 && typeof GROUPS !== "undefined" && Array.isArray(GROUPS) ? GROUPS : [];
const menuById = {}, groupById = {};
const screenIndex = {};  // 화면 id → { s, menu, depth }
const featIndex = [];    // { f, type:"menu"|"group", ownerId, screen(그룹 기능이면 null) } — 표시 순서
function indexScreens(menu, list, depth) {
  for (const s of list || []) {
    screenIndex[s.id] = { s, menu, depth };
    for (const f of s.features || []) featIndex.push({ f, type: "menu", ownerId: menu.id, screen: s });
    indexScreens(menu, s.children, depth + 1);
  }
}
for (const m of MENU_LIST) { menuById[m.id] = m; indexScreens(m, m.screens, 0); }
for (const g of GROUP_LIST) {
  groupById[g.id] = g;
  for (const f of g.features || []) featIndex.push({ f, type: "group", ownerId: g.id, screen: null });
}
/* 메뉴의 화면을 표시 순서(부모 → children)대로 펼친다 — depth는 들여쓰기 단계 */
function flatScreens(list, depth, out) {
  out = out || [];
  for (const s of list || []) { out.push({ s, depth }); flatScreens(s.children, depth + 1, out); }
  return out;
}
function menuFeatCount(m) { return flatScreens(m.screens, 0).reduce((n, x) => n + (x.s.features || []).length, 0); }
function ownerLabel(type, id) {
  const o = type === "menu" ? menuById[id] : groupById[id];
  return o ? (o.icon ? o.icon + " " : "") + (o.name || "") : "";
}
/* 기능 행이 놓인 카드 id — 화면 기능이면 화면 카드, 분류 기능이면 분류 카드 */
function cardIdOf(type, ownerId, screen) { return screen ? "card-" + screen.id : "card-g-" + ownerId; }
function featWhere(e) { return ownerLabel(e.type, e.ownerId) + (e.screen ? " › " + (e.screen.name || "") : ""); }

function bulletHtml(arr, cls) {
  return '<ul class="plainlist ' + (cls || "") + '">' + arr.map(x => "<li>" + fmt(x) + "</li>").join("") + "</ul>";
}

/* 기능표 — 칸: ID·기능명·설명·상태·단계·라우트.
   설명 칸 50%(2026-08-12 사용자 요청 — 설명이 핵심이라 표의 절반을 설명에 배정).
   라우트 칸은 값이 있든 없든 항상 보여준다(값이 있을 때만 나타나면 표마다 칸 구성이 달라져
   헷갈린다는 피드백, 2026-09-16) — 값이 없으면 「—」. 정렬은 아래 MutationObserver가 자동으로 붙인다. */
const FEAT_TABLE_HEADER = '<tr><th>ID</th><th>기능명</th><th style="width:50%">설명</th><th>상태</th><th>단계</th><th>라우트</th></tr>';
function featureRowHtml(f) {
  return '<tr id="feat-' + esc(String(f[0] || "")) + '"><td class="no">' + esc(String(f[0] || "")) + "</td><td>" + esc(f[1] || "") + "</td>" +
    "<td>" + esc(f[2] || "") + '</td><td class="st" title="' + esc(FEAT_STATUS_LEGEND) + '">' + esc(featStatusText(f[3])) + "</td>" +
    '<td class="st">' + esc(f[4] || "") + '</td><td class="no">' + esc(f[5] || "—") + "</td></tr>";
}
function featureTableHtml(features) {
  if (!features || !features.length) return "";
  return '<div class="tblwrap"><table class="spec">' + FEAT_TABLE_HEADER + features.map(featureRowHtml).join("") + "</table></div>";
}
/* 플랫폼 칩 — 라벨은 PROJECT.platLabels(없으면 PROJ 기본값), 툴팁은 PLAT_LEGEND(데이터에 있을 때만) */
function platChipsHtml(plat) {
  if (!plat || !plat.length) return "";
  const tip = typeof PLAT_LEGEND !== "undefined" && PLAT_LEGEND ? ' title="' + esc(PLAT_LEGEND) + '"' : "";
  return '<span class="plat-chips">' + plat.map((v, i) =>
    '<span class="chip"' + tip + ">" + esc(((PROJ.platLabels[i] || "") + " " + (v || "")).trim()) + "</span>").join("") + "</span>";
}
/* 기능명세 원본 문서 링크(SPEC_DOC_URL이 있는 프로젝트만) */
function specDocLinkHtml() {
  return typeof SPEC_DOC_URL !== "undefined" && SPEC_DOC_URL
    ? '<span class="src"><a href="' + SPEC_DOC_URL + '" title="기능명세 원본 문서">📄 기능명세 원본 열기</a></span>' : "";
}
/* 화면 카드 — 머리(화면명·라우트·플랫폼 칩·기능 수) / 몸통(desc · ⚠️ 이슈 · 기능표). 하위 화면은 들여쓰고 「└」 */
function screenCardHtml(s, depth) {
  const feats = s.features || [];
  return '<div class="card scard" id="card-' + esc(String(s.id)) + '" style="margin-left:' + (depth * 28) + 'px">' +
    '<div class="scard-head">' +
      '<span class="scard-name">' + (depth ? '<span class="scard-sub">└</span>' : "") +
        '<span class="nid">' + esc(String(s.id)) + "</span>" + esc(s.name || "") + "</span>" +
      (s.route && s.route !== "—" ? '<span class="d-route">' + esc(s.route) + "</span>" : "") +
      platChipsHtml(s.plat) +
      '<span class="scard-cnt">기능 ' + feats.length + "건</span>" +
    "</div>" +
    (s.desc ? '<p class="scard-desc">' + fmt(s.desc) + "</p>" : "") +
    (s.issues && s.issues.length ? '<div class="scard-issues">' + bulletHtml(s.issues, "issues") + "</div>" : "") +
    (feats.length ? featureTableHtml(feats) : '<p class="empty-files">이 화면에 직접 딸린 기능이 없습니다.</p>') +
  "</div>";
}
function groupCardHtml(g) {
  const feats = g.features || [];
  return '<div class="card scard" id="card-g-' + esc(String(g.id)) + '">' +
    '<div class="scard-head"><span class="scard-name">' + esc(ownerLabel("group", g.id)) + "</span>" +
      '<span class="scard-cnt">기능 ' + feats.length + "건</span></div>" +
    (g.desc ? '<p class="scard-desc">' + fmt(g.desc) + "</p>" : "") +
    (g.issues && g.issues.length ? '<div class="scard-issues">' + bulletHtml(g.issues, "issues") + "</div>" : "") +
    (feats.length ? featureTableHtml(feats) : '<p class="empty-files">이 분류에 등록된 기능이 없습니다.</p>') +
  "</div>";
}

/* ═══════════════ INBOX(기능정의) 행 편집 표 ═══════════════
   왼쪽 「기타」의 📥 INBOX 고정 항목(renderInboxPage)이 이 행 단위 편집 표를 그린다.
   - 데이터: 같은 폴더의 spec-map-inbox.js → const INBOX = [{name, desc, status, prio}, …]
     (name=기능명, desc=설명(줄바꿈 \n 허용), status=FEAT_LEGEND의 상태값, prio=상·중·하)
   - 편집(추가·수정·삭제) 중 변경분은 화면에만 있고(초안 보관 없음 — 새로고침하면 버림, 2026-09-15),
     💾 저장 시 File System Access API로 spec-map-inbox.js 를 다시 쓴다
     (최초 1회 docs 폴더 선택 — 폴더 핸들은 IndexedDB에 보관, Shift+클릭으로 재선택, 미지원/실패 시 다운로드 대체). */
const INBOX_PRIO = ["상", "중", "하"];
const inboxStatusOptions = () => FEAT_LEGEND.split(" · ");
const INBOX_DRAFT_KEY = "specmap-inbox-draft:" + PROJ.name;
const INBOX_FILTER_KEY = "specmap-inbox-filter:" + PROJ.name;

let inboxRows = (typeof INBOX !== "undefined" && Array.isArray(INBOX))
  ? INBOX.map(r => ({ name: r.name || "", desc: r.desc || "", status: r.status || "🔄 검토중", prio: r.prio || "중" }))
  : [];
let inboxDirty = false;
/* 검색어·상태 필터(2026-09-10 신설) — 카드는 노드를 옮길 때마다 새로 그려지므로 선택 상태는 모듈 스코프에 둔다.
   기본값은 "✅ 구현"만 해제(완료된 건 감춤), 나머지 상태는 모두 표시. 사용자가 바꾼 선택은 localStorage에 보관. */
let inboxQuery = "";
let inboxStatusFilter = null;   // Set<string> — 최초 사용 시 보관값(없으면 기본값)으로 초기화
let inboxOutsideBound = false;  // 필터 패널 바깥클릭·ESC 리스너는 document에 한 번만 건다
/* 초안 폐지(2026-09-15 지시) — 새로고침은 저장 안 한 편집을 버리겠다는 뜻이다(beforeunload가 이미 묻는다).
 * 예전엔 localStorage 초안을 새로고침 뒤 복원해 파일과 같아도 「저장 안 됨」이 계속 떴고, 파일에 새로 들어온
 * 행을 옛 초안이 가려 저장 시 지워질 수 있었다. 이제 보관·복원하지 않고, 남은 옛 초안은 지운다.
 * 「저장 안 됨」은 파일 내용과 실제로 다를 때만 띄운다. */
try { localStorage.removeItem(INBOX_DRAFT_KEY); } catch {}
let inboxBaseSnap = JSON.stringify(inboxRows); // 마지막으로 불러오거나 저장한 파일 내용
window.addEventListener("beforeunload", e => { if (inboxDirty) e.preventDefault(); });

/* IndexedDB 미니 kv 저장소 — 파일 핸들 보관용(localStorage에는 핸들을 저장할 수 없음) */
function idbKv() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("specmap-kv", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(key) {
  const db = await idbKv();
  return new Promise((res, rej) => {
    const t = db.transaction("kv").objectStore("kv").get(key);
    t.onsuccess = () => res(t.result); t.onerror = () => rej(t.error);
  });
}
async function idbSet(key, val) {
  const db = await idbKv();
  return new Promise((res, rej) => {
    const t = db.transaction("kv", "readwrite").objectStore("kv").put(val, key);
    t.onsuccess = () => res(); t.onerror = () => rej(t.error);
  });
}

/* 필터에 나열할 상태 목록 — FEAT_LEGEND의 표준 상태 + 데이터에만 있는 비표준 상태(보존) */
function inboxAllStatuses() {
  const out = [];
  for (const s of inboxStatusOptions()) if (!out.includes(s)) out.push(s);
  for (const r of inboxRows) { const st = r.status || ""; if (st && !out.includes(st)) out.push(st); }
  return out;
}
function inboxFilterSet() {
  if (inboxStatusFilter) return inboxStatusFilter;
  let saved = null;
  try { const raw = localStorage.getItem(INBOX_FILTER_KEY); if (raw) saved = JSON.parse(raw); } catch {}
  const all = inboxAllStatuses();
  inboxStatusFilter = Array.isArray(saved)
    ? new Set(saved.filter(s => all.includes(s)))
    : new Set(all.filter(s => !s.startsWith("✅"))); // 기본: ✅(구현)만 해제
  return inboxStatusFilter;
}
function inboxSaveFilter() {
  try { localStorage.setItem(INBOX_FILTER_KEY, JSON.stringify(Array.from(inboxFilterSet()))); } catch {}
}
/* 검색어는 공백으로 나눠 AND 매칭 — 기능명+설명을 함께 훑는다 */
function inboxMatches(r) {
  if (!inboxFilterSet().has(r.status || "")) return false;
  const terms = inboxQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = ((r.name || "") + " " + (r.desc || "")).toLowerCase();
  return terms.every(t => hay.includes(t));
}

function inboxCardHtml() {
  return '<div class="card" id="inboxCard"><h3>주요 기능 <span id="inboxCount" style="font-weight:400"></span>' +
    '<span class="src">행 단위로 직접 편집 — 💾 저장 시 <code>docs/app-spec-map-data/spec-map-inbox.js</code>에 기록(저장 전에 새로고침하면 변경분은 사라짐)</span></h3>' +
    '<div class="inbox-bar">' +
      '<button id="inboxAdd" class="hbtn" title="빈 행을 표 맨 위에 추가">➕ 행 추가</button>' +
      '<button id="inboxSave" class="hbtn" title="docs/app-spec-map-data/spec-map-inbox.js로 저장 (최초 1회 docs 폴더 선택 · Shift+클릭으로 폴더 다시 선택)">💾 저장</button>' +
      '<span id="inboxState"></span>' +
      '<div class="inbox-tools">' +
        '<input id="inboxSearch" type="search" placeholder="기능명·설명 검색…" autocomplete="off" title="기능명과 설명을 검색 (공백으로 나누면 모두 포함한 행만)">' +
        '<div class="menu">' +
          '<button id="inboxFilterBtn" class="hbtn" aria-haspopup="true" aria-expanded="false" title="표에 표시할 상태를 체크">☑ 상태 <span id="inboxFilterCount"></span> ▾</button>' +
          '<div id="inboxFilterPanel" class="menu-panel" role="menu" hidden></div>' +
        '</div>' +
      '</div></div>' +
    '<div class="tblwrap"><table class="spec inbox"><thead>' +
    // 컬럼 폭(2026-08-12 사용자 요청) — 설명이 핵심이라 표의 50%를 설명에 배정,
    // 기능명·상태·중요도는 좁게. 상태/중요도는 select 내용 폭으로 자연 수축한다.
    '<tr><th style="width:18%;min-width:110px">기능명</th><th style="width:50%">설명</th>' +
    '<th style="width:110px">상태</th><th style="width:70px">중요도</th><th style="width:34px"></th></tr></thead>' +
    '<tbody id="inboxBody"></tbody></table></div>' +
    '<p class="empty-files" id="inboxEmpty" style="margin-top:6px">등록된 기능정의가 없습니다 — ➕ 행 추가로 시작하세요.</p></div>';
}

function autoGrow(ta) { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; }

function mkSelect(options, value) {
  const sel = document.createElement("select");
  const opts = options.includes(value) || !value ? options : [value].concat(options); // 목록 밖 값도 보존
  for (const o of opts) {
    const el = document.createElement("option");
    el.value = el.textContent = o;
    if (o === value) el.selected = true;
    sel.appendChild(el);
  }
  return sel;
}

function inboxUpdateState() {
  const st = document.getElementById("inboxState");
  const cnt = document.getElementById("inboxCount");
  const empty = document.getElementById("inboxEmpty");
  const shown = inboxRows.filter(inboxMatches).length;
  if (cnt) cnt.textContent = shown === inboxRows.length
    ? "(" + inboxRows.length + "건)"
    : "(" + shown + " / " + inboxRows.length + "건)";
  if (empty) {
    empty.style.display = shown ? "none" : "";
    empty.textContent = inboxRows.length
      ? "검색어·상태 필터에 맞는 항목이 없습니다 — 조건을 바꿔보세요."
      : "등록된 기능정의가 없습니다 — ➕ 행 추가로 시작하세요.";
  }
  if (st) {
    st.textContent = inboxDirty ? "● 저장 안 됨 — 새로고침·닫으면 사라집니다" : "저장됨";
    st.classList.toggle("dirty", inboxDirty);
  }
}

function inboxMarkDirty() {
  inboxDirty = JSON.stringify(inboxRows) !== inboxBaseSnap; // 편집을 되돌려 파일과 같아지면 「저장됨」
  inboxUpdateState();
}
function inboxMarkSaved() {
  inboxBaseSnap = JSON.stringify(inboxRows);
  inboxDirty = false;
  inboxUpdateState();
}

function inboxRenderRows(focusIdx) {
  const body = document.getElementById("inboxBody");
  if (!body) return;
  body.innerHTML = "";
  let focusPos = null;
  inboxRows.forEach((r, i) => {
    if (!inboxMatches(r)) return; // 검색어·상태 필터에서 벗어난 행은 그리지 않는다
                                  // (i는 원본 인덱스 그대로라 편집·삭제는 영향 없음)
    if (i === focusIdx) focusPos = body.rows.length;
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    const inName = document.createElement("input");
    inName.type = "text"; inName.value = r.name; inName.placeholder = "기능명";
    inName.addEventListener("input", () => { r.name = inName.value; inboxMarkDirty(); });
    tdName.appendChild(inName);

    const tdDesc = document.createElement("td");
    const ta = document.createElement("textarea");
    ta.rows = 1; ta.value = r.desc; ta.placeholder = "설명 (Enter로 줄바꿈)";
    ta.addEventListener("input", () => { r.desc = ta.value; autoGrow(ta); inboxMarkDirty(); });
    tdDesc.appendChild(ta);

    const tdSt = document.createElement("td"); tdSt.className = "st";
    const selSt = mkSelect(inboxStatusOptions(), r.status);
    selSt.addEventListener("change", () => { r.status = selSt.value; inboxMarkDirty(); });
    tdSt.appendChild(selSt);

    const tdPr = document.createElement("td"); tdPr.className = "st";
    const selPr = mkSelect(INBOX_PRIO, r.prio);
    selPr.addEventListener("change", () => { r.prio = selPr.value; inboxMarkDirty(); });
    tdPr.appendChild(selPr);

    const tdDel = document.createElement("td"); tdDel.className = "st";
    const del = document.createElement("button");
    del.className = "ib-del"; del.textContent = "✕"; del.title = "행 삭제"; // 🗑 이모지는 다크 테마에서 검정으로 렌더링돼 ✕+빨강으로 교체
    del.addEventListener("click", () => {
      if (!confirm('"' + (r.name || "(기능명 없음)") + '" 행을 삭제할까요?')) return;
      inboxRows.splice(i, 1);
      inboxMarkDirty();
      inboxRenderRows();
    });
    tdDel.appendChild(del);

    tr.append(tdName, tdDesc, tdSt, tdPr, tdDel);
    body.appendChild(tr);
  });
  body.querySelectorAll("textarea").forEach(autoGrow); // DOM 삽입 후에야 scrollHeight 계산 가능
  inboxUpdateState();
  if (focusPos != null && body.rows[focusPos]) body.rows[focusPos].querySelector("input").focus();
}

function inboxFileContent() {
  const rows = inboxRows.map(r =>
    "  " + JSON.stringify({ name: r.name, desc: r.desc, status: r.status, prio: r.prio })).join(",\n");
  return "/* App Spec Map — INBOX(기능정의) 행 데이터. 뷰어의 INBOX 표(inbox:true 노드)에서 편집한 뒤\n" +
    "   💾 저장하면 이 파일이 다시 쓰인다(직접 수정도 가능 — 형식 유지).\n" +
    '   행: { name:기능명, desc:설명(줄바꿈은 \\n), status:"' + inboxStatusOptions().join('"|"') + '", prio:"상"|"중"|"하" } */\n' +
    "const INBOX = [\n" + rows + (rows ? "\n" : "") + "];\n";
}

/* 저장 폴더(docs/app-spec-map-data) — 파일이 아니라 폴더를 고르게 한다. 파일 선택 창은 이름만 보여
   엉뚱한 위치(docs 루트 등)의 같은 이름 파일을 골라도 알 수 없었고, 그 핸들이 기억돼 계속 그곳에 썼다.
   docs 폴더를 고르면 그 아래 app-spec-map-data로 내려가고, 대상 파일이 이미 없는 폴더는 거절한다.
   💾 저장을 Shift+클릭하면 기억한 폴더를 버리고 다시 고른다. */
const SPEC_DATA_SUBDIR = "app-spec-map-data";
const SPEC_DATA_DIR_KEY = "specmap-data-dir:" + PROJ.name;
let specDataDir = null;
let specDataDirReset = false;
document.addEventListener("click", e => { specDataDirReset = !!e.shiftKey; }, true);
async function specDataFileHandle(fileName) {
  let dir = specDataDirReset ? null : specDataDir;
  if (!dir && !specDataDirReset) {
    try { dir = await idbGet(SPEC_DATA_DIR_KEY); } catch {}
    if (dir) {
      try {
        let p = await dir.queryPermission({ mode: "readwrite" });
        if (p !== "granted") p = await dir.requestPermission({ mode: "readwrite" });
        if (p !== "granted") dir = null;
      } catch { dir = null; }
    }
  }
  if (!dir) {
    toast("💾 저장할 폴더를 선택하세요 — docs 폴더(또는 docs/" + SPEC_DATA_SUBDIR + ")", 8000);
    dir = await showDirectoryPicker({ id: "specmap-data-docs", mode: "readwrite" });
  }
  let handle;
  try {
    try {
      handle = await dir.getFileHandle(fileName);
    } catch {
      dir = await dir.getDirectoryHandle(SPEC_DATA_SUBDIR);
      handle = await dir.getFileHandle(fileName);
    }
  } catch {
    specDataDir = null;
    try { await idbSet(SPEC_DATA_DIR_KEY, null); } catch {}
    throw Object.assign(new Error("선택한 폴더에 " + fileName + "가 없습니다 — docs 폴더(또는 docs/" + SPEC_DATA_SUBDIR + ")를 고르세요."), { name: "WrongDir" });
  }
  specDataDir = dir;
  try { await idbSet(SPEC_DATA_DIR_KEY, dir); } catch {}
  return handle;
}
async function inboxSaveFile() {
  const content = inboxFileContent();
  if (window.showDirectoryPicker) {
    try {
      const handle = await specDataFileHandle("spec-map-inbox.js");
      const w = await handle.createWritable();
      await w.write(content);
      await w.close();
      inboxMarkSaved();
      toast("💾 저장 완료 — " + (handle.name || "spec-map-inbox.js"), 4000);
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return; // 사용자가 폴더 선택을 취소 — 편집 내용은 화면에 그대로 유지
      if (e && e.name === "WrongDir") { toast(e.message, 8000); return; }
      console.error("INBOX 파일 저장 실패 — 다운로드로 대체:", e);
    }
  }
  const a = document.createElement("a"); // 대체 경로: 다운로드 후 수동 덮어쓰기
  a.href = URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
  a.download = "spec-map-inbox.js";
  a.click();
  URL.revokeObjectURL(a.href);
  inboxMarkSaved();
  toast("파일 저장 API를 쓸 수 없어 다운로드로 대체 — 받은 spec-map-inbox.js를 docs/app-spec-map-data 폴더에 덮어쓰세요.", 8000);
}

/* 상태 필터 드롭다운 — 체크한 상태의 행만 표에 남는다 */
function inboxRenderFilterPanel() {
  const panel = document.getElementById("inboxFilterPanel");
  if (!panel) return;
  const sel = inboxFilterSet();
  panel.innerHTML = "";
  for (const s of inboxAllStatuses()) {
    const lab = document.createElement("label");
    lab.className = "menu-item ib-check";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = sel.has(s);
    cb.addEventListener("change", () => {
      if (cb.checked) sel.add(s); else sel.delete(s);
      inboxSaveFilter();
      inboxUpdateFilterBtn();
      inboxRenderRows();
    });
    lab.append(cb, document.createTextNode(s));
    panel.appendChild(lab);
  }
  const sep = document.createElement("div"); sep.className = "menu-sep";
  panel.appendChild(sep);
  const bulk = (text, fn) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "menu-item"; b.textContent = text;
    b.addEventListener("click", () => {
      fn();
      inboxSaveFilter();
      inboxRenderFilterPanel();
      inboxUpdateFilterBtn();
      inboxRenderRows();
    });
    return b;
  };
  panel.appendChild(bulk("모두 선택", () => inboxAllStatuses().forEach(s => sel.add(s))));
  panel.appendChild(bulk("모두 해제", () => sel.clear()));
}
function inboxUpdateFilterBtn() {
  const el = document.getElementById("inboxFilterCount");
  if (el) el.textContent = "(" + inboxFilterSet().size + "/" + inboxAllStatuses().length + ")";
}
function inboxCloseFilter() {
  const p = document.getElementById("inboxFilterPanel");
  const b = document.getElementById("inboxFilterBtn");
  if (p) p.setAttribute("hidden", "");
  if (b) b.setAttribute("aria-expanded", "false");
}

function bindInbox() {
  document.getElementById("inboxAdd").addEventListener("click", () => {
    const row = { name: "", desc: "", status: "🔄 검토중", prio: "중" }; // 새 행은 표 최상단에
    inboxRows.unshift(row);
    // 검색어·상태 필터에 가려 새 행이 안 보이면 입력할 수가 없다 — 그 조건만 풀어준다
    if (inboxQuery) {
      inboxQuery = "";
      const q = document.getElementById("inboxSearch");
      if (q) q.value = "";
    }
    if (!inboxFilterSet().has(row.status)) {
      inboxFilterSet().add(row.status);
      inboxSaveFilter();
      inboxRenderFilterPanel();
      inboxUpdateFilterBtn();
    }
    inboxMarkDirty();
    inboxRenderRows(0);
  });
  document.getElementById("inboxSave").addEventListener("click", inboxSaveFile);

  const q = document.getElementById("inboxSearch");
  q.value = inboxQuery; // 다른 노드에 다녀와도 검색어 유지
  q.addEventListener("input", () => { inboxQuery = q.value; inboxRenderRows(); });

  const fbtn = document.getElementById("inboxFilterBtn");
  const fpanel = document.getElementById("inboxFilterPanel");
  fbtn.addEventListener("click", e => {
    e.stopPropagation();
    const willOpen = fpanel.hasAttribute("hidden");
    if (willOpen) fpanel.removeAttribute("hidden"); else fpanel.setAttribute("hidden", "");
    fbtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
  if (!inboxOutsideBound) { // 카드는 렌더마다 새로 만들어지지만 document 리스너는 한 번만
    inboxOutsideBound = true;
    document.addEventListener("click", e => {
      const p = document.getElementById("inboxFilterPanel");
      const b = document.getElementById("inboxFilterBtn");
      if (!p || p.hasAttribute("hidden")) return;
      if (!p.contains(e.target) && e.target !== b) inboxCloseFilter();
    });
    document.addEventListener("keydown", e => {
      const p = document.getElementById("inboxFilterPanel");
      if (e.key === "Escape" && p && !p.hasAttribute("hidden")) inboxCloseFilter();
    });
  }

  inboxRenderFilterPanel();
  inboxUpdateFilterBtn();
  inboxRenderRows();
}

/* ═══════════════ CHANGELOG(버전별 변경 이력) 행 편집 표 ═══════════════
   왼쪽 「기타」의 📜 변경 이력 고정 항목(renderChangelogPage)이 버전별로 묶인 변경 이력 편집 표 + 릴리스 노트
   미리보기가 렌더링된다. INBOX(위)와 동일한 저장 방식(File System Access API)을 쓴다.
   - 데이터: 같은 폴더의 spec-map-changelog.js → const CHANGELOG = [{version, date, type, desc}, …]
     (version="" 이면 아직 배포 버전이 정해지지 않은 "미배포" 항목)
   - 평소 작업하면서 항목을 버전 없이(미배포) 쌓아두다가, 배포 시점에 "미배포 항목을
     이 버전으로 지정" 한 번으로 일괄 지정한 뒤, 아래 릴리스 노트 미리보기에서 그 버전을
     선택해 구분(기능추가/기능개선/버그수정/기타)별로 정리된 텍스트를 복사해 스토어에 붙여넣는다. */
const CHANGELOG_TYPES = ["기능추가", "기능개선", "버그수정", "기타"];
const CHANGELOG_DRAFT_KEY = "specmap-changelog-draft:" + PROJ.name;

let changelogRows = (typeof CHANGELOG !== "undefined" && Array.isArray(CHANGELOG))
  ? CHANGELOG.map(r => ({ version: r.version || "", date: r.date || "", type: r.type || "기능추가", desc: r.desc || "" }))
  : [];
let changelogDirty = false;
/* 초안 폐지(2026-09-15 지시) — INBOX와 같다: 새로고침하면 저장 안 한 편집은 버리고, 남은 옛 초안은 지운다 */
try { localStorage.removeItem(CHANGELOG_DRAFT_KEY); } catch {}
let changelogBaseSnap = JSON.stringify(changelogRows); // 마지막으로 불러오거나 저장한 파일 내용
window.addEventListener("beforeunload", e => { if (changelogDirty) e.preventDefault(); });

function changelogCardHtml() {
  return '<div class="card" id="chgCard"><h3>버전별 변경 이력 <span id="chgCount" style="font-weight:400"></span>' +
    '<span class="src">행 단위로 직접 편집 — 💾 저장 시 <code>docs/app-spec-map-data/spec-map-changelog.js</code>에 기록(저장 전에 새로고침하면 변경분은 사라짐)</span></h3>' +
    '<div class="inbox-bar">' +
      '<button id="chgAdd" class="hbtn" title="빈 행을 미배포 그룹 맨 위에 추가">➕ 행 추가</button>' +
      '<button id="chgSave" class="hbtn" title="spec-map-changelog.js 파일로 저장 (최초 1회 파일 선택)">💾 저장</button>' +
      '<span id="chgState"></span></div>' +
    '<div class="chg-bulk">' +
      '<input id="chgBulkVer" type="text" placeholder="배포할 버전 (예: 4.20260730)">' +
      '<button id="chgBulkApply" class="hbtn" title="버전이 비어있는(미배포) 행 전체에 이 버전을 지정">미배포 항목을 이 버전으로 지정</button>' +
    '</div>' +
    '<div class="tblwrap"><table class="spec inbox"><thead>' +
    '<tr><th style="min-width:90px">버전</th><th style="min-width:90px">날짜</th><th>구분</th><th>설명</th><th></th></tr></thead>' +
    '<tbody id="chgBody"></tbody></table></div>' +
    '<p class="empty-files" id="chgEmpty" style="margin-top:6px">기록된 변경 이력이 없습니다 — ➕ 행 추가로 시작하세요.</p></div>' +
    '<div class="card" id="chgPreviewCard"><h3>릴리스 노트 미리보기</h3>' +
      '<div class="chg-preview-bar">' +
        '<select id="chgVerSelect"></select>' +
        '<button id="chgCopyBtn" class="hbtn" title="아래 텍스트를 클립보드로 복사">📋 복사</button>' +
      '</div>' +
      '<textarea id="chgPreview" class="chg-preview" readonly placeholder="위 표에서 버전을 선택하면 스토어에 붙여넣기 좋은 형식으로 정리됩니다."></textarea>' +
    '</div>';
}

function changelogUpdateState() {
  const st = document.getElementById("chgState");
  const cnt = document.getElementById("chgCount");
  const empty = document.getElementById("chgEmpty");
  if (cnt) cnt.textContent = "(" + changelogRows.length + "건)";
  if (empty) empty.style.display = changelogRows.length ? "none" : "";
  if (st) {
    st.textContent = changelogDirty ? "● 저장 안 됨 — 새로고침·닫으면 사라집니다" : "저장됨";
    st.classList.toggle("dirty", changelogDirty);
  }
}

function changelogMarkDirty() {
  changelogDirty = JSON.stringify(changelogRows) !== changelogBaseSnap; // 되돌려 파일과 같아지면 「저장됨」
  changelogUpdateState();
}
function changelogMarkSaved() {
  changelogBaseSnap = JSON.stringify(changelogRows);
  changelogDirty = false;
  changelogUpdateState();
}

/* 버전별 그룹 — 미배포(버전 없음)가 먼저, 그다음 버전 문자열 내림차순 */
function changelogGroups() {
  const map = new Map();
  changelogRows.forEach((r, i) => {
    const key = r.version || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(i);
  });
  const keys = [...map.keys()].sort((a, b) => {
    if (a === "" && b === "") return 0;
    if (a === "") return -1;
    if (b === "") return 1;
    return b.localeCompare(a);
  });
  return keys.map(k => ({ version: k, indices: map.get(k) }));
}

function changelogPreviewText(version) {
  const rows = changelogRows.filter(r => (r.version || "") === (version || ""));
  if (!rows.length) return "";
  const byType = new Map();
  CHANGELOG_TYPES.forEach(t => byType.set(t, []));
  rows.forEach(r => {
    const t = CHANGELOG_TYPES.includes(r.type) ? r.type : "기타";
    byType.get(t).push(r.desc || "");
  });
  const parts = [];
  for (const t of CHANGELOG_TYPES) {
    const descs = byType.get(t).filter(Boolean);
    if (!descs.length) continue;
    parts.push("[" + t + "]\n" + descs.map(d => "- " + d).join("\n"));
  }
  return parts.join("\n\n");
}

function changelogRefreshPreviewUI() {
  const sel = document.getElementById("chgVerSelect");
  if (!sel) return;
  const groups = changelogGroups();
  const prev = sel.value;
  sel.innerHTML = "";
  groups.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.version;
    opt.textContent = g.version ? ("버전 " + g.version + " (" + g.indices.length + "건)") : ("(미배포 초안 · " + g.indices.length + "건)");
    sel.appendChild(opt);
  });
  if (groups.some(g => g.version === prev)) sel.value = prev;
  const ta = document.getElementById("chgPreview");
  if (ta) ta.value = changelogPreviewText(sel.value || "");
}

function changelogRenderRows() {
  const body = document.getElementById("chgBody");
  if (!body) return;
  body.innerHTML = "";
  changelogGroups().forEach(g => {
    const trh = document.createElement("tr");
    trh.className = "chg-group-row";
    const th = document.createElement("td");
    th.colSpan = 5;
    th.textContent = g.version ? ("버전 " + g.version + " (" + g.indices.length + "건)") : ("🟡 미배포(초안) · " + g.indices.length + "건");
    trh.appendChild(th);
    body.appendChild(trh);

    g.indices.forEach(i => {
      const r = changelogRows[i];
      const tr = document.createElement("tr");

      const tdVer = document.createElement("td");
      const inVer = document.createElement("input");
      inVer.type = "text"; inVer.value = r.version; inVer.placeholder = "미배포";
      inVer.addEventListener("input", () => { r.version = inVer.value; changelogMarkDirty(); });
      inVer.addEventListener("change", () => changelogRenderRows()); // 버전이 바뀌면 그룹 재구성
      tdVer.appendChild(inVer);

      const tdDate = document.createElement("td");
      const inDate = document.createElement("input");
      inDate.type = "text"; inDate.value = r.date; inDate.placeholder = "YYYY-MM-DD";
      inDate.addEventListener("input", () => { r.date = inDate.value; changelogMarkDirty(); });
      tdDate.appendChild(inDate);

      const tdType = document.createElement("td"); tdType.className = "st";
      const selType = mkSelect(CHANGELOG_TYPES, r.type);
      selType.addEventListener("change", () => { r.type = selType.value; changelogMarkDirty(); });
      tdType.appendChild(selType);

      const tdDesc = document.createElement("td");
      const ta = document.createElement("textarea");
      ta.rows = 1; ta.value = r.desc; ta.placeholder = "변경 내용 (Enter로 줄바꿈)";
      ta.addEventListener("input", () => { r.desc = ta.value; autoGrow(ta); changelogMarkDirty(); });
      tdDesc.appendChild(ta);

      const tdDel = document.createElement("td"); tdDel.className = "st";
      const del = document.createElement("button");
      del.className = "ib-del"; del.textContent = "✕"; del.title = "행 삭제";
      del.addEventListener("click", () => {
        if (!confirm('"' + (r.desc || "(설명 없음)") + '" 행을 삭제할까요?')) return;
        changelogRows.splice(i, 1);
        changelogMarkDirty();
        changelogRenderRows();
      });
      tdDel.appendChild(del);

      tr.append(tdVer, tdDate, tdType, tdDesc, tdDel);
      body.appendChild(tr);
    });
  });
  body.querySelectorAll("textarea").forEach(autoGrow);
  changelogUpdateState();
  changelogRefreshPreviewUI();
}

function changelogFileContent() {
  const rows = changelogRows.map(r =>
    "  " + JSON.stringify({ version: r.version, date: r.date, type: r.type, desc: r.desc })).join(",\n");
  return "/* App Spec Map — CHANGELOG(버전별 변경 이력) 행 데이터. 뷰어의 버전별 변경 이력 표\n" +
    "   (changelog:true 노드)에서 편집한 뒤 💾 저장하면 이 파일이 다시 쓰인다(직접 수정도 가능 — 형식 유지).\n" +
    '   행: { version:버전문자열("" = 미배포), date:"YYYY-MM-DD", type:"' + CHANGELOG_TYPES.join('"|"') + '", desc:설명(줄바꿈은 \\n) } */\n' +
    "const CHANGELOG = [\n" + rows + (rows ? "\n" : "") + "];\n";
}

async function changelogSaveFile() {
  const content = changelogFileContent();
  if (window.showDirectoryPicker) {
    try {
      const handle = await specDataFileHandle("spec-map-changelog.js");
      const w = await handle.createWritable();
      await w.write(content);
      await w.close();
      changelogMarkSaved();
      toast("💾 저장 완료 — " + (handle.name || "spec-map-changelog.js"), 4000);
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
      if (e && e.name === "WrongDir") { toast(e.message, 8000); return; }
      console.error("CHANGELOG 파일 저장 실패 — 다운로드로 대체:", e);
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
  a.download = "spec-map-changelog.js";
  a.click();
  URL.revokeObjectURL(a.href);
  changelogMarkSaved();
  toast("파일 저장 API를 쓸 수 없어 다운로드로 대체 — 받은 spec-map-changelog.js를 docs/app-spec-map-data 폴더에 덮어쓰세요.", 8000);
}

function bindChangelog() {
  document.getElementById("chgAdd").addEventListener("click", () => {
    changelogRows.unshift({ version: "", date: new Date().toISOString().slice(0, 10), type: "기능추가", desc: "" });
    changelogMarkDirty();
    changelogRenderRows();
  });
  document.getElementById("chgSave").addEventListener("click", changelogSaveFile);
  document.getElementById("chgBulkApply").addEventListener("click", () => {
    const inp = document.getElementById("chgBulkVer");
    const v = (inp.value || "").trim();
    if (!v) { toast("지정할 버전을 입력하세요.", 2500); return; }
    const today = new Date().toISOString().slice(0, 10);
    let n = 0;
    changelogRows.forEach(r => { if (!r.version) { r.version = v; if (!r.date) r.date = today; n++; } });
    if (n) {
      inp.value = "";
      changelogMarkDirty();
      changelogRenderRows();
      toast("미배포 " + n + "건을 버전 " + v + "로 지정했습니다.", 3000);
    } else {
      toast("미배포(버전 없음) 항목이 없습니다.", 2500);
    }
  });
  document.getElementById("chgVerSelect").addEventListener("change", e => {
    const ta = document.getElementById("chgPreview");
    if (ta) ta.value = changelogPreviewText(e.target.value);
  });
  document.getElementById("chgCopyBtn").addEventListener("click", async () => {
    const ta = document.getElementById("chgPreview");
    try {
      await navigator.clipboard.writeText(ta.value);
    } catch {
      ta.removeAttribute("readonly");
      ta.select();
      document.execCommand("copy");
      ta.setAttribute("readonly", "readonly");
    }
    toast("📋 릴리스 노트를 클립보드에 복사했습니다.", 2500);
  });
  changelogRenderRows();
}

/* 상세 영역 텍스트 노드에서 검색어를 <mark class="hl">로 감싸 강조 */
function highlightDetail(root, q) {
  if (!q) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: t => t.nodeValue.toLowerCase().includes(q) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  const hits = [];
  while (walker.nextNode()) hits.push(walker.currentNode);
  for (const t of hits) {
    const text = t.nodeValue, lower = text.toLowerCase();
    const frag = document.createDocumentFragment();
    let pos = 0, i;
    while ((i = lower.indexOf(q, pos)) >= 0) {
      if (i > pos) frag.appendChild(document.createTextNode(text.slice(pos, i)));
      const m = document.createElement("mark");
      m.className = "hl";
      m.textContent = text.slice(i, i + q.length);
      frag.appendChild(m);
      pos = i + q.length;
    }
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    t.parentNode.replaceChild(frag, t);
  }
}

/* ═══════════════ 뒤로가기(화면 이동 이력) ═══════════════
   방금 보던 화면(개요의 열린 목록, 메뉴·분류 카드 목록, 검색 결과 등)을 스택에 쌓아두고,
   다른 화면으로 이동한 뒤 "← 뒤로"(이동경로 맨 앞)를 누르면 스크롤 위치까지 그대로 복원한다.
   전 프로젝트 공유 뷰어 공통 동작 — 모든 목록·메뉴·검색 결과 클릭이 이 경로를 탄다. */
let currentView = null; // { type:"overview", ovKey } | { type:"menu"|"group", id } | { type:"inbox"|"changelog" } | { type:"search", q }
const viewStack = [];
function snapshotCurrentView() {
  if (!currentView) return null;
  const detail = document.getElementById("detail");
  return Object.assign({}, currentView, { scroll: detail ? detail.scrollTop : 0 });
}
/* opts.target = 스크롤해 강조할 요소 id(카드·기능 행), opts.hl = 강조할 검색어 */
function goTo(view, opts) {
  if (!view) return;
  if ((view.type === "menu" || view.type === "group") && !view.id) return;
  const snap = snapshotCurrentView();
  if (snap) viewStack.push(snap);
  renderView(view, opts);
}
function goBack() {
  const prev = viewStack.pop();
  if (!prev) { showOverview(); return; }
  renderView(prev);
  const detail = document.getElementById("detail");
  requestAnimationFrame(() => { if (detail) detail.scrollTop = prev.scroll || 0; });
}
function renderView(v, opts) {
  opts = opts || {};
  // showOverview가 구조도를 기본으로 펼치므로, 같은 키를 다시 토글하면 접혀 버린다 — 다를 때만 바꾼다
  if (v.type === "overview") { showOverview(); if (v.ovKey && v.ovKey !== ovKey) ovToggleList(v.ovKey, true); return; }
  if (v.type === "menu") renderMenu(v.id);
  else if (v.type === "group") renderGroup(v.id);
  else if (v.type === "inbox") renderInboxPage();
  else if (v.type === "changelog") renderChangelogPage();
  else if (v.type === "search") {
    const gs = document.getElementById("gsearch");
    if (gs.value.trim() !== v.q) gs.value = v.q; // 뒤로가기로 검색 결과에 돌아오면 입력칸도 맞춘다
    renderSearch(v.q);
  }
  focusTarget(opts.target, opts.hl);
}
/* 대상 카드·기능 행으로 스크롤하고 검색어를 강조(텍스트 노드 방식 highlightDetail) */
function focusTarget(target, hl) {
  const detail = document.getElementById("detail");
  const el = target ? document.getElementById(target) : null;
  const q = (hl || "").trim().toLowerCase();
  if (q) highlightDetail(el || detail, q);
  if (el) { el.classList.add("hit"); el.scrollIntoView({ block: "center" }); }
  else if (q) { const first = detail.querySelector("mark.hl"); if (first) first.scrollIntoView({ block: "center" }); }
}

/* 상단 이동경로 — "Application Specification Map › 주요 메뉴 › 🏠 홈  (보조 정보)".
   맨 앞 루트 이름을 누르면 뒤로가기(goBack)가 실행된다. 개요를 뺀 모든 본문(메뉴·분류·INBOX·CHANGELOG·검색)이
   이 형태를 공통으로 쓴다. */
function breadcrumbHtml(parts, current, extraHtml) {
  const rootLabel = PROJ.overviewTitle || (PROJ.icon + " Application Specification Map");
  const mid = (parts || []).map(p => '<span class="crumb">' + esc(p) + "</span>").join('<span class="crumb-sep">›</span>');
  return '<div class="crumbbar">' +
    '<span class="crumb crumb-root" id="crumbRoot" title="뒤로가기">' + esc(rootLabel) + "</span>" +
    (mid ? '<span class="crumb-sep">›</span>' + mid : "") +
    '<span class="crumb-sep">›</span>' +
    '<span class="crumb crumb-current">' + esc(current) + "</span>" +
    (extraHtml || "") +
  "</div>";
}
function bindBreadcrumb() {
  const root = document.getElementById("crumbRoot");
  if (root) root.addEventListener("click", goBack);
}
/* 본문 교체 공통 — innerHTML 뒤에 이동경로를 묶고 왼쪽 목록 선택 표시를 맞춘다 */
function setPage(html, view) {
  document.getElementById("detailPad").innerHTML = html;
  bindBreadcrumb();
  currentView = view;
  markNav();
  document.getElementById("detail").scrollTop = 0;
}

/* ═══════════════ 왼쪽 목록 — 📊 개요 / 주요 메뉴 / 기능 분류 / 기타(INBOX·변경 이력) ═══════════════ */
function navItemHtml(type, id, icon, name, count) {
  return '<div class="nav-item" data-type="' + type + '" data-id="' + esc(String(id || "")) + '">' +
    '<span class="ic">' + esc(icon || "") + '</span><span class="nm">' + esc(name || "") + "</span>" +
    (count != null ? '<span class="count">' + count + "</span>" : "") + "</div>";
}
function renderNav() {
  const nav = document.getElementById("nav");
  let html = navItemHtml("overview", "", "📊", "개요");
  if (MENU_LIST.length) {
    html += '<div class="nav-sep">── 주요 메뉴 ──</div>' +
      MENU_LIST.map(m => navItemHtml("menu", m.id, m.icon, m.name, menuFeatCount(m))).join("");
  }
  if (GROUP_LIST.length) {
    html += '<div class="nav-sep">── 기능 분류 ──</div>' +
      GROUP_LIST.map(g => navItemHtml("group", g.id, g.icon, g.name, (g.features || []).length)).join("");
  }
  html += '<div class="nav-sep">── 기타 ──</div>' +
    navItemHtml("inbox", "", "📥", "INBOX") + navItemHtml("changelog", "", "📜", "변경 이력");
  nav.innerHTML = html;
  nav.querySelectorAll(".nav-item").forEach(el => el.addEventListener("click", () => {
    const t = el.dataset.type;
    goTo(t === "menu" || t === "group" ? { type: t, id: el.dataset.id } : { type: t, ovKey: null });
  }));
}
function markNav() {
  const v = currentView || {};
  document.querySelectorAll("#nav .nav-item").forEach(el => {
    const on = el.dataset.type === v.type && (el.dataset.type === "menu" || el.dataset.type === "group" ? el.dataset.id === v.id : true);
    el.classList.toggle("selected", on);
    if (on) el.scrollIntoView({ block: "nearest" });
  });
}

/* ═══════════════ 본문 — 메뉴(화면 카드 목록)·기능 분류(카드 한 장)·INBOX·변경 이력 ═══════════════ */
function renderMenu(id) {
  const m = menuById[id];
  if (!m) return;
  const list = flatScreens(m.screens, 0);
  const featN = list.reduce((n, x) => n + (x.s.features || []).length, 0);
  setPage(
    breadcrumbHtml(["주요 메뉴"], ownerLabel("menu", id),
      '<span class="crumb">화면 ' + list.length + " · 기능 " + featN + "건</span>" + specDocLinkHtml()) +
    (m.desc ? '<div class="d-path">' + fmt(m.desc) + "</div>" : "") +
    '<p class="d-path">기능 상태: ' + esc(FEAT_STATUS_LEGEND) + "</p>" +
    (list.length ? list.map(x => screenCardHtml(x.s, x.depth)).join("") : '<p class="empty-files">이 메뉴에 등록된 화면이 없습니다.</p>'),
    { type: "menu", id });
}
function renderGroup(id) {
  const g = groupById[id];
  if (!g) return;
  setPage(
    breadcrumbHtml(["기능 분류"], ownerLabel("group", id), specDocLinkHtml()) +
    '<p class="d-path">기능 상태: ' + esc(FEAT_STATUS_LEGEND) + "</p>" +
    groupCardHtml(g),
    { type: "group", id });
}
function renderInboxPage() {
  setPage(breadcrumbHtml(["기타"], "📥 INBOX") + inboxCardHtml(), { type: "inbox" });
  bindInbox(); // innerHTML 삽입 뒤에야 행 렌더·이벤트 연결 가능
}
function renderChangelogPage() {
  setPage(breadcrumbHtml(["기타"], "📜 변경 이력") + changelogCardHtml(), { type: "changelog" });
  bindChangelog();
}
/* v1 데이터(MENUS 없음) — 안내만 띄운다 */
function showV1Notice() {
  document.getElementById("detailPad").innerHTML =
    '<div class="card"><h3>v2 형식으로 변환 필요</h3>' +
    "<p>이 프로젝트의 <code>docs/app-spec-map-data/spec-map-data.js</code>는 v1 형식(<code>SECTIONS</code>·<code>FEATURES</code>)입니다. " +
    "공유 뷰어 v2는 <code>MENUS</code>·<code>GROUPS</code> 형식만 읽습니다 — 데이터 파일을 v2 형식으로 변환하세요 " +
    "(형식 설명: <code>D:\\Projects\\_shared\\spec-map\\README.md</code>).</p></div>";
  currentView = null;
}

/* ── 개요(초기 화면) ──
   상태는 기능 행 단위로만 완료·개발중·개발전·보류 4구간으로 집계한다(화면·메뉴 자체는 상태를 관리하지 않는다). */
function showOverview() {
  if (!IS_V2) { showV1Notice(); return; }
  const screenCount = Object.keys(screenIndex).length;
  const featCount = featIndex.length;
  const featCounts = { done:0, wip:0, plan:0, hold:0 };
  for (const e of featIndex) featCounts[featBucket(e.f[3])]++;
  const donePct = featCount ? Math.round(featCounts.done / featCount * 100) : 0; // 소숫점 없이(반올림)
  const issueCount = issueEntries().length;

  // 프로젝트 고유 블록: overviewTop(현황 위) / overviewCards(현황 아래) — 문자열 또는 HTML 반환 함수
  const top = typeof PROJ.overviewTop === "function" ? PROJ.overviewTop() : (PROJ.overviewTop || "");
  const cards = PROJ.overviewCards.map(c =>
    typeof c === "function" ? c()
      : '<div class="card"><h3>' + c.title + "</h3>" + c.html + "</div>").join("");

  const listRows =
    MENU_LIST.map(m => '<tr class="rowlink" data-type="menu" data-id="' + esc(String(m.id)) + '"><td>주요 메뉴</td><td>' + esc(ownerLabel("menu", m.id)) +
      "</td><td>" + esc(m.desc || "") + "</td><td class='st'>" + flatScreens(m.screens, 0).length + "</td><td class='st'>" + menuFeatCount(m) + "</td></tr>").join("") +
    GROUP_LIST.map(g => '<tr class="rowlink" data-type="group" data-id="' + esc(String(g.id)) + '"><td>기능 분류</td><td>' + esc(ownerLabel("group", g.id)) +
      "</td><td>" + esc(g.desc || "") + "</td><td class='st'>—</td><td class='st'>" + (g.features || []).length + "</td></tr>").join("");

  setPage(
    '<div class="ov">' +
    '<div class="d-head"><h2>' + (PROJ.overviewTitle || PROJ.icon + " Application Specification Map") + "</h2></div>" +
    '<div class="d-path">' + (PROJ.tagline || "왼쪽 주요 메뉴·기능 분류를 고르면 화면 카드와 기능표가 나옵니다.") + "</div>" +
    top +

    '<div class="card"><h3>현황 <span class="src" style="font-weight:400">카드를 클릭하면 아래에 목록이 표시됩니다</span></h3><div class="stats">' +
      '<div class="stat c-orange" data-key="mindmap"><div class="n">🗺️</div><div class="l">구조도</div></div>' +
      '<div class="stat c-orange" data-key="all"><div class="n">' + screenCount + "/" + featCount + '</div><div class="l">' + esc(PROJ.unitLabel) + "/기능</div></div>" +
      STATUS_ORDER.map(key =>
        '<div class="stat" data-key="' + key + '"><div class="n">' + featCounts[key] + '</div><div class="l">' + esc(STATUS_TEXT[key]) + "</div></div>").join("") +
      '<div class="stat c-gold" data-key="feat"><div class="n">' + donePct + '%</div><div class="l">진행율 (완료 ' + featCounts.done + "/" + featCount + ")</div></div>" +
      (issueCount ? '<div class="stat" data-key="issues"><div class="n">' + issueCount + '</div><div class="l">⚠️ 이슈</div></div>' : "") +
    '</div><div id="ovList"></div></div>' +

    '<div class="card" id="ovMenus"><h3>주요 메뉴 · 기능 분류 <span class="src" style="font-weight:400">행을 클릭하면 화면 카드 목록으로 이동합니다</span></h3>' +
      '<div class="tblwrap"><table class="spec"><tr><th>구분</th><th>이름</th><th>설명</th><th>화면</th><th>기능</th></tr>' + listRows + "</table></div></div>" +

    cards +
    "</div>",
    { type: "overview", ovKey: null });

  ovKey = null;
  document.querySelectorAll("#detail .stat[data-key]").forEach(el =>
    el.addEventListener("click", () => ovToggleList(el.dataset.key)));
  document.querySelectorAll("#ovMenus tr.rowlink").forEach(tr =>
    tr.addEventListener("click", () => goTo({ type: tr.dataset.type, id: tr.dataset.id })));
  ovToggleList("mindmap", true); // 첫 화면: 구조도를 펼쳐 둔다(첫 화면이 아래로 밀리지 않게 스크롤은 하지 않음)
}

/* ── 구조도(마인드맵) — 프로젝트 → 주요 메뉴(→ 화면, 하위 화면은 들여쓰기) / 기능 분류.
   루트→메뉴는 가로 한 줄(폭 초과 시 줄바꿈), 그 아래는 세로 들여쓰기 트리 — 가로 스크롤 없음.
   화면·메뉴는 상태를 관리하지 않으므로 상태 칩은 두지 않는다. 노드를 누르면 goTo로 이동(뒤로가기 스택 유지). */
function mmLinkAttrs(type, id, target) {
  return ' data-type="' + type + '" data-id="' + esc(String(id)) + '"' + (target ? ' data-target="' + esc(target) + '"' : "");
}
function mmScreenChipHtml(menu, s) {
  const route = s.route && s.route !== "—" ? s.route : "";
  return '<span class="mm-node link"' + mmLinkAttrs("menu", menu.id, "card-" + s.id) +
    ' title="' + esc(String(s.id) + " " + (s.name || "") + (route ? " · " + route : "")) + '">' +
    "<span>" + esc(s.name || "") + "</span>" +
    (route ? '<span class="rt">' + esc(route) + "</span>" : "") + "</span>";
}
function mmScreensHtml(menu, list, depth) {
  const cls = depth === 2 ? "t d2" : depth === 3 ? "t d3" : "t"; // 연결선 굵기 3px→2px→1px
  return '<ul class="' + cls + '">' + list.map(s =>
    "<li>" + mmScreenChipHtml(menu, s) + (s.children && s.children.length ? mmScreensHtml(menu, s.children, depth + 1) : "") + "</li>").join("") + "</ul>";
}
function mindmapHtml() {
  const menus = MENU_LIST.map(m =>
    '<li><span class="mm-node sec link"' + mmLinkAttrs("menu", m.id) + "><span>" + esc(ownerLabel("menu", m.id)) +
      ' <span class="cnt">' + menuFeatCount(m) + "</span></span></span>" +
      (m.screens && m.screens.length ? mmScreensHtml(m, m.screens, 2) : "") + "</li>").join("");
  const groups = GROUP_LIST.length
    ? '<li><span class="mm-node sec">기능 분류</span><ul class="t d2">' + GROUP_LIST.map(g =>
        '<li><span class="mm-node link"' + mmLinkAttrs("group", g.id) + "><span>" + esc(ownerLabel("group", g.id)) +
          ' <span class="cnt">' + (g.features || []).length + "</span></span></span></li>").join("") + "</ul></li>"
    : "";
  return '<div class="hint">구조도 — 주요 메뉴는 가로로 펼치고 화면은 아래로 내려갑니다(숫자 = 기능 수). 노드를 클릭하면 해당 메뉴·화면 카드·분류로 이동합니다.</div>' +
    '<div class="mm"><div class="mm-tree"><span class="mm-node root">' + esc((PROJ.icon ? PROJ.icon + " " : "") + (PROJ.name || "")) +
    '</span><ul class="secs">' + menus + groups + "</ul></div></div>";
}

/* 미해결 이슈 전체 — 화면(children 포함)·기능 분류의 issues */
function issueEntries() {
  const out = [];
  for (const m of MENU_LIST) for (const x of flatScreens(m.screens, 0))
    for (const t of x.s.issues || []) out.push({ type: "menu", id: m.id, target: "card-" + x.s.id, where: ownerLabel("menu", m.id) + " › " + (x.s.name || ""), text: t });
  for (const g of GROUP_LIST)
    for (const t of g.issues || []) out.push({ type: "group", id: g.id, target: "card-g-" + g.id, where: ownerLabel("group", g.id), text: t });
  return out;
}

/* ── 개요 현황 숫자 클릭 → 하단 목록 표시 (행 클릭 시 해당 메뉴·분류를 열고 그 카드·기능 행으로 이동) ── */
let ovKey = null;
const FEAT_LIST_HEADER = "<tr><th>ID</th><th>기능명</th><th>위치</th><th>설명</th><th>상태</th><th>단계</th><th>라우트</th></tr>";
function featListHtml(filterBucket) {
  const rows = featIndex.filter(e => !filterBucket || featBucket(e.f[3]) === filterBucket).map(e =>
    '<tr class="rowlink" data-type="' + e.type + '" data-id="' + esc(String(e.ownerId)) + '" data-target="feat-' + esc(String(e.f[0] || "")) + '">' +
    '<td class="no">' + esc(String(e.f[0] || "")) + "</td><td>" + esc(e.f[1] || "") + "</td><td>" + esc(featWhere(e)) + "</td>" +
    "<td>" + esc(e.f[2] || "") + '</td><td class="st" title="' + esc(FEAT_STATUS_LEGEND) + '">' + esc(featStatusText(e.f[3])) + "</td>" +
    '<td class="st">' + esc(e.f[4] || "") + '</td><td class="no">' + esc(e.f[5] || "—") + "</td></tr>");
  return { html: rows.join(""), n: rows.length };
}
function ovToggleList(key, noScroll) {
  const box = document.getElementById("ovList");
  if (!box) return;
  document.querySelectorAll("#detail .stat.active").forEach(el => el.classList.remove("active"));
  if (ovKey === key) { ovKey = null; box.innerHTML = ""; currentView = { type: "overview", ovKey: null }; return; }  // 같은 카드 재클릭 → 접기
  ovKey = key;
  const card = document.querySelector('#detail .stat[data-key="' + key + '"]');
  if (card) card.classList.add("active");

  let html = "";
  if (key === "mindmap") {
    html = mindmapHtml();
  } else if (key === "issues") {
    const rows = issueEntries().map(e =>
      '<tr class="rowlink" data-type="' + e.type + '" data-id="' + esc(String(e.id)) + '" data-target="' + esc(e.target) + '">' +
      "<td>" + esc(e.where) + "</td><td>" + fmt(e.text) + "</td></tr>");
    html = '<div class="hint">⚠️ 이슈 전체 ' + rows.length + "건 — 행을 클릭하면 해당 화면 카드로 이동합니다.</div>" +
      '<div class="tblwrap"><table class="spec"><tr><th>위치</th><th>이슈</th></tr>' + rows.join("") + "</table></div>";
  } else {
    // all·feat(진행율) = 전체, 그 밖(완료·개발중·개발전·보류) = 그 상태의 기능만
    const bucket = key === "all" || key === "feat" ? null : key;
    const list = featListHtml(bucket);
    const title = bucket ? esc(STATUS_TEXT[bucket]) + " 기능 " + list.n + "건" : "기능 전체 " + list.n + "건";
    html = '<div class="hint">' + title + " — 행을 클릭하면 해당 메뉴·분류의 기능 행으로 이동합니다.</div>" +
      '<div class="tblwrap"><table class="spec">' + FEAT_LIST_HEADER + list.html + "</table></div>";
  }
  box.innerHTML = html;
  box.querySelectorAll("tr.rowlink, .mm-node[data-type]").forEach(el =>
    el.addEventListener("click", () => goTo({ type: el.dataset.type, id: el.dataset.id }, { target: el.dataset.target })));
  currentView = { type: "overview", ovKey: key };
  if (!noScroll) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ═══════════════ 전체 검색 — 결과는 본문에 표시 ═══════════════
   대상: 메뉴명·화면명·라우트·기능ID·기능명·설명·이슈. 결과를 누르면 해당 메뉴/분류를 열고
   그 카드(기능이면 그 행)로 스크롤해 검색어를 강조한다. */
function snippetOf(raw, q) {
  const txt = String(raw || "").replace(/[`*]/g, "");
  const i = txt.toLowerCase().indexOf(q);
  if (i < 0) return "";
  const s = Math.max(0, i - 18), e = Math.min(txt.length, i + q.length + 40);
  return (s > 0 ? "…" : "") + txt.slice(s, e) + (e < txt.length ? "…" : "");
}
function resRowHtml(h) {
  return '<div class="res-row" data-type="' + h.type + '" data-go="' + esc(String(h.id || "")) + '" data-target="' + esc(h.target || "") + '"><div class="top">' +
    '<span class="nm">' + (h.nid ? '<span class="nid">' + esc(h.nid) + "</span>" : "") + esc(h.name) + "</span>" +
    (h.rt ? '<span class="rt">' + esc(h.rt) + "</span>" : "") + "</div>" +
    (h.snip ? '<div class="snip" title="' + esc(h.snip) + '">' + esc(h.snip) + "</div>" : "") + "</div>";
}
function renderSearch(raw) {
  const q = raw.trim().toLowerCase();
  const owners = [], screens = [], feats = [], issues = [];
  for (const m of MENU_LIST) {
    if (((m.name || "") + " " + (m.desc || "")).toLowerCase().includes(q))
      owners.push({ type: "menu", id: m.id, name: ownerLabel("menu", m.id), rt: "주요 메뉴", snip: snippetOf(m.desc, q) });
  }
  for (const g of GROUP_LIST) {
    if (((g.name || "") + " " + (g.desc || "")).toLowerCase().includes(q))
      owners.push({ type: "group", id: g.id, name: ownerLabel("group", g.id), rt: "기능 분류", snip: snippetOf(g.desc, q) });
  }
  for (const sid in screenIndex) {
    const { s, menu } = screenIndex[sid];
    if ((s.id + " " + (s.name || "") + " " + (s.route || "") + " " + (s.desc || "")).toLowerCase().includes(q))
      screens.push({ type: "menu", id: menu.id, target: "card-" + s.id, nid: String(s.id), name: s.name || "",
        rt: (s.route && s.route !== "—" ? s.route + " · " : "") + ownerLabel("menu", menu.id), snip: snippetOf(s.desc, q) });
  }
  for (const e of featIndex) {
    const f = e.f;
    if ((f[0] + " " + (f[1] || "") + " " + (f[2] || "") + " " + (f[5] || "")).toLowerCase().includes(q))
      feats.push({ type: e.type, id: e.ownerId, target: "feat-" + f[0], nid: String(f[0] || ""),
        name: (f[1] || "") + " (" + featStatusText(f[3]) + ")", rt: "→ " + featWhere(e), snip: f[2] || "" });
  }
  for (const e of issueEntries()) {
    if (String(e.text).toLowerCase().includes(q))
      issues.push({ type: e.type, id: e.id, target: e.target, name: e.where, snip: snippetOf(e.text, q) });
  }
  const sec = (title, list) => list.length
    ? '<div class="card"><h3>' + title + ' <span style="font-weight:400">(' + list.length + "건)</span></h3>" + list.map(resRowHtml).join("") + "</div>" : "";
  const total = owners.length + screens.length + feats.length + issues.length;
  setPage(
    breadcrumbHtml(["검색"], "“" + raw.trim() + "”",
      '<span class="crumb">메뉴·분류 ' + owners.length + " · 화면 " + screens.length + " · 기능 " + feats.length + " · 이슈 " + issues.length + "건</span>") +
    (total ? sec("주요 메뉴 · 기능 분류", owners) + sec("화면", screens) + sec("기능", feats) + sec("⚠️ 이슈", issues)
           : '<p class="empty-files">검색 결과가 없습니다.</p>'),
    { type: "search", q: raw.trim() });
  highlightDetail(document.getElementById("detailPad"), q);
  document.querySelectorAll("#detailPad .res-row").forEach(el => el.addEventListener("click", () => {
    if (!el.dataset.go) return;
    goTo({ type: el.dataset.type, id: el.dataset.go }, { target: el.dataset.target, hl: q });
  }));
}

/* ── 사이드바 크기 조절(드래그)·숨김(손잡이 클릭) ── */
(function () {
  const layout = document.querySelector(".layout");
  const sidebar = document.getElementById("sidebar");
  const resizer = document.getElementById("resizer");
  const knob = document.getElementById("sidebarKnob");

  knob.addEventListener("click", e => {
    e.stopPropagation();
    const hidden = layout.classList.toggle("nav-hidden");
    knob.textContent = hidden ? "▶" : "◀";
    knob.title = hidden ? "메뉴 목록 펼치기" : "메뉴 목록 숨기기";
  });
  knob.addEventListener("pointerdown", e => e.stopPropagation()); // 손잡이 클릭이 드래그로 새지 않게

  resizer.addEventListener("pointerdown", e => {
    if (layout.classList.contains("nav-hidden")) return;
    e.preventDefault();
    const startX = e.clientX, startW = sidebar.getBoundingClientRect().width;
    resizer.classList.add("dragging");
    resizer.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    const move = ev => {
      const max = Math.max(280, window.innerWidth * 0.6);
      sidebar.style.width = Math.min(Math.max(startW + ev.clientX - startX, 180), max) + "px";
    };
    const up = () => {
      resizer.classList.remove("dragging");
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      resizer.removeEventListener("pointermove", move);
      resizer.removeEventListener("pointerup", up);
    };
    resizer.addEventListener("pointermove", move);
    resizer.addEventListener("pointerup", up);
  });
  resizer.addEventListener("dblclick", () => { sidebar.style.width = "300px"; }); // 더블클릭 = 기본 폭 복원
})();

/* ── 전체 검색 입력(헤더) — 결과는 본문에 표시. 검색 화면에 처음 들어갈 때만 직전 화면을 뒤로가기 스택에 쌓고,
   글자를 더 칠 때는 결과만 다시 그린다. 검색어를 지우면 검색 전 화면으로 돌아간다. ── */
function onSearchInput(raw) {
  if (!IS_V2) return;
  const q = (raw || "").trim();
  if (!q) { if (currentView && currentView.type === "search") goBack(); return; }
  if (!currentView || currentView.type !== "search") {
    const snap = snapshotCurrentView();
    if (snap) viewStack.push(snap);
  }
  renderSearch(q);
}
document.getElementById("gsearch").addEventListener("input", e => onSearchInput(e.target.value));
document.getElementById("gsClear").addEventListener("click", () => {
  document.getElementById("gsearch").value = "";
  onSearchInput("");
});

/* ── 토스트 ── */
let toastTimer = null;
function toast(msg, ms) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms || 5000);
}

/* ── 헤더: 프로젝트 제목·최종 갱신·서비스 버튼 (PROJECT 설정 기반) ── */
(function () {
  document.title = PROJ.title;
  const h1 = document.getElementById("projTitle");
  h1.textContent = PROJ.title;
  h1.style.cursor = "pointer";
  h1.title = "개요로 돌아가기";
  h1.addEventListener("click", showOverview);

  // 최종 갱신 — PROJECT.updated 맨 앞의 YYYY-MM-DD (누적 이력은 두지 않는다 — 이력은 git 로그)
  const updMatch = String(PROJ.updated || "").trim().match(/^\d{4}-\d{2}-\d{2}/);
  document.getElementById("metaUpdated").textContent = updMatch ? "최종 갱신: " + updMatch[0] : "";

  if (PROJ.css) { // 프로젝트 고유 스타일(개요 알림 블록 등) 주입
    const st = document.createElement("style");
    st.textContent = PROJ.css;
    document.head.appendChild(st);
  }

  // 브라우저는 .bat을 직접 실행할 수 없어 커스텀 프로토콜로 위임 —
  // specmap-run:<프로젝트명>/<run|stop> → D:\Projects\_shared\spec-map\run-dispatch.bat →
  // d:\Projects\<프로젝트명>\app_run.bat / app_stop.bat (최초 1회 docs/app-spec-map-data/spec-map-service-protocol.reg 등록 필요)
  const REG_HINT = "콘솔 창이 아예 뜨지 않으면 docs/app-spec-map-data/spec-map-service-protocol.reg 를 먼저 더블클릭해 등록하세요.";
  const btnRun = document.getElementById("btnRun");
  const runProto = PROJ.runProtocol || (PROJ.service ? "specmap-run:" + PROJ.name + "/run" : "");
  if (runProto) {
    btnRun.title = PROJ.runTitle || "프로젝트 루트의 app_run.bat 실행 (최초 1회 docs/app-spec-map-data/spec-map-service-protocol.reg 등록 필요)";
    btnRun.addEventListener("click", () => {
      location.href = runProto;
      toast(PROJ.runToast || ("서비스 시작 요청 — 빌드/기동까지 시간이 걸릴 수 있습니다. " + REG_HINT), 8000);
    });
  } else btnRun.style.display = "none";

  const btnStop = document.getElementById("btnStop");
  const stopProto = PROJ.stopProtocol || (PROJ.service ? "specmap-run:" + PROJ.name + "/stop" : "");
  if (stopProto) {
    btnStop.title = PROJ.stopTitle || "프로젝트 루트의 app_stop.bat 실행 — 서비스 종료";
    btnStop.addEventListener("click", () => {
      location.href = stopProto;
      toast(PROJ.stopToast || ("서비스 종료 요청. " + REG_HINT), 6000);
    });
  } else btnStop.style.display = "none";

  const btnWeb = document.getElementById("btnWeb");
  if (PROJ.webUrl) {
    btnWeb.title = PROJ.webTitle || ("새 브라우저 창으로 " + PROJ.webUrl + " 열기");
    btnWeb.addEventListener("click", async (evt) => {
      // 열기 전에 서비스 생존 확인 (file:// 에서도 localhost no-cors probe는 동작함)
      try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 2500);
        await fetch(PROJ.webUrl, { mode: "no-cors", cache: "no-store", signal: ctl.signal });
        clearTimeout(timer);
        if (PROJ.webPopup === false) { // 모바일 앱이 아닌 프로젝트(API 문서 등)는 일반 새 탭으로
          window.open(PROJ.webUrl, "_blank");
          toast("웹뷰 열기", 3000);
          return;
        }
        // 갤럭시 S23 울트라 브라우저 뷰포트 크기(412×915)로 고정한 새 창 — 북마크바 없는 팝업 스타일로 열림
        // 클릭 지점의 절대 화면 좌표(screenX/Y, 다중 모니터 오프셋 포함)를 기준으로 배치 → 클릭한 모니터에 뜸
        const vw = 412, vh = 915;
        const left = Math.round(evt.screenX - vw / 2);
        const top = Math.round(evt.screenY - vh / 2);
        const win = window.open(
          PROJ.webUrl, "_blank",
          `popup=yes,width=${vw},height=${vh},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=no,noopener`
        );
        if (win) {
          // 주소창 등 브라우저 자체 UI만큼 창을 보정해 실제 뷰포트가 목표 크기(412×915)와 일치하도록 함
          setTimeout(() => {
            const dw = vw - win.innerWidth;
            const dh = vh - win.innerHeight;
            if (dw || dh) win.resizeBy(dw, dh);
          }, 200);
        }
        toast("웹뷰 열기 — 앱 로딩까지 수 초 걸릴 수 있습니다.", 4000);
      } catch {
        toast("서비스에 연결할 수 없습니다 — \"▶ 서비스 시작\"을 먼저 누르고, 콘솔 창의 빌드가 끝난 뒤 다시 시도하세요. 콘솔 창을 닫으면 서비스가 종료됩니다.", 8000);
      }
    });
  } else btnWeb.style.display = "none";

  // 사이트 관리자(/admin 등 운영자 전용 웹) — 웹뷰 실행과 달리 모바일 뷰포트
  // 팝업이 아니라 일반 새 탭으로 연다(관리자 화면은 데스크톱 폭 UI가 기본).
  const btnAdmin = document.getElementById("btnAdmin");
  if (PROJ.adminUrl) {
    btnAdmin.title = PROJ.adminTitle || ("새 탭으로 " + PROJ.adminUrl + " 열기");
    btnAdmin.addEventListener("click", async () => {
      try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 2500);
        await fetch(PROJ.webUrl || PROJ.adminUrl, { mode: "no-cors", cache: "no-store", signal: ctl.signal });
        clearTimeout(timer);
        window.open(PROJ.adminUrl, "_blank");
        toast("관리자 페이지 열기", 3000);
      } catch {
        toast("서비스에 연결할 수 없습니다 — \"▶ 서비스 시작\"을 먼저 누르고, 콘솔 창의 빌드가 끝난 뒤 다시 시도하세요. 콘솔 창을 닫으면 서비스가 종료됩니다.", 8000);
      }
    });
  } else btnAdmin.style.display = "none";
  if (PROJ.erdUrl) document.getElementById("btnErd").href = PROJ.erdUrl;

  // "실행" 드롭다운 토글 — 바깥 클릭/Esc/항목 클릭 시 닫힘
  const runMenuBtn = document.getElementById("runMenuBtn");
  const runMenuPanel = document.getElementById("runMenuPanel");
  if (runMenuBtn && runMenuPanel) {
    runMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = runMenuPanel.hasAttribute("hidden");
      if (willOpen) runMenuPanel.removeAttribute("hidden");
      else runMenuPanel.setAttribute("hidden", "");
      runMenuBtn.setAttribute("aria-expanded", String(willOpen));
    });
    document.addEventListener("click", (e) => {
      const clickedItem = e.target.closest(".menu-item");
      const clickedOutside = !runMenuPanel.contains(e.target) && e.target !== runMenuBtn;
      if (clickedItem || clickedOutside) {
        runMenuPanel.setAttribute("hidden", "");
        runMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !runMenuPanel.hasAttribute("hidden")) {
        runMenuPanel.setAttribute("hidden", "");
        runMenuBtn.setAttribute("aria-expanded", "false");
        runMenuBtn.focus();
      }
    });
  }
})();

/* ── 프로젝트 전환 드롭다운 — 목록은 sync.bat이 생성하는 spec-map-projects.js ── */
(function () {
  const sel = document.getElementById("projSelect");
  const projects = typeof SPEC_MAP_PROJECTS !== "undefined" ? SPEC_MAP_PROJECTS : [];
  if (!projects.length) { sel.style.display = "none"; return; }
  for (const p of projects) {
    const o = document.createElement("option");
    o.value = p.path;
    o.textContent = p.name;
    if (p.name === PROJ.name) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener("change", () => {
    const url = "file:///" + sel.value.replace(/\\/g, "/");
    window.open(url, "_blank");
    // 현재 창은 그대로 유지되므로 드롭다운 선택을 현재 프로젝트로 되돌린다
    for (const o of sel.options) o.selected = o.textContent === PROJ.name;
  });
})();

/* ═══════════════ 목록 정렬(다중 컬럼) — 전 프로젝트 공통 ═══════════════
   table.spec(입력칸이 들어있는 INBOX·변경 이력 편집 표는 제외)에 자동으로 적용된다.
   헤더 클릭 1회 오름차순(▲) · 2회 내림차순(▼) · 3회 해제(원래 순서로 복원).
   다른 컬럼이 이미 정렬 중일 때 새 컬럼을 클릭하면 다음 우선순위로 추가되고,
   2개 이상 정렬 중일 때만 각 헤더 위에 1·2·3 순번을 표시한다. */
/* 자연 정렬(natural sort) — 문자열을 숫자·비숫자 구간으로 쪼개 숫자 구간은 값으로,
   나머지는 한글 로캘로 비교한다. "1.3"과 "1.3.1"(ID), "Phase 0"과 "Phase 11"(단계),
   "D1"~"D5", "문서"·"원칙"·"미정" 처럼 자릿수·형식이 제각각인 값도 데이터를 고치지 않고
   기대한 순서(ID 오름차순 → 상위 항목 먼저, Phase 0 → Phase 2 → … → Phase 11 → Phase 12)로
   정렬되게 한다(2026-09-16, 고정폭 ID·단계 표기로 데이터를 바꾸는 대신 비교 로직으로 해결). */
function naturalCompare(a, b) {
  const tokenRe = /(\d+)|(\D+)/g;
  const ta = a.match(tokenRe) || [], tb = b.match(tokenRe) || [];
  const len = Math.max(ta.length, tb.length);
  for (let i = 0; i < len; i++) {
    const xa = ta[i], xb = tb[i];
    if (xa === undefined) return -1; // a가 더 짧다 = 상위 항목("1.3" vs "1.3.1") → 먼저 오게
    if (xb === undefined) return 1;
    const numA = /^\d+$/.test(xa), numB = /^\d+$/.test(xb);
    if (numA && numB) {
      const diff = parseInt(xa, 10) - parseInt(xb, 10);
      if (diff !== 0) return diff;
      if (xa.length !== xb.length) return xa.length - xb.length; // "01" vs "1"처럼 값이 같으면 자릿수로
    } else {
      const cmp = xa.localeCompare(xb, "ko");
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}
function enableSortableTable(table) {
  if (!table || table.dataset.sortEnabled === "1") return;
  /* table.rows는 <thead>/<tbody> 유무와 상관없이(브라우저가 <tr>을 암묵적으로 <tbody>에
     감싸 넣어도) 표의 모든 행을 문서 순서대로 담는 라이브 컬렉션이라 구조 걱정 없이 쓸 수 있다.
     이전에 ":scope > tr"로만 찾았을 때 암묵적 tbody 때문에 헤더 행을 못 찾아 정렬이 아예
     붙지 않는 버그가 있었다(2026-09-16 수정). */
  const rows = table.rows;
  if (!rows || rows.length < 3) return; // 헤더 + 데이터 2행 미만이면 정렬할 필요가 없다
  const headerRow = rows[0];
  const bodyParent = rows[1].parentNode; // 실제 <tr>들이 담긴 곳(암묵적/명시적 tbody 등) — 재배치 대상
  const originalOrder = Array.from(rows).slice(1);
  table.dataset.sortEnabled = "1";

  const ths = Array.from(headerRow.children);
  let sortState = []; // [{ colIndex, dir:"asc"|"desc" }] — 배열 순서 = 정렬 우선순위

  function cellValue(tr, idx) {
    const td = tr.children[idx];
    return td ? td.textContent.trim() : "";
  }
  /* "-"·"—"(값 없음)는 오름차순·내림차순 어느 쪽이든 항상 맨 뒤 — dir을 뒤집지 않는다.
     정렬을 해제하면(originalOrder) 이 규칙과 무관하게 원래 순서로 돌아간다. */
  function isEmptyCell(v) { return v === "" || v === "-" || v === "—"; }
  function compareRows(a, b) {
    for (const s of sortState) {
      const va = cellValue(a, s.colIndex), vb = cellValue(b, s.colIndex);
      const ea = isEmptyCell(va), eb = isEmptyCell(vb);
      if (ea && eb) continue;
      if (ea) return 1;
      if (eb) return -1;
      const cmp = naturalCompare(va, vb);
      if (cmp !== 0) return s.dir === "asc" ? cmp : -cmp;
    }
    return 0;
  }
  function paint() {
    const list = sortState.length ? Array.from(rows).slice(1).sort(compareRows) : originalOrder;
    for (const tr of list) bodyParent.appendChild(tr);
    ths.forEach((th, i) => {
      const oldIco = th.querySelector(".sort-ico"); if (oldIco) oldIco.remove();
      const oldRank = th.querySelector(".sort-rank"); if (oldRank) oldRank.remove();
      const s = sortState.find(x => x.colIndex === i);
      th.classList.toggle("sorted", !!s);
      if (s) {
        const rank = sortState.length > 1 ? '<span class="sort-rank">' + (sortState.indexOf(s) + 1) + "</span>" : "";
        th.insertAdjacentHTML("beforeend", rank + '<span class="sort-ico">' + (s.dir === "asc" ? "▲" : "▼") + "</span>");
      }
    });
  }
  ths.forEach((th, i) => {
    th.classList.add("sortable-th");
    th.addEventListener("click", () => {
      const existing = sortState.find(s => s.colIndex === i);
      if (!existing) sortState.push({ colIndex: i, dir: "asc" });
      else if (existing.dir === "asc") existing.dir = "desc";
      else sortState = sortState.filter(s => s.colIndex !== i);
      paint();
    });
  });
}
/* #detail 안에 새 목록 표가 그려질 때마다 자동으로 정렬 기능을 붙인다 */
(function () {
  const detail = document.getElementById("detail");
  function scan() {
    if (detail) detail.querySelectorAll("table.spec:not(.inbox)").forEach(enableSortableTable);
  }
  const mo = new MutationObserver(scan);
  if (detail) mo.observe(detail, { childList: true, subtree: true });
})();

/* ── 초기화 ── */
if (IS_V2) renderNav();
showOverview(); // v1 데이터면 변환 안내만
