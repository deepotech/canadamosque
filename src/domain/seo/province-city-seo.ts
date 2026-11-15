import type { Metadata } from "next";
import { CanadianProvince } from "@/domain/mosque/types";
import { constructMetadata } from "./metadata";
import { CANADIAN_CITIES, DomainCityConfig, getCityConfigBySlug } from "@/domain/city/city-config";

export interface ProvinceConfig {
  slug: string;
  code: CanadianProvince;
  name: string;
  frenchName?: string;
  capital: string;
  majorCitySlugs: string[];
  description: string;
}

export const CANADIAN_PROVINCES: Record<string, ProvinceConfig> = {
  ontario: {
    slug: "ontario",
    code: "ON",
    name: "Ontario",
    capital: "Toronto",
    majorCitySlugs: ["toronto", "mississauga", "brampton", "ottawa"],
    description:
      "Find verified mosques, Islamic centers, and prayer facilities across Ontario. Discover prayer times, Jummah schedules, and directions in the Greater Toronto Area, Ottawa, and beyond.",
  },
  quebec: {
    slug: "quebec",
    name: "Quebec",
    frenchName: "Québec",
    code: "QC",
    capital: "Quebec City",
    majorCitySlugs: ["montreal"],
    description:
      "Explore verified mosques and Islamic centers in Quebec. Trouvez les mosquées et centres islamiques à Montréal et au Québec avec horaires de prière et directions vérifiées.",
  },
  alberta: {
    slug: "alberta",
    code: "AB",
    name: "Alberta",
    capital: "Edmonton",
    majorCitySlugs: ["calgary", "edmonton"],
    description:
      "Comprehensive directory of verified mosques and Islamic centers across Alberta. Find prayer locations and directions in Edmonton, Calgary, and surrounding communities.",
  },
  "british-columbia": {
    slug: "british-columbia",
    code: "BC",
    name: "British Columbia",
    capital: "Victoria",
    majorCitySlugs: ["vancouver"],
    description:
      "Discover verified mosques and Islamic community centers across British Columbia. View prayer times, facilities, and driving directions in Greater Vancouver and across BC.",
  },
  manitoba: {
    slug: "manitoba",
    code: "MB",
    name: "Manitoba",
    capital: "Winnipeg",
    majorCitySlugs: ["winnipeg"],
    description:
      "Find authentic mosques and Islamic centers in Manitoba. Browse verified prayer locations, facilities, and driving directions in Winnipeg and surrounding regions.",
  },
};

export const PROVINCE_SLUGS = Object.keys(CANADIAN_PROVINCES);

export interface CitySeoPolicy {
  /** Minimum publishable mosques required for an indexable city landing page */
  minMosqueCount: number;
}

export const DEFAULT_CITY_SEO_POLICY: CitySeoPolicy = {
  minMosqueCount: 5, // Tier A threshold to prevent thin doorway pages
};

export function isCityEligibleForSeo(
  mosqueCount: number,
  policy: CitySeoPolicy = DEFAULT_CITY_SEO_POLICY
): boolean {
  return mosqueCount >= policy.minMosqueCount;
}

export function isProvinceEligibleForSeo(mosqueCount: number): boolean {
  return mosqueCount >= 5;
}

export function getProvinceBySlug(slug: string): ProvinceConfig | null {
  const norm = slug.toLowerCase().trim();
  return CANADIAN_PROVINCES[norm] || null;
}

export function getProvinceByCode(code: string): ProvinceConfig | null {
  const norm = code.toUpperCase().trim();
  return Object.values(CANADIAN_PROVINCES).find((p) => p.code === norm) || null;
}

export function getAllProvinces(): ProvinceConfig[] {
  return Object.values(CANADIAN_PROVINCES);
}

/**
 * Returns sibling / related cities within the same province or nearby Canadian metropolises.
 */
export function getRelatedCities(citySlug: string, limit: number = 4): DomainCityConfig[] {
  const currentCity = getCityConfigBySlug(citySlug);
  if (!currentCity) return [];

  const allCities = Object.values(CANADIAN_CITIES);

  // First pick same-province cities
  const sameProvince = allCities.filter(
    (c) => c.province === currentCity.province && c.slug !== currentCity.slug
  );

  // Then other major cities
  const otherCities = allCities.filter(
    (c) => c.province !== currentCity.province && c.slug !== currentCity.slug
  );

  return [...sameProvince, ...otherCities].slice(0, limit);
}

/**
 * Generates dynamic SEO metadata for a Canadian province directory page.
 */
