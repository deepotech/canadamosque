# US to Canada SEO Parity Audit

**Target Production Domain:** `https://canadamosquenearme.ca`  
**Reference Benchmark Domain:** `https://usmosques.com` (`C:\Users\HP\Desktop\US MOSQUE FINDER`)  
**Audit Date:** November 8, 2026  
**Auditor:** Antigravity AI Coding Assistant  
**GSC Baseline Export:** November 8, 2026 (`docs/gsc-export-2026-11-08/`)  

---

## 1. Executive Summary & Context

This audit evaluates the search engine optimization (SEO) architecture of **Canada Mosque Near Me** in direct comparison with **US Mosque Finder**. The goal is to identify proven technical decisions, data structures, and SEO implementation patterns from the US project and apply them to the Canadian project, adapted specifically to Canadian geography (10 provinces, 3 territories), official bilingualism (English & French), and observed Canadian search intent.

### Baseline Search Footprint Comparison

| Dimension | US Mosque Finder (Post-Launch Audit) | Canada Mosque Near Me (Nov 8, 2026 GSC Export) | Parity Evaluation |
|---|---|---|---|
| **Active Indexing Days** | 16 days (Oct 3–18, 2026) | 30 days (Oct 9 – Nov 6, 2026) | Canada in early indexing lifecycle |
| **Total Impressions** | 18,305 | 412 (362 HTTPS, 50 HTTP) | Canada impressions concentrated on Homepage |
| **Total Clicks** | 62 | 3 (CTR: 0.73%) | Page 2+ ranking threshold |
| **Top Query** | `"mosque near me"` (1,648 imp, pos 9.43) | `"mosque near me"` (108 imp, pos 9.72) | Identical primary search intent pattern |
| **Second Top Query** | `"masjid near me"` (1,000 imp, pos 9.41) | `"masjid near me"` (42 imp, pos 8.52) | Both projects on Page 1 threshold for "masjid near me" |
| **Mobile Share** | 53.9% impressions, 72.6% clicks | 68.7% impressions (283/412), pos 6.96 | Mobile dominance even higher in Canada |
| **Indexed Pages in GSC Export** | 693 URLs across 13 states | 2 URLs (HTTPS homepage & HTTP discovery) | Deep city/province architecture missing in Canada |
| **Published Directory Entities** | 1,486 verified US mosques | 331 verified Canadian mosques | 100% verified Canadian entities across 9 metropolises |

---

## 2. In-Depth Google Search Console Baseline Analysis (Canada: Nov 8, 2026)

The November 8, 2026 GSC export provides the definitive factual baseline for the Canadian property:

### A. Performance Timeline (`Graphique.csv`)
* **Tracking Window:** October 8, 2026 – November 6, 2026 (30 active days).
* **Early Exploration (Oct 9–15):** 3 to 10 impressions/day, average positions fluctuating between 7.8 and 31.0.
* **First Growth Surge (Oct 16–25):** Daily impressions rose to 27/day; first click occurred on Oct 20 (position 23.2).
* **Late October Acceleration (Oct 28 – Nov 6):** Peak daily impressions reached 42/day on Nov 6. Clicks occurred on Oct 30 (38 imp, pos 8.0) and Nov 4 (10 imp, pos 10.3).
* **Trend:** Consistent upward trajectory in Google's indexing crawl, but impressions remain throttled because only the homepage is actively serving queries.

### B. Device Distribution (`Appareils.csv`)
* **Mobile:** 283 impressions (68.7%), 0 clicks, **average position 6.96**.
* **Desktop (Ordinateur):** 126 impressions (30.6%), 3 clicks (CTR 2.38%), **average position 33.28**.
* **Tablet:** 3 impressions (0.7%), 0 clicks, average position 4.67.
* **Strategic Takeaway:** On mobile devices, Canadian users rank Canada Mosque Near Me at **position 6.96 (Page 1)** for proximity queries. The 0% mobile CTR is a symptom of SERP snippet design: Google serves the root homepage without rich snippet metadata or city-specific intent signals. Optimizing mobile rendering, title clarity, and local relevance is critical.

