import { describe, it, expect } from "vitest";
import {
  generateMosqueJsonLd,
  generateBreadcrumbJsonLd,
  generateWebSiteJsonLd,
  generateWebPageJsonLd,
  generateFaqJsonLd,
} from "./schema";
import { Mosque } from "../mosque/types";

describe("SEO JSON-LD Generators", () => {
  const sampleMosque: Mosque = {
    id: "m-1",
    name: "Toronto Central Mosque",
    slug: "toronto-central-mosque",
    address: "100 Queen St W, Toronto, ON",
    city: "Toronto",
    province: "ON",
    postalCode: "M5H 2N2",
    coordinates: { latitude: 43.6525, longitude: -79.3835 },
    timezone: "America/Toronto",
    phone: "416-555-0199",
    website: "https://torontocentralmosque.ca",
    email: null,
    classification: "MOSQUE",
    status: "ACTIVE",
    facilities: {
      wuduArea: true,
      womenPrayerSection: true,
      parkingAvailable: true,
      wheelchairAccessible: true,
      dailyPrayersHeld: true,
      notes: null,
    },
    openingHours: null,
    iqamahSchedule: null,
    jummahSchedule: null,
    sourceMetadata: {
      sourceName: "google_places",
      confidenceScore: 0.9,
      lastIngestedAt: "2026-10-06T20:00:00Z",
      lastVerifiedAt: null,
    },
    createdAt: "2026-10-06T20:00:00Z",
    updatedAt: "2026-10-06T20:00:00Z",
  };

  it("generates valid Mosque schema", () => {
    const jsonLd = generateMosqueJsonLd(sampleMosque);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Mosque");
    expect(jsonLd.name).toBe("Toronto Central Mosque");
    expect((jsonLd.geo as { latitude: number }).latitude).toBe(43.6525);
    expect((jsonLd.address as { addressCountry: string }).addressCountry).toBe("CA");
    expect(jsonLd.sameAs).toEqual(["https://torontocentralmosque.ca"]);
  });

  it("generates valid BreadcrumbList schema", () => {
    const jsonLd = generateBreadcrumbJsonLd([
      { name: "Home", item: "/" },
      { name: "Ontario", item: "/mosques/on" },
      { name: "Toronto", item: "/mosques/toronto" },
    ]);
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    const list = jsonLd.itemListElement as Array<{ position: number; name: string }>;
    expect(list).toHaveLength(3);
    expect(list[0].position).toBe(1);
    expect(list[2].name).toBe("Toronto");
  });

  it("generates valid WebSite schema with SearchAction", () => {
    const jsonLd = generateWebSiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.inLanguage).toBe("en-CA");
    expect((jsonLd as Record<string, unknown>).potentialAction).toBeDefined();
    expect((jsonLd as Record<string, Record<string, unknown>>).potentialAction["@type"]).toBe("SearchAction");
  });

  it("generates valid WebPage schema", () => {
    const jsonLd = generateWebPageJsonLd({
      title: "Test Page",
      description: "Test description",
      url: "/test-page"
    });
    expect(jsonLd["@type"]).toBe("WebPage");
    expect(jsonLd.name).toBe("Test Page");
    expect(jsonLd.description).toBe("Test description");
    expect(jsonLd.url as string).toContain("/test-page");
  });

  it("does not include fake ratings in Mosque schema", () => {
    const jsonLd = generateMosqueJsonLd(sampleMosque);
    expect((jsonLd as Record<string, unknown>).aggregateRating).toBeUndefined();
    expect((jsonLd as Record<string, unknown>).review).toBeUndefined();
  });

  it("generates valid FAQPage schema matching questions and answers", () => {
    const faqSchema = generateFaqJsonLd([
      { question: "How do I find a mosque near me?", answer: "Use our geolocated finder." },
    ]);
    expect(faqSchema["@type"]).toBe("FAQPage");
    expect(Array.isArray(faqSchema.mainEntity)).toBe(true);
    const questions = faqSchema.mainEntity as Array<{ "@type": string; name: string; acceptedAnswer: { text: string } }>;
    expect(questions[0]["@type"]).toBe("Question");
    expect(questions[0].name).toBe("How do I find a mosque near me?");
    expect(questions[0].acceptedAnswer.text).toBe("Use our geolocated finder.");
  });
});


