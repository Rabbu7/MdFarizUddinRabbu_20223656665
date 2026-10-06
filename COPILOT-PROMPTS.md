# COPILOT-PROMPTS.md — Phase-by-phase prompts (Tender Document Package Builder)

How to use:
1. Use Copilot **Agent mode**. Paste ONE phase prompt at a time, in order.
2. Each prompt ends with a COMMIT block. Copilot runs the commit itself, so the commit body contains the exact prompt text (contest rule: commit message = change note + AI prompt).
3. If you ever edit by hand, commit with the body `Manual edit` instead.
4. After each phase: run `npm run dev`, click through it, then send me a short summary or the diff and I'll review before you move on.
5. Never commit before T+0. Never force-push or rewrite history. Stop everything at T+90.

---

## Time budget (90 min)

| Phase | Window | Goal |
|---|---|---|
| 0 | T+0 → T+3 | Session primer (no code, no commit) |
| 1 | T+3 → T+12 | Scaffold, Tailwind, tokens, structure |
| 2 | T+12 → T+24 | i18n, context store, shell UI |
| 3 | T+24 → T+36 | Requirements loading, status logic, requirement rows |
| 4 | T+36 → T+48 | Upload, page count, duplicates, file list |
| 5 | T+48 → T+58 | Matching, expiry, summary, generate gating |
| 6 | T+58 → T+72 | PDF package generation + download |
| 7 | T+72 → T+80 | Sample-pack test, review, fixes |
| 8 | T+80 → T+86 | Bonus (only if everything above works): CSV export |
| 9 | T+86 → T+90 | README, output PDF, screenshots, final push, deploy check |

Rules of thumb: commit at the end of every phase (satisfies "every 30 minutes, at least 3 commits"). If a phase runs over by 5 minutes, cut scope, don't skip the commit. Submit the official form by T+90 (late window T+90–95 costs 10 marks and is submission-only).

---

## Stitch MCP reference (paste into prompts when needed)

Stitch project: `Multi-Page Web Application`, project ID `9094615956894966498`

| Screen | ID |
|---|---|
| A: Workspace, Empty State | `f1352bb8efb64e5ab086bf62abac456a` |
| B: Workspace, Working State | `6f90da84414348e19f4522e0487ae7b3` |
| C: Workspace, Ready State | `af6b2aed4e14473e94eb236e1a05b7fc` |
| D: Generating and Success State | `f17d0193d1e5455090c8fab2df378011` |
| E: Error and Edge States | `727979849aa542d4a0eb4ffef8675836` |
| F: Workspace, Bangla Version | `015b67fc59c34e2c8d57231fc579a99a` |
| DESIGN.md (tokens and specs) | `f4323e7efc8c4b7991a9843b204f7727` |

---

## PHASE 0: Session primer (T+0). No code, no commit.

```
Read AGENTS.md, PAGES.md and DESIGN.md in full before doing anything. They are the source of truth: follow them strictly and do not invent features, libraries or UI that they don't describe. Summarize back in 10 bullet points: the hard contest constraints, the status rules, the PDF package rules, and the folder structure. Do not write code or run git yet.
For UI, use the Stitch MCP tools. Stitch project ID: 9094615956894966498. Screen IDs: A (empty) f1352bb8efb64e5ab086bf62abac456a, B (working) 6f90da84414348e19f4522e0487ae7b3, C (ready) af6b2aed4e14473e94eb236e1a05b7fc, D (generating/success) f17d0193d1e5455090c8fab2df378011, E (errors) 727979849aa542d4a0eb4ffef8675836, F (Bangla) 015b67fc59c34e2c8d57231fc579a99a. When a phase mentions a screen, fetch it via MCP and match its layout, spacing and styling using Tailwind.
```

---

## PHASE 1: Scaffold (T+3 → T+12)

