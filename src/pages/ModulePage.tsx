import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Clock, Play, CheckCircle, Book, Video, FileText, Users2, BookOpen, Zap, Download, AlertCircle } from "lucide-react";
import { LessonModal } from "@/components/LessonModal";
import { ModuleQuiz } from "@/components/ModuleQuiz";
import { FloatingNotesButton } from "@/components/notes/FloatingNotesButton";
import { NotesModal } from "@/components/notes/NotesModal";
import { QuestionModal } from "@/components/QuestionModal";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { StickyProgressBar } from "@/components/progress/StickyProgressBar";
import { KeyTakeaways } from "@/components/lessons/KeyTakeaways";
import { LessonSidebarTOC } from "@/components/lessons/LessonSidebarTOC";
import { useNotes } from "@/contexts/NotesContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseSelection } from "@/contexts/CourseSelectionContext";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'document' | 'interactive';
  duration: string;
  completed: boolean;
  content?: any;
  url?: string;
  order_index: number;
}

const ModulePage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { setSelectedCourse, setSelectedCourseForNavigation } = useCourseSelection();
  const { moduleProgress } = useCourseProgress(user?.id);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [courseName, setCourseName] = useState<string>("");

  const { isNotesModalOpen, setIsNotesModalOpen, setCurrentContext, getNotesByModule } = useNotes();
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const moduleNotesCount = moduleId ? getNotesByModule(moduleId).length : 0;
  const [module, setModule] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleAndContent = async () => {
      if (!moduleId) return;
      const dbModuleId = decodeURIComponent(moduleId);
      try {
        const { data: dbModule, error: moduleError } = await supabase
          .from('course_content_modules')
          .select('*')
          .eq('id', dbModuleId)
          .maybeSingle();

        if (moduleError || !dbModule) {
          setLoading(false);
          return;
        }
        setModule(dbModule);

        if (dbModule.course_id) {
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id, title, description')
            .eq('id', dbModule.course_id)
            .maybeSingle();

          if (courseData && !courseError) {
            setSelectedCourseForNavigation({
              id: courseData.id,
              title: courseData.title,
              description: courseData.description
            });
            setCourseName(courseData.title);
          }
        }

        const moduleForContent = dbModule.id;
        const [videosResponse, articlesResponse, assessmentsResponse, documentsResponse] = await Promise.all([
          supabase.from('course_videos').select('*').eq('module_id', moduleForContent).eq('is_active', true).order('order_index'),
          supabase.from('course_articles').select('*').eq('module_id', moduleForContent).eq('is_published', true).order('order_index'),
          supabase.from('course_assessments').select('*').eq('module_id', moduleForContent).order('order_index'),
          supabase.from('course_documents').select('*').eq('module_id', moduleForContent).order('title')
        ]);

        const allLessons: Lesson[] = [];

        if (videosResponse.data?.length) {
          videosResponse.data.forEach(video => {
            allLessons.push({
              id: video.id, title: video.title, type: 'video',
              duration: video.duration_seconds ? `${Math.round(video.duration_seconds / 60)} min` : '15 min',
              completed: false, content: video, url: video.video_url, order_index: video.order_index
            });
          });
        }

        if (articlesResponse.data?.length) {
          articlesResponse.data.forEach(article => {
            allLessons.push({
              id: article.id, title: article.title, type: 'reading',
              duration: article.reading_time_minutes ? `${article.reading_time_minutes} min read` : '10 min read',
              completed: false, content: article, order_index: article.order_index
            });
          });
        }

        if (assessmentsResponse.data?.length) {
          assessmentsResponse.data.forEach(assessment => {
            allLessons.push({
              id: assessment.id, title: assessment.title, type: 'quiz',
              duration: assessment.time_limit_minutes ? `${assessment.time_limit_minutes} min` : '20 min',
              completed: false, content: assessment, order_index: assessment.order_index
            });
          });
        }

        if (documentsResponse.data?.length) {
          documentsResponse.data.forEach(document => {
            allLessons.push({
              id: document.id, title: document.title, type: 'document',
              duration: '5 min', completed: false, content: document,
              url: document.file_url, order_index: 0
            });
          });
        }

        if (allLessons.length === 0 && dbModule.topics && Array.isArray(dbModule.topics)) {
          (dbModule.topics as string[]).forEach((topic: string, index: number) => {
            allLessons.push({
              id: `demo-${index}`, title: topic,
              type: index % 3 === 0 ? 'video' : index % 3 === 1 ? 'reading' : 'quiz',
              duration: '15 min', completed: false,
              content: { title: topic, description: `Learn about ${topic}` },
              order_index: index
            });
          });
        }

        allLessons.sort((a, b) => a.order_index - b.order_index);
        setLessons(allLessons);
      } catch (error) {
        console.error('Error fetching module content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleAndContent();
  }, [moduleId, setSelectedCourse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Loading Module...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Module Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested module could not be found.</p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLessonStart = (lesson: any) => {
    if (!user) {
      toast({ title: "Sign In Required", description: "Please sign in to access course content", variant: "destructive" });
      navigate('/auth');
      return;
    }
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleTakeNotes = () => {
    setCurrentContext(moduleId!, selectedLesson?.id);
    setIsNotesModalOpen(true);
  };

  const handleAskQuestion = () => {
    setIsQuestionModalOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "reading": return <FileText className="h-4 w-4" />;
      case "quiz": return <Users2 className="h-4 w-4" />;
      case "document": return <Download className="h-4 w-4" />;
      case "interactive": return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getModuleType = (module: any) => {
    const title = module.title.toLowerCase();
    if (title.includes('sba 7(a)')) return 'sba-7a';
    if (title.includes('sba express')) return 'sba-express';
    if (title.includes('sba 504')) return 'sba-504';
    if (title.includes('invoice factoring')) return 'invoice-factoring';
    if (title.includes('equipment financing')) return 'equipment-financing';
    if (title.includes('commercial real estate')) return 'commercial-real-estate';
    if (title.includes('asset-based lending')) return 'asset-based-lending';
    if (title.includes('construction loan')) return 'construction-loans';
    if (title.includes('franchise financing')) return 'franchise-financing';
    if (title.includes('working capital')) return 'working-capital';
    if (title.includes('healthcare financing')) return 'healthcare-financing';
    if (title.includes('restaurant financing')) return 'restaurant-financing';
    if (title.includes('merchant cash')) return 'merchant-cash-advances';
    if (title.includes('lines of credit')) return 'lines-of-credit';
    return 'general';
  };

  const getModuleSpecificContent = (module: any) => {
    const moduleType = getModuleType(module);
    const isExpert = module.title.toLowerCase().includes('expert');
    const content: Record<string, any> = {
      'sba-7a': { title: 'SBA 7(a) Loan Program', description: 'Master the most popular SBA loan program with up to $5 million in financing for small businesses.', focus: isExpert ? 'Advanced underwriting, portfolio management, and complex deal structuring' : 'Program basics, eligibility requirements, and application processes' },
      'sba-express': { title: 'SBA Express Loans', description: 'Fast-track SBA financing with streamlined approval processes and reduced documentation.', focus: isExpert ? 'Portfolio optimization and risk management strategies' : 'Quick approval processes and basic eligibility criteria' },
      'sba-504': { title: 'SBA 504 Commercial Real Estate', description: 'Long-term, fixed-rate financing for commercial real estate and equipment purchases.', focus: isExpert ? 'Complex project management and portfolio strategies' : 'Program structure and basic property evaluation' },
      'invoice-factoring': { title: 'Invoice Factoring & Accounts Receivable Financing', description: 'Convert outstanding invoices into immediate working capital through factoring arrangements.', focus: isExpert ? 'Advanced portfolio management and innovative factoring structures' : 'Basic factoring concepts and client evaluation' },
      'equipment-financing': { title: 'Equipment Financing Solutions', description: 'Specialized financing for business equipment, machinery, and technology purchases.', focus: isExpert ? 'Complex equipment portfolios and innovative financing structures' : 'Basic equipment valuation and financing options' },
      'commercial-real-estate': { title: 'Commercial Real Estate Financing', description: 'Comprehensive financing solutions for commercial property acquisitions and development.', focus: isExpert ? 'Complex deal structuring and portfolio optimization' : 'Property analysis fundamentals and loan basics' },
      'general': { title: 'Commercial Finance Fundamentals', description: 'Essential knowledge and skills for commercial lending professionals.', focus: isExpert ? 'Advanced strategies and portfolio management' : 'Core concepts and foundational principles' }
    };
    const moduleContent = content[moduleType] || content.general;
    return (
      <div className="bg-primary/10 p-4 rounded-lg mb-4">
        <h5 className="font-medium mb-2 text-foreground">{moduleContent.title}</h5>
        <p className="text-sm mb-2 text-foreground">{moduleContent.description}</p>
        <p className="text-xs font-medium text-foreground">Focus: {moduleContent.focus}</p>
      </div>
    );
  };

  const getModuleLearningObjectives = (module: any) => {
    const moduleType = getModuleType(module);
    const isExpert = module.title.toLowerCase().includes('expert');
    const objectives: Record<string, string[]> = {
      'sba-7a': isExpert
        ? ['Master advanced SBA 7(a) underwriting techniques and risk assessment', 'Develop expertise in complex deal structuring and portfolio optimization', 'Implement advanced compliance and regulatory strategies', 'Execute sophisticated client relationship management approaches']
        : ['Understand SBA 7(a) program structure and eligibility requirements', 'Learn application processes and required documentation', 'Master basic underwriting principles and risk assessment', 'Develop client consultation and presentation skills'],
      'invoice-factoring': isExpert
        ? ['Master advanced factoring portfolio management strategies', 'Develop innovative factoring structures and risk mitigation techniques', 'Execute complex client evaluation and due diligence processes', 'Implement advanced collection and account management systems']
        : ['Understand invoice factoring fundamentals and cash flow benefits', 'Learn client eligibility assessment and account evaluation', 'Master basic factoring calculations and fee structures', 'Develop client onboarding and account setup processes'],
      'equipment-financing': isExpert
        ? ['Master complex equipment portfolio management and optimization', 'Develop advanced equipment valuation and risk assessment techniques', 'Execute innovative financing structures and vendor relationships', 'Implement sophisticated collection and remarketing strategies']
        : ['Understand equipment financing basics and collateral evaluation', 'Learn equipment types, depreciation, and valuation methods', 'Master basic financing structures and payment calculations', 'Develop vendor relationships and client acquisition strategies']
    };
    return objectives[moduleType] || ['Master core concepts and industry best practices', 'Develop practical application skills through case studies', 'Build analytical and decision-making capabilities', 'Enhance client service and relationship management skills'];
  };

  const getModuleKeyTopics = (module: any) => {
    const moduleType = getModuleType(module);
    const topics: Record<string, string[]> = {
      'sba-7a': ['Program Overview & Structure', 'Eligibility Requirements', 'Loan Terms & Conditions', 'Application Process', 'Underwriting Guidelines', 'Documentation Requirements', 'Guaranty Procedures', 'Servicing & Compliance'],
      'invoice-factoring': ['Factoring Fundamentals', 'Account Evaluation', 'Due Diligence Process', 'Rate Structures', 'Advance Rates', 'Collection Procedures', 'Client Onboarding', 'Risk Management'],
      'equipment-financing': ['Equipment Types & Categories', 'Valuation Methods', 'Depreciation Analysis', 'Financing Structures', 'Vendor Programs', 'Documentation Requirements', 'Collection Strategies', 'Remarketing Processes']
    };
    return topics[moduleType] || ['Industry Overview', 'Market Analysis', 'Risk Assessment', 'Documentation', 'Compliance', 'Best Practices'];
  };

  const getModulePrerequisites = (module: any) => {
    const moduleType = getModuleType(module);
    const isExpert = module.title.toLowerCase().includes('expert');
    if (isExpert) {
      const expertPrereqs: Record<string, string> = {
        'sba-7a': 'Completion of SBA 7(a) Beginner course and 1+ years of SBA lending experience.',
        'invoice-factoring': 'Completion of Invoice Factoring Beginner course and basic accounts receivable financing experience.',
        'equipment-financing': 'Completion of Equipment Financing Beginner course and understanding of secured lending principles.'
      };
      return expertPrereqs[moduleType] || 'Completion of beginner-level course and relevant industry experience.';
    }
    return 'Basic understanding of commercial lending principles and business finance fundamentals. No prior specialized experience required.';
  };

  const getModuleProfessionalSkills = (module: any) => {
    const isExpert = module.title.toLowerCase().includes('expert');
    return isExpert
      ? 'Advanced analytical thinking, strategic portfolio management, complex problem-solving, and senior-level client relationship management.'
      : 'Financial analysis fundamentals, client communication, documentation skills, and risk assessment basics.';
  };

  const getModuleBusinessImpact = (module: any) => {
    const moduleType = getModuleType(module);
    const isExpert = module.title.toLowerCase().includes('expert');
    if (isExpert) return 'Portfolio optimization, increased deal closure rates, enhanced risk management, and senior-level business development capabilities.';
    const impacts: Record<string, string> = {
      'sba-7a': 'Access to $5M+ financing opportunities and improved small business lending capabilities.',
      'invoice-factoring': 'Enhanced working capital solutions and improved client cash flow management.',
      'equipment-financing': 'Expanded equipment financing opportunities and stronger vendor partnerships.'
    };
    return impacts[moduleType] || 'Enhanced lending capabilities and improved client service delivery.';
  };

  // Calculate progress and estimated time
  const currentProgress = moduleProgress[moduleId!]?.progress_percentage || 0;
  const completedLessonsCount = lessons.filter(l => l.completed).length;
  const totalDurationMinutes = lessons.reduce((acc, l) => {
    const mins = parseInt(l.duration) || 15;
    return acc + mins;
  }, 0);
  const remainingMinutes = Math.round(totalDurationMinutes * (1 - currentProgress / 100));
  const estimatedTimeRemaining = remainingMinutes > 60
    ? `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m`
    : `${remainingMinutes} min`;

  // Group lessons by type for collapsible sections
  const videoLessons = lessons.filter(l => l.type === 'video');
  const readingLessons = lessons.filter(l => l.type === 'reading');
  const quizLessons = lessons.filter(l => l.type === 'quiz');
  const documentLessons = lessons.filter(l => l.type === 'document');
  const interactiveLessons = lessons.filter(l => l.type === 'interactive');

  const lessonGroups = [
    { key: 'video', label: 'Video Lessons', icon: <Video className="h-4 w-4" />, items: videoLessons },
    { key: 'reading', label: 'Reading Material', icon: <FileText className="h-4 w-4" />, items: readingLessons },
    { key: 'quiz', label: 'Assessments', icon: <Users2 className="h-4 w-4" />, items: quizLessons },
    { key: 'document', label: 'Documents & Resources', icon: <Download className="h-4 w-4" />, items: documentLessons },
    { key: 'interactive', label: 'Interactive Activities', icon: <Zap className="h-4 w-4" />, items: interactiveLessons },
  ].filter(g => g.items.length > 0);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    ...(courseName ? [{ label: courseName.split(' - ')[0], href: '/dashboard' }] : []),
    { label: module.title },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="min-w-0 flex-1">
              <Breadcrumbs items={breadcrumbItems} showHome={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Progress Bar */}
      <StickyProgressBar
        progress={currentProgress}
        totalLessons={lessons.length}
        completedLessons={completedLessonsCount}
        moduleTitle={module.title}
        estimatedTimeRemaining={estimatedTimeRemaining}
      />

      {!user && (
        <div className="container mx-auto px-4 mt-4">
          <Alert className="bg-primary/10 border-primary">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <AlertDescription className="font-medium">
                Sign in to access course content and track your progress
              </AlertDescription>
            </div>
            <Button onClick={() => navigate('/auth')} size="sm" className="ml-4">Sign In</Button>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="flex gap-6 lg:gap-8">
          {/* Sticky Sidebar TOC - Desktop only */}
          <LessonSidebarTOC
            lessons={lessons}
            activeId={selectedLesson?.id}
            onSelect={handleLessonStart}
            className="w-64 shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Module Header Card */}
            <Card className="bg-halo-navy">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl text-white">{module.title}</CardTitle>
                    <CardDescription className="mt-2 text-white/80">{module.description}</CardDescription>
                  </div>
                  {module.skill_level && module.skill_level.toLowerCase() !== "beginner" && (
                    <Badge variant={module.skill_level.toLowerCase() === "expert" ? "success" : "outline"}>
                      {module.skill_level.charAt(0).toUpperCase() + module.skill_level.slice(1)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration || '45 minutes'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>{completedLessonsCount} completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Takeaways - "What You'll Learn" */}
            <KeyTakeaways objectives={getModuleLearningObjectives(module)} />

            {/* Tabs */}
            <Tabs defaultValue="lessons" className="space-y-4 sm:space-y-6">
              <div className="overflow-x-auto pb-2">
                <TabsList className="grid w-max min-w-full grid-cols-3 gap-1 bg-muted">
                  <TabsTrigger value="lessons" className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-halo-navy data-[state=active]:text-white">
                    Lessons
                  </TabsTrigger>
                  <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-halo-navy data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="assessment" className="text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-halo-navy data-[state=active]:text-white">
                    Assessment
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Lessons Tab - Collapsible sections */}
              <TabsContent value="lessons" className="space-y-4">
                {lessons.length > 0 ? (
                  <Accordion type="multiple" defaultValue={lessonGroups.map(g => g.key)} className="space-y-3">
                    {lessonGroups.map(group => (
                      <AccordionItem key={group.key} value={group.key} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {group.icon}
                            <span className="font-semibold text-sm">{group.label}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {group.items.filter(l => l.completed).length}/{group.items.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                          <div className="divide-y">
                            {group.items.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className={`p-1.5 rounded ${lesson.completed ? "text-accent" : "text-muted-foreground"}`}>
                                    {lesson.completed ? <CheckCircle className="h-4 w-4" /> : getTypeIcon(lesson.type)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{lesson.duration}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={lesson.completed ? "outline" : "default"}
                                  className="h-9 px-3 text-xs shrink-0 min-w-[72px]"
                                  onClick={() => handleLessonStart(lesson)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  {lesson.completed ? "Review" : "Start"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg font-semibold mt-4 mb-2">No Lessons Available</h3>
                      <p className="text-muted-foreground">Content will be added soon.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Module Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {getModuleSpecificContent(module)}

                    <div>
                      <h4 className="font-semibold mb-3">Key Topics Covered</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getModuleKeyTopics(module).map((topic, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Prerequisites</h4>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="text-sm mb-2">{getModulePrerequisites(module)}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Recommended preparation time: 15 minutes</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Module Outcomes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <h5 className="font-medium text-sm mb-1">Professional Skills</h5>
                          <p className="text-xs text-muted-foreground">{getModuleProfessionalSkills(module)}</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">Business Impact</h5>
                          <p className="text-xs text-muted-foreground">{getModuleBusinessImpact(module)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assessment Tab */}
              <TabsContent value="assessment" className="space-y-6">
                <ModuleQuiz
                  moduleId={module.id}
                  moduleTitle={module.title}
                  courseId={module.course_id}
                  onQuizComplete={passed => {
                    if (passed) {
                      toast({
                        title: "🎉 Module Quiz Passed!",
                        description: "You can now proceed to the next module in your learning path."
                      });
                    }
                  }}
                />
              </TabsContent>
            </Tabs>

            {/* Quick Actions - Mobile friendly */}
            <Card className="lg:hidden">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleTakeNotes}>
                  <Book className="h-4 w-4 mr-2" />
                  Notes
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleAskQuestion}>
                  <Users2 className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden lg:block w-64 shrink-0 space-y-4">
            <div className="sticky top-[120px] space-y-4">
              <Card className="bg-halo-navy">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white">Module Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/80">Duration</span>
                    <span className="text-sm font-medium text-white">{module.duration || '45 minutes'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/80">Lessons</span>
                    <span className="text-sm font-medium text-white">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/80">Est. Time Left</span>
                    <span className="text-sm font-medium text-white">{estimatedTimeRemaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/80">Status</span>
                    <Badge variant="outline" className="text-xs bg-white/90 text-halo-navy">
                      {currentProgress === 100 ? "Completed" : currentProgress > 0 ? "In Progress" : "Available"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-halo-navy">
                <CardHeader>
                  <CardTitle className="text-base text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleTakeNotes}>
                    <Book className="h-4 w-4 mr-2" />
                    My Notes
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleAskQuestion}>
                    <Users2 className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FloatingNotesButton moduleId={moduleId} />
      <NotesModal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} moduleTitle={module.title} />
      <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} moduleTitle={module.title} moduleId={moduleId} />

      {selectedLesson && (
        <LessonModal
          isOpen={isLessonModalOpen}
          onClose={() => { setIsLessonModalOpen(false); setSelectedLesson(null); }}
          lesson={selectedLesson}
          moduleTitle={module.title}
          moduleId={moduleId}
        />
      )}
    </div>
  );
};

export default ModulePage;
