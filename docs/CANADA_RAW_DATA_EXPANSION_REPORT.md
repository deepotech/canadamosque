# Canada Raw Data Expansion Report — Phase 6

**Generated:** 2026-10-08  
**Phase:** 6 — Canada Raw Data Expansion  
**Workspace:** `C:\Users\HP\Desktop\Canada Mosque Near Me`  
**Reference File:** `src/data/raw/toronto.json` (SHA-256: `0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9`)  

---

## Executive Summary

Phase 6 prepares, imports, audits, and validates raw scraped/exported datasets for 8 additional major Canadian metropolitan centers alongside the reference Toronto dataset. All 9 raw files are stored in `src/data/raw/` in their unmutated, raw form.

| City | Province | File | Records | File Size | SHA-256 Checksum | Valid Objects | Geo Anomalies | Shared Addrs | Status |
| :--- | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: |
| **Toronto** *(Ref)* | Ontario | `toronto.json` | 153 | 1,579,965 B | `0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9` | 153 | 0 | 12 | REFERENCE (UNTOUCHED) |
| **Ottawa** | Ontario | `ottawa.json` | 51 | 540,525 B | `0f948067e367b9a5d694d4f2a7ef34cc75a9371fa782b92a806d46d08375182e` | 51 | 0 | 4 | RAW / VALID |
| **Mississauga** | Ontario | `mississauga.json` | 46 | 484,018 B | `f01d8e29ec82ed9fc5ae18824f3a6d94db8188d2aae2ab0a89361a02ab2ad177` | 46 | 0 | 2 | RAW / VALID |
| **Brampton** | Ontario | `brampton.json` | 26 | 287,652 B | `acd37f054355d70b29b781b02ec471edbc1ed6df2aaf18e15fc42a2e87b99c54` | 26 | 0 | 0 | RAW / VALID |
| **Vancouver** | British Columbia | `vancouver.json` | 14 | 143,434 B | `5cf24e4922171f21812ea082e54446e2d3938c5f4ea7cf4d959de23a117c283a` | 14 | 0 | 1 | RAW / VALID |
| **Calgary** | Alberta | `calgary.json` | 43 | 428,097 B | `30bd0d8a814de07bbfab7596d7db3e1f4b17743000a50128df7351e81ed2dea3` | 43 | 0 | 4 | RAW / VALID |
| **Edmonton** | Alberta | `edmonton.json` | 54 | 546,120 B | `8a55315efde5a46fdd47f9e249894f44720a21f813d8c8f49d0cc155ddacf8bd` | 54 | 0 | 3 | RAW / VALID |
| **Montreal** | Quebec | `montreal.json` | 93 | 952,762 B | `9d3a9d75932d68f3d7ec6dccda5128a6ff2eed639446c3df1ede7beabadca022` | 93 | 0 | 5 | RAW / VALID |
| **Winnipeg** | Manitoba | `winnipeg.json` | 21 | 224,907 B | `f375e01470396e159231d1a0aa8d0b87f8d92475eb124a466e6cbbcfd96d9963` | 21 | 0 | 1 | RAW / VALID |
| **TOTAL** | — | **9 files** | **501** | **5,187,480 B** | — | **501** | **0** | **32** | **PASS** |

---

## Detailed Dataset Reports

### 1. Toronto (Reference Dataset)
1. **File:** `src/data/raw/toronto.json`
2. **Record count:** 153
3. **File size:** 1,579,965 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 153/153 (100%)
   - Place ID: 153/153 (100%)
   - Phone: 118/153 (77.1%)
   - Website: 121/153 (79.1%)
   - Opening Hours: 107/153 (69.9%)
   - Reviews / Rating: 147/153 (96.1%)
   - Additional Info: 150/153 (98.0%)
   - Images: 149/153 (97.4%)
6. **Missing fields:**
   - Missing phone: 35
   - Missing website: 32
   - Missing opening hours: 46
   - Missing review ratings: 6
   - Missing postalCode (property absent on records, embedded in address): 153
7. **Coordinate validity:** 153/153 records have valid numeric `location.lat` and `location.lng`.
8. **Geographic anomalies:** 0 out-of-bounds coordinates. All points fall within the Greater Toronto Area (lat 43.58 to 43.85, lng -79.62 to -79.13).
9. **Potential duplicates:** 2 coordinate duplicate pairs (representing shared multi-unit facilities).
10. **Shared addresses:** 12 shared physical addresses (e.g., 20 Queen Elizabeth Blvd, 1827 Carling, etc.).
11. **Suspicious/closure signals:** Ingestion pipeline previously detected temporary closures, moves, and non-mosque classifications handled via review queue.
12. **Province distribution:**
    - Ontario: 153 (100%)
