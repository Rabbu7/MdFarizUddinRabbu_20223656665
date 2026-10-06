# PAGES.md — Screens, Components & Behavior

> UI behavior spec for the Tender Document Package Builder.
> Visual styling comes from `DESIGN.md` (Stitch). Architecture and logic rules come from `AGENTS.md`.
> The app is ONE page (the **Workspace**). No router.

---

## 1. Page Map

| Route | Screen | Purpose |
|---|---|---|
| `/` (only) | Workspace | The whole flow: load, upload, match, check, generate, download |

The Workspace has three visual states:

1. **Empty state:** no requirements loaded yet.
2. **Working state:** tender loaded; user uploads, matches, enters dates.
3. **Ready state:** no blocking statuses; Generate is enabled; after generation a Download card appears.

---

## 2. Workspace Layout (desktop, ≥1024 px)

```
┌──────────────────────────────────────────────────────────────┐
│ Header: App title                     [ EN | বাংলা ] toggle   │
├──────────────────────────────────────────────────────────────┤
│ Step 1  TenderInfo card  (or "Load requirements.json" button) │
├───────────────────────────────┬──────────────────────────────┤
│ Step 3  RequirementsList      │ Step 2  Uploaded Files        │
│ (rows: order, name, badge,    │ (FileUploader dropzone +      │
│  match select, expiry input)  │  FileList with remove/dup)    │
├───────────────────────────────┴──────────────────────────────┤
│ SummaryBar: counts per status + Ready/Not ready               │
├──────────────────────────────────────────────────────────────┤
│ GeneratePanel: [Generate package] + blocking reasons          │
│ Download card (after success)                                 │
└──────────────────────────────────────────────────────────────┘
```

- Two columns on wide screens (requirements ~60%, files ~40%); stack vertically below 1024 px.
- Steps are numbered 1–4 in the UI so a non-technical user always knows what to do next.
- A sticky bottom or top bar may hold the SummaryBar + Generate for visibility on long lists (optional, follow `DESIGN.md`).

---

## 3. Components

### 3.1 Header / LanguageToggle
- App title (bilingual). Segmented toggle `English | বাংলা`. Active option clearly highlighted.
- Toggle switches the **entire app instantly** and persists in `localStorage` (`lang`).
- Toggle button text itself always shows both names (`English`, `বাংলা`), regardless of current language.

### 3.2 TenderInfo (Step 1)
- Empty state: large button **"Load requirements.json"** (opens file picker, `.json` only) plus short helper text. Optional drag-and-drop.
- On success: card with labeled fields: Tender ID, Title, Procuring entity, Bidder, Submission deadline (shown as `YYYY-MM-DD`).
- Buttons: **"Load a different file"** (replaces tender; clears matches and expiry dates after confirming in a small inline confirm if files are matched).
- Errors (bilingual, specific): not valid JSON; missing `tender`; missing/empty `requirements`; item missing required fields. App never crashes.

### 3.3 FileUploader (Step 2)
- Dropzone with text "Drag PDF files here or click to choose" + button. Multiple files.
- Disabled (with hint) until requirements are loaded? **No.** Allow uploading anytime; matching needs requirements.
- Shows limits: "Up to 30 PDF files, 50 MB total" and a live counter (e.g. `12 / 30 files · 18.4 MB / 50 MB`).
- Processing indicator while hashing/parsing (spinner per batch).
- Rejection messages appear as dismissible alerts listing each rejected file with the reason:
  - not a PDF
  - password-protected
  - damaged/unreadable
  - limit exceeded (count or size)
- Valid files in the same batch are still added.

### 3.4 FileList / FileItem
Each row shows:
- File name (truncate with tooltip), **page count** ("12 pages"), size.
- **Matched to:** the requirement title (in current language) or "Not matched".
- **Duplicate badge** if its hash equals another uploaded file: "Duplicate of <other file name>" (all members of the group are marked).
- **Remove** button (trash icon + accessible label). Removing clears its match and expiry. Immediate, no modal; show an Undo toast if cheap, otherwise skip.
- Sort: in upload order. Duplicates visually highlighted (amber border/background per `DESIGN.md`).

### 3.5 RequirementsList / RequirementRow (Step 3)
Rows sorted by `order` ascending. Each row shows:

