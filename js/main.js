/* ============================================================
   PARAPIA — AI Software Engineering Studio
   Interactions: neural canvas, typing code, timeline, forms
   ============================================================ */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // i18n helper (language.js가 먼저 로드됨)
    function t(key) {
        var dict = (typeof translations !== 'undefined' && translations[currentLanguage]) || {};
        return dict[key] || key;
    }

    /* ============================================================
       1. Neural mesh canvas (hero background)
       ============================================================ */
    (function neuralMesh() {
        var canvas = document.getElementById('neural-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var hero = canvas.parentElement;

        var nodes = [];
        var mouse = { x: null, y: null };
        var rafId = null;
        var running = false;
        var W = 0, H = 0, DPR = 1;

        var LINK_DIST = 130;
        var MOUSE_DIST = 180;

        function resize() {
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            W = hero.clientWidth;
            H = hero.clientHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            seed();
        }

        function seed() {
            var count = Math.max(28, Math.min(85, Math.floor((W * H) / 17000)));
            nodes = [];
            for (var i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    r: Math.random() * 1.6 + 0.8,
                    hue: Math.random() < 0.72 ? '0,242,254' : '139,92,246'
                });
            }
        }

        function step() {
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
                if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            var i, j, a, b, dx, dy, d;

            // links
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                for (j = i + 1; j < nodes.length; j++) {
                    b = nodes[j];
                    dx = a.x - b.x; dy = a.y - b.y;
                    d = Math.sqrt(dx * dx + dy * dy);
                    if (d < LINK_DIST) {
                        ctx.strokeStyle = 'rgba(' + a.hue + ',' + ((1 - d / LINK_DIST) * 0.28).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
                // mouse links
                if (mouse.x !== null) {
                    dx = a.x - mouse.x; dy = a.y - mouse.y;
                    d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MOUSE_DIST) {
                        ctx.strokeStyle = 'rgba(0,242,254,' + ((1 - d / MOUSE_DIST) * 0.5).toFixed(3) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            // nodes
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                ctx.fillStyle = 'rgba(' + a.hue + ',0.75)';
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function loop() {
            if (!running) return;
            step();
            draw();
            rafId = requestAnimationFrame(loop);
        }

        function start() {
            if (running || prefersReducedMotion) return;
            running = true;
            rafId = requestAnimationFrame(loop);
        }
        function stop() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        }

        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', function () {
            mouse.x = null; mouse.y = null;
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else start();
        });

        // hero가 화면에 보일 때만 애니메이션
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start(); else stop();
                });
            }, { threshold: 0.05 }).observe(hero);
        }

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize();
                if (prefersReducedMotion) draw();
            }, 150);
        });

        resize();
        if (prefersReducedMotion) {
            draw(); // 정적 프레임 1장만
        } else {
            start();
        }
    })();

    /* ============================================================
       2. Code window typing animation
       ============================================================ */
    (function codeTyping() {
        var body = document.getElementById('code-body');
        if (!body) return;

        var LINES = [
            '<span class="tok-c"># nexus_agent.py — multi-agent orchestration</span>',
            '<span class="tok-k">from</span> nexus <span class="tok-k">import</span> Agent, Goal, tools',
            '',
            'agents = <span class="tok-f">spawn</span>([<span class="tok-s">"planner"</span>, <span class="tok-s">"builder"</span>, <span class="tok-s">"critic"</span>])',
            'task   = <span class="tok-f">Goal</span>(<span class="tok-s">"ship AI-native product"</span>)',
            '',
            '<span class="tok-k">while</span> <span class="tok-k">not</span> task.done:',
            '    plan   = agents.planner.<span class="tok-f">think</span>(task)',
            '    output = agents.builder.<span class="tok-f">act</span>(plan, tools=[web, code, db])',
            '    task.<span class="tok-f">update</span>(agents.critic.<span class="tok-f">review</span>(output))',
            '',
            '<span class="tok-c"># ✓ deployed to production — latency 42ms</span>'
        ];

        var caret = body.querySelector('.code-caret');
        var lineEls = [];

        LINES.forEach(function (html) {
            var span = document.createElement('span');
            span.className = 'code-line';
            span.innerHTML = html || '&nbsp;';
            body.insertBefore(span, caret);
            lineEls.push(span);
        });

        if (prefersReducedMotion) {
            lineEls.forEach(function (el) { el.classList.add('show'); });
            return;
        }

        var i = 0;
        function next() {
            if (i >= lineEls.length) return;
            lineEls[i].classList.add('show');
            i++;
            setTimeout(next, i < 3 ? 500 : 260);
        }
        setTimeout(next, 700);
    })();

    /* ============================================================
       3. Scroll reveal
       ============================================================ */
    (function scrollReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            els.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { io.observe(el); });
    })();

    /* ============================================================
       4. Navigation
       ============================================================ */
    (function navigation() {
        var nav = document.getElementById('site-nav');
        var menuBtn = document.getElementById('mobile-menu-btn');
        var mobileMenu = document.getElementById('mobile-menu');

        function onScroll() {
            if (!nav) return;
            nav.classList.toggle('scrolled', window.scrollY > 24);
            var hint = document.querySelector('.scroll-hint');
            if (hint) hint.style.opacity = window.scrollY > 120 ? '0' : '1';
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (menuBtn && mobileMenu) {
            function setMenu(open) {
                mobileMenu.classList.toggle('open', open);
                menuBtn.setAttribute('aria-expanded', String(open));
                document.body.style.overflow = open ? 'hidden' : '';
            }
            menuBtn.addEventListener('click', function () {
                setMenu(!mobileMenu.classList.contains('open'));
            });
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () { setMenu(false); });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') setMenu(false);
            });
        }
    })();

    /* ============================================================
       5. Language toggle
       ============================================================ */
    (function languageToggle() {
        var buttons = [
            document.getElementById('lang-toggle'),
            document.getElementById('lang-toggle-mobile')
        ].filter(Boolean);
        if (!buttons.length || typeof toggleLanguage !== 'function') return;

        function syncLabels(lang) {
            // 버튼에는 "전환될" 언어 표시
            var label = lang === 'ko' ? 'EN' : 'KO';
            var l1 = document.getElementById('lang-label');
            var l2 = document.getElementById('lang-label-mobile');
            if (l1) l1.textContent = label;
            if (l2) l2.textContent = label;
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', toggleLanguage);
        });
        document.addEventListener('parapia:language', function (e) {
            syncLabels(e.detail.lang);
        });
        syncLabels(typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko');
    })();

    /* ============================================================
       6. Process timeline — scroll progress + interactive steps
       ============================================================ */
    (function processTimeline() {
        var section = document.querySelector('.process');
        var fill = document.getElementById('proc-fill');
        var steps = Array.prototype.slice.call(document.querySelectorAll('.proc-step'));
        if (!section || !fill || !steps.length) return;

        var ticking = false;

        function update() {
            ticking = false;
            var rect = section.getBoundingClientRect();
            var vh = window.innerHeight;
            var total = rect.height - vh * 0.35;
            var passed = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
            var p = total > 0 ? passed / total : 0;
            fill.style.setProperty('--progress', p.toFixed(3));

            var idx = p <= 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(p * steps.length));
            steps.forEach(function (s, i) {
                s.classList.toggle('active', i <= idx);
            });
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();

        // 클릭/키보드로 단계 활성화
        steps.forEach(function (stepEl, i) {
            function activate() {
                steps.forEach(function (s, j) { s.classList.toggle('active', j <= i); });
                if (fill) fill.style.setProperty('--progress', ((i + 1) / steps.length).toFixed(3));
            }
            stepEl.addEventListener('click', activate);
            stepEl.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            });
        });
    })();

    /* ============================================================
       7. Spotlight hover (service cards)
       ============================================================ */
    (function spotlight() {
        if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;
        document.querySelectorAll('.svc-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
        });
    })();

    /* ============================================================
       8. FAQ accordion
       ============================================================ */
    function initFaq() {
        var items = document.querySelectorAll('.faq-item');
        if (!items.length) return;

        function setHeight(item) {
            var ans = item.querySelector('.faq-a');
            if (item.classList.contains('open')) {
                ans.style.maxHeight = ans.scrollHeight + 'px';
            } else {
                ans.style.maxHeight = '0px';
            }
        }

        items.forEach(function (item) {
            var btn = item.querySelector('.faq-q');
            btn.addEventListener('click', function () {
                var wasOpen = item.classList.contains('open');
                items.forEach(function (i) {
                    i.classList.remove('open');
                    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
                    setHeight(i);
                });
                if (!wasOpen) {
                    item.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                    setHeight(item);
                }
            });
            setHeight(item);
        });

        // 텍스트 길이 변경(언어 전환/시트 반영) 후 높이 재계산
        function recalc() {
            items.forEach(function (item) {
                if (item.classList.contains('open')) {
                    var ans = item.querySelector('.faq-a');
                    ans.style.maxHeight = ans.scrollHeight + 'px';
                }
            });
        }
        window.addEventListener('resize', recalc);
        document.addEventListener('parapia:language', recalc);
        document.addEventListener('parapia:content-updated', recalc);
    }
    initFaq();

    /* ============================================================
       9. Contact form (EmailJS)
       ============================================================ */
    (function contactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // 기본 유효성 검사 (novalidate 상태이므로 수동)
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var formData = new FormData(form);
            var button = form.querySelector('button[type="submit"]');
            var label = button.querySelector('span') || button;

            try {
                label.textContent = t('contact_sending');
                button.disabled = true;

                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS not loaded');
                }
                emailjs.init('TCOIadBmeTVK7N2Wf');

                await emailjs.send('service_parapia', 'template_778yx3k', {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    title: formData.get('subject'),
                    message: formData.get('message')
                });

                label.textContent = t('contact_success');
                form.reset();
                setTimeout(function () {
                    label.textContent = t('contact_send');
                    button.disabled = false;
                }, 4000);
            } catch (error) {
                console.error('이메일 전송 실패:', error);
                label.textContent = t('contact_error');
                button.disabled = false;
                setTimeout(function () {
                    label.textContent = t('contact_send');
                }, 3000);
            }
        });
    })();

    /* ============================================================
       10. Google Sheets 콘텐츠 동기화 (페이지 로드 시 1회)
       ============================================================ */
    (function sheetsSync() {
        function mergeNonEmpty(target, source) {
            if (!source) return;
            for (var key in source) {
                var val = source[key];
                if (val !== undefined && val !== null && val !== '') {
                    target[key] = val;
                }
            }
        }

        window.addEventListener('load', async function () {
            if (typeof loadFromGoogleSheets !== 'function') return;
            try {
                var data = await loadFromGoogleSheets();
                if (data && typeof data === 'object') {
                    mergeNonEmpty(translations.ko, data.ko);
                    mergeNonEmpty(translations.en, data.en);
                    applyTranslations();
                    document.dispatchEvent(new CustomEvent('parapia:content-updated'));
                }
            } catch (error) {
                console.warn('시트 로드 실패(기본 콘텐츠 사용):', error);
            }
        });
    })();

    /* ============================================================
       11. 관리자 설정(⚙️) — SHA-256 해시 비교 후 구글 시트 열기
       ============================================================ */
    (function adminGear() {
        var gear = document.getElementById('admin-gear');
        if (!gear) return;

        var ADMIN_HASH = '0b0c092b26a2331e87d07af7f7dd8ee088c935013a2b1119650725284948dbd1';

        // 경량 SHA-256 (http/https 모두 동작)
        function sha256(ascii){function r(v,a){return (v>>>a)|(v<<(32-a));}var mp=Math.pow,mw=mp(2,32),res="",words=[],bl=ascii.length*8;var h=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],pc=k.length,comp={};for(var c=2;pc<64;c++){if(!comp[c]){for(var i=0;i<313;i+=c)comp[i]=c;h[pc]=(mp(c,.5)*mw)|0;k[pc++]=(mp(c,1/3)*mw)|0;}}ascii+="\x80";while(ascii.length%64-56)ascii+="\x00";for(var i=0;i<ascii.length;i++){var j=ascii.charCodeAt(i);if(j>>8)return;words[i>>2]|=j<<((3-i)%4)*8;}words[words.length]=(bl/mw)|0;words[words.length]=bl;for(var j=0;j<words.length;){var w=words.slice(j,j+=16),oh=h;h=h.slice(0,8);for(var i=0;i<64;i++){var w15=w[i-15],w2=w[i-2];var a=h[0],e=h[4];var t1=h[7]+(r(e,6)^r(e,11)^r(e,25))+((e&h[5])^((~e)&h[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(r(w15,7)^r(w15,18)^(w15>>>3))+w[i-7]+(r(w2,17)^r(w2,19)^(w2>>>10)))|0);var t2=(r(a,2)^r(a,13)^r(a,22))+((a&h[1])^(a&h[2])^(h[1]&h[2]));h=[(t1+t2)|0].concat(h);h[4]=(h[4]+t1)|0;}for(var i=0;i<8;i++)h[i]=(h[i]+oh[i])|0;}for(var i=0;i<8;i++)for(var j=3;j+1;j--){var b=(h[i]>>(j*8))&255;res+=((b<16)?0:"")+b.toString(16);}return res;}

        gear.addEventListener('click', function (e) {
            e.preventDefault();
            var pw = prompt('관리자 암호를 입력하세요');
            if (pw === null) return;
            if (sha256(pw) === ADMIN_HASH && typeof getGoogleSheetsEditUrl === 'function') {
                window.open(getGoogleSheetsEditUrl(), '_blank');
            } else {
                alert('암호가 일치하지 않습니다.');
            }
        });
    })();

})();
