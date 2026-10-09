import { RawGooglePlaceRecord } from "@/domain/ingestion/raw-record";

export interface RawValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRawRecord(record: unknown, index: number): RawValidationResult {
  const errors: string[] = [];

  if (!record || typeof record !== "object") {
    return {
      isValid: false,
      errors: [`Record at index ${index} is not a valid object`],
    };
  }

  const raw = record as RawGooglePlaceRecord;

  if (!raw.title || typeof raw.title !== "string" || !raw.title.trim()) {
    errors.push(`Record at index ${index} is missing a title`);
  }

  if (!raw.address || typeof raw.address !== "string" || !raw.address.trim()) {
    errors.push(`Record at index ${index} is missing an address`);
  }

  if (
    !raw.location ||
    typeof raw.location.lat !== "number" ||
    Number.isNaN(raw.location.lat) ||
    typeof raw.location.lng !== "number" ||
    Number.isNaN(raw.location.lng)
  ) {
    errors.push(`Record at index ${index} has missing or invalid coordinates`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
