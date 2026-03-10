import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { 
  handleCorsPreflightRequest, 
  getSecurityHeaders,
  validateOrigin,
  createSecureErrorResponse
} from '../_shared/corsHelper.ts';
import { sanitizeError, logErrorServerSide } from '../_shared/errorSanitizer.ts';

const BLOCKLIST_KEYWORDS = [
  'psychometric', 'interview question', 'job interview', 'resume', 'cv tips',
  'crypto', 'bitcoin', 'bybit', 'futures trading', 'stock market', 'forex',
  'excel tutorial', 'progress tracker', 'excel sheet', 'staffing firm',
  'corporate finance intro', 'cooking', 'fitness', 'gaming', 'vlog',
  'motivational', 'self help', 'day in the life', 'loan officer life',
  'msnbc', 'news report', 'strong-arm', 'controversy', 'scandal',
  'real estate agent', 'house flipping', 'buy a house', 'mortgage for home',
  'personal finance', 'dave ramsey', 'debt free', 'budget tips'
];

const FINANCE_KEYWORDS = [
  'commercial lending', 'commercial loan', 'business loan', 'sba loan',
  'asset based lending', 'asset-based lending', 'invoice factoring',
  'merchant cash advance', 'working capital', 'equipment financing',
  'construction loan', 'bridge loan', 'commercial real estate', 'cre loan',
  'franchise financing', 'healthcare financing', 'restaurant financing',
  'term loan', 'line of credit', 'credit facility', 'underwriting',
  'loan underwriting', 'credit analysis', 'financial analysis', 'loan structuring',
  'loan officer', 'banker training', 'lending', 'borrower', 'collateral',
  'sba 7a', 'sba 504', 'sba express', 'small business finance',
  'debt service coverage', 'dscr', 'ltv', 'loan to value', 'due diligence',
  'credit risk', 'bank lending', 'commercial bank', 'finance training'
];

function isVideoRelevant(title: string, description: string): { dominated: boolean; relevant: boolean } {
  const combined = (title + ' ' + description).toLowerCase();
  for (const bad of BLOCKLIST_KEYWORDS) {
    if (combined.includes(bad.toLowerCase())) return { dominated: true, relevant: false };
  }
  for (const good of FINANCE_KEYWORDS) {
    if (combined.includes(good.toLowerCase())) return { dominated: false, relevant: true };
  }
  // Not blocklisted but no finance keyword — still acceptable as fallback
  return { dominated: false, relevant: false };
}

function buildSearchQuery(moduleTitle: string, description: string | null, courseId: string): string {
  const stopWords = new Set(['and','or','the','a','an','of','in','for','to','with','how','what','why','when','is','are','be','by','on','at','it','its','this','that','these','those','from','module','overview','fundamentals','beginner','expert','advanced','introduction','processing']);

  const titleWords = moduleTitle
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .slice(0, 6)
    .join(' ');

  const descWords = (description || '')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
    .slice(0, 4)
    .join(' ');

  const titleLower = moduleTitle.toLowerCase();
  const courseLower = courseId.toLowerCase();

  let domainContext = 'commercial lending training';

  if (titleLower.includes('sba') || courseLower.includes('sba')) {
    if (titleLower.includes('504')) domainContext = 'SBA 504 loan training banker';
    else if (titleLower.includes('express')) domainContext = 'SBA express loan training';
    else domainContext = 'SBA 7a loan training banker';
  } else if (titleLower.includes('commercial real estate') || courseLower.includes('commercial-real-estate')) {
    domainContext = 'commercial real estate loan underwriting';
  } else if (titleLower.includes('construction') || courseLower.includes('construction')) {
    domainContext = 'construction loan commercial lending';
  } else if (titleLower.includes('equipment') || courseLower.includes('equipment')) {
    domainContext = 'equipment financing business loan';
  } else if (titleLower.includes('invoice') || titleLower.includes('factoring') || courseLower.includes('invoice-factoring')) {
    domainContext = 'invoice factoring accounts receivable finance';
  } else if (titleLower.includes('merchant cash') || courseLower.includes('merchant-cash')) {
    domainContext = 'merchant cash advance small business';
  } else if (titleLower.includes('working capital') || courseLower.includes('working-capital')) {
    domainContext = 'working capital loan commercial finance';
  } else if (titleLower.includes('asset') || courseLower.includes('asset-based')) {
    domainContext = 'asset based lending ABL finance';
  } else if (titleLower.includes('bridge') || courseLower.includes('bridge-loan')) {
    domainContext = 'bridge loan commercial real estate finance';
  } else if (titleLower.includes('franchise') || courseLower.includes('franchise')) {
    domainContext = 'franchise financing business loan';
  } else if (titleLower.includes('healthcare') || courseLower.includes('healthcare')) {
    domainContext = 'healthcare practice financing business loan';
  } else if (titleLower.includes('restaurant') || courseLower.includes('restaurant')) {
    domainContext = 'restaurant business financing commercial loan';
  } else if (titleLower.includes('agriculture') || courseLower.includes('agriculture')) {
    domainContext = 'agricultural lending farm loan commercial';
  } else if (titleLower.includes('apartment') || titleLower.includes('multifamily') || courseLower.includes('apartment')) {
    domainContext = 'multifamily apartment loan underwriting';
  } else if (titleLower.includes('line of credit') || courseLower.includes('lines-credit')) {
    domainContext = 'business line of credit commercial lending';
  } else if (titleLower.includes('term loan') || courseLower.includes('term-loan')) {
    domainContext = 'business term loan commercial finance';
  } else if (titleLower.includes('underwriting')) {
    domainContext = 'commercial loan underwriting credit analysis';
  } else if (titleLower.includes('credit') || titleLower.includes('compliance')) {
    domainContext = 'commercial credit analysis banking';
  }

  const query = `${titleWords} ${descWords} ${domainContext}`.trim().replace(/\s+/g, ' ');
  return query.split(' ').slice(0, 12).join(' ');
}

