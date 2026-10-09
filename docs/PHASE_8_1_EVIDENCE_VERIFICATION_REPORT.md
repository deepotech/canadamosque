# Phase 8.1 Evidence Verification Report — Targeted Audit

**Project**: Canada Mosque Near Me  
**Audit Execution Date**: 2026-10-08  
**Scope**: Exactly 37 records whose status changed in Phase 8 (26 Promoted + 11 Excluded)  
**Accounting**: 501 Raw = 331 Published + 158 Review Required + 12 Excluded  

---

## 1. Executive Summary

Phase 8.1 executed an independent, targeted evidence-verification audit across all **37 records** whose publication status changed in Phase 8.

Every Phase 8 determination was treated as an empirical hypothesis rather than ground truth. Authoritative external sources (official mosque websites, registered charities, educational portals, municipal databases, and Google place profiles) were consulted to establish verification status:
- **25 of 26 Promoted Records** were directly confirmed as active, physical places of worship with dedicated congregational prayer facilities (`KEEP_PUBLISHED_VERIFIED`).
- **1 Promoted Record** (*Afghan Husseini Islamic Center* in Edmonton, `mosque-edm-34`) was found to have a permanently closed commercial unit according to business directories, while its registered foundation functions primarily as a newcomer settlement charity without verified open prayer facilities. In adherence to strict safety rules, it was returned to review (`RETURN_TO_REVIEW`).
- **10 of 11 Excluded Records** were confirmed as non-worship false positives (`KEEP_EXCLUDED_VERIFIED`), including commercial taxi operations, private residential homes, an art studio, a cemetery grave site, and spam pins.
- **1 Excluded Record** (*GK Edmonton*, `mosque-edm-49`) was identified as the Edmonton Headquarters Jamatkhana (a private community prayer space for the Ismaili community), supporting exclusion from public congregational mosque directories (`KEEP_EXCLUDED_SUPPORTED`).

---

## 2. Scope & Target Derivation

The target set was derived deterministically from `src/data/review/phase8-review-results.json`:
- Published Targets: **26**
- Excluded Targets: **11**
- Total Target Records: **37**

Zero un-audited records were processed. The 157 records remaining in `REVIEW_REQUIRED` from Phase 8 remain untouched.

---

## 3. Methodology & External Source Policy

Every external source cited has verifiable provenance:
1. **Official Mosque / Islamic Center Websites**: (e.g. *mymasjid.ca*, *sayedakhadijacentre.com*, *tawheedcommunitycentre.com*, *islamicforumonline.com*, *vancouver.thebcma.com*, *baitunnur.org*, *hussainicalgary.com*, *oiacedmonton.ca*, *jammat.org*, *markaz.ca*, *masjiddaralarqam.com*, *centrealfalah.ca*, *mosqueemadani.com*, *almadinah-center.org*, *icqmontreal.com*, *miaonline.org*).
2. **Official Social Profiles**: Verified institutional pages.
3. **Institutional & Directory Sources**: PrayersConnect, 211 Ontario, Better Business Bureau.
4. **Zero Overclaim**: No prayer schedules, Iqamah, or Jummah timings were imported from external sources into raw datasets.

---

## 4. Verification Breakdown

### Published Targets (26 Records)
- **KEEP_PUBLISHED_VERIFIED**: 25 records (96.2%)
- **RETURN_TO_REVIEW**: 1 record (3.8% — *Afghan Husseini Islamic Center*)
- **KEEP_PUBLISHED_SUPPORTED**: 0 records
- **RETURN_TO_EXCLUDED**: 0 records

### Excluded Targets (11 Records)
- **KEEP_EXCLUDED_VERIFIED**: 10 records (90.9%)
- **KEEP_EXCLUDED_SUPPORTED**: 1 record (9.1% — *GK Edmonton* / Jamatkhana)
- **RETURN_TO_REVIEW**: 0 records
- **MOVE_TO_PUBLISHED**: 0 records

---

## 5. Classification & Duplicate Analysis

- **Classification Corrections**: All verified published entities accurately distinguish between `MOSQUE`, `ISLAMIC_CENTER`, `MUSALLA`, and `COMMUNITY_CENTER`.
- **Duplicate & Shared Location Analysis**: Co-located legitimate entities (e.g. *Masjid Ar-Rahmah* with Assunnah Muslims Association, *Masjid Ul-Haqq* with BCMA provincial office, *Mosquée Madani* with Académie An-Noor) were correctly classified as `SHARED_LOCATION_LEGITIMATE` without deduplication.

---

## 6. Canada Totals Post Phase 8.1

| Metric | Raw | Published | Review Required | Excluded | Accounting Sum |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **National Total** | **501** | **331** | **158** | **12** | **501 (100% Exact)** |

---

## 7. Raw Data & Toronto Protection

- **Toronto Raw Checksum**: `0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9` (**100% UNCHANGED**)
- **Toronto Baseline**: 96 Published, 56 Review-Required, 1 Excluded (**100% PRESERVED**)
- **Raw Files**: 0 bytes modified in `src/data/raw/*.json`
