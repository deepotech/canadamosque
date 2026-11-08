# Canada Mosque Near Me — SEO Implementation & Parity Report

**Target Domain:** `https://canadamosquenearme.ca`  
**Reference Benchmark:** `https://usmosques.com` (`C:\Users\HP\Desktop\US MOSQUE FINDER`)  
**Implementation Date:** November 8, 2026  
**Auditor & Implementation Agent:** Antigravity AI Assistant  
**GSC Performance Baseline:** November 8, 2026 Export (`docs/gsc-export-2026-11-08/`)  

---

## 1. Executive Summary

Following a deep technical audit of the US Mosque Finder project (`C:\Users\HP\Desktop\US MOSQUE FINDER`) and the November 8, 2026 Google Search Console (GSC) performance export for `https://canadamosquenearme.ca`, we have engineered and deployed full SEO architectural parity to the Canadian project.

### Key Outcomes
1. **Established Full Canadian Geographic Hierarchy:**
   - Implemented dedicated National Province Directory (`/provinces`).
   - Implemented 5 individual Province Landing Pages (`/provinces/ontario`, `/provinces/quebec`, `/provinces/alberta`, `/provinces/british-columbia`, `/provinces/manitoba`).
   - Implemented 9 clean City Landing Pages (`/cities/toronto`, `/cities/montreal`, `/cities/calgary`, `/cities/edmonton`, `/cities/ottawa`, `/cities/mississauga`, `/cities/brampton`, `/cities/winnipeg`, `/cities/vancouver`).
   - Preserved 100% backward compatibility for all existing working routes (`/mosques/[area]`, `/mosque/[slug]`, `/prayer-times/[city]`, `/jummah/toronto`).
2. **Fixed Metadata & Title Double-Branding Vulnerability:**
   - Updated `constructMetadata()` to strip trailing brand suffixes (`| Canada Mosque Near Me`) if already present, preventing title tag truncation in SERP snippets.
   - Updated robots meta configuration to provide `max-image-preview: large` on all indexable pages, and to preserve `follow: true` on non-indexed utility pages for optimal link equity discovery.
3. **Structured Data Modernization (Schema.org):**
   - Added `CollectionPage` with `ItemList` schema for all province and city directories, listing canonical child entities and names.
   - Standardized 4-level BreadcrumbList schema (`Home -> Provinces -> Province -> City -> Mosque`).
4. **Deterministic XML Sitemap Upgrade:**
   - Replaced dynamic `new Date().toISOString()` with a deterministic release date (`BUILD_DATE = new Date('2026-11-08')`).
   - Sitemaps now publish exactly **374 valid canonical URLs** (all HTTPS, deduplicated, excluding unverified records and utility pages).
5. **Zero Data Modification / Strict Validation Invariant:**
   - All 331 verified published mosques remain intact with preserved provenance.
   - Zero `review-required` (158 records) or `excluded` (12 records) records leak into sitemaps or public indexes.
6. **100% Test & Production Build Verification:**
   - Vitest: **26 test files passed, 379/379 tests passed**.
   - TypeScript (`tsc --noEmit`): **0 errors**.
   - ESLint (`next lint`): **0 warnings, 0 errors**.
   - Production Build (`next build`): **380 static pages compiled successfully**.

---

## 2. What Was Discovered in the US Project

Through inspection of the US source tree, configuration, tests, and documentation (`SEO_OPPORTUNITY_AUDIT_2026-10-21.md`, `PHASE2_CITY_SEO_REVIEW.md`, `PHASE4C_SEO_ELIGIBILITY.md`):

1. **State and City Dynamic Hierarchies:**
   - US Mosque Finder used explicit two-tier routing: `/mosques/[state]` (e.g. `/mosques/california`) and `/mosques/[state]/[city]` (e.g. `/mosques/california/sacramento`).
   - City and state directory pages served as powerful organic landing hubs capturing high-volume queries with 0% bounce rate doorway avoidance.
2. **Strict Tier-Based SEO Eligibility Policy:**
   - Tier A (>= 5 mosques): eligible for standalone indexable city directory.
   - Tier B (2–4 mosques) and Tier C (1 mosque): prevented from generating thin indexable landing pages to guard against Google's Helpful Content / doorway page penalties.
