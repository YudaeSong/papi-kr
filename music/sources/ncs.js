// NCS(NoCopyrightSounds) — 북마크 가져오기 전용. 백엔드(Apps Script)는 ncs.io 를 직접 받지 않는다(ncs.io/llms.txt: 자동 수집·대량 다운로드·봇 금지).
// 북마크가 ncs.io 화면에서 /api/fm-pack 1건을 받아 필요한 열만 골라 앱 주소 #ncs= 뒤에 실어 연다(약 0.6MB, 2,016곡 기준).
// "~" 펼치기·출처 문구는 gas/SrcNcs.js 가 한다.
(() => {
  // 아래 함수는 북마크로 저장되어 ncs.io 화면에서 실행된다: 이 페이지의 변수 사용 금지,
  // 북마크 주소에서 줄바꿈이 사라질 수 있어 함수 안에 // 주석 금지·문장마다 ; 필수.
  function ncsBookmarklet(app) {
    const say = (msg) => { const d = document.createElement('div'); d.textContent = msg;
      d.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#111;color:#fff;padding:10px 18px;border-radius:8px;font:14px sans-serif;box-shadow:0 4px 20px #0006';
      document.body.appendChild(d); setTimeout(() => d.remove(), 4000); };
    if (!/^(www\.)?ncs\.io$/.test(location.hostname)) { say('ncs.io 화면에서 눌러 주세요.'); return; }
    (async () => {
      say('NCS 곡 목록을 받는 중…');
      const r = await fetch('/api/fm-pack');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      const c = j && j.cols;
      if (!c || !Array.isArray(c.id) || !Array.isArray(c.mp3) || !Array.isArray(c.title)) throw new Error('목록 형식이 바뀌었습니다');
      const keep = ['id', 'path', 'title', 'artist', 'genre', 'moods', 'len', 'released', 'mp3', 'downloads', 'plays', 'bpm'];
      const cols = {};
      keep.forEach((k) => { if (Array.isArray(c[k])) cols[k] = c[k]; });
      cols.mark = (c.mark || []).map((m) => (m && m.label) || null);
      const prefixes = {};
      Object.keys(cols).forEach((k) => { if (j.prefixes && typeof j.prefixes[k] === 'string') prefixes[k] = j.prefixes[k]; });
      const url = app + '/#ncs=' + encodeURIComponent(JSON.stringify({ v: j.v, n: c.id.length, at: new Date().toISOString(), prefixes, cols }));
      say(c.id.length + '곡을 앱으로 보냅니다.');
      if (!window.open(url, 'freemusicsearch')) location.href = url;
    })().catch((e) => say('실패: ' + e.message));
  }

  const statCmp = (k) => (a, b) => (b.stats[k] ?? -1) - (a.stats[k] ?? -1);
  registerSource({
    id: 'ncs', name: 'NCS', kind: 'library',
    defaultLic: 'all', // 전곡이 「홍보 영상 불가」 등급이라 「허용만」으로 시작하면 항상 0곡으로 보인다
    notice: '<b>NCS(NoCopyrightSounds) — 개인 크리에이터의 자기 영상·방송은 무료, 수익 창출 가능.</b> 긴 영상은 <b>설명란에 출처 필수</b>(Shorts·Reels·TikTok은 불필요). '
      + '<b>브랜드·게임·영화/TV, 유료 광고·협찬 영상(본인 채널 포함)은 유료 라이선스</b>가 필요합니다. 음원 단독 배포·판매, 길이 맞춤 이상의 변형은 금지. '
      + '<b>출처 문구는 곡 페이지의 「Copy credit」 문구를 그대로 쓰세요</b>(곡마다 문구가 달라 「출처 복사」의 문구는 참고용 초안). '
      + '<a href="https://ncs.io/usage-policy" target="_blank" rel="noopener">사용 정책 ↗</a>',
    how: '<summary>NCS 곡 가져오기 (ncs.io는 자동 수집을 금지해, ncs.io 화면에서 한 번 눌러 전체 목록을 가져옵니다)</summary>'
      + '<ol class="steps">'
      + '<li><b>처음 한 번:</b> 오른쪽 점선 버튼을 브라우저 <b>북마크바로 끌어다 놓기</b> → <a class="btn small bm" data-ncs-bm href="#" title="북마크바로 끌어다 놓으세요">♪ NCS 앱으로 보내기</a></li>'
      + '<li><a href="https://ncs.io/free-music" target="_blank" rel="noopener">ncs.io</a>를 열고(어느 화면이든) 북마크 <b>「♪ NCS 앱으로 보내기」</b> 클릭 → 전체 곡(약 2,000곡)이 이 탭에 들어옵니다</li>'
      + '<li>다시 누르면 목록을 통째로 새로 바꿉니다. 다운로드·재생 수치는 가져온 시점 기준이라 가끔 다시 가져오세요</li>'
      + '</ol>',
    setup(p, FMS) {
      const a = p.querySelector('[data-ncs-bm]');
      a.href = FMS.bookmarkletHref(ncsBookmarklet);
      a.addEventListener('click', (e) => { e.preventDefault(); FMS.toast('이 버튼을 북마크바로 끌어다 놓으세요'); });
    },
    sorts: [
      { value: 'dl', label: '다운로드 많은 순', cmp: statCmp('downloads'), stat: 'downloads' },
      { value: 'plays', label: 'Spotify 재생 많은 순', cmp: statCmp('plays'), stat: 'plays' },
    ],
    stats: [{ key: 'downloads', icon: '⬇', title: 'ncs.io 다운로드' }, { key: 'plays', icon: '▶', title: 'Spotify 재생' }],
    clipExtra: (t) => [
      `장르: ${t.genre || '-'}${t.moods.length ? ` · 분위기: ${t.moods.join(', ')}` : ''}${t.bpm ? ` · ${t.bpm} BPM` : ''}`,
      '사용 조건: 개인 크리에이터의 자기 영상·방송 무료(수익 창출 가능) · 긴 영상은 설명란 출처 필수(Shorts·Reels 불필요) · 브랜드·게임·영화/TV·유료 광고·협찬은 유료 라이선스',
      `※ 아래 출처 표기 문구는 목록 데이터로 만든 참고용 초안이라 틀릴 수 있음(아티스트 표기·feat.·[NCS Release] 태그가 곡마다 다름). 영상 설명란에는 곡 페이지(${t.page || 'ncs.io'})의 「Copy credit」 문구를 그대로 쓸 것`,
    ],
    metaNote: '수치는 가져온 시점 기준 · 다운로드는 ncs.io, 재생은 Spotify',
    emptyText: '아직 가져온 곡이 없습니다. 위 안내대로 ncs.io 화면에서 북마크를 눌러 주세요.',
  });
})();
