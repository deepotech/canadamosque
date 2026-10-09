# Vancouver Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.499Z  
**Dataset Source**: `vancouver.json` (14 raw records preserved intact)  
**Geographic Area**: Vancouver, British Columbia, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **14** | 100.0% |
| **Published (Canonical)** | **8** | 57.1% |
| **Review Required** | **6** | 42.9% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 3 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 0 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 2 | Community center / Jamatkhana facility |
| **MUSALLA** | 4 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 1 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 4 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 0 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Vancouver | 14 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 14 |
| **MISSING_HOURS** | 6 |
| **MISSING_PHONE** | 3 |
| **MISSING_WEBSITE** | 4 |
| **SHARED_ADDRESS** | 2 |
| **POSSIBLE_DUPLICATE** | 2 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 4 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 4 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 1 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 1
- **Shared Physical Addresses / Plazas**: 1
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (6)

### 1. Muslim Prayer Room (`mosque-van-2`)
- **Index**: `#1`
- **Address**: 7008 Victoria Dr, Vancouver, BC V5P 1Y6, Canada (Vancouver)
- **Classification**: `MUSALLA`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `GENERIC_NAME`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`
- **Review Trigger**: Generic title (e.g. 'Masjid') without clear organizational disambiguation.

### 2. British Columbia Muslim Association (`mosque-van-4`)
- **Index**: `#3`
- **Address**: 4162 Welwyn St, Vancouver, BC V5N 3Z2, Canada (Vancouver)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 3. Masjid Ul-Haqq (`mosque-van-6`)
- **Index**: `#5`
- **Address**: 4162 Welwyn St, Vancouver, BC V5N 3Z2, Canada (Vancouver)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 4. Muslim Association of Canada- MAC (`mosque-van-7`)
- **Index**: `#6`
- **Address**: 2122 Kingsway, Vancouver, BC V5N 2T5, Canada (Vancouver)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 5. Al Arqam Foundation Community Centre and Services (`mosque-van-13`)
- **Index**: `#12`
- **Address**: 8118 Fraser St, Vancouver, BC V5X 3X6, Canada (Vancouver)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 6. Daralmadinah Society (`mosque-van-14`)
- **Index**: `#13`
- **Address**: 1659 10th Avenue Bikeway, Vancouver, BC V5N 1X6, Canada (Vancouver)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.


---

## 7. Excluded Records (0)


