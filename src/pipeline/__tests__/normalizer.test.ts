import { describe, it, expect } from "vitest";
import {
  extractAndNormalizePostalCode,
  generateSlug,
  normalizeAddress,
  normalizeOpeningHours,
  normalizePhone,
  normalizeText,
  normalizeWebsite,
  extractFacilities,
} from "../normalizer";

describe("Data Normalizer", () => {
  describe("Text & Slug Normalization", () => {
    it("cleans excessive whitespace and smart quotes", () => {
      expect(normalizeText("  Masjid   Al-’Noor “Downtown”  ")).toBe(
        "Masjid Al-'Noor \"Downtown\""
      );
    });

    it("generates deterministic URL slugs handling punctuation and symbols", () => {
      expect(generateSlug("Albanian Mosque - Society")).toBe(
        "albanian-mosque-society"
      );
      expect(generateSlug("Quraan & Hadeeth Society")).toBe(
        "quraan-and-hadeeth-society"
      );
      expect(generateSlug("Masjid Al-Rasool Al-A'dham")).toBe(
        "masjid-al-rasool-al-adham"
      );
      expect(generateSlug("Madinah Masjid (Mosque)", "Toronto")).toBe(
        "madinah-masjid-mosque-toronto"
      );
    });
  });

  describe("Canadian Postal Code Normalization", () => {
    it("extracts and formats valid Canadian postal codes into standard A1A 1A1 format", () => {
      const res = extractAndNormalizePostalCode(
        "270 Birmingham St, Etobicoke, ON M8V 2E4, Canada"
      );
      expect(res.raw).toBe("M8V 2E4");
      expect(res.normalized).toBe("M8V 2E4");
    });

    it("normalizes unspaced or lowercase postal codes", () => {
      const res = extractAndNormalizePostalCode("123 Street, Toronto, ON m5a2h1");
      expect(res.raw).toBe("m5a 2h1");
      expect(res.normalized).toBe("M5A 2H1");
    });

    it("handles partial FSA gracefully without fabricating complete postal code", () => {
      const res = extractAndNormalizePostalCode(
        "747 Don Mills Rd., North York, ON M3C, Canada"
      );
      expect(res.raw).toBe("M3C");
      expect(res.normalized).toBeNull();
    });

    it("returns null for address with no postal code", () => {
      const res = extractAndNormalizePostalCode("Somewhere in Canada");
      expect(res.raw).toBeNull();
      expect(res.normalized).toBeNull();
    });
  });

  describe("Phone Number Normalization", () => {
    it("normalizes North American numbers to E.164 (+1XXXXXXXXXX)", () => {
      const res1 = normalizePhone("+1 416-255-8338");
      expect(res1?.raw).toBe("+1 416-255-8338");
      expect(res1?.normalized).toBe("+14162558338");

      const res2 = normalizePhone("(647) 746-1322");
      expect(res2?.normalized).toBe("+16477461322");
    });

    it("returns null on missing or blank phone numbers without inventing values", () => {
      expect(normalizePhone("")).toBeNull();
      expect(normalizePhone(null)).toBeNull();
      expect(normalizePhone("   ")).toBeNull();
    });
  });

  describe("Website Normalization", () => {
    it("validates and normalizes valid web addresses", () => {
      expect(normalizeWebsite("https://example.com/mosque")).toBe(
        "https://example.com/mosque"
      );
      expect(normalizeWebsite("http://islamiccentre.ca")).toBe(
        "http://islamiccentre.ca/"
      );
    });

    it("returns null for missing or invalid URLs", () => {
      expect(normalizeWebsite("")).toBeNull();
      expect(normalizeWebsite("not-a-valid-url")).toBeNull();
      expect(normalizeWebsite(null)).toBeNull();
    });
  });

  describe("Address & GTA Geography", () => {
    it("preserves specific GTA municipalities accurately", () => {
      const addr1 = normalizeAddress(
        "270 Birmingham St, Etobicoke, ON M8V 2E4, Canada"
      );
      expect(addr1.city).toBe("Etobicoke");
      expect(addr1.province).toBe("ON");
      expect(addr1.country).toBe("CA");

      const addr2 = normalizeAddress(
        "3551 Victoria Park Ave, Scarborough, ON M1W 2H2, Canada"
      );
      expect(addr2.city).toBe("Scarborough");

      const addr3 = normalizeAddress(
        "99 Beverly Hills Dr, North York, ON M3L 1A2, Canada"
      );
      expect(addr3.city).toBe("North York");
    });

    it("handles complex multi-line commercial addresses", () => {
      const addr = normalizeAddress(
        "Concourse Level, North York Center, 5150 Yonge St Unit C37, North York, ON M2N 6L8, Canada"
      );
      expect(addr.city).toBe("North York");
      expect(addr.postalCode.normalized).toBe("M2N 6L8");
    });
  });

  describe("Opening Hours Normalization", () => {
    it("parses 24 hours and closed periods cleanly", () => {
      const raw = [
        { day: "Monday", hours: "Open 24 hours" },
        { day: "Tuesday", hours: "Closed" },
        { day: "Wednesday", hours: "9:00 AM – 9:00 PM" },
      ];
      const hours = normalizeOpeningHours(raw);
      expect(hours).not.toBeNull();
      expect(hours?.days[0].isOpen24Hours).toBe(true);
      expect(hours?.days[0].periods[0].openTime).toBe("00:00");
      expect(hours?.days[1].isClosed).toBe(true);
      expect(hours?.days[2].periods[0].openTime).toBe("09:00");
      expect(hours?.days[2].periods[0].closeTime).toBe("21:00");
    });

    it("returns null when raw hours are absent without guessing", () => {
      expect(normalizeOpeningHours(null)).toBeNull();
      expect(normalizeOpeningHours([])).toBeNull();
    });
  });

  describe("Facilities Zero-Fabrication Extraction", () => {
    it("extracts confirmed accessibility and parking from additionalInfo", () => {
      const raw = {
        additionalInfo: {
          Accessibility: [{ "Wheelchair accessible entrance": true }],
          Parking: [{ "Free parking lot": true }],
        },
      };
      const facilities = extractFacilities(raw);
      expect(facilities.wheelchairAccessible).toBe(true);
      expect(facilities.parkingAvailable).toBe(true);
      // In accordance with zero fabrication:
      expect(facilities.womenPrayerSection).toBeNull();
      expect(facilities.wuduArea).toBeNull();
      expect(facilities.dailyPrayersHeld).toBeNull();
    });
  });
});