3. **Title Tag Double-Branding Flaw:**
   - US post-launch audit discovered that `constructMetadata` appended `| US Mosque Finder` while root templates also appended it, causing `... | US Mosque Finder | US Mosque Finder`. De-duplicating this suffix was a critical win in the US remediation.
4. **Robots Follow vs. Noindex Distinction:**
   - The US project explicitly ensured that utility pages (such as `/mosque-near-me`) carried `noindex, follow` rather than `noindex, nofollow`, allowing Googlebot to discover linked canonical detail pages.
5. **Deterministic Sitemap Timestamps:**
   - The US project avoided `new Date()` at build time, using a deterministic `BUILD_DATE` constant so crawlers would not misinterpret unmodified pages as newly modified on each build.
6. **Structured Data Integrity:**
   - Rich `CollectionPage` (`ItemList`) schema on state and city hubs.
   - Strict refusal to fabricate ratings, reviews, or prayer times in `PlaceOfWorship` schema.
7. **Cross-City Internal Linking:**
   - City pages featured contextual internal links to parent states, sibling cities within the same state, and canonical entity detail pages.

---

## 3. What Was Missing in Canada

Prior to this implementation, the Canadian project had significant architectural gaps:

1. **Missing Provincial Directory Hierarchy:**
   - There were no province landing pages (`/provinces/ontario`, `/provinces/quebec`, etc.).
   - GSC recorded queries like `"how many mosques in ontario"` (avg position 80.5) that had no relevant landing page to rank for.
2. **Ambiguous Area Routing:**
   - City pages were mounted under `/mosques/[area]`, where `[area]` mixed entire metropolitan regions (e.g. `toronto`, `montreal`) with Toronto sub-boroughs (e.g. `scarborough`, `north-york`), lacking clean semantic separation.
3. **Dynamic Timestamp Invalidation in Sitemap:**
   - `sitemap.ts` generated `new Date().toISOString()` for every URL on every build, preventing search engines from using `lastModified` to prioritize recrawling.
4. **Sitemap Contamination with Utility Route:**
   - `/mosque-near-me` was included in the sitemap despite being an interactive, client-side utility tool.
5. **Robots Tag Link Equity Leak:**
   - `metadata.ts` applied `follow: !noIndex`. Setting `noIndex: true` simultaneously set `follow: false`, blocking crawlers from following internal links on utility pages.
6. **Missing CollectionPage Schema:**
   - City and area pages rendered without `CollectionPage` / `ItemList` structured data, missing Google rich result recognition.
7. **Flat Breadcrumb Structure:**
   - Mosque profiles lacked a complete 4-tier breadcrumb (`Home -> Provinces -> Province -> City -> Mosque`), impeding navigational crawl depth.
8. **Weak Homepage Internal Link Density:**
   - The homepage did not feature direct crawlable HTML links to Canadian provinces or clean city directories.

---

## 4. What Was Implemented

### A. New Geographic Architecture & URL Routes
- **Provinces Hub:** `src/app/provinces/page.tsx`
  - National directory displaying all 5 Canadian provinces (Ontario, Quebec, Alberta, British Columbia, Manitoba) with verified mosque counts, key metropolises, and descriptions.
- **Province Landing Pages:** `src/app/provinces/[province]/page.tsx`
  - Dynamic SSG landing pages for each province (`/provinces/ontario`, `/provinces/quebec`, `/provinces/alberta`, `/provinces/british-columbia`, `/provinces/manitoba`).
  - Factual statistics: verified facilities, wheelchair accessible, women's sections, direct phone contacts.
  - Links to all cities in the province and cards for verified mosques.
- **Clean City Landing Pages:** `src/app/cities/[city]/page.tsx`
  - Dynamic SSG landing pages for all 9 Canadian metropolises (`/cities/toronto`, `/cities/montreal`, `/cities/calgary`, `/cities/edmonton`, `/cities/ottawa`, `/cities/mississauga`, `/cities/brampton`, `/cities/winnipeg`, `/cities/vancouver`).
  - Factual statistics bar matching actual verified dataset counts.
  - Contextual CTAs to daily prayer times (`/prayer-times/[city]`) and GPS proximity finder (`/mosque-near-me`).
  - Contextual links to sibling cities in the same province.
- **Preserved Existing Routes (100% Backward Compatibility):**
  - `/mosques` (Interactive national finder).
  - `/mosques/[area]` (Preserved all 14 area routes for Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, Vancouver, Scarborough, North York, Etobicoke, East York, York).
  - `/mosque/[slug]` (Preserved all 331 canonical detail pages).
  - `/prayer-times` and `/prayer-times/[city]`.
  - `/jummah` and `/jummah/toronto`.

