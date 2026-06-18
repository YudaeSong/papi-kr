/* ==========================================
   PARAPIA - 정적 웹서버 (자체 호스팅용)
   포트포워딩으로 papi.kr 서비스
   ========================================== */

const express = require('express');
const path = require('path');

const app = express();

// 외부(공유기 포트포워딩)에서 접속하므로 모든 인터페이스에 바인딩
const HOST = '0.0.0.0';
// 포트: 환경변수 PORT 우선, 없으면 8080
//  - 80번으로 바로 받으려면 PORT=80 (Windows는 관리자 권한 필요할 수 있음)
//  - 공유기에서 외부80 -> 내부8080 으로 포워딩해도 됨
const PORT = process.env.PORT || 8080;

// gzip 압축 (있으면 사용)
try {
    const compression = require('compression');
    app.use(compression());
} catch (e) { /* optional */ }

// 정적 파일 서비스 (현재 폴더). 캐시 적당히.
app.use(express.static(__dirname, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
        if (/\.(png|jpg|jpeg|svg|ico|webp)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        } else if (/\.(css|js)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=3600');
        } else {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// 그 외 경로는 홈으로 (단순 폴백)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════╗
║   PARAPIA 웹서버 실행 중                ║
╚════════════════════════════════════════╝

  로컬     : http://localhost:${PORT}
  내부망   : http://<이-PC-내부IP>:${PORT}
  바인딩   : ${HOST}:${PORT}

  ▸ 공유기에서 외부 80(또는 443) -> 내부 ${PORT} 포트포워딩
  ▸ papi.kr A레코드를 이 PC의 공인 IP로 설정
  ▸ 종료: Ctrl+C
`);
});
