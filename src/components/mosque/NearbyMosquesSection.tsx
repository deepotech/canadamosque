import React from "react";
import Link from "next/link";
import { Mosque } from "@/domain/mosque/types";
import { MosqueDistanceResult } from "@/domain/mosque/repository";
import { getCityConfigByName } from "@/domain/city/city-config";

interface NearbyMosquesSectionProps {
  currentMosque: Mosque;
  nearbyMosques: MosqueDistanceResult[];
}

/**
 * Server-rendered "Nearby Mosques" component for published mosque profiles.
 *
 * Implements focused geographic internal linking:
 * - Crawlable HTML links to /mosque/[slug]
 * - Contextual canonical link to city directory
 * - Factual display of distance in km, name, and municipality
 * - Zero fabricated data or superlative claims
 */
export function NearbyMosquesSection({
  currentMosque,
  nearbyMosques,
}: NearbyMosquesSectionProps) {
  if (!nearbyMosques || nearbyMosques.length === 0) {
    return null;
  }

  const cityConfig = getCityConfigByName(currentMosque.city);
  const cityBrowseUrl = cityConfig?.canonicalMosqueRoute || "/mosques";
  const cityDisplayName = cityConfig?.name || currentMosque.city;

  return (
    <section
      aria-labelledby="nearby-mosques-heading"
      className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-stone-200 pb-4 mb-6">
        <div>
          <h2
            id="nearby-mosques-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900"
          >
            Mosques Near {currentMosque.name}
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Geographically closest published mosques and prayer locations in Canada
          </p>
        </div>

        <Link
          href={cityBrowseUrl}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition inline-flex items-center gap-1 shrink-0"
        >
          View more mosques in {cityDisplayName} →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyMosques.map(({ mosque, distanceKm }) => {
          const formattedDistance =
            distanceKm < 0.05 ? "0.0 km" : `${distanceKm.toFixed(1)} km`;

          return (
            <article
              key={mosque.id}
              className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-4 hover:border-emerald-500/50 hover:bg-white hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-stone-500 truncate">
                    {mosque.city}
                    {mosque.province ? `, ${mosque.province}` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 shrink-0">
                    <span>📍</span>
                    <span>{formattedDistance}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 line-clamp-2">
                  <Link
                    href={`/mosque/${mosque.slug}`}
                    className="hover:text-emerald-700 hover:underline transition"
                  >
                    {mosque.name}
                  </Link>
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono">
                  {formattedDistance}
                </span>
                <Link
                  href={`/mosque/${mosque.slug}`}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 transition inline-flex items-center gap-1"
                >
                  View Profile →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
