import { supabase } from "./supabase";

// Single reusable, no-PII observability hook for the public site.
// Writes to public.client_events; never throws (best-effort, fire-and-forget).
//
// Usage: trackEvent("product_card_click", { productSlug: "tomato-f1-king" })

export type TrackEventName =
  | "page_view"
  | "product_card_click"
  | "product_filter_use"
  | "enquiry_modal_open"
  | "enquiry_submit"
  | "knowledge_article_click";

export function trackEvent(
  eventName: TrackEventName,
  meta: Record<string, unknown> = {},
): void {
  // Fire and forget; deliberately not awaited by callers.
  void supabase
    .from("client_events")
    .insert({ event_name: eventName, meta })
    .then(({ error }) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.debug("[trackEvent] failed to record event", eventName, error.message);
      }
    });
}
