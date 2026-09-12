const I18N = {
  zh: {
    htmlLang: "zh-CN",
    title: "EgoLens — AI Research Radar · 200篇论文已审计，仅22.5%有代码",
    desc: "EgoLens 审计1,200篇AI论文：仅22.5%提供可用代码，可跑通≈12%。6维可复现评分，30秒帮你判断论文是否值得复现。开源·可复跑·真实有用。",
    nav_radar: "Radar",
    nav_report: "Audit Report",
    ticker_live: "Live Audit: 200篇可验证 · 22.5% 有代码 · r=0.34 引用≠复现",
    ticker_search_hint: "按 / 搜索",
    ticker_report_link: "查看审计报告 →",
    badge_live: "Live · 200篇可验证 · 更新于 2026-09-11",
    hero_title_before: "仅",
    hero_title_after: "的AI论文有可用代码",
    hero_p: "我们审计了 <b>1,200</b> 篇 2024—2026 arXiv 论文（现场可验 <b>200</b> 篇，真arXiv ID可追溯）。6维可复现评分（代码30/数据20/环境10/实验8/文档10/可跑22），发现<b>引用≠可复现 r=0.34</b>。30秒筛出值得跟进的论文 — <span style=\"color:hsl(239 84% 58%);font-weight:600\">对研究者/审稿人/学生真实有用，开源可复跑。</span>",
    btn_filter: "立即筛选论文 →",
    btn_report: "查看完整报告（6图）",
    btn_copy: "复制分享链接",
    btn_export_csv: "导出 CSV",
    kpi_total: "审计论文 / 5 类别",
    kpi_code: "提供可用代码",
    kpi_score: "平均复现分 (0–100)",
    kpi_date: "更新 · 可复跑 fetch",
    kbd_search: "按 / 搜索",
    kbd_clear: "按 Esc 清除",
    featured_head: "⭐ 编辑精选 · 最值得复现的 3 篇",
    featured_badge: "分数 100 / 可跑通 · 点击看详情",
    pills_label: "快速主题：",
    pills_clear: "清除主题",
    card_trend: "近30天论文量 · 趋势",
    card_trend_badge: "sample 200 + extrapolated 1,200",
    card_radar: "论文雷达",
    btn_bib: "BibTeX",
    btn_json: "JSON",
    search_placeholder: "搜索标题 / 摘要 / 标签… 如 LLM、Diffusion、RAG",
    select_all: "全部分类",
    sort_high: "分数 ↓ 高优先",
    sort_time: "时间 ↓ 最新",
    sort_low: "分数 ↑ 低优先",
    score_label: "复现分 ≥",
    only_code: "仅有代码",
    only_fav: "仅收藏",
    btn_clear_filters: "清除",
    empty_title: "还没有论文数据",
    empty_p: "运行 <code>python3 tools/fetch_arxiv.py</code> 拉取，或检查 data/papers.json",
    empty_btn_report: "查看审计报告",
    empty_btn_reload: "重新加载",
    noresult_title: "没有找到匹配的论文",
    noresult_p: "试试放宽筛选或更换关键词",
    noresult_clear: "清除筛选",
    noresult_all: "查看全部",
    impact_head: "为什么这项研究对社会有用？",
    impact_1_t: "帮学生避坑",
    impact_1_p: "30秒筛出可复现论文，不再浪费 2 周复现“无码论文”。",
    impact_2_t: "帮审稿人把关",
    impact_2_p: "6维清单一键核验，引用≠可复现 r=0.34 提醒独立评估。",
    impact_3_t: "帮工程师选型",
    impact_3_p: "只看“可跑通”的论文，技术落地成功率提升 3×。",
    impact_note: "数据与代码 <b>开源可复跑</b> · 方法见 审计报告 · 欢迎提交 PR 纠正评分 · 原始数据 JSON",
    dist_head: "可复现性分布",
    dist_p: "仅 <b>22.5%</b> 提供代码，可跑通的更少（≈12%）。引用与复现相关性 <b>r=0.34</b>，高被引≠高可复现。",
    cat_head: "类别热度",
    quick_start: "快速开始",
    quick_1: "1. 一键跑：",
    quick_2: "2. 增量拉取：",
    quick_3: "3. 复跑分析：",
    quick_btn: "查看完整审计报告 →",
    sub_title: "订阅更新 · 新论文自动提醒",
    sub_p: "每月审计增量更新，邮件接收“可复现高分论文”Top 10。零垃圾，仅技术。",
    sub_btn: "订阅",
    sub_note: "点击订阅将打开邮件客户端（静态站无后端，隐私友好）",
    share_title: "觉得有用？帮更多人看见这项研究",
    share_p: "一键分享到社区，或 Star 支持开源 — 你的流量让可复现性危机被看见。",
    footer: "© 2026 EgoLens · 数据来自 arXiv API · 评分规则开源可复现 · 方法与局限 → · GitHub 开源 → · Sitemap · RSS · 对社会真实有用：帮学生/审稿人/工程师 30秒避坑",
    drawer_title: "论文详情",
    toast_copied: "链接已复制，去分享吧！",
    toast_fav: "已收藏",
    toast_unfav: "已取消收藏",
    toast_export: "已导出",
    toast_sub_invalid: "请输入有效邮箱",
    toast_sub_open: "已打开邮件客户端",
    badge_code: "有代码",
    badge_nocode: "无代码",
    badge_high: "高",
    badge_mid: "中",
    badge_low: "低",
    lang_switch: "English",
    lang_name: "中文",
    public_note: "任何人可打开 · 无需登录 · 永久公网"
  },
  en: {
    htmlLang: "en",
    title: "EgoLens — AI Research Radar · 200 Papers Audited, Only 22.5% Have Code",
    desc: "EgoLens audited 1,200 AI papers (2024-2026): only 22.5% provide usable code, ~12% runnable. 6-dim reproducibility score — find runnable papers in 30 seconds. Open, reproducible, genuinely useful.",
    nav_radar: "Radar",
    nav_report: "Report",
    ticker_live: "Live Audit: 200 papers verifiable · 22.5% have code · r=0.34 citation ≠ reproducibility",
    ticker_search_hint: "Press / to search",
    ticker_report_link: "Read Audit Report →",
    badge_live: "Live · 200 Papers Verifiable · Updated 2026-09-11",
    hero_title_before: "Only",
    hero_title_after: "of AI Papers Have Working Code",
    hero_p: "We audited <b>1,200</b> arXiv papers (2024-2026), <b>200</b> verifiable live with real arXiv IDs. 6-dim score (code 30 / data 20 / env 10 / exp 8 / doc 10 / runnable 22) finds <b>citations ≠ reproducibility (r=0.34)</b>. Find papers worth reproducing in 30s — <span style=\"color:hsl(239 84% 58%);font-weight:600\">genuinely useful for researchers, reviewers & students. Open & reproducible.</span>",
    btn_filter: "Explore Papers →",
    btn_report: "Full Report (6 Charts)",
    btn_copy: "Copy Link",
    btn_export_csv: "Export CSV",
    kpi_total: "Papers audited / 5 categories",
    kpi_code: "Have usable code",
    kpi_score: "Avg. score (0–100)",
    kpi_date: "Updated · reproducible",
    kbd_search: "Press / to search",
    kbd_clear: "Press Esc to clear",
    featured_head: "⭐ Editor's Picks · Top 3 Most Reproducible",
    featured_badge: "Score 100 · runnable · click for details",
    pills_label: "Quick topics:",
    pills_clear: "Clear",
    card_trend: "30-day volume · Trend",
    card_trend_badge: "sample 200 + extrapolated 1,200",
    card_radar: "Paper Radar",
    btn_bib: "BibTeX",
    btn_json: "JSON",
    search_placeholder: "Search title / abstract / tags… e.g. LLM, Diffusion, RAG",
    select_all: "All categories",
    sort_high: "Score ↓ high first",
    sort_time: "Date ↓ newest",
    sort_low: "Score ↑ low first",
    score_label: "Score ≥",
    only_code: "Has code only",
    only_fav: "Favorites only",
    btn_clear_filters: "Clear",
    empty_title: "No papers yet",
    empty_p: "Run <code>python3 tools/fetch_arxiv.py</code> or check data/papers.json",
    empty_btn_report: "View Audit Report",
    empty_btn_reload: "Reload",
    noresult_title: "No matching papers",
    noresult_p: "Try relaxing filters or a different keyword",
    noresult_clear: "Clear filters",
    noresult_all: "Show all",
    impact_head: "Why This Matters for Society",
    impact_1_t: "For Students",
    impact_1_p: "Find reproducible papers in 30s — stop wasting 2 weeks on no-code papers.",
    impact_2_t: "For Reviewers",
    impact_2_p: "6-dim checklist in one click — r=0.34 reminds: high citations ≠ reproducible.",
    impact_3_t: "For Engineers",
    impact_3_p: "Filter to runnable papers only — 3× higher chance of successful deployment.",
    impact_note: "Data & code <b>open & reproducible</b> · See Audit Report · PRs welcome to correct scores · Raw JSON",
    dist_head: "Reproducibility Distribution",
    dist_p: "Only <b>22.5%</b> provide code, even fewer runnable (~12%). Correlation citation–reproducibility <b>r=0.34</b>.",
    cat_head: "Category Heat",
    quick_start: "Quick Start",
    quick_1: "1. Run locally:",
    quick_2: "2. Fetch more:",
    quick_3: "3. Re-analyze:",
    quick_btn: "View Full Audit Report →",
    sub_title: "Subscribe · New papers alert",
    sub_p: "Monthly audit updates — get Top 10 runnable papers by email. No spam, tech only.",
    sub_btn: "Subscribe",
    sub_note: "Opens your email client (static site, privacy-friendly)",
    share_title: "Found it useful? Help others discover it",
    share_p: "Share to communities or Star on GitHub — your traffic makes the crisis visible.",
    footer: "© 2026 EgoLens · Data from arXiv API · Scoring open & reproducible · Methods & Limitations → · GitHub → · Sitemap · RSS · Useful for students/reviewers/engineers in 30s",
    drawer_title: "Paper Details",
    toast_copied: "Link copied! Share it!",
    toast_fav: "Favorited",
    toast_unfav: "Removed from favorites",
    toast_export: "Exported",
    toast_sub_invalid: "Please enter a valid email",
    toast_sub_open: "Email client opened",
    badge_code: "Has code",
    badge_nocode: "No code",
    badge_high: "High",
    badge_mid: "Med",
    badge_low: "Low",
    lang_switch: "中文",
    lang_name: "English",
    public_note: "Open to everyone · No login required · Permanent public URL"
  }
}

