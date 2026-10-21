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
| 1b The problem | s1 | 89 | 2 | 0:50 | 0:36 |
| 1c Stakeholders and conflicts | s1 | 136 | 4 | 1:18 | 1:26 |
| 1d The data story | s1 | 78 | 2 | 0:44 | 2:44 |
| 1e Architecture | s1 | 91 | 3 | 0:52 | 3:29 |
| 3a My part and the generator | s3 | 74 | 3 | 0:43 | 4:22 |
| 3b Bronze | s3 | 64 | 2 | 0:36 | 5:05 |
| 3c Silver: rules, quarantine, privacy | s3 | 121 | 4 | 1:10 | 5:42 |
| 3d Gold and lineage | s3 | 60 | 2 | 0:34 | 6:52 |
| 3e Live run: new drop, re-run, quarantine | s3 | 72 | 35 | 1:14 | 7:27 |
| 3f Spark choices and scaling | s3 | 64 | 2 | 0:36 | 8:41 |
| 4a Detection: why EARS C2 and CUSUM | s4 | 106 | 3 | 1:00 | 9:18 |
| 4b The reporting artefact | s4 | 51 | 2 | 0:29 | 10:19 |
| 4c Detection against the baseline | s4 | 69 | 2 | 0:39 | 10:48 |
| 4d Forecasts and the backtest | s4 | 90 | 2 | 0:51 | 11:28 |
| 4e From forecasts to supplies | s4 | 107 | 4 | 1:02 | 12:19 |
| 4f Preparedness calendar | s4 | 46 | 2 | 0:27 | 13:22 |
| 2a Why the dashboard looks like this | s2 | 71 | 3 | 0:41 | 13:49 |
| 2b Live walkthrough | s2 | 155 | 27 | 1:51 | 14:30 |
| 2c Usability check | s2 | 39 | 2 | 0:23 | 16:22 |
| 2d Privacy and ethics | s2 | 79 | 2 | 0:45 | 16:45 |
| 2e Recommendations and limits | s2 | 87 | 2 | 0:49 | 17:30 |
| 2f Close | s2 | 17 | 3 | 0:12 | 18:20 |

| Speaker | Slides | Words | At 110 wpm | At 105 wpm | 4 to 5 min at 110 |
|---|---|---:|---:|---:|---|
| s1 Rafi | 6 (+ title) | 453 | 4:22 | 4:33 | yes |
| s3 Shezan | 7 | 455 | 4:56 | 5:08 | yes |
| s4 Rimjhim | 7 | 469 | 4:30 | 4:43 | yes |
| s2 Samira | 6 (+ closing) | 448 | 4:43 | 4:55 | yes |
| **Total** | 28 | 1,825 | **18:32** | **19:19** | limit 15:00 to 20:00 |

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
- Big numbers stay as digits inside draft markers (66,979, 8,292) so they can be swapped after the v1.0 run;
  small numbers are spelled out the way a person says them.
- No em dashes anywhere in the script. Longest sentence: 24 words.

## (c) Fact pass against the EpiScope repo

Every claim checked against a file in the EpiScope project repo (read only).

