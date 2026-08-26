import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deactivateAdmin, fetchAllAdmins } from "../api/auth.api";
import type { AdminProfileRow } from "@/lib/database.types";
import { ADMIN_ROLE_LABELS } from "../types";

/**
 * root_admin-only. Route is protected by <ProtectedRoute requireRole="root_admin" />
 * and by the admin_profiles_root_all RLS policy (server-side enforcement, not just UI).
 */
export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAdmins(await fetchAllAdmins());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this admin account?")) return;
    await deactivateAdmin(id);
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-canopy">Manage Admins</h1>
      <p className="mt-1 text-charcoal/70">
        Only root_admin can invite or deactivate other admin accounts. New admins are provisioned
        via the Supabase Auth admin API (server-side) plus an admin_profiles row -- there is no
        public sign-up.
      </p>

      {loading ? (
        <p className="mt-6 text-center text-charcoal/60">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{a.full_name || a.id}</td>
                  <td className="px-4 py-3">{ADMIN_ROLE_LABELS[a.role]}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.active ? "status" : "muted"}>{a.active ? "Active" : "Deactivated"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.active && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeactivate(a.id)}>
                        Deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
