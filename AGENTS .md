# AGENTS.md — Tender Document Package Builder

> Instructions for AI coding agents (GitHub Copilot) working in this repository.
> Read this file fully before every task. Read `PAGES.md` for UI behavior and `DESIGN.md` (from Stitch) for visual design.

---

## 1. Project Summary

A **frontend-only** web app for office staff. The user:

1. Loads a tender `requirements.json`.
2. Uploads many PDF files.
3. Matches each file to a required document.
4. Enters expiry dates where needed.
5. Sees a live status for every required document.
6. Generates and downloads ONE combined, checked, correctly ordered PDF: `<tender_id>_Package.pdf`.

The app must work in **Bangla and English** and run in the **latest Google Chrome**. Judges will test it with an unseen sample pack in the same format.

---

## 2. HARD CONSTRAINTS (contest rules, never violate)

- **Frontend only.** No backend, no serverless functions, no Firebase/Supabase/Appwrite, no online storage. All PDF processing happens in the browser. Never upload documents anywhere.
- **No secrets.** No API keys, tokens, or passwords in code, repo, or live site.
- **No external API** for core functionality.
- Allowed: open-source npm/CDN libraries, `localStorage`, `sessionStorage`, `IndexedDB`.
- **Start from zero.** Write all code fresh in this repo. Do not paste old projects, personal templates, or anyone else's code.
- **No real personal data.** Use only the provided sample pack for testing.
- Deploys as a **static site over public HTTPS**, no login, no installation. Vite `base` must be `'./'` so it works on Netlify, Vercel, or GitHub Pages.
- Limits to enforce in the UI: PDFs only, **max 30 files, max 50 MB total**.
- Do not use `git push --force`, rebase pushed commits, or rewrite history.

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Build | React + Vite (JavaScript, not TypeScript, for speed) |
| Styling | Tailwind CSS (follow `DESIGN.md` tokens: colors, fonts, spacing, radii) |
| State | React Context API + `useReducer` |
| PDF merge, footer, cover | `pdf-lib` |
| Page counting | `pdf-lib` (`PDFDocument.load` then `getPageCount()`) |
| Optional previews | `pdfjs-dist` (only if time allows; not required) |
| Hashing (duplicates) | Web Crypto `crypto.subtle.digest('SHA-256', bytes)` |
| Routing | **None.** Single-page workspace. Do not install `react-router-dom` unless `PAGES.md` explicitly asks. |
| Persistence | `localStorage` for language only (core). More in Phase 2. |
| Bangla font | Google Font "Noto Sans Bengali" with a system fallback stack |

Install only what is listed. Do not add libraries without a clear reason.

---

## 4. Folder Structure

```
devfest-<regno>/
├── AGENTS.md
├── PAGES.md
├── DESIGN.md
├── README.md
├── LICENSE                  (MIT)
├── index.html
├── package.json
├── vite.config.js           (base: './')
├── output/                  (final <tender_id>_Package.pdf goes here)
├── screenshots/             (at least one showing document statuses)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx   (state, reducer, provider, hooks)
    ├── i18n/
    │   ├── en.js
    │   ├── bn.js
    │   └── useT.js          (t(key, vars) helper)
    ├── lib/
    │   ├── status.js        (PURE status logic)
    │   ├── hash.js          (SHA-256, duplicate grouping)
    │   ├── pdfInfo.js       (validate PDF, page count, error classification)
    │   ├── buildPackage.js  (cover, merge, footers)
    │   └── dates.js         (date string compare helpers)
    └── components/
        ├── Header.jsx
        ├── LanguageToggle.jsx
        ├── TenderInfo.jsx
        ├── RequirementsList.jsx
        ├── RequirementRow.jsx
        ├── FileUploader.jsx
        ├── FileList.jsx
        ├── FileItem.jsx
        ├── MatchSelect.jsx
        ├── ExpiryInput.jsx
        ├── StatusBadge.jsx
        ├── SummaryBar.jsx
        ├── GeneratePanel.jsx
        └── Toast.jsx
```

---

## 5. Data Model

