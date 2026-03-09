import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, Circle, ChevronRight, BookOpen, Zap, Lock, ArrowDown,
  GraduationCap, Target
} from "lucide-react";
import { Link } from "react-router-dom";

interface CoursePathNode {
  id: string;
  title: string;
  level: string;
  modulesCount: number;
  isEnrolled: boolean;
  firstModuleId?: string;
  progress?: number;
  category: string;
}

interface CourseLearningPathMapProps {
  courses: CoursePathNode[];
  isAuthenticated: boolean;
}

export const CourseLearningPathMap = ({ courses, isAuthenticated }: CourseLearningPathMapProps) => {
  // Group courses by their base name (beginner -> expert progression)
  const courseGroups: Record<string, CoursePathNode[]> = {};
  courses.forEach(course => {
    const baseName = course.title.replace(/ - (Beginner|Expert)$/i, '').trim();
    if (!courseGroups[baseName]) courseGroups[baseName] = [];
    courseGroups[baseName].push(course);
  });

  // Sort within groups: beginner first
  Object.values(courseGroups).forEach(group => {
    group.sort((a, b) => {
      if (a.level === 'beginner' && b.level !== 'beginner') return -1;
      if (a.level !== 'beginner' && b.level === 'beginner') return 1;
      return 0;
    });
  });

  // Only show groups with progression (2+ courses)
  const progressionGroups = Object.entries(courseGroups).filter(([, group]) => group.length >= 2);

  if (progressionGroups.length === 0) return null;

  const getStatusIcon = (course: CoursePathNode) => {
    if (!isAuthenticated) return <Lock className="h-5 w-5 text-muted-foreground" />;
    if ((course.progress ?? 0) >= 100) return <CheckCircle className="h-5 w-5 text-success" />;
    if (course.isEnrolled) return <BookOpen className="h-5 w-5 text-primary" />;
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getNodeStyle = (course: CoursePathNode) => {
    if ((course.progress ?? 0) >= 100) return "border-success/50 bg-success/5";
    if (course.isEnrolled) return "border-primary/50 bg-primary/5 shadow-md";
    return "border-border bg-card";
  };

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-navy-900 rounded-xl">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Learning Paths</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Follow recommended progressions from beginner to expert
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {progressionGroups.slice(0, 6).map(([baseName, group]) => (
            <div key={baseName} className="space-y-0">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                {baseName}
              </h4>
              {group.map((course, idx) => (
                <div key={course.id} className="relative">
                  {/* Connector line */}
                  {idx > 0 && (
                    <div className="flex justify-center -mt-1 mb-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className={`relative rounded-lg border-2 p-3 transition-all ${getNodeStyle(course)}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getStatusIcon(course)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{course.title.split(' - ').pop()}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                            {course.level === 'expert' ? 'Expert' : 'Beginner'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {course.modulesCount} modules
                        </div>
                        {course.isEnrolled && (course.progress ?? 0) > 0 && (
                          <Progress value={course.progress} className="h-1.5 mt-2" />
                        )}
                      </div>
                      {isAuthenticated && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" asChild>
                          <Link to={`/module/${course.firstModuleId || course.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
