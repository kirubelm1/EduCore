"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, ClipboardList, Users, Calendar, Search } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";

interface Student {
  id: string;
  fullName: string;
  email: string;
  grade?: string;
  section?: string;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { href: "/teacher", label: "Dashboard", icon: <Calendar className="h-4 w-4" /> },
    { href: "/teacher/classes", label: "My Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/teacher/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/teacher/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getDocuments("users", [
          { field: "role", operator: "==", value: "student" },
        ]);
        setStudents(data as Student[]);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Teacher Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Students</h1>
            <p className="text-muted-foreground">
              View all students in the system
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>A list of all enrolled students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.grade || "-"}</TableCell>
                          <TableCell>{student.section || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}
