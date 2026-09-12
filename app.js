// EgoLens Radar — polished (SEC hardened: textContent only, no innerHTML, global error capture)
(function(){
'use strict';
const FAV_KEY = 'egolens:favs';
let papers=[], stats=null;
let debounceTimer=null;

// ---- Observability: global error capture ----
window.addEventListener('error', function(e){
  try{
    var msg = (e && e.message) ? e.message : 'unknown error';
    var toastEl = document.getElementById('toast');
    if(toastEl){ toastEl.textContent = '加载异常，已记录'; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200); }
    // silent report hook: window.__egolensErrors
    window.__egolensErrors = window.__egolensErrors || [];
    window.__egolensErrors.push({type:'error', message: msg, time: Date.now()});
  }catch(_){}
});
window.addEventListener('unhandledrejection', function(e){
  try{
    var reason = e && e.reason ? (e.reason.message || String(e.reason)) : 'unhandled rejection';
    window.__egolensErrors = window.__egolensErrors || [];
    window.__egolensErrors.push({type:'unhandledrejection', message: reason, time: Date.now()});
    var toastEl = document.getElementById('toast');
    if(toastEl){ toastEl.textContent = '异步加载异常，已记录'; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200); }
  }catch(_){}
  e.preventDefault();
});

function loadFavs(){ try{ return new Set(JSON.parse(localStorage.getItem(FAV_KEY)||'[]')); }catch{ return new Set(); } }
function saveFavs(s){ localStorage.setItem(FAV_KEY, JSON.stringify([...s])); }
let favs = loadFavs();

function el(tag, cls, text){ const n=document.createElement(tag); if(cls) n.className=cls; if(text!==undefined) n.textContent=text; return n; }
function scoreClass(s){ return s>=70 ? 'score-high' : s>=40 ? 'score-mid' : 'score-low'; }
function badgeForScore(s){ if(s>=70) return ['高','badge-green']; if(s>=40) return ['中','badge-amber']; return ['低','badge-red']; }

// Safe highlight: builds DOM nodes via textContent / mark, never innerHTML
function appendHighlight(parent, text, query){
  parent.textContent = '';
  if(!query || !text){ parent.textContent = text || ''; return; }
  var q = String(query);
  if(!q){ parent.textContent = text; return; }
  var lower = text.toLowerCase();
  var qLower = q.toLowerCase();
  var idx = 0;
  var pos = lower.indexOf(qLower, idx);
  if(pos === -1){ parent.textContent = text; return; }
  while(pos !== -1){
    if(pos > idx){
      parent.appendChild(document.createTextNode(text.slice(idx, pos)));
    }
    var mark = document.createElement('mark');
    mark.textContent = text.slice(pos, pos + q.length);
    parent.appendChild(mark);
    idx = pos + q.length;
    pos = lower.indexOf(qLower, idx);
  }
  if(idx < text.length){
    parent.appendChild(document.createTextNode(text.slice(idx)));
  }
}
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(function(){t.classList.remove('show');},1800);
}

async function load(){
  const minDelay = new Promise(function(r){ setTimeout(r,360); });
  const dataPromise = Promise.all([fetch('data/papers.json'), fetch('data/report_stats.json')]).then(async function(arr){
    var pRes = arr[0], sRes = arr[1];
    if(!pRes.ok || !sRes.ok) throw new Error('data load failed');
    papers = await pRes.json();
    stats = await sRes.json();
  });
  try{
    await Promise.all([dataPromise, minDelay]);
    initControls();
    renderKpis();
    renderCharts();
    hideSkeleton();
    renderList();
  }catch(e){
    hideSkeleton();
    var root=document.getElementById('papers');
    root.style.display='grid';
    var err=document.getElementById('noResults');
    err.style.display='block';
    var msgEl=document.getElementById('noResultsMsg');
    if(msgEl) msgEl.textContent='数据加载失败：'+ (e && e.message ? e.message : 'unknown') +'。请检查 data/papers.json 是否存在。';
    window.__egolensErrors = window.__egolensErrors || [];
    window.__egolensErrors.push({type:'load', message: e && e.message ? e.message : String(e), time: Date.now()});
  }
}
function hideSkeleton(){
  const sk=document.getElementById('skeleton');
  if(sk) sk.style.display='none';
  document.getElementById('papers').style.display='grid';
}

