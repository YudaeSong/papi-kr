/* ==========================================
   Google Sheets 연동 (Apps Script 웹앱 → JSON)
   API 키 노출 없이 시트 데이터를 읽어옵니다.
   ========================================== */

// 시트 데이터를 JSON({ko:{...}, en:{...}})으로 제공하는 Apps Script 웹앱 (비밀 아님)
const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx4cQygyaGF3RtnCBI5O_cdbVGddUHz5AH489pszNKEPaBq7-hn_0imirpFeZhUoAC2/exec';

// 관리자가 직접 편집할 구글 시트 주소 (설정 버튼에서 사용)
const SHEET_EDIT_URL = 'https://docs.google.com/spreadsheets/d/1LflYOqW4Oi-05xP0DH05-aZ5eFKkzcIfMgpaJXe1JdU/edit';

// 웹앱에서 데이터 로드 (페이지 로드/새로고침 시 호출)
async function loadFromGoogleSheets() {
    if (!SHEET_WEBAPP_URL || SHEET_WEBAPP_URL.indexOf('http') !== 0) {
        return loadFromLocalStorage();
    }
    try {
        const res = await fetch(SHEET_WEBAPP_URL, { cache: 'no-store' });
        const data = await res.json();
        if (data && (data.ko || data.en)) {
            // 캐시 저장 → 다음 방문 시 첫 화면부터 시트값으로 그려져 깜빡임 방지
            localStorage.setItem('parapia_sheets_cache', JSON.stringify(data));
            localStorage.setItem('parapia_sheets_updated', new Date().toLocaleString('ko-KR'));
            return data;
        }
    } catch (e) {
        console.warn('시트 로드 실패(기본 콘텐츠 사용):', e);
    }
    return loadFromLocalStorage();
}

// 캐시된 데이터 (네트워크 실패 시 폴백)
function loadFromLocalStorage() {
    const cached = localStorage.getItem('parapia_sheets_cache');
    if (cached) {
        try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return {};
}

// 관리자용 시트 편집 주소
function getGoogleSheetsEditUrl() {
    return SHEET_EDIT_URL;
}
