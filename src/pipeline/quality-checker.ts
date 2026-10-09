import { RawGooglePlaceRecord } from "@/domain/ingestion/raw-record";
import { isWithinCanadaBounds } from "@/domain/geo/coordinates";
import { QualityFlag, PipelineClassification } from "./types";

/**
 * Checks whether coordinates lie within the Greater Toronto Area pilot region.
 * Approx: Lat 43.40° to 44.20°, Lng -80.10° to -78.80°
 */
export function isWithinTorontoPilotArea(lat: number, lng: number): boolean {
  return lat >= 43.4 && lat <= 44.2 && lng >= -80.1 && lng <= -78.8;
}

export function evaluateQualityFlags(
  raw: RawGooglePlaceRecord,
  classification: PipelineClassification,
  cityConfig?: {
    city: string;
    province: string;
    geoBounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  }
): QualityFlag[] {
  const flags: QualityFlag[] = [];
  const title = (raw.title || "").trim();
  const lowerTitle = title.toLowerCase();

  // 1. Missing fields
  if (!raw.phone || !raw.phone.trim()) {
    flags.push("MISSING_PHONE");
  }
  if (!raw.website || !raw.website.trim()) {
    flags.push("MISSING_WEBSITE");
  }
  if (!raw.openingHours || !Array.isArray(raw.openingHours) || raw.openingHours.length === 0) {
    flags.push("MISSING_HOURS");
  }
  if (!raw.description || !raw.description.trim()) {
    flags.push("MISSING_DESCRIPTION");
  }

  // 2. Coordinates checks
  if (
    !raw.location ||
    typeof raw.location.lat !== "number" ||
    Number.isNaN(raw.location.lat) ||
    typeof raw.location.lng !== "number" ||
    Number.isNaN(raw.location.lng)
  ) {
    flags.push("INVALID_COORDINATES");
  } else {
    const coords = { latitude: raw.location.lat, longitude: raw.location.lng };
    if (!isWithinCanadaBounds(coords)) {
      flags.push("OUTSIDE_CANADA");
    }

    const isToronto = !cityConfig || cityConfig.city.toLowerCase() === "toronto";
    if (isToronto) {
      if (!isWithinTorontoPilotArea(coords.latitude, coords.longitude)) {
        flags.push("OUTSIDE_TORONTO_PILOT_AREA");
      }
    } else if (cityConfig?.geoBounds) {
      const b = cityConfig.geoBounds;
      if (
        coords.latitude < b.minLat ||
        coords.latitude > b.maxLat ||
        coords.longitude < b.minLng ||
        coords.longitude > b.maxLng
      ) {
        flags.push("OUTSIDE_CITY_BOUNDS");
      }
    }
  }

  // 2b. Province validation (if non-empty state provided)
  if (cityConfig && raw.state && typeof raw.state === "string") {
    const stateClean = raw.state.trim().toLowerCase();
    const expectedProv = cityConfig.province.toLowerCase();
    const PROV_ALIASES: Record<string, string[]> = {
      on: ["ontario", "on"],
      qc: ["quebec", "québec", "qc"],
      ab: ["alberta", "ab"],
      bc: ["british columbia", "bc"],
      mb: ["manitoba", "mb"],
    };
    const validAliases = PROV_ALIASES[expectedProv] || [expectedProv];
    if (stateClean && !validAliases.some((a) => stateClean.includes(a))) {
      flags.push("PROVINCE_MISMATCH");
    }
  }

  // 3. Generic Name
  const genericNames = ["masjid", "mosque", "muslim prayer room", "prayer room", "musalla", "musallah"];
  if (genericNames.includes(lowerTitle)) {
    flags.push("GENERIC_NAME");
  }

  // 4. Review text inspection for closure, relocation, or identity disputes
  const reviews = Array.isArray(raw.reviews) ? raw.reviews : [];
  let mentionsClosed = false;
  let mentionsMoved = false;
  let mentionsNotMosque = false;

  for (const rev of reviews) {
    if (rev && typeof rev === "object") {
      const text = ((rev as Record<string, unknown>).text as string || "").toLowerCase();
      if (
        text.includes("closed permanently") ||
        text.includes("no longer exists") ||
        text.includes("is closed most of time") ||
        text.includes("this is not a mosque anymore") ||
        text.includes("locked which is")
      ) {
        mentionsClosed = true;
      }
      if (text.includes("moved to") || text.includes("relocated")) {
        mentionsMoved = true;
      }
      if (
        text.includes("not a mosque") ||
        text.includes("it's a church") ||
        text.includes("is a church") ||
        text.includes("is ontario ahmadiya")
      ) {
        mentionsNotMosque = true;
      }
    }
  }

  if (mentionsClosed) flags.push("POSSIBLE_CLOSED_LOCATION");
  if (mentionsMoved) flags.push("POSSIBLE_MOVED_LOCATION");
  if (mentionsNotMosque) flags.push("POSSIBLE_NOT_A_MOSQUE");

  // 5. Contradictory information
  const categories = (raw.categories || []).map((c) => c.toLowerCase());
  if (
    (categories.includes("synagogue") && lowerTitle.includes("masjid")) ||
    (categories.includes("medical center") && lowerTitle.includes("mosque"))
  ) {
    flags.push("CONTRADICTORY_INFORMATION");
  }

  // 6. Organization without confirmed prayer location
  if (classification === "ORGANIZATION") {
    flags.push("ORGANIZATION_WITHOUT_PRAYER_LOCATION");
  }

  // 7. Prayer location without full mosque evidence
  if (classification === "PRAYER_ROOM" || classification === "MUSALLA") {
    flags.push("PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE");
  }

  return flags;
}
