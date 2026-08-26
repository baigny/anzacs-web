import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminEnquiriesPage from "../admin/AdminEnquiriesPage";
import * as enquiriesApi from "../api/enquiries.api";

vi.mock("../api/enquiries.api");

describe("AdminEnquiriesPage (admin inbox)", () => {
  it("renders submitted enquiries as read-only rows with a status control", async () => {
    vi.mocked(enquiriesApi.fetchAdminEnquiries).mockResolvedValue([
      {
        id: "1",
        name: "Test Farmer",
        mobile: "9999999999",
        cropInterest: "Tomato",
        productId: null,
        message: "Interested in F1-KING",
        consent: true,
        status: "new",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<AdminEnquiriesPage />);

    expect(await screen.findByText("Test Farmer")).toBeInTheDocument();
    expect(screen.getByText("9999999999")).toBeInTheDocument();
    // The submitted message is displayed as plain text, not an editable field.
    expect(screen.getByText("Interested in F1-KING")).toBeInTheDocument();
    expect(screen.getByLabelText(/update status for test farmer/i)).toBeInTheDocument();
  });
});
