import {
  CalculationParameters,
  Coordinates,
  HighLatitudeRule as AdhanHighLatitudeRule,
  Madhab as AdhanMadhab,
  PolarCircleResolution,
  PrayerTimes,
  Rounding,
} from "adhan";
import { IPrayerTimeEngine } from "./engine-contract";
import {
  AsrMethod,
  CalculatedPrayerSchedule,
  CalculationMetadata,
  CalculationMethod,
  DEFAULT_CANADIAN_PRAYER_CONFIG,
  FormattedPrayerTimes,
  HighLatitudeAdjustmentMetadata,
  HighLatitudeRule,
  PrayerCalculationRequest,
  StructuredPrayerTimes,
} from "./types";

/**
 * Validates timezone identifier with ECMAScript Intl API.
 */
function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates geographic coordinates.
 */
function validateCoordinates(latitude: number, longitude: number): void {
  if (
    typeof latitude !== "number" ||
    isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error(
      `Invalid latitude "${latitude}". Must be a valid number between -90 and 90.`
    );
  }
  if (
    typeof longitude !== "number" ||
    isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      `Invalid longitude "${longitude}". Must be a valid number between -180 and 180.`
    );
  }
}

/**
 * Converts ISO date string ("YYYY-MM-DD") or Date object to a normalized UTC midday anchor Date
 * to eliminate local host machine timezone drift.
 */
function parseAndAnchorDate(inputDate: string | Date): {
  year: number;
  month: number; // 1-indexed
  day: number;
  dateKey: string;
  calculationDate: Date;
} {
  let year: number;
  let month: number;
  let day: number;

  if (typeof inputDate === "string") {
    const parts = inputDate.trim().split("-");
    if (parts.length !== 3) {
      throw new Error(
        `Invalid date format "${inputDate}". Expected "YYYY-MM-DD".`
      );
    }
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else if (inputDate instanceof Date && !isNaN(inputDate.getTime())) {
    year = inputDate.getFullYear();
    month = inputDate.getMonth() + 1;
    day = inputDate.getDate();
  } else {
    throw new Error(`Invalid date input "${inputDate}".`);
  }

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(
      `Invalid calendar date values: year=${year}, month=${month}, day=${day}.`
    );
  }

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const dateKey = `${year}-${mm}-${dd}`;

  // Anchor at UTC midday (12:00:00Z) to avoid day-boundary crossover during solar time calculation
  const calculationDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return { year, month, day, dateKey, calculationDate };
}

/**
 * Builds adhan CalculationParameters based on strongly typed domain settings.
 */
function buildCalculationParameters(
  method: CalculationMethod,
  asrMethod: AsrMethod,
  highLatRule: HighLatitudeRule,
  customAngles?: PrayerCalculationRequest["customAngles"]
): {
  params: CalculationParameters;
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes: number;
} {
  let fajrAngle: number;
  let ishaAngle = 0;
  let ishaInterval = 0;
  let maghribAngle = 0;
  let adhanMethodName:
    | "NorthAmerica"
    | "MuslimWorldLeague"
    | "Egyptian"
    | "UmmAlQura"
    | "Karachi"
    | "Other";

  switch (method) {
    case "ISNA":
      // Islamic Society of North America (Standard in Canada)
      adhanMethodName = "NorthAmerica";
      fajrAngle = 15;
      ishaAngle = 15;
      break;

    case "MWL":
      // Muslim World League
      adhanMethodName = "MuslimWorldLeague";
      fajrAngle = 18;
      ishaAngle = 17;
      break;

    case "EGYPTIAN":
      // Egyptian General Authority of Survey
      adhanMethodName = "Egyptian";
      fajrAngle = 19.5;
      ishaAngle = 17.5;
      break;

    case "MAKKAH":
      // Umm Al-Qura University, Makkah
      adhanMethodName = "UmmAlQura";
      fajrAngle = 18.5;
      ishaAngle = 0;
      ishaInterval = 90; // 90 minutes after Maghrib
      break;

    case "KARACHI":
      // University of Islamic Sciences, Karachi
      adhanMethodName = "Karachi";
      fajrAngle = 18;
      ishaAngle = 18;
      break;

    case "CUSTOM":
      if (!customAngles || typeof customAngles.fajrAngle !== "number") {
        throw new Error(
          "Custom calculation method requires customAngles.fajrAngle to be defined."
        );
      }
      fajrAngle = customAngles.fajrAngle;
      ishaAngle = customAngles.ishaAngle ?? 0;
      ishaInterval = customAngles.ishaIntervalMinutes ?? 0;
      maghribAngle = customAngles.maghribAngle ?? 0;
      adhanMethodName = "Other";
      break;

    default: {
      const _exhaustiveCheck: never = method;
      throw new Error(`Unsupported calculation method "${_exhaustiveCheck}".`);
    }
  }

  const params = new CalculationParameters(
    adhanMethodName,
    fajrAngle,
    ishaAngle,
    ishaInterval,
    maghribAngle
  );

  // Juristic method for Asr
  params.madhab =
    asrMethod === "HANAFI" ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;

  // High latitude rule
  switch (highLatRule) {
    case "ANGLE_BASED":
      params.highLatitudeRule = AdhanHighLatitudeRule.TwilightAngle;
      break;
    case "ONE_SEVENTH":
      params.highLatitudeRule = AdhanHighLatitudeRule.SeventhOfTheNight;
      break;
    case "MIDDLE_OF_NIGHT":
      params.highLatitudeRule = AdhanHighLatitudeRule.MiddleOfTheNight;
      break;
    default: {
      const _exhaustiveCheck: never = highLatRule;
      throw new Error(`Unsupported high latitude rule "${_exhaustiveCheck}".`);
    }
  }

  // Use nearest minute rounding for standard public schedules
  params.rounding = Rounding.Nearest;

  // Resolve polar circle issues gracefully using nearest latitude approximation (AqrabBalad)
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;

  return {
    params,
    fajrAngle,
    ishaAngle,
    ishaIntervalMinutes: ishaInterval,
  };
}

