// Shared soft-delete query helper. Every read path (public and admin) should
// route through this instead of hand-rolling `.is("deleted_at", null)`.
//
// Usage:
//   withActiveOnly(supabase.from("products").select("*"))
//   withActiveOnly(supabase.from("products").select("*"), { includeInactive: true })
//     -> admin views that also want soft-deleted-excluded but active=false rows

interface ActiveOnlyOptions {
  /** Column to additionally filter on truthiness (e.g. "active", "published", "consent"). */
  flagColumn?: string;
}

// Minimal structural type: anything with `.is()` and `.eq()` chainable methods,
// which covers PostgrestFilterBuilder without importing its (unstable) generics.
interface FilterableQuery<T> {
  is(column: string, value: null): T;
  eq(column: string, value: boolean): T;
}

export function withActiveOnly<T extends FilterableQuery<T>>(
  query: T,
  options: ActiveOnlyOptions = {},
): T {
  let next = query.is("deleted_at", null);
  if (options.flagColumn) {
    next = next.eq(options.flagColumn, true);
  }
  return next;
}