export function generateProvinceMetadata(
  provinceSlug: string,
  mosqueCount: number
): Metadata {
  const config = getProvinceBySlug(provinceSlug);
  if (!config) {
    return constructMetadata({
      title: "Province Not Found",
      description: "The requested Canadian province directory could not be found.",
      canonicalPath: `/provinces/${provinceSlug}`,
      noIndex: true,
    });
  }

  const title = `Mosques in ${config.name} (${mosqueCount} Verified Locations)`;
  const description =
    config.code === "QC"
      ? `Find ${mosqueCount} verified mosques and Islamic centers in ${config.name}. Trouvez les mosquées et centres islamiques au Québec avec adresses, horaires et directions.`
      : `Explore ${mosqueCount} verified mosques and Islamic centers across ${config.name}, Canada. Browse city directories, facilities, calculated prayer times, and directions.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/provinces/${config.slug}`,
  });
}

/**
 * City-specific SEO snippet definitions.
 * Provides distinct, locally relevant titles and meta descriptions
 * aligned with actual search queries and geographic intent.
 */
const CITY_METADATA_DEFINITIONS: Record<
  string,
  {
    title: (cityName: string, province: string, count: number) => string;
    description: (cityName: string, province: string, provinceFull: string, count: number) => string;
  }
> = {
  mississauga: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Find ${count} verified mosques and masjids in ${name}, ${prov}. View addresses, parking, wheelchair access, and driving directions across Peel Region.`,
  },
  toronto: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Discover ${count} verified mosques and masjids across ${name} and the GTA. View addresses, facilities, calculated daily prayer times, and directions.`,
  },
  montreal: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, _prov, _full, count) =>
      `Find ${count} verified mosques and Islamic centers in ${name}, QC. Trouvez les mosquées et centres islamiques à Montréal avec adresses et directions vérifiées.`,
  },
  calgary: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, _prov, full, count) =>
      `Explore ${count} verified mosques and Islamic centers in ${name}, ${full}. Access verified addresses, facilities, calculated prayer times, and directions.`,
  },
  edmonton: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Find ${count} verified mosques and Islamic centers across ${name}, ${prov}. Access verified addresses, facilities, calculated prayer times, and driving directions.`,
  },
  vancouver: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Find ${count} verified mosques and Islamic community centers in ${name}, ${prov}. Browse verified addresses, facilities, directions, and daily prayer times.`,
  },
  brampton: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Discover ${count} verified mosques and Islamic centers in ${name}, ${prov}. View addresses, parking, accessibility, directions, and prayer spaces across Peel.`,
  },
  ottawa: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, prov, _full, count) =>
      `Browse ${count} verified mosques and Islamic centers in ${name}, ${prov} & National Capital Region. View addresses, facilities, and calculated daily prayer times.`,
  },
  winnipeg: {
    title: (name, prov, count) => `Mosques in ${name}, ${prov} (${count} Locations)`,
    description: (name, _prov, full, count) =>
      `Find ${count} verified mosques and Islamic centers in ${name}, ${full}. Browse verified addresses, facilities, driving directions, and daily prayer times.`,
  },
};

/**
 * Generates dynamic SEO metadata for a Canadian city landing page.
 */
export function generateCityMetadata(
  citySlug: string,
  mosqueCount: number
): Metadata {
  const config = getCityConfigBySlug(citySlug);
  if (!config) {
    return constructMetadata({
      title: "City Not Found",
      description: "The requested Canadian city directory could not be found.",
      canonicalPath: `/cities/${citySlug}`,
      noIndex: true,
    });
  }

  const customDef = CITY_METADATA_DEFINITIONS[config.slug.toLowerCase()];
  const title = customDef
    ? customDef.title(config.name, config.province, mosqueCount)
    : `Mosques in ${config.name}, ${config.province} (${mosqueCount} Locations)`;

  const description = customDef
    ? customDef.description(config.name, config.province, config.provinceFullName, mosqueCount)
    : config.province === "QC"
    ? `Find ${mosqueCount} verified mosques, Islamic centers, and musallas in ${config.name}, ${config.provinceFullName}. Trouvez une mosquée près de chez vous à ${config.name}.`
    : `Find ${mosqueCount} verified mosques and Islamic centers in ${config.name}, ${config.provinceFullName}. Access addresses, calculated prayer times, facilities, and driving directions.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/cities/${config.slug}`,
  });
}

/**
 * Generates SEO metadata for the national /provinces directory hub.
 */
export function generateProvincesHubMetadata(
  totalProvinces: number,
  totalMosques: number
): Metadata {
  return constructMetadata({
    title: `Canadian Mosques by Province (${totalMosques} Locations across ${totalProvinces} Provinces)`,
    description: `Explore authentic mosques and Islamic centers across ${totalProvinces} Canadian provinces. Comprehensive directory of ${totalMosques} verified prayer facilities in Ontario, Quebec, Alberta, British Columbia, and Manitoba.`,
    canonicalPath: "/provinces",
  });
}
