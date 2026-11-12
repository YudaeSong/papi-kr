# spec-map-sync

각 프로젝트의 App Spec Map 데이터(`docs/app-spec-map-data/*.js`, 원본)를 NAS API(`https://api.papi.kr`)에 올려
`https://papi.kr/spec-map/`에서 비밀번호로 열람할 수 있게 한다. **git push로는 반영되지 않는다 — 이 스크립트를 실행해야 한다.**

```
D:\Projects\<프로젝트>\docs\app-spec-map-data\*.js ──(sync.js, PC별 업로드 키)──▶ api.papi.kr ──▶ NAS DB ──▶ papi.kr/spec-map
```

> 처음 쓰거나 다른 PC에서 올린다면 단계별 안내 **[GUIDE.md](GUIDE.md)** 부터 보세요. 이 문서는 옵션·세부 참고용입니다.

## 사용법 (papikr 레포 루트에서, Node 18+)

```bash
node tools/spec-map-sync/sync.js --list               # 등록 프로젝트와 이 PC 경로·존재 여부
node tools/spec-map-sync/sync.js insearch --dry-run   # 읽기·검증·수치만 (업로드 안 함)
node tools/spec-map-sync/sync.js insearch             # 업로드 (여러 개: insearch sanmaru)
node tools/spec-map-sync/sync.js --all                # 이 PC에 있는 프로젝트 전부
```

출력 예: `✓ insearch: 저장 (by pc-a) — 메뉴 5 · 화면 11 · 분류 9 · 기능 97 · 이슈 2 · … · e5069f53d49f`
같은 내용이면 `변경 없음`. 서버는 프로젝트별 최근 20개 스냅샷을 보관한다.

## 조건

- **v2 형식만** (`spec-map-data.js`에 `const MENUS`). v1(`const SECTIONS`)은 거부 — 그 PC에서 v2로 전환 후 실행.
- 데이터에 **함수 값**이 있으면 거부(위치를 알려 줌). 웹은 JSON만 받는다.
- 원본 파일은 읽기만 한다.

## PC 설정 — 사용자 폴더 `.spec-map-sync.env` (레포 밖, PC마다 1개)

```
SPECMAP_API=https://api.papi.kr/spec-map/v1
SPECMAP_PC=pc-a
SPECMAP_UPLOAD_KEY=<이 PC 전용 키>
# 선택: 프로젝트 위치가 D:/Projects/<이름>/docs/app-spec-map-data 가 아닐 때
# SPECMAP_PROJECTS_ROOT=E:/Projects
# SPECMAP_DIR_THNKN_APP=E:/work/THNKN-app/docs/app-spec-map-data     (slug의 - 는 _)
```

## 새 PC 등록 (처음 한 번)

1. NAS에 접속 가능한 PC에서 키 발급 — AdminHub 레포 `server/spec-map-api/`:
   `node hash-password.js --upload-key pc-b`
   - 1행 `SPECMAP_UPLOAD_KEY=…` → 새 PC의 `.spec-map-sync.env`에 (비밀번호 관리자·USB로 옮김, 채팅·메일 금지)
   - 2행 `pc-b:…` → NAS `/volume1/apps/spec-map-api/.env`의 `UPLOAD_KEYS`에 `,`로 덧붙이고
     `sudo /usr/local/etc/rc.d/spec-map-api.sh restart`
2. 새 PC: papikr 레포 받기 → `.spec-map-sync.env` 작성 → `sync.js --list`로 경로 확인 → `--dry-run` → 업로드.
3. PC 분실·교체: NAS `UPLOAD_KEYS`에서 그 이름표만 지우고 restart.

## 프로젝트 추가

`projects.json`에 `{ "slug": "소문자-slug", "name": "폴더 이름" }` 한 줄. 웹·API 수정 불필요(첫 업로드 때 자동 등록).

## 오류

| 메시지 | 조치 |
|---|---|
| `API 401 … 업로드 키가 틀렸거나 NAS에 등록되지 않음` | `.spec-map-sync.env`의 키, NAS `UPLOAD_KEYS` 확인 |
| `API 429` | 실패가 많아 15분 차단 — 키 확인 후 대기 |
| `API 연결 실패` | 인터넷·NAS·터널 상태 (`curl https://api.papi.kr/`) |
| `v1 형식(SECTIONS)` | 그 프로젝트를 v2로 전환 |

## 테스트

`node --test tools/spec-map-sync/test/sync.test.js` — 임시 폴더만 사용, 네트워크 없음.

## 웹 화면 갱신 (`spec-map/`)

`node tools/spec-map-sync/sync.js --update-viewer`
- InSearch의 v2 뷰어(`spec-map-viewer.js`)를 그대로 복사하고, 원본 `app-spec-map.html`의 스타일·마크업으로 `spec-map/index.html`을 다시 만든다(잠금 화면·CSP·noindex 포함).
- 웹 전용 동작은 `spec-map/app.js`(잠금·API 조회·어댑터)와 `spec-map/web.css`(열람 전용·좁은 화면)에만 있다 — `index.html`·`spec-map-viewer.js`는 직접 고치지 않는다.
- 공유 뷰어(v2)가 바뀌면 이 명령 → 로컬 확인 → push.
