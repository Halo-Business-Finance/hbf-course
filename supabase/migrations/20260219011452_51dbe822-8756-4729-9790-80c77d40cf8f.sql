-- Make storage buckets private to prevent unrestricted public access
UPDATE storage.buckets SET public = false WHERE id IN ('avatars', 'cms-media');

-- Drop the security definer view and recreate as a regular view
DROP VIEW IF EXISTS public.fn_missing_search_path;

-- Recreate as a standard (non-security-definer) view
CREATE OR REPLACE VIEW public.fn_missing_search_path AS
 SELECT n.nspname AS schema,
    p.proname AS name,
    pg_get_function_identity_arguments(p.oid) AS args,
    p.prosecdef AS security_definer,
    (POSITION(('SET search_path'::text) IN (pg_get_functiondef(p.oid))) = 0) AS missing_search_path
   FROM (pg_proc p
     JOIN pg_namespace n ON ((n.oid = p.pronamespace)))
  WHERE ((n.nspname <> ALL (ARRAY['pg_catalog'::name, 'information_schema'::name])) AND (POSITION(('SET search_path'::text) IN (pg_get_functiondef(p.oid))) = 0));

-- Restrict view access to admins only (security best practice)
REVOKE ALL ON public.fn_missing_search_path FROM anon, authenticated;
GRANT SELECT ON public.fn_missing_search_path TO service_role;