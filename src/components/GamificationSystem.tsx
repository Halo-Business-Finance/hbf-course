import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, Flame, Target, Award, Zap, Crown, Gift, Users, BookOpen, Clock, CheckCircle, Lock } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: unknown;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
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

const iconMap: Record<string, unknown> = {
  BookOpen, Trophy, Flame, Users, Zap, Crown, Star, Target, Award, Gift, Clock, CheckCircle
};

const getIconComponent = (iconName: string) => iconMap[iconName] || Award;

const calculateLevel = (points: number) => {
  const level = Math.floor(points / 100) + 1;
  const currentXP = points % 100;
  const nextLevelXP = 100;
  return { level, currentXP, nextLevelXP };
};

const getRarity = (points: number): 'common' | 'rare' | 'epic' | 'legendary' => {
  if (points >= 500) return 'legendary';
  if (points >= 200) return 'epic';
  if (points >= 50) return 'rare';
  return 'common';
};

const rarityColors: Record<string, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export const GamificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0, level: 1, currentXP: 0, nextLevelXP: 100,
    streak: 0, rank: 0, completedChallenges: 0, unlockedAchievements: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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

    const { data: streak } = await supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak, total_points')
      .eq('user_id', user.id)
      .maybeSingle();

    const { count: badgeCount } = await supabase
      .from('user_badges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { count: certCount } = await supabase
      .from('certificates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const totalPoints = streak?.total_points ?? 0;
    const { level, currentXP, nextLevelXP } = calculateLevel(totalPoints);

    setUserStats({
      totalPoints,
      level,
      currentXP,
      nextLevelXP,
      streak: streak?.current_streak ?? 0,
      rank: 0,
      completedChallenges: certCount ?? 0,
      unlockedAchievements: badgeCount ?? 0
    });
  };

  const loadAchievements = async () => {
    if (!user?.id) return;

    const { data: allBadges } = await supabase
      .from('badges')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: true });

    const { data: earnedBadges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', user.id);

    const earnedMap = new Map((earnedBadges || []).map(b => [b.badge_id, b.earned_at]));

    const mapped: Achievement[] = (allBadges || []).map(badge => ({
      id: badge.id,
      title: badge.name,
      description: badge.description,
      icon: getIconComponent(badge.icon),
      points: badge.points,
      rarity: getRarity(badge.points),
      category: badge.category,
      unlocked: earnedMap.has(badge.id),
      unlockedAt: earnedMap.get(badge.id) || undefined
    }));

    setAchievements(mapped);
  };

  const loadLeaderboard = async () => {
    const { data: streaks } = await supabase
      .from('learning_streaks')
      .select('user_id, current_streak, total_points')
      .order('total_points', { ascending: false })
      .limit(10);

    if (!streaks) return;

    const userIds = streaks.map(s => s.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name')
      .in('user_id', userIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    const entries: LeaderboardEntry[] = streaks.map((s, i) => {
      const profile = profileMap.get(s.user_id);
      const name = profile?.name || 'Learner';
      const { level } = calculateLevel(s.total_points);
      return {
        rank: i + 1,
        userId: s.user_id,
        userName: name,
        points: s.total_points,
        level,
        achievements: 0,
        streak: s.current_streak
      };
    });

    // Find current user's rank
    if (user?.id) {
      const idx = entries.findIndex(e => e.userId === user.id);
      if (idx >= 0) {
        setUserStats(prev => ({ ...prev, rank: idx + 1 }));
      }
    }

    setLeaderboard(entries);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const xpProgress = userStats.nextLevelXP > 0
    ? (userStats.currentXP / userStats.nextLevelXP) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-foreground">{userStats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-foreground">{userStats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">Level {userStats.level}</p>
            <p className="text-xs text-muted-foreground">{userStats.currentXP}/{userStats.nextLevelXP} XP</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold text-foreground">{userStats.unlockedAchievements}</p>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Level {userStats.level} Progress</span>
            <span className="text-sm text-muted-foreground">{userStats.currentXP}/{userStats.nextLevelXP} XP</span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {['overview', 'achievements', 'leaderboard'].map(tab => (
          <Button
            key={tab}
            variant={selectedTab === tab ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-lg text-foreground">Recent Badges</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {achievements.filter(a => a.unlocked).slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <a.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                    <Badge className={`ml-auto text-xs ${rarityColors[a.rarity]}`}>{a.rarity}</Badge>
                  </div>
                ))}
                {achievements.filter(a => a.unlocked).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Complete activities to earn badges!</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-lg text-foreground">Top Learners</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 5).map(entry => (
                  <div key={entry.userId} className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-6 text-center ${entry.rank <= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      #{entry.rank}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{entry.points} pts</span>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No leaderboard data yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {achievements.map(a => (
              <Card key={a.id} className={`bg-card border-border ${!a.unlocked ? 'opacity-50' : ''}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${a.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                    {a.unlocked ? <a.icon className="h-6 w-6 text-primary" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <Badge className={`text-xs ${rarityColors[a.rarity]}`}>{a.rarity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.points} pts</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-8">No badges configured yet.</p>
            )}
          </motion.div>
        )}

        {selectedTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-foreground">Leaderboard</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map(entry => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-3 rounded-lg ${entry.userId === user?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {entry.rank === 1 ? <Crown className="h-6 w-6 text-amber-500" /> :
                       entry.rank === 2 ? <Trophy className="h-5 w-5 text-gray-400" /> :
                       entry.rank === 3 ? <Trophy className="h-5 w-5 text-amber-700" /> :
                       <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {entry.userName} {entry.userId === user?.id && '(You)'}
                      </p>
                      <p className="text-xs text-muted-foreground">Level {entry.level} · {entry.streak} day streak</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{entry.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No leaderboard data available yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
