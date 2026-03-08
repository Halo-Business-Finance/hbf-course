import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseCompletionResult {
  isComplete: boolean;
  certificateId?: string;
  totalModules: number;
  completedModules: number;
  averageScore: number;
}

export function useCourseCompletion(userId?: string) {
  const [checking, setChecking] = useState(false);

  const checkCourseCompletion = useCallback(async (courseId: string): Promise<CourseCompletionResult | null> => {
    if (!userId) return null;
    setChecking(true);

    try {
      // 1. Get all modules for this course
      const { data: modules, error: modErr } = await supabase
        .from('course_content_modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('is_active', true);

      if (modErr || !modules?.length) {
        return null;
      }

      const moduleIds = modules.map(m => m.id);

      // 2. Get user's progress for these modules
      const { data: progressData, error: progErr } = await supabase
        .from('course_progress')
        .select('module_id, progress_percentage, quiz_score')
        .eq('user_id', userId)
        .in('module_id', moduleIds);

      if (progErr) {
        console.error('Error checking progress:', progErr);
        return null;
      }

      // Build progress map (take highest progress per module)
      const progressMap = new Map<string, { progress: number; score: number }>();
      (progressData || []).forEach(p => {
        if (p.module_id) {
          const existing = progressMap.get(p.module_id);
          if (!existing || p.progress_percentage > existing.progress) {
            progressMap.set(p.module_id, {
              progress: p.progress_percentage,
              score: p.quiz_score || 0,
            });
          }
        }
      });

      const completedModules = moduleIds.filter(id => progressMap.get(id)?.progress === 100).length;
      const totalModules = moduleIds.length;
      const isComplete = completedModules === totalModules && totalModules > 0;

      const scores = Array.from(progressMap.values()).map(v => v.score).filter(s => s > 0);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      const result: CourseCompletionResult = {
        isComplete,
        totalModules,
        completedModules,
        averageScore,
      };

      // 3. If complete, check for existing certificate or create one
      if (isComplete) {
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .maybeSingle();

        if (existingCert) {
          result.certificateId = existingCert.id;
        } else {
          // Generate certificate
          const certNumber = `HALO-${courseId.toUpperCase().slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;
          const { data: newCert, error: certErr } = await supabase
            .from('certificates')
            .insert({
              user_id: userId,
              course_id: courseId,
              certificate_number: certNumber,
              completion_percentage: 100,
              final_score: averageScore || null,
              issued_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (newCert && !certErr) {
            result.certificateId = newCert.id;
          } else {
            console.error('Error creating certificate:', certErr);
          }
        }
      }

      return result;
    } catch (err) {
      console.error('Error in course completion check:', err);
      return null;
    } finally {
      setChecking(false);
    }
  }, [userId]);

  return { checkCourseCompletion, checking };
}
