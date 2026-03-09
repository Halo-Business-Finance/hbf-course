import { useState } from "react";
import {
  Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle,
  Trophy, BookOpen, Trash2, CheckCheck, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  success: { icon: CheckCircle, color: "text-emerald-500", label: "Success" },
  warning: { icon: AlertTriangle, color: "text-halo-orange", label: "Warning" },
  error: { icon: AlertCircle, color: "text-destructive", label: "Alert" },
  achievement: { icon: Trophy, color: "text-amber-500", label: "Achievement" },
  course: { icon: BookOpen, color: "text-halo-navy", label: "Course" },
  info: { icon: Info, color: "text-primary", label: "Info" },
};

function NotificationIcon({ type }: { type: string }) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;
  return <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} />;
}

function RelativeTime({ date }: { date: string }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </span>
  );
}

function NotificationItem({
  notification,
  onRead,
  onDelete,
  onClick,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/60",
        !notification.read && "bg-primary/[0.04]"
      )}
      onClick={onClick}
    >
      <div className="mt-0.5">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug line-clamp-1", !notification.read ? "font-semibold text-foreground" : "text-foreground/80")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 rounded-full bg-halo-navy flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <RelativeTime date={notification.created_at} />
      </div>
      {/* Actions on hover */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onRead(); }}
            title="Mark as read"
          >
            <CheckCircle className="h-3 w-3 text-muted-foreground" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Bell className="h-6 w-6 opacity-40" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (notification: AppNotification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.data?.action_url) {
      window.location.assign(notification.data.action_url);
    }
    setIsOpen(false);
  };

  const filterByTab = (tab: string) => {
    if (tab === "unread") return notifications.filter(n => !n.read);
    return notifications;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Notifications"
          className="relative h-10 w-10 text-foreground hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold min-w-[20px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0 shadow-xl border-border" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b h-9 bg-transparent px-2">
            <TabsTrigger
              value="all"
              className="text-xs rounded-sm data-[state=active]:bg-muted data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-xs rounded-sm data-[state=active]:bg-muted data-[state=active]:shadow-none"
            >
              Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </TabsTrigger>
          </TabsList>

          {["all", "unread"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              <ScrollArea className="h-[360px]">
                {loading ? (
                  <div className="space-y-1 p-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : filterByTab(tab).length === 0 ? (
                  <EmptyState
                    message={tab === "unread" ? "You're all caught up!" : "No notifications yet"}
                  />
                ) : (
                  <div className="divide-y divide-border/50">
                    <AnimatePresence mode="popLayout">
                      {filterByTab(tab).map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onRead={() => markAsRead(notification.id)}
                          onDelete={() => deleteNotification(notification.id)}
                          onClick={() => handleClick(notification)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
