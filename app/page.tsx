"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Bell } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">EduCore School Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            A comprehensive platform for managing students, teachers, parents, and administrators
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>For Schools</CardTitle>
              <CardDescription>Complete management solution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">User Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage students, teachers, parents, and admin accounts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Academic Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Assignments, grades, attendance, and timetables
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    Announcements and messaging between all users
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>Custom dashboards for each user type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="font-semibold text-sm">Admin Dashboard</p>
                <p className="text-xs text-muted-foreground">Full system management</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="font-semibold text-sm">Teacher Dashboard</p>
                <p className="text-xs text-muted-foreground">Class and student management</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="font-semibold text-sm">Student Dashboard</p>
                <p className="text-xs text-muted-foreground">Assignments and grades</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="font-semibold text-sm">Parent Dashboard</p>
                <p className="text-xs text-muted-foreground">Track child's progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
