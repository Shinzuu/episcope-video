# Script review log

Three passes over `script-content.js`, run on 2026-10-20. All local; the script was not pasted into any online
tool or detector.

## (a) Read-aloud timing at 110 wpm

Tool: `node tools/timing.mjs 110` (and `105` for the slow case). Spoken words exclude the cue lines. Each
`[[pending]]` placeholder counts as 5 words. Each section adds its pause seconds for slide changes and demos
(35 s for the live pipeline run, 25 s for the live dashboard, 2 to 4 s elsewhere).

| Section | Speaker | Words | Pause s | Time | Starts |
|---|---|---:|---:|---:|---:|
| 1a Opening | s1 | 59 | 4 | 0:36 | 0:00 |
| 1b The problem | s1 | 91 | 2 | 0:51 | 0:36 |
| 1c Stakeholders and conflicts | s1 | 136 | 4 | 1:18 | 1:27 |
| 1d The data story | s1 | 78 | 2 | 0:44 | 2:46 |
| 1e Architecture | s1 | 91 | 3 | 0:52 | 3:30 |
| 3a My part and the generator | s3 | 74 | 3 | 0:43 | 4:23 |
| 3b Bronze | s3 | 64 | 2 | 0:36 | 5:06 |
| 3c Silver: rules, quarantine, privacy | s3 | 113 | 4 | 1:05 | 5:43 |
| 3d Gold and lineage | s3 | 55 | 2 | 0:32 | 6:49 |
| 3e Live run: new drop, re-run, quarantine | s3 | 72 | 35 | 1:14 | 7:21 |
| 3f Spark choices and scaling | s3 | 81 | 2 | 0:46 | 8:35 |
| 4a Detection: why EARS C2 and CUSUM | s4 | 106 | 3 | 1:00 | 9:21 |
| 4b The reporting artefact | s4 | 51 | 2 | 0:29 | 10:22 |
| 4c Detection against the baseline | s4 | 70 | 2 | 0:40 | 10:52 |
| 4d Forecasts and the backtest | s4 | 102 | 2 | 0:57 | 11:32 |
| 4e From forecasts to supplies | s4 | 128 | 4 | 1:13 | 12:30 |
| 4f Preparedness calendar | s4 | 46 | 2 | 0:27 | 13:43 |
| 2a Why the dashboard looks like this | s2 | 62 | 3 | 0:36 | 14:10 |
| 2b Live walkthrough | s2 | 147 | 27 | 1:47 | 14:47 |
| 2c Usability check | s2 | 58 | 2 | 0:33 | 16:34 |
| 2d Privacy and ethics | s2 | 79 | 2 | 0:45 | 17:08 |
| 2e Recommendations and limits | s2 | 96 | 2 | 0:54 | 17:53 |
| 2f Close | s2 | 17 | 3 | 0:12 | 18:48 |

| Speaker | Slides | Words | At 110 wpm | At 105 wpm | 4 to 5 min at 110 |
|---|---|---:|---:|---:|---|
| s1 Rafi | 6 (+ title) | 455 | 4:23 | 4:35 | yes |
| s3 Shezan | 7 | 459 | 4:58 | 5:10 | yes |
| s4 Rimjhim | 7 | 503 | 4:49 | 5:02 | yes |
| s2 Samira | 6 (+ closing) | 459 | 4:49 | 5:01 | yes |
| **Total** | 28 | 1,876 | **19:00** | **19:49** | limit 15:00 to 20:00 |

Changes made in this pass: the first draft ran 19:16 at 110 wpm and 20:05 at 105 wpm, which is over the limit
for slow readers. Cut about 160 words, mostly repeated explanations (Shezan's transcript was written for 145
wpm and had 654 words). Samira's part was under 4 minutes in the first draft, so the usability section got a
concrete task description and the dashboard section a freshness line.

Word counts sit a little under the brief's 470 to 500 per speaker. That is on purpose: the brief also asks to
keep pauses for slide changes and demos, and two speakers carry a live demo (35 s and 25 s of silence). At the
brief's word counts the total would pass 20 minutes at 105 wpm.

2026-10-21 update: names changed (Rafi, Rimjhim Dey), the group-number line removed, and Samira's dashboard
walkthrough split over two slides with one added explanation of the precomputed what-if grid, which brought her
from 400 to 448 words. Every speaker is now inside 4 to 5 minutes at 110 wpm (440 to 550 words). Each speaker should rehearse once with a timer.

## (b) Style pass (`no-ai-slop` skill)

Checked by script for the brief's banned words (delve, crucial, robust, leverage, seamless, in today's world,
plays a vital role, comprehensive, utilize) and the skill's list (harness, unlock, powerful, testament, serves
as, not just / not only, as you can see, in conclusion, hedges), em and en dashes, three-item word lists and
sentences over 24 words. Then read through by hand.

