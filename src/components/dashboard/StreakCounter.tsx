import { Flame, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  className?: string;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  lastActiveDate,
  className,
}: StreakCounterProps) {
  const isActiveToday = lastActiveDate === new Date().toISOString().split('T')[0];
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-5 border border-border",
      className
    )}>
      {/* Animated background effect */}
      {/* Removed background gradient */}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full",
            isActiveToday 
              ? "bg-halo-orange" 
              : "bg-muted"
          )}>
            <Flame className={cn(
              "h-7 w-7 transition-all duration-300",
              isActiveToday 
                ? "text-primary-foreground animate-bounce" 
                : "text-muted-foreground"
            )} />
            {isActiveToday && (
              <div className="absolute inset-0 rounded-full bg-halo-orange/50 animate-ping" />
            )}
          </div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isActiveToday ? "Keep going! 🔥" : "Learn today to maintain streak!"}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Best: {longestStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
