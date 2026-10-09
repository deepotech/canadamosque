/**
 * Default Estimated Iqamah Configuration
 *
 * IMPORTANT DOCUMENTATION:
 *
 * These are DEFAULT ESTIMATION PARAMETERS only.
 *
 * They are NOT:
 *   - An official Canadian mosque standard
 *   - A Toronto mosque norm or rule
 *   - A verified congregation schedule for any specific mosque
 *   - A claim about what any real mosque actually does
 *
 * Why these particular values?
 * These offsets represent a reasonable working default for estimation
 * when no verified data exists. They are configurable and can be changed
 * without modifying calculation logic. Any mosque may differ substantially
 * from these estimates.
 *
 * Maghrib offset is shorter (5 min) because Maghrib congregation typically
 * follows the adhan more quickly than other prayers.
 *
 * These values are estimation parameters, not factual mosque data.
 */

import { EstimatedIqamahConfig } from "./types";

/**
 * Standard disclaimer text. Must be shown to users whenever estimated
 * Iqamah times are displayed.
 */
export const ESTIMATED_IQAMAH_DISCLAIMER =
  "These are estimated congregation times calculated from the astronomical prayer times using configurable time offsets. They have not been verified with this mosque. Actual mosque congregation times may differ significantly.";

/**
 * Default estimation configuration.
 *
 * Fajr:    +15 minutes after calculated Fajr
 * Dhuhr:   +15 minutes after calculated Dhuhr
 * Asr:     +15 minutes after calculated Asr
 * Maghrib: +5  minutes after calculated Maghrib
 * Isha:    +15 minutes after calculated Isha
 *
 * These are configured estimation parameters.
 * They do NOT reflect any specific mosque's actual practice.
 */
export const DEFAULT_ESTIMATED_IQAMAH_CONFIG: EstimatedIqamahConfig = {
  basis: "STANDARD_ESTIMATE",
  offsets: {
    fajrOffsetMinutes: 15,
    dhuhrOffsetMinutes: 15,
    asrOffsetMinutes: 15,
    maghribOffsetMinutes: 5,
    ishaOffsetMinutes: 15,
  },
  disclaimer: ESTIMATED_IQAMAH_DISCLAIMER,
};
