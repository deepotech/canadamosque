import { describe, it, expect } from "vitest";
import { runIngestionPipeline } from "../pipeline";

describe("Ingestion Pipeline End-to-End & Determinism", () => {
  const sampleRecords = [
    {
      title: "Birmingham Masjid",
      address: "270 Birmingham St, Etobicoke, ON M8V 2E4, Canada",
      location: { lat: 43.601, lng: -79.5175 },
      phone: "+1 416-255-0000",
      categoryName: "Mosque",
      categories: ["Mosque"],
      openingHours: [{ day: "Monday", hours: "Open 24 hours" }],
    },
    {
      title: "George Brown - Multi Faith Room (Room 361)",
      address: "3 Lower Jarvis St, Toronto, ON M5E 3Y5, Canada",
      location: { lat: 43.645, lng: -79.37 },
      categoryName: "Mosque",
      categories: ["Mosque"],
    },
    {
      title: "CML HealthCare Inc.",
      address: "491 Lawrence Ave W, North York, ON M5M 1C7, Canada",
      location: { lat: 43.722, lng: -79.418 },
      categoryName: "Medical Center",
      categories: ["Medical Center", "Mosque"],
    },
    {
      title: "Masjid e Mohammad",
      address: "123 Closed St, Toronto, ON M1B 2K3, Canada",
      location: { lat: 43.75, lng: -79.3 },
      categoryName: "Mosque",
      categories: ["Mosque"],
      reviews: [{ text: "this is not a mosque anymore" }],
    },
  ];

  it("partitions records strictly into PUBLISHED, REVIEW_REQUIRED, and EXCLUDED", () => {
    const res = runIngestionPipeline(sampleRecords, "test.json", "2026-10-06T00:00:00Z");

    expect(res.published.length).toBe(1);
    expect(res.published[0].name).toBe("Birmingham Masjid");
    expect(res.published[0].publicationStatus).toBe("PUBLISHED");

    expect(res.reviewRequired.length).toBe(2);
    // George Brown multi-faith room -> REVIEW_REQUIRED
    expect(
      res.reviewRequired.some((r) => r.name.includes("Multi Faith Room"))
    ).toBe(true);
    // Masjid e Mohammad (review reported not a mosque) -> REVIEW_REQUIRED
    expect(
      res.reviewRequired.some((r) => r.name.includes("Masjid e Mohammad"))
    ).toBe(true);

    expect(res.excluded.length).toBe(1);
    expect(res.excluded[0].name).toBe("CML HealthCare Inc.");
    expect(res.excluded[0].publicationStatus).toBe("EXCLUDED");
  });

  it("is 100% deterministic on repeated runs with fixed timestamp", () => {
    const run1 = runIngestionPipeline(sampleRecords, "test.json", "2026-10-06T00:00:00Z");
    const run2 = runIngestionPipeline(sampleRecords, "test.json", "2026-10-06T00:00:00Z");

    expect(run1.report.publishedCount).toBe(run2.report.publishedCount);
    expect(run1.report.reviewRequiredCount).toBe(run2.report.reviewRequiredCount);
    expect(run1.report.excludedCount).toBe(run2.report.excludedCount);
    expect(JSON.stringify(run1.published)).toBe(JSON.stringify(run2.published));
    expect(JSON.stringify(run1.reviewRequired)).toBe(JSON.stringify(run2.reviewRequired));
    expect(JSON.stringify(run1.excluded)).toBe(JSON.stringify(run2.excluded));
  });

  it("maintains strict zero-fabrication and preserves nulls", () => {
    const res = runIngestionPipeline(sampleRecords, "test.json", "2026-10-06T00:00:00Z");
    const published = res.published[0];

    // Phone is present, but website is missing in raw:
    expect(published.phone?.normalized).toBe("+14162550000");
    expect(published.website).toBeNull();
    // Unmentioned facilities must remain null:
    expect(published.facilities.womenPrayerSection).toBeNull();
    expect(published.facilities.wuduArea).toBeNull();
  });
});
