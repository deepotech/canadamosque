# Canada Mosque Near Me — Project Documentation

## 1. Project Purpose
**Canada Mosque Near Me** is an independent, Canada-only discovery and prayer utility web application designed to help Canadian Muslims find authentic nearby mosques, view accurate astronomical daily prayer times, and check verified mosque Iqamah and multi-shift Jummah prayer schedules.

The pilot launch area is the **Greater Toronto Area (GTA), Ontario**, engineered from the ground up for seamless expansion to all Canadian provinces and territories.

---

## 2. Architecture Overview
Built on modern **Next.js (App Router)** with **TypeScript (Strict)**, **Tailwind CSS**, and **Vitest**:
- **Server Components by Default**: Zero unnecessary client bundle overhead; pages are rendered server-side for maximum performance and crawlability.
- **Client Components Strictly Isolated**: Interactive browser APIs (e.g. Geolocation API, interactive maps, client filter toggles) are kept in dedicated client components.
- **Contract-First Domain Design**: Strict TypeScript interfaces establish domain invariants before business logic is written.
- **Structured Data & SEO-First**: Native Schema.org JSON-LD (`Mosque`, `PlaceOfWorship`, `CommunityCenter`, `BreadcrumbList`, `WebSite`), OpenGraph, Twitter cards, dynamic sitemaps, and robots.txt.

---

## 3. Major Directories
```
src/
├── app/                  # Next.js App Router (pages, layout, robots, sitemap, globals)
│   ├── mosques/          # Interactive Toronto Mosque Finder
│   ├── mosque/[slug]/    # Canonical SSG Mosque Profile pages
│   ├── prayer-times/     # Prayer calculation routes (Canada + Toronto)
│   └── jummah/           # Jummah schedules routes (Canada + Toronto)
├── components/           # UI components
│   ├── common/           # Reusable UI primitives (Container, Badge, DataDistinctionNotice)
│   ├── finder/           # MosqueFinder and MosqueCard components
│   ├── layout/           # Global structure (Header, Footer)
│   ├── location/         # Geolocation controls
│   ├── map/              # OpenStreetMap location display
│   ├── mosque/           # Profile cards (Facilities, Opening Hours, Prayer Times, Type Badge)
│   └── schedule/         # Verified congregation schedules (MosqueScheduleSection)
├── config/               # Site configuration and environment defaults
├── data/                 # Canonical datasets
│   └── toronto/          # Published (96 records), review, excluded, quality report, and verified schedules
│       ├── iqamah/       # Verified Iqamah schedules (verified.json)
│       └── jummah/       # Verified Jummah schedules (verified.json)
└── domain/               # Pure domain layer (contracts, validation, utilities, unit tests)
    ├── geo/              # Coordinates, Canada bounding box, Haversine distance
    ├── ingestion/        # Raw record ingestion contracts
    ├── iqamah/           # Mosque-specific Iqamah congregation times
    ├── jummah/           # Mosque-specific Friday Jummah shift schedules
    ├── mosque/           # Core Mosque entity, classification, status, repository
    ├── opening-hours/    # Physical facility opening and closing hours, status evaluator
    ├── prayer/           # Astronomical solar prayer calculations and engine interface
    ├── schedule/         # Unified schedule repository, provenance, expiration, conflict detection
    └── seo/              # Metadata helpers and Schema.org JSON-LD generators
```

---

## 4. Critical Distinction: The Five Data Pillars

To prevent common pitfalls, the application permanently segregates five concepts:

