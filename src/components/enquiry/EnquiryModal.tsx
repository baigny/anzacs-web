import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitEnquiry } from "@/features/enquiries/api/enquiries.api";
import { trackEvent } from "@/lib/trackEvent";

const CROP_OPTIONS = [
  "Bottle Gourd",
  "Okra",
  "Bitter Gourd",
  "Cucumber",
  "Capsicum",
  "Ridge Gourd",
  "Chilli",
  "Watermelon",
  "Tomato",
  "Cabbage",
  "Carrot",
  "Cauliflower",
  "Coriander",
  "Peas",
  "Onion",
  "Basil",
  "Other / not sure",
];

interface EnquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: { cropInterest?: string; productId?: string };
}

export function EnquiryModal({ open, onOpenChange, prefill }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cropInterest, setCropInterest] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCropInterest(prefill?.cropInterest ?? "");
      setSubmitted(false);
      setError(null);
      trackEvent("enquiry_modal_open", { cropInterest: prefill?.cropInterest ?? null });
    }
  }, [open, prefill?.cropInterest]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !mobile.trim() || !consent) {
      setError("Please fill your name, mobile number, and accept the consent checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        name,
        mobile,
        cropInterest,
        message,
        consent,
        productId: prefill?.productId ?? null,
      });
      trackEvent("enquiry_submit", { cropInterest });
      setSubmitted(true);
      setName("");
      setMobile("");
      setMessage("");
      setConsent(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong submitting your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="enquiry-modal-description">
        {submitted ? (
          <div className="py-6 text-center">
            <DialogHeader>
              <DialogTitle>Thank you!</DialogTitle>
              <DialogDescription id="enquiry-modal-description">
                We've received your enquiry and our team will reach out to you shortly.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Talk to an expert</DialogTitle>
              <DialogDescription id="enquiry-modal-description">
                Tell us a little about your farm and we'll recommend the right seed.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="enquiry-name">Name</Label>
                <Input id="enquiry-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="enquiry-mobile">Mobile number</Label>
                <Input
                  id="enquiry-mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="enquiry-crop">Crop interest</Label>
                <Select value={cropInterest} onValueChange={setCropInterest}>
                  <SelectTrigger id="enquiry-crop">
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_OPTIONS.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="enquiry-message">Message</Label>
                <Textarea
                  id="enquiry-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your land, region, or what you're looking to grow"
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="enquiry-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <Label htmlFor="enquiry-consent" className="font-normal">
                  I agree to be contacted by ANZ Agri Crop Sciences about my enquiry.
                </Label>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit enquiry"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
