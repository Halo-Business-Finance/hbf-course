import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Award, ChevronRight, Check, GraduationCap, TrendingUp, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  level: string;
  keyTopics: string[];
  modulesCount: number;
  image?: string;
  isEnrolled?: boolean;
  isAuthenticated?: boolean;
  onEnroll?: (id: string) => void;
  loading?: boolean;
  firstModuleId?: string;
  className?: string;
  index?: number;
}

export function CourseCard({
  id,
  title,
  description,
  level,
  keyTopics,
  modulesCount,
  isEnrolled = false,
  isAuthenticated = false,
  onEnroll,
  loading = false,
  firstModuleId,
  className,
  index = 0,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const courseName = title.split(' - ')[0];
  
  const getLevelConfig = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
      case 'advanced':
        return { 
          label: 'Advanced', 
          icon: Zap,
          description: 'Master complex concepts'
        };
      case 'intermediate':
        return { 
          label: 'Intermediate', 
          icon: TrendingUp,
          description: 'Build on your foundations'
        };
      default:
        return { 
          label: 'Beginner', 
          icon: BookOpen,
          description: 'Perfect for getting started'
        };
    }
  };
  
  const levelConfig = getLevelConfig(level);
  const LevelIcon = levelConfig.icon;
  const displayTopics = keyTopics.slice(0, 4);

  return (
    <Card 
      className={cn(
        "relative border border-border shadow-sm hover:shadow-xl transition-all duration-300 bg-card overflow-hidden group",
        isHovered && "scale-[1.01] border-primary/30",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-navy-900 via-primary to-navy-700" />
      
      <CardHeader className="text-center pb-3 pt-5">
        <div className="flex justify-center mb-3">
          <Badge className="bg-navy-900 text-white border-navy-900 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <LevelIcon className="h-3 w-3 mr-1.5" />
            {levelConfig.label}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-foreground line-clamp-2 leading-snug">{courseName}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </CardDescription>
        <div className="mt-4 flex items-center justify-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{modulesCount} Modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{modulesCount * 2}+ hrs</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">What you'll learn</p>
          <ul className="space-y-2.5">
            {displayTopics.map((topic, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground line-clamp-1">{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5 text-xs text-muted-foreground border-t border-b border-border py-3">
          <Award className="h-4 w-4 text-primary" />
          <span className="font-medium">Certificate of Completion</span>
        </div>

        {isAuthenticated ? (
          isEnrolled ? (
            <Button 
              className="w-full flex items-center gap-2" 
              variant="navy"
              asChild
            >
              <Link to={`/module/${firstModuleId || id}`}>
                <GraduationCap className="h-4 w-4" />
                Continue Learning
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button 
              className="w-full flex items-center gap-2"
              variant="navy"
              onClick={() => onEnroll?.(id)}
              disabled={loading}
            >
              Start Course
              <ChevronRight className="h-4 w-4" />
            </Button>
          )
        ) : (
          <Button 
            className="w-full flex items-center gap-2" 
            variant="outline"
            asChild
          >
            <Link to="/auth">
              <Lock className="h-4 w-4" />
              Sign In to Enroll
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          {levelConfig.description}
        </p>
      </CardContent>
    </Card>
  );
}
