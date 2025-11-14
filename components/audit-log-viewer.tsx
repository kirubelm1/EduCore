"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Loader2 } from 'lucide-react';
import { getAuditLogs, AuditLog } from "@/lib/firebase/audit";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export function AuditLogViewer() {
  const { userData } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState<string>("all");

  useEffect(() => {
    if (userData?.schoolId) {
      loadLogs();
    }
  }, [userData?.schoolId]);

  const loadLogs = async () => {
    if (!userData?.schoolId) return;

    setLoading(true);
    try {
      const auditLogs = await getAuditLogs(userData.schoolId, {
        module: filterModule !== "all" ? filterModule : undefined,
        limitCount: 100,
      });
      setLogs(auditLogs);
    } catch (error) {
      console.error("[v0] Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log =>
    searchTerm === "" ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Logs
        </CardTitle>
        <CardDescription>View all system actions and changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by action or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="teachers">Teachers</SelectItem>
              <SelectItem value="classes">Classes</SelectItem>
              <SelectItem value="assignments">Assignments</SelectItem>
              <SelectItem value="grades">Grades</SelectItem>
              <SelectItem value="announcements">Announcements</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadLogs} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {format(log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell className="font-medium">
                      <span className="capitalize">{log.action.replace("_", " ")}</span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{log.module}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.targetType || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
