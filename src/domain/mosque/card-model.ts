import { Mosque, MosqueClassification } from "./types";
import { getFacilityOpenStatus } from "../opening-hours/status";

/**
 * Minimal presentation model for MosqueCard.
 * 
 * Strict architectural rule:
 * Contains ONLY the properties required to render the card UI, links, and accessibility tags.
 * Excludes heavy server-side metadata (e.g. sourceMetadata, raw Google Maps artifacts,
 * unformatted raw schedules, confidence scores, and unused database relations)
 * to drastically reduce the React Flight serialization payload on directory pages.
 */
export interface MosqueCardItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  classification: MosqueClassification;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  facilities: {
    wheelchairAccessible: boolean | null;
    parkingAvailable: boolean | null;
    womenPrayerSection: boolean | null;
  };
  isOpen: boolean | null;
}

/**
 * Maps a full canonical Mosque domain entity to a minimal MosqueCardItem.
 * 
 * Precomputes the boolean open/closed status on the server so that full 7-day
 * schedule period arrays do not need to be transmitted in the RSC Flight stream.
 */
export function toMosqueCardItem(mosque: Mosque): MosqueCardItem {
  const openStatus = getFacilityOpenStatus(mosque.openingHours, mosque.timezone);

  return {
    id: mosque.id,
    name: mosque.name,
    slug: mosque.slug,
    address: mosque.address,
    classification: mosque.classification,
    coordinates: {
      latitude: mosque.coordinates.latitude,
      longitude: mosque.coordinates.longitude,
    },
    facilities: {
      wheelchairAccessible: mosque.facilities?.wheelchairAccessible ?? null,
      parkingAvailable: mosque.facilities?.parkingAvailable ?? null,
      womenPrayerSection: mosque.facilities?.womenPrayerSection ?? null,
    },
    isOpen: openStatus.isOpen,
  };
}
