import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Search, Download, RefreshCw, ExternalLink, Users, BookOpen, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CertificateRecord {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  final_score: number | null;
  completion_percentage: number;
  user_name?: string;
  user_email?: string;
  course_title?: string;
}

export function CertificateRecords() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, uniqueUsers: 0 });

  useEffect(() => {
    fetchCertificates();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("id, title").eq("is_active", true).order("title");
    if (data) setCourses(data);
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data: certs, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issued_at", { ascending: false });

      if (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to load certificates");
        setLoading(false);
        return;
      }

      if (!certs?.length) {
        setCertificates([]);
        setStats({ total: 0, thisMonth: 0, uniqueUsers: 0 });
        setLoading(false);
        return;
      }

      // Fetch course titles
      const courseIds = [...new Set(certs.map((c) => c.course_id))];
      const { data: coursesData } = await supabase.from("courses").select("id, title").in("id", courseIds);
      const courseMap = new Map(coursesData?.map((c) => [c.id, c.title]) || []);

      // Fetch user profiles
      const userIds = [...new Set(certs.map((c) => c.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, email").in("user_id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      const enrichedCerts = certs.map((cert) => {
        const profile = profileMap.get(cert.user_id);
        return {
          ...cert,
          course_title: courseMap.get(cert.course_id) || "Unknown Course",
          user_name: profile?.name || "Unknown User",
          user_email: profile?.email || "",
        };
      });

      setCertificates(enrichedCerts);

      // Calculate stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      setStats({
        total: enrichedCerts.length,
        thisMonth: enrichedCerts.filter((c) => new Date(c.issued_at) >= monthStart).length,
        uniqueUsers: new Set(enrichedCerts.map((c) => c.user_id)).size,
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load certificate records");
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      !searchQuery ||
      cert.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course_title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === "all" || cert.course_id === courseFilter;

    return matchesSearch && matchesCourse;
  });

  const handleExportCSV = () => {
    const headers = ["Certificate #", "User", "Email", "Course", "Score", "Issued Date"];
    const rows = filteredCertificates.map((c) => [
      c.certificate_number,
      c.user_name || "",
      c.user_email || "",
      c.course_title || "",
      c.final_score ? `${c.final_score}%` : "N/A",
      new Date(c.issued_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-halo-navy/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-halo-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Certificates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-halo-orange/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-halo-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
              <p className="text-xs text-muted-foreground">Issued This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              <p className="text-xs text-muted-foreground">Unique Graduates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate Records
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchCertificates} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={filteredCertificates.length === 0}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, certificate # or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || courseFilter !== "all" ? "No certificates match your filters" : "No certificates issued yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate #</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {cert.certificate_number}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{cert.user_name}</p>
                          <p className="text-xs text-muted-foreground">{cert.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-[200px] truncate">{cert.course_title}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        {cert.final_score ? (
                          <Badge variant={cert.final_score >= 90 ? "default" : "secondary"} className="text-xs">
                            {cert.final_score}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(cert.issued_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`/certificate/${cert.id}`, "_blank")}
                          title="View Certificate"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Results count */}
          {!loading && filteredCertificates.length > 0 && (
            <p className="text-xs text-muted-foreground text-right">
              Showing {filteredCertificates.length} of {certificates.length} certificates
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
