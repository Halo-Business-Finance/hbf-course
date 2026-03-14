import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen,
  Clock,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Star,
  Zap,
  RefreshCw
} from "lucide-react";

interface LearningRecommendation {
  id: string;
  type: 'module' | 'review' | 'practice' | 'challenge';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  moduleId?: string;
  topicId?: string;
}

interface PersonalizationProfile {
  learningStyle: string;
  preferredPace: string;
  strongAreas: string[];
  weakAreas: string[];
  interests: string[];
  availableTime: number;
  goals: string[];
  difficultyPreference: string;
}

interface AdaptivePath {
  id: string;
  name: string;
  description: string;
  modules: {
    id: string;
    title: string;
    order: number;
    unlocked: boolean;
    recommended: boolean;
    adaptedContent: {
      videos: boolean;
      readings: boolean;
      interactives: boolean;
      assessments: boolean;
    };
  }[];
  estimatedCompletion: string;
  personalizedFeatures: string[];
}

export const AdaptiveLearningEngine = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [adaptivePaths, setAdaptivePaths] = useState<AdaptivePath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPersonalizationData();
    }
  }, [user?.id]);

  const loadPersonalizationData = async () => {
    try {
      await Promise.all([
        loadUserProfile(),
        generateRecommendations(),
        generateAdaptivePaths()
      ]);
    } catch (error) {
      logger.error('Error loading personalization data', error, { userId: user?.id });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;

    // Fetch user's progress data to build profile
    const [progressRes, statsRes, profileRes] = await Promise.all([
      supabase.from('course_progress').select('course_id, module_id, progress_percentage, quiz_score').eq('user_id', user.id),
      supabase.from('learning_stats').select('total_modules_completed, total_time_spent_minutes, current_streak_days').eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('role, company, experience_level').eq('user_id', user.id).maybeSingle()
    ]);

    const progress = progressRes.data || [];
    const stats = statsRes.data;
    const userProfile = profileRes.data;

    // Determine strong/weak areas from quiz scores
    const courseScores = new Map<string, number[]>();
    progress.forEach(p => {
      if (p.quiz_score && p.quiz_score > 0) {
        const key = p.course_id?.split('-').slice(0, -2).join(' ') || 'General';
        if (!courseScores.has(key)) courseScores.set(key, []);
        courseScores.get(key)!.push(p.quiz_score);
      }
    });

    const strongAreas: string[] = [];
    const weakAreas: string[] = [];
    courseScores.forEach((scores, area) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 75) strongAreas.push(area);
      else weakAreas.push(area);
    });

    // Determine pace from time spent
    const totalMinutes = stats?.total_time_spent_minutes || 0;
    const modulesCompleted = stats?.total_modules_completed || 0;
    const avgTimePerModule = modulesCompleted > 0 ? totalMinutes / modulesCompleted : 0;
    const pace = avgTimePerModule > 120 ? 'slow' : avgTimePerModule > 60 ? 'medium' : 'fast';

    // Build interests from enrolled courses
    const courseIds = [...new Set(progress.map(p => p.course_id))];
    const interests = courseIds.map(id => {
      const parts = id.split('-');
      return parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }).slice(0, 5);

    const expLevel = (userProfile as any)?.experience_level || 'beginner';
    const diffPref = expLevel === 'expert' ? 'challenging' : expLevel === 'intermediate' ? 'balanced' : 'comfortable';

    setProfile({
      learningStyle: 'visual',
      preferredPace: pace || 'medium',
      strongAreas: strongAreas.length > 0 ? strongAreas : ['Getting started'],
      weakAreas: weakAreas.length > 0 ? weakAreas : ['Explore more courses'],
      interests: interests.length > 0 ? interests : ['Business Finance'],
      availableTime: avgTimePerModule > 0 ? Math.round(avgTimePerModule) : 60,
      goals: modulesCompleted > 0 
        ? ['Continue learning', 'Improve quiz scores', 'Complete certification']
        : ['Start first course', 'Build foundations'],
      difficultyPreference: diffPref
    });
  };

  const generateRecommendations = async () => {
    if (!user?.id) return;

    // Fetch modules the user hasn't completed
    const [progressRes, modulesRes] = await Promise.all([
      supabase.from('course_progress').select('module_id, progress_percentage, quiz_score').eq('user_id', user.id),
      supabase.from('course_content_modules').select('id, title, description, course_id, duration').eq('is_active', true).order('order_index').limit(20)
    ]);

    const progress = progressRes.data || [];
    const modules = modulesRes.data || [];
    const progressMap = new Map(progress.map(p => [p.module_id, p]));

    const recs: LearningRecommendation[] = [];

    // Find modules with low quiz scores (need review)
    progress.forEach(p => {
      if (p.quiz_score && p.quiz_score > 0 && p.quiz_score < 70) {
        const mod = modules.find(m => m.id === p.module_id);
        if (mod) {
          recs.push({
            id: `review-${mod.id}`,
            type: 'review',
            title: `Review: ${mod.title}`,
            description: mod.description || '',
            reason: `Your quiz score was ${p.quiz_score}% — reviewing will strengthen this area`,
            priority: 'high',
            estimatedTime: 30,
            difficulty: 'medium',
            moduleId: mod.id
          });
        }
      }
    });

    // Find incomplete modules (in progress)
    modules.forEach(mod => {
      const prog = progressMap.get(mod.id);
      if (prog && prog.progress_percentage && prog.progress_percentage > 0 && prog.progress_percentage < 100) {
        recs.push({
          id: `continue-${mod.id}`,
          type: 'module',
          title: `Continue: ${mod.title}`,
          description: mod.description || '',
          reason: `You're ${prog.progress_percentage}% through this module`,
          priority: 'high',
          estimatedTime: 45,
          difficulty: 'medium',
          moduleId: mod.id
        });
      }
    });

    // Suggest new modules not yet started
    const notStarted = modules.filter(m => !progressMap.has(m.id)).slice(0, 2);
    notStarted.forEach(mod => {
      recs.push({
        id: `new-${mod.id}`,
        type: 'module',
        title: mod.title,
        description: mod.description || '',
        reason: 'New module to expand your knowledge',
        priority: 'medium',
        estimatedTime: 60,
        difficulty: 'medium',
        moduleId: mod.id
      });
    });

    if (recs.length === 0) {
      recs.push({
        id: 'explore',
        type: 'module',
        title: 'Explore Available Courses',
        description: 'Browse our course catalog to find your next learning path',
        reason: 'Start your learning journey',
        priority: 'medium',
        estimatedTime: 10,
        difficulty: 'easy'
      });
    }

    setRecommendations(recs.slice(0, 4));
  };

  const generateAdaptivePaths = async () => {
    if (!user?.id) return;

    // Build paths from real course/module data
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, description, level')
      .eq('is_active', true)
      .order('order_index')
      .limit(6);

    const { data: progressData } = await supabase
      .from('course_progress')
      .select('module_id, progress_percentage')
      .eq('user_id', user.id);

    const progressMap = new Map((progressData || []).map(p => [p.module_id, p.progress_percentage || 0]));

    // Group courses by level
    const beginnerCourses = (courses || []).filter(c => c.level === 'beginner').slice(0, 3);
    const expertCourses = (courses || []).filter(c => c.level === 'expert').slice(0, 3);

    const paths: AdaptivePath[] = [];

    if (beginnerCourses.length > 0) {
      const { data: beginnerModules } = await supabase
        .from('course_content_modules')
        .select('id, title, course_id, order_index')
        .in('course_id', beginnerCourses.map(c => c.id))
        .eq('is_active', true)
        .order('order_index')
        .limit(5);

      paths.push({
        id: 'foundations',
        name: 'Foundations Pathway',
        description: 'Build solid fundamentals in business finance and lending',
        estimatedCompletion: '6-8 weeks',
        personalizedFeatures: [
          'Step-by-step beginner content',
          'Interactive case studies',
          'Knowledge checks after each module',
          'Progress tracking'
        ],
        modules: (beginnerModules || []).map((m, idx) => ({
          id: m.id,
          title: m.title,
          order: idx + 1,
          unlocked: idx === 0 || (progressMap.get((beginnerModules || [])[idx - 1]?.id) || 0) >= 100,
          recommended: !progressMap.has(m.id),
          adaptedContent: { videos: true, readings: true, interactives: true, assessments: true }
        }))
      });
    }

    if (expertCourses.length > 0) {
      const { data: expertModules } = await supabase
        .from('course_content_modules')
        .select('id, title, course_id, order_index')
        .in('course_id', expertCourses.map(c => c.id))
        .eq('is_active', true)
        .order('order_index')
        .limit(5);

      paths.push({
        id: 'advanced',
        name: 'Advanced Pathway',
        description: 'Expert-level strategies and portfolio management',
        estimatedCompletion: '4-6 weeks',
        personalizedFeatures: [
          'Advanced case studies',
          'Complex scenarios',
          'Expert assessments',
          'Industry best practices'
        ],
        modules: (expertModules || []).map((m, idx) => ({
          id: m.id,
          title: m.title,
          order: idx + 1,
          unlocked: idx === 0,
          recommended: !progressMap.has(m.id),
          adaptedContent: { videos: true, readings: true, interactives: true, assessments: true }
        }))
      });
    }

    if (paths.length === 0) {
      paths.push({
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Begin your learning journey',
        estimatedCompletion: '2-4 weeks',
        personalizedFeatures: ['Guided onboarding', 'Beginner-friendly content'],
        modules: []
      });
    }

    setAdaptivePaths(paths);
    setSelectedPath(paths[0]?.id || '');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module': return BookOpen;
      case 'review': return RefreshCw;
      case 'practice': return Target;
      case 'challenge': return Zap;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-32 bg-muted rounded"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const selectedAdaptivePath = adaptivePaths.find(p => p.id === selectedPath);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-6 w-6 text-purple-600" />AI-Powered Adaptive Learning</CardTitle>
          <p className="text-muted-foreground">Personalized learning recommendations based on your progress, preferences, and goals</p>
        </CardHeader>
      </Card>

      {profile && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />Your Learning Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Learning Style</p>
                <p className="font-semibold capitalize">{profile.learningStyle}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Preferred Pace</p>
                <p className="font-semibold capitalize">{profile.preferredPace}</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Study Time</p>
                <p className="font-semibold">{profile.availableTime} minutes</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Difficulty Preference</p>
                <p className="font-semibold capitalize">{profile.difficultyPreference}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-medium mb-2">Strong Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.strongAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">{area}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.weakAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">{area}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" />Personalized Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const IconComponent = getTypeIcon(rec.type);
              return (
                <div key={rec.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg"><IconComponent className="h-5 w-5 text-primary" /></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rec.estimatedTime} min</span>
                        <Badge variant="outline">{rec.difficulty}</Badge>
                        <Badge variant="outline" className="capitalize">{rec.type}</Badge>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg mb-3">
                        <p className="text-sm"><strong>Why this is recommended:</strong> {rec.reason}</p>
                      </div>
                      {rec.moduleId && (
                        <Button size="sm" className="flex items-center gap-1" onClick={() => window.location.assign(`/module/${rec.moduleId}`)}>
                          Start Learning<ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Adaptive Learning Paths</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Available Paths</h4>
              {adaptivePaths.map((path) => (
                <div 
                  key={path.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPath === path.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setSelectedPath(path.id)}
                >
                  <h5 className="font-semibold">{path.name}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{path.estimatedCompletion}</p>
                </div>
              ))}
            </div>

            {selectedAdaptivePath && (
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Personalized Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedAdaptivePath.personalizedFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm"><Star className="h-3 w-3 text-yellow-500" />{feature}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Learning Modules</h4>
                  {selectedAdaptivePath.modules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No modules available for this path yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedAdaptivePath.modules.map((module) => (
                        <div key={module.id} className={`p-4 border rounded-lg ${module.recommended ? 'border-primary bg-primary/5' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold">{module.title}</h5>
                            <div className="flex gap-1">
                              {module.recommended && <Badge variant="outline" className="bg-primary/10 text-primary">Recommended</Badge>}
                              {!module.unlocked && <Badge variant="outline">Locked</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            {module.adaptedContent.videos && <Badge variant="secondary">Videos</Badge>}
                            {module.adaptedContent.readings && <Badge variant="secondary">Readings</Badge>}
                            {module.adaptedContent.interactives && <Badge variant="secondary">Interactive</Badge>}
                            {module.adaptedContent.assessments && <Badge variant="secondary">Assessments</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button className="w-full" onClick={() => {
                  const firstModule = selectedAdaptivePath.modules.find(m => m.unlocked && m.recommended);
                  if (firstModule) window.location.assign(`/module/${firstModule.id}`);
                }}>
                  Start This Learning Path
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
