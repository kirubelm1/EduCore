"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Bell } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  teacherName: string;
  points: number;
}

export default function ParentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const navItems = [
    { href: "/parent", label: "Dashboard", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/children", label: "My Children", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/parent/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getDocuments("assignments");
        setAssignments(data as Assignment[]);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const upcomingAssignments = assignments.filter((a) => !isOverdue(a.dueDate));
  const overdueAssignments = assignments.filter((a) => isOverdue(a.dueDate));

  return (
    <AuthGuard allowedRoles={["parent"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Parent Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Children's Assignments</h1>
            <p className="text-muted-foreground">
              Track your children's homework and project deadlines
            </p>
          </div>

          {overdueAssignments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-destructive">Overdue Assignments</h2>
              <div className="space-y-4">
                {overdueAssignments.map((assignment) => (
                  <Card key={assignment.id} className="border-destructive">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle>{assignment.title}</CardTitle>
                            <Badge variant="destructive">Overdue</Badge>
                          </div>
                          <CardDescription>
                            {assignment.className} • {assignment.teacherName}
                            {" • "}
                            {assignment.points} points
                            {" • Due: "}
                            {new Date(assignment.dueDate).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {assignment.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
          </div>

          <div className="space-y-4">
            {upcomingAssignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming assignments</p>
                  <p className="text-sm text-muted-foreground">Your children are all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.className} • {assignment.teacherName}
                          {" • "}
                          {assignment.points} points
                          {" • Due: "}
                          {new Date(assignment.dueDate).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {assignment.description}
                    </p>
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
