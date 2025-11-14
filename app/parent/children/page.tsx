"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Bell, BookOpen } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  fullName: string;
  email: string;
  grade?: string;
  section?: string;
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Student[]>([]);

  const navItems = [
    { href: "/parent", label: "Dashboard", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/children", label: "My Children", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/parent/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getDocuments("users", [
          { field: "role", operator: "==", value: "student" },
        ]);
        setChildren(data as Student[]);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, []);

  return (
    <AuthGuard allowedRoles={["parent"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Parent Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Children</h1>
            <p className="text-muted-foreground">
              View your children's academic information
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No children linked to your account</p>
                  <p className="text-sm text-muted-foreground">Contact the school administrator to link your children</p>
                </CardContent>
              </Card>
            ) : (
              children.map((child) => (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{child.fullName}</CardTitle>
                    <CardDescription>{child.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge>Grade {child.grade || "-"}</Badge>
                        <Badge variant="secondary">Section {child.section || "-"}</Badge>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Academic Status</p>
                        <p className="text-sm text-muted-foreground">Active enrollment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
