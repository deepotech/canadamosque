import { RawGooglePlaceRecord } from "@/domain/ingestion/raw-record";
import { validateRawRecord } from "./raw-validator";
import {
  generateSlug,
  normalizeAddress,
  normalizeOpeningHours,
  normalizePhone,
  normalizeText,
  normalizeWebsite,
  extractFacilities,
} from "./normalizer";
import { classifyRecord } from "./classifier";
import { evaluateQualityFlags } from "./quality-checker";
import { analyzeDuplicatesAndSharedLocations } from "./duplicate-analyzer";
import { determinePublicationStatus } from "./publication-decider";
import {
  PipelineAuditReport,
  PipelineClassification,
  ProcessedMosqueRecord,
  PublicationStatus,
  QualityFlag,
} from "./types";
import { CityConfig } from "./city-config";

export interface PipelineExecutionResult {
  published: ProcessedMosqueRecord[];
  reviewRequired: ProcessedMosqueRecord[];
  excluded: ProcessedMosqueRecord[];
  report: PipelineAuditReport;
  markdownReport: string;
}

export function runIngestionPipeline(
  rawRecords: unknown[],
  sourceFile: string = "toronto.json",
  ingestionTimestamp: string = new Date().toISOString(),
  cityConfig?: CityConfig
): PipelineExecutionResult {
  const processedRecords: ProcessedMosqueRecord[] = [];
  const idPrefix = cityConfig ? cityConfig.idPrefix : "to";

  // Pass 1: Individual record validation, normalization, initial classification & flags
  for (let i = 0; i < rawRecords.length; i++) {
    const raw = rawRecords[i] as RawGooglePlaceRecord;
    const valResult = validateRawRecord(raw, i);

    const name = normalizeText(raw?.title || `Untitled Record ${i}`);
    const address = normalizeAddress(raw?.address || "", raw?.city, cityConfig);
    const classificationRes = classifyRecord(raw);
    const flags = evaluateQualityFlags(raw, classificationRes.classification, cityConfig);

    if (!valResult.isValid) {
      flags.push("INVALID_COORDINATES");
    }

    const phone = normalizePhone(raw?.phone);
    const website = normalizeWebsite(raw?.website);
    const openingHours = normalizeOpeningHours(raw?.openingHours);
    const facilities = extractFacilities(raw);

    const coordinates = {
      latitude: raw?.location?.lat ?? 0,
      longitude: raw?.location?.lng ?? 0,
    };

    const provenance = {
      sourceFile,
      sourceIndex: i,
      cid: raw?.cid || null,
      placeId: raw?.placeId || null,
      rawCategoryName: raw?.categoryName || null,
      rawCategories: raw?.categories || [],
      rating: raw?.rating ?? raw?.totalScore ?? null,
      reviewsCount: raw?.reviewsCount || null,
      ingestedAt: ingestionTimestamp,
    };

    const initialRecord: ProcessedMosqueRecord = {
      id: `mosque-${idPrefix}-${i + 1}`,
      sourceIndex: i,
      name,
      slug: generateSlug(name, address.city),
      address,
      coordinates,
      phone,
      website,
      classification: classificationRes.classification,
      classificationReason: classificationRes.reason,
      openingHours,
      facilities,
      qualityFlags: flags,
      duplicateRelations: [],
      publicationStatus: "REVIEW_REQUIRED", // evaluated in Pass 3
      publicationReason: "",
      provenance,
    };

    processedRecords.push(initialRecord);
  }

  // Pass 2: Cross-record duplicate and shared-location analysis
  analyzeDuplicatesAndSharedLocations(processedRecords);

  // Pass 3: Slug collision resolution (deterministic)
  const slugCounts = new Map<string, number>();
  for (const rec of processedRecords) {
    const count = slugCounts.get(rec.slug) || 0;
    slugCounts.set(rec.slug, count + 1);
    if (count > 0) {
      rec.slug = `${rec.slug}-${rec.sourceIndex + 1}`;
    }
  }

  // Pass 4: Final publication decision
  for (const rec of processedRecords) {
    const decision = determinePublicationStatus(rec);
    rec.publicationStatus = decision.status;
    rec.publicationReason = decision.reason;
  }

  // Pass 5: Segregate outputs
  const published: ProcessedMosqueRecord[] = [];
  const reviewRequired: ProcessedMosqueRecord[] = [];
  const excluded: ProcessedMosqueRecord[] = [];

  for (const rec of processedRecords) {
    if (rec.publicationStatus === "PUBLISHED") {
      published.push(rec);
    } else if (rec.publicationStatus === "REVIEW_REQUIRED") {
      reviewRequired.push(rec);
    } else {
      excluded.push(rec);
    }
  }

  // Pass 6: Compute Audit Report Statistics
  const report = buildAuditReport(
    rawRecords.length,
    published,
    reviewRequired,
    excluded,
    processedRecords
  );

  const markdownReport = generateMarkdownReport(report, cityConfig, sourceFile);

  return {
    published,
    reviewRequired,
    excluded,
    report,
    markdownReport,
  };
}

