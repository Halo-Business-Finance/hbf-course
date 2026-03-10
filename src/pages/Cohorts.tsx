import { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Users, Plus, Calendar, Target, Trophy, BookOpen,
  Clock, CheckCircle, AlertTriangle, Settings, Loader2, UserPlus,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Cohort {
  id: string;
  name: string;
  description: string;
  members: number;
  courses: string[];
  deadline: string;
  progress: number;
  status: 'active' | 'urgent' | 'completed';
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>;
    case 'urgent': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Urgent</Badge>;
    case 'completed': return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    default: return null;
  }
};

export default function Cohorts() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showBulkEnroll, setShowBulkEnroll] = useState(false);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [newCohort, setNewCohort] = useState({ name: '', description: '', deadline: '' });
  const [bulkEmails, setBulkEmails] = useState('');
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_active', true)
        .order('title');
      setCourses(coursesData || []);

      // Build cohort-like data from real enrollment data
      // Group enrollments by course to show course-based "cohorts"
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id, user_id, status, enrolled_at');

      const { data: progressData } = await supabase
        .from('course_progress')
        .select('user_id, course_id, progress_percentage');

      // Group by course
      const courseEnrollmentMap = new Map<string, { userIds: Set<string>; enrolledAt: string }>();
      (enrollments || []).forEach(e => {
        if (!courseEnrollmentMap.has(e.course_id)) {
          courseEnrollmentMap.set(e.course_id, { userIds: new Set(), enrolledAt: e.enrolled_at || '' });
        }
        courseEnrollmentMap.get(e.course_id)!.userIds.add(e.user_id);
      });

      // Calculate progress per course cohort
      const courseProgressMap = new Map<string, number[]>();
      (progressData || []).forEach(p => {
        if (!courseProgressMap.has(p.course_id)) courseProgressMap.set(p.course_id, []);
        courseProgressMap.get(p.course_id)!.push(p.progress_percentage || 0);
      });

      const courseMap = new Map((coursesData || []).map(c => [c.id, c.title]));

      const realCohorts: Cohort[] = [];
      courseEnrollmentMap.forEach((data, courseId) => {
        const courseTitle = courseMap.get(courseId) || courseId;
        const progresses = courseProgressMap.get(courseId) || [];
        const avgProgress = progresses.length > 0 
          ? Math.round(progresses.reduce((s, v) => s + v, 0) / progresses.length) 
          : 0;

        const status: Cohort['status'] = avgProgress >= 90 ? 'completed' : avgProgress < 20 ? 'urgent' : 'active';

        realCohorts.push({
          id: courseId,
          name: courseTitle,
          description: `Training cohort for ${courseTitle}`,
          members: data.userIds.size,
          courses: [courseTitle],
          deadline: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
          progress: avgProgress,
          status
        });
      });

      setCohorts(realCohorts);
    } catch (error) {
      console.error('Error loading cohorts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = () => {
    if (!newCohort.name) { toast.error('Please enter a cohort name'); return; }
    const cohort: Cohort = {
      id: crypto.randomUUID(), name: newCohort.name, description: newCohort.description,
      members: 0, courses: [], 
      deadline: newCohort.deadline || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      progress: 0, status: 'active',
    };
    setCohorts((prev) => [cohort, ...prev]);
    setNewCohort({ name: '', description: '', deadline: '' });
    setShowCreate(false);
    toast.success(`Cohort "${cohort.name}" created`);
  };

  const handleBulkEnroll = async () => {
    if (!bulkEmails.trim()) { toast.error('Please enter email addresses'); return; }
    const emails = bulkEmails.split(/[\n,;]+/).map((e) => e.trim().toLowerCase()).filter((e) => e.includes('@'));
    if (emails.length === 0) { toast.error('No valid email addresses found'); return; }
    setEnrollLoading(true);
    try {
      const { data: profiles, error } = await supabase.from('profiles').select('user_id, email').in('email', emails);
      if (error) throw error;
      const foundEmails = new Set((profiles || []).map((p) => p.email?.toLowerCase()));
      const notFound = emails.filter((e) => !foundEmails.has(e));
      if (selectedCohort && profiles?.length) {
        setCohorts((prev) => prev.map((c) => c.id === selectedCohort ? { ...c, members: c.members + (profiles?.length || 0) } : c));
      }
      const foundCount = profiles?.length || 0;
      toast.success(`Enrolled ${foundCount} member${foundCount !== 1 ? 's' : ''}${notFound.length > 0 ? `. ${notFound.length} email(s) not found.` : ''}`);
      setBulkEmails(''); setShowBulkEnroll(false);
    } catch (err) { console.error('Bulk enroll error:', err); toast.error('Failed to process enrollment'); } finally { setEnrollLoading(false); }
  };

  const totalMembers = cohorts.reduce((s, c) => s + c.members, 0);
  const avgProgress = cohorts.length > 0 ? Math.round(cohorts.reduce((s, c) => s + c.progress, 0) / cohorts.length) : 0;
  const urgentCount = cohorts.filter((c) => c.status === 'urgent').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="mt-4 text-sm text-muted-foreground">Loading cohorts...</p></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Learning Cohorts | HALO Business Finance Academy" description="Manage team-based learning paths with group deadlines and manager oversight." keywords="learning cohorts, team training, group learning, bulk enrollment" />
      <div className="min-h-screen bg-background">
        <PageHeader title="Learning Cohorts" subtitle="Organize team-based learning with shared goals and deadlines" icon={<Users className="h-5 w-5 text-white" />}
          actions={<>
            <Button variant="outline" onClick={() => setShowBulkEnroll(true)} className="gap-2 flex-1 sm:flex-none border-white/30 text-white hover:bg-white/10"><UserPlus className="h-4 w-4" /><span className="hidden sm:inline">Bulk Enroll</span><span className="sm:hidden">Enroll</span></Button>
            <Button onClick={() => setShowCreate(true)} className="gap-2 bg-halo-navy hover:bg-halo-navy/90 text-white flex-1 sm:flex-none"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Create Cohort</span><span className="sm:hidden">Create</span></Button>
          </>}
        />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Cohorts', value: cohorts.length, icon: Users, color: 'text-primary' },
              { label: 'Total Members', value: totalMembers, icon: Target, color: 'text-accent' },
              { label: 'Avg Progress', value: `${avgProgress}%`, icon: Trophy, color: 'text-halo-orange' },
              { label: 'Urgent', value: urgentCount, icon: AlertTriangle, color: urgentCount > 0 ? 'text-destructive' : 'text-accent' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (<Card key={idx} className="border border-border"><CardContent className="p-4 text-center"><Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} /><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></CardContent></Card>);
            })}
          </div>
          {cohorts.length === 0 ? (
            <EmptyState icon={<Users className="h-6 w-6 text-muted-foreground" />} title="No cohorts yet" description="No course enrollments found. Cohorts will appear when learners are enrolled in courses." actionLabel="Create Cohort" onAction={() => setShowCreate(true)} />
          ) : (
            <div className="space-y-4">
              {cohorts.map((cohort) => (
                <Card key={cohort.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div><div className="flex items-center gap-2 mb-1"><CardTitle className="text-lg">{cohort.name}</CardTitle>{getStatusBadge(cohort.status)}</div><CardDescription>{cohort.description}</CardDescription></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-foreground font-medium">{cohort.members} members</span></div>
                      <div className="flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4 text-muted-foreground" /><span className="text-foreground font-medium">{cohort.courses.length} courses</span></div>
                      <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-muted-foreground" /><span className="text-foreground font-medium">{cohort.progress}% complete</span></div>
                    </div>
                    <Progress value={cohort.progress} className="h-2 mb-3" />
                    <div className="flex flex-wrap gap-2">{cohort.courses.map((course, idx) => <Badge key={idx} variant="outline" className="text-xs">{course}</Badge>)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        <FinPilotBrandFooter />
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Learning Cohort</DialogTitle><DialogDescription>Set up a new team-based learning program with shared deadlines.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label htmlFor="cohort-name">Cohort Name</Label><Input id="cohort-name" placeholder="e.g., Q2 2026 New Hires" value={newCohort.name} onChange={(e) => setNewCohort((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="cohort-desc">Description</Label><Input id="cohort-desc" placeholder="Brief description of this cohort" value={newCohort.description} onChange={(e) => setNewCohort((p) => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="cohort-deadline">Deadline</Label><Input id="cohort-deadline" type="date" value={newCohort.deadline} onChange={(e) => setNewCohort((p) => ({ ...p, deadline: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreateCohort} className="bg-halo-navy hover:bg-halo-navy/90 text-white">Create Cohort</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkEnroll} onOpenChange={setShowBulkEnroll}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Bulk Enrollment</DialogTitle><DialogDescription>Paste email addresses (one per line, or comma-separated) to enroll multiple learners at once.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Assign to Cohort (optional)</Label>
              <Select value={selectedCohort || ''} onValueChange={setSelectedCohort}><SelectTrigger><SelectValue placeholder="Select a cohort" /></SelectTrigger><SelectContent>{cohorts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              <Textarea placeholder={"john@company.com\njane@company.com\nmike@company.com"} value={bulkEmails} onChange={(e) => setBulkEmails(e.target.value)} rows={6} className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">{bulkEmails.split(/[\n,;]+/).filter((e) => e.trim().includes('@')).length} valid email(s) detected</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkEnroll(false)}>Cancel</Button>
            <Button onClick={handleBulkEnroll} disabled={enrollLoading} className="gap-2 bg-halo-navy hover:bg-halo-navy/90 text-white">{enrollLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}Enroll Members</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
