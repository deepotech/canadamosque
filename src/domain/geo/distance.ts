import { Coordinates } from "./coordinates";

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two geographic coordinates using the Haversine formula.
 * Returns distance in kilometers rounded to 2 decimal places.
 */
export function calculateHaversineDistanceKm(
  from: Coordinates,
  to: Coordinates
): number {
  const dLat = degreesToRadians(to.latitude - from.latitude);
  const dLon = degreesToRadians(to.longitude - from.longitude);

  const lat1 = degreesToRadians(from.latitude);
  const lat2 = degreesToRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats a distance in kilometers for display.
 * Under 1 km displays in meters (e.g., "650 m").
 * 1 km or more displays as "X.X km".
 */
export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
