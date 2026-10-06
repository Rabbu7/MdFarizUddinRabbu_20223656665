---
name: Tender Document Package Builder
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#7f2500'
  on-tertiary: '#ffffff'
  tertiary-container: '#a73400'
  on-tertiary-container: '#ffc9b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  surface-bg: '#F5F7FB'
  surface-card: '#FFFFFF'
  surface-card-subtle: '#F8FAFC'
  border-default: '#E2E8F0'
  border-hover: '#CBD5E1'
  border-focus: '#1D4ED8'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  text-muted: '#64748B'
  status-ok-fg: '#15803D'
  status-ok-bg: '#DCFCE7'
  status-ok-border: '#86EFAC'
  status-missing-fg: '#B91C1C'
  status-missing-bg: '#FEE2E2'
  status-missing-border: '#FCA5A5'
  status-expired-fg: '#7F1D1D'
  status-expired-bg: '#FECACA'
  status-expired-border: '#F87171'
  status-date-needed-fg: '#92400E'
  status-date-needed-bg: '#FEF3C7'
  status-date-needed-border: '#FCD34D'
  status-not-provided-fg: '#475569'
  status-not-provided-bg: '#E2E8F0'
  status-not-provided-border: '#CBD5E1'
  status-duplicate-fg: '#9A3412'
  status-duplicate-bg: '#FFEDD5'
  status-duplicate-border: '#FDBA74'
typography:
  display-title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-section:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-subsection:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-default:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-secondary:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-secondary-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-badge:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-mono-metric:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

### Brand Personality
The design system embodies the authority, exactitude, and dependability of an official government portal blended with the frictionless clarity of a premier enterprise utility. It exists to serve civil servants, procurement officers, and vendor representatives who handle high-stakes regulatory submissions under hard deadlines. The user experience prioritizes psychological safety, legibility, and zero ambiguity.

- **Calm & Official:** Neutral foundations, balanced proportions, and measured typographic hierarchy instill trust and prevent cognitive fatigue during document-heavy operations.
- **High-Clarity Utility:** Every state transition is explicit. Problems, blocking validation errors, and missing attachments are impossible to overlook.
- **Uncompromising Rigor:** The system avoids consumer-tech trends—zero frosted glass, zero decorative gradients, and zero non-functional embellishments.

### Design Movement
**Modern Institutional Utility**—a synthesis of contemporary Scandinavian design systems (functional clarity, generous whitespace, strict grid discipline) and modern enterprise productivity software. Tactile depth is introduced through crisp 1px borders, subtle low-elevation drop shadows, and high-contrast status markers. 

The visual voice is bilingual-first (English and Bangla), ensuring typographic harmony across diverse script metrics while maintaining unwavering visual balance.

## Colors

The color system is engineered strictly for light-mode visual clarity, high ambient sunlight legibility, and WCAG AA contrast compliance across all functional text and UI elements.

### Brand & Core Neutrals
- **Primary (`#1D4ED8`):** Deep institutional blue. Anchors interactive elements: primary actions, active step counters, selected segmented tabs, focused input outlines, and primary text links.
- **Surface Canvas (`#F5F7FB`):** A tinted slate-blue neutral that removes stark screen glare and elevates pure white card containers.
- **Card Surface (`#FFFFFF`):** Base layer for all work panels, dialogs, and interactive modules. Paired with a calibrated `#E2E8F0` border.
- **Text Headings (`#0F172A`):** Deep slate-black, delivering high contrast for document titles, structural labels, and metrics.
- **Text Body & Secondary (`#475569`):** Medium slate gray for metadata, page counts, guidelines, and input labels.

### Semantic Status Architecture
Every semantic token pairs a dominant saturated foreground tone with a pastel-tinted background and a boundary border. Color is never deployed as an isolated indicator; it is always coupled with explicit iconography and definitive status labels.

- **OK / Complete:** `#15803D` foreground on `#DCFCE7` background (Border: `#86EFAC`).
- **Missing / Action Required:** `#B91C1C` foreground on `#FEE2E2` background (Border: `#FCA5A5`).
- **Expired Document:** `#7F1D1D` foreground on `#FECACA` background (Border: `#F87171`).
- **Expiry Date Needed:** `#92400E` foreground on `#FEF3C7` background (Border: `#FCD34D`).
- **Not Provided / Optional Incomplete:** `#475569` foreground on `#E2E8F0` background (Border: `#CBD5E1`).
- **Duplicate Document:** `#9A3412` foreground on `#FFEDD5` background (Border: `#FDBA74`).

