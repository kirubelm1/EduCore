"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ClipboardList, Users, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments, deleteDocument, createDocument, updateDocument } from "@/lib/firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  className: string;
  teacherId: string;
  points: number;
}

export default function TeacherAssignmentsPage() {
  const { userData, user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    className: "",
    points: 100,
  });

  const navItems = [
    { href: "/teacher", label: "Dashboard", icon: <Calendar className="h-4 w-4" /> },
    { href: "/teacher/classes", label: "My Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/teacher/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/teacher/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    
    try {
      const data = await getDocuments("assignments", [
        { field: "teacherId", operator: "==", value: user.uid },
      ]);
      setAssignments(data as Assignment[]);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAssignment) {
        await updateDocument("assignments", editingAssignment.id, formData);
        toast({
          title: "Success",
          description: "Assignment updated successfully",
        });
      } else {
        await createDocument("assignments", {
          ...formData,
          teacherId: user?.uid,
          teacherName: userData?.fullName,
          createdAt: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingAssignment(null);
      setFormData({ title: "", description: "", dueDate: "", className: "", points: 100 });
      fetchAssignments();
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast({
        title: "Error",
        description: "Failed to save assignment",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      className: assignment.className,
      points: assignment.points,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteDocument("assignments", id);
        toast({
          title: "Success",
          description: "Assignment deleted successfully",
        });
        fetchAssignments();
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast({
          title: "Error",
          description: "Failed to delete assignment",
          variant: "destructive",
        });
      }
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <AuthGuard allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Teacher Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Assignments</h1>
            <p className="text-muted-foreground">
              Create and manage assignments for your classes
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Assignments</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingAssignment(null);
                  setFormData({ title: "", description: "", dueDate: "", className: "", points: 100 });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAssignment
                      ? "Update assignment details"
                      : "Create a new assignment for your students"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Chapter 5 Homework"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Assignment instructions and details..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        placeholder="e.g., Grade 10-A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Total Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingAssignment ? "Update" : "Create"} Assignment
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No assignments created yet</p>
                  <p className="text-sm text-muted-foreground">Click "Create Assignment" to get started</p>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle>{assignment.title}</CardTitle>
                          {isOverdue(assignment.dueDate) && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                        <CardDescription>
                          {assignment.className} • {assignment.points} points
                          {" • Due: "}
                          {new Date(assignment.dueDate).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
