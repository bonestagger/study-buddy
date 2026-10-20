'use client';

import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: () => void;
}

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notifDrawer" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="theme-card border-t rounded-t-3xl p-4 max-h-[70%] overflow-y-auto space-y-3">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <h3 className="text-xs font-extrabold theme-text-main flex items-center gap-1.5">
            <span>🔔 Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[9px] rounded-full font-bold border border-black dark:border-white font-mono">
                {unreadCount} new
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkRead}
                className="text-[10px] accent-text font-bold hover:underline"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="theme-text-muted hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {notifications.length === 0 ? (
            <p className="text-center text-xs theme-text-muted py-4">No notifications yet!</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border-2 border-black dark:border-white shadow-[1px_1px_0px_#000] dark:shadow-[1px_1px_0px_#FFF] flex items-start gap-2.5 ${
                  n.type === 'HOMEWORK_DUE'
                    ? 'bg-neutral-100 dark:bg-neutral-900'
                    : 'theme-subtle'
                }`}
              >
                <span className="text-base">
                  {n.type === 'HOMEWORK_DUE' ? '⏰' : n.type === 'ANSWERED' ? '💡' : '🎉'}
                </span>
                <div>
                  <p className="font-extrabold text-[11px] theme-text-main flex items-center gap-1.5">
                    <span>{n.title}</span>
                    {n.type === 'HOMEWORK_DUE' && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black font-mono">DUE</span>
                    )}
                  </p>
                  <p className="text-[10px] theme-text-muted mt-0.5">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