| Concept | Definition | Source / Origin | Rule |
| :--- | :--- | :--- | :--- |
| **Opening Hours** | Times when physical building doors are unlocked. | Scraped Google Places / venue bulletin. | **NEVER** confused with prayer times. Evaluated in local timezone. |
| **Calculated Prayer Times** | Solar astronomical windows (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha). | Computed via adhan (ISNA, 15°/15°) from real coordinates. | Computed dynamically; never hard-coded. |
| **Estimated Iqamah** | Calculated prayer time + a configured offset per prayer. | Derived from calculated prayer times only. | Clearly labelled "Estimated — not verified by this mosque." Never stored. Never called Verified. Never used for Jummah. |
| **Verified Mosque Iqamah** | Exact congregational prayer start times set by the mosque. | Official mosque publication. | Only shown when fully verified. Takes precedence over estimate. |
| **Jummah (Friday Prayer)** | Mosque-specific Friday khutbah/prayer shifts. | Official mosque announcements. | Never estimated. Only verified or not shown. |

---

## 5. Phase 4: Verified Iqamah & Jummah Architecture

### A. Provenance & Verification Model
Every mosque schedule record requires full provenance and auditability:
- **`source`**: Records `sourceType` (`OFFICIAL_WEBSITE`, `OFFICIAL_MOSQUE_PAGE`, `OFFICIAL_SOCIAL_MEDIA`, `DIRECT_MOSQUE_CONFIRMATION`, `MANUAL_VERIFICATION`, `OTHER`), `sourceName`, optional `sourceUrl`, and `retrievedAt`.
- **`verification`**: Explicit lifecycle state: `UNVERIFIED`, `PENDING_REVIEW`, `VERIFIED`, `EXPIRED`, `REVOKED`. Requires `verifiedAt` timestamp.
- **`confidence`**: `HIGH`, `MEDIUM`, or `LOW`. Confidence alone never overrides verification status.

### B. Expiration & Seasonal Range Logic
Determines currency deterministically via `isScheduleCurrent()`:
1. `verification.status === "VERIFIED"`
2. Current local date $\ge$ `effectiveFrom`
3. Current local date $\le$ `effectiveTo` (or `effectiveTo` is null for indefinite schedules)
4. Current local date $\le$ `verification.expiresAt` (or `expiresAt` is null)
5. `isScheduleExpiringSoon()` flags records within 14 days of expiration for proactive re-verification.

### C. Conflict Detection
If two verified schedules for the same mosque overlap in their effective date range, they are **withheld from public view** until resolved.

### D. Safe Publication Policy
A schedule is eligible for public presentation as verified ONLY when:
- Associated with an active canonical published mosque ID
- Fully validated (24-hour HH:mm time format, valid ISO dates)
- Verification status is strictly `VERIFIED`
- Not expired, future, or revoked
- Zero unresolved conflicts

### E. Zero-Fabrication Guarantee
Current verified production counts: **0 Iqamah records**, **0 Jummah records**.
When no verified schedule exists the UI shows an honest empty state.

---

## 6. Phase 4.1: Estimated Iqamah Engine

### Purpose
The Estimated Iqamah layer provides a convenience estimate when verified mosque-specific congregation data is unavailable. It must **never** be interpreted as an official mosque schedule.

### Architectural Boundary
```
src/domain/estimated-iqamah/     ← ESTIMATED layer (this phase)
  types.ts                        EstimatedIqamahConfig, EstimatedIqamahResult
  defaults.ts                     DEFAULT_ESTIMATED_IQAMAH_CONFIG
  validation.ts                   assertValidConfig, validateOffsets
  engine.ts                       calculateEstimatedIqamah()
  estimated-iqamah.test.ts        32 tests

src/domain/iqamah/               ← VERIFIED layer (Phase 4, unchanged)
src/domain/schedule/             ← VERIFIED repository (Phase 4, unchanged)
src/data/toronto/iqamah/verified.json  ← never touched by estimates
```

### How Estimation Works
```
estimatedTime = calculatedPrayerTime + offsetMinutes
```
The offset is an integer number of minutes, configured per-prayer. Date rollover past midnight (e.g. 23:55 + 15 min = 00:10) is handled via millisecond arithmetic on the underlying UTC Date objects.

### Default Estimation Parameters

