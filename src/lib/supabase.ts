import { createClient } from "@supabase/supabase-js";

// NOTE: we intentionally do NOT pass the `Database` generic from
// ./database.types here. Supabase-js's generated-schema generic requires an
// exact shape (Tables/Views/Functions/Enums/CompositeTypes with
// Row/Insert/Update/Relationships on every table) to produce useful types;
// a hand-maintained approximation instead produces `never` on every
// insert/update call, which is worse than no generic at all. database.types.ts
// stays as the authoritative row shape reference for the mapper functions in
// each feature's api/*.ts file. Once a real project is linked, regenerate
// with `supabase gen types typescript` and re-attach it here.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in dev rather than silently querying an undefined backend.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. " +
      "Copy .env.example to .env.local and fill in your Supabase project values.",
  );
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
