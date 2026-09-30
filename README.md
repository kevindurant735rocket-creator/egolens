# EgoLens

**An open radar for researchers triaging which AI papers are worth reproducing.**

A static, dependency-free web app that scores 2024–2026 arXiv papers on a 6-dimension
reproducibility rubric, so you can decide what to re-implement before you spend a week
on it. No build step, no API keys, no account.

> **200 papers · 6 dimensions · mean score 44.7/100 · 22.5% carry a code link**

**Read the "What this is not" section before citing any of these numbers.** Roughly a
third of this repository's headline statistics are synthetic by construction, and the
project is explicit about which ones.

## What it does

- **Radar view** (`index.html`) — all 200 papers, searchable, sortable by score or date,
  star/favourite filter persisted to `localStorage`, click any row for a detail drawer.
- **6-dimension rubric**, 100 points total:

| dimension | max | mean achieved |
|---|---|---|
| code | 30 | **8.0** |
| data | 20 | 13.6 |
| environment | 10 | 5.3 |
| experiment protocol | 8 | 7.8 |
| documentation | 10 | 4.5 |
| runnable end-to-end | 22 | 5.5 |
| **total** | **100** | **44.7** |

  The shape is the interesting part: papers describe *what they did* reasonably well
  (experiment protocol 7.8/8) and describe *how to rerun it* badly (documentation 4.5/10,
  runnable 5.5/22, code 8.0/30).

- **Audit report** (`report.html`) — the long-form write-up with the rubric table,
  category breakdown, threat analysis, 8 references and 6 exportable figures with print
  styles.
- **Bilingual** — full zh/en via `i18n.js`, switchable in the header.

## Run it

```bash
git clone https://github.com/kevindurant735rocket-creator/egolens
cd egolens
python3 -m http.server 8000 --bind 127.0.0.1
# http://127.0.0.1:8000/          radar
# http://127.0.0.1:8000/report.html   audit report
```

A static server is genuinely all it needs — `index.html` opens from the filesystem too,
though a server is required for `fetch()` of the JSON. No npm, no build, no network at
runtime beyond loading the page itself.

## Check the data yourself

Every number in the UI comes from two committed JSON files. You can re-derive the
headline figures in one command, no dependencies:

```console
$ python3 -c "
import json, collections
papers = json.load(open('data/papers.json'))
stats  = json.load(open('data/report_stats.json'))
n = len(papers)
code = [p for p in papers if p.get('codeUrl')]
src  = collections.Counter(p.get('codeUrlSource', 'missing') for p in code)
print(f'records                {n}')
print(f'claimed sampling frame {stats[\"total\"]}')
print(f'with a codeUrl         {len(code)}  ({len(code)/n:.1%})')
print(f'  of those, extracted  {src[\"extracted\"]}')
print(f'  of those, synthetic  {src[\"synthetic\"]}')
print(f'synthetic titles       {sum(1 for p in papers if \"Reproducibility Study\" in p.get(\"title\",\"\"))}')
mx = dict(code=30, data=20, env=10, exp=8, doc=10, runnable=22)
for k, v in stats['dimsAvg'].items():
    print(f'  {k:<9}{v:6.1f} / {mx[k]}')
print(f'  {\"MEAN\":<9}{sum(stats[\"dimsAvg\"].values()):6.1f} / 100')
"
records                200
claimed sampling frame 1200
with a codeUrl         45  (22.5%)
  of those, extracted  6
  of those, synthetic  39
synthetic titles       80
  code        8.0 / 30
  data       13.6 / 20
  env         5.3 / 10
  exp         7.8 / 8
  doc         4.5 / 10
  runnable    5.5 / 22
  MEAN       44.7 / 100
```

## What this is not

This project is honest about its own limits, which is why the limits are worth reading
before you cite anything.

- **1,200 is a sampling frame, not a count of audited papers.** The headline says
  "1,200 papers" because that was the intended stratified sample across cs.CL / cs.LG /
  cs.CV / cs.AI / stat.ML. The committed dataset is **200 records**. One hundred and
  twenty of those have genuine arXiv titles; **80 carry a templated synthetic title** of
  the form *"…— Reproducibility Study (NNN)"*.
- **22.5% is not the real code-availability rate for AI papers.** 45 of 200 records
  carry a `codeUrl`, but only **6** of those 45 are marked `codeUrlSource: "extracted"`
  — genuinely regex-pulled from a real paper's abstract. The other **39** are
  deterministic hash-generated placeholder URLs. The provenance field exists precisely
  so this distinction is checkable, and it is why the field is in the data.
- **r = 0.864 is not a citation correlation.** It is Pearson between the 6-dim score and
  a *heuristic citation proxy* computed as `score*0.55 + age*0.25 + deterministic noise`.
  No citation API was ever called. `report_stats.json` says this in
  `citationCorrelationEvidence.note`, and the honest description of the finding is
  "the proxy is built from the score", which is why r is high.
- **The monthly trend is partly simulated.** `trendMethod` is recorded as *"keep real
  months; fill missing last 12 with avg*hash-factor simulation"*. The tell is visible in
  the data: **120 of 200 records land in 2026-09**, because that is the collection month.
  Do not read the trend chart as a publication-rate time series.
- **The 6-dim score is heuristics, not human review.** Scoring is keyword matching plus
  abstract length, with a deterministic `±3` hash perturbation for cross-run stability.
  It is reproducible and it is consistent — it is not a careful human judgement, and it
  has not been validated against expert annotation.
- **`report.html` contains a stale draft.** It states 38.2% code availability, r=0.34 and
  a 47.1 mean. Those numbers are from an earlier version and contradict
  `data/report_stats.json`. **Trust `report_stats.json`;** it is what the UI reads and
  what this README is derived from.
- **`tools/` is not in this repository.** Older docs reference
  `tools/fetch_arxiv.py` and `tools/analyze.py`; neither file is present. You can serve
  and inspect the site, but you cannot re-run the original arXiv collection from this
  repo. The acked collection window was 2024-09-24 to 2026-09-10.
- **This is not a leaderboard, and not a claim about any author.** No paper here is
  ranked against others, and no author or lab is named as failing to release code.
- **It is not a substitute for actually trying to reproduce something.** The rubric
  predicts friction. It does not tell you whether the paper's *result* holds.

## What it is actually good for

Used as a **triage filter**, it is genuinely useful and cheap: the dimension means tell
you which papers are likely to be cheap to rerun (high `experiment`, low `code` gaps) and
which are documentation deserts. Used as a **statistical claim about the literature**,
it is not — and the repository says so itself.

The most defensible statement this data supports is narrow: *among the papers in this
sample, the gap between describing an experiment and making it rerunnable is large, and
the scoring dimensions that measure rerunnability score lowest.*

## Layout

```
index.html      radar UI
report.html     long-form audit report (rubric, categories, threats, 6 figures)
app.js          radar logic: search, sort, favourites, detail drawer
i18n.js         zh/en strings
data/
  papers.json        200 records, per-paper dimensions + codeUrlSource provenance
  report_stats.json  aggregates + the `methodology` block describing how they were made
style.css, og.png, og.svg, favicon assets
VERSION (v2.0.0), CHANGELOG.md, sitemap.xml, robots.txt, 404.html
```

Deployment is GitHub Pages with no build: publish the repository root as-is.

## License

**MIT** — see [`LICENSE`](LICENSE). No personal data, no paid APIs, no telemetry.
