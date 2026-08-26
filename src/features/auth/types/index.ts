import type { AdminRole } from "@/lib/database.types";

export interface AdminSession {
  userId: string;
  email: string | null;
  role: AdminRole;
  fullName: string;
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  root_admin: "Root Admin",
  app_admin: "App Admin",
};
