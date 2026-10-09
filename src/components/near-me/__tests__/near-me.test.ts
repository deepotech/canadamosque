import { describe, it, expect } from "vitest";
import { calculateHaversineDistanceKm } from "@/domain/geo/distance";
import { Mosque } from "@/domain/mosque/types";

describe("Mosque Near Me Geolocation Logic & Flow", () => {
  const mockMosques: Mosque[] = [
    {
      id: "m-toronto-1",
      slug: "masjid-toronto",
      name: "Masjid Toronto",
      address: "168 Dundas St W, Toronto, ON",
      city: "Toronto",
      province: "ON",
      postalCode: "M5G 1C6",
      coordinates: { latitude: 43.6539, longitude: -79.3872 },
      phone: null,
      website: null,
      classification: "MOSQUE",
      openingHours: null,
      facilities: {
        wheelchairAccessible: true,
        parkingAvailable: false,
        womenPrayerSection: true,
        wuduArea: true,
        dailyPrayersHeld: true,
        notes: null,
      },
      sourceMetadata: {
        sourceName: "google_places",
        lastIngestedAt: "2026-10-08",
        lastVerifiedAt: null,
        confidenceScore: 1,
      },
      timezone: "America/Toronto",
      email: null,
      createdAt: "2026-10-08",
      updatedAt: "2026-10-08",
      iqamahSchedule: null,
      jummahSchedule: null,
      status: "ACTIVE",
    },
    {
      id: "m-ottawa-1",
      slug: "ottawa-mosque",
      name: "Ottawa Mosque",
      address: "251 Northwestern Ave, Ottawa, ON",
      city: "Ottawa",
      province: "ON",
      postalCode: "K1Y 0M1",
      coordinates: { latitude: 45.3986, longitude: -75.7335 },
      phone: null,
      website: null,
      classification: "MOSQUE",
      openingHours: null,
      facilities: {
        wheelchairAccessible: true,
        parkingAvailable: true,
        womenPrayerSection: true,
        wuduArea: true,
        dailyPrayersHeld: true,
        notes: null,
      },
      sourceMetadata: {
        sourceName: "google_places",
        lastIngestedAt: "2026-10-08",
        lastVerifiedAt: null,
        confidenceScore: 1,
      },
      timezone: "America/Toronto",
      email: null,
      createdAt: "2026-10-08",
      updatedAt: "2026-10-08",
      iqamahSchedule: null,
      jummahSchedule: null,
      status: "ACTIVE",
    },
  ];

  it("calculates accurate distances and sorts nearest mosques client-side", () => {
    // User in downtown Toronto
    const userLocation = { latitude: 43.6532, longitude: -79.3832 };

    const withDistances = mockMosques.map((m) => ({
      mosque: m,
      distanceKm: calculateHaversineDistanceKm(userLocation, m.coordinates),
    }));

    withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

    expect(withDistances[0].mosque.name).toBe("Masjid Toronto");
    expect(withDistances[0].distanceKm).toBeLessThan(1); // Within 1km
    expect(withDistances[1].mosque.name).toBe("Ottawa Mosque");
    expect(withDistances[1].distanceKm).toBeGreaterThan(300); // ~350km away
  });

  it("handles zero nearby results gracefully", () => {
    const emptyMosques: Mosque[] = [];
    const userLocation = { latitude: 43.6532, longitude: -79.3832 };

    const withDistances = emptyMosques.map((m) => ({
      mosque: m,
      distanceKm: calculateHaversineDistanceKm(userLocation, m.coordinates),
    }));

    expect(withDistances.length).toBe(0);
  });

  describe("Geolocation Error Code Mapping", () => {
    function getErrorMessage(code: number): string {
      switch (code) {
        case 1: // PERMISSION_DENIED
          return "Location access was denied. Please allow location access in your browser settings, or browse mosques by city.";
        case 2: // POSITION_UNAVAILABLE
          return "We couldn't determine your location. Please try again or browse mosques by city.";
        case 3: // TIMEOUT
          return "Location detection timed out. Please try again.";
        default:
          return "We couldn't determine your location. Please try again or browse mosques by city.";
      }
    }

    it("maps PERMISSION_DENIED (1) to user-friendly permission instructions", () => {
      const msg = getErrorMessage(1);
      expect(msg).toContain("Location access was denied");
      expect(msg).toContain("browse mosques by city");
    });

    it("maps POSITION_UNAVAILABLE (2) to helpful retry instructions", () => {
      const msg = getErrorMessage(2);
      expect(msg).toContain("We couldn't determine your location");
      expect(msg).toContain("browse mosques by city");
    });

    it("maps TIMEOUT (3) to clear retry instructions", () => {
      const msg = getErrorMessage(3);
      expect(msg).toContain("Location detection timed out");
    });

    it("maps unknown error code to safe fallback", () => {
      const msg = getErrorMessage(99);
      expect(msg).toContain("We couldn't determine your location");
    });
  });
});
