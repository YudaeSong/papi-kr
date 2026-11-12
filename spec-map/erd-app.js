/**
 * ERD 웹 열람 — 잠금 → API가 운영 DB 구조를 지금 조회해 만든 ERD → 원본 ERD 렌더 코드(erd-viewer.js, 수정 없음) 실행.
 * 렌더 코드는 ERD_META·ERD_SECTIONS 전역과 window.mermaid를 가정하므로, 전역을 넣고 mermaid → 렌더 코드 순서로 삽입한다.
 * 로그인은 Spec Map 화면과 같은 탭 토큰(sessionStorage)을 쓴다.
 */
(function () {
  'use strict';
  var API = window.SPEC_MAP_API;
  var TOKEN_KEY = 'specmap-token';

  var lock = document.getElementById('smLock');
  var form = document.getElementById('smLockForm');
  var pw = document.getElementById('smPw');
  var btn = document.getElementById('smBtn');
  var msg = document.getElementById('smLockMsg');
  var bar = document.getElementById('smErdBar');
  var slug = (new URLSearchParams(location.search).get('p') || '').toLowerCase();

  document.getElementById('smBack').href = './' + (slug ? '?p=' + encodeURIComponent(slug) : '');
  document.getElementById('smReload').addEventListener('click', function () { location.reload(); });

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

  function fatal(text) {
    lock.hidden = false;
    form.innerHTML = '<h1>🗄️ ERD</h1><p id="smLockMsg"></p><p><a href="./">⬅ Spec Map</a></p>';
    form.querySelector('#smLockMsg').textContent = text;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('화면 스크립트를 불러오지 못했습니다')); };
      document.body.appendChild(s);
    });
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
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(slug)) { fatal('프로젝트가 지정되지 않았습니다. Spec Map에서 🗄️ ERD 보기로 들어오세요.'); return; }
    var token = getToken();
    if (!token) { showLock(); return; }
    fetch(API + '/projects/' + encodeURIComponent(slug) + '/erd', { headers: { Authorization: 'Bearer ' + token } })
      .then(function (r) {
        if (r.status === 401) { clearToken(); showLock('로그인이 만료되었습니다. 다시 입력해 주세요.', true); return null; }
        if (r.status === 404) { fatal('이 프로젝트에는 ERD가 없습니다.'); return null; }
        if (!r.ok) { fatal('ERD를 불러오지 못했습니다 (' + r.status + ').'); return null; }
        return r.json();
      })
      .then(function (erd) {
        if (!erd) return;
        window.ERD_META = erd.ERD_META;
        window.ERD_SECTIONS = erd.ERD_SECTIONS;
        lock.hidden = true;
        bar.hidden = false;
        var d = new Date(erd.queriedAt);
        document.getElementById('smErdState').textContent =
          (erd.name || slug) + ' · 운영 DB 조회 ' + d.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'medium' });
        // mermaid가 실패해도 표·카드는 그린다(원본도 mermaid 없으면 다이어그램만 텍스트)
        return loadScript('vendor/mermaid.min.js').catch(function () { /* 다이어그램만 텍스트로 */ })
          .then(function () { return loadScript('erd-viewer.js'); });
      })
      .catch(function (e) {
        fatal(e && e.message && e.message.indexOf('화면') === 0 ? e.message : '데이터 서버에 연결할 수 없습니다. 잠시 뒤 새로고침하세요.');
      });
  }

  start();
})();
