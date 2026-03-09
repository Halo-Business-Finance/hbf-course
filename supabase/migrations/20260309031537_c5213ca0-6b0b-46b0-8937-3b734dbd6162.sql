ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS professional_role TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS learning_goals TEXT[];