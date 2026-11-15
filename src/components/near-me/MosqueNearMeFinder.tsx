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
        <div className="text-center py-14 px-4 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="text-5xl mb-5" aria-hidden="true">📍</div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Find Your Nearest Mosque</h2>
          <p className="text-sm text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
            Share your location to discover the closest verified mosques, masjids, and prayer spaces around you.
          </p>
          <button
            onClick={handleLocate}
            className="inline-flex justify-center items-center rounded-xl bg-emerald-700 px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-emerald-800 active:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 min-w-[220px]"
            aria-label="Allow location access to find nearest mosques"
          >
            📍 Find Mosques Near Me
          </button>
          <p className="mt-5 text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Your location is processed entirely in your browser. Coordinates are never sent to our servers, stored in cookies, or saved locally.
          </p>
        </div>
      )}

      {state === "loading" && (
        <div className="text-center py-14 px-4 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="text-4xl mb-4 motion-safe:animate-pulse" aria-hidden="true">📍</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Locating You...</h2>
          <p className="text-sm text-stone-500">Getting your coordinates. This may take a moment.</p>
        </div>
      )}

      {state === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-center py-14 px-4 rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Unable to Locate</h2>
          <p className="text-sm text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">{errorMessage}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLocate}
              className="w-full sm:w-auto min-h-[48px] inline-flex justify-center items-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
            >
              Try Again
            </button>
            <Link
              href="/mosques"
              className="w-full sm:w-auto min-h-[48px] inline-flex justify-center items-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Browse Mosques by City →
            </Link>
          </div>
        </div>
      )}

      {state === "success" && (
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-stone-900">Closest Locations to You</h2>
            <button
              onClick={handleLocate}
              className="min-h-[44px] px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              aria-label="Update your location"
            >
              Update Location
            </button>
          </div>

          {nearbyMosques.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-stone-600">No verified mosques were found within the current search area.</p>
              <Link
                href="/mosques"
                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline"
              >
                Browse All Mosques →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nearbyMosques.map(({ mosque, distanceKm }) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  distanceKm={distanceKm}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