`requirements.json`:

```json
{
  "tender": { "tender_id", "title", "procuring_entity", "bidder", "submission_deadline": "YYYY-MM-DD" },
  "requirements": [
    { "id": "R01", "order": 1, "title_en": "...", "title_bn": "...", "mandatory": true, "has_expiry": true }
  ]
}
```

Validate on load: `tender` exists, `requirements` is a non-empty array, each item has `id`, `order`, `title_en`, `title_bn`, `mandatory`, `has_expiry`. On failure show a clear bilingual error and do not crash. Always sort requirements by `order` ascending (do not trust the file order).

App state (single reducer):

```js
{
  lang: 'en' | 'bn',
  tender: null | {...},
  requirements: [],                 // sorted by order
  files: [                          // uploaded files
    { id, name, size, pages, hash, bytes /* ArrayBuffer/Uint8Array */ }
  ],
  matches: { [requirementId]: fileId },   // one file per requirement
  expiry:  { [requirementId]: 'YYYY-MM-DD' },
  generating: false,
  notice: null                      // toast message { type, key, vars }
}
```

**Derive, never store:** statuses, duplicate groups, file→requirement reverse map, blocking list, totals. Compute with `useMemo` so every change updates instantly.

---

## 6. Status Logic (CRITICAL, put in `src/lib/status.js`, pure function, no React)

Each requirement has EXACTLY ONE status:

| Status key | Condition | Blocks? |
|---|---|---|
| `missing` | mandatory AND no file matched | YES |
| `expiryNeeded` | has_expiry AND file matched AND no expiry date entered | YES |
| `expired` | has_expiry AND file matched AND expiry < submission_deadline | YES |
| `notProvided` | NOT mandatory AND no file matched | NO |
| `ok` | file matched AND (not has_expiry OR expiry >= submission_deadline) | NO |

Rules and edge cases:

- **Same-day expiry is OK** (`expiry === deadline` → `ok`). Use `>=`.
- Compare dates as **`YYYY-MM-DD` strings** (lexicographic). Never use `new Date()` for comparison (timezone bugs).
- Optional document with a file matched and `has_expiry` follows the same expiry rules (expiryNeeded/expired/ok).
- If a file is unmatched from a requirement, its entered expiry is discarded (or ignored). Re-matching should start with an empty expiry.
- Evaluation order: no file → (mandatory ? missing : notProvided); file present and has_expiry → no date ? expiryNeeded : (date < deadline ? expired : ok); else ok.
- `canGenerate = requirements.length > 0 && no requirement has a blocking status`.

Export a function: `getStatus(requirement, hasFile, expiryDate, deadline) → statusKey` and `getBlockingList(...)`. Add a tiny self-check block (comments or a `status.test.js` if time) covering: same-day, day before, day after, missing expiry, optional none, optional with file.

---

## 7. Duplicate Detection

- On upload, compute SHA-256 of file bytes. Files with **identical hash** form a duplicate group (even if names differ).
- Mark every file in a group (2+) with a visible "Duplicate" badge in the file list, showing which file it duplicates.
- **Matching rule:** a file that is a duplicate of a file already matched to requirement A **cannot be matched to a different requirement**. Disable that option in `MatchSelect` and show an explanation. (Matching the *same* requirement by swapping which duplicate is used is allowed.)
- Never silently delete duplicates. The user decides which to remove.

---

## 8. Upload Rules (`FileUploader`, `lib/pdfInfo.js`)

- Accept via file picker AND drag-and-drop, multiple files at once.
- A file is valid only if: extension/MIME looks like PDF AND first bytes are `%PDF`. Otherwise **reject with a clear bilingual message naming the file**.
- Enforce 30 files / 50 MB totals; reject the overflow with a clear message.
- Page count: `PDFDocument.load(bytes)` then `getPageCount()`. If it throws:
  - encrypted/password-protected → message "password-protected, cannot be used"
  - otherwise → message "damaged or unreadable"
  Never crash; never add such a file to the list (or add it flagged as unusable and not matchable).