| Prayer | Offset | Note |
|--------|--------|------|
| Fajr | +15 min | Configured estimation parameter only |
| Dhuhr | +15 min | Configured estimation parameter only |
| Asr | +15 min | Configured estimation parameter only |
| Maghrib | +5 min | Shorter — Maghrib congregation typically follows adhan quickly |
| Isha | +15 min | Configured estimation parameter only |

**IMPORTANT**: These values are configured estimation parameters. They are NOT:
- A claim about what Canadian mosques do
- A claim about what Toronto mosques do
- A standard or norm for any mosque
- Verified congregation data for any specific mosque

Individual mosques set their own congregation times. Actual times can differ substantially.

### Precedence Hierarchy
```
1. Verified Mosque Iqamah  (from ScheduleRepository — requires VERIFIED status)
2. Estimated Iqamah        (from calculateEstimatedIqamah — only when #1 is absent)
3. No Iqamah data          (honest empty state)

For Jummah:
1. Verified Jummah         (from ScheduleRepository)
2. No Jummah data          (honest empty state — NO estimated Jummah layer exists)
```

### Fallback Behaviour
- **Expired verified schedule** → `ScheduleRepository.getCurrentIqamahByMosqueId()` returns `null` → estimate shown
- **Conflicting verified schedules** → repository returns `null` → estimate shown
- **No verified schedule** → estimate shown
- **Verified schedule present** → estimate is NOT shown, never displayed alongside verified data

### Why Jummah Is Never Estimated
Jummah times are highly variable: they depend on the specific mosque, hall capacity, language of the khutbah, local start time preferences, and change seasonally (e.g. Ramadan). No general offset from Dhuhr can produce a meaningful estimate. Only verified mosque-specific schedules are shown.

### Configurability
`calculateEstimatedIqamah(prayerSchedule, config)` accepts a full `EstimatedIqamahConfig`:
```ts
{
  basis: "STANDARD_ESTIMATE",
  offsets: {
    fajrOffsetMinutes: 20,
    dhuhrOffsetMinutes: 10,
    asrOffsetMinutes: 15,
    maghribOffsetMinutes: 5,
    ishaOffsetMinutes: 20,
  },
  disclaimer: "..."
}
```
The default can be changed without modifying the calculation code.

### SEO & Structured Data Restrictions
- Estimated Iqamah is NOT added to `generateMosqueJsonLd()` or Schema.org output
- No `OpeningHoursSpecification`, `Event`, or `Schedule` structured data is emitted for estimates
- Page `<title>` and `<meta description>` do NOT claim mosque congregation times based on estimates
- Estimates are purely a UI-level convenience, clearly labelled

### UI Disclosure
Every estimated Iqamah display includes:
1. **"Estimated" amber badge** (not the green "Verified Current" badge)
2. **Warning banner**: "⚠ Estimated — Not verified by this mosque. Actual congregation times may differ."
3. **Offset column** showing `+X min` per prayer
4. **"Why is this estimated?"** expandable section explaining the mechanism

---

## 7. Completed Phases
- **Phase 0**: Project Invariants & Domain Architecture (TypeScript strict, Vitest, Tailwind, contracts).
- **Phase 1**: Canonical Ingestion & Classification Pipeline (96 published, 11 review, 2 excluded Toronto records).
- **Phase 2**: Production-Grade Prayer Times Engine (adhan v4.4.6, ISNA/MWL/Egyptian/Makkah/Karachi, DST, high-latitude).
- **Phase 3**: Canonical Mosque Profiles & Toronto Finder (96 SSG routes, OSM map, open/closed status, Schema.org JSON-LD).
- **Phase 4**: Verified Iqamah & Jummah Data Architecture (provenance, expiration, conflict detection, ScheduleRepository, `/jummah/toronto`).
- **Phase 4.1**: Estimated Iqamah Engine (separate domain, configurable offsets, verified precedence, midnight rollover, 32 new tests, 205 total).
