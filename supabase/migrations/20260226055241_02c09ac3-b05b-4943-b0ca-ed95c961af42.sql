-- Update course_videos RLS: allow all authenticated users to view active videos
DROP POLICY IF EXISTS "Enrolled users can view course videos" ON course_videos;

CREATE POLICY "Authenticated users can view active videos"
ON course_videos
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_active = true);