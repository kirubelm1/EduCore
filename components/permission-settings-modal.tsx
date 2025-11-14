"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from 'lucide-react';
import { DEFAULT_PERMISSIONS } from "@/lib/firebase/permissions";
import { UserData, Permission } from "@/lib/firebase/auth";
import { updateDocument } from "@/lib/firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

interface PermissionSettingsModalProps {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionsUpdated?: () => void;
}

export function PermissionSettingsModal({
  user,
  open,
  onOpenChange,
  onPermissionsUpdated,
}: PermissionSettingsModalProps) {
  const { userData: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Modules available for permission management
  const modules = [
    { id: "students", label: "Students" },
    { id: "teachers", label: "Teachers" },
    { id: "parents", label: "Parents" },
    { id: "classes", label: "Classes" },
    { id: "assignments", label: "Assignments" },
    { id: "grades", label: "Grades" },
    { id: "announcements", label: "Announcements" },
    { id: "attendance", label: "Attendance" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  const actions = ["create", "read", "update", "delete"];

  useEffect(() => {
    if (user) {
      if (user.permissions && user.permissions.length > 0) {
        setPermissions(user.permissions);
      } else {
        const defaultPerms = DEFAULT_PERMISSIONS.find(p => p.role === user.role);
        setPermissions(defaultPerms?.defaultPermissions || []);
      }
    }
  }, [user]);

  const hasAction = (module: string, action: string): boolean => {
    const modulePermission = permissions.find(p => p.module === module);
    return modulePermission ? modulePermission.actions.includes(action) : false;
  };

  const toggleAction = (module: string, action: string) => {
    setPermissions(prev => {
      const existingModule = prev.find(p => p.module === module);
      
      if (existingModule) {
        if (existingModule.actions.includes(action)) {
          // Remove action
          const updatedActions = existingModule.actions.filter(a => a !== action);
          if (updatedActions.length === 0) {
            // Remove module if no actions left
            return prev.filter(p => p.module !== module);
          }
          return prev.map(p =>
            p.module === module ? { ...p, actions: updatedActions } : p
          );
        } else {
          // Add action
          return prev.map(p =>
            p.module === module
              ? { ...p, actions: [...p.actions, action] }
              : p
          );
        }
      } else {
        // Create new module permission
        return [...prev, { module, actions: [action] }];
      }
    });
  };

  const handleSave = async () => {
    if (!user || !currentUser?.schoolId) {
      setError("User or school information not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateDocument("users", user.uid, { permissions }, currentUser.schoolId);
      onPermissionsUpdated?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Permissions for {user.name}
          </DialogTitle>
          <DialogDescription>
            Role: {user.role.replace("_", " ").toUpperCase()} | Configure custom permissions for this user
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 text-sm font-medium pb-2 border-b">
            <div>Module</div>
            <div className="text-center">Create</div>
            <div className="text-center">Read</div>
            <div className="text-center">Update</div>
            <div className="text-center">Delete</div>
          </div>

          {modules.map((module) => (
            <div key={module.id} className="grid grid-cols-5 gap-2 items-center py-2 border-b">
              <Label className="font-medium">{module.label}</Label>
              {actions.map((action) => (
                <div key={action} className="flex justify-center">
                  <Checkbox
                    checked={hasAction(module.id, action)}
                    onCheckedChange={() => toggleAction(module.id, action)}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