// Build varied search queries for the same module to get diverse results
function buildSearchVariants(moduleTitle: string, description: string | null, courseId: string): string[] {
  const base = buildSearchQuery(moduleTitle, description, courseId);
  const titleLower = moduleTitle.toLowerCase();
  
  const variants = [base];
  
  // Add topic-specific variants
  if (titleLower.includes('fundamentals') || titleLower.includes('overview')) {
    variants.push(`${base} explained basics`);
    variants.push(`${base} training course tutorial`);
  } else if (titleLower.includes('underwriting') || titleLower.includes('analysis')) {
    variants.push(`${base} process walkthrough`);
    variants.push(`${base} case study example`);
  } else if (titleLower.includes('compliance') || titleLower.includes('regulatory')) {
    variants.push(`${base} requirements guidelines`);
    variants.push(`${base} best practices audit`);
  } else if (titleLower.includes('structuring') || titleLower.includes('product')) {
    variants.push(`${base} deal structure`);
    variants.push(`${base} pricing terms`);
  } else {
    variants.push(`${base} explained tutorial`);
    variants.push(`${base} professional training`);
  }
  
  // Add a general lending variant
  variants.push(`${moduleTitle} commercial banking training`);
  
  return variants.slice(0, 4); // max 4 search queries per module
}

// Parse ISO 8601 duration (PT#H#M#S) to seconds
function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

