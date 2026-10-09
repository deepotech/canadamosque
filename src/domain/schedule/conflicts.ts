/**
 * Schedule Conflict Detection
 * 
 * Flags situations where two or more currently active, verified schedules
 * for the same mosque overlap in their effective date range.
 * 
 * Strict policy: If a conflict exists, NEVER silently pick one.
 * Flag the conflict and withhold both from public display until resolved.
 */

import { IqamahSchedule } from "../iqamah/types";
import { JummahSchedule } from "../jummah/types";
import { isScheduleCurrent } from "./expiration";

export interface ScheduleConflict {
  mosqueId: string;
  type: "IQAMAH" | "JUMMAH";
  conflictingScheduleIds: string[];
  reason: string;
}

function doDateRangesOverlap(
  startA: string,
  endA: string | null,
  startB: string,
  endB: string | null
): boolean {
  // If A ends before B starts, no overlap
  if (endA && endA < startB) return false;
  // If B ends before A starts, no overlap
  if (endB && endB < startA) return false;
  // Otherwise they overlap
  return true;
}

export function detectIqamahConflicts(
  records: IqamahSchedule[],
  targetDate?: string
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const currentRecords = records.filter((r) => isScheduleCurrent(r, targetDate));

  // Group by mosqueId
  const byMosque = new Map<string, IqamahSchedule[]>();
  for (const r of currentRecords) {
    const list = byMosque.get(r.mosqueId) || [];
    list.push(r);
    byMosque.set(r.mosqueId, list);
  }

  for (const [mosqueId, list] of byMosque.entries()) {
    if (list.length > 1) {
      // Check for overlapping effective ranges with differing times
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          if (doDateRangesOverlap(a.effectiveFrom, a.effectiveTo, b.effectiveFrom, b.effectiveTo)) {
            // Check if schedules differ
            const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
            const hasDifference = prayers.some((p) => a.schedule[p] !== b.schedule[p]);

            if (hasDifference) {
              conflicts.push({
                mosqueId,
                type: "IQAMAH",
                conflictingScheduleIds: [a.id, b.id],
                reason: `Conflicting verified Iqamah schedules for overlapping dates (${a.effectiveFrom} to ${a.effectiveTo || "open"} vs ${b.effectiveFrom} to ${b.effectiveTo || "open"})`,
              });
            }
          }
        }
      }
    }
  }

  return conflicts;
}

export function detectJummahConflicts(
  records: JummahSchedule[],
  targetDate?: string
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const currentRecords = records.filter((r) => isScheduleCurrent(r, targetDate));

  // Group by mosqueId
  const byMosque = new Map<string, JummahSchedule[]>();
  for (const r of currentRecords) {
    const list = byMosque.get(r.mosqueId) || [];
    list.push(r);
    byMosque.set(r.mosqueId, list);
  }

  for (const [mosqueId, list] of byMosque.entries()) {
    if (list.length > 1) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          if (doDateRangesOverlap(a.effectiveFrom, a.effectiveTo, b.effectiveFrom, b.effectiveTo)) {
            // Compare shift times
            const shiftsA = a.shifts.map((s) => s.khutbahTime).sort().join(",");
            const shiftsB = b.shifts.map((s) => s.khutbahTime).sort().join(",");

            if (shiftsA !== shiftsB) {
              conflicts.push({
                mosqueId,
                type: "JUMMAH",
                conflictingScheduleIds: [a.id, b.id],
                reason: `Conflicting verified Jummah schedules for overlapping dates (${a.effectiveFrom} to ${a.effectiveTo || "open"} vs ${b.effectiveFrom} to ${b.effectiveTo || "open"})`,
              });
            }
          }
        }
      }
    }
  }

  return conflicts;
}
