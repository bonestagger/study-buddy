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
    <header className="px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-20 transition-colors sticky top-0">
      <div
        className="flex items-center space-x-3 cursor-pointer active:opacity-80 transition"
        onClick={onOpenSettings}
        title="Tap to change avatar & settings"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-200 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center text-xl shadow-xs">
          {user.pfpType === 'image' && user.pfpValue ? (
            <img src={user.pfpValue} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user.pfpValue || '🦉'}</span>
          )}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 leading-none">
            <span>{user.name}</span>
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-bold border border-blue-200/80 dark:border-zinc-700">
              {user.division}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 truncate max-w-[200px]">
            🎯 {user.motto}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
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
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
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
