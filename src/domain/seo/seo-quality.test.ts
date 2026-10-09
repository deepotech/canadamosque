import { describe, it, expect } from "vitest";
import { metadata as torontoMetadata } from "@/app/prayer-times/toronto/page";
import { metadata as mosquesMetadata } from "@/app/mosques/page";

describe("SEO Quality & Integrity", () => {
  it("never claims estimated Iqamah on prayer time pages", () => {
    // Test the metadata exported from the Toronto prayer times page
    expect(torontoMetadata.title?.toString()).not.toMatch(/iqamah/i);
    expect(torontoMetadata.description).not.toMatch(/iqamah/i);
    expect(torontoMetadata.title?.toString()).not.toMatch(/congregation/i);
    expect(torontoMetadata.description).toMatch(/calculated/i);
  });
  
  it("never uses fake ratings in standard metadata", () => {
    expect(mosquesMetadata.description).not.toMatch(/stars|rating/i);
  });
});
