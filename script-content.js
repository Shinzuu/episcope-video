// The spoken script. One source for script.html (phone) and the slide numbers in index.html.
//
// Markup inside a paragraph:
//   {s1} {s2} {s3} {s4}  speaker short name from config.json
//   {n1} {n2} {n3} {n4}  speaker full name from config.json
//   {{text}}            a number from a repo file that docs/FINAL-NUMBERS.md does not list; check it before recording
//   [[pending: what]]   a result that is not final yet (none left); fill in, never guess
// A paragraph that starts with "[" and ends with "]" is a cue (NEXT SLIDE), not spoken.
// `pause` is the seconds of silence the section needs for slide changes.
//
// Slides only on screen: no terminal, no app, no live demo. Everything the script points at is on a slide.
// Speaking order, one block each: Rafi (slides 1-8) -> Samira (9-17) -> Shezan (18-26) -> Rimjhim (27-32).
window.EPI_SCRIPT = [
  // ---------------- Block 1: Tahsin Ahmed Rafi (analytics), slides 1 to 8 ----------------
  {
    id: "1a", speaker: "s1", title: "Opening", slides: [1], chapter: 1, pause: 3,
    paras: [
      "[SHOW slide 1, camera on; the 3D bars grow in]",
      "Assalamu alaikum. We're group Sentinel BD, and our project is EpiScope. We built a big data platform for outbreaks and supplies in Bangladesh.",
      "Each bar is one of our sixty-four districts. Its height is its population in the 2022 census. The tallest is Dhaka.",
    ],
  },
  {
    id: "1t", speaker: "s1", title: "Meet our team", slides: [2], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "I'm {n1}. My part is analytics: finding outbreaks, forecasting cases and planning supplies. {n2} covers platform and evaluation: privacy, speed, and how well our methods work. {n3} covers data engineering. {n4} covers the dashboard.",
    ],
  },
  {
    id: "4a", speaker: "s1", title: "Detection: why EARS C2 and CUSUM", slides: [3], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Our main detector is EARS C2. It compares this week with weeks three to nine back, so it works with a short history. Farrington needs about five years of data first.",
      "But the season fools raw counts. Dengue goes up every August, and that's not an outbreak. So we first divide by a seasonal index, built without the current year, so an outbreak can't hide itself. Our second method, CUSUM, adds up small extra counts week after week, so it catches slow outbreaks.",
    ],
  },
  {
    id: "4b", speaker: "s1", title: "Silent facilities", slides: [4], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Some facilities go silent for weeks, then send everything at once. A simple detector sees zero, then a big jump, and raises an alarm. Ours treats a week with low reporting as missing, not zero, and scales the count up when most facilities reported. {s3} will show we also count cases by the week people got sick. Together, the fake spike is gone.",
    ],
  },
  {
    id: "4d", speaker: "s1", title: "The forecast model", slides: [5], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "To forecast, we fit a negative binomial model, a standard model for counts, per district. It covers dengue and diarrhoea, and malaria to size antimalarials, using rain and temperature from four to eight weeks earlier.",
      "Why not machine learning? Because a hospital manager can read this model: more rain now means more dengue in a month. {s2} will show how well it works.",
    ],
  },
  {
    id: "4e", speaker: "s1", title: "From forecasts to supplies", slides: [6, 7], chapter: 1, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "Next, we turn expected cases into beds, saline, test kits, ORS and malaria drugs. A linear program splits the budget to keep unmet need as low as possible. Alpha sets a minimum: every district gets at least alpha times its population share of what is sent, never more than it needs.",
      "[NEXT SLIDE] [the 3D chart grows in and turns slowly]",
      "This 3D chart shows every budget and every alpha. Green is our plan. Red is a split by population. When the budget is tight, green is up to three times as high.",
      "At half the budget, our plan meets 67.8 percent of need. A plain population split meets only 34.4 percent. Our first version sent almost everything to two districts, so we fixed three faults. On the quarter-size test data, the plan now reaches all sixty-four districts, and the top five get only 22 percent.",
      "Along alpha you see the price of fairness. At half the budget, a minimum share costs 1.5 to 2.4 points of need met. Our rule keeps options that cost at most two points, alpha zero and alpha one, then picks the one that gives the worst-off district most. That's alpha zero.",
    ],
  },
  {
    id: "4f", speaker: "s1", title: "Preparedness calendar", slides: [8], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Last, the calendar, from each division's trend and season. Dengue starts rising around week {{31}} or {{32}}, and peaks around week {{39}}. So supplies should be in place by week {{28}} or {{29}}, and the campaign start by week {{25}} or {{26}}, in the second half of June.",
      "Over to {s2} for the problem we solve, and how we tested it.",
    ],
  },

  // ---------------- Block 2: Samira Sultana (platform and evaluation), slides 9 to 17 ----------------
  {
    id: "1b", speaker: "s2", title: "The problem", slides: [9], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s1}. My part is platform and evaluation. First, the problem.",
      "Dengue, diarrhoea, flu-like illness and malaria come every year. Reports from all sixty-four districts arrive late, some facilities go quiet for weeks, and one patient can be counted twice.",
      "The Ministry wants early warnings, forecasts one to four weeks ahead, a plan to share out a fixed stock, and a calendar for when to get ready. Its users aren't data scientists.",
    ],
  },
  {
    id: "1c", speaker: "s2", title: "Stakeholders and conflicts", slides: [10, 11], chapter: 2, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "Conflict one: a district officer wants early alerts. An epidemiologist wants fewer false alarms, or people stop listening.",
      "[NEXT SLIDE]",
      "Two, privacy: mosquito-control teams want small-area maps, but a count of two in a small place can point to a real person. So we publish by district and week, and hide counts from one to four.",
      "Three, efficiency against equity: supplies sent only where they help most leave some districts with nothing. One number, alpha, controls that. The last two trade-offs are on the slide.",
    ],
  },
  {
    id: "4c", speaker: "s2", title: "Detection against the baseline", slides: [12], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "How well do the methods work? We planted 35 outbreaks in the test data, then tried many thresholds, counting outbreaks caught against false alarms.",
      "At a threshold of 4.0, EARS C2 catches 33 of the 35 outbreaks, with 1.89 false alerts per district each year. It catches half of them within 8 days. CUSUM catches 32, with 1.82 false alerts.",
    ],
  },
  {
    id: "4g", speaker: "s2", title: "Forecast backtest", slides: [13], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "For forecasts, a rolling backtest over the last fifty-two weeks lets the model see only earlier weeks, as finally reported. The baseline, seasonal naive, repeats the same week last year.",
      "Our forecast-range score divided by the baseline's is 0.84; below one means we win. It's 0.89 for dengue and 0.72 for diarrhoea. The average error drops from 133 to 113.",
    ],
  },
  {
    id: "3g", speaker: "s2", title: "De-identification", slides: [14], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Next, privacy. Silver is our clean table. Before a row is stored there, the patient ID is replaced with a keyed hash, HMAC-SHA256. It's built from Spark's own sha2 function. The secret key stays in a .env file, outside Git.",
    ],
  },
  {
    id: "2d", speaker: "s2", title: "Privacy and ethics", slides: [15], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Clean rows also keep only an age band, not the exact age.",
      "There's an ethics limit too. The equity floor gives each district a population share, but never more than it needs. A district that shows no need gets nothing. So the floor can't protect a district whose reports are missing. That's why we mark silent weeks as missing, not zero.",
    ],
  },
  {
    id: "3h", speaker: "s2", title: "Scaling", slides: [16], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Scaling. Our limit at full scale is forty-five minutes. Our timed run took 28.3 minutes, and 25.0 on the final code. In silver, we now check the rules once, not once per output. On the quarter-size data, that cut silver from 325 to 214 seconds.",
    ],
  },
  {
    id: "2e", speaker: "s2", title: "Recommendations and limits", slides: [17], chapter: 2, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Our advice to the Ministry. Have dengue supplies in place by early to mid-July. Treat alerts as a short list to check, and check how many facilities reported before acting on a spike. And choose alpha openly, knowing what it costs in unmet need.",
      "Our limits. The data is synthetic, so no real decision should rest on it yet. Streaming alerts take just under four minutes at full scale. And the forecast ranges ignore uncertainty in the model's own parameters, so they're a bit narrow.",
      "Now {s3} shows how the data is built.",
    ],
  },

  // ---------------- Block 3: Nishadul Islam Shezan (data engineering), slides 18 to 26 ----------------
  {
    id: "1d", speaker: "s3", title: "The data story", slides: [18], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Thanks, {s2}. My part is data engineering, everything before the analytics.",
      "We have no real patient records, so the patients are synthetic, but their world is real: census borders and populations through HDX, and Open-Meteo archive weather. So dengue follows rain by a few weeks and peaks in October, as in OpenDengue.",
      "We also planted 35 outbreaks. They're in a file that only the evaluation code reads. The detector never sees it.",
    ],
  },
  {
    id: "1e", speaker: "s3", title: "Architecture", slides: [19], chapter: 3, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "Raw files land in bronze as they came. Spark cleans them into silver, with quality rules and hashed patient IDs. Gold holds weekly counts per district and disease. The analytics turn those into alerts, forecasts, supply plans and the calendar.",
      "Each layer is rebuilt from the one before. So if we change a rule, we only rerun silver and gold. But one bad row in silver can become a fake alert.",
    ],
  },
  {
    id: "3a", speaker: "s3", title: "The generator's planted problems", slides: [20], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "That's why the generator plants problems on purpose: about two percent repeated encounter IDs, that's visit IDs, unknown facilities, impossible ages. And two facilities each go silent for three weeks, then send everything at once.",
    ],
  },
  {
    id: "3b", speaker: "s3", title: "Bronze", slides: [21], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Bronze keeps each file with a batch ID, load time and SHA-256 checksum. If a checksum is already in the ingest log, we skip the file, so a re-run does nothing. Files are found by pattern, not name or date, so the hidden test drop runs unchanged.",
    ],
  },
  {
    id: "3c", speaker: "s3", title: "Silver: rules and quarantine", slides: [22], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Silver checks every visit against fourteen rules. A row that fails goes to quarantine, not the bin, with a code for every rule it broke. At full scale that's 1,367,440 rows, 4.0 percent.",
    ],
  },
  {
    id: "3d", speaker: "s3", title: "Late data and gold", slides: [23, 24], chapter: 3, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "For late data, a Delta MERGE on the visit ID replaces a row only with a later report. So a re-run changes nothing, and a late record moves to its correct week.",
      "[NEXT SLIDE]",
      "Gold counts by onset week, the week the person got sick, not the report week. So a backlog lands where the cases happened: no fake spike. Each gold row keeps its bronze batch IDs, so any number traces back to its files.",
    ],
  },
  {
    id: "3e", speaker: "s3", title: "Hidden-drop drill", slides: [25], chapter: 3, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "We tested this with a hidden-drop drill on a clean copy of the final code: a new fourteen-day drop with an unseen seed, 4675.",
      "It found the new files as one batch and added 8,888 rows. The data now runs to 14 January 2026.",
      "A second run changed nothing: zero duplicates. Bad rows went to quarantine with their reason, like an unknown facility.",
    ],
  },
  {
    id: "3f", speaker: "s3", title: "Spark choices", slides: [26], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Last, Spark. Small tables are broadcast, a full copy to every worker, so joining them never shuffles the big visit table. Only the MERGE and patient de-duplication shuffle it.",
      "We partition by year only; finer keys make thousands of tiny files. Forecasts and allocations run as a daily batch; they're weekly decisions. Over to {s4} for the dashboard.",
    ],
  },

  // ---------------- Block 4: Rimjhim Dey (visualisation), slides 27 to 32 ----------------
  {
    id: "2a", speaker: "s4", title: "Why the dashboard looks like this", slides: [27], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Thank you, {s3}. My part is the dashboard.",
      "It's built with D3 version seven. It reads only small summary files from gold, under ten megabytes in total, and never a patient row. So it's fast on a district office laptop, and there's nothing private in the browser to leak.",
      "Cases use the viridis colour scale. It stays in order in greyscale and for colour-blind people. Alerts use a strong vermillion that stands out against it.",
      "Every panel says what date its data runs to, and when it was exported. On a phone, the views stack in one column.",
    ],
  },
  {
    id: "2b", speaker: "s4", title: "Five linked views", slides: [28], chapter: 4, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "There are five views, and they share one selection. The map shows cases per hundred thousand people, so a big district doesn't look worse just because it's big. The table ranks districts by alerts, so an officer knows where to look first.",
      "The line at the top lists districts on alert in the last full week. In our last week there are none. On the map, a solid triangle would mean the same thing. An outlined triangle marks an alert earlier in the range.",
      "Here we picked Chattogram, and the weekly chart, the seasonal pattern and the allocation all switched to it.",
    ],
  },
  {
    id: "2g", speaker: "s4", title: "Weekly chart and forecast table", slides: [29], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Drag the lower time strip and every view follows. The weekly chart shows real case counts, which a store-keeper plans with.",
      "The open dot is the newest week, not complete yet, so a low count there isn't a fall. A week with no data says no report, not zero.",
      "The blue band is the forecast's eighty percent range. The table under it gives expected cases and a likely range per week, plus a cautious four-week total to order with.",
    ],
  },
  {
    id: "2h", speaker: "s4", title: "Hidden counts, what-if, district view", slides: [30], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Striped cells are hidden counts from one to four. Where needed, a second cell is hidden too, so nobody can get the number back by subtracting from a total. Hidden never looks like zero.",
      "In the what-if panel, the plan updates at once when you change the budget or alpha. It uses a grid solved in advance. A sentence explains what the selected district gets.",
      "Last, with a district code in the web address, an officer sees their own district in full, and the rest only as lighter division totals.",
    ],
  },
  {
    id: "2c", speaker: "s4", title: "Usability check", slides: [31], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "We checked it with simulated personas, AI agents playing users, not real people. Three agents played a district officer in Cox's Bazar, a hospital store-keeper in Chattogram, and a senior ministry official. Each tried five tasks on a full-scale build, SF=1, from 21 October, before the allocation cap.",
      "In round one, 0 of 15 tasks were done. Nothing showed who was on alert now. The newest week looked like a fall. The forecast had no numbers, and labels used codes like q90. So we added the alert line, the open dot, the forecast table and plain words.",
      "In round two, 13 of 15 were done. Of 48 problems found, 26 are fixed, 20 partly fixed, and 2 not yet.",
    ],
  },
  {
    id: "2f", speaker: "s4", title: "Close", slides: [32], chapter: 4, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "That's EpiScope. Everything you saw matches version one point zero in our repository. Thank you for watching.",
    ],
  },
];
