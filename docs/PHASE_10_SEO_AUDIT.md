# Phase 10 — SEO Audit Report

**Date:** 2026-10-08  
**Auditor:** Senior Technical SEO Engineer (Phase 10)  
**Scope:** Full Canada Mosque Near Me SEO audit before any modifications

---

## Data Baseline Verified

| Metric | Expected | Actual |
|--------|----------|--------|
| Raw | 501 | 501 ✅ |
| Published | 331 | 331 ✅ |
| Review Required | 158 | 158 ✅ |
| Excluded | 12 | 12 ✅ |
| Toronto SHA-256 | `0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9` | ✅ Verified in manifest |

---

## Architecture Overview

```
Routes
├── /                         → page.tsx (no exported metadata, uses layout's constructMetadata())
├── /mosques                  → page.tsx (exported metadata ✅)
├── /mosques/[area]           → page.tsx (generateMetadata ✅)
├── /mosque/[slug]            → page.tsx (generateMetadata ✅)
├── /prayer-times             → page.tsx (exported metadata ✅)
├── /prayer-times/toronto     → page.tsx (exported metadata ✅)
├── /prayer-times/[city]      → page.tsx (generateMetadata ✅)
├── /mosque-near-me           → page.tsx (exported metadata ✅)
├── /jummah                   → page.tsx (exported metadata ✅)
└── /jummah/toronto           → page.tsx (exported metadata ✅)

SEO Infrastructure
├── src/domain/seo/metadata.ts    → constructMetadata() utility
├── src/domain/seo/schema.ts      → JSON-LD generators
├── src/components/seo/
│   ├── BreadcrumbSchema.tsx
│   └── WebPageSchema.tsx
├── src/config/site.ts            → siteConfig (name, url, description)
├── src/app/sitemap.ts            → Dynamic sitemap
├── src/app/robots.ts             → Robots rules
└── src/app/layout.tsx            → WebSite schema + base metadata
```

---

## Current Strengths

1. **Solid metadata architecture** — `constructMetadata()` handles title, description, canonical, OG, Twitter, robots uniformly.
2. **WebSite schema** — Present in `layout.tsx` with SearchAction.
3. **BreadcrumbList schema** — Available on area and prayer pages.
4. **Mosque schema** — `generateMosqueJsonLd()` correctly outputs Mosque/PlaceOfWorship with PostalAddress and GeoCoordinates.
5. **No fake ratings** — No `aggregateRating` or `review` in schema. Verified by tests.
6. **Privacy-safe Near Me** — Client-side Haversine, no server coordinates.
7. **Data separation** — Calculated prayer ≠ Iqamah clearly maintained.
8. **Canonical repository** — Only published records exposed.
9. **Robots/security headers** — HSTS, X-Frame-Options, Referrer-Policy present.
10. **Sitemap structure** — Dynamically generates all published mosque profiles.
11. **Static params generation** — All 331 mosque profiles pre-built at build time.
12. **287 tests passing** — Comprehensive test coverage for domain logic.

---

## Current Weaknesses / Issues Found

### CRITICAL

#### 1. Homepage Missing `generateMetadata` / `export const metadata`
- **File:** `src/app/page.tsx`
- **Issue:** No `metadata` export. The homepage relies entirely on the root `layout.tsx` metadata which produces: `"Canada Mosque Near Me | Canadian Mosque Discovery & Prayer Times"`.
- **Target:** `"Find a Mosque Near Me in Canada | Mosque Finder & Prayer Times"`
- **Impact:** Homepage H1 says "Find a Mosque Near You across Canada" but title says different. Search intent mismatch.

#### 2. Homepage Missing Schema Markup
- **File:** `src/app/page.tsx`
- **Issue:** No WebPage or Organization JSON-LD on the homepage. Only the root WebSite schema (from layout) is present.
- **Impact:** Missing structured data opportunity for the most important page.

#### 3. Mosque Profile Breadcrumb Missing City Level
- **File:** `src/app/mosque/[slug]/page.tsx` line 130–134
- **Issue:** Breadcrumb is: `Home → Mosques → Mosque Name` — skips city level.
- **Expected:** `Home → Mosques → [City] → Mosque Name`
- **Impact:** Breadcrumb schema doesn't reflect actual hierarchy, missing city link.

