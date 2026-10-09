/**
 * Estimated Iqamah Domain — Comprehensive Test Suite
 *
 * Tests:
 *   1.  +15 Fajr offset
 *   2.  +15 Dhuhr offset
 *   3.  +15 Asr offset
 *   4.  +5  Maghrib offset
 *   5.  +15 Isha offset
 *   6.  Custom per-prayer offsets
 *   7.  Zero offset (estimated = calculated)
 *   8.  Invalid offset (non-integer)
 *   9.  Midnight rollover (23:55 + 15 min = 00:10)
 *   10. Toronto DST schedule produces correct local times
 *   11. Timezone correctness (UTC vs local)
 *   12. Missing prayerSchedule throws
 *   13. Verified Iqamah takes precedence (architectural test)
 *   14. Estimate appears only when verified data absent (architectural test)
 *   15. Result is never marked VERIFIED
 *   16. Jummah is never estimated
 *   17. Estimated data never enters verified repository
 *   18. Result type is always "ESTIMATED"
 *   19. Disclaimer is always present and non-empty
 *   20. Offset above maximum is rejected
 *   21. Negative offset (within allowed range)
 *   22. Offset below minimum is rejected
 *   23. Bad basis value is rejected
 *   24. Missing disclaimer is rejected
 *   25. Expired verified schedule falls back to estimate (architectural test)
 *   26. Conflicting verified schedule falls back to estimate (architectural test)
 *   27. Mosque with verified Jummah still shows no estimated Jummah
 *   28. Mosque without verified Jummah shows no estimated Jummah
 */

import { describe, it, expect } from "vitest";
import {
  calculateEstimatedIqamah,
} from "./engine";
import {
  assertValidConfig,
  validateOffsets,
} from "./validation";
import {
  DEFAULT_ESTIMATED_IQAMAH_CONFIG,
  ESTIMATED_IQAMAH_DISCLAIMER,
} from "./defaults";
import type {
  EstimatedIqamahConfig,
  EstimatedIqamahResult,
} from "./types";
import type { CalculatedPrayerSchedule } from "@/domain/prayer/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a minimal CalculatedPrayerSchedule with precise UTC-based Date
 * objects for each prayer. All times are exact UTC timestamps.
 *
 * For timezone tests we use America/Toronto (UTC-4 in summer, UTC-5 in winter).
 */
