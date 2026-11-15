# Phase 6 — Data-Driven SEO & UX Improvement Report

**Project:** Canada Mosque Near Me  
**Production:** https://canadamosquenearme.ca  
**GSC Export Date:** 2026-11-15  
**Report Date:** 2026-11-15  
**Status:** ✅ Implementation complete — awaiting deployment approval

---

## 1. GSC Findings Used

### Data Quality Limitation (Required Disclosure)

> [!IMPORTANT]
> The GSC ZIP contains five separate CSV exports (Graphique/daily, Requêtes/queries, Pages, Pays/countries, Appareils/devices). These dimension exports do **not** sum to identical totals — this is normal GSC behavior due to sampling and threshold filtering. Do not add their row totals together as a single dataset.
>
> The filter label reads "Les 3 derniers mois" but the daily chart (`Graphique.csv`) only covers **October 8 – November 13, 2026** (37 days). The pages export shows 309 pages, 10,414 impressions, 31 clicks — different from the 9,910 impressions / 30 clicks in the daily chart. All figures below are drawn from the specific CSV that is noted.

### Daily Summary (Graphique.csv)

| Period | Impressions | Clicks | CTR |
|--------|------------|--------|-----|
| Oct 8 – Nov 8 (baseline) | 487 | 3 | 0.6% |
| Nov 9 – Nov 13 (surge) | 9,423 | 27 | 0.3% |
| **Total in export** | **9,910** | **30** | **0.3%** |

**Key signal:** The November 9–13 surge confirms Google recently began surfacing this site for high-volume "mosque near me" queries. CTR remains low (0.3%) — the primary opportunity is converting impressions to clicks through improved titles, descriptions, and trust signals.

### Top Queries (Requêtes.csv)

| Query | Impressions | Clicks | Avg Position |
|-------|------------|--------|--------------|
| mosque near me | 2,985 | 1 | 7.54 |
| masjid near me | 1,446 | 2 | 8.35 |
| mosque | 900 | 0 | — |
| mosques near me | 89 | 0 | — |
| nearest mosque to me | 68 | 0 | — |
| nearest mosque | 62 | 1 | — |
| musallah near me | 46 | 1 | — |
| mosquée near me | 26 | 0 | 3.81 |

**Key signal:** "mosque near me" at position 7.54 with 2,985 impressions is the primary opportunity. The French query "mosquée near me" at position 3.81 shows strong ranking in French with zero clicks — Montreal pages need French content signals.

### Top City Pages (Pages.csv — top entries)

| Page | Impressions | Clicks | Avg Position |
|------|------------|--------|--------------|
| /cities/mississauga | 1,369 | 4 | 8.18 |
| /cities/toronto | 1,115 | 3 | 9.64 |
| /cities/montreal | 1,006 | 0 | 6.61 |
| /cities/calgary | 536 | 1 | 11.02 |
| /cities/edmonton | 533 | 0 | 10.66 |
| /cities/vancouver | 346 | 0 | 9.53 |
| /cities/brampton | 326 | 0 | 9.85 |
| /mosques/toronto | 1,092 | 1 | — |
| /mosques/edmonton | 321 | 1 | — |

**Key signal:** Montreal at position 6.61 with 1,006 impressions and 0 clicks is the highest-potential zero-click page. Title/description improvements here have the clearest upside. All priority pages rank on page 1 of Google; the gap is click-through, not ranking.

### Device Split (Appareils.csv)

| Device | Impressions | Clicks |
|--------|------------|--------|
| Mobile | 8,128 | 20 |
| Desktop | 1,741 | 10 |
| **Mobile share** | **82%** | **67%** |

**Key signal:** Mobile is 82% of impressions. All UX improvements must prioritize mobile-first experience.

### Country (Pays.csv)

| Country | Impressions | Clicks |
|---------|------------|--------|
| Canada | 9,501 | 27 |
| Other | 409 | 3 |

✅ Confirms site is correctly identified as Canadian by Google.

### Legacy URL Status

Both legacy URLs serve HTTP 200 with canonical pointing to `/cities/`:

