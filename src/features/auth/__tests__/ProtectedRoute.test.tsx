import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../admin/ProtectedRoute";

const useAuthMock = vi.fn();
vi.mock("../AuthProvider", () => ({ useAuth: () => useAuthMock() }));

function renderAt(path: string, requireRole?: "root_admin" | "app_admin") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute requireRole={requireRole} />}>
          <Route path={path} element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute (admin auth gate)", () => {
  it("redirects to the login page when there is no active admin session", () => {
    useAuthMock.mockReturnValue({ session: null, loading: false });
    renderAt("/admin");
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders protected content once an admin session exists", () => {
    useAuthMock.mockReturnValue({
      session: { userId: "1", email: "a@anzacs.in", role: "app_admin", fullName: "Admin" },
      loading: false,
    });
    renderAt("/admin");
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("blocks app_admin from a root_admin-only route", () => {
    useAuthMock.mockReturnValue({
      session: { userId: "1", email: "a@anzacs.in", role: "app_admin", fullName: "Admin" },
      loading: false,
    });
    renderAt("/admin/admins", "root_admin");
    // Redirected away from the root_admin-only route, never renders "Protected content".
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