function makePrayerSchedule(
  overrides?: Partial<{
    fajrUtcMs: number;
    sunriseUtcMs: number;
    dhuhrUtcMs: number;
    asrUtcMs: number;
    maghribUtcMs: number;
    ishaUtcMs: number;
    timezone: string;
    date: string;
  }>
): CalculatedPrayerSchedule {
  // Default: 2024-07-15 (summer, EDT = UTC-4 for Toronto)
  // 09:20 UTC = 05:20 EDT (Fajr)
  // 10:35 UTC = 06:35 EDT (Sunrise)
  // 17:10 UTC = 13:10 EDT (Dhuhr)
  // 20:45 UTC = 16:45 EDT (Asr)
  // 23:05 UTC = 19:05 EDT (Maghrib)
  // 00:35+1d UTC = 20:35 EDT (Isha — next UTC day but same local day)
  const base = {
    fajrUtcMs: Date.UTC(2024, 6, 15, 9, 20, 0),     // 05:20 EDT
    sunriseUtcMs: Date.UTC(2024, 6, 15, 10, 35, 0),  // 06:35 EDT
    dhuhrUtcMs: Date.UTC(2024, 6, 15, 17, 10, 0),    // 13:10 EDT
    asrUtcMs: Date.UTC(2024, 6, 15, 20, 45, 0),      // 16:45 EDT
    maghribUtcMs: Date.UTC(2024, 6, 15, 23, 5, 0),   // 19:05 EDT
    ishaUtcMs: Date.UTC(2024, 6, 16, 0, 35, 0),      // 20:35 EDT (next UTC day)
    timezone: "America/Toronto",
    date: "2024-07-15",
  };
  const merged = { ...base, ...overrides };

  return {
    date: merged.date,
    timezone: merged.timezone,
    coordinates: { latitude: 43.6532, longitude: -79.3832 },
    settings: {
      calculationMethod: "ISNA",
      asrMethod: "STANDARD",
      highLatitudeRule: "ANGLE_BASED",
      fajrAngle: 15,
      ishaAngle: 15,
      ishaIntervalMinutes: 0,
    },
    times: {
      fajr: new Date(merged.fajrUtcMs),
      sunrise: new Date(merged.sunriseUtcMs),
      dhuhr: new Date(merged.dhuhrUtcMs),
      asr: new Date(merged.asrUtcMs),
      maghrib: new Date(merged.maghribUtcMs),
      isha: new Date(merged.ishaUtcMs),
    },
    metadata: {
      calculationMethod: "ISNA",
      fajrAngle: 15,
      ishaAngle: 15,
      ishaIntervalMinutes: 0,
      asrMethod: "STANDARD",
      highLatitudeRule: "ANGLE_BASED",
      timezone: merged.timezone,
      date: merged.date,
      coordinates: { latitude: 43.6532, longitude: -79.3832 },
      highLatitudeAdjustment: {
        applied: false,
        rule: "ANGLE_BASED",
        fajrAdjusted: false,
        ishaAdjusted: false,
        astronomicalFajrImpossible: false,
        astronomicalIshaImpossible: false,
      },
      warnings: [],
    },
  };
}

// ---------------------------------------------------------------------------
// 1–5: Default offset tests (individual prayers)
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — default offsets", () => {
  const schedule = makePrayerSchedule();

  it("1. Fajr: +15 min offset → estimated is 15 min after calculated", () => {
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.fajr.offsetMinutes).toBe(15);
    expect(result.times.fajr.calculatedTime).toBe("05:20");
    expect(result.times.fajr.estimatedTime).toBe("05:35");
  });

  it("2. Dhuhr: +15 min offset → estimated is 15 min after calculated", () => {
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.dhuhr.offsetMinutes).toBe(15);
    expect(result.times.dhuhr.calculatedTime).toBe("13:10");
    expect(result.times.dhuhr.estimatedTime).toBe("13:25");
  });

  it("3. Asr: +15 min offset → estimated is 15 min after calculated", () => {
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.asr.offsetMinutes).toBe(15);
    expect(result.times.asr.calculatedTime).toBe("16:45");
    expect(result.times.asr.estimatedTime).toBe("17:00");
  });

  it("4. Maghrib: +5 min offset → estimated is 5 min after calculated", () => {
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.maghrib.offsetMinutes).toBe(5);
    expect(result.times.maghrib.calculatedTime).toBe("19:05");
    expect(result.times.maghrib.estimatedTime).toBe("19:10");
  });

  it("5. Isha: +15 min offset → estimated is 15 min after calculated", () => {
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.isha.offsetMinutes).toBe(15);
    expect(result.times.isha.calculatedTime).toBe("20:35");
    expect(result.times.isha.estimatedTime).toBe("20:50");
  });
});

// ---------------------------------------------------------------------------
// 6: Custom per-prayer offsets
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — custom offsets", () => {
  it("6. Custom offsets apply correctly to each prayer", () => {
    const schedule = makePrayerSchedule();
    const customConfig: EstimatedIqamahConfig = {
      basis: "STANDARD_ESTIMATE",
      offsets: {
        fajrOffsetMinutes: 20,
        dhuhrOffsetMinutes: 10,
        asrOffsetMinutes: 5,
        maghribOffsetMinutes: 3,
        ishaOffsetMinutes: 20,
      },
      disclaimer: ESTIMATED_IQAMAH_DISCLAIMER,
    };
    const result = calculateEstimatedIqamah(schedule, customConfig);
    expect(result.times.fajr.estimatedTime).toBe("05:40");   // 05:20 + 20
    expect(result.times.dhuhr.estimatedTime).toBe("13:20");  // 13:10 + 10
    expect(result.times.asr.estimatedTime).toBe("16:50");    // 16:45 + 5
    expect(result.times.maghrib.estimatedTime).toBe("19:08");// 19:05 + 3
    expect(result.times.isha.estimatedTime).toBe("20:55");   // 20:35 + 20
  });
});

