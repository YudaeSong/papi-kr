# App Spec Map 웹 반영 가이드

`https://papi.kr/spec-map/`에 보이는 사양 지도를 **고치거나**, **새 프로젝트를 올리는** 방법입니다.

> **핵심 한 줄** — 웹에 보이는 내용은 각 프로젝트 폴더의 spec-map 파일을 **동기화 명령으로 올려야** 바뀝니다.
> 파일을 고치거나 git push만 해서는 웹이 바뀌지 않습니다.

```
① 내 PC에서 spec-map 파일 수정  →  ② 동기화 명령 실행  →  ③ papi.kr/spec-map 새로고침
   (D:\Projects\<프로젝트>\docs\…)      (sync.js)                (바로 반영)
```

---

## 상황 1 — InSearch 내용을 바꿨을 때 (이미 등록된 PC)

이 PC처럼 이미 설정이 끝난 PC라면 3단계면 끝납니다.

**1. 내용 수정** — 평소처럼 InSearch의 spec-map 파일을 고칩니다.

| 바꾸려는 것 | 파일 (`D:\Projects\InSearch\docs\app-spec-map-data\`) |
|---|---|
| 메뉴·화면·기능·이슈 | `spec-map-data.js` (또는 `spec_map_add.js` 명령) |
| INBOX(기능정의) | `spec-map-inbox.js` (로컬 뷰어에서 편집·💾 저장해도 됨) |
| 변경 이력 | `spec-map-changelog.js` (로컬 뷰어에서 편집·💾 저장해도 됨) |

**2. 동기화** — papikr 폴더에서 실행합니다.

```
cd D:\Projects\papikr
node tools/spec-map-sync/sync.js insearch
```

이렇게 나오면 성공입니다.
```
✓ insearch: 저장 (by pc-a) — 메뉴 5 · 화면 11 · 분류 9 · 기능 97 · 이슈 2 · …
```
- `변경 없음`이 나오면 — 웹에 이미 같은 내용이 있다는 뜻입니다(정상).
- 올리기 전에 확인만 하려면 끝에 `--dry-run`을 붙입니다.

**3. 확인** — `https://papi.kr/spec-map/?p=insearch`를 새로고침합니다. 상단에 `동기화 (날짜) (pc-a)`가 방금 시각으로 바뀌어 있으면 반영된 것입니다.

> 여러 프로젝트를 한 번에: `node tools/spec-map-sync/sync.js --all` (이 PC에 있는 프로젝트 전부)

---

## 상황 2 — 다른 PC에서 다른 프로젝트를 올릴 때

예: 다른 PC에 있는 **SanMaru**를 웹에 올리기.

### 처음 한 번만 — 그 PC 등록

PC마다 **업로드 키**가 따로 필요합니다(분실 시 그 PC만 막을 수 있도록).

| 순서 | 누가·어디서 | 할 일 |
|---|---|---|
| 1 | **NAS 관리자** (NAS에 접속 가능한 PC) | 새 PC용 키 발급 — AdminHub 레포 `server/spec-map-api/README.md`의 「PC 추가」 절차. 결과로 키 1줄을 받음 |
| 2 | 관리자 → 새 PC 사용자 | 키를 **비밀번호 관리자나 USB로** 전달 (채팅·메일·메신저 금지) |
| 3 | **새 PC** | 아래 「새 PC 준비」 |

**새 PC 준비**

1. **Node.js 18 이상** 설치 (`node -v`로 확인)
2. **papikr 레포 받기**
   ```
   cd D:\Projects
   git clone https://github.com/YudaeSong/papi-kr.git papikr
   ```
3. **설정 파일 만들기** — 사용자 폴더에 `.spec-map-sync.env` (예: `C:\Users\<사용자>\.spec-map-sync.env`)
   ```
   SPECMAP_API=https://api.papi.kr/spec-map/v1
   SPECMAP_PC=pc-b
   SPECMAP_UPLOAD_KEY=<1에서 받은 키>
   ```
   - `SPECMAP_PC`는 관리자가 발급할 때 정한 이름(예: `pc-b`)과 같게.
   - 이 파일은 레포 밖에 있으므로 git에 올라가지 않습니다.
4. **확인** — 프로젝트가 보이는지
   ```
   cd D:\Projects\papikr
   node tools/spec-map-sync/sync.js --list
   ```
   `sanmaru  SanMaru  있음  D:\Projects\SanMaru\docs\app-spec-map-data` 처럼 **있음**이면 준비 끝.
   - **없음**이면 프로젝트 폴더 위치가 다른 것 — 설정 파일에 한 줄 추가:
     `SPECMAP_DIR_SANMARU=E:\work\SanMaru\docs\app-spec-map-data`
     (프로젝트 이름은 대문자, `-`는 `_`로. 예: THNKN-app → `SPECMAP_DIR_THNKN_APP`)

### 올리기 (매번)

```
cd D:\Projects\papikr
git pull                                              # 스크립트 최신화
node tools/spec-map-sync/sync.js sanmaru --dry-run    # 검사만
node tools/spec-map-sync/sync.js sanmaru              # 업로드
```
→ `https://papi.kr/spec-map/` 상단 프로젝트 선택 상자에 **SanMaru**가 생깁니다.

### 올릴 수 있는 프로젝트

AdminHub · AndSpark · InSearch · PapiCrawler · SanMaru · snSpark · THNKN-app (`projects.json`에 등록됨)
- 목록에 없는 새 프로젝트는 `tools/spec-map-sync/projects.json`에 `{ "slug": "소문자-이름", "name": "폴더 이름" }` 한 줄을 추가하고 papikr에 커밋·push.

---

## 올리기 전에 꼭 확인할 것

| 확인 | 이유 |
|---|---|
| **v2 형식인가** — `spec-map-data.js` 위쪽에 `const MENUS`가 있는가 | 웹은 v2 전용. `const SECTIONS`(v1)이면 거부됩니다 → 그 프로젝트를 먼저 v2로 전환 |
| **민감 정보가 없는가** — 실제 비밀번호·API 키·토큰·개인 이메일·전화번호 | 웹은 비밀번호로 잠겨 있지만, 비밀값은 사양 문서에 두지 않는 것이 원칙 |
| **함수 값이 없는가** — `overviewTop: () => …` 같은 것 | 웹은 데이터(JSON)만 받습니다. 스크립트가 위치를 알려 주며 거부합니다 |

---

## 자주 보는 메시지

| 메시지 | 뜻 / 할 일 |
|---|---|
| `✓ … 저장` | 올라감. 웹 새로고침 |
| `✓ … 변경 없음` | 웹과 같은 내용. 할 일 없음 |
| `v1 형식(SECTIONS)입니다` | 그 프로젝트를 v2로 전환 후 다시 |
| `API 401 … 업로드 키가 틀렸거나 NAS에 등록되지 않음` | 설정 파일의 키 확인. 새 PC면 관리자가 NAS에 등록했는지 확인 |
| `API 429` | 실패가 많아 15분 차단. 키 확인 후 15분 뒤 |
| `API 연결 실패` | 인터넷 확인 → `https://api.papi.kr/` 가 브라우저에서 열리는지(안 열리면 NAS 관리자에게) |
| `업로드 설정 없음` | `.spec-map-sync.env` 파일 위치·내용 확인 |
| `이 PC에 없음 (건너뜀)` | `--all` 실행 시 이 PC에 없는 프로젝트 — 정상 |

---

## 참고

- 웹은 **열람 전용**입니다. 수정은 항상 각 PC의 원본 파일에서 합니다.
- 두 PC가 같은 프로젝트를 올리면 **나중에 올린 것**이 보입니다. 서버는 프로젝트마다 최근 20번의 업로드를 보관합니다(되돌리기는 NAS 관리자).
- 웹 화면 자체(뷰어 디자인)를 바꿀 때: `node tools/spec-map-sync/sync.js --update-viewer` → 커밋·push (README 참조).
- 자세한 옵션: [README.md](README.md)
