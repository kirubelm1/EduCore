"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAnnouncements: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes, announcements] = await Promise.all([
          getDocuments("users", [{ field: "role", operator: "==", value: "student" }]),
          getDocuments("users", [{ field: "role", operator: "==", value: "teacher" }]),
          getDocuments("classes"),
          getDocuments("announcements"),
        ]);

        setStats({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalClasses: classes.length,
          totalAnnouncements: announcements.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, Administrator</h1>
            <p className="text-muted-foreground">
              Manage your school's students, teachers, classes, and announcements
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">Active teachers</p>
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
                <p className="text-xs text-muted-foreground">Total announcements</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/admin/students"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Students</p>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove students</p>
                  </div>
                </a>
                <a
                  href="/admin/teachers"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Teachers</p>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove teachers</p>
                  </div>
                </a>
                <a
                  href="/admin/classes"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Classes</p>
                    <p className="text-sm text-muted-foreground">Create and organize classes</p>
                  </div>
                </a>
                <a
                  href="/admin/announcements"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Announcement</p>
                    <p className="text-sm text-muted-foreground">Send messages to users</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm font-medium">System online</p>
                      <p className="text-xs text-muted-foreground">All services running normally</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                    <div>
                      <p className="text-sm font-medium">Database connected</p>
                      <p className="text-xs text-muted-foreground">Firebase integration active</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                    <div>
                      <p className="text-sm font-medium">Storage ready</p>
                      <p className="text-xs text-muted-foreground">File uploads enabled</p>
                    </div>
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
