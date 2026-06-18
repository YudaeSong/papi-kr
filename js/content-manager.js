/* ==========================================
   Content Manager - 홈페이지 콘텐츠 관리
   현재 데이터 다운로드 / 수정본 업로드
   ========================================== */

// 현재 홈페이지의 모든 텍스트 데이터 추출 (구조화된 형식)
function extractCurrentContent() {
    // contentData.js의 데이터 구조 사용
    if (typeof contentData !== 'undefined') {
        return contentData;
    }

    // 폴백: translations 데이터에서 추출
    const content = {
        ko: {},
        en: {}
    };

    if (typeof translations !== 'undefined') {
        content.ko = { ...translations.ko };
        content.en = { ...translations.en };
    }

    return content;
}

// 현재 데이터를 엑셀로 다운로드 (Excel 형식)
function downloadCurrentDataAsExcel() {
    try {
        const data = extractCurrentContent();

        if (!data.ko || Object.keys(data.ko).length === 0) {
            showAlert('❌ 다운로드할 데이터가 없습니다.', 'error');
            return;
        }

        // CSV 형식으로 변환 (Excel에서도 열 수 있음)
        const csv = convertToCSV(data);

        // 또는 XLSX 시도
        if (typeof XLSX !== 'undefined') {
            downloadAsXLSX(data);
        } else {
            downloadAsCSV(csv);
        }
    } catch (error) {
        console.error('다운로드 오류:', error);
        showAlert('❌ 다운로드 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// CSV로 다운로드
function downloadAsCSV(csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `parapia-content-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert('✅ 현재 데이터가 CSV로 다운로드되었습니다!', 'success');
}

// XLSX로 다운로드
function downloadAsXLSX(data) {
    const sheetData = [
        ['Key', '한국어 (Korean)', '영어 (English)']
    ];

    Object.keys(data.ko).forEach(key => {
        sheetData.push([
            key,
            data.ko[key] || '',
            data.en[key] || ''
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Content");

    // 열 너비 설정
    ws['!cols'] = [
        { wch: 30 },
        { wch: 60 },
        { wch: 60 }
    ];

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `parapia-content-${timestamp}.xlsx`);

    showAlert('✅ 현재 데이터가 Excel로 다운로드되었습니다!', 'success');
}

// CSV 형식으로 변환 (구조화된 데이터)
function convertToCSV(data) {
    const rows = [
        ['섹션', '분류', '항목명', 'Key', '한국어 (Korean)', '영어 (English)']
    ];

    // contentData 구조로 변환
    if (typeof data === 'object' && !data.ko) {
        // 새로운 구조화된 형식
        for (const section in data) {
            const sectionData = data[section];

            for (const category in sectionData) {
                const items = sectionData[category];

                if (Array.isArray(items)) {
                    items.forEach((item, idx) => {
                        if (item.key) {
                            // 단순 key-value 쌍
                            rows.push([
                                section,
                                category,
                                '',
                                item.key,
                                item.ko || '',
                                item.en || ''
                            ]);
                        } else if (item.title && item.title.key) {
                            // 카드형 (title, desc 등)
                            rows.push([
                                section,
                                category,
                                `항목${item.num || idx + 1} - 제목`,
                                item.title.key,
                                item.title.ko || '',
                                item.title.en || ''
                            ]);

                            if (item.desc) {
                                rows.push([
                                    section,
                                    category,
                                    `항목${item.num || idx + 1} - 설명`,
                                    item.desc.key,
                                    item.desc.ko || '',
                                    item.desc.en || ''
                                ]);
                            }

                            if (item.tech) {
                                rows.push([
                                    section,
                                    category,
                                    `항목${item.num || idx + 1} - 기술`,
                                    item.tech.key,
                                    item.tech.ko || '',
                                    item.tech.en || ''
                                ]);
                            }
                        } else if (item.name && item.name.key) {
                            // 팀/후기 형식
                            rows.push([
                                section,
                                category,
                                `항목${item.num || idx + 1} - 이름`,
                                item.name.key,
                                item.name.ko || '',
                                item.name.en || ''
                            ]);

                            if (item.desc) {
                                rows.push([
                                    section,
                                    category,
                                    `항목${item.num || idx + 1} - 설명`,
                                    item.desc.key,
                                    item.desc.ko || '',
                                    item.desc.en || ''
                                ]);
                            }

                            if (item.company) {
                                rows.push([
                                    section,
                                    category,
                                    `항목${item.num || idx + 1} - 회사`,
                                    item.company.key,
                                    item.company.ko || '',
                                    item.company.en || ''
                                ]);
                            }

                            if (item.text) {
                                rows.push([
                                    section,
                                    category,
                                    `항목${item.num || idx + 1} - 본문`,
                                    item.text.key,
                                    item.text.ko || '',
                                    item.text.en || ''
                                ]);
                            }
                        }
                    });
                }
            }
        }
    } else {
        // 기존 형식 (호환성)
        Object.keys(data.ko || {}).forEach(key => {
            rows.push([
                '',
                '',
                '',
                key,
                (data.ko[key] || '').toString().replace(/"/g, '""'),
                (data.en[key] || '').toString().replace(/"/g, '""')
            ]);
        });
    }

    // CSV 형식 변환 (UTF-8 BOM 추가 - Excel에서 한글 정상 표시)
    const csv = rows.map(row =>
        row.map(cell => {
            cell = (cell || '').toString();
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',')
    ).join('\n');

    // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
    return '﻿' + csv;
}

// XLSX 라이브러리 동적 로드
function loadXLSXLibrary(callback) {
    if (typeof XLSX !== 'undefined') {
        callback();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
    script.onload = callback;
    script.onerror = () => {
        showAlert('❌ 라이브러리 로드 실패. 인터넷 연결을 확인하세요.', 'error');
    };
    document.head.appendChild(script);
}

// 엑셀/CSV 파일 업로드 및 처리
function handleContentUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const fileType = file.name.split('.').pop().toLowerCase();

            let jsonData;

            if (fileType === 'csv') {
                // CSV 파일 처리
                const csv = e.target.result;
                jsonData = parseCSV(csv);
            } else {
                // Excel 파일 처리 (XLSX 라이브러리 필요)
                if (typeof XLSX === 'undefined') {
                    showAlert('❌ Excel 파일은 브라우저에서 지원되지 않습니다. CSV 파일을 사용해주세요.', 'error');
                    showLoading(false);
                    return;
                }

                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                jsonData = XLSX.utils.sheet_to_json(worksheet);
            }

            // 데이터 변환
            const convertedData = convertExcelToContent(jsonData);

            if (convertedData && Object.keys(convertedData.ko).length > 0) {
                // 서버에 저장 시도
                uploadContentToServer(file, convertedData);
            } else {
                showAlert('❌ 파일에 데이터가 없거나 형식이 올바르지 않습니다.', 'error');
                showLoading(false);
            }
        } catch (error) {
            console.error('파일 처리 오류:', error);
            showAlert('❌ 파일 처리 중 오류가 발생했습니다: ' + error.message, 'error');
            showLoading(false);
        }
    };

    reader.readAsArrayBuffer(file);
}

// CSV 파일 파싱
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const obj = {};
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });

        data.push(obj);
    }

    return data;
}

// 엑셀 데이터를 콘텐츠 형식으로 변환
function convertExcelToContent(jsonData) {
    const converted = {
        ko: {},
        en: {}
    };

    try {
        jsonData.forEach(row => {
            const key = (row['Key'] || row['key'] || '').toString().trim();
            const korean = (row['한국어 (Korean)'] || row['Korean'] || '').toString().trim();
            const english = (row['영어 (English)'] || row['English'] || '').toString().trim();

            if (key) {
                converted.ko[key] = korean;
                converted.en[key] = english;
            }
        });

        return converted;
    } catch (error) {
        console.error('데이터 변환 오류:', error);
        return null;
    }
}

// 서버에 콘텐츠 업로드
function uploadContentToServer(file, contentData) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('content', JSON.stringify(contentData));

    showLoading(true);

    fetch('/api/upload-content', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 로컬 스토리지에도 저장
            localStorage.setItem('parapia_custom_content', JSON.stringify(contentData));

            showAlert('✅ 홈페이지 내용이 업데이트되었습니다!', 'success');

            // 1.5초 후 새로고침
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showAlert('❌ 업로드 실패: ' + (data.error || '알 수 없는 오류'), 'error');
        }
    })
    .catch(error => {
        console.error('업로드 오류:', error);
        // 오프라인 모드: 로컬에만 저장
        localStorage.setItem('parapia_custom_content', JSON.stringify(contentData));
        showAlert('⚠️ 로컬에만 저장되었습니다. (서버 연결 실패)', 'warning');
        setTimeout(() => location.reload(), 1500);
    })
    .finally(() => showLoading(false));
}

// 저장된 콘텐츠 로드
function loadSavedContent() {
    const savedContent = localStorage.getItem('parapia_custom_content');
    if (savedContent) {
        try {
            const content = JSON.parse(savedContent);
            if (typeof translations !== 'undefined') {
                translations.ko = { ...translations.ko, ...content.ko };
                translations.en = { ...translations.en, ...content.en };
                console.log('✅ 저장된 콘텐츠 로드됨');
            }
        } catch (error) {
            console.error('저장된 콘텐츠 로드 오류:', error);
        }
    }
}

// 알림 표시
function showAlert(message, type) {
    const alertEl = document.getElementById('contentAlert');
    if (!alertEl) {
        const div = document.createElement('div');
        div.id = 'contentAlert';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 9999;
            font-weight: 600;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        document.body.appendChild(div);
    }

    const alertEl2 = document.getElementById('contentAlert');
    alertEl2.textContent = message;

    if (type === 'success') {
        alertEl2.style.background = '#d1fae5';
        alertEl2.style.color = '#065f46';
        alertEl2.style.border = '2px solid #10b981';
    } else if (type === 'error') {
        alertEl2.style.background = '#fee2e2';
        alertEl2.style.color = '#7f1d1d';
        alertEl2.style.border = '2px solid #ef4444';
    } else {
        alertEl2.style.background = '#fef3c7';
        alertEl2.style.color = '#92400e';
        alertEl2.style.border = '2px solid #f59e0b';
    }

    setTimeout(() => {
        alertEl2.style.opacity = '0';
        alertEl2.style.transition = 'opacity 0.3s ease';
    }, 4000);
}

// 로딩 표시
function showLoading(show) {
    const label = document.getElementById('uploadLabel');
    if (label) {
        label.style.opacity = show ? '0.6' : '1';
        label.style.pointerEvents = show ? 'none' : 'auto';
    }
}

// 페이지 로드 시 저장된 콘텐츠 로드
document.addEventListener('DOMContentLoaded', () => {
    loadSavedContent();
});
