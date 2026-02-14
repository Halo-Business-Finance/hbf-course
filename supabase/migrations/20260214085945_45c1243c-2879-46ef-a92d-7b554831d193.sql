
-- =====================================================
-- Fix overly permissive RLS policies
-- =====================================================

-- 1. COURSE_CONTENT_MODULES: Remove the overly permissive policy (always true)
DROP POLICY IF EXISTS "Public can view active modules for catalog, enrolled users see " ON public.course_content_modules;

-- 2. COURSE_VIDEOS: Remove overly permissive "Users can view active videos" policy
-- Keep the enrollment-based policy which is secure
DROP POLICY IF EXISTS "Users can view active videos" ON public.course_videos;

-- 3. BADGES: Require authentication to view badges
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.badges;
CREATE POLICY "Authenticated users can view badges"
  ON public.badges FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 4. DISCUSSION_POSTS: Require authentication to view
DROP POLICY IF EXISTS "Users can view all discussion posts" ON public.discussion_posts;
CREATE POLICY "Authenticated users can view discussion posts"
  ON public.discussion_posts FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 5. DISCUSSION_REPLIES: Require authentication to view
DROP POLICY IF EXISTS "Users can view all replies" ON public.discussion_replies;
CREATE POLICY "Authenticated users can view discussion replies"
  ON public.discussion_replies FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 6. COURSE_REVIEWS: Require authentication to view
DROP POLICY IF EXISTS "Users can view all reviews" ON public.course_reviews;
CREATE POLICY "Authenticated users can view reviews"
  ON public.course_reviews FOR SELECT
  USING (auth.uid() IS NOT NULL);
