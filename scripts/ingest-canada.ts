import fs from "fs";
import path from "path";
import crypto from "crypto";
import { runIngestionPipeline, PipelineExecutionResult } from "../src/pipeline/pipeline";
import { SUPPORTED_CITIES, CityConfig } from "../src/pipeline/city-config";

const EXPECTED_TORONTO_SHA256 = "0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9";

function computeFileHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export interface CityIngestionSummary {
  city: string;
  province: string;
  rawCount: number;
  publishedCount: number;
  reviewRequiredCount: number;
  excludedCount: number;
  rawSha256: string;
  result: PipelineExecutionResult;
}

export function runCityIngestion(
  cityKey: string,
  rootDir: string = path.resolve(__dirname, ".."),
  fixedTimestamp: string = "2026-10-08T00:00:00.000Z",
  writeToDisk: boolean = true
): CityIngestionSummary {
  const normKey = cityKey.toLowerCase().trim();
  const cfg = SUPPORTED_CITIES[normKey];
  if (!cfg) {
    throw new Error(`Unsupported city: ${cityKey}`);
  }

  const rawPath = path.resolve(rootDir, cfg.rawFilePath);
  if (!fs.existsSync(rawPath)) {
    throw new Error(`Raw dataset not found at: ${rawPath}`);
  }

  const rawSha = computeFileHash(rawPath);
  const rawContent = fs.readFileSync(rawPath, "utf8");
  const rawRecords = JSON.parse(rawContent);

  if (!Array.isArray(rawRecords)) {
    throw new Error(`Raw dataset for ${cfg.city} is not an array`);
  }

  const result = runIngestionPipeline(
    rawRecords,
    `${cfg.slug}.json`,
    fixedTimestamp,
    cfg
  );

  // Accounting verification
  const totalProcessed =
    result.published.length +
    result.reviewRequired.length +
    result.excluded.length;
  if (totalProcessed !== rawRecords.length) {
    throw new Error(
      `CRITICAL ACCOUNTING FAILURE for ${cfg.city}: raw count (${rawRecords.length}) != published (${result.published.length}) + review (${result.reviewRequired.length}) + excluded (${result.excluded.length})`
    );
  }

  if (writeToDisk) {
    // Ensure output directory exists
    const outputDir = path.resolve(rootDir, cfg.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write canonical output files
    fs.writeFileSync(
      path.join(outputDir, "published.json"),
      JSON.stringify(result.published, null, 2),
      "utf8"
    );
    fs.writeFileSync(
      path.join(outputDir, "review-required.json"),
      JSON.stringify(result.reviewRequired, null, 2),
      "utf8"
    );
    fs.writeFileSync(
      path.join(outputDir, "excluded.json"),
      JSON.stringify(result.excluded, null, 2),
      "utf8"
    );
    fs.writeFileSync(
      path.join(outputDir, "quality-report.json"),
      JSON.stringify(result.report, null, 2),
      "utf8"
    );
    fs.writeFileSync(
      path.join(outputDir, "QUALITY_REPORT.md"),
      result.markdownReport,
      "utf8"
    );
  }

  return {
    city: cfg.city,
    province: cfg.provinceFullName,
    rawCount: rawRecords.length,
    publishedCount: result.published.length,
    reviewRequiredCount: result.reviewRequired.length,
    excludedCount: result.excluded.length,
    rawSha256: rawSha,
    result,
  };
}

export function generateMultiCityIngestionReport(
  summaries: Record<string, CityIngestionSummary>
): string {
  const cities = Object.keys(summaries);
  let totalRaw = 0;
  let totalPub = 0;
  let totalRev = 0;
  let totalExc = 0;

  cities.forEach((c) => {
    const s = summaries[c];
    totalRaw += s.rawCount;
    totalPub += s.publishedCount;
    totalRev += s.reviewRequiredCount;
    totalExc += s.excludedCount;
  });

  let md = `# Multi-City Ingestion & Quality Audit Report — Phase 7

**Execution Date**: 2026-10-08  
**Scope**: All 9 Canadian Metropolitan Datasets (1 Reference + 8 Expansion)  
**Total Raw Records Processed**: ${totalRaw}  

---

## 1. Executive Multi-City Summary

| City | Province | Raw | Published | Review | Excluded | Accounting Check | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
`;

  cities.forEach((c) => {
    const s = summaries[c];
    const match =
      s.publishedCount + s.reviewRequiredCount + s.excludedCount === s.rawCount;
    md += `| **${s.city}** | ${s.province} | ${s.rawCount} | ${s.publishedCount} | ${s.reviewRequiredCount} | ${s.excludedCount} | ${match ? "PASS (100%)" : "FAIL"} | ${s.city === "Toronto" ? "REFERENCE (UNTOUCHED)" : "CANONICAL DATASET"} |\n`;
  });

  md += `| **TOTAL** | — | **${totalRaw}** | **${totalPub}** | **${totalRev}** | **${totalExc}** | **PASS (${totalRaw}/${totalRaw})** | **COMPLETE** |

---

## 2. City-by-City Classification Breakdown

`;

  cities.forEach((c) => {
    const s = summaries[c];
    const r = s.result.report;
    md += `### ${s.city} (${s.province})
- **Raw Records**: ${s.rawCount}
- **Published Canonical**: ${s.publishedCount} (${((s.publishedCount / s.rawCount) * 100).toFixed(1)}%)
- **Review Required**: ${s.reviewRequiredCount} (${((s.reviewRequiredCount / s.rawCount) * 100).toFixed(1)}%)
- **Excluded**: ${s.excludedCount} (${((s.excludedCount / s.rawCount) * 100).toFixed(1)}%)
- **Classifications**:
  - Mosques: ${r.classificationCounts.MOSQUE}
  - Islamic Centres: ${r.classificationCounts.ISLAMIC_CENTER}
  - Musallas: ${r.classificationCounts.MUSALLA}
  - Community Centres: ${r.classificationCounts.COMMUNITY_CENTER}
  - Jummah Locations: ${r.classificationCounts.JUMMAH_LOCATION}
  - Organizations: ${r.classificationCounts.ORGANIZATION}
  - Prayer Rooms: ${r.classificationCounts.PRAYER_ROOM}
  - Review Required: ${r.classificationCounts.REVIEW_REQUIRED}
  - Excluded: ${r.classificationCounts.EXCLUDE}
- **Duplicates & Shared Locations**:
  - Exact duplicates: ${r.duplicatesSummary.exactDuplicates}
  - Possible duplicate candidates: ${r.duplicatesSummary.possibleDuplicates}
  - Shared physical addresses: ${r.duplicatesSummary.sharedLocations}
- **Missing Optional Information**:
  - Missing phone: ${r.missingFields.missingPhone}
  - Missing website: ${r.missingFields.missingWebsite}
  - Missing hours: ${r.missingFields.missingHours}

`;
  });

  md += `---

## 3. Data Integrity & Ingestion Boundary Guarantees

1. **No Data Loss**: Exactly ${totalRaw} of ${totalRaw} raw records are accounted for.
2. **Toronto Immutability**: Toronto reference dataset SHA-256 is verified unchanged.
3. **Isolation**: Outputs for the 8 new cities are strictly isolated in \`src/data/cities/<city>/\` and not connected to live public pages or sitemaps.
4. **Zero Fabrication**: No missing phone numbers, websites, facilities, Iqamah, or Jummah schedules were fabricated or inferred.
`;

  return md;
}

export function generateReviewQueueReport(
  summaries: Record<string, CityIngestionSummary>
): string {
  let md = `# Multi-City Manual Review Queue — Phase 7

**Generated**: 2026-10-08  
**Purpose**: Comprehensive catalog of records routed to \`review-required.json\` across all Canadian cities.

---

`;

  Object.keys(summaries).forEach((c) => {
    const s = summaries[c];
    const revs = s.result.reviewRequired;
    md += `## ${s.city} (${revs.length} records requiring review)\n\n`;

    if (revs.length === 0) {
      md += `*No records requiring manual review in this dataset.*\n\n`;
      return;
    }

    revs.forEach((r, idx) => {
      md += `### ${idx + 1}. ${r.name} (\`${r.id}\`)
- **Address**: ${r.address.raw} (${r.address.city}, ${r.address.province})
- **Classification**: \`${r.classification}\`
- **Place ID**: \`${r.provenance.placeId || "None"}\`
- **Review Trigger**: ${r.publicationReason}
- **Quality Flags**: ${r.qualityFlags.map((f) => `\`${f}\``).join(", ") || "None"}
- **Recommended Action**: Verify whether entity operates an active, publicly accessible daily prayer sanctuary or if it is an administrative office / closed location.

`;
    });
  });

  return md;
}

export function generateDuplicateAnalysisReport(
  summaries: Record<string, CityIngestionSummary>
): string {
  let md = `# Multi-City Duplicate & Shared Location Analysis — Phase 7

**Generated**: 2026-10-08  
**Scope**: Deterministic duplicate and multi-tenancy analysis across all Canadian datasets.  
**Rule**: No raw records deleted; all relations recorded for human review.

---

`;

  Object.keys(summaries).forEach((c) => {
    const s = summaries[c];
    const all = [
      ...s.result.published,
      ...s.result.reviewRequired,
      ...s.result.excluded,
    ];
    const withRelations = all.filter((r) => r.duplicateRelations.length > 0);

    md += `## ${s.city}\n\n`;
    md += `- **Candidate Duplicate Pairs**: ${s.result.report.duplicatesSummary.possibleDuplicates}\n`;
    md += `- **Shared Physical Addresses / Plazas**: ${s.result.report.duplicatesSummary.sharedLocations}\n`;
    md += `- **Exact Google placeId Duplicates**: ${s.result.report.duplicatesSummary.exactDuplicates}\n\n`;

    if (withRelations.length === 0) {
      md += `*No duplicate relations or shared addresses detected in ${s.city}.*\n\n`;
      return;
    }

    const seenPairs = new Set<string>();

    withRelations.forEach((r) => {
      r.duplicateRelations.forEach((rel) => {
        const pairKey = [r.name, rel.targetTitle].sort().join(" <-> ");
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          md += `### [${rel.type}] ${r.name} ↔ ${rel.targetTitle}\n`;
          md += `- **Record 1 ID**: \`${r.id}\` (Index #${r.sourceIndex})\n`;
          md += `- **Record 2 ID**: Index #${rel.targetIndex}\n`;
          md += `- **Reason**: ${rel.reason}\n`;
          md += `- **Addresses**:\n`;
          md += `  - \`${r.address.raw}\`\n\n`;
        }
      });
    });
  });

  return md;
}

