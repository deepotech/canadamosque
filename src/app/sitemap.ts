import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { getSupportedAreaSlugs, getAreaBySlug } from "@/domain/geo/area-slugs";
import { SUPPORTED_CITY_SLUGS } from "@/domain/city/city-config";
import { PROVINCE_SLUGS } from "@/domain/seo/province-city-seo";

/**
 * Deterministic build-time date used as lastModified for sitemap entries.
 *
 * Rationale: Dynamic new Date() timestamps on every deployment falsely signal
 * to crawlers that all static pages have changed, wasting crawl budget.
 * Using a stable dataset release date preserves crawl fidelity.
 */
const BUILD_DATE = new Date("2026-11-08");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // NOTE: /mosque-near-me is intentionally excluded from the sitemap.
  // It is a client-side geolocation utility rather than a content-rich canonical
  // directory landing page. Its exclusion prevents crawl budget dilution.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mosques`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/provinces`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prayer-times`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jummah`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jummah/toronto`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic Province directory routes
  const provinceRoutes: MetadataRoute.Sitemap = PROVINCE_SLUGS.map((slug) => ({
    url: `${baseUrl}/provinces/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Clean City landing page routes
  const cityRoutes: MetadataRoute.Sitemap = SUPPORTED_CITY_SLUGS.map((slug) => ({
    url: `${baseUrl}/cities/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Preserved Borough routes for backward-compatible discovery (boroughs without a /cities/ equivalent)
  const areaSlugs = getSupportedAreaSlugs();
  const boroughRoutes: MetadataRoute.Sitemap = areaSlugs
    .filter((slug) => {
      const area = getAreaBySlug(slug);
      return area && !area.isMetropolis;
    })
    .map((slug) => ({
      url: `${baseUrl}/mosques/${slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  // City prayer times pages across Canada
  const prayerCityRoutes: MetadataRoute.Sitemap = SUPPORTED_CITY_SLUGS.map((slug) => ({
    url: `${baseUrl}/prayer-times/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamic canonical mosque profile pages from verified published dataset ONLY
  const repo = new CanonicalMosqueRepository();
  const publishedMosques = await repo.list();

  const mosqueRoutes: MetadataRoute.Sitemap = publishedMosques.map((m) => ({
    url: `${baseUrl}/mosque/${m.slug}`,
    lastModified: m.updatedAt ? new Date(m.updatedAt) : BUILD_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...provinceRoutes,
    ...cityRoutes,
    ...prayerCityRoutes,
    ...boroughRoutes,
    ...mosqueRoutes,
  ];

  // Deduplicate URLs
  const seenUrls = new Set<string>();
  return allRoutes.filter((item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });
}
