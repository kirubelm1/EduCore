"use client";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Bell } from 'lucide-react';
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export default function ParentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const navItems = [
    { href: "/parent", label: "Dashboard", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/children", label: "My Children", icon: <Users className="h-4 w-4" /> },
    { href: "/parent/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/parent/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getDocuments("announcements");
        const filtered = (data as Announcement[]).filter(
          (a) => a.targetAudience === "all" || a.targetAudience === "parents"
        );
        setAnnouncements(filtered);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <AuthGuard allowedRoles={["parent"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Parent Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">School Announcements</h1>
            <p className="text-muted-foreground">
              Stay informed about important school updates
            </p>
          </div>

          <div className="space-y-4">
            {announcements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground">Check back later for updates</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle>{announcement.title}</CardTitle>
                          <Badge variant={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {announcement.content}
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
