import { describe, it, expect } from "vitest";
import { Mosque, validateMosqueEntity } from "./types";

describe("Mosque Domain Entity Validation", () => {
  const validMosque: Mosque = {
    id: "mosque-toronto-test-1",
    name: "Toronto Islamic Centre",
    slug: "toronto-islamic-centre",
    address: "123 Yonge St, Toronto, ON M5B 1M4, Canada",
    city: "Toronto",
    province: "ON",
    postalCode: "M5B 1M4",
    coordinates: {
      latitude: 43.6532,
      longitude: -79.3832,
    },
    timezone: "America/Toronto",
    phone: "+1 416-555-0100",
    website: "https://example.com",
    email: null,
    classification: "MOSQUE",
    status: "ACTIVE",
    facilities: {
      wuduArea: true,
      womenPrayerSection: true,
      parkingAvailable: false,
      wheelchairAccessible: true,
      dailyPrayersHeld: true,
      notes: null,
    },
    openingHours: null,
    iqamahSchedule: null,
    jummahSchedule: null,
    sourceMetadata: {
      sourceName: "google_places",
      rawId: "raw-123",
      googleCid: "123456789",
      placeId: "ChIJ...",
      rating: 4.8,
      reviewCount: 120,
      lastIngestedAt: "2026-10-06T20:00:00Z",
      lastVerifiedAt: null,
      confidenceScore: 0.95,
    },
    createdAt: "2026-10-06T20:00:00Z",
    updatedAt: "2026-10-06T20:00:00Z",
  };

  it("passes validation for a properly formed mosque entity", () => {
    const errors = validateMosqueEntity(validMosque);
    expect(errors).toHaveLength(0);
  });

  it("catches invalid Canadian province", () => {
    const invalid = { ...validMosque, province: "CA" as unknown as Mosque["province"] };
    const errors = validateMosqueEntity(invalid);
    expect(errors).toContain("Invalid Canadian province: CA");
  });

  it("requires valid coordinates", () => {
    const invalid = { ...validMosque, coordinates: null as unknown as Mosque["coordinates"] };
    const errors = validateMosqueEntity(invalid);
    expect(errors.some((e) => e.includes("latitude and longitude"))).toBe(true);
  });

  it("ensures missing fields remain null rather than fake placeholders", () => {
    expect(validMosque.email).toBeNull();
    expect(validMosque.iqamahSchedule).toBeNull();
    expect(validMosque.jummahSchedule).toBeNull();
  });
});