```
Phase 1: scaffold the project in the CURRENT folder (not a subfolder).
1. Create a React + Vite JavaScript app here (no TypeScript). Install Tailwind CSS for Vite and the dependency pdf-lib. Do not install react-router-dom or any other library.
2. vite.config.js must set base: './'.
3. Create the folder structure from AGENTS.md section 4 under src/ with minimal stub files (components, context, i18n, lib), plus empty output/ and screenshots/ folders with a .gitkeep each.
4. Map the design tokens from DESIGN.md (colors, fonts, radii, spacing, shadows) into the Tailwind configuration. Load Inter and Noto Sans Bengali (Google Fonts) in index.html with system fallbacks. Set a light page background per the design.
5. Create .gitignore with: node_modules, dist, sample-pack, .kilo, .agents, skills-lock.json, .DS_Store.
6. App.jsx should render a simple placeholder heading using the design tokens. Make sure `npm run build` passes.
COMMIT: when the build passes, run `git add -A`, then `git commit` with subject "chore: scaffold Vite + React + Tailwind, folder structure, design tokens" and a body that starts with "AI prompt: " followed by the exact text of this message. Then `git push`. Do not rewrite history.
```

---

## PHASE 2: i18n, context, shell UI (T+12 → T+24)

```
Phase 2: foundation and the empty-state shell.
1. i18n: create src/i18n/en.js and bn.js with identical keys, starting with the full key table in PAGES.md section 6, plus any extra keys you need. Create useT() returning t(key, vars) with {placeholders}. No hard-coded UI strings in components from now on.
2. src/context/AppContext.jsx: provider + useReducer with the state shape from AGENTS.md section 5 and these actions: SET_LANG, LOAD_TENDER, ADD_FILES, REMOVE_FILE, SET_MATCH, CLEAR_MATCH, SET_EXPIRY, SET_GENERATING, NOTICE. Persist only `lang` in localStorage (default 'en'). Apply the Bengali font on the root element when lang is 'bn'.
3. Build Header, LanguageToggle (segmented English | বাংলা, always shows both names), StepIndicator, Toast, ErrorBoundary (bilingual).
4. Build the Workspace EMPTY STATE exactly like Stitch Screen A (fetch it via MCP): step cards for loading requirements and uploading files, muted locked cards for steps 3 and 4. Buttons may be non-functional for now.
5. Language switching must update everything instantly.
COMMIT: when the build passes, `git add -A`, then `git commit` with subject "feat: i18n (EN/BN), app context store, header and empty-state shell" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

---

## PHASE 3: Requirements, status logic (T+24 → T+36)

```
Phase 3: requirements loading and status logic.
1. src/lib/dates.js: helpers that compare YYYY-MM-DD strings lexicographically (never use Date for comparison).
2. src/lib/status.js: PURE functions implementing EXACTLY the status table in AGENTS.md section 6: getStatus(requirement, hasFile, expiryDate, deadline) returning missing | expiryNeeded | expired | notProvided | ok, plus helpers for blocking statuses and counts. Same-day expiry is OK. Add a small Node self-check script (npm run check:status) covering: no file mandatory, no file optional, file without expiry date, expiry day before deadline, expiry on the deadline, expiry after deadline, optional with file and no date.
3. Requirements loading: file picker for .json in the Step 1 card (and drag-and-drop). Validate per AGENTS.md section 5 (tender object, non-empty requirements array, each item has id, order, title_en, title_bn, mandatory, has_expiry). On error show a bilingual alert and keep any previously loaded tender. Always sort requirements by `order`.
4. Build TenderInfo (labeled fields, load-different-file button), RequirementsList, RequirementRow and StatusBadge (5 variants with icon + text + color) following Stitch Screen B (fetch via MCP). Show title_bn or title_en by language, Mandatory/Optional tags and the has-expiry marker. For now every mandatory row is Missing and every optional row is Not provided.
COMMIT: when the build and `npm run check:status` pass, `git add -A`, then `git commit` with subject "feat: requirements loader, pure status logic with self-check, requirement rows and badges" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

---

## PHASE 4: Upload, duplicates, file list (T+36 → T+48)

