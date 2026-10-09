/**
 * Schedule Expiration and Currency Logic
 * 
 * Determines whether an Iqamah or Jummah schedule is currently active, expired,
 * future, or revoked relative to a target date and timezone.
 */

import { ScheduleVerification } from "./types";

export interface ScheduleWithValidity {
  effectiveFrom: string;
  effectiveTo: string | null;
  verification: ScheduleVerification;
  timezone: string;
}

/**
 * Returns today's ISO date string ("YYYY-MM-DD") in the specified IANA timezone.
 */
export function getTodayDateStringInTimezone(timezone: string = "America/Toronto"): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fallback if timezone is invalid
  }
  return new Date().toISOString().split("T")[0];
}

/**
 * Evaluates whether a schedule is currently active and valid.
 * 
 * Strict deterministic requirements:
 * 1. verification.status === "VERIFIED"
 * 2. currentDate >= effectiveFrom
 * 3. currentDate <= effectiveTo (or effectiveTo is null)
 * 4. currentDate <= verification.expiresAt (or expiresAt is null)
 * 5. Not revoked, expired, or pending review
 */
export function isScheduleCurrent(
  schedule: ScheduleWithValidity,
  currentDate?: string
): boolean {
  const targetDate = currentDate || getTodayDateStringInTimezone(schedule.timezone);

  // Status must be strictly VERIFIED
  if (schedule.verification.status !== "VERIFIED") {
    return false;
  }

  // Verification date must exist
  if (!schedule.verification.verifiedAt) {
    return false;
  }

  // Effective range check
  if (targetDate < schedule.effectiveFrom) {
    // Future schedule
    return false;
  }

  if (schedule.effectiveTo && targetDate > schedule.effectiveTo) {
    // Past effective range
    return false;
  }

  // Expiration check
  if (schedule.verification.expiresAt && targetDate > schedule.verification.expiresAt) {
    // Stale / expired verification
    return false;
  }

  return true;
}

/**
 * Evaluates whether a schedule is expiring soon (e.g. within 14 days of expiresAt or effectiveTo).
 */
export function isScheduleExpiringSoon(
  schedule: ScheduleWithValidity,
  currentDate?: string,
  thresholdDays: number = 14
): boolean {
  if (!isScheduleCurrent(schedule, currentDate)) {
    return false;
  }

  const targetDateStr = currentDate || getTodayDateStringInTimezone(schedule.timezone);
  const targetTimestamp = new Date(`${targetDateStr}T00:00:00Z`).getTime();
  const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;

  if (schedule.verification.expiresAt) {
    const expiresTimestamp = new Date(`${schedule.verification.expiresAt}T00:00:00Z`).getTime();
    if (expiresTimestamp - targetTimestamp <= thresholdMs && expiresTimestamp >= targetTimestamp) {
      return true;
    }
  }

  if (schedule.effectiveTo) {
    const effectiveToTimestamp = new Date(`${schedule.effectiveTo}T00:00:00Z`).getTime();
    if (effectiveToTimestamp - targetTimestamp <= thresholdMs && effectiveToTimestamp >= targetTimestamp) {
      return true;
    }
  }

  return false;
}
