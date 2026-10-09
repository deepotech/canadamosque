# Mississauga Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.473Z  
**Dataset Source**: `mississauga.json` (46 raw records preserved intact)  
**Geographic Area**: Mississauga, Ontario, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **46** | 100.0% |
| **Published (Canonical)** | **28** | 60.9% |
| **Review Required** | **18** | 39.1% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 10 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 10 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 4 | Community center / Jamatkhana facility |
| **MUSALLA** | 6 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 1 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 3 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 12 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Mississauga | 46 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 46 |
| **MISSING_HOURS** | 14 |
| **MISSING_PHONE** | 6 |
| **MISSING_WEBSITE** | 5 |
| **SHARED_ADDRESS** | 4 |
| **POSSIBLE_DUPLICATE** | 4 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 3 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 6 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 2
- **Shared Physical Addresses / Plazas**: 2
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (18)

### 1. Sayeda Khadija Centre (`mosque-mis-6`)
- **Index**: `#5`
- **Address**: 7150 Edwards Blvd, Mississauga, ON L5S 1Z1, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 2. Muslim Association of Canada (MAC) (`mosque-mis-12`)
- **Index**: `#11`
- **Address**: 2380 Speakman Dr, Mississauga, ON L5K 1B4, Canada (Mississauga)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 3. Muslim Welfare Center - Mussalah Al-Abbas (`mosque-mis-13`)
- **Index**: `#12`
- **Address**: 3490 Mavis Rd, Mississauga, ON L5C 1T8, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 4. Jamia Islamia Canada (`mosque-mis-14`)
- **Index**: `#13`
- **Address**: 2380 Tedlo St, Mississauga, ON L5A 3V3, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. Muslim Welfare Canada (Food Bank & Musalla) (`mosque-mis-19`)
- **Index**: `#18`
- **Address**: 3490 Mavis Rd, Mississauga, ON L5C 1T8, Canada (Mississauga)
- **Classification**: `MUSALLA`
- **Quality Flags**: `MISSING_DESCRIPTION`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 6. ISNA Canada (`mosque-mis-26`)
- **Index**: `#25`
- **Address**: 2200 S Sheridan Way, Mississauga, ON L5J 2M4, Canada (Mississauga)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 7. Muslim Neighbour Nexus (`mosque-mis-27`)
- **Index**: `#26`
- **Address**: 3520 Odyssey Dr, Mississauga, ON L5M 7N4, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 8. Jummah Salah in Tawheed Community Centre (`mosque-mis-31`)
- **Index**: `#30`
- **Address**: Mississauga, ON L4Z 1N4, Canada (Mississauga)
- **Classification**: `JUMMAH_LOCATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 9. Ali Islamic Mission (`mosque-mis-32`)
- **Index**: `#31`
- **Address**: 6625 Kitimat Rd #52-53, Mississauga, ON L5N 3T5, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 10. جامع قيد الانشاء (`mosque-mis-33`)
- **Index**: `#32`
- **Address**: 6508 Winston Churchill Blvd, Mississauga, ON L5N 4B7, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 11. IONA convention (`mosque-mis-34`)
- **Index**: `#33`
- **Address**: 5761 Coopers Ave, Mississauga, ON L4Z 0C5, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 12. Al Huda Institute Canada (`mosque-mis-36`)
- **Index**: `#35`
- **Address**: 5671 McAdam Rd, Mississauga, ON L4Z 1N9, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 13. Bab ul Ilm - Bani Hashim Society (`mosque-mis-37`)
- **Index**: `#36`
- **Address**: 900 Eglinton Ave E, Mississauga, ON L4W 1K3, Canada (Mississauga)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 14. Tawheed Community Centre (`mosque-mis-38`)
- **Index**: `#37`
- **Address**: 5585 McAdam Rd, Mississauga, ON L4Z 1P1, Canada (Mississauga)
- **Classification**: `COMMUNITY_CENTER`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 15. Rowdah Centre (`mosque-mis-39`)
- **Index**: `#38`
- **Address**: 6535 Millcreek Dr Unit # 61, Mississauga, ON L5N 2M2, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 16. Jamia Riyadhul-Jannah (`mosque-mis-40`)
- **Index**: `#39`
- **Address**: 6680 Campobello Rd, Mississauga, ON L5N 2L8, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 17. NOOR UL QURAN CANADA (`mosque-mis-43`)
- **Index**: `#42`
- **Address**: 3154 Hurontario St, Mississauga, ON L5B 1N9, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 18. Mississauga Muslim Community (`mosque-mis-46`)
- **Index**: `#45`
- **Address**: 1275 Mississauga Vly Blvd, Mississauga, ON L5A 3R8, Canada (Mississauga)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


