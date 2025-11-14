"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Bell, BookOpen } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function ParentDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalChildren: 0,
    pendingAssignments: 0,
    totalAnnouncements: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assignments, announcements, classes] = await Promise.all([
          getDocuments("assignments"),
          getDocuments("announcements"),
          getDocuments("classes"),
        ]);

        setStats({
          totalChildren: 0,
          pendingAssignments: assignments.filter((a: any) => new Date(a.dueDate) > new Date()).length,
          totalAnnouncements: announcements.length,
          totalClasses: classes.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { href: "/parent", label: "Dashboard", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/children", label: "My Children", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/parent/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <AuthGuard allowedRoles={["parent"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Parent Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userData?.fullName}</h1>
            <p className="text-muted-foreground">
              Monitor your children's academic progress and stay informed
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Children</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChildren}</div>
                <p className="text-xs text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Work</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
                <p className="text-xs text-muted-foreground">Upcoming assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
                <p className="text-xs text-muted-foreground">Recent updates</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Frequently used sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/parent/children"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Children</p>
                    <p className="text-sm text-muted-foreground">See your children's profiles</p>
                  </div>
                </a>
                <a
                  href="/parent/assignments"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Track Assignments</p>
                    <p className="text-sm text-muted-foreground">Monitor homework progress</p>
                  </div>
                </a>
                <a
                  href="/parent/announcements"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Read Announcements</p>
                    <p className="text-sm text-muted-foreground">Stay informed about school updates</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Overview</CardTitle>
                <CardDescription>Your children's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add your children to track their academic progress and stay connected with their education
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
