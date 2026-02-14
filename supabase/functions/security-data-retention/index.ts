import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders,
  validateOrigin,
  createSecureJsonResponse,
  createSecureErrorResponse
} from '../_shared/corsHelper.ts';
import { logErrorServerSide } from '../_shared/errorSanitizer.ts';

serve(async (req) => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const originError = validateOrigin(req);
  if (originError) return originError;

  const headers = { ...getSecurityHeaders(req), 'Content-Type': 'application/json' };

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createSecureErrorResponse(req, 'Authentication required', 401, 'ERR_401');
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return createSecureErrorResponse(req, 'Invalid or expired authentication token', 401, 'ERR_401');
    }

    const { data: userRole } = await authClient.rpc('get_user_role');
    if (userRole !== 'super_admin') {
      return createSecureErrorResponse(req, 'Super admin privileges required for data retention operations', 403, 'ERR_403');
    }
    // ===== END AUTHENTICATION CHECK =====

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    logErrorServerSide('security-data-retention', 'Starting automated data retention cleanup...');

    const { data, error } = await supabaseClient.rpc('cleanup_old_behavioral_data');

    if (error) {
      logErrorServerSide('security-data-retention', error);
      throw error;
    }

    // Clean up old rate limit entries
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const { error: rateLimitError } = await supabaseClient
      .from('lead_submission_rate_limits')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (rateLimitError) logErrorServerSide('security-data-retention', rateLimitError);

    const { error: advancedRateLimitError } = await supabaseClient
      .from('advanced_rate_limits')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (advancedRateLimitError) logErrorServerSide('security-data-retention', advancedRateLimitError);

    // Log the successful cleanup
    const { error: logError } = await supabaseClient
      .from('security_events')
      .insert({
        event_type: 'automated_data_retention_completed',
        severity: 'low',
        user_id: user.id,
        details: {
          cleanup_timestamp: new Date().toISOString(),
          cleanup_type: 'scheduled_retention',
          automated: true,
          gdpr_compliant: true,
          rate_limit_cleanup: true
        },
        logged_via_secure_function: true
      });

    if (logError) logErrorServerSide('security-data-retention', logError);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data retention cleanup completed successfully',
        timestamp: new Date().toISOString()
      }),
      { headers }
    )

  } catch (error) {
    logErrorServerSide('security-data-retention', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Data retention cleanup failed',
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...getSecurityHeaders(req), 'Content-Type': 'application/json' } }
    )
  }
})
