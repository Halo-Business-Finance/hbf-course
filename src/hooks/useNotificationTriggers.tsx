import { useCallback } from 'react';

/**
 * Utility to fire notifications on key learning events.
 * Call these methods after the relevant action succeeds.
 */
export function useNotificationTriggers(userId?: string) {
  const send = useCallback(async (
    title: string,
    message: string,
    type: string = 'info',
    data?: Record<string, any>,
  ) => {
    if (!userId) return;
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type,
        data: data || null,
      });
    } catch (error) {
      logger.error('Notification trigger failed', error, { component: 'useNotificationTriggers' });
    }
  }, [userId]);

  const onModuleStarted = useCallback((moduleName: string, moduleId: string) => {
    send(
      '🚀 Module Started',
      `You've begun "${moduleName}". Keep up the momentum!`,
      'course',
      { action_url: `/module/${moduleId}` },
    );
  }, [send]);

  const onModuleCompleted = useCallback((moduleName: string) => {
    send(
      '✅ Module Completed',
      `Congratulations! You've completed "${moduleName}".`,
      'success',
      { action_url: '/my-course' },
    );
  }, [send]);

  const onQuizPassed = useCallback((moduleName: string, score: number) => {
    send(
      '🎯 Quiz Passed',
      `You scored ${score}% on the "${moduleName}" assessment. Great job!`,
      'success',
    );
  }, [send]);

  const onQuizFailed = useCallback((moduleName: string, score: number) => {
    send(
      '📝 Quiz Needs Retry',
      `You scored ${score}% on "${moduleName}". Review the material and try again!`,
      'warning',
    );
  }, [send]);

  const onCourseCompleted = useCallback((courseName: string, certificateId?: string) => {
    send(
      '🏆 Course Completed!',
      `You've completed "${courseName}"! Your certificate is ready.`,
      'achievement',
      certificateId ? { action_url: `/certificate/${certificateId}` } : undefined,
    );
  }, [send]);

  const onStreakMilestone = useCallback((days: number) => {
    send(
      '🔥 Streak Milestone',
      `${days}-day learning streak! You're on fire!`,
      'achievement',
      { action_url: '/achievements' },
    );
  }, [send]);

  const onBadgeEarned = useCallback((badgeName: string) => {
    send(
      '🏅 Badge Earned',
      `You've earned the "${badgeName}" badge! Check your achievements.`,
      'achievement',
      { action_url: '/achievements' },
    );
  }, [send]);

  const onWelcome = useCallback(() => {
    send(
      '👋 Welcome to FinPilot!',
      'Start your learning journey by exploring the course catalog on your dashboard.',
      'info',
      { action_url: '/dashboard' },
    );
  }, [send]);

  return {
    send,
    onModuleStarted,
    onModuleCompleted,
    onQuizPassed,
    onQuizFailed,
    onCourseCompleted,
    onStreakMilestone,
    onBadgeEarned,
    onWelcome,
  };
}
