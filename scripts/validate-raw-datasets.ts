import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface CoordinateBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  expectedProvince: string;
}

export const CITY_BOUNDS: Record<string, CoordinateBounds> = {
  toronto: { minLat: 43.4, maxLat: 44.0, minLng: -79.8, maxLng: -79.1, expectedProvince: "Ontario" },
  ottawa: { minLat: 45.0, maxLat: 45.7, minLng: -76.5, maxLng: -75.1, expectedProvince: "Ontario" },
  mississauga: { minLat: 43.4, maxLat: 43.8, minLng: -79.8, maxLng: -79.4, expectedProvince: "Ontario" },
  brampton: { minLat: 43.6, maxLat: 43.9, minLng: -79.9, maxLng: -79.6, expectedProvince: "Ontario" },
  vancouver: { minLat: 49.0, maxLat: 49.5, minLng: -123.4, maxLng: -122.8, expectedProvince: "British Columbia" },
  calgary: { minLat: 50.8, maxLat: 51.3, minLng: -114.4, maxLng: -113.8, expectedProvince: "Alberta" },
  edmonton: { minLat: 53.3, maxLat: 53.8, minLng: -113.8, maxLng: -113.2, expectedProvince: "Alberta" },
  montreal: { minLat: 45.3, maxLat: 45.8, minLng: -74.0, maxLng: -73.4, expectedProvince: "Quebec" },
  winnipeg: { minLat: 49.7, maxLat: 50.1, minLng: -97.4, maxLng: -96.9, expectedProvince: "Manitoba" },
};

export const TORONTO_EXPECTED_SHA256 = "0012cba3c25ba2eb086050c86c5291acff78088dc9e815df9f86b49e0d1d4bb9";

export interface RawDatasetValidationResult {
  city: string;
  file: string;
  isValidJson: boolean;
  isArray: boolean;
  recordCount: number;
  fileSize: number;
  sha256: string;
  validObjectsCount: number;
  errors: string[];
  warnings: string[];
  potentialDuplicates: Array<{
    type: "placeId" | "coordinates" | "normalizedAddress";
    value: string;
    titles: string[];
    count: number;
  }>;
  sharedAddresses: Array<{
    address: string;
    titles: string[];
    count: number;
  }>;
  coordinateAnomalies: Array<{
    title: string;
    lat: number;
    lng: number;
    reason: string;
  }>;
  missingFieldsStats: {
    noPhone: number;
    noWebsite: number;
    noOpeningHours: number;
    noPlaceId: number;
    noRating: number;
    noPostalCode: number;
  };
  extraFields: string[];
  missingReferenceFields: string[];
}

