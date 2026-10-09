import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import {
  validateRawDatasetContent,
  validateAllRawDatasets,
  computeSha256,
  TORONTO_EXPECTED_SHA256,
} from "../../../scripts/validate-raw-datasets";

describe("Raw Dataset Validator", () => {
  const referenceKeys = [
    "additionalInfo",
    "address",
    "categories",
    "categoryName",
    "cid",
    "city",
    "countryCode",
    "description",
    "imageCategories",
    "imageUrl",
    "imageUrls",
    "imagesCount",
    "language",
    "locatedIn",
    "location",
    "neighborhood",
    "openingHours",
    "ownerDescription",
    "phone",
    "placeId",
    "placesTags",
    "plusCode",
    "reviews",
    "reviewsCount",
    "reviewsDistribution",
    "reviewsTags",
    "state",
    "street",
    "subTitle",
    "title",
    "url",
  ];

  it("approves a completely valid mock dataset", () => {
    const raw = JSON.stringify([
      {
        title: "Masjid Test",
        address: "100 Bank St, Ottawa, ON K1P 5N5",
        location: { lat: 45.4215, lng: -75.6972 },
        placeId: "ChIJ_test1",
        state: "Ontario",
      },
    ]);

    const result = validateRawDatasetContent("ottawa", raw, referenceKeys);
    expect(result.isValidJson).toBe(true);
    expect(result.isArray).toBe(true);
    expect(result.recordCount).toBe(1);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it("handles malformed JSON gracefully without throwing", () => {
    const malformed = "[ { title: 'Broken' ";
    const result = validateRawDatasetContent("ottawa", malformed);
    expect(result.isValidJson).toBe(false);
    expect(result.isArray).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("Malformed JSON");
  });

  it("handles non-array root JSON gracefully", () => {
    const nonArray = JSON.stringify({ title: "Not an array" });
    const result = validateRawDatasetContent("ottawa", nonArray);
    expect(result.isValidJson).toBe(true);
    expect(result.isArray).toBe(false);
    expect(result.errors).toContain("Dataset root is not a JSON array");
  });

  it("tolerates missing optional fields (phone, website, openingHours, rating, postalCode)", () => {
    const record = [
      {
        title: "Minimal Masjid",
        address: "100 Minimal St, Ottawa, ON",
        location: { lat: 45.4, lng: -75.7 },
        placeId: "place_min_1",
      },
    ];
    const result = validateRawDatasetContent("ottawa", JSON.stringify(record));
    expect(result.errors).toHaveLength(0);
    expect(result.missingFieldsStats.noPhone).toBe(1);
    expect(result.missingFieldsStats.noWebsite).toBe(1);
    expect(result.missingFieldsStats.noOpeningHours).toBe(1);
    expect(result.missingFieldsStats.noRating).toBe(1);
    expect(result.missingFieldsStats.noPostalCode).toBe(1);
  });

  it("rejects records with invalid, NaN, or out-of-bounds coordinates", () => {
    const records = [
      {
        title: "NaN Coordinates Mosque",
        address: "123 Street",
        location: { lat: NaN, lng: -75.7 },
      },
      {
        title: "Missing Location Mosque",
        address: "124 Street",
      },
      {
        title: "Out of Bounds Lat Mosque",
        address: "125 Street",
        location: { lat: 150.0, lng: -75.7 },
      },
    ];
    const result = validateRawDatasetContent("ottawa", JSON.stringify(records));
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("flags geographic coordinate anomalies without throwing errors", () => {
    const record = [
      {
        title: "Out-of-city Mosque",
        address: "Far Away",
        location: { lat: 55.0, lng: -100.0 }, // Far outside Ottawa bounds
        placeId: "pid_far",
      },
    ];
    const result = validateRawDatasetContent("ottawa", JSON.stringify(record));
    expect(result.errors).toHaveLength(0);
    expect(result.coordinateAnomalies).toHaveLength(1);
    expect(result.coordinateAnomalies[0].title).toBe("Out-of-city Mosque");
  });

  it("detects duplicate placeIds and duplicate coordinates non-destructively", () => {
    const records = [
      {
        title: "Masjid A",
        address: "123 Main St",
        location: { lat: 45.4, lng: -75.7 },
        placeId: "dup_pid",
      },
      {
        title: "Masjid B",
        address: "456 Other St",
        location: { lat: 45.4, lng: -75.7 }, // Same coords
        placeId: "dup_pid", // Same placeId
      },
    ];
    const result = validateRawDatasetContent("ottawa", JSON.stringify(records));
    expect(result.potentialDuplicates.length).toBe(2);
    expect(result.potentialDuplicates.some((d) => d.type === "placeId")).toBe(true);
    expect(result.potentialDuplicates.some((d) => d.type === "coordinates")).toBe(true);
  });

  it("detects shared addresses non-destructively", () => {
    const records = [
      {
        title: "Masjid Al-Noor",
        address: "100 Community Rd, Ottawa, ON",
        location: { lat: 45.41, lng: -75.71 },
        placeId: "pid_1",
      },
      {
        title: "Islamic Youth Center",
        address: "100 Community Rd, Ottawa, ON",
        location: { lat: 45.41, lng: -75.71 },
        placeId: "pid_2",
      },
    ];
    const result = validateRawDatasetContent("ottawa", JSON.stringify(records));
    expect(result.sharedAddresses).toHaveLength(1);
    expect(result.sharedAddresses[0].count).toBe(2);
    expect(result.sharedAddresses[0].titles).toContain("Masjid Al-Noor");
    expect(result.sharedAddresses[0].titles).toContain("Islamic Youth Center");
  });

  it("accurately detects extra and missing schema fields against reference", () => {
    const records = [
      {
        title: "Calgary Mosque",
        address: "123 Alberta St",
        location: { lat: 51.05, lng: -114.07 },
        menu: "http://example.com/menu",
        ownerUpdates: [],
      },
    ];
    const result = validateRawDatasetContent("calgary", JSON.stringify(records), referenceKeys);
    expect(result.extraFields).toContain("menu");
    expect(result.extraFields).toContain("ownerUpdates");
    expect(result.missingReferenceFields).toContain("openingHours");
    expect(result.missingReferenceFields).toContain("categoryName");
  });

  it("verifies Toronto dataset SHA-256 immutability", () => {
    const rawTorontoPath = path.resolve(__dirname, "..", "..", "data", "raw", "toronto.json");
    expect(fs.existsSync(rawTorontoPath)).toBe(true);
    const buf = fs.readFileSync(rawTorontoPath);
    const hash = computeSha256(buf);
    expect(hash).toBe(TORONTO_EXPECTED_SHA256);
  });

  it("validates all 9 datasets in src/data/raw via validateAllRawDatasets", () => {
    const rawDir = path.resolve(__dirname, "..", "..", "data", "raw");
    const { results, referenceSha256Matches, allValid } = validateAllRawDatasets(rawDir);

    expect(referenceSha256Matches).toBe(true);
    expect(allValid).toBe(true);
    expect(results).toHaveLength(9);

    const toronto = results.find((r) => r.city === "toronto");
    expect(toronto?.recordCount).toBe(153);
    expect(toronto?.errors).toHaveLength(0);

    const ottawa = results.find((r) => r.city === "ottawa");
    expect(ottawa?.recordCount).toBe(51);
    expect(ottawa?.errors).toHaveLength(0);

    const mississauga = results.find((r) => r.city === "mississauga");
    expect(mississauga?.recordCount).toBe(46);
    expect(mississauga?.errors).toHaveLength(0);

    const brampton = results.find((r) => r.city === "brampton");
    expect(brampton?.recordCount).toBe(26);
    expect(brampton?.errors).toHaveLength(0);

    const vancouver = results.find((r) => r.city === "vancouver");
    expect(vancouver?.recordCount).toBe(14);
    expect(vancouver?.errors).toHaveLength(0);

    const calgary = results.find((r) => r.city === "calgary");
    expect(calgary?.recordCount).toBe(43);
    expect(calgary?.errors).toHaveLength(0);

    const edmonton = results.find((r) => r.city === "edmonton");
    expect(edmonton?.recordCount).toBe(54);
    expect(edmonton?.errors).toHaveLength(0);

    const montreal = results.find((r) => r.city === "montreal");
    expect(montreal?.recordCount).toBe(93);
    expect(montreal?.errors).toHaveLength(0);

    const winnipeg = results.find((r) => r.city === "winnipeg");
    expect(winnipeg?.recordCount).toBe(21);
    expect(winnipeg?.errors).toHaveLength(0);
  });
});
