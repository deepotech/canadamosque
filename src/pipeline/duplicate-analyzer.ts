import { calculateHaversineDistanceKm } from "@/domain/geo/distance";
import { DuplicateRelation, ProcessedMosqueRecord, QualityFlag } from "./types";

/**
 * Calculates token similarity between two strings (Jaccard index of 3-char n-grams or words).
 */
export function calculateNameSimilarity(nameA: string, nameB: string): number {
  const cleanA = nameA.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const cleanB = nameB.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  if (cleanA === cleanB) return 1.0;

  const wordsA = new Set(cleanA.split(/\s+/).filter(Boolean));
  const wordsB = new Set(cleanB.split(/\s+/).filter(Boolean));

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  if (union === 0) return 0;
  return intersection / union;
}

/**
 * Checks for typos or near-identical short names (Levenshtein distance).
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Analyzes duplicates and shared locations across the entire processed record collection.
 * Modifies duplicateRelations and qualityFlags deterministically.
 */
export function analyzeDuplicatesAndSharedLocations(
  records: ProcessedMosqueRecord[]
): void {
  for (let i = 0; i < records.length; i++) {
    const recA = records[i];

    for (let j = i + 1; j < records.length; j++) {
      const recB = records[j];

      const distanceKm = calculateHaversineDistanceKm(
        recA.coordinates,
        recB.coordinates
      );
      const isSameCoords = distanceKm < 0.03; // within ~30 meters

      const cleanAddrA = recA.address.raw.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanAddrB = recB.address.raw.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isSameAddress =
        cleanAddrA === cleanAddrB ||
        (recA.address.streetAddress &&
          recB.address.streetAddress &&
          recA.address.streetAddress.toLowerCase() ===
            recB.address.streetAddress.toLowerCase());

      const samePlaceId =
        recA.provenance.placeId &&
        recB.provenance.placeId &&
        recA.provenance.placeId === recB.provenance.placeId;

      const samePhone =
        recA.phone?.normalized &&
        recB.phone?.normalized &&
        recA.phone.normalized === recB.phone.normalized;

      const nameSim = calculateNameSimilarity(recA.name, recB.name);
      const lev = levenshteinDistance(
        recA.name.toLowerCase(),
        recB.name.toLowerCase()
      );

      const GENERIC_TOKENS = new Set([
        "masjid",
        "mosque",
        "mosquee",
        "islamic",
        "islamique",
        "centre",
        "center",
        "association",
        "the",
        "inc",
        "of",
        "and",
        "musalla",
        "community",
        "toronto",
        "ottawa",
        "mississauga",
        "brampton",
        "vancouver",
        "calgary",
        "edmonton",
        "montreal",
        "winnipeg",
        "de",
        "du",
        "la",
        "le",
        "des",
      ]);
      const wordsA = recA.name
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => !GENERIC_TOKENS.has(w) && w.length >= 4);
      const wordsB = recB.name
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => !GENERIC_TOKENS.has(w) && w.length >= 4);
      const hasDistinctiveMatch = wordsA.some((w) => wordsB.includes(w));

      // Check relation
      if (samePlaceId) {
        addRelation(recA, recB, "EXACT_DUPLICATE", "Identical Google placeId");
        addFlag(recA, "POSSIBLE_DUPLICATE");
        addFlag(recB, "POSSIBLE_DUPLICATE");
      } else if (
        isSameAddress &&
        (nameSim > 0.2 || hasDistinctiveMatch || lev <= 2 || samePhone)
      ) {
        addRelation(
          recA,
          recB,
          "POSSIBLE_DUPLICATE",
          `Shared address with matching identity keywords (${(nameSim * 100).toFixed(0)}%) or matching phone`
        );
        addFlag(recA, "POSSIBLE_DUPLICATE");
        addFlag(recB, "POSSIBLE_DUPLICATE");
      } else if (
        isSameCoords &&
        (nameSim > 0.3 || hasDistinctiveMatch || lev <= 2 || samePhone)
      ) {
        addRelation(
          recA,
          recB,
          "POSSIBLE_DUPLICATE",
          `Coordinates within 30m with matching identity keywords (${(nameSim * 100).toFixed(0)}%)`
        );
        addFlag(recA, "POSSIBLE_DUPLICATE");
        addFlag(recB, "POSSIBLE_DUPLICATE");
      } else if (isSameAddress || isSameCoords) {
        // Different entity sharing the physical building / plaza
        addRelation(
          recA,
          recB,
          "SHARED_LOCATION",
          "Distinct entities sharing physical building, address, or commercial plaza"
        );
        addFlag(recA, "SHARED_ADDRESS");
        addFlag(recB, "SHARED_ADDRESS");
      }
    }
  }
}

function addRelation(
  recA: ProcessedMosqueRecord,
  recB: ProcessedMosqueRecord,
  type: DuplicateRelation["type"],
  reason: string
) {
  recA.duplicateRelations.push({
    type,
    targetIndex: recB.sourceIndex,
    targetTitle: recB.name,
    targetPlaceId: recB.provenance.placeId,
    reason,
  });

  recB.duplicateRelations.push({
    type,
    targetIndex: recA.sourceIndex,
    targetTitle: recA.name,
    targetPlaceId: recA.provenance.placeId,
    reason,
  });
}

function addFlag(rec: ProcessedMosqueRecord, flag: QualityFlag) {
  if (!rec.qualityFlags.includes(flag)) {
    rec.qualityFlags.push(flag);
  }
}
