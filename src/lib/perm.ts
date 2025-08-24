import type { Permission } from "@prisma/client";

export function hasPermission(
  userPerms: Permission[] | { permission: Permission }[],
  need: Permission
) {
  if (
    Array.isArray(userPerms) &&
    userPerms.length &&
    typeof userPerms[0] === "object"
  ) {
    return (userPerms as { permission: Permission }[]).some(
      (p) => p.permission === need
    );
  }
  return (userPerms as Permission[]).includes(need);
}
