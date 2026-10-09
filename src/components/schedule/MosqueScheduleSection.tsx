"use client";

import React, { useState } from "react";
import { IqamahSchedule } from "@/domain/iqamah/types";
import { JummahSchedule } from "@/domain/jummah/types";
import { EstimatedIqamahResult } from "@/domain/estimated-iqamah/types";

interface MosqueScheduleSectionProps {
  iqamah: IqamahSchedule | null;
  jummah: JummahSchedule | null;
  /**
   * Pre-calculated estimated Iqamah result.
   * Provided by the server component (mosque profile page).
   * Only displayed when iqamah is null.
   */
  estimatedIqamah: EstimatedIqamahResult | null;
}

const PRAYER_KEYS = [
  { key: "fajr" as const, label: "Fajr" },
  { key: "dhuhr" as const, label: "Dhuhr" },
  { key: "asr" as const, label: "Asr" },
  { key: "maghrib" as const, label: "Maghrib" },
  { key: "isha" as const, label: "Isha" },
];

// ---------------------------------------------------------------------------
// Verified Iqamah sub-component
// ---------------------------------------------------------------------------

function VerifiedIqamahPanel({ iqamah }: { iqamah: IqamahSchedule }) {
  return (
    <div className="space-y-2 mt-4">
      <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white">
        <table className="min-w-full divide-y divide-stone-100 text-xs">
          <tbody className="divide-y divide-stone-100">
            {PRAYER_KEYS.map(({ key, label }) => {
              const time = iqamah.schedule[key];
              return (
                <tr key={key} className="hover:bg-stone-50/50">
                  <td className="py-2.5 px-3 text-stone-700 font-medium">{label}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                    {time || <span className="text-stone-400 font-sans font-normal">After Adhan</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Provenance Metadata */}
      <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-1">
        <div>
          <span>Verified: </span>
          <strong className="text-stone-700">{iqamah.verification.verifiedAt}</strong>
        </div>
        <div>
          <span>Source: </span>
          {iqamah.source.sourceUrl ? (
            <a
              href={iqamah.source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline"
            >
              {iqamah.source.sourceName} ↗
            </a>
          ) : (
            <span className="text-stone-700">{iqamah.source.sourceName}</span>
          )}
        </div>
        {iqamah.effectiveFrom && (
          <div className="text-stone-400">
            Effective: {iqamah.effectiveFrom} {iqamah.effectiveTo ? `to ${iqamah.effectiveTo}` : "(current)"}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Estimated Iqamah sub-component
// ---------------------------------------------------------------------------

function EstimatedIqamahPanel({ estimate }: { estimate: EstimatedIqamahResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2 mt-4">
      {/* Warning banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-relaxed">
        <span className="font-semibold">⚠ Estimated — Not verified by this mosque.</span>{" "}
        Actual congregation times may differ.
      </div>

      {/* Estimate table */}
      <div className="overflow-hidden rounded-lg border border-amber-200 bg-white">
        <table className="min-w-full divide-y divide-stone-100 text-xs">
          <thead>
            <tr className="bg-amber-50/70">
              <th className="py-2 px-3 text-left text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Prayer</th>
              <th className="py-2 px-3 text-right text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Calculated</th>
              <th className="py-2 px-3 text-right text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Est. Iqamah</th>
              <th className="py-2 px-3 text-right text-[10px] font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Offset</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {PRAYER_KEYS.map(({ key, label }) => {
              const entry = estimate.times[key];
              return (
                <tr key={key} className="hover:bg-amber-50/30">
                  <td className="py-2.5 px-3 text-stone-700 font-medium">{label}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-stone-500 tabular-nums">
                    {entry.calculatedTime}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                    {entry.estimatedTime}
                  </td>
                  <td className="py-2.5 px-3 text-right text-stone-400 text-[11px] hidden sm:table-cell">
                    +{entry.offsetMinutes} min
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* "Why estimated?" expandable explanation */}
      <div className="rounded-lg border border-stone-200 bg-stone-50/70 text-[11px]">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-stone-600 hover:text-stone-800 font-medium transition"
          aria-expanded={expanded}
        >
          <span>Why is this estimated?</span>
          <span aria-hidden="true">{expanded ? "▲" : "▼"}</span>
        </button>
        {expanded && (
          <div className="px-3 pb-3 text-stone-500 leading-relaxed border-t border-stone-200">
            <p className="mt-2">
              Every mosque sets its own congregation schedule. Because a verified schedule is not
              currently available for this mosque, these times are estimates based on configurable
              offsets from the calculated astronomical prayer times.
            </p>
            <p className="mt-1.5">
              The offsets used are:{" "}
              Fajr +{estimate.offsets.fajrOffsetMinutes} min,{" "}
              Dhuhr +{estimate.offsets.dhuhrOffsetMinutes} min,{" "}
              Asr +{estimate.offsets.asrOffsetMinutes} min,{" "}
              Maghrib +{estimate.offsets.maghribOffsetMinutes} min,{" "}
              Isha +{estimate.offsets.ishaOffsetMinutes} min.
            </p>
            <p className="mt-1.5 font-medium text-amber-800">
              These offsets are configured estimation parameters. They are not a claim about
              what this mosque actually does. Please contact the mosque directly for their
              official congregation times.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// No schedule panel
// ---------------------------------------------------------------------------

function NoIqamahPanel() {
  return (
    <div className="mt-3">
      <p className="text-xs text-stone-700 font-medium">
        Verified Iqamah times are not currently available for this location.
      </p>
      <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
        Iqamah times are set by the mosque administration and change regularly throughout the year.
        We do not display estimates or uncorroborated times here.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Section Component
// ---------------------------------------------------------------------------

export function MosqueScheduleSection({
  iqamah,
  jummah,
  estimatedIqamah,
}: MosqueScheduleSectionProps) {
  /**
   * Priority hierarchy:
   *   1. Verified Iqamah (iqamah !== null)       → show VERIFIED panel
   *   2. Estimated Iqamah (estimatedIqamah !== null) → show ESTIMATED panel
   *   3. Neither                                  → show NO DATA panel
   *
   * Jummah is NEVER estimated. Only verified or not shown.
   */
  const showVerified = iqamah !== null;
  const showEstimate = !showVerified && estimatedIqamah !== null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Mosque Congregation Schedules
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Congregation (Iqamah) and Friday services (Jummah)
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---- Daily Iqamah Column ---- */}
        <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>🕌</span>
                <span>Daily Iqamah</span>
              </h3>
              {showVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Verified Current
                </span>
              ) : showEstimate ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Estimated
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                  Unavailable
                </span>
              )}
            </div>

            {showVerified && <VerifiedIqamahPanel iqamah={iqamah!} />}
            {showEstimate && <EstimatedIqamahPanel estimate={estimatedIqamah!} />}
            {!showVerified && !showEstimate && <NoIqamahPanel />}
          </div>
        </div>

        {/* ---- Friday Jummah Column ---- */}
        <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>👥</span>
                <span>Friday Jummah Shifts</span>
              </h3>
              {jummah && jummah.shifts.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Verified Current
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                  Unavailable
                </span>
              )}
            </div>

            {jummah && jummah.shifts.length > 0 ? (
              <div className="space-y-2 mt-4">
                <div className="space-y-2">
                  {jummah.shifts.map((s) => (
                    <div
                      key={s.shiftNumber}
                      className="rounded-lg border border-stone-200 bg-white p-3 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-stone-800">
                          Shift {s.shiftNumber}
                        </span>
                        {s.language && (
                          <span className="ml-2 text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                            {s.language}
                          </span>
                        )}
                        {s.locationNotes && (
                          <p className="text-[11px] text-stone-500 mt-0.5">{s.locationNotes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-stone-900">
                          {s.khutbahTime}
                        </span>
                        {s.prayerTime && (
                          <p className="text-[10px] text-stone-500">Salah: {s.prayerTime}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Provenance Metadata */}
                <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-1">
                  <div>
                    <span>Verified: </span>
                    <strong className="text-stone-700">{jummah.verification.verifiedAt}</strong>
                  </div>
                  <div>
                    <span>Source: </span>
                    {jummah.source.sourceUrl ? (
                      <a
                        href={jummah.source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline"
                      >
                        {jummah.source.sourceName} ↗
                      </a>
                    ) : (
                      <span className="text-stone-700">{jummah.source.sourceName}</span>
                    )}
                  </div>
                  {jummah.registrationRequired && (
                    <div className="text-amber-700 font-medium">
                      ⚠️ Registration required {jummah.registrationUrl ? "(check website)" : ""}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-xs text-stone-700 font-medium">
                  Verified Jummah schedule is not currently available for this location.
                </p>
                <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                  Many locations conduct Friday prayers at 12:30 PM, 1:30 PM, or multiple shifts.
                  Please confirm directly with the venue before attending.
                </p>
                {/* Explicit: no estimated Jummah */}
                <p className="mt-2 text-[11px] text-stone-400 italic">
                  Jummah times are not estimated. Only verified schedules are shown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-lg bg-stone-50 border border-stone-200/60 text-[11px] text-stone-500 leading-relaxed">
        <strong>Trust Standard:</strong>{" "}
        Verified congregation times come only from official mosque sources.
        Estimated times are calculated from astronomical prayer times using configurable offsets
        and have not been confirmed by this mosque.
        Jummah times are never estimated.
      </div>
    </div>
  );
}
