import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const TORONTO_EXPECTED_SHA256 = "0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9";

describe("Phase 8: Manual Review & Data Quality Audit Suite", () => {
  const rootDir = path.resolve(__dirname, "..", "..", "..");
  const reviewResultsPath = path.resolve(rootDir, "src", "data", "review", "phase8-review-results.json");
  const cities = [
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

  function getCityDir(city: string): string {
    if (city === "toronto") {
      return path.resolve(rootDir, "src", "data", "toronto");
    }
    return path.resolve(rootDir, "src", "data", "cities", city);
  }

  it("verifies Toronto raw dataset SHA-256 remains completely untouched", () => {
    const torontoRawPath = path.resolve(rootDir, "src", "data", "raw", "toronto.json");
    expect(fs.existsSync(torontoRawPath)).toBe(true);
    const content = fs.readFileSync(torontoRawPath);
    const hash = crypto.createHash("sha256").update(content).digest("hex");
    expect(hash).toBe(TORONTO_EXPECTED_SHA256);
  });

  it("loads the Phase 8 audit ledger and confirms exactly 194 audited records", () => {
    expect(fs.existsSync(reviewResultsPath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(reviewResultsPath, "utf8"));
    expect(data.phase).toBe("8");
    expect(data.totalReviewed).toBe(194);
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results).toHaveLength(194);

    const validDecisions = new Set(["MOVE_TO_PUBLISHED", "MOVE_TO_EXCLUDED", "KEEP_REVIEW_REQUIRED"]);
    const validConfidences = new Set(["HIGH", "MEDIUM", "LOW"]);

    for (const item of data.results) {
      expect(item.sourceId).toBeTruthy();
      expect(item.city).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(validDecisions.has(item.decision)).toBe(true);
      expect(validConfidences.has(item.confidence)).toBe(true);
      expect(item.notes).toBeTruthy();
      expect(item.notes.length).toBeGreaterThan(10);
    }
  });

  it("preserves Toronto Phase 1 baseline without regressions (96 published, 56 review, 1 excluded)", () => {
    const torontoDir = getCityDir("toronto");
    const pub = JSON.parse(fs.readFileSync(path.join(torontoDir, "published.json"), "utf8"));
    const rev = JSON.parse(fs.readFileSync(path.join(torontoDir, "review-required.json"), "utf8"));
    const exc = JSON.parse(fs.readFileSync(path.join(torontoDir, "excluded.json"), "utf8"));

    expect(pub).toHaveLength(96);
    expect(rev).toHaveLength(56);
    expect(exc).toHaveLength(1);
    expect(pub.length + rev.length + exc.length).toBe(153);
  });

  it("strictly maintains accounting conservation across every single city", () => {
    let totalRaw = 0;
    let totalPublished = 0;
    let totalReview = 0;
    let totalExcluded = 0;

    for (const city of cities) {
      const cityDir = getCityDir(city);
      const rawPath = path.resolve(rootDir, "src", "data", "raw", `${city}.json`);

      const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
      const pub = JSON.parse(fs.readFileSync(path.join(cityDir, "published.json"), "utf8"));
      const rev = JSON.parse(fs.readFileSync(path.join(cityDir, "review-required.json"), "utf8"));
      const exc = JSON.parse(fs.readFileSync(path.join(cityDir, "excluded.json"), "utf8"));

      totalRaw += raw.length;
      totalPublished += pub.length;
      totalReview += rev.length;
      totalExcluded += exc.length;

      // Conservation law per city: Published + Review + Excluded = Raw
      expect(
        pub.length + rev.length + exc.length,
        `Conservation failed for city: ${city}`
      ).toBe(raw.length);
    }

    // Canada-wide conservation law: 331/332 + 157/158 + 12 = 501
    expect(totalRaw).toBe(501);
    expect([331, 332]).toContain(totalPublished);
    expect([157, 158]).toContain(totalReview);
    expect(totalExcluded).toBe(12);
    expect(totalPublished + totalReview + totalExcluded).toBe(totalRaw);
  });

  it("confirms exclusion of non-mosque entities (commercial businesses, private homes, cemeteries)", () => {
    const excludedEntities = [
      { city: "montreal", name: "Taxi beaubien" },
      { city: "montreal", name: "Yoshi grave site" },
      { city: "montreal", name: "mchichini makaburini" },
      { city: "edmonton", name: "Hanny Al Khoury art studio" },
      { city: "edmonton", name: "Yygg" },
      { city: "edmonton", name: "GK Edmonton" },
      { city: "calgary", name: "Explosive Landscaping" },
      { city: "calgary", name: "Khaled Hussain house" },
      { city: "calgary", name: "pàlíser" },
      { city: "ottawa", name: "Clinton" },
      { city: "ottawa", name: "IslamicReminders1500" },
    ];

    for (const { city, name } of excludedEntities) {
      const cityDir = getCityDir(city);
      const exc = JSON.parse(fs.readFileSync(path.join(cityDir, "excluded.json"), "utf8"));
      const found = exc.find((r: { name: string }) => r.name.toLowerCase().includes(name.toLowerCase()));
      expect(found, `Expected ${name} in ${city} excluded.json`).toBeDefined();
    }
  });

  it("confirms promotion of verified physical mosques that were held for review", () => {
    const promotedEntities = [
      { city: "mississauga", name: "Sayeda Khadija Centre" },
      { city: "brampton", name: "Islamic Forum Of Canada" },
      { city: "ottawa", name: "Masjid Ar-Rahmah" },
      { city: "vancouver", name: "Masjid Ul-Haqq" },
      { city: "calgary", name: "Baitun-Nur Mosque" },
      { city: "montreal", name: "Mosquée Madani" },
      { city: "winnipeg", name: "Grand Mosque" },
      { city: "edmonton", name: "Masjed Dar Al-Arqam" },
    ];

    for (const { city, name } of promotedEntities) {
      const cityDir = getCityDir(city);
      const pub = JSON.parse(fs.readFileSync(path.join(cityDir, "published.json"), "utf8"));
      const found = pub.find((r: { name: string }) => r.name.toLowerCase().includes(name.toLowerCase()));
      expect(found, `Expected ${name} in ${city} published.json`).toBeDefined();
    }
  });

  it("verifies all Phase 8 documentation artifacts exist and are populated", () => {
    const docFiles = [
      "docs/PHASE_8_REVIEW_LEDGER.md",
      "docs/PHASE_8_CITY_REVIEW_REPORT.md",
      "docs/PHASE_8_FINAL_REPORT.md",
      "docs/PHASE_8_REMAINING_REVIEW_QUEUE.md",
    ];

    for (const relPath of docFiles) {
      const fullPath = path.resolve(rootDir, relPath);
      expect(fs.existsSync(fullPath), `Document file must exist: ${relPath}`).toBe(true);
      const content = fs.readFileSync(fullPath, "utf8");
      expect(content.length).toBeGreaterThan(100);
    }
  });
});
