import { Coordinates } from "@/domain/geo/coordinates";
import { OpeningHoursSchedule } from "@/domain/opening-hours/types";
import { CanadianProvince, MosqueFacilities } from "@/domain/mosque/types";

export type QualityFlag =
  | "MISSING_PHONE"
  | "MISSING_WEBSITE"
  | "MISSING_HOURS"
  | "MISSING_DESCRIPTION"
  | "INVALID_COORDINATES"
  | "OUTSIDE_CANADA"
  | "OUTSIDE_TORONTO_PILOT_AREA"
  | "OUTSIDE_CITY_BOUNDS"
  | "PROVINCE_MISMATCH"
  | "GENERIC_NAME"
  | "POSSIBLE_DUPLICATE"
  | "SHARED_ADDRESS"
  | "POSSIBLE_CLOSED_LOCATION"
  | "POSSIBLE_MOVED_LOCATION"
  | "POSSIBLE_NOT_A_MOSQUE"
  | "CONTRADICTORY_INFORMATION"
  | "ORGANIZATION_WITHOUT_PRAYER_LOCATION"
  | "PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE";

export type PipelineClassification =
  | "MOSQUE"
  | "ISLAMIC_CENTER"
  | "MUSALLA"
  | "PRAYER_ROOM"
  | "JUMMAH_LOCATION"
  | "COMMUNITY_CENTER"
  | "ORGANIZATION"
  | "REVIEW_REQUIRED"
  | "EXCLUDE";

export type PublicationStatus = "PUBLISHED" | "REVIEW_REQUIRED" | "EXCLUDED";

export type DuplicateRelationType =
  | "EXACT_DUPLICATE"
  | "POSSIBLE_DUPLICATE"
  | "SHARED_LOCATION"
  | "DISTINCT";

export interface DuplicateRelation {
  type: DuplicateRelationType;
  targetIndex: number;
  targetTitle: string;
  targetPlaceId?: string | null;
  reason: string;
}

export interface NormalizedPostalCode {
  raw: string | null;
  normalized: string | null; // A1A 1A1 standard format
}

export interface NormalizedPhone {
  raw: string;
  normalized: string | null; // E.164 e.g. +14162558338
}

export interface NormalizedAddress {
  raw: string;
  streetAddress: string | null;
  city: string;
  province: CanadianProvince;
  postalCode: NormalizedPostalCode;
  country: "CA";
}

export interface NormalizedProvenance {
  sourceFile: string;
  sourceIndex: number;
  cid: string | null;
  placeId: string | null;
  rawCategoryName: string | null;
  rawCategories: string[];
  rating: number | null;
  reviewsCount: number | null;
  ingestedAt: string;
}

export interface ProcessedMosqueRecord {
  id: string;
  sourceIndex: number;
  name: string;
  slug: string;
  address: NormalizedAddress;
  coordinates: Coordinates;
  phone: NormalizedPhone | null;
  website: string | null;
  classification: PipelineClassification;
  classificationReason: string;
  openingHours: OpeningHoursSchedule | null;
  facilities: MosqueFacilities;
  qualityFlags: QualityFlag[];
  duplicateRelations: DuplicateRelation[];
  publicationStatus: PublicationStatus;
  publicationReason: string;
  provenance: NormalizedProvenance;
}

export interface PipelineAuditReport {
  totalRawRecords: number;
  publishedCount: number;
  reviewRequiredCount: number;
  excludedCount: number;
  classificationCounts: Record<PipelineClassification, number>;
  publicationStatusCounts: Record<PublicationStatus, number>;
  geographyDistribution: Record<string, number>;
  qualityFlagCounts: Record<QualityFlag, number>;
  missingFields: {
    missingPhone: number;
    missingWebsite: number;
    missingHours: number;
    missingDescription: number;
  };
  duplicatesSummary: {
    exactDuplicates: number;
    possibleDuplicates: number;
    sharedLocations: number;
  };
  reviewRequiredRecords: Array<{
    sourceIndex: number;
    id: string;
    name: string;
    address: string;
    city: string;
    classification: PipelineClassification;
    flags: QualityFlag[];
    reason: string;
  }>;
  excludedRecords: Array<{
    sourceIndex: number;
    id: string;
    name: string;
    address: string;
    classification: PipelineClassification;
    reason: string;
  }>;
}
