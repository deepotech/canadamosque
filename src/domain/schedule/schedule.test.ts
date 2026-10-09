import { describe, it, expect } from "vitest";
import {
  validateIqamahSchedule,
  validateJummahSchedule,
  isValidTimeString,
  isValidDateString,
  validateScheduleSource,
  validateScheduleVerification,
} from "./validation";
import { isScheduleCurrent, isScheduleExpiringSoon } from "./expiration";
import { detectIqamahConflicts, detectJummahConflicts } from "./conflicts";
import { ScheduleRepository } from "./repository";
import { IqamahSchedule } from "../iqamah/types";
import { JummahSchedule } from "../jummah/types";

describe("Phase 4 — Schedule Domain & Validation", () => {
  const validIqamah: IqamahSchedule = {
    id: "iq-1",
    mosqueId: "m-1",
    timezone: "America/Toronto",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-03-31",
    schedule: {
      fajr: "06:15",
      dhuhr: "13:30",
      asr: "17:45",
      maghrib: null,
      isha: "21:15",
    },
    source: {
      sourceType: "OFFICIAL_WEBSITE",
      sourceName: "Official Mosque Website",
      sourceUrl: "https://example-mosque.ca/prayers",
      retrievedAt: "2026-01-01",
    },
    verification: {
      status: "VERIFIED",
      verifiedAt: "2026-01-01",
      expiresAt: "2026-03-31",
      verifiedBy: "Editorial Team",
    },
    confidence: "HIGH",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  const validJummah: JummahSchedule = {
    id: "jm-1",
    mosqueId: "m-1",
    timezone: "America/Toronto",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    shifts: [
      { shiftNumber: 1, khutbahTime: "12:30", prayerTime: "13:00", language: "English" },
      { shiftNumber: 2, khutbahTime: "13:30", prayerTime: "14:00", language: "Arabic / English" },
    ],
    registrationRequired: false,
    source: {
      sourceType: "OFFICIAL_WEBSITE",
      sourceName: "Official Mosque Website",
      sourceUrl: "https://example-mosque.ca/jummah",
      retrievedAt: "2026-01-01",
    },
    verification: {
      status: "VERIFIED",
      verifiedAt: "2026-01-01",
      expiresAt: null,
    },
    confidence: "HIGH",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  describe("Time and Date formatting", () => {
    it("validates 24-hour time strings correctly", () => {
      expect(isValidTimeString("06:15")).toBe(true);
      expect(isValidTimeString("13:30")).toBe(true);
      expect(isValidTimeString("00:00")).toBe(true);
      expect(isValidTimeString("23:59")).toBe(true);

      expect(isValidTimeString("24:00")).toBe(false);
      expect(isValidTimeString("6:15")).toBe(false); // Must be HH:mm
      expect(isValidTimeString("1:15 PM")).toBe(false); // Must be 24h
      expect(isValidTimeString("invalid")).toBe(false);
    });

    it("validates ISO date strings correctly", () => {
      expect(isValidDateString("2026-01-01")).toBe(true);
      expect(isValidDateString("2026-12-31")).toBe(true);
      expect(isValidDateString("2026/01/01")).toBe(false);
      expect(isValidDateString("01-01-2026")).toBe(false);
    });
  });

  describe("Iqamah Schedule Validation", () => {
    it("accepts a fully valid Iqamah schedule", () => {
      const res = validateIqamahSchedule(validIqamah);
      expect(res.isValid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it("rejects Iqamah schedule missing effectiveFrom or mosqueId", () => {
      const bad = { ...validIqamah, effectiveFrom: "", mosqueId: "" };
      const res = validateIqamahSchedule(bad);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes("mosqueId"))).toBe(true);
      expect(res.errors.some((e) => e.includes("effectiveFrom"))).toBe(true);
    });

    it("rejects Iqamah schedule where effectiveTo is before effectiveFrom", () => {
      const bad = { ...validIqamah, effectiveFrom: "2026-05-01", effectiveTo: "2026-04-01" };
      const res = validateIqamahSchedule(bad);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes("effectiveTo cannot be before"))).toBe(true);
    });

    it("rejects Iqamah schedule with invalid prayer times", () => {
      const bad = {
        ...validIqamah,
        schedule: { ...validIqamah.schedule, fajr: "25:99" },
      };
      const res = validateIqamahSchedule(bad);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes("fajr has invalid time"))).toBe(true);
    });
  });

  describe("Jummah Schedule Validation", () => {
    it("accepts a fully valid Jummah schedule with multiple shifts", () => {
      const res = validateJummahSchedule(validJummah);
      expect(res.isValid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it("rejects Jummah schedule with empty shifts array", () => {
      const bad = { ...validJummah, shifts: [] };
      const res = validateJummahSchedule(bad);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes("at least one"))).toBe(true);
    });

    it("rejects Jummah shift with invalid time format", () => {
      const bad = {
        ...validJummah,
        shifts: [{ shiftNumber: 1, khutbahTime: "1:30 PM" }],
      };
      const res = validateJummahSchedule(bad);
      expect(res.isValid).toBe(false);
    });
  });

  describe("Source & Verification Metadata Validation", () => {
    it("rejects source missing sourceName or sourceType", () => {
      const errs = validateScheduleSource({ sourceType: "", sourceName: "" });
      expect(errs.length).toBeGreaterThan(0);
    });

    it("rejects verified status without verifiedAt date", () => {
      const errs = validateScheduleVerification({ status: "VERIFIED", verifiedAt: null });
      expect(errs.some((e) => e.includes("verifiedAt"))).toBe(true);
    });
  });

  describe("Expiration and Currency Logic", () => {
    it("returns true when current date is inside effective range and before expiresAt", () => {
      expect(isScheduleCurrent(validIqamah, "2026-02-15")).toBe(true);
    });

    it("returns false before effectiveFrom", () => {
      expect(isScheduleCurrent(validIqamah, "2025-12-31")).toBe(false);
    });

    it("returns false after effectiveTo", () => {
      expect(isScheduleCurrent(validIqamah, "2026-04-01")).toBe(false);
    });

    it("returns false after expiresAt", () => {
      const expiring = {
        ...validIqamah,
        effectiveTo: null,
        verification: { ...validIqamah.verification, expiresAt: "2026-02-01" },
      };
      expect(isScheduleCurrent(expiring, "2026-02-15")).toBe(false);
    });

    it("returns false when verification status is not VERIFIED", () => {
      const pending = {
        ...validIqamah,
        verification: { ...validIqamah.verification, status: "PENDING_REVIEW" as const },
      };
      expect(isScheduleCurrent(pending, "2026-02-15")).toBe(false);

      const revoked = {
        ...validIqamah,
        verification: { ...validIqamah.verification, status: "REVOKED" as const },
      };
      expect(isScheduleCurrent(revoked, "2026-02-15")).toBe(false);
    });

    it("correctly identifies schedules expiring soon", () => {
      // Current date is 2026-03-25, expires 2026-03-31 (6 days away <= 14 days)
      expect(isScheduleExpiringSoon(validIqamah, "2026-03-25", 14)).toBe(true);
      // Current date is 2026-01-15 (more than 14 days away)
      expect(isScheduleExpiringSoon(validIqamah, "2026-01-15", 14)).toBe(false);
    });
  });

  describe("Conflict Detection", () => {
    it("detects conflicting Iqamah schedules with overlapping dates and differing times", () => {
      const recordA: IqamahSchedule = {
        ...validIqamah,
        id: "iq-a",
        effectiveFrom: "2026-01-01",
        effectiveTo: "2026-06-30",
        schedule: { ...validIqamah.schedule, dhuhr: "13:30" },
      };
      const recordB: IqamahSchedule = {
        ...validIqamah,
        id: "iq-b",
        effectiveFrom: "2026-02-01",
        effectiveTo: "2026-08-31",
        schedule: { ...validIqamah.schedule, dhuhr: "13:45" },
      };

      const conflicts = detectIqamahConflicts([recordA, recordB], "2026-02-15");
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].mosqueId).toBe("m-1");
      expect(conflicts[0].conflictingScheduleIds).toEqual(["iq-a", "iq-b"]);
    });

    it("does not flag conflict if dates do not overlap", () => {
      const recordA: IqamahSchedule = {
        ...validIqamah,
        id: "iq-a",
        effectiveFrom: "2026-01-01",
        effectiveTo: "2026-03-31",
      };
      const recordB: IqamahSchedule = {
        ...validIqamah,
        id: "iq-b",
        effectiveFrom: "2026-04-01",
        effectiveTo: "2026-06-30",
      };

      const conflicts = detectIqamahConflicts([recordA, recordB], "2026-02-15");
      expect(conflicts).toHaveLength(0);
    });

    it("detects conflicting Jummah schedules with overlapping dates and differing shifts", () => {
      const jmA: JummahSchedule = {
        ...validJummah,
        id: "jm-a",
        shifts: [{ shiftNumber: 1, khutbahTime: "12:30" }],
      };
      const jmB: JummahSchedule = {
        ...validJummah,
        id: "jm-b",
        shifts: [{ shiftNumber: 1, khutbahTime: "13:15" }],
      };

      const conflicts = detectJummahConflicts([jmA, jmB], "2026-01-15");
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].mosqueId).toBe("m-1");
    });
  });

  describe("ScheduleRepository", () => {
    it("handles empty dataset cleanly without errors", async () => {
      const emptyRepo = new ScheduleRepository({ iqamah: [], jummah: [] });
      const iq = await emptyRepo.getCurrentIqamahByMosqueId("m-1");
      const jm = await emptyRepo.getCurrentJummahByMosqueId("m-1");
      const allIq = await emptyRepo.getAllVerifiedIqamah();
      const allJm = await emptyRepo.getAllVerifiedJummah();

      expect(iq).toBeNull();
      expect(jm).toBeNull();
      expect(allIq).toEqual([]);
      expect(allJm).toEqual([]);
    });

    it("retrieves current schedule when valid record exists", async () => {
      const repo = new ScheduleRepository({ iqamah: [validIqamah], jummah: [validJummah] });
      const iq = await repo.getCurrentIqamahByMosqueId("m-1", "2026-02-01");
      const jm = await repo.getCurrentJummahByMosqueId("m-1", "2026-02-01");

      expect(iq).not.toBeNull();
      expect(iq?.schedule.fajr).toBe("06:15");
      expect(jm).not.toBeNull();
      expect(jm?.shifts).toHaveLength(2);
    });

    it("withholds conflicting schedules from public query", async () => {
      const recordA: IqamahSchedule = {
        ...validIqamah,
        id: "iq-a",
        schedule: { ...validIqamah.schedule, dhuhr: "13:30" },
      };
      const recordB: IqamahSchedule = {
        ...validIqamah,
        id: "iq-b",
        schedule: { ...validIqamah.schedule, dhuhr: "13:45" },
      };

      const repo = new ScheduleRepository({ iqamah: [recordA, recordB], jummah: [] });
      const iq = await repo.getCurrentIqamahByMosqueId("m-1", "2026-02-01");
      expect(iq).toBeNull(); // Withheld due to conflict
    });

    it("computes accurate audit and quality metrics", async () => {
      const repo = new ScheduleRepository({ iqamah: [validIqamah], jummah: [validJummah] });
      const metrics = await repo.getQualityMetrics("2026-02-01");

      expect(metrics.totalIqamahRecords).toBe(1);
      expect(metrics.verifiedIqamahRecords).toBe(1);
      expect(metrics.currentIqamahRecords).toBe(1);
      expect(metrics.totalJummahRecords).toBe(1);
      expect(metrics.verifiedJummahRecords).toBe(1);
      expect(metrics.currentJummahRecords).toBe(1);
      expect(metrics.conflictingSchedulesCount).toBe(0);
    });
  });
});
