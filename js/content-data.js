/* ==========================================
   Content Data Structure
   분류된 홈페이지 콘텐츠 데이터
   ========================================== */

const contentData = {
  "홈": {
    "배지": [
      { key: "hero_badge", ko: "디지털 혁신", en: "Digital Transformation" }
    ],
    "메인타이틀": [
      { key: "hero_title", ko: "비즈니스를 스마트 소프트웨어로", en: "Transform Your Business with" },
      { key: "hero_title_highlight", ko: "변화시키세요", en: "Smart Software" }
    ],
    "서브타이틀": [
      { key: "hero_description", ko: "20년 이상의 경험으로 비즈니스 성장을 주도하는 혁신적인 소프트웨어 솔루션을 제공합니다.", en: "20+ years of expertise in delivering innovative software solutions that drive business growth and digital transformation." }
    ],
    "버튼": [
      { key: "hero_btn1", ko: "프로젝트 시작하기", en: "Start Your Project" },
      { key: "hero_btn2", ko: "포트폴리오 보기", en: "View Our Work" }
    ]
  },

  "서비스": {
    "섹션정보": [
      { key: "services_title", ko: "우리의 서비스", en: "Our Services" },
      { key: "services_desc", ko: "맞춤형 소프트웨어 솔루션", en: "Comprehensive software solutions tailored to your needs" }
    ],
    "카드": [
      {
        num: 1,
        title: { key: "service_1_title", ko: "웹 개발", en: "Web Development" },
        desc: { key: "service_1_desc", ko: "최신 기술로 만든 모던하고 반응형 웹 애플리케이션", en: "Modern, responsive web applications built with cutting-edge technologies" }
      },
      {
        num: 2,
        title: { key: "service_2_title", ko: "모바일 앱", en: "Mobile Apps" },
        desc: { key: "service_2_desc", ko: "iOS와 Android용 네이티브 및 크로스플랫폼 솔루션", en: "Native and cross-platform mobile solutions for iOS and Android" }
      },
      {
        num: 3,
        title: { key: "service_3_title", ko: "데이터 분석", en: "Data Analytics" },
        desc: { key: "service_3_desc", ko: "비즈니스 의사결정을 주도하는 고급 분석 및 인사이트", en: "Advanced analytics and insights to drive informed business decisions" }
      },
      {
        num: 4,
        title: { key: "service_4_title", ko: "보안 솔루션", en: "Security Solutions" },
        desc: { key: "service_4_desc", ko: "귀중한 디지털 자산을 보호하는 엔터프라이즈급 보안", en: "Enterprise-grade security to protect your valuable digital assets" }
      },
      {
        num: 5,
        title: { key: "service_5_title", ko: "DevOps & 클라우드", en: "DevOps & Cloud" },
        desc: { key: "service_5_desc", ko: "확장 가능한 클라우드 인프라와 지속적 배포 솔루션", en: "Scalable cloud infrastructure and continuous deployment solutions" }
      },
      {
        num: 6,
        title: { key: "service_6_title", ko: "AI 솔루션", en: "AI Solutions" },
        desc: { key: "service_6_desc", ko: "지능형 자동화를 위한 머신러닝과 AI 통합", en: "Machine learning and AI integration for intelligent automation" }
      }
    ]
  },

  "포트폴리오": {
    "섹션정보": [
      { key: "portfolio_title", ko: "최근 프로젝트", en: "Recent Projects" },
      { key: "portfolio_desc", ko: "혁신적인 솔루션 소개", en: "Showcasing our latest innovative solutions" }
    ],
    "카드": [
      {
        num: 1,
        title: { key: "port_1_title", ko: "전자상거래 플랫폼", en: "E-Commerce Platform" },
        desc: { key: "port_1_desc", ko: "AI 기반 추천 기능이 있는 풀스택 마켓플레이스 솔루션", en: "Full-stack marketplace solution with AI-powered recommendations" },
        tech: { key: "port_1_tech", ko: "React • Node.js • MongoDB", en: "React • Node.js • MongoDB" }
      },
      {
        num: 2,
        title: { key: "port_2_title", ko: "모바일 뱅킹 앱", en: "Mobile Banking App" },
        desc: { key: "port_2_desc", ko: "실시간 거래 기능이 있는 안전한 핀테크 솔루션", en: "Secure fintech solution with real-time transactions" },
        tech: { key: "port_2_tech", ko: "Flutter • Firebase • Blockchain", en: "Flutter • Firebase • Blockchain" }
      },
      {
        num: 3,
        title: { key: "port_3_title", ko: "분석 대시보드", en: "Analytics Dashboard" },
        desc: { key: "port_3_desc", ko: "고급 시각화를 갖춘 실시간 비즈니스 인텔리전스 플랫폼", en: "Real-time business intelligence platform with advanced visualizations" },
        tech: { key: "port_3_tech", ko: "Vue.js • Python • PostgreSQL", en: "Vue.js • Python • PostgreSQL" }
      },
      {
        num: 4,
        title: { key: "port_4_title", ko: "IoT 관리 시스템", en: "IoT Management System" },
        desc: { key: "port_4_desc", ko: "연결 기기 관리 및 모니터링 엔터프라이즈 솔루션", en: "Enterprise solution for connected device management and monitoring" },
        tech: { key: "port_4_tech", ko: "Next.js • AWS IoT • TypeScript", en: "Next.js • AWS IoT • TypeScript" }
      }
    ]
  },

  "팀": {
    "섹션정보": [
      { key: "team_title", ko: "우리 팀", en: "Our Team" },
      { key: "team_desc", ko: "귀사의 성공을 위해 헌신하는 전문가들", en: "Expert professionals dedicated to your success" }
    ],
    "멤버": [
      {
        num: 1,
        name: { key: "team_1_name", ko: "CEO/창립자", en: "CEO/Founder" },
        desc: { key: "team_1_desc", ko: "전략적 리더십 및 사업 개발", en: "Strategic leadership & business development" }
      },
      {
        num: 2,
        name: { key: "team_2_name", ko: "리드 개발자", en: "Lead Developer" },
        desc: { key: "team_2_desc", ko: "아키텍처 및 기술 우수성", en: "Architecture & technical excellence" }
      },
      {
        num: 3,
        name: { key: "team_3_name", ko: "디자인 리드", en: "Design Lead" },
        desc: { key: "team_3_desc", ko: "UI/UX 및 브랜드 혁신", en: "UI/UX & brand innovation" }
      },
      {
        num: 4,
        name: { key: "team_4_name", ko: "DevOps 엔지니어", en: "DevOps Engineer" },
        desc: { key: "team_4_desc", ko: "인프라 및 배포", en: "Infrastructure & deployment" }
      }
    ]
  },

  "고객후기": {
    "섹션정보": [
      { key: "testimonials_title", ko: "고객 성공 사례", en: "Client Success Stories" },
      { key: "testimonials_desc", ko: "파트너들의 평가", en: "What our partners say about us" }
    ],
    "후기": [
      {
        num: 1,
        name: { key: "test_1_name", ko: "존 스미스", en: "John Smith" },
        company: { key: "test_1_company", ko: "CTO, TechCorp", en: "CTO, TechCorp" },
        text: { key: "test_1_text", ko: "PARAPIA는 우리의 디지털 인프라를 혁신했습니다. 그들의 전문성과 헌신은 모든 기대를 초과했습니다.", en: "PARAPIA transformed our digital infrastructure. Their expertise and dedication exceeded all expectations." }
      },
      {
        num: 2,
        name: { key: "test_2_name", ko: "사라 밀러", en: "Sarah Miller" },
        company: { key: "test_2_company", ko: "CEO, Innovation Labs", en: "CEO, Innovation Labs" },
        text: { key: "test_2_text", ko: "뛰어난 서비스와 지원. 프로젝트를 예정된 시간 내에 예산 내에서 완료했습니다.", en: "Outstanding service and support. They delivered our project on time and stayed well within budget." }
      },
      {
        num: 3,
        name: { key: "test_3_name", ko: "마이클 김", en: "Michael Kim" },
        company: { key: "test_3_company", ko: "제품 관리자, StartupX", en: "Product Manager, StartupX" },
        text: { key: "test_3_text", ko: "팀의 기술 전문성과 비즈니스 감각이 우리의 성공을 이끌었습니다.", en: "The team's technical expertise and business acumen made all the difference for our success." }
      }
    ]
  },

  "연락처": {
    "섹션정보": [
      { key: "contact_title", ko: "함께 일해요", en: "Let's Work Together" },
      { key: "contact_desc", ko: "비즈니스를 변화시킬 준비가 되었나요? 오늘 연락해주세요.", en: "Ready to transform your business? Get in touch with us today." }
    ],
    "폼필드": [
      { key: "contact_name", ko: "이름", en: "Your Name" },
      { key: "contact_email", ko: "이메일", en: "Your Email" },
      { key: "contact_subject", ko: "제목", en: "Subject" },
      { key: "contact_message", ko: "메시지", en: "Your Message" },
      { key: "contact_send", ko: "메시지 전송", en: "Send Message" }
    ],
    "정보": [
      { key: "contact_phone_label", ko: "📞 전화", en: "📞 Phone" },
      { key: "contact_phone", ko: "010-3686-2785", en: "010-3686-2785" },
      { key: "contact_email_label", ko: "📧 이메일", en: "📧 Email" },
      { key: "contact_email_addr", ko: "parapia.syd@gmail.com", en: "parapia.syd@gmail.com" },
      { key: "contact_address_label", ko: "🏢 주소", en: "🏢 Address" },
      { key: "contact_address", ko: "경기도 성남시 수정구 산성대로 331, 17층 1716호", en: "331 Sansungdae-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, 17F 1716" }
    ]
  }
};
