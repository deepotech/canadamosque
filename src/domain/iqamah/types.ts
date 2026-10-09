/**
 * Iqamah (Congregational Prayer Times) Domain
 * 
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Iqamah is the exact congregational prayer time established and conducted inside a specific mosque.
 * 
 * Rules:
 * 1. Iqamah times can ONLY come from verified mosque sources (official mosque website, direct schedule board, or official social media).
 * 2. They are NEVER derived from calculated prayer times or opening hours.
 * 3. Sunrise is NOT a prayer with an Iqamah; only the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) have Iqamahs.
 * 4. If a mosque's Iqamah times are unknown, all values MUST remain null. NEVER fabricate or default.
 */

import {
  ScheduleConfidence,
  ScheduleSource,
  ScheduleVerification,
} from "../schedule/types";

export interface DailyIqamahTimes {
  /** 24-hour format string "HH:mm" e.g. "06:15" or null if unestablished/unknown */
  fajr: string | null;
  /** 24-hour format string "HH:mm" e.g. "13:30" or null if unestablished/unknown */
  dhuhr: string | null;
  /** 24-hour format string "HH:mm" e.g. "17:45" or null if unestablished/unknown */
  asr: string | null;
  /** 24-hour format string "HH:mm" or null (often immediately after Maghrib Adhan) */
  maghrib: string | null;
  /** 24-hour format string "HH:mm" e.g. "21:15" or null if unestablished/unknown */
  isha: string | null;
}

export interface IqamahSchedule {
  id: string;
  mosqueId: string;
  timezone: string; // IANA e.g. "America/Toronto"
  /** ISO date string YYYY-MM-DD when this schedule becomes active */
  effectiveFrom: string;
  /** ISO date string YYYY-MM-DD or null if effective indefinitely until next update */
  effectiveTo: string | null;
  schedule: DailyIqamahTimes;
  source: ScheduleSource;
  verification: ScheduleVerification;
  confidence: ScheduleConfidence;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Backward-compatibility alias for legacy code
export interface IqamahTimeEntry {
  time: string;
  isFixedTime: boolean;
  offsetMinutesAfterAdhan?: number | null;
}

export interface MosqueIqamahSchedule {
  fajr: IqamahTimeEntry | null;
  dhuhr: IqamahTimeEntry | null;
  asr: IqamahTimeEntry | null;
  maghrib: IqamahTimeEntry | null;
  isha: IqamahTimeEntry | null;
  lastVerifiedAt: string | null;
  sourceAttribution: string | null;
}

export function createEmptyIqamahSchedule(): MosqueIqamahSchedule {
  return {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
    lastVerifiedAt: null,
    sourceAttribution: null,
  };
}
