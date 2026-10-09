"use client";

import React, { useState, useMemo } from "react";
import { defaultPrayerTimeEngine } from "@/domain/prayer/engine";
import type { CalculatedPrayerSchedule, FormattedPrayerTimes } from "@/domain/prayer/types";
import { Coordinates } from "@/domain/geo/coordinates";

const PRAYER_LABELS: Record<keyof FormattedPrayerTimes, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  date: "",
  timezone: "",
};

const PRAYER_DESCRIPTIONS: Record<string, string> = {
  fajr: "Pre-dawn prayer — begins at nautical twilight (15° below horizon)",
  sunrise: "Sunrise — end of Fajr period",
  dhuhr: "Midday prayer — after solar transit",
  asr: "Afternoon prayer — shadow equals object height",
  maghrib: "Sunset prayer — at the moment of sunset",
  isha: "Night prayer — when twilight fully disappears (15° below horizon)",
};

interface Props {
  cityName: string;
  coordinates: Coordinates;
  timezone: string;
  initialDate: string; // YYYY-MM-DD
}

export function CityPrayerTimesClient({
  cityName,
  coordinates,
  timezone,
  initialDate,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Calculate schedule and format
  const { schedule, formatted } = useMemo(() => {
    const calcSchedule = defaultPrayerTimeEngine.calculatePrayerTimes({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      date: selectedDate,
      timezone: timezone,
      calculationMethod: "ISNA",
      asrMethod: "STANDARD",
      highLatitudeRule: "ANGLE_BASED",
    });
    const calcFormatted = defaultPrayerTimeEngine.formatSchedule(calcSchedule, false);
    return { schedule: calcSchedule, formatted: calcFormatted };
  }, [coordinates, timezone, selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: timezone });
    setSelectedDate(today);
  };

  return (
    <div className="mt-8">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-2 mb-6">
        <button
          onClick={handlePrevDay}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md shadow-sm"
        >
          &larr; Previous
        </button>
        <div className="text-center">
          <button
            onClick={handleToday}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 uppercase tracking-wide"
          >
            Today
          </button>
          <div className="text-sm font-medium text-stone-900 mt-0.5">
            {schedule.date}
          </div>
        </div>
        <button
          onClick={handleNextDay}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md shadow-sm"
        >
          Next &rarr;
        </button>
      </div>

      {/* Prayer Times Card */}
      <PrayerTimesCard cityName={cityName} schedule={schedule} formatted={formatted} />

      {/* Calculation Settings */}
      <CalculationSettingsCard schedule={schedule} />

      {/* High Latitude / Warnings */}
      {schedule.metadata.highLatitudeAdjustment.applied && (
        <HighLatitudeNotice schedule={schedule} />
      )}
    </div>
  );
}

function PrayerTimesCard({
  cityName,
  schedule,
  formatted,
}: {
  cityName: string;
  schedule: CalculatedPrayerSchedule;
  formatted: FormattedPrayerTimes;
}) {
  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Calculated Prayer Times
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {schedule.date} · {schedule.timezone}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          Astronomical
        </span>
      </div>

      {/* Prayer time rows */}
      <ul className="divide-y divide-stone-50">
        {prayers.map((prayer) => (
          <li
            key={prayer}
            className="flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors"
          >
            <div>
              <span className="text-sm font-semibold text-stone-800 capitalize">
                {PRAYER_LABELS[prayer]}
              </span>
              <p className="text-xs text-stone-400 mt-0.5 max-w-xs">
                {PRAYER_DESCRIPTIONS[prayer]}
              </p>
            </div>
            <span className="text-xl font-mono font-bold text-stone-900 tabular-nums ml-4 shrink-0">
              {formatted[prayer]}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-xs text-stone-500">
        All times in <strong>local {cityName} time</strong> ({schedule.timezone}, includes DST).
        Times rounded to nearest minute.
      </div>
    </div>
  );
}

function CalculationSettingsCard({
  schedule,
}: {
  schedule: CalculatedPrayerSchedule;
}) {
  const { settings, metadata } = schedule;

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="text-sm font-semibold text-stone-900">
          Calculation Settings
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          All assumptions are explicit and inspectable.
        </p>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-stone-100">
        {[
          {
            label: "Method",
            value: settings.calculationMethod,
            note: "Islamic Society of North America",
          },
          {
            label: "Fajr Angle",
            value: `${settings.fajrAngle}°`,
            note: "Solar depression below horizon",
          },
          {
            label: "Isha Angle",
            value: `${settings.ishaAngle}°`,
            note: "Solar depression below horizon",
          },
          {
            label: "Asr Method",
            value: settings.asrMethod,
            note: "Shadow factor = 1 (Shafi/Maliki/Hanbali)",
          },
          {
            label: "High Latitude Rule",
            value: settings.highLatitudeRule.replace(/_/g, " "),
            note: "Fajr/Isha clamp for short nights",
          },
          {
            label: "Timezone",
            value: metadata.timezone,
            note: "IANA identifier, DST-aware",
          },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white px-4 py-3">
            <dt className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-stone-800">
              {value}
            </dd>
            {note && <p className="mt-0.5 text-xs text-stone-400">{note}</p>}
          </div>
        ))}
      </dl>
    </div>
  );
}

function HighLatitudeNotice({
  schedule,
}: {
  schedule: CalculatedPrayerSchedule;
}) {
  const adj = schedule.metadata.highLatitudeAdjustment;
  return (
    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
      <h3 className="font-semibold">High-Latitude Adjustment Applied</h3>
      <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
        {adj.fajrAdjusted && (
          <li>
            <strong>Fajr</strong> was estimated using the{" "}
            <strong>{adj.rule.replace(/_/g, " ")}</strong> rule because the
            sun does not reach the required twilight angle on this date.
          </li>
        )}
        {adj.ishaAdjusted && (
          <li>
            <strong>Isha</strong> was estimated using the{" "}
            <strong>{adj.rule.replace(/_/g, " ")}</strong> rule because the
            sun does not reach the required twilight angle on this date.
          </li>
        )}
      </ul>
      {schedule.metadata.warnings.map((w, i) => (
        <p key={i} className="mt-2 text-xs text-blue-700">
          ⚠ {w}
        </p>
      ))}
    </div>
  );
}
