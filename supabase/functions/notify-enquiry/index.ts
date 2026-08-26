// supabase/functions/notify-enquiry/index.ts
//
// Extension point for future Brevo email notifications (explicitly deferred
// in this phase). Wired to fire on new enquiry INSERT (see migration
// 0008_notify_enquiry_webhook.sql for how to connect the webhook once a
// real Supabase project is linked).
//
// Today this function only logs that an enquiry arrived (to public.server_logs
// when service credentials are available, otherwise to console) and returns
// success. No email is sent. A future phase can drop a real Brevo API call
// in where NOTE below is, without restructuring the enquiry flow.

// deno-lint-ignore-file no-explicit-any
import { createClient } from "npm:@supabase/supabase-js@2";

interface EnquiryWebhookPayload {
  record?: {
    id: string;
    name: string;
    mobile: string;
    crop_interest: string | null;
    product_id: string | null;
    message: string | null;
    created_at: string;
  };
}

Deno.serve(async (req: Request) => {
  try {
    const payload = (await req.json()) as EnquiryWebhookPayload;
    const enquiry = payload.record;

    // NOTE (future phase): send a Brevo transactional email / notify ANZ
    // staff here using `enquiry`. Intentionally not implemented yet.
    console.log("[notify-enquiry] received enquiry", enquiry?.id ?? "unknown");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && serviceRoleKey && enquiry) {
      const admin = createClient(supabaseUrl, serviceRoleKey);
      await admin.from("server_logs").insert({
        source: "notify-enquiry",
        message: "Enquiry received (email notification not yet implemented)",
        meta: { enquiry_id: enquiry.id },
      });
    }

    return new Response(JSON.stringify({ ok: true, emailed: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[notify-enquiry] error", err);
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
});
