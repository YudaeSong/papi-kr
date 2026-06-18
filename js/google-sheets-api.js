/* ==========================================
   Google Sheets API Integration
   구글 스프레드시트 데이터 연동
   ========================================== */

// 구글 시트 설정 (사용자가 입력해야 함)
const googleSheetsConfig = {
    spreadsheetId: '', // 사용자가 입력할 Spreadsheet ID
    apiKey: '', // 사용자가 입력할 API Key
    sheetName: 'Content'
};

// 구글 시트에서 데이터 로드 (여러 시트 지원)
async function loadFromGoogleSheets() {
    if (!googleSheetsConfig.spreadsheetId || !googleSheetsConfig.apiKey) {
        console.warn('⚠️ 구글 시트 설정이 없습니다. localStorage에서 데이터를 로드합니다.');
        return loadFromLocalStorage();
    }

    try {
        // 모든 시트 목록 가져오기
        const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsConfig.spreadsheetId}?key=${googleSheetsConfig.apiKey}`;
        const metadataResponse = await fetch(metadataUrl);
        const metadataData = await metadataResponse.json();

        // 시트 이름 추출
        const sheetNames = metadataData.sheets.map(s => s.properties.title);

        // 각 시트에서 데이터 로드
        let allData = {};

        for (const sheetName of sheetNames) {
            if (sheetName === 'Structure') continue; // Structure는 스킵 (가이드용)

            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsConfig.spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${googleSheetsConfig.apiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.values) {
                    const sheetData = parseSheetData(sheetName, data.values);
                    allData[sheetName] = sheetData;
                    console.log(`✅ ${sheetName} 시트 로드됨`);
                }
            } catch (error) {
                console.warn(`⚠️ ${sheetName} 시트 로드 실패:`, error);
            }
        }

        // 파싱된 데이터를 contentData 형식으로 변환
        const contentData = convertMultiSheetToContent(allData);

        // localStorage에 캐시
        localStorage.setItem('parapia_sheets_cache', JSON.stringify(contentData));
        localStorage.setItem('parapia_sheets_updated', new Date().toLocaleString('ko-KR'));

        console.log('✅ 모든 구글 시트에서 데이터 로드됨');
        return contentData;
    } catch (error) {
        console.error('⚠️ 구글 시트 로드 실패:', error);
        return loadFromLocalStorage();
    }
}

// 각 시트의 데이터 파싱 (사이트맵 구조)
function parseSheetData(sheetName, values) {
    if (!values || values.length < 2) return {};

    const data = {};
    const headers = values[0];

    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const rowData = {};

        headers.forEach((header, idx) => {
            rowData[header.trim()] = row[idx] || '';
        });

        // 구분 기준으로 그룹화
        const category = (rowData['구분'] || rowData['섹션'] || '기타').trim();
        if (!data[category]) {
            data[category] = [];
        }
        data[category].push(rowData);
    }

    return data;
}

// 시트 구조(시트명/구분) → 홈페이지가 실제로 사용하는 번역 키 매핑
// 각 구분 안의 행 순서대로 아래 키가 차례로 할당됩니다.
const SHEET_KEY_MAP = {
    Menu: {
        '메뉴': ['services', 'portfolio', 'team', 'testimonials', 'nav_faq', 'contact']
    },
    Home: {
        '배지': ['hero_badge'],
        '메인타이틀': ['hero_title'],
        '타이틀강조': ['hero_title_highlight'],
        '서브타이틀': ['hero_description'],
        '버튼': ['hero_btn1', 'hero_btn2']
    },
    Services: {
        '섹션정보': ['services_title', 'services_desc'],
        '카드': ['service1_title', 'service1_desc', 'service2_title', 'service2_desc', 'service3_title', 'service3_desc', 'service4_title', 'service4_desc', 'service5_title', 'service5_desc', 'service6_title', 'service6_desc']
    },
    Portfolio: {
        '섹션정보': ['portfolio_title', 'portfolio_desc'],
        '카드': ['port1_title', 'port1_desc', 'port1_tech', 'port2_title', 'port2_desc', 'port2_tech', 'port3_title', 'port3_desc', 'port3_tech', 'port4_title', 'port4_desc', 'port4_tech']
    },
    Team: {
        '섹션정보': ['team_title', 'team_desc'],
        '멤버': ['team1', 'team1_desc', 'team2', 'team2_desc', 'team3', 'team3_desc', 'team4', 'team4_desc']
    },
    Testimonials: {
        '섹션정보': ['testimonials_title', 'testimonials_desc'],
        '후기': ['test1_name', 'test1_company', 'test1_text', 'test1_stars', 'test1_avatar', 'test2_name', 'test2_company', 'test2_text', 'test2_stars', 'test2_avatar', 'test3_name', 'test3_company', 'test3_text', 'test3_stars', 'test3_avatar']
    },
    Contact: {
        '섹션정보': ['contact_title', 'contact_desc'],
        '폼필드': ['contact_name', 'contact_email', 'contact_subject', 'contact_message'],
        '폼버튼': ['contact_send'],
        '정보': ['contact_phone', 'contact_phone_value', 'contact_email_label', 'contact_email_value', 'contact_address', 'contact_address_value']
    },
    Footer: {
        '회사소개': ['footer_desc'],
        '메뉴제목': ['footer_services', 'footer_contact', 'footer_follow'],
        '서비스링크': ['footer_service1', 'footer_service2', 'footer_service3'],
        '연락처': ['footer_phone', 'footer_email', 'footer_message'],
        '소셜': ['footer_social1', 'footer_social2', 'footer_social3'],
        '하단': ['footer_rights', 'footer_privacy', 'footer_terms']
    },
    Brands: {
        '문구': ['brand_eyebrow'],
        '로고': ['brand1', 'brand2', 'brand3', 'brand4', 'brand5', 'brand6']
    },
    WhyChooseUs: {
        '섹션정보': ['why_title', 'why_desc'],
        '항목': ['why1_title', 'why1_desc', 'why2_title', 'why2_desc', 'why3_title', 'why3_desc', 'why4_title', 'why4_desc']
    },
    FAQ: {
        '섹션정보': ['faq_title', 'faq_desc'],
        '질문': ['faq1_q', 'faq1_a', 'faq2_q', 'faq2_a', 'faq3_q', 'faq3_a', 'faq4_q', 'faq4_a', 'faq5_q', 'faq5_a']
    }
};

// 여러 시트 데이터를 홈페이지 번역 키 형식으로 변환
function convertMultiSheetToContent(allData) {
    const contentData = {
        ko: {},
        en: {}
    };

    for (const sheetName in allData) {
        const sheetData = allData[sheetName];
        const sheetMap = SHEET_KEY_MAP[sheetName] || {};

        for (const category in sheetData) {
            const items = sheetData[category];
            const keyList = sheetMap[category]; // 이 구분에 대한 정확한 키 목록

            items.forEach((item, idx) => {
                const ko = item['한국어'] || item['Korean'] || item['한국어 (Korean)'] || '';
                const en = item['영어'] || item['English'] || item['영어 (English)'] || '';

                let key;
                if (keyList && keyList[idx]) {
                    // 매핑된 정확한 키 사용 (화면이 읽는 이름)
                    key = keyList[idx];
                } else if (item['Key'] || item['key']) {
                    key = (item['Key'] || item['key']).trim();
                } else {
                    // 폴백: 자동 생성 키
                    key = `${sheetName}_${category}_${idx + 1}`;
                }

                contentData.ko[key] = ko;
                contentData.en[key] = en;
            });
        }
    }

    return contentData;
}

// 구글 시트 데이터 파싱
function parseGoogleSheetsData(values) {
    if (!values || values.length < 2) return {};

    const headers = values[0];
    const contentData = {};

    // 섹션별로 그룹화
    for (let i = 1; i < values.length; i++) {
        const row = values[i];

        const section = (row[0] || '').trim();
        const category = (row[1] || '').trim();
        const itemName = (row[2] || '').trim();
        const key = (row[3] || '').trim();
        const korean = (row[4] || '').trim();
        const english = (row[5] || '').trim();

        if (!section || !key) continue;

        // 섹션 초기화
        if (!contentData[section]) {
            contentData[section] = {};
        }

        // 카테고리 초기화
        if (!contentData[section][category]) {
            contentData[section][category] = [];
        }

        // 데이터 추가
        const item = {
            key: key,
            ko: korean,
            en: english
        };

        if (itemName) {
            item.name = itemName;
        }

        contentData[section][category].push(item);
    }

    return contentData;
}

// localStorage에서 캐시된 데이터 로드
function loadFromLocalStorage() {
    const cached = localStorage.getItem('parapia_sheets_cache');
    if (cached) {
        console.log('✅ 캐시된 데이터에서 로드됨');
        return JSON.parse(cached);
    }
    return {};
}

// 구글 시트 설정 저장
function saveGoogleSheetsConfig(spreadsheetId, apiKey) {
    googleSheetsConfig.spreadsheetId = spreadsheetId;
    googleSheetsConfig.apiKey = apiKey;

    localStorage.setItem('parapia_sheets_id', spreadsheetId);
    localStorage.setItem('parapia_sheets_key', apiKey);

    console.log('✅ 구글 시트 설정 저장됨');
}

// 저장된 설정 로드
function loadGoogleSheetsConfig() {
    const spreadsheetId = localStorage.getItem('parapia_sheets_id');
    const apiKey = localStorage.getItem('parapia_sheets_key');

    if (spreadsheetId && apiKey) {
        googleSheetsConfig.spreadsheetId = spreadsheetId;
        googleSheetsConfig.apiKey = apiKey;
        return true;
    }
    return false;
}

// 구글 시트 URL 생성
function getGoogleSheetsEditUrl() {
    if (!googleSheetsConfig.spreadsheetId) {
        return 'https://docs.google.com/spreadsheets';
    }
    return `https://docs.google.com/spreadsheets/d/${googleSheetsConfig.spreadsheetId}/edit`;
}

// 페이지 로드 시 설정 로드
if (loadGoogleSheetsConfig()) {
    console.log('✅ 구글 시트 설정 로드됨');
}
