# Edmonton Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.564Z  
**Dataset Source**: `edmonton.json` (54 raw records preserved intact)  
**Geographic Area**: Edmonton, Alberta, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **54** | 100.0% |
| **Published (Canonical)** | **30** | 55.6% |
| **Review Required** | **24** | 44.4% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 22 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 5 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 2 | Community center / Jamatkhana facility |
| **MUSALLA** | 2 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 0 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 5 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 18 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Edmonton | 54 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 54 |
| **MISSING_HOURS** | 18 |
| **MISSING_PHONE** | 10 |
| **MISSING_WEBSITE** | 9 |
| **SHARED_ADDRESS** | 6 |
| **POSSIBLE_DUPLICATE** | 2 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 5 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 2 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 1
- **Shared Physical Addresses / Plazas**: 3
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (24)

### 1. Muslim Association of Canada (MAC) - Edmonton (`mosque-edm-1`)
- **Index**: `#0`
- **Address**: 6104 172 St NW, Edmonton, AB T6M 1E3, Canada (Edmonton)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 2. Hanny Al Khoury art studio (`mosque-edm-2`)
- **Index**: `#1`
- **Address**: 10200 102 Ave NW D213, Edmonton, AB T5J 4B7, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 3. Darul-Hadith Edmonton (Ahle-Hadith Society of Canada) (`mosque-edm-5`)
- **Index**: `#4`
- **Address**: 7708a Wagner Rd NW NW, Edmonton, AB T6E 5B2, Canada (Edmonton)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 4. AMJ Edmonton (`mosque-edm-6`)
- **Index**: `#5`
- **Address**: 7005 98 Ave NW, Edmonton, AB T6A 2T8, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. Omar Ibn Al-Khattab Centre (OIAC) (`mosque-edm-14`)
- **Index**: `#13`
- **Address**: 4115 91 St SW, Edmonton, AB T4X 0M7, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 6. Al Faruq Islamic School (`mosque-edm-15`)
- **Index**: `#14`
- **Address**: 4410 127 St SW, Edmonton, AB T6W1A2, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 7. Southeast Muslim Community Edmonton (`mosque-edm-17`)
- **Index**: `#16`
- **Address**: 2704 17 St NW, Edmonton, AB T6T 0X1, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 8. Islamic Shia Ithna-Asheri Centre of Edmonton (`mosque-edm-23`)
- **Index**: `#22`
- **Address**: 4307 33 Ave NW, Edmonton, AB T6L 4H7, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 9. Baitul Aman Islamic Society (`mosque-edm-24`)
- **Index**: `#23`
- **Address**: 2403 Ellwood Dr SW, Edmonton, AB T6X 0J6, Canada (Edmonton)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 10. Markaz-Ul-Islam (`mosque-edm-25`)
- **Index**: `#24`
- **Address**: 7907 36 Ave NW, Edmonton, AB T6K 3S6, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 11. Alfalah Center (`mosque-edm-26`)
- **Index**: `#25`
- **Address**: 2401 47 St NW, Edmonton, AB T6L 4P6, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 12. Faizan-e-Madina Edmonton (`mosque-edm-31`)
- **Index**: `#30`
- **Address**: 11809 96 St, Edmonton, AB T5G 1V4, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 13. Canadian Islamic Dar Alfatwa Centre (`mosque-edm-32`)
- **Index**: `#31`
- **Address**: 9006 132 Ave NW #305, Edmonton, AB T5E 0Y2, Canada (Edmonton)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 14. Alfalah Center North (`mosque-edm-33`)
- **Index**: `#32`
- **Address**: 4363 167 Ave NW ab unit 307, Edmonton, AB T5Y 3Y2, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 15. Afghan Husseini Islamic Center (Shia) (`mosque-edm-34`)
- **Index**: `#33`
- **Address**: 11219 180 St NW, Edmonton, AB T5S 0B4, Canada (Edmonton)
- **Classification**: `ISLAMIC_CENTER`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 16. Markaz Al Imam Malik مركز الامام مالك (`mosque-edm-35`)
- **Index**: `#34`
- **Address**: 14504 118 St NW, Edmonton, AB T5X 1T3, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 17. Al-Hadi Community Assn (`mosque-edm-46`)
- **Index**: `#45`
- **Address**: 15727 100a Ave NW, Edmonton, AB T5P 0L5, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 18. Afghan Hussaini Charitable Foundation Of Alberta (`mosque-edm-47`)
- **Index**: `#46`
- **Address**: 11219 180 St NW, Edmonton, AB T5S 0B4, Canada (Edmonton)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 19. GK Edmonton (`mosque-edm-49`)
- **Index**: `#48`
- **Address**: 4243 93 St NW, Edmonton, AB T6E 5Y3, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 20. Yygg (`mosque-edm-50`)
- **Index**: `#49`
- **Address**: 9426 118 Ave NW, Edmonton, AB T5G 0N6, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 21. Noor Ul Anwaar (`mosque-edm-51`)
- **Index**: `#50`
- **Address**: Entrance from Backside, 3440 93 St NW 2nd floor, Edmonton, AB T6E 5T5, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 22. Reyadul janna (`mosque-edm-52`)
- **Index**: `#51`
- **Address**: 5309 19 Ave SW, Edmonton, AB T6X 1A4, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 23. Masjed Dar Al-Arqam (`mosque-edm-53`)
- **Index**: `#52`
- **Address**: 13105 St Albert Trail NW, Edmonton, AB T5L 4H5, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 24. Islamic Academy Project (`mosque-edm-54`)
- **Index**: `#53`
- **Address**: 13070 113 St NW, Edmonton, AB T5E 5A8, Canada (Edmonton)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