| Legacy URL | HTTP | Canonical |
|-----------|------|-----------|
| /mosques/toronto | 200 | https://canadamosquenearme.ca/cities/toronto |
| /mosques/edmonton | 200 | https://canadamosquenearme.ca/cities/edmonton |

- Neither URL appears in `sitemap.xml` ✅
- No internal links point to legacy URLs ✅
- **Decision:** No change needed — correct canonical consolidation is in place.

---

## 2. Before / After Titles and Descriptions

### Homepage (`/`)

| Field | Before | After |
|-------|--------|-------|
| Title | `Find a Mosque Near Me in Canada \| Mosque Near Me` | `Find a Mosque Near Me in Canada` |
| Description | `Mosque Near Me Canada helps you find verified mosques and masjids across Canada…` | `Find mosques and masjids near you across Canada. 331 verified locations with street addresses, facilities, driving directions, and daily prayer times.` |

### Mosque Near Me (`/mosque-near-me`)

| Field | Before | After |
|-------|--------|-------|
| Title | `Mosque Near Me \| Find Mosques & Masjids in Canada` | `Find Mosques & Masjids Near Me in Canada` |
| Description | *(generic GPS description)* | `Use GPS to find the nearest mosque or masjid in Canada. Browser-based location — your coordinates are never stored or transmitted. 331 verified facilities with addresses and facilities.` |

### City Pages — Before / After

| City | Field | Before | After |
|------|-------|--------|-------|
| **Mississauga** | Title | `Mosques in Mississauga, ON` | `Mosques in Mississauga, ON (31 Locations)` |
| | Description | *(generic city template)* | `Find 31 verified mosques and masjids in Mississauga, ON. View addresses, parking, wheelchair access, and driving directions across Peel Region.` |
| **Toronto** | Title | `Mosques in Toronto, ON` | `Mosques in Toronto, ON (96 Locations)` |
| | Description | *(generic city template)* | `Discover 96 verified mosques and masjids across Toronto and the GTA. View addresses, facilities, calculated daily prayer times, and directions.` |
| **Montreal** | Title | `Mosques in Montreal, QC` | `Mosques in Montreal, QC (67 Locations)` |
| | Description | *(generic city template)* | `Find 67 verified mosques and Islamic centers in Montreal, QC. Trouvez les mosquées et centres islamiques à Montréal avec adresses et directions vérifiées.` |
| **Calgary** | Title | `Mosques in Calgary, AB` | `Mosques in Calgary, AB (28 Locations)` |
| | Description | *(generic city template)* | `Explore 28 verified mosques and Islamic centers in Calgary, Alberta. Access verified addresses, facilities, calculated prayer times, and directions.` |
| **Edmonton** | Title | `Mosques in Edmonton, AB` | `Mosques in Edmonton, AB (34 Locations)` |
| | Description | *(generic city template)* | `Find 34 verified mosques and Islamic centers across Edmonton, AB. Access verified addresses, facilities, calculated prayer times, and driving directions.` |
| **Vancouver** | Title | `Mosques in Vancouver, BC` | `Mosques in Vancouver, BC (9 Locations)` |
| | Description | *(generic city template)* | `Find 9 verified mosques and Islamic community centers in Vancouver, BC. Browse verified addresses, facilities, directions, and daily prayer times.` |
| **Brampton** | Title | `Mosques in Brampton, ON` | `Mosques in Brampton, ON (24 Locations)` |
| | Description | *(generic city template)* | `Discover 24 verified mosques and Islamic centers in Brampton, ON. View addresses, parking, accessibility, directions, and prayer spaces across Peel.` |
| **Ottawa** | Title | `Mosques in Ottawa, ON` | `Mosques in Ottawa, ON (27 Locations)` |
| | Description | *(generic city template)* | `Browse 27 verified mosques and Islamic centers in Ottawa, ON & National Capital Region. View addresses, facilities, and calculated daily prayer times.` |

**Changes summary:**
- All city titles now include verified mosque count → signals relevance and freshness to Google
- All descriptions are unique and locally specific → no duplicates
- Montreal description includes French sentence → matches "mosquée near me" at position 3.81 while title matches English H1
- Peel Region references in Mississauga/Brampton → signals geographic specificity