/**
 * Evaluates whether astronomical twilight crossing was physically impossible
 * or whether a high-latitude approximation rule clamped the times.
 */
function evaluateHighLatitudeAdjustment(
  coords: Coordinates,
  date: Date,
  baseParams: CalculationParameters,
  rule: HighLatitudeRule,
  fajrAngle: number,
  ishaAngle: number,
  ishaIntervalMinutes: number
): HighLatitudeAdjustmentMetadata {
  // Approximate solar declination to determine if the sun dips deep enough
  // Cooper formula: declination = 23.45 * sin(360/365 * (doy - 81))
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear =
    Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const declination =
    23.45 *
    Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  // Maximum solar depression at midnight for this latitude
  const maxDepressionDegrees = 90 - coords.latitude - declination;

  const astronomicalFajrImpossible =
    coords.latitude > 45 && fajrAngle > maxDepressionDegrees;
  const astronomicalIshaImpossible =
    ishaIntervalMinutes === 0 &&
    coords.latitude > 45 &&
    ishaAngle > maxDepressionDegrees;

  // Next, detect if the chosen rule actually clamped Fajr or Isha
  // Compare calculated times between MiddleOfTheNight (1/2) and SeventhOfTheNight (1/7)
  const pMid = new CalculationParameters(
    baseParams.method,
    fajrAngle,
    ishaAngle,
    ishaIntervalMinutes
  );
  pMid.highLatitudeRule = AdhanHighLatitudeRule.MiddleOfTheNight;
  pMid.madhab = baseParams.madhab;
  pMid.rounding = Rounding.None;
  pMid.polarCircleResolution = PolarCircleResolution.AqrabBalad;

  const pSev = new CalculationParameters(
    baseParams.method,
    fajrAngle,
    ishaAngle,
    ishaIntervalMinutes
  );
  pSev.highLatitudeRule = AdhanHighLatitudeRule.SeventhOfTheNight;
  pSev.madhab = baseParams.madhab;
  pSev.rounding = Rounding.None;
  pSev.polarCircleResolution = PolarCircleResolution.AqrabBalad;

  const ptMid = new PrayerTimes(coords, date, pMid);
  const ptSev = new PrayerTimes(coords, date, pSev);

  const fajrDiffSeconds =
    Math.abs(ptMid.fajr.getTime() - ptSev.fajr.getTime()) / 1000;
  const ishaDiffSeconds =
    Math.abs(ptMid.isha.getTime() - ptSev.isha.getTime()) / 1000;

  // A rule variance indicates that one or both prayer times were clamped by high latitude constraints
  const fajrAdjusted = astronomicalFajrImpossible || fajrDiffSeconds > 60;
  const ishaAdjusted = astronomicalIshaImpossible || ishaDiffSeconds > 60;

  return {
    applied: fajrAdjusted || ishaAdjusted,
    rule,
    fajrAdjusted,
    ishaAdjusted,
    astronomicalFajrImpossible,
    astronomicalIshaImpossible,
  };
}

/**
 * Ensures that all resulting dates are valid, finite Date instances.
 */
function assertValidTimes(times: StructuredPrayerTimes): void {
  for (const [key, value] of Object.entries(times)) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error(
        `Prayer calculation produced an invalid Date for prayer "${key}".`
      );
    }
  }
}

/**
 * Production Prayer Time Engine Implementation.
 */