## Typography

The typographic system provides high legibility under rigorous reading conditions. Font sizes never dip below 13px anywhere in the application.

### Bilingual Typography Rules
- **English Typography:** Set in **Inter** (fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). Tight geometric shaping with optimized tabular numbers for file sizes, dates, and package page tallies.
- **Bangla Typography:** When the interface is switched to Bangla (`বাংলা`), the font family transitions to **Noto Sans Bengali** (fallback: `sans-serif`).
- **Bangla Line-Height Constraint:** Because Bengali glyphs feature ascenders, descenders, and conjuncts (yuktakshars), line heights must expand to **at least 1.6** (e.g., 28px font size requires a line height of 44px; 16px body requires 26px line height). Horizontal padding and container minimum heights dynamically accommodate this vertical expansion.

### Hierarchy & Scale Tokens
- **Display Title (28px Bold):** Reserved for global screen/header anchors.
- **Section Title (20px Semibold):** Demarcates workspace stages, column headers, and modal panels.
- **Subsection / Item Title (16px Semibold):** Requirement labels, tender identifiers, and primary list items.
- **Body Default (16px Regular / Medium):** Primary instructions, dropzone commands, and active button text.
- **Secondary Body (14px Regular / Medium):** Input hint text, file sizes, page counts, tender metadata, and error explanations.
- **Badge Label (13px Semibold):** Status indicators, pill tags (Mandatory, Optional, Has expiry), and counter markers.

## Layout & Spacing

### Grid & Composition Strategy
The design system employs a **Desktop-First (1280px reference canvas)** asymmetric split-column architecture designed for zero vertical scrolling confusion:
- **Max Content Constraint:** 1440px centered workspace container with a 32px (`2rem`) horizontal safety gutter.
- **Working Layout (Desktop ≥ 1024px):** 
  - **Left Column (~60%):** Required documents list, validation statuses, and matching controls.
  - **Right Column (~40%):** Upload dropzone, file counter progress meters, and uploaded file manifest.
- **Stacked Reflow (< 1024px):** Converts to a single-column stacked format where file staging flows above or below the requirement list without loss of sticky accessibility.

### Spatial Rhythm Scale
Built on a strict 4px / 8px atomic increment:
- `space-xs` (4px): Micro gaps between status icons and text labels.
- `space-sm` (8px): Inner element spacing, vertical stack gaps between label and input field.
- `space-md` (16px): Structural internal padding for standard table/card rows, dropdown padding, and button horizontal margins.
- `space-lg` (24px): Canonical card interior padding (`p-6`), section header offsets, and column gaps.
- `space-xl` (32px): Major vertical space separating global workspace stages, tender summary header, and interactive panels.

### Sticky Summary Bar Placement
The summary bar spans 100% of the viewport width, pinned permanently to the bottom edge with a high z-index (50). It features 24px vertical interior breathing room to ensure critical package-readiness feedback remains persistently in view.

## Elevation & Depth

Visual hierarchy is communicated through structural tonal boundaries, precise 1px borders, and ultra-soft ambient shadowing.

### Surface Elevation Levels
- **Level 0 (Base Canvas):** `#F5F7FB` solid foundation. Flat, zero elevation.
- **Level 1 (Structural Cards & Modules):** Pure `#FFFFFF` surface, enclosed by a 1px solid `#E2E8F0` border. Rendered with an ambient, diffused shadow:
  - `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05);`
- **Level 2 (Hovered Rows, Dropdowns, Dropzones):** Subtle elevation enhancement signaling interactive affordance:
  - `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);`
  - Border transitions to `#CBD5E1`.
- **Level 3 (Sticky Action Deck & Modal Overlays):** Sticky bottom summary bar and floating status notifications:
  - `box-shadow: 0 -4px 12px 0 rgba(15, 23, 42, 0.08);`
  - Border top: 1px solid `#E2E8F0`.