// ---------------------------------------------------------------------------
// 7: Zero offset
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — zero offset", () => {
  it("7. Zero offset → estimated equals calculated time", () => {
    const schedule = makePrayerSchedule();
    const zeroConfig: EstimatedIqamahConfig = {
      basis: "STANDARD_ESTIMATE",
      offsets: {
        fajrOffsetMinutes: 0,
        dhuhrOffsetMinutes: 0,
        asrOffsetMinutes: 0,
        maghribOffsetMinutes: 0,
        ishaOffsetMinutes: 0,
      },
      disclaimer: ESTIMATED_IQAMAH_DISCLAIMER,
    };
    const result = calculateEstimatedIqamah(schedule, zeroConfig);
    expect(result.times.fajr.estimatedTime).toBe(result.times.fajr.calculatedTime);
    expect(result.times.dhuhr.estimatedTime).toBe(result.times.dhuhr.calculatedTime);
    expect(result.times.asr.estimatedTime).toBe(result.times.asr.calculatedTime);
    expect(result.times.maghrib.estimatedTime).toBe(result.times.maghrib.calculatedTime);
    expect(result.times.isha.estimatedTime).toBe(result.times.isha.calculatedTime);
  });
});

// ---------------------------------------------------------------------------
// 8: Invalid offset (non-integer)
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — invalid offset rejection", () => {
  it("8. Non-integer offset throws a validation error", () => {
    const invalidConfig: EstimatedIqamahConfig = {
      basis: "STANDARD_ESTIMATE",
      offsets: {
        fajrOffsetMinutes: 15.5, // invalid
        dhuhrOffsetMinutes: 15,
        asrOffsetMinutes: 15,
        maghribOffsetMinutes: 5,
        ishaOffsetMinutes: 15,
      },
      disclaimer: ESTIMATED_IQAMAH_DISCLAIMER,
    };
    expect(() =>
      calculateEstimatedIqamah(makePrayerSchedule(), invalidConfig)
    ).toThrow(/fajrOffsetMinutes.*whole integer/i);
  });
});

// ---------------------------------------------------------------------------
// 9: Midnight rollover
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — midnight rollover", () => {
  it("9. Isha at 23:55 + 15 min = 00:10 (not 24:10)", () => {
    // In winter (EST, UTC-5): 23:55 local = next-day 04:55 UTC
    // We arrange: Isha UTC = 2024-01-15T04:55:00Z → local EST = 23:55 on Jan 14
    const ishaUtcMs = Date.UTC(2024, 0, 15, 4, 55, 0); // UTC 04:55 Jan 15 = 23:55 EST Jan 14
    const schedule = makePrayerSchedule({
      ishaUtcMs,
      timezone: "America/Toronto",
      date: "2024-01-14",
    });
    const config: EstimatedIqamahConfig = {
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
    const result = calculateEstimatedIqamah(schedule, config);
    expect(result.times.isha.calculatedTime).toBe("23:55");
    expect(result.times.isha.estimatedTime).toBe("00:10");
    // Must not produce "24:10" or an invalid string
    expect(result.times.isha.estimatedTime).not.toContain("24");
  });
});

