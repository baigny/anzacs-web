import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import KnowledgePage from "../public/KnowledgePage";
import * as knowledgeApi from "../api/knowledge.api";

vi.mock("../api/knowledge.api");
vi.mock("@/lib/trackEvent", () => ({ trackEvent: vi.fn() }));

describe("KnowledgePage (public)", () => {
  it("renders an empty state when there are no published articles", async () => {
    vi.mocked(knowledgeApi.fetchPublicArticles).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <KnowledgePage />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/no articles published yet/i)).toBeInTheDocument();
  });

  it("renders published articles when present", async () => {
    vi.mocked(knowledgeApi.fetchPublicArticles).mockResolvedValue([
      { id: "1", title: "Sowing Tips", slug: "sowing-tips", bodyMarkdown: "body", coverImageUrl: null, published: true },
    ]);
    render(
      <MemoryRouter>
        <KnowledgePage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Sowing Tips")).toBeInTheDocument();
  });
});
