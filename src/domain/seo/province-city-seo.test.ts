import { describe, it, expect } from "vitest";
import {
  PROVINCE_SLUGS,
  getProvinceBySlug,
  getProvinceByCode,
  getAllProvinces,
  isCityEligibleForSeo,
  isProvinceEligibleForSeo,
  generateProvinceMetadata,
  generateCityMetadata,
  generateProvincesHubMetadata,
  getRelatedCities,
} from "./province-city-seo";
import { constructMetadata } from "./metadata";
import {
  generateProvinceCollectionJsonLd,
  generateCityCollectionJsonLd,
} from "./schema";
import sitemap from "@/app/sitemap";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { siteConfig } from "@/config/site";
import { SUPPORTED_CITY_SLUGS, CANADIAN_CITIES } from "@/domain/city/city-config";
import { generateMetadata as generateAreaMetadata } from "@/app/mosques/[area]/page";

describe("Canadian Geographic SEO Architecture & Parity", () => {
  const repo = new CanonicalMosqueRepository();

  describe("Province and City Registries", () => {
    it("defines all 5 active Canadian provinces with valid configurations", () => {
      const provinces = getAllProvinces();
      expect(provinces).toHaveLength(5);
      expect(PROVINCE_SLUGS).toEqual([
        "ontario",
        "quebec",
        "alberta",
        "british-columbia",
        "manitoba",
      ]);

      for (const prov of provinces) {
        expect(prov.name).toBeTruthy();
        expect(prov.code).toBeTruthy();
        expect(prov.slug).toBeTruthy();
        expect(prov.capital).toBeTruthy();
        expect(prov.majorCitySlugs.length).toBeGreaterThan(0);
        expect(prov.description).toBeTruthy();
      }
    });

    it("retrieves province by slug and by code correctly", () => {
      expect(getProvinceBySlug("ontario")?.code).toBe("ON");
      expect(getProvinceBySlug("quebec")?.code).toBe("QC");
      expect(getProvinceByCode("ON")?.slug).toBe("ontario");
      expect(getProvinceByCode("qc")?.slug).toBe("quebec");
      expect(getProvinceBySlug("non-existent")).toBeNull();
    });

    it("verifies all 9 supported cities map to valid Canadian provinces", () => {
      for (const citySlug of SUPPORTED_CITY_SLUGS) {
        const city = CANADIAN_CITIES[citySlug];
        expect(city).toBeDefined();
        const prov = getProvinceByCode(city.province);
        expect(prov, `City ${city.name} must map to valid province ${city.province}`).not.toBeNull();
      }
    });

    it("asserts all 9 cities meet Tier A SEO threshold (>= 5 mosques)", async () => {
      for (const citySlug of SUPPORTED_CITY_SLUGS) {
        const mosques = await repo.getMosquesByCity(citySlug);
        expect(
          mosques.length,
          `City ${citySlug} must have at least 5 mosques for standalone SEO landing page`
        ).toBeGreaterThanOrEqual(5);
        expect(isCityEligibleForSeo(mosques.length)).toBe(true);
      }
    });

    it("correctly rejects sub-threshold counts under Tier A policy", () => {
      expect(isCityEligibleForSeo(4)).toBe(false);
      expect(isCityEligibleForSeo(1)).toBe(false);
      expect(isCityEligibleForSeo(0)).toBe(false);
      expect(isCityEligibleForSeo(5)).toBe(true);
      expect(isCityEligibleForSeo(10)).toBe(true);
    });

    it("asserts all 5 provinces meet province SEO threshold", async () => {
      for (const prov of getAllProvinces()) {
        const mosques = await repo.getMosquesByProvince(prov.code);
        expect(mosques.length).toBeGreaterThanOrEqual(5);
        expect(isProvinceEligibleForSeo(mosques.length)).toBe(true);
      }
    });
  });

  describe("Metadata Generation & De-duplication", () => {
    it("generates unique metadata for every Canadian province", async () => {
      const titles = new Set<string>();
      const descriptions = new Set<string>();

      for (const prov of getAllProvinces()) {
        const mosques = await repo.getMosquesByProvince(prov.code);
        const meta = generateProvinceMetadata(prov.slug, mosques.length);
        const title = String(meta.title);
        const desc = String(meta.description);

        expect(title).toContain(prov.name);
        expect(title).toContain(siteConfig.name);
        expect(desc).toContain(prov.name);
        expect(String(meta.alternates?.canonical)).toBe(`${siteConfig.url}/provinces/${prov.slug}`);

        titles.add(title);
        descriptions.add(desc);
      }

      expect(titles.size).toBe(5);
      expect(descriptions.size).toBe(5);
    });

    it("generates unique metadata for every Canadian city", async () => {
      const titles = new Set<string>();
      const descriptions = new Set<string>();

      for (const citySlug of SUPPORTED_CITY_SLUGS) {
        const mosques = await repo.getMosquesByCity(citySlug);
        const meta = generateCityMetadata(citySlug, mosques.length);
        const title = String(meta.title);
        const desc = String(meta.description);
        const cityConfig = CANADIAN_CITIES[citySlug];

        expect(title).toContain(cityConfig.name);
        expect(title).toContain(siteConfig.name);
        expect(desc).toContain(cityConfig.name);
        expect(String(meta.alternates?.canonical)).toBe(`${siteConfig.url}/cities/${citySlug}`);

        titles.add(title);
        descriptions.add(desc);
      }

      expect(titles.size).toBe(9);
      expect(descriptions.size).toBe(9);
    });

    it("generates valid metadata for provinces hub page", () => {
      const meta = generateProvincesHubMetadata(5, 331);
      expect(String(meta.title)).toContain("Canadian Mosques by Province");
      expect(String(meta.title)).toContain("331 Locations");
      expect(String(meta.alternates?.canonical)).toBe(`${siteConfig.url}/provinces`);
    });

    it("strips duplicate brand suffix in constructMetadata to avoid double-branding", () => {
      const single = constructMetadata({ title: "Toronto Mosques" });
      expect(String(single.title)).toBe(`Toronto Mosques | ${siteConfig.name}`);

      // When caller accidentally already passed the brand suffix
      const alreadyBranded = constructMetadata({
        title: `Toronto Mosques | ${siteConfig.name}`,
      });
      expect(String(alreadyBranded.title)).toBe(`Toronto Mosques | ${siteConfig.name}`);
      expect(String(alreadyBranded.title)).not.toContain(
        `${siteConfig.name} | ${siteConfig.name}`
      );
    });

    it("sets robots directives with max-image-preview: large for indexable pages", () => {
      const meta = constructMetadata({ title: "Test" });
      const googleBot = (meta.robots as { googleBot?: Record<string, unknown> })?.googleBot;
      expect(googleBot?.index).toBe(true);
      expect(googleBot?.follow).toBe(true);
      expect(googleBot?.["max-image-preview"]).toBe("large");
    });

    it("preserves follow: true when noIndex is true for discoverability", () => {
      const meta = constructMetadata({ title: "Utility", noIndex: true });
      const robots = meta.robots as { index?: boolean; follow?: boolean };
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(true); // allows crawlers to follow links to canonical targets
    });
  });

  describe("Route Cannibalization & Canonicalization Protection", () => {
    it("canonicalizes all 9 metropolis /mosques/[area] routes to their corresponding /cities/[area]", async () => {
      for (const city of SUPPORTED_CITY_SLUGS) {
        const meta = await generateAreaMetadata({ params: Promise.resolve({ area: city }) });
        expect(
          String(meta.alternates?.canonical),
          `/mosques/${city} must canonicalize to /cities/${city}`
        ).toBe(`${siteConfig.url}/cities/${city}`);
      }
    });

    it("preserves self-canonical for non-metropolis Toronto boroughs", async () => {
      const boroughs = ["scarborough", "north-york", "etobicoke", "east-york", "york"];
      for (const b of boroughs) {
        const meta = await generateAreaMetadata({ params: Promise.resolve({ area: b }) });
        expect(
          String(meta.alternates?.canonical),
          `/mosques/${b} must preserve self-canonical`
        ).toBe(`${siteConfig.url}/mosques/${b}`);
      }
    });
  });

  describe("Structured Data (Schema.org)", () => {
    it("generates valid CollectionPage / ItemList schema for provinces", async () => {
      const ontarioMosques = await repo.getMosquesByProvince("ON");
      const schema = generateProvinceCollectionJsonLd({
        provinceName: "Ontario",
        provinceSlug: "ontario",
        totalMosques: ontarioMosques.length,
        featuredMosques: ontarioMosques.slice(0, 10).map((m) => ({ name: m.name, slug: m.slug })),
      });

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("CollectionPage");
      expect(schema.name).toBe("Mosques in Ontario");
      expect(schema.url).toBe(`${siteConfig.url}/provinces/ontario`);

      const mainEntity = schema.mainEntity as Record<string, unknown>;
      expect(mainEntity["@type"]).toBe("ItemList");
      expect(mainEntity.numberOfItems).toBe(ontarioMosques.length);
      const items = mainEntity.itemListElement as Array<{ position: number; name: string; url: string }>;
      expect(items).toHaveLength(10);
      expect(items[0].url).toMatch(/^https:\/\//);
      expect(items[0].position).toBe(1);
    });

    it("generates valid CollectionPage / ItemList schema for cities", async () => {
      const calgaryMosques = await repo.getMosquesByCity("calgary");
      const schema = generateCityCollectionJsonLd({
        cityName: "Calgary",
        provinceName: "Alberta",
        citySlug: "calgary",
        totalMosques: calgaryMosques.length,
        mosques: calgaryMosques.map((m) => ({ name: m.name, slug: m.slug })),
      });

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("CollectionPage");
      expect(schema.name).toBe("Mosques in Calgary, Alberta");
      expect(schema.url).toBe(`${siteConfig.url}/cities/calgary`);

      const mainEntity = schema.mainEntity as Record<string, unknown>;
      expect(mainEntity["@type"]).toBe("ItemList");
      expect(mainEntity.numberOfItems).toBe(calgaryMosques.length);
    });
  });

  describe("Sitemap Integrity & Exclusion Filtering", () => {
    it("generates 100% HTTPS URLs with canonical domain and no duplicates", async () => {
      const entries = await sitemap();
      expect(entries.length).toBe(365);

      const urlSet = new Set<string>();
      for (const entry of entries) {
        expect(entry.url).toMatch(/^https:\/\/canadamosquenearme\.ca/);
        expect(entry.url).not.toContain("http://");
        expect(urlSet.has(entry.url), `Duplicate URL in sitemap: ${entry.url}`).toBe(false);
        urlSet.add(entry.url);
      }
    });

    it("includes all 5 province URLs and 9 city URLs in sitemap", async () => {
      const entries = await sitemap();
      const urls = new Set(entries.map((e) => e.url));

      for (const p of PROVINCE_SLUGS) {
        expect(urls.has(`${siteConfig.url}/provinces/${p}`)).toBe(true);
      }

      for (const c of SUPPORTED_CITY_SLUGS) {
        expect(urls.has(`${siteConfig.url}/cities/${c}`)).toBe(true);
      }
    });

    it("excludes non-canonical metropolis /mosques/[city] routes from sitemap", async () => {
      const entries = await sitemap();
      const urls = new Set(entries.map((e) => e.url));

      // Metropolises should be in sitemap via /cities/* only
      for (const c of SUPPORTED_CITY_SLUGS) {
        expect(urls.has(`${siteConfig.url}/mosques/${c}`)).toBe(false);
      }
    });

    it("includes preserved Toronto borough routes in sitemap", async () => {
      const entries = await sitemap();
      const urls = new Set(entries.map((e) => e.url));

      // Toronto boroughs have no /cities/ page, so they remain canonical in sitemap
      const boroughs = ["scarborough", "north-york", "etobicoke", "east-york", "york"];
      for (const b of boroughs) {
        expect(urls.has(`${siteConfig.url}/mosques/${b}`)).toBe(true);
      }
    });

    it("excludes utility page /mosque-near-me from sitemap", async () => {
      const entries = await sitemap();
      const urls = entries.map((e) => e.url);
      expect(urls).not.toContain(`${siteConfig.url}/mosque-near-me`);
    });

    it("verifies no review-required or excluded records exist in sitemap", async () => {
      const entries = await sitemap();
      const urls = entries.map((e) => e.url);

      // Verify each mosque in the sitemap is a verified published record
      const allPublished = await repo.list();
      const publishedSlugs = new Set(allPublished.map((m) => m.slug));

      const mosqueUrls = urls.filter((u) => u.includes("/mosque/"));
      expect(mosqueUrls.length).toBe(331);

      for (const url of mosqueUrls) {
        const slug = url.split("/mosque/")[1];
        expect(publishedSlugs.has(slug)).toBe(true);
      }
    });

    it("uses deterministic BUILD_DATE instead of current timestamp", async () => {
      const entries = await sitemap();
      const homeEntry = entries.find((e) => e.url === `${siteConfig.url}/`);
      expect(homeEntry?.lastModified).toEqual(new Date("2026-11-08"));
    });
  });

  describe("Internal Linking & Geographic Relationships", () => {
    it("returns related sibling cities in same province or nearby Canadian metropolises", () => {
      const gtaRelated = getRelatedCities("toronto", 3);
      expect(gtaRelated.length).toBe(3);
      // Related for Toronto should prefer Ontario siblings (Mississauga, Brampton, Ottawa)
      const siblingProvinces = gtaRelated.map((c) => c.province);
      expect(siblingProvinces).toContain("ON");
      expect(gtaRelated.some((c) => c.slug === "toronto")).toBe(false);
    });

    it("returns Calgary as related city for Edmonton", () => {
      const edmontonRelated = getRelatedCities("edmonton", 4);
      expect(edmontonRelated.some((c) => c.slug === "calgary")).toBe(true);
    });
  });
});
