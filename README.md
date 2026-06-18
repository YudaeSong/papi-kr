# PARAPIA — papi.kr

소프트웨어 개발 회사 PARAPIA 공식 홈페이지. 순수 HTML/CSS/JS 정적 사이트이며 **GitHub Pages**로 서비스하고 도메인 **papi.kr**을 연결합니다.

## 구조
```
index.html          메인 페이지 (다크 테마, data-i18n 다국어)
legal.html          개인정보 보호정책 + 서비스 약관 (탭 전환)
css/styles.css      전체 스타일 (모던 SaaS 다크)
js/language.js      한/영 번역 + 콘텐츠(기본값) + 자동 언어감지
js/google-sheets-api.js  (선택) 구글시트 연동 로직 — 공개 배포에선 비활성
js/main.js          인터랙션 (모바일 메뉴, 폼 등)
assets/             로고, 팀 아바타 이미지
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

(선택, IPv6) AAAA `@`:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`

> DNS 반영에는 보통 10분~수 시간 걸립니다. 반영 후 GitHub Pages가 자동으로 Let's Encrypt HTTPS 인증서를 발급합니다.

## 콘텐츠 수정
공개 배포본은 `js/language.js`의 기본값(한/영)을 표시합니다. 문구를 바꾸려면 해당 파일을 수정 후 다시 push 하면 GitHub Pages가 자동 재배포합니다.
