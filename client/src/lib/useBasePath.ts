import { useBrowserLocation } from "wouter/use-browser-location";

const base = ""; // Empty for VPS deployment on root domain

export const useBasePathLocation = (): [string, (to: string) => void] => {
  const [location, setLocation] = useBrowserLocation();

  return [
    // Remove base path from location for matching
    location.startsWith(base) ? location.slice(base.length) || "/" : location,
    // Add base path when setting location
    (to: string) => setLocation(base + to),
  ];
};

