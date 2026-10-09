# Calgary Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.530Z  
**Dataset Source**: `calgary.json` (43 raw records preserved intact)  
**Geographic Area**: Calgary, Alberta, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **43** | 100.0% |
| **Published (Canonical)** | **24** | 55.8% |
| **Review Required** | **19** | 44.2% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 6 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 14 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 0 | Community center / Jamatkhana facility |
| **MUSALLA** | 4 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 1 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 10 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 8 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Calgary | 43 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 42 |
| **MISSING_HOURS** | 19 |
| **MISSING_PHONE** | 12 |
| **MISSING_WEBSITE** | 13 |
| **SHARED_ADDRESS** | 12 |
| **POSSIBLE_DUPLICATE** | 4 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 10 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 4 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 2
- **Shared Physical Addresses / Plazas**: 8
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (19)

### 1. Islamic Association of NW Calgary (`mosque-cal-1`)
- **Index**: `#0`
- **Address**: 7750 Ranchview Dr NW #23, Calgary, AB T3G 1V6, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 2. Islamic Information Society of Calgary (IISC) (`mosque-cal-2`)
- **Index**: `#1`
- **Address**: 4128 6 St NE, Calgary, AB T2E 8C8, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 3. Al-Salam Centre (`mosque-cal-7`)
- **Index**: `#6`
- **Address**: 6415 Ranchview Dr NW, Calgary, AB T3G 1B5, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 4. Islamic Association of NW Calgary (`mosque-cal-9`)
- **Index**: `#8`
- **Address**: 183 Beddington Dr NE, Calgary, AB T3K 3V3, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 5. Muslim Council Of Calgary (`mosque-cal-19`)
- **Index**: `#18`
- **Address**: 5615 14 Ave SW, Calgary, AB T3H 4R5, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 6. Baitun-Nur Mosque Ahmadiyya Muslim Jamaat (`mosque-cal-23`)
- **Index**: `#22`
- **Address**: 4353 54 Ave NE, Calgary, AB T3J 4L3, Canada (Calgary)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_HOURS`, `POSSIBLE_DUPLICATE`, `SHARED_ADDRESS`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 7. Shia Muslim Association Of Calgary (`mosque-cal-26`)
- **Index**: `#25`
- **Address**: 4755 34 St SE, Calgary, AB T2B 3B3, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 8. Explosive Landscaping (`mosque-cal-27`)
- **Index**: `#26`
- **Address**: 6439 2 St SE, Calgary, AB T2H 1J5, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 9. Hussaini Association of Calgary (Imambargah) (`mosque-cal-29`)
- **Index**: `#28`
- **Address**: 4755 34 St SE, Calgary, AB T2B 3B3, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 10. Ahmadiyya Movement In Islam (`mosque-cal-31`)
- **Index**: `#30`
- **Address**: 4353 54 Ave NE, Calgary, AB T3J 4L3, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`, `SHARED_ADDRESS`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 11. Al-Bushra Islamic Foundation (`mosque-cal-32`)
- **Index**: `#31`
- **Address**: 1 Tamarac Crescent SW, Calgary, AB T3C 3B7, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 12. Khaled Hussain house (`mosque-cal-33`)
- **Index**: `#32`
- **Address**: 232 Templeby Pl NE, Calgary, AB T1Y 5H1, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 13. Muslim Community Foundation of Calgary (`mosque-cal-34`)
- **Index**: `#33`
- **Address**: 2711 39 Ave NE, Calgary, AB T1Y 4T8, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 14. Minaret (`mosque-cal-37`)
- **Index**: `#36`
- **Address**: 4004 54 Ave NE, Calgary, AB T3J 3J8, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 15. Ar Rahma mussallah (`mosque-cal-38`)
- **Index**: `#37`
- **Address**: 225 28 St SE, Calgary, AB T2A 5K4, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 16. Patterson Musalah Society (`mosque-cal-39`)
- **Index**: `#38`
- **Address**: 1009 Prominence Way SW, Calgary, AB T3H 2B4, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 17. pàlíser (`mosque-cal-40`)
- **Index**: `#39`
- **Address**: 605 5 St SW, Calgary, AB T2P 0Y3, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 18. Imam Ali Association (`mosque-cal-41`)
- **Index**: `#40`
- **Address**: 2138 48 St SE, Calgary, AB T2B 1M2, Canada (Calgary)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 19. Dar Al Hijra ( Halaqa centre) (`mosque-cal-42`)
- **Index**: `#41`
- **Address**: 4128 6 St NE, Calgary, AB T2E 8C8, Canada (Calgary)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


