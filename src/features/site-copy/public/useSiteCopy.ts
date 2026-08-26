import { useEffect, useState } from "react";
import { fetchSiteCopy, type SiteCopyMap } from "../api/siteCopy.api";

export function useSiteCopy() {
  const [siteCopy, setSiteCopy] = useState<SiteCopyMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSiteCopy()
      .then((map) => {
        if (!cancelled) setSiteCopy(map);
      })
      .catch(() => {
        // Public page keeps rendering with fallback copy on failure.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { siteCopy, loading };
}
