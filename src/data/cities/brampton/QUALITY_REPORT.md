# Brampton Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.490Z  
**Dataset Source**: `brampton.json` (26 raw records preserved intact)  
**Geographic Area**: Brampton, Ontario, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **26** | 100.0% |
| **Published (Canonical)** | **21** | 80.8% |
| **Review Required** | **5** | 19.2% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 8 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 5 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 3 | Community center / Jamatkhana facility |
| **MUSALLA** | 5 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 0 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 0 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 5 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Brampton | 26 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 26 |
| **MISSING_HOURS** | 8 |
| **MISSING_PHONE** | 3 |
| **MISSING_WEBSITE** | 2 |
| **SHARED_ADDRESS** | 0 |
| **POSSIBLE_DUPLICATE** | 0 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 0 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 5 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 0
- **Shared Physical Addresses / Plazas**: 0
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (5)

### 1. Islamic Forum Of Canada (`mosque-brm-1`)
- **Index**: `#0`
- **Address**: 200 Advance Blvd, Brampton, ON L6T 4V4, Canada (Brampton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 2. Nasfat Peel Region (`mosque-brm-2`)
- **Index**: `#1`
- **Address**: 1 Nelson St W Unit 11C, Brampton, ON L6X 1B6, Canada (Brampton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 3. Jamia Imam E Azam (`mosque-brm-5`)
- **Index**: `#4`
- **Address**: 51 McMurchy Ave S, Brampton, ON L6Y 1Y5, Canada (Brampton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 4. Ar-Rashaad Centre (`mosque-brm-21`)
- **Index**: `#20`
- **Address**: 18 Automatic Rd #2, Brampton, ON L6S 5N5, Canada (Brampton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. IMAMBARGAH QASR-E-ZAINAB (a.s) Canada (`mosque-brm-23`)
- **Index**: `#22`
- **Address**: 15 Fisherman Dr Unit#18 & 19, Brampton, ON L7A 1B7, Canada (Brampton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


