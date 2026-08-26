import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "../public/TestimonialsSection";
import * as testimonialsApi from "../api/testimonials.api";

vi.mock("../api/testimonials.api");

describe("TestimonialsSection (public)", () => {
  it("renders nothing when there are no consented testimonials", async () => {
    vi.mocked(testimonialsApi.fetchPublicTestimonials).mockResolvedValue([]);
    const { container } = render(<TestimonialsSection />);
    // Allow the effect's promise to resolve.
    await Promise.resolve();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders consented testimonials returned by the API", async () => {
    vi.mocked(testimonialsApi.fetchPublicTestimonials).mockResolvedValue([
      { id: "1", name: "Mohammed Adnan", quote: "Great service", consent: true, photoUrl: null },
    ]);
    render(<TestimonialsSection />);
    expect(await screen.findByText("Mohammed Adnan")).toBeInTheDocument();
  });
});
