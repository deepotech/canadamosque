# Ottawa Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.668Z  
**Dataset Source**: `ottawa.json` (51 raw records preserved intact)  
**Geographic Area**: Ottawa, Ontario, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **51** | 100.0% |
| **Published (Canonical)** | **25** | 49.0% |
| **Review Required** | **26** | 51.0% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 18 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 5 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 3 | Community center / Jamatkhana facility |
| **MUSALLA** | 3 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 0 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 8 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 14 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Ottawa | 30 |
| Nepean | 8 |
| Orléans | 4 |
| Gloucester | 4 |
| Edwards | 1 |
| Kanata | 1 |
| Stittsville | 1 |
| Richmond | 1 |
| Cumberland | 1 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 51 |
| **MISSING_HOURS** | 21 |
| **MISSING_PHONE** | 13 |
| **MISSING_WEBSITE** | 10 |
| **SHARED_ADDRESS** | 8 |
| **POSSIBLE_DUPLICATE** | 5 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 8 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 3 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 1 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 4
- **Shared Physical Addresses / Plazas**: 4
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (26)

### 1. AMA Community Centre (`mosque-ott-1`)
- **Index**: `#0`
- **Address**: 1216 Hunt Club Rd, Ottawa, ON K1V 2P1, Canada (Ottawa)
- **Classification**: `COMMUNITY_CENTER`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 2. Ottawa Muslim Association (`mosque-ott-3`)
- **Index**: `#2`
- **Address**: 251 Northwestern Ave, Ottawa, ON K1A 0K9, Canada (Ottawa)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 3. Masjid Ar-Rahmah (`mosque-ott-4`)
- **Index**: `#3`
- **Address**: 1216 Hunt Club Rd, Ottawa, ON K1V 2P1, Canada (Ottawa)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 4. Ottawa Uyghur Center (`mosque-ott-8`)
- **Index**: `#7`
- **Address**: 3555 St Joseph Blvd, Orléans, ON K4A 0Z7, Canada (Orléans)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. Darul Arqum , Markaz of Ottawa (`mosque-ott-9`)
- **Index**: `#8`
- **Address**: 4269 Limebank Rd, Gloucester, ON K1V 1G5, Canada (Gloucester)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 6. OSMCC (`mosque-ott-10`)
- **Index**: `#9`
- **Address**: 5358 Bank St Unit b, Gloucester, ON K1X 1H1, Canada (Gloucester)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 7. Kanata Muslim Association (`mosque-ott-11`)
- **Index**: `#10`
- **Address**: 351 Sandhill Rd, Kanata, ON K2K 0P6, Canada (Kanata)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 8. Stittsville Muslims Association (`mosque-ott-12`)
- **Index**: `#11`
- **Address**: 1469 Stittsville Main St, Stittsville, ON K2S 1E3, Canada (Stittsville)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 9. Islamic Society of Sandy Hill (`mosque-ott-13`)
- **Index**: `#12`
- **Address**: 117 Mann Ave, Ottawa, ON K1N 5A4, Canada (Ottawa)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 10. Darul Ummah (`mosque-ott-16`)
- **Index**: `#15`
- **Address**: 7311 Bank St, Ottawa, ON K0A 2P0, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 11. Richmond Islamic Community Ottawa (`mosque-ott-19`)
- **Index**: `#18`
- **Address**: 6179 Perth St Unit 30, Richmond, ON K0A 2Z0, Canada (Richmond)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 12. Ottawa Multifaith Room (`mosque-ott-27`)
- **Index**: `#26`
- **Address**: University of Ottawa, 121 University Private, Ottawa, ON K1N 1H3, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 13. Clinton (`mosque-ott-28`)
- **Index**: `#27`
- **Address**: 900 York Mills Dr, Orléans, ON K4A 2P1, Canada (Orléans)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 14. IslamicReminders1500 (`mosque-ott-29`)
- **Index**: `#28`
- **Address**: 33 Eleanor Dr, Ottawa, ON K2E 5Z8, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 15. Masjid (`mosque-ott-31`)
- **Index**: `#30`
- **Address**: Ottawa, ON K1T 1W4, Canada (Ottawa)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `GENERIC_NAME`
- **Review Trigger**: Generic title (e.g. 'Masjid') without clear organizational disambiguation.

### 16. Imam ash-Shafii Centre (ISC) (`mosque-ott-32`)
- **Index**: `#31`
- **Address**: 1792 Bank St, Ottawa, ON K1V 7Y6, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 17. Taqwa mosque (`mosque-ott-33`)
- **Index**: `#32`
- **Address**: 117 Mann Ave, Ottawa, ON K1N 5A4, Canada (Ottawa)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 18. The Islamic Society of Gloucester (`mosque-ott-38`)
- **Index**: `#37`
- **Address**: 1627 Maxime St, Gloucester, ON K1B 3K8, Canada (Gloucester)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 19. Assunnah Muslims Association (`mosque-ott-39`)
- **Index**: `#38`
- **Address**: 1216 Hunt Club Rd, Ottawa, ON K1V 2P1, Canada (Ottawa)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 20. Markaz At-Tawheed Ottawa (`mosque-ott-44`)
- **Index**: `#43`
- **Address**: 2835 Dumaurier Ave., Ottawa, ON K2B 7W3, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 21. Ibn-Rushd Canadian Islamic Cultural Society (`mosque-ott-45`)
- **Index**: `#44`
- **Address**: 1950 Merivale Rd Ste 200, Nepean, ON K2G 0B7, Canada (Nepean)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 22. MAC Youth Centre (`mosque-ott-46`)
- **Index**: `#45`
- **Address**: 1085 Grenon Ave, Ottawa, ON K2B 8N1, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 23. Muslim Association of Canada - Ottawa Chapter (`mosque-ott-48`)
- **Index**: `#47`
- **Address**: 1085 Grenon Ave, Ottawa, ON K2B 8L7, Canada (Ottawa)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 24. ISIA Centre (`mosque-ott-49`)
- **Index**: `#48`
- **Address**: 3865 Old Richmond Rd, Nepean, ON K2H 5C1, Canada (Nepean)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 25. ABFA (`mosque-ott-50`)
- **Index**: `#49`
- **Address**: 2575 Bond St, Ottawa, ON K2B 7C3, Canada (Ottawa)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 26. ISIA Ottawa (`mosque-ott-51`)
- **Index**: `#50`
- **Address**: 3856 Old Richmond Rd, Nepean, ON K2H 5C4, Canada (Nepean)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


