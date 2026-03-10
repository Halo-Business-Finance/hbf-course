import { useState, useEffect, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HorizontalNav } from '@/components/HorizontalNav';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/EmptyState';
import { TeamAnalyticsCharts } from '@/components/analytics/TeamAnalyticsCharts';
import {
  BarChart3, Users, TrendingUp, Clock, Download, Trophy,
  BookOpen, Target, AlertTriangle, CheckCircle, Search, Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  modulesCompleted: number;
  totalModules: number;
  avgScore: number;
  lastActive: string | null;
  status: 'ahead' | 'on_track' | 'at_risk' | 'behind';
}

interface CourseStats {
  courseId: string;
  courseTitle: string;
  enrolled: number;
  completed: number;
  avgScore: number;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ahead': return <Badge className="bg-accent/10 text-accent border-accent/20">Ahead</Badge>;
    case 'on_track': return <Badge className="bg-primary/10 text-primary border-primary/20">On Track</Badge>;
    case 'at_risk': return <Badge className="bg-halo-orange/10 text-halo-orange border-halo-orange/20">At Risk</Badge>;
    case 'behind': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Behind</Badge>;
    default: return null;
  }
};

function deriveStatus(completedPct: number, lastActive: string | null): TeamMember['status'] {
  if (completedPct >= 80) return 'ahead';
  if (completedPct >= 40) return 'on_track';
  if (!lastActive) return 'behind';
  const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / 86400000);
  if (daysSince > 14) return 'behind';
  if (completedPct < 20) return 'at_risk';
  return 'on_track';
}