### C. Geographic Distribution (`Pays.csv`)
* **Canada:** 265 impressions, 3 clicks (CTR 1.13%), avg position 18.3 (64.3% of total impressions; 100% of clicks).
* **United States:** 64 impressions, 0 clicks, avg position 5.86.
* **International (India, Saudi Arabia, Pakistan, UK, UAE, etc.):** 83 impressions, reflecting travelers, diaspora searches, or global crawling.
* **Strategic Takeaway:** Target audience is tightly concentrated in Canada. Geographic optimization must focus on Canadian provinces, metropolises, and postal districts.

### D. Query Intent Breakdown (`Requêtes.csv`)
1. **High-Volume Proximity Intent:**
   - `"mosque near me"`: 108 impressions, position 9.72 (Page 1)
   - `"masjid near me"`: 42 impressions, position 8.52 (Page 1)
   - `"mosques near me"`: 12 impressions, position 11.08 (Page 2 threshold)
   - `"open mosque near me"`: 4 impressions, position 5.25
   - `"nearest mosque near me"`: 4 impressions, position 7.75
   - `"closest mosque near me"`: 3 impressions, position 5.67
   - Combined proximity searches account for **over 62% of all query impressions**.
2. **National Intent:**
   - `"canada mosque"`: 12 impressions, position 8.58 (Page 1)
   - `"mosque in canada"`: 5 impressions, position 33.0
   - `"mosque canada"`: 3 impressions, position 7.0
   - `"masjid in canada"`: 2 impressions, position 6.5
3. **Bilingual Canadian Search Intent:**
   - `"mosquée le plus proche"`: 3 impressions, position 62.67
   - `"mosquée la plus proche"`: 2 impressions, position 81.0
   - `"mosquée plus proche"`: 1 impression, position 53.0
   - Significant search intent in French-speaking communities (Quebec / Montreal), representing an untapped Canadian organic opportunity.
4. **Specific Entity & Informational Queries:**
   - `"canadian islamic centre al jamieh"`: 1 impression, position 70.0 (real mosque entity in dataset).
   - `"how many mosques in ontario"`: 2 impressions, position 80.5 (provincial directory opportunity).
   - `"how many mosque in canada"`: 2 impressions, position 77.5.
   - `"jummah prayer times near me"`: 1 impression, position 3.0.

### E. Investigation: Why Are Inner Pages Missing from `Pages.csv`?
In Google Search Console, `Pages.csv` only includes URLs that have recorded at least 1 impression during the filtered period.
The root causes for inner pages not appearing in `Pages.csv`:
1. **Absence of Clear Province Hierarchy:** The site currently had no dedicated province directory pages (`/provinces/ontario`, `/provinces/quebec`, etc.). Queries like `"how many mosques in ontario"` had no landing page to match.
2. **Ambiguous Route Naming:** Existing city routes were mounted under `/mosques/[area]`, where `[area]` mixed whole metropolises (`toronto`, `montreal`) with Toronto sub-boroughs (`scarborough`, `north-york`), lacking clear semantic distinction between provinces, cities, and neighborhoods.
3. **Weak Crawl Depth from Homepage:** The homepage provided direct links to an interactive client finder, but lacked crawlable HTML link lists to all provinces and cities with contextual anchor text.
4. **Sitemap Dynamic Timestamp Pitfall:** `sitemap.ts` generated `new Date().toISOString()` for every URL on every request/build, destroying the search engine's ability to prioritize newly updated content through `lastModified`.
5. **HTTP vs. HTTPS Canonicalization Lag:** Google discovered the site through both `http://` and `https://`. While canonical tags are set to HTTPS, the search index took time consolidating signals.

---

## 3. Comprehensive US-to-Canada SEO Parity Matrix

The following matrix systematically evaluates all 15 core architectural areas, contrasting the US reference implementation with the Canadian target state.