- Show name, page count, size. Provide a Remove button; removing a file also removes its match and expiry.
- Ignore exact re-upload of the same name+size+hash? No: still add it, it will be flagged as duplicate.

---

## 9. Package Generation (`lib/buildPackage.js`), follow EXACTLY

Output order:

1. **Page 1: Cover page, in ENGLISH** (always English, regardless of UI language), showing:
   tender ID, tender title, procuring entity, bidder name, submission deadline, **date the package was generated** (today, `YYYY-MM-DD`, local date), and **the list of included documents in order** (use `title_en`, numbered; include the file name optionally).
2. **Documents sorted by requirement `order`.** Include ALL pages of each file in original order. **Skip optional documents with no file.**
3. **Every page, including the cover, has a footer** at the bottom: `<tender_id> | Page X of Y`, where Y is the **total pages in the whole package** (cover + all document pages, + index page if Phase 2 enabled).
4. **Footer must be readable and must not cover document content.**

Footer implementation (safe approach, required):

- For each source page, create a NEW page in the output of size `(w, h + FOOTER_H)` with `FOOTER_H ≈ 28 pt`, embed/draw the original page at `y = FOOTER_H` so original content is shifted up and the bottom strip is empty, then draw the footer text (Helvetica, 9–10 pt, dark gray/black on the white strip, centered).
- Use `pdfDoc.embedPdf(sourceBytes)` / `embedPage` per source page, then `page.drawPage(embedded, { x: 0, y: FOOTER_H })`.
- **Handle rotated pages** (`/Rotate` 90/180/270) and unusual page sizes and non-zero MediaBox origins. Test on every sample file. If a page is rotated, normalize before placing so content is upright and nothing is clipped.
- Cover page uses the same footer strip approach (A4, 595.28 x 841.89 pt) so footers are consistent.
- The footer text for page numbering is computed after the final page count is known (two-pass: assemble all pages first, then stamp footers with X and Y).
- Cover text in English uses `StandardFonts.Helvetica` (Latin only). Long titles/document lists must wrap and overflow to a **second cover page ONLY if truly necessary**; prefer font shrink/wrapping to keep a single cover page. If the cover does overflow to 2 pages, count it in Y and mention it in a code comment.
- Guard generation with try/catch; on failure show a bilingual error toast; never leave `generating` stuck on true.
- Download via `Blob` + `URL.createObjectURL` + temporary `<a download="<tender_id>_Package.pdf">`; revoke the URL afterwards.
- Generate button is **disabled while any blocking status exists** and shows WHY (list of blocking requirements and their statuses) next to the button.

---

## 10. Internationalization

- All user-facing strings live in `src/i18n/en.js` and `bn.js` (same keys in both). **No hard-coded UI strings in components.**
- `useT()` returns `t(key, vars)`. Language stored in context and `localStorage`; default `en`.
- Switching language updates the **whole app immediately**: labels, buttons, messages, statuses, errors, tender field labels, empty states, and requirement names (`title_bn` in Bangla, `title_en` in English).
- Tender field *values* (title, entity, bidder) come from JSON as-is.
- Bangla digits are optional; keep dates and numbers in ASCII digits for safety.
- The generated PDF cover is English only (Bangla on PDF is a Phase 2 bonus).
- Apply a Bangla-capable font when `lang === 'bn'` (set `font-family` on `<html>` or root div).

---

## 11. UX Requirements

An office worker with **no tech skills** must finish without help, in either language:

- Plain words, large clear buttons, obvious next step.
- Status badges use **color + icon + text** (never color alone): Missing (red), Expiry date needed (amber), Expired (red/dark), Not provided (gray), OK (green).
- A summary bar shows counts per status and an overall "Ready / Not ready" message.
- Friendly empty states ("Load requirements.json to begin").
- Confirm destructive actions only if cheap; otherwise offer undo-friendly flows (changing/clearing a match is always one click).
- Responsive down to ~1024px wide at least; usable on laptop screens. Keyboard accessible controls with labels.
- Never show a blank screen or crash; wrap the app in an error boundary with a bilingual message.

