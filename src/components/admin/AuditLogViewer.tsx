import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw, Download, Filter, Shield, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditEvent {
  id: string;
  event_type: string;
  severity: string;
  user_id: string | null;
  details: unknown;
  created_at: string;
  data_classification?: string;
  logged_via_secure_function?: boolean;
}

interface AdminAuditEntry {
  id: string;
  action: string;
  admin_user_id: string;
  target_user_id: string | null;
  target_resource: string | null;
  details: unknown;
  ip_address: string | null;
  created_at: string;
}

type LogSource = "security_events" | "admin_audit_log";

export const AuditLogViewer = () => {
  const [events, setEvents] = useState<(AuditEvent | AdminAuditEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [logSource, setLogSource] = useState<LogSource>("security_events");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    loadEvents();
  }, [logSource, severityFilter, page]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      if (logSource === "security_events") {
        let query = supabase
          .from("security_events")
          .select("*")
          .order("created_at", { ascending: false })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (severityFilter !== "all") {
          query = query.eq("severity", severityFilter);
        }

        const { data, error } = await query;
        if (error) throw error;
        setEvents(data || []);
      } else {
        const query = supabase
          .from("admin_audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        const { data, error } = await query;
        if (error) throw error;
        setEvents(data || []);
      }
    } catch (error: unknown) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load audit logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if ("event_type" in event) {
      return (
        event.event_type?.toLowerCase().includes(q) ||
        event.user_id?.toLowerCase().includes(q) ||
        JSON.stringify(event.details)?.toLowerCase().includes(q)
      );
    }
    return (
      (event as AdminAuditEntry).action?.toLowerCase().includes(q) ||
      (event as AdminAuditEntry).admin_user_id?.toLowerCase().includes(q) ||
      JSON.stringify((event as AdminAuditEntry).details)?.toLowerCase().includes(q)
    );
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline-solid";
      default: return "secondary";
    }
  };

  const exportCSV = () => {
    const headers = logSource === "security_events"
      ? ["ID", "Event Type", "Severity", "User ID", "Created At"]
      : ["ID", "Action", "Admin User ID", "Target Resource", "Created At"];
    
    const rows = filteredEvents.map((e) => {
      if ("event_type" in e) {
        return [e.id, (e as AuditEvent).event_type, (e as AuditEvent).severity, e.user_id || "", e.created_at];
      }
      const ae = e as AdminAuditEntry;
      return [ae.id, ae.action, ae.admin_user_id, ae.target_resource || "", ae.created_at];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Audit log exported as CSV." });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Audit Log Viewer</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadEvents} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={logSource} onValueChange={(v) => { setLogSource(v as LogSource); setPage(0); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Log source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="security_events">Security Events</SelectItem>
                <SelectItem value="admin_audit_log">Admin Audit Log</SelectItem>
              </SelectContent>
            </Select>
            {logSource === "security_events" && (
              <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(0); }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {logSource === "security_events" ? (
                    <>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead className="w-[100px]">Severity</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Details</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                    </>
                  )}
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
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No audit events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                      {"event_type" in event ? (
                        <>
                          <TableCell className="font-medium text-sm">
                            {(event as AuditEvent).event_type.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getSeverityColor((event as AuditEvent).severity) as unknown}>
                              {(event as AuditEvent).severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {event.user_id?.slice(0, 8) || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {JSON.stringify((event as AuditEvent).details)?.slice(0, 80) || "—"}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium text-sm">
                            {(event as AdminAuditEntry).action.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {(event as AdminAuditEntry).admin_user_id?.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {(event as AdminAuditEntry).target_resource || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {JSON.stringify((event as AdminAuditEntry).details)?.slice(0, 80) || "—"}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page + 1} · {filteredEvents.length} entries shown
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={filteredEvents.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
