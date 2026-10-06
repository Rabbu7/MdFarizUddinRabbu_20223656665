# Tender Document Package Builder

A frontend-only React/Vite application for loading tender requirements, uploading and validating PDF documents, matching files to requirements, checking expiry dates, and downloading one ordered tender package. All document processing happens locally in the browser.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Completed main features

- **4.1 Requirements:** Load and validate `requirements.json`; show tender details and sort requirements by `order`.
- **4.2 PDF upload:** Upload by picker or drag-and-drop; show page counts and reject non-PDF, damaged, encrypted, and over-limit files.
- **4.3 Matching:** Enforce one-to-one requirement/file matching with unmatch and replacement actions.
- **4.4 Expiry dates:** Show expiry inputs only for matched requirements that require them.
- **4.5 Live statuses:** Derive Missing, Expiry date needed, Expired, Not provided, and OK statuses immediately.
- **4.6 Duplicates:** Detect duplicates with SHA-256 and prevent duplicate files from being matched to different requirements.
- **4.7 Generation gating:** Disable generation while blocking statuses remain and list clickable reasons.
- **4.8 Package download:** Download `<tender_id>_Package.pdf`.
- **4.9 Bilingual UI:** English/Bangla interface, translated status labels, Bangla requirement titles, and persisted language preference.
- **PDF rules:** English cover page, required tender metadata, local generated date, ordered included-document list, all matched document pages in order, optional unmatched documents skipped, and readable `<tender_id> | Page X of Y` footers on every page. Rotated, landscape, unusual-size, non-zero-origin, and blank source pages are handled without footer overlap.

## Completed bonus features

- Export a UTF-8-BOM checklist CSV from the SummaryBar with translated headers/statuses, current-language document titles, proper escaping, and filename `<tender_id>_Checklist.csv`.

## Known problems

- Vite reports a non-blocking bundle-size warning because `pdf-lib` is included in the client bundle.
- No production live deployment URL or bundled unseen sample pack is included in this repository.

## AI tools used

- GitHub Copilot
- Claude
- Google Stitch via MCP

## Most useful prompt

> Read AGENTS.md, PAGES.md and DESIGN.md in full before doing anything.Phase 6: generate and download the package. Follow AGENTS.md section 9 EXACTLY.
> Implement src/lib/buildPackage.js with pdf-lib:
> - Page 1: an ENGLISH cover page (A4) with tender ID, title, procuring entity, bidder, submission deadline, the date the package was generated (YYYY-MM-DD, local), and the ordered numbered list of included documents (title_en). Wrap text; shrink font if needed to keep one cover page. Optional documents with no file are not listed.
> - Then every matched file's pages in requirement `order`, all pages, original page order. Skip optional documents with no file.
> - Footer on EVERY page including the cover: "<tender_id> | Page X of Y", Y = total pages of the final package, X = page number. Place it in a reserved strip: for each source page create a new page of size (width, height + 28pt), draw the original page shifted up by 28pt (embedPdf / drawPage), then draw the footer centered in the empty strip in Helvetica 9-10pt, dark text. Handle rotated pages (/Rotate 90/180/270), landscape pages, odd page sizes and non-zero MediaBox origins so the content is upright, never clipped and never overlapped by the footer. Use a two-pass approach so Y is known before stamping.
> - Wire the Generate button (enabled only when nothing blocks): show "Creating your package..." with a spinner, wrap everything in try/catch, always reset the generating flag, show a bilingual error toast on failure.
> - On success show the DownloadCard from Stitch Screen D (fetch via MCP): file name <tender_id>_Package.pdf, total pages, Download PDF button (Blob + temporary <a download>, revoke the URL afterwards). The card clears if any input changes afterwards.

## Live site

LIVE_URL_HERE
