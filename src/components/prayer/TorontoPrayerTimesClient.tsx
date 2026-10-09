"use client";

import React from "react";
import { CityPrayerTimesClient } from "./CityPrayerTimesClient";
import { TORONTO_LOCATION } from "@/services/prayer/toronto";

interface Props {
  initialDate: string; // YYYY-MM-DD
  timezone: string;
}

export function TorontoPrayerTimesClient({ initialDate, timezone }: Props) {
  return (
    <CityPrayerTimesClient
      cityName="Toronto"
      coordinates={{
        latitude: TORONTO_LOCATION.latitude,
        longitude: TORONTO_LOCATION.longitude,
      }}
      timezone={timezone}
      initialDate={initialDate}
    />
  );
}
