import { useCallback, useEffect, useState } from "react";

// Admin-only UI preferences (table density, view mode, etc.) that should
// live in localStorage, never in the database.
//
// Usage: const [density, setDensity] = useLocalSettings("admin.products.density", "comfortable");

export function useLocalSettings<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const storageKey = `anzacs-web:${key}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) - ignore.
    }
  }, [storageKey, value]);

  const update = useCallback((next: T) => setValue(next), []);

  return [value, update];
}