13. **City distribution:**
    - (missing / null): 120 (addresses retain municipal borough e.g. Scarborough, Etobicoke, North York)
    - Toronto: 31
    - Markham: 1
    - North York: 1
14. **Category distribution:**
    - Mosque: 146
    - Community center: 3
    - Religious organization: 2
    - Medical Center: 1
    - Community school: 1
15. **Source-language notes:** English primary language (`language: "en"`).
16. **Extra fields not present in Toronto:** None (reference dataset).
17. **Fields expected from Toronto but missing:** None.
18. **Overall quality notes:** Reference dataset. Clean, rich Google Places export format.

---

### 2. Ottawa
1. **File:** `src/data/raw/ottawa.json`
2. **Record count:** 51
3. **File size:** 540,525 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 51/51 (100%)
   - Place ID: 51/51 (100%)
   - Phone: 38/51 (74.5%)
   - Website: 41/51 (80.4%)
   - Opening Hours: 30/51 (58.8%)
   - Reviews / Rating: 49/51 (96.1%)
   - Additional Info: 49/51 (96.1%)
   - Images: 50/51 (98.0%)
6. **Missing fields:**
   - Missing phone: 13
   - Missing website: 10
   - Missing opening hours: 21
   - Missing review ratings: 2
   - Missing postalCode: 51 (embedded in address string)
7. **Coordinate validity:** 51/51 valid numeric coordinates.
8. **Geographic anomalies:** 0. Richmond Islamic Community Ottawa (`lat: 45.1937112`, `lng: -75.842143`) is within the rural southwest boundary of the amalgamated City of Ottawa.
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 4 shared address locations:
    - `1216 Hunt Club Rd, Ottawa, ON K1V 2P1`: AMA Community Centre, Masjid Ar-Rahmah, Assunnah Muslims Association (3 records)
    - `251 Northwestern Ave, Ottawa, ON K1A 0K9`: Ottawa Muslim Association, Premier Street Mosque (2 records)
    - `117 Mann Ave, Ottawa, ON K1N 5A4`: Islamic Society of Sandy Hill, Taqwa mosque (2 records)
    - `3856 Old Richmond Rd, Nepean, ON K2H 5C4`: Imamia Mosque Masjid, ISIA Ottawa (2 records)
11. **Suspicious/closure signals:** 3 records have user reviews citing possible closure/relocation:
    - *SNMC Mosque*
    - *Richmond Islamic Community Ottawa*
    - *Alshareef Islamic Centre*
12. **Province distribution:**
    - Ontario: 49
    - ON: 2
13. **City distribution:**
    - Ottawa: 30
    - Nepean: 8
    - Gloucester: 4
    - Orléans: 4
    - Edwards: 1
    - Kanata: 1
    - Stittsville: 1
    - Richmond: 1
    - Cumberland: 1
14. **Category distribution:**
    - Mosque: 49
    - Musalla: 1
    - Youth center: 1
15. **Source-language notes:** Primarily English (`en`), with mixed bilingual place names (e.g., Orléans).
16. **Extra fields not present in Toronto:** None.
17. **Fields expected from Toronto but missing:** None.
18. **Overall quality notes:** Very clean raw export. High alignment with Toronto raw schema.

---

### 3. Mississauga
1. **File:** `src/data/raw/mississauga.json`
2. **Record count:** 46
3. **File size:** 484,018 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 46/46 (100%)
   - Place ID: 46/46 (100%)
   - Phone: 40/46 (87.0%)
   - Website: 41/46 (89.1%)
   - Opening Hours: 32/46 (69.6%)
   - Reviews / Rating: 43/46 (93.5%)
   - Additional Info: 43/46 (93.5%)
   - Images: 44/46 (95.7%)
6. **Missing fields:**
   - Missing phone: 6
   - Missing website: 5
   - Missing opening hours: 14
   - Missing review ratings: 3
7. **Coordinate validity:** 46/46 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates. All records fall strictly within Mississauga municipal boundaries (lat 43.50 to 43.72, lng -79.76 to -79.55).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 2 shared address locations:
    - `3490 Mavis Rd, Mississauga, ON L5C 1T8`: Muslim Welfare Center - Mussalah Al-Abbas, Muslim Welfare Canada (Food Bank & Musalla)
    - `5761 Coopers Ave, Mississauga, ON L4Z 0C5`: IONA convention, Jame Masjid
