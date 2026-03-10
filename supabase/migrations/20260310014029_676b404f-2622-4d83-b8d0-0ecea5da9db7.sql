-- Add prerequisite_course_ids column to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS prerequisite_course_ids text[] DEFAULT '{}';

-- Add a comment for clarity
COMMENT ON COLUMN public.courses.prerequisite_course_ids IS 'Array of course IDs that must be completed before this course can be started';