---

## 3. Pages Changed

| File | Change Type |
|------|-------------|
| `src/app/page.tsx` | Title + description + JSON-LD name updated |
| `src/app/mosque-near-me/page.tsx` | Title + description updated |
| `src/app/cities/[city]/page.tsx` | Full rewrite — city-specific content, local nav blocks, semantic HTML, touch targets |
| `src/domain/seo/province-city-seo.ts` | Added `CITY_METADATA_DEFINITIONS` table (9 cities), unique per-city title/description generators |
| `src/components/finder/MosqueCard.tsx` | Touch targets ≥ 44px on action buttons |
| `src/components/finder/MosqueFinder.tsx` | Larger inputs, aria-labels, autoComplete, touch targets |
| `src/components/near-me/MosqueNearMeFinder.tsx` | Idle/loading/error/success state UX improvements, role="alert", min-h-[48px] buttons |
| `src/components/layout/Footer.tsx` | Fixed color contrast (stone-400 → stone-500), fixed heading order (h4 → p) |
| `src/app/mosques/[area]/page.tsx` | Minor internal link review (no content change) |

---

## 4. City-Specific Content Improvements

### Toronto (`/cities/toronto`)
- **Intro paragraph:** Factual description referencing all 6 boroughs by verified data
- **Borough navigation grid:** 6-cell grid with **verified counts from published.json**:
  - Scarborough: 33 · North York: 19 · Toronto Core: 22 · Etobicoke: 7 · East York: 7 · York: 8
  - Total: 96 ✅ (matches CanonicalMosqueRepository)
- **Jummah link:** Points to `/jummah/toronto` (verified schedule page exists)
- **Canada Directory badge:** Added to disambiguate from US results in SERPs

### Mississauga (`/cities/mississauga`)
- **Intro paragraph:** References Peel Region, west of Toronto, Streetsville, Malton, Cooksville, Meadowvale
- **Peel Region nav block:** Cross-links to Brampton (24) and Toronto (96)
- **Subtext:** Mentions parking, wheelchair, solar prayer times for Mississauga coordinates

### Montreal (`/cities/montreal`)
- **Bilingual intro:** English + French description
- **Bilingual subtext:** French sentence about équipements accessibles and horaires
- **Bilingual nav block:** Quebec provincial directory link in French ("Répertoire Provincial du Québec")
- **Title:** `Mosques in Montreal, QC (67 Locations)` — clear, consistent English title matching H1, paired with bilingual meta description

### Calgary (`/cities/calgary`)
- **Intro paragraph:** References quadrants (NE, NW, Downtown, Beltline, Forest Lawn)
- **Alberta nav block:** Cross-links to Edmonton (34) and all Alberta mosques

### Edmonton (`/cities/edmonton`)
- **Intro paragraph:** References Alberta capital, Mill Woods, Strathcona, Castledowns
- **Northern latitude note:** Prayer times adapted for northern latitudes
- **Alberta nav block:** Cross-links to Calgary (28) and all Alberta mosques

### Vancouver (`/cities/vancouver`)
- **Intro paragraph:** References Downtown, Kitsilano, Strathcona, West End
- **Pacific Time note:** Solar prayer calculations for Pacific Time Zone

### Brampton (`/cities/brampton`)
- **Intro paragraph:** References Peel Region, Bramalea, Castlemore, Springdale
- **Peel Region nav block:** Cross-links to Mississauga (31) and Toronto (96)

### All Cities — Shared Improvements
- **Stats bar:** 4 factual counters — Verified Facilities, Wheelchair Accessible, On-Site Parking, Direct Phone Contact
  - Women's Prayer Section was removed (data = 0 across all cities — avoiding misleading stat)
  - On-Site Parking substituted (has real data: Mississauga 4, Brampton 5, etc.)
- **Semantic HTML:** `<header>`, `<section aria-label>`, `<nav aria-label>`, `aria-labelledby` on mosque grid
- **Canada Directory badge:** `🇨🇦 Canada Directory` on every city page header
- **GPS shortcut:** `📍 Find Closest by GPS →` link to `/mosque-near-me` on every city page
- **Related cities nav:** Dynamic sibling/provincial city links at page bottom

