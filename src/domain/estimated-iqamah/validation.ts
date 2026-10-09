/**
 * Estimated Iqamah Validation
 *
 * Validates EstimatedIqamahConfig before use in the engine.
 * Ensures offsets are safe integers within sensible bounds.
 * Prevents nonsensical configurations from silently producing bad results.
 */

import { EstimatedIqamahConfig, IqamahOffsetConfig } from "./types";

/**
 * Maximum allowed offset per prayer (minutes).
 * An offset above this threshold would produce an estimate far past the
 * next prayer, which indicates a configuration error.
 */
const MAX_FAJR_DHUHR_ASR_ISHA_OFFSET = 120;
const MAX_MAGHRIB_OFFSET = 60;

/**
 * Minimum allowed offset per prayer (minutes).
 * Negative offsets are technically supported but unusual.
 * We allow small negative values (e.g., -5) but prevent extreme ones
 * that would place estimated Iqamah before the adhan.
 * The minimum is documented so callers know it is intentional.
 */
const MIN_OFFSET = -30;

export interface OffsetValidationError {
  field: string;
  message: string;
}

/**
 * Validates a single offset value.
 * Returns an error object or null if valid.
 */
function validateSingleOffset(
  field: keyof IqamahOffsetConfig,
  value: number,
  max: number
): OffsetValidationError | null {
  if (typeof value !== "number" || !isFinite(value)) {
    return { field, message: `${field} must be a finite number.` };
  }
  if (!Number.isInteger(value)) {
    return {
      field,
      message: `${field} must be a whole integer (no fractional minutes). Got: ${value}.`,
    };
  }
  if (value < MIN_OFFSET) {
    return {
      field,
      message: `${field} is ${value}, which is below the minimum allowed offset of ${MIN_OFFSET} minutes.`,
    };
  }
  if (value > max) {
    return {
      field,
      message: `${field} is ${value}, which exceeds the maximum allowed offset of ${max} minutes.`,
    };
  }
  return null;
}

/**
 * Validates an IqamahOffsetConfig object.
 * Returns a list of all validation errors, or an empty array if valid.
 */
export function validateOffsets(
  offsets: IqamahOffsetConfig
): OffsetValidationError[] {
  const errors: OffsetValidationError[] = [];

  const checks: [keyof IqamahOffsetConfig, number][] = [
    ["fajrOffsetMinutes", MAX_FAJR_DHUHR_ASR_ISHA_OFFSET],
    ["dhuhrOffsetMinutes", MAX_FAJR_DHUHR_ASR_ISHA_OFFSET],
    ["asrOffsetMinutes", MAX_FAJR_DHUHR_ASR_ISHA_OFFSET],
    ["maghribOffsetMinutes", MAX_MAGHRIB_OFFSET],
    ["ishaOffsetMinutes", MAX_FAJR_DHUHR_ASR_ISHA_OFFSET],
  ];

  for (const [field, max] of checks) {
    const err = validateSingleOffset(field, offsets[field], max);
    if (err) errors.push(err);
  }

  return errors;
}

/**
 * Validates a full EstimatedIqamahConfig.
 * Throws a descriptive error if invalid.
 */
export function assertValidConfig(config: EstimatedIqamahConfig): void {
  if (!config) {
    throw new Error("EstimatedIqamahConfig must not be null or undefined.");
  }
  if (config.basis !== "STANDARD_ESTIMATE") {
    throw new Error(
      `Invalid EstimatedIqamahConfig basis "${config.basis}". Only "STANDARD_ESTIMATE" is supported.`
    );
  }
  if (!config.offsets) {
    throw new Error("EstimatedIqamahConfig.offsets must not be null or undefined.");
  }
  if (!config.disclaimer || config.disclaimer.trim().length === 0) {
    throw new Error(
      "EstimatedIqamahConfig.disclaimer must be a non-empty string."
    );
  }

  const errors = validateOffsets(config.offsets);
  if (errors.length > 0) {
    const msg = errors.map((e) => `  - ${e.message}`).join("\n");
    throw new Error(`EstimatedIqamahConfig has invalid offsets:\n${msg}`);
  }
}