```
Phase 4: PDF upload, validation, page counts and duplicate detection.
1. src/lib/pdfInfo.js: validate a file (name/MIME looks like PDF AND first bytes are %PDF), load with pdf-lib to get the page count, and classify failures as 'encrypted' (password-protected) or 'damaged'. Never throw to the UI.
2. src/lib/hash.js: SHA-256 via crypto.subtle for each file's bytes; group files with identical hashes.
3. FileUploader: picker + drag-and-drop, multiple files. Enforce max 30 files and 50 MB total. Rejected files produce dismissible bilingual alerts naming each file and the reason (not a PDF, password-protected, damaged, limit exceeded). Valid files in the same batch are still added. Show a live counter "n / 30 files, X MB / 50 MB" with a progress bar and a "Reading files..." spinner while processing.
4. FileList and FileItem as in Stitch Screen B (fetch via MCP): name, pages, size, "Matched to ..." or "Not matched", Remove button (removing also clears its match and expiry). Duplicate groups: every member gets an amber "Duplicate of <name>" badge. Never auto-delete duplicates. Store file bytes in state as Uint8Array, not in localStorage.
COMMIT: when the build passes, `git add -A`, then `git commit` with subject "feat: PDF upload with validation, page counts, SHA-256 duplicate detection, file list" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

---

## PHASE 5: Matching, expiry, summary, gating (T+48 → T+58)

```
Phase 5: matching, expiry dates, live statuses, summary and generate gating.
1. MatchSelect in each RequirementRow: options "— No file —" plus all uploaded files (name + pages). Rules, enforced in the reducer as the single source of truth: one requirement has at most one file; one file is used by at most one requirement. Files already used by another requirement appear DISABLED with the label "used for: <title>". If file A is a duplicate (same hash) of a file already matched to requirement X, A is disabled for every other requirement with the reason "Duplicate of a file already used" but stays allowed for X. Choosing "— No file —" or clicking Unmatch clears the match and that requirement's expiry date. Changing the file also clears the expiry date.
2. ExpiryInput: date input (YYYY-MM-DD) shown only when has_expiry is true AND a file is matched, with the hint "Must be on or after <deadline>".
3. All statuses are DERIVED with useMemo from state via src/lib/status.js and update instantly after every change. Never store statuses in state.
4. SummaryBar (status count chips, Ready / Not ready banner, totals incl. duplicates) per Stitch Screens B and C (fetch via MCP). Rows with blocking statuses get the colored left border.
5. GeneratePanel: Generate button DISABLED while any requirement is missing, expiryNeeded or expired, with a visible list "Fix these first:" of each blocking requirement and its status; clicking a line scrolls to and highlights that row. The button does nothing yet when enabled.
COMMIT: when the build and `npm run check:status` pass, `git add -A`, then `git commit` with subject "feat: file-requirement matching rules, expiry input, live statuses, summary bar, generate gating" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

---

## PHASE 6: PDF generation (T+58 → T+72)

```
Phase 6: generate and download the package. Follow AGENTS.md section 9 EXACTLY.
Implement src/lib/buildPackage.js with pdf-lib:
- Page 1: an ENGLISH cover page (A4) with tender ID, title, procuring entity, bidder, submission deadline, the date the package was generated (YYYY-MM-DD, local), and the ordered numbered list of included documents (title_en). Wrap text; shrink font if needed to keep one cover page. Optional documents with no file are not listed.
- Then every matched file's pages in requirement `order`, all pages, original page order. Skip optional documents with no file.
- Footer on EVERY page including the cover: "<tender_id> | Page X of Y", Y = total pages of the final package, X = page number. Place it in a reserved strip: for each source page create a new page of size (width, height + 28pt), draw the original page shifted up by 28pt (embedPdf / drawPage), then draw the footer centered in the empty strip in Helvetica 9-10pt, dark text. Handle rotated pages (/Rotate 90/180/270), landscape pages, odd page sizes and non-zero MediaBox origins so the content is upright, never clipped and never overlapped by the footer. Use a two-pass approach so Y is known before stamping.
- Wire the Generate button (enabled only when nothing blocks): show "Creating your package..." with a spinner, wrap everything in try/catch, always reset the generating flag, show a bilingual error toast on failure.
- On success show the DownloadCard from Stitch Screen D (fetch via MCP): file name <tender_id>_Package.pdf, total pages, Download PDF button (Blob + temporary <a download>, revoke the URL afterwards). The card clears if any input changes afterwards.
COMMIT: when the build passes and a generated PDF opens correctly, `git add -A`, then `git commit` with subject "feat: package generation with English cover, ordered merge, X of Y footers, download" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

---

## PHASE 7: Sample-pack test, review, fixes (T+72 → T+80)

Do the manual test yourself first (acceptance list in PAGES.md section 9), then send Copilot this:

```
Phase 7: verification and hardening. Review the whole codebase against AGENTS.md section 14 (Definition of Done) and PAGES.md sections 5 and 9. Produce a concise list of gaps or bugs, then fix them, prioritizing: (1) status correctness incl. same-day expiry, (2) duplicate rules, (3) PDF cover content, ordering, footer text and no overlap on rotated/landscape pages, (4) bilingual coverage: no hard-coded strings and Bangla titles in BN mode, (5) rejected/corrupt/encrypted files never crash the app. Also remove console.log noise and unused code. Do not add new features. Also confirm `npm run build` and `npm run preview` work.
COMMIT: `git add -A`, then `git commit` with subject "fix: review pass against checklist, hardening and cleanup" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

