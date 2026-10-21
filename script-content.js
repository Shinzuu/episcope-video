// The spoken script. One source for script.html (phone) and the slide numbers in index.html.
//
// Markup inside a paragraph:
//   {s1} {s2} {s3} {s4}  speaker short name from config.json
//   {{text}}            a number from a repo file that docs/FINAL-NUMBERS.md does not list; check it before recording
//   [[pending: what]]   a result that is not final yet (none left); fill in, never guess
// A paragraph that starts with "[" and ends with "]" is a cue (NEXT SLIDE, SHOW, PAUSE), not spoken.
// `pause` is the seconds of silence the section needs for slide changes and demo moments.
window.EPI_SCRIPT = [
  // ---------------- Speaker 1 (Tahsin Ahmed Rafi): problem, stakeholders, data, architecture (chapters 1 and 2) ----------------
  {
    id: "1a", speaker: "s1", title: "Opening", slides: [1, 2], chapter: 1, pause: 4,
    paras: [
      "[SHOW slide 1, camera on, name on screen]",
      "Assalamu alaikum. We're the EpiScope team. It's a big data platform that watches for outbreaks in Bangladesh and helps plan supplies.",
      "[NEXT SLIDE]",
      "I'm {s1}. I'll start with the problem and the data. Then {s3} shows the pipeline, {s4} shows the analytics, and {s2} shows the dashboard and closes. Each of us will explain why we built our part this way.",
    ],
  },
  {
    id: "1b", speaker: "s1", title: "The problem", slides: [3], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Every year we deal with dengue, diarrhoea, flu-like illness and malaria. Reports come from all sixty-four districts, but they come late. Some facilities go quiet for weeks. The same patient can show up twice.",
      "So the Ministry wants four things from us. An early warning when cases rise more than normal. A forecast for the next one to four weeks. A plan to split a fixed stock of supplies. And a calendar that says when to get ready. The people using it aren't data scientists, so it has to explain itself.",
    ],
  },
  {
    id: "1c", speaker: "s1", title: "Stakeholders and conflicts", slides: [4, 5], chapter: 1, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "People who use this system don't want the same things. A district health officer wants an alert as early as possible. An epidemiologist wants fewer false alarms, because if the alarm rings every week, people stop listening. That's our first conflict.",
      "[NEXT SLIDE]",
      "The second is privacy. Vector-control teams want small-area maps. The privacy regulator doesn't want small counts anywhere, because a count of two in a small place can point to a real person. So we publish by district and week, and we hide every count from one to four.",
      "The third is efficiency against equity. If supplies only go where they help most, some districts get nothing. We give the Ministry one number to control that, called alpha. {s4} will show what it costs.",
      "Two more, speed against cost and accuracy against simplicity, come up later.",
    ],
  },
  {
    id: "1d", speaker: "s1", title: "The data story", slides: [6], chapter: 1, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Now the data. We can't use real patient records. So the patients are synthetic, but the world around them is real. District borders and populations come from the census, through HDX. Weather comes from the Open-Meteo archive.",
      "That's why dengue in our data follows rain by a few weeks and peaks around October, the same as the OpenDengue records. We also planted 35 outbreaks. Only the evaluation code knows where they are. The detector never sees that file.",
    ],
  },
  {
    id: "1e", speaker: "s1", title: "Architecture", slides: [7], chapter: 2, pause: 3,
    paras: [
      "[NEXT SLIDE]",
      "Here's the whole system. Raw files land in bronze exactly as they came. Spark cleans them into silver, where the quality rules run and patient IDs get hashed. Gold holds weekly counts per district and disease. The analytics read gold and write alerts, forecasts, the allocation and the calendar.",
      "Why layers? Each one can be rebuilt from the one before. If a rule changes, we rerun silver and gold only. But errors travel too. One bad row in silver can become a fake alert later. That's why {s3}'s part comes first.",
    ],
  },

  // ---------------- Speaker 3 (Shezan): data engineering (chapters 2 and 3, live run) ----------------
  {
    id: "3a", speaker: "s3", title: "My part and the generator", slides: [8], chapter: 3, pause: 3,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thanks, {s1}. I'm {s3}, the data engineer. My part is everything before the analytics. If my layer is wrong, everything after it is wrong too.",
      "The generator makes the patients, and it also plants the problems we have to catch. About two percent of rows repeat an encounter ID. Some point to a facility that doesn't exist. Some have impossible ages. And one facility goes silent for three weeks, then sends everything at once.",
    ],
  },
  {
    id: "3b", speaker: "s3", title: "Bronze", slides: [9], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Bronze stores every file exactly as it came, with a batch ID, the load time and the file's SHA-256 checksum. Before reading a file, the job checks that checksum against the ingest log. A file we've already loaded is skipped, so running bronze twice does nothing. Files are found by pattern, never by name or date, so the hidden test drop runs without changes.",
    ],
  },
  {
    id: "3c", speaker: "s3", title: "Silver: rules, quarantine, privacy", slides: [10, 11], chapter: 3, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "Silver is where data gets trusted. Encounters go through fourteen rules. A failing row isn't deleted. It goes to a quarantine table with every reason code it broke. At full scale that was 1,367,440 rows, 4.0 percent.",
      "[NEXT SLIDE]",
      "The patient ID never gets past this step. We replace it with an HMAC-SHA256 keyed hash, built from Spark's own sha2 function, so there's no slow Python code. The key lives in a .env file outside Git.",
      "Clean rows go in with a Delta MERGE on encounter ID. A row is replaced only if the new copy has a later report date. So a re-run changes nothing, and a late record moves into its correct week.",
    ],
  },
  {
    id: "3d", speaker: "s3", title: "Gold and lineage", slides: [12], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Gold counts cases by the week of onset, not the week of report. When the silent facility back-fills, its cases land on the weeks they happened, so there's no fake spike. Every gold row keeps the bronze batch IDs it came from, so any number on the dashboard can be traced back to its files.",
    ],
  },
  {
    id: "3e", speaker: "s3", title: "Live run: new drop, re-run, quarantine", slides: [13], chapter: 3, pause: 35,
    paras: [
      "[NEXT SLIDE] [SHOW terminal with the clock visible; git describe --tags shows v1.0]",
      "I make a new fourteen-day drop with a seed the pipeline has never seen.",
      "[SHOW make drop DROP_SEED=<new seed>, then make bronze silver gold analytics serve; speed up, keep timestamps]",
      "It finds the new files as one new batch. In our final drill, with seed 4675, that added 8,888 rows.",
      "[SHOW make bronze silver gold again, then the duplicate-count query]",
      "Now I run it again. Bronze finds nothing new, and the duplicate count is zero.",
      "[SHOW one silver.quarantine row with DQ_ORPHAN_FACILITY, then one gold row's batch_ids in the ingest log]",
      "And here's a planted defect, an orphan facility, sitting in quarantine with its reason. This gold row's batch IDs match the ingest log.",
    ],
  },
  {
    id: "3f", speaker: "s3", title: "Spark choices and scaling", slides: [14], chapter: 3, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Small tables are broadcast, so the big encounter table never shuffles for a join. We partition by year only, because finer keys would make thousands of tiny files. Forecasts and allocations run daily, because they're weekly decisions.",
      "At full scale the limit is forty-five minutes. Our timed run took 28.3 minutes, and 25.0 on the final code. Checking the rules once, not once per output, cut silver's Spark time from 325 to 214 seconds at quarter scale. {s4}, over to you.",
    ],
  },

  // ---------------- Speaker 4 (Rimjhim Dey): analytics (chapter 4) ----------------
  {
    id: "4a", speaker: "s4", title: "Detection: why EARS C2 and CUSUM", slides: [15], chapter: 4, pause: 3,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thanks, {s3}. I'm {s4}, and I did the analytics.",
      "Our main detector is EARS C2. It compares this week with a baseline from three to nine weeks back. It works with short history. Farrington, the usual choice, needs about five years before its first test week.",
      "But EARS on raw counts is fooled by the season. Dengue always rises in August, and that's not an outbreak. So we divide by a seasonal index first, and we build it without the current year, so an outbreak can't hide itself. The second method is CUSUM. It adds up small excesses week after week, so it catches slow outbreaks.",
    ],
  },
  {
    id: "4b", speaker: "s4", title: "The reporting artefact", slides: [16], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Remember the facility that went silent? A simple detector sees zero cases, then a big jump, and it raises an alarm. Ours treats a week with low reporting as missing, not zero. If most facilities reported, we scale the count up. With {s3}'s onset-week counting, the fake spike just isn't there.",
    ],
  },
  {
    id: "4c", speaker: "s4", title: "Detection against the baseline", slides: [17], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "To pick the threshold, we swept it against the planted outbreaks. For each value we measure how many outbreaks we catch against how many false alarms we raise. That's the first conflict, in numbers.",
      "At a threshold of 4.0, EARS C2 catches 33 of the 35 outbreaks, with 1.89 false alerts per district each year. Half of them it catches within 8 days. CUSUM catches 32, with 1.82 false alerts.",
    ],
  },
  {
    id: "4d", speaker: "s4", title: "Forecasts and the backtest", slides: [18], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "For forecasts we fit a negative binomial model for each district, for dengue and diarrhoea. It uses rain and temperature from four to eight weeks earlier. Why not machine learning? A hospital manager can read this model: more rain now, more dengue in a month.",
      "We tested it with a rolling backtest over the last fifty-two weeks. At each week the model sees only data up to that week. Against the seasonal naive baseline, our interval score ratio is 0.84, where below one means we win. It's 0.89 for dengue and 0.72 for diarrhoea. The average error drops from 133 to 113.",
    ],
  },
  {
    id: "4e", speaker: "s4", title: "From forecasts to supplies", slides: [19, 20], chapter: 4, pause: 4,
    paras: [
      "[NEXT SLIDE]",
      "We turn expected cases into beds, saline, test kits, ORS and malaria drugs. Then a linear program splits the budget. It keeps unmet need as low as it can, within the budget and transport limits. Alpha says every district gets at least alpha times its population share, but never more than it needs.",
      "[NEXT SLIDE]",
      "At half the budget, the plan meets 67.8 percent of need. A plain population split meets only 34.4 percent. Our first version sent almost everything to two districts. We found three faults and fixed them. Now the plan reaches all sixty-four districts, and the top five get only 22 percent. This curve shows the price of fairness: any floor costs up to 2.5 points of need met, so at this budget we recommend alpha zero.",
    ],
  },
  {
    id: "4f", speaker: "s4", title: "Preparedness calendar", slides: [21], chapter: 4, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "Last, the calendar. We split each division's history into trend and season. Dengue starts rising around week {{32}} and peaks around week {{39}}. So supplies should be in place by week {{29}}, and the campaign should start by week {{26}}, in late June. Over to {s2}.",
    ],
  },

  // ---------------- Speaker 2 (Samira): dashboard, ethics, conclusion (chapters 5 and 6) ----------------
  {
    id: "2a", speaker: "s2", title: "Why the dashboard looks like this", slides: [22], chapter: 5, pause: 3,
    paras: [
      "[NEXT SLIDE] [name on screen]",
      "Thank you, {s4}. I'm {s2}. I'll show the dashboard, then talk about privacy and what we recommend.",
      "The dashboard is built with D3 version seven. It reads only small summary files from gold, under ten megabytes in total. It never loads a patient row. That keeps it fast on a district office laptop, and there's nothing private in the browser to leak.",
    ],
  },
  {
    id: "2b", speaker: "s2", title: "Live walkthrough", slides: [23, 24], chapter: 5, pause: 27,
    paras: [
      "[SHOW the dashboard in the browser at 125% zoom]",
      "There are five views, and they share one selection. The map shows cases per hundred thousand people. The orange triangles are alerts from the detector. The table ranks districts by alerts, so an officer knows where to look first.",
      "[SHOW click Chattogram on the map]",
      "When I click Chattogram, the weekly chart, the seasonal pattern and the allocation all switch to Chattogram.",
      "[NEXT SLIDE] [then back to the browser: drag on the lower time strip]",
      "If I drag here, every view follows the new time range. The blue band is the forecast with its eighty percent range. A planner needs to know how sure we are.",
      "[SHOW the hatched cells, then move the budget and alpha sliders]",
      "Striped cells are hidden counts under five. And in the what-if panel, when I change the budget or alpha, the plan updates at once. The plan was solved ahead of time on a grid, and the page just looks it up.",
    ],
  },
  {
    id: "2c", speaker: "s2", title: "Usability check", slides: [25], chapter: 5, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "We checked it with simulated persona walkthroughs run with AI agents. Three agents each played a non-technical role and tried five tasks on the real dashboard. In round one they finished 0 of 15 tasks. After our fixes, round two finished 13 of 15. Of the 48 problems found, 26 are fixed, 20 partly, and 2 not yet.",
    ],
  },
  {
    id: "2d", speaker: "s2", title: "Privacy and ethics", slides: [26], chapter: 6, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "On privacy. Patient IDs are hashed with a secret key before anything reaches gold, and exact age becomes an age band. Every count under five is hidden. Where needed we hide a second cell too, so nobody can get the small number back by subtracting from a total.",
      "The equity floor gives every district a population share of what is sent, but never more than it needs. A district that shows no need gets nothing. So the floor can't protect a district whose reports are missing. That's why the pipeline marks silent weeks as missing, not zero, and the dashboard shows them as no report.",
    ],
  },
  {
    id: "2e", speaker: "s2", title: "Recommendations and limits", slides: [27], chapter: 6, pause: 2,
    paras: [
      "[NEXT SLIDE]",
      "So what would we tell the Ministry? Get dengue supplies in place by week {{29}}, before the season starts. Treat alerts as a short list to check, and look at reporting completeness before acting on a spike. And choose alpha openly, knowing what it costs in unmet need.",
      "Our limits. The data is synthetic, so none of these numbers should drive a real decision yet. Streaming alerts take about 219.2 seconds at full scale, so they're fast, not instant. And the forecast bands ignore uncertainty in the model's own parameters, so they're a bit too narrow.",
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
