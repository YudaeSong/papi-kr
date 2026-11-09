// 안내 문서 3종이 함께 쓰는 찾기 규칙.
// 띄어쓰기·문장부호를 무시하고, 입력한 말을 나눠 모두 들어 있으면 찾는다(순서 무관).
// 조사·「하기」 어미를 떼어 비교하고, 같은 뜻의 말(취소=중지 등)도 함께 찾는다.
window.DocSearch = (() => {
  const SAME = [
    ['취소', '중지', '그만', '해제', '끄기', '풀려', '풀기'],
    ['삭제', '지우', '버리기', '빼기'],
    ['내려받', '다운로드', '다운', '받기'],
    ['올리', '업로드'],
    ['공유', '보내', '전송'],
    ['코스', '경로'],
    ['등산로', '탐방로'],
    ['사진', '이미지', '캡처', '캡쳐'],
    ['검색', '찾기'],
    ['음성', '마이크', '마루야'],
    ['수정', '변경', '바꾸', '고치'],
    ['일정', '예약'],
    ['조난', '길잃', '길을잃'],
    ['날머리', '하산'],
    ['배터리', '밧데리', '충전'],
    ['gps', '지피에스'],
  ];
  const ENDING = /(하려면|합니다|하는법|하기|으로|에서|을|를|이|가|은|는|에|의|로|와|과|도)$/;

  const norm = s => String(s ?? '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');

  function variants(word) {
    const forms = new Set([word]);
    const stem = word.replace(ENDING, '');
    if (stem.length >= 2) forms.add(stem);
    for (const form of [...forms]) {
      for (const group of SAME) {
        const found = group.find(w => form.includes(w));
        if (found) group.forEach(w => forms.add(form.replace(found, w)));
      }
    }
    return [...forms];
  }

  // 입력을 판정 함수로 바꾼다. 입력이 비어 있으면 null.
  function matcher(query) {
    const whole = norm(query);
    if (!whole) return null;
    // 영문과 한글이 붙은 말은 나눈다(gps약할때 → gps, 약할때).
    const words = String(query).toLowerCase().split(/[\s\p{P}\p{S}]+/u).filter(Boolean)
      .flatMap(w => w.match(/[a-z0-9]+|[^a-z0-9]+/g)).map(variants);
    return text => text.includes(whole) || words.every(forms => forms.some(f => text.includes(f)));
  }

  return { norm, matcher };
})();