| # | SEO Capability | US Implementation (`US MOSQUE FINDER`) | Canadian Current State | Difference & Gap | Reuse Decision | Canadian Adaptation Required | Priority | Test Coverage Needed |
|---|---|---|---|---|---|---|---|---|
| **1** | **Geographic Architecture & URL Structure** | State directories: `/mosques/[state]`<br>City directories: `/mosques/[state]/[city]`<br>Mosque detail: `/mosque/[slug]` | `/mosques` (finder)<br>`/mosques/[area]` (mixed cities & boroughs)<br>`/mosque/[slug]` (profiles) | Missing province hierarchy (`/provinces/[province]`); missing dedicated `/cities/[city]` landing pages. | **Reuse & Adapt** | Create `/provinces` hub and `/provinces/[province]` pages. Create `/cities/[city]` landing pages. Preserve all `/mosques/[area]` and `/mosque/[slug]` routes for 100% backward compatibility. | **P0** | Route existence, slug mapping, backward compatibility tests. |
| **2** | **Metadata Generation & Uniqueness** | `generateStateMetadata()`, `generateStateCityMetadata()`. Fact-based titles: `Mosques in {City}, {State} ({Count} Locations) \| {Brand}`. | Generic metadata in `AreaMosquesPage`. No province metadata. Title lacks counts and verified stats. | Missing dynamic metadata for provinces and clean cities. | **Reuse & Adapt** | Implement `generateProvinceMetadata()` and `generateCityMetadata()`. Use exact verified mosque counts, facilities counts, and Canadian geo-modifiers. | **P0** | Unit test verifying unique titles and descriptions for every province and city. |
| **3** | **Brand Suffix Normalization** | Strips duplicate brand suffix in `constructMetadata()` to avoid `Title \| Brand \| Brand`. | Suffix appended in `constructMetadata()`. Risk of double branding if title already contains brand name. | US pattern prevents truncation in SERPs. | **Reuse** | Add clean title check in `constructMetadata()`: strip trailing ` \| Canada Mosque Near Me` if already present. | **P0** | Unit test with raw title and title with existing brand suffix. |
| **4** | **Canonical URLs** | Deterministic canonical URL matching `process.env.NEXT_PUBLIC_SITE_URL \|\| 'https://usmosques.com'`. | Set to `https://canadamosquenearme.ca`. | Mostly compliant, but new province and city pages need canonical paths. | **Reuse** | Enforce absolute canonical HTTPS URLs on all new `/provinces/*` and `/cities/*` routes. | **P0** | Canonical tag assertion across all route types. |
| **5** | **Robots Directives & Indexability Rules** | `robots: noIndex ? { index: false, follow: !noFollow } : { index: true, follow: true, 'max-image-preview': 'large' }`. Utility pages use `noindex, follow`. | `robots: { index: !noIndex, follow: !noIndex }`. When `noIndex = true`, `follow` was set to `false`. | Canada blocked link equity from passing through utility pages. Lacked `'max-image-preview': 'large'`. | **Reuse** | Update `constructMetadata`: when `noIndex = true`, default `follow: true`. Include `'max-image-preview': 'large'` on all indexable pages. | **P0** | Robots directive unit test for indexable vs utility pages. |
| **6** | **Sitemap Eligibility & Deterministic Timestamps** | Evaluates state and city eligibility (min 5 mosques). Verified mosques only. Uses stable `BUILD_DATE` constant. Excludes utility pages. | Uses `new Date().toISOString()` dynamically on every build. Includes `/mosque-near-me` utility. Missing province/city routes. | Falsified crawl freshness; missing geographic routes; included utility page. | **Reuse & Adapt** | Use deterministic `BUILD_DATE` constant. Add all 5 eligible provinces and 9 eligible cities. Exclude review-required/excluded records. Deduplicate URLs. | **P0** | Sitemap test: verify HTTPS, URL count, absence of duplicates and unverified records. |
| **7** | **Structured Data (Schema.org JSON-LD)** | `WebSite`, `Organization`, `CollectionPage` (`ItemList`), `BreadcrumbList`, `Mosque` / `PlaceOfWorship` with real attributes only. | `WebSite`, `Organization`, `Mosque` (or `PlaceOfWorship`), `BreadcrumbList`. Missing `CollectionPage` for directories. | Province and city directories lack `CollectionPage` with `ItemList` schema. | **Reuse & Adapt** | Implement `generateProvinceCollectionJsonLd` and `generateCityCollectionJsonLd`. Validate schema syntax without fabricating data. | **P0** | Vitest tests for JSON-LD structure, type validity, item counts. |
| **8** | **Breadcrumbs Implementation** | 3-level breadcrumbs: Home -> State -> City -> Detail with matching Schema.org JSON-LD. | Basic breadcrumb on `/mosques/[area]`. Lacks province in hierarchy for non-Toronto cities. | Inconsistent breadcrumb hierarchy. | **Reuse & Adapt** | Standardize 4-tier hierarchy: Home -> Provinces -> Province -> City -> Mosque. Add visible breadcrumbs and JSON-LD markup. | **P1** | Breadcrumb rendering and JSON-LD position tests. |
| **9** | **Internal Linking Architecture** | Full cross-linking: Homepage -> States -> Cities -> Mosques. Related peer cities linked. | Mosque profile links to nearby mosques, but lacks breadcrumbs back to province/city hubs. No cross-city linking. | Weak crawl paths between geographic hubs. | **Reuse & Adapt** | Add province directory index (`/provinces`), cross-links between GTA cities (Toronto, Mississauga, Brampton), Alberta cities (Calgary, Edmonton), and link mosque profiles to their city/province pages. | **P0** | Verify internal linking between provinces, cities, and mosques. |
| **10** | **Mosque Detail Page SEO** | Statically generated, PlaceOfWorship schema, factual address/phone/hours, nearby mosques, fallback noindex on unverified. | Statically generated (331 published mosques), PlaceOfWorship schema, prayer calculations, nearby mosques. | Strong existing foundation, but needs clean links back to province and city hubs. | **Reuse & Adapt** | Add contextual breadcrumbs and badges linking to `/cities/[city]` and `/provinces/[province]`. | **P1** | Mosque profile link integrity and static generation tests. |
| **11** | **City-Specific Content Generation** | Factual stats banner: total locations, count with hours, phone, websites; editorial highlights where verified. | Basic card grid with count. Lacks facilities breakdown, prayer times shortcuts, nearby city suggestions. | Canada city pages are functional but light on factual summary metrics. | **Reuse & Adapt** | Add factual stats bar (wheelchair access, women's facilities, verified Iqamah counts, direct phone numbers). | **P1** | Verify stats rendering matches actual dataset counts. |
| **12** | **Data Validation & Publication Eligibility** | Strict 3-tier: `verified`, `needs_review`, `excluded`. Only verified indexed. | 3-tier pipeline in `src/pipeline`: `published.json` (331), `review-required.json` (158), `excluded.json` (12). | Canada pipeline already adheres to strict separation! | **Preserve & Enforce** | Strictly preserve this distinction. Never publish `review-required` or `excluded` records to sitemap or indexable pages. | **P0** | Automated test verifying no review-required or excluded records appear in public repository. |
| **13** | **Duplicate Entity & Shared Address Protection** | 7-step deterministic slug collision resolver (`src/lib/seo/mosque-url.ts`). | Pipeline classifier & duplicate analyzer in `src/pipeline/duplicate-analyzer.ts`. | Canada published slugs are already unique, but needs verification test. | **Reuse & Enforce** | Add regression test asserting 100% slug uniqueness across all 331 published mosques. | **P0** | Test asserting zero duplicate slugs in published datasets. |
| **14** | **Handling Thin/Empty City Pages** | Tier A (>= 5 mosques) = eligible. Tier B (2–4) & Tier C (1) = ineligible (prevents doorway penalty). | All 9 Canadian metropolises have >= 9 mosques. All qualify as Tier A! | Missing explicit policy module to guard against thin pages if new cities are added. | **Reuse & Adapt** | Formalize Canadian city SEO policy: minimum 5 verified mosques for indexable city landing page. | **P1** | Threshold test verifying cities with < 5 mosques are not indexed. |
| **15** | **Tests Protecting SEO Behavior** | Vitest suite for city SEO, metadata, sitemaps, slug collisions. | 25 test files (358 tests) in Vitest. | Needs dedicated test suite for province/city SEO, sitemap compliance, canonical URLs, and schema validation. | **Reuse & Expand** | Create comprehensive test suites for new SEO capabilities (`province-city-seo.test.ts`, `sitemap-eligibility.test.ts`). | **P0** | Vitest test execution passing with 100% success. |

---

## 4. Canadian Geographic & Linguistic Adaptation Strategy

### A. Canadian Geographic Hierarchy
Unlike the United States (50 states, thousands of municipalities), Canada's Muslim population is heavily concentrated in major metropolitan areas across 5 key provinces:
1. **Ontario (ON)**: 178 published mosques
   - *Metropolises / Cities:* Toronto (96), Mississauga (31), Ottawa (27), Brampton (24).
   - *Toronto Boroughs:* Scarborough, North York, Etobicoke, East York, York.
2. **Quebec (QC)**: 67 published mosques
   - *Metropolis / City:* Montreal (67, including Saint-Laurent, Saint-Léonard, Lachine, Pierrefonds).
3. **Alberta (AB)**: 62 published mosques
   - *Metropolises / Cities:* Edmonton (34), Calgary (28).
4. **Manitoba (MB)**: 15 published mosques
   - *Metropolis / City:* Winnipeg (15).
5. **British Columbia (BC)**: 9 published mosques
   - *Metropolis / City:* Vancouver (9).

**Total Verified Published Mosques:** **331**

### B. Clean URL Structure with Zero Breaking Changes
To achieve maximum SEO clarity while guaranteeing 100% backward compatibility:
* **Provinces Hub:** `/provinces` (overview of Canadian provinces with mosque counts).
* **Province Landing Pages:** `/provinces/[province]`
  - `/provinces/ontario`
  - `/provinces/quebec`
  - `/provinces/alberta`
  - `/provinces/british-columbia`
  - `/provinces/manitoba`
* **City Landing Pages:** `/cities/[city]`
  - `/cities/toronto`
  - `/cities/montreal`
  - `/cities/calgary`
  - `/cities/edmonton`
  - `/cities/ottawa`
  - `/cities/mississauga`
  - `/cities/brampton`
  - `/cities/winnipeg`
  - `/cities/vancouver`
* **Preserved Existing Routes (No Breaking Changes):**
  - `/mosques` (All mosques interactive finder)
  - `/mosques/[area]` (Preserved working route for `toronto`, `montreal`, `calgary`, `scarborough`, etc.)
  - `/mosque/[slug]` (All 331 canonical mosque detail pages)
  - `/prayer-times` & `/prayer-times/[city]`
  - `/jummah` & `/jummah/toronto`
  - `/mosque-near-me` (Location-based client finder)

### C. Official Bilingualism & Canadian Search Intent
GSC queries reveal active French search terms: `"mosquée le plus proche"`, `"mosquée la plus proche"`, `"mosquée plus proche"`.
- Meta descriptions for Quebec and Montreal pages will incorporate natural French secondary keywords (e.g., *"Trouvez les mosquées et centres islamiques à Montréal, Québec"* alongside English).
- Language tags: `en-CA` as primary site locale, with schema indicating bilingual Canadian coverage.

---

## 5. Implementation Roadmap

The implementation will proceed systematically through the following steps:
1. **SEO Policy & Configuration Module:** Create `src/domain/seo/province-city-seo.ts` defining Canadian province configs, city configs, SEO eligibility policies, and metadata generators.
2. **Metadata & Robots Refinement:** Update `src/domain/seo/metadata.ts` with brand-suffix de-duplication, `'max-image-preview': 'large'`, and non-destructive `follow: true` on `noindex`.
3. **Schema.org Structured Data Extensions:** Add `generateProvinceCollectionJsonLd` and `generateCityCollectionJsonLd` in `src/domain/seo/schema.ts`.
4. **New Geographic Routes:**
   - Create `src/app/provinces/page.tsx` (National Province Directory).
   - Create `src/app/provinces/[province]/page.tsx` (Individual Province Landing Page).
   - Create `src/app/cities/[city]/page.tsx` (Individual City Landing Page).
5. **XML Sitemap Modernization:** Update `src/app/sitemap.ts` to use a deterministic `BUILD_DATE` constant, include all eligible province and city URLs, exclude unverified records, and ensure 100% canonical HTTPS.
6. **Internal Linking Mesh:** Link homepage to provinces and cities, cross-link sibling cities within provinces, and connect mosque profiles to their respective city and province pages.
7. **Automated Vitest Test Suite:** Implement comprehensive unit and integration tests verifying all SEO rules, metadata, sitemap integrity, and backward compatibility.
8. **Final Build & Verification:** Run typecheck, lint, test suite, and Next.js production build.
