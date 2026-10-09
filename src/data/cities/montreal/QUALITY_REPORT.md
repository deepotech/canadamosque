# Montreal Dataset: Ingestion & Quality Audit Report

**Audit Run Date**: 2026-10-08T08:33:09.634Z  
**Dataset Source**: `montreal.json` (93 raw records preserved intact)  
**Geographic Area**: Montreal, Quebec, Canada  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **93** | 100.0% |
| **Published (Canonical)** | **60** | 64.5% |
| **Review Required** | **33** | 35.5% |
| **Excluded** | **0** | 0.0% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | 41 | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | 16 | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | 5 | Community center / Jamatkhana facility |
| **MUSALLA** | 5 | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | 0 | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | 8 | Association, society, council, or madrasa |
| **PRAYER_ROOM** | 0 | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | 18 | Insufficient or conflicting classification signals |
| **EXCLUDE** | 0 | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
| Montréal | 63 |
| Montreal | 14 |
| Saint-Léonard | 5 |
| Lachine | 3 |
| Pierrefonds | 3 |
| Saint-Laurent | 2 |
| Lasalle | 2 |
| Verdun | 1 |

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | 93 |
| **MISSING_HOURS** | 43 |
| **MISSING_PHONE** | 27 |
| **MISSING_WEBSITE** | 31 |
| **SHARED_ADDRESS** | 11 |
| **POSSIBLE_DUPLICATE** | 10 |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | 8 |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | 5 |
| **POSSIBLE_CLOSED_LOCATION** | 0 |
| **POSSIBLE_NOT_A_MOSQUE** | 0 |
| **GENERIC_NAME** | 0 |
| **CONTRADICTORY_INFORMATION** | 0 |
| **INVALID_COORDINATES** | 0 |
| **OUTSIDE_CANADA** | 0 |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: 5
- **Shared Physical Addresses / Plazas**: 6
- **Exact Duplicates**: 0

---

## 6. Records Requiring Manual Review (33)

