import React from "react";
import { OpeningHoursSchedule } from "@/domain/opening-hours/types";
import { getFacilityOpenStatus } from "@/domain/opening-hours/status";

interface MosqueOpeningHoursCardProps {
  openingHours: OpeningHoursSchedule | null;
  timezone: string;
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function MosqueOpeningHoursCard({
  openingHours,
  timezone,
}: MosqueOpeningHoursCardProps) {
  const openStatus = getFacilityOpenStatus(openingHours, timezone);

  if (!openingHours || !openingHours.days || openingHours.days.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-stone-900">
          Building Opening Hours
        </h2>
        <div className="mt-4 rounded-lg bg-stone-50 border border-stone-200 p-4 text-center">
          <p className="text-sm font-medium text-stone-700">
            Opening hours not available
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Facility opening and closing times have not been recorded for this location.
          </p>
        </div>
        <p className="mt-3 text-xs text-stone-400">
          <strong>Notice:</strong> Facility opening hours represent when the building doors are unlocked. They are completely separate from astronomical prayer times and Iqamah congregation schedules.
        </p>
      </div>
    );
  }

  // Get current day name in target timezone to highlight today's row
  let todayDayName = "";
  try {
    todayDayName = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
    }).format(new Date());
  } catch {
    todayDayName = "";
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Building Opening Hours
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Physical facility doors and premises access
          </p>
        </div>

        {/* Real-time open/closed status badge based ONLY on canonical hours */}
        {openStatus.isOpen !== null && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              openStatus.isOpen
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                openStatus.isOpen ? "bg-emerald-600" : "bg-rose-600"
              }`}
              aria-hidden="true"
            />
            <span>{openStatus.statusText}</span>
          </span>
        )}
      </div>

      {/* Week schedule table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-stone-100">
        <table className="min-w-full divide-y divide-stone-100 text-xs">
          <tbody className="divide-y divide-stone-100 bg-white">
            {DAY_ORDER.map((dayName) => {
              const dayData = openingHours.days.find(
                (d) => d.day.toLowerCase() === dayName.toLowerCase()
              );
              const isToday = dayName.toLowerCase() === todayDayName.toLowerCase();

              return (
                <tr
                  key={dayName}
                  className={isToday ? "bg-emerald-50/50 font-medium" : "hover:bg-stone-50/50"}
                >
                  <td className="py-2.5 px-3 text-stone-800 flex items-center gap-1.5">
                    <span>{dayName}</span>
                    {isToday && (
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-stone-600 font-mono">
                    {dayData ? (
                      dayData.isClosed ? (
                        <span className="text-stone-400 font-sans">Closed</span>
                      ) : dayData.isOpen24Hours ? (
                        <span className="text-emerald-700 font-sans font-semibold">
                          Open 24 hours
                        </span>
                      ) : (
                        dayData.rawText
                      )
                    ) : (
                      <span className="text-stone-400 font-sans">Unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-stone-50 border border-stone-200/60 p-3 text-xs text-stone-500 leading-relaxed">
        <strong>Important Distinction:</strong> These hours indicate building facility open times. Mosque congregation Iqamah and Friday Jummah prayers have separate schedules.
      </div>
    </div>
  );
}
