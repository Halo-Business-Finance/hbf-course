import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BookOpen, Home, BarChart3, Award, FileText, User, LogIn, Lock, Trophy,
  Users, ShieldCheck, GraduationCap, Palette, UsersRound, ChevronDown } from
"lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseSelection } from "@/contexts/CourseSelectionContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from
"@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger } from
"@/components/ui/collapsible";

const learningNavItems = [
{ title: "Dashboard", url: "/dashboard", icon: Home },
{ title: "My Course", url: "/my-course", icon: BarChart3 },
{ title: "My Certificates", url: "/my-certificates", icon: Award },
{ title: "Achievements", url: "/achievements", icon: Trophy },
{ title: "Resources", url: "/resources", icon: FileText }];

const adminNavItems = [
{ title: "Admin Dashboard", url: "/admin/dashboard", icon: Home },
{ title: "Team Analytics", url: "/team-analytics", icon: Users },
{ title: "Cohorts", url: "/cohorts", icon: UsersRound },
{ title: "Compliance", url: "/compliance", icon: ShieldCheck },
{ title: "Certifications", url: "/certifications", icon: GraduationCap },
{ title: "Branding", url: "/branding", icon: Palette }];

export function AppSidebar({ onOpenSupport }: {onOpenSupport?: () => void;}) {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { selectedCourse } = useCourseSelection();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const [selectedCourseModules, setSelectedCourseModules] = useState<any[]>([]);
  const [learningOpen, setLearningOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);

  // Keep admin section open if user is on an admin page
  useEffect(() => {
    if (location.pathname.startsWith('/admin') || adminNavItems.some((item) => location.pathname.startsWith(item.url))) {
      setAdminOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user && selectedCourse) {
      fetchSelectedCourseModules();
    } else {
      setSelectedCourseModules([]);
    }
  }, [user, selectedCourse]);

  const fetchSelectedCourseModules = async () => {
    if (!selectedCourse) return;
    try {
      const { data, error } = await supabase.
      from("course_content_modules").
      select("*").
      eq("course_id", selectedCourse.id).
      eq("is_active", true).
      lte("order_index", 6).
      order("order_index");
      if (error) throw error;
      setSelectedCourseModules(data || []);
    } catch (error) {
      logger.error("Error fetching selected course modules", error, { courseId: selectedCourse?.id });
      setSelectedCourseModules([]);
    }
  };

  const handleNavigation = (url: string, canAccess = true) => {
    if (!canAccess) {
      toast({
        title: "Module Locked",
        description: "Complete the previous module to unlock this one!",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    if (isMobile) toggleSidebar();
    navigate(url);
  };

  const isActive = (url: string) => location.pathname === url;

  const navBtnClass = (url: string) =>
  `w-full flex items-center ${collapsed ? "justify-center px-0" : "justify-start px-4 gap-3"} py-2 rounded-lg transition-all duration-200 min-h-[2.75rem] ${
  isActive(url) ?
  "bg-halo-navy text-white font-medium" :
  "text-foreground hover:bg-white/10"}`;

  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-sidebar border-sidebar-border border-r">
      <SidebarContent className="pt-[56px] sm:pt-[70px] bg-black overflow-y-auto">
        {/* Welcome */}
        {user && !collapsed

        }

        {/* ── Learning Section ── */}
        <Collapsible open={learningOpen} onOpenChange={setLearningOpen}>
          <SidebarGroup className={`pt-1 ${collapsed ? "px-1" : ""}`}>
            {!collapsed &&
            <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                    Learning
                  </span>
                  <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                  learningOpen ? "" : "-rotate-90"}`
                  } />
                
                </SidebarGroupLabel>
              </CollapsibleTrigger>
            }
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {learningNavItems.map((item) =>
                  <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button
                        onClick={() => handleNavigation(item.url)}
                        className={navBtnClass(item.url)}
                        aria-label={item.title}
                        aria-current={isActive(item.url) ? "page" : undefined}>
                        
                          <item.icon className="h-5 w-5 flex-shrink-0 text-orange-500" />
                          {!collapsed && <span className="text-xs font-medium text-white">{item.title}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* ── Course Modules ── */}
        {user &&
        <>
            <div className="px-4 py-1.5">
              <Separator className="bg-border/50" />
            </div>

            <Collapsible open={modulesOpen} onOpenChange={setModulesOpen}>
              <SidebarGroup className="pt-0">
                {!collapsed &&
              <CollapsibleTrigger className="w-full">
                    <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors pb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide truncate text-white">
                        {selectedCourse?.title || "Course Modules"}
                      </span>
                      <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                    modulesOpen ? "" : "-rotate-90"}`
                    } />
                  
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
              }
                <CollapsibleContent>
                  <SidebarGroupContent>
                    {selectedCourseModules.length > 0 ?
                  <SidebarMenu className="space-y-0.5">
                        {selectedCourseModules.map((module: any, index: number) => {
                      const isModuleLocked = module.is_locked;
                      const canAccess = !isModuleLocked || isAdmin;
                      const moduleUrl = `/module/${module.id}`;

                      return (
                        <SidebarMenuItem key={module.id}>
                              <SidebarMenuButton asChild>
                                 <button
                              onClick={() => handleNavigation(moduleUrl, canAccess)}
                              className={`w-full flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg transition-all duration-200 ${
                              isModuleLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"} ${
                              isActive(moduleUrl) ? "bg-muted font-medium" : ""}`}>
                              
                                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold text-primary-foreground bg-halo-navy flex-shrink-0">
                                    {isModuleLocked ?
                                <Lock size={12} /> :

                                <span>{index + 1}</span>
                                }
                                  </div>
                                  {!collapsed &&
                              <span className="text-xs font-medium text-foreground truncate">
                                      {module.title}
                                    </span>
                              }
                                </button>
                              </SidebarMenuButton>
                            </SidebarMenuItem>);

                    })}
                      </SidebarMenu> :

                  !collapsed &&
                  <div className="px-4 py-4 text-center">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                          <p className="text-xs text-white">
                            {selectedCourse ?
                      "No modules available" :
                      "Select a course from the dashboard"}
                          </p>
                        </div>

                  }
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </>
        }

        {/* ── Admin Tools ── */}
        {user && isAdmin &&
        <>
            <div className="px-4 py-1.5 text-white">
              <Separator className="bg-border/50" />
            </div>

            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <SidebarGroup className="pt-0">
                {!collapsed &&
              <div className="flex items-center justify-between px-2 py-1">
                    <button
                      onClick={() => handleNavigation("/admin/dashboard")}
                      className="flex-1 text-left">
                      <SidebarGroupLabel className="cursor-pointer hover:text-foreground transition-colors pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white">
                          Admin Tools
                        </span>
                      </SidebarGroupLabel>
                    </button>
                    <CollapsibleTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded" aria-label="Toggle admin tools">
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                          adminOpen ? "" : "-rotate-90"}`} />
                      </button>
                    </CollapsibleTrigger>
                  </div>
              }
                {collapsed &&
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleNavigation("/admin/dashboard")}
                      className={`w-full flex items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 min-h-[2.75rem] ${
                        location.pathname.startsWith('/admin') ? "bg-halo-navy text-white font-medium" : "text-foreground hover:bg-muted"}`}
                      aria-label="Admin Dashboard">
                      <ShieldCheck className="h-5 w-5 flex-shrink-0 text-orange-500" />
                    </button>
                  </SidebarMenuButton>
                }
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-0.5">
                      {adminNavItems.map((item) =>
                    <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <button
                          onClick={() => handleNavigation(item.url)}
                          className={navBtnClass(item.url)}
                          aria-label={item.title}
                          aria-current={isActive(item.url) ? "page" : undefined}>
                          
                              <item.icon className="h-5 w-5 flex-shrink-0 text-orange-500" />
                              {!collapsed &&
                          <span className="text-xs font-medium text-white">{item.title}</span>
                          }
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </>
        }

        {/* Sign In — unauthenticated */}
        {!user && !loading &&
        <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                    onClick={() => {
                      if (isMobile) toggleSidebar();
                      navigate("/auth");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-all">
                    
                      <LogIn className="h-5 w-5" />
                      {!collapsed && <span className="text-xs font-medium">Sign In</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        }
      </SidebarContent>
    </Sidebar>);

}