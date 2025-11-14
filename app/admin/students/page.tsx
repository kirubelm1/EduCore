"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "@/lib/firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createDocument, updateDocument } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  fullName: string;
  email: string;
  grade?: string;
  section?: string;
  enrollmentDate?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    grade: "",
    section: "",
  });

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getDocuments("users", [
        { field: "role", operator: "==", value: "student" },
      ]);
      setStudents(data as Student[]);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        await updateDocument("users", editingStudent.id, formData);
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        await createDocument("users", {
          ...formData,
          role: "student",
          enrollmentDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingStudent(null);
      setFormData({ fullName: "", email: "", grade: "", section: "" });
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      grade: student.grade || "",
      section: student.section || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDocument("users", id);
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        });
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    (student.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage all students in the system
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Students</CardTitle>
                  <CardDescription>A list of all enrolled students</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingStudent(null);
                      setFormData({ fullName: "", email: "", grade: "", section: "" });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingStudent ? "Edit Student" : "Add New Student"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStudent
                          ? "Update student information"
                          : "Enter student details to add them to the system"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="grade">Grade</Label>
                          <Input
                            id="grade"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            placeholder="e.g., 10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="section">Section</Label>
                          <Input
                            id="section"
                            value={formData.section}
                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            placeholder="e.g., A"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingStudent ? "Update" : "Add"} Student
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(student.id)}
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
        </main>
      </div>
    </AuthGuard>
  );
}
