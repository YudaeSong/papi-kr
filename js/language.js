/* ==========================================
   Language Detection & Switching
   PARAPIA — AI Software Engineering Studio
   ========================================== */

const translations = {
    ko: {
        // Navigation
        nav_studio: "스튜디오",
        services: "서비스",
        nav_process: "프로세스",
        portfolio: "포트폴리오",
        nav_faq: "FAQ",
        contact: "연락처",
        nav_cta: "프로젝트 시작",

        // Hero
        hero_badge: "AI Engineering Studio",
        hero_head1: "Engineering Tomorrow's",
        hero_head2: "Software with Intelligence.",
        hero_description: "맞춤형 AI 소프트웨어, 멀티 에이전트 워크플로우, 확장 가능한 시스템을 구축해 당신의 비전을 시장을 정의하는 기술로 만듭니다.",
        hero_btn1: "AI 여정 시작하기",
        hero_btn2: "역량 매트릭스 보기",
        hero_stat1_num: "20+",
        hero_stat1_label: "엔지니어링 경력",
        hero_stat2_num: "120+",
        hero_stat2_label: "출시한 시스템",
        hero_stat3_num: "40+",
        hero_stat3_label: "운영 중인 AI 모델",
        hero_scroll: "SCROLL",

        // Brand strip
        brand_eyebrow: "선도적인 팀들이 PARAPIA와 함께합니다",
        brand1: "Spotify", brand2: "Zoom", brand3: "Slack",
        brand4: "Amazon", brand5: "Adobe", brand6: "Notion",

        // Philosophy
        phil_label: "Partnership",
        phil_title: "우리의 철학",
        phil_statement: "당신의 전략적 AI 공동창업자.",
        phil_desc: "우리는 코드를 납품하는 외주사가 아닙니다. 제품의 성공을 함께 설계하고, 함께 만들고, 함께 책임지는 엔지니어링 파트너입니다.",
        phil1_title: "외주가 아닌, 공동 창업",
        phil1_desc: "요구사항을 받아 적는 대신 목표부터 함께 정의합니다. 아이디어 검증부터 출시, 스케일링까지 제품의 전 여정을 함께합니다.",
        phil2_title: "시니어 엔지니어링",
        phil2_desc: "20년 이상의 시스템 설계 경험을 가진 시니어 엔지니어가 직접 설계하고 리뷰합니다. 타협 없는 코드 품질이 기본값입니다.",
        phil3_title: "결과에 대한 책임",
        phil3_desc: "만드는 것으로 끝내지 않습니다. 측정 가능한 비즈니스 성과가 나올 때까지 개선하고 책임집니다.",

        // Services
        services_label: "Capability Matrix",
        services_title: "핵심 역량",
        services_desc: "전략부터 배포까지, AI 시대의 소프트웨어에 필요한 전 스택을 다룹니다.",
        svc1_title: "맞춤형 LLM 통합",
        svc1_desc: "GPT·Claude·오픈 모델을 당신의 데이터에 맞게. RAG 파이프라인, 파인튜닝, 프롬프트 엔지니어링까지 프로덕션급으로.",
        svc2_title: "자율 AI 에이전트",
        svc2_desc: "스스로 계획하고 도구를 사용해 일하는 멀티 에이전트 워크플로우. 반복 업무를 자율 실행 시스템으로 전환합니다.",
        svc3_title: "엔터프라이즈 풀스택 시스템",
        svc3_desc: "수백만 사용자를 견디는 웹·모바일 플랫폼. 확장성과 보안을 처음부터 설계에 녹인 아키텍처.",
        svc4_title: "예측 분석 엔진",
        svc4_desc: "데이터가 미래를 말하게 합니다. 수요 예측, 이상 탐지, 실시간 인사이트를 의사결정에 직결되는 형태로.",

        // Process
        proc_label: "Process",
        proc_title: "비전에서 프로덕션까지",
        proc_desc: "4단계 협업 여정. 모든 단계는 투명하게 공유되고, 당신의 피드백이 즉시 반영됩니다.",
        proc1_title: "디스커버리 & AI 매핑",
        proc1_desc: "비즈니스 목표를 깊이 이해하고, AI가 가장 큰 임팩트를 낼 지점을 데이터와 함께 찾아냅니다.",
        proc1_time: "1–2주",
        proc2_title: "아키텍처 & 프로토타이핑",
        proc2_desc: "확장 가능한 시스템 설계와 동작하는 프로토타입으로 방향을 빠르게 검증합니다.",
        proc2_time: "3–5주",
        proc3_title: "멀티 에이전트 개발",
        proc3_desc: "시니어 엔지니어와 AI 에이전트가 협업해 속도와 품질을 동시에 잡으며 본격 개발합니다.",
        proc3_time: "6–11주",
        proc4_title: "지속적 스케일링",
        proc4_desc: "출시 후에도 모니터링, 모델 개선, 인프라 확장을 계속합니다. 성장은 멈추지 않습니다.",
        proc4_time: "지속",

        // Work
        work_label: "Selected Work",
        portfolio_title: "주요 프로젝트",
        portfolio_desc: "아이디어가 시장을 바꾼 기술이 되기까지 — 최근 사례들입니다.",
        work1_title: "물류 AI 코파일럿",
        work1_desc: "수요 예측과 경로 최적화를 자율 수행하는 물류 운영 코파일럿. 배송 비용 23% 절감.",
        work1_tag1: "LLM", work1_tag2: "Forecasting",
        work2_title: "핀테크 에이전트 플랫폼",
        work2_desc: "컴플라이언스 검토와 리포트 생성을 자동화하는 멀티 에이전트 시스템.",
        work2_tag1: "Multi-agent", work2_tag2: "Fintech",
        work3_title: "의료 영상 진단 AI",
        work3_desc: "의료 영상을 실시간 분석해 판독을 보조하는 진단 엔진. 정확도 97.2% 달성.",
        work3_tag1: "Vision AI", work3_tag2: "Healthcare",
        work4_title: "리테일 수요 엔진",
        work4_desc: "SKU 단위 수요를 예측해 재고를 최적화하는 예측 분석 플랫폼.",
        work4_tag1: "Time-series", work4_tag2: "MLOps",

        // Testimonials
        testi_label: "Client Signals",
        testimonials_title: "파트너들의 이야기",
        testimonials_desc: "함께 만든 결과에 대한 평가입니다.",
        test1_name: "존 스미스",
        test1_company: "CTO, TechCorp",
        test1_text: "PARAPIA는 우리의 디지털 인프라를 완전히 바꿔놓았습니다. 그들의 전문성과 헌신은 모든 기대를 뛰어넘었습니다.",
        test2_name: "사라 밀러",
        test2_company: "CEO, Innovation Labs",
        test2_text: "뛰어난 서비스와 지원. 프로젝트를 예정된 시간 내에, 예산 안에서 완료했습니다.",
        test3_name: "마이클 김",
        test3_company: "제품 관리자, StartupX",
        test3_text: "팀의 기술 전문성과 비즈니스 감각이 우리의 성공을 이끌었습니다.",
        test1_avatar: "JS", test2_avatar: "SM", test3_avatar: "MK",
        test1_stars: "★★★★★", test2_stars: "★★★★★", test3_stars: "★★★★★",

        // FAQ
        faq_label: "FAQ",
        faq_title: "자주 묻는 질문",
        faq_desc: "궁금한 점을 모았습니다.",
        faq1_q: "PARAPIA는 어떤 서비스를 제공하나요?",
        faq1_a: "맞춤형 LLM 통합, 자율 AI 에이전트, 엔터프라이즈 풀스택 시스템, 예측 분석까지 — AI 시대의 소프트웨어 전 스택을 제공합니다.",
        faq2_q: "프로젝트 기간은 보통 얼마나 걸리나요?",
        faq2_a: "범위에 따라 다르지만 보통 4~12주이며, 착수 전 상세 일정을 함께 정합니다.",
        faq3_q: "출시 후 유지보수도 지원하나요?",
        faq3_a: "네, 출시 후 유지보수·모니터링·모델 개선·지속 스케일링 플랜을 제공합니다.",
        faq4_q: "견적은 어떻게 받나요?",
        faq4_a: "하단 문의 양식이나 이메일로 연락 주시면 무료 상담 후 맞춤 견적을 드립니다.",
        faq5_q: "어떤 기술 스택을 사용하나요?",
        faq5_a: "Python, TypeScript, React, Node.js, PyTorch, LangChain, AWS 등 프로젝트에 가장 적합한 최신 스택을 선택합니다.",

        // CTA
        cta_label: "Next Step",
        cta_title: "AI 퍼스트 미래를",
        cta_title2: "함께 만들 준비가 되셨나요?",
        cta_desc: "30분 무료 상담으로 당신의 아이디어가 어디까지 갈 수 있는지 확인하세요. 기술 검토와 로드맵 초안을 함께 드립니다.",
        cta_btn: "프로젝트 상담 시작하기",

        // Contact
        contact_label: "Contact",
        contact_title: "대화를 시작해요",
        contact_desc: "비전을 들려주세요. 24시간 이내에 답변드립니다.",
        contact_name: "이름",
        contact_email: "이메일",
        contact_subject: "제목",
        contact_message: "메시지",
        contact_name_ph: "홍길동",
        contact_email_ph: "you@company.com",
        contact_subject_ph: "AI 프로젝트 문의",
        contact_message_ph: "만들고 싶은 것을 자유롭게 들려주세요",
        contact_send: "메시지 전송",
        contact_sending: "전송 중...",
        contact_success: "✓ 전송되었습니다! 곧 회신 드리겠습니다.",
        contact_error: "전송 실패. 다시 시도해주세요.",
        contact_phone: "전화",
        contact_phone_value: "010-3686-2785",
        contact_email_label: "이메일",
        contact_email_value: "papi.syd@papi.kr",
        contact_address: "주소",
        contact_address_value: "경기도 성남시 수정구 산성대로 331, 17층 1716호",
        contact_note: "현재 신규 프로젝트 상담 가능",

        // Footer
        footer_desc: "지능으로 내일의 소프트웨어를 설계하는 AI 엔지니어링 스튜디오.",
        footer_services: "서비스",
        footer_service1: "맞춤형 LLM 통합",
        footer_service2: "자율 AI 에이전트",
        footer_service3: "풀스택 시스템",
        footer_service4: "예측 분석",
        footer_contact: "연락처",
        footer_phone: "010-3686-2785",
        footer_email: "papi.syd@papi.kr",
        footer_message: "메시지 보내기",
        footer_follow: "팔로우",
        footer_social1: "LinkedIn",
        footer_social2: "GitHub",
        footer_social3: "Twitter",
        footer_rights: "© 2005-2026 PARAPIA. 모든 권리 보유.",
        footer_privacy: "개인정보 보호정책",
        footer_terms: "서비스 약관",
    },

    en: {
        // Navigation
        nav_studio: "Studio",
        services: "Services",
        nav_process: "Process",
        portfolio: "Work",
        nav_faq: "FAQ",
        contact: "Contact",
        nav_cta: "Start a Project",

        // Hero
        hero_badge: "AI Engineering Studio",
        hero_head1: "Engineering Tomorrow's",
        hero_head2: "Software with Intelligence.",
        hero_description: "We build custom AI-powered software, multi-agent workflows, and scalable systems to transform your vision into market-defining technology.",
        hero_btn1: "Start Your AI Journey",
        hero_btn2: "Explore Capability Matrix",
        hero_stat1_num: "20+",
        hero_stat1_label: "Years Engineering",
        hero_stat2_num: "120+",
        hero_stat2_label: "Systems Shipped",
        hero_stat3_num: "40+",
        hero_stat3_label: "AI Models in Prod",
        hero_scroll: "SCROLL",

        // Brand strip
        brand_eyebrow: "Trusted by teams at leading companies",
        brand1: "Spotify", brand2: "Zoom", brand3: "Slack",
        brand4: "Amazon", brand5: "Adobe", brand6: "Notion",

        // Philosophy
        phil_label: "Partnership",
        phil_title: "Our Philosophy",
        phil_statement: "Your strategic AI co-founder.",
        phil_desc: "We are not an outsourcing vendor that ships code. We are an engineering partner that designs, builds, and owns product success together with you.",
        phil1_title: "Co-build, Not Outsource",
        phil1_desc: "Instead of taking orders, we define goals together — from idea validation to launch and scaling, we walk the entire product journey with you.",
        phil2_title: "Senior Engineering Only",
        phil2_desc: "Systems are designed and reviewed by senior engineers with 20+ years of experience. Uncompromising code quality is the default.",
        phil3_title: "Outcome Ownership",
        phil3_desc: "We don't stop at shipping. We keep improving and take responsibility until measurable business outcomes arrive.",

        // Services
        services_label: "Capability Matrix",
        services_title: "Core Capabilities",
        services_desc: "From strategy to deployment — the full stack required for software in the AI era.",
        svc1_title: "Custom LLM Integration",
        svc1_desc: "GPT, Claude, and open-weight models tuned to your data. RAG pipelines, fine-tuning, and prompt engineering at production grade.",
        svc2_title: "Autonomous AI Agents",
        svc2_desc: "Multi-agent workflows that plan and use tools on their own. Turn repetitive operations into autonomous execution systems.",
        svc3_title: "Enterprise Full-Stack Systems",
        svc3_desc: "Web and mobile platforms that withstand millions of users — architecture with scalability and security baked in from day one.",
        svc4_title: "Predictive Analytics Engine",
        svc4_desc: "Let your data speak the future. Demand forecasting, anomaly detection, and real-time insights wired directly into decisions.",

        // Process
        proc_label: "Process",
        proc_title: "From Vision to Production",
        proc_desc: "A four-step collaborative journey. Every step is transparent, and your feedback lands immediately.",
        proc1_title: "Discovery & AI Mapping",
        proc1_desc: "We deeply understand your business goals and pinpoint — with data — where AI creates the most impact.",
        proc1_time: "Week 1–2",
        proc2_title: "Architecture & Prototyping",
        proc2_desc: "Scalable system design plus a working prototype to validate direction fast.",
        proc2_time: "Week 3–5",
        proc3_title: "Multi-agent Development",
        proc3_desc: "Senior engineers and AI agents build side by side, capturing speed and quality at once.",
        proc3_time: "Week 6–11",
        proc4_title: "Continuous Scaling",
        proc4_desc: "After launch: monitoring, model improvement, infrastructure expansion. Growth never stops.",
        proc4_time: "Ongoing",

        // Work
        work_label: "Selected Work",
        portfolio_title: "Selected Work",
        portfolio_desc: "Where ideas become market-defining technology — recent cases.",
        work1_title: "Logistics AI Copilot",
        work1_desc: "An operations copilot that autonomously forecasts demand and optimizes routes — cutting delivery costs by 23%.",
        work1_tag1: "LLM", work1_tag2: "Forecasting",
        work2_title: "Fintech Agent Platform",
        work2_desc: "A multi-agent system that automates compliance review and report generation.",
        work2_tag1: "Multi-agent", work2_tag2: "Fintech",
        work3_title: "MedVision Diagnostics",
        work3_desc: "A diagnostic engine that analyzes medical imaging in real time, reaching 97.2% accuracy.",
        work3_tag1: "Vision AI", work3_tag2: "Healthcare",
        work4_title: "Retail Demand Engine",
        work4_desc: "A predictive analytics platform forecasting SKU-level demand to optimize inventory.",
        work4_tag1: "Time-series", work4_tag2: "MLOps",

        // Testimonials
        testi_label: "Client Signals",
        testimonials_title: "What Partners Say",
        testimonials_desc: "On the outcomes we built together.",
        test1_name: "John Smith",
        test1_company: "CTO, TechCorp",
        test1_text: "PARAPIA transformed our digital infrastructure. Their expertise and dedication exceeded all expectations.",
        test2_name: "Sarah Miller",
        test2_company: "CEO, Innovation Labs",
        test2_text: "Outstanding service and support. They delivered our project on time and stayed well within budget.",
        test3_name: "Michael Kim",
        test3_company: "Product Manager, StartupX",
        test3_text: "The team's technical expertise and business acumen made all the difference for our success.",
        test1_avatar: "JS", test2_avatar: "SM", test3_avatar: "MK",
        test1_stars: "★★★★★", test2_stars: "★★★★★", test3_stars: "★★★★★",

        // FAQ
        faq_label: "FAQ",
        faq_title: "Frequently Asked Questions",
        faq_desc: "Everything you need to know.",
        faq1_q: "What services does PARAPIA provide?",
        faq1_a: "Custom LLM integration, autonomous AI agents, enterprise full-stack systems, and predictive analytics — the full stack for software in the AI era.",
        faq2_q: "How long does a typical project take?",
        faq2_a: "It depends on scope, but most projects take 4–12 weeks. We define a detailed timeline together before kickoff.",
        faq3_q: "Do you offer ongoing maintenance?",
        faq3_a: "Yes. We offer post-launch maintenance, monitoring, model improvement, and continuous scaling plans.",
        faq4_q: "How do I get a quote?",
        faq4_a: "Reach out via the contact form below or email us. We'll provide a free consultation and a tailored quote.",
        faq5_q: "What technologies do you work with?",
        faq5_a: "Python, TypeScript, React, Node.js, PyTorch, LangChain, AWS and more — we pick the best modern stack for each project.",

        // CTA
        cta_label: "Next Step",
        cta_title: "Ready to shape",
        cta_title2: "the AI-first future with us?",
        cta_desc: "Book a free 30-minute consultation to see how far your idea can go. We include a technical review and a draft roadmap.",
        cta_btn: "Start Project Consultation",

        // Contact
        contact_label: "Contact",
        contact_title: "Let's Start the Conversation",
        contact_desc: "Tell us your vision. We respond within 24 hours.",
        contact_name: "Name",
        contact_email: "Email",
        contact_subject: "Subject",
        contact_message: "Message",
        contact_name_ph: "Your name",
        contact_email_ph: "you@company.com",
        contact_subject_ph: "AI project inquiry",
        contact_message_ph: "Tell us what you want to build",
        contact_send: "Send Message",
        contact_sending: "Sending...",
        contact_success: "✓ Sent! We'll get back to you soon.",
        contact_error: "Failed to send. Please try again.",
        contact_phone: "Phone",
        contact_phone_value: "010-3686-2785",
        contact_email_label: "Email",
        contact_email_value: "papi.syd@papi.kr",
        contact_address: "Address",
        contact_address_value: "331 Sanseong-daero, Sujeong-gu, Seongnam-si, Gyeonggi-do, 17F 1716",
        contact_note: "Currently accepting new projects",

        // Footer
        footer_desc: "An AI engineering studio designing tomorrow's software with intelligence.",
        footer_services: "Services",
        footer_service1: "Custom LLM Integration",
        footer_service2: "Autonomous AI Agents",
        footer_service3: "Full-Stack Systems",
        footer_service4: "Predictive Analytics",
        footer_contact: "Contact",
        footer_phone: "010-3686-2785",
        footer_email: "papi.syd@papi.kr",
        footer_message: "Message Us",
        footer_follow: "Follow",
        footer_social1: "LinkedIn",
        footer_social2: "GitHub",
        footer_social3: "Twitter",
        footer_rights: "© 2005-2026 PARAPIA. All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service",
    }
};

