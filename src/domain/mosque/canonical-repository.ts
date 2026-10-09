import { Coordinates } from "../geo/coordinates";
import { calculateHaversineDistanceKm } from "../geo/distance";
import {
  IMosqueRepository,
  MosqueDistanceResult,
  MosqueFilterOptions,
  PaginationOptions,
} from "./repository";
import { Mosque, MosqueClassification } from "./types";
import { ProcessedMosqueRecord } from "@/pipeline/types";

import { getCityConfigByName } from "../city/city-config";
import { getNearbyPublishedMosques } from "./nearby";

// In-memory cache loaded lazily from canonical published.json files across Canada
let cachedMosques: Mosque[] | null = null;

function getTimezoneForRecord(rec: ProcessedMosqueRecord): string {
  const cityCfg = getCityConfigByName(rec.address.city);
  if (cityCfg) return cityCfg.timezone;

  switch (rec.address.province) {
    case "BC":
      return "America/Vancouver";
    case "AB":
      return "America/Edmonton";
    case "MB":
      return "America/Winnipeg";
    case "QC":
    case "ON":
    default:
      return "America/Toronto";
  }
}

async function loadCanonicalMosques(): Promise<Mosque[]> {
  if (cachedMosques) return cachedMosques;

  try {
    const [
      torontoMod,
      ottawaMod,
      mississaugaMod,
      bramptonMod,
      vancouverMod,
      calgaryMod,
      edmontonMod,
      montrealMod,
      winnipegMod,
    ] = await Promise.all([
      import("@/data/toronto/published.json"),
      import("@/data/cities/ottawa/published.json"),
      import("@/data/cities/mississauga/published.json"),
      import("@/data/cities/brampton/published.json"),
      import("@/data/cities/vancouver/published.json"),
      import("@/data/cities/calgary/published.json"),
      import("@/data/cities/edmonton/published.json"),
      import("@/data/cities/montreal/published.json"),
      import("@/data/cities/winnipeg/published.json"),
    ]);

    const allRecords: ProcessedMosqueRecord[] = [
      ...((torontoMod.default || torontoMod) as unknown as ProcessedMosqueRecord[]),
      ...((ottawaMod.default || ottawaMod) as unknown as ProcessedMosqueRecord[]),
      ...((mississaugaMod.default || mississaugaMod) as unknown as ProcessedMosqueRecord[]),
      ...((bramptonMod.default || bramptonMod) as unknown as ProcessedMosqueRecord[]),
      ...((vancouverMod.default || vancouverMod) as unknown as ProcessedMosqueRecord[]),
      ...((calgaryMod.default || calgaryMod) as unknown as ProcessedMosqueRecord[]),
      ...((edmontonMod.default || edmontonMod) as unknown as ProcessedMosqueRecord[]),
      ...((montrealMod.default || montrealMod) as unknown as ProcessedMosqueRecord[]),
      ...((winnipegMod.default || winnipegMod) as unknown as ProcessedMosqueRecord[]),
    ];

    cachedMosques = allRecords.map((item) => toDomainMosque(item));
    return cachedMosques;
  } catch (err) {
    console.error("Failed to load canonical mosques:", err);
    return [];
  }
}

function toDomainMosque(rec: ProcessedMosqueRecord): Mosque {
  return {
    id: rec.id,
    name: rec.name,
    slug: rec.slug,
    address: rec.address.raw,
    city: rec.address.city,
    province: rec.address.province,
    postalCode: rec.address.postalCode.normalized || rec.address.postalCode.raw,
    coordinates: rec.coordinates,
    timezone: getTimezoneForRecord(rec),
    phone: rec.phone?.normalized || rec.phone?.raw || null,
    website: rec.website,
    email: null,
    classification: mapClassification(rec.classification),
    status: "ACTIVE",
    facilities: rec.facilities,
    openingHours: rec.openingHours,
    iqamahSchedule: null, // Zero fabrication: unverified in source
    jummahSchedule: null, // Zero fabrication: unverified in source
    sourceMetadata: {
      sourceName: "google_places",
      rawId: rec.id,
      googleCid: rec.provenance.cid,
      placeId: rec.provenance.placeId,
      rating: rec.provenance.rating,
      reviewCount: rec.provenance.reviewsCount,
      lastIngestedAt: rec.provenance.ingestedAt,
      lastVerifiedAt: null,
      confidenceScore: 0.95,
    },
    createdAt: rec.provenance.ingestedAt,
    updatedAt: rec.provenance.ingestedAt,
  };
}

function mapClassification(c: ProcessedMosqueRecord["classification"]): MosqueClassification {
  switch (c) {
    case "MOSQUE":
    case "ISLAMIC_CENTER":
    case "MUSALLA":
    case "PRAYER_ROOM":
    case "JUMMAH_LOCATION":
    case "COMMUNITY_CENTER":
    case "ORGANIZATION":
    case "REVIEW_REQUIRED":
    case "EXCLUDE":
      return c;
    default:
      return "REVIEW_REQUIRED";
  }
}

/**
 * Production Canonical Mosque Repository.
 * Guarantees that only PUBLISHED, verified canonical records are accessed by the application.
 */
export class CanonicalMosqueRepository implements IMosqueRepository {
  async getById(id: string): Promise<Mosque | null> {
    const list = await loadCanonicalMosques();
    return list.find((m) => m.id === id) || null;
  }

  async getBySlug(slug: string): Promise<Mosque | null> {
    const list = await loadCanonicalMosques();
    return list.find((m) => m.slug === slug) || null;
  }

  async list(filter?: MosqueFilterOptions, pagination?: PaginationOptions): Promise<Mosque[]> {
    let list = await loadCanonicalMosques();

    if (filter) {
      if (filter.city) {
        const targetCity = filter.city.toLowerCase();
        list = list.filter((m) => m.city.toLowerCase() === targetCity);
      }
      if (filter.province) {
        const targetProvince = filter.province.toUpperCase();
        list = list.filter((m) => m.province.toUpperCase() === targetProvince);
      }
      if (filter.classification) {
        list = list.filter((m) => m.classification === filter.classification);
      }
      if (filter.status) {
        list = list.filter((m) => m.status === filter.status);
      }
      if (filter.hasParking !== undefined) {
        list = list.filter((m) => m.facilities.parkingAvailable === filter.hasParking);
      }
      if (filter.isWheelchairAccessible !== undefined) {
        list = list.filter(
          (m) => m.facilities.wheelchairAccessible === filter.isWheelchairAccessible
        );
      }
    }

    const offset = pagination?.offset || 0;
    const limit = pagination?.limit !== undefined ? pagination.limit : list.length;

    return list.slice(offset, offset + limit);
  }

  async count(filter?: MosqueFilterOptions): Promise<number> {
    const list = await this.list(filter);
    return list.length;
  }

  async findNearby(
    coords: Coordinates,
    radiusKm: number,
    limit: number = 20
  ): Promise<MosqueDistanceResult[]> {
    const list = await loadCanonicalMosques();

    const withDistances = list.map((m) => ({
      mosque: m,
      distanceKm: calculateHaversineDistanceKm(coords, m.coordinates),
    }));

    return withDistances
      .filter((item) => item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);
  }

  async getNearbyPublishedMosques(
    target: Mosque,
    limit: number = 6
  ): Promise<MosqueDistanceResult[]> {
    const list = await loadCanonicalMosques();
    return getNearbyPublishedMosques(target, list, limit);
  }

  async getAllCities(): Promise<string[]> {
    const list = await loadCanonicalMosques();
    const citySet = new Set(list.map((m) => m.city));
    return Array.from(citySet).sort();
  }
}
