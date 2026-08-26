import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminKnowledgeFormPage from "../admin/AdminKnowledgeFormPage";
import * as knowledgeApi from "../api/knowledge.api";

vi.mock("../api/knowledge.api");

describe("AdminKnowledgeFormPage (admin CRUD)", () => {
  it("requires a title and slug before saving", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/knowledge/new"]}>
        <AdminKnowledgeFormPage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: /save article/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/required/i);
    expect(knowledgeApi.createArticle).not.toHaveBeenCalled();
  });

  it("saves a valid new article as a draft by default", async () => {
    vi.mocked(knowledgeApi.createArticle).mockResolvedValue("id-1");
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/knowledge/new"]}>
        <AdminKnowledgeFormPage />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/title/i), "Sowing Tips");
    await user.type(screen.getByLabelText(/slug/i), "sowing-tips");
    await user.click(screen.getByRole("button", { name: /save article/i }));

    expect(knowledgeApi.createArticle).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Sowing Tips", slug: "sowing-tips", published: false }),
    );
  });
});
