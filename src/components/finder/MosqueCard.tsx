import React from "react";
import Link from "next/link";
import { Mosque } from "@/domain/mosque/types";
import { MosqueTypeBadge } from "@/components/mosque/MosqueTypeBadge";
import { formatDistanceKm } from "@/domain/geo/distance";
import { getFacilityOpenStatus } from "@/domain/opening-hours/status";

interface MosqueCardProps {
  mosque: Mosque;
  distanceKm?: number | null;
  onSelectOnMap?: () => void;
  isSelected?: boolean;
  hasVerifiedIqamah?: boolean;
  hasVerifiedJummah?: boolean;
}

export function MosqueCard({
  mosque,
  distanceKm,
  onSelectOnMap,
  isSelected = false,
  hasVerifiedIqamah = false,
  hasVerifiedJummah = false,
}: MosqueCardProps) {
  const openStatus = getFacilityOpenStatus(mosque.openingHours, mosque.timezone);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mosque.coordinates.latitude},${mosque.coordinates.longitude}`;

  return (
    <div
      className={`rounded-xl border transition-all p-5 bg-white ${
        isSelected
          ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-md"
          : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <MosqueTypeBadge classification={mosque.classification} />

            {/* Distance badge if available */}
            {distanceKm !== undefined && distanceKm !== null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <span>📍</span>
                <span>{formatDistanceKm(distanceKm)}</span>
              </span>
            )}

            {/* Facility open/closed status badge based solely on canonical hours */}
            {openStatus.isOpen !== null && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  openStatus.isOpen
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                <span>{openStatus.isOpen ? "● Open now" : "○ Closed"}</span>
              </span>
            )}

            {/* Schedule indicators ONLY when verified */}
            {hasVerifiedIqamah && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span>🕌 Iqamah verified</span>
              </span>
            )}

            {hasVerifiedJummah && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100/70 border border-teal-200 px-2 py-0.5 rounded-full">
                <span>👥 Jummah available</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-stone-900 line-clamp-1">
            <Link
              href={`/mosque/${mosque.slug}`}
              className="hover:text-emerald-700 transition"
            >
              {mosque.name}
            </Link>
          </h3>

          <p className="mt-1 text-xs text-stone-500 line-clamp-1 flex items-center gap-1">
            <span>{mosque.address}</span>
          </p>
        </div>
      </div>

      {/* Facilities quick tags */}
      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-stone-600">
        {mosque.facilities.wheelchairAccessible && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-50 px-2 py-0.5 border border-stone-200">
            ♿ Accessible
          </span>
        )}
        {mosque.facilities.parkingAvailable && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-50 px-2 py-0.5 border border-stone-200">
            🅿️ Parking
          </span>
        )}
        {mosque.facilities.womenPrayerSection && (
          <span className="inline-flex items-center gap-1 rounded bg-stone-50 px-2 py-0.5 border border-stone-200">
            🧕 Women&apos;s Area
          </span>
        )}
      </div>

      {/* Bottom actions */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/mosque/${mosque.slug}`}
            className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
          >
            View Profile →
          </Link>
          {onSelectOnMap && (
            <button
              type="button"
              onClick={onSelectOnMap}
              className="inline-flex items-center rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
              aria-label={`Highlight ${mosque.name} on map`}
            >
              🗺️ Map
            </button>
          )}
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-stone-500 hover:text-stone-800 underline underline-offset-2"
        >
          Directions ↗
        </a>
      </div>
    </div>
  );
}
