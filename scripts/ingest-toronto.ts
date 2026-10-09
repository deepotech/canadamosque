import fs from "fs";
import path from "path";
import crypto from "crypto";
import { runIngestionPipeline } from "../src/pipeline/pipeline";

function computeFileHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const rawFilePath = path.join(rootDir, "toronto.json");
  const outputDir = path.join(rootDir, "src", "data", "toronto");

  console.log("==================================================");
  console.log("Canada Mosque Near Me — Toronto Ingestion Pipeline");
  console.log("==================================================");

  if (!fs.existsSync(rawFilePath)) {
    console.error(`ERROR: Raw dataset not found at: ${rawFilePath}`);
    process.exit(1);
  }

  // Pre-ingestion checksum and byte size
  const preStats = fs.statSync(rawFilePath);
  const preHash = computeFileHash(rawFilePath);
  console.log(`Source File: ${rawFilePath}`);
  console.log(`Pre-ingestion File Size: ${preStats.size} bytes`);
  console.log(`Pre-ingestion SHA-256: ${preHash}`);

  const rawContent = fs.readFileSync(rawFilePath, "utf8");
  const rawRecords = JSON.parse(rawContent);

  if (!Array.isArray(rawRecords)) {
    console.error("ERROR: Raw file does not contain a JSON array!");
    process.exit(1);
  }

  console.log(`Processing ${rawRecords.length} raw records...`);

  // Fixed deterministic timestamp for reproducible audit metadata
  const fixedTimestamp = "2026-10-06T20:30:00.000Z";
  const result = runIngestionPipeline(rawRecords, "toronto.json", fixedTimestamp);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write outputs with stable formatting
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

  console.log(`Output successfully generated in: ${outputDir}`);
  console.log(`- Published Canonical Records: ${result.published.length}`);
  console.log(`- Review-Required Records:     ${result.reviewRequired.length}`);
  console.log(`- Excluded Records:            ${result.excluded.length}`);

  // Post-ingestion checksum and byte size verification
  const postStats = fs.statSync(rawFilePath);
  const postHash = computeFileHash(rawFilePath);

  if (preStats.size !== postStats.size || preHash !== postHash) {
    console.error("CRITICAL ERROR: toronto.json was modified during pipeline run!");
    process.exit(1);
  }

  console.log("--------------------------------------------------");
  console.log("Verification Passed: toronto.json is 100% UNTOUCHED.");
  console.log(`Post-ingestion SHA-256: ${postHash}`);
  console.log("==================================================");
}

main();
