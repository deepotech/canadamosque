/**
 * Opening Hours Domain
 * 
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Opening hours define when the physical building doors / facility are open or closed to the public.
 * 
 * Opening hours are NOT:
 * - Astronomical Prayer Times (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * - Mosque Iqamah congregation times
 * - Jummah times
 * 
 * Under NO circumstances should Opening Hours ever be parsed or coerced
 * into prayer calculation or prayer schedules.
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface OpeningHoursPeriod {
  /** 24-hour format string, e.g. "09:00" */
  openTime: string;
  /** 24-hour format string, e.g. "21:30" */
  closeTime: string;
}

export interface DayOpeningHours {
  day: DayOfWeek;
  isClosed: boolean;
  isOpen24Hours: boolean;
  /**
   * Raw string as reported by the source (e.g., "Closed", "Open 24 hours", "9:00 AM - 10:00 PM")
   */
  rawText: string;
  periods: OpeningHoursPeriod[];
}

export interface OpeningHoursSchedule {
  days: DayOpeningHours[];
  notes?: string | null;
}

/**
 * Type guard to explicitly ensure opening hours are never confused with prayer times.
 */
export function isOpeningHoursSchedule(obj: unknown): obj is OpeningHoursSchedule {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return Array.isArray(o.days);
}
