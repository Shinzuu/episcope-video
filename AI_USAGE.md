# AI usage

| Tool | Used for | Representative prompt |
|---|---|---|
| Claude Code | First draft of the slide deck (`index.html`), the phone script (`script.html`, `script-content.js`), the data extract and timing tools, and three review passes (timing, style, facts; kept as a local working file). Built from the EpiScope repo's files and Shezan's draft transcript; every number traced to a repo file | "Build a slide website with arrow-key navigation and a phone script with per-section time and word counts, for non-native speakers at 110 words a minute" |
| Claude Code | Re-assigned the script so each speaker presents their own lead area (Rafi analytics, Samira problem and evaluation, Shezan data engineering, Rimjhim dashboard): hand-overs, slide presenters, config parts, a longer dashboard narration from the report and dashboard code, and reviewer fixes (equity-floor cost, SF=0.25 label, LP formula, two silent facilities, k-anonymity wording). Checked with `tools/timing.mjs` | "Re-assign the video segments so each presenter has at least 4 minutes in their own lead area; keep every number, fix the reviewer's points" |

Each speaker reads, edits and rehearses their own part, and must be able to explain everything in it. The
project repository's `AI_USAGE.md` gets a matching line.
