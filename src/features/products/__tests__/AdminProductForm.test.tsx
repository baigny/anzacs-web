import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminProductFormPage from "../admin/AdminProductFormPage";
import * as productsApi from "../api/products.api";

vi.mock("../api/products.api");

describe("AdminProductFormPage (admin CRUD)", () => {
  it("blocks submit and shows a validation error when required fields are empty", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/products/new"]}>
        <AdminProductFormPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /save product/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/required/i);
    expect(productsApi.createProduct).not.toHaveBeenCalled();
  });

  it("submits a valid new product", async () => {
    vi.mocked(productsApi.createProduct).mockResolvedValue("new-id");
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/products/new"]}>
        <AdminProductFormPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/^name$/i), "F1-TEST");
    await user.type(screen.getByLabelText(/^slug$/i), "f1-test");
    await user.type(screen.getByLabelText(/crop type/i), "Tomato");

    await user.click(screen.getByRole("button", { name: /save product/i }));

    expect(productsApi.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({ name: "F1-TEST", slug: "f1-test", cropType: "Tomato" }),
    );
  });
});
