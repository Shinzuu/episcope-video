// Slide deck: navigation, scaling, config labels and the charts drawn from assets/data.js.
(async () => {
  const D = window.EPI_DATA;
  const cfg = await EPI.loadConfig();
  const slides = [...document.querySelectorAll(".slide")];
  const stage = document.getElementById("stage");
  const NS = "http://www.w3.org/2000/svg";
  const fmtInt = (n) => Math.round(n).toLocaleString("en-US");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---------- config labels ----------
  const sp = (id) => cfg.speakers[id];
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const k = el.dataset.cfg;
    if (k === "team") el.textContent = cfg.order.map((id) => sp(id).name).join(", ");
    else if (cfg.speakers[k]) el.textContent = sp(k).short;
    else el.textContent = cfg[k] ?? "";
  });

  // ---------- running order and chapter times, from the script timing ----------
  const tl = EPI.timeline(window.EPI_SCRIPT);
  const total = tl.reduce((a, s) => a + s.secs, 0);
  const order = document.getElementById("order");
  for (const id of cfg.order) {
    const secs = tl.filter((s) => s.speaker === id);
    const start = Math.min(...secs.map((s) => s.start));
    const dur = secs.reduce((a, s) => a + s.secs, 0);
    order.insertAdjacentHTML("beforeend",
      `<div class="row"><i class="sw" style="background:var(--${id})"></i><span class="nm">${esc(sp(id).name)}</span>` +
      `<span>${esc(sp(id).role)}</span><span class="t">${EPI.fmt(start)} for ${EPI.fmt(dur)}</span></div>`);
  }
  const CH = { 1: "Problem, stakeholders and conflicts", 2: "Architecture", 3: "Pipeline run: clean, incremental, re-run, quarantine",
    4: "Analytics against baselines", 5: "Dashboard and what-if panel", 6: "Recommendations, ethics and limits" };
  const chapters = document.getElementById("chapters");
  for (const c of [1, 2, 3, 4, 5, 6]) {
    const first = tl.find((s) => s.chapter === c);
    chapters.insertAdjacentHTML("beforeend",
      `<div class="row" style="grid-template-columns:110px 1fr 300px"><span class="t" style="text-align:left">${EPI.fmt(first.start)}</span>` +
      `<span class="nm">${c}. ${CH[c]}</span><span class="t">${esc(sp(first.speaker).short)}</span></div>`);
  }
  chapters.insertAdjacentHTML("beforeend", `<p class="small" style="margin-top:14px">Planned length ${EPI.fmt(total)} at ${EPI.WPM} words a minute.</p>`);

  // ---------- svg helpers ----------
  function el(parent, tag, attrs = {}, text) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text !== undefined) n.textContent = text;
    parent.appendChild(n);
    return n;
  }
  function hbars(svg, rows, { w = 700, label = 260, max, fmt, color = "var(--sp)" }) {
    const bh = 34, gap = 14;
    max = max || Math.max(...rows.map((r) => r[1]));
    rows.forEach(([name, v], i) => {
      const y = i * (bh + gap);
      el(svg, "text", { x: label - 14, y: y + bh * 0.72, "font-size": 22, "text-anchor": "end" }, name);
      const bw = Math.max(2, ((w - label - 110) * v) / max);
      el(svg, "rect", { x: label, y, width: bw, height: bh, rx: 4, fill: color, class: "growx", style: `--d:${i}` });
      el(svg, "text", { x: label + bw + 10, y: y + bh * 0.72, "font-size": 22, "font-weight": 800 }, fmt(v));
    });
  }

  // title: national weekly dengue, draws in
  (() => {
    const svg = document.getElementById("title-curve");
    const pts = D.national_weekly.dengue.filter((p, i, a) => !(i === a.length - 1 && p[1] === 0));
    const max = Math.max(...pts.map((p) => p[1]));
    const x = (i) => (i / (pts.length - 1)) * 1600, y = (v) => 320 - (v / max) * 290;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p[1]).toFixed(1)}`).join("");
    el(svg, "path", { d: `${d}L1600 330L0 330Z`, fill: "var(--teal)", opacity: 0.1 });
    el(svg, "path", { d, class: "ln draw", pathLength: 1, style: "stroke: var(--teal); stroke-width: 4; --d:0" });
    el(svg, "text", { x: 1580, y: 24, "font-size": 20, "text-anchor": "end", class: "m" },
      `Weekly dengue cases, all districts, ${pts[0][0].slice(0, 7)} to ${pts[pts.length - 1][0].slice(0, 7)} (pipeline output, draft run)`);
  })();

  // planted outbreaks by disease
  hbars(document.getElementById("ob-chart"),
    Object.entries(D.outbreaks.by_disease).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k === "ili" ? "flu-like (ILI)" : k, v]),
    { w: 620, label: 200, fmt: (v) => v });
  el(document.getElementById("ob-chart"), "text", { x: 200, y: 240, "font-size": 24, "font-weight": 800 }, `${D.outbreaks.total} outbreaks in total`);

  // injected defects
  const DEF = { DUP_RATE: "repeated encounter ID", REPEAT_PATIENT_RATE: "same patient again", ORPHAN_RATE: "unknown facility",
    INVALID_AGE_RATE: "impossible age", INVALID_SEX_RATE: "invalid sex code", BAD_ICD_RATE: "bad ICD-10 code",
    ONSET_AFTER_REPORT_RATE: "onset after report" };
  hbars(document.getElementById("defect-chart"),
    Object.entries(D.defects).sort((a, b) => b[1] - a[1]).map(([k, v]) => [DEF[k] || k, v]),
    { w: 720, label: 300, fmt: (v) => `${(v * 100).toFixed(1)}%` });

  // DQ rule failures (1 - pass rate)
  document.getElementById("k-quar").textContent = fmtInt(D.dq.rows_quarantined);
  document.getElementById("k-quar-pct").textContent = `${((D.dq.rows_quarantined / D.dq.rows_in) * 100).toFixed(1)}%`;
  document.getElementById("k-in").textContent = fmtInt(D.dq.rows_in);
  const RULE = { DQ_DUP_ENCOUNTER: "duplicate encounter", DQ_BAD_ICD10: "bad ICD-10", DQ_INVALID_AGE: "invalid age",
    DQ_INVALID_SEX: "invalid sex", DQ_ONSET_AFTER_REPORT: "onset after report", DQ_ORPHAN_FACILITY: "orphan facility",
    DQ_NULL_REQUIRED: "required field empty" };
  hbars(document.getElementById("dq-chart"),
    Object.entries(D.dq.rules).map(([k, v]) => [RULE[k] || k, 1 - v]).filter((r) => r[1] > 0.0002).sort((a, b) => b[1] - a[1]),
    { w: 720, label: 270, fmt: (v) => `${(v * 100).toFixed(2)}%` });

  // drill: rows added by the new drop and by the re-run
  (() => {
    const dr = D.drill;
    const svg = document.getElementById("drill-chart");
    hbars(svg, [["new drop", dr.after.silver_rows - dr.before.silver_rows], ["same drop again", dr.rerun.silver_rows - dr.after.silver_rows]],
      { w: 640, label: 200, fmt: (v) => `+${fmtInt(v)}` });
    el(svg, "text", { x: 200, y: 150, "font-size": 24 }, `duplicate IDs after re-run: ${dr.duplicates_after_rerun}`);
    el(svg, "text", { x: 200, y: 190, "font-size": 24 }, `dashboard export: ${(dr.export.bytes / 1e6).toFixed(2)} MB, no counts 1 to 4`);
    document.getElementById("drill-note").textContent =
      `docs/experiments/hidden_drop_drill.json: clean clone, SF ${dr.sf}, ${Math.round(dr.seconds / 60)} min end to end. Re-run on v1.0.`;
  })();

  // illustration: report week vs onset week
  (() => {
    const svg = document.getElementById("onset-ill");
    const byReport = [6, 5, 0, 0, 0, 21, 6, 5], byOnset = [6, 5, 7, 7, 7, 6, 6, 5];
    const draw = (vals, y0, title, color) => {
      el(svg, "text", { x: 0, y: y0 - 118, "font-size": 22, "font-weight": 800 }, title);
      vals.forEach((v, i) => el(svg, "rect", { x: 40 + i * 70, y: y0 - v * 4.5, width: 50, height: Math.max(v * 4.5, 1), fill: color, class: "grow", style: `--d:${i}` }));
      el(svg, "line", { x1: 30, x2: 600, y1: y0, y2: y0, stroke: "var(--muted)", "stroke-width": 2 });
    };
    draw(byReport, 140, "Counted by report week: a false spike", "var(--alert)");
    draw(byOnset, 320, "Counted by onset week: the true shape", "var(--teal)");
    el(svg, "text", { x: 180, y: 160, "font-size": 18, class: "m" }, "silent");
    el(svg, "text", { x: 390, y: 160, "font-size": 18, class: "m" }, "back-fill");
  })();

  // illustration: naive detector vs ours on a silent facility
  (() => {
    const svg = document.getElementById("artefact-ill");
    const naive = [20, 22, 21, 0, 0, 0, 64, 22, 21], ours = [20, 22, 21, null, null, null, 22, 22, 21];
    const x = (i) => 40 + i * 70;
    const path = (vals, y0) => vals.map((v, i) => (v === null ? null : [x(i), y0 - v * 1.6]))
      .reduce((s, p, i, a) => (p ? s + `${!a[i - 1] ? "M" : "L"}${p[0]} ${p[1]}` : s), "");
    el(svg, "text", { x: 0, y: 24, "font-size": 22, "font-weight": 800 }, "Plain detector: zero, then an alarm");
    el(svg, "path", { d: path(naive, 150), class: "ln alert draw", pathLength: 1, style: "--d:0" });
    el(svg, "path", { d: `M${x(6) - 12} ${150 - 64 * 1.6 - 8}l12 -20l12 20z`, fill: "var(--alert)" });
    el(svg, "text", { x: 0, y: 214, "font-size": 22, "font-weight": 800 }, "EpiScope: missing weeks, no alarm");
    el(svg, "path", { d: path(ours, 340), class: "ln draw", pathLength: 1, style: "stroke: var(--teal); --d:1" });
    el(svg, "rect", { x: x(3) - 20, y: 250, width: 180, height: 100, fill: "var(--rule)", opacity: 0.5, rx: 6 });
    el(svg, "text", { x: x(4), y: 306, "font-size": 20, "text-anchor": "middle", class: "m" }, "missing");
  })();

  // efficiency-equity curve
  (() => {
    const svg = document.getElementById("curve-chart");
    const c = D.curve, W = 760, H = 430, L = 90, B = 360, T = 20, R = 40;
    const max = Math.ceil(Math.max(...c.lp.map((p) => p.pct)) / 5) * 5;
    const x = (a) => L + a * (W - L - R), y = (v) => B - (v / max) * (B - T);
    for (let v = 0; v <= max; v += 5) {
      el(svg, "line", { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: "var(--rule)", "stroke-width": 1.5 });
      el(svg, "text", { x: L - 12, y: y(v) + 7, "font-size": 20, "text-anchor": "end", class: "m" }, `${v}%`);
    }
    [0, 0.2, 0.4, 0.6, 0.8, 1].forEach((a) => el(svg, "text", { x: x(a), y: B + 32, "font-size": 20, "text-anchor": "middle", class: "m" }, a.toFixed(1)));
    el(svg, "text", { x: (L + W - R) / 2, y: B + 66, "font-size": 22, "text-anchor": "middle" }, "equity floor α");
    el(svg, "text", { x: L - 80, y: T - 30, "font-size": 20, class: "m" }, "share of need met");
    el(svg, "path", { d: c.lp.map((p, i) => `${i ? "L" : "M"}${x(p.alpha)} ${y(p.pct)}`).join(""), class: "ln draw", pathLength: 1, style: "stroke: var(--sp); stroke-width: 5; --d:0" });
    el(svg, "line", { x1: L, x2: W - R, y1: y(c.baseline_pct), y2: y(c.baseline_pct), stroke: "var(--alert)", "stroke-width": 3, "stroke-dasharray": "8 6" });
    el(svg, "text", { x: W - R, y: y(c.baseline_pct) - 12, "font-size": 20, "text-anchor": "end", fill: "var(--alert)" }, `population split: ${c.baseline_pct.toFixed(2)}%`);
    for (const a of [0, 0.2]) {
      const p = c.lp.find((q) => Math.abs(q.alpha - a) < 1e-9);
      el(svg, "circle", { cx: x(a), cy: y(p.pct), r: 9, fill: "var(--sp)" });
      el(svg, "text", { x: x(a) + 18, y: y(p.pct) + 30, "font-size": 24, "font-weight": 800 }, `α ${a.toFixed(1)}: ${p.pct.toFixed(0)}%`);
    }
    el(svg, "text", { x: W - R, y: T + 20, "font-size": 20, "text-anchor": "end", class: "m" }, `budget = ${c.budget_level} × full need`);
  })();

  // dengue calendar by division
  (() => {
    const svg = document.getElementById("cal-chart");
    const rows = D.calendar.filter((r) => r.disease === "dengue");
    const W = 1420, L = 200, R = 30, w0 = 22, w1 = 42;
    const x = (w) => L + ((w - w0) / (w1 - w0)) * (W - L - R);
    const rh = 50;
    for (let w = w0; w <= w1; w += 2) {
      el(svg, "line", { x1: x(w), x2: x(w), y1: 40, y2: 40 + rows.length * rh, stroke: "var(--rule)", "stroke-width": 1.5 });
      el(svg, "text", { x: x(w), y: 28, "font-size": 19, "text-anchor": "middle", class: "m" }, `wk ${w}`);
    }
    rows.forEach((r, i) => {
      const yy = 40 + i * rh + 10;
      el(svg, "text", { x: L - 16, y: yy + 24, "font-size": 23, "text-anchor": "end" }, r.division);
      el(svg, "rect", { x: x(r.campaign), y: yy + 6, width: x(r.preposition) - x(r.campaign), height: 22, fill: "var(--s4)", opacity: 0.45, rx: 4, class: "growx", style: `--d:${i}` });
      el(svg, "rect", { x: x(r.preposition), y: yy + 6, width: x(r.onset) - x(r.preposition), height: 22, fill: "var(--s4)", rx: 4, class: "growx", style: `--d:${i}` });
      el(svg, "rect", { x: x(r.onset), y: yy + 6, width: x(r.peak) - x(r.onset), height: 22, fill: "var(--alert)", opacity: 0.85, rx: 4, class: "growx", style: `--d:${i}` });
      el(svg, "circle", { cx: x(r.peak), cy: yy + 17, r: 9, fill: "var(--alert)" });
    });
    const ly = 40 + rows.length * rh + 40;
    [["var(--s4)", 0.45, "campaign running"], ["var(--s4)", 1, "supplies in place"], ["var(--alert)", 0.85, "season rising to peak"]].forEach(([c, o, t], i) => {
      el(svg, "rect", { x: L + i * 330, y: ly - 18, width: 30, height: 20, fill: c, opacity: o, rx: 4 });
      el(svg, "text", { x: L + i * 330 + 42, y: ly, "font-size": 21 }, t);
    });
  })();

  // ---------- progress strip, speaker label, navigation ----------
  const strip = document.getElementById("strip");
  strip.style.gridTemplateColumns = `repeat(${slides.length}, 1fr)`;
  slides.forEach((s) => { const b = document.createElement("b"); b.style.background = `var(--${s.dataset.speaker})`; strip.appendChild(b); });
  const who = document.getElementById("who");
  let cur = 0;

  function show(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle("active", k === cur));
    const s = slides[cur];
    [...s.querySelectorAll("[data-in]")].forEach((n, k) => n.style.setProperty("--i", k));
    const id = s.dataset.speaker;
    who.style.setProperty("--cur", `var(--${id})`);
    who.querySelector("b").textContent = sp(id).name;
    who.querySelector("span").textContent = sp(id).role;
    [...strip.children].forEach((b, k) => { b.className = k < cur ? "done" : k === cur ? "now" : ""; });
    document.getElementById("count").textContent = `${cur + 1} / ${slides.length}`;
    document.title = `EpiScope slides ${cur + 1}/${slides.length}`;
    history.replaceState(null, "", `#${cur + 1}`);
  }
  const hint = document.querySelector(".nav-hint");
  const next = () => { hint.classList.add("gone"); show(cur + 1); }, prev = () => show(cur - 1);

  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (["ArrowRight", "PageDown", " ", "Enter", "ArrowDown"].includes(e.key)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp", "Backspace", "ArrowUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(slides.length - 1);
    else if (e.key === "f" || e.key === "F") (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
    else if (e.key === "t" || e.key === "T") {
      const r = document.documentElement;
      r.dataset.theme = r.dataset.theme === "dark" ? "light" : "dark";
    }
  });
  document.addEventListener("click", (e) => { if (e.target.closest("a, button")) return; (e.clientX > innerWidth / 3 ? next : prev)(); });
  let tx = null, ty = null;
  document.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    tx = null;
  }, { passive: true });

  function fit() {
    const k = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.transform = `scale(${k}) translate(-50%, -50%)`;
    stage.style.transformOrigin = "0 0";
    stage.style.left = "50%"; stage.style.top = "50%";
    stage.style.transform = `translate(-50%, -50%) scale(${k})`;
    stage.style.transformOrigin = "center center";
  }
  addEventListener("resize", fit);
  fit();
  show((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
