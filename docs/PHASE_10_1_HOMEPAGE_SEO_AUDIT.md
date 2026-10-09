# PHASE 10.1 — HOMEPAGE ON-PAGE SEO, UX & CONTENT AUDIT

**Date:** 2026-10-08  
**Scope:** In-depth audit of `src/app/page.tsx`, visible content, semantic hierarchy, search intent coverage, internal linking, schema, UX, and accessibility.  
**Auditor:** Senior Technical SEO, Local SEO, UX & Next.js Engineer.

---

## 1. Executive Summary

While Phase 10 established solid technical foundations (metadata utilities, robots rules, canonical URLs, WebSite/Organization JSON-LD, sitemap coverage), the visible homepage remains too minimal to achieve maximum organic search ranking and user engagement for Canadian search queries.

Specifically:
- The page contains only ~250 visible words.
- There is no dedicated section targeting the high-volume intent "Mosques in Canada".
- Supported Canadian cities are currently rendered only as small pill badges with no mosque counts or rich regional context.
- There is no dedicated "Near Me" privacy/utility explanation section.
- There is no dedicated Canadian prayer times landing section with direct city prayer links.
- There is no dedicated Jummah section contextualizing Friday prayer in Canada.
- There is no "How It Works" 3-step guide for discovery.
- There is no FAQ section addressing user queries and qualifying for FAQ structured data.
- The badge displays "331 Verified Mosques" which risks implying manual field audit for all records rather than the truthful "331 Mosques Listed" or "331 Published Locations".

---

## 2. Current Baseline Audit

### 2.1 Headings & Metadata
- **Current `<title>`:** `Find a Mosque Near Me in Canada | Mosque Finder & Prayer Times | Canada Mosque Near Me`
- **Current `<meta name="description">`:** `Find mosques near you across Canada — Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, and Vancouver. Browse 331 verified locations, view prayer times, and get directions.`
- **Current Canonical:** `https://canadamosquenearme.ca/`
- **Current H1:** `Find a Mosque Near Me in Canada`
- **Current H2s:**
  - `Three Essential Community Utilities`
- **Current H3s:**
  - `Mosque Finder — Near Me & by City`
  - `Daily Prayer Times`
  - `Iqamah & Jummah Schedules`
  - `Our Data Standards: Accuracy & Honesty` (inside `DataDistinctionNotice`)

### 2.2 Current Visible Sections
1. **Hero Section:**
   - Badges: `🇨🇦 Canada-Only Mosque Utility` and `9 Metropolises · 331 Verified Mosques`
   - H1: `Find a Mosque Near Me in Canada`
   - Short paragraph (33 words)
   - 2 Buttons: `📍 Find Mosques Near Me` (`/mosque-near-me`), `🕐 Daily Prayer Times` (`/prayer-times`)
   - 9 small city pill badges linking to `/mosques/[city]`
2. **Three Essential Utilities Section (3 cards):**
   - Nearby Mosques
   - Daily Prayer Times
   - Iqamah & Jummah Schedules
3. **Data Distinction Notice:**
   - Distinction between Opening Hours, Calculated Prayer Times, Mosque Iqamah, and Jummah.

### 2.3 Current Internal Linking
- `/mosque-near-me` (linked twice: hero + utility card)
- `/prayer-times` (linked twice: hero + utility card)
- `/mosques` (linked once: utility card)
- `/jummah` (linked once: utility card)
- 9 City links (`/mosques/[city]`):
  - Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, Vancouver
- **Gaps:**
  - No direct links to city prayer pages (`/prayer-times/[city]`)
  - No direct links to Friday prayer city pages (`/jummah/toronto`)
  - City links are just tiny badges with no context or mosque count indicators.

### 2.4 Current Structured Data (Schema.org)
- WebSite schema (in `layout.tsx`)
- Organization schema (in `layout.tsx` + `page.tsx`)
- WebPage schema (in `page.tsx`)
- **Gaps:**
  - No FAQPage schema (because no visible FAQ exists yet)
  - No ItemList schema for supported metropolitan regions

### 2.5 Word Count & Keyword Coverage
- **Total visible word count:** ~260 words.
- **Search terms present:** "mosque near me", "prayer times", "jummah", "Canadian mosques".
- **Search terms weak or missing:** "mosques in Canada", "find a mosque in Canada", "mosque locator Canada", "how to find a mosque near me", "Friday prayer in Canada", "prayer times across Canadian cities".

