import { supabase } from "@/lib/supabase";
import { withActiveOnly } from "@/lib/withActiveOnly";
import type { SiteCopyRow } from "@/lib/database.types";

export type SiteCopyMap = Record<string, string>;

export async function fetchSiteCopy(): Promise<SiteCopyMap> {
  const { data, error } = await withActiveOnly(supabase.from("site_copy").select("*") as any);
  if (error) throw error;
  const map: SiteCopyMap = {};
  for (const row of (data ?? []) as SiteCopyRow[]) {
    map[row.key] = row.value;
  }
  return map;
}

export async function upsertSiteCopy(key: string, value: string): Promise<void> {
  const { error } = await supabase.from("site_copy").upsert({ key, value });
  if (error) throw error;
}

/** Convenience getter with a fallback so a missing key never breaks a page render. */
export function copy(map: SiteCopyMap, key: string, fallback = ""): string {
  return map[key] ?? fallback;
}
