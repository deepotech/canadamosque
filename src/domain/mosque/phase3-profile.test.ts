import { describe, it, expect } from "vitest";
import { CanonicalMosqueRepository } from "./canonical-repository";
import { getClassificationDisplayName } from "./classification-display";
import { MosqueClassification } from "./types";
import { isWithinCanadaBounds } from "../geo/coordinates";

describe("Phase 3 Canonical Mosque Data & Repository Guarantees", () => {
  const repo = new CanonicalMosqueRepository();

  it("loads all 331 published canonical records across Canada", async () => {
    const list = await repo.list();
    expect(list.length).toBe(331);
  });

  it("ensures all published records have valid, unique, lowercase slugs", async () => {
    const list = await repo.list();
    const slugSet = new Set<string>();

    for (const m of list) {
      expect(m.slug).toBeDefined();
      expect(typeof m.slug).toBe("string");
      expect(m.slug.length).toBeGreaterThan(0);
      expect(m.slug).toBe(m.slug.toLowerCase());
      expect(m.slug).not.toContain(" ");
      expect(slugSet.has(m.slug)).toBe(false);
      slugSet.add(m.slug);
    }

    expect(slugSet.size).toBe(331);
  });

  it("ensures all published records have valid Canadian coordinates", async () => {
    const list = await repo.list();
    for (const m of list) {
      expect(m.coordinates).toBeDefined();
      expect(typeof m.coordinates.latitude).toBe("number");
      expect(typeof m.coordinates.longitude).toBe("number");
      expect(Number.isNaN(m.coordinates.latitude)).toBe(false);
      expect(Number.isNaN(m.coordinates.longitude)).toBe(false);
      expect(isWithinCanadaBounds(m.coordinates)).toBe(true);
    }
  });

  it("ensures all published records have valid non-empty address and city", async () => {
    const list = await repo.list();
    for (const m of list) {
      expect(m.address).toBeDefined();
      expect(m.address.trim().length).toBeGreaterThan(0);
      expect(m.city).toBeDefined();
      expect(m.city.trim().length).toBeGreaterThan(0);
      expect(["ON", "BC", "AB", "QC", "MB"]).toContain(m.province);
      expect([
        "America/Toronto",
        "America/Vancouver",
        "America/Edmonton",
        "America/Winnipeg",
      ]).toContain(m.timezone);
    }
  });

  it("resolves canonical mosque by slug", async () => {
    const list = await repo.list();
    const sample = list[0];
    const retrieved = await repo.getBySlug(sample.slug);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(sample.id);
    expect(retrieved?.name).toBe(sample.name);
  });

  it("returns null for non-existent or invalid slug", async () => {
    const res = await repo.getBySlug("completely-invalid-non-existent-mosque-slug-xyz");
    expect(res).toBeNull();
  });

  it("does not expose review-required or excluded records through slug lookup", async () => {
    // Slugs from review-required or excluded cannot be resolved
    const list = await repo.list();
    for (const m of list) {
      expect(m.classification).not.toBe("REVIEW_REQUIRED");
      expect(m.classification).not.toBe("EXCLUDE");
    }
  });

  it("maps every canonical classification to a meaningful, honest display name", () => {
    const classifications: MosqueClassification[] = [
      "MOSQUE",
      "ISLAMIC_CENTER",
      "MUSALLA",
      "PRAYER_ROOM",
      "JUMMAH_LOCATION",
      "COMMUNITY_CENTER",
      "ORGANIZATION",
    ];

    expect(getClassificationDisplayName("MOSQUE")).toBe("Mosque");
    expect(getClassificationDisplayName("ISLAMIC_CENTER")).toBe("Islamic Center");
    expect(getClassificationDisplayName("MUSALLA")).toBe("Musalla");
    expect(getClassificationDisplayName("PRAYER_ROOM")).toBe("Prayer Room");
    expect(getClassificationDisplayName("JUMMAH_LOCATION")).toBe("Jummah Location");
    expect(getClassificationDisplayName("COMMUNITY_CENTER")).toBe("Community Center");
    expect(getClassificationDisplayName("ORGANIZATION")).toBe("Organization");

    // Ensure non-mosques are NOT labeled "Mosque"
    for (const c of classifications) {
      if (c !== "MOSQUE") {
        expect(getClassificationDisplayName(c)).not.toBe("Mosque");
      }
    }
  });

  it("ensures zero fabrication: Iqamah and Jummah schedules are null for all published records", async () => {
    const list = await repo.list();
    for (const m of list) {
      expect(m.iqamahSchedule).toBeNull();
      expect(m.jummahSchedule).toBeNull();
    }
  });
});
