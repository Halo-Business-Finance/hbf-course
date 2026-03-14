import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  user_id: string;
  data?: any;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      logger.error('Error fetching notifications', error, { component: 'useNotifications' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      logger.error('Error marking notification as read', error, { component: 'useNotifications' });
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user || unreadCount === 0) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      logger.error('Error marking all as read', error, { component: 'useNotifications' });
    }
  }, [user, unreadCount]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      logger.error('Error deleting notification', error, { component: 'useNotifications' });
    }
  }, [user]);

  const clearAll = useCallback(async () => {
    if (!user) return;
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      setNotifications([]);
    } catch (error) {
      logger.error('Error clearing notifications', error, { component: 'useNotifications' });
    }
  }, [user]);

  const sendNotification = useCallback(async (params: {
    title: string;
    message: string;
    type?: string;
    data?: any;
  }) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: params.title,
          message: params.message,
          type: params.type || 'info',
          data: params.data || null,
        });

      if (error) throw error;
      // Realtime subscription will pick it up
    } catch (error) {
      logger.error('Error sending notification', error, { component: 'useNotifications' });
    }
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    let channel: any = null;

    try {
      channel = supabase
        .channel(`notifications-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const newNotif = payload.new as AppNotification;
          setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const deletedId = (payload.old as any)?.id;
          if (deletedId) {
            setNotifications(prev => prev.filter(n => n.id !== deletedId));
          }
        })
        .subscribe();
    } catch (error) {
      logger.warn('Failed to subscribe to notifications realtime', { component: 'useNotifications' });
    }

    return () => {
      if (channel) {
        try { supabase.removeChannel(channel); } catch {}
      }
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    sendNotification,
  };
}
