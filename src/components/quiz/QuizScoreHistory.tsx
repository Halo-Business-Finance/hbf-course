import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Clock, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface AttemptRecord {
  id: string;
  score: number;
  is_passed: boolean;
  completed_at: string;
  time_taken_minutes: number | null;
  attempt_number: number;
}

interface QuizScoreHistoryProps {
  assessmentId?: string;
  moduleId: string;
  onRetake?: () => void;
  canRetake?: boolean;
}

export const QuizScoreHistory = ({ assessmentId, moduleId, onRetake, canRetake = true }: QuizScoreHistoryProps) => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      let query = supabase
        .from('assessment_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (assessmentId) {
        query = query.eq('assessment_id', assessmentId);
      }

      const { data } = await query.limit(10);
      setAttempts((data as AttemptRecord[]) || []);
      setLoading(false);
    };
    fetchHistory();
  }, [user, assessmentId]);

  if (loading || attempts.length === 0) return null;

  const bestScore = Math.max(...attempts.map(a => a.score));
  const latestAttempt = attempts[0];
  const trend = attempts.length >= 2 ? attempts[0].score - attempts[1].score : 0;
  const displayAttempts = expanded ? attempts : attempts.slice(0, 3);

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Score History
          </CardTitle>
          <div className="flex items-center gap-2">
            {trend !== 0 && (
              <Badge variant={trend > 0 ? "success" : "destructive"} className="text-xs">
                <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {trend > 0 ? '+' : ''}{trend.toFixed(0)}%
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Best: {bestScore.toFixed(0)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayAttempts.map((attempt, idx) => (
          <div
            key={attempt.id}
            className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${
              idx === 0 ? 'bg-muted/60 border border-border' : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-6">#{attempt.attempt_number}</span>
              <div>
                <span className={`font-semibold ${attempt.is_passed ? 'text-success' : 'text-destructive'}`}>
                  {attempt.score.toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {attempt.is_passed ? 'Passed' : 'Failed'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {attempt.time_taken_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {attempt.time_taken_minutes}m
                </span>
              )}
              <span>{format(new Date(attempt.completed_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          {attempts.length > 3 && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
              {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              {expanded ? 'Show less' : `Show all ${attempts.length} attempts`}
            </Button>
          )}
          {canRetake && onRetake && !latestAttempt.is_passed && (
            <Button variant="outline" size="sm" onClick={onRetake} className="text-xs ml-auto">
              <RotateCcw className="h-3 w-3 mr-1" />
              Retake
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
