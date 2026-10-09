import { describe, it, expect } from "vitest";
import {
  cityToAreaSlug,
  areaSlugToCity,
  getSupportedAreaSlugs,
  SUPPORTED_CITIES,
} from "./area-slugs";

describe("Area Slugs", () => {
  it("converts city to area slug correctly", () => {
    expect(cityToAreaSlug("North York")).toBe("north-york");
    expect(cityToAreaSlug("Toronto")).toBe("toronto");
    expect(cityToAreaSlug("East York")).toBe("east-york");
  });

  it("reverses slug to city correctly", () => {
    expect(areaSlugToCity("north-york")).toBe("North York");
    expect(areaSlugToCity("toronto")).toBe("Toronto");
  });

  it("returns null for unsupported slugs", () => {
    expect(areaSlugToCity("tokyo")).toBeNull();
    expect(areaSlugToCity("invalid-slug")).toBeNull();
  });

  it("returns all supported slugs", () => {
    const slugs = getSupportedAreaSlugs();
    expect(slugs).toHaveLength(SUPPORTED_CITIES.length);
    expect(slugs).toContain("toronto");
    expect(slugs).toContain("scarborough");
  });
});