### B. Core SEO Policy & Utilities
- **`src/domain/seo/province-city-seo.ts`**:
  - Centralized Canadian province configurations, capitals, and descriptions.
  - Canadian city SEO policy (`minMosqueCount: 5`, Tier A enforcement).
  - Province & city metadata generators incorporating verified counts and Canadian geo-modifiers.
  - Related city resolver prioritizing sibling cities in the same province.
- **`src/domain/seo/metadata.ts`**:
  - Title de-duplication: strips trailing ` | ${siteConfig.name}` to eliminate double-branding.
  - Indexability rules: `robots: { index: !noIndex, follow: !noFollow }` ensuring `follow: true` even when `noIndex: true`.
  - Added `'max-image-preview': 'large'` for all indexable pages.
- **`src/domain/seo/schema.ts`**:
  - Added `generateProvinceCollectionJsonLd()` and `generateCityCollectionJsonLd()`.
- **`src/domain/mosque/canonical-repository.ts`**:
  - Added `getMosquesByProvince(provinceCode)` and `getMosquesByCity(citySlugOrName)`.

### C. XML Sitemap Modernization
- **`src/app/sitemap.ts`**:
  - Replaced dynamic dates with deterministic `BUILD_DATE = new Date('2026-11-08')`.
  - Excluded interactive utility `/mosque-near-me`.
  - Added all 5 province routes (`/provinces/*`) and 9 city routes (`/cities/*`).
  - Verified inclusion of all 331 published mosques with zero unverified records.
  - Guaranteed 100% HTTPS URLs with canonical domain deduplication.

### D. Internal Linking & Navigation Mesh
- **Header (`src/components/layout/Header.tsx`)**:
  - Added prominent "Provinces" navigation link in main menu.
- **Footer (`src/components/layout/Footer.tsx`)**:
  - Added "Provinces & Cities" directory column linking to `/provinces` and top Canadian cities (Toronto, Montreal, Calgary, Edmonton, Vancouver).
  - Added direct link to `/mosque-near-me`.
- **Homepage (`src/app/page.tsx`)**:
  - Added "Explore Mosques by Province" section with responsive province cards.
  - Updated city discovery cards to link directly to canonical `/cities/[city]` landing pages.
- **Mosque Profile Page (`src/app/mosque/[slug]/page.tsx`)**:
  - Integrated 4-tier breadcrumbs: `Home -> Provinces -> {Province} -> {City} -> {Mosque Name}`.
  - Updated profile header location badges with clickable links to city and province hubs.

---

## 5. Before / After SEO Capability Matrix

| SEO Dimension | Baseline (Before) | Implementation (After) | Status |
|---|---|---|---|
| **Provincial Landing Pages** | None | 5 dedicated province landing pages (`/provinces/[province]`) | **Implemented** |
| **National Province Hub** | None | `/provinces` directory hub | **Implemented** |
| **City Landing Pages** | Only `/mosques/[area]` (mixed with boroughs) | Dedicated `/cities/[city]` landing pages for all 9 metropolises | **Implemented** |
| **Existing Route Preservation** | N/A | 100% preserved (all 14 `/mosques/[area]` routes fully functional) | **Verified** |
| **Title Double-Branding Protection** | Risk of `Title \| Brand \| Brand` | Clean brand-suffix stripping in `constructMetadata()` | **Implemented** |
| **Robots Directives** | `follow: false` when `noIndex: true` | `follow: true` on `noIndex` (allows crawler discovery); `max-image-preview: large` | **Implemented** |
| **Sitemap Timestamp** | Dynamic `new Date().toISOString()` on every build | Deterministic `BUILD_DATE = new Date('2026-11-08')` | **Implemented** |
| **Sitemap URL Count** | 360 URLs (included `/mosque-near-me`, lacked provinces & cities) | **374 URLs** (provinces + cities + areas + mosques, utility excluded) | **Implemented** |
| **Sitemap Protocol Integrity** | 100% HTTPS | 100% HTTPS | **Maintained** |
| **Unverified / Review Records in Sitemap** | 0 | 0 (all 158 review-required & 12 excluded strictly barred) | **Maintained** |
| **Structured Data Types** | `WebSite`, `Organization`, `Mosque`, `BreadcrumbList` | Added `CollectionPage` + `ItemList` on province and city directories | **Implemented** |
| **Breadcrumb Depth on Detail Pages** | 3-level (`Home -> Mosques -> City -> Mosque`) | 4-level (`Home -> Provinces -> Province -> City -> Mosque`) | **Implemented** |
| **Internal Linking Density** | Homepage lacked province links; profile lacked province breadcrumbs | Homepage provinces grid; footer city links; header provinces link; profile province links | **Implemented** |
| **Automated SEO Test Suite** | 25 test files / 358 tests | **26 test files / 379 tests** (added 21 dedicated SEO parity tests) | **Expanded** |

