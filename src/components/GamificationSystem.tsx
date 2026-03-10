import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  Flame, 
  Target,
  Award,
  Zap,
  Crown,
  Gift,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  deadline?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  completed: boolean;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  points: number;
  level: number;
  achievements: number;
  streak: number;
}

interface UserStats {
  totalPoints: number;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
  rank: number;
  completedChallenges: number;
  unlockedAchievements: number;
}

const iconMap: Record<string, any> = {
  BookOpen, Trophy, Flame, Users, Zap, Crown, Star, Target, Award, Gift, Clock, CheckCircle
};

const getIconComponent = (iconName: string) => iconMap[iconName] || Award;

export const GamificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    currentXP: 0,
    nextLevelXP: 100,
    streak: 0,
    rank: 0,
    completedChallenges: 0,
    unlockedAchievements: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user?.id]);

  const loadGamificationData = async () => {
    try {
      await Promise.all([
        loadUserStats(),
        loadAchievements(),
        loadChallenges(),
        loadLeaderboard()
      ]);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user?.id) return;

    // Fetch real streak & points from learning_streaks
    const { data: streak } = await supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak, total_points')
      .eq('user_id', user.id)
      .maybeSingle();

    // Fetch earned badges count
    const { count: badgeCount } = await supabase
      .from('user_badges')
      .select('id', { count: 'exact', head:
