// EgoLens Radar — v3 polished (SEC hardened: textContent only, no innerHTML, global error capture + featured + pills + export + shortcuts)
(function(){
'use strict';
const FAV_KEY = 'egolens:favs';
let papers=[], stats=null;
let debounceTimer=null;
let activeTag=null;

// ---- Observability: global error capture ----
window.addEventListener('error', function(e){
  try{
    var msg = (e && e.message) ? e.message : 'unknown error';
    var toastEl = document.getElementById('toast');
    if(toastEl){ toastEl.textContent = '加载异常，已记录'; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200); }
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
function badgeForScore(s){
  const isEn = (typeof window.getLang==='function' && window.getLang()==='en');
  if(s>=70) return [isEn? (window.t? window.t('badge_high'):'High') : '高','badge-green'];
  if(s>=40) return [isEn? (window.t? window.t('badge_mid'):'Med') : '中','badge-amber'];
  return [isEn? (window.t? window.t('badge_low'):'Low') : '低','badge-red'];
}

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
    renderFeatured();
    renderTagPills();
    renderCharts();
    hideSkeleton();
    renderList();
    bindGlobalActions();
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
  activeTag=null;
  document.querySelectorAll('.pill.active').forEach(function(p){p.classList.remove('active')});
  renderList();
}

function renderKpis(){
  // animated counting
  function animate(id, target, suffix){
    var el=document.getElementById(id);
    if(!el) return;
    var start=0;
    var dur=900;
    var t0=performance.now();
    function step(now){
      var p=Math.min(1,(now-t0)/dur);
      var eased=1-Math.pow(1-p,3);
      var v=Math.round(start + (target-start)*eased);
      el.textContent = suffix ? v+suffix : String(v).toLocaleString ? v.toLocaleString() : v;
      if(suffix && id==='kpi-code') el.textContent = v + suffix;
      if(id==='kpi-total') el.textContent = v.toLocaleString();
      if(p<1) requestAnimationFrame(step);
      else {
        if(id==='kpi-total') el.textContent = stats.total.toLocaleString();
        if(id==='kpi-code') el.textContent = stats.codeAvailablePct + '%';
        if(id==='kpi-score') el.textContent = String(target);
        if(id==='kpi-date') el.textContent = (stats.generatedAt||'').slice(0,10);
      }
    }
    requestAnimationFrame(step);
  }
  animate('kpi-total', stats.total, '');
  animate('kpi-code', stats.codeAvailablePct, '%');
  const avg = papers.length ? Math.round(papers.reduce(function(a,b){return a+b.score;},0)/papers.length) : 0;
  animate('kpi-score', avg, '');
  var dEl=document.getElementById('kpi-date');
  if(dEl) dEl.textContent = (stats.generatedAt||'').slice(0,10);
}

function renderFeatured(){
  var wrap=document.getElementById('featured');
  if(!wrap) return;
  wrap.replaceChildren();
  var top = papers.slice().sort(function(a,b){return b.score-a.score|| b.published.localeCompare(a.published)}).slice(0,3);
  top.forEach(function(p, idx){
    var card=el('div','feat-card');
    card.tabIndex=0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label', p.title);
    var topRow=el('div','feat-top');
    var rank=el('div','feat-rank', String(idx+1));
    var title=el('div','feat-title', p.title);
    topRow.append(rank, title);
    var meta=el('div','feat-meta');
    meta.append(el('span','badge', p.category), el('span',null, p.published), el('span',null, (p.tags||[]).join(' · ')));
    var score=el('div','score '+scoreClass(p.score), String(p.score));
    score.className='feat-score '+(p.score>=70?'score-high':p.score>=40?'score-mid':'score-low');
    card.append(topRow, meta, score);
    card.addEventListener('click', function(){ openDrawer(p, ''); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ') {e.preventDefault(); openDrawer(p,'');}});
    wrap.appendChild(card);
  });
}

function renderTagPills(){
  var wrap=document.getElementById('tagPills');
  if(!wrap || !stats || !stats.topTags) return;
  wrap.replaceChildren();
  var counts={};
  papers.forEach(function(p){(p.tags||[]).forEach(function(t){counts[t]=(counts[t]||0)+1})});
  var tags = (stats.topTags||[]).slice(0,8);
  tags.forEach(function(pair){
    var tag=pair[0], c=counts[tag]||pair[1];
    var btn=el('button','pill');
    btn.type='button';
    btn.textContent= tag;
    var cnt=el('span','pill-count', String(c));
    btn.appendChild(cnt);
    btn.addEventListener('click', function(){
      if(activeTag===tag){
        activeTag=null; btn.classList.remove('active');
      } else {
        activeTag=tag;
        document.querySelectorAll('.pill.active').forEach(function(x){x.classList.remove('active')});
        btn.classList.add('active');
        document.getElementById('q').value=tag;
      }
      renderList();
    });
    wrap.appendChild(btn);
  });
  var clear=document.getElementById('clearPills');
  if(clear) clear.addEventListener('click', function(){
    activeTag=null;
    document.querySelectorAll('.pill.active').forEach(function(x){x.classList.remove('active')});
    document.getElementById('q').value='';
    renderList();
  });
}

function bindGlobalActions(){
  // share
  var shareBtn=document.getElementById('shareBtn');
  if(shareBtn){
    shareBtn.addEventListener('click', async function(){
      var url=location.href;
      if(navigator.share){
        try{ await navigator.share({title: document.title, text: 'EgoLens — Only 22.5% of AI papers have working code', url}); toast(window.t? 'Shared':'已唤起系统分享'); return; }catch(e){}
      }
      try{ await navigator.clipboard.writeText(url); toast(window.t? window.t('toast_copied'):'链接已复制，去分享吧！'); }catch(e){ toast('链接: '+url); }
    });
  }
  // exports
  var csvBtn=document.getElementById('exportCsvBtn');
  if(csvBtn) csvBtn.addEventListener('click', function(){ exportFiltered('csv'); });
  var bibBtn=document.getElementById('exportBibBtn');
  if(bibBtn) bibBtn.addEventListener('click', function(){ exportFiltered('bib'); });
  var jsonBtn=document.getElementById('exportJsonBtn');
  if(jsonBtn) jsonBtn.addEventListener('click', function(){ exportFiltered('json'); });
  // newsletter
  var subBtn=document.getElementById('subBtn');
  if(subBtn) subBtn.addEventListener('click', function(){
    var email=(document.getElementById('subEmail')||{}).value||'';
    if(!email || email.indexOf('@')===-1){ toast(window.t? window.t('toast_sub_invalid'):'请输入有效邮箱'); return; }
    var subject=encodeURIComponent('Subscribe EgoLens updates');
    var body=encodeURIComponent('Hi EgoLens team, please subscribe '+email+' for monthly top 10 runnable papers.\n\nLink: https://kevindurant735rocket-creator.github.io/egolens/');
    location.href='mailto:egolens@example.org?subject='+subject+'&body='+body;
    toast(window.t? window.t('toast_sub_open'):'已打开邮件客户端');
  });
  // keyboard: / to search
  document.addEventListener('keydown', function(e){
    if(e.key==='/' && !e.metaKey && !e.ctrlKey && !e.altKey){
      var active=document.activeElement;
      if(active && (active.tagName==='INPUT' || active.tagName==='TEXTAREA' || active.isContentEditable)) return;
      e.preventDefault();
      var q=document.getElementById('q');
      if(q){ q.focus(); q.select(); }
    }
    if(e.key==='Escape' && document.activeElement && document.activeElement.id==='q'){
      document.activeElement.blur();
      clearFilters();
    }
  });
  // live hint
  var hint=document.getElementById('liveHint');
  if(hint) hint.textContent='· 已加载 '+papers.length+' 篇 · 收藏 '+favs.size+' 篇';
}

function exportFiltered(fmt){
  var list=getFiltered().list;
  if(!list.length){ toast('当前筛选无数据'); return; }
  var blob, filename, mime;
  if(fmt==='csv'){
    var header=['id','title','authors','category','published','score','codeUrl','arxivUrl','tags'].join(',');
    var rows=list.map(function(p){
      var esc=function(s){ return '"'+String(s).replace(/"/g,'""')+'"'; };
      return [p.id, esc(p.title), esc(p.authors.join('; ')), p.category, p.published, p.score, p.codeUrl||'', p.arxivUrl||'', esc((p.tags||[]).join(';'))].join(',');
    });
    blob=new Blob([header+'\n'+rows.join('\n')], {type:'text/csv;charset=utf-8'});
    filename='egolens-filtered-'+Date.now()+'.csv'; mime='text/csv';
  } else if(fmt==='bib'){
    var bib=list.map(function(p){
      var key=p.id.replace('.','');
      var authors=p.authors.join(' and ');
      return '@article{'+key+',\n  title={' + p.title + '},\n  author={' + authors + '},\n  journal={arXiv:'+p.category+'},\n  year={'+p.published.slice(0,4)+ '},\n  url={'+p.arxivUrl+'}% score '+p.score+'\n}';
    }).join('\n\n');
    blob=new Blob([bib], {type:'text/plain;charset=utf-8'});
    filename='egolens-'+Date.now()+'.bib';
  } else {
    blob=new Blob([JSON.stringify(list,null,2)], {type:'application/json'});
    filename='egolens-filtered-'+Date.now()+'.json';
  }
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url; a.download=filename; a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  toast((window.t? window.t('toast_export'):'已导出')+' '+list.length+' ('+fmt.toUpperCase()+')');
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
  var hint=document.getElementById('liveHint');
  if(hint) hint.textContent='· 筛选 '+list.length+' / '+papers.length+' · 收藏 '+favs.size;
  root.replaceChildren();
  if(papers.length===0){
    empty.style.display='block'; noRes.style.display='none'; return;
  }
  if(list.length===0){
    empty.style.display='none'; noRes.style.display='block';
    var msgEl=document.getElementById('noResultsMsg');
    const isEn = window.getLang && window.getLang()==='en';
    if(qRaw) msgEl.textContent = isEn ? 'No match for “'+qRaw+'” — try broader filters.' : '关键词 “'+qRaw+'” 没有匹配结果，试试放宽筛选或更换关键词。';
    else msgEl.textContent = isEn ? 'No papers match current filters.' : '当前筛选条件下没有匹配的论文。';
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
      if(activeTag && t===activeTag) {chip.style.background='hsl(222 47% 11%)'; chip.style.color='#fff';}
      tags.appendChild(chip);
    });
    if(p.codeUrl){ const b=el('span','badge badge-green', (window.t? window.t('badge_code'):'有代码') ); tags.appendChild(b); } else { const b=el('span','badge', (window.t? window.t('badge_nocode'):'无代码') ); tags.appendChild(b); }
    const badgeParts = badgeForScore(p.score);
    const sBadge = el('span','badge '+badgeParts[1],  ((window.t? window.t('badge_high'):'复现')+' ') +badgeParts[0]);
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
      if(favs.has(p.id)){ favs.delete(p.id); star.classList.remove('active'); star.textContent='☆'; star.setAttribute('aria-label','收藏'); toast(window.t? window.t('toast_unfav'):'已取消收藏'); }
      else { favs.add(p.id); star.classList.add('active'); star.textContent='★'; star.setAttribute('aria-label','取消收藏'); toast(window.t? window.t('toast_fav'):'已收藏'); }
      saveFavs(favs);
      document.getElementById('resultCount').textContent = getFiltered().list.length + ' papers' + (favs.size ? ' · '+favs.size+' 收藏' : '');
      if(document.getElementById('onlyFav').checked) renderList();
      var hint2=document.getElementById('liveHint');
      if(hint2) hint2.textContent='· 筛选 '+getFiltered().list.length+' / '+papers.length+' · 收藏 '+favs.size;
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
    if(favs.has(p.id)){ favs.delete(p.id); favBtn.textContent= isEnDrawer ? '☆ Favorite' : '☆ 收藏'; toast(window.t? window.t('toast_unfav'):'已取消收藏'); } else { favs.add(p.id); favBtn.textContent= isEnDrawer ? '★ Favorited' : '★ 已收藏'; toast(window.t? window.t('toast_fav'):'已收藏'); }
    saveFavs(favs); renderList();
  });
  links.appendChild(favBtn);
  // copy bibtex
  const bibBtn = el('button','btn btn-ghost'); bibBtn.type='button'; bibBtn.textContent='复制 BibTeX';
  bibBtn.addEventListener('click', async function(){
    var key=p.id.replace('.','');
    var bib='@article{'+key+',\n  title={' + p.title + '},\n  author={' + p.authors.join(' and ') + '},\n  journal={arXiv:'+p.category+'},\n  year={'+p.published.slice(0,4)+'},\n  url={'+p.arxivUrl+'}\n}';
    try{ await navigator.clipboard.writeText(bib); toast(window.t? 'BibTeX copied':'BibTeX 已复制'); }catch(e){ toast(bib.slice(0,80)); }
  });
  links.appendChild(bibBtn);
  const abs = el('p'); abs.style.fontSize='13px'; abs.style.color='var(--muted)'; 
  if(qRaw) appendHighlight(abs, p.abstract, qRaw);
  else abs.textContent=p.abstract;
  const isEnDrawer = window.getLang && window.getLang()==='en';
  const dimsTitle = el('div',null, isEnDrawer ? '6-dim Score' : '6维复现评分'); dimsTitle.style.fontWeight='700'; dimsTitle.style.marginTop='12px'; dimsTitle.style.fontSize='13px';
  const grid = el('div','dims');
  const dims = p.dimensions || {};
  [['code','代码 30'],['data','数据 20'],['env','环境 10'],['exp','实验 8'],['doc','文档 10'],['runnable','可跑 22']].forEach(function(pair){
    var k=pair[0], label=pair[1];
    const d = el('div','dim'); const v=dims[k]||0;
    d.append(el('b',null,String(v)), el('span',null,label));
    if(v>0) d.style.borderColor='#a7f3d0'; grid.appendChild(d);
  });
  const total = el('div'); total.style.marginTop='8px'; total.style.fontSize='13px';
  const b = el('b',null, (isEnDrawer ? 'Score ' : '总分 ')+p.score+' / 100 — '); const parts=badgeForScore(p.score); const sEl=el('span','badge '+parts[1], parts[0]); total.append(b,sEl);
  const note = el('p'); note.style.fontSize='12px'; note.style.color='var(--muted)'; note.textContent= isEnDrawer ? 'Rubric: code 30 + data 20 + env 10 + exp 8 + doc 10 + runnable 22. Heuristic, reproducible.' : '评分规则：code 30 + data 20 + env 10 + exp 8 + doc 10 + runnable 22，启发式可复跑，详见报告页方法。';
  body.append(h, meta, links, abs, dimsTitle, grid, total, note);
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  var closeBtn=document.getElementById('drawerClose');
  if(closeBtn) closeBtn.focus();
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer').setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function renderCharts(){
  if(typeof Chart === 'undefined'){
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
    }catch(e){}
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

  // re-render on lang switch
  window.addEventListener('egolens:lang', function(){ try{ renderFeatured(); renderList(); if(window.applyI18n) window.applyI18n(); }catch(e){} });
load();
})();
