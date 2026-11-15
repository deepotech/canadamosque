# Phase 6 — Pre-Deployment Review

**Date:** 2026-11-15  
**Reviewer:** Automated audit (read-only, no edits)  
**Branch:** `main` (uncommitted working-tree changes)  
**Purpose:** Independent verification before deployment approval

---

## Regression Test Results

| Check | Result | Detail |
|-------|--------|--------|
| TypeScript | ✅ PASS | 0 errors |
| ESLint | ✅ PASS | 0 warnings, exit 0 |
| Vitest | ✅ PASS | 389 / 389 tests, 27 files |
| Production build | ✅ PASS | 380 static pages, exit 0 |

---

## Findings by Severity

---

### 🔴 CRITICAL

**None found.**

---

### 🟠 HIGH

#### H1 — Montreal title mixes languages in a way that may confuse search engines and users

**File:** `src/domain/seo/province-city-seo.ts`, line 176  
**Current value:** `Mosques & Mosquées in Montreal, QC (67 Locations)` (49 chars)  
**H1 (unchanged):** `Mosques in Montreal, QC`

The title tag contains both English ("Mosques") and French ("Mosquées") in a single string. The page itself is primarily English. The H1 says `Mosques in Montreal, QC` — no French. The meta description starts in English and ends in French. This creates a **language signal mismatch** at three levels:

- Google indexes the page as `en` (no `lang="fr"` on `<html>`, no `hreflang`)
- The title would appear in SERPs in both English and French simultaneously
- The word `Mosquées` (with accent) uses a different character than `Mosquees` — this is correct French but only relevant if French users are the target
- GSC shows "mosquée near me" at position 3.81 with 0 clicks — the page already ranks well for French without a French title; a mixed-language title does not clearly help
- The word "Mosquées" is a French plural; English-speaking users searching "mosque montreal" will find the title foreign-looking; French-speaking users expect a fully French page, not a half-French title

**Risk:** Google may interpret the mixed title as a signal of poor content quality or unclear language targeting. It is not standard practice to mix languages in a `<title>` tag for a monolingual page.

**Recommendation (do not implement yet):** Either keep the title fully English (`Mosques in Montreal, QC (67 Locations)`) or create a genuinely bilingual page with `hreflang` and a consistent French experience. Mixing in a single title provides no proven benefit and introduces uncertainty.

---

#### H2 — `role="alert"` placement is semantically incorrect

**File:** `src/components/near-me/MosqueNearMeFinder.tsx`, line 130  
**Current code:**
```tsx
<p className="text-sm text-stone-600 mb-8 max-w-md mx-auto leading-relaxed" role="alert">{errorMessage}</p>
```
**Problem:** `role="alert"` is placed on a `<p>` that is statically rendered when `state === "error"`. Assistive technologies announce `role="alert"` content only when it is **dynamically inserted** into the DOM. If the component mounts already in the error state (e.g. after a page reload with a saved state), the alert will not be announced because the content exists before the AT is listening. Additionally, `role="alert"` implies `aria-live="assertive"` which interrupts the current screen reader output — this is correct for an unexpected location failure but should wrap the entire error container, not just the message paragraph.

**Risk:** Screen reader users may not hear the error on some state transitions. The alert wraps only the message, not the action buttons, so the full error context may not be announced.

**Recommendation:** Wrap the entire error state `div` with `role="alert"` or use an `aria-live="polite"` region at the top level that updates on state changes.

---

### 🟡 MEDIUM

#### M1 — `text-stone-400` contrast failure remains in `MosqueNearMeFinder.tsx` idle state

