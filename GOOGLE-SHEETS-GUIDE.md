# 🗺️ PARAPIA 사이트맵 - 구글 시트 구조

## 📊 구글 시트 구성도

```
PARAPIA 홈페이지 관리 (Google Sheets)
│
├─ 📄 Structure (구조 가이드)
│  └─ 전체 사이트 맵 및 설명
│
├─ 🏠 Home (홈 섹션)
│  ├─ 배지 (Digital Transformation)
│  ├─ 메인 타이틀
│  ├─ 메인 타이틀 강조
│  ├─ 서브 타이틀
│  └─ 버튼들 (2개)
│
├─ 🛠️ Services (서비스 섹션)
│  ├─ 섹션 제목
│  ├─ 섹션 설명
│  └─ 카드들 (최대 6개)
│     ├─ 웹 개발
│     ├─ 모바일 앱
│     ├─ 데이터 분석
│     ├─ 보안 솔루션
│     ├─ DevOps & 클라우드
│     └─ AI 솔루션
│
├─ 💼 Portfolio (포트폴리오 섹션)
│  ├─ 섹션 제목
│  ├─ 섹션 설명
│  └─ 프로젝트 카드들 (최대 4개)
│     ├─ 전자상거래 플랫폼
│     ├─ 모바일 뱅킹 앱
│     ├─ 분석 대시보드
│     └─ IoT 관리 시스템
│
├─ 👥 Team (팀 섹션)
│  ├─ 섹션 제목
│  ├─ 섹션 설명
│  └─ 팀 멤버들 (최대 4명)
│     ├─ CEO/창립자
│     ├─ 리드 개발자
│     ├─ 디자인 리드
│     └─ DevOps 엔지니어
│
├─ ⭐ Testimonials (고객후기 섹션)
│  ├─ 섹션 제목
│  ├─ 섹션 설명
│  └─ 고객 후기들 (최대 5개)
│     ├─ 존 스미스
│     ├─ 사라 밀러
│     ├─ 마이클 김
│     └─ ...
│
└─ 📞 Contact (연락처 섹션)
   ├─ 섹션 제목
   ├─ 섹션 설명
   ├─ 폼 필드들 (4개)
   │  ├─ 이름
   │  ├─ 이메일
   │  ├─ 제목
   │  └─ 메시지
   └─ 연락처 정보 (3개)
      ├─ 전화
      ├─ 이메일
      └─ 주소
```

---

## 🛠️ 각 시트의 구성

### 📄 **Structure 시트** (가이드)

```
항목 | 설명 | URL
홈 | 메인 페이지 | /
서비스 | 우리의 서비스 6가지 | /#services
포트폴리오 | 최근 프로젝트 4개 | /#portfolio
팀 | 팀 멤버 소개 | /#team
고객후기 | 클라이언트 후기 | /#testimonials
연락처 | 문의 및 연락 | /#contact
```

---

### 🏠 **Home 시트**

```
항목 | 타입 | 한국어 | 영어 | 설명
배지 | text | 디지털 혁신 | Digital Transformation | 배지 텍스트
메인타이틀 | text | 비즈니스를 스마트 소프트웨어로 | Transform Your Business with | 주요 제목
타이틀강조 | text | 변화시키세요 | Smart Software | 강조 부분
서브타이틀 | text | 20년 이상의 경험으로... | 20+ years of expertise... | 설명 문구
버튼1텍스트 | button | 프로젝트 시작하기 | Start Your Project | 첫 번째 버튼
버튼2텍스트 | button | 포트폴리오 보기 | View Our Work | 두 번째 버튼
```

---

### 🛠️ **Services 시트**

```
구분 | 항목 | 한국어 | 영어
섹션제목 | 제목 | 우리의 서비스 | Our Services
섹션설명 | 설명 | 맞춤형 소프트웨어 솔루션 | Comprehensive software...
카드1 | 제목 | 웹 개발 | Web Development
카드1 | 설명 | 최신 기술로 만든... | Modern, responsive...
카드2 | 제목 | 모바일 앱 | Mobile Apps
카드2 | 설명 | iOS와 Android용... | Native and cross-platform...
...
카드6 | 제목 | AI 솔루션 | AI Solutions
카드6 | 설명 | 지능형 자동화를 위한... | Machine learning and...
```

---

### 💼 **Portfolio 시트**

