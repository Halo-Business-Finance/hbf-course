-- Fix the auto_enroll_in_course function to handle missing course gracefully
CREATE OR REPLACE FUNCTION public.auto_enroll_in_course()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip auto-enrollment since default course may not exist
  -- Users will enroll in courses from the dashboard/catalog
  RETURN NEW;
END;
$$;