function buildAuditReport(
  totalRawRecords: number,
  published: ProcessedMosqueRecord[],
  reviewRequired: ProcessedMosqueRecord[],
  excluded: ProcessedMosqueRecord[],
  allRecords: ProcessedMosqueRecord[]
): PipelineAuditReport {
  const classificationCounts: Record<PipelineClassification, number> = {
    MOSQUE: 0,
    ISLAMIC_CENTER: 0,
    MUSALLA: 0,
    PRAYER_ROOM: 0,
    JUMMAH_LOCATION: 0,
    COMMUNITY_CENTER: 0,
    ORGANIZATION: 0,
    REVIEW_REQUIRED: 0,
    EXCLUDE: 0,
  };

  const publicationStatusCounts: Record<PublicationStatus, number> = {
    PUBLISHED: published.length,
    REVIEW_REQUIRED: reviewRequired.length,
    EXCLUDED: excluded.length,
  };

  const geographyDistribution: Record<string, number> = {};
  const qualityFlagCounts: Record<QualityFlag, number> = {
    MISSING_PHONE: 0,
    MISSING_WEBSITE: 0,
    MISSING_HOURS: 0,
    MISSING_DESCRIPTION: 0,
    INVALID_COORDINATES: 0,
    OUTSIDE_CANADA: 0,
    OUTSIDE_TORONTO_PILOT_AREA: 0,
    OUTSIDE_CITY_BOUNDS: 0,
    PROVINCE_MISMATCH: 0,
    GENERIC_NAME: 0,
    POSSIBLE_DUPLICATE: 0,
    SHARED_ADDRESS: 0,
    POSSIBLE_CLOSED_LOCATION: 0,
    POSSIBLE_MOVED_LOCATION: 0,
    POSSIBLE_NOT_A_MOSQUE: 0,
    CONTRADICTORY_INFORMATION: 0,
    ORGANIZATION_WITHOUT_PRAYER_LOCATION: 0,
    PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE: 0,
  };

  let missingPhone = 0;
  let missingWebsite = 0;
  let missingHours = 0;
  let missingDescription = 0;

  let exactDuplicates = 0;
  let possibleDuplicates = 0;
  let sharedLocations = 0;

  for (const rec of allRecords) {
    classificationCounts[rec.classification]++;

    const city = rec.address.city;
    geographyDistribution[city] = (geographyDistribution[city] || 0) + 1;

    for (const flag of rec.qualityFlags) {
      qualityFlagCounts[flag] = (qualityFlagCounts[flag] || 0) + 1;
      if (flag === "MISSING_PHONE") missingPhone++;
      if (flag === "MISSING_WEBSITE") missingWebsite++;
      if (flag === "MISSING_HOURS") missingHours++;
      if (flag === "MISSING_DESCRIPTION") missingDescription++;
    }

    for (const rel of rec.duplicateRelations) {
      if (rel.type === "EXACT_DUPLICATE") exactDuplicates++;
      if (rel.type === "POSSIBLE_DUPLICATE") possibleDuplicates++;
      if (rel.type === "SHARED_LOCATION") sharedLocations++;
    }
  }

  // Relations are bidirectional, divide count by 2
  exactDuplicates = Math.floor(exactDuplicates / 2);
  possibleDuplicates = Math.floor(possibleDuplicates / 2);
  sharedLocations = Math.floor(sharedLocations / 2);

  return {
    totalRawRecords,
    publishedCount: published.length,
    reviewRequiredCount: reviewRequired.length,
    excludedCount: excluded.length,
    classificationCounts,
    publicationStatusCounts,
    geographyDistribution,
    qualityFlagCounts,
    missingFields: {
      missingPhone,
      missingWebsite,
      missingHours,
      missingDescription,
    },
    duplicatesSummary: {
      exactDuplicates,
      possibleDuplicates,
      sharedLocations,
    },
    reviewRequiredRecords: reviewRequired.map((r) => ({
      sourceIndex: r.sourceIndex,
      id: r.id,
      name: r.name,
      address: r.address.raw,
      city: r.address.city,
      classification: r.classification,
      flags: r.qualityFlags,
      reason: r.publicationReason,
    })),
    excludedRecords: excluded.map((r) => ({
      sourceIndex: r.sourceIndex,
      id: r.id,
      name: r.name,
      address: r.address.raw,
      classification: r.classification,
      reason: r.publicationReason,
    })),
  };
}

