/* ==========================================
   Excel Data Manager
   엑셀 파일 생성, 업로드, 저장 기능
   ========================================== */

// 엑셀 파일 다운로드
function downloadExcelTemplate() {
    // 기존 translations 데이터 가져오기
    if (typeof translations === 'undefined') {
        alert('언어 데이터를 찾을 수 없습니다.');
        return;
    }

    // 데이터 준비
    const koData = translations.ko;
    const enData = translations.en;

    // 엑셀 시트 데이터 생성
    const sheetData = [];
    sheetData.push(['Key', '한국어 (Korean)', '영어 (English)']);

    // translations 객체의 모든 키 추출
    const keys = Object.keys(koData);
    keys.forEach(key => {
        sheetData.push([
            key,
            koData[key] || '',
            enData[key] || ''
        ]);
    });

    // CSV로 변환
    const csv = convertToCSV(sheetData);

    // 다운로드
    downloadCSV(csv, 'parapia-translations.csv');
}

// 엑셀 템플릿 다운로드 (XLSX 형식)
function downloadExcelTemplateXLSX() {
    if (typeof translations === 'undefined') {
        alert('언어 데이터를 찾을 수 없습니다.');
        return;
    }

    const koData = translations.ko;
    const enData = translations.en;

    // 엑셀 시트 데이터
    const sheetData = [
        ['Key', '한국어 (Korean)', '영어 (English)']
    ];

    Object.keys(koData).forEach(key => {
        sheetData.push([key, koData[key] || '', enData[key] || '']);
    });

    // 간단한 HTML 테이블로 만들어 다운로드
    let html = '<table border="1">';
    sheetData.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${escapeHtml(cell)}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';

    // XLSX 라이브러리 로드 후 생성
    loadXLSXLibrary(() => {
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Translations");

        // 열 너비 설정
        ws['!cols'] = [
            { wch: 25 },  // Key
            { wch: 50 },  // Korean
            { wch: 50 }   // English
        ];

        XLSX.writeFile(wb, 'parapia-translations.xlsx');
    });
}

// XLSX 라이브러리 로드
function loadXLSXLibrary(callback) {
    if (typeof XLSX !== 'undefined') {
        callback();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
    script.onload = callback;
    document.head.appendChild(script);
}

// CSV 변환
function convertToCSV(data) {
    return data.map(row =>
        row.map(cell => {
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',')
    ).join('\n');
}

// CSV 다운로드
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// HTML 이스케이프
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// 엑셀 파일 업로드 처리
function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            loadXLSXLibrary(() => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // 데이터 검증 및 처리
                const processedData = processExcelData(jsonData);

                if (processedData) {
                    // localStorage에 저장
                    localStorage.setItem('parapia_custom_translations', JSON.stringify(processedData));
                    console.log('✅ 번역 데이터 저장 완료:', processedData);
                    alert('✅ 홈페이지 데이터가 성공적으로 업로드되었습니다!\n페이지를 새로고침하면 변경사항이 반영됩니다.');

                    // 페이지 새로고침
                    location.reload();
                }
            });
        } catch (error) {
            console.error('엑셀 파일 처리 중 오류:', error);
            alert('❌ 엑셀 파일 처리 중 오류가 발생했습니다.\n올바른 형식의 파일인지 확인해주세요.');
        }
    };

    reader.readAsArrayBuffer(file);
}

// 엑셀 데이터 처리
function processExcelData(jsonData) {
    const processedData = {
        ko: {},
        en: {}
    };

    try {
        jsonData.forEach(row => {
            const key = row['Key'] || row['key'];
            const korean = row['한국어 (Korean)'] || row['Korean'] || '';
            const english = row['영어 (English)'] || row['English'] || '';

            if (key) {
                processedData.ko[key.trim()] = korean.toString().trim();
                processedData.en[key.trim()] = english.toString().trim();
            }
        });

        // 데이터가 비어있으면 null 반환
        if (Object.keys(processedData.ko).length === 0) {
            alert('❌ 엑셀 파일에 데이터가 없습니다.');
            return null;
        }

        return processedData;
    } catch (error) {
        console.error('데이터 처리 오류:', error);
        return null;
    }
}

// 커스텀 번역 데이터 로드 (language.js와 연동)
function loadCustomTranslations() {
    const customData = localStorage.getItem('parapia_custom_translations');
    if (customData) {
        try {
            const parsed = JSON.parse(customData);
            // translations 객체 업데이트
            if (window.translations) {
                window.translations.ko = { ...window.translations.ko, ...parsed.ko };
                window.translations.en = { ...window.translations.en, ...parsed.en };
                console.log('✅ 커스텀 번역 데이터 로드됨');
            }
        } catch (error) {
            console.error('커스텀 번역 데이터 로드 오류:', error);
        }
    }
}

// 저장된 엑셀 데이터 초기화
function resetToDefaultTranslations() {
    if (confirm('기본 번역 데이터로 초기화하시겠습니까?\n커스텀 데이터는 삭제됩니다.')) {
        localStorage.removeItem('parapia_custom_translations');
        console.log('✅ 기본 번역으로 초기화됨');
        alert('기본 번역으로 초기화되었습니다.\n페이지를 새로고침하면 반영됩니다.');
        location.reload();
    }
}

// 현재 번역 데이터 내보내기
function exportCurrentTranslations() {
    const koData = translations.ko;
    const enData = translations.en;

    const sheetData = [['Key', '한국어 (Korean)', '영어 (English)']];
    Object.keys(koData).forEach(key => {
        sheetData.push([key, koData[key] || '', enData[key] || '']);
    });

    loadXLSXLibrary(() => {
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Translations");
        ws['!cols'] = [
            { wch: 25 },
            { wch: 50 },
            { wch: 50 }
        ];

        const timestamp = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `parapia-translations-${timestamp}.xlsx`);
    });
}

// 페이지 로드 시 커스텀 번역 로드
document.addEventListener('DOMContentLoaded', () => {
    loadCustomTranslations();
});
