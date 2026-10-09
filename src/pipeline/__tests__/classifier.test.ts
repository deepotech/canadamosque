import { describe, it, expect } from "vitest";
import { classifyRecord } from "../classifier";
import { evaluateQualityFlags } from "../quality-checker";

describe("Classifier and Quality Checks", () => {
  it("classifies dedicated Mosques correctly", () => {
    expect(classifyRecord({ title: "Birmingham Masjid" }).classification).toBe(
      "MOSQUE"
    );
    expect(
      classifyRecord({
        title: "Albanian Mosque - Albanian Muslim Society of Toronto Inc.",
      }).classification
    ).toBe("MOSQUE");
    expect(
      classifyRecord({ title: "Madinah Masjid (Mosque)" }).classification
    ).toBe("MOSQUE");
  });

  it("classifies major Islamic Centres correctly", () => {
    expect(
      classifyRecord({ title: "Bosnian Islamic Centre" }).classification
    ).toBe("ISLAMIC_CENTER");
    expect(
      classifyRecord({ title: "Salaheddin Islamic Centre" }).classification
    ).toBe("ISLAMIC_CENTER");
  });

  it("classifies Musallas and storefront prayer halls correctly", () => {
    expect(
      classifyRecord({ title: "463 Gerrard St E Musallah" }).classification
    ).toBe("MUSALLA");
    expect(
      classifyRecord({ title: "2nd floor Musalla" }).classification
    ).toBe("MUSALLA");
  });

  it("classifies campus and student prayer rooms as PRAYER_ROOM", () => {
    expect(
      classifyRecord({
        title: "George Brown - Multi Faith Room (Room 361)",
      }).classification
    ).toBe("PRAYER_ROOM");
    expect(
      classifyRecord({
        title: "Musallah Student Union",
      }).classification
    ).toBe("PRAYER_ROOM");
  });

  it("classifies dedicated Friday Jummah locations", () => {
    expect(
      classifyRecord({ title: "Jummah Prayer Hall Etobicoke" }).classification
    ).toBe("JUMMAH_LOCATION");
    expect(
      classifyRecord({ title: "Muslim Prayer room Fridays" }).classification
    ).toBe("JUMMAH_LOCATION");
  });

  it("classifies administrative and non-profit organizations as ORGANIZATION", () => {
    expect(
      classifyRecord({
        title: "Hilal Committee of Metropolitan Toronto & Vicinity",
      }).classification
    ).toBe("ORGANIZATION");
    expect(
      classifyRecord({
        title: "Quraan and Hadeeth Society of Canada",
      }).classification
    ).toBe("ORGANIZATION");
    expect(
      classifyRecord({
        title: "Khalid Youth Program",
      }).classification
    ).toBe("ORGANIZATION");
  });

  it("excludes non-prayer healthcare and commercial facilities", () => {
    expect(
      classifyRecord({
        title: "CML HealthCare Inc.",
        categoryName: "Medical Center",
        categories: ["Medical Center", "Mosque"],
      }).classification
    ).toBe("EXCLUDE");
  });

  it("flags generic names for manual review", () => {
    const flags = evaluateQualityFlags({ title: "Masjid" }, "MOSQUE");
    expect(flags).toContain("GENERIC_NAME");
  });

  it("flags records with review closure reports", () => {
    const raw = {
      title: "Masjid e Mohammad",
      reviews: [
        { text: "this is not a mosque anymore" },
        { text: "it's closed permanently" },
      ],
    };
    const flags = evaluateQualityFlags(raw, "MOSQUE");
    expect(flags).toContain("POSSIBLE_CLOSED_LOCATION");
    expect(flags).toContain("POSSIBLE_NOT_A_MOSQUE");
  });
});
