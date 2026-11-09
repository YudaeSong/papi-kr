// 안내 문서 3종 공통 — 상단 탭 고정 높이 계산과 「맨 위로」 버튼.
(() => {
  const nav = document.getElementById('docTabs');
  const tabs = nav.querySelector('.tabs');

  // 좁은 화면은 아이콘·이름 줄이 탭 위로 접힌다. 그 줄은 스크롤되어 사라지고 탭만 고정한다.
  function layout() {
    const hidden = Math.max(0, tabs.offsetTop - nav.offsetTop - 12);
    nav.style.top = `${-hidden}px`;
    document.documentElement.style.setProperty('--tabs-h', `${nav.offsetHeight - hidden}px`);
  }
  layout();
  new ResizeObserver(layout).observe(nav);

  const top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.setAttribute('aria-label', '맨 위로');
  top.title = '맨 위로';
  top.textContent = '↑';
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(top);

  // 버튼은 내용 영역 오른쪽 끝 바로 옆, 화면 세로 가운데에 둔다. 옆에 자리가 없으면 글자를 덜 가리는 오른쪽 아래로 내린다.
  const content = document.querySelector('main');
  function place() {
    const box = content.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(content).paddingRight) || 0;
    const gap = 12;
    const edge = document.documentElement.clientWidth - top.offsetWidth - 8;
    const x = box.right - padding + gap;
    top.classList.toggle('corner', x > edge);
    document.documentElement.style.setProperty('--top-x', `${Math.round(x)}px`);
  }
  place();
  new ResizeObserver(place).observe(content);
  window.addEventListener('resize', place);

  const toggle = () => top.classList.toggle('show', window.scrollY > 300);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();
