import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Clock, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DayData { day: string; minutes: number; modules: number }
interface SkillData { skill: string; progress: number; color: string }

interface LearningAnalyticsChartsProps {
  className?: string;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

export function LearningAnalyticsCharts({ className }: LearningAnalyticsChartsProps) {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchAnalyticsData();
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch daily learning activity
      const daysBack = timeRange === "week" ? 7 : 30;
      const since = new Date(Date.now() - daysBack * 86400000).toISOString().split("T")[0];

      const { data: activity } = await supabase
        .from("daily_learning_activity")
        .select("activity_date, time_spent_minutes, modules_completed")
        .eq("user_id", user.id)
        .gte("activity_date", since)
        .order("activity_date");

      if (activity && activity.length > 0) {
        if (timeRange === "week") {
          // Map to day-of-week labels
          const mapped: DayData[] = activity.map((a) => ({
            day: DAY_LABELS[new Date(a.activity_date + "T00:00:00").getDay()],
            minutes: a.time_spent_minutes || 0,
            modules: a.modules_completed || 0,
          }));
          setWeeklyData(mapped);
        } else {
          // Group by week for month view
          const mapped: DayData[] = activity.map((a) => ({
            day: new Date(a.activity_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            minutes: a.time_spent_minutes || 0,
            modules: a.modules_completed || 0,
          }));
          setWeeklyData(mapped);
        }
      } else {
        // Fallback: generate from course_progress
        const { data: progress } = await supabase
          .from("course_progress")
          .select("updated_at, progress_percentage, quiz_score")
          .eq("user_id", user.id)
          .gte("updated_at", new Date(Date.now() - daysBack * 86400000).toISOString())
          .order("updated_at");

        const dayMap = new Map<string, { minutes: number; modules: number }>();
        (progress || []).forEach((p) => {
          const date = new Date(p.updated_at);
          const key = timeRange === "week"
            ? DAY_LABELS[date.getDay()]
            : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const existing = dayMap.get(key) || { minutes: 0, modules: 0 };
          existing.minutes += 15; // estimate 15 min per activity
          existing.modules += p.progress_percentage === 100 ? 1 : 0;
          dayMap.set(key, existing);
        });

        if (dayMap.size > 0) {
          setWeeklyData(Array.from(dayMap.entries()).map(([day, d]) => ({ day, ...d })));
        } else {
          // Default placeholder
          setWeeklyData(
            DAY_LABELS.slice(1).concat(DAY_LABELS[0]).map((d) => ({ day: d, minutes: 0, modules: 0 }))
          );
        }
      }

      // Fetch skill progress from course_progress grouped by course
      const { data: courseProgress } = await supabase
        .from("course_progress")
        .select("course_id, progress_percentage")
        .eq("user_id", user.id);

      if (courseProgress && courseProgress.length > 0) {
        const courseMap = new Map<string, number[]>();
        courseProgress.forEach((cp) => {
          const arr = courseMap.get(cp.course_id) || [];
          arr.push(cp.progress_percentage || 0);
          courseMap.set(cp.course_id, arr);
        });

        // Fetch course titles
        const courseIds = Array.from(courseMap.keys());
        const { data: courses } = await supabase
          .from("courses")
          .select("id, title")
          .in("id", courseIds);

        const colors = [
          "hsl(var(--primary))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--halo-orange))",
        ];

        const skills: SkillData[] = (courses || []).slice(0, 5).map((c, i) => {
          const progressArr = courseMap.get(c.id) || [];
          const avg = progressArr.length > 0 ? Math.round(progressArr.reduce((a, b) => a + b, 0) / progressArr.length) : 0;
          const title = c.title.replace(/ - (Beginner|Expert)$/i, "").trim();
          return {
            skill: title.length > 16 ? title.slice(0, 16) + "…" : title,
            progress: avg,
            color: colors[i % colors.length],
          };
        });
        setSkillProgress(skills);
      } else {
        setSkillProgress([
          { skill: "No data yet", progress: 0, color: "hsl(var(--muted))" },
        ]);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const totalModules = weeklyData.reduce((sum, d) => sum + d.modules, 0);
  const avgMinutesPerDay = weeklyData.length > 0 ? Math.round(totalMinutes / weeklyData.length) : 0;
  const activeDays = weeklyData.filter((d) => d.minutes > 0).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Time", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, icon: Clock, trend: activeDays > 0 ? `${activeDays} active days` : "" },
          { label: "Modules Done", value: totalModules.toString(), icon: BookOpen, trend: "" },
          { label: "Daily Average", value: `${avgMinutesPerDay}m`, icon: Target, trend: "" },
          { label: "Active Days", value: `${activeDays}`, icon: TrendingUp, trend: "" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                {stat.trend && <span className="text-xs text-accent-foreground font-medium">{stat.trend}</span>}
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Spent Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Learning Activity</CardTitle>
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "week" | "month")}>
              <TabsList className="h-8">
                <TabsTrigger value="week" className="text-xs px-3">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMinutes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skill Progress */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillProgress} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="skill"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={100}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => [`${value}%`, "Progress"]}
                />
                <Bar
                  dataKey="progress"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
