import {
  CalculatedPrayerSchedule,
  FormattedPrayerTimes,
  PrayerCalculationRequest,
} from "./types";

/**
 * Production-grade Prayer Time Engine Interface Contract.
 * 
 * Strict Architectural Principles:
 * 1. Independent of React, Next.js, and browser APIs. Usable in pure Node.js/TypeScript.
 * 2. Deterministic calculations.
 * 3. Returns structured Date objects first; formatting is handled via separate utility.
 * 4. Transparent metadata explaining every astronomical assumption and high-latitude adjustment.
 */
export interface IPrayerTimeEngine {
  /**
   * Calculates astronomical prayer times for a single date and location.
   */
  calculatePrayerTimes(request: PrayerCalculationRequest): CalculatedPrayerSchedule;

  /**
   * Calculates astronomical prayer times for a calendar month.
   */
  calculateMonthlySchedule(
    year: number,
    month: number, // 1-indexed (1 = Jan, 12 = Dec)
    request: Omit<PrayerCalculationRequest, "date">
  ): CalculatedPrayerSchedule[];

  /**
   * Formats structured prayer times into localized 24-hour ("HH:mm") or 12-hour ("h:mm a") strings.
   */
  formatSchedule(
    schedule: CalculatedPrayerSchedule,
    format12Hour?: boolean
  ): FormattedPrayerTimes;
}
