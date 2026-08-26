import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitEnquiry } from "@/features/enquiries/api/enquiries.api";
import { trackEvent } from "@/lib/trackEvent";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "contact" });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !mobile.trim() || !consent) {
      setError("Please fill your name, mobile number, and accept the consent checkbox.");
      return;
    }
    setSubmitting(true);
    try {
      await submitEnquiry({ name, mobile, cropInterest: "", message, consent });
      trackEvent("enquiry_submit", { source: "contact_page" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container grid max-w-5xl gap-10 py-14 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">Contact</p>
        <h1 className="mt-2 text-3xl font-bold text-canopy md:text-4xl">Get in touch</h1>

        <div className="mt-6 rounded-lg border-2 border-dashed border-gold/60 bg-gold/10 p-6">
          <p className="font-semibold text-charcoal">Business details</p>
          <p className="mt-2 text-sm text-charcoal/70">
            ANZ TO PROVIDE: phone number, email address, and physical/office address.
          </p>
          <p className="mt-2 text-xs text-charcoal/50">
            No verified contact details were available on the previous site. Use the enquiry form
            alongside this page to reach us in the meantime.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-white p-6" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="text-xl font-bold text-canopy">Send an enquiry</h2>

        {submitted ? (
          <p className="mt-4 text-charcoal/85">
            Thank you! We've received your enquiry and our team will reach out to you shortly.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-mobile">Mobile number</Label>
              <Input id="contact-mobile" type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="contact-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
              <Label htmlFor="contact-consent" className="font-normal">
                I agree to be contacted by ANZ Agri Crop Sciences about my enquiry.
              </Label>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
