/* ==========================================
   Language Detection & Switching
   ========================================== */

const translations = {
    ko: {
        services: "서비스",
        portfolio: "포트폴리오",
        team: "팀",
        testimonials: "고객 후기",
        nav_faq: "자주 묻는 질문",
        contact: "연락처",

        hero_badge: "디지털 혁신",
        hero_title: "비즈니스를 스마트 소프트웨어로",
        hero_title_highlight: "변화시키세요",
        hero_description: "20년 이상의 경험으로 비즈니스 성장을 주도하는 혁신적인 소프트웨어 솔루션을 제공합니다.",
        hero_btn1: "프로젝트 시작하기",
        hero_btn2: "포트폴리오 보기",

        services_title: "우리의 서비스",
        services_desc: "맞춤형 소프트웨어 솔루션",
        service1_title: "웹 개발",
        service1_desc: "최신 기술로 만든 모던하고 반응형 웹 애플리케이션",
        service2_title: "모바일 앱",
        service2_desc: "iOS와 Android용 네이티브 및 크로스플랫폼 솔루션",
        service3_title: "데이터 분석",
        service3_desc: "비즈니스 의사결정을 주도하는 고급 분석 및 인사이트",
        service4_title: "보안 솔루션",
        service4_desc: "귀중한 디지털 자산을 보호하는 엔터프라이즈급 보안",
        service5_title: "DevOps & 클라우드",
        service5_desc: "확장 가능한 클라우드 인프라와 지속적 배포 솔루션",
        service6_title: "AI 솔루션",
        service6_desc: "지능형 자동화를 위한 머신러닝과 AI 통합",

        portfolio_title: "최근 프로젝트",
        portfolio_desc: "혁신적인 솔루션 소개",
        port1_title: "전자상거래 플랫폼",
        port1_desc: "AI 기반 추천 기능이 있는 풀스택 마켓플레이스 솔루션",
        port2_title: "모바일 뱅킹 앱",
        port2_desc: "실시간 거래 기능이 있는 안전한 핀테크 솔루션",
        port3_title: "분석 대시보드",
        port3_desc: "고급 시각화를 갖춘 실시간 비즈니스 인텔리전스 플랫폼",
        port4_title: "IoT 관리 시스템",
        port4_desc: "연결 기기 관리 및 모니터링 엔터프라이즈 솔루션",

        team_title: "우리 팀",
        team_desc: "귀사의 성공을 위해 헌신하는 전문가들",
        team1: "CEO/창립자",
        team1_desc: "전략적 리더십 및 사업 개발",
        team2: "리드 개발자",
        team2_desc: "아키텍처 및 기술 우수성",
        team3: "디자인 리드",
        team3_desc: "UI/UX 및 브랜드 혁신",
        team4: "DevOps 엔지니어",
        team4_desc: "인프라 및 배포",

        testimonials_title: "고객 성공 사례",
        testimonials_desc: "파트너들의 평가",
        test1_name: "존 스미스",
        test1_company: "CTO, TechCorp",
        test1_text: "PARAPIA는 우리의 디지털 인프라를 혁신했습니다. 그들의 전문성과 헌신은 모든 기대를 초과했습니다.",
        test2_name: "사라 밀러",
        test2_company: "CEO, Innovation Labs",
        test2_text: "뛰어난 서비스와 지원. 프로젝트를 예정된 시간 내에 예산 내에서 완료했습니다.",
        test3_name: "마이클 김",
        test3_company: "제품 관리자, StartupX",
        test3_text: "팀의 기술 전문성과 비즈니스 감각이 우리의 성공을 이끌었습니다.",

        // 서비스 아이콘 (이모지)
        service1_icon: "📱", service2_icon: "⚡", service3_icon: "📊",
        service4_icon: "🔒", service5_icon: "☁️", service6_icon: "🤖",

        // 포트폴리오 기술 스택
        port1_tech: "React • Node.js • MongoDB",
        port2_tech: "Flutter • Firebase • Blockchain",
        port3_tech: "Vue.js • Python • PostgreSQL",
        port4_tech: "Next.js • AWS IoT • TypeScript",

        // 후기 아바타(이니셜) + 별점
        test1_avatar: "JS", test2_avatar: "SM", test3_avatar: "MK",
        test1_stars: "⭐⭐⭐⭐⭐", test2_stars: "⭐⭐⭐⭐⭐", test3_stars: "⭐⭐⭐⭐⭐",

        // 브랜드 스트립
        brand_eyebrow: "이미 많은 기업이 PARAPIA와 함께합니다",
        brand1: "Spotify", brand2: "Zoom", brand3: "Slack",
        brand4: "Amazon", brand5: "Adobe", brand6: "Notion",

        // Why Choose Us
        why_title: "왜 PARAPIA인가",
        why_desc: "우리가 다른 이유",
        why1_title: "혁신",
        why1_desc: "AI·블록체인·데이터로 한계를 넘어 첨단 솔루션을 만듭니다.",
        why2_title: "협업",
        why2_desc: "고객과 긴밀히 협력해 측정 가능한 성과를 만드는 맞춤 솔루션을 제공합니다.",
        why3_title: "우수성",
        why3_desc: "코드 품질·시스템 성능·고객 성과에서 최고 기준을 유지합니다.",
        why4_title: "신뢰",
        why4_desc: "모든 결정에서 투명성과 윤리를 최우선으로 합니다.",

        // FAQ
        faq_title: "자주 묻는 질문",
        faq_desc: "궁금한 점을 모았습니다",
        faq1_q: "PARAPIA는 어떤 서비스를 제공하나요?",
        faq1_a: "웹·모바일 개발, 데이터 분석, 보안, 클라우드/DevOps, AI 솔루션 등 비즈니스에 필요한 소프트웨어 전반을 제공합니다.",
        faq2_q: "프로젝트 기간은 보통 얼마나 걸리나요?",
        faq2_a: "범위에 따라 다르지만 보통 4~12주이며, 착수 전 상세 일정을 함께 정합니다.",
        faq3_q: "출시 후 유지보수도 지원하나요?",
        faq3_a: "네, 출시 후 유지보수·모니터링·지속 개선 지원 플랜을 제공합니다.",
        faq4_q: "견적은 어떻게 받나요?",
        faq4_a: "하단 문의 양식이나 이메일로 연락 주시면 무료 상담 후 맞춤 견적을 드립니다.",
        faq5_q: "어떤 기술 스택을 사용하나요?",
        faq5_a: "React, Node.js, Flutter, Python, AWS 등 프로젝트에 가장 적합한 최신 기술을 사용합니다.",

        contact_title: "함께 일해요",
        contact_desc: "비즈니스를 변화시킬 준비가 되었나요? 오늘 연락해주세요.",
        contact_name: "이름",
        contact_email: "이메일",
        contact_subject: "제목",
        contact_message: "메시지",
        contact_send: "메시지 전송",
        contact_phone: "📞 전화",
        contact_phone_value: "010-3686-2785",
        contact_email_label: "📧 이메일",
        contact_email_value: "parapia.syd@gmail.com",
        contact_address: "🏢 주소",
        contact_address_value: "경기도 성남시 수정구 산성대로 331, 17층 1716호",
        contact_success: "메시지 전송됨! ✓",

        footer_desc: "혁신적인 소프트웨어 솔루션으로 디지털 혁신을 선도합니다.",
        footer_services: "서비스",
        footer_service1: "웹 개발",
        footer_service2: "모바일 앱",
        footer_service3: "클라우드 솔루션",
        footer_contact: "연락처",
        footer_phone: "010-3686-2785",
        footer_email: "parapia.syd@gmail.com",
        footer_message: "메시지 보내기",
        footer_follow: "팔로우하기",
        footer_social1: "LinkedIn",
        footer_social2: "GitHub",
        footer_social3: "Twitter",
        footer_rights: "© 2005-2026 PARAPIA. 모든 권리 보유.",
        footer_privacy: "개인정보 보호정책",
        footer_terms: "서비스 약관",
    },
    en: {
        services: "Services",
        portfolio: "Portfolio",
        team: "Team",
        testimonials: "Testimonials",
        nav_faq: "FAQ",
        contact: "Contact",

        hero_badge: "Digital Transformation",
        hero_title: "Transform Your Business with",
        hero_title_highlight: "Smart Software",
        hero_description: "20+ years of expertise in delivering innovative software solutions that drive business growth and digital transformation.",
        hero_btn1: "Start Your Project",
        hero_btn2: "View Our Work",

        services_title: "Our Services",
        services_desc: "Comprehensive software solutions tailored to your needs",
        service1_title: "Web Development",
        service1_desc: "Modern, responsive web applications built with cutting-edge technologies",
        service2_title: "Mobile Apps",
        service2_desc: "Native and cross-platform mobile solutions for iOS and Android",
        service3_title: "Data Analytics",
        service3_desc: "Advanced analytics and insights to drive informed business decisions",
        service4_title: "Security Solutions",
        service4_desc: "Enterprise-grade security to protect your valuable digital assets",
        service5_title: "DevOps & Cloud",
        service5_desc: "Scalable cloud infrastructure and continuous deployment solutions",
        service6_title: "AI Solutions",
        service6_desc: "Machine learning and AI integration for intelligent automation",

        portfolio_title: "Recent Projects",
        portfolio_desc: "Showcasing our latest innovative solutions",
        port1_title: "E-Commerce Platform",
        port1_desc: "Full-stack marketplace solution with AI-powered recommendations",
        port2_title: "Mobile Banking App",
        port2_desc: "Secure fintech solution with real-time transactions",
        port3_title: "Analytics Dashboard",
        port3_desc: "Real-time business intelligence platform with advanced visualizations",
        port4_title: "IoT Management System",
        port4_desc: "Enterprise solution for connected device management and monitoring",

        team_title: "Our Team",
        team_desc: "Expert professionals dedicated to your success",
        team1: "CEO/Founder",
        team1_desc: "Strategic leadership & business development",
        team2: "Lead Developer",
        team2_desc: "Architecture & technical excellence",
        team3: "Design Lead",
        team3_desc: "UI/UX & brand innovation",
        team4: "DevOps Engineer",
        team4_desc: "Infrastructure & deployment",

        testimonials_title: "Client Success Stories",
        testimonials_desc: "What our partners say about us",
        test1_name: "John Smith",
        test1_company: "CTO, TechCorp",
        test1_text: "PARAPIA transformed our digital infrastructure. Their expertise and dedication exceeded all expectations.",
        test2_name: "Sarah Miller",
        test2_company: "CEO, Innovation Labs",
        test2_text: "Outstanding service and support. They delivered our project on time and stayed well within budget.",
        test3_name: "Michael Kim",
        test3_company: "Product Manager, StartupX",
        test3_text: "The team's technical expertise and business acumen made all the difference for our success.",

        // Service icons (emoji)
        service1_icon: "📱", service2_icon: "⚡", service3_icon: "📊",
        service4_icon: "🔒", service5_icon: "☁️", service6_icon: "🤖",

        // Portfolio tech stacks
        port1_tech: "React • Node.js • MongoDB",
        port2_tech: "Flutter • Firebase • Blockchain",
        port3_tech: "Vue.js • Python • PostgreSQL",
        port4_tech: "Next.js • AWS IoT • TypeScript",

        // Testimonial avatars (initials) + stars
        test1_avatar: "JS", test2_avatar: "SM", test3_avatar: "MK",
        test1_stars: "⭐⭐⭐⭐⭐", test2_stars: "⭐⭐⭐⭐⭐", test3_stars: "⭐⭐⭐⭐⭐",

        // Brand strip
        brand_eyebrow: "Trusted by teams at leading companies",
        brand1: "Spotify", brand2: "Zoom", brand3: "Slack",
        brand4: "Amazon", brand5: "Adobe", brand6: "Notion",

        // Why Choose Us
        why_title: "Why Choose Us",
        why_desc: "What sets us apart",
        why1_title: "Innovation",
        why1_desc: "Pushing boundaries with AI, blockchain, and data to deliver cutting-edge solutions.",
        why2_title: "Collaboration",
        why2_desc: "Working closely with clients to build tailored solutions that drive measurable success.",
        why3_title: "Excellence",
        why3_desc: "Maintaining the highest standards in code quality, system performance, and client outcomes.",
        why4_title: "Integrity",
        why4_desc: "Operating with transparency and ethical considerations at the forefront of all decisions.",

        // FAQ
        faq_title: "Frequently Asked Questions",
        faq_desc: "Everything you need to know",
        faq1_q: "What services does PARAPIA provide?",
        faq1_a: "We provide web and mobile development, data analytics, security, cloud/DevOps, and AI solutions — the full range of software your business needs.",
        faq2_q: "How long does a typical project take?",
        faq2_a: "It depends on scope, but most projects take 4–12 weeks. We define a detailed timeline together before kickoff.",
        faq3_q: "Do you offer ongoing maintenance?",
        faq3_a: "Yes. We offer post-launch maintenance, monitoring, and continuous improvement plans.",
        faq4_q: "How do I get a quote?",
        faq4_a: "Reach out via the contact form below or email us. We'll provide a free consultation and a tailored quote.",
        faq5_q: "What technologies do you work with?",
        faq5_a: "React, Node.js, Flutter, Python, AWS and more — we pick the best modern stack for each project.",

        contact_title: "Let's Work Together",
        contact_desc: "Ready to transform your business? Get in touch with us today.",
        contact_name: "Your Name",
        contact_email: "Your Email",
        contact_subject: "Subject",
        contact_message: "Your Message",
        contact_send: "Send Message",
        contact_phone: "📞 Phone",
        contact_phone_value: "010-3686-2785",
        contact_email_label: "📧 Email",
        contact_email_value: "parapia.syd@gmail.com",
        contact_address: "🏢 Address",
        contact_address_value: "331 Sansungdae-ro, Sujeong-gu, Seongnam-si, Gyeonggi-do, 17F 1716",
        contact_success: "Message Sent! ✓",

        footer_desc: "Leading digital transformation through innovative software solutions.",
        footer_services: "Services",
        footer_service1: "Web Development",
        footer_service2: "Mobile Apps",
        footer_service3: "Cloud Solutions",
        footer_contact: "Contact",
        footer_phone: "010-3686-2785",
        footer_email: "parapia.syd@gmail.com",
        footer_message: "Message Us",
        footer_follow: "Follow Us",
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
        console.log('🌐 URL에서 감지된 언어:', urlLang);
        setLanguage(urlLang);
        return;
    }

    // 2. 로컬 스토리지에서 저장된 언어 확인
    const savedLang = localStorage.getItem('parapia_language');
    if (savedLang) {
        console.log('💾 저장된 언어:', savedLang);
        setLanguage(savedLang);
        return;
    }

    // 3. 브라우저 언어 사용
    const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
    console.log('🌐 브라우저 언어:', browserLang);
    setLanguage(browserLang);
}

