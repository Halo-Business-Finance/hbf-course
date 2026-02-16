import { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HorizontalNav } from '@/components/HorizontalNav';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, Users, TrendingUp, Clock, Download, Trophy, 
  BookOpen, Target, AlertTriangle, CheckCircle, ArrowUpRight 
} from 'lucide-react';

// Mock team data for demonstration
const teamMembers = [
  { id: '1', name: 'Sarah Johnson', role: 'Loan Officer', progress: 87, coursesCompleted: 12, avgScore: 92, streak: 14, status: 'on_track' },
  { id: '2', name: 'Michael Chen', role: 'Credit Analyst', progress: 65, coursesCompleted: 8, avgScore: 88, streak: 7, status: 'on_track' },
  { id: '3', name: 'Emily Rivera', role: 'Compliance Officer', progress: 45, coursesCompleted: 5, avgScore: 78, streak: 0, status: 'at_risk' },
  { id: '4', name: 'James Thompson', role: 'Branch Manager', progress: 92, coursesCompleted: 15, avgScore: 95, streak: 21, status: 'ahead' },
  { id: '5', name: 'Lisa Park', role: 'Loan Officer', progress: 30, coursesCompleted: 3, avgScore: 72, streak: 0, status: 'behind' },
];

const teamMetrics = {
  totalMembers: 5,
  avgProgress: 64,
  avgScore: 85,
  coursesCompleted: 43,
  complianceRate: 80,
  activeThisWeek: 4,
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ahead': return <Badge className="bg-accent/10 text-accent border-accent/20">Ahead</Badge>;
    case 'on_track': return <Badge className="bg-primary/10 text-primary border-primary/20">On Track</Badge>;
    case 'at_risk': return <Badge className="bg-halo-orange/10 text-halo-orange border-halo-orange/20">At Risk</Badge>;
    case 'behind': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Behind</Badge>;
    default: return null;
  }
};

export default function TeamAnalytics() {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = () => {
    setExportLoading(true);
    // Generate CSV
    const headers = ['Name', 'Role', 'Progress %', 'Courses Completed', 'Avg Score', 'Streak', 'Status'];
    const rows = teamMembers.map(m => [m.name, m.role, m.progress, m.coursesCompleted, m.avgScore, m.streak, m.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(false);
  };

  return (
    <>
      <SEOHead
        title="Team Analytics | FinPilot LMS"
        description="Track team learning progress, completion rates, and performance metrics."
        keywords="team analytics, learning reports, manager dashboard, progress tracking"
      />
      
      <div className="min-h-screen bg-background">
        <HorizontalNav />
        
        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team Analytics</h1>
              <p className="text-muted-foreground mt-1">Monitor team progress and generate reports</p>
            </div>
            <Button onClick={handleExport} disabled={exportLoading} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Team Members', value: teamMetrics.totalMembers, icon: Users, color: 'text-primary' },
              { label: 'Avg Progress', value: `${teamMetrics.avgProgress}%`, icon: TrendingUp, color: 'text-accent' },
              { label: 'Avg Score', value: `${teamMetrics.avgScore}%`, icon: Target, color: 'text-primary' },
              { label: 'Courses Done', value: teamMetrics.coursesCompleted, icon: BookOpen, color: 'text-halo-orange' },
              { label: 'Compliance', value: `${teamMetrics.complianceRate}%`, icon: CheckCircle, color: 'text-accent' },
              { label: 'Active This Week', value: teamMetrics.activeThisWeek, icon: Clock, color: 'text-primary' },
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

          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="members" className="gap-1.5"><Users className="h-3.5 w-3.5" />Members</TabsTrigger>
              <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" />Courses</TabsTrigger>
              <TabsTrigger value="compliance" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Compliance</TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Team Member Progress</CardTitle>
                  <CardDescription>Individual progress across all assigned courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground">{member.name}</p>
                            {getStatusBadge(member.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-foreground">{member.coursesCompleted}</p>
                            <p className="text-xs text-muted-foreground">Courses</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-foreground">{member.avgScore}%</p>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-foreground">{member.streak}d</p>
                            <p className="text-xs text-muted-foreground">Streak</p>
                          </div>
                          <div className="w-32">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Progress</span>
                              <span className="text-xs font-medium text-foreground">{member.progress}%</span>
                            </div>
                            <Progress value={member.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Course Completion Rates</CardTitle>
                  <CardDescription>How the team is progressing through each course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'SBA 7(a) Lending', enrolled: 5, completed: 3, avgScore: 89 },
                      { name: 'Commercial Real Estate', enrolled: 4, completed: 2, avgScore: 85 },
                      { name: 'Equipment Financing', enrolled: 3, completed: 3, avgScore: 92 },
                      { name: 'Working Capital', enrolled: 4, completed: 1, avgScore: 78 },
                      { name: 'Asset-Based Lending', enrolled: 2, completed: 0, avgScore: 0 },
                    ].map((course, idx) => {
                      const completionRate = Math.round((course.completed / course.enrolled) * 100);
                      return (
                        <div key={idx} className="p-4 rounded-lg border border-border">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <p className="font-medium text-foreground">{course.name}</p>
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Mandatory training completion and upcoming deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { requirement: 'Annual SBA Compliance Training', deadline: '2026-03-31', completed: 3, total: 5, status: 'on_track' },
                      { requirement: 'Anti-Money Laundering (AML)', deadline: '2026-02-28', completed: 4, total: 5, status: 'at_risk' },
                      { requirement: 'Fair Lending Practices', deadline: '2026-06-30', completed: 1, total: 5, status: 'on_track' },
                      { requirement: 'Data Privacy & Security', deadline: '2026-04-15', completed: 0, total: 5, status: 'behind' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-border">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="font-medium text-foreground">{item.requirement}</p>
                            <p className="text-sm text-muted-foreground">Due: {new Date(item.deadline).toLocaleDateString()}</p>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={(item.completed / item.total) * 100} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {item.completed}/{item.total} complete
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <FinPilotBrandFooter />
      </div>
    </>
  );
}