export default function TeamAnalytics() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('user_id, name, email, professional_role')
        .order('name');

      if (profErr) throw profErr;
      if (!profiles?.length) {
        setLoading(false);
        return;
      }

      // Fetch all course_progress
      const { data: allProgress, error: progErr } = await supabase
        .from('course_progress')
        .select('user_id, course_id, module_id, progress_percentage, quiz_score, updated_at');

      if (progErr) throw progErr;

      // Fetch all courses
      const { data: courses, error: courseErr } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_active', true);

      if (courseErr) throw courseErr;

      // Build member stats
      const progressData = allProgress || [];
      const memberList: TeamMember[] = (profiles || []).map((p) => {
        const userProgress = progressData.filter((pr) => pr.user_id === p.user_id);
        const completedModules = new Set<string>();
        let totalScore = 0;
        let scoreCount = 0;
        let latestActivity: string | null = null;

        userProgress.forEach((pr) => {
          if (pr.progress_percentage === 100 && pr.module_id) {
            completedModules.add(pr.module_id);
          }
          if (pr.quiz_score && pr.quiz_score > 0) {
            totalScore += pr.quiz_score;
            scoreCount++;
          }
          if (pr.updated_at && (!latestActivity || pr.updated_at > latestActivity)) {
            latestActivity = pr.updated_at;
          }
        });

        const totalModules = new Set(userProgress.map((pr) => pr.module_id).filter(Boolean)).size || 1;
        const completedPct = totalModules > 0 ? Math.round((completedModules.size / totalModules) * 100) : 0;

        return {
          userId: p.user_id,
          name: p.name || p.email || 'Unknown',
          email: p.email || '',
          role: p.professional_role || 'Learner',
          modulesCompleted: completedModules.size,
          totalModules,
          avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
          lastActive: latestActivity,
          status: deriveStatus(completedPct, latestActivity),
        };
      });

      setMembers(memberList);

      // Build course stats
      const courseMap = new Map<string, { enrolled: Set<string>; completed: Set<string>; scores: number[] }>();
      progressData.forEach((pr) => {
        if (!courseMap.has(pr.course_id)) {
          courseMap.set(pr.course_id, { enrolled: new Set(), completed: new Set(), scores: [] });
        }
        const entry = courseMap.get(pr.course_id)!;
        entry.enrolled.add(pr.user_id);
        if (pr.progress_percentage === 100 && pr.module_id) {
          entry.completed.add(pr.user_id);
        }
        if (pr.quiz_score && pr.quiz_score > 0) {
          entry.scores.push(pr.quiz_score);
        }
      });

      const stats: CourseStats[] = (courses || [])
        .map((c) => {
          const entry = courseMap.get(c.id);
          return {
            courseId: c.id,
            courseTitle: c.title,
            enrolled: entry?.enrolled.size || 0,
            completed: entry?.completed.size || 0,
            avgScore: entry?.scores.length ? Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length) : 0,
          };
        })
        .filter((s) => s.enrolled > 0)
        .sort((a, b) => b.enrolled - a.enrolled);

      setCourseStats(stats);
    } catch (err) {
      console.error('Error fetching team data:', err);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const metrics = useMemo(() => {
    const total = members.length;
    const avgProgress = total > 0 ? Math.round(members.reduce((s, m) => s + (m.totalModules > 0 ? (m.modulesCompleted / m.totalModules) * 100 : 0), 0) / total) : 0;
    const avgScore = total > 0 ? Math.round(members.filter((m) => m.avgScore > 0).reduce((s, m) => s + m.avgScore, 0) / (members.filter((m) => m.avgScore > 0).length || 1)) : 0;
    const totalCompleted = members.reduce((s, m) => s + m.modulesCompleted, 0);
    const activeThisWeek = members.filter((m) => {
      if (!m.lastActive) return false;
      return Date.now() - new Date(m.lastActive).getTime() < 7 * 86400000;
    }).length;
    const atRisk = members.filter((m) => m.status === 'at_risk' || m.status === 'behind').length;
    return { total, avgProgress, avgScore, totalCompleted, activeThisWeek, atRisk };
  }, [members]);

  const chartData = useMemo(() => {
    const statusCounts = { ahead: 0, on_track: 0, at_risk: 0, behind: 0 };
    members.forEach((m) => { statusCounts[m.status]++; });
    const statusDistribution = [
      { name: 'Ahead', value: statusCounts.ahead, color: 'hsl(var(--accent-foreground))' },
      { name: 'On Track', value: statusCounts.on_track, color: 'hsl(var(--primary))' },
      { name: 'At Risk', value: statusCounts.at_risk, color: 'hsl(var(--halo-orange))' },
      { name: 'Behind', value: statusCounts.behind, color: 'hsl(var(--destructive))' },
    ].filter((d) => d.value > 0);

    const courseCompletionData = courseStats.slice(0, 8).map((c) => ({
      course: c.courseTitle.length > 18 ? c.courseTitle.slice(0, 18) + '…' : c.courseTitle,
      completion: c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0,
    }));

    return { statusDistribution, courseCompletionData };
  }, [members, courseStats]);

  const handleExport = (type: 'members' | 'courses' = 'members') => {
    setExportLoading(true);
    let csv: string;
    let filename: string;

    if (type === 'courses') {
      const headers = ['Course', 'Enrolled', 'Completed', 'Completion Rate', 'Avg Score'];
      const rows = courseStats.map((c) => [
        `"${c.courseTitle}"`, c.enrolled, c.completed, 
        c.enrolled > 0 ? `${Math.round((c.completed / c.enrolled) * 100)}%` : '0%',
        c.avgScore > 0 ? `${c.avgScore}%` : 'N/A',
      ]);
      csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
      filename = `course-report-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      const headers = ['Name', 'Email', 'Role', 'Modules Completed', 'Total Modules', 'Completion %', 'Avg Score', 'Status', 'Last Active'];
      const rows = members.map((m) => [
        `"${m.name}"`, m.email, m.role, m.modulesCompleted, m.totalModules,
        m.totalModules > 0 ? `${Math.round((m.modulesCompleted / m.totalModules) * 100)}%` : '0%',
        m.avgScore > 0 ? `${m.avgScore}%` : 'N/A',
        m.status, m.lastActive || 'Never',
      ]);
      csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
      filename = `team-report-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(false);
    toast.success('Report exported successfully');
  };

  return (
    <>
      <SEOHead
        title="Team Analytics | HALO Business Finance Academy"
        description="Track team learning progress, completion rates, and performance metrics."
        keywords="team analytics, learning reports, manager dashboard, progress tracking"
      />

      <div className="min-h-screen bg-background">
        <HorizontalNav />

        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Team Analytics</h1>
              <p className="text-muted-foreground mt-1">Monitor team progress and generate reports</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleExport('members')} disabled={exportLoading || members.length === 0} className="gap-2 bg-halo-navy hover:bg-halo-navy/90 text-white">
                {exportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export Members
              </Button>
              <Button onClick={() => handleExport('courses')} disabled={exportLoading || courseStats.length === 0} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Courses
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              title="No team members yet"
              description="Team analytics will populate once learners have enrolled in courses and started making progress."
            />
          ) : (
            <>
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: 'Team Members', value: metrics.total, icon: Users, color: 'text-primary' },
                  { label: 'Avg Progress', value: `${metrics.avgProgress}%`, icon: TrendingUp, color: 'text-accent' },
                  { label: 'Avg Score', value: `${metrics.avgScore}%`, icon: Target, color: 'text-primary' },
                  { label: 'Modules Done', value: metrics.totalCompleted, icon: BookOpen, color: 'text-halo-orange' },
                  { label: 'Active This Week', value: metrics.activeThisWeek, icon: Clock, color: 'text-accent' },
                  { label: 'At Risk', value: metrics.atRisk, icon: AlertTriangle, color: metrics.atRisk > 0 ? 'text-destructive' : 'text-accent' },
                ].map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={idx} className="border border-border">
                      <CardContent className="p-4 text-center">
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${metric.color}`} />
                        <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
                  <TabsTrigger value="charts" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Charts</TabsTrigger>
                  <TabsTrigger value="members" className="gap-1.5"><Users className="h-3.5 w-3.5" />Members</TabsTrigger>
                  <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" />Courses</TabsTrigger>
                </TabsList>

                {/* Charts Tab */}
                <TabsContent value="charts">
                  <TeamAnalyticsCharts
                    statusDistribution={chartData.statusDistribution}
                    courseCompletionData={chartData.courseCompletionData}
                  />
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle>Team Member Progress</CardTitle>
                          <CardDescription>Individual progress across all assigned courses</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search members…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {filteredMembers.map((member) => {
                          const progressPct = member.totalModules > 0 ? Math.round((member.modulesCompleted / member.totalModules) * 100) : 0;
                          return (
                            <div key={member.userId} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-foreground truncate">{member.name}</p>
                                  {getStatusBadge(member.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                                <div className="text-center min-w-[3rem]">
                                  <p className="font-semibold text-foreground">{member.modulesCompleted}</p>
                                  <p className="text-xs text-muted-foreground">Done</p>
                                </div>
                                <div className="text-center min-w-[3rem]">
                                  <p className="font-semibold text-foreground">{member.avgScore > 0 ? `${member.avgScore}%` : '—'}</p>
                                  <p className="text-xs text-muted-foreground">Score</p>
                                </div>
                                <div className="w-full sm:w-32">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">Progress</span>
                                    <span className="text-xs font-medium text-foreground">{progressPct}%</span>
                                  </div>
                                  <Progress value={progressPct} className="h-2" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filteredMembers.length === 0 && (
                          <p className="text-center py-8 text-sm text-muted-foreground">No members match your search.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Enrollment & Completion</CardTitle>
                      <CardDescription>How the team is progressing through each course</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {courseStats.length > 0 ? (
                        <div className="space-y-4">
                          {courseStats.map((course) => {
                            const completionRate = course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0;
                            return (
                              <div key={course.courseId} className="p-4 rounded-lg border border-border">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                  <p className="font-medium text-foreground">{course.courseTitle}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-muted-foreground">{course.enrolled} enrolled</span>
                                    <span className="text-muted-foreground">{course.completed} completed</span>
                                    {course.avgScore > 0 && (
                                      <span className="text-primary font-medium">{course.avgScore}% avg</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Progress value={completionRate} className="h-2 flex-1" />
                                  <span className="text-sm font-medium text-foreground w-12 text-right">{completionRate}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-sm text-muted-foreground">No course data available yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>

        <FinPilotBrandFooter />
      </div>
    </>
  );
}
