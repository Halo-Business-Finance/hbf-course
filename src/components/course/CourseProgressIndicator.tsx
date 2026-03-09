import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CourseProgressIndicatorProps {
  courseId: string;
  totalModules: number;
}

export const CourseProgressIndicator = ({ courseId, totalModules }: CourseProgressIndicatorProps) => {
  const { user } = useAuth();
  const [completedModules, setCompletedModules] = useState(0);

  useEffect(() => {
    if (!user || !courseId) return;
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('course_progress')
        .select('module_id, progress_percentage')
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      if (data) {
        const completed = data.filter(p => (p.progress_percentage ?? 0) >= 100).length;
        setCompletedModules(completed);
      }
    };
    fetchProgress();
  }, [user, courseId]);

  if (!user || totalModules === 0) return null;

  const percentage = Math.round((completedModules / totalModules) * 100);
  if (percentage === 0) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-11 h-11">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={radius} fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
          {percentage}%
        </span>
      </div>
      <div className="text-xs text-muted-foreground leading-tight">
        <div className="font-medium text-foreground">{completedModules}/{totalModules}</div>
        <div>modules</div>
      </div>
    </div>
  );
};
