/**
 * Multi-City Canadian Prayer Times Application Service
 *
 * Integration layer sitting between Next.js pages and the PrayerTimeEngine.
 * Supports all 9 Canadian metropolitan cities:
 * Toronto, Ottawa, Mississauga, Brampton, Vancouver, Calgary, Edmonton, Montreal, Winnipeg.
 *
 * Rules:
 * - Does NOT use opening hours as prayer times.
 * - Does NOT return mosque Iqamah times.
 * - Does NOT invent or hard-code prayer times.
 * - Every result is clearly labelled as "calculated" (astronomical).
 */

import { defaultPrayerTimeEngine } from "@/domain/prayer/engine";
import { getCityConfigBySlug, CANADIAN_CITIES, DomainCityConfig } from "@/domain/city/city-config";
import type {
  CalculatedPrayerSchedule,
  FormattedPrayerTimes,
} from "@/domain/prayer/types";

export function getTodayCityPrayerTimes(citySlug: string): CalculatedPrayerSchedule {
  const city = getCityConfigBySlug(citySlug) || CANADIAN_CITIES.toronto;

  const todayDateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: city.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-");

  const normalizedDate = normalizeDateString(todayDateKey);

  return defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: city.representativeCoordinates.latitude,
    longitude: city.representativeCoordinates.longitude,
    date: normalizedDate,
    timezone: city.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

export function getCityPrayerTimes(
  citySlug: string,
  dateString: string
): CalculatedPrayerSchedule {
  const city = getCityConfigBySlug(citySlug) || CANADIAN_CITIES.toronto;

  return defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: city.representativeCoordinates.latitude,
    longitude: city.representativeCoordinates.longitude,
    date: dateString,
    timezone: city.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

export function getFormattedTodayCityPrayerTimes(citySlug: string): {
  city: DomainCityConfig;
  schedule: CalculatedPrayerSchedule;
  formatted: FormattedPrayerTimes;
} {
  const city = getCityConfigBySlug(citySlug) || CANADIAN_CITIES.toronto;
  const schedule = getTodayCityPrayerTimes(citySlug);
  const formatted = defaultPrayerTimeEngine.formatSchedule(schedule, false);
  return { city, schedule, formatted };
}

export function getCityMonthlySchedule(
  citySlug: string,
  year: number,
  month: number
): CalculatedPrayerSchedule[] {
  const city = getCityConfigBySlug(citySlug) || CANADIAN_CITIES.toronto;

  return defaultPrayerTimeEngine.calculateMonthlySchedule(year, month, {
    latitude: city.representativeCoordinates.latitude,
    longitude: city.representativeCoordinates.longitude,
    timezone: city.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });
}

function normalizeDateString(input: string): string {
  const clean = input.trim();
  if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(clean)) {
    return clean.replace(/\//g, "-");
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [m, d, y] = clean.split("/");
    return `${y}-${m}-${d}`;
  }
  return clean;
}