Found and fixed:
- "the weeks they really happened": dropped the adverb.
- "before the season, not during it": balanced-clause tic; now "before the season starts".
- Closing line "Messy reports go in, and a plan the Ministry can check comes out": a recap slogan; removed.
- "Many people care about this system": brochure opener; now "People who use this system don't want the same
  things."
- Shezan's "That one condition gives us both things the brief asks for": announces before it says; cut.

Kept on purpose:
- Contrasts that carry a technical point ("by the week of onset, not the week of report", "missing, not zero").
- The five-resource list in 4e; it is the actual list of resources, not a rhythm triad.
- Final numbers are written as digits, exactly as in `docs/FINAL-NUMBERS.md`; small counts are spelled out.
- No em dashes anywhere in the script. Longest sentence: 24 words.

## (c) Fact pass against the EpiScope repo

Every claim checked against a file in the EpiScope project repo (read only).

| Claim | Source | Result |
|---|---|---|
| 64 districts, 8 divisions | `data/reference/districts.csv` | ok |
| Population from 2022 census via HDX, weather from Open-Meteo | `README.md`, districts.csv `population_2022` | ok |
| Dengue peaks around October, as in OpenDengue | `docs/proposal.md` §1 | ok |
| 35 planted outbreaks; EARS C2 finds 33, CUSUM 32 | `docs/FINAL-NUMBERS.md` (`detection_tradeoff.json`) | ok (final) |
| ~2% repeated encounter IDs, orphan facilities, impossible ages | `generator/config.py` `DUP_RATE` 0.02, `ORPHAN_RATE`, `INVALID_AGE_RATE` | ok |
| Facility silent three weeks then back-fills | `ground_truth/artefacts.csv` (21 Oct to 10 Nov, back-fill 11 Nov) | ok |
| Bronze stores strings + batch ID, load time, SHA-256 checksum; skips seen checksums | `pipeline/bronze/ingest.py`, `SUBMIT-AUDIT.md` ING-1 | ok |
| Files found by pattern, no dates in code | `SUBMIT-AUDIT.md`, proposal risk 3 | ok |
| 14 encounter rules, 7 facility, 7 stock | `dashboard/data/dq.json` rule keys | ok |
| Quarantine keeps every reason code | `pipeline/quality/engine.py` `reason_codes` | ok |
| 1,367,440 quarantined of 34,136,930 (4.0%) | `docs/FINAL-NUMBERS.md` (`sf1_final_run.json`) | ok (final, SF=1) |
| HMAC-SHA256 from Spark `sha2`, no UDF; key in `.env` | `pipeline/privacy/deid.py`, audit | ok |
| Age becomes an age band | `pipeline/silver/build.py` line 163 | ok |
| MERGE on encounter_id, replace only if later report_date | `pipeline/silver/build.py` line 202 | ok |
| Gold counts by onset week, keeps batch IDs | `SUBMIT-AUDIT.md` DQ-3, `analytics/detection/prepare.py` docstring | ok |
| Hidden-drop drill: seed 4675, +8,888 rows, 0 duplicates, 9.76 MB, 28.6 min, pass | `docs/FINAL-NUMBERS.md` (`hidden_drop_drill.json`), report IV-G | ok (final) |
| `make drop DROP_SEED=…` is a 14-day drop | `Makefile` line 9 | ok |
| Broadcast joins, AQE on | `pipeline/silver/build.py` 167, `pipeline/spark.py` 27 | ok |
| Partition by year only | `partition_by=["epi_year"]` in silver and gold | ok |
| Scaling 15.4 / 20.4 / 28.3 min (pass, limit 45), 25.0 min on the final code; silver 325 to 214 s; backtest 325 to 165 s | `docs/FINAL-NUMBERS.md` (`scaling.json`, `silver_optimisation.json`, `backtest_optimisation.json`) | ok (final) |
| EARS C2 lags 3 to 9, threshold 4.0; CUSUM k 0.5, h 6.5 | `docs/FINAL-NUMBERS.md`, report Table IV | ok (final) |
| Farrington needs about five years | `docs/proposal.md` §3 | ok |
| Completeness below 0.8 is missing, else scaled by 1/completeness | `analytics/detection/config.py`, `prepare.py` | ok |
| EARS C2 at 4.0: 33 of 35 (0.94), 1.89 false/district-yr, median 8 days, PPV 0.15, 91% within 14 days; CUSUM h 6.5: 32 of 35 (0.91), 1.82, 9.5 days, PPV 0.25 | `docs/FINAL-NUMBERS.md` | ok (final) |
| NB2 model, rain and temperature lag 4 to 8, dengue and diarrhoea, 52 rolling origins | `analytics/forecast/model.py`, `backtest.py` | ok |
| Relative WIS 0.84 (dengue 0.89, diarrhoea 0.72); MAE 113 vs 133; coverage 0.79 vs 0.77 | `docs/FINAL-NUMBERS.md` (`backtest_metrics.csv`) | ok (final) |
| Five resources, rates in one file | `analytics/forecast/demand_assumptions.py` | ok |
| LP in PuLP/CBC, budget, transport per division, equity floor min(α · population share, need), never above need | `analytics/optimise/lp.py`, report V-C | ok (final) |
| Half of B_ref: LP 67.8% vs 34.4% population split, α 0; all 64 districts, top-5 share 0.22, Gini 0.27 (before fix 1.00, 0.98); floor α 0.1 to 0.9 costs 2.5 points (65.3%), α 1 costs 1.5 | `docs/FINAL-NUMBERS.md` (`allocation_summary.json`, `allocation_diagnosis.md`, `allocation_curve.csv`) | ok (final; old 25%/20%/0.24% claims removed) |
| Dengue onset ~week 32, peak ~39, stock by 29, campaign by 26 | `docs/experiments/calendar_summary.csv` (median across divisions) | ok, **not listed in FINAL-NUMBERS.md** |
| Week 26 is late June | ISO calendar 2025 | ok |
| D3 v7 only, export under 10 MB, five linked views, 80% band, hatched cells under 5, what-if sliders, freshness line | `dashboard/`, `SUBMIT-AUDIT.md`, screenshots in `assets/` | ok |
| Simulated persona walkthroughs run with AI agents: round 1 0 of 15 tasks, round 2 13 of 15; 48 problems, 26 fixed, 20 partly, 2 not | `docs/FINAL-NUMBERS.md` (`docs/usability/`) | ok (final; never called users or participants) |
| Complementary suppression, k-anonymity check | `pipeline/privacy/suppression.py`, `kanon.py` | ok |
| Forecast bands ignore parameter uncertainty | `analytics/forecast/model.py` docstring | ok |
| Streaming alerts 219.2 s at SF=1 (30 s trigger) | `docs/FINAL-NUMBERS.md` (`stream_latency.json`) | ok (final) |