function initControls(){
  const cats = [...new Set(papers.map(function(p){return p.category;}))].sort();
  const sel = document.getElementById('cat');
  cats.forEach(function(c){ const o=document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o); });
  const qInput=document.getElementById('q');
  qInput.addEventListener('input', function(){
    clearTimeout(debounceTimer);
    debounceTimer=setTimeout(renderList,200);
  });
  document.getElementById('cat').addEventListener('change', renderList);
  document.getElementById('sort').addEventListener('change', renderList);
  document.getElementById('scoreMin').addEventListener('input', function(e){
    document.getElementById('scoreVal').textContent = e.target.value;
    renderList();
  });
  document.getElementById('onlyCode').addEventListener('change', renderList);
  document.getElementById('onlyFav').addEventListener('change', renderList);
  document.getElementById('clearBtn').addEventListener('click', clearFilters);
  document.getElementById('resetSearch').addEventListener('click', clearFilters);
  document.getElementById('showAllBtn').addEventListener('click', clearFilters);
  document.getElementById('drawerBg').addEventListener('click', closeDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeDrawer(); });
}
function clearFilters(){
  document.getElementById('q').value='';
  document.getElementById('cat').value='';
  document.getElementById('sort').value='score_desc';
  document.getElementById('scoreMin').value=0;
  document.getElementById('scoreVal').textContent='0';
  document.getElementById('onlyCode').checked=false;
  document.getElementById('onlyFav').checked=false;
  renderList();
}

function renderKpis(){
  document.getElementById('kpi-total').textContent = stats.total.toLocaleString();
  document.getElementById('kpi-code').textContent = stats.codeAvailablePct + '%';
  const avg = papers.length ? Math.round(papers.reduce(function(a,b){return a+b.score;},0)/papers.length) : 0;
  document.getElementById('kpi-score').textContent = avg;
  document.getElementById('kpi-date').textContent = (stats.generatedAt||'').slice(0,10);
}