// 언어 설정
function setLanguage(lang) {
    localStorage.setItem('parapia_language', lang);
    currentLanguage = lang;
    applyTranslations();
}

// 번역 적용 - data-i18n 속성 하나로 모든 텍스트를 일괄 처리
// HTML에는 data-i18n="키" 만 붙이면 되고, 값은 시트(또는 기본값)에서 채워짐.
function applyTranslations() {
    const t = translations[currentLanguage];
    if (!t) {
        console.error('❌ 번역 객체가 없습니다!', currentLanguage);
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
            Object.assign(translations.ko, parsed.ko);
            Object.assign(translations.en, parsed.en);
            console.log('✅ 커스텀 번역 데이터 로드됨');
        } catch (error) {
            console.error('커스텀 번역 데이터 로드 오류:', error);
        }
    }
}

// 캐시된 구글 시트 데이터를 즉시(동기) 적용 - 깜빡임 방지의 핵심
// 네트워크를 기다리지 않고, 직전에 받아둔 시트값을 첫 화면부터 채운다.
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
        console.log('✅ 캐시된 시트 데이터 즉시 적용됨 (깜빡임 없음)');
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
    // 3. 언어 감지 후 화면에 첫 렌더링 (이미 시트값이 채워진 상태)
    detectLanguage();
});
