
-- =====================================================
-- Fix remaining permissive RLS INSERT policies
-- =====================================================

-- 1. LEARNING_ACHIEVEMENTS: Scope INSERT to authenticated user's own data
DROP POLICY IF EXISTS "System can create achievements" ON public.learning_achievements;
CREATE POLICY "Users can create own achievements"
  ON public.learning_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. USER_BEHAVIORAL_ANALYTICS: Scope INSERT to authenticated user's own data
DROP POLICY IF EXISTS "System can insert behavioral analytics" ON public.user_behavioral_analytics;
CREATE POLICY "Users can insert own behavioral analytics"
  ON public.user_behavioral_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. SECURITY_EVENTS: Remove duplicate permissive INSERT policies
-- Keep the secure one ("Secure security event insert") which requires service_role or super_admin
DROP POLICY IF EXISTS "simple_system_security_events_create_2025" ON public.security_events;
DROP POLICY IF EXISTS "system_security_create_20250905_073203" ON public.security_events;
