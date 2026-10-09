"use client";

import React, { useState } from "react";
import { Coordinates } from "@/domain/geo/coordinates";

interface MosqueLocationMapProps {
  coordinates: Coordinates;
  name: string;
  address: string;
  zoom?: number;
  className?: string;
}

export function MosqueLocationMap({
  coordinates,
  name,
  address,
  zoom = 15,
  className = "",
}: MosqueLocationMapProps) {
  const [loadInteractive, setLoadInteractive] = useState(false);

  // Compute a bounding box around the coordinates for OpenStreetMap export iframe
  const delta = 0.005;
  const bbox = `${coordinates.longitude - delta},${coordinates.latitude - delta},${coordinates.longitude + delta},${coordinates.latitude + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${coordinates.latitude},${coordinates.longitude}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
  const osmViewUrl = `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=${zoom}/${coordinates.latitude}/${coordinates.longitude}`;

  return (
    <div className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm ${className}`}>
      {/* Map display */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full bg-stone-100 flex items-center justify-center">
        {loadInteractive ? (
          <iframe
            title={`Interactive map of ${name}`}
            src={osmEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            aria-label={`Map centered on ${name} at ${address}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-3 shadow-inner">
              📍
            </div>
            <p className="text-sm font-semibold text-stone-800">{name}</p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">{address}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setLoadInteractive(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              >
                <span>🗺️ Load Interactive Map</span>
              </button>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                <span>↗ Get Directions</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Bar with Attribution and External Links */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500">
        <div>
          <span>Coordinates: </span>
          <span className="font-mono text-stone-700">
            {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={osmViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-500 hover:text-stone-800 underline underline-offset-2"
          >
            View larger map
          </a>
          <span>·</span>
          <span>© OpenStreetMap contributors</span>
        </div>
      </div>
    </div>
  );
}
