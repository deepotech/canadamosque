import { Mosque } from "./types";
import { Coordinates } from "../geo/coordinates";

export interface MosqueDistanceResult {
  mosque: Mosque;
  distanceKm: number;
}

export interface MosqueFilterOptions {
  city?: string;
  province?: string;
  hasWomenSection?: boolean;
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  status?: Mosque["status"];
  classification?: Mosque["classification"];
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Repository interface defining data access contracts for Mosques.
 * Implementations (e.g., in-memory, SQLite, PostgreSQL, JSON-cache) must satisfy this interface.
 */
export interface IMosqueRepository {
  getById(id: string): Promise<Mosque | null>;
  getBySlug(slug: string): Promise<Mosque | null>;
  list(filter?: MosqueFilterOptions, pagination?: PaginationOptions): Promise<Mosque[]>;
  count(filter?: MosqueFilterOptions): Promise<number>;
  findNearby(
    coords: Coordinates,
    radiusKm: number,
    limit?: number
  ): Promise<MosqueDistanceResult[]>;
  getNearbyPublishedMosques?(
    target: Mosque,
    limit?: number
  ): Promise<MosqueDistanceResult[]>;
  getAllCities(): Promise<string[]>;
}
