import { useAuth } from "./use-auth";
import { hasPermission } from "@/lib/firebase/auth";

export function usePermission() {
  const { userData } = useAuth();

  const checkPermission = (module: string, action: string): boolean => {
    return hasPermission(userData, module, action);
  };

  const canCreate = (module: string) => checkPermission(module, "create");
  const canRead = (module: string) => checkPermission(module, "read");
  const canUpdate = (module: string) => checkPermission(module, "update");
  const canDelete = (module: string) => checkPermission(module, "delete");

  return {
    checkPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userData,
  };
}