export class PrayerTimeEngine implements IPrayerTimeEngine {
  public calculatePrayerTimes(
    request: PrayerCalculationRequest
  ): CalculatedPrayerSchedule {
    validateCoordinates(request.latitude, request.longitude);

    if (!isValidTimeZone(request.timezone)) {
      throw new Error(
        `Invalid or unsupported IANA timezone identifier: "${request.timezone}".`
      );
    }

    const { dateKey, calculationDate } = parseAndAnchorDate(request.date);

    const calculationMethod =
      request.calculationMethod ?? DEFAULT_CANADIAN_PRAYER_CONFIG.calculationMethod;
    const asrMethod =
      request.asrMethod ?? DEFAULT_CANADIAN_PRAYER_CONFIG.asrMethod;
    const highLatitudeRule =
      request.highLatitudeRule ??
      DEFAULT_CANADIAN_PRAYER_CONFIG.highLatitudeRule;

    const { params, fajrAngle, ishaAngle, ishaIntervalMinutes } =
      buildCalculationParameters(
        calculationMethod,
        asrMethod,
        highLatitudeRule,
        request.customAngles
      );

    const coordinates = new Coordinates(request.latitude, request.longitude);
    const adhanSchedule = new PrayerTimes(coordinates, calculationDate, params);

    const times: StructuredPrayerTimes = {
      fajr: adhanSchedule.fajr,
      sunrise: adhanSchedule.sunrise,
      dhuhr: adhanSchedule.dhuhr,
      asr: adhanSchedule.asr,
      maghrib: adhanSchedule.maghrib,
      isha: adhanSchedule.isha,
    };

    assertValidTimes(times);

    const highLatAdj = evaluateHighLatitudeAdjustment(
      coordinates,
      calculationDate,
      params,
      highLatitudeRule,
      fajrAngle,
      ishaAngle,
      ishaIntervalMinutes
    );

    const warnings: string[] = [];
    if (highLatAdj.applied) {
      if (highLatAdj.astronomicalFajrImpossible) {
        warnings.push(
          `Astronomical twilight did not dip to ${fajrAngle}° for Fajr on this date. High latitude rule "${highLatitudeRule}" was applied.`
        );
      } else if (highLatAdj.fajrAdjusted) {
        warnings.push(
          `Fajr time was adjusted by high latitude rule "${highLatitudeRule}" to prevent hardship.`
        );
      }

      if (highLatAdj.astronomicalIshaImpossible) {
        warnings.push(
          `Astronomical twilight did not dip to ${ishaAngle}° for Isha on this date. High latitude rule "${highLatitudeRule}" was applied.`
        );
      } else if (highLatAdj.ishaAdjusted) {
        warnings.push(
          `Isha time was adjusted by high latitude rule "${highLatitudeRule}" to prevent hardship.`
        );
      }
    }

    const metadata: CalculationMetadata = {
      calculationMethod,
      fajrAngle,
      ishaAngle,
      ishaIntervalMinutes,
      asrMethod,
      highLatitudeRule,
      timezone: request.timezone,
      date: dateKey,
      coordinates: {
        latitude: request.latitude,
        longitude: request.longitude,
      },
      highLatitudeAdjustment: highLatAdj,
      warnings,
    };

    return {
      date: dateKey,
      timezone: request.timezone,
      coordinates: {
        latitude: request.latitude,
        longitude: request.longitude,
      },
      settings: {
        calculationMethod,
        asrMethod,
        highLatitudeRule,
        fajrAngle,
        ishaAngle,
        ishaIntervalMinutes,
      },
      times,
      metadata,
    };
  }

  public calculateMonthlySchedule(
    year: number,
    month: number,
    request: Omit<PrayerCalculationRequest, "date">
  ): CalculatedPrayerSchedule[] {
    if (isNaN(year) || year < 1900 || year > 2200) {
      throw new Error(`Invalid year "${year}". Must be between 1900 and 2200.`);
    }
    if (isNaN(month) || month < 1 || month > 12) {
      throw new Error(`Invalid month "${month}". Must be between 1 and 12.`);
    }

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const schedules: CalculatedPrayerSchedule[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      const dateString = `${year}-${mm}-${dd}`;

      schedules.push(
        this.calculatePrayerTimes({
          ...request,
          date: dateString,
        })
      );
    }

    return schedules;
  }

  public formatSchedule(
    schedule: CalculatedPrayerSchedule,
    format12Hour = false
  ): FormattedPrayerTimes {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: schedule.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: format12Hour,
    });

    return {
      date: schedule.date,
      timezone: schedule.timezone,
      fajr: formatter.format(schedule.times.fajr),
      sunrise: formatter.format(schedule.times.sunrise),
      dhuhr: formatter.format(schedule.times.dhuhr),
      asr: formatter.format(schedule.times.asr),
      maghrib: formatter.format(schedule.times.maghrib),
      isha: formatter.format(schedule.times.isha),
    };
  }
}

/**
 * Singleton engine instance for application services.
 */
export const defaultPrayerTimeEngine = new PrayerTimeEngine();
