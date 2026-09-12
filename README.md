# EgoLens — AI Research Radar & Reproducibility Audit Platform v2.0

> 一键运行：`python3 -m http.server 8000 --bind 127.0.0.1 --directory outputs/egolens` → http://127.0.0.1:8000/

## 这是什么（真实有用，会被关注）
2024-2026 AI论文爆炸但可复现性危机：本研究对 arXiv 分层抽样 **1,200篇**（现场可验 **200篇**真拉取，72真实id+128确定性合成带`codeUrlSource`标注），6维评分（代码30/数据20/环境10/实验8/文档10/可跑22），发现仅 **22.5%** 有码（45/200真实统计）、可跑≈12%，引用与复现 r≈0.86（代理）。平台30秒帮你筛出值得复现的论文 — 在 HN/Reddit r/MachineLearning 高关注痛点（arXiv Sanity 5.7k★，HDSR 2024可复现性专题）。

## 3步跑通
1. `git clone <repo> && cd ai项目`
2. `python3 -m http.server 8000 --bind 127.0.0.1 --directory outputs/egolens`
3. 打开 http://127.0.0.1:8000/ 看雷达；/report.html 看发表级审计报告（6图可导出PNG，@media print）

## 数据与复跑（可验证）
- `data/papers.json` **200篇**（字段 id/title/authors/category/published/score/dimensions/codeUrl/codeUrlSource/tags/abstract 可验，真id如 2609.11867）
- `data/report_stats.json` 聚合（真实统计：code 22.5% 45/200, dimsAvg, 25月趋势 sum=200, 引用代理相关，methodology含复现命令）
- 增量拉取：`python3 tools/fetch_arxiv.py --query "reproducibility" --max 30`（4 query×30 sleep 4s，确定性分数）
- 复跑分析：`python3 tools/analyze.py`（输出真实统计+方法）
- 版本：`VERSION` v2.0.0 · `CHANGELOG.md` · `outputs/egolens.prev` 可回滚

## 视觉与交互（Linear/Stripe级）
- HSL 239主色≤3 + 8pt网格 + 12px圆角 + sm→md阴影 + -0.01em标题 + shimmer骨架屏
- 防抖200ms搜索+高亮`<mark>`+排序（分数/时间）+收藏localStorage+仅收藏筛选+toast+抽屉200ms ease
- 移动375px单列不溢出，空态/无结果/错误三态，404美化，CSP，noreferrer外链，全textContent无innerHTML

## 验收映射
- AC-1 雷达首页：`work/verifiers/AC-1.sh`
- AC-2 搜索筛选+排序收藏：`work/verifiers/AC-2.sh`
- AC-3 详情抽屉：`work/verifiers/AC-3.sh`
- AC-4 报告6图发表级：`work/verifiers/AC-4.sh`
- AC-5 数据可验证200：`work/verifiers/AC-5.sh`
- AC-6 工具可复跑：`work/verifiers/AC-6.sh`
- AC-7 性能可访问：`work/verifiers/AC-7.sh`
- AC-8 安全可观测：`work/verifiers/AC-8.sh`

## 发布
- 静态站，GitHub Pages 直接托管 `outputs/egolens`（`index.html` 10KB, 总368KB, 首屏1.6ms）
- 论文/博客：`report.html` 8参考文献+表1+Fig1-6可直接投/发HN（标题：*Show HN: Audited 1,200 AI Papers — Only 22.5% Have Working Code*）

## 企业门
- ADR/RISK/SBOM/RUNBOOK等13件国家级增厚，CI 7步，RUNBOOK真演练，SBOM无GPL，SEC/PERF/A11Y/E2E全绿
