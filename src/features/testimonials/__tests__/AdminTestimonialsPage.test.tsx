import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminTestimonialsPage from "../admin/AdminTestimonialsPage";
import * as testimonialsApi from "../api/testimonials.api";

vi.mock("../api/testimonials.api");

describe("AdminTestimonialsPage (admin CRUD)", () => {
  it("creates a testimonial with consent defaulted to false", async () => {
    vi.mocked(testimonialsApi.fetchAdminTestimonials).mockResolvedValue([]);
    vi.mocked(testimonialsApi.createTestimonial).mockResolvedValue("id-1");
    const user = userEvent.setup();

    render(<AdminTestimonialsPage />);
    await user.click(screen.getByRole("button", { name: /add testimonial/i }));

    await user.type(screen.getByLabelText(/^name$/i), "New Farmer");
    await user.type(screen.getByLabelText(/quote/i), "Very helpful team");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(testimonialsApi.createTestimonial).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Farmer", quote: "Very helpful team", consent: false }),
    );
  });
});
