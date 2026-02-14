import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders,
  validateOrigin,
  createSecureJsonResponse,
  createSecureErrorResponse
} from '../_shared/corsHelper.ts';
import { sanitizeError, logErrorServerSide } from '../_shared/errorSanitizer.ts';

serve(async (req) => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const originError = validateOrigin(req);
  if (originError) return originError;

  const headers = { ...getSecurityHeaders(req), 'Content-Type': 'application/json' };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createSecureErrorResponse(req, 'Authentication required', 401, 'ERR_401');
    }

    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return createSecureErrorResponse(req, 'Invalid authentication', 401, 'ERR_401');
    }

    const user_id = user.id;
    const { ip_address, user_agent } = await req.json();

    if (!ip_address) {
      return createSecureErrorResponse(req, 'Missing required parameter: ip_address', 400, 'ERR_VALIDATION');
    }

    // Get geographic data from IP
    let locationData: Record<string, unknown> = {};
    let deviceData = {
      user_agent: user_agent || 'Unknown',
      device_type: getDeviceType(user_agent || ''),
      browser: getBrowser(user_agent || ''),
      timestamp: new Date().toISOString()
    };

    try {
      const locationResponse = await fetch(`https://ipapi.co/${ip_address}/json/`);
      if (locationResponse.ok) {
        const ipData = await locationResponse.json();
        locationData = {
          country: ipData.country_name,
          country_code: ipData.country_code,
          region: ipData.region,
          city: ipData.city,
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          timezone: ipData.timezone,
          isp: ipData.org,
          is_vpn: ipData.threat?.is_anonymous || false
        };
      } else {
        locationData = { country: 'Unknown', region: 'Unknown', city: 'Unknown', is_vpn: false };
      }
    } catch (_error) {
      locationData = { country: 'Unknown', region: 'Unknown', city: 'Unknown', is_vpn: false };
    }

    // Store login location
    const { data: loginLocation, error: locationError } = await supabase
      .from('login_locations')
      .insert({
        user_id,
        ip_address,
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone,
        isp: locationData.isp,
        is_vpn: locationData.is_vpn,
        is_known_location: false
      })
      .select()
      .single();

    if (locationError) {
      throw new Error('Failed to store location data');
    }

    // Run anomaly detection
    const { data: anomalyResult } = await supabase.rpc('detect_login_anomaly', {
      p_user_id: user_id,
      p_ip_address: ip_address,
      p_location_data: locationData,
      p_device_data: deviceData
    });

    // Update user baseline (async)
    supabase.rpc('update_user_baseline', {
      p_user_id: user_id,
      p_location_data: locationData,
      p_device_data: deviceData
    }).then(({ error }) => {
      if (error) { /* Silent - baseline update is non-critical */ }
    });

    // Log successful authentication
    await supabase.rpc('log_successful_auth', {
      auth_type: 'geographic_tracked_login',
      user_email: null
    });

    return createSecureJsonResponse(req, {
      success: true,
      location_data: locationData,
      device_data: deviceData,
      anomaly_detection: anomalyResult,
      login_location_id: loginLocation?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logErrorServerSide('geographic-location-tracker', error);
    return new Response(JSON.stringify({ 
      error: sanitizeError(error),
      success: false 
    }), { status: 500, headers });
  }
});

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  return 'Unknown';
}