### Status Border Accents
Cards and requirement rows with blocking statuses (Missing, Expired, Expiry Date Needed, Duplicate) employ a **3px solid left accent border** corresponding to their status color token (e.g., `#B91C1C` for missing/error, `#92400E` for date warning). This directs user attention immediately to problem areas during rapid visual scanning.

## Shapes

The design system maintains geometric discipline, pairing rounded cards with tighter button corners and distinct pill-shaped status indicators.

### Corner Radius Geometry
- **Outer Cards & Work Containers:** `12px` (`0.75rem`). Softens high-density data panels while retaining structural rigor.
- **Interactive Controls (Buttons, Form Inputs, Dropdowns):** `8px` (`0.5rem`). Delivers clear click targets and aligns with standard desktop SaaS input design.
- **Status Badges & Category Tags:** Fully rounded pill (`9999px`). The pill shape ensures instant visual differentiation between clickable rectangular controls and non-clickable informational status chips.
- **Step Indicators:** Circular containers (`rounded-full`, 32px × 32px) for step numbers, emphasizing progression and completeness.

## Components

### 1. Header Bar & Language Switcher
- **Header:** Height 64px, background `#FFFFFF`, border-bottom 1px solid `#E2E8F0`. Contains the application title (20px Semibold, `#0F172A`) paired with a file-shield icon.
- **Language Toggle (`LanguageToggle`):** Segmented control with a `#F1F5F9` background track and 4px padding. Contains two segments: "English" and "বাংলা". The active option has a `#1D4ED8` background, `#FFFFFF` text, 6px border-radius, and bold 13px typography. The inactive option uses `#475569` text with an instant 150ms background hover state (`#E2E8F0`).

### 2. Step Progress Indicator (`StepIndicator`)
- Horizontal layout displaying 4 distinct phases:
  1. Load requirements
  2. Upload files
  3. Match and check
  4. Create package
- **Step Node:** 32px circular badge. Active/Completed steps feature a solid `#1D4ED8` background with `#FFFFFF` text (or a checkmark icon when completed). Pending steps feature a `#F1F5F9` background, `#64748B` text, and a 1px border.
- **Connecting Rail:** 2px horizontal rule between nodes. Filled with `#1D4ED8` for completed segments; `#E2E8F0` for upcoming stages.

### 3. Tender Information Banner (`TenderInfo`)
- White surface card with a 12px border radius, 20px padding, and 1px border.
- Organizes 5 data points across a responsive grid: Tender ID, Tender Title, Procuring Entity, Bidder Name, and Submission Deadline.
- The Submission Deadline includes a calendar icon and subtle amber callout background (`#FEF3C7`, `#92400E` text) to reinforce urgency.
- Includes a secondary ghost button on the top right: "Load a different file" (14px, `#1D4ED8`).

### 4. Requirement Row Card (`RequirementRow`)
- Individual white card per requirement (or stacked segmented row) with 16px internal padding and an 8px border radius.
- **Header Line:** Requirement sequence number in a 24px neutral circle (`#F1F5F9`), document title in 16px semibold `#0F172A`, accompanied by tag pills:
  - `Mandatory`: Solid `#0F172A` background with `#FFFFFF` text (11px, uppercase tracking).
  - `Optional`: 1px outline border `#CBD5E1` with `#475569` text.
  - `Has expiry`: Small outline clock icon with "Has expiry" in `#64748B`.
- **Right Alignment:** Houses the `StatusBadge`.
- **Configuration Zone (Below Title):**
  - **Matched File Selector:** Full-width or inline `<select>` element (height 40px, 8px radius). Shows default "— No file —" or displays file name and page tally. Options already bound to other requirements display as disabled: `"(Used for: Trade License)"`.
  - **Expiry Date Input:** Rendered conditionally when a file is matched and the requirement requires an expiry date. Standard 40px input with an integrated calendar icon and supportive helper text (e.g., "Must be on or after 2026-10-20").
  - **Unmatch Action:** Ghost danger button (14px, `#B91C1C`) allowing one-click removal of file association.
- **Problem States:** Displays a 3px left border in `#B91C1C` (for Missing/Expired) or `#92400E` (for Expiry Date Needed).

