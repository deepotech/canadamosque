"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mosque } from "@/domain/mosque/types";
import { MosqueCard } from "@/components/finder/MosqueCard";
import { calculateHaversineDistanceKm } from "@/domain/geo/distance";

interface Props {
  allMosques: Mosque[];
}

type LocationState = "idle" | "loading" | "success" | "error";

interface MosqueDistanceResult {
  mosque: Mosque;
  distanceKm: number;
}

export function MosqueNearMeFinder({ allMosques }: Props) {
  const [state, setState] = useState<LocationState>("idle");
  const [nearbyMosques, setNearbyMosques] = useState<MosqueDistanceResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLocate = () => {
    setState("loading");
    setErrorMessage("");

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState("error");
      setErrorMessage(
        "Location services are not supported by this browser. Please browse mosques by city."
      );
      return;
    }

    if (window.isSecureContext === false) {
      setState("error");
      setErrorMessage(
        "Location access requires a secure connection (HTTPS). Please ensure you are browsing over HTTPS, or browse mosques by city."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const withDistances = allMosques.map((mosque) => ({
          mosque,
          distanceKm: calculateHaversineDistanceKm(userCoords, mosque.coordinates),
        }));

        withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

        // Top 10 closest mosques
        setNearbyMosques(withDistances.slice(0, 10));
        setState("success");
      },
      (error: GeolocationPositionError) => {
        setState("error");
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setErrorMessage(
              "Location access was denied. Please allow location access in your browser settings, or browse mosques by city."
            );
            break;
          case 2: // POSITION_UNAVAILABLE
            setErrorMessage(
              "We couldn't determine your location. Please try again or browse mosques by city."
            );
            break;
          case 3: // TIMEOUT
            setErrorMessage(
              "Location detection timed out. Please try again."
            );
            break;
          default:
            setErrorMessage(
              "We couldn't determine your location. Please try again or browse mosques by city."
            );
            break;
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="mt-8">
      {state === "idle" && (
        <div className="text-center py-12 px-4 rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Find Your Nearest Mosque</h2>
          <p className="text-sm text-stone-500 mb-6 max-w-md mx-auto">
            Click the button below to share your location and discover the closest verified mosques and prayer spaces around you.
          </p>
          <button
            onClick={handleLocate}
            className="inline-flex justify-center items-center rounded-lg bg-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
          >
            Find Mosques Near Me
          </button>
          <p className="mt-4 text-xs text-stone-400">
            Your location is processed entirely in your browser and is never sent to our servers.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="text-center py-12 px-4 rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="animate-spin text-4xl mb-4 inline-block text-emerald-600">⌛</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Locating...</h2>
          <p className="text-sm text-stone-500">Getting your coordinates.</p>
        </div>
      )}

      {state === "error" && (
        <div className="text-center py-12 px-4 rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Unable to Locate</h2>
          <p className="text-sm text-stone-600 mb-6 max-w-md mx-auto leading-relaxed">{errorMessage}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleLocate}
              className="inline-flex justify-center items-center rounded-lg bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
            >
              Try Again
            </button>
            <Link
              href="/mosques"
              className="inline-flex justify-center items-center rounded-lg border border-stone-300 bg-white px-6 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Browse Mosques by City →
            </Link>
          </div>
        </div>
      )}

      {state === "success" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">Closest Locations to You</h2>
            <button
              onClick={handleLocate}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              Update Location
            </button>
          </div>

          {nearbyMosques.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-stone-600">No verified mosques were found within the current search area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {nearbyMosques.map(({ mosque, distanceKm }) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  distanceKm={distanceKm}
                  // Assuming they might have verified schedules, but we'd need to pass them down
                  // For near me, we'll keep it simple unless we fetch the IDs. Let's pass false or adjust if needed.
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