// 사용자 언어 감지
function detectLanguage() {
    // 1. URL 파라미터에서 언어 확인 (최우선)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    if (urlLang && (urlLang === 'ko' || urlLang === 'en')) {
        setLanguage(urlLang);
        return;
    }

    // 2. 로컬 스토리지에서 저장된 언어 확인
    const savedLang = localStorage.getItem('parapia_language');
    if (savedLang) {
        setLanguage(savedLang);
        return;
    }

    // 3. 브라우저 언어 사용
    const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
    setLanguage(browserLang);
}

// 언어 설정
function setLanguage(lang) {
    localStorage.setItem('parapia_language', lang);
    currentLanguage = lang;
    document.documentElement.lang = lang;
    applyTranslations();
    document.dispatchEvent(new CustomEvent('parapia:language', { detail: { lang } }));
}

// 번역 적용 - data-i18n 속성 하나로 모든 텍스트를 일괄 처리
function applyTranslations() {
    const t = translations[currentLanguage];
    if (!t) {
        console.error('번역 객체가 없습니다:', currentLanguage);
        return;
    }

    // 1) 일반 텍스트: data-i18n="키"
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t[key];
        if (val !== undefined && val !== null && val !== '') {
            el.textContent = val;
        }
    });

    // 2) 입력칸 placeholder: data-i18n-placeholder="키"
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = t[key];
        if (val !== undefined && val !== null && val !== '') {
            el.placeholder = val;
        }
    });

    // 3) 링크 href: data-i18n-href="키" (전화/이메일 등)
    document.querySelectorAll('[data-i18n-href]').forEach(el => {
        const key = el.getAttribute('data-i18n-href');
        const val = t[key];
        if (val !== undefined && val !== null && val !== '') {
            el.setAttribute('href', val);
        }
    });
}

