import { describe, it, expect } from "vitest";
import { toMosqueCardItem } from "./card-model";
import { CanonicalMosqueRepository } from "./canonical-repository";
import { Mosque } from "./types";

describe("MosqueCardItem Model & Transformation", () => {
  const repo = new CanonicalMosqueRepository();

  it("contains all required displayed fields for MosqueCard", async () => {
    const mosques = await repo.list();
    expect(mosques.length).toBeGreaterThan(0);

    const sample = mosques[0];
    const cardItem = toMosqueCardItem(sample);

    // Required displayed fields
    expect(cardItem.id).toBe(sample.id);
    expect(cardItem.name).toBe(sample.name);
    expect(cardItem.slug).toBe(sample.slug);
    expect(cardItem.address).toBe(sample.address);
    expect(cardItem.classification).toBe(sample.classification);
    expect(cardItem.coordinates).toEqual({
      latitude: sample.coordinates.latitude,
      longitude: sample.coordinates.longitude,
    });
    expect(cardItem.facilities).toEqual({
      wheelchairAccessible: sample.facilities.wheelchairAccessible,
      parkingAvailable: sample.facilities.parkingAvailable,
      womenPrayerSection: sample.facilities.womenPrayerSection,
    });
    expect(typeof cardItem.isOpen === "boolean" || cardItem.isOpen === null).toBe(true);
  });

  it("ensures unused database fields are NOT passed into card item props", async () => {
    const mosques = await repo.list();
    const sample = mosques[0];
    const cardItem = toMosqueCardItem(sample);
    const rawKeys = Object.keys(cardItem);

    // Heavy database / server metadata that MUST NOT be serialized into card items
    expect(rawKeys).not.toContain("sourceMetadata");
    expect(rawKeys).not.toContain("iqamahSchedule");
    expect(rawKeys).not.toContain("jummahSchedule");
    expect(rawKeys).not.toContain("openingHours");
    expect(rawKeys).not.toContain("timezone");
    expect(rawKeys).not.toContain("phone");
    expect(rawKeys).not.toContain("website");
    expect(rawKeys).not.toContain("email");
    expect(rawKeys).not.toContain("status");
    expect(rawKeys).not.toContain("createdAt");
    expect(rawKeys).not.toContain("updatedAt");
    expect(rawKeys).not.toContain("provenance");
    expect(rawKeys).not.toContain("duplicateRelations");
    expect(rawKeys).not.toContain("qualityFlags");

    // Exact count of allowed properties: 7 keys
    expect(rawKeys.sort()).toEqual([
      "address",
      "classification",
      "coordinates",
      "facilities",
      "id",
      "isOpen",
      "name",
      "slug",
    ].sort());
  });

  it("preserves exact representation of all 331 published mosque records", async () => {
    const mosques = await repo.list();
    expect(mosques.length).toBe(331);

    const cardItems = mosques.map(toMosqueCardItem);
    expect(cardItems.length).toBe(331);

    // Verify all slugs and names match 1:1
    for (let i = 0; i < mosques.length; i++) {
      expect(cardItems[i].slug).toBe(mosques[i].slug);
      expect(cardItems[i].name).toBe(mosques[i].name);
      expect(cardItems[i].id).toBe(mosques[i].id);
      expect(cardItems[i].address).toBe(mosques[i].address);
    }
  });

  it("verifies detail links match `/mosque/[slug]` without truncation", async () => {
    const mosques = await repo.list();
    for (const m of mosques) {
      const card = toMosqueCardItem(m);
      expect(card.slug.length).toBeGreaterThan(2);
      expect(card.slug).not.toContain(" ");
      expect(card.slug).toBe(card.slug.toLowerCase());
    }
  });

  it("handles missing optional facilities gracefully without errors", () => {
    const minimalMosque: Mosque = {
      id: "test-minimal",
      name: "Test Minimal Mosque",
      slug: "test-minimal-mosque",
      address: "123 Main St, City, ON",
      city: "City",
      province: "ON",
      postalCode: null,
      coordinates: { latitude: 43.65, longitude: -79.38 },
      timezone: "America/Toronto",
      phone: null,
      website: null,
      email: null,
      classification: "MOSQUE",
      status: "ACTIVE",
      facilities: {
        wuduArea: null,
        womenPrayerSection: null,
        parkingAvailable: null,
        wheelchairAccessible: null,
        dailyPrayersHeld: null,
        notes: null,
      },
      openingHours: null,
      iqamahSchedule: null,
      jummahSchedule: null,
      sourceMetadata: {
        sourceName: "community_submission",
        lastIngestedAt: "2026-10-06T20:30:00.000Z",
        lastVerifiedAt: null,
        confidenceScore: 1,
      },
      createdAt: "2026-10-06T20:30:00.000Z",
      updatedAt: "2026-10-06T20:30:00.000Z",
    };

    const card = toMosqueCardItem(minimalMosque);
    expect(card.facilities.wheelchairAccessible).toBeNull();
    expect(card.facilities.parkingAvailable).toBeNull();
    expect(card.facilities.womenPrayerSection).toBeNull();
    expect(card.isOpen).toBeNull();
  });

  it("guarantees no fabricated ratings, reviews, opening hours, or prayer times exist in card items", async () => {
    const mosques = await repo.list();
    for (const m of mosques) {
      const card = toMosqueCardItem(m);
      const untyped = card as unknown as Record<string, unknown>;
      expect(untyped.rating).toBeUndefined();
      expect(untyped.reviewsCount).toBeUndefined();
      expect(untyped.reviews).toBeUndefined();
      expect(untyped.iqamah).toBeUndefined();
      expect(untyped.fajr).toBeUndefined();
      expect(untyped.dhuhr).toBeUndefined();
      expect(untyped.asr).toBeUndefined();
      expect(untyped.maghrib).toBeUndefined();
      expect(untyped.isha).toBeUndefined();
    }
  });
});
