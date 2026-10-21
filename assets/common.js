// Shared by index.html and script.html: config loading, word counts and timing.
// Word counting matches tools/timing.mjs, so the pages and REVIEW.md agree.
window.EPI = (() => {
  const WPM = 110;
  const PENDING_WORDS = 5;
  const FALLBACK = {
    repo_tag: "v1.0",
    speakers: {
      s1: { name: "Speaker 1", short: "Speaker 1", role: "Problem, stakeholders and data" },
      s2: { name: "Speaker 2", short: "Speaker 2", role: "Dashboard, ethics and conclusion" },
      s3: { name: "Speaker 3", short: "Speaker 3", role: "Data engineering" },
      s4: { name: "Speaker 4", short: "Speaker 4", role: "Analytics" },
    },
    order: ["s1", "s3", "s4", "s2"],
  };

  async function loadConfig() {
    try {
      const r = await fetch("config.json", { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (_) {
      return FALLBACK; // opened from file:// or offline without a server
    }
  }

  const isCue = (p) => /^\[[^\]]*\](\s*\[[^\]]*\])*$/.test(p.trim());

  function spokenWords(paras) {
    let n = 0;
    for (const p of paras) {
      if (isCue(p)) continue;
      const pending = (p.match(/\[\[pending:[^\]]*\]\]/g) || []).length;
      const text = p.replace(/\[\[pending:[^\]]*\]\]/g, " ").replace(/\[[^\]]*\]/g, " ").replace(/[{}]/g, "");
      n += text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length + pending * PENDING_WORDS;
    }
    return n;
  }

  function timeline(script, wpm = WPM) {
    let clock = 0;
    return script.map((s) => {
      const words = spokenWords(s.paras);
      const secs = (words / wpm) * 60 + s.pause;
      const row = { ...s, words, secs, start: clock };
      clock += secs;
      return row;
    });
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return { WPM, loadConfig, isCue, spokenWords, timeline, fmt };
})();
