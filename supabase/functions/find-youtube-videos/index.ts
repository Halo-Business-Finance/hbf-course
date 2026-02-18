import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
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
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY not configured');
    }

    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createSecureErrorResponse(req, 'Authentication required', 401, 'ERR_401');
    }

    const authClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return createSecureErrorResponse(req, 'Invalid or expired authentication token', 401, 'ERR_401');
    }

    const { data: userRole } = await authClient.rpc('get_user_role');
    if (!['admin', 'super_admin', 'instructor'].includes(userRole)) {
      return createSecureErrorResponse(req, 'Admin privileges required', 403, 'ERR_403');
    }
    // ===== END AUTHENTICATION CHECK =====

    const body = await req.json().catch(() => ({}));
    const courseIdFilter = body?.course_id;
    const limit = body?.limit || null;

    logErrorServerSide('find-youtube-videos', `Starting search, course: ${courseIdFilter}, limit: ${limit}`);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    let query = supabase
      .from('course_content_modules')
      .select('id, title, description, course_id')
      .eq('is_active', true)
      .order('order_index');

    if (courseIdFilter) query = query.eq('course_id', courseIdFilter);
    if (limit) query = query.limit(limit);

    const { data: modules, error: modulesError } = await query;

    if (modulesError) throw modulesError;

    const results = [];

    // Track used YouTube IDs to prevent duplicate videos across modules
    const usedYoutubeIds = new Set<string>();

    // Pre-load already-used YouTube IDs from DB
    const { data: existingVideos } = await supabase
      .from('course_videos')
      .select('youtube_id, module_id')
      .not('youtube_id', 'is', null);

    for (const ev of existingVideos || []) {
      if (ev.youtube_id) usedYoutubeIds.add(ev.youtube_id);
    }

    // Helper to build a hyper-specific YouTube search query from the module
    const buildSearchQuery = (moduleTitle: string, description: string | null): string => {
      // Extract the most meaningful keywords from the title
      // Remove generic words that won't help narrow results
      const stopWords = new Set(['and', 'or', 'the', 'a', 'an', 'of', 'in', 'for', 'to', 'with', 'how', 'what', 'why', 'when', 'is', 'are', 'be', 'by', 'on', 'at', 'it']);
      
      const titleWords = moduleTitle
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .split(' ')
        .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
        .slice(0, 6)
        .join(' ');

      // Pull unique subject keywords from description
      const descKeywords = description
        ? description
            .replace(/[^a-zA-Z0-9 ]/g, ' ')
            .split(' ')
            .filter(w => w.length > 4 && !stopWords.has(w.toLowerCase()))
            .slice(0, 4)
            .join(' ')
        : '';

      // Determine domain context from the title for sharper results
      const titleLower = moduleTitle.toLowerCase();
      let domainContext = 'finance training';
      if (titleLower.includes('sba')) domainContext = 'SBA loan banker training';
      else if (titleLower.includes('commercial real estate') || titleLower.includes('cre')) domainContext = 'commercial real estate loan';
      else if (titleLower.includes('construction')) domainContext = 'construction loan lending';
      else if (titleLower.includes('equipment')) domainContext = 'equipment financing loan';
      else if (titleLower.includes('invoice') || titleLower.includes('factoring')) domainContext = 'invoice factoring business finance';
      else if (titleLower.includes('merchant cash')) domainContext = 'merchant cash advance business';
      else if (titleLower.includes('working capital')) domainContext = 'working capital loan business';
      else if (titleLower.includes('asset')) domainContext = 'asset based lending finance';
      else if (titleLower.includes('bridge')) domainContext = 'bridge loan real estate';
      else if (titleLower.includes('franchise')) domainContext = 'franchise financing loan';
      else if (titleLower.includes('healthcare')) domainContext = 'healthcare business financing';
      else if (titleLower.includes('restaurant')) domainContext = 'restaurant business loan';
      else if (titleLower.includes('underwriting') || titleLower.includes('credit')) domainContext = 'commercial credit underwriting';
      else if (titleLower.includes('compliance')) domainContext = 'lending compliance banking';
      else if (titleLower.includes('financial analysis')) domainContext = 'financial statement analysis banking';
      else if (titleLower.includes('term loan')) domainContext = 'business term loan commercial';
      else if (titleLower.includes('line of credit')) domainContext = 'business line of credit';

      return `${titleWords} ${domainContext} ${descKeywords}`.trim().replace(/\s+/g, ' ');
    };

    for (const module of modules || []) {
      try {
        const specificQuery = buildSearchQuery(module.title, module.description);
        const searchQuery = encodeURIComponent(specificQuery);
        
        // Request more results so we can skip duplicates
        const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchQuery}&type=video&key=${YOUTUBE_API_KEY}`;

        const youtubeResponse = await fetch(youtubeSearchUrl);
        
        if (!youtubeResponse.ok) {
          results.push({ module_id: module.id, title: module.title, status: 'error', error: 'YouTube API request failed' });
          continue;
        }

        const youtubeData = await youtubeResponse.json();

        if (!youtubeData.items || youtubeData.items.length === 0) {
          results.push({ module_id: module.id, title: module.title, status: 'no_results' });
          continue;
        }

        // Pick the first result that hasn't been used by another module
        const uniqueVideo = youtubeData.items.find((item: any) => !usedYoutubeIds.has(item.id.videoId));

        if (!uniqueVideo) {
          results.push({ module_id: module.id, title: module.title, status: 'no_unique_results' });
          continue;
        }

        const video = uniqueVideo;
        const videoId = video.id.videoId;
        // Mark this ID as used so subsequent modules don't reuse it
        usedYoutubeIds.add(videoId);
        const videoTitle = video.snippet.title;
        const videoDescription = video.snippet.description;
        const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url;

        const { data: existingVideo } = await supabase
          .from('course_videos')
          .select('id')
          .eq('module_id', module.id)
          .single();

        if (existingVideo) {
          const { error: updateError } = await supabase
            .from('course_videos')
            .update({ youtube_id: videoId, video_url: `https://www.youtube.com/watch?v=${videoId}`, title: videoTitle, description: videoDescription, thumbnail_url: thumbnailUrl, video_type: 'youtube', is_active: true, updated_at: new Date().toISOString() })
            .eq('id', existingVideo.id);

          results.push({ module_id: module.id, title: module.title, video_id: videoId, video_title: videoTitle, status: updateError ? 'error' : 'updated', ...(updateError ? { error: 'Update failed' } : {}) });
        } else {
          const { error: insertError } = await supabase
            .from('course_videos')
            .insert({ module_id: module.id, youtube_id: videoId, video_url: `https://www.youtube.com/watch?v=${videoId}`, title: videoTitle, description: videoDescription, thumbnail_url: thumbnailUrl, video_type: 'youtube', is_active: true, order_index: 0 });

          results.push({ module_id: module.id, title: module.title, video_id: videoId, video_title: videoTitle, status: insertError ? 'error' : 'created', ...(insertError ? { error: 'Insert failed' } : {}) });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        logErrorServerSide('find-youtube-videos', error);
        results.push({ module_id: module.id, title: module.title, status: 'error', error: 'Processing failed' });
      }
    }

    const summary = {
      total: results.length,
      created: results.filter(r => r.status === 'created').length,
      updated: results.filter(r => r.status === 'updated').length,
      errors: results.filter(r => r.status === 'error').length,
      no_results: results.filter(r => r.status === 'no_results').length,
      no_unique_results: results.filter(r => r.status === 'no_unique_results').length
    };

    return new Response(JSON.stringify({ success: true, summary, results }), { headers, status: 200 });

  } catch (error) {
    logErrorServerSide('find-youtube-videos', error);
    return new Response(JSON.stringify({ error: sanitizeError(error), success: false }), { headers, status: 500 });
  }
});
