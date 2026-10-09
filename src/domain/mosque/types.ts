import { Coordinates } from "../geo/coordinates";
import { OpeningHoursSchedule } from "../opening-hours/types";
import { MosqueIqamahSchedule } from "../iqamah/types";
import { MosqueJummahSchedule } from "../jummah/types";

export type CanadianProvince =
  | "AB" // Alberta
  | "BC" // British Columbia
  | "MB" // Manitoba
  | "NB" // New Brunswick
  | "NL" // Newfoundland and Labrador
  | "NS" // Nova Scotia
  | "NT" // Northwest Territories
  | "NU" // Nunavut
  | "ON" // Ontario
  | "PE" // Prince Edward Island
  | "QC" // Quebec
  | "SK" // Saskatchewan
  | "YT"; // Yukon

export const CANADIAN_PROVINCES: Record<CanadianProvince, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export type MosqueClassification =
  | "MOSQUE"
  | "ISLAMIC_CENTER"
  | "MUSALLA"
  | "PRAYER_ROOM"
  | "JUMMAH_LOCATION"
  | "COMMUNITY_CENTER"
  | "ORGANIZATION"
  | "REVIEW_REQUIRED"
  | "EXCLUDE";

export type MosqueStatus =
  | "ACTIVE"
  | "TEMPORARILY_CLOSED"
  | "PERMANENTLY_CLOSED"
  | "UNVERIFIED";

export interface MosqueFacilities {
  wuduArea: boolean | null;
  womenPrayerSection: boolean | null;
  parkingAvailable: boolean | null;
  wheelchairAccessible: boolean | null;
  dailyPrayersHeld: boolean | null;
  notes: string | null;
}

export interface MosqueSourceMetadata {
  sourceName: "google_places" | "community_submission" | "official_verification";
  rawId?: string | null;
  googleCid?: string | null;
  placeId?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  lastIngestedAt: string;
  lastVerifiedAt: string | null;
  confidenceScore: number; // 0 to 1
}

export interface Mosque {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: CanadianProvince;
  postalCode: string | null;
  coordinates: Coordinates;
  timezone: string; // IANA e.g. "America/Toronto"
  phone: string | null;
  website: string | null;
  email: string | null;
  classification: MosqueClassification;
  status: MosqueStatus;
  facilities: MosqueFacilities;
  
  /** Physical building opening hours. Completely distinct from prayer times. */
  openingHours: OpeningHoursSchedule | null;

  /** Mosque-specific congregation Iqamah times. Null if unknown. */
  iqamahSchedule: MosqueIqamahSchedule | null;

  /** Mosque Friday prayer schedules. Null or empty shifts if unverified. */
  jummahSchedule: MosqueJummahSchedule | null;

  /** Data provenance and auditability. */
  sourceMetadata: MosqueSourceMetadata;

  createdAt: string;
  updatedAt: string;
}

/**
 * Validates the core required fields of a Mosque domain entity.
 */
export function validateMosqueEntity(mosque: Partial<Mosque>): string[] {
  const errors: string[] = [];

  if (!mosque.id || typeof mosque.id !== "string") errors.push("Mosque must have a valid string id");
  if (!mosque.name || typeof mosque.name !== "string" || mosque.name.trim().length === 0) {
    errors.push("Mosque must have a non-empty name");
  }
  if (!mosque.slug || typeof mosque.slug !== "string") errors.push("Mosque must have a valid slug");
  if (!mosque.address || typeof mosque.address !== "string") errors.push("Mosque must have a valid address");
  if (!mosque.city || typeof mosque.city !== "string") errors.push("Mosque must have a valid city");
  if (!mosque.province || !(mosque.province in CANADIAN_PROVINCES)) {
    errors.push(`Invalid Canadian province: ${mosque.province}`);
  }
  if (!mosque.coordinates || typeof mosque.coordinates.latitude !== "number" || typeof mosque.coordinates.longitude !== "number") {
    errors.push("Mosque must have valid numerical latitude and longitude coordinates");
  }
  if (!mosque.timezone || typeof mosque.timezone !== "string") {
    errors.push("Mosque must have an IANA timezone specified");
  }

  return errors;
}
