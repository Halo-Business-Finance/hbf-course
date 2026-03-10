import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlayCircle, Clock, BookOpen, Bell, ChevronDown } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/* ── Study-reminder persistence ── */
interface ReminderSettings {
  enabled: boolean;
  time: string;
  days: string[];
}

const STORAGE_KEY = 'study-reminder-settings';

const defaultSettings: ReminderSettings = {
  enabled: false,
  time: '09:00',
  days: ['mon', 'tue', 'wed', 'thu', 'fri']
};

const dayOptions = [
{ value: 'mon', label: 'Mon' },
{ value: 'tue', label: 'Tue' },
{ value: 'wed', label: 'Wed' },
{ value: 'thu', label: 'Thu' },
{ value: 'fri', label: 'Fri' },
{ value: 'sat', label: 'Sat' },
{ value: 'sun', label: 'Sun' }];


const dayToIndex: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
};

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

function loadSettings(): ReminderSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {/* ignore */}
  return defaultSettings;
}

function saveSettings(s: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

/* ── Last-activity fetcher ── */
interface LastActivity {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  progress: number;
  lastAccessed: string;
}

export function QuickResumeReminder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* resume state */
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);

  /* reminder state */
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>('default');
  const [reminderOpen, setReminderOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFiredRef = useRef('');

  /* ── Fetch last activity ── */
  useEffect(() => {
    (async () => {
      if (!user) {setLoadingResume(false);return;}
      try {
        const { data: progressData } = await supabase.
        from('course_progress').
        select('course_id, module_id, progress_percentage, updated_at').
        eq('user_id', user.id).
        order('updated_at', { ascending: false }).
        limit(1).
        single();

        if (progressData) {
          const { data: courseData } = await supabase.
          from('courses').select('title').eq('id', progressData.course_id).single();

          let moduleTitle = 'Continue Learning';
          if (progressData.module_id) {
            const { data: moduleData } = await supabase.
            from('course_modules').select('title').eq('module_id', progressData.module_id).single();
            if (moduleData) moduleTitle = moduleData.title;
          }

          setLastActivity({
            courseId: progressData.course_id,
            courseTitle: courseData?.title || 'Course',
            moduleId: progressData.module_id || '',
            moduleTitle,
            progress: progressData.progress_percentage || 0,
            lastAccessed: progressData.updated_at
          });
        }
      } catch (e) {console.error('Error fetching last activity:', e);} finally
      {setLoadingResume(false);}
    })();
  }, [user]);

  /* ── Notification permission ── */
  useEffect(() => {
    if ('Notification' in window) setNotifPerm(Notification.permission);
  }, []);

  /* ── Scheduler ── */
  const startScheduler = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const cur = loadSettings();
      if (!cur.enabled) return;
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:00`;
      const todayKey = `${now.toDateString()}-${currentTime}`;
      const isTodaySelected = cur.days.some((d) => dayToIndex[d] === now.getDay());
      if (isTodaySelected && currentTime === cur.time && lastFiredRef.current !== todayKey) {
        lastFiredRef.current = todayKey;
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('📚 Time to Study!', { body: 'Your scheduled study session is starting now.', icon: '/favicon.ico' });
        }
        toast.info('📚 Time to study! Your scheduled session is now.', { duration: 10000 });
      }
    }, 30_000);
  }, []);

  useEffect(() => {
    if (settings.enabled) startScheduler();else
    if (intervalRef.current) {clearInterval(intervalRef.current);intervalRef.current = null;}
    return () => {if (intervalRef.current) {clearInterval(intervalRef.current);intervalRef.current = null;}};
  }, [settings.enabled, startScheduler]);

  /* ── Handlers ── */
  const handleResume = () => {
    if (lastActivity?.moduleId) navigate(`/module/${lastActivity.moduleId}`);else
    if (lastActivity?.courseId) navigate('/courses');
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {toast.error('Notifications not supported');return false;}
    const p = await Notification.requestPermission();
    setNotifPerm(p);
    if (p === 'granted') {toast.success('Notifications enabled!');return true;}
    toast.error('Permission denied');return false;
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled && notifPerm !== 'granted') {if (!(await requestPermission())) return;}
    const ns = { ...settings, enabled };
    setSettings(ns);saveSettings(ns);
    toast[enabled ? 'success' : 'info'](enabled ? 'Study reminders enabled!' : 'Study reminders disabled');
  };

  const handleTimeChange = (time: string) => {const ns = { ...settings, time };setSettings(ns);saveSettings(ns);};
  const handleDayToggle = (day: string) => {
    const newDays = settings.days.includes(day) ? settings.days.filter((d) => d !== day) : [...settings.days, day];
    const ns = { ...settings, days: newDays };setSettings(ns);saveSettings(ns);
  };

  const formatTimeAgo = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hrs > 0) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  /* ── Loading skeleton ── */
  if (loadingResume) {
    return <div className="animate-pulse mt-6"><div className="h-28 bg-white/5 rounded-lg" /></div>;
  }

  /* ── No activity yet ── */
  if (!lastActivity) {
    return null;
  }

  /* ── Combined widget ── */
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black text-white">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide mb-1 font-semibold text-white">
              Continue where you left off
            </p>
            <h3 className="font-semibold text-lg line-clamp-1 text-white">
              {lastActivity.courseTitle}
            </h3>
            <p className="text-sm line-clamp-1 text-white">
              {lastActivity.moduleTitle}
            </p>
          </div>
          <Button
            onClick={handleResume}
            size="lg"
            className="gap-2 shrink-0 bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all">
            
            <PlayCircle className="w-5 h-5" />
            Resume
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white">Progress</span>
            <span className="font-semibold text-white">{Math.round(lastActivity.progress)}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-halo-navy to-halo-orange rounded-full transition-all duration-700"
              style={{ width: `${lastActivity.progress}%` }} />
            
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-white/50">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-white">Last studied {formatTimeAgo(lastActivity.lastAccessed)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <Collapsible open={reminderOpen} onOpenChange={setReminderOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full px-4 sm:px-5 py-3 text-sm hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-halo-orange" />
                <span className="font-medium text-white">Study Reminders</span>
                {settings.enabled &&
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/80 px-1.5 py-0.5 rounded">
                    On · {settings.time}
                  </span>
                }
              </div>
              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${reminderOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 sm:px-5 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/60">Enable reminders</Label>
                <Switch checked={settings.enabled} onCheckedChange={handleToggle} aria-label="Enable study reminders" />
              </div>

              {settings.enabled &&
              <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <Label className="flex items-center gap-2 text-sm text-white/60">
                      <Clock className="w-4 h-4" />
                      Remind at
                    </Label>
                    <Select value={settings.time} onValueChange={handleTimeChange}>
                      <SelectTrigger className="w-24 border-white/20 text-white bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((opt) =>
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-white/60 mb-2 block">On these days</Label>
                    <div className="flex flex-wrap gap-2">
                      {dayOptions.map((day) =>
                    <Button
                      key={day.value}
                      variant={settings.days.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleDayToggle(day.value)}
                      className={`w-10 ${!settings.days.includes(day.value) ? 'border-white/20 text-white/70 hover:bg-white/10' : ''}`}>
                      
                          {day.label}
                        </Button>
                    )}
                    </div>
                  </div>

                  <p className="text-xs text-white/40">
                    You'll receive a browser notification at the scheduled time. Keep this tab open for reminders to work.
                  </p>
                </div>
              }
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>);

}