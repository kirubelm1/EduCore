"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Bell, Trophy, CalendarIcon, GraduationCap } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";

interface Class {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  schedule: string;
  description?: string;
}

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);

  const navItems = [
    { href: "/student", label: "Dashboard", icon: <Trophy className="h-4 w-4" /> },
    { href: "/student/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/student/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/student/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getDocuments("classes");
        setClasses(data as Class[]);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Student Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Classes</h1>
            <p className="text-muted-foreground">
              View your class schedule and details
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No classes available</p>
                  <p className="text-sm text-muted-foreground">Check back later for your class schedule</p>
                </CardContent>
              </Card>
            ) : (
              classes.map((classItem) => (
                <Card key={classItem.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.schedule}</span>
                      </div>
                      {classItem.description && (
                        <p className="text-muted-foreground mt-2">{classItem.description}</p>
                      )}
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
