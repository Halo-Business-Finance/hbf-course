import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Shield, User, Monitor, MapPin, Clock, Key } from "lucide-react";

interface SessionInfo {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  device_id: string | null;
}

export const RoleSessionIndicators = () => {
  const { user } = useAuth();
  const { userRole, isAdmin, isSuperAdmin } = useAdminRole();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessionData();
      computePermissions();
    }
  }, [user, userRole]);

  const loadSessionData = async () => {
    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("id, ip_address, user_agent, is_active, created_at, device_id")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setSessions(data.map((s: unknown) => ({
          id: s.id,
          ip_address: s.ip_address as string | null,
          user_agent: s.user_agent as string | null,
          is_active: s.is_active,
          created_at: s.created_at,
          device_id: s.device_id as string | null,
        })));
      }
    } catch (e) {
      console.warn("Could not load sessions:", e);
    } finally {
      setLoading(false);
    }
  };

  const computePermissions = () => {
    const perms: string[] = ["View Dashboard", "View Courses"];
    if (userRole === "instructor" || isAdmin) {
      perms.push("Manage Content", "View Progress Reports");
    }
    if (isAdmin) {
      perms.push("Manage Users", "View Audit Logs", "Security Monitoring");
    }
    if (isSuperAdmin) {
      perms.push("System Configuration", "Data Retention", "Role Management", "Delete Users");
    }
    setPermissions(perms);
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "super_admin": return "destructive";
      case "admin": return "default";
      case "tech_support_admin": return "secondary";
      case "instructor": return "outline-solid";
      default: return "secondary";
    }
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return "Unknown Device";
    if (ua.includes("Chrome")) return "Chrome Browser";
    if (ua.includes("Firefox")) return "Firefox Browser";
    if (ua.includes("Safari")) return "Safari Browser";
    if (ua.includes("Edge")) return "Edge Browser";
    return "Unknown Browser";
  };

  return (
    <div className="space-y-6">
      {/* Current Role & Permissions */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Your Role & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user?.email}</span>
            <Badge variant={getRoleBadgeVariant(userRole) as unknown} className="capitalize">
              {userRole?.replace(/_/g, " ") || "trainee"}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Active Permissions
            </p>
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Session started: {new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Shield className="h-3 w-3" />
              <span>Auth: PKCE flow · sessionStorage · Auto-refresh enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active session records found.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{parseUserAgent(session.user_agent)}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>IP: {session.ip_address || "masked"}</span>
                        <span>·</span>
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {idx === 0 && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                    <Badge variant={session.is_active ? "outline-solid" : "secondary"} className="text-xs">
                      {session.is_active ? "Active" : "Expired"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
