import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedLearning } from "@/hooks/useEnhancedLearning";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Brain, Target, TrendingUp, Lightbulb, Timer, Award, BookOpen } from "lucide-react";

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'scenario' | 'drag_drop' | 'simulation';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  timeLimit?: number;
  hints?: string[];
  multimedia?: { type: 'image' | 'video' | 'audio'; url: string; alt?: string };
  adaptiveData?: { previousPerformance: number; conceptMastery: number; recommendedDifficulty: string };
}

interface AssessmentSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  startTime: Date;
  timeRemaining: number;
  isAdaptive: boolean;
  difficultyLevel: 'beginner' | 'expert';
  topic: string;
  hintsUsed: Record<string, number>;
  confidence: Record<string, number>;
}

interface AssessmentResults {
  score: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  topicBreakdown: Record<string, { correct: number; total: number; averageTime: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number }>;
  recommendations: string[];
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

export const AdvancedAssessmentSystem = () => {
  const { trackLearningEvent } = useEnhancedLearning();
  const { toast } = useToast();
  
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState<number>(3);
  const [currentMode, setCurrentMode] = useState<'practice' | 'assessment' | 'adaptive'>('practice');

  useEffect(() => {
    if (!session || results) return;
    const timer = setInterval(() => {
      setSession(prev => {
        if (!prev) return prev;
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) { handleTimeUp(); return prev; }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session, results]);

  const startAssessment = useCallback(async (mode: 'practice' | 'assessment' | 'adaptive', topic?: string) => {
    setIsLoading(true);
    setCurrentMode(mode);
    try {
      const questions = await generateAdaptiveQuestions(mode, topic);
      
      if (questions.length === 0) {
        toast({ title: "No questions available", description: "No assessment questions have been set up yet.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const newSession: AssessmentSession = {
        id: crypto.randomUUID(), questions, currentQuestionIndex: 0, answers: {},
        startTime: new Date(), timeRemaining: mode === 'assessment' ? 1800 : 3600,
        isAdaptive: mode === 'adaptive', difficultyLevel: 'beginner', topic: topic || 'general',
        hintsUsed: {}, confidence: {}
      };
      setSession(newSession);
      setResults(null);
      setSelectedAnswer("");
      setShowHint(false);
      setConfidence(3);
      await trackLearningEvent('assessment_started', { mode, topic, questionCount: questions.length });
    } catch (error) {
      toast({ title: "Error starting assessment", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [trackLearningEvent, toast]);

  const generateAdaptiveQuestions = async (mode: string, topic?: string): Promise<Question[]> => {
    // Fetch real questions from course_assessments and module_quiz_questions
    const { data: assessments } = await supabase
      .from('course_assessments')
      .select('id, title, questions, assessment_type')
      .order('order_index')
      .limit(5);

    const { data: quizQuestions } = await supabase
      .from('module_quiz_questions')
      .select('id, question, options, correct_answer, explanation, order_index')
      .order('order_index')
      .limit(10);

    const questions: Question[] = [];

    // Parse questions from course_assessments (stored as JSON)
    (assessments || []).forEach(assessment => {
      const assessmentQuestions = assessment.questions as any[];
      if (Array.isArray(assessmentQuestions)) {
        assessmentQuestions.forEach((q, idx) => {
          questions.push({
            id: `${assessment.id}-${idx}`,
            type: q.type || 'multiple_choice',
            question: q.question || q.text || '',
            options: q.options || [],
            correctAnswer: q.correctAnswer || q.correct_answer || q.answer,
            explanation: q.explanation || 'Review the course materials for more details.',
            difficulty: q.difficulty || 'medium',
            topic: assessment.title || 'General',
            timeLimit: 120,
            hints: q.hints || []
          });
        });
      }
    });

    // Add module quiz questions
    (quizQuestions || []).forEach(q => {
      const opts = Array.isArray(q.options) ? q.options as string[] : [];
      questions.push({
        id: q.id,
        type: 'multiple_choice',
        question: q.question,
        options: opts,
        correctAnswer: opts[q.correct_answer] || String(q.correct_answer),
        explanation: q.explanation,
        difficulty: 'medium',
        topic: 'Module Quiz',
        timeLimit: 120
      });
    });

    const limit = mode === 'practice' ? 5 : 10;
    return questions.slice(0, limit);
  };

  const handleAnswerSubmit = useCallback(async () => {
    if (!session || !selectedAnswer) return;
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const answerData = {
      questionId: currentQuestion.id, answer: selectedAnswer, confidence,
      timeSpent: currentQuestion.timeLimit ? (currentQuestion.timeLimit - session.timeRemaining) : 0,
      hintsUsed: session.hintsUsed[currentQuestion.id] || 0,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer
    };
    const updatedAnswers = { ...session.answers, [currentQuestion.id]: answerData };
    setSession(prev => prev ? { ...prev, answers: updatedAnswers, confidence: { ...prev.confidence, [currentQuestion.id]: confidence } } : null);
    await trackLearningEvent('question_answered', {
      questionId: currentQuestion.id, questionType: currentQuestion.type, difficulty: currentQuestion.difficulty,
      topic: currentQuestion.topic, isCorrect: answerData.isCorrect, timeSpent: answerData.timeSpent, confidence, hintsUsed: answerData.hintsUsed
    });
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
      setSelectedAnswer(""); setShowHint(false); setConfidence(3);
    } else {
      await finishAssessment(updatedAnswers);
    }
  }, [session, selectedAnswer, confidence, trackLearningEvent]);

  const finishAssessment = async (finalAnswers: Record<string, any>) => {
    if (!session) return;
    const endTime = new Date();
    const totalTimeSpent = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000 / 60);
    const results = calculateDetailedResults(session, finalAnswers, totalTimeSpent);
    setResults(results); setSession(null);
    await trackLearningEvent('assessment_completed', { mode: currentMode, score: results.score, timeSpent: totalTimeSpent, questionsAnswered: results.totalQuestions, correctAnswers: results.correctAnswers });
    toast({ title: "Assessment Complete!", description: `You scored ${results.score}% in ${totalTimeSpent} minutes.` });
  };

  const calculateDetailedResults = (session: AssessmentSession, answers: Record<string, any>, timeSpent: number): AssessmentResults => {
    const questions = session.questions;
    let correctCount = 0;
    const topicBreakdown: Record<string, { correct: number; total: number; averageTime: number }> = {};
    const difficultyBreakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach(question => {
      const answer = answers[question.id]; const isCorrect = answer?.isCorrect || false;
      if (isCorrect) correctCount++;
      if (!topicBreakdown[question.topic]) topicBreakdown[question.topic] = { correct: 0, total: 0, averageTime: 0 };
      topicBreakdown[question.topic].total++; topicBreakdown[question.topic].averageTime += answer?.timeSpent || 0;
      if (isCorrect) topicBreakdown[question.topic].correct++;
      if (!difficultyBreakdown[question.difficulty]) difficultyBreakdown[question.difficulty] = { correct: 0, total: 0 };
      difficultyBreakdown[question.difficulty].total++; if (isCorrect) difficultyBreakdown[question.difficulty].correct++;
    });
    Object.keys(topicBreakdown).forEach(topic => { topicBreakdown[topic].averageTime = topicBreakdown[topic].averageTime / topicBreakdown[topic].total; });
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const recommendations = generateRecommendations(score, topicBreakdown, difficultyBreakdown);
    const strengths = generateStrengths(topicBreakdown); const improvements = generateImprovements(topicBreakdown);
    const nextSteps = generateNextSteps(score, session.topic);
    return { score, timeSpent, correctAnswers: correctCount, totalQuestions: questions.length, topicBreakdown, difficultyBreakdown, recommendations, strengths, improvements, nextSteps };
  };

  const generateRecommendations = (score: number, topics: any, difficulties: any): string[] => {
    const recs = [];
    if (score < 70) { recs.push("Focus on fundamental concepts before attempting advanced topics"); recs.push("Consider reviewing course materials and taking practice quizzes"); }
    Object.entries(topics).forEach(([topic, data]: [string, any]) => { const pct = (data.correct / data.total) * 100; if (pct < 60) recs.push(`Review ${topic} concepts - current mastery: ${Math.round(pct)}%`); });
    if (score >= 90) recs.push("Excellent performance! Consider advancing to more challenging modules");
    return recs;
  };
  const generateStrengths = (topics: any): string[] => { const s: string[] = []; Object.entries(topics).forEach(([topic, data]: [string, any]) => { const pct = (data.correct / data.total) * 100; if (pct >= 80) s.push(`Strong understanding of ${topic} (${Math.round(pct)}%)`); }); return s; };
  const generateImprovements = (topics: any): string[] => { const i: string[] = []; Object.entries(topics).forEach(([topic, data]: [string, any]) => { const pct = (data.correct / data.total) * 100; if (pct < 70) i.push(`${topic} needs more practice (${Math.round(pct)}%)`); }); return i; };
  const generateNextSteps = (score: number, topic: string): string[] => {
    if (score >= 80) return ["Advance to the next module or take a more challenging assessment", "Apply knowledge through practical scenarios and case studies"];
    if (score >= 60) return ["Review incorrect answers and their explanations", "Practice similar questions to reinforce weak areas"];
    return ["Revisit course materials for fundamental concepts", "Schedule study time for focused review", "Consider additional learning resources"];
  };

  const handleTimeUp = () => { if (session) finishAssessment(session.answers); };
  const useHint = () => {
    if (!session) return;
    const cq = session.questions[session.currentQuestionIndex]; const hu = session.hintsUsed[cq.id] || 0;
    if (hu < (cq.hints?.length || 0)) { setShowHint(true); setSession(prev => prev ? { ...prev, hintsUsed: { ...prev.hintsUsed, [cq.id]: hu + 1 } } : null); }
  };
  const formatTime = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };

  if (results) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              {results.score >= 90 ? <Award className="h-8 w-8 text-halo-orange" /> : results.score >= 70 ? <CheckCircle className="h-8 w-8 text-accent" /> : <Target className="h-8 w-8 text-primary" />}
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center"><div className="text-3xl font-bold text-primary">{results.score}%</div><div className="text-sm text-muted-foreground">Final Score</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-primary">{results.timeSpent}m</div><div className="text-sm text-muted-foreground">Time Spent</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-accent">{results.correctAnswers}/{results.totalQuestions}</div><div className="text-sm text-muted-foreground">Correct</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-halo-orange">{Math.round((results.correctAnswers / Math.max(results.totalQuestions, 1)) * 100)}%</div><div className="text-sm text-muted-foreground">Accuracy</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.strengths.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2 text-accent"><CheckCircle className="h-5 w-5" />Strengths</CardTitle></CardHeader><CardContent><ul className="space-y-2">{results.strengths.map((s, i) => <li key={i} className="text-sm flex items-start gap-2"><CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />{s}</li>)}</ul></CardContent></Card>}
              {results.improvements.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2 text-halo-orange"><AlertCircle className="h-5 w-5" />Areas for Improvement</CardTitle></CardHeader><CardContent><ul className="space-y-2">{results.improvements.map((s, i) => <li key={i} className="text-sm flex items-start gap-2"><AlertCircle className="h-4 w-4 text-halo-orange mt-0.5 shrink-0" />{s}</li>)}</ul></CardContent></Card>}
            </div>
            {results.nextSteps.length > 0 && <Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Next Steps</CardTitle></CardHeader><CardContent><ul className="space-y-2">{results.nextSteps.map((s, i) => <li key={i} className="text-sm flex items-start gap-2"><Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />{s}</li>)}</ul></CardContent></Card>}
            <div className="flex gap-4 mt-6">
              <Button onClick={() => startAssessment('practice')}>Practice Again</Button>
              <Button variant="outline" onClick={() => { setResults(null); }}>Back to Menu</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session) {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-4"><Badge variant="outline">Question {session.currentQuestionIndex + 1}/{session.questions.length}</Badge><Badge variant="outline" className="capitalize">{currentQuestion.difficulty}</Badge><Badge variant="outline">{currentQuestion.topic}</Badge></div><div className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4" /><span className={session.timeRemaining < 300 ? 'text-destructive font-bold' : ''}>{formatTime(session.timeRemaining)}</span></div></div>
        <Progress value={progress} className="h-2" />
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">{currentQuestion.question}</h3>
            {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && currentQuestion.options && (
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} /><Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'essay') && <Textarea placeholder="Type your answer here..." value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)} rows={currentQuestion.type === 'essay' ? 6 : 3} />}
            {currentQuestion.type === 'scenario' && <Textarea placeholder="Describe your approach to this scenario..." value={selectedAnswer} onChange={(e) => setSelectedAnswer(e.target.value)} rows={6} />}
            {showHint && currentQuestion.hints && (
              <div className="mt-4 p-3 bg-muted rounded-lg"><p className="text-sm"><strong>Hint:</strong> {currentQuestion.hints[Math.min((session.hintsUsed[currentQuestion.id] || 1) - 1, currentQuestion.hints.length - 1)]}</p></div>
            )}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {currentQuestion.hints && currentQuestion.hints.length > 0 && <Button variant="outline" size="sm" onClick={useHint} disabled={(session.hintsUsed[currentQuestion.id] || 0) >= currentQuestion.hints.length}><Lightbulb className="h-4 w-4 mr-1" />Hint</Button>}
              </div>
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-6 w-6 text-primary" />Advanced Assessment System</CardTitle>
          <p className="text-muted-foreground">Test your knowledge with adaptive assessments powered by real course content</p>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => startAssessment('practice')}>
          <CardContent className="p-6 text-center"><BookOpen className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Practice Mode</h3><p className="text-sm text-muted-foreground mb-4">No time pressure, learn at your own pace</p><Button className="w-full" disabled={isLoading}>{isLoading ? 'Loading...' : 'Start Practice'}</Button></CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => startAssessment('assessment')}>
          <CardContent className="p-6 text-center"><Target className="h-12 w-12 text-halo-orange mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Assessment Mode</h3><p className="text-sm text-muted-foreground mb-4">Timed assessment with comprehensive scoring</p><Button className="w-full" variant="outline" disabled={isLoading}>{isLoading ? 'Loading...' : 'Start Assessment'}</Button></CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => startAssessment('adaptive')}>
          <CardContent className="p-6 text-center"><Brain className="h-12 w-12 text-accent mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Adaptive Mode</h3><p className="text-sm text-muted-foreground mb-4">Questions adapt to your performance level</p><Button className="w-full" variant="outline" disabled={isLoading}>{isLoading ? 'Loading...' : 'Start Adaptive'}</Button></CardContent>
        </Card>
      </div>
    </div>
  );
};
