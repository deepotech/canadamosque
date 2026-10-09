"use client";

import React, { useState } from "react";
import { isWithinCanadaBounds } from "@/domain/geo/coordinates";

interface GeolocationButtonProps {
  onLocationFound?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
}

export function GeolocationButton({
  onLocationFound,
  className = "",
}: GeolocationButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (!isWithinCanadaBounds(coords)) {
          setStatus("error");
          setErrorMessage("Your location appears to be outside Canada. This service is tailored for Canada.");
          return;
        }

        setStatus("success");
        if (onLocationFound) {
          onLocationFound(coords);
        } else {
          // Default behavior: navigate or update search params
          window.location.href = `/mosques?lat=${coords.latitude.toFixed(4)}&lng=${coords.longitude.toFixed(4)}`;
        }
      },
      (error) => {
        setStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Location permission was denied. You can search by Canadian city or postal code instead.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location information is currently unavailable.");
            break;
          case error.TIMEOUT:
            setErrorMessage("The request to determine your location timed out.");
            break;
          default:
            setErrorMessage("Unable to determine your location.");
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

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleRequestLocation}
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/30 active:scale-[0.99] disabled:opacity-75 transition-all ${className}`}
      >
        <span aria-hidden="true" className="text-lg">
          📍
        </span>
        <span>
          {status === "loading" ? "Locating..." : "Use My Location"}
        </span>
      </button>

      {/* Accessible status live-region for screen readers and user feedback */}
      <div
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[1.5rem] text-center text-xs text-stone-600"
      >
        {status === "loading" && <span>Finding closest Canadian mosques to you...</span>}
        {status === "error" && (
          <span className="text-rose-600 font-medium">{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
