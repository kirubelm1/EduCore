import { Permission, UserRole } from "./auth";

export interface RolePermissions {
  role: UserRole;
  defaultPermissions: Permission[];
}

// Default permission sets for each role
export const DEFAULT_PERMISSIONS: RolePermissions[] = [
  {
    role: "school_admin",
    defaultPermissions: [
      { module: "students", actions: ["create", "read", "update", "delete"] },
      { module: "teachers", actions: ["create", "read", "update", "delete"] },
      { module: "parents", actions: ["create", "read", "update", "delete"] },
      { module: "classes", actions: ["create", "read", "update", "delete"] },
      { module: "assignments", actions: ["create", "read", "update", "delete"] },
      { module: "grades", actions: ["create", "read", "update", "delete"] },
      { module: "announcements", actions: ["create", "read", "update", "delete"] },
      { module: "attendance", actions: ["create", "read", "update", "delete"] },
      { module: "reports", actions: ["read", "export"] },
      { module: "settings", actions: ["read", "update"] },
    ],
  },
  {
    role: "teacher",
    defaultPermissions: [
      { module: "students", actions: ["read"] },
      { module: "classes", actions: ["read"] },
      { module: "assignments", actions: ["create", "read", "update", "delete"] },
      { module: "grades", actions: ["create", "read", "update"] },
      { module: "announcements", actions: ["create", "read"] },
      { module: "attendance", actions: ["create", "read", "update"] },
      { module: "reports", actions: ["read"] },
    ],
  },
  {
    role: "student",
    defaultPermissions: [
      { module: "assignments", actions: ["read"] },
      { module: "grades", actions: ["read"] },
      { module: "announcements", actions: ["read"] },
      { module: "attendance", actions: ["read"] },
      { module: "classes", actions: ["read"] },
    ],
  },
  {
    role: "parent",
    defaultPermissions: [
      { module: "students", actions: ["read"] }, // Only their children
      { module: "assignments", actions: ["read"] },
      { module: "grades", actions: ["read"] },
      { module: "announcements", actions: ["read"] },
      { module: "attendance", actions: ["read"] },
      { module: "classes", actions: ["read"] },
    ],
  },
];

export function getDefaultPermissions(role: UserRole): Permission[] {
  const rolePerms = DEFAULT_PERMISSIONS.find(rp => rp.role === role);
  return rolePerms ? rolePerms.defaultPermissions : [];
}