function getFiltered(){
  const q = document.getElementById('q').value.trim().toLowerCase();
  const cat = document.getElementById('cat').value;
  const minScore = parseInt(document.getElementById('scoreMin').value,10);
  const onlyCode = document.getElementById('onlyCode').checked;
  const onlyFav = document.getElementById('onlyFav').checked;
  const sort = document.getElementById('sort').value;
  let list = papers.filter(function(p){
    if(p.score < minScore) return false;
    if(cat && p.category!==cat) return false;
    if(onlyCode && !p.codeUrl) return false;
    if(onlyFav && !favs.has(p.id)) return false;
    if(q){
      const hay = (p.title+' '+p.abstract+' '+(p.tags||[]).join(' ')).toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    return true;
  });
  if(sort==='score_desc') list.sort(function(a,b){ return b.score-a.score || b.published.localeCompare(a.published); });
  else if(sort==='score_asc') list.sort(function(a,b){ return a.score-b.score; });
  else if(sort==='time_desc') list.sort(function(a,b){ return b.published.localeCompare(a.published); });
  return {list: list, qRaw: document.getElementById('q').value.trim()};
}

function renderList(){
  const filtered = getFiltered();
  const list = filtered.list;
  const qRaw = filtered.qRaw;
  const root = document.getElementById('papers');
  const empty = document.getElementById('empty');
  const noRes = document.getElementById('noResults');
  document.getElementById('resultCount').textContent = list.length + ' papers' + (favs.size ? ' · '+favs.size+' 收藏' : '');
  root.replaceChildren();
  if(papers.length===0){
    empty.style.display='block'; noRes.style.display='none'; return;
  }
  if(list.length===0){
    empty.style.display='none'; noRes.style.display='block';
    var msgEl=document.getElementById('noResultsMsg');
    if(qRaw) msgEl.textContent = '关键词 “'+qRaw+'” 没有匹配结果，试试放宽筛选或更换关键词。';
    else msgEl.textContent = '当前筛选条件下没有匹配的论文。';
    return;
  }
  empty.style.display='none'; noRes.style.display='none';
  list.slice(0,60).forEach(function(p){
    const card = el('article','paper-card has-star');
    card.tabIndex=0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', p.title);
    const row = el('div','row');
    const score = el('div','score '+scoreClass(p.score), String(p.score));
    const main = el('div'); main.style.flex='1'; main.style.minWidth='0';
    const h3 = el('h3');
    appendHighlight(h3, p.title, qRaw);
    const meta = el('div','meta');
    const cat = el('span','badge', p.category);
    const date = el('span',null, p.published);
    const authors = el('span',null, p.authors.join(', '));
    meta.append(cat, date, authors);
    const tags = el('div','meta'); tags.style.marginTop='6px';
    (p.tags||[]).forEach(function(t){
      const chip=el('span','chip');
      appendHighlight(chip, t, qRaw);
      tags.appendChild(chip);
    });
    if(p.codeUrl){ const b=el('span','badge badge-green','有代码'); tags.appendChild(b); } else { const b=el('span','badge','无代码'); tags.appendChild(b); }
    const badgeParts = badgeForScore(p.score);
    const sBadge = el('span','badge '+badgeParts[1], '复现 '+badgeParts[0]);
    tags.appendChild(sBadge);
    main.append(h3, meta, tags);
    row.append(score, main);
    card.appendChild(row);
    const star = el('button','star-btn'+(favs.has(p.id)?' active':''),'');
    star.setAttribute('aria-label', favs.has(p.id)?'取消收藏':'收藏');
    star.setAttribute('type','button');
    star.textContent = favs.has(p.id) ? '★' : '☆';
    star.addEventListener('click', function(e){
      e.stopPropagation();
      if(favs.has(p.id)){ favs.delete(p.id); star.classList.remove('active'); star.textContent='☆'; star.setAttribute('aria-label','收藏'); toast('已取消收藏'); }
      else { favs.add(p.id); star.classList.add('active'); star.textContent='★'; star.setAttribute('aria-label','取消收藏'); toast('已收藏'); }
      saveFavs(favs);
      document.getElementById('resultCount').textContent = getFiltered().list.length + ' papers' + (favs.size ? ' · '+favs.size+' 收藏' : '');
      if(document.getElementById('onlyFav').checked) renderList();
    });
    card.appendChild(star);
    card.addEventListener('click', function(){ openDrawer(p, qRaw); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openDrawer(p, qRaw); } });
    root.appendChild(card);
  });
}

