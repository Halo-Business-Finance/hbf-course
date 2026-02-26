import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, StickyNote, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  const [video, setVideo] = useState<ModuleVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      // Try to find a video for this module from the course_videos table
      const lookupId = moduleId || lesson.id;
      const { data, error } = await supabase
        .from('course_videos')
        .select('id, title, video_url, video_type, youtube_id, description, duration_seconds')
        .eq('module_id', lookupId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(1);

      console.log('EnhancedVideoSection query for moduleId:', lookupId, 'result:', data, 'error:', error);

      if (!error && data && data.length > 0) {
        setVideo(data[0]);
      }
      setLoading(false);
    };
    fetchVideo();
  }, [moduleId, lesson.id]);

  const youtubeId = video?.youtube_id || null;
  const videoUrl = youtubeId 
    ? `https://www.youtube.com/embed/${youtubeId}` 
    : video?.video_url || '';
  const videoType = (video?.video_type || 'youtube') as 'youtube' | 'file';

  return (
    <div className="space-y-6">
      <Card className="jp-card-elegant">
        <CardHeader>
          <CardTitle className="jp-heading text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Instructional Video: {video?.title || lesson.title}
            </div>
            <Badge className="bg-gradient-primary text-primary-foreground">
              HD Quality
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : youtubeId || video?.video_url ? (
              <VideoPlayer 
                title={video?.title || lesson.title}
                videoType={videoType}
                videoUrl={videoUrl}
                youtubeId={youtubeId || undefined}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <Play className="h-12 w-12" />
                <p className="text-sm">No video available for this module yet.</p>
              </div>
            )}
          </div>
          
          {video?.description && (
            <p className="text-sm text-muted-foreground">{video.description}</p>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Video Length</h5>
              <p className="jp-body font-semibold text-primary">{lesson.duration}</p>
            </div>
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Quality</h5>
              <p className="jp-body font-semibold text-primary">1080p HD</p>
            </div>
            <div className="jp-card p-4">
              <h5 className="jp-subheading mb-2">Captions</h5>
              <p className="jp-body font-semibold text-primary">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="jp-card">
          <CardHeader>
            <CardTitle className="jp-heading text-foreground">Learning Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Closed captions and transcripts", "Bookmark important moments", "Variable playback speed", "Mobile-optimized viewing"].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="jp-body text-sm">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="jp-card bg-gradient-to-br from-primary/5 to-muted/50">
          <CardHeader>
            <CardTitle className="jp-heading text-foreground">Study Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="jp-body text-sm">
              <strong>Active Learning:</strong> Take notes during key concepts and pause to reflect on applications.
            </p>
            <p className="jp-body text-sm">
              <strong>Review Strategy:</strong> Revisit complex sections using the video controls.
            </p>
            <p className="jp-body text-sm">
              <strong>Practice Ready:</strong> Have a calculator ready for financial examples.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
