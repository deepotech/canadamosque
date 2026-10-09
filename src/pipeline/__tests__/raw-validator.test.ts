import { describe, it, expect } from "vitest";
import { validateRawRecord } from "../raw-validator";

describe("Raw Record Schema Validator", () => {
  it("approves valid raw records with required fields", () => {
    const valid = {
      title: "Toronto Mosque",
      address: "123 Main St, Toronto, ON",
      location: { lat: 43.65, lng: -79.38 },
    };
    const res = validateRawRecord(valid, 0);
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("fails when title is missing or whitespace only", () => {
    const invalid = {
      title: "   ",
      address: "123 Main St, Toronto, ON",
      location: { lat: 43.65, lng: -79.38 },
    };
    const res = validateRawRecord(invalid, 1);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("missing a title");
  });

  it("fails when address is missing", () => {
    const invalid = {
      title: "Test Mosque",
      location: { lat: 43.65, lng: -79.38 },
    };
    const res = validateRawRecord(invalid, 2);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("missing an address");
  });

  it("fails when coordinates are missing or NaN", () => {
    const invalid = {
      title: "Test Mosque",
      address: "123 Main St, Toronto, ON",
      location: { lat: NaN, lng: -79.38 },
    };
    const res = validateRawRecord(invalid, 3);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("missing or invalid coordinates");
  });

  it("gracefully rejects non-object inputs without crashing", () => {
    expect(validateRawRecord(null, 4).isValid).toBe(false);
    expect(validateRawRecord("string", 5).isValid).toBe(false);
    expect(validateRawRecord(undefined, 6).isValid).toBe(false);
  });
});
