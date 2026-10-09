import { RawGooglePlaceRecord } from "@/domain/ingestion/raw-record";
import {
  NormalizedAddress,
  NormalizedPhone,
  NormalizedPostalCode,
} from "./types";
import {
  DayOpeningHours,
  DayOfWeek,
  OpeningHoursPeriod,
  OpeningHoursSchedule,
} from "@/domain/opening-hours/types";
import { CanadianProvince, MosqueFacilities } from "@/domain/mosque/types";

/**
 * Normalizes text by trimming whitespace, normalizing repeated spaces,
 * and normalizing unicode quotes.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates a clean, deterministic, SEO-friendly URL slug.
 */
export function generateSlug(name: string, disambiguator?: string): string {
  const base = normalizeText(name)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (disambiguator) {
    const dis = disambiguator
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (dis && !base.endsWith(dis)) {
      return `${base}-${dis}`;
    }
  }

  return base || "mosque";
}

const KNOWN_GTA_MUNICIPALITIES: string[] = [
  "Toronto",
  "Scarborough",
  "North York",
  "Etobicoke",
  "East York",
  "York",
  "Mississauga",
  "Brampton",
  "Markham",
  "Vaughan",
  "Richmond Hill",
  "Oakville",
  "Pickering",
  "Ajax",
  "Whitby",
  "Oshawa",
  "Milton",
  "Burlington",
  "Newmarket",
  "Aurora",
];

/**
 * Extracts and normalizes Canadian postal code from an address string.
 */
export function extractAndNormalizePostalCode(address: string): NormalizedPostalCode {
  // Canadian postal code format: A1A 1A1
  const fullMatch = address.match(/\b([A-CEGHJ-NPR-TVXY]\d[A-CEGHJ-NPR-TV-Z])\s*(\d[A-CEGHJ-NPR-TV-Z]\d)\b/i);
  if (fullMatch) {
    const raw = `${fullMatch[1]} ${fullMatch[2]}`;
    const normalized = `${fullMatch[1].toUpperCase()} ${fullMatch[2].toUpperCase()}`;
    return { raw, normalized };
  }

  // Check for partial FSA (e.g., M3C)
  const partialMatch = address.match(/\b([A-CEGHJ-NPR-TVXY]\d[A-CEGHJ-NPR-TV-Z])\b/i);
  if (partialMatch) {
    return {
      raw: partialMatch[1].toUpperCase(),
      normalized: null, // Partial postal codes are not valid complete postal codes
    };
  }

  return { raw: null, normalized: null };
}

/**
 * Normalizes phone numbers to raw and E.164 Canadian format (+1XXXXXXXXXX).
 */