// Fetch actual video durations from YouTube Data API
async function fetchVideoDurations(videoIds: string[], apiKey: string): Promise<Map<string, number>> {
  const durations = new Map<string, number>();
  // YouTube API allows up to 50 IDs per request
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(',')}&key=${apiKey}`;
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        for (const item of data.items || []) {
          durations.set(item.id, parseDuration(item.contentDetails.duration));
        }
      }
    } catch {
      // Continue with what we have
    }
  }
  return durations;
}

const TARGET_DURATION_SECONDS = 3600; // 60 minutes target per module

async function processVideoSearch(
  jobId: string, 
  courseIdFilter: string | null, 
  searchLimit: number | null,
  youtubeApiKey: string,
  supabaseUrl: string,
  serviceRoleKey: string
) {
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    let query = supabase
      .from('course_content_modules')
      .select('id, title, description, course_id')
      .eq('is_active', true)
      .order('course_id')
      .order('order_index');

    if (courseIdFilter) query = query.eq('course_id', courseIdFilter);
    if (searchLimit) query = query.limit(searchLimit);

    const { data: modules, error: modulesError } = await query;
    if (modulesError) throw modulesError;

    const moduleIds = (modules || []).map(m => m.id);
    await supabase.from('processing_jobs').update({ total: moduleIds.length }).eq('id', jobId);

    // Delete existing videos for targeted modules
    if (moduleIds.length > 0) {
      await supabase.from('course_videos').delete().in('module_id', moduleIds);
    }

    // Pre-load existing youtube_ids to prevent duplicates
    const usedYoutubeIds = new Set<string>();
    const { data: existingVideos } = await supabase
      .from('course_videos')
      .select('youtube_id')
      .not('youtube_id', 'is', null);
    
    if (existingVideos) {
      for (const v of existingVideos) {
        if (v.youtube_id) usedYoutubeIds.add(v.youtube_id);
      }
    }

    const results: any[] = [];
    let processed = 0;

    for (const mod of modules || []) {
      try {
        const searchVariants = buildSearchVariants(mod.title, mod.description, mod.course_id);
        let totalDurationForModule = 0;
        const moduleVideos: any[] = [];
        let orderIndex = 0;

        // Search with multiple query variants to get enough videos for 60+ min
        for (const searchQuery of searchVariants) {
          if (totalDurationForModule >= TARGET_DURATION_SECONDS) break;

          const encodedQuery = encodeURIComponent(searchQuery);
          const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodedQuery}&type=video&videoDuration=medium&relevanceLanguage=en&key=${youtubeApiKey}`;

          const youtubeResponse = await fetch(youtubeSearchUrl);
          if (!youtubeResponse.ok) continue;

          const youtubeData = await youtubeResponse.json();
          if (!youtubeData.items || youtubeData.items.length === 0) continue;

          // Filter to relevant, unused videos
          const candidateIds: string[] = [];
          const candidateMap = new Map<string, any>();
          
          for (const item of youtubeData.items) {
            const videoId = item.id?.videoId;
            if (!videoId || usedYoutubeIds.has(videoId)) continue;
            if (isVideoRelevant(item.snippet?.title || '', item.snippet?.description || '')) {
              candidateIds.push(videoId);
              candidateMap.set(videoId, item);
            }
          }

          // Also add non-blocklisted as fallbacks
          for (const item of youtubeData.items) {
            const videoId = item.id?.videoId;
            if (!videoId || usedYoutubeIds.has(videoId) || candidateMap.has(videoId)) continue;
            const combined = ((item.snippet?.title || '') + ' ' + (item.snippet?.description || '')).toLowerCase();
            const blocked = BLOCKLIST_KEYWORDS.some(bad => combined.includes(bad.toLowerCase()));
            if (!blocked) {
              candidateIds.push(videoId);
              candidateMap.set(videoId, item);
            }
          }

          if (candidateIds.length === 0) continue;

          // Fetch actual durations
          const durations = await fetchVideoDurations(candidateIds, youtubeApiKey);

          // Pick videos until we reach target duration
          for (const videoId of candidateIds) {
            if (totalDurationForModule >= TARGET_DURATION_SECONDS) break;
            
            const duration = durations.get(videoId) || 0;
            // Skip very short videos (< 2 min) or very long (> 60 min)
            if (duration < 120 || duration > 3600) continue;

            const item = candidateMap.get(videoId)!;
            usedYoutubeIds.add(videoId);

            moduleVideos.push({
              module_id: mod.id,
              youtube_id: videoId,
              video_url: `https://www.youtube.com/watch?v=${videoId}`,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              video_type: 'youtube',
              is_active: true,
              order_index: orderIndex,
              duration_seconds: duration,
            });
            
            totalDurationForModule += duration;
            orderIndex++;
          }

          // Small delay to avoid YouTube API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Insert all videos for this module
        if (moduleVideos.length > 0) {
          const { error: insertError } = await supabase.from('course_videos').insert(moduleVideos);

          results.push({
            module_id: mod.id,
            title: mod.title,
            videos_added: moduleVideos.length,
            total_duration_seconds: totalDurationForModule,
            total_duration_display: `${Math.floor(totalDurationForModule / 60)}m`,
            status: insertError ? 'error' : 'created',
          });
        } else {
          results.push({ module_id: mod.id, title: mod.title, status: 'no_results', videos_added: 0 });
        }

        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        results.push({ module_id: mod.id, title: mod.title, status: 'error', error: 'Processing failed' });
      }

      processed++;
      if (processed % 3 === 0 || processed === moduleIds.length) {
        await supabase.from('processing_jobs').update({ 
          progress: processed, 
          updated_at: new Date().toISOString() 
        }).eq('id', jobId);
      }
    }

    const summary = {
      total: results.length,
      created: results.filter(r => r.status === 'created').length,
      total_videos: results.reduce((sum, r) => sum + (r.videos_added || 0), 0),
      errors: results.filter(r => r.status === 'error').length,
      no_results: results.filter(r => r.status === 'no_results').length,
    };

    await supabase.from('processing_jobs').update({
      status: 'complete',
      progress: processed,
      result: { summary, results },
      updated_at: new Date().toISOString()
    }).eq('id', jobId);

  } catch (error) {
    logErrorServerSide('find-youtube-videos-bg', error);
    await supabase.from('processing_jobs').update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      updated_at: new Date().toISOString()
    }).eq('id', jobId);
  }
}

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

    if (!YOUTUBE_API_KEY) throw new Error('YOUTUBE_API_KEY not configured');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createSecureErrorResponse(req, 'Authentication required', 401, 'ERR_401');
    }

    const authClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return createSecureErrorResponse(req, 'Invalid or expired authentication token', 401, 'ERR_401');
    }

    const { data: userRole } = await authClient.rpc('get_user_role');
    if (!['admin', 'super_admin', 'instructor'].includes(userRole)) {
      return createSecureErrorResponse(req, 'Admin privileges required', 403, 'ERR_403');
    }

    const body = await req.json().catch(() => ({}));
    const courseIdFilter = body?.course_id || null;
    const limit = body?.limit || null;

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: job, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({ job_type: 'video_search', status: 'processing', progress: 0 })
      .select()
      .single();

    if (jobError || !job) throw new Error('Failed to create processing job');

    EdgeRuntime.waitUntil(
      processVideoSearch(job.id, courseIdFilter, limit, YOUTUBE_API_KEY, SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
        .catch(async (error) => {
          logErrorServerSide('find-youtube-videos', error);
          await supabase.from('processing_jobs').update({ 
            status: 'failed', 
            error: error.message 
          }).eq('id', job.id);
        })
    );

    return new Response(JSON.stringify({ 
      success: true, 
      job_id: job.id, 
      message: 'Video search started — targeting 60+ minutes per module' 
    }), { headers, status: 200 });

  } catch (error) {
    logErrorServerSide('find-youtube-videos', error);
    return new Response(JSON.stringify({ error: sanitizeError(error), success: false }), { headers, status: 500 });
  }
});
