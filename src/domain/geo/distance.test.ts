import { describe, it, expect } from "vitest";
import {
  calculateHaversineDistanceKm,
  formatDistanceKm,
} from "./distance";
import { isValidCoordinates, isWithinCanadaBounds } from "./coordinates";

describe("Geo Utilities", () => {
  it("calculates accurate distance between known Toronto coordinates", () => {
    // CN Tower: 43.6426, -79.3871
    // Toronto City Hall: 43.6534, -79.3841
    const cnTower = { latitude: 43.6426, longitude: -79.3871 };
    const cityHall = { latitude: 43.6534, longitude: -79.3841 };

    const distance = calculateHaversineDistanceKm(cnTower, cityHall);
    // Real distance is ~1.23 km
    expect(distance).toBeGreaterThan(1.1);
    expect(distance).toBeLessThan(1.4);
  });

  it("returns 0 km when coordinates are identical", () => {
    const point = { latitude: 43.6532, longitude: -79.3832 };
    expect(calculateHaversineDistanceKm(point, point)).toBe(0);
  });

  it("formats distances under 1km in meters and over 1km in kilometers", () => {
    expect(formatDistanceKm(0.35)).toBe("350 m");
    expect(formatDistanceKm(2.45)).toBe("2.5 km");
    expect(formatDistanceKm(12.0)).toBe("12.0 km");
  });

  it("validates coordinates correctly", () => {
    expect(isValidCoordinates({ latitude: 43.6532, longitude: -79.3832 })).toBe(true);
    expect(isValidCoordinates({ latitude: 95, longitude: -79.3832 })).toBe(false);
    expect(isValidCoordinates({ latitude: "43", longitude: -79 })).toBe(false);
    expect(isValidCoordinates(null)).toBe(false);
  });

  it("validates Canadian geographical bounds", () => {
    // Toronto: inside
    expect(isWithinCanadaBounds({ latitude: 43.6532, longitude: -79.3832 })).toBe(true);
    // Vancouver: inside
    expect(isWithinCanadaBounds({ latitude: 49.2827, longitude: -123.1207 })).toBe(true);
    // New York City: outside
    expect(isWithinCanadaBounds({ latitude: 40.7128, longitude: -74.006 })).toBe(false);
    // London, UK: outside
    expect(isWithinCanadaBounds({ latitude: 51.5074, longitude: -0.1278 })).toBe(false);
  });
});
