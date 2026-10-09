/**
 * Estimated Iqamah Engine
 *
 * Calculates estimated congregation times by adding configured minute offsets
 * to each calculated astronomical prayer time.
 *
 * CONTRACT:
 *   Input:  CalculatedPrayerSchedule  (from the existing prayer engine)
 *   Config: EstimatedIqamahConfig     (configurable per-prayer offsets)
 *   Output: EstimatedIqamahResult     (never verified, never authoritative)
 *
 * ARCHITECTURAL INVARIANTS:
 *   - This engine never produces a ScheduleVerification
 *   - Results are never written to verified.json
 *   - Results are always typed as { type: "ESTIMATED" }
 *   - Jummah is NOT estimated by this engine (no Jummah output)
 *   - Sunrise is NOT an Iqamah prayer (excluded from output)
 *   - Date rollover (e.g. 23:55 + 15 min = 00:10) is handled correctly
 *   - All times formatted in the mosque's local IANA timezone
 */

import { CalculatedPrayerSchedule } from "@/domain/prayer/types";
import {
  EstimatedIqamahConfig,
  EstimatedIqamahEntry,
  EstimatedIqamahResult,
} from "./types";
import { assertValidConfig } from "./validation";
import { DEFAULT_ESTIMATED_IQAMAH_CONFIG } from "./defaults";

/**
 * Applies a minute offset to a Date, producing a new Date.
 * Correctly handles rollover past midnight (positive or negative offset).
 */
function addMinutesToDate(date: Date, offsetMinutes: number): Date {
  return new Date(date.getTime() + offsetMinutes * 60 * 1000);
}

/**
 * Formats a Date to a local HH:mm string in the given IANA timezone.
 * Uses 24-hour time to match the verified Iqamah HH:mm format contract.
 */
function formatLocalHHmm(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Builds a single EstimatedIqamahEntry for one prayer.
 */
function buildEntry(
  prayer: EstimatedIqamahEntry["prayer"],
  prayerDate: Date,
  offsetMinutes: number,
  timezone: string
): EstimatedIqamahEntry {
  const estimatedDate = addMinutesToDate(prayerDate, offsetMinutes);
  return {
    prayer,
    calculatedTime: formatLocalHHmm(prayerDate, timezone),
    estimatedTime: formatLocalHHmm(estimatedDate, timezone),
    offsetMinutes,
  };
}

/**
 * Calculates estimated Iqamah times from a calculated prayer schedule.
 *
 * @param prayerSchedule - The output of the PrayerTimeEngine for today's date
 * @param config         - The offset configuration to apply (defaults to DEFAULT_ESTIMATED_IQAMAH_CONFIG)
 * @returns EstimatedIqamahResult — always typed as ESTIMATED, never VERIFIED
 *
 * @throws Error if prayerSchedule is null/undefined
 * @throws Error if config fails validation
 */
export function calculateEstimatedIqamah(
  prayerSchedule: CalculatedPrayerSchedule,
  config: EstimatedIqamahConfig = DEFAULT_ESTIMATED_IQAMAH_CONFIG
): EstimatedIqamahResult {
  if (!prayerSchedule) {
    throw new Error(
      "calculateEstimatedIqamah requires a valid CalculatedPrayerSchedule."
    );
  }

  assertValidConfig(config);

  const { times, timezone, date, coordinates, } = prayerSchedule;
  const { offsets, disclaimer, basis } = config;

  return {
    type: "ESTIMATED",
    basis,
    date,
    timezone,
    coordinates,
    offsets,
    disclaimer,
    times: {
      fajr: buildEntry("fajr", times.fajr, offsets.fajrOffsetMinutes, timezone),
      dhuhr: buildEntry("dhuhr", times.dhuhr, offsets.dhuhrOffsetMinutes, timezone),
      asr: buildEntry("asr", times.asr, offsets.asrOffsetMinutes, timezone),
      maghrib: buildEntry("maghrib", times.maghrib, offsets.maghribOffsetMinutes, timezone),
      isha: buildEntry("isha", times.isha, offsets.ishaOffsetMinutes, timezone),
    },
  };
}
