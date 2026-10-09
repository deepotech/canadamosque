/**
 * Toronto Prayer Times Application Service
 *
 * Integration layer sitting between Next.js pages and the PrayerTimeEngine.
 *
 * Architecture:
 *   UI (Next.js page)
 *    ↓
 *   TorontoPrayerService          ← this file
 *    ↓
 *   PrayerTimeEngine (domain)     ← src/domain/prayer/engine.ts
 *    ↓
 *   adhan library (astronomical)  ← adhan v4.4.6
 *
 * Rules enforced here:
 * - Does NOT use opening hours as prayer times.
 * - Does NOT return mosque Iqamah times.
 * - Does NOT invent or hard-code prayer times.
 * - Every result is clearly labelled as "calculated" (astronomical).
 */

import { defaultPrayerTimeEngine } from "@/domain/prayer/engine";
import type {
  CalculatedPrayerSchedule,
  FormattedPrayerTimes,
} from "@/domain/prayer/types";

/** Toronto geographic coordinates and timezone. */
export const TORONTO_LOCATION = {
  name: "Toronto, Ontario",
  latitude: 43.6532,
  longitude: -79.3832,
  timezone: "America/Toronto",
} as const;

/**
 * Returns today's calculated astronomical prayer times for Toronto.
 * Uses the current date in the America/Toronto timezone to avoid day-boundary errors.
 */
export function getTodayTorontoPrayerTimes(): CalculatedPrayerSchedule {
  const todayDateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_LOCATION.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-");

  // Intl.DateTimeFormat returns MM/DD/YYYY in some locales; normalize to YYYY-MM-DD
  const normalizedDate = normalizeDateString(todayDateKey);

  return defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: TORONTO_LOCATION.latitude,
    longitude: TORONTO_LOCATION.longitude,
    date: normalizedDate,
    timezone: TORONTO_LOCATION.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

/**
 * Returns the calculated prayer times for a specific date in Toronto.
 */
export function getTorontoPrayerTimes(
  dateString: string
): CalculatedPrayerSchedule {
  return defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: TORONTO_LOCATION.latitude,
    longitude: TORONTO_LOCATION.longitude,
    date: dateString,
    timezone: TORONTO_LOCATION.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

/**
 * Returns formatted (HH:mm) Toronto prayer times for today, ready for display.
 */
export function getFormattedTodayTorontoPrayerTimes(): {
  schedule: CalculatedPrayerSchedule;
  formatted: FormattedPrayerTimes;
} {
  const schedule = getTodayTorontoPrayerTimes();
  const formatted = defaultPrayerTimeEngine.formatSchedule(schedule, false);
  return { schedule, formatted };
}

/**
 * Returns full Toronto monthly schedule.
 */
export function getTorontoMonthlySchedule(
  year: number,
  month: number
): CalculatedPrayerSchedule[] {
  return defaultPrayerTimeEngine.calculateMonthlySchedule(year, month, {
    latitude: TORONTO_LOCATION.latitude,
    longitude: TORONTO_LOCATION.longitude,
    timezone: TORONTO_LOCATION.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalizes various date string formats to YYYY-MM-DD.
 * Handles Intl.DateTimeFormat output variation across platforms.
 */
function normalizeDateString(input: string): string {
  // Accept: YYYY-MM-DD, YYYY/MM/DD, MM/DD/YYYY (Intl variation)
  const clean = input.trim();

  // YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(clean)) {
    return clean.replace(/\//g, "-");
  }

  // MM/DD/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [m, d, y] = clean.split("/");
    return `${y}-${m}-${d}`;
  }

  // Fallback: return as-is and let the engine validate
  return clean;
}
