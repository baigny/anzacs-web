import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../admin/LoginPage";
import * as authApi from "../api/auth.api";

const refreshMock = vi.fn();
vi.mock("../api/auth.api");
vi.mock("../AuthProvider", () => ({ useAuth: () => ({ refresh: refreshMock }) }));

describe("LoginPage (admin auth)", () => {
  it("shows an error message when sign-in fails", async () => {
    vi.mocked(authApi.signInWithPassword).mockRejectedValue(new Error("Invalid login credentials"));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "admin@anzacs.in");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid login credentials/i);
  });

  it("signs in successfully and refreshes the session", async () => {
    vi.mocked(authApi.signInWithPassword).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "admin@anzacs.in");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(authApi.signInWithPassword).toHaveBeenCalledWith("admin@anzacs.in", "correct-password");
  });
});
