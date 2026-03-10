
-- 1. Fix validate_system_process: drop and recreate with proper security
DROP FUNCTION IF EXISTS public.validate_system_process(text);

CREATE FUNCTION public.validate_system_process(process_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_valid_source BOOLEAN := FALSE;
BEGIN
  -- Only allow specific authorized system function names
  IF process_type IN (
    'analyze_user_behavior',
    'assess_device_security_risk', 
    'detect_advanced_threats',
    'log_compliance_audit',
    'military_security_engine',
    'enhanced_auth_security',
    'security_monitor',
    'security_monitoring',
    'network_security',
    'audit_logging',
    'behavior_patterns',
    'behavioral_analytics'
  ) THEN
    -- Only service_role or super_admin can be a valid system process
    IF current_setting('request.jwt.role', TRUE) = 'service_role' THEN
      is_valid_source := TRUE;
    ELSIF auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    ) THEN
      is_valid_source := TRUE;
    END IF;
  END IF;

  RETURN is_valid_source;
END;
$$;

-- 2. Fix user_behavior_patterns: drop the policy that allows auth.uid() IS NULL
DROP POLICY IF EXISTS "System can manage behavior patterns" ON public.user_behavior_patterns;

-- 3. Fix security_alerts: drop the policy that allows auth.uid() IS NULL inserts
DROP POLICY IF EXISTS "System can insert security alerts" ON public.security_alerts;
CREATE POLICY "Service role or admins can insert security alerts"
  ON public.security_alerts FOR INSERT
  WITH CHECK (
    current_setting('request.jwt.role', true) = 'service_role'
    OR is_admin(auth.uid())
  );

-- 4. Fix processing_jobs: restrict read to admin roles only
DROP POLICY IF EXISTS "Authenticated users can read jobs" ON public.processing_jobs;
CREATE POLICY "Admins can read processing jobs"
  ON public.processing_jobs FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));
