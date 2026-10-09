export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function isValidCoordinates(coords: unknown): coords is Coordinates {
  if (typeof coords !== "object" || coords === null) return false;
  const c = coords as Record<string, unknown>;
  return (
    typeof c.latitude === "number" &&
    !Number.isNaN(c.latitude) &&
    c.latitude >= -90 &&
    c.latitude <= 90 &&
    typeof c.longitude === "number" &&
    !Number.isNaN(c.longitude) &&
    c.longitude >= -180 &&
    c.longitude <= 180
  );
}

/**
 * Validates whether coordinates fall reasonably within Canada's landmass and territorial bounds.
 * Latitude approx: 41.67° N (Middle Island, ON) to 83.11° N (Cape Columbia, NU)
 * Longitude approx: -141.00° W (Yukon border) to -52.61° W (Cape Spear, NL)
 */
export function isWithinCanadaBounds(coords: Coordinates): boolean {
  return (
    coords.latitude >= 41.6 &&
    coords.latitude <= 83.2 &&
    coords.longitude >= -141.1 &&
    coords.longitude <= -52.6
  );
}
