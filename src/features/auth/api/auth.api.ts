import { supabase } from "@/lib/supabase";
import type { AdminProfileRow } from "@/lib/database.types";
import type { AdminSession } from "../types";

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Resolves the current auth session into an AdminSession, or null if not an active admin. */
export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .eq("active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !profile) return null;

  const row = profile as AdminProfileRow;
  return { userId: row.id, email: user.email ?? null, role: row.role, fullName: row.full_name };
}

/** root_admin only: invite another admin by creating their auth user + profile row. */
export async function inviteAdmin(params: {
  email: string;
  fullName: string;
  role: "root_admin" | "app_admin";
}): Promise<void> {
  // Supabase JS client cannot create auth users directly (that's an admin-API /
  // service-role operation). In production this calls a root-only edge function
  // that uses the service role key server-side. Left as a clearly-marked
  // extension point for the real deployment.
  throw new Error(
    `inviteAdmin() requires a server-side (service role) call; wire this to an edge function before use. ` +
      `Requested: ${params.email} as ${params.role}`,
  );
}

export async function deactivateAdmin(adminId: string): Promise<void> {
  const { error } = await supabase.from("admin_profiles").update({ active: false }).eq("id", adminId);
  if (error) throw error;
}

export async function fetchAllAdmins(): Promise<AdminProfileRow[]> {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as AdminProfileRow[];
}
