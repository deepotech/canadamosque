# Toronto Pilot Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T10:49:06.980Z  
**Dataset Source**: `toronto.json` (153 raw records preserved intact)  
**Geographic Area**: Greater Toronto Area (GTA), Ontario, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **153** | 100.0% |
| **Published (Canonical)** | **96** | 62.7% |
| **Review Required** | **56** | 36.6% |
| **Excluded** | **1** | 0.7% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 59 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 22 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 7 | Community center / Jamatkhana facility |
| **MUSALLA** | 18 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 4 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 19 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 2 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 21 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 1 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Scarborough | 51 |
| North York | 34 |
| Toronto | 31 |
| Etobicoke | 16 |
| York | 12 |
| East York | 8 |
| Markham | 1 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 153 |
| **MISSING_HOURS** | 46 |
| **MISSING_PHONE** | 35 |
| **MISSING_WEBSITE** | 32 |
| **SHARED_ADDRESS** | 21 |
| **POSSIBLE_DUPLICATE** | 10 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 19 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 20 |
| **POSSIBLE_CLOSED_LOCATION** | 2 |
| **POSSIBLE_NOT_A_MOSQUE** | 3 |
| **GENERIC_NAME** | 3 |
| **CONTRADICTORY_INFORMATION** | 1 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 5
- **Shared Physical Addresses / Plazas**: 11
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (56)