// 언어 전환 함수
function toggleLanguage() {
    const newLang = currentLanguage === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
}

// 현재 언어
let currentLanguage = 'en';

// 커스텀 번역 데이터 로드
function loadCustomTranslations() {
    const customData = localStorage.getItem('parapia_custom_translations');
    if (customData) {
        try {
            const parsed = JSON.parse(customData);
            // translations 객체 업데이트 (기존 데이터와 병합)
            if (parsed.ko) Object.assign(translations.ko, parsed.ko);
            if (parsed.en) Object.assign(translations.en, parsed.en);
        } catch (error) {
            console.error('커스텀 번역 데이터 로드 오류:', error);
        }
    }
}

// 캐시된 구글 시트 데이터를 즉시(동기) 적용 - 깜빡임 방지
function loadCachedSheetData() {
    const cached = localStorage.getItem('parapia_sheets_cache');
    if (!cached) return;
    try {
        const data = JSON.parse(cached);
        ['ko', 'en'].forEach(lang => {
            if (data[lang]) {
                for (const key in data[lang]) {
                    const val = data[lang][key];
                    // 빈 값은 덮어쓰지 않음 (다른 텍스트가 지워지는 것 방지)
                    if (val !== undefined && val !== null && val !== '') {
                        translations[lang][key] = val;
                    }
                }
            }
        });
    } catch (error) {
        console.error('시트 캐시 로드 오류:', error);
    }
}

// 페이지 로드 시 언어 감지
document.addEventListener('DOMContentLoaded', () => {
    // 1. 캐시된 시트 데이터 즉시 적용 (네트워크 대기 전, 깜빡임 방지)
    loadCachedSheetData();
    // 2. 커스텀 번역 로드
    loadCustomTranslations();
    // 3. 언어 감지 후 화면에 첫 렌더링
    detectLanguage();
});
