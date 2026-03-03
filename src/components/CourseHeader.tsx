import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Award, ArrowRight } from "lucide-react";

interface CourseHeaderProps {
  progress: number;
  totalModules: number;
  completedModules: number;
  onContinueLearning: () => void;
}

const CourseHeader = ({
  progress,
  totalModules,
  completedModules,
  onContinueLearning
}: CourseHeaderProps) => {
  return (
    <div className="w-full bg-background border-b border-border">
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 max-w-7xl mx-auto">
        {/* Program Badge */}
        <div className="inline-flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-halo-orange animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Training Program
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3">
          Business Finance Mastery
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
          Master the fundamentals of business finance with our comprehensive 
          training program designed for finance professionals.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">{totalModules} Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">4-6 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">Certificate</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-lg mb-6">
          <div className="flex justify-between text-foreground mb-2">
            <span className="text-xs sm:text-sm font-semibold">Course Progress</span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {completedModules}/{totalModules} modules
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-halo-orange rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {progress}% complete
          </p>
        </div>

        {/* CTA */}
        <Button 
          onClick={onContinueLearning} 
          size="lg"
          className="h-11 px-6 bg-halo-orange hover:bg-halo-orange/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default CourseHeader;
