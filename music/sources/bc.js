// BreakingCopyright(breakingcopyright.com) — 수집형. Apps Script(gas/SrcBc.js)가 카탈로그 HTML 1건을 받아 24시간 보관한다.
// 라이선스가 곡마다 다르다(CC BY·YouTube 무료·BY-SA·NC·ND·작곡가 자체 조건). 판정은 index.html licClass 가 license.code 로 한다.
// 출처 문구는 곡 페이지 「Song credits (YouTube)」와 같은 규칙으로 gas/SrcBc.js 가 만든다(곡 페이지 15곳 대조 일치).
(() => {
  const statCmp = (k) => (a, b) => (b.stats[k] ?? -1) - (a.stats[k] ?? -1);
  // 곡별 사용 조건 한 줄(출처 복사에 덧붙임)
  const usage = (t) => {
    const L = t.license || {};
    if (L.code === 'yt-free' && /onsound\.eu/.test(L.url)) return '사용 조건(작곡가 페이지): 소셜·수익 창출 영상은 설명란 출처 표기로 무료 · 매장·앱·유료 광고·방송은 유료 라이선스 — 작곡가 페이지가 따로 주는 출처 문구도 확인할 것';
    if (L.code === 'yt-free') return '사용 조건: YouTube에서 출처 표기로 무료 · YouTube 밖에서 쓰려면 작곡가에게 문의 · Content ID 등 저작권 감지 시스템 등록 금지';
    if (L.code === 'ncs') return '사용 조건: NCS 곡 — NCS 사용 정책을 따름(https://ncs.io/usage-policy). 출처 문구는 ncs.io 곡 페이지의 「Copy credit」 문구를 쓸 것(아래 문구는 BC 형식)';
    if (/^by(-|$)/.test(L.code)) return `사용 조건: ${L.label} — 출처 표기(곡 제목·작곡가·라이선스 링크) 필수, 그 밖은 해당 CC 조건을 따름`;
    return '사용 조건: 작곡가 자체 조건 — 라이선스 링크에서 직접 확인할 것';
  };
  registerSource({
    id: 'bc', name: 'BreakingCopyright', kind: 'library',
    notice: '<b>BreakingCopyright — 곡마다 라이선스가 다릅니다(배지 확인).</b> '
      + '<b>CC BY</b> 곡은 출처 표기로 수익 창출 영상에도 사용 가능, <b>YouTube 무료</b> 곡은 <b>YouTube에서만</b> 출처 표기로 무료이고 YouTube 밖은 작곡가에게 문의해야 합니다(Content ID 등록 금지). '
      + 'BY-SA·NC·ND·작곡가 자체 조건 곡은 기본으로 숨깁니다. <b>모든 곡이 설명란 출처 표기 필수</b> — 「출처 복사」 문구는 곡 페이지의 Song credits와 같습니다. '
      + '<a href="https://breakingcopyright.com/terms" target="_blank" rel="noopener">이용 약관 ↗</a>',
    sorts: [
      { value: 'score', label: '사이트 인기 점수순', cmp: statCmp('score'), stat: 'score' },
    ],
    stats: [{ key: 'score', icon: '★', title: '사이트 인기 점수(재생수 아님)' }],
    clipExtra: (t) => [
      `장르: ${t.genre || '-'}${t.tags.length ? `, ${t.tags.join(', ')}` : ''}${t.moods.length ? ` · 분위기: ${t.moods.join(', ')}` : ''}${t.bpm ? ` · ${t.bpm} BPM` : ''}`,
      usage(t),
    ],
    metaNote: '목록은 서버가 하루 한 번 새로 받음 · 인기 점수는 사이트 「Most popular」 기준(재생수 아님)',
    emptyText: 'BreakingCopyright 목록을 받지 못했습니다. 「목록 새로 받기」를 눌러 다시 시도해 주세요.',
  });
})();
