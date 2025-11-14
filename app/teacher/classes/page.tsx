"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

interface Class {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  schedule: string;
  description?: string;
}

export default function TeacherClassesPage() {
  const { userData } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);

  const navItems = [
    { href: "/teacher", label: "Dashboard", icon: <Calendar className="h-4 w-4" /> },
    { href: "/teacher/classes", label: "My Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/teacher/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/teacher/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getDocuments("classes", [
          { field: "teacher", operator: "==", value: userData?.fullName || "" },
        ]);
        setClasses(data as Class[]);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    if (userData) {
      fetchClasses();
    }
  }, [userData]);

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Teacher Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Classes</h1>
            <p className="text-muted-foreground">
              View and manage all your assigned classes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No classes assigned yet</p>
                  <p className="text-sm text-muted-foreground">Contact your administrator to get classes assigned</p>
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
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
