import { describe, it, expect } from "vitest";
import { getNearbyPublishedMosques } from "./nearby";
import { CanonicalMosqueRepository } from "./canonical-repository";
import { Mosque } from "./types";
import { getCityConfigByName } from "../city/city-config";

function makeMockMosque(overrides: Partial<Mosque> = {}): Mosque {
  return {
    id: "mosque-mock-1",
    name: "Mock Mosque 1",
    slug: "mock-mosque-1",
    address: "123 Main St",
    city: "Toronto",
    province: "ON",
    postalCode: "M1M 1M1",
    coordinates: { latitude: 43.6532, longitude: -79.3832 },
    timezone: "America/Toronto",
    phone: null,
    website: null,
    email: null,
    classification: "MOSQUE",
    status: "ACTIVE",
    facilities: {
      wuduArea: true,
      parkingAvailable: true,
      wheelchairAccessible: true,
      womenPrayerSection: true,
      dailyPrayersHeld: true,
      notes: null,
    },
    openingHours: null,
    iqamahSchedule: null,
    jummahSchedule: null,
    sourceMetadata: {
      sourceName: "google_places",
      rawId: "mock-1",
      lastIngestedAt: new Date().toISOString(),
      lastVerifiedAt: null,
      confidenceScore: 1,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Nearby Mosques Algorithm - Unit Tests", () => {
  const centerMosque = makeMockMosque({
    id: "center-mosque",
    name: "Center Mosque",
    slug: "center-mosque",
    coordinates: { latitude: 43.6532, longitude: -79.3832 },
  });

  it("calculates accurate geographic distance and sorts ascending", () => {
    // Mosque A: ~1.2 km away
    const mosqueA = makeMockMosque({
      id: "mosque-a",
      name: "Mosque A",
      slug: "mosque-a",
      coordinates: { latitude: 43.6426, longitude: -79.3871 },
    });
    // Mosque B: ~5.0 km away
    const mosqueB = makeMockMosque({
      id: "mosque-b",
      name: "Mosque B",
      slug: "mosque-b",
      coordinates: { latitude: 43.698, longitude: -79.3832 },
    });
    // Mosque C: ~0.5 km away
    const mosqueC = makeMockMosque({
      id: "mosque-c",
      name: "Mosque C",
      slug: "mosque-c",
      coordinates: { latitude: 43.657, longitude: -79.3832 },
    });

    const results = getNearbyPublishedMosques(centerMosque, [mosqueA, mosqueB, mosqueC], 6);

    expect(results).toHaveLength(3);
    expect(results[0].mosque.id).toBe("mosque-c");
    expect(results[1].mosque.id).toBe("mosque-a");
    expect(results[2].mosque.id).toBe("mosque-b");

    expect(results[0].distanceKm).toBeLessThan(results[1].distanceKm);
    expect(results[1].distanceKm).toBeLessThan(results[2].distanceKm);
  });

  it("strictly excludes the current target mosque by both ID and slug", () => {
    const duplicateId = makeMockMosque({
      id: "center-mosque",
      name: "Duplicate ID Mosque",
      slug: "other-slug",
    });
    const duplicateSlug = makeMockMosque({
      id: "different-id",
      name: "Duplicate Slug Mosque",
      slug: "center-mosque",
    });
    const validOther = makeMockMosque({
      id: "valid-other",
      name: "Valid Other Mosque",
      slug: "valid-other",
      coordinates: { latitude: 43.66, longitude: -79.38 },
    });

    const results = getNearbyPublishedMosques(
      centerMosque,
      [centerMosque, duplicateId, duplicateSlug, validOther],
      6
    );

    expect(results).toHaveLength(1);
    expect(results[0].mosque.id).toBe("valid-other");
  });

  it("never includes review-required or excluded records", () => {
    const reviewRequired = makeMockMosque({
      id: "rev-1",
      slug: "rev-1",
      classification: "REVIEW_REQUIRED",
    });
    const excluded = makeMockMosque({
      id: "exc-1",
      slug: "exc-1",
      classification: "EXCLUDE",
    });
    const published = makeMockMosque({
      id: "pub-1",
      slug: "pub-1",
      classification: "MOSQUE",
      coordinates: { latitude: 43.66, longitude: -79.38 },
    });

    const results = getNearbyPublishedMosques(
      centerMosque,
      [reviewRequired, excluded, published],
      6
    );

    expect(results).toHaveLength(1);
    expect(results[0].mosque.id).toBe("pub-1");
  });

  it("excludes non-ACTIVE records", () => {
    const inactive = makeMockMosque({
      id: "inact-1",
      slug: "inact-1",
      status: "PERMANENTLY_CLOSED",
      coordinates: { latitude: 43.66, longitude: -79.38 },
    });
    const active = makeMockMosque({
      id: "act-1",
      slug: "act-1",
      status: "ACTIVE",
      coordinates: { latitude: 43.66, longitude: -79.38 },
    });

    const results = getNearbyPublishedMosques(centerMosque, [inactive, active], 6);

    expect(results).toHaveLength(1);
    expect(results[0].mosque.id).toBe("act-1");
  });

  it("limits results to specified limit (default 6, nearest 4-6)", () => {
    const candidates = Array.from({ length: 10 }, (_, i) =>
      makeMockMosque({
        id: `m-${i}`,
        slug: `m-${i}`,
        name: `Mosque ${i}`,
        coordinates: { latitude: 43.6532 + (i + 1) * 0.01, longitude: -79.3832 },
      })
    );

    const defaultResults = getNearbyPublishedMosques(centerMosque, candidates);
    expect(defaultResults).toHaveLength(6);

    const customResults4 = getNearbyPublishedMosques(centerMosque, candidates, 4);
    expect(customResults4).toHaveLength(4);

    const customResults5 = getNearbyPublishedMosques(centerMosque, candidates, 5);
    expect(customResults5).toHaveLength(5);
  });

  it("returns only available results when fewer than 4 exist", () => {
    const candidates = [
      makeMockMosque({
        id: "m-1",
        slug: "m-1",
        coordinates: { latitude: 43.66, longitude: -79.38 },
      }),
      makeMockMosque({
        id: "m-2",
        slug: "m-2",
        coordinates: { latitude: 43.67, longitude: -79.38 },
      }),
    ];

    const results = getNearbyPublishedMosques(centerMosque, candidates, 6);
    expect(results).toHaveLength(2);
    expect(results[0].mosque.id).toBe("m-1");
    expect(results[1].mosque.id).toBe("m-2");
  });

  it("returns empty array when no candidates exist or target has invalid coordinates", () => {
    expect(getNearbyPublishedMosques(centerMosque, [], 6)).toEqual([]);

    const invalidCoordsTarget = makeMockMosque({
      coordinates: { latitude: 999, longitude: 999 },
    });
    expect(getNearbyPublishedMosques(invalidCoordsTarget, [centerMosque], 6)).toEqual([]);
  });
});

describe("Canonical Directory Integration - All 331 Published Mosques", () => {
  const repo = new CanonicalMosqueRepository();

  it("verifies all 331 published mosque profiles generate nearby mosque links", async () => {
    const all = await repo.list();
    expect(all).toHaveLength(331);

    const publishedSlugs = new Set(all.map((m) => m.slug));
    const publishedIds = new Set(all.map((m) => m.id));

    for (const mosque of all) {
      const nearby = await repo.getNearbyPublishedMosques(mosque, 6);

      // In Canadian dataset, every metropolitan center has at least 6 published mosques
      expect(
        nearby.length,
        `Mosque ${mosque.slug} should have between 4 and 6 nearby mosques`
      ).toBeGreaterThanOrEqual(4);
      expect(nearby.length).toBeLessThanOrEqual(6);

      // Verify current mosque is NEVER listed in its own nearby list
      for (const item of nearby) {
        expect(
          item.mosque.id,
          `Current mosque ${mosque.id} must never appear in its own nearby results`
        ).not.toBe(mosque.id);
        expect(
          item.mosque.slug,
          `Current mosque slug ${mosque.slug} must never appear in its own nearby results`
        ).not.toBe(mosque.slug);

        // Verify review/excluded records never appear
        expect(item.mosque.classification).not.toBe("REVIEW_REQUIRED");
        expect(item.mosque.classification).not.toBe("EXCLUDE");
        expect(item.mosque.status).toBe("ACTIVE");

        // Verify slug resolves to existing published profile
        expect(
          publishedSlugs.has(item.mosque.slug),
          `Nearby slug ${item.mosque.slug} must resolve to a published profile`
        ).toBe(true);
        expect(publishedIds.has(item.mosque.id)).toBe(true);

        // Verify distance is a valid positive number
        expect(item.distanceKm).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(item.distanceKm)).toBe(true);
      }

      // Verify distances are sorted ascending
      for (let i = 1; i < nearby.length; i++) {
        expect(
          nearby[i].distanceKm,
          `Distances for ${mosque.slug} must be sorted ascending: index ${i} >= index ${i - 1}`
        ).toBeGreaterThanOrEqual(nearby[i - 1].distanceKm);
      }

      // Verify city links use existing canonical city routes
      const cityConfig = getCityConfigByName(mosque.city);
      const cityBrowseUrl = cityConfig?.canonicalMosqueRoute || "/mosques";
      expect(
        cityBrowseUrl.startsWith("/mosques"),
        `City link for ${mosque.slug} (${mosque.city}) must start with /mosques`
      ).toBe(true);
    }
  });

  it("verifies geographic internal linking produces crawlable URLs", async () => {
    const all = await repo.list();
    const sample = all.slice(0, 10);

    for (const mosque of sample) {
      const nearby = await repo.getNearbyPublishedMosques(mosque, 6);
      nearby.forEach(({ mosque: near }) => {
        const url = `/mosque/${near.slug}`;
        expect(url).toMatch(/^\/mosque\/[a-z0-9-]+$/);
        expect(near.name.trim().length).toBeGreaterThan(0);
        expect(near.city.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it("verifies mutual or natural geographic mesh across published mosques", async () => {
    const all = await repo.list();
    // Test that internal linking creates a bidirectional or tightly connected mesh in cities
    const torontoMosques = all.filter((m) => m.city.toLowerCase() === "toronto");
    expect(torontoMosques.length).toBeGreaterThan(10);

    const m0 = torontoMosques[0];
    const nearbyToM0 = await repo.getNearbyPublishedMosques(m0, 6);
    const nearestToM0 = nearbyToM0[0].mosque;

    const nearbyToNearest = await repo.getNearbyPublishedMosques(nearestToM0, 6);
    const containsM0 = nearbyToNearest.some((item) => item.mosque.id === m0.id);
    expect(containsM0, "Nearest neighbour should link back to target or closely in the mesh").toBe(true);
  });
});

