"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Shield } from 'lucide-react';
import { AuditLogViewer } from "@/components/audit-log-viewer";

export default function AuditPage() {
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
    { href: "/admin/permissions", label: "Permissions", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <AuthGuard allowedRoles={["school_admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all actions and changes made in your school system
            </p>
          </div>

          <AuditLogViewer />
        </main>
      </div>
    </AuthGuard>
  );
}
