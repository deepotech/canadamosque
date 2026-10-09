"use client";

import React, { useMemo, useState } from "react";
import { Mosque, MosqueClassification } from "@/domain/mosque/types";
import { Coordinates, isWithinCanadaBounds } from "@/domain/geo/coordinates";
import { calculateHaversineDistanceKm } from "@/domain/geo/distance";
import { MosqueCard } from "./MosqueCard";
import { CLASSIFICATION_DISPLAY_NAMES } from "@/domain/mosque/classification-display";

interface MosqueFinderProps {
  initialMosques: Mosque[];
  availableCities: string[];
  verifiedIqamahMosqueIds?: string[];
  verifiedJummahMosqueIds?: string[];
}

export function MosqueFinder({
  initialMosques,
  availableCities,
  verifiedIqamahMosqueIds = [],
  verifiedJummahMosqueIds = [],
}: MosqueFinderProps) {
  const verifiedIqamahSet = useMemo(() => new Set(verifiedIqamahMosqueIds), [verifiedIqamahMosqueIds]);
  const verifiedJummahSet = useMemo(() => new Set(verifiedJummahMosqueIds), [verifiedJummahMosqueIds]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedMosqueId, setSelectedMosqueId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<"list" | "map" | "split">("split");

  // Geolocation trigger
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (!isWithinCanadaBounds(coords)) {
          setLocationError("Your location appears to be outside Canada bounds.");
          return;
        }

        // Keep in component state ONLY. Never store in database or send to analytics.
        setUserLocation(coords);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Search by area or city instead.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location is currently unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("Unable to retrieve location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleClearLocation = () => {
    setUserLocation(null);
    setLocationError(null);
  };

  // Filter and sort mosques
  const filteredAndSortedMosques = useMemo(() => {
    let result = [...initialMosques];

    // Filter by search query (name or address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q)
      );
    }

    // Filter by classification
    if (selectedClassification !== "ALL") {
      result = result.filter((m) => m.classification === selectedClassification);
    }

    // Filter by city
    if (selectedCity !== "ALL") {
      result = result.filter(
        (m) => m.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Calculate distance and sort if user location is available
    if (userLocation) {
      const withDistance = result.map((m) => ({
        mosque: m,
        distanceKm: calculateHaversineDistanceKm(userLocation, m.coordinates),
      }));

      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
      return withDistance;
    }

    // Default alphabetical sort
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result.map((m) => ({ mosque: m, distanceKm: null }));
  }, [
    initialMosques,
    searchQuery,
    selectedClassification,
    selectedCity,
    userLocation,
  ]);

  const selectedMosque = useMemo(() => {
    if (!selectedMosqueId) return filteredAndSortedMosques[0]?.mosque || null;
    return (
      filteredAndSortedMosques.find((item) => item.mosque.id === selectedMosqueId)?.mosque ||
      filteredAndSortedMosques[0]?.mosque ||
      null
    );
  }, [selectedMosqueId, filteredAndSortedMosques]);

  // Construct OSM Map embed for selected mosque or Toronto center
  const mapCenterLat = selectedMosque ? selectedMosque.coordinates.latitude : 43.6532;
  const mapCenterLng = selectedMosque ? selectedMosque.coordinates.longitude : -79.3832;
  const delta = 0.02;
  const mapBbox = `${mapCenterLng - delta},${mapCenterLat - delta},${mapCenterLng + delta},${mapCenterLat + delta}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    mapBbox
  )}&layer=mapnik&marker=${mapCenterLat},${mapCenterLng}`;

  const availableClassifications: MosqueClassification[] = [
    "MOSQUE",
    "ISLAMIC_CENTER",
    "MUSALLA",
    "PRAYER_ROOM",
    "JUMMAH_LOCATION",
    "COMMUNITY_CENTER",
  ];

  return (
    <div>
      {/* Controls Bar: Search, Filters, Near Me */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Text Search */}
          <div className="md:col-span-5">
            <label htmlFor="mosque-search" className="block text-xs font-semibold text-stone-700 mb-1">
              Search by Name or Address
            </label>
            <div className="relative">
              <input
                id="mosque-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Madina, Scarborough, Eglinton..."
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Place Type Filter */}
          <div className="md:col-span-3">
            <label htmlFor="type-filter" className="block text-xs font-semibold text-stone-700 mb-1">
              Place Type
            </label>
            <select
              id="type-filter"
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="ALL">All Place Types</option>
              {availableClassifications.map((c) => (
                <option key={c} value={c}>
                  {CLASSIFICATION_DISPLAY_NAMES[c]}
                </option>
              ))}
            </select>
          </div>

          {/* Municipality Filter */}
          <div className="md:col-span-2">
            <label htmlFor="city-filter" className="block text-xs font-semibold text-stone-700 mb-1">
              Municipality
            </label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="ALL">All Locations</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Geolocation Near Me Button */}
          <div className="md:col-span-2 flex flex-col justify-end">
            {userLocation ? (
              <button
                type="button"
                onClick={handleClearLocation}
                className="w-full rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
              >
                <span>✓ Sorted by Distance</span>
                <span className="text-stone-400">✕</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestLocation}
                disabled={isLocating}
                className="w-full rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
              >
                <span>📍</span>
                <span>{isLocating ? "Locating..." : "Near Me"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Error / Status Feedback */}
        {locationError && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between">
            <span>{locationError}</span>
            <button
              type="button"
              onClick={() => setLocationError(null)}
              className="text-stone-400 hover:text-stone-600 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Filters Summary & Results Count */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">
              {filteredAndSortedMosques.length} locations found
            </span>
            {(searchQuery || selectedClassification !== "ALL" || selectedCity !== "ALL" || userLocation) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClassification("ALL");
                  setSelectedCity("ALL");
                  setUserLocation(null);
                }}
                className="text-emerald-700 hover:underline font-medium ml-2"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* View Toggle on smaller screens */}
          <div className="flex sm:hidden items-center gap-1 rounded-lg border border-stone-200 p-0.5 bg-stone-50">
            <button
              type="button"
              onClick={() => setMapMode("list")}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                mapMode === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setMapMode("map")}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                mapMode === "map" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split List + Map on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Mosque Cards */}
        <div
          className={`lg:col-span-7 space-y-3.5 ${
            mapMode === "map" ? "hidden sm:block" : "block"
          }`}
        >
          {filteredAndSortedMosques.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <span className="text-3xl block mb-2" aria-hidden="true">
                🔍
              </span>
              <h3 className="text-base font-semibold text-stone-800">
                No matching locations found
              </h3>
              <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search query, selecting &quot;All Place Types&quot;, or clearing the municipality filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClassification("ALL");
                  setSelectedCity("ALL");
                }}
                className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredAndSortedMosques.map(({ mosque, distanceKm }) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                distanceKm={distanceKm}
                isSelected={selectedMosque?.id === mosque.id}
                hasVerifiedIqamah={verifiedIqamahSet.has(mosque.id)}
                hasVerifiedJummah={verifiedJummahSet.has(mosque.id)}
                onSelectOnMap={() => {
                  setSelectedMosqueId(mosque.id);
                  // On mobile, switch to map view
                  if (window.innerWidth < 640) {
                    setMapMode("map");
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Right Column: Sticky Map */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-6 ${
            mapMode === "list" ? "hidden sm:block" : "block"
          }`}
        >
          <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Location Map
                </h3>
                {selectedMosque && (
                  <p className="text-xs text-stone-600 truncate max-w-[240px]">
                    {selectedMosque.name}
                  </p>
                )}
              </div>
              {selectedMosque && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.coordinates.latitude},${selectedMosque.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Directions ↗
                </a>
              )}
            </div>

            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full bg-stone-100">
              <iframe
                title="Canadian Mosques Explorer Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
              <span>© OpenStreetMap contributors</span>
              {selectedMosque && (
                <span className="font-mono text-stone-600">
                  {selectedMosque.coordinates.latitude.toFixed(4)},{" "}
                  {selectedMosque.coordinates.longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
