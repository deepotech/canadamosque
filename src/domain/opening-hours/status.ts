import { OpeningHoursSchedule } from "./types";

export interface OpenStatusResult {
  isOpen: boolean | null;
  statusText: string;
  is24Hours?: boolean;
  todayScheduleText?: string;
  reason?: string;
}

/**
 * Parses a single time string like "5:30 AM", "1 PM", "11:30", "12 AM", "12 PM"
 * into minutes from start of day (0 to 1440).
 */
function parseTimeToMinutes(timeStr: string, fallbackPeriod?: "AM" | "PM"): number | null {
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const min = match[2] ? parseInt(match[2], 10) : 0;
  const period = (match[3] || fallbackPeriod || "").toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  // Handle "12 AM" = midnight (0 mins), "12 PM" = noon (720 mins)
  return hour * 60 + min;
}

/**
 * Parses time range segment like "6 AM to 11:30 PM", "1 to 3 PM", "12:30 to 1 PM"
 */
function parseRangeSegment(segment: string): { startMins: number; endMins: number } | null {
  const parts = segment.split(/\s+(?:to|-|–)\s+/i);
  if (parts.length !== 2) return null;

  const endStr = parts[1].trim();
  const endPeriod = endStr.toUpperCase().includes("PM")
    ? "PM"
    : endStr.toUpperCase().includes("AM")
    ? "AM"
    : undefined;

  const startStr = parts[0].trim();
  const startPeriod = startStr.toUpperCase().includes("PM")
    ? "PM"
    : startStr.toUpperCase().includes("AM")
    ? "AM"
    : endPeriod;

  const startMins = parseTimeToMinutes(startStr, startPeriod);
  const endMins = parseTimeToMinutes(endStr, endPeriod);

  if (startMins === null || endMins === null) return null;

  return { startMins, endMins };
}

/**
 * Determines whether a mosque facility is currently open based ONLY on canonical opening hours.
 * 
 * Strict architectural rule:
 * - Uses America/Toronto timezone (or provided timezone), NOT server UTC.
 * - Does NOT infer open/closed from prayer times.
 * - If schedule is missing or day cannot be reliably parsed, returns isOpen: null ("Hours unavailable").
 */
export function getFacilityOpenStatus(
  schedule: OpeningHoursSchedule | null | undefined,
  timezone: string = "America/Toronto",
  nowDate: Date = new Date()
): OpenStatusResult {
  if (!schedule || !Array.isArray(schedule.days) || schedule.days.length === 0) {
    return {
      isOpen: null,
      statusText: "Hours unavailable",
      reason: "No opening hours schedule recorded",
    };
  }

  // Get current day of week and current time in target timezone
  let currentDayName: string;
  let currentHour: number;
  let currentMin: number;

  try {
    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    currentDayName = dayFormatter.format(nowDate);
    const parts = timeFormatter.format(nowDate).split(":");
    currentHour = parseInt(parts[0], 10);
    currentMin = parseInt(parts[1], 10);
  } catch {
    return {
      isOpen: null,
      statusText: "Hours unavailable",
      reason: "Timezone resolution failed",
    };
  }

  const currentMinutesNow = currentHour * 60 + currentMin;

  const todayData = schedule.days.find(
    (d) => d.day.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!todayData) {
    return {
      isOpen: null,
      statusText: "Hours unavailable",
      reason: `No schedule for ${currentDayName}`,
    };
  }

  // Check explicit closed
  if (todayData.isClosed || todayData.rawText.toLowerCase() === "closed") {
    return {
      isOpen: false,
      statusText: "Closed today",
      todayScheduleText: "Closed",
    };
  }

  // Check explicit 24 hours
  if (
    todayData.isOpen24Hours ||
    todayData.rawText.toLowerCase().includes("open 24 hours") ||
    todayData.rawText.toLowerCase().includes("24 hours")
  ) {
    return {
      isOpen: true,
      statusText: "Open 24 hours",
      is24Hours: true,
      todayScheduleText: "Open 24 hours",
    };
  }

  // Parse today's range(s) from rawText or periods
  const ranges: Array<{ startMins: number; endMins: number }> = [];

  // Try parsing from structured periods first if present
  if (Array.isArray(todayData.periods) && todayData.periods.length > 0) {
    for (const p of todayData.periods) {
      if (p.openTime === "00:00" && p.closeTime === "24:00") {
        return {
          isOpen: true,
          statusText: "Open 24 hours",
          is24Hours: true,
          todayScheduleText: "Open 24 hours",
        };
      }
      const s = parseTimeToMinutes(p.openTime);
      const e = parseTimeToMinutes(p.closeTime);
      if (s !== null && e !== null) {
        ranges.push({ startMins: s, endMins: e });
      }
    }
  }

  // If no structured periods, parse rawText chunks
  if (ranges.length === 0 && todayData.rawText) {
    const chunks = todayData.rawText.split(",").map((c) => c.trim());
    for (const chunk of chunks) {
      const parsed = parseRangeSegment(chunk);
      if (parsed) {
        ranges.push(parsed);
      }
    }
  }

  if (ranges.length === 0) {
    // Cannot reliably parse the hours, return unavailable rather than a wrong state
    return {
      isOpen: null,
      statusText: todayData.rawText || "Hours unavailable",
      todayScheduleText: todayData.rawText,
      reason: "Could not parse specific time ranges",
    };
  }

  // Check if current time falls into any open range
  for (const range of ranges) {
    if (range.startMins <= range.endMins) {
      // Normal daytime span
      if (currentMinutesNow >= range.startMins && currentMinutesNow < range.endMins) {
        return {
          isOpen: true,
          statusText: "Open now",
          todayScheduleText: todayData.rawText,
        };
      }
    } else {
      // Overnight span (e.g. 6 PM to 2 AM)
      if (currentMinutesNow >= range.startMins || currentMinutesNow < range.endMins) {
        return {
          isOpen: true,
          statusText: "Open now",
          todayScheduleText: todayData.rawText,
        };
      }
    }
  }

  return {
    isOpen: false,
    statusText: "Closed now",
    todayScheduleText: todayData.rawText,
  };
}
