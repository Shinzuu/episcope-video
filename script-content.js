// The spoken script. One source for script.html (phone) and the slide numbers in index.html.
//
// Markup inside a paragraph:
//   {s1} {s2} {s3} {s4}  speaker short name from config.json
//   {{text}}            a number from a repo file that docs/FINAL-NUMBERS.md does not list; check it before recording
//   [[pending: what]]   a result that is not final yet (none left); fill in, never guess
// A paragraph that starts with "[" and ends with "]" is a cue (NEXT SLIDE, SHOW, PAUSE), not spoken.
// `pause` is the seconds of silence the section needs for slide changes and demo moments.
//
// Speaking order: Rafi (1a, 1t) -> Samira (1b, 1c) -> Shezan (1d to 3c) -> Samira (3g) -> Shezan (3d to 3f)
// -> Samira (3h) -> Rafi (4a, 4b, 4d) -> Samira (4g, 4c) -> Rafi (4e, 4f) -> Rimjhim (2a to 2c) -> Samira (2d to 2f).
// Each person presents their own lead area from the report's contribution matrix.
window.EPI_SCRIPT = [
  // ---------------- Speaker 1 (Tahsin Ahmed Rafi, analytics): opening and team (chapter 1) ----------------
  {
    id: "1a", speaker: "s1", title: "Opening", slides: [1], chapter: 1, pause: 3,
    paras: [
      "[SHOW slide 1, camera on; the 3D bars grow in]",
      "Assalamu alaikum. We're the EpiScope team, with a big data platform for outbreaks and supplies in Bangladesh.",
      "Each bar is one of our sixty-four districts, as tall as its population in the 2022 census. The tallest is Dhaka.",
    ],
  },
  {
    id: "1t", speaker: "s1", title: "Meet our team", slides: [2], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "I'm {n1}. My part is analytics: outbreak detection, forecasting and supplies. {n3} covers data engineering. {n4} covers the dashboard. {n2} covers platform and evaluation: privacy, scaling and how well our methods work. She starts with the problem.",
    ],
  },

  // ---------------- Speaker 2 (Samira Sultana, platform and evaluation): problem and conflicts (chapter 1) ----------------
  {
    id: "1b", speaker: "s2", title: "The problem", slides: [3], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thanks, {s1}. My part is platform and evaluation. First, the problem.",
      "Dengue, diarrhoea, flu-like illness and malaria come every year. Reports from all sixty-four districts arrive late, some facilities go quiet for weeks, and one patient can appear twice.",
      "The Ministry wants early warnings, forecasts one to four weeks ahead, a plan to split a fixed stock, and a calendar for when to get ready. Its users aren't data scientists.",
    ],
  },
  {
    id: "1c", speaker: "s2", title: "Stakeholders and conflicts", slides: [4, 5], chapter: 1, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "Conflict one: a district officer wants early alerts. An epidemiologist wants fewer false alarms, or people stop listening.",
      "[NEXT SLIDE]",
      "Two, privacy: vector-control teams want small-area maps, but a count of two in a small place can point to a real person. So we publish by district and week, and hide counts from one to four.",
      "Three, efficiency against equity: supplies sent only where they help most leave some districts with nothing. One number, alpha, controls that.",
      "Speed against cost and accuracy against simplicity come later. Now, {s3} and the data.",
    ],
  },

  // ---------------- Speaker 3 (Nishadul Islam Shezan, data engineering): data, architecture, pipeline (chapters 1 to 3, live run),
  // with Samira's de-identification (3g, slide 11) and scaling (3h, slide 14) inserts ----------------
  {
    id: "1d", speaker: "s3", title: "The data story", slides: [6], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thanks, {s2}. My part is data engineering, everything before the analytics.",
      "We have no real patient records, so the patients are synthetic, but their world is real: census borders and populations through HDX, and Open-Meteo archive weather. So dengue follows rain by a few weeks and peaks in October, as in OpenDengue.",
      "We also planted 35 outbreaks, in a file only the evaluation code reads. The detector never sees it.",
    ],
  },
  {
    id: "1e", speaker: "s3", title: "Architecture", slides: [7], chapter: 2, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "Raw files land in bronze as they came. Spark cleans them into silver, with quality rules and hashed patient IDs. Gold holds weekly counts per district and disease. The analytics turn those into alerts, forecasts, allocation and calendar.",
      "Each layer rebuilds from the one before, so a rule change reruns only silver and gold. But one bad row in silver can become a fake alert.",
    ],
  },
  {
    id: "3a", speaker: "s3", title: "The generator's planted problems", slides: [8], chapter: 3, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "So the generator plants problems: about two percent repeated encounter IDs, unknown facilities, impossible ages. And two facilities each go silent for three weeks, then send everything at once.",
    ],
  },
  {
    id: "3b", speaker: "s3", title: "Bronze", slides: [9], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Bronze keeps each file as it came, with a batch ID, load time and SHA-256 checksum. A checksum already in the ingest log is skipped, so re-runs do nothing. Files are found by pattern, not name or date, so the hidden test drop runs unchanged.",
    ],
  },
  {
    id: "3c", speaker: "s3", title: "Silver: rules and quarantine", slides: [10], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Silver checks encounters against fourteen rules. A failing row goes to quarantine, not the bin, with every reason code it broke: 1,367,440 rows at full scale, 4.0 percent. {s2} covers the privacy step.",
    ],
  },
  {
    id: "3g", speaker: "s2", title: "De-identification", slides: [11], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s3}. De-identification is my part. Before a clean row is stored in silver, the patient ID becomes an HMAC-SHA256 keyed hash, built from Spark's own sha2. The key stays in .env, outside Git. Back to you, {s3}.",
    ],
  },
  {
    id: "3d", speaker: "s3", title: "Late data and gold", slides: [11, 12], chapter: 3, pause: 2,
    paras: [
      "Thanks, {s2}. A Delta MERGE on encounter ID replaces a row only with a later report. So a re-run changes nothing, and a late record moves to its correct week.",
      "[NEXT SLIDE]",
      "Gold counts by onset week, not report week, so a back-fill lands where the cases happened: no fake spike. Each gold row keeps its bronze batch IDs, so any number traces back to its files.",
    ],
  },
  {
    id: "3e", speaker: "s3", title: "Live run: new drop, re-run, quarantine", slides: [13], chapter: 3, pause: 35,
    paras: [
      "[NEXT SLIDE] [SHOW terminal with the clock visible; git describe --tags shows v1.0]",
      "Now live: a new fourteen-day drop, with an unseen seed.",
      "[SHOW make drop SF=<base SF> DROP_SEED=<new seed>, then make bronze silver gold analytics serve; speed up, keep timestamps]",
      "It finds the new files as one batch. In our drill, seed 4675 added 8,888 rows.",
      "[SHOW make bronze silver gold again, then the duplicate-count query]",
      "I run it again: nothing new, zero duplicates.",
      "[SHOW one silver.quarantine row with DQ_ORPHAN_FACILITY, then one gold row's batch_ids in the ingest log]",
      "Here's a planted orphan facility in quarantine with its reason. This gold row's batch IDs match the ingest log.",
    ],
  },
  {
    id: "3f", speaker: "s3", title: "Spark choices", slides: [14], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Small tables are broadcast, so joining them never shuffles the encounter table; only the MERGE and the patient de-duplication shuffle it. We partition by year only; finer keys make thousands of tiny files. Forecasts and allocations run as a daily batch; they're weekly decisions. {s2} has the timings.",
    ],
  },

  // ---------------- Speaker 2 (Samira Sultana, platform and evaluation): scaling (chapter 3) ----------------
  {
    id: "3h", speaker: "s2", title: "Scaling", slides: [14], chapter: 3, pause: 1,
    paras: [
      "Thanks, {s3}. Scaling is my part. The full-scale limit is forty-five minutes. Our timed run took 28.3 minutes, and 25.0 on the final code. Checking rules once, not per output, cut silver from 325 to 214 seconds on the quarter-size data. {s1}, over to you.",
    ],
  },

  // ---------------- Speaker 1 (Tahsin Ahmed Rafi, analytics): detection and the forecast model (chapter 4) ----------------
  {
    id: "4a", speaker: "s1", title: "Detection: why EARS C2 and CUSUM", slides: [15], chapter: 4, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s2}. Now my part, the analytics.",
      "Our main detector is EARS C2. It compares this week with weeks three to nine back, so it works with short history. Farrington needs about five years first.",
      "But raw counts fool it with the season. Dengue always rises in August, and that's not an outbreak. So we first divide by a seasonal index, built without the current year, so an outbreak can't hide itself. Our second method, CUSUM, adds up small excesses week after week, so it catches slow outbreaks.",
    ],
  },
  {
    id: "4b", speaker: "s1", title: "The reporting artefact", slides: [16], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Remember the two silent facilities? A simple detector sees zero, then a big jump, and raises an alarm. Ours treats a week with low reporting as missing, not zero, and scales the count up when most facilities reported. With {s3}'s onset-week counting, the fake spike is gone.",
    ],
  },

  {
    id: "4d", speaker: "s1", title: "The forecast model", slides: [17], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "For forecasts we fit a negative binomial model per district, for dengue and diarrhoea, using rain and temperature from four to eight weeks earlier. Why not machine learning? A hospital manager can read this model: more rain now, more dengue in a month. {s2} will show how well the forecasts and the detectors work.",
    ],
  },

  // ---------------- Speaker 2 (Samira Sultana, platform and evaluation): evaluation and backtest (chapter 4) ----------------
  {
    id: "4g", speaker: "s2", title: "Forecast backtest", slides: [17], chapter: 4, pause: 1,
    paras: [
      "Thanks, {s1}. Evaluation is my part. A rolling backtest over the last fifty-two weeks lets the model see only the past each time. Against the seasonal naive baseline, our interval score ratio is 0.84; below one means we win. It's 0.89 for dengue and 0.72 for diarrhoea. The average error drops from 133 to 113.",
    ],
  },
  {
    id: "4c", speaker: "s2", title: "Detection against the baseline", slides: [18], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "For detection, we swept the threshold against the planted outbreaks: outbreaks caught against false alarms.",
      "At a threshold of 4.0, EARS C2 catches 33 of the 35 outbreaks, with 1.89 false alerts per district each year. Half of them it catches within 8 days. CUSUM catches 32, with 1.82 false alerts. Back to you, {s1}.",
    ],
  },

  // ---------------- Speaker 1 (Tahsin Ahmed Rafi, analytics): supplies and calendar (chapter 4) ----------------
  {
    id: "4e", speaker: "s1", title: "From forecasts to supplies", slides: [19, 20], chapter: 4, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s2}. We turn expected cases into beds, saline, test kits, ORS and malaria drugs. A linear program then splits the budget to keep unmet need as low as possible. Alpha gives every district at least alpha times its population share of what is sent, never more than it needs.",
      "[NEXT SLIDE] [the 3D chart grows in and turns slowly]",
      "This 3D chart shows every budget and every alpha: green is our plan, red the population split. At tight budgets green is up to three times as high.",
      "At half the budget, the plan meets 67.8 percent of need. A plain population split meets only 34.4 percent. Our first version sent almost everything to two districts, so we fixed three faults. On the quarter-size test data, the plan now reaches all sixty-four districts, with only 22 percent to the top five. Along alpha you see the price of fairness: at half the budget a floor costs 1.5 to 2.4 points of need met. Our rule keeps floors that cost at most two points, that's alpha zero and alpha one, and then picks the one that gives the worst-off district the most. That's alpha zero.",
    ],
  },
  {
    id: "4f", speaker: "s1", title: "Preparedness calendar", slides: [21], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Last, the calendar, from each division's trend and season. Dengue starts rising around week {{32}} and peaks around week {{39}}. So supplies should be in place by week {{29}}, and the campaign start by week {{26}}, in late June. Over to {s4} for the dashboard.",
    ],
  },

  // ---------------- Speaker 4 (Rimjhim Dey, visualisation): dashboard and usability check (chapter 5) ----------------
  {
    id: "2a", speaker: "s4", title: "Why the dashboard looks like this", slides: [22], chapter: 5, pause: 3,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thank you, {s1}. My part is the dashboard.",
      "It's built with D3 version seven and reads only small summary files from gold, under ten megabytes in total, never a patient row. That keeps it fast on a district office laptop, with nothing private in the browser to leak.",
      "Cases use the viridis scale. It stays in order in greyscale and for colour-blind viewers. Alerts use a strong vermillion that stands out against it.",
      "Every panel says what date its data runs to, and when it was exported. On a phone, the views stack in one column.",
    ],
  },
  {
    id: "2b", speaker: "s4", title: "Live walkthrough", slides: [23, 24], chapter: 5, pause: 30,
    paras: [
      "[SHOW the dashboard in the browser at 125% zoom]",
      "There are five views, sharing one selection. The map shows cases per hundred thousand people, so a big district doesn't look worse just for being big. The table ranks districts by alerts, so an officer knows where to look first.",
      "[SHOW the line at the top (it says none), then point to the outlined triangles]",
      "The line at the top names districts on alert in the last full week. In our last week there are none. On the map, a solid triangle would mean the same; an outlined one marks alerts earlier in the range.",
      "[SHOW click Chattogram on the map]",
      "When I click Chattogram, the weekly chart, seasonal pattern and allocation all switch to it.",
      "[NEXT SLIDE] [then back to the browser: drag on the lower time strip, then hover the newest week]",
      "If I drag here, every view follows. The weekly chart shows real case counts, which a store-keeper plans with. The open dot is the newest week, not complete yet, so a low count there isn't a fall. A week with no data says no report, not zero.",
      "[SHOW the forecast band and the forecast table under the chart]",
      "The blue band is the forecast's eighty percent range. The table under it gives expected cases and a likely range per week, plus a cautious four-week total to order with.",
      "[SHOW the hatched cells, then move the budget and alpha sliders]",
      "Striped cells are hidden counts from one to four, and where needed a second cell too, so nobody can get one back by subtracting from a total. Hidden never looks like zero. In the what-if panel, the plan updates at once when I change budget or alpha, from a grid solved in advance. A sentence explains what the selected district gets.",
      "[SHOW open the page with ?district=BD1004]",
      "Last, the district view: with a district code in the address, an officer sees their own district in full, and the rest only as lighter division totals.",
    ],
  },
  {
    id: "2c", speaker: "s4", title: "Usability check", slides: [25], chapter: 5, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "We checked it with simulated persona walkthroughs run with AI agents, not real users. Three agents played a district officer in Cox's Bazar, a hospital store-keeper in Chattogram, and a senior ministry official, each trying five tasks on an SF=1 build of 21 October, before the allocation cap.",
      "Round one: 0 of 15 tasks done. Nothing showed who was on alert now, the newest week looked like a fall, the forecast had no numbers, and labels used codes like q90. So we added the alert line, the open dot, the forecast table and plain words.",
      "Round two: 13 of 15. Of 48 problems found, 26 are fixed, 20 partly, and 2 not yet. {s2} closes with privacy and our conclusion.",
    ],
  },

  // ---------------- Speaker 2 (Samira Sultana, platform and evaluation): privacy, ethics, conclusion (chapter 6) ----------------
  {
    id: "2d", speaker: "s2", title: "Privacy and ethics", slides: [26], chapter: 6, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s4}. On privacy: patient IDs get a keyed hash before silver, and clean rows keep only an age band.",
      "The equity floor gives each district a population share, never more than it needs. A district showing no need gets nothing, so the floor can't protect one whose reports are missing. That's why silent weeks are marked missing, not zero.",
    ],
  },
  {
    id: "2e", speaker: "s2", title: "Recommendations and limits", slides: [27], chapter: 6, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Our advice to the Ministry. Have dengue supplies in place by week {{29}}, before the season. Treat alerts as a short list to check, and check reporting completeness before acting on a spike. And choose alpha openly, knowing its cost in unmet need.",
      "Our limits. The data is synthetic, so no real decision should rest on it yet. Streaming alerts take just under four minutes at full scale. And the forecast bands ignore uncertainty in the model's own parameters, so they're a bit narrow.",
    ],
  },
  {
    id: "2f", speaker: "s2", title: "Close", slides: [28], chapter: 6, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "That's EpiScope. Everything you saw matches version one point zero in our repository. Thank you for watching.",
    ],
  },
];