function generateMarkdownReport(
  report: PipelineAuditReport,
  cityConfig?: CityConfig,
  sourceFile: string = "toronto.json"
): string {
  const isToronto = !cityConfig || cityConfig.city.toLowerCase() === "toronto";
  const title = isToronto
    ? "Toronto Pilot Dataset: Ingestion & Quality Audit Report"
    : `${cityConfig.city} Dataset: Ingestion & Quality Audit Report`;
  const areaDesc = isToronto
    ? "Greater Toronto Area (GTA), Ontario, Canada"
    : `${cityConfig.city}, ${cityConfig.provinceFullName}, Canada`;

  return `# ${title}

**Audit Run Date**: ${new Date().toISOString()}  
**Dataset Source**: \`${sourceFile}\` (${report.totalRawRecords} raw records preserved intact)  
**Geographic Area**: ${areaDesc}  

---

## 1. Executive Summary

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Raw Records** | **${report.totalRawRecords}** | 100.0% |
| **Published (Canonical)** | **${report.publishedCount}** | ${(
    (report.publishedCount / report.totalRawRecords) *
    100
  ).toFixed(1)}% |
| **Review Required** | **${report.reviewRequiredCount}** | ${(
    (report.reviewRequiredCount / report.totalRawRecords) *
    100
  ).toFixed(1)}% |
| **Excluded** | **${report.excludedCount}** | ${(
    (report.excludedCount / report.totalRawRecords) *
    100
  ).toFixed(1)}% |

---

## 2. Classification Distribution

| Classification | Count | Description |
| :--- | :--- | :--- |
| **MOSQUE** | ${report.classificationCounts.MOSQUE} | Dedicated congregational mosque / masjid |
| **ISLAMIC_CENTER** | ${report.classificationCounts.ISLAMIC_CENTER} | Multi-service Islamic Centre |
| **COMMUNITY_CENTER** | ${report.classificationCounts.COMMUNITY_CENTER} | Community center / Jamatkhana facility |
| **MUSALLA** | ${report.classificationCounts.MUSALLA} | Smaller prayer hall or storefront musalla |
| **JUMMAH_LOCATION** | ${report.classificationCounts.JUMMAH_LOCATION} | Dedicated Friday/Jummah prayer location |
| **ORGANIZATION** | ${report.classificationCounts.ORGANIZATION} | Association, society, council, or madrasa |
| **PRAYER_ROOM** | ${report.classificationCounts.PRAYER_ROOM} | Campus or institutional multi-faith room |
| **REVIEW_REQUIRED** | ${report.classificationCounts.REVIEW_REQUIRED} | Insufficient or conflicting classification signals |
| **EXCLUDE** | ${report.classificationCounts.EXCLUDE} | Non-prayer medical or secular facility |

---

## 3. Geographic Distribution (GTA Pilot)

| Municipality | Record Count |
| :--- | :--- |
${Object.entries(report.geographyDistribution)
  .sort((a, b) => b[1] - a[1])
  .map(([city, count]) => `| ${city} | ${count} |`)
  .join("\n")}

---

## 4. Quality Flags & Missing Information

| Quality Flag | Occurrences |
| :--- | :--- |
| **MISSING_DESCRIPTION** | ${report.missingFields.missingDescription} |
| **MISSING_HOURS** | ${report.missingFields.missingHours} |
| **MISSING_PHONE** | ${report.missingFields.missingPhone} |
| **MISSING_WEBSITE** | ${report.missingFields.missingWebsite} |
| **SHARED_ADDRESS** | ${report.qualityFlagCounts.SHARED_ADDRESS} |
| **POSSIBLE_DUPLICATE** | ${report.qualityFlagCounts.POSSIBLE_DUPLICATE} |
| **ORGANIZATION_WITHOUT_PRAYER_LOCATION** | ${report.qualityFlagCounts.ORGANIZATION_WITHOUT_PRAYER_LOCATION} |
| **PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE** | ${report.qualityFlagCounts.PRAYER_LOCATION_WITHOUT_FULL_MOSQUE_EVIDENCE} |
| **POSSIBLE_CLOSED_LOCATION** | ${report.qualityFlagCounts.POSSIBLE_CLOSED_LOCATION} |
| **POSSIBLE_NOT_A_MOSQUE** | ${report.qualityFlagCounts.POSSIBLE_NOT_A_MOSQUE} |
| **GENERIC_NAME** | ${report.qualityFlagCounts.GENERIC_NAME} |
| **CONTRADICTORY_INFORMATION** | ${report.qualityFlagCounts.CONTRADICTORY_INFORMATION} |
| **INVALID_COORDINATES** | ${report.qualityFlagCounts.INVALID_COORDINATES} |
| **OUTSIDE_CANADA** | ${report.qualityFlagCounts.OUTSIDE_CANADA} |

---

## 5. Duplicate & Shared-Location Analysis

- **Candidate Duplicates Detected**: ${report.duplicatesSummary.possibleDuplicates}
- **Shared Physical Addresses / Plazas**: ${report.duplicatesSummary.sharedLocations}
- **Exact Duplicates**: ${report.duplicatesSummary.exactDuplicates}

---

## 6. Records Requiring Manual Review (${report.reviewRequiredRecords.length})

${report.reviewRequiredRecords
  .map(
    (r, idx) => `### ${idx + 1}. ${r.name} (\`${r.id}\`)
- **Index**: \`#${r.sourceIndex}\`
- **Address**: ${r.address} (${r.city})
- **Classification**: \`${r.classification}\`
- **Quality Flags**: ${r.flags.map((f) => `\`${f}\``).join(", ") || "None"}
- **Review Trigger**: ${r.reason}
`
  )
  .join("\n")}

---

## 7. Excluded Records (${report.excludedRecords.length})

${report.excludedRecords
  .map(
    (r, idx) => `### ${idx + 1}. ${r.name} (\`${r.id}\`)
- **Index**: \`#${r.sourceIndex}\`
- **Address**: ${r.address}
- **Classification**: \`${r.classification}\`
- **Reason**: ${r.reason}
`
  )
  .join("\n")}
`;
}
