import { createAuditLog } from "./audit";

export async function logUserAction(
  schoolId: string,
  userId: string,
  userName: string,
  action: string,
  module: string,
  targetId?: string,
  targetType?: string,
  changes?: any
) {
  try {
    await createAuditLog({
      schoolId,
      userId,
      userName,
      action,
      module,
      targetId,
      targetType,
      changes,
    });
  } catch (error) {
    console.error("[v0] Failed to log audit entry:", error);
    // Don't throw - audit logging failures shouldn't break the main operation
  }
}

export async function logCreate(
  schoolId: string,
  userId: string,
  userName: string,
  module: string,
  targetId: string,
  targetType: string,
  data?: any
) {
  return logUserAction(
    schoolId,
    userId,
    userName,
    `create_${module.slice(0, -1)}`, // Remove trailing 's' for singular form
    module,
    targetId,
    targetType,
    { created: data }
  );
}

export async function logUpdate(
  schoolId: string,
  userId: string,
  userName: string,
  module: string,
  targetId: string,
  targetType: string,
  oldData?: any,
  newData?: any
) {
  return logUserAction(
    schoolId,
    userId,
    userName,
    `update_${module.slice(0, -1)}`,
    module,
    targetId,
    targetType,
    { before: oldData, after: newData }
  );
}

export async function logDelete(
  schoolId: string,
  userId: string,
  userName: string,
  module: string,
  targetId: string,
  targetType: string,
  data?: any
) {
  return logUserAction(
    schoolId,
    userId,
    userName,
    `delete_${module.slice(0, -1)}`,
    module,
    targetId,
    targetType,
    { deleted: data }
  );
}