#### 4. Mosque Profile Missing City-Specific Prayer Times Link
- **File:** `src/app/mosque/[slug]/page.tsx`
- **Issue:** "View calculated prayer times" links to `/prayer-times` (national), not the city-specific page.
- **Expected:** Link to `/prayer-times/toronto` for Toronto mosques, etc.
- **Impact:** Weak internal link equity between mosque profiles and city prayer pages.

#### 5. Mosque Profile Missing Area Link for Toronto Boroughs
- **File:** `src/app/mosque/[slug]/page.tsx`
- **Issue:** `isTorontoBorough` check exists but no link to the area page (e.g., `/mosques/scarborough`). Only city-level link shown.
- **Expected:** Area page link like `Browse Scarborough mosques` pointing to `/mosques/scarborough`.

#### 6. Area Pages Missing City Back-Link
- **File:** `src/app/mosques/[area]/page.tsx`
- **Issue:** Non-metropolis area pages (Scarborough, North York, etc.) link to prayer times and Near Me, but do NOT link back to `/mosques/toronto` (the parent city).
- **Impact:** Toronto borough pages have no breadcrumb link to parent city.

#### 7. Jummah Page Weak Metadata Description
- **File:** `src/app/jummah/page.tsx`
- **Issue:** `description: "Verified Friday Jummah prayer shift times across Canadian mosques."` — 64 chars, too short, doesn't mention "Canada" in a natural way, and implies verified data exists when it doesn't.
- **Toronto Jummah page** hardcodes province as `{mosque.city}, ON` (line 94) — this is wrong for non-Toronto mosques if any exist.

