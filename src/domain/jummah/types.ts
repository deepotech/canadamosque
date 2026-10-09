/**
 * Jummah (Friday Prayer) Domain
 * 
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * Jummah services are specific Friday prayer congregations hosted by a mosque or prayer location.
 * Many Canadian urban mosques host multiple consecutive shifts to accommodate capacity.
 * 
 * Rules:
 * 1. Must only reflect verified announcements directly from the venue.
 * 2. If unknown or not held, shifts array is empty.
 * 3. Never fabricate shift times, khateebs, or languages.
 * 4. JUMMAH_LOCATION places are supported without promoting them to MOSQUE.
 */

import {
  ScheduleConfidence,
  ScheduleSource,
  ScheduleVerification,
} from "../schedule/types";

export interface JummahShiftEntry {
  shiftNumber: number;
  /** 24-hour format string "HH:mm" e.g. "12:30" or "13:30" */
  khutbahTime: string;
  /** 24-hour format string "HH:mm" e.g. "13:00" or null if only single start time announced */
  prayerTime?: string | null;
  language?: string | null; // e.g. "English", "Arabic / English", "Urdu"
  locationNotes?: string | null; // e.g. "Main Prayer Hall", "Gymnasium", "Lower Level"
}

export interface JummahSchedule {
  id: string;
  mosqueId: string;
  timezone: string; // IANA e.g. "America/Toronto"
  /** ISO date string YYYY-MM-DD when this schedule becomes active */
  effectiveFrom: string;
  /** ISO date string YYYY-MM-DD or null if effective indefinitely until next announcement */
  effectiveTo: string | null;
  shifts: JummahShiftEntry[];
  registrationRequired: boolean | null;
  registrationUrl?: string | null;
  source: ScheduleSource;
  verification: ScheduleVerification;
  confidence: ScheduleConfidence;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Backward-compatibility alias for legacy code
export interface JummahShift {
  shiftNumber: number;
  khutbahTime: string;
  prayerTime: string;
  khateebName?: string | null;
  language?: string | null;
  locationNotes?: string | null;
}

export interface MosqueJummahSchedule {
  isJummahHeld: boolean;
  shifts: JummahShift[];
  registrationRequired: boolean | null;
  registrationUrl?: string | null;
  parkingNotes?: string | null;
  lastVerifiedAt: string | null;
  sourceAttribution: string | null;
}

export function createEmptyJummahSchedule(): MosqueJummahSchedule {
  return {
    isJummahHeld: false,
    shifts: [],
    registrationRequired: null,
    registrationUrl: null,
    parkingNotes: null,
    lastVerifiedAt: null,
    sourceAttribution: null,
  };
}
