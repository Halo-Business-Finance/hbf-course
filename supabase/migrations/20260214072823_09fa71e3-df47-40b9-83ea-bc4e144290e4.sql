
-- Fix admin_audit_log: Make append-only and immutable
-- 1. Drop the overly permissive ALL policy for super_admins (allows UPDATE/DELETE)
DROP POLICY IF EXISTS "Only super admins can access audit logs" ON public.admin_audit_log;

-- 2. Create SELECT-only policy for super_admins (audit logs should be read-only)
CREATE POLICY "Super admins can read audit logs"
  ON public.admin_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'super_admin'
        AND user_roles.is_active = true
    )
  );

-- 3. Tighten INSERT policy: only service_role or verified admin functions can insert
DROP POLICY IF EXISTS "System can create audit entries" ON public.admin_audit_log;

CREATE POLICY "Only service role can create audit entries"
  ON public.admin_audit_log
  FOR INSERT
  WITH CHECK (
    current_setting('request.jwt.role', true) = 'service_role'
    OR is_admin(auth.uid())
  );

-- 4. Explicitly deny UPDATE on audit logs (immutability)
CREATE POLICY "No updates to audit logs"
  ON public.admin_audit_log
  FOR UPDATE
  USING (false);

-- 5. Explicitly deny DELETE on audit logs (immutability)
CREATE POLICY "No deletion of audit logs"
  ON public.admin_audit_log
  FOR DELETE
  USING (false);
