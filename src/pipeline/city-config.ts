import { CanadianProvince } from "@/domain/mosque/types";

export interface GeoBoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface CityConfig {
  city: string;
  slug: string;
  province: CanadianProvince;
  provinceFullName: string;
  idPrefix: string;
  rawFilePath: string;
  outputDir: string;
  geoBounds: GeoBoundingBox;
  knownMunicipalities: string[];
}

export const SUPPORTED_CITIES: Record<string, CityConfig> = {
  toronto: {
    city: "Toronto",
    slug: "toronto",
    province: "ON",
    provinceFullName: "Ontario",
    idPrefix: "to",
    rawFilePath: "src/data/raw/toronto.json",
    outputDir: "src/data/toronto",
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
      "Mississauga",
      "Brampton",
      "Markham",
      "Vaughan",
      "Richmond Hill",
      "Oakville",
      "Pickering",
      "Ajax",
      "Whitby",
      "Oshawa",
      "Milton",
      "Burlington",
      "Newmarket",
      "Aurora",
    ],
  },
  ottawa: {
    city: "Ottawa",
    slug: "ottawa",
    province: "ON",
    provinceFullName: "Ontario",
    idPrefix: "ott",
    rawFilePath: "src/data/raw/ottawa.json",
    outputDir: "src/data/cities/ottawa",
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
      "Kanata",
      "Stittsville",
      "Edwards",
      "Richmond",
      "Cumberland",
      "Vanier",
      "Rockcliffe Park",
    ],
  },
  mississauga: {
    city: "Mississauga",
    slug: "mississauga",
    province: "ON",
    provinceFullName: "Ontario",
    idPrefix: "mis",
    rawFilePath: "src/data/raw/mississauga.json",
    outputDir: "src/data/cities/mississauga",
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
      "Erindale",
      "Cooksville",
      "Clarkson",
      "Lorne Park",
    ],
  },
  brampton: {
    city: "Brampton",
    slug: "brampton",
    province: "ON",
    provinceFullName: "Ontario",
    idPrefix: "brm",
    rawFilePath: "src/data/raw/brampton.json",
    outputDir: "src/data/cities/brampton",
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
      "Goreway",
    ],
  },
  vancouver: {
    city: "Vancouver",
    slug: "vancouver",
    province: "BC",
    provinceFullName: "British Columbia",
    idPrefix: "van",
    rawFilePath: "src/data/raw/vancouver.json",
    outputDir: "src/data/cities/vancouver",
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
      "Grandview-Woodland",
    ],
  },
  calgary: {
    city: "Calgary",
    slug: "calgary",
    province: "AB",
    provinceFullName: "Alberta",
    idPrefix: "cal",
    rawFilePath: "src/data/raw/calgary.json",
    outputDir: "src/data/cities/calgary",
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
      "Sunalta",
      "Beltline",
    ],
  },
  edmonton: {
    city: "Edmonton",
    slug: "edmonton",
    province: "AB",
    provinceFullName: "Alberta",
    idPrefix: "edm",
    rawFilePath: "src/data/raw/edmonton.json",
    outputDir: "src/data/cities/edmonton",
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
      "West Edmonton",
      "Castledowns",
    ],
  },
  montreal: {
    city: "Montreal",
    slug: "montreal",
    province: "QC",
    provinceFullName: "Quebec",
    idPrefix: "mtl",
    rawFilePath: "src/data/raw/montreal.json",
    outputDir: "src/data/cities/montreal",
    geoBounds: {
      minLat: 45.3,
      maxLat: 45.8,
      minLng: -74.0,
      maxLng: -73.4,
    },
    knownMunicipalities: [
      "Montreal",
      "Montréal",
      "Montréal-Nord",
      "Montreal-North",
      "Saint-Laurent",
      "Saint-Leonard",
      "Saint-Léonard",
      "Lachine",
      "Lasalle",
      "LaSalle",
      "Verdun",
      "Pierrefonds",
      "Outremont",
      "Côte-des-Neiges",
      "Ahuntsic",
      "Villeray",
      "Rosemont",
      "Anjou",
      "Westmount",
      "Dollard-des-Ormeaux",
    ],
  },
  winnipeg: {
    city: "Winnipeg",
    slug: "winnipeg",
    province: "MB",
    provinceFullName: "Manitoba",
    idPrefix: "wpg",
    rawFilePath: "src/data/raw/winnipeg.json",
    outputDir: "src/data/cities/winnipeg",
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
      "Transcona",
      "Fort Garry",
      "St. James",
    ],
  },
};

export function getCityConfig(cityKey: string): CityConfig {
  const normalized = cityKey.toLowerCase().trim();
  const config = SUPPORTED_CITIES[normalized];
  if (!config) {
    throw new Error(`Unsupported city key: "${cityKey}". Supported cities: ${Object.keys(SUPPORTED_CITIES).join(", ")}`);
  }
  return config;
}