### 1. Association Du Centre Cote Des (`mosque-mtl-1`)
- **Index**: `#0`
- **Address**: 6550 Av. de Darlington, Montréal, QC H3S 1L4, Canada (Montréal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 2. Académie An-Noor (`mosque-mtl-4`)
- **Index**: `#3`
- **Address**: 12080 Blvd. Laurentien, Montreal, Quebec H4K 1M9, Canada (Montreal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 3. Imam Hussain Charitable Foundation (`mosque-mtl-8`)
- **Index**: `#7`
- **Address**: 8270 Ave. Mountain Sights, Montreal, Quebec H4P 2B7, Canada (Montreal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 4. MSA McGill Office (`mosque-mtl-9`)
- **Index**: `#8`
- **Address**: SSMU Building, 3480 Rue McTavish Rm B-09, Montreal, Quebec H3A 1X9, Canada (Montreal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 5. Khoei (`mosque-mtl-10`)
- **Index**: `#9`
- **Address**: 7085 Chem. de la Côte-des-Neiges, Montréal, QC H3R 2M1, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 6. Markaz Hub E Rasool (`mosque-mtl-14`)
- **Index**: `#13`
- **Address**: 1006 Rue Jean-Talon O, Montréal, QC H3N 1T1, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 7. The Message of Islam Foundation (`mosque-mtl-16`)
- **Index**: `#15`
- **Address**: 10555 Boul. Saint-Laurent, Montréal, QC H3L 2P5, Canada (Montréal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 8. Mosquée Al falah Ahuntsic (`mosque-mtl-19`)
- **Index**: `#18`
- **Address**: 1 Rue Legendre O, Montréal, QC H2N 1G9, Canada (Montréal)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 9. Centre Islamic Ahuntsic Cartierville (`mosque-mtl-22`)
- **Index**: `#21`
- **Address**: 1 Rue Legendre O, Montréal, QC H2N 1G9, Canada (Montréal)
- **Classification**: `ISLAMIC_CENTER`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 10. Islamic Services of Quebec (`mosque-mtl-26`)
- **Index**: `#25`
- **Address**: 2038 Boul. Saint-Laurent, Montréal, QC H2X 2T2, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 11. Mosquée Madani (`mosque-mtl-29`)
- **Index**: `#28`
- **Address**: 12080 Blvd. Laurentien, Montreal, Quebec H4K 1M9, Canada (Montreal)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 12. Centre Faizan-E-Madina (`mosque-mtl-30`)
- **Index**: `#29`
- **Address**: 810 Rue Saint-Roch, Montréal, QC H3N 1L4, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 13. Al-Madinah Center (`mosque-mtl-36`)
- **Index**: `#35`
- **Address**: 1260 Rue Mackay, Montréal, QC H3G 2H4, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 14. Canadian Institute of Islamic Civilization CIIC - MAC (`mosque-mtl-42`)
- **Index**: `#41`
- **Address**: 615 Rue Belmont, Montréal, QC H3B 2L8, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 15. Mosquée Al-Omah Al-Islamiah (`mosque-mtl-44`)
- **Index**: `#43`
- **Address**: 1245 Rue Saint-Dominique, Montréal, QC H2X 2W4, Canada (Montréal)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 16. Islamic Centre of Quebec - El Markaz Islami (`mosque-mtl-48`)
- **Index**: `#47`
- **Address**: 2520 Chem. Laval, Saint-Laurent, QC H4L 3A1, Canada (Saint-Laurent)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 17. Madrassa Tawhid (`mosque-mtl-54`)
- **Index**: `#53`
- **Address**: 6955 Bd Lacordaire, Saint-Léonard, QC H1T 2K5, Canada (Saint-Léonard)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 18. Mosque Al Hadara (`mosque-mtl-55`)
- **Index**: `#54`
- **Address**: 615 Rue Belmont, Montréal, QC H3B 2L8, Canada (Montréal)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 19. Musqe (`mosque-mtl-56`)
- **Index**: `#55`
- **Address**: Ave L'Archevêque, Montréal-Nord, Quebec H1H 3A1, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 20. ASSOCIATION AL BAYAN (`mosque-mtl-61`)
- **Index**: `#60`
- **Address**: 2468 Rue Sauvé E, Montréal, QC H2B 1B9, Canada (Montréal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 21. Al tawhid (`mosque-mtl-65`)
- **Index**: `#64`
- **Address**: 5950 Rue Jean-Talon E, Saint-Léonard, QC H1S 1M2, Canada (Saint-Léonard)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 22. Association musulmane Dar Al Arkam (`mosque-mtl-66`)
- **Index**: `#65`
- **Address**: 3661 Rue Jean-Talon E, Montréal, QC H2A 1X8, Canada (Montréal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 23. Association Musulmane de Lachine (`mosque-mtl-75`)
- **Index**: `#74`
- **Address**: 1220 Rue Notre Dame, Lachine, QC H8S 2C4, Canada (Lachine)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 24. Al-sahabah Lachine Mosquée (`mosque-mtl-76`)
- **Index**: `#75`
- **Address**: 1212 Rue Notre Dame, Lachine, QC H8S 2C6, Canada (Lachine)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 25. Alhidayat Association (`mosque-mtl-77`)
- **Index**: `#76`
- **Address**: 5955 Rue Hochelaga, Montréal, QC H1N 1X3, Canada (Montréal)
- **Classification**: `ORGANIZATION`
- **Quality Flags**: `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `ORGANIZATION_WITHOUT_PRAYER_LOCATION`, `SHARED_ADDRESS`
- **Review Trigger**: Identified as an administrative association/organization without verified prayer sanctuary.

### 26. Enlightened Path Institute (EPIQC) (`mosque-mtl-79`)
- **Index**: `#78`
- **Address**: 4862 Saint-Charles Blvd, Pierrefonds, Quebec H9H 3E2, Canada (Pierrefonds)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 27. Mosquée Al-Amarab (`mosque-mtl-82`)
- **Index**: `#81`
- **Address**: 1245 Rue Saint-Dominique, Montréal, QC H2X 2Y1, Canada (Montréal)
- **Classification**: `MOSQUE`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `POSSIBLE_DUPLICATE`
- **Review Trigger**: Candidate duplicate detected sharing address/coordinates with high similarity to another record.

### 28. mchichini makaburini (`mosque-mtl-84`)
- **Index**: `#83`
- **Address**: 6512 Av. du Parc, Montréal, QC H2V 4H9, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 29. Taxi beaubien (`mosque-mtl-85`)
- **Index**: `#84`
- **Address**: 6604 Av. De Chateaubriand, Montréal, QC H2S 2N7, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 30. Yoshi grave site (`mosque-mtl-87`)
- **Index**: `#86`
- **Address**: 1260 Chem. Remembrance, Montréal, QC H3G 1A4, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 31. Jumah (`mosque-mtl-88`)
- **Index**: `#87`
- **Address**: 5690 Rue Fullum, Montréal, QC H2G 2H7, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_PHONE`, `MISSING_WEBSITE`, `MISSING_HOURS`, `MISSING_DESCRIPTION`, `SHARED_ADDRESS`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 32. Islamic Services Of Quebec (`mosque-mtl-90`)
- **Index**: `#89`
- **Address**: 6930 Av. Thomas Aubert, Montréal, QC H4K 1H8, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_HOURS`, `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.

### 33. Aisha Academy (`mosque-mtl-93`)
- **Index**: `#92`
- **Address**: 4640 Rue de Salaberry, Montréal, QC H4J 1H6, Canada (Montréal)
- **Classification**: `REVIEW_REQUIRED`
- **Quality Flags**: `MISSING_DESCRIPTION`
- **Review Trigger**: Tagged with category Mosque but title lacks explicit mosque/masjid indicators.


---

## 7. Excluded Records (0)