export function computeSha256(content: Buffer | string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function validateRawDatasetContent(
  cityKey: string,
  rawContent: string,
  referenceKeys: string[] = []
): RawDatasetValidationResult {
  const result: RawDatasetValidationResult = {
    city: cityKey,
    file: `${cityKey}.json`,
    isValidJson: false,
    isArray: false,
    recordCount: 0,
    fileSize: Buffer.byteLength(rawContent, "utf8"),
    sha256: computeSha256(rawContent),
    validObjectsCount: 0,
    errors: [],
    warnings: [],
    potentialDuplicates: [],
    sharedAddresses: [],
    coordinateAnomalies: [],
    missingFieldsStats: {
      noPhone: 0,
      noWebsite: 0,
      noOpeningHours: 0,
      noPlaceId: 0,
      noRating: 0,
      noPostalCode: 0,
    },
    extraFields: [],
    missingReferenceFields: [],
  };

  let records: unknown[];
  try {
    records = JSON.parse(rawContent);
    result.isValidJson = true;
  } catch (err) {
    result.errors.push(`Malformed JSON: ${(err as Error).message}`);
    return result;
  }

  if (!Array.isArray(records)) {
    result.errors.push("Dataset root is not a JSON array");
    return result;
  }

  result.isArray = true;
  result.recordCount = records.length;

  if (records.length === 0) {
    result.warnings.push("Dataset contains 0 records");
    return result;
  }

  const allRecordKeys = new Set<string>();
  const placeIdMap = new Map<string, string[]>();
  const coordMap = new Map<string, string[]>();
  const addressMap = new Map<string, string[]>();

  const bounds = CITY_BOUNDS[cityKey.toLowerCase()];

  records.forEach((item, idx) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      result.errors.push(`Record at index ${idx} is not a valid JSON object`);
      return;
    }

    result.validObjectsCount++;
    const rec = item as Record<string, any>;

    // Collect keys for schema compatibility
    Object.keys(rec).forEach((k) => allRecordKeys.add(k));

    // Basic structure validation
    const title = typeof rec.title === "string" ? rec.title.trim() : "";
    if (!title) {
      result.errors.push(`Record at index ${idx} is missing 'title'`);
    }

    const address = typeof rec.address === "string" ? rec.address.trim() : "";
    if (!address) {
      result.errors.push(`Record at index ${idx} (${title || `idx ${idx}`}) is missing 'address'`);
    }

    // Coordinate validation
    const loc = rec.location;
    if (!loc || typeof loc !== "object") {
      result.errors.push(`Record at index ${idx} (${title}) is missing 'location' object`);
    } else {
      const lat = loc.lat;
      const lng = loc.lng;
      if (typeof lat !== "number" || Number.isNaN(lat) || typeof lng !== "number" || Number.isNaN(lng)) {
        result.errors.push(`Record at index ${idx} (${title}) has non-numeric coordinates: lat=${lat}, lng=${lng}`);
      } else {
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          result.errors.push(`Record at index ${idx} (${title}) has out-of-bounds coordinates: (${lat}, ${lng})`);
        } else if (bounds) {
          // Geographic check
          if (lat < bounds.minLat || lat > bounds.maxLat || lng < bounds.minLng || lng > bounds.maxLng) {
            result.coordinateAnomalies.push({
              title: title || `Index ${idx}`,
              lat,
              lng,
              reason: `Coordinates outside expected bounds [${bounds.minLat}..${bounds.maxLat}, ${bounds.minLng}..${bounds.maxLng}]`,
            });
          }
        }

        // Duplicate coordinates check
        const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        if (!coordMap.has(coordKey)) {
          coordMap.set(coordKey, []);
        }
        coordMap.get(coordKey)!.push(title || `idx ${idx}`);
      }
    }

    // Duplicate placeId check
    const placeId = typeof rec.placeId === "string" ? rec.placeId.trim() : "";
    if (placeId) {
      if (!placeIdMap.has(placeId)) {
        placeIdMap.set(placeId, []);
      }
      placeIdMap.get(placeId)!.push(title || `idx ${idx}`);
    } else {
      result.missingFieldsStats.noPlaceId++;
    }

    // Address mapping for shared addresses
    if (address) {
      const normAddr = address.toLowerCase().replace(/\s+/g, " ");
      if (!addressMap.has(normAddr)) {
        addressMap.set(normAddr, []);
      }
      addressMap.get(normAddr)!.push(title || `idx ${idx}`);
    }

    // Field coverage stats
    if (!rec.phone || typeof rec.phone !== "string" || !rec.phone.trim()) {
      result.missingFieldsStats.noPhone++;
    }
    const hasWebsite = rec.website && typeof rec.website === "string" && rec.website.trim().length > 0;
    if (!hasWebsite) {
      result.missingFieldsStats.noWebsite++;
    }
    if (!rec.openingHours || !Array.isArray(rec.openingHours) || rec.openingHours.length === 0) {
      result.missingFieldsStats.noOpeningHours++;
    }
    if (rec.reviewsCount === undefined || rec.reviewsCount === null || rec.reviewsCount === 0) {
      result.missingFieldsStats.noRating++;
    }
    if (!rec.postalCode) {
      result.missingFieldsStats.noPostalCode++;
    }

    // Province/State sanity check warning
    if (bounds && rec.state) {
      const stateStr = String(rec.state).toLowerCase();
      const expectedLower = bounds.expectedProvince.toLowerCase();
      const expectedShort = expectedLower === "ontario" ? "on" : expectedLower === "alberta" ? "ab" : expectedLower === "quebec" ? "qc" : expectedLower === "manitoba" ? "mb" : expectedLower === "british columbia" ? "bc" : "";
      if (!stateStr.includes(expectedLower) && stateStr !== expectedShort) {
        result.warnings.push(`Record '${title}' has state '${rec.state}', expected '${bounds.expectedProvince}'`);
      }
    }
  });

  // Calculate potential duplicates
  placeIdMap.forEach((titles, pid) => {
    if (titles.length > 1) {
      result.potentialDuplicates.push({
        type: "placeId",
        value: pid,
        titles,
        count: titles.length,
      });
    }
  });

  coordMap.forEach((titles, coords) => {
    if (titles.length > 1) {
      result.potentialDuplicates.push({
        type: "coordinates",
        value: coords,
        titles,
        count: titles.length,
      });
    }
  });

  // Calculate shared addresses
  addressMap.forEach((titles, addr) => {
    if (titles.length > 1) {
      result.sharedAddresses.push({
        address: addr,
        titles,
        count: titles.length,
      });
    }
  });

  // Schema differences against reference keys
  if (referenceKeys.length > 0) {
    const cityKeysList = Array.from(allRecordKeys);
    result.extraFields = cityKeysList.filter((k) => !referenceKeys.includes(k)).sort();
    result.missingReferenceFields = referenceKeys.filter((k) => !cityKeysList.includes(k)).sort();
  }

  return result;
}

