/**
 * Schedule Validation Logic
 * 
 * Validates IqamahSchedule and JummahSchedule records against strict integrity constraints:
 * - 24-hour time formats ("HH:mm")
 * - Valid ISO dates ("YYYY-MM-DD")
 * - Logical effective ranges (effectiveTo >= effectiveFrom)
 * - Required provenance fields
 * - Required verification fields
 */

import { IqamahSchedule } from "../iqamah/types";
import { JummahSchedule } from "../jummah/types";
import { ScheduleSource, ScheduleVerification } from "./types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isValidTimeString(val: unknown): boolean {
  if (typeof val !== "string") return false;
  return TIME_REGEX.test(val.trim());
}

export function isValidDateString(val: unknown): boolean {
  if (typeof val !== "string") return false;
  if (!DATE_REGEX.test(val.trim())) return false;
  const d = new Date(val);
  return !Number.isNaN(d.getTime());
}

export function validateScheduleSource(source: unknown): string[] {
  const errors: string[] = [];
  if (!source || typeof source !== "object") {
    return ["Source metadata is required"];
  }

  const s = source as Partial<ScheduleSource>;
  if (!s.sourceType) {
    errors.push("Source sourceType is required");
  }
  if (!s.sourceName || typeof s.sourceName !== "string" || s.sourceName.trim().length === 0) {
    errors.push("Source sourceName is required");
  }
  if (!s.retrievedAt || !isValidDateString(s.retrievedAt.split("T")[0])) {
    errors.push("Source retrievedAt must be a valid date or timestamp");
  }
  if (s.sourceUrl && typeof s.sourceUrl === "string") {
    try {
      const u = new URL(s.sourceUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        errors.push("Source sourceUrl must use http or https protocol");
      }
    } catch {
      errors.push("Source sourceUrl is not a valid URL");
    }
  }

  return errors;
}

export function validateScheduleVerification(verification: unknown): string[] {
  const errors: string[] = [];
  if (!verification || typeof verification !== "object") {
    return ["Verification metadata is required"];
  }

  const v = verification as Partial<ScheduleVerification>;
  const validStatuses = ["UNVERIFIED", "PENDING_REVIEW", "VERIFIED", "EXPIRED", "REVOKED"];
  if (!v.status || !validStatuses.includes(v.status)) {
    errors.push(`Invalid verification status: ${v.status}`);
  }

  if (v.status === "VERIFIED") {
    if (!v.verifiedAt || !isValidDateString(v.verifiedAt.split("T")[0])) {
      errors.push("Verified schedule must have a valid verifiedAt timestamp");
    }
  }

  if (v.expiresAt && !isValidDateString(v.expiresAt)) {
    errors.push("expiresAt must be a valid date string (YYYY-MM-DD)");
  }

  return errors;
}

export function validateIqamahSchedule(record: unknown): ValidationResult {
  const errors: string[] = [];

  if (!record || typeof record !== "object") {
    return { isValid: false, errors: ["Iqamah record must be an object"] };
  }

  const r = record as Partial<IqamahSchedule>;

  if (!r.id || typeof r.id !== "string") {
    errors.push("Record id is required");
  }
  if (!r.mosqueId || typeof r.mosqueId !== "string") {
    errors.push("mosqueId is required");
  }
  if (!r.timezone || typeof r.timezone !== "string") {
    errors.push("timezone is required");
  }

  if (!r.effectiveFrom || !isValidDateString(r.effectiveFrom)) {
    errors.push("effectiveFrom must be a valid date string (YYYY-MM-DD)");
  }

  if (r.effectiveTo) {
    if (!isValidDateString(r.effectiveTo)) {
      errors.push("effectiveTo must be a valid date string (YYYY-MM-DD)");
    } else if (r.effectiveFrom && r.effectiveTo < r.effectiveFrom) {
      errors.push("effectiveTo cannot be before effectiveFrom");
    }
  }

  if (!r.schedule || typeof r.schedule !== "object") {
    errors.push("schedule object is required");
  } else {
    const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
    let hasAnyTime = false;

    for (const p of prayers) {
      const val = r.schedule[p];
      if (val !== null && val !== undefined) {
        if (!isValidTimeString(val)) {
          errors.push(`Prayer ${p} has invalid time format: "${val}" (expected HH:mm)`);
        } else {
          hasAnyTime = true;
        }
      }
    }

    if (!hasAnyTime) {
      errors.push("At least one prayer time must be provided in schedule");
    }
  }

  errors.push(...validateScheduleSource(r.source));
  errors.push(...validateScheduleVerification(r.verification));

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateJummahSchedule(record: unknown): ValidationResult {
  const errors: string[] = [];

  if (!record || typeof record !== "object") {
    return { isValid: false, errors: ["Jummah record must be an object"] };
  }

  const r = record as Partial<JummahSchedule>;

  if (!r.id || typeof r.id !== "string") {
    errors.push("Record id is required");
  }
  if (!r.mosqueId || typeof r.mosqueId !== "string") {
    errors.push("mosqueId is required");
  }
  if (!r.timezone || typeof r.timezone !== "string") {
    errors.push("timezone is required");
  }

  if (!r.effectiveFrom || !isValidDateString(r.effectiveFrom)) {
    errors.push("effectiveFrom must be a valid date string (YYYY-MM-DD)");
  }

  if (r.effectiveTo) {
    if (!isValidDateString(r.effectiveTo)) {
      errors.push("effectiveTo must be a valid date string (YYYY-MM-DD)");
    } else if (r.effectiveFrom && r.effectiveTo < r.effectiveFrom) {
      errors.push("effectiveTo cannot be before effectiveFrom");
    }
  }

  if (!Array.isArray(r.shifts) || r.shifts.length === 0) {
    errors.push("shifts array must contain at least one Friday prayer shift");
  } else {
    r.shifts.forEach((s, idx) => {
      if (typeof s.shiftNumber !== "number" || s.shiftNumber < 1) {
        errors.push(`Shift at index ${idx} must have a positive shiftNumber`);
      }
      if (!isValidTimeString(s.khutbahTime)) {
        errors.push(`Shift ${s.shiftNumber || idx + 1} has invalid khutbahTime: "${s.khutbahTime}" (expected HH:mm)`);
      }
      if (s.prayerTime && !isValidTimeString(s.prayerTime)) {
        errors.push(`Shift ${s.shiftNumber || idx + 1} has invalid prayerTime: "${s.prayerTime}" (expected HH:mm)`);
      }
    });
  }

  errors.push(...validateScheduleSource(r.source));
  errors.push(...validateScheduleVerification(r.verification));

  return {
    isValid: errors.length === 0,
    errors,
  };
}
