import React from "react";
import { defaultPrayerTimeEngine } from "@/domain/prayer/engine";
import { Coordinates } from "@/domain/geo/coordinates";

interface MosquePrayerTimesCardProps {
  coordinates: Coordinates;
  timezone: string;
}

export function MosquePrayerTimesCard({
  coordinates,
  timezone,
}: MosquePrayerTimesCardProps) {
  // Resolve today's date in target timezone to avoid UTC mismatch
  const todayDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-");

  const schedule = defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    date: todayDateStr,
    timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });

  const formatted = defaultPrayerTimeEngine.formatSchedule(schedule, false);
  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

  const labels: Record<string, string> = {
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Calculated Prayer Times
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Astronomically computed for this location&apos;s coordinates ({coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)})
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          Astronomical Solar Times
        </span>
      </div>

      {/* Critical Distinction Alert */}
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 leading-relaxed">
        <strong>Important:</strong> These are calculated astronomical prayer times. Mosque Iqamah (congregation) times may be different. Contact the mosque directly for congregation times.
      </div>

      {/* 6 Times Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {prayers.map((p) => (
          <div
            key={p}
            className="rounded-lg border border-stone-100 bg-stone-50/70 p-3 flex flex-col justify-between"
          >
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {labels[p]}
            </span>
            <span className="mt-1 text-xl font-mono font-bold text-stone-900 tabular-nums">
              {formatted[p]}
            </span>
          </div>
        ))}
      </div>

      {/* Inspectable Parameters Disclosure */}
      <details className="mt-4 text-xs text-stone-500 border-t border-stone-100 pt-3">
        <summary className="cursor-pointer font-medium text-stone-700 hover:text-emerald-700">
          View Calculation Parameters
        </summary>
        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
          <div>
            <span className="block text-stone-400">Method</span>
            <span className="font-semibold text-stone-800">
              {schedule.settings.calculationMethod} (15°/15°)
            </span>
          </div>
          <div>
            <span className="block text-stone-400">Asr Rule</span>
            <span className="font-semibold text-stone-800">
              {schedule.settings.asrMethod} (Factor 1)
            </span>
          </div>
          <div>
            <span className="block text-stone-400">High Lat Rule</span>
            <span className="font-semibold text-stone-800">
              {schedule.settings.highLatitudeRule.replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <span className="block text-stone-400">Timezone</span>
            <span className="font-semibold text-stone-800 font-mono">
              {schedule.timezone}
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}