export function normalizePhone(rawPhone?: string | null): NormalizedPhone | null {
  if (!rawPhone || typeof rawPhone !== "string") return null;
  const trimmed = rawPhone.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");
  let normalized: string | null = null;

  if (digits.length === 10) {
    normalized = `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    normalized = `+${digits}`;
  }

  return {
    raw: trimmed,
    normalized,
  };
}

/**
 * Normalizes and validates URLs.
 */
export function normalizeWebsite(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Parses raw Google address into structured components.
 */
export function normalizeAddress(
  rawAddress: string,
  rawCity?: string | null,
  cityConfig?: {
    city: string;
    province: CanadianProvince;
    knownMunicipalities?: string[];
  }
): NormalizedAddress {
  const cleanAddress = normalizeText(rawAddress);
  const postalCode = extractAndNormalizePostalCode(cleanAddress);

  // Address parts split by commas
  const segments = cleanAddress.split(",").map((s) => s.trim());

  let city = rawCity ? normalizeText(rawCity) : "";
  let streetAddress: string | null = null;
  const province: CanadianProvince = cityConfig ? cityConfig.province : "ON";
  const knownList = cityConfig?.knownMunicipalities || KNOWN_GTA_MUNICIPALITIES;
  const defaultCity = cityConfig?.city || "Toronto";

  // Detect municipality from known cities
  for (const municipality of knownList) {
    const regex = new RegExp(`\\b${municipality}\\b`, "i");
    if (regex.test(cleanAddress)) {
      city = municipality;
      break;
    }
  }

  if (!city && segments.length >= 3) {
    // Standard Google address format: Street, City, Prov Postal, Canada
    city = segments[segments.length - 3] || defaultCity;
  }

  if (!city) {
    city = defaultCity;
  }

  // Determine street address
  if (segments.length >= 1) {
    const firstSegment = segments[0];
    // If the first segment is not just the city name and not just Canada/province code
    if (
      !knownList.some((m) => m.toLowerCase() === firstSegment.toLowerCase()) &&
      !firstSegment.startsWith(`${province} `) &&
      !firstSegment.startsWith("ON ")
    ) {
      streetAddress = firstSegment;
    }
  }

  return {
    raw: cleanAddress,
    streetAddress,
    city,
    province,
    postalCode,
    country: "CA",
  };
}

/**
 * Parses raw opening hours strings into 24-hour periods.
 */
function parseOpeningHoursPeriod(hoursText: string): OpeningHoursPeriod[] {
  const match = hoursText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[–-]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if (!match) return [];

  const open24 = convertTo24Hour(match[1]);
  const close24 = convertTo24Hour(match[2]);

  if (open24 && close24) {
    return [{ openTime: open24, closeTime: close24 }];
  }
  return [];
}

function convertTo24Hour(timeStr: string): string | null {
  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const min = m[2];
  const ampm = m[3].toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${min}`;
}

/**
 * Normalizes raw opening hours array into OpeningHoursSchedule.
 */
export function normalizeOpeningHours(
  rawHours?: Array<{ day: string; hours: string }> | null
): OpeningHoursSchedule | null {
  if (!rawHours || !Array.isArray(rawHours) || rawHours.length === 0) {
    return null;
  }

  const validDays: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const days: DayOpeningHours[] = [];

  for (const item of rawHours) {
    const day = validDays.find(
      (d) => d.toLowerCase() === (item.day || "").trim().toLowerCase()
    );
    if (!day) continue;

    const rawText = normalizeText(item.hours || "");
    const isClosed = /closed/i.test(rawText);
    const isOpen24Hours = /open 24 hours/i.test(rawText);
    const periods = isOpen24Hours
      ? [{ openTime: "00:00", closeTime: "24:00" }]
      : isClosed
      ? []
      : parseOpeningHoursPeriod(rawText);

    days.push({
      day,
      isClosed,
      isOpen24Hours,
      rawText,
      periods,
    });
  }

  if (days.length === 0) return null;

  return { days, notes: null };
}

/**
 * Safely extracts facilities from raw Google Places additionalInfo and categories.
 * Strict zero-fabrication: fields remain null if not explicitly documented.
 */
export function extractFacilities(raw: RawGooglePlaceRecord): MosqueFacilities {
  let wheelchairAccessible: boolean | null = null;
  let parkingAvailable: boolean | null = null;
  const wuduArea: boolean | null = null;
  const womenPrayerSection: boolean | null = null;
  const dailyPrayersHeld: boolean | null = null;

  if (raw.additionalInfo && typeof raw.additionalInfo === "object") {
    const info = raw.additionalInfo;

    // Check Accessibility
    if (Array.isArray(info["Accessibility"])) {
      for (const item of info["Accessibility"]) {
        if (typeof item === "object" && item !== null) {
          const keys = Object.keys(item);
          if (keys.some((k) => /wheelchair accessible/i.test(k))) {
            wheelchairAccessible = true;
            break;
          }
        }
      }
    }

    // Check Parking
    if (Array.isArray(info["Parking"])) {
      for (const item of info["Parking"]) {
        if (typeof item === "object" && item !== null) {
          const keys = Object.keys(item);
          if (keys.some((k) => /parking/i.test(k))) {
            parkingAvailable = true;
            break;
          }
        }
      }
    }
  }

  return {
    wuduArea,
    womenPrayerSection,
    parkingAvailable,
    wheelchairAccessible,
    dailyPrayersHeld,
    notes: null,
  };
}