#### 8. Prayer Times `/toronto` Page is a Static Duplicate Route
- **File:** `src/app/prayer-times/toronto/page.tsx`
- **Issue:** Static `/prayer-times/toronto` route exists alongside dynamic `/prayer-times/[city]` which also generates `/prayer-times/toronto`. Both export different metadata. The dynamic route is the canonical one per sitemap, but both may be served.
- **Impact:** Potential duplicate content / canonical confusion. The static Toronto page is NOT included in `generateStaticParams()` for `[city]` (it's excluded from that loop by Next.js).

#### 9. Robots.ts is Too Permissive
- **File:** `src/app/robots.ts`
- **Issue:** Allows crawling of everything with `allow: "/"`. No disallow rules for API routes, data endpoints, or any path.
- **Expected:** Disallow `/api/`, `/_next/`, `/data/` etc.

#### 10. Sitemap URL Count Needs Verification
- **Expected:** 360 canonical URLs
- **Actual (calculated):** 6 static + 9 city prayer + 14 area slugs + 331 mosque profiles = **360** ✅
- **Issue:** Area slugs = 14 (9 metropolises + 5 Toronto boroughs). This is correct.

#### 11. National Directory `/mosques` Missing Schema
- **File:** `src/app/mosques/page.tsx`
- **Issue:** No WebPage schema, no BreadcrumbList. Other pages have WebPageSchema component.

#### 12. Mosque Profile Title Pattern Suboptimal
- **File:** `src/app/mosque/[slug]/page.tsx` line 65
- **Current:** `${mosque.name} — ${typeName} in ${mosque.city}, ${mosque.province}`
- **Then appended:** ` | Canada Mosque Near Me`
- **Result:** `"Birmingham Masjid — Mosque in Toronto, ON | Canada Mosque Near Me"` (~65 chars) — OK but the em dash and type name push it long for some.
- **Improvement:** `${mosque.name} in ${mosque.city}, ${mosque.province} | Address & Prayer Times` or simpler format.

#### 13. Homepage H1/Title Mismatch
- **H1:** "Find a Mosque Near You across Canada"
- **Title (from layout):** "Canada Mosque Near Me | Canadian Mosque Discovery & Prayer Times"
- **Expected H1:** Align more closely with primary intent — "Find a Mosque Near Me in Canada"

#### 14. No Organization Schema
- **Issue:** No `Organization` type JSON-LD. The site represents a service/tool, and an Organization schema would strengthen brand signals.

#### 15. Jummah Toronto Page Hardcodes Province
- **File:** `src/app/jummah/toronto/page.tsx` line 94
- **Code:** `{mosque.city}, ON` — hardcoded province
- **Impact:** Minor — Toronto page only covers Toronto mosques, but conceptually wrong pattern.

---

## SEO Opportunities Matrix

| Page | Title | Description | H1 | Schema | Breadcrumb | Internal Links |
|------|-------|-------------|-----|--------|------------|----------------|
| Homepage | ⚠️ Generic | ✅ OK | ⚠️ Mismatch | ❌ None | N/A | ✅ Good |
| /mosques | ✅ | ✅ | ✅ | ❌ No WebPage | ❌ None | ✅ |
| /mosques/[area] | ✅ | ✅ | ✅ | ✅ Breadcrumb | ✅ | ⚠️ Missing city back-link |
| /mosque/[slug] | ✅ | ✅ | ✅ | ✅ Mosque+BC | ⚠️ No city | ⚠️ Generic prayer link |
| /prayer-times | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /prayer-times/toronto | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /prayer-times/[city] | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /mosque-near-me | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /jummah | ⚠️ | ⚠️ Short desc | ✅ | ❌ None | ❌ None | ⚠️ |
| /jummah/toronto | ✅ | ⚠️ | ✅ | ❌ None | ❌ None | ✅ |
| /robots.ts | — | — | — | — | — | ⚠️ Too open |

---

## Files Requiring Changes

| File | Change Type | Priority |
|------|-------------|----------|
| `src/app/page.tsx` | Add `metadata` export + WebPage schema | HIGH |
| `src/app/mosque/[slug]/page.tsx` | Fix breadcrumb, prayer link, area link | HIGH |
| `src/app/mosques/page.tsx` | Add WebPageSchema + BreadcrumbSchema | MEDIUM |
| `src/app/jummah/page.tsx` | Improve metadata + add BreadcrumbSchema + WebPageSchema | MEDIUM |
| `src/app/jummah/toronto/page.tsx` | Fix hardcoded province + add BreadcrumbSchema | MEDIUM |
| `src/app/robots.ts` | Add disallow rules | MEDIUM |
| `src/domain/seo/schema.ts` | Add Organization schema generator | MEDIUM |
| `src/app/layout.tsx` | Add Organization schema | MEDIUM |
| `src/app/mosques/[area]/page.tsx` | Add city back-link for non-metropolis areas | LOW |
| `docs/PHASE_10_SEO_AUDIT.md` | This document | N/A |
| `src/domain/seo/seo-phase10.test.ts` | New comprehensive SEO test suite | HIGH |

---

## Expected Canonical URL Count

| Category | Count |
|----------|-------|
| Static pages | 6 |
| City prayer pages | 9 |
| Area/city mosque pages | 14 |
| Mosque profiles | 331 |
| **TOTAL** | **360** |

---

## Risks

1. **Homepage metadata change** — Adding `export const metadata` to `page.tsx` will override the layout metadata for homepage only. Must ensure no regression.
2. **Breadcrumb addition** — Adding city to breadcrumb on mosque profiles requires city config lookup. If `getCityConfigByName` returns null for a borough, must fall back gracefully.
3. **Toronto static route** — `/prayer-times/toronto/page.tsx` exists as static AND would also be generated by `[city]/page.tsx`. Next.js handles this by preferring the more specific static route. No action needed, but worth documenting.
4. **Robots.ts changes** — Must not accidentally block legitimate crawl paths.

---

## Current Test Coverage for SEO

- `schema.test.ts` — Tests JSON-LD generators (5 tests) ✅
- `seo-quality.test.ts` — Tests metadata for prayer times (2 tests) ✅

**Gap:** No tests for:
- Homepage metadata
- Mosque profile metadata
- 331-profile metadata uniqueness
- Sitemap URL count
- Canonical URL format
- Breadcrumb correctness
- Review/excluded isolation

---

## Recommended Changes (Summary)

1. Add `export const metadata` to homepage with target title
2. Add WebPage schema + Organization schema to homepage
3. Extend mosque profile breadcrumb to include city level
4. Fix mosque profile prayer link to city-specific URL
5. Add area page link to mosque profiles for Toronto boroughs
6. Add WebPageSchema + BreadcrumbSchema to `/mosques` and `/jummah` pages
7. Fix jummah description
8. Add city back-link in Toronto borough area pages
9. Tighten robots.ts with disallow rules
10. Add Organization JSON-LD to layout
11. Create comprehensive Phase 10 SEO test suite
12. Verify sitemap count = 360

**DATA FILES: ZERO CHANGES PLANNED**