### 1. Bosnian Islamic Assoc Gazi Husrev-Beg (`mosque-to-5`)
- **Index**: `#4`
- **Address**: 122 N Queen St, Etobicoke, ON M8Z 2E4, Canada (Etobicoke)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 2. George Brown - Multi Faith Room (Room 361) (`mosque-to-9`)
- **Index**: `#8`
- **Address**: 3 Lower Jarvis St, Toronto, ON M5E 3Y5, Canada (Toronto)
- **Classification**: `PRAYER_ROOM`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`
- **Review Trigger**: Campus or institutional multi-faith room requiring manual verification of public accessibility.

### 3. Toronto and Region Islamic Congregation (`mosque-to-10`)
- **Index**: `#9`
- **Address**: 99 Beverly Hills Dr, North York, ON M3L 1A2, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 4. North York Muslim Association (`mosque-to-12`)
- **Index**: `#11`
- **Address**: Concourse Level, North York Center, 5150 Yonge St Unit C37, North York, ON M2N 6L8, Canada (North York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 5. Abu Huraira Centre (`mosque-to-18`)
- **Index**: `#17`
- **Address**: 270 Yorkland Blvd, North York, ON M2J 5C9, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 6. Islamic Information & Dawah Centre International (`mosque-to-19`)
- **Index**: `#18`
- **Address**: 1168 Bloor St W, Toronto, ON M6H 1N2, Canada (Toronto)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 7. Turkish Canadian Islamic Trust (`mosque-to-21`)
- **Index**: `#20`
- **Address**: 336 Pape Ave, Toronto, ON M4M 2W7, Canada (Toronto)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 8. Ubai Bin Kab Academy of Islamic Sciences (`mosque-to-30`)
- **Index**: `#29`
- **Address**: 1160 Tapscott Rd Unit 2-3, Scarborough, ON M1X 1E9, Canada (Scarborough)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 9. Masjidur Rahmah (`mosque-to-31`)
- **Index**: `#30`
- **Address**: 328 Parliament St, Toronto, ON M5A 2Z7, Canada (Toronto)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 10. Musallah Student Union (`mosque-to-34`)
- **Index**: `#33`
- **Address**: Scarborough, ON M1C 1A3, Canada (Scarborough)
- **Classification**: `PRAYER_ROOM`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`
- **Review Trigger**: Campus or institutional multi-faith room requiring manual verification of public accessibility.

### 11. Bab E Zahra s.a. (`mosque-to-40`)
- **Index**: `#39`
- **Address**: 2370 Midland Ave a32, Scarborough, ON M1S 5C6, Canada (Scarborough)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 12. Daleel Islamic Association (`mosque-to-43`)
- **Index**: `#42`
- **Address**: 6 Collinsgrove Rd, Scarborough, ON M1E 2P1, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 13. Spiritual Society Canada inc. (`mosque-to-44`)
- **Index**: `#43`
- **Address**: 4 Old Kingston Rd, Scarborough, ON M1E 3J5, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 14. Milliken Muslim Community (Masjid/Mosque) (`mosque-to-45`)
- **Index**: `#44`
- **Address**: 5000 Steeles Ave E, Markham, ON L3S 1V6, Canada (Markham)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_NOT_A_MOSQUE`
- **Review Trigger**: User reviews or source evidence suggest this location is not an active mosque.

### 15. Islamic Foundation of Toronto (`mosque-to-54`)
- **Index**: `#53`
- **Address**: 441 Nugget Ave, Scarborough, ON M1S 5E1, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 16. Ruggeri bakery (`mosque-to-55`)
- **Index**: `#54`
- **Address**: 324 Rustic Rd, North York, ON M6L 1W5, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 17. Islamic Institute of Toronto (IIT) (`mosque-to-58`)
- **Index**: `#57`
- **Address**: 1630 Neilson Rd, Scarborough, ON M1X 1S3, Canada (Scarborough)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 18. Hadi Islamic Association (`mosque-to-61`)
- **Index**: `#60`
- **Address**: 40 S Station St, York, ON M9N 2B3, Canada (York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 19. International Muslims Organization (`mosque-to-63`)
- **Index**: `#62`
- **Address**: 65 Rexdale Blvd, Etobicoke, ON M9W 1P1, Canada (Etobicoke)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 20. Faizan-e-Madina Canada (`mosque-to-64`)
- **Index**: `#63`
- **Address**: 595 Albion Rd, Etobicoke, ON M9V 1A1, Canada (Etobicoke)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 21. Miqa Foundation (`mosque-to-67`)
- **Index**: `#66`
- **Address**: 12 Thorncliffe Park Dr, East York, ON M4H 1N8, Canada (East York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 22. Claude Legros Sales Inc (`mosque-to-68`)
- **Index**: `#67`
- **Address**: 89 Ingram Dr, North York, ON M6M 2L7, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 23. Hilal Committee of Metropolitan Toronto & Vicinity (`mosque-to-70`)
- **Index**: `#69`
- **Address**: 1015 Danforth Ave, Toronto, ON M4J 1M1, Canada (Toronto)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 24. Masjid al Furqan (`mosque-to-76`)
- **Index**: `#75`
- **Address**: 874 Weston Rd a, York, ON M6N 3R6, Canada (York)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 25. TROID (`mosque-to-79`)
- **Index**: `#78`
- **Address**: 874-A Weston Rd, York, ON M6N 3R6, Canada (York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 26. Muslim Prayer Room (`mosque-to-82`)
- **Index**: `#81`
- **Address**: 2075 Bayview Avenue ECG 05, North York, ON M4N 3M5, Canada (North York)
- **Classification**: `MUSALLA`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `GENERIC_NAME`, `POSSIBLE_CLOSED_LOCATION`, `POSSIBLE_NOT_A_MOSQUE`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`
- **Review Trigger**: User reviews or source evidence suggest this location is not an active mosque.

### 27. Jamaat of Ontario (`mosque-to-83`)
- **Index**: `#82`
- **Address**: 110 Fairbank Ave, York, ON M6E 3Z1, Canada (York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 28. Toryork Islamic Centre (OAAIIL) (`mosque-to-85`)
- **Index**: `#84`
- **Address**: 175 Toryork Dr #54, North York, ON M9L 2Y7, Canada (North York)
- **Classification**: `ISLAMIC_CENTER`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_DESCRIPTION`, `POSSIBLE_NOT_A_MOSQUE`
- **Review Trigger**: User reviews or source evidence suggest this location is not an active mosque.

### 29. Mesjid Al Sabur (`mosque-to-92`)
- **Index**: `#91`
- **Address**: 4081 Dufferin St, North York, ON M3H 5R8, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 30. Talimul Islam Masjid (`mosque-to-93`)
- **Index**: `#92`
- **Address**: 86 Rivalda Rd, North York, ON M9M 2M8, Canada (North York)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `CONTRADICTORY_INFORMATION`
- **Review Trigger**: Contradictory categories or metadata found in raw source.

### 31. Jannatul Ferdous Mosque (`mosque-to-96`)
- **Index**: `#95`
- **Address**: 1701 Martin Grove Rd #11, Etobicoke, ON M9V 5G1, Canada (Etobicoke)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_CLOSED_LOCATION`
- **Review Trigger**: Review reports indicate location is permanently locked, shut, or no longer operational.

### 32. Canadian Islamic Civic Academy (CICA) (`mosque-to-97`)
- **Index**: `#96`
- **Address**: 1753 Albion Rd #21, Etobicoke, ON M9V 1C3, Canada (Etobicoke)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 33. Weston Islamic Benevolence Society (`mosque-to-98`)
- **Index**: `#97`
- **Address**: 172 Milvan Dr, North York, ON M9L 1Z8, Canada (North York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 34. United Canadian Muslim (`mosque-to-99`)
- **Index**: `#98`
- **Address**: 184 Rhodes Ave, Toronto, ON M4L 3A1, Canada (Toronto)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`, `SHARED_ADDRESS`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 35. Masjid (`mosque-to-100`)
- **Index**: `#99`
- **Address**: 747 Don Mills Rd., North York, ON M3C, Canada (North York)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `GENERIC_NAME`
- **Review Trigger**: Generic title (e.g. 'Masjid') without clear organizational disambiguation.

### 36. Fatih Mosque - UCMA Head Office (`mosque-to-102`)
- **Index**: `#101`
- **Address**: 182 Rhodes Ave, Toronto, ON M4L 3A1, Canada (Toronto)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`, `SHARED_ADDRESS`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 37. Mushallah darusalam (`mosque-to-103`)
- **Index**: `#102`
- **Address**: 2630 Kipling Ave, Etobicoke, ON M9V 4B9, Canada (Etobicoke)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 38. Khalid Youth Program (`mosque-to-107`)
- **Index**: `#106`
- **Address**: 16 Bethridge Rd, Etobicoke, ON M9W 1N1, Canada (Etobicoke)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 39. United Muslim Association (`mosque-to-108`)
- **Index**: `#107`
- **Address**: 130 Westmore Dr, Etobicoke, ON M9V 3Y6, Canada (Etobicoke)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 40. Nigerian Canadian Muslim Association (`mosque-to-111`)
- **Index**: `#110`
- **Address**: 190 Milvan Dr Unit 7, North York, ON M9L 1Z9, Canada (North York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 41. Agincourt Muslim Association (`mosque-to-113`)
- **Index**: `#112`
- **Address**: 3609B Sheppard Ave E, Scarborough, ON M1T 3K8, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 42. Al-Madrasathul Ihsaniyyah Madrasa (`mosque-to-116`)
- **Index**: `#115`
- **Address**: 463 Gerrard St E, Toronto, ON M5A 2H1, Canada (Toronto)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 43. Salaheddin Islamic Centre (`mosque-to-119`)
- **Index**: `#118`
- **Address**: 741 Kennedy Rd, Scarborough, ON M1K 2C6, Canada (Scarborough)
- **Classification**: `ISLAMIC_CENTER`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 44. Khalid Bin Al-Walid Mosque (`mosque-to-120`)
- **Index**: `#119`
- **Address**: 16 Bethridge Rd, Etobicoke, ON M9W 1N1, Canada (Etobicoke)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 45. Islamic Iranian Centre of Imam Ali (`mosque-to-121`)
- **Index**: `#120`
- **Address**: 120 Bermondsey Rd, North York, ON M4A 1X5, Canada (North York)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 46. Quraan and Hadeeth Society of Canada (`mosque-to-125`)
- **Index**: `#124`
- **Address**: 2183A Lawrence Ave E, Scarborough, ON M1P 2P8, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 47. Afghan Canadian Islamic Community (`mosque-to-127`)
- **Index**: `#126`
- **Address**: 22 Hobson Ave, North York, ON M4A 1Y2, Canada (North York)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 48. Masjid Abu Bakr (`mosque-to-134`)
- **Index**: `#133`
- **Address**: 2665 Lawrence Ave E, Scarborough, ON M1P 2S2, Canada (Scarborough)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 49. NAMF (`mosque-to-136`)
- **Index**: `#135`
- **Address**: 4168 Finch Ave E, Scarborough, ON M1S 5H6, Canada (Scarborough)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 50. Abdullah Ibn Abbas Islamic Centre (`mosque-to-137`)
- **Index**: `#136`
- **Address**: 2624 Danforth Ave, Toronto, ON M4C 1L7, Canada (Toronto)
- **Classification**: `ISLAMIC_CENTER`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_MOVED_LOCATION`
- **Review Trigger**: Evidence indicates this facility has relocated to another address.

### 51. Baitul Mukarram Islamic Society (`mosque-to-139`)
- **Index**: `#138`
- **Address**: 3340 Danforth Ave, Scarborough, ON M1L 1C6, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 52. Masjid Salaheddin (`mosque-to-143`)
- **Index**: `#142`
- **Address**: 741 Kennedy Rd, Scarborough, ON M1K 2C6, Canada (Scarborough)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 53. The Sunatul Jamaat of Ontario Canada (`mosque-to-144`)
- **Index**: `#143`
- **Address**: 347 Danforth Rd, Scarborough, ON M1L 3X8, Canada (Scarborough)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 54. Musallah (`mosque-to-146`)
- **Index**: `#145`
- **Address**: 1145 Morningside Ave #40, Scarborough, ON M1B 0A7, Canada (Scarborough)
- **Classification**: `MUSALLA`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `GENERIC_NAME`, `PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE`, `SHARED_ADDRESS`
- **Review Trigger**: Generic title (e.g. 'Masjid') without clear organizational disambiguation.

### 55. Scarborough Muslim Association - Jame Abu Bakr Siddique Masjid (`mosque-to-147`)
- **Index**: `#146`
- **Address**: 2665 Lawrence Ave E, Scarborough, ON M1P 2S2, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 56. Al-Huda Muslim Society (`mosque-to-149`)
- **Index**: `#148`
- **Address**: 975 Kennedy Rd, Scarborough, ON M1P 2K5, Canada (Scarborough)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.


---

## 7. Excluded Records (1)

### 1. CML HealthCare Inc. (`mosque-to-62`)
- **Index**: `#61`
- **Address**: 491 Lawrence Ave W, North York, ON M5M 1C7, Canada
- **Classification**: `EXCLUDE`
- **Reason**: Classified as non-prayer entity (e.g. medical, commercial, or non-Islamic facility).

