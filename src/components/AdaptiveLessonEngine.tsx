import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, TrendingUp, BookOpen } from 'lucide-react';
import { InteractiveLessonPlayer } from './InteractiveLessonPlayer';
import { LearningPathVisualizer } from './LearningPathVisualizer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/secureLogging';

interface AdaptiveLessonEngineProps {
  moduleId: string;
  userId: string;
  courseId: string;
}

interface LearningProfile {
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficulty_preference: 'gradual' | 'challenge' | 'adaptive';
  engagement_level: number;
  knowledge_gaps: string[];
  strengths: string[];
  current_mastery_level: number;
}

interface AdaptiveLesson {
  id: string;
  title: string;
  content_type: 'video' | 'interactive' | 'text' | 'simulation' | 'quiz';
  difficulty_level: number;
  estimated_duration: number;
  prerequisites: string[];
  learning_objectives: string[];
  interactive_elements: any[];
  adaptive_content: any;
}

export const AdaptiveLessonEngine = ({ moduleId, userId, courseId }: AdaptiveLessonEngineProps) => {
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [adaptiveLessons, setAdaptiveLessons] = useState<AdaptiveLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<AdaptiveLesson | null>(null);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [masteryScore, setMasteryScore] = useState(0);
  const { toast } = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { initializeAdaptiveLearning(); }, [moduleId, userId]);

  const initializeAdaptiveLearning = async () => {
    try {
      setIsLoading(true);
      const profile = await fetchLearningProfile();
      setLearningProfile(profile);
      const lessons = await generateAdaptiveLessons(profile);
      setAdaptiveLessons(lessons);
      const path = createLearningPath(lessons, profile);
      setLearningPath(path);
      if (lessons.length > 0) setCurrentLesson(lessons[0]);
    } catch (error) {
      logger.error('Error initializing adaptive learning', error, { userId });
      toast({ title: "Error", description: "Failed to initialize adaptive learning system", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningProfile = async (): Promise<LearningProfile> => {
    // Check for existing adaptive module instance
    const { data: instance } = await supabase
      .from('adaptive_module_instances')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (instance && instance.personalized_content) {
      const content = instance.personalized_content as any;
      return {
        learning_style: content.learning_style || 'visual',
        difficulty_preference: content.difficulty_preference || 'adaptive',
        engagement_level: (instance.performance_metrics as any)?.engagement_level || 50,
        knowledge_gaps: (instance.performance_metrics as any)?.knowledge_gaps || [],
        strengths: (instance.performance_metrics as any)?.strengths || [],
        current_mastery_level: instance.progress_percentage || 0
      };
    }

    // Build profile from real progress data
    const { data: progressData } = await supabase
      .from('course_progress')
      .select('module_id, progress_percentage, quiz_score')
      .eq('user_id', userId);

    const scores = (progressData || []).filter(p => p.quiz_score && p.quiz_score > 0).map(p => p.quiz_score!);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const completedCount = (progressData || []).filter(p => p.progress_percentage === 100).length;

    const strengths = avgScore >= 80 ? ['Strong quiz performance'] : [];
    const gaps = avgScore > 0 && avgScore < 70 ? ['Review fundamentals'] : [];

    return {
      learning_style: 'visual',
      difficulty_preference: 'adaptive',
      engagement_level: Math.min(100, 30 + completedCount * 10),
      knowledge_gaps: gaps,
      strengths: strengths,
      current_mastery_level: Math.min(100, completedCount * 15)
    };
  };

  const generateAdaptiveLessons = async (profile: LearningProfile): Promise<AdaptiveLesson[]> => {
    // Fetch real module content/topics from course_content_modules
    const { data: moduleData } = await supabase
      .from('course_content_modules')
      .select('id, title, topics, lessons_count')
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('order_index');

    if (!moduleData || moduleData.length === 0) {
      // Fallback: use the module title
      const { data: singleModule } = await supabase
        .from('course_content_modules')
        .select('title, topics')
        .eq('id', moduleId)
        .maybeSingle();

      const topics = (singleModule?.topics as string[]) || ['Course Fundamentals'];
      return topics.map((topic, index) => ({
        id: `adaptive-lesson-${index}`,
        title: typeof topic === 'string' ? topic : `Lesson ${index + 1}`,
        content_type: getOptimalContentType(profile.learning_style, index),
        difficulty_level: calculateDifficultyLevel(profile, index),
        estimated_duration: calculateDuration(profile, index),
        prerequisites: index > 0 ? [topics[index - 1]] : [],
        learning_objectives: [`Learn ${topic} fundamentals`, `Apply ${topic} concepts`, `Demonstrate ${topic} mastery`],
        interactive_elements: [{ type: 'knowledge-check', title: 'Quick Assessment', description: `Test your ${topic} understanding` }],
        adaptive_content: { main_content: `Content for ${topic}` }
      }));
    }

    // Build lessons from real topics across modules
    const allTopics: string[] = [];
    moduleData.forEach(m => {
      const topics = (m.topics as string[]) || [];
      topics.forEach(t => { if (typeof t === 'string') allTopics.push(t); });
    });

    return allTopics.slice(0, 10).map((topic, index) => ({
      id: `adaptive-lesson-${index}`,
      title: topic,
      content_type: getOptimalContentType(profile.learning_style, index),
      difficulty_level: calculateDifficultyLevel(profile, index),
      estimated_duration: calculateDuration(profile, index),
      prerequisites: index > 0 ? [allTopics[index - 1]] : [],
      learning_objectives: [`Learn ${topic} fundamentals`, `Apply ${topic} concepts`, `Demonstrate ${topic} mastery`],
      interactive_elements: [{ type: 'knowledge-check', title: 'Quick Assessment', description: `Test your ${topic} understanding` }],
      adaptive_content: { main_content: `Content for ${topic}` }
    }));
  };

  const getOptimalContentType = (learningStyle: string, index: number): any => {
    const map: Record<string, string[]> = {
      visual: ['video', 'interactive', 'simulation'],
      auditory: ['video', 'interactive'],
      kinesthetic: ['interactive', 'simulation'],
      reading: ['text', 'quiz']
    };
    const types = map[learningStyle] || ['video', 'interactive', 'text'];
    return types[index % types.length];
  };

  const calculateDifficultyLevel = (profile: LearningProfile, index: number): number => {
    const base = Math.min(profile.current_mastery_level / 20, 5);
    switch (profile.difficulty_preference) {
      case 'gradual': return Math.max(1, base + index * 0.5);
      case 'challenge': return Math.min(10, base + 2 + index * 0.8);
      default: return Math.max(1, Math.min(10, base + index * 0.6));
    }
  };

  const calculateDuration = (profile: LearningProfile, index: number): number => {
    const baseTime = 15;
    const engagementMultiplier = profile.engagement_level / 50;
    return Math.round(baseTime * engagementMultiplier + index * 5);
  };

  const createLearningPath = (lessons: AdaptiveLesson[], profile: LearningProfile): any[] => {
    return lessons.map((lesson, index) => ({
      step: index + 1, lesson, status: index === 0 ? 'current' : 'locked',
      estimatedCompletionTime: lesson.estimated_duration,
      adaptations: { difficulty: lesson.difficulty_level, contentType: lesson.content_type, interactiveElements: lesson.interactive_elements.length }
    }));
  };

  const handleLessonComplete = async (lessonId: string, score: number, timeSpent: number) => {
    try {
      await updateLearningMetrics(lessonId, score, timeSpent);
      await adaptLearningProfile(score, timeSpent);
      const currentIndex = adaptiveLessons.findIndex(l => l.id === lessonId);
      if (currentIndex < adaptiveLessons.length - 1) {
        setCurrentLesson(adaptiveLessons[currentIndex + 1]);
        const newPath = [...learningPath];
        newPath[currentIndex].status = 'completed';
        newPath[currentIndex + 1].status = 'current';
        setLearningPath(newPath);
      } else {
        toast({ title: "🎉 Module Completed!", description: "Great job! You've mastered this module with adaptive learning." });
      }
    } catch (error) {
      logger.error('Error completing lesson', error, { userId, lessonId });
      toast({ title: "Error", description: "Failed to save lesson progress", variant: "destructive" });
    }
  };

  const updateLearningMetrics = async (lessonId: string, score: number, timeSpent: number) => {
    const { error } = await supabase
      .from('adaptive_module_instances')
      .update({
        performance_metrics: { ...learningProfile, last_score: score, average_time_per_lesson: timeSpent, lessons_completed: (learningProfile?.current_mastery_level || 0) + 1 },
        progress_percentage: Math.min(100, (learningProfile?.current_mastery_level || 0) + (100 / adaptiveLessons.length)),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('course_id', courseId);
    if (error) throw error;
  };

  const adaptLearningProfile = async (score: number, timeSpent: number) => {
    if (!learningProfile) return;
    const newProfile = { ...learningProfile };
    if (currentLesson) {
      const timeRatio = timeSpent / currentLesson.estimated_duration;
      if (timeRatio > 1.5) newProfile.engagement_level = Math.max(0, newProfile.engagement_level - 10);
      else if (timeRatio < 0.8) newProfile.engagement_level = Math.min(100, newProfile.engagement_level + 5);
    }
    newProfile.current_mastery_level = Math.min(100, newProfile.current_mastery_level + (score / 10));
    setLearningProfile(newProfile);
    setMasteryScore(newProfile.current_mastery_level);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><div className="text-center space-y-4"><Brain className="h-8 w-8 animate-pulse mx-auto text-primary" /><p>Personalizing your learning experience...</p></div></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" />Your Adaptive Learning Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center"><div className="text-sm font-medium capitalize">{learningProfile?.learning_style}</div><p className="text-sm text-muted-foreground mt-1">Learning Style</p></div>
            <div className="text-center"><div className="text-2xl font-bold text-primary">{masteryScore}%</div><p className="text-sm text-muted-foreground">Mastery Level</p></div>
            <div className="text-center"><div className="text-2xl font-bold text-primary">{learningProfile?.engagement_level}%</div><p className="text-sm text-muted-foreground">Engagement</p></div>
            <div className="text-center"><div className="text-sm font-medium capitalize">{learningProfile?.difficulty_preference}</div><p className="text-sm text-muted-foreground mt-1">Difficulty</p></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lesson" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lesson">Current Lesson</TabsTrigger>
          <TabsTrigger value="path">Learning Path</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="lesson" className="space-y-6">
          {currentLesson && <InteractiveLessonPlayer lesson={currentLesson} learningProfile={learningProfile!} onComplete={handleLessonComplete} />}
        </TabsContent>
        <TabsContent value="path" className="space-y-6">
          <LearningPathVisualizer learningPath={learningPath} currentLessonId={currentLesson?.id} onLessonSelect={(lesson) => setCurrentLesson(lesson)} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Progress Analytics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><div className="flex justify-between text-sm mb-2"><span>Module Progress</span><span>{learningPath.length > 0 ? Math.round((learningPath.filter(p => p.status === 'completed').length / learningPath.length) * 100) : 0}%</span></div><Progress value={learningPath.length > 0 ? (learningPath.filter(p => p.status === 'completed').length / learningPath.length) * 100 : 0} /></div>
                <div><div className="flex justify-between text-sm mb-2"><span>Mastery Score</span><span>{masteryScore}%</span></div><Progress value={masteryScore} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Learning Insights</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2"><h4 className="font-medium text-sm">Strengths</h4><div className="flex flex-wrap gap-1">{learningProfile?.strengths.length ? learningProfile.strengths.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">{s}</span>) : <span className="text-xs text-muted-foreground">Building strengths...</span>}</div></div>
                <div className="space-y-2"><h4 className="font-medium text-sm">Focus Areas</h4><div className="flex flex-wrap gap-1">{learningProfile?.knowledge_gaps.length ? learningProfile.knowledge_gaps.map((g, i) => <span key={i} className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">{g}</span>) : <span className="text-xs text-muted-foreground">No gaps identified</span>}</div></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
