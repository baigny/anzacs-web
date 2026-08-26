import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { signOut } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLE_LABELS } from "@/features/auth/types";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/knowledge", label: "Knowledge Articles" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/site-copy", label: "Site Copy" },
  { to: "/admin/enquiries", label: "Enquiries" },
];

export function AdminLayout() {
  const { session, refresh } = useAuth();

  async function handleSignOut() {
    await signOut();
    await refresh();
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="w-64 shrink-0 bg-canopy text-cream" aria-label="Admin navigation">
        <div className="p-6">
          <p className="text-lg font-bold">ANZ Admin</p>
          {session && (
            <p className="mt-1 text-xs text-cream/70">
              {session.email} &middot; {ADMIN_ROLE_LABELS[session.role]}
            </p>
          )}
        </div>
        <nav>
          <ul className="flex flex-col">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block px-6 py-3 text-sm font-semibold ${
                      isActive ? "bg-cream/10 text-lime" : "text-cream/85 hover:bg-cream/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {session?.role === "root_admin" && (
              <li>
                <NavLink
                  to="/admin/admins"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-sm font-semibold ${
                      isActive ? "bg-cream/10 text-lime" : "text-cream/85 hover:bg-cream/5"
                    }`
                  }
                >
                  Manage Admins
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="p-6">
          <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
