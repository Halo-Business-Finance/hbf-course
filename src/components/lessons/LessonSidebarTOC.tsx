import { CheckCircle, Play, FileText, Users2, Download, Zap, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
}

interface LessonSidebarTOCProps {
  lessons: Lesson[];
  activeId?: string;
  onSelect: (lesson: Lesson) => void;
  className?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  video: Play,
  reading: FileText,
  quiz: Users2,
  document: Download,
  interactive: Zap,
};

export function LessonSidebarTOC({ lessons, activeId, onSelect, className }: LessonSidebarTOCProps) {
  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className={cn("hidden lg:block sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto", className)}>
      <div className="border rounded-lg p-4 bg-card">
        <h4 className="font-semibold text-sm text-foreground mb-1">Contents</h4>
        <p className="text-xs text-muted-foreground mb-4">
          {completedCount}/{lessons.length} completed
        </p>
        <nav className="space-y-1">
          {lessons.map((lesson, i) => {
            const Icon = typeIcons[lesson.type] || BookOpen;
            const isActive = lesson.id === activeId;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelect(lesson)}
                className={cn(
                  "w-full flex items-start gap-2.5 text-left px-3 py-2.5 rounded-md text-sm transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{lesson.title}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