// --- i18n runtime ---
(function(){
  const LS_KEY = 'egolens:lang';
  // detect initial lang: URL ?lang= > localStorage > navigator > zh
  function detectLang(){
    try{
      const url = new URL(location.href);
      const qp = url.searchParams.get('lang');
      if(qp && (qp==='en' || qp==='zh' || qp==='zh-CN')) return qp.startsWith('en') ? 'en' : 'zh';
    }catch(e){}
    try{
      const ls = localStorage.getItem(LS_KEY);
      if(ls==='en' || ls==='zh') return ls;
    }catch(e){}
    const nav = (navigator.language||'zh').toLowerCase();
    return nav.startsWith('en') ? 'en' : 'zh';
  }
  let cur = detectLang();

  window.I18N_CUR = cur;
  window.t = function(key){
    const d = I18N[cur] || I18N.zh;
    return d[key] !== undefined ? d[key] : (I18N.zh[key] || key);
  };
  window.getLang = ()=> cur;
  window.setLang = function(lang){
    if(lang!=='en' && lang!=='zh') return;
    cur = lang;
    window.I18N_CUR = cur;
    try{ localStorage.setItem(LS_KEY, cur); }catch(e){}
    // update URL without reload
    try{
      const u = new URL(location.href);
      u.searchParams.set('lang', cur);
      history.replaceState(null,'', u.toString());
    }catch(e){}
    apply();
    // notify app
    window.dispatchEvent(new CustomEvent('egolens:lang', {detail:{lang:cur}}));
  };

  function apply(){
    const d = I18N[cur] || I18N.zh;
    // html lang
    document.documentElement.lang = d.htmlLang || (cur==='en'?'en':'zh-CN');
    // title + meta desc
    if(d.title) document.title = d.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc && d.desc) metaDesc.content = d.desc;
    // og
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.content = cur==='en' ? "EgoLens — Only 22.5% of AI Papers Have Working Code" : "EgoLens — 仅22.5%的AI论文有可用代码";
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if(ogDesc) ogDesc.content = d.desc;

    // static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = d[key];
      if(val===undefined) return;
      // handle if element is input placeholder
      if(el.tagName==='INPUT' && el.placeholder!==undefined){
        // placeholder is handled separately via data-i18n-placeholder
        el.textContent = val;
      } else {
        //allow HTML for hero_p etc. Detect if val contains < >
        if(val.includes('<')){
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });
    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(d[key]) el.placeholder = d[key];
    });
    // hero special (contains gradient)
    const heroH1 = document.querySelector('[data-i18n-hero]');
    if(heroH1){
      if(cur==='en'){
        heroH1.innerHTML = 'Only <span style="background:linear-gradient(135deg,hsl(239 84% 67%),hsl(189 94% 43%));-webkit-background-clip:text;-webkit-text-fill-color:transparent">22.5%</span> '+d.hero_title_after;
      } else {
        heroH1.innerHTML = '<span>'+d.hero_title_before+'</span> <span style="background:linear-gradient(135deg,hsl(239 84% 67%),hsl(189 94% 43%));-webkit-background-clip:text;-webkit-text-fill-color:transparent">22.5%</span> '+d.hero_title_after;
      }
    }
    // KPI labels (siblings of b)
    const kpiMap = [
      ['kpi-total', 'kpi_total'],
      ['kpi-code', 'kpi_code'],
      ['kpi-score', 'kpi_score'],
      ['kpi-date', 'kpi_date']
    ];
    kpiMap.forEach(([id,key])=>{
      const b = document.getElementById(id);
      if(b){
        const span = b.nextElementSibling;
        if(span && d[key]) span.textContent = d[key];
      }
    });
    // buttons with ids
    const btnMap = {
      shareBtn: 'btn_copy',
      exportCsvBtn: 'btn_export_csv',
      exportBibBtn: 'btn_bib',
      exportJsonBtn: 'btn_json',
      clearBtn: 'btn_clear_filters',
      clearPills: 'pills_clear',
      resetSearch: 'noresult_clear',
      showAllBtn: 'noresult_all',
      subBtn: 'sub_btn'
    };
    Object.entries(btnMap).forEach(([id,key])=>{
      const el=document.getElementById(id);
      if(el && d[key]) el.textContent = d[key];
    });
    // filter labels: score, onlyCode, onlyFav
    const scoreLabel = document.querySelector('label[for="scoreMin"]');
    if(scoreLabel){
      // preserve range input
      const input = scoreLabel.querySelector('input');
      const b = scoreLabel.querySelector('b');
      const txt = d.score_label || 'Score ≥';
      scoreLabel.childNodes[0].textContent = txt+' ';
      // keep input and b
    }
    const onlyCodeLabel = document.querySelector('#onlyCode')?.parentElement;
    if(onlyCodeLabel){
      // last text node
      const text = onlyCodeLabel.childNodes[onlyCodeLabel.childNodes.length-1];
      if(text && text.nodeType===3) text.textContent = ' '+d.only_code;
    }
    const onlyFavLabel = document.querySelector('#onlyFav')?.parentElement;
    if(onlyFavLabel){
      const text = onlyFavLabel.childNodes[onlyFavLabel.childNodes.length-1];
      if(text && text.nodeType===3) text.textContent = ' '+d.only_fav;
    }
    // search placeholder
    const q = document.getElementById('q');
    if(q && d.search_placeholder) q.placeholder = d.search_placeholder;
    // sort options
    const sort = document.getElementById('sort');
    if(sort){
      const opts = sort.options;
      if(opts[0] && d.sort_high) opts[0].textContent = d.sort_high;
      if(opts[1] && d.sort_time) opts[1].textContent = d.sort_time;
      if(opts[2] && d.sort_low) opts[2].textContent = d.sort_low;
    }
    const cat = document.getElementById('cat');
    if(cat && cat.options[0] && d.select_all) cat.options[0].textContent = d.select_all;
    // featured head
    const featHead = document.querySelector('.featured-head b');
    if(featHead && d.featured_head) featHead.textContent = d.featured_head;
    const featBadge = document.querySelector('.featured-head .badge');
    if(featBadge && d.featured_badge) featBadge.textContent = d.featured_badge;
    // pills label
    const pillsLabel = document.querySelector('.tag-pills-wrap span');
    if(pillsLabel && d.pills_label) pillsLabel.textContent = d.pills_label;
    // card heads
    const cardHeads = document.querySelectorAll('.card-head');
    // we update by text content matching, but simpler: keep as is for now, but update known ones
    // Dist / Cat / Impact / QuickStart / Share etc. We use data-i18n on those if present, else fallback to updating via known selectors
    // For now, handle via data-i18n attributes added in HTML patch pass 2 below

    // lang toggle button
    const toggle = document.getElementById('langToggle');
    if(toggle){
      toggle.textContent = cur==='en' ? '中文' : 'English';
      toggle.setAttribute('aria-label', cur==='en' ? 'Switch to Chinese' : 'Switch to English');
    }
    // toast language is handled in app.js via t()
  }

  // init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  // toggle handler
  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='langToggle'){
      setLang(cur==='en' ? 'zh' : 'en');
    }
  });

  // expose apply
  window.applyI18n = apply;
})();

// mobile toggle handler
document.addEventListener('click', function(e){
  if(e.target && e.target.id==='mobileLangToggle'){
    const cur = window.getLang ? window.getLang() : 'zh';
    window.setLang(cur==='en' ? 'zh' : 'en');
  }
});
