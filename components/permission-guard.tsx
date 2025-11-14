"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/firebase/auth";

interface PermissionGuardProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
}

export function PermissionGuard({ children, module, action, fallback = null }: PermissionGuardProps) {
  const { userData } = useAuth();

  if (!hasPermission(userData, module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
