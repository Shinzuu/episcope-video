// Read-aloud timing check for script-content.js (REVIEW.md pass a).
//   node tools/timing.mjs [wpm]      default 110
// Spoken words exclude cue paragraphs. A [[pending: ...]] placeholder counts as PENDING_WORDS words, the
// length of the sentence that will replace it. Time = words / wpm + the section's pause seconds.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WPM = Number(process.argv[2] || 110);
const PENDING_WORDS = 5;
const win = {};
new Function("window", readFileSync(join(ROOT, "script-content.js"), "utf8"))(win);
const cfg = JSON.parse(readFileSync(join(ROOT, "config.json"), "utf8"));

export function spokenWords(paras) {
  let n = 0;
  for (let p of paras) {
    if (/^\[[^\]]*\](\s*\[[^\]]*\])*$/.test(p.trim())) continue;
    p = p.replace(/\{n([1-4])\}/g, (_, k) => cfg.speakers[`s${k}`].name); // full names count as their words
    const pending = (p.match(/\[\[pending:[^\]]*\]\]/g) || []).length;
    const text = p.replace(/\[\[pending:[^\]]*\]\]/g, " ").replace(/\[[^\]]*\]/g, " ").replace(/[{}]/g, "");
    n += text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length + pending * PENDING_WORDS;
  }
  return n;
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const per = {};
let clock = 0;
console.log(`wpm ${WPM}\nsection  speaker  words  pause  time   starts`);
for (const s of win.EPI_SCRIPT) {
  const w = spokenWords(s.paras);
  const t = (w / WPM) * 60 + s.pause;
  console.log(`${s.id.padEnd(8)} ${s.speaker.padEnd(8)} ${String(w).padStart(5)}  ${String(s.pause).padStart(5)}  ${fmt(t).padStart(5)}  ${fmt(clock)}`);
  clock += t;
  per[s.speaker] = per[s.speaker] || { words: 0, secs: 0 };
  per[s.speaker].words += w;
  per[s.speaker].secs += t;
}
console.log("\nspeaker            words   time   >=4:00");
for (const id of cfg.order) {
  const p = per[id];
  console.log(`${id} ${cfg.speakers[id].short.padEnd(14)} ${String(p.words).padStart(5)}  ${fmt(p.secs).padStart(5)}   ${p.secs >= 240 ? "yes" : "NO"}`);
}
console.log(`total ${fmt(clock)} (limit 15:00 to 20:00, plan 18:00)`);
