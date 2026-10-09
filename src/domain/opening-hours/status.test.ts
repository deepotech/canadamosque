import { describe, it, expect } from "vitest";
import { getFacilityOpenStatus } from "./status";
import { OpeningHoursSchedule } from "./types";

describe("getFacilityOpenStatus", () => {
  it("returns 'Hours unavailable' when schedule is null", () => {
    const res = getFacilityOpenStatus(null);
    expect(res.isOpen).toBeNull();
    expect(res.statusText).toBe("Hours unavailable");
  });

  it("returns 'Hours unavailable' when days array is empty", () => {
    const res = getFacilityOpenStatus({ days: [] });
    expect(res.isOpen).toBeNull();
    expect(res.statusText).toBe("Hours unavailable");
  });

  it("handles 24 hours open schedule", () => {
    const schedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: false,
          isOpen24Hours: true,
          rawText: "Open 24 hours",
          periods: [{ openTime: "00:00", closeTime: "24:00" }],
        },
      ],
    };

    // Any time on Monday
    const date = new Date("2026-10-05T14:30:00Z"); // Monday
    const res = getFacilityOpenStatus(schedule, "America/Toronto", date);
    expect(res.isOpen).toBe(true);
    expect(res.statusText).toBe("Open 24 hours");
  });

  it("handles explicitly closed day", () => {
    const schedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: true,
          isOpen24Hours: false,
          rawText: "Closed",
          periods: [],
        },
      ],
    };

    const date = new Date("2026-10-05T14:30:00Z"); // Monday
    const res = getFacilityOpenStatus(schedule, "America/Toronto", date);
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toBe("Closed today");
  });

  it("correctly identifies 'Open now' during standard hours", () => {
    const schedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: false,
          isOpen24Hours: false,
          rawText: "6 AM to 11:30 PM",
          periods: [],
        },
      ],
    };

    // 2:00 PM local Toronto on Monday (18:00 UTC)
    const date = new Date("2026-10-05T18:00:00Z");
    const res = getFacilityOpenStatus(schedule, "America/Toronto", date);
    expect(res.isOpen).toBe(true);
    expect(res.statusText).toBe("Open now");
  });

  it("correctly identifies 'Closed now' outside hours", () => {
    const schedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: false,
          isOpen24Hours: false,
          rawText: "1 to 3 PM",
          periods: [],
        },
      ],
    };

    // 10:00 AM local Toronto on Monday (14:00 UTC)
    const date = new Date("2026-10-05T14:00:00Z");
    const res = getFacilityOpenStatus(schedule, "America/Toronto", date);
    expect(res.isOpen).toBe(false);
    expect(res.statusText).toBe("Closed now");
  });

  it("handles split periods (e.g. morning + evening)", () => {
    const schedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: false,
          isOpen24Hours: false,
          rawText: "5:30 to 7:30 AM, 12:30 to 10 PM",
          periods: [],
        },
      ],
    };

    // 6:00 AM local Toronto (10:00 UTC) -> should be open
    const openMorning = new Date("2026-10-05T10:00:00Z");
    expect(getFacilityOpenStatus(schedule, "America/Toronto", openMorning).isOpen).toBe(true);

    // 10:00 AM local Toronto (14:00 UTC) -> should be closed
    const closedMidday = new Date("2026-10-05T14:00:00Z");
    expect(getFacilityOpenStatus(schedule, "America/Toronto", closedMidday).isOpen).toBe(false);

    // 2:00 PM local Toronto (18:00 UTC) -> should be open
    const openAfternoon = new Date("2026-10-05T18:00:00Z");
    expect(getFacilityOpenStatus(schedule, "America/Toronto", openAfternoon).isOpen).toBe(true);
  });
});
