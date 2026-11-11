'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDateShort } from '@/lib/utils';
import {
  Bell,
  CheckCircle2,
  Clock,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'dev-user-1';

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifs();
  }, [userId]);

  const loadNotifs = () => {
    setNotifications(dataStore.getNotifications(userId));
  };

  const handleMarkAsRead = (id: string) => {
    dataStore.markNotificationAsRead(userId, id);
    loadNotifs();
  };

  const handleMarkAllRead = () => {
    dataStore.markAllNotificationsRead(userId);
    loadNotifs();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'team_invitation':
      case 'collaboration_request':
        return <Users className="w-4 h-4 text-violet-400" />;
      case 'deadline_approaching':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'application_updated':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2044]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Notification Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deadlines, team invitations, and status alerts for your opportunities.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-1.5 text-xs"
          >
            <Check className="w-3.5 h-3.5" /> Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                notif.is_read
                  ? 'bg-[#111225] border-[#1e2044] text-slate-400'
                  : 'bg-[#151633] border-blue-500/30 text-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#0a0b14] border border-[#1e2044] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>{formatDateShort(notif.created_at)}</span>
                    {notif.link && (
                      <Link
                        href={notif.link}
                        className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-xs text-slate-400 hover:text-white shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="No notifications yet"
          description="When you receive collaboration requests or your deadlines are approaching, they will appear here."
        />
      )}
    </div>
  );
}

