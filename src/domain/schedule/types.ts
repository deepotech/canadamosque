/**
 * Schedule Provenance & Verification Domain Types
 * 
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Mosque congregation schedules (Iqamah and Jummah) can ONLY originate from
 * verified mosque-specific sources. They are NEVER derived from astronomical prayer
 * times, opening hours, or web-scraped guesses.
 */

export type ScheduleSourceType =
  | "OFFICIAL_WEBSITE"
  | "OFFICIAL_MOSQUE_PAGE"
  | "OFFICIAL_SOCIAL_MEDIA"
  | "DIRECT_MOSQUE_CONFIRMATION"
  | "MANUAL_VERIFICATION"
  | "OTHER";

export interface ScheduleSource {
  sourceType: ScheduleSourceType;
  sourceName: string;
  sourceUrl?: string | null;
  sourceReference?: string | null;
  /** ISO date string YYYY-MM-DD or full ISO timestamp */
  retrievedAt: string;
  notes?: string | null;
}

export type ScheduleVerificationStatus =
  | "UNVERIFIED"
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "EXPIRED"
  | "REVOKED";

export type ScheduleConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface ScheduleVerification {
  status: ScheduleVerificationStatus;
  /** ISO date string YYYY-MM-DD or full ISO timestamp when verification occurred */
  verifiedAt: string | null;
  /** ISO date string YYYY-MM-DD when this verification is deemed to expire if not refreshed */
  expiresAt?: string | null;
  verifiedBy?: string | null;
  method?: string | null;
  notes?: string | null;
}

/**
 * Quality and conflict metrics for schedule audits.
 */
export interface ScheduleQualityMetrics {
  totalIqamahRecords: number;
  verifiedIqamahRecords: number;
  pendingIqamahRecords: number;
  expiredIqamahRecords: number;
  revokedIqamahRecords: number;
  currentIqamahRecords: number;
  iqamahWithoutSource: number;
  iqamahExpiringSoon: number;

  totalJummahRecords: number;
  verifiedJummahRecords: number;
  pendingJummahRecords: number;
  expiredJummahRecords: number;
  revokedJummahRecords: number;
  currentJummahRecords: number;
  jummahWithoutSource: number;
  jummahExpiringSoon: number;

  conflictingSchedulesCount: number;
  mosquesWithVerifiedIqamah: number;
  mosquesWithVerifiedJummah: number;
  jummahLocationsWithVerifiedSchedule: number;
}
