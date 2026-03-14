import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, ArrowRight, Trophy, Star, Clock, BookOpen } from 'lucide-react';

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  courseId: string;
  certificateId?: string;
  totalModules: number;
  totalTimeSpent?: string;
  averageScore?: number;
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseName,
  courseId,
  certificateId,
  totalModules,
  totalTimeSpent = '—',
  averageScore,
}: CourseCompletionModalProps) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  const handleViewCertificate = () => {
    if (certificateId) {
      navigate(`/certificate/${certificateId}`);
      onClose();
    }
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.origin + `/certificate/${certificateId}`);
    const title = encodeURIComponent(`I completed ${courseName} at HALO Business Finance Academy!`);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleContinueLearning = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0">
        {/* Celebration Header */}
        <div className="bg-halo-navy px-6 pt-10 pb-8 text-center relative overflow-hidden">
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(38,40%,53%)] to-transparent" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(38,40%,53%)]/20 border-2 border-[hsl(38,40%,53%)] mb-4">
              <Trophy className="h-10 w-10 text-[hsl(38,40%,53%)]" />
            </div>
            
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-white">
                Course Complete!
              </DialogTitle>
              <DialogDescription className="text-white/80 text-base">
                Congratulations on completing
              </DialogDescription>
            </DialogHeader>
            
            <h3 className="text-lg font-semibold text-[hsl(38,40%,53%)] mt-2">{courseName}</h3>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{totalModules}</p>
              <p className="text-xs text-muted-foreground">Modules</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{totalTimeSpent}</p>
              <p className="text-xs text-muted-foreground">Time Spent</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <p className="text-lg font-bold">{averageScore ? `${averageScore}%` : '—'}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>

          {/* Certificate Badge */}
          {certificateId && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 mb-6">
              <Award className="h-8 w-8 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Certificate Earned</p>
                <p className="text-xs text-muted-foreground">Your professional certificate is ready to download and share.</p>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 text-xs">
                Verified
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {certificateId && (
              <div className="flex gap-2">
                <Button onClick={handleViewCertificate} className="flex-1 bg-halo-navy hover:bg-halo-navy/90">
                  <Download className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <Button variant="outline" size="icon" onClick={handleShareLinkedIn} title="Share on LinkedIn">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={handleContinueLearning} className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
