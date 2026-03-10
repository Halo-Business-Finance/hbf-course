import { useState, useEffect } from "react";
import { Play, Loader2, Clock, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedVideoSectionProps {
  lesson: {
    id: string;
    title: string;
    duration: string;
  };
  moduleTitle: string;
  moduleId?: string;
  onNotesTake: () => void;
  notesCount: number;
}

interface ModuleVideo {
  id: string;
  title: string;
  video_url: string;
  video_type: string;
  youtube_id: string | null;
  description: string | null;
  duration_seconds: number | null;
}

export const EnhancedVideoSection = ({ 
  lesson, 
  moduleTitle,
  moduleId,
  onNotesTake, 
  notesCount 
}: EnhancedVideoSectionProps) => {
  const [videos, setVideos] = useState<ModuleVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const lookupId = moduleId || lesson.id;
      const { data, error } = await supabase
        .from('course_videos')
        .select('id, title, video_url, video_type, youtube_id, description, duration_seconds')
        .eq('module_id', lookupId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        setVideos(data);
      }
      setLoading(false);
    };
    fetchVideos();

    // Load completed videos from localStorage
    const saved = localStorage.getItem(`module_videos_completed_${moduleId || lesson.id}`);
    if (saved) {
      setCompletedVideos(new Set(JSON.parse(saved)));
    }
  }, [moduleId, lesson.id]);

  const markVideoCompleted = (videoId: string) => {
    setCompletedVideos(prev => {
      const next = new Set(prev);
      next.add(videoId);
      localStorage.setItem(
        `module_videos_completed_${moduleId || lesson.id}`,
        JSON.stringify([...next])
      );
      return next;
    });
    // Auto-advance to next unwatched video
    if (activeVideoIndex < videos.length - 1) {
      setActiveVideoIndex(activeVideoIndex + 1);
    }
  };

  const totalDuration = videos.reduce((sum, v) => sum + (v.duration_seconds || 0), 0);
  const watchedDuration = videos
    .filter(v => completedVideos.has(v.id))
    .reduce((sum, v) => sum + (v.duration_seconds || 0), 0);
  // Require watching all available content, capped at 60 minutes
  const requiredMinutes = Math.min(60, Math.max(1, Math.ceil(totalDuration / 60)));
  const progressPercent = requiredMinutes > 0 ? Math.round((Math.floor(watchedDuration / 60) / requiredMinutes) * 100) : 0;
  const watchedMinutes = Math.floor(watchedDuration / 60);
  const meetsRequirement = watchedMinutes >= requiredMinutes;

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const activeVideo = videos[activeVideoIndex] || null;
  const youtubeId = activeVideo?.youtube_id || null;
  const videoUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : activeVideo?.video_url || '';
  const videoType = (activeVideo?.video_type || 'youtube') as 'youtube' | 'file';

  return (
    <div className="space-y-6">
      <Card className="jp-card-elegant">
        <CardHeader>
          <CardTitle className="jp-heading text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Instructional Videos: {moduleTitle}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={meetsRequirement ? "default" : "secondary"} className={meetsRequirement ? "bg-green-600 text-white" : ""}>
                {watchedMinutes}/{requiredMinutes} min watched
              </Badge>
              <Badge className="bg-gradient-primary text-primary-foreground">
                {videos.length} Videos
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress toward 60-min requirement */}
          {videos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Video requirement progress
                </span>
                <span className={`font-semibold ${meetsRequirement ? 'text-green-600' : 'text-primary'}`}>
                  {meetsRequirement ? '✓ Requirement met!' : `${requiredMinutes - watchedMinutes} min remaining`}
                </span>
              </div>
              <Progress value={Math.min(progressPercent, 100)} />
            </div>
          )}

          {/* Video player */}
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : activeVideo ? (
              <VideoPlayer 
                title={activeVideo.title}
                videoType={videoType}
                videoUrl={videoUrl}
                youtubeId={youtubeId || undefined}
                onComplete={() => markVideoCompleted(activeVideo.id)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <Play className="h-12 w-12" />
                <p className="text-sm">No video available for this module yet.</p>
              </div>
            )}
          </div>

          {activeVideo?.description && (
            <p className="text-sm text-muted-foreground">{activeVideo.description}</p>
          )}

          {/* Mark as watched button */}
          {activeVideo && !completedVideos.has(activeVideo.id) && (
            <button
              onClick={() => markVideoCompleted(activeVideo.id)}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as watched
            </button>
          )}

          {/* Video playlist */}
          {videos.length > 1 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="font-medium text-sm">
                  Playlist ({completedVideos.size}/{videos.length} completed)
                </span>
                {showPlaylist ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showPlaylist && (
                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  {videos.map((video, index) => {
                    const isActive = index === activeVideoIndex;
                    const isCompleted = completedVideos.has(video.id);
                    return (
                      <button
                        key={video.id}
                        onClick={() => setActiveVideoIndex(index)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                          isActive ? 'bg-primary/10 border-l-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : isActive ? (
                            <Play className="h-4 w-4 text-primary fill-primary" />
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${isActive ? 'font-semibold text-primary' : 'text-foreground'}`}>
                            {video.title}
                          </p>
                        </div>
                        {video.duration_seconds && (
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDuration(video.duration_seconds)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Total Duration</h5>
              <p className="jp-body font-semibold text-primary">
                {totalDuration > 0 ? `${Math.floor(totalDuration / 60)} min` : lesson.duration}
              </p>
            </div>
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Videos Watched</h5>
              <p className="jp-body font-semibold text-primary">{completedVideos.size} / {videos.length}</p>
            </div>
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Time Watched</h5>
              <p className="jp-body font-semibold text-primary">{watchedMinutes} min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
