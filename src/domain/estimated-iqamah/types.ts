/**
 * Estimated Iqamah Domain Types
 *
 * ARCHITECTURAL BOUNDARY:
 * This module is strictly separate from the Verified Iqamah domain.
 *
 * An EstimatedIqamahConfig is NOT an IqamahSchedule.
 * An EstimatedIqamahResult is NOT a verified congregation time.
 * Estimated data must NEVER be written to src/data/toronto/iqamah/verified.json.
 * Estimated values must NEVER carry a ScheduleVerification or be marked VERIFIED.
 *
 * The only purpose of this domain is to provide a clearly-labelled,
 * configurable convenience estimate when verified mosque-specific Iqamah
 * data is unavailable.
 *
 * DOMAIN HIERARCHY:
 *   1. Verified Mosque Iqamah  → authoritative (src/domain/iqamah, src/domain/schedule)
 *   2. Estimated Iqamah        → convenience estimate (this domain)
 *   3. No Iqamah data          → honest empty state
 *
 * Jummah is NOT estimated. There is no estimated Jummah layer.
 */

/**
 * Basis identifier for estimated Iqamah.
 * STANDARD_ESTIMATE indicates a configured-offset calculation — not a
 * mosque-specific or officially recognised rule.
 */
export type EstimatedIqamahBasis = "STANDARD_ESTIMATE";

/**
 * Per-prayer offset configuration in whole minutes.
 *
 * Each offset is the number of minutes added to the corresponding
 * calculated astronomical prayer time to produce the estimate.
 *
 * IMPORTANT: These offsets are configurable estimation parameters only.
 * They do NOT represent:
 *   - An official mosque rule
 *   - A Canadian mosque standard
 *   - A Toronto mosque norm
 *   - Any verified congregation schedule
 *
 * Different mosques set their own congregation times. Individual mosques
 * can differ significantly from any estimate.
 *
 * Sunrise is excluded because Sunrise is not a prayed Iqamah.
 */
export interface IqamahOffsetConfig {
  /** Minutes after calculated Fajr. Must be a non-negative integer ≤ 120. */
  fajrOffsetMinutes: number;
  /** Minutes after calculated Dhuhr. Must be a non-negative integer ≤ 120. */
  dhuhrOffsetMinutes: number;
  /** Minutes after calculated Asr. Must be a non-negative integer ≤ 120. */
  asrOffsetMinutes: number;
  /**
   * Minutes after calculated Maghrib. Must be a non-negative integer ≤ 60.
   * Typically smaller because Maghrib congregation often follows adhan quickly.
   */
  maghribOffsetMinutes: number;
  /** Minutes after calculated Isha. Must be a non-negative integer ≤ 120. */
  ishaOffsetMinutes: number;
}

/**
 * Full Estimated Iqamah configuration object.
 *
 * This is the configuration input to the estimation engine.
 * It explicitly documents its nature (STANDARD_ESTIMATE) and carries
 * a required disclaimer that must be surfaced in the UI.
 */
export interface EstimatedIqamahConfig {
  /**
   * The calculation basis.
   * Always STANDARD_ESTIMATE — never VERIFIED, OFFICIAL, or similar.
   */
  readonly basis: EstimatedIqamahBasis;

  /**
   * Per-prayer time offsets in minutes.
   */
  readonly offsets: IqamahOffsetConfig;

  /**
   * Human-readable disclaimer that MUST be displayed alongside any estimate.
   * The UI must never hide this text.
   */
  readonly disclaimer: string;
}

/**
 * A single estimated Iqamah entry for one prayer.
 */
export interface EstimatedIqamahEntry {
  /** Prayer name */
  prayer: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  /** Calculated astronomical time in HH:mm (24-hour) local timezone */
  calculatedTime: string;
  /** Estimated Iqamah time in HH:mm (24-hour) local timezone, after offset applied */
  estimatedTime: string;
  /** The configured offset that was applied (minutes) */
  offsetMinutes: number;
}

/**
 * Full result from the Estimated Iqamah engine for a specific mosque and date.
 *
 * This result is NEVER to be stored in verified.json or treated as authoritative.
 * It is a transient, calculated convenience value.
 */
export interface EstimatedIqamahResult {
  /**
   * Always "ESTIMATED" — distinct from IqamahSchedule which has verification.
   * This field makes it impossible to confuse an estimate with a verified record.
   */
  readonly type: "ESTIMATED";

  /** Calculation basis */
  readonly basis: EstimatedIqamahBasis;

  /**
   * The date for which the estimate applies, in YYYY-MM-DD format.
   * Derived from the underlying calculated prayer schedule.
   */
  readonly date: string;

  /**
   * The IANA timezone used for local time formatting.
   * Must match the mosque's timezone.
   */
  readonly timezone: string;

  /**
   * Coordinates used for the underlying prayer calculation.
   */
  readonly coordinates: {
    latitude: number;
    longitude: number;
  };

  /**
   * Per-prayer estimates. Fajr, Dhuhr, Asr, Maghrib, Isha only.
   * Sunrise is excluded.
   */
  readonly times: {
    fajr: EstimatedIqamahEntry;
    dhuhr: EstimatedIqamahEntry;
    asr: EstimatedIqamahEntry;
    maghrib: EstimatedIqamahEntry;
    isha: EstimatedIqamahEntry;
  };

  /**
   * The offsets configuration that produced this result.
   * Retained for UI transparency and audit.
   */
  readonly offsets: IqamahOffsetConfig;

  /**
   * The disclaimer text that MUST be shown to users.
   */
  readonly disclaimer: string;
}