11. **Suspicious/closure signals:** 4 records have review flags regarding operational status:
    - *Mississauga Muslim Community Center*
    - *Jamia Riyadhul-Jannah*
    - *Aalulbayt Mosque*
    - *NOOR UL QURAN CANADA*
12. **Province distribution:**
    - Ontario: 45
    - ON: 1
13. **City distribution:**
    - Mississauga: 46 (100%)
14. **Category distribution:**
    - Mosque: 41
    - Religious institution: 2
    - Community center: 1
    - Food bank: 1
    - Non-profit organization: 1
15. **Source-language notes:** English (`en`).
16. **Extra fields not present in Toronto:** None.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours` (rare optional field in Toronto).
18. **Overall quality notes:** Excellent density and data completeness. High proportion of mosques with websites and contact phone numbers.

---

### 4. Brampton
1. **File:** `src/data/raw/brampton.json`
2. **Record count:** 26
3. **File size:** 287,652 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 26/26 (100%)
   - Place ID: 26/26 (100%)
   - Phone: 23/26 (88.5%)
   - Website: 24/26 (92.3%)
   - Opening Hours: 18/26 (69.2%)
   - Reviews / Rating: 25/26 (96.2%)
   - Additional Info: 25/26 (96.2%)
   - Images: 25/26 (96.2%)
6. **Missing fields:**
   - Missing phone: 3
   - Missing website: 2
   - Missing opening hours: 8
   - Missing review ratings: 1
7. **Coordinate validity:** 26/26 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 43.66 to 43.78, lng -79.80 to -79.66).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 0 shared addresses.
11. **Suspicious/closure signals:** 2 records have reviews discussing potential relocation:
    - *NICE North-Valley Islamic Centre*
    - *Yaseen Musalla*
12. **Province distribution:**
    - Ontario: 22
    - ON: 3
    - (missing): 1
13. **City distribution:**
    - Brampton: 25
    - (missing): 1
14. **Category distribution:**
    - Mosque: 24
    - Community center: 2
15. **Source-language notes:** English (`en`).
16. **Extra fields not present in Toronto:** None.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours`.
18. **Overall quality notes:** Compact and consistent dataset. 92% of records possess active websites.

---

### 5. Vancouver
1. **File:** `src/data/raw/vancouver.json`
2. **Record count:** 14
3. **File size:** 143,434 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 14/14 (100%)
   - Place ID: 14/14 (100%)
   - Phone: 11/14 (78.6%)
   - Website: 10/14 (71.4%)
   - Opening Hours: 8/14 (57.1%)
   - Reviews / Rating: 13/14 (92.9%)
   - Additional Info: 14/14 (100%)
   - Images: 14/14 (100%)
6. **Missing fields:**
   - Missing phone: 3
   - Missing website: 4
   - Missing opening hours: 6
   - Missing review ratings: 1
7. **Coordinate validity:** 14/14 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 49.20 to 49.29, lng -123.16 to -123.05).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 1 shared address:
    - `4162 Welwyn St, Vancouver, BC V5N 3Z2`: British Columbia Muslim Association, Masjid Ul-Haqq (2 records)
11. **Suspicious/closure signals:** 0 records with closure flags.
12. **Province distribution:**
    - British Columbia: 14 (100%)
13. **City distribution:**
    - Vancouver: 14 (100%)
14. **Category distribution:**
    - Mosque: 11
    - Community center: 3
15. **Source-language notes:** English (`en`).
16. **Extra fields not present in Toronto:** None.
17. **Fields expected from Toronto but missing:** None.
18. **Overall quality notes:** Clean Vancouver city core dataset. Note that Greater Vancouver suburban municipalities (Surrey, Richmond, Burnaby) are distinct jurisdictions and excluded from this city-proper file.

---

### 6. Calgary
1. **File:** `src/data/raw/calgary.json`
2. **Record count:** 43
3. **File size:** 428,097 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 43/43 (100%)
   - Place ID: 43/43 (100%)
   - Postal Code: 43/43 (100% explicit field populated)
   - Phone: 31/43 (72.1%)
   - Website: 30/43 (69.8%)
   - Opening Hours: 24/43 (55.8%)
   - Reviews / Rating: 40/43 (93.0%)
   - Additional Info: 39/43 (90.7%)
   - Images: 40/43 (93.0%)
6. **Missing fields:**
   - Missing phone: 12
   - Missing website: 13
   - Missing opening hours: 19
   - Missing review ratings: 3
