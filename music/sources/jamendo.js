// Jamendo — 검색형. Apps Script(gas/SrcJamendo.js)가 Jamendo API 에서 직접 찾고(키는 gas/KeyCipher.js 의 암호문을 접근 암호로 풀어 쓴다),
// 키를 풀지 못하거나 실패하면 Openverse API(키 불필요, 검색당 최대 240곡)로 찾는다. 어느 쪽으로 찾았는지는 결과 요약(note)에 나온다.
// 두 경로 모두 NC·ND 는 받지 않는다. 기본은 BY·CC0·PD, 라이선스 필터를 풀면 BY-SA 까지.
// 인기 수치(stats)와 발매일은 Jamendo API 결과에만 있다. 키: listens(rate_listened_total), downloads(rate_downloads_total), likes(likes).
// 수치가 없으면(Openverse 결과) 인기순은 검색 관련도 순서 그대로다.
(() => {
  const statCmp = (k) => (a, b) => (b.stats[k] ?? -1) - (a.stats[k] ?? -1) || a._i - b._i;
  const usage = (t) => {
    const c = (t.license || {}).code;
    if (c === 'by') return `사용 조건: ${t.license.label} — 출처 표기(곡 제목·아티스트·라이선스 링크) 필수, 수익 창출 영상 사용 가능`;
    if (c === 'by-sa') return `사용 조건: ${t.license.label} — 출처 표기 필수 + 동일조건변경허락이 영상에 걸릴 수 있음(주의)`;
    if (c === 'cc0' || c === 'pd') return '사용 조건: 퍼블릭 도메인 — 출처 표기 의무 없음(표기 권장)';
    return '사용 조건: Jamendo 곡 페이지에서 라이선스를 직접 확인할 것';
  };
  registerSource({
    id: 'jamendo', name: 'Jamendo', kind: 'search',
    notice: '<b>Jamendo — 검색어로 찾는 CC 음악.</b> 기본으로 <b>CC BY · CC0 · PD</b>만 보여 주고, 라이선스 필터를 「+ 주의」로 바꾸면 BY-SA도 찾습니다(NC·ND 곡은 받지 않음). '
      + '<b>CC BY 곡은 영상 설명란 출처 표기 필수</b> — 「출처 복사」 문구를 쓰세요. '
      + '<b>Jamendo API</b>로 직접 찾아 인기순으로 보여 주며, 쓰기 전에 각 곡의 <b>Jamendo 곡 페이지</b>에서 라이선스를 확인하세요. '
      + '같은 검색은 하루 동안 저장해 다시 요청하지 않습니다. '
      + 'Jamendo API가 응답하지 않으면 <a href="https://openverse.org" target="_blank" rel="noopener">Openverse</a> API로 대신 찾습니다'
      + '(요약에 「Openverse 사용」 표시 — 검색당 최대 240곡, 인기 수치·발매일 없음, <b>Openverse가 보증하지 않는</b> 정보).',
    sorts: [
      { value: 'listens', label: '재생수순', cmp: statCmp('listens'), stat: 'listens' },
      { value: 'downloads', label: '다운로드순', cmp: statCmp('downloads'), stat: 'downloads' },
    ],
    stats: [
      { key: 'listens', icon: '▶', title: 'Jamendo 재생수' },
      { key: 'downloads', icon: '⬇', title: 'Jamendo 다운로드수' },
      { key: 'likes', icon: '♥', title: 'Jamendo 좋아요' },
    ],
    clipExtra: (t) => [
      `장르: ${t.genre || '-'}${t.tags.length ? `, ${t.tags.join(', ')}` : ''}`,
      usage(t),
      '라이선스 확인: 쓰기 전에 아래 Jamendo 곡 페이지에서 직접 확인할 것',
    ],
    metaNote: '인기 수치는 가져온 시점 기준 · 같은 검색은 하루 동안 저장',
  });
})();
