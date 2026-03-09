import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, CheckCircle, Target, Award, Lock, Star, BookOpen, Calendar, TrendingUp, Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LiveLearningStats } from "@/components/LiveLearningStats";
import { AdaptiveLearningEngine } from "@/components/AdaptiveLearningEngine";
import { EnhancedProgressTracking } from "@/components/EnhancedProgressTracking";
import { GamificationSystem } from "@/components/GamificationSystem";
import { ProgressCharts } from "@/components/progress/ProgressCharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ModuleProgress {
  name: string;
  progress: number;
  status: "completed" | "in-progress" | "available" | "locked";
  timeSpent: string;
  lessons: number;
  completedLessons: number;
}

interface CertificateItem {
  name: string;
  status: "earned" | "in-progress" | "available" | "locked";
  description: string;
  progress: number;
  estimatedTime: string;
}

const ProgressPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [certificatesList, setCertificatesList] = useState<CertificateItem[]>([]);
  const [scoreTrend, setScoreTrend] = useState<{ date: string; score: number }[]>([]);
  const [activityTrend, setActivityTrend] = useState<{ date: string; minutes: number }[]>([]);

  useEffect(() => {
    if (user) fetchProgressData();
  }, [user]);

  const fetchProgressData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch courses, modules, progress, certificates, and activity in parallel
      const [coursesRes, modulesRes, progressRes, certsRes, activityRes] = await Promise.all([
        supabase.from("courses").select("id, title, level").eq("is_active", true).order("order_index"),
        supabase.from("course_content_modules").select("id, course_id, title, lessons_count, order_index").eq("is_active", true).order("order_index"),
        supabase.from("course_progress").select("course_id, module_id, progress_percentage, quiz_score, updated_at").eq("user_id", user.id),
        supabase.from("certificates").select("course_id, issued_at, final_score").eq("user_id", user.id),
        supabase.from("daily_learning_activity").select("activity_date, time_spent_minutes").eq("user_id", user.id).order("activity_date", { ascending: true }).limit(14),
      ]);

      const courses = coursesRes.data || [];
      const modules = modulesRes.data || [];
      const progress = progressRes.data || [];
      const certs = certsRes.data || [];

      // Build module progress
      const progressByModule = new Map<string, number>();
      progress.forEach((p) => {
        if (p.module_id) {
          const current = progressByModule.get(p.module_id) || 0;
          progressByModule.set(p.module_id, Math.max(current, p.progress_percentage || 0));
        }
      });

      let foundInProgress = false;
      const modList: ModuleProgress[] = modules.map((m, idx) => {
        const pct = progressByModule.get(m.id) || 0;
        let status: ModuleProgress["status"];
        if (pct >= 100) {
          status = "completed";
        } else if (pct > 0) {
          status = "in-progress";
          foundInProgress = true;
        } else if (!foundInProgress && idx === 0) {
          status = "available";
        } else if (foundInProgress) {
          status = "available";
          foundInProgress = false; // next ones locked
        } else {
          status = idx === 0 ? "available" : "locked";
        }
        // Re-derive: first non-completed = in-progress or available, rest locked
        const completedLessons = Math.round((pct / 100) * (m.lessons_count || 1));
        const estMinutes = completedLessons * 15;
        return {
          name: m.title,
          progress: pct,
          status,
          timeSpent: estMinutes >= 60 ? `${Math.floor(estMinutes / 60)}h ${estMinutes % 60}m` : `${estMinutes}m`,
          lessons: m.lessons_count || 0,
          completedLessons,
        };
      });

      // Fix status assignment: completed stays, first non-completed is in-progress/available, rest locked
      let firstNonComplete = true;
      for (let i = 0; i < modList.length; i++) {
        if (modList[i].progress >= 100) {
          modList[i].status = "completed";
        } else if (firstNonComplete) {
          modList[i].status = modList[i].progress > 0 ? "in-progress" : "available";
          firstNonComplete = false;
        } else {
          modList[i].status = "locked";
        }
      }

      setModuleProgress(modList.length > 0 ? modList : fallbackModules());

      // Build certificates list
      const certCourseIds = new Set(certs.map((c) => c.course_id));
      const progressByCourse = new Map<string, number>();
      progress.forEach((p) => {
        const current = progressByCourse.get(p.course_id) || 0;
        progressByCourse.set(p.course_id, Math.max(current, p.progress_percentage || 0));
      });

      const certList: CertificateItem[] = courses.map((c) => {
        const earned = certCourseIds.has(c.id);
        const coursePct = progressByCourse.get(c.id) || 0;
        return {
          name: c.title,
          status: earned ? "earned" : coursePct > 0 ? "in-progress" : coursePct === 0 && courses.indexOf(c) <= 1 ? "available" : "locked",
          description: `${c.level} level certification`,
          progress: earned ? 100 : coursePct,
          estimatedTime: earned ? "Completed" : `${3 + Math.floor(Math.random() * 4)} hours`,
        };
      });

      setCertificatesList(certList.length > 0 ? certList : fallbackCertificates());

      // Build score trend from quiz scores
      const scoresWithDates = progress
        .filter((p) => p.quiz_score && p.quiz_score > 0 && p.updated_at)
        .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
        .map((p) => ({
          date: new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: p.quiz_score!,
        }));
      setScoreTrend(scoresWithDates);

      // Build activity trend
      const actData = (activityRes.data || []).map((a) => ({
        date: new Date(a.activity_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        minutes: a.time_spent_minutes || 0,
      }));
      setActivityTrend(actData);
    } catch (err) {
      console.error("Error fetching progress:", err);
      setModuleProgress(fallbackModules());
      setCertificatesList(fallbackCertificates());
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = useMemo(() => {
    if (moduleProgress.length === 0) return 0;
    return Math.round(moduleProgress.reduce((s, m) => s + m.progress, 0) / moduleProgress.length);
  }, [moduleProgress]);

  const statusCounts = useMemo(() => {
    const counts = { completed: 0, inProgress: 0, available: 0, locked: 0 };
    moduleProgress.forEach((m) => {
      if (m.status === "completed") counts.completed++;
      else if (m.status === "in-progress") counts.inProgress++;
      else if (m.status === "available") counts.available++;
      else counts.locked++;
    });
    return counts;
  }, [moduleProgress]);

  const getProgressStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent/15 text-accent border-accent/20 hover:bg-accent/15">Completed</Badge>;
      case "in-progress":
        return <Badge className="text-primary border-primary/20 bg-white">In Progress</Badge>;
      case "available":
        return <Badge className="bg-halo-orange/15 text-halo-orange border-halo-orange/20 hover:bg-halo-orange/15 bg-white">Ready to Start</Badge>;
      case "locked":
        return <Badge variant="outline" className="opacity-60 text-black">Locked</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const getCertificateStatusBadge = (status: string) => {
    switch (status) {
      case "earned":
        return <Badge className="gap-1 bg-accent/15 text-accent border-accent/20 hover:bg-accent/15"><Trophy className="h-3 w-3" />Earned</Badge>;
      case "in-progress":
        return <Badge className="gap-1 bg-primary/15 text-primary border-primary/20 hover:bg-primary/15"><Zap className="h-3 w-3" />In Progress</Badge>;
      case "available":
        return <Badge className="gap-1 bg-halo-orange/15 text-halo-orange border-halo-orange/20 hover:bg-halo-orange/15"><Star className="h-3 w-3" />Available</Badge>;
      case "locked":
        return <Badge variant="outline" className="gap-1 opacity-60"><Lock className="h-3 w-3" />Locked</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-accent" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-primary" />;
      case "available":
        return <BookOpen className="h-5 w-5 text-halo-orange" />;
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Learning Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                Learning Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Your personalized financial education journey
              </p>
            </div>
          </div>
        </div>

        {/* Live Learning Stats Widget */}
        <LiveLearningStats />

        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-white">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Learning Progress</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground">
            Your Learning Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress through the comprehensive Halo Business Finance certification program
          </p>
        </div>

        <Tabs defaultValue="progress" className="w-full space-y-8 bg-white">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-background/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-foreground">
              Learning Progress
            </TabsTrigger>
            <TabsTrigger value="enhanced-tracking" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-foreground">
              Enhanced Tracking
            </TabsTrigger>
            <TabsTrigger value="ai-learning" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-foreground">
              AI Learning
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-foreground">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="gamification" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-foreground">
              Gamification
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-8 animate-fade-in">
            {/* Overall Progress Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-white">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  Overall Progress
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  You're making great progress on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Course Completion</span>
                    <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={overallProgress} className="h-4 bg-muted/50" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-30" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2 p-4 rounded-lg bg-background/50 border border-border/50 hover-scale">
                    <div className="text-3xl font-bold text-accent">{statusCounts.completed}</div>
                    <div className="text-sm text-muted-foreground font-medium">Completed</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-background/50 border border-border/50 hover-scale">
                    <div className="text-3xl font-bold text-primary">{statusCounts.inProgress}</div>
                    <div className="text-sm text-muted-foreground font-medium">In Progress</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-background/50 border border-border/50 hover-scale">
                    <div className="text-3xl font-bold text-halo-orange">{statusCounts.available}</div>
                    <div className="text-sm text-muted-foreground font-medium">Available</div>
                  </div>
                  <div className="text-center space-y-2 p-4 rounded-lg bg-background/50 border border-border/50 hover-scale">
                    <div className="text-3xl font-bold text-muted-foreground">{statusCounts.locked}</div>
                    <div className="text-sm text-muted-foreground font-medium">Locked</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <ProgressCharts scoreTrend={scoreTrend} activityTrend={activityTrend} />

            {/* Module Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  Learning Modules
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Master each module to unlock the next one in your learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleProgress.map((module, index) => (
                    <div
                      key={module.name}
                      className="group border rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-200 hover:border-primary/20 bg-gradient-to-r from-background to-background/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-colors ${
                              module.status === 'completed' ? 'bg-accent/15 text-accent' :
                              module.status === 'in-progress' ? 'bg-primary/15 text-primary' :
                              module.status === 'available' ? 'bg-halo-orange/15 text-halo-orange' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {module.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : index + 1}
                            </div>
                            {index < moduleProgress.length - 1 && (
                              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-border" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                              {module.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {getProgressStatusBadge(module.status)}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {module.timeSpent}
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {module.completedLessons}/{module.lessons} lessons
                              </div>
                            </div>
                          </div>
                        </div>
                        {getStatusIcon(module.status)}
                      </div>

                      {module.status !== "locked" && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <span className="font-semibold text-primary">{module.progress}%</span>
                          </div>
                          <div className="relative">
                            <Progress value={module.progress} className="h-3 bg-muted/50" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="enhanced-tracking" className="space-y-8 animate-fade-in">
            <EnhancedProgressTracking />
          </TabsContent>
          
          <TabsContent value="ai-learning" className="space-y-8 animate-fade-in">
            <AdaptiveLearningEngine />
          </TabsContent>
          
          <TabsContent value="certificates" className="space-y-8 animate-fade-in">
            {/* Summary Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-accent/5">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-50" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  Professional Certifications
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Earn industry-recognized certifications to advance your career
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Earned", value: certificatesList.filter((c) => c.status === "earned").length, color: "text-accent" },
                    { label: "In Progress", value: certificatesList.filter((c) => c.status === "in-progress").length, color: "text-primary" },
                    { label: "Available", value: certificatesList.filter((c) => c.status === "available").length, color: "text-halo-orange" },
                    { label: "Locked", value: certificatesList.filter((c) => c.status === "locked").length, color: "text-muted-foreground" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center space-y-2 p-4 rounded-lg bg-background/50 border border-border/50 hover-scale">
                      <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates Grid */}
            <div className="grid gap-6">
              {certificatesList.map((certificate) => (
                <Card
                  key={certificate.name}
                  className={`group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    certificate.status === "earned" ? "bg-accent/5 border-accent/20" :
                    certificate.status === "in-progress" ? "bg-primary/5 border-primary/20" :
                    certificate.status === "available" ? "bg-halo-orange/5 border-halo-orange/20" :
                    "bg-gradient-to-r from-background to-muted/20"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            certificate.status === "earned" ? "bg-accent/15" :
                            certificate.status === "in-progress" ? "bg-primary/15" :
                            certificate.status === "available" ? "bg-halo-orange/15" :
                            "bg-muted"
                          }`}>
                            <Award className={`h-5 w-5 ${
                              certificate.status === "earned" ? "text-accent" :
                              certificate.status === "in-progress" ? "text-primary" :
                              certificate.status === "available" ? "text-halo-orange" :
                              "text-muted-foreground"
                            }`} />
                          </div>
                          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                            {certificate.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                          {certificate.description}
                        </CardDescription>
                        {certificate.status !== "locked" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{certificate.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                      {getCertificateStatusBadge(certificate.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {certificate.status === "in-progress" && certificate.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-semibold text-primary">{certificate.progress}%</span>
                        </div>
                        <Progress value={certificate.progress} className="h-2" />
                      </div>
                    )}

                    {certificate.status === "available" && (
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        onClick={() => navigate("/dashboard")}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Start Learning Path
                      </Button>
                    )}

                    {certificate.status === "in-progress" && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5"
                        onClick={() => navigate("/dashboard")}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    )}

                    {certificate.status === "locked" && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Complete prerequisite modules to unlock this certification and advance your expertise
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-8 animate-fade-in">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-accent/5">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-50" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  Gamification & Achievements
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Earn badges, compete on leaderboards, and track your achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <GamificationSystem />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Fallback data when no Supabase data exists
function fallbackModules(): ModuleProgress[] {
  return [
    { name: "Business Finance Foundations", progress: 0, status: "available", timeSpent: "0m", lessons: 8, completedLessons: 0 },
    { name: "Capital Markets", progress: 0, status: "locked", timeSpent: "0m", lessons: 6, completedLessons: 0 },
    { name: "SBA Loan Programs", progress: 0, status: "locked", timeSpent: "0m", lessons: 10, completedLessons: 0 },
    { name: "Conventional Lending", progress: 0, status: "locked", timeSpent: "0m", lessons: 7, completedLessons: 0 },
  ];
}

function fallbackCertificates(): CertificateItem[] {
  return [
    { name: "Business Finance Foundations", status: "available", description: "Fundamental concepts in business finance", progress: 0, estimatedTime: "3-4 hours" },
    { name: "Capital Markets Specialist", status: "locked", description: "Advanced understanding of capital markets", progress: 0, estimatedTime: "4-5 hours" },
  ];
}

export default ProgressPage;
