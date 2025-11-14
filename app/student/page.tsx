"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Bell, Trophy } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    totalAnnouncements: 0,
    averageGrade: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assignments, announcements] = await Promise.all([
          getDocuments("assignments"),
          getDocuments("announcements"),
        ]);

        setStats({
          totalAssignments: assignments.length,
          pendingAssignments: assignments.filter((a: any) => new Date(a.dueDate) > new Date()).length,
          totalAnnouncements: announcements.length,
          averageGrade: 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { href: "/student", label: "Dashboard", icon: <Trophy className="h-4 w-4" /> },
    { href: "/student/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/student/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/student/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Student Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userData?.fullName}</h1>
            <p className="text-muted-foreground">
              Track your assignments, grades, and stay updated with announcements
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">All assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
                <p className="text-xs text-muted-foreground">Not yet due</p>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Not available yet</p>
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
                  href="/student/assignments"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Assignments</p>
                    <p className="text-sm text-muted-foreground">Check homework and projects</p>
                  </div>
                </a>
                <a
                  href="/student/classes"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">My Classes</p>
                    <p className="text-sm text-muted-foreground">View your class schedule</p>
                  </div>
                </a>
                <a
                  href="/student/announcements"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Announcements</p>
                    <p className="text-sm text-muted-foreground">Read important updates</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Progress</CardTitle>
                <CardDescription>Your performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete your assignments on time to track your progress
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge>Grade {userData?.grade || "-"}</Badge>
                    <Badge variant="secondary">Section {userData?.section || "-"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