Manual step after this: generate the package from the sample pack (after resolving its problems) and save it as `output/<tender_id>_Package.pdf`. Take at least one screenshot showing the document statuses into `screenshots/`.

---

## PHASE 8 (BONUS, only if main tasks all pass): CSV export (T+80 → T+86)

```
Phase 8 (bonus): add an "Export checklist (CSV)" button in the SummaryBar. Columns: document (current-language title), file name, pages, expiry date, status (translated label). Write UTF-8 with a BOM so Excel shows Bangla correctly, properly escape commas, quotes and newlines. Filename: <tender_id>_Checklist.csv. Add the bilingual strings. Do not touch the PDF generation.
COMMIT: `git add -A`, then `git commit` with subject "feat(bonus): export checklist as CSV" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

Skip other bonuses unless you finish early. The index page changes the page count and footer total, so it is riskier than CSV.

---

## PHASE 9: README, final push, deploy (T+86 → T+90)

Deploy to Netlify/Vercel/GitHub Pages BEFORE this phase if you can (do the first deploy around T+60–70 so only a redeploy is left). The live site must match the final commit.

```
Phase 9: write README.md (overwrite) with: project summary; how to run (npm install, npm run dev, npm run build); completed main features (list 4.1 to 4.9 and the PDF rules); completed bonus features (CSV export, if done); known problems (be honest); AI tools used (GitHub Copilot, Claude, Google Stitch via MCP); my most useful prompt (the Phase 6 prompt); live site URL placeholder "LIVE_URL_HERE". Keep it short and accurate. Do not change any source code.
COMMIT: `git add -A`, then `git commit` with subject "docs: README with run steps, features, known problems, AI tools, best prompt" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

Final checklist (by hand, T+86 → T+90):
- [ ] `output/<tender_id>_Package.pdf` and `screenshots/` committed and pushed
- [ ] Replace LIVE_URL_HERE with the real URL (commit message: `docs: add live URL` and body `Manual edit`) and push
- [ ] Live site matches the final commit; opens in Chrome without login
- [ ] Copy the final commit ID
- [ ] Submit the official form: name, registration number, repo link, final commit ID, live link (by T+90)
- [ ] After T+90: no commits, pushes or deployment changes. Log out of GitHub, AI tools and email.

---

## Emergency prompts (use only when needed)

Build error:
```
`npm run build` fails with the error below. Fix the root cause with the smallest change, don't refactor, and don't touch unrelated files. Error: <paste error>
COMMIT: subject "fix: build error" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

Footer overlaps content on a specific file:
```
In buildPackage.js the footer overlaps content for page size/rotation <describe>. Reproduce from the sample file <name>, fix it using the reserved bottom strip method (extra 28pt below the shifted original page), handle /Rotate and MediaBox offsets, and confirm that no content is clipped.
COMMIT: subject "fix: footer overlap on rotated/odd-size pages" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```

Running late (around T+75 and the main flow isn't finished):
```
We are short on time. Do not add anything new. Finish only what is missing for the main tasks 4.1 to 4.9 and the PDF rules in AGENTS.md section 9, in the order: statuses, matching, generate button gating, PDF generation, download. Report what is still missing at the end.
COMMIT: subject "fix: finish main tasks" and a body starting with "AI prompt: " followed by the exact text of this message. Then `git push`.
```
