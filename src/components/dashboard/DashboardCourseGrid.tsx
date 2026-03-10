import { Clock, BookOpen, ArrowLeft, Brain, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EnhancedModuleCard } from "@/components/EnhancedModuleCard";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { DashboardCourseFilter } from "@/components/DashboardCourseFilter";
import { ModuleProgress } from "@/hooks/useCourseProgress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CourseWithModules {
  id: string;
  title: string;
  description: string;
  level: string;
  prerequisite_course_ids?: string[];
  modules: any[];
}

interface DashboardCourseGridProps {
  coursesWithModules: CourseWithModules[];
  flattenedModules: any[];
  filteredCoursesWithModules: CourseWithModules[];
  filteredModules: any[];
  moduleProgress: ModuleProgress;
  currentFilterLevel: number;
  filterNavigationPath: any[];
  selectedCategory: string | null;
  selectedTopic: string | null;
  loading: boolean;
  coursesLoading: boolean;
  completedCourseIds?: string[];
  onCategorySelect: (cat: string | null) => void;
  onTopicSelect: (topic: string | null) => void;
  onStartCourse: (name: string) => void;
  onProceedToModules: (level: string) => void;
  onReturnToDashboard: () => void;
  onBackToLevel1: () => void;
  getCourseDetails: (name: string) => { description: string; duration: string; difficulty: string; topics: string[]; outcome: string };
  getCourseImage: (title: string) => string;
  isModuleUnlocked: (index: number, modules: any[]) => boolean;
}

