import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  { value: 'mon', label: 'Mon', index: 1 },
  { value: 'tue', label: 'Tue', index: 2 },
  { value: 'wed', label: 'Wed', index: 3 },
  { value: 'thu', label: 'Thu', index: 4 },
  { value: 'fri', label: 'Fri', index: 5 },
  { value: 'sat', label: 'Sat', index: 6 },
  { value: 'sun', label: 'Sun', index: 0 },
];

const dayToIndex: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

function loadSettings(): ReminderSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return defaultSettings;
}

function saveSettings(settings: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function StudyReminder() {
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFiredRef = useRef<string>('');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Core: schedule checker that fires notifications at the right time
  const startScheduler = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      const current = loadSettings();
      if (!current.enabled) return;

      const now = new Date();
      const currentDay = now.getDay(); // 0=Sun
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:00`;
      const todayKey = `${now.toDateString()}-${currentTime}`;

      // Check if today is a selected day and current hour matches
      const isTodaySelected = current.days.some(d => dayToIndex[d] === currentDay);

      if (isTodaySelected && currentTime === current.time && lastFiredRef.current !== todayKey) {
        lastFiredRef.current = todayKey;

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('📚 Time to Study!', {
            body: 'Your scheduled study session is starting now. Keep your streak going!',
            icon: '/favicon.ico',
          });
        }

        toast.info('📚 Time to study! Your scheduled session is now.', { duration: 10000 });
      }
    }, 30_000); // check every 30 seconds
  }, []);

  // Start/stop scheduler based on enabled state
  useEffect(() => {
    if (settings.enabled) {
      startScheduler();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [settings.enabled, startScheduler]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      toast.success('Notifications enabled!');
      return true;
    } else {
      toast.error('Notification permission denied');
      return false;
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    saveSettings(newSettings);

    if (enabled) {
      toast.success('Study reminders enabled!');
    } else {
      toast.info('Study reminders disabled');
    }
  };

  const handleTimeChange = (time: string) => {
    const newSettings = { ...settings, time };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleDayToggle = (day: string) => {
    const newDays = settings.days.includes(day)
      ? settings.days.filter(d => d !== day)
      : [...settings.days, day];

    const newSettings = { ...settings, days: newDays };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Study Reminders</h3>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={handleToggle}
            aria-label="Enable study reminders"
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Remind me at
              </Label>
              <Select value={settings.time} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                On these days
              </Label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map(day => (
                  <Button
                    key={day.value}
                    variant={settings.days.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(day.value)}
                    className="w-10"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              You'll receive a browser notification at the scheduled time. Keep this tab open for reminders to work.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