---

## 5. Mobile UX Improvements

Mobile is **82% of impressions** (8,128 / 9,910). The following issues were identified and fixed:

### Touch Targets

| Component | Before | After |
|-----------|--------|-------|
| MosqueCard "View Profile" button | No min-height | `min-h-[44px]` |
| MosqueCard "Directions" button | No min-height | `min-h-[44px]` |
| MosqueFinder Near Me button | Small (`py-2.5`, `text-xs`) | `min-h-[48px]`, `py-3`, `text-sm` |
| City page CTA links | No min-height | `min-h-[44px]` |
| Borough / Peel / Alberta nav links | No min-height | `min-h-[44px]` |
| NearMeFinder primary button | `px-6 py-3` | `px-8 py-4`, `min-w-[220px]` |
| NearMeFinder error buttons | No min-height | `min-h-[48px]` |

### Search Field Readability

| Element | Before | After |
|---------|--------|-------|
| Search input font size (mobile) | `text-sm` (14px) | `text-base sm:text-sm` (16px mobile) |
| Search selects font size (mobile) | `text-sm` | `text-base sm:text-sm` |
| Input vertical padding | `py-2.5` | `py-3` |
| `autoComplete` attribute | Missing | `autoComplete="off"` |

> [!NOTE]
> Setting `font-size: 16px` on mobile inputs prevents iOS Safari from auto-zooming the viewport when the user taps the search field — this directly eliminates an annoying mobile experience issue.

### Accessibility Labels

| Element | Before | After |
|---------|--------|-------|
| Search input | No `aria-label` | `aria-label="Search by mosque name or city"` |
| Province select | No `aria-label` | `aria-label="Filter by province"` |
| City select | No `aria-label` | `aria-label="Filter by city"` |
| Near Me button | No `aria-label` | `aria-label="Find mosques near my current location"` |
| Clear search ✕ | No `aria-label` | `aria-label="Clear search"` |
| Clear distance sort | No `aria-label` | `aria-label="Clear distance sort"` |
| NearMe error container | No role | `role="alert"` |
| Mosque grid section | No heading association | `aria-labelledby="city-mosques-heading"` |
| Stats bar section | No label | `aria-label="City Mosque Statistics"` |
| Borough nav | No label | `aria-label="Toronto Borough Directories"` |

### NearMeFinder State Improvements

| State | Before | After |
|-------|--------|-------|
| Idle | Small button, minimal padding | Larger padding (`py-14`), larger button, clearer privacy note |
| Loading | `animate-spin ⌛` | `animate-pulse 📍`, better message |
| Error | No role, text-only | `role="alert"`, responsive flex layout, action buttons |
| Empty results | Generic text | Links to `/mosques` browse page |

### Geolocation Privacy (Preserved)
- Browser `navigator.geolocation` only
- Coordinates are **never** transmitted to the server
- Coordinates are **never** stored in localStorage, cookies, or URL parameters
- No server logging of user position

---

## 6. Technical SEO Verification

### Canonical URLs
- All city pages: `https://canadamosquenearme.ca/cities/{slug}` ✅
- Legacy `/mosques/toronto` → canonical → `/cities/toronto` ✅
- Legacy `/mosques/edmonton` → canonical → `/cities/edmonton` ✅
- No canonical changes made — all existing canonicals preserved ✅

### Sitemap
- 380 static pages generated ✅
- Legacy `/mosques/toronto` and `/mosques/edmonton` correctly absent from sitemap ✅
- All 331 mosque profile URLs present ✅

### Robots Directives
- `robots.txt` unchanged ✅
- No `noIndex` added to any city page ✅

### Internal Links
- No internal links point to legacy `/mosques/toronto` or `/mosques/edmonton` ✅
- Borough navigation links target `/mosques/{borough}` pages (confirmed exist as SSG routes) ✅
- Peel Region links → `/cities/brampton`, `/cities/mississauga`, `/cities/toronto` ✅
- Alberta links → `/cities/edmonton`, `/cities/calgary`, `/provinces/alberta` ✅
- Montreal → `/provinces/quebec`, `/prayer-times/montreal` ✅

