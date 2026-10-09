import React from "react";

export function DataDistinctionNotice() {
  return (
    <div
      role="region"
      aria-label="Prayer Times and Opening Hours Data Philosophy"
      className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-5 text-sm text-emerald-950"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
          i
        </div>
        <div>
          <h3 className="font-semibold text-emerald-900">
            Our Data Standards: Accuracy & Honesty
          </h3>
          <p className="mt-1 text-emerald-800 leading-relaxed">
            In our Canadian mosque directory, we maintain strict distinctions between four separate concepts:
          </p>
          <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
            <li className="bg-white/70 p-2.5 rounded-lg border border-emerald-900/10">
              <strong className="block font-semibold text-stone-900">1. Opening Hours</strong>
              Physical building facility open and close hours. Never confused with prayer windows.
            </li>
            <li className="bg-white/70 p-2.5 rounded-lg border border-emerald-900/10">
              <strong className="block font-semibold text-stone-900">2. Calculated Prayer Times</strong>
              Astronomical solar calculations (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) tailored to Canadian coordinates.
            </li>
            <li className="bg-white/70 p-2.5 rounded-lg border border-emerald-900/10">
              <strong className="block font-semibold text-stone-900">3. Mosque Iqamah</strong>
              The congregation start times set by the mosque. Displayed only when verified directly; never fabricated.
            </li>
            <li className="bg-white/70 p-2.5 rounded-lg border border-emerald-900/10">
              <strong className="block font-semibold text-stone-900">4. Jummah (Friday Prayer)</strong>
              Mosque-hosted Friday sermon and congregation shifts. Reported accurately with verified shift times.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
