import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EnquiryModal } from "@/components/enquiry/EnquiryModal";
import * as enquiriesApi from "@/features/enquiries/api/enquiries.api";

vi.mock("@/features/enquiries/api/enquiries.api");
vi.mock("@/lib/trackEvent", () => ({ trackEvent: vi.fn() }));

describe("EnquiryModal (public form)", () => {
  it("blocks submit without consent and shows a validation error", async () => {
    const user = userEvent.setup();
    render(<EnquiryModal open onOpenChange={() => {}} />);

    await user.type(screen.getByLabelText(/name/i), "Test Farmer");
    await user.type(screen.getByLabelText(/mobile number/i), "9999999999");
    await user.click(screen.getByRole("button", { name: /submit enquiry/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/consent/i);
    expect(enquiriesApi.submitEnquiry).not.toHaveBeenCalled();
  });

  it("submits successfully and shows the thank-you state, persisting to Supabase", async () => {
    vi.mocked(enquiriesApi.submitEnquiry).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<EnquiryModal open onOpenChange={() => {}} prefill={{ cropInterest: "Tomato", productId: "p1" }} />);

    await user.type(screen.getByLabelText(/name/i), "Test Farmer");
    await user.type(screen.getByLabelText(/mobile number/i), "9999999999");
    await user.click(screen.getByLabelText(/agree to be contacted/i));
    await user.click(screen.getByRole("button", { name: /submit enquiry/i }));

    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
    expect(enquiriesApi.submitEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Test Farmer", mobile: "9999999999", consent: true, productId: "p1" }),
    );
  });
});
