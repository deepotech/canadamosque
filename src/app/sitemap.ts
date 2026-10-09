import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { getSupportedAreaSlugs } from "@/domain/geo/area-slugs";
import { SUPPORTED_CITY_SLUGS } from "@/domain/city/city-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Core static canonical pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/mosque-near-me`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/mosques`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/prayer-times`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/jummah`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/jummah/toronto`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // City prayer times pages across Canada
  const prayerCityRoutes: MetadataRoute.Sitemap = SUPPORTED_CITY_SLUGS.map((slug) => ({
    url: `${siteConfig.url}/prayer-times/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamic area and metropolitan mosque pages
  const areaSlugs = getSupportedAreaSlugs();
  const areaRoutes: MetadataRoute.Sitemap = areaSlugs.map((slug) => ({
    url: `${siteConfig.url}/mosques/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic canonical mosque profile pages from published dataset across Canada
  const repo = new CanonicalMosqueRepository();
  const publishedMosques = await repo.list();

  const mosqueRoutes: MetadataRoute.Sitemap = publishedMosques.map((m) => ({
    url: `${siteConfig.url}/mosque/${m.slug}`,
    lastModified: m.updatedAt || currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...prayerCityRoutes, ...areaRoutes, ...mosqueRoutes];
}
