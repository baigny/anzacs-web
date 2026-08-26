import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminSiteCopyPage from "../admin/AdminSiteCopyPage";
import * as siteCopyApi from "../api/siteCopy.api";

vi.mock("../api/siteCopy.api", async () => {
  const actual = await vi.importActual<typeof import("../api/siteCopy.api")>("../api/siteCopy.api");
  return { ...actual, fetchSiteCopy: vi.fn(), upsertSiteCopy: vi.fn() };
});

describe("AdminSiteCopyPage (admin editor)", () => {
  it("loads existing copy and saves an edited value", async () => {
    vi.mocked(siteCopyApi.fetchSiteCopy).mockResolvedValue({ hero_eyebrow: "Old text" });
    vi.mocked(siteCopyApi.upsertSiteCopy).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<AdminSiteCopyPage />);

    const field = (await screen.findByLabelText("hero_eyebrow")) as HTMLTextAreaElement;
    expect(field.value).toBe("Old text");

    await user.clear(field);
    await user.type(field, "New headline text");

    const saveButtons = screen.getAllByRole("button", { name: /^save$/i });
    await user.click(saveButtons[0]);

    expect(siteCopyApi.upsertSiteCopy).toHaveBeenCalledWith("hero_eyebrow", "New headline text");
  });
});