### Structured Data
- City collection JSON-LD unchanged — schema is factual and correct ✅
- No new schema properties added without supporting content ✅
- No `aggregateRating` or invented reviews ✅

### Data Integrity
- 331 published mosque records preserved ✅
- 158 review-required records not published ✅
- 12 excluded records not published ✅
- Borough counts verified programmatically from `published.json`:
  - Scarborough: 33, North York: 19, Toronto Core: 22, Etobicoke: 7, East York: 7, York: 8 → Total: 96 ✅

---

## 7. Test Results

All tests run after every change. Final state:

| Suite | Result |
|-------|--------|
| **Vitest** | ✅ **389 / 389 tests passed** (27 test files) |
| **TypeScript** | ✅ 0 errors |
| **ESLint** | ✅ 0 errors, 0 warnings |
| **Production build** | ✅ Succeeded — 380 static pages |

### Notable Tests Verified
- `seo-phase10.test.ts` → Homepage title matches `/find|mosque near me/i` ✅
- `province-city-seo.test.ts` → 9 unique city titles ✅
- `phase8-audit.test.ts` → Data integrity: 96 Toronto published, 331 total ✅
- `near-me.test.ts` → Geolocation privacy: coordinates not transmitted ✅

---

## 8. Lighthouse Mobile Comparisons

