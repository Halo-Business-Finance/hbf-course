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
          <motion.div 
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-full",
              isActiveToday 
                ? "bg-halo-orange" 
                : "bg-muted"
            )}
            animate={isActiveToday ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame className={cn(
              "h-7 w-7 transition-all duration-300",
              isActiveToday 
                ? "text-primary-foreground" 
                : "text-muted-foreground"
            )} />
            {isActiveToday && (
              <div className="absolute inset-0 rounded-full bg-halo-orange/30 animate-ping" />
            )}
          </motion.div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <motion.span 
                className="text-3xl font-bold text-foreground"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {currentStreak}
              </motion.span>
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