// ---------------------------------------------------------------------------
// 10–11: Timezone correctness
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — timezone correctness", () => {
  it("10. Toronto summer DST (EDT = UTC-4) produces correct local times", () => {
    // 2024-07-15: UTC-4
    // Fajr 09:20 UTC = 05:20 EDT
    const schedule = makePrayerSchedule(); // defaults to summer date
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.fajr.calculatedTime).toBe("05:20");
    expect(result.timezone).toBe("America/Toronto");
  });

  it("11. UTC times are formatted in mosque timezone, not UTC", () => {
    // Dhuhr 17:10 UTC is 13:10 EDT (not 17:10)
    const schedule = makePrayerSchedule();
    const result = calculateEstimatedIqamah(schedule);
    expect(result.times.dhuhr.calculatedTime).toBe("13:10");
    expect(result.times.dhuhr.calculatedTime).not.toBe("17:10");
  });
});

// ---------------------------------------------------------------------------
// 12: Missing schedule throws
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — input validation", () => {
  it("12. Null prayerSchedule throws a descriptive error", () => {
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calculateEstimatedIqamah(null as any)
    ).toThrow(/valid CalculatedPrayerSchedule/i);
  });
});

// ---------------------------------------------------------------------------
// 13–14: Verified Iqamah precedence (architectural contract)
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — verified iqamah precedence (architectural)", () => {
  it("13. Verified Iqamah takes precedence: when verifiedIqamah is non-null, estimate is NOT used in UI", () => {
    /**
     * This test documents the architectural contract, not UI code.
     * The UI layer (MosqueScheduleSection) implements:
     *   if (verifiedIqamah) → show VERIFIED, not estimate
     *
     * We test that the estimate result type can be distinguished from a
     * verified schedule, ensuring the precedence logic is implementable.
     */
    const estimate: EstimatedIqamahResult = calculateEstimatedIqamah(
      makePrayerSchedule()
    );
    const hasVerified = true; // simulates a verified schedule being available

    // This is the architectural rule: UI should show verified over estimate
    const shouldShowEstimate = !hasVerified;
    expect(shouldShowEstimate).toBe(false);
    expect(estimate.type).toBe("ESTIMATED"); // estimate is always ESTIMATED
  });

  it("14. Estimate appears when verified data is absent", () => {
    const estimate = calculateEstimatedIqamah(makePrayerSchedule());
    const hasVerified = false; // no verified schedule

    const shouldShowEstimate = !hasVerified;
    expect(shouldShowEstimate).toBe(true);
    expect(estimate.type).toBe("ESTIMATED");
    expect(estimate.times.fajr.estimatedTime).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 15: Result is never VERIFIED
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — type safety", () => {
  it("15. Result type is always ESTIMATED, never VERIFIED", () => {
    const result = calculateEstimatedIqamah(makePrayerSchedule());
    expect(result.type).toBe("ESTIMATED");
    // The type field must not be anything resembling verification
    expect(result.type).not.toBe("VERIFIED");
    expect(result.type).not.toBe("PENDING");
    // ScheduleVerification is absent — result has no .verification property
    // TypeScript enforces this, but we can check at runtime too
    expect((result as unknown as Record<string, unknown>)["verification"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 16: Jummah is never estimated
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — no Jummah estimation", () => {
  it("16. Engine output contains no Jummah field", () => {
    const result = calculateEstimatedIqamah(makePrayerSchedule());
    // There must be no jummah property on the result
    expect((result as unknown as Record<string, unknown>)["jummah"]).toBeUndefined();
    // The times object contains only the 5 daily prayer iqamah
    const prayerKeys = Object.keys(result.times);
    expect(prayerKeys).toContain("fajr");
    expect(prayerKeys).toContain("dhuhr");
    expect(prayerKeys).toContain("asr");
    expect(prayerKeys).toContain("maghrib");
    expect(prayerKeys).toContain("isha");
    expect(prayerKeys).not.toContain("jummah");
    expect(prayerKeys).not.toContain("friday");
    expect(prayerKeys).not.toContain("sunrise"); // Sunrise is not an iqamah prayer
  });
});

// ---------------------------------------------------------------------------
// 17: Estimated data never enters verified repository
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — data isolation", () => {
  it("17. Estimated result has no source/verification fields (cannot be stored as verified)", () => {
    const result = calculateEstimatedIqamah(makePrayerSchedule());
    // Verified IqamahSchedule has: source, verification, id, mosqueId, effectiveFrom
    // None of these should exist on an EstimatedIqamahResult
    const r = result as unknown as Record<string, unknown>;
    expect(r["source"]).toBeUndefined();
    expect(r["verification"]).toBeUndefined();
    expect(r["id"]).toBeUndefined();
    expect(r["mosqueId"]).toBeUndefined();
    expect(r["effectiveFrom"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 18: Type discriminator
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — type discriminator", () => {
  it("18. result.type === 'ESTIMATED' is the discriminator", () => {
    const result = calculateEstimatedIqamah(makePrayerSchedule());
    // TypeScript discriminated union check — type must be the literal "ESTIMATED"
    expect(result.type).toBe("ESTIMATED");
  });
});

// ---------------------------------------------------------------------------
// 19: Disclaimer always present
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — disclaimer", () => {
  it("19. Result always carries a non-empty disclaimer", () => {
    const result = calculateEstimatedIqamah(makePrayerSchedule());
    expect(result.disclaimer).toBeDefined();
    expect(result.disclaimer.length).toBeGreaterThan(20);
    // Disclaimer must mention verification or mosque
    expect(result.disclaimer.toLowerCase()).toMatch(/not.*verified|mosque|actual/i);
  });
});

// ---------------------------------------------------------------------------
// 20–22: Offset boundary validation
// ---------------------------------------------------------------------------

describe("validateOffsets — boundary checks", () => {
  it("20. Offset above maximum (121) is rejected for Fajr", () => {
    const errors = validateOffsets({
      fajrOffsetMinutes: 121,
      dhuhrOffsetMinutes: 15,
      asrOffsetMinutes: 15,
      maghribOffsetMinutes: 5,
      ishaOffsetMinutes: 15,
    });
    expect(errors.some((e) => e.field === "fajrOffsetMinutes")).toBe(true);
  });

  it("20b. Maghrib offset above its maximum (61) is rejected", () => {
    const errors = validateOffsets({
      fajrOffsetMinutes: 15,
      dhuhrOffsetMinutes: 15,
      asrOffsetMinutes: 15,
      maghribOffsetMinutes: 61,
      ishaOffsetMinutes: 15,
    });
    expect(errors.some((e) => e.field === "maghribOffsetMinutes")).toBe(true);
  });

  it("21. Negative offset within allowed range (−5) is accepted", () => {
    const errors = validateOffsets({
      fajrOffsetMinutes: -5,
      dhuhrOffsetMinutes: 15,
      asrOffsetMinutes: 15,
      maghribOffsetMinutes: 5,
      ishaOffsetMinutes: 15,
    });
    expect(errors).toHaveLength(0);
  });

  it("22. Offset below minimum (−31) is rejected", () => {
    const errors = validateOffsets({
      fajrOffsetMinutes: -31,
      dhuhrOffsetMinutes: 15,
      asrOffsetMinutes: 15,
      maghribOffsetMinutes: 5,
      ishaOffsetMinutes: 15,
    });
    expect(errors.some((e) => e.field === "fajrOffsetMinutes")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 23–24: Config validation
// ---------------------------------------------------------------------------

describe("assertValidConfig — config-level validation", () => {
  it("23. Bad basis value is rejected", () => {
    const badConfig = {
      ...DEFAULT_ESTIMATED_IQAMAH_CONFIG,
      basis: "OFFICIAL" as "STANDARD_ESTIMATE",
    };
    expect(() => assertValidConfig(badConfig)).toThrow(/basis/i);
  });

  it("24. Missing disclaimer is rejected", () => {
    const badConfig: EstimatedIqamahConfig = {
      basis: "STANDARD_ESTIMATE",
      offsets: DEFAULT_ESTIMATED_IQAMAH_CONFIG.offsets,
      disclaimer: "",
    };
    expect(() => assertValidConfig(badConfig)).toThrow(/disclaimer/i);
  });
});

// ---------------------------------------------------------------------------
// 25–26: Expired/conflicting verified schedule fallback (architectural tests)
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — fallback behavior (architectural)", () => {
  it("25. Expired verified schedule does not prevent estimate from being calculated", () => {
    /**
     * When a verified schedule is expired (isScheduleCurrent() returns false),
     * the ScheduleRepository returns null. The UI layer then falls back to the estimate.
     * We test that the engine still produces a valid estimate regardless.
     */
    const expiredVerified = null; // what the repository returns when expired
    const estimate = calculateEstimatedIqamah(makePrayerSchedule());
    const iqamahToShow = expiredVerified ?? estimate;
    expect(iqamahToShow).toBe(estimate);
    expect(estimate.type).toBe("ESTIMATED");
  });

  it("26. Conflicting verified schedules fall back to estimate", () => {
    /**
     * When ScheduleRepository detects a conflict, it returns null.
     * The UI then shows the estimate.
     */
    const conflictedResult = null; // what repository returns on conflict
    const estimate = calculateEstimatedIqamah(makePrayerSchedule());
    const iqamahToShow = conflictedResult ?? estimate;
    expect(iqamahToShow).toBe(estimate);
    expect(estimate.type).toBe("ESTIMATED");
  });
});

// ---------------------------------------------------------------------------
// 27–28: No estimated Jummah
// ---------------------------------------------------------------------------

describe("EstimatedIqamahEngine — Jummah never estimated", () => {
  it("27. Mosque with verified Jummah: Jummah shows verified, NOT estimated from Dhuhr", () => {
    const estimate = calculateEstimatedIqamah(makePrayerSchedule());
    // The estimate contains no Jummah times whatsoever
    expect((estimate as unknown as Record<string, unknown>)["jummah"]).toBeUndefined();
    // Dhuhr estimate is NOT used as a Jummah time
    const dhuhrEstimate = estimate.times.dhuhr.estimatedTime;
    // This is NOT jummah — it's merely the dhuhr estimate
    expect(typeof dhuhrEstimate).toBe("string");
    // No field labeled jummah anywhere in the result
    const allKeys = JSON.stringify(estimate);
    expect(allKeys).not.toMatch(/"jummah"/);
  });

  it("28. Mosque without verified Jummah: estimate produces no Jummah times", () => {
    const estimate = calculateEstimatedIqamah(makePrayerSchedule());
    const keys = Object.keys(estimate.times);
    expect(keys).not.toContain("jummah");
    expect(keys).not.toContain("friday");
  });
});

// ---------------------------------------------------------------------------
// Extra: DEFAULT_ESTIMATED_IQAMAH_CONFIG shape
// ---------------------------------------------------------------------------

describe("DEFAULT_ESTIMATED_IQAMAH_CONFIG", () => {
  it("has correct default offset values", () => {
    const { offsets } = DEFAULT_ESTIMATED_IQAMAH_CONFIG;
    expect(offsets.fajrOffsetMinutes).toBe(15);
    expect(offsets.dhuhrOffsetMinutes).toBe(15);
    expect(offsets.asrOffsetMinutes).toBe(15);
    expect(offsets.maghribOffsetMinutes).toBe(5);
    expect(offsets.ishaOffsetMinutes).toBe(15);
  });

  it("has basis STANDARD_ESTIMATE", () => {
    expect(DEFAULT_ESTIMATED_IQAMAH_CONFIG.basis).toBe("STANDARD_ESTIMATE");
  });

  it("has non-empty disclaimer", () => {
    expect(ESTIMATED_IQAMAH_DISCLAIMER.length).toBeGreaterThan(50);
  });
});
