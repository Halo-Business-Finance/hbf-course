-- Grant SELECT on profiles to authenticated role so RLS policies can be evaluated
GRANT SELECT ON public.profiles TO authenticated;

-- Also grant to anon for the existing public policies
GRANT SELECT ON public.profiles TO anon;