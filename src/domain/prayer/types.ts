/**
 * Production-Grade Calculated Prayer Times Domain Types
 * 
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Calculated Prayer Times are astronomically computed prayer windows based on:
 * 1. Geographic coordinates (latitude, longitude)
 * 2. Calendar date
 * 3. Accurate Canadian timezone (accounting for daylight saving transitions)
 * 4. Explicit calculation methodology (e.g., ISNA, MWL)
 * 5. Juristic method for Asr (STANDARD / SHAFI / MALIKI / HANBALI vs HANAFI)
 * 6. High-latitude rule for northern Canadian territories and summer twilight
 * 
 * They are STRICTLY NOT:
 * - Mosque Iqamah congregation times
 * - Mosque Jummah schedules
 * - Location opening hours
 */

export type PrayerName =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

/**
 * Calculation methodology definition.
 * ISNA: Fajr 15°, Isha 15° (Islamic Society of North America - Standard Canadian pilot)
 * MWL: Fajr 18°, Isha 17° (Muslim World League)
 * EGYPTIAN: Fajr 19.5°, Isha 17.5° (Egyptian General Authority of Survey)
 * MAKKAH: Fajr 18.5°, Isha interval 90 minutes after Maghrib (Umm Al-Qura University, Makkah)
 * KARACHI: Fajr 18°, Isha 18° (University of Islamic Sciences, Karachi)
 * CUSTOM: User-specified Fajr/Isha angles
 */
export type CalculationMethod =
  | "ISNA"
  | "MWL"
  | "EGYPTIAN"
  | "MAKKAH"
  | "KARACHI"
  | "CUSTOM";

/**
 * Juristic method for Asr prayer.
 * STANDARD: Shadow length factor = 1 (Shafi, Maliki, Hanbali)
 * HANAFI: Shadow length factor = 2 (Hanafi)
 */
export type AsrMethod = "STANDARD" | "HANAFI";

/**
 * High-latitude adjustment rule for locations where astronomical twilight
 * does not occur or is extremely late during summer.
 * 
 * ANGLE_BASED: Night fraction proportional to twilight angle (fajrAngle / 60)
 * ONE_SEVENTH: 1/7th of the night (between sunset and sunrise)
 * MIDDLE_OF_NIGHT: 1/2 of the night (middle of the night)
 */
export type HighLatitudeRule =
  | "ANGLE_BASED"
  | "ONE_SEVENTH"
  | "MIDDLE_OF_NIGHT";

/**
 * Custom angle configuration when calculationMethod is "CUSTOM".
 */
export interface CustomCalculationAngles {
  fajrAngle: number;
  ishaAngle?: number;
  ishaIntervalMinutes?: number;
  maghribAngle?: number;
}

/**
 * Input request parameters to calculate prayer times.
 */
export interface PrayerCalculationRequest {
  latitude: number;
  longitude: number;
  /** ISO date string "YYYY-MM-DD" or Date object */
  date: string | Date;
  /** IANA Timezone identifier, e.g. "America/Toronto" */
  timezone: string;
  calculationMethod?: CalculationMethod;
  customAngles?: CustomCalculationAngles;
  asrMethod?: AsrMethod;
  highLatitudeRule?: HighLatitudeRule;
}

/**
 * High latitude adjustment metadata.
 */
export interface HighLatitudeAdjustmentMetadata {
  applied: boolean;
  rule: HighLatitudeRule;
  fajrAdjusted: boolean;
  ishaAdjusted: boolean;
  astronomicalFajrImpossible: boolean;
  astronomicalIshaImpossible: boolean;
}

/**
 * Inspectable calculation metadata capturing all engine assumptions.
 */
export interface CalculationMetadata {
  calculationMethod: CalculationMethod;
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes: number;
  asrMethod: AsrMethod;
  highLatitudeRule: HighLatitudeRule;
  timezone: string;
  date: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  highLatitudeAdjustment: HighLatitudeAdjustmentMetadata;
  warnings: string[];
}

/**
 * Structured calculated prayer times holding native Date instances.
 */
export interface StructuredPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

/**
 * Complete engine calculation result.
 * Deterministic and structured first, with formatting as a separate concern.
 */
export interface CalculatedPrayerSchedule {
  /** Target date in YYYY-MM-DD */
  date: string;
  /** IANA timezone */
  timezone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  settings: {
    calculationMethod: CalculationMethod;
    asrMethod: AsrMethod;
    highLatitudeRule: HighLatitudeRule;
    fajrAngle: number;
    ishaAngle: number;
    ishaIntervalMinutes: number;
  };
  times: StructuredPrayerTimes;
  metadata: CalculationMetadata;
}

/**
 * Formatted string representation of daily prayer times.
 */
export interface FormattedPrayerTimes {
  date: string;
  timezone: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Default Canadian pilot prayer calculation configuration.
 * Standard established across Canadian mosques is ISNA (15°/15°), Standard Asr, Angle-based high latitude.
 */
export const DEFAULT_CANADIAN_PRAYER_CONFIG: {
  calculationMethod: CalculationMethod;
  asrMethod: AsrMethod;
  highLatitudeRule: HighLatitudeRule;
} = {
  calculationMethod: "ISNA",
  asrMethod: "STANDARD",
  highLatitudeRule: "ANGLE_BASED",
};

/**
 * Supported Canadian IANA timezones.
 */
export const SUPPORTED_CANADIAN_TIMEZONES = [
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns",
] as const;

export type SupportedCanadianTimezone = typeof SUPPORTED_CANADIAN_TIMEZONES[number];
