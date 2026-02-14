import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders,
  validateOrigin,
  createSecureErrorResponse
} from '../_shared/corsHelper.ts';
import { sanitizeError, logErrorServerSide } from '../_shared/errorSanitizer.ts';

serve(async (req) => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const originError = validateOrigin(req);
  if (originError) return originError;

  const securityHeaders = { ...getSecurityHeaders(req), 'Content-Type': 'application/json' };

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

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
    if (!['admin', 'super_admin'].includes(userRole)) {
      return createSecureErrorResponse(req, 'Admin privileges required', 403, 'ERR_403');
    }
    // ===== END AUTHENTICATION CHECK =====

    const { action } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    let response;

    switch (action) {
      case 'get_security_alerts': {
        const { data: alerts, error: alertsError } = await supabase
          .from('security_alerts')
          .select('*')
          .eq('is_resolved', false)
          .order('created_at', { ascending: false })
          .limit(50);
        if (alertsError) throw new Error('Failed to fetch alerts');
        response = { alerts: alerts || [] };
        break;
      }

      case 'resolve_alert': {
        const { alertId, resolvedBy } = await req.json();
        if (!alertId) throw new Error('Alert ID is required');
        const { error: resolveError } = await supabase
          .from('security_alerts')
          .update({ is_resolved: true, resolved_at: new Date().toISOString(), resolved_by: resolvedBy || user.id, updated_at: new Date().toISOString() })
          .eq('id', alertId);
        if (resolveError) throw new Error('Failed to resolve alert');
        response = { success: true, message: 'Alert resolved successfully' };
        break;
      }

      case 'analyze_security_events': {
        const { error: analysisError } = await supabase.rpc('analyze_security_events');
        if (analysisError) throw new Error('Security analysis failed');
        response = { success: true, message: 'Security analysis completed' };
        break;
      }

      case 'get_security_dashboard': {
        const [alertsResult, eventsResult, rateLimitsResult] = await Promise.allSettled([
          supabase.from('security_alerts').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(50),
          supabase.from('rate_limit_attempts').select('*').eq('is_blocked', true).order('created_at', { ascending: false }).limit(20)
        ]);

        response = {
          alerts: alertsResult.status === 'fulfilled' ? alertsResult.value.data || [] : [],
          recent_events: eventsResult.status === 'fulfilled' ? eventsResult.value.data || [] : [],
          blocked_ips: rateLimitsResult.status === 'fulfilled' ? rateLimitsResult.value.data || [] : [],
          dashboard_generated_at: new Date().toISOString()
        };
        break;
      }

      case 'create_test_alert': {
        const { data: testAlert, error: testError } = await supabase
          .rpc('create_security_alert', {
            p_alert_type: 'test_alert',
            p_severity: 'low',
            p_title: 'Test Security Alert',
            p_description: 'This is a test alert to verify the security monitoring system is working correctly.',
            p_metadata: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
          });
        if (testError) throw new Error('Failed to create test alert');
        response = { success: true, message: 'Test alert created successfully', alert_id: testAlert };
        break;
      }

      default:
        throw new Error('Invalid action specified');
    }

    return new Response(
      JSON.stringify({ success: true, data: response, timestamp: new Date().toISOString() }),
      { headers: securityHeaders, status: 200 }
    );

  } catch (error: any) {
    logErrorServerSide('security-monitor', error);
    return new Response(
      JSON.stringify({ success: false, error: sanitizeError(error), timestamp: new Date().toISOString() }),
      { headers: { ...getSecurityHeaders(req), 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
