import { RawGooglePlaceRecord } from "@/domain/ingestion/raw-record";
import { PipelineClassification } from "./types";

export interface ClassificationResult {
  classification: PipelineClassification;
  reason: string;
}

export function classifyRecord(raw: RawGooglePlaceRecord): ClassificationResult {
  const title = (raw.title || "").trim();
  const lowerTitle = title.toLowerCase();
  const categoryName = (raw.categoryName || "").trim().toLowerCase();
  const categories = (raw.categories || []).map((c) => c.toLowerCase());

  // 1. Check for clear EXCLUDE candidates (e.g., Medical centers, clinics, secular businesses)
  if (
    categoryName.includes("medical center") ||
    categories.includes("medical center") ||
    /healthcare|medical center|dental|clinic/i.test(title)
  ) {
    return {
      classification: "EXCLUDE",
      reason: "Classified as non-prayer medical or healthcare facility.",
    };
  }

  // 2. Check for PRAYER_ROOM (e.g., campus multi-faith rooms, university rooms)
  if (
    /multi faith|multi-faith|student union|university|college|room\s*\d+/i.test(title) ||
    /campus/i.test(title)
  ) {
    return {
      classification: "PRAYER_ROOM",
      reason: "Campus or institutional multi-faith prayer room.",
    };
  }

  // 3. Check for JUMMAH_LOCATION (specifically designated for Friday/Jummah services)
  if (/\bjummah\b|\bfriday\b|\bfridays\b/i.test(lowerTitle)) {
    return {
      classification: "JUMMAH_LOCATION",
      reason: "Identified specifically as a Jummah / Friday prayer location.",
    };
  }

  // 4. Check for MUSALLA (smaller prayer rooms or storefront musallas)
  if (/\bmusalla\b|\bmusallah\b|\bprayer room\b|\bprayer hall\b/i.test(lowerTitle)) {
    return {
      classification: "MUSALLA",
      reason: "Designated as a Musalla or prayer room rather than a full mosque building.",
    };
  }

  // 5. Check for ORGANIZATIONS / ASSOCIATIONS / MADRASAS / COMMITTEES
  // (unless the title explicitly starts with or primarily specifies a Masjid/Mosque)
  const isPrimaryMosque =
    /^(masjid|mosque|mosqu[ée]e?|jami\b|albanian mosque|bosnian islamic)/iu.test(title) ||
    /masjid|mosque|mosqu[ée]e?/iu.test(title.split(/[-–(]/)[0]);

  if (
    !isPrimaryMosque &&
    (/\b(association|society|committee|council|foundation|federation|program|head office|madrasa|madrasah)\b/i.test(
      lowerTitle
    ) ||
      categoryName.includes("religious organization") ||
      categories.includes("non-profit organization"))
  ) {
    return {
      classification: "ORGANIZATION",
      reason: "Identified as an Islamic association, society, madrasa, or administrative organization.",
    };
  }

  // 6. Check for COMMUNITY_CENTER / JAMATKHANA
  if (
    /community cent(er|re)|cent(er|re) communautaire|jamatkhana/iu.test(lowerTitle) ||
    categoryName.includes("community center") ||
    categoryName.includes("centre communautaire")
  ) {
    return {
      classification: "COMMUNITY_CENTER",
      reason: "Community center or Jamatkhana facility hosting gatherings and prayers.",
    };
  }

  // 7. Check for ISLAMIC_CENTER
  if (
    /islamic cent(er|re)|cent(er|re) (islamic|islamique)|cultural cent(er|re)|cent(er|re) culturel|icmg/iu.test(
      lowerTitle
    )
  ) {
    return {
      classification: "ISLAMIC_CENTER",
      reason: "Major Islamic Centre offering comprehensive community and prayer services.",
    };
  }

  // 8. Check for standard MOSQUE / MASJID
  if (/\b(masjid|mosque|mosqu[ée]e?|jami|baitul)\b/iu.test(lowerTitle)) {
    return {
      classification: "MOSQUE",
      reason: "Standard mosque / masjid dedicated primarily to daily congregational prayers.",
    };
  }

  // 9. Generic or ambiguous fallbacks
  if (categoryName.includes("mosque") || categories.includes("mosque")) {
    return {
      classification: "REVIEW_REQUIRED",
      reason: "Tagged with category Mosque but title lacks explicit mosque/masjid indicators.",
    };
  }

  return {
    classification: "REVIEW_REQUIRED",
    reason: "Insufficient unambiguous evidence to classify automatically.",
  };
}