| Part | Detail |
|---|---|
| Order number | `1`, `2`, ... |
| Title | `title_bn` or `title_en` by language |
| Tags | "Mandatory" / "Optional"; "Has expiry" icon if `has_expiry` |
| **StatusBadge** | One of Missing, Expiry date needed, Expired, Not provided, OK |
| **MatchSelect** | Dropdown of uploaded files to assign (see 3.6) |
| **ExpiryInput** | Date input, only visible when `has_expiry` AND a file is matched |
| Clear match | Small "Unmatch" button when matched |

### 3.6 MatchSelect (matching behavior)
- Options: "— No file —" plus every uploaded file (name + pages).
- Selecting a file assigns it to this requirement.
- **One document gets at most one file.** Selecting a new file replaces the previous one (expiry date for this requirement is cleared when the file changes).
- **One file goes to at most one document.** Files already matched to another requirement are shown as "(used for: <title>)" and are **not selectable here** unless the user unmatches them first. (Alternative allowed by AGENTS.md: selecting moves it; pick ONE behavior and implement it consistently. Chosen behavior: **disabled option with the "used for" label**, which is the clearest for non-technical users.)
- **Duplicate rule:** if file B is a duplicate of file A and A is matched to requirement X, then B is disabled in all other requirements' dropdowns with the reason "Duplicate of a file already used". B remains allowed for X only (swap).
- Choosing "— No file —" or clicking Unmatch clears the match and expiry. This is the **undo**; changing a match is always one click.
- Statuses update **immediately** after every change.

### 3.7 ExpiryInput
- `<input type="date">` with a visible label ("Expiry date"). Value stored as `YYYY-MM-DD`.
- Empty → status "Expiry date needed". Before deadline → "Expired". On or after deadline → "OK".
- Shows a one-line hint: "Must be on or after <deadline>".
- Clearing the date returns the status to "Expiry date needed".

### 3.8 StatusBadge
Exactly one per requirement. Color + icon + text (never color alone).

| Status | EN label | BN label | Color | Blocks |
|---|---|---|---|---|
| `missing` | Missing | অনুপস্থিত | Red | Yes |
| `expiryNeeded` | Expiry date needed | মেয়াদ উত্তীর্ণের তারিখ প্রয়োজন | Amber | Yes |
| `expired` | Expired | মেয়াদোত্তীর্ণ | Dark red | Yes |
| `notProvided` | Not provided | প্রদান করা হয়নি | Gray | No |
| `ok` | OK | ঠিক আছে | Green | No |

### 3.9 SummaryBar
- Counts per status as chips (e.g. `OK 5 · Missing 1 · Expired 1 · Expiry date needed 1 · Not provided 2`).
- Overall banner: **"Not ready: N problem(s) to fix"** (red/amber) or **"Ready to generate"** (green).
- Also shows totals: requirements, files uploaded, duplicates found.

### 3.10 GeneratePanel (Step 4)
- Button **"Generate package"**.
  - **Disabled** while any requirement has a blocking status (`missing`, `expiryNeeded`, `expired`).
  - Directly beside/below it, a **visible list of why** it is disabled: one line per blocking requirement ("2. Tax Certificate: Expired"). Clicking a line scrolls to and highlights that row.
- While generating: spinner, button disabled, text "Creating your package...".
- On success: Download card with file name `<tender_id>_Package.pdf`, total pages, and a prominent **Download PDF** button (also auto-triggers download? **No**, only on click). Provide "Generate again" if data changes afterward (the card clears when any input changes).
- On failure: bilingual error toast, button re-enabled.

### 3.11 Toast / Alerts
- Short, bilingual, dismissible; `aria-live="polite"`.
- Types: success, info, warning, error.

### 3.12 ErrorBoundary
- Catches render errors; shows "Something went wrong. Reload the page." (bilingual) with a Reload button.

---

## 4. User Flow (happy path)

1. Open app → empty state → click **Load requirements.json** → tender card + requirement rows appear, all mandatory rows "Missing", optional rows "Not provided".
2. Drag in all PDFs → list shows names + pages; non-PDFs rejected with messages; duplicates flagged.
3. For each requirement choose a file in the dropdown → badge changes immediately.
4. For rows with expiry, enter the date → badge becomes OK / Expired.
5. Fix problems until banner says **Ready**.
6. Click **Generate package** → Download card → **Download PDF**.
7. Switch language at any time; nothing is lost.

