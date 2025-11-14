"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Shield, Search } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { getDocuments } from "@/lib/firebase/firestore";
import { UserData } from "@/lib/firebase/auth";
import { PermissionSettingsModal } from "@/components/permission-settings-modal";

export default function PermissionsPage() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/teachers", label: "Teachers", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/admin/announcements", label: "Announcements", icon: <Bell className="h-4 w-4" /> },
    { href: "/admin/permissions", label: "Permissions", icon: <Shield className="h-4 w-4" /> },
  ];

  useEffect(() => {
    fetchUsers();
  }, [userData?.schoolId]);

  const fetchUsers = async () => {
    if (!userData?.schoolId) return;

    try {
      const allUsers = await getDocuments("users", userData.schoolId);
      setUsers(allUsers as UserData[]);
    } catch (error) {
      console.error("[v0] Error fetching users:", error);
    }
  };

  const handleManagePermissions = (user: UserData) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.role?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={["school_admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardNav navItems={navItems} title="Admin Dashboard" />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Permissions Management</h1>
            <p className="text-muted-foreground">
              Configure custom permissions for users in your school
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>Manage permissions for teachers, students, and parents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or role..."
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
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.uid}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {user.role.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.permissions 
                              ? `${user.permissions.length} custom permissions` 
                              : "Default permissions"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManagePermissions(user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
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
            user={selectedUser}
            open={modalOpen}
            onOpenChange={setModalOpen}
            onPermissionsUpdated={fetchUsers}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
