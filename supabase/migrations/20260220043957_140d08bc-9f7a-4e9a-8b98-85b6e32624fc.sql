
-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Enrolled users can view active modules" ON course_content_modules;

-- Allow all authenticated users to view active modules (they need to browse before enrolling)
CREATE POLICY "Authenticated users can view active modules"
ON course_content_modules
FOR SELECT
USING (is_active = true AND auth.uid() IS NOT NULL);