---

## 5. Sample-Pack "Hidden Problems" the App Must Surface

The sample pack contains deliberate real-life issues. The UI must make each visible, never hide or auto-fix silently:

| Likely problem | How the app shows it |
|---|---|
| Missing mandatory document | `Missing` badge, blocks generation |
| Expired document | `Expired` badge, blocks generation |
| Expiry exactly on deadline | `OK` (same-day allowed) |
| Expiry date not yet entered | `Expiry date needed`, blocks generation |
| Duplicate files with different names | `Duplicate` badge on all copies; cannot be matched to different requirements |
| Non-PDF file in the folder | Rejected with a named message |
| Damaged / password-protected PDF | Rejected with a named, specific message |
| Optional document with no file | `Not provided`, does not block |
| Requirements in non-sorted order in JSON | Always sorted by `order` |
| Pages of mixed sizes/rotations | Footer still readable, no overlap with content |

---

## 6. Bilingual Copy (i18n keys, minimum set)

Keep identical keys in `en.js` and `bn.js`.

| Key | English | Bangla |
|---|---|---|
| `app.title` | Tender Document Package Builder | টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার |
| `step.load` | Step 1: Load tender requirements | ধাপ ১: টেন্ডারের শর্ত লোড করুন |
| `step.upload` | Step 2: Upload PDF files | ধাপ ২: পিডিএফ ফাইল আপলোড করুন |
| `step.match` | Step 3: Match files and check | ধাপ ৩: ফাইল মিলিয়ে যাচাই করুন |
| `step.generate` | Step 4: Create the package | ধাপ ৪: প্যাকেজ তৈরি করুন |
| `btn.loadJson` | Load requirements.json | requirements.json লোড করুন |
| `btn.chooseFiles` | Choose PDF files | পিডিএফ ফাইল বাছাই করুন |
| `btn.remove` | Remove | মুছুন |
| `btn.unmatch` | Unmatch | মিলানো বাতিল |
| `btn.generate` | Generate package | প্যাকেজ তৈরি করুন |
| `btn.download` | Download PDF | পিডিএফ ডাউনলোড করুন |
| `tender.id` | Tender ID | টেন্ডার আইডি |
| `tender.title` | Title | শিরোনাম |
| `tender.entity` | Procuring entity | ক্রয়কারী প্রতিষ্ঠান |
| `tender.bidder` | Bidder | দরদাতা |
| `tender.deadline` | Submission deadline | জমা দেওয়ার শেষ তারিখ |
| `req.mandatory` | Mandatory | বাধ্যতামূলক |
| `req.optional` | Optional | ঐচ্ছিক |
| `req.hasExpiry` | Has expiry date | মেয়াদের তারিখ আছে |
| `file.pages` | {n} pages | {n} পৃষ্ঠা |
| `file.notMatched` | Not matched | মেলানো হয়নি |
| `file.duplicateOf` | Duplicate of {name} | {name}-এর কপি |
| `match.noFile` | — No file — | — কোনো ফাইল নয় — |
| `match.usedFor` | used for: {title} | ব্যবহৃত: {title} |
| `expiry.label` | Expiry date | মেয়াদ শেষের তারিখ |
| `expiry.hint` | Must be on or after {date} | {date} বা তার পরে হতে হবে |
| `status.missing` | Missing | অনুপস্থিত |
| `status.expiryNeeded` | Expiry date needed | মেয়াদের তারিখ প্রয়োজন |
| `status.expired` | Expired | মেয়াদোত্তীর্ণ |
| `status.notProvided` | Not provided | প্রদান করা হয়নি |
| `status.ok` | OK | ঠিক আছে |
| `summary.ready` | Ready to generate | তৈরি করার জন্য প্রস্তুত |
| `summary.notReady` | Not ready: {n} problem(s) to fix | প্রস্তুত নয়: {n}টি সমস্যা ঠিক করতে হবে |
| `generate.why` | Fix these first: | আগে এগুলো ঠিক করুন: |
| `generate.working` | Creating your package... | প্যাকেজ তৈরি হচ্ছে... |
| `err.notPdf` | "{name}" is not a PDF and was rejected. | "{name}" পিডিএফ নয়, তাই বাদ দেওয়া হয়েছে। |
| `err.encrypted` | "{name}" is password-protected and cannot be used. | "{name}" পাসওয়ার্ড দিয়ে সুরক্ষিত, ব্যবহার করা যাবে না। |
| `err.damaged` | "{name}" is damaged or unreadable. | "{name}" নষ্ট বা পড়া যাচ্ছে না। |
| `err.limitCount` | Maximum 30 files allowed. | সর্বোচ্চ ৩০টি ফাইল অনুমোদিত। |
| `err.limitSize` | Total size cannot exceed 50 MB. | মোট আকার ৫০ এমবির বেশি হতে পারবে না। |
| `err.badJson` | This is not a valid requirements file. | এটি সঠিক requirements ফাইল নয়। |
| `err.generic` | Something went wrong. Please try again. | কিছু ভুল হয়েছে। আবার চেষ্টা করুন। |