| Claim | Source | Result |
|---|---|---|
| 64 districts, 8 divisions | `data/reference/districts.csv` | ok |
| Population from 2022 census via HDX, weather from Open-Meteo | `README.md`, districts.csv `population_2022` | ok |
| Dengue peaks around October, as in OpenDengue | `docs/proposal.md` §1 | ok |
| 35 planted outbreaks, only evaluation reads them | `ground_truth/outbreaks.csv`, `analytics/evaluation/run.py` docstring | ok (draft run, seed 42) |
| ~2% repeated encounter IDs, orphan facilities, impossible ages | `generator/config.py` `DUP_RATE` 0.02, `ORPHAN_RATE`, `INVALID_AGE_RATE` | ok |
| Facility silent three weeks then back-fills | `ground_truth/artefacts.csv` (21 Oct to 10 Nov, back-fill 11 Nov) | ok |
| Bronze stores strings + batch ID, load time, SHA-256 checksum; skips seen checksums | `pipeline/bronze/ingest.py`, `SUBMIT-AUDIT.md` ING-1 | ok |
| Files found by pattern, no dates in code | `SUBMIT-AUDIT.md`, proposal risk 3 | ok |
| 14 encounter rules, 7 facility, 7 stock | `dashboard/data/dq.json` rule keys | ok |
| Quarantine keeps every reason code | `pipeline/quality/engine.py` `reason_codes` | ok |
| 66,979 quarantined of 1,681,896 (4.0%) | `dashboard/data/dq.json` | ok (draft run) |
| HMAC-SHA256 from Spark `sha2`, no UDF; key in `.env` | `pipeline/privacy/deid.py`, audit | ok |
| Age becomes an age band | `pipeline/silver/build.py` line 163 | ok |
| MERGE on encounter_id, replace only if later report_date | `pipeline/silver/build.py` line 202 | ok |
| Gold counts by onset week, keeps batch IDs | `SUBMIT-AUDIT.md` DQ-3, `analytics/detection/prepare.py` docstring | ok |
| Drill: +8,292 rows, 0 duplicates after re-run, 9.64 MB | `docs/experiments/hidden_drop_drill.json` | ok (SF 0.05) |
| `make drop DROP_SEED=…` is a 14-day drop | `Makefile` line 9 | ok |
| Broadcast joins, AQE on | `pipeline/silver/build.py` 167, `pipeline/spark.py` 27 | ok |
| Partition by year only | `partition_by=["epi_year"]` in silver and gold | ok |
| Scaling runtimes | `docs/experiments/scaling.json` | **missing: marked pending** |
| EARS C2 lags 3 to 9, threshold 3; CUSUM k 0.5, h 5 | `analytics/detection/config.py` | ok |
| Farrington needs about five years | `docs/proposal.md` §3 | ok |
| Completeness below 0.8 is missing, else scaled by 1/completeness | `analytics/detection/config.py`, `prepare.py` | ok |
| Detection sensitivity and false alerts | no result file | **marked pending** |
| NB2 model, rain and temperature lag 4 to 8, dengue and diarrhoea, 52 rolling origins | `analytics/forecast/model.py`, `backtest.py` | ok |
| Backtest MAE, coverage, relative WIS | no result file | **marked pending** |
| Five resources, rates in one file | `analytics/forecast/demand_assumptions.py` | ok |
| LP in PuLP/CBC, budget, transport per division, equity floor | `analytics/optimise/lp.py` | ok |
| At 0.25 × budget: α 0 meets 25%, α 0.2 meets 20%, population split 0.24% | `docs/experiments/allocation_curve.csv` | ok (draft run with synthetic climate; the run's need is tiny, so re-run on v1.0) |
| Dengue onset ~week 32, peak ~38, stock by 29, campaign by 26 | `docs/experiments/calendar_summary.csv` | ok (median across divisions; draft run) |
| Week 26 is late June | ISO calendar 2025 | ok |
| D3 v7 only, export under 10 MB, five linked views, 80% band, hatched cells under 5, what-if sliders, freshness line | `dashboard/`, `SUBMIT-AUDIT.md`, screenshots in `assets/` | ok |
| Usability test with two non-CS users | none in repo | **marked pending** |
| Complementary suppression, k-anonymity check | `pipeline/privacy/suppression.py`, `kanon.py` | ok |
| Forecast bands ignore parameter uncertainty | `analytics/forecast/model.py` docstring | ok |
| No streaming | `pipeline/stream.py` appeared during this review (uncommitted, ING-6) | **changed to pending** |

Fixes from this pass:
- "We haven't built streaming" was about to become false: replaced by a pending marker, and the slide now says
  "status pending". Shezan's line now says forecasts and allocations run as a daily batch, which stays true
  either way.
- The calendar line said "peaks around week 38, in mid September" while the opening says dengue peaks around
  October. Both come from the repo (STL seasonal peak vs the OpenDengue reference), but side by side they sound
  like a contradiction. Dropped "mid September".

Still to do before recording: re-run `python3 tools/extract_data.py` on the v1.0 checkout so the charts update,
replace every shaded draft number and every pending box, then run `node tools/timing.mjs` again.
