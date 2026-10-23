// Config loading for index.html (names and roles from config.json, with a fallback for file://).
window.EPI = (() => {
  const FALLBACK = {
    repo_tag: "v1.0",
    speakers: {
      s1: { name: "Speaker 1", short: "Speaker 1", role: "", part: "Opening, analytics: detection, forecasting, supplies and calendar" },
      s2: { name: "Speaker 2", short: "Speaker 2", role: "", part: "Problem and conflicts, detection evaluation, privacy, ethics and conclusion" },
      s3: { name: "Speaker 3", short: "Speaker 3", role: "", part: "Data, architecture and data engineering" },
      s4: { name: "Speaker 4", short: "Speaker 4", role: "", part: "Dashboard and usability check" },
    },
    order: ["s1", "s2", "s3", "s4"],
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

  return { loadConfig };
})();
