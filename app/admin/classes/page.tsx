"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Plus, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, createDocument, updateDocument } from "@/lib/firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Class {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  schedule: string;
  description?: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    teacher: "",
    schedule: "",
    description: "",
  });

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getDocuments("classes");
      setClasses(data as Class[]);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingClass) {
        await updateDocument("classes", editingClass.id, formData);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        await createDocument("classes", formData);
        toast({
          title: "Success",
          description: "Class created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingClass(null);
      setFormData({ name: "", subject: "", teacher: "", schedule: "", description: "" });
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
      toast({
        title: "Error",
        description: "Failed to save class",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      subject: classItem.subject,
      teacher: classItem.teacher,
      schedule: classItem.schedule,
      description: classItem.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteDocument("classes", id);
        toast({
          title: "Success",
          description: "Class deleted successfully",
        });
        fetchClasses();
      } catch (error) {
        console.error("Error deleting class:", error);
        toast({
          title: "Error",
          description: "Failed to delete class",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Class Management</h1>
            <p className="text-muted-foreground">
              Create and manage classes in the system
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Classes</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingClass(null);
                  setFormData({ name: "", subject: "", teacher: "", schedule: "", description: "" });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingClass ? "Edit Class" : "Create New Class"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingClass
                      ? "Update class information"
                      : "Enter class details to create a new class"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Class Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Grade 10-A"
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Input
                      id="teacher"
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      placeholder="Teacher name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Class description (optional)"
                      rows={3}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingClass ? "Update" : "Create"} Class
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No classes created yet</p>
                  <p className="text-sm text-muted-foreground">Click "Add Class" to create your first class</p>
                </CardContent>
              </Card>
            ) : (
              classes.map((classItem) => (
                <Card key={classItem.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <CardDescription>{classItem.subject}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(classItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(classItem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
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
