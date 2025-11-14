"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("school_admin" | "teacher" | "student" | "parent")[];
  redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo = "/login" }: AuthGuardProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
      } else if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
        switch (userData.role) {
          case "school_admin":
            router.push("/admin");
            break;
          case "teacher":
            router.push("/teacher");
            break;
          case "student":
            router.push("/student");
            break;
          case "parent":
            router.push("/parent");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [user, userData, loading, allowedRoles, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (allowedRoles && userData && !allowedRoles.includes(userData.role))) {
    return null;
  }

  return <>{children}</>;
}
