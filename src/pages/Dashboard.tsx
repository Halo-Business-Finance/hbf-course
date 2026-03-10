import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleDetail from "@/components/ModuleDetail";
import { FinPilotBrandFooter } from "@/components/FinPilotBrandFooter";
import { useCourses } from "@/hooks/useCourses";
import { useModules } from "@/hooks/useModules";
import { useLearningStats } from "@/hooks/useLearningStats";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useCourseSelection } from "@/contexts/CourseSelectionContext";
import { BookOpen, Clock, Target, Flame, Award, BarChart3, MessageSquare, Lightbulb } from "lucide-react";
import { WelcomeWizard } from "@/components/onboarding/WelcomeWizard";
import { QuickResumeReminder } from "@/components/dashboard/QuickResumeReminder";
import { SmartRecommendations } from "@/components/recommendations/SmartRecommendations";
import { DiscussionForum } from "@/components/social/DiscussionForum";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { AchievementBadges } from "@/components/dashboard/AchievementBadges";
import { LearningAnalyticsCharts } from "@/components/dashboard/LearningAnalyticsCharts";
import { DashboardCourseGrid } from "@/components/dashboard/DashboardCourseGrid";
import { motion } from "framer-motion";
import { useNotificationTriggers } from "@/hooks/useNotificationTriggers";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";

// Course images
import courseSba7a from "@/assets/course-sba-7a.jpg";
import courseSbaExpress from "@/assets/course-sba-express.jpg";
import courseCommercialRealEstate from "@/assets/course-commercial-real-estate.jpg";
import courseEquipmentFinancing from "@/assets/course-equipment-financing.jpg";
import courseLinesOfCredit from "@/assets/course-lines-of-credit.jpg";
import courseInvoiceFactoring from "@/assets/course-invoice-factoring.jpg";
import courseMerchantCashAdvances from "@/assets/course-merchant-cash-advances.jpg";
import courseAssetBasedLending from "@/assets/course-asset-based-lending.jpg";
import courseConstructionLoans from "@/assets/course-construction-loans.jpg";
import courseFranchiseFinancing from "@/assets/course-franchise-financing.jpg";
import courseWorkingCapital from "@/assets/course-working-capital.jpg";
import courseHealthcareFinancing from "@/assets/course-healthcare-financing.jpg";
import courseRestaurantFinancing from "@/assets/course-restaurant-financing.jpg";
import courseBridgeLoans from "@/assets/course-bridge-loans.jpg";
import courseTermLoans from "@/assets/course-term-loans.jpg";
import courseBusinessAcquisition from "@/assets/course-business-acquisition.jpg";

const imageMap: Record<string, string> = {
  "SBA 7(a)": courseSba7a,
  "SBA Express": courseSbaExpress,
  "Commercial Real Estate": courseCommercialRealEstate,
  "Equipment Financing": courseEquipmentFinancing,
  "Business Lines of Credit": courseLinesOfCredit,
  "Invoice Factoring": courseInvoiceFactoring,
  "Merchant Cash Advances": courseMerchantCashAdvances,
  "Asset-Based Lending": courseAssetBasedLending,
  "Construction Loans": courseConstructionLoans,
  "Franchise Financing": courseFranchiseFinancing,
  "Working Capital": courseWorkingCapital,
  "Healthcare Financing": courseHealthcareFinancing,
  "Restaurant Financing": courseRestaurantFinancing,
  "Bridge Loans": courseBridgeLoans,
  "Term Loans": courseTermLoans,
  "Business Acquisition": courseBusinessAcquisition
};

const topicToCourses: Record<string, string[]> = {
  Featured: ["SBA 7(a)", "Commercial Real Estate", "Equipment Financing"],
  "SBA Lending": ["SBA 7(a)", "SBA Express"],
  "Commercial Real Estate": ["Commercial Real Estate", "Construction Loans", "Bridge Loans"],
  "Equipment Financing": ["Equipment Financing"],
  "Working Capital": ["Working Capital", "Business Lines of Credit", "Invoice Factoring"],
  "Credit Analysis": ["Asset-Based Lending", "Business Acquisition"],
  "Risk Management": ["Merchant Cash Advances", "Term Loans"]
};

const getCourseImage = (courseTitle: string) => {
  const baseTitle = courseTitle.replace(/ - (Beginner|Expert)$/, "");
  return imageMap[baseTitle] || courseSba7a;
};

