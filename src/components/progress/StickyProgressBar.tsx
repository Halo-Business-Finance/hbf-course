import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, BookOpen } from "lucide-react";

interface StickyProgressBarProps {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  moduleTitle: string;
  estimatedTimeRemaining?: string;
}

export function StickyProgressBar({
  progress,
  totalLessons,
  completedLessons,
  moduleTitle,
  estimatedTimeRemaining,
}: StickyProgressBarProps) {
  const isComplete = progress >= 100;

  return (
    <div className="sticky top-[65px] z-30 bg-card/95 backdrop-blur-sm border-b py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-foreground truncate mr-2">{moduleTitle}</span>
            <span className={`font-semibold shrink-0 ${isComplete ? 'text-accent' : 'text-primary'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            {isComplete ? (
              <CheckCircle className="h-3.5 w-3.5 text-accent" />
            ) : (
              <BookOpen className="h-3.5 w-3.5" />
            )}
            <span>{completedLessons}/{totalLessons} lessons</span>
          </div>
          {estimatedTimeRemaining && !isComplete && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{estimatedTimeRemaining} left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
