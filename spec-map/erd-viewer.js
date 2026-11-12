/* 자동 생성: sync.js --update-viewer (원본: InSearch docs/data-model-erd.html 인라인 렌더 스크립트, 수정 없음) */
"use strict";
/* ====================== 렌더링 (데이터: data-model-erd-data.js) ====================== */
(function render(){
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  document.title = ERD_META.title;
  document.getElementById("hdEyebrow").textContent = ERD_META.eyebrow;
  document.getElementById("hdTitle").textContent = ERD_META.h1;
  document.getElementById("hdLede").innerHTML = ERD_META.lede;
  document.getElementById("hdMeta").innerHTML = ERD_META.meta.map(m => `<dt>${m.k}</dt><dd>${m.v}</dd>`).join("");
  document.getElementById("hdFooter").innerHTML = ERD_META.footer;

  const cell = (c, cls) => {
    const h = typeof c === "string" ? c : c.h;
    const k = (typeof c === "object" && c.c) || cls || "";
    return `<td${k ? ` class="${k}"` : ""}>${h}</td>`;
  };
  const block = b => {
    switch(b.type){
      case "callout": return `<div class="callout${b.warn ? " warn" : ""}">${b.html}</div>`;
      case "html": return b.html;
      case "h3": return `<h3>${b.text}</h3>`;
      case "list": return `<ul>${b.items.map(x => `<li>${x}</li>`).join("")}</ul>`;
      case "trio": return `<div class="trio">` + b.cards.map(c =>
        `<div class="trio-card"><span class="tag ${c.tagClass||"tag-pk"}">${c.tag}</span><h3>${c.title}</h3><p>${c.text}</p></div>`).join("") + `</div>`;
      case "legend": return `<div class="legend">` + b.items.map(x => `<span class="legend-item">${x}</span>`).join("") + `</div>`;
      case "mermaid": return `<div class="diagram-frame"><pre class="mermaid">${esc(b.code)}</pre></div>`;
      case "table": {
        const cc = b.colClass || {};
        return `<div class="table-wrap"><table class="spec">${b.caption ? `<caption>${b.caption}</caption>` : ""}` +
          `<thead><tr>${b.head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>` +
          b.rows.map(r => `<tr>${r.map((c, i) => cell(c, cc[i])).join("")}</tr>`).join("") + `</tbody></table></div>`;
      }
      case "entities": {
        const idx = b.index === false ? "" : `<div class="entity-index">` + b.cards.map(c => `<a href="#${c.id}">${c.name}</a>`).join("") + `</div>`;
        const cards = b.cards.map(c => `
        <article class="entity-card" id="${c.id}">
          <header><h4>${c.name}</h4><span class="entity-meta">${c.meta||""}</span></header>
          ${c.desc ? `<p class="entity-desc">${c.desc}</p>` : ""}
          <table class="schema">
            <thead><tr><th>컬럼</th><th>타입</th><th>제약</th><th>설명</th></tr></thead>
            <tbody>${c.cols.map(r => `<tr><td class="col">${r[0]}</td><td class="ty">${r[1]}</td><td>${r[2]||""}</td><td class="note">${r[3]||""}</td></tr>`).join("")}</tbody>
            ${c.foot ? `<tfoot><tr><td colspan="4">${c.foot}</td></tr></tfoot>` : ""}
          </table>
        </article>`).join("");
        return idx + `<div class="entity-grid">${cards}</div>`;
      }
      default: return "";
    }
  };

  document.getElementById("toc").innerHTML = ERD_SECTIONS.map((s, i) => `<li><a href="#${s.id}">${i+1}. ${s.title}</a></li>`).join("");
  document.getElementById("main").innerHTML = ERD_SECTIONS.map((s, i) =>
    `<section id="${s.id}"><div class="section-head"><span class="section-num">${i+1}</span><h2>${s.title}</h2></div>` +
    (s.note ? `<p class="section-note">${s.note}</p>` : "") + s.blocks.map(block).join("\n") + `</section>`).join("\n\n");

  if (window.mermaid) {
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "default" });
    mermaid.run({ querySelector: "pre.mermaid" });
  }
})();