---

## 6. List of Changed & Created Files

### Created Files
1. `docs/US_TO_CANADA_SEO_PARITY_AUDIT.md` — Deep comparative audit between US and Canada projects.
2. `docs/CANADA_SEO_IMPLEMENTATION_REPORT.md` — This comprehensive implementation and verification report.
3. `src/domain/seo/province-city-seo.ts` — Canadian geographic SEO configuration, metadata generators, and eligibility policies.
4. `src/domain/seo/province-city-seo.test.ts` — Vitest test suite covering province/city SEO, sitemap integrity, and schema.
5. `src/app/provinces/page.tsx` — National Canadian Provinces Directory Hub.
6. `src/app/provinces/[province]/page.tsx` — Dynamic Province Landing Pages (`generateStaticParams`).
7. `src/app/cities/[city]/page.tsx` — Dynamic Clean City Landing Pages (`generateStaticParams`).

### Modified Files
1. `src/domain/seo/metadata.ts` — Brand suffix de-duplication, robots `'max-image-preview': 'large'`, independent `follow` on `noIndex`.
2. `src/domain/seo/schema.ts` — Added `generateProvinceCollectionJsonLd` and `generateCityCollectionJsonLd`.
3. `src/domain/mosque/canonical-repository.ts` — Added `getMosquesByProvince()` and `getMosquesByCity()` helper methods.
4. `src/app/sitemap.ts` — Switched to deterministic `BUILD_DATE`, added provinces & cities, excluded `/mosque-near-me`, deduplicated URLs.
5. `src/app/mosque/[slug]/page.tsx` — 4-tier breadcrumb navigation (`Home -> Provinces -> Province -> City -> Mosque`), clickable city/province badges.
6. `src/app/mosques/[area]/page.tsx` — Added clickable province badge cross-linking to `/provinces/[province]`.
7. `src/app/page.tsx` — Added "Explore Mosques by Province" section, updated city cards to link to `/cities/[city]`.
8. `src/components/layout/Header.tsx` — Added "Provinces" link to primary desktop navigation.
9. `src/components/layout/Footer.tsx` — Added "Provinces & Cities" directory column and direct `/mosque-near-me` link.
10. `src/domain/seo/seo-phase10.test.ts` — Updated canonical sitemap count assertion from 360 to 374.

---

## 7. Test, Lint, and Production Build Results

### A. Vitest Test Suite (`npm test`)
```
 RUN  v3.2.7 C:/Users/HP/Desktop/Canada Mosque Near Me

 ✓ src/domain/opening-hours/types.test.ts (1 test)
 ✓ src/pipeline/__tests__/normalizer.test.ts (15 tests)
 ✓ src/pipeline/__tests__/phase8-audit.test.ts (7 tests)
 ✓ src/pipeline/__tests__/raw-validator.test.ts (5 tests)
 ✓ src/domain/mosque/types.test.ts (4 tests)
 ✓ src/domain/geo/area-slugs.test.ts (4 tests)
 ✓ src/components/near-me/__tests__/near-me.test.ts (6 tests)
 ✓ src/pipeline/__tests__/duplicate-analyzer.test.ts (3 tests)
 ✓ src/domain/seo/schema.test.ts (6 tests)
 ✓ src/domain/opening-hours/status.test.ts (7 tests)
 ✓ src/pipeline/__tests__/raw-dataset-validator.test.ts (11 tests)
 ✓ src/pipeline/__tests__/phase8-1-verification.test.ts (10 tests)
 ✓ src/domain/geo/distance.test.ts (5 tests)
 ✓ src/pipeline/__tests__/classifier.test.ts (9 tests)
 ✓ src/domain/estimated-iqamah/estimated-iqamah.test.ts (32 tests)
 ✓ src/domain/prayer/engine.test.ts (81 tests)
 ✓ src/pipeline/__tests__/pipeline.test.ts (3 tests)
 ✓ src/domain/schedule/schedule.test.ts (24 tests)
 ✓ src/domain/seo/province-city-seo.test.ts (21 tests)
 ✓ src/domain/mosque/canonical-repository.test.ts (4 tests)
 ✓ src/domain/mosque/phase3-profile.test.ts (9 tests)
 ✓ src/pipeline/__tests__/phase9-multi-city.test.ts (28 tests)
 ✓ src/domain/mosque/nearby.test.ts (10 tests)
 ✓ src/domain/seo/seo-quality.test.ts (2 tests)
 ✓ src/domain/seo/seo-phase10.test.ts (60 tests)
 ✓ src/pipeline/__tests__/multi-city-ingestion.test.ts (12 tests)

 Test Files  26 passed (26)
      Tests  379 passed (379)
   Duration  3.26s
```