Fixes from this pass:
- "We haven't built streaming" was about to become false: replaced by a pending marker, and the slide now says
  "status pending". Shezan's line now says forecasts and allocations run as a daily batch, which stays true
  either way.
- The calendar line said "peaks around week 38, in mid September" while the opening says dengue peaks around
  October. Both come from the repo (STL seasonal peak vs the OpenDengue reference), but side by side they sound
  like a contradiction. Dropped "mid September".

## 2026-10-21: sync with the final numbers

Every headline number in the slides and script now comes from `docs/FINAL-NUMBERS.md` in the project repo
(final SF=1 build, commit a99339c). The allocation claims were rewritten after the allocation fix
(`allocation_diagnosis.md`). The usability check is described only as "simulated persona walkthroughs run
with AI agents". The hidden-drop drill is the one result still marked pending (slide 13, script 3e).
Calendar weeks come from `calendar_summary.csv`, which FINAL-NUMBERS.md does not list; they stay shaded in
the script. Dashboard screenshots were retaken on the SF=0.25 export of 21 Oct (fixed allocation).

Timing after the sync: Shezan, Rimjhim and Samira gained numbers, so about 60 words of repeated wording were
cut (Shezan's daily-batch line shortened, the "instructor's test" lead-in, one freshness line and one "instant"
line from Samira, the rates-file line from Rimjhim). Every speaker is between 4:22 and 4:57 at 110 wpm.

## 2026-10-21 (later): last sync after the examiner review and the allocation cap

Checked every number and claim again against `docs/FINAL-NUMBERS.md` and the report (`docs/EpiScope-report.pdf`,
read with pdftotext). Changes:
- Hidden-drop drill filled in (slide 13, script 3e): seed 4675, +8,888 rows, 0 duplicates, 9.76 MB, 28.6 min.
  No pending result is left.
- SF=1 on the final code, 25.0 min, added next to the 28.3-min timed run (slide 14, script 3f).
- Allocation capped at need: the slide 19 constraint, the alpha line in 4e, and the efficiency-equity curve
  (`allocation_curve.csv` re-extracted; the line is now flat at 65.3% for α 0.1 to 0.9 instead of falling to
  36%). Slide 20 and 4e now give the cost of a floor: 2.5 points, α 1 costs 1.5.
- Allocation screenshot (slide 24) replaced by the report's final SF=1 figure; the old one said the plan "can send
  a district more than its own shortfall".
- Unchanged and still matching: detection (1.89 and 1.82 false alerts; the report rounds to "about two"),
  backtest (overall 0.84, dengue 0.89, diarrhoea 0.72; the report's per-horizon rows are not on a slide).

Timing: 19:00 at 110 wpm, every speaker between 4:23 and 4:58. Shezan lost "That's my layer" to stay under 5 minutes.

