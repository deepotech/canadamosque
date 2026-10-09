import { describe, it, expect } from "vitest";
import { CanonicalMosqueRepository } from "./canonical-repository";

describe("CanonicalMosqueRepository", () => {
  const repo = new CanonicalMosqueRepository();

  it("loads only published records from canonical dataset", async () => {
    const list = await repo.list();
    expect(list.length).toBe(331);
    // Every record in published list must be an active mosque domain entity
    for (const m of list) {
      expect(m.status).toBe("ACTIVE");
      expect(["ON", "BC", "AB", "QC", "MB"]).toContain(m.province);
      expect(m.coordinates.latitude).toBeGreaterThan(40.0);
      expect(m.coordinates.longitude).toBeLessThan(-50.0);
      // Zero fabrication verification:
      expect(m.iqamahSchedule).toBeNull();
      expect(m.jummahSchedule).toBeNull();
      expect(m.email).toBeNull();
    }
  });

  it("filters correctly by city in GTA", async () => {
    const torontoMosques = await repo.list({ city: "Toronto" });
    expect(torontoMosques.length).toBeGreaterThan(0);
    for (const m of torontoMosques) {
      expect(m.city.toLowerCase()).toBe("toronto");
    }

    const scarboroughMosques = await repo.list({ city: "Scarborough" });
    expect(scarboroughMosques.length).toBeGreaterThan(0);
    for (const m of scarboroughMosques) {
      expect(m.city.toLowerCase()).toBe("scarborough");
    }
  });

  it("finds nearby mosques sorted by Haversine distance", async () => {
    // Downtown Toronto coordinates
    const downtown = { latitude: 43.6532, longitude: -79.3832 };
    const nearby = await repo.findNearby(downtown, 5.0, 5); // 5km radius, max 5

    expect(nearby.length).toBeGreaterThan(0);
    expect(nearby.length).toBeLessThanOrEqual(5);

    // Verify distance sorting
    for (let i = 1; i < nearby.length; i++) {
      expect(nearby[i].distanceKm).toBeGreaterThanOrEqual(nearby[i - 1].distanceKm);
    }
  });

  it("retrieves distinct list of GTA pilot cities", async () => {
    const cities = await repo.getAllCities();
    expect(cities).toContain("Toronto");
    expect(cities).toContain("Scarborough");
    expect(cities).toContain("Etobicoke");
    expect(cities).toContain("North York");
  });
});
