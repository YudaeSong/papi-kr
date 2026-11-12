/**
 * App Spec Map 웹 열람 — 잠금 → API에서 데이터 조회 → 원본 v2 뷰어(spec-map-viewer.js, 수정 없음) 실행 → 웹 어댑터.
 * 뷰어는 PROJECT·MENUS 등 전역이 먼저 있다고 가정하므로, 데이터를 window에 넣은 뒤 뷰어 스크립트를 삽입한다.
 */
(function () {
  'use strict';
  var API = window.SPEC_MAP_API;
  var TOKEN_KEY = 'specmap-token';
  var KEYS = ['PROJECT', 'SPEC_DOC_URL', 'PLAT_LEGEND', 'FEAT_LEGEND', 'MENUS', 'GROUPS', 'INBOX', 'CHANGELOG'];

  var lock = document.getElementById('smLock');
  var form = document.getElementById('smLockForm');
  var pw = document.getElementById('smPw');
  var btn = document.getElementById('smBtn');
  var msg = document.getElementById('smLockMsg');

  function getToken() {
    try {
      var t = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || 'null');
      if (t && t.token && Date.parse(t.expiresAt) > Date.now()) return t.token;
    } catch (e) { /* 저장소 사용 불가 */ }
    return null;
  }
  function setToken(t) { try { sessionStorage.setItem(TOKEN_KEY, JSON.stringify(t)); } catch (e) { /* 무시 */ } }
  function clearToken() { try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) { /* 무시 */ } }

  function showLock(text, info) {
    lock.hidden = false;
    msg.textContent = text || '';
    msg.className = info ? 'info' : '';
    btn.disabled = false;
    pw.value = '';
    pw.focus();
  }

  function httpError(status) { var e = new Error('HTTP ' + status); e.status = status; return e; }

  function apiGet(path, token) {
    return fetch(API + path, { headers: { Authorization: 'Bearer ' + token } }).then(function (r) {
      if (r.status === 401) { clearToken(); throw httpError(401); }
      if (!r.ok) throw httpError(r.status);
      return r.json();
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('뷰어를 불러오지 못했습니다')); };
      document.body.appendChild(s);
    });
  }

  function fatal(text) {
    lock.hidden = false;
    form.innerHTML = '<h1>App Spec Map</h1><p id="smLockMsg"></p>';
    form.querySelector('#smLockMsg').textContent = text;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!pw.value) return;
    btn.disabled = true;
    msg.className = 'info';
    msg.textContent = '확인 중…';
    fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw.value })
    }).then(function (r) {
      if (r.status === 200) return r.json().then(function (t) { setToken(t); start(); });
      if (r.status === 429) return showLock('시도가 너무 많습니다. 15분 뒤 다시 시도하세요.');
      if (r.status === 401) return showLock('암호가 일치하지 않습니다.');
      showLock('로그인 실패 (' + r.status + ')');
    }).catch(function () {
      showLock('데이터 서버에 연결할 수 없습니다. 잠시 뒤 다시 시도하세요.');
    });
  });

  function start() {
    var token = getToken();
    if (!token) { showLock(); return; }
    var projects, cur;
    apiGet('/projects', token).then(function (res) {
      projects = res.projects || [];
      if (!projects.length) throw new Error('등록된 프로젝트가 없습니다.');
      var q = (new URLSearchParams(location.search).get('p') || '').toLowerCase();
      cur = projects.filter(function (p) { return p.slug === q; })[0];
      if (!cur) {
        cur = projects.filter(function (p) { return p.slug === 'insearch'; })[0] || projects[0];
        history.replaceState(null, '', '?p=' + encodeURIComponent(cur.slug));
      }
      return apiGet('/projects/' + encodeURIComponent(cur.slug), token);
    }).then(function (snap) {
      var P = snap.payload || {};
      KEYS.forEach(function (k) { if (P[k] !== undefined) window[k] = P[k]; });
      // 뷰어의 프로젝트 전환 목록 — path에 slug를 넣고, 전환 동작은 어댑터가 바꾼다
      window.SPEC_MAP_PROJECTS = projects.map(function (p) { return { name: p.name, path: p.slug }; });
      lock.hidden = true;
      return loadScript('spec-map-viewer.js').then(function () { adapt(projects, cur, snap); });
    }).catch(function (e) {
      if (e && e.status === 401) { showLock('로그인이 만료되었습니다. 다시 입력해 주세요.', true); return; }
      fatal(e && e.status ? '데이터를 불러오지 못했습니다 (' + e.status + ').' :
        (e && e.message && e.message.indexOf('등록된') === 0 ? e.message : '데이터 서버에 연결할 수 없습니다. 잠시 뒤 새로고침하세요.'));
    });
  }

  /* ── 웹 어댑터: 원본 뷰어를 고치지 않고 웹에서 다른 부분만 바꾼다 ── */
  function adapt(projects, cur, snap) {
    // 1) 프로젝트 전환: file:/// 열기 → ?p=<slug> 이동 (요소를 복제해 원본 리스너 제거)
    var sel = document.getElementById('projSelect');
    if (sel) {
      var neu = sel.cloneNode(true);
      sel.parentNode.replaceChild(neu, sel);
      neu.style.display = projects.length > 1 ? '' : 'none';
      neu.title = '프로젝트 전환';
      for (var i = 0; i < neu.options.length; i++) neu.options[i].selected = neu.options[i].value === cur.slug;
      neu.addEventListener('change', function () { location.search = '?p=' + encodeURIComponent(neu.value); });
    }

    // 2) 동기화 정보 + 잠금 버튼
    var meta = document.getElementById('metaUpdated');
    if (meta && snap.syncedAt) {
      var st = document.createElement('span');
      st.id = 'smStatus';
      var d = new Date(snap.syncedAt);
      st.textContent = '· 동기화 ' + d.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) + (snap.syncedFrom ? ' (' + snap.syncedFrom + ')' : '');
      meta.parentNode.insertBefore(st, meta.nextSibling);
    }
    var gs = document.getElementById('gsWrap');
    if (gs) {
      var out = document.createElement('button');
      out.id = 'smLogout';
      out.className = 'hbtn';
      out.type = 'button';
      out.title = '이 탭의 로그인을 지우고 잠금 화면으로';
      out.textContent = '🔒 잠금';
      out.addEventListener('click', function () { clearToken(); location.reload(); });
      gs.appendChild(out);
    }

    // 3) 열람 전용: INBOX·변경 이력 편집 표의 입력칸을 읽기 전용으로 (표는 화면 전환 때마다 다시 그려짐)
    function lockInputs(root) {
      var els = root.querySelectorAll('#inboxBody input, #inboxBody textarea, #chgBody input, #chgBody textarea');
      for (var i = 0; i < els.length; i++) { els[i].readOnly = true; els[i].tabIndex = -1; }
      var sels = root.querySelectorAll('#inboxBody select, #chgBody select');
      for (var j = 0; j < sels.length; j++) sels[j].disabled = true;
    }
    var detail = document.getElementById('detail');
    if (detail) {
      lockInputs(detail);
      new MutationObserver(function () { lockInputs(detail); }).observe(detail, { childList: true, subtree: true });
    }
  }

  start();
})();