const Dashboard = () => {
  const { user, hasEnrollment, enrollmentVerified, isLoading: authLoading } = useSecureAuth();
  const { availableCourses, canSelectCourse, getActiveStudyCourse, refreshCourses } = useCourseSelection();
  const { courses: databaseCourses, loading: coursesLoading } = useCourses();
  const { modules: databaseModules, loading: modulesLoading } = useModules();
  const { dashboardStats } = useLearningStats(user?.id);
  const {
    moduleProgress,
    progress,
    loading: progressLoading,
    startModule,
    completeModule,
    isModuleUnlocked,
    getOverallProgress,
    getCompletedModulesCount,
    getCourseProgress
  } = useCourseProgress(user?.id);
  const { toast } = useToast();
  const notif = useNotificationTriggers(user?.id);

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentFilterLevel, setCurrentFilterLevel] = useState(0);
  const [filterNavigationPath, setFilterNavigationPath] = useState<any[]>([]);
  const [selectedSkillLevelForCourse, setSelectedSkillLevelForCourse] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeStudyCourse = getActiveStudyCourse();

  // Combine courses with modules
  const coursesWithModules = databaseCourses.map((course) => ({
    ...course,
    modules: databaseModules.filter((m) => m.course_id === course.id && m.is_active)
  }));

  // Compute which courses are fully completed (all modules at 100%)
  const completedCourseIds = coursesWithModules.
  filter((course) => {
    if (course.modules.length === 0) return false;
    return course.modules.every((m) => moduleProgress[m.id]?.completed);
  }).
  map((c) => c.id);

  // Filter by topic
  const filteredCoursesWithModules = (() => {
    if (selectedTopic && topicToCourses[selectedTopic]) {
      const topicCourses = new Set(topicToCourses[selectedTopic]);
      return coursesWithModules.filter((course) => {
        const baseTitle = course.title.replace(/ - (Beginner|Expert)$/i, "").trim();
        return topicCourses.has(baseTitle);
      });
    }
    return coursesWithModules;
  })();

  const flattenedModules = filteredCoursesWithModules.flatMap((course) =>
  course.modules.map((module) => ({
    ...module,
    course_title: course.title,
    course_level: course.level,
    skill_level: course.level,
    id: module.id,
    title: module.title,
    description: module.description,
    duration: module.duration,
    lessons: module.lessons_count,
    order: module.order_index
  }))
  );

  const loading = coursesLoading || modulesLoading || progressLoading;

  // Scroll to top on filter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentFilterLevel]);

  const handleStartCourse = (courseName: string) => {
    const targetCourse = availableCourses.find(
      (c) => c.title.split(" - ")[0].toLowerCase() === courseName.toLowerCase()
    );
    if (targetCourse && !canSelectCourse(targetCourse.id)) {
      toast({
        title: "Course Locked",
        description: `Complete your current course (${activeStudyCourse?.title}) before starting a new one.`,
        variant: "destructive"
      });
      return;
    }

    const courseModules = flattenedModules.filter((m) => {
      const moduleBaseName = m.course_title.replace(/\s*-\s*(Beginner|Expert)$/i, "").trim();
      return moduleBaseName.toLowerCase() === courseName.toLowerCase();
    });

    if (courseModules.length === 0) {
      toast({ title: "No modules found", description: `No modules found for ${courseName}.`, variant: "destructive" });
      return;
    }

    setFilterNavigationPath([{ id: courseName.toLowerCase().replace(/\s+/g, "-"), name: courseName, count: courseModules.length }]);
    setCurrentFilterLevel(1);
  };

  const handleProceedToModules = (level: string) => {
    const selectedCourse = filterNavigationPath[0];
    setSelectedSkillLevelForCourse(level);
    setCurrentFilterLevel(2);

    const levelModules = flattenedModules.filter((m) => {
      const matchesCourse = m.course_title.toLowerCase().includes(selectedCourse.name.toLowerCase());
      const moduleLevel = m.skill_level === "none" ? "beginner" : m.skill_level;
      return matchesCourse && moduleLevel === level;
    });

    setFilterNavigationPath([
    selectedCourse,
    { id: `${selectedCourse.id}-${level}`, name: `${level.charAt(0).toUpperCase() + level.slice(1)} Level`, count: levelModules.length }]
    );
  };

  const handleReturnToDashboard = () => {
    setCurrentFilterLevel(0);
    setFilterNavigationPath([]);
    setSelectedSkillLevelForCourse(null);
  };

  const filteredModules = flattenedModules.filter((module) => {
    if (currentFilterLevel !== 2) return true;
    const selectedCourse = filterNavigationPath[0];
    const moduleLevel = module.skill_level === "none" ? "beginner" : module.skill_level;
    const matchesCourse = module.course_title.toLowerCase().includes(selectedCourse?.name.toLowerCase() || "");
    if (!selectedSkillLevelForCourse) return matchesCourse;
    return matchesCourse && moduleLevel === selectedSkillLevelForCourse;
  });

  const handleStartCourseModule = async (moduleId: string) => {
    if (!user?.id) return;
    const success = await startModule(moduleId);
    if (success) {
      const mod = flattenedModules.find((m) => m.id === moduleId);
      notif.onModuleStarted(mod?.title || 'Module', moduleId);
      toast({ title: "Module Started", description: "You've started this learning module!" });
      window.location.assign(`/module/${moduleId}`);
    }
  };

  const getCourseDetails = (courseName: string) => {
    const matchingCourses = coursesWithModules.filter(
      (c) => c.title.split(" - ")[0].toLowerCase() === courseName.toLowerCase()
    );
    const hasExpert = matchingCourses.some((c) => c.level === "expert");
    const hasBeginner = matchingCourses.some((c) => c.level === "beginner");
    const difficulty = hasExpert && hasBeginner ? "Multiple Levels" : hasExpert ? "Expert" : "Beginner";
    const sampleCourse = matchingCourses[0];
    return {
      description: sampleCourse?.description || "Comprehensive training program with practical applications",
      duration: "6-8 weeks",
      difficulty,
      topics: sampleCourse?.modules?.flatMap((m: any) => m.topics || []).slice(0, 6) || ["Core Concepts"],
      outcome: `Master ${courseName} with professional expertise`
    };
  };

  const getFirstName = () => {
    if (!user) return "Learner";
    if (user.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0];
    if (user.email) return user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1);
    return "Learner";
  };

  const overallProgress = getOverallProgress();
  const completedCount = getCompletedModulesCount();
  const currentStreak = dashboardStats?.currentStreak || 0;
  const longestStreak = dashboardStats?.longestStreak || 0;

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>);

  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Sign in to access your learning dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/auth"} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  const isOnCatalog = currentFilterLevel === 0;

  return (
    <div className="min-h-screen bg-background">
      <div ref={containerRef} className="w-full">
        <WelcomeWizard />

        {/* ── Welcome Header ── */}
        <motion.div
          className="border-b border-border bg-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          
           <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-8 max-w-7xl mx-auto bg-black">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 border-black">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}>
                
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-white">
                  Welcome back, <span className="text-halo-navy text-white">{getFirstName()}</span>
                </h1>
                <p className="text-xs sm:text-sm text-white">
                  Continue your journey in business finance mastery.
                </p>
              </motion.div>

              {/* Stat pills */}
              <motion.div
                className="grid grid-cols-3 gap-2 sm:gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}>
                
                <StatPill icon={<Flame className="h-4 w-4 sm:h-5 sm:w-5 text-halo-orange" />} value={currentStreak} label="Day streak" />
                <Separator orientation="vertical" className="h-10 hidden sm:block" />
                <StatPill icon={<Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />} value={`${Math.round(overallProgress)}%`} label="Complete" />
                <Separator orientation="vertical" className="h-10 hidden sm:block" />
                <StatPill icon={<Award className="h-4 w-4 sm:h-5 sm:w-5 text-halo-orange" />} value={completedCount} label="Modules done" />
              </motion.div>
            </div>

            {/* Overall progress bar */}
            <motion.div
              className="mt-6 max-w-lg"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ transformOrigin: "left" }}>
              
              <div className="flex justify-between mb-2 text-white">
                <span className="text-xs font-semibold text-white">Overall Progress</span>
                <span className="text-xs text-white">
                  {completedCount}/{flattenedModules.length} modules
                </span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-halo-navy to-halo-orange rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }} />
                
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Quick Resume + Study Reminder — only at top level */}
          {isOnCatalog &&
          <AnimatedSection>
              <QuickResumeReminder />
            </AnimatedSection>
          }

          {/* Tabbed Layout — only at catalog level */}
          {isOnCatalog ?
           <Tabs defaultValue="courses" className="w-full">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="w-full sm:w-auto sm:max-w-md bg-muted/50 p-1 rounded-lg inline-flex">
                  <TabsTrigger value="courses" className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap">
                    <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap">
                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="community" className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Community
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="courses" className="mt-6">
                <DashboardCourseGrid
                coursesWithModules={coursesWithModules}
                flattenedModules={flattenedModules}
                filteredCoursesWithModules={filteredCoursesWithModules}
                filteredModules={filteredModules}
                moduleProgress={moduleProgress}
                currentFilterLevel={currentFilterLevel}
                filterNavigationPath={filterNavigationPath}
                selectedCategory={selectedCategory}
                selectedTopic={selectedTopic}
                loading={loading}
                coursesLoading={coursesLoading}
                completedCourseIds={completedCourseIds}
                onCategorySelect={setSelectedCategory}
                onTopicSelect={setSelectedTopic}
                onStartCourse={handleStartCourse}
                onProceedToModules={handleProceedToModules}
                onReturnToDashboard={handleReturnToDashboard}
                onBackToLevel1={() => {
                  setCurrentFilterLevel(1);
                  setFilterNavigationPath([filterNavigationPath[0]]);
                }}
                getCourseDetails={getCourseDetails}
                getCourseImage={getCourseImage}
                isModuleUnlocked={isModuleUnlocked} />
              
              </TabsContent>

              <TabsContent value="analytics" className="mt-6 space-y-6">
                <LearningAnalyticsCharts />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StreakCounter
                  currentStreak={currentStreak}
                  longestStreak={longestStreak}
                  lastActiveDate={new Date().toISOString().split("T")[0]} />
                
                  <AchievementBadges
                  badges={[
                  { id: "1", name: "First Steps", description: "Complete your first module", icon: "target" as const, unlocked: completedCount >= 1, color: "bronze" },
                  { id: "2", name: "Quick Learner", description: "Complete 5 modules", icon: "zap" as const, unlocked: completedCount >= 5, color: "silver" },
                  { id: "3", name: "SBA Expert", description: "Master all SBA courses", icon: "trophy" as const, unlocked: false, progress: Math.min(100, completedCount * 10), color: "gold" }]
                  } />
                
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-6 space-y-6">
                <SmartRecommendations />
                <DiscussionForum />
              </TabsContent>
            </Tabs> : (

          /* Drill-down views (level 1 & 2) render course grid directly */
          <DashboardCourseGrid
            coursesWithModules={coursesWithModules}
            flattenedModules={flattenedModules}
            filteredCoursesWithModules={filteredCoursesWithModules}
            filteredModules={filteredModules}
            moduleProgress={moduleProgress}
            currentFilterLevel={currentFilterLevel}
            filterNavigationPath={filterNavigationPath}
            selectedCategory={selectedCategory}
            selectedTopic={selectedTopic}
            loading={loading}
            coursesLoading={coursesLoading}
            completedCourseIds={completedCourseIds}
            onCategorySelect={setSelectedCategory}
            onTopicSelect={setSelectedTopic}
            onStartCourse={handleStartCourse}
            onProceedToModules={handleProceedToModules}
            onReturnToDashboard={handleReturnToDashboard}
            onBackToLevel1={() => {
              setCurrentFilterLevel(1);
              setFilterNavigationPath([filterNavigationPath[0]]);
            }}
            getCourseDetails={getCourseDetails}
            getCourseImage={getCourseImage}
            isModuleUnlocked={isModuleUnlocked} />)

          }
        </div>

        {/* Module Detail Modal */}
        {selectedModule && flattenedModules.find((m) => m.id === selectedModule) &&
        <ModuleDetail
          module={{
            ...flattenedModules.find((m) => m.id === selectedModule)!,
            progress: moduleProgress[selectedModule]?.progress_percentage || 0,
            loanExamples: [],
            videos: [],
            caseStudies: [],
            scripts: [],
            quiz: {
              id: `quiz-${selectedModule}`,
              moduleId: selectedModule,
              title: `${flattenedModules.find((m) => m.id === selectedModule)?.title} Assessment`,
              description: "Complete this assessment to test your understanding",
              questions: [],
              passingScore: 80,
              maxAttempts: 3,
              timeLimit: 30
            }
          }}
          onClose={() => setSelectedModule(null)} />

        }

        <FinPilotBrandFooter />
      </div>
    </div>);

};

/** Small reusable stat pill for the header */
function StatPill({ icon, value, label }: {icon: React.ReactNode;value: string | number;label: string;}) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3 group">
      <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-halo-navy/5 flex items-center justify-center border border-halo-navy/10 group-hover:border-halo-navy/30 group-hover:bg-halo-navy/10 transition-all duration-300 bg-black">
        {icon}
      </div>
      <div>
        <p className="text-sm sm:text-xl font-bold tracking-tight text-white">{value}</p>
        <p className="text-[9px] sm:text-xs font-medium uppercase tracking-wider text-white">{label}</p>
      </div>
    </div>);

}

export default Dashboard;