```
구분 | 항목 | 한국어 | 영어 | 기술스택
섹션제목 | 제목 | 최근 프로젝트 | Recent Projects | -
섹션설명 | 설명 | 혁신적인 솔루션 소개 | Showcasing... | -
프로젝트1 | 제목 | 전자상거래 플랫폼 | E-Commerce Platform | React • Node.js • MongoDB
프로젝트1 | 설명 | AI 기반 추천 기능... | Full-stack marketplace... | -
프로젝트2 | 제목 | 모바일 뱅킹 앱 | Mobile Banking App | Flutter • Firebase • Blockchain
...
```

---

### 👥 **Team 시트**

```
구분 | 항목 | 한국어 | 영어 | 사진URL
섹션제목 | 제목 | 우리 팀 | Our Team | -
섹션설명 | 설명 | 귀사의 성공을... | Expert professionals... | -
멤버1 | 직급 | CEO/창립자 | CEO/Founder | -
멤버1 | 역할 | 전략적 리더십 및... | Strategic leadership... | -
멤버2 | 직급 | 리드 개발자 | Lead Developer | -
멤버2 | 역할 | 아키텍처 및... | Architecture... | -
...
```

---

### ⭐ **Testimonials 시트**

```
구분 | 항목 | 한국어 | 영어 | 평점
섹션제목 | 제목 | 고객 성공 사례 | Client Success Stories | -
섹션설명 | 설명 | 파트너들의 평가 | What our partners... | -
후기1 | 이름 | 존 스미스 | John Smith | 5
후기1 | 회사 | CTO, TechCorp | CTO, TechCorp | -
후기1 | 내용 | PARAPIA는 우리의... | PARAPIA transformed... | -
후기2 | 이름 | 사라 밀러 | Sarah Miller | 5
...
```

---

### 📞 **Contact 시트**

```
섹션 | 항목 | 한국어 | 영어
제목 | 메인제목 | 함께 일해요 | Let's Work Together
제목 | 부제목 | 비즈니스를 변화시킬... | Ready to transform...
폼필드 | 이름 | 이름 | Your Name
폼필드 | 이메일 | 이메일 | Your Email
폼필드 | 제목 | 제목 | Subject
폼필드 | 메시지 | 메시지 | Your Message
폼버튼 | 전송 | 메시지 전송 | Send Message
정보 | 전화라벨 | 📞 전화 | 📞 Phone
정보 | 전화번호 | 010-3686-2785 | 010-3686-2785
정보 | 이메일라벨 | 📧 이메일 | 📧 Email
정보 | 이메일주소 | parapia.syd@gmail.com | parapia.syd@gmail.com
정보 | 주소라벨 | 🏢 주소 | 🏢 Address
정보 | 주소 | 경기도 성남시 수정구... | 331 Sansungdae-ro...
```

---

## ✅ 시트 생성 체크리스트

- [ ] Structure 시트 생성 및 데이터 입력
- [ ] Home 시트 생성 및 데이터 입력
- [ ] Services 시트 생성 및 데이터 입력
- [ ] Portfolio 시트 생성 및 데이터 입력
- [ ] Team 시트 생성 및 데이터 입력
- [ ] Testimonials 시트 생성 및 데이터 입력
- [ ] Contact 시트 생성 및 데이터 입력
- [ ] 모든 시트 공유 설정 완료
- [ ] API 키 & Spreadsheet ID 복사
- [ ] setup-sheets.html에서 설정 입력

---

## 🎯 장점

✅ **명확한 구조** - 각 섹션별로 시트 분리  
✅ **관리 용이** - 특정 섹션만 수정 가능  
✅ **확장 가능** - 카드/항목 추가 시 행만 추가하면 됨  
✅ **협업** - 여러 팀이 각 시트에서 동시 작업  
✅ **버전 관리** - 구글 시트의 버전 관리 기능 활용  

---

## 📝 작성 팁

1. **한글 인코딩**: UTF-8로 저장되므로 한글 완벽 지원
2. **특수문자**: 기호(📞, 🏢 등)도 그대로 사용 가능
3. **링크**: URL은 그대로 입력 (자동 링크 변환 가능)
4. **이미지**: 이미지는 URL로 입력 (구글 드라이브 공유 링크 사용)
5. **순서**: 시트에서의 행 순서가 홈페이지에 표시되는 순서

---

## 🚀 다음 단계

1. 모든 시트 생성 완료
2. `/setup-sheets.html`에서 API 키 & ID 입력
3. `/manager.html`에서 "데이터 새로고침" 클릭
4. 홈페이지 새로고침하여 반영 확인
