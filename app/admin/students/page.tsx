"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Search, Trash2, Shield } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { AddUserModal } from "@/components/add-user-modal";
import { PermissionSettingsModal } from "@/components/permission-settings-modal";
import { createAuditLog } from "@/lib/firebase/audit";
import { UserData } from "@/lib/firebase/auth";

interface Student extends UserData {
  grade?: string;
  section?: string;
}

export default function StudentsPage() {
  const { userData } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
    { href: "/admin/permissions", label: "Permissions", icon: <Shield className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchStudents();
  }, [userData?.schoolId]);

  const fetchStudents = async () => {
    if (!userData?.schoolId) return;

    try {
      const data = await getDocuments("users", userData.schoolId, [
        { field: "role", operator: "==", value: "student" },
      ]);
      setStudents(data as Student[]);
    } catch (error) {
      console.error("[v0] Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (student: Student) => {
    if (!userData?.schoolId) return;

    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        await deleteDocument("users", student.uid, userData.schoolId);
        
        await createAuditLog({
          schoolId: userData.schoolId,
          userId: userData.uid,
          userName: userData.name,
          action: "delete_student",
          module: "students",
          targetId: student.uid,
          targetType: "user",
        });

        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        fetchStudents();
      } catch (error) {
        console.error("[v0] Error deleting student:", error);
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        });
      }
    }
  };

  const handleManagePermissions = (student: Student) => {
    setSelectedStudent(student);
    setPermissionsModalOpen(true);
  };

  const filteredStudents = students.filter((student) =>
    (student.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={["school_admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage all students in your school
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Students ({students.length})</CardTitle>
                  <CardDescription>A list of all enrolled students in your school</CardDescription>
                </div>
                <AddUserModal onUserAdded={fetchStudents} />
              </div>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No students found. Click "Add User" to create your first student account.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.uid}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.grade || "-"}</TableCell>
                          <TableCell>{student.section || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleManagePermissions(student)}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(student)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <PermissionSettingsModal
            user={selectedStudent}
            open={permissionsModalOpen}
            onOpenChange={setPermissionsModalOpen}
            onPermissionsUpdated={fetchStudents}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
