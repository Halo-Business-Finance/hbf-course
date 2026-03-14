import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Clock, Target, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  level: string;
  matchScore: number;
  reason: string;
  estimatedTime: string;
}

// Maps onboarding role → relevant course title keywords for boosting
const roleKeywords: Record<string, string[]> = {
  loan_officer: ['SBA', 'Term Loans', 'Lines of Credit', 'Commercial Real Estate', 'Bridge'],
  credit_analyst: ['Asset-Based', 'Invoice Factoring', 'Working Capital', 'Term Loans', 'Equipment'],
  branch_manager: ['SBA', 'Commercial Real Estate', 'Equipment Financing', 'Franchise'],
  compliance: ['SBA', 'Healthcare', 'Construction', 'Regulatory'],
  new_to_lending: ['SBA 7(a)', 'Term Loans', 'Business Lines of Credit', 'Working Capital'],
};

// Maps onboarding goals → reason text
const goalReasons: Record<string, string> = {
  certification: 'Supports your certification goal',
  promotion: 'Key skill for career advancement',
  skill_refresh: 'Great for refreshing your knowledge',
  career_change: 'Essential for entering commercial lending',
  compliance_req: 'Helps meet compliance requirements',
};

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) generateRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const generateRecommendations = async () => {
    try {
      const [progressResult, coursesResult, enrollmentsResult, profileResult] = await Promise.all([
        supabase
          .from('course_progress')
          .select('course_id, module_id, progress_percentage')
          .eq('user_id', user!.id),
        supabase
          .from('courses')
          .select('*')
          .eq('is_active', true),
        supabase
          .from('course_enrollments')
          .select('course_id')
          .eq('user_id', user!.id)
          .eq('status', 'active'),
        supabase
          .from('profiles')
          .select('professional_role, experience_level, learning_goals')
          .eq('user_id', user!.id)
          .maybeSingle(),
      ]);

      const progress = progressResult.data || [];
      const courses = coursesResult.data || [];
      const enrolledIds = new Set((enrollmentsResult.data || []).map(e => e.course_id));

      // Extract onboarding profile
      const profile = profileResult.data as Record<string, unknown> | null;
      const userRole = (profile?.professional_role as string) || '';
      const userExp = (profile?.experience_level as string) || '';
      const userGoals = (profile?.learning_goals as string[]) || [];

      // Determine preferred level from onboarding experience
      const preferredLevel = userExp === 'advanced' ? 'expert' : 'beginner';

      // Role keywords for relevance scoring
      const keywords = roleKeywords[userRole] || [];

      const recs: CourseRecommendation[] = courses
        .filter(course => !enrolledIds.has(course.id))
        .map(course => {
          let matchScore = 60;
          let reason = 'Popular course in your field';

          // Boost for matching level
          if (course.level?.toLowerCase() === preferredLevel) {
            matchScore += 15;
            reason = `Matches your ${userExp || 'current'} experience level`;
          }

          // Boost for role-relevant keywords
          const titleLower = course.title.toLowerCase();
          const keywordHits = keywords.filter(kw => titleLower.includes(kw.toLowerCase()));
          if (keywordHits.length > 0) {
            matchScore += keywordHits.length * 8;
            reason = `Highly relevant for ${userRole?.replace('_', ' ')} professionals`;
          }

          // Boost for goal alignment
          if (userGoals.length > 0) {
            const goalReason = goalReasons[userGoals[0]];
            if (goalReason && matchScore > 75) {
              reason = goalReason;
            }
            matchScore += userGoals.length * 3;
          }

          // Small variation for natural ordering
          matchScore += Math.floor(Math.random() * 5);

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            matchScore: Math.min(matchScore, 98),
            reason,
            estimatedTime: '4-6 hours',
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4);

      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'expert':
      case 'advanced':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommended For You
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized suggestions based on your role, experience &amp; goals
        </p>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Complete the onboarding survey to get personalized recommendations!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all hover:shadow-md cursor-pointer"
                onClick={() => navigate('/courses')}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={getLevelColor(rec.level)}>
                    {rec.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span className="font-medium text-primary">{rec.matchScore}%</span>
                    <span className="text-muted-foreground">match</span>
                  </div>
                </div>

                <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rec.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Course
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {rec.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
