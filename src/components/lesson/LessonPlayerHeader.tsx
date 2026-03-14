import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface LessonPlayerHeaderProps {
  lessonTitle: string;
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
  SectionIcon: LucideIcon;
  estimatedDuration: number;
  difficultyLevel: number;
  progress: number;
}

export const LessonPlayerHeader = ({
  lessonTitle,
  currentSection,
  totalSections,
  sectionTitle,
  SectionIcon,
  estimatedDuration,
  difficultyLevel,
  progress,
}: LessonPlayerHeaderProps) => {
  return (
    <Card className="border-2 border-border bg-card shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-navy-900 rounded-xl">
              <SectionIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-navy-900">{lessonTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Section {currentSection + 1} of {totalSections} — <span className="font-medium text-foreground">{sectionTitle}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" />
              {estimatedDuration} min
            </Badge>
            <Badge variant="outline">Level {difficultyLevel}</Badge>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground">Lesson Progress</span>
            <span className="font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>
      </CardHeader>
    </Card>
  );
};
