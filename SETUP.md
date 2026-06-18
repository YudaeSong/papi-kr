# PARAPIA 웹사이트 설치 및 실행 가이드

## 📋 요구사항

- **Node.js** (v14 이상) - [다운로드](https://nodejs.org/)
- **npm** (Node.js와 함께 설치됨)

## 🚀 설치 및 실행

### 1단계: Node.js 설치 확인

터미널(CMD 또는 PowerShell)에서 다음을 입력하세요:

```bash
node --version
npm --version
```

### 2단계: 프로젝트 디렉토리로 이동

```bash
cd d:\Projects\papi.kr
```

### 3단계: 의존성 설치

```bash
npm install
```

이 명령어는 다음 패키지를 설치합니다:
- `express` - 웹 서버 프레임워크
- `multer` - 파일 업로드 처리
- `cors` - CORS 설정
- `body-parser` - JSON 요청 처리

### 4단계: 서버 시작

```bash
npm start
```

또는

```bash
node server.js
```

### 5단계: 브라우저에서 접속

다음 주소들로 접속하세요:

| 페이지 | 주소 |
|--------|------|
| 홈페이지 | http://localhost:3000 |
| 관리자 페이지 | http://localhost:3000/admin.html |
| 테스트 페이지 | http://localhost:3000/test.html |

## 📊 관리자 페이지 사용법

### 1. 엑셀 템플릿 다운로드

관리자 페이지에서 **"📥 엑셀 템플릿 다운로드"** 버튼을 클릭합니다.

### 2. 엑셀 파일 수정

다운로드한 `parapia-translations.xlsx` 파일을 엽니다:

```
Key | 한국어 (Korean) | 영어 (English)
----|-----------------|----------------
hero_title | 변화시키세요 | Transform Your Business with
service1_title | 웹 개발 | Web Development
...
```

한국어와 영어 열의 텍스트만 수정하세요. **Key 열은 변경하지 마세요!**

### 3. 수정된 파일 업로드

1. 관리자 페이지의 **"2️⃣ 수정된 파일 업로드"** 섹션으로 갑니다.
2. 수정된 파일을 드래그 앤 드롭하거나 파일 선택 버튼으로 선택합니다.
3. 자동으로 업로드되고 서버에 저장됩니다.
4. **저장된 파일 목록**에서 업로드된 파일을 확인할 수 있습니다.

## 💾 파일 관리

### 저장된 파일 위치

```
d:\Projects\papi.kr\data\uploads\
```

모든 업로드된 엑셀 파일이 여기에 저장됩니다.

### 파일명 규칙

```
parapia-translations_2026-06-18_14-30-45.xlsx
```

- 원본 파일명
- 업로드 날짜
- 업로드 시간
- 확장자

### 파일 관리 기능

#### ⬇️ 다운로드
저장된 파일 목록에서 파일 옆의 **"⬇️ 다운로드"** 버튼으로 다운로드할 수 있습니다.

#### 🗑️ 삭제
불필요한 파일은 **"🗑️ 삭제"** 버튼으로 제거할 수 있습니다.

#### 📝 최신 파일 다운로드 (API)
```bash
curl http://localhost:3000/api/latest > latest.xlsx
```

## 🔧 API 엔드포인트

### 파일 업로드
```bash
POST /api/upload
Content-Type: multipart/form-data
Body: file=<엑셀 파일>
```

### 파일 목록 조회
```bash
GET /api/files
```

응답 예시:
```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "filename": "parapia_2026-06-18_14-30-45.xlsx",
      "size": "25.50 KB",
      "uploadedAt": "2026. 6. 18. 오후 2:30:45",
      "downloadUrl": "/data/uploads/parapia_2026-06-18_14-30-45.xlsx"
    }
  ]
}
```

### 파일 다운로드
```bash
GET /api/download/:filename
```

### 파일 삭제
```bash
DELETE /api/delete/:filename
```

### 최신 파일 다운로드
```bash
GET /api/latest
```

### 서버 상태 확인
```bash
GET /api/status
```

응답 예시:
```json
{
  "status": "running",
  "serverTime": "2026. 6. 18. 오후 2:35:12",
  "uploadsDirectory": "d:\\Projects\\papi.kr\\data\\uploads",
  "fileCount": 3,
  "diskSpace": "75.50 KB"
}
```

## 🌐 URL 쿼리 파라미터로 언어 설정

### 영어로 보기
```
http://localhost:3000/?lang=en
```

### 한국어로 보기
```
http://localhost:3000/?lang=ko
```

## 📦 프로젝트 구조

```
papi.kr/
├── index.html              # 메인 홈페이지
├── admin.html              # 관리자 페이지
├── test.html               # 스타일 테스트 페이지
├── server.js               # Node.js 서버
├── package.json            # 의존성 정의
├── css/
│   └── styles.css          # 커스텀 스타일
├── js/
│   ├── main.js             # 메인 JavaScript
│   ├── language.js         # 언어 감지 및 번역
│   └── excel-manager.js    # 엑셀 관리 기능
├── assets/
│   └── logos/              # 로고 파일
└── data/
    └── uploads/            # 업로드된 엑셀 파일
```

## 🔒 보안 팁

1. **패스워드 보호**: 관리자 페이지에 인증을 추가하려면 server.js에 미들웨어를 추가하세요.
2. **파일 검증**: 현재 .xlsx, .xls, .csv만 허용합니다.
3. **접근 제한**: 프로덕션에서는 firewall을 통해 포트 3000을 보호하세요.

## 🆘 트러블슈팅

### "npm: command not found"
- Node.js가 설치되지 않았습니다. [Node.js 다운로드](https://nodejs.org/)

### "Cannot find module 'express'"
```bash
npm install
```
다시 실행하세요.

### "Port 3000 is already in use"
다른 애플리케이션이 포트 3000을 사용 중입니다.
- 다른 포트 사용: `server.js`의 `PORT = 3000`을 변경하세요.
- 또는 기존 프로세스 종료: Windows에서 `taskkill /F /IM node.exe`

### "업로드 실패" (Node.js 서버 미실행)
터미널에서 `npm start`로 서버가 실행 중인지 확인하세요.

## 📝 배포 팁

### Netlify/Vercel에 배포 시
이 프로젝트는 Node.js 서버가 필요하므로, 다음 서비스 추천:
- **Heroku** - Node.js 호스팅
- **Railway** - 무료 Node.js 호스팅
- **Render** - Node.js 배포
- **AWS EC2** - 자유도 높음

## 💬 지원

문제가 발생하면:
1. 서버 로그를 확인하세요 (터미널 출력)
2. `/api/status`로 서버 상태를 확인하세요
3. 브라우저 개발자 도구 (F12) → Console 탭에서 에러를 확인하세요

---

**Happy managing!** 🚀
