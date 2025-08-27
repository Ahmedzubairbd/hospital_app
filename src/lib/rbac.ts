import type { AppRole } from "./auth";

export type RoleGuard = {
  allow: AppRole[];
};

export function hasRole(
  role: AppRole | null | undefined,
  allowed: AppRole[],
): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

export function assertRole(
  role: AppRole | null | undefined,
  allowed: AppRole[],
): asserts role is AppRole {
  if (!hasRole(role, allowed)) {
    throw new Error("Forbidden: insufficient role");
  }
}

// Example presets
export const Guards = {
  AdminOnly: { allow: ["admin"] as const },
  Staff: { allow: ["admin", "moderator", "doctor"] as const },
  Portal: { allow: ["doctor", "patient"] as const },
};