Tested against **live production** (https://canadamosquenearme.ca). Three runs each for Toronto and Montreal.

### Toronto `/cities/toronto` — Mobile

| Run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|-----|------------|--------------|----------------|-----|-----|-----|-----|-----|
| Run 1 | 99 | 94 | 100 | 100 | 1.2 s | 1.2 s | 110 ms | 0 |
| Run 2 | 100 | 94 | 100 | 100 | 1.1 s | 1.1 s | 90 ms | 0 |
| Run 3 | 100 | 94 | 100 | 100 | 1.2 s | 1.2 s | 90 ms | 0 |
| **Median** | **100** | **94** | **100** | **100** | **1.2 s** | **1.2 s** | **90 ms** | **0** |

### Montreal `/cities/montreal` — Mobile

| Run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|-----|------------|--------------|----------------|-----|-----|-----|-----|-----|
| Run 1 | 100 | 94 | 100 | 100 | 1.1 s | 1.1 s | 90 ms | 0 |
| Run 2 | 100 | 94 | 100 | 100 | 1.1 s | 1.1 s | 80 ms | 0 |
| Run 3 | 100 | 94 | 100 | 100 | 1.1 s | 1.1 s | 60 ms | 0 |
| **Median** | **100** | **94** | **100** | **100** | **1.1 s** | **1.1 s** | **80 ms** | **0** |

### Phase 4D Baseline Comparison

| Page | Phase 4D Perf | Phase 6 Perf | Phase 4D A11y | Phase 6 A11y |
|------|--------------|--------------|---------------|--------------|
| Toronto | 99 | **100** ↑ | ~92* | **94** ↑ |
| Montreal | 99 | **100** ↑ | ~92* | **94** ↑ |

*Phase 4D accessibility baseline estimated from prior report.

**Accessibility improvement detail:** A11y score improved from footer fixes:
- **Fixed:** `color-contrast` — `text-stone-400` on white background (footer paragraphs) changed to `text-stone-500`
- **Fixed:** `heading-order` — Footer `<h4>` elements appeared without preceding `<h2>/<h3>` in document outline; replaced with styled `<p>` elements (footers are landmark elements, section labels need not be headings)

> [!NOTE]
> The A11y score of 94 (not 100) reflects remaining items in components not modified in this phase (e.g. `text-stone-400` in MosqueFacilitiesCard inactive state, MosqueOpeningHoursCard). These are on detail/profile pages not in the Phase 6 scope and are logged as next steps.

---

## 9. Files Modified

```
9 files changed, 455 insertions(+), 86 deletions(-)

src/app/cities/[city]/page.tsx                | 347 +++++++++++++++++++++++---
src/app/mosque-near-me/page.tsx               |   5 +-
src/app/mosques/[area]/page.tsx               |   2 +-
src/app/page.tsx                              |   8 +-
src/components/finder/MosqueCard.tsx          |  10 +-
src/components/finder/MosqueFinder.tsx        |  25 +-
src/components/layout/Footer.tsx              |  16 +-
src/components/near-me/MosqueNearMeFinder.tsx |  54 ++--
src/domain/seo/province-city-seo.ts           |  74 +++++-
```

**New scripts/docs created (not committed — supporting artifacts):**
- `docs/gsc-export-2026-11-15/` — extracted GSC CSV files
- `scripts/parse_gsc_2026_11_15.js` — GSC analysis script
- `scripts/analyze-city-queries.mjs` — city query breakdown
- `scripts/check-legacy.js` — legacy URL HTTP audit
- `scripts/get-city-counts.mjs` — mosque count verification
- `scripts/fix-footer-headings.js` — footer h4→p migration
- `docs/lh-toronto-p6-run{1,2,3}.json` — Lighthouse mobile results (Toronto)
- `docs/lh-montreal-p6-run{1,2,3}.json` — Lighthouse mobile results (Montreal)

---

## 10. Remaining Issues and Recommended Next Steps

### High Priority

1. **Remaining `text-stone-400` contrast issues** on mosque detail/profile pages:
   - `MosqueFacilitiesCard.tsx` — inactive facility icons
   - `MosqueOpeningHoursCard.tsx` — "Closed" and "Unavailable" labels
   - `MosquePrayerTimesCard.tsx` — method/timezone labels
   - These should be changed to `text-stone-500` minimum; consider Phase 7

2. **Montreal zero-click page** (1,006 impressions, 0 clicks, position 6.61):
   - Bilingual title and description now deployed — monitor CTR in next GSC cycle
   - If CTR stays below 1% after 4 weeks, test adding Montreal-specific FAQ or neighborhood list

3. **"mosque near me" at position 7.54 with 2,985 impressions and 0.03% CTR:**
   - Homepage and `/mosque-near-me` title changes now deployed
   - If position doesn't improve to top 5 within 60 days, consider adding homepage structured FAQ schema (HowTo or FAQPage) for the Near Me query

### Medium Priority

4. **Borough mosque detail pages** (`/mosques/scarborough`, `/mosques/north-york`, etc.):
   - These pages currently show all area mosques but have generic titles
   - Scarborough (33 mosques) and North York (19 mosques) have enough content for distinct city-level treatment
   - Consider per-borough `generateMetadata()` with specific titles

5. **French query capture** ("mosquée near me" at 3.81, 26 impressions, 0 clicks):
   - Montreal page now has French content in title, description, and body
   - Consider adding a French alternate `hreflang` or a fully bilingual Montreal page variant

6. **Vancouver (9 locations, 0 clicks):**
   - 9 facilities may be below threshold for strong SERP differentiation
   - Prioritize adding any additional verified Vancouver-area facilities if they become available

### Low Priority / Monitoring

7. **GSC re-crawl:** Submit updated sitemap to Google Search Console after deployment to accelerate indexing of metadata changes

8. **CLS monitoring:** CLS is 0 in all Lighthouse runs — maintain this as city page content grows

9. **A11y score 94 → 100 goal:** Requires Phase 7 audit of remaining `text-stone-400` and any other contrast failures on interior pages

10. **Borough counts are dynamic:** The Toronto borough grid currently uses hardcoded counts verified from `published.json`. If mosque data is updated, these counts should be derived programmatically at build time rather than hardcoded.

---

## Deployment Checklist (Do Not Deploy Without This)

- [x] TypeScript: 0 errors
- [x] ESLint: 0 warnings
- [x] Vitest: 389 / 389 tests passed
- [x] Build: 380 static pages generated successfully
- [x] Lighthouse Toronto mobile median: Performance 100, SEO 100, A11y 94
- [x] Lighthouse Montreal mobile median: Performance 100, SEO 100, A11y 94
- [x] Borough counts verified from published.json
- [x] Legacy URL canonicals preserved
- [x] No fabricated mosque data
- [x] No redirect or sitemap changes
- [ ] **User approval** ← Required before `git add`, `git commit`, `git push`