export function validateAllRawDatasets(rawDir: string): {
  results: RawDatasetValidationResult[];
  referenceSha256Matches: boolean;
  allValid: boolean;
} {
  const cities = [
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

  const torontoPath = path.join(rawDir, "toronto.json");
  if (!fs.existsSync(torontoPath)) {
    throw new Error(`Reference dataset missing at: ${torontoPath}`);
  }

  const torontoBuffer = fs.readFileSync(torontoPath);
  const torontoSha = computeSha256(torontoBuffer);
  const referenceSha256Matches = torontoSha.toLowerCase() === TORONTO_EXPECTED_SHA256.toLowerCase();

  const torontoJson = JSON.parse(torontoBuffer.toString("utf8"));
  const referenceKeys = Array.isArray(torontoJson) && torontoJson.length > 0
    ? Object.keys(torontoJson[0]).sort()
    : [];

  const results: RawDatasetValidationResult[] = [];
  let allValid = referenceSha256Matches;

  for (const city of cities) {
    const filePath = path.join(rawDir, `${city}.json`);
    if (!fs.existsSync(filePath)) {
      results.push({
        city,
        file: `${city}.json`,
        isValidJson: false,
        isArray: false,
        recordCount: 0,
        fileSize: 0,
        sha256: "",
        validObjectsCount: 0,
        errors: [`File missing: ${filePath}`],
        warnings: [],
        potentialDuplicates: [],
        sharedAddresses: [],
        coordinateAnomalies: [],
        missingFieldsStats: { noPhone: 0, noWebsite: 0, noOpeningHours: 0, noPlaceId: 0, noRating: 0, noPostalCode: 0 },
        extraFields: [],
        missingReferenceFields: [],
      });
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const val = validateRawDatasetContent(city, content, referenceKeys);
    if (val.errors.length > 0) {
      allValid = false;
    }
    results.push(val);
  }

  return { results, referenceSha256Matches, allValid };
}

// CLI Execution if run directly
if (require.main === module || (typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("validate-raw-datasets.ts"))) {
  const rawDir = path.resolve(__dirname, "..", "src", "data", "raw");
  console.log("==================================================");
  console.log("Canada Mosque Near Me — Raw Datasets Validator");
  console.log("==================================================");
  console.log(`Auditing directory: ${rawDir}\n`);

  try {
    const { results, referenceSha256Matches, allValid } = validateAllRawDatasets(rawDir);

    console.log(`Toronto SHA-256 Check: ${referenceSha256Matches ? "PASS (UNCHANGED)" : "FAIL (HASH MISMATCH)"}`);
    console.log(`Expected: ${TORONTO_EXPECTED_SHA256}`);
    const torontoResult = results.find((r) => r.city === "toronto");
    console.log(`Actual:   ${torontoResult?.sha256 || "N/A"}\n`);

    console.log("City Datasets Audit Summary:");
    console.log("--------------------------------------------------");
    for (const r of results) {
      const statusStr = r.errors.length === 0 ? "VALID" : "INVALID";
      console.log(
        `${r.city.toUpperCase().padEnd(12)}: ${r.recordCount.toString().padStart(3)} records | ${statusStr} | Errors: ${r.errors.length} | Warnings: ${r.warnings.length} | DupCoords: ${r.potentialDuplicates.filter(d => d.type === 'coordinates').length} | SharedAddrs: ${r.sharedAddresses.length}`
      );
      if (r.coordinateAnomalies.length > 0) {
        console.log(`  - Geo Anomalies: ${r.coordinateAnomalies.map(a => `${a.title} (${a.lat}, ${a.lng})`).join("; ")}`);
      }
      if (r.errors.length > 0) {
        r.errors.forEach(e => console.log(`  [ERROR] ${e}`));
      }
    }

    console.log("--------------------------------------------------");
    console.log(`Overall Validation Status: ${allValid ? "ALL PASS" : "FAILURES DETECTED"}`);
    if (!allValid) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Validator crashed:", (err as Error).message);
    process.exit(1);
  }
}
