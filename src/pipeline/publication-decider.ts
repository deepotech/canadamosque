import { ProcessedMosqueRecord, PublicationStatus } from "./types";

export interface PublicationDecision {
  status: PublicationStatus;
  reason: string;
}

export function determinePublicationStatus(
  record: ProcessedMosqueRecord
): PublicationDecision {
  // 1. Clearly excluded records
  if (record.classification === "EXCLUDE") {
    return {
      status: "EXCLUDED",
      reason: "Classified as non-prayer entity (e.g. medical, commercial, or non-Islamic facility).",
    };
  }

  // 2. Critical flags that trigger mandatory human review
  if (record.qualityFlags.includes("POSSIBLE_NOT_A_MOSQUE")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "User reviews or source evidence suggest this location is not an active mosque.",
    };
  }

  if (record.qualityFlags.includes("POSSIBLE_CLOSED_LOCATION")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Review reports indicate location is permanently locked, shut, or no longer operational.",
    };
  }

  if (record.qualityFlags.includes("POSSIBLE_MOVED_LOCATION")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Evidence indicates this facility has relocated to another address.",
    };
  }

  if (record.qualityFlags.includes("POSSIBLE_DUPLICATE")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Candidate duplicate detected sharing address/coordinates with high similarity to another record.",
    };
  }

  if (record.qualityFlags.includes("GENERIC_NAME")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Generic title (e.g. 'Masjid') without clear organizational disambiguation.",
    };
  }

  if (record.qualityFlags.includes("CONTRADICTORY_INFORMATION")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Contradictory categories or metadata found in raw source.",
    };
  }

  if (record.qualityFlags.includes("ORGANIZATION_WITHOUT_PRAYER_LOCATION")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Identified as an administrative association/organization without verified prayer sanctuary.",
    };
  }

  if (record.classification === "PRAYER_ROOM") {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Campus or institutional multi-faith room requiring manual verification of public accessibility.",
    };
  }

  if (record.classification === "REVIEW_REQUIRED") {
    return {
      status: "REVIEW_REQUIRED",
      reason: record.classificationReason,
    };
  }

  if (
    record.qualityFlags.includes("OUTSIDE_CANADA") ||
    record.qualityFlags.includes("OUTSIDE_TORONTO_PILOT_AREA") ||
    record.qualityFlags.includes("OUTSIDE_CITY_BOUNDS")
  ) {
    return {
      status: "REVIEW_REQUIRED",
      reason: record.qualityFlags.includes("OUTSIDE_CANADA")
        ? "Coordinates are outside Canada boundaries."
        : record.qualityFlags.includes("OUTSIDE_TORONTO_PILOT_AREA")
        ? "Coordinates are outside the designated Toronto pilot boundaries."
        : "Coordinates are outside the designated municipal boundaries.",
    };
  }

  if (record.qualityFlags.includes("PROVINCE_MISMATCH")) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "Record state/province does not match expected Canadian province.",
    };
  }

  // 3. Approved for publication
  if (
    record.classification === "MOSQUE" ||
    record.classification === "ISLAMIC_CENTER" ||
    record.classification === "MUSALLA" ||
    record.classification === "JUMMAH_LOCATION" ||
    record.classification === "COMMUNITY_CENTER"
  ) {
    const isTorontoSource =
      record.provenance.sourceFile.toLowerCase().includes("toronto") ||
      record.address.province === "ON" && (record.address.city.toLowerCase() === "toronto" || !record.id.startsWith("mosque-"));
    const locationDesc = isTorontoSource
      ? "within Toronto pilot area."
      : `within ${record.address.city || "designated"} service area.`;
    return {
      status: "PUBLISHED",
      reason: `Verified ${record.classification.toLowerCase().replace(/_/g, " ")} ${locationDesc}`,
    };
  }

  return {
    status: "REVIEW_REQUIRED",
    reason: "Default review triggered due to unconfirmed classification state.",
  };
}
