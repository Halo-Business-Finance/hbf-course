import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Search, Users, Shield, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const ROLE_OPTIONS = [
  { value: "trainee", label: "Trainee" },
  { value: "instructor", label: "Instructor" },
  { value: "tech_support_admin", label: "Tech Support" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export const UserRoleManager = () => {
  const { isSuperAdmin, userRole } = useAdminRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pendingRole, setPendingRole] = useState<{ userId: string; role: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_secure_admin_profiles");
      if (error) throw error;

      // Deduplicate by user_id, keeping highest priority role
      const userMap = new Map<string, UserWithRole>();
      const rolePriority: Record<string, number> = {
        super_admin: 1, admin: 2, tech_support_admin: 3, instructor: 4, trainee: 5,
      };

      (data || []).forEach((item: unknown) => {
        const existing = userMap.get(item.user_id);
        const currentPriority = rolePriority[item.role] ?? 99;
        const existingPriority = existing ? (rolePriority[existing.role] ?? 99) : Infinity;

        if (currentPriority < existingPriority) {
          userMap.set(item.user_id, {
            user_id: item.user_id,
            name: item.name || "Unknown",
            email: item.email || "",
            role: item.role,
            is_active: item.role_is_active !== false,
            created_at: item.role_created_at || item.created_at,
          });
        }
      });

      setUsers(Array.from(userMap.values()));
    } catch (error: unknown) {
      console.error("Error loading users:", error);
      toast({ title: "Error", description: "Failed to load user roles.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, newRole: string) => {
    try {
      try {
        const { error } = await supabase.functions.invoke("secure-admin-operations", {
          body: { operation: "assign_role", targetUserId: userId, role: newRole, reason: "Role change via role manager" },
        });
        if (error) throw error;
      } catch {
        const { error } = await supabase.rpc("assign_user_role", {
          p_target_user_id: userId,
          p_new_role: newRole,
          p_reason: "Role change via role manager",
          p_mfa_verified: false,
        });
        if (error) throw error;
      }

      toast({ title: "Role Updated", description: `User role changed to ${newRole.replace(/_/g, " ")}.` });
      await loadUsers();
    } catch (error: unknown) {
      toast({ title: "Error", description: error?.message || "Failed to update role.", variant: "destructive" });
    } finally {
      setPendingRole(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !searchQuery || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin": return <Badge variant="destructive">{role.replace(/_/g, " ")}</Badge>;
      case "admin": return <Badge variant="default">{role}</Badge>;
      case "tech_support_admin": return <Badge variant="secondary">tech support</Badge>;
      case "instructor": return <Badge variant="outline">{role}</Badge>;
      default: return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const canEditRole = (targetRole: string) => {
    if (isSuperAdmin) return true;
    if (userRole === "admin" && !["super_admin", "admin"].includes(targetRole)) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Role Management
              </CardTitle>
              <CardDescription className="mt-1">
                View and manage user roles with RBAC enforcement. {!isSuperAdmin && "Some role changes require super admin privileges."}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {} as Record<string, number>)
            ).map(([role, count]) => (
              <Badge key={role} variant="outline" className="capitalize">
                {role.replace(/_/g, " ")}: {count}
              </Badge>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.user_id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-sm">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{getRoleBadge(u.role)}</TableCell>
                      <TableCell>
                        <Badge variant={u.is_active ? "outline" : "secondary"} className="text-xs">
                          {u.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canEditRole(u.role) ? (
                          <AlertDialog>
                            <Select
                              value={u.role}
                              onValueChange={(newRole) => setPendingRole({ userId: u.user_id, role: newRole })}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.filter((r) => isSuperAdmin || r.value !== "super_admin").map((r) => (
                                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </AlertDialog>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Shield className="h-3 w-3" /> Protected
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog for role changes */}
      {pendingRole && (
        <AlertDialog open={!!pendingRole} onOpenChange={() => setPendingRole(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change User Role?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change this user's role to <strong>{pendingRole.role.replace(/_/g, " ")}</strong>? This will immediately affect their access permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => assignRole(pendingRole.userId, pendingRole.role)}>
                Confirm Change
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
