import { describe, it, expect } from "vitest";
import {
  analyzeDuplicatesAndSharedLocations,
  calculateNameSimilarity,
  levenshteinDistance,
} from "../duplicate-analyzer";
import { ProcessedMosqueRecord } from "../types";

describe("Duplicate and Shared Location Analyzer", () => {
  it("computes name similarity and Levenshtein metrics accurately", () => {
    expect(
      calculateNameSimilarity(
        "Salaheddin Islamic Centre",
        "Masjid Salaheddin"
      )
    ).toBeGreaterThanOrEqual(0.25);
    expect(levenshteinDistance("Fatih Mosque", "Faith Mosque")).toBe(2);
  });

  it("detects possible duplicates with high name similarity at the same address", () => {
    const records: ProcessedMosqueRecord[] = [
      {
        id: "m-1",
        sourceIndex: 0,
        name: "Salaheddin Islamic Centre",
        slug: "salaheddin-islamic-centre",
        address: {
          raw: "741 Kennedy Rd, Scarborough, ON M1K 2C6, Canada",
          streetAddress: "741 Kennedy Rd",
          city: "Scarborough",
          province: "ON",
          postalCode: { raw: "M1K 2C6", normalized: "M1K 2C6" },
          country: "CA",
        },
        coordinates: { latitude: 43.7309, longitude: -79.266 },
        phone: null,
        website: null,
        classification: "ISLAMIC_CENTER",
        classificationReason: "Islamic Centre",
        openingHours: null,
        facilities: {
          wuduArea: null,
          womenPrayerSection: null,
          parkingAvailable: null,
          wheelchairAccessible: null,
          dailyPrayersHeld: null,
          notes: null,
        },
        qualityFlags: [],
        duplicateRelations: [],
        publicationStatus: "REVIEW_REQUIRED",
        publicationReason: "",
        provenance: {
          sourceFile: "toronto.json",
          sourceIndex: 0,
          cid: null,
          placeId: "place-1",
          rawCategoryName: "Mosque",
          rawCategories: ["Mosque"],
          rating: null,
          reviewsCount: null,
          ingestedAt: "2026-10-06T00:00:00Z",
        },
      },
      {
        id: "m-2",
        sourceIndex: 1,
        name: "Masjid Salaheddin",
        slug: "masjid-salaheddin",
        address: {
          raw: "741 Kennedy Rd, Scarborough, ON M1K 2C6, Canada",
          streetAddress: "741 Kennedy Rd",
          city: "Scarborough",
          province: "ON",
          postalCode: { raw: "M1K 2C6", normalized: "M1K 2C6" },
          country: "CA",
        },
        coordinates: { latitude: 43.7308, longitude: -79.2661 },
        phone: null,
        website: null,
        classification: "MOSQUE",
        classificationReason: "Mosque",
        openingHours: null,
        facilities: {
          wuduArea: null,
          womenPrayerSection: null,
          parkingAvailable: null,
          wheelchairAccessible: null,
          dailyPrayersHeld: null,
          notes: null,
        },
        qualityFlags: [],
        duplicateRelations: [],
        publicationStatus: "REVIEW_REQUIRED",
        publicationReason: "",
        provenance: {
          sourceFile: "toronto.json",
          sourceIndex: 1,
          cid: null,
          placeId: "place-2",
          rawCategoryName: "Mosque",
          rawCategories: ["Mosque"],
          rating: null,
          reviewsCount: null,
          ingestedAt: "2026-10-06T00:00:00Z",
        },
      },
    ];

    analyzeDuplicatesAndSharedLocations(records);

    expect(records[0].duplicateRelations).toHaveLength(1);
    expect(records[0].duplicateRelations[0].type).toBe("POSSIBLE_DUPLICATE");
    expect(records[0].qualityFlags).toContain("POSSIBLE_DUPLICATE");
    expect(records[1].qualityFlags).toContain("POSSIBLE_DUPLICATE");
  });

  it("detects shared locations when distinct organizations share an address", () => {
    const records: ProcessedMosqueRecord[] = [
      {
        id: "m-1",
        sourceIndex: 0,
        name: "Madinah Masjid",
        slug: "madinah-masjid",
        address: {
          raw: "1015 Danforth Ave, Toronto, ON M4J 1M1, Canada",
          streetAddress: "1015 Danforth Ave",
          city: "Toronto",
          province: "ON",
          postalCode: { raw: "M4J 1M1", normalized: "M4J 1M1" },
          country: "CA",
        },
        coordinates: { latitude: 43.6804, longitude: -79.3361 },
        phone: null,
        website: null,
        classification: "MOSQUE",
        classificationReason: "Mosque",
        openingHours: null,
        facilities: {
          wuduArea: null,
          womenPrayerSection: null,
          parkingAvailable: null,
          wheelchairAccessible: null,
          dailyPrayersHeld: null,
          notes: null,
        },
        qualityFlags: [],
        duplicateRelations: [],
        publicationStatus: "PUBLISHED",
        publicationReason: "",
        provenance: {
          sourceFile: "toronto.json",
          sourceIndex: 0,
          cid: null,
          placeId: "place-1",
          rawCategoryName: "Mosque",
          rawCategories: ["Mosque"],
          rating: null,
          reviewsCount: null,
          ingestedAt: "2026-10-06T00:00:00Z",
        },
      },
      {
        id: "m-2",
        sourceIndex: 1,
        name: "Hilal Committee of Metropolitan Toronto & Vicinity",
        slug: "hilal-committee",
        address: {
          raw: "1015 Danforth Ave, Toronto, ON M4J 1M1, Canada",
          streetAddress: "1015 Danforth Ave",
          city: "Toronto",
          province: "ON",
          postalCode: { raw: "M4J 1M1", normalized: "M4J 1M1" },
          country: "CA",
        },
        coordinates: { latitude: 43.6804, longitude: -79.336 },
        phone: null,
        website: null,
        classification: "ORGANIZATION",
        classificationReason: "Organization",
        openingHours: null,
        facilities: {
          wuduArea: null,
          womenPrayerSection: null,
          parkingAvailable: null,
          wheelchairAccessible: null,
          dailyPrayersHeld: null,
          notes: null,
        },
        qualityFlags: [],
        duplicateRelations: [],
        publicationStatus: "REVIEW_REQUIRED",
        publicationReason: "",
        provenance: {
          sourceFile: "toronto.json",
          sourceIndex: 1,
          cid: null,
          placeId: "place-2",
          rawCategoryName: "Mosque",
          rawCategories: ["Mosque"],
          rating: null,
          reviewsCount: null,
          ingestedAt: "2026-10-06T00:00:00Z",
        },
      },
    ];

    analyzeDuplicatesAndSharedLocations(records);

    expect(records[0].duplicateRelations[0].type).toBe("SHARED_LOCATION");
    expect(records[0].qualityFlags).toContain("SHARED_ADDRESS");
  });
});
