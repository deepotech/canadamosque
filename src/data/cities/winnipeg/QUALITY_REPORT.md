# Winnipeg Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.644Z  
**Dataset Source**: `winnipeg.json` (21 raw records preserved intact)  
**Geographic Area**: Winnipeg, Manitoba, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **21** | 100.0% |
| **Published (Canonical)** | **14** | 66.7% |
| **Review Required** | **7** | 33.3% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 7 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 4 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 1 | Community center / Jamatkhana facility |
| **MUSALLA** | 2 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 0 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 2 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 2 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 3 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Winnipeg | 21 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 21 |
| **MISSING_HOURS** | 11 |
| **MISSING_PHONE** | 5 |
| **MISSING_WEBSITE** | 6 |
| **SHARED_ADDRESS** | 4 |
| **POSSIBLE_DUPLICATE** | 0 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 2 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 4 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 0
- **Shared Physical Addresses / Plazas**: 2
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (7)

### 1. Manitoba Islamic Association (MIA) Connections (`mosque-wpg-2`)
- **Index**: `#1`
- **Address**: 406 Edmonton St, Winnipeg, MB R3B 2M2, Canada (Winnipeg)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 2. Yaseen Centre Of Manitoba (`mosque-wpg-3`)
- **Index**: `#2`
- **Address**: 746 Ellice Ave, Winnipeg, MB R3G 0B6, Canada (Winnipeg)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 3. Faizan E Makkah Winnipeg (`mosque-wpg-4`)
- **Index**: `#3`
- **Address**: 509 St Mary's Rd, Winnipeg, MB R2M 3L2, Canada (Winnipeg)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 4. Manitoba Dawah Centre (`mosque-wpg-6`)
- **Index**: `#5`
- **Address**: 368 Edmonton St, Winnipeg, MB R3B 2L3, Canada (Winnipeg)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. University of Manitoba Masjid (`mosque-wpg-16`)
- **Index**: `#15`
- **Address**: E3, 103 Dafoe Rd W #160, Winnipeg, MB R3T 5V6, Canada (Winnipeg)
- **Classification**: `PRAYER_ROOM`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`, `SHARED_ADDRESS`
- **Review Trigger**: Campus or institutional multi-faith room requiring manual verification of public accessibility.

### 6. Manitoba Islamic Association (MIA) Grand Mosque (`mosque-wpg-17`)
- **Index**: `#16`
- **Address**: 2445 Waverley St, Winnipeg, MB R3Y 1S3, Canada (Winnipeg)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 7. The University of Winnipeg Muslim Prayer Centre (Room #0W16) (`mosque-wpg-18`)
- **Index**: `#17`
- **Address**: Graham Hall, 515 Portage Ave, Winnipeg, MB R3B 2E9, Canada (Winnipeg)
- **Classification**: `PRAYER_ROOM`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`
- **Review Trigger**: Campus or institutional multi-faith room requiring manual verification of public accessibility.


---

## 7. Excluded Records (0)


