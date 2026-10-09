import { Mosque } from "../mosque/types";

export interface SupportedArea {
  slug: string;
  name: string;
  province: string;
  provinceFullName: string;
  isMetropolis: boolean;
  municipalities: string[];
}

export const SUPPORTED_AREAS: Record<string, SupportedArea> = {
  toronto: {
    slug: "toronto",
    name: "Toronto",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: true,
    municipalities: [
      "Toronto",
      "Scarborough",
      "North York",
      "Etobicoke",
      "East York",
      "York",
    ],
  },
  ottawa: {
    slug: "ottawa",
    name: "Ottawa",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: true,
    municipalities: [
      "Ottawa",
      "Nepean",
      "Gloucester",
      "Orléans",
      "Edwards",
      "Cumberland",
      "Kanata",
      "Stittsville",
      "Vanier",
    ],
  },
  mississauga: {
    slug: "mississauga",
    name: "Mississauga",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: true,
    municipalities: [
      "Mississauga",
      "Streetsville",
      "Port Credit",
      "Malton",
      "Meadowvale",
      "Cooksville",
    ],
  },
  brampton: {
    slug: "brampton",
    name: "Brampton",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: true,
    municipalities: [
      "Brampton",
      "Bramalea",
      "Mount Pleasant",
      "Castlemore",
      "Springdale",
    ],
  },
  vancouver: {
    slug: "vancouver",
    name: "Vancouver",
    province: "BC",
    provinceFullName: "British Columbia",
    isMetropolis: true,
    municipalities: [
      "Vancouver",
      "Downtown Vancouver",
      "Kitsilano",
      "West End",
      "Strathcona",
      "Mount Pleasant",
    ],
  },
  calgary: {
    slug: "calgary",
    name: "Calgary",
    province: "AB",
    provinceFullName: "Alberta",
    isMetropolis: true,
    municipalities: [
      "Calgary",
      "Downtown Calgary",
      "Forest Lawn",
      "Bowness",
      "Beltline",
    ],
  },
  edmonton: {
    slug: "edmonton",
    name: "Edmonton",
    province: "AB",
    provinceFullName: "Alberta",
    isMetropolis: true,
    municipalities: [
      "Edmonton",
      "Downtown Edmonton",
      "Strathcona",
      "Mill Woods",
      "Castledowns",
    ],
  },
  montreal: {
    slug: "montreal",
    name: "Montreal",
    province: "QC",
    provinceFullName: "Quebec",
    isMetropolis: true,
    municipalities: [
      "Montreal",
      "Montréal",
      "Saint-Laurent",
      "Saint-Léonard",
      "Lachine",
      "Lasalle",
      "Verdun",
      "Pierrefonds",
      "Ahuntsic",
      "Outremont",
    ],
  },
  winnipeg: {
    slug: "winnipeg",
    name: "Winnipeg",
    province: "MB",
    provinceFullName: "Manitoba",
    isMetropolis: true,
    municipalities: [
      "Winnipeg",
      "Downtown Winnipeg",
      "St. Boniface",
      "St. Vital",
      "Fort Garry",
    ],
  },
  // Toronto boroughs & historical areas for backward compatibility
  scarborough: {
    slug: "scarborough",
    name: "Scarborough",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: false,
    municipalities: ["Scarborough"],
  },
  "north-york": {
    slug: "north-york",
    name: "North York",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: false,
    municipalities: ["North York"],
  },
  etobicoke: {
    slug: "etobicoke",
    name: "Etobicoke",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: false,
    municipalities: ["Etobicoke"],
  },
  "east-york": {
    slug: "east-york",
    name: "East York",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: false,
    municipalities: ["East York"],
  },
  york: {
    slug: "york",
    name: "York",
    province: "ON",
    provinceFullName: "Ontario",
    isMetropolis: false,
    municipalities: ["York"],
  },
};

export const SUPPORTED_AREA_SLUGS = Object.keys(SUPPORTED_AREAS);

export const SUPPORTED_CITIES = [
  "Toronto",
  "Ottawa",
  "Mississauga",
  "Brampton",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Montreal",
  "Winnipeg",
  "Scarborough",
  "North York",
  "Etobicoke",
  "East York",
  "York",
] as const;

export type SupportedCity = (typeof SUPPORTED_CITIES)[number];

export function getAreaBySlug(slug: string): SupportedArea | null {
  const norm = slug.toLowerCase().trim();
  return SUPPORTED_AREAS[norm] || null;
}

/**
 * Reverses an area slug to a supported city name, if valid.
 * Example: "north-york" -> "North York", "ottawa" -> "Ottawa"
 */
export function areaSlugToCity(slug: string): string | null {
  const area = getAreaBySlug(slug);
  return area ? area.name : null;
}

/**
 * Converts a city name to a URL-safe slug.
 * Example: "North York" -> "north-york"
 */
export function cityToAreaSlug(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, "-");
}

/**
 * Returns all valid area slugs that have data.
 */
export function getSupportedAreaSlugs(): string[] {
  return SUPPORTED_AREA_SLUGS;
}

/**
 * Deterministically filters mosques that belong to the given area slug.
 */
export function filterMosquesByArea(mosques: Mosque[], areaSlug: string): Mosque[] {
  const area = getAreaBySlug(areaSlug);
  if (!area) return [];

  const lowerMunicipalities = new Set(area.municipalities.map((m) => m.toLowerCase()));
  return mosques.filter((m) => {
    if (m.province !== area.province) return false;
    return lowerMunicipalities.has(m.city.toLowerCase());
  });
}
