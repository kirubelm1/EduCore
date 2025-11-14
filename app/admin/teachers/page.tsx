"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, createDocument, updateDocument } from "@/lib/firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  fullName: string;
  email: string;
  subject?: string;
  department?: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    department: "",
  });

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getDocuments("users", [
        { field: "role", operator: "==", value: "teacher" },
      ]);
      setTeachers(data as Teacher[]);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTeacher) {
        await updateDocument("users", editingTeacher.id, formData);
        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      } else {
        await createDocument("users", {
          ...formData,
          role: "teacher",
        });
        toast({
          title: "Success",
          description: "Teacher added successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingTeacher(null);
      setFormData({ fullName: "", email: "", subject: "", department: "" });
      fetchTeachers();
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast({
        title: "Error",
        description: "Failed to save teacher",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      fullName: teacher.fullName,
      email: teacher.email,
      subject: teacher.subject || "",
      department: teacher.department || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteDocument("users", id);
        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        });
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
        toast({
          title: "Error",
          description: "Failed to delete teacher",
          variant: "destructive",
        });
      }
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    (teacher.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (teacher.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Teacher Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage all teachers in the system
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Teachers</CardTitle>
                  <CardDescription>A list of all teachers in the system</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingTeacher(null);
                      setFormData({ fullName: "", email: "", subject: "", department: "" });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Teacher
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTeacher
                          ? "Update teacher information"
                          : "Enter teacher details to add them to the system"}
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
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="e.g., Science"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingTeacher ? "Update" : "Add"} Teacher
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
                    placeholder="Search teachers by name or email..."
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
                      <TableHead>Subject</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No teachers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.fullName}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{teacher.subject || "-"}</TableCell>
                          <TableCell>{teacher.department || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(teacher)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(teacher.id)}
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