### B. TypeScript Check (`npm run typecheck`)
```
> canada-mosque-near-me@0.1.0 typecheck
> tsc --noEmit
(Clean exit with code 0)
```

### C. ESLint (`npm run lint`)
```
> canada-mosque-near-me@0.1.0 lint
> next lint
✔ No ESLint warnings or errors
(Clean exit with code 0)
```

### D. Production Build (`npm run build`)
```
> canada-mosque-near-me@0.1.0 build
> next build

   ▲ Next.js 15.5.27
   Creating an optimized production build ...
 ✓ Compiled successfully in 5.1s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (380/380)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                               Size     First Load JS
┌ ○ /                                    171 B            106 kB
├ ○ /_not-found                          996 B            104 kB
├ ● /cities/[city] (9 paths)             167 B            106 kB
├ ○ /jummah                              171 B            106 kB
├ ○ /jummah/toronto                      171 B            106 kB
├ ○ /mosque-near-me                    1.61 kB            111 kB
├ ● /mosque/[slug] (331 paths)          3.47 kB            110 kB
├ ○ /mosques                            3.12 kB            112 kB
├ ● /mosques/[area] (14 paths)           167 B            106 kB
├ ○ /prayer-times                        171 B            106 kB
├ ● /prayer-times/[city] (9 paths)       177 B            114 kB
├ ○ /prayer-times/toronto                377 B            115 kB
├ ○ /provinces                           171 B            106 kB
├ ● /provinces/[province] (5 paths)      167 B            106 kB
├ ○ /robots.txt                          127 B            103 kB
└ ○ /sitemap.xml                         127 B            103 kB
(Clean exit with code 0)
```

---

## 8. Remaining SEO Problems & Recommended Next Steps

While full technical codebase parity has been implemented, tested, and pre-rendered into production HTML artifacts, the following items require operational attention and Google Search Console monitoring:

### 1. Google Search Console URL Inspection of New Routes
- **Action:** Once deployed to production, submit the new `/provinces` hub and representative province/city pages (`/provinces/ontario`, `/cities/toronto`, `/cities/montreal`) in the GSC URL Inspection tool and request indexing.
- **Monitoring:** Track whether impressions transition from the homepage to relevant city and province landing pages over the next 14–28 days.

### 2. HTTP to HTTPS Canonical Consolidation
- **Observation:** The November 8, 2026 export recorded 50 impressions for `http://canadamosquenearme.ca/`.
- **Recommendation:** Verify at the edge hosting / CDN layer (e.g., Cloudflare, Vercel, or Nginx) that an HTTP 301 permanent redirect is enforced for all inbound HTTP requests to `https://canadamosquenearme.ca`.

### 3. French / Bilingual Search Optimization in Quebec
- **Observation:** Queries in French (`"mosquée le plus proche"`, `"mosquée la plus proche"`) were recorded in GSC.
- **Next Step:** Expand bilingual French meta descriptions and FAQ structured data on `/provinces/quebec` and `/cities/montreal` to capture Montreal's Francophone Muslim community searches.

### 4. Review Queue Verification Pipeline (Phase 8/9 Continued)
- **Status:** 158 records remain in `review-required.json` and 12 in `excluded.json`.
- **Constraint:** These must remain unindexed until manual or verified evidence is documented. As records are verified in the review ledger, move them to `published.json` to automatically expand city directory counts.
