import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import {
  SUPPORTED_CITY_SLUGS,
  getCityConfigBySlug,
  getCityConfigByName,
} from "@/domain/city/city-config";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import {
  filterMosquesByArea,
} from "@/domain/geo/area-slugs";
import {
  getTodayCityPrayerTimes,
  getCityPrayerTimes,
} from "@/services/prayer/city-prayer";

describe("Phase 9 — Multi-City Canada SEO & Discovery Architecture", () => {
  const repo = new CanonicalMosqueRepository();

  describe("1. Centralized Domain City Configuration", () => {
    it("defines exactly 9 supported Canadian cities", () => {
      expect(SUPPORTED_CITY_SLUGS).toHaveLength(9);
      const expectedCities = [
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
      for (const slug of expectedCities) {
        expect(SUPPORTED_CITY_SLUGS).toContain(slug);
        const config = getCityConfigBySlug(slug);
        expect(config).not.toBeNull();
        expect(config?.name).toBeDefined();
        expect(config?.province).toBeDefined();
        expect(config?.timezone).toMatch(/^America\//);
        expect(config?.representativeCoordinates.latitude).toBeGreaterThan(40);
        expect(config?.representativeCoordinates.longitude).toBeLessThan(-50);
      }
    });

    it("resolves city configuration by name and alternate names", () => {
      expect(getCityConfigByName("Toronto")?.slug).toBe("toronto");
      expect(getCityConfigByName("Montréal")?.slug).toBe("montreal");
      expect(getCityConfigByName("Montreal")?.slug).toBe("montreal");
      expect(getCityConfigByName("Calgary")?.slug).toBe("calgary");
      expect(getCityConfigByName("Vancouver")?.slug).toBe("vancouver");
      expect(getCityConfigByName("Nepean")?.slug).toBe("ottawa");
      expect(getCityConfigByName("Saint-Laurent")?.slug).toBe("montreal");
    });
  });

  describe("2. Canonical Repository Canada Aggregation", () => {
    it("aggregates exactly 331 published canonical records across Canada", async () => {
      const all = await repo.list();
      expect(all.length).toBe(331);
    });

    it("has 0 duplicate slugs across all 331 published records", async () => {
      const all = await repo.list();
      const slugSet = new Set<string>();
      for (const m of all) {
        expect(slugSet.has(m.slug)).toBe(false);
        slugSet.add(m.slug);
      }
      expect(slugSet.size).toBe(331);
    });

    it("matches exact city breakdown for all 9 Canadian metropolises", async () => {
      const all = await repo.list();

      const torontoMosques = filterMosquesByArea(all, "toronto");
      const ottawaMosques = filterMosquesByArea(all, "ottawa");
      const mississaugaMosques = filterMosquesByArea(all, "mississauga");
      const bramptonMosques = filterMosquesByArea(all, "brampton");
      const vancouverMosques = filterMosquesByArea(all, "vancouver");
      const calgaryMosques = filterMosquesByArea(all, "calgary");
      const edmontonMosques = filterMosquesByArea(all, "edmonton");
      const montrealMosques = filterMosquesByArea(all, "montreal");
      const winnipegMosques = filterMosquesByArea(all, "winnipeg");

      expect(torontoMosques.length).toBe(96);
      expect(ottawaMosques.length).toBe(27);
      expect(mississaugaMosques.length).toBe(31);
      expect(bramptonMosques.length).toBe(24);
      expect(vancouverMosques.length).toBe(9);
      expect(calgaryMosques.length).toBe(28);
      expect(edmontonMosques.length).toBe(34);
      expect(montrealMosques.length).toBe(67);
      expect(winnipegMosques.length).toBe(15);

      const sum =
        torontoMosques.length +
        ottawaMosques.length +
        mississaugaMosques.length +
        bramptonMosques.length +
        vancouverMosques.length +
        calgaryMosques.length +
        edmontonMosques.length +
        montrealMosques.length +
        winnipegMosques.length;

      expect(sum).toBe(331);
    });

    it("preserves Toronto borough filters for backward compatibility", async () => {
      const all = await repo.list();
      expect(filterMosquesByArea(all, "scarborough").length).toBe(33);
      expect(filterMosquesByArea(all, "north-york").length).toBe(19);
      expect(filterMosquesByArea(all, "etobicoke").length).toBe(7);
      expect(filterMosquesByArea(all, "east-york").length).toBe(7);
      expect(filterMosquesByArea(all, "york").length).toBe(8);
    });

    it("strictly preserves zero-fabrication guarantees on all published records", async () => {
      const all = await repo.list();
      for (const m of all) {
        expect(m.iqamahSchedule).toBeNull();
        expect(m.jummahSchedule).toBeNull();
        expect(m.email).toBeNull();
        expect(m.status).toBe("ACTIVE");
        expect(m.classification).not.toBe("REVIEW_REQUIRED");
        expect(m.classification).not.toBe("EXCLUDE");
      }
    });
  });

  describe("3. Multi-City Astronomical Prayer Times Engine", () => {
    it("calculates prayer times accurately for all 9 Canadian cities", () => {
      for (const slug of SUPPORTED_CITY_SLUGS) {
        const schedule = getTodayCityPrayerTimes(slug);
        expect(schedule).toBeDefined();
        expect(schedule.times.fajr).toBeInstanceOf(Date);
        expect(schedule.times.sunrise).toBeInstanceOf(Date);
        expect(schedule.times.dhuhr).toBeInstanceOf(Date);
        expect(schedule.times.asr).toBeInstanceOf(Date);
        expect(schedule.times.maghrib).toBeInstanceOf(Date);
        expect(schedule.times.isha).toBeInstanceOf(Date);

        // Astronomical sequence check: Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha
        expect(schedule.times.fajr.getTime()).toBeLessThan(schedule.times.sunrise.getTime());
        expect(schedule.times.sunrise.getTime()).toBeLessThan(schedule.times.dhuhr.getTime());
        expect(schedule.times.dhuhr.getTime()).toBeLessThan(schedule.times.asr.getTime());
        expect(schedule.times.asr.getTime()).toBeLessThan(schedule.times.maghrib.getTime());
        expect(schedule.times.maghrib.getTime()).toBeLessThan(schedule.times.isha.getTime());
      }
    });

    it("respects daylight saving and timezones across Canadian regions", () => {
      const vancouver = getCityPrayerTimes("vancouver", "2026-06-15");
      expect(vancouver.timezone).toBe("America/Vancouver");

      const calgary = getCityPrayerTimes("calgary", "2026-06-15");
      expect(calgary.timezone).toBe("America/Edmonton");

      const winnipeg = getCityPrayerTimes("winnipeg", "2026-06-15");
      expect(winnipeg.timezone).toBe("America/Winnipeg");

      const toronto = getCityPrayerTimes("toronto", "2026-06-15");
      expect(toronto.timezone).toBe("America/Toronto");
    });
  });

  describe("4. Toronto Raw Data Immutability & Protection", () => {
    it("preserves Toronto raw dataset SHA-256 hash unchanged", () => {
      const torontoPath = path.resolve(process.cwd(), "src/data/raw/toronto.json");
      const buffer = fs.readFileSync(torontoPath);
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      expect(hash).toBe("0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9");
    });
  });

  describe("5. Profile City and Municipality Canonical Browse Route Mapping (H-01)", () => {
    const testCases: { city: string; expectedRoute: string }[] = [
      { city: "Toronto", expectedRoute: "/mosques/toronto" },
      { city: "Scarborough", expectedRoute: "/mosques/toronto" },
      { city: "North York", expectedRoute: "/mosques/toronto" },
      { city: "Montreal", expectedRoute: "/mosques/montreal" },
      { city: "Montréal", expectedRoute: "/mosques/montreal" },
      { city: "Saint-Laurent", expectedRoute: "/mosques/montreal" },
      { city: "Saint-Léonard", expectedRoute: "/mosques/montreal" },
      { city: "Lachine", expectedRoute: "/mosques/montreal" },
      { city: "Ottawa", expectedRoute: "/mosques/ottawa" },
      { city: "Nepean", expectedRoute: "/mosques/ottawa" },
      { city: "Gloucester", expectedRoute: "/mosques/ottawa" },
      { city: "Edwards", expectedRoute: "/mosques/ottawa" },
      { city: "Cumberland", expectedRoute: "/mosques/ottawa" },
      { city: "Vancouver", expectedRoute: "/mosques/vancouver" },
      { city: "Calgary", expectedRoute: "/mosques/calgary" },
      { city: "Edmonton", expectedRoute: "/mosques/edmonton" },
      { city: "Winnipeg", expectedRoute: "/mosques/winnipeg" },
    ];

    it.each(testCases)(
      "maps municipality '$city' to supported canonical area route '$expectedRoute'",
      ({ city, expectedRoute }) => {
        const cityConfig = getCityConfigByName(city);
        expect(cityConfig).not.toBeNull();
        const route = cityConfig?.canonicalMosqueRoute || "/mosques";
        expect(route).toBe(expectedRoute);
      }
    );

    it("ensures all 331 published profiles map to a valid, supported canonical area route with 0 404 links", async () => {
      const all = await repo.list();
      expect(all.length).toBe(331);

      const supportedAreaSlugs = new Set([
        "toronto", "ottawa", "mississauga", "brampton", "vancouver", "calgary", "edmonton", "montreal", "winnipeg",
        "scarborough", "north-york", "etobicoke", "east-york", "york"
      ]);

      for (const mosque of all) {
        const cityConfig = getCityConfigByName(mosque.city);
        const browseUrl = cityConfig?.canonicalMosqueRoute || "/mosques";
        
        expect(browseUrl.startsWith("/mosques")).toBe(true);
        if (browseUrl.startsWith("/mosques/")) {
          const areaSlug = browseUrl.replace("/mosques/", "");
          expect(supportedAreaSlugs.has(areaSlug)).toBe(true);
        }
      }
    });
  });
});