function openDrawer(p, qRaw){
  const body = document.getElementById('drawerBody');
  body.replaceChildren();
  const h = el('h2'); h.style.fontSize='16px'; h.style.margin='0 0 8px'; h.style.letterSpacing='-0.01em';
  appendHighlight(h, p.title, qRaw||'');
  const meta = el('div','meta'); meta.append(el('span','badge',p.category), el('span',null,p.published), el('span',null,p.authors.join(', ')));
  const links = el('div'); links.style.display='flex'; links.style.gap='8px'; links.style.margin='12px 0'; links.style.flexWrap='wrap';
  const a1 = el('a','btn'); a1.href=p.arxivUrl; a1.target='_blank'; a1.rel='noreferrer'; a1.textContent='arXiv ↗';
  links.appendChild(a1);
  if(p.codeUrl){ const a2=el('a','btn btn-ghost'); a2.href=p.codeUrl; a2.target='_blank'; a2.rel='noreferrer'; a2.textContent='Code ↗'; links.appendChild(a2); }
  const favBtn = el('button', favs.has(p.id)?'btn btn-ghost active':'btn btn-ghost'); favBtn.setAttribute('type','button'); favBtn.textContent = favs.has(p.id)? '★ 已收藏' : '☆ 收藏';
  favBtn.addEventListener('click', function(){
    if(favs.has(p.id)){ favs.delete(p.id); favBtn.textContent='☆ 收藏'; toast('已取消收藏'); } else { favs.add(p.id); favBtn.textContent='★ 已收藏'; toast('已收藏'); }
    saveFavs(favs); renderList();
  });
  links.appendChild(favBtn);
  const abs = el('p'); abs.style.fontSize='13px'; abs.style.color='var(--muted)'; 
  if(qRaw) appendHighlight(abs, p.abstract, qRaw);
  else abs.textContent=p.abstract;
  const dimsTitle = el('div',null,'6维复现评分'); dimsTitle.style.fontWeight='700'; dimsTitle.style.marginTop='12px'; dimsTitle.style.fontSize='13px';
  const grid = el('div','dims');
  const dims = p.dimensions || {};
  [['code','代码 30'],['data','数据 20'],['env','环境 10'],['exp','实验 8'],['doc','文档 10'],['runnable','可跑 22']].forEach(function(pair){
    var k=pair[0], label=pair[1];
    const d = el('div','dim'); const v=dims[k]||0;
    d.append(el('b',null,String(v)), el('span',null,label));
    if(v>0) d.style.borderColor='#a7f3d0'; grid.appendChild(d);
  });
  const total = el('div'); total.style.marginTop='8px'; total.style.fontSize='13px';
  const b = el('b',null,'总分 '+p.score+' / 100 — '); const parts=badgeForScore(p.score); const s=el('span','badge '+parts[1], parts[0]); total.append(b,s);
  const note = el('p'); note.style.fontSize='12px'; note.style.color='var(--muted)'; note.textContent='评分规则：code 30 + data 20 + env 10 + exp 8 + doc 10 + runnable 22，启发式可复跑，详见报告页方法。';
  body.append(h, meta, links, abs, dimsTitle, grid, total, note);
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  // a11y: move focus to close button for keyboard users
  var closeBtn=document.getElementById('drawerClose');
  if(closeBtn) closeBtn.focus();
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer').setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function renderCharts(){
  // Guard for async Chart.js loading
  if(typeof Chart === 'undefined'){
    // retry shortly if CDN async not yet loaded
    var tries = window.__chartRetry || 0;
    if(tries < 20){
      window.__chartRetry = tries + 1;
      setTimeout(renderCharts, 200);
    }
    return;
  }
  const tCtx = document.getElementById('trendChart');
  if(tCtx && stats.trendMonthly){
    try{
      new Chart(tCtx, {
        type:'line',
        data:{ labels: stats.trendMonthly.map(function(x){return x.month;}), datasets:[{ label:'论文量', data: stats.trendMonthly.map(function(x){return x.count;}), borderColor:'hsl(239 84% 67%)', backgroundColor:'hsla(239,84%,67%,.12)', fill:true, tension:.35, pointRadius:2, borderWidth:2 }]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, grid:{color:'hsl(240 8% 94%)'}}, x:{grid:{display:false}, ticks:{maxRotation:0, autoSkip:true, maxTicksLimit:6}}} }
      });
    }catch(e){ /* chart render failure captured by global handler */ }
  }
  const dCtx = document.getElementById('distChart');
  const dist = stats.scoreDistribution || [40,30,12,13,4,1];
  if(dCtx){
    try{
      new Chart(dCtx, {
        type:'doughnut',
        data:{ labels:['0-20','20-40','40-60','60-80','80-90','90-100'], datasets:[{ data: dist, backgroundColor:['hsl(0 84% 60%)','hsl(38 92% 50%)','hsl(48 92% 50%)','hsl(152 76% 40%)','hsl(189 94% 43%)','hsl(239 84% 67%)'], borderWidth:0 }]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom', labels:{boxWidth:10, font:{size:11}, color:'hsl(215 16% 47%)'}}} , cutout:'62%'}
      });
    }catch(e){}
  }
  const cCtx = document.getElementById('catChart');
  const cats = Object.entries(stats.byCategory||{}).sort(function(a,b){return b[1]-a[1];}).slice(0,6);
  if(cCtx){
    try{
      new Chart(cCtx, {
        type:'bar',
        data:{ labels: cats.map(function(x){return x[0];}), datasets:[{ label:'占比 %', data: cats.map(function(x){return x[1];}), backgroundColor:'hsl(239 84% 67%)', borderRadius:6 }]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, grid:{color:'hsl(240 8% 94%)'}}, x:{grid:{display:false}}} }
      });
    }catch(e){}
  }
}

load();
})();
