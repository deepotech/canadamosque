# Raw Schema Compatibility Report — Phase 6

**Generated:** 2026-10-08  
**Reference Dataset:** `src/data/raw/toronto.json`  
**Target Datasets Compared:**
- `ottawa.json`
- `mississauga.json`
- `brampton.json`
- `vancouver.json`
- `calgary.json`
- `edmonton.json`
- `montreal.json`
- `winnipeg.json`

---

## 1. Top-Level Field Comparison Matrix

The table below catalogs field availability across the 9 Canadian raw datasets:

| Field Name | Toronto (Ref) | Ottawa | Mississauga | Brampton | Vancouver | Calgary | Edmonton | Montreal | Winnipeg | Type |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `title` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `address` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `location` (`lat`, `lng`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `object` |
| `placeId` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `categories` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string[]` |
| `categoryName` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `cid` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `city` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `countryCode` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `description` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `imageCategories` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string[]` |
| `imageUrl` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `imageUrls` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string[]` |
| `imagesCount` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `number` |
| `language` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `locatedIn` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `neighborhood` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `openingHours` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `array \| null` |
| `ownerDescription` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `phone` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `placesTags` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string[]` |
| `plusCode` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `reviews` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `object[]` |
| `reviewsCount` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `number` |
| `reviewsDistribution` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `object` |
| `reviewsTags` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string[]` |
| `state` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `street` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `subTitle` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `url` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string` |
| `website` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `additionalInfo` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `object` |
| `additionalOpeningHours` | ✓ (rare) | — | — | — | — | — | — | — | — | `object[] \| null` |
| `postalCode` | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | `string` |
| `menu` | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | `string \| null` |
| `ownerUpdates` | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | `array` |
| `questionsAndAnswers` | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | `array` |

---

## 2. Structural Compatibility Breakdown

### A. Identical Fields (Core Schema)
The following 31 fields are shared across **all** 9 datasets with identical types and conventions:
1. `title`: Primary name string.
2. `address`: Full human-readable street address formatted by Google Places.
3. `location`: Object `{ lat: number, lng: number }`. Numeric floats conforming to WGS84.
4. `placeId`: Google Place ID (alphanumeric string starting with `ChIJ...`).
5. `cid`: Unique customer ID string.
6. `categories`: Array of category strings (e.g. `["Mosque"]`).
7. `categoryName`: Primary category string (e.g. `"Mosque"`, `"Community center"`).
8. `phone`: Phone number string in domestic/international format or empty string `""`.
9. `website`: URL string or null.
10. `reviewsCount`: Numeric count of total user reviews.
11. `reviewsDistribution`: Object mapping star counts `{ oneStar, twoStar, threeStar, fourStar, fiveStar }`.
12. `reviews`: Array of individual user reviews with sub-fields (`text`, `stars`, `publishAt`, `reviewerPhotoUrl`, etc.).
13. `reviewsTags`: Array of tags extracted from reviews.
14. `placesTags`: Array of categorical tags.
15. `countryCode`: ISO 3166-1 alpha-2 string (`"CA"` across all datasets).
16. `language`: Language code string (`"en"` default, French text in Quebec files).
17. `openingHours`: Array of `{ day: string, hours: string }`.
18. `imageCategories`: Array of category strings (e.g., `["All", "Street View & 360°", "Interior"]`).
19. `imageUrl`: Primary display photo URL.
20. `imageUrls`: Array of full-resolution photo URLs.
21. `imagesCount`: Numeric count of available images.
22. `url`: Google Maps place URL.
23. `state`: Canadian province/territory string (`"Ontario"`, `"Alberta"`, `"Quebec"`, `"British Columbia"`, `"Manitoba"`).
24. `city`: Municipal name string (or null when embedded in address).
25. `street`: Street portion of address.
26. `neighborhood`: Local neighborhood or district name.
27. `subTitle`: Secondary title / status indicator (frequently null).
28. `description`: Editorial description (frequently null).
29. `ownerDescription`: Verified owner business summary (frequently null).
30. `locatedIn`: Enclosing building / complex name (or null).
31. `plusCode`: Global Open Location Code string.

### B. Nested Object Structures

#### 1. `location`
- Structure: `{ lat: number, lng: number }`
- Type: Numeric float across all 501 records.
- Nullability: 0% null. All 501 records contain non-null numeric latitude and longitude.

#### 2. `openingHours`
- Structure: Array of 7 day objects:
  ```json
  [
    { "day": "Monday", "hours": "Closed" },
    { "day": "Friday", "hours": "1 to 3 PM" }
  ]
  ```
- Compatibility: All 9 datasets use the exact same schema.
- Nullability: Missing or null for locations that do not publish fixed hours on Google Maps.

#### 3. `additionalInfo` (Facilities, Parking, Accessibility, Restrooms)
- Structure: Key-value map where each value is an array of single-key boolean or string objects:
  ```json
  "additionalInfo": {
    "Accessibility": [
      { "Wheelchair accessible entrance": true },
      { "Wheelchair accessible parking lot": true }
    ],
    "Amenities": [
      { "Restroom": true }
    ],
    "Parking": [
      { "Free parking lot": true },
      { "Free street parking": true }
    ]
  }
  ```
- Compatibility: Identical representation in all 9 datasets. Future normalizers can safely query `additionalInfo?.Amenities` and `additionalInfo?.Accessibility` uniformly.

#### 4. Photos / Images
- `imageUrl`: string URL (first thumbnail).
- `imageUrls`: `string[]` (all photo URLs).
- `imageCategories`: `string[]` (categories like `"All"`, `"Videos"`, `"Inside"`).
- `imagesCount`: integer count.
- Compatibility: 100% identical across all 9 datasets.

#### 5. User Reviews (`reviews`)
- Structure:
  ```json
  {
    "reviewerId": "1124...",
    "reviewerUrl": "https://...",
    "name": "...",
    "reviewerNumberOfReviews": 44,
    "isLocalGuide": true,
    "reviewerPhotoUrl": "https://...",
    "text": "...",
    "publishAt": "...",
    "publishedAtDate": "...",
    "likesCount": 0,
    "reviewId": "...",
    "reviewUrl": "...",
    "reviewOrigin": "Google",
    "stars": 5,
    "originalLanguage": "en"
  }
  ```
- Compatibility: 100% identical across all 9 datasets.

---

## 3. Additional Fields in Expansion Datasets

Four datasets (`calgary.json`, `edmonton.json`, `montreal.json`, `winnipeg.json`) contain 4 supplementary metadata fields:

| Field Name | Type | Purpose / Source Meaning | Ingestion Recommendation |
| :--- | :--- | :--- | :--- |
| `postalCode` | `string` | Explicitly parsed Canadian postal code (e.g. `"T2E 8C8"`) | **Ingest cleanly**: Can be prioritized over regex extraction from the `address` string in normalization. |
| `menu` | `string \| null` | Google link or food service info (rarely populated for mosques) | Safe to ignore or preserve in raw metadata. |
| `ownerUpdates` | `array` | Posts or announcements made by verified Google Business profile | Safe to preserve in raw audit history. |
| `questionsAndAnswers` | `array` | User Q&A threads from Google Maps profile | Valuable for community FAQ analysis in future phases. |

These fields are **additive** and non-breaking. The TypeScript interface `RawGooglePlaceRecord` in `src/domain/ingestion/raw-record.ts` is fully compatible with optional fields.

---

## 4. Linguistic & Regional Considerations

- **Montreal (`montreal.json`):**
  - Text preserves authentic French accents (e.g., "Montréal", "Mosquée", "L'Association").
  - Addresses follow Quebec street conventions (e.g., "1 Rue Legendre O", "6130 Rue Jean-Talon E").
  - Ingestion pipeline must **not** attempt naive translation or string stripping. Accented letters (é, è, ê, à, ç) are standard UTF-8 and safely supported.

---

## 5. Ingestion Pipeline Compatibility Conclusion

1. **Zero Pipeline Alterations Needed for Raw Form:**
   All 8 datasets share 100% structural compatibility with the reference `RawGooglePlaceRecord` interface.
2. **Deterministic Processing:**
   Any normalization script configured for Toronto can process any of the 8 expansion datasets with zero schema modifications.
3. **No Fabricated Data:**
   Missing fields remain `null` or omitted as originally exported by the source. No artificial placeholders were introduced.