### 5. Status Badge (`StatusBadge`)
Height 28px, pill-shaped (`rounded-full`), padding 4px 12px. Typographic spec: 13px Semibold. Every variant incorporates an outline Lucide icon (14px):
- **OK:** `#DCFCE7` background, `#15803D` text, `#86EFAC` border, `check-circle` icon.
- **Missing:** `#FEE2E2` background, `#B91C1C` text, `#FCA5A5` border, `x-circle` icon.
- **Expired:** `#FECACA` background, `#7F1D1D` text, `#F87171` border, `clock-alert` icon.
- **Expiry Date Needed:** `#FEF3C7` background, `#92400E` text, `#FCD34D` border, `calendar-alert` icon.
- **Not Provided:** `#E2E8F0` background, `#475569` text, `#CBD5E1` border, `minus-circle` icon.
- **Duplicate Badge:** `#FFEDD5` background, `#9A3412` text, `#FDBA74` border, `copy` icon.

### 6. Interactive Dropzone (`Dropzone`)
- **Step 1 / Master Variant:** Large dashed container (2px dashed `#CBD5E1`), background `#FFFFFF`, min-height 180px. Features a centered 40px document/JSON icon, clear callout heading ("Load requirements.json"), secondary instruction text, and a primary button. Drag-over state shifts border to 2px solid `#1D4ED8` and background to `#EFF6FF`.
- **Step 2 / Compact Variant:** Positioned in the right rail. Min-height 120px, dashed `#CBD5E1`, with counter indicator and secondary upload trigger button.

### 7. Uploaded File Item (`FileItem`)
- Stacked item inside the right panel: 12px padding, white surface, 1px solid border `#E2E8F0`, 8px corner radius.
- Layout: Lucide outline PDF icon (`#DC2626`), file name (truncated with middle or end ellipsis), secondary line showing page count and file size (e.g., "12 pages • 2.4 MB").
- Bottom metadata line displays match status: `Matched to: Trade License` (in `#1D4ED8`) or `Not matched` (in `#64748B`).
- Right edge: Destructive trash icon button (36px × 36px click target) with `#EF4444` hover state.
- **Duplicate State:** Border changes to 1px solid `#FDBA74`, background to `#FFFBEB`, with a prominent `Duplicate of [filename]` warning pill.

### 8. Action Deck & Summary Bar (`SummaryBar`)
- Sticky bottom console spanning 100% viewport width. Background `#FFFFFF`, border-top 1px solid `#E2E8F0`, box-shadow `0 -4px 12px rgba(15, 23, 42, 0.08)`.
- **Left / Status Summary:**
  - Status indicator chips grouping counts: `5 OK`, `1 Missing`, `1 Expired`, `1 Date needed`, `2 Not provided`.
  - Overall status banner: "Not ready: 3 problems to fix" (contained in a `#FEE2E2` pill with red text) or "Ready to generate" (`#DCFCE7` pill with green text).
- **Right / Generation Trigger:**
  - Primary button: "Generate package". Minimum 48px height, 24px horizontal padding.
  - **Disabled State:** Solid `#E2E8F0` background, `#94A3B8` text, `not-allowed` cursor. Accompanied by a dedicated warning popover or adjacent list: "Fix these first:" with clickable quick-links that jump to the respective invalid row.
  - **Ready State:** Solid `#1D4ED8` background, `#FFFFFF` text, active hover state (`#1E40AF`), prominent focus ring.
  - **Loading State:** Disabled appearance, rotating SVG spinner, text reads: "Creating your package...".

### 9. Success Package Download Card (`DownloadCard`)
- Green-tinted container (`#F0FDF4` background, 1px solid `#86EFAC` border, 16px padding, 12px radius).
- Features a large green PDF check icon, headline "Package Ready for Download", metadata ("T-2026-0417_Package.pdf • 28 pages • 14.2 MB"), primary action button "Download PDF" (min-height 44px), and a secondary link "Generate again".

### 10. Form Controls & Focus States
- **Text & Date Inputs:** Height 40px, padding 8px 12px, border 1px solid `#CBD5E1`, border-radius 8px. Font size 14px.
- **Focus Indicator (Global):** Unambiguous 2px outline ring in `#1D4ED8` with a 2px white offset (`ring-2 ring-primary ring-offset-2`).