import React from "react";
import { MosqueFacilities } from "@/domain/mosque/types";

interface MosqueFacilitiesCardProps {
  facilities: MosqueFacilities;
}

interface FacilityItem {
  key: keyof MosqueFacilities;
  label: string;
  icon: string;
  value: boolean | null | string;
}

export function MosqueFacilitiesCard({ facilities }: MosqueFacilitiesCardProps) {
  const items: FacilityItem[] = [
    {
      key: "wheelchairAccessible",
      label: "Wheelchair Accessibility",
      icon: "♿",
      value: facilities.wheelchairAccessible,
    },
    {
      key: "parkingAvailable",
      label: "Parking Available",
      icon: "🅿️",
      value: facilities.parkingAvailable,
    },
    {
      key: "womenPrayerSection",
      label: "Women's Prayer Section",
      icon: "🧕",
      value: facilities.womenPrayerSection,
    },
    {
      key: "wuduArea",
      label: "Wudu Facilities",
      icon: "💧",
      value: facilities.wuduArea,
    },
    {
      key: "dailyPrayersHeld",
      label: "Daily 5 Prayers Held",
      icon: "🕌",
      value: facilities.dailyPrayersHeld,
    },
  ];

  const hasAnyKnown = items.some((i) => i.value !== null);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Verified Facility Features
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Facilities are reported only when verified in canonical source data.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isVerified = item.value === true;
          const isNotAvailable = item.value === false;
          const isUnknown = item.value === null;

          return (
            <div
              key={item.key}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isVerified
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                  : isNotAvailable
                  ? "bg-stone-50 border-stone-200 text-stone-600"
                  : "bg-stone-50/50 border-stone-100 text-stone-400"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-xs font-medium text-stone-800">
                  {item.label}
                </span>
              </div>
              <div>
                {isVerified && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Available
                  </span>
                )}
                {isNotAvailable && (
                  <span className="inline-flex items-center text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    Not available
                  </span>
                )}
                {isUnknown && (
                  <span className="inline-flex items-center text-xs text-stone-400">
                    Not verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasAnyKnown && (
        <p className="mt-3 text-xs text-stone-500 italic">
          Specific facility amenities have not yet been independently verified for this location.
        </p>
      )}

      {facilities.notes && (
        <div className="mt-4 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600">
          <strong>Note:</strong> {facilities.notes}
        </div>
      )}
    </div>
  );
}
