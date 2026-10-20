'use client';

import React from 'react';

interface AppHeaderProps {
  user: {
    name: string;
    division: string;
    motto: string;
    pfpType: string;
    pfpValue: string;
  };
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export default function AppHeader({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
}: AppHeaderProps) {
  return (
    <header className="px-4 py-3 theme-header backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-20 transition-colors">
      <div
        className="flex items-center space-x-2.5 cursor-pointer active:opacity-80 transition"
        onClick={onOpenSettings}
        title="Tap to change avatar & settings"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center text-lg shadow-xs">
          {user.pfpType === 'image' && user.pfpValue ? (
            <img src={user.pfpValue} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user.pfpValue || '🦉'}</span>
          )}
        </div>
        <div>
          <div className="text-xs font-bold theme-text-main flex items-center gap-1.5 leading-none">
            <span>{user.name}</span>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[9px] rounded-full font-bold border border-slate-200/80 dark:border-zinc-700/60">
              {user.division}
            </span>
          </div>
          <p className="text-[10px] theme-text-muted mt-1 truncate max-w-[150px]">
            🎯 {user.motto}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 active:scale-95 transition"
          title="Alerts"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full text-[8px] font-extrabold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 active:scale-95 transition"
          title="App Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
