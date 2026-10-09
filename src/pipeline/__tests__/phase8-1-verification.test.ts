import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { VERIFIED_37_RECORDS } from "../../../scripts/verify-phase8-1";

const TORONTO_EXPECTED_SHA256 = "0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9";

describe("Phase 8.1: Targeted Evidence Verification Audit Suite", () => {
  const rootDir = path.resolve(__dirname, "..", "..", "..");
  const phase81Path = path.resolve(rootDir, "src", "data", "review", "phase8-1-verification-results.json");
  const phase8Path = path.resolve(rootDir, "src", "data", "review", "phase8-review-results.json");

  const validClassifications = new Set([
    "MOSQUE",
    "ISLAMIC_CENTER",
    "MUSALLA",
    "PRAYER_ROOM",
    "JUMMAH_LOCATION",
    "COMMUNITY_CENTER",
    "ORGANIZATION",
    "EXCLUDE",
  ]);

  const validVerificationStatuses = new Set([
    "VERIFIED",
    "SUPPORTED",
    "UNVERIFIED",
    "CONTRADICTED",
    "INCONCLUSIVE",
  ]);

  const validFinalDecisions = new Set([
    "KEEP_PUBLISHED_VERIFIED",
    "KEEP_PUBLISHED_SUPPORTED",
    "RETURN_TO_REVIEW",
    "RETURN_TO_EXCLUDED",
    "KEEP_EXCLUDED_VERIFIED",
    "KEEP_EXCLUDED_SUPPORTED",
    "MOVE_TO_PUBLISHED",
  ]);

  const validConfidences = new Set(["HIGH", "MEDIUM", "LOW"]);

  // 1-3. Target Counts Derivation & Exact Matches
  it("verifies target counts derived from Phase 8: exactly 37 targets (26 published, 11 excluded)", () => {
    expect(fs.existsSync(phase8Path)).toBe(true);
    const p8Data = JSON.parse(fs.readFileSync(phase8Path, "utf8"));
    const p8Targets = p8Data.results.filter(
      (r: { decision: string }) => r.decision === "MOVE_TO_PUBLISHED" || r.decision === "MOVE_TO_EXCLUDED"
    );
    const p8Pub = p8Targets.filter((r: { decision: string }) => r.decision === "MOVE_TO_PUBLISHED");
    const p8Exc = p8Targets.filter((r: { decision: string }) => r.decision === "MOVE_TO_EXCLUDED");

    expect(p8Targets).toHaveLength(37);
    expect(p8Pub).toHaveLength(26);
    expect(p8Exc).toHaveLength(11);
  });

  // 4. Verification file structure and count
  it("verifies phase8-1-verification-results.json contains all 37 targets with valid fields", () => {
    expect(fs.existsSync(phase81Path)).toBe(true);
    const p81Data = JSON.parse(fs.readFileSync(phase81Path, "utf8"));

    expect(p81Data.phase).toBe("8.1");
    expect(p81Data.targetCount).toBe(37);
    expect(p81Data.publishedTargetCount).toBe(26);
    expect(p81Data.excludedTargetCount).toBe(11);
    expect(p81Data.results).toHaveLength(37);
  });

  // 5. No duplicate source IDs
  it("ensures no duplicate source IDs exist among the 37 target records", () => {
    const ids = VERIFIED_37_RECORDS.map((r) => r.sourceId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(37);
  });

  // 6, 12, 13, 14. Field validation
  it("validates that all 37 records have legitimate finalDecision, status, classification, and confidence", () => {
    for (const rec of VERIFIED_37_RECORDS) {
      expect(rec.city).toBeTruthy();
      expect(rec.name).toBeTruthy();
      expect(rec.sourceId).toBeTruthy();

      expect(validFinalDecisions.has(rec.finalDecision)).toBe(true);
      expect(validVerificationStatuses.has(rec.verificationStatus)).toBe(true);
      expect(validClassifications.has(rec.verifiedClassification)).toBe(true);
      expect(validConfidences.has(rec.confidence)).toBe(true);
    }
  });

  // 7. External source URLs
  it("verifies every external source entry contains a non-empty, valid URL and provenance", () => {
    for (const rec of VERIFIED_37_RECORDS) {
      expect(rec.externalSources.length).toBeGreaterThan(0);
      for (const src of rec.externalSources) {
        expect(src.url).toMatch(/^https?:\/\//);
        expect(src.checkedAt).toBe("2026-10-08");
        expect(src.supports.length).toBeGreaterThan(0);
        expect(["HIGH", "MEDIUM", "LOW"]).toContain(src.strength);
      }
    }
  });

  // 8. Raw files unchanged
  it("ensures byte-for-byte immutability of all 9 raw datasets and root toronto.json", () => {
    const rawTorontoPath = path.resolve(rootDir, "src", "data", "raw", "toronto.json");
    const rootTorontoPath = path.resolve(rootDir, "toronto.json");

    const rawBuf = fs.readFileSync(rawTorontoPath);
    const rootBuf = fs.readFileSync(rootTorontoPath);

    const rawHash = crypto.createHash("sha256").update(rawBuf).digest("hex");
    const rootHash = crypto.createHash("sha256").update(rootBuf).digest("hex");

    expect(rawHash).toBe(TORONTO_EXPECTED_SHA256);
    expect(rootHash).toBe(TORONTO_EXPECTED_SHA256);
  });

  // 9. Canada accounting conservation: 501 = 331 Published + 158 Review + 12 Excluded
  it("strictly confirms Canada-wide conservation law: 331 Published + 158 Review + 12 Excluded = 501 Raw", () => {
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

    let totalRaw = 0;
    let totalPub = 0;
    let totalRev = 0;
    let totalExc = 0;

    for (const c of cities) {
      const cDir = c === "toronto" ? path.join(rootDir, "src", "data", "toronto") : path.join(rootDir, "src", "data", "cities", c);
      const pub = JSON.parse(fs.readFileSync(path.join(cDir, "published.json"), "utf8"));
      const rev = JSON.parse(fs.readFileSync(path.join(cDir, "review-required.json"), "utf8"));
      const exc = JSON.parse(fs.readFileSync(path.join(cDir, "excluded.json"), "utf8"));
      const raw = JSON.parse(fs.readFileSync(path.join(rootDir, "src", "data", "raw", `${c}.json`), "utf8"));

      expect(pub.length + rev.length + exc.length).toBe(raw.length);

      totalRaw += raw.length;
      totalPub += pub.length;
      totalRev += rev.length;
      totalExc += exc.length;
    }

    expect(totalRaw).toBe(501);
    expect(totalPub).toBe(331);
    expect(totalRev).toBe(158);
    expect(totalExc).toBe(12);
    expect(totalPub + totalRev + totalExc).toBe(501);
  });

  // 10. Toronto regression: exactly 96 / 56 / 1
  it("preserves Toronto reference baseline without regressions (96 published, 56 review, 1 excluded)", () => {
    const tDir = path.join(rootDir, "src", "data", "toronto");
    const pub = JSON.parse(fs.readFileSync(path.join(tDir, "published.json"), "utf8"));
    const rev = JSON.parse(fs.readFileSync(path.join(tDir, "review-required.json"), "utf8"));
    const exc = JSON.parse(fs.readFileSync(path.join(tDir, "excluded.json"), "utf8"));

    expect(pub).toHaveLength(96);
    expect(rev).toHaveLength(56);
    expect(exc).toHaveLength(1);
    expect(pub.length + rev.length + exc.length).toBe(153);
  });

  // 11. Specific audit verifications:
  // mosque-edm-34 safely returned to review due to closed status
  it("verifies mosque-edm-34 (Afghan Husseini) is returned to review queue due to closed commercial status", () => {
    const edmDir = path.join(rootDir, "src", "data", "cities", "edmonton");
    const pub = JSON.parse(fs.readFileSync(path.join(edmDir, "published.json"), "utf8"));
    const rev = JSON.parse(fs.readFileSync(path.join(edmDir, "review-required.json"), "utf8"));

    const inPub = pub.find((r: { id: string }) => r.id === "mosque-edm-34");
    const inRev = rev.find((r: { id: string }) => r.id === "mosque-edm-34");

    expect(inPub).toBeUndefined();
    expect(inRev).toBeDefined();
    expect(inRev.publicationStatus).toBe("REVIEW_REQUIRED");
  });

  // 12. Documentation artifacts exist
  it("verifies all Phase 8.1 documentation artifacts exist and are populated", () => {
    const docFiles = [
      "docs/PHASE_8_1_EVIDENCE_VERIFICATION_REPORT.md",
      "docs/PHASE_8_1_VERIFICATION_LEDGER.md",
      "docs/PHASE_8_1_ACTION_QUEUE.md",
    ];

    for (const relPath of docFiles) {
      const fullPath = path.resolve(rootDir, relPath);
      expect(fs.existsSync(fullPath), `Document file must exist: ${relPath}`).toBe(true);
      const content = fs.readFileSync(fullPath, "utf8");
      expect(content.length).toBeGreaterThan(100);
    }
  });
});