---

## 12. Coding Standards

- Functional components + hooks. Small components, one responsibility each.
- Keep business logic in `src/lib/*` (pure, testable), not inside components.
- Use `useReducer` actions: `SET_LANG, LOAD_TENDER, ADD_FILES, REMOVE_FILE, SET_MATCH, CLEAR_MATCH, SET_EXPIRY, SET_GENERATING, NOTICE`.
- Store file bytes as `Uint8Array`/`ArrayBuffer` in state; do not serialize them into localStorage.
- Match enforcement lives in the reducer (single source of truth): one file → at most one requirement; one requirement → at most one file; duplicate rule from section 7. Assigning a file already used elsewhere should **move** it (clear the old match) or be blocked with a message, as specified in `PAGES.md`.
- No `console.log` noise in the final build. No dead code. No unused dependencies.
- Follow `DESIGN.md` strictly for colors, typography, spacing, component styles. Use Tailwind utility classes; extend `tailwind.config` with the design tokens.
- Accessibility basics: `<label>`s, `aria-live` for status changes and toasts, focus-visible styles.

---

## 13. Git & Commit Rules (contest-mandatory)

- Repo is public, named `devfest-<regno>`. Setup commits (README + MIT LICENSE only, no project code) are allowed before T+0.
- **Commit at least every 30 minutes and at least 3 times total.** Prefer ~6–8 small commits.
- **Every commit message must have a short change note AND the AI prompt used**, or `Manual edit` if no AI was used. Template:

```
feat: <short change note>

AI prompt: "<the exact prompt given to the AI for this change>"
```

or

```
fix: <short change note>

Manual edit
```

- Never force-push, rebase pushed commits, or delete the repo.
- Final eligible commit and matching deployment by **T+90**. After T+90: no code, Git, or deploy changes.
- The live site must match the final commit.

---

## 14. Definition of Done (checklist)

Main tasks:

- [ ] 4.1 Load `requirements.json`, show tender details + requirements sorted by `order`.
- [ ] 4.2 Multi-upload; show name + pages; reject non-PDFs with clear message; remove files.
- [ ] 4.3 Match file ↔ requirement (1:1), change/undo anytime.
- [ ] 4.4 Expiry input for `has_expiry` + matched.
- [ ] 4.5 Live statuses for every requirement.
- [ ] 4.6 Duplicate detection by content hash; blocked from matching to different requirements.
- [ ] 4.7 Generate disabled with visible reasons while blocking statuses exist.
- [ ] 4.8 Download `<tender_id>_Package.pdf`.
- [ ] 4.9 Full Bangla/English switch including requirement names.
- [ ] PDF: English cover, ordered docs, footers `<tender_id> | Page X of Y` on all pages, no overlap.

Submission:

- [ ] `README.md`: run instructions, completed main/bonus features, known problems, AI tools used, most useful prompt.
- [ ] `LICENSE` (MIT).
- [ ] `output/<tender_id>_Package.pdf` generated from the sample pack after resolving its problems.
- [ ] `screenshots/` with at least one showing document statuses.
- [ ] Public HTTPS live link works in Chrome with no login.
- [ ] Official form submitted by T+90 with name, reg no., repo link, final commit ID, live link.

---

## 15. Phase 2 (ONLY after all main tasks work, in this order)

1. Export checklist as CSV (document, file name, pages, expiry date, status) with a UTF-8 BOM so Excel shows Bangla.
2. Index page after the cover with start page of each document (page count includes the index).
3. Safe handling of bad files (already partly covered in section 8; make messages polished).
4. Auto-match by file name similarity (suggest, never force; user confirms).
5. Save/reopen via export/import of a JSON project file (metadata only: matches by file name+hash, expiry dates, language).
6. Seal/signature PNG placed on chosen pages.
7. Bangla text on PDF cover/index (embed Noto Sans Bengali with `@pdf-lib/fontkit`).
8. AI help with user's own API key (skip unless everything else is done).

Never let Phase 2 work break the main flow. Bonus tasks only earn marks if the main tasks work.