(Copilot: extend with any additional keys the components need, always in both files. Review Bangla wording for natural phrasing.)

---

## 7. Empty, Loading and Error States

| Situation | Behavior |
|---|---|
| No tender loaded | Big load button + helper text; files section usable; rows hidden |
| Tender loaded, no files | Hint under dropzone; every mandatory row shows Missing |
| Hashing/parsing in progress | Spinner + "Reading files..." |
| Invalid JSON | Error alert in TenderInfo; previous tender (if any) is kept |
| All files removed | Matches and expiry dates for those files cleared; statuses update |
| Language switched mid-flow | All text updates; no state lost; uploaded file names unchanged |

---

## 8. Accessibility & Usability Checklist

- All inputs have visible labels; icon buttons have `aria-label`.
- Status changes announced via `aria-live`.
- Focus rings visible; fully keyboard operable (dropdowns, buttons, date inputs).
- Contrast meets WCAG AA in both languages.
- Touch/click targets at least 40 px high.
- Bangla text uses a Bengali-capable font with comfortable line height (≥1.5).

---

## 9. Acceptance Tests (manual, run on the sample pack before submitting)

1. Load `requirements.json`: rows sorted by `order`, tender fields correct, Bangla names show in BN mode.
2. Upload all PDFs plus a `.txt`/`.png` renamed or not: non-PDF rejected with the file name in the message; rest added with correct page counts.
3. Upload two identical PDFs with different names: both marked Duplicate; the second cannot be matched to a different requirement.
4. Match all; enter expiry for each `has_expiry` item: statuses correct, including same-day expiry = OK and day-before = Expired.
5. Remove a matched file: its row returns to Missing/Not provided; expiry cleared.
6. Generate disabled while any blocking status remains; reasons listed; clicking a reason scrolls to the row.
7. Resolve all problems, generate, download `<tender_id>_Package.pdf`; open in Chrome and verify:
   - Page 1 is the English cover with all required fields and the ordered document list.
   - Documents are in `order`, all pages present, optional-without-file skipped.
   - Every page (including cover) has `<tender_id> | Page X of Y` with the correct total, readable, not overlapping content (check portrait, landscape and rotated pages).
8. Switch language in the middle of the flow: nothing resets, all text translated.
9. Refresh the page: language preference persists.
10. Production build (`npm run build` and `npm run preview`) works; deployed HTTPS site behaves identically in Chrome without login.

---

## 10. Phase 2 UI (only after all of the above passes)

- **Export CSV** button in SummaryBar: document, file name, pages, expiry date, status.
- **Index page** toggle in GeneratePanel (default on): page numbers for where each document starts.
- **Auto-match** button: suggests matches by file-name similarity; user reviews and accepts/rejects each suggestion.
- **Save / Open project** buttons in Header: export/import a metadata JSON (matches by file name + hash, expiry dates, language); user re-uploads PDFs, then the app re-applies matches.
- **Seal/Signature:** upload PNG, pick pages (all / first / last / custom list), position preset (bottom-right, bottom-left, center), preview, stamp during generation without covering the footer.
- **Bangla on PDF cover/index** using an embedded Bengali font via `@pdf-lib/fontkit`.
