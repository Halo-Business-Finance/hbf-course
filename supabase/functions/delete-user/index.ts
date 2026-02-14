import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders 
} from '../_shared/corsHelper.ts';
import { sanitizeError } from '../_shared/errorSanitizer.ts';

// UUID validation pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  const securityHeaders = getSecurityHeaders(req);

  try {
    // Verify this is a POST request
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed', code: 'ERR_405' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 405 }
      );
    }

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required', code: 'ERR_401' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request format', code: 'ERR_400' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (typeof body !== 'object' || body === null) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request format', code: 'ERR_400' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { userId, currentUserId } = body as Record<string, unknown>;

    // Validate userId is a valid UUID
    if (!userId || typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request parameters', code: 'ERR_400' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate currentUserId is a valid UUID
    if (!currentUserId || typeof currentUserId !== 'string' || !UUID_PATTERN.test(currentUserId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request parameters', code: 'ERR_400' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === currentUserId) {
      return new Response(
        JSON.stringify({ success: false, error: 'This operation is not permitted', code: 'ERR_403' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Create regular client to verify permissions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Verify the caller's identity matches currentUserId
    const { data: { user: callerUser } } = await supabase.auth.getUser();
    if (!callerUser || callerUser.id !== currentUserId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication mismatch', code: 'ERR_403' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Verify current user can delete the target user using secure function
    const { data: canDelete, error: roleError } = await supabase
      .rpc('can_delete_user', { target_user_id: userId });

    if (roleError || !canDelete) {
      return new Response(
        JSON.stringify({ success: false, error: 'Insufficient permissions', code: 'ERR_403' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Delete the user from Supabase Auth (don't check existence separately to prevent enumeration)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      // Generic error - don't reveal whether user existed
      return new Response(
        JSON.stringify({ success: false, error: 'Operation failed. Please try again.', code: 'ERR_500' }),
        { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully'
        // Don't return deleted user details to prevent information leakage
      }),
      { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: sanitizeError(error),
        code: 'ERR_500'
      }),
      { headers: { ...securityHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
