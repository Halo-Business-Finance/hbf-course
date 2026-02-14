import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders,
  validateOrigin,
  createSecureJsonResponse,
  createSecureErrorResponse
} from '../_shared/corsHelper.ts';
import { sanitizeError, logErrorServerSide } from '../_shared/errorSanitizer.ts';

Deno.serve(async (req) => {
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
    if (!['admin', 'super_admin'].includes(userRole)) {
      return createSecureErrorResponse(req, 'Admin privileges required', 403, 'ERR_403');
    }
    // ===== END AUTHENTICATION CHECK =====

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: mediaToMove, error: fetchError } = await supabase
      .from('cms_media')
      .select('*')
      .eq('folder_path', '/Course Media')
      .like('storage_path', 'imported/%')

    if (fetchError) throw fetchError

    const results = []

    for (const media of mediaToMove || []) {
      try {
        const oldPath = media.storage_path
        const newPath = oldPath.replace('imported/', 'Course Media/')
        
        const { data: copyData, error: copyError } = await supabase.storage
          .from('cms-media')
          .copy(oldPath, newPath)

        if (copyError) {
          logErrorServerSide('move-course-media', copyError);
          results.push({ id: media.id, status: 'copy_failed', error: 'Copy operation failed' })
          continue
        }

        const { error: deleteError } = await supabase.storage
          .from('cms-media')
          .remove([oldPath])

        if (deleteError) logErrorServerSide('move-course-media', deleteError);

        const { error: updateError } = await supabase
          .from('cms_media')
          .update({
            storage_path: newPath,
            public_url: `${SUPABASE_URL}/storage/v1/object/public/cms-media/${encodeURIComponent(newPath)}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', media.id)

        if (updateError) {
          logErrorServerSide('move-course-media', updateError);
          results.push({ id: media.id, status: 'db_update_failed', error: 'Database update failed' })
        } else {
          results.push({ id: media.id, status: 'success', oldPath, newPath })
        }

      } catch (error) {
        logErrorServerSide('move-course-media', error);
        results.push({ id: media.id, status: 'error', error: 'Processing failed' })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results, moved: results.filter(r => r.status === 'success').length }),
      { headers }
    )

  } catch (error) {
    logErrorServerSide('move-course-media', error);
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { headers: { ...getSecurityHeaders(req), 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
