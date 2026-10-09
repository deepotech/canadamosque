import { CanadianProvince } from "@/domain/mosque/types";
import { Coordinates } from "@/domain/geo/coordinates";

export interface GeoBoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface DomainCityConfig {
  slug: string;
  name: string;
  province: CanadianProvince;
  provinceFullName: string;
  timezone: string;
  representativeCoordinates: Coordinates;
  geoBounds: GeoBoundingBox;
  knownMunicipalities: string[];
  canonicalMosqueRoute: string;
  canonicalPrayerRoute: string;
}

export const CANADIAN_CITIES: Record<string, DomainCityConfig> = {
  toronto: {
    slug: "toronto",
    name: "Toronto",
    province: "ON",
    provinceFullName: "Ontario",
    timezone: "America/Toronto",
    representativeCoordinates: {
      latitude: 43.6532,
      longitude: -79.3832,
    },
    geoBounds: {
      minLat: 43.4,
      maxLat: 44.2,
      minLng: -80.1,
      maxLng: -78.8,
    },
    knownMunicipalities: [
      "Toronto",
      "Scarborough",
      "North York",
      "Etobicoke",
      "East York",
      "York",
    ],
    canonicalMosqueRoute: "/mosques/toronto",
    canonicalPrayerRoute: "/prayer-times/toronto",
  },
  ottawa: {
    slug: "ottawa",
    name: "Ottawa",
    province: "ON",
    provinceFullName: "Ontario",
    timezone: "America/Toronto",
    representativeCoordinates: {
      latitude: 45.4215,
      longitude: -75.6972,
    },
    geoBounds: {
      minLat: 45.0,
      maxLat: 45.7,
      minLng: -76.5,
      maxLng: -75.1,
    },
    knownMunicipalities: [
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
    canonicalMosqueRoute: "/mosques/ottawa",
    canonicalPrayerRoute: "/prayer-times/ottawa",
  },
  mississauga: {
    slug: "mississauga",
    name: "Mississauga",
    province: "ON",
    provinceFullName: "Ontario",
    timezone: "America/Toronto",
    representativeCoordinates: {
      latitude: 43.589,
      longitude: -79.6441,
    },
    geoBounds: {
      minLat: 43.4,
      maxLat: 43.8,
      minLng: -79.8,
      maxLng: -79.4,
    },
    knownMunicipalities: [
      "Mississauga",
      "Streetsville",
      "Port Credit",
      "Malton",
      "Meadowvale",
      "Cooksville",
    ],
    canonicalMosqueRoute: "/mosques/mississauga",
    canonicalPrayerRoute: "/prayer-times/mississauga",
  },
  brampton: {
    slug: "brampton",
    name: "Brampton",
    province: "ON",
    provinceFullName: "Ontario",
    timezone: "America/Toronto",
    representativeCoordinates: {
      latitude: 43.7315,
      longitude: -79.7624,
    },
    geoBounds: {
      minLat: 43.6,
      maxLat: 43.9,
      minLng: -79.9,
      maxLng: -79.6,
    },
    knownMunicipalities: [
      "Brampton",
      "Bramalea",
      "Mount Pleasant",
      "Castlemore",
      "Springdale",
    ],
    canonicalMosqueRoute: "/mosques/brampton",
    canonicalPrayerRoute: "/prayer-times/brampton",
  },
  vancouver: {
    slug: "vancouver",
    name: "Vancouver",
    province: "BC",
    provinceFullName: "British Columbia",
    timezone: "America/Vancouver",
    representativeCoordinates: {
      latitude: 49.2827,
      longitude: -123.1207,
    },
    geoBounds: {
      minLat: 49.0,
      maxLat: 49.5,
      minLng: -123.4,
      maxLng: -122.8,
    },
    knownMunicipalities: [
      "Vancouver",
      "Downtown Vancouver",
      "Kitsilano",
      "West End",
      "Strathcona",
      "Mount Pleasant",
    ],
    canonicalMosqueRoute: "/mosques/vancouver",
    canonicalPrayerRoute: "/prayer-times/vancouver",
  },
  calgary: {
    slug: "calgary",
    name: "Calgary",
    province: "AB",
    provinceFullName: "Alberta",
    timezone: "America/Edmonton",
    representativeCoordinates: {
      latitude: 51.0447,
      longitude: -114.0719,
    },
    geoBounds: {
      minLat: 50.8,
      maxLat: 51.3,
      minLng: -114.4,
      maxLng: -113.8,
    },
    knownMunicipalities: [
      "Calgary",
      "Downtown Calgary",
      "Forest Lawn",
      "Bowness",
      "Beltline",
    ],
    canonicalMosqueRoute: "/mosques/calgary",
    canonicalPrayerRoute: "/prayer-times/calgary",
  },
  edmonton: {
    slug: "edmonton",
    name: "Edmonton",
    province: "AB",
    provinceFullName: "Alberta",
    timezone: "America/Edmonton",
    representativeCoordinates: {
      latitude: 53.5461,
      longitude: -113.4938,
    },
    geoBounds: {
      minLat: 53.3,
      maxLat: 53.8,
      minLng: -113.8,
      maxLng: -113.2,
    },
    knownMunicipalities: [
      "Edmonton",
      "Downtown Edmonton",
      "Strathcona",
      "Mill Woods",
      "Castledowns",
    ],
    canonicalMosqueRoute: "/mosques/edmonton",
    canonicalPrayerRoute: "/prayer-times/edmonton",
  },
  montreal: {
    slug: "montreal",
    name: "Montreal",
    province: "QC",
    provinceFullName: "Quebec",
    timezone: "America/Toronto",
    representativeCoordinates: {
      latitude: 45.5017,
      longitude: -73.5673,
    },
    geoBounds: {
      minLat: 45.3,
      maxLat: 45.8,
      minLng: -74.0,
      maxLng: -73.4,
    },
    knownMunicipalities: [
      "Montreal",
      "Montréal",
      "Saint-Laurent",
      "Lachine",
      "LaSalle",
      "Verdun",
      "Ahuntsic",
      "Outremont",
      "Saint-Léonard",
      "Pierrefonds",
    ],
    canonicalMosqueRoute: "/mosques/montreal",
    canonicalPrayerRoute: "/prayer-times/montreal",
  },
  winnipeg: {
    slug: "winnipeg",
    name: "Winnipeg",
    province: "MB",
    provinceFullName: "Manitoba",
    timezone: "America/Winnipeg",
    representativeCoordinates: {
      latitude: 49.8951,
      longitude: -97.1384,
    },
    geoBounds: {
      minLat: 49.7,
      maxLat: 50.1,
      minLng: -97.4,
      maxLng: -96.9,
    },
    knownMunicipalities: [
      "Winnipeg",
      "Downtown Winnipeg",
      "St. Boniface",
      "St. Vital",
      "Fort Garry",
    ],
    canonicalMosqueRoute: "/mosques/winnipeg",
    canonicalPrayerRoute: "/prayer-times/winnipeg",
  },
};

export const SUPPORTED_CITY_SLUGS = Object.keys(CANADIAN_CITIES);

export function getCityConfigBySlug(slug: string): DomainCityConfig | null {
  const norm = slug.toLowerCase().trim();
  return CANADIAN_CITIES[norm] || null;
}

export function getCityConfigByName(name: string): DomainCityConfig | null {
  const norm = name.toLowerCase().trim();
  const found = Object.values(CANADIAN_CITIES).find(
    (c) =>
      c.name.toLowerCase() === norm ||
      c.slug.toLowerCase() === norm ||
      c.knownMunicipalities.some((m) => m.toLowerCase() === norm)
  );
  return found || null;
}

export function getAllCityConfigs(): DomainCityConfig[] {
  return Object.values(CANADIAN_CITIES);
}

export function isSupportedCitySlug(slug: string): boolean {
  return slug.toLowerCase().trim() in CANADIAN_CITIES;
}
