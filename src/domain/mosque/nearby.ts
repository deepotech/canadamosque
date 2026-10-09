import { Mosque } from "./types";
import { MosqueDistanceResult } from "./repository";
import { calculateHaversineDistanceKm } from "../geo/distance";
import { isValidCoordinates } from "../geo/coordinates";

export type NearbyMosqueResult = MosqueDistanceResult;

export interface NearbyMosquesOptions {
  limit?: number;
}

/**
 * Finds the nearest published canonical mosques to a given target mosque.
 *
 * Requirements:
 * 1. Uses existing latitude/longitude data.
 * 2. Calculates distance using existing Haversine utility.
 * 3. Excludes the current target mosque (by ID and slug).
 * 4. Only considers published/canonical active records.
 * 5. Strictly excludes REVIEW_REQUIRED and EXCLUDE records.
 * 6. Sorts ascending by actual geographic distance.
 * 7. Returns 4–6 nearest mosques (default: 6).
 * 8. Returns available results if fewer than 4 exist.
 * 9. Returns empty array if no nearby mosques exist.
 */
export function getNearbyPublishedMosques(
  targetMosque: Mosque,
  candidateMosques: Mosque[],
  options: NearbyMosquesOptions | number = 6
): NearbyMosqueResult[] {
  const limit = typeof options === "number" ? options : options.limit ?? 6;

  if (
    !targetMosque ||
    !targetMosque.coordinates ||
    !isValidCoordinates(targetMosque.coordinates) ||
    !Array.isArray(candidateMosques) ||
    candidateMosques.length === 0
  ) {
    return [];
  }

  const validCandidates = candidateMosques.filter((candidate) => {
    // 3. Exclude the current mosque
    if (candidate.id === targetMosque.id || candidate.slug === targetMosque.slug) {
      return false;
    }

    // 4. Only consider published/active records
    if (candidate.status !== "ACTIVE") {
      return false;
    }

    // 5. Never include review-required or excluded records
    if (
      candidate.classification === "REVIEW_REQUIRED" ||
      candidate.classification === "EXCLUDE"
    ) {
      return false;
    }

    // Validate coordinates
    if (!candidate.coordinates || !isValidCoordinates(candidate.coordinates)) {
      return false;
    }

    return true;
  });

  const withDistances: NearbyMosqueResult[] = validCandidates.map((candidate) => ({
    mosque: candidate,
    distanceKm: calculateHaversineDistanceKm(
      targetMosque.coordinates,
      candidate.coordinates
    ),
  }));

  // 6. Sort ascending by actual geographic distance, with deterministic name tie-breaker
  withDistances.sort((a, b) => {
    if (a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }
    return a.mosque.name.localeCompare(b.mosque.name);
  });

  // 7, 15, 16: Return up to limit (if < 4 exist, returns all available; if 0, returns [])
  return withDistances.slice(0, Math.max(0, limit));
}