7. **Coordinate validity:** 43/43 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 50.89 to 51.17, lng -114.21 to -113.93).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 4 shared address locations:
    - `4128 6 St NE, Calgary, AB T2E 8C8`: Islamic Information Society of Calgary (IISC), Dar Al Hijra ( Halaqa centre)
    - `5615 14 Ave SW, Calgary, AB T3H 4R5`: Calgary Islamic Centre SW Masjid (CICSW) - Mosque, Muslim Council Of Calgary
    - `4353 54 Ave NE, Calgary, AB T3J 4L3`: Baitun-Nur Mosque Ahmadiyya Muslim Jamaat, Ahmadiyya Movement In Islam
    - `4755 34 St SE, Calgary, AB T2B 3B3`: Shia Muslim Association Of Calgary, Hussaini Association of Calgary (Imambargah)
11. **Suspicious/closure signals:** 3 records with reviewer comments regarding operational status:
    - *Muslim Council Of Calgary*
    - *Calgary Downtown Musalla (MCC)*
    - *Shia Muslim Association Of Calgary*
12. **Province distribution:**
    - Alberta: 43 (100%)
13. **City distribution:**
    - Calgary: 43 (100%)
14. **Category distribution:**
    - Mosque: 42
    - Non-profit organization: 1
15. **Source-language notes:** English (`en`).
16. **Extra fields not present in Toronto:** `menu`, `ownerUpdates`, `postalCode`, `questionsAndAnswers`. All preserved faithfully in raw.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours`.
18. **Overall quality notes:** Rich dataset with 100% explicit `postalCode` field coverage.

---

### 7. Edmonton
1. **File:** `src/data/raw/edmonton.json`
2. **Record count:** 54
3. **File size:** 546,120 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 54/54 (100%)
   - Place ID: 54/54 (100%)
   - Postal Code: 53/54 (98.1%)
   - Phone: 44/54 (81.5%)
   - Website: 45/54 (83.3%)
   - Opening Hours: 36/54 (66.7%)
   - Reviews / Rating: 50/54 (92.6%)
   - Additional Info: 53/54 (98.1%)
   - Images: 53/54 (98.1%)
6. **Missing fields:**
   - Missing phone: 10
   - Missing website: 9
   - Missing opening hours: 18
   - Missing review ratings: 4
7. **Coordinate validity:** 54/54 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 53.41 to 53.64, lng -113.67 to -113.34).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 3 shared address locations:
    - `7005 98 Ave NW, Edmonton, AB T6A 2T8`: AMJ Edmonton, Baitul Hadi Ahmadiyya Muslim Jamaat
    - `11219 180 St NW, Edmonton, AB T5S 0B4`: Afghan Husseini Islamic Center (Shia), Afghan Hussaini Charitable Foundation Of Alberta
    - `13070 113 St NW, Edmonton, AB T5E 5A8`: Canadian Islamic Center - Al Rashid Mosque (Masjid), Islamic Academy Project
11. **Suspicious/closure signals:** 1 record with review mentions:
    - *Masjed Dar Al-Arqam*
12. **Province distribution:**
    - Alberta: 53
    - (missing): 1
13. **City distribution:**
    - Edmonton: 53
    - (missing): 1
14. **Category distribution:**
    - Mosque: 50
    - Elementary school: 1
    - Musalla: 1
    - Religious organization: 1
    - Special education school: 1
15. **Source-language notes:** English (`en`). Contains historical Al-Rashid Mosque (oldest mosque in Canada).
16. **Extra fields not present in Toronto:** `menu`, `ownerUpdates`, `postalCode`, `questionsAndAnswers`.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours`.
18. **Overall quality notes:** Comprehensive collection of Edmonton mosques, Islamic schools, and organizations.

---

### 8. Montreal
1. **File:** `src/data/raw/montreal.json`
2. **Record count:** 93
3. **File size:** 952,762 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 93/93 (100%)
   - Place ID: 93/93 (100%)
   - Postal Code: 93/93 (100%)
   - Phone: 66/93 (71.0%)
   - Website: 62/93 (66.7%)
   - Opening Hours: 50/93 (53.8%)
   - Reviews / Rating: 90/93 (96.8%)
   - Additional Info: 89/93 (95.7%)
   - Images: 92/93 (98.9%)
6. **Missing fields:**
   - Missing phone: 27
   - Missing website: 31
   - Missing opening hours: 43
   - Missing review ratings: 3
7. **Coordinate validity:** 93/93 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 45.43 to 45.64, lng -73.88 to -73.54).
9. **Potential duplicates:** 1 coordinate duplicate pair:
   - `lat: 45.543406, lng: -73.648302`: Mosquée Al falah Ahuntsic and Centre Islamic Ahuntsic Cartierville (both at 1 Rue Legendre O).