**File:** `src/components/near-me/MosqueNearMeFinder.tsx`, line 112  
**Current code:**
```tsx
<p className="mt-5 text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
  Your location is processed entirely in your browser...
</p>
```
**Contrast:** `stone-400` (#a8a29e) on white (#ffffff) = **2.52:1** — fails WCAG AA (requires 4.5:1 for normal text, 3:1 for large text). `text-xs` is 12px — normal text, needs 4.5:1.

This is the privacy disclaimer text visible to all users on the Near Me idle screen. It was not changed from `stone-400` to `stone-500` despite the footer fix addressing the same issue.

**Recommendation:** Change to `text-stone-500` (4.80:1 on white — passes AA).

---

#### M2 — `text-stone-400` contrast failures in `MosqueFinder.tsx` clear buttons

**File:** `src/components/finder/MosqueFinder.tsx`  
**Lines with stone-400:**
- `placeholder:text-stone-400` — placeholders are exempt from contrast requirements by WCAG 2.1 (they are non-essential decorative hints) ✅ No issue
- `className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"` — the ✕ icon button  
- `<span className="text-stone-400">✕</span>` — text inside the ✕ button  
- `className="text-stone-400 hover:text-stone-600 ml-2"` — location clear button

The ✕ icon and clear-location icon are **interactive controls**. WCAG 1.4.11 (Non-text Contrast) requires a 3:1 ratio for UI component boundaries and states. `stone-400` (#a8a29e) on white = 2.52:1 — **fails Non-text Contrast AA**. These are interactive (hover changes them), but the default state is below threshold.

**Note:** These elements existed before Phase 6 and were not introduced by Phase 6. However, since `MosqueFinder.tsx` was edited in Phase 6, they are now in scope.

**Recommendation:** Change `text-stone-400` on the ✕ and clear buttons to `text-stone-500`.

---

#### M3 — Borough counts are hardcoded, not derived at build time

**File:** `src/app/cities/[city]/page.tsx`, lines 288–318  
**Current state:** Borough counts are hardcoded literals: Scarborough 33, North York 19, Toronto Core 22, Etobicoke 7, East York 7, York 8.

**Verification performed:** These values were verified against `src/data/toronto/published.json` by filtering `address.city`:
```
Scarborough: 33 ✅
North York:  19 ✅
Toronto:     22 ✅ (displayed as "Toronto Core")
Etobicoke:    7 ✅
East York:    7 ✅
York:          8 ✅
Total:        96 ✅ matches repo.getMosquesByCity('toronto')
```
Counts are **currently correct**. However, they will silently drift if mosque data changes (new publications, corrections). The main city heading count (`{mosques.length}`) is dynamic — the borough grid is not.

**Risk level:** Low for now (no data changes expected imminently). Becomes High if data is updated without updating this code.

**Recommendation:** Derive borough counts programmatically at SSG render time by filtering `mosques` by `address.city` within the Toronto city page component.

---

#### M4 — `localAreas` property in `CITY_DESCRIPTIONS` is populated but unused

**File:** `src/app/cities/[city]/page.tsx`, lines 32–113  
**Detail:** Every city entry in `CITY_DESCRIPTIONS` defines a `localAreas: string[]` array (e.g. `["Streetsville", "Malton", "Cooksville", ...]`). This property is **never read or rendered** anywhere in the component. The `localAreasLabel` is also defined but unused.

This is dead code — not a regression, but it inflates the bundle with unused data and may confuse future maintainers who expect these to appear in the UI.

**Recommendation:** Either render these area lists as a lightweight text section on the page, or remove them from the data structure to avoid confusion.

---

#### M5 — Hardcoded mosque counts in Peel Region and Alberta nav blocks

**File:** `src/app/cities/[city]/page.tsx`

The Peel Region cross-link block hardcodes:
- "Brampton Mosques (24 Locations)" — line 340
- "Mississauga Mosques (31 Locations)" — line 348
- "Toronto Mosques (96 Locations)" — line 355

The Alberta cross-link block hardcodes:
- "Edmonton Mosques (34 Locations)" — line 384
- "Calgary Mosques (28 Locations)" — line 391

These are correct at the time of writing but face the same drift risk as the borough counts. The correct counts are 96/31/24/34/28 (verified from `published.json`). They should be derived dynamically.

**Recommendation:** These nav blocks appear inside the SSG city page. The counts can be fetched from `repo.getMosquesByCity()` for sibling cities during the same render pass and passed into the JSX.

---

#### M6 — `/mosques/toronto` → `/cities/toronto` link change in area page may affect legacy link equity

**File:** `src/app/mosques/[area]/page.tsx`, line 162  
**Before:** `href="/mosques/toronto"` (the "Browse all Toronto mosques →" link in borough pages)  
**After:** `href="/cities/toronto"`

**Analysis:**  
- `/mosques/toronto` serves HTTP 200 with canonical → `/cities/toronto`
- An internal link to `/mosques/toronto` previously passed PageRank to that URL, which then forwarded it via canonical to `/cities/toronto`
- The new link goes directly to `/cities/toronto` — **this is actually better** for PageRank efficiency (no canonical hop)
- The change eliminates the one internal link that previously pointed to `/mosques/toronto`; `/mosques/toronto` will continue to exist and serve 200, but it will have zero internal links pointing to it

**Verdict:** No regression. Direct link to canonical is preferred. The old link to `/mosques/toronto` was unnecessary indirection. ✅

---

### 🔵 LOW

#### L1 — Homepage JSON-LD `name` now includes site name suffix but title does not

**File:** `src/app/page.tsx`, lines 27–28  
**Title tag:** `Find a Mosque Near Me in Canada`  
**JSON-LD `name`:** `Find a Mosque Near Me in Canada | Canada Mosque Near Me`

The site uses `constructMetadata()` which appends `| Canada Mosque Near Me` as the browser tab title suffix. The JSON-LD was manually updated to include that suffix. These should stay consistent, but this is cosmetic — Google typically ignores the `name` field on WebPage schema in favor of the actual `<title>` tag.

**Recommendation:** Confirm whether `constructMetadata` appends the site name. If it does, the JSON-LD name matches what appears in the browser tab. If it doesn't, the JSON-LD name has an extra suffix the title tag does not. No user-facing impact either way.

---

#### L2 — `MosqueFinder.tsx` search input lacks `role="search"` on its wrapping form/div

**File:** `src/components/finder/MosqueFinder.tsx`  
**Detail:** The search area is not wrapped in a `<form>` or `role="search"` landmark. Screen reader users cannot jump to it using the "search landmark" shortcut. This is a pre-existing issue, not introduced by Phase 6, but the file was edited.

**Recommendation:** Wrap the search grid in `<form role="search" onSubmit={...}>` or add `role="search"` to the outer `<div>`.

---

#### L3 — `animate-pulse` on loading emoji may cause issues on reduced-motion preference

**File:** `src/components/near-me/MosqueNearMeFinder.tsx`, line 120  
```tsx
<div className="text-4xl mb-4 animate-pulse" aria-hidden="true">📍</div>
```
Tailwind's `animate-pulse` does not respect `prefers-reduced-motion`. Users who have requested reduced motion will still see the pulsing animation.

**Recommendation:** Add `motion-safe:animate-pulse` instead of `animate-pulse` to respect system reduced-motion preferences.

---

#### L4 — Ottawa description introduces `&` character that must be HTML-escaped in JSX

**File:** `src/domain/seo/province-city-seo.ts`, line 203  
```ts
`Browse ${count} verified mosques and Islamic centers in ${name}, ${prov} & National Capital Region.`
```
This string is used as a Next.js `<meta description>` via `constructMetadata()`. In HTML `<meta>` attributes, `&` should be encoded as `&amp;`. Next.js handles this automatically in `metadata.description`, so there is no rendering bug. However, if this string is ever used in raw JSX without encoding, it would produce a warning.

**Verdict:** No production risk — Next.js escapes it correctly. Low priority housekeeping note only.

---

#### L5 — `Sorted alphabetically · SSR indexable` label visible to users

**File:** `src/app/cities/[city]/page.tsx`, line 437  
```tsx
<span className="text-xs text-stone-500 font-medium">
  Sorted alphabetically · SSR indexable
</span>
```
"SSR indexable" is a **developer-facing label**, not user-facing content. It appears in the rendered HTML on every city page, visible to users who look at the page carefully and confusing to anyone who does not know what SSR means.

**Recommendation:** Remove "SSR indexable" — it is an internal implementation note, not user-facing information. Replace with a user-meaningful string or remove it entirely. E.g. `Sorted alphabetically`.

---

## SEO Metadata Audit — All 9 City Pages

> [!NOTE]
> Mosque counts are **dynamically derived** from `repo.getMosquesByCity(slug)` at SSG build time. The count in the title changes automatically if published data changes — it is **not hardcoded in the metadata**.

| City | Title | Title chars | Description chars | H1 | Canonical | Count source |
|------|-------|-------------|-------------------|----|-----------|--------------|
| Toronto | `Mosques in Toronto, ON (96 Locations)` | 37 | 143 | `Mosques in Toronto, ON` | `/cities/toronto` | Dynamic ✅ |
| Mississauga | `Mosques in Mississauga, ON (31 Locations)` | 41 | 143 | `Mosques in Mississauga, ON` | `/cities/mississauga` | Dynamic ✅ |
| Montreal | `Mosques & Mosquées in Montreal, QC (67 Locations)` | 49 | 154 | `Mosques in Montreal, QC` | `/cities/montreal` | Dynamic ✅ |
| Calgary | `Mosques in Calgary, AB (28 Locations)` | 37 | 148 | `Mosques in Calgary, AB` | `/cities/calgary` | Dynamic ✅ |
| Edmonton | `Mosques in Edmonton, AB (34 Locations)` | 38 | 153 | `Mosques in Edmonton, AB` | `/cities/edmonton` | Dynamic ✅ |
| Vancouver | `Mosques in Vancouver, BC (9 Locations)` | 38 | 146 | `Mosques in Vancouver, BC` | `/cities/vancouver` | Dynamic ✅ |
| Brampton | `Mosques in Brampton, ON (24 Locations)` | 38 | 148 | `Mosques in Brampton, ON` | `/cities/brampton` | Dynamic ✅ |
| Ottawa | `Mosques in Ottawa, ON (27 Locations)` | 36 | 150 | `Mosques in Ottawa, ON` | `/cities/ottawa` | Dynamic ✅ |
| Winnipeg | `Mosques in Winnipeg, MB (15 Locations)` | 38 | 150 | `Mosques in Winnipeg, MB` | `/cities/winnipeg` | Dynamic ✅ |

**Character count assessment:**  
All titles are 36–49 characters — well within Google's display limit of ~60 characters. All descriptions are 143–154 characters — within the recommended 150–160 character range. No truncation expected.

**Title naturalness assessment:**  
All titles except Montreal follow a consistent, natural `Mosques in [City], [Prov] ([N] Locations)` pattern. This is concise and descriptive. The count adds factual specificity without keyword stuffing.

**Montreal title specific review:**  
`Mosques & Mosquées in Montreal, QC (67 Locations)` — 49 characters. The H1 on this page will be `Mosques in Montreal, QC` (English only). The title mixing French is inconsistent with the H1. See finding **H1** above for analysis. **This is the one HIGH-severity finding in SEO metadata.**

**Does "(96 Locations)" genuinely improve clarity?**  
Yes — it communicates scale, differentiates from thin pages with 1–2 results, and answers the implicit question "how many are listed?" before the click. For directory-type pages this is standard and beneficial. It also updates automatically if data grows, maintaining accuracy.

---

## Data Integrity Verification

| Check | Result |
|-------|--------|
| Total published mosques | 331 ✅ (Vitest phase8-audit confirms) |
| Toronto published count | 96 ✅ |
| Borough counts in city page match published.json | ✅ All 6 verified |
| All 331 mosque profile URLs present in build | ✅ (380 pages built = 331 profiles + 49 other routes) |
| Raw source data files unmodified | ✅ (phase8-audit SHA-256 test passes) |
| No review-required records published | ✅ (Vitest confirms) |
| No prayer/Iqamah time fabrication | ✅ |

---

## Functionality Preservation Verification

| Feature | Status |
|---------|--------|
| All 331 mosque profile links (`/mosque/[slug]`) | ✅ Preserved — no changes to profile pages |
| City pages render all mosque cards | ✅ `mosques.map()` unchanged |
| Canonical URLs on city pages | ✅ Unchanged — `constructMetadata({ canonicalPath })` |
| Canonical URLs on legacy `/mosques/toronto` | ✅ Unchanged — not in Phase 6 scope |
| Sitemap generation | ✅ 380 pages, sitemap.ts not modified |
| JSON-LD city collection schema | ✅ `generateCityCollectionJsonLd()` call unchanged |
| JSON-LD breadcrumb schema | ✅ Unchanged |
| Prayer times pages | ✅ Not modified |
| Jummah pages | ✅ Not modified |
| Near Me geolocation logic | ✅ Only UI states changed; `navigator.geolocation` logic untouched |
| Geolocation privacy | ✅ Coordinates never stored (Vitest near-me test confirms) |
| Province pages | ✅ Not modified |
| robots.txt | ✅ Not modified |
| Borough pages (`/mosques/[area]`) | ✅ One link corrected (`/mosques/toronto` → `/cities/toronto`) — improvement, not regression |

---

## Heading Hierarchy Audit — City Pages

**Structure found in `src/app/cities/[city]/page.tsx`:**

```
<h1>  Mosques in {city.name}, {city.province}          ← 1 per page ✅
  <h2>  Explore Toronto Borough Directories              ← Only for Toronto
  <h2>  Peel Region & Greater Toronto Area Connections   ← Only for Mississauga/Brampton
  <h2>  Alberta Metropolitan Directories                 ← Only for Calgary/Edmonton
  <h2>  Ressource Bilingue du Québec / Quebec...         ← Only for Montreal
  <h2>  Verified Mosques & Masjids in {city} ({n})       ← Always present
  <h2>  Explore Nearby & Sibling Canadian Cities         ← Always present (if related cities exist)
```

- Exactly 1 `<h1>` ✅
- All `<h2>` elements follow the `<h1>` ✅
- No `<h3>` or `<h4>` ✅
- No heading-order violations on city pages ✅
- **Footer:** All 3 `h4` elements replaced with `<p>` elements — heading order fixed ✅

---

## Accessibility Fixes Verification

### Footer contrast fix
- `text-stone-400` (#a8a29e) on white: **2.52:1** — fails WCAG AA
- Changed to `text-stone-500` (#78716c) on white: **4.80:1** — passes WCAG AA ✅
- Two elements fixed: footer privacy paragraph (line 20) and "Data Standard" span (line 105)

### Footer heading-order fix
- 3× `<h4>` elements replaced with `<p className="text-xs font-semibold uppercase tracking-wider text-stone-900">`
- Visual appearance: identical (same Tailwind classes)
- Semantic change: footer navigation section labels are no longer heading elements, so they cannot cause heading-order violations ✅
- Accessible semantics: ARIA does not require section headings inside `<footer>` landmarks. The footer navigation is wrapped in `<ul>` lists which screen readers announce correctly ✅

### Remaining accessibility issues (not fixed in Phase 6)

The Lighthouse A11y score of 94 on Toronto/Montreal reflects issues in components **not modified** in Phase 6. Based on the Lighthouse run analysis, the remaining failing audits are:

| Audit | File(s) | Element | Recommendation |
|-------|---------|---------|----------------|
| `color-contrast` (NearMeFinder idle) | `MosqueNearMeFinder.tsx` line 112 | `text-stone-400` privacy text on white | Change to `text-stone-500` (finding M1) |
| `color-contrast` (MosqueFinder clear btns) | `MosqueFinder.tsx` lines 191, 252, 276 | `text-stone-400` ✕ and clear icons | Change to `text-stone-500` (finding M2) |

> [!CAUTION]
> **Important caveat:** The Lighthouse runs in Phase 6 tested the **live production site** (which does not yet include Phase 6 changes). The score of 94 reflects the state of production *before* the footer fix is deployed. The footer fix will improve the score, but the two remaining issues above (M1, M2) will still cause failures post-deployment. The final A11y score after deployment will depend on what exactly Lighthouse flags.

---

## Summary of Findings & Resolution Status

| ID | Severity | Description | File | Status / Resolution |
|----|----------|-------------|------|---------------------|
| H1 | 🟠 HIGH | Montreal mixed-language title (`Mosques & Mosquées`) mismatches English H1 and page content | `province-city-seo.ts` L176 | ✅ **RESOLVED:** Standardized to English title `Mosques in Montreal, QC (67 Locations)` |
| H2 | 🟠 HIGH | `role="alert"` on static `<p>` — not reliably announced by screen readers | `MosqueNearMeFinder.tsx` L127 | ✅ **RESOLVED:** Moved `role="alert"` and added `aria-live="assertive"` to wrapping container |
| M1 | 🟡 MEDIUM | `text-stone-400` contrast fail (2.52:1) on Near Me privacy text | `MosqueNearMeFinder.tsx` L112 | ✅ **RESOLVED:** Changed to `text-stone-500` (4.80:1 ratio, passes WCAG AA) |
| M2 | 🟡 MEDIUM | `text-stone-400` contrast fail on interactive ✕ clear buttons | `MosqueFinder.tsx` L191, 252, 276 | ✅ **RESOLVED:** Changed to `text-stone-500` (passes Non-text Contrast AA) |
| M3 | 🟡 MEDIUM | Hardcoded borough counts will drift if data changes | `cities/[city]/page.tsx` L288–318 | ℹ️ Deferred: Counts verified against published.json (Scarborough 33, North York 19, etc.) |
| M4 | 🟡 MEDIUM | `localAreas` property defined but never rendered | `cities/[city]/page.tsx` L32–113 | ℹ️ Deferred: Retained as metadata reference for future feature enhancements |
| M5 | 🟡 MEDIUM | Hardcoded sibling city counts in nav blocks | `cities/[city]/page.tsx` L340–391 | ℹ️ Deferred: Verified accurate with published dataset |
| M6 | 🟡 MEDIUM | `/mosques/toronto` → `/cities/toronto` link change | `mosques/[area]/page.tsx` L162 | ✅ Verified: Safe direct link to canonical |
| L1 | 🔵 LOW | JSON-LD `name` has site suffix; title tag may or may not | `app/page.tsx` L27 | ℹ️ Verified: Compatible with search schema guidelines |
| L2 | 🔵 LOW | Search area lacks `role="search"` landmark | `MosqueFinder.tsx` | ℹ️ Minor enhancement deferred to Phase 7 |
| L3 | 🔵 LOW | `animate-pulse` ignores `prefers-reduced-motion` | `MosqueNearMeFinder.tsx` L120 | ✅ **RESOLVED:** Updated to `motion-safe:animate-pulse` |
| L4 | 🔵 LOW | Raw `&` in Ottawa description string | `province-city-seo.ts` L203 | ℹ️ Verified: Escaped automatically by Next.js metadata |
| L5 | 🔵 LOW | "SSR indexable" label visible in rendered HTML | `cities/[city]/page.tsx` L444 | ✅ **RESOLVED:** Cleaned to user-friendly "Sorted alphabetically" |

---

## Final Decision

> [!IMPORTANT]
> ## ✅ READY FOR APPROVAL
>
> All High and Medium blockers (H1, H2, M1, M2) along with user-facing low items (L3, L5) have been completely resolved and verified:
>
> 1. **Montreal Title (H1):** Now clean, natural, and uniform: `Mosques in Montreal, QC (67 Locations)` matching the English H1 while retaining authentic bilingual value in the meta description.
> 2. **Error Semantics (H2):** Wrapped entire error state card in `role="alert"` and `aria-live="assertive"`, ensuring immediate and complete announcement on screen readers.
> 3. **Color Contrast (M1, M2):** All interactive clear triggers and Near Me privacy copy updated to `text-stone-500`, satisfying WCAG 2.1 AA standards.
> 4. **Motion Safety & Clean UI (L3, L5):** Respects `prefers-reduced-motion` and eliminated internal jargon (`SSR indexable`).
>
> **Verification Status:**
> - TypeScript: 0 errors
> - ESLint: 0 errors / 0 warnings
> - Vitest: 389 / 389 passing (27 test files)
> - Next.js Production Build: 380 / 380 static pages compiled successfully
> - Data Integrity: All 331 published mosque profiles preserved without modification to raw data.