---

## 3. Detailed Gaps Analysis

### 3.1 Content Gaps
1. **Search Intent Depth:** A user or crawler visiting the homepage cannot read an overview of the Canadian mosque directory, how geolocation operates without server tracking, or what information is presented on mosque profiles.
2. **City Exploration Cards:** The city pills lack visual hierarchy and do not indicate the size of each city's directory (e.g., 96 in Toronto, 67 in Montreal, etc.).
3. **Dedicated Functional Sections:**
   - No section explaining the browser-side client privacy of the "Near Me" tool.
   - No dedicated section showcasing Canadian prayer time calculation across timezones.
   - No dedicated Jummah section explaining verified shift publication versus unverified estimates.
   - No 3-step "How It Works" guide.
4. **FAQ Section:** Completely absent. Frequent search intents ("Does the site use my location?", "Are prayer times calculated or provided by mosques?", "Which Canadian cities are covered?") are unanswered on the landing page.

### 3.2 UX & Visual Hierarchy Gaps
1. Hero pill list feels compressed on mobile.
2. Below the hero, the page transitions immediately into 3 feature cards, followed by the data notice, abruptly ending without further exploration pathways.
3. Lack of structured city cards with clear clickable areas and mosque count indicators.

### 3.3 Semantic & SEO Technical Gaps
1. Semantic outline jumps from H1 to a single H2 ("Three Essential Community Utilities"), missing topical headings like "Find Mosques in Canada", "Mosques in Major Canadian Cities", "Find a Mosque Near You", "Prayer Times for Canadian Cities", "Frequently Asked Questions".
2. FAQPage JSON-LD can be legitimately added once visible FAQs are present, providing rich snippet eligibility on Google SERPs.

---

## 4. Proposed Content & Section Architecture

1. **Hero Section (Refined):**
   - H1: `Find a Mosque Near Me in Canada`
   - Honest badge: `9 Metropolises · 331 Mosques Listed`
   - CTAs: Primary `📍 Find Mosques Near Me` (`/mosque-near-me`), Secondary `🕌 Browse Directory` (`/mosques`), Contextual `🕐 Daily Prayer Times` (`/prayer-times`).
2. **"Mosques in Canada" Overview Section (H2):**
   - Descriptive content explaining the Canada-wide discovery utility, verified address records, facilities (wudu, women's sections, parking), and astronomical prayer timing.
3. **Canadian City Discovery Cards (H2):**
   - Clean, accessible grid of 9 major metropolitan city cards with:
     - City Name & Province
     - Real published mosque count derived dynamically from canonical data
     - Direct canonical link to `/mosques/[city]`
     - Contextual link to city prayer times `/prayer-times/[city]`
4. **"Find a Mosque Near You" (Near Me Privacy & Discovery) (H2):**
   - Explains browser-only client-side Haversine distance calculation.
   - Absolute privacy guarantee: no server coordinates, no logging, no cookies.
   - CTA to `/mosque-near-me`.
5. **"Prayer Times for Canadian Cities" (H2):**
   - Explains solar astronomical engine (ISNA method, high-latitude angles) for Canadian latitudes.
   - Direct links to Canadian city prayer pages.
   - Clear distinction between calculated prayer times and mosque Iqamah schedules.
6. **"Jummah Prayer at Canadian Mosques" (H2):**
   - Explains Friday sermon shifts and zero-fabrication verification policy.
   - CTA to `/jummah` and `/jummah/toronto`.
7. **"How It Works" (H2):**
   - 3 clear, honest steps:
     1. Choose Near Me or pick a Canadian city.
     2. Browse verified community mosques and prayer rooms.
     3. Open mosque profiles for directions, facilities, and prayer times.
8. **Frequently Asked Questions (H2) + Schema.org FAQPage:**
   - 6 high-value, honest, informative questions and answers matching user search queries.
9. **Data Integrity & Distinction Notice:**
   - Maintained with clean visual integration.

---

## 5. Verification Plan

- Data files changed: **0**
- Test suite: Add new tests for homepage sections, H1/H2 hierarchy, links, and FAQ schema consistency.
- Verify TypeScript (`tsc --noEmit`), ESLint (`next lint`), and Next.js static build (`npm run build`).
- Verify live rendered page via HTTP GET.
