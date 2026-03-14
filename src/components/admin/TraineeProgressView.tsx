import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, GraduationCap, TrendingUp, Clock, Eye, Calendar, Building, Mail, Phone
} from "lucide-react";
import { SecurityStatusIndicator } from "@/components/SecurityStatusIndicator";
import { SecurePIIDisplay } from "@/components/SecurePIIDisplay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TraineeProgress {
  user_id: string;
  trainee_name: string;
  trainee_email: string;
  trainee_phone: string;
  trainee_company: string;
  join_date?: string;
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  overall_progress_percentage: number;
  last_activity?: string;
  course_progress_details: unknown;
  is_masked?: boolean;
  role?: string;
}

interface TraineeStats {
  totalTrainees: number;
  activeTrainees: number;
  averageProgress: number;
  completedCourses: number;
}

export const TraineeProgressView = () => {
  const [trainees, setTrainees] = useState<TraineeProgress[]>([]);
  const [stats, setStats] = useState<TraineeStats>({
    totalTrainees: 0, activeTrainees: 0, averageProgress: 0, completedCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeProgress | null>(null);

  useEffect(() => { loadTraineeProgress(); }, []);

  const loadTraineeProgress = async () => {
    try {
      setLoading(true);

      // Get trainee profiles via secure function
      const { data, error } = await supabase.rpc('get_trainee_profiles_secure');
      if (error) { console.error('Error fetching trainees:', error); throw error; }

      const profiles = data || [];
      const userIds = profiles.map((p: unknown) => p.user_id);

      // Fetch real progress data for all trainees
      let progressData: unknown[] = [];
      if (userIds.length > 0) {
        const { data: progress } = await supabase
          .from('course_progress')
          .select('user_id, course_id, module_id, progress_percentage, updated_at')
          .in('user_id', userIds);
        progressData = progress || [];
      }

      // Fetch real learning stats for last activity
      let statsData: unknown[] = [];
      if (userIds.length > 0) {
        const { data: lStats } = await supabase
          .from('learning_stats')
          .select('user_id, last_activity_at')
          .in('user_id', userIds);
        statsData = lStats || [];
      }

      const statsMap = new Map(statsData.map(s => [s.user_id, s.last_activity_at]));

      // Group progress by user
      const userProgressMap = new Map<string, typeof progressData>();
      progressData.forEach(p => {
        if (!userProgressMap.has(p.user_id)) userProgressMap.set(p.user_id, []);
        userProgressMap.get(p.user_id)!.push(p);
      });

      const transformedData = profiles.map((profile: unknown) => {
        const userProgress = userProgressMap.get(profile.user_id) || [];
        
        // Get unique courses
        const courseIds = [...new Set(userProgress.map(p => p.course_id))];
        const totalCourses = courseIds.length;

        // Get unique modules per course and check completion
        const moduleMap = new Map<string, number>();
        userProgress.forEach(p => {
          if (p.module_id) {
            const existing = moduleMap.get(p.module_id) || 0;
            moduleMap.set(p.module_id, Math.max(existing, p.progress_percentage || 0));
          }
        });

        const completedModules = [...moduleMap.values()].filter(v => v === 100).length;
        const inProgressModules = [...moduleMap.values()].filter(v => v > 0 && v < 100).length;
        const totalModules = moduleMap.size;
        const overallProgress = totalModules > 0
          ? Math.round([...moduleMap.values()].reduce((sum, v) => sum + v, 0) / totalModules)
          : 0;

        // Determine completed courses (all modules at 100%)
        const courseModuleMap = new Map<string, number[]>();
        userProgress.forEach(p => {
          if (p.module_id && p.course_id) {
            if (!courseModuleMap.has(p.course_id)) courseModuleMap.set(p.course_id, []);
            courseModuleMap.get(p.course_id)!.push(p.progress_percentage || 0);
          }
        });
        const completedCourses = [...courseModuleMap.entries()].filter(
          ([, progresses]) => progresses.length > 0 && progresses.every(p => p === 100)
        ).length;
        const inProgressCourses = totalCourses - completedCourses;

        const lastActivity = statsMap.get(profile.user_id) || 
          (userProgress.length > 0 ? userProgress.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.updated_at : null);

        return {
          user_id: profile.user_id,
          trainee_name: profile.name,
          trainee_email: profile.email,
          trainee_phone: profile.phone,
          trainee_company: profile.company,
          join_date: profile.created_at,
          last_activity: lastActivity,
          is_masked: false,
          role: profile.role,
          total_courses: totalCourses,
          completed_courses: completedCourses,
          in_progress_courses: inProgressCourses,
          overall_progress_percentage: overallProgress,
          course_progress_details: courseIds.map(cid => {
            const mods = courseModuleMap.get(cid) || [];
            const avg = mods.length > 0 ? Math.round(mods.reduce((s, v) => s + v, 0) / mods.length) : 0;
            return { course_id: cid, progress_percentage: avg, completed_at: avg === 100 ? 'Yes' : null };
          })
        };
      });

      setTrainees(transformedData);

      // Calculate stats
      const totalTrainees = transformedData.length;
      const activeTrainees = transformedData.filter(t =>
        t.last_activity && new Date(t.last_activity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const averageProgress = totalTrainees > 0
        ? Math.round(transformedData.reduce((sum, t) => sum + t.overall_progress_percentage, 0) / totalTrainees)
        : 0;
      const completedCoursesTotal = transformedData.reduce((sum, t) => sum + t.completed_courses, 0);

      setStats({ totalTrainees, activeTrainees, averageProgress, completedCourses: completedCoursesTotal });
    } catch (error: unknown) {
      console.error('Error loading trainee progress:', error);
      toast({ title: "Error", description: error?.message || "Failed to load trainee progress data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 90) return <Badge className="bg-green-500">Excellent</Badge>;
    if (progress >= 70) return <Badge className="bg-blue-500">Good</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="outline">Needs Attention</Badge>;
  };

  const getActivityStatus = (lastActivity?: string) => {
    if (!lastActivity) return <Badge variant="outline">No Activity</Badge>;
    const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceActivity <= 1) return <Badge className="bg-green-500">Active Today</Badge>;
    if (daysSinceActivity <= 7) return <Badge className="bg-blue-500">Active This Week</Badge>;
    if (daysSinceActivity <= 30) return <Badge className="bg-yellow-500">Active This Month</Badge>;
    return <Badge variant="outline">Inactive</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) =>
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><div className="h-4 bg-muted rounded w-20"></div><div className="h-4 w-4 bg-muted rounded"></div></CardHeader>
              <CardContent><div className="h-8 bg-muted rounded w-16 mb-2"></div><div className="h-3 bg-muted rounded w-24"></div></CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Trainees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalTrainees}</div><p className="text-xs text-muted-foreground">Enrolled in training programs</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Trainees</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.activeTrainees}</div><p className="text-xs text-muted-foreground">Active in last 7 days</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Average Progress</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.averageProgress}%</div><p className="text-xs text-muted-foreground">Across all trainees</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed Courses</CardTitle><GraduationCap className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.completedCourses}</div><p className="text-xs text-muted-foreground">Total completions</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div><CardTitle>Trainee Progress Overview</CardTitle><CardDescription>Monitor individual trainee progress and course completion status</CardDescription></div>
            <SecurityStatusIndicator level={trainees.length > 0 && trainees[0].is_masked ? 'masked' : 'secure'} message={trainees.length > 0 && trainees[0].is_masked ? 'Data Masked' : 'Full Access'} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee</TableHead><TableHead>Company</TableHead><TableHead>Overall Progress</TableHead><TableHead>Courses</TableHead><TableHead>Activity Status</TableHead><TableHead>Join Date</TableHead><TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainees.map((trainee) =>
                  <TableRow key={trainee.user_id}>
                    <TableCell>
                      <div className="space-y-1">
                        <SecurePIIDisplay value={trainee.trainee_name} type="name" isMasked={trainee.is_masked} showMaskingIndicator={false} />
                        <div className="text-sm text-muted-foreground"><SecurePIIDisplay value={trainee.trainee_email} type="email" isMasked={trainee.is_masked} showMaskingIndicator={false} /></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="text-sm">{trainee.trainee_company || 'Not specified'}</div></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium">{Math.round(trainee.overall_progress_percentage)}%</span>{getProgressBadge(trainee.overall_progress_percentage)}</div>
                        <Progress value={trainee.overall_progress_percentage} className="w-full h-2" />
                      </div>
                    </TableCell>
                    <TableCell><div className="text-sm"><div>{trainee.completed_courses} completed</div><div className="text-muted-foreground">{trainee.in_progress_courses} in progress</div></div></TableCell>
                    <TableCell>{getActivityStatus(trainee.last_activity)}</TableCell>
                    <TableCell><div className="text-sm">{trainee.join_date ? format(new Date(trainee.join_date), 'MMM dd, yyyy') : 'Unknown'}</div></TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setSelectedTrainee(trainee)}><Eye className="h-4 w-4 mr-2" />Details</Button></DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>Trainee Progress Details</DialogTitle><DialogDescription>Detailed progress information for {trainee.trainee_name}</DialogDescription></DialogHeader>
                          <ScrollArea className="max-h-96">
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span className="text-sm font-medium">Email</span></div><p className="text-sm text-muted-foreground pl-6">{trainee.trainee_email}</p></div>
                                {trainee.trainee_phone && <div className="space-y-2"><div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span className="text-sm font-medium">Phone</span></div><p className="text-sm text-muted-foreground pl-6">{trainee.trainee_phone}</p></div>}
                                {trainee.trainee_company && <div className="space-y-2"><div className="flex items-center gap-2"><Building className="h-4 w-4" /><span className="text-sm font-medium">Company</span></div><p className="text-sm text-muted-foreground pl-6">{trainee.trainee_company}</p></div>}
                                <div className="space-y-2"><div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span className="text-sm font-medium">Join Date</span></div><p className="text-sm text-muted-foreground pl-6">{trainee.join_date ? format(new Date(trainee.join_date), 'MMMM dd, yyyy') : 'Unknown'}</p></div>
                              </div>
                              <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-3">Progress Summary</h4>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div><div className="text-2xl font-bold text-green-600">{trainee.completed_courses}</div><div className="text-sm text-muted-foreground">Completed</div></div>
                                  <div><div className="text-2xl font-bold text-blue-600">{trainee.in_progress_courses}</div><div className="text-sm text-muted-foreground">In Progress</div></div>
                                  <div><div className="text-2xl font-bold">{trainee.total_courses}</div><div className="text-sm text-muted-foreground">Total Enrolled</div></div>
                                </div>
                              </div>
                              {trainee.course_progress_details && trainee.course_progress_details.length > 0 && (
                                <div className="border rounded-lg p-4">
                                  <h4 className="font-medium mb-3">Course Details</h4>
                                  <div className="space-y-3">
                                    {trainee.course_progress_details.map((detail: unknown, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm">{detail.course_id}</span>
                                        <div className="flex items-center gap-2">
                                          <Progress value={detail.progress_percentage} className="w-24 h-2" />
                                          <span className="text-sm font-medium">{detail.progress_percentage}%</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
