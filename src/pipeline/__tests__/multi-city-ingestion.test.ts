import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { SUPPORTED_CITIES, getCityConfig } from "../city-config";
import { runIngestionPipeline } from "../pipeline";
import { normalizeAddress } from "../normalizer";
import { classifyRecord } from "../classifier";
import { evaluateQualityFlags } from "../quality-checker";
import { determinePublicationStatus } from "../publication-decider";
import { runCityIngestion } from "../../../scripts/ingest-canada";

const TORONTO_EXPECTED_SHA256 = "0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9";

describe("Phase 7: Multi-City Ingestion & Classification Pipeline", () => {
  const rootDir = path.resolve(__dirname, "..", "..", "..");

  // 1. City configuration
  it("provides valid configurations for all 9 Canadian metropolitan cities", () => {
    const requiredCities = [
      "toronto",
      "ottawa",
      "mississauga",
      "brampton",
      "vancouver",
      "calgary",
      "edmonton",
      "montreal",
      "winnipeg",
    ];

    expect(Object.keys(SUPPORTED_CITIES)).toHaveLength(9);
    for (const c of requiredCities) {
      const cfg = getCityConfig(c);
      expect(cfg).toBeDefined();
      expect(cfg.city).toBeTruthy();
      expect(cfg.province).toBeTruthy();
      expect(cfg.idPrefix).toBeTruthy();
      expect(cfg.rawFilePath).toContain(`${c}.json`);
      expect(cfg.geoBounds.minLat).toBeLessThan(cfg.geoBounds.maxLat);
      expect(cfg.geoBounds.minLng).toBeLessThan(cfg.geoBounds.maxLng);
      expect(cfg.knownMunicipalities.length).toBeGreaterThan(0);
    }
  });

  // 2. Raw file resolution
  it("resolves and reads raw files for every configured city without throwing", () => {
    for (const cfg of Object.values(SUPPORTED_CITIES)) {
      const rawPath = path.resolve(rootDir, cfg.rawFilePath);
      expect(fs.existsSync(rawPath), `Raw file must exist: ${rawPath}`).toBe(true);
      const content = fs.readFileSync(rawPath, "utf8");
      const parsed = JSON.parse(content);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    }
  });

  // 3. Province validation
  it("validates Canadian provinces and flags province mismatches", () => {
    const calgaryCfg = getCityConfig("calgary"); // Expected Alberta (AB)

    const matchingRecord = {
      title: "Calgary Islamic Centre",
      address: "123 Alberta St, Calgary, AB",
      state: "Alberta",
      location: { lat: 51.05, lng: -114.07 },
    };
    const flagsValid = evaluateQualityFlags(matchingRecord, "MOSQUE", calgaryCfg);
    expect(flagsValid).not.toContain("PROVINCE_MISMATCH");

    const mismatchRecord = {
      title: "Mismatched Mosque",
      address: "123 Ontario St, Calgary, AB",
      state: "Ontario", // Wrong province for Calgary dataset!
      location: { lat: 51.05, lng: -114.07 },
    };
    const flagsInvalid = evaluateQualityFlags(mismatchRecord, "MOSQUE", calgaryCfg);
    expect(flagsInvalid).toContain("PROVINCE_MISMATCH");
  });

  // 4. Normalization
  it("normalizes addresses accurately with respect to city configuration", () => {
    const mtlCfg = getCityConfig("montreal");
    const addr = normalizeAddress(
      "1 Rue Legendre O, Montréal, QC H2N 1G9, Canada",
      null,
      mtlCfg
    );
    expect(addr.city).toBe("Montréal");
    expect(addr.province).toBe("QC");
    expect(addr.country).toBe("CA");
    expect(addr.postalCode.normalized).toBe("H2N 1G9");

    const ottCfg = getCityConfig("ottawa");
    const ottAddr = normalizeAddress(
      "3856 Old Richmond Rd, Nepean, ON K2H 5C4, Canada",
      null,
      ottCfg
    );
    expect(ottAddr.city).toBe("Nepean");
    expect(ottAddr.province).toBe("ON");
  });

  // 5. Classification
  it("classifies mosques, Islamic centres, and French terminology accurately", () => {
    // English
    expect(classifyRecord({ title: "Ottawa Mosque" }).classification).toBe("MOSQUE");
    expect(classifyRecord({ title: "Islamic Information Society" }).classification).toBe("ORGANIZATION");
    expect(classifyRecord({ title: "Vancouver Islamic Centre" }).classification).toBe("ISLAMIC_CENTER");

    // French (Montreal)
    expect(classifyRecord({ title: "Mosquée NDG" }).classification).toBe("MOSQUE");
    expect(classifyRecord({ title: "Mosquée Al falah Ahuntsic" }).classification).toBe("MOSQUE");
    expect(classifyRecord({ title: "Centre Islamique de Verdun" }).classification).toBe("ISLAMIC_CENTER");
    expect(classifyRecord({ title: "Centre Communautaire Annour" }).classification).toBe("COMMUNITY_CENTER");
  });

  // 6. Duplicate detection
  it("detects duplicates in expansion cities non-destructively", () => {
    const records = [
      {
        title: "Masjid Calgary",
        address: "100 Centre St, Calgary, AB",
        location: { lat: 51.05, lng: -114.07 },
        placeId: "pid_cal_1",
      },
      {
        title: "Masjid Calgary",
        address: "100 Centre St, Calgary, AB",
        location: { lat: 51.05, lng: -114.07 },
        placeId: "pid_cal_1",
      },
    ];
    const calgaryCfg = getCityConfig("calgary");
    const res = runIngestionPipeline(records, "calgary.json", "2026-10-08T00:00:00Z", calgaryCfg);

    expect(res.reviewRequired.length).toBe(2);
    expect(res.reviewRequired[0].duplicateRelations.some((d) => d.type === "EXACT_DUPLICATE")).toBe(true);
    expect(res.published.length).toBe(0);
  });

  // 7. Shared address detection
  it("detects shared physical locations without deleting records", () => {
    const records = [
      {
        title: "Masjid Al-Salam",
        address: "123 Shared Plaza, Ottawa, ON",
        location: { lat: 45.41, lng: -75.7 },
        placeId: "pid_ott_1",
      },
      {
        title: "Arab Community Centre",
        address: "123 Shared Plaza, Ottawa, ON",
        location: { lat: 45.41, lng: -75.7 },
        placeId: "pid_ott_2",
      },
    ];
    const ottCfg = getCityConfig("ottawa");
    const res = runIngestionPipeline(records, "ottawa.json", "2026-10-08T00:00:00Z", ottCfg);

    // Both records preserved
    expect(res.published.length + res.reviewRequired.length).toBe(2);
    const hasSharedRelation = [...res.published, ...res.reviewRequired].some((r) =>
      r.duplicateRelations.some((rel) => rel.type === "SHARED_LOCATION")
    );
    expect(hasSharedRelation).toBe(true);
  });

  // 8. Publication decision
  it("makes deterministic publication decisions strictly following policy", () => {
    const verifiedMosque = {
      id: "mosque-ott-1",
      sourceIndex: 0,
      name: "Ottawa Central Mosque",
      slug: "ottawa-central-mosque",
      address: {
        raw: "123 Main St, Ottawa, ON",
        streetAddress: "123 Main St",
        city: "Ottawa",
        province: "ON" as const,
        postalCode: { raw: "K1P 5M7", normalized: "K1P 5M7" },
        country: "CA" as const,
      },
      coordinates: { latitude: 45.42, longitude: -75.69 },
      phone: null,
      website: null,
      classification: "MOSQUE" as const,
      classificationReason: "Standard mosque",
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
      publicationStatus: "REVIEW_REQUIRED" as const,
      publicationReason: "",
      provenance: {
        sourceFile: "ottawa.json",
        sourceIndex: 0,
        cid: null,
        placeId: "pid_123",
        rawCategoryName: "Mosque",
        rawCategories: ["Mosque"],
        rating: null,
        reviewsCount: null,
        ingestedAt: "2026-10-08T00:00:00Z",
      },
    };

    const decision = determinePublicationStatus(verifiedMosque);
    expect(decision.status).toBe("PUBLISHED");
    expect(decision.reason).toContain("Ottawa");
  });

  // 9. City-specific output & accounting check
  it("enforces zero silent data loss across all 8 expansion cities", () => {
    const expansionCities = [
      "ottawa",
      "mississauga",
      "brampton",
      "vancouver",
      "calgary",
      "edmonton",
      "montreal",
      "winnipeg",
    ];

    for (const city of expansionCities) {
      const summary = runCityIngestion(city, rootDir, "2026-10-08T00:00:00.000Z", false);
      const total = summary.publishedCount + summary.reviewRequiredCount + summary.excludedCount;
      expect(total).toBe(summary.rawCount);

      // Verify files exist on disk in src/data/cities/<city>/
      const outDir = path.resolve(rootDir, "src", "data", "cities", city);
      expect(fs.existsSync(path.join(outDir, "published.json"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "review-required.json"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "excluded.json"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "quality-report.json"))).toBe(true);
    }
  });

  // 10. Review queue generation
  it("ensures review-required records are populated with required fields", () => {
    const summary = runCityIngestion("ottawa", rootDir, "2026-10-08T00:00:00.000Z", false);
    expect(summary.result.reviewRequired.length).toBeGreaterThan(0);
    for (const r of summary.result.reviewRequired) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.publicationReason).toBeTruthy();
      expect(r.publicationStatus).toBe("REVIEW_REQUIRED");
    }
  });

  // 11. Toronto regression
  it("preserves Toronto publication numbers (96 published, 56 review, 1 excluded)", () => {
    const summary = runCityIngestion("toronto", rootDir, "2026-10-08T00:00:00.000Z", false);
    expect(summary.rawCount).toBe(153);
    expect(summary.publishedCount).toBe(96);
    expect(summary.reviewRequiredCount).toBe(56);
    expect(summary.excludedCount).toBe(1);
    expect(summary.publishedCount + summary.reviewRequiredCount + summary.excludedCount).toBe(153);
  });

  // 12. Toronto raw immutability
  it("guarantees toronto.json raw dataset SHA-256 remains byte-for-byte unchanged", () => {
    const rawTorontoPath = path.resolve(rootDir, "src", "data", "raw", "toronto.json");
    const buf = fs.readFileSync(rawTorontoPath);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    expect(hash).toBe(TORONTO_EXPECTED_SHA256);

    const rootTorontoPath = path.resolve(rootDir, "toronto.json");
    const rootBuf = fs.readFileSync(rootTorontoPath);
    const rootHash = crypto.createHash("sha256").update(rootBuf).digest("hex");
    expect(rootHash).toBe(TORONTO_EXPECTED_SHA256);
  });
});
