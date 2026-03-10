import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, NavLink, Navigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, HelpCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import finpilotLogo from "@/assets/finpilot-logo.png";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CourseSelectionProvider } from "@/contexts/CourseSelectionContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { lazy, Suspense } from "react";
import { errorMonitor } from "./utils/errorMonitoring";
import { HorizontalNav } from "./components/HorizontalNav";
import { MobileNav } from "./components/MobileNav";
import { ScrollToTop } from "./components/ScrollToTop";
import { SkipLinks } from "./components/accessibility/SkipLinks";
import { useKeyboardShortcuts } from "./components/accessibility/KeyboardShortcuts";
import { PageTransition } from "./components/PageTransition";

// Lazy load heavy components not needed on initial page load
const NotificationBell = lazy(() => import("@/components/NotificationBell").then((m) => ({ default: m.NotificationBell })));
const LiveChatSupport = lazy(() => import("@/components/LiveChatSupport").then((m) => ({ default: m.LiveChatSupport })));
const ToolModal = lazy(() => import("@/components/tools/ToolModal").then((m) => ({ default: m.ToolModal })));

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Progress = lazy(() => import("./pages/Progress"));
const VideoLibrary = lazy(() => import("./pages/VideoLibrary"));
const Resources = lazy(() => import("./pages/Resources"));
const Account = lazy(() => import("./pages/Account"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Courses = lazy(() => import("./pages/Courses"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Business = lazy(() => import("./pages/Business"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Article = lazy(() => import("./pages/Article"));
const Support = lazy(() => import("./pages/Support"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const DataSecurity = lazy(() => import("./pages/DataSecurity"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Certificate = lazy(() => import("./pages/Certificate"));
const TeamAnalytics = lazy(() => import("./pages/TeamAnalytics"));
const Cohorts = lazy(() => import("./pages/Cohorts"));
const ComplianceTracking = lazy(() => import("./pages/ComplianceTracking"));
const Certifications = lazy(() => import("./pages/Certifications"));
const MyCertificates = lazy(() => import("./pages/MyCertificates"));
const Branding = lazy(() => import("./pages/Branding"));

// Loading fallback component for lazy-loaded pages
const PageLoader = () =>
<div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>;

const queryClient = new QueryClient();
const HeaderContent = ({
  isChatOpen,
  setIsChatOpen



}: {isChatOpen: boolean;setIsChatOpen: (open: boolean) => void;}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user
  } = useAuth();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const goBack = () => {
    navigate(-1);
  };
  const goForward = () => {
    navigate(1);
  };

  // Show header for both logged in and logged out users

  // Extract first name from email or user metadata
  const getFirstName = () => {
    if (!user) return 'User';
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <header className="sticky top-0 h-[56px] sm:h-[70px] flex flex-col border-b border-white/10 bg-black z-50 px-2 sm:px-4">
      <div className="flex-1 flex items-center justify-between gap-1 sm:gap-2 md:gap-4 min-h-0 bg-black">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0 rounded-2xl border-white border-0">
          {user && <SidebarTrigger variant="ghost" size="icon" className="ml-1 sm:ml-2 h-9 w-9 sm:h-10 sm:w-10 p-0 text-white hover:bg-white/10 hover:text-white" />}
          
          {user && <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" onClick={goBack} title="Go back" className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white">
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goForward} className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white" title="Go forward">
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>}
        </div>

        {user && <div className="flex-1 flex items-center justify-center min-w-0 text-white">
            <NavLink to="/" className="flex items-center gap-3 sm:gap-4 flex-shrink-0 min-w-0">
              <img src={finpilotLogo} alt="FinPilot" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover flex-shrink-0" />
              <span className="text-lg sm:text-2xl md:text-3xl font-bold truncate text-white">FinPilot</span>
            </NavLink>
          </div>}

        {!user && <div className="flex-1 flex items-center justify-center max-w-4xl mx-auto min-w-0">
            <div className="hidden lg:block w-full">
              <HorizontalNav />
            </div>
            <div className="lg:hidden w-full">
              <MobileNav />
            </div>
          </div>}
        
        {user && <div className="flex items-center gap-1 flex-shrink-0">
            <Button
          variant="ghost"
          size="icon"
          title="Loan Calculator"
          className="h-10 w-10 text-foreground hover:bg-muted"
          onClick={() => setCalculatorOpen(true)}>
          
              <Calculator className="h-5 w-5 text-white" />
            </Button>
            <Button
          variant="ghost"
          size="icon"
          title="Help & Support"
          className="h-10 w-10 text-foreground hover:bg-muted"
          onClick={() => setIsChatOpen(true)}>
          
              <HelpCircle className="h-5 w-5 text-white" />
            </Button>
            <Suspense fallback={<div className="h-10 w-10" />}>
              <NotificationBell />
            </Suspense>
            <Button
          variant="ghost"
          size="icon"
          title="My Account"
          className="h-10 w-10 text-foreground hover:bg-muted"
          onClick={() => navigate('/my-account')}>
          
              <User className="h-5 w-5 text-white" />
            </Button>
          </div>}
      </div>
      
      <Suspense fallback={null}>
        <ToolModal
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        toolType="loan_calculator"
        toolTitle="Loan Calculator" />
      
      </Suspense>
    </header>;
};
const AppContent = () => {
  const {
    user,
    loading
  } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { ShortcutsDialog } = useKeyboardShortcuts();

  return <div className="min-h-screen flex flex-col w-full">
      {/* Skip Links for Accessibility */}
      <SkipLinks />
      
      {/* Keyboard Shortcuts Dialog */}
      {ShortcutsDialog}
      
      <HeaderContent isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      
      <div className="flex flex-1 min-h-0">
        {user && <AppSidebar onOpenSupport={() => setIsChatOpen(true)} />}
        
        <main id="main-content" className="flex-1 relative z-10 bg-background">
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>} />
            <Route path="/my-course" element={<ProtectedRoute>
                <Progress />
              </ProtectedRoute>} />
            {/* Redirect old progress and certificates routes to my-course page */}
            <Route path="/progress" element={<Navigate to="/my-course" replace />} />
            <Route path="/certificates" element={<Navigate to="/my-course" replace />} />
            <Route path="/videos" element={<VideoLibrary />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/my-account" element={<ProtectedRoute>
                <Account />
              </ProtectedRoute>} />
            {/* Redirect old account route to my-account page */}
            <Route path="/account" element={<Navigate to="/my-account" replace />} />
            <Route path="/auth" element={<ProtectedRoute requireAuth={false}>
                <Auth />
              </ProtectedRoute>} />
            <Route path="/signup" element={<ProtectedRoute requireAuth={false}>
                <SignUp />
              </ProtectedRoute>} />
            <Route path="/admin/login" element={<ProtectedRoute requireAuth={false}>
                <AdminAuth />
              </ProtectedRoute>} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </AdminProtectedRoute>} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/course-catalog" element={<Courses />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/enterprise" element={<Business />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/support" element={<Support />} />
           <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/data-security" element={<DataSecurity />} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/my-certificates" element={<ProtectedRoute><MyCertificates /></ProtectedRoute>} />
          <Route path="/certificate/:certificateId" element={<Certificate />} />
          <Route path="/team-analytics" element={<ProtectedRoute><TeamAnalytics /></ProtectedRoute>} />
          <Route path="/cohorts" element={<ProtectedRoute><Cohorts /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><ComplianceTracking /></ProtectedRoute>} />
          <Route path="/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/branding" element={<ProtectedRoute><Branding /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </PageTransition>
          </Suspense>
        </main>
      </div>

      {/* Live Chat Support */}
      <Suspense fallback={null}>
        <LiveChatSupport isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
      </Suspense>
    </div>;
};
const App = () => <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <NotesProvider>
            <CourseSelectionProvider>
              <SidebarProvider defaultOpen={true} open={undefined}>
                <AppContent />
              </SidebarProvider>
            </CourseSelectionProvider>
          </NotesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
export default App;