10. **Shared addresses:** 5 shared address locations:
    - `6550 Av. de Darlington, Montréal, QC H3S 1L4`: Association Du Centre Cote Des, Mosquée Al Falah
    - `12080 Blvd. Laurentien, Montreal, Quebec H4K 1M9`: Académie An-Noor, Mosquée Madani
    - `1 Rue Legendre O, Montréal, QC H2N 1G9`: Mosquée Al falah Ahuntsic, Centre Islamic Ahuntsic Cartierville
    - `615 Rue Belmont, Montréal, QC H3B 2L8`: Canadian Institute of Islamic Civilization CIIC - MAC, Mosque Al Hadara
    - `6130 Rue Jean-Talon E, Saint-Léonard, QC H1S 1M7`: Mosquée Centre Al-Tawheed, Premier Masjid altawheed
11. **Suspicious/closure signals:** 1 record with review mentions:
    - *Masjid Al-Balkan*
12. **Province distribution:**
    - Quebec: 93 (100%)
13. **City distribution:**
    - Montreal: 70
    - Montréal-Nord: 7
    - Saint-Leonard: 5
    - Lachine: 3
    - Pierrefonds: 3
    - Saint-Laurent: 2
    - Lasalle: 2
    - Verdun: 1
14. **Category distribution:**
    - Mosque: 89
    - Cultural center: 1
    - Place of worship: 1
    - Religious institution: 1
    - Religious organization: 1
15. **Source-language notes:** Predominantly French (`fr`) titles and address elements (e.g., "Mosquée", "Rue", "Boulevard", "Avenue") with Arabic names in transliterated French/English formats. **Raw source text is 100% un-translated and preserved.**
16. **Extra fields not present in Toronto:** `menu`, `ownerUpdates`, `postalCode`, `questionsAndAnswers`.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours`.
18. **Overall quality notes:** Large, rich dataset representing the metropolitan Montreal Muslim community with strong linguistic preservation.

---

### 9. Winnipeg
1. **File:** `src/data/raw/winnipeg.json`
2. **Record count:** 21
3. **File size:** 224,907 bytes
4. **JSON validity:** Valid JSON array of objects (100% compliant)
5. **Field coverage:**
   - Coordinates: 21/21 (100%)
   - Place ID: 21/21 (100%)
   - Postal Code: 21/21 (100%)
   - Phone: 16/21 (76.2%)
   - Website: 15/21 (71.4%)
   - Opening Hours: 10/21 (47.6%)
   - Reviews / Rating: 21/21 (100%)
   - Additional Info: 20/21 (95.2%)
   - Images: 21/21 (100%)
6. **Missing fields:**
   - Missing phone: 5
   - Missing website: 6
   - Missing opening hours: 11
   - Missing review ratings: 0 (100% coverage)
7. **Coordinate validity:** 21/21 valid numeric coordinates.
8. **Geographic anomalies:** 0 out-of-bounds coordinates (lat 49.79 to 49.95, lng -97.23 to -97.09).
9. **Potential duplicates:** 0 duplicate placeIds; 0 duplicate exact coordinate pairs.
10. **Shared addresses:** 1 shared address:
    - `348 Ross Ave, Winnipeg, MB R3A 0L4`: Al - Huda masjid, Pakistan Centre Masjid
11. **Suspicious/closure signals:** 1 record with review mentions:
    - *Winnipeg Rahma Islamic Centre*
12. **Province distribution:**
    - Manitoba: 19
    - MB: 2
13. **City distribution:**
    - Winnipeg: 21 (100%)
14. **Category distribution:**
    - Mosque: 21 (100%)
15. **Source-language notes:** English (`en`).
16. **Extra fields not present in Toronto:** `menu`, `ownerUpdates`, `postalCode`, `questionsAndAnswers`.
17. **Fields expected from Toronto but missing:** `additionalOpeningHours`.
18. **Overall quality notes:** 100% of records have reviews, ratings, and placeIds. Extremely focused and well-defined dataset.

---

## Conclusion & Ingestion Readiness

All 8 expansion datasets have been safely staged into `src/data/raw/` alongside `toronto.json`. 
- **Total Canadian raw records across 9 datasets:** 501
- **Toronto SHA-256 hash:** Unchanged (`0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9`)
- **Isolation:** None of the 8 expansion datasets are connected to the live publication build or search indexes in Phase 6.
