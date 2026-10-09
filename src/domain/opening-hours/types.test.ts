import { describe, it, expect } from "vitest";
import { isOpeningHoursSchedule, OpeningHoursSchedule } from "./types";

describe("Opening Hours Domain", () => {
  it("correctly identifies opening hours schedules", () => {
    const validSchedule: OpeningHoursSchedule = {
      days: [
        {
          day: "Monday",
          isClosed: false,
          isOpen24Hours: false,
          rawText: "9:00 AM - 9:00 PM",
          periods: [{ openTime: "09:00", closeTime: "21:00" }],
        },
      ],
      notes: "Subject to volunteer availability",
    };

    expect(isOpeningHoursSchedule(validSchedule)).toBe(true);
    expect(isOpeningHoursSchedule({ fajr: "05:00", dhuhr: "13:00" })).toBe(false);
    expect(isOpeningHoursSchedule(null)).toBe(false);
  });
});
