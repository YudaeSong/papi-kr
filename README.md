# PARAPIA — papi.kr

AI 소프트웨어 엔지니어링 스튜디오 **PARAPIA** 공식 홈페이지. 순수 HTML/CSS/JS 정적 사이트이며 **GitHub Pages**로 서비스하고 도메인 **papi.kr**을 연결합니다.

2026-08 리디자인: 다크 퍼스트(`#090D16`) + 스위스 모더니즘 + 글래스모피즘. 시안(`#00F2FE`)·바이올렛(`#8B5CF6`) 그라데이션 액센트.

## 구조
```
index.html          메인 페이지 (히어로 뉴얼 메시, 코드 윈도우, 역량 매트릭스, 프로세스 타임라인)
legal.html          개인정보 보호정책 + 서비스 약관 (탭 전환)
manual.html         운영자 매뉴얼 (암호 잠금)
css/styles.css      디자인 시스템 전체 (다크 퍼스트, .glass 카드, --grad)
js/language.js      한/영 콘텐츠 기본값 + 다국어 엔진 (data-i18n)
js/main.js          인터랙션 (뉴얼 캔버스, 타이핑, 타임라인, 폼, 시트 로드, 관리자 버튼)
js/google-sheets-api.js  (선택) 구글시트 연동 — 새로고침 시 콘텐츠 덮어쓰기
js/content-manager.js    관리자용 콘텐츠 CSV 다운로드/업로드
assets/             로고, 팀 아바타(보관용)
CNAME               papi.kr (커스텀 도메인)
server.js           로컬 미리보기용 정적 서버 (배포엔 불필요)
```

## 로컬 미리보기
```bash
npm install
npm start            # http://localhost:8080  (또는 python -m http.server 3000)
```

## 배포 (GitHub Pages)
1. 이 저장소를 GitHub에 push (구성 완료)
2. 저장소 **Settings → Pages → Source: `main` 브랜치 / 루트(`/`)**
3. **Custom domain: `papi.kr`** 입력 → 저장 → `Enforce HTTPS` 체크
   - 저장소의 `CNAME` 파일이 papi.kr로 지정되어 있어 자동 연결됩니다.

## 도메인 연결 (반값도메인 등 DNS 설정)
papi.kr(루트 도메인)을 GitHub Pages로 향하게 하려면 **A 레코드 4개**를 추가합니다.

| 타입 | 호스트 | 값 |
|------|--------|------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<GitHub사용자명>.github.io` |

> DNS 반영에는 보통 10분~수 시간 걸립니다. 반영 후 GitHub Pages가 자동으로 Let's Encrypt HTTPS 인증서를 발급합니다.

## 콘텐츠 수정
- **기본값**: `js/language.js`의 `translations.ko / .en`을 수정 후 push (자동 재배포)
- **구글 시트(선택)**: 시트 셀만 수정 → 사이트 새로고침 시 반영. 새 섹션(Philosophy/Process/Work/CTA)의 키를 시트로 관리하려면 Apps Script `MAP`에 키 등록이 필요합니다. 자세한 내용은 `manual.html` 6장 참고.
- **언어 전환**: 내비게이션의 KO/EN 버튼, 또는 URL에 `?lang=ko` / `?lang=en`

## 디자인 토큰
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg` | `#090D16` | 기본 배경 (미드나이트) |
| `--cyan` | `#00F2FE` | 포커스/레이블/글로우 |
| `--violet` | `#8B5CF6` | 그라데이션 끝단 |
| `--grad` | cyan→blue→violet | 버튼/그라데이션 텍스트 |
| `.glass` | 반투명+blur+보더 | 카드 기본형 |
| 폰트 | Pretendard / Space Grotesk / JetBrains Mono | 본문 / 제목 / 레이블·코드 |
