import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database, Trash2, Clock, Shield, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface RetentionPolicy {
  id: string;
  label: string;
  description: string;
  currentDays: number;
  table: string;
  icon: React.ReactNode;
}

export const DataRetentionControls = () => {
  const [running, setRunning] = useState(false);
  const [policies, setPolicies] = useState<RetentionPolicy[]>([
    {
      id: "security_events",
      label: "Security Events",
      description: "Threat detection logs, failed logins, and suspicious activity records.",
      currentDays: 90,
      table: "security_events",
      icon: <Shield className="h-5 w-5 text-primary" />,
    },
    {
      id: "rate_limits",
      label: "Rate Limit Records",
      description: "API rate limiting data and blocked request logs.",
      currentDays: 7,
      table: "advanced_rate_limits",
      icon: <Clock className="h-5 w-5 text-warning" />,
    },
    {
      id: "sessions",
      label: "User Sessions",
      description: "Inactive and expired session records for user activity tracking.",
      currentDays: 90,
      table: "user_sessions",
      icon: <Database className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "threat_detection",
      label: "Threat Intelligence",
      description: "AI threat analysis results and detection event records.",
      currentDays: 180,
      table: "threat_detection_events",
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    },
  ]);

  const updatePolicyDays = (id: string, days: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, currentDays: days } : p))
    );
  };

  const runCleanup = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("security-data-retention");
      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: "Data retention policies have been applied successfully.",
      });
    } catch (error: unknown) {
      console.error("Cleanup error:", error);
      toast({
        title: "Cleanup Failed",
        description: error?.message || "Failed to run data retention cleanup.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const dayOptions = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "1 year" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                Data Retention Controls
              </CardTitle>
              <CardDescription className="mt-1">
                Configure how long different data types are retained before automated cleanup. GDPR compliant.
              </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" disabled={running}>
                  {running ? "Running..." : "Run Cleanup Now"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Run Data Retention Cleanup?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete records older than the configured retention periods. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={runCleanup}>Confirm Cleanup</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">{policy.icon}</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{policy.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{policy.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant="outline" className="whitespace-nowrap">
                    {policy.currentDays} days
                  </Badge>
                  <Select
                    value={String(policy.currentDays)}
                    onValueChange={(v) => updatePolicyDays(policy.id, Number(v))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/30">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Compliance Note</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Audit logs (admin_audit_log and compliance_audit_trail) are excluded from automated cleanup to maintain immutable audit trails required for regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
