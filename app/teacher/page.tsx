"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalAssignments: 0,
    totalStudents: 0,
    upcomingDeadlines: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classes, assignments] = await Promise.all([
          getDocuments("classes", [{ field: "teacher", operator: "==", value: userData?.fullName || "" }]),
          getDocuments("assignments", [{ field: "teacherId", operator: "==", value: userData?.uid || "" }]),
        ]);

        setStats({
          totalClasses: classes.length,
          totalAssignments: assignments.length,
          totalStudents: 0,
          upcomingDeadlines: assignments.filter((a: any) => new Date(a.dueDate) > new Date()).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (userData) {
      fetchStats();
    }
  }, [userData]);

  const navItems = [
    { href: "/teacher", label: "Dashboard", icon: <Calendar className="h-4 w-4" /> },
    { href: "/teacher/classes", label: "My Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/teacher/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/teacher/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Teacher Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {userData?.fullName}</h1>
            <p className="text-muted-foreground">
              Manage your classes, assignments, and track student progress
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">Total created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                <p className="text-xs text-muted-foreground">Assignment deadlines</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common teaching tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/teacher/assignments"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Assignment</p>
                    <p className="text-sm text-muted-foreground">Add new homework or project</p>
                  </div>
                </a>
                <a
                  href="/teacher/classes"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Classes</p>
                    <p className="text-sm text-muted-foreground">Manage your class schedules</p>
                  </div>
                </a>
                <a
                  href="/teacher/students"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Students</p>
                    <p className="text-sm text-muted-foreground">Track student performance</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No classes scheduled for today
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
