import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "../public/ProductsPage";
import { EnquiryModalProvider } from "@/components/enquiry/EnquiryModalProvider";
import * as productsApi from "../api/products.api";
import type { Product } from "../types";

vi.mock("../api/products.api");
vi.mock("@/lib/trackEvent", () => ({ trackEvent: vi.fn() }));

const mockProducts: Product[] = [
  {
    id: "1",
    catalogSection: "hybrid",
    cropType: "Tomato",
    name: "F1-KING",
    slug: "tomato-f1-king",
    heroImageUrl: null,
    regionTags: ["South"],
    active: true,
    sortOrder: 0,
    attributes: [{ id: "a1", label: "Maturity", value: "60 days", sortOrder: 0 }],
  },
  {
    id: "2",
    catalogSection: "open_pollinated",
    cropType: "Carrot",
    name: "Red Core",
    slug: "carrot-red-core",
    heroImageUrl: null,
    regionTags: ["North"],
    active: true,
    sortOrder: 1,
    attributes: [],
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <EnquiryModalProvider>
        <ProductsPage />
      </EnquiryModalProvider>
    </MemoryRouter>,
  );
}

describe("ProductsPage (public)", () => {
  beforeEach(() => {
    vi.mocked(productsApi.fetchPublicProducts).mockResolvedValue(mockProducts);
  });

  it("renders fetched products", async () => {
    renderPage();
    expect(await screen.findByText("F1-KING")).toBeInTheDocument();
    expect(screen.getByText("Red Core")).toBeInTheDocument();
  });

  it("filters products by search text", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("F1-KING");

    const search = screen.getByLabelText(/search products/i);
    await user.type(search, "carrot");

    await waitFor(() => {
      expect(screen.queryByText("F1-KING")).not.toBeInTheDocument();
      expect(screen.getByText("Red Core")).toBeInTheDocument();
    });
  });

  it("shows an error message when the fetch fails (RLS/network failure case)", async () => {
    vi.mocked(productsApi.fetchPublicProducts).mockRejectedValueOnce(new Error("permission denied"));
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent(/permission denied/i);
  });
});