export function DashboardCourseGrid({
  flattenedModules,
  filteredCoursesWithModules,
  filteredModules,
  moduleProgress,
  currentFilterLevel,
  filterNavigationPath,
  selectedCategory,
  selectedTopic,
  loading,
  coursesLoading,
  completedCourseIds = [],
  onCategorySelect,
  onTopicSelect,
  onStartCourse,
  onProceedToModules,
  onReturnToDashboard,
  onBackToLevel1,
  getCourseDetails,
  getCourseImage,
  isModuleUnlocked,
}: DashboardCourseGridProps) {

  // Check if a course's prerequisites are all completed
  const arePrerequisitesMet = (course: CourseWithModules): boolean => {
    const prereqs = course.prerequisite_course_ids || [];
    if (prereqs.length === 0) return true;
    return prereqs.every(id => completedCourseIds.includes(id));
  };

  // Get prerequisite course names for display
  const getPrerequisiteNames = (course: CourseWithModules): string[] => {
    const prereqs = course.prerequisite_course_ids || [];
    return prereqs.map(id => {
      const prereqCourse = filteredCoursesWithModules.find(c => c.id === id) ||
        ({ title: id } as CourseWithModules);
      return prereqCourse.title.split(' - ')[0];
    });
  };

  // Level 0: Course catalog
  if (currentFilterLevel === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Course Catalog</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredCoursesWithModules.length} programs available
            </p>
          </div>
        </div>

        <DashboardCourseFilter
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          selectedTopic={selectedTopic}
          onTopicSelect={onTopicSelect}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-xl h-80 border border-border" />
              </div>
            ))}
          </div>
        ) : filteredCoursesWithModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCoursesWithModules
              .filter((course, index, self) =>
                index === self.findIndex((c) => c.title.split(' - ')[0] === course.title.split(' - ')[0])
              )
              .map((course) => {
                const courseName = course.title.split(' - ')[0];
                const details = getCourseDetails(courseName);
                const prerequisitesMet = arePrerequisitesMet(course);
                const prereqNames = getPrerequisiteNames(course);
                const isLocked = !prerequisitesMet;

                return (
                  <div
                    key={courseName}
                    className={`group bg-card rounded-xl border transition-all duration-300 overflow-hidden ${
                      isLocked 
                        ? 'border-border/50 opacity-75' 
                        : 'border-border hover:border-primary/30 hover:shadow-lg'
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={getCourseImage(course.title)}
                        alt={courseName}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isLocked ? 'grayscale-[30%]' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full uppercase tracking-wide">
                          {details.difficulty}
                        </span>
                      </div>
                      {isLocked && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/90 backdrop-blur-sm text-muted-foreground text-xs font-semibold rounded-full">
                            <Lock className="h-3 w-3" />
                            Locked
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
                        {courseName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {details.description}
                      </p>

                      {isLocked && prereqNames.length > 0 && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Prerequisite:</span>{' '}
                            Complete {prereqNames.join(', ')} first
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{details.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Self-Paced</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {details.topics.slice(0, 2).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-md font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isLocked) return;
                          onStartCourse(courseName);
                        }}
                        disabled={isLocked}
                        className={`w-full mt-2 h-11 font-semibold rounded-lg ${
                          isLocked 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : 'bg-halo-navy hover:bg-halo-navy/90 text-white'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Complete Prerequisites
                          </>
                        ) : (
                          'Explore Course'
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No courses match your filter.</p>
          </div>
        )}
      </div>
    );
  }

  // Level 1: Skill level selection
  if (currentFilterLevel === 1 && filterNavigationPath.length > 0) {
    const selectedCourse = filterNavigationPath[0];

    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: selectedCourse.name },
          ]}
        />

        <Button
          variant="outline"
          onClick={onReturnToDashboard}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Courses
        </Button>

        <h2 className="text-xl font-bold text-foreground">Select Your Skill Level</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {['beginner', 'expert'].map((level) => {
            const levelModules = flattenedModules.filter(
              (m) =>
                m.course_title.toLowerCase().includes(selectedCourse.name.toLowerCase()) &&
                m.skill_level === level
            );

            return (
              <Card
                key={level}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/30"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={getCourseImage(selectedCourse.name)}
                    alt={`${selectedCourse.name} - ${level}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs font-semibold tracking-wider border-l-4 pl-2 backdrop-blur-sm ${
                        level === 'beginner'
                          ? 'text-accent border-accent'
                          : 'text-destructive border-destructive'
                      }`}
                    >
                      {level.toUpperCase()} LEVEL
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-4 space-y-3">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {selectedCourse.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {level === 'beginner'
                      ? 'Introduction and fundamental concepts for new learners'
                      : 'Advanced mastery and expert-level techniques'}
                  </CardDescription>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">{levelModules.length} modules</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{levelModules.length * 30} min</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-6">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onProceedToModules(level);
                    }}
                    className="w-full h-11 bg-halo-navy hover:bg-halo-navy/90 text-white font-semibold"
                  >
                    Proceed to Modules
                    <Brain className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Level 2: Module cards
  if (currentFilterLevel === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToDashboard}
            className="hover:bg-primary hover:text-primary-foreground transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">All Courses</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button variant="outline" size="sm" onClick={onBackToLevel1} className="text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">
            {filterNavigationPath[0]?.name}
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold text-xs sm:text-sm">{filterNavigationPath[1]?.name}</span>
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {filteredModules.length} {filteredModules.length === 1 ? 'Module' : 'Modules'} Available
        </h2>

        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredModules.map((module, index) => {
              const currentProgress = moduleProgress[module.id];
              const progressPercentage = currentProgress?.progress_percentage || 0;
              return (
                <EnhancedModuleCard
                  key={module.id}
                  module={{
                    ...module,
                    module_id: module.id,
                    lessons_count: module.lessons_count,
                    order_index: index,
                    progress: progressPercentage,
                    is_completed: currentProgress?.completed || false,
                    is_locked: !isModuleUnlocked(index, filteredModules),
                    prerequisites: index > 0 ? [filteredModules[index - 1].title] : [],
                    skill_level: (module.skill_level === 'none' ? 'beginner' : module.skill_level) as
                      | 'beginner'
                      | 'expert',
                  }}
                  userProgress={{
                    completion_percentage: progressPercentage,
                    is_completed: currentProgress?.completed || false,
                    time_spent_minutes: Math.floor((progressPercentage * 30) / 100),
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No modules found. Try a different selection.</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