function updateManifest(summaries: Record<string, CityIngestionSummary>, manifestPath: string) {
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.datasets)) return;

  manifest.phase = "PHASE_7_MULTI_CITY_INGESTION";
  manifest.updatedAt = new Date().toISOString();

  manifest.datasets = manifest.datasets.map((d: any) => {
    const key = (d.city || "").toLowerCase().trim();
    const s = summaries[key];
    if (s) {
      return {
        ...d,
        publishedCount: s.publishedCount,
        reviewRequiredCount: s.reviewRequiredCount,
        excludedCount: s.excludedCount,
        accountingStatus: "VERIFIED_100%",
        processedAt: "2026-10-08T00:00:00.000Z",
      };
    }
    return d;
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

export function main() {
  const rootDir = path.resolve(__dirname, "..");
  const torontoRawPath = path.join(rootDir, "src", "data", "raw", "toronto.json");

  console.log("==================================================");
  console.log("Canada Mosque Near Me — Multi-City Ingestion Pipeline");
  console.log("==================================================");

  // Pre-ingestion Toronto immutability check
  if (!fs.existsSync(torontoRawPath)) {
    console.error(`ERROR: Toronto raw dataset missing at: ${torontoRawPath}`);
    process.exit(1);
  }
  const preTorontoSha = computeFileHash(torontoRawPath);
  if (preTorontoSha !== EXPECTED_TORONTO_SHA256) {
    console.error(`CRITICAL: Toronto raw dataset SHA-256 mismatch! Expected ${EXPECTED_TORONTO_SHA256}, got ${preTorontoSha}`);
    process.exit(1);
  }
  console.log(`Toronto Raw Checksum Verified: ${preTorontoSha}\n`);

  // Parse command line arguments
  const args = process.argv.slice(2);
  let targetCities: string[] = [];

  if (args.length === 0 || args.includes("all") || args.includes("canada")) {
    // Process in recommended order:
    // Group 1: Ottawa, Mississauga, Brampton
    // Group 2: Vancouver, Calgary, Edmonton
    // Group 3: Montreal, Winnipeg
    // Reference: Toronto
    targetCities = [
      "toronto",
      "ottawa",
      "mississauga",
      "brampton",
      "vancouver",
      "calgary",
      "edmonton",
      "montreal",
      "winnipeg",
    ];
  } else {
    targetCities = args.map((a) => a.toLowerCase().trim());
  }

  console.log(`Target Cities to Ingest: ${targetCities.join(", ").toUpperCase()}\n`);

  const summaries: Record<string, CityIngestionSummary> = {};

  for (const cityKey of targetCities) {
    console.log(`--------------------------------------------------`);
    console.log(`Processing City: ${cityKey.toUpperCase()}...`);
    try {
      const summary = runCityIngestion(cityKey, rootDir);
      summaries[cityKey] = summary;
      console.log(
        `✓ ${summary.city}: Raw=${summary.rawCount} | Published=${summary.publishedCount} | Review=${summary.reviewRequiredCount} | Excluded=${summary.excludedCount}`
      );
    } catch (err) {
      console.error(`✗ Error processing ${cityKey}:`, (err as Error).message);
      process.exit(1);
    }
  }

  console.log(`--------------------------------------------------\n`);

  // Post-ingestion Toronto immutability check
  const postTorontoSha = computeFileHash(torontoRawPath);
  if (postTorontoSha !== EXPECTED_TORONTO_SHA256) {
    console.error(`CRITICAL: Toronto raw dataset was mutated during ingestion! Got ${postTorontoSha}`);
    process.exit(1);
  }
  console.log(`Post-Ingestion Toronto Checksum Verified: UNCHANGED ✓`);

  // Write documentation reports if full run was executed
  if (Object.keys(summaries).length >= 8) {
    console.log("\nGenerating Multi-City Documentation Reports...");
    const reportMd = generateMultiCityIngestionReport(summaries);
    fs.writeFileSync(path.join(rootDir, "docs", "MULTI_CITY_INGESTION_REPORT.md"), reportMd, "utf8");

    const reviewMd = generateReviewQueueReport(summaries);
    fs.writeFileSync(path.join(rootDir, "docs", "MULTI_CITY_REVIEW_QUEUE.md"), reviewMd, "utf8");

    const dupMd = generateDuplicateAnalysisReport(summaries);
    fs.writeFileSync(path.join(rootDir, "docs", "MULTI_CITY_DUPLICATE_ANALYSIS.md"), dupMd, "utf8");

    const manifestPath = path.join(rootDir, "src", "data", "raw", "manifest.json");
    updateManifest(summaries, manifestPath);
    console.log("✓ Reports and manifest successfully written in docs/ and src/data/raw/");
  }

  console.log("\n==================================================");
  console.log("Multi-City Ingestion Complete & Fully Audited");
  console.log("==================================================");
}

if (require.main === module || (typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("ingest-canada.ts"))) {
  main